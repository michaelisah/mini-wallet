<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransferRequest;
use App\Models\Transaction;
use App\Models\User;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    protected $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Get the authenticated user's transaction history.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Transaction::query()
            ->where('sender_id', $user->id)
            ->orWhere('recipient_id', $user->id);

        // Apply filters
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $transactions = $query
            ->with(['sender', 'recipient'])
            ->paginate($request->get('per_page', 15));

        return response()->json([
            'balance'      => $user->balance,
            'transactions' => $transactions
        ]);
    }

    /**
     * Create a new money transfer.
     */
    public function store(TransferRequest $request)
    {
        try {
            $sender = $request->user();
            $recipient = User::query()->findOrFail($request->recipient_id);

            $transaction = $this->transactionService->transfer(
                $sender,
                $recipient,
                (float) $request->amount,
                $request->description
            );

            return response()->json([
                'message'     => 'Transfer successful',
                'transaction' => $transaction->load(['sender', 'recipient']),
                'new_balance' => $sender->fresh()->balance
            ]);

        } catch (\Exception $e) {
            Log::error('Transfer failed: ' . $e->getMessage());

            return response()->json([
                'message' => $e->getMessage(),
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get a specific transaction by ID.
     */
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $transaction = Transaction::query()
            ->where('id', $id)
            ->where(function($query) use ($user) {
                $query->where('sender_id', $user->id)
                      ->orWhere('recipient_id', $user->id);
            })
            ->with(['sender', 'recipient'])
            ->firstOrFail();

        return response()->json($transaction);
    }

    /**
     * Get transaction statistics for the authenticated user.
     */
    public function stats(Request $request)
    {
        $user = $request->user();
        $stats = $this->transactionService->getUserStats($user);

        return response()->json($stats);
    }
}

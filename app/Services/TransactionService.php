<?php

namespace App\Services;

use App\Events\MoneyTransferred;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class TransactionService
{
    /**
     * Process a money transfer between users.
     *
     * @param User $sender
     * @param User $recipient
     * @param float $amount
     * @param string|null $description
     * @return Transaction
     * @throws \Exception
     */
    /**
     * Calculate the commission fee for a transaction amount.
     *
     * @param float $amount
     * @return float
     */
    public function calculateCommissionFee(float $amount): float
    {
        $feePercentage = (float) config('services.transaction.fee_percentage', 1.5);
        return round(($amount * $feePercentage) / 100, 2);
    }

    /**
     * Process a money transfer between users.
     *
     * @param User $sender
     * @param User $recipient
     * @param float $amount
     * @param string|null $description
     * @return Transaction
     * @throws \Exception
     */
    public function transfer(User $sender, User $recipient, float $amount, ?string $description = null): Transaction
    {
        // Calculate commission fee
        $commissionFee = $this->calculateCommissionFee($amount);
        $totalDeduction = $amount + $commissionFee;

        // Validate sufficient balance (amount + fee)
        if ($sender->balance < $totalDeduction) {
            throw new \Exception('Insufficient balance to cover the transfer amount and fee');
        }

        // Prevent self-transfer
        if ($sender->id === $recipient->id) {
            throw new \Exception('Cannot transfer to yourself');
        }

        return DB::transaction(function () use ($sender, $recipient, $amount, $commissionFee, $totalDeduction, $description) {
            // Lock the user records to prevent race conditions
            $sender = User::where('id', $sender->id)->lockForUpdate()->first();
            $recipient = User::where('id', $recipient->id)->lockForUpdate()->first();

            // Double-check balance after lock
            if ($sender->balance < $totalDeduction) {
                throw new \Exception('Insufficient balance to cover the transfer amount and fee');
            }

            // Update sender's balance (deduct amount + fee)
            $sender->decrement('balance', $totalDeduction);
            $sender->refresh();

            // Update recipient's balance (add only the amount, not the fee)
            $recipient->increment('balance', $amount);
            $recipient->refresh();

            // Generate unique reference
            $reference = $this->generateReference();

            // Create transaction record
            $transaction = Transaction::create([
                'sender_id'    => $sender->id,
                'recipient_id' => $recipient->id,
                'amount'       => $amount,
                'commission_fee' => $commissionFee,
                'description'  => $description,
                'type'         => Transaction::TYPE_DEBIT,
                'status'       => Transaction::STATUS_COMPLETED,
                'reference'    => $reference,
                'sender_balance_after'    => $sender->balance,
                'recipient_balance_after' => $recipient->balance,
                'completed_at'            => now(),
            ]);

            Log::info('Transaction completed', [
                'transaction_id' => $transaction->id,
                'amount' => $amount,
                'fee' => $commissionFee,
                'sender_id' => $sender->id,
                'recipient_id' => $recipient->id
            ]);

            // Dispatch the MoneyTransferred event
            event(new MoneyTransferred($transaction));

            return $transaction;
        });
    }

    /**
     * Generate a unique transaction reference.
     *
     * @return string
     */
    protected function generateReference(): string
    {
        do {
            $reference = 'TXN-' . strtoupper(Str::random(10)) . '-' . time();
        } while (Transaction::where('reference', $reference)->exists());

        return $reference;
    }

    /**
     * Get user transaction statistics.
     *
     * @param User $user
     * @return array
     */
    public function getUserStats(User $user): array
    {
        $totalSent = Transaction::where('sender_id', $user->id)
            ->where('status', Transaction::STATUS_COMPLETED)
            ->sum('amount');

        $totalReceived = Transaction::where('recipient_id', $user->id)
            ->where('status', Transaction::STATUS_COMPLETED)
            ->sum('amount');

        $transactionCount = Transaction::where(function($query) use ($user) {
            $query->where('sender_id', $user->id)
                  ->orWhere('recipient_id', $user->id);
        })->count();

        return [
            'balance'           => $user->balance,
            'total_sent'        => $totalSent,
            'total_received'    => $totalReceived,
            'transaction_count' => $transactionCount,
        ];
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users');
            $table->foreignId('recipient_id')->constrained('users');
            $table->decimal('amount', 15, 2);
            $table->decimal('commission_fee', 15, 2)->default(0);
            $table->string('description')->nullable();
            $table->enum('type', ['debit', 'credit']);
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->string('reference')->unique();
            $table->decimal('sender_balance_after', 15, 2);
            $table->decimal('recipient_balance_after', 15, 2)->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            // Indexes for better query performance
            $table->index('sender_id');
            $table->index('recipient_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};

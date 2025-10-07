<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TransferRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'recipient_id' => 'required|exists:users,id|different:' . $this->user()->id,
            'amount'       => 'required|numeric|min:0.01|max:1000000',
            'description'  => 'nullable|string|max:255',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'recipient_id.required'  => 'Please select a recipient.',
            'recipient_id.exists'    => 'The selected recipient does not exist.',
            'recipient_id.different' => 'You cannot send money to yourself.',
            'amount.required'        => 'Please enter an amount.',
            'amount.numeric'         => 'The amount must be a valid number.',
            'amount.min'             => 'The minimum transfer amount is ₦0.01.',
            'amount.max'             => 'The maximum transfer amount is ₦1,000,000.',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockMovementRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user() && auth()->user()->canUpdateStock();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'medication_id' => 'required|exists:medications,id',
            'type' => 'required|in:incoming,outgoing',
            'quantity' => 'required|integer|min:1',
            'reason' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'reference_number' => 'nullable|string|max:255',
            'movement_date' => 'required|date',
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
            'medication_id.required' => 'Obat wajib dipilih.',
            'medication_id.exists' => 'Obat yang dipilih tidak valid.',
            'type.required' => 'Jenis pergerakan stok wajib dipilih.',
            'type.in' => 'Jenis pergerakan stok harus masuk atau keluar.',
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.min' => 'Jumlah minimal 1.',
            'reason.required' => 'Alasan pergerakan stok wajib diisi.',
            'movement_date.required' => 'Tanggal pergerakan wajib diisi.',
        ];
    }
}
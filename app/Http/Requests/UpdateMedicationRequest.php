<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user() && auth()->user()->canManageMedications();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'generic_name' => 'nullable|string|max:255',
            'brand_name' => 'nullable|string|max:255',
            'dosage_form' => 'required|string|max:255',
            'strength' => 'required|string|max:255',
            'manufacturer' => 'nullable|string|max:255',
            'batch_number' => 'nullable|string|max:255',
            'expiry_date' => 'nullable|date',
            'current_stock' => 'required|integer|min:0',
            'minimum_stock' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
            'storage_conditions' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
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
            'name.required' => 'Nama obat wajib diisi.',
            'dosage_form.required' => 'Bentuk sediaan obat wajib diisi.',
            'strength.required' => 'Kekuatan obat wajib diisi.',
            'current_stock.required' => 'Stok saat ini wajib diisi.',
            'current_stock.min' => 'Stok tidak boleh kurang dari 0.',
            'minimum_stock.required' => 'Stok minimum wajib diisi.',
            'minimum_stock.min' => 'Stok minimum minimal 1.',
            'unit_price.required' => 'Harga satuan wajib diisi.',
            'unit_price.min' => 'Harga tidak boleh kurang dari 0.',
        ];
    }
}
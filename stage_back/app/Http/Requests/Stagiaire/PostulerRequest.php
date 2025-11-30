<?php

namespace App\Http\Requests\Stagiaire;

use Illuminate\Foundation\Http\FormRequest;

class PostulerRequest extends FormRequest
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
            'offre_id' => 'required|exists:offres,id',
            'lettre_motivation' => 'required|string|min:100|max:5000'
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'offre_id.required' => 'L\'offre est requise.',
            'offre_id.exists' => 'L\'offre sélectionnée n\'existe pas.',
            'lettre_motivation.required' => 'La lettre de motivation est requise.',
            'lettre_motivation.min' => 'La lettre de motivation doit contenir au moins 100 caractères.',
            'lettre_motivation.max' => 'La lettre de motivation ne peut pas dépasser 5000 caractères.'
        ];
    }
}
<?php

namespace App\Http\Requests\Stagiaire;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRapportRequest extends FormRequest
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
            'titre' => 'sometimes|string|min:5|max:255',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:intermediaire,final',
            'fichier' => [
                'nullable',
                'file',
                'mimes:pdf',
                'max:10240', // 10MB
                function ($attribute, $value, $fail) {
                    if ($value) {
                        // Vérifier le MIME type réel
                        $finfo = finfo_open(FILEINFO_MIME_TYPE);
                        $mimeType = finfo_file($finfo, $value->path());
                        finfo_close($finfo);
                        
                        if ($mimeType !== 'application/pdf') {
                            $fail('Le fichier doit être un PDF valide.');
                        }
                    }
                },
            ]
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
            'titre.min' => 'Le titre doit contenir au moins 5 caractères.',
            'type.in' => 'Le type doit être "intermédiaire" ou "final".',
            'fichier.mimes' => 'Le fichier doit être un PDF.',
            'fichier.max' => 'Le fichier ne peut pas dépasser 10 Mo.'
        ];
    }
}

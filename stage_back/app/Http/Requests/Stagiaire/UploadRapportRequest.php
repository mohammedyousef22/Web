<?php

namespace App\Http\Requests\Stagiaire;

use Illuminate\Foundation\Http\FormRequest;

class UploadRapportRequest extends FormRequest
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
            'type' => 'required|in:intermediaire,final',
            'titre' => 'required|string|min:5|max:255',
            'fichier' => [
                'required',
                'file',
                'mimes:pdf',
                'max:10240', // 10MB
                function ($attribute, $value, $fail) {
                    // Vérifier le MIME type réel
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $mimeType = finfo_file($finfo, $value->path());
                    finfo_close($finfo);
                    
                    if ($mimeType !== 'application/pdf') {
                        $fail('Le fichier doit être un PDF valide.');
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
            'type.required' => 'Le type de rapport est requis.',
            'type.in' => 'Le type doit être "intermédiaire" ou "final".',
            'titre.required' => 'Le titre est requis.',
            'titre.min' => 'Le titre doit contenir au moins 5 caractères.',
            'fichier.required' => 'Le fichier est requis.',
            'fichier.mimes' => 'Le fichier doit être un PDF.',
            'fichier.max' => 'Le fichier ne peut pas dépasser 10 Mo.'
        ];
    }
}
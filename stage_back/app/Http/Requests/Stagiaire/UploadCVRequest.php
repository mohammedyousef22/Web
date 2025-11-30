<?php

namespace App\Http\Requests\Stagiaire;

use Illuminate\Foundation\Http\FormRequest;

class UploadCVRequest extends FormRequest
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
            'cv' => [
                'required',
                'file',
                'mimes:pdf',
                'max:5120', // 5MB
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
            'cv.required' => 'Le CV est requis.',
            'cv.file' => 'Le CV doit être un fichier.',
            'cv.mimes' => 'Le CV doit être un fichier PDF.',
            'cv.max' => 'Le CV ne peut pas dépasser 5 Mo.'
        ];
    }
}
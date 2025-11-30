<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload un CV
     */
    public static function uploadCV(UploadedFile $file, $userId)
    {
        $filename = 'cv_' . time() . '.pdf';
        $path = "cv/{$userId}/{$filename}";
        
        Storage::disk('public')->put($path, file_get_contents($file));
        
        return $path;
    }

    /**
     * Upload un rapport
     */
    public static function uploadRapport(UploadedFile $file, $stageId, $type)
    {
        $filename = "{$type}_" . time() . '.pdf';
        $path = "rapports/{$stageId}/{$filename}";
        
        Storage::disk('public')->put($path, file_get_contents($file));
        
        return $path;
    }

    /**
     * Supprimer un fichier
     */
    public static function deleteFile($path)
    {
        if ($path && Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        
        return false;
    }

    /**
     * Vérifier le type MIME réel d'un fichier
     */
    public static function verifierMimeType(UploadedFile $file, array $allowedTypes)
    {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file->path());
        finfo_close($finfo);
        
        return in_array($mimeType, $allowedTypes);
    }
}
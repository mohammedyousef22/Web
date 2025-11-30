<?php

if (!function_exists('formatDuree')) {
    /**
     * Formater une durée en jours vers un format lisible
     * 
     * @param int $jours
     * @return string
     */
    function formatDuree($jours)
    {
        if ($jours < 7) {
            return $jours . ' ' . ($jours > 1 ? 'jours' : 'jour');
        } elseif ($jours < 30) {
            $semaines = round($jours / 7);
            return $semaines . ' ' . ($semaines > 1 ? 'semaines' : 'semaine');
        } else {
            $mois = round($jours / 30);
            return $mois . ' mois';
        }
    }
}

if (!function_exists('generateTempPassword')) {
    /**
     * Générer un mot de passe temporaire sécurisé
     * 
     * @param int $length
     * @return string
     */
    function generateTempPassword($length = 12)
    {
        $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $lowercase = 'abcdefghijklmnopqrstuvwxyz';
        $numbers = '0123456789';
        $special = '!@#$%^&*';

        $password = '';
        $password .= $uppercase[random_int(0, strlen($uppercase) - 1)];
        $password .= $lowercase[random_int(0, strlen($lowercase) - 1)];
        $password .= $numbers[random_int(0, strlen($numbers) - 1)];
        $password .= $special[random_int(0, strlen($special) - 1)];

        $all = $uppercase . $lowercase . $numbers . $special;
        
        for ($i = 4; $i < $length; $i++) {
            $password .= $all[random_int(0, strlen($all) - 1)];
        }

        return str_shuffle($password);
    }
}

if (!function_exists('formatStatut')) {
    /**
     * Formater un statut en français
     * 
     * @param string $statut
     * @return string
     */
    function formatStatut($statut)
    {
        $labels = [
            // Candidatures
            'en_attente' => 'En attente',
            'accepte' => 'Acceptée',
            'refuse' => 'Refusée',
            
            // Stages
            'en_cours' => 'En cours',
            'termine' => 'Terminé',
            'interrompu' => 'Interrompu',
            
            // Offres
            'ouvert' => 'Ouvert',
            'ferme' => 'Fermé',
            
            // Rapports
            'valide' => 'Validé',
            'a_corriger' => 'À corriger',
        ];

        return $labels[$statut] ?? ucfirst(str_replace('_', ' ', $statut));
    }
}

if (!function_exists('formatDate')) {
    /**
     * Formater une date en français
     * 
     * @param string|\DateTime $date
     * @param string $format
     * @return string
     */
    function formatDate($date, $format = 'd/m/Y')
    {
        if (!$date) {
            return '-';
        }

        if (is_string($date)) {
            $date = new \DateTime($date);
        }

        return $date->format($format);
    }
}

if (!function_exists('formatDateHeure')) {
    /**
     * Formater une date avec heure en français
     * 
     * @param string|\DateTime $date
     * @return string
     */
    function formatDateHeure($date)
    {
        return formatDate($date, 'd/m/Y H:i');
    }
}

if (!function_exists('calculateProgress')) {
    /**
     * Calculer la progression d'un stage en pourcentage
     * 
     * @param string $dateDebut
     * @param string $dateFin
     * @return float
     */
    function calculateProgress($dateDebut, $dateFin)
    {
        $debut = new \DateTime($dateDebut);
        $fin = new \DateTime($dateFin);
        $now = new \DateTime();

        if ($now < $debut) {
            return 0;
        }

        if ($now > $fin) {
            return 100;
        }

        $total = $fin->diff($debut)->days;
        $elapsed = $now->diff($debut)->days;

        return round(($elapsed / $total) * 100, 2);
    }
}

if (!function_exists('joursRestants')) {
    /**
     * Calculer les jours restants jusqu'à une date
     * 
     * @param string|\DateTime $date
     * @return int
     */
    function joursRestants($date)
    {
        if (is_string($date)) {
            $date = new \DateTime($date);
        }

        $now = new \DateTime();
        $diff = $now->diff($date);

        return $diff->invert ? 0 : $diff->days;
    }
}

if (!function_exists('sanitizeFilename')) {
    /**
     * Nettoyer un nom de fichier
     * 
     * @param string $filename
     * @return string
     */
    function sanitizeFilename($filename)
    {
        // Retirer l'extension
        $extension = pathinfo($filename, PATHINFO_EXTENSION);
        $name = pathinfo($filename, PATHINFO_FILENAME);

        // Remplacer les caractères spéciaux
        $name = preg_replace('/[^A-Za-z0-9\-_]/', '_', $name);
        $name = preg_replace('/_+/', '_', $name);
        $name = trim($name, '_');

        return $name . '.' . $extension;
    }
}

if (!function_exists('generateUniqueFilename')) {
    /**
     * Générer un nom de fichier unique
     * 
     * @param string $originalName
     * @param string $prefix
     * @return string
     */
    function generateUniqueFilename($originalName, $prefix = '')
    {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $timestamp = time();
        $random = substr(md5(uniqid(rand(), true)), 0, 8);
        
        $filename = $prefix ? "{$prefix}_{$timestamp}_{$random}" : "{$timestamp}_{$random}";
        
        return "{$filename}.{$extension}";
    }
}

if (!function_exists('getFileSize')) {
    /**
     * Obtenir la taille d'un fichier formatée
     * 
     * @param string $path
     * @return string
     */
    function getFileSize($path)
    {
        if (!file_exists($path)) {
            return '-';
        }

        $bytes = filesize($path);
        $units = ['B', 'KB', 'MB', 'GB'];
        
        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}

if (!function_exists('jsonResponse')) {
    /**
     * Créer une réponse JSON standardisée
     * 
     * @param bool $success
     * @param mixed $data
     * @param string $message
     * @param int $status
     * @return \Illuminate\Http\JsonResponse
     */
    function jsonResponse($success = true, $data = null, $message = '', $status = 200)
    {
        $response = [
            'success' => $success,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        if ($message) {
            $response['message'] = $message;
        }

        return response()->json($response, $status);
    }
}

if (!function_exists('errorResponse')) {
    /**
     * Créer une réponse d'erreur JSON
     * 
     * @param string $message
     * @param mixed $errors
     * @param int $status
     * @return \Illuminate\Http\JsonResponse
     */
    function errorResponse($message = 'Une erreur est survenue', $errors = null, $status = 400)
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $status);
    }
}

if (!function_exists('successResponse')) {
    /**
     * Créer une réponse de succès JSON
     * 
     * @param mixed $data
     * @param string $message
     * @param int $status
     * @return \Illuminate\Http\JsonResponse
     */
    function successResponse($data = null, $message = 'Opération réussie', $status = 200)
    {
        return jsonResponse(true, $data, $message, $status);
    }
}

if (!function_exists('getNiveauEtudeLabel')) {
    /**
     * Obtenir le label d'un niveau d'étude
     * 
     * @param string $niveau
     * @return string
     */
    function getNiveauEtudeLabel($niveau)
    {
        $labels = [
            'licence' => 'Licence',
            'master' => 'Master',
            'doctorat' => 'Doctorat',
            'ingenieur' => 'Ingénieur',
            'technicien' => 'Technicien',
            'bac' => 'Baccalauréat',
            'bac+1' => 'Bac+1',
            'bac+2' => 'Bac+2',
            'bac+3' => 'Bac+3',
            'bac+4' => 'Bac+4',
            'bac+5' => 'Bac+5',
        ];

        return $labels[$niveau] ?? ucfirst($niveau);
    }
}

if (!function_exists('truncate')) {
    /**
     * Tronquer un texte
     * 
     * @param string $text
     * @param int $length
     * @param string $suffix
     * @return string
     */
    function truncate($text, $length = 100, $suffix = '...')
    {
        if (strlen($text) <= $length) {
            return $text;
        }

        return substr($text, 0, $length) . $suffix;
    }
}

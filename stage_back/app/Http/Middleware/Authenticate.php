<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     * 
     * Pour une API pure, retourner null empêche la redirection et Laravel
     * retournera automatiquement une réponse 401 JSON.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Pour les API, ne jamais rediriger
        return null;
    }
}

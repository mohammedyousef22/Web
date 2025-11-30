<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('candidatures', function (Blueprint $table) {
            $table->id();

            // Foreign key vers offres
            $table->unsignedBigInteger('offre_id');
            $table->foreign('offre_id')
                  ->references('id')->on('offres')
                  ->onDelete('cascade');

            // Foreign key vers stagiaires
            $table->unsignedBigInteger('stagiaire_id');
            $table->foreign('stagiaire_id')
                  ->references('id')->on('stagiaires')
                  ->onDelete('cascade');

            // Contenu
            $table->text('lettre_motivation');

            // Statut de la candidature
            $table->enum('statut', ['en_attente', 'accepte', 'refuse'])->default('en_attente');

            // Dates
            $table->date('date_candidature');
            $table->date('date_reponse')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('candidatures');
    }
};

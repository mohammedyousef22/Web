<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stages', function (Blueprint $table) {
            $table->id();

            // FK vers candidatures (unique)
            $table->unsignedBigInteger('candidature_id')->unique();

            // FK vers encadrants
            $table->unsignedBigInteger('encadrant_id');

            // Dates réelles du stage
            $table->date('date_debut_reelle');
            $table->date('date_fin_reelle');

            // Statut du stage
            $table->enum('statut', ['en_cours', 'termine', 'interrompu'])
                  ->default('en_cours');

            // Note finale & commentaire
            $table->decimal('note_finale', 4, 2)->nullable();
            $table->text('commentaire_final')->nullable();

            // Attestation PDF
            $table->string('attestation_path', 255)->nullable();

            $table->timestamps();

            // Foreign keys
            $table->foreign('candidature_id')
                  ->references('id')->on('candidatures')
                  ->onDelete('cascade');

            $table->foreign('encadrant_id')
                  ->references('id')->on('encadrants')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stages');
    }
};

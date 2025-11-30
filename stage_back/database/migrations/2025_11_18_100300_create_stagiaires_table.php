<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stagiaires', function (Blueprint $table) {
            $table->id();

            // Foreign key vers users
            $table->unsignedBigInteger('user_id')->unique();
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');

            // Informations personnelles
            $table->string('cin', 20)->nullable();
            $table->date('date_naissance')->nullable();
            $table->string('telephone', 20)->nullable();

            // Informations académiques
            $table->string('etablissement', 255);
            $table->string('niveau_etude', 100);
            $table->string('filiere', 100);

            // CV
            $table->string('cv_path', 255)->nullable();

            // Adresse
            $table->text('adresse')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stagiaires');
    }
};

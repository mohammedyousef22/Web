<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rapports', function (Blueprint $table) {
            $table->id();

            // FK vers stages
            $table->unsignedBigInteger('stage_id');

            // Type rapport
            $table->enum('type', ['intermediaire', 'final']);

            // Informations rapport
            $table->string('titre', 255);
            $table->string('fichier_path', 255);
            $table->date('date_depot');

            // Statut de validation
            $table->enum('statut', ['en_attente', 'valide', 'a_corriger'])
                  ->default('en_attente');

            $table->text('commentaire_encadrant')->nullable();
            $table->date('date_validation')->nullable();

            $table->timestamps();

            // Foreign Key
            $table->foreign('stage_id')
                  ->references('id')
                  ->on('stages')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rapports');
    }
};

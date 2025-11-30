<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();

            // Stage lié (unique - une seule évaluation par stage)
            $table->unsignedBigInteger('stage_id')->unique();
            $table->foreign('stage_id')
                  ->references('id')->on('stages')
                  ->onDelete('cascade');

            // Note finale /20 (ex: 17.50)
            $table->decimal('note', 4, 2);

            // Liste compétences acquises (JSON)
            $table->json('competences_acquises')->nullable();

            // Appréciation générale
            $table->text('appreciation');

            // Encadrant (user) ayant créé l'évaluation
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')
                  ->references('id')->on('users')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};

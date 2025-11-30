<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offres', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description');
            $table->foreignId('departement_id')->constrained('departements')->onDelete('cascade');
            $table->integer('duree_jours');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->text('competences_requises');
            $table->integer('nombre_places');
            $table->enum('statut', ['ouvert', 'ferme'])->default('ouvert');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offres');
    }
};

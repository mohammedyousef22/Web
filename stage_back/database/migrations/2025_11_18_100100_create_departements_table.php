<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departements', function (Blueprint $table) {
            $table->id();

            $table->string('nom', 255)->unique();    // Nom du département (unique)
            $table->text('description')->nullable(); // Description détaillée
            $table->string('responsable', 255)->nullable(); // Responsable du département

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('departements');
    }
};

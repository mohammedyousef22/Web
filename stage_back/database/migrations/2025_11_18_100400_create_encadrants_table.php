<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('encadrants', function (Blueprint $table) {
            $table->id();

            // FK vers users (unique)
            $table->unsignedBigInteger('user_id')->unique();

            // FK vers departements
            $table->unsignedBigInteger('departement_id');

            // Spécialité et téléphone
            $table->string('specialite', 255)->nullable();
            $table->string('telephone', 20)->nullable();

            $table->timestamps();

            // Foreign keys
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade');

            $table->foreign('departement_id')
                  ->references('id')->on('departements')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('encadrants');
    }
};

<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ========================================
        // 1. ADMIN (Super User)
        // ========================================
        User::create([
            'name' => 'Administrateur',
            'email' => 'mohamedyou170@gmail.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // ========================================
        // 2. ENCADRANTS (5 superviseurs)
        // ========================================
        $encadrants = [
            [
                'name' => 'Ahmed BENALI',
                'email' => 'ahmed.benali@entreprise.ma',
                'password' => Hash::make('password123'),
                'role' => 'encadrant',
            ],
            [
                'name' => 'Fatima ZAHRI',
                'email' => 'fatima.zahri@entreprise.ma',
                'password' => Hash::make('password123'),
                'role' => 'encadrant',
            ],
            [
                'name' => 'Karim ALAMI',
                'email' => 'karim.alami@entreprise.ma',
                'password' => Hash::make('password123'),
                'role' => 'encadrant',
            ],
            [
                'name' => 'Samira IDRISSI',
                'email' => 'samira.idrissi@entreprise.ma',
                'password' => Hash::make('password123'),
                'role' => 'encadrant',
            ],
            [
                'name' => 'Youssef TAZI',
                'email' => 'youssef.tazi@entreprise.ma',
                'password' => Hash::make('password123'),
                'role' => 'encadrant',
            ],
        ];

        foreach ($encadrants as $encadrant) {
            User::create(array_merge($encadrant, [
                'is_active' => true,
                'email_verified_at' => now(),
            ]));
        }

        // ========================================
        // 3. STAGIAIRES (10 étudiants)
        // ========================================
        $stagiaires = [
            [
                'name' => 'Omar JALAL',
                'email' => 'omar.jalal@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Amina BERRADA',
                'email' => 'amina.berrada@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Hassan MOUSSAOUI',
                'email' => 'hassan.moussaoui@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Salma CHAKIR',
                'email' => 'salma.chakir@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Rachid BENJELLOUN',
                'email' => 'rachid.benjelloun@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Nadia EL FASSI',
                'email' => 'nadia.elfassi@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Mehdi CHRAIBI',
                'email' => 'mehdi.chraibi@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Leila HAMDAOUI',
                'email' => 'leila.hamdaoui@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Amine TAHIRI',
                'email' => 'amine.tahiri@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
            [
                'name' => 'Zineb LAMRANI',
                'email' => 'zineb.lamrani@gmail.com',
                'password' => Hash::make('password123'),
                'role' => 'stagiaire',
            ],
        ];

        foreach ($stagiaires as $stagiaire) {
            User::create(array_merge($stagiaire, [
                'is_active' => true,
                'email_verified_at' => now(),
            ]));
        }
    }
}

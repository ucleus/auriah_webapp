<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $owner = User::updateOrCreate(
            ['email' => 'fiv4lab@gmail.com'],
            [
                'name' => 'Sean',
                'password' => Hash::make('change-this-password'),
                'role' => 'owner',
                'phone_number' => '+15555550100',
                'email_verified_at' => now(),
                'otp_secret' => null,
                'otp_verified_at' => now(),
            ],
        );

        $familyUsers = User::factory()
            ->count(4)
            ->state(fn () => [
                'role' => 'family',
            ])
            ->create();

        Task::factory()
            ->count(12)
            ->for($owner, 'owner')
            ->create()
            ->each(function (Task $task) use ($familyUsers) {
                if ($familyUsers->isEmpty()) {
                    return;
                }

                if (random_int(0, 100) > 65) {
                    $task->assignee()->associate($familyUsers->random());
                    $task->save();
                }
            });
    }
}

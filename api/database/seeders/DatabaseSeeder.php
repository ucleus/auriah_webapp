<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
                'otp_secret' => Hash::make('123456'),
                'otp_expires_at' => now()->addMinutes(10),
                'otp_verified_at' => null,
                'otp_attempts' => 0,
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

                if ($task->labels === null || $task->labels === []) {
                    $task->update(['labels' => [Str::title($task->status)]]);
                }
            });
    }
}

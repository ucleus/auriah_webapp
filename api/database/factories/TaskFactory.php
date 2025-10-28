<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = $this->faker->sentence(4);

        $status = $this->faker->randomElement(['todo', 'in_progress', 'in_review', 'done']);
        $dueDate = $this->faker->optional()->dateTimeBetween('now', '+2 months');

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'description' => $this->faker->paragraph(),
            'status' => $status,
            'priority' => $this->faker->randomElement(['low', 'medium', 'high', 'critical']),
            'due_date' => $dueDate,
            'completed_at' => $status === 'done'
                ? ($dueDate ?? $this->faker->dateTimeBetween('-1 week', 'now'))
                : null,
            'owner_id' => User::factory(),
            'assignee_id' => null,
            'labels' => $this->faker->randomElements([
                'family',
                'personal',
                'urgent',
                'planning',
            ], random_int(0, 3)),
        ];
    }
}

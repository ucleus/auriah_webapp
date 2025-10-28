<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class SearchController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:120'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $query = Str::of($validated['q'])->trim();
        $limit = $validated['limit'] ?? 10;

        $tasks = Task::query()
            ->with(['owner', 'assignee'])
            ->where(function ($builder) use ($query) {
                $needle = '%'.$query.'%';
                $builder
                    ->where('title', 'like', $needle)
                    ->orWhere('description', 'like', $needle)
                    ->orWhere('labels', 'like', $needle);
            })
            ->latest()
            ->limit($limit)
            ->get()
            ->map(function (Task $task) {
                return [
                    'id' => 'task-'.$task->id,
                    'type' => 'task',
                    'title' => $task->title,
                    'snippet' => Str::limit($task->description ?? '', 140, ''),
                    'url' => '/tasks/'.$task->slug,
                    'metadata' => [
                        'status' => $task->status,
                        'priority' => $task->priority,
                        'owner' => $task->owner?->name,
                        'assignee' => $task->assignee?->name,
                        'due_date' => optional($task->due_date)?->toDateString(),
                    ],
                ];
            });

        $users = User::query()
            ->where(function ($builder) use ($query) {
                $needle = '%'.$query.'%';
                $builder
                    ->where('name', 'like', $needle)
                    ->orWhere('email', 'like', $needle);
            })
            ->orderBy('name')
            ->limit(max(1, (int) floor($limit / 2)))
            ->get()
            ->map(function (User $user) {
                return [
                    'id' => 'user-'.$user->id,
                    'type' => 'user',
                    'title' => $user->name,
                    'snippet' => 'Role: '.Str::headline($user->role).' · '.$user->email,
                    'url' => '/admin/users/'.$user->id,
                    'metadata' => [
                        'role' => $user->role,
                        'status' => $user->email_verified_at ? 'active' : 'invited',
                    ],
                ];
            });

        $curated = collect(config('search.curated', []))
            ->filter(function (array $item) use ($query) {
                $needle = Str::lower($query);
                return Str::contains(Str::lower($item['title'].' '.$item['snippet'].' '.$item['type']), $needle);
            })
            ->map(fn (array $item) => array_merge($item, ['metadata' => []]));

        $results = Collection::make()
            ->merge($tasks)
            ->merge($users)
            ->when($tasks->isEmpty() && $users->isEmpty(), fn (Collection $collection) => $collection->merge($curated))
            ->values();

        return response()->json([
            'query' => $query,
            'total' => $results->count(),
            'results' => $results->take($limit),
        ]);
    }

    public function suggestions(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'limit' => ['nullable', 'integer', 'min:1', 'max:10'],
        ]);

        $limit = $validated['limit'] ?? 6;
        $needle = Str::of($validated['q'] ?? '')->trim()->lower();

        if ($needle->isEmpty()) {
            $suggestions = collect(config('search.defaults'))
                ->take($limit)
                ->values();
        } else {
            $suggestions = Task::query()
                ->where('title', 'like', '%'.$needle.'%')
                ->orWhere('description', 'like', '%'.$needle.'%')
                ->pluck('title')
                ->merge(
                    User::query()
                        ->where('name', 'like', '%'.$needle.'%')
                        ->orWhere('email', 'like', '%'.$needle.'%')
                        ->pluck('name')
                )
                ->filter()
                ->map(fn ($value) => (string) $value)
                ->unique()
                ->take($limit)
                ->values();

            if ($suggestions->isEmpty()) {
                $suggestions = collect(config('search.defaults'))
                    ->filter(fn (string $item) => Str::contains(Str::lower($item), $needle))
                    ->take($limit)
                    ->values();
            }
        }

        return response()->json([
            'query' => $validated['q'] ?? '',
            'suggestions' => $suggestions,
        ]);
    }

    public function inspirations(Request $request): JsonResponse
    {
        $prompts = collect(config('search.inspirations', []))->shuffle()->take((int) $request->integer('limit', 10))->values();

        return response()->json([
            'prompts' => $prompts,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskStoreRequest;
use App\Http\Requests\TaskUpdateRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $query = Task::query()
            ->with(['owner', 'assignee'])
            ->when($request->filled('status'), fn (Builder $builder) => $builder->where('status', $request->string('status')))
            ->when($request->filled('priority'), fn (Builder $builder) => $builder->where('priority', $request->string('priority')))
            ->when($request->filled('owner_id'), fn (Builder $builder) => $builder->where('owner_id', $request->integer('owner_id')))
            ->when($request->filled('assignee_id'), fn (Builder $builder) => $builder->where('assignee_id', $request->integer('assignee_id')))
            ->when($request->filled('search'), function (Builder $builder) use ($request) {
                $needle = '%'.$request->string('search')->toString().'%';

                $builder->where(function (Builder $query) use ($needle) {
                    $query
                        ->where('title', 'like', $needle)
                        ->orWhere('description', 'like', $needle);
                });
            })
            ->latest();

        $perPage = (int) $request->integer('per_page', 15);
        $perPage = max(1, min($perPage, 100));

        /** @var LengthAwarePaginator $tasks */
        $tasks = $query->paginate($perPage)->appends($request->query());

        return TaskResource::collection($tasks);
    }

    public function store(TaskStoreRequest $request): TaskResource
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (! $user->isManager()) {
            abort(Response::HTTP_FORBIDDEN, 'Only owners and admins can create tasks.');
        }

        $data = $request->validated();

        $task = Task::create(array_merge($data, [
            'owner_id' => $data['owner_id'] ?? $user->id,
        ]));

        $task->load(['owner', 'assignee']);

        return new TaskResource($task);
    }

    public function show(Task $task): TaskResource
    {
        $task->load(['owner', 'assignee']);

        return new TaskResource($task);
    }

    public function update(TaskUpdateRequest $request, Task $task): TaskResource
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (! $user->isManager()) {
            abort(Response::HTTP_FORBIDDEN, 'Only owners and admins can update tasks.');
        }

        $data = Arr::whereNotNull($request->validated());

        $task->fill($data);
        $task->save();
        $task->load(['owner', 'assignee']);

        return new TaskResource($task);
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if (! $user->isManager()) {
            abort(Response::HTTP_FORBIDDEN, 'Only owners and admins can delete tasks.');
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully.']);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class PublicTaskController extends Controller
{
    public function index(Request $request)
    {
        $limit = max(1, min((int) $request->integer('limit', 24), 50));

        $query = Task::query()
            ->with(['owner', 'assignee'])
            ->when(
                $request->filled('status'),
                fn (Builder $builder) => $builder->where('status', $request->string('status'))
            )
            ->when(
                $request->filled('assignee_id'),
                fn (Builder $builder) => $builder->where('assignee_id', $request->integer('assignee_id'))
            )
            ->when(
                $request->filled('owner_id'),
                fn (Builder $builder) => $builder->where('owner_id', $request->integer('owner_id'))
            )
            ->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END')
            ->orderBy('due_date')
            ->latest('updated_at');

        $tasks = $query->limit($limit)->get();

        return TaskResource::collection($tasks);
    }
}

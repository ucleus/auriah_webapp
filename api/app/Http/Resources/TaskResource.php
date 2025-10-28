<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

/** @mixin \App\Models\Task */
class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'status' => $this->status,
            'priority' => $this->priority,
            'due_date' => optional($this->due_date)?->toDateString(),
            'completed_at' => optional($this->completed_at)?->toIso8601String(),
            'labels' => $this->labels ?? [],
            'owner' => new UserResource($this->whenLoaded('owner') ?? $this->owner),
            'assignee' => $this->assignee ? new UserResource($this->assignee) : null,
            'summary' => Str::limit($this->description ?? $this->title, 140),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

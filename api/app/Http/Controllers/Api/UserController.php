<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserStoreRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class UserController extends Controller
{
    public function index(Request $request)
    {
        /** @var User $authUser */
        $authUser = $request->user();

        if (! $authUser->isManager()) {
            abort(Response::HTTP_FORBIDDEN, 'Only owners and admins can view users.');
        }

        $query = User::query()
            ->when($request->filled('search'), function ($builder) use ($request) {
                $needle = '%'.$request->string('search')->toString().'%';
                $builder->where(function ($query) use ($needle) {
                    $query
                        ->where('name', 'like', $needle)
                        ->orWhere('email', 'like', $needle);
                });
            })
            ->orderBy('name');

        $users = $query->paginate(min(max((int) $request->integer('per_page', 15), 1), 100));

        return UserResource::collection($users);
    }

    public function store(UserStoreRequest $request): UserResource
    {
        /** @var User $authUser */
        $authUser = $request->user();

        if (! $authUser->isManager()) {
            abort(Response::HTTP_FORBIDDEN, 'Only owners and admins can create users.');
        }

        $data = $request->validated();

        $user = User::create(array_merge($data, [
            'password' => $data['password'] ?? Str::password(16),
        ]));

        return new UserResource($user);
    }

    public function show(Request $request, User $user): UserResource
    {
        /** @var User $authUser */
        $authUser = $request->user();

        if (! $authUser->isManager() && $authUser->id !== $user->id) {
            abort(Response::HTTP_FORBIDDEN, 'You are not allowed to view this user.');
        }

        return new UserResource($user);
    }

    public function update(UserUpdateRequest $request, User $user): UserResource
    {
        /** @var User $authUser */
        $authUser = $request->user();

        if (! $authUser->isManager() && $authUser->id !== $user->id) {
            abort(Response::HTTP_FORBIDDEN, 'You are not allowed to update this user.');
        }

        $data = Arr::whereNotNull($request->validated());

        if (empty($data)) {
            return new UserResource($user);
        }

        $user->fill($data);
        $user->save();

        return new UserResource($user);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        /** @var User $authUser */
        $authUser = $request->user();

        if (! $authUser->isManager()) {
            abort(Response::HTTP_FORBIDDEN, 'Only owners and admins can remove users.');
        }

        if ($authUser->id === $user->id) {
            abort(Response::HTTP_BAD_REQUEST, 'You cannot remove your own account.');
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.']);
    }
}

<?php

use App\Http\Controllers\Api\Auth\AuthenticatedUserController;
use App\Http\Controllers\Api\Auth\OtpController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('otp/request', [OtpController::class, 'request']);
    Route::post('otp/verify', [OtpController::class, 'verify']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('me', [AuthenticatedUserController::class, 'show']);
        Route::post('logout', [AuthenticatedUserController::class, 'destroy']);
    });
});

Route::get('search', [SearchController::class, 'index']);
Route::get('search/suggestions', [SearchController::class, 'suggestions']);
Route::get('search/inspirations', [SearchController::class, 'inspirations']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class)->except(['create', 'edit']);
    Route::apiResource('users', UserController::class)->except(['create', 'edit']);
});

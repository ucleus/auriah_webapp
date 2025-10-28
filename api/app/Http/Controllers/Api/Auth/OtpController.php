<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RequestOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class OtpController extends Controller
{
    public function request(RequestOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $key = Str::lower($validated['email']).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts('otp:'.$key, 5)) {
            $seconds = RateLimiter::availableIn('otp:'.$key);

            return response()->json([
                'message' => 'Too many OTP requests. Please try again in '.$seconds.' seconds.',
            ], 429);
        }

        /** @var User $user */
        $user = User::query()->where('email', $validated['email'])->firstOrFail();

        $code = (string) random_int(100000, 999999);

        $user->forceFill([
            'otp_secret' => Hash::make($code),
            'otp_verified_at' => null,
            'otp_expires_at' => now()->addMinutes(10),
            'otp_attempts' => 0,
        ])->save();

        RateLimiter::hit('otp:'.$key, 600);

        Log::info('OTP issued for user.', [
            'user_id' => $user->id,
            'email' => $user->email,
            'expires_at' => $user->otp_expires_at,
            'demo_code' => app()->isProduction() ? null : $code,
        ]);

        return response()->json([
            'message' => 'A one-time passcode has been generated. Check your trusted channel to continue.',
            'expires_at' => optional($user->otp_expires_at)?->toIso8601String(),
            'demo_code' => app()->isProduction() ? null : $code,
        ]);
    }

    public function verify(VerifyOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();

        /** @var User $user */
        $user = User::query()->where('email', $validated['email'])->firstOrFail();

        if (! $user->otp_secret || ! $user->otp_expires_at || $user->otp_expires_at->isPast()) {
            return response()->json([
                'message' => 'The one-time passcode has expired. Request a new code to continue.',
            ], 422);
        }

        if ($user->otp_attempts >= 5) {
            return response()->json([
                'message' => 'Too many failed attempts. Request a new code to continue.',
            ], 429);
        }

        if (! Hash::check($validated['code'], $user->otp_secret)) {
            $user->increment('otp_attempts');

            return response()->json([
                'message' => 'Invalid code. Please double-check and try again.',
            ], 422);
        }

        $user->forceFill([
            'otp_secret' => null,
            'otp_verified_at' => now(),
            'otp_expires_at' => null,
            'otp_attempts' => 0,
        ])->save();

        $token = $user->createToken(
            $validated['device_name'] ?? 'auirah-admin',
            $user->tokenAbilities()
        );

        return response()->json([
            'token' => $token->plainTextToken,
            'token_type' => 'Bearer',
            'abilities' => $token->accessToken->abilities,
            'user' => new UserResource($user),
        ]);
    }
}

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AccidentController;
use App\Http\Controllers\ClaimController;
use App\Http\Controllers\InsurancePolicyController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\DisputeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InsurerController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\DocumentController;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/otp/send', [AuthController::class, 'sendOtp']);
Route::post('/otp/login', [AuthController::class, 'loginWithOtp']);
Route::post('/auth/google', [AuthController::class, 'loginWithGoogle']);
Route::get('/auth/google/config', [AuthController::class, 'googleConfig']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // Accident Reporting
    Route::get('/accidents/recent', [AccidentController::class, 'recent']);
    Route::apiResource('accidents', AccidentController::class);
    
    // Insurance Claims
    Route::apiResource('claims', ClaimController::class);
    Route::get('/claims/{claim}/documents/{document}', [ClaimController::class, 'downloadDocument']);
    Route::apiResource('policies', InsurancePolicyController::class);
    Route::apiResource('vehicles', VehicleController::class);
    Route::apiResource('documents', DocumentController::class);
    
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

    // Insurer B2B
    Route::get('/insurer/claims', [InsurerController::class, 'getClaims']);
    Route::patch('/insurer/claims/{claim}', [InsurerController::class, 'updateClaimStatus']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    
    // Disputes
    Route::apiResource('disputes', DisputeController::class);
    Route::post('/disputes/{dispute}/messages', [DisputeController::class, 'addMessage']);

    // Payments & Revenue
    Route::post('/payments/create-order', [PaymentController::class, 'createOrder']);
    Route::post('/payments/verify', [PaymentController::class, 'verifyPayment']);
    Route::get('/payments/history', [PaymentController::class, 'getHistory']);
    Route::get('/admin/revenue/stats', [PaymentController::class, 'getAdminStats']);
    
    // Mediator Routes
    Route::prefix('mediator')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\MediatorController::class, 'getStats']);
        Route::get('/disputes', [\App\Http\Controllers\MediatorController::class, 'getDisputes']);
        Route::post('/disputes/{dispute}/assign', [\App\Http\Controllers\MediatorController::class, 'assignDispute']);
        Route::patch('/disputes/{dispute}/status', [\App\Http\Controllers\MediatorController::class, 'updateStatus']);
        Route::post('/disputes/{dispute}/resolve', [\App\Http\Controllers\MediatorController::class, 'resolveDispute']);
    });

    // KYC Integration
    Route::post('/kyc/verify', [\App\Http\Controllers\KYCController::class, 'verify']);
    Route::get('/kyc/status', [\App\Http\Controllers\KYCController::class, 'status']);
    Route::get('/accidents/{accident}', [\App\Http\Controllers\AccidentController::class, 'show']);
    Route::post('/accidents/sync', [\App\Http\Controllers\AccidentController::class, 'sync']);
    Route::post('/accidents/{accident}/assess', [\App\Http\Controllers\AccidentController::class, 'assess']);

    // Legal & B2B
    Route::get('/disputes/{dispute}/legal-notice', [\App\Http\Controllers\DisputeController::class, 'generateLegalNotice']);
    Route::post('/b2b/generate-token', [\App\Http\Controllers\B2BController::class, 'generateToken']);

    // Admin Operations
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [\App\Http\Controllers\Admin\AdminAnalyticsController::class, 'getOverviewStats']);
        Route::get('/users', [\App\Http\Controllers\Admin\AdminUserController::class, 'index']);
        Route::get('/health', [\App\Http\Controllers\Admin\AdminSystemController::class, 'getHealth']);
        Route::get('/fraud', [\App\Http\Controllers\Admin\AdminSystemController::class, 'getFraud']);
        Route::get('/settings', [\App\Http\Controllers\Admin\AdminSystemController::class, 'getSettings']);
        Route::post('/settings', [\App\Http\Controllers\Admin\AdminSystemController::class, 'updateSettings']);
    });

    Route::post('/logout', [AuthController::class, 'logout']);
});

// B2B Public Gateway
Route::get('/b2b/fetch-claims', [\App\Http\Controllers\B2BController::class, 'fetchClaims']);

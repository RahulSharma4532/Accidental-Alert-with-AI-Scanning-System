<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Request;
use App\Http\Controllers\Auth\AuthController;

$phone = '8809903280';
$controller = app(AuthController::class);

// simulate sendOtp
$request1 = Request::create('/api/otp/send', 'POST', ['phone' => $phone]);
$res1 = $controller->sendOtp($request1);
$otp = Cache::get('otp_' . $phone);

$out = ['otp_generated' => $otp];

// simulate loginWithOtp
$request2 = Request::create('/api/otp/login', 'POST', ['phone' => $phone, 'otp' => (string)$otp]);

try {
    $res2 = $controller->loginWithOtp($request2);
    $out['login_result'] = $res2->getContent();
} catch (\Exception $e) {
    $out['login_error'] = $e->getMessage();
}

echo json_encode($out, JSON_PRETTY_PRINT);

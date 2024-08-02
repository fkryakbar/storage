<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DriveController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthController::class, 'index']);
Route::post('/', [AuthController::class, 'loginAttempt'])->name('loginAttempt');

Route::get('/', [AuthController::class, 'index']);

Route::group(['middleware' => 'auth'], function () {
    Route::get('drive', [DriveController::class, 'index'])->name('drive.index');
});

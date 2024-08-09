<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DriveController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\StorageController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthController::class, 'index'])->name('login');
Route::post('/', [AuthController::class, 'loginAttempt'])->name('loginAttempt');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::group(['middleware' => 'auth'], function () {
    Route::get('drive', [DriveController::class, 'index'])->name('drive.index');
    Route::get('drive/{folderId}', [DriveController::class, 'index'])->name('drive.index.folder');
    Route::post('drive/folder', [DriveController::class, 'createFolder'])->name('drive.createFolder');
    Route::post('drive/file', [DriveController::class, 'uploadFile'])->name('drive.uploadFile');
    Route::post('drive/file/{parentId}', [DriveController::class, 'uploadFile'])->name('drive.uploadFile.folder');
    Route::delete('drive/{itemId}', [DriveController::class, 'deleteItem'])->name('drive.deleteItem');
    Route::patch('drive/{itemId}', [DriveController::class, 'updateItem'])->name('drive.updateItem');


    Route::get('storage', [StorageController::class, 'index'])->name('storage.index');
    Route::post('storage/reset', [StorageController::class, 'reset'])->name('storage.reset');
    Route::post('storage/clean-trash', [StorageController::class, 'cleanTrash'])->name('storage.cleanTrash');
});

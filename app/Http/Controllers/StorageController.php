<?php

namespace App\Http\Controllers;

use App\Libraries\GDrive;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StorageController extends Controller
{
    public function index()
    {
        $storageDetails = GDrive::getStorageDetails();
        return Inertia::render('Storage/Index', compact('storageDetails'));
    }

    public function reset()
    {
        GDrive::resetAndDeleteEverything();
    }

    public function cleanTrash()
    {
        GDrive::deleteEverythingInTrash();
    }
}

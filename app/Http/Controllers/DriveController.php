<?php

namespace App\Http\Controllers;

use App\Libraries\GDrive;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DriveController extends Controller
{
    public function index()
    {
        $items = GDrive::listFilesAndFolders();
        dd($items);
        return Inertia::render('Drive/Index');
    }
}

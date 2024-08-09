<?php

namespace App\Http\Controllers;

use App\Libraries\GDrive;
use App\Models\Item;
use Google\Service\CloudSourceRepositories\Repo;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DriveController extends Controller
{

    private $totalPaginate = 15;

    public function index(Request $request, $folderId = null)
    {
        $items = Item::where('parentId', env('DRIVE_FOLDER_ID'))->paginate($this->totalPaginate);
        $parent = null;
        $allParents = [];

        $initialFolderId = $folderId;

        if ($request->search) {
            $search = $request->search;
            $items = Item::whereLike('name', '%' . $search . '%')->paginate($this->totalPaginate);
        }

        if ($folderId) {
            $parent = Item::where('itemId', $folderId)->where('type', 'folder')->firstOrFail();
            $parent->parent = $parent->parent();
            $items = Item::where('parentId', $initialFolderId)->paginate($this->totalPaginate);

            if ($request->search) {
                $search = $request->search;
                $items = Item::where('parentId', $initialFolderId)->whereLike('name', '%' . $search . '%')->paginate($this->totalPaginate);
            }

            while (true) {
                $currentItem = Item::where('itemId', $initialFolderId)->where('type', 'folder')->firstOrFail();
                if ($currentItem->parent()) {
                    $currentParent = $currentItem->parent();
                    array_push($allParents, $currentParent);
                    $initialFolderId = $currentParent->itemId;
                } else {
                    break;
                }
            }
            $allParents = array_reverse($allParents);
        }
        return Inertia::render('Drive/Index', compact('items', 'parent', 'allParents'));
    }


    public function createFolder(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        if (!$request->parentId) {
            $request->merge([
                'parentId' => env('DRIVE_FOLDER_ID')
            ]);
        }


        $itemId = GDrive::createFolder($request->name, $request->parentId);
        $request->merge([
            'itemId' => $itemId,
            'user_id' => Auth::user()->id,
            'type' => 'folder',
            'visibility' => 'private',
            'driveLink' => env('APP_URL') . '/' . 'drive/' . $itemId
        ]);

        Item::create($request->all());
    }

    public function deleteItem($itemId)
    {
        GDrive::deleteItem($itemId);

        $item = Item::where('itemId', $itemId)->firstOrFail();
        if ($item->type == 'folder') {
            $this->deleteFolderContents($item->itemId);
        }

        $item->delete();
    }

    private function deleteFolderContents($itemId)
    {
        $contents = Item::where('parentId', $itemId)->get();
        foreach ($contents as  $item) {
            if ($item->type == 'folder') {
                $this->deleteFolderContents($item->itemId);
            }
            $item->delete();
        }
    }

    public function updateItem($itemId, Request $request)
    {
        $request->validate([
            'name' => 'required',
            'visibility' => 'required',
        ]);

        $item = Item::where('itemId', $itemId)->firstOrFail();

        if ($request->visibility == 'public') {
            GDrive::editPermission($itemId, 'writer');
        } else if ($request->visibility == 'read-only') {
            GDrive::editPermission($itemId, 'reader');
        } else {
            GDrive::editPermission($itemId, 'private');
        }

        GDrive::renameItem($itemId, $request->name);

        $item->update($request->all());
    }

    public function uploadFile(Request $request, $parentId = null)
    {
        $file = $request->file("filepond");
        if (!$parentId) {
            $parentId = env('DRIVE_FOLDER_ID');
        }
        $storedPath = $file->storeAs('temporary', $file->getClientOriginalName());
        $path = Storage::path($storedPath);
        $fileId = GDrive::uploadFile($path, $parentId);
        Storage::delete($storedPath);
        Item::create([
            'itemId' => $fileId,
            'user_id' => Auth::user()->id,
            'parentId' => $parentId,
            'name' => $file->getClientOriginalName(),
            'type' => 'file',
            'visibility' => 'private',
            'driveLink' => GDrive::generateShareableLink($fileId),
            'downloadLink' => GDrive::generateDownloadLink($fileId)
        ]);
    }
}

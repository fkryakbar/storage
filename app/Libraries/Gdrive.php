<?php

namespace App\Libraries;

use Exception;
use Google\Client;
use Google\Service\Drive as DriveDrive;
use Google\Service\Drive\DriveFile;
use Google\Service\Drive\Permission;

class GDrive
{
    private static $client;
    private static $service;
    private static $folderId;

    public static function init()
    {
        self::$client = new Client();
        self::$client->setAuthConfig(storage_path('app/credentials.json'));
        self::$client->addScope(DriveDrive::DRIVE);
        self::$service = new DriveDrive(self::$client);
        self::$folderId = env('DRIVE_FOLDER_ID');
    }

    public static function uploadFile($filePath, $folderId = null)
    {
        self::init();
        $file = new DriveFile();
        $file->setName(basename($filePath));
        if ($folderId) {
            $file->setParents([$folderId]);
        } else {
            $file->setParents([self::$folderId]);
        }

        $mimeType = mime_content_type($filePath);
        $data = file_get_contents($filePath);

        $createdFile = self::$service->files->create($file, [
            'data' => $data,
            'mimeType' => $mimeType,
            'uploadType' => 'multipart'
        ]);

        return $createdFile->id;
    }

    public static function createFolder($folderName, $parentId = null)
    {
        self::init();
        $folder = new DriveFile();
        $folder->setName($folderName);
        $folder->setMimeType('application/vnd.google-apps.folder');

        if ($parentId) {
            $folder->setParents([$parentId]);
        } else {
            $folder->setParents([self::$folderId]);
        }

        try {
            $createdFolder = self::$service->files->create($folder, [
                'fields' => 'id, name'
            ]);
            return $createdFolder->getId();
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function deleteFile($fileId)
    {
        self::init();
        self::$service->files->delete($fileId);
    }

    public static function generateShareableLink($fileId)
    {
        self::init();
        $file = self::$service->files->get($fileId, array('fields' => 'webViewLink'));
        return $file->getWebViewLink();
    }

    public static function renameFolder($folderId, $newName)
    {
        self::init();
        $folder = new DriveFile();
        $folder->setName($newName);

        try {
            $updatedFolder = self::$service->files->update($folderId, $folder, [
                'fields' => 'id, name'
            ]);

            return $updatedFolder->getId();
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function deleteFolder($folderId)
    {
        self::init();
        self::$service->files->delete($folderId);
    }

    public static function deleteItem($itemId)
    {
        self::init();
        self::$service->files->delete($itemId);
    }

    public static function renameFile($fileId, $newName)
    {
        self::init();
        $file = new DriveFile();
        $file->setName($newName);

        try {
            $updatedFile = self::$service->files->update($fileId, $file);
            return $updatedFile;
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }
    public static function renameItem($itemId, $newName)
    {
        self::init();
        $item = new DriveFile();
        $item->setName($newName);
        try {
            $updatedFile = self::$service->files->update($itemId, $item);
            return $updatedFile;
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }



    public static function moveFile($fileId, $newFolderId)
    {
        self::init();
        try {
            $file = self::$service->files->get($fileId, ['fields' => 'parents']);
            $previousParents = join(',', $file->parents);

            $updatedFile = self::$service->files->update($fileId, new DriveFile(), [
                'addParents' => $newFolderId,
                'removeParents' => $previousParents,
                'fields' => 'id, parents'
            ]);

            return $updatedFile->getId();
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }

    public static function getStorageDetails()
    {
        self::init();
        try {
            $about = self::$service->about->get(['fields' => 'storageQuota']);
            $storageQuota = $about->getStorageQuota();

            $totalStorage = $storageQuota['limit']; // Total storage limit
            $usedStorage = $storageQuota['usage']; // Total storage used
            $trashStorage = $storageQuota['trash']; // Storage used by trash

            // Detailed usage breakdown (if available)
            $usageInDrive = isset($storageQuota['usageInDrive']) ? $storageQuota['usageInDrive'] : 0;
            $usageInDriveTrash = isset($storageQuota['usageInDriveTrash']) ? $storageQuota['usageInDriveTrash'] : 0;

            return [
                'total_storage' => $totalStorage / (1024 ** 3),
                'used_storage' => $usedStorage / (1024 ** 3),
                'trash_storage' => $trashStorage / (1024 ** 3),
                'usage_in_drive' => $usageInDrive / (1024 ** 3),
                'usage_in_drive_trash' => $usageInDriveTrash / (1024 ** 3),
                'remaining_storage' => ($totalStorage - $usedStorage - $trashStorage) / (1024 ** 3)
            ];
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }


    public static function listFilesAndFolders($folderId = null)
    {
        self::init();
        $folderId = $folderId ?: self::$folderId;

        try {
            $parameters = [
                'q' => "'{$folderId}' in parents and trashed=false",
                'fields' => 'files(id, name, mimeType)'
            ];
            $files = self::$service->files->listFiles($parameters);
            $items = [];

            foreach ($files as $file) {
                $items[] = [
                    'id' => $file->getId(),
                    'name' => $file->getName(),
                    'mime_type' => $file->getMimeType()
                ];
            }

            return $items;
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }
    public static function generateDownloadLink($fileId)
    {
        return "https://drive.google.com/uc?id={$fileId}";
    }
    public static function editPermission($fileId, $permissionType = 'reader')
    {
        self::init();

        $permission = new Permission();

        if ($permissionType === 'private') {
            $permissions = self::$service->permissions->listPermissions($fileId);
            foreach ($permissions->getPermissions() as $perm) {
                if ($perm->getType() === 'anyone') {
                    self::$service->permissions->delete($fileId, $perm->getId());
                }
            }
            return true;
        }

        $role = $permissionType === 'writer' ? 'writer' : 'reader';
        $permission->setRole($role);
        $permission->setType('anyone');

        try {
            self::$service->permissions->create($fileId, $permission);
            return true;
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return false;
        }
    }
    public static function resetAndDeleteEverything()
    {
        self::init();
        try {
            // List all files in Google Drive
            $pageToken = null;
            do {
                $response = self::$service->files->listFiles([
                    'pageSize' => 1000,
                    'fields' => 'nextPageToken, files(id)',
                    'pageToken' => $pageToken
                ]);

                foreach ($response->files as $file) {
                    // Delete each file
                    self::$service->files->delete($file->id);
                }

                $pageToken = $response->nextPageToken;
            } while ($pageToken != null);

            // Empty the trash
            self::$service->files->emptyTrash();

            return "All files deleted and trash emptied.";
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }
    public static function deleteEverythingInTrash()
    {
        self::init();
        try {
            // List all files in the trash
            $pageToken = null;
            do {
                $response = self::$service->files->listFiles([
                    'q' => 'trashed=true',
                    'pageSize' => 1000,
                    'fields' => 'nextPageToken, files(id)',
                    'pageToken' => $pageToken
                ]);

                foreach ($response->files as $file) {
                    // Permanently delete each file
                    self::$service->files->delete($file->id);
                }

                $pageToken = $response->nextPageToken;
            } while ($pageToken != null);

            return "All items in the trash have been permanently deleted.";
        } catch (Exception $e) {
            echo 'An error occurred: ' . $e->getMessage();
            return null;
        }
    }
}

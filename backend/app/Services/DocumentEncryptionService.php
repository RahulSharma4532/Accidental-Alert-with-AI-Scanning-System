<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Http\UploadedFile;

class DocumentEncryptionService
{
    protected $disk = 'public';

    /**
     * Encrypt and store an uploaded file.
     *
     * @param UploadedFile $file
     * @param string $path
     * @return string The stored file path
     */
    public function storeEncrypted(UploadedFile $file, string $path): string
    {
        // Read file contents
        $contents = file_get_contents($file->getRealPath());
        
        // Encrypt the contents
        $encryptedContents = Crypt::encrypt($contents);
        
        // Save the encrypted file contents to the specified path
        $filename = $file->hashName();
        $fullPath = rtrim($path, '/') . '/' . $filename;
        
        Storage::disk($this->disk)->put($fullPath, $encryptedContents);
        
        return $fullPath;
    }

    /**
     * Retrieve and decrypt a file's contents.
     *
     * @param string $path
     * @return string Decrypted file contents
     */
    public function retrieveDecrypted(string $path): string
    {
        if (!Storage::disk($this->disk)->exists($path)) {
            throw new \Exception("File does not exist: {$path}");
        }

        $encryptedContents = Storage::disk($this->disk)->get($path);
        
        return Crypt::decrypt($encryptedContents);
    }

    /**
     * Delete a file from storage.
     *
     * @param string $path
     * @return bool
     */
    public function delete(string $path): bool
    {
        if (Storage::disk($this->disk)->exists($path)) {
            return Storage::disk($this->disk)->delete($path);
        }
        return false;
    }
}

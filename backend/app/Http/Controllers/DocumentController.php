<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\ClaimDocument;
use App\Services\DocumentEncryptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentController extends Controller
{
    /**
     * Display a listing of the user's encrypted claim documents.
     */
    public function index(Request $request)
    {
        return ClaimDocument::whereHas('claim', function($q) use ($request) {
            $q->where('user_id', $request->user()->id);
        })->with('claim.accident')->orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a newly created document in storage and encrypt it.
     */
    public function store(Request $request)
    {
        $request->validate([
            'claim_id' => 'required|exists:claims,id',
            'document' => 'required|file|max:10240', // Max 10MB
            'doc_type' => 'nullable|string',
        ]);

        $claim = Claim::where('user_id', $request->user()->id)->findOrFail($request->claim_id);
        $file = $request->file('document');

        $encryptionService = app(DocumentEncryptionService::class);
        $path = "claims/{$claim->id}";
        $encryptedPath = $encryptionService->storeEncrypted($file, $path);

        $doc = ClaimDocument::create([
            'claim_id' => $claim->id,
            'doc_type' => $request->doc_type ?? 'other_document',
            'file_path' => $encryptedPath,
            'verified' => false,
        ]);

        return response()->json([
            'message' => 'Document uploaded and encrypted successfully',
            'document' => $doc->load('claim')
        ], 201);
    }

    /**
     * Remove the specified document from storage and database.
     */
    public function destroy(Request $request, $id)
    {
        $doc = ClaimDocument::whereHas('claim', function($q) use ($request) {
            $q->where('user_id', $request->user()->id);
        })->findOrFail($id);

        if (Storage::exists($doc->file_path)) {
            Storage::delete($doc->file_path);
        }

        $doc->delete();

        return response()->json([
            'message' => 'Document deleted successfully'
        ]);
    }
}

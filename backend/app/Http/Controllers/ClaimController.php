<?php

namespace App\Http\Controllers;

use App\Models\Claim;
use App\Models\ClaimDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ClaimController extends Controller
{
    protected $workflowService;

    public function __construct(\App\Services\ClaimWorkflowService $workflowService)
    {
        $this->workflowService = $workflowService;
    }

    public function index(Request $request)
    {
        return Claim::where('user_id', $request->user()->id)
            ->with('accident', 'insurancePolicy', 'documents')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'accident_id' => 'required|exists:accidents,id',
            'insurance_policy_id' => 'required|exists:insurance_policies,id',
            'claim_type' => 'required',
            'description' => 'required',
            'estimated_amount' => 'required|numeric',
            'documents' => 'nullable|array',
            'documents.*' => 'file|max:10240', // Max 10MB per document
        ]);

        $files = $request->file('documents') ?? [];

        $claim = $this->workflowService->createClaim(
            $request->only(['accident_id', 'insurance_policy_id', 'claim_type', 'description', 'estimated_amount']),
            $files,
            $request->user()
        );

        return response()->json([
            'message' => 'Claim filed successfully',
            'claim' => $claim
        ], 201);
    }

    public function show(Claim $claim)
    {
        return $claim->load('accident', 'insurancePolicy', 'documents');
    }

    /**
     * Download and decrypt a claim document securely.
     */
    public function downloadDocument(Claim $claim, ClaimDocument $document, \App\Services\DocumentEncryptionService $encryptionService)
    {
        $user = auth()->user();
        
        // Authorization: Claimant or Insurer/Mediator only
        if ($claim->user_id !== $user->id && !in_array($user->role, ['insurer', 'mediator', 'Insurer', 'mediator'])) {
            return response()->json(['message' => 'Unauthorized access to document.'], 403);
        }

        if ($document->claim_id !== $claim->id) {
            return response()->json(['message' => 'Document not found for this claim.'], 404);
        }

        try {
            $decryptedContent = $encryptionService->retrieveDecrypted($document->file_path);
            
            // Get original mime-type from storage path if possible, fallback to octet-stream
            $mimeType = 'application/octet-stream';
            $filename = basename($document->file_path);

            return response($decryptedContent, 200)
                ->header('Content-Type', $mimeType)
                ->header('Content-Disposition', 'inline; filename="' . $filename . '"');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error retrieving file: ' . $e->getMessage()], 500);
        }
    }
}

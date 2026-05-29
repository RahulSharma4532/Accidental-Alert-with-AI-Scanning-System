<?php

namespace App\Services;

use App\Models\Claim;
use App\Models\ClaimDocument;
use App\Models\Notification;
use App\Services\DocumentEncryptionService;
use App\Services\FraudService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class ClaimWorkflowService
{
    protected $encryptionService;
    protected $fraudService;

    public function __construct(
        DocumentEncryptionService $encryptionService,
        FraudService $fraudService
    ) {
        $this->encryptionService = $encryptionService;
        $this->fraudService = $fraudService;
    }

    /**
     * Create a new claim workflow
     *
     * @param array $data
     * @param array $uploadedFiles
     * @param \App\Models\User $user
     * @return Claim
     */
    public function createClaim(array $data, array $uploadedFiles, $user): Claim
    {
        // 1. Create claim record
        $claim = Claim::create([
            'user_id' => $user->id,
            'claim_id' => 'CLM-' . strtoupper(Str::random(6)),
            'accident_id' => $data['accident_id'],
            'insurance_policy_id' => $data['insurance_policy_id'],
            'claim_type' => $data['claim_type'],
            'description' => $data['description'],
            'estimated_amount' => $data['estimated_amount'],
            'status' => 'Submitted',
        ]);

        // 2. Handle Encrypted Document Uploads
        foreach ($uploadedFiles as $docKey => $file) {
            if ($file instanceof UploadedFile) {
                // Determine document type
                $docType = $this->resolveDocType($file, $docKey);

                // Store encrypted file
                $path = "claims/{$claim->id}";
                $encryptedPath = $this->encryptionService->storeEncrypted($file, $path);

                // Save metadata to database
                ClaimDocument::create([
                    'claim_id' => $claim->id,
                    'doc_type' => $docType,
                    'file_path' => $encryptedPath,
                    'verified' => false,
                ]);
            }
        }

        // 3. Trigger AI Fraud Shield
        $this->fraudService->analyzeClaim($claim);

        // 4. Notify User
        Notification::create([
            'user_id' => $user->id,
            'type' => 'claim_update',
            'title' => 'Claim Filed Successfully',
            'message' => "Your claim {$claim->claim_id} has been submitted and is under review.",
            'action_url' => "/claims/{$claim->id}"
        ]);

        return $claim->load('accident', 'insurancePolicy', 'documents');
    }

    /**
     * Resolve document type from name/key
     */
    protected function resolveDocType(UploadedFile $file, $key): string
    {
        $name = strtolower($file->getClientOriginalName());
        if (str_contains($name, 'fir') || str_contains(strtolower($key), 'fir')) {
            return 'FIR';
        }
        if (str_contains($name, 'medical') || str_contains(strtolower($key), 'medical')) {
            return 'medical_report';
        }
        if (str_contains($name, 'invoice') || str_contains($name, 'bill') || str_contains(strtolower($key), 'invoice')) {
            return 'repair_invoice';
        }
        return 'other_document';
    }
}

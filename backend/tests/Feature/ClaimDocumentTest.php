<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Accident;
use App\Models\InsurancePolicy;
use App\Models\Claim;
use App\Models\ClaimDocument;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Crypt;
use Tests\TestCase;

class ClaimDocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_claim_with_encrypted_documents()
    {
        Storage::fake('public');

        // Create a user, policy and accident
        $user = User::factory()->create([
            'phone' => '9876543211',
            'role' => 'user'
        ]);

        $policy = InsurancePolicy::create([
            'user_id' => $user->id,
            'company' => 'SafetyFirst Insurance',
            'policy_number' => 'POL-TEST-123',
            'vehicle_number' => 'DL-3C-AS-1234',
            'coverage_type' => 'Comprehensive',
            'expiry_date' => '2027-01-01',
            'premium_amount' => 15000,
            'status' => 'Active'
        ]);

        $accident = Accident::create([
            'user_id' => $user->id,
            'report_id' => 'AR-TEST-001',
            'address' => 'Sector 62, Noida',
            'accident_type' => 'Collision',
            'severity' => 'Moderate',
            'latitude' => '28.6273',
            'longitude' => '77.3725',
        ]);

        // Mock upload files
        $firFile = UploadedFile::fake()->create('fir_report.pdf', 500);
        $invoiceFile = UploadedFile::fake()->create('bill.jpg', 200);

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/claims', [
            'accident_id' => $accident->id,
            'insurance_policy_id' => $policy->id,
            'claim_type' => 'Vehicle Damage',
            'description' => 'Rear end bumper damage',
            'estimated_amount' => 20000,
            'documents' => [
                'fir' => $firFile,
                'invoice' => $invoiceFile
            ]
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'claim' => [
                'id',
                'claim_id',
                'documents'
            ]
        ]);

        $claimId = $response->json('claim.id');

        // Assert claim documents are created in database
        $this->assertDatabaseHas('claim_documents', [
            'claim_id' => $claimId,
            'doc_type' => 'FIR'
        ]);

        $this->assertDatabaseHas('claim_documents', [
            'claim_id' => $claimId,
            'doc_type' => 'repair_invoice'
        ]);

        // Assert file exists in storage and is encrypted
        $doc = ClaimDocument::where('claim_id', $claimId)->where('doc_type', 'FIR')->first();
        Storage::disk('public')->assertExists($doc->file_path);

        $fileContents = Storage::disk('public')->get($doc->file_path);
        // Verify it's encrypted (should not be plain PDF contents)
        $this->assertNotEquals('fir_report.pdf', $fileContents);

        // Try decrypting
        $decrypted = Crypt::decrypt($fileContents);
        $this->assertNotNull($decrypted);

        // Try downloading/decrypting it through download endpoint
        $downloadResponse = $this->actingAs($user, 'sanctum')->get("/api/claims/{$claimId}/documents/{$doc->id}");
        $downloadResponse->assertStatus(200);
        $this->assertEquals($decrypted, $downloadResponse->getContent());
    }
}

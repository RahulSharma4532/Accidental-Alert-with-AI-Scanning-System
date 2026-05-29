<?php

namespace App\Http\Controllers;

use App\Models\Dispute;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DisputeController extends Controller
{
    public function index(Request $request)
    {
        return Dispute::with(['claim.insurancePolicy'])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'claim_id' => 'required|exists:claims,id',
            'reason' => 'required|string',
            'expected_amount' => 'required|numeric',
            'explanation' => 'required|string',
        ]);

        $dispute = Dispute::create([
            'user_id' => $request->user()->id,
            'claim_id' => $validated['claim_id'],
            'dispute_id' => 'DIS-' . strtoupper(Str::random(4)) . '-' . rand(100, 999),
            'reason' => $request->reason,
            'expected_amount' => $request->expected_amount,
            'explanation' => $request->explanation,
            'status' => 'Raised'
        ]);

        return response()->json([
            'message' => 'Dispute raised successfully',
            'dispute' => $dispute
        ], 201);
    }

    public function show(Dispute $dispute)
    {
        return $dispute->load(['user', 'claim.insurancePolicy', 'claim.documents', 'messages.user']);
    }

    public function addMessage(Request $request, Dispute $dispute)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $message = $dispute->messages()->create([
            'sender_id' => $request->user()->id,
            'sender_type' => 'User',
            'message' => $request->message,
        ]);

        return response()->json($message, 201);
    }

    /**
     * Generate a formal legal notice for the dispute
     */
    public function generateLegalNotice(Dispute $dispute)
    {
        $dispute->load(['user', 'claim.insurancePolicy']);
        
        $html = "
            <div style='font-family: serif; padding: 50px; line-height: 1.6; color: #333;'>
                <div style='text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;'>
                    <h1 style='margin: 0; text-transform: uppercase;'>Legal Notice</h1>
                    <p style='margin: 5px 0;'>Ref: {$dispute->dispute_id}</p>
                </div>

                <div style='margin-bottom: 30px;'>
                    <p><strong>To,</strong><br>
                    The Manager (Claims Department),<br>
                    {$dispute->claim->insurancePolicy->company},<br>
                    Corporate Office, India.</p>
                </div>

                <div style='margin-bottom: 30px;'>
                    <p><strong>Subject:</strong> Formal Notice for Dispute Resolution regarding Claim ID: {$dispute->claim->claim_id}</p>
                </div>

                <p>Dear Sir/Madam,</p>

                <p>Under instructions from our client, <strong>{$dispute->user->name}</strong>, resident of India, we hereby serve you with this formal legal notice regarding the arbitrary denial/underpayment of the insurance claim referenced above.</p>

                <p><strong>Facts of the Case:</strong></p>
                <ul>
                    <li><strong>Policy Number:</strong> {$dispute->claim->insurancePolicy->policy_number}</li>
                    <li><strong>Dispute Reason:</strong> {$dispute->reason}</li>
                    <li><strong>Claimant's Expected Amount:</strong> ₹" . number_format($dispute->expected_amount, 2) . "</li>
                </ul>

                <p>Despite several follow-ups, your company has failed to provide a just resolution. This act constitutes a deficiency in service under the Consumer Protection Act.</p>

                <p>We hereby call upon you to settle the disputed amount of <strong>₹" . number_format($dispute->expected_amount, 2) . "</strong> within 15 days from the receipt of this notice, failing which our client shall be constrained to initiate legal proceedings in the appropriate court of law.</p>

                <div style='margin-top: 50px;'>
                    <p>Yours faithfully,</p>
                    <p><strong>Legal Department</strong><br>
                    AccidentAlert Dispute Resolution Cell</p>
                </div>

                <div style='margin-top: 30px; padding: 20px; border: 1px dashed #ccc; text-align: center; color: #666;'>
                    <p style='font-size: 12px;'>Electronically generated legal notice. No physical signature required.</p>
                </div>
            </div>
        ";

        return response()->json([
            'html' => $html,
            'filename' => "Legal_Notice_{$dispute->dispute_id}.html"
        ]);
    }
}

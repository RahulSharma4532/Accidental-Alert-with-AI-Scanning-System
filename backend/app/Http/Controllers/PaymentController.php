<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Create a simulated Razorpay Order
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'service_type' => 'required|string',
            'amount' => 'required|numeric'
        ]);

        $orderId = 'order_' . Str::random(14);
        
        // In a real app, you'd call Razorpay API here
        // $order = $this->razorpay->order->create([...]);

        return response()->json([
            'order_id' => $orderId,
            'amount' => $request->amount,
            'currency' => 'INR',
            'key' => 'rzp_test_simulated_key'
        ]);
    }

    /**
     * Verify Payment and Generate Invoice
     */
    public function verifyPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|string',
            'payment_id' => 'required|string',
            'service_type' => 'required|string',
            'amount' => 'required|numeric',
            'metadata' => 'nullable|array'
        ]);

        return DB::transaction(function () use ($request) {
            $taxAmount = $request->amount * 0.18; // 18% GST
            $totalAmount = $request->amount + $taxAmount;

            $payment = Payment::create([
                'user_id' => $request->user()->id,
                'service_type' => $request->service_type,
                'amount' => $request->amount,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'status' => 'completed',
                'transaction_id' => $request->payment_id,
                'order_id' => $request->order_id,
                'payment_method' => 'upi', // Defaulting for simulation
                'metadata' => $request->metadata
            ]);

            // Generate Invoice
            $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(6));
            Invoice::create([
                'user_id' => $request->user()->id,
                'payment_id' => $payment->id,
                'invoice_number' => $invoiceNumber,
                'subtotal' => $request->amount,
                'gst_amount' => $taxAmount,
                'total' => $totalAmount
            ]);

            // If it's a priority claim, update the claim
            if ($request->service_type === 'priority_claim' && isset($request->metadata['claim_id'])) {
                DB::table('claims')->where('id', $request->metadata['claim_id'])->update(['status' => 'Under Priority Review']);
            }

            return response()->json([
                'success' => true,
                'payment' => $payment,
                'invoice_number' => $invoiceNumber
            ]);
        });
    }

    /**
     * Get Transaction History for User
     */
    public function getHistory(Request $request)
    {
        $payments = Payment::where('user_id', $request->user()->id)
            ->with('invoice')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($payments);
    }

    /**
     * Admin Revenue Stats
     */
    public function getAdminStats()
    {
        $stats = [
            'total_revenue' => Payment::where('status', 'completed')->sum('total_amount'),
            'total_tax' => Payment::where('status', 'completed')->sum('tax_amount'),
            'net_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'service_breakdown' => Payment::select('service_type', DB::raw('count(*) as count'), DB::raw('sum(amount) as total'))
                ->where('status', 'completed')
                ->groupBy('service_type')
                ->get(),
            'monthly_growth' => Payment::select(
                    DB::raw('strftime("%Y-%m", created_at) as month'),
                    DB::raw('sum(total_amount) as revenue')
                )
                ->where('status', 'completed')
                ->groupBy('month')
                ->get()
        ];

        return response()->json($stats);
    }
}

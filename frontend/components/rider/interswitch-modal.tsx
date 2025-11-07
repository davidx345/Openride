// @ts-nocheck
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, CheckCircle, AlertCircle } from "lucide-react"

// Extend window type for Interswitch
declare global {
  interface Window {
    webpayCheckout: (request: any) => void;
  }
}

interface PaymentParams {
  merchant_code: string;
  pay_item_id: string;
  txn_ref: string;
  amount: number;
  currency: number;
  site_redirect_url?: string;
  cust_name?: string;
  cust_email?: string;
  mode: string;
}

interface InterswitchModalProps {
  amount: number;
  bookingId: string;
  paymentParams: PaymentParams | null;
  onClose: () => void;
  onSuccess: (transactionRef: string) => void;
  onError?: (error: string) => void;
}

export default function InterswitchModal({ 
  amount, 
  bookingId,
  paymentParams,
  onClose, 
  onSuccess,
  onError 
}: InterswitchModalProps) {
  const [step, setStep] = useState<"info" | "processing" | "success" | "error">("info")
  const [copied, setCopied] = useState(false)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const testCard = {
    number: "5060 9905 8000 0217 499",
    cvv: "111",
    expiry: "03/50",
    pin: "1111",
  }

  // Check if Interswitch script is loaded (loaded via layout.tsx)
  useEffect(() => {
    // Check if webpayCheckout is available
    const checkScript = () => {
      if (typeof window !== 'undefined' && window.webpayCheckout) {
        console.log('✅ Interswitch script loaded');
        setScriptLoaded(true);
      } else {
        // Retry after a short delay
        setTimeout(checkScript, 100);
      }
    };
    
    checkScript();
  }, []);

  const handlePayment = () => {
    if (!scriptLoaded) {
      setErrorMessage('Payment gateway is still loading. Please wait...');
      return;
    }

    if (!paymentParams) {
      setErrorMessage('Payment parameters not available. Please try again.');
      setStep('error');
      return;
    }

    setStep("processing");

    // Payment callback function
    const paymentCallback = (response: any) => {
      console.log('🔔 ========== INTERSWITCH PAYMENT CALLBACK ==========');
      console.log('📦 Full Response Object:', JSON.stringify(response, null, 2));
      console.log('✅ Response Code (resp):', response.resp);
      console.log('📝 Response Description (desc):', response.desc);
      console.log('📝 Response Code (ResponseCode):', response.ResponseCode);
      console.log('📝 Response Description (ResponseDescription):', response.ResponseDescription);
      console.log('🔍 All Response Keys:', Object.keys(response));
      console.log('========================================');

      // Check response code - '00' means success
      // Interswitch may return either 'resp' or 'ResponseCode'
      const responseCode = response.resp || response.ResponseCode;
      
      if (responseCode === '00') {
        console.log('✅ Payment Successful!');
        // Payment successful
        setStep("success");
        
        // In demo mode, just proceed without backend verification
        setTimeout(() => {
          onSuccess(paymentParams.txn_ref);
        }, 2000);
      } else if (responseCode === 'Z01') {
        // User cancelled payment
        console.log('❌ Payment Cancelled by User');
        setStep("error");
        setErrorMessage('Payment was cancelled');
        if (onError) {
          onError('Payment cancelled');
        }
      } else {
        // Payment failed or other error
        const errorDesc = response.desc || response.ResponseDescription || 'Unknown error';
        console.log('❌ Payment Failed. Response Code:', responseCode, 'Description:', errorDesc);
        setStep("error");
        setErrorMessage(
          errorDesc || 
          'Payment was not completed. Please try again.'
        );
        
        if (onError) {
          onError(errorDesc);
        }
      }
    };

    // Prepare Interswitch payment request - exact format from docs
    const interswitchRequest = {
      merchant_code: paymentParams.merchant_code,
      pay_item_id: paymentParams.pay_item_id,
      txn_ref: paymentParams.txn_ref,
      amount: paymentParams.amount, // Amount in kobo (minor units)
      currency: paymentParams.currency, // 566 for NGN
      cust_id: paymentParams.cust_email || 'rider@openride.demo',
      cust_name: paymentParams.cust_name || 'Demo Rider',
      cust_email: paymentParams.cust_email || 'rider@openride.demo',
      site_redirect_url: paymentParams.site_redirect_url || window.location.origin,
      mode: paymentParams.mode, // TEST or LIVE
      onComplete: paymentCallback,
      callback: paymentCallback // Some versions use 'callback' instead of 'onComplete'
    };

    console.log('Initiating Interswitch payment:', interswitchRequest);

    // Call Interswitch inline checkout
    try {
      if (typeof window.webpayCheckout === 'function') {
        window.webpayCheckout(interswitchRequest);
      } else {
        throw new Error('Interswitch widget not loaded');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      setStep("error");
      setErrorMessage('Failed to initiate payment. Please try again.');
      if (onError) {
        onError('Payment initiation failed');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  };

  const handleRetry = () => {
    setStep("info");
    setErrorMessage("");
  };

  return (
    <Card className="p-4 border border-border">
      {step === "info" && (
        <div className="space-y-4">
          <div>
            <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30 mb-2 text-xs">
              {paymentParams?.mode === 'TEST' ? 'Demo Mode' : 'Live Payment'}
            </Badge>
            <h2 className="text-xl font-bold mb-1">Complete Payment</h2>
            <p className="text-sm text-muted-foreground">
              {paymentParams?.mode === 'TEST' 
                ? 'Interswitch TEST environment' 
                : 'Secure payment powered by Interswitch'}
            </p>
          </div>

          {/* Amount */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-primary">₦{amount.toLocaleString()}</p>
          </div>

          {/* Test Card Info - Only show in TEST mode */}
          {paymentParams?.mode === 'TEST' && (
            <div className="space-y-2">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500" />
                Test Card Information
              </h3>
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Card Number</p>
                    <p className="font-mono text-xs font-semibold">{testCard.number}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(testCard.number.replace(/\s/g, ""))}
                    className="gap-1 h-7 px-2"
                  >
                    <Copy className="w-3 h-3" />
                    <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Expiry</p>
                    <p className="font-mono text-xs font-semibold">{testCard.expiry}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">CVV</p>
                    <p className="font-mono text-xs font-semibold">{testCard.cvv}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">PIN</p>
                    <p className="font-mono text-xs font-semibold">{testCard.pin}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Note */}
          <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-xs text-green-700">
              ✓ Secure connection. Protected by Interswitch encryption.
            </p>
          </div>

          {/* Transaction Reference */}
          {paymentParams && (
            <div className="text-xs text-muted-foreground">
              <p>Ref: {paymentParams.txn_ref}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 flex-1 gap-2" 
              onClick={handlePayment}
              disabled={!scriptLoaded || !paymentParams}
            >
              {scriptLoaded ? `Pay ₦${amount.toLocaleString()}` : 'Loading...'}
            </Button>
          </div>
        </div>
      )}

      {step === "processing" && (
        <div className="space-y-6 text-center py-12">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Processing Payment</h3>
            <p className="text-muted-foreground">Please complete payment in the popup window...</p>
            <p className="text-xs text-muted-foreground mt-2">
              If you don't see a popup, please disable your popup blocker
            </p>
          </div>
        </div>
      )}

      {step === "success" && (
        <div className="space-y-6 text-center py-12">
          <div className="inline-block">
            <CheckCircle className="w-16 h-16 text-green-500 animate-bounce" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground mb-4">
              Your booking has been confirmed. Generating blockchain token...
            </p>
            {paymentParams && (
              <p className="text-xs text-muted-foreground">
                Transaction Reference: {paymentParams.txn_ref}
              </p>
            )}
          </div>
        </div>
      )}

      {step === "error" && (
        <div className="space-y-6 text-center py-12">
          <div className="inline-block">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
            <p className="text-muted-foreground mb-4">
              {errorMessage || 'An error occurred during payment. Please try again.'}
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleRetry} className="bg-primary">
              Try Again
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

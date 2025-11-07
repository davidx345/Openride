"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Wallet, Save, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"

interface BankDetailsProps {
  onBack?: () => void
}

export default function BankDetailsManagement({ onBack }: BankDetailsProps) {
  const [bankDetails, setBankDetails] = useState({
    accountName: "AMARA KELECHI",
    accountNumber: "0123456789",
    bankName: "First Bank of Nigeria",
    bankCode: "011",
  })

  const [isVerified, setIsVerified] = useState(false)

  // Nigerian banks list
  const nigerianBanks = [
    { name: "Access Bank", code: "044" },
    { name: "Citibank Nigeria", code: "023" },
    { name: "Ecobank Nigeria", code: "050" },
    { name: "Fidelity Bank", code: "070" },
    { name: "First Bank of Nigeria", code: "011" },
    { name: "First City Monument Bank (FCMB)", code: "214" },
    { name: "Guaranty Trust Bank (GTBank)", code: "058" },
    { name: "Heritage Bank", code: "030" },
    { name: "Keystone Bank", code: "082" },
    { name: "Polaris Bank", code: "076" },
    { name: "Providus Bank", code: "101" },
    { name: "Stanbic IBTC Bank", code: "221" },
    { name: "Standard Chartered Bank", code: "068" },
    { name: "Sterling Bank", code: "232" },
    { name: "Union Bank of Nigeria", code: "032" },
    { name: "United Bank for Africa (UBA)", code: "033" },
    { name: "Unity Bank", code: "215" },
    { name: "Wema Bank", code: "035" },
    { name: "Zenith Bank", code: "057" },
  ]

  const handleVerifyAccount = () => {
    // Simulate account verification
    if (bankDetails.accountNumber.length === 10) {
      toast.loading("Verifying account...", { duration: 1000 })
      setTimeout(() => {
        setIsVerified(true)
        toast.success("Account verified successfully!")
      }, 1500)
    } else {
      toast.error("Please enter a valid 10-digit account number")
    }
  }

  const handleSave = () => {
    if (!isVerified) {
      toast.error("Please verify your account first")
      return
    }

    // Save to localStorage (demo mode)
    localStorage.setItem("driver_bank_details", JSON.stringify(bankDetails))
    toast.success("Bank details saved successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Bank Details</h1>
          <p className="text-muted-foreground">Manage your payout information</p>
        </div>
        {isVerified && (
          <Badge className="bg-green-500/10 text-green-700 border-green-500/30 gap-2">
            <CheckCircle className="w-4 h-4" />
            Verified
          </Badge>
        )}
      </div>

      {/* Info Alert */}
      <Card className="p-4 bg-blue-500/5 border-blue-500/20">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-semibold text-sm text-blue-900">Why we need this</p>
            <p className="text-sm text-blue-800 mt-1">
              Your earnings will be transferred to this bank account. Please ensure all details are correct.
            </p>
          </div>
        </div>
      </Card>

      {/* Bank Details Form */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Account Information</h3>
            <p className="text-sm text-muted-foreground">Enter your bank account details</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Bank Name */}
          <div className="space-y-2">
            <Label htmlFor="bank">Bank Name</Label>
            <Select
              value={bankDetails.bankName}
              onValueChange={(value) => {
                const bank = nigerianBanks.find((b) => b.name === value)
                setBankDetails({
                  ...bankDetails,
                  bankName: value,
                  bankCode: bank?.code || "",
                })
                setIsVerified(false)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                {nigerianBanks.map((bank) => (
                  <SelectItem key={bank.code} value={bank.name}>
                    {bank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <div className="flex gap-2">
              <Input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) => {
                  setBankDetails({ ...bankDetails, accountNumber: e.target.value })
                  setIsVerified(false)
                }}
                placeholder="Enter 10-digit account number"
                maxLength={10}
                className="flex-1"
              />
              <Button
                onClick={handleVerifyAccount}
                variant="outline"
                disabled={bankDetails.accountNumber.length !== 10}
              >
                Verify
              </Button>
            </div>
          </div>

          {/* Account Name - Auto-filled after verification */}
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={bankDetails.accountName}
              readOnly
              disabled
              placeholder="Will be auto-filled after verification"
              className="bg-muted"
            />
            {isVerified && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Account name verified
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Current Earnings */}
      <Card className="p-6 bg-linear-to-r from-primary/10 to-accent/10">
        <h3 className="font-semibold mb-4">Pending Payout</h3>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-4xl font-bold text-primary">₦68,000</p>
            <p className="text-sm text-muted-foreground mt-1">
              Available for withdrawal
            </p>
          </div>
          <Button variant="outline">
            Request Payout
          </Button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} className="bg-primary gap-2" disabled={!isVerified}>
          <Save className="w-4 h-4" />
          Save Bank Details
        </Button>
      </div>
    </div>
  )
}

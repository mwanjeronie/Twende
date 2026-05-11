"use client";

import { useState } from "react";
import { Building2, MapPin, Phone, Wallet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Merchant } from "@/types";
import { BUSINESS_TYPES, UGANDA_LOCATIONS, shortenAddress } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface BusinessProfileFormProps {
  merchant: Merchant;
}

export function BusinessProfileForm({ merchant }: BusinessProfileFormProps) {
  const [form, setForm] = useState({
    name: merchant.name,
    business_type: merchant.business_type,
    location: merchant.location,
    phone: merchant.phone || "",
    description: merchant.description || "",
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("merchants")
        .update({
          name: form.name,
          business_type: form.business_type,
          location: form.location,
          phone: form.phone || null,
          description: form.description || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", merchant.id);
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="text-base">Business Information</CardTitle>
          <CardDescription>This appears on your payment page</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Business name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            icon={<Building2 className="h-4 w-4" />}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Business type</label>
            <Select value={form.business_type} onValueChange={(v) => update("business_type", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
            <Select value={form.location} onValueChange={(v) => update("location", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UGANDA_LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            label="Phone number"
            placeholder="+256 7XX XXX XXX"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            icon={<Phone className="h-4 w-4" />}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="Brief description of your business..."
              className="flex w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <Button onClick={handleSave} loading={loading}>
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Wallet (read-only) */}
      <Card className="border-slate-100">
        <CardHeader>
          <CardTitle className="text-base">Wallet Address</CardTitle>
          <CardDescription>Contact support to change your wallet address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <Wallet className="h-5 w-5 text-slate-400 shrink-0" />
            <code className="text-sm font-mono text-slate-700 break-all">{merchant.wallet_address}</code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

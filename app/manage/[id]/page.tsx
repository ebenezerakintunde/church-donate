"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { countries } from "@/lib/countries";
import Image from "next/image";
import Link from "next/link";

interface Church {
  _id: string;
  name: string;
  nickname?: string;
  publicId: string;
  country: string;
  address: string;
  description: string;
  logo?: string;
  managerEmails?: string[];
  bankDetails: {
    bankName: string;
    accountName: string;
    iban?: string;
    accountNumber?: string;
    sortCode?: string;
    swiftCode?: string;
    routingNumber?: string;
    revolutLink?: string;
    additionalInfo?: string;
  };
  pageViews: number;
  qrScans: number;
}

export default function ManageChurchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [churchId, setChurchId] = useState<string>("");
  const [church, setChurch] = useState<Church | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [managerEmail, setManagerEmail] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [pendingManagerEmails, setPendingManagerEmails] = useState<string[]>(
    []
  );

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    country: "",
    address: "",
    description: "",
    logo: "",
    bankName: "",
    accountName: "",
    iban: "",
    accountNumber: "",
    sortCode: "",
    swiftCode: "",
    routingNumber: "",
    revolutLink: "",
    additionalInfo: "",
  });
  const [managerEmails, setManagerEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    params.then((p) => setChurchId(p.id));
  }, [params]);

  useEffect(() => {
    if (!churchId) return;

    // Check authentication
    const token = localStorage.getItem("managerToken");
    const email = localStorage.getItem("managerEmail");

    if (!token || !email) {
      router.push("/login");
      return;
    }

    setManagerEmail(email);
    fetchChurch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [churchId, router]);

  const fetchChurch = async () => {
    try {
      const token = localStorage.getItem("managerToken");
      const response = await fetch(`/api/manager/church/${churchId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("managerToken");
          localStorage.removeItem("managerEmail");
          router.push("/login");
          return;
        }
        if (response.status === 403) {
          router.push("/profiles");
          return;
        }
        throw new Error("Failed to fetch church");
      }

      const data = await response.json();
      const churchData = data.church;
      setChurch(churchData);

      // Set form data
      setFormData({
        name: churchData.name || "",
        nickname: churchData.nickname || "",
        country: churchData.country || "",
        address: churchData.address || "",
        description: churchData.description || "",
        logo: churchData.logo || "",
        bankName: churchData.bankDetails.bankName || "",
        accountName: churchData.bankDetails.accountName || "",
        iban: churchData.bankDetails.iban || "",
        accountNumber: churchData.bankDetails.accountNumber || "",
        sortCode: churchData.bankDetails.sortCode || "",
        swiftCode: churchData.bankDetails.swiftCode || "",
        routingNumber: churchData.bankDetails.routingNumber || "",
        revolutLink: churchData.bankDetails.revolutLink || "",
        additionalInfo: churchData.bankDetails.additionalInfo || "",
      });

      setManagerEmails(churchData.managerEmails || []);
      setLogoPreview(churchData.logo || "");
    } catch (error) {
      console.error("Error fetching church:", error);
      setError("Failed to load church");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setFormData({ ...formData, logo: "" });
  };

  const addEmail = () => {
    const email = emailInput.trim().toLowerCase();
    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (managerEmails.includes(email)) {
      setError("This email is already added");
      return;
    }

    if (managerEmails.length >= 3) {
      setError("Maximum 3 manager emails allowed");
      return;
    }

    setManagerEmails([...managerEmails, email]);
    setEmailInput("");
    setError("");
  };

  const removeEmail = (emailToRemove: string) => {
    // Check if trying to remove self
    if (emailToRemove === managerEmail) {
      setPendingManagerEmails(
        managerEmails.filter((email) => email !== emailToRemove)
      );
      setShowWarning(true);
      return;
    }

    setManagerEmails(managerEmails.filter((email) => email !== emailToRemove));
  };

  const confirmRemoveSelf = () => {
    setManagerEmails(pendingManagerEmails);
    setShowWarning(false);
    setPendingManagerEmails([]);
  };

  const cancelRemoveSelf = () => {
    setShowWarning(false);
    setPendingManagerEmails([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const token = localStorage.getItem("managerToken");

      // Upload logo if changed
      let logoUrl = formData.logo;
      if (logoFile && church) {
        try {
          // Convert file to base64
          const base64Promise = new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(logoFile);
          });

          const imageData = await base64Promise;

          const uploadResponse = await fetch("/api/upload/logo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageData,
              publicId: church.publicId,
            }),
          });

          if (uploadResponse.ok) {
            const uploadData = await uploadResponse.json();
            logoUrl = uploadData.logoUrl;
          }
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          // Continue with update even if logo upload fails
        }
      }

      const response = await fetch(`/api/manager/church/${churchId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          nickname: formData.nickname || undefined,
          country: formData.country,
          address: formData.address,
          description: formData.description,
          logo: logoUrl || undefined,
          managerEmails: managerEmails.length > 0 ? managerEmails : undefined,
          bankDetails: {
            bankName: formData.bankName,
            accountName: formData.accountName,
            iban: formData.iban || undefined,
            accountNumber: formData.accountNumber || undefined,
            sortCode: formData.sortCode || undefined,
            swiftCode: formData.swiftCode || undefined,
            routingNumber: formData.routingNumber || undefined,
            revolutLink: formData.revolutLink || undefined,
            additionalInfo: formData.additionalInfo || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update church");
      }

      setSuccess(true);
      setChurch(data.church);
      setLogoFile(null);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update church");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("managerToken");
    localStorage.removeItem("managerEmail");
    router.push("/login");
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!church) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Church not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 rounded-full p-3">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Remove Yourself as Manager?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              You are about to remove yourself as a manager of this church
              profile. You will lose access to edit this profile. This action
              cannot be undone by you.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelRemoveSelf}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                Cancel
              </button>
              <button
                onClick={confirmRemoveSelf}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                Remove Myself
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/profiles"
                className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div className="flex items-center gap-3">
                <Image
                  src="/logos/icon.svg"
                  alt="ChurchDonate"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    Edit Church Profile
                  </h1>
                  <p className="text-sm text-gray-600">{managerEmail}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Church profile updated successfully!
          </div>
        )}

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Statistics
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Direct Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {church.pageViews?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">QR Scans</p>
              <p className="text-2xl font-bold text-gray-900">
                {church.qrScans?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-primary-700">
                {(
                  (church.pageViews || 0) + (church.qrScans || 0)
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Church Information
            </h2>
          </div>

          {/* Church Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Church Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Grace Community Church"
            />
          </div>

          {/* Church Nickname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Church Nickname{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
              placeholder="Grace Church"
            />
          </div>

          {/* Profile Manager Emails */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Manager Emails{" "}
              <span className="text-gray-500 font-normal">
                (Optional, max 3)
              </span>
            </label>

            {/* Email Tags */}
            {managerEmails.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {managerEmails.map((email) => (
                  <div
                    key={email}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${
                      email === managerEmail
                        ? "bg-blue-100 text-blue-800"
                        : "bg-primary-100 text-primary-800"
                    }`}>
                    <span>{email}</span>
                    {email === managerEmail && (
                      <span className="text-xs">(You)</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeEmail(email)}
                      className="hover:bg-primary-200 rounded-full p-0.5 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Email Input */}
            {managerEmails.length < 3 && (
              <div className="flex gap-2">
                <input
                  type="email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEmail();
                    }
                  }}
                  placeholder="manager@church.com"
                />
                <button
                  type="button"
                  onClick={addEmail}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Add
                </button>
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">
              Emails for profile management access. Not shown on public pages.
            </p>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country <span className="text-red-600">*</span>
            </label>
            <select
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="123 Main Street, City"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="A welcoming community church..."
            />
          </div>

          {/* Church Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Church Logo{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>

            {logoPreview && (
              <div className="mb-3 relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, or SVG. Max 5MB.
            </p>
          </div>

          {/* Bank Details Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Bank Details
            </h3>

            <div className="space-y-6">
              {/* Bank Name & Account Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    placeholder="First National Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountName: e.target.value })
                    }
                    placeholder="Church Name"
                  />
                </div>
              </div>

              {/* IBAN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                  value={formData.iban}
                  onChange={(e) =>
                    setFormData({ ...formData, iban: e.target.value })
                  }
                  placeholder="GB29 NWBK 6016 1331 9268 19"
                />
              </div>

              {/* Account Number & Sort Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number{" "}
                    <span className="text-gray-500 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Code{" "}
                    <span className="text-gray-500 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                    value={formData.sortCode}
                    onChange={(e) =>
                      setFormData({ ...formData, sortCode: e.target.value })
                    }
                    placeholder="12-34-56"
                  />
                </div>
              </div>

              {/* SWIFT & Routing Number */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SWIFT/BIC Code{" "}
                    <span className="text-gray-500 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                    value={formData.swiftCode}
                    onChange={(e) =>
                      setFormData({ ...formData, swiftCode: e.target.value })
                    }
                    placeholder="AAAABB12345"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number{" "}
                    <span className="text-gray-500 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                    value={formData.routingNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        routingNumber: e.target.value,
                      })
                    }
                    placeholder="123456789"
                  />
                </div>
              </div>

              {/* Revolut Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revolut Payment Link{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                  value={formData.revolutLink}
                  onChange={(e) =>
                    setFormData({ ...formData, revolutLink: e.target.value })
                  }
                  placeholder="https://revolut.me/..."
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Instructions{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      additionalInfo: e.target.value,
                    })
                  }
                  placeholder="Please include your name in the transfer reference..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <Link
              href="/profiles"
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-center">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Public Link */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Public Donation Page:</p>
            <a
              href={`/church/${church.publicId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-700 hover:text-primary-800 font-medium text-sm break-all">
              {typeof window !== "undefined"
                ? `${window.location.origin}/church/${church.publicId}`
                : ""}
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

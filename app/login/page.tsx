"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PublicNav from "@/app/components/PublicNav";

export default function ManagerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(0);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/manager/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send code");
      }

      setTempToken(data.tempToken);
      setStep("otp");
      startResendTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/manager/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tempToken, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid code");
      }

      // Store session token
      localStorage.setItem("managerToken", data.token);
      localStorage.setItem("managerEmail", email);

      // Redirect to profiles
      router.push("/profiles");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(300); // 5 minutes in seconds

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/manager/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend code");
      }

      setTempToken(data.tempToken);
      startResendTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900">
      <PublicNav />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <Image
                  src="/logos/icon.svg"
                  alt="ChurchDonate"
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Church Manager Login
              </h1>
              <p className="text-primary-200">
                {step === "email"
                  ? "Enter your email to receive a login code"
                  : "Enter the 6-digit code sent to your email"}
              </p>
            </div>

            {/* Email Step */}
            {step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="email"
                    className="block text-white font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    placeholder="your@email.com"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-primary-900 px-6 py-3 rounded-lg font-semibold hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Sending Code..." : "Send Login Code"}
                </button>
              </form>
            )}

            {/* OTP Step */}
            {step === "otp" && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="bg-white/5 border border-white/20 rounded-lg p-4 mb-4">
                  <p className="text-primary-200 text-sm">
                    Code sent to: <span className="text-white">{email}</span>
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="otp"
                    className="block text-white font-medium mb-2">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest placeholder-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent font-mono"
                    placeholder="000000"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full bg-white text-primary-900 px-6 py-3 rounded-lg font-semibold hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? "Verifying..." : "Verify Code"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={!canResend || loading}
                    className="text-primary-300 hover:text-white transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                    {canResend
                      ? "Resend Code"
                      : `Resend in ${formatTime(resendTimer)}`}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setOtp("");
                      setError("");
                    }}
                    className="text-primary-300 hover:text-white transition-colors text-sm">
                    Change Email
                  </button>
                </div>
              </form>
            )}

            {/* Info */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-primary-300 text-sm text-center">
                This login is for church profile managers only. Access expires
                after 1 hour.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { getCountryName } from "@/lib/countries";
import PublicNav from "@/app/components/PublicNav";
import { generateChurchSchema } from "@/lib/seo";
import { getThemeStyles } from "@/lib/colorUtils";
import { Copy, Check } from "lucide-react";

interface Church {
  _id: string;
  name: string;
  nickname?: string;
  publicId: string;
  country: string;
  address: string;
  description: string;
  logo?: string;
  themeColor?: string;
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
  qrCodePath: string;
}

export default function ChurchDonationPage({ church }: { church: Church }) {
  const [copied, setCopied] = useState<string | null>(null);

  // Generate structured data for the church
  const BASE_URL =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || "https://churchdonate.org";

  const churchSchema = generateChurchSchema({
    name: church.name,
    description: church.description,
    address: church.address,
    logoUrl: church.logo,
    url: `${BASE_URL}/church/${church.publicId}`,
  });

  // Get theme styles based on church's theme color
  const theme = getThemeStyles(church.themeColor);

  // Button styling - uses theme color if available, otherwise defaults to primary colors
  const buttonClass = church.themeColor
    ? "text-white px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all text-sm font-medium md:font-semibold shadow-lg hover:opacity-90"
    : "bg-primary-800 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg hover:bg-primary-900 transition-colors text-sm font-medium md:font-semibold shadow-lg";
  const buttonStyle = church.themeColor ? theme.buttonStyle : undefined;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const getAllDonationDetails = () => {
    const details = [
      `${church.name} - Donation Details`,
      "",
      `Bank Name: ${church.bankDetails.bankName}`,
      `Account Name: ${church.bankDetails.accountName}`,
    ];

    if (church.bankDetails.iban) {
      details.push(`IBAN: ${church.bankDetails.iban}`);
    }
    if (church.bankDetails.accountNumber) {
      details.push(`Account Number: ${church.bankDetails.accountNumber}`);
    }
    if (church.bankDetails.sortCode) {
      details.push(`Sort Code: ${church.bankDetails.sortCode}`);
    }
    if (church.bankDetails.swiftCode) {
      details.push(`SWIFT/BIC: ${church.bankDetails.swiftCode}`);
    }
    if (church.bankDetails.routingNumber) {
      details.push(`Routing Number: ${church.bankDetails.routingNumber}`);
    }
    if (church.bankDetails.revolutLink) {
      details.push(`Revolut: ${church.bankDetails.revolutLink}`);
    }
    if (church.bankDetails.additionalInfo) {
      details.push("", `Instructions: ${church.bankDetails.additionalInfo}`);
    }

    return details.join("\n");
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${church.name} - Donation Page`,
          text: `Support ${church.name}`,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.error("Share cancelled", error);
      }
    } else {
      copyToClipboard(shareUrl, "url");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        !church.themeColor
          ? "bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900"
          : ""
      }`}
      style={church.themeColor ? theme.bgGradientStyle : undefined}>
      {/* Church Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(churchSchema),
        }}
      />
      <PublicNav
        textColor={church.themeColor ? theme.textLightColor : undefined}
        useTheme={!!church.themeColor}
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Main Card */}
          <div className="bg-white shadow-2xl overflow-hidden">
            {/* Church Info Section */}
            <div
              className={`text-white p-8 md:p-12 text-center ${
                !church.themeColor
                  ? "bg-gradient-to-r from-primary-800 to-primary-900"
                  : ""
              }`}
              style={church.themeColor ? theme.headerGradientStyle : undefined}>
              {church.logo && (
                <div className="mb-6 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={church.logo}
                    alt={church.name}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {church.name}
              </h1>
              {church.nickname && (
                <p
                  className={`text-xl md:text-2xl mb-4 italic ${
                    !church.themeColor ? "text-primary-300" : ""
                  }`}
                  style={
                    church.themeColor
                      ? { color: theme.textAccentColor }
                      : undefined
                  }>
                  &ldquo;{church.nickname}&rdquo;
                </p>
              )}
              <p
                className={`text-base md:text-xl mb-2 ${
                  !church.themeColor ? "text-primary-200" : ""
                }`}
                style={
                  church.themeColor
                    ? { color: theme.textLightColor }
                    : undefined
                }>
                📍 {church.address}, {getCountryName(church.country)}
              </p>
              <p
                className={`text-base md:text-lg max-w-2xl mx-auto ${
                  !church.themeColor ? "text-primary-300" : ""
                }`}
                style={
                  church.themeColor
                    ? { color: theme.textAccentColor }
                    : undefined
                }>
                {church.description}
              </p>
            </div>

            {/* Donation Details Section */}
            <div className="p-4 md:p-12">
              {/* Donation Details */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 md:mb-8">
                Donation Details
              </h3>
              <div
                className={`rounded-xl md:rounded-2xl p-4 md:p-8 ${
                  !church.themeColor
                    ? "bg-gradient-to-r from-primary-50 to-primary-100"
                    : ""
                }`}
                style={
                  church.themeColor
                    ? {
                        background: `linear-gradient(to right, ${theme.palette?.[50]}, ${theme.palette?.[100]})`,
                      }
                    : undefined
                }>
                <div className="flex flex-col items-center gap-4 mb-4 md:mb-6">
                  <button
                    onClick={() =>
                      copyToClipboard(getAllDonationDetails(), "all")
                    }
                    className={`w-full md:w-auto ${buttonClass} flex items-center justify-center gap-2`}
                    style={buttonStyle}>
                    {copied === "all" ? (
                      <>
                        <Check className="w-4 h-4" />
                        All Details Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy All Details
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4 max-w-2xl mx-auto">
                  {/* Bank Name */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium mb-2">
                          Bank Name
                        </p>
                        <p className="text-sm md:text-lg font-semibold text-gray-900">
                          {church.bankDetails.bankName}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            church.bankDetails.bankName,
                            "bankName"
                          )
                        }
                        className={`w-full md:w-auto ${buttonClass.replace(
                          "md:px-6 md:py-3",
                          "px-4 py-2"
                        )} shrink-0`}
                        style={buttonStyle}>
                        {copied === "bankName" ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Account Name */}
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium mb-2">
                          Account Name
                        </p>
                        <p className="text-base md:text-lg font-semibold text-gray-900">
                          {church.bankDetails.accountName}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            church.bankDetails.accountName,
                            "accountName"
                          )
                        }
                        className={`w-full md:w-auto ${buttonClass.replace(
                          "md:px-6 md:py-3",
                          "px-4 py-2"
                        )} shrink-0`}
                        style={buttonStyle}>
                        {copied === "accountName" ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* IBAN */}
                  {church.bankDetails.iban && (
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 font-medium mb-2">
                            IBAN{" "}
                            <span className="text-xs text-gray-400">
                              (Intl)
                            </span>
                          </p>
                          <p className="text-base md:text-lg font-semibold text-gray-900 font-mono break-all">
                            {church.bankDetails.iban}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            copyToClipboard(church.bankDetails.iban!, "iban")
                          }
                          className={`w-full md:w-auto ${buttonClass.replace(
                            "md:px-6 md:py-3",
                            "px-4 py-2"
                          )} shrink-0`}
                          style={buttonStyle}>
                          {copied === "iban" ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Account Number & Sort Code */}
                  {(church.bankDetails.accountNumber ||
                    church.bankDetails.sortCode) && (
                    <div className="bg-white rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {church.bankDetails.accountNumber && (
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 font-medium mb-2">
                                Account Number
                              </p>
                              <p className="text-base md:text-lg font-semibold text-gray-900 font-mono">
                                {church.bankDetails.accountNumber}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  church.bankDetails.accountNumber!,
                                  "accountNumber"
                                )
                              }
                              className={`w-full md:w-auto ${buttonClass.replace(
                                "md:px-6 md:py-3",
                                "px-4 py-2"
                              )} shrink-0`}
                              style={buttonStyle}>
                              {copied === "accountNumber" ? "✓ Copied" : "Copy"}
                            </button>
                          </div>
                        )}
                        {church.bankDetails.sortCode && (
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 font-medium mb-2">
                                Sort Code{" "}
                                <span className="text-xs text-gray-400">
                                  (UK/IE)
                                </span>
                              </p>
                              <p className="text-base md:text-lg font-semibold text-gray-900 font-mono">
                                {church.bankDetails.sortCode}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  church.bankDetails.sortCode!,
                                  "sortCode"
                                )
                              }
                              className={`w-full md:w-auto ${buttonClass.replace(
                                "md:px-6 md:py-3",
                                "px-4 py-2"
                              )} shrink-0`}
                              style={buttonStyle}>
                              {copied === "sortCode" ? "✓ Copied" : "Copy"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SWIFT & Routing Number */}
                  {(church.bankDetails.swiftCode ||
                    church.bankDetails.routingNumber) && (
                    <div className="bg-white rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {church.bankDetails.swiftCode && (
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 font-medium mb-2">
                                SWIFT/BIC{" "}
                                <span className="text-xs text-gray-400">
                                  (Intl)
                                </span>
                              </p>
                              <p className="text-base md:text-lg font-semibold text-gray-900 font-mono">
                                {church.bankDetails.swiftCode}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  church.bankDetails.swiftCode!,
                                  "swiftCode"
                                )
                              }
                              className={`w-full md:w-auto ${buttonClass.replace(
                                "md:px-6 md:py-3",
                                "px-4 py-2"
                              )} shrink-0`}
                              style={buttonStyle}>
                              {copied === "swiftCode" ? "✓ Copied" : "Copy"}
                            </button>
                          </div>
                        )}
                        {church.bankDetails.routingNumber && (
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 font-medium mb-2">
                                Routing #{" "}
                                <span className="text-xs text-gray-400">
                                  (US)
                                </span>
                              </p>
                              <p className="text-base md:text-lg font-semibold text-gray-900 font-mono">
                                {church.bankDetails.routingNumber}
                              </p>
                            </div>
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  church.bankDetails.routingNumber!,
                                  "routingNumber"
                                )
                              }
                              className={`w-full md:w-auto ${buttonClass.replace(
                                "md:px-6 md:py-3",
                                "px-4 py-2"
                              )} shrink-0`}
                              style={buttonStyle}>
                              {copied === "routingNumber" ? "✓ Copied" : "Copy"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Revolut Link */}
                  {church.bankDetails.revolutLink && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          Revolut Payment Link
                        </p>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              church.bankDetails.revolutLink!,
                              "revolutLink"
                            )
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors text-xs font-medium">
                          {copied === "revolutLink" ? "✓ Copied" : "Copy Link"}
                        </button>
                      </div>
                      <a
                        href={church.bankDetails.revolutLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold w-full text-sm md:text-base">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Pay with Revolut
                      </a>
                    </div>
                  )}

                  {/* Additional Info */}
                  {church.bankDetails.additionalInfo && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Additional Instructions
                      </p>
                      <p className="text-gray-700 whitespace-pre-line">
                        {church.bankDetails.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Support Our Ministry */}
              <div className="my-6 md:my-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">
                  Support Our Ministry
                </h2>
                <p className="text-sm md:text-base text-gray-600">
                  Your generous donations help us continue our mission and serve
                  our community.
                </p>
              </div>

              {/* QR Code */}
              <div className="bg-gray-50 rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-8 text-center">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                  Scan to Share This Page
                </h3>
                <div className="inline-block bg-white p-3 md:p-4 rounded-xl shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={church.qrCodePath}
                    alt="QR Code"
                    className="w-48 h-48 md:w-64 md:h-64 mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Scan with your phone camera to open this page
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <button
                  onClick={() => window.print()}
                  className="flex-1 bg-gray-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl hover:bg-gray-800 transition-colors font-semibold text-base md:text-lg shadow-lg flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print Details
                </button>
                <button
                  onClick={handleShare}
                  className={`flex-1 ${buttonClass} flex items-center justify-center gap-2`}
                  style={buttonStyle}>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  {copied === "url" ? "Link Copied!" : "Share Page"}
                </button>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  Thank you for your generous support!
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Powered by ChurchDonate
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
          .bg-gradient-to-br {
            background: white !important;
          }
          button {
            display: none !important;
          }
          a {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

import Image from "next/image";
import PublicNav from "@/app/components/PublicNav";
import { generateSoftwareApplicationSchema } from "@/lib/seo";

export default function HomePage() {
  const softwareSchema = generateSoftwareApplicationSchema();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900">
      {/* Software Application Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareSchema),
        }}
      />
      <PublicNav />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto text-center text-white">
          {/* Logo/Title */}
          <div className="mb-25 flex flex-col items-center">
            <Image
              src="/logos/full-logo.svg"
              alt="ChurchDonate"
              width={400}
              height={100}
              className="h-16 md:h-20 lg:h-24 w-auto mb-4"
              priority
            />
            <p className="text-xl md:text-2xl text-primary-300">
              Simplified Church Giving
            </p>
          </div>

          {/* Hero Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-12 mb-8 md:mb-12 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 md:mb-6">
              Create Beautiful Donation Pages with QR Codes
            </h2>
            <p className="text-base md:text-xl text-primary-200 mb-6 md:mb-8 leading-relaxed">
              ChurchDonate makes church giving easy, secure, and accessible.
              Create profiles for churches with donation bank details and
              automatically generate unique public donation pages with QR codes
              for sharing or printing.
            </p>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Secure & Protected
              </h3>
              <p className="text-primary-300">
                2FA authentication and JWT-based security to protect your data
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                QR Code Generation
              </h3>
              <p className="text-primary-300">
                Automatic QR codes for easy sharing and printing
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Custom Branding
              </h3>
              <p className="text-primary-300">
                Match your church&apos;s brand with custom theme colors
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Fast & Simple
              </h3>
              <p className="text-primary-300">
                Create donation pages in seconds with our intuitive interface
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                No Transaction Fees
              </h3>
              <p className="text-primary-300">
                Keep 100% of donations — funds go directly to your church
                account
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Works Globally
              </h3>
              <p className="text-primary-300">
                Support for IBAN, SWIFT, Routing Numbers, and local payment
                methods
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-primary-300 text-sm">
            <p className="mt-2">Secure • Modern • Easy to Use</p>
          </div>
        </div>
      </div>
    </div>
  );
}

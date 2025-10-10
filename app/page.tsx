import Image from "next/image";
import PublicNav from "@/app/components/PublicNav";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900">
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

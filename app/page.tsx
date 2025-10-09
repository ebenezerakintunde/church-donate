import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900">
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
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                Secure & Protected
              </h3>
              <p className="text-primary-300">
                2FA authentication and JWT-based security to protect your data
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">
                QR Code Generation
              </h3>
              <p className="text-primary-300">
                Automatic QR codes for easy sharing and printing
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="text-4xl mb-4">⚡</div>
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

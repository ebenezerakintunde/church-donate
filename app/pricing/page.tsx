import { Metadata } from "next";
import PublicNav from "@/app/components/PublicNav";
import Link from "next/link";
import Image from "next/image";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Pricing - ChurchDonate",
  description:
    "Simple, transparent pricing at €50/year per church. No hidden fees, no transaction costs. Keep 100% of your donations with ChurchDonate.",
  path: "/pricing",
  keywords: [
    "churchdonate pricing",
    "church donation software cost",
    "church giving platform pricing",
    "affordable church software",
    "church donation fees",
    "no transaction fees",
  ],
});

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900">
      <PublicNav />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Image
                src="/logos/icon.svg"
                alt="ChurchDonate"
                width={80}
                height={80}
                className="w-16 h-16 md:w-20 md:h-20"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Together, We Keep It Going
            </h1>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 text-white space-y-8">
            {/* Introduction */}
            <section className="text-center">
              <p className="text-primary-200 leading-relaxed text-lg mb-6">
                ChurchDonate was created to serve local churches with
                simplicity, excellence, and integrity. To keep the platform
                secure, reliable, and growing, we invite each church to
                contribute a small annual platform support of{" "}
                <span className="text-white font-bold text-lg">€50</span>.
              </p>
              <p className="text-primary-200 leading-relaxed text-lg">
                This contribution helps cover hosting, maintenance, and ongoing
                improvements — ensuring that every church&apos;s profile remains
                available, protected, and easy to share all year round.
              </p>
            </section>

            {/* Pricing Card */}
            <section className="max-w-md mx-auto">
              <div className="bg-white/5 border-2 border-primary-300 rounded-2xl p-8 text-center">
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-primary-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  €50
                  <span className="text-lg font-normal text-primary-200">
                    {" "}
                    / year
                  </span>
                </h2>
                <p className="text-primary-300 mb-6">Per Church Profile</p>

                <div className="text-left space-y-3 mb-8">
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-300 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-primary-200">
                      Secure hosting and maintenance
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-300 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-primary-200">
                      Ongoing platform improvements
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-300 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-primary-200">
                      24/7 profile availability
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-300 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-primary-200">
                      QR code generation and updates
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-primary-300 shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-primary-200">Technical support</span>
                  </div>
                </div>

                <Link
                  href="/get-started"
                  className="block w-full bg-white text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-100 transition-colors">
                  Set Up Your Church Profile
                </Link>
              </div>
            </section>

            {/* Why Your Support Matters */}
            <section className="border-t border-white/20 pt-8">
              <div className="flex items-center gap-2 md:gap-3 mb-4">
                <svg
                  className="w-8 h-8 text-primary-300"
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
                <h2 className="text-xl md:text-3xl font-bold">
                  Why Your Support Matters
                </h2>
              </div>
              <p className="text-primary-200 leading-relaxed text-lg">
                Your support isn&apos;t just a fee; it&apos;s a shared
                investment that helps us continue serving churches everywhere
                with a dependable, beautiful, and purpose-driven platform. Your
                contribution helps us keep ChurchDonate running smoothly and
                securely for churches everywhere.
              </p>
            </section>

            {/* Call to Action */}
            <section className="text-center pt-8 border-t border-white/20">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-200 mb-6">
                Contact us today to set up your church&apos;s donation profile
                and join churches around the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/get-started"
                  className="inline-block bg-white text-primary-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-100 transition-colors">
                  Get Started
                </Link>
                <Link
                  href="/about"
                  className="inline-block bg-white/10 border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                  Learn More
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

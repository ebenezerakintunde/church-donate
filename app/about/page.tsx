import { Metadata } from "next";
import PublicNav from "@/app/components/PublicNav";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - ChurchDonate",
  description:
    "Learn more about ChurchDonate and our mission to make church giving simple, safe, and easy to share.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900">
      <PublicNav />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              About ChurchDonate
            </h1>
            <p className="text-xl text-primary-200">
              Making Church Giving Simple, Safe, and Easy to Share
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 text-white space-y-8">
            {/* Introduction */}
            <section>
              <div className="flex items-center gap-2 md:gap-3 mb-6">
                <h2 className="text-xl md:text-3xl font-bold">
                  Simplify How You Give
                </h2>
              </div>
              <p className="text-primary-200 leading-relaxed text-lg">
                ChurchDonate was created to help churches stay connected with
                their members in a simple, trusted way. It provides a clear and
                convenient place where people can easily find their
                church&apos;s verified account details whenever they need them.
              </p>
              <p className="text-primary-200 leading-relaxed text-lg mt-4">
                Our heart is to make giving effortless — no confusion, no extra
                steps — just a beautifully presented way to stay connected and
                support the ministry you love.
              </p>
            </section>

            {/* What Churches Get */}
            <section>
              <div className="flex items-center gap-2 md:gap-3 mb-6">
                <svg
                  className="w-8 h-8 text-primary-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="text-xl md:text-3xl font-bold">
                  What Churches Get
                </h2>
              </div>

              <div className="space-y-4">
                {/* Simple Digital Giving Page */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="w-6 h-6 text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">
                      A Simple Digital Giving Page
                    </h3>
                  </div>
                  <p className="text-primary-200 leading-relaxed mb-3">
                    Each church receives its own personalized donation profile,
                    thoughtfully designed to look great on any device.
                  </p>
                  <p className="text-primary-200 mb-3">
                    Your profile includes:
                  </p>
                  <ul className="space-y-2 text-primary-200 ml-6">
                    <li>
                      • Church name, logo, address, and a short description
                    </li>
                    <li>
                      • Verified bank account details (IBAN, Sort Code,
                      SWIFT/BIC, Routing Number)
                    </li>
                    <li>• Support for direct payment links such as Revolut</li>
                    <li>• One-click copy buttons for all account details</li>
                    <li>
                      • A print-friendly layout perfect for bulletins and flyers
                    </li>
                  </ul>
                  <p className="text-primary-300 mt-4 italic flex items-start gap-2">
                    <svg
                      className="w-5 h-5 shrink-0 mt-0.5"
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
                    <span>
                      A clear and secure way for people to connect with your
                      church anytime.
                    </span>
                  </p>
                </div>

                {/* QR Code Access */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="w-6 h-6 text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">
                      QR Code Access
                    </h3>
                  </div>
                  <p className="text-primary-200 leading-relaxed mb-3">
                    Each church automatically receives a unique QR code that
                    opens their giving profile instantly. It&apos;s perfect for
                    posters, screens, banners, or handouts — anywhere people
                    might want to give or connect quickly.
                  </p>
                  <p className="text-primary-300 mt-4 italic flex items-start gap-2">
                    <svg
                      className="w-5 h-5 shrink-0 mt-0.5"
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
                    <span>
                      Just scan, view, and give — simple and familiar for
                      everyone.
                    </span>
                  </p>
                </div>

                {/* Simple Insights */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="w-6 h-6 text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">
                      Simple Insights
                    </h3>
                  </div>
                  <p className="text-primary-200 mb-3">
                    Churches can see at a glance:
                  </p>
                  <ul className="space-y-2 text-primary-200 ml-6">
                    <li>• How many times their page has been viewed</li>
                    <li>• How many people have scanned their QR code</li>
                    <li>• When the profile was last updated</li>
                  </ul>
                  <p className="text-primary-300 mt-4 italic flex items-start gap-2">
                    <svg
                      className="w-5 h-5 shrink-0 mt-0.5"
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
                    <span>
                      Helpful insights to see how people are engaging with your
                      church profile.
                    </span>
                  </p>
                </div>

                {/* Works Anywhere */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="w-6 h-6 text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">
                      Works Anywhere
                    </h3>
                  </div>
                  <p className="text-primary-200 mb-3">
                    ChurchDonate supports local and international account
                    formats, including:
                  </p>
                  <ul className="space-y-2 text-primary-200 ml-6">
                    <li>• IBAN (Europe & beyond)</li>
                    <li>• Sort Code + Account Number (UK & Ireland)</li>
                    <li>
                      • SWIFT/BIC and Routing Numbers (for international
                      transfers)
                    </li>
                    <li>• Revolut and other local payment options</li>
                  </ul>
                  <p className="text-primary-300 mt-4 italic flex items-start gap-2">
                    <svg
                      className="w-5 h-5 shrink-0 mt-0.5"
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
                    <span>
                      So whether members are nearby or abroad, they can always
                      stay connected.
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* For Church Administrators */}
            <section>
              <div className="flex items-center gap-2 md:gap-3 mb-6">
                <svg
                  className="w-8 h-8 text-primary-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h2 className="text-xl md:text-3xl font-bold">
                  For Church Administrators
                </h2>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <svg
                    className="w-6 h-6 text-primary-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-white">
                    Easy Management Dashboard
                  </h3>
                </div>
                <p className="text-primary-200 mb-3">Church admins can:</p>
                <ul className="space-y-2 text-primary-200 ml-6">
                  <li>• Securely log in with two-step verification</li>
                  <li>• Add or update church profiles</li>
                  <li>• Upload a church logo and description</li>
                  <li>• View page and QR activity</li>
                  <li>• Manage multiple churches with ease</li>
                </ul>
                <p className="text-primary-300 mt-4 italic flex items-start gap-2">
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5"
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
                  <span>
                    Simple, secure, and designed for real church teams — no
                    technical skills required.
                  </span>
                </p>
              </div>
            </section>

            {/* Why Churches Love ChurchDonate */}
            <section>
              <div className="flex items-center gap-2 md:gap-3 mb-6">
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
                  Why Churches Love ChurchDonate
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 text-primary-200">
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg
                      className="w-6 h-6 text-primary-300"
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
                    <h3 className="text-xl font-semibold text-white">
                      Built for the Local Church
                    </h3>
                  </div>
                  <p>
                    ChurchDonate feels personal — designed for the kind of
                    church where everyone knows each other, and connection still
                    matters most.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg
                      className="w-6 h-6 text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">
                      Simple and Familiar
                    </h3>
                  </div>
                  <p>
                    The way your church already operates, just made easier to
                    access and share.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg
                      className="w-6 h-6 text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">
                      Secure and Trusted
                    </h3>
                  </div>
                  <p>
                    Every detail is handled safely, and access is protected with
                    two-step verification. You stay in control of your
                    information at all times.
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <svg
                      className="w-6 h-6 text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-white">
                      Accessible Anywhere
                    </h3>
                  </div>
                  <p>
                    Works beautifully on phones, tablets, and computers — in
                    service, at home, or on the go.
                  </p>
                </div>
              </div>
            </section>

            {/* In Short */}
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
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                <h2 className="text-xl md:text-3xl font-bold">In Short</h2>
              </div>
              <p className="text-primary-200 leading-relaxed text-lg">
                ChurchDonate helps your church share its giving details easily
                and confidently — online or in person. It&apos;s not a payment
                processor or campaign tool; it&apos;s simply a thoughtful way to
                help your members connect, give, and stay part of what God is
                doing in your church.
              </p>
            </section>

            {/* Call to Action */}
            <section className="text-center pt-8 border-t border-white/20">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-200 mb-6">
                Join churches around the world using ChurchDonate to simplify
                their giving process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/get-started"
                  className="inline-block bg-white text-primary-900 px-8 py-3 rounded-lg font-semibold hover:bg-primary-100 transition-colors">
                  Get Started
                </Link>
                <Link
                  href="/contact"
                  className="inline-block bg-white/10 border border-white/20 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                  Contact Us
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

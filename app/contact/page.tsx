import { Metadata } from "next";
import PublicNav from "@/app/components/PublicNav";
import Link from "next/link";
import { generatePageMetadata, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact Us - ChurchDonate",
  description:
    "Get in touch with ChurchDonate for support or inquiries. Our team is here to help with technical support, general questions, and onboarding assistance.",
  path: "/contact",
  keywords: [
    "contact churchdonate",
    "church donation support",
    "customer support",
    "technical help",
    "church software assistance",
  ],
});

export default function ContactPage() {
  // FAQ Structured Data
  const faqSchema = generateFAQSchema([
    {
      question: "What makes ChurchDonate different?",
      answer:
        "ChurchDonate focuses specifically on churches, providing donation information pages with QR codes rather than processing payments. This means no transaction fees, and donors send money directly to your church's bank account using their preferred banking method.",
    },
    {
      question: "How secure is my church's information?",
      answer:
        "Very secure. We use enterprise-grade security measures including JWT-based authentication, 2FA, and encrypted data storage. Your church's information is protected with industry-standard security protocols.",
    },
    {
      question: "Can I customize our donation page?",
      answer:
        "Yes! You can add your church logo, customize your description, include detailed bank information for multiple countries, add Revolut links, and include special instructions for donors.",
    },
    {
      question: "Does ChurchDonate process payments?",
      answer:
        "No, ChurchDonate provides the donation information pages and QR codes. Donors send money directly to your church's bank account using their preferred banking method. You receive 100% of all donations without any payment processing intermediaries.",
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-primary-900">
      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <PublicNav />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-primary-200">
              We&apos;re here to help with any questions or support you need
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 text-white">
            {/* Contact Information */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Get In Touch
              </h2>
              <p className="text-primary-200 text-center leading-relaxed mb-8">
                Whether you need technical support, have questions about our
                platform, or want to learn more about how ChurchDonate can help
                your church, we&apos;re here to assist you.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Support */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary-600 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">Technical Support</h3>
                  </div>
                  <p className="text-primary-200 mb-4">
                    Need help with your church profile or having technical
                    issues? Our support team is ready to assist.
                  </p>
                  <a
                    href="mailto:support@churchdonate.org"
                    className="text-primary-300 hover:text-white transition-colors font-medium">
                    support@churchdonate.org
                  </a>
                </div>

                {/* General Inquiries */}
                <div className="bg-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-primary-600 p-3 rounded-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold">General Inquiries</h3>
                  </div>
                  <p className="text-primary-200 mb-4">
                    Have questions about our platform or want to learn more
                    about what we offer?
                  </p>
                  <a
                    href="mailto:info@churchdonate.org"
                    className="text-primary-300 hover:text-white transition-colors font-medium">
                    info@churchdonate.org
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    What makes ChurchDonate different?
                  </h3>
                  <p className="text-primary-200">
                    ChurchDonate focuses specifically on churches, providing
                    donation information pages with QR codes rather than
                    processing payments. This means no transaction fees, and
                    donors send money directly to your church&apos;s bank
                    account using their preferred banking method.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    How secure is my church&apos;s information?
                  </h3>
                  <p className="text-primary-200">
                    Very secure. We use enterprise-grade security measures
                    including JWT-based authentication, 2FA, and encrypted data
                    storage. Your church&apos;s information is protected with
                    industry-standard security protocols.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Can I customize our donation page?
                  </h3>
                  <p className="text-primary-200">
                    Yes! You can add your church logo, customize your
                    description, include detailed bank information for multiple
                    countries, add Revolut links, and include special
                    instructions for donors.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    How do I get started?
                  </h3>
                  <p className="text-primary-200">
                    Fill out our{" "}
                    <Link
                      href="/get-started"
                      className="text-primary-300 hover:text-white transition-colors font-medium">
                      Get Started form
                    </Link>{" "}
                    with your church information, and we&apos;ll reach out to
                    help set up your church account. We&apos;ll guide you
                    through the process and have your donation page ready in no
                    time.
                  </p>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Does ChurchDonate process payments?
                  </h3>
                  <p className="text-primary-200">
                    No, ChurchDonate provides the donation information pages and
                    QR codes. Donors send money directly to your church&apos;s
                    bank account using their preferred banking method. You
                    receive 100% of all donations without any payment processing
                    intermediaries.
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Resources */}
            <section className="text-center pt-8 border-t border-white/20">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-primary-200 mb-6">
                Set up your church&apos;s donation profile today or learn more
                about what ChurchDonate can do for your church.
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

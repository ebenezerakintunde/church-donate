import { Metadata } from "next";
import Link from "next/link";
import ChurchDonationPage from "./ChurchDonationPage";
import connectDB from "@/lib/db";
import Church from "@/models/Church";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ source?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    await connectDB();
    const church = await Church.findOne({ publicId: id }).lean();

    if (!church) {
      return {
        title: "Church Not Found - ChurchDonate",
      };
    }

    return {
      title: `${church.name} - Donation Page | ChurchDonate`,
      description: `Support ${church.name}. ${church.description}`,
    };
  } catch (error) {
    return {
      title: "ChurchDonate",
    };
  }
}

export default async function ChurchPage({ params, searchParams }: Props) {
  try {
    const { id } = await params;
    const { source } = await searchParams;

    await connectDB();
    const church = await Church.findOne({ publicId: id }).lean();

    if (!church) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <svg
                className="w-24 h-24 text-purple-600"
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Church Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The church you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link
              href="/"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
              Go to Homepage
            </Link>
          </div>
        </div>
      );
    }

    // Track page view or QR scan
    try {
      if (source === "qr") {
        // Increment QR scans
        await Church.findByIdAndUpdate(church._id, { $inc: { qrScans: 1 } });
      } else {
        // Increment regular page views
        await Church.findByIdAndUpdate(church._id, { $inc: { pageViews: 1 } });
      }
    } catch (error) {
      console.error("[View Tracking] Failed to increment view count:", error);
    }

    // Convert MongoDB document to plain object
    const churchData = JSON.parse(JSON.stringify(church));

    return <ChurchDonationPage church={churchData} />;
  } catch (error) {
    console.error("Error loading church:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="w-24 h-24 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Church
          </h1>
          <p className="text-gray-600 mb-6">
            Something went wrong. Please try again later.
          </p>
          <Link
            href="/"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }
}

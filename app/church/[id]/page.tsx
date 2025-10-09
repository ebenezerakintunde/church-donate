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
            <div className="text-6xl mb-4">⛪</div>
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
          <div className="text-6xl mb-4">❌</div>
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

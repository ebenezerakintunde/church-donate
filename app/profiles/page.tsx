"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface Church {
  _id: string;
  name: string;
  nickname?: string;
  publicId: string;
  slug: string;
  country: string;
  address: string;
  description: string;
  logo?: string;
  pageViews: number;
  qrScans: number;
  createdAt: string;
  updatedAt: string;
}

export default function ManagerProfilesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [managerEmail, setManagerEmail] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("managerToken");
    const email = localStorage.getItem("managerEmail");

    if (!token || !email) {
      router.push("/login");
      return;
    }

    setManagerEmail(email);
    fetchChurches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchChurches = async () => {
    try {
      const token = localStorage.getItem("managerToken");
      const response = await fetch("/api/manager/churches", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("managerToken");
          localStorage.removeItem("managerEmail");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch churches");
      }

      const data = await response.json();
      setChurches(data.churches);
    } catch (error) {
      console.error("Error fetching churches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("managerToken");
    localStorage.removeItem("managerEmail");
    router.push("/login");
  };

  const getTotalViews = (church: Church) => {
    return (church.pageViews || 0) + (church.qrScans || 0);
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logos/icon.svg"
                alt="ChurchDonate"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Church Manager
                </h1>
                <p className="text-sm text-gray-600">{managerEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your Church Profiles
          </h2>
          <p className="text-gray-600">
            Manage and update the churches you oversee
          </p>
        </div>

        {churches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Churches Found
            </h3>
            <p className="text-gray-600">
              You haven&apos;t been assigned to manage any church profiles yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {churches.map((church) => (
              <Link
                key={church._id}
                href={`/manage/${church._id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden group">
                {/* Church Logo */}
                {church.logo ? (
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={church.logo}
                      alt={church.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-primary-600"
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
                )}

                {/* Church Details */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">
                    {church.name}
                  </h3>
                  {church.nickname && (
                    <p className="text-sm text-gray-600 italic mb-2">
                      &ldquo;{church.nickname}&rdquo;
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {church.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500">Direct Views</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {church.pageViews?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">QR Scans</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {church.qrScans?.toLocaleString() || 0}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Total Views</p>
                    <p className="text-xl font-bold text-primary-700">
                      {getTotalViews(church).toLocaleString()}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="mt-4 flex items-center justify-between text-primary-700 font-medium text-sm group-hover:text-primary-800">
                    <span>Edit Profile</span>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

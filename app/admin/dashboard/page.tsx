"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { countries, getCountryName } from "@/lib/countries";
import AdminLayout from "../components/AdminLayout";

interface Church {
  _id: string;
  name: string;
  nickname?: string;
  publicId?: string; // Optional for backwards compatibility with existing churches
  slug?: string; // Optional for backwards compatibility
  country: string;
  address: string;
  description: string;
  logo?: string;
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
  pageViews?: number;
  qrScans?: number;
  viewCount?: number; // Backwards compatibility
  createdAt: string;
  updatedAt: string;
}

type SortField =
  | "name"
  | "createdAt"
  | "updatedAt"
  | "pageViews"
  | "qrScans"
  | "totalViews"
  | "viewCount";
type SortDirection = "asc" | "desc";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [churches, setChurches] = useState<Church[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChurch, setEditingChurch] = useState<Church | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setMounted(true);
    // Load items per page preference from localStorage
    const savedItemsPerPage = localStorage.getItem("dashboardItemsPerPage");
    if (savedItemsPerPage) {
      setItemsPerPage(parseInt(savedItemsPerPage, 10));
    }
  }, []);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchChurches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchChurches = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/church", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/admin/login");
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this church?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/church/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete church");
      }

      fetchChurches();
    } catch (error) {
      console.error("Error deleting church:", error);
      alert("Failed to delete church");
    }
  };

  // Filter and sort churches
  const filteredChurches = churches
    .filter((church) => {
      const query = searchQuery.toLowerCase();
      return (
        church.name.toLowerCase().includes(query) ||
        church.address.toLowerCase().includes(query) ||
        church.publicId?.toLowerCase().includes(query) ||
        church.nickname?.toLowerCase().includes(query) ||
        getCountryName(church.country).toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let aVal: string | number | Date;
      let bVal: string | number | Date;

      switch (sortField) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "pageViews":
          aVal = a.pageViews || 0;
          bVal = b.pageViews || 0;
          break;
        case "qrScans":
          aVal = a.qrScans || 0;
          bVal = b.qrScans || 0;
          break;
        case "totalViews":
          aVal = (a.pageViews || 0) + (a.qrScans || 0);
          bVal = (b.pageViews || 0) + (b.qrScans || 0);
          break;
        case "viewCount":
          aVal = a.viewCount || 0;
          bVal = b.viewCount || 0;
          break;
        case "createdAt":
          aVal = new Date(a.createdAt);
          bVal = new Date(b.createdAt);
          break;
        case "updatedAt":
          aVal = new Date(a.updatedAt);
          bVal = new Date(b.updatedAt);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
    localStorage.setItem("dashboardItemsPerPage", value.toString());
  };

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate analytics
  const totalViews = churches.reduce(
    (sum, church) => sum + (church.pageViews || 0) + (church.qrScans || 0),
    0
  );
  const totalPageViews = churches.reduce(
    (sum, church) => sum + (church.pageViews || 0),
    0
  );
  const totalQrScans = churches.reduce(
    (sum, church) => sum + (church.qrScans || 0),
    0
  );
  const mostViewedChurch =
    churches.length > 0
      ? churches.reduce((prev, current) => {
          const currentTotal =
            (current.pageViews || 0) + (current.qrScans || 0);
          const prevTotal = (prev.pageViews || 0) + (prev.qrScans || 0);
          return currentTotal > prevTotal ? current : prev;
        })
      : null;
  const recentlyUpdated =
    churches.length > 0
      ? churches.reduce((prev, current) =>
          new Date(current.updatedAt) > new Date(prev.updatedAt)
            ? current
            : prev
        )
      : null;

  // Pagination calculations
  const totalPages = Math.ceil(filteredChurches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedChurches = filteredChurches.slice(startIndex, endIndex);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Churches
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                  {churches.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-primary-800"
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
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Views</p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                  {totalViews.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {totalPageViews.toLocaleString()} direct •{" "}
                  {totalQrScans.toLocaleString()} QR scans
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 font-medium">Most Viewed</p>
                <p className="text-sm md:text-base font-bold text-gray-900 mt-1 truncate">
                  {mostViewedChurch ? mostViewedChurch.name : "N/A"}
                </p>
                {mostViewedChurch && (
                  <p className="text-xs text-gray-500">
                    {(
                      (mostViewedChurch.pageViews || 0) +
                      (mostViewedChurch.qrScans || 0)
                    ).toLocaleString()}{" "}
                    views ({mostViewedChurch.pageViews || 0} direct,{" "}
                    {mostViewedChurch.qrScans || 0} QR)
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="currentColor"
                  viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 border border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 font-medium">
                  Last Updated
                </p>
                <p className="text-sm md:text-base font-bold text-gray-900 mt-1 truncate">
                  {recentlyUpdated ? recentlyUpdated.name : "N/A"}
                </p>
                {recentlyUpdated && (
                  <p className="text-xs text-gray-500">
                    {new Date(recentlyUpdated.updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:flex-1 sm:max-w-md">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              Churches
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search churches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                Showing {filteredChurches.length} of {churches.length} churches
              </p>
            )}
          </div>
          <button
            onClick={() => {
              setEditingChurch(null);
              setShowModal(true);
            }}
            className="bg-primary-800 text-white px-5 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-primary-900 transition-colors font-semibold shadow-lg text-sm md:text-base w-full sm:w-auto shrink-0">
            + Add New Church
          </button>
        </div>

        {/* Churches Grid */}
        {filteredChurches.length === 0 && searchQuery ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Churches Found
            </h3>
            <p className="text-gray-600 mb-6">
              No churches match your search &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="bg-primary-800 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors font-semibold">
              Clear Search
            </button>
          </div>
        ) : churches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary-800"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Churches Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first church profile
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-800 text-white px-6 py-3 rounded-lg hover:bg-primary-900 transition-colors font-semibold">
              Create First Church
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-2">
                        Church Name
                        {sortField === "name" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Location
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("viewCount")}>
                      <div className="flex items-center gap-2">
                        Views
                        {sortField === "viewCount" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("updatedAt")}>
                      <div className="flex items-center gap-2">
                        Last Updated
                        {sortField === "updatedAt" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedChurches.map((church) => (
                    <tr
                      key={church._id}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {church.logo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={church.logo}
                              alt={church.name}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">
                              {church.name}
                            </p>
                            {church.nickname && (
                              <p className="text-xs text-gray-500 italic">
                                &quot;{church.nickname}&quot;
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {church.address}
                        </p>
                        <p className="text-xs text-gray-500">
                          {getCountryName(church.country)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {church.pageViews || 0} direct
                        </p>
                        <p className="text-xs text-gray-500">
                          {church.qrScans || 0} QR
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">
                          {new Date(church.updatedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(church.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              window.open(
                                `/church/${church.publicId || church._id}`,
                                "_blank"
                              )
                            }
                            disabled={!church.publicId}
                            className="bg-primary-800 text-white px-3 py-1.5 rounded-lg hover:bg-primary-900 transition-colors text-xs font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                            title="View donation page">
                            View
                          </button>
                          <button
                            onClick={() => {
                              setEditingChurch(church);
                              setShowModal(true);
                            }}
                            className="bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors text-xs font-medium"
                            title="Edit church">
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(church._id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-xs font-medium"
                            title="Delete church">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {paginatedChurches.map((church) => (
                <div key={church._id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    {church.logo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={church.logo}
                        alt={church.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{church.name}</h3>
                      {church.nickname && (
                        <p className="text-xs text-gray-500 italic">
                          &quot;{church.nickname}&quot;
                        </p>
                      )}
                      <p className="text-sm text-gray-600 mt-1">
                        📍 {church.address}, {getCountryName(church.country)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      {(church.pageViews || 0) + (church.qrScans || 0)} views (
                      {church.qrScans || 0} QR)
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {new Date(church.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {!church.publicId && (
                    <div className="bg-red-50 rounded-lg p-2 mb-3">
                      <p className="text-xs text-red-600">
                        ⚠️ Missing publicId - please delete and recreate
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        window.open(
                          `/church/${church.publicId || church._id}`,
                          "_blank"
                        )
                      }
                      disabled={!church.publicId}
                      className="flex-1 bg-primary-800 text-white px-4 py-2 rounded-lg hover:bg-primary-900 transition-colors text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed">
                      View
                    </button>
                    <button
                      onClick={() => {
                        setEditingChurch(church);
                        setShowModal(true);
                      }}
                      className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(church._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {filteredChurches.length > 0 && (
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            {/* Items per page selector */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700 font-medium">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(parseInt(e.target.value, 10))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm text-gray-900">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            {/* Page info and navigation */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} -{" "}
                {Math.min(endIndex, filteredChurches.length)} of{" "}
                {filteredChurches.length}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="First page">
                  «
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous page">
                  ‹
                </button>

                <span className="px-4 py-2 text-sm font-medium text-gray-900">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next page">
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Last page">
                  »
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <ChurchModal
            church={editingChurch}
            onClose={() => {
              setShowModal(false);
              setEditingChurch(null);
            }}
            onSave={() => {
              setShowModal(false);
              setEditingChurch(null);
              fetchChurches();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Generate random church data for testing
function generateRandomChurchData() {
  const churchNames = [
    "Grace Community Church",
    "Faith Fellowship Church",
    "Hope Baptist Church",
    "New Life Christian Center",
    "Trinity Methodist Church",
    "Cornerstone Assembly",
    "Riverside Church",
    "Mountain View Chapel",
    "Lighthouse Church",
    "Harvest Church",
    "Victory Christian Center",
    "Crossroads Church",
    "Bethel Church",
    "Calvary Chapel",
    "The Way Church",
  ];

  const cities = [
    "London",
    "Manchester",
    "Birmingham",
    "Dublin",
    "Belfast",
    "Edinburgh",
    "Glasgow",
    "Cardiff",
    "Leeds",
    "Liverpool",
  ];

  const streets = [
    "Main Street",
    "Church Road",
    "High Street",
    "Chapel Lane",
    "Park Avenue",
    "Oak Street",
    "Market Square",
    "Hill Road",
  ];

  const descriptions = [
    "A welcoming community dedicated to worship, fellowship, and serving our neighbors with love and compassion.",
    "Join us for inspiring worship services and meaningful connections in a warm, family-friendly environment.",
    "We are a vibrant faith community committed to spreading God's love through worship, prayer, and service.",
    "Come experience authentic worship and genuine fellowship in our growing church family.",
    "A place where faith meets community, offering hope and support to all who enter our doors.",
  ];

  const randomName =
    churchNames[Math.floor(Math.random() * churchNames.length)];
  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomStreet = streets[Math.floor(Math.random() * streets.length)];
  const randomNumber = Math.floor(Math.random() * 999) + 1;
  const randomDesc =
    descriptions[Math.floor(Math.random() * descriptions.length)];

  return {
    name: randomName,
    nickname: randomName.split(" ")[0] + " Church",
    country: "GB",
    address: `${randomNumber} ${randomStreet}, ${randomCity}`,
    description: randomDesc,
    bankName: "HSBC Bank",
    accountName: randomName,
    iban: `GB${Math.floor(Math.random() * 90 + 10)}HBUK${Math.floor(
      Math.random() * 100000000000000
    )
      .toString()
      .padStart(14, "0")}`,
    accountNumber: Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0"),
    sortCode: `${Math.floor(Math.random() * 90 + 10)}-${Math.floor(
      Math.random() * 90 + 10
    )}-${Math.floor(Math.random() * 90 + 10)}`,
    swiftCode: "HBUKGB4B",
    routingNumber: "",
    revolutLink: "",
    additionalInfo: "Please include your full name in the payment reference.",
  };
}

// Church Modal Component
function ChurchModal({
  church,
  onClose,
  onSave,
}: {
  church: Church | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [debugLoading, setDebugLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(church?.logo || "");
  const [formData, setFormData] = useState({
    name: church?.name || "",
    nickname: church?.nickname || "",
    country: church?.country || "",
    address: church?.address || "",
    description: church?.description || "",
    logo: church?.logo || "",
    bankName: church?.bankDetails.bankName || "",
    accountName: church?.bankDetails.accountName || "",
    iban: church?.bankDetails.iban || "",
    accountNumber: church?.bankDetails.accountNumber || "",
    sortCode: church?.bankDetails.sortCode || "",
    swiftCode: church?.bankDetails.swiftCode || "",
    routingNumber: church?.bankDetails.routingNumber || "",
    revolutLink: church?.bankDetails.revolutLink || "",
    additionalInfo: church?.bankDetails.additionalInfo || "",
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setFormData({ ...formData, logo: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = church ? `/api/church/${church._id}` : "/api/church";
      const method = church ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          nickname: formData.nickname || undefined,
          country: formData.country,
          address: formData.address,
          description: formData.description,
          logo: formData.logo || undefined,
          bankDetails: {
            bankName: formData.bankName,
            accountName: formData.accountName,
            iban: formData.iban || undefined,
            accountNumber: formData.accountNumber || undefined,
            sortCode: formData.sortCode || undefined,
            swiftCode: formData.swiftCode || undefined,
            routingNumber: formData.routingNumber || undefined,
            revolutLink: formData.revolutLink || undefined,
            additionalInfo: formData.additionalInfo || undefined,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save church");
      }

      // If there's a logo file to upload, upload it
      if (logoFile && data.church?.publicId) {
        try {
          // Convert file to base64
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(logoFile);
          });

          const imageData = await base64Promise;

          // Upload to Cloudinary with church's updatedAt as version for cache busting
          const version = data.church.updatedAt
            ? new Date(data.church.updatedAt).getTime()
            : Date.now();

          const uploadResponse = await fetch("/api/upload/logo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              imageData,
              publicId: data.church.publicId,
              version, // Use church's updatedAt timestamp for consistent cache busting
            }),
          });

          const uploadData = await uploadResponse.json();

          if (uploadResponse.ok && uploadData.logoUrl) {
            // Update church with logo URL
            await fetch(`/api/church/${data.church._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                logo: uploadData.logoUrl,
              }),
            });
          }
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          // Don't fail the whole operation if logo upload fails
        }
      }

      onSave();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to save church";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // DEBUG ONLY: Create multiple random churches
  const handleCreateRandomChurches = async () => {
    if (!confirm("Create 5 random test churches? (This is for testing only)")) {
      return;
    }

    setDebugLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");
      const promises = [];

      // Create 5 random churches
      for (let i = 0; i < 5; i++) {
        const randomData = generateRandomChurchData();

        const promise = fetch("/api/church", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: randomData.name,
            nickname: randomData.nickname,
            country: randomData.country,
            address: randomData.address,
            description: randomData.description,
            bankDetails: {
              bankName: randomData.bankName,
              accountName: randomData.accountName,
              iban: randomData.iban,
              accountNumber: randomData.accountNumber,
              sortCode: randomData.sortCode,
              swiftCode: randomData.swiftCode,
              routingNumber: randomData.routingNumber || undefined,
              revolutLink: randomData.revolutLink || undefined,
              additionalInfo: randomData.additionalInfo,
            },
          }),
        });

        promises.push(promise);
      }

      const results = await Promise.all(promises);
      const failed = results.filter((r) => !r.ok);

      if (failed.length > 0) {
        // Get error details from first failed request
        const firstError = await failed[0].json();
        throw new Error(
          `Failed to create ${failed.length} out of 5 churches: ${
            firstError.error || "Unknown error"
          }`
        );
      }

      alert("Successfully created 5 random churches!");
      onSave();
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error
          ? error.message
          : "Failed to create random churches";
      setError(errMsg);
    } finally {
      setDebugLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 md:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-2xl max-w-2xl w-full my-4 md:my-0 max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center z-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {church ? "Edit Church" : "Add New Church"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 md:p-6 space-y-4 md:space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Church Name *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Grace Community Church"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Church Nickname{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.nickname}
              onChange={(e) =>
                setFormData({ ...formData, nickname: e.target.value })
              }
              placeholder="Grace Church"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <select
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Church Logo{" "}
              <span className="text-gray-500 font-normal">(Optional)</span>
            </label>

            {/* Logo Preview */}
            {logoPreview && (
              <div className="mb-3 relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Remove logo">
                  ×
                </button>
              </div>
            )}

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-800 hover:file:bg-primary-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended: Square image, max 5MB
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Donation Details
            </h3>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e.target.value })
                    }
                    placeholder="First National Bank"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                    value={formData.accountName}
                    onChange={(e) =>
                      setFormData({ ...formData, accountName: e.target.value })
                    }
                    placeholder="Church Name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN{" "}
                  <span className="text-gray-500 font-normal">
                    (International)
                  </span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                  value={formData.iban}
                  onChange={(e) =>
                    setFormData({ ...formData, iban: e.target.value })
                  }
                  placeholder="GB29NWBK60161331926819"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        accountNumber: e.target.value,
                      })
                    }
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Code{" "}
                    <span className="text-gray-500 font-normal">(UK/IE)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                    value={formData.sortCode}
                    onChange={(e) =>
                      setFormData({ ...formData, sortCode: e.target.value })
                    }
                    placeholder="123456"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SWIFT/BIC Code{" "}
                    <span className="text-gray-500 font-normal">
                      (International)
                    </span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                    value={formData.swiftCode}
                    onChange={(e) =>
                      setFormData({ ...formData, swiftCode: e.target.value })
                    }
                    placeholder="NWBKGB2L"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number{" "}
                    <span className="text-gray-500 font-normal">(US)</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900 font-mono"
                    value={formData.routingNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        routingNumber: e.target.value,
                      })
                    }
                    placeholder="123456789"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revolut Payment Link{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                  value={formData.revolutLink}
                  onChange={(e) =>
                    setFormData({ ...formData, revolutLink: e.target.value })
                  }
                  placeholder="https://revolut.me/yourchurch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Instructions{" "}
                  <span className="text-gray-500 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent text-gray-900"
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, additionalInfo: e.target.value })
                  }
                  placeholder="E.g., Please include your name in the reference..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  * At least one payment method required (IBAN, Account Number,
                  or Revolut Link)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:gap-4 pt-4">
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm md:text-base">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-800 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-primary-900 transition-colors font-semibold disabled:bg-gray-400 text-sm md:text-base">
                {loading
                  ? "Saving..."
                  : church
                  ? "Update Church"
                  : "Create Church"}
              </button>
            </div>

            {/* DEBUG ONLY: Show in development mode */}
            {!church && process.env.NODE_ENV === "development" && (
              <button
                type="button"
                onClick={handleCreateRandomChurches}
                disabled={debugLoading || loading}
                className="w-full bg-orange-500 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:bg-gray-400 text-sm md:text-base border-2 border-orange-700">
                {debugLoading
                  ? "Creating Random Churches..."
                  : "🧪 DEBUG: Create 5 Random Churches"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

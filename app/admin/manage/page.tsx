"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../components/AdminLayout";
import { AdminStatus } from "@/types/admin";

interface Admin {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  status: AdminStatus;
  isMainAdmin?: boolean;
}

export default function AdminManagementPage() {
  const router = useRouter();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentAdminId, setCurrentAdminId] = useState<string>("");

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch admins
  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch("/api/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data = await response.json();
      setAdmins(data.admins);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get current admin info from localStorage
    const adminUser = localStorage.getItem("adminUser");
    if (adminUser) {
      const user = JSON.parse(adminUser);
      setCurrentAdminId(user.id);
    }

    fetchAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle form input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle send invite
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send invitation");
      }

      setSuccessMessage(
        `Invitation sent to ${data.admin.email}! They will receive an email to set up their account.`
      );
      setShowAddForm(false);
      setFormData({ name: "", email: "" });
      fetchAdmins();

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to send invitation"
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete admin
  const handleDeleteAdmin = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete admin "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`/api/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete admin");
      }

      setSuccessMessage(`Admin "${name}" deleted successfully!`);
      fetchAdmins();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete admin");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admins...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Admins</h1>
          <p className="text-gray-600 mt-2">
            Add, view, and manage administrator accounts
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Invite Admin Button - Only for Main Admin */}
        {admins.find((a) => a._id === currentAdminId)?.isMainAdmin && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              {showAddForm ? "Cancel" : "+ Invite New Admin"}
            </button>
          </div>
        )}

        {/* Invite Admin Form */}
        {showAddForm && (
          <div className="mb-6 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Invite New Admin
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Send an invitation email. They will receive a link to set up their
              own password.
            </p>
            <form onSubmit={handleSendInvite} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Admin name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="admin@example.com"
                />
                <p className="mt-1 text-sm text-gray-500">
                  An invitation link will be sent to this email address
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed">
                  {formLoading ? "Sending Invitation..." : "Send Invitation"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setFormError("");
                    setFormData({ name: "", email: "" });
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Admins List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              All Administrators ({admins.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {admins.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No administrators found
              </div>
            ) : (
              admins.map((admin) => {
                // Check if current user is main admin
                const currentAdmin = admins.find(
                  (a) => a._id === currentAdminId
                );
                const isCurrentUserMainAdmin =
                  currentAdmin?.isMainAdmin || false;
                const isOwnAccount = admin._id === currentAdminId;

                // Determine if delete button should be shown
                let showDeleteButton = false;
                let deleteButtonText = "Delete";

                if (admin.isMainAdmin) {
                  // Main admin is always protected
                  showDeleteButton = false;
                } else if (isCurrentUserMainAdmin) {
                  // Main admin can delete other admins
                  showDeleteButton = true;
                  deleteButtonText = "Delete";
                } else if (isOwnAccount) {
                  // Regular admin can only delete their own account
                  showDeleteButton = true;
                  deleteButtonText = "Delete My Account";
                }

                return (
                  <div
                    key={admin._id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {admin.name}
                          </h3>
                          {admin.isMainAdmin && (
                            <span className="px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full">
                              Main Admin
                            </span>
                          )}
                          {admin.status === AdminStatus.PENDING && (
                            <span className="px-2 py-1 text-xs font-semibold text-orange-700 bg-orange-100 rounded-full">
                              Pending Invite
                            </span>
                          )}
                          {isOwnAccount && !admin.isMainAdmin && (
                            <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {admin.email}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Created:{" "}
                          {new Date(admin.createdAt).toLocaleDateString()}
                          {admin.status === AdminStatus.PENDING &&
                            " • Awaiting setup"}
                        </p>
                      </div>
                      <div>
                        {showDeleteButton ? (
                          <button
                            onClick={() =>
                              handleDeleteAdmin(admin._id, admin.name)
                            }
                            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                            {deleteButtonText}
                          </button>
                        ) : admin.isMainAdmin ? (
                          <div className="px-4 py-2 text-gray-400 text-sm">
                            Protected
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

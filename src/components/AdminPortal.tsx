import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { ServiceRequest } from "../types";
import {
  X,
  Lock,
  User,
  Shield,
  LogOut,
  RefreshCw,
  Search,
  Phone,
  MessageSquare,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  Loader2,
  ChevronDown,
  Database,
} from "lucide-react";

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const { t, isRtl } = useLanguage();

  const [token, setToken] = useState<string | null>(() => {
    return typeof window !== "undefined" ? localStorage.getItem("ps_admin_token") : null;
  });

  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUpdatingStatusId, setIsUpdatingStatusId] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<{
    configured: boolean;
    connected?: boolean;
    table?: string;
    mode?: string;
    message?: string;
  } | null>(null);

  // Check auth session
  useEffect(() => {
    if (token) {
      verifySession(token);
    }
  }, [token]);

  // Fetch requests & DB status when open and authenticated
  useEffect(() => {
    if (isOpen && token) {
      fetchRequests();
      fetch("/api/database/status")
        .then((r) => r.json())
        .then((d) => setDbStatus(d))
        .catch(() => {});
    }
  }, [isOpen, token]);

  const verifySession = async (currToken: string) => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${currToken}` },
      });
      if (!res.ok) {
        handleLogout();
      }
    } catch {
      handleLogout();
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      setLoginError(isRtl ? "يرجى إدخال اسم المستخدم وكلمة المرور" : "Please enter username and password");
      return;
    }

    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setToken(data.token);
      localStorage.setItem("ps_admin_token", data.token);
      setUsernameInput("");
      setPasswordInput("");
      fetchRequests(data.token);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    setToken(null);
    localStorage.removeItem("ps_admin_token");
    setRequests([]);
  };

  const fetchRequests = async (overrideToken?: string) => {
    const activeToken = overrideToken || token;
    if (!activeToken) return;

    setIsLoadingRequests(true);
    try {
      const res = await fetch("/api/requests", {
        headers: { Authorization: `Bearer ${activeToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: "New" | "Contacted" | "Completed") => {
    if (!token) return;
    setIsUpdatingStatusId(id);

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
        );
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsUpdatingStatusId(null);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!token) return;

    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
        setDeleteConfirmId(null);
        if (selectedRequest && selectedRequest.id === id) {
          setSelectedRequest(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete request:", err);
    }
  };

  if (!isOpen) return null;

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    const matchesStatus =
      statusFilter === "All" ? true : r.status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.full_name.toLowerCase().includes(query) ||
      r.mobile.toLowerCase().includes(query) ||
      r.address.toLowerCase().includes(query) ||
      r.work_details.toLowerCase().includes(query) ||
      r.id.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  const countNew = requests.filter((r) => r.status === "New").length;
  const countContacted = requests.filter((r) => r.status === "Contacted").length;
  const countCompleted = requests.filter((r) => r.status === "Completed").length;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            {t.admin.filterNew}
          </span>
        );
      case "Contacted":
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {t.admin.filterContacted}
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t.admin.filterCompleted}
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div
      id="admin-portal-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#222222]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#D9DDE1] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 bg-[#F5F6F7] border-b border-[#D9DDE1] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3A3F44] text-white flex items-center justify-center font-bold text-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[#222222]">
                  {t.admin.portalTitle}
                </h2>
                {token && dbStatus && (
                  <span
                    id="admin-db-status-pill"
                    className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-[#D9DDE1] text-[#3A3F44]"
                    title={dbStatus.message || (dbStatus.connected ? "Supabase table connected" : "Local mode")}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        dbStatus.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                    <span>
                      {dbStatus.connected
                        ? `Supabase: ${dbStatus.table || "PLUMBING SOLUTION"}`
                        : `Storage: Local (${dbStatus.table || "PLUMBING SOLUTION"} ready)`}
                    </span>
                  </span>
                )}
              </div>
              <p className="text-xs text-[#8A8F94] hidden sm:block">
                {t.admin.portalSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {token && (
              <button
                type="button"
                id="admin-logout-btn"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#666666] hover:text-red-700 bg-white hover:bg-red-50 border border-[#D9DDE1] hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.admin.logoutButton}</span>
              </button>
            )}

            <button
              type="button"
              id="admin-close-btn"
              onClick={onClose}
              className="p-1.5 text-[#666666] hover:text-[#222222] hover:bg-[#EEF0F2] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!token ? (
            /* Login View */
            <div className="max-w-md mx-auto py-8 text-left rtl:text-right">
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-[#EEF0F2] text-[#3A3F44] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-[#D9DDE1]">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-extrabold text-[#222222]">
                  {t.admin.loginTitle}
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  {isRtl
                    ? "الوصول مخصص لمسؤولي شركة حلول السباكة المعتمدين فقط"
                    : "Authorized management access for Plumbing Solution team only"}
                </p>
              </div>

              {loginError && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-800 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin_username"
                    className="block text-xs font-bold text-[#222222] mb-1.5"
                  >
                    {t.admin.usernameLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="admin_username"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder={t.admin.usernamePlaceholder}
                      className="w-full bg-white border border-[#D9DDE1] focus:border-[#3A3F44] focus:ring-1 focus:ring-[#3A3F44] rounded-lg px-3.5 py-2.5 text-sm text-[#222222] placeholder-[#8A8F94] outline-none"
                    />
                    <User className="w-4 h-4 text-[#8A8F94] absolute top-3 right-3 rtl:right-auto rtl:left-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin_password"
                    className="block text-xs font-bold text-[#222222] mb-1.5"
                  >
                    {t.admin.passwordLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="admin_password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={t.admin.passwordPlaceholder}
                      className="w-full bg-white border border-[#D9DDE1] focus:border-[#3A3F44] focus:ring-1 focus:ring-[#3A3F44] rounded-lg px-3.5 py-2.5 text-sm text-[#222222] placeholder-[#8A8F94] outline-none"
                    />
                    <Lock className="w-4 h-4 text-[#8A8F94] absolute top-3 right-3 rtl:right-auto rtl:left-3 pointer-events-none" />
                  </div>
                </div>

                <button
                  type="submit"
                  id="admin-login-submit"
                  disabled={isLoggingIn}
                  className="w-full bg-[#3A3F44] hover:bg-[#222222] disabled:bg-[#8A8F94] text-white font-bold py-3 px-4 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 text-sm mt-2"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.admin.loggingIn}</span>
                    </>
                  ) : (
                    <span>{t.admin.loginButton}</span>
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* Dashboard View */
            <div className="space-y-6">
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-[#F5F6F7] p-3.5 sm:p-4 rounded-xl border border-[#D9DDE1]">
                  <span className="text-[11px] font-bold text-[#8A8F94] uppercase tracking-wide">
                    {t.admin.totalRequests}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#222222] mt-0.5">
                    {requests.length}
                  </div>
                </div>

                <div className="bg-amber-50/70 p-3.5 sm:p-4 rounded-xl border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                    {t.admin.newRequests}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-900 mt-0.5">
                    {countNew}
                  </div>
                </div>

                <div className="bg-blue-50/70 p-3.5 sm:p-4 rounded-xl border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                    {t.admin.contactedRequests}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-blue-900 mt-0.5">
                    {countContacted}
                  </div>
                </div>

                <div className="bg-emerald-50/70 p-3.5 sm:p-4 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                    {t.admin.completedRequests}
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-900 mt-0.5">
                    {countCompleted}
                  </div>
                </div>
              </div>

              {/* Controls: Search & Status Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#8A8F94] absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.admin.searchPlaceholder}
                    className="w-full bg-[#F5F6F7] border border-[#D9DDE1] focus:border-[#3A3F44] rounded-lg pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 text-xs sm:text-sm text-[#222222] outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#F5F6F7] border border-[#D9DDE1] rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-[#3A3F44] outline-none"
                  >
                    <option value="All">{t.admin.filterAll}</option>
                    <option value="New">{t.admin.filterNew}</option>
                    <option value="Contacted">{t.admin.filterContacted}</option>
                    <option value="Completed">{t.admin.filterCompleted}</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => fetchRequests()}
                    className="p-2 bg-[#F5F6F7] hover:bg-[#EEF0F2] text-[#3A3F44] rounded-lg border border-[#D9DDE1] transition-colors"
                    title={t.admin.refreshButton}
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingRequests ? "animate-spin" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Requests List */}
              {isLoadingRequests ? (
                <div className="py-16 text-center text-[#8A8F94] flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-[#3A3F44] mb-2" />
                  <span className="text-xs font-semibold">{t.common.loading}</span>
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-[#D9DDE1] rounded-xl">
                  <Clock className="w-8 h-8 text-[#8A8F94] mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-[#666666] font-medium">
                    {t.admin.noRequests}
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto border border-[#D9DDE1] rounded-xl">
                    <table className="w-full text-left rtl:text-right border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#F5F6F7] text-[#3A3F44] border-b border-[#D9DDE1]">
                          <th className="py-3 px-4 font-extrabold">{t.admin.tableName}</th>
                          <th className="py-3 px-4 font-extrabold">{t.admin.tableMobile}</th>
                          <th className="py-3 px-4 font-extrabold">{t.admin.tableAddress}</th>
                          <th className="py-3 px-4 font-extrabold">{t.admin.tableStatus}</th>
                          <th className="py-3 px-4 font-extrabold">{t.admin.tableDate}</th>
                          <th className="py-3 px-4 font-extrabold text-center">{t.admin.tableActions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9DDE1]">
                        {filteredRequests.map((req) => (
                          <tr key={req.id} className="hover:bg-[#F9FAFB] transition-colors">
                            <td className="py-3.5 px-4 font-bold text-[#222222]">
                              <button
                                type="button"
                                onClick={() => setSelectedRequest(req)}
                                className="text-left rtl:text-right hover:underline"
                              >
                                {req.full_name}
                              </button>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-[#3A3F44]">
                              <a
                                href={`tel:${req.mobile}`}
                                className="inline-flex items-center gap-1 hover:underline text-[#222222]"
                              >
                                <Phone className="w-3 h-3 text-[#8A8F94]" />
                                <span>{req.mobile}</span>
                              </a>
                            </td>
                            <td className="py-3.5 px-4 text-[#666666] max-w-[200px] truncate">
                              {req.address}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="inline-block relative">
                                <select
                                  value={req.status}
                                  disabled={isUpdatingStatusId === req.id}
                                  onChange={(e) =>
                                    handleStatusChange(
                                      req.id,
                                      e.target.value as "New" | "Contacted" | "Completed"
                                    )
                                  }
                                  className="text-xs font-bold rounded-lg border border-[#D9DDE1] px-2.5 py-1 bg-white cursor-pointer outline-none focus:border-[#3A3F44]"
                                >
                                  <option value="New">{t.admin.filterNew}</option>
                                  <option value="Contacted">{t.admin.filterContacted}</option>
                                  <option value="Completed">{t.admin.filterCompleted}</option>
                                </select>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-xs text-[#8A8F94]">
                              {formatDate(req.created_at)}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedRequest(req)}
                                  className="p-1.5 text-[#3A3F44] hover:bg-[#EEF0F2] rounded-md"
                                  title={t.admin.viewDetails}
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                <a
                                  href={`https://wa.me/${req.mobile.replace(/[^0-9]/g, "")}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-md"
                                  title={t.admin.whatsappCustomer}
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>

                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(req.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                  title={t.admin.deleteButton}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Responsive Cards (Strict Mobile-First) */}
                  <div className="md:hidden space-y-3.5">
                    {filteredRequests.map((req) => (
                      <div
                        key={req.id}
                        className="bg-[#F9FAFB] rounded-xl p-4 border border-[#D9DDE1] space-y-3 text-left rtl:text-right"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-extrabold text-base text-[#222222]">
                              {req.full_name}
                            </h4>
                            <span className="text-[11px] text-[#8A8F94]">
                              {formatDate(req.created_at)}
                            </span>
                          </div>
                          <div>{getStatusBadge(req.status)}</div>
                        </div>

                        <div className="space-y-1 text-xs text-[#555555]">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-[#8A8F94] shrink-0" />
                            <a href={`tel:${req.mobile}`} className="font-bold text-[#222222]">
                              {req.mobile}
                            </a>
                          </div>
                          <div className="line-clamp-1">{req.address}</div>
                          <div className="text-[#3A3F44] font-medium bg-white p-2.5 rounded-lg border border-[#D9DDE1] text-xs mt-1.5">
                            {req.work_details}
                          </div>
                        </div>

                        {/* Status selector & Action buttons */}
                        <div className="pt-2 border-t border-[#D9DDE1] flex items-center justify-between gap-2">
                          <select
                            value={req.status}
                            onChange={(e) =>
                              handleStatusChange(
                                req.id,
                                e.target.value as "New" | "Contacted" | "Completed"
                              )
                            }
                            className="text-xs font-bold rounded-lg border border-[#D9DDE1] px-2.5 py-1.5 bg-white outline-none"
                          >
                            <option value="New">{t.admin.filterNew}</option>
                            <option value="Contacted">{t.admin.filterContacted}</option>
                            <option value="Completed">{t.admin.filterCompleted}</option>
                          </select>

                          <div className="flex items-center gap-1">
                            <a
                              href={`tel:${req.mobile}`}
                              className="p-2 bg-white text-[#222222] border border-[#D9DDE1] rounded-lg text-xs font-bold flex items-center gap-1"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{t.admin.callCustomer}</span>
                            </a>

                            <a
                              href={`https://wa.me/${req.mobile.replace(/[^0-9]/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                              title={t.admin.whatsappCustomer}
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(req.id)}
                              className="p-2 text-red-600 hover:bg-red-50 border border-[#D9DDE1] rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Details View Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full border border-[#D9DDE1] shadow-2xl text-left rtl:text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DDE1] mb-4">
              <h3 className="font-extrabold text-lg text-[#222222]">
                {t.admin.detailsModalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="p-1 text-[#8A8F94] hover:text-[#222222]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <span className="text-[#8A8F94] font-bold block">{t.admin.tableName}</span>
                <span className="font-extrabold text-[#222222] text-base">
                  {selectedRequest.full_name}
                </span>
              </div>

              <div>
                <span className="text-[#8A8F94] font-bold block">{t.admin.tableMobile}</span>
                <a
                  href={`tel:${selectedRequest.mobile}`}
                  className="font-bold text-[#3A3F44] hover:underline"
                >
                  {selectedRequest.mobile}
                </a>
              </div>

              <div>
                <span className="text-[#8A8F94] font-bold block">{t.admin.tableAddress}</span>
                <span className="text-[#3A3F44]">{selectedRequest.address}</span>
              </div>

              <div>
                <span className="text-[#8A8F94] font-bold block">{t.admin.tableDetails}</span>
                <div className="bg-[#F5F6F7] p-3.5 rounded-xl border border-[#D9DDE1] text-[#222222] whitespace-pre-wrap leading-relaxed mt-1 font-normal">
                  {selectedRequest.work_details}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-[#8A8F94] font-bold block">{t.admin.tableDate}</span>
                  <span className="text-xs text-[#666666]">
                    {formatDate(selectedRequest.created_at)}
                  </span>
                </div>
                <div>{getStatusBadge(selectedRequest.status)}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#D9DDE1] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="bg-[#3A3F44] text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                {t.admin.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full border border-[#D9DDE1] shadow-2xl text-left rtl:text-right">
            <h3 className="font-extrabold text-base text-[#222222] mb-2">
              {t.admin.deleteConfirmTitle}
            </h3>
            <p className="text-xs text-[#666666] mb-5 leading-relaxed">
              {t.admin.deleteConfirmText}
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3.5 py-2 text-xs font-bold text-[#3A3F44] bg-[#F5F6F7] hover:bg-[#EEF0F2] rounded-lg border border-[#D9DDE1]"
              >
                {t.admin.cancelButton}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteRequest(deleteConfirmId)}
                className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                {t.admin.deleteButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

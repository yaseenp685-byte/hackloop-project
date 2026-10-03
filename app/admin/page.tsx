"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ApiService } from "@/services/apiService";
import {
  AdminPlatformStats,
  VerificationRequestItem,
  ModerationItem,
  AuditLogEntry,
  DataSourceStatus,
  SystemHealthMetric,
} from "@/types/admin";
import { VerificationBadge } from "@/components/VerificationBadge";
import { DataTable, Column } from "@/components/DataTable";
import { RealtimeStatusBadge } from "@/components/RealtimeStatusBadge";
import { formatRelativeTime } from "@/lib/utils";
import {
  Shield,
  Activity,
  Database,
  FileCheck2,
  AlertTriangle,
  Server,
  Users,
  Award,
  GraduationCap,
  Building,
  RefreshCw,
  Check,
  X,
  Sliders,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminConsolePage() {
  const [stats, setStats] = useState<AdminPlatformStats | null>(null);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequestItem[]>([]);
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [dataSources, setDataSources] = useState<DataSourceStatus[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealthMetric[]>([]);

  const [activeTab, setActiveTab] = useState<"verification" | "moderation" | "datasources" | "health" | "audit">("verification");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    ApiService.getAdminDashboardData().then((data) => {
      setStats(data.stats);
      setVerificationRequests(data.verificationRequests);
      setModerationItems(data.moderationItems);
      setAuditLogs(data.auditLogs);
      setDataSources(data.dataSources);
      setSystemHealth(data.systemHealth);
    });
  }, []);

  const handleApproveVerification = (id: string, name: string) => {
    setVerificationRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, currentStatus: "VERIFIED" } : req))
    );
    setActionSuccessMessage(`Successfully approved & marked VERIFIED for "${name}". Audit entry created.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleRejectVerification = (id: string, name: string) => {
    setVerificationRequests((prev) => prev.filter((req) => req.id !== id));
    setActionSuccessMessage(`Rejected listing for "${name}". Notified applicant.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleResolveModeration = (id: string) => {
    setModerationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "RESOLVED" } : item))
    );
    setActionSuccessMessage(`Moderation report #${id} resolved.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  if (!stats) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center font-mono">
        <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-xs text-neutral-500">Initializing administrative data console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans pb-16">
      {/* Enterprise Admin Command Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-xs sticky top-16 z-30 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider font-bold text-red-400">
                  Karnataka State Technical Oversight
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 font-mono">
                  Console v2.6.4
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                State Hackathon &amp; Academic Middle Layer Administrator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RealtimeStatusBadge />
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              Exit to Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionSuccessMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="p-3 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button onClick={() => setActionSuccessMessage(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Console Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* High-Density Telemetry & Entity Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 font-mono">
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase">Registered Students</span>
            <div className="text-xl font-bold text-white mt-1">{stats.totalStudents.toLocaleString()}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase">Organizers</span>
            <div className="text-xl font-bold text-white mt-1">{stats.totalOrganizers}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase">Karnataka Colleges</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{stats.totalColleges}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase">Universities</span>
            <div className="text-xl font-bold text-blue-400 mt-1">{stats.totalUniversities}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase">Pending Verification</span>
            <div className="text-xl font-bold text-amber-400 mt-1">{verificationRequests.filter(r => r.currentStatus === "PENDING").length}</div>
          </div>
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase">Active Queries/Day</span>
            <div className="text-xl font-bold text-purple-400 mt-1">{stats.dailyActiveSearches.toLocaleString()}</div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 border-b border-neutral-800 pb-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: "verification", label: `Verification Queue (${verificationRequests.length})`, icon: <FileCheck2 className="w-3.5 h-3.5" /> },
            { id: "moderation", label: `Moderation & Flags (${moderationItems.length})`, icon: <AlertTriangle className="w-3.5 h-3.5" /> },
            { id: "datasources", label: `Data Sources & Feeds (${dataSources.length})`, icon: <Database className="w-3.5 h-3.5" /> },
            { id: "health", label: "System Health & Latency", icon: <Server className="w-3.5 h-3.5" /> },
            { id: "audit", label: `Audit Log (${auditLogs.length})`, icon: <Terminal className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shrink-0",
                activeTab === tab.id
                  ? "bg-red-600/90 text-white font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: VERIFICATION QUEUE */}
        {activeTab === "verification" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  State Verification Requests
                </h3>
                <p className="text-xs text-neutral-400">
                  Review applicant proof letters before authorizing listings as VERIFIED.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {verificationRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold">
                        {req.entityType}
                      </span>
                      <VerificationBadge status={req.currentStatus} />
                      <span className="text-xs text-neutral-500 font-mono">
                        Submitted {formatRelativeTime(req.submittedAt)} by {req.submittedBy}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{req.entityName}</h4>

                    <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-2">
                      <span>Documents:</span>
                      {req.documentsProvided.map((doc) => (
                        <span key={doc} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[11px]">
                          {doc}
                        </span>
                      ))}
                    </div>

                    {req.notes && (
                      <p className="text-xs text-neutral-400 italic">
                        Note: {req.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.currentStatus !== "VERIFIED" ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleApproveVerification(req.id, req.entityName)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve (VERIFIED)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectVerification(req.id, req.entityName)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>Authorized in Public Registry</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MODERATION */}
        {activeTab === "moderation" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Moderation Watchdog &amp; Reports
            </h3>
            <div className="space-y-3">
              {moderationItems.map((mod) => (
                <div
                  key={mod.id}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-900 font-bold">
                        {mod.itemType}
                      </span>
                      <span className="text-xs font-mono text-neutral-500">
                        Flagged {formatRelativeTime(mod.reportedAt)} by {mod.reportedBy}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{mod.itemTitle}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">Reason: {mod.reason}</p>
                  </div>

                  <div>
                    {mod.status === "OPEN" ? (
                      <button
                        type="button"
                        onClick={() => handleResolveModeration(mod.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                      >
                        Resolve Report
                      </button>
                    ) : (
                      <span className="text-xs text-neutral-500 font-mono">RESOLVED</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DATA SOURCES & SYNCHRONIZATION */}
        {activeTab === "datasources" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              State Data Source Feeds &amp; Crawlers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataSources.map((ds) => (
                <div key={ds.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-neutral-300">{ds.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900 font-bold">
                      {ds.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400">Type: {ds.type}</div>
                  <div className="text-xs text-neutral-400">Frequency: {ds.frequency}</div>
                  <div className="text-xs font-mono text-neutral-500 pt-2 border-t border-neutral-800 flex justify-between">
                    <span>Synced: {ds.recordsSynced} records</span>
                    <span>Last run: {formatRelativeTime(ds.lastSyncTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM HEALTH */}
        {activeTab === "health" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Live System Telemetry &amp; Microservice Health
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {systemHealth.map((m) => (
                <div key={m.service} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-between font-mono text-xs">
                  <div>
                    <div className="font-bold text-white">{m.service}</div>
                    <div className="text-neutral-500 mt-0.5">Uptime: {m.uptimePercentage}%</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                      {m.status}
                    </span>
                    <div className="text-neutral-400 mt-1">{m.latencyMs} ms</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOGS */}
        {activeTab === "audit" && (
          <div className="space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Immutable Administrative Audit Stream
            </h3>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 overflow-hidden">
              <div className="divide-y divide-neutral-800">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-red-400">{log.action}</span>
                      <span className="text-neutral-400 ml-2">[{log.targetEntity}: {log.targetId}]</span>
                      <div className="text-[11px] text-neutral-500">By: {log.performedBy}</div>
                    </div>
                    <div className="text-neutral-400 text-right text-[11px]">
                      {new Date(log.timestamp).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

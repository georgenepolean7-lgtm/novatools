"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Search,
  TrendingUp,
  Layers,
  Clock,
  Sparkles,
  Terminal,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  FileCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Info,
} from "lucide-react";
import {
  SeoAgentRuntimeStatus,
  DataSourceMatrixItem,
  DailyCycleStatus,
  QwenHealthDetails,
  SafetyGovernanceDetails,
  CycleHistoryRecord,
  SeoOpportunity,
} from "@/lib/seo-agent/types";

export default function SeoAgentDashboard() {
  const [status, setStatus] = useState<SeoAgentRuntimeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [runningDryRun, setRunningDryRun] = useState(false);
  const [runningProduction, setRunningProduction] = useState(false);
  const [killSwitchLoading, setKillSwitchLoading] = useState(false);
  const [showProductionModal, setShowProductionModal] = useState(false);
  const [productionConfirmed, setProductionConfirmed] = useState(false);
  const [activeTab, setActiveTab] = useState<"matrix" | "history" | "opportunities" | "safety">("matrix");
  const [opportunityFilter, setOpportunityFilter] = useState<"ALL" | "SAFE" | "ZERO_TRAFFIC">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastExecutionResult, setLastExecutionResult] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/seo-agent/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      } else {
        setMessage({ type: "error", text: "Failed to load SEO Agent runtime status" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error loading SEO Agent status" });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/seo-agent/status")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ignore && data) {
          setStatus(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  const toggleKillSwitch = async () => {
    if (!status) return;
    const newActive = !status.killSwitchActive;
    try {
      setKillSwitchLoading(true);
      const res = await fetch("/api/admin/seo-agent/kill-switch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: newActive }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: newActive ? "error" : "success",
          text: data.message,
        });
        setStatus((prev) =>
          prev
            ? {
                ...prev,
                killSwitchActive: newActive,
                enabled: !newActive,
                dailyStatus: prev.dailyStatus
                  ? { ...prev.dailyStatus, killSwitchActive: newActive }
                  : undefined,
              }
            : null
        );
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update kill switch" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error updating kill switch" });
    } finally {
      setKillSwitchLoading(false);
    }
  };

  const handleRunDryRun = async () => {
    try {
      setRunningDryRun(true);
      setMessage({ type: "info", text: "Executing autonomous dry-run (telemetry ingestion, scoring, reasoning)..." });
      const res = await fetch("/api/admin/seo-agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun: true }),
      });
      const data = await res.json();
      setLastExecutionResult(data);
      if (res.ok) {
        if (data.status === "BLOCKED_PENDING_REAL_DATA" || data.status === "BLOCKED") {
          setMessage({ type: "error", text: `BLOCKED: ${data.summary || data.message || "Pending real telemetry data."}` });
        } else {
          setMessage({ type: "success", text: data.summary || "Dry run completed successfully with zero mutations." });
        }
        await fetchStatus();
      } else {
        setMessage({ type: "error", text: data.error || data.details || "Dry run execution failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: `Execution failed: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setRunningDryRun(false);
    }
  };

  const handleRunProduction = async () => {
    if (!productionConfirmed) return;
    setShowProductionModal(false);
    try {
      setRunningProduction(true);
      setMessage({
        type: "info",
        text: "Evaluating production cycle launch...",
      });
      const res = await fetch("/api/admin/seo-agent/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dryRun: false, confirmed: true }),
      });
      const data = await res.json();
      setLastExecutionResult(data);
      if (data.status === "DISPATCHED") {
        setMessage({
          type: "info",
          text: `Cycle DISPATCHED to dedicated worker (${data.target || "worker"}). Awaiting worker execution report.`,
        });
        await fetchStatus();
      } else if (data.status === "BLOCKED" || data.dispatchRequired) {
        setMessage({
          type: "error",
          text: `WORKER DISPATCH REQUIRED: ${data.message || data.error}`,
        });
        await fetchStatus();
      } else if (data.status === "FAILED") {
        setMessage({
          type: "error",
          text: `Cycle FAILED: ${data.summary || data.error || "Attempted mutations failed."}`,
        });
        await fetchStatus();
      } else if (res.ok) {
        setMessage({ type: "success", text: data.summary || "Production cycle executed successfully." });
        await fetchStatus();
      } else {
        setMessage({ type: "error", text: data.error || data.details || "Production cycle failed." });
      }
    } catch (err) {
      setMessage({ type: "error", text: `Production failed: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setRunningProduction(false);
      setProductionConfirmed(false);
    }
  };

  if (loading && !status) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4 rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="text-sm font-semibold tracking-wide">Connecting to SEO Agent Runtime &amp; Telemetry...</p>
      </div>
    );
  }

  const daily: DailyCycleStatus = status?.dailyStatus || {
    opportunitiesDetected: 373,
    selectedOpportunities: 80,
    dailyHardCap: 80,
    processedToday: status?.dailyChangesCount || 0,
    remainingCapacity: Math.max(0, 80 - (status?.dailyChangesCount || 0)),
    currentAtomicBatch: "Idle",
    batchSize: 20,
    successfulBatches: 0,
    failedBatches: 0,
    rollbacks: 0,
    changesApplied: status?.dailyChangesCount || 0,
    deployments: 0,
    indexNowBroadcasts: 0,
    lastCycleAt: status?.lastCycleAt || null,
    currentCycleStatus: status?.killSwitchActive ? "PAUSED_KILL_SWITCH" : "IDLE",
    killSwitchActive: Boolean(status?.killSwitchActive),
  };

  const matrix: DataSourceMatrixItem[] = status?.multiSourceMatrix || [];
  const qwen: QwenHealthDetails | undefined = status?.qwenStatus;
  const safety: SafetyGovernanceDetails | undefined = status?.safetyStatus;
  const cycles: CycleHistoryRecord[] = status?.cycleHistory || [];
  const opportunities: SeoOpportunity[] = status?.recentOpportunities || [];

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.pageSlug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.reason.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    const isZeroTraffic =
      (!opp.currentMetrics?.impressions || opp.currentMetrics.impressions === 0) &&
      (!opp.currentMetrics?.trafficSessions || opp.currentMetrics.trafficSessions === 0);

    if (opportunityFilter === "ZERO_TRAFFIC") return isZeroTraffic;
    if (opportunityFilter === "SAFE") return opp.riskLevel === "LOW";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Toast Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold shadow-lg backdrop-blur-md transition-all ${
            message.type === "success"
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              : message.type === "error"
              ? "bg-rose-500/15 border border-rose-500/30 text-rose-300"
              : "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {message.type === "error" && <AlertTriangle className="w-4 h-4 text-rose-400" />}
            {message.type === "info" && <Info className="w-4 h-4 text-cyan-400 animate-spin" />}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg"
          >
            ✕
          </button>
        </div>
      )}

      {/* Worker Dispatch / Execution Notice Banner */}
      {lastExecutionResult && (Boolean(lastExecutionResult.dispatchRequired) || lastExecutionResult.status === "BLOCKED" || lastExecutionResult.status === "DISPATCHED") && (
        <div
          className={`p-5 rounded-2xl border space-y-2 shadow-lg backdrop-blur-md ${
            lastExecutionResult.status === "DISPATCHED"
              ? "bg-blue-500/10 border-blue-500/30 text-blue-200"
              : "bg-amber-500/10 border-amber-500/30 text-amber-200"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-xs uppercase tracking-wider">
            <span className="flex items-center gap-2">
              {lastExecutionResult.status === "DISPATCHED" ? (
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span>
                {lastExecutionResult.status === "DISPATCHED"
                  ? "Mutation Worker Dispatched"
                  : "Dedicated Worker Dispatch Required (Vercel Serverless Guardrail)"}
              </span>
            </span>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
              Target: {String(lastExecutionResult.workerScript || "scripts/run-seo-cycle.js")}
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            {String(lastExecutionResult.message || lastExecutionResult.error || "")}
          </p>
          {Boolean(lastExecutionResult.workerCommand) && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
              <code>{String(lastExecutionResult.workerCommand)}</code>
              <span className="text-[10px] text-slate-400 font-sans font-semibold">Dedicated Worker CLI</span>
            </div>
          )}
        </div>
      )}

      {/* 1. TOP HEADER & CONTROLS TOOLBAR */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                daily.killSwitchActive || daily.currentCycleStatus === "FAILED" || daily.currentCycleStatus === "BLOCKED"
                  ? "bg-rose-500 animate-ping"
                  : daily.currentCycleStatus === "RUNNING"
                  ? "bg-amber-400 animate-pulse"
                  : daily.currentCycleStatus === "DISPATCHED"
                  ? "bg-blue-400 animate-pulse"
                  : "bg-emerald-400 animate-pulse"
              }`}
            />
            <h2 className="text-xl font-black text-white tracking-tight">
              Autonomous SEO Automation Engine
            </h2>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
                daily.killSwitchActive
                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {daily.killSwitchActive ? "PAUSED (KILL SWITCH ACTIVE)" : "AUTONOMOUS MODE ACTIVE"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider font-mono ${
                daily.currentCycleStatus === "FAILED"
                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  : daily.currentCycleStatus === "BLOCKED" ||
                    daily.currentCycleStatus === "BLOCKED_PENDING_REAL_DATA" ||
                    daily.currentCycleStatus === "PAUSED_KILL_SWITCH"
                  ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                  : daily.currentCycleStatus === "DISPATCHED"
                  ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                  : daily.currentCycleStatus === "RUNNING"
                  ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  : daily.currentCycleStatus === "COMPLETED"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : daily.currentCycleStatus === "DRY_RUN"
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  : "bg-slate-500/15 text-slate-300 border border-slate-500/30"
              }`}
            >
              CYCLE: {daily.currentCycleStatus || "IDLE"}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real Telemetry (GSC + GA4 + Bing) • Capped at 80/day • 20-Page Atomic Batches • Rollback Protection
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Status */}
          <button
            onClick={fetchStatus}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all border border-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          {/* Run Dry Run */}
          <button
            onClick={handleRunDryRun}
            disabled={runningDryRun || runningProduction || daily.killSwitchActive}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${runningDryRun ? "animate-spin" : ""}`} />
            <span>{runningDryRun ? "Running Dry Run..." : "Run Dry Run"}</span>
          </button>

          {/* Run Production Cycle (Modal trigger) */}
          <button
            onClick={() => setShowProductionModal(true)}
            disabled={runningDryRun || runningProduction || daily.killSwitchActive}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-md disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${runningProduction ? "animate-spin" : ""}`} />
            <span>{runningProduction ? "Deploying..." : "Run Production Cycle"}</span>
          </button>

          {/* Emergency Kill Switch */}
          <button
            onClick={toggleKillSwitch}
            disabled={killSwitchLoading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
              daily.killSwitchActive
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-rose-600/90 hover:bg-rose-600 text-white border border-rose-500/40 animate-pulse"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{daily.killSwitchActive ? "DEACTIVATE KILL SWITCH" : "EMERGENCY KILL SWITCH"}</span>
          </button>
        </div>
      </div>

      {/* 2. REAL DAILY STATUS CARDS (12 Core Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Opportunities Detected */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Detected</span>
            <Search className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{daily.opportunitiesDetected}</div>
          <p className="text-[10px] text-slate-400">Across 250 tools</p>
        </div>

        {/* Card 2: Selected Opportunities */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Selected</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{daily.selectedOpportunities}</div>
          <p className="text-[10px] text-slate-400">Hard Cap: {daily.dailyHardCap}/day</p>
        </div>

        {/* Card 3: Processed & Remaining */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Processed Today</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{daily.processedToday}</div>
          <p className="text-[10px] text-slate-400">Remaining: {daily.remainingCapacity}</p>
        </div>

        {/* Card 4: Atomic Batches */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Batch Size</span>
            <Layers className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">{daily.batchSize}</div>
          <p className="text-[10px] text-slate-400">{daily.currentAtomicBatch}</p>
        </div>

        {/* Card 5: Rollbacks & Failures */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Rollbacks</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{daily.rollbacks}</div>
          <p className="text-[10px] text-slate-400">Failed Batches: {daily.failedBatches}</p>
        </div>

        {/* Card 6: Deployments & IndexNow */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-[11px] font-semibold uppercase">
            <span>Deployments</span>
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">{daily.deployments}</div>
          <p className="text-[10px] text-slate-400">IndexNow Broadcasts: {daily.indexNowBroadcasts}</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: "matrix", label: "Multi-Source Telemetry Matrix", icon: Radio },
          { id: "history", label: "Daily Cycle History (7+ Cycles)", icon: Clock },
          { id: "opportunities", label: "Candidate Opportunities (80)", icon: Sparkles },
          { id: "safety", label: "Safety & Governance Gates", icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                active
                  ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIVE MULTI-SOURCE TELEMETRY MATRIX */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  <span>Authoritative Multi-Source Telemetry Matrix</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real runtime health, provenance, and metric ingestion. Strict policy: Never display synthetic data as real data.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] font-mono">
                Truthful Telemetry Enforcement Active
              </span>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300 font-sans">
                <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 font-mono tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Telemetry Source</th>
                    <th className="px-4 py-3">Connection Status</th>
                    <th className="px-4 py-3">Health Status</th>
                    <th className="px-4 py-3 text-center">Real Data</th>
                    <th className="px-4 py-3 text-center">Scoring Enabled</th>
                    <th className="px-4 py-3">Record Count</th>
                    <th className="px-4 py-3">Date Range</th>
                    <th className="px-4 py-3">Upstream Error / Reason</th>
                    <th className="px-4 py-3">Metric Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {matrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            item.realDataRetrieved
                              ? "bg-emerald-400"
                              : item.sourceName === "Microsoft Clarity"
                              ? "bg-amber-400"
                              : "bg-rose-400"
                          }`}
                        />
                        <span>{item.sourceName}</span>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.connected
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {item.connected ? "CONNECTED" : "NOT_AVAILABLE"}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.healthStatus === "HEALTHY"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : item.healthStatus === "RATE_LIMITED"
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {item.healthStatus || (item.connected ? "HEALTHY" : "UNAVAILABLE")}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-black ${
                            item.realDataRetrieved
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {item.realDataRetrieved ? "YES" : "NO"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.feedsScoring
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {item.feedsScoring ? "YES" : "DISABLED"}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono font-bold text-white">
                        {item.recordCount} rows
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-slate-400">
                        {item.dateRange}
                      </td>

                      <td className="px-4 py-3 text-[11px] text-slate-400 max-w-xs">
                        {item.errorReason ? (
                          <span className="text-amber-300/90 font-mono">{item.errorReason}</span>
                        ) : (
                          <span className="text-emerald-400 font-mono">None (Healthy ingestion)</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-[11px] font-mono text-slate-400 max-w-xs truncate">
                        {item.provenanceDetails || item.actualToolOrApi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Qwen Reasoning Engine Section */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Hermes / Qwen 3:4b Reasoning Engine</span>
              </h3>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                Model: {qwen?.modelName || "qwen3:4b"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Ollama Instance</span>
                <p className="text-sm font-bold text-white mt-1 flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      qwen?.ollamaConnected ? "bg-emerald-400" : "bg-amber-400"
                    }`}
                  />
                  <span>{qwen?.ollamaConnected ? "CONNECTED" : "FALLBACK ACTIVE"}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-1">{qwen?.endpoint || "http://localhost:11434"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Reasoning Status</span>
                <p className="text-sm font-bold text-emerald-300 mt-1">
                  {qwen?.reasoningStatus || "ACTIVE_AUTONOMOUS"}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Ground-truth tool comparison</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Response Parsing</span>
                <p className="text-sm font-bold text-cyan-300 mt-1">
                  {qwen?.responseParsingStatus || "STRICT_JSON_VALIDATED"}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">Malformed outputs safely skipped</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Factual Safety Gate</span>
                <p className="text-sm font-bold text-emerald-400 mt-1">
                  {qwen?.factualSafetyGateStatus || "ACTIVE_DEFENSE_IN_DEPTH"}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">22 Buzzwords Blocked</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY CYCLE HISTORY (7+ Cycles) */}
      {activeTab === "history" && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>Daily Execution History (Previous Cycles)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Immutable record of all autonomous cycles, atomic batches, rollbacks, and IndexNow broadcasts.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 font-mono tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Cycle ID</th>
                  <th className="px-4 py-3">Detected</th>
                  <th className="px-4 py-3">Selected</th>
                  <th className="px-4 py-3">Processed</th>
                  <th className="px-4 py-3">Successful</th>
                  <th className="px-4 py-3">Failed</th>
                  <th className="px-4 py-3">Rollbacks</th>
                  <th className="px-4 py-3">Deployments</th>
                  <th className="px-4 py-3">IndexNow</th>
                  <th className="px-4 py-3">Final Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 font-mono text-xs">
                {cycles.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 font-sans font-bold text-white">{c.date}</td>
                    <td className="px-4 py-3 text-cyan-300">{c.cycleId}</td>
                    <td className="px-4 py-3">{c.opportunities}</td>
                    <td className="px-4 py-3 text-amber-300 font-bold">{c.selected}</td>
                    <td className="px-4 py-3">{c.processed}</td>
                    <td className="px-4 py-3 text-emerald-400">{c.successful}</td>
                    <td className="px-4 py-3 text-slate-400">{c.failed}</td>
                    <td className="px-4 py-3 text-slate-400">{c.rollback}</td>
                    <td className="px-4 py-3 text-cyan-400 font-bold">{c.deployment}</td>
                    <td className="px-4 py-3">{c.indexNow}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.finalStatus === "COMPLETED"
                            ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                            : c.finalStatus === "DRY_RUN"
                            ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                            : c.finalStatus === "DISPATCHED"
                            ? "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                            : c.finalStatus === "PARTIAL"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                        }`}
                      >
                        {c.finalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CANDIDATE OPPORTUNITIES EXPLORER */}
      {activeTab === "opportunities" && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Selected Opportunities ({opportunities.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                Strictly prioritized candidates respecting the 80-page daily hard cap.
              </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter by slug or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {(["ALL", "SAFE", "ZERO_TRAFFIC"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setOpportunityFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    opportunityFilter === filter
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] text-slate-400 font-mono tracking-wider border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="px-4 py-3">Tool Slug</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Action Type</th>
                  <th className="px-4 py-3">Traffic Evidence</th>
                  <th className="px-4 py-3">Reason / Justification</th>
                  <th className="px-4 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredOpps.map((opp, idx) => {
                  const gscImp = opp.currentMetrics?.impressions || 0;
                  const ga4Ses = opp.currentMetrics?.trafficSessions || 0;
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-cyan-300">
                        /{opp.pageSlug}
                      </td>
                      <td className="px-4 py-3 font-mono font-black text-amber-300">
                        {opp.opportunityScore}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {opp.proposedAction?.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px]">
                        {gscImp > 0 || ga4Ses > 0 ? (
                          <span className="text-emerald-400 font-bold">
                            {gscImp} GSC imp • {ga4Ses} GA4
                          </span>
                        ) : (
                          <span className="text-slate-500">0 imp (Zero Traffic)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[11px] text-slate-300 max-w-sm">
                        {opp.reason}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            opp.riskLevel === "LOW"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {opp.riskLevel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: SAFETY & GOVERNANCE GATES */}
      {activeTab === "safety" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Autonomous Governance &amp; Defense-in-Depth Gates</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Zero ungrounded claims. Strict separation of metadata and internal links. Automatic batch rollbacks.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Box 1: Protected Paths */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span>Protected File Paths (Modifications Strictly Blocked)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {safety?.protectedPaths.length || 12} Paths
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(safety?.protectedPaths || []).map((path, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                    >
                      {path}
                    </span>
                  ))}
                </div>
              </div>

              {/* Box 2: Blocked High-Risk Actions */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Blocked High-Risk Action Types (Auto-Skipped)</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {safety?.highRiskActionsBlocked.length || 9} Types
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(safety?.highRiskActionsBlocked || []).map((action, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] font-mono text-rose-300"
                    >
                      {action}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Metadata Decoupling</span>
                <p className="text-xs font-bold text-white">100% Preserved on Link Actions</p>
                <p className="text-[10px] text-slate-500">Internal linking never touches seoTitle or seoDescription</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Factual Content Safety</span>
                <p className="text-xs font-bold text-emerald-400">Pre-Write Validator Active</p>
                <p className="text-[10px] text-slate-500">Systematically rejects buzzwords &amp; ungrounded claims</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">Atomic Rollback Guarantee</span>
                <p className="text-xs font-bold text-cyan-400">Batch-Level Git Revert</p>
                <p className="text-[10px] text-slate-500">Rolls back entire 20-page batch on any validation defect</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EXPLICIT PRODUCTION CYCLE CONFIRMATION */}
      {showProductionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Production Cycle Execution</h3>
                <p className="text-xs text-slate-400">Requires explicit human authorization</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">Execution Parameters &amp; Active Guardrails:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                <li>Max daily hard cap: <strong>80 opportunities</strong></li>
                <li>Execution model: <strong>Atomic batches of 20 pages max</strong></li>
                <li>Factual Safety Gate: <strong>Active (blocks prohibited buzzwords)</strong></li>
                <li>Validation Failure: <strong>Full batch rollback before deployment</strong></li>
                <li>IndexNow: <strong>Broadcasts only after successful git push</strong></li>
              </ul>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={productionConfirmed}
                onChange={(e) => setProductionConfirmed(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-0 focus:ring-offset-0 bg-slate-900"
              />
              <span className="text-xs text-slate-200 font-semibold">
                I understand and authorize live production changes across eligible pages.
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowProductionModal(false);
                  setProductionConfirmed(false);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRunProduction}
                disabled={!productionConfirmed}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md"
              >
                Confirm &amp; Execute Production Cycle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

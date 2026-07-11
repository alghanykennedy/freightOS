/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  TrendingUp,
  DollarSign,
  Calendar,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";

interface ReportViewProps {
  store: FreightStore;
}

export default function ReportView({ store }: ReportViewProps) {
  const { shipments } = store;
  const [exportLoading, setExportLoading] = useState<string | null>(null);

  // Derive counts
  const completed = shipments.filter((s) => s.status === "Completed").length;
  const active = shipments.filter(
    (s) => s.status !== "Completed" && s.status !== "Delayed",
  ).length;
  const delayed = shipments.filter((s) => s.status === "Delayed").length;
  const totalCount = shipments.length;

  const simulateExport = (type: string) => {
    setExportLoading(type);
    setTimeout(() => {
      setExportLoading(null);
      alert(
        `Manifest report successfully exported as FreightOS_Report_2026.${type.toLowerCase()}`,
      );
    }, 1200);
  };

  return (
    <div className="space-y-6" id="reports-view-root">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            Analytical Reports
          </h1>
          <p className="text-xs text-slate-500 font-semibold font-mono">
            Performance KPIs, container volumes, and financial indicators
          </p>
        </div>

        {/* Export triggers */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!!exportLoading}
            onClick={() => simulateExport("XLSX")}
            className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            {exportLoading === "XLSX" ? "Generating..." : "Export Excel"}
          </button>
          <button
            type="button"
            disabled={!!exportLoading}
            onClick={() => simulateExport("PDF")}
            className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50">
            <FileText className="w-4 h-4 text-red-600" />
            {exportLoading === "PDF" ? "Generating..." : "Export PDF"}
          </button>
        </div>
      </div>

      {/* Grid: Top metrics cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        id="reports-metrics">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              TEU Volume Capacity
            </span>
            <span className="text-xl font-bold text-slate-950 font-display">
              180 TEUs
            </span>
            <span className="block text-[9px] text-emerald-600 font-semibold mt-0.5">
              ↑ 12% vs last month
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Estimated Revenue Invoice
            </span>
            <span className="text-xl font-bold text-slate-950 font-display">
              $84,300
            </span>
            <span className="block text-[9px] text-emerald-600 font-semibold mt-0.5">
              ↑ 8% pipeline growth
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Average Port-to-Port Transit
            </span>
            <span className="text-xl font-bold text-slate-950 font-display">
              10.4 Days
            </span>
            <span className="block text-[9px] text-emerald-600 font-semibold mt-0.5">
              ↓ 1.2 days delay decrease
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Charts */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        id="reports-charts-grid">
        {/* Chart A: Monthly Ocean Revenue (Spline Line Area) */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Financial Invoice Ledger
            </h3>
            <span className="text-xs font-medium text-slate-500">
              Gross income ($ USD) over the last 2 quarters
            </span>
          </div>

          <div className="w-full h-48 relative" id="chart-revenue-spline">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 500 160">
              {/* Horizontal gridlines */}
              <line
                x1="40"
                y1="20"
                x2="480"
                y2="20"
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <line
                x1="40"
                y1="60"
                x2="480"
                y2="60"
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <line
                x1="40"
                y1="100"
                x2="480"
                y2="100"
                stroke="#F1F5F9"
                strokeWidth="1"
              />
              <line
                x1="40"
                y1="140"
                x2="480"
                y2="140"
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />

              {/* Spline Area Path */}
              {/* Data points: Jan(50), Feb(65), Mar(95), Apr(80), May(125), Jun(115) */}
              <path
                d="M 60,140 Q 100,120 140,110 T 220,70 T 300,90 T 380,35 T 460,45 L 460,140 L 60,140 Z"
                fill="url(#revGrad)"
                opacity="0.15"
              />

              {/* Spline Line Path */}
              <path
                d="M 60,140 Q 100,120 140,110 T 220,70 T 300,90 T 380,35 T 460,45"
                fill="none"
                stroke="#2563EB"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Data circles */}
              {[
                { x: 60, y: 140, label: "$25k", m: "Jan" },
                { x: 140, y: 110, label: "$40k", m: "Feb" },
                { x: 220, y: 70, label: "$62k", m: "Mar" },
                { x: 300, y: 90, label: "$55k", m: "Apr" },
                { x: 380, y: 35, label: "$95k", m: "May" },
                { x: 460, y: 45, label: "$84k", m: "Jun" },
              ].map((pt, idx) => (
                <g key={idx} className="group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5.5"
                    fill="#FFFFFF"
                    stroke="#2563EB"
                    strokeWidth="3.5"
                    className="cursor-pointer hover:r-7 transition-all duration-300"
                  />
                  {/* labels on chart */}
                  <text
                    x={pt.x}
                    y={pt.y - 12}
                    fill="#1E293B"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono">
                    {pt.label}
                  </text>
                  <text
                    x={pt.x}
                    y="155"
                    fill="#94A3B8"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="font-mono">
                    {pt.m}
                  </text>
                </g>
              ))}

              {/* Gradient def */}
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Chart B: Donut Clearance Status Allocation */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Clearance Status Alloc
            </h3>
            <span className="text-xs font-medium text-slate-500">
              Live share of container logistics statuses
            </span>
          </div>

          <div
            className="flex flex-col sm:flex-row items-center gap-6 justify-center"
            id="chart-donut-allocation">
            {/* Donut SVG */}
            <div className="w-36 h-36 relative">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 36 36">
                {/* Background ring */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="3"
                />

                {/* Completed Ring (say 50%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#22C55E"
                  strokeWidth="3.2"
                  strokeDasharray="50 100"
                  strokeDashoffset="0"
                />

                {/* Active Ring (say 35%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="3.2"
                  strokeDasharray="35 100"
                  strokeDashoffset="-50"
                />

                {/* Delayed Ring (say 15%) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="3.2"
                  strokeDasharray="15 100"
                  strokeDashoffset="-85"
                />
              </svg>
              {/* Inner absolute content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold font-display text-slate-900">
                  {totalCount}
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                  Total Active
                </span>
              </div>
            </div>

            {/* Legend indicators */}
            <div className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-500"></span>
                <span>Completed Pod Leg ({completed} cargo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600"></span>
                <span>Active In-Transit ({active} cargo)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-red-500"></span>
                <span>Weather/Customs Hold ({delayed} cargo)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

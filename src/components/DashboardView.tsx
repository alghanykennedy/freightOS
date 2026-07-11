/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Ship,
  Calendar,
  CheckSquare,
  AlertTriangle,
  Play,
  FileText,
  Plus,
  Search,
  ChevronRight,
  User,
  TrendingUp,
  Clock,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { Shipment, Task } from "../types";

interface DashboardViewProps {
  store: FreightStore;
  onNavigateShipment: (id: string) => void;
  onOpenCreateShipmentModal: () => void;
  onOpenCreateQuotationModal: () => void;
  onOpenUploadDocumentModal: () => void;
}

export default function DashboardView({
  store,
  onNavigateShipment,
  onOpenCreateShipmentModal,
  onOpenCreateQuotationModal,
  onOpenUploadDocumentModal,
}: DashboardViewProps) {
  const { shipments, tasks, activities, setSelectedShipmentId, setActiveTab } =
    store;

  // Derive counts
  const totalCount = shipments.length;
  const activeCount = shipments.filter(
    (s) =>
      s.status === "In Transit" ||
      s.status === "At Customs" ||
      s.status === "Out for Delivery",
  ).length;
  const customsCount = shipments.filter(
    (s) => s.status === "At Customs",
  ).length;
  const deliveryCount = shipments.filter(
    (s) => s.status === "Out for Delivery",
  ).length;
  const completedCount = shipments.filter(
    (s) => s.status === "Completed",
  ).length;
  const delayedCount = shipments.filter((s) => s.status === "Delayed").length;

  // Filter tasks due today or yesterday that are not completed
  const tasksDueToday = tasks.filter(
    (t) =>
      t.status !== "Done" &&
      (t.dueDate === "2026-07-09" || t.dueDate === "2026-07-08"),
  );

  // Free time alerts (ETA is past or near, demurrage starts soon)
  const demurrageRisks = shipments.filter(
    (s) => s.alertStatus === "red" || s.alertStatus === "yellow",
  );

  // Handle clicking on recent activities linked to shipments
  const handleActivityClick = (shipmentId: string) => {
    if (shipmentId && shipmentId !== "system") {
      setSelectedShipmentId(shipmentId);
      setActiveTab("Shipments");
    }
  };

  return (
    <div className="space-y-6" id="dashboard-root">
      {/* Top Welcome / Stats Header */}
      <div
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        id="dashboard-welcome">
        <div>
          <h1 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">
            Logistics Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            What is happening in your network today?
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold font-mono bg-white border border-slate-200 py-1.5 px-3 rounded-xl shadow-sm text-slate-600">
          <Clock className="w-4 h-4 text-blue-600" />
          SYSTEM TIME: 2026-07-08 18:26 (UTC-7)
        </div>
      </div>

      {/* KPI Cards Bento-Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        id="dashboard-kpis">
        {/* KPI: Total */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total
            </span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-700">
              <Ship className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-900">
            {totalCount}
          </p>
          <span className="text-[10px] text-slate-400 font-medium font-mono">
            Consolidated Bookings
          </span>
        </div>

        {/* KPI: Active */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active
            </span>
            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
              <Play className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-blue-600">
            {activeCount}
          </p>
          <span className="text-[10px] text-blue-400 font-medium font-mono">
            In Transit / Clearance
          </span>
        </div>

        {/* KPI: At Customs */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              At Customs
            </span>
            <div className="p-1.5 bg-cyan-50 rounded-lg text-cyan-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-cyan-600">
            {customsCount}
          </p>
          <span className="text-[10px] text-cyan-400 font-medium font-mono">
            Awaiting Clearance
          </span>
        </div>

        {/* KPI: Out for Delivery */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Delivery
            </span>
            <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-emerald-600">
            {deliveryCount}
          </p>
          <span className="text-[10px] text-emerald-400 font-medium font-mono">
            Dispatched Trailer Leg
          </span>
        </div>

        {/* KPI: Completed */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-slate-500">
            {completedCount}
          </p>
          <span className="text-[10px] text-slate-400 font-medium font-mono">
            POD Signed Archive
          </span>
        </div>

        {/* KPI: Delayed */}
        <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Delayed
            </span>
            <div className="p-1.5 bg-amber-50 rounded-lg text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-display text-amber-600">
            {delayedCount}
          </p>
          <span className="text-[10px] text-amber-400 font-medium font-mono">
            Weather / Port Hold
          </span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        id="dashboard-bento">
        {/* Left Column (2 cols wide on large): Timelines & Schedules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 tracking-tight uppercase text-[11px] text-slate-400">
              Quick Operations
            </h3>
            <div
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
              id="quick-actions-grid">
              <button
                type="button"
                onClick={onOpenCreateShipmentModal}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer group">
                <div className="p-2.5 bg-blue-600 rounded-lg text-white group-hover:scale-105 transition-all">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    New Booking
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Create container leg
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenUploadDocumentModal}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer group">
                <div className="p-2.5 bg-indigo-600 rounded-lg text-white group-hover:scale-105 transition-all">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    Upload BL/Invoice
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Drag & drop workspace
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={onOpenCreateQuotationModal}
                className="p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center gap-3.5 transition-all text-left cursor-pointer group">
                <div className="p-2.5 bg-emerald-600 rounded-lg text-white group-hover:scale-105 transition-all">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    Generate Quote
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Calculate rates + margin
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Active Shipments Table (Abridged) */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight uppercase text-[11px] text-slate-400">
                  Active Vessel Tracking
                </h3>
                <span className="text-xs text-slate-400 font-semibold font-mono">
                  Immediate customs or delivery status
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("Shipments")}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
                View All Shipments
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Ref & Customer</th>
                    <th className="py-3 px-4">Route</th>
                    <th className="py-3 px-4">Container</th>
                    <th className="py-3 px-4">Status & ETA</th>
                    <th className="py-3 px-4">PIC</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shipments.slice(0, 4).map((shp) => (
                    <tr
                      key={shp.id}
                      className="hover:bg-slate-50/50 transition-all text-xs font-medium text-slate-700 cursor-pointer"
                      onClick={() => onNavigateShipment(shp.id)}>
                      <td className="py-3.5 px-4">
                        <span className="block font-semibold text-slate-950 font-mono">
                          {shp.referenceNumber}
                        </span>
                        <span className="block text-[10px] text-slate-400 max-w-[150px] truncate">
                          {shp.consignee}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="block text-slate-800">
                          {shp.destination.split(",")[0]}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          from {shp.origin.split(" ")[0]}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="block">
                          {shp.containerCount}x{" "}
                          {shp.containerType.split(" ")[0]}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          {shp.shippingLine}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold mb-1 ${
                            shp.status === "At Customs"
                              ? "bg-cyan-50 text-cyan-700 border border-cyan-150"
                              : shp.status === "Delayed"
                                ? "bg-amber-50 text-amber-700 border border-amber-150"
                                : shp.status === "Out for Delivery"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                                  : shp.status === "In Transit"
                                    ? "bg-blue-50 text-blue-700 border border-blue-150"
                                    : "bg-slate-50 text-slate-600 border border-slate-150"
                          }`}>
                          {shp.status}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          ETA {shp.eta}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">
                        {shp.pic.split(" ")[0]}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Core Analytics Graph (Stripe Style Custom SVG render) */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight uppercase text-[11px] text-slate-400">
                  Shipment Volume Trend
                </h3>
                <span className="text-xs text-slate-400 font-semibold font-mono">
                  Monthly TEUs processed
                </span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-mono font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>40HC
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-cyan-400"></span>20GP
                </span>
              </div>
            </div>

            {/* Visual SVG Chart */}
            <div
              className="w-full h-44 relative mt-2"
              id="dashboard-volume-chart">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 500 160">
                {/* Y Axis gridlines */}
                <line
                  x1="0"
                  y1="20"
                  x2="500"
                  y2="20"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="60"
                  x2="500"
                  y2="60"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="100"
                  x2="500"
                  y2="100"
                  stroke="#F1F5F9"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1="140"
                  x2="500"
                  y2="140"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />

                {/* Vertical bars group (6 months) */}
                {/* Jan (120), Feb (150), Mar (240), Apr (190), May (310), Jun (280) */}
                {[
                  { m: "Jan", val40: 30, val20: 20 },
                  { m: "Feb", val40: 45, val20: 15 },
                  { m: "Mar", val40: 65, val20: 35 },
                  { m: "Apr", val40: 50, val20: 40 },
                  { m: "May", val40: 85, val20: 45 },
                  { m: "Jun", val40: 75, val20: 50 },
                ].map((item, idx) => {
                  const x = 40 + idx * 80;
                  const h40 = item.val40;
                  const h20 = item.val20;
                  return (
                    <g key={item.m} className="group cursor-pointer">
                      {/* Bar 40HC */}
                      <rect
                        x={x}
                        y={140 - h40}
                        width="18"
                        height={h40}
                        fill="#2563EB"
                        rx="3"
                        className="transition-all duration-300 hover:fill-blue-700"
                      />
                      {/* Bar 20GP */}
                      <rect
                        x={x + 20}
                        y={140 - h20}
                        width="18"
                        height={h20}
                        fill="#06B6D4"
                        rx="3"
                        className="transition-all duration-300 hover:fill-cyan-500"
                      />
                      {/* Labels */}
                      <text
                        x={x + 19}
                        y="155"
                        fill="#94A3B8"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                        className="font-mono">
                        {item.m}
                      </text>
                      {/* Tooltip on hover */}
                      <title>{`${item.m}: 40HC=${item.val40} TEU, 20GP=${item.val20} TEU`}</title>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts, Tasks, Activities */}
        <div className="space-y-6" id="dashboard-sidebar">
          {/* Urgent Alerts Block */}
          <div className="bg-red-50/50 border border-red-100 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-3 text-red-800">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider">
                Critical Deadlines
              </h4>
            </div>
            {demurrageRisks.length === 0 ? (
              <p className="text-xs text-slate-500">
                No shipments facing demurrage hazards today.
              </p>
            ) : (
              <div className="space-y-2.5">
                {demurrageRisks.map((shp) => (
                  <div
                    key={shp.id}
                    className="p-3 bg-white border border-red-100 rounded-xl hover:border-red-300 cursor-pointer transition-all"
                    onClick={() => onNavigateShipment(shp.id)}>
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {shp.referenceNumber}
                      </span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-100 text-red-800 uppercase tracking-wide">
                        {shp.status === "At Customs"
                          ? "Clearance Hold"
                          : "Delay Risk"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-[220px] truncate">
                      {shp.consignee}
                    </p>
                    <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-red-50/50 text-[10px] text-red-700 font-semibold font-mono">
                      <span>Demurrage: ${shp.demurrage}/day</span>
                      <span>Free Time: {shp.freeTime} Days</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tasks Due Today (Linear Style Checkbox) */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight uppercase text-[11px] text-slate-400">
                My Queue Today
              </h3>
              <span className="text-[10px] font-bold font-mono bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {tasksDueToday.length} Pending
              </span>
            </div>
            {tasksDueToday.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                🎉 No pending tasks for today!
              </div>
            ) : (
              <div className="space-y-3">
                {tasksDueToday.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-slate-100/50 rounded-xl transition-all border border-slate-100">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      checked={task.status === "Done"}
                      onChange={() => {
                        const updated = { ...task, status: "Done" as const };
                        store.updateTask(updated);
                        store.addLog(
                          task.shipmentId,
                          `Task completed: "${task.title}"`,
                        );
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="block text-xs font-medium text-slate-800 leading-normal">
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] font-mono font-bold bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                          {task.shipmentRef}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            task.priority === "Urgent"
                              ? "bg-red-100 text-red-800"
                              : task.priority === "High"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                          }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Operations Activity Feed */}
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 tracking-tight uppercase text-[11px] text-slate-400">
              Activity Logs
            </h3>
            <div
              className="space-y-4 max-h-[300px] overflow-y-auto pr-1"
              id="dashboard-activity-feed">
              {activities.slice(0, 6).map((act) => (
                <div
                  key={act.id}
                  className="relative pl-5 before:absolute before:left-1 before:top-1.5 before:bottom-[-20px] before:w-[1.5px] before:bg-slate-150 last:before:hidden cursor-pointer"
                  onClick={() => handleActivityClick(act.shipmentId)}>
                  {/* Point node */}
                  <div className="absolute left-[-1.5px] top-1.5 w-2 h-2 rounded-full border-[2px] border-blue-600 bg-white"></div>
                  <p className="text-xs text-slate-700 leading-normal font-medium">
                    {act.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold font-mono">
                    <span>{act.user}</span>
                    <span>•</span>
                    <span>{act.timestamp.split(" ")[1] || act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

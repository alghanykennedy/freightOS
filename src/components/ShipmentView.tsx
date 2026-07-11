/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  MapPin,
  Calendar,
  User,
  Ship,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { Shipment, ShipmentStatus } from "../types";
import CreateShipmentModal from "./CreateShipmentModal";

interface ShipmentViewProps {
  store: FreightStore;
  onSelectShipment: (id: string) => void;
  onOpenCreateModal: () => void;
}

export default function ShipmentView({
  store,
  onSelectShipment,
  onOpenCreateModal,
}: ShipmentViewProps) {
  const { shipments, currentRole } = store;

  // View states
  const [layoutMode, setLayoutMode] = useState<"table" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [originFilter, setOriginFilter] = useState<string>("all");
  const [carrierFilter, setCarrierFilter] = useState<string>("all");
  const [picFilter, setPicFilter] = useState<string>("all");

  // Filter lists
  const origins = Array.from(
    new Set(shipments.map((s) => s.origin.split(",")[0])),
  );
  const carriers = Array.from(new Set(shipments.map((s) => s.shippingLine)));
  const pics = Array.from(new Set(shipments.map((s) => s.pic)));

  // Filter application
  const filteredShipments = shipments.filter((shp) => {
    const matchesSearch =
      shp.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shp.consignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shp.shipper.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shp.commodity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || shp.status === statusFilter;
    const matchesOrigin =
      originFilter === "all" || shp.origin.includes(originFilter);
    const matchesCarrier =
      carrierFilter === "all" || shp.shippingLine === carrierFilter;
    const matchesPic = picFilter === "all" || shp.pic === picFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesOrigin &&
      matchesCarrier &&
      matchesPic
    );
  });

  const statuses: ShipmentStatus[] = [
    "Booking Confirmed",
    "In Transit",
    "At Customs",
    "Out for Delivery",
    "Completed",
    "Delayed",
  ];

  const getAlertColor = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-500 ring-red-100";
      case "yellow":
        return "bg-amber-500 ring-amber-150";
      case "blue":
        return "bg-blue-500 ring-blue-100";
      default:
        return "bg-emerald-500 ring-emerald-100";
    }
  };

  const getStatusColor = (status: ShipmentStatus) => {
    switch (status) {
      case "Booking Confirmed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "In Transit":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "At Customs":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      case "Out for Delivery":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Completed":
        return "bg-slate-50 text-slate-600 border-slate-200";
      case "Delayed":
        return "bg-red-50 text-red-700 border-red-250";
    }
  };

  return (
    <div className="space-y-5" id="shipment-view-root">
      {/* Title + Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
            Active Cargo List
          </h1>
          <p className="text-xs text-slate-500 font-semibold font-mono">
            Operations tracking and milestone dispatching
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggles */}
          <div className="bg-slate-100 border border-slate-200 p-1 rounded-xl flex items-center">
            <button
              type="button"
              className={`p-1.5 rounded-lg transition-all ${layoutMode === "table" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-800"}`}
              onClick={() => setLayoutMode("table")}
              title="Table view">
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              className={`p-1.5 rounded-lg transition-all ${layoutMode === "kanban" ? "bg-white shadow-sm text-slate-800" : "text-slate-500 hover:text-slate-800"}`}
              onClick={() => setLayoutMode("kanban")}
              title="Kanban Board view">
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* New shipment booking (Role Restricted: Operations/Admin) */}
          {["Admin", "Operations", "Manager"].includes(currentRole) && (
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              Book Shipment
            </button>
          )}
        </div>
      </div>

      {/* Dense Filter Tray */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search reference, customer, cargo commodity, or exporter..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-slate-900 font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status Selector */}
            <select
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Origin Selector */}
            <select
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}>
              <option value="all">All Origins</option>
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>

            {/* Carrier Selector */}
            <select
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={carrierFilter}
              onChange={(e) => setCarrierFilter(e.target.value)}>
              <option value="all">All Carriers</option>
              {carriers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* PIC Selector */}
            <select
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={picFilter}
              onChange={(e) => setPicFilter(e.target.value)}>
              <option value="all">All Operators</option>
              {pics.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main View Display */}
      {filteredShipments.length === 0 ? (
        <div className="bg-white border border-slate-200/80 p-12 rounded-2xl text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">
            No matching cargo found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try clearing your filters or typing another reference ID.
          </p>
        </div>
      ) : layoutMode === "table" ? (
        /* Layout: TABLE VIEW */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-150 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Ref & Status Alert</th>
                  <th className="py-3 px-4">Customer & Shipper</th>
                  <th className="py-3 px-4">Routing Ports</th>
                  <th className="py-3 px-4">Equip / Carrier</th>
                  <th className="py-3 px-4">Free Time left</th>
                  <th className="py-3 px-4">Progress Meter</th>
                  <th className="py-3 px-4 text-right">Clearance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map((shp) => (
                  <tr
                    key={shp.id}
                    className="hover:bg-slate-50/50 transition-all text-xs font-medium text-slate-700 cursor-pointer"
                    onClick={() => onSelectShipment(shp.id)}>
                    <td className="py-3.5 px-4 flex items-center gap-2.5">
                      {/* Pulse Status Alert circle */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full ring-4 ${getAlertColor(shp.alertStatus)}`}></span>
                      <div>
                        <span className="block font-bold text-slate-950 font-mono text-xs">
                          {shp.referenceNumber}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                          PIC: {shp.pic.split(" ")[0]}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="block font-semibold text-slate-900 max-w-[180px] truncate">
                        {shp.consignee}
                      </span>
                      <span className="block text-[10px] text-slate-400 max-w-[180px] truncate">
                        Exp: {shp.shipper}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="block text-slate-800">
                        {shp.destination.split(",")[0]}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-widest">
                        Origin: {shp.origin.split(" ")[0]}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="block">
                        {shp.containerCount}x {shp.containerType.split(" ")[0]}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono">
                        {shp.shippingLine}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px]">
                      <span
                        className={`px-1.5 py-0.5 rounded ${shp.alertStatus === "red" ? "bg-red-50 text-red-600 font-bold" : "text-slate-500"}`}>
                        {shp.freeTime} Days free
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${shp.progress}%` }}></div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 font-mono mt-1 block">
                        {shp.progress}% Complete
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right flex justify-end items-center gap-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${getStatusColor(shp.status)}`}>
                        {shp.status}
                      </span>
                      {["Admin", "Operations", "Manager"].includes(currentRole) && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete shipment ${shp.referenceNumber}?`)) {
                              store.deleteShipment(shp.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Shipment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Layout: KANBAN BOARD */
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4"
          id="kanban-deck">
          {statuses.map((status) => {
            const statusShipments = filteredShipments.filter(
              (s) => s.status === status,
            );
            return (
              <div
                key={status}
                className="bg-slate-100/60 border border-slate-200/50 p-3 rounded-2xl space-y-3 min-w-[200px]"
                id={`kanban-col-${status.toLowerCase().replace(/\s/g, "-")}`}>
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-xs font-bold text-slate-800 tracking-tight leading-normal truncate max-w-[120px]">
                    {status}
                  </h3>
                  <span className="text-[10px] font-mono font-bold bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded-full">
                    {statusShipments.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {statusShipments.map((shp) => (
                    <div
                      key={shp.id}
                      className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                      onClick={() => onSelectShipment(shp.id)}>
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-mono font-bold text-slate-950 text-xs tracking-tight">
                          {shp.referenceNumber}
                        </span>
                        <span
                          className={`w-2 h-2 rounded-full ring-4 shrink-0 ${getAlertColor(shp.alertStatus)}`}></span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800 leading-normal mt-2 truncate">
                        {shp.consignee}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate font-medium">
                        Cargo: {shp.commodity}
                      </p>

                      <div className="grid grid-cols-2 gap-1.5 mt-3 pt-2.5 border-t border-slate-100 text-[9px] font-mono font-semibold text-slate-500">
                        <div className="flex flex-col">
                          <span className="text-[8px] uppercase text-slate-400 font-bold">
                            Origin
                          </span>
                          <span className="truncate">
                            {shp.origin.split(" ")[0]}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] uppercase text-slate-400 font-bold">
                            Dest
                          </span>
                          <span className="truncate">
                            {shp.destination.split(" ")[0]}
                          </span>
                        </div>
                      </div>

                      {/* Carrier + Progress */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[9px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                          {shp.shippingLine.split(" ")[0]}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold font-mono text-slate-400">
                            {shp.progress}% Complete
                          </span>
                          {["Admin", "Operations", "Manager"].includes(currentRole) && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete shipment ${shp.referenceNumber}?`)) {
                                  store.deleteShipment(shp.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                              title="Delete Shipment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {statusShipments.length === 0 && (
                    <div className="py-6 text-center text-slate-400 text-[10px] font-semibold border border-dashed border-slate-200 rounded-xl bg-white/50">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Render the Create Shipment Modal if open */}
      {isCreateModalOpen && (
        <CreateShipmentModal
          store={store}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
}

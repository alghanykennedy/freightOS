/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Ship,
  Truck,
  ShieldCheck,
  Warehouse,
  Star,
  Search,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Info,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { Vendor } from "../types";

interface VendorViewProps {
  store: FreightStore;
}

export default function VendorView({ store }: VendorViewProps) {
  const { vendors } = store;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(
    vendors[0]?.id || null,
  );

  const filteredVendors = vendors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.coverage.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesType = selectedType === "all" || v.type === selectedType;
    return matchesSearch && matchesType;
  });

  const selectedVendor =
    vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  const getVendorIcon = (type: string) => {
    switch (type) {
      case "Shipping Line":
        return <Ship className="w-5 h-5 text-blue-600" />;
      case "Trucking":
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case "Customs Broker":
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case "Container Depot":
        return <Warehouse className="w-5 h-5 text-amber-600" />;
      default:
        return <Ship className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-5" id="vendors-view-root">
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
          Vendor rate cards
        </h1>
        <p className="text-xs text-slate-500 font-semibold font-mono">
          Ocean liners, local trucking dispatchers, and broker registries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Vendor directory */}
        <div
          className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]"
          id="vendors-directory">
          {/* Header Search & Filter */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 space-y-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search coverage or carrier name..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type selector pill group */}
            <div className="flex flex-wrap gap-1.5" id="vendor-type-filter">
              {[
                "all",
                "Shipping Line",
                "Trucking",
                "Customs Broker",
                "Container Depot",
              ].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`px-2 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                    selectedType === type
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                  onClick={() => setSelectedType(type)}>
                  {type === "all" ? "All Types" : type}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Rows */}
          <div
            className="flex-1 overflow-y-auto divide-y divide-slate-100"
            id="vendors-rows">
            {filteredVendors.map((v) => (
              <div
                key={v.id}
                className={`p-4 cursor-pointer transition-all flex justify-between items-center ${
                  selectedVendorId === v.id
                    ? "bg-blue-50/50 border-l-4 border-blue-600"
                    : "hover:bg-slate-50/50"
                }`}
                onClick={() => setSelectedVendorId(v.id)}>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-1.5 bg-slate-100 rounded-lg shrink-0">
                    {getVendorIcon(v.type)}
                  </div>
                  <div className="min-w-0">
                    <span className="block font-semibold text-slate-900 text-xs truncate">
                      {v.name}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-semibold uppercase">
                      {v.type}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold justify-end">
                    <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                    {v.rating}
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono font-semibold">
                    {v.historyCount} past legs
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Price listing & detail cards */}
        {selectedVendor ? (
          <div className="lg:col-span-2 space-y-6" id="vendor-details-pane">
            {/* Base Profile info card */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-start flex-wrap gap-3 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                    {getVendorIcon(selectedVendor.type)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-950">
                      {selectedVendor.name}
                    </h2>
                    <span className="text-xs text-slate-500 font-semibold uppercase">
                      {selectedVendor.type}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 py-1 px-2.5 rounded-lg text-xs font-bold border border-amber-100">
                  <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                  {selectedVendor.rating} Rating
                </div>
              </div>

              {/* Direct contacts list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{selectedVendor.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="font-mono">
                    {selectedVendor.contactPhone}
                  </span>
                </div>
              </div>

              {/* Coverages */}
              <div className="flex gap-1.5 flex-wrap pt-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1">
                  Regions Covered:
                </span>
                {selectedVendor.coverage.map((c) => (
                  <span
                    key={c}
                    className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-semibold rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Price list rate cards */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Rate Sheet Matrix
                </h3>
                <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                  Spot market reference
                </span>
              </div>

              <div className="divide-y divide-slate-100" id="vendor-rates">
                {selectedVendor.priceList.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-3 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">
                      {item.item}
                    </span>
                    <span className="font-mono font-bold text-blue-600 text-sm">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Routes and Operational records */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-normal">
                <span className="font-bold text-slate-800 block">
                  System Synced Integration Status
                </span>
                Leg tracking data synced dynamically with carrier. Last
                successful manifest download was today at 18:00 UTC.
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-slate-200 p-12 rounded-2xl text-center">
            <p className="text-slate-500 text-xs">
              Select a vendor from the left panel to inspect their detailed rate
              sheets.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

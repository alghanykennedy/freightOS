/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Search,
  ChevronRight,
  Star,
  Plus,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { Client } from "../types";

interface ClientViewProps {
  store: FreightStore;
}

export default function ClientView({ store }: ClientViewProps) {
  const { clients, shipments, quotations } = store;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    clients[0]?.id || null,
  );

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedClient =
    clients.find((c) => c.id === selectedClientId) || clients[0];

  // Specific client historic shipment linkages
  const clientShipments = selectedClient
    ? shipments.filter(
        (s) =>
          s.consignee === selectedClient.name ||
          s.shipper.includes(selectedClient.name),
      )
    : [];

  const clientQuotations = selectedClient
    ? quotations.filter((q) => q.clientId === selectedClient.id)
    : [];

  return (
    <div className="space-y-5" id="clients-view-root">
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
          Client Hub (CRM Lite)
        </h1>
        <p className="text-xs text-slate-500 font-semibold font-mono">
          Manage accounts, credit limits, and booking histories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Client Listing */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Header search */}
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4.5 h-4.5" />
              </span>
              <input
                type="text"
                placeholder="Search corporate directories..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Client Rows list */}
          <div
            className="flex-1 overflow-y-auto divide-y divide-slate-100"
            id="clients-list">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className={`p-4 cursor-pointer transition-all flex justify-between items-center ${
                  selectedClientId === client.id
                    ? "bg-blue-50/55 border-l-4 border-blue-600"
                    : "hover:bg-slate-50/50"
                }`}
                onClick={() => setSelectedClientId(client.id)}>
                <div className="min-w-0">
                  <span className="block font-semibold text-slate-900 text-xs truncate">
                    {client.name}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                    {client.company}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-[10px] font-bold text-slate-700 font-mono">
                    {client.shipmentCount} Shipments
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    {client.outstandingJobs} outstanding
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Account Dossier Details */}
        {selectedClient ? (
          <div className="lg:col-span-2 space-y-6" id="client-detail-pane">
            {/* Upper profile header */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-start flex-wrap gap-3 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold text-base">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-950">
                      {selectedClient.name}
                    </h2>
                    <span className="text-xs text-slate-500 font-semibold uppercase">
                      {selectedClient.company}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 py-1 px-2.5 rounded-lg text-xs font-bold border border-amber-100">
                  <Star className="w-4 h-4 fill-amber-500 stroke-amber-500" />
                  {selectedClient.rating} Rating
                </div>
              </div>

              {/* Direct Contacts Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">
                    {selectedClient.contactEmail}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono">
                    {selectedClient.contactPhone}
                  </span>
                </div>
                <div className="flex items-center gap-2 col-span-1 sm:col-span-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{selectedClient.address}</span>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-xs">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Operational Directives
                </span>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {selectedClient.notes}
                </p>
              </div>
            </div>

            {/* Shipment & Quotation histories */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Jobs list */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Active Shipments ({clientShipments.length})
                </h3>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {clientShipments.map((shp) => (
                    <div
                      key={shp.id}
                      className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="block font-bold text-slate-900 font-mono">
                          {shp.referenceNumber}
                        </span>
                        <span className="block text-[9px] text-slate-400">
                          {shp.origin.split(" ")[0]} →{" "}
                          {shp.destination.split(" ")[0]}
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[9px] rounded uppercase">
                        {shp.status}
                      </span>
                    </div>
                  ))}
                  {clientShipments.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                      No active shipments.
                    </div>
                  )}
                </div>
              </div>

              {/* Quotations archive */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
                  Quotations Log ({clientQuotations.length})
                </h3>
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {clientQuotations.map((qte) => (
                    <div
                      key={qte.id}
                      className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="block font-mono text-[10px] text-slate-400 uppercase">
                          {qte.id}
                        </span>
                        <span className="block text-[9px] text-slate-500 font-mono">
                          {qte.volume} FCL
                        </span>
                      </div>
                      <span className="font-bold text-blue-600 font-mono">
                        ${qte.totalCost.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  {clientQuotations.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                      No past quotes found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-slate-200 p-12 rounded-2xl text-center flex flex-col items-center justify-center">
            <p className="text-slate-500 text-xs">
              Select a corporate client account to inspect full dossier files.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

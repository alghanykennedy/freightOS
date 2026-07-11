/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Ship,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { ChargeItem } from "../types";

interface QuotationViewProps {
  store: FreightStore;
}

export default function QuotationView({ store }: QuotationViewProps) {
  const {
    quotations,
    clients,
    addQuotation,
    convertQuotationToShipment,
    currentRole,
  } = store;

  // New quotation wizard steps: 1 = Client & Route, 2 = Charges, 3 = Margins & Save
  const [wizardStep, setWizardStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState(
    clients[0]?.id || "",
  );
  const [qteType, setQteType] = useState<"FCL" | "LCL" | "Air">("FCL");
  const [originPort, setOriginPort] = useState("Shanghai Port, China");
  const [destinationPort, setDestinationPort] = useState(
    "Tanjung Priok, Jakarta, Indonesia",
  );
  const [containerSpec, setContainerSpec] = useState("40HC Dry Van");
  const [cargoVolume, setCargoVolume] = useState("1 x 40HC");

  // Dynamic Charges Checklist
  const [charges, setCharges] = useState<ChargeItem[]>([
    { name: "Ocean Freight Rate (Base)", amount: 1850 },
    { name: "Terminal Handling Charge (THC)", amount: 160 },
    { name: "Local Trucking to Destination Warehouse", amount: 220 },
    { name: "Customs Clearance PIB Filing", amount: 110 },
  ]);
  const [newChargeName, setNewChargeName] = useState("");
  const [newChargeAmount, setNewChargeAmount] = useState("");

  // Margins
  const [margin, setMargin] = useState(15); // Default 15% margin

  const handleAddCharge = () => {
    if (!newChargeName.trim() || !newChargeAmount) return;
    setCharges([
      ...charges,
      { name: newChargeName, amount: parseFloat(newChargeAmount) || 0 },
    ]);
    setNewChargeName("");
    setNewChargeAmount("");
  };

  const handleRemoveCharge = (index: number) => {
    setCharges(charges.filter((_, idx) => idx !== index));
  };

  // Calculations
  const subtotalCost = charges.reduce((sum, c) => sum + c.amount, 0);
  const calculatedTotal =
    Math.round(subtotalCost * (1 + margin / 100) * 100) / 100;

  const handleSaveQuotation = () => {
    const client = clients.find((c) => c.id === selectedClientId) || clients[0];
    addQuotation({
      clientId: selectedClientId,
      clientName: client?.name || "Walk-in Client",
      type: qteType,
      origin: originPort,
      destination: destinationPort,
      containerType: containerSpec,
      volume: cargoVolume,
      charges: charges,
      margin: margin,
      status: "Sent",
    });
    // Reset
    setWizardStep(1);
    setCharges([
      { name: "Ocean Freight Rate (Base)", amount: 1850 },
      { name: "Terminal Handling Charge (THC)", amount: 160 },
      { name: "Local Trucking to Destination Warehouse", amount: 220 },
      { name: "Customs Clearance PIB Filing", amount: 110 },
    ]);
  };

  return (
    <div className="space-y-6" id="quotations-view-root">
      {/* Title block */}
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
          Quotation Architect
        </h1>
        <p className="text-xs text-slate-500 font-semibold font-mono">
          Build customized port-to-port rate calculations
        </p>
      </div>

      {/* Grid: Left side is Quotation builder / Right side is recent listing */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Card: Multi-Step Rate builder */}
        <div
          className="xl:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-6"
          id="quotation-builder-wizard">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Custom Freight Quotation Wizard
            </h3>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              Step {wizardStep} of 3
            </span>
          </div>

          {/* Stepper Progress Visual */}
          <div
            className="flex items-center gap-2 mb-4"
            id="wizard-steps-header">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex-1 flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    wizardStep === step
                      ? "bg-blue-600 text-white"
                      : wizardStep > step
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-400"
                  }`}>
                  {step}
                </span>
                <span
                  className={`text-[10px] font-semibold hidden sm:inline ${
                    wizardStep === step ? "text-slate-800" : "text-slate-400"
                  }`}>
                  {step === 1
                    ? "Route & Client"
                    : step === 2
                      ? "Rate Ledger"
                      : "Calculations"}
                </span>
                {step < 3 && (
                  <div className="flex-1 border-t border-slate-150"></div>
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: CLIENT & ROUTE */}
          {wizardStep === 1 && (
            <div className="space-y-4" id="wizard-step-1-form">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Select CRM Client
                  </label>
                  <select
                    className="w-full p-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedClientId}
                    onChange={(e) => setSelectedClientId(e.target.value)}>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Shipment Category
                  </label>
                  <div
                    className="grid grid-cols-3 gap-1.5"
                    id="quotation-type-toggle">
                    {(["FCL", "LCL", "Air"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                          qteType === type
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                        onClick={() => setQteType(type)}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Origin Port / Term
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold"
                    value={originPort}
                    onChange={(e) => setOriginPort(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Destination Port / Term
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold"
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                  />
                </div>
              </div>

              {qteType === "FCL" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Container Specification
                    </label>
                    <select
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                      value={containerSpec}
                      onChange={(e) => setContainerSpec(e.target.value)}>
                      <option value="40HC Dry Van">40HC Dry Van</option>
                      <option value="20GP Standard">20GP Standard</option>
                      <option value="40Ref Refrigerated">
                        40Ref Refrigerated
                      </option>
                      <option value="Flatrack Open Top">
                        Flatrack Open Top
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Volume Capacity
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold"
                      value={cargoVolume}
                      onChange={(e) => setCargoVolume(e.target.value)}
                      placeholder="e.g. 2 x 40HC"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="py-2 px-4 bg-slate-900 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer">
                  Configure Rates
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: RATE LEDGER CHARGES */}
          {wizardStep === 2 && (
            <div className="space-y-4" id="wizard-step-2-form">
              <div className="border border-slate-150 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {charges.map((c, index) => (
                  <div
                    key={index}
                    className="p-3 bg-slate-50/50 flex justify-between items-center">
                    <span className="font-semibold text-slate-800">
                      {c.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-900">
                        ${c.amount.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCharge(index)}
                        className="text-red-500 hover:text-red-700 font-bold">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add custom charge inline */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Custom Operational Charge
                  </label>
                  <input
                    type="text"
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                    value={newChargeName}
                    placeholder="e.g. Quarantine inspection fee..."
                    onChange={(e) => setNewChargeName(e.target.value)}
                  />
                </div>
                <div className="flex gap-1.5">
                  <div className="flex-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Amount ($)
                    </label>
                    <input
                      type="number"
                      className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                      value={newChargeAmount}
                      placeholder="150"
                      onChange={(e) => setNewChargeAmount(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCharge}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shrink-0 cursor-pointer h-fit self-end text-xs">
                    Add
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="py-1.5 px-3 bg-slate-100 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-200 cursor-pointer">
                  Back
                </button>
                <div className="flex items-center gap-3 font-semibold text-xs text-slate-700 font-mono">
                  <span>
                    Subtotal Cost:{" "}
                    <strong className="text-slate-900">
                      ${subtotalCost.toLocaleString()}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setWizardStep(3)}
                    className="py-2 px-4 bg-slate-900 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 hover:bg-slate-800 transition-all cursor-pointer font-sans">
                    Adjust Margin & Save
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MARGINS & AUTO CALCULATION */}
          {wizardStep === 3 && (
            <div className="space-y-6" id="wizard-step-3-form">
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Gross Operating Margin (%)
                      </label>
                      <span className="text-xs font-mono font-bold text-blue-600">
                        {margin}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      value={margin}
                      onChange={(e) =>
                        setMargin(parseInt(e.target.value) || 10)
                      }
                    />
                    <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase mt-1">
                      <span>5% (Low Spot)</span>
                      <span>20% (Standard)</span>
                      <span>40% (Premium leg)</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-semibold text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Sum Base Cost Ledger
                      </span>
                      <span className="text-slate-900 font-mono">
                        ${subtotalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        Markup Margin Profit
                      </span>
                      <span className="text-emerald-600 font-mono">
                        +$
                        {Math.round(subtotalCost * (margin / 100) * 100) / 100}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-slate-200 pt-3 text-slate-950">
                      <span>Total Invoice Quote</span>
                      <span className="text-blue-600 font-mono">
                        ${calculatedTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Quotation Sheet Rendering */}
                <div
                  className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 font-mono text-[9px] text-slate-600 select-none shadow-sm"
                  id="quotation-bill-preview">
                  <div className="text-center font-bold text-slate-900 border-b border-slate-200 pb-2">
                    PROFORMA CARGO QUOTATION
                  </div>
                  <div>
                    <strong>ORIGIN:</strong> {originPort.split(" ")[0]}
                    <br />
                    <strong>DEST:</strong> {destinationPort.split(" ")[0]}
                    <br />
                    <strong>EQUIP:</strong> {containerSpec} ({cargoVolume})
                  </div>
                  <div className="border-t border-dashed border-slate-300 pt-2 space-y-1">
                    {charges.map((c, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate max-w-[130px]">{c.name}</span>
                        <span>${c.amount}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-slate-900 border-t border-dashed border-slate-300 pt-2 text-[10px]">
                      <span>TOTAL QUOTE</span>
                      <span>${calculatedTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="py-1.5 px-3 bg-slate-100 text-slate-600 font-semibold rounded-xl text-xs hover:bg-slate-200 cursor-pointer font-sans">
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSaveQuotation}
                  className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer font-sans">
                  <CheckCircle className="w-4 h-4" />
                  Save and Send Quote
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Card: Recent Quotations */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4 h-fit">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Active Quotations
            </h3>
            <span className="text-[10px] font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
              {quotations.length} total
            </span>
          </div>

          <div className="space-y-3.5" id="recent-quotations-list">
            {quotations.map((qte) => (
              <div
                key={qte.id}
                className="p-3.5 border border-slate-150 hover:border-slate-300 rounded-xl bg-slate-50/50 hover:bg-white transition-all space-y-2.5 group">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-bold font-mono text-slate-400 block">
                      {qte.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-bold text-slate-900 block max-w-[150px] truncate">
                      {qte.clientName}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                      qte.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                        : qte.status === "Sent"
                          ? "bg-blue-50 text-blue-700 border-blue-150"
                          : "bg-slate-50 text-slate-500 border-slate-150"
                    }`}>
                    {qte.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500 font-semibold font-mono border-t border-slate-100 pt-2">
                  <div>
                    <span className="block text-[8px] uppercase text-slate-400">
                      Route ports
                    </span>
                    <span className="text-slate-800 truncate block">
                      {qte.origin.split(" ")[0]} →{" "}
                      {qte.destination.split(" ")[0]}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] uppercase text-slate-400">
                      Quote total
                    </span>
                    <span className="text-blue-600 font-bold block">
                      ${qte.totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Convert to active shipment option (Admin/Sales restricted) */}
                {qte.status !== "Approved" &&
                  ["Admin", "Sales", "Manager"].includes(currentRole) && (
                    <button
                      type="button"
                      onClick={() => {
                        const shp = convertQuotationToShipment(qte.id);
                        if (shp) {
                          alert(
                            `Successfully converted quote to active shipment! Reference: ${shp.referenceNumber}`,
                          );
                        }
                      }}
                      className="w-full mt-1.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer">
                      <Ship className="w-3.5 h-3.5" />
                      Convert to Active Shipment
                    </button>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Globe,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";

interface SettingsViewProps {
  store: FreightStore;
}

export default function SettingsView({ store }: SettingsViewProps) {
  const { settings } = store;

  // Local state for interactive sync
  const [integrations, setIntegrations] = useState(settings.integrations);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setIntegrations((prev: any[]) =>
        prev.map((int: any) =>
          int.id === id
            ? {
                ...int,
                status: "Connected" as const,
                lastSync: new Date()
                  .toISOString()
                  .replace("T", " ")
                  .substring(0, 16),
              }
            : int,
        ),
      );
      setSyncingId(null);
    }, 1500);
  };

  const handleToggleActive = (id: string) => {
    setIntegrations((prev: any[]) =>
      prev.map((int: any) =>
        int.id === id
          ? {
              ...int,
              status: int.status === "Connected" ? "Disconnected" : "Connected",
            }
          : int,
      ),
    );
  };

  return (
    <div className="space-y-6" id="settings-view-root">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
          System Settings
        </h1>
        <p className="text-xs text-slate-500 font-semibold font-mono">
          Company metadata, carrier APIs, and pipeline defaults
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: General Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Details */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-50 pb-2">
              Corporate Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Company Entity Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                  value={settings.companyName}
                  disabled
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Headquarters Address
                </label>
                <input
                  type="text"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                  value={settings.headquarters}
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-700">
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Billing Currency
                </span>
                <span className="block p-2 bg-slate-100 rounded-lg">
                  {settings.defaultCurrency}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Weight Unit
                </span>
                <span className="block p-2 bg-slate-100 rounded-lg">
                  {settings.weightUnit}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Volume Unit
                </span>
                <span className="block p-2 bg-slate-100 rounded-lg">
                  {settings.volumeUnit}
                </span>
              </div>
            </div>
          </div>

          {/* Branches list */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-50 pb-2">
              Global Branches
            </h3>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3.5"
              id="settings-branches">
              {settings.branches.map((branch: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      {branch.name}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-mono font-semibold uppercase">
                      {branch.country} • {branch.timezone}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: API Integrations and Carrier sync */}
        <div className="space-y-6" id="settings-sidebar">
          {/* Integrations */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
              API Connectivity
            </h3>

            <div className="space-y-4" id="integrations-list">
              {integrations.map((int: any) => (
                <div
                  key={int.id}
                  className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        {int.name}
                      </span>
                      <span className="block text-[9px] text-slate-400 uppercase font-semibold">
                        {int.type}
                      </span>
                    </div>

                    {/* Toggle button */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(int.id)}
                      className="text-slate-400 hover:text-slate-800 transition-all cursor-pointer">
                      {int.status === "Connected" ? (
                        <ToggleRight className="w-6 h-6 text-blue-600" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-300" />
                      )}
                    </button>
                  </div>

                  {int.status === "Connected" ? (
                    <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400 font-mono border-t border-slate-200/50 pt-2.5">
                      <span>Last sync: {int.lastSync || "N/A"}</span>
                      <button
                        type="button"
                        disabled={syncingId === int.id}
                        onClick={() => handleSync(int.id)}
                        className="text-blue-600 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50">
                        <RefreshCw
                          className={`w-3 h-3 ${syncingId === int.id ? "animate-spin" : ""}`}
                        />
                        {syncingId === int.id ? "Syncing..." : "Sync Now"}
                      </button>
                    </div>
                  ) : (
                    <span className="block text-[9px] font-bold font-mono text-red-500 uppercase tracking-wider pt-2 border-t border-slate-200/50">
                      offline / disconnected
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline templates */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">
              Milestones Pipeline
            </h3>
            <div className="space-y-1.5 font-mono text-[9px] text-slate-600">
              {settings.milestoneTemplates.map((name: string, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 py-1 border-b border-slate-50 last:border-none">
                  <span className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400 text-[8px]">
                    {idx + 1}
                  </span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

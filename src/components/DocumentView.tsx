/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Search,
  Folder,
  FileText,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { Document, DocumentCategory, DocumentStatus } from "../types";

interface DocumentViewProps {
  store: FreightStore;
}

export default function DocumentView({ store }: DocumentViewProps) {
  const { documents, updateDocumentStatus, currentRole } = store;
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [previewingDoc, setPreviewingDoc] = useState<Document | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || doc.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const categories: DocumentCategory[] = [
    "Shipping",
    "Commercial",
    "Regulatory",
    "Customs",
    "Internal",
  ];

  const getCategoryColor = (cat: DocumentCategory) => {
    switch (cat) {
      case "Shipping":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "Commercial":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "Regulatory":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "Customs":
        return "text-cyan-600 bg-cyan-50 border-cyan-200";
      case "Internal":
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  return (
    <div className="space-y-5" id="documents-view-root">
      {/* Title */}
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
          Dropbox Operations Cabinet
        </h1>
        <p className="text-xs text-slate-500 font-semibold font-mono">
          Centralized digital document archive and compliance approval ledger
        </p>
      </div>

      {/* Grid structure: Left categories folders list / Right files list */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Folder Categories */}
        <div className="space-y-3">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
            Thematic Folders
          </span>
          <div
            className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm space-y-1"
            id="documents-folders">
            <button
              type="button"
              className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
              onClick={() => setActiveCategory("all")}>
              <Folder className="w-4 h-4 shrink-0" />
              <span>All Documents ({documents.length})</span>
            </button>

            {categories.map((cat) => {
              const catCount = documents.filter(
                (d) => d.category === cat,
              ).length;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white shadow-sm"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                  onClick={() => setActiveCategory(cat)}>
                  <div className="flex items-center gap-3 min-w-0">
                    <Folder className="w-4 h-4 shrink-0" />
                    <span className="truncate">{cat}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-full ${activeCategory === cat ? "bg-white/20 text-white" : "bg-slate-150 text-slate-600"}`}>
                    {catCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Files list with filters */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[550px]">
          {/* Top Search */}
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search archive files, uploaded by operators..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Files cabinet rows */}
          <div
            className="flex-1 overflow-y-auto divide-y divide-slate-100"
            id="cabinet-rows">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-all cursor-pointer group"
                onClick={() => setPreviewingDoc(doc)}>
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block font-bold text-slate-950 text-xs truncate group-hover:text-blue-600 group-hover:underline transition-all">
                      {doc.name}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-semibold font-mono">
                      <span
                        className={`px-1.5 py-0.5 border rounded text-[9px] font-bold ${getCategoryColor(doc.category)}`}>
                        {doc.category}
                      </span>
                      <span>Size: {doc.size}</span>
                      <span>•</span>
                      <span>v{doc.version}</span>
                      <span>•</span>
                      <span>Uploaded by {doc.uploadedBy}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs shrink-0">
                  {["Admin", "Manager"].includes(currentRole) ? (
                    <select
                      className={`p-1 rounded text-[10px] font-bold border focus:outline-none cursor-pointer ${
                        doc.status === "Approved"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : doc.status === "Submitted"
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : doc.status === "Rejected"
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                      value={doc.status}
                      onClick={(e) => e.stopPropagation()} // Prevent opening previewer
                      onChange={(e) =>
                        updateDocumentStatus(
                          doc.id,
                          e.target.value as DocumentStatus,
                        )
                      }>
                      <option value="Draft">Draft</option>
                      <option value="Submitted">Submitted</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                        doc.status === "Approved"
                          ? "bg-emerald-50 border-emerald-150 text-emerald-700"
                          : doc.status === "Submitted"
                            ? "bg-blue-50 border-blue-150 text-blue-700"
                            : doc.status === "Rejected"
                              ? "bg-red-50 border-red-150 text-red-700"
                              : "bg-slate-50 border-slate-150 text-slate-600"
                      }`}>
                      {doc.status}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                📁 No records matching folder query.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewingDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          id="cabinet-doc-preview-modal">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl shadow-2xl p-6 relative flex flex-col justify-between max-h-[90vh]">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                  {previewingDoc.category} DOCUMENT VIEW
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {previewingDoc.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingDoc(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer text-xs">
                ✕
              </button>
            </div>

            {/* Document graphic */}
            <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl font-mono text-[9px] text-slate-700 leading-normal space-y-4 overflow-y-auto max-h-[45vh] select-none">
              <div className="flex justify-between border-b border-slate-300 pb-2">
                <span className="font-bold">FREIGHTOS DISPATCH SYSTEM</span>
                <span>ORIGINAL COPY</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block font-bold text-slate-400">
                    CARRIER EXPORTER
                  </span>
                  <p className="font-bold text-slate-900">
                    Zhejiang Manufacturing Corp
                  </p>
                </div>
                <div>
                  <span className="block font-bold text-slate-400">
                    DELIVERY TO
                  </span>
                  <p className="font-bold text-slate-900">
                    PT. Indofood Sukses Makmur
                  </p>
                </div>
              </div>

              <div className="border-t border-b border-slate-300 py-2 my-2 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>BILL OF LADING REF NO</span>
                  <span>{previewingDoc.id.toUpperCase()}-FOS</span>
                </div>
                <div className="flex justify-between">
                  <span>CATEGORY FOLDER</span>
                  <span>{previewingDoc.category} leg doc</span>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-end">
                <div className="text-center w-28 border-t border-slate-400 pt-1 text-[8px] text-slate-400">
                  EXPORTER SEAL
                </div>
                {/* Stamp */}
                <div
                  className={`border-2 border-dashed p-2 transform rotate-[-4deg] font-bold text-[8px] text-center w-28 uppercase ${
                    previewingDoc.status === "Approved"
                      ? "border-emerald-500 text-emerald-500"
                      : "border-blue-500 text-blue-500"
                  }`}>
                  {previewingDoc.status} Leg
                  <span className="block text-[6px]">
                    {previewingDoc.uploadedAt}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4 text-[10px] text-slate-500 font-mono">
              <span>Size: {previewingDoc.size}</span>
              <button
                type="button"
                className="py-1 px-2.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 cursor-pointer font-sans"
                onClick={() => alert(`Downloading ${previewingDoc.name}...`)}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

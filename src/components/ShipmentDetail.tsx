/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Search,
  Trash2,
  CheckSquare,
  MessageSquare,
  Plus,
  Clock,
  File,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import {
  Shipment,
  Milestone,
  Document,
  Task,
  ShipmentStatus,
  DocumentCategory,
  TaskPriority,
  TaskStatus,
} from "../types";

interface ShipmentDetailProps {
  store: FreightStore;
  shipmentId: string;
  onBack: () => void;
}

export default function ShipmentDetail({
  store,
  shipmentId,
  onBack,
}: ShipmentDetailProps) {
  const {
    shipments,
    milestones,
    documents,
    tasks,
    activities,
    currentRole,
    currentUser,
    updateShipment,
    updateMilestone,
    addMilestone,
    addDocument,
    updateDocumentStatus,
    addTask,
    updateTask,
    addLog,
  } = store;

  const shipment = shipments.find((s) => s.id === shipmentId);

  if (!shipment) {
    return (
      <div
        className="bg-white border border-slate-200 p-8 rounded-2xl text-center"
        id="detail-notfound">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <h2 className="text-md font-semibold text-slate-900">
          Shipment Not Found
        </h2>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-slate-150 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200">
          Return to List
        </button>
      </div>
    );
  }

  // Active Tab
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "milestones" | "documents" | "tasks" | "activities"
  >("overview");

  // Modals / Editors State
  const [isEditingShipment, setIsEditingShipment] = useState(false);
  const [editStatus, setEditStatus] = useState<ShipmentStatus>(shipment.status);
  const [editEta, setEditEta] = useState(shipment.eta);
  const [editEtd, setEditEtd] = useState(shipment.etd);

  // Milestone edit target
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(
    null,
  );
  const [milestoneDate, setMilestoneDate] = useState("");
  const [milestoneNotes, setMilestoneNotes] = useState("");
  const [milestoneStatus, setMilestoneStatus] = useState<
    "Pending" | "In Progress" | "Completed"
  >("Pending");

  // New Document Upload Simulator
  const [uploadCategory, setUploadCategory] =
    useState<DocumentCategory>("Shipping");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [mockFileName, setMockFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Document Viewer
  const [previewingDoc, setPreviewingDoc] = useState<Document | null>(null);

  // New Task form
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<TaskPriority>("Medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("2026-07-12");

  // Filter lists specific to this shipment
  const shipMilestones = milestones.filter((m) => m.shipmentId === shipment.id);
  const shipDocuments = documents.filter((d) => d.shipmentId === shipment.id);
  const shipTasks = tasks.filter((t) => t.shipmentId === shipment.id);
  const shipActivities = activities.filter((a) => a.shipmentId === shipment.id);

  // Save basic shipment updates
  const handleSaveShipmentEdit = () => {
    updateShipment({
      ...shipment,
      status: editStatus,
      etd: editEtd,
      eta: editEta,
    });
    setIsEditingShipment(false);
  };

  // Milestone Edit Save
  const handleSaveMilestoneEdit = (mil: Milestone) => {
    updateMilestone({
      ...mil,
      status: milestoneStatus,
      date: milestoneDate,
      notes: milestoneNotes,
    });
    setEditingMilestoneId(null);
  };

  const startEditMilestone = (mil: Milestone) => {
    setEditingMilestoneId(mil.id);
    setMilestoneDate(mil.date || new Date().toISOString().substring(0, 10));
    setMilestoneNotes(mil.notes || "");
    setMilestoneStatus(mil.status);
  };

  // Document Upload Simulator
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMockFileName(file.name);
      simulateDocumentUpload(file.name);
    }
  };

  const simulateDocumentUpload = (fileName: string) => {
    const categories: DocumentCategory[] = [
      "Shipping",
      "Commercial",
      "Regulatory",
      "Customs",
      "Internal",
    ];
    addDocument({
      shipmentId: shipment.id,
      name: fileName,
      category: uploadCategory,
      status: "Submitted",
      size: (1 + Math.random() * 3).toFixed(1) + " MB",
    });
    setMockFileName("");
  };

  const handleNewTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      shipmentId: shipment.id,
      shipmentRef: shipment.referenceNumber,
      title: newTaskTitle,
      priority: newTaskPriority,
      status: "Todo",
      dueDate: newTaskDueDate,
      pic: currentUser?.name || "Raka Ardiansyah",
      checklist: [],
      labels: ["Operational"],
    });

    setNewTaskTitle("");
  };

  const getStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case "Booking Confirmed":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "In Transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "At Customs":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Out for Delivery":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Completed":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "Delayed":
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className="space-y-6" id="shipment-detail-root">
      {/* Header Back & Action Row */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5"
        id="detail-header-row">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 hover:bg-slate-150 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
            id="back-button">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-slate-400 bg-slate-100 py-0.5 px-2 rounded">
                SHIPMENT DOSSIER
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(shipment.status)}`}>
                {shipment.status}
              </span>
            </div>
            <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight mt-1">
              Reference {shipment.referenceNumber}
            </h1>
          </div>
        </div>

        {/* Quick Edit Basic Information (Admin/Operations) */}
        {["Admin", "Operations", "Manager"].includes(currentRole) && (
          <div>
            {isEditingShipment ? (
              <div
                className="flex items-center gap-2"
                id="shipment-edit-actions">
                <button
                  type="button"
                  onClick={handleSaveShipmentEdit}
                  className="py-1.5 px-3 bg-slate-900 text-white hover:bg-slate-800 font-semibold rounded-xl text-xs transition-all cursor-pointer">
                  Save Dossier
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingShipment(false)}
                  className="py-1.5 px-3 bg-slate-100 text-slate-600 hover:bg-slate-200 font-semibold rounded-xl text-xs transition-all cursor-pointer">
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingShipment(true)}
                className="py-1.5 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl flex items-center gap-2 text-xs shadow-sm transition-all cursor-pointer"
                id="edit-shipment-trigger">
                <Edit2 className="w-3.5 h-3.5" />
                Change Status / Dates
              </button>
            )}
          </div>
        )}
      </div>

      {/* Editor Drawer (Inline Mode) */}
      {isEditingShipment && (
        <div
          className="bg-slate-50 border border-slate-200 p-5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4"
          id="inline-shipment-editor">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Clearance Status
            </label>
            <select
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as ShipmentStatus)}>
              <option value="Booking Confirmed">Booking Confirmed</option>
              <option value="In Transit">In Transit</option>
              <option value="At Customs">At Customs</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Departure (ETD)
            </label>
            <input
              type="date"
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              value={editEtd}
              onChange={(e) => setEditEtd(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Arrival (ETA)
            </label>
            <input
              type="date"
              className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              value={editEta}
              onChange={(e) => setEditEta(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Detail Modules Sub-Navigation */}
      <div
        className="border-b border-slate-100 flex gap-4 overflow-x-auto pb-1"
        id="detail-tab-menu">
        {[
          { id: "overview", name: "Overview" },
          { id: "milestones", name: `Milestones (${shipMilestones.length})` },
          { id: "documents", name: `Documents (${shipDocuments.length})` },
          {
            id: "tasks",
            name: `Tasks Queue (${shipTasks.filter((t) => t.status !== "Done").length})`,
          },
          { id: "activities", name: "Audit Log" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`py-2 px-1 text-xs font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSubTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
            onClick={() => setActiveSubTab(tab.id as any)}>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Main tab body */}
      <div id="detail-tab-body">
        {/* TAB 1: OVERVIEW */}
        {activeSubTab === "overview" && (
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            id="overview-tab-content">
            {/* Shipment details listing */}
            <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl space-y-5">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-50 pb-2">
                Vessel Information
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs text-slate-700">
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Importer / Consignee
                  </span>
                  <span className="font-semibold text-slate-900">
                    {shipment.consignee}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Exporter / Shipper
                  </span>
                  <span className="font-semibold text-slate-900">
                    {shipment.shipper}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Origin Port
                  </span>
                  <span className="font-semibold text-slate-900">
                    {shipment.origin}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Destination Delivery
                  </span>
                  <span className="font-semibold text-slate-900">
                    {shipment.destination}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Sea Carrier (Shipping Line)
                  </span>
                  <span className="font-semibold text-slate-900">
                    {shipment.shippingLine}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Container Specification
                  </span>
                  <span className="font-semibold text-slate-900">
                    {shipment.containerCount}x {shipment.containerType}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Estimated Departure (ETD)
                  </span>
                  <span className="font-semibold text-slate-900 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {shipment.etd}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Estimated Arrival (ETA)
                  </span>
                  <span className="font-semibold text-slate-900 font-mono flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {shipment.eta}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Commodity Item Description
                  </span>
                  <span className="font-semibold text-slate-800">
                    {shipment.commodity}
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-6">
              {/* Progress Summary Widget */}
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Milestone Progress
                </h4>

                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold font-display text-slate-950 font-mono">
                    {shipment.progress}%
                  </span>
                  <span className="text-xs text-slate-500 font-semibold font-mono">
                    {
                      shipMilestones.filter((m) => m.status === "Completed")
                        .length
                    }{" "}
                    of {shipMilestones.length} Completed
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-5">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${shipment.progress}%` }}></div>
                </div>

                <div className="space-y-3.5 border-t border-slate-50 pt-4 text-xs font-semibold text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Containers</span>
                    <span className="text-slate-900 font-mono">
                      {shipment.containerCount} Box(es)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Demurrage Free Time</span>
                    <span className="text-slate-900 font-mono">
                      {shipment.freeTime} Days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Overtime Surcharge</span>
                    <span className="text-slate-900 font-mono">
                      ${shipment.demurrage}/Day
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick PIC block */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-800 font-semibold flex items-center justify-center rounded-full text-sm">
                  {shipment.pic
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Account Operator (PIC)
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {shipment.pic}
                  </span>
                  <span className="block text-[9px] text-slate-400">
                    Operations Specialist
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MILESTONES (VERTICAL TIMELINE) */}
        {activeSubTab === "milestones" && (
          <div
            className="bg-white border border-slate-200 p-5 rounded-2xl space-y-6"
            id="milestones-tab-content">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Customs & Logistics Pipeline
                </h3>
                <span className="text-xs text-slate-400 font-semibold font-mono">
                  Standard milestone pipeline configuration
                </span>
              </div>

              {["Admin", "Operations", "Manager"].includes(currentRole) && (
                <button
                  type="button"
                  onClick={() => {
                    const name = prompt("Enter custom milestone name:");
                    if (name) {
                      addMilestone({
                        shipmentId: shipment.id,
                        name,
                        date: new Date().toISOString().substring(0, 10),
                        pic: currentUser?.name || "Raka Ardiansyah",
                        status: "Pending",
                      });
                    }
                  }}
                  className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                  Add Custom Milestone
                </button>
              )}
            </div>

            {/* Timeline element */}
            <div
              className="space-y-6 relative pl-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-150"
              id="milestone-timeline">
              {shipMilestones.map((mil, idx) => {
                const isEditing = editingMilestoneId === mil.id;

                return (
                  <div
                    key={mil.id}
                    className="relative"
                    id={`milestone-row-${idx}`}>
                    {/* Circle Node */}
                    <span
                      className={`absolute left-[-23px] top-1.5 w-4 h-4 rounded-full border-[3px] bg-white transition-all ${
                        mil.status === "Completed"
                          ? "border-emerald-500 bg-emerald-500"
                          : mil.status === "In Progress"
                            ? "border-blue-600 bg-blue-50"
                            : "border-slate-300"
                      }`}></span>

                    <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4">
                      {/* Left: Info */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-semibold text-slate-950">
                            {mil.name}
                          </h4>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                              mil.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                                : mil.status === "In Progress"
                                  ? "bg-blue-50 text-blue-700 border border-blue-150 animate-pulse"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}>
                            {mil.status}
                          </span>
                          {mil.attachmentName && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] text-slate-600 font-mono">
                              <File className="w-3 h-3 text-slate-400" />
                              {mil.attachmentName}
                            </span>
                          )}
                        </div>
                        {mil.notes && (
                          <p className="text-xs text-slate-500 leading-normal font-medium">
                            {mil.notes}
                          </p>
                        )}
                        {mil.date && (
                          <span className="block text-[10px] text-slate-400 font-semibold font-mono">
                            Logged on {mil.date} by {mil.pic}
                          </span>
                        )}
                      </div>

                      {/* Right: Actions or Editor */}
                      <div className="flex items-start shrink-0">
                        {["Admin", "Operations", "Manager"].includes(
                          currentRole,
                        ) &&
                          (isEditing ? (
                            <div
                              className="space-y-3 w-full md:w-56 bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
                              id={`milestone-editor-${mil.id}`}>
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                  Status
                                </label>
                                <select
                                  className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                                  value={milestoneStatus}
                                  onChange={(e) =>
                                    setMilestoneStatus(e.target.value as any)
                                  }>
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">
                                    In Progress
                                  </option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                  Log Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold"
                                  value={milestoneDate}
                                  onChange={(e) =>
                                    setMilestoneDate(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                  Operational Notes
                                </label>
                                <textarea
                                  className="w-full p-1 bg-slate-50 border border-slate-200 rounded text-xs"
                                  rows={2}
                                  value={milestoneNotes}
                                  placeholder="HS clearance approved..."
                                  onChange={(e) =>
                                    setMilestoneNotes(e.target.value)
                                  }
                                />
                              </div>
                              <div className="flex justify-end gap-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveMilestoneEdit(mil)}
                                  className="px-2 py-1 bg-blue-600 text-white font-bold rounded text-[10px] hover:bg-blue-700 cursor-pointer">
                                  Update
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingMilestoneId(null)}
                                  className="px-2 py-1 bg-slate-100 text-slate-500 font-semibold rounded text-[10px] hover:bg-slate-200 cursor-pointer">
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEditMilestone(mil)}
                              className="py-1 px-2 border border-slate-200 hover:bg-white text-slate-600 rounded-lg text-[10px] font-semibold transition-all cursor-pointer">
                              Dispatch Milestone
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS (DROPBOX-LIKE INTERACTION) */}
        {activeSubTab === "documents" && (
          <div className="space-y-6" id="documents-tab-content">
            {/* Split layout: Upload box + listing */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Upload box (Admin/Operations) */}
              {["Admin", "Operations", "Manager"].includes(currentRole) && (
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Upload Operations Files
                  </h3>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Document Categorization
                    </label>
                    <select
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
                      value={uploadCategory}
                      onChange={(e) =>
                        setUploadCategory(e.target.value as DocumentCategory)
                      }>
                      <option value="Shipping">Shipping (BL, SI, Telex)</option>
                      <option value="Commercial">
                        Commercial (Invoice, PKList)
                      </option>
                      <option value="Regulatory">
                        Regulatory (COO, Quarantine)
                      </option>
                      <option value="Customs">
                        Customs (PIB, SPPB Clearance)
                      </option>
                      <option value="Internal">
                        Internal (Billing, Spot Pricing)
                      </option>
                    </select>
                  </div>

                  {/* Drag drop area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      dragActive
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}>
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-800">
                      Drag & drop files here
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">
                      PDF, PNG, JPG (Max 10MB)
                    </p>

                    <div className="relative mt-3">
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            simulateDocumentUpload(e.target.files[0].name);
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="py-1 px-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg text-[10px] hover:bg-slate-50 transition-all cursor-pointer">
                        Select File
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Right Column: Dropbox List */}
              <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Document Cabinet
                  </h3>
                  <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
                    Double check approval states
                  </span>
                </div>

                <div className="space-y-2" id="document-cabinet-rows">
                  {shipDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 border border-slate-150 hover:border-slate-300 rounded-xl hover:bg-slate-50/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                      onClick={() => setPreviewingDoc(doc)}>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-600 group-hover:underline transition-all">
                            {doc.name}
                          </span>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold font-mono">
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 uppercase">
                              {doc.category}
                            </span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>v{doc.version}</span>
                            <span>•</span>
                            <span>Uploaded by {doc.uploadedBy}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Status update selector (Manager/Admin restricted) */}
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
                            onClick={(e) => e.stopPropagation()} // Prevent opening viewer
                            onChange={(e) =>
                              updateDocumentStatus(
                                doc.id,
                                e.target.value as any,
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

                  {shipDocuments.length === 0 && (
                    <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                      📁 No documents uploaded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TASKS (LINEAR-LIKE) */}
        {activeSubTab === "tasks" && (
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            id="tasks-tab-content">
            {/* Create Task Form */}
            {["Admin", "Operations", "Manager"].includes(currentRole) && (
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4 h-fit">
                <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-50 pb-2">
                  Assign Dossier Task
                </h3>
                <form
                  onSubmit={handleNewTaskSubmit}
                  className="space-y-4"
                  id="detail-task-form">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Draft HS justification cover sheet..."
                      className="w-full p-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Priority
                    </label>
                    <select
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
                      value={newTaskPriority}
                      onChange={(e) =>
                        setNewTaskPriority(e.target.value as TaskPriority)
                      }>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs transition-all cursor-pointer">
                    Assign Task
                  </button>
                </form>
              </div>
            )}

            {/* Task Lists */}
            <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-50 pb-2">
                Leg Checklist
              </h3>

              <div className="space-y-3" id="detail-task-list">
                {shipTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex items-start gap-3 hover:border-slate-300 transition-all">
                    <input
                      type="checkbox"
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer text-xs"
                      checked={task.status === "Done"}
                      onChange={() => {
                        const updated = {
                          ...task,
                          status: (task.status === "Done"
                            ? "Todo"
                            : "Done") as TaskStatus,
                        };
                        updateTask(updated);
                        addLog(
                          shipment.id,
                          `Task marked ${updated.status}: "${task.title}"`,
                        );
                      }}
                    />
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <span
                        className={`block text-xs font-semibold leading-normal ${task.status === "Done" ? "line-through text-slate-400" : "text-slate-900"}`}>
                        {task.title}
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-semibold font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                            task.priority === "Urgent"
                              ? "bg-red-50 text-red-700 border border-red-150"
                              : task.priority === "High"
                                ? "bg-amber-50 text-amber-700 border border-amber-150"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}>
                          {task.priority} Priority
                        </span>
                        <span>PIC: {task.pic}</span>
                        <span>•</span>
                        <span>Due {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {shipTasks.length === 0 && (
                  <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                    ✅ No specific operational duties logged. Add a task above.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT LOG (ACTIVITIES) */}
        {activeSubTab === "activities" && (
          <div
            className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4"
            id="activities-tab-content">
            <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-50 pb-2">
              Dossier Audit Trail
            </h3>

            <div
              className="space-y-4 pr-1 max-h-[400px] overflow-y-auto"
              id="audit-log-rows">
              {shipActivities.map((act) => (
                <div key={act.id} className="flex gap-3 text-xs leading-normal">
                  <div className="p-1 bg-slate-100 text-slate-500 rounded h-fit mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium">{act.text}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold font-mono">
                      <span>Operator: {act.user}</span>
                      <span>•</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}

              {shipActivities.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-semibold text-xs">
                  📜 No activities logged for this dossier.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL */}
      {previewingDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          id="doc-viewer-modal">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl shadow-2xl p-6 relative flex flex-col justify-between max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">
                  {previewingDoc.category} DOCUMENT PREVIEW
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {previewingDoc.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingDoc(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            {/* Simulated Scanned Doc View */}
            <div
              className="bg-slate-50 border border-slate-200 p-6 rounded-xl font-mono text-[9px] text-slate-700 leading-normal space-y-4 overflow-y-auto max-h-[50vh] select-none"
              id="doc-scanned-canvas">
              <div className="flex justify-between border-b border-slate-300 pb-2">
                <span className="font-bold">FREIGHTOS DISPATCH SYSTEM</span>
                <span>ORIGINAL COPY</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block font-bold text-slate-400">
                    SHIPPER EXPORTER
                  </span>
                  <p className="font-bold text-slate-900">{shipment.shipper}</p>
                  <p>ZHEJIANG SECTOR 4 INDUSTRIAL HUB</p>
                </div>
                <div>
                  <span className="block font-bold text-slate-400">
                    CONSIGNEE IMPORTER
                  </span>
                  <p className="font-bold text-slate-900">
                    {shipment.consignee}
                  </p>
                  <p>{shipment.destination}</p>
                </div>
              </div>

              <div className="border-t border-b border-slate-300 py-2 my-2 space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>BILL OF LADING REF NO</span>
                  <span>{shipment.referenceNumber}-A</span>
                </div>
                <div className="flex justify-between">
                  <span>VESSEL VOYAGE</span>
                  <span>MAERSK METZ / 264A</span>
                </div>
                <div className="flex justify-between">
                  <span>CONTAINERS LOGGED</span>
                  <span>
                    {shipment.containerCount} x {shipment.containerType}
                  </span>
                </div>
              </div>

              <div>
                <span className="block font-bold text-slate-400">
                  LINE COMMODITY ITEM DECLARED
                </span>
                <p className="text-slate-900 font-bold">{shipment.commodity}</p>
              </div>

              <div className="pt-8 flex justify-between items-end">
                <div className="text-center w-28 border-t border-slate-400 pt-1 text-[8px] text-slate-400">
                  SHIPPER SIGNATURE
                </div>
                {/* Simulated Authorized Carrier Stamp */}
                <div className="border-2 border-dashed border-emerald-500 text-emerald-500 p-2 transform rotate-[-6deg] font-bold text-[8px] text-center w-28 uppercase">
                  FreightOS approved
                  <span className="block text-[6px]">2026-07-08</span>
                </div>
              </div>
            </div>

            {/* Footer with metadata */}
            <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-4 text-[10px] text-slate-500 font-mono">
              <span>Size: {previewingDoc.size}</span>
              <span>•</span>
              <span>
                Clearance status:{" "}
                <strong className="text-slate-800">
                  {previewingDoc.status}
                </strong>
              </span>
              <span>•</span>
              <button
                type="button"
                className="py-1 px-2.5 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 cursor-pointer font-sans"
                onClick={() => {
                  alert(`Downloading ${previewingDoc.name}...`);
                }}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

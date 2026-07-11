/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from "react";
import {
  Home,
  Ship,
  CheckSquare,
  FileText,
  Menu,
  Wifi,
  Battery,
  Camera,
  Search,
  RefreshCw,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { TaskStatus } from "../types";

interface MobileSimulatorProps {
  store: FreightStore;
}

export default function MobileSimulator({ store }: MobileSimulatorProps) {
  const {
    shipments,
    tasks,
    documents,
    milestones,
    updateTask,
    updateMilestone,
    addDocument,
    addLog,
    currentUser,
    currentRole,
  } = store;

  const [mobileTab, setMobileTab] = useState<
    "home" | "shipments" | "tasks" | "documents" | "more"
  >("home");
  const [selectedMobileShipId, setSelectedMobileShipId] = useState<
    string | null
  >(null);

  // Simulated Camera Upload Modal
  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [pullRefreshActive, setPullRefreshActive] = useState(false);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Camera handling
  const startCamera = async () => {
    setCameraOpen(true);
    setCapturedPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.log(
        "No native camera access, using high fidelity mock viewfinder.",
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    // Generate high fidelity simulated document image
    setCapturedPhoto(
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=400&h=300&q=80",
    );
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSavePhoto = () => {
    if (selectedMobileShipId) {
      addDocument({
        shipmentId: selectedMobileShipId,
        name: `Mobile_Receipt_Snap_${Math.floor(100 + Math.random() * 900)}.jpg`,
        category: "Shipping",
        status: "Submitted",
        size: "1.4 MB",
      });
      addLog(selectedMobileShipId, `Uploaded mobile snap photo from dock.`);
    }
    setCameraOpen(false);
    setCapturedPhoto(null);
  };

  // Mock Pull to refresh
  const triggerRefresh = () => {
    setPullRefreshActive(true);
    setTimeout(() => {
      setPullRefreshActive(false);
    }, 1200);
  };

  const activeShipments = shipments.filter((s) => s.status !== "Completed");
  const pendingTasks = tasks.filter((t) => t.status !== "Done");

  const selectedShipment = shipments.find((s) => s.id === selectedMobileShipId);
  const shipMilestones = selectedMobileShipId
    ? milestones.filter((m) => m.shipmentId === selectedMobileShipId)
    : [];

  return (
    <div
      className="flex flex-col items-center justify-center py-6 bg-slate-100"
      id="mobile-simulator-shell">
      {/* Simulation Toggle & Description */}
      <div className="text-center max-w-sm mb-6 px-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Mobile Client Preview
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Simulated dock-hand smartphone client. Tap status badges or complete
          milestones directly below to sync with the desktop system.
        </p>
        <div className="flex justify-center gap-3 mt-3.5 text-[10px] font-bold">
          <label className="flex items-center gap-1.5 cursor-pointer bg-white border border-slate-200 py-1 px-2.5 rounded-full shadow-sm text-slate-600">
            <input
              type="checkbox"
              checked={offlineMode}
              onChange={(e) => setOfflineMode(e.target.checked)}
              className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 text-xs w-3.5 h-3.5"
            />
            Offline Caching {offlineMode ? "ON" : "OFF"}
          </label>
        </div>
      </div>

      {/* SMARTPHONE FRAME (iPhone shape) */}
      <div
        className="w-[310px] h-[640px] bg-slate-950 rounded-[44px] p-3 border-[6px] border-slate-800 shadow-2xl relative flex flex-col overflow-hidden"
        id="phone-container">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-b-xl z-50 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
          <span className="w-8 h-1 rounded-full bg-slate-800"></span>
        </div>

        {/* Smartphone Display screen */}
        <div
          className="flex-1 bg-slate-50 rounded-[34px] overflow-hidden flex flex-col relative"
          id="phone-screen">
          {/* Status Bar */}
          <div className="bg-slate-900 text-white px-5 pt-1.5 pb-1 flex justify-between items-center text-[9px] font-bold z-40 select-none">
            <span>18:26</span>
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-white" />
              <span className="text-[7px] font-mono leading-none">5G</span>
              <Battery className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Offline State Bar banner */}
          {offlineMode && (
            <div className="bg-emerald-500 text-white text-[9px] font-bold text-center py-1 flex items-center justify-center gap-1.5 animate-pulse shrink-0">
              <span>✓ Offline Cache Sync Enabled (Dock Mode)</span>
            </div>
          )}

          {/* MAIN SCREEN MODULE CONTAINER */}
          <div
            className="flex-1 overflow-y-auto relative pb-16 flex flex-col"
            id="phone-viewport">
            {/* PULL TO REFRESH ACTION INDICATOR */}
            <div className="text-center pt-2 pb-1 bg-slate-100 flex items-center justify-center gap-2">
              <button
                onClick={triggerRefresh}
                className="text-[9px] font-bold text-slate-500 flex items-center gap-1">
                <RefreshCw
                  className={`w-3 h-3 ${pullRefreshActive ? "animate-spin" : ""}`}
                />
                {pullRefreshActive ? "Refreshing..." : "Pull to Sync"}
              </button>
            </div>

            {/* SCREEN A: HOME MODULE */}
            {mobileTab === "home" && (
              <div className="p-4 space-y-4 flex-1">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[8px] font-bold text-blue-600 tracking-wider block">
                      CGK DOCK HANDS
                    </span>
                    <h3 className="text-sm font-bold text-slate-950 font-display">
                      Hello, {currentUser?.name.split(" ")[0]}
                    </h3>
                  </div>
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800 uppercase">
                    {currentUser?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>

                {/* KPI block widgets */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white p-3 border border-slate-150 rounded-2xl shadow-sm">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase">
                      Transit Leg
                    </span>
                    <span className="text-lg font-bold font-display text-blue-600 block">
                      {activeShipments.length}
                    </span>
                    <span className="text-[7px] text-slate-400 font-medium font-mono">
                      Uncompleted
                    </span>
                  </div>
                  <div className="bg-white p-3 border border-slate-150 rounded-2xl shadow-sm">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase">
                      Task Queue
                    </span>
                    <span className="text-lg font-bold font-display text-amber-500 block">
                      {pendingTasks.length}
                    </span>
                    <span className="text-[7px] text-slate-400 font-medium font-mono">
                      Pending today
                    </span>
                  </div>
                </div>

                {/* Quick List active cargos */}
                <div className="space-y-2">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                    DOCK TRACKING
                  </span>
                  <div className="space-y-2">
                    {activeShipments.slice(0, 3).map((shp) => (
                      <div
                        key={shp.id}
                        onClick={() => {
                          setSelectedMobileShipId(shp.id);
                          setMobileTab("shipments");
                        }}
                        className="p-3 bg-white border border-slate-150 hover:border-slate-300 rounded-xl flex justify-between items-center text-xs cursor-pointer">
                        <div>
                          <span className="block font-bold text-slate-950 font-mono text-[11px]">
                            {shp.referenceNumber}
                          </span>
                          <span className="block text-[9px] text-slate-400 max-w-[140px] truncate">
                            {shp.consignee}
                          </span>
                        </div>
                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[8px] rounded uppercase">
                          {shp.status.split(" ")[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SCREEN B: SHIPMENTS VIEW OR DETAILS */}
            {mobileTab === "shipments" &&
              (selectedMobileShipId && selectedShipment ? (
                /* Mobile Shipment Detail View */
                <div className="p-4 space-y-4 flex-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMobileShipId(null)}
                    className="text-[10px] font-semibold text-blue-600 flex items-center gap-1 mb-2">
                    ← Back to List
                  </button>

                  <div className="space-y-1">
                    <span className="text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-200 py-0.5 px-2 rounded uppercase font-mono">
                      {selectedShipment.status}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 font-mono mt-1">
                      {selectedShipment.referenceNumber}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      {selectedShipment.consignee}
                    </p>
                  </div>

                  {/* Camera Snap upload quick button */}
                  <button
                    type="button"
                    onClick={startCamera}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 shadow">
                    <Camera className="w-3.5 h-3.5" />
                    Snap Dock Receipt & Sync
                  </button>

                  {/* Milestones timeline for mobile dock ticks */}
                  <div className="space-y-3">
                    <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                      MILESTONES TICKLIST
                    </span>
                    <div className="space-y-2 relative pl-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
                      {shipMilestones.map((mil) => (
                        <div
                          key={mil.id}
                          className="relative flex justify-between items-center text-xs">
                          {/* Point */}
                          <span
                            className={`absolute left-[-16.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white ${
                              mil.status === "Completed"
                                ? "border-emerald-500 bg-emerald-500"
                                : mil.status === "In Progress"
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-slate-300"
                            }`}></span>

                          <div>
                            <span className="block font-bold text-slate-800 text-[11px] leading-none">
                              {mil.name}
                            </span>
                            <span className="block text-[8px] text-slate-400 font-semibold font-mono mt-0.5">
                              Status: {mil.status}
                            </span>
                          </div>

                          {/* Quick Toggle Done for Dock worker convenience! */}
                          <button
                            type="button"
                            className={`p-1 border rounded text-[8px] font-bold uppercase shrink-0 ${
                              mil.status === "Completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-150"
                                : "bg-slate-50 text-slate-500"
                            }`}
                            onClick={() => {
                              const nextState =
                                mil.status === "Completed"
                                  ? "Pending"
                                  : "Completed";
                              updateMilestone({
                                ...mil,
                                status: nextState,
                                date: new Date().toISOString().substring(0, 10),
                                notes:
                                  nextState === "Completed"
                                    ? "Checked off via dock mobile client"
                                    : "",
                              });
                            }}>
                            TICK
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Mobile Shipment List */
                <div className="p-4 space-y-4 flex-1">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search cargo, customer ID..."
                      className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-semibold"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2.5">
                    {shipments
                      .filter((s) => s.referenceNumber.includes(searchQuery))
                      .map((shp) => (
                        <div
                          key={shp.id}
                          onClick={() => setSelectedMobileShipId(shp.id)}
                          className="p-3 bg-white border border-slate-150 rounded-xl hover:border-slate-300 transition-all flex flex-col gap-2 cursor-pointer">
                          <div className="flex justify-between items-start">
                            <span className="font-mono font-bold text-slate-900 text-xs leading-none">
                              {shp.referenceNumber}
                            </span>
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                                shp.status === "Completed"
                                  ? "bg-slate-50 text-slate-600"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}>
                              {shp.status.split(" ")[0]}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-slate-800 leading-normal truncate">
                            {shp.consignee}
                          </p>

                          <div className="flex justify-between items-center text-[8px] font-semibold font-mono text-slate-400 border-t border-slate-50 pt-2">
                            <span>Route: {shp.destination.split(",")[0]}</span>
                            <span>ETA: {shp.eta}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}

            {/* SCREEN C: TASKS MODULE */}
            {mobileTab === "tasks" && (
              <div className="p-4 space-y-4 flex-1">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  DOCK WORKER CHECKS
                </span>
                <div className="space-y-2.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-white border border-slate-150 rounded-xl flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300"
                        checked={task.status === "Done"}
                        onChange={() => {
                          const updated = {
                            ...task,
                            status: (task.status === "Done"
                              ? "Todo"
                              : "Done") as TaskStatus,
                          };
                          updateTask(updated);
                        }}
                      />
                      <div className="min-w-0">
                        <span
                          className={`block text-[11px] font-bold leading-normal ${task.status === "Done" ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {task.title}
                        </span>
                        <span className="block text-[8px] font-bold font-mono text-slate-400 uppercase mt-1">
                          Ref: {task.shipmentRef}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN D: DOCUMENTS MODULE */}
            {mobileTab === "documents" && (
              <div className="p-4 space-y-4 flex-1">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                  MOBILE FILES VIEWER
                </span>
                <div className="space-y-2">
                  {documents.slice(0, 6).map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() =>
                        alert(`Showing mobile viewer for ${doc.name}...`)
                      }
                      className="p-3 bg-white border border-slate-150 rounded-xl flex items-center justify-between text-xs cursor-pointer hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <div>
                          <span className="block font-bold text-slate-800 text-[11px] truncate max-w-[150px]">
                            {doc.name}
                          </span>
                          <span className="block text-[8px] font-mono text-slate-400 font-semibold uppercase">
                            {doc.category} • {doc.size}
                          </span>
                        </div>
                      </div>
                      <span className="text-[8px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase">
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN E: PROFILE / MORE MODULE */}
            {mobileTab === "more" && (
              <div className="p-4 space-y-4 flex-1">
                <div className="bg-white p-4 border border-slate-150 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center text-sm uppercase">
                    {currentUser?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {currentUser?.name}
                    </h4>
                    <span className="block text-[8px] text-slate-400 uppercase font-semibold font-mono">
                      Role: {currentRole}
                    </span>
                  </div>
                </div>

                {/* Mobile specific shortcuts */}
                <div className="space-y-1.5 font-semibold text-xs text-slate-700 bg-white p-3 border border-slate-150 rounded-xl shadow-sm">
                  <div className="flex justify-between py-2 border-b border-slate-50">
                    <span>Active Port Terminal</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      Tanjung Priok CGK
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>API Carrier Stream</span>
                    <span className="text-emerald-500 font-bold font-mono text-[9px]">
                      ONLINE
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIMULATED BOTTOM TAB NAVIGATION BAR */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 py-1.5 px-3 flex justify-between items-center z-40"
            id="phone-nav-bar">
            {[
              { id: "home", label: "Home", icon: Home },
              { id: "shipments", label: "Cargos", icon: Ship },
              { id: "tasks", label: "Tasks", icon: CheckSquare },
              { id: "documents", label: "Files", icon: FileText },
              { id: "more", label: "More", icon: Menu },
            ].map((nav) => {
              const IconComp = nav.icon;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => {
                    setMobileTab(nav.id as any);
                    setSelectedMobileShipId(null);
                  }}
                  className={`flex flex-col items-center flex-1 cursor-pointer select-none transition-all ${
                    mobileTab === nav.id
                      ? "text-blue-600 font-bold"
                      : "text-slate-400 hover:text-slate-600"
                  }`}>
                  <IconComp className="w-4.5 h-4.5" />
                  <span className="text-[8px] mt-1 uppercase font-semibold tracking-wider">
                    {nav.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Home Button Pill */}
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-28 h-1 bg-slate-800 rounded-full"></div>
      </div>

      {/* CAMERA VIEWER MODAL CONTAINER */}
      {cameraOpen && (
        <div
          className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col justify-between p-6"
          id="mobile-camera-screen">
          <div className="flex justify-between items-center text-white">
            <span className="text-xs font-mono font-bold tracking-wider">
              CAMERA DOCK RECEIPT SCAN
            </span>
            <button
              type="button"
              onClick={stopCamera}
              className="text-xs font-bold text-slate-300 hover:text-white">
              Cancel
            </button>
          </div>

          {/* Viewfinder Canvas */}
          <div className="w-full max-w-sm h-80 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative mx-auto my-4 flex items-center justify-center">
            {capturedPhoto ? (
              <img
                src={capturedPhoto}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute border-2 border-dashed border-white/50 w-56 h-40 rounded-lg pointer-events-none flex items-center justify-center">
                  <span className="text-white/40 text-[9px] uppercase tracking-widest font-bold">
                    Align commercial invoice
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-center items-center gap-6 pb-6">
            {capturedPhoto ? (
              <button
                type="button"
                onClick={handleSavePhoto}
                className="py-2.5 px-6 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700">
                Sync with Dossier Folder
              </button>
            ) : (
              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full border-4 border-slate-300 flex items-center justify-center active:scale-95">
                <div className="w-12 h-12 bg-white rounded-full border-2 border-slate-950"></div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

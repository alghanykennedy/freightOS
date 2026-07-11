import { useState } from "react";
import { useFreightStore } from "./data/useFreightStore";
import {
  LayoutDashboard,
  Ship,
  DollarSign,
  Building2,
  Truck,
  BarChart3,
  CheckSquare,
  FolderOpen,
  Settings,
  LogOut,
  Bell,
  Smartphone,
  Laptop,
  Menu,
  X,
  UserCheck,
} from "lucide-react";

// Sub-views
import LoginExperience from "./components/LoginExperience";
import DashboardView from "./components/DashboardView";
import ShipmentView from "./components/ShipmentView";
import ShipmentDetail from "./components/ShipmentDetail";
import QuotationView from "./components/QuotationView";
import ClientView from "./components/ClientView";
import VendorView from "./components/VendorView";
import ReportView from "./components/ReportView";
import TaskView from "./components/TaskView";
import DocumentView from "./components/DocumentView";
import SettingsView from "./components/SettingsView";
import MobileSimulator from "./components/MobileSimulator";
import { UserRole } from "./types";

export default function App() {
  const store = useFreightStore();
  const {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    currentUser,
    logout,
    currentRole,
    setCurrentRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    selectedShipmentId,
    setSelectedShipmentId,
  } = store;

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // If not logged in, render original split-pane login
  if (!currentUser) {
    return <LoginExperience onLogin={store.login} />;
  }

  // Sidebar navigation options
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Shipments", icon: Ship },
    { label: "Quotations", icon: DollarSign },
    { label: "Clients CRM", icon: Building2 },
    { label: "Carrier Rates", icon: Truck },
    { label: "Task Queue", icon: CheckSquare },
    { label: "Documents Cabinet", icon: FolderOpen },
    { label: "Analytics Reports", icon: BarChart3 },
    { label: "System Settings", icon: Settings },
  ];

  // Helper for rendering correct tab contents
  const renderDesktopView = () => {
    // If a shipment drill-down is selected, bypass main tab to render ShipmentDetail
    if (selectedShipmentId) {
      return (
        <ShipmentDetail
          store={store}
          shipmentId={selectedShipmentId}
          onBack={() => setSelectedShipmentId(null)}
        />
      );
    }

    switch (activeTab) {
      case "Dashboard":
        return (
          <DashboardView
            store={store}
            onNavigateShipment={(id) => {
              setSelectedShipmentId(id);
              setActiveTab("Shipments");
            }}
            onOpenCreateShipmentModal={() => {
              setActiveTab("Shipments");
            }}
            onOpenCreateQuotationModal={() => {
              setActiveTab("Quotations");
            }}
            onOpenUploadDocumentModal={() => {
              setActiveTab("Documents Cabinet");
            }}
          />
        );
      case "Shipments":
        return (
          <ShipmentView
            store={store}
            onSelectShipment={(id) => {
              setSelectedShipmentId(id);
            }}
            onOpenCreateModal={() => {
              // Intentionally left as empty callback or handled locally in subcomponent
            }}
          />
        );
      case "Quotations":
        return <QuotationView store={store} />;
      case "Clients CRM":
        return <ClientView store={store} />;
      case "Carrier Rates":
        return <VendorView store={store} />;
      case "Task Queue":
        return <TaskView store={store} />;
      case "Documents Cabinet":
        return <DocumentView store={store} />;
      case "Analytics Reports":
        return <ReportView store={store} />;
      case "System Settings":
        return <SettingsView store={store} />;
      default:
        return (
          <DashboardView
            store={store}
            onNavigateShipment={(id) => {
              setSelectedShipmentId(id);
              setActiveTab("Shipments");
            }}
            onOpenCreateShipmentModal={() => {
              setActiveTab("Shipments");
            }}
            onOpenCreateQuotationModal={() => {
              setActiveTab("Quotations");
            }}
            onOpenUploadDocumentModal={() => {
              setActiveTab("Documents Cabinet");
            }}
          />
        );
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans flex flex-col antialiased selection:bg-blue-100 selection:text-blue-800"
      id="freightos-root-shell">
      {/* Upper Navigation & Controls Header */}
      <header className="bg-white text-slate-900 h-16 border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 relative z-40">
        {/* App Title & responsive sidebar trigger */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-1.5 hover:bg-slate-50 rounded-lg lg:hidden text-slate-500 hover:text-slate-800"
            onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black font-display text-white text-xs tracking-wider shadow-md shadow-blue-500/20 shrink-0">
              F
            </span>
            <span className="font-display font-semibold text-lg tracking-tight hidden sm:inline-block text-[#0F172A]">
              FreightOS
            </span>
          </div>
        </div>

        {/* Dynamic Controls: Role selector, Switch View mode, and notifications */}
        <div className="flex items-center gap-4">
          {/* RBAC Persona Role Swapping - Vital for testing workflow permissions */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] uppercase text-slate-400 font-bold">
              Simulate Persona:
            </span>
            <select
              className="bg-transparent border-none text-xs font-bold text-blue-600 focus:outline-none focus:ring-0 cursor-pointer pr-1"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}>
              <option value="Admin">Admin (Full)</option>
              <option value="Operations">Operations (Agent)</option>
              <option value="Customs Broker">Customs (PIB)</option>
              <option value="Sales">Sales Manager</option>
              <option value="Client">Client Portal</option>
            </select>
          </div>

          {/* Desktop/Mobile Device viewport toggle switcher */}
          <div className="bg-slate-50 rounded-xl p-1 flex items-center gap-0.5 border border-slate-200 shadow-inner">
            <button
              type="button"
              className={`p-1 px-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "desktop"
                  ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              onClick={() => {
                setViewMode("desktop");
                setMobileMenuOpen(false);
              }}>
              <Laptop className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              className={`p-1 px-2 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "mobile"
                  ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              onClick={() => {
                setViewMode("mobile");
                setMobileMenuOpen(false);
              }}>
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Notifications Bell Popover */}
          <div className="relative">
            <button
              type="button"
              className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800 relative transition-all"
              onClick={() => setNotificationsOpen(!notificationsOpen)}>
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2.5 w-72 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 py-3.5 px-4 space-y-3 z-50">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Alerts Board
                  </h4>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[10px] font-bold text-blue-600 hover:underline">
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-xl text-xs flex flex-col gap-0.5 border ${
                        n.read
                          ? "bg-slate-50/50 border-slate-100 text-slate-400"
                          : "bg-blue-50/40 border-blue-100 text-slate-800"
                      }`}
                      onClick={() => markNotificationRead(n.id)}>
                      <span className="font-bold text-[10px] text-slate-900 block">
                        {n.title}
                      </span>
                      <p className="text-[10px] leading-relaxed text-slate-600">
                        {n.description}
                      </p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center py-4 text-[10px] text-slate-400 font-semibold">
                      No notifications.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Signout */}
          <button
            type="button"
            className="p-1.5 hover:bg-slate-50 rounded-xl text-slate-500 hover:text-slate-800"
            onClick={logout}>
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* VIEWPORT CONTROLLER SWITCH */}
      {viewMode === "mobile" ? (
        /* Mobile Simulator Mode Frame Wrapper */
        <div className="flex-1 overflow-y-auto bg-slate-100 flex items-center justify-center">
          <MobileSimulator store={store} />
        </div>
      ) : (
        /* Desktop Mode Layout Frame */
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT DESKTOP NAVIGATION SIDEBAR */}
          <aside
            className="w-56 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between p-4"
            id="desktop-sidebar">
            <div className="space-y-5">
              {/* Profile Card Summary */}
              <div className="bg-slate-50 border border-slate-150 p-3 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs uppercase shadow-sm">
                  {currentUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold text-slate-950 truncate">
                    {currentUser.name}
                  </span>
                  <span className="block text-[9px] font-mono font-bold uppercase text-slate-400">
                    {currentRole} Profile
                  </span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-2 mb-2">
                  Workspace
                </span>
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive =
                    activeTab === item.label && !selectedShipmentId;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={`w-full text-left py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#F1F5F9] text-[#2563EB] shadow-sm"
                          : "hover:bg-slate-50 text-slate-600 hover:text-slate-900"
                      }`}
                      onClick={() => {
                        setActiveTab(item.label);
                        setSelectedShipmentId(null); // Clear selected shipment if switching tabs
                      }}>
                      <IconComponent
                        className={`w-4 h-4 shrink-0 ${isActive ? "text-[#2563EB]" : "text-slate-400"}`}
                      />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Credit details foot block */}
            <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-semibold font-mono space-y-1.5">
              <div className="flex justify-between">
                <span>API STATUS:</span>
                <span className="text-emerald-600 font-bold">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>TENANT REGION:</span>
                <span>CGK_IND</span>
              </div>
            </div>
          </aside>

          {/* TABLET / MOBILE SLIDING NAVIGATION DRAWER */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/40 backdrop-blur-sm"
              id="mobile-sidebar-backdrop">
              <div className="w-64 bg-white p-5 flex flex-col justify-between animate-slide-in relative shadow-2xl">
                <button
                  type="button"
                  className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded-lg text-slate-400"
                  onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                  {/* Brand info */}
                  <div className="flex items-center gap-2 border-b border-slate-50 pb-4">
                    <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xs">
                      F
                    </span>
                    <span className="font-display font-black text-sm text-slate-900 tracking-tight">
                      FreightOS
                    </span>
                  </div>

                  <nav className="space-y-1">
                    {navItems.map((item) => {
                      const IconComponent = item.icon;
                      const isActive =
                        activeTab === item.label && !selectedShipmentId;
                      return (
                        <button
                          key={item.label}
                          type="button"
                          className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                            isActive
                              ? "bg-[#F1F5F9] text-[#2563EB]"
                              : "hover:bg-slate-50 text-slate-700"
                          }`}
                          onClick={() => {
                            setActiveTab(item.label);
                            setSelectedShipmentId(null);
                            setMobileMenuOpen(false);
                          }}>
                          <IconComponent
                            className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-[#2563EB]" : "text-slate-400"}`}
                          />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Account role mobile select */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                      {currentUser.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-none">
                        {currentUser.name}
                      </h4>
                      <span className="text-[9px] text-slate-400 font-mono font-bold uppercase mt-1 block">
                        {currentRole} Profile
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CORE DESKTOP CONTENT VIEWPORT SCROLLABLE */}
          <main
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full"
            id="desktop-viewport">
            {renderDesktopView()}
          </main>
        </div>
      )}
    </div>
  );
}

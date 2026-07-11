import { useState } from "react";
import { X, Ship, Calendar, MapPin, Building2 } from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { ShipmentStatus } from "../types";

interface CreateShipmentModalProps {
  store: FreightStore;
  onClose: () => void;
}

export default function CreateShipmentModal({ store, onClose }: CreateShipmentModalProps) {
  const [shipper, setShipper] = useState("");
  const [consignee, setConsignee] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [commodity, setCommodity] = useState("");
  const [shippingLine, setShippingLine] = useState("");
  const [containerType, setContainerType] = useState("40HC Dry Van");
  const [containerCount, setContainerCount] = useState(1);
  const [etd, setEtd] = useState("");
  const [eta, setEta] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a random reference number
    const refNum = `FOS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    store.addShipment({
      referenceNumber: refNum,
      status: "Booking Confirmed" as ShipmentStatus,
      origin: origin || "TBD Origin",
      destination: destination || "TBD Destination",
      shippingLine: shippingLine || "TBD Carrier",
      containerType,
      containerCount,
      etd: etd || new Date().toISOString().split("T")[0],
      eta: eta || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      pic: store.currentUser?.name || "System",
      shipper: shipper || "TBD Shipper",
      consignee: consignee || "TBD Consignee",
      commodity: commodity || "General Cargo",
      freeTime: 14,
      demurrage: 100
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Ship className="w-5 h-5 text-blue-600" />
              Book New Shipment
            </h2>
            <p className="text-[10px] text-slate-500 font-mono font-bold uppercase mt-1">
              Create a new active logistics job
            </p>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-5">
          {/* Parties */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Parties
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Shipper (Exporter)</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  placeholder="e.g. Shenzhen Tech Trading"
                  value={shipper}
                  onChange={(e) => setShipper(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Consignee (Importer)</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  placeholder="e.g. PT. Computindo Jaya"
                  value={consignee}
                  onChange={(e) => setConsignee(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Routing */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Routing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Origin Port</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  placeholder="e.g. Yantian Port, China"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Destination Port</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  placeholder="e.g. Tanjung Priok, Indonesia"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5" /> Cargo Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Commodity</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  placeholder="e.g. Electronics"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Shipping Line / Carrier</label>
                <input 
                  type="text" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  placeholder="e.g. Maersk Line"
                  value={shippingLine}
                  onChange={(e) => setShippingLine(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Container Type</label>
                <select 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                  value={containerType}
                  onChange={(e) => setContainerType(e.target.value)}
                >
                  <option value="40HC Dry Van">40HC Dry Van</option>
                  <option value="20GP Standard">20GP Standard</option>
                  <option value="40Ref Refrigerated">40Ref Refrigerated</option>
                  <option value="LCL / Loose Cargo">LCL / Loose Cargo</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  value={containerCount}
                  onChange={(e) => setContainerCount(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Schedule Dates
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Estimated Time of Departure (ETD)</label>
                <input 
                  type="date" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  value={etd}
                  onChange={(e) => setEtd(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1">Estimated Time of Arrival (ETA)</label>
                <input 
                  type="date" 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500" 
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

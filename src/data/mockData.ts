/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shipment, Milestone, Document, Task, Quotation, Client, Vendor, Notification, ActivityLog, User } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'usr-1', name: 'Alghany Kennedy Adam', email: 'alghany.t@freightos.com', role: 'Admin', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80', company: 'FreightOS Jakarta' },
  { id: 'usr-2', name: 'Sarah Jenkins', email: 'sarah.j@freightos.com', role: 'Manager', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80', company: 'FreightOS Singapore' },
  { id: 'usr-3', name: 'Raka Ardiansyah', email: 'raka.a@freightos.com', role: 'Operations', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80', company: 'FreightOS Jakarta' },
  { id: 'usr-4', name: 'Michael Chang', email: 'm.chang@freightos.com', role: 'Sales', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80', company: 'FreightOS Shanghai' },
  { id: 'usr-5', name: 'Linda Watson', email: 'linda.w@freightos.com', role: 'Finance', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100&q=80', company: 'FreightOS Rotterdam' }
];

export const MOCK_CLIENTS: Client[] = [
  {
    id: 'cli-1',
    name: 'PT. Indofood Sukses Makmur',
    company: 'Indofood Group',
    contactEmail: 'logistics@indofood.co.id',
    contactPhone: '+62-21-5795-8822',
    shipmentCount: 42,
    quotationCount: 15,
    outstandingJobs: 4,
    rating: 4.8,
    address: 'Sudirman Plaza, Indofood Tower, Jakarta, Indonesia',
    notes: 'Key VIP account. Demands strict adherence to Free Time deadlines. Main routes: Ningbo to Jakarta.'
  },
  {
    id: 'cli-2',
    name: 'Unilever NV Europe',
    company: 'Unilever Global',
    contactEmail: 'freight.eu@unilever.com',
    contactPhone: '+31-10-502-3000',
    shipmentCount: 128,
    quotationCount: 48,
    outstandingJobs: 12,
    rating: 4.9,
    address: 'Weena 455, 3013 AL Rotterdam, Netherlands',
    notes: 'Prefers Maersk Line or MSC. High volume of chemical additives and packaging materials.'
  },
  {
    id: 'cli-3',
    name: 'Samsung Electronics Indonesia',
    company: 'Samsung Group',
    contactEmail: 'cargo.samsung@samsung.com',
    contactPhone: '+62-21-898-4444',
    shipmentCount: 64,
    quotationCount: 22,
    outstandingJobs: 7,
    rating: 4.7,
    address: 'Cikarang Industrial Estate, Bekasi, Indonesia',
    notes: 'Requires high security transport. Electronics parts imported from Busan and Shanghai.'
  },
  {
    id: 'cli-4',
    name: 'Decathlon France SA',
    company: 'Decathlon Group',
    contactEmail: 'import.sports@decathlon.com',
    contactPhone: '+33-3-2019-8000',
    shipmentCount: 35,
    quotationCount: 10,
    outstandingJobs: 2,
    rating: 4.5,
    address: '4 Boulevard de Mons, 59650 Villeneuve-d\'Ascq, France',
    notes: 'Seasonal goods, high volume of LCL during Spring. Shipping sporting apparel.'
  }
];

export const MOCK_VENDORS: Vendor[] = [
  {
    id: 'ven-1',
    name: 'Maersk Line Indonesia',
    type: 'Shipping Line',
    rating: 4.8,
    contactEmail: 'idn.sales@maersk.com',
    contactPhone: '+62-21-3006-5000',
    coverage: ['Global', 'Intra-Asia', 'Asia-Europe', 'Transpacific'],
    routes: ['Ningbo -> Jakarta', 'Shanghai -> Rotterdam', 'Busan -> Jakarta'],
    priceList: [
      { item: 'Ocean Freight 20GP (Ningbo-Jakarta)', price: 1200 },
      { item: 'Ocean Freight 40HC (Ningbo-Jakarta)', price: 1950 },
      { item: 'THC Jakarta (Per Container)', price: 150 }
    ],
    historyCount: 145
  },
  {
    id: 'ven-2',
    name: 'Samudera Indonesia Trucking',
    type: 'Trucking',
    rating: 4.5,
    contactEmail: 'trucking.sales@samudera.id',
    contactPhone: '+62-21-548-0088',
    coverage: ['Java Island', 'Sumatra', 'Bali'],
    routes: ['Tanjung Priok -> Cikarang', 'Tanjung Priok -> Karawang', 'Tanjung Perak -> Surabaya City'],
    priceList: [
      { item: '20GP Trucking Tanjung Priok to Cikarang', price: 180 },
      { item: '40HC Trucking Tanjung Priok to Cikarang', price: 240 },
      { item: 'Multidrop Karawang Surcharge', price: 80 }
    ],
    historyCount: 210
  },
  {
    id: 'ven-3',
    name: 'Prima Customs Brokerage',
    type: 'Customs Broker',
    rating: 4.9,
    contactEmail: 'clearance@primabroker.co.id',
    contactPhone: '+62-21-4390-1234',
    coverage: ['Tanjung Priok Customs', 'Soekarno-Hatta Air Cargo'],
    routes: ['Import Clearance Standard', 'Red Channel Handling', 'Export Clearance Standard'],
    priceList: [
      { item: 'Import PIB Custom Declaration (Per Set)', price: 110 },
      { item: 'Red Channel Physical Inspection Surcharge', price: 150 },
      { item: 'Certificate of Origin (COO) Processing', price: 50 }
    ],
    historyCount: 340
  },
  {
    id: 'ven-4',
    name: 'Dwipa Container Depot',
    type: 'Container Depot',
    rating: 4.2,
    contactEmail: 'depot.dwipa@dwipa.co.id',
    contactPhone: '+62-21-440-5522',
    coverage: ['Cilincing Area, Jakarta', 'Surabaya Depot'],
    routes: ['Container Storage', 'Washing & Repair', 'PTI (Pre-Trip Inspection)'],
    priceList: [
      { item: 'Empty Container Storage (Per Day/20GP)', price: 5 },
      { item: 'Empty Container Storage (Per Day/40HC)', price: 8 },
      { item: 'Container Sweeping & Washing', price: 15 }
    ],
    historyCount: 95
  }
];

export const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'shp-1',
    referenceNumber: 'FOS-2026-9041',
    status: 'In Transit',
    origin: 'Ningbo Port, China',
    destination: 'Tanjung Priok, Jakarta, Indonesia',
    shippingLine: 'Maersk Line',
    containerType: '40HC Dry Van',
    containerCount: 3,
    etd: '2026-07-02',
    eta: '2026-07-12',
    pic: 'Raka Ardiansyah',
    shipper: 'Zhejiang Manufacturing Corp',
    consignee: 'PT. Indofood Sukses Makmur',
    commodity: 'Industrial Food Additives & MSG',
    progress: 60,
    freeTime: 14,
    demurrage: 120,
    alertStatus: 'green'
  },
  {
    id: 'shp-2',
    referenceNumber: 'FOS-2026-8812',
    status: 'At Customs',
    origin: 'Busan Port, South Korea',
    destination: 'Tanjung Priok, Jakarta, Indonesia',
    shippingLine: 'ONE Network Express',
    containerType: '20GP Standard',
    containerCount: 5,
    etd: '2026-06-25',
    eta: '2026-07-05',
    pic: 'Raka Ardiansyah',
    shipper: 'Samsung Electronics Co. Ltd',
    consignee: 'Samsung Electronics Indonesia',
    commodity: 'Semi-conductor Silicon Wafers & Sensors',
    progress: 85,
    freeTime: 7,
    demurrage: 150,
    alertStatus: 'red' // Red because today is July 8th, ETA was July 5th, and it's stuck at customs - potential demurrage starts soon!
  },
  {
    id: 'shp-3',
    referenceNumber: 'FOS-2026-7299',
    status: 'Booking Confirmed',
    origin: 'Rotterdam Port, Netherlands',
    destination: 'Port of Newark, USA',
    shippingLine: 'MSC Cruise & Cargo',
    containerType: '40Ref Refrigerated',
    containerCount: 2,
    etd: '2026-07-15',
    eta: '2026-07-28',
    pic: 'Sarah Jenkins',
    shipper: 'Unilever NV Europe',
    consignee: 'Unilever Logistics USA',
    commodity: 'Dairy Flavoring Concentrates',
    progress: 15,
    freeTime: 10,
    demurrage: 200,
    alertStatus: 'blue'
  },
  {
    id: 'shp-4',
    referenceNumber: 'FOS-2026-6150',
    status: 'Out for Delivery',
    origin: 'Shanghai Port, China',
    destination: 'Karawang Industrial Zone, Indonesia',
    shippingLine: 'CMA CGM',
    containerType: '40HC Dry Van',
    containerCount: 1,
    etd: '2026-06-28',
    eta: '2026-07-07',
    pic: 'Raka Ardiansyah',
    shipper: 'Decathlon Sports China Ltd',
    consignee: 'PT. Decathlon Sports Retail',
    commodity: 'Bicycles and Sports Footwear Apparel',
    progress: 95,
    freeTime: 14,
    demurrage: 90,
    alertStatus: 'green'
  },
  {
    id: 'shp-5',
    referenceNumber: 'FOS-2026-5544',
    status: 'Completed',
    origin: 'Tanjung Priok, Jakarta, Indonesia',
    destination: 'Hamburg Port, Germany',
    shippingLine: 'Hapag-Lloyd',
    containerType: '40HC Dry Van',
    containerCount: 4,
    etd: '2026-05-10',
    eta: '2026-06-15',
    pic: 'Sarah Jenkins',
    shipper: 'PT. Astra Otoparts Tbk',
    consignee: 'Volkswagen AG Hamburg',
    commodity: 'Automotive Metal Forged Stamping Parts',
    progress: 100,
    freeTime: 14,
    demurrage: 130,
    alertStatus: 'green'
  },
  {
    id: 'shp-6',
    referenceNumber: 'FOS-2026-4411',
    status: 'Delayed',
    origin: 'Yantian Port, China',
    destination: 'Tanjung Priok, Jakarta, Indonesia',
    shippingLine: 'COSCO Shipping',
    containerType: '40HC Dry Van',
    containerCount: 6,
    etd: '2026-06-18',
    eta: '2026-07-10', // Delayed by typhoon, originally ETA July 1st
    pic: 'Alghany Kennedy',
    shipper: 'Shenzhen Tech Trading Ltd',
    consignee: 'PT. Computindo Jaya',
    commodity: 'LED Monitor Panels and Electronic Kits',
    progress: 45,
    freeTime: 10,
    demurrage: 110,
    alertStatus: 'yellow'
  }
];

export const MOCK_MILESTONES: Milestone[] = [
  // For shp-1: FOS-2026-9041
  { id: 'mil-1', shipmentId: 'shp-1', name: 'Booking Confirmed', date: '2026-06-28', pic: 'Michael Chang', status: 'Completed', notes: 'Booking secured on Maersk vessel METZ Voyage 264A.' },
  { id: 'mil-2', shipmentId: 'shp-1', name: 'SI Submitted', date: '2026-06-29', pic: 'Raka Ardiansyah', status: 'Completed', notes: 'Shipping Instructions submitted with correct HS codes.' },
  { id: 'mil-3', shipmentId: 'shp-1', name: 'BL Draft', date: '2026-06-30', pic: 'Raka Ardiansyah', status: 'Completed', notes: 'BL draft checked and approved by shipper.' },
  { id: 'mil-4', shipmentId: 'shp-1', name: 'BL Final', date: '2026-07-02', pic: 'Raka Ardiansyah', status: 'Completed', notes: 'Telex release final BL issued by Maersk Ningbo.', attachmentName: 'Telex_BL_FOS_9041.pdf' },
  { id: 'mil-5', shipmentId: 'shp-1', name: 'Invoice & Packing List', date: '2026-07-03', pic: 'Raka Ardiansyah', status: 'Completed', notes: 'Commercial documents received from exporter.', attachmentName: 'Invoice_PL_Combined.pdf' },
  { id: 'mil-6', shipmentId: 'shp-1', name: 'PIB Submitted', date: '2026-07-07', pic: 'Raka Ardiansyah', status: 'Completed', notes: 'Import Customs Declaration (PIB) pre-lodged with customs.', attachmentName: 'PIB_FOS_9041_Submitted.pdf' },
  { id: 'mil-7', shipmentId: 'shp-1', name: 'PIB Approved (SPPB)', date: '2026-07-12', pic: 'Raka Ardiansyah', status: 'Pending', notes: 'Awaiting vessel arrival for final approval and physical clearance.' },
  { id: 'mil-8', shipmentId: 'shp-1', name: 'Delivery Order', date: '2026-07-13', pic: 'Raka Ardiansyah', status: 'Pending' },
  { id: 'mil-9', shipmentId: 'shp-1', name: 'Container Delivered', date: '2026-07-14', pic: 'Raka Ardiansyah', status: 'Pending' },

  // For shp-2: FOS-2026-8812 (Stuck at Customs)
  { id: 'mil-201', shipmentId: 'shp-2', name: 'Booking Confirmed', date: '2026-06-18', pic: 'Michael Chang', status: 'Completed', notes: 'ONE Line confirmed booking.' },
  { id: 'mil-202', shipmentId: 'shp-2', name: 'BL Final', date: '2026-06-25', pic: 'Raka Ardiansyah', status: 'Completed', notes: 'Original BL deposited at Jakarta branch.' },
  { id: 'mil-203', shipmentId: 'shp-2', name: 'PIB Submitted', date: '2026-07-04', pic: 'Raka Ardiansyah', status: 'Completed', notes: 'PIB submitted. Red channel assigned by customs system.', attachmentName: 'PIB_FOS_8812_Red.pdf' },
  { id: 'mil-204', shipmentId: 'shp-2', name: 'Customs Inspection (Belek)', date: '2026-07-07', pic: 'Raka Ardiansyah', status: 'In Progress', notes: 'Physical inspection underway at Terminal 3. Customs inspector raising questions about HS code for sensor kits.' },
  { id: 'mil-205', shipmentId: 'shp-2', name: 'PIB Approved (SPPB)', date: '2026-07-09', pic: 'Raka Ardiansyah', status: 'Pending', notes: 'Requires HS resolution letter.' }
];

export const MOCK_DOCUMENTS: Document[] = [
  { id: 'doc-1', shipmentId: 'shp-1', name: 'Bill_of_Lading_FOS_9041.pdf', category: 'Shipping', status: 'Approved', size: '2.4 MB', uploadedBy: 'Raka Ardiansyah', uploadedAt: '2026-07-02 14:20', version: 2 },
  { id: 'doc-2', shipmentId: 'shp-1', name: 'Commercial_Invoice_Indofood_9041.pdf', category: 'Commercial', status: 'Approved', size: '1.1 MB', uploadedBy: 'Raka Ardiansyah', uploadedAt: '2026-07-03 09:15', version: 1 },
  { id: 'doc-3', shipmentId: 'shp-1', name: 'Packing_List_Zhejiang_9041.pdf', category: 'Commercial', status: 'Approved', size: '980 KB', uploadedBy: 'Raka Ardiansyah', uploadedAt: '2026-07-03 09:17', version: 1 },
  { id: 'doc-4', shipmentId: 'shp-1', name: 'Certificate_of_Origin_Form_E.pdf', category: 'Regulatory', status: 'Submitted', size: '1.5 MB', uploadedBy: 'Raka Ardiansyah', uploadedAt: '2026-07-07 11:30', version: 1 },
  { id: 'doc-5', shipmentId: 'shp-1', name: 'Draft_Customs_Declaration_PIB.pdf', category: 'Customs', status: 'Draft', size: '420 KB', uploadedBy: 'Raka Ardiansyah', uploadedAt: '2026-07-06 17:45', version: 1 },

  { id: 'doc-6', shipmentId: 'shp-2', name: 'Original_B_L_ONE_8812.pdf', category: 'Shipping', status: 'Approved', size: '3.1 MB', uploadedBy: 'Raka Ardiansyah', uploadedAt: '2026-06-25 10:00', version: 1 },
  { id: 'doc-7', shipmentId: 'shp-2', name: 'Samsung_Customs_Correction_Letter.pdf', category: 'Customs', status: 'Rejected', size: '840 KB', uploadedBy: 'Raka Ardiansyah', uploadedAt: '2026-07-07 15:20', version: 1 }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'tsk-1',
    shipmentId: 'shp-2',
    shipmentRef: 'FOS-2026-8812',
    title: 'Upload HS Code Clarification Letter for Samsung sensors',
    priority: 'Urgent',
    status: 'In Progress',
    dueDate: '2026-07-09',
    pic: 'Raka Ardiansyah',
    commentsCount: 3,
    checklist: [
      { id: 'cl-1', text: 'Obtain clarification sheet from Samsung engineers', done: true },
      { id: 'cl-2', text: 'Draft official letter with customs broker stamp', done: false },
      { id: 'cl-3', text: 'Submit letter to Customs Section Chief', done: false }
    ],
    labels: ['Customs', 'Red Channel', 'Samsung']
  },
  {
    id: 'tsk-2',
    shipmentId: 'shp-1',
    shipmentRef: 'FOS-2026-9041',
    title: 'Coordinate trucking dispatcher for Indofood containers',
    priority: 'High',
    status: 'Todo',
    dueDate: '2026-07-11',
    pic: 'Raka Ardiansyah',
    commentsCount: 1,
    checklist: [
      { id: 'cl-201', text: 'Confirm 3x 40HC trailer availability with Samudera Trucking', done: false },
      { id: 'cl-202', text: 'Draft truck routes and deliver PIN code to drivers', done: false }
    ],
    labels: ['Trucking', 'Indofood']
  },
  {
    id: 'tsk-3',
    shipmentId: 'shp-3',
    shipmentRef: 'FOS-2026-7299',
    title: 'Check reefer temperature log and power connection at port',
    priority: 'Medium',
    status: 'Backlog',
    dueDate: '2026-07-15',
    pic: 'Sarah Jenkins',
    commentsCount: 0,
    checklist: [
      { id: 'cl-301', text: 'Ensure temp is locked at -18°C', done: false },
      { id: 'cl-302', text: 'Confirm port plugging list contains FOS-2026-7299', done: false }
    ],
    labels: ['Reefer', 'Port Operations']
  },
  {
    id: 'tsk-4',
    shipmentId: 'shp-4',
    shipmentRef: 'FOS-2026-6150',
    title: 'Settle warehouse drop-off fee and collect POD',
    priority: 'Low',
    status: 'Done',
    dueDate: '2026-07-08',
    pic: 'Raka Ardiansyah',
    commentsCount: 2,
    checklist: [
      { id: 'cl-401', text: 'Generate warehouse payment slip', done: true },
      { id: 'cl-402', text: 'Upload signed POD to documents folder', done: true }
    ],
    labels: ['Billing', 'POD']
  }
];

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'qte-1',
    clientId: 'cli-1',
    clientName: 'PT. Indofood Sukses Makmur',
    type: 'FCL',
    origin: 'Ningbo Port, China',
    destination: 'Tanjung Priok, Jakarta, Indonesia',
    containerType: '40HC Dry Van',
    volume: '2 x 40HC',
    charges: [
      { name: 'Ocean Freight (Ningbo-Jakarta)', amount: 1950 },
      { name: 'Origin Terminal Handling Charge (OTHC)', amount: 180 },
      { name: 'Destination THC', amount: 150 },
      { name: 'Customs Clearance Agent Fee', amount: 110 },
      { name: 'Local Trucking to Factory (Cikarang)', amount: 240 }
    ],
    margin: 15,
    totalCost: 5240, // Calculated automatically: (sum of charges) * (1 + margin/100)
    status: 'Approved',
    date: '2026-06-25'
  },
  {
    id: 'qte-2',
    clientId: 'cli-2',
    clientName: 'Unilever NV Europe',
    type: 'FCL',
    origin: 'Shanghai Port, China',
    destination: 'Rotterdam Port, Netherlands',
    containerType: '40Ref Refrigerated',
    volume: '1 x 40Ref',
    charges: [
      { name: 'Ocean Reefer Freight (Shanghai-Rotterdam)', amount: 4800 },
      { name: 'Port Plug-in Surcharge', amount: 350 },
      { name: 'Local Handling and Customs', amount: 420 }
    ],
    margin: 12,
    totalCost: 6238.4,
    status: 'Sent',
    date: '2026-07-05'
  },
  {
    id: 'qte-3',
    clientId: 'cli-4',
    clientName: 'Decathlon France SA',
    type: 'LCL',
    origin: 'Ningbo Port, China',
    destination: 'Marseille, France',
    containerType: 'Loose Cargo',
    volume: '6.5 CBM',
    charges: [
      { name: 'Ocean LCL Freight (Per CBM)', amount: 90 },
      { name: 'Consolidation Handling Surcharge', amount: 120 },
      { name: 'Delivery to Marseille Warehouse', amount: 350 }
    ],
    margin: 20,
    totalCost: 1266,
    status: 'Draft',
    date: '2026-07-08'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'not-1', type: 'Shipment', title: 'Vessel Delayed - FOS-2026-4411', description: 'Typhoon Ewinar in East China Sea has delayed COSCO Shipping vessel ETA by 9 days.', timestamp: '2026-07-08 10:15', read: false, shipmentId: 'shp-6' },
  { id: 'not-2', type: 'Task', title: 'Task Due Today - HS Clarification', description: 'Urgent task "Upload HS Code Clarification Letter for Samsung sensors" is due today by 17:00.', timestamp: '2026-07-08 08:00', read: false, shipmentId: 'shp-2' },
  { id: 'not-3', type: 'Documents', title: 'Document Rejected by Manager', description: 'Samsung_Customs_Correction_Letter.pdf was rejected. HS details need official stamp.', timestamp: '2026-07-07 16:30', read: true, shipmentId: 'shp-2' },
  { id: 'not-4', type: 'Approval', title: 'Quotation Approved by Unilever', description: 'Quotation QTE-2026-02 for Shanghai to Rotterdam reefer has been approved by Unilever logistics manager.', timestamp: '2026-07-06 14:10', read: true, shipmentId: 'shp-3' },
  { id: 'not-5', type: 'Deadline', title: 'Demurrage Alert - FOS-2026-8812', description: 'Free time ends in 48 hours for Samsung containers. Clear PIB immediately.', timestamp: '2026-07-06 09:00', read: false, shipmentId: 'shp-2' }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: 'act-1', shipmentId: 'shp-1', type: 'milestone', text: 'Milestone "PIB Submitted" updated to Completed by Raka Ardiansyah.', timestamp: '2026-07-07 11:32', user: 'Raka Ardiansyah' },
  { id: 'act-2', shipmentId: 'shp-1', type: 'document', text: 'Document "Certificate_of_Origin_Form_E.pdf" uploaded.', timestamp: '2026-07-07 11:30', user: 'Raka Ardiansyah' },
  { id: 'act-3', shipmentId: 'shp-2', type: 'milestone', text: 'Milestone "Customs Inspection (Belek)" status changed to In Progress.', timestamp: '2026-07-07 09:15', user: 'Raka Ardiansyah' },
  { id: 'act-4', shipmentId: 'shp-2', type: 'comment', text: 'Raka Ardiansyah added comment: "Customs inspector wants physical specifications sheets for the ICs before they agree to the HS code."', timestamp: '2026-07-07 09:18', user: 'Raka Ardiansyah' },
  { id: 'act-5', shipmentId: 'shp-1', type: 'task', text: 'Task "Coordinate trucking dispatcher for Indofood containers" created.', timestamp: '2026-07-06 15:40', user: 'Raka Ardiansyah' }
];

export const SYSTEM_SETTINGS = {
  companyName: 'FreightOS Global Logistics',
  headquarters: 'Sudirman Tower, Jakarta, Indonesia',
  branches: [
    { name: 'Jakarta (HQ)', country: 'Indonesia', timezone: 'GMT+7' },
    { name: 'Singapore Branch', country: 'Singapore', timezone: 'GMT+8' },
    { name: 'Shanghai Operations', country: 'China', timezone: 'GMT+8' },
    { name: 'Rotterdam Port Hub', country: 'Netherlands', timezone: 'GMT+1' }
  ],
  defaultCurrency: 'USD ($)',
  weightUnit: 'KGS (Kilograms)',
  volumeUnit: 'CBM (Cubic Meters)',
  milestoneTemplates: [
    'Booking Confirmed',
    'SI Submitted',
    'BL Draft',
    'BL Final',
    'Invoice & Packing List',
    'PIB Submitted',
    'PIB Approved (SPPB)',
    'Delivery Order',
    'Container Delivered',
    'Completed'
  ],
  integrations: [
    { id: 'int-1', name: 'Maersk API', type: 'Shipping Line', status: 'Connected', lastSync: '2026-07-08 17:00' },
    { id: 'int-2', name: 'ONE Link', type: 'Shipping Line', status: 'Connected', lastSync: '2026-07-08 18:00' },
    { id: 'int-3', name: 'CEISA Customs Indonesia', type: 'Customs Platform', status: 'Connected', lastSync: '2026-07-08 18:25' },
    { id: 'int-4', name: 'QuickBooks Ledger', type: 'ERP Finance', status: 'Disconnected' }
  ]
};

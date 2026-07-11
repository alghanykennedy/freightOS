/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Admin' | 'Manager' | 'Operations' | 'Sales' | 'Finance';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  company: string;
}

export type ShipmentStatus =
  | 'Booking Confirmed'
  | 'In Transit'
  | 'At Customs'
  | 'Out for Delivery'
  | 'Completed'
  | 'Delayed';

export type AlertStatus = 'green' | 'yellow' | 'red' | 'blue';

export interface Shipment {
  id: string;
  referenceNumber: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  shippingLine: string;
  containerType: string;
  containerCount: number;
  etd: string;
  eta: string;
  pic: string;
  shipper: string;
  consignee: string;
  commodity: string;
  progress: number;
  freeTime: number;
  demurrage: number; // Charge per day
  alertStatus: AlertStatus;
}

export interface Milestone {
  id: string;
  shipmentId: string;
  name: string;
  date: string;
  pic: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
  attachmentName?: string;
}

export type DocumentCategory = 'Shipping' | 'Commercial' | 'Regulatory' | 'Customs' | 'Internal';
export type DocumentStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected';

export interface Document {
  id: string;
  shipmentId: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface TaskChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  shipmentId: string;
  shipmentRef: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  pic: string;
  commentsCount: number;
  checklist: TaskChecklistItem[];
  labels: string[];
}

export interface ChargeItem {
  name: string;
  amount: number;
}

export interface Quotation {
  id: string;
  clientId: string;
  clientName: string;
  type: 'FCL' | 'LCL' | 'Air';
  origin: string;
  destination: string;
  containerType: string;
  volume: string; // e.g., "2x40HC" or "10 CBM"
  charges: ChargeItem[];
  margin: number; // Percentage
  totalCost: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Rejected';
  date: string;
}

export interface Client {
  id: string;
  name: string;
  company: string;
  contactEmail: string;
  contactPhone: string;
  shipmentCount: number;
  quotationCount: number;
  outstandingJobs: number;
  rating: number;
  address: string;
  notes: string;
}

export interface VendorPriceItem {
  item: string;
  price: number;
}

export interface Vendor {
  id: string;
  name: string;
  type: 'Shipping Line' | 'Trucking' | 'Customs Broker' | 'Container Depot';
  rating: number;
  contactEmail: string;
  contactPhone: string;
  coverage: string[];
  routes: string[];
  priceList: VendorPriceItem[];
  historyCount: number;
}

export interface Notification {
  id: string;
  type: 'Task' | 'Shipment' | 'Deadline' | 'Documents' | 'Approval';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  shipmentId?: string;
}

export interface ActivityLog {
  id: string;
  shipmentId: string;
  type: string;
  text: string;
  timestamp: string;
  user: string;
}

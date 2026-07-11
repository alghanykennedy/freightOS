/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Shipment,
  Milestone,
  Document,
  Task,
  Quotation,
  Client,
  Vendor,
  Notification,
  ActivityLog,
  ShipmentStatus
} from '../types';
import {
  MOCK_USERS,
  MOCK_CLIENTS,
  MOCK_VENDORS,
  MOCK_SHIPMENTS,
  MOCK_MILESTONES,
  MOCK_DOCUMENTS,
  MOCK_TASKS,
  MOCK_QUOTATIONS,
  MOCK_NOTIFICATIONS,
  MOCK_ACTIVITIES,
  SYSTEM_SETTINGS
} from './mockData';

export function useFreightStore() {
  // Global View Settings
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>(() => {
    return (localStorage.getItem('f_viewMode') as 'desktop' | 'mobile') || 'desktop';
  });

  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('f_activeTab') || 'Dashboard';
  });

  const [mobileTab, setMobileTab] = useState<string>(() => {
    return localStorage.getItem('f_mobileTab') || 'Home';
  });

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('f_currentUser');
    return saved ? JSON.parse(saved) : MOCK_USERS[0]; // Default to Alghany Kennedy (Admin) for instant onboarding, but allow logout to experience the Login screen
  });

  // Current Working Role (for RBAC testing/toggle)
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('f_currentRole');
    return (saved as UserRole) || 'Admin';
  });

  // Main Entities State
  const [shipments, setShipments] = useState<Shipment[]>(() => {
    const saved = localStorage.getItem('f_shipments');
    return saved ? JSON.parse(saved) : MOCK_SHIPMENTS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem('f_milestones');
    return saved ? JSON.parse(saved) : MOCK_MILESTONES;
  });

  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem('f_documents');
    return saved ? JSON.parse(saved) : MOCK_DOCUMENTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('f_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('f_quotations');
    return saved ? JSON.parse(saved) : MOCK_QUOTATIONS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('f_clients');
    return saved ? JSON.parse(saved) : MOCK_CLIENTS;
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('f_vendors');
    return saved ? JSON.parse(saved) : MOCK_VENDORS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('f_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('f_activities');
    return saved ? JSON.parse(saved) : MOCK_ACTIVITIES;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('f_settings');
    return saved ? JSON.parse(saved) : SYSTEM_SETTINGS;
  });

  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('f_viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('f_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('f_mobileTab', mobileTab);
  }, [mobileTab]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('f_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('f_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('f_currentRole', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('f_shipments', JSON.stringify(shipments));
  }, [shipments]);

  useEffect(() => {
    localStorage.setItem('f_milestones', JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem('f_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('f_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('f_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('f_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('f_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('f_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('f_activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('f_settings', JSON.stringify(settings));
  }, [settings]);

  // Actions
  const login = (email: string, role: UserRole = 'Admin') => {
    const user = MOCK_USERS.find(u => u.email === email) || {
      id: 'usr-' + Date.now(),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80',
      company: 'FreightOS Global'
    };
    setCurrentUser(user);
    setCurrentRole(user.role);
    addLog('system', `${user.name} logged in.`, user.name);
  };

  const logout = () => {
    setCurrentUser(null);
    setSelectedShipmentId(null);
  };

  const addLog = (shipmentId: string, text: string, userName?: string) => {
    const newLog: ActivityLog = {
      id: 'act-' + Math.random().toString(36).substring(2, 9),
      shipmentId,
      type: 'info',
      text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user: userName || currentUser?.name || 'System'
    };
    setActivities(prev => [newLog, ...prev]);
  };

  const addShipment = (shipment: Omit<Shipment, 'id' | 'progress' | 'alertStatus'>) => {
    const newShipment: Shipment = {
      ...shipment,
      id: 'shp-' + Math.random().toString(36).substring(2, 9),
      progress: 10,
      alertStatus: 'green'
    };
    setShipments(prev => [newShipment, ...prev]);

    // Create default milestones for new shipments
    const defaultMilestoneNames = settings.milestoneTemplates;
    const initialMilestones: Milestone[] = defaultMilestoneNames.map((name: string, idx: number) => ({
      id: `mil-${newShipment.id}-${idx}`,
      shipmentId: newShipment.id,
      name,
      date: idx === 0 ? newShipment.etd : '',
      pic: newShipment.pic,
      status: idx === 0 ? 'Completed' : idx === 1 ? 'In Progress' : 'Pending',
      notes: idx === 0 ? 'Initial Booking Setup Completed.' : ''
    }));
    setMilestones(prev => [...prev, ...initialMilestones]);

    // Create system notification
    addNotification({
      type: 'Shipment',
      title: `New Shipment Booked: ${newShipment.referenceNumber}`,
      description: `${newShipment.origin} to ${newShipment.destination} via ${newShipment.shippingLine}`,
      shipmentId: newShipment.id
    });

    addLog(newShipment.id, `Created shipment ${newShipment.referenceNumber} for client ${newShipment.consignee}.`);
    return newShipment;
  };

  const updateShipment = (updated: Shipment) => {
    setShipments(prev => prev.map(s => s.id === updated.id ? updated : s));
    addLog(updated.id, `Updated shipment status to ${updated.status}.`);
  };

  const deleteShipment = (id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    setMilestones(prev => prev.filter(m => m.shipmentId !== id));
    setTasks(prev => prev.filter(t => t.shipmentId !== id));
    setDocuments(prev => prev.filter(d => d.shipmentId !== id));
    setActivities(prev => prev.filter(a => a.shipmentId !== id));
    if (selectedShipmentId === id) setSelectedShipmentId(null);
  };

  const addMilestone = (milestone: Omit<Milestone, 'id'>) => {
    const newMil: Milestone = {
      ...milestone,
      id: 'mil-' + Math.random().toString(36).substring(2, 9)
    };
    setMilestones(prev => [...prev, newMil]);
    addLog(milestone.shipmentId, `Added milestone: "${milestone.name}" (${milestone.status})`);
  };

  const updateMilestone = (updated: Milestone) => {
    setMilestones(prev => prev.map(m => m.id === updated.id ? updated : m));
    
    // Dynamically calculate progress based on completed milestones
    const shipMilestones = milestones.map(m => m.id === updated.id ? updated : m).filter(m => m.shipmentId === updated.shipmentId);
    const completedCount = shipMilestones.filter(m => m.status === 'Completed').length;
    const progressPercent = Math.round((completedCount / (shipMilestones.length || 1)) * 100);

    setShipments(prev => prev.map(s => {
      if (s.id === updated.shipmentId) {
        let finalStatus = s.status;
        if (updated.name === 'Completed' && updated.status === 'Completed') {
          finalStatus = 'Completed';
        } else if (updated.name === 'PIB Approved (SPPB)' && updated.status === 'Completed') {
          finalStatus = 'Out for Delivery';
        } else if (updated.name === 'PIB Submitted' && updated.status === 'Completed') {
          finalStatus = 'At Customs';
        }
        return { ...s, progress: progressPercent, status: finalStatus };
      }
      return s;
    }));

    addLog(updated.shipmentId, `Milestone "${updated.name}" updated to ${updated.status}.`);
  };

  const addDocument = (doc: Omit<Document, 'id' | 'uploadedBy' | 'uploadedAt' | 'version'>) => {
    const newDoc: Document = {
      ...doc,
      id: 'doc-' + Math.random().toString(36).substring(2, 9),
      uploadedBy: currentUser?.name || 'Operations Agent',
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      version: 1
    };
    setDocuments(prev => [newDoc, ...prev]);
    addLog(doc.shipmentId, `Document "${doc.name}" uploaded under category "${doc.category}".`);

    addNotification({
      type: 'Documents',
      title: 'New Document Uploaded',
      description: `"${newDoc.name}" uploaded for shipment ${shipments.find(s => s.id === doc.shipmentId)?.referenceNumber || ''}`,
      shipmentId: doc.shipmentId
    });
    return newDoc;
  };

  const updateDocumentStatus = (id: string, status: Document['status']) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    const doc = documents.find(d => d.id === id);
    if (doc) {
      addLog(doc.shipmentId, `Document "${doc.name}" status changed to ${status}.`);
      addNotification({
        type: 'Documents',
        title: `Document Status Update: ${status}`,
        description: `"${doc.name}" was ${status.toLowerCase()}`,
        shipmentId: doc.shipmentId
      });
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'commentsCount'>) => {
    const newTask: Task = {
      ...task,
      id: 'tsk-' + Math.random().toString(36).substring(2, 9),
      commentsCount: 0
    };
    setTasks(prev => [newTask, ...prev]);
    addLog(task.shipmentId, `Created task: "${task.title}" (Priority: ${task.priority})`);
    
    addNotification({
      type: 'Task',
      title: `Task Assigned: ${task.title}`,
      description: `Assigned to ${task.pic}. Due date: ${task.dueDate}`,
      shipmentId: task.shipmentId
    });
  };

  const updateTask = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const addQuotation = (quote: Omit<Quotation, 'id' | 'date' | 'totalCost'>) => {
    const sumCharges = quote.charges.reduce((sum, c) => sum + c.amount, 0);
    const totalWithMargin = Math.round(sumCharges * (1 + quote.margin / 100) * 100) / 100;

    const newQuote: Quotation = {
      ...quote,
      id: 'qte-' + Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString().substring(0, 10),
      totalCost: totalWithMargin
    };
    setQuotations(prev => [newQuote, ...prev]);

    addNotification({
      type: 'Approval',
      title: 'Quotation Created',
      description: `Quote ${newQuote.id} created for ${quote.clientName} for $${totalWithMargin}`
    });
  };

  const convertQuotationToShipment = (id: string) => {
    const quote = quotations.find(q => q.id === id);
    if (!quote) return null;

    const shipmentData: Omit<Shipment, 'id' | 'progress' | 'alertStatus'> = {
      referenceNumber: 'FOS-2026-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Booking Confirmed',
      origin: quote.origin,
      destination: quote.destination,
      shippingLine: 'Maersk Line', // Default
      containerType: quote.containerType,
      containerCount: 1,
      etd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // in 1 week
      eta: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // in 17 days
      pic: currentUser?.name || 'Alghany Kennedy',
      shipper: 'TBD exporter',
      consignee: quote.clientName,
      commodity: 'Imported Goods',
      freeTime: 14,
      demurrage: 120
    };

    const newShip = addShipment(shipmentData);
    setQuotations(prev => prev.map(q => q.id === id ? { ...q, status: 'Approved' } : q));
    addLog(newShip.id, `Created from quotation reference ${quote.id}.`);
    return newShip;
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNot: Notification = {
      ...notif,
      id: 'not-' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateSettings = (updated: typeof SYSTEM_SETTINGS) => {
    setSettings(updated);
  };

  return {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    mobileTab,
    setMobileTab,
    currentUser,
    login,
    logout,
    currentRole,
    setCurrentRole,
    shipments,
    addShipment,
    updateShipment,
    deleteShipment,
    milestones,
    addMilestone,
    updateMilestone,
    documents,
    addDocument,
    updateDocumentStatus,
    tasks,
    addTask,
    updateTask,
    quotations,
    addQuotation,
    convertQuotationToShipment,
    clients,
    vendors,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    activities,
    selectedShipmentId,
    setSelectedShipmentId,
    settings,
    updateSettings,
    addLog
  };
}
export type FreightStore = ReturnType<typeof useFreightStore>;

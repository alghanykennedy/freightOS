/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  CheckSquare,
  Calendar,
  User,
  Tag,
  Clock,
} from "lucide-react";
import { FreightStore } from "../data/useFreightStore";
import { Task, TaskPriority, TaskStatus } from "../types";

interface TaskViewProps {
  store: FreightStore;
}

export default function TaskView({ store }: TaskViewProps) {
  const { tasks, updateTask, currentRole, currentUser, addLog } = store;
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.shipmentRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "all" || task.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-50 text-red-700 border-red-200";
      case "High":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Medium":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Low":
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "Done":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "In Progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Todo":
        return "bg-slate-50 text-slate-700 border-slate-200";
      case "Review":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const handleToggleChecklist = (task: Task, itemId: string) => {
    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item,
    );
    const updated = { ...task, checklist: updatedChecklist };
    updateTask(updated);
    addLog(task.shipmentId, `Checked task sub-item on "${task.title}"`);
  };

  return (
    <div className="space-y-5" id="tasks-view-root">
      {/* Header */}
      <div>
        <h1 className="text-xl font-display font-semibold text-slate-900 tracking-tight">
          Task Queue
        </h1>
        <p className="text-xs text-slate-500 font-semibold font-mono">
          Operations checklists, documents approvals, and dispatch triggers
        </p>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search tasks, shipments reference keys..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="Backlog">Backlog</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>

      {/* Task directory */}
      <div
        className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
        id="tasks-cabinet">
        <div className="divide-y divide-slate-100">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/45 transition-all">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  className="mt-1 w-4.5 h-4.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer text-xs"
                  checked={task.status === "Done"}
                  onChange={() => {
                    const nextStatus: TaskStatus =
                      task.status === "Done" ? "Todo" : "Done";
                    const updated = { ...task, status: nextStatus };
                    updateTask(updated);
                    addLog(
                      task.shipmentId,
                      `Task status marked ${nextStatus}: "${task.title}"`,
                    );
                  }}
                />
                <div className="space-y-1.5 min-w-0">
                  <span
                    className={`block text-xs font-bold leading-normal ${task.status === "Done" ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {task.title}
                  </span>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-semibold font-mono">
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wide">
                      {task.shipmentRef}
                    </span>
                    <span>PIC: {task.pic}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Due {task.dueDate}
                    </span>
                  </div>

                  {/* Sub-Checklist items */}
                  {task.checklist.length > 0 && (
                    <div className="pl-1 pt-2 space-y-1.5 max-w-md">
                      {task.checklist.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-2 text-[10px] font-medium text-slate-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                            checked={item.done}
                            onChange={() =>
                              handleToggleChecklist(task, item.id)
                            }
                          />
                          <span
                            className={
                              item.done ? "line-through text-slate-400" : ""
                            }>
                            {item.text}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status and Priority badges */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0 text-xs">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getPriorityColor(task.priority)}`}>
                  {task.priority} Priority
                </span>

                {/* Status selector */}
                <select
                  className={`p-1 rounded text-[10px] font-bold border focus:outline-none cursor-pointer ${getStatusColor(task.status)}`}
                  value={task.status}
                  onChange={(e) => {
                    const updated = {
                      ...task,
                      status: e.target.value as TaskStatus,
                    };
                    updateTask(updated);
                    addLog(
                      task.shipmentId,
                      `Updated task status to "${e.target.value}"`,
                    );
                  }}>
                  <option value="Backlog">Backlog</option>
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Review">Review</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="py-12 text-center text-slate-400 text-xs font-semibold">
              🎉 All clear! No matching operational tasks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

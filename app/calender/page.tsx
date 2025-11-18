"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import { v4 as uuidv4 } from "uuid"; // Cần npm install uuid @types/uuid

interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
}

export default function RegisterSchedulePage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // State cho Form nhập liệu mới
  const [newTitle, setNewTitle] = useState("");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  // State cho việc sửa trong Popup
  const [editTitle, setEditTitle] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");

  // Tải dữ liệu từ localStorage và thêm dữ liệu DEMO
  useEffect(() => {
    const stored = localStorage.getItem("scheduleEvents");
    let initialEvents: EventItem[] = [];

    if (stored) {
      try {
        initialEvents = JSON.parse(stored);
      } catch (err) {
        console.error("Lỗi khi parse localStorage:", err);
      }
    }

    // Thêm dữ liệu giả lập (DEMO) nếu không có hoặc bị lỗi
    if (initialEvents.length === 0) {
      initialEvents = [
        {
          id: uuidv4(),
          title: "CS434AG: Công Cụ & PP (Demo)",
          // Đặt lịch vào ngày hiện tại để dễ thấy (chỉ cần ngày và giờ hợp lệ)
          start:
            new Date(Date.now() + 1000 * 60 * 60 * 1)
              .toISOString()
              .substring(0, 16) + ":00",
          end:
            new Date(Date.now() + 1000 * 60 * 60 * 2.5)
              .toISOString()
              .substring(0, 16) + ":00",
        },
      ];
    }

    saveEvents(initialEvents);
  }, []);

  // Hàm lưu dữ liệu vào state và localStorage
  const saveEvents = (updated: EventItem[]) => {
    setEvents(updated);
    localStorage.setItem("scheduleEvents", JSON.stringify(updated));
  };

  // --- Logic Thêm Sự kiện mới ---
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newStart || !newEnd) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const newEvent: EventItem = {
      id: uuidv4(),
      title: newTitle,
      // Đảm bảo format phù hợp cho FullCalendar
      start: newStart + ":00",
      end: newEnd + ":00",
    };

    saveEvents([...events, newEvent]);
    // Reset form
    setNewTitle("");
    setNewStart("");
    setNewEnd("");
  };

  // --- Logic Mở Popup Sửa ---
  const handleEventClick = (info: EventClickArg) => {
    const clickedEvent = events.find((e) => e.id === info.event.id);
    if (clickedEvent) {
      setSelectedEvent(clickedEvent);
      // Chuyển về format datetime-local (YYYY-MM-DDTHH:mm)
      setEditTitle(clickedEvent.title);
      setEditStart(clickedEvent.start.substring(0, 16));
      setEditEnd(clickedEvent.end.substring(0, 16));
      setShowPopup(true);
    }
  };

  // --- Logic Lưu Sửa đổi trong Popup ---
  const handleSave = () => {
    if (!selectedEvent) return;

    const updated = events.map((e) =>
      e.id === selectedEvent.id
        ? {
            ...e,
            title: editTitle,
            start: editStart + ":00",
            end: editEnd + ":00",
          }
        : e
    );
    saveEvents(updated);
    setShowPopup(false);
  };

  // --- Logic Xóa Sự kiện trong Popup ---
  const handleDelete = () => {
    if (!selectedEvent) return;
    const updated = events.filter((e) => e.id !== selectedEvent.id);
    saveEvents(updated);
    setShowPopup(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-extrabold mb-8 text-center text-green-400">
        🎓 Quản Lý Lịch Học Cá Nhân
      </h1>

      {/* Container chứa Form và Lịch */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        {/* Cột 1: Form Thêm Sự kiện */}
        <div className="p-6 bg-[#1f2937] rounded-lg shadow-xl space-y-4 max-w-lg mx-auto w-full">
          <h2 className="text-xl font-bold text-white text-center">
            📝 Thêm lịch học mới
          </h2>

          <form onSubmit={handleAddEvent} className="space-y-3">
            <input
              type="text"
              placeholder="Tên môn học/Sự kiện"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-3 rounded bg-[#111827] text-white placeholder-gray-400 border border-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            />

            <label className="block text-gray-400 text-sm pt-2">
              Thời gian Bắt đầu
            </label>
            <input
              type="datetime-local"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="w-full p-3 rounded bg-[#111827] text-white border border-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            />

            <label className="block text-gray-400 text-sm pt-2">
              Thời gian Kết thúc
            </label>
            <input
              type="datetime-local"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="w-full p-3 rounded bg-[#111827] text-white border border-gray-700 outline-none focus:ring-2 focus:ring-green-500"
            />

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition duration-200 mt-4"
            >
              ➕ Thêm lịch học
            </button>
          </form>
        </div>

        {/* Cột 2: Lịch Học (FullCalendar) */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-4">🗓️ Lịch trình</h2>
          <div className="bg-black text-white p-4 rounded-lg shadow-xl border border-gray-800">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              // Events cần thêm màu sắc để hiển thị
              events={events.map((e) => ({ ...e, color: "#16a34a" }))}
              eventClick={handleEventClick}
              height="auto"
              locale="vi"
            />
            {/* CSS Global cho FullCalendar (chế độ Dark Mode) */}
            <style jsx global>{`
              /* Nền chung */
              .fc {
                background-color: #000 !important;
                color: white !important;
              }
              /* Tiêu đề, ngày tháng */
              .fc-toolbar-title,
              .fc-col-header-cell-cushion,
              .fc-daygrid-day-number,
              .fc-timegrid-slot-label,
              .fc-timegrid-axis,
              .fc-daygrid-day-top {
                color: white !important;
              }
              /* Header ngày */
              .fc .fc-col-header-cell {
                background-color: #000 !important;
                border-color: #4b5563 !important;
              }
              /* Các sự kiện */
              .fc-event {
                background-color: #16a34a !important;
                color: white !important;
                border: none !important;
                padding: 3px 5px;
                border-radius: 4px;
              }
              .fc-event-title {
                color: white !important;
                font-size: 0.875rem;
              }
              /* Nút bấm */
              .fc-button {
                background-color: #1f2937 !important;
                color: white !important;
                border: none !important;
              }
              .fc-button:hover {
                background-color: #374151 !important;
              }
            `}</style>
          </div>
        </div>
      </div>

      {/* Popup Sửa/Xóa Sự kiện */}
      {showPopup && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-md space-y-4">
            <h3 className="text-xl font-bold border-b pb-2 mb-3 text-green-600">
              🛠️ Chỉnh Sửa Lịch Học
            </h3>

            <label className="block text-sm font-medium text-gray-700">
              Tên môn học
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-green-500"
              placeholder="Tên môn học"
            />

            <label className="block text-sm font-medium text-gray-700">
              Bắt đầu
            </label>
            <input
              type="datetime-local"
              value={editStart}
              onChange={(e) => setEditStart(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-green-500"
            />

            <label className="block text-sm font-medium text-gray-700">
              Kết thúc
            </label>
            <input
              type="datetime-local"
              value={editEnd}
              onChange={(e) => setEditEnd(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-green-500"
            />

            <div className="flex justify-between pt-4 gap-2">
              <button
                onClick={handleSave}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition"
              >
                ✅ Lưu
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
              >
                🗑️ Xóa
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded transition"
              >
                ❌ Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

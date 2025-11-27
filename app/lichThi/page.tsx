"use client";

import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ExamItem {
  id: string;
  title: string;
  subject: string;
  start: string;
  end: string;
  room?: string;
  note?: string;
  favorite?: boolean;
}

export default function LichThiPage() {
  const [events, setEvents] = useState<ExamItem[]>([]);
  const [filterSubject, setFilterSubject] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<ExamItem | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formSubject, setFormSubject] = useState("");
  const [formStart, setFormStart] = useState("");
  const [formEnd, setFormEnd] = useState("");
  const [formRoom, setFormRoom] = useState("");
  const [formNote, setFormNote] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("examEvents");
    if (raw) {
      try {
        setEvents(JSON.parse(raw));
        return;
      } catch (e) {}
    }

    // demo
    const now = new Date();
    const oneDay = 86400000;

    const demo: ExamItem[] = [
      {
        id: uuidv4(),
        title: "Thi cuối kỳ A",
        subject: "Lập trình hướng đối tượng",
        start: new Date(now.getTime() + oneDay).toISOString(),
        end: new Date(now.getTime() + oneDay + 7200000).toISOString(),
        room: "Phòng 101",
        note: "Mang theo CMND",
        favorite: false,
      },
      {
        id: uuidv4(),
        title: "Thi giữa kỳ B",
        subject: "Lập trình ứng dụng .NET",
        start: new Date(now.getTime() - 3 * oneDay).toISOString(),
        end: new Date(now.getTime() - 3 * oneDay + 7200000).toISOString(),
        room: "Phòng 202",
        note: "Đã nộp bài tập",
        favorite: true,
      },
    ];

    setEvents(demo);
    localStorage.setItem("examEvents", JSON.stringify(demo));
  }, []);

  const saveEvents = (next: ExamItem[]) => {
    setEvents(next);
    localStorage.setItem("examEvents", JSON.stringify(next));
  };

  const subjects = useMemo(() => {
    return Array.from(new Set(events.map((e) => e.subject)));
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (filterSubject && e.subject !== filterSubject) return false;
      return true;
    });
  }, [events, filterSubject]);

  function openNewModal() {
    setEditing(null);
    setFormTitle("");
    setFormSubject("");
    setFormStart("");
    setFormEnd("");
    setFormRoom("");
    setFormNote("");
    setShowModal(true);
  }

  function openEditModal(item: ExamItem) {
    setEditing(item);
    setFormTitle(item.title);
    setFormSubject(item.subject);
    setFormStart(item.start.substring(0, 16));
    setFormEnd(item.end.substring(0, 16));
    setFormRoom(item.room || "");
    setFormNote(item.note || "");
    setShowModal(true);
  }

  function handleSave() {
    if (!formTitle || !formSubject || !formStart || !formEnd)
      return alert("Vui lòng nhập đủ thông tin");

    if (editing) {
      const updated = events.map((ev) =>
        ev.id === editing.id
          ? {
              ...ev,
              title: formTitle,
              subject: formSubject,
              start: formStart,
              end: formEnd,
              room: formRoom,
              note: formNote,
            }
          : ev
      );
      saveEvents(updated);
    } else {
      saveEvents([
        {
          id: uuidv4(),
          title: formTitle,
          subject: formSubject,
          start: formStart,
          end: formEnd,
          room: formRoom,
          note: formNote,
          favorite: false,
        },
        ...events,
      ]);
    }

    setShowModal(false);
  }

  function handleDelete(id: string) {
    if (!confirm("Xóa lịch thi?")) return;
    saveEvents(events.filter((e) => e.id !== id));
  }

  function toggleFavorite(id: string) {
    const updated = events.map((e) =>
      e.id === id ? { ...e, favorite: !e.favorite } : e
    );
    saveEvents(updated);
  }

  /** TIME FORMAT: HH:mm */
  function formatTime(dt: string) {
    return new Date(dt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /** DATE FORMAT: dd/mm/yyyy */
  function formatDate(dt: string) {
    return new Date(dt).toLocaleDateString();
  }

  return (
    <div className="min-h-screen w-full bg-[#020617] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-[#00ff66] flex items-center gap-3 tracking-wide">
            <span className="text-3xl">📅</span>
            QUẢN LÝ LỊCH THI
          </h1>

          <div className="flex gap-4 mt-4 md:mt-0">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 rounded-lg bg-[#0f172a] border border-gray-600 text-white"
            >
              <option value="">Tất cả môn học</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>

            <button
              onClick={openNewModal}
              className="px-4 py-2 bg-[#00ff66] text-black font-bold rounded-lg shadow hover:opacity-90 flex items-center gap-2"
            >
              ➕ Thêm lịch thi mới
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="relative bg-[#0b1220] border border-gray-700 rounded-2xl p-6 shadow-xl"
            >
              {/* FAVORITE */}
              <button
                onClick={() => toggleFavorite(e.id)}
                className="absolute top-4 right-4 text-yellow-400"
              >
                {e.favorite ? "⭐" : "☆"}
              </button>

              <h2 className="text-xl font-bold text-[#ffd700] flex items-center gap-2 mb-3">
                📅 {e.title}
              </h2>

              <div className="space-y-2 text-[#cbd5e1]">
                <p className="flex gap-2">
                  <span className="text-[#7dd3fc]">📘 Môn học:</span> {e.subject}
                </p>

                {/* TIME (Giờ thi) */}
                <p className="flex gap-2">
                  <span className="text-[#7dd3fc]">⏱ Thời gian:</span>
                  {formatTime(e.start)} - {formatTime(e.end)}
                </p>

                {/* DATE (Ngày thi) */}
                <p className="flex gap-2">
                  <span className="text-[#7dd3fc]">📅 Ngày thi:</span>
                  {formatDate(e.start)}
                </p>

                <p className="flex gap-2">
                  <span className="text-[#7dd3fc]">📍 Phòng thi:</span> {e.room}
                </p>

                <p className="flex gap-2">
                  <span className="text-[#7dd3fc]">📝 Ghi chú:</span> {e.note}
                </p>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => alert(formatDate(e.start))}
                  className="px-4 py-2 rounded-xl bg-[#a855f7] text-white font-bold hover:opacity-90"
                >
                  👁 Xem
                </button>

                <button
                  onClick={() => openEditModal(e)}
                  className="px-4 py-2 rounded-xl bg-[#00ff66] text-black font-bold hover:opacity-90"
                >
                  ✏ Sửa
                </button>

                <button
                  onClick={() => handleDelete(e.id)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold hover:opacity-90"
                >
                  🗑 Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-300 mt-10">
            Không có lịch thi nào.
          </p>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0f172a] text-white rounded-xl p-6 w-full max-w-lg border border-gray-700">
              <h3 className="text-2xl font-bold mb-4">
                {editing ? "Sửa lịch thi" : "Thêm lịch thi"}
              </h3>

              <div className="space-y-3">
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Tiêu đề"
                  className="w-full p-3 rounded bg-[#1e293b] border border-gray-600"
                />

                <input
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  placeholder="Môn học"
                  className="w-full p-3 rounded bg-[#1e293b] border border-gray-600"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="datetime-local"
                    value={formStart}
                    onChange={(e) => setFormStart(e.target.value)}
                    className="p-3 rounded bg-[#1e293b] border border-gray-600"
                  />

                  <input
                    type="datetime-local"
                    value={formEnd}
                    onChange={(e) => setFormEnd(e.target.value)}
                    className="p-3 rounded bg-[#1e293b] border border-gray-600"
                  />
                </div>

                <input
                  value={formRoom}
                  onChange={(e) => setFormRoom(e.target.value)}
                  placeholder="Phòng thi"
                  className="w-full p-3 rounded bg-[#1e293b] border border-gray-600"
                />

                <textarea
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  placeholder="Ghi chú"
                  className="w-full p-3 rounded bg-[#1e293b] border border-gray-600 h-24"
                />

                <div className="flex justify-end gap-3 pt-3">
                  {editing && (
                    <button
                      onClick={() => handleDelete(editing.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    >
                      Xóa
                    </button>
                  )}

                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                  >
                    Hủy
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-[#00ff66] text-black font-bold rounded-lg"
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

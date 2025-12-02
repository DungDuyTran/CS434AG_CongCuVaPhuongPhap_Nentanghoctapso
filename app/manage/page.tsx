"use client";

import React, { useEffect, useState } from "react";
import { FaRegCalendarAlt, FaStar } from "react-icons/fa";

const Manage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // State cho form
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Load notes từ BE
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/manage");
      const json = await res.json();
      setNotes(json.data);
    } catch (err) {
      console.error("Lỗi fetch:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Thay đổi form
  const handleChange = (e:any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Tạo hoặc cập nhật
  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.date) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/manage/${editingId}` : "/api/manage";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // Reset form
      setFormData({ title: "", content: "", date: "" });
      setEditingId(null);

      fetchNotes();
    } catch (err) {
      console.error("Lỗi lưu:", err);
    }
  };

  // Xóa ghi chú
  const handleDelete = async (id:any) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await fetch(`/api/manage/${id}`, { method: "DELETE" });
      fetchNotes();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  // Đẩy dữ liệu lên form khi bấm Sửa
  const handleEdit = (note:any) => {
    setEditingId(note.id);
    setFormData({
      title: note.title,
      content: note.content,
      date: note.date,
    });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white p-6">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 text-green-400 text-4xl font-extrabold drop-shadow-lg">
          <FaRegCalendarAlt />
          <p>Quản Lý Ghi Chú</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl mb-10 max-w-xl">
        <p className="text-xl font-bold mb-4">{editingId ? "Sửa Ghi Chú" : "Thêm Ghi Chú Mới"}</p>

        <input
          className="w-full mb-3 p-2 rounded bg-neutral-700 outline-none"
          placeholder="Tiêu đề"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        <textarea
          className="w-full mb-3 p-2 rounded bg-neutral-700 outline-none"
          placeholder="Nội dung"
          name="content"
          value={formData.content}
          onChange={handleChange}
        />

        <input
          type="date"
          className="w-full mb-4 p-2 rounded bg-neutral-700 outline-none"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <button
          onClick={handleSave}
          className="px-5 py-2 bg-green-400 text-black font-semibold rounded-full hover:bg-green-300 transition shadow-lg hover:scale-105"
        >
          {editingId ? "Cập Nhật" : "Thêm Mới"}
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 px-4">
        {loading ? (
          <p className="text-center col-span-3">Đang tải...</p>
        ) : notes.length === 0 ? (
          <p className="text-center col-span-3 text-neutral-400">Chưa có ghi chú nào.</p>
        ) : (
          notes.map((note:any) => (
            <div
              key={note.id}
              className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition duration-300 ease-out"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-xl font-bold text-green-300">
                  <FaRegCalendarAlt />
                  <span>{note.title}</span>
                </div>
                <FaStar className="text-yellow-300 text-xl drop-shadow-md" />
              </div>

              {/* Content */}
              <div className="text-sm text-neutral-300 leading-6">
                <p className="font-semibold text-white">Nội dung:</p>
                <p className="mb-3">{note.content}</p>

                <p className="font-semibold text-white">Ngày tạo:</p>
                <p>{note.date}</p>
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-5">
                <button
                  onClick={() => handleEdit(note)}
                  className="px-3 py-1 bg-green-500 rounded-lg hover:bg-green-400 text-black font-semibold text-sm shadow-md hover:scale-105 transition"
                >
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(note.id)}
                  className="px-3 py-1 bg-red-500 rounded-lg hover:bg-red-400 text-white font-semibold text-sm shadow-md hover:scale-105 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Manage;

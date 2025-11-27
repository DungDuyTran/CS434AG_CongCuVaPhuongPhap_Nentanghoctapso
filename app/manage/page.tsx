        "use client";

        import React from "react";
        import { FaRegCalendarAlt, FaStar } from "react-icons/fa";

        const Manage = () => {
        const items = [
            { title: "Ghi Chú 1", content: "Học UML, vẽ use case.", date: "19/11/2025" },
            { title: "Ghi Chú 2", content: "Phân tích dự án xây dựng.", date: "18/11/2025" },
            { title: "Ghi Chú 3", content: "Ôn lịch sử thi.", date: "17/11/2025" },
        ];

        return (
            <div className="w-full min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black text-white p-6">

            {/* Header */}
            <div className="flex flex-col items-center mb-8">
                <div className="flex items-center gap-3 text-green-400 text-4xl font-extrabold drop-shadow-lg">
                <FaRegCalendarAlt />
                <p>Quản Lý Ghi Chú</p>
                </div>

                
            </div>
            <div className="flex flex-col items-start mb-8">
        

        <button className="mt-4 px-5 py-2 bg-green-400 text-black font-semibold rounded-full hover:bg-green-300 transition shadow-lg hover:scale-105">
            + Thêm Ghi Chú Mới
        </button>
        </div>
            

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 px-4">
                {items.map((note, index) => (
                <div
                    key={index}
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
                    <button className="px-3 py-1 bg-purple-600 rounded-lg hover:bg-purple-500 text-white font-semibold text-sm shadow-md hover:scale-105 transition">
                        Xem
                    </button>
                    <button className="px-3 py-1 bg-green-500 rounded-lg hover:bg-green-400 text-black font-semibold text-sm shadow-md hover:scale-105 transition">
                        Sửa
                    </button>
                    <button className="px-3 py-1 bg-red-500 rounded-lg hover:bg-red-400 text-white font-semibold text-sm shadow-md hover:scale-105 transition">
                        Xóa
                    </button>
                    </div>
                </div>
                ))}
            </div>

            </div>
        );
        };

        export default Manage;

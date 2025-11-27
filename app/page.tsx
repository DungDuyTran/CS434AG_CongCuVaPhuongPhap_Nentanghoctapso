"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      
      {/* Nút Lịch học */}
      <div>
        <button
          onClick={() => router.push("/calender/schedulePage")}
          className="bg-green-600 hover:bg-green-700 text-white mb-5 w-[120px] h-[50px]"
        >
          Lịch học
        </button>
      </div>

      {/* ⭐ Nút Lịch thi */}
      <div>
        <button
          onClick={() => router.push("/lichThi")}
          className="bg-rose-600 hover:bg-rose-700 text-white mb-5 w-[120px] h-[50px]"
        >
          Lịch thi
        </button>
      </div>

      {/* Nút Thống kê */}
      <div>
        <button
          onClick={() => router.push("/calender/schedulePage")}
          className="bg-blue-600 hover:bg-blue-700 text-white mb-5 w-[120px] h-[50px]"
        >
          Thống kê
        </button>
      </div>

    </div>
  );
}

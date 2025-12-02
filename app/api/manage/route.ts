import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { z } from "zod";

// Schema kiểm tra dữ liệu
const NoteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  date: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    const total = await prisma.note.count();
    const totalPages = Math.ceil(total / limit);

    const data = await prisma.note.findMany({
      orderBy: { id: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(
      {
        data,
        extraInfo: { total, totalPages, page, limit },
      },
      { status: 200 }
    );
    
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = NoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const note = await prisma.note.create({
      data: parsed.data,
    });

    return NextResponse.json(note, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.note.deleteMany();
    return NextResponse.json({ message: "Đã xóa tất cả ghi chú." });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = params;

  try {
    const userId = Number(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID người dùng không hợp lệ" },
        { status: 400 }
      );
    }

    const data = await prisma.user_KyThi.findMany({
      where: { userId },
      include: {
        user: true,
        kyThi: {
          include: {
            kyThiMonHoc: {
              include: {
                monHoc: true,
              },
            },
            lichSuThi: true,
          },
        },
      },
    });

    if (data.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy kỳ thi cho người dùng này" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = params;
  const { searchParams } = new URL(req.url);
  const kyThiId = Number(searchParams.get("kyThiId"));

  try {
    const userId = Number(id);
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: "ID người dùng không hợp lệ" },
        { status: 400 }
      );
    }

    if (isNaN(kyThiId)) {
      return NextResponse.json(
        { error: "ID kỳ thi không hợp lệ" },
        { status: 400 }
      );
    }

    const deleted = await prisma.user_KyThi.delete({
      where: {
        userId_kyThiId: {
          userId,
          kyThiId,
        },
      },
    });

    return NextResponse.json(
      { data: deleted, message: "Xóa kỳ thi thành công" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Không tìm thấy hoặc xảy ra lỗi khi xóa", details: String(error) },
      { status: 404 }
    );
  }
}

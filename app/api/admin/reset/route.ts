import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { isAuthorizedAdminRequest } from "@/lib/adminAuth";
import { TcyCustomer } from "@/models/Tcycustomer";
import { TcyCounter, resetCounter } from "@/models/Tcycounter";

export async function POST(req: NextRequest) {
  if (!isAuthorizedAdminRequest(req)) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();

    await TcyCustomer.deleteMany({});
    await TcyCounter.deleteMany({ _id: "voucher" });
    await resetCounter("voucher", 50000);

    return NextResponse.json({
      success: true,
      message: "Customer data cleared and voucher counter reset to 50005.",
      nextVoucher: 50000,
    });
  } catch (err) {
    console.error("POST /api/admin/reset error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to reset data." },
      { status: 500 }
    );
  }
}

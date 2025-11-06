import { NextRequest, NextResponse } from "next/server";
import Instagram from "../../../utility/data/instagram";

export async function POST(req: NextRequest) {
  return NextResponse.json(Instagram);
}

import { NextRequest, NextResponse } from "next/server";
import DealSlider from "../../../utility/data/dealslider";

export async function POST(req: NextRequest) {
  return NextResponse.json(DealSlider);
}

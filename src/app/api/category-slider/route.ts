import { NextRequest, NextResponse } from "next/server";
import CategorySlider from "../../../utility/data/categoryslider";

export async function POST(req: NextRequest) {
  return NextResponse.json(CategorySlider);
}

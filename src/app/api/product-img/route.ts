import { NextRequest, NextResponse } from "next/server";
import CategorySlider from "../../../utility/data/productsphoto";

export async function POST(req: NextRequest) {
  return NextResponse.json(CategorySlider);
}

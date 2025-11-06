import { NextRequest, NextResponse } from "next/server";
import BlogSlider from "../../../utility/data/blogslider";

export async function POST(req: NextRequest) {
  return NextResponse.json(BlogSlider);
}

import { NextRequest, NextResponse } from "next/server";
import Product from "../../../utility/data/allarrivals";

export async function POST(req: NextRequest) {
  return NextResponse.json(Product);
}

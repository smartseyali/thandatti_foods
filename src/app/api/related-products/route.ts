import { NextRequest, NextResponse } from "next/server";
import RelatedProducts from "../../../utility/data/relatedproducts";

export async function POST(req: NextRequest) {
  return NextResponse.json(RelatedProducts);
}

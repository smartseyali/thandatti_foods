import { NextRequest, NextResponse } from "next/server";
import RelatedItem from "../../../utility/data/relateditem";

export async function POST(req: NextRequest) {
  return NextResponse.json(RelatedItem);
}

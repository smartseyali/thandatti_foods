import { NextRequest, NextResponse } from "next/server";
import Color from "../../../utility/data/allarrivals";
import _ from "lodash"

export async function POST(req: NextRequest) {

  const ColorItems = Color;
  const groupedByColor = _.groupBy(ColorItems, "color");

  const result = _.map(groupedByColor, (items: string, key: any) => ({
    color: key,
    count: items.length
  }));
  return NextResponse.json(result);
}

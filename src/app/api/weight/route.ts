import { NextRequest, NextResponse } from "next/server";
import Weight from "../../../utility/data/allarrivals";
import _ from "lodash"

export async function POST(req: NextRequest) {

  const WeightItems = Weight;
  const groupedByWeight = _.groupBy(WeightItems, "weight");

  const result = _.map(groupedByWeight, (items: string, key: any) => ({
    weight: key,
    count: items.length 
  }));
  return NextResponse.json(result);
}

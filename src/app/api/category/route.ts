import { NextRequest, NextResponse } from "next/server";
import Category from "../../../utility/data/allarrivals";
import _ from "lodash"

export async function POST(req: NextRequest) {

  const CategoryItems = Category;

  const groupedByCategory = _.groupBy(CategoryItems, "category");

  const result = _.map(groupedByCategory, (items: string, key: any) => ({
    category: key,
    count: items.length
  }));
  return NextResponse.json(result);
}

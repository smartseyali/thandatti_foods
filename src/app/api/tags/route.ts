import { NextRequest, NextResponse } from "next/server";
import Tag from "../../../utility/data/allarrivals";
import _ from "lodash"

export async function POST(req: NextRequest) {

  const TagItems = Tag;
  const groupedByTag = _.groupBy(TagItems, "tag");

  const result = _.map(groupedByTag, (items: string, key: any) => ({
    Tag: key,
    count: items.length 
  }));
  return NextResponse.json(result);
}

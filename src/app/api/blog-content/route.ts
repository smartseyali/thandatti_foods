import { NextRequest, NextResponse } from "next/server";
import Blog from "../../../utility/data/blogcontent";

export async function POST(req: NextRequest) {
  const { page, limit, selectedCategory } = await req.json();

  const currentPage = parseInt(page, 10) || 1;
  const itemsPerPage = parseInt(limit, 10) || 6;
  const categories = selectedCategory || [];
  let filteredData = Blog;

  if (categories.length > 0) {
    filteredData = filteredData.filter((item) =>
      categories.includes(item.category)
    );
  }
  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return NextResponse.json({
    data: paginatedData,
    totalItems,
    totalPages,
  });
}

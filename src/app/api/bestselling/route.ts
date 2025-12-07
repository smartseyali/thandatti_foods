import { NextRequest, NextResponse } from "next/server";
import { productApi, mapProductToFrontend } from "@/utils/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100;

    // Fetch products from backend API
    // We fetch a larger set to sort and filter essentially
    const productResponse = await productApi.getAll({
        limit: 1000 
    });

    // Handle both array response and object with pagination
    let products: any[] = [];
    if (Array.isArray(productResponse)) {
      products = productResponse;
    } else if (productResponse && productResponse.products) {
      products = productResponse.products;
    }

    // Map backend format to frontend format
    const mappedProducts = products
      .map((product: any) => {
        return mapProductToFrontend(product, product.images || []);
      })
      .filter((product: any) => product !== null);

    // Sort by rating desc as a proxy for Best Selling if specific count not available
    // Also ensuring high quantity products are preferred if ratings are equal
    mappedProducts.sort((a: any, b: any) => {
        if (b.rating !== a.rating) {
            return b.rating - a.rating;
        }
        return (a.newPrice || 0) - (b.newPrice || 0); // stable sort
    });

    return NextResponse.json(mappedProducts);
  } catch (error: any) {
    console.error("Error fetching bestselling products:", error);
    return NextResponse.json([], { status: 200 });
  }
}

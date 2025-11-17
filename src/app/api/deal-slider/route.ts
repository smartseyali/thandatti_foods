import { NextRequest, NextResponse } from "next/server";
import { productApi, mapProductToFrontend } from "@/utils/api";

async function getDealProducts() {
  try {
    // Fetch products with sale tags from backend API
    const productResponse = await productApi.getAll({
      page: 1,
      limit: 20,
      status: 'In Stock',
    });

    // Handle both array response and object with pagination
    let products: any[] = [];
    if (Array.isArray(productResponse)) {
      products = productResponse;
    } else if (productResponse && productResponse.products) {
      products = productResponse.products;
    }

    // Filter products with sale tags and map to frontend format
    const dealProducts = products
      .filter((product: any) => product.sale_tag && product.sale_tag !== '')
      .slice(0, 10)
      .map((product: any) => {
        return mapProductToFrontend(product, product.images || []);
      })
      .filter((product: any) => product !== null);

    return dealProducts;
  } catch (error: any) {
    console.error("Error fetching deal products:", error);
    // Fallback to empty array on error
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const dealProducts = await getDealProducts();
    return NextResponse.json(dealProducts, { status: 200 });
  } catch (error: any) {
    console.error("Error in deal-slider POST:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const dealProducts = await getDealProducts();
    return NextResponse.json(dealProducts, { status: 200 });
  } catch (error: any) {
    console.error("Error in deal-slider GET:", error);
    return NextResponse.json([], { status: 200 });
  }
}

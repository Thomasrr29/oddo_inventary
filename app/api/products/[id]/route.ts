import { NextRequest, NextResponse } from 'next/server';
import { odooClient } from '@/lib/odoo/client';

// GET /api/products/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const response = await odooClient.searchRead('product.product', [['id', '=', id]], {})

    if (!response) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Producto no encontrado',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response,
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Error al obtener el producto',
        },
      },
      { status: 500 }
    );
  }
}

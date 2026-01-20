import { NextRequest, NextResponse } from 'next/server';
import type { ProductCategory } from '@/types/product';
import { odooClient } from '@/lib/odoo/client';

// GET /api/categories
export async function GET(request: NextRequest) {
  try {
    // TODO: Implementar llamada real a la API de Odoo
    // const categories = await fetchCategoriesFromOdoo();

    // Datos de ejemplo mientras se implementa la conexión a Odoo
    const response = await odooClient.searchRead('product.category', [], {})

    if(!response){
      return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT FOUND CATEGORIES',
          message: 'Categorias no encontradas',
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
    console.error('Error fetching categories:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Error al obtener categorías',
        },
      },
      { status: 500 }
    );
  }
}

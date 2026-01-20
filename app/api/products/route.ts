import { NextRequest, NextResponse } from 'next/server';
import { odooClient } from '@/lib/odoo/client';

// GET /api/products
// Parámetros de query: page, pageSize, category, search, sortBy, sortOrder, featured, inStock
export async function GET(request: NextRequest) {

  try {

    const searchParams = request.nextUrl.searchParams;

    // Extraer parámetros de query

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const category = searchParams.get('category');

    // Construir el dominio de búsqueda para Odoo
    const domain: any[] = [];

    // Filtrar solo productos que se pueden vender
    domain.push(['sale_ok', '=', true]);

    if (category && category !== 'Todos') {
      // Soportar múltiples categorías separadas por coma
      const categories = category.split(',').map(c => c.trim()).filter(c => c);

      if (categories.length === 1) {
        domain.push(['categ_id.name', 'ilike', categories[0]]);
      } else if (categories.length > 1) {
        // En Odoo, para hacer OR entre condiciones usamos el operador '|'
        // Para N condiciones OR, necesitamos N-1 operadores '|' al inicio
        for (let i = 0; i < categories.length - 1; i++) {
          domain.push('|');
        }
        categories.forEach(cat => {
          domain.push(['categ_id.name', 'ilike', cat]);
        });
      }
    }

    // Campos específicos para evitar traer datos innecesarios (especialmente imágenes pesadas)
    const fields = [
      'id',
      'display_name',
      'product_tmpl_id',
      'lst_price',
      'list_price',
      'description_sale',
      'categ_id',
      'qty_available',
      'default_code',
      'create_date',
      'write_date',
      'currency_id',
      'image_1024',
    ];

    // Execute both in parallel
    const [count, products] = await Promise.all([
      odooClient.searchCount('product.product', domain),
      odooClient.searchRead(
        'product.product',
        domain,
        {
          fields,
          limit: pageSize,
          offset: (page * pageSize) - pageSize,
          order: 'list_price DESC'
        }
      )
    ]);

    if (!products) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FETCH_ERROR',
            message: 'Error al obtener productos',
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: products,
      meta: {
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize)
      }
    });

  } catch (error) {
    console.error('Error fetching products:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Error al obtener productos',
        },
      },
      { status: 500 }
    );
  }
}

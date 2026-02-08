import { NextRequest, NextResponse } from 'next/server';
import { odooClient } from '@/lib/odoo/client';

// GET /api/taxes/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taxId = parseInt(id);

    if (isNaN(taxId)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ID',
            message: 'El ID del impuesto no es válido',
          },
        },
        { status: 400 }
      );
    }

    const response = await odooClient.read('account.tax', [taxId], [
      'id',
      'name',
      'amount_type',
      'amount',
      'description',
      'price_include',
      'type_tax_use',
    ]);

    if (!response || response.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Impuesto no encontrado',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response[0],
    });

  } catch (error) {
    console.error('Error fetching tax:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Error al obtener el impuesto',
        },
      },
      { status: 500 }
    );
  }
}

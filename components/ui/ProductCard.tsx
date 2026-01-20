'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/product';
import type { OdooProduct } from '@/types/odoo';

interface ProductCardProps {
  product: Product | OdooProduct;
}

// Type Guard to check if it's an OdooProduct
function isOdooProduct(product: Product | OdooProduct): product is OdooProduct {
  return 'lst_price' in product;
}

export default function ProductCard({ product: rawProduct }: ProductCardProps) {
  // Normalize data to a common structure (conceptually matching 'Product' interface for view)
  // We compute the display values here

  let normalizedProduct: Product;

  if (isOdooProduct(rawProduct)) {
    // Adapter logic for OdooProduct
    const imageSrc = rawProduct.image_1024
      ? `data:image/webp;base64,${rawProduct.image_1024}`
      : rawProduct.image_1920
        ? `data:image/webp;base64,${rawProduct.image_1920}`
        : rawProduct.image_512
          ? `data:image/webp;base64,${rawProduct.image_512}`
          : '';

    normalizedProduct = {
      id: rawProduct.id.toString(),
      name: rawProduct.display_name,
      description: typeof rawProduct.description_sale === 'string' ? rawProduct.description_sale : '',
      price: rawProduct.lst_price,
      currency: rawProduct.currency_id ? rawProduct.currency_id[1] : 'COP',
      images: imageSrc ? [{
        id: '1',
        url: imageSrc,
        alt: rawProduct.display_name,
        isPrimary: true,
        order: 1
      }] : [],
      category: rawProduct.categ_id ? rawProduct.categ_id[1] : '',
      stock: rawProduct.qty_available,
      sku: rawProduct.default_code,
      slug: `odoo/${rawProduct.id}`, // Custom slug for Odoo items
      createdAt: rawProduct.create_date,
      updatedAt: rawProduct.write_date,
      featured: false, // Default for now
    };
    
  } else {
    // It's already our internal Product type
    normalizedProduct = rawProduct;
  }

  const product = normalizedProduct;
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: product.currency || 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
      <div className="group relative bg-zinc-900/50 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(255,77,0,0.15)] h-full flex flex-col border border-white/5 hover:border-orange-500/30">
        {/* Badge para productos destacados */
          product.featured && (
            <div className="absolute top-4 right-4 z-20 bg-orange-600 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider skew-x-[-10deg]">
              Featured
            </div>
          )}

        {/* Badge para sin stock */}
        {product.stock <= 0 && (
          <div className="absolute top-4 left-4 z-20 bg-zinc-800 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider skew-x-[-10deg]">
            Sold Out
          </div>
        )}

        {/* Imagen del producto */}
        <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-zinc-900">
              <svg
                className="w-16 h-16 text-zinc-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
        </div>

        {/* Información del producto */}
        <div className="p-5 flex flex-col grow relative z-10 -mt-10">
          <div className="bg-zinc-900/90 backdrop-blur-md p-4 rounded-xl border border-white/5 shadow-xl flex-grow flex flex-col">
            {/* Categoría */}
            <div className="text-[10px] font-bold text-orange-500 mb-1 uppercase tracking-widest">
              {product.category}
            </div>

            {/* Nombre */}
            <h3 className="text-base font-bold text-white mb-3 line-clamp-2 leading-tight min-h-[2.5em]" title={product.name}>
              {product.name}
            </h3>

            {/* Precio y Stock */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
              <div className="flex flex-col">
                <span className="text-xs text-zinc-500 font-medium">Precio</span>
                <span className="text-xl font-bold text-white tracking-tight">
                  {formattedPrice}
                </span>
                {/* Tallas (Solo si existen) */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="text-[10px] text-zinc-400 mt-1">
                    Tallas: <span className="text-white font-medium">{product.sizes.join(', ')}</span>
                  </div>
                )}
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
                <div className="bg-white text-black p-2 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

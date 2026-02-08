'use client';
import { useEffect, useState, useRef } from 'react';
import ProductGrid from '@/components/ui/ProductGrid';
import { Product } from '@/types/product';
import { OdooProduct } from '@/types/odoo';

export default function CatalogPage() {

    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ ]);

    // Toggle category selection
    const handleCategoryToggle = (categoryName: string) => {
        setSelectedCategories(prev => {
            const newSelection = prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName];
            return newSelection;
        });
        setCurrentPage(1);
    };

    // Remove a selected category
    const handleRemoveCategory = (categoryName: string) => {
        setSelectedCategories(prev => prev.filter(c => c !== categoryName));
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const categoryParam = selectedCategories.length > 0 ? selectedCategories.join(',') : 'Todos';
                const response = await fetch(`/api/products?page=${currentPage}&category=${categoryParam}`);
                const result = await response.json();

                if (result.success) {
                    const rawProducts: OdooProduct[] = result.data || [];
                    setTotalPages(result.meta?.totalPages || 1);

                    // Recoger los tax IDs únicos de todos los productos
                    const uniqueTaxIds = new Set<number>();
                    rawProducts.forEach(p => {
                        if (p.taxes_id) {
                            p.taxes_id.forEach(id => uniqueTaxIds.add(id));
                        }
                    });

                    // Fetch solo los tax IDs únicos (un fetch por cada ID distinto)
                    const taxCache = new Map<number, any>();
                    await Promise.all(
                        Array.from(uniqueTaxIds).map(async (taxId) => {
                            try {
                                const taxRes = await fetch(`/api/taxes/${taxId}`);
                                const taxData = await taxRes.json();
                                if (taxData.success) {
                                    taxCache.set(taxId, taxData.data);
                                }
                            } catch (e) {
                                console.error(`Error fetching tax ${taxId}:`, e);
                            }
                        })
                    );

                    // GROUPING LOGIC:
                    const groupedMap = new Map<number, OdooProduct[]>();

                    rawProducts.forEach(p => {
                        const tmplId = p.product_tmpl_id[0];
                        if (!groupedMap.has(tmplId)) {
                            groupedMap.set(tmplId, []);
                        }
                        groupedMap.get(tmplId)?.push(p);
                    });

                    // Transform Odoo groups into our 'Product' display type
                    const displayProducts: Product[] = Array.from(groupedMap.values()).map(group => {
                        const baseItem = group[0];

                        // Obtener el tax desde el cache
                        const taxId = baseItem.taxes_id?.[0];
                        const taxData = taxId ? taxCache.get(taxId) : null;
                        // Logic to extract specific "Product Name" without the variant code if possible
                        // Odoo Display Name format: "[CODE] Name (Variant)" or just "Name"
                        // We can try to use product_tmpl_id[1] which is the Template Name!
                        const templateName = baseItem.product_tmpl_id[1];
                        // Extract sizes from all variants in the group
                        const sizes = group.map(item => {
                            // Regex to find content inside parentheses at the end of the string
                            // User example: "[REF] NAME (6)" -> "6"
                            const match = item.display_name.match(/\(([^)]+)\)$/);
                            return match ? match[1] : null;
                        }).filter((size): size is string => size !== null); // Filter out nulls

                        // Deduplicate sizes and sort roughly (numeric if possible)
                        const uniqueSizes = Array.from(new Set(sizes)).sort((a, b) => {
                            const numA = parseFloat(a);
                            const numB = parseFloat(b);
                            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                            return a.localeCompare(b);
                        });

                        const imageSrc = baseItem.image_1024
                            ? `data:image/webp;base64,${baseItem.image_1024}`
                            : '';

                        return {
                            id: baseItem.id.toString(),
                            name: templateName || baseItem.display_name,
                            description: typeof baseItem.description_sale === 'string' ? baseItem.description_sale : '',
                            price: baseItem.lst_price + (baseItem.lst_price / 100 * taxData.amount),
                            currency: baseItem.currency_id ? baseItem.currency_id[1] : 'COP',
                            images: imageSrc ? [{
                                id: '1',
                                url: imageSrc,
                                alt: templateName,
                                isPrimary: true,
                                order: 1
                            }] : [],
                            category: baseItem.categ_id ? baseItem.categ_id[1] : 'General',
                            stock: group.reduce((sum, item) => sum + item.qty_available, 0),
                            sku: baseItem.default_code,
                            slug: `odoo/${baseItem.id}`,
                            createdAt: baseItem.create_date,
                            updatedAt: baseItem.write_date,
                            featured: false,
                            sizes: uniqueSizes,
                        };
                    });

                    setProducts(displayProducts);
                }

            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [currentPage, selectedCategories]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const result = await response.json();
                setCategories(result.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [])

    return (
        <div className="min-h-screen bg-zinc-950 text-white pt-24 pb-20">
            <div className="container mx-auto px-6">
                {/* Header del Catálogo */}
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-5xl md:text-7xl font-bold font-display uppercase italic tracking-tighter mb-4">
                        CATÁLOGO
                        <span className="text-orange-500 text-6xl md:text-8xl ml-2">.</span>
                    </h1>
                    <p className="text-zinc-400 text-xl max-w-2xl">
                        Explora nuestra colección completa. El equipamiento que necesitas para dar el siguiente paso.
                    </p>
                </div>

                {/* Filtros */}
                <div className="mb-12 border-b border-zinc-800 pb-6">
                    {/* Dropdown de categorías */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-6 py-3 bg-zinc-900 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors"
                            >
                                <span>Seleccionar categorías</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                                    {categories.map((cat, index) => (
                                        <label
                                            key={index}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.display_name)}
                                                onChange={() => handleCategoryToggle(cat.display_name)}
                                                className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-orange-500 focus:ring-orange-500 focus:ring-offset-zinc-900"
                                            />
                                            <span className="text-sm text-zinc-300 font-semibold">{cat.display_name.toUpperCase()}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Categorías seleccionadas como chips */}
                        {selectedCategories.length === 0 ? (
                            <span className="text-zinc-500 text-sm">Mostrando todos los productos</span>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {selectedCategories.map((cat) => (
                                    <span
                                        key={cat}
                                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-black rounded-full text-sm font-bold uppercase"
                                    >
                                        {cat}
                                        <button
                                            onClick={() => handleRemoveCategory(cat)}
                                            className="hover:bg-orange-600 rounded-full p-0.5 transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                                <button
                                    onClick={() => setSelectedCategories([])}
                                    className="px-4 py-2 bg-zinc-800 text-zinc-400 rounded-full text-sm font-bold uppercase hover:bg-zinc-700 hover:text-white transition-colors"
                                >
                                    Limpiar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="w-full h-96 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
                    </div>
                ) : (
                    <>
                        <ProductGrid products={products} />

                        {/* Pagination */}
                        <div className="mt-20 flex justify-center items-center gap-6">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-6 py-3 bg-zinc-900 rounded-full text-sm font-bold uppercase hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>

                            <span className="text-zinc-400 font-mono">
                                <span className="text-white font-bold">{currentPage}</span> / {totalPages}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-6 py-3 bg-white text-black rounded-full text-sm font-bold uppercase hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Siguiente
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

'use client';

import { motion } from 'framer-motion';

const BRANDS = [
    { name: 'NIKE', id: 1, logo: '/nike.webp' },
    { name: 'ADIDAS', id: 2, logo: '/adidas.webp' },
    { name: 'PUMA', id: 3, logo: '/puma.webp' },
    { name: 'UNDER ARMOUR', id: 4, logo: '/under.webp' },
    { name: 'NEW BALANCE', id: 6, logo: '/new_balance.webp' },
    { name: 'SKECHERS', id: 7, logo: '/skechers.webp' },
];

export default function Brands() {
    return (
        <section className="py-24 bg-zinc-900 border-y border-zinc-800 overflow-hidden">
            <div className="container mx-auto px-6 mb-12 text-center">
                <h3 className="text-zinc-500 uppercase tracking-widest text-sm font-semibold">
                    Marcas que caminan contigo
                </h3>
            </div>

            <div className="relative flex overflow-x-hidden">
                <motion.div
                    className="flex whitespace-nowrap gap-16 md:gap-32 items-center animate-marquee"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                >
                    {/* Double the list for seamless loop */}
                    {[...BRANDS, ...BRANDS].map((brand, index) => (
                        <div
                            key={`${brand.id}-${index}`}
                            className="flex items-center justify-center min-w-[200px] h-32 md:min-w-[240px] md:h-40"
                        >
                            <img
                                src={brand.logo}
                                alt={brand.name}
                                className="h-full w-auto object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

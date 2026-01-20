'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();

    // Parallax effects
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black text-white">
            {/* Background Image - Lifestyle/Urban */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                <motion.div
                    style={{ y: y1 }}
                    className="w-full h-[120%] -mt-[10%]"
                >
                    {/* Placeholder for "Imagen lifestyle poderosa" */}
                    <img
                        src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop"
                        alt="Lifestyle background"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">

                {/* Logo/Brand (Optional small header) */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute top-24 md:top-32 uppercase tracking-[0.2em] text-sm font-medium"
                >
                    Essential
                </motion.div>

                {/* Main Title */}
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="text-[12vw] leading-none font-bold font-heading tracking-tighter mix-blend-overlay"
                    >
                        DA EL PASO
                    </motion.h1>
                </div>

                {/* Subtitle / Copy */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="mt-6 text-xl md:text-2xl font-light max-w-lg mx-auto text-white/90"
                >
                    Cada elección puede cambiar tu camino.
                </motion.p>

                {/* Scroll CTA */}
                <motion.div
                    style={{ opacity }}
                    className="absolute bottom-12 flex flex-col items-center gap-2"
                >
                    <span className="text-xs uppercase tracking-widest opacity-70">Explorar</span>
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-px h-12 bg-linear-to-b from-white to-transparent"
                    />
                </motion.div>
            </div>
        </section>
    );
}

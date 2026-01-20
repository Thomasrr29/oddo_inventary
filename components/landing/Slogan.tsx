'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Slogan() {
    return (
        <section className="py-20 md:py-40 bg-orange-600 overflow-hidden relative flex flex-col items-center justify-center min-h-[50vh] md:min-h-[80vh]">
            {/* Texture overlay for grit */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

            <div className="relative z-10 flex flex-col items-center text-center w-full px-4">

                {/* 1. Top Text */}
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="font-sans font-bold uppercase tracking-[0.2em] md:tracking-[0.5em] text-white/90 text-sm md:text-2xl mb-4 md:mb-8"
                >
                    No esperes el momento
                </motion.span>

                {/* 2. Main Title */}
                <motion.h2
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-heading font-black text-white text-[15vw] md:text-[min(12vw,160px)] leading-[0.8] tracking-tighter drop-shadow-2xl"
                >
                    DA EL PASO
                </motion.h2>

                {/* 3. Sticker (Sticky Box) */}
                <motion.div
                    initial={{ rotate: -15, scale: 0, opacity: 0 }}
                    whileInView={{ rotate: -3, scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    viewport={{ once: true }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.4
                    }}
                    className="mt-8 md:-mt-10 relative z-20"
                >
                    <div className="bg-yellow-400 text-black font-heading font-bold text-2xl md:text-5xl px-8 py-4 md:px-12 md:py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
                        CAMINA HACIA ÉL
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

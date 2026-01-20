'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Closing() {
    return (
        <section className="relative h-[80vh] flex flex-col items-center justify-center bg-zinc-950 text-white overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-zinc-900 to-zinc-950 z-0" />

            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center gap-10">

                <div className="flex flex-col items-center gap-2 overflow-hidden">
                    <motion.h2
                        initial={{ y: 100 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-light text-zinc-400 font-sans tracking-wide"
                    >
                        No es solo lo que usas
                    </motion.h2>

                    <motion.div className="overflow-hidden">
                        <motion.h2
                            initial={{ y: 100 }}
                            whileInView={{ y: 0 }}
                            transition={{ duration: 0.8, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
                            viewport={{ once: true }}
                            className="text-6xl md:text-9xl font-black font-heading tracking-tighter text-white uppercase"
                        >
                            ES HACIA DÓNDE VAS
                        </motion.h2>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                >
                    <Link href="/catalogo">
                        <button className="group relative flex items-center gap-4 px-10 py-5 bg-white text-black text-xl md:text-2xl font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:bg-zinc-200">
                            <span>VER CATÁLOGO</span>
                            <div className="relative overflow-hidden w-6 h-6">
                                <motion.div
                                    className="absolute inset-0"
                                    initial={{ x: 0 }}
                                    whileHover={{ x: 24 }} // Moves out to right
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </motion.div>
                                <motion.div
                                    className="absolute inset-0 -translate-x-full"
                                    initial={{ x: -24 }}
                                    whileHover={{ x: 0 }} // Moves in from left
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRight className="w-6 h-6" />
                                </motion.div>
                            </div>
                        </button>
                    </Link>
                </motion.div>

            </div>
        </section>
    );
}

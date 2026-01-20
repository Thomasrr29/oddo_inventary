'use client';

import { motion } from 'framer-motion';

export default function Purpose() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const }
        }
    };

    return (
        <section className="py-32 px-6 bg-zinc-950 text-white overflow-hidden">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                {/* Copy / Manifesto */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={containerVariants}
                    className="relative z-10"
                >
                    <motion.h2 variants={itemVariants} className="text-5xl md:text-7xl font-bold font-heading mb-12 tracking-tight">
                        NO VENDEMOS <br />
                        <span className="text-zinc-500">SOLO CALZADO</span>
                    </motion.h2>

                    <div className="space-y-8 text-xl md:text-2xl font-light text-zinc-300">
                        <motion.p variants={itemVariants}>
                            Vendemos decisiones. Momentos. Primeros pasos.
                        </motion.p>
                        <motion.p variants={itemVariants}>
                            Esa gorra puede acompañarte en una cita importante.
                            Esos tenis pueden ser los que te lleven a tu primera maratón.
                        </motion.p>
                        <motion.p variants={itemVariants} className="text-white font-medium">
                            Todo gran cambio empieza con un paso.
                        </motion.p>
                    </div>
                </motion.div>

                {/* Organic Collage */}
                <div className="relative h-[600px] w-full hidden md:block">
                    {/* Image 1 - Top Right */}
                    <motion.div
                        initial={{ opacity: 0, rotate: 6, x: 50 }}
                        whileInView={{ opacity: 1, rotate: 3, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="absolute top-0 right-10 w-64 h-80 bg-zinc-800 rotate-3 z-10 overflow-hidden rounded-lg shadow-2xl"
                    >
                        <img src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Momentos" />
                    </motion.div>

                    {/* Image 2 - Center Left */}
                    <motion.div
                        initial={{ opacity: 0, rotate: -6, x: -50 }}
                        whileInView={{ opacity: 1, rotate: -3, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="absolute top-32 left-10 w-72 h-96 bg-zinc-800 -rotate-3 z-20 overflow-hidden rounded-lg shadow-2xl"
                    >
                        <img src="https://images.unsplash.com/photo-1546502208-81d149d52bd7?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover opacity-90" alt="Primeros pasos" />
                    </motion.div>

                    {/* Image 3 - Bottom Right */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="absolute bottom-10 right-20 w-56 h-56 bg-zinc-800 rotate-6 z-30 overflow-hidden rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
                    >
                        <img src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="Decisiones" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

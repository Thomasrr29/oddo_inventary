'use client';

import { motion } from 'framer-motion';

const BENEFITS = [
    {
        title: "100% ORIGINAL",
        color: "bg-orange-600",
        text_color: "text-white",
        rotate: -2,
        desc: "Autenticidad verificada en cada par."
    },
    {
        title: "ENVÍO SEGURO",
        color: "bg-white",
        text_color: "text-black",
        rotate: 1,
        desc: "Tu pedido llega o te devolvemos el dinero."
    },
    {
        title: "ESTILOS ÚNICOS",
        color: "bg-zinc-800",
        text_color: "text-white",
        rotate: -1,
        desc: "Curaduría exclusiva de las mejores marcas."
    },
    {
        title: "GARANTÍA TOTAL",
        color: "bg-yellow-400",
        text_color: "text-black",
        rotate: 2,
        desc: "30 días para cambios sin preguntas."
    }
];

export default function Guarantee() {
    return (
        <section className="py-32 bg-zinc-950 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {BENEFITS.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50, rotate: 0 }}
                            whileInView={{ opacity: 1, y: 0, rotate: item.rotate }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                            className={`${item.color} ${item.text_color} p-8 rounded-sm shadow-xl flex flex-col justify-between h-64 md:h-80 transform transition-all cursor-default border-2 border-black/10`}
                        >
                            <div className="text-4xl md:text-5xl font-black font-heading leading-tight break-words">
                                {item.title}
                            </div>
                            <div className="font-medium text-lg opacity-80 border-t border-current pt-4">
                                {item.desc}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

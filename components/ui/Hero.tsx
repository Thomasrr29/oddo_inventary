'use client';

import { useState, useEffect } from 'react';

export default function Hero() {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ['AUTENTICIDAD', 'ESTILO', 'CALIDAD', 'CONFIANZA'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="container mx-auto px-6 pt-20 pb-16 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Headline */}
          <div className="mb-8 overflow-hidden">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 leading-tight">
              ESSENTIAL
            </h1>
            <p className="text-2xl md:text-4xl font-light text-gray-400 tracking-wider">
              DA EL PASO
            </p>
          </div>

          {/* Animated Subtitle */}
          <div className="h-20 md:h-24 mb-12 flex items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-semibold text-gray-400 transition-all duration-500">
              CON{' '}
              <span className="text-orange-500 inline-block transition-all duration-500">
                {words[currentWord]}
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Calzado, morrales y accesorios de las mejores marcas.
            <span className="block mt-2 text-orange-500 font-semibold">100% Originales</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 font-semibold text-lg">
              <span className="flex items-center gap-2">
                Ver Catálogo
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>

            <button className="px-8 py-4 bg-transparent border-2 border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all font-semibold text-lg">
              Explorar Categorías
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">7</div>
              <div className="text-gray-400 font-medium">Marcas</div>
            </div>
            <div className="text-center border-x border-zinc-800">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">100%</div>
              <div className="text-gray-400 font-medium">Originales</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">✓</div>
              <div className="text-gray-400 font-medium">Garantía</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-zinc-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

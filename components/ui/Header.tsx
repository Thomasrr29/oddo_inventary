'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 py-4'
          : 'bg-transparent py-6'
        }`}
    >
      <nav className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-1">
            <div className="text-2xl font-black italic tracking-tighter text-white group-hover:text-orange-500 transition-colors duration-300">
              ESSENTIAL
            </div>
            <div className="h-2 w-2 bg-orange-500 rounded-full mt-1 group-hover:bg-white transition-colors duration-300" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { name: 'Inicio', path: '/' },
              { name: 'Catálogo', path: '/catalogo' },
              { name: 'Nosotros', path: '/nosotros' }, // Assuming section or page exists
            ].map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-bold uppercase tracking-widest hover:text-orange-500 transition-all relative group ${isActive(link.path) ? 'text-white' : 'text-zinc-500'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-300 group-hover:w-full ${isActive(link.path) ? 'w-full' : ''}`} />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/catalogo">
              <button className="px-6 py-2 bg-white text-black text-sm font-black italic tracking-wider hover:bg-orange-500 hover:text-white transition-all duration-300 skew-x-[-10deg] transform hover:scale-105">
                DA EL PASO
              </button>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-full h-0.5 bg-current transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-zinc-800 p-6 flex flex-col gap-6 md:hidden">
            <Link
              href="/catalogo"
              className="text-2xl font-black italic text-zinc-300 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              CATÁLOGO
            </Link>
            <Link
              href="/nosotros"
              className="text-2xl font-black italic text-zinc-300 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              NOSOTROS
            </Link>
            <Link
              href="/contacto"
              className="text-2xl font-black italic text-zinc-300 hover:text-orange-500"
              onClick={() => setIsMenuOpen(false)}
            >
              CONTACTO
            </Link>
            <button className="w-full py-4 bg-orange-500 text-white font-black italic tracking-wider hover:bg-white hover:text-black transition-all">
              DA EL PASO
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

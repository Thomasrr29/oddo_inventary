import Hero from '@/components/landing/Hero';
import Purpose from '@/components/landing/Purpose';
import Slogan from '@/components/landing/Slogan';
import Brands from '@/components/landing/Brands';
import Guarantee from '@/components/landing/Guarantee';
import Closing from '@/components/landing/Closing';

export default function Home() {
  return (
    <main className="bg-zinc-950 min-h-screen text-white selection:bg-orange-500 selection:text-white overflow-x-hidden">
      <Hero />
      <Purpose />
      <Slogan />
      <Brands />
      <Guarantee />
      <Closing />
    </main>
  );
}

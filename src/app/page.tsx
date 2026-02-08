import Link from 'next/link';
import { Camera, Palette, Rocket } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroCarousel from '@/components/HeroCarousel';
import RecentWork from '@/components/RecentWork';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

import { getSettings } from '@/app/lib/data';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await getSettings();

  return (
    <main className="min-h-screen bg-light">
      <Navbar />

      {/* 1. Hero Carousel */}
      <HeroCarousel />

      {/* 2. Services Section (New) */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Fotografia', desc: settings.service_fotografia_desc || 'Emocje uchwycone w kadrze. Sesje biznesowe, produktowe i lifestyle.', Icon: Camera },
            { title: 'Grafika', desc: settings.service_grafika_desc || 'Projekty, które sprzedają. Branding, social media, print.', Icon: Palette },
            { title: 'Marketing', desc: settings.service_marketing_desc || 'Strategie, które działają. Social media, ads, copywriting.', Icon: Rocket },
          ].map((service, i) => (
            <div key={i} className="glass bg-white/60 p-8 rounded-3xl shadow-glass hover:transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-primary mb-4">
                <service.Icon size={48} />
              </div>
              <h3 className="text-2xl font-bold text-dark mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-6">{service.desc}</p>
              <Link href={`/oferta#${service.title.toLowerCase()}`} className="text-primary font-semibold hover:text-dark transition-colors flex items-center">
                Zobacz więcej &rarr;
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. About Section Homepage */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            {/* Mock Image */}
            <div className="aspect-[4/5] rounded-3xl bg-gray-200 overflow-hidden shadow-2xl relative z-10 group-hover:transform group-hover:scale-[1.01] transition-all duration-700">
              <img
                src="https://placehold.co/800x1000?text=Szymon"
                alt="Szymon"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute top-10 -right-10 w-full h-full border-2 border-primary/20 rounded-3xl z-0" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-primary/30 to-transparent rounded-full blur-3xl" />
          </div>

          <div>
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">O mnie</span>
            <h2 className="text-5xl lg:text-6xl font-bold text-dark mt-2 mb-8 tracking-tight">
              {settings.home_about_heading ? (
                <span dangerouslySetInnerHTML={{ __html: settings.home_about_heading.replace(/\n/g, '<br/>') }} />
              ) : (
                <>Tworzę wizerunek,<br /> który <span className="text-primary">działa.</span></>
              )}
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {settings.home_about_text || 'Cześć! Jestem Szymon. Łączę świat fotografii, designu i marketingu, aby pomagać markom opowiadać ich historie. Wierzę w minimalizm, autentyczność i siłę dobrego designu.'}
            </p>

            <div className="flex gap-4">
              <Link
                href="/o-mnie"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-dark hover:bg-primary transition-colors shadow-lg shadow-dark/20 hover:shadow-primary/30"
              >
                Poznaj mnie
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-dark bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Moje prace
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Recent Work */}
      <RecentWork />

      {/* 5. Testimonials Section */}
      <Testimonials />

      {/* 5. CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 tracking-tight">Zrealizujmy Twój <br />kolejny wielki projekt.</h2>
          <p className="text-xl mb-12 text-gray-300 max-w-2xl mx-auto">
            Od strategii, przez kreację, aż po realizację. Jesteśmy gotowi podjąć wyzwanie.
          </p>
          <Link
            href="/kontakt"
            className="inline-block bg-white text-dark font-bold py-5 px-12 rounded-full hover:bg-primary hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Rozpocznij współpracę
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

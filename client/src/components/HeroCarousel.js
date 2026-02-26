import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  { title: 'Free Fire Diamonds', subtitle: 'Top up in-game diamonds – best rates', cta: 'Buy Diamonds', to: '/products?category=free-fire-diamonds', bg: 'from-ff-orange/30 to-dark-900', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800' },
  { title: 'Free Fire Subscriptions', subtitle: 'Weekly Lite, Weekly & Monthly passes', cta: 'View passes', to: '/products?category=free-fire-subscriptions', bg: 'from-ff-gold/20 to-dark-900', img: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800' },
  { title: 'The Shield Store', subtitle: 'Your trusted Free Fire top-up partner', cta: 'Shop all', to: '/products', bg: 'from-neon-orange/25 to-dark-900', img: 'https://images.unsplash.com/photo-1611791484670-ce19b801dd1c?w=800' },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[index];
  return (
    <section className="relative rounded-2xl overflow-hidden border border-ff-orange/30 min-h-[220px] sm:min-h-[280px] md:min-h-[320px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-all duration-700`} />
      {slide.img && (
        <div className="absolute inset-0 opacity-30">
          <img src={slide.img} alt="" className="w-full h-full object-cover" aria-hidden />
        </div>
      )}
      <div className="relative flex items-center justify-between px-6 sm:px-10 md:px-16 py-10 md:py-14">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-ff-gold drop-shadow-lg">{slide.title}</h2>
          <p className="dark:text-gray-300 mt-1 text-sm sm:text-base">{slide.subtitle}</p>
          <Link to={slide.to} className="inline-block mt-4 px-5 py-2.5 bg-ff-orange text-black font-bold rounded-lg hover:bg-ff-gold hover:shadow-lg transition-all text-sm">
            {slide.cta}
          </Link>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} type="button" onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-ff-gold' : 'bg-dark-600'}`} aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}

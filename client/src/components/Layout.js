import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col dark:bg-dark-950">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main-content" className="flex-1 max-w-[1600px] mx-auto w-full px-4 py-6 md:px-6 md:py-8" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

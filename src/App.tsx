import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AssetTable from './components/AssetTable';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AssetTable />
        <Features />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

export default App;
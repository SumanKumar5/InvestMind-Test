import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import AssetTable from './components/AssetTable';
import Features from './components/Features';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Header />
            <main className="flex-grow">
              <Hero />
              <AssetTable />
              <Features />
              <Testimonials />
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
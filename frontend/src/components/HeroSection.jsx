import React, { Component } from 'react'

function HeroSection() {
  const handleStartClick = () => {
    window.location.href = '/';
  };

  return (
    <section className='bg-gradient-to-r from-blue-400 to-purple-500 py-20' id='hero-section'>
      <div className='container mx-auto px-4'>
        <div className='max-w-3x1 mx-auto text-center'>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Welcome to Smart Resume Analyzer</h1>
          <p className="text-lg md:text-xl text-white mb-8">Analyze your resume and get valuable insights to improve it.</p>
          <button

            onClick={handleStartClick} 
            className="bg-white text-blue-600 hover:bg-blue-600 hover:text-white py-3 px-8 rounded-full font-semibold shadow-lg transition duration-300"
            >
              Get Started
          </button>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

import React from 'react';
import '../assests/styles/hero.css';
import ResumeAnalysis from '../assests/images/resume-analysis.avif';

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">Optimize and Analyze Your Resume</h1>
          <p className="hero-description">Get more interviews with ResuFit. Our advanced AI algorithms help you craft the perfect resume tailored to your target job.</p>
          <button className="hero-button">Scan Your Resume</button>
        </div>
        <div className="hero-image">
          <img src={ResumeAnalysis} alt="Scanning Resume" className="hero-img" />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

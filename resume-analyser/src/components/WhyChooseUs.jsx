import React, { useState } from 'react';
import '../assests/styles/whychooseus.css';

const WhyChooseUs = () => {
  const [selectedTab, setSelectedTab] = useState(null);

  const handleTabClick = (tabId) => {
    setSelectedTab(tabId);
  };

  return (
    <section id="why-choose-us" className="why-choose-us-section">
      <div className="container">
        <div className="section-heading">Why Choose Us</div>
        <div className="feat_sidetabs">Features:</div>
        <div className="why-choose-us-content">
          <div className="why-choose-us-tabs">
            <div className="tabs">
              <div className={`tab ${selectedTab === 'tab-1' ? 'active' : ''}`} onClick={() => handleTabClick('tab-1')}>
                <span>ATS Resume Checker</span>
              </div>
              <div className={`tab ${selectedTab === 'tab-2' ? 'active' : ''}`} onClick={() => handleTabClick('tab-2')}>
                <span>Resume & Cover Letter Optimization</span>
              </div>
              <div className={`tab ${selectedTab === 'tab-3' ? 'active' : ''}`} onClick={() => handleTabClick('tab-3')}>
                <span>Resume Builder</span>
              </div>
              <div className={`tab ${selectedTab === 'tab-4' ? 'active' : ''}`} onClick={() => handleTabClick('tab-4')}>
                <span>LinkedIn Profile Optimization</span>
              </div>
            </div>
          </div>
          <div className="why-choose-us-details">
            <div className={`content ${selectedTab ? 'active' : ''}`}>
              {selectedTab === 'tab-1' && (
                <img alt="ATS Resume Checker" src="https://static.jobscan.co/blog/uploads/533x340_01_new.png" className="image" />
              )}
              {selectedTab === 'tab-2' && (
                <img alt="Resume & Cover Letter Optimization" src="https://static.jobscan.co/blog/uploads/533x340_02_new.png" className="image" />
              )}
              {selectedTab === 'tab-3' && (
                <img alt="Resume Builder" src="https://static.jobscan.co/blog/uploads/533x340_03_new.png" className="image" />
              )}
              {selectedTab === 'tab-4' && (
                <img alt="LinkedIn Profile Optimization" src="https://static.jobscan.co/blog/uploads/533x340_04_new.png" className="image" />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;

import React, { useState } from 'react';
import './LandingPage.css';
import { Plus, Heart, Cpu, Share2, Mail, Menu, X } from 'lucide-react';
import RegistrationModal from './RegistrationModal';

import heroVideo from '../assets/30TH.mp4';
import hackathonImg from '../assets/hackaton kick off.jpg';
import welcomeSpecialNeedsImg from '../assets/welcome for new division members.jpg';
import welcomeCharityImg from '../assets/welcome for new charity division members.jpg';

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#E8B00B" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L16 10H8L12 3Z" />
    <path d="M6 14L10 21H2L6 14Z" />
    <path d="M18 14L22 21H14L18 14Z" />
  </svg>
);

const LandingPage = ({ onLogin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <>
      <div className="landing-page">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo-section">
              <LogoIcon />
              <span className="logo-text">GubaeTech</span>
            </div>
            <div className="nav-links">
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#fellowship">Fellowship</a>
              <a href="#events">Events</a>
            </div>
            <div className="nav-actions">
              <button className="btn-register-nav" onClick={() => setIsModalOpen(true)}>Register</button>
              <button className="btn-login-nav" onClick={onLogin}>Login</button>
              {/* Hamburger — mobile only */}
              <button
                className="btn-hamburger"
                onClick={() => setIsMobileNavOpen(prev => !prev)}
                aria-label="Toggle menu"
              >
                {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {isMobileNavOpen && (
            <div className="mobile-nav">
              <a href="#home" onClick={closeMobileNav}>Home</a>
              <a href="#about" onClick={closeMobileNav}>About</a>
              <a href="#fellowship" onClick={closeMobileNav}>Fellowship</a>
              <a href="#events" onClick={closeMobileNav}>Events</a>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section id="home" className="hero-section">
          <div className="hero-content">
            <span className="hero-badge">ASTU GIBI GUBAE</span>
            <h1 className="hero-title">
              Connecting <span className="text-yellow">ASTU</span> Believers
            </h1>
            <p className="hero-subtitle">
              Welcome to GubaeTech, the digital home for ASTU Gibi Gubae. We strive to foster a strong spiritual community through technology and fellowship. Join us in our mission to grow together in faith.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>Get Started</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="hero-image"
            />
          </div>
        </section>

        {/* Mission Section */}
        <section id="about" className="mission-section">
          <h2 className="section-title">Our Fellowship Mission</h2>
          <p className="section-subtitle">
            Empowering students through spiritual growth and community support.
          </p>

          <div className="mission-cards">
            <div className="mission-card">
              <div className="icon-wrapper">
                <Plus className="card-icon" />
              </div>
              <h3 className="card-title">Spiritual Growth</h3>
              <p className="card-text">
                Deepen your faith through regular gubae sessions, spiritual mentoring, and Bible studies designed for students.
              </p>
            </div>

            <div className="mission-card">
              <div className="icon-wrapper">
                <Heart className="card-icon" />
              </div>
              <h3 className="card-title">Community Service</h3>
              <p className="card-text">
                Engage in impactful community projects and outreach programs within ASTU and the surrounding community.
              </p>
            </div>

            <div className="mission-card">
              <div className="icon-wrapper">
                <Cpu className="card-icon" />
              </div>
              <h3 className="card-title">Tech Innovation</h3>
              <p className="card-text">
                Leveraging technology to spread the gospel, manage ministry resources, and connect believers across the campus.
              </p>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section id="events" className="events-section">
          <div className="events-header">
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">
              Join us for fellowship, worship, and community building.
            </p>
          </div>

          <div className="events-grid">
            {/* Event 1 */}
            <div className="event-card">
              <div className="event-image-wrapper">
                <img src={hackathonImg} alt="AGT HUB Hackathon" className="event-image" />
                <div className="event-date-badge">
                  <span className="event-month">FEB</span>
                  <span className="event-day">28</span>
                </div>
              </div>
              <div className="event-content">
                <div className="event-meta">
                  <span className="event-time">A week long</span>
                  <span className="event-location">AGT HUB</span>
                </div>
                <h3 className="event-title">AGT HUB Hackathon</h3>
                <p className="event-description">
                  Our Talent for Our Church. Design and build Systems, Websites, and Mobile Apps. A week-long hackathon with guest judges. The Kick-Off is coming!
                </p>
                <button className="btn-event-link">Event Details</button>
              </div>
            </div>

            {/* Event 2 */}
            <div className="event-card">
              <div className="event-image-wrapper">
                <img src={welcomeSpecialNeedsImg} alt="1st Year Special Needs Welcome" className="event-image" />
                <div className="event-date-badge">
                  <span className="event-month">MAR</span>
                  <span className="event-day">05</span>
                </div>
              </div>
              <div className="event-content">
                <div className="event-meta">
                  <span className="event-time">8:30 PM (Local)</span>
                  <span className="event-location">St. Teklehaimanot Church</span>
                </div>
                <h3 className="event-title">1st Year Special Needs Welcome</h3>
                <p className="event-description">
                  Welcome program for 1st-year students featuring games, films, songs, agape, poems, begena songs, teachings, and more.
                </p>
                <button className="btn-event-link">Event Details</button>
              </div>
            </div>

            {/* Event 3 */}
            <div className="event-card">
              <div className="event-image-wrapper">
                <img src={welcomeCharityImg} alt="Charity Division Welcome" className="event-image" />
                <div className="event-date-badge">
                  <span className="event-month">MAR</span>
                  <span className="event-day">04</span>
                </div>
              </div>
              <div className="event-content">
                <div className="event-meta">
                  <span className="event-time">1:30 PM (Local)</span>
                  <span className="event-location">St. Teklehaimanot Church</span>
                </div>
                <h3 className="event-title">Charity Division Welcome</h3>
                <p className="event-description">
                  Profession and Charity overnight program for 1st years. Exploring teachings, experience sharing, agape, drama, begena songs, and games.
                </p>
                <button className="btn-event-link">Event Details</button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container">
            <h2 className="cta-title">Ready to Join Our Community?</h2>
            <p className="cta-subtitle">
              Become a part of the ASTU Gibi Gubae family today and start your journey with GubaeTech. We can't wait to welcome you.
            </p>
            <button className="btn-cta" onClick={() => setIsModalOpen(true)}>Register Now</button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <LogoIcon />
              <span className="logo-text">GubaeTech</span>
            </div>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact Us</a>
            </div>
            <div className="footer-social">
              <button className="social-btn"><Share2 size={16} /></button>
              <button className="social-btn"><Mail size={16} /></button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 GubaeTech ASTU Gibi Gubae. All rights reserved. Designed for spiritual growth through technology.</p>
          </div>
        </footer>
      </div>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default LandingPage;

import React from 'react';
import './LandingPage.css';
import { Plus, Heart, Cpu, Share2, Mail } from 'lucide-react';

const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="#E8B00B" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L16 10H8L12 3Z" />
    <path d="M6 14L10 21H2L6 14Z" />
    <path d="M18 14L22 21H14L18 14Z" />
  </svg>
);

const LandingPage = ({ onLogin }) => {
  return (
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
            <button className="btn-register-nav">Register</button>
            <button className="btn-login-nav" onClick={onLogin}>Login</button>
          </div>
        </div>
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
            <button className="btn-primary">Get Started</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=800" 
            alt="Church congregation" 
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

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Ready to Join Our Community?</h2>
          <p className="cta-subtitle">
            Become a part of the ASTU Gibi Gubae family today and start your journey with GubaeTech. We can't wait to welcome you.
          </p>
          <button className="btn-cta">Register Now</button>
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
          <p>© 2024 GubaeTech ASTU Gibi Gubae. All rights reserved. Designed for spiritual growth through technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

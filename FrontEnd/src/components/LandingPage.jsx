import React, { useState } from 'react';
import './LandingPage.css';
import { Plus, Heart, Cpu, Share2, Mail, Menu, X, ArrowRight } from 'lucide-react';
import RegistrationModal from './RegistrationModal';
import EventDetailsModal from './EventDetailsModal';

import heroVideo from '../assets/30TH.mp4';
import hackathonImg from '../assets/hackaton kick off.jpg';
import welcomeSpecialNeedsImg from '../assets/welcome for new division members.jpg';
import welcomeCharityImg from '../assets/welcome for new charity division members.jpg';
import mkLogo from '../assets/mk_logo.jpeg';

const LogoIcon = () => (
  <img src={mkLogo} alt="GubaeTech Logo" className="logo-img" />
);

const eventsData = [
  {
    id: 1,
    image: hackathonImg,
    month: 'FEB',
    day: '28',
    fullDate: 'February 28',
    time: 'A week-long event',
    location: 'AGT HUB',
    title: 'AGT HUB Hackathon',
    description: 'Our Talent for Our Church — Innovation · Faith · Technology. A week-long hackathon with guest judges where participants design and build Systems, Websites, and Mobile Apps. Everyone is welcome to join this exciting challenge!',
    highlights: ['Design Systems', 'Build Websites', 'Mobile Apps', 'Guest Judges', 'Everyone Welcome'],
  },
  {
    id: 2,
    image: welcomeSpecialNeedsImg,
    month: 'MAR',
    day: '05',
    fullDate: 'Yekatit 27 — March 5',
    time: '8:30 PM (Local Time)',
    location: 'St. Teklehaimanot Church',
    title: '1st Year Special Needs Welcome',
    description: 'A special welcome program organized for 1st-year students. This event is a unique night featuring a wide array of activities to help new members feel at home in the fellowship community.',
    highlights: ['Games', 'Films', 'Songs', 'Agape', 'Poems', 'Begena Songs', 'Teachings'],
  },
  {
    id: 3,
    image: welcomeCharityImg,
    month: 'MAR',
    day: '04',
    fullDate: 'Yekatit 26 — March 4',
    time: '1:30 PM (Local Time)',
    location: 'St. Teklehaimanot Church',
    title: 'Charity Division Welcome',
    description: 'A Profession & Charity overnight welcome program dedicated to 1st-year students. Join us for a night full of spiritual and educational activities designed to introduce you to the Charity Division community.',
    highlights: ['Teachings', 'Experience Sharing', 'Agape', 'Drama', 'Begena Songs', 'Games'],
  },
];

const LandingPage = ({ onLogin }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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
            {eventsData.map((event) => (
              <div className="event-card" key={event.id}>
                <div className="event-image-wrapper">
                  <img src={event.image} alt={event.title} className="event-image" />
                  <div className="event-date-badge">
                    <span className="event-month">{event.month}</span>
                    <span className="event-day">{event.day}</span>
                  </div>
                </div>
                <div className="event-content">
                  <div className="event-meta">
                    <span className="event-time">{event.time}</span>
                    <span className="event-location">{event.location}</span>
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>
                  <button
                    className="btn-event-link"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Event Details
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
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

      <EventDetailsModal
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </>
  );
};

export default LandingPage;

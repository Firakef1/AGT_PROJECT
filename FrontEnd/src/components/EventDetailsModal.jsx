import React from 'react';
import { X, Clock, MapPin, Calendar } from 'lucide-react';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div className="event-modal-backdrop" onClick={onClose}>
            <div className="event-modal-container" onClick={e => e.stopPropagation()}>
                {/* Close button */}
                <button className="event-modal-close" onClick={onClose} aria-label="Close">
                    <X size={22} />
                </button>

                {/* Event flyer image */}
                <div className="event-modal-image-wrapper">
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="event-modal-image" />
                    ) : (
                        <div className="event-modal-image event-modal-image-placeholder" style={{ background: 'linear-gradient(135deg, #1a56db 0%, #7c3aed 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '4rem', fontWeight: 700 }}>{event.title?.charAt(0) || '?'}</div>
                    )}
                    <div className="event-modal-image-overlay" />
                    <div className="event-modal-date-badge">
                        <span className="event-modal-month">{event.month}</span>
                        <span className="event-modal-day">{event.day}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="event-modal-content">
                    <h2 className="event-modal-title">{event.title}</h2>

                    <div className="event-modal-meta">
                        <div className="event-modal-meta-item">
                            <Calendar size={16} className="event-meta-icon" />
                            <span>{event.fullDate}</span>
                        </div>
                        <div className="event-modal-meta-item">
                            <Clock size={16} className="event-meta-icon" />
                            <span>{event.time}</span>
                        </div>
                        <div className="event-modal-meta-item">
                            <MapPin size={16} className="event-meta-icon" />
                            <span>{event.location}</span>
                        </div>
                    </div>

                    <div className="event-modal-divider" />

                    <p className="event-modal-description">{event.description}</p>

                    {event.highlights && event.highlights.length > 0 && (
                        <div className="event-modal-highlights">
                            <h4 className="event-highlights-title">What to Expect</h4>
                            <ul className="event-highlights-list">
                                {event.highlights.map((item, idx) => (
                                    <li key={idx} className="event-highlight-item">
                                        <span className="highlight-dot" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button className="btn-event-register" onClick={onClose}>
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsModal;

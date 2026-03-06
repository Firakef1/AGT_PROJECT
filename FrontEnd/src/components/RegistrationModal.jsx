import React, { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import './RegistrationModal.css';
import { apiFetch } from '../services/apiFetch.js';

const RegistrationModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        studentId: '',
        fullName: '',
        email: '',
        phone: '',
        divisionId: ''
    });

    const [divisions, setDivisions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchDivisions();
        }
    }, [isOpen]);

    const fetchDivisions = async () => {
        setIsLoading(true);
        try {
            const data = await apiFetch('/divisions');
            setDivisions(data);
        } catch (err) {
            console.error('Failed to fetch divisions:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await apiFetch('/members/register', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
                setFormData({ studentId: '', fullName: '', email: '', phone: '', divisionId: '' });
            }, 6000);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop" onClick={!submitted && !isSubmitting ? onClose : undefined}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose} disabled={isSubmitting}>
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <h2 className="modal-title">Join GubaeTech</h2>
                    <p className="modal-subtitle">Register to become a part of ASTU Gibi Gubae.</p>
                </div>

                {submitted ? (
                    <div className="registration-success">
                        <div className="success-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 className="success-title">Registration Submitted!</h3>
                        <p className="success-message">
                            Your request has been received. Your membership is now <strong>Pending Approval</strong> by the Admin or Members Management team.
                        </p>
                        <p className="success-sub">You will receive an email once your request is processed.</p>
                    </div>
                ) : (
                    <form className="registration-form" onSubmit={handleSubmit}>
                        {error && <div className="form-error" style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                        
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="studentId">Student ID (Member ID) *</label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. UGR/000001/18"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+251 912 345 678"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="divisionId">Division of Interest *</label>
                                <select
                                    id="divisionId"
                                    name="divisionId"
                                    value={formData.divisionId}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                >
                                    <option value="" disabled>{isLoading ? 'Loading...' : 'Select a division'}</option>
                                    {divisions.map(div => (
                                        <option key={div.id} value={div.id}>{div.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Loader2 size={18} className="spin" /> Processing...</>
                                ) : 'Submit Registration'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RegistrationModal;

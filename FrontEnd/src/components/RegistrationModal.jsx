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
        gender: '',
        section: '',
        languageAfanOromo: false,
        languageAmharic: false,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleLanguageCheck = (lang) => {
        if (lang === 'AFAN_OROMO') {
            setFormData(prev => ({ ...prev, languageAfanOromo: !prev.languageAfanOromo }));
        } else {
            setFormData(prev => ({ ...prev, languageAmharic: !prev.languageAmharic }));
        }
    };

    const handleGenderChange = (value) => {
        setFormData(prev => ({ ...prev, gender: value }));
    };

    // Derive language value for API: BOTH, AFAN_OROMO, or AMHARIC (at least one required)
    const getLanguageValue = () => {
        const { languageAfanOromo, languageAmharic } = formData;
        if (languageAfanOromo && languageAmharic) return 'BOTH';
        if (languageAfanOromo) return 'AFAN_OROMO';
        if (languageAmharic) return 'AMHARIC';
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const languageValue = getLanguageValue();
        if (!languageValue) {
            setError('Please select at least one language.');
            return;
        }
        if (!formData.gender) {
            setError('Please select your gender.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const sectionNum = formData.section === '' ? undefined : parseInt(formData.section, 10);
            const payload = {
                studentId: formData.studentId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone || undefined,
                gender: formData.gender,
                divisionId: null,
                language: languageValue,
                ...(Number.isInteger(sectionNum) && { section: sectionNum }),
            };
            await apiFetch('/members/register', {
                method: 'POST',
                body: JSON.stringify(payload),
            });
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
                setFormData({ studentId: '', fullName: '', email: '', phone: '', gender: '', section: '', languageAfanOromo: false, languageAmharic: false });
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
                            Your request has been received. Your membership is now <strong>Pending Approval</strong>.
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

                            <div className="form-group">
                                <label>Gender *</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                                    {['Male', 'Female'].map((opt) => (
                                        <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={opt.toUpperCase()}
                                                checked={formData.gender === opt.toUpperCase()}
                                                onChange={() => handleGenderChange(opt.toUpperCase())}
                                                required
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="section">Section</label>
                                <input
                                    type="number"
                                    id="section"
                                    name="section"
                                    min={1}
                                    value={formData.section}
                                    onChange={handleChange}
                                    placeholder="e.g. 1"
                                />
                            </div>

                            <div className="form-group">
                                <label>Language *</label>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Select at least one (you can check both).</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.languageAfanOromo}
                                            onChange={() => handleLanguageCheck('AFAN_OROMO')}
                                        />
                                        Afan Oromo
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={formData.languageAmharic}
                                            onChange={() => handleLanguageCheck('AMHARIC')}
                                        />
                                        Amharic
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions" style={{ marginTop: '2rem' }}>
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

import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import './RegistrationModal.css';

const RegistrationModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        memberId: '',
        fullName: '',
        gender: '',
        phoneNumber: '',
        email: '',
        dateJoined: '',
        address: '',
        birthday: '',
        status: 'Active',
        profilePhoto: null
    });

    const [photoPreview, setPhotoPreview] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, profilePhoto: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend
        console.log('Registration Data:', formData);
        alert('Registration submitted successfully!');
        onClose();
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="modal-header">
                    <h2 className="modal-title">Join GubaeTech</h2>
                    <p className="modal-subtitle">Register to become a part of ASTU Gibi Gubae.</p>
                </div>

                <form className="registration-form" onSubmit={handleSubmit}>

                    {/* Photo Upload Section */}
                    <div className="form-section-photo">
                        <div className="photo-upload-wrapper">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Profile Preview" className="photo-preview" />
                            ) : (
                                <div className="photo-placeholder">
                                    <Upload size={32} className="upload-icon" />
                                    <span>Upload Photo</span>
                                </div>
                            )}
                            <input
                                type="file"
                                id="profilePhoto"
                                name="profilePhoto"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="photo-input"
                            />
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="memberId">Member ID</label>
                            <input
                                type="text"
                                id="memberId"
                                name="memberId"
                                value={formData.memberId}
                                onChange={handleChange}
                                required
                                placeholder="e.g. UGR/000001/18"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="fullName">Full Name</label>
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
                            <label htmlFor="gender">Gender</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="+251 912 345 678"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
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
                            <label htmlFor="dateJoined">Date Joined</label>
                            <input
                                type="date"
                                id="dateJoined"
                                name="dateJoined"
                                value={formData.dateJoined}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="birthday">Birthday</label>
                            <input
                                type="date"
                                id="birthday"
                                name="birthday"
                                value={formData.birthday}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Visitor">Visitor</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="address">Address</label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="Current residential address..."
                                rows="3"
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit">Submit Registration</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationModal;

import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react'
import logo from '../assets/mk_logo.jpeg'
import './Login.css'

const Login = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false)
            onLogin()
        }, 1500)
    }

    return (
        <div className="login-container">
            <div className="login-card">
                {/* Left Sidebar */}
                <div className="login-sidebar">
                    <div className="sidebar-brand">
                        <img src={logo} alt="GubaeTech Logo" className="brand-logo" />
                        <span className="brand-name">GubaeTech</span>
                    </div>

                    <div className="sidebar-content">
                        <h1>Internal Management Platform</h1>
                        <p>
                            A dedicated dashboard for ASTU Gibi Gubae leaders to manage congregation activities,
                            member records, and spiritual growth tracking.
                        </p>
                    </div>

                    <div className="security-notice">
                        <div className="notice-icon">
                            <Shield size={20} className="shield-icon" />
                        </div>
                        <div className="notice-text">
                            <strong>Authorized Personnel Only</strong>
                            <span>Access restricted to verified spiritual leaders.</span>
                        </div>
                    </div>

                    <div className="sidebar-footer">
                        <p>© 2026 ASTU Gibi Gubae. All rights reserved.</p>
                    </div>
                </div>

                {/* Right Main Content */}
                <div className="login-main">
                    <div className="login-form-wrap">
                        <div className="form-header">
                            <h2>Welcome Back</h2>
                            <p>Please enter your leader credentials to continue.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-box">
                                    <Mail size={18} className="box-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="leader.name@astugibigubae.org"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="label-row">
                                    <label htmlFor="password">Password</label>
                                    <a href="#" className="forgot-link">FORGOT PASSWORD?</a>
                                </div>
                                <div className="input-box">
                                    <Lock size={18} className="box-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="eye-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="checkbox-wrap">
                                    <input type="checkbox" />
                                    <span className="checkmark" />
                                    <span className="checkbox-label">Remember this device</span>
                                </label>
                            </div>

                            <button type="submit" className="signin-btn" disabled={isLoading}>
                                {isLoading ? (
                                    <span className="btn-loader"></span>
                                ) : (
                                    <>
                                        Sign In to Dashboard
                                        <ArrowRight size={18} className="btn-arrow" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="help-box">
                            <p>Need assistance? <a href="#">Contact Admin Support</a></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login

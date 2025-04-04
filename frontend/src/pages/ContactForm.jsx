import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    consent: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draftStatus, setDraftStatus] = useState({
    saved: false,
    loaded: false,
    error: null
  });

  // Load draft on mount (runs once)
  useEffect(() => {
    const loadDraft = () => {
      try {
        const savedData = localStorage.getItem('contactFormDraft');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData.name || parsedData.email || parsedData.message) {
            setFormData(parsedData);
            setDraftStatus(prev => ({ ...prev, loaded: true }));
            console.log('Draft loaded:', parsedData);
          }
        }
      } catch (error) {
        setDraftStatus(prev => ({ ...prev, error: 'Failed to load draft' }));
        console.error('Draft load error:', error);
      }
    };
    
    loadDraft();
  }, []);

  // Auto-save with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only save if there's actual content
      if (formData.name || formData.email || formData.message) {
        try {
          localStorage.setItem('contactFormDraft', JSON.stringify(formData));
          setDraftStatus(prev => ({ ...prev, saved: true, error: null }));
          console.log('Draft saved');
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setDraftStatus(prev => ({ ...prev, saved: false }));
          }, 3000);
        } catch (error) {
          setDraftStatus(prev => ({ ...prev, error: 'Draft too large' }));
          console.error('Save error:', error);
        }
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timer);
  }, [formData]); // Runs when formData changes

  const validate = () => {
    const newErrors = {};
    
    // Name validation (allows letters, spaces, hyphens, apostrophes)
    if (!/^[\p{L}\s'-]+$/u.test(formData.name.trim())) {
      newErrors.name = 'Please enter a valid name (letters, spaces, hyphens only)';
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Subject validation (letters and spaces only)
    if (!/^[A-Za-z\s]+$/.test(formData.subject.trim())) {
      newErrors.subject = 'Subject should contain only letters and spaces';
    }
    
    // Message validation (no HTML)
    if (/<[^>]*>/.test(formData.message)) {
      newErrors.message = 'Message cannot contain HTML tags';
    }
    
    // Consent validation
    if (!formData.consent) {
      newErrors.consent = 'You must consent to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sanitizeInput = (input) => {
    return {
      name: String(input.name || '').trim().replace(/[<>]/g, ''),
      email: String(input.email || '').trim().replace(/[<>]/g, ''),
      subject: String(input.subject || '').trim().replace(/[<>]/g, ''),
      message: String(input.message || '')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;'),
      consent: Boolean(input.consent)
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const sanitizedData = {
          ...sanitizeInput(formData),
          consent: formData.consent
        };

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiBaseUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedData)
        });
        
        if (response.ok) {
          localStorage.removeItem('contactFormDraft');
          setIsSubmitted(true);
          console.log(formData);
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            consent: false
          });
        }
      } catch (error) {
        console.error('Submission error:', error);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">Thank you!</h4>
        <p>Your message has been submitted successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form container mt-5" aria-label="Contact form">

       {/* Status Messages */}
       <div className="draft-feedback">
        {draftStatus.loaded && (
          <div className="alert alert-info">
            Draft restored - continue where you left off
          </div>
        )}
        {draftStatus.saved && (
          <div className="alert alert-success">
            Draft saved automatically
          </div>
        )}
        {draftStatus.error && (
          <div className="alert alert-danger">
            {draftStatus.error}
          </div>
        )}
      </div>

      {/* Name Field */}
      <div className={`mb-3 ${errors.name ? 'has-error' : ''}`}>
        <label htmlFor="name" className="form-label">
          Full Name <span className="text-danger">*</span>
        </label>
        <input
          id="name"
          type="text"
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "nameError" : undefined}
        />
        {errors.name && (
          <div id="nameError" className="invalid-feedback">
            {errors.name}
          </div>
        )}
      </div>

      {/* Email Field */}
      <div className={`mb-3 ${errors.email ? 'has-error' : ''}`}>
        <label htmlFor="email" className="form-label">
          Email Address <span className="text-danger">*</span>
        </label>
        <input
          id="email"
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "emailError" : undefined}
        />
        {errors.email && (
          <div id="emailError" className="invalid-feedback">
            {errors.email}
          </div>
        )}
      </div>

      {/* Subject Field */}
      <div className={`mb-3 ${errors.subject ? 'has-error' : ''}`}>
        <label htmlFor="subject" className="form-label">
          Subject <span className="text-danger">*</span>
        </label>
        <input
          id="subject"
          type="text"
          className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
          value={formData.subject}
          onChange={(e) => setFormData({...formData, subject: e.target.value})}
          required
          aria-required="true"
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subjectError" : undefined}
        />
        {errors.subject && (
          <div id="subjectError" className="invalid-feedback">
            {errors.subject}
          </div>
        )}
      </div>

      {/* Message Field */}
      <div className={`mb-3 ${errors.message ? 'has-error' : ''}`}>
        <label htmlFor="message" className="form-label">
          Message <span className="text-danger">*</span>
        </label>
        <textarea
          id="message"
          className={`form-control ${errors.message ? 'is-invalid' : ''}`}
          rows="5"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "messageError" : undefined}
        ></textarea>
        {errors.message && (
          <div id="messageError" className="invalid-feedback">
            {errors.message}
          </div>
        )}
      </div>

      {/* Consent Checkbox */}
      <div className={`mb-3 form-check ${errors.consent ? 'has-error' : ''}`}>
        <input
          type="checkbox"
          className={`form-check-input ${errors.consent ? 'is-invalid' : ''}`}
          id="consent"
          checked={formData.consent}
          onChange={(e) => setFormData({...formData, consent: e.target.checked})}
          aria-invalid={!!errors.consent}
          aria-describedby={errors.consent ? "consentError" : undefined}
        />
        <label className="form-check-label" htmlFor="consent">
          I consent to being contacted and understand my data will be stored securely
          <span className="text-danger">*</span>
        </label>
        {errors.consent && (
          <div id="consentError" className="invalid-feedback">
            {errors.consent}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        className="btn btn-primary btn-custom"
        aria-label="Submit contact form"
      >
        Submit Message
      </button>
    </form>
  );
}
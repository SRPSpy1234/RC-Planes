import React, { useState } from 'react';
import emailjs from 'emailjs-com';

const accent = '#2de2e6';
const defaultParts = ['Motor', 'ESC', 'Battery', 'Servos', 'Propeller', 'Receiver', 'Other'];

const OrderFormPage: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    experience: '',
    power: '',
    speed: '',
    planeType: '',
    customSpecs: '',
    notes: '',
    parts: defaultParts.map(() => ({ value: '', link: '', leaveToHQ: false })),
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePartChange = (idx: number, field: 'value' | 'link' | 'leaveToHQ', value: string | boolean) => {
    const updatedParts = [...form.parts];
    updatedParts[idx] = { ...updatedParts[idx], [field]: value };
    setForm({ ...form, parts: updatedParts });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare template params for EmailJS
    const stats = `You ordered a ${form.experience} Level, ${form.planeType} Plane.`;
    const partsList = defaultParts.map((part, idx) => {
      const partInfo = form.parts[idx].leaveToHQ ? 'Let HQ Decide' : form.parts[idx].value;
      const link = form.parts[idx].link ? ` (${form.parts[idx].link})` : '';
      return `${part}: ${partInfo}${link}`;
    }).join('\n');
    const templateParams = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      budget: form.budget,
      experience: form.experience,
      power: form.power,
      speed: form.speed,
      planeType: form.planeType,
      customSpecs: form.customSpecs,
      notes: form.notes,
      stats,
      parts: partsList,
    };
    // Save order to localStorage for menu display
    const prevOrders = JSON.parse(localStorage.getItem('planeOrders') || '[]');
    localStorage.setItem('planeOrders', JSON.stringify([...prevOrders, templateParams]));
    emailjs.send('service_edpvv6a', 'template_d4vh8s3', templateParams, 'YMAXQAlNRtSwNjmiu')
      .then(() => {
        setSubmitted(true);
      }, (error) => {
        alert('Failed to send order. Please try again or email orders@flighthq.net');
      });
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: 480, margin: '48px auto', background: '#232a34', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', padding: 32, color: '#eaf6fb', textAlign: 'center' }}>
        <h2 style={{ color: accent }}>Order Confirmation</h2>
        <p>Thank you for your order, {form.name}!<br />A confirmation will be sent to <b>{form.email}</b>.<br />We will contact you soon to finalize your RC plane order.</p>
        <p>If you do not receive a confirmation email, please contact us at <b>orders@flighthq.net</b>.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '48px auto', background: '#232a34', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.18)', padding: 32, color: '#eaf6fb' }}>
      <h2 style={{ color: accent, textAlign: 'center', marginBottom: 24 }}>RC Plane Order Form</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: accent, fontWeight: 600 }}>Full Name*</label>
          <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: accent, fontWeight: 600 }}>Email*</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: accent, fontWeight: 600 }}>Phone Number</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: accent, fontWeight: 600 }}>Budget (USD)*</label>
          <input name="budget" type="number" value={form.budget} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }} />
        </div>
        <div style={{ marginBottom: 18, display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ color: accent, fontWeight: 600 }}>Desired Power</label>
            <input name="power" value={form.power} onChange={handleChange} placeholder="e.g. High, Medium, Low" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }} />
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <label style={{ color: accent, fontWeight: 600 }}>Desired Speed</label>
            <input name="speed" value={form.speed} onChange={handleChange} placeholder="e.g. Fast, Moderate, Slow" style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }} />
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: accent, fontWeight: 600 }}>Experience Level*</label>
          <select name="experience" value={form.experience} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }}>
            <option value="">Select</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: accent, fontWeight: 600 }}>Plane Type*</label>
          <select name="planeType" value={form.planeType} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }}>
            <option value="">Select a type</option>
            <option value="Trainer">Trainer</option>
            <option value="Sport">Sport</option>
            <option value="Scale">Scale</option>
            <option value="3D">3D</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: accent, fontWeight: 600 }}>Custom Specifications</label>
          <textarea name="customSpecs" value={form.customSpecs} onChange={handleChange} rows={3} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }} />
        </div>
        <h3 style={{ color: accent, margin: '24px 0 12px 0' }}>Component Parts</h3>
        {defaultParts.map((part, idx) => (
          <div key={part} style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <label style={{ minWidth: 100, color: accent }}>{part}:</label>
            <input
              placeholder={`Type for ${part}`}
              value={form.parts[idx].value}
              onChange={e => handlePartChange(idx, 'value', e.target.value)}
              style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid ' + accent, background: '#181c22', color: '#eaf6fb' }}
            />
            <input
              placeholder={`Link for ${part}`}
              value={form.parts[idx].link}
              onChange={e => handlePartChange(idx, 'link', e.target.value)}
              style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid ' + accent, background: '#181c22', color: '#eaf6fb' }}
            />
            <button
              type="button"
              className="main-btn"
              style={{ padding: '6px 8px', fontSize: '0.85rem', minWidth: 0, whiteSpace: 'nowrap', marginLeft: '4px' }}
              onClick={() => handlePartChange(idx, 'leaveToHQ', !form.parts[idx].leaveToHQ)}
            >
              {form.parts[idx].leaveToHQ ? 'Undo' : 'Let HQ Decide'}
            </button>
          </div>
        ))}
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: accent, fontWeight: 600 }}>Additional Notes</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid ' + accent, marginTop: 6, background: '#181c22', color: '#eaf6fb' }} />
        </div>
        <button type="submit" className="main-btn" style={{ width: '100%', fontSize: '1.1rem', marginTop: 12 }}>Submit Order</button>
      </form>
      <p style={{ marginTop: 18, color: accent, textAlign: 'center' }}>
        For questions, email <b>orders.FlightHQ@gmail.com</b>
      </p>
    </div>
  );
};

export default OrderFormPage;

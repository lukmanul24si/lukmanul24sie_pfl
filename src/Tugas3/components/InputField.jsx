// File: src/components/InputField.jsx
import React from 'react';

export default function InputField({ label, type, name, value, onChange, error, placeholder }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#374151', fontSize: '14px' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ 
          width: '100%', padding: '12px 16px', 
          border: error ? '2px solid #EF4444' : '2px solid #E5E7EB', 
          borderRadius: '8px', backgroundColor: '#F9FAFB',
          color: '#1F2937', fontSize: '15px', outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      {error && (
        <span style={{ display: 'inline-block', color: '#B91C1C', backgroundColor: '#FEE2E2', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', marginTop: '8px', fontWeight: '500' }}>
          ⚠️ {error}
        </span>
      )}
    </div>
  );
}
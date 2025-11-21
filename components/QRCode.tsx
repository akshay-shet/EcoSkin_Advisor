import React from 'react';

const QRCode: React.FC<{ value: string, size?: number }> = ({ value, size = 128 }) => {
    // Use a public API to generate a real, scannable QR code.
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&qzone=1`;

    return (
        <img 
            src={qrApiUrl} 
            alt="QR Code for profile link" 
            width={size} 
            height={size} 
            className="border rounded-lg bg-white p-1"
        />
    );
};

export default QRCode;

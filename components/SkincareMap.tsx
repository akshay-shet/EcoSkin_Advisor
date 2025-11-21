
import React from 'react';

const mockLocations = [
  { name: 'Sephora Downtown', lat: 34.0522, lng: -118.2437 },
  { name: 'Ulta Beauty Plaza', lat: 34.0622, lng: -118.2537 },
  { name: 'MAC Cosmetics Grove', lat: 34.0722, lng: -118.2637 },
  { name: 'Organic Beauty Store', lat: 34.0422, lng: -118.2337 },
];

export const SkincareMap: React.FC = () => {
  // This is a placeholder for a real map component like @react-google-maps/api
  // In a real app, you would fetch the Google Maps script and render a map.
  return (
    <div className="bg-gray-200 rounded-lg h-96 flex flex-col items-center justify-center text-gray-500 relative overflow-hidden">
      <img src="https://picsum.photos/800/600?grayscale" alt="Map placeholder" className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="relative z-10 text-center p-4 bg-white/80 rounded-lg">
        <h4 className="font-bold text-lg">Nearby Makeup Stores</h4>
        <p>(Map functionality is represented by this placeholder)</p>
        <ul className="mt-4 text-left list-disc list-inside">
          {mockLocations.map(loc => <li key={loc.name}>{loc.name}</li>)}
        </ul>
      </div>
    </div>
  );
};

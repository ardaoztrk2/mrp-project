import React from 'react';

export default function TestFade() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-10 bg-white rounded-xl shadow-xl animate-fade-in">
        <h1 className="text-3xl font-bold text-red-600">Fade In Test</h1>
      </div>
    </div>
  );
}

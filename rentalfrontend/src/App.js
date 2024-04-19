import React from 'react';
import RentalLogic from './rentalLogic';
import Navigation from './navigation';

export default function App() {
  return (
    <div className="App">
      <Navigation/>
      <RentalLogic/>
    </div>
  );
}
import React from 'react';
import CarLogic from './carLogic';
import Navigation from './navigation';


export default function App() {
  return (
    <div className="App">
      <Navigation/>
      <CarLogic/>
    </div>
  );
}

import { useState } from 'react';

import './App.css';

import pngOrganic from "./assets/ORGANIC.png"
import pngMechanical from "./assets/MECHANICAL.png";
import pngCyborg from "./assets/CYBORG.png";
import pngLegendary from "./assets/LEGENDARY.png";

function App() {

  return (
    <>
      <div>
        <img className='eggsImg' src={pngOrganic}/><img className='eggsImg' src={pngMechanical} /><img className='eggsImg' src={pngCyborg} />
      </div>
    </>
  )
}

export default App

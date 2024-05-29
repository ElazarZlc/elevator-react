import React from 'react';
import elvPhoto from "/elv.png";


export default function Elevator({newPosition}){

   

  return (
    <>
       <img style={{transform: `translateY(-${newPosition}px)`,
          transition:  `transform 1s ease-in-out`}} src={elvPhoto} alt="elevator img" className="elevator" />
    </>
  );
};

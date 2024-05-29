import React, { useState, useEffect } from 'react';

export default function Floor({ index, floorStatus, handleElevatorCall }) {
 const handleClick = () => {
   handleElevatorCall(index);
 };

 const [timer, setTimer] = useState('00:00');

 useEffect(() => {
    
   const seconds = Math.floor(floorStatus.milliseconds / 1000);
   const centiseconds = Math.floor((floorStatus.milliseconds % 1000) / 10);
   const formattedTime = `${padZero(seconds)}:${padZero(centiseconds)}`;
   setTimer(formattedTime);

   const interval = setInterval(() => {
     setTimer((prevTimer) => {
       const [seconds, centiseconds] = prevTimer.split(':').map(Number);
       if (centiseconds === 0 && seconds === 0) {
         clearInterval(interval);
         return '00:00';
       }
       const newCentiseconds = centiseconds > 0 ? centiseconds - 1 : 99;
       const newSeconds = centiseconds === 0 ? seconds - 1 : seconds;
       return `${padZero(newSeconds)}:${padZero(newCentiseconds)}`;
     });
   }, 10);

   return () => clearInterval(interval);
 }, [floorStatus.milliseconds]);

 function padZero(value) {
   return value.toString().padStart(2, '0');
 }

 return (
   <div className="floor-size">
     <div className="black-line"></div>
     <div className="floor">
       <button className={`metal linear ${floorStatus.isWaiting ? "active" : ""}`} onClick={handleClick}>
         {index}
       </button>
       {floorStatus.isWaiting && (
         <div className="container-timer">
           <span className="timer">{timer}</span>
         </div>
       )}
     </div>
</div>
);
}

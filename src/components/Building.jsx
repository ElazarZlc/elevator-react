import { useEffect, useState } from "react";
import Elevator from "./Elevator";
import Floor from "./Floor";

export default function Building({ numOfFloors, numOfElevators }) {
  const [floorStatuses, setFloorStatuses] = useState(
    Array(numOfFloors).fill({ isWaiting: false, milliseconds: 0 })
  );
  const [elevatorStatuses, setElevatorStatuses] = useState(
    Array(numOfElevators).fill({
      currentFloor: 0,
      destination: 0,
      queue: [],
      milliseconds: 0,
      sumOfMilliseconds: 0,
      isMoving: false,
    })
  );
  const [newPosition, setNewPosition] = useState(Array(numOfElevators).fill(0));

  const getClosestElevator = (floorNum) => {
    let closestElevator = 0;
    let minTime = Infinity;
    for (let i = 0; i < elevatorStatuses.length; i++) {
      const time =
        elevatorStatuses[i].sumOfMilliseconds +
        (Math.abs(elevatorStatuses[i].currentFloor - floorNum) * 110) / 220 * 1000;
      if (time < minTime && !elevatorStatuses[i].isMoving) {
        minTime = time;
        closestElevator = i;
      }
    }
    return closestElevator;
  };

  const handleElevatorCall = (floorNum) => {
    const closestElevator = getClosestElevator(floorNum);
    setFloorStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses[floorNum] = { ...newStatuses[floorNum], isWaiting: true };
      return newStatuses;
    });
    setElevatorStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      const elevatorQueue = newStatuses[closestElevator].queue;
      newStatuses[closestElevator] = {
        ...newStatuses[closestElevator],
        queue: [...elevatorQueue, floorNum],
        isMoving: true,
      };
      return newStatuses;
    });
    console.log(closestElevator);
    
    moveElevator(closestElevator);
  };

  const moveElevator = (elevatorIndex) => {
    const elevator = elevatorStatuses[elevatorIndex];
    const queue = elevator.queue;

    if (queue.length === 0) return;

    const destinationFloor = queue[0];
    const distance = Math.abs(elevator.currentFloor - destinationFloor);
    const duration = (distance * 110) / 220 * 1000; // Assuming 220 units per second

    setNewPosition((prevPositions) => {
      const newPositions = [...prevPositions];
      newPositions[elevatorIndex] = destinationFloor * 110;
      return newPositions;
    });

    setTimeout(() => {
      setElevatorStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        const elevatorQueue = newStatuses[elevatorIndex].queue.slice(1);
        newStatuses[elevatorIndex] = {
          ...newStatuses[elevatorIndex],
          currentFloor: destinationFloor,
          queue: elevatorQueue,
          isMoving: elevatorQueue.length > 0,
        };
        return newStatuses;
      });

      setFloorStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        newStatuses[destinationFloor] = { ...newStatuses[destinationFloor], isWaiting: false };
        return newStatuses;
      });

      if (elevatorStatuses[elevatorIndex].queue.length > 0) {
        moveElevator(elevatorIndex);
      }
    }, duration);
  };

  const floors = [];
  for (let i = 0; i < numOfFloors; i++) {
    floors.push(
      <Floor
        key={i}
        index={i}
        handleElevatorCall={handleElevatorCall}
        floorStatus={floorStatuses[i]}
      />
    );
  }

  const elevators = [];
  for (let i = 0; i < numOfElevators; i++) {
    elevators.push(<Elevator key={i} newPosition={newPosition[i]} />);
  }

  return (
    <div className="countainer">
      <div className="building">{floors}</div>
      <div className="elevators">{elevators}</div>
    </div>
  );
}
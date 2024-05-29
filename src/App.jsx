import Building from "./components/Building";

const numOfFloors = 15;
const numOfElevators = 3;

export default function App() {
  return <Building numOfFloors={numOfFloors} numOfElevators={numOfElevators} />;
}

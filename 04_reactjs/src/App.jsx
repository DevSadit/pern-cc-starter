import { useEffect, useState } from "react";
import Car from "./components/Car";

const App = () => {
  const [cars, setCars] = useState([]);
  useEffect(() => {
    fetch("/api/v1/cars")
      .then((res) => res.json())
      .then((data) => {
        setCars(data);
        // console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(cars);

  return (
    <div>
      <h1>Welcome to the car store</h1>
      <div>
        {cars.map((car) => (
          <Car key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
};

export default App;

const Car = ({ car }) => {
  const { id, make, model, year, price } = car;
  return (
    <div>
      <h2>Car Number {id}</h2>

      <div>
        <h4>make: {make}</h4>
        <h4>model: {model}</h4>
        <h4>year: {year}</h4>
        <h4>price: {price}</h4>
      </div>
    </div>
  );
};

export default Car;

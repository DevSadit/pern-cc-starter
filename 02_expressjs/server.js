import express, { response } from "express";

const app = express();
const port = 3000;

const router = express.Router();

// middle ware
app.use(express.json());
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);

  next();
});
let cars = [
  { id: 1, make: "Toyota", model: "Camry", year: 2022, price: 28000 },
  { id: 2, make: "Tesla", model: "Model S", year: 2023, price: 25000 },
  { id: 3, make: "Ford", model: "F-150", year: 2021, price: 35000 },
];

// server home...
app.get("/", (req, res) => {
  res.send("Hello from the car API!!!");
});

// get all the cars
router.get("/", (req, res) => {
  res.json(cars);
});

// post a car in db
router.post("/", (req, res) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(404).json({ error: "missing feilds" });
  }

  const newCar = {
    id: cars.length + 1,
    make,
    model,
    year: Number(year),
    price: Number(price),
  };

  cars.push(newCar);
  res.status(201).json(newCar);
});

// update the specific car info
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = cars.findIndex((c) => c.id === id);

  if (idx === -1) return res.status(404).send("Car Not Found!");

  const { make, model, year, price } = req.body;

  if (make) cars[idx].make = make;
  if (model) cars[idx].model = model;
  if (year) cars[idx].year = Number(year);
  if (price) cars[idx].price = Number(price);

  res.json(cars[idx]);
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = cars.findIndex((c) => c.id === id);

  if (idx === -1) {
    return res.status(404).json({ erro: "Car Not Found" });
  }
  const deleted = cars.splice(idx, 1)[0];
  res.json({ message: "Car Deleted Succesfully..", car: deleted });
});

// get a specific car
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((car) => car.id === id);

  if (!car) return res.status(404).send("Car Not Found!");

  res.json(car);
});

app.use("/api/v1/cars", router);

app.listen(port, () => {
  console.log(`server is running on: http://localhost:${port}`);
});

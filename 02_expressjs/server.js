import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../03_postgresql/db.js";
import { cars } from "../03_postgresql/schema.js";

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

// server home...
app.get("/", (req, res) => {
  res.send("Hello from the car API!!!");
});

// get all the cars
router.get("/", async (req, res, next) => {
  try {
    const allCars = await db.select().from(cars);
    res.json(allCars);
  } catch (error) {
    next(error);
  }
});

// post a car in db
router.post("/", async (req, res, next) => {
  const { make, model, year, price } = req.body;

  if (!make || !model || !year || !price) {
    return res.status(400).json({ error: "missing fields" });
  }

  try {
    const [newCar] = await db
      .insert(cars)
      .values({
        make,
        model,
        year: Number(year),
        price: String(price),
      })
      .returning();

    res.status(201).json(newCar);
  } catch (error) {
    next(error);
  }
});

// update the specific car info
router.put("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  const { make, model, year, price } = req.body;

  try {
    const updates = {};

    if (make) updates.make = make;
    if (model) updates.model = model;
    if (year) updates.year = Number(year);
    if (price) updates.price = String(price);

    const [updatedCar] = await db
      .update(cars)
      .set(updates)
      .where(eq(cars.id, id))
      .returning();

    if (!updatedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(updatedCar);
  } catch (error) {
    next(error);
  }
});

// delete the specific car
router.delete("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    const [deletedCar] = await db
      .delete(cars)
      .where(eq(cars.id, id))
      .returning();

    if (!deletedCar) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({ message: "Car deleted successfully", car: deletedCar });
  } catch (error) {
    next(error);
  }
});

// get a specific car
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);

  try {
    const [car] = await db.select().from(cars).where(eq(cars.id, id));

    if (!car) return res.status(404).send("Car Not Found!");

    res.json(car);
  } catch (error) {
    next(error);
  }
});

app.use("/api/v1/cars", router);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(port, () => {
  console.log(`server is running on: http://localhost:${port}`);
});

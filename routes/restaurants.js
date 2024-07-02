const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const Dish = require("../models/Dish");

// Obtener todos los restaurantes
router.get("/", (req, res) => {
  Restaurant.find()
    .populate("dishes")
    .then((restaurants) => res.json(restaurants))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Crear un nuevo restaurante
router.post("/", (req, res) => {
  const { name, address, description } = req.body;
  const newRestaurant = new Restaurant({ name, address, description });
  newRestaurant
    .save()
    .then((restaurant) => res.json(restaurant))
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Obtener un restaurante por ID
router.get("/:id", (req, res) => {
  Restaurant.findById(req.params.id)
    .populate("dishes")
    .then((restaurant) => {
      if (!restaurant) {
        return res.status(404).json({ msg: "Restaurant not found" });
      }
      res.json(restaurant);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

// Crear un nuevo plato para un restaurante
router.post("/:id/dishes", (req, res) => {
  const { name, price } = req.body;
  const newDish = new Dish({ name, price, restaurant: req.params.id });
  newDish
    .save()
    .then((dish) => {
      Restaurant.findById(req.params.id)
        .then((restaurant) => {
          if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" });
          }
          restaurant.dishes.push(dish);
          restaurant
            .save()
            .then(() => res.json(dish))
            .catch((err) => res.status(500).json({ error: err.message }));
        })
        .catch((err) => res.status(500).json({ error: err.message }));
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;

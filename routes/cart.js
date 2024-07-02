const express = require("express");
const router = express.Router();
const Dish = require("../models/Dish");

// Obtener el carrito (aquí se manejaría la lógica del carrito, que podría estar en la sesión o en la base de datos)
router.get("/", (req, res) => {
  res.json(req.session.cart || []);
});

// Añadir un plato al carrito
router.post("/", (req, res) => {
  const { dishId, quantity } = req.body;
  Dish.findById(dishId).then((dish) => {
    if (!dish) return res.status(404).json({ msg: "Dish not found" });
    const cart = req.session.cart || [];
    const existingDish = cart.find((item) => item.dishId == dishId);
    if (existingDish) {
      existingDish.quantity += quantity;
    } else {
      cart.push({ dishId, quantity, name: dish.name, price: dish.price });
    }
    req.session.cart = cart;
    res.json(cart);
  });
});

// Eliminar un plato del carrito
router.delete("/:dishId", (req, res) => {
  const cart = req.session.cart || [];
  const updatedCart = cart.filter((item) => item.dishId != req.params.dishId);
  req.session.cart = updatedCart;
  res.json(updatedCart);
});

module.exports = router;

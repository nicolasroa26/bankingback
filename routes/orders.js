const express = require("express");
const router = express.Router();
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY");
const Order = require("../models/Order");
const Dish = require("../models/Dish");

// Crear un nuevo pedido
router.post("/", (req, res) => {
  const { userId, restaurantId, dishes, token } = req.body;

  // Calcular el monto total
  let totalAmount = 0;
  dishes.forEach((dish) => {
    totalAmount += dish.price * dish.quantity;
  });

  // Crear un cargo en Stripe
  stripe.charges.create(
    {
      amount: totalAmount * 100, // Convertir a centavos
      currency: "usd",
      description: `Order from restaurant ${restaurantId}`,
      source: token,
    },
    (err, charge) => {
      if (err) return res.status(500).json(err);

      // Guardar el pedido en la base de datos
      const newOrder = new Order({
        user: userId,
        restaurant: restaurantId,
        dishes,
        totalAmount,
        status: "Completed",
      });
      newOrder.save().then((order) => res.json(order));
    }
  );
});

module.exports = router;

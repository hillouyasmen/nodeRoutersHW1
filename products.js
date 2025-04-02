const express = require("express");
const router = express.Router();
const products = require("../data");

// GET /api/products
router.get("/", (req, res) => {
  res.json({ products });
});

// GET /api/products/:id
router.get("/:id", (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;
  res.json(product);
});

// PUT /api/products/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `User with ID: ${id} updated` });
});
// DELETE/api/products/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  res.json({ message: `Product with ID: ${id} deleted` });
});

module.exports = router;

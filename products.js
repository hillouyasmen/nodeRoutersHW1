const express = require("express");
const router = express.Router();
const { products } = require("../data");

// שליפה של כל המוצרים
router.get("/", (req, res) => {
  res.json({ allProducts: products });
});

// שליפה לפי מזהה מוצר
router.get("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const found = products.find(p => p.id === productId);

  if (!found) {
    res.status(404).json({ error: `No product with ID ${productId}` });
  } else {
    res.json(found);
  }
});

// הוספת מוצר חדש
router.post("/", (req, res) => {
  const { id, name, price, stock } = req.body;

  // בדיקת ID כפול
  const duplicate = products.some(p => p.id === id);
  if (duplicate) {
    return res.status(400).json({ error: "Product with this ID already exists" });
  }

  // בדיקת שדות חובה
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (price < 0) {
    return res.status(400).json({ error: "Price must be non-negative" });
  }
  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).json({ error: "Stock must be a whole number 0 or higher" });
  }

  // יצירת המוצר
  const newProduct = { id, name, price, stock };
  products.push(newProduct);
  res.status(201).json({ message: "Product created", product: newProduct });
});

// עדכון מוצר קיים
router.put("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ error: `Product with ID ${productId} not found` });
  }

  const { name, price, stock } = req.body;

  if (price !== undefined && price < 0) {
    return res.status(400).json({ error: "Price must be non-negative" });
  }

  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
    return res.status(400).json({ error: "Stock must be a whole number 0 or higher" });
  }

  if (name !== undefined) {
    products[index].name = name;
  }
  if (price !== undefined) {
    products[index].price = price;
  }
  if (stock !== undefined) {
    products[index].stock = stock;
  }

  res.json({ message: `Product ${productId} updated`, product: products[index] });
});

// מחיקת מוצר לפי מזהה
router.delete("/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);

  if (index === -1) {
    return res.status(404).json({ error: `Product with ID ${productId} not found` });
  }

  const removed = products.splice(index, 1);
  res.json({ message: `Product ${productId} deleted`, deleted: removed[0] });
});

module.exports = router;

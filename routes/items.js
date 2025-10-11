const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Item = require("../models/Item");

// Middleware auth
function auth(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalid" });
  }
}

// CRUD
router.get("/", auth, async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

router.post("/", auth, async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.json(item);
});

router.put("/:id", auth, async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(item);
});

router.delete("/:id", auth, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

module.exports = router;

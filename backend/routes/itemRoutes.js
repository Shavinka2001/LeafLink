// itemRoutes.js

const express = require("express");
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemController"); // Update the path as needed

const router = express.Router();

// Route to create a new item
router.post("/", createItem);

// Route to get all items
router.get("/", getAllItems);

// Route to get a single item by ID
router.get("/:id", getItemById);

// Route to update an item by ID
router.put("/:id", updateItem);

// Route to delete an item by ID
router.delete("/:id", deleteItem);

module.exports = router;

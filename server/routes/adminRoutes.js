import express from "express";
import {
  dashboardCounts,
  listUsers,
  adminListStores,
  createUserByAdmin,
  createStoreByAdmin
} from "../controllers/adminController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔹 Dashboard summary
router.get("/dashboard", verifyToken, isAdmin, dashboardCounts);

// 🔹 List users
router.get("/users", verifyToken, isAdmin, listUsers);

// 🔹 List stores
router.get("/stores", verifyToken, isAdmin, adminListStores);

// 🔹 Add user
router.post("/users", verifyToken, isAdmin, createUserByAdmin);

// 🔹 Add store
router.post("/stores", verifyToken, isAdmin, createStoreByAdmin);

export default router;

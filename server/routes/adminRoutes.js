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
router.get("/dashboard", verifyToken, isAdmin, dashboardCounts);
router.get("/users", verifyToken, isAdmin, listUsers);
router.get("/stores", verifyToken, isAdmin, adminListStores);
router.post("/users", verifyToken, isAdmin, createUserByAdmin);
router.post("/stores", verifyToken, isAdmin, createStoreByAdmin);

export default router;

import express from "express";
import { adminmiddleware } from "../middleware/adminmiddleware.js";
import { getMonthlyUtilization } from "../controllers/monthlyutilization.js";
import { getAssociateUtilization } from "../controllers/associateutilization.js";
import { getOrganizationUtilization } from "../controllers/organizationutilization.js";

const router = express.Router()

router.get("/monthly", adminmiddleware, getMonthlyUtilization);
router.get("/associate",adminmiddleware,getAssociateUtilization);
router.get("/organization",adminmiddleware,getOrganizationUtilization);

export default router;
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// POST register
// POST login
// GET logout
// GET session
// POST forgot-password
// GET token-expiration via token
// GET password-reset
// POST account deactivation
router.post("/register", authController_1.userRegistration);
router.post("/login", authController_1.userLogin);
router.get("/session", authController_1.userSession);
router.post("/logout", authController_1.userLogout);
exports.default = router;

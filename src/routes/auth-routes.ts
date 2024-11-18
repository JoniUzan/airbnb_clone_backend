import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import {
  register,
  logIn,
  getUserById,
} from "../controllers/auth-controller";
import { verifyToken } from "../middelware/auth-middelware";
import { signWithGoogle, verifyGoogle } from "../controllers/google-controller";


type Middleware = (req: Request, res: Response, next: NextFunction) => void;

const typedSignGoogle = signWithGoogle as RequestHandler;
const typedVerifyGoogle = verifyGoogle as Middleware;

export const authRoutes = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     description: Create a new user account with the provided details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *               - firstName
 *               - lastName
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       400:
 *         description: User already exists
 *       500:
 *         description: Registration failed
 * 
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Authenticate user
 *     description: Login with email and password to receive JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Authentication failed
 *       500:
 *         description: Login failed
 * 
 * /api/auth/loggedInUser:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve user information by their ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 * 
 */
authRoutes.post("/register", register);
authRoutes.post("/login", logIn);
authRoutes.get("/loggedInUser", verifyToken, getUserById);
authRoutes.post("/google", typedVerifyGoogle, typedSignGoogle);

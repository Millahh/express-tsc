import express from 'express'
const router = express.Router()

import { login, dashboard } from '../controllers/main'

import authMiddleware from '../middleware/auth'

router.route('/dashboard').get(authMiddleware, dashboard)
router.route('/login').post(login)

export default router
import express from 'express'
import { createHadits, getAllHadits, getHaditsByReference, getImage } from '../controllers/hadits.controller.js'


const router = express.Router()

router.get('/hadits', getAllHadits)
router.post('/upload', getImage)
router.post('/create/hadits', createHadits)
router.get('/hadits/:reference', getHaditsByReference)

export default router
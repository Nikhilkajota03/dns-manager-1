import express from 'express';
import {
  createZone ,
  deleteZone,
  listHostZone,
} from '../controllers/domains.controller.js';

const router = express.Router();

router.get('/all', listHostZone);
router.post('/create', createZone );
router.post('/delete', deleteZone);

export default router;

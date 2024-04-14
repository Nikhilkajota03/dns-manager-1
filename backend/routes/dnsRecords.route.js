import express from 'express';
import {
  createMultiDNS,
  createOneDNS,
  deleteDNS,
  getAllDNS ,
  updateDNS,
} from '../controllers/dnsRcords.controller.js';
import {requireLogin} from "../middleware/auth.middleware.js"

const router = express.Router();

router.get('/all',requireLogin, getAllDNS);
router.post('/create-multi',requireLogin, createMultiDNS);
router.post('/create-one',requireLogin, createOneDNS);
router.post('/update',requireLogin, updateDNS);
router.post('/delete',requireLogin, deleteDNS);

export default router;

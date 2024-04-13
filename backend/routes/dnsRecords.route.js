import express from 'express';
import {
  createMultiDNS,
  createOneDNS,
  deleteDNS,
  getAllDNS ,
  updateDNS,
} from '../controllers/dnsRcords.controller.js';

const router = express.Router();

router.get('/all', getAllDNS);
router.post('/create-multi', createMultiDNS);
router.post('/create-one', createOneDNS);
router.post('/update', updateDNS);
router.post('/delete', deleteDNS);

export default router;

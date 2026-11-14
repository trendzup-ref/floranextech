import { sendEnquiry } from "../controller/message.controller.js";
import express from 'express';

const router = express.Router();

router.post("/enquiry", sendEnquiry);

export default router;


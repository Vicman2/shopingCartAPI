const express = require('express');

const adminController = require('../controller/adminController')
const auth = require("../middlewares/auth");

const router = express.Router();


router.post('/add-product',auth.authentication, auth.authorization, adminController.addProduct);
router.post('/make-admin', auth.authentication, auth.authorization, adminController.makeAdmin);



module.exports = router
const express = require('express');

const adminController = require('../controller/adminController')
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validation");

const router = express.Router();


router.post('/add-product',auth.authentication, auth.authorization,validation.productValidation, adminController.addProduct);
router.post('/make-admin', auth.authentication, auth.authorization, adminController.makeAdmin);
router.put('/edit-product/:title', auth.authentication, auth.authorization, adminController.updateProduct);
router.delete('/delete-product/:title', auth.authentication, auth.authorization, adminController.deleteProduct);
router.get('/products',auth.authentication, auth.authorization, adminController.getProduct);


module.exports = router
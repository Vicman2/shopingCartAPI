const express = require('express');


const userController = require("../controller/userController")
const auth = require("../middlewares/auth");
const validation = require("../middlewares/validation")

const router = express.Router();





router.post("/signIn",validation.userValidation, userController.postSignIn);


// oon logging in the user will be redirected to either still using the user routes or the admin Route
router.post("/login",  userController.postLogIn);

router.post("/add-to-cart",auth.authentication, userController.addToCart);
router.get("/viewCart",auth.authentication, userController.viewCart);
router.get('/products', auth.authentication, userController.viewProducts)
router.post('/search-product', userController.searchProduct)



module.exports = router
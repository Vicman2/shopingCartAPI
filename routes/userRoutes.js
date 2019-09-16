const express = require('express');


const userController = require("../controller/userController")
const auth = require("../middlewares/auth");

const router = express.Router();





router.post("/signIn", userController.postSignIn);


// oon logging in the user will be redirected to either still using the user routes or the admin Route
router.post("/login", userController.postLogIn);

router.post("/add-to-cart",auth.authentication, userController.addToCart);
router.get("/viewCart",auth.authentication, userController.viewCart);
router.get('/products', auth.authentication, userController.viewProducts)



module.exports = router
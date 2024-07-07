const express=require('express')
const router=express.Router();
const authController=require('./../controllerss/authController')


router.route('/register')
.post(authController.register)

router.route('/login')
.post(authController.login)


module.exports=router
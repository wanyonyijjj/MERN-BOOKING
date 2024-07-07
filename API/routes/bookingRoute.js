const express=require('express')
const router=express.Router({mergeParams:true})
const bookingController=require('./../controllerss/bookingController')

router
.route('/')
.post(bookingController.createBooking)
.get(bookingController.getAllBookings)


module.exports=router
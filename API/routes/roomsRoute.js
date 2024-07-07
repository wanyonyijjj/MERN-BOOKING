const express=require('express')
const router=express.Router();
const Room=require('./../models/roomModel')
const roomController=require('./../controllerss/roomController')
const authController=require('./../controllerss/authController')

router.use(authController.protect)
router
.route('/')
.get(roomController.getAllRooms)
.post(roomController.uploadRoomImages,roomController.resizeTourImages,roomController.createRoom)
router.route('/:roomId')
.get(roomController.getRoom)

module.exports=router
const mongoose=require('mongoose')


const RoomSchema=new mongoose.Schema({

 name:{
    type:String,
    required:[true,'A room must have a room']
 },
 maxCount:{
    type:Number,
    required:[true,'A room must have a macCount']
 },
 phoneNumber:{
    type:Number,
    required:true
 },
 rentPerDay:{
    type:Number,
    required:true
 },
 ImageUrl:[],
 imageCover:String,
 currentBooking:[],
 type:{
    type:String,
    required:[true,'please choose a room type'],
    enum:['delux','non-delux']
 },
 description:{
    type:String,
    required:true
 },
 rating:{type:Number,
   max:5,
   min:1
 },
 services:String,

},{timestamps:true,})

const Room=mongoose.model('Rooms',RoomSchema)

module.exports=Room
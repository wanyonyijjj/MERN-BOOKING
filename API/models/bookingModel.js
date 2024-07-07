const mongoose=require('mongoose')


const BookingSchema= new mongoose.Schema({
room:{
    type:mongoose.Schema.ObjectId,
    ref:'Room'
},
user:{
 type:mongoose.Schema.ObjectId,
    ref:'User'
},
transactionId:{
    type:String,
    required:true
},
fromDate:{
    type:String,
    required:true
},
toDate:{
    type:String,
    required:true
},
totalAmount:{
    type:Number,
    required:true
},
totalDays:{
    type:Number,
    required:true
},
status:{
    type:String,
    required:true,
    enum:['Booked','Cancelled'],
    default:'Booked'
}
},{timestamps:true})

const Bookings=mongoose.model('bookings',BookingSchema)

module.exports=Bookings
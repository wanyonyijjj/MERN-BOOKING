const Bookings=require('./../models/bookingModel')
const appError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const Room=require('./../models/roomModel')
const moment=require('moment')
exports.createBooking=catchAsync(async(req,res,next)=>{

    const {
            room,
            fromDate,
            toDate,
            user,
            totalDays,
            totalAmount,
    }=req.body

    const newBooking=await Bookings.create({
        room,
        user,
        fromDate,
        toDate,
        totalAmount,
        totalDays,
        transactionId:'1234'
    })
    res.status(201).json({
        status:'success',
        booking:newBooking
    })
     const roomTemp= await Room.findOne({_id:room})
     roomTemp.currentBooking.push({bookingId:newBooking._id,fromDate,toDate,user,status:newBooking.status})
     await roomTemp.save()
})

exports.getAllBookings=catchAsync(async(req,res,next)=>{
    let filter;
    if(req.params.userId) filter={user:req.params.userId}

    const bookings= await Bookings.find(filter)
    res.status(200).json({
        status:'success',
        bookings,
    })
})
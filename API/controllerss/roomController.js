const Room=require('./../models/roomModel')
const multer=require('multer')
const sharp=require('sharp')
const appError=require('./../utils/appError')
const catchAsync = require("./../utils/catchAsync");

const multerstorage=multer.memoryStorage()

const multerfilter=(req,file,cb)=>{
    if(file.mimetype.startsWith('image')){
        cb(null,true)
    }else{
        cb(new appError(400,'Not an image'),false)
    }
}

const upload=multer({
    storage:multerstorage,
    fileFilter:multerfilter
})

exports.uploadRoomImages=upload.fields([
    {name:'imageCover',maxCount:1},
    {name:'ImageUrl',maxCount:3}
])

exports.resizeTourImages=catchAsync(async(req,res,next)=>{
    console.log(req.files)
    // console.log(req.files.imageCover)
    if(!req.files.ImageUrl||!req.files.imageCover) return(next)
const imageCoverfilename=`room-${req.body.name}-${req.user.id}-${Date.now()}-cover.jpeg`
        await sharp(req.files.imageCover[0].buffer)
        .resize(400,400)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/rooms/${imageCoverfilename}`)
        console.log(req.files.imageCover)

        req.body.imageCover=imageCoverfilename

        req.body.ImageUrl=[]
await  Promise.all( req.files.ImageUrl.map(async(file,i)=>{
    const filename=`room-${req.body.name}-${req.user.id}-${Date.now()}-${i+1}.jpeg`
    await sharp(file.buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`public/img/rooms/${filename}`)
        req.body.ImageUrl.push(filename)
}))
    next()
})


exports.getAllRooms=async(req,res)=>{
    try {
        const rooms= await Room.find({})
    return res.status(200).json({
        status:'success',
        rooms
    })
    } catch (error) {
        res.status(400).json({message:error})
    }
}
exports.createRoom=async(req,res)=>{
    try {
        const newRoom= await Room.create(req.body)
        res.status(201).json({
            room:{newRoom}
        })
    } catch (error) {
        res.status(400).json({message:error})  
    }
}
exports.getRoom=async(req,res)=>{
    const roomId=req.params.roomId
    try {
        const room= await Room.findOne({_id:roomId})
    return res.status(200).json({
        status:'success',
        room
    })
    } catch (error) {
        res.status(400).json({message:error})
    }
}

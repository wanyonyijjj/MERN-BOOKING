const express=require('express')
const app=express()
const morgan=require('morgan')
const cors=require('cors')
const corsOptions={
    origin:'http://localhost:3000'
}
app.use(express.json())
app.use(express.static('public'))

const globalErrorHandler=require('./controllerss/errorController')
const appError=require('./utils/appError')
app.use(morgan('dev'))
app.use(cors(corsOptions))
const roomsRoute=require('./routes/roomsRoute')
const userRoute=require('./routes/usersRoute')
const authRoute=require('./routes/authRoute')
const bookingsRoute=require('./routes/bookingRoute')

app.use(globalErrorHandler)
app.use('/api/rooms',roomsRoute)
app.use('/api/users',userRoute)
app.use('/api/auth',authRoute)
app.use('/api/bookings',bookingsRoute)
app.all('*',(req,res,next)=>{
    next(new appError(404,`cant find the ${req.originalUrl} on this server`));
    });
const PORT=process.env.PORT
app.listen(PORT,()=>console.log(`app listening on PORT:${PORT}`))
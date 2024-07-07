const dotenv=require('dotenv')
dotenv.config({path:'./config.env'});
const app=require('./app')
const moongoose=require('mongoose')
const DB=process.env.LOCAL_DATABASE
moongoose.connect(DB).then(()=>console.log('server connected to MONGODB'))


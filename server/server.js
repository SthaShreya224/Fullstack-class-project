const express = require('express');
const cookieParser = require('cookie-parser');
const logger=require('./middleware/logger')
const hellomiddleware=require('./middleware/hellomiddleware')
const one=require('./middleware/one')
const two=require('./middleware/two')
const three=require('./middleware/three')
const auth = require('./controller/authenticationToken');
const app = express()
// sepecify the format will be in json
app.use(express.json())
app.use(cookieParser());
app.use(express.static('public'))
const port = 3000

// connect the mongo db database
const mongoose=require('mongoose')
require('dotenv').config()

//for using token
const jwt = require('jsonwebtoken')
require('dotenv').config()


// importing user schema
const User=require('./models/user')
// make a route
app.post('/create/user',async (req,res,next)=>{
    try{
        // create a user
        const user=await User.create(req.body)
        res.status(201).json({
            "success":true,
            data:user
        })
    }
    catch (error) {
        res.status(500).json({
            "success":false,
            "error":error.message
            })
    }
}) 

// // login api
// app.post('/read/user',async(req,res,next)=>{
//     try{
//         const token="randomgeneratedtoken";
//         const user=User.findOne({email: req.body.email})
//         if(user.password==req.body.password)
//         {
//             res.cookie("token",token,{
//                 httpOnly:true,
//                 secure:false,
//                 sameSite: "lax",
//             }
//             )
//             // res.status(200).json({
//             //     "token": token
//             // })
//         }
//     }catch(error){
//         res.status(500).json({
//         "message":error.message
//         })
//     }
// })

//login 
app.post('/login',async(req,res,next)=>{
try{
    console.log("login api called")
    const {email, password} = req.body

    if(!email || !password){
        return res.status(400).json({
            message:"Email and password are required"
        })
    }

    const user = await User.findOne({email})

    if(!user || user.password !== password){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }

    //issue token by backend
    const token = jwt.sign({
        userId: user._id.toString(), email: user.email},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    )
    
    //save the token in cookie in frontend
    res.cookie('token',token,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60*60*1000
    })

    return res.status(200).json({
        success: true,
        message: 'login successful',
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            age:user.age
        }
    })
}
catch(error){
    res.status(500).json({
        "message":error.message
    })
}}
)

//make /me for authentication
app.get('/me', auth.authenticateToken, auth.me)

// read 
app.get('/read/user',async (req,res,next)=>{
    try{
        // read a user
        const user=await User.find(); //find users in database
        res.status(201).json({
            "success":true,
            data:user
        })
    }
    catch (error) {
        res.status(500).json({
            "success":false,
            "error":error.message
            })
    }
}) 

// // delete
// app.delete('/delete/user/',async (req,res,next)=>{
//     try{
//         // password check
//         // get password
//         const password=req.query.password;
//         // get the requested users information
//         const myuser=await User.findById(req.query.id);
//         if(myuser.password===password)
//         {
//             console.log("password matched")
//             const user=await User.findByIdAndDelete(req.query.id); //find all users in database
//             return res.status(200).json({
//                 "success":true,
//                 data:user
//             })

//         }
//         else{
//             console.log("password not matched")
//            return res.status(403).json({
//             "message":"password not matched"
//         });
//         }

//         // read a user
//         console.log(req.query.id)
//         const user=await User.findByIdAndDelete(req.query.id); //delete user in database
//         res.status(201).json({
//             "success":true,
//             data:user
//         })
//     }
//     catch (error) {
//         res.status(500).json({
//             "success":false,
//             "error":error.message
//             })
//     }
// }) 

// patch
// update information partially
app.patch('/update/user/',async (req,res,next)=>{
    try{
        // read a user
        console.log(req.query.id)
        const user=await User.findByIdAndUpdate(req.query.id, req.body, { new: true }); //update particular user in database
        res.status(201).json({
            "success":true,
            data:user
        })
    }
    catch (error) {
        res.status(500).json({
            "success":false,
            "error":error.message
            })
    }
}) 

// put
// update entire information
app.put('/update/user/:id',async (req,res,next)=>{
    try{
        // read a user
        // console.log(req.query.id)
        const user=await User.findByIdAndUpdate(req.params.id, req.body); //update particular user in database
        // create promise with success and failure
        res.status(201).json({
            "success":true,
            data:user
        })
    }
    catch (error) {
        res.status(500).json({
            "success":false,
            "error":error.message
            })
    }
}) 


// connection 
const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongo db database connected successfully")
    }
    catch (error) 
    {
        console.error("error while connecting", error)
        process.exit(1)
    }
}

// logger defination
// const logger=function(req, res, next) {
//     console.log("logger called")

//     // This is most important part
//     // middleware always calls next function
//     // rather than giving response
//     next();
// }
// for calling middleware we use app.use
app.use(logger); 

// export default logger;

app.get('/',one,two,three, (req, res) => {
    res.send('Hello World!')
})

// making our first request 
app.get("/hello",hellomiddleware,(req, res)=>{
    // header value
    console.log("header value:",req.headers.myheader)
    // getting params
    console.log("params value:",req.query.mparams)
    // response
    res.status(200).json({
        "message":"hello"
    })
})

// endpoint post to get body
app.post("/data",(req, res)=>{
    console.log(req.body)
    res.status(200).json({
        message:"success"
    })
})

app.get("/name",(req, res)=>{
    // response
    res.status(200).json({
        "name":"Shreya"
    })
})

// implementing middleware


connectDB().then(()=>{
    app.listen(port, ()=>{
        console.log(`Example app listening on port ${port}`)
    })
})
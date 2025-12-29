import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique : true
    },
    firstName :{
        type : String,
        required : true
    },
    lastName :{
        type : String,
        required : true
    },
    password :{
        type : String,
        required : true
    },
    role :{
        type : String,
        required : true,
        default : "customer"
    },
    isBlocked :{
        type : Boolean,
        required : true,
        default : false
    },
    img : {
        type : String,
        required : true,
        default : "https://tse4.mm.bing.net/th/id/OIP.PkrwrLwaq68CaqLPn7jBIwHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
    }
})

const User = mongoose.model("users",userSchema)

export default User
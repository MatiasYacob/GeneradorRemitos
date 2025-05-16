
import bcrypt from "bcryptjs";



const usuarios = [{
    user: "admin",
    email: "admin",
    password: "admin"
}]




async function login(req, res){

};
async function register(req, res){
    console.log(req.body);
const user = req.body.user;
const email = req.body.email;
const password = req.body.password;
if (!user || !email || !password){
    return res.status(400).json({status:"error", message: "All fields are required"});
    }
const userExists = usuarios.find((u) => u.user === user);   
if (userExists){
    return res.status(400).json({status:"error", message: "User already exists"});  
}

const salt = await bcrypt.genSalt(5);
const hashedPassword = await bcrypt.hash(password, salt);
const newUser = {
    user,
    email,
    password: hashedPassword        
}
usuarios.push(newUser);
console.log(usuarios);
return res.status(201).json({status:"success", message: "User created successfully", redirect: "/"});

};




async function logout(req, res){

};


export const methods ={
    login,
    register,
    logout

}
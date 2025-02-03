

const users = [];
const registerUser = (req , res) =>{
    try {
        const {name , phone , password} = req.body;
        console.log("Working!!");
    if(!name || !phone || !password){
        
        return res.status(400).json({message:"All fields are required!"});
    }
    const newUser = {name , phone , password};
    users.push(newUser);  
    res.status(200).json({message:"User Registered Successfully!"});  
    } catch (error) {
        console.log(error);
        
    }

}

const getUsers = async(req , res) =>{
    res.status(200).json(users);
}

export {
    registerUser,
    getUsers
}

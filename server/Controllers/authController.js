const userModel = require("../Models/userModel");

exports.userRegister = async(req, res) => {
    try{
        const { email, password, confirmPassword, name, Mobile } = req.body.formData;
        if(req.body.isLogin == true){
            if(email == "" && password == "")
                return res.status(400).json({ message: "Email and password are required" });
            const userExist = await userModel.findOne({ Email : email });
            if(userExist){
                if(userExist.Password == password){
                    return res.status(400).json({ message: "Login Success" });
                } else {
                    return res.status(400).json({ message: "Invalid Password" });
                }
            } else {
                return res.status(400).json({ message: "User does not exist" });
            }
        } else if (req.body.isLogin == false){
            if(email != "" && password != "" && confirmPassword != "" && name != "" && Mobile != ""){
                console.log("Create Account Working");
                let genUserId = '';
                if(await userModel.findOne({ Email : email }))
                    return res.status(202).json({ message : "Email Already Exist"})
                const user = await userModel.find();
                // if(!user)
                    genUserId = `RAYA/U001/${Date.now()}`;
                console.log(genUserId);
            } else {
                return res.status(202).json({ message: "Please fill all the fields" });
            }
        }
    } catch(err){
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}
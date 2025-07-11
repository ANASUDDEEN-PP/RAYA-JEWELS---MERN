const userModel = require("../Models/userModel");
const profileModel = require("../Models/profileModel");
const cartModel = require("../Models/addToChart");
const notifyModel = require("../Models/notificationModel");
const DateFormat = require("../utils/dateFormat");
const sendNotify = require("../utils/sendNotify");

exports.userRegister = async (req, res) => {
    try {
        const { email, password, confirmPassword, name, Mobile } = req.body.formData || {};
        const isLogin = req.body.isLogin;

        if (isLogin === true) {
            // --- LOGIN SECTION ---
            console.log("Login")
            const adminArray = ["admin@raya.com", "admin@000"]
            if (!email || !password) {
                return res.status(201).json({ message: "Email and password are required" });
            }

            if(email == adminArray[0] && password == adminArray[1]){
                return res.status(202).json({
                    message : "ADMLGN",
                    navigate: '/admin-dash',
                    Code: `ADMRAYA${Date.now()}`
                })
            }

            const userExist = await userModel.findOne({ Email: email });
            if (!userExist) {
                return res.status(201).json({ message: "User does not exist" });
            }
            const userWithoutPassword = { ...userExist.toObject() };
            delete userWithoutPassword.Password;
            const profileImg = await profileModel.findOne({ userId : userWithoutPassword._id, from: "USRDBI" })

            if (userExist.Password === password) {
                return res.status(202).json({ message: "Login Success", user: userWithoutPassword, profileImg });
            } else {
                return res.status(201).json({ message: "Invalid Password" });
            }

        } else if (isLogin === false) {
            // --- REGISTER SECTION ---
            // console.log("Create Account");

            if (!email || !password || !confirmPassword || !name || !Mobile) {
                return res.status(201).json({ message: "Please fill all the fields" });
            }

            if (password !== confirmPassword) {
                return res.status(201).json({ message: "Passwords do not match" });
            }

            const existingUser = await userModel.findOne({ Email: email });
            if (existingUser) {
                return res.status(201).json({ message: "Email already exists" });
            }

            const isMobileExist = await userModel.findOne({ Mobile : Mobile })
            if(isMobileExist){
                return res.status(201).json({ message : "Mobile Number already exist"})
            }

            // Generate userId
            let genUserId = '';
            const userCount = await userModel.countDocuments();

            if (userCount === 0) {
                genUserId = `RAYA/U001/${Date.now()}`;
            } else {
                const lastUser = await userModel.findOne().sort({ _id: -1 });
                const lastId = lastUser.userId?.split("/")[1] || "U000";
                const numericPart = parseInt(lastId.substring(1)) + 1;
                const paddedId = numericPart.toString().padStart(3, "0");
                genUserId = `RAYA/U${paddedId}/${Date.now()}`;
            }

            const userData = {
                userId: genUserId,
                Name: name,
                Mobile: Mobile,
                isMobileVerified: false,
                Email: email,
                isEmailVerified: false,
                Password: password
            };
            const userPushData = await userModel.create(userData);
            const profileData = {
                userId : userPushData._id,
                from : 'USRDBI',
                ImageUrl : ""
            }
            await profileModel.create(profileData)

            const cartData = {
                UserId : userPushData._id,
                Date : Date.now(),
                Items : []
            }
            await cartModel.create(cartData);
            sendNotify({name, email, Mobile}, "USRG");
            return res.status(200).json({ message: "User created successfully" });
        } else {
            return res.status(400).json({ message: "Invalid request" });
        }

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAllUsers = async (req, res) => {
    try{
        const users = await userModel.find({});
        return res.status(200).json({
            users
        })
    } catch(err){
        return res.status(404).json({
            message : "Internal Server Error"
        })
    }
}

exports.getUserById = async (req, res) => {
    try{
        const { id } = req.params;
        if(!id)
            return res.status(404).json({ message : "InvalidID"}); 
        
        const user = await userModel.findById(id);

        return res.status(200).json({user})
    } catch(err){   
        return res.status(404).json({ message : "Internal Server Error" });
    }
}

exports.setUserProfileImage = async(req, res) => {
    try{
        const { profileImage } = req.body;
        const { id } = req.params;

        const isProfile = await profileModel.findOne({userId : id})

        if(!await userModel.findById(id) && !isProfile)
            return res.status(404).json({ message : "InvalidID"});
        const profile = await profileModel.findByIdAndUpdate(
            isProfile._id,
            { $set : {
                ImageUrl : profileImage
            }},
            { new : true }
        )
        
        return res.status(200).json({
            message : "Profile Image Updated...",
            profile
        })
    } catch(err){
        return res.status(404).json({
             message : "Internal Server Error"
        })
    }
}

exports.getProfileImage = async(req, res) => {
    try{
        const { id } = req.params
        const isProfile = await profileModel.findOne({ userId : id });
        
        if(!await userModel.findById(id) && !isProfile)
            return res.status(404).json({ message : "InvalidID"});

        return res.status(200).json({
            isProfile
        })
    } catch(err){
        return res.status(404).json({
            message : "Internal Server Error"
        })
    }
}

exports.editUserProfileData = async(req, res) => {
    try{
        const { id } = req.params;
        const { Name, Email, Mobile } = req.body;

        if(!await userModel.findById(id))
            return res.status(404).json({ message : "InvalidID" });

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { $set : {
                Name, Mobile, Email
            }},
            { new: true }
        );

        const userWithoutPassword = { ...updatedUser.toObject() };
        delete userWithoutPassword.Password;

        return res.status(200).json({
            message : "Profile Data Updated...",
            userWithoutPassword
        })
        // console.log(req.body)
    } catch(err){
        return res.status(404).json({ message : "Internal Server Error" });
    }
}
const userModel = require("../Models/userModel");
const profileModel = require("../Models/profileModel");

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

            if (userExist.Password === password) {
                return res.status(202).json({ message: "Login Success", user: userWithoutPassword });
            } else {
                return res.status(201).json({ message: "Invalid Password" });
            }

        } else if (isLogin === false) {
            // --- REGISTER SECTION ---
            console.log("Create Account");

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
                Email: email,
                Password: password
            };
            const userPushData = await userModel.create(userData);
            const profileData = {
                userId : userPushData._id,
                from : 'USRDBI',
                ImageUrl : ""
            }
            await profileModel.create(profileData)
            return res.status(200).json({ message: "User created successfully" });
        } else {
            return res.status(400).json({ message: "Invalid request" });
        }

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

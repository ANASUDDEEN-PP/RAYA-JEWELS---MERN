exports.addOrder = async(req, res) => {
    try{
        console.log(req.body)
    } catch(err){
        return res.status(404).json({
            message : "Internal Server Error"
        })
    }
}
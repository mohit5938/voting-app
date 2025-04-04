const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {jwtAutMiddleware,generateToken} = require('../jwt');

router.post('/signup', async (req, res) => {
    try {

        
        const data = req.body

        if( data.role === 'admin'){
            const newadminrole = await User.findOne({role:'admin'});
            console.log(newadminrole.role)
            if( newadminrole){
                return res.status(403).json({message:'admin alreadyexist'})
            }
        }
        const newUser = new User(data);


        const response = await newUser.save();
        console.log("data saved");
        const payload = {
            id: response.id
        }
        const token = generateToken(payload);
        console.log("Token is: ",token);
        res.status(200).json({response: response,token:token});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server problem' });
    }
})

router.get('/profile',jwtAutMiddleware,async (req,res)=>{
    try {
        const userData = req.user;
        console.log("user data:",userData);

        const userId = userData.id;
        // finding in database
        const user = await User.findById(userId);
        // then send it into response
        res.status(200).json({user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "internal server problem" });
    }
})

router.post('/login', async(req,res)=>{
    try{
        const {aadharCardNumber,password} = req.body;
        const user = await User.findOne({aadharCardNumber:aadharCardNumber});

        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error:"invalid username and password"});

        }

        const payload ={
            id : user.id,
        
        }
        const token = generateToken(payload);
        res.json({token})
    }
    catch(error){
        console.log(error);
        res.status(500).json({ error: 'internal server problem' });
    }
})


router.put('/profile/password',jwtAutMiddleware, async(req,res)=>{
    try {
        //extract id from token
        const userid = req.user.id;
        // extract curr and new password
     const {currentPassword, newPassword} = req.body;
         
        const user = await User.findById(userid);

        if( !(await user.comparePassword(currentPassword)) ){
            return res.status(401).json({error:"invalid username and password"});

        }

        // updater the user's password
        user.password = newPassword;
        await user.save();
        console.log('password changed');
       
        res.status(200).json({message:"password updated"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server problem' });
    }
})



module.exports = router;
// commit add
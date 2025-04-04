const express = require('express');
const router = express.Router();

const User = require('../models/user')
const { jwtAutMiddleware, generateToken } = require('../jwt');
const candidate = require('../models/candidate');

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);

        console.log(user.role);

        return user.role === 'admin'
    } catch (error) {
        return false;
    }
}




router.post('/', jwtAutMiddleware, async (req, res) => {
    try {
        console.log(req.user.id)
        if (! await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "user does not have admin role" })
        }

        const data = req.body
        const newCandidate = new candidate(data);


        const response = await newCandidate.save();
        console.log("data saved");

        res.status(200).json({ response: response });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server problem' });
    }
})

router.put('/:candidateid', jwtAutMiddleware, async (req, res) => {

    try {
        if (! await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "userdoes not have admin role" })
        }
        const candidateid = req.params.candidateid;
        const updatecandidatedata = req.body;

        const response = await candidate.findByIdAndUpdate(candidateid, updatecandidatedata, {
            new: true,
            runValidators: true,
        })

        if (!response) {
            res.status(404).json({ error: "candidate is not found" });

        }

        console.log('data updated');
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server problem' });
    }
})


router.delete('/:candidateid', async (req, res) => {

    try {
        if (! await checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: "userdoes not have admin role" })
        }
        const personid = req.params.id
        const response = await person.findByIdAndDelete(personid);
        if (!response) {
            res.status(404).json({ error: "persom is not found" });

        }

        console.log('person deleted');
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server problem' });
    }
})

router.post('/vote/:candidateID', jwtAutMiddleware, async (req, res) => {
   const candidateID = req.params.candidateID;
    const userID = req.user.id;
    try {
        const newCandidate = await candidate.findById(candidateID);
        if (!newCandidate) {
            return res.status(404).json({ message: 'candidate not found' })
        }

        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'user  not found' })
        }
        if( user.isvoted){
           return res.status(400).json({ message: 'user have already voted' })
        }
        if( user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed ' })
        }

        newCandidate.votes.push({user:userID})
        newCandidate.voteCount++;
        await newCandidate.save();

        // update user document
        user.isvoted = true;
        await user.save();

        res.status(200).json({message:'vote recorded succesfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server problem' });
    }
})

router.get('/vote/count', async(req,res)=>{
    try {
        const Candidate = await candidate.find().sort({voteCount:'desc'});

        const voteRecord = Candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount 
            }
        })
        return res.status(200).json(voteRecord);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'internal server problem' });
    }
})

// finb list of candidate

router.get('/candidatelist', async(req,res)=>{
    try {
        const Candidate = await candidate.find();
        console.log(Candidate)
        const lists = Candidate.map((data)=>{
            return {
                party: data.party
                
            }
        })
       return  res.status(200).json(lists);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'internal server problem' });
    }
})
module.exports = router;
// commit add
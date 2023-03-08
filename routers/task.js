const express = require('express');
const { ObjectId } = require('mongoose');
const Task = require('../models/task'); 
const auth = require('../middlewear/auth');
const { compareSync } = require('bcrypt');
const router = express.Router();

router.post('/tasks' , auth , async (req,res) => {
    const task = await Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(200).send(task)
    }

    catch (e) { res.send('404 ERROR') }
})

router.get('/tasks/:id' , auth ,async (req,res)=>{
    const _id = req.params.id
    try {
    const task = await Task.findOne({_id, owner: req.user._id})
    res.send(task)
    } 
    catch(e) { res.status(500).send('not found')}
})


// GET /tasks?completed=true
router.get('/tasks' , auth , async (req,res)=>{
    const match= {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed==='true';
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'?-1:1
    }

    try {
        await req.user.populate({ path:'tasks', 
         match,
        options:{
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            sort
        }
    }).execPopulate()
        res.send(req.user.tasks)
    }
    catch  { res.status(500).send()}
})

router.patch('/tasks/:id' ,auth, async(req,res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((updates) => allowedUpdates.includes(updates))
    if(!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates'})
    }

    try{
        const task = await Task.findOne({_id: req.params.id , owner:req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        updates.forEach(updates => {
            task[updates] = req.body[updates]
        });
        await req.user.populate('tasks').execPopulate()
        await task.save()
        res.send(req.user.tasks)
    }
    catch {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth ,async (req, res) => {
    const task = await Task.findOneAndDelete({_id:req.params.id , owner:req.user._id})
    try {

        if (!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
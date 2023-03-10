const express = require('express');
const { ObjectId } = require('mongoose');
const Task = require('../models/task'); 
const auth = require('../middlewear/auth');
const router = express.Router();
const client  = require('../services/redis')
// const getTask  = require('../middlewear/cache')

const checkCache = async (_id) =>{
        const cacheRes = await client.get(_id);
        if( cacheRes){
            // isCached = true;
            let task = JSON.parse(cacheRes);
            let resp =  {
                fromCache: true,
                data: task,
              };
             return resp;
        }
        return {
            fromCache: false
        }
}

router.post('/tasks' , auth , async (req,res) => {
    const task = await Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.status(200).send(task)
    }
    catch (e) { console.log(e); res.send({
        statusCode: 400,
        msg:e
    }) }
})


router.get('/tasks/:id' , auth , async (req,res)=>{
    const _id = req.params.id
    try {
        // redis function to access task model 
        const resp = await checkCache(_id)
        if(resp.fromCache)
        {
            res.send(resp.data)
        }
        else {
            const task = await Task.findOne({_id, owner: req.user._id})
            await client.set( _id , JSON.stringify(task), {
                EX: 3600 ,
                NX: true
            })
            res.send(task)
        }
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
    const allowedUpdates = ['name' ,'description', 'completed']
    const isValidOperation = updates.every((updates) => allowedUpdates.includes(updates))
    if(!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates'})
    }
    try{
        const task = await Task.findOne({_id: req.params.id , owner:req.user._id})
        if(!task){
            return res.status(404).send('Invalid Id')
        }
        updates.forEach(updates => {
            task[updates] = req.body[updates]
        });
        await req.user.populate('tasks').execPopulate()
        await task.save()
        // redis queries
        await client.del(req.params.id , function(err, response) {
            if (response == 1) {
               console.log("Deleted Successfully!")
            } else{
             console.log("Cannot delete")
            }
         })
        await client.set( req.params.id , JSON.stringify(task), {
            EX: 3600 ,
            NX: true
        })
        // end of redis queries
        res.send(req.user.tasks)
    }
    catch (e){
        res.status(400).send('error')
    }
})

router.delete('/tasks/:id', auth , async (req, res) => {
    const task = await Task.findOneAndDelete({_id:req.params.id , owner:req.user._id})
    try {
        if (!task) {
            res.status(404).send('task not found')
        }
        await client.del(req.params.id , function(err, response) {
            if (response == 1) {
               console.log("Deleted Successfully!")
            } else{
             console.log("Cannot delete")
            }
         })
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
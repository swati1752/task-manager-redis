const client = require("../services/redis");


const getTask = async ( req, res, next) =>{
    const TaskId = req.params.id;
    var task;
    
    try {
        
        const cacheRes = await client.get(TaskId);
        if( cacheRes){
            // isCached = true;
            task = JSON.parse(cacheRes);
            console.log('Data is present in cache');
            res.send({
                fromCache: true,
                data: task,
              });
        }
        else {
            next();
        }
    }
    catch (error) {
      console.log(error);
      res.status(404).send("Data unavailable");
    }
}

module.exports = getTask;
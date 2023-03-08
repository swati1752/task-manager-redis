const { getAsync , setAsync  } = require("../services/redis");

var TaskCache = []

const getTask = async ( req, res, next) =>{
    const TaskId = req.params.id;
    var task;

    try {
        const cacheRes = await getAsync(TaskId);
        if( cacheRes){
            // isCached = true;
            task = JSON.parse(cacheRes);
            res.send({
                fromCache: true,
                data: task,
              });
        }
        else {
            next()
        }

    }
    catch (error) {
      console.error(error);
      res.status(404).send("Data unavailable");
    }
}

module.exports = getTask;
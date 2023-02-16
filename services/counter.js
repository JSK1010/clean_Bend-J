const tracks = require("../models/tracks");


module.exports = {
    counter:async function counter(){ 

    await tracks.updateOne({count:'tracks'},{$inc:{"SES" : 1}},function(docs,err){
    if(!err){
      console.log('updated')
      return docs.SES
    }
    else{
        console.log(err)
    }
  })
}
}
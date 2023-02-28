const tracks = require("../models/tracks");


module.exports = {
  counter: async function counter(Domain) {
    await tracks.findOneAndUpdate({ name: Domain }, { $inc: { count: 1 } }, function (data, err) {
      if (!err) {
        var count = data.count
        return count
      }
      else {
        console.log(err)
        return 0
      }
    });
  }
}
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  team: String
});

UserSchema.statics.findOrCreate = function findOrCreate(profile, cb){
    var userObj = new this();
    this.findOne({username : profile.user_id},function(err,result){
        if(!result){
            userObj.username = profile.user_id;
            //....
            userObj.save(cb);
        }else{
            cb(err,result);
        }
    });
};

// use team as reference instead of hardcoded


module.exports = mongoose.model("User", UserSchema);

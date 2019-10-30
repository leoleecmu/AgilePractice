var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var Schema = mongoose.Schema;

/*User schema - attributes*/
var UserSchema = new Schema({

  //if unique is true, that means it is used as key
  email: { 
  	type: String,
  	unique: true,
  	lowercase: true
  },

  password: String,

  profile: {
    name: { 
    	type: String,
    	default: ''
    },
    picture: { 
    	type: String, 
    	default: ''
    }
  },

  address: String,
  history: [{
    date: Date,
    paid: { type: Number, default: 0},
    // item: { type: Schema.Types.ObjectId, ref: ''}
  }]
});


/*generate Hash for password*/
UserSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/*Export*/
module.exports = mongoose.model('User', UserSchema);
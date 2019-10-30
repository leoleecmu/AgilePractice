var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

/*User schema - attributes*/
var UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password : String,

	profile: {
		name : {
			type: String,
			default: ''
		},
		picture{
			type: String,
			default: ''
		}
	},

	history: [
		{
			date: Date,
			paid: {
				type: Number,
				default: 0
			}
		}
	]
});


/*generate Hash for oassword*/
UserSchema.pre('save', function(next) {

	var user = this;
	//isModified[pasth] return true if the target is modified 
	if(!user.isModified('password')) return next();

	bcrypt.genSalt(10, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, null, function(err, hash) {
			if(err) throw err;
			user.password = hash;
			next();
		});
	});
});

/*Export*/
module.exports = mongoose.model('User', UserSchema);
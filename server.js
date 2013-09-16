var util = require('util');
var connect = require('connect')
var port = 3000

// This is for Backbone testing...
connect.createServer(connect.static(__dirname)).listen(port);
 
var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var GoogleOAuthStrategy = require('passport-google-oauth').OAuth2Strategy;
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var url = require('url');



var GOOGLE_CLIENT_ID = '732107267691-89flpo4urlg9u4naeo78liklb08krab8.apps.googleusercontent.com';
var GOOGLE_CLIENT_SECRET = 'JQG4V80UuGkguTD8C3s6kC5q';
var GOOGLE_CALLBACK_URL = 'http://localhost:4567/Account/ExternalLoginCallback';

// Passport session setup.
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

var mongooseUtility = (
	function() {
		return {
			connect: function() {
				mongoose.connect('mongodb://localhost/mydb');
				var db = mongoose.connection;

				db.on('error', console.error.bind(console, 'connection error:'));
				db.once('open', function callback() {
					console.log('Connected to MongoDB...');
				});
			},
			userSchema: function() {
				var schema = mongoose.Schema({
					provider: String,
					uid: String,
					name: String,
					image: String,
					created: {type: Date, default: Date.now},
					lastUpdated: {type: Date, default: Date.now},
					lastLogin: {type: Date, default: Date.now}
				});
				schema.methods.validPassword = function(password) {
					if (password === this.password) {
						return true;
					}
					else {
						return false;
					}
				}
				return schema;

			}
		}
	}
)();

mongooseUtility.connect();
var User = mongoose.model('User',  mongooseUtility.userSchema());
//var user = new User({username: 'John', password: 'Doe'});

// **********************************************************************
// Using MongoDB native driver.
// **********************************************************************
//var Server = mongo.Server;
//var Db = mongo.Db;
//var BSON = mongo.BSONPure;

// **********************************************************************
// Using Mongoose.
// **********************************************************************
passport.use(new GoogleOAuthStrategy({
		clientID: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		callbackURL: GOOGLE_CALLBACK_URL
	},
	function(accessToken, refreshToken, profile, done) {
		var userProfile = JSON.parse(JSON.stringify(profile));

		User.findOne(
			{uid: profile.id},
			function(err, user) {
				// Match found.
				if (user) {
					console.log('User found in DB...');
					done(null, user);
				}
				else {
					console.log('User not found, creating new...');
					var user = new User();
					user.provider = 'google';
					user.uid = userProfile.id;
					user.email = userProfile.email;
					user.name = userProfile.name;
					user.save(function(err) {
						if (err) {
							throw err;
						}
						done(null, user);
					});
				}
			}
		);

	}
));

// passport.use(new googleStrategy({
// 		returnURL: 'http://localhost:4567/Account/ExternalLoginCallback',
// 		realm: 'http://localhost:4567'
// 	},
// 	function(identifier, profile, done) {
// 		var user = JSON.parse(JSON.stringify(profile));

// 		var userID = url.parse(identifier, true).query.id;

// 		console.log('Identifier: ' + userID)
// 		console.log('Profile: ' + user);

// 		console.log('Primary email: ' + profile.emails[0].value)

// 		User.findOne(
// 			{uid: profile.id},
// 			function(err, user) {
// 				// Match found.
// 				if (user) {
// 					done(null, user);
// 				}
// 				else {
// 					var user = new User();
// 					user.provider = 'google';
// 					user.uid = userID;
// 					user.email = profile.emails[0].value;
// 					user.name = profile.displayName;
// 					// user.image =
// 					user.save(function(err) {
// 						if (err) {
// 							throw err;
// 						}
// 						done(null, user);
// 					});
// 				}
// 			}
// 		);
			
// 	}
// ));


//var app = express();
var app = express.createServer();

// Configure Express.
app.configure(function() {
	//app.set('views', __dirname + '/views');
	//app.set('view engine', 'ejs');
	// app.use(express.logger());
	// app.use(express.cookieParser());
	// app.use(express.bodyParser());
	// app.use(express.methodOverride());
	// app.use(express.session({secret: 'keyboard cat'}));

	// Initialize Passport.
	app.use(passport.initialize());
	app.use(passport.session());
	//app.use(app.router);
	//app.uses(express.static(__dirname + '/public'));
});


// Route configuration.
app.get('/', function(req, res) {
	res.send('Hello World');
});

app.get('/account', ensureLoggedIn('/login'), function(req, res) {
	res.send('Hello ' + req.user.username);
});

app.get('/login', function(req, res) {
	res.send('<html><body><a href="/auth/twitter">Sign in with Twitter</a></body></html>');
});

app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/mongoose', function(req, res) {
	test = mongooseTest.connect('testing');
});

app.get('/auth/google', 
	passport.authenticate('google',
		{ scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }),
	function(req, res) {
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
	}
);

app.get('/login/success', function(req, res) {
	console.log('Login successful!');
	console.log(res);
});

// Comes here when login completed as either success or fail.
app.get('/Account/ExternalLoginCallback',
	passport.authenticate('google', { successRedirect: '/login/success', failureRedirect: '/login' })
);



var mongooseTest = (
	function() {
		return {
			connect:  function(message) {
				console.log('Connecting...');
				mongoose.connect('mongodb://localhost/mydb');

				var db = mongoose.connection;
				db.on('error', console.error.bind(console, 'connection error:'));
				db.once('open', function callback() {
					console.log('Yay!');
				});

				var kittySchema = mongoose.Schema(
				{
					name: String
				});

				kittySchema.methods.speak = function() {
					var greeting = this.name ? 'Meow name is ' + this.name : 'I don\'t have a name';
					console.log(greeting);
				}

				var Kitten = mongoose.model('Kitten', kittySchema);

				var silence = new Kitten({name: 'Silence'});
				console.log(silence.name);

				var fluffy = new Kitten({name: 'fluffy'});
				fluffy.speak();

				//fluffy.save(function(err, fluffy) {
					//if (err)
					//fluffy.speak();
					
				//});

				Kitten.find(function (err, kittens) {
				  if (err) // TODO handle err
				  console.log(kittens)
				});

				Kitten.find({name: /^Fluff/ }, function() { console.log('test'); });
			}

		}
	}
)();








app.listen(4567);

util.puts('Listening on + port ' + port + '...');
util.puts('Press CTRL + C to stop');

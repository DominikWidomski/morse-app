'use strict';

// Import all our dependencies
var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var server   = require('http').Server(app);
var io       = require('socket.io')(server);

// tell express where to serve static files from
app.use(express.static(__dirname + '/public'));

// allow CORS
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

/*||||||||||||||||||||||ROUTES|||||||||||||||||||||||||*/
// route for our index file
app.get('/', function(req, res) {
  //send the index.html in our public directory
  res.sendfile('index.html');
});

// route for our index file
app.get('/admin', function(req, res) {
  //send the index.html in our public directory
  res.sendfile('public/admin.html');
});

/*||||||||||||||||||END ROUTES|||||||||||||||||||||*/


/*|||||||||||||||| GLOBAL VARS ||||||||||||||||*/
const MORSE_GROUP = 'morse';
const ADMIN_GROUP = 'admin';

let users = [];
let adminUsers = [];
/*||||||||||||||| END GLOBAL VARS |||||||||||||*/


/*||||||||||||||||SOCKET|||||||||||||||||||||||*/

/* DEFAULT NAMESPACE */
io.on('connection', function(socket) {
  var thisUser = null;

  //Emit the rooms array
  socket.emit('setup', {
    // rooms: rooms
  });

  socket.on('disconnect', function(){
    console.log('LEFT', thisUser ? thisUser.username : "NOT SPECIFIED");
  });

  // Registe User View, for sending signals
  socket.on('registerUserView', function(user) {
    //New user joins the default room
    socket.join(MORSE_GROUP);

    users.push(user);

    thisUser = user;

    //Tell all those in the room that a new user joined
    io.in(MORSE_GROUP).emit('newUserView', user);

    io.in(ADMIN_GROUP).emit('newUserView', user);

    console.log('JOINED', user.username);
  });

  socket.on('emitterStart', function(data) {
    console.log(">>> Start Emitting");

    io.emit('signalSta§t');
    console.log("<<< START [GLOBAL]");
  });

  socket.on('emitterStop', function(data) {
    console.log(">>> Stop Emitting");

    io.emit('signalStop');
    console.log("<<< STOP [GLOBAL]");
  });
});


/* ADMIN NAMESPACE */
var adminIO = io.of('/admin');

adminIO.on('connection', function(socket) {
  var thisUser = null;

  //Emit the rooms array
  socket.emit('setup', {
    // rooms: rooms
  });

  socket.on('disconnect', function(){
    console.log('LEFT', thisUser ? thisUser.username : "NOT SPECIFIED");
  });

  // Register an admin view, for viewing stats
  socket.on('registerAdminView', function(user) {
    //New user joins the default room
    socket.join(ADMIN_GROUP);

    adminUsers.push(user);

    //Tell all those in the room that a new user joined
    io.in(ADMIN_GROUP).emit('newAdminView', user);

    // Tell admin view who is using the application
    socket.emit('usersInfo', {
      adminUsers: adminUsers,
      users: users
    });
  });
});
/*||||||||||||||||||||END SOCKETS||||||||||||||||||*/


console.log(this);

/* Start Server on port 2015 */
server.listen(2015);
console.log('Listening on 2015');
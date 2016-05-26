'use strict';

// Import all our dependencies
const express  = require('express');
const mongoose = require('mongoose');
const app      = express();
const server   = require('http').Server(app);
const io       = require('socket.io')(server);

/* https://github.com/broofa/node-uuid */
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
}

// tell express where to serve static files from
app.use(express.static(__dirname + '/public'));

// allow CORS, middleware
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

// route for admin page
app.get('/admin', function(req, res) {
  //send the index.html in our public directory
  res.sendfile('public/admin.html');
});

/*||||||||||||||||||END ROUTES|||||||||||||||||||||*/


/*|||||||||||||||| GLOBAL VARS ||||||||||||||||*/
const USER_GROUP = 'users';
const ADMIN_GROUP = 'admins';

let users = {};
let adminUsers = {};
/*||||||||||||||| END GLOBAL VARS |||||||||||||*/


/*||||||||||||||||SOCKET|||||||||||||||||||||||*/

/* DEFAULT NAMESPACE */
io.on('connection', function(socket) {
  let thisUserUuid = null;
  let thisUser = {
    id: socket.id,
    username: 'default'
  };

  /* INITIAL SETUP */
  // New user joins the default room
  socket.join(USER_GROUP);

  users[socket.id] = thisUser;

  //Tell all those in the room that a new user joined
  io.in(USER_GROUP).emit('userJoined', thisUser);

  adminIo.in(ADMIN_GROUP).emit('newUserView', thisUser);

  console.log('JOINED', thisUser);
  /* INITIAL SETUP */

  //Emit the rooms array
  socket.emit('setup', users);

  socket.on('disconnect', function() {
    delete users[socket.id];
    io.in(USER_GROUP).emit('userLeft', socket.id);
    console.log('LEFT', socket.id, thisUser ? thisUser.username : "NOT SPECIFIED");
  });

  socket.on('emitterStart', function(data) {
    // console.log(">>> Start Emitting");

    io.emit('signalStart');
    socket.broadcast.emit('signalStartBroadcast', {
      userSocketId: socket.id,
      note: data.note
    });
    // console.log("<<< START [GLOBAL]");
  });

  socket.on('emitterStop', function(data) {
    // console.log(">>> Stop Emitting");

    io.emit('signalStop');
    socket.broadcast.emit('signalStopBroadcast', {
      userSocketId: socket.id
    });
    // console.log("<<< STOP [GLOBAL]");
  });
});


/* ADMIN NAMESPACE */
let adminIo = io.of('/admin');

adminIo.on('connection', function(socket) {
  let thisUser = null;

  //Emit the rooms array
  socket.emit('setup', {
    rooms: rooms
  });

  socket.on('disconnect', function() {
    delete adminUsers[socket.id];
    console.log('LEFT', socket.id, thisUser ? thisUser.username : "NOT SPECIFIED");
  });

  socket.on('changeName', function(name) {
    thisUser.username = name;


  });

  // Register an admin view, for viewing stats
  socket.on('registerAdminView', function(user) {
    //New user joins the default room
    socket.join(ADMIN_GROUP);

    adminUsers[socket.id] = user;

    //Tell all those in the room that a new user joined
    adminIo.in(ADMIN_GROUP).emit('newAdminView', user);

    // Tell admin view who is using the application
    socket.emit('usersInfo', {
      adminUsers: adminUsers,
      users: users
    });
  });
});
/*||||||||||||||||||||END SOCKETS||||||||||||||||||*/

// console.log(process.argv);

/* Start Server on port 1337 */
server.listen(1337, "0.0.0.0");
console.log('Listening on 1337');

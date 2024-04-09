const express = require('express');
const bodyParser = require('express');
const mongoose = require('mongoose');
const app = express();
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const password = require('./utils/password');
const MONGODB_URI = "mongodb+srv://kalpakprajapati:" + `${encodeURIComponent(password.password)}` + "@cluster0.pzrjjcl.mongodb.net/post";
app.use(bodyParser.json()); // for json requests. (REST APIs)
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const { watchMessage } = require('./controllers/message');

// To handle the cors error. 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');// allow access from all the domains, we can also choose specific inestead of *(All)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // which methods to allow. 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-token'); // allow specific headers. 
    next();
});

app.use(feedRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(messageRoutes);

mongoose
    .connect(
        MONGODB_URI
    )
    .then(result => {
        console.log("db connected");
        // bcrypt.hash('123456', 12).then(hashed => {
        //     const user = new User({ email: 'Harvey.spectre@gmail.com', name: 'Harvey Spectre', password: hashed });
        //     user.save().then(() => {
        const server = app.listen(8080);
        const io = require('./socket').init(server);
        io.on('connection', (socket) => {
            console.log('socket connected', socket.id);

            watchMessage(socket);

            socket.on('disconnect', reason => {
                console.log(reason);
            })
        });
        //     })
        // })
    })
    .catch(err => {
        console.log(err);
    });

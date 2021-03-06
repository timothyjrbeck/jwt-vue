const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const app = express();

// const server = require('./httpsServer');
const server = require('http').createServer(app);

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization']

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next();
    } else {
        res.sendStatus(403)
    }
}

// Body Parser Middleware
app.use(express.json());

// Allow CORS
// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "localhost"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Origin", "127.0.0.1"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(cors())

// API
app.get('/api', (req, res) => {
    res.json({
        msg: 'hello'
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            res.json(err)
        } else {
            res.json({
                msg: 'post created',
                authData
            })
        }
    })
})

app.post('/api/auth', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
        if (err) {
            res.json(err)
        } else {
            res.json({
                authData
            })
        }
    })
})

app.post('/api/login', (req, res) => {
    console.log(req.body)

    jwt.sign({ user: req.body }, 'secret', { expiresIn: '3h' }, (err, token) => {
        res.json({ token })
    });
})

// app.use('/api/users', require('./routes/api/users'))

// const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, '../dist')));

// Another Way to Serve Static Folder
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname,'public','index.html'))
// });

const PORT = process.env.PORT || 80;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`))
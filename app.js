const express = require('express');
const jwt =  require('jsonwebtoken');

//Load .env Variables
require('dotenv').config();

const PORT = 8000;
const app = express();

//Parse JSON Body
app.use(express.json());

const posts = [
    {
        username: 'Alex',
        title: 'Post: 0'
    },
    {
        username: 'Stolt',
        title: 'Post: 1'
    }
];


app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name));
});


app.post('/login', (req, res) => {
    //Authenticate User...

    //After Authentication
    const username = req.body.username;
    const user = {
        name: username
    }

    //Serialize User in a Web Token
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); //Payload, Secret Key
    res.json({accessToken: accessToken});
});

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}



app.listen(PORT, (err) => {
    if(!err)
        console.log(`Listening on Port: ${PORT}`);
})
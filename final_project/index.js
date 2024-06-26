const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const secret = require('./router/secret.js');

const app = express();

app.use(express.json());

app.use("/customer",session({
    secret:"fingerprint_customer",
    resave: true,
    saveUninitialized: true}
))

let secretKey = secret.secretKey

app.use("/customer/auth/*", function auth(req,res,next){
    const accessToken = req.session.accessToken;
    if (accessToken) {
        jwt.verify(accessToken, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).send("Unauthorized");
            }
            req.user = decoded.user;
            next();
        });
    } else {
        res.status(401).send("Unauthorized");
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

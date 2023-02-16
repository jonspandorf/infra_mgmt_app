const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ipamRoutes = require('./routes/ipam.js')
const usersRoutes = require('./routes/users.js')
const resourcesRoutes = require('./routes/resources')
const instancesRoutes = require('./routes/instances.js');
const scheduled_works = require('./utils/scheduled_works')
const session = require('express-session');
const MongoStore = require('connect-mongo');


const {
    MONGO_HOSTNAME,
    MONGO_DB,
    MONGO_PORT,
    SESSION_SECRET
} = process.env;

const mongoUrl = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`


const app = express();
app.use(cors())


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl })
  }));


app.use('/api/ipam', ipamRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/instances', instancesRoutes)
app.use('/api/resources', resourcesRoutes)

scheduled_works.scanVcenterServers()
scheduled_works.cleanDockerNetworks()

app.use((error, req, res, next) => {
    console.log(error)
    res.status(error.errorCode).send({message: error.message})
})




const port = process.env.SERVER_PORT || 5001


mongoose
.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true } )
.then(() => {
    app.listen(port, () => {
        console.log(`server is running at port ${port} and db is on port ${MONGO_PORT} at ${MONGO_HOSTNAME}`)
    })
})
.catch ((err) => {
    console.error(err);
}) 

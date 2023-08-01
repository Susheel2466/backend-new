const express = require('express');
const bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
const bookRoute = require("./routes/book.routes");
const userRoute = require("./routes/user.routes");


app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/book', bookRoute);
app.use('/user', userRoute);


app.get('/ping', (req, res) => {
    res.end(`<html><head><title>Test App</title></head><body><h1 align="center">Test Application On Work</h1></body></html>`);
});

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is connected....`);
});


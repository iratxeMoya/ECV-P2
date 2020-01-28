const express = require('express');

const app = express();

var server = app.listen(9026, () => {
    console.log('server is running on port', server.address().port);
});

app.use(express.static('../app/src'));
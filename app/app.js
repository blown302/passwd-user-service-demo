const express = require('express');
const bodyParser = require('body-parser');

const {PORT} = require('./config/config');
const userRouter = require('./routes/users.route');

const app = express();

app.get('/ping', (req, res) => res.end());
app.use(bodyParser.json());
app.use('/users', userRouter);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

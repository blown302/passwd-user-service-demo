const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const {PORT} = require('./config/config');
const userRouter = require('./routes/users.route');
const groupRouter = require('./routes/groups.route');

const app = express();

app.get('/ping', (req, res) => res.end());
app.use(bodyParser.json());

// include request logging
app.use(morgan('combined'));

// include routers
app.use('/users', userRouter);
app.use('/groups', groupRouter);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

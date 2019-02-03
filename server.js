//const bodyParser = require('body-parser');

const exphbs  = require('express-handlebars');
const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const path = require('path');
const config = require('config');
const helmet = require('helmet')
const logger = require('./middleware/logger');
const authentication = require('./middleware/authentication');

const morgan = require('morgan')
const genresRoutes = require('./routes/vidly');
const express = require('express');
const app = new express();

const port = process.env.PORT || 8000;
// const genres  = require('./genres');
app.use('/genres', genresRoutes);
app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views',path.join(__dirname,'views') );
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(helmet());

app.use(logger);
app.use(authentication());

if(app.get('env') === 'development'){
app.use(morgan('tiny'));
startupDebugger('morgan enable')
}

//configuration

startupDebugger(`Application Name : ${config.get('name')}`);
startupDebugger(`email server : ${config.get('mail.host')}`);

//db
dbDebugger('connected to the database');
// console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`)
// const genreList = genres.genres; 


app.get('/', (req, res)=>{

    res.render('index.hbs',{title:"REST API APP"})

})

app.listen(port, ()=>{
    console.log('Server is running at :' , port);
    
})
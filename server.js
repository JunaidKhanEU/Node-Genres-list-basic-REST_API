//const bodyParser = require('body-parser');
const config = require('config');
const helmet = require('helmet')
const logger = require('./logger');
const authentication = require('./authentication');
const Joi = require('joi');
const morgan = require('morgan')
const express = require('express');
const app = new express();
const port = process.env.PORT || 8000;
const genres  = require('./genres');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());

app.use(logger);
app.use(authentication());

if(app.get('env') === 'development'){
app.use(morgan('tiny'));
}

//configuration

console.log(`Application Name : ${config.get('name')}`);
console.log(`email server : ${config.get('mail.host')}`);


// console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`)
const genreList = genres.genres; 


app.get('/', (req, res)=>{

    res.send('Welcome to Vidly API main Page!!!!');

})

app.get('/genres', (req, res)=>{

    res.send(genreList);

})

app.get('/genres/:id', (req, res)=>{

    let id = parseInt(req.params.id);

    let result = genreList.find((genre)=>{

        return id === genre.id;
    })

    if(!result){

        res.status(404).send('ID is WRONG');
        return
    }else{

        res.send(result);
    }

  })

  app.delete('/genres/:id', (req, res)=>{
    let id = parseInt(req.params.id);
    let result = genreList.find((genre)=>{

        return id === genre.id;
    });

    if(result){

    let index = genreList.indexOf(result);

    genreList.splice(index, 1);
    res.send(result)

    }else{
        res.status(404).send('ID is WRONG');
    }

  })

  app.post('/genres', (req, res)=>{

    let requestData = req.body;
    let check = validation(requestData);
    
    if(check.error){
        res.status(400).send(check.error.details[0].message);
        return
    }

        const genre = {
            "id": genreList.length + 1,
            "name":req.body.name
        }
    
        genreList.push(genre),
    
        res.send(genre );

  })

  app.put('/genres/:id', (req, res)=>{

    let id = parseInt(req.params.id);
    let result = genreList.find((genre)=>{

        return id === genre.id;
    })

    if(!result){

        res.status(404).send('ID is WRONG');
        return
    }else{
        
        let check = validation(req.body);

        if(check.error){

            res.status(400).send(check.error.details[0].message);
            return
        }

        result.name = req.body.name;

        res.send(result);


       
    }


  })



  function validation(data){
    const schema = {
        name:Joi.string().min(3).required()
    }

    return Joi.validate(data, schema);


}

app.listen(port, ()=>{
    console.log('Server is running at :' , port);
    
})
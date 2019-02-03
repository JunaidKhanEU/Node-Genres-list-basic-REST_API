const Joi = require('joi');
const genres  = require('../genres');
const express = require('express');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({extended:true}));

const genreList = genres.genres; 

//default route here is /genres
router.get('/', (req, res)=>{
    //route means /genres/
    res.send(genreList);

})

router.get('/:id', (req, res)=>{

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

  router.delete('/:id', (req, res)=>{
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

  router.post('/', (req, res)=>{

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

  router.put('/:id', (req, res)=>{

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


module.exports = router;
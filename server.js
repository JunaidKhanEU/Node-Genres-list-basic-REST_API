const express = require('express');

const app = new express();

const port = process.env.PORT || 8000;



app.get('/', (req, res)=>{

    res.send('Welcome to Vidly API main Page!!!!');

})




app.listen(port, ()=>{
    console.log('Server is running at :' , port);
})
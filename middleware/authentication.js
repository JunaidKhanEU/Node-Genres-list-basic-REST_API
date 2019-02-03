module.exports = ()=>{

    return (req, res, next)=>{
        console.log('Authenticating ....');
        next();
    }
    
}
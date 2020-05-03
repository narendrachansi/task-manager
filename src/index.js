const app=require('../src/app')
const port=process.env.PORT

app.listen(port,()=>{
    console.log('Server started at port '+ port);
});





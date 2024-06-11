//create author api app
const exp=require('express');
const authorApp=exp.Router();
const expressAsyncHandler=require('express-async-handler')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const verifyToken=require('../Middlewares/verifyToken')
let authorscollection;
let recipescollection;
//get usercollection app
authorApp.use((req,res,next)=>{
    authorscollection=req.app.get('authorscollection')
    recipescollection=req.app.get('recipescollection')
    next()
})


//author registration route
authorApp.post('/author',expressAsyncHandler(async(req,res)=>{
    //get user resource from client
    const newUser=req.body;
    //check for duplicate user based on username
    const dbuser=await authorscollection.findOne({username:newUser.username})
    //if user found in db
    if(dbuser!==null){
        res.send({message:"Author existed"})
    }else{
        //hash the password
        const hashedPassword=await bcryptjs.hash(newUser.password,6)
        //replace plain pw with hashed pw
        newUser.password=hashedPassword;
        //create user
        await authorscollection.insertOne(newUser)
        //send res 
        res.send({message:"Author created"})
    }

}))


//author login
authorApp.post('/login',expressAsyncHandler(async(req,res)=>{
    //get cred obj from client
    const userCred=req.body;
    //check for username
    const dbuser=await authorscollection.findOne({username:userCred.username})
    if(dbuser===null){
        res.send({message:"Invalid username"})
    }else{
        //check for password
       const status=await bcryptjs.compare(userCred.password,dbuser.password)
       if(status===false){
        res.send({message:"Invalid password"})
       }else{
    //create jwt token and encode it
        const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_KEY,{expiresIn:'1d'})
    //send res
        res.send({message:"login success",token:signedToken,user:dbuser})
       }
    }
}))

//adding new recipe by author
authorApp.post('/recipe',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get new recipe from client
    const newRecipe=req.body;
    console.log(newRecipe)
    //post to artciles collection
    await recipescollection.insertOne(newRecipe)
    //send res
    res.send({message:"New Recipe Added"})
}))


//modify artcile by author
authorApp.put('/recipe',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get modified recipe from client
    const modifiedRecipe=req.body;
   
    //update by recipe id
   let result= await recipescollection.updateOne({recipeId:modifiedRecipe.recipeId},{$set:{...modifiedRecipe}})
    let latestRecipe=await recipescollection.findOne({recipeId:modifiedRecipe.recipeId})
    res.send({message:"Recipe modified",recipe:latestRecipe})
}))


//delete an recipe by recipe ID
authorApp.put('/recipe/:recipeId',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get recipeId from url
    const recipeIdFromUrl=(+req.params.recipeId);
    //get recipe 
    const recipeToDelete=req.body;

    if(recipeToDelete.status===true){
       let modifiedRec= await recipescollection.findOneAndUpdate({recipeId:recipeIdFromUrl},{$set:{...recipeToDelete,status:false}},{returnDocument:"after"})
       res.send({message:"recipe deleted",payload:modifiedRec.status})
    }
    if(recipeToDelete.status===false){
        let modifiedRec= await recipescollection.findOneAndUpdate({recipeId:recipeIdFromUrl},{$set:{...recipeToDelete,status:true}},{returnDocument:"after"})
        res.send({message:"recipe restored",payload:modifiedRec.status})
    }
   
   
}))








//read recipes of author
authorApp.get('/recipes/:username',verifyToken,expressAsyncHandler(async(req,res)=>{
    //get author's username from url
    const authorName=req.params.username;
    //get atricles whose status is true
    const recipesList=await recipescollection.find({username:authorName}).toArray()
    res.send({message:"List of atricles",payload:recipesList})

}))

//export userApp
module.exports=authorApp;
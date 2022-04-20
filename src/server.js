import express from 'express';
import bodyParser from "body-parser";
import {MongoClient, MongoError} from 'mongodb';

import path from 'path';


const app=express();
const cors = require("cors");
const port=8000
var corsOptions = {
    origin: "http://localhost:3000"
  };

app.use(express.static(path.join(__dirname,'/build')))
app.use(cors(corsOptions));
app.use(bodyParser.json());
// app.use(express.json());
// npx nodemon --exec npx babel-node src/server.js                                






app.get('/api/articles/:name', async (req, res) => {
   

    try{
        const articleName = req.params.name;

        const client =await MongoClient.connect('mongodb://0.0.0.0:27017/');
        var datb=client.db('my-blog')
        console.log(datb)
       
        
        const col = datb.collection('articles');
        console.log(col)
        const articleInfo = await col.findOne({ name: articleName })
        console.log(articleInfo)
        res.status(200).json(articleInfo)
        client.close();
    }
    catch (error) {
        res.status(500).json({ message: 'Error connecting to db', error });
    }}
           
        
       
       
        
       
    
        
);
    // try{
    //     var mongoose=require('mongoose');
    //     var dbUrl='mongodb://0.0.0.0:27017/my-blog'
    //     mongoose.connect(dbUrl)

    //     mongoose.connection.on('connected',()=>{
    //             console.log('Connected to mongodb using moongose');
                
    
    //               
    //         });
        
    // }
    // catch(error){
    //     console.log(error)
    // }

    
// })

app.post('/api/articles/:name/upvote', async(req, res) => {
    try{
        const articleName = req.params.name;
        const client =await MongoClient.connect('mongodb://0.0.0.0:27017/');
        var db=client.db('my-blog')
               
        const col = db.collection('articles');
        const articleInfo = await col.findOne({ name: articleName })
        await col.updateOne(
            {name:articleName},
            {'$set': {"upvote":articleInfo.upvote+1,
            }})
       
        const updatedarticleInfo = await col.findOne({ name: articleName })
        res.status(200).json(updatedarticleInfo)
        client.close()
 
    }
    catch (error) {
        res.status(500).json({ message: 'Error connecting to db', error });
    }}
    

    );

app.post('/api/articles/:name/add-comment',async (req, res) => {
    const { username, text } = req.body;
    const articleName = req.params.name;

   try{
    const articleName = req.params.name;
    const client =await MongoClient.connect('mongodb://0.0.0.0:27017/');
    var db=client.db('my-blog');
           
    const col = db.collection('articles');
    const articleInfo = await col.findOne({ name: articleName })

    await col.updateOne(
        {name:articleName},
        {'$set': {"comments":articleInfo.comments.concat({username,text}),
        }})
   
    const updatedarticleInfo = await col.findOne({ name: articleName })
    res.status(200).json(updatedarticleInfo) 
    client.close()
   }catch (error) {
    res.status(500).json({ message: 'Error connecting to db', error });
}
});

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
})
app.listen(8000, () => console.log('Listening on port 8000'));
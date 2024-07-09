 const express = require('express'); 
const cors = require( 'cors'); 
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app =express() ;
const port =process.env.PORT || 5000;

//middleware 

app.use(cors()) 
app.use(express.json()); 




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tlrxmsc.mongodb.net/?appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();  

 const spotCollection=client.db('spotDB').collection('spot'); 
  const userCollection=client.db("userDB").collection('user');

app.get('/spot',async(req,res)=>{
  const cursor=spotCollection.find();
  const result=await cursor.toArray(); 
  res.send(result)
}) 

app.get('/spot/:id', async(req,res)=>{
  const id=req.params.id;
  const query={_id: new ObjectId(id)};
  const result=await spotCollection.findOne(query);
  res.send(result)
})



    app.post('/spot', async(req,res)=>{ 
      const newSpot = req.body; 
      console.log(newSpot); 
      const result=await spotCollection.insertOne(newSpot);
      res.send(result);

  }) 
  
  app.put('/list/:id',async(req,res)=>{ 
    const id=req.params.id;
    const filter={_id: new ObjectId(id)}
 const options={upsert:true}; 
 const updateSpot=req.body;

 const Spot={ 
  $set:{ 
    image:updateSpot.image,
    spot:updateSpot.spot,
    country:updateSpot.country,
    location:updateSpot.location,
    cost:updateSpot.cost,
    seasonality:updateSpot.seasonality,
    time:updateSpot.time,
    visit:updateSpot.visit,
    description:updateSpot.description,

  }

 }
 const result=await spotCollection.updateOne(filter,Spot,options) 
 res.send(result)
  }

  )


  app.delete('/spot/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId (id)}; 
    const result=await spotCollection.deleteOne(query);
    res.send(result);
  }) 

  //user  related apis 

  app.get('/user',async(req,res)=>{
    const cursor=userCollection.find();
    const users=await cursor.toArray() 
    res.send(users)
  }) 

 
  
  app.post('/user',async(req,res)=>{
    const user=req.body;
    console.log(user);
    const result=await userCollection.insertOne(user);
    res.send(result);
  }) 
  
  app.patch('/user',async(req,res)=>{
    const user=req.body;
    const filter={email:user.email}
    const updateDoc={
      $set:{
        lastLoggedAt:user.lastLoggedAt
      }

    } 
    const result=await userCollection.updateOne(filter,updateDoc)
    res.send(result)
  })

  app.delete('/user/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id: new ObjectId(id)} 
    const result=await userCollection.deleteOne(query)
    res.send(result)
  })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  
    
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send("Tourism web management is running")
}) 

app.listen(port,()=>{
    console.log(`Torism port:${port}`)
}) 


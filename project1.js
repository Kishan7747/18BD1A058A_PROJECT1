const express = require('express');
const app = express();

let server = require('./server');
let middleware=require('./middleware');

const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017/';
const dbname = 'hospitalinventory';

let db
MongoClient.connect(url,{ useUnifiedTopology : true },(err,client)=>{
       if(err)
         return console.log(err);
      db=client.db(dbname);
      console.log(`connected database : ${url}`);
      console.log(`Database : ${dbname}`);
});

app.get('/hospitaldetails',middleware.checkToken,(req,res)=>{
      console.log("fetching the data of hospitals.....");
      var op=db.collection('hospital').find().toArray().then(result => res.json(result));

});

app.get('/ventilatordetails',middleware.checkToken,(req,res)=>{
      console.log("fetching the data of ventilators.....");
      var op=db.collection('ventilators').find().toArray().then(result => res.json(result));

});

app.post('/searchventbystatus',middleware.checkToken,(req,res)=>{
      var status=req.body.status;
      console.log("fetching the data of ventilators by status.....");
      var op=db.collection('ventilators').find({"status":status}).toArray().then(result => res.json(result));

});

app.post('/searchventbyname',middleware.checkToken,(req,res)=>{
      var name=req.query.name;
      console.log("fetching the data of ventilators by name.....");
      var op=db.collection('ventilators').find({"name":new RegExp(name,'i')}).toArray().then(result => res.json(result));

});

app.post('/searchhospitalbyname',middleware.checkToken,(req,res)=>{
      var name=req.query.name;
      console.log("list of hospitals are....");
      var op=db.collection('hospital').find({"name":new RegExp(name,'i')}).toArray().then(result => res.json(result));

});

app.put('/updateventilator',middleware.checkToken,(req,res)=>{
      var ventid = { vid:req.body.vid};
      console.log(ventid);
      var newval = { $set: {status: req.body.status}};
      db.collection('ventilators').updateOne(ventid,newval,(err,resp)=>{
            res.json("1 Document updated Successfully");
            if(err) throw err;
      });
});

app.post('/addventilator',middleware.checkToken,(req,res)=>{
      var hid = req.body.hid;
      var vid = req.body.vid;
      var status = req.body.status;
      var name = req.body.name;

      var item={hid:hid,vid:vid,status:status,name:name};
      
      db.collection('ventilators').insertOne(item,(err,resp)=>{
            res.json("1 Item inserted Succesfully");
            if(err) throw err;
      });
});

app.delete('/deleteventilator',middleware.checkToken,(req,res)=>{
      
      var item={vid:req.query.vid};

      db.collection('ventilators').deleteOne(item,(err,resp)=>{
            res.json("1 item deleted Succesfully");
            if(err) throw err;
      });
});

app.listen(9999);
const fs=require('fs')
const multer=require('multer')
const path =require('path')
const sql=require('mysql')
const cors=require('cors')
const process=require('process')
const express=require('express')
require('dotenv').config()


const app=express()
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname,'public')));

const pool =sql.createPool({
    host:process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database:process.env.DB_DBNAME,
    port:3306,
    waitForConnections: true,
    connectionLimit: 5,
    
});

app.get('/schools',(req,res)=>{
    pool.getConnection((err,connection)=>{
        if(err) console.log(err)
            else {
                const sql="select * from schools";
                connection.query(sql,(err,data)=>{
            if(err) {
                connection.release();
                console.log(err);
              }
              else
       {
        connection.release();
return res.json(data);
       }     
            })
            }
    })
})

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
            cb(null,'public/images')},
    filename:(req,file,cb)=>{
        
cb(null,file.fieldname+""+path.extname(file.originalname))
}})

const upload=multer({
    storage:storage})

    app.post('/upload',upload.single('image'),(req,res)=>{
try {
    console.log((JSON.parse(req.body.text)));
        const data=JSON.parse(req.body.text);
        let name=data.name;
        let address=data.address;
        let city=data.city;
        let state=data.state;
        let contact=data.contact;
        let email_id=data.email_id;
        let file=req.file;
        try { 
            //const patha=path.resolve(__dirname,'../public') ;        
            const apath=path.join(process.cwd(),'public/images/image.png');
            var base64String= fs.readFileSync("https://reno-platform-project.vercel.app/images/image.png", 'base64');
        var str=base64String.toString('base64')
        } catch (error) {
         console.log(error);
        }
   
    pool.getConnection((err,connection)=>{
        if(err) console.log(err);
        else {
                     const sql="insert into schools(name,address, city, state, contact, image, email_id) values(?,?,?,?,?,?,?)";
                     connection.query(sql,[name, address,city,state, contact,str,email_id],(err,res)=>{
                     if(err)
                        {
                            console.log(err);
                            connection.release();
                        } 
                     else{
    connection.release();
    
    console.log("successfuly updated");
     
                     }
                        })
       }
    })
    console.log(req.file);
    res.status(200).send('OK');

} catch (error) {
res.send("something went wrong"+err);    
}
             })
     
app.listen(5001,console.log("server is runnning"));
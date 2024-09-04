const express = require('express'); // framework 
const path = require('path');   // Handle the path variable
const fs = require('fs');   //Handle the filesystem variable
const { Agent } = require('http');
const app = express(); // initialize express
const port = 4500;   // default port number for production




app.listen(port, (error) => {
  if (error) console.log(error);
  else console.log(`Server is running on port ${port}`);
});

// const publicPath = path.join(__dirname, 'public'); // public directory path

// console.log(publicPath);



// app.get('/', (req, res) => {  // we already have page inside the public directory jsut render html page 
//   res.send('<h1>Welcome, to the Home page!</h1>');
// });

// // app.use(express.static(publicPath));

// app.get('/aboutus', (req, res) => {
//   res.sendFile(publicPath + '/about.html');  //with out the extention of html files 
// });

// app.get('/contactme', (req, res) => {
//   res.sendFile(publicPath + '/contact.html');  //with out the extention of html files 
// });

// // Create a new File in root directory

// fs.writeFileSync('test.txt', "Hello test file this is a test text");

// // create another file inside the public diretory

// fs.writeFileSync(publicPath + '/test.txt', "Hello test file this is text inside the public diretory");

// //let read the data from the test fiel insdie the public diretory

// fs.readFile(publicPath + '/test.txt', 'utf8', (err, data) => {
//   if (err) console.log(err);
//   else console.log(data);
// });

// //read file data from the root directory
// fs.readFile(__dirname + '/test.txt', 'utf8', (err, data) => {
//   if (err) console.log(err);
//   else console.log(data);
// });


// // lets add some data into the test file in root directory

// fs.appendFileSync(__dirname + '/test.txt', "\nThis is a new line added by node.js", (err, data) => {
//   if (err) console.log(err);
//   else console.log("Data added successfully");
//   console.log(data);

// });


// // Now lets rename the file inside the root directory

// fs.renameSync(__dirname + '/test.txt', __dirname + '/new_test.txt');

// console.log("File Renamed successfully");

// // Now lets delete the file inside the root directory

// // fs.unlinkSync(__dirname + '/new_test.txt');

// // console.log("File deleted successfully");


// // now let's handle the 404 error in case of page not found let redire to the 404
// // app.use('*', (req, res) => {
// //   res.sendFile(publicPath + '/404.html');
// // });

// // Templete engine ejs(Embaded Javascript)
// app.set('view engine', 'ejs'); // set up ejs for templating

// // pass the data to the html page haveing extion ejs
// // const tempPath = path.join(__dirname,'views'); 
// // console.log("the templete path is"+tempPath);

// app.get('/myprofile', (req, res) => {
//   const data = {
//     name: "ismail",
//     email: "ismail@gmail.com",
//     age: 18,
//     skills: ['java' ,'python','flutter'],
//   };
  
  
//   res.render('profile', { data });

// }
// );


// // Static API

// const http = require('http');

// http.createServer((req, res)=> {  
//   res.writeHead(200,'content-type', 'application/json');
//   const userData={username:'Ismail', email: 'ismail@gmail.com'};
//   res.write(JSON.stringify(userData));
//   res.end();
// }).listen(4200);

// //  build Dynamic pages
// // look at the profile page


// //now lets create a custom footer or something

// app.get('/login',(req, res)=>{
//   res.render('login',);
// });


// Middleware implementations is below




const filterQuery = (req, res, next) => {
  if (!req.query.age){
    res.send('Please provide a valid age');
  }
  else if(req.query.age<18){
    res.send('sorry,you are not allowed to login'); 
  
  }
  else{{
    next();
  }
}
};

// app.use(filterQuery);  // remove the filter query when it is routed layer

app.get('/middleware',(req, res)=>{
  res.send("<h1>Heu this is midleware</h1>")
});


// Middleware inside router

app.get('/help',filterQuery, (req, res)=>{
  res.send("<h1>Heu this is midleware help page</h1>");
})


// connection with mongo  install mongodb

const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017"; 



async function connection() {
  const  client = new MongoClient(uri);
  console.log("Connection establising is in progress");

  try {
    await client.connect();
    console.log("Connected successfully to server");
    const databaseName = ('test');
    const dataBase = client.db(databaseName);
    console.log("Database connected successfully");
    const collection = dataBase.collection('Test');
    const result = await collection.find().toArray();
    console.log(result);

    // get only that data from COUNTRIES collection where country_name is Iran
    const IranCollection = dataBase.collection('COUNTRIES');
    const iranData = await IranCollection.find({ country_name: "Iran" }).toArray();
    console.log('iranData are :');
    console.log(iranData);

    // Insertion of data into mongodb EMPLOYEES collection

    const employee = {
      name: 'Ismail',
      age: 25,
      department: 'SE',
    };
    const employeeCollection = dataBase.collection('EMPLOYEES');
    const resultInsert = await employeeCollection.insertOne(employee);
    console.log('Inserted record successfully : ', resultInsert);


    // Now let's update the employee collection
    const updateResult = await employeeCollection.updateOne(
      { name: 'Ismail' },
      { $set: { name:  'Muhammad Ismail'} }
    );
    console.log('Update result: ', updateResult);


    // Now let's perform the delete operation

    const deleteResult = await employeeCollection.deleteOne({ name: 'Muhammad Ismail' });
    console.log('Delete result: ', deleteResult);


  } catch (err) {
    console.error(err);
  } finally {
    await client.close();   

  }
}

connection().catch(console.dir);



// lets write an get api with mongodb

app.get('/', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const databaseName = 'test';
    const db = client.db(databaseName);
    const employeesCollection = db.collection('EMPLOYEES');
    const employees = await employeesCollection.find().toArray();
  
    console.log(res.json(employees));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving employees' });
  } finally {
    await client.close();
  }
});
app.listen(80);


//now let's start implementing the post api method

app.post('/add-employee', async (req, res) => {
  const { name, age, department } = req.body;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const databaseName = 'test';
    const db = client.db(databaseName);
    const employeesCollection = db.collection('EMPLOYEES');
    const data={name:"test", age:"test", department:"test"}
    const result = await employeesCollection.insertOne(data);
  
    console.log(res.json({ message: 'Employee added successfully', result }));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding employee' });
  } finally {
    await client.close();
  }
});













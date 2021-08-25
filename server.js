const express = require('express');
const path = require('path');

let db = require("./db/db.json");

const PORT = process.env.PORT || 3001;

const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET Route for feedback page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// Posting notes to the database (db)
app.post("/api/notes", function(req, res){

  // creating id's for each note everytime a note is added the id goes up by 1
  req.body.id = db.length + 1;
  console.log("API NOTES POST REQ", req.body)
  // req.body is going to be the note that we are pushing to our database
  db.push(req.body);

  // going to show us the new note we saved to db on our notes.html page
  res.json(db)
})

// Getting notes from database (db) to render on page
app.get('/api/notes', function(req, res){
  console.log("API NOTES GET RESS",res)

  // going to show us the notes in the database
  res.json(db)
})

// Delete notes from database by their ID
app.delete("/api/notes/:id", function(req, res){
  console.log("PARAMMMSSSSSSS", req.params.id)
  console.log("ARRAY/DATABASE to delete from", db);

  // the "new" database without the one we deleted
  var updatedDb = [];
  // making req.params.id into a number to compare in our "if" statement
  var noteToDelete = parseInt(req.params.id);

  // looping through everything in the database 
  for(var i =0; i< db.length; i++){
    console.log("EACH NOTES ID", db[i])

    // if the req.params.id (from the note we deleted on our page) is not equal everything else's id in the database then we only dont add that one back to the updatedDB
    if(noteToDelete !== db[i].id){
      updatedDb.push(db[i])
    }
  }
  // we are calling our old db instance the "updatedDb" only for the delete method
  db = updatedDb;
  // will clear the page of the deleted note and show us what is left in the database
  res.json(db);

})






app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
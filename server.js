var http = require('http');
var url = require('url');
var fs = require('fs');
var methodOverride = require('method-override');
const express = require('express')

const app = express()
const port = 3000
app.use(express.json());
app.use(methodOverride('X-HTTP-Method-Override'))

app.get('/', (req, res) => {
  res.send('Go to \'/your-id\' to find your button,\n' +
           'and \'/your-id/\' running to query whether to run')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/:id/running', function (req, res) {
  var url_parts = url.parse(req.url);
  var id = url_parts.pathname.split('/')[1] // get id from pathname
  
  if (id > 30 || isNaN(id)) return res.end("404 Not Found");
  
  var filename = "." + url_parts.pathname;
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Creating file: " + filename);
      data = "false"
      fs.writeFile(filename, data, function (err) {
        if (err) throw err;
      });
    }

    res.write(data);
    return res.end();
  });
})

app.put('/:id/', function (req, res) {
  var url_parts = url.parse(req.url);
  var id = url_parts.pathname.split('/')[1] // get id from pathname

  if (id > 30 || isNaN(id)) return res.end("404 Not Found"); // exception handling should take the string to int 

  
  var filename = "." + url_parts.pathname + "/running";
  // fs.writeFile(filename, "true", function (err) {
  //   // if (err) throw err;
  //   if (err) return res.end("404 Not Found");
  // });
  turnOffIn30(filename);
  console.log(filename + " --> true")
  return res.end();
})

function turnOffIn30(filename) {
  var timeleft = 30;
  var runningTimer = setInterval(function(){
    if (timeleft <= 0){
      fs.writeFile(filename, "false", function (err) {
        if (err) throw err;
      });
      console.log(filename + " --> false")
      clearInterval(runningTimer);
      return
    }
    fs.writeFile(filename, "true", function (err) {
      if (err) console.log("Error in writing file: " + filename);
    });
    timeleft -= 1;
  }, 1000);
}


app.get('/:id/', function (req, res) {
  var url_parts = url.parse(req.url);
  var id = url_parts.pathname.split('/')[1]
  if (id > 30 || isNaN(id)) {
    return res.end("404 Not Found");
  }

  return res.sendFile(__dirname + '/id.html')
})

for (id = 0; id <= 30; id++) { 
  fs.existsSync(`${id}/`) || fs.mkdirSync(`${id}/`);
}
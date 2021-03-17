// simple web server for starting kinectic sculptures through web
// built by Max Bennett March 2021

var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
const express = require('express')
const app = express()
const port = 3000
app.use(express.json());
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(favicon('favicon.ico'));


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})

app.get('/', (req, res) => {
  res.send('Go to \'/your-uni\' to find your button,\n' +
           'and \'/your-uni/running\' to query whether to run')
})

// Returns page per unique ID (uni) for each student in class
app.get('/:id/', function (req, res) {
  var url_parts = url.parse(req.url);
  var id = url_parts.pathname.split('/')[1]

  fs.existsSync(`${id}/`) || fs.mkdirSync(`${id}/`);

  return res.sendFile(__dirname + '/id.html')
})

// Called from the button on {example-id}.html
// causes {example-id}/running to return true for 30s
// note: 'server' button turns all running files true for 30s
app.put('/:id/', function (req, res) {
  var url_parts = url.parse(req.url);
  var id = url_parts.pathname.split('/')[1] // get id from pathname

  if (id == "server") {
    turnAllOn();
    return res.end()
  } else {
    var filename = path.join(__dirname, url_parts.pathname, "running");
    turnOnFor30(filename);
    console.log(filename + " --> true")
    return res.end();
  }

})

// returns false by default, or true if button on {example-id} has 
// has been recently pressed
app.get('/:id/running', function (req, res) {
  var url_parts = url.parse(req.url);
  var id = url_parts.pathname.split('/')[1] // get id from pathname
  var filename = path.join(__dirname, url_parts.pathname);

  fs.existsSync(`${id}/`) || fs.mkdirSync(`${id}/`);
  
  fs.readFile(filename, function(err, data) {
    if (err) {
      console.log("Creating file: " + filename);
      data = "false"
      fs.writeFile(filename, data, function (err) {
        if (err) console.log(err);
      });
    }
    res.write(data);
    return res.end();
  });
})

// writes {example-id}/running to true for 30s and then back to false
function turnOnFor30(filename) {
  var timeleft = 30;
  var runningTimer = setInterval(function(){
    if (timeleft <= 0){
      fs.writeFile(filename, "false", function (err) {
        if (err) console.log(err);
      });
      console.log(filename + " --> false")
      clearInterval(runningTimer);
      return
    }
    fs.writeFile(filename, "true", function (err) {
      if (err) console.log(err);
    });
    timeleft -= 1;
  }, 1000);
}

// turns all 'running' files in directories to true for 30s
function turnAllOn() {
  console.log("**** Turning all 'running' files to true")
  // get all directories
  const getDirectories = source =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  var directories = getDirectories(__dirname);

  // turn all 'running' files to true for 30s
  directories.forEach(dir => {
    fs.readdirSync(dir).forEach(file => {
      if (file == "running") {
        var filename = path.join(__dirname, dir, file);
        console.log(filename + " --> true")
        turnOnFor30(filename);
      }
    });
  });
  return
}
var express = require('express');
var app = express();
var fs = require('fs-extra')
app.use(express.static(__dirname + '/public'));

fs.ensureDir("public", function (err) {
  if (err) {
    console.error(err)
    throw "Stopped "+err;
  }
  try {
    fs.copySync('scripts', 'public/scripts')
    fs.copySync('index.html', 'public/index.html')
    fs.copySync('src', 'public/src')
    fs.removeSync("public/src/resources")
    console.log("success!")
  } catch (err) {
    console.error(err)
  }
  app.listen(process.env.PORT || 3000, () => {
    console.log("running at http://localhost:3000")
  });
  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
  });
});

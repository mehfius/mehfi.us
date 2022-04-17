const path = require('path');
const fs   = require('fs');

const getAllFiles = function(dirPath, arrayOfFiles) {

    files = fs.readdirSync(dirPath)
    


    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
      let dir = dirPath + "/" + file;

      if (fs.statSync(dir).isDirectory()) {

        arrayOfFiles = getAllFiles(dir, arrayOfFiles)

      } else {

        arrayOfFiles.push(path.join("", dirPath, "/", file))
      }
    })

  return arrayOfFiles 
}

const result = getAllFiles(process.env['customdir']+"/import/js")


let text = "";

const teste = result.forEach(element => {

  const data = fs.readFileSync(element, 'utf8');

  text+=data;

  text+="\n\n";

});


 fs.writeFile('./export/all.js', text, function (err,data) {

  if (err) {
    return console.log(err);
  }
 
}); 

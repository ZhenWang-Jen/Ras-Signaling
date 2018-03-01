
var XLSX = require('xlsx');
var workbook = XLSX.readFile('./Ras_Signaling/res/Ras_Signaling.xlsx');
var sheet_name_list = workbook.SheetNames;
var result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
var resultArray = [];
// Create JSON file of nodes data
for (var i = 0; i<result.length; i++)
      {
        var groupArray = result[i].group_with
        if (groupArray != null) {
          groupArray = groupArray.split(" ")
        for(var h=0; h<groupArray.length; h++) { groupArray[h] = +groupArray[h]; } 
        }
        
        var colorArray = result[i].color
        if (colorArray != null) {
          colorArray = colorArray.split(" ")
        for(var h=0; h<colorArray.length; h++) { colorArray[h] = +colorArray[h]; } 
        }

        let node = {  
          key: parseInt(result[i].key),
          text: result[i].text, 
          shape: result[i].shape,
          x: parseFloat(result[i].x),
          y: parseFloat(result[i].y),
          w: parseFloat(result[i].w),
          h: parseFloat(result[i].h),
          group_with: groupArray,
          color: colorArray,
          url: result[i].url
        };
        resultArray.push(node);
      };
const fs = require('fs');
let dataNodes = JSON.stringify(resultArray); 
dataNodes = "nodes = '" + dataNodes + "';\n" 

// Create JSON file of links data
result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]);
resultArray = [];
for (var i = 0; i<result.length; i++)
      {
        let node = {  
          from: parseInt(result[i].from),
          to: parseInt(result[i].to),
          style: result[i].style,
          cx: parseFloat(result[i].cx),
          cy: parseFloat(result[i].cy)
        };
        resultArray.push(node);
      };
dataLinks = JSON.stringify(resultArray); 
dataLinks = dataNodes + "links = '" + dataLinks + "';\n" 

// Create JSON file of colors data
result = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]]);
resultArray = [];
for (var i = 0; i<result.length; i++)
      {
        let node = {  
          style: result[i].style,
          color: result[i].color
        };
        resultArray.push(node);
      };
dataColors = JSON.stringify(resultArray); 
dataColors = dataLinks + "colors = '" + dataColors + "';\n" 

fs.writeFileSync('./Ras_Signaling/res/data.json', dataColors);

/*

 var xlsxj = require("xlsx-to-json");
  xlsxj({
    input: "Ras signaling.xlsx", 
    output: "output.json"
  }, function(err, result) {
    if(err) {
      console.log("An error occurs.");
      console.error(err);
    }else {
      var myArray = [];
      for (var i = 0; i<2; i++)
      {
        var groupArray = result[i].group_with.split(" ");
        for(var h=0; h<groupArray.length; h++) { groupArray[h] = +groupArray[h]; } 
        
        var colorArray = result[i].color.split(" ")
        for(var h=0; h<colorArray.length; h++) { colorArray[h] = +colorArray[h]; } 

        let node = {  
          key: parseInt(result[i].key),
          text: result[i].text, 
          shape: result[i].shape,
          x: parseFloat(result[i].x),
          y: parseFloat(result[i].y),
          w: parseFloat(result[i].w),
          h: parseFloat(result[i].h),
          group_with: groupArray,
          color: colorArray
        };
        console.log(i);
        myArray.push(node);
      };
      
      console.log(myArray);
    let data = JSON.stringify(myArray);  
fs.writeFileSync('student.json', data);
    }
  });

*/
/*
//require the csvtojson converter class 
var Converter = require("csvtojson").Converter;
// create a new converter object
var converter = new Converter({});

// call the fromFile function which takes in the path to your 
// csv file as well as a callback function
converter.fromFile("nodes.csv",function(err,result){
    // if an error has occured then handle it
    if(err){
        console.log("An Error Has Occured");
        console.log(err);  
    } 
    // create a variable called json and store
    // the result of the conversion
    var nodesArray = result;
    
    // log our json to verify it has worked
    console.log(nodesArray);
});

*/
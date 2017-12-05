/**
 * Created by apple on 12/3/17.
 */
function analyser() {
  var f = document.getElementById("file-input").files;
  $('#file-info').html(f.length.toString() + ' files uploaded !');
  for (var i = 0; i < f.length; i++) {
    // console.log(f[i].name);
    if (f[i].type.match('csv')) {
      read_csv(f[i]);
      }
    else if(f[i].type.match('xml')){

    }
    else{
      alert(' Wrong Type of Files Uploaded! ')
    }
    }
  }

function read_csv(file) {
  var reader = new FileReader();
  reader.name = file.name;
  reader.readAsText(file);
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}
function loadHandler(event){
  var csv = event.target.result;
  processData(csv, event.target.name);
  // var test1 = JSON.parse(localStorage.getItem('dec1'));
  // var test2 = JSON.parse(localStorage.getItem('link_dec1'));
  // console.log(test1);
  // console.log(test2);

}
function processData(csv, name){
  x = {};
  link = [];
  var lines = csv.split(/\r\n|\n/);
  for(var i=0; i<lines.length; i++){
    var data = lines[i].split(',');
    if(data[2] == "ID"){
      x["ID"] = data;
    }
    // console.log(data);
    else{
      x[data[2]] = [data[0],data[1]];
      for(var j=3; j<data.length; j++){
        if(data[j]=='1'){
          link.push({source: data[2], target: x['ID'][j]})
        }
      }
    }
  }
  // console.log(x['ID']);
  if(name=="domain-explicit-communication-1.csv"){
    localStorage.setItem('dec1', JSON.stringify(x));
    localStorage.setItem('link_dec1', JSON.stringify(link));
  }
  else if(name=="domain-implicit-communication-1.csv"){
    localStorage.setItem('dic1', JSON.stringify(x));
    localStorage.setItem('link_dic1', JSON.stringify(link));
  }
  else if(name=="domain-permission-enforcement-1.csv"){
    localStorage.setItem('dpe1', JSON.stringify(x));
    localStorage.setItem('link_dpe1', JSON.stringify(link));
  }
  else if(name=="domain-permission-granted-1.csv"){
    localStorage.setItem('dpg1', JSON.stringify(x));
    localStorage.setItem('link_dpg1', JSON.stringify(link));
  }
  else{
    localStorage.setItem('dpu1', JSON.stringify(x));
    localStorage.setItem('link_dpu1', JSON.stringify(link));
  }
}
function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
    alert("Cannot Read Your Files!");
  }
}
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
    else if(f[i].name == "analysisResults-0.xml"){
      analyze_res0(f[i]);
    }
    else if(f[i].name == "analysisResults-1.xml"){
      analyze_res1(f[i]);
    }
    else if(f[i].name == "app-System.xml"){
    }
    else if(f[i].type.match('xml')){
      app_package(f[i]);
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

function analyze_res0(f){
  xmlDoc=loadXMLDoc(f);

  pEI_1 = [];
  senderDsmIdx=xmlDoc.getElementsByTagName("senderDsmIdx");
  receiverDsmIdx=xmlDoc.getElementsByTagName("receiverDsmIdx");
  resourceDsmIdx=xmlDoc.getElementsByTagName("resourceDsmIdx");
  for(i = 0; i < senderDsmIdx.length; i++){
    tmp = {sender:senderDsmIdx[i].childNodes[0].nodeValue, receiver: receiverDsmIdx[i].childNodes[0].nodeValue, resource: resourceDsmIdx[i].childNodes[0].nodeValue};
    pEI_1.push(tmp);
  }
  localStorage.setItem('pEI_1', JSON.stringify(pEI_1));

  iSI_1 = [];
  uIRI_1 = [];

  rComponent=xmlDoc.getElementsByTagName("rComponent");
  sComponent=xmlDoc.getElementsByTagName("sComponent");
  xComponent=xmlDoc.getElementsByTagName("xComponent");

  compName = xmlDoc.getElementsByTagName("compName");
  appPackageName = xmlDoc.getElementsByTagName("appPackageName");

  for(i = 0; i< rComponent.length; i++){
    rl = [appPackageName[i*3].childNodes[0].nodeValue, compName[i*3].childNodes[0].nodeValue];
    sl = [appPackageName[i*3+1].childNodes[0].nodeValue, compName[i*3+1].childNodes[0].nodeValue];
    xl = [appPackageName[i*3+2].childNodes[0].nodeValue, compName[i*3+2].childNodes[0].nodeValue];

    tmp = {r:rl, s:sl, x:xl};
    if(rComponent[i].parentNode.nodeName=="intentSpoofingInstance"){
      iSI_1.push(tmp);
    }
    else{
      uIRI_1.push(tmp);
    }
  }
  localStorage.setItem('iSI_1', JSON.stringify(iSI_1));
  localStorage.setItem('uIRI_1', JSON.stringify(uIRI_1));
}

function analyze_res1(f){
  xmlDoc=loadXMLDoc(f);

  malApp=xmlDoc.getElementsByTagName("malApp");
  malComp=xmlDoc.getElementsByTagName("malComp");
  malCompId=xmlDoc.getElementsByTagName("malCompId");
  malCompDsmIdx=xmlDoc.getElementsByTagName("malCompDsmIdx");
  vulApp=xmlDoc.getElementsByTagName("vulApp");
  vulComp=xmlDoc.getElementsByTagName("vulComp");
  vulCompId=xmlDoc.getElementsByTagName("vulCompId");
  vulCompDsmIdx=xmlDoc.getElementsByTagName("vulCompDsmIdx");
  resourceDsmIdx=xmlDoc.getElementsByTagName("resourceDsmIdx");
  resource=xmlDoc.getElementsByTagName("resource");


  pEI_2 = [];
  iSI_2 = [];
  uIRI_2 = [];
  for(i = 0; i < malApp.length; i++){
    mal_list = [malApp[i].childNodes[0].nodeValue, malComp[i].childNodes[0].nodeValue, malCompId[i].childNodes[0].nodeValue, malCompDsmIdx[i].childNodes[0].nodeValue];
    vul_list = [vulApp[i].childNodes[0].nodeValue, vulComp[i].childNodes[0].nodeValue, vulCompId[i].childNodes[0].nodeValue, vulCompDsmIdx[i].childNodes[0].nodeValue];
    resource_list = [resourceDsmIdx[i].childNodes[0].nodeValue, resource[i].childNodes[0].nodeValue];
    tmp = {mal:mal_list, vul: vul_list, resource: resource_list};
    pEI_2.push(tmp)
  }
  localStorage.setItem('pEI_2', JSON.stringify(pEI_2));


  rComponent=xmlDoc.getElementsByTagName("rComponent");
  sComponent=xmlDoc.getElementsByTagName("sComponent");
  xComponent=xmlDoc.getElementsByTagName("xComponent");

  compName = xmlDoc.getElementsByTagName("compName");
  appPackageName = xmlDoc.getElementsByTagName("appPackageName");

  for(i = 0; i< rComponent.length; i++){
    rl = [appPackageName[i*3].childNodes[0].nodeValue, compName[i*3].childNodes[0].nodeValue];
    sl = [appPackageName[i*3+1].childNodes[0].nodeValue, compName[i*3+1].childNodes[0].nodeValue];
    xl = [appPackageName[i*3+2].childNodes[0].nodeValue, compName[i*3+2].childNodes[0].nodeValue];

    tmp = {r:rl, s:sl, x:xl};
    if(rComponent[i].parentNode.nodeName=="intentSpoofingInstance"){
      iSI_2.push(tmp);
    }
    else{
      uIRI_2.push(tmp);
    }
  }
  localStorage.setItem('iSI_2', JSON.stringify(iSI_2));
  localStorage.setItem('uIRI_2', JSON.stringify(uIRI_2));
}

function app_package(xmlname) {
  xmlDoc = loadXMLDoc(xmlname);

  componentId = xmlDoc.getElementsByTagName("componentId");
  dsmIdx = xmlDoc.getElementsByTagName("dsmIdx");
  compName = xmlDoc.getElementsByTagName("compName");
  appPackageName = xmlDoc.getElementsByTagName("appPackageName");
  type = xmlDoc.getElementsByTagName("type");
  exported = xmlDoc.getElementsByTagName("exported");
  requiredPrmToAccess = xmlDoc.getElementsByTagName("requiredPrmToAccess");
  providerReadPermission = xmlDoc.getElementsByTagName("providerReadPermission");
  providerWritePermission = xmlDoc.getElementsByTagName("providerWritePermission");
  providerAuthority = xmlDoc.getElementsByTagName("providerAuthority");
  compRequiredPermissions = xmlDoc.getElementsByTagName("compRequiredPermissions");
  compActuallyUsedPermissions = xmlDoc.getElementsByTagName("compActuallyUsedPermissions");
  intentFilters = xmlDoc.getElementsByTagName("intentFilters");

  cpt_dict = {};

  for (i = 0; i < componentId.length; i++) {

    component = {};
    component['component_Name'] = compName[i].childNodes[0].nodeValue;
    component['component_Id'] = componentId[i].childNodes[0].nodeValue;
    component['dsmIdx'] = dsmIdx[i].childNodes[0].nodeValue;
    component['type'] = type[i].childNodes[0].nodeValue;
    component['exported'] = exported[i].childNodes[0].nodeValue;
    component['requiredPrmToAccess'] = requiredPrmToAccess[i].childNodes[0].nodeValue;
    component['providerReadPermission'] = providerReadPermission[i].childNodes[0].nodeValue;
    component['providerWriterPermission'] = providerWritePermission[i].childNodes[0].nodeValue;
    component['providerAuthority'] = providerAuthority[i].childNodes[0].nodeValue;

    var tmp1 = [];
    for (j = 1; j < compRequiredPermissions[i].childNodes.length; j = j + 2) {
      tmp1.push(compRequiredPermissions[i].childNodes[j].childNodes[0].nodeValue);
    }
    component['compRequiredPermission'] = tmp1;

    var tmp2 = [];
    for (j = 1; j < compActuallyUsedPermissions[i].childNodes.length; j = j + 1) {
      if (compActuallyUsedPermissions[i].childNodes[j].nodeType == 1) {
        tmp2.push(compActuallyUsedPermissions[i].childNodes[j].childNodes[0].nodeValue);
      }
    }
    component['compActuallyUsedPermission'] = tmp2;

    var tmp3 = {};
    for (j = 1; j < intentFilters[i].childNodes.length; j = j + 1) {
      var tmp = [];
      if (intentFilters[i].childNodes[j].nodeType == 1) {
        document.write("intentFilters" + ":" + '<br/>');
        document.write(intentFilters[i].childNodes[j].nodeName + '<br/>');
        for (k = 1; k < intentFilters[i].childNodes[j].childNodes.length; k++) {
          if (intentFilters[i].childNodes[j].childNodes[k].nodeType == 1) {
            document.write(intentFilters[i].childNodes[j].childNodes[k].nodeName + '<br/>');
            if (intentFilters[i].childNodes[j].childNodes[k].nodeName == 'ifID') {
              document.write(intentFilters[i].childNodes[j].childNodes[k].childNodes[0].nodeValue + '<br/>');
              output = output + "<br> " + "ifID:" + intentFilters[i].childNodes[j].childNodes[k].childNodes[0].nodeValue + "</br>";
            }
            if (intentFilters[i].childNodes[j].childNodes[k].nodeName == 'actions') {
              document.write("action : ");
              for (m = 1; m < intentFilters[i].childNodes[j].childNodes[k].childNodes.length; m = m + 1) {
                if (intentFilters[i].childNodes[j].childNodes[k].childNodes[m].nodeType == 1) {
                  document.write(intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[0].nodeValue + '<br/>');
                  output = output + "<br> " + "intentFilter.action:" + intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[0].nodeValue + "</br>";
                }
              }
            }
            if (intentFilters[i].childNodes[j].childNodes[k].nodeName == 'categories') {
              document.write("categories : ");
              for (m = 1; m < intentFilters[i].childNodes[j].childNodes[k].childNodes.length; m = m + 1) {
                if (intentFilters[i].childNodes[j].childNodes[k].childNodes[m].nodeType == 1) {
                  document.write(intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[0].nodeValue + '<br/>');
                  output = output + "<br> " + "intentFilter.category:" + intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[0].nodeValue + "</br>";
                }
              }
            }
            if (intentFilters[i].childNodes[j].childNodes[k].nodeName == 'data') {
              document.write("data : " + '<br/>');
              for (m = 1; m < intentFilters[i].childNodes[j].childNodes[k].childNodes.length; m = m + 1) {
                if (intentFilters[i].childNodes[j].childNodes[k].childNodes[m].nodeType == 1) {
                  document.write(intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes.length + '<br/>');
                  for (n = 1; n < intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes.length; n = n + 1)
                    if (intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[n].nodeType == 1) {
                      document.write(intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[n].nodeName + ': ' + intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[n].childNodes[0].nodeValue + '<br/>');
                      output = output + "<br>" + "intentFilter.data." + intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[n].nodeName + ': ' + intentFilters[i].childNodes[j].childNodes[k].childNodes[m].childNodes[n].childNodes[0].nodeValue + '</br>';
                    }


                }
              }
            }

            if (intentFilters[i].childNodes[j].childNodes[k].nodeName == 'dataPath') {
              document.write(intentFilters[i].childNodes[j].childNodes[k].childNodes[0].nodeValue + '<br/>' + '<br/>');
              output = output + "<br>" + "intentFilter.dataPath:" + intentFilters[i].childNodes[j].childNodes[k].childNodes[0].nodeValue + '</br>';
            }

          }
        }
      }
    }

    cpt_name = compName[i].childNodes[0].nodeValue;
    cpt_dict[cpt_name] = component;
  }
  pkg_name = appPackageName[i].childNodes[0].nodeValue;
  localStorage.setItem(pkg_name,JSON.stringify(cpt_dict));
}

function loadXMLDoc(dname)
{
  try{
    var xhr = new window.XMLHttpRequest();
    xhr.open("GET", dname, false);
    xhr.setRequestHeader('Content-Type', 'text/xml');
    xhr.send(null);

    return xhr.responseXML.documentElement;
  }
  catch(e){
    try //Internet Explorer
    {
      var xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
      xmlDoc.async = false;
      xmlDoc.load(dname);

      return xmlDoc;
    }
    catch(e)
    {
      try //Firefox, Mozilla, Opera, etc.
      {
        xmlDoc=document.implementation.createDocument("","",null);
      }
      catch(e) {alert(e.message)}
    }
    try
    {
      xmlDoc.async=false;
      xmlDoc.load(dname);
      return(xmlDoc);
    }
    catch(e) {alert(e.message)}
    return(null);
  }
}
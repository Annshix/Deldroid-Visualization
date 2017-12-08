/**
 * Created by apple on 12/3/17.
 */
function analyser() {
  var f = document.getElementById("file-input").files;
  $('#file-info').html(f.length.toString() + ' files uploaded !');
  for (var i = 0; i < f.length; i++) {
    console.log(f[i].name);
    read_file(f[i]);
    }
  }

function read_file(file) {
  var reader = new FileReader();
  reader.name = file.name;
  reader.readAsText(file);
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}
function loadHandler(event){
  var f = event.target.result;
  processData(f, event.target.name);
  // var test1 = JSON.parse(localStorage.getItem('dec1'));
  // var test2 = JSON.parse(localStorage.getItem('link_dec1'));
  // console.log(test1);
  // console.log(test2);
}
function processData(f, name){
  if(name.split('.').pop().toLowerCase() == 'csv'){
    processCsvData(f, name)
  }
  else if(name == "analysisResults-0.xml"){
    analyze_res0(f);
  }
  else if(name == "analysisResults-5.xml"){
      analyze_res1(f);
    }
    else if(name == "app-System.xml"){
    }
    else if(name.split('.').pop().toLowerCase() == 'xml'){
      // console.log(f);
      app_package(f);
    }
    else{
      alert(' Wrong Type of Files Uploaded! ')
    }
}
function processCsvData(csv, name){
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
  if(name=="domain-explicit-communication-5.csv"){
    localStorage.setItem('dec1', JSON.stringify(x));
    localStorage.setItem('link_dec1', JSON.stringify(link));
  }
  else if(name=="domain-implicit-communication-5.csv"){
    localStorage.setItem('dic1', JSON.stringify(x));
    localStorage.setItem('link_dic1', JSON.stringify(link));
  }
  else if(name=="domain-permission-enforcement-5.csv"){
    localStorage.setItem('dpe1', JSON.stringify(x));
    localStorage.setItem('link_dpe1', JSON.stringify(link));
  }
  else if(name=="domain-permission-granted-5.csv"){
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

function loadXMLDoc(dname) {
  var parser = new DOMParser();
  doc = parser.parseFromString(dname, "application/xml");
  return doc;
}

function analyze_res0(f){
  xmlDoc=loadXMLDoc(f);

  pEI_1 = [];
  senderDsmIdx=xmlDoc.getElementsByTagName("senderDsmIdx");
  receiverDsmIdx=xmlDoc.getElementsByTagName("receiverDsmIdx");
  resourceDsmIdx=xmlDoc.getElementsByTagName("resourceDsmIdx");
  for(i = 0; i < senderDsmIdx.length; i++){
    s = null; x = null; r = null;
    if(typeof(senderDsmIdx[i])!="undefined" && typeof(senderDsmIdx[i].childNodes[0]) != "undefined"){
      s = senderDsmIdx[i].childNodes[0].nodeValue;
    }
    if(typeof(receiverDsmIdx[i])!="undefined" && typeof(receiverDsmIdx[i].childNodes[0])!="undefined"){
      r = receiverDsmIdx[i].childNodes[0].nodeValue;
    }
    if(typeof(resourceDsmIdx[i])!="undefined" && typeof(resourceDsmIdx[i].childNodes[0])!="undefined"){
      x = resourceDsmIdx[i].childNodes[0].nodeValue;
    }
    tmp = {sender:s, receiver: r, resource: x};
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
    rl = null; sl = null; xl = null;
    if(typeof(appPackageName[i*3])!="undefined" && typeof(appPackageName[i*3].childNodes[0])!="undefined"){
      rl = [appPackageName[i*3].childNodes[0].nodeValue, compName[i*3].childNodes[0].nodeValue];
    }
    if(typeof(appPackageName[i*3+1])!="undefined" && typeof(appPackageName[i*3+1].childNodes[0])!="undefined"){
      sl = [appPackageName[i*3+1].childNodes[0].nodeValue, compName[i*3+1].childNodes[0].nodeValue];
    }
    if(typeof(appPackageName[i*3+2])!="undefined" && typeof(appPackageName[i*3+2].childNodes[0])!="undefined"){
      xl = [appPackageName[i*3+2].childNodes[0].nodeValue, compName[i*3+2].childNodes[0].nodeValue];
    }
    tmp = {sender:rl, receiver:sl, resource:xl};
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
  vulApp=xmlDoc.getElementsByTagName("vulApp");
  vulComp=xmlDoc.getElementsByTagName("vulComp");
  potApp=xmlDoc.getElementsByTagName("potApp");
  potComp=xmlDoc.getElementsByTagName("malComp");

  privilegeEscalationInstance = xmlDoc.getElementsByTagName("privilegeEscalationInstance");
  intentSpoofingInstance = xmlDoc.getElementsByTagName("intentSpoofingInstance");
  unauthorizedIntentReceiptInstance = xmlDoc.getElementsByTagName("unauthorizedIntentReceiptInstance");


  pEI_2 = [];
  iSI_2 = [];
  uIRI_2 = [];
  for(i = 0; i < privilegeEscalationInstance.length; i++){
    s = null; x = null; r = null;
    if(typeof(malApp[i])!="undefined" && typeof(malApp[i].childNodes[0]) != "undefined"){
      s = [malApp[i].childNodes[0].nodeValue, malComp[i].childNodes[0].nodeValue];
    }
    if(typeof(vulApp[i])!="undefined" && typeof(vulApp[i].childNodes[0])!="undefined"){
      r = [vulApp[i].childNodes[0].nodeValue, vulComp[i].childNodes[0].nodeValue];
    }
    if(typeof(potApp[i])!="undefined" && typeof(potApp[i].childNodes[0])!="undefined"){
      x = [potApp[i].childNodes[0].nodeValue, potComp[i].childNodes[0].nodeValue];
    }
    tmp = {sender:s, receiver: r, resource: x};
    pEI_2.push(tmp);
  }
  console.log(pEI_2);
  localStorage.setItem('pEI_2', JSON.stringify(pEI_2));

  for(i = privilegeEscalationInstance.length; i < privilegeEscalationInstance.length + intentSpoofingInstance.length; i++){
    s = null; x = null; r = null;
    if(typeof(malApp[i])!="undefined" && typeof(malApp[i].childNodes[0]) != "undefined"){
      s = [malApp[i].childNodes[0].nodeValue, malComp[i].childNodes[0].nodeValue];
    }
    if(typeof(vulApp[i])!="undefined" && typeof(vulApp[i].childNodes[0])!="undefined"){
      r = [vulApp[i].childNodes[0].nodeValue, vulComp[i].childNodes[0].nodeValue];
    }
    if(typeof(potApp[i])!="undefined" && typeof(potApp[i].childNodes[0])!="undefined"){
      x = [potApp[i].childNodes[0].nodeValue, potComp[i].childNodes[0].nodeValue];
    }
    tmp = {sender:s, receiver: r, resource: x};
    iSI_2.push(tmp);
  }
  console.log(iSI_2);
  localStorage.setItem('iSI_2', JSON.stringify(iSI_2));

  for(i = privilegeEscalationInstance.length + intentSpoofingInstance.length; i < privilegeEscalationInstance.length + intentSpoofingInstance.length + unauthorizedIntentReceiptInstance.length; i++){
    s = null; x = null; r = null;
    if(typeof(malApp[i])!="undefined" && typeof(malApp[i].childNodes[0]) != "undefined"){
      s = [malApp[i].childNodes[0].nodeValue, malComp[i].childNodes[0].nodeValue];
    }
    if(typeof(vulApp[i])!="undefined" && typeof(vulApp[i].childNodes[0])!="undefined"){
      r = [vulApp[i].childNodes[0].nodeValue, vulComp[i].childNodes[0].nodeValue];
    }
    if(typeof(potApp[i])!="undefined" && typeof(potApp[i].childNodes[0])!="undefined"){
      x = [potApp[i].childNodes[0].nodeValue, potComp[i].childNodes[0].nodeValue];
    }
    tmp = {sender:s, receiver: r, resource: x};
    uIRI_2.push(tmp);
  }
  console.log(uIRI_2);
  localStorage.setItem('uIRI_2', JSON.stringify(uIRI_2));

  console.log(iSI_2);
  console.log(uIRI_2);
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
    if(typeof(compName[i]) != "undefined" && compName[i] != null && typeof(compName[i].childNodes[0]) != "undefined" && compName[i].childNodes[0] != null){
      component['component_Name'] = compName[i].childNodes[0].nodeValue;
    }
    else{
      component['component_Name'] = null;
    }
    if(typeof(componentId[i])!="undefined" && typeof(componentId[i].childNodes[0])!="undefined"){
      component['component_Id'] = componentId[i].childNodes[0].nodeValue;
    }
    else{
      component['component_Id'] = null;
    }
    if(typeof(dsmIdx[i]) != "undefined" && typeof(dsmIdx[i].childNodes[0]) != "undefined"){
      component['dsmIdx'] = dsmIdx[i].childNodes[0].nodeValue;
    }
    else{
      component['dsmIdx'] = null;
    }
    if(typeof(type[i]) != "undefined" && typeof(type[i].childNodes[0]) != "undefined"){
      component['type'] = type[i].childNodes[0].nodeValue;
    }
    else{
      component['type'] = null;
    }
    if(typeof(exported[i]) != "undefined" && typeof(exported[i].childNodes[0]) != "undefined"){
      component['exported'] = exported[i].childNodes[0].nodeValue;
    }
    else{
      component['exported'] = null;
    }
    if(typeof(requiredPrmToAccess[i]) != "undefined" && typeof(requiredPrmToAccess[i].childNodes[0]) != "undefined"){
      component['requiredPrmToAccess'] = requiredPrmToAccess[i].childNodes[0].nodeValue;
    }
    else{
      component['requiredPrmToAccess'] = null;
    }
    if(typeof(providerReadPermission[i]) != "undefined" && typeof(providerReadPermission[i].childNodes[0]) != "undefined"){
      component['providerReadPermission'] = providerReadPermission[i].childNodes[0].nodeValue;
    }
    else{
      component['providerReadPermission'] = null;
    }
    if(typeof(providerAuthority[i]) != "undefined" && typeof(providerAuthority[i].childNodes[0]) != "undefined"){
      component['providerAuthority'] = providerAuthority[i].childNodes[0].nodeValue;
    }
    else{
      component['providerAuthority'] = null;
    }


    var tmp1 = [];
    if(typeof(compRequiredPermissions[i]) != "undefined" && compRequiredPermissions[i].childNodes.length > 0){
      for (j = 1; j < compRequiredPermissions[i].childNodes.length; j = j + 2) {
          tmp1.push(compRequiredPermissions[i].childNodes[j].childNodes[0].nodeValue);
      }
    }

    component['compRequiredPermission'] = tmp1;

    var tmp2 = [];
    if(typeof(compActuallyUsedPermissions[i]) != "undefined" && compActuallyUsedPermissions[i].childNodes.length > 0){
      for (j = 1; j < compActuallyUsedPermissions[i].childNodes.length; j = j + 1) {
        if (compActuallyUsedPermissions[i].childNodes[j].nodeType == 1) {
          tmp2.push(compActuallyUsedPermissions[i].childNodes[j].childNodes[0].nodeValue);
        }
      }
    }

    component['compActuallyUsedPermission'] = tmp2;

    cpt_name = compName[i].childNodes[0].nodeValue;
    cpt_dict[cpt_name] = component;
  }

  console.log(cpt_dict);
  pkg_name = xmlDoc.getElementsByTagName("packageName")[0].childNodes[0].nodeValue;
  console.log(pkg_name);
  localStorage.setItem(pkg_name,JSON.stringify(cpt_dict));

}


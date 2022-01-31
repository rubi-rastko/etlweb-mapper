test_obj_dest = { "demographics": { "first_name": "John", "last_name": "Smith", "location": { "lat": 45.518, "lon": -73.582, "zip": "H0H 0H0" }, "gender": "M" }, "id": 1001, "ac_id": "AC000000024", "external_id": "sor_client_external_id_1", "profile_id": 7890, "branch_id": 2001, "status": "active", "contacts": [ { "id": 1, "ac_id": "AC000000024", "external_id": "crm_client_contact_external_id_1", "contact_type": "Medical", "relationship": "Doctor", "language": "en", "status": "enabled", "demographics": { "first_name": "Jane", "last_name": "Smith", "gender": "M" } } ], "care_team": [ { "name": "John Smith", "id": 1001, "external_id": "sor_employee_external_id_1" } ], "language": "sq", "groups": [ { "id": 1, "name": "Group A" } ], "cost_centre": { "description": "Montreal", "id": 2, "number": "5555", "status": "enabled" }, "tags": [ "Tag" ], "timezone": "America/Toronto" }
test_obj_src =  { "form_sets":[ { "input":{ "name": "clientname", "value": "John Smith" }, "input":{ "name": "gender", "value": 0 } }, { "input":{ "name": "contact_name", "value": "Jane Smith" }, "input":{ "name": "relationship", "value": "Doctor" } } ] }

flatten_json = function(jsonobj, objectkey, items) {
    items = {}
    hierarchy_key = ""
    temp_items = {}

    for (k in jsonobj) {
        hierarchy_key = objectkey + "." + k.toString();

        if (jsonobj[k] && jsonobj[k] instanceof Object) {
            // equiv python dict.extend
            Object.assign(items, flatten_json(jsonobj[k], hierarchy_key, items));                        
        } else {
            items[hierarchy_key] = jsonobj[k];
        }
    };

    return items;

};

json_domify = function(jsonobj, domhook) {
    x = document.createElement("DIV");
    x.setAttribute("class", "dommedjson");

    for (i in jsonobj) {
        kvp = document.createElement("DIV");
        kvp.setAttribute("id", i.replace(/[\._]/, "-"));
        kvp.setAttribute("class", "jkvp")
        k = document.createElement("SPAN");
        k.setAttribute("class", "jkey");
        k.innerHTML = i
        kvp.appendChild(k);
        v = document.createElement("SPAN");
        v.setAttribute("class", "jval");
        v.innerHTML = items[i];
        k.addEventListener("click", on_val_click, false);
        kvp.appendChild(v);
            x.appendChild(kvp);   
            domhook.appendChild(x);   
    }
}



// GLOBALS

kkmappings = {
};       

last_two_selected = ["", ""]

geiger_counter = 1


domelements = {
    "inputjson1": document.getElementById("inputjson1"),
    "inputjson2": document.getElementById("inputjson2"),
    "parsesrcjson": document.getElementById("parsesrcjson"),
    "mapjson": document.getElementById("mapjson"),
    "pageheader": document.getElementById("pageheader"),
    "jsonbox1":document.getElementById("jsonleft"),
    "jsonbox2":document.getElementById("jsonright"),
    "listbox1":document.getElementById("listleft"),
    "listbox2":document.getElementById("listright"),
    "buttontabs": document.getElementsByClassName("tabbutton"),
};

domelements.inputjson1.innerHTML = JSON.stringify(test_obj_src, null, 4)
domelements.inputjson2.innerHTML = JSON.stringify(test_obj_dest, null, 4)

console.log(domelements.buttontabs);
    Array(domelements.buttontabs).forEach(function(i) {
    i.addEventListener("click", function(e) {
        var i;
        var x = document.getElementsByClassName("tabbedcontainer");
        var o = ""

        x.forEach(function(tabbedContainer) {
            tabbedContainer.style.display = "none";
        });

        switch(e.getAttribute("id")) {
            case "leftjson":
                o = "jsonleft";
                break;
            case "leftlist":
                o = "listleft";
                break;
            case "rightjson":
                o = "jsonright";
                break;
            case "rightlist":
                o = "listright";
                break;
        }

        document.getElementById(o).style.display = "block";
    });

});

// EVENT HANDLERS
domelements.inputjson1.addEventListener("paste", function(e) {

});


domelements.mapjson.addEventListener("click", function(e) {
  e.preventDefault();
  kkmappings[last_two_selected[0]] = last_two_selected[1];
  document.getElementById("jsonmapping").value = JSON.stringify(kkmappings, null, "\n");

});

domelements.parsesrcjson.addEventListener("click", function(e) {
  items = {};
  domhook = document.getElementById("iamyourfatherluke");
  
  while (domhook.firstChild) {
    domhook.removeChild(domhook.firstChild);
  }
  
  e.preventDefault();
  console.log("DOUBLE");
  jsrc1 = document.getElementById("inputjson1");
  jsrc2 = document.getElementById("inputjson2");
  try {
    jobj1 = JSON.parse(jsrc1.value);
    jobj2 = JSON.parse(jsrc2.value);

  } catch (SyntaxError) {
    window.alert("Bad JSON somewhere.");
  }
  
  items = flatten_json(jobj1, "client", items);          
  json_domify(items, domhook);
  items = flatten_json(jobj2, "jotform", items);          
  json_domify(items, domhook);

});

on_val_click = function(event_target) {
    kkp = document.getElementById("keykeypair");
    console.log(event_target);
    console.log(kkmappings);
    ksource = event_target.target.parentElement.firstElementChild.innerHTML;
    console.log(ksource);
    geiger_counter += 1;
    geiger_counter %= 2;
    last_two_selected[geiger_counter] = ksource;
    // kkmappings[last_two_selected[0]] = last_two_selected[1];
    kkp.children[0].innerHTML = last_two_selected[0] + "&nbsp;:&nbsp;";
    kkp.children[1].innerHTML = last_two_selected[1] + "&nbsp;";
    console.log(last_two_selected);
    
};



            
            






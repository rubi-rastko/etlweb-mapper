test_obj_dest = { "demographics": { "first_name": "John", "last_name": "Smith", "location": { "lat": 45.518, "lon": -73.582, "zip": "H0H 0H0" }, "gender": "M" }, "id": 1001, "ac_id": "AC000000024", "external_id": "sor_client_external_id_1", "profile_id": 7890, "branch_id": 2001, "status": "active", "contacts": [ { "id": 1, "ac_id": "AC000000024", "external_id": "crm_client_contact_external_id_1", "contact_type": "Medical", "relationship": "Doctor", "language": "en", "status": "enabled", "demographics": { "first_name": "Jane", "last_name": "Smith", "gender": "M" } } ], "care_team": [ { "name": "John Smith", "id": 1001, "external_id": "sor_employee_external_id_1" } ], "language": "sq", "groups": [ { "id": 1, "name": "Group A" } ], "cost_centre": { "description": "Montreal", "id": 2, "number": "5555", "status": "enabled" }, "tags": [ "Tag" ], "timezone": "America/Toronto" }
test_obj_src =  { "form_sets":[ { "input":{ "name": "clientname", "value": "John Smith" }, "input":{ "name": "gender", "value": 0 } }, { "input":{ "name": "contact_name", "value": "Jane Smith" }, "input":{ "name": "relationship", "value": "Doctor" } } ] }

flatten_json = function(jsonobj, objectkey, items) {
    items = {}
    hierarchy_key = ""
    temp_items = {}

    for (k in jsonobj) {
        hierarchy_key = objectkey + (objectkey ? "." : "") + k.toString();

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
    x.setAttribute("class", "domifiedjson");

    for (i in jsonobj) {
        kvp = document.createElement("DIV");
        kvp.setAttribute("id", i.replace(/[\._]/, "-"));
        kvp.setAttribute("class", "jkvp")
        k = document.createElement("DIV");
        k.setAttribute("class", "jkey");
        k.innerHTML = i
        kvp.appendChild(k);
        v = document.createElement("DIV");
        v.setAttribute("class", "jval");
        v.innerHTML = jsonobj[i];
        kvp.appendChild(v);
        kvp.addEventListener("click", on_val_click, true);
        x.appendChild(kvp);   
        domhook.appendChild(x);   
    }
}



// GLOBALS

kkmappings = {};
last_two_selected = ["", ""]
last_two_objects = [null, null]
geiger_counter = 1
domelements = {
    "inputjson1": document.getElementById("inputjson1"),
    "inputjson2": document.getElementById("inputjson2"),
    "pageheader": document.getElementById("pageheader"),
    "jsonbox1":document.getElementById("jsonleft"),
    "jsonbox2":document.getElementById("jsonright"),
    "listbox1":document.getElementById("listleft"),
    "listbox2":document.getElementById("listright"),
    "buttontabs": document.getElementsByClassName("tabbutton"),
    "jsonmapping": document.getElementById("mappingoutput"),
    "prefixkey1":document.getElementById("prefixkey1"),
    "prefixkey2":document.getElementById("prefixkey2"),
    "overridekb":document.getElementById("overridekb"),
    "divlist1":document.getElementById("divlist1"),
    "divlist2":document.getElementById("divlist2"),
};

items = {}
jobjects = [{},{}]
jobjects_flat = [{},{}]

domelements.inputjson1.innerHTML = JSON.stringify(test_obj_src, null, 4)
domelements.inputjson2.innerHTML = JSON.stringify(test_obj_dest, null, 4)

for (i = 0; i < domelements.buttontabs.length; i++) {
    domelements.buttontabs[i].addEventListener("click", function(e) {
        items = {};
        var i;
        var x = document.getElementsByClassName("tabbedcontainer");
        var o = ""
        var to_display = e.target.getAttribute("id") == "tabsource" ? "jsonsource" : "jsonmapping";
        var domhook = {};

        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        };

        if (e.target.getAttribute("id") == "tabmapping") {
            jobjects[0] = JSON.parse(domelements.inputjson1.value);
            jobjects[1] = JSON.parse(domelements.inputjson2.value);
            domhook = domelements.divlist1;
            
            while (domhook.firstChild) {
                domhook.removeChild(domhook.firstChild);
            }

            domhook = domelements.divlist2;
            
            while (domhook.firstChild) {
                domhook.removeChild(domhook.firstChild);
            }

            jobjects_flat[0] = flatten_json(jobjects[0], 
                "", 
                items
            );
            json_domify(jobjects_flat[0], domelements.divlist1);
            jobjects_flat[1] = flatten_json(jobjects[1], 
                "", 
                items
            );          
            json_domify(jobjects_flat[1], domelements.divlist2);
        }      
           
        document.getElementById(to_display).style.display = "block";        
    });

}

// EVENT HANDLERS
document.addEventListener("keypress",  function(e) {
    if (domelements.overridekb.checked == true) {
        switch(e.key) {
            case " ":
                e.preventDefault()
                kkmappings[last_two_selected[0]] = last_two_selected[1];
                domelements.jsonmapping.value = JSON.stringify(kkmappings, null, 4);
                break;

        }
    }
});


on_val_click = function(event_target) {
    source_text = event_target.target;

    if (event_target.target.getAttribute) {
        if (event_target.target.getAttribute("class") == "jval") {
            source_text = event_target.target.parentElement.firstElementChild;
        }
    }
    kkp = document.getElementById("keykeypair");
    ksource = source_text.innerHTML;


    
    geiger_counter += 1;    
    geiger_counter %= 2;

    last_two_selected[geiger_counter] = ksource;
    last_two_objects[geiger_counter] = source_text;
    source_text.style.backgroundColor = "#00bbcc22";
    kkp.children[0].innerHTML = last_two_selected[0] + "<br>" + jobjects_flat[0][last_two_selected[0]];
    kkp.children[1].innerHTML = last_two_selected[1] + "<br>" + jobjects_flat[1][last_two_selected[1]];

    if (geiger_counter == 0) {
        last_two_objects[geiger_counter + 1].style.backgroundColor = "#ffffff00";
    }
    
     
        
   




};

// domelements.inputjson1.addEventListener("paste", onpaste_domify_kvps, false);
// domelements.inputjson2.addEventListener("paste", onpaste_domify_kvps, false);



            
            






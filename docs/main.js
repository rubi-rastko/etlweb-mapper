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
    x.setAttribute("class", "domifiedjson");

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

kkmappings = {};
last_two_selected = ["", ""]
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
    "jsonmapping": document.getElementById("jsonmapping"),
    "leftprefixkey":document.getElementById("leftprefixkey"),
    "rightprefixkey":document.getElementById("rightprefixkey"),
    "overridekb":document.getElementById("overridekb"),
};

domelements.inputjson1.innerHTML = JSON.stringify(test_obj_src, null, 4)
domelements.inputjson2.innerHTML = JSON.stringify(test_obj_dest, null, 4)

for (i = 0; i < domelements.buttontabs.length; i++) {
    domelements.buttontabs[i].addEventListener("click", function(e) {
        var i;
        var x = document.getElementsByClassName("tabbedcontainer");
        var o = ""

        
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        };

        switch(e.target.getAttribute("id")) {
            case "leftjson":
                o = ["jsonleft", "jsonright"];
                break;
            case "leftlist":
                o = ["listleft", "listright"];
                break;
            default:
                o = null
                break;

        }

        if (o) {
            o.forEach(function(oitem) {
                document.getElementById(oitem).style.display = "block";
            });

        }
    });

}

// EVENT HANDLERS
domelements.inputjson1.addEventListener("paste", function(e) {

    items = {};
    domhook = document.getElementById("jsonleftlist");
  
    while (domhook.firstChild) {
        domhook.removeChild(domhook.firstChild);
    }
    
    e.preventDefault();
    jsrc = document.getElementById("inputjson1");
    jsrc.value = (e.clipboardData || window.clipboardData).getData('text');
    try {
        jobj = JSON.parse(jsrc.value);

    } catch (SyntaxError) {
        window.alert("Bad JSON somewhere.");
        return true;
    }
    
    items = flatten_json(jobj, domelements.leftprefixkey.value, items);          
    json_domify(items, domhook);
});

domelements.inputjson2.addEventListener("paste", function(e) {
    items = {};
    domhook = document.getElementById("jsonrightlist");
  
    

    while (domhook.firstChild) {
        domhook.removeChild(domhook.firstChild);
    }
    
    
    jsrc = document.getElementById("inputjson2");
    jsrc.value = (e.clipboardData || window.clipboardData).getData('text');

    try {
        jobj = JSON.parse(jsrc.value);

    } catch (SyntaxError) {
        window.alert("Bad JSON somewhere.");
    }
    
    items = flatten_json(jobj, domelements.rightprefixkey.value, items);          
    json_domify(items, domhook);
});


document.addEventListener("keypress",  function(e) {
    if (domelements.overridekb.checked == true) {
        switch(e.key) {
            case "m":
            case "M":
            case " ":
                e.preventDefault()
                kkmappings[last_two_selected[0]] = last_two_selected[1];
                domelements.jsonmapping.value = JSON.stringify(kkmappings, null, 4);
                break;

        }
    }
});


on_val_click = function(event_target) {
    kkp = document.getElementById("keykeypair");
    ksource = event_target.target.parentElement.firstElementChild.innerHTML;
    geiger_counter += 1;
    geiger_counter %= 2;
    last_two_selected[geiger_counter] = ksource;
    kkp.children[0].innerHTML = last_two_selected[0] + "&nbsp;:&nbsp;";
    kkp.children[1].innerHTML = last_two_selected[1] + "&nbsp;";    
};



            
            






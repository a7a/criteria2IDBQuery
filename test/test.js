var debug = false;

function write(obj) {
  var str = obj.constructor === Object ? JSON.stringify(obj) : obj;
  if(debug) {
    display(str);
  }
}

function display(str) {
  var result = document.getElementById("result");
  result.innerHTML = str + "<br>" + result.innerHTML;
}

function dbRequest(kri, callback) {
  var ret = [];
  var tra = db.transaction("store1", "readonly");
  var store = tra.objectStore("store1");

  var params = criteria2IDBQuery.createQueryParameter(kri, store);
//  console.log("## params");
//  console.log(params);
//console.log(params[0].filter + "");
//console.log(params[1].filter + "");

  var loop = function loop() {
//    console.log("param length: " + params.length);
    if(params.length > 0) {
      var param = params.shift();
      var range = criteria2IDBQuery.createIDBKeyRange(param, IDBKeyRange);
//      console.log("## store");
//      console.log(param.store);
//      console.log("## range");
//      console.log(range);
//      console.log(param.filter+"");

      var req = param.store.openCursor(range);
      req.onsuccess = function(e) {
        var cursor = e.target.result;
//        console.log("## cursor");
//        console.log(cursor);

        if(cursor) {
          if(param.filter(cursor.value)) {
            ret[ret.length] = cursor.value;
          }
          cursor.continue();

        } else {
          loop();
        }
      };
      req.onerror = function(e) {
        var err = e.target.error;
        console.error(err);
        write(err.name + " : " + err.message);
      };

    } else {
      if(typeof callback === "function") {
        callback(ret);
      }
    }
  };
  loop();
}

function check(check_target, name, func) {
  var test_result = true,
      compared = false,
      cnt = 0;

  for(var i = 0, l = check_target.length; i < l; i = i + 1) {
    compared = true;

    var d = check_target[i];

    write(d);

    if(!func(d)) {
//console.log(d.key1);
//console.log(d.key2);
//console.log(func + "");
//console.log(d.key1 === 100 || d.key2 === 120);
//console.log(func(d));
      console.log("ng data: " + JSON.stringify(d));
      test_result = false;
    }
  }

  for(var i = 0, l = check_target.length; i < l; i = i + 1) {
    if(func(check_target[i])) {
      cnt++;
    }
  }

  write("test_result: " + test_result);
  write("comapred: " + compared);
  write("cnt: " + cnt);
  write("check_target.length: " + check_target.length);

  display(
    name + ": " + (
      test_result &&
      (compared || (!compared && check_target.length === 0)) &&
      cnt === check_target.length ?
      "OK" : "NG"
    )
  );
}

function toggleDebug() {
  debug = !debug;
  console.log("debug: " + debug);
}

function load(name, cases) {
  for(var i = 0, l = cases.length; i < l; i = i + 1) {
    var input = document.createElement("input");
    input.setAttribute("id", name + "-" + (i + 1));
    input.setAttribute("type", "button");
    input.setAttribute("value", name + "-" + (i + 1));
    input.onclick = cases[i];
    document.getElementById("controller").appendChild(input);
  }
}

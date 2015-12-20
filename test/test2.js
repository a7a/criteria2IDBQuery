var test2 = [
  function test2_01_01(callback) {
    /*
      - operator eq, eq
      - and
      - same key
      - overlap range
    */
    var test_name = "test2_01_01";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 && d.key1 === 100;
        };

    kri.and("key1").eq.value(100)
       .and("key1").eq.value(100);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }
  ,
  function test2_01_02(callback) {
    /*
      - operator eq, eq
      - and
      - same key
      - not overlap range
    */
    var test_name = "test2_01_02";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 && d.key1 === 200;
        };

    kri.and("key1").eq.value(100)
       .and("key1").eq.value(200);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }
  ,
  function test2_01_03(callback) {
    /*
      - operator eq, eq
      - and
      - different key
      - overlap range
    */
    var test_name = "test2_01_03";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 && d.key2 === 100;
        };

    kri.and("key1").eq.value(100)
       .and("key2").eq.value(100);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }
  ,
  function test2_01_04(callback) {
    /*
      - operator eq, eq
      - and
      - different key
      - not overlap range
    */
    var test_name = "test2_01_04";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 && d.key2 === 120;
        };

    kri.and("key1").eq.value(100)
       .and("key2").eq.value(120);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }
  ,

  function test2_01_05(callback) {
    /*
      - operator eq, eq
      - or
      - same key
      - overlap range
    */
    var test_name = "test2_01_05";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 || d.key1 === 100;
        };

    kri.or("key1").eq.value(100)
       .or("key1").eq.value(100);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }
  ,
  function test2_01_06(callback) {
    /*
      - operator eq, eq
      - or
      - same key
      - not overlap range
    */
    var test_name = "test2_01_06";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 || d.key1 === 200;
        };

    kri.or("key1").eq.value(100)
       .or("key1").eq.value(200);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }
  ,
  function test2_01_07(callback) {
    /*
      - operator eq, eq
      - or
      - different key
      - overlap range
    */
    var test_name = "test2_01_07";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 || d.key2 === 100;
        };

    kri.or("key1").eq.value(100)
       .or("key2").eq.value(100);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }
  ,
  function test2_01_08(callback) {
    /*
      - operator eq, eq
      - or
      - different key
      - not overlap range
    */
    var test_name = "test2_01_08";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 || d.key2 === 120;
        };

    kri.or("key1").eq.value(100)
       .or("key2").eq.value(120);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }

];

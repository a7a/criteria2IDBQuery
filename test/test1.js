var test1 = [
  function test1_01(callback) {
    var test_name = "test1_01";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 400;
        };

    kri.and("key1").eq.value(400);

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
  },

  function test1_02(callback) {
    var test_name = "test1_02";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 !== 100;
        };

    kri.and("key1").ne.value(100);

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
  },

  function test1_03(callback) {
    var test_name = "test1_3";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 < 200;
        };

    kri.and("key1").lt.value(200);

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
  },

  function test1_04(callback) {
    var test_name = "test1_4";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 <= 200;
        };

    kri.and("key1").le.value(200);

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
  },

  function test1_05(callback) {
    var test_name = "test1_5";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 > 200;
        };

    kri.and("key1").gt.value(200);

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
  },

  function test1_06(callback) {
    var test_name = "test1_6";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 >= 200;
        };

    kri.and("key1").ge.value(200);

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
  },

  function test1_07(callback) {
    var test_name = "test1_7";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 === 100 || d.key1 === 300;
        };

    kri.and("key1").in.value(100, 300);

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
  },

  function test1_08(callback) {
    var test_name = "test1_8";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 !== 100 && d.key1 !== 300;
        };

    kri.and("key1").not_in.value(100, 300);

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
  },

  function test1_09(callback) {
    var test_name = "test1_9";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 >= 200 && d.key1 <= 400;
        };

    kri.and("key1").between(200, 400);

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
  },

  function test1_10(callback) {
    var test_name = "test1_10";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return d.key1 < 200 || d.key1 > 300;
        };

    kri.and("key1").not_between(200, 300);

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
  },

  function test1_11(callback) {
    var test_name = "test1_11";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return /^abc/.test(d.key4);
        };

    kri.and("key4").match(/^abc/);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return d.key4 !== void 0 && checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return d.key4 !== void 0 && !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  },

  function test1_12(callback) {
    var test_name = "test1_12";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return !/^abc/.test(d.key4);
        };

    kri.and("key4").not_match(/^abc/);

    new Promise(function(fulfill, reject) {
      dbRequest(kri, function(ret) {
        console.log("# " + test_name + " end #");

        check(ret, test_name, function(d) { return d.key4 !== void 0 && checker(d); });

        fulfill();
      });
    })
      .then(function() {
      dbRequest(kri.not(), function(ret) {
        check(ret, test_name + " / not ", function(d) { return d.key4 !== void 0 && !checker(d); });

        if(typeof callback === "function") {
          callback();
        }
      });
    });
  }
];

var criteria2IDBQuery = require("../dist/js/node/criteria2IDBQuery.js").criteria2IDBQuery;
var analyzeConditionsFromCriteria =
    require("../src/js/lib/analyzeConditionsFromCriteria.js").analyzeConditionsFromCriteria;
var createQueryParameterFromConditionsAndIndices =
    require("../src/js/lib/createQueryParameterFromConditionsAndIndices.js")
      .createQueryParameterFromConditionsAndIndices;
var createIndicesFromObjectStore =
    require("../src/js/lib/createIndicesFromObjectStore.js").createIndicesFromObjectStore;

var Kriteria = require("kriteria").Kriteria;
var Condition = require("../node_modules/kriteria/src/js/lib/Condition.js").Condition;


describe("test1 - criteria2IDBQuery.js", function() {

  var store_stub = {
    keyPath: null,
    index: function(obj) {
      for(var i = 0, l = this.indexNames.length; i < l; i = i + 1) {
        if(obj.id === this.indexNames[i].id) {
          return this.indexNames[i];
        }
      }

      return null;
    },
    indexNames: [
      { id: 1, keyPath: ["key2"] },
      { id: 2, keyPath: ["key1"] },
      { id: 3, keyPath: ["key1", "key2"] },
      { id: 4, keyPath: ["key1", "key2", "key3"] },
      { id: 5, keyPath: ["keyX", "keyY"] },
      { id: 6, keyPath: ["keyX"] },
      { id: 7, keyPath: ["keyZ"] }
    ]
  };

  it("001 - analyzeConditions - 1", function(done) {
    var cri1 = new Kriteria();
    var test = [
      { result: true,
        data: [
          {
            keys: ["keyX"],
            conditions: [new Condition("keyX", "eq", [100], "value", null)]
          }
        ]
      }
    ];
    var test2 = [
      { result: true,
        data: [
          { store_keyPath: ["keyX"],
            method: ["only"],
            keypath: ["keyX"],
            value1: [100],
            value2: [100],
            filter: (
              new Kriteria()
              .and("keyX").eq.value(100).matcher()
            ) + ''
          }
        ]
      }
    ];
    var check = ["left_key", "operator", "right_key", "key_type", "criteria"];

    cri1.and("keyX").eq.value(100);
    var ret = analyzeConditionsFromCriteria(cri1);

    for(var i = 0, l = test.length; i < l; i = i + 1) {
      for(var j = 0, ll = test[i].data.length; j < ll; j = j + 1) {
        expect(test[i].data[j].keys).toEqual(ret[j].keys);

        for(var k = 0, l3 = check.length; k < l3; k = k + 1) {
          expect(test[i].data[j].conditions[check[k]]).toEqual(ret[j].conditions[check[k]]);
        }
      }
    }

    var ret2 = createQueryParameterFromConditionsAndIndices(
      ret,
      createIndicesFromObjectStore(store_stub)
    );

    for(var i = 0, l = test2.length; i < l; i = i + 1) {
      for(var j = 0, ll = test2[i].data.length; j < ll; j = j + 1) {
        expect(test2[i].data[j].store_keyPath).toEqual(ret2[j].store.keyPath);
        expect(test2[i].data[j].method).toEqual(ret2[j].method);
        expect(test2[i].data[j].keypath).toEqual(ret2[j].keypath);
        expect(test2[i].data[j].value1).toEqual(ret2[j].value1);
        expect(test2[i].data[j].value2).toEqual(ret2[j].value2);
        expect(test2[i].data[j].filter).toEqual(ret2[j].filter + '');
      }
    }

    done();
  });

  it("002 - analyzeConditions - 2", function(done) {
    var cri1 = new Kriteria();
    var test = [
      { result: true,
        data: [
          {
            keys: ["key1", "key2"],
            conditions: [
              new Condition("key1", "eq", [100], "value", null),
              new Condition("key2", "eq", [200], "value", null)
            ]
          }
        ]
      }
    ];
    var test2 = [
      { result: true,
        data: [
          { store_keyPath: ["key1", "key2"],
            method: ["only"],
            keypath: ["key1", "key2"],
            value1: [100, 200],
            value2: [100, 200],
            filter: (
              new Kriteria()
              .and("key1").eq.value(100)
              .and("key2").eq.value(200).matcher()
            ) + ''
          }
        ]
      }
    ];
    var check = ["left_key", "operator", "right_key", "key_type", "criteria"];

    cri1.and("key1").eq.value(100)
        .and("key2").eq.value(200);
    var ret = analyzeConditionsFromCriteria(cri1);

    for(var i = 0, l = test.length; i < l; i = i + 1) {
      for(var j = 0, ll = test[i].data.length; j < ll; j = j + 1) {
        expect(test[i].data[j].keys).toEqual(ret[j].keys);

        for(var k = 0, l3 = check.length; k < l3; k = k + 1) {
          expect(test[i].data[j].conditions[check[k]]).toEqual(ret[j].conditions[check[k]]);
        }
      }
    }

    var ret2 = createQueryParameterFromConditionsAndIndices(
      ret,
      createIndicesFromObjectStore(store_stub)
    );

    for(var i = 0, l = test2.length; i < l; i = i + 1) {
      for(var j = 0, ll = test2[i].data.length; j < ll; j = j + 1) {
        expect(test2[i].data[j].store_keyPath).toEqual(ret2[j].store.keyPath);
        expect(test2[i].data[j].method).toEqual(ret2[j].method);
        expect(test2[i].data[j].keypath).toEqual(ret2[j].keypath);
        expect(test2[i].data[j].value1).toEqual(ret2[j].value1);
        expect(test2[i].data[j].value2).toEqual(ret2[j].value2);
        expect(test2[i].data[j].filter).toEqual(ret2[j].filter + '');
      }
    }

    done();
  });

  it("003 - analyzeConditions - 3", function(done) {
    var cri1 = new Kriteria();
    var test = [
      { result: true,
        data: [
          {
            keys: ["key1"],
            conditions: [
              new Condition("key1", "eq", [100], "value", null),
              new Condition("key1", "eq", [200], "value", null)
            ]
          }
        ]
      }
    ];
    var test2 = [
      { result: true,
        data: [
          { store_keyPath: ["key1"],
            method: ["only"],
            keypath: ["key1"],
            value1: [200],
            value2: [200],
            filter: (
              new Kriteria()
              .and("key1").eq.value(100)
              .and("key1").eq.value(200).matcher()
            ) + ''
          }
        ]
      }
    ];
    var check = ["left_key", "operator", "right_key", "key_type", "criteria"];

    cri1.and("key1").eq.value(100)
        .and("key1").eq.value(200);
    var ret = analyzeConditionsFromCriteria(cri1);

    for(var i = 0, l = test.length; i < l; i = i + 1) {
      for(var j = 0, ll = test[i].data.length; j < ll; j = j + 1) {
        expect(test[i].data[j].keys).toEqual(ret[j].keys);

        for(var k = 0, l3 = check.length; k < l3; k = k + 1) {
          expect(test[i].data[j].conditions[check[k]]).toEqual(ret[j].conditions[check[k]]);
        }
      }
    }

    var ret2 = createQueryParameterFromConditionsAndIndices(
      ret,
      createIndicesFromObjectStore(store_stub)
    );

    for(var i = 0, l = test2.length; i < l; i = i + 1) {
      for(var j = 0, ll = test2[i].data.length; j < ll; j = j + 1) {
        expect(test2[i].data[j].store_keyPath).toEqual(ret2[j].store.keyPath);
        expect(test2[i].data[j].method).toEqual(ret2[j].method);
        expect(test2[i].data[j].keypath).toEqual(ret2[j].keypath);
        expect(test2[i].data[j].value1).toEqual(ret2[j].value1);
        expect(test2[i].data[j].value2).toEqual(ret2[j].value2);
        expect(test2[i].data[j].filter).toEqual(ret2[j].filter + '');
      }
    }

    done();
  });

  it("004 - analyzeConditions - 4", function(done) {
    var cri1 = new Kriteria();
    var test = [
      { result: true,
        data: [
          {
            keys: ["key1"],
            conditions: [
              new Condition("key1", "eq", [100], "value", null),
              new Condition("key2", "eq", ["keyX"], "value", null)
            ]
          }
        ]
      }
    ];
    var test2 = [
      { result: true,
        data: [
          { store_keyPath: ["key1"],
            method: ["only"],
            keypath: ["key1"],
            value1: [100],
            value2: [100],
            filter: (
              new Kriteria()
              .and("key1").eq.value(100)
              .and("key2").eq.key("keyX").matcher()
            ) + ''
          }
        ]
      }
    ];
    var check = ["left_key", "operator", "right_key", "key_type", "criteria"];

    cri1.and("key1").eq.value(100)
        .and("key2").eq.key("keyX");
    var ret = analyzeConditionsFromCriteria(cri1);

    for(var i = 0, l = test.length; i < l; i = i + 1) {
      for(var j = 0, ll = test[i].data.length; j < ll; j = j + 1) {
        expect(test[i].data[j].keys).toEqual(ret[j].keys);

        for(var k = 0, l3 = check.length; k < l3; k = k + 1) {
          expect(test[i].data[j].conditions[check[k]]).toEqual(ret[j].conditions[check[k]]);
        }
      }
    }

    var ret2 = createQueryParameterFromConditionsAndIndices(
      ret,
      createIndicesFromObjectStore(store_stub)
    );

    for(var i = 0, l = test2.length; i < l; i = i + 1) {
      for(var j = 0, ll = test2[i].data.length; j < ll; j = j + 1) {
        expect(test2[i].data[j].store_keyPath).toEqual(ret2[j].store.keyPath);
        expect(test2[i].data[j].method).toEqual(ret2[j].method);
        expect(test2[i].data[j].keypath).toEqual(ret2[j].keypath);
        expect(test2[i].data[j].value1).toEqual(ret2[j].value1);
        expect(test2[i].data[j].value2).toEqual(ret2[j].value2);
        expect(test2[i].data[j].filter).toEqual(ret2[j].filter + '');
      }
    }

    done();
  });

  it("005 - analyzeConditions - 5", function(done) {
    var cri1 = new Kriteria();
    var test = [
      { result: true,
        data: [
          {
            keys: ["key1"],
            conditions: [
              new Condition("key1", "eq", [100], "value", null)
            ]
          },
          {
            keys: ["key2"],
            conditions: [
              new Condition("key2", "eq", [200], "value", null)
            ]
          }
        ]
      }
    ];
    var test2 = [
      { result: true,
        data: [
          { store_keyPath: ["key1"],
            method: ["only"],
            keypath: ["key1"],
            value1: [100],
            value2: [100],
            filter: (
              new Kriteria()
              .and("key1").eq.value(100).matcher()
            ) + ''
          },
          { store_keyPath: ["key2"],
            method: ["only"],
            keypath: ["key2"],
            value1: [200],
            value2: [200],
            filter: (
              new Kriteria()
              .and("key2").eq.value(200).matcher()
            ) + ''
          }
        ]
      }
    ];
    var check = ["left_key", "operator", "right_key", "key_type", "criteria"];

    cri1.or("key1").eq.value(100)
        .or("key2").eq.value(200);
    var ret = analyzeConditionsFromCriteria(cri1);

    for(var i = 0, l = test.length; i < l; i = i + 1) {
      for(var j = 0, ll = test[i].data.length; j < ll; j = j + 1) {
        expect(test[i].data[j].keys).toEqual(ret[j].keys);

        for(var k = 0, l3 = check.length; k < l3; k = k + 1) {
          expect(test[i].data[j].conditions[check[k]]).toEqual(ret[j].conditions[check[k]]);
        }
      }
    }

    var ret2 = createQueryParameterFromConditionsAndIndices(
      ret,
      createIndicesFromObjectStore(store_stub)
    );

    for(var i = 0, l = test2.length; i < l; i = i + 1) {
      for(var j = 0, ll = test2[i].data.length; j < ll; j = j + 1) {
        expect(test2[i].data[j].store_keyPath).toEqual(ret2[j].store.keyPath);
        expect(test2[i].data[j].method).toEqual(ret2[j].method);
        expect(test2[i].data[j].keypath).toEqual(ret2[j].keypath);
        expect(test2[i].data[j].value1).toEqual(ret2[j].value1);
        expect(test2[i].data[j].value2).toEqual(ret2[j].value2);
        expect(test2[i].data[j].filter).toEqual(ret2[j].filter + '');
      }
    }

    done();
  });

  it("006 - analyzeConditions - 6", function(done) {
    var cri1 = new Kriteria();
    var cri2 = new Kriteria();
    var test = [
      { result: true,
        data: [
          {
            keys: ["key1"],
            conditions: [
              new Condition("key1", "eq", [100], "value", null),
              new Condition("key1", "eq", [200], "value", null)
            ]
          },
          {
            keys: ["key1", "key2"],
            conditions: [
              new Condition("key1", "eq", [100], "value", null),
              new Condition("key2", "eq", [300], "vlaue", null)
            ]
          },
          {
            keys: ["key1"],
            conditions: [
              new Condition("key1", "eq", [100], "value", null),
              new Condition("key3", "eq", ["keyX"], "key", null)
            ]
          },
        ]
      }
    ];
    var test2 = [
      { result: true,
        data: [
          { store_keyPath: ["key1"],
            method: ["only"],
            keypath: ["key1"],
            value1: [200],
            value2: [200],
            filter: (
              new Kriteria()
              .and("key1").eq.value(100)
              .and("key1").eq.value(200).matcher()
            ) + ''
          },
          { store_keyPath: ["key1", "key2"],
            method: ["only"],
            keypath: ["key1", "key2"],
            value1: [100, 300],
            value2: [100, 300],
            filter: (
              new Kriteria()
              .and("key1").eq.value(100)
              .and("key2").eq.value(300).matcher()
            ) + ''
          },
          { store_keyPath: ["key1"],
            method: ["only"],
            keypath: ["key1"],
            value1: [100],
            value2: [100],
            filter: (
              new Kriteria()
              .and("key1").eq.value(100)
              .and("key3").eq.key("keyX").matcher()
            ) + ''
          }
        ]
      }
    ];
    var check = ["left_key", "operator", "right_key", "key_type", "criteria"];

    cri1.and("key1").eq.value(100)
        .and(function($) {
          $.or("key1").eq.value(200)
           .or("key2").eq.value(300)
           .or("key3").eq.key("keyX");
        });
    var ret = analyzeConditionsFromCriteria(cri1);

    for(var i = 0, l = test.length; i < l; i = i + 1) {
      for(var j = 0, ll = test[i].data.length; j < ll; j = j + 1) {
        expect(test[i].data[j].keys).toEqual(ret[j].keys);

        for(var k = 0, l3 = check.length; k < l3; k = k + 1) {
          expect(test[i].data[j].conditions[check[k]]).toEqual(ret[j].conditions[check[k]]);
        }
      }
    }

    var ret2 = createQueryParameterFromConditionsAndIndices(
      ret,
      createIndicesFromObjectStore(store_stub)
    );

    for(var i = 0, l = test2.length; i < l; i = i + 1) {
      for(var j = 0, ll = test2[i].data.length; j < ll; j = j + 1) {
        expect(test2[i].data[j].store_keyPath).toEqual(ret2[j].store.keyPath);
        expect(test2[i].data[j].method).toEqual(ret2[j].method);
        expect(test2[i].data[j].keypath).toEqual(ret2[j].keypath);
        expect(test2[i].data[j].value1).toEqual(ret2[j].value1);
        expect(test2[i].data[j].value2).toEqual(ret2[j].value2);
        expect(test2[i].data[j].filter).toEqual(ret2[j].filter + '');
      }
    }

    done();
  });


  it("101 - criteria2IDBQuery - eq", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key1").eq.value(100).matcher() + ''
      }
    ];
    var test2 = [
      { method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: new Kriteria().and("key1").ne.value(100).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### eq ###");
    var cri = new Kriteria();
    cri.and("key1").eq.value(100);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("102 - criteria2IDBQuery - ne", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: new Kriteria().and("key1").ne.value(100).matcher() + ''
      }
    ];
    var test2 = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key1").eq.value(100).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### ne ###");
    cri = new Kriteria();
    cri.and("key1").ne.value(100);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("103 - criteria2IDBQuery - lt", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: ["upperBound", true],
        keypath: ["key1"],
        value1: [100],
        value2: [],
        filter: new Kriteria().and("key1").lt.value(100).matcher() + ''
      }
    ];
    var test2 = [
      { method: ["lowerBound", false],
        keypath: ["key1"],
        value1: [],
        value2: [100],
        filter: new Kriteria().and("key1").ge.value(100).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### lt ###");
    cri = new Kriteria();
    cri.and("key1").lt.value(100);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("104 - criteria2IDBQuery - le", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: ["upperBound", false],
        keypath: ["key1"],
        value1: [100],
        value2: [],
        filter: new Kriteria().and("key1").le.value(100).matcher() + ''
      }
    ];
    var test2 = [
      { method: ["lowerBound", true],
        keypath: ["key1"],
        value1: [],
        value2: [100],
        filter: new Kriteria().and("key1").gt.value(100).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### le ###");
    cri = new Kriteria();
    cri.and("key1").le.value(100);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("105 - criteria2IDBQuery - gt", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: ["lowerBound", true],
        keypath: ["key1"],
        value1: [],
        value2: [100],
        filter: new Kriteria().and("key1").gt.value(100).matcher() + ''
      }
    ];
    var test2 = [
      { method: ["upperBound", false],
        keypath: ["key1"],
        value1: [100],
        value2: [],
        filter: new Kriteria().and("key1").le.value(100).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### gt ###");
    cri = new Kriteria();
    cri.and("key1").gt.value(100);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("106 - criteria2IDBQuery - ge", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: ["lowerBound", false],
        keypath: ["key1"],
        value1: [],
        value2: [100],
        filter: new Kriteria().and("key1").ge.value(100).matcher() + ''
      }
    ];
    var test2 = [
      { method: ["upperBound", true],
        keypath: ["key1"],
        value1: [100],
        value2: [],
        filter: new Kriteria().and("key1").lt.value(100).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### ge ###");
    cri = new Kriteria();
    cri.and("key1").ge.value(100);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("107 - criteria2IDBQuery - in", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key1").eq.value(100).matcher() + ''
      },
      { method: ["only"],
        keypath: ["key1"],
        value1: [200],
        value2: [200],
        filter: new Kriteria().and("key1").eq.value(200).matcher() + ''
      },
      { method: ["only"],
        keypath: ["key1"],
        value1: [300],
        value2: [300],
        filter: new Kriteria().and("key1").eq.value(300).matcher() + ''
      }
    ];
    var test2 = [
      { method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: new Kriteria().and("key1").ne.value(100)
                              .and("key1").ne.value(200)
                              .and("key1").ne.value(300).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### in ###");
    cri = new Kriteria();
    cri.and("key1").in.value(100, 200, 300);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    //console.log("### in not ###");
    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("108 - criteria2IDBQuery - not_in", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: new Kriteria().and("key1").ne.value(100)
                              .and("key1").ne.value(200)
                              .and("key1").ne.value(300).matcher() + ''
      }
    ];
    var test2 = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key1").eq.value(100).matcher() + ''
      },
      { method: ["only"],
        keypath: ["key1"],
        value1: [200],
        value2: [200],
        filter: new Kriteria().and("key1").eq.value(200).matcher() + ''
      },
      { method: ["only"],
        keypath: ["key1"],
        value1: [300],
        value2: [300],
        filter: new Kriteria().and("key1").eq.value(300).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### not_in ###");
    cri = new Kriteria();
    cri.and("key1").not_in.value(100, 200, 300);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    //console.log("### not_in not ###");
    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("109 - criteria2IDBQuery - between", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: ["bound", false, false],
        keypath: ["key1"],
        value1: [100],
        value2: [200],
        filter: new Kriteria().and("key1").ge.value(100)
                              .and("key1").le.value(200).matcher() + ''
      }
    ];
    var test2 = [
      { method: ["upperBound", true],
        keypath: ["key1"],
        value1: [100],
        value2: [],
        filter: new Kriteria().and("key1").lt.value(100).matcher() + ''
      },
      { method: ["lowerBound", true],
        keypath: ["key1"],
        value1: [],
        value2: [200],
        filter: new Kriteria().and("key1").gt.value(200).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### between ###");
    var cri = new Kriteria();
    cri.and("key1").between(100, 200);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    //console.log("### between not ###");
    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });


  it("110 - criteria2IDBQuery - not_between", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: ["upperBound", true],
        keypath: ["key1"],
        value1: [100],
        value2: [],
        filter: new Kriteria().and("key1").lt.value(100).matcher() + ''
      },
      { method: ["lowerBound", true],
        keypath: ["key1"],
        value1: [],
        value2: [200],
        filter: new Kriteria().and("key1").gt.value(200).matcher() + ''
      }
    ];
    var test2 = [
      { method: ["bound", false, false],
        keypath: ["key1"],
        value1: [100],
        value2: [200],
        filter: new Kriteria().and("key1").ge.value(100)
                              .and("key1").le.value(200).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### not_between ###");
    var cri = new Kriteria();
    cri.and("key1").not_between(100, 200);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    //console.log("### not_between not ###");
    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("111 - criteria2IDBQuery - match", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: new Kriteria().and("key1").match(/^abc/).matcher() + ''
      }
    ];
    var test2 = [
      { method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: new Kriteria().and("key1").not_match(/^abc/).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### match ###");
    var cri = new Kriteria();
    cri.and("key1").match(/^abc/);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    //console.log("### match not ###");
    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("112 - criteria2IDBQuery - not_match", function(done) {
    var ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;

    var test = [
      { method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: new Kriteria().and("key1").not_match(/^abc/).matcher() + ''
      }
    ];
    var test2 = [
      { method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: new Kriteria().and("key1").match(/^abc/).matcher() + ''
      }
    ];
    var check = ["method", "keypath", "value1", "value2"];

    //console.log("### not_match ###");
    var cri = new Kriteria();
    cri.and("key1").not_match(/^abc/);
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    //console.log("### not_match not ###");
    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);

    for(i = 0, l = test2.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test2[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test2[i].filter).toEqual(ret[i].filter + '');
    }

    cri.not();
    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("201 - criteria2IDBQuery - 1", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100]
      }
    ];

    cri.and("key1").eq.value(100)
       .and("key1").ne.value(100);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("202.1 - criteria2IDBQuery - 2.1", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["upperBound", false],
        keypath: ["key2"],
        value1: [200],
        value2: []
      }
    ];

    cri.and("key1").ge.value(100)
       .and("key2").le.value(200);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("202.2 - criteria2IDBQuery - 2.2", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["upperBound", false],
        keypath: ["key2"],
        value1: [200],
        value2: []
      }
    ];

    cri.and("key2").le.value(200)
       .and("key1").ge.value(100);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("203.1 - criteria2IDBQuery - 3.1", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["bound", false, false],
        keypath: ["key1"],
        value1: [100],
        value2: [200]
      }
    ];

    cri.and("key1").ge.value(100)
       .and("key1").le.value(200);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("203.2 - criteria2IDBQuery - 3.2", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["bound", false, false],
        keypath: ["key1"],
        value1: [100],
        value2: [200]
      }
    ];

    cri.and("key1").le.value(200)
       .and("key1").ge.value(100);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("204.1 - criteria2IDBQuery - 4.1", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["lowerBound", true],
        keypath: ["key1"],
        value1: [],
        value2: [200]
      }
    ];

    cri.and("key1").gt.value(100)
       .and("key1").gt.value(200);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("204.2 - criteria2IDBQuery - 4.2", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["lowerBound", true],
        keypath: ["key1"],
        value1: [],
        value2: [200]
      }
    ];

    cri.and("key1").gt.value(200)
       .and("key1").gt.value(100);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("205.1 - criteria2IDBQuery - 5.1", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["upperBound", true],
        keypath: ["key1"],
        value1: [100],
        value2: []
      }
    ];

    cri.and("key1").lt.value(100)
       .and("key1").lt.value(200);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("205.2 - criteria2IDBQuery - 5.2", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["upperBound", true],
        keypath: ["key1"],
        value1: [100],
        value2: []
      }
    ];

    cri.and("key1").lt.value(200)
       .and("key1").lt.value(100);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
    }

    done();
  });

  it("206 - criteria2IDBQuery - 6", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["upperBound", true],
        keypath: ["key1"],
        value1: [100],
        value2: [],
        filter: new Kriteria().and("key1").ne.value(100).and("key1").lt.value(100).matcher() + ''
      },
      { method: ["lowerBound", true],
        keypath: ["key1"],
        value1: [],
        value2: [200],
        filter: new Kriteria().and("key1").ne.value(100).and("key1").gt.value(200).matcher() + ''
      }
    ];

    cri.and("key1").ne.value(100)
       .and("key1").not_between(100, 200);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("207 - criteria2IDBQuery - 7", function(done) {
    var cri = new Kriteria(),
        cri2 = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1", "key2"],
        value1: [100, 200],
        value2: [100, 200],
        filter: new Kriteria().and("key1").eq.value(100).and("key2").eq.value(200).matcher() + ''
      },
      { method: ["only"],
        keypath: ["key1", "key2"],
        value1: [100, 300],
        value2: [100, 300],
        filter: new Kriteria().and("key1").eq.value(100).and("key2").eq.value(300).matcher() + ''
      }
    ];

    cri.and("key1").eq.value(100)
       .and(function($) {
         $.or("key2").eq.value(200)
          .or("key2").eq.value(300);
       });

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("208 - criteria2IDBQuery - 8", function(done) {
    var cri = new Kriteria(),
        cri2 = new Kriteria(),
        cri3 = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1", "key2"],
        value1: [100, 300],
        value2: [100, 300],
        filter: new Kriteria().and("key1").eq.value(100).and("key2").eq.value(300).matcher() + ''
      },
      { method: ["only"],
        keypath: ["key1", "key2"],
        value1: [100, 400],
        value2: [100, 400],
        filter: new Kriteria().and("key1").eq.value(100).and("key2").eq.value(400).matcher() + ''
      },
      { method: ["only"],
        keypath: ["key1", "key2"],
        value1: [200, 300],
        value2: [200, 300],
        filter: new Kriteria().and("key1").eq.value(200).and("key2").eq.value(300).matcher() + ''
      },
      { method: ["only"],
        keypath: ["key1", "key2"],
        value1: [200, 400],
        value2: [200, 400],
        filter: new Kriteria().and("key1").eq.value(200).and("key2").eq.value(400).matcher() + ''
      }
    ];

    cri.and(function($) {
      $.or("key1").eq.value(100)
       .or("key1").eq.value(200)
    })
    .and(function($) {
      $.or("key2").eq.value(300)
       .or("key2").eq.value(400)
    });

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("209 - criteria2IDBQuery - 9", function(done) {
    var cri = new Kriteria(),
        cri2 = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["bound", false, false],
        keypath: ["key1", "key2"],
        value1: [100, 100],
        value2: [200, 100],
        filter: new Kriteria().and("key1").ge.value(100)
                              .and("key1").le.value(200)
                              .and("key2").eq.value(100).matcher() + ''
      },
      { method: ["bound", false, false],
        keypath: ["key1", "key2"],
        value1: [100, 200],
        value2: [200, 200],
        filter: new Kriteria().and("key1").ge.value(100)
                              .and("key1").le.value(200)
                              .and("key2").eq.value(200).matcher() + ''
      }
    ];

    cri.and("key1").between(100, 200)
       .and(function($) {
          $.or("key2").eq.value(100)
           .or("key2").eq.value(200);
       });

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("210 - criteria2IDBQuery - 10", function(done) {
    var cri = new Kriteria(),
        cri2 = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["bound", false, false],
        keypath: ["key1", "key2"],
        value1: [100, 100],
        value2: [200, 100],
        filter: new Kriteria().and("key1").ge.value(100)
                              .and("key1").le.value(200)
                              .and("key2").eq.value(100).matcher() + ''
      },
      { method: ["bound", false, false],
        keypath: ["key1"],
        value1: [100],
        value2: [200],
        filter: new Kriteria().and("key1").ge.value(100)
                              .and("key1").le.value(200)
                              .and("key2").ne.value(200).matcher() + ''
      }
    ];

    cri.and("key1").between(100, 200)
       .and(function($) {
         $.or("key2").eq.value(100)
          .or("key2").ne.value(200);
       });

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("211.1 - criteria2IDBQuery - 11.1", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key1").eq.value(100)
                              .and("key2").ne.value(200).matcher() + ''
      }
    ];

    cri.and("key1").eq.value(100)
       .and("key2").ne.value(200);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("211.2 - criteria2IDBQuery - 11.2", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key2").ne.value(200)
                              .and("key1").eq.value(100)
                              .matcher() + ''
      }
    ];

    cri.and("key2").ne.value(200)
       .and("key1").eq.value(100);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("212.1 - criteria2IDBQuery - 12.1", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key1").eq.value(100)
                              .and("key2").match(/aaa$/).matcher() + ''
      }
    ];

    cri.and("key1").eq.value(100)
       .and("key2").match(/aaa$/);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("212.2 - criteria2IDBQuery - 12.2", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key2").match(/aaa$/)
                              .and("key1").eq.value(100)
                              .matcher() + ''
      }
    ];

    cri.and("key2").match(/aaa$/)
       .and("key1").eq.value(100);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("213.1 - criteria2IDBQuery - 13.1", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key1").eq.value(100)
                              .and("key2").not_match(/aaa$/).matcher() + ''
      }
    ];

    cri.and("key1").eq.value(100)
       .and("key2").not_match(/aaa$/);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

  it("213.2 - criteria2IDBQuery - 13.2", function(done) {
    var cri = new Kriteria(),
        ret = null,
        i = 0, l = 0,
        j = 0, ll = 0;
    var check = ["method", "keypath", "value1", "value2"];
    var test = [
      { method: ["only"],
        keypath: ["key1"],
        value1: [100],
        value2: [100],
        filter: new Kriteria().and("key2").not_match(/aaa$/)
                              .and("key1").eq.value(100)
                              .matcher() + ''
      }
    ];

    cri.and("key2").not_match(/aaa$/)
       .and("key1").eq.value(100);

    ret = criteria2IDBQuery.createQueryParameter(cri, store_stub);
    for(i = 0, l = test.length; i < l; i = i + 1) {
      for(j = 0, ll = check.length; j < ll; j = j + 1) {
        expect(test[i][check[j]]).toEqual(ret[i][check[j]]);
      }
      expect(test[i].filter).toEqual(ret[i].filter + '');
    }

    done();
  });

});

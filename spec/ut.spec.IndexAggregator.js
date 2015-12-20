var IndexAggregator = require("../dist/js/node/lib/IndexAggregator.js").IndexAggregator;

describe("test1 - IndexAggregator.js", function() {
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
      //{ id: 3, keyPath: ["key1", "key2"] },
      { id: 4, keyPath: ["key1", "key2", "key3"] },
      { id: 5, keyPath: ["keyX", "keyY"] },
      { id: 6, keyPath: ["keyX"] },
      { id: 7, keyPath: ["keyZ"] }
    ]
  };

  it("001 - IndexAggregator - 1", function(done) {
    var aggregator = new IndexAggregator(),
        agg = null;

    aggregator.init(store_stub.indexNames);
    agg = aggregator.clone();

    agg.calc("key1");
    agg.calc("key2");

    var result = agg.getResult();

    expect(result[0].index).toEqual(0);
    expect(result[1].index).toEqual(1);

    done();
  });

  it("002 - IndexAggregator - 2", function(done) {
    var aggregator = new IndexAggregator(),
        agg = null;

    aggregator.init(store_stub.indexNames, ["key1"]);
    agg = aggregator.clone();

    agg.calc("key1");
    agg.calc("key2");

    var result = agg.getResult();

    expect(result[0].index).toEqual(1);
    expect(result[1].index).toEqual(0);

    done();
  });

  it("003 - IndexAggregator - 3", function(done) {
    var aggregator = new IndexAggregator(),
        agg = null;

    aggregator.init(store_stub.indexNames, ["key2"]);
    agg = aggregator.clone();

    agg.calc("key1");
    agg.calc("key2");

    var result = agg.getResult();

    expect(result[0].index).toEqual(0);
    expect(result[1].index).toEqual(1);

    done();
  });

  it("004 - IndexAggregator - 4", function(done) {
    var aggregator = new IndexAggregator(),
        agg = null;

    aggregator.init(store_stub.indexNames, ["key3"]);
    agg = aggregator.clone();

    agg.calc("key1");
    agg.calc("key2");

    var result = agg.getResult();

    expect(result[0].index).toEqual(0);
    expect(result[1].index).toEqual(1);

    done();
  });

});

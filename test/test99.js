var test99 = [
  function test99_01(callback) {
    var test_name = "test99_01";

    console.log("# " + test_name + " start #");

    var kri = new Kriteria(),
        checker = function(d) {
          return (
            d.key1 === 100 && d.key2 > 110
          )
          || (
            d.key1 < 300 || d.key2 > 110
          )
          || (
            d.key1 >= 200 && (
              d.key3 <= 400 || d.key3 >= 200
            )
          )
          ;
        };

    kri
    .or(function($) {
      $.and("key1").eq.value(100);
      $.and("key2").gt.value(110);
    })
    .or(function($) {
      $.or("key1").lt.value(300);
      $.or("key2").gt.value(110);
    })
    .or(function($) {
      $.and("key1").ge.value(200);
      $.or("key3").le.value(400);
      $.or("key3").ge.value(200);
    })
    ;

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

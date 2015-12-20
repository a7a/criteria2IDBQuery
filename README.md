# criteria2IDBQuery

## Install

npm install criteria2IDBQuery


## Methods

### criteria2IDBQuery.createQueryParam

- argument[0] {Kriteria} kriteria - 条件
- argument[1] {IDBObjectStore} store - 検索対象にするオブジェクトストア
- argument[2] {Object} hint - ヒント条件

Kriteria クラスで条件を指定し、その指定した条件から適切と考えられるクエリパラメータを解析、作成する。

createQueryParam は Object の配列を返す。
各Objectは以下の要素を持つ。

- {Mixed(IDBObjectStore|IDBIndex)} store : index が使用できる場合 IDBIndex、そうでない場合は引数で指定した IDBObjectStore が入る。
- {Array} method : IDBKeyRange に指定するパラメータ。IDBKeyRange が使用できない場合は null が入る。
- - {String} method[0] : メソッド名 "only", "upperBound", "lowerBound", "bound"
- - {Boolean} method[1] : range に値を含めないかどうか。criteria で lt,gt を指定した場合 true。le,ge,between の場合 false。それ以外の場合は undefined。
- - {Boolean} method[2] : range に値を含めないかどうか。criteria で between を指定した場合 true。それ以外の場合は undefined。
- {String[]} keypath : criteria から対象になった keyPath、および下記 value1, value2 の対象となる key の情報。index が使用できる場合に値が入り、index が使用できない場合は null が入る。処理には使用しない。
- {Array} value1 : IDBKeyRange に指定する上限値。criteria で eq, lt, le, in, not_in, between, not_between を指定した場合に値が入る。index が使用できる場合に値が入り、index が使用できない場合は null が入る。
- {Array} value2 : IDBKeyRange に指定する下限値。criteria で eq, gt, ge, in, not_in, between, not_between を指定した場合に値が入る。index が使用できる場合に値が入り、index が使用できない場合は null が入る。
- {Function} filter : criteria で 指定した全ての抽出条件を記述した関数。ne, match, not_match 等を指定した場合は indexedDB の機能では抽出できないため、この関数を通して条件を確定させる。

一度に抽出できない条件（or や not_between を指定した場合）に、複数のObjectが返ってくる。
各 Object に対し request を生成することでデータを抽出する。

#### ヒント条件

- {String[]} priority : 優先したい key を指定する。指定した key の出現数が最も多い index を対象とする。

```javascript
store.createIndex("idx1", ["key1"]);
store.createIndex("idx2", ["key2"]);

var kri = new Kriteria();
kri.and("key1").eq.value(100)
   .and("key2").eq.value(200);

var params = null;

params = criteria2IDBQuery.createQueryParameter(kriteria, store);
// params[0].store is random selected from idx1 or idx2

params = criteria2IDBQuery.createQueryParameter(kriteria, store, { priority: ["key1"] });
// params[0].store is idx1

params = criteria2IDBQuery.createQueryParameter(kriteria, store, { priority: ["key2"] });
// params[0].store is idx2
```

### criteria2IDBQuery.createIDBKeyRange

- arguments[0] param - createQueryParameter で作成した配列パラメータの各要素
- arguments[1] keyrange - IDBKeyRange クラスのオブジェクト。vender prefix を考慮したもの。省略した場合はグローバルスコープから IDBKeyRange を取得し使用する

criteria2IDBQuery.createQueryParam から作成した各パラメータから IDBKeyRange を作成する。

## Sample

```javascript
var ret = [];

// db is IDBDatabase instance
var store = db.transaction("store_name", "readwrite").objectStore("store_name");
var kriteria = new Kriteria();
// set something condition : kriteria.eq.value(100) etc...

var params = criteria2IDBQuery.createQueryParameter(kriteria, store);

var loop  = function() {
  if(params.length > 0) {
    var param = params.shift();
    var range = criteria2IDBQuery.createIDBKeyRange(param);

    var req = param.store.openCursor(range).onsuccess = function(e) {
      var cursor = e.target.result;

      if(cursor) {
        if(param.filter(cursor.value)) {
          ret[ret.length] = cursor.value;
        }
        cursor.continue();

      } else {
        loop();
      }
    };

  } else {
    // complete!
    console.log(ret);
  }
};
loop();
 ```

## Licence

MIT

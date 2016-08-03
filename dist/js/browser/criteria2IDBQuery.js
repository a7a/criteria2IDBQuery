(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* criteria2IDBQuery.js */

(function (cxt) {
  "use strict";

  var createQueryParameterFromConditionsAndIndices =
      require("./lib/createQueryParameterFromConditionsAndIndices.js")
        .createQueryParameterFromConditionsAndIndices,
      analyzeConditionsFromCriteria =
      require("./lib/analyzeConditionsFromCriteria.js").analyzeConditionsFromCriteria,
      createIndicesFromObjectStore =
      require("./lib/createIndicesFromObjectStore.js").createIndicesFromObjectStore;

  /**
  * @public
  * @function
  * @param {Kriteria} criteria -
  * @param {IDBObjectStore} store -
  * @param {Object} hint -
  * @returns {Array<Object<IDBObjectStore|Index store, Array method, Array keypath,
  *           Array value1, Array value2, Function filter>>}
  */
  var createQueryParameter = function createQueryParameter(criteria, store, hint) {
    return createQueryParameterFromConditionsAndIndices(
      analyzeConditionsFromCriteria(criteria, false),
      createIndicesFromObjectStore(store),
      hint && hint.priority ? hint.priority : []
    );
  };


  /**
  * @public
  * @function
  * @param {Object} param - query parameter
  * @param {IDBKeyRange} keyrange - IDBKeyRange
  * @returns {IDBKeyRange}
  */
  var createIDBKeyRange = function createIDBKeyRange(param, keyrange) {
    var idb_keyrange = keyrange || (0, eval)("this").IDBKeyRange,
        range = null;

    if(!idb_keyrange) {
      throw new Error("IDBKeyRange is not available.");
    }

    if(!param.method) {
      return null;
    }

    switch(param.method[0]) {
      case "only":
        if(param.value1.length === 1) {
          range = idb_keyrange[param.method[0]](param.value1[0]);

        } else {
          range = idb_keyrange[param.method[0]](param.value1);
        }
        break;

      case "upperBound":
        if(param.value1.length === 1) {
          range = idb_keyrange[param.method[0]](param.value1[0], param.method[1]);

        } else {
          range = idb_keyrange[param.method[0]](param.value1, param.method[1]);
        }
        break;

      case "lowerBound":
        if(param.value2.length === 1) {
          range = idb_keyrange[param.method[0]](param.value2[0], param.method[1]);

        } else {
          range = idb_keyrange[param.method[0]](param.value2, param.method[1]);
        }
        break;

      case "bound":
        if(param.value1.length === 1) {
          range = idb_keyrange[param.method[0]](
            param.value1[0],
            param.value2[0],
            param.method[1],
            param.method[2]
          );

        } else {
          range = idb_keyrange[param.method[0]](
            param.value1,
            param.value2,
            param.method[1],
            param.method[2]
          );
        }
        break;

      default:
        break;
    }

    return range;
  };


  cxt.criteria2IDBQuery = {
    createQueryParameter: createQueryParameter,
    createIDBKeyRange: createIDBKeyRange
  };

})((0, eval)("this").window || this);

},{"./lib/analyzeConditionsFromCriteria.js":4,"./lib/createIndicesFromObjectStore.js":5,"./lib/createQueryParameterFromConditionsAndIndices.js":6}],2:[function(require,module,exports){
/* IndexAggregator.js */

(function(cxt) {
  "use strict";

  /**
   * @public
   * @class
   */
  var IndexAggregator = function IndexAggregator() {
    this._keys = [];
    this._priority_keys = [];
  };

  /**
  * @public
  * @function
  * @param {Index[]} indices -
  * @returns {void}
  */
  IndexAggregator.prototype.init = function(indices, priority_keys) {
    for(var i = 0, l = indices.length; i < l; i = i + 1) {
      this.set(indices[i]);
    }

    if(Array.isArray(priority_keys)) {
      this._priority_keys = priority_keys;
    } else if(priority_keys !== "" && priority_keys !== null && priority_keys !== void 0) {
      this._priority_keys = [priority_keys];
    }
  };

  /**
   * @public
   * @function
   * @param {Index} index -
   * @returns {void}
   */
  IndexAggregator.prototype.set = function(index) {
    this._keys[this._keys.length] = {};
    var p = this._keys.length - 1;

    if(index.keyPath === null) {
      this._keys[p] = [];

    } else if(Array.isArray(index.keyPath)) {
      for(var i = 0, l = index.keyPath.length; i < l; i = i + 1) {
        this._keys[p][index.keyPath[i]] = 0;
      }

    } else {
      this._keys[p][index.keyPath] = 0;
    }
  };

  /**
   * @publuc
   * @function
   * @key {String} key -
   * @returns {void}
   */
  IndexAggregator.prototype.calc = function(key) {
    for(var i = 0, l = this._keys.length; i < l; i = i + 1) {
      if(this._keys[i][key] !== void 0) {
        this._keys[i][key] = 1;
      }
    }
  };

  /**
   * @public
   * @function
   * @returns {IndexAggregator}
   */
  IndexAggregator.prototype.clone = function clone() {
    var ret = new IndexAggregator();
    ret._keys = [];
    ret._priority_keys = [];

    for(var i = 0, l = this._keys.length; i < l; i = i + 1) {
      if(!ret._keys[i]) {
        ret._keys[i] = {};
      }

      for(var j in this._keys[i]) {
        ret._keys[i][j] = 0;
      }
    }

    for(i = 0, l = this._priority_keys.length; i < l; i = i + 1) {
      ret._priority_keys[i] = this._priority_keys[i];
    }

    return ret;
  };

  /**
   * @public
   * @function
   * @returns {Integer}
   */
  IndexAggregator.prototype.getResult = function getResult() {
    var target_nums = [];

    for(var i = 0, l = this._keys.length; i < l; i = i + 1) {
      var count = 0,
          sum = 0,
          priority_num = 0;

      for(var j in this._keys[i]) {
        count = count + 1;
        sum = sum + this._keys[i][j];
        if(~this._priority_keys.indexOf(j)) {
          priority_num = priority_num + 1;
        }
      }

      if(count !== 0 && count === sum) {
        target_nums[target_nums.length] = {
          index: i,
          match_num: sum,
          priority_num: priority_num
        };
      }
    }

    target_nums.sort(function(a, b) {
      if(a.priority_num < b.priority_num) {
        return 1;
      } else if(a.priority_num > b.priority_num) {
        return -1;
      } else if(a.match_num < b.match_num) {
        return 1;
      } else if(a.match_num > b.match_num) {
        return -1;
      } else {
        return 0;
      }
    });

    return target_nums;
  };


  cxt.IndexAggregator = IndexAggregator;

})(this);

},{}],3:[function(require,module,exports){
/* Query.js */

(function(cxt) {
  "use strict";

  /**
   * @public
   * @class
   */
  var Query = function Query() {
    this.keys = [];
    this.conditions = [];
  };

  /**
  * @public
  * @function
  * @param {Condition} condition -
  * @returns {void}
  */
  Query.prototype.addKeysFromCondition = function addKeysFromCondition(condition) {
    if(condition.key_type === "value" &&
       !~this.keys.indexOf(condition.left_key)) {
      this.keys[this.keys.length] = condition.left_key;
    }
  };

  /**
  * @public
  * @function
  * @param {Condition} condition -
  * @param {Boolean} not_flg
  * @returns {void}
  */
  Query.prototype.addCondition = function addCondition(condition, not_flg) {
    this.addKeysFromCondition(condition);

    if(not_flg) {
      this.conditions = this.conditions.concat(condition.clone().not().normalize());
    } else {
      this.conditions = this.conditions.concat(condition.clone().normalize());
    }
  };

  /**
  * @public
  * @function
  * @param {Query} query -
  * @returns {Query}
  */
  Query.prototype.merge = function merge(query) {
    var i = 0, l = 0;

    for(i = 0, l = query.keys.length; i < l; i = i + 1) {
      if(!~this.keys.indexOf(query.keys[i])) {
        this.keys[this.keys.length] = query.keys[i];
      }
    }

    for(i = 0, l = query.conditions.length; i < l; i = i + 1) {
      this.conditions[this.conditions.length] = query.conditions[i].clone();
    }

    return this;
  };

  /**
  * @public
  * @function
  * @returns {Query}
  */
  Query.prototype.clone = function clone() {
    var ret = new Query();

    ret.keys = this.keys.concat();

    for(var i = 0, l = this.conditions.length; i < l; i = i + 1) {
      ret.conditions[i] = this.conditions[i].clone();
    }

    return ret;
  };

  /**
  * @public
  * @function
  * @returns {Array<Query>}
  */
  Query.prototype.not = function not() {
    var ret = [];

    for(var i = 0, l = this.conditions.length; i < l; i = i + 1) {
      var new_query = new Query();
      new_query.addCondition(this.conditions[i], true);
      ret[ret.length] = new_query;
    }

    return ret;
  };


  cxt.Query = Query;

})(this);

},{}],4:[function(require,module,exports){
/* analyzeConditionsFromCriteria.js */

(function (cxt) {
  "use strict";

  var Kriteria = require("kriteria").Kriteria || (0, eval)("this").Kriteria,
      Query = require("./Query.js").Query;

  /**
  * @public
  * @function
  * @param {Kriteria} criteria -
  * @param {Kriteria} parent_not_flg -
  * @returns {Array}
  */
  var analyzeConditionsFromCriteria = function analyzeConditionsFromCriteria(criteria, parent_not_flg) {
    var conditionAnd = [],
        conditionOr = [],
        current_not_flg = !!(criteria._not_flg ^ parent_not_flg),
        condition = null,
        queries = [],
        subqueries = [],
        query = null,
        i = 0, l = 0;

    // when doesn't have not flag, and-condition process to and-conditon,
    // and or-conditon process to or-condition.
    // when has not_flg, and-condition process to or-condition,
    // and or-condition process to and-condition.
    //   !(A and B) is (!A or !B)
    //   !(A or B) is (!A and !B)
    if(!current_not_flg) {
      conditionAnd = criteria.getConditionAnd();
      conditionOr = criteria.getConditionOr();
    } else {
      conditionAnd = criteria.getConditionOr();
      conditionOr = criteria.getConditionAnd();
    }

    if(conditionAnd.length > 0) {
      query = new Query();

      for(i = 0, l = conditionAnd.length; i < l; i = i + 1) {

        condition = conditionAnd[i];

        if(condition.criteria instanceof Kriteria) {
          subqueries = combination(
            subqueries,
            analyzeConditionsFromCriteria(condition.criteria, current_not_flg)
          );

        } else if(
          !current_not_flg && (condition.operator === "in" || condition.operator === "not_between") ||
          current_not_flg && (condition.operator === "not_in" || condition.operator === "between")
        ) {

          // each condition register to each query

          // operator 'in' or !'not_in' or 'between' or !'not_between' change to
          // 'eq', 'ne', 'gt', 'ge', 'lt', 'le'

          subqueries = combination(subqueries, createNomalizedCondition(condition, current_not_flg));

        } else {
          // condition register a query as one condition
          query.addCondition(condition, current_not_flg);
        }

      }

      queries = queries.concat(combination([query], subqueries));
    }

    if(conditionOr.length > 0) {
      for(i = 0, l = conditionOr.length; i < l; i = i + 1) {
        condition = conditionOr[i];

        if (condition.criteria instanceof Kriteria) {
          queries = queries.concat(analyzeConditionsFromCriteria(condition.criteria, current_not_flg));

        } else if(
          !current_not_flg && (condition.operator === "in" || condition.operator === "not_between") ||
          current_not_flg && (condition.operator === "not_in" || condition.operator === "between")
        ) {

          // each condition register to each query

          // operator 'in' or !'not_in' or 'between' or !'not_between' change to
          // 'eq', 'ne', 'gt', 'ge', 'lt', 'le'

          queries = queries.concat(createNomalizedCondition(condition, current_not_flg));

        } else {
          // condition register a query as one condition
          query = new Query();
          query.addCondition(condition, current_not_flg);
          queries = queries.concat([query]);
        }
      }
    }

    return queries;
  };

  /**
  * @private
  * @function
  * @param {Array<Condition>} arr1 -
  * @param {Array<Condition>} arr2 -
  * @returns {Array<Condition>}
  */
  var combination = function combination(arr1, arr2) {
    var ret = [];

    if(arr1.length > 0 && arr2.length) {
      for(var i = 0, l = arr1.length; i < l; i = i + 1) {
        for(var j = 0, ll = arr2.length; j < ll; j = j + 1) {
          ret[ret.length] = arr1[i].clone().merge(arr2[j]);
        }
      }
    } else if(arr1.length === 0) {
      ret = arr2.concat();
    } else { // arr2.length === 0
      ret = arr1.concat();
    }

    return ret;
  };

  /**
  * @private
  * @function
  * @param {Condition} condition -
  * @param {Boolean} flg_not -
  * @retuns {Query[]}
  */
  var createNomalizedCondition = function createNomalizedCondition(condition, flg_not) {
    var normalized = condition.normalize(),
        subqueries = [];

    for(var i = 0, l = normalized.length; i < l; i = i + 1) {
      var subquery = new Query();

      if(flg_not) {
        subquery.addCondition(normalized[i].not());
      } else {
        subquery.addCondition(normalized[i]);
      }

      subqueries[subqueries.length] = subquery;
    }

    return subqueries;
  };


  cxt.analyzeConditionsFromCriteria = analyzeConditionsFromCriteria;

}(this));

},{"./Query.js":3,"kriteria":7}],5:[function(require,module,exports){
/* createIndicesFromObjectStore.js */

(function (cxt) {
  "use strict";

  /**
  * @public
  * @function
  * @param {IDBObjectStore} store -
  * @returns Array<IDBObjectStore|Index>
  */
  var createIndicesFromObjectStore = function createIndicesFromObjectStore(store) {
    var indices = [store];

    for(var i = 0, l = store.indexNames.length; i < l; i = (i + 1)|0) {
      indices[indices.length] = store.index(store.indexNames[i]);
    }

    return indices;
  };


  cxt.createIndicesFromObjectStore = createIndicesFromObjectStore;

}(this));

},{}],6:[function(require,module,exports){
/* createQueryParameterFromConditionsAndIndices.js */

(function (cxt) {
  "use strict";

  var Kriteria = require("kriteria").Kriteria || (0, eval)("this").Kriteria,
      IndexAggregator = require("./IndexAggregator.js").IndexAggregator;

  /**
  * @public
  * @function
  * @param {Array} conditions -
  * @param {Array<Index>} indices -
  * @returns {Object[]}
  *   {Mixed(IDBObjectStore|IDBIndex)} store
  *   {Array<String|Boolean>} method
  *   {String[]} keypath
  *   {*[]} value1
  *   {*[]} value2
  *   {Function} filter
  */
  var createQueryParameterFromConditionsAndIndices =
      function createQueryParameterFromConditionsAndIndices(
        conditions,
        indices,
        priority_keys)
  {

    var aggregator = new IndexAggregator(),
        i = 0, l = 0,
        j = 0, l2 = 0,
        k = 0, l3 = 0,
        key = "",
        ret = [];

    aggregator.init(indices, priority_keys);

    for(i = 0, l = conditions.length; i < l; i = i + 1) {
      var condition = conditions[i],
          agg = aggregator.clone();

      var no_index_result = {
        store: indices[0],
        method: null,
        keypath: null,
        value1: null,
        value2: null,
        filter: Kriteria.parse({ and: condition.conditions }).matcher()
      };

      // condition から、keyPath の使用数が多い index を計算する
      var targetIndicesNums = calculateIndex(agg, condition);

      if(targetIndicesNums.length === 0) {
        ret[ret.length] = no_index_result;

      } else {
        var target_keypath = [],
            value = [[], []],
            method = [],
            method_level = [],
            index = 0;

        for(j = 0, l2 = targetIndicesNums.length; j < l2; j = j + 1) {
          var targetIndicesNum = targetIndicesNums[j].index,
              data = [];

          index = indices[targetIndicesNum];
          target_keypath = [];
          value = [[], []];
          method_level = [];
          method = [];

          for(k = 0, l3 = condition.conditions.length; k < l3; k = k + 1) {
            var cond = condition.conditions[k],
                idx = index.keyPath.indexOf(cond.left_key);

            if(~idx) {
              // condition から各keyに対してフラグを設定する
              analyzeConditionAndSetData(cond, idx, data);
            }
          }

          for(key in data) {
            // 上記で設定したフラグからメソッドを決定する
            analizeDataAndSetMethod(
              data[key], key, {
                method: method,
                value: value,
                method_level: method_level,
                target_keypath: target_keypath
              }
            );
          }

          // only は bound で表現可能（過分は出るが不足はなし）。
          // bound は lowerbound または upperBound で表現可能（同上）。
          // lowerBound および upperBound は互いに表現不可能のため、両方が存在する場合は対象のインデックスは
          // 条件に対し使用不可であるとし、別のインデックスを対象とする
          if(isMethodCollision(method)) {
            continue;
          } else {
            break;
          }
        }

        if(j === targetIndicesNums.length) {
          target_keypath = [];
          value = [[], []];
          method_level = [];
          method = [];
        }

        if(method.length > 0) {
          var target_method = [],
              max_method_level = 0;

          // 使用するメソッドを検索
          //   lowerBound, upperBound -> level 3
          //   bound -> level 2
          //   only -> level 1
          // 最大のレベルのものを選択する
          for(k = 0, l3 = method.length; k < l3; k = k + 1) {
            if(method[k] !== void 0 && method_level[k] > max_method_level) {
              target_method = method[k].concat();
              max_method_level = method_level[k];
            }
          }

          ret[ret.length] = {
            store: index,
            method: target_method,
            keypath: target_keypath,
            value1: value[0],
            value2: value[1],
            filter: Kriteria.parse({ and: condition.conditions }).matcher()
          };

        } else {
          ret[ret.length] = no_index_result;
        }
      }
    }

    return ret;
  };

  /**
  * @private
  * @function
  * @params {IndexAggregator} agg -
  * @params {Object} condition -
  * @returns {Number[]}
  */
  var calculateIndex = function calculateIndex(agg, condition) {
    for(var j = 0, l2 = condition.keys.length; j < l2; j = j + 1) {
      for(var k = 0, l3 = condition.conditions.length; k < l3; k = k + 1) {
        var ope = condition.conditions[k].operator;

        // key_type が 'value' のものが対象（'key' のものは対象外）
        // operator が 'ne', 'match', 'not_match' の場合は対象外
        if(condition.conditions[k].left_key === condition.keys[j] &&
           condition.conditions[k].key_type === "value" &&
           ope !== "ne" && ope !== "match" && ope !== "not_match") {
          // key の使用数を計算
          agg.calc(condition.keys[j]);
        }
      }
    }

    return agg.getResult();
  };

  /**
  * @private
  * @function
  * @params {Object} condition -
  * @params {Number} idx -
  * @params {Object} data - output
  * @returns {void}
  */
  var analyzeConditionAndSetData = function analyzeConditionAndSetData(condition, idx, data) {
    var key = condition.left_key;

    if(!data[key]) {
      data[key] = {
        keypath_index: idx,
        val1: null,
        val2: null,
        flg_eq: false,
        flg_lt: false,
        flg_le: false,
        flg_gt: false,
        flg_ge: false
      };
    }

    switch(condition.operator) {
      case "eq":
        data[key].flg_eq = true;
        data[key].flg_lt = false;
        data[key].flg_le = false;
        data[key].flg_gt = false;
        data[key].flg_ge = false;
        data[key].val1 = condition.right_key[0];
        data[key].val2 = condition.right_key[0];
        break;

      case "ne":
        break;

      case "lt":
        if(!data[key].flg_eq) {
          data[key].flg_lt = true;
          if(data[key].val2 === null || data[key].val2 > condition.right_key[0]) {
            data[key].val2 = condition.right_key[0];
          }
        }
        break;

      case "le":
        if(!data[key].flg_eq) {
          data[key].flg_le = true;
          data[key].flg_lt = false;
          if(data[key].val2 === null || data[key].val2 > condition.right_key[0]) {
            data[key].val2 = condition.right_key[0];
          }
        }
        break;

      case "gt":
        if(!data[key].flg_eq) {
          data[key].flg_gt = true;
          if(data[key].val1 === null || data[key].val1 < condition.right_key[0]) {
            data[key].val1 = condition.right_key[0];
          }
        }
        break;

      case "ge":
        if(!data[key].flg_eq) {
          data[key].flg_ge = true;
          data[key].flg_gt = false;
          if(data[key].val1 === null || data[key].val1 < condition.right_key[0]) {
            data[key].val1 = condition.right_key[0];
          }
        }
        break;

      case "match":
      case "not_match":
        break;
    }
  };

  /**
  * @private
  * @function
  * @params {Object} data -
  * @params {String} key -
  * @params {Object} out - output
  * @returns {void}
  */
  var analizeDataAndSetMethod = function analizeDataAndSetMethod(data, key, out) {
    var method = out.method,
        value = out.value,
        method_level = out.method_level,
        target_keypath = out.target_keypath;

    if(data.keypath_index >= 0) {
      if(method_level[data.keypath_index] === void 0) {
        method_level[data.keypath_index] = 0;
      }

      if(data.flg_ge) {
        if(data.flg_le) {
          method[data.keypath_index] = ["bound", false, false];
          value[0][data.keypath_index] = data.val1;
          value[1][data.keypath_index] = data.val2;
          method_level[data.keypath_index] = 2;

        } else if(data.flg_lt) {
          method[data.keypath_index] = ["bound", true, false];
          value[0][data.keypath_index] = data.val1;
          value[1][data.keypath_index] = data.val2;
          method_level[data.keypath_index] = 2;

        } else if(method_level[data.keypath_index] <= 1) {
          method[data.keypath_index] = ["lowerBound", false];
          value[1][data.keypath_index] = data.val1;
          method_level[data.keypath_index] = 3;
        }

      } else if(data.flg_gt) {
        if(data.flg_le) {
          method[data.keypath_index] = ["bound", false, true];
          value[0][data.keypath_index] = data.val1;
          value[1][data.keypath_index] = data.val2;
          method_level[data.keypath_index] = 2;

        } else if(data.flg_lt) {
          method[data.keypath_index] = ["bound", true, true];
          value[0][data.keypath_index] = data.val1;
          value[1][data.keypath_index] = data.val2;
          method_level[data.keypath_index] = 2;

        } else if(method_level[data.keypath_index] <= 1) {
          method[data.keypath_index] = ["lowerBound", true];
          value[1][data.keypath_index] = data.val1;
          method_level[data.keypath_index] = 3;
        }

      } else if(data.flg_le) {
        method[data.keypath_index] = ["upperBound", false];
        value[0][data.keypath_index] = data.val2;
        method_level[data.keypath_index] = 3;

      } else if(data.flg_lt) {
        method[data.keypath_index] = ["upperBound", true];
        value[0][data.keypath_index] = data.val2;
        method_level[data.keypath_index] = 3;

      } else if(data.flg_eq) {
        method[data.keypath_index] = ["only"];
        value[0][data.keypath_index] = data.val1;
        value[1][data.keypath_index] = data.val2;
        method_level[data.keypath_index] = 1;
      }

      target_keypath[data.keypath_index] = key;
    }

  };

  /**
  * @private
  * @function
  * @params {Object[]} method -
  * @returns {Boolean}
  */
  var isMethodCollision = function isMethodCollision(method) {
    var has_lowerbound = false,
        has_upperbound = false;

    for(var i = 0, l = method.length; i < l; i = i + 1) {
      switch(method[i][0]) {
        case "lowerBound":
          has_lowerbound = true;
          break;
        case "upperBound":
          has_upperbound = true;
          break;
      }
    }

    return has_lowerbound && has_upperbound ? true : false;
  };


  cxt.createQueryParameterFromConditionsAndIndices = createQueryParameterFromConditionsAndIndices;

}(this));

},{"./IndexAggregator.js":2,"kriteria":7}],7:[function(require,module,exports){
/* Kriteria.js */

(function(cxt, global) {
  "use strict";

  var getProperty = require("./lib/getProperty.js").getProperty,
      matchPrefix = require("./lib/matchPrefix.js").matchPrefix,
      Condition = require("./lib/Condition.js").Condition,
      evaluation = require("./lib/evaluation.js").evaluation,
      kref = require("./lib/keys_reference.js").keysReference;

  /**
  * @public
  * @class
  */
  var Kriteria = function Kriteria() {
    this._conditionAnd = [];
    this._conditionOr = [];
    this._not_flg = false;
  };
  Kriteria._name_ = "Kriteria";

  /**
  * @public
  * @function
  * @returns {Condition[]}
  */
  Kriteria.prototype.getConditionAnd = function getConditionAnd() {
    return this._conditionAnd;
  };

  /**
  * @public
  * @function
  * @returns {Condition[]}
  */
  Kriteria.prototype.getConditionOr = function getConditionAOr() {
    return this._conditionOr;
  };

  /**
  * @private
  * @property
  * @description
  */
  Kriteria._JS_OPERATOR = {
    eq: "===",
    ne: "!==",
    lt: "<",
    le: "<=",
    gt: ">",
    ge: ">="
  };

  /**
  * @public
  * @function
  * @param {Condition} condition -
  * @returns {void}
  * @description
  */
  Kriteria.prototype.addAnd = function addAnd(condition) {
    this._conditionAnd[this._conditionAnd.length] = condition;
  };

  /**
  * @public
  * @function
  * @param {Condition} condition -
  * @returns {void}
  * @description
  */
  Kriteria.prototype.addOr = function addOr(condition) {
    this._conditionOr[this._conditionOr.length] = condition;
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|Kriteria|Function)} key - key name or Kriteria instance or Kriteria reqired function
  * @returns {Function} evaluation || {Kriteria}
  * @description
  */
  Kriteria.prototype.and = function and(key) {
    var key_type = typeof key,
        cri = null;

    if(
      key_type === "string" ||
      key instanceof String ||
      key_type === "number" ||
      key instanceof Number
    ) {
      return evaluation("and", key, this);

    } else if(key instanceof Kriteria) {
      cri = key;
      this.addAnd(new Condition("", "", [], "", cri));

      return this;

    } else if(typeof key === "function") {
      cri = new Kriteria();
      key(cri);
      this.addAnd(new Condition("", "", [], "", cri));

      return this;

    } else {
      throw new Error("invalid type of argument. (" + key_type + ")");
    }
  };

  /**
  * @public
  * @function
  * @param {Mixed(String|Kriteria|Function)} key - key name or Kriteria instance or Kriteria reqired function
  * @returns {Mixed(Function|Kriteria)}
  * @description
  */
  Kriteria.prototype.or = function or(key) {
    var key_type = typeof key,
        cri = null;

    if(key_type === "string" ||
       key instanceof String ||
       key_type === "number" ||
       key instanceof Number
      ) {
      return evaluation("or", key, this);

    } else if(key instanceof Kriteria) {
      cri = key;
      this.addOr(new Condition("", "", [], "", cri));

      return this;

    } else if(typeof key === "function") {
      cri = new Kriteria();
      key(cri);
      this.addOr(new Condition("", "", [], "", cri));

      return this;

    } else {
      throw new Error("invalid type of argument. (" + key_type + ")");
    }
  };

  /**
  * @public
  * @function
  * @returns {Kriteria}
  * @description
  */
  Kriteria.prototype.not = function not() {
    this._not_flg = !this._not_flg;

    return this;
  };

  /**
  * @public
  * @static
  * @function
  * @param {Object} conditions -
  *   {Condition[]} conditions.and -
  *   {Condition[]} conditions.or -
  * @returns {Kriteria}
  * @description
  */
  Kriteria.parse = function parse(conditions) {
    var ret = new Kriteria(),
        i = "";

    for(i in conditions.and) {
      ret.addAnd(conditions.and[i]);
    }
    for(i in conditions.or) {
      ret.andOr(conditions.or[i]);
    }
    if(conditions.not) {
      ret.not();
    }

    return ret;
  };

  /**
  * @public
  * @function
  * @param {Object} data -
  * @returns {Boolean}
  * @description
  */
  Kriteria.prototype.match = function match(data) {
    var i = 0, l = 0,
        j = 0, l2 = 0,
        left_key = "",
        operator = "",
        right_key = [],
        key_type = "",
        left_value = null,
        right_value = [],
        result = false,
        condition = null,
        tmp_right_value = null;

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      condition = this._conditionAnd[i];

      if(condition.criteria instanceof Kriteria) {
        result = condition.criteria.match(data);

        // and条件は1つでもfalseがあったら、結果はfalse
        if(!result) {
          break;
        }

      } else {
        left_key = condition.left_key;
        operator = condition.operator;
        right_key = condition.right_key;
        key_type = condition.key_type;
        left_value = getProperty(data, left_key);

        if(key_type === "value") {
          right_value = right_key;

        } else if(key_type === "key") {
          tmp_right_value = getProperty(data, right_key[0]);

          if(Array.isArray(tmp_right_value)) {
            if(operator === "match" || operator === "not_match") {
              right_value = [];

              for(j = 0, l2 = tmp_right_value.length; j < l2; j = j + 1) {
                if(tmp_right_value[j] === null
                   || tmp_right_value[j] === void 0
                   || tmp_right_value[j] === "") {
                  right_value[j] = tmp_right_value[j];

                } else {
                  right_value[j] = new RegExp(tmp_right_value[j]);
                }
              }

            } else {
              right_value = tmp_right_value;
            }

          } else {
            if(operator === "match" || operator === "not_match") {
              if(tmp_right_value === null
                 || tmp_right_value === void 0
                 || tmp_right_value === "") {
                right_value = tmp_right_value;

              } else {
                right_value = [new RegExp(tmp_right_value)];
              }

            } else {
              right_value = [tmp_right_value];
            }
          }
        }

        if(
          right_value === void 0
          || !!~right_value.indexOf(void 0)
          || left_value === void 0
        ) {
          // valueがundefinedの場合はfalse
          result = false;

        } else {
          // 上記以外は比較演算
          result = this._compare(left_value, operator, right_value);
        }

        // and条件は1つでもfalseがあったら、結果はfalse
        if(!result) {
          break;
        }
      }
    }

    // and条件ですべて一致した場合
    if(result) {
      return !!(true ^ this._not_flg);
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      condition = this._conditionOr[i];

      if(condition.criteria instanceof Kriteria) {
        result = condition.criteria.match(data);
        if(result) {
          return !!(true ^ this._not_flg);
        }

      } else {
        left_key = condition.left_key;
        operator = condition.operator;
        right_key = condition.right_key;
        key_type = condition.key_type;
        left_value = getProperty(data, left_key);

        if(key_type === "value") {
          right_value = right_key;

        } else if(key_type === "key") {
          tmp_right_value = getProperty(data, right_key[0]);

          if(Array.isArray(tmp_right_value)) {
            if(operator === "match" || operator === "not_match") {
              right_value = [];

              for(j = 0, l2 = tmp_right_value.length; j < l2; j = j + 1) {
                if(tmp_right_value[j] === null
                   || tmp_right_value[j] === void 0
                   || tmp_right_value[j] === "") {
                  right_value[j] = tmp_right_value[j];

                } else {
                  right_value[j] = new RegExp(tmp_right_value[j]);
                }
              }

            } else {
              right_value = tmp_right_value;
            }
          } else {
            if(operator === "match" || operator === "not_match") {
              if(tmp_right_value === null
                 || tmp_right_value === void 0
                 || tmp_right_value !== "") {
                right_value = tmp_right_value;

              } else {
                right_value = [new RegExp(tmp_right_value)];
              }

            } else {
              right_value = [tmp_right_value];
            }
          }
        }

        if(
          right_value === void 0
          || !!~right_value.indexOf(void 0)
          || left_value === void 0
        ) {
          // valueがundefinedの場合はfalse
          result = false;

        } else {
          // 上記以外は比較演算
          result = this._compare(left_value, operator, right_value);
        }

        // or条件は1つでもtrueがあったら、結果はtrue
        if(result) {
          return !!(true ^ this._not_flg);
        }
      }
    }

    // 上記以外はfalse
    return !!(false ^ this._not_flg);
  };

  /**
  * @private
  * @function
  * @param {Mixed(String|Number)} value1 -
  * @param {String} operator -
  * @param {Array} value2 -
  * @returns {Boolean}
  * @description
  */
  Kriteria.prototype._compare = function _compare(value1, operator, value2) {
    var result = false;

    switch(operator) {
      case "eq":
        result = (value2[0] === value1);
        break;

      case "ne":
        result = (value2[0] !== value1);
        break;

      case "lt":
        result = (value2[0] > value1);
        break;

      case "le":
        result = (value2[0] >= value1);
        break;

      case "gt":
        result = (value2[0] < value1);
        break;

      case "ge":
        result = (value2[0] <= value1);
        break;

      case "in":
        result = !!~value2.indexOf(value1);
        break;

      case "not_in":
        result = !~value2.indexOf(value1);
        break;

      case "between":
        result = (value2[0] <= value1 && value2[1] >= value1);
        break;

      case "not_between":
        result = (value2[0] > value1 || value2[1] < value1);
        break;

      case "match":
        if(value2[0] === null) {
          if(value1 === null || value1 === void 0) {
            result = true;
          } else {
            result = false;
          }

        } else if(value1 === null) {
          result = false;

        } else if(value2[0] === "") {
          result = value1 === "" ? true : false;

        } else {
          result = value2[0].test(value1);
        }
        break;

      case "not_match":
        if(value2[0] === null) {
          if(value1 === null || value1 === void 0) {
            result = false;
          } else {
            result = true;
          }

        } else if(value1 === null) {
          result = true;

        } else if(value2[0] === "") {
          result = value1 === "" ? false : true;

        } else {
          result = !value2[0].test(value1);
        }
        break;
    }

    return result;
  };

  /**
  * @public
  * @function
  * @returns {Function}
  * @description
  */
  Kriteria.prototype.matcher = function matcher() {
    /* eslint no-new-func: 0 */
    return new Function("$", "return " + this._createMatchingExpression());
  };

  /**
  * @private
  * @function
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createMatchingExpression = function _createMatchingExpression() {
    var i = 0, l = 0,
        expAnd = [],
        expOr = [],
        retAnd = "",
        retOr = "",
        condition = null,
        ret = "";

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      condition = this._conditionAnd[i];

      if(condition.criteria instanceof Kriteria) {
        expAnd[expAnd.length] = "(" + condition.criteria._createMatchingExpression() + ")";

      } else {
        expAnd[expAnd.length] = this._createExpression(condition);
      }
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      condition = this._conditionOr[i];

      if(condition.criteria instanceof Kriteria) {
        expOr[expOr.length] = "(" + condition.criteria._createMatchingExpression() + ")";

      } else {
        expOr[expOr.length] = this._createExpression(condition);
      }
    }

    retAnd = expAnd.join(" && ");
    retOr = expOr.join(" || ");

    if(retAnd && retOr) {
      ret = retAnd + " || " + retOr + " ";
    } else if(!retOr) {
      ret = retAnd;
    } else if(!retAnd) {
      ret = retOr;
    }

    if(this._not_flg) {
      ret = "!(" + ret + ")";
    }

    return ret;
  };

  /**
  * @private
  * @function
  * @param {Condition} condition -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createExpression = function _createExpression(condition) {
    return "(" +
      this._createJsExpressionOfKeyIsNotUndefined(condition.left_key) +
      " && " +
      (
        condition.key_type === "key" ?
          this._createJsExpressionOfKeyIsNotUndefined(condition.right_key[0]) + " && " :
          ""
      ) +
      this._createJsExpression(condition) +
      ")";
  };

  /**
  * @private
  * @function
  * @param {Condition}
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createJsExpression = function _createJsExpression(condition) {
    var left_key = kref("$", condition.left_key.split(".")),
        operator = condition.operator,
        right_key = condition.right_key,
        key_type = condition.key_type,
        _operator = Kriteria._JS_OPERATOR[operator],
        $_right_key = kref("$", right_key[0]).toString();

    if(_operator) {
      /* 演算子が eq, ne, lt, le, gt, ge のいずれか
           [left_key] [operator] "[right_key]"
           [left_key] [operator] $.[right_key]
      */
      return left_key + " " + _operator + " " +
             this._toStringExpressionFromValue(right_key[0], key_type);

    } else if(operator === "in") {
      /* in 演算子
           !!~[[right_key]].indexOf([left_key])
           (Array.isArray($.[right_key]) ? !!~$.[right_key].indexOf([left_key]) : $.[right_key] === [left_key])
      */
      if(key_type === "value") {
        return "!!~" + this._toStringExpressionFromArray(right_key) + ".indexOf(" + left_key + ")";

      } else {
        return "(Array.isArray(" + $_right_key + ") ? " +
               "!!~" + $_right_key + ".indexOf(" + left_key + "): " +
               $_right_key + " === " + left_key + ")";
      }

    } else if(operator === "not_in") {
      /* not_in 演算子
      */
      if(key_type === "value") {
        return "!~" + this._toStringExpressionFromArray(right_key) + ".indexOf(" + left_key + ")";

      } else {
        return "(Array.isArray(" + $_right_key + ") ? " +
               "!~" + $_right_key + ".indexOf(" + left_key + "): " +
               $_right_key + " !== " + left_key + ")";
      }

    } else if(operator === "between") {
      /* between 演算子
      */
      return left_key + " >= " + this._toStringExpressionFromValue(right_key[0], key_type) +
             " && " +
             left_key + " <= " + this._toStringExpressionFromValue(right_key[1], key_type);

    } else if(operator === "not_between") {
      /* not_between 演算子
      */
      return left_key + " < " + this._toStringExpressionFromValue(right_key[0], key_type) +
             " || " +
             left_key + " > " + this._toStringExpressionFromValue(right_key[1], key_type);

    } else if(operator === "match") {
      /* match 演算子
      */
      if(right_key[0] === void 0) {
        return false;

      } else if(right_key[0] === null) {
        return "(" + left_key + " === null ? true : false)";

      } else if(right_key[0] === "") {
        return "(" + left_key + " === '' ? true : false)";

      } else {
        //return "(" + left_key + " !== null && " + right_key[0] + ".test(" + left_key + "))";
        return "(" + right_key[0] + ".test(" + left_key + "))";
      }

    } else if(operator === "not_match") {
      /* not_match 演算子
      */
      if(right_key[0] === void 0) {
        return false;

      } else if(right_key[0] === null) {
        return "(" + left_key + " === null ? false : true)";

      } else if(right_key[0] === "") {
        return "(" + left_key + " === '' ? false : true)";

      } else {
        //return "(" + left_key + " !== null && !" + right_key[0] + ".test(" + left_key + "))";
        return "(!" + right_key[0] + ".test(" + left_key + "))";
      }

    } else {
      return null;
    }
  };

  /**
  * @private
  * @function
  * @param {String} key -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createJsExpressionOfKeyIsNotUndefined =
    function _createJsExpressionOfKeyIsNotUndefined(key) {
    var keys = key.split("."),
        work_keys = [],
        ret = [];

    for(var i = 0, l = keys.length; i < l; i = i + 1) {
      work_keys[work_keys.length] = keys[i];
      ret[ret.length] = kref("$", work_keys).toString() + " !== void 0";
    }

    return ret.join(" && ");
  };

  /**
  * @private
  * @function
  * @param {String} key -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._createJSExpressionOfKeyIsUndefined =
    function _createJSExpressionOfKeyIsUndefined(key) {
    var keys = key.split("."),
        work_keys = [],
        ret = [];

    for(var i = 0, l = keys.length; i < l; i = i + 1) {
      work_keys[work_keys.length] = keys[i];

      var $_work_keys = kref("$", work_keys);

      ret[ret.length] = $_work_keys + " === void 0";
      ret[ret.length] = $_work_keys + " === null";
    }

    return ret.join(" || ");
  };

  /**
  * @private
  * @function
  * @param {Array} arr -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._toStringExpressionFromArray = function _toStringExpressionFromArray(arr) {
    var ret = [];

    for(var i = 0, l = arr.length; i < l; i = i + 1) {
      ret[ret.length] = this._toStringExpressionFromValue(arr[i], "value");
    }

    return "[" + ret.join(", ") + "]";
  };

  /**
  * @private
  * @function
  * @param {Mixed(String|Number)} value -
  * @param {String} type -
  * @returns {String}
  * @description
  */
  Kriteria.prototype._toStringExpressionFromValue =
    function _toStringExpressionFromValue(value, type) {
    if(type === "value" && (typeof value === "string" || value instanceof String)) {
      return '"' + value + '"';

    } else if(type === "key") {
      return kref("$", value.split(".")).toString();

    } else {
      return value + '';
    }
  };

  /**
  * @public
  * @function
  * @param {String[]} prefixes -
  * @returns {Object.<Kriteria>}
  */
  Kriteria.prototype.splitByKeyPrefixes = function splitByKeyPrefixes(prefixes) {
    if(!Array.isArray(prefixes) || prefixes.length === 0) {
      return null;
    }

    var ret = {},
        condition = null,
        splited_criteria = null,
        matchPrefixes = [],
        left_key = "",
        right_key = "",
        key_type = "",
        match1 = true,
        match2 = true,
        added = true,
        key = "",
        i = 0, l = 0,
        j = 0, l2 = 0;

    for(i = 0, l = prefixes.length; i < l; i = i + 1) {
      ret[prefixes[i]] = new Kriteria();
    }
    ret.else = new Kriteria();

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      condition = this._conditionAnd[i];

      if(condition.criteria instanceof Kriteria) {
        splited_criteria = condition.criteria.splitByKeyPrefixes(prefixes);

        for(key in splited_criteria) {
          if(splited_criteria[key] !== null) {
            ret[key].and(splited_criteria[key]);
          }
        }

      } else {
        matchPrefixes = [];
        left_key = condition.left_key;
        right_key = condition.right_key[0];
        key_type = condition.key_type;
        added = false;

        for(j = 0, l2 = prefixes.length; j < l2; j = j + 1) {
          matchPrefixes[matchPrefixes.length] = prefixes[j];

          match1 = matchPrefix(left_key, matchPrefixes);
          if(key_type === "key") {
            match2 = matchPrefix(right_key, matchPrefixes);
          }

          if(
            (key_type === "value" && match1) ||
            (key_type === "key" && match1 && match2)
          ) {
            ret[prefixes[j]].addAnd(condition);
            added = true;
            break;
          }
        }

        if(!added) {
          ret.else.addAnd(condition);
        }
      }
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      condition = this._conditionOr[i];

      if(condition.criteria instanceof Kriteria) {
        splited_criteria = condition.criteria.splitByKeyPrefixes(prefixes);

        for(key in splited_criteria) {
          if(splited_criteria[key] !== null) {
            ret[key].or(splited_criteria[key]);
          }
        }

      } else {
        matchPrefixes = [];
        left_key = condition.left_key;
        right_key = condition.right_key[0];
        key_type = condition.key_type;
        added = false;

        for(j = 0, l2 = prefixes.length; j < l2; j = j + 1) {
          matchPrefixes[matchPrefixes.length] = prefixes[j];

          match1 = matchPrefix(left_key, matchPrefixes);
          if(key_type === "key") {
            match2 = matchPrefix(right_key, matchPrefixes);
          }

          if(
            (key_type === "value" && match1) ||
            (key_type === "key" && match1 && match2)
          ) {
            ret[prefixes[j]].addOr(condition);
            added = true;
            break;
          }
        }

        if(!added) {
          ret.else.addOr(condition);
        }
      }
    }

    for(key in ret) {
      if(ret[key].getConditionAnd().length > 0 || ret[key].getConditionOr().length > 0) {
        ret[key]._not_flg = this._not_flg;
      } else {
        ret[key] = null;
      }
    }
    return ret;
  };

  /**
  * @public
  * @function
  * @param {Kriteria} kri -
  * @param {Boolean} unique -
  * @returns {Kriteria}
  */
  Kriteria.prototype.merge = function merge(kri, unique) {
    var new_kriteria = new Kriteria(),
        kri_cond_and = kri.getConditionAnd(),
        kri_cond_or = kri.getConditionOr(),
        cond1 = null,
        match = false,
        i = 0, l = 0,
        j = 0, l2 = 0;

    if(this._not_flg !== kri._not_flg) {
      throw new Error("Kriteria#merge - collision to not flag.");
    }

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      new_kriteria.addAnd(this._conditionAnd[i]);
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      new_kriteria.addOr(this._conditionOr[i]);
    }

    if(!unique) {
      for(i = 0, l = kri_cond_and.length; i < l; i = i + 1) {
        new_kriteria.addAnd(kri_cond_and[i]);
      }

      for(i = 0, l = kri_cond_or.length; i < l; i = i + 1) {
        new_kriteria.addOr(kri_cond_or[i]);
      }

    } else {
      for(i = 0, l = kri_cond_and.length; i < l; i = i + 1) {
        cond1 = kri_cond_and[i];
        match = false;

        for(j = 0, l2 = this._conditionAnd.length; j < l2; j = j + 1) {
          if(cond1.compareTo(this._conditionAnd[j]) === 0) {
            match = true;
            break;
          }
        }

        if(!match) {
          new_kriteria.addAnd(cond1);
        }
      }

      for(i = 0, l = kri_cond_or.length; i < l; i = i + 1) {
        cond1 = kri_cond_or[i];
        match = false;

        for(j = 0, l2 = this._conditionOr.length; j < l2; j = j + 1) {
          if(cond1.compareTo(this._conditionOr[j]) === 0) {
            match = true;
            break;
          }
        }

        if(!match) {
          new_kriteria.addOr(cond1);
        }
      }
    }

    return new_kriteria;
  };

  /**
  * @public
  * @function
  * @param {Kriteria} kri -
  * @returns {Number}
  *    0 - equal
  *    1 - greater
  *   -1 - less
  */
  Kriteria.prototype.compareTo = function compareTo(kri) {
    var sort_func = function(a, b) {
          return a.compareTo(b);
        },
        kri_cond_and = kri.getConditionAnd(),
        kri_cond_or = kri.getConditionOr(),
        cond1 = null,
        cond2 = null,
        compared = true,
        len1 = 0, len2 = 0,
        i = 0, l = 0;

    this._conditionAnd.sort(sort_func);
    kri_cond_and.sort(sort_func);
    this._conditionOr.sort(sort_func);
    kri_cond_or.sort(sort_func);

    if(this._not_flg && !kri._not_flg) {
      return -1;
    } else if(!this._not_flg && kri._not_flg) {
      return 1;
    }

    len1 = this._conditionAnd.length;
    len2 = kri_cond_and.length;
    l = len1 > len2 ? len1 : len2;
    for(i = 0; i < l; i = i + 1) {
      cond1 = this._conditionAnd[i];
      cond2 = kri_cond_and[i];

      if(!cond1) {
        return -1;
      } else if(!cond2) {
        return 1;
      }

      compared = cond1.compareTo(cond2);

      if(compared !== 0) {
        return compared;
      }
    }

    len1 = this._conditionOr.length;
    len2 = kri_cond_or.length;
    l = len1 > len2 ? len1 : len2;
    for(i = 0; i < l; i = i + 1) {
      cond1 = this._conditionOr[i];
      cond2 = kri_cond_or[i];

      if(!cond1) {
        return -1;
      } else if(!cond2) {
        return 1;
      }

      compared = cond1.compareTo(cond2);

      if(compared !== 0) {
        return compared;
      }
    }

    return 0;
  };

  /**
  * @public
  * @function
  * @param {String[]} prefixes -
  * @returns {Kriteria}
  */
  Kriteria.prototype.removePrefixes = function removePrefixes(prefixes) {
    var rex = null,
        condition = null,
        i = 0, l = 0;

    if(prefixes === null || prefixes === void 0 || !Array.isArray(prefixes) || prefixes.length === 0) {
      return this;
    }

    rex = new RegExp("^(" + prefixes.join("|") + ").");

    for(i = 0, l = this._conditionAnd.length; i < l; i = i + 1) {
      condition = this._conditionAnd[i];

      if(condition.criteria instanceof Kriteria) {
        condition.criteria.removePrefixes(prefixes);

      } else {
        condition.left_key = condition.left_key.replace(rex, "");
        if(condition.key_type === "key") {
          condition.right_key[0] = condition.right_key[0].replace(rex, "");
        }
      }
    }

    for(i = 0, l = this._conditionOr.length; i < l; i = i + 1) {
      condition = this._conditionOr[i];

      if(condition.criteria instanceof Kriteria) {
        condition.criteria.removePrefixes(prefixes);

      } else {
        condition.left_key = condition.left_key.replace(rex, "");
        if(condition.key_type === "key") {
          condition.right_key[0] = condition.right_key[0].replace(rex, "");
        }
      }
    }

    return this;
  };


  cxt.Kriteria = Kriteria;
  global.Kriteria = Kriteria;

}(this, (0, eval)("this").window || this));

},{"./lib/Condition.js":8,"./lib/evaluation.js":9,"./lib/getProperty.js":10,"./lib/keys_reference.js":11,"./lib/matchPrefix.js":12}],8:[function(require,module,exports){
/* Condition.js */

(function (cxt) {
  "use strict";

  /**
  * @public
  * @class
  * @param {String} left_key -
  * @param {String} operator -
  * @param {Mixed(Array<any>|any)} right_key -
  * @param {String} key_type -
  * @param {Kriteria} criteria
  * @description
  */
  var Condition = function Condition(left_key, operator, right_key, key_type, criteria) {
    this.left_key = left_key;
    this.operator = operator;
    this.right_key = (Array.isArray(right_key) || right_key === void 0 || right_key === null) ?
      right_key : [right_key];
    this.key_type = key_type;
    this.criteria = criteria;
  };

  /**
  * @public
  * @function
  * @returns {Condition}
  * @description
  */
  Condition.prototype.clone = function clone() {
    return new Condition(this.left_key, this.operator, this.right_key.concat(), this.key_type, this.criteria);
  };

  /**
  * @public
  * @function
  * @returns {Conditons}
  * @description
  */
  Condition.prototype.not = function not() {
    switch(this.operator) {
      case "eq":
        this.operator = "ne";
        break;

      case "ne":
        this.operator = "eq";
        break;

      case "lt":
        this.operator = "ge";
        break;

      case "le":
        this.operator = "gt";
        break;

      case "gt":
        this.operator = "le";
        break;

      case "ge":
        this.operator = "lt";
        break;

      case "in":
        this.operator = "not_in";
        break;

      case "not_in":
        this.operator = "in";
        break;

      case "between":
        this.operator = "not_between";
        break;

      case "not_between":
        this.operator = "between";
        break;

      case "match":
        this.operator = "not_match";
        break;

      case "not_match":
        this.operator = "match";
        break;

    }

    return this;
  };

  /**
  * @public
  * @function
  * @returns Array<Condition>
  */
  Condition.prototype.normalize = function normalize() {
    var ret = [],
        i = 0, l = 0;

    if(this.key_type === "value") {
      switch(this.operator) {
        case "in":
          for(i = 0, l = this.right_key.length; i < l; i = i + 1) {
            ret[ret.length] = new Condition(
              this.left_key, "eq", [this.right_key[i]], this.key_type, null)
            ;
          }
          break;

        case "not_in":
          for(i = 0, l = this.right_key.length; i < l; i = i + 1) {
            ret[ret.length] = new Condition(
              this.left_key, "ne", [this.right_key[i]], this.key_type, null
            );
          }
          break;

        case "between":
          ret[ret.length] = new Condition(
            this.left_key, "ge", [this.right_key[0]], this.key_type, null
          );
          ret[ret.length] = new Condition(
            this.left_key, "le", [this.right_key[1]], this.key_type, null
          );
          break;

        case "not_between":
          ret[ret.length] = new Condition(
            this.left_key, "lt", [this.right_key[0]], this.key_type, null
          );
          ret[ret.length] = new Condition(
            this.left_key, "gt", [this.right_key[1]], this.key_type, null
          );
          break;

        default:
          ret[ret.length] = this.clone();
          break;
      }

    } else {
      ret[ret.length] = this.clone();
    }

    return ret;
  };

  /**
  * @public
  * @function
  * @param {Condition} cond -
  * @returns {Number}
  *    0 - equal
  *    1 - greater
  *   -1 - less
  */
  Condition.prototype.compareTo = function compareTo(cond) {
    if(this.criteria && !cond.criteria) {
      return 1;

    } else if(!this.criteria && cond.criteria) {
      return -1;

    } else if(this.criteria && cond.criteria) {
      return this.criteria.compareTo(cond.criteria);

    } else if(this.left_key > cond.left_key) {
      return 1;

    } else if(this.left_key < cond.left_key) {
      return -1;

    } else if(this.operator > cond.operator) {
      return 1;

    } else if(this.operator < cond.operator) {
      return -1;

    } else if(this.key_type > cond.key_type) {
      return 1;

    } else if(this.key_type < cond.key_type) {
      return -1;

    } else {
      for(var i = 0, l = this.right_key.length; i < l; i = i + 1) {
        if(this.right_key[i] > cond.right_key[i]) {
          return 1;
        } else if(this.right_key[i] < cond.right_key[i]) {
          return -1;
        }
      }

      return 0;
    }
  };

  cxt.Condition = Condition;

})(this);

},{}],9:[function(require,module,exports){
/* evaluation.js */

(function (cxt){
  "use strict";

  var Condition = require('./Condition.js').Condition;

  /**
  * @public
  * @function
  * @param {String} type -
  * @param {String} left_key -
  * @param {Kriteria} criteria -
  * @returns {Object<[eq|ne|lt|le|gt|ge|in|not_in].[key|value]>|between}
  * @description
  */
  var evaluation = function evaluation(type, left_key, criteria) {
    return {
      eq: {
        key: function(value) {
          _setToCriteria(criteria, type, "eq", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "eq", left_key, "value", [value]);
          return criteria;
        }
      },
      ne: {
        key: function(value) {
          _setToCriteria(criteria, type, "ne", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "ne", left_key, "value", [value]);
          return criteria;
        }
      },
      lt: {
        key: function(value) {
          _setToCriteria(criteria, type, "lt", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "lt", left_key, "value", [value]);
          return criteria;
        }
      },
      le: {
        key: function(value) {
          _setToCriteria(criteria, type, "le", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "le", left_key, "value", [value]);
          return criteria;
        }
      },
      gt: {
        key: function(value) {
          _setToCriteria(criteria, type, "gt", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "gt", left_key, "value", [value]);
          return criteria;
        }
      },
      ge: {
        key: function(value) {
          _setToCriteria(criteria, type, "ge", left_key, "key", [value]);
          return criteria;
        },
        value: function(value) {
          _setToCriteria(criteria, type, "ge", left_key, "value", [value]);
          return criteria;
        }
      },
      in: {
        key: function() {
          _setToCriteria(criteria, type, "in", left_key, "key", [arguments[0]]);
          return criteria;
        },
        value: function() {
          _setToCriteria(
            criteria,
            type,
            "in",
            left_key,
            "value",
            Array.isArray(arguments[0]) ? arguments[0] : [].slice.apply(arguments)
          );
          return criteria;
        }
      },
      not_in: {
        key: function() {
          _setToCriteria(criteria, type, "not_in", left_key, "key", [arguments[0]]);
          return criteria;
        },
        value: function() {
          _setToCriteria(
            criteria,
            type,
            "not_in",
            left_key,
            "value",
            Array.isArray(arguments[0]) ? arguments[0] : [].slice.apply(arguments)
          );
          return criteria;
        }
      },
      between: function(value1, value2) {
        _setToCriteria(criteria, type, "between", left_key, "value", [value1, value2]);
        return criteria;
      },
      not_between: function(value1, value2) {
        _setToCriteria(criteria, type, "not_between", left_key, "value", [value1, value2]);
        return criteria;
      },
      match: function(value) {
        var _value = value instanceof RegExp ? value :
                     value === null ? null :
                     value === void 0 ? void 0 :
                     value === "" ? "" : new RegExp(value);
        _setToCriteria(criteria, type, "match", left_key, "value", [_value]);
        return criteria;
      },
      not_match: function(value) {
        var _value = value instanceof RegExp ? value :
                     value === null ? null :
                     value === void 0 ? void 0 :
                     value === "" ? "" : new RegExp(value);
        _setToCriteria(criteria, type, "not_match", left_key, "value", [_value]);
        return criteria;
      }
    };
  };

  /**
  * @private
  * @function
  * @param {Kriteria} criteria -
  * @param {String} type -
  * @param {String} operator -
  * @param {String} key_name -
  * @param {Array<String>} values -
  * @returns {void}
  * @description
  */
  var _setToCriteria = function _setToCriteria(criteria, type, operator, key_name, key_type, values) {
    if(type.toLowerCase() === "and") {
      criteria.addAnd(new Condition(key_name, operator, values, key_type, null));

    } else if(type.toLowerCase() === "or") {
      criteria.addOr(new Condition(key_name, operator, values, key_type, null));

    } else {
      throw new Error(
        "invalid type: " + type +
        "(at key_name:" + key_name + ", key_type: " + key_type + ", operator:" + operator + ")"
      );
    }
  };


  cxt.evaluation = evaluation;

})(this);

},{"./Condition.js":8}],10:[function(require,module,exports){
/* getProperty.js */

(function (cxt) {
  'use strict';

  var getProperty = function getProperty(obj, key) {
    var keys = key.split('.'),
        ret = obj;

    for(var i = 0, l = keys.length; i < l; i += 1) {
      if(
        typeof ret === "string" ||
        ret instanceof String ||
        typeof ret === "number" ||
        ret instanceof Number
      ) {
        return void 0;

      } else if(keys[i] in ret) {
        ret = ret[keys[i]];

      } else {
        return void 0;
      }
    }

    return ret;
  };

  cxt.getProperty = getProperty;

})(this);

},{}],11:[function(require,module,exports){
/* keys_reference.js */

(function(global, cxt) {
  "use strict";

  var KeysReferenceInstance = function KeysReferenceInstance(target) {
    this._target = target;
    this._q = "'";
    this._keys = [];
  };

  KeysReferenceInstance.prototype.toString = function toString() {
    var ret = this._target,
        keys = this._keys,
        q = this._q;

    for(var i = 0, l = keys.length; i < l; i = i + 1) {
      ret = ret + "[" + q + keys[i] + q + "]";
    }

    return ret;
  };

  KeysReferenceInstance.prototype.setQuote = function setQuote(q) {
    if(isString(q)) {
      this._q = q;
    }
  };

  KeysReferenceInstance.prototype.add = function add(key) {
    this._keys[this._keys.length] = key;
  };

  var keysReference = function keysReference(obj, keys, opt) {
    var ins = new KeysReferenceInstance(obj);

    if(opt && isString(opt.q)) {
      ins.setQuote(opt.q);
    }

    if(Array.isArray(keys)) {
      for(var i = 0, l = keys.length; i < l; i = i + 1) {
        ins.add(keys[i]);
      }

    } else {
      ins.add(keys);
    }

    return ins;
  };

  var isString = function isString(obj) {
    return typeof obj === "string" || obj instanceof String;
  };


  //global.keysReference = keysReference;
  cxt.keysReference = keysReference;

}((0, eval)("this"), this));


},{}],12:[function(require,module,exports){
/* matchPrefix.js */

(function(cxt) {
  "use strict";

  /**
  * @public
  * @function
  * @param {String} str -
  * @param {String[]} prefixes -
  * @returns {Boolean}
  */
  var matchPrefix = function matchPrefix(str, prefixes) {
    if(prefixes.length === 0) {
      return true;
    }

    for(var i = 0, l = prefixes.length; i < l; i = i + 1) {
      if(str.indexOf(prefixes[i] + ".") === 0) {
        return true;
      }
    }

    return false;
  };


  cxt.matchPrefix = matchPrefix;

}(this));

},{}]},{},[1]);

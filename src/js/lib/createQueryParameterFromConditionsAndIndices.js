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

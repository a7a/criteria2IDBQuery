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

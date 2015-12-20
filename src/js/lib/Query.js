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

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

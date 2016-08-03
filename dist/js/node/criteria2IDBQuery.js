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

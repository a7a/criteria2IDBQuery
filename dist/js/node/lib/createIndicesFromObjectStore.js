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

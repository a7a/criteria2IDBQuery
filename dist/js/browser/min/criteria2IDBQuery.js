!function e(t,n,i){function r(a,s){if(!n[a]){if(!t[a]){var l="function"==typeof require&&require;if(!s&&l)return l(a,!0);if(o)return o(a,!0);var h=new Error("Cannot find module '"+a+"'");throw h.code="MODULE_NOT_FOUND",h}var c=n[a]={exports:{}};t[a][0].call(c.exports,function(e){var n=t[a][1][e];return r(n?n:e)},c,c.exports,e,t,n,i)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(e,t,n){!function(t){"use strict";var n=e("./lib/createQueryParameterFromConditionsAndIndices.js").createQueryParameterFromConditionsAndIndices,i=e("./lib/analyzeConditionsFromCriteria.js").analyzeConditionsFromCriteria,r=e("./lib/createIndicesFromObjectStore.js").createIndicesFromObjectStore,o=function(e,t,o){return n(i(e,!1),r(t),o&&o.priority?o.priority:[])},a=function(e,t){var n=t||(0,eval)("this").IDBKeyRange,i=null;if(!n)throw new Error("IDBKeyRange is not available.");if(!e.method)return null;switch(e.method[0]){case"only":i=1===e.value1.length?n[e.method[0]](e.value1[0]):n[e.method[0]](e.value1);break;case"upperBound":i=1===e.value1.length?n[e.method[0]](e.value1[0],e.method[1]):n[e.method[0]](e.value1,e.method[1]);break;case"lowerBound":i=1===e.value2.length?n[e.method[0]](e.value2[0],e.method[1]):n[e.method[0]](e.value2,e.method[1]);break;case"bound":i=1===e.value1.length?n[e.method[0]](e.value1[0],e.value2[0],e.method[1],e.method[2]):n[e.method[0]](e.value1,e.value2,e.method[1],e.method[2])}return i};t.criteria2IDBQuery={createQueryParameter:o,createIDBKeyRange:a}}((0,eval)("this").window||this)},{"./lib/analyzeConditionsFromCriteria.js":4,"./lib/createIndicesFromObjectStore.js":5,"./lib/createQueryParameterFromConditionsAndIndices.js":6}],2:[function(e,t,n){!function(e){"use strict";var t=function(){this._keys=[],this._priority_keys=[]};t.prototype.init=function(e,t){for(var n=0,i=e.length;n<i;n+=1)this.set(e[n]);Array.isArray(t)?this._priority_keys=t:""!==t&&null!==t&&void 0!==t&&(this._priority_keys=[t])},t.prototype.set=function(e){this._keys[this._keys.length]={};var t=this._keys.length-1;if(null===e.keyPath)this._keys[t]=[];else if(Array.isArray(e.keyPath))for(var n=0,i=e.keyPath.length;n<i;n+=1)this._keys[t][e.keyPath[n]]=0;else this._keys[t][e.keyPath]=0},t.prototype.calc=function(e){for(var t=0,n=this._keys.length;t<n;t+=1)void 0!==this._keys[t][e]&&(this._keys[t][e]=1)},t.prototype.clone=function(){var e=new t;e._keys=[],e._priority_keys=[];for(var n=0,i=this._keys.length;n<i;n+=1){e._keys[n]||(e._keys[n]={});for(var r in this._keys[n])e._keys[n][r]=0}for(n=0,i=this._priority_keys.length;n<i;n+=1)e._priority_keys[n]=this._priority_keys[n];return e},t.prototype.getResult=function(){for(var e=[],t=0,n=this._keys.length;t<n;t+=1){var i=0,r=0,o=0;for(var a in this._keys[t])i+=1,r+=this._keys[t][a],~this._priority_keys.indexOf(a)&&(o+=1);0!==i&&i===r&&(e[e.length]={index:t,match_num:r,priority_num:o})}return e.sort(function(e,t){return e.priority_num<t.priority_num?1:e.priority_num>t.priority_num?-1:e.match_num<t.match_num?1:e.match_num>t.match_num?-1:0}),e},e.IndexAggregator=t}(this)},{}],3:[function(e,t,n){!function(e){"use strict";var t=function(){this.keys=[],this.conditions=[]};t.prototype.addKeysFromCondition=function(e){"value"!==e.key_type||~this.keys.indexOf(e.left_key)||(this.keys[this.keys.length]=e.left_key)},t.prototype.addCondition=function(e,t){this.addKeysFromCondition(e),t?this.conditions=this.conditions.concat(e.clone().not().normalize()):this.conditions=this.conditions.concat(e.clone().normalize())},t.prototype.merge=function(e){var t=0,n=0;for(t=0,n=e.keys.length;t<n;t+=1)~this.keys.indexOf(e.keys[t])||(this.keys[this.keys.length]=e.keys[t]);for(t=0,n=e.conditions.length;t<n;t+=1)this.conditions[this.conditions.length]=e.conditions[t].clone();return this},t.prototype.clone=function(){var e=new t;e.keys=this.keys.concat();for(var n=0,i=this.conditions.length;n<i;n+=1)e.conditions[n]=this.conditions[n].clone();return e},t.prototype.not=function(){for(var e=[],n=0,i=this.conditions.length;n<i;n+=1){var r=new t;r.addCondition(this.conditions[n],!0),e[e.length]=r}return e},e.Query=t}(this)},{}],4:[function(e,t,n){!function(t){"use strict";var n=e("kriteria").Kriteria||(0,eval)("this").Kriteria,i=e("./Query.js").Query,r=function s(e,t){var r=[],l=[],h=!!(e._not_flg^t),c=null,u=[],f=[],y=null,d=0,_=0;if(h?(r=e.getConditionOr(),l=e.getConditionAnd()):(r=e.getConditionAnd(),l=e.getConditionOr()),r.length>0){for(y=new i,d=0,_=r.length;d<_;d+=1)c=r[d],c.criteria instanceof n?f=o(f,s(c.criteria,h)):!h&&("in"===c.operator||"not_between"===c.operator)||h&&("not_in"===c.operator||"between"===c.operator)?f=o(f,a(c,h)):y.addCondition(c,h);u=u.concat(o([y],f))}if(l.length>0)for(d=0,_=l.length;d<_;d+=1)c=l[d],c.criteria instanceof n?u=u.concat(s(c.criteria,h)):!h&&("in"===c.operator||"not_between"===c.operator)||h&&("not_in"===c.operator||"between"===c.operator)?u=u.concat(a(c,h)):(y=new i,y.addCondition(c,h),u=u.concat([y]));return u},o=function(e,t){var n=[];if(e.length>0&&t.length)for(var i=0,r=e.length;i<r;i+=1)for(var o=0,a=t.length;o<a;o+=1)n[n.length]=e[i].clone().merge(t[o]);else n=0===e.length?t.concat():e.concat();return n},a=function(e,t){for(var n=e.normalize(),r=[],o=0,a=n.length;o<a;o+=1){var s=new i;t?s.addCondition(n[o].not()):s.addCondition(n[o]),r[r.length]=s}return r};t.analyzeConditionsFromCriteria=r}(this)},{"./Query.js":3,kriteria:7}],5:[function(e,t,n){!function(e){"use strict";var t=function(e){for(var t=[e],n=0,i=e.indexNames.length;n<i;n=n+1|0)t[t.length]=e.index(e.indexNames[n]);return t};e.createIndicesFromObjectStore=t}(this)},{}],6:[function(e,t,n){!function(t){"use strict";var n=e("kriteria").Kriteria||(0,eval)("this").Kriteria,i=e("./IndexAggregator.js").IndexAggregator,r=function(e,t,r){var h=new i,c=0,u=0,f=0,y=0,d=0,_=0,g="",p=[];for(h.init(t,r),c=0,u=e.length;c<u;c+=1){var k=e[c],v=h.clone(),m={store:t[0],method:null,keypath:null,value1:null,value2:null,filter:n.parse({and:k.conditions}).matcher()},x=o(v,k);if(0===x.length)p[p.length]=m;else{var b=[],w=[[],[]],A=[],O=[],C=0;for(f=0,y=x.length;f<y;f+=1){var E=x[f].index,j=[];for(C=t[E],b=[],w=[[],[]],O=[],A=[],d=0,_=k.conditions.length;d<_;d+=1){var P=k.conditions[d],F=C.keyPath.indexOf(P.left_key);~F&&a(P,F,j)}for(g in j)s(j[g],g,{method:A,value:w,method_level:O,target_keypath:b});if(!l(A))break}if(f===x.length&&(b=[],w=[[],[]],O=[],A=[]),A.length>0){var S=[],q=0;for(d=0,_=A.length;d<_;d+=1)void 0!==A[d]&&O[d]>q&&(S=A[d].concat(),q=O[d]);p[p.length]={store:C,method:S,keypath:b,value1:w[0],value2:w[1],filter:n.parse({and:k.conditions}).matcher()}}else p[p.length]=m}}return p},o=function(e,t){for(var n=0,i=t.keys.length;n<i;n+=1)for(var r=0,o=t.conditions.length;r<o;r+=1){var a=t.conditions[r].operator;t.conditions[r].left_key===t.keys[n]&&"value"===t.conditions[r].key_type&&"ne"!==a&&"match"!==a&&"not_match"!==a&&e.calc(t.keys[n])}return e.getResult()},a=function(e,t,n){var i=e.left_key;switch(n[i]||(n[i]={keypath_index:t,val1:null,val2:null,flg_eq:!1,flg_lt:!1,flg_le:!1,flg_gt:!1,flg_ge:!1}),e.operator){case"eq":n[i].flg_eq=!0,n[i].flg_lt=!1,n[i].flg_le=!1,n[i].flg_gt=!1,n[i].flg_ge=!1,n[i].val1=e.right_key[0],n[i].val2=e.right_key[0];break;case"ne":break;case"lt":n[i].flg_eq||(n[i].flg_lt=!0,(null===n[i].val2||n[i].val2>e.right_key[0])&&(n[i].val2=e.right_key[0]));break;case"le":n[i].flg_eq||(n[i].flg_le=!0,n[i].flg_lt=!1,(null===n[i].val2||n[i].val2>e.right_key[0])&&(n[i].val2=e.right_key[0]));break;case"gt":n[i].flg_eq||(n[i].flg_gt=!0,(null===n[i].val1||n[i].val1<e.right_key[0])&&(n[i].val1=e.right_key[0]));break;case"ge":n[i].flg_eq||(n[i].flg_ge=!0,n[i].flg_gt=!1,(null===n[i].val1||n[i].val1<e.right_key[0])&&(n[i].val1=e.right_key[0]));break;case"match":case"not_match":}},s=function(e,t,n){var i=n.method,r=n.value,o=n.method_level,a=n.target_keypath;e.keypath_index>=0&&(void 0===o[e.keypath_index]&&(o[e.keypath_index]=0),e.flg_ge?e.flg_le?(i[e.keypath_index]=["bound",!1,!1],r[0][e.keypath_index]=e.val1,r[1][e.keypath_index]=e.val2,o[e.keypath_index]=2):e.flg_lt?(i[e.keypath_index]=["bound",!0,!1],r[0][e.keypath_index]=e.val1,r[1][e.keypath_index]=e.val2,o[e.keypath_index]=2):o[e.keypath_index]<=1&&(i[e.keypath_index]=["lowerBound",!1],r[1][e.keypath_index]=e.val1,o[e.keypath_index]=3):e.flg_gt?e.flg_le?(i[e.keypath_index]=["bound",!1,!0],r[0][e.keypath_index]=e.val1,r[1][e.keypath_index]=e.val2,o[e.keypath_index]=2):e.flg_lt?(i[e.keypath_index]=["bound",!0,!0],r[0][e.keypath_index]=e.val1,r[1][e.keypath_index]=e.val2,o[e.keypath_index]=2):o[e.keypath_index]<=1&&(i[e.keypath_index]=["lowerBound",!0],r[1][e.keypath_index]=e.val1,o[e.keypath_index]=3):e.flg_le?(i[e.keypath_index]=["upperBound",!1],r[0][e.keypath_index]=e.val2,o[e.keypath_index]=3):e.flg_lt?(i[e.keypath_index]=["upperBound",!0],r[0][e.keypath_index]=e.val2,o[e.keypath_index]=3):e.flg_eq&&(i[e.keypath_index]=["only"],r[0][e.keypath_index]=e.val1,r[1][e.keypath_index]=e.val2,o[e.keypath_index]=1),a[e.keypath_index]=t)},l=function(e){for(var t=!1,n=!1,i=0,r=e.length;i<r;i+=1)switch(e[i][0]){case"lowerBound":t=!0;break;case"upperBound":n=!0}return!(!t||!n)};t.createQueryParameterFromConditionsAndIndices=r}(this)},{"./IndexAggregator.js":2,kriteria:7}],7:[function(e,t,n){!function(t,n){"use strict";var i=e("./lib/getProperty.js").getProperty,r=e("./lib/matchPrefix.js").matchPrefix,o=e("./lib/Condition.js").Condition,a=e("./lib/evaluation.js").evaluation,s=e("./lib/keys_reference.js").keysReference,l=function(){this._conditionAnd=[],this._conditionOr=[],this._not_flg=!1};l._name_="Kriteria",l.prototype.getConditionAnd=function(){return this._conditionAnd},l.prototype.getConditionOr=function(){return this._conditionOr},l._JS_OPERATOR={eq:"===",ne:"!==",lt:"<",le:"<=",gt:">",ge:">="},l.prototype.addAnd=function(e){this._conditionAnd[this._conditionAnd.length]=e},l.prototype.addOr=function(e){this._conditionOr[this._conditionOr.length]=e},l.prototype.and=function(e){var t=typeof e,n=null;if("string"===t||e instanceof String||"number"===t||e instanceof Number)return a("and",e,this);if(e instanceof l)return n=e,this.addAnd(new o("","",[],"",n)),this;if("function"==typeof e)return n=new l,e(n),this.addAnd(new o("","",[],"",n)),this;throw new Error("invalid type of argument. ("+t+")")},l.prototype.or=function(e){var t=typeof e,n=null;if("string"===t||e instanceof String||"number"===t||e instanceof Number)return a("or",e,this);if(e instanceof l)return n=e,this.addOr(new o("","",[],"",n)),this;if("function"==typeof e)return n=new l,e(n),this.addOr(new o("","",[],"",n)),this;throw new Error("invalid type of argument. ("+t+")")},l.prototype.not=function(){return this._not_flg=!this._not_flg,this},l.parse=function(e){var t=new l,n="";for(n in e.and)t.addAnd(e.and[n]);for(n in e.or)t.andOr(e.or[n]);return e.not&&t.not(),t},l.prototype.match=function(e){var t=0,n=0,r=0,o=0,a="",s="",h=[],c="",u=null,f=[],y=!1,d=null,_=null;for(t=0,n=this._conditionAnd.length;t<n;t+=1)if(d=this._conditionAnd[t],d.criteria instanceof l){if(y=d.criteria.match(e),!y)break}else{if(a=d.left_key,s=d.operator,h=d.right_key,c=d.key_type,u=i(e,a),"value"===c)f=h;else if("key"===c)if(_=i(e,h[0]),Array.isArray(_))if("match"===s||"not_match"===s)for(f=[],r=0,o=_.length;r<o;r+=1)null===_[r]||void 0===_[r]||""===_[r]?f[r]=_[r]:f[r]=new RegExp(_[r]);else f=_;else f="match"===s||"not_match"===s?null===_||void 0===_||""===_?_:[new RegExp(_)]:[_];if(y=void 0!==f&&!~f.indexOf(void 0)&&void 0!==u&&this._compare(u,s,f),!y)break}if(y)return!!(!0^this._not_flg);for(t=0,n=this._conditionOr.length;t<n;t+=1)if(d=this._conditionOr[t],d.criteria instanceof l){if(y=d.criteria.match(e))return!!(!0^this._not_flg)}else{if(a=d.left_key,s=d.operator,h=d.right_key,c=d.key_type,u=i(e,a),"value"===c)f=h;else if("key"===c)if(_=i(e,h[0]),Array.isArray(_))if("match"===s||"not_match"===s)for(f=[],r=0,o=_.length;r<o;r+=1)null===_[r]||void 0===_[r]||""===_[r]?f[r]=_[r]:f[r]=new RegExp(_[r]);else f=_;else f="match"===s||"not_match"===s?null===_||void 0===_||""!==_?_:[new RegExp(_)]:[_];if(y=void 0!==f&&!~f.indexOf(void 0)&&void 0!==u&&this._compare(u,s,f))return!!(!0^this._not_flg)}return!!(!1^this._not_flg)},l.prototype._compare=function(e,t,n){var i=!1;switch(t){case"eq":i=n[0]===e;break;case"ne":i=n[0]!==e;break;case"lt":i=n[0]>e;break;case"le":i=n[0]>=e;break;case"gt":i=n[0]<e;break;case"ge":i=n[0]<=e;break;case"in":i=!!~n.indexOf(e);break;case"not_in":i=!~n.indexOf(e);break;case"between":i=n[0]<=e&&n[1]>=e;break;case"not_between":i=n[0]>e||n[1]<e;break;case"match":i=null===n[0]?null===e||void 0===e:null!==e&&(""===n[0]?""===e:n[0].test(e));break;case"not_match":i=null===n[0]?null!==e&&void 0!==e:null===e||(""===n[0]?""!==e:!n[0].test(e))}return i},l.prototype.matcher=function(){return new Function("$","return "+this._createMatchingExpression())},l.prototype._createMatchingExpression=function(){var e=0,t=0,n=[],i=[],r="",o="",a=null,s="";for(e=0,t=this._conditionAnd.length;e<t;e+=1)a=this._conditionAnd[e],a.criteria instanceof l?n[n.length]="("+a.criteria._createMatchingExpression()+")":n[n.length]=this._createExpression(a);for(e=0,t=this._conditionOr.length;e<t;e+=1)a=this._conditionOr[e],a.criteria instanceof l?i[i.length]="("+a.criteria._createMatchingExpression()+")":i[i.length]=this._createExpression(a);return r=n.join(" && "),o=i.join(" || "),r&&o?s=r+" || "+o+" ":o?r||(s=o):s=r,this._not_flg&&(s="!("+s+")"),s},l.prototype._createExpression=function(e){return"("+this._createJsExpressionOfKeyIsNotUndefined(e.left_key)+" && "+("key"===e.key_type?this._createJsExpressionOfKeyIsNotUndefined(e.right_key[0])+" && ":"")+this._createJsExpression(e)+")"},l.prototype._createJsExpression=function(e){var t=s("$",e.left_key.split(".")),n=e.operator,i=e.right_key,r=e.key_type,o=l._JS_OPERATOR[n],a=s("$",i[0]).toString();return o?t+" "+o+" "+this._toStringExpressionFromValue(i[0],r):"in"===n?"value"===r?"!!~"+this._toStringExpressionFromArray(i)+".indexOf("+t+")":"(Array.isArray("+a+") ? !!~"+a+".indexOf("+t+"): "+a+" === "+t+")":"not_in"===n?"value"===r?"!~"+this._toStringExpressionFromArray(i)+".indexOf("+t+")":"(Array.isArray("+a+") ? !~"+a+".indexOf("+t+"): "+a+" !== "+t+")":"between"===n?t+" >= "+this._toStringExpressionFromValue(i[0],r)+" && "+t+" <= "+this._toStringExpressionFromValue(i[1],r):"not_between"===n?t+" < "+this._toStringExpressionFromValue(i[0],r)+" || "+t+" > "+this._toStringExpressionFromValue(i[1],r):"match"===n?void 0!==i[0]&&(null===i[0]?"("+t+" === null ? true : false)":""===i[0]?"("+t+" === '' ? true : false)":"("+i[0]+".test("+t+"))"):"not_match"===n?void 0!==i[0]&&(null===i[0]?"("+t+" === null ? false : true)":""===i[0]?"("+t+" === '' ? false : true)":"(!"+i[0]+".test("+t+"))"):null},l.prototype._createJsExpressionOfKeyIsNotUndefined=function(e){for(var t=e.split("."),n=[],i=[],r=0,o=t.length;r<o;r+=1)n[n.length]=t[r],i[i.length]=s("$",n).toString()+" !== void 0";return i.join(" && ")},l.prototype._createJSExpressionOfKeyIsUndefined=function(e){for(var t=e.split("."),n=[],i=[],r=0,o=t.length;r<o;r+=1){n[n.length]=t[r];var a=s("$",n);i[i.length]=a+" === void 0",i[i.length]=a+" === null"}return i.join(" || ")},l.prototype._toStringExpressionFromArray=function(e){for(var t=[],n=0,i=e.length;n<i;n+=1)t[t.length]=this._toStringExpressionFromValue(e[n],"value");return"["+t.join(", ")+"]"},l.prototype._toStringExpressionFromValue=function(e,t){return"value"===t&&("string"==typeof e||e instanceof String)?'"'+e+'"':"key"===t?s("$",e.split(".")).toString():e+""},l.prototype.splitByKeyPrefixes=function(e){if(!Array.isArray(e)||0===e.length)return null;var t={},n=null,i=null,o=[],a="",s="",h="",c=!0,u=!0,f=!0,y="",d=0,_=0,g=0,p=0;for(d=0,_=e.length;d<_;d+=1)t[e[d]]=new l;for(t["else"]=new l,d=0,_=this._conditionAnd.length;d<_;d+=1)if(n=this._conditionAnd[d],n.criteria instanceof l){i=n.criteria.splitByKeyPrefixes(e);for(y in i)null!==i[y]&&t[y].and(i[y])}else{for(o=[],a=n.left_key,s=n.right_key[0],h=n.key_type,f=!1,g=0,p=e.length;g<p;g+=1)if(o[o.length]=e[g],c=r(a,o),"key"===h&&(u=r(s,o)),"value"===h&&c||"key"===h&&c&&u){t[e[g]].addAnd(n),f=!0;break}f||t["else"].addAnd(n)}for(d=0,_=this._conditionOr.length;d<_;d+=1)if(n=this._conditionOr[d],n.criteria instanceof l){i=n.criteria.splitByKeyPrefixes(e);for(y in i)null!==i[y]&&t[y].or(i[y])}else{for(o=[],a=n.left_key,s=n.right_key[0],h=n.key_type,f=!1,g=0,p=e.length;g<p;g+=1)if(o[o.length]=e[g],c=r(a,o),"key"===h&&(u=r(s,o)),"value"===h&&c||"key"===h&&c&&u){t[e[g]].addOr(n),f=!0;break}f||t["else"].addOr(n)}for(y in t)t[y].getConditionAnd().length>0||t[y].getConditionOr().length>0?t[y]._not_flg=this._not_flg:t[y]=null;return t},l.prototype.merge=function(e,t){var n=new l,i=e.getConditionAnd(),r=e.getConditionOr(),o=null,a=!1,s=0,h=0,c=0,u=0;if(this._not_flg!==e._not_flg)throw new Error("Kriteria#merge - collision to not flag.");for(s=0,h=this._conditionAnd.length;s<h;s+=1)n.addAnd(this._conditionAnd[s]);for(s=0,h=this._conditionOr.length;s<h;s+=1)n.addOr(this._conditionOr[s]);if(t){for(s=0,h=i.length;s<h;s+=1){for(o=i[s],a=!1,c=0,u=this._conditionAnd.length;c<u;c+=1)if(0===o.compareTo(this._conditionAnd[c])){a=!0;break}a||n.addAnd(o)}for(s=0,h=r.length;s<h;s+=1){for(o=r[s],a=!1,c=0,u=this._conditionOr.length;c<u;c+=1)if(0===o.compareTo(this._conditionOr[c])){a=!0;break}a||n.addOr(o)}}else{for(s=0,h=i.length;s<h;s+=1)n.addAnd(i[s]);for(s=0,h=r.length;s<h;s+=1)n.addOr(r[s])}return n},l.prototype.compareTo=function(e){var t=function(e,t){return e.compareTo(t)},n=e.getConditionAnd(),i=e.getConditionOr(),r=null,o=null,a=!0,s=0,l=0,h=0,c=0;if(this._conditionAnd.sort(t),n.sort(t),this._conditionOr.sort(t),i.sort(t),this._not_flg&&!e._not_flg)return-1;if(!this._not_flg&&e._not_flg)return 1;for(s=this._conditionAnd.length,l=n.length,c=s>l?s:l,h=0;h<c;h+=1){if(r=this._conditionAnd[h],o=n[h],!r)return-1;if(!o)return 1;if(a=r.compareTo(o),0!==a)return a}for(s=this._conditionOr.length,l=i.length,c=s>l?s:l,h=0;h<c;h+=1){if(r=this._conditionOr[h],o=i[h],!r)return-1;if(!o)return 1;if(a=r.compareTo(o),0!==a)return a}return 0},l.prototype.removePrefixes=function(e){var t=null,n=null,i=0,r=0;if(null===e||void 0===e||!Array.isArray(e)||0===e.length)return this;for(t=new RegExp("^("+e.join("|")+")."),i=0,r=this._conditionAnd.length;i<r;i+=1)n=this._conditionAnd[i],n.criteria instanceof l?n.criteria.removePrefixes(e):(n.left_key=n.left_key.replace(t,""),"key"===n.key_type&&(n.right_key[0]=n.right_key[0].replace(t,"")));for(i=0,r=this._conditionOr.length;i<r;i+=1)n=this._conditionOr[i],n.criteria instanceof l?n.criteria.removePrefixes(e):(n.left_key=n.left_key.replace(t,""),"key"===n.key_type&&(n.right_key[0]=n.right_key[0].replace(t,"")));return this},t.Kriteria=l,n.Kriteria=l}(this,(0,eval)("this").window||this)},{"./lib/Condition.js":8,"./lib/evaluation.js":9,"./lib/getProperty.js":10,"./lib/keys_reference.js":11,"./lib/matchPrefix.js":12}],8:[function(e,t,n){!function(e){"use strict";var t=function(e,t,n,i,r){this.left_key=e,this.operator=t,this.right_key=Array.isArray(n)||void 0===n||null===n?n:[n],this.key_type=i,this.criteria=r};t.prototype.clone=function(){return new t(this.left_key,this.operator,this.right_key.concat(),this.key_type,this.criteria)},t.prototype.not=function(){switch(this.operator){case"eq":this.operator="ne";break;case"ne":this.operator="eq";break;case"lt":this.operator="ge";break;case"le":this.operator="gt";break;case"gt":this.operator="le";break;case"ge":this.operator="lt";break;case"in":this.operator="not_in";break;case"not_in":this.operator="in";break;case"between":this.operator="not_between";break;case"not_between":this.operator="between";break;case"match":this.operator="not_match";break;case"not_match":this.operator="match"}return this},t.prototype.normalize=function(){var e=[],n=0,i=0;if("value"===this.key_type)switch(this.operator){case"in":for(n=0,i=this.right_key.length;n<i;n+=1)e[e.length]=new t(this.left_key,"eq",[this.right_key[n]],this.key_type,null);break;case"not_in":for(n=0,i=this.right_key.length;n<i;n+=1)e[e.length]=new t(this.left_key,"ne",[this.right_key[n]],this.key_type,null);break;case"between":e[e.length]=new t(this.left_key,"ge",[this.right_key[0]],this.key_type,null),e[e.length]=new t(this.left_key,"le",[this.right_key[1]],this.key_type,null);break;case"not_between":e[e.length]=new t(this.left_key,"lt",[this.right_key[0]],this.key_type,null),e[e.length]=new t(this.left_key,"gt",[this.right_key[1]],this.key_type,null);break;default:e[e.length]=this.clone()}else e[e.length]=this.clone();return e},t.prototype.compareTo=function(e){if(this.criteria&&!e.criteria)return 1;if(!this.criteria&&e.criteria)return-1;if(this.criteria&&e.criteria)return this.criteria.compareTo(e.criteria);if(this.left_key>e.left_key)return 1;if(this.left_key<e.left_key)return-1;if(this.operator>e.operator)return 1;if(this.operator<e.operator)return-1;if(this.key_type>e.key_type)return 1;if(this.key_type<e.key_type)return-1;for(var t=0,n=this.right_key.length;t<n;t+=1){if(this.right_key[t]>e.right_key[t])return 1;if(this.right_key[t]<e.right_key[t])return-1}return 0},e.Condition=t}(this)},{}],9:[function(e,t,n){!function(t){"use strict";var n=e("./Condition.js").Condition,i=function(e,t,n){return{eq:{key:function(i){return r(n,e,"eq",t,"key",[i]),n},value:function(i){return r(n,e,"eq",t,"value",[i]),n}},ne:{key:function(i){return r(n,e,"ne",t,"key",[i]),n},value:function(i){return r(n,e,"ne",t,"value",[i]),n}},lt:{key:function(i){return r(n,e,"lt",t,"key",[i]),n},value:function(i){return r(n,e,"lt",t,"value",[i]),n}},le:{key:function(i){return r(n,e,"le",t,"key",[i]),n},value:function(i){return r(n,e,"le",t,"value",[i]),n}},gt:{key:function(i){return r(n,e,"gt",t,"key",[i]),n},value:function(i){return r(n,e,"gt",t,"value",[i]),n}},ge:{key:function(i){return r(n,e,"ge",t,"key",[i]),n},value:function(i){return r(n,e,"ge",t,"value",[i]),n}},"in":{key:function(){return r(n,e,"in",t,"key",[arguments[0]]),n},value:function(){return r(n,e,"in",t,"value",Array.isArray(arguments[0])?arguments[0]:[].slice.apply(arguments)),n}},not_in:{key:function(){return r(n,e,"not_in",t,"key",[arguments[0]]),n},value:function(){return r(n,e,"not_in",t,"value",Array.isArray(arguments[0])?arguments[0]:[].slice.apply(arguments)),n}},between:function(i,o){return r(n,e,"between",t,"value",[i,o]),n},not_between:function(i,o){return r(n,e,"not_between",t,"value",[i,o]),n},match:function(i){var o=i instanceof RegExp?i:null===i?null:void 0===i?void 0:""===i?"":new RegExp(i);return r(n,e,"match",t,"value",[o]),n},not_match:function(i){var o=i instanceof RegExp?i:null===i?null:void 0===i?void 0:""===i?"":new RegExp(i);return r(n,e,"not_match",t,"value",[o]),n}}},r=function(e,t,i,r,o,a){if("and"===t.toLowerCase())e.addAnd(new n(r,i,a,o,null));else{if("or"!==t.toLowerCase())throw new Error("invalid type: "+t+"(at key_name:"+r+", key_type: "+o+", operator:"+i+")");e.addOr(new n(r,i,a,o,null))}};t.evaluation=i}(this)},{"./Condition.js":8}],10:[function(e,t,n){!function(e){"use strict";var t=function(e,t){for(var n=t.split("."),i=e,r=0,o=n.length;r<o;r+=1){if("string"==typeof i||i instanceof String||"number"==typeof i||i instanceof Number)return;if(!(n[r]in i))return;i=i[n[r]]}return i};e.getProperty=t}(this)},{}],11:[function(e,t,n){!function(e,t){"use strict";var n=function(e){this._target=e,this._q="'",this._keys=[]};n.prototype.toString=function(){for(var e=this._target,t=this._keys,n=this._q,i=0,r=t.length;i<r;i+=1)e=e+"["+n+t[i]+n+"]";return e},n.prototype.setQuote=function(e){r(e)&&(this._q=e)},n.prototype.add=function(e){this._keys[this._keys.length]=e};var i=function(e,t,i){var o=new n(e);if(i&&r(i.q)&&o.setQuote(i.q),Array.isArray(t))for(var a=0,s=t.length;a<s;a+=1)o.add(t[a]);else o.add(t);return o},r=function(e){return"string"==typeof e||e instanceof String};t.keysReference=i}((0,eval)("this"),this)},{}],12:[function(e,t,n){!function(e){"use strict";var t=function(e,t){if(0===t.length)return!0;for(var n=0,i=t.length;n<i;n+=1)if(0===e.indexOf(t[n]+"."))return!0;return!1};e.matchPrefix=t}(this)},{}]},{},[1]);
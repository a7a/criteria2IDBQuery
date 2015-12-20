!function(e){"use strict";var t=require("kriteria").Kriteria||(0,eval)("this").Kriteria,a=require("./IndexAggregator.js").IndexAggregator,l=function(e,l,h){var d=new a,g=0,k=0,o=0,y=0,v=0,p=0,f="",u=[];for(d.init(l,h),g=0,k=e.length;k>g;g+=1){var x=e[g],c=d.clone(),s={store:l[0],method:null,keypath:null,value1:null,value2:null,filter:t.parse({and:x.conditions}).matcher()},m=n(c,x);if(0===m.length)u[u.length]=s;else{var b=[],q=[[],[]],w=[],B=[],A=0;for(o=0,y=m.length;y>o;o+=1){var I=m[o].index,K=[];for(A=l[I],b=[],q=[[],[]],B=[],w=[],v=0,p=x.conditions.length;p>v;v+=1){var P=x.conditions[v],j=A.keyPath.indexOf(P.left_key);~j&&i(P,j,K)}for(f in K)_(K[f],f,{method:w,value:q,method_level:B,target_keypath:b});if(!r(w))break}if(o===m.length&&(b=[],q=[[],[]],B=[],w=[]),w.length>0){var C=[],F=0;for(v=0,p=w.length;p>v;v+=1)void 0!==w[v]&&B[v]>F&&(C=w[v].concat(),F=B[v]);u[u.length]={store:A,method:C,keypath:b,value1:q[0],value2:q[1],filter:t.parse({and:x.conditions}).matcher()}}else u[u.length]=s}}return u},n=function(e,t){for(var a=0,l=t.keys.length;l>a;a+=1)for(var n=0,i=t.conditions.length;i>n;n+=1){var _=t.conditions[n].operator;t.conditions[n].left_key===t.keys[a]&&"value"===t.conditions[n].key_type&&"ne"!==_&&"match"!==_&&"not_match"!==_&&e.calc(t.keys[a])}return e.getResult()},i=function(e,t,a){var l=e.left_key;switch(a[l]||(a[l]={keypath_index:t,val1:null,val2:null,flg_eq:!1,flg_lt:!1,flg_le:!1,flg_gt:!1,flg_ge:!1}),e.operator){case"eq":a[l].flg_eq=!0,a[l].flg_lt=!1,a[l].flg_le=!1,a[l].flg_gt=!1,a[l].flg_ge=!1,a[l].val1=e.right_key[0],a[l].val2=e.right_key[0];break;case"ne":break;case"lt":a[l].flg_eq||(a[l].flg_lt=!0,(null===a[l].val2||a[l].val2>e.right_key[0])&&(a[l].val2=e.right_key[0]));break;case"le":a[l].flg_eq||(a[l].flg_le=!0,a[l].flg_lt=!1,(null===a[l].val2||a[l].val2>e.right_key[0])&&(a[l].val2=e.right_key[0]));break;case"gt":a[l].flg_eq||(a[l].flg_gt=!0,(null===a[l].val1||a[l].val1<e.right_key[0])&&(a[l].val1=e.right_key[0]));break;case"ge":a[l].flg_eq||(a[l].flg_ge=!0,a[l].flg_gt=!1,(null===a[l].val1||a[l].val1<e.right_key[0])&&(a[l].val1=e.right_key[0]));break;case"match":case"not_match":}},_=function(e,t,a){var l=a.method,n=a.value,i=a.method_level,_=a.target_keypath;e.keypath_index>=0&&(void 0===i[e.keypath_index]&&(i[e.keypath_index]=0),e.flg_ge?e.flg_le?(l[e.keypath_index]=["bound",!1,!1],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):e.flg_lt?(l[e.keypath_index]=["bound",!0,!1],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):i[e.keypath_index]<=1&&(l[e.keypath_index]=["lowerBound",!1],n[1][e.keypath_index]=e.val1,i[e.keypath_index]=3):e.flg_gt?e.flg_le?(l[e.keypath_index]=["bound",!1,!0],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):e.flg_lt?(l[e.keypath_index]=["bound",!0,!0],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=2):i[e.keypath_index]<=1&&(l[e.keypath_index]=["lowerBound",!0],n[1][e.keypath_index]=e.val1,i[e.keypath_index]=3):e.flg_le?(l[e.keypath_index]=["upperBound",!1],n[0][e.keypath_index]=e.val2,i[e.keypath_index]=3):e.flg_lt?(l[e.keypath_index]=["upperBound",!0],n[0][e.keypath_index]=e.val2,i[e.keypath_index]=3):e.flg_eq&&(l[e.keypath_index]=["only"],n[0][e.keypath_index]=e.val1,n[1][e.keypath_index]=e.val2,i[e.keypath_index]=1),_[e.keypath_index]=t)},r=function(e){for(var t=!1,a=!1,l=0,n=e.length;n>l;l+=1)switch(e[l][0]){case"lowerBound":t=!0;break;case"upperBound":a=!0}return t&&a?!0:!1};e.createQueryParameterFromConditionsAndIndices=l}(this);
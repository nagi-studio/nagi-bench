var Hv=Object.defineProperty;var Vv=(s,e,t)=>e in s?Hv(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var ke=(s,e,t)=>Vv(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const u of l.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&r(u)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();function Eg(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var zu={exports:{}},qo={},ku={exports:{}},ht={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tm;function Gv(){if(tm)return ht;tm=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),u=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),d=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),p=Symbol.for("react.lazy"),g=Symbol.iterator;function v(U){return U===null||typeof U!="object"?null:(U=g&&U[g]||U["@@iterator"],typeof U=="function"?U:null)}var y={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},S=Object.assign,E={};function M(U,ie,Ie){this.props=U,this.context=ie,this.refs=E,this.updater=Ie||y}M.prototype.isReactComponent={},M.prototype.setState=function(U,ie){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,ie,"setState")},M.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function x(){}x.prototype=M.prototype;function D(U,ie,Ie){this.props=U,this.context=ie,this.refs=E,this.updater=Ie||y}var L=D.prototype=new x;L.constructor=D,S(L,M.prototype),L.isPureReactComponent=!0;var A=Array.isArray,q=Object.prototype.hasOwnProperty,N={current:null},F={key:!0,ref:!0,__self:!0,__source:!0};function V(U,ie,Ie){var Q,fe={},Se=null,_e=null;if(ie!=null)for(Q in ie.ref!==void 0&&(_e=ie.ref),ie.key!==void 0&&(Se=""+ie.key),ie)q.call(ie,Q)&&!F.hasOwnProperty(Q)&&(fe[Q]=ie[Q]);var Te=arguments.length-2;if(Te===1)fe.children=Ie;else if(1<Te){for(var Ue=Array(Te),Qe=0;Qe<Te;Qe++)Ue[Qe]=arguments[Qe+2];fe.children=Ue}if(U&&U.defaultProps)for(Q in Te=U.defaultProps,Te)fe[Q]===void 0&&(fe[Q]=Te[Q]);return{$$typeof:s,type:U,key:Se,ref:_e,props:fe,_owner:N.current}}function b(U,ie){return{$$typeof:s,type:U.type,key:ie,ref:U.ref,props:U.props,_owner:U._owner}}function C(U){return typeof U=="object"&&U!==null&&U.$$typeof===s}function z(U){var ie={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(Ie){return ie[Ie]})}var ne=/\/+/g;function K(U,ie){return typeof U=="object"&&U!==null&&U.key!=null?z(""+U.key):ie.toString(36)}function ae(U,ie,Ie,Q,fe){var Se=typeof U;(Se==="undefined"||Se==="boolean")&&(U=null);var _e=!1;if(U===null)_e=!0;else switch(Se){case"string":case"number":_e=!0;break;case"object":switch(U.$$typeof){case s:case e:_e=!0}}if(_e)return _e=U,fe=fe(_e),U=Q===""?"."+K(_e,0):Q,A(fe)?(Ie="",U!=null&&(Ie=U.replace(ne,"$&/")+"/"),ae(fe,ie,Ie,"",function(Qe){return Qe})):fe!=null&&(C(fe)&&(fe=b(fe,Ie+(!fe.key||_e&&_e.key===fe.key?"":(""+fe.key).replace(ne,"$&/")+"/")+U)),ie.push(fe)),1;if(_e=0,Q=Q===""?".":Q+":",A(U))for(var Te=0;Te<U.length;Te++){Se=U[Te];var Ue=Q+K(Se,Te);_e+=ae(Se,ie,Ie,Ue,fe)}else if(Ue=v(U),typeof Ue=="function")for(U=Ue.call(U),Te=0;!(Se=U.next()).done;)Se=Se.value,Ue=Q+K(Se,Te++),_e+=ae(Se,ie,Ie,Ue,fe);else if(Se==="object")throw ie=String(U),Error("Objects are not valid as a React child (found: "+(ie==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":ie)+"). If you meant to render a collection of children, use an array instead.");return _e}function ue(U,ie,Ie){if(U==null)return U;var Q=[],fe=0;return ae(U,Q,"","",function(Se){return ie.call(Ie,Se,fe++)}),Q}function oe(U){if(U._status===-1){var ie=U._result;ie=ie(),ie.then(function(Ie){(U._status===0||U._status===-1)&&(U._status=1,U._result=Ie)},function(Ie){(U._status===0||U._status===-1)&&(U._status=2,U._result=Ie)}),U._status===-1&&(U._status=0,U._result=ie)}if(U._status===1)return U._result.default;throw U._result}var ce={current:null},k={transition:null},le={ReactCurrentDispatcher:ce,ReactCurrentBatchConfig:k,ReactCurrentOwner:N};function se(){throw Error("act(...) is not supported in production builds of React.")}return ht.Children={map:ue,forEach:function(U,ie,Ie){ue(U,function(){ie.apply(this,arguments)},Ie)},count:function(U){var ie=0;return ue(U,function(){ie++}),ie},toArray:function(U){return ue(U,function(ie){return ie})||[]},only:function(U){if(!C(U))throw Error("React.Children.only expected to receive a single React element child.");return U}},ht.Component=M,ht.Fragment=t,ht.Profiler=a,ht.PureComponent=D,ht.StrictMode=r,ht.Suspense=d,ht.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=le,ht.act=se,ht.cloneElement=function(U,ie,Ie){if(U==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+U+".");var Q=S({},U.props),fe=U.key,Se=U.ref,_e=U._owner;if(ie!=null){if(ie.ref!==void 0&&(Se=ie.ref,_e=N.current),ie.key!==void 0&&(fe=""+ie.key),U.type&&U.type.defaultProps)var Te=U.type.defaultProps;for(Ue in ie)q.call(ie,Ue)&&!F.hasOwnProperty(Ue)&&(Q[Ue]=ie[Ue]===void 0&&Te!==void 0?Te[Ue]:ie[Ue])}var Ue=arguments.length-2;if(Ue===1)Q.children=Ie;else if(1<Ue){Te=Array(Ue);for(var Qe=0;Qe<Ue;Qe++)Te[Qe]=arguments[Qe+2];Q.children=Te}return{$$typeof:s,type:U.type,key:fe,ref:Se,props:Q,_owner:_e}},ht.createContext=function(U){return U={$$typeof:u,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},U.Provider={$$typeof:l,_context:U},U.Consumer=U},ht.createElement=V,ht.createFactory=function(U){var ie=V.bind(null,U);return ie.type=U,ie},ht.createRef=function(){return{current:null}},ht.forwardRef=function(U){return{$$typeof:f,render:U}},ht.isValidElement=C,ht.lazy=function(U){return{$$typeof:p,_payload:{_status:-1,_result:U},_init:oe}},ht.memo=function(U,ie){return{$$typeof:m,type:U,compare:ie===void 0?null:ie}},ht.startTransition=function(U){var ie=k.transition;k.transition={};try{U()}finally{k.transition=ie}},ht.unstable_act=se,ht.useCallback=function(U,ie){return ce.current.useCallback(U,ie)},ht.useContext=function(U){return ce.current.useContext(U)},ht.useDebugValue=function(){},ht.useDeferredValue=function(U){return ce.current.useDeferredValue(U)},ht.useEffect=function(U,ie){return ce.current.useEffect(U,ie)},ht.useId=function(){return ce.current.useId()},ht.useImperativeHandle=function(U,ie,Ie){return ce.current.useImperativeHandle(U,ie,Ie)},ht.useInsertionEffect=function(U,ie){return ce.current.useInsertionEffect(U,ie)},ht.useLayoutEffect=function(U,ie){return ce.current.useLayoutEffect(U,ie)},ht.useMemo=function(U,ie){return ce.current.useMemo(U,ie)},ht.useReducer=function(U,ie,Ie){return ce.current.useReducer(U,ie,Ie)},ht.useRef=function(U){return ce.current.useRef(U)},ht.useState=function(U){return ce.current.useState(U)},ht.useSyncExternalStore=function(U,ie,Ie){return ce.current.useSyncExternalStore(U,ie,Ie)},ht.useTransition=function(){return ce.current.useTransition()},ht.version="18.3.1",ht}var nm;function yh(){return nm||(nm=1,ku.exports=Gv()),ku.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var im;function Wv(){if(im)return qo;im=1;var s=yh(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function u(f,d,m){var p,g={},v=null,y=null;m!==void 0&&(v=""+m),d.key!==void 0&&(v=""+d.key),d.ref!==void 0&&(y=d.ref);for(p in d)r.call(d,p)&&!l.hasOwnProperty(p)&&(g[p]=d[p]);if(f&&f.defaultProps)for(p in d=f.defaultProps,d)g[p]===void 0&&(g[p]=d[p]);return{$$typeof:e,type:f,key:v,ref:y,props:g,_owner:a.current}}return qo.Fragment=t,qo.jsx=u,qo.jsxs=u,qo}var rm;function Xv(){return rm||(rm=1,zu.exports=Wv()),zu.exports}var Ae=Xv(),oi=yh();const jv=Eg(oi);var ml={},Bu={exports:{}},Nn={},Hu={exports:{}},Vu={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var sm;function Yv(){return sm||(sm=1,(function(s){function e(k,le){var se=k.length;k.push(le);e:for(;0<se;){var U=se-1>>>1,ie=k[U];if(0<a(ie,le))k[U]=le,k[se]=ie,se=U;else break e}}function t(k){return k.length===0?null:k[0]}function r(k){if(k.length===0)return null;var le=k[0],se=k.pop();if(se!==le){k[0]=se;e:for(var U=0,ie=k.length,Ie=ie>>>1;U<Ie;){var Q=2*(U+1)-1,fe=k[Q],Se=Q+1,_e=k[Se];if(0>a(fe,se))Se<ie&&0>a(_e,fe)?(k[U]=_e,k[Se]=se,U=Se):(k[U]=fe,k[Q]=se,U=Q);else if(Se<ie&&0>a(_e,se))k[U]=_e,k[Se]=se,U=Se;else break e}}return le}function a(k,le){var se=k.sortIndex-le.sortIndex;return se!==0?se:k.id-le.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var u=Date,f=u.now();s.unstable_now=function(){return u.now()-f}}var d=[],m=[],p=1,g=null,v=3,y=!1,S=!1,E=!1,M=typeof setTimeout=="function"?setTimeout:null,x=typeof clearTimeout=="function"?clearTimeout:null,D=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function L(k){for(var le=t(m);le!==null;){if(le.callback===null)r(m);else if(le.startTime<=k)r(m),le.sortIndex=le.expirationTime,e(d,le);else break;le=t(m)}}function A(k){if(E=!1,L(k),!S)if(t(d)!==null)S=!0,oe(q);else{var le=t(m);le!==null&&ce(A,le.startTime-k)}}function q(k,le){S=!1,E&&(E=!1,x(V),V=-1),y=!0;var se=v;try{for(L(le),g=t(d);g!==null&&(!(g.expirationTime>le)||k&&!z());){var U=g.callback;if(typeof U=="function"){g.callback=null,v=g.priorityLevel;var ie=U(g.expirationTime<=le);le=s.unstable_now(),typeof ie=="function"?g.callback=ie:g===t(d)&&r(d),L(le)}else r(d);g=t(d)}if(g!==null)var Ie=!0;else{var Q=t(m);Q!==null&&ce(A,Q.startTime-le),Ie=!1}return Ie}finally{g=null,v=se,y=!1}}var N=!1,F=null,V=-1,b=5,C=-1;function z(){return!(s.unstable_now()-C<b)}function ne(){if(F!==null){var k=s.unstable_now();C=k;var le=!0;try{le=F(!0,k)}finally{le?K():(N=!1,F=null)}}else N=!1}var K;if(typeof D=="function")K=function(){D(ne)};else if(typeof MessageChannel<"u"){var ae=new MessageChannel,ue=ae.port2;ae.port1.onmessage=ne,K=function(){ue.postMessage(null)}}else K=function(){M(ne,0)};function oe(k){F=k,N||(N=!0,K())}function ce(k,le){V=M(function(){k(s.unstable_now())},le)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(k){k.callback=null},s.unstable_continueExecution=function(){S||y||(S=!0,oe(q))},s.unstable_forceFrameRate=function(k){0>k||125<k?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):b=0<k?Math.floor(1e3/k):5},s.unstable_getCurrentPriorityLevel=function(){return v},s.unstable_getFirstCallbackNode=function(){return t(d)},s.unstable_next=function(k){switch(v){case 1:case 2:case 3:var le=3;break;default:le=v}var se=v;v=le;try{return k()}finally{v=se}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(k,le){switch(k){case 1:case 2:case 3:case 4:case 5:break;default:k=3}var se=v;v=k;try{return le()}finally{v=se}},s.unstable_scheduleCallback=function(k,le,se){var U=s.unstable_now();switch(typeof se=="object"&&se!==null?(se=se.delay,se=typeof se=="number"&&0<se?U+se:U):se=U,k){case 1:var ie=-1;break;case 2:ie=250;break;case 5:ie=1073741823;break;case 4:ie=1e4;break;default:ie=5e3}return ie=se+ie,k={id:p++,callback:le,priorityLevel:k,startTime:se,expirationTime:ie,sortIndex:-1},se>U?(k.sortIndex=se,e(m,k),t(d)===null&&k===t(m)&&(E?(x(V),V=-1):E=!0,ce(A,se-U))):(k.sortIndex=ie,e(d,k),S||y||(S=!0,oe(q))),k},s.unstable_shouldYield=z,s.unstable_wrapCallback=function(k){var le=v;return function(){var se=v;v=le;try{return k.apply(this,arguments)}finally{v=se}}}})(Vu)),Vu}var om;function qv(){return om||(om=1,Hu.exports=Yv()),Hu.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var am;function $v(){if(am)return Nn;am=1;var s=yh(),e=qv();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,o=1;o<arguments.length;o++)i+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,a={};function l(n,i){u(n,i),u(n+"Capture",i)}function u(n,i){for(a[n]=i,n=0;n<i.length;n++)r.add(i[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),d=Object.prototype.hasOwnProperty,m=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,p={},g={};function v(n){return d.call(g,n)?!0:d.call(p,n)?!1:m.test(n)?g[n]=!0:(p[n]=!0,!1)}function y(n,i,o,c){if(o!==null&&o.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return c?!1:o!==null?!o.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function S(n,i,o,c){if(i===null||typeof i>"u"||y(n,i,o,c))return!0;if(c)return!1;if(o!==null)switch(o.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function E(n,i,o,c,h,_,w){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=c,this.attributeNamespace=h,this.mustUseProperty=o,this.propertyName=n,this.type=i,this.sanitizeURL=_,this.removeEmptyString=w}var M={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){M[n]=new E(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];M[i]=new E(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){M[n]=new E(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){M[n]=new E(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){M[n]=new E(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){M[n]=new E(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){M[n]=new E(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){M[n]=new E(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){M[n]=new E(n,5,!1,n.toLowerCase(),null,!1,!1)});var x=/[\-:]([a-z])/g;function D(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(x,D);M[i]=new E(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(x,D);M[i]=new E(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(x,D);M[i]=new E(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){M[n]=new E(n,1,!1,n.toLowerCase(),null,!1,!1)}),M.xlinkHref=new E("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){M[n]=new E(n,1,!1,n.toLowerCase(),null,!0,!0)});function L(n,i,o,c){var h=M.hasOwnProperty(i)?M[i]:null;(h!==null?h.type!==0:c||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(S(i,o,h,c)&&(o=null),c||h===null?v(i)&&(o===null?n.removeAttribute(i):n.setAttribute(i,""+o)):h.mustUseProperty?n[h.propertyName]=o===null?h.type===3?!1:"":o:(i=h.attributeName,c=h.attributeNamespace,o===null?n.removeAttribute(i):(h=h.type,o=h===3||h===4&&o===!0?"":""+o,c?n.setAttributeNS(c,i,o):n.setAttribute(i,o))))}var A=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,q=Symbol.for("react.element"),N=Symbol.for("react.portal"),F=Symbol.for("react.fragment"),V=Symbol.for("react.strict_mode"),b=Symbol.for("react.profiler"),C=Symbol.for("react.provider"),z=Symbol.for("react.context"),ne=Symbol.for("react.forward_ref"),K=Symbol.for("react.suspense"),ae=Symbol.for("react.suspense_list"),ue=Symbol.for("react.memo"),oe=Symbol.for("react.lazy"),ce=Symbol.for("react.offscreen"),k=Symbol.iterator;function le(n){return n===null||typeof n!="object"?null:(n=k&&n[k]||n["@@iterator"],typeof n=="function"?n:null)}var se=Object.assign,U;function ie(n){if(U===void 0)try{throw Error()}catch(o){var i=o.stack.trim().match(/\n( *(at )?)/);U=i&&i[1]||""}return`
`+U+n}var Ie=!1;function Q(n,i){if(!n||Ie)return"";Ie=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(J){var c=J}Reflect.construct(n,[],i)}else{try{i.call()}catch(J){c=J}n.call(i.prototype)}else{try{throw Error()}catch(J){c=J}n()}}catch(J){if(J&&c&&typeof J.stack=="string"){for(var h=J.stack.split(`
`),_=c.stack.split(`
`),w=h.length-1,I=_.length-1;1<=w&&0<=I&&h[w]!==_[I];)I--;for(;1<=w&&0<=I;w--,I--)if(h[w]!==_[I]){if(w!==1||I!==1)do if(w--,I--,0>I||h[w]!==_[I]){var O=`
`+h[w].replace(" at new "," at ");return n.displayName&&O.includes("<anonymous>")&&(O=O.replace("<anonymous>",n.displayName)),O}while(1<=w&&0<=I);break}}}finally{Ie=!1,Error.prepareStackTrace=o}return(n=n?n.displayName||n.name:"")?ie(n):""}function fe(n){switch(n.tag){case 5:return ie(n.type);case 16:return ie("Lazy");case 13:return ie("Suspense");case 19:return ie("SuspenseList");case 0:case 2:case 15:return n=Q(n.type,!1),n;case 11:return n=Q(n.type.render,!1),n;case 1:return n=Q(n.type,!0),n;default:return""}}function Se(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case F:return"Fragment";case N:return"Portal";case b:return"Profiler";case V:return"StrictMode";case K:return"Suspense";case ae:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case z:return(n.displayName||"Context")+".Consumer";case C:return(n._context.displayName||"Context")+".Provider";case ne:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case ue:return i=n.displayName||null,i!==null?i:Se(n.type)||"Memo";case oe:i=n._payload,n=n._init;try{return Se(n(i))}catch{}}return null}function _e(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Se(i);case 8:return i===V?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Te(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Ue(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Qe(n){var i=Ue(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),c=""+n[i];if(!n.hasOwnProperty(i)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var h=o.get,_=o.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return h.call(this)},set:function(w){c=""+w,_.call(this,w)}}),Object.defineProperty(n,i,{enumerable:o.enumerable}),{getValue:function(){return c},setValue:function(w){c=""+w},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function Pt(n){n._valueTracker||(n._valueTracker=Qe(n))}function pt(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var o=i.getValue(),c="";return n&&(c=Ue(n)?n.checked?"true":"false":n.value),n=c,n!==o?(i.setValue(n),!0):!1}function Nt(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function X(n,i){var o=i.checked;return se({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??n._wrapperState.initialChecked})}function Mn(n,i){var o=i.defaultValue==null?"":i.defaultValue,c=i.checked!=null?i.checked:i.defaultChecked;o=Te(i.value!=null?i.value:o),n._wrapperState={initialChecked:c,initialValue:o,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function dt(n,i){i=i.checked,i!=null&&L(n,"checked",i,!1)}function ut(n,i){dt(n,i);var o=Te(i.value),c=i.type;if(o!=null)c==="number"?(o===0&&n.value===""||n.value!=o)&&(n.value=""+o):n.value!==""+o&&(n.value=""+o);else if(c==="submit"||c==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?Ct(n,i.type,o):i.hasOwnProperty("defaultValue")&&Ct(n,i.type,Te(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function $e(n,i,o){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var c=i.type;if(!(c!=="submit"&&c!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,o||i===n.value||(n.value=i),n.defaultValue=i}o=n.name,o!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,o!==""&&(n.name=o)}function Ct(n,i,o){(i!=="number"||Nt(n.ownerDocument)!==n)&&(o==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+o&&(n.defaultValue=""+o))}var qe=Array.isArray;function P(n,i,o,c){if(n=n.options,i){i={};for(var h=0;h<o.length;h++)i["$"+o[h]]=!0;for(o=0;o<n.length;o++)h=i.hasOwnProperty("$"+n[o].value),n[o].selected!==h&&(n[o].selected=h),h&&c&&(n[o].defaultSelected=!0)}else{for(o=""+Te(o),i=null,h=0;h<n.length;h++){if(n[h].value===o){n[h].selected=!0,c&&(n[h].defaultSelected=!0);return}i!==null||n[h].disabled||(i=n[h])}i!==null&&(i.selected=!0)}}function T(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return se({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Z(n,i){var o=i.value;if(o==null){if(o=i.children,i=i.defaultValue,o!=null){if(i!=null)throw Error(t(92));if(qe(o)){if(1<o.length)throw Error(t(93));o=o[0]}i=o}i==null&&(i=""),o=i}n._wrapperState={initialValue:Te(o)}}function pe(n,i){var o=Te(i.value),c=Te(i.defaultValue);o!=null&&(o=""+o,o!==n.value&&(n.value=o),i.defaultValue==null&&n.defaultValue!==o&&(n.defaultValue=o)),c!=null&&(n.defaultValue=""+c)}function ge(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function he(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ge(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?he(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Re,Ne=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,o,c,h){MSApp.execUnsafeLocalFunction(function(){return n(i,o,c,h)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(Re=Re||document.createElement("div"),Re.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=Re.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function ct(n,i){if(i){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=i;return}}n.textContent=i}var ye={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Oe=["Webkit","ms","Moz","O"];Object.keys(ye).forEach(function(n){Oe.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),ye[i]=ye[n]})});function Je(n,i,o){return i==null||typeof i=="boolean"||i===""?"":o||typeof i!="number"||i===0||ye.hasOwnProperty(n)&&ye[n]?(""+i).trim():i+"px"}function et(n,i){n=n.style;for(var o in i)if(i.hasOwnProperty(o)){var c=o.indexOf("--")===0,h=Je(o,i[o],c);o==="float"&&(o="cssFloat"),c?n.setProperty(o,h):n[o]=h}}var ze=se({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ft(n,i){if(i){if(ze[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function rt(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Rt=null;function H(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Ce=null,re=null,de=null;function Le(n){if(n=Io(n)){if(typeof Ce!="function")throw Error(t(280));var i=n.stateNode;i&&(i=Pa(i),Ce(n.stateNode,n.type,i))}}function Pe(n){re?de?de.push(n):de=[n]:re=n}function st(){if(re){var n=re,i=de;if(de=re=null,Le(n),i)for(n=0;n<i.length;n++)Le(i[n])}}function Ot(n,i){return n(i)}function Kt(){}var yt=!1;function Cn(n,i,o){if(yt)return n(i,o);yt=!0;try{return Ot(n,i,o)}finally{yt=!1,(re!==null||de!==null)&&(Kt(),st())}}function Sn(n,i){var o=n.stateNode;if(o===null)return null;var c=Pa(o);if(c===null)return null;o=c[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(c=!c.disabled)||(n=n.type,c=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!c;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(t(231,i,typeof o));return o}var gs=!1;if(f)try{var ir={};Object.defineProperty(ir,"passive",{get:function(){gs=!0}}),window.addEventListener("test",ir,ir),window.removeEventListener("test",ir,ir)}catch{gs=!1}function Fi(n,i,o,c,h,_,w,I,O){var J=Array.prototype.slice.call(arguments,3);try{i.apply(o,J)}catch(ve){this.onError(ve)}}var Oi=!1,zr=null,kr=!1,rr=null,ua={onError:function(n){Oi=!0,zr=n}};function vs(n,i,o,c,h,_,w,I,O){Oi=!1,zr=null,Fi.apply(ua,arguments)}function fa(n,i,o,c,h,_,w,I,O){if(vs.apply(this,arguments),Oi){if(Oi){var J=zr;Oi=!1,zr=null}else throw Error(t(198));kr||(kr=!0,rr=J)}}function Si(n){var i=n,o=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(o=i.return),n=i.return;while(n)}return i.tag===3?o:null}function ha(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function da(n){if(Si(n)!==n)throw Error(t(188))}function oc(n){var i=n.alternate;if(!i){if(i=Si(n),i===null)throw Error(t(188));return i!==n?null:n}for(var o=n,c=i;;){var h=o.return;if(h===null)break;var _=h.alternate;if(_===null){if(c=h.return,c!==null){o=c;continue}break}if(h.child===_.child){for(_=h.child;_;){if(_===o)return da(h),n;if(_===c)return da(h),i;_=_.sibling}throw Error(t(188))}if(o.return!==c.return)o=h,c=_;else{for(var w=!1,I=h.child;I;){if(I===o){w=!0,o=h,c=_;break}if(I===c){w=!0,c=h,o=_;break}I=I.sibling}if(!w){for(I=_.child;I;){if(I===o){w=!0,o=_,c=h;break}if(I===c){w=!0,c=_,o=h;break}I=I.sibling}if(!w)throw Error(t(189))}}if(o.alternate!==c)throw Error(t(190))}if(o.tag!==3)throw Error(t(188));return o.stateNode.current===o?n:i}function R(n){return n=oc(n),n!==null?G(n):null}function G(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=G(n);if(i!==null)return i;n=n.sibling}return null}var ee=e.unstable_scheduleCallback,te=e.unstable_cancelCallback,W=e.unstable_shouldYield,we=e.unstable_requestPaint,Me=e.unstable_now,We=e.unstable_getCurrentPriorityLevel,He=e.unstable_ImmediatePriority,tt=e.unstable_UserBlockingPriority,it=e.unstable_NormalPriority,Xe=e.unstable_LowPriority,gt=e.unstable_IdlePriority,Tt=null,mt=null;function dn(n){if(mt&&typeof mt.onCommitFiberRoot=="function")try{mt.onCommitFiberRoot(Tt,n,void 0,(n.current.flags&128)===128)}catch{}}var ot=Math.clz32?Math.clz32:Et,Ye=Math.log,ai=Math.LN2;function Et(n){return n>>>=0,n===0?32:31-(Ye(n)/ai|0)|0}var pn=64,li=4194304;function Zt(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Ei(n,i){var o=n.pendingLanes;if(o===0)return 0;var c=0,h=n.suspendedLanes,_=n.pingedLanes,w=o&268435455;if(w!==0){var I=w&~h;I!==0?c=Zt(I):(_&=w,_!==0&&(c=Zt(_)))}else w=o&~h,w!==0?c=Zt(w):_!==0&&(c=Zt(_));if(c===0)return 0;if(i!==0&&i!==c&&(i&h)===0&&(h=c&-c,_=i&-i,h>=_||h===16&&(_&4194240)!==0))return i;if((c&4)!==0&&(c|=o&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=c;0<i;)o=31-ot(i),h=1<<o,c|=n[o],i&=~h;return c}function It(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Zn(n,i){for(var o=n.suspendedLanes,c=n.pingedLanes,h=n.expirationTimes,_=n.pendingLanes;0<_;){var w=31-ot(_),I=1<<w,O=h[w];O===-1?((I&o)===0||(I&c)!==0)&&(h[w]=It(I,i)):O<=i&&(n.expiredLanes|=I),_&=~I}}function zi(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function En(){var n=pn;return pn<<=1,(pn&4194240)===0&&(pn=64),n}function Qn(n){for(var i=[],o=0;31>o;o++)i.push(n);return i}function bn(n,i,o){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-ot(i),n[i]=o}function pa(n,i){var o=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var c=n.eventTimes;for(n=n.expirationTimes;0<o;){var h=31-ot(o),_=1<<h;i[h]=0,c[h]=-1,n[h]=-1,o&=~_}}function ac(n,i){var o=n.entangledLanes|=i;for(n=n.entanglements;o;){var c=31-ot(o),h=1<<c;h&i|n[c]&i&&(n[c]|=i),o&=~h}}var bt=0;function Ih(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Uh,lc,Nh,Fh,Oh,cc=!1,ma=[],sr=null,or=null,ar=null,vo=new Map,_o=new Map,lr=[],c0="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function zh(n,i){switch(n){case"focusin":case"focusout":sr=null;break;case"dragenter":case"dragleave":or=null;break;case"mouseover":case"mouseout":ar=null;break;case"pointerover":case"pointerout":vo.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":_o.delete(i.pointerId)}}function xo(n,i,o,c,h,_){return n===null||n.nativeEvent!==_?(n={blockedOn:i,domEventName:o,eventSystemFlags:c,nativeEvent:_,targetContainers:[h]},i!==null&&(i=Io(i),i!==null&&lc(i)),n):(n.eventSystemFlags|=c,i=n.targetContainers,h!==null&&i.indexOf(h)===-1&&i.push(h),n)}function u0(n,i,o,c,h){switch(i){case"focusin":return sr=xo(sr,n,i,o,c,h),!0;case"dragenter":return or=xo(or,n,i,o,c,h),!0;case"mouseover":return ar=xo(ar,n,i,o,c,h),!0;case"pointerover":var _=h.pointerId;return vo.set(_,xo(vo.get(_)||null,n,i,o,c,h)),!0;case"gotpointercapture":return _=h.pointerId,_o.set(_,xo(_o.get(_)||null,n,i,o,c,h)),!0}return!1}function kh(n){var i=Br(n.target);if(i!==null){var o=Si(i);if(o!==null){if(i=o.tag,i===13){if(i=ha(o),i!==null){n.blockedOn=i,Oh(n.priority,function(){Nh(o)});return}}else if(i===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function ga(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var o=fc(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(o===null){o=n.nativeEvent;var c=new o.constructor(o.type,o);Rt=c,o.target.dispatchEvent(c),Rt=null}else return i=Io(o),i!==null&&lc(i),n.blockedOn=o,!1;i.shift()}return!0}function Bh(n,i,o){ga(n)&&o.delete(i)}function f0(){cc=!1,sr!==null&&ga(sr)&&(sr=null),or!==null&&ga(or)&&(or=null),ar!==null&&ga(ar)&&(ar=null),vo.forEach(Bh),_o.forEach(Bh)}function yo(n,i){n.blockedOn===i&&(n.blockedOn=null,cc||(cc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,f0)))}function Mo(n){function i(h){return yo(h,n)}if(0<ma.length){yo(ma[0],n);for(var o=1;o<ma.length;o++){var c=ma[o];c.blockedOn===n&&(c.blockedOn=null)}}for(sr!==null&&yo(sr,n),or!==null&&yo(or,n),ar!==null&&yo(ar,n),vo.forEach(i),_o.forEach(i),o=0;o<lr.length;o++)c=lr[o],c.blockedOn===n&&(c.blockedOn=null);for(;0<lr.length&&(o=lr[0],o.blockedOn===null);)kh(o),o.blockedOn===null&&lr.shift()}var _s=A.ReactCurrentBatchConfig,va=!0;function h0(n,i,o,c){var h=bt,_=_s.transition;_s.transition=null;try{bt=1,uc(n,i,o,c)}finally{bt=h,_s.transition=_}}function d0(n,i,o,c){var h=bt,_=_s.transition;_s.transition=null;try{bt=4,uc(n,i,o,c)}finally{bt=h,_s.transition=_}}function uc(n,i,o,c){if(va){var h=fc(n,i,o,c);if(h===null)Cc(n,i,c,_a,o),zh(n,c);else if(u0(h,n,i,o,c))c.stopPropagation();else if(zh(n,c),i&4&&-1<c0.indexOf(n)){for(;h!==null;){var _=Io(h);if(_!==null&&Uh(_),_=fc(n,i,o,c),_===null&&Cc(n,i,c,_a,o),_===h)break;h=_}h!==null&&c.stopPropagation()}else Cc(n,i,c,null,o)}}var _a=null;function fc(n,i,o,c){if(_a=null,n=H(c),n=Br(n),n!==null)if(i=Si(n),i===null)n=null;else if(o=i.tag,o===13){if(n=ha(i),n!==null)return n;n=null}else if(o===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return _a=n,null}function Hh(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(We()){case He:return 1;case tt:return 4;case it:case Xe:return 16;case gt:return 536870912;default:return 16}default:return 16}}var cr=null,hc=null,xa=null;function Vh(){if(xa)return xa;var n,i=hc,o=i.length,c,h="value"in cr?cr.value:cr.textContent,_=h.length;for(n=0;n<o&&i[n]===h[n];n++);var w=o-n;for(c=1;c<=w&&i[o-c]===h[_-c];c++);return xa=h.slice(n,1<c?1-c:void 0)}function ya(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function Ma(){return!0}function Gh(){return!1}function Hn(n){function i(o,c,h,_,w){this._reactName=o,this._targetInst=h,this.type=c,this.nativeEvent=_,this.target=w,this.currentTarget=null;for(var I in n)n.hasOwnProperty(I)&&(o=n[I],this[I]=o?o(_):_[I]);return this.isDefaultPrevented=(_.defaultPrevented!=null?_.defaultPrevented:_.returnValue===!1)?Ma:Gh,this.isPropagationStopped=Gh,this}return se(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=Ma)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=Ma)},persist:function(){},isPersistent:Ma}),i}var xs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},dc=Hn(xs),So=se({},xs,{view:0,detail:0}),p0=Hn(So),pc,mc,Eo,Sa=se({},So,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:vc,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Eo&&(Eo&&n.type==="mousemove"?(pc=n.screenX-Eo.screenX,mc=n.screenY-Eo.screenY):mc=pc=0,Eo=n),pc)},movementY:function(n){return"movementY"in n?n.movementY:mc}}),Wh=Hn(Sa),m0=se({},Sa,{dataTransfer:0}),g0=Hn(m0),v0=se({},So,{relatedTarget:0}),gc=Hn(v0),_0=se({},xs,{animationName:0,elapsedTime:0,pseudoElement:0}),x0=Hn(_0),y0=se({},xs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),M0=Hn(y0),S0=se({},xs,{data:0}),Xh=Hn(S0),E0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},w0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},T0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function A0(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=T0[n])?!!i[n]:!1}function vc(){return A0}var R0=se({},So,{key:function(n){if(n.key){var i=E0[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=ya(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?w0[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:vc,charCode:function(n){return n.type==="keypress"?ya(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?ya(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),C0=Hn(R0),b0=se({},Sa,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),jh=Hn(b0),P0=se({},So,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:vc}),L0=Hn(P0),D0=se({},xs,{propertyName:0,elapsedTime:0,pseudoElement:0}),I0=Hn(D0),U0=se({},Sa,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),N0=Hn(U0),F0=[9,13,27,32],_c=f&&"CompositionEvent"in window,wo=null;f&&"documentMode"in document&&(wo=document.documentMode);var O0=f&&"TextEvent"in window&&!wo,Yh=f&&(!_c||wo&&8<wo&&11>=wo),qh=" ",$h=!1;function Kh(n,i){switch(n){case"keyup":return F0.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Zh(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var ys=!1;function z0(n,i){switch(n){case"compositionend":return Zh(i);case"keypress":return i.which!==32?null:($h=!0,qh);case"textInput":return n=i.data,n===qh&&$h?null:n;default:return null}}function k0(n,i){if(ys)return n==="compositionend"||!_c&&Kh(n,i)?(n=Vh(),xa=hc=cr=null,ys=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return Yh&&i.locale!=="ko"?null:i.data;default:return null}}var B0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Qh(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!B0[n.type]:i==="textarea"}function Jh(n,i,o,c){Pe(c),i=Ra(i,"onChange"),0<i.length&&(o=new dc("onChange","change",null,o,c),n.push({event:o,listeners:i}))}var To=null,Ao=null;function H0(n){vd(n,0)}function Ea(n){var i=Ts(n);if(pt(i))return n}function V0(n,i){if(n==="change")return i}var ed=!1;if(f){var xc;if(f){var yc="oninput"in document;if(!yc){var td=document.createElement("div");td.setAttribute("oninput","return;"),yc=typeof td.oninput=="function"}xc=yc}else xc=!1;ed=xc&&(!document.documentMode||9<document.documentMode)}function nd(){To&&(To.detachEvent("onpropertychange",id),Ao=To=null)}function id(n){if(n.propertyName==="value"&&Ea(Ao)){var i=[];Jh(i,Ao,n,H(n)),Cn(H0,i)}}function G0(n,i,o){n==="focusin"?(nd(),To=i,Ao=o,To.attachEvent("onpropertychange",id)):n==="focusout"&&nd()}function W0(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Ea(Ao)}function X0(n,i){if(n==="click")return Ea(i)}function j0(n,i){if(n==="input"||n==="change")return Ea(i)}function Y0(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var ci=typeof Object.is=="function"?Object.is:Y0;function Ro(n,i){if(ci(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var o=Object.keys(n),c=Object.keys(i);if(o.length!==c.length)return!1;for(c=0;c<o.length;c++){var h=o[c];if(!d.call(i,h)||!ci(n[h],i[h]))return!1}return!0}function rd(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function sd(n,i){var o=rd(n);n=0;for(var c;o;){if(o.nodeType===3){if(c=n+o.textContent.length,n<=i&&c>=i)return{node:o,offset:i-n};n=c}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=rd(o)}}function od(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?od(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function ad(){for(var n=window,i=Nt();i instanceof n.HTMLIFrameElement;){try{var o=typeof i.contentWindow.location.href=="string"}catch{o=!1}if(o)n=i.contentWindow;else break;i=Nt(n.document)}return i}function Mc(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function q0(n){var i=ad(),o=n.focusedElem,c=n.selectionRange;if(i!==o&&o&&o.ownerDocument&&od(o.ownerDocument.documentElement,o)){if(c!==null&&Mc(o)){if(i=c.start,n=c.end,n===void 0&&(n=i),"selectionStart"in o)o.selectionStart=i,o.selectionEnd=Math.min(n,o.value.length);else if(n=(i=o.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var h=o.textContent.length,_=Math.min(c.start,h);c=c.end===void 0?_:Math.min(c.end,h),!n.extend&&_>c&&(h=c,c=_,_=h),h=sd(o,_);var w=sd(o,c);h&&w&&(n.rangeCount!==1||n.anchorNode!==h.node||n.anchorOffset!==h.offset||n.focusNode!==w.node||n.focusOffset!==w.offset)&&(i=i.createRange(),i.setStart(h.node,h.offset),n.removeAllRanges(),_>c?(n.addRange(i),n.extend(w.node,w.offset)):(i.setEnd(w.node,w.offset),n.addRange(i)))}}for(i=[],n=o;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<i.length;o++)n=i[o],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var $0=f&&"documentMode"in document&&11>=document.documentMode,Ms=null,Sc=null,Co=null,Ec=!1;function ld(n,i,o){var c=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;Ec||Ms==null||Ms!==Nt(c)||(c=Ms,"selectionStart"in c&&Mc(c)?c={start:c.selectionStart,end:c.selectionEnd}:(c=(c.ownerDocument&&c.ownerDocument.defaultView||window).getSelection(),c={anchorNode:c.anchorNode,anchorOffset:c.anchorOffset,focusNode:c.focusNode,focusOffset:c.focusOffset}),Co&&Ro(Co,c)||(Co=c,c=Ra(Sc,"onSelect"),0<c.length&&(i=new dc("onSelect","select",null,i,o),n.push({event:i,listeners:c}),i.target=Ms)))}function wa(n,i){var o={};return o[n.toLowerCase()]=i.toLowerCase(),o["Webkit"+n]="webkit"+i,o["Moz"+n]="moz"+i,o}var Ss={animationend:wa("Animation","AnimationEnd"),animationiteration:wa("Animation","AnimationIteration"),animationstart:wa("Animation","AnimationStart"),transitionend:wa("Transition","TransitionEnd")},wc={},cd={};f&&(cd=document.createElement("div").style,"AnimationEvent"in window||(delete Ss.animationend.animation,delete Ss.animationiteration.animation,delete Ss.animationstart.animation),"TransitionEvent"in window||delete Ss.transitionend.transition);function Ta(n){if(wc[n])return wc[n];if(!Ss[n])return n;var i=Ss[n],o;for(o in i)if(i.hasOwnProperty(o)&&o in cd)return wc[n]=i[o];return n}var ud=Ta("animationend"),fd=Ta("animationiteration"),hd=Ta("animationstart"),dd=Ta("transitionend"),pd=new Map,md="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function ur(n,i){pd.set(n,i),l(i,[n])}for(var Tc=0;Tc<md.length;Tc++){var Ac=md[Tc],K0=Ac.toLowerCase(),Z0=Ac[0].toUpperCase()+Ac.slice(1);ur(K0,"on"+Z0)}ur(ud,"onAnimationEnd"),ur(fd,"onAnimationIteration"),ur(hd,"onAnimationStart"),ur("dblclick","onDoubleClick"),ur("focusin","onFocus"),ur("focusout","onBlur"),ur(dd,"onTransitionEnd"),u("onMouseEnter",["mouseout","mouseover"]),u("onMouseLeave",["mouseout","mouseover"]),u("onPointerEnter",["pointerout","pointerover"]),u("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var bo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Q0=new Set("cancel close invalid load scroll toggle".split(" ").concat(bo));function gd(n,i,o){var c=n.type||"unknown-event";n.currentTarget=o,fa(c,i,void 0,n),n.currentTarget=null}function vd(n,i){i=(i&4)!==0;for(var o=0;o<n.length;o++){var c=n[o],h=c.event;c=c.listeners;e:{var _=void 0;if(i)for(var w=c.length-1;0<=w;w--){var I=c[w],O=I.instance,J=I.currentTarget;if(I=I.listener,O!==_&&h.isPropagationStopped())break e;gd(h,I,J),_=O}else for(w=0;w<c.length;w++){if(I=c[w],O=I.instance,J=I.currentTarget,I=I.listener,O!==_&&h.isPropagationStopped())break e;gd(h,I,J),_=O}}}if(kr)throw n=rr,kr=!1,rr=null,n}function zt(n,i){var o=i[Uc];o===void 0&&(o=i[Uc]=new Set);var c=n+"__bubble";o.has(c)||(_d(i,n,2,!1),o.add(c))}function Rc(n,i,o){var c=0;i&&(c|=4),_d(o,n,c,i)}var Aa="_reactListening"+Math.random().toString(36).slice(2);function Po(n){if(!n[Aa]){n[Aa]=!0,r.forEach(function(o){o!=="selectionchange"&&(Q0.has(o)||Rc(o,!1,n),Rc(o,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[Aa]||(i[Aa]=!0,Rc("selectionchange",!1,i))}}function _d(n,i,o,c){switch(Hh(i)){case 1:var h=h0;break;case 4:h=d0;break;default:h=uc}o=h.bind(null,i,o,n),h=void 0,!gs||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(h=!0),c?h!==void 0?n.addEventListener(i,o,{capture:!0,passive:h}):n.addEventListener(i,o,!0):h!==void 0?n.addEventListener(i,o,{passive:h}):n.addEventListener(i,o,!1)}function Cc(n,i,o,c,h){var _=c;if((i&1)===0&&(i&2)===0&&c!==null)e:for(;;){if(c===null)return;var w=c.tag;if(w===3||w===4){var I=c.stateNode.containerInfo;if(I===h||I.nodeType===8&&I.parentNode===h)break;if(w===4)for(w=c.return;w!==null;){var O=w.tag;if((O===3||O===4)&&(O=w.stateNode.containerInfo,O===h||O.nodeType===8&&O.parentNode===h))return;w=w.return}for(;I!==null;){if(w=Br(I),w===null)return;if(O=w.tag,O===5||O===6){c=_=w;continue e}I=I.parentNode}}c=c.return}Cn(function(){var J=_,ve=H(o),xe=[];e:{var me=pd.get(n);if(me!==void 0){var De=dc,Be=n;switch(n){case"keypress":if(ya(o)===0)break e;case"keydown":case"keyup":De=C0;break;case"focusin":Be="focus",De=gc;break;case"focusout":Be="blur",De=gc;break;case"beforeblur":case"afterblur":De=gc;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":De=Wh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":De=g0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":De=L0;break;case ud:case fd:case hd:De=x0;break;case dd:De=I0;break;case"scroll":De=p0;break;case"wheel":De=N0;break;case"copy":case"cut":case"paste":De=M0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":De=jh}var Ve=(i&4)!==0,Xt=!Ve&&n==="scroll",Y=Ve?me!==null?me+"Capture":null:me;Ve=[];for(var B=J,$;B!==null;){$=B;var Ee=$.stateNode;if($.tag===5&&Ee!==null&&($=Ee,Y!==null&&(Ee=Sn(B,Y),Ee!=null&&Ve.push(Lo(B,Ee,$)))),Xt)break;B=B.return}0<Ve.length&&(me=new De(me,Be,null,o,ve),xe.push({event:me,listeners:Ve}))}}if((i&7)===0){e:{if(me=n==="mouseover"||n==="pointerover",De=n==="mouseout"||n==="pointerout",me&&o!==Rt&&(Be=o.relatedTarget||o.fromElement)&&(Br(Be)||Be[ki]))break e;if((De||me)&&(me=ve.window===ve?ve:(me=ve.ownerDocument)?me.defaultView||me.parentWindow:window,De?(Be=o.relatedTarget||o.toElement,De=J,Be=Be?Br(Be):null,Be!==null&&(Xt=Si(Be),Be!==Xt||Be.tag!==5&&Be.tag!==6)&&(Be=null)):(De=null,Be=J),De!==Be)){if(Ve=Wh,Ee="onMouseLeave",Y="onMouseEnter",B="mouse",(n==="pointerout"||n==="pointerover")&&(Ve=jh,Ee="onPointerLeave",Y="onPointerEnter",B="pointer"),Xt=De==null?me:Ts(De),$=Be==null?me:Ts(Be),me=new Ve(Ee,B+"leave",De,o,ve),me.target=Xt,me.relatedTarget=$,Ee=null,Br(ve)===J&&(Ve=new Ve(Y,B+"enter",Be,o,ve),Ve.target=$,Ve.relatedTarget=Xt,Ee=Ve),Xt=Ee,De&&Be)t:{for(Ve=De,Y=Be,B=0,$=Ve;$;$=Es($))B++;for($=0,Ee=Y;Ee;Ee=Es(Ee))$++;for(;0<B-$;)Ve=Es(Ve),B--;for(;0<$-B;)Y=Es(Y),$--;for(;B--;){if(Ve===Y||Y!==null&&Ve===Y.alternate)break t;Ve=Es(Ve),Y=Es(Y)}Ve=null}else Ve=null;De!==null&&xd(xe,me,De,Ve,!1),Be!==null&&Xt!==null&&xd(xe,Xt,Be,Ve,!0)}}e:{if(me=J?Ts(J):window,De=me.nodeName&&me.nodeName.toLowerCase(),De==="select"||De==="input"&&me.type==="file")var je=V0;else if(Qh(me))if(ed)je=j0;else{je=W0;var Ke=G0}else(De=me.nodeName)&&De.toLowerCase()==="input"&&(me.type==="checkbox"||me.type==="radio")&&(je=X0);if(je&&(je=je(n,J))){Jh(xe,je,o,ve);break e}Ke&&Ke(n,me,J),n==="focusout"&&(Ke=me._wrapperState)&&Ke.controlled&&me.type==="number"&&Ct(me,"number",me.value)}switch(Ke=J?Ts(J):window,n){case"focusin":(Qh(Ke)||Ke.contentEditable==="true")&&(Ms=Ke,Sc=J,Co=null);break;case"focusout":Co=Sc=Ms=null;break;case"mousedown":Ec=!0;break;case"contextmenu":case"mouseup":case"dragend":Ec=!1,ld(xe,o,ve);break;case"selectionchange":if($0)break;case"keydown":case"keyup":ld(xe,o,ve)}var Ze;if(_c)e:{switch(n){case"compositionstart":var nt="onCompositionStart";break e;case"compositionend":nt="onCompositionEnd";break e;case"compositionupdate":nt="onCompositionUpdate";break e}nt=void 0}else ys?Kh(n,o)&&(nt="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(nt="onCompositionStart");nt&&(Yh&&o.locale!=="ko"&&(ys||nt!=="onCompositionStart"?nt==="onCompositionEnd"&&ys&&(Ze=Vh()):(cr=ve,hc="value"in cr?cr.value:cr.textContent,ys=!0)),Ke=Ra(J,nt),0<Ke.length&&(nt=new Xh(nt,n,null,o,ve),xe.push({event:nt,listeners:Ke}),Ze?nt.data=Ze:(Ze=Zh(o),Ze!==null&&(nt.data=Ze)))),(Ze=O0?z0(n,o):k0(n,o))&&(J=Ra(J,"onBeforeInput"),0<J.length&&(ve=new Xh("onBeforeInput","beforeinput",null,o,ve),xe.push({event:ve,listeners:J}),ve.data=Ze))}vd(xe,i)})}function Lo(n,i,o){return{instance:n,listener:i,currentTarget:o}}function Ra(n,i){for(var o=i+"Capture",c=[];n!==null;){var h=n,_=h.stateNode;h.tag===5&&_!==null&&(h=_,_=Sn(n,o),_!=null&&c.unshift(Lo(n,_,h)),_=Sn(n,i),_!=null&&c.push(Lo(n,_,h))),n=n.return}return c}function Es(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function xd(n,i,o,c,h){for(var _=i._reactName,w=[];o!==null&&o!==c;){var I=o,O=I.alternate,J=I.stateNode;if(O!==null&&O===c)break;I.tag===5&&J!==null&&(I=J,h?(O=Sn(o,_),O!=null&&w.unshift(Lo(o,O,I))):h||(O=Sn(o,_),O!=null&&w.push(Lo(o,O,I)))),o=o.return}w.length!==0&&n.push({event:i,listeners:w})}var J0=/\r\n?/g,ev=/\u0000|\uFFFD/g;function yd(n){return(typeof n=="string"?n:""+n).replace(J0,`
`).replace(ev,"")}function Ca(n,i,o){if(i=yd(i),yd(n)!==i&&o)throw Error(t(425))}function ba(){}var bc=null,Pc=null;function Lc(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Dc=typeof setTimeout=="function"?setTimeout:void 0,tv=typeof clearTimeout=="function"?clearTimeout:void 0,Md=typeof Promise=="function"?Promise:void 0,nv=typeof queueMicrotask=="function"?queueMicrotask:typeof Md<"u"?function(n){return Md.resolve(null).then(n).catch(iv)}:Dc;function iv(n){setTimeout(function(){throw n})}function Ic(n,i){var o=i,c=0;do{var h=o.nextSibling;if(n.removeChild(o),h&&h.nodeType===8)if(o=h.data,o==="/$"){if(c===0){n.removeChild(h),Mo(i);return}c--}else o!=="$"&&o!=="$?"&&o!=="$!"||c++;o=h}while(o);Mo(i)}function fr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function Sd(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(i===0)return n;i--}else o==="/$"&&i++}n=n.previousSibling}return null}var ws=Math.random().toString(36).slice(2),wi="__reactFiber$"+ws,Do="__reactProps$"+ws,ki="__reactContainer$"+ws,Uc="__reactEvents$"+ws,rv="__reactListeners$"+ws,sv="__reactHandles$"+ws;function Br(n){var i=n[wi];if(i)return i;for(var o=n.parentNode;o;){if(i=o[ki]||o[wi]){if(o=i.alternate,i.child!==null||o!==null&&o.child!==null)for(n=Sd(n);n!==null;){if(o=n[wi])return o;n=Sd(n)}return i}n=o,o=n.parentNode}return null}function Io(n){return n=n[wi]||n[ki],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ts(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Pa(n){return n[Do]||null}var Nc=[],As=-1;function hr(n){return{current:n}}function kt(n){0>As||(n.current=Nc[As],Nc[As]=null,As--)}function Ft(n,i){As++,Nc[As]=n.current,n.current=i}var dr={},mn=hr(dr),Pn=hr(!1),Hr=dr;function Rs(n,i){var o=n.type.contextTypes;if(!o)return dr;var c=n.stateNode;if(c&&c.__reactInternalMemoizedUnmaskedChildContext===i)return c.__reactInternalMemoizedMaskedChildContext;var h={},_;for(_ in o)h[_]=i[_];return c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=h),h}function Ln(n){return n=n.childContextTypes,n!=null}function La(){kt(Pn),kt(mn)}function Ed(n,i,o){if(mn.current!==dr)throw Error(t(168));Ft(mn,i),Ft(Pn,o)}function wd(n,i,o){var c=n.stateNode;if(i=i.childContextTypes,typeof c.getChildContext!="function")return o;c=c.getChildContext();for(var h in c)if(!(h in i))throw Error(t(108,_e(n)||"Unknown",h));return se({},o,c)}function Da(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||dr,Hr=mn.current,Ft(mn,n),Ft(Pn,Pn.current),!0}function Td(n,i,o){var c=n.stateNode;if(!c)throw Error(t(169));o?(n=wd(n,i,Hr),c.__reactInternalMemoizedMergedChildContext=n,kt(Pn),kt(mn),Ft(mn,n)):kt(Pn),Ft(Pn,o)}var Bi=null,Ia=!1,Fc=!1;function Ad(n){Bi===null?Bi=[n]:Bi.push(n)}function ov(n){Ia=!0,Ad(n)}function pr(){if(!Fc&&Bi!==null){Fc=!0;var n=0,i=bt;try{var o=Bi;for(bt=1;n<o.length;n++){var c=o[n];do c=c(!0);while(c!==null)}Bi=null,Ia=!1}catch(h){throw Bi!==null&&(Bi=Bi.slice(n+1)),ee(He,pr),h}finally{bt=i,Fc=!1}}return null}var Cs=[],bs=0,Ua=null,Na=0,Jn=[],ei=0,Vr=null,Hi=1,Vi="";function Gr(n,i){Cs[bs++]=Na,Cs[bs++]=Ua,Ua=n,Na=i}function Rd(n,i,o){Jn[ei++]=Hi,Jn[ei++]=Vi,Jn[ei++]=Vr,Vr=n;var c=Hi;n=Vi;var h=32-ot(c)-1;c&=~(1<<h),o+=1;var _=32-ot(i)+h;if(30<_){var w=h-h%5;_=(c&(1<<w)-1).toString(32),c>>=w,h-=w,Hi=1<<32-ot(i)+h|o<<h|c,Vi=_+n}else Hi=1<<_|o<<h|c,Vi=n}function Oc(n){n.return!==null&&(Gr(n,1),Rd(n,1,0))}function zc(n){for(;n===Ua;)Ua=Cs[--bs],Cs[bs]=null,Na=Cs[--bs],Cs[bs]=null;for(;n===Vr;)Vr=Jn[--ei],Jn[ei]=null,Vi=Jn[--ei],Jn[ei]=null,Hi=Jn[--ei],Jn[ei]=null}var Vn=null,Gn=null,Bt=!1,ui=null;function Cd(n,i){var o=ri(5,null,null,0);o.elementType="DELETED",o.stateNode=i,o.return=n,i=n.deletions,i===null?(n.deletions=[o],n.flags|=16):i.push(o)}function bd(n,i){switch(n.tag){case 5:var o=n.type;return i=i.nodeType!==1||o.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Vn=n,Gn=fr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Vn=n,Gn=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(o=Vr!==null?{id:Hi,overflow:Vi}:null,n.memoizedState={dehydrated:i,treeContext:o,retryLane:1073741824},o=ri(18,null,null,0),o.stateNode=i,o.return=n,n.child=o,Vn=n,Gn=null,!0):!1;default:return!1}}function kc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Bc(n){if(Bt){var i=Gn;if(i){var o=i;if(!bd(n,i)){if(kc(n))throw Error(t(418));i=fr(o.nextSibling);var c=Vn;i&&bd(n,i)?Cd(c,o):(n.flags=n.flags&-4097|2,Bt=!1,Vn=n)}}else{if(kc(n))throw Error(t(418));n.flags=n.flags&-4097|2,Bt=!1,Vn=n}}}function Pd(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Vn=n}function Fa(n){if(n!==Vn)return!1;if(!Bt)return Pd(n),Bt=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Lc(n.type,n.memoizedProps)),i&&(i=Gn)){if(kc(n))throw Ld(),Error(t(418));for(;i;)Cd(n,i),i=fr(i.nextSibling)}if(Pd(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="/$"){if(i===0){Gn=fr(n.nextSibling);break e}i--}else o!=="$"&&o!=="$!"&&o!=="$?"||i++}n=n.nextSibling}Gn=null}}else Gn=Vn?fr(n.stateNode.nextSibling):null;return!0}function Ld(){for(var n=Gn;n;)n=fr(n.nextSibling)}function Ps(){Gn=Vn=null,Bt=!1}function Hc(n){ui===null?ui=[n]:ui.push(n)}var av=A.ReactCurrentBatchConfig;function Uo(n,i,o){if(n=o.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(t(309));var c=o.stateNode}if(!c)throw Error(t(147,n));var h=c,_=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===_?i.ref:(i=function(w){var I=h.refs;w===null?delete I[_]:I[_]=w},i._stringRef=_,i)}if(typeof n!="string")throw Error(t(284));if(!o._owner)throw Error(t(290,n))}return n}function Oa(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Dd(n){var i=n._init;return i(n._payload)}function Id(n){function i(Y,B){if(n){var $=Y.deletions;$===null?(Y.deletions=[B],Y.flags|=16):$.push(B)}}function o(Y,B){if(!n)return null;for(;B!==null;)i(Y,B),B=B.sibling;return null}function c(Y,B){for(Y=new Map;B!==null;)B.key!==null?Y.set(B.key,B):Y.set(B.index,B),B=B.sibling;return Y}function h(Y,B){return Y=Sr(Y,B),Y.index=0,Y.sibling=null,Y}function _(Y,B,$){return Y.index=$,n?($=Y.alternate,$!==null?($=$.index,$<B?(Y.flags|=2,B):$):(Y.flags|=2,B)):(Y.flags|=1048576,B)}function w(Y){return n&&Y.alternate===null&&(Y.flags|=2),Y}function I(Y,B,$,Ee){return B===null||B.tag!==6?(B=Du($,Y.mode,Ee),B.return=Y,B):(B=h(B,$),B.return=Y,B)}function O(Y,B,$,Ee){var je=$.type;return je===F?ve(Y,B,$.props.children,Ee,$.key):B!==null&&(B.elementType===je||typeof je=="object"&&je!==null&&je.$$typeof===oe&&Dd(je)===B.type)?(Ee=h(B,$.props),Ee.ref=Uo(Y,B,$),Ee.return=Y,Ee):(Ee=al($.type,$.key,$.props,null,Y.mode,Ee),Ee.ref=Uo(Y,B,$),Ee.return=Y,Ee)}function J(Y,B,$,Ee){return B===null||B.tag!==4||B.stateNode.containerInfo!==$.containerInfo||B.stateNode.implementation!==$.implementation?(B=Iu($,Y.mode,Ee),B.return=Y,B):(B=h(B,$.children||[]),B.return=Y,B)}function ve(Y,B,$,Ee,je){return B===null||B.tag!==7?(B=Zr($,Y.mode,Ee,je),B.return=Y,B):(B=h(B,$),B.return=Y,B)}function xe(Y,B,$){if(typeof B=="string"&&B!==""||typeof B=="number")return B=Du(""+B,Y.mode,$),B.return=Y,B;if(typeof B=="object"&&B!==null){switch(B.$$typeof){case q:return $=al(B.type,B.key,B.props,null,Y.mode,$),$.ref=Uo(Y,null,B),$.return=Y,$;case N:return B=Iu(B,Y.mode,$),B.return=Y,B;case oe:var Ee=B._init;return xe(Y,Ee(B._payload),$)}if(qe(B)||le(B))return B=Zr(B,Y.mode,$,null),B.return=Y,B;Oa(Y,B)}return null}function me(Y,B,$,Ee){var je=B!==null?B.key:null;if(typeof $=="string"&&$!==""||typeof $=="number")return je!==null?null:I(Y,B,""+$,Ee);if(typeof $=="object"&&$!==null){switch($.$$typeof){case q:return $.key===je?O(Y,B,$,Ee):null;case N:return $.key===je?J(Y,B,$,Ee):null;case oe:return je=$._init,me(Y,B,je($._payload),Ee)}if(qe($)||le($))return je!==null?null:ve(Y,B,$,Ee,null);Oa(Y,$)}return null}function De(Y,B,$,Ee,je){if(typeof Ee=="string"&&Ee!==""||typeof Ee=="number")return Y=Y.get($)||null,I(B,Y,""+Ee,je);if(typeof Ee=="object"&&Ee!==null){switch(Ee.$$typeof){case q:return Y=Y.get(Ee.key===null?$:Ee.key)||null,O(B,Y,Ee,je);case N:return Y=Y.get(Ee.key===null?$:Ee.key)||null,J(B,Y,Ee,je);case oe:var Ke=Ee._init;return De(Y,B,$,Ke(Ee._payload),je)}if(qe(Ee)||le(Ee))return Y=Y.get($)||null,ve(B,Y,Ee,je,null);Oa(B,Ee)}return null}function Be(Y,B,$,Ee){for(var je=null,Ke=null,Ze=B,nt=B=0,ln=null;Ze!==null&&nt<$.length;nt++){Ze.index>nt?(ln=Ze,Ze=null):ln=Ze.sibling;var wt=me(Y,Ze,$[nt],Ee);if(wt===null){Ze===null&&(Ze=ln);break}n&&Ze&&wt.alternate===null&&i(Y,Ze),B=_(wt,B,nt),Ke===null?je=wt:Ke.sibling=wt,Ke=wt,Ze=ln}if(nt===$.length)return o(Y,Ze),Bt&&Gr(Y,nt),je;if(Ze===null){for(;nt<$.length;nt++)Ze=xe(Y,$[nt],Ee),Ze!==null&&(B=_(Ze,B,nt),Ke===null?je=Ze:Ke.sibling=Ze,Ke=Ze);return Bt&&Gr(Y,nt),je}for(Ze=c(Y,Ze);nt<$.length;nt++)ln=De(Ze,Y,nt,$[nt],Ee),ln!==null&&(n&&ln.alternate!==null&&Ze.delete(ln.key===null?nt:ln.key),B=_(ln,B,nt),Ke===null?je=ln:Ke.sibling=ln,Ke=ln);return n&&Ze.forEach(function(Er){return i(Y,Er)}),Bt&&Gr(Y,nt),je}function Ve(Y,B,$,Ee){var je=le($);if(typeof je!="function")throw Error(t(150));if($=je.call($),$==null)throw Error(t(151));for(var Ke=je=null,Ze=B,nt=B=0,ln=null,wt=$.next();Ze!==null&&!wt.done;nt++,wt=$.next()){Ze.index>nt?(ln=Ze,Ze=null):ln=Ze.sibling;var Er=me(Y,Ze,wt.value,Ee);if(Er===null){Ze===null&&(Ze=ln);break}n&&Ze&&Er.alternate===null&&i(Y,Ze),B=_(Er,B,nt),Ke===null?je=Er:Ke.sibling=Er,Ke=Er,Ze=ln}if(wt.done)return o(Y,Ze),Bt&&Gr(Y,nt),je;if(Ze===null){for(;!wt.done;nt++,wt=$.next())wt=xe(Y,wt.value,Ee),wt!==null&&(B=_(wt,B,nt),Ke===null?je=wt:Ke.sibling=wt,Ke=wt);return Bt&&Gr(Y,nt),je}for(Ze=c(Y,Ze);!wt.done;nt++,wt=$.next())wt=De(Ze,Y,nt,wt.value,Ee),wt!==null&&(n&&wt.alternate!==null&&Ze.delete(wt.key===null?nt:wt.key),B=_(wt,B,nt),Ke===null?je=wt:Ke.sibling=wt,Ke=wt);return n&&Ze.forEach(function(Bv){return i(Y,Bv)}),Bt&&Gr(Y,nt),je}function Xt(Y,B,$,Ee){if(typeof $=="object"&&$!==null&&$.type===F&&$.key===null&&($=$.props.children),typeof $=="object"&&$!==null){switch($.$$typeof){case q:e:{for(var je=$.key,Ke=B;Ke!==null;){if(Ke.key===je){if(je=$.type,je===F){if(Ke.tag===7){o(Y,Ke.sibling),B=h(Ke,$.props.children),B.return=Y,Y=B;break e}}else if(Ke.elementType===je||typeof je=="object"&&je!==null&&je.$$typeof===oe&&Dd(je)===Ke.type){o(Y,Ke.sibling),B=h(Ke,$.props),B.ref=Uo(Y,Ke,$),B.return=Y,Y=B;break e}o(Y,Ke);break}else i(Y,Ke);Ke=Ke.sibling}$.type===F?(B=Zr($.props.children,Y.mode,Ee,$.key),B.return=Y,Y=B):(Ee=al($.type,$.key,$.props,null,Y.mode,Ee),Ee.ref=Uo(Y,B,$),Ee.return=Y,Y=Ee)}return w(Y);case N:e:{for(Ke=$.key;B!==null;){if(B.key===Ke)if(B.tag===4&&B.stateNode.containerInfo===$.containerInfo&&B.stateNode.implementation===$.implementation){o(Y,B.sibling),B=h(B,$.children||[]),B.return=Y,Y=B;break e}else{o(Y,B);break}else i(Y,B);B=B.sibling}B=Iu($,Y.mode,Ee),B.return=Y,Y=B}return w(Y);case oe:return Ke=$._init,Xt(Y,B,Ke($._payload),Ee)}if(qe($))return Be(Y,B,$,Ee);if(le($))return Ve(Y,B,$,Ee);Oa(Y,$)}return typeof $=="string"&&$!==""||typeof $=="number"?($=""+$,B!==null&&B.tag===6?(o(Y,B.sibling),B=h(B,$),B.return=Y,Y=B):(o(Y,B),B=Du($,Y.mode,Ee),B.return=Y,Y=B),w(Y)):o(Y,B)}return Xt}var Ls=Id(!0),Ud=Id(!1),za=hr(null),ka=null,Ds=null,Vc=null;function Gc(){Vc=Ds=ka=null}function Wc(n){var i=za.current;kt(za),n._currentValue=i}function Xc(n,i,o){for(;n!==null;){var c=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,c!==null&&(c.childLanes|=i)):c!==null&&(c.childLanes&i)!==i&&(c.childLanes|=i),n===o)break;n=n.return}}function Is(n,i){ka=n,Vc=Ds=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(Dn=!0),n.firstContext=null)}function ti(n){var i=n._currentValue;if(Vc!==n)if(n={context:n,memoizedValue:i,next:null},Ds===null){if(ka===null)throw Error(t(308));Ds=n,ka.dependencies={lanes:0,firstContext:n}}else Ds=Ds.next=n;return i}var Wr=null;function jc(n){Wr===null?Wr=[n]:Wr.push(n)}function Nd(n,i,o,c){var h=i.interleaved;return h===null?(o.next=o,jc(i)):(o.next=h.next,h.next=o),i.interleaved=o,Gi(n,c)}function Gi(n,i){n.lanes|=i;var o=n.alternate;for(o!==null&&(o.lanes|=i),o=n,n=n.return;n!==null;)n.childLanes|=i,o=n.alternate,o!==null&&(o.childLanes|=i),o=n,n=n.return;return o.tag===3?o.stateNode:null}var mr=!1;function Yc(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Fd(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Wi(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function gr(n,i,o){var c=n.updateQueue;if(c===null)return null;if(c=c.shared,(Mt&2)!==0){var h=c.pending;return h===null?i.next=i:(i.next=h.next,h.next=i),c.pending=i,Gi(n,o)}return h=c.interleaved,h===null?(i.next=i,jc(c)):(i.next=h.next,h.next=i),c.interleaved=i,Gi(n,o)}function Ba(n,i,o){if(i=i.updateQueue,i!==null&&(i=i.shared,(o&4194240)!==0)){var c=i.lanes;c&=n.pendingLanes,o|=c,i.lanes=o,ac(n,o)}}function Od(n,i){var o=n.updateQueue,c=n.alternate;if(c!==null&&(c=c.updateQueue,o===c)){var h=null,_=null;if(o=o.firstBaseUpdate,o!==null){do{var w={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};_===null?h=_=w:_=_.next=w,o=o.next}while(o!==null);_===null?h=_=i:_=_.next=i}else h=_=i;o={baseState:c.baseState,firstBaseUpdate:h,lastBaseUpdate:_,shared:c.shared,effects:c.effects},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=i:n.next=i,o.lastBaseUpdate=i}function Ha(n,i,o,c){var h=n.updateQueue;mr=!1;var _=h.firstBaseUpdate,w=h.lastBaseUpdate,I=h.shared.pending;if(I!==null){h.shared.pending=null;var O=I,J=O.next;O.next=null,w===null?_=J:w.next=J,w=O;var ve=n.alternate;ve!==null&&(ve=ve.updateQueue,I=ve.lastBaseUpdate,I!==w&&(I===null?ve.firstBaseUpdate=J:I.next=J,ve.lastBaseUpdate=O))}if(_!==null){var xe=h.baseState;w=0,ve=J=O=null,I=_;do{var me=I.lane,De=I.eventTime;if((c&me)===me){ve!==null&&(ve=ve.next={eventTime:De,lane:0,tag:I.tag,payload:I.payload,callback:I.callback,next:null});e:{var Be=n,Ve=I;switch(me=i,De=o,Ve.tag){case 1:if(Be=Ve.payload,typeof Be=="function"){xe=Be.call(De,xe,me);break e}xe=Be;break e;case 3:Be.flags=Be.flags&-65537|128;case 0:if(Be=Ve.payload,me=typeof Be=="function"?Be.call(De,xe,me):Be,me==null)break e;xe=se({},xe,me);break e;case 2:mr=!0}}I.callback!==null&&I.lane!==0&&(n.flags|=64,me=h.effects,me===null?h.effects=[I]:me.push(I))}else De={eventTime:De,lane:me,tag:I.tag,payload:I.payload,callback:I.callback,next:null},ve===null?(J=ve=De,O=xe):ve=ve.next=De,w|=me;if(I=I.next,I===null){if(I=h.shared.pending,I===null)break;me=I,I=me.next,me.next=null,h.lastBaseUpdate=me,h.shared.pending=null}}while(!0);if(ve===null&&(O=xe),h.baseState=O,h.firstBaseUpdate=J,h.lastBaseUpdate=ve,i=h.shared.interleaved,i!==null){h=i;do w|=h.lane,h=h.next;while(h!==i)}else _===null&&(h.shared.lanes=0);Yr|=w,n.lanes=w,n.memoizedState=xe}}function zd(n,i,o){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var c=n[i],h=c.callback;if(h!==null){if(c.callback=null,c=o,typeof h!="function")throw Error(t(191,h));h.call(c)}}}var No={},Ti=hr(No),Fo=hr(No),Oo=hr(No);function Xr(n){if(n===No)throw Error(t(174));return n}function qc(n,i){switch(Ft(Oo,i),Ft(Fo,n),Ft(Ti,No),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:Ge(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=Ge(i,n)}kt(Ti),Ft(Ti,i)}function Us(){kt(Ti),kt(Fo),kt(Oo)}function kd(n){Xr(Oo.current);var i=Xr(Ti.current),o=Ge(i,n.type);i!==o&&(Ft(Fo,n),Ft(Ti,o))}function $c(n){Fo.current===n&&(kt(Ti),kt(Fo))}var Vt=hr(0);function Va(n){for(var i=n;i!==null;){if(i.tag===13){var o=i.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var Kc=[];function Zc(){for(var n=0;n<Kc.length;n++)Kc[n]._workInProgressVersionPrimary=null;Kc.length=0}var Ga=A.ReactCurrentDispatcher,Qc=A.ReactCurrentBatchConfig,jr=0,Gt=null,Qt=null,on=null,Wa=!1,zo=!1,ko=0,lv=0;function gn(){throw Error(t(321))}function Jc(n,i){if(i===null)return!1;for(var o=0;o<i.length&&o<n.length;o++)if(!ci(n[o],i[o]))return!1;return!0}function eu(n,i,o,c,h,_){if(jr=_,Gt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Ga.current=n===null||n.memoizedState===null?hv:dv,n=o(c,h),zo){_=0;do{if(zo=!1,ko=0,25<=_)throw Error(t(301));_+=1,on=Qt=null,i.updateQueue=null,Ga.current=pv,n=o(c,h)}while(zo)}if(Ga.current=Ya,i=Qt!==null&&Qt.next!==null,jr=0,on=Qt=Gt=null,Wa=!1,i)throw Error(t(300));return n}function tu(){var n=ko!==0;return ko=0,n}function Ai(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return on===null?Gt.memoizedState=on=n:on=on.next=n,on}function ni(){if(Qt===null){var n=Gt.alternate;n=n!==null?n.memoizedState:null}else n=Qt.next;var i=on===null?Gt.memoizedState:on.next;if(i!==null)on=i,Qt=n;else{if(n===null)throw Error(t(310));Qt=n,n={memoizedState:Qt.memoizedState,baseState:Qt.baseState,baseQueue:Qt.baseQueue,queue:Qt.queue,next:null},on===null?Gt.memoizedState=on=n:on=on.next=n}return on}function Bo(n,i){return typeof i=="function"?i(n):i}function nu(n){var i=ni(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var c=Qt,h=c.baseQueue,_=o.pending;if(_!==null){if(h!==null){var w=h.next;h.next=_.next,_.next=w}c.baseQueue=h=_,o.pending=null}if(h!==null){_=h.next,c=c.baseState;var I=w=null,O=null,J=_;do{var ve=J.lane;if((jr&ve)===ve)O!==null&&(O=O.next={lane:0,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null}),c=J.hasEagerState?J.eagerState:n(c,J.action);else{var xe={lane:ve,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null};O===null?(I=O=xe,w=c):O=O.next=xe,Gt.lanes|=ve,Yr|=ve}J=J.next}while(J!==null&&J!==_);O===null?w=c:O.next=I,ci(c,i.memoizedState)||(Dn=!0),i.memoizedState=c,i.baseState=w,i.baseQueue=O,o.lastRenderedState=c}if(n=o.interleaved,n!==null){h=n;do _=h.lane,Gt.lanes|=_,Yr|=_,h=h.next;while(h!==n)}else h===null&&(o.lanes=0);return[i.memoizedState,o.dispatch]}function iu(n){var i=ni(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var c=o.dispatch,h=o.pending,_=i.memoizedState;if(h!==null){o.pending=null;var w=h=h.next;do _=n(_,w.action),w=w.next;while(w!==h);ci(_,i.memoizedState)||(Dn=!0),i.memoizedState=_,i.baseQueue===null&&(i.baseState=_),o.lastRenderedState=_}return[_,c]}function Bd(){}function Hd(n,i){var o=Gt,c=ni(),h=i(),_=!ci(c.memoizedState,h);if(_&&(c.memoizedState=h,Dn=!0),c=c.queue,ru(Wd.bind(null,o,c,n),[n]),c.getSnapshot!==i||_||on!==null&&on.memoizedState.tag&1){if(o.flags|=2048,Ho(9,Gd.bind(null,o,c,h,i),void 0,null),an===null)throw Error(t(349));(jr&30)!==0||Vd(o,i,h)}return h}function Vd(n,i,o){n.flags|=16384,n={getSnapshot:i,value:o},i=Gt.updateQueue,i===null?(i={lastEffect:null,stores:null},Gt.updateQueue=i,i.stores=[n]):(o=i.stores,o===null?i.stores=[n]:o.push(n))}function Gd(n,i,o,c){i.value=o,i.getSnapshot=c,Xd(i)&&jd(n)}function Wd(n,i,o){return o(function(){Xd(i)&&jd(n)})}function Xd(n){var i=n.getSnapshot;n=n.value;try{var o=i();return!ci(n,o)}catch{return!0}}function jd(n){var i=Gi(n,1);i!==null&&pi(i,n,1,-1)}function Yd(n){var i=Ai();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:n},i.queue=n,n=n.dispatch=fv.bind(null,Gt,n),[i.memoizedState,n]}function Ho(n,i,o,c){return n={tag:n,create:i,destroy:o,deps:c,next:null},i=Gt.updateQueue,i===null?(i={lastEffect:null,stores:null},Gt.updateQueue=i,i.lastEffect=n.next=n):(o=i.lastEffect,o===null?i.lastEffect=n.next=n:(c=o.next,o.next=n,n.next=c,i.lastEffect=n)),n}function qd(){return ni().memoizedState}function Xa(n,i,o,c){var h=Ai();Gt.flags|=n,h.memoizedState=Ho(1|i,o,void 0,c===void 0?null:c)}function ja(n,i,o,c){var h=ni();c=c===void 0?null:c;var _=void 0;if(Qt!==null){var w=Qt.memoizedState;if(_=w.destroy,c!==null&&Jc(c,w.deps)){h.memoizedState=Ho(i,o,_,c);return}}Gt.flags|=n,h.memoizedState=Ho(1|i,o,_,c)}function $d(n,i){return Xa(8390656,8,n,i)}function ru(n,i){return ja(2048,8,n,i)}function Kd(n,i){return ja(4,2,n,i)}function Zd(n,i){return ja(4,4,n,i)}function Qd(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function Jd(n,i,o){return o=o!=null?o.concat([n]):null,ja(4,4,Qd.bind(null,i,n),o)}function su(){}function ep(n,i){var o=ni();i=i===void 0?null:i;var c=o.memoizedState;return c!==null&&i!==null&&Jc(i,c[1])?c[0]:(o.memoizedState=[n,i],n)}function tp(n,i){var o=ni();i=i===void 0?null:i;var c=o.memoizedState;return c!==null&&i!==null&&Jc(i,c[1])?c[0]:(n=n(),o.memoizedState=[n,i],n)}function np(n,i,o){return(jr&21)===0?(n.baseState&&(n.baseState=!1,Dn=!0),n.memoizedState=o):(ci(o,i)||(o=En(),Gt.lanes|=o,Yr|=o,n.baseState=!0),i)}function cv(n,i){var o=bt;bt=o!==0&&4>o?o:4,n(!0);var c=Qc.transition;Qc.transition={};try{n(!1),i()}finally{bt=o,Qc.transition=c}}function ip(){return ni().memoizedState}function uv(n,i,o){var c=yr(n);if(o={lane:c,action:o,hasEagerState:!1,eagerState:null,next:null},rp(n))sp(i,o);else if(o=Nd(n,i,o,c),o!==null){var h=Tn();pi(o,n,c,h),op(o,i,c)}}function fv(n,i,o){var c=yr(n),h={lane:c,action:o,hasEagerState:!1,eagerState:null,next:null};if(rp(n))sp(i,h);else{var _=n.alternate;if(n.lanes===0&&(_===null||_.lanes===0)&&(_=i.lastRenderedReducer,_!==null))try{var w=i.lastRenderedState,I=_(w,o);if(h.hasEagerState=!0,h.eagerState=I,ci(I,w)){var O=i.interleaved;O===null?(h.next=h,jc(i)):(h.next=O.next,O.next=h),i.interleaved=h;return}}catch{}finally{}o=Nd(n,i,h,c),o!==null&&(h=Tn(),pi(o,n,c,h),op(o,i,c))}}function rp(n){var i=n.alternate;return n===Gt||i!==null&&i===Gt}function sp(n,i){zo=Wa=!0;var o=n.pending;o===null?i.next=i:(i.next=o.next,o.next=i),n.pending=i}function op(n,i,o){if((o&4194240)!==0){var c=i.lanes;c&=n.pendingLanes,o|=c,i.lanes=o,ac(n,o)}}var Ya={readContext:ti,useCallback:gn,useContext:gn,useEffect:gn,useImperativeHandle:gn,useInsertionEffect:gn,useLayoutEffect:gn,useMemo:gn,useReducer:gn,useRef:gn,useState:gn,useDebugValue:gn,useDeferredValue:gn,useTransition:gn,useMutableSource:gn,useSyncExternalStore:gn,useId:gn,unstable_isNewReconciler:!1},hv={readContext:ti,useCallback:function(n,i){return Ai().memoizedState=[n,i===void 0?null:i],n},useContext:ti,useEffect:$d,useImperativeHandle:function(n,i,o){return o=o!=null?o.concat([n]):null,Xa(4194308,4,Qd.bind(null,i,n),o)},useLayoutEffect:function(n,i){return Xa(4194308,4,n,i)},useInsertionEffect:function(n,i){return Xa(4,2,n,i)},useMemo:function(n,i){var o=Ai();return i=i===void 0?null:i,n=n(),o.memoizedState=[n,i],n},useReducer:function(n,i,o){var c=Ai();return i=o!==void 0?o(i):i,c.memoizedState=c.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},c.queue=n,n=n.dispatch=uv.bind(null,Gt,n),[c.memoizedState,n]},useRef:function(n){var i=Ai();return n={current:n},i.memoizedState=n},useState:Yd,useDebugValue:su,useDeferredValue:function(n){return Ai().memoizedState=n},useTransition:function(){var n=Yd(!1),i=n[0];return n=cv.bind(null,n[1]),Ai().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,o){var c=Gt,h=Ai();if(Bt){if(o===void 0)throw Error(t(407));o=o()}else{if(o=i(),an===null)throw Error(t(349));(jr&30)!==0||Vd(c,i,o)}h.memoizedState=o;var _={value:o,getSnapshot:i};return h.queue=_,$d(Wd.bind(null,c,_,n),[n]),c.flags|=2048,Ho(9,Gd.bind(null,c,_,o,i),void 0,null),o},useId:function(){var n=Ai(),i=an.identifierPrefix;if(Bt){var o=Vi,c=Hi;o=(c&~(1<<32-ot(c)-1)).toString(32)+o,i=":"+i+"R"+o,o=ko++,0<o&&(i+="H"+o.toString(32)),i+=":"}else o=lv++,i=":"+i+"r"+o.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},dv={readContext:ti,useCallback:ep,useContext:ti,useEffect:ru,useImperativeHandle:Jd,useInsertionEffect:Kd,useLayoutEffect:Zd,useMemo:tp,useReducer:nu,useRef:qd,useState:function(){return nu(Bo)},useDebugValue:su,useDeferredValue:function(n){var i=ni();return np(i,Qt.memoizedState,n)},useTransition:function(){var n=nu(Bo)[0],i=ni().memoizedState;return[n,i]},useMutableSource:Bd,useSyncExternalStore:Hd,useId:ip,unstable_isNewReconciler:!1},pv={readContext:ti,useCallback:ep,useContext:ti,useEffect:ru,useImperativeHandle:Jd,useInsertionEffect:Kd,useLayoutEffect:Zd,useMemo:tp,useReducer:iu,useRef:qd,useState:function(){return iu(Bo)},useDebugValue:su,useDeferredValue:function(n){var i=ni();return Qt===null?i.memoizedState=n:np(i,Qt.memoizedState,n)},useTransition:function(){var n=iu(Bo)[0],i=ni().memoizedState;return[n,i]},useMutableSource:Bd,useSyncExternalStore:Hd,useId:ip,unstable_isNewReconciler:!1};function fi(n,i){if(n&&n.defaultProps){i=se({},i),n=n.defaultProps;for(var o in n)i[o]===void 0&&(i[o]=n[o]);return i}return i}function ou(n,i,o,c){i=n.memoizedState,o=o(c,i),o=o==null?i:se({},i,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var qa={isMounted:function(n){return(n=n._reactInternals)?Si(n)===n:!1},enqueueSetState:function(n,i,o){n=n._reactInternals;var c=Tn(),h=yr(n),_=Wi(c,h);_.payload=i,o!=null&&(_.callback=o),i=gr(n,_,h),i!==null&&(pi(i,n,h,c),Ba(i,n,h))},enqueueReplaceState:function(n,i,o){n=n._reactInternals;var c=Tn(),h=yr(n),_=Wi(c,h);_.tag=1,_.payload=i,o!=null&&(_.callback=o),i=gr(n,_,h),i!==null&&(pi(i,n,h,c),Ba(i,n,h))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var o=Tn(),c=yr(n),h=Wi(o,c);h.tag=2,i!=null&&(h.callback=i),i=gr(n,h,c),i!==null&&(pi(i,n,c,o),Ba(i,n,c))}};function ap(n,i,o,c,h,_,w){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(c,_,w):i.prototype&&i.prototype.isPureReactComponent?!Ro(o,c)||!Ro(h,_):!0}function lp(n,i,o){var c=!1,h=dr,_=i.contextType;return typeof _=="object"&&_!==null?_=ti(_):(h=Ln(i)?Hr:mn.current,c=i.contextTypes,_=(c=c!=null)?Rs(n,h):dr),i=new i(o,_),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=qa,n.stateNode=i,i._reactInternals=n,c&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=h,n.__reactInternalMemoizedMaskedChildContext=_),i}function cp(n,i,o,c){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(o,c),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(o,c),i.state!==n&&qa.enqueueReplaceState(i,i.state,null)}function au(n,i,o,c){var h=n.stateNode;h.props=o,h.state=n.memoizedState,h.refs={},Yc(n);var _=i.contextType;typeof _=="object"&&_!==null?h.context=ti(_):(_=Ln(i)?Hr:mn.current,h.context=Rs(n,_)),h.state=n.memoizedState,_=i.getDerivedStateFromProps,typeof _=="function"&&(ou(n,i,_,o),h.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof h.getSnapshotBeforeUpdate=="function"||typeof h.UNSAFE_componentWillMount!="function"&&typeof h.componentWillMount!="function"||(i=h.state,typeof h.componentWillMount=="function"&&h.componentWillMount(),typeof h.UNSAFE_componentWillMount=="function"&&h.UNSAFE_componentWillMount(),i!==h.state&&qa.enqueueReplaceState(h,h.state,null),Ha(n,o,h,c),h.state=n.memoizedState),typeof h.componentDidMount=="function"&&(n.flags|=4194308)}function Ns(n,i){try{var o="",c=i;do o+=fe(c),c=c.return;while(c);var h=o}catch(_){h=`
Error generating stack: `+_.message+`
`+_.stack}return{value:n,source:i,stack:h,digest:null}}function lu(n,i,o){return{value:n,source:null,stack:o??null,digest:i??null}}function cu(n,i){try{console.error(i.value)}catch(o){setTimeout(function(){throw o})}}var mv=typeof WeakMap=="function"?WeakMap:Map;function up(n,i,o){o=Wi(-1,o),o.tag=3,o.payload={element:null};var c=i.value;return o.callback=function(){tl||(tl=!0,wu=c),cu(n,i)},o}function fp(n,i,o){o=Wi(-1,o),o.tag=3;var c=n.type.getDerivedStateFromError;if(typeof c=="function"){var h=i.value;o.payload=function(){return c(h)},o.callback=function(){cu(n,i)}}var _=n.stateNode;return _!==null&&typeof _.componentDidCatch=="function"&&(o.callback=function(){cu(n,i),typeof c!="function"&&(_r===null?_r=new Set([this]):_r.add(this));var w=i.stack;this.componentDidCatch(i.value,{componentStack:w!==null?w:""})}),o}function hp(n,i,o){var c=n.pingCache;if(c===null){c=n.pingCache=new mv;var h=new Set;c.set(i,h)}else h=c.get(i),h===void 0&&(h=new Set,c.set(i,h));h.has(o)||(h.add(o),n=bv.bind(null,n,i,o),i.then(n,n))}function dp(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function pp(n,i,o,c,h){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(i=Wi(-1,1),i.tag=2,gr(o,i,1))),o.lanes|=1),n):(n.flags|=65536,n.lanes=h,n)}var gv=A.ReactCurrentOwner,Dn=!1;function wn(n,i,o,c){i.child=n===null?Ud(i,null,o,c):Ls(i,n.child,o,c)}function mp(n,i,o,c,h){o=o.render;var _=i.ref;return Is(i,h),c=eu(n,i,o,c,_,h),o=tu(),n!==null&&!Dn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Xi(n,i,h)):(Bt&&o&&Oc(i),i.flags|=1,wn(n,i,c,h),i.child)}function gp(n,i,o,c,h){if(n===null){var _=o.type;return typeof _=="function"&&!Lu(_)&&_.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(i.tag=15,i.type=_,vp(n,i,_,c,h)):(n=al(o.type,null,c,i,i.mode,h),n.ref=i.ref,n.return=i,i.child=n)}if(_=n.child,(n.lanes&h)===0){var w=_.memoizedProps;if(o=o.compare,o=o!==null?o:Ro,o(w,c)&&n.ref===i.ref)return Xi(n,i,h)}return i.flags|=1,n=Sr(_,c),n.ref=i.ref,n.return=i,i.child=n}function vp(n,i,o,c,h){if(n!==null){var _=n.memoizedProps;if(Ro(_,c)&&n.ref===i.ref)if(Dn=!1,i.pendingProps=c=_,(n.lanes&h)!==0)(n.flags&131072)!==0&&(Dn=!0);else return i.lanes=n.lanes,Xi(n,i,h)}return uu(n,i,o,c,h)}function _p(n,i,o){var c=i.pendingProps,h=c.children,_=n!==null?n.memoizedState:null;if(c.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ft(Os,Wn),Wn|=o;else{if((o&1073741824)===0)return n=_!==null?_.baseLanes|o:o,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,Ft(Os,Wn),Wn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},c=_!==null?_.baseLanes:o,Ft(Os,Wn),Wn|=c}else _!==null?(c=_.baseLanes|o,i.memoizedState=null):c=o,Ft(Os,Wn),Wn|=c;return wn(n,i,h,o),i.child}function xp(n,i){var o=i.ref;(n===null&&o!==null||n!==null&&n.ref!==o)&&(i.flags|=512,i.flags|=2097152)}function uu(n,i,o,c,h){var _=Ln(o)?Hr:mn.current;return _=Rs(i,_),Is(i,h),o=eu(n,i,o,c,_,h),c=tu(),n!==null&&!Dn?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~h,Xi(n,i,h)):(Bt&&c&&Oc(i),i.flags|=1,wn(n,i,o,h),i.child)}function yp(n,i,o,c,h){if(Ln(o)){var _=!0;Da(i)}else _=!1;if(Is(i,h),i.stateNode===null)Ka(n,i),lp(i,o,c),au(i,o,c,h),c=!0;else if(n===null){var w=i.stateNode,I=i.memoizedProps;w.props=I;var O=w.context,J=o.contextType;typeof J=="object"&&J!==null?J=ti(J):(J=Ln(o)?Hr:mn.current,J=Rs(i,J));var ve=o.getDerivedStateFromProps,xe=typeof ve=="function"||typeof w.getSnapshotBeforeUpdate=="function";xe||typeof w.UNSAFE_componentWillReceiveProps!="function"&&typeof w.componentWillReceiveProps!="function"||(I!==c||O!==J)&&cp(i,w,c,J),mr=!1;var me=i.memoizedState;w.state=me,Ha(i,c,w,h),O=i.memoizedState,I!==c||me!==O||Pn.current||mr?(typeof ve=="function"&&(ou(i,o,ve,c),O=i.memoizedState),(I=mr||ap(i,o,I,c,me,O,J))?(xe||typeof w.UNSAFE_componentWillMount!="function"&&typeof w.componentWillMount!="function"||(typeof w.componentWillMount=="function"&&w.componentWillMount(),typeof w.UNSAFE_componentWillMount=="function"&&w.UNSAFE_componentWillMount()),typeof w.componentDidMount=="function"&&(i.flags|=4194308)):(typeof w.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=c,i.memoizedState=O),w.props=c,w.state=O,w.context=J,c=I):(typeof w.componentDidMount=="function"&&(i.flags|=4194308),c=!1)}else{w=i.stateNode,Fd(n,i),I=i.memoizedProps,J=i.type===i.elementType?I:fi(i.type,I),w.props=J,xe=i.pendingProps,me=w.context,O=o.contextType,typeof O=="object"&&O!==null?O=ti(O):(O=Ln(o)?Hr:mn.current,O=Rs(i,O));var De=o.getDerivedStateFromProps;(ve=typeof De=="function"||typeof w.getSnapshotBeforeUpdate=="function")||typeof w.UNSAFE_componentWillReceiveProps!="function"&&typeof w.componentWillReceiveProps!="function"||(I!==xe||me!==O)&&cp(i,w,c,O),mr=!1,me=i.memoizedState,w.state=me,Ha(i,c,w,h);var Be=i.memoizedState;I!==xe||me!==Be||Pn.current||mr?(typeof De=="function"&&(ou(i,o,De,c),Be=i.memoizedState),(J=mr||ap(i,o,J,c,me,Be,O)||!1)?(ve||typeof w.UNSAFE_componentWillUpdate!="function"&&typeof w.componentWillUpdate!="function"||(typeof w.componentWillUpdate=="function"&&w.componentWillUpdate(c,Be,O),typeof w.UNSAFE_componentWillUpdate=="function"&&w.UNSAFE_componentWillUpdate(c,Be,O)),typeof w.componentDidUpdate=="function"&&(i.flags|=4),typeof w.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof w.componentDidUpdate!="function"||I===n.memoizedProps&&me===n.memoizedState||(i.flags|=4),typeof w.getSnapshotBeforeUpdate!="function"||I===n.memoizedProps&&me===n.memoizedState||(i.flags|=1024),i.memoizedProps=c,i.memoizedState=Be),w.props=c,w.state=Be,w.context=O,c=J):(typeof w.componentDidUpdate!="function"||I===n.memoizedProps&&me===n.memoizedState||(i.flags|=4),typeof w.getSnapshotBeforeUpdate!="function"||I===n.memoizedProps&&me===n.memoizedState||(i.flags|=1024),c=!1)}return fu(n,i,o,c,_,h)}function fu(n,i,o,c,h,_){xp(n,i);var w=(i.flags&128)!==0;if(!c&&!w)return h&&Td(i,o,!1),Xi(n,i,_);c=i.stateNode,gv.current=i;var I=w&&typeof o.getDerivedStateFromError!="function"?null:c.render();return i.flags|=1,n!==null&&w?(i.child=Ls(i,n.child,null,_),i.child=Ls(i,null,I,_)):wn(n,i,I,_),i.memoizedState=c.state,h&&Td(i,o,!0),i.child}function Mp(n){var i=n.stateNode;i.pendingContext?Ed(n,i.pendingContext,i.pendingContext!==i.context):i.context&&Ed(n,i.context,!1),qc(n,i.containerInfo)}function Sp(n,i,o,c,h){return Ps(),Hc(h),i.flags|=256,wn(n,i,o,c),i.child}var hu={dehydrated:null,treeContext:null,retryLane:0};function du(n){return{baseLanes:n,cachePool:null,transitions:null}}function Ep(n,i,o){var c=i.pendingProps,h=Vt.current,_=!1,w=(i.flags&128)!==0,I;if((I=w)||(I=n!==null&&n.memoizedState===null?!1:(h&2)!==0),I?(_=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(h|=1),Ft(Vt,h&1),n===null)return Bc(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(w=c.children,n=c.fallback,_?(c=i.mode,_=i.child,w={mode:"hidden",children:w},(c&1)===0&&_!==null?(_.childLanes=0,_.pendingProps=w):_=ll(w,c,0,null),n=Zr(n,c,o,null),_.return=i,n.return=i,_.sibling=n,i.child=_,i.child.memoizedState=du(o),i.memoizedState=hu,n):pu(i,w));if(h=n.memoizedState,h!==null&&(I=h.dehydrated,I!==null))return vv(n,i,w,c,I,h,o);if(_){_=c.fallback,w=i.mode,h=n.child,I=h.sibling;var O={mode:"hidden",children:c.children};return(w&1)===0&&i.child!==h?(c=i.child,c.childLanes=0,c.pendingProps=O,i.deletions=null):(c=Sr(h,O),c.subtreeFlags=h.subtreeFlags&14680064),I!==null?_=Sr(I,_):(_=Zr(_,w,o,null),_.flags|=2),_.return=i,c.return=i,c.sibling=_,i.child=c,c=_,_=i.child,w=n.child.memoizedState,w=w===null?du(o):{baseLanes:w.baseLanes|o,cachePool:null,transitions:w.transitions},_.memoizedState=w,_.childLanes=n.childLanes&~o,i.memoizedState=hu,c}return _=n.child,n=_.sibling,c=Sr(_,{mode:"visible",children:c.children}),(i.mode&1)===0&&(c.lanes=o),c.return=i,c.sibling=null,n!==null&&(o=i.deletions,o===null?(i.deletions=[n],i.flags|=16):o.push(n)),i.child=c,i.memoizedState=null,c}function pu(n,i){return i=ll({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function $a(n,i,o,c){return c!==null&&Hc(c),Ls(i,n.child,null,o),n=pu(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function vv(n,i,o,c,h,_,w){if(o)return i.flags&256?(i.flags&=-257,c=lu(Error(t(422))),$a(n,i,w,c)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(_=c.fallback,h=i.mode,c=ll({mode:"visible",children:c.children},h,0,null),_=Zr(_,h,w,null),_.flags|=2,c.return=i,_.return=i,c.sibling=_,i.child=c,(i.mode&1)!==0&&Ls(i,n.child,null,w),i.child.memoizedState=du(w),i.memoizedState=hu,_);if((i.mode&1)===0)return $a(n,i,w,null);if(h.data==="$!"){if(c=h.nextSibling&&h.nextSibling.dataset,c)var I=c.dgst;return c=I,_=Error(t(419)),c=lu(_,c,void 0),$a(n,i,w,c)}if(I=(w&n.childLanes)!==0,Dn||I){if(c=an,c!==null){switch(w&-w){case 4:h=2;break;case 16:h=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:h=32;break;case 536870912:h=268435456;break;default:h=0}h=(h&(c.suspendedLanes|w))!==0?0:h,h!==0&&h!==_.retryLane&&(_.retryLane=h,Gi(n,h),pi(c,n,h,-1))}return Pu(),c=lu(Error(t(421))),$a(n,i,w,c)}return h.data==="$?"?(i.flags|=128,i.child=n.child,i=Pv.bind(null,n),h._reactRetry=i,null):(n=_.treeContext,Gn=fr(h.nextSibling),Vn=i,Bt=!0,ui=null,n!==null&&(Jn[ei++]=Hi,Jn[ei++]=Vi,Jn[ei++]=Vr,Hi=n.id,Vi=n.overflow,Vr=i),i=pu(i,c.children),i.flags|=4096,i)}function wp(n,i,o){n.lanes|=i;var c=n.alternate;c!==null&&(c.lanes|=i),Xc(n.return,i,o)}function mu(n,i,o,c,h){var _=n.memoizedState;_===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:c,tail:o,tailMode:h}:(_.isBackwards=i,_.rendering=null,_.renderingStartTime=0,_.last=c,_.tail=o,_.tailMode=h)}function Tp(n,i,o){var c=i.pendingProps,h=c.revealOrder,_=c.tail;if(wn(n,i,c.children,o),c=Vt.current,(c&2)!==0)c=c&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&wp(n,o,i);else if(n.tag===19)wp(n,o,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}c&=1}if(Ft(Vt,c),(i.mode&1)===0)i.memoizedState=null;else switch(h){case"forwards":for(o=i.child,h=null;o!==null;)n=o.alternate,n!==null&&Va(n)===null&&(h=o),o=o.sibling;o=h,o===null?(h=i.child,i.child=null):(h=o.sibling,o.sibling=null),mu(i,!1,h,o,_);break;case"backwards":for(o=null,h=i.child,i.child=null;h!==null;){if(n=h.alternate,n!==null&&Va(n)===null){i.child=h;break}n=h.sibling,h.sibling=o,o=h,h=n}mu(i,!0,o,null,_);break;case"together":mu(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Ka(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Xi(n,i,o){if(n!==null&&(i.dependencies=n.dependencies),Yr|=i.lanes,(o&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,o=Sr(n,n.pendingProps),i.child=o,o.return=i;n.sibling!==null;)n=n.sibling,o=o.sibling=Sr(n,n.pendingProps),o.return=i;o.sibling=null}return i.child}function _v(n,i,o){switch(i.tag){case 3:Mp(i),Ps();break;case 5:kd(i);break;case 1:Ln(i.type)&&Da(i);break;case 4:qc(i,i.stateNode.containerInfo);break;case 10:var c=i.type._context,h=i.memoizedProps.value;Ft(za,c._currentValue),c._currentValue=h;break;case 13:if(c=i.memoizedState,c!==null)return c.dehydrated!==null?(Ft(Vt,Vt.current&1),i.flags|=128,null):(o&i.child.childLanes)!==0?Ep(n,i,o):(Ft(Vt,Vt.current&1),n=Xi(n,i,o),n!==null?n.sibling:null);Ft(Vt,Vt.current&1);break;case 19:if(c=(o&i.childLanes)!==0,(n.flags&128)!==0){if(c)return Tp(n,i,o);i.flags|=128}if(h=i.memoizedState,h!==null&&(h.rendering=null,h.tail=null,h.lastEffect=null),Ft(Vt,Vt.current),c)break;return null;case 22:case 23:return i.lanes=0,_p(n,i,o)}return Xi(n,i,o)}var Ap,gu,Rp,Cp;Ap=function(n,i){for(var o=i.child;o!==null;){if(o.tag===5||o.tag===6)n.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===i)break;for(;o.sibling===null;){if(o.return===null||o.return===i)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},gu=function(){},Rp=function(n,i,o,c){var h=n.memoizedProps;if(h!==c){n=i.stateNode,Xr(Ti.current);var _=null;switch(o){case"input":h=X(n,h),c=X(n,c),_=[];break;case"select":h=se({},h,{value:void 0}),c=se({},c,{value:void 0}),_=[];break;case"textarea":h=T(n,h),c=T(n,c),_=[];break;default:typeof h.onClick!="function"&&typeof c.onClick=="function"&&(n.onclick=ba)}ft(o,c);var w;o=null;for(J in h)if(!c.hasOwnProperty(J)&&h.hasOwnProperty(J)&&h[J]!=null)if(J==="style"){var I=h[J];for(w in I)I.hasOwnProperty(w)&&(o||(o={}),o[w]="")}else J!=="dangerouslySetInnerHTML"&&J!=="children"&&J!=="suppressContentEditableWarning"&&J!=="suppressHydrationWarning"&&J!=="autoFocus"&&(a.hasOwnProperty(J)?_||(_=[]):(_=_||[]).push(J,null));for(J in c){var O=c[J];if(I=h!=null?h[J]:void 0,c.hasOwnProperty(J)&&O!==I&&(O!=null||I!=null))if(J==="style")if(I){for(w in I)!I.hasOwnProperty(w)||O&&O.hasOwnProperty(w)||(o||(o={}),o[w]="");for(w in O)O.hasOwnProperty(w)&&I[w]!==O[w]&&(o||(o={}),o[w]=O[w])}else o||(_||(_=[]),_.push(J,o)),o=O;else J==="dangerouslySetInnerHTML"?(O=O?O.__html:void 0,I=I?I.__html:void 0,O!=null&&I!==O&&(_=_||[]).push(J,O)):J==="children"?typeof O!="string"&&typeof O!="number"||(_=_||[]).push(J,""+O):J!=="suppressContentEditableWarning"&&J!=="suppressHydrationWarning"&&(a.hasOwnProperty(J)?(O!=null&&J==="onScroll"&&zt("scroll",n),_||I===O||(_=[])):(_=_||[]).push(J,O))}o&&(_=_||[]).push("style",o);var J=_;(i.updateQueue=J)&&(i.flags|=4)}},Cp=function(n,i,o,c){o!==c&&(i.flags|=4)};function Vo(n,i){if(!Bt)switch(n.tailMode){case"hidden":i=n.tail;for(var o=null;i!==null;)i.alternate!==null&&(o=i),i=i.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var c=null;o!==null;)o.alternate!==null&&(c=o),o=o.sibling;c===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:c.sibling=null}}function vn(n){var i=n.alternate!==null&&n.alternate.child===n.child,o=0,c=0;if(i)for(var h=n.child;h!==null;)o|=h.lanes|h.childLanes,c|=h.subtreeFlags&14680064,c|=h.flags&14680064,h.return=n,h=h.sibling;else for(h=n.child;h!==null;)o|=h.lanes|h.childLanes,c|=h.subtreeFlags,c|=h.flags,h.return=n,h=h.sibling;return n.subtreeFlags|=c,n.childLanes=o,i}function xv(n,i,o){var c=i.pendingProps;switch(zc(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return vn(i),null;case 1:return Ln(i.type)&&La(),vn(i),null;case 3:return c=i.stateNode,Us(),kt(Pn),kt(mn),Zc(),c.pendingContext&&(c.context=c.pendingContext,c.pendingContext=null),(n===null||n.child===null)&&(Fa(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,ui!==null&&(Ru(ui),ui=null))),gu(n,i),vn(i),null;case 5:$c(i);var h=Xr(Oo.current);if(o=i.type,n!==null&&i.stateNode!=null)Rp(n,i,o,c,h),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!c){if(i.stateNode===null)throw Error(t(166));return vn(i),null}if(n=Xr(Ti.current),Fa(i)){c=i.stateNode,o=i.type;var _=i.memoizedProps;switch(c[wi]=i,c[Do]=_,n=(i.mode&1)!==0,o){case"dialog":zt("cancel",c),zt("close",c);break;case"iframe":case"object":case"embed":zt("load",c);break;case"video":case"audio":for(h=0;h<bo.length;h++)zt(bo[h],c);break;case"source":zt("error",c);break;case"img":case"image":case"link":zt("error",c),zt("load",c);break;case"details":zt("toggle",c);break;case"input":Mn(c,_),zt("invalid",c);break;case"select":c._wrapperState={wasMultiple:!!_.multiple},zt("invalid",c);break;case"textarea":Z(c,_),zt("invalid",c)}ft(o,_),h=null;for(var w in _)if(_.hasOwnProperty(w)){var I=_[w];w==="children"?typeof I=="string"?c.textContent!==I&&(_.suppressHydrationWarning!==!0&&Ca(c.textContent,I,n),h=["children",I]):typeof I=="number"&&c.textContent!==""+I&&(_.suppressHydrationWarning!==!0&&Ca(c.textContent,I,n),h=["children",""+I]):a.hasOwnProperty(w)&&I!=null&&w==="onScroll"&&zt("scroll",c)}switch(o){case"input":Pt(c),$e(c,_,!0);break;case"textarea":Pt(c),ge(c);break;case"select":case"option":break;default:typeof _.onClick=="function"&&(c.onclick=ba)}c=h,i.updateQueue=c,c!==null&&(i.flags|=4)}else{w=h.nodeType===9?h:h.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=he(o)),n==="http://www.w3.org/1999/xhtml"?o==="script"?(n=w.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof c.is=="string"?n=w.createElement(o,{is:c.is}):(n=w.createElement(o),o==="select"&&(w=n,c.multiple?w.multiple=!0:c.size&&(w.size=c.size))):n=w.createElementNS(n,o),n[wi]=i,n[Do]=c,Ap(n,i,!1,!1),i.stateNode=n;e:{switch(w=rt(o,c),o){case"dialog":zt("cancel",n),zt("close",n),h=c;break;case"iframe":case"object":case"embed":zt("load",n),h=c;break;case"video":case"audio":for(h=0;h<bo.length;h++)zt(bo[h],n);h=c;break;case"source":zt("error",n),h=c;break;case"img":case"image":case"link":zt("error",n),zt("load",n),h=c;break;case"details":zt("toggle",n),h=c;break;case"input":Mn(n,c),h=X(n,c),zt("invalid",n);break;case"option":h=c;break;case"select":n._wrapperState={wasMultiple:!!c.multiple},h=se({},c,{value:void 0}),zt("invalid",n);break;case"textarea":Z(n,c),h=T(n,c),zt("invalid",n);break;default:h=c}ft(o,h),I=h;for(_ in I)if(I.hasOwnProperty(_)){var O=I[_];_==="style"?et(n,O):_==="dangerouslySetInnerHTML"?(O=O?O.__html:void 0,O!=null&&Ne(n,O)):_==="children"?typeof O=="string"?(o!=="textarea"||O!=="")&&ct(n,O):typeof O=="number"&&ct(n,""+O):_!=="suppressContentEditableWarning"&&_!=="suppressHydrationWarning"&&_!=="autoFocus"&&(a.hasOwnProperty(_)?O!=null&&_==="onScroll"&&zt("scroll",n):O!=null&&L(n,_,O,w))}switch(o){case"input":Pt(n),$e(n,c,!1);break;case"textarea":Pt(n),ge(n);break;case"option":c.value!=null&&n.setAttribute("value",""+Te(c.value));break;case"select":n.multiple=!!c.multiple,_=c.value,_!=null?P(n,!!c.multiple,_,!1):c.defaultValue!=null&&P(n,!!c.multiple,c.defaultValue,!0);break;default:typeof h.onClick=="function"&&(n.onclick=ba)}switch(o){case"button":case"input":case"select":case"textarea":c=!!c.autoFocus;break e;case"img":c=!0;break e;default:c=!1}}c&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return vn(i),null;case 6:if(n&&i.stateNode!=null)Cp(n,i,n.memoizedProps,c);else{if(typeof c!="string"&&i.stateNode===null)throw Error(t(166));if(o=Xr(Oo.current),Xr(Ti.current),Fa(i)){if(c=i.stateNode,o=i.memoizedProps,c[wi]=i,(_=c.nodeValue!==o)&&(n=Vn,n!==null))switch(n.tag){case 3:Ca(c.nodeValue,o,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Ca(c.nodeValue,o,(n.mode&1)!==0)}_&&(i.flags|=4)}else c=(o.nodeType===9?o:o.ownerDocument).createTextNode(c),c[wi]=i,i.stateNode=c}return vn(i),null;case 13:if(kt(Vt),c=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Bt&&Gn!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Ld(),Ps(),i.flags|=98560,_=!1;else if(_=Fa(i),c!==null&&c.dehydrated!==null){if(n===null){if(!_)throw Error(t(318));if(_=i.memoizedState,_=_!==null?_.dehydrated:null,!_)throw Error(t(317));_[wi]=i}else Ps(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;vn(i),_=!1}else ui!==null&&(Ru(ui),ui=null),_=!0;if(!_)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=o,i):(c=c!==null,c!==(n!==null&&n.memoizedState!==null)&&c&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(Vt.current&1)!==0?Jt===0&&(Jt=3):Pu())),i.updateQueue!==null&&(i.flags|=4),vn(i),null);case 4:return Us(),gu(n,i),n===null&&Po(i.stateNode.containerInfo),vn(i),null;case 10:return Wc(i.type._context),vn(i),null;case 17:return Ln(i.type)&&La(),vn(i),null;case 19:if(kt(Vt),_=i.memoizedState,_===null)return vn(i),null;if(c=(i.flags&128)!==0,w=_.rendering,w===null)if(c)Vo(_,!1);else{if(Jt!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(w=Va(n),w!==null){for(i.flags|=128,Vo(_,!1),c=w.updateQueue,c!==null&&(i.updateQueue=c,i.flags|=4),i.subtreeFlags=0,c=o,o=i.child;o!==null;)_=o,n=c,_.flags&=14680066,w=_.alternate,w===null?(_.childLanes=0,_.lanes=n,_.child=null,_.subtreeFlags=0,_.memoizedProps=null,_.memoizedState=null,_.updateQueue=null,_.dependencies=null,_.stateNode=null):(_.childLanes=w.childLanes,_.lanes=w.lanes,_.child=w.child,_.subtreeFlags=0,_.deletions=null,_.memoizedProps=w.memoizedProps,_.memoizedState=w.memoizedState,_.updateQueue=w.updateQueue,_.type=w.type,n=w.dependencies,_.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),o=o.sibling;return Ft(Vt,Vt.current&1|2),i.child}n=n.sibling}_.tail!==null&&Me()>zs&&(i.flags|=128,c=!0,Vo(_,!1),i.lanes=4194304)}else{if(!c)if(n=Va(w),n!==null){if(i.flags|=128,c=!0,o=n.updateQueue,o!==null&&(i.updateQueue=o,i.flags|=4),Vo(_,!0),_.tail===null&&_.tailMode==="hidden"&&!w.alternate&&!Bt)return vn(i),null}else 2*Me()-_.renderingStartTime>zs&&o!==1073741824&&(i.flags|=128,c=!0,Vo(_,!1),i.lanes=4194304);_.isBackwards?(w.sibling=i.child,i.child=w):(o=_.last,o!==null?o.sibling=w:i.child=w,_.last=w)}return _.tail!==null?(i=_.tail,_.rendering=i,_.tail=i.sibling,_.renderingStartTime=Me(),i.sibling=null,o=Vt.current,Ft(Vt,c?o&1|2:o&1),i):(vn(i),null);case 22:case 23:return bu(),c=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==c&&(i.flags|=8192),c&&(i.mode&1)!==0?(Wn&1073741824)!==0&&(vn(i),i.subtreeFlags&6&&(i.flags|=8192)):vn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function yv(n,i){switch(zc(i),i.tag){case 1:return Ln(i.type)&&La(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Us(),kt(Pn),kt(mn),Zc(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return $c(i),null;case 13:if(kt(Vt),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));Ps()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return kt(Vt),null;case 4:return Us(),null;case 10:return Wc(i.type._context),null;case 22:case 23:return bu(),null;case 24:return null;default:return null}}var Za=!1,_n=!1,Mv=typeof WeakSet=="function"?WeakSet:Set,Fe=null;function Fs(n,i){var o=n.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(c){Wt(n,i,c)}else o.current=null}function vu(n,i,o){try{o()}catch(c){Wt(n,i,c)}}var bp=!1;function Sv(n,i){if(bc=va,n=ad(),Mc(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var c=o.getSelection&&o.getSelection();if(c&&c.rangeCount!==0){o=c.anchorNode;var h=c.anchorOffset,_=c.focusNode;c=c.focusOffset;try{o.nodeType,_.nodeType}catch{o=null;break e}var w=0,I=-1,O=-1,J=0,ve=0,xe=n,me=null;t:for(;;){for(var De;xe!==o||h!==0&&xe.nodeType!==3||(I=w+h),xe!==_||c!==0&&xe.nodeType!==3||(O=w+c),xe.nodeType===3&&(w+=xe.nodeValue.length),(De=xe.firstChild)!==null;)me=xe,xe=De;for(;;){if(xe===n)break t;if(me===o&&++J===h&&(I=w),me===_&&++ve===c&&(O=w),(De=xe.nextSibling)!==null)break;xe=me,me=xe.parentNode}xe=De}o=I===-1||O===-1?null:{start:I,end:O}}else o=null}o=o||{start:0,end:0}}else o=null;for(Pc={focusedElem:n,selectionRange:o},va=!1,Fe=i;Fe!==null;)if(i=Fe,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,Fe=n;else for(;Fe!==null;){i=Fe;try{var Be=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(Be!==null){var Ve=Be.memoizedProps,Xt=Be.memoizedState,Y=i.stateNode,B=Y.getSnapshotBeforeUpdate(i.elementType===i.type?Ve:fi(i.type,Ve),Xt);Y.__reactInternalSnapshotBeforeUpdate=B}break;case 3:var $=i.stateNode.containerInfo;$.nodeType===1?$.textContent="":$.nodeType===9&&$.documentElement&&$.removeChild($.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Ee){Wt(i,i.return,Ee)}if(n=i.sibling,n!==null){n.return=i.return,Fe=n;break}Fe=i.return}return Be=bp,bp=!1,Be}function Go(n,i,o){var c=i.updateQueue;if(c=c!==null?c.lastEffect:null,c!==null){var h=c=c.next;do{if((h.tag&n)===n){var _=h.destroy;h.destroy=void 0,_!==void 0&&vu(i,o,_)}h=h.next}while(h!==c)}}function Qa(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var o=i=i.next;do{if((o.tag&n)===n){var c=o.create;o.destroy=c()}o=o.next}while(o!==i)}}function _u(n){var i=n.ref;if(i!==null){var o=n.stateNode;switch(n.tag){case 5:n=o;break;default:n=o}typeof i=="function"?i(n):i.current=n}}function Pp(n){var i=n.alternate;i!==null&&(n.alternate=null,Pp(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[wi],delete i[Do],delete i[Uc],delete i[rv],delete i[sv])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Lp(n){return n.tag===5||n.tag===3||n.tag===4}function Dp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Lp(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function xu(n,i,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?o.nodeType===8?o.parentNode.insertBefore(n,i):o.insertBefore(n,i):(o.nodeType===8?(i=o.parentNode,i.insertBefore(n,o)):(i=o,i.appendChild(n)),o=o._reactRootContainer,o!=null||i.onclick!==null||(i.onclick=ba));else if(c!==4&&(n=n.child,n!==null))for(xu(n,i,o),n=n.sibling;n!==null;)xu(n,i,o),n=n.sibling}function yu(n,i,o){var c=n.tag;if(c===5||c===6)n=n.stateNode,i?o.insertBefore(n,i):o.appendChild(n);else if(c!==4&&(n=n.child,n!==null))for(yu(n,i,o),n=n.sibling;n!==null;)yu(n,i,o),n=n.sibling}var fn=null,hi=!1;function vr(n,i,o){for(o=o.child;o!==null;)Ip(n,i,o),o=o.sibling}function Ip(n,i,o){if(mt&&typeof mt.onCommitFiberUnmount=="function")try{mt.onCommitFiberUnmount(Tt,o)}catch{}switch(o.tag){case 5:_n||Fs(o,i);case 6:var c=fn,h=hi;fn=null,vr(n,i,o),fn=c,hi=h,fn!==null&&(hi?(n=fn,o=o.stateNode,n.nodeType===8?n.parentNode.removeChild(o):n.removeChild(o)):fn.removeChild(o.stateNode));break;case 18:fn!==null&&(hi?(n=fn,o=o.stateNode,n.nodeType===8?Ic(n.parentNode,o):n.nodeType===1&&Ic(n,o),Mo(n)):Ic(fn,o.stateNode));break;case 4:c=fn,h=hi,fn=o.stateNode.containerInfo,hi=!0,vr(n,i,o),fn=c,hi=h;break;case 0:case 11:case 14:case 15:if(!_n&&(c=o.updateQueue,c!==null&&(c=c.lastEffect,c!==null))){h=c=c.next;do{var _=h,w=_.destroy;_=_.tag,w!==void 0&&((_&2)!==0||(_&4)!==0)&&vu(o,i,w),h=h.next}while(h!==c)}vr(n,i,o);break;case 1:if(!_n&&(Fs(o,i),c=o.stateNode,typeof c.componentWillUnmount=="function"))try{c.props=o.memoizedProps,c.state=o.memoizedState,c.componentWillUnmount()}catch(I){Wt(o,i,I)}vr(n,i,o);break;case 21:vr(n,i,o);break;case 22:o.mode&1?(_n=(c=_n)||o.memoizedState!==null,vr(n,i,o),_n=c):vr(n,i,o);break;default:vr(n,i,o)}}function Up(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var o=n.stateNode;o===null&&(o=n.stateNode=new Mv),i.forEach(function(c){var h=Lv.bind(null,n,c);o.has(c)||(o.add(c),c.then(h,h))})}}function di(n,i){var o=i.deletions;if(o!==null)for(var c=0;c<o.length;c++){var h=o[c];try{var _=n,w=i,I=w;e:for(;I!==null;){switch(I.tag){case 5:fn=I.stateNode,hi=!1;break e;case 3:fn=I.stateNode.containerInfo,hi=!0;break e;case 4:fn=I.stateNode.containerInfo,hi=!0;break e}I=I.return}if(fn===null)throw Error(t(160));Ip(_,w,h),fn=null,hi=!1;var O=h.alternate;O!==null&&(O.return=null),h.return=null}catch(J){Wt(h,i,J)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)Np(i,n),i=i.sibling}function Np(n,i){var o=n.alternate,c=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(di(i,n),Ri(n),c&4){try{Go(3,n,n.return),Qa(3,n)}catch(Ve){Wt(n,n.return,Ve)}try{Go(5,n,n.return)}catch(Ve){Wt(n,n.return,Ve)}}break;case 1:di(i,n),Ri(n),c&512&&o!==null&&Fs(o,o.return);break;case 5:if(di(i,n),Ri(n),c&512&&o!==null&&Fs(o,o.return),n.flags&32){var h=n.stateNode;try{ct(h,"")}catch(Ve){Wt(n,n.return,Ve)}}if(c&4&&(h=n.stateNode,h!=null)){var _=n.memoizedProps,w=o!==null?o.memoizedProps:_,I=n.type,O=n.updateQueue;if(n.updateQueue=null,O!==null)try{I==="input"&&_.type==="radio"&&_.name!=null&&dt(h,_),rt(I,w);var J=rt(I,_);for(w=0;w<O.length;w+=2){var ve=O[w],xe=O[w+1];ve==="style"?et(h,xe):ve==="dangerouslySetInnerHTML"?Ne(h,xe):ve==="children"?ct(h,xe):L(h,ve,xe,J)}switch(I){case"input":ut(h,_);break;case"textarea":pe(h,_);break;case"select":var me=h._wrapperState.wasMultiple;h._wrapperState.wasMultiple=!!_.multiple;var De=_.value;De!=null?P(h,!!_.multiple,De,!1):me!==!!_.multiple&&(_.defaultValue!=null?P(h,!!_.multiple,_.defaultValue,!0):P(h,!!_.multiple,_.multiple?[]:"",!1))}h[Do]=_}catch(Ve){Wt(n,n.return,Ve)}}break;case 6:if(di(i,n),Ri(n),c&4){if(n.stateNode===null)throw Error(t(162));h=n.stateNode,_=n.memoizedProps;try{h.nodeValue=_}catch(Ve){Wt(n,n.return,Ve)}}break;case 3:if(di(i,n),Ri(n),c&4&&o!==null&&o.memoizedState.isDehydrated)try{Mo(i.containerInfo)}catch(Ve){Wt(n,n.return,Ve)}break;case 4:di(i,n),Ri(n);break;case 13:di(i,n),Ri(n),h=n.child,h.flags&8192&&(_=h.memoizedState!==null,h.stateNode.isHidden=_,!_||h.alternate!==null&&h.alternate.memoizedState!==null||(Eu=Me())),c&4&&Up(n);break;case 22:if(ve=o!==null&&o.memoizedState!==null,n.mode&1?(_n=(J=_n)||ve,di(i,n),_n=J):di(i,n),Ri(n),c&8192){if(J=n.memoizedState!==null,(n.stateNode.isHidden=J)&&!ve&&(n.mode&1)!==0)for(Fe=n,ve=n.child;ve!==null;){for(xe=Fe=ve;Fe!==null;){switch(me=Fe,De=me.child,me.tag){case 0:case 11:case 14:case 15:Go(4,me,me.return);break;case 1:Fs(me,me.return);var Be=me.stateNode;if(typeof Be.componentWillUnmount=="function"){c=me,o=me.return;try{i=c,Be.props=i.memoizedProps,Be.state=i.memoizedState,Be.componentWillUnmount()}catch(Ve){Wt(c,o,Ve)}}break;case 5:Fs(me,me.return);break;case 22:if(me.memoizedState!==null){zp(xe);continue}}De!==null?(De.return=me,Fe=De):zp(xe)}ve=ve.sibling}e:for(ve=null,xe=n;;){if(xe.tag===5){if(ve===null){ve=xe;try{h=xe.stateNode,J?(_=h.style,typeof _.setProperty=="function"?_.setProperty("display","none","important"):_.display="none"):(I=xe.stateNode,O=xe.memoizedProps.style,w=O!=null&&O.hasOwnProperty("display")?O.display:null,I.style.display=Je("display",w))}catch(Ve){Wt(n,n.return,Ve)}}}else if(xe.tag===6){if(ve===null)try{xe.stateNode.nodeValue=J?"":xe.memoizedProps}catch(Ve){Wt(n,n.return,Ve)}}else if((xe.tag!==22&&xe.tag!==23||xe.memoizedState===null||xe===n)&&xe.child!==null){xe.child.return=xe,xe=xe.child;continue}if(xe===n)break e;for(;xe.sibling===null;){if(xe.return===null||xe.return===n)break e;ve===xe&&(ve=null),xe=xe.return}ve===xe&&(ve=null),xe.sibling.return=xe.return,xe=xe.sibling}}break;case 19:di(i,n),Ri(n),c&4&&Up(n);break;case 21:break;default:di(i,n),Ri(n)}}function Ri(n){var i=n.flags;if(i&2){try{e:{for(var o=n.return;o!==null;){if(Lp(o)){var c=o;break e}o=o.return}throw Error(t(160))}switch(c.tag){case 5:var h=c.stateNode;c.flags&32&&(ct(h,""),c.flags&=-33);var _=Dp(n);yu(n,_,h);break;case 3:case 4:var w=c.stateNode.containerInfo,I=Dp(n);xu(n,I,w);break;default:throw Error(t(161))}}catch(O){Wt(n,n.return,O)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function Ev(n,i,o){Fe=n,Fp(n)}function Fp(n,i,o){for(var c=(n.mode&1)!==0;Fe!==null;){var h=Fe,_=h.child;if(h.tag===22&&c){var w=h.memoizedState!==null||Za;if(!w){var I=h.alternate,O=I!==null&&I.memoizedState!==null||_n;I=Za;var J=_n;if(Za=w,(_n=O)&&!J)for(Fe=h;Fe!==null;)w=Fe,O=w.child,w.tag===22&&w.memoizedState!==null?kp(h):O!==null?(O.return=w,Fe=O):kp(h);for(;_!==null;)Fe=_,Fp(_),_=_.sibling;Fe=h,Za=I,_n=J}Op(n)}else(h.subtreeFlags&8772)!==0&&_!==null?(_.return=h,Fe=_):Op(n)}}function Op(n){for(;Fe!==null;){var i=Fe;if((i.flags&8772)!==0){var o=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:_n||Qa(5,i);break;case 1:var c=i.stateNode;if(i.flags&4&&!_n)if(o===null)c.componentDidMount();else{var h=i.elementType===i.type?o.memoizedProps:fi(i.type,o.memoizedProps);c.componentDidUpdate(h,o.memoizedState,c.__reactInternalSnapshotBeforeUpdate)}var _=i.updateQueue;_!==null&&zd(i,_,c);break;case 3:var w=i.updateQueue;if(w!==null){if(o=null,i.child!==null)switch(i.child.tag){case 5:o=i.child.stateNode;break;case 1:o=i.child.stateNode}zd(i,w,o)}break;case 5:var I=i.stateNode;if(o===null&&i.flags&4){o=I;var O=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":O.autoFocus&&o.focus();break;case"img":O.src&&(o.src=O.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var J=i.alternate;if(J!==null){var ve=J.memoizedState;if(ve!==null){var xe=ve.dehydrated;xe!==null&&Mo(xe)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}_n||i.flags&512&&_u(i)}catch(me){Wt(i,i.return,me)}}if(i===n){Fe=null;break}if(o=i.sibling,o!==null){o.return=i.return,Fe=o;break}Fe=i.return}}function zp(n){for(;Fe!==null;){var i=Fe;if(i===n){Fe=null;break}var o=i.sibling;if(o!==null){o.return=i.return,Fe=o;break}Fe=i.return}}function kp(n){for(;Fe!==null;){var i=Fe;try{switch(i.tag){case 0:case 11:case 15:var o=i.return;try{Qa(4,i)}catch(O){Wt(i,o,O)}break;case 1:var c=i.stateNode;if(typeof c.componentDidMount=="function"){var h=i.return;try{c.componentDidMount()}catch(O){Wt(i,h,O)}}var _=i.return;try{_u(i)}catch(O){Wt(i,_,O)}break;case 5:var w=i.return;try{_u(i)}catch(O){Wt(i,w,O)}}}catch(O){Wt(i,i.return,O)}if(i===n){Fe=null;break}var I=i.sibling;if(I!==null){I.return=i.return,Fe=I;break}Fe=i.return}}var wv=Math.ceil,Ja=A.ReactCurrentDispatcher,Mu=A.ReactCurrentOwner,ii=A.ReactCurrentBatchConfig,Mt=0,an=null,Yt=null,hn=0,Wn=0,Os=hr(0),Jt=0,Wo=null,Yr=0,el=0,Su=0,Xo=null,In=null,Eu=0,zs=1/0,ji=null,tl=!1,wu=null,_r=null,nl=!1,xr=null,il=0,jo=0,Tu=null,rl=-1,sl=0;function Tn(){return(Mt&6)!==0?Me():rl!==-1?rl:rl=Me()}function yr(n){return(n.mode&1)===0?1:(Mt&2)!==0&&hn!==0?hn&-hn:av.transition!==null?(sl===0&&(sl=En()),sl):(n=bt,n!==0||(n=window.event,n=n===void 0?16:Hh(n.type)),n)}function pi(n,i,o,c){if(50<jo)throw jo=0,Tu=null,Error(t(185));bn(n,o,c),((Mt&2)===0||n!==an)&&(n===an&&((Mt&2)===0&&(el|=o),Jt===4&&Mr(n,hn)),Un(n,c),o===1&&Mt===0&&(i.mode&1)===0&&(zs=Me()+500,Ia&&pr()))}function Un(n,i){var o=n.callbackNode;Zn(n,i);var c=Ei(n,n===an?hn:0);if(c===0)o!==null&&te(o),n.callbackNode=null,n.callbackPriority=0;else if(i=c&-c,n.callbackPriority!==i){if(o!=null&&te(o),i===1)n.tag===0?ov(Hp.bind(null,n)):Ad(Hp.bind(null,n)),nv(function(){(Mt&6)===0&&pr()}),o=null;else{switch(Ih(c)){case 1:o=He;break;case 4:o=tt;break;case 16:o=it;break;case 536870912:o=gt;break;default:o=it}o=$p(o,Bp.bind(null,n))}n.callbackPriority=i,n.callbackNode=o}}function Bp(n,i){if(rl=-1,sl=0,(Mt&6)!==0)throw Error(t(327));var o=n.callbackNode;if(ks()&&n.callbackNode!==o)return null;var c=Ei(n,n===an?hn:0);if(c===0)return null;if((c&30)!==0||(c&n.expiredLanes)!==0||i)i=ol(n,c);else{i=c;var h=Mt;Mt|=2;var _=Gp();(an!==n||hn!==i)&&(ji=null,zs=Me()+500,$r(n,i));do try{Rv();break}catch(I){Vp(n,I)}while(!0);Gc(),Ja.current=_,Mt=h,Yt!==null?i=0:(an=null,hn=0,i=Jt)}if(i!==0){if(i===2&&(h=zi(n),h!==0&&(c=h,i=Au(n,h))),i===1)throw o=Wo,$r(n,0),Mr(n,c),Un(n,Me()),o;if(i===6)Mr(n,c);else{if(h=n.current.alternate,(c&30)===0&&!Tv(h)&&(i=ol(n,c),i===2&&(_=zi(n),_!==0&&(c=_,i=Au(n,_))),i===1))throw o=Wo,$r(n,0),Mr(n,c),Un(n,Me()),o;switch(n.finishedWork=h,n.finishedLanes=c,i){case 0:case 1:throw Error(t(345));case 2:Kr(n,In,ji);break;case 3:if(Mr(n,c),(c&130023424)===c&&(i=Eu+500-Me(),10<i)){if(Ei(n,0)!==0)break;if(h=n.suspendedLanes,(h&c)!==c){Tn(),n.pingedLanes|=n.suspendedLanes&h;break}n.timeoutHandle=Dc(Kr.bind(null,n,In,ji),i);break}Kr(n,In,ji);break;case 4:if(Mr(n,c),(c&4194240)===c)break;for(i=n.eventTimes,h=-1;0<c;){var w=31-ot(c);_=1<<w,w=i[w],w>h&&(h=w),c&=~_}if(c=h,c=Me()-c,c=(120>c?120:480>c?480:1080>c?1080:1920>c?1920:3e3>c?3e3:4320>c?4320:1960*wv(c/1960))-c,10<c){n.timeoutHandle=Dc(Kr.bind(null,n,In,ji),c);break}Kr(n,In,ji);break;case 5:Kr(n,In,ji);break;default:throw Error(t(329))}}}return Un(n,Me()),n.callbackNode===o?Bp.bind(null,n):null}function Au(n,i){var o=Xo;return n.current.memoizedState.isDehydrated&&($r(n,i).flags|=256),n=ol(n,i),n!==2&&(i=In,In=o,i!==null&&Ru(i)),n}function Ru(n){In===null?In=n:In.push.apply(In,n)}function Tv(n){for(var i=n;;){if(i.flags&16384){var o=i.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var c=0;c<o.length;c++){var h=o[c],_=h.getSnapshot;h=h.value;try{if(!ci(_(),h))return!1}catch{return!1}}}if(o=i.child,i.subtreeFlags&16384&&o!==null)o.return=i,i=o;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function Mr(n,i){for(i&=~Su,i&=~el,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var o=31-ot(i),c=1<<o;n[o]=-1,i&=~c}}function Hp(n){if((Mt&6)!==0)throw Error(t(327));ks();var i=Ei(n,0);if((i&1)===0)return Un(n,Me()),null;var o=ol(n,i);if(n.tag!==0&&o===2){var c=zi(n);c!==0&&(i=c,o=Au(n,c))}if(o===1)throw o=Wo,$r(n,0),Mr(n,i),Un(n,Me()),o;if(o===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,Kr(n,In,ji),Un(n,Me()),null}function Cu(n,i){var o=Mt;Mt|=1;try{return n(i)}finally{Mt=o,Mt===0&&(zs=Me()+500,Ia&&pr())}}function qr(n){xr!==null&&xr.tag===0&&(Mt&6)===0&&ks();var i=Mt;Mt|=1;var o=ii.transition,c=bt;try{if(ii.transition=null,bt=1,n)return n()}finally{bt=c,ii.transition=o,Mt=i,(Mt&6)===0&&pr()}}function bu(){Wn=Os.current,kt(Os)}function $r(n,i){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;if(o!==-1&&(n.timeoutHandle=-1,tv(o)),Yt!==null)for(o=Yt.return;o!==null;){var c=o;switch(zc(c),c.tag){case 1:c=c.type.childContextTypes,c!=null&&La();break;case 3:Us(),kt(Pn),kt(mn),Zc();break;case 5:$c(c);break;case 4:Us();break;case 13:kt(Vt);break;case 19:kt(Vt);break;case 10:Wc(c.type._context);break;case 22:case 23:bu()}o=o.return}if(an=n,Yt=n=Sr(n.current,null),hn=Wn=i,Jt=0,Wo=null,Su=el=Yr=0,In=Xo=null,Wr!==null){for(i=0;i<Wr.length;i++)if(o=Wr[i],c=o.interleaved,c!==null){o.interleaved=null;var h=c.next,_=o.pending;if(_!==null){var w=_.next;_.next=h,c.next=w}o.pending=c}Wr=null}return n}function Vp(n,i){do{var o=Yt;try{if(Gc(),Ga.current=Ya,Wa){for(var c=Gt.memoizedState;c!==null;){var h=c.queue;h!==null&&(h.pending=null),c=c.next}Wa=!1}if(jr=0,on=Qt=Gt=null,zo=!1,ko=0,Mu.current=null,o===null||o.return===null){Jt=1,Wo=i,Yt=null;break}e:{var _=n,w=o.return,I=o,O=i;if(i=hn,I.flags|=32768,O!==null&&typeof O=="object"&&typeof O.then=="function"){var J=O,ve=I,xe=ve.tag;if((ve.mode&1)===0&&(xe===0||xe===11||xe===15)){var me=ve.alternate;me?(ve.updateQueue=me.updateQueue,ve.memoizedState=me.memoizedState,ve.lanes=me.lanes):(ve.updateQueue=null,ve.memoizedState=null)}var De=dp(w);if(De!==null){De.flags&=-257,pp(De,w,I,_,i),De.mode&1&&hp(_,J,i),i=De,O=J;var Be=i.updateQueue;if(Be===null){var Ve=new Set;Ve.add(O),i.updateQueue=Ve}else Be.add(O);break e}else{if((i&1)===0){hp(_,J,i),Pu();break e}O=Error(t(426))}}else if(Bt&&I.mode&1){var Xt=dp(w);if(Xt!==null){(Xt.flags&65536)===0&&(Xt.flags|=256),pp(Xt,w,I,_,i),Hc(Ns(O,I));break e}}_=O=Ns(O,I),Jt!==4&&(Jt=2),Xo===null?Xo=[_]:Xo.push(_),_=w;do{switch(_.tag){case 3:_.flags|=65536,i&=-i,_.lanes|=i;var Y=up(_,O,i);Od(_,Y);break e;case 1:I=O;var B=_.type,$=_.stateNode;if((_.flags&128)===0&&(typeof B.getDerivedStateFromError=="function"||$!==null&&typeof $.componentDidCatch=="function"&&(_r===null||!_r.has($)))){_.flags|=65536,i&=-i,_.lanes|=i;var Ee=fp(_,I,i);Od(_,Ee);break e}}_=_.return}while(_!==null)}Xp(o)}catch(je){i=je,Yt===o&&o!==null&&(Yt=o=o.return);continue}break}while(!0)}function Gp(){var n=Ja.current;return Ja.current=Ya,n===null?Ya:n}function Pu(){(Jt===0||Jt===3||Jt===2)&&(Jt=4),an===null||(Yr&268435455)===0&&(el&268435455)===0||Mr(an,hn)}function ol(n,i){var o=Mt;Mt|=2;var c=Gp();(an!==n||hn!==i)&&(ji=null,$r(n,i));do try{Av();break}catch(h){Vp(n,h)}while(!0);if(Gc(),Mt=o,Ja.current=c,Yt!==null)throw Error(t(261));return an=null,hn=0,Jt}function Av(){for(;Yt!==null;)Wp(Yt)}function Rv(){for(;Yt!==null&&!W();)Wp(Yt)}function Wp(n){var i=qp(n.alternate,n,Wn);n.memoizedProps=n.pendingProps,i===null?Xp(n):Yt=i,Mu.current=null}function Xp(n){var i=n;do{var o=i.alternate;if(n=i.return,(i.flags&32768)===0){if(o=xv(o,i,Wn),o!==null){Yt=o;return}}else{if(o=yv(o,i),o!==null){o.flags&=32767,Yt=o;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Jt=6,Yt=null;return}}if(i=i.sibling,i!==null){Yt=i;return}Yt=i=n}while(i!==null);Jt===0&&(Jt=5)}function Kr(n,i,o){var c=bt,h=ii.transition;try{ii.transition=null,bt=1,Cv(n,i,o,c)}finally{ii.transition=h,bt=c}return null}function Cv(n,i,o,c){do ks();while(xr!==null);if((Mt&6)!==0)throw Error(t(327));o=n.finishedWork;var h=n.finishedLanes;if(o===null)return null;if(n.finishedWork=null,n.finishedLanes=0,o===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var _=o.lanes|o.childLanes;if(pa(n,_),n===an&&(Yt=an=null,hn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||nl||(nl=!0,$p(it,function(){return ks(),null})),_=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||_){_=ii.transition,ii.transition=null;var w=bt;bt=1;var I=Mt;Mt|=4,Mu.current=null,Sv(n,o),Np(o,n),q0(Pc),va=!!bc,Pc=bc=null,n.current=o,Ev(o),we(),Mt=I,bt=w,ii.transition=_}else n.current=o;if(nl&&(nl=!1,xr=n,il=h),_=n.pendingLanes,_===0&&(_r=null),dn(o.stateNode),Un(n,Me()),i!==null)for(c=n.onRecoverableError,o=0;o<i.length;o++)h=i[o],c(h.value,{componentStack:h.stack,digest:h.digest});if(tl)throw tl=!1,n=wu,wu=null,n;return(il&1)!==0&&n.tag!==0&&ks(),_=n.pendingLanes,(_&1)!==0?n===Tu?jo++:(jo=0,Tu=n):jo=0,pr(),null}function ks(){if(xr!==null){var n=Ih(il),i=ii.transition,o=bt;try{if(ii.transition=null,bt=16>n?16:n,xr===null)var c=!1;else{if(n=xr,xr=null,il=0,(Mt&6)!==0)throw Error(t(331));var h=Mt;for(Mt|=4,Fe=n.current;Fe!==null;){var _=Fe,w=_.child;if((Fe.flags&16)!==0){var I=_.deletions;if(I!==null){for(var O=0;O<I.length;O++){var J=I[O];for(Fe=J;Fe!==null;){var ve=Fe;switch(ve.tag){case 0:case 11:case 15:Go(8,ve,_)}var xe=ve.child;if(xe!==null)xe.return=ve,Fe=xe;else for(;Fe!==null;){ve=Fe;var me=ve.sibling,De=ve.return;if(Pp(ve),ve===J){Fe=null;break}if(me!==null){me.return=De,Fe=me;break}Fe=De}}}var Be=_.alternate;if(Be!==null){var Ve=Be.child;if(Ve!==null){Be.child=null;do{var Xt=Ve.sibling;Ve.sibling=null,Ve=Xt}while(Ve!==null)}}Fe=_}}if((_.subtreeFlags&2064)!==0&&w!==null)w.return=_,Fe=w;else e:for(;Fe!==null;){if(_=Fe,(_.flags&2048)!==0)switch(_.tag){case 0:case 11:case 15:Go(9,_,_.return)}var Y=_.sibling;if(Y!==null){Y.return=_.return,Fe=Y;break e}Fe=_.return}}var B=n.current;for(Fe=B;Fe!==null;){w=Fe;var $=w.child;if((w.subtreeFlags&2064)!==0&&$!==null)$.return=w,Fe=$;else e:for(w=B;Fe!==null;){if(I=Fe,(I.flags&2048)!==0)try{switch(I.tag){case 0:case 11:case 15:Qa(9,I)}}catch(je){Wt(I,I.return,je)}if(I===w){Fe=null;break e}var Ee=I.sibling;if(Ee!==null){Ee.return=I.return,Fe=Ee;break e}Fe=I.return}}if(Mt=h,pr(),mt&&typeof mt.onPostCommitFiberRoot=="function")try{mt.onPostCommitFiberRoot(Tt,n)}catch{}c=!0}return c}finally{bt=o,ii.transition=i}}return!1}function jp(n,i,o){i=Ns(o,i),i=up(n,i,1),n=gr(n,i,1),i=Tn(),n!==null&&(bn(n,1,i),Un(n,i))}function Wt(n,i,o){if(n.tag===3)jp(n,n,o);else for(;i!==null;){if(i.tag===3){jp(i,n,o);break}else if(i.tag===1){var c=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof c.componentDidCatch=="function"&&(_r===null||!_r.has(c))){n=Ns(o,n),n=fp(i,n,1),i=gr(i,n,1),n=Tn(),i!==null&&(bn(i,1,n),Un(i,n));break}}i=i.return}}function bv(n,i,o){var c=n.pingCache;c!==null&&c.delete(i),i=Tn(),n.pingedLanes|=n.suspendedLanes&o,an===n&&(hn&o)===o&&(Jt===4||Jt===3&&(hn&130023424)===hn&&500>Me()-Eu?$r(n,0):Su|=o),Un(n,i)}function Yp(n,i){i===0&&((n.mode&1)===0?i=1:(i=li,li<<=1,(li&130023424)===0&&(li=4194304)));var o=Tn();n=Gi(n,i),n!==null&&(bn(n,i,o),Un(n,o))}function Pv(n){var i=n.memoizedState,o=0;i!==null&&(o=i.retryLane),Yp(n,o)}function Lv(n,i){var o=0;switch(n.tag){case 13:var c=n.stateNode,h=n.memoizedState;h!==null&&(o=h.retryLane);break;case 19:c=n.stateNode;break;default:throw Error(t(314))}c!==null&&c.delete(i),Yp(n,o)}var qp;qp=function(n,i,o){if(n!==null)if(n.memoizedProps!==i.pendingProps||Pn.current)Dn=!0;else{if((n.lanes&o)===0&&(i.flags&128)===0)return Dn=!1,_v(n,i,o);Dn=(n.flags&131072)!==0}else Dn=!1,Bt&&(i.flags&1048576)!==0&&Rd(i,Na,i.index);switch(i.lanes=0,i.tag){case 2:var c=i.type;Ka(n,i),n=i.pendingProps;var h=Rs(i,mn.current);Is(i,o),h=eu(null,i,c,n,h,o);var _=tu();return i.flags|=1,typeof h=="object"&&h!==null&&typeof h.render=="function"&&h.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,Ln(c)?(_=!0,Da(i)):_=!1,i.memoizedState=h.state!==null&&h.state!==void 0?h.state:null,Yc(i),h.updater=qa,i.stateNode=h,h._reactInternals=i,au(i,c,n,o),i=fu(null,i,c,!0,_,o)):(i.tag=0,Bt&&_&&Oc(i),wn(null,i,h,o),i=i.child),i;case 16:c=i.elementType;e:{switch(Ka(n,i),n=i.pendingProps,h=c._init,c=h(c._payload),i.type=c,h=i.tag=Iv(c),n=fi(c,n),h){case 0:i=uu(null,i,c,n,o);break e;case 1:i=yp(null,i,c,n,o);break e;case 11:i=mp(null,i,c,n,o);break e;case 14:i=gp(null,i,c,fi(c.type,n),o);break e}throw Error(t(306,c,""))}return i;case 0:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:fi(c,h),uu(n,i,c,h,o);case 1:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:fi(c,h),yp(n,i,c,h,o);case 3:e:{if(Mp(i),n===null)throw Error(t(387));c=i.pendingProps,_=i.memoizedState,h=_.element,Fd(n,i),Ha(i,c,null,o);var w=i.memoizedState;if(c=w.element,_.isDehydrated)if(_={element:c,isDehydrated:!1,cache:w.cache,pendingSuspenseBoundaries:w.pendingSuspenseBoundaries,transitions:w.transitions},i.updateQueue.baseState=_,i.memoizedState=_,i.flags&256){h=Ns(Error(t(423)),i),i=Sp(n,i,c,o,h);break e}else if(c!==h){h=Ns(Error(t(424)),i),i=Sp(n,i,c,o,h);break e}else for(Gn=fr(i.stateNode.containerInfo.firstChild),Vn=i,Bt=!0,ui=null,o=Ud(i,null,c,o),i.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(Ps(),c===h){i=Xi(n,i,o);break e}wn(n,i,c,o)}i=i.child}return i;case 5:return kd(i),n===null&&Bc(i),c=i.type,h=i.pendingProps,_=n!==null?n.memoizedProps:null,w=h.children,Lc(c,h)?w=null:_!==null&&Lc(c,_)&&(i.flags|=32),xp(n,i),wn(n,i,w,o),i.child;case 6:return n===null&&Bc(i),null;case 13:return Ep(n,i,o);case 4:return qc(i,i.stateNode.containerInfo),c=i.pendingProps,n===null?i.child=Ls(i,null,c,o):wn(n,i,c,o),i.child;case 11:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:fi(c,h),mp(n,i,c,h,o);case 7:return wn(n,i,i.pendingProps,o),i.child;case 8:return wn(n,i,i.pendingProps.children,o),i.child;case 12:return wn(n,i,i.pendingProps.children,o),i.child;case 10:e:{if(c=i.type._context,h=i.pendingProps,_=i.memoizedProps,w=h.value,Ft(za,c._currentValue),c._currentValue=w,_!==null)if(ci(_.value,w)){if(_.children===h.children&&!Pn.current){i=Xi(n,i,o);break e}}else for(_=i.child,_!==null&&(_.return=i);_!==null;){var I=_.dependencies;if(I!==null){w=_.child;for(var O=I.firstContext;O!==null;){if(O.context===c){if(_.tag===1){O=Wi(-1,o&-o),O.tag=2;var J=_.updateQueue;if(J!==null){J=J.shared;var ve=J.pending;ve===null?O.next=O:(O.next=ve.next,ve.next=O),J.pending=O}}_.lanes|=o,O=_.alternate,O!==null&&(O.lanes|=o),Xc(_.return,o,i),I.lanes|=o;break}O=O.next}}else if(_.tag===10)w=_.type===i.type?null:_.child;else if(_.tag===18){if(w=_.return,w===null)throw Error(t(341));w.lanes|=o,I=w.alternate,I!==null&&(I.lanes|=o),Xc(w,o,i),w=_.sibling}else w=_.child;if(w!==null)w.return=_;else for(w=_;w!==null;){if(w===i){w=null;break}if(_=w.sibling,_!==null){_.return=w.return,w=_;break}w=w.return}_=w}wn(n,i,h.children,o),i=i.child}return i;case 9:return h=i.type,c=i.pendingProps.children,Is(i,o),h=ti(h),c=c(h),i.flags|=1,wn(n,i,c,o),i.child;case 14:return c=i.type,h=fi(c,i.pendingProps),h=fi(c.type,h),gp(n,i,c,h,o);case 15:return vp(n,i,i.type,i.pendingProps,o);case 17:return c=i.type,h=i.pendingProps,h=i.elementType===c?h:fi(c,h),Ka(n,i),i.tag=1,Ln(c)?(n=!0,Da(i)):n=!1,Is(i,o),lp(i,c,h),au(i,c,h,o),fu(null,i,c,!0,n,o);case 19:return Tp(n,i,o);case 22:return _p(n,i,o)}throw Error(t(156,i.tag))};function $p(n,i){return ee(n,i)}function Dv(n,i,o,c){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=c,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ri(n,i,o,c){return new Dv(n,i,o,c)}function Lu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Iv(n){if(typeof n=="function")return Lu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===ne)return 11;if(n===ue)return 14}return 2}function Sr(n,i){var o=n.alternate;return o===null?(o=ri(n.tag,i,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=i,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&14680064,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,i=n.dependencies,o.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o}function al(n,i,o,c,h,_){var w=2;if(c=n,typeof n=="function")Lu(n)&&(w=1);else if(typeof n=="string")w=5;else e:switch(n){case F:return Zr(o.children,h,_,i);case V:w=8,h|=8;break;case b:return n=ri(12,o,i,h|2),n.elementType=b,n.lanes=_,n;case K:return n=ri(13,o,i,h),n.elementType=K,n.lanes=_,n;case ae:return n=ri(19,o,i,h),n.elementType=ae,n.lanes=_,n;case ce:return ll(o,h,_,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case C:w=10;break e;case z:w=9;break e;case ne:w=11;break e;case ue:w=14;break e;case oe:w=16,c=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=ri(w,o,i,h),i.elementType=n,i.type=c,i.lanes=_,i}function Zr(n,i,o,c){return n=ri(7,n,c,i),n.lanes=o,n}function ll(n,i,o,c){return n=ri(22,n,c,i),n.elementType=ce,n.lanes=o,n.stateNode={isHidden:!1},n}function Du(n,i,o){return n=ri(6,n,null,i),n.lanes=o,n}function Iu(n,i,o){return i=ri(4,n.children!==null?n.children:[],n.key,i),i.lanes=o,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function Uv(n,i,o,c,h){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Qn(0),this.expirationTimes=Qn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Qn(0),this.identifierPrefix=c,this.onRecoverableError=h,this.mutableSourceEagerHydrationData=null}function Uu(n,i,o,c,h,_,w,I,O){return n=new Uv(n,i,o,I,O),i===1?(i=1,_===!0&&(i|=8)):i=0,_=ri(3,null,null,i),n.current=_,_.stateNode=n,_.memoizedState={element:c,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},Yc(_),n}function Nv(n,i,o){var c=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:N,key:c==null?null:""+c,children:n,containerInfo:i,implementation:o}}function Kp(n){if(!n)return dr;n=n._reactInternals;e:{if(Si(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(Ln(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var o=n.type;if(Ln(o))return wd(n,o,i)}return i}function Zp(n,i,o,c,h,_,w,I,O){return n=Uu(o,c,!0,n,h,_,w,I,O),n.context=Kp(null),o=n.current,c=Tn(),h=yr(o),_=Wi(c,h),_.callback=i??null,gr(o,_,h),n.current.lanes=h,bn(n,h,c),Un(n,c),n}function cl(n,i,o,c){var h=i.current,_=Tn(),w=yr(h);return o=Kp(o),i.context===null?i.context=o:i.pendingContext=o,i=Wi(_,w),i.payload={element:n},c=c===void 0?null:c,c!==null&&(i.callback=c),n=gr(h,i,w),n!==null&&(pi(n,h,w,_),Ba(n,h,w)),w}function ul(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Qp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<i?o:i}}function Nu(n,i){Qp(n,i),(n=n.alternate)&&Qp(n,i)}function Fv(){return null}var Jp=typeof reportError=="function"?reportError:function(n){console.error(n)};function Fu(n){this._internalRoot=n}fl.prototype.render=Fu.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));cl(n,i,null,null)},fl.prototype.unmount=Fu.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;qr(function(){cl(null,n,null,null)}),i[ki]=null}};function fl(n){this._internalRoot=n}fl.prototype.unstable_scheduleHydration=function(n){if(n){var i=Fh();n={blockedOn:null,target:n,priority:i};for(var o=0;o<lr.length&&i!==0&&i<lr[o].priority;o++);lr.splice(o,0,n),o===0&&kh(n)}};function Ou(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function hl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function em(){}function Ov(n,i,o,c,h){if(h){if(typeof c=="function"){var _=c;c=function(){var J=ul(w);_.call(J)}}var w=Zp(i,c,n,0,null,!1,!1,"",em);return n._reactRootContainer=w,n[ki]=w.current,Po(n.nodeType===8?n.parentNode:n),qr(),w}for(;h=n.lastChild;)n.removeChild(h);if(typeof c=="function"){var I=c;c=function(){var J=ul(O);I.call(J)}}var O=Uu(n,0,!1,null,null,!1,!1,"",em);return n._reactRootContainer=O,n[ki]=O.current,Po(n.nodeType===8?n.parentNode:n),qr(function(){cl(i,O,o,c)}),O}function dl(n,i,o,c,h){var _=o._reactRootContainer;if(_){var w=_;if(typeof h=="function"){var I=h;h=function(){var O=ul(w);I.call(O)}}cl(i,w,n,h)}else w=Ov(o,i,n,h,c);return ul(w)}Uh=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var o=Zt(i.pendingLanes);o!==0&&(ac(i,o|1),Un(i,Me()),(Mt&6)===0&&(zs=Me()+500,pr()))}break;case 13:qr(function(){var c=Gi(n,1);if(c!==null){var h=Tn();pi(c,n,1,h)}}),Nu(n,1)}},lc=function(n){if(n.tag===13){var i=Gi(n,134217728);if(i!==null){var o=Tn();pi(i,n,134217728,o)}Nu(n,134217728)}},Nh=function(n){if(n.tag===13){var i=yr(n),o=Gi(n,i);if(o!==null){var c=Tn();pi(o,n,i,c)}Nu(n,i)}},Fh=function(){return bt},Oh=function(n,i){var o=bt;try{return bt=n,i()}finally{bt=o}},Ce=function(n,i,o){switch(i){case"input":if(ut(n,o),i=o.name,o.type==="radio"&&i!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<o.length;i++){var c=o[i];if(c!==n&&c.form===n.form){var h=Pa(c);if(!h)throw Error(t(90));pt(c),ut(c,h)}}}break;case"textarea":pe(n,o);break;case"select":i=o.value,i!=null&&P(n,!!o.multiple,i,!1)}},Ot=Cu,Kt=qr;var zv={usingClientEntryPoint:!1,Events:[Io,Ts,Pa,Pe,st,Cu]},Yo={findFiberByHostInstance:Br,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},kv={bundleType:Yo.bundleType,version:Yo.version,rendererPackageName:Yo.rendererPackageName,rendererConfig:Yo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:A.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=R(n),n===null?null:n.stateNode},findFiberByHostInstance:Yo.findFiberByHostInstance||Fv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var pl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!pl.isDisabled&&pl.supportsFiber)try{Tt=pl.inject(kv),mt=pl}catch{}}return Nn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=zv,Nn.createPortal=function(n,i){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ou(i))throw Error(t(200));return Nv(n,i,null,o)},Nn.createRoot=function(n,i){if(!Ou(n))throw Error(t(299));var o=!1,c="",h=Jp;return i!=null&&(i.unstable_strictMode===!0&&(o=!0),i.identifierPrefix!==void 0&&(c=i.identifierPrefix),i.onRecoverableError!==void 0&&(h=i.onRecoverableError)),i=Uu(n,1,!1,null,null,o,!1,c,h),n[ki]=i.current,Po(n.nodeType===8?n.parentNode:n),new Fu(i)},Nn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=R(i),n=n===null?null:n.stateNode,n},Nn.flushSync=function(n){return qr(n)},Nn.hydrate=function(n,i,o){if(!hl(i))throw Error(t(200));return dl(null,n,i,!0,o)},Nn.hydrateRoot=function(n,i,o){if(!Ou(n))throw Error(t(405));var c=o!=null&&o.hydratedSources||null,h=!1,_="",w=Jp;if(o!=null&&(o.unstable_strictMode===!0&&(h=!0),o.identifierPrefix!==void 0&&(_=o.identifierPrefix),o.onRecoverableError!==void 0&&(w=o.onRecoverableError)),i=Zp(i,null,n,1,o??null,h,!1,_,w),n[ki]=i.current,Po(n),c)for(n=0;n<c.length;n++)o=c[n],h=o._getVersion,h=h(o._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[o,h]:i.mutableSourceEagerHydrationData.push(o,h);return new fl(i)},Nn.render=function(n,i,o){if(!hl(i))throw Error(t(200));return dl(null,n,i,!1,o)},Nn.unmountComponentAtNode=function(n){if(!hl(n))throw Error(t(40));return n._reactRootContainer?(qr(function(){dl(null,null,n,!1,function(){n._reactRootContainer=null,n[ki]=null})}),!0):!1},Nn.unstable_batchedUpdates=Cu,Nn.unstable_renderSubtreeIntoContainer=function(n,i,o,c){if(!hl(o))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return dl(n,i,o,!1,c)},Nn.version="18.3.1-next-f1338f8080-20240426",Nn}var lm;function Kv(){if(lm)return Bu.exports;lm=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),Bu.exports=$v(),Bu.exports}var cm;function Zv(){if(cm)return ml;cm=1;var s=Kv();return ml.createRoot=s.createRoot,ml.hydrateRoot=s.hydrateRoot,ml}var Qv=Zv();const Jv=Eg(Qv);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Mh="170",e_=0,um=1,t_=2,wg=1,Tg=2,Qi=3,Fr=0,Rn=1,Li=2,Ur=0,no=1,fm=2,hm=3,dm=4,n_=5,cs=100,i_=101,r_=102,s_=103,o_=104,a_=200,l_=201,c_=202,u_=203,bf=204,Pf=205,f_=206,h_=207,d_=208,p_=209,m_=210,g_=211,v_=212,__=213,x_=214,Lf=0,Df=1,If=2,so=3,Uf=4,Nf=5,Ff=6,Of=7,Ag=0,y_=1,M_=2,Nr=0,S_=1,E_=2,w_=3,T_=4,A_=5,R_=6,C_=7,Rg=300,oo=301,ao=302,zf=303,kf=304,Jl=306,Bf=1e3,fs=1001,Hf=1002,Mi=1003,b_=1004,gl=1005,Di=1006,Gu=1007,hs=1008,nr=1009,Cg=1010,bg=1011,ra=1012,Sh=1013,ps=1014,Ji=1015,oa=1016,Eh=1017,wh=1018,lo=1020,Pg=35902,Lg=1021,Dg=1022,xi=1023,Ig=1024,Ug=1025,io=1026,co=1027,Ng=1028,Th=1029,Fg=1030,Ah=1031,Rh=1033,Hl=33776,Vl=33777,Gl=33778,Wl=33779,Vf=35840,Gf=35841,Wf=35842,Xf=35843,jf=36196,Yf=37492,qf=37496,$f=37808,Kf=37809,Zf=37810,Qf=37811,Jf=37812,eh=37813,th=37814,nh=37815,ih=37816,rh=37817,sh=37818,oh=37819,ah=37820,lh=37821,Xl=36492,ch=36494,uh=36495,Og=36283,fh=36284,hh=36285,dh=36286,P_=3200,L_=3201,zg=0,D_=1,Lr="",Yn="srgb",ho="srgb-linear",ec="linear",Lt="srgb",Bs=7680,pm=519,I_=512,U_=513,N_=514,kg=515,F_=516,O_=517,z_=518,k_=519,mm=35044,gm="300 es",er=2e3,ql=2001;class po{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const a=this._listeners[e];if(a!==void 0){const l=a.indexOf(t);l!==-1&&a.splice(l,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const r=this._listeners[e.type];if(r!==void 0){e.target=this;const a=r.slice(0);for(let l=0,u=a.length;l<u;l++)a[l].call(this,e);e.target=null}}}const xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Wu=Math.PI/180,ph=180/Math.PI;function aa(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(xn[s&255]+xn[s>>8&255]+xn[s>>16&255]+xn[s>>24&255]+"-"+xn[e&255]+xn[e>>8&255]+"-"+xn[e>>16&15|64]+xn[e>>24&255]+"-"+xn[t&63|128]+xn[t>>8&255]+"-"+xn[t>>16&255]+xn[t>>24&255]+xn[r&255]+xn[r>>8&255]+xn[r>>16&255]+xn[r>>24&255]).toLowerCase()}function zn(s,e,t){return Math.max(e,Math.min(t,s))}function B_(s,e){return(s%e+e)%e}function Xu(s,e,t){return(1-t)*s+t*e}function $o(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Fn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class xt{constructor(e=0,t=0){xt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,a=e.elements;return this.x=a[0]*t+a[3]*r+a[6],this.y=a[1]*t+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(zn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),a=Math.sin(t),l=this.x-e.x,u=this.y-e.y;return this.x=l*r-u*a+e.x,this.y=l*a+u*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class at{constructor(e,t,r,a,l,u,f,d,m){at.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,u,f,d,m)}set(e,t,r,a,l,u,f,d,m){const p=this.elements;return p[0]=e,p[1]=a,p[2]=f,p[3]=t,p[4]=l,p[5]=d,p[6]=r,p[7]=u,p[8]=m,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,u=r[0],f=r[3],d=r[6],m=r[1],p=r[4],g=r[7],v=r[2],y=r[5],S=r[8],E=a[0],M=a[3],x=a[6],D=a[1],L=a[4],A=a[7],q=a[2],N=a[5],F=a[8];return l[0]=u*E+f*D+d*q,l[3]=u*M+f*L+d*N,l[6]=u*x+f*A+d*F,l[1]=m*E+p*D+g*q,l[4]=m*M+p*L+g*N,l[7]=m*x+p*A+g*F,l[2]=v*E+y*D+S*q,l[5]=v*M+y*L+S*N,l[8]=v*x+y*A+S*F,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],f=e[5],d=e[6],m=e[7],p=e[8];return t*u*p-t*f*m-r*l*p+r*f*d+a*l*m-a*u*d}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],f=e[5],d=e[6],m=e[7],p=e[8],g=p*u-f*m,v=f*d-p*l,y=m*l-u*d,S=t*g+r*v+a*y;if(S===0)return this.set(0,0,0,0,0,0,0,0,0);const E=1/S;return e[0]=g*E,e[1]=(a*m-p*r)*E,e[2]=(f*r-a*u)*E,e[3]=v*E,e[4]=(p*t-a*d)*E,e[5]=(a*l-f*t)*E,e[6]=y*E,e[7]=(r*d-m*t)*E,e[8]=(u*t-r*l)*E,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,a,l,u,f){const d=Math.cos(l),m=Math.sin(l);return this.set(r*d,r*m,-r*(d*u+m*f)+u+e,-a*m,a*d,-a*(-m*u+d*f)+f+t,0,0,1),this}scale(e,t){return this.premultiply(ju.makeScale(e,t)),this}rotate(e){return this.premultiply(ju.makeRotation(-e)),this}translate(e,t){return this.premultiply(ju.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<9;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ju=new at;function Bg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function $l(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function H_(){const s=$l("canvas");return s.style.display="block",s}const vm={};function na(s){s in vm||(vm[s]=!0,console.warn(s))}function V_(s,e,t){return new Promise(function(r,a){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:r()}}setTimeout(l,t)})}function G_(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function W_(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const St={enabled:!0,workingColorSpace:ho,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===Lt&&(s.r=tr(s.r),s.g=tr(s.g),s.b=tr(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===Lt&&(s.r=ro(s.r),s.g=ro(s.g),s.b=ro(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Lr?ec:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function tr(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ro(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const _m=[.64,.33,.3,.6,.15,.06],xm=[.2126,.7152,.0722],ym=[.3127,.329],Mm=new at().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Sm=new at().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);St.define({[ho]:{primaries:_m,whitePoint:ym,transfer:ec,toXYZ:Mm,fromXYZ:Sm,luminanceCoefficients:xm,workingColorSpaceConfig:{unpackColorSpace:Yn},outputColorSpaceConfig:{drawingBufferColorSpace:Yn}},[Yn]:{primaries:_m,whitePoint:ym,transfer:Lt,toXYZ:Mm,fromXYZ:Sm,luminanceCoefficients:xm,outputColorSpaceConfig:{drawingBufferColorSpace:Yn}}});let Hs;class X_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Hs===void 0&&(Hs=$l("canvas")),Hs.width=e.width,Hs.height=e.height;const r=Hs.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),t=Hs}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$l("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),l=a.data;for(let u=0;u<l.length;u++)l[u]=tr(l[u]/255)*255;return r.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(tr(t[r]/255)*255):t[r]=tr(t[r]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let j_=0;class Hg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:j_++}),this.uuid=aa(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let l;if(Array.isArray(a)){l=[];for(let u=0,f=a.length;u<f;u++)a[u].isDataTexture?l.push(Yu(a[u].image)):l.push(Yu(a[u]))}else l=Yu(a);r.url=l}return t||(e.images[this.uuid]=r),r}}function Yu(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?X_.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Y_=0;class Bn extends po{constructor(e=Bn.DEFAULT_IMAGE,t=Bn.DEFAULT_MAPPING,r=fs,a=fs,l=Di,u=hs,f=xi,d=nr,m=Bn.DEFAULT_ANISOTROPY,p=Lr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Y_++}),this.uuid=aa(),this.name="",this.source=new Hg(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=l,this.minFilter=u,this.anisotropy=m,this.format=f,this.internalFormat=null,this.type=d,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new at,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=p,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Rg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Bf:e.x=e.x-Math.floor(e.x);break;case fs:e.x=e.x<0?0:1;break;case Hf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Bf:e.y=e.y-Math.floor(e.y);break;case fs:e.y=e.y<0?0:1;break;case Hf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Bn.DEFAULT_IMAGE=null;Bn.DEFAULT_MAPPING=Rg;Bn.DEFAULT_ANISOTROPY=1;class Dt{constructor(e=0,t=0,r=0,a=1){Dt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,a){return this.x=e,this.y=t,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=this.w,u=e.elements;return this.x=u[0]*t+u[4]*r+u[8]*a+u[12]*l,this.y=u[1]*t+u[5]*r+u[9]*a+u[13]*l,this.z=u[2]*t+u[6]*r+u[10]*a+u[14]*l,this.w=u[3]*t+u[7]*r+u[11]*a+u[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,a,l;const d=e.elements,m=d[0],p=d[4],g=d[8],v=d[1],y=d[5],S=d[9],E=d[2],M=d[6],x=d[10];if(Math.abs(p-v)<.01&&Math.abs(g-E)<.01&&Math.abs(S-M)<.01){if(Math.abs(p+v)<.1&&Math.abs(g+E)<.1&&Math.abs(S+M)<.1&&Math.abs(m+y+x-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const L=(m+1)/2,A=(y+1)/2,q=(x+1)/2,N=(p+v)/4,F=(g+E)/4,V=(S+M)/4;return L>A&&L>q?L<.01?(r=0,a=.707106781,l=.707106781):(r=Math.sqrt(L),a=N/r,l=F/r):A>q?A<.01?(r=.707106781,a=0,l=.707106781):(a=Math.sqrt(A),r=N/a,l=V/a):q<.01?(r=.707106781,a=.707106781,l=0):(l=Math.sqrt(q),r=F/l,a=V/l),this.set(r,a,l,t),this}let D=Math.sqrt((M-S)*(M-S)+(g-E)*(g-E)+(v-p)*(v-p));return Math.abs(D)<.001&&(D=1),this.x=(M-S)/D,this.y=(g-E)/D,this.z=(v-p)/D,this.w=Math.acos((m+y+x-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class q_ extends po{constructor(e=1,t=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Dt(0,0,e,t),this.scissorTest=!1,this.viewport=new Dt(0,0,e,t);const a={width:e,height:t,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Di,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const l=new Bn(a,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);l.flipY=!1,l.generateMipmaps=r.generateMipmaps,l.internalFormat=r.internalFormat,this.textures=[];const u=r.count;for(let f=0;f<u;f++)this.textures[f]=l.clone(),this.textures[f].isRenderTargetTexture=!0;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let a=0,l=this.textures.length;a<l;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=r;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,a=e.textures.length;r<a;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Hg(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ms extends q_{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class Vg extends Bn{constructor(e=null,t=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=Mi,this.minFilter=Mi,this.wrapR=fs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class $_ extends Bn{constructor(e=null,t=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=Mi,this.minFilter=Mi,this.wrapR=fs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class la{constructor(e=0,t=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=a}static slerpFlat(e,t,r,a,l,u,f){let d=r[a+0],m=r[a+1],p=r[a+2],g=r[a+3];const v=l[u+0],y=l[u+1],S=l[u+2],E=l[u+3];if(f===0){e[t+0]=d,e[t+1]=m,e[t+2]=p,e[t+3]=g;return}if(f===1){e[t+0]=v,e[t+1]=y,e[t+2]=S,e[t+3]=E;return}if(g!==E||d!==v||m!==y||p!==S){let M=1-f;const x=d*v+m*y+p*S+g*E,D=x>=0?1:-1,L=1-x*x;if(L>Number.EPSILON){const q=Math.sqrt(L),N=Math.atan2(q,x*D);M=Math.sin(M*N)/q,f=Math.sin(f*N)/q}const A=f*D;if(d=d*M+v*A,m=m*M+y*A,p=p*M+S*A,g=g*M+E*A,M===1-f){const q=1/Math.sqrt(d*d+m*m+p*p+g*g);d*=q,m*=q,p*=q,g*=q}}e[t]=d,e[t+1]=m,e[t+2]=p,e[t+3]=g}static multiplyQuaternionsFlat(e,t,r,a,l,u){const f=r[a],d=r[a+1],m=r[a+2],p=r[a+3],g=l[u],v=l[u+1],y=l[u+2],S=l[u+3];return e[t]=f*S+p*g+d*y-m*v,e[t+1]=d*S+p*v+m*g-f*y,e[t+2]=m*S+p*y+f*v-d*g,e[t+3]=p*S-f*g-d*v-m*y,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,a){return this._x=e,this._y=t,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,a=e._y,l=e._z,u=e._order,f=Math.cos,d=Math.sin,m=f(r/2),p=f(a/2),g=f(l/2),v=d(r/2),y=d(a/2),S=d(l/2);switch(u){case"XYZ":this._x=v*p*g+m*y*S,this._y=m*y*g-v*p*S,this._z=m*p*S+v*y*g,this._w=m*p*g-v*y*S;break;case"YXZ":this._x=v*p*g+m*y*S,this._y=m*y*g-v*p*S,this._z=m*p*S-v*y*g,this._w=m*p*g+v*y*S;break;case"ZXY":this._x=v*p*g-m*y*S,this._y=m*y*g+v*p*S,this._z=m*p*S+v*y*g,this._w=m*p*g-v*y*S;break;case"ZYX":this._x=v*p*g-m*y*S,this._y=m*y*g+v*p*S,this._z=m*p*S-v*y*g,this._w=m*p*g+v*y*S;break;case"YZX":this._x=v*p*g+m*y*S,this._y=m*y*g+v*p*S,this._z=m*p*S-v*y*g,this._w=m*p*g-v*y*S;break;case"XZY":this._x=v*p*g-m*y*S,this._y=m*y*g-v*p*S,this._z=m*p*S+v*y*g,this._w=m*p*g+v*y*S;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+u)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],a=t[4],l=t[8],u=t[1],f=t[5],d=t[9],m=t[2],p=t[6],g=t[10],v=r+f+g;if(v>0){const y=.5/Math.sqrt(v+1);this._w=.25/y,this._x=(p-d)*y,this._y=(l-m)*y,this._z=(u-a)*y}else if(r>f&&r>g){const y=2*Math.sqrt(1+r-f-g);this._w=(p-d)/y,this._x=.25*y,this._y=(a+u)/y,this._z=(l+m)/y}else if(f>g){const y=2*Math.sqrt(1+f-r-g);this._w=(l-m)/y,this._x=(a+u)/y,this._y=.25*y,this._z=(d+p)/y}else{const y=2*Math.sqrt(1+g-r-f);this._w=(u-a)/y,this._x=(l+m)/y,this._y=(d+p)/y,this._z=.25*y}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(zn(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,t/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,a=e._y,l=e._z,u=e._w,f=t._x,d=t._y,m=t._z,p=t._w;return this._x=r*p+u*f+a*m-l*d,this._y=a*p+u*d+l*f-r*m,this._z=l*p+u*m+r*d-a*f,this._w=u*p-r*f-a*d-l*m,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const r=this._x,a=this._y,l=this._z,u=this._w;let f=u*e._w+r*e._x+a*e._y+l*e._z;if(f<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,f=-f):this.copy(e),f>=1)return this._w=u,this._x=r,this._y=a,this._z=l,this;const d=1-f*f;if(d<=Number.EPSILON){const y=1-t;return this._w=y*u+t*this._w,this._x=y*r+t*this._x,this._y=y*a+t*this._y,this._z=y*l+t*this._z,this.normalize(),this}const m=Math.sqrt(d),p=Math.atan2(m,f),g=Math.sin((1-t)*p)/m,v=Math.sin(t*p)/m;return this._w=u*g+this._w*v,this._x=r*g+this._x*v,this._y=a*g+this._y*v,this._z=l*g+this._z*v,this._onChangeCallback(),this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),l=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class j{constructor(e=0,t=0,r=0){j.prototype.isVector3=!0,this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Em.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Em.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[3]*r+l[6]*a,this.y=l[1]*t+l[4]*r+l[7]*a,this.z=l[2]*t+l[5]*r+l[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=e.elements,u=1/(l[3]*t+l[7]*r+l[11]*a+l[15]);return this.x=(l[0]*t+l[4]*r+l[8]*a+l[12])*u,this.y=(l[1]*t+l[5]*r+l[9]*a+l[13])*u,this.z=(l[2]*t+l[6]*r+l[10]*a+l[14])*u,this}applyQuaternion(e){const t=this.x,r=this.y,a=this.z,l=e.x,u=e.y,f=e.z,d=e.w,m=2*(u*a-f*r),p=2*(f*t-l*a),g=2*(l*r-u*t);return this.x=t+d*m+u*g-f*p,this.y=r+d*p+f*m-l*g,this.z=a+d*g+l*p-u*m,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[4]*r+l[8]*a,this.y=l[1]*t+l[5]*r+l[9]*a,this.z=l[2]*t+l[6]*r+l[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,a=e.y,l=e.z,u=t.x,f=t.y,d=t.z;return this.x=a*d-l*f,this.y=l*u-r*d,this.z=r*f-a*u,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return qu.copy(this).projectOnVector(e),this.sub(qu)}reflect(e){return this.sub(qu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(zn(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return t*t+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const a=Math.sin(t)*e;return this.x=a*Math.sin(r),this.y=Math.cos(t)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const qu=new j,Em=new la;class ca{constructor(e=new j(1/0,1/0,1/0),t=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(mi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(mi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=mi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const l=r.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let u=0,f=l.count;u<f;u++)e.isMesh===!0?e.getVertexPosition(u,mi):mi.fromBufferAttribute(l,u),mi.applyMatrix4(e.matrixWorld),this.expandByPoint(mi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),vl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),vl.copy(r.boundingBox)),vl.applyMatrix4(e.matrixWorld),this.union(vl)}const a=e.children;for(let l=0,u=a.length;l<u;l++)this.expandByObject(a[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mi),mi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ko),_l.subVectors(this.max,Ko),Vs.subVectors(e.a,Ko),Gs.subVectors(e.b,Ko),Ws.subVectors(e.c,Ko),wr.subVectors(Gs,Vs),Tr.subVectors(Ws,Gs),Qr.subVectors(Vs,Ws);let t=[0,-wr.z,wr.y,0,-Tr.z,Tr.y,0,-Qr.z,Qr.y,wr.z,0,-wr.x,Tr.z,0,-Tr.x,Qr.z,0,-Qr.x,-wr.y,wr.x,0,-Tr.y,Tr.x,0,-Qr.y,Qr.x,0];return!$u(t,Vs,Gs,Ws,_l)||(t=[1,0,0,0,1,0,0,0,1],!$u(t,Vs,Gs,Ws,_l))?!1:(xl.crossVectors(wr,Tr),t=[xl.x,xl.y,xl.z],$u(t,Vs,Gs,Ws,_l))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Yi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Yi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Yi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Yi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Yi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Yi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Yi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Yi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Yi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Yi=[new j,new j,new j,new j,new j,new j,new j,new j],mi=new j,vl=new ca,Vs=new j,Gs=new j,Ws=new j,wr=new j,Tr=new j,Qr=new j,Ko=new j,_l=new j,xl=new j,Jr=new j;function $u(s,e,t,r,a){for(let l=0,u=s.length-3;l<=u;l+=3){Jr.fromArray(s,l);const f=a.x*Math.abs(Jr.x)+a.y*Math.abs(Jr.y)+a.z*Math.abs(Jr.z),d=e.dot(Jr),m=t.dot(Jr),p=r.dot(Jr);if(Math.max(-Math.max(d,m,p),Math.min(d,m,p))>f)return!1}return!0}const K_=new ca,Zo=new j,Ku=new j;class tc{constructor(e=new j,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):K_.setFromPoints(e).getCenter(r);let a=0;for(let l=0,u=e.length;l<u;l++)a=Math.max(a,r.distanceToSquared(e[l]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Zo.subVectors(e,this.center);const t=Zo.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),a=(r-this.radius)*.5;this.center.addScaledVector(Zo,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ku.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Zo.copy(e.center).add(Ku)),this.expandByPoint(Zo.copy(e.center).sub(Ku))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const qi=new j,Zu=new j,yl=new j,Ar=new j,Qu=new j,Ml=new j,Ju=new j;class Gg{constructor(e=new j,t=new j(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,qi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=qi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(qi.copy(this.origin).addScaledVector(this.direction,t),qi.distanceToSquared(e))}distanceSqToSegment(e,t,r,a){Zu.copy(e).add(t).multiplyScalar(.5),yl.copy(t).sub(e).normalize(),Ar.copy(this.origin).sub(Zu);const l=e.distanceTo(t)*.5,u=-this.direction.dot(yl),f=Ar.dot(this.direction),d=-Ar.dot(yl),m=Ar.lengthSq(),p=Math.abs(1-u*u);let g,v,y,S;if(p>0)if(g=u*d-f,v=u*f-d,S=l*p,g>=0)if(v>=-S)if(v<=S){const E=1/p;g*=E,v*=E,y=g*(g+u*v+2*f)+v*(u*g+v+2*d)+m}else v=l,g=Math.max(0,-(u*v+f)),y=-g*g+v*(v+2*d)+m;else v=-l,g=Math.max(0,-(u*v+f)),y=-g*g+v*(v+2*d)+m;else v<=-S?(g=Math.max(0,-(-u*l+f)),v=g>0?-l:Math.min(Math.max(-l,-d),l),y=-g*g+v*(v+2*d)+m):v<=S?(g=0,v=Math.min(Math.max(-l,-d),l),y=v*(v+2*d)+m):(g=Math.max(0,-(u*l+f)),v=g>0?l:Math.min(Math.max(-l,-d),l),y=-g*g+v*(v+2*d)+m);else v=u>0?-l:l,g=Math.max(0,-(u*v+f)),y=-g*g+v*(v+2*d)+m;return r&&r.copy(this.origin).addScaledVector(this.direction,g),a&&a.copy(Zu).addScaledVector(yl,v),y}intersectSphere(e,t){qi.subVectors(e.center,this.origin);const r=qi.dot(this.direction),a=qi.dot(qi)-r*r,l=e.radius*e.radius;if(a>l)return null;const u=Math.sqrt(l-a),f=r-u,d=r+u;return d<0?null:f<0?this.at(d,t):this.at(f,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,a,l,u,f,d;const m=1/this.direction.x,p=1/this.direction.y,g=1/this.direction.z,v=this.origin;return m>=0?(r=(e.min.x-v.x)*m,a=(e.max.x-v.x)*m):(r=(e.max.x-v.x)*m,a=(e.min.x-v.x)*m),p>=0?(l=(e.min.y-v.y)*p,u=(e.max.y-v.y)*p):(l=(e.max.y-v.y)*p,u=(e.min.y-v.y)*p),r>u||l>a||((l>r||isNaN(r))&&(r=l),(u<a||isNaN(a))&&(a=u),g>=0?(f=(e.min.z-v.z)*g,d=(e.max.z-v.z)*g):(f=(e.max.z-v.z)*g,d=(e.min.z-v.z)*g),r>d||f>a)||((f>r||r!==r)&&(r=f),(d<a||a!==a)&&(a=d),a<0)?null:this.at(r>=0?r:a,t)}intersectsBox(e){return this.intersectBox(e,qi)!==null}intersectTriangle(e,t,r,a,l){Qu.subVectors(t,e),Ml.subVectors(r,e),Ju.crossVectors(Qu,Ml);let u=this.direction.dot(Ju),f;if(u>0){if(a)return null;f=1}else if(u<0)f=-1,u=-u;else return null;Ar.subVectors(this.origin,e);const d=f*this.direction.dot(Ml.crossVectors(Ar,Ml));if(d<0)return null;const m=f*this.direction.dot(Qu.cross(Ar));if(m<0||d+m>u)return null;const p=-f*Ar.dot(Ju);return p<0?null:this.at(p/u,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Ht{constructor(e,t,r,a,l,u,f,d,m,p,g,v,y,S,E,M){Ht.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,u,f,d,m,p,g,v,y,S,E,M)}set(e,t,r,a,l,u,f,d,m,p,g,v,y,S,E,M){const x=this.elements;return x[0]=e,x[4]=t,x[8]=r,x[12]=a,x[1]=l,x[5]=u,x[9]=f,x[13]=d,x[2]=m,x[6]=p,x[10]=g,x[14]=v,x[3]=y,x[7]=S,x[11]=E,x[15]=M,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ht().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,r=e.elements,a=1/Xs.setFromMatrixColumn(e,0).length(),l=1/Xs.setFromMatrixColumn(e,1).length(),u=1/Xs.setFromMatrixColumn(e,2).length();return t[0]=r[0]*a,t[1]=r[1]*a,t[2]=r[2]*a,t[3]=0,t[4]=r[4]*l,t[5]=r[5]*l,t[6]=r[6]*l,t[7]=0,t[8]=r[8]*u,t[9]=r[9]*u,t[10]=r[10]*u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,a=e.y,l=e.z,u=Math.cos(r),f=Math.sin(r),d=Math.cos(a),m=Math.sin(a),p=Math.cos(l),g=Math.sin(l);if(e.order==="XYZ"){const v=u*p,y=u*g,S=f*p,E=f*g;t[0]=d*p,t[4]=-d*g,t[8]=m,t[1]=y+S*m,t[5]=v-E*m,t[9]=-f*d,t[2]=E-v*m,t[6]=S+y*m,t[10]=u*d}else if(e.order==="YXZ"){const v=d*p,y=d*g,S=m*p,E=m*g;t[0]=v+E*f,t[4]=S*f-y,t[8]=u*m,t[1]=u*g,t[5]=u*p,t[9]=-f,t[2]=y*f-S,t[6]=E+v*f,t[10]=u*d}else if(e.order==="ZXY"){const v=d*p,y=d*g,S=m*p,E=m*g;t[0]=v-E*f,t[4]=-u*g,t[8]=S+y*f,t[1]=y+S*f,t[5]=u*p,t[9]=E-v*f,t[2]=-u*m,t[6]=f,t[10]=u*d}else if(e.order==="ZYX"){const v=u*p,y=u*g,S=f*p,E=f*g;t[0]=d*p,t[4]=S*m-y,t[8]=v*m+E,t[1]=d*g,t[5]=E*m+v,t[9]=y*m-S,t[2]=-m,t[6]=f*d,t[10]=u*d}else if(e.order==="YZX"){const v=u*d,y=u*m,S=f*d,E=f*m;t[0]=d*p,t[4]=E-v*g,t[8]=S*g+y,t[1]=g,t[5]=u*p,t[9]=-f*p,t[2]=-m*p,t[6]=y*g+S,t[10]=v-E*g}else if(e.order==="XZY"){const v=u*d,y=u*m,S=f*d,E=f*m;t[0]=d*p,t[4]=-g,t[8]=m*p,t[1]=v*g+E,t[5]=u*p,t[9]=y*g-S,t[2]=S*g-y,t[6]=f*p,t[10]=E*g+v}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Z_,e,Q_)}lookAt(e,t,r){const a=this.elements;return Xn.subVectors(e,t),Xn.lengthSq()===0&&(Xn.z=1),Xn.normalize(),Rr.crossVectors(r,Xn),Rr.lengthSq()===0&&(Math.abs(r.z)===1?Xn.x+=1e-4:Xn.z+=1e-4,Xn.normalize(),Rr.crossVectors(r,Xn)),Rr.normalize(),Sl.crossVectors(Xn,Rr),a[0]=Rr.x,a[4]=Sl.x,a[8]=Xn.x,a[1]=Rr.y,a[5]=Sl.y,a[9]=Xn.y,a[2]=Rr.z,a[6]=Sl.z,a[10]=Xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,u=r[0],f=r[4],d=r[8],m=r[12],p=r[1],g=r[5],v=r[9],y=r[13],S=r[2],E=r[6],M=r[10],x=r[14],D=r[3],L=r[7],A=r[11],q=r[15],N=a[0],F=a[4],V=a[8],b=a[12],C=a[1],z=a[5],ne=a[9],K=a[13],ae=a[2],ue=a[6],oe=a[10],ce=a[14],k=a[3],le=a[7],se=a[11],U=a[15];return l[0]=u*N+f*C+d*ae+m*k,l[4]=u*F+f*z+d*ue+m*le,l[8]=u*V+f*ne+d*oe+m*se,l[12]=u*b+f*K+d*ce+m*U,l[1]=p*N+g*C+v*ae+y*k,l[5]=p*F+g*z+v*ue+y*le,l[9]=p*V+g*ne+v*oe+y*se,l[13]=p*b+g*K+v*ce+y*U,l[2]=S*N+E*C+M*ae+x*k,l[6]=S*F+E*z+M*ue+x*le,l[10]=S*V+E*ne+M*oe+x*se,l[14]=S*b+E*K+M*ce+x*U,l[3]=D*N+L*C+A*ae+q*k,l[7]=D*F+L*z+A*ue+q*le,l[11]=D*V+L*ne+A*oe+q*se,l[15]=D*b+L*K+A*ce+q*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],a=e[8],l=e[12],u=e[1],f=e[5],d=e[9],m=e[13],p=e[2],g=e[6],v=e[10],y=e[14],S=e[3],E=e[7],M=e[11],x=e[15];return S*(+l*d*g-a*m*g-l*f*v+r*m*v+a*f*y-r*d*y)+E*(+t*d*y-t*m*v+l*u*v-a*u*y+a*m*p-l*d*p)+M*(+t*m*g-t*f*y-l*u*g+r*u*y+l*f*p-r*m*p)+x*(-a*f*p-t*d*g+t*f*v+a*u*g-r*u*v+r*d*p)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],u=e[4],f=e[5],d=e[6],m=e[7],p=e[8],g=e[9],v=e[10],y=e[11],S=e[12],E=e[13],M=e[14],x=e[15],D=g*M*m-E*v*m+E*d*y-f*M*y-g*d*x+f*v*x,L=S*v*m-p*M*m-S*d*y+u*M*y+p*d*x-u*v*x,A=p*E*m-S*g*m+S*f*y-u*E*y-p*f*x+u*g*x,q=S*g*d-p*E*d-S*f*v+u*E*v+p*f*M-u*g*M,N=t*D+r*L+a*A+l*q;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/N;return e[0]=D*F,e[1]=(E*v*l-g*M*l-E*a*y+r*M*y+g*a*x-r*v*x)*F,e[2]=(f*M*l-E*d*l+E*a*m-r*M*m-f*a*x+r*d*x)*F,e[3]=(g*d*l-f*v*l-g*a*m+r*v*m+f*a*y-r*d*y)*F,e[4]=L*F,e[5]=(p*M*l-S*v*l+S*a*y-t*M*y-p*a*x+t*v*x)*F,e[6]=(S*d*l-u*M*l-S*a*m+t*M*m+u*a*x-t*d*x)*F,e[7]=(u*v*l-p*d*l+p*a*m-t*v*m-u*a*y+t*d*y)*F,e[8]=A*F,e[9]=(S*g*l-p*E*l-S*r*y+t*E*y+p*r*x-t*g*x)*F,e[10]=(u*E*l-S*f*l+S*r*m-t*E*m-u*r*x+t*f*x)*F,e[11]=(p*f*l-u*g*l-p*r*m+t*g*m+u*r*y-t*f*y)*F,e[12]=q*F,e[13]=(p*E*a-S*g*a+S*r*v-t*E*v-p*r*M+t*g*M)*F,e[14]=(S*f*a-u*E*a-S*r*d+t*E*d+u*r*M-t*f*M)*F,e[15]=(u*g*a-p*f*a+p*r*d-t*g*d-u*r*v+t*f*v)*F,this}scale(e){const t=this.elements,r=e.x,a=e.y,l=e.z;return t[0]*=r,t[4]*=a,t[8]*=l,t[1]*=r,t[5]*=a,t[9]*=l,t[2]*=r,t[6]*=a,t[10]*=l,t[3]*=r,t[7]*=a,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,a))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),a=Math.sin(t),l=1-r,u=e.x,f=e.y,d=e.z,m=l*u,p=l*f;return this.set(m*u+r,m*f-a*d,m*d+a*f,0,m*f+a*d,p*f+r,p*d-a*u,0,m*d-a*f,p*d+a*u,l*d*d+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,a,l,u){return this.set(1,r,l,0,e,1,u,0,t,a,1,0,0,0,0,1),this}compose(e,t,r){const a=this.elements,l=t._x,u=t._y,f=t._z,d=t._w,m=l+l,p=u+u,g=f+f,v=l*m,y=l*p,S=l*g,E=u*p,M=u*g,x=f*g,D=d*m,L=d*p,A=d*g,q=r.x,N=r.y,F=r.z;return a[0]=(1-(E+x))*q,a[1]=(y+A)*q,a[2]=(S-L)*q,a[3]=0,a[4]=(y-A)*N,a[5]=(1-(v+x))*N,a[6]=(M+D)*N,a[7]=0,a[8]=(S+L)*F,a[9]=(M-D)*F,a[10]=(1-(v+E))*F,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,r){const a=this.elements;let l=Xs.set(a[0],a[1],a[2]).length();const u=Xs.set(a[4],a[5],a[6]).length(),f=Xs.set(a[8],a[9],a[10]).length();this.determinant()<0&&(l=-l),e.x=a[12],e.y=a[13],e.z=a[14],gi.copy(this);const m=1/l,p=1/u,g=1/f;return gi.elements[0]*=m,gi.elements[1]*=m,gi.elements[2]*=m,gi.elements[4]*=p,gi.elements[5]*=p,gi.elements[6]*=p,gi.elements[8]*=g,gi.elements[9]*=g,gi.elements[10]*=g,t.setFromRotationMatrix(gi),r.x=l,r.y=u,r.z=f,this}makePerspective(e,t,r,a,l,u,f=er){const d=this.elements,m=2*l/(t-e),p=2*l/(r-a),g=(t+e)/(t-e),v=(r+a)/(r-a);let y,S;if(f===er)y=-(u+l)/(u-l),S=-2*u*l/(u-l);else if(f===ql)y=-u/(u-l),S=-u*l/(u-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+f);return d[0]=m,d[4]=0,d[8]=g,d[12]=0,d[1]=0,d[5]=p,d[9]=v,d[13]=0,d[2]=0,d[6]=0,d[10]=y,d[14]=S,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,t,r,a,l,u,f=er){const d=this.elements,m=1/(t-e),p=1/(r-a),g=1/(u-l),v=(t+e)*m,y=(r+a)*p;let S,E;if(f===er)S=(u+l)*g,E=-2*g;else if(f===ql)S=l*g,E=-1*g;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+f);return d[0]=2*m,d[4]=0,d[8]=0,d[12]=-v,d[1]=0,d[5]=2*p,d[9]=0,d[13]=-y,d[2]=0,d[6]=0,d[10]=E,d[14]=-S,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<16;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}}const Xs=new j,gi=new Ht,Z_=new j(0,0,0),Q_=new j(1,1,1),Rr=new j,Sl=new j,Xn=new j,wm=new Ht,Tm=new la;class Ni{constructor(e=0,t=0,r=0,a=Ni.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,a=this._order){return this._x=e,this._y=t,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const a=e.elements,l=a[0],u=a[4],f=a[8],d=a[1],m=a[5],p=a[9],g=a[2],v=a[6],y=a[10];switch(t){case"XYZ":this._y=Math.asin(zn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-p,y),this._z=Math.atan2(-u,l)):(this._x=Math.atan2(v,m),this._z=0);break;case"YXZ":this._x=Math.asin(-zn(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(f,y),this._z=Math.atan2(d,m)):(this._y=Math.atan2(-g,l),this._z=0);break;case"ZXY":this._x=Math.asin(zn(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(-g,y),this._z=Math.atan2(-u,m)):(this._y=0,this._z=Math.atan2(d,l));break;case"ZYX":this._y=Math.asin(-zn(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(v,y),this._z=Math.atan2(d,l)):(this._x=0,this._z=Math.atan2(-u,m));break;case"YZX":this._z=Math.asin(zn(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-p,m),this._y=Math.atan2(-g,l)):(this._x=0,this._y=Math.atan2(f,y));break;case"XZY":this._z=Math.asin(-zn(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(v,m),this._y=Math.atan2(f,l)):(this._x=Math.atan2(-p,y),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return wm.makeRotationFromQuaternion(e),this.setFromRotationMatrix(wm,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Tm.setFromEuler(this),this.setFromQuaternion(Tm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ni.DEFAULT_ORDER="XYZ";class Wg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let J_=0;const Am=new j,js=new la,$i=new Ht,El=new j,Qo=new j,ex=new j,tx=new la,Rm=new j(1,0,0),Cm=new j(0,1,0),bm=new j(0,0,1),Pm={type:"added"},nx={type:"removed"},Ys={type:"childadded",child:null},ef={type:"childremoved",child:null};class nn extends po{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:J_++}),this.uuid=aa(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=nn.DEFAULT_UP.clone();const e=new j,t=new Ni,r=new la,a=new j(1,1,1);function l(){r.setFromEuler(t,!1)}function u(){t.setFromQuaternion(r,void 0,!1)}t._onChange(l),r._onChange(u),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Ht},normalMatrix:{value:new at}}),this.matrix=new Ht,this.matrixWorld=new Ht,this.matrixAutoUpdate=nn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Wg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return js.setFromAxisAngle(e,t),this.quaternion.multiply(js),this}rotateOnWorldAxis(e,t){return js.setFromAxisAngle(e,t),this.quaternion.premultiply(js),this}rotateX(e){return this.rotateOnAxis(Rm,e)}rotateY(e){return this.rotateOnAxis(Cm,e)}rotateZ(e){return this.rotateOnAxis(bm,e)}translateOnAxis(e,t){return Am.copy(e).applyQuaternion(this.quaternion),this.position.add(Am.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Rm,e)}translateY(e){return this.translateOnAxis(Cm,e)}translateZ(e){return this.translateOnAxis(bm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4($i.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?El.copy(e):El.set(e,t,r);const a=this.parent;this.updateWorldMatrix(!0,!1),Qo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?$i.lookAt(Qo,El,this.up):$i.lookAt(El,Qo,this.up),this.quaternion.setFromRotationMatrix($i),a&&($i.extractRotation(a.matrixWorld),js.setFromRotationMatrix($i),this.quaternion.premultiply(js.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Pm),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(nx),ef.child=e,this.dispatchEvent(ef),ef.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),$i.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),$i.multiply(e.parent.matrixWorld)),e.applyMatrix4($i),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Pm),Ys.child=e,this.dispatchEvent(Ys),Ys.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,a=this.children.length;r<a;r++){const u=this.children[r].getObjectByProperty(e,t);if(u!==void 0)return u}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const a=this.children;for(let l=0,u=a.length;l<u;l++)a[l].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qo,e,ex),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Qo,tx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let l=0,u=a.length;l<u;l++)a[l].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(f=>({boxInitialized:f.boxInitialized,boxMin:f.box.min.toArray(),boxMax:f.box.max.toArray(),sphereInitialized:f.sphereInitialized,sphereRadius:f.sphere.radius,sphereCenter:f.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function l(f,d){return f[d.uuid]===void 0&&(f[d.uuid]=d.toJSON(e)),d.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=l(e.geometries,this.geometry);const f=this.geometry.parameters;if(f!==void 0&&f.shapes!==void 0){const d=f.shapes;if(Array.isArray(d))for(let m=0,p=d.length;m<p;m++){const g=d[m];l(e.shapes,g)}else l(e.shapes,d)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const f=[];for(let d=0,m=this.material.length;d<m;d++)f.push(l(e.materials,this.material[d]));a.material=f}else a.material=l(e.materials,this.material);if(this.children.length>0){a.children=[];for(let f=0;f<this.children.length;f++)a.children.push(this.children[f].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let f=0;f<this.animations.length;f++){const d=this.animations[f];a.animations.push(l(e.animations,d))}}if(t){const f=u(e.geometries),d=u(e.materials),m=u(e.textures),p=u(e.images),g=u(e.shapes),v=u(e.skeletons),y=u(e.animations),S=u(e.nodes);f.length>0&&(r.geometries=f),d.length>0&&(r.materials=d),m.length>0&&(r.textures=m),p.length>0&&(r.images=p),g.length>0&&(r.shapes=g),v.length>0&&(r.skeletons=v),y.length>0&&(r.animations=y),S.length>0&&(r.nodes=S)}return r.object=a,r;function u(f){const d=[];for(const m in f){const p=f[m];delete p.metadata,d.push(p)}return d}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}nn.DEFAULT_UP=new j(0,1,0);nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const vi=new j,Ki=new j,tf=new j,Zi=new j,qs=new j,$s=new j,Lm=new j,nf=new j,rf=new j,sf=new j,of=new Dt,af=new Dt,lf=new Dt;class _i{constructor(e=new j,t=new j,r=new j){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,a){a.subVectors(r,t),vi.subVectors(e,t),a.cross(vi);const l=a.lengthSq();return l>0?a.multiplyScalar(1/Math.sqrt(l)):a.set(0,0,0)}static getBarycoord(e,t,r,a,l){vi.subVectors(a,t),Ki.subVectors(r,t),tf.subVectors(e,t);const u=vi.dot(vi),f=vi.dot(Ki),d=vi.dot(tf),m=Ki.dot(Ki),p=Ki.dot(tf),g=u*m-f*f;if(g===0)return l.set(0,0,0),null;const v=1/g,y=(m*d-f*p)*v,S=(u*p-f*d)*v;return l.set(1-y-S,S,y)}static containsPoint(e,t,r,a){return this.getBarycoord(e,t,r,a,Zi)===null?!1:Zi.x>=0&&Zi.y>=0&&Zi.x+Zi.y<=1}static getInterpolation(e,t,r,a,l,u,f,d){return this.getBarycoord(e,t,r,a,Zi)===null?(d.x=0,d.y=0,"z"in d&&(d.z=0),"w"in d&&(d.w=0),null):(d.setScalar(0),d.addScaledVector(l,Zi.x),d.addScaledVector(u,Zi.y),d.addScaledVector(f,Zi.z),d)}static getInterpolatedAttribute(e,t,r,a,l,u){return of.setScalar(0),af.setScalar(0),lf.setScalar(0),of.fromBufferAttribute(e,t),af.fromBufferAttribute(e,r),lf.fromBufferAttribute(e,a),u.setScalar(0),u.addScaledVector(of,l.x),u.addScaledVector(af,l.y),u.addScaledVector(lf,l.z),u}static isFrontFacing(e,t,r,a){return vi.subVectors(r,t),Ki.subVectors(e,t),vi.cross(Ki).dot(a)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,a){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,r,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return vi.subVectors(this.c,this.b),Ki.subVectors(this.a,this.b),vi.cross(Ki).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return _i.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return _i.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,a,l){return _i.getInterpolation(e,this.a,this.b,this.c,t,r,a,l)}containsPoint(e){return _i.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return _i.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,a=this.b,l=this.c;let u,f;qs.subVectors(a,r),$s.subVectors(l,r),nf.subVectors(e,r);const d=qs.dot(nf),m=$s.dot(nf);if(d<=0&&m<=0)return t.copy(r);rf.subVectors(e,a);const p=qs.dot(rf),g=$s.dot(rf);if(p>=0&&g<=p)return t.copy(a);const v=d*g-p*m;if(v<=0&&d>=0&&p<=0)return u=d/(d-p),t.copy(r).addScaledVector(qs,u);sf.subVectors(e,l);const y=qs.dot(sf),S=$s.dot(sf);if(S>=0&&y<=S)return t.copy(l);const E=y*m-d*S;if(E<=0&&m>=0&&S<=0)return f=m/(m-S),t.copy(r).addScaledVector($s,f);const M=p*S-y*g;if(M<=0&&g-p>=0&&y-S>=0)return Lm.subVectors(l,a),f=(g-p)/(g-p+(y-S)),t.copy(a).addScaledVector(Lm,f);const x=1/(M+E+v);return u=E*x,f=v*x,t.copy(r).addScaledVector(qs,u).addScaledVector($s,f)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Xg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Cr={h:0,s:0,l:0},wl={h:0,s:0,l:0};function cf(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class _t{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Yn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,St.toWorkingColorSpace(this,t),this}setRGB(e,t,r,a=St.workingColorSpace){return this.r=e,this.g=t,this.b=r,St.toWorkingColorSpace(this,a),this}setHSL(e,t,r,a=St.workingColorSpace){if(e=B_(e,1),t=zn(t,0,1),r=zn(r,0,1),t===0)this.r=this.g=this.b=r;else{const l=r<=.5?r*(1+t):r+t-r*t,u=2*r-l;this.r=cf(u,l,e+1/3),this.g=cf(u,l,e),this.b=cf(u,l,e-1/3)}return St.toWorkingColorSpace(this,a),this}setStyle(e,t=Yn){function r(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const u=a[1],f=a[2];switch(u){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=a[1],u=l.length;if(u===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(u===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Yn){const r=Xg[e.toLowerCase()];return r!==void 0?this.setHex(r,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=tr(e.r),this.g=tr(e.g),this.b=tr(e.b),this}copyLinearToSRGB(e){return this.r=ro(e.r),this.g=ro(e.g),this.b=ro(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Yn){return St.fromWorkingColorSpace(yn.copy(this),e),Math.round(zn(yn.r*255,0,255))*65536+Math.round(zn(yn.g*255,0,255))*256+Math.round(zn(yn.b*255,0,255))}getHexString(e=Yn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=St.workingColorSpace){St.fromWorkingColorSpace(yn.copy(this),t);const r=yn.r,a=yn.g,l=yn.b,u=Math.max(r,a,l),f=Math.min(r,a,l);let d,m;const p=(f+u)/2;if(f===u)d=0,m=0;else{const g=u-f;switch(m=p<=.5?g/(u+f):g/(2-u-f),u){case r:d=(a-l)/g+(a<l?6:0);break;case a:d=(l-r)/g+2;break;case l:d=(r-a)/g+4;break}d/=6}return e.h=d,e.s=m,e.l=p,e}getRGB(e,t=St.workingColorSpace){return St.fromWorkingColorSpace(yn.copy(this),t),e.r=yn.r,e.g=yn.g,e.b=yn.b,e}getStyle(e=Yn){St.fromWorkingColorSpace(yn.copy(this),e);const t=yn.r,r=yn.g,a=yn.b;return e!==Yn?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,t,r){return this.getHSL(Cr),this.setHSL(Cr.h+e,Cr.s+t,Cr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(Cr),e.getHSL(wl);const r=Xu(Cr.h,wl.h,t),a=Xu(Cr.s,wl.s,t),l=Xu(Cr.l,wl.l,t);return this.setHSL(r,a,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,a=this.b,l=e.elements;return this.r=l[0]*t+l[3]*r+l[6]*a,this.g=l[1]*t+l[4]*r+l[7]*a,this.b=l[2]*t+l[5]*r+l[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const yn=new _t;_t.NAMES=Xg;let ix=0;class mo extends po{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ix++}),this.uuid=aa(),this.name="",this.blending=no,this.side=Fr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=bf,this.blendDst=Pf,this.blendEquation=cs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new _t(0,0,0),this.blendAlpha=0,this.depthFunc=so,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Bs,this.stencilZFail=Bs,this.stencilZPass=Bs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==no&&(r.blending=this.blending),this.side!==Fr&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==bf&&(r.blendSrc=this.blendSrc),this.blendDst!==Pf&&(r.blendDst=this.blendDst),this.blendEquation!==cs&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==so&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pm&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Bs&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Bs&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Bs&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(l){const u=[];for(const f in l){const d=l[f];delete d.metadata,u.push(d)}return u}if(t){const l=a(e.textures),u=a(e.images);l.length>0&&(r.textures=l),u.length>0&&(r.images=u)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const a=t.length;r=new Array(a);for(let l=0;l!==a;++l)r[l]=t[l].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class sa extends mo{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new _t(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.combine=Ag,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const qt=new j,Tl=new xt;class Ui{constructor(e,t,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=mm,this.updateRanges=[],this.gpuType=Ji,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let a=0,l=this.itemSize;a<l;a++)this.array[e+a]=t.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)Tl.fromBufferAttribute(this,t),Tl.applyMatrix3(e),this.setXY(t,Tl.x,Tl.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=$o(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Fn(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=$o(t,this.array)),t}setX(e,t){return this.normalized&&(t=Fn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=$o(t,this.array)),t}setY(e,t){return this.normalized&&(t=Fn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=$o(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Fn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=$o(t,this.array)),t}setW(e,t){return this.normalized&&(t=Fn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=Fn(t,this.array),r=Fn(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,a){return e*=this.itemSize,this.normalized&&(t=Fn(t,this.array),r=Fn(r,this.array),a=Fn(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,t,r,a,l){return e*=this.itemSize,this.normalized&&(t=Fn(t,this.array),r=Fn(r,this.array),a=Fn(a,this.array),l=Fn(l,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==mm&&(e.usage=this.usage),e}}class jg extends Ui{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class Yg extends Ui{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class $t extends Ui{constructor(e,t,r){super(new Float32Array(e),t,r)}}let rx=0;const si=new Ht,uf=new nn,Ks=new j,jn=new ca,Jo=new ca,cn=new j;class Kn extends po{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rx++}),this.uuid=aa(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bg(e)?Yg:jg)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const l=new at().getNormalMatrix(e);r.applyNormalMatrix(l),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return si.makeRotationFromQuaternion(e),this.applyMatrix4(si),this}rotateX(e){return si.makeRotationX(e),this.applyMatrix4(si),this}rotateY(e){return si.makeRotationY(e),this.applyMatrix4(si),this}rotateZ(e){return si.makeRotationZ(e),this.applyMatrix4(si),this}translate(e,t,r){return si.makeTranslation(e,t,r),this.applyMatrix4(si),this}scale(e,t,r){return si.makeScale(e,t,r),this.applyMatrix4(si),this}lookAt(e){return uf.lookAt(e),uf.updateMatrix(),this.applyMatrix4(uf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ks).negate(),this.translate(Ks.x,Ks.y,Ks.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const r=[];for(let a=0,l=e.length;a<l;a++){const u=e[a];r.push(u.x,u.y,u.z||0)}this.setAttribute("position",new $t(r,3))}else{for(let r=0,a=t.count;r<a;r++){const l=e[r];t.setXYZ(r,l.x,l.y,l.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ca);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const l=t[r];jn.setFromBufferAttribute(l),this.morphTargetsRelative?(cn.addVectors(this.boundingBox.min,jn.min),this.boundingBox.expandByPoint(cn),cn.addVectors(this.boundingBox.max,jn.max),this.boundingBox.expandByPoint(cn)):(this.boundingBox.expandByPoint(jn.min),this.boundingBox.expandByPoint(jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new tc);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new j,1/0);return}if(e){const r=this.boundingSphere.center;if(jn.setFromBufferAttribute(e),t)for(let l=0,u=t.length;l<u;l++){const f=t[l];Jo.setFromBufferAttribute(f),this.morphTargetsRelative?(cn.addVectors(jn.min,Jo.min),jn.expandByPoint(cn),cn.addVectors(jn.max,Jo.max),jn.expandByPoint(cn)):(jn.expandByPoint(Jo.min),jn.expandByPoint(Jo.max))}jn.getCenter(r);let a=0;for(let l=0,u=e.count;l<u;l++)cn.fromBufferAttribute(e,l),a=Math.max(a,r.distanceToSquared(cn));if(t)for(let l=0,u=t.length;l<u;l++){const f=t[l],d=this.morphTargetsRelative;for(let m=0,p=f.count;m<p;m++)cn.fromBufferAttribute(f,m),d&&(Ks.fromBufferAttribute(e,m),cn.add(Ks)),a=Math.max(a,r.distanceToSquared(cn))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,a=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ui(new Float32Array(4*r.count),4));const u=this.getAttribute("tangent"),f=[],d=[];for(let V=0;V<r.count;V++)f[V]=new j,d[V]=new j;const m=new j,p=new j,g=new j,v=new xt,y=new xt,S=new xt,E=new j,M=new j;function x(V,b,C){m.fromBufferAttribute(r,V),p.fromBufferAttribute(r,b),g.fromBufferAttribute(r,C),v.fromBufferAttribute(l,V),y.fromBufferAttribute(l,b),S.fromBufferAttribute(l,C),p.sub(m),g.sub(m),y.sub(v),S.sub(v);const z=1/(y.x*S.y-S.x*y.y);isFinite(z)&&(E.copy(p).multiplyScalar(S.y).addScaledVector(g,-y.y).multiplyScalar(z),M.copy(g).multiplyScalar(y.x).addScaledVector(p,-S.x).multiplyScalar(z),f[V].add(E),f[b].add(E),f[C].add(E),d[V].add(M),d[b].add(M),d[C].add(M))}let D=this.groups;D.length===0&&(D=[{start:0,count:e.count}]);for(let V=0,b=D.length;V<b;++V){const C=D[V],z=C.start,ne=C.count;for(let K=z,ae=z+ne;K<ae;K+=3)x(e.getX(K+0),e.getX(K+1),e.getX(K+2))}const L=new j,A=new j,q=new j,N=new j;function F(V){q.fromBufferAttribute(a,V),N.copy(q);const b=f[V];L.copy(b),L.sub(q.multiplyScalar(q.dot(b))).normalize(),A.crossVectors(N,b);const z=A.dot(d[V])<0?-1:1;u.setXYZW(V,L.x,L.y,L.z,z)}for(let V=0,b=D.length;V<b;++V){const C=D[V],z=C.start,ne=C.count;for(let K=z,ae=z+ne;K<ae;K+=3)F(e.getX(K+0)),F(e.getX(K+1)),F(e.getX(K+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new Ui(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let v=0,y=r.count;v<y;v++)r.setXYZ(v,0,0,0);const a=new j,l=new j,u=new j,f=new j,d=new j,m=new j,p=new j,g=new j;if(e)for(let v=0,y=e.count;v<y;v+=3){const S=e.getX(v+0),E=e.getX(v+1),M=e.getX(v+2);a.fromBufferAttribute(t,S),l.fromBufferAttribute(t,E),u.fromBufferAttribute(t,M),p.subVectors(u,l),g.subVectors(a,l),p.cross(g),f.fromBufferAttribute(r,S),d.fromBufferAttribute(r,E),m.fromBufferAttribute(r,M),f.add(p),d.add(p),m.add(p),r.setXYZ(S,f.x,f.y,f.z),r.setXYZ(E,d.x,d.y,d.z),r.setXYZ(M,m.x,m.y,m.z)}else for(let v=0,y=t.count;v<y;v+=3)a.fromBufferAttribute(t,v+0),l.fromBufferAttribute(t,v+1),u.fromBufferAttribute(t,v+2),p.subVectors(u,l),g.subVectors(a,l),p.cross(g),r.setXYZ(v+0,p.x,p.y,p.z),r.setXYZ(v+1,p.x,p.y,p.z),r.setXYZ(v+2,p.x,p.y,p.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)cn.fromBufferAttribute(e,t),cn.normalize(),e.setXYZ(t,cn.x,cn.y,cn.z)}toNonIndexed(){function e(f,d){const m=f.array,p=f.itemSize,g=f.normalized,v=new m.constructor(d.length*p);let y=0,S=0;for(let E=0,M=d.length;E<M;E++){f.isInterleavedBufferAttribute?y=d[E]*f.data.stride+f.offset:y=d[E]*p;for(let x=0;x<p;x++)v[S++]=m[y++]}return new Ui(v,p,g)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Kn,r=this.index.array,a=this.attributes;for(const f in a){const d=a[f],m=e(d,r);t.setAttribute(f,m)}const l=this.morphAttributes;for(const f in l){const d=[],m=l[f];for(let p=0,g=m.length;p<g;p++){const v=m[p],y=e(v,r);d.push(y)}t.morphAttributes[f]=d}t.morphTargetsRelative=this.morphTargetsRelative;const u=this.groups;for(let f=0,d=u.length;f<d;f++){const m=u[f];t.addGroup(m.start,m.count,m.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const d=this.parameters;for(const m in d)d[m]!==void 0&&(e[m]=d[m]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const d in r){const m=r[d];e.data.attributes[d]=m.toJSON(e.data)}const a={};let l=!1;for(const d in this.morphAttributes){const m=this.morphAttributes[d],p=[];for(let g=0,v=m.length;g<v;g++){const y=m[g];p.push(y.toJSON(e.data))}p.length>0&&(a[d]=p,l=!0)}l&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const u=this.groups;u.length>0&&(e.data.groups=JSON.parse(JSON.stringify(u)));const f=this.boundingSphere;return f!==null&&(e.data.boundingSphere={center:f.center.toArray(),radius:f.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(t));const a=e.attributes;for(const m in a){const p=a[m];this.setAttribute(m,p.clone(t))}const l=e.morphAttributes;for(const m in l){const p=[],g=l[m];for(let v=0,y=g.length;v<y;v++)p.push(g[v].clone(t));this.morphAttributes[m]=p}this.morphTargetsRelative=e.morphTargetsRelative;const u=e.groups;for(let m=0,p=u.length;m<p;m++){const g=u[m];this.addGroup(g.start,g.count,g.materialIndex)}const f=e.boundingBox;f!==null&&(this.boundingBox=f.clone());const d=e.boundingSphere;return d!==null&&(this.boundingSphere=d.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Dm=new Ht,es=new Gg,Al=new tc,Im=new j,Rl=new j,Cl=new j,bl=new j,ff=new j,Pl=new j,Um=new j,Ll=new j;class At extends nn{constructor(e=new Kn,t=new sa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=a.length;l<u;l++){const f=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}getVertexPosition(e,t){const r=this.geometry,a=r.attributes.position,l=r.morphAttributes.position,u=r.morphTargetsRelative;t.fromBufferAttribute(a,e);const f=this.morphTargetInfluences;if(l&&f){Pl.set(0,0,0);for(let d=0,m=l.length;d<m;d++){const p=f[d],g=l[d];p!==0&&(ff.fromBufferAttribute(g,e),u?Pl.addScaledVector(ff,p):Pl.addScaledVector(ff.sub(t),p))}t.add(Pl)}return t}raycast(e,t){const r=this.geometry,a=this.material,l=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Al.copy(r.boundingSphere),Al.applyMatrix4(l),es.copy(e.ray).recast(e.near),!(Al.containsPoint(es.origin)===!1&&(es.intersectSphere(Al,Im)===null||es.origin.distanceToSquared(Im)>(e.far-e.near)**2))&&(Dm.copy(l).invert(),es.copy(e.ray).applyMatrix4(Dm),!(r.boundingBox!==null&&es.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,es)))}_computeIntersections(e,t,r){let a;const l=this.geometry,u=this.material,f=l.index,d=l.attributes.position,m=l.attributes.uv,p=l.attributes.uv1,g=l.attributes.normal,v=l.groups,y=l.drawRange;if(f!==null)if(Array.isArray(u))for(let S=0,E=v.length;S<E;S++){const M=v[S],x=u[M.materialIndex],D=Math.max(M.start,y.start),L=Math.min(f.count,Math.min(M.start+M.count,y.start+y.count));for(let A=D,q=L;A<q;A+=3){const N=f.getX(A),F=f.getX(A+1),V=f.getX(A+2);a=Dl(this,x,e,r,m,p,g,N,F,V),a&&(a.faceIndex=Math.floor(A/3),a.face.materialIndex=M.materialIndex,t.push(a))}}else{const S=Math.max(0,y.start),E=Math.min(f.count,y.start+y.count);for(let M=S,x=E;M<x;M+=3){const D=f.getX(M),L=f.getX(M+1),A=f.getX(M+2);a=Dl(this,u,e,r,m,p,g,D,L,A),a&&(a.faceIndex=Math.floor(M/3),t.push(a))}}else if(d!==void 0)if(Array.isArray(u))for(let S=0,E=v.length;S<E;S++){const M=v[S],x=u[M.materialIndex],D=Math.max(M.start,y.start),L=Math.min(d.count,Math.min(M.start+M.count,y.start+y.count));for(let A=D,q=L;A<q;A+=3){const N=A,F=A+1,V=A+2;a=Dl(this,x,e,r,m,p,g,N,F,V),a&&(a.faceIndex=Math.floor(A/3),a.face.materialIndex=M.materialIndex,t.push(a))}}else{const S=Math.max(0,y.start),E=Math.min(d.count,y.start+y.count);for(let M=S,x=E;M<x;M+=3){const D=M,L=M+1,A=M+2;a=Dl(this,u,e,r,m,p,g,D,L,A),a&&(a.faceIndex=Math.floor(M/3),t.push(a))}}}}function sx(s,e,t,r,a,l,u,f){let d;if(e.side===Rn?d=r.intersectTriangle(u,l,a,!0,f):d=r.intersectTriangle(a,l,u,e.side===Fr,f),d===null)return null;Ll.copy(f),Ll.applyMatrix4(s.matrixWorld);const m=t.ray.origin.distanceTo(Ll);return m<t.near||m>t.far?null:{distance:m,point:Ll.clone(),object:s}}function Dl(s,e,t,r,a,l,u,f,d,m){s.getVertexPosition(f,Rl),s.getVertexPosition(d,Cl),s.getVertexPosition(m,bl);const p=sx(s,e,t,r,Rl,Cl,bl,Um);if(p){const g=new j;_i.getBarycoord(Um,Rl,Cl,bl,g),a&&(p.uv=_i.getInterpolatedAttribute(a,f,d,m,g,new xt)),l&&(p.uv1=_i.getInterpolatedAttribute(l,f,d,m,g,new xt)),u&&(p.normal=_i.getInterpolatedAttribute(u,f,d,m,g,new j),p.normal.dot(r.direction)>0&&p.normal.multiplyScalar(-1));const v={a:f,b:d,c:m,normal:new j,materialIndex:0};_i.getNormal(Rl,Cl,bl,v.normal),p.face=v,p.barycoord=g}return p}class tn extends Kn{constructor(e=1,t=1,r=1,a=1,l=1,u=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:a,heightSegments:l,depthSegments:u};const f=this;a=Math.floor(a),l=Math.floor(l),u=Math.floor(u);const d=[],m=[],p=[],g=[];let v=0,y=0;S("z","y","x",-1,-1,r,t,e,u,l,0),S("z","y","x",1,-1,r,t,-e,u,l,1),S("x","z","y",1,1,e,r,t,a,u,2),S("x","z","y",1,-1,e,r,-t,a,u,3),S("x","y","z",1,-1,e,t,r,a,l,4),S("x","y","z",-1,-1,e,t,-r,a,l,5),this.setIndex(d),this.setAttribute("position",new $t(m,3)),this.setAttribute("normal",new $t(p,3)),this.setAttribute("uv",new $t(g,2));function S(E,M,x,D,L,A,q,N,F,V,b){const C=A/F,z=q/V,ne=A/2,K=q/2,ae=N/2,ue=F+1,oe=V+1;let ce=0,k=0;const le=new j;for(let se=0;se<oe;se++){const U=se*z-K;for(let ie=0;ie<ue;ie++){const Ie=ie*C-ne;le[E]=Ie*D,le[M]=U*L,le[x]=ae,m.push(le.x,le.y,le.z),le[E]=0,le[M]=0,le[x]=N>0?1:-1,p.push(le.x,le.y,le.z),g.push(ie/F),g.push(1-se/V),ce+=1}}for(let se=0;se<V;se++)for(let U=0;U<F;U++){const ie=v+U+ue*se,Ie=v+U+ue*(se+1),Q=v+(U+1)+ue*(se+1),fe=v+(U+1)+ue*se;d.push(ie,Ie,fe),d.push(Ie,Q,fe),k+=6}f.addGroup(y,k,b),y+=k,v+=ce}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function uo(s){const e={};for(const t in s){e[t]={};for(const r in s[t]){const a=s[t][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=a.clone():Array.isArray(a)?e[t][r]=a.slice():e[t][r]=a}}return e}function An(s){const e={};for(let t=0;t<s.length;t++){const r=uo(s[t]);for(const a in r)e[a]=r[a]}return e}function ox(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function qg(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:St.workingColorSpace}const ax={clone:uo,merge:An};var lx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,cx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Or extends mo{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=lx,this.fragmentShader=cx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=uo(e.uniforms),this.uniformsGroups=ox(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const u=this.uniforms[a].value;u&&u.isTexture?t.uniforms[a]={type:"t",value:u.toJSON(e).uuid}:u&&u.isColor?t.uniforms[a]={type:"c",value:u.getHex()}:u&&u.isVector2?t.uniforms[a]={type:"v2",value:u.toArray()}:u&&u.isVector3?t.uniforms[a]={type:"v3",value:u.toArray()}:u&&u.isVector4?t.uniforms[a]={type:"v4",value:u.toArray()}:u&&u.isMatrix3?t.uniforms[a]={type:"m3",value:u.toArray()}:u&&u.isMatrix4?t.uniforms[a]={type:"m4",value:u.toArray()}:t.uniforms[a]={value:u}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}}class $g extends nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ht,this.projectionMatrix=new Ht,this.projectionMatrixInverse=new Ht,this.coordinateSystem=er}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const br=new j,Nm=new xt,Fm=new xt;class qn extends $g{constructor(e=50,t=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ph*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Wu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ph*2*Math.atan(Math.tan(Wu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){br.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(br.x,br.y).multiplyScalar(-e/br.z),br.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(br.x,br.y).multiplyScalar(-e/br.z)}getViewSize(e,t){return this.getViewBounds(e,Nm,Fm),t.subVectors(Fm,Nm)}setViewOffset(e,t,r,a,l,u){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Wu*.5*this.fov)/this.zoom,r=2*t,a=this.aspect*r,l=-.5*a;const u=this.view;if(this.view!==null&&this.view.enabled){const d=u.fullWidth,m=u.fullHeight;l+=u.offsetX*a/d,t-=u.offsetY*r/m,a*=u.width/d,r*=u.height/m}const f=this.filmOffset;f!==0&&(l+=e*f/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+a,t,t-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Zs=-90,Qs=1;class ux extends nn{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new qn(Zs,Qs,e,t);a.layers=this.layers,this.add(a);const l=new qn(Zs,Qs,e,t);l.layers=this.layers,this.add(l);const u=new qn(Zs,Qs,e,t);u.layers=this.layers,this.add(u);const f=new qn(Zs,Qs,e,t);f.layers=this.layers,this.add(f);const d=new qn(Zs,Qs,e,t);d.layers=this.layers,this.add(d);const m=new qn(Zs,Qs,e,t);m.layers=this.layers,this.add(m)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,a,l,u,f,d]=t;for(const m of t)this.remove(m);if(e===er)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),u.up.set(0,0,1),u.lookAt(0,-1,0),f.up.set(0,1,0),f.lookAt(0,0,1),d.up.set(0,1,0),d.lookAt(0,0,-1);else if(e===ql)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),u.up.set(0,0,-1),u.lookAt(0,-1,0),f.up.set(0,-1,0),f.lookAt(0,0,1),d.up.set(0,-1,0),d.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const m of t)this.add(m),m.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,u,f,d,m,p]=this.children,g=e.getRenderTarget(),v=e.getActiveCubeFace(),y=e.getActiveMipmapLevel(),S=e.xr.enabled;e.xr.enabled=!1;const E=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(t,l),e.setRenderTarget(r,1,a),e.render(t,u),e.setRenderTarget(r,2,a),e.render(t,f),e.setRenderTarget(r,3,a),e.render(t,d),e.setRenderTarget(r,4,a),e.render(t,m),r.texture.generateMipmaps=E,e.setRenderTarget(r,5,a),e.render(t,p),e.setRenderTarget(g,v,y),e.xr.enabled=S,r.texture.needsPMREMUpdate=!0}}class Kg extends Bn{constructor(e,t,r,a,l,u,f,d,m,p){e=e!==void 0?e:[],t=t!==void 0?t:oo,super(e,t,r,a,l,u,f,d,m,p),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fx extends ms{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new Kg(a,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Di}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new tn(5,5,5),l=new Or({name:"CubemapFromEquirect",uniforms:uo(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Rn,blending:Ur});l.uniforms.tEquirect.value=t;const u=new At(a,l),f=t.minFilter;return t.minFilter===hs&&(t.minFilter=Di),new ux(1,10,this).update(e,u),t.minFilter=f,u.geometry.dispose(),u.material.dispose(),this}clear(e,t,r,a){const l=e.getRenderTarget();for(let u=0;u<6;u++)e.setRenderTarget(this,u),e.clear(t,r,a);e.setRenderTarget(l)}}const hf=new j,hx=new j,dx=new at;class os{constructor(e=new j(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,a){return this.normal.set(e,t,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const a=hf.subVectors(r,t).cross(hx.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const r=e.delta(hf),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/a;return l<0||l>1?null:t.copy(e.start).addScaledVector(r,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||dx.getNormalMatrix(e),a=this.coplanarPoint(hf).applyMatrix4(e),l=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ts=new tc,Il=new j;class Ch{constructor(e=new os,t=new os,r=new os,a=new os,l=new os,u=new os){this.planes=[e,t,r,a,l,u]}set(e,t,r,a,l,u){const f=this.planes;return f[0].copy(e),f[1].copy(t),f[2].copy(r),f[3].copy(a),f[4].copy(l),f[5].copy(u),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=er){const r=this.planes,a=e.elements,l=a[0],u=a[1],f=a[2],d=a[3],m=a[4],p=a[5],g=a[6],v=a[7],y=a[8],S=a[9],E=a[10],M=a[11],x=a[12],D=a[13],L=a[14],A=a[15];if(r[0].setComponents(d-l,v-m,M-y,A-x).normalize(),r[1].setComponents(d+l,v+m,M+y,A+x).normalize(),r[2].setComponents(d+u,v+p,M+S,A+D).normalize(),r[3].setComponents(d-u,v-p,M-S,A-D).normalize(),r[4].setComponents(d-f,v-g,M-E,A-L).normalize(),t===er)r[5].setComponents(d+f,v+g,M+E,A+L).normalize();else if(t===ql)r[5].setComponents(f,g,E,L).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ts.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ts.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ts)}intersectsSprite(e){return ts.center.set(0,0,0),ts.radius=.7071067811865476,ts.applyMatrix4(e.matrixWorld),this.intersectsSphere(ts)}intersectsSphere(e){const t=this.planes,r=e.center,a=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const a=t[r];if(Il.x=a.normal.x>0?e.max.x:e.min.x,Il.y=a.normal.y>0?e.max.y:e.min.y,Il.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Il)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Zg(){let s=null,e=!1,t=null,r=null;function a(l,u){t(l,u),r=s.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(r=s.requestAnimationFrame(a),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function px(s){const e=new WeakMap;function t(f,d){const m=f.array,p=f.usage,g=m.byteLength,v=s.createBuffer();s.bindBuffer(d,v),s.bufferData(d,m,p),f.onUploadCallback();let y;if(m instanceof Float32Array)y=s.FLOAT;else if(m instanceof Uint16Array)f.isFloat16BufferAttribute?y=s.HALF_FLOAT:y=s.UNSIGNED_SHORT;else if(m instanceof Int16Array)y=s.SHORT;else if(m instanceof Uint32Array)y=s.UNSIGNED_INT;else if(m instanceof Int32Array)y=s.INT;else if(m instanceof Int8Array)y=s.BYTE;else if(m instanceof Uint8Array)y=s.UNSIGNED_BYTE;else if(m instanceof Uint8ClampedArray)y=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+m);return{buffer:v,type:y,bytesPerElement:m.BYTES_PER_ELEMENT,version:f.version,size:g}}function r(f,d,m){const p=d.array,g=d.updateRanges;if(s.bindBuffer(m,f),g.length===0)s.bufferSubData(m,0,p);else{g.sort((y,S)=>y.start-S.start);let v=0;for(let y=1;y<g.length;y++){const S=g[v],E=g[y];E.start<=S.start+S.count+1?S.count=Math.max(S.count,E.start+E.count-S.start):(++v,g[v]=E)}g.length=v+1;for(let y=0,S=g.length;y<S;y++){const E=g[y];s.bufferSubData(m,E.start*p.BYTES_PER_ELEMENT,p,E.start,E.count)}d.clearUpdateRanges()}d.onUploadCallback()}function a(f){return f.isInterleavedBufferAttribute&&(f=f.data),e.get(f)}function l(f){f.isInterleavedBufferAttribute&&(f=f.data);const d=e.get(f);d&&(s.deleteBuffer(d.buffer),e.delete(f))}function u(f,d){if(f.isInterleavedBufferAttribute&&(f=f.data),f.isGLBufferAttribute){const p=e.get(f);(!p||p.version<f.version)&&e.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}const m=e.get(f);if(m===void 0)e.set(f,t(f,d));else if(m.version<f.version){if(m.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(m.buffer,f,d),m.version=f.version}}return{get:a,remove:l,update:u}}class nc extends Kn{constructor(e=1,t=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:a};const l=e/2,u=t/2,f=Math.floor(r),d=Math.floor(a),m=f+1,p=d+1,g=e/f,v=t/d,y=[],S=[],E=[],M=[];for(let x=0;x<p;x++){const D=x*v-u;for(let L=0;L<m;L++){const A=L*g-l;S.push(A,-D,0),E.push(0,0,1),M.push(L/f),M.push(1-x/d)}}for(let x=0;x<d;x++)for(let D=0;D<f;D++){const L=D+m*x,A=D+m*(x+1),q=D+1+m*(x+1),N=D+1+m*x;y.push(L,A,N),y.push(A,q,N)}this.setIndex(y),this.setAttribute("position",new $t(S,3)),this.setAttribute("normal",new $t(E,3)),this.setAttribute("uv",new $t(M,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new nc(e.width,e.height,e.widthSegments,e.heightSegments)}}var mx=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,gx=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,vx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_x=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xx=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,yx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mx=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Sx=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ex=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,wx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Tx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ax=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Rx=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Cx=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,bx=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Px=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Lx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Dx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ix=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ux=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Nx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Fx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Ox=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,zx=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,kx=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Bx=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Hx=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vx=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gx=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wx=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Xx="gl_FragColor = linearToOutputTexel( gl_FragColor );",jx=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Yx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,qx=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,$x=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Kx=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Zx=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Qx=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Jx=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ey=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ty=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ny=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,iy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ry=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,sy=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,oy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ay=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,ly=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,cy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,uy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,fy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,dy=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,py=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,my=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,gy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,vy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,_y=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xy=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,yy=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,My=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Sy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ey=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,wy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ty=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ay=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Ry=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Cy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,by=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Py=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ly=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Dy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Iy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Uy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ny=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Fy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Oy=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,zy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ky=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,By=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Hy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Vy=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Gy=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Wy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,jy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,qy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$y=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ky=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Zy=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Qy=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Jy=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,eM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,tM=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,nM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,iM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,rM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,sM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,oM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,aM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,lM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,cM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,uM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,fM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,dM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const pM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,mM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,vM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_M=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,yM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,MM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,SM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,EM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,wM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,TM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,AM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,RM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,CM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,bM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,LM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,DM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,IM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,UM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,NM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,FM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,OM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,kM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,BM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,HM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,GM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,WM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,XM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,YM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,lt={alphahash_fragment:mx,alphahash_pars_fragment:gx,alphamap_fragment:vx,alphamap_pars_fragment:_x,alphatest_fragment:xx,alphatest_pars_fragment:yx,aomap_fragment:Mx,aomap_pars_fragment:Sx,batching_pars_vertex:Ex,batching_vertex:wx,begin_vertex:Tx,beginnormal_vertex:Ax,bsdfs:Rx,iridescence_fragment:Cx,bumpmap_pars_fragment:bx,clipping_planes_fragment:Px,clipping_planes_pars_fragment:Lx,clipping_planes_pars_vertex:Dx,clipping_planes_vertex:Ix,color_fragment:Ux,color_pars_fragment:Nx,color_pars_vertex:Fx,color_vertex:Ox,common:zx,cube_uv_reflection_fragment:kx,defaultnormal_vertex:Bx,displacementmap_pars_vertex:Hx,displacementmap_vertex:Vx,emissivemap_fragment:Gx,emissivemap_pars_fragment:Wx,colorspace_fragment:Xx,colorspace_pars_fragment:jx,envmap_fragment:Yx,envmap_common_pars_fragment:qx,envmap_pars_fragment:$x,envmap_pars_vertex:Kx,envmap_physical_pars_fragment:ay,envmap_vertex:Zx,fog_vertex:Qx,fog_pars_vertex:Jx,fog_fragment:ey,fog_pars_fragment:ty,gradientmap_pars_fragment:ny,lightmap_pars_fragment:iy,lights_lambert_fragment:ry,lights_lambert_pars_fragment:sy,lights_pars_begin:oy,lights_toon_fragment:ly,lights_toon_pars_fragment:cy,lights_phong_fragment:uy,lights_phong_pars_fragment:fy,lights_physical_fragment:hy,lights_physical_pars_fragment:dy,lights_fragment_begin:py,lights_fragment_maps:my,lights_fragment_end:gy,logdepthbuf_fragment:vy,logdepthbuf_pars_fragment:_y,logdepthbuf_pars_vertex:xy,logdepthbuf_vertex:yy,map_fragment:My,map_pars_fragment:Sy,map_particle_fragment:Ey,map_particle_pars_fragment:wy,metalnessmap_fragment:Ty,metalnessmap_pars_fragment:Ay,morphinstance_vertex:Ry,morphcolor_vertex:Cy,morphnormal_vertex:by,morphtarget_pars_vertex:Py,morphtarget_vertex:Ly,normal_fragment_begin:Dy,normal_fragment_maps:Iy,normal_pars_fragment:Uy,normal_pars_vertex:Ny,normal_vertex:Fy,normalmap_pars_fragment:Oy,clearcoat_normal_fragment_begin:zy,clearcoat_normal_fragment_maps:ky,clearcoat_pars_fragment:By,iridescence_pars_fragment:Hy,opaque_fragment:Vy,packing:Gy,premultiplied_alpha_fragment:Wy,project_vertex:Xy,dithering_fragment:jy,dithering_pars_fragment:Yy,roughnessmap_fragment:qy,roughnessmap_pars_fragment:$y,shadowmap_pars_fragment:Ky,shadowmap_pars_vertex:Zy,shadowmap_vertex:Qy,shadowmask_pars_fragment:Jy,skinbase_vertex:eM,skinning_pars_vertex:tM,skinning_vertex:nM,skinnormal_vertex:iM,specularmap_fragment:rM,specularmap_pars_fragment:sM,tonemapping_fragment:oM,tonemapping_pars_fragment:aM,transmission_fragment:lM,transmission_pars_fragment:cM,uv_pars_fragment:uM,uv_pars_vertex:fM,uv_vertex:hM,worldpos_vertex:dM,background_vert:pM,background_frag:mM,backgroundCube_vert:gM,backgroundCube_frag:vM,cube_vert:_M,cube_frag:xM,depth_vert:yM,depth_frag:MM,distanceRGBA_vert:SM,distanceRGBA_frag:EM,equirect_vert:wM,equirect_frag:TM,linedashed_vert:AM,linedashed_frag:RM,meshbasic_vert:CM,meshbasic_frag:bM,meshlambert_vert:PM,meshlambert_frag:LM,meshmatcap_vert:DM,meshmatcap_frag:IM,meshnormal_vert:UM,meshnormal_frag:NM,meshphong_vert:FM,meshphong_frag:OM,meshphysical_vert:zM,meshphysical_frag:kM,meshtoon_vert:BM,meshtoon_frag:HM,points_vert:VM,points_frag:GM,shadow_vert:WM,shadow_frag:XM,sprite_vert:jM,sprite_frag:YM},be={common:{diffuse:{value:new _t(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new at},alphaMap:{value:null},alphaMapTransform:{value:new at},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new at}},envmap:{envMap:{value:null},envMapRotation:{value:new at},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new at}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new at}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new at},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new at},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new at},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new at}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new at}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new at}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new _t(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new _t(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new at},alphaTest:{value:0},uvTransform:{value:new at}},sprite:{diffuse:{value:new _t(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new at},alphaMap:{value:null},alphaMapTransform:{value:new at},alphaTest:{value:0}}},Pi={basic:{uniforms:An([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:lt.meshbasic_vert,fragmentShader:lt.meshbasic_frag},lambert:{uniforms:An([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new _t(0)}}]),vertexShader:lt.meshlambert_vert,fragmentShader:lt.meshlambert_frag},phong:{uniforms:An([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new _t(0)},specular:{value:new _t(1118481)},shininess:{value:30}}]),vertexShader:lt.meshphong_vert,fragmentShader:lt.meshphong_frag},standard:{uniforms:An([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new _t(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag},toon:{uniforms:An([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new _t(0)}}]),vertexShader:lt.meshtoon_vert,fragmentShader:lt.meshtoon_frag},matcap:{uniforms:An([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:lt.meshmatcap_vert,fragmentShader:lt.meshmatcap_frag},points:{uniforms:An([be.points,be.fog]),vertexShader:lt.points_vert,fragmentShader:lt.points_frag},dashed:{uniforms:An([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:lt.linedashed_vert,fragmentShader:lt.linedashed_frag},depth:{uniforms:An([be.common,be.displacementmap]),vertexShader:lt.depth_vert,fragmentShader:lt.depth_frag},normal:{uniforms:An([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:lt.meshnormal_vert,fragmentShader:lt.meshnormal_frag},sprite:{uniforms:An([be.sprite,be.fog]),vertexShader:lt.sprite_vert,fragmentShader:lt.sprite_frag},background:{uniforms:{uvTransform:{value:new at},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:lt.background_vert,fragmentShader:lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new at}},vertexShader:lt.backgroundCube_vert,fragmentShader:lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:lt.cube_vert,fragmentShader:lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:lt.equirect_vert,fragmentShader:lt.equirect_frag},distanceRGBA:{uniforms:An([be.common,be.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:lt.distanceRGBA_vert,fragmentShader:lt.distanceRGBA_frag},shadow:{uniforms:An([be.lights,be.fog,{color:{value:new _t(0)},opacity:{value:1}}]),vertexShader:lt.shadow_vert,fragmentShader:lt.shadow_frag}};Pi.physical={uniforms:An([Pi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new at},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new at},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new at},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new at},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new at},sheen:{value:0},sheenColor:{value:new _t(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new at},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new at},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new at},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new at},attenuationDistance:{value:0},attenuationColor:{value:new _t(0)},specularColor:{value:new _t(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new at},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new at},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new at}}]),vertexShader:lt.meshphysical_vert,fragmentShader:lt.meshphysical_frag};const Ul={r:0,b:0,g:0},ns=new Ni,qM=new Ht;function $M(s,e,t,r,a,l,u){const f=new _t(0);let d=l===!0?0:1,m,p,g=null,v=0,y=null;function S(D){let L=D.isScene===!0?D.background:null;return L&&L.isTexture&&(L=(D.backgroundBlurriness>0?t:e).get(L)),L}function E(D){let L=!1;const A=S(D);A===null?x(f,d):A&&A.isColor&&(x(A,1),L=!0);const q=s.xr.getEnvironmentBlendMode();q==="additive"?r.buffers.color.setClear(0,0,0,1,u):q==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,u),(s.autoClear||L)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function M(D,L){const A=S(L);A&&(A.isCubeTexture||A.mapping===Jl)?(p===void 0&&(p=new At(new tn(1,1,1),new Or({name:"BackgroundCubeMaterial",uniforms:uo(Pi.backgroundCube.uniforms),vertexShader:Pi.backgroundCube.vertexShader,fragmentShader:Pi.backgroundCube.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1})),p.geometry.deleteAttribute("normal"),p.geometry.deleteAttribute("uv"),p.onBeforeRender=function(q,N,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(p.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(p)),ns.copy(L.backgroundRotation),ns.x*=-1,ns.y*=-1,ns.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(ns.y*=-1,ns.z*=-1),p.material.uniforms.envMap.value=A,p.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,p.material.uniforms.backgroundBlurriness.value=L.backgroundBlurriness,p.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,p.material.uniforms.backgroundRotation.value.setFromMatrix4(qM.makeRotationFromEuler(ns)),p.material.toneMapped=St.getTransfer(A.colorSpace)!==Lt,(g!==A||v!==A.version||y!==s.toneMapping)&&(p.material.needsUpdate=!0,g=A,v=A.version,y=s.toneMapping),p.layers.enableAll(),D.unshift(p,p.geometry,p.material,0,0,null)):A&&A.isTexture&&(m===void 0&&(m=new At(new nc(2,2),new Or({name:"BackgroundMaterial",uniforms:uo(Pi.background.uniforms),vertexShader:Pi.background.vertexShader,fragmentShader:Pi.background.fragmentShader,side:Fr,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(m)),m.material.uniforms.t2D.value=A,m.material.uniforms.backgroundIntensity.value=L.backgroundIntensity,m.material.toneMapped=St.getTransfer(A.colorSpace)!==Lt,A.matrixAutoUpdate===!0&&A.updateMatrix(),m.material.uniforms.uvTransform.value.copy(A.matrix),(g!==A||v!==A.version||y!==s.toneMapping)&&(m.material.needsUpdate=!0,g=A,v=A.version,y=s.toneMapping),m.layers.enableAll(),D.unshift(m,m.geometry,m.material,0,0,null))}function x(D,L){D.getRGB(Ul,qg(s)),r.buffers.color.setClear(Ul.r,Ul.g,Ul.b,L,u)}return{getClearColor:function(){return f},setClearColor:function(D,L=1){f.set(D),d=L,x(f,d)},getClearAlpha:function(){return d},setClearAlpha:function(D){d=D,x(f,d)},render:E,addToRenderList:M}}function KM(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},a=v(null);let l=a,u=!1;function f(C,z,ne,K,ae){let ue=!1;const oe=g(K,ne,z);l!==oe&&(l=oe,m(l.object)),ue=y(C,K,ne,ae),ue&&S(C,K,ne,ae),ae!==null&&e.update(ae,s.ELEMENT_ARRAY_BUFFER),(ue||u)&&(u=!1,A(C,z,ne,K),ae!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(ae).buffer))}function d(){return s.createVertexArray()}function m(C){return s.bindVertexArray(C)}function p(C){return s.deleteVertexArray(C)}function g(C,z,ne){const K=ne.wireframe===!0;let ae=r[C.id];ae===void 0&&(ae={},r[C.id]=ae);let ue=ae[z.id];ue===void 0&&(ue={},ae[z.id]=ue);let oe=ue[K];return oe===void 0&&(oe=v(d()),ue[K]=oe),oe}function v(C){const z=[],ne=[],K=[];for(let ae=0;ae<t;ae++)z[ae]=0,ne[ae]=0,K[ae]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:z,enabledAttributes:ne,attributeDivisors:K,object:C,attributes:{},index:null}}function y(C,z,ne,K){const ae=l.attributes,ue=z.attributes;let oe=0;const ce=ne.getAttributes();for(const k in ce)if(ce[k].location>=0){const se=ae[k];let U=ue[k];if(U===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(U=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(U=C.instanceColor)),se===void 0||se.attribute!==U||U&&se.data!==U.data)return!0;oe++}return l.attributesNum!==oe||l.index!==K}function S(C,z,ne,K){const ae={},ue=z.attributes;let oe=0;const ce=ne.getAttributes();for(const k in ce)if(ce[k].location>=0){let se=ue[k];se===void 0&&(k==="instanceMatrix"&&C.instanceMatrix&&(se=C.instanceMatrix),k==="instanceColor"&&C.instanceColor&&(se=C.instanceColor));const U={};U.attribute=se,se&&se.data&&(U.data=se.data),ae[k]=U,oe++}l.attributes=ae,l.attributesNum=oe,l.index=K}function E(){const C=l.newAttributes;for(let z=0,ne=C.length;z<ne;z++)C[z]=0}function M(C){x(C,0)}function x(C,z){const ne=l.newAttributes,K=l.enabledAttributes,ae=l.attributeDivisors;ne[C]=1,K[C]===0&&(s.enableVertexAttribArray(C),K[C]=1),ae[C]!==z&&(s.vertexAttribDivisor(C,z),ae[C]=z)}function D(){const C=l.newAttributes,z=l.enabledAttributes;for(let ne=0,K=z.length;ne<K;ne++)z[ne]!==C[ne]&&(s.disableVertexAttribArray(ne),z[ne]=0)}function L(C,z,ne,K,ae,ue,oe){oe===!0?s.vertexAttribIPointer(C,z,ne,ae,ue):s.vertexAttribPointer(C,z,ne,K,ae,ue)}function A(C,z,ne,K){E();const ae=K.attributes,ue=ne.getAttributes(),oe=z.defaultAttributeValues;for(const ce in ue){const k=ue[ce];if(k.location>=0){let le=ae[ce];if(le===void 0&&(ce==="instanceMatrix"&&C.instanceMatrix&&(le=C.instanceMatrix),ce==="instanceColor"&&C.instanceColor&&(le=C.instanceColor)),le!==void 0){const se=le.normalized,U=le.itemSize,ie=e.get(le);if(ie===void 0)continue;const Ie=ie.buffer,Q=ie.type,fe=ie.bytesPerElement,Se=Q===s.INT||Q===s.UNSIGNED_INT||le.gpuType===Sh;if(le.isInterleavedBufferAttribute){const _e=le.data,Te=_e.stride,Ue=le.offset;if(_e.isInstancedInterleavedBuffer){for(let Qe=0;Qe<k.locationSize;Qe++)x(k.location+Qe,_e.meshPerAttribute);C.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=_e.meshPerAttribute*_e.count)}else for(let Qe=0;Qe<k.locationSize;Qe++)M(k.location+Qe);s.bindBuffer(s.ARRAY_BUFFER,Ie);for(let Qe=0;Qe<k.locationSize;Qe++)L(k.location+Qe,U/k.locationSize,Q,se,Te*fe,(Ue+U/k.locationSize*Qe)*fe,Se)}else{if(le.isInstancedBufferAttribute){for(let _e=0;_e<k.locationSize;_e++)x(k.location+_e,le.meshPerAttribute);C.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let _e=0;_e<k.locationSize;_e++)M(k.location+_e);s.bindBuffer(s.ARRAY_BUFFER,Ie);for(let _e=0;_e<k.locationSize;_e++)L(k.location+_e,U/k.locationSize,Q,se,U*fe,U/k.locationSize*_e*fe,Se)}}else if(oe!==void 0){const se=oe[ce];if(se!==void 0)switch(se.length){case 2:s.vertexAttrib2fv(k.location,se);break;case 3:s.vertexAttrib3fv(k.location,se);break;case 4:s.vertexAttrib4fv(k.location,se);break;default:s.vertexAttrib1fv(k.location,se)}}}}D()}function q(){V();for(const C in r){const z=r[C];for(const ne in z){const K=z[ne];for(const ae in K)p(K[ae].object),delete K[ae];delete z[ne]}delete r[C]}}function N(C){if(r[C.id]===void 0)return;const z=r[C.id];for(const ne in z){const K=z[ne];for(const ae in K)p(K[ae].object),delete K[ae];delete z[ne]}delete r[C.id]}function F(C){for(const z in r){const ne=r[z];if(ne[C.id]===void 0)continue;const K=ne[C.id];for(const ae in K)p(K[ae].object),delete K[ae];delete ne[C.id]}}function V(){b(),u=!0,l!==a&&(l=a,m(l.object))}function b(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:f,reset:V,resetDefaultState:b,dispose:q,releaseStatesOfGeometry:N,releaseStatesOfProgram:F,initAttributes:E,enableAttribute:M,disableUnusedAttributes:D}}function ZM(s,e,t){let r;function a(m){r=m}function l(m,p){s.drawArrays(r,m,p),t.update(p,r,1)}function u(m,p,g){g!==0&&(s.drawArraysInstanced(r,m,p,g),t.update(p,r,g))}function f(m,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,m,0,p,0,g);let y=0;for(let S=0;S<g;S++)y+=p[S];t.update(y,r,1)}function d(m,p,g,v){if(g===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let S=0;S<m.length;S++)u(m[S],p[S],v[S]);else{y.multiDrawArraysInstancedWEBGL(r,m,0,p,0,v,0,g);let S=0;for(let E=0;E<g;E++)S+=p[E]*v[E];t.update(S,r,1)}}this.setMode=a,this.render=l,this.renderInstances=u,this.renderMultiDraw=f,this.renderMultiDrawInstances=d}function QM(s,e,t,r){let a;function l(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const F=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function u(F){return!(F!==xi&&r.convert(F)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(F){const V=F===oa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(F!==nr&&r.convert(F)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&F!==Ji&&!V)}function d(F){if(F==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let m=t.precision!==void 0?t.precision:"highp";const p=d(m);p!==m&&(console.warn("THREE.WebGLRenderer:",m,"not supported, using",p,"instead."),m=p);const g=t.logarithmicDepthBuffer===!0,v=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),y=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),S=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),E=s.getParameter(s.MAX_TEXTURE_SIZE),M=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),x=s.getParameter(s.MAX_VERTEX_ATTRIBS),D=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),L=s.getParameter(s.MAX_VARYING_VECTORS),A=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),q=S>0,N=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:d,textureFormatReadable:u,textureTypeReadable:f,precision:m,logarithmicDepthBuffer:g,reverseDepthBuffer:v,maxTextures:y,maxVertexTextures:S,maxTextureSize:E,maxCubemapSize:M,maxAttributes:x,maxVertexUniforms:D,maxVaryings:L,maxFragmentUniforms:A,vertexTextures:q,maxSamples:N}}function JM(s){const e=this;let t=null,r=0,a=!1,l=!1;const u=new os,f=new at,d={value:null,needsUpdate:!1};this.uniform=d,this.numPlanes=0,this.numIntersection=0,this.init=function(g,v){const y=g.length!==0||v||r!==0||a;return a=v,r=g.length,y},this.beginShadows=function(){l=!0,p(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(g,v){t=p(g,v,0)},this.setState=function(g,v,y){const S=g.clippingPlanes,E=g.clipIntersection,M=g.clipShadows,x=s.get(g);if(!a||S===null||S.length===0||l&&!M)l?p(null):m();else{const D=l?0:r,L=D*4;let A=x.clippingState||null;d.value=A,A=p(S,v,L,y);for(let q=0;q!==L;++q)A[q]=t[q];x.clippingState=A,this.numIntersection=E?this.numPlanes:0,this.numPlanes+=D}};function m(){d.value!==t&&(d.value=t,d.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function p(g,v,y,S){const E=g!==null?g.length:0;let M=null;if(E!==0){if(M=d.value,S!==!0||M===null){const x=y+E*4,D=v.matrixWorldInverse;f.getNormalMatrix(D),(M===null||M.length<x)&&(M=new Float32Array(x));for(let L=0,A=y;L!==E;++L,A+=4)u.copy(g[L]).applyMatrix4(D,f),u.normal.toArray(M,A),M[A+3]=u.constant}d.value=M,d.needsUpdate=!0}return e.numPlanes=E,e.numIntersection=0,M}}function eS(s){let e=new WeakMap;function t(u,f){return f===zf?u.mapping=oo:f===kf&&(u.mapping=ao),u}function r(u){if(u&&u.isTexture){const f=u.mapping;if(f===zf||f===kf)if(e.has(u)){const d=e.get(u).texture;return t(d,u.mapping)}else{const d=u.image;if(d&&d.height>0){const m=new fx(d.height);return m.fromEquirectangularTexture(s,u),e.set(u,m),u.addEventListener("dispose",a),t(m.texture,u.mapping)}else return null}}return u}function a(u){const f=u.target;f.removeEventListener("dispose",a);const d=e.get(f);d!==void 0&&(e.delete(f),d.dispose())}function l(){e=new WeakMap}return{get:r,dispose:l}}class Qg extends $g{constructor(e=-1,t=1,r=1,a=-1,l=.1,u=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=a,this.near=l,this.far=u,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,a,l,u){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=u,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let l=r-e,u=r+e,f=a+t,d=a-t;if(this.view!==null&&this.view.enabled){const m=(this.right-this.left)/this.view.fullWidth/this.zoom,p=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=m*this.view.offsetX,u=l+m*this.view.width,f-=p*this.view.offsetY,d=f-p*this.view.height}this.projectionMatrix.makeOrthographic(l,u,f,d,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const to=4,Om=[.125,.215,.35,.446,.526,.582],us=20,df=new Qg,zm=new _t;let pf=null,mf=0,gf=0,vf=!1;const as=(1+Math.sqrt(5))/2,Js=1/as,km=[new j(-as,Js,0),new j(as,Js,0),new j(-Js,0,as),new j(Js,0,as),new j(0,as,-Js),new j(0,as,Js),new j(-1,1,-1),new j(1,1,-1),new j(-1,1,1),new j(1,1,1)];class Bm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,r=.1,a=100){pf=this._renderer.getRenderTarget(),mf=this._renderer.getActiveCubeFace(),gf=this._renderer.getActiveMipmapLevel(),vf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,r,a,l),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(pf,mf,gf),this._renderer.xr.enabled=vf,e.scissorTest=!1,Nl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===oo||e.mapping===ao?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),pf=this._renderer.getRenderTarget(),mf=this._renderer.getActiveCubeFace(),gf=this._renderer.getActiveMipmapLevel(),vf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:Di,minFilter:Di,generateMipmaps:!1,type:oa,format:xi,colorSpace:ho,depthBuffer:!1},a=Hm(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Hm(e,t,r);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=tS(l)),this._blurMaterial=nS(l,e,t)}return a}_compileMaterial(e){const t=new At(this._lodPlanes[0],e);this._renderer.compile(t,df)}_sceneToCubeUV(e,t,r,a){const f=new qn(90,1,t,r),d=[1,-1,1,1,1,1],m=[1,1,1,-1,-1,-1],p=this._renderer,g=p.autoClear,v=p.toneMapping;p.getClearColor(zm),p.toneMapping=Nr,p.autoClear=!1;const y=new sa({name:"PMREM.Background",side:Rn,depthWrite:!1,depthTest:!1}),S=new At(new tn,y);let E=!1;const M=e.background;M?M.isColor&&(y.color.copy(M),e.background=null,E=!0):(y.color.copy(zm),E=!0);for(let x=0;x<6;x++){const D=x%3;D===0?(f.up.set(0,d[x],0),f.lookAt(m[x],0,0)):D===1?(f.up.set(0,0,d[x]),f.lookAt(0,m[x],0)):(f.up.set(0,d[x],0),f.lookAt(0,0,m[x]));const L=this._cubeSize;Nl(a,D*L,x>2?L:0,L,L),p.setRenderTarget(a),E&&p.render(S,f),p.render(e,f)}S.geometry.dispose(),S.material.dispose(),p.toneMapping=v,p.autoClear=g,e.background=M}_textureToCubeUV(e,t){const r=this._renderer,a=e.mapping===oo||e.mapping===ao;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vm());const l=a?this._cubemapMaterial:this._equirectMaterial,u=new At(this._lodPlanes[0],l),f=l.uniforms;f.envMap.value=e;const d=this._cubeSize;Nl(t,0,0,3*d,2*d),r.setRenderTarget(t),r.render(u,df)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const a=this._lodPlanes.length;for(let l=1;l<a;l++){const u=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),f=km[(a-l-1)%km.length];this._blur(e,l-1,l,u,f)}t.autoClear=r}_blur(e,t,r,a,l){const u=this._pingPongRenderTarget;this._halfBlur(e,u,t,r,a,"latitudinal",l),this._halfBlur(u,e,r,r,a,"longitudinal",l)}_halfBlur(e,t,r,a,l,u,f){const d=this._renderer,m=this._blurMaterial;u!=="latitudinal"&&u!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const p=3,g=new At(this._lodPlanes[a],m),v=m.uniforms,y=this._sizeLods[r]-1,S=isFinite(l)?Math.PI/(2*y):2*Math.PI/(2*us-1),E=l/S,M=isFinite(l)?1+Math.floor(p*E):us;M>us&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${M} samples when the maximum is set to ${us}`);const x=[];let D=0;for(let F=0;F<us;++F){const V=F/E,b=Math.exp(-V*V/2);x.push(b),F===0?D+=b:F<M&&(D+=2*b)}for(let F=0;F<x.length;F++)x[F]=x[F]/D;v.envMap.value=e.texture,v.samples.value=M,v.weights.value=x,v.latitudinal.value=u==="latitudinal",f&&(v.poleAxis.value=f);const{_lodMax:L}=this;v.dTheta.value=S,v.mipInt.value=L-r;const A=this._sizeLods[a],q=3*A*(a>L-to?a-L+to:0),N=4*(this._cubeSize-A);Nl(t,q,N,3*A,2*A),d.setRenderTarget(t),d.render(g,df)}}function tS(s){const e=[],t=[],r=[];let a=s;const l=s-to+1+Om.length;for(let u=0;u<l;u++){const f=Math.pow(2,a);t.push(f);let d=1/f;u>s-to?d=Om[u-s+to-1]:u===0&&(d=0),r.push(d);const m=1/(f-2),p=-m,g=1+m,v=[p,p,g,p,g,g,p,p,g,g,p,g],y=6,S=6,E=3,M=2,x=1,D=new Float32Array(E*S*y),L=new Float32Array(M*S*y),A=new Float32Array(x*S*y);for(let N=0;N<y;N++){const F=N%3*2/3-1,V=N>2?0:-1,b=[F,V,0,F+2/3,V,0,F+2/3,V+1,0,F,V,0,F+2/3,V+1,0,F,V+1,0];D.set(b,E*S*N),L.set(v,M*S*N);const C=[N,N,N,N,N,N];A.set(C,x*S*N)}const q=new Kn;q.setAttribute("position",new Ui(D,E)),q.setAttribute("uv",new Ui(L,M)),q.setAttribute("faceIndex",new Ui(A,x)),e.push(q),a>to&&a--}return{lodPlanes:e,sizeLods:t,sigmas:r}}function Hm(s,e,t){const r=new ms(s,e,t);return r.texture.mapping=Jl,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Nl(s,e,t,r,a){s.viewport.set(e,t,r,a),s.scissor.set(e,t,r,a)}function nS(s,e,t){const r=new Float32Array(us),a=new j(0,1,0);return new Or({name:"SphericalGaussianBlur",defines:{n:us,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ur,depthTest:!1,depthWrite:!1})}function Vm(){return new Or({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ur,depthTest:!1,depthWrite:!1})}function Gm(){return new Or({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:bh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ur,depthTest:!1,depthWrite:!1})}function bh(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function iS(s){let e=new WeakMap,t=null;function r(f){if(f&&f.isTexture){const d=f.mapping,m=d===zf||d===kf,p=d===oo||d===ao;if(m||p){let g=e.get(f);const v=g!==void 0?g.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==v)return t===null&&(t=new Bm(s)),g=m?t.fromEquirectangular(f,g):t.fromCubemap(f,g),g.texture.pmremVersion=f.pmremVersion,e.set(f,g),g.texture;if(g!==void 0)return g.texture;{const y=f.image;return m&&y&&y.height>0||p&&y&&a(y)?(t===null&&(t=new Bm(s)),g=m?t.fromEquirectangular(f):t.fromCubemap(f),g.texture.pmremVersion=f.pmremVersion,e.set(f,g),f.addEventListener("dispose",l),g.texture):null}}}return f}function a(f){let d=0;const m=6;for(let p=0;p<m;p++)f[p]!==void 0&&d++;return d===m}function l(f){const d=f.target;d.removeEventListener("dispose",l);const m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function u(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:r,dispose:u}}function rS(s){const e={};function t(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=s.getExtension(r)}return e[r]=a,a}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const a=t(r);return a===null&&na("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function sS(s,e,t,r){const a={},l=new WeakMap;function u(g){const v=g.target;v.index!==null&&e.remove(v.index);for(const S in v.attributes)e.remove(v.attributes[S]);for(const S in v.morphAttributes){const E=v.morphAttributes[S];for(let M=0,x=E.length;M<x;M++)e.remove(E[M])}v.removeEventListener("dispose",u),delete a[v.id];const y=l.get(v);y&&(e.remove(y),l.delete(v)),r.releaseStatesOfGeometry(v),v.isInstancedBufferGeometry===!0&&delete v._maxInstanceCount,t.memory.geometries--}function f(g,v){return a[v.id]===!0||(v.addEventListener("dispose",u),a[v.id]=!0,t.memory.geometries++),v}function d(g){const v=g.attributes;for(const S in v)e.update(v[S],s.ARRAY_BUFFER);const y=g.morphAttributes;for(const S in y){const E=y[S];for(let M=0,x=E.length;M<x;M++)e.update(E[M],s.ARRAY_BUFFER)}}function m(g){const v=[],y=g.index,S=g.attributes.position;let E=0;if(y!==null){const D=y.array;E=y.version;for(let L=0,A=D.length;L<A;L+=3){const q=D[L+0],N=D[L+1],F=D[L+2];v.push(q,N,N,F,F,q)}}else if(S!==void 0){const D=S.array;E=S.version;for(let L=0,A=D.length/3-1;L<A;L+=3){const q=L+0,N=L+1,F=L+2;v.push(q,N,N,F,F,q)}}else return;const M=new(Bg(v)?Yg:jg)(v,1);M.version=E;const x=l.get(g);x&&e.remove(x),l.set(g,M)}function p(g){const v=l.get(g);if(v){const y=g.index;y!==null&&v.version<y.version&&m(g)}else m(g);return l.get(g)}return{get:f,update:d,getWireframeAttribute:p}}function oS(s,e,t){let r;function a(v){r=v}let l,u;function f(v){l=v.type,u=v.bytesPerElement}function d(v,y){s.drawElements(r,y,l,v*u),t.update(y,r,1)}function m(v,y,S){S!==0&&(s.drawElementsInstanced(r,y,l,v*u,S),t.update(y,r,S))}function p(v,y,S){if(S===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,y,0,l,v,0,S);let M=0;for(let x=0;x<S;x++)M+=y[x];t.update(M,r,1)}function g(v,y,S,E){if(S===0)return;const M=e.get("WEBGL_multi_draw");if(M===null)for(let x=0;x<v.length;x++)m(v[x]/u,y[x],E[x]);else{M.multiDrawElementsInstancedWEBGL(r,y,0,l,v,0,E,0,S);let x=0;for(let D=0;D<S;D++)x+=y[D]*E[D];t.update(x,r,1)}}this.setMode=a,this.setIndex=f,this.render=d,this.renderInstances=m,this.renderMultiDraw=p,this.renderMultiDrawInstances=g}function aS(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(l,u,f){switch(t.calls++,u){case s.TRIANGLES:t.triangles+=f*(l/3);break;case s.LINES:t.lines+=f*(l/2);break;case s.LINE_STRIP:t.lines+=f*(l-1);break;case s.LINE_LOOP:t.lines+=f*l;break;case s.POINTS:t.points+=f*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",u);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:r}}function lS(s,e,t){const r=new WeakMap,a=new Dt;function l(u,f,d){const m=u.morphTargetInfluences,p=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,g=p!==void 0?p.length:0;let v=r.get(f);if(v===void 0||v.count!==g){let C=function(){V.dispose(),r.delete(f),f.removeEventListener("dispose",C)};var y=C;v!==void 0&&v.texture.dispose();const S=f.morphAttributes.position!==void 0,E=f.morphAttributes.normal!==void 0,M=f.morphAttributes.color!==void 0,x=f.morphAttributes.position||[],D=f.morphAttributes.normal||[],L=f.morphAttributes.color||[];let A=0;S===!0&&(A=1),E===!0&&(A=2),M===!0&&(A=3);let q=f.attributes.position.count*A,N=1;q>e.maxTextureSize&&(N=Math.ceil(q/e.maxTextureSize),q=e.maxTextureSize);const F=new Float32Array(q*N*4*g),V=new Vg(F,q,N,g);V.type=Ji,V.needsUpdate=!0;const b=A*4;for(let z=0;z<g;z++){const ne=x[z],K=D[z],ae=L[z],ue=q*N*4*z;for(let oe=0;oe<ne.count;oe++){const ce=oe*b;S===!0&&(a.fromBufferAttribute(ne,oe),F[ue+ce+0]=a.x,F[ue+ce+1]=a.y,F[ue+ce+2]=a.z,F[ue+ce+3]=0),E===!0&&(a.fromBufferAttribute(K,oe),F[ue+ce+4]=a.x,F[ue+ce+5]=a.y,F[ue+ce+6]=a.z,F[ue+ce+7]=0),M===!0&&(a.fromBufferAttribute(ae,oe),F[ue+ce+8]=a.x,F[ue+ce+9]=a.y,F[ue+ce+10]=a.z,F[ue+ce+11]=ae.itemSize===4?a.w:1)}}v={count:g,texture:V,size:new xt(q,N)},r.set(f,v),f.addEventListener("dispose",C)}if(u.isInstancedMesh===!0&&u.morphTexture!==null)d.getUniforms().setValue(s,"morphTexture",u.morphTexture,t);else{let S=0;for(let M=0;M<m.length;M++)S+=m[M];const E=f.morphTargetsRelative?1:1-S;d.getUniforms().setValue(s,"morphTargetBaseInfluence",E),d.getUniforms().setValue(s,"morphTargetInfluences",m)}d.getUniforms().setValue(s,"morphTargetsTexture",v.texture,t),d.getUniforms().setValue(s,"morphTargetsTextureSize",v.size)}return{update:l}}function cS(s,e,t,r){let a=new WeakMap;function l(d){const m=r.render.frame,p=d.geometry,g=e.get(d,p);if(a.get(g)!==m&&(e.update(g),a.set(g,m)),d.isInstancedMesh&&(d.hasEventListener("dispose",f)===!1&&d.addEventListener("dispose",f),a.get(d)!==m&&(t.update(d.instanceMatrix,s.ARRAY_BUFFER),d.instanceColor!==null&&t.update(d.instanceColor,s.ARRAY_BUFFER),a.set(d,m))),d.isSkinnedMesh){const v=d.skeleton;a.get(v)!==m&&(v.update(),a.set(v,m))}return g}function u(){a=new WeakMap}function f(d){const m=d.target;m.removeEventListener("dispose",f),t.remove(m.instanceMatrix),m.instanceColor!==null&&t.remove(m.instanceColor)}return{update:l,dispose:u}}class Jg extends Bn{constructor(e,t,r,a,l,u,f,d,m,p=io){if(p!==io&&p!==co)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&p===io&&(r=ps),r===void 0&&p===co&&(r=lo),super(null,a,l,u,f,d,p,r,m),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=f!==void 0?f:Mi,this.minFilter=d!==void 0?d:Mi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const e0=new Bn,Wm=new Jg(1,1),t0=new Vg,n0=new $_,i0=new Kg,Xm=[],jm=[],Ym=new Float32Array(16),qm=new Float32Array(9),$m=new Float32Array(4);function go(s,e,t){const r=s[0];if(r<=0||r>0)return s;const a=e*t;let l=Xm[a];if(l===void 0&&(l=new Float32Array(a),Xm[a]=l),e!==0){r.toArray(l,0);for(let u=1,f=0;u!==e;++u)f+=t,s[u].toArray(l,f)}return l}function rn(s,e){if(s.length!==e.length)return!1;for(let t=0,r=s.length;t<r;t++)if(s[t]!==e[t])return!1;return!0}function sn(s,e){for(let t=0,r=e.length;t<r;t++)s[t]=e[t]}function ic(s,e){let t=jm[e];t===void 0&&(t=new Int32Array(e),jm[e]=t);for(let r=0;r!==e;++r)t[r]=s.allocateTextureUnit();return t}function uS(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function fS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2fv(this.addr,e),sn(t,e)}}function hS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(rn(t,e))return;s.uniform3fv(this.addr,e),sn(t,e)}}function dS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4fv(this.addr,e),sn(t,e)}}function pS(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;$m.set(r),s.uniformMatrix2fv(this.addr,!1,$m),sn(t,r)}}function mS(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;qm.set(r),s.uniformMatrix3fv(this.addr,!1,qm),sn(t,r)}}function gS(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;Ym.set(r),s.uniformMatrix4fv(this.addr,!1,Ym),sn(t,r)}}function vS(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function _S(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2iv(this.addr,e),sn(t,e)}}function xS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;s.uniform3iv(this.addr,e),sn(t,e)}}function yS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4iv(this.addr,e),sn(t,e)}}function MS(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function SS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2uiv(this.addr,e),sn(t,e)}}function ES(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;s.uniform3uiv(this.addr,e),sn(t,e)}}function wS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4uiv(this.addr,e),sn(t,e)}}function TS(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a);let l;this.type===s.SAMPLER_2D_SHADOW?(Wm.compareFunction=kg,l=Wm):l=e0,t.setTexture2D(e||l,a)}function AS(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture3D(e||n0,a)}function RS(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTextureCube(e||i0,a)}function CS(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture2DArray(e||t0,a)}function bS(s){switch(s){case 5126:return uS;case 35664:return fS;case 35665:return hS;case 35666:return dS;case 35674:return pS;case 35675:return mS;case 35676:return gS;case 5124:case 35670:return vS;case 35667:case 35671:return _S;case 35668:case 35672:return xS;case 35669:case 35673:return yS;case 5125:return MS;case 36294:return SS;case 36295:return ES;case 36296:return wS;case 35678:case 36198:case 36298:case 36306:case 35682:return TS;case 35679:case 36299:case 36307:return AS;case 35680:case 36300:case 36308:case 36293:return RS;case 36289:case 36303:case 36311:case 36292:return CS}}function PS(s,e){s.uniform1fv(this.addr,e)}function LS(s,e){const t=go(e,this.size,2);s.uniform2fv(this.addr,t)}function DS(s,e){const t=go(e,this.size,3);s.uniform3fv(this.addr,t)}function IS(s,e){const t=go(e,this.size,4);s.uniform4fv(this.addr,t)}function US(s,e){const t=go(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function NS(s,e){const t=go(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function FS(s,e){const t=go(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function OS(s,e){s.uniform1iv(this.addr,e)}function zS(s,e){s.uniform2iv(this.addr,e)}function kS(s,e){s.uniform3iv(this.addr,e)}function BS(s,e){s.uniform4iv(this.addr,e)}function HS(s,e){s.uniform1uiv(this.addr,e)}function VS(s,e){s.uniform2uiv(this.addr,e)}function GS(s,e){s.uniform3uiv(this.addr,e)}function WS(s,e){s.uniform4uiv(this.addr,e)}function XS(s,e,t){const r=this.cache,a=e.length,l=ic(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let u=0;u!==a;++u)t.setTexture2D(e[u]||e0,l[u])}function jS(s,e,t){const r=this.cache,a=e.length,l=ic(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let u=0;u!==a;++u)t.setTexture3D(e[u]||n0,l[u])}function YS(s,e,t){const r=this.cache,a=e.length,l=ic(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let u=0;u!==a;++u)t.setTextureCube(e[u]||i0,l[u])}function qS(s,e,t){const r=this.cache,a=e.length,l=ic(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let u=0;u!==a;++u)t.setTexture2DArray(e[u]||t0,l[u])}function $S(s){switch(s){case 5126:return PS;case 35664:return LS;case 35665:return DS;case 35666:return IS;case 35674:return US;case 35675:return NS;case 35676:return FS;case 5124:case 35670:return OS;case 35667:case 35671:return zS;case 35668:case 35672:return kS;case 35669:case 35673:return BS;case 5125:return HS;case 36294:return VS;case 36295:return GS;case 36296:return WS;case 35678:case 36198:case 36298:case 36306:case 35682:return XS;case 35679:case 36299:case 36307:return jS;case 35680:case 36300:case 36308:case 36293:return YS;case 36289:case 36303:case 36311:case 36292:return qS}}class KS{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=bS(t.type)}}class ZS{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=$S(t.type)}}class QS{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const a=this.seq;for(let l=0,u=a.length;l!==u;++l){const f=a[l];f.setValue(e,t[f.id],r)}}}const _f=/(\w+)(\])?(\[|\.)?/g;function Km(s,e){s.seq.push(e),s.map[e.id]=e}function JS(s,e,t){const r=s.name,a=r.length;for(_f.lastIndex=0;;){const l=_f.exec(r),u=_f.lastIndex;let f=l[1];const d=l[2]==="]",m=l[3];if(d&&(f=f|0),m===void 0||m==="["&&u+2===a){Km(t,m===void 0?new KS(f,s,e):new ZS(f,s,e));break}else{let g=t.map[f];g===void 0&&(g=new QS(f),Km(t,g)),t=g}}}class jl{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const l=e.getActiveUniform(t,a),u=e.getUniformLocation(t,l.name);JS(l,u,this)}}setValue(e,t,r,a){const l=this.map[t];l!==void 0&&l.setValue(e,r,a)}setOptional(e,t,r){const a=t[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,t,r,a){for(let l=0,u=t.length;l!==u;++l){const f=t[l],d=r[f.id];d.needsUpdate!==!1&&f.setValue(e,d.value,a)}}static seqWithValue(e,t){const r=[];for(let a=0,l=e.length;a!==l;++a){const u=e[a];u.id in t&&r.push(u)}return r}}function Zm(s,e,t){const r=s.createShader(e);return s.shaderSource(r,t),s.compileShader(r),r}const eE=37297;let tE=0;function nE(s,e){const t=s.split(`
`),r=[],a=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let u=a;u<l;u++){const f=u+1;r.push(`${f===e?">":" "} ${f}: ${t[u]}`)}return r.join(`
`)}const Qm=new at;function iE(s){St._getMatrix(Qm,St.workingColorSpace,s);const e=`mat3( ${Qm.elements.map(t=>t.toFixed(4))} )`;switch(St.getTransfer(s)){case ec:return[e,"LinearTransferOETF"];case Lt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Jm(s,e,t){const r=s.getShaderParameter(e,s.COMPILE_STATUS),a=s.getShaderInfoLog(e).trim();if(r&&a==="")return"";const l=/ERROR: 0:(\d+)/.exec(a);if(l){const u=parseInt(l[1]);return t.toUpperCase()+`

`+a+`

`+nE(s.getShaderSource(e),u)}else return a}function rE(s,e){const t=iE(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function sE(s,e){let t;switch(e){case S_:t="Linear";break;case E_:t="Reinhard";break;case w_:t="Cineon";break;case T_:t="ACESFilmic";break;case R_:t="AgX";break;case C_:t="Neutral";break;case A_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Fl=new j;function oE(){St.getLuminanceCoefficients(Fl);const s=Fl.x.toFixed(4),e=Fl.y.toFixed(4),t=Fl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function aE(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ia).join(`
`)}function lE(s){const e=[];for(const t in s){const r=s[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function cE(s,e){const t={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const l=s.getActiveAttrib(e,a),u=l.name;let f=1;l.type===s.FLOAT_MAT2&&(f=2),l.type===s.FLOAT_MAT3&&(f=3),l.type===s.FLOAT_MAT4&&(f=4),t[u]={type:l.type,location:s.getAttribLocation(e,u),locationSize:f}}return t}function ia(s){return s!==""}function eg(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tg(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const uE=/^[ \t]*#include +<([\w\d./]+)>/gm;function mh(s){return s.replace(uE,hE)}const fE=new Map;function hE(s,e){let t=lt[e];if(t===void 0){const r=fE.get(e);if(r!==void 0)t=lt[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return mh(t)}const dE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ng(s){return s.replace(dE,pE)}function pE(s,e,t,r){let a="";for(let l=parseInt(e);l<parseInt(t);l++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return a}function ig(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function mE(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===wg?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Tg?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Qi&&(e="SHADOWMAP_TYPE_VSM"),e}function gE(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case oo:case ao:e="ENVMAP_TYPE_CUBE";break;case Jl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function vE(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case ao:e="ENVMAP_MODE_REFRACTION";break}return e}function _E(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Ag:e="ENVMAP_BLENDING_MULTIPLY";break;case y_:e="ENVMAP_BLENDING_MIX";break;case M_:e="ENVMAP_BLENDING_ADD";break}return e}function xE(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:r,maxMip:t}}function yE(s,e,t,r){const a=s.getContext(),l=t.defines;let u=t.vertexShader,f=t.fragmentShader;const d=mE(t),m=gE(t),p=vE(t),g=_E(t),v=xE(t),y=aE(t),S=lE(l),E=a.createProgram();let M,x,D=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(M=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,S].filter(ia).join(`
`),M.length>0&&(M+=`
`),x=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,S].filter(ia).join(`
`),x.length>0&&(x+=`
`)):(M=[ig(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,S,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+p:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+d:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ia).join(`
`),x=[ig(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,S,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.envMap?"#define "+p:"",t.envMap?"#define "+g:"",v?"#define CUBEUV_TEXEL_WIDTH "+v.texelWidth:"",v?"#define CUBEUV_TEXEL_HEIGHT "+v.texelHeight:"",v?"#define CUBEUV_MAX_MIP "+v.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+d:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Nr?"#define TONE_MAPPING":"",t.toneMapping!==Nr?lt.tonemapping_pars_fragment:"",t.toneMapping!==Nr?sE("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",lt.colorspace_pars_fragment,rE("linearToOutputTexel",t.outputColorSpace),oE(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ia).join(`
`)),u=mh(u),u=eg(u,t),u=tg(u,t),f=mh(f),f=eg(f,t),f=tg(f,t),u=ng(u),f=ng(f),t.isRawShaderMaterial!==!0&&(D=`#version 300 es
`,M=[y,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+M,x=["#define varying in",t.glslVersion===gm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===gm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+x);const L=D+M+u,A=D+x+f,q=Zm(a,a.VERTEX_SHADER,L),N=Zm(a,a.FRAGMENT_SHADER,A);a.attachShader(E,q),a.attachShader(E,N),t.index0AttributeName!==void 0?a.bindAttribLocation(E,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(E,0,"position"),a.linkProgram(E);function F(z){if(s.debug.checkShaderErrors){const ne=a.getProgramInfoLog(E).trim(),K=a.getShaderInfoLog(q).trim(),ae=a.getShaderInfoLog(N).trim();let ue=!0,oe=!0;if(a.getProgramParameter(E,a.LINK_STATUS)===!1)if(ue=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,E,q,N);else{const ce=Jm(a,q,"vertex"),k=Jm(a,N,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(E,a.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+ne+`
`+ce+`
`+k)}else ne!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ne):(K===""||ae==="")&&(oe=!1);oe&&(z.diagnostics={runnable:ue,programLog:ne,vertexShader:{log:K,prefix:M},fragmentShader:{log:ae,prefix:x}})}a.deleteShader(q),a.deleteShader(N),V=new jl(a,E),b=cE(a,E)}let V;this.getUniforms=function(){return V===void 0&&F(this),V};let b;this.getAttributes=function(){return b===void 0&&F(this),b};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=a.getProgramParameter(E,eE)),C},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(E),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=tE++,this.cacheKey=e,this.usedTimes=1,this.program=E,this.vertexShader=q,this.fragmentShader=N,this}let ME=0;class SE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(t),l=this._getShaderStage(r),u=this._getShaderCacheForMaterial(e);return u.has(a)===!1&&(u.add(a),a.usedTimes++),u.has(l)===!1&&(u.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new EE(e),t.set(e,r)),r}}class EE{constructor(e){this.id=ME++,this.code=e,this.usedTimes=0}}function wE(s,e,t,r,a,l,u){const f=new Wg,d=new SE,m=new Set,p=[],g=a.logarithmicDepthBuffer,v=a.vertexTextures;let y=a.precision;const S={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function E(b){return m.add(b),b===0?"uv":`uv${b}`}function M(b,C,z,ne,K){const ae=ne.fog,ue=K.geometry,oe=b.isMeshStandardMaterial?ne.environment:null,ce=(b.isMeshStandardMaterial?t:e).get(b.envMap||oe),k=ce&&ce.mapping===Jl?ce.image.height:null,le=S[b.type];b.precision!==null&&(y=a.getMaxPrecision(b.precision),y!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",y,"instead."));const se=ue.morphAttributes.position||ue.morphAttributes.normal||ue.morphAttributes.color,U=se!==void 0?se.length:0;let ie=0;ue.morphAttributes.position!==void 0&&(ie=1),ue.morphAttributes.normal!==void 0&&(ie=2),ue.morphAttributes.color!==void 0&&(ie=3);let Ie,Q,fe,Se;if(le){const yt=Pi[le];Ie=yt.vertexShader,Q=yt.fragmentShader}else Ie=b.vertexShader,Q=b.fragmentShader,d.update(b),fe=d.getVertexShaderID(b),Se=d.getFragmentShaderID(b);const _e=s.getRenderTarget(),Te=s.state.buffers.depth.getReversed(),Ue=K.isInstancedMesh===!0,Qe=K.isBatchedMesh===!0,Pt=!!b.map,pt=!!b.matcap,Nt=!!ce,X=!!b.aoMap,Mn=!!b.lightMap,dt=!!b.bumpMap,ut=!!b.normalMap,$e=!!b.displacementMap,Ct=!!b.emissiveMap,qe=!!b.metalnessMap,P=!!b.roughnessMap,T=b.anisotropy>0,Z=b.clearcoat>0,pe=b.dispersion>0,ge=b.iridescence>0,he=b.sheen>0,Ge=b.transmission>0,Re=T&&!!b.anisotropyMap,Ne=Z&&!!b.clearcoatMap,ct=Z&&!!b.clearcoatNormalMap,ye=Z&&!!b.clearcoatRoughnessMap,Oe=ge&&!!b.iridescenceMap,Je=ge&&!!b.iridescenceThicknessMap,et=he&&!!b.sheenColorMap,ze=he&&!!b.sheenRoughnessMap,ft=!!b.specularMap,rt=!!b.specularColorMap,Rt=!!b.specularIntensityMap,H=Ge&&!!b.transmissionMap,Ce=Ge&&!!b.thicknessMap,re=!!b.gradientMap,de=!!b.alphaMap,Le=b.alphaTest>0,Pe=!!b.alphaHash,st=!!b.extensions;let Ot=Nr;b.toneMapped&&(_e===null||_e.isXRRenderTarget===!0)&&(Ot=s.toneMapping);const Kt={shaderID:le,shaderType:b.type,shaderName:b.name,vertexShader:Ie,fragmentShader:Q,defines:b.defines,customVertexShaderID:fe,customFragmentShaderID:Se,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:y,batching:Qe,batchingColor:Qe&&K._colorsTexture!==null,instancing:Ue,instancingColor:Ue&&K.instanceColor!==null,instancingMorph:Ue&&K.morphTexture!==null,supportsVertexTextures:v,outputColorSpace:_e===null?s.outputColorSpace:_e.isXRRenderTarget===!0?_e.texture.colorSpace:ho,alphaToCoverage:!!b.alphaToCoverage,map:Pt,matcap:pt,envMap:Nt,envMapMode:Nt&&ce.mapping,envMapCubeUVHeight:k,aoMap:X,lightMap:Mn,bumpMap:dt,normalMap:ut,displacementMap:v&&$e,emissiveMap:Ct,normalMapObjectSpace:ut&&b.normalMapType===D_,normalMapTangentSpace:ut&&b.normalMapType===zg,metalnessMap:qe,roughnessMap:P,anisotropy:T,anisotropyMap:Re,clearcoat:Z,clearcoatMap:Ne,clearcoatNormalMap:ct,clearcoatRoughnessMap:ye,dispersion:pe,iridescence:ge,iridescenceMap:Oe,iridescenceThicknessMap:Je,sheen:he,sheenColorMap:et,sheenRoughnessMap:ze,specularMap:ft,specularColorMap:rt,specularIntensityMap:Rt,transmission:Ge,transmissionMap:H,thicknessMap:Ce,gradientMap:re,opaque:b.transparent===!1&&b.blending===no&&b.alphaToCoverage===!1,alphaMap:de,alphaTest:Le,alphaHash:Pe,combine:b.combine,mapUv:Pt&&E(b.map.channel),aoMapUv:X&&E(b.aoMap.channel),lightMapUv:Mn&&E(b.lightMap.channel),bumpMapUv:dt&&E(b.bumpMap.channel),normalMapUv:ut&&E(b.normalMap.channel),displacementMapUv:$e&&E(b.displacementMap.channel),emissiveMapUv:Ct&&E(b.emissiveMap.channel),metalnessMapUv:qe&&E(b.metalnessMap.channel),roughnessMapUv:P&&E(b.roughnessMap.channel),anisotropyMapUv:Re&&E(b.anisotropyMap.channel),clearcoatMapUv:Ne&&E(b.clearcoatMap.channel),clearcoatNormalMapUv:ct&&E(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ye&&E(b.clearcoatRoughnessMap.channel),iridescenceMapUv:Oe&&E(b.iridescenceMap.channel),iridescenceThicknessMapUv:Je&&E(b.iridescenceThicknessMap.channel),sheenColorMapUv:et&&E(b.sheenColorMap.channel),sheenRoughnessMapUv:ze&&E(b.sheenRoughnessMap.channel),specularMapUv:ft&&E(b.specularMap.channel),specularColorMapUv:rt&&E(b.specularColorMap.channel),specularIntensityMapUv:Rt&&E(b.specularIntensityMap.channel),transmissionMapUv:H&&E(b.transmissionMap.channel),thicknessMapUv:Ce&&E(b.thicknessMap.channel),alphaMapUv:de&&E(b.alphaMap.channel),vertexTangents:!!ue.attributes.tangent&&(ut||T),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!ue.attributes.color&&ue.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!ue.attributes.uv&&(Pt||de),fog:!!ae,useFog:b.fog===!0,fogExp2:!!ae&&ae.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:g,reverseDepthBuffer:Te,skinning:K.isSkinnedMesh===!0,morphTargets:ue.morphAttributes.position!==void 0,morphNormals:ue.morphAttributes.normal!==void 0,morphColors:ue.morphAttributes.color!==void 0,morphTargetsCount:U,morphTextureStride:ie,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:u.numPlanes,numClipIntersection:u.numIntersection,dithering:b.dithering,shadowMapEnabled:s.shadowMap.enabled&&z.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ot,decodeVideoTexture:Pt&&b.map.isVideoTexture===!0&&St.getTransfer(b.map.colorSpace)===Lt,decodeVideoTextureEmissive:Ct&&b.emissiveMap.isVideoTexture===!0&&St.getTransfer(b.emissiveMap.colorSpace)===Lt,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Li,flipSided:b.side===Rn,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:st&&b.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&b.extensions.multiDraw===!0||Qe)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return Kt.vertexUv1s=m.has(1),Kt.vertexUv2s=m.has(2),Kt.vertexUv3s=m.has(3),m.clear(),Kt}function x(b){const C=[];if(b.shaderID?C.push(b.shaderID):(C.push(b.customVertexShaderID),C.push(b.customFragmentShaderID)),b.defines!==void 0)for(const z in b.defines)C.push(z),C.push(b.defines[z]);return b.isRawShaderMaterial===!1&&(D(C,b),L(C,b),C.push(s.outputColorSpace)),C.push(b.customProgramCacheKey),C.join()}function D(b,C){b.push(C.precision),b.push(C.outputColorSpace),b.push(C.envMapMode),b.push(C.envMapCubeUVHeight),b.push(C.mapUv),b.push(C.alphaMapUv),b.push(C.lightMapUv),b.push(C.aoMapUv),b.push(C.bumpMapUv),b.push(C.normalMapUv),b.push(C.displacementMapUv),b.push(C.emissiveMapUv),b.push(C.metalnessMapUv),b.push(C.roughnessMapUv),b.push(C.anisotropyMapUv),b.push(C.clearcoatMapUv),b.push(C.clearcoatNormalMapUv),b.push(C.clearcoatRoughnessMapUv),b.push(C.iridescenceMapUv),b.push(C.iridescenceThicknessMapUv),b.push(C.sheenColorMapUv),b.push(C.sheenRoughnessMapUv),b.push(C.specularMapUv),b.push(C.specularColorMapUv),b.push(C.specularIntensityMapUv),b.push(C.transmissionMapUv),b.push(C.thicknessMapUv),b.push(C.combine),b.push(C.fogExp2),b.push(C.sizeAttenuation),b.push(C.morphTargetsCount),b.push(C.morphAttributeCount),b.push(C.numDirLights),b.push(C.numPointLights),b.push(C.numSpotLights),b.push(C.numSpotLightMaps),b.push(C.numHemiLights),b.push(C.numRectAreaLights),b.push(C.numDirLightShadows),b.push(C.numPointLightShadows),b.push(C.numSpotLightShadows),b.push(C.numSpotLightShadowsWithMaps),b.push(C.numLightProbes),b.push(C.shadowMapType),b.push(C.toneMapping),b.push(C.numClippingPlanes),b.push(C.numClipIntersection),b.push(C.depthPacking)}function L(b,C){f.disableAll(),C.supportsVertexTextures&&f.enable(0),C.instancing&&f.enable(1),C.instancingColor&&f.enable(2),C.instancingMorph&&f.enable(3),C.matcap&&f.enable(4),C.envMap&&f.enable(5),C.normalMapObjectSpace&&f.enable(6),C.normalMapTangentSpace&&f.enable(7),C.clearcoat&&f.enable(8),C.iridescence&&f.enable(9),C.alphaTest&&f.enable(10),C.vertexColors&&f.enable(11),C.vertexAlphas&&f.enable(12),C.vertexUv1s&&f.enable(13),C.vertexUv2s&&f.enable(14),C.vertexUv3s&&f.enable(15),C.vertexTangents&&f.enable(16),C.anisotropy&&f.enable(17),C.alphaHash&&f.enable(18),C.batching&&f.enable(19),C.dispersion&&f.enable(20),C.batchingColor&&f.enable(21),b.push(f.mask),f.disableAll(),C.fog&&f.enable(0),C.useFog&&f.enable(1),C.flatShading&&f.enable(2),C.logarithmicDepthBuffer&&f.enable(3),C.reverseDepthBuffer&&f.enable(4),C.skinning&&f.enable(5),C.morphTargets&&f.enable(6),C.morphNormals&&f.enable(7),C.morphColors&&f.enable(8),C.premultipliedAlpha&&f.enable(9),C.shadowMapEnabled&&f.enable(10),C.doubleSided&&f.enable(11),C.flipSided&&f.enable(12),C.useDepthPacking&&f.enable(13),C.dithering&&f.enable(14),C.transmission&&f.enable(15),C.sheen&&f.enable(16),C.opaque&&f.enable(17),C.pointsUvs&&f.enable(18),C.decodeVideoTexture&&f.enable(19),C.decodeVideoTextureEmissive&&f.enable(20),C.alphaToCoverage&&f.enable(21),b.push(f.mask)}function A(b){const C=S[b.type];let z;if(C){const ne=Pi[C];z=ax.clone(ne.uniforms)}else z=b.uniforms;return z}function q(b,C){let z;for(let ne=0,K=p.length;ne<K;ne++){const ae=p[ne];if(ae.cacheKey===C){z=ae,++z.usedTimes;break}}return z===void 0&&(z=new yE(s,C,b,l),p.push(z)),z}function N(b){if(--b.usedTimes===0){const C=p.indexOf(b);p[C]=p[p.length-1],p.pop(),b.destroy()}}function F(b){d.remove(b)}function V(){d.dispose()}return{getParameters:M,getProgramCacheKey:x,getUniforms:A,acquireProgram:q,releaseProgram:N,releaseShaderCache:F,programs:p,dispose:V}}function TE(){let s=new WeakMap;function e(u){return s.has(u)}function t(u){let f=s.get(u);return f===void 0&&(f={},s.set(u,f)),f}function r(u){s.delete(u)}function a(u,f,d){s.get(u)[f]=d}function l(){s=new WeakMap}return{has:e,get:t,remove:r,update:a,dispose:l}}function AE(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function rg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function sg(){const s=[];let e=0;const t=[],r=[],a=[];function l(){e=0,t.length=0,r.length=0,a.length=0}function u(g,v,y,S,E,M){let x=s[e];return x===void 0?(x={id:g.id,object:g,geometry:v,material:y,groupOrder:S,renderOrder:g.renderOrder,z:E,group:M},s[e]=x):(x.id=g.id,x.object=g,x.geometry=v,x.material=y,x.groupOrder=S,x.renderOrder=g.renderOrder,x.z=E,x.group=M),e++,x}function f(g,v,y,S,E,M){const x=u(g,v,y,S,E,M);y.transmission>0?r.push(x):y.transparent===!0?a.push(x):t.push(x)}function d(g,v,y,S,E,M){const x=u(g,v,y,S,E,M);y.transmission>0?r.unshift(x):y.transparent===!0?a.unshift(x):t.unshift(x)}function m(g,v){t.length>1&&t.sort(g||AE),r.length>1&&r.sort(v||rg),a.length>1&&a.sort(v||rg)}function p(){for(let g=e,v=s.length;g<v;g++){const y=s[g];if(y.id===null)break;y.id=null,y.object=null,y.geometry=null,y.material=null,y.group=null}}return{opaque:t,transmissive:r,transparent:a,init:l,push:f,unshift:d,finish:p,sort:m}}function RE(){let s=new WeakMap;function e(r,a){const l=s.get(r);let u;return l===void 0?(u=new sg,s.set(r,[u])):a>=l.length?(u=new sg,l.push(u)):u=l[a],u}function t(){s=new WeakMap}return{get:e,dispose:t}}function CE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new j,color:new _t};break;case"SpotLight":t={position:new j,direction:new j,color:new _t,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new j,color:new _t,distance:0,decay:0};break;case"HemisphereLight":t={direction:new j,skyColor:new _t,groundColor:new _t};break;case"RectAreaLight":t={color:new _t,position:new j,halfWidth:new j,halfHeight:new j};break}return s[e.id]=t,t}}}function bE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let PE=0;function LE(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function DE(s){const e=new CE,t=bE(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let m=0;m<9;m++)r.probe.push(new j);const a=new j,l=new Ht,u=new Ht;function f(m){let p=0,g=0,v=0;for(let b=0;b<9;b++)r.probe[b].set(0,0,0);let y=0,S=0,E=0,M=0,x=0,D=0,L=0,A=0,q=0,N=0,F=0;m.sort(LE);for(let b=0,C=m.length;b<C;b++){const z=m[b],ne=z.color,K=z.intensity,ae=z.distance,ue=z.shadow&&z.shadow.map?z.shadow.map.texture:null;if(z.isAmbientLight)p+=ne.r*K,g+=ne.g*K,v+=ne.b*K;else if(z.isLightProbe){for(let oe=0;oe<9;oe++)r.probe[oe].addScaledVector(z.sh.coefficients[oe],K);F++}else if(z.isDirectionalLight){const oe=e.get(z);if(oe.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){const ce=z.shadow,k=t.get(z);k.shadowIntensity=ce.intensity,k.shadowBias=ce.bias,k.shadowNormalBias=ce.normalBias,k.shadowRadius=ce.radius,k.shadowMapSize=ce.mapSize,r.directionalShadow[y]=k,r.directionalShadowMap[y]=ue,r.directionalShadowMatrix[y]=z.shadow.matrix,D++}r.directional[y]=oe,y++}else if(z.isSpotLight){const oe=e.get(z);oe.position.setFromMatrixPosition(z.matrixWorld),oe.color.copy(ne).multiplyScalar(K),oe.distance=ae,oe.coneCos=Math.cos(z.angle),oe.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),oe.decay=z.decay,r.spot[E]=oe;const ce=z.shadow;if(z.map&&(r.spotLightMap[q]=z.map,q++,ce.updateMatrices(z),z.castShadow&&N++),r.spotLightMatrix[E]=ce.matrix,z.castShadow){const k=t.get(z);k.shadowIntensity=ce.intensity,k.shadowBias=ce.bias,k.shadowNormalBias=ce.normalBias,k.shadowRadius=ce.radius,k.shadowMapSize=ce.mapSize,r.spotShadow[E]=k,r.spotShadowMap[E]=ue,A++}E++}else if(z.isRectAreaLight){const oe=e.get(z);oe.color.copy(ne).multiplyScalar(K),oe.halfWidth.set(z.width*.5,0,0),oe.halfHeight.set(0,z.height*.5,0),r.rectArea[M]=oe,M++}else if(z.isPointLight){const oe=e.get(z);if(oe.color.copy(z.color).multiplyScalar(z.intensity),oe.distance=z.distance,oe.decay=z.decay,z.castShadow){const ce=z.shadow,k=t.get(z);k.shadowIntensity=ce.intensity,k.shadowBias=ce.bias,k.shadowNormalBias=ce.normalBias,k.shadowRadius=ce.radius,k.shadowMapSize=ce.mapSize,k.shadowCameraNear=ce.camera.near,k.shadowCameraFar=ce.camera.far,r.pointShadow[S]=k,r.pointShadowMap[S]=ue,r.pointShadowMatrix[S]=z.shadow.matrix,L++}r.point[S]=oe,S++}else if(z.isHemisphereLight){const oe=e.get(z);oe.skyColor.copy(z.color).multiplyScalar(K),oe.groundColor.copy(z.groundColor).multiplyScalar(K),r.hemi[x]=oe,x++}}M>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=be.LTC_FLOAT_1,r.rectAreaLTC2=be.LTC_FLOAT_2):(r.rectAreaLTC1=be.LTC_HALF_1,r.rectAreaLTC2=be.LTC_HALF_2)),r.ambient[0]=p,r.ambient[1]=g,r.ambient[2]=v;const V=r.hash;(V.directionalLength!==y||V.pointLength!==S||V.spotLength!==E||V.rectAreaLength!==M||V.hemiLength!==x||V.numDirectionalShadows!==D||V.numPointShadows!==L||V.numSpotShadows!==A||V.numSpotMaps!==q||V.numLightProbes!==F)&&(r.directional.length=y,r.spot.length=E,r.rectArea.length=M,r.point.length=S,r.hemi.length=x,r.directionalShadow.length=D,r.directionalShadowMap.length=D,r.pointShadow.length=L,r.pointShadowMap.length=L,r.spotShadow.length=A,r.spotShadowMap.length=A,r.directionalShadowMatrix.length=D,r.pointShadowMatrix.length=L,r.spotLightMatrix.length=A+q-N,r.spotLightMap.length=q,r.numSpotLightShadowsWithMaps=N,r.numLightProbes=F,V.directionalLength=y,V.pointLength=S,V.spotLength=E,V.rectAreaLength=M,V.hemiLength=x,V.numDirectionalShadows=D,V.numPointShadows=L,V.numSpotShadows=A,V.numSpotMaps=q,V.numLightProbes=F,r.version=PE++)}function d(m,p){let g=0,v=0,y=0,S=0,E=0;const M=p.matrixWorldInverse;for(let x=0,D=m.length;x<D;x++){const L=m[x];if(L.isDirectionalLight){const A=r.directional[g];A.direction.setFromMatrixPosition(L.matrixWorld),a.setFromMatrixPosition(L.target.matrixWorld),A.direction.sub(a),A.direction.transformDirection(M),g++}else if(L.isSpotLight){const A=r.spot[y];A.position.setFromMatrixPosition(L.matrixWorld),A.position.applyMatrix4(M),A.direction.setFromMatrixPosition(L.matrixWorld),a.setFromMatrixPosition(L.target.matrixWorld),A.direction.sub(a),A.direction.transformDirection(M),y++}else if(L.isRectAreaLight){const A=r.rectArea[S];A.position.setFromMatrixPosition(L.matrixWorld),A.position.applyMatrix4(M),u.identity(),l.copy(L.matrixWorld),l.premultiply(M),u.extractRotation(l),A.halfWidth.set(L.width*.5,0,0),A.halfHeight.set(0,L.height*.5,0),A.halfWidth.applyMatrix4(u),A.halfHeight.applyMatrix4(u),S++}else if(L.isPointLight){const A=r.point[v];A.position.setFromMatrixPosition(L.matrixWorld),A.position.applyMatrix4(M),v++}else if(L.isHemisphereLight){const A=r.hemi[E];A.direction.setFromMatrixPosition(L.matrixWorld),A.direction.transformDirection(M),E++}}}return{setup:f,setupView:d,state:r}}function og(s){const e=new DE(s),t=[],r=[];function a(p){m.camera=p,t.length=0,r.length=0}function l(p){t.push(p)}function u(p){r.push(p)}function f(){e.setup(t)}function d(p){e.setupView(t,p)}const m={lightsArray:t,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:m,setupLights:f,setupLightsView:d,pushLight:l,pushShadow:u}}function IE(s){let e=new WeakMap;function t(a,l=0){const u=e.get(a);let f;return u===void 0?(f=new og(s),e.set(a,[f])):l>=u.length?(f=new og(s),u.push(f)):f=u[l],f}function r(){e=new WeakMap}return{get:t,dispose:r}}class UE extends mo{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=P_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class NE extends mo{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const FE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,OE=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function zE(s,e,t){let r=new Ch;const a=new xt,l=new xt,u=new Dt,f=new UE({depthPacking:L_}),d=new NE,m={},p=t.maxTextureSize,g={[Fr]:Rn,[Rn]:Fr,[Li]:Li},v=new Or({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:FE,fragmentShader:OE}),y=v.clone();y.defines.HORIZONTAL_PASS=1;const S=new Kn;S.setAttribute("position",new Ui(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const E=new At(S,v),M=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=wg;let x=this.type;this.render=function(N,F,V){if(M.enabled===!1||M.autoUpdate===!1&&M.needsUpdate===!1||N.length===0)return;const b=s.getRenderTarget(),C=s.getActiveCubeFace(),z=s.getActiveMipmapLevel(),ne=s.state;ne.setBlending(Ur),ne.buffers.color.setClear(1,1,1,1),ne.buffers.depth.setTest(!0),ne.setScissorTest(!1);const K=x!==Qi&&this.type===Qi,ae=x===Qi&&this.type!==Qi;for(let ue=0,oe=N.length;ue<oe;ue++){const ce=N[ue],k=ce.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",ce,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;a.copy(k.mapSize);const le=k.getFrameExtents();if(a.multiply(le),l.copy(k.mapSize),(a.x>p||a.y>p)&&(a.x>p&&(l.x=Math.floor(p/le.x),a.x=l.x*le.x,k.mapSize.x=l.x),a.y>p&&(l.y=Math.floor(p/le.y),a.y=l.y*le.y,k.mapSize.y=l.y)),k.map===null||K===!0||ae===!0){const U=this.type!==Qi?{minFilter:Mi,magFilter:Mi}:{};k.map!==null&&k.map.dispose(),k.map=new ms(a.x,a.y,U),k.map.texture.name=ce.name+".shadowMap",k.camera.updateProjectionMatrix()}s.setRenderTarget(k.map),s.clear();const se=k.getViewportCount();for(let U=0;U<se;U++){const ie=k.getViewport(U);u.set(l.x*ie.x,l.y*ie.y,l.x*ie.z,l.y*ie.w),ne.viewport(u),k.updateMatrices(ce,U),r=k.getFrustum(),A(F,V,k.camera,ce,this.type)}k.isPointLightShadow!==!0&&this.type===Qi&&D(k,V),k.needsUpdate=!1}x=this.type,M.needsUpdate=!1,s.setRenderTarget(b,C,z)};function D(N,F){const V=e.update(E);v.defines.VSM_SAMPLES!==N.blurSamples&&(v.defines.VSM_SAMPLES=N.blurSamples,y.defines.VSM_SAMPLES=N.blurSamples,v.needsUpdate=!0,y.needsUpdate=!0),N.mapPass===null&&(N.mapPass=new ms(a.x,a.y)),v.uniforms.shadow_pass.value=N.map.texture,v.uniforms.resolution.value=N.mapSize,v.uniforms.radius.value=N.radius,s.setRenderTarget(N.mapPass),s.clear(),s.renderBufferDirect(F,null,V,v,E,null),y.uniforms.shadow_pass.value=N.mapPass.texture,y.uniforms.resolution.value=N.mapSize,y.uniforms.radius.value=N.radius,s.setRenderTarget(N.map),s.clear(),s.renderBufferDirect(F,null,V,y,E,null)}function L(N,F,V,b){let C=null;const z=V.isPointLight===!0?N.customDistanceMaterial:N.customDepthMaterial;if(z!==void 0)C=z;else if(C=V.isPointLight===!0?d:f,s.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0){const ne=C.uuid,K=F.uuid;let ae=m[ne];ae===void 0&&(ae={},m[ne]=ae);let ue=ae[K];ue===void 0&&(ue=C.clone(),ae[K]=ue,F.addEventListener("dispose",q)),C=ue}if(C.visible=F.visible,C.wireframe=F.wireframe,b===Qi?C.side=F.shadowSide!==null?F.shadowSide:F.side:C.side=F.shadowSide!==null?F.shadowSide:g[F.side],C.alphaMap=F.alphaMap,C.alphaTest=F.alphaTest,C.map=F.map,C.clipShadows=F.clipShadows,C.clippingPlanes=F.clippingPlanes,C.clipIntersection=F.clipIntersection,C.displacementMap=F.displacementMap,C.displacementScale=F.displacementScale,C.displacementBias=F.displacementBias,C.wireframeLinewidth=F.wireframeLinewidth,C.linewidth=F.linewidth,V.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const ne=s.properties.get(C);ne.light=V}return C}function A(N,F,V,b,C){if(N.visible===!1)return;if(N.layers.test(F.layers)&&(N.isMesh||N.isLine||N.isPoints)&&(N.castShadow||N.receiveShadow&&C===Qi)&&(!N.frustumCulled||r.intersectsObject(N))){N.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,N.matrixWorld);const K=e.update(N),ae=N.material;if(Array.isArray(ae)){const ue=K.groups;for(let oe=0,ce=ue.length;oe<ce;oe++){const k=ue[oe],le=ae[k.materialIndex];if(le&&le.visible){const se=L(N,le,b,C);N.onBeforeShadow(s,N,F,V,K,se,k),s.renderBufferDirect(V,null,K,se,N,k),N.onAfterShadow(s,N,F,V,K,se,k)}}}else if(ae.visible){const ue=L(N,ae,b,C);N.onBeforeShadow(s,N,F,V,K,ue,null),s.renderBufferDirect(V,null,K,ue,N,null),N.onAfterShadow(s,N,F,V,K,ue,null)}}const ne=N.children;for(let K=0,ae=ne.length;K<ae;K++)A(ne[K],F,V,b,C)}function q(N){N.target.removeEventListener("dispose",q);for(const V in m){const b=m[V],C=N.target.uuid;C in b&&(b[C].dispose(),delete b[C])}}}const kE={[Lf]:Df,[If]:Ff,[Uf]:Of,[so]:Nf,[Df]:Lf,[Ff]:If,[Of]:Uf,[Nf]:so};function BE(s,e){function t(){let H=!1;const Ce=new Dt;let re=null;const de=new Dt(0,0,0,0);return{setMask:function(Le){re!==Le&&!H&&(s.colorMask(Le,Le,Le,Le),re=Le)},setLocked:function(Le){H=Le},setClear:function(Le,Pe,st,Ot,Kt){Kt===!0&&(Le*=Ot,Pe*=Ot,st*=Ot),Ce.set(Le,Pe,st,Ot),de.equals(Ce)===!1&&(s.clearColor(Le,Pe,st,Ot),de.copy(Ce))},reset:function(){H=!1,re=null,de.set(-1,0,0,0)}}}function r(){let H=!1,Ce=!1,re=null,de=null,Le=null;return{setReversed:function(Pe){if(Ce!==Pe){const st=e.get("EXT_clip_control");Ce?st.clipControlEXT(st.LOWER_LEFT_EXT,st.ZERO_TO_ONE_EXT):st.clipControlEXT(st.LOWER_LEFT_EXT,st.NEGATIVE_ONE_TO_ONE_EXT);const Ot=Le;Le=null,this.setClear(Ot)}Ce=Pe},getReversed:function(){return Ce},setTest:function(Pe){Pe?_e(s.DEPTH_TEST):Te(s.DEPTH_TEST)},setMask:function(Pe){re!==Pe&&!H&&(s.depthMask(Pe),re=Pe)},setFunc:function(Pe){if(Ce&&(Pe=kE[Pe]),de!==Pe){switch(Pe){case Lf:s.depthFunc(s.NEVER);break;case Df:s.depthFunc(s.ALWAYS);break;case If:s.depthFunc(s.LESS);break;case so:s.depthFunc(s.LEQUAL);break;case Uf:s.depthFunc(s.EQUAL);break;case Nf:s.depthFunc(s.GEQUAL);break;case Ff:s.depthFunc(s.GREATER);break;case Of:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}de=Pe}},setLocked:function(Pe){H=Pe},setClear:function(Pe){Le!==Pe&&(Ce&&(Pe=1-Pe),s.clearDepth(Pe),Le=Pe)},reset:function(){H=!1,re=null,de=null,Le=null,Ce=!1}}}function a(){let H=!1,Ce=null,re=null,de=null,Le=null,Pe=null,st=null,Ot=null,Kt=null;return{setTest:function(yt){H||(yt?_e(s.STENCIL_TEST):Te(s.STENCIL_TEST))},setMask:function(yt){Ce!==yt&&!H&&(s.stencilMask(yt),Ce=yt)},setFunc:function(yt,Cn,Sn){(re!==yt||de!==Cn||Le!==Sn)&&(s.stencilFunc(yt,Cn,Sn),re=yt,de=Cn,Le=Sn)},setOp:function(yt,Cn,Sn){(Pe!==yt||st!==Cn||Ot!==Sn)&&(s.stencilOp(yt,Cn,Sn),Pe=yt,st=Cn,Ot=Sn)},setLocked:function(yt){H=yt},setClear:function(yt){Kt!==yt&&(s.clearStencil(yt),Kt=yt)},reset:function(){H=!1,Ce=null,re=null,de=null,Le=null,Pe=null,st=null,Ot=null,Kt=null}}}const l=new t,u=new r,f=new a,d=new WeakMap,m=new WeakMap;let p={},g={},v=new WeakMap,y=[],S=null,E=!1,M=null,x=null,D=null,L=null,A=null,q=null,N=null,F=new _t(0,0,0),V=0,b=!1,C=null,z=null,ne=null,K=null,ae=null;const ue=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let oe=!1,ce=0;const k=s.getParameter(s.VERSION);k.indexOf("WebGL")!==-1?(ce=parseFloat(/^WebGL (\d)/.exec(k)[1]),oe=ce>=1):k.indexOf("OpenGL ES")!==-1&&(ce=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),oe=ce>=2);let le=null,se={};const U=s.getParameter(s.SCISSOR_BOX),ie=s.getParameter(s.VIEWPORT),Ie=new Dt().fromArray(U),Q=new Dt().fromArray(ie);function fe(H,Ce,re,de){const Le=new Uint8Array(4),Pe=s.createTexture();s.bindTexture(H,Pe),s.texParameteri(H,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(H,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let st=0;st<re;st++)H===s.TEXTURE_3D||H===s.TEXTURE_2D_ARRAY?s.texImage3D(Ce,0,s.RGBA,1,1,de,0,s.RGBA,s.UNSIGNED_BYTE,Le):s.texImage2D(Ce+st,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Le);return Pe}const Se={};Se[s.TEXTURE_2D]=fe(s.TEXTURE_2D,s.TEXTURE_2D,1),Se[s.TEXTURE_CUBE_MAP]=fe(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Se[s.TEXTURE_2D_ARRAY]=fe(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Se[s.TEXTURE_3D]=fe(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),u.setClear(1),f.setClear(0),_e(s.DEPTH_TEST),u.setFunc(so),dt(!1),ut(um),_e(s.CULL_FACE),X(Ur);function _e(H){p[H]!==!0&&(s.enable(H),p[H]=!0)}function Te(H){p[H]!==!1&&(s.disable(H),p[H]=!1)}function Ue(H,Ce){return g[H]!==Ce?(s.bindFramebuffer(H,Ce),g[H]=Ce,H===s.DRAW_FRAMEBUFFER&&(g[s.FRAMEBUFFER]=Ce),H===s.FRAMEBUFFER&&(g[s.DRAW_FRAMEBUFFER]=Ce),!0):!1}function Qe(H,Ce){let re=y,de=!1;if(H){re=v.get(Ce),re===void 0&&(re=[],v.set(Ce,re));const Le=H.textures;if(re.length!==Le.length||re[0]!==s.COLOR_ATTACHMENT0){for(let Pe=0,st=Le.length;Pe<st;Pe++)re[Pe]=s.COLOR_ATTACHMENT0+Pe;re.length=Le.length,de=!0}}else re[0]!==s.BACK&&(re[0]=s.BACK,de=!0);de&&s.drawBuffers(re)}function Pt(H){return S!==H?(s.useProgram(H),S=H,!0):!1}const pt={[cs]:s.FUNC_ADD,[i_]:s.FUNC_SUBTRACT,[r_]:s.FUNC_REVERSE_SUBTRACT};pt[s_]=s.MIN,pt[o_]=s.MAX;const Nt={[a_]:s.ZERO,[l_]:s.ONE,[c_]:s.SRC_COLOR,[bf]:s.SRC_ALPHA,[m_]:s.SRC_ALPHA_SATURATE,[d_]:s.DST_COLOR,[f_]:s.DST_ALPHA,[u_]:s.ONE_MINUS_SRC_COLOR,[Pf]:s.ONE_MINUS_SRC_ALPHA,[p_]:s.ONE_MINUS_DST_COLOR,[h_]:s.ONE_MINUS_DST_ALPHA,[g_]:s.CONSTANT_COLOR,[v_]:s.ONE_MINUS_CONSTANT_COLOR,[__]:s.CONSTANT_ALPHA,[x_]:s.ONE_MINUS_CONSTANT_ALPHA};function X(H,Ce,re,de,Le,Pe,st,Ot,Kt,yt){if(H===Ur){E===!0&&(Te(s.BLEND),E=!1);return}if(E===!1&&(_e(s.BLEND),E=!0),H!==n_){if(H!==M||yt!==b){if((x!==cs||A!==cs)&&(s.blendEquation(s.FUNC_ADD),x=cs,A=cs),yt)switch(H){case no:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case fm:s.blendFunc(s.ONE,s.ONE);break;case hm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case dm:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}else switch(H){case no:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case fm:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case hm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case dm:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",H);break}D=null,L=null,q=null,N=null,F.set(0,0,0),V=0,M=H,b=yt}return}Le=Le||Ce,Pe=Pe||re,st=st||de,(Ce!==x||Le!==A)&&(s.blendEquationSeparate(pt[Ce],pt[Le]),x=Ce,A=Le),(re!==D||de!==L||Pe!==q||st!==N)&&(s.blendFuncSeparate(Nt[re],Nt[de],Nt[Pe],Nt[st]),D=re,L=de,q=Pe,N=st),(Ot.equals(F)===!1||Kt!==V)&&(s.blendColor(Ot.r,Ot.g,Ot.b,Kt),F.copy(Ot),V=Kt),M=H,b=!1}function Mn(H,Ce){H.side===Li?Te(s.CULL_FACE):_e(s.CULL_FACE);let re=H.side===Rn;Ce&&(re=!re),dt(re),H.blending===no&&H.transparent===!1?X(Ur):X(H.blending,H.blendEquation,H.blendSrc,H.blendDst,H.blendEquationAlpha,H.blendSrcAlpha,H.blendDstAlpha,H.blendColor,H.blendAlpha,H.premultipliedAlpha),u.setFunc(H.depthFunc),u.setTest(H.depthTest),u.setMask(H.depthWrite),l.setMask(H.colorWrite);const de=H.stencilWrite;f.setTest(de),de&&(f.setMask(H.stencilWriteMask),f.setFunc(H.stencilFunc,H.stencilRef,H.stencilFuncMask),f.setOp(H.stencilFail,H.stencilZFail,H.stencilZPass)),Ct(H.polygonOffset,H.polygonOffsetFactor,H.polygonOffsetUnits),H.alphaToCoverage===!0?_e(s.SAMPLE_ALPHA_TO_COVERAGE):Te(s.SAMPLE_ALPHA_TO_COVERAGE)}function dt(H){C!==H&&(H?s.frontFace(s.CW):s.frontFace(s.CCW),C=H)}function ut(H){H!==e_?(_e(s.CULL_FACE),H!==z&&(H===um?s.cullFace(s.BACK):H===t_?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Te(s.CULL_FACE),z=H}function $e(H){H!==ne&&(oe&&s.lineWidth(H),ne=H)}function Ct(H,Ce,re){H?(_e(s.POLYGON_OFFSET_FILL),(K!==Ce||ae!==re)&&(s.polygonOffset(Ce,re),K=Ce,ae=re)):Te(s.POLYGON_OFFSET_FILL)}function qe(H){H?_e(s.SCISSOR_TEST):Te(s.SCISSOR_TEST)}function P(H){H===void 0&&(H=s.TEXTURE0+ue-1),le!==H&&(s.activeTexture(H),le=H)}function T(H,Ce,re){re===void 0&&(le===null?re=s.TEXTURE0+ue-1:re=le);let de=se[re];de===void 0&&(de={type:void 0,texture:void 0},se[re]=de),(de.type!==H||de.texture!==Ce)&&(le!==re&&(s.activeTexture(re),le=re),s.bindTexture(H,Ce||Se[H]),de.type=H,de.texture=Ce)}function Z(){const H=se[le];H!==void 0&&H.type!==void 0&&(s.bindTexture(H.type,null),H.type=void 0,H.texture=void 0)}function pe(){try{s.compressedTexImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ge(){try{s.compressedTexImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function he(){try{s.texSubImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ge(){try{s.texSubImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Re(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Ne(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ct(){try{s.texStorage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function ye(){try{s.texStorage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Oe(){try{s.texImage2D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function Je(){try{s.texImage3D.apply(s,arguments)}catch(H){console.error("THREE.WebGLState:",H)}}function et(H){Ie.equals(H)===!1&&(s.scissor(H.x,H.y,H.z,H.w),Ie.copy(H))}function ze(H){Q.equals(H)===!1&&(s.viewport(H.x,H.y,H.z,H.w),Q.copy(H))}function ft(H,Ce){let re=m.get(Ce);re===void 0&&(re=new WeakMap,m.set(Ce,re));let de=re.get(H);de===void 0&&(de=s.getUniformBlockIndex(Ce,H.name),re.set(H,de))}function rt(H,Ce){const de=m.get(Ce).get(H);d.get(Ce)!==de&&(s.uniformBlockBinding(Ce,de,H.__bindingPointIndex),d.set(Ce,de))}function Rt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),u.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),p={},le=null,se={},g={},v=new WeakMap,y=[],S=null,E=!1,M=null,x=null,D=null,L=null,A=null,q=null,N=null,F=new _t(0,0,0),V=0,b=!1,C=null,z=null,ne=null,K=null,ae=null,Ie.set(0,0,s.canvas.width,s.canvas.height),Q.set(0,0,s.canvas.width,s.canvas.height),l.reset(),u.reset(),f.reset()}return{buffers:{color:l,depth:u,stencil:f},enable:_e,disable:Te,bindFramebuffer:Ue,drawBuffers:Qe,useProgram:Pt,setBlending:X,setMaterial:Mn,setFlipSided:dt,setCullFace:ut,setLineWidth:$e,setPolygonOffset:Ct,setScissorTest:qe,activeTexture:P,bindTexture:T,unbindTexture:Z,compressedTexImage2D:pe,compressedTexImage3D:ge,texImage2D:Oe,texImage3D:Je,updateUBOMapping:ft,uniformBlockBinding:rt,texStorage2D:ct,texStorage3D:ye,texSubImage2D:he,texSubImage3D:Ge,compressedTexSubImage2D:Re,compressedTexSubImage3D:Ne,scissor:et,viewport:ze,reset:Rt}}function ag(s,e,t,r){const a=HE(r);switch(t){case Lg:return s*e;case Ig:return s*e;case Ug:return s*e*2;case Ng:return s*e/a.components*a.byteLength;case Th:return s*e/a.components*a.byteLength;case Fg:return s*e*2/a.components*a.byteLength;case Ah:return s*e*2/a.components*a.byteLength;case Dg:return s*e*3/a.components*a.byteLength;case xi:return s*e*4/a.components*a.byteLength;case Rh:return s*e*4/a.components*a.byteLength;case Hl:case Vl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Gl:case Wl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Gf:case Xf:return Math.max(s,16)*Math.max(e,8)/4;case Vf:case Wf:return Math.max(s,8)*Math.max(e,8)/2;case jf:case Yf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case qf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case $f:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Kf:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Zf:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Qf:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Jf:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case eh:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case th:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case nh:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case ih:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case rh:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case sh:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case oh:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case ah:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case lh:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case Xl:case ch:case uh:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Og:case fh:return Math.ceil(s/4)*Math.ceil(e/4)*8;case hh:case dh:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function HE(s){switch(s){case nr:case Cg:return{byteLength:1,components:1};case ra:case bg:case oa:return{byteLength:2,components:1};case Eh:case wh:return{byteLength:2,components:4};case ps:case Sh:case Ji:return{byteLength:4,components:1};case Pg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function VE(s,e,t,r,a,l,u){const f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,d=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),m=new xt,p=new WeakMap;let g;const v=new WeakMap;let y=!1;try{y=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(P,T){return y?new OffscreenCanvas(P,T):$l("canvas")}function E(P,T,Z){let pe=1;const ge=qe(P);if((ge.width>Z||ge.height>Z)&&(pe=Z/Math.max(ge.width,ge.height)),pe<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const he=Math.floor(pe*ge.width),Ge=Math.floor(pe*ge.height);g===void 0&&(g=S(he,Ge));const Re=T?S(he,Ge):g;return Re.width=he,Re.height=Ge,Re.getContext("2d").drawImage(P,0,0,he,Ge),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+he+"x"+Ge+")."),Re}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),P;return P}function M(P){return P.generateMipmaps}function x(P){s.generateMipmap(P)}function D(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function L(P,T,Z,pe,ge=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let he=T;if(T===s.RED&&(Z===s.FLOAT&&(he=s.R32F),Z===s.HALF_FLOAT&&(he=s.R16F),Z===s.UNSIGNED_BYTE&&(he=s.R8)),T===s.RED_INTEGER&&(Z===s.UNSIGNED_BYTE&&(he=s.R8UI),Z===s.UNSIGNED_SHORT&&(he=s.R16UI),Z===s.UNSIGNED_INT&&(he=s.R32UI),Z===s.BYTE&&(he=s.R8I),Z===s.SHORT&&(he=s.R16I),Z===s.INT&&(he=s.R32I)),T===s.RG&&(Z===s.FLOAT&&(he=s.RG32F),Z===s.HALF_FLOAT&&(he=s.RG16F),Z===s.UNSIGNED_BYTE&&(he=s.RG8)),T===s.RG_INTEGER&&(Z===s.UNSIGNED_BYTE&&(he=s.RG8UI),Z===s.UNSIGNED_SHORT&&(he=s.RG16UI),Z===s.UNSIGNED_INT&&(he=s.RG32UI),Z===s.BYTE&&(he=s.RG8I),Z===s.SHORT&&(he=s.RG16I),Z===s.INT&&(he=s.RG32I)),T===s.RGB_INTEGER&&(Z===s.UNSIGNED_BYTE&&(he=s.RGB8UI),Z===s.UNSIGNED_SHORT&&(he=s.RGB16UI),Z===s.UNSIGNED_INT&&(he=s.RGB32UI),Z===s.BYTE&&(he=s.RGB8I),Z===s.SHORT&&(he=s.RGB16I),Z===s.INT&&(he=s.RGB32I)),T===s.RGBA_INTEGER&&(Z===s.UNSIGNED_BYTE&&(he=s.RGBA8UI),Z===s.UNSIGNED_SHORT&&(he=s.RGBA16UI),Z===s.UNSIGNED_INT&&(he=s.RGBA32UI),Z===s.BYTE&&(he=s.RGBA8I),Z===s.SHORT&&(he=s.RGBA16I),Z===s.INT&&(he=s.RGBA32I)),T===s.RGB&&Z===s.UNSIGNED_INT_5_9_9_9_REV&&(he=s.RGB9_E5),T===s.RGBA){const Ge=ge?ec:St.getTransfer(pe);Z===s.FLOAT&&(he=s.RGBA32F),Z===s.HALF_FLOAT&&(he=s.RGBA16F),Z===s.UNSIGNED_BYTE&&(he=Ge===Lt?s.SRGB8_ALPHA8:s.RGBA8),Z===s.UNSIGNED_SHORT_4_4_4_4&&(he=s.RGBA4),Z===s.UNSIGNED_SHORT_5_5_5_1&&(he=s.RGB5_A1)}return(he===s.R16F||he===s.R32F||he===s.RG16F||he===s.RG32F||he===s.RGBA16F||he===s.RGBA32F)&&e.get("EXT_color_buffer_float"),he}function A(P,T){let Z;return P?T===null||T===ps||T===lo?Z=s.DEPTH24_STENCIL8:T===Ji?Z=s.DEPTH32F_STENCIL8:T===ra&&(Z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ps||T===lo?Z=s.DEPTH_COMPONENT24:T===Ji?Z=s.DEPTH_COMPONENT32F:T===ra&&(Z=s.DEPTH_COMPONENT16),Z}function q(P,T){return M(P)===!0||P.isFramebufferTexture&&P.minFilter!==Mi&&P.minFilter!==Di?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function N(P){const T=P.target;T.removeEventListener("dispose",N),V(T),T.isVideoTexture&&p.delete(T)}function F(P){const T=P.target;T.removeEventListener("dispose",F),C(T)}function V(P){const T=r.get(P);if(T.__webglInit===void 0)return;const Z=P.source,pe=v.get(Z);if(pe){const ge=pe[T.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&b(P),Object.keys(pe).length===0&&v.delete(Z)}r.remove(P)}function b(P){const T=r.get(P);s.deleteTexture(T.__webglTexture);const Z=P.source,pe=v.get(Z);delete pe[T.__cacheKey],u.memory.textures--}function C(P){const T=r.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),r.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let pe=0;pe<6;pe++){if(Array.isArray(T.__webglFramebuffer[pe]))for(let ge=0;ge<T.__webglFramebuffer[pe].length;ge++)s.deleteFramebuffer(T.__webglFramebuffer[pe][ge]);else s.deleteFramebuffer(T.__webglFramebuffer[pe]);T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer[pe])}else{if(Array.isArray(T.__webglFramebuffer))for(let pe=0;pe<T.__webglFramebuffer.length;pe++)s.deleteFramebuffer(T.__webglFramebuffer[pe]);else s.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&s.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let pe=0;pe<T.__webglColorRenderbuffer.length;pe++)T.__webglColorRenderbuffer[pe]&&s.deleteRenderbuffer(T.__webglColorRenderbuffer[pe]);T.__webglDepthRenderbuffer&&s.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const Z=P.textures;for(let pe=0,ge=Z.length;pe<ge;pe++){const he=r.get(Z[pe]);he.__webglTexture&&(s.deleteTexture(he.__webglTexture),u.memory.textures--),r.remove(Z[pe])}r.remove(P)}let z=0;function ne(){z=0}function K(){const P=z;return P>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+a.maxTextures),z+=1,P}function ae(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function ue(P,T){const Z=r.get(P);if(P.isVideoTexture&&$e(P),P.isRenderTargetTexture===!1&&P.version>0&&Z.__version!==P.version){const pe=P.image;if(pe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(pe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(Z,P,T);return}}t.bindTexture(s.TEXTURE_2D,Z.__webglTexture,s.TEXTURE0+T)}function oe(P,T){const Z=r.get(P);if(P.version>0&&Z.__version!==P.version){Q(Z,P,T);return}t.bindTexture(s.TEXTURE_2D_ARRAY,Z.__webglTexture,s.TEXTURE0+T)}function ce(P,T){const Z=r.get(P);if(P.version>0&&Z.__version!==P.version){Q(Z,P,T);return}t.bindTexture(s.TEXTURE_3D,Z.__webglTexture,s.TEXTURE0+T)}function k(P,T){const Z=r.get(P);if(P.version>0&&Z.__version!==P.version){fe(Z,P,T);return}t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture,s.TEXTURE0+T)}const le={[Bf]:s.REPEAT,[fs]:s.CLAMP_TO_EDGE,[Hf]:s.MIRRORED_REPEAT},se={[Mi]:s.NEAREST,[b_]:s.NEAREST_MIPMAP_NEAREST,[gl]:s.NEAREST_MIPMAP_LINEAR,[Di]:s.LINEAR,[Gu]:s.LINEAR_MIPMAP_NEAREST,[hs]:s.LINEAR_MIPMAP_LINEAR},U={[I_]:s.NEVER,[k_]:s.ALWAYS,[U_]:s.LESS,[kg]:s.LEQUAL,[N_]:s.EQUAL,[z_]:s.GEQUAL,[F_]:s.GREATER,[O_]:s.NOTEQUAL};function ie(P,T){if(T.type===Ji&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===Di||T.magFilter===Gu||T.magFilter===gl||T.magFilter===hs||T.minFilter===Di||T.minFilter===Gu||T.minFilter===gl||T.minFilter===hs)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,le[T.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,le[T.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,le[T.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,se[T.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,se[T.minFilter]),T.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,U[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===Mi||T.minFilter!==gl&&T.minFilter!==hs||T.type===Ji&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||r.get(T).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),r.get(T).__currentAnisotropy=T.anisotropy}}}function Ie(P,T){let Z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",N));const pe=T.source;let ge=v.get(pe);ge===void 0&&(ge={},v.set(pe,ge));const he=ae(T);if(he!==P.__cacheKey){ge[he]===void 0&&(ge[he]={texture:s.createTexture(),usedTimes:0},u.memory.textures++,Z=!0),ge[he].usedTimes++;const Ge=ge[P.__cacheKey];Ge!==void 0&&(ge[P.__cacheKey].usedTimes--,Ge.usedTimes===0&&b(T)),P.__cacheKey=he,P.__webglTexture=ge[he].texture}return Z}function Q(P,T,Z){let pe=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(pe=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(pe=s.TEXTURE_3D);const ge=Ie(P,T),he=T.source;t.bindTexture(pe,P.__webglTexture,s.TEXTURE0+Z);const Ge=r.get(he);if(he.version!==Ge.__version||ge===!0){t.activeTexture(s.TEXTURE0+Z);const Re=St.getPrimaries(St.workingColorSpace),Ne=T.colorSpace===Lr?null:St.getPrimaries(T.colorSpace),ct=T.colorSpace===Lr||Re===Ne?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);let ye=E(T.image,!1,a.maxTextureSize);ye=Ct(T,ye);const Oe=l.convert(T.format,T.colorSpace),Je=l.convert(T.type);let et=L(T.internalFormat,Oe,Je,T.colorSpace,T.isVideoTexture);ie(pe,T);let ze;const ft=T.mipmaps,rt=T.isVideoTexture!==!0,Rt=Ge.__version===void 0||ge===!0,H=he.dataReady,Ce=q(T,ye);if(T.isDepthTexture)et=A(T.format===co,T.type),Rt&&(rt?t.texStorage2D(s.TEXTURE_2D,1,et,ye.width,ye.height):t.texImage2D(s.TEXTURE_2D,0,et,ye.width,ye.height,0,Oe,Je,null));else if(T.isDataTexture)if(ft.length>0){rt&&Rt&&t.texStorage2D(s.TEXTURE_2D,Ce,et,ft[0].width,ft[0].height);for(let re=0,de=ft.length;re<de;re++)ze=ft[re],rt?H&&t.texSubImage2D(s.TEXTURE_2D,re,0,0,ze.width,ze.height,Oe,Je,ze.data):t.texImage2D(s.TEXTURE_2D,re,et,ze.width,ze.height,0,Oe,Je,ze.data);T.generateMipmaps=!1}else rt?(Rt&&t.texStorage2D(s.TEXTURE_2D,Ce,et,ye.width,ye.height),H&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ye.width,ye.height,Oe,Je,ye.data)):t.texImage2D(s.TEXTURE_2D,0,et,ye.width,ye.height,0,Oe,Je,ye.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){rt&&Rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,et,ft[0].width,ft[0].height,ye.depth);for(let re=0,de=ft.length;re<de;re++)if(ze=ft[re],T.format!==xi)if(Oe!==null)if(rt){if(H)if(T.layerUpdates.size>0){const Le=ag(ze.width,ze.height,T.format,T.type);for(const Pe of T.layerUpdates){const st=ze.data.subarray(Pe*Le/ze.data.BYTES_PER_ELEMENT,(Pe+1)*Le/ze.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,Pe,ze.width,ze.height,1,Oe,st)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,0,ze.width,ze.height,ye.depth,Oe,ze.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,re,et,ze.width,ze.height,ye.depth,0,ze.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else rt?H&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,re,0,0,0,ze.width,ze.height,ye.depth,Oe,Je,ze.data):t.texImage3D(s.TEXTURE_2D_ARRAY,re,et,ze.width,ze.height,ye.depth,0,Oe,Je,ze.data)}else{rt&&Rt&&t.texStorage2D(s.TEXTURE_2D,Ce,et,ft[0].width,ft[0].height);for(let re=0,de=ft.length;re<de;re++)ze=ft[re],T.format!==xi?Oe!==null?rt?H&&t.compressedTexSubImage2D(s.TEXTURE_2D,re,0,0,ze.width,ze.height,Oe,ze.data):t.compressedTexImage2D(s.TEXTURE_2D,re,et,ze.width,ze.height,0,ze.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):rt?H&&t.texSubImage2D(s.TEXTURE_2D,re,0,0,ze.width,ze.height,Oe,Je,ze.data):t.texImage2D(s.TEXTURE_2D,re,et,ze.width,ze.height,0,Oe,Je,ze.data)}else if(T.isDataArrayTexture)if(rt){if(Rt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ce,et,ye.width,ye.height,ye.depth),H)if(T.layerUpdates.size>0){const re=ag(ye.width,ye.height,T.format,T.type);for(const de of T.layerUpdates){const Le=ye.data.subarray(de*re/ye.data.BYTES_PER_ELEMENT,(de+1)*re/ye.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,de,ye.width,ye.height,1,Oe,Je,Le)}T.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ye.width,ye.height,ye.depth,Oe,Je,ye.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,et,ye.width,ye.height,ye.depth,0,Oe,Je,ye.data);else if(T.isData3DTexture)rt?(Rt&&t.texStorage3D(s.TEXTURE_3D,Ce,et,ye.width,ye.height,ye.depth),H&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ye.width,ye.height,ye.depth,Oe,Je,ye.data)):t.texImage3D(s.TEXTURE_3D,0,et,ye.width,ye.height,ye.depth,0,Oe,Je,ye.data);else if(T.isFramebufferTexture){if(Rt)if(rt)t.texStorage2D(s.TEXTURE_2D,Ce,et,ye.width,ye.height);else{let re=ye.width,de=ye.height;for(let Le=0;Le<Ce;Le++)t.texImage2D(s.TEXTURE_2D,Le,et,re,de,0,Oe,Je,null),re>>=1,de>>=1}}else if(ft.length>0){if(rt&&Rt){const re=qe(ft[0]);t.texStorage2D(s.TEXTURE_2D,Ce,et,re.width,re.height)}for(let re=0,de=ft.length;re<de;re++)ze=ft[re],rt?H&&t.texSubImage2D(s.TEXTURE_2D,re,0,0,Oe,Je,ze):t.texImage2D(s.TEXTURE_2D,re,et,Oe,Je,ze);T.generateMipmaps=!1}else if(rt){if(Rt){const re=qe(ye);t.texStorage2D(s.TEXTURE_2D,Ce,et,re.width,re.height)}H&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Oe,Je,ye)}else t.texImage2D(s.TEXTURE_2D,0,et,Oe,Je,ye);M(T)&&x(pe),Ge.__version=he.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function fe(P,T,Z){if(T.image.length!==6)return;const pe=Ie(P,T),ge=T.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+Z);const he=r.get(ge);if(ge.version!==he.__version||pe===!0){t.activeTexture(s.TEXTURE0+Z);const Ge=St.getPrimaries(St.workingColorSpace),Re=T.colorSpace===Lr?null:St.getPrimaries(T.colorSpace),Ne=T.colorSpace===Lr||Ge===Re?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);const ct=T.isCompressedTexture||T.image[0].isCompressedTexture,ye=T.image[0]&&T.image[0].isDataTexture,Oe=[];for(let de=0;de<6;de++)!ct&&!ye?Oe[de]=E(T.image[de],!0,a.maxCubemapSize):Oe[de]=ye?T.image[de].image:T.image[de],Oe[de]=Ct(T,Oe[de]);const Je=Oe[0],et=l.convert(T.format,T.colorSpace),ze=l.convert(T.type),ft=L(T.internalFormat,et,ze,T.colorSpace),rt=T.isVideoTexture!==!0,Rt=he.__version===void 0||pe===!0,H=ge.dataReady;let Ce=q(T,Je);ie(s.TEXTURE_CUBE_MAP,T);let re;if(ct){rt&&Rt&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Ce,ft,Je.width,Je.height);for(let de=0;de<6;de++){re=Oe[de].mipmaps;for(let Le=0;Le<re.length;Le++){const Pe=re[Le];T.format!==xi?et!==null?rt?H&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le,0,0,Pe.width,Pe.height,et,Pe.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le,ft,Pe.width,Pe.height,0,Pe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):rt?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le,0,0,Pe.width,Pe.height,et,ze,Pe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le,ft,Pe.width,Pe.height,0,et,ze,Pe.data)}}}else{if(re=T.mipmaps,rt&&Rt){re.length>0&&Ce++;const de=qe(Oe[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Ce,ft,de.width,de.height)}for(let de=0;de<6;de++)if(ye){rt?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,0,0,Oe[de].width,Oe[de].height,et,ze,Oe[de].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,ft,Oe[de].width,Oe[de].height,0,et,ze,Oe[de].data);for(let Le=0;Le<re.length;Le++){const st=re[Le].image[de].image;rt?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le+1,0,0,st.width,st.height,et,ze,st.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le+1,ft,st.width,st.height,0,et,ze,st.data)}}else{rt?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,0,0,et,ze,Oe[de]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,ft,et,ze,Oe[de]);for(let Le=0;Le<re.length;Le++){const Pe=re[Le];rt?H&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le+1,0,0,et,ze,Pe.image[de]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+de,Le+1,ft,et,ze,Pe.image[de])}}}M(T)&&x(s.TEXTURE_CUBE_MAP),he.__version=ge.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function Se(P,T,Z,pe,ge,he){const Ge=l.convert(Z.format,Z.colorSpace),Re=l.convert(Z.type),Ne=L(Z.internalFormat,Ge,Re,Z.colorSpace),ct=r.get(T),ye=r.get(Z);if(ye.__renderTarget=T,!ct.__hasExternalTextures){const Oe=Math.max(1,T.width>>he),Je=Math.max(1,T.height>>he);ge===s.TEXTURE_3D||ge===s.TEXTURE_2D_ARRAY?t.texImage3D(ge,he,Ne,Oe,Je,T.depth,0,Ge,Re,null):t.texImage2D(ge,he,Ne,Oe,Je,0,Ge,Re,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),ut(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,pe,ge,ye.__webglTexture,0,dt(T)):(ge===s.TEXTURE_2D||ge>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,pe,ge,ye.__webglTexture,he),t.bindFramebuffer(s.FRAMEBUFFER,null)}function _e(P,T,Z){if(s.bindRenderbuffer(s.RENDERBUFFER,P),T.depthBuffer){const pe=T.depthTexture,ge=pe&&pe.isDepthTexture?pe.type:null,he=A(T.stencilBuffer,ge),Ge=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Re=dt(T);ut(T)?f.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Re,he,T.width,T.height):Z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Re,he,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,he,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ge,s.RENDERBUFFER,P)}else{const pe=T.textures;for(let ge=0;ge<pe.length;ge++){const he=pe[ge],Ge=l.convert(he.format,he.colorSpace),Re=l.convert(he.type),Ne=L(he.internalFormat,Ge,Re,he.colorSpace),ct=dt(T);Z&&ut(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,ct,Ne,T.width,T.height):ut(T)?f.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ct,Ne,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,Ne,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Te(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const pe=r.get(T.depthTexture);pe.__renderTarget=T,(!pe.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),ue(T.depthTexture,0);const ge=pe.__webglTexture,he=dt(T);if(T.depthTexture.format===io)ut(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ge,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ge,0);else if(T.depthTexture.format===co)ut(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ge,0,he):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function Ue(P){const T=r.get(P),Z=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const pe=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),pe){const ge=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,pe.removeEventListener("dispose",ge)};pe.addEventListener("dispose",ge),T.__depthDisposeCallback=ge}T.__boundDepthTexture=pe}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");Te(T.__webglFramebuffer,P)}else if(Z){T.__webglDepthbuffer=[];for(let pe=0;pe<6;pe++)if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[pe]),T.__webglDepthbuffer[pe]===void 0)T.__webglDepthbuffer[pe]=s.createRenderbuffer(),_e(T.__webglDepthbuffer[pe],P,!1);else{const ge=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,he=T.__webglDepthbuffer[pe];s.bindRenderbuffer(s.RENDERBUFFER,he),s.framebufferRenderbuffer(s.FRAMEBUFFER,ge,s.RENDERBUFFER,he)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=s.createRenderbuffer(),_e(T.__webglDepthbuffer,P,!1);else{const pe=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ge=T.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ge),s.framebufferRenderbuffer(s.FRAMEBUFFER,pe,s.RENDERBUFFER,ge)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Qe(P,T,Z){const pe=r.get(P);T!==void 0&&Se(pe.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),Z!==void 0&&Ue(P)}function Pt(P){const T=P.texture,Z=r.get(P),pe=r.get(T);P.addEventListener("dispose",F);const ge=P.textures,he=P.isWebGLCubeRenderTarget===!0,Ge=ge.length>1;if(Ge||(pe.__webglTexture===void 0&&(pe.__webglTexture=s.createTexture()),pe.__version=T.version,u.memory.textures++),he){Z.__webglFramebuffer=[];for(let Re=0;Re<6;Re++)if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer[Re]=[];for(let Ne=0;Ne<T.mipmaps.length;Ne++)Z.__webglFramebuffer[Re][Ne]=s.createFramebuffer()}else Z.__webglFramebuffer[Re]=s.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer=[];for(let Re=0;Re<T.mipmaps.length;Re++)Z.__webglFramebuffer[Re]=s.createFramebuffer()}else Z.__webglFramebuffer=s.createFramebuffer();if(Ge)for(let Re=0,Ne=ge.length;Re<Ne;Re++){const ct=r.get(ge[Re]);ct.__webglTexture===void 0&&(ct.__webglTexture=s.createTexture(),u.memory.textures++)}if(P.samples>0&&ut(P)===!1){Z.__webglMultisampledFramebuffer=s.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let Re=0;Re<ge.length;Re++){const Ne=ge[Re];Z.__webglColorRenderbuffer[Re]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,Z.__webglColorRenderbuffer[Re]);const ct=l.convert(Ne.format,Ne.colorSpace),ye=l.convert(Ne.type),Oe=L(Ne.internalFormat,ct,ye,Ne.colorSpace,P.isXRRenderTarget===!0),Je=dt(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,Je,Oe,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.RENDERBUFFER,Z.__webglColorRenderbuffer[Re])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(Z.__webglDepthRenderbuffer=s.createRenderbuffer(),_e(Z.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(he){t.bindTexture(s.TEXTURE_CUBE_MAP,pe.__webglTexture),ie(s.TEXTURE_CUBE_MAP,T);for(let Re=0;Re<6;Re++)if(T.mipmaps&&T.mipmaps.length>0)for(let Ne=0;Ne<T.mipmaps.length;Ne++)Se(Z.__webglFramebuffer[Re][Ne],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Re,Ne);else Se(Z.__webglFramebuffer[Re],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Re,0);M(T)&&x(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ge){for(let Re=0,Ne=ge.length;Re<Ne;Re++){const ct=ge[Re],ye=r.get(ct);t.bindTexture(s.TEXTURE_2D,ye.__webglTexture),ie(s.TEXTURE_2D,ct),Se(Z.__webglFramebuffer,P,ct,s.COLOR_ATTACHMENT0+Re,s.TEXTURE_2D,0),M(ct)&&x(s.TEXTURE_2D)}t.unbindTexture()}else{let Re=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Re=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Re,pe.__webglTexture),ie(Re,T),T.mipmaps&&T.mipmaps.length>0)for(let Ne=0;Ne<T.mipmaps.length;Ne++)Se(Z.__webglFramebuffer[Ne],P,T,s.COLOR_ATTACHMENT0,Re,Ne);else Se(Z.__webglFramebuffer,P,T,s.COLOR_ATTACHMENT0,Re,0);M(T)&&x(Re),t.unbindTexture()}P.depthBuffer&&Ue(P)}function pt(P){const T=P.textures;for(let Z=0,pe=T.length;Z<pe;Z++){const ge=T[Z];if(M(ge)){const he=D(P),Ge=r.get(ge).__webglTexture;t.bindTexture(he,Ge),x(he),t.unbindTexture()}}}const Nt=[],X=[];function Mn(P){if(P.samples>0){if(ut(P)===!1){const T=P.textures,Z=P.width,pe=P.height;let ge=s.COLOR_BUFFER_BIT;const he=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ge=r.get(P),Re=T.length>1;if(Re)for(let Ne=0;Ne<T.length;Ne++)t.bindFramebuffer(s.FRAMEBUFFER,Ge.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ge.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ge.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ge.__webglFramebuffer);for(let Ne=0;Ne<T.length;Ne++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ge|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ge|=s.STENCIL_BUFFER_BIT)),Re){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ge.__webglColorRenderbuffer[Ne]);const ct=r.get(T[Ne]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,ct,0)}s.blitFramebuffer(0,0,Z,pe,0,0,Z,pe,ge,s.NEAREST),d===!0&&(Nt.length=0,X.length=0,Nt.push(s.COLOR_ATTACHMENT0+Ne),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Nt.push(he),X.push(he),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,X)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Nt))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Re)for(let Ne=0;Ne<T.length;Ne++){t.bindFramebuffer(s.FRAMEBUFFER,Ge.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.RENDERBUFFER,Ge.__webglColorRenderbuffer[Ne]);const ct=r.get(T[Ne]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ge.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ne,s.TEXTURE_2D,ct,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ge.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&d){const T=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[T])}}}function dt(P){return Math.min(a.maxSamples,P.samples)}function ut(P){const T=r.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function $e(P){const T=u.render.frame;p.get(P)!==T&&(p.set(P,T),P.update())}function Ct(P,T){const Z=P.colorSpace,pe=P.format,ge=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||Z!==ho&&Z!==Lr&&(St.getTransfer(Z)===Lt?(pe!==xi||ge!==nr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),T}function qe(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(m.width=P.naturalWidth||P.width,m.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(m.width=P.displayWidth,m.height=P.displayHeight):(m.width=P.width,m.height=P.height),m}this.allocateTextureUnit=K,this.resetTextureUnits=ne,this.setTexture2D=ue,this.setTexture2DArray=oe,this.setTexture3D=ce,this.setTextureCube=k,this.rebindTextures=Qe,this.setupRenderTarget=Pt,this.updateRenderTargetMipmap=pt,this.updateMultisampleRenderTarget=Mn,this.setupDepthRenderbuffer=Ue,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=ut}function GE(s,e){function t(r,a=Lr){let l;const u=St.getTransfer(a);if(r===nr)return s.UNSIGNED_BYTE;if(r===Eh)return s.UNSIGNED_SHORT_4_4_4_4;if(r===wh)return s.UNSIGNED_SHORT_5_5_5_1;if(r===Pg)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===Cg)return s.BYTE;if(r===bg)return s.SHORT;if(r===ra)return s.UNSIGNED_SHORT;if(r===Sh)return s.INT;if(r===ps)return s.UNSIGNED_INT;if(r===Ji)return s.FLOAT;if(r===oa)return s.HALF_FLOAT;if(r===Lg)return s.ALPHA;if(r===Dg)return s.RGB;if(r===xi)return s.RGBA;if(r===Ig)return s.LUMINANCE;if(r===Ug)return s.LUMINANCE_ALPHA;if(r===io)return s.DEPTH_COMPONENT;if(r===co)return s.DEPTH_STENCIL;if(r===Ng)return s.RED;if(r===Th)return s.RED_INTEGER;if(r===Fg)return s.RG;if(r===Ah)return s.RG_INTEGER;if(r===Rh)return s.RGBA_INTEGER;if(r===Hl||r===Vl||r===Gl||r===Wl)if(u===Lt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(r===Hl)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Vl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Gl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Wl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(r===Hl)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Vl)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Gl)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Wl)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Vf||r===Gf||r===Wf||r===Xf)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(r===Vf)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Gf)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Wf)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Xf)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===jf||r===Yf||r===qf)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(r===jf||r===Yf)return u===Lt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(r===qf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===$f||r===Kf||r===Zf||r===Qf||r===Jf||r===eh||r===th||r===nh||r===ih||r===rh||r===sh||r===oh||r===ah||r===lh)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(r===$f)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Kf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Zf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Qf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Jf)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===eh)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===th)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===nh)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===ih)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===rh)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===sh)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===oh)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ah)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===lh)return u===Lt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Xl||r===ch||r===uh)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(r===Xl)return u===Lt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===ch)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===uh)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Og||r===fh||r===hh||r===dh)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(r===Xl)return l.COMPRESSED_RED_RGTC1_EXT;if(r===fh)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===hh)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===dh)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===lo?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:t}}class WE extends qn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class un extends nn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const XE={type:"move"};class xf{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new un,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new un,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new un,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let a=null,l=null,u=null;const f=this._targetRay,d=this._grip,m=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(m&&e.hand){u=!0;for(const E of e.hand.values()){const M=t.getJointPose(E,r),x=this._getHandJoint(m,E);M!==null&&(x.matrix.fromArray(M.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=M.radius),x.visible=M!==null}const p=m.joints["index-finger-tip"],g=m.joints["thumb-tip"],v=p.position.distanceTo(g.position),y=.02,S=.005;m.inputState.pinching&&v>y+S?(m.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!m.inputState.pinching&&v<=y-S&&(m.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else d!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,r),l!==null&&(d.matrix.fromArray(l.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,l.linearVelocity?(d.hasLinearVelocity=!0,d.linearVelocity.copy(l.linearVelocity)):d.hasLinearVelocity=!1,l.angularVelocity?(d.hasAngularVelocity=!0,d.angularVelocity.copy(l.angularVelocity)):d.hasAngularVelocity=!1));f!==null&&(a=t.getPose(e.targetRaySpace,r),a===null&&l!==null&&(a=l),a!==null&&(f.matrix.fromArray(a.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,a.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(a.linearVelocity)):f.hasLinearVelocity=!1,a.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(a.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(XE)))}return f!==null&&(f.visible=a!==null),d!==null&&(d.visible=l!==null),m!==null&&(m.visible=u!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new un;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}const jE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,YE=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class qE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,r){if(this.texture===null){const a=new Bn,l=e.properties.get(a);l.__webglTexture=t.texture,(t.depthNear!=r.depthNear||t.depthFar!=r.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new Or({vertexShader:jE,fragmentShader:YE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new At(new nc(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $E extends po{constructor(e,t){super();const r=this;let a=null,l=1,u=null,f="local-floor",d=1,m=null,p=null,g=null,v=null,y=null,S=null;const E=new qE,M=t.getContextAttributes();let x=null,D=null;const L=[],A=[],q=new xt;let N=null;const F=new qn;F.viewport=new Dt;const V=new qn;V.viewport=new Dt;const b=[F,V],C=new WE;let z=null,ne=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let fe=L[Q];return fe===void 0&&(fe=new xf,L[Q]=fe),fe.getTargetRaySpace()},this.getControllerGrip=function(Q){let fe=L[Q];return fe===void 0&&(fe=new xf,L[Q]=fe),fe.getGripSpace()},this.getHand=function(Q){let fe=L[Q];return fe===void 0&&(fe=new xf,L[Q]=fe),fe.getHandSpace()};function K(Q){const fe=A.indexOf(Q.inputSource);if(fe===-1)return;const Se=L[fe];Se!==void 0&&(Se.update(Q.inputSource,Q.frame,m||u),Se.dispatchEvent({type:Q.type,data:Q.inputSource}))}function ae(){a.removeEventListener("select",K),a.removeEventListener("selectstart",K),a.removeEventListener("selectend",K),a.removeEventListener("squeeze",K),a.removeEventListener("squeezestart",K),a.removeEventListener("squeezeend",K),a.removeEventListener("end",ae),a.removeEventListener("inputsourceschange",ue);for(let Q=0;Q<L.length;Q++){const fe=A[Q];fe!==null&&(A[Q]=null,L[Q].disconnect(fe))}z=null,ne=null,E.reset(),e.setRenderTarget(x),y=null,v=null,g=null,a=null,D=null,Ie.stop(),r.isPresenting=!1,e.setPixelRatio(N),e.setSize(q.width,q.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){l=Q,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){f=Q,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return m||u},this.setReferenceSpace=function(Q){m=Q},this.getBaseLayer=function(){return v!==null?v:y},this.getBinding=function(){return g},this.getFrame=function(){return S},this.getSession=function(){return a},this.setSession=async function(Q){if(a=Q,a!==null){if(x=e.getRenderTarget(),a.addEventListener("select",K),a.addEventListener("selectstart",K),a.addEventListener("selectend",K),a.addEventListener("squeeze",K),a.addEventListener("squeezestart",K),a.addEventListener("squeezeend",K),a.addEventListener("end",ae),a.addEventListener("inputsourceschange",ue),M.xrCompatible!==!0&&await t.makeXRCompatible(),N=e.getPixelRatio(),e.getSize(q),a.renderState.layers===void 0){const fe={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:l};y=new XRWebGLLayer(a,t,fe),a.updateRenderState({baseLayer:y}),e.setPixelRatio(1),e.setSize(y.framebufferWidth,y.framebufferHeight,!1),D=new ms(y.framebufferWidth,y.framebufferHeight,{format:xi,type:nr,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil})}else{let fe=null,Se=null,_e=null;M.depth&&(_e=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=M.stencil?co:io,Se=M.stencil?lo:ps);const Te={colorFormat:t.RGBA8,depthFormat:_e,scaleFactor:l};g=new XRWebGLBinding(a,t),v=g.createProjectionLayer(Te),a.updateRenderState({layers:[v]}),e.setPixelRatio(1),e.setSize(v.textureWidth,v.textureHeight,!1),D=new ms(v.textureWidth,v.textureHeight,{format:xi,type:nr,depthTexture:new Jg(v.textureWidth,v.textureHeight,Se,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1})}D.isXRRenderTarget=!0,this.setFoveation(d),m=null,u=await a.requestReferenceSpace(f),Ie.setContext(a),Ie.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return E.getDepthTexture()};function ue(Q){for(let fe=0;fe<Q.removed.length;fe++){const Se=Q.removed[fe],_e=A.indexOf(Se);_e>=0&&(A[_e]=null,L[_e].disconnect(Se))}for(let fe=0;fe<Q.added.length;fe++){const Se=Q.added[fe];let _e=A.indexOf(Se);if(_e===-1){for(let Ue=0;Ue<L.length;Ue++)if(Ue>=A.length){A.push(Se),_e=Ue;break}else if(A[Ue]===null){A[Ue]=Se,_e=Ue;break}if(_e===-1)break}const Te=L[_e];Te&&Te.connect(Se)}}const oe=new j,ce=new j;function k(Q,fe,Se){oe.setFromMatrixPosition(fe.matrixWorld),ce.setFromMatrixPosition(Se.matrixWorld);const _e=oe.distanceTo(ce),Te=fe.projectionMatrix.elements,Ue=Se.projectionMatrix.elements,Qe=Te[14]/(Te[10]-1),Pt=Te[14]/(Te[10]+1),pt=(Te[9]+1)/Te[5],Nt=(Te[9]-1)/Te[5],X=(Te[8]-1)/Te[0],Mn=(Ue[8]+1)/Ue[0],dt=Qe*X,ut=Qe*Mn,$e=_e/(-X+Mn),Ct=$e*-X;if(fe.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ct),Q.translateZ($e),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Te[10]===-1)Q.projectionMatrix.copy(fe.projectionMatrix),Q.projectionMatrixInverse.copy(fe.projectionMatrixInverse);else{const qe=Qe+$e,P=Pt+$e,T=dt-Ct,Z=ut+(_e-Ct),pe=pt*Pt/P*qe,ge=Nt*Pt/P*qe;Q.projectionMatrix.makePerspective(T,Z,pe,ge,qe,P),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function le(Q,fe){fe===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(fe.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(a===null)return;let fe=Q.near,Se=Q.far;E.texture!==null&&(E.depthNear>0&&(fe=E.depthNear),E.depthFar>0&&(Se=E.depthFar)),C.near=V.near=F.near=fe,C.far=V.far=F.far=Se,(z!==C.near||ne!==C.far)&&(a.updateRenderState({depthNear:C.near,depthFar:C.far}),z=C.near,ne=C.far),F.layers.mask=Q.layers.mask|2,V.layers.mask=Q.layers.mask|4,C.layers.mask=F.layers.mask|V.layers.mask;const _e=Q.parent,Te=C.cameras;le(C,_e);for(let Ue=0;Ue<Te.length;Ue++)le(Te[Ue],_e);Te.length===2?k(C,F,V):C.projectionMatrix.copy(F.projectionMatrix),se(Q,C,_e)};function se(Q,fe,Se){Se===null?Q.matrix.copy(fe.matrixWorld):(Q.matrix.copy(Se.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(fe.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(fe.projectionMatrix),Q.projectionMatrixInverse.copy(fe.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=ph*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(v===null&&y===null))return d},this.setFoveation=function(Q){d=Q,v!==null&&(v.fixedFoveation=Q),y!==null&&y.fixedFoveation!==void 0&&(y.fixedFoveation=Q)},this.hasDepthSensing=function(){return E.texture!==null},this.getDepthSensingMesh=function(){return E.getMesh(C)};let U=null;function ie(Q,fe){if(p=fe.getViewerPose(m||u),S=fe,p!==null){const Se=p.views;y!==null&&(e.setRenderTargetFramebuffer(D,y.framebuffer),e.setRenderTarget(D));let _e=!1;Se.length!==C.cameras.length&&(C.cameras.length=0,_e=!0);for(let Ue=0;Ue<Se.length;Ue++){const Qe=Se[Ue];let Pt=null;if(y!==null)Pt=y.getViewport(Qe);else{const Nt=g.getViewSubImage(v,Qe);Pt=Nt.viewport,Ue===0&&(e.setRenderTargetTextures(D,Nt.colorTexture,v.ignoreDepthValues?void 0:Nt.depthStencilTexture),e.setRenderTarget(D))}let pt=b[Ue];pt===void 0&&(pt=new qn,pt.layers.enable(Ue),pt.viewport=new Dt,b[Ue]=pt),pt.matrix.fromArray(Qe.transform.matrix),pt.matrix.decompose(pt.position,pt.quaternion,pt.scale),pt.projectionMatrix.fromArray(Qe.projectionMatrix),pt.projectionMatrixInverse.copy(pt.projectionMatrix).invert(),pt.viewport.set(Pt.x,Pt.y,Pt.width,Pt.height),Ue===0&&(C.matrix.copy(pt.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),_e===!0&&C.cameras.push(pt)}const Te=a.enabledFeatures;if(Te&&Te.includes("depth-sensing")){const Ue=g.getDepthInformation(Se[0]);Ue&&Ue.isValid&&Ue.texture&&E.init(e,Ue,a.renderState)}}for(let Se=0;Se<L.length;Se++){const _e=A[Se],Te=L[Se];_e!==null&&Te!==void 0&&Te.update(_e,fe,m||u)}U&&U(Q,fe),fe.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:fe}),S=null}const Ie=new Zg;Ie.setAnimationLoop(ie),this.setAnimationLoop=function(Q){U=Q},this.dispose=function(){}}}const is=new Ni,KE=new Ht;function ZE(s,e){function t(M,x){M.matrixAutoUpdate===!0&&M.updateMatrix(),x.value.copy(M.matrix)}function r(M,x){x.color.getRGB(M.fogColor.value,qg(s)),x.isFog?(M.fogNear.value=x.near,M.fogFar.value=x.far):x.isFogExp2&&(M.fogDensity.value=x.density)}function a(M,x,D,L,A){x.isMeshBasicMaterial||x.isMeshLambertMaterial?l(M,x):x.isMeshToonMaterial?(l(M,x),g(M,x)):x.isMeshPhongMaterial?(l(M,x),p(M,x)):x.isMeshStandardMaterial?(l(M,x),v(M,x),x.isMeshPhysicalMaterial&&y(M,x,A)):x.isMeshMatcapMaterial?(l(M,x),S(M,x)):x.isMeshDepthMaterial?l(M,x):x.isMeshDistanceMaterial?(l(M,x),E(M,x)):x.isMeshNormalMaterial?l(M,x):x.isLineBasicMaterial?(u(M,x),x.isLineDashedMaterial&&f(M,x)):x.isPointsMaterial?d(M,x,D,L):x.isSpriteMaterial?m(M,x):x.isShadowMaterial?(M.color.value.copy(x.color),M.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function l(M,x){M.opacity.value=x.opacity,x.color&&M.diffuse.value.copy(x.color),x.emissive&&M.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(M.map.value=x.map,t(x.map,M.mapTransform)),x.alphaMap&&(M.alphaMap.value=x.alphaMap,t(x.alphaMap,M.alphaMapTransform)),x.bumpMap&&(M.bumpMap.value=x.bumpMap,t(x.bumpMap,M.bumpMapTransform),M.bumpScale.value=x.bumpScale,x.side===Rn&&(M.bumpScale.value*=-1)),x.normalMap&&(M.normalMap.value=x.normalMap,t(x.normalMap,M.normalMapTransform),M.normalScale.value.copy(x.normalScale),x.side===Rn&&M.normalScale.value.negate()),x.displacementMap&&(M.displacementMap.value=x.displacementMap,t(x.displacementMap,M.displacementMapTransform),M.displacementScale.value=x.displacementScale,M.displacementBias.value=x.displacementBias),x.emissiveMap&&(M.emissiveMap.value=x.emissiveMap,t(x.emissiveMap,M.emissiveMapTransform)),x.specularMap&&(M.specularMap.value=x.specularMap,t(x.specularMap,M.specularMapTransform)),x.alphaTest>0&&(M.alphaTest.value=x.alphaTest);const D=e.get(x),L=D.envMap,A=D.envMapRotation;L&&(M.envMap.value=L,is.copy(A),is.x*=-1,is.y*=-1,is.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(is.y*=-1,is.z*=-1),M.envMapRotation.value.setFromMatrix4(KE.makeRotationFromEuler(is)),M.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,M.reflectivity.value=x.reflectivity,M.ior.value=x.ior,M.refractionRatio.value=x.refractionRatio),x.lightMap&&(M.lightMap.value=x.lightMap,M.lightMapIntensity.value=x.lightMapIntensity,t(x.lightMap,M.lightMapTransform)),x.aoMap&&(M.aoMap.value=x.aoMap,M.aoMapIntensity.value=x.aoMapIntensity,t(x.aoMap,M.aoMapTransform))}function u(M,x){M.diffuse.value.copy(x.color),M.opacity.value=x.opacity,x.map&&(M.map.value=x.map,t(x.map,M.mapTransform))}function f(M,x){M.dashSize.value=x.dashSize,M.totalSize.value=x.dashSize+x.gapSize,M.scale.value=x.scale}function d(M,x,D,L){M.diffuse.value.copy(x.color),M.opacity.value=x.opacity,M.size.value=x.size*D,M.scale.value=L*.5,x.map&&(M.map.value=x.map,t(x.map,M.uvTransform)),x.alphaMap&&(M.alphaMap.value=x.alphaMap,t(x.alphaMap,M.alphaMapTransform)),x.alphaTest>0&&(M.alphaTest.value=x.alphaTest)}function m(M,x){M.diffuse.value.copy(x.color),M.opacity.value=x.opacity,M.rotation.value=x.rotation,x.map&&(M.map.value=x.map,t(x.map,M.mapTransform)),x.alphaMap&&(M.alphaMap.value=x.alphaMap,t(x.alphaMap,M.alphaMapTransform)),x.alphaTest>0&&(M.alphaTest.value=x.alphaTest)}function p(M,x){M.specular.value.copy(x.specular),M.shininess.value=Math.max(x.shininess,1e-4)}function g(M,x){x.gradientMap&&(M.gradientMap.value=x.gradientMap)}function v(M,x){M.metalness.value=x.metalness,x.metalnessMap&&(M.metalnessMap.value=x.metalnessMap,t(x.metalnessMap,M.metalnessMapTransform)),M.roughness.value=x.roughness,x.roughnessMap&&(M.roughnessMap.value=x.roughnessMap,t(x.roughnessMap,M.roughnessMapTransform)),x.envMap&&(M.envMapIntensity.value=x.envMapIntensity)}function y(M,x,D){M.ior.value=x.ior,x.sheen>0&&(M.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),M.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(M.sheenColorMap.value=x.sheenColorMap,t(x.sheenColorMap,M.sheenColorMapTransform)),x.sheenRoughnessMap&&(M.sheenRoughnessMap.value=x.sheenRoughnessMap,t(x.sheenRoughnessMap,M.sheenRoughnessMapTransform))),x.clearcoat>0&&(M.clearcoat.value=x.clearcoat,M.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(M.clearcoatMap.value=x.clearcoatMap,t(x.clearcoatMap,M.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(M.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,t(x.clearcoatRoughnessMap,M.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(M.clearcoatNormalMap.value=x.clearcoatNormalMap,t(x.clearcoatNormalMap,M.clearcoatNormalMapTransform),M.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===Rn&&M.clearcoatNormalScale.value.negate())),x.dispersion>0&&(M.dispersion.value=x.dispersion),x.iridescence>0&&(M.iridescence.value=x.iridescence,M.iridescenceIOR.value=x.iridescenceIOR,M.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],M.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(M.iridescenceMap.value=x.iridescenceMap,t(x.iridescenceMap,M.iridescenceMapTransform)),x.iridescenceThicknessMap&&(M.iridescenceThicknessMap.value=x.iridescenceThicknessMap,t(x.iridescenceThicknessMap,M.iridescenceThicknessMapTransform))),x.transmission>0&&(M.transmission.value=x.transmission,M.transmissionSamplerMap.value=D.texture,M.transmissionSamplerSize.value.set(D.width,D.height),x.transmissionMap&&(M.transmissionMap.value=x.transmissionMap,t(x.transmissionMap,M.transmissionMapTransform)),M.thickness.value=x.thickness,x.thicknessMap&&(M.thicknessMap.value=x.thicknessMap,t(x.thicknessMap,M.thicknessMapTransform)),M.attenuationDistance.value=x.attenuationDistance,M.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(M.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(M.anisotropyMap.value=x.anisotropyMap,t(x.anisotropyMap,M.anisotropyMapTransform))),M.specularIntensity.value=x.specularIntensity,M.specularColor.value.copy(x.specularColor),x.specularColorMap&&(M.specularColorMap.value=x.specularColorMap,t(x.specularColorMap,M.specularColorMapTransform)),x.specularIntensityMap&&(M.specularIntensityMap.value=x.specularIntensityMap,t(x.specularIntensityMap,M.specularIntensityMapTransform))}function S(M,x){x.matcap&&(M.matcap.value=x.matcap)}function E(M,x){const D=e.get(x).light;M.referencePosition.value.setFromMatrixPosition(D.matrixWorld),M.nearDistance.value=D.shadow.camera.near,M.farDistance.value=D.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function QE(s,e,t,r){let a={},l={},u=[];const f=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function d(D,L){const A=L.program;r.uniformBlockBinding(D,A)}function m(D,L){let A=a[D.id];A===void 0&&(S(D),A=p(D),a[D.id]=A,D.addEventListener("dispose",M));const q=L.program;r.updateUBOMapping(D,q);const N=e.render.frame;l[D.id]!==N&&(v(D),l[D.id]=N)}function p(D){const L=g();D.__bindingPointIndex=L;const A=s.createBuffer(),q=D.__size,N=D.usage;return s.bindBuffer(s.UNIFORM_BUFFER,A),s.bufferData(s.UNIFORM_BUFFER,q,N),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,L,A),A}function g(){for(let D=0;D<f;D++)if(u.indexOf(D)===-1)return u.push(D),D;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function v(D){const L=a[D.id],A=D.uniforms,q=D.__cache;s.bindBuffer(s.UNIFORM_BUFFER,L);for(let N=0,F=A.length;N<F;N++){const V=Array.isArray(A[N])?A[N]:[A[N]];for(let b=0,C=V.length;b<C;b++){const z=V[b];if(y(z,N,b,q)===!0){const ne=z.__offset,K=Array.isArray(z.value)?z.value:[z.value];let ae=0;for(let ue=0;ue<K.length;ue++){const oe=K[ue],ce=E(oe);typeof oe=="number"||typeof oe=="boolean"?(z.__data[0]=oe,s.bufferSubData(s.UNIFORM_BUFFER,ne+ae,z.__data)):oe.isMatrix3?(z.__data[0]=oe.elements[0],z.__data[1]=oe.elements[1],z.__data[2]=oe.elements[2],z.__data[3]=0,z.__data[4]=oe.elements[3],z.__data[5]=oe.elements[4],z.__data[6]=oe.elements[5],z.__data[7]=0,z.__data[8]=oe.elements[6],z.__data[9]=oe.elements[7],z.__data[10]=oe.elements[8],z.__data[11]=0):(oe.toArray(z.__data,ae),ae+=ce.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,ne,z.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function y(D,L,A,q){const N=D.value,F=L+"_"+A;if(q[F]===void 0)return typeof N=="number"||typeof N=="boolean"?q[F]=N:q[F]=N.clone(),!0;{const V=q[F];if(typeof N=="number"||typeof N=="boolean"){if(V!==N)return q[F]=N,!0}else if(V.equals(N)===!1)return V.copy(N),!0}return!1}function S(D){const L=D.uniforms;let A=0;const q=16;for(let F=0,V=L.length;F<V;F++){const b=Array.isArray(L[F])?L[F]:[L[F]];for(let C=0,z=b.length;C<z;C++){const ne=b[C],K=Array.isArray(ne.value)?ne.value:[ne.value];for(let ae=0,ue=K.length;ae<ue;ae++){const oe=K[ae],ce=E(oe),k=A%q,le=k%ce.boundary,se=k+le;A+=le,se!==0&&q-se<ce.storage&&(A+=q-se),ne.__data=new Float32Array(ce.storage/Float32Array.BYTES_PER_ELEMENT),ne.__offset=A,A+=ce.storage}}}const N=A%q;return N>0&&(A+=q-N),D.__size=A,D.__cache={},this}function E(D){const L={boundary:0,storage:0};return typeof D=="number"||typeof D=="boolean"?(L.boundary=4,L.storage=4):D.isVector2?(L.boundary=8,L.storage=8):D.isVector3||D.isColor?(L.boundary=16,L.storage=12):D.isVector4?(L.boundary=16,L.storage=16):D.isMatrix3?(L.boundary=48,L.storage=48):D.isMatrix4?(L.boundary=64,L.storage=64):D.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",D),L}function M(D){const L=D.target;L.removeEventListener("dispose",M);const A=u.indexOf(L.__bindingPointIndex);u.splice(A,1),s.deleteBuffer(a[L.id]),delete a[L.id],delete l[L.id]}function x(){for(const D in a)s.deleteBuffer(a[D]);u=[],a={},l={}}return{bind:d,update:m,dispose:x}}class JE{constructor(e={}){const{canvas:t=H_(),context:r=null,depth:a=!0,stencil:l=!1,alpha:u=!1,antialias:f=!1,premultipliedAlpha:d=!0,preserveDrawingBuffer:m=!1,powerPreference:p="default",failIfMajorPerformanceCaveat:g=!1,reverseDepthBuffer:v=!1}=e;this.isWebGLRenderer=!0;let y;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");y=r.getContextAttributes().alpha}else y=u;const S=new Uint32Array(4),E=new Int32Array(4);let M=null,x=null;const D=[],L=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Yn,this.toneMapping=Nr,this.toneMappingExposure=1;const A=this;let q=!1,N=0,F=0,V=null,b=-1,C=null;const z=new Dt,ne=new Dt;let K=null;const ae=new _t(0);let ue=0,oe=t.width,ce=t.height,k=1,le=null,se=null;const U=new Dt(0,0,oe,ce),ie=new Dt(0,0,oe,ce);let Ie=!1;const Q=new Ch;let fe=!1,Se=!1;const _e=new Ht,Te=new Ht,Ue=new j,Qe=new Dt,Pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pt=!1;function Nt(){return V===null?k:1}let X=r;function Mn(R,G){return t.getContext(R,G)}try{const R={alpha:!0,depth:a,stencil:l,antialias:f,premultipliedAlpha:d,preserveDrawingBuffer:m,powerPreference:p,failIfMajorPerformanceCaveat:g};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Mh}`),t.addEventListener("webglcontextlost",de,!1),t.addEventListener("webglcontextrestored",Le,!1),t.addEventListener("webglcontextcreationerror",Pe,!1),X===null){const G="webgl2";if(X=Mn(G,R),X===null)throw Mn(G)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let dt,ut,$e,Ct,qe,P,T,Z,pe,ge,he,Ge,Re,Ne,ct,ye,Oe,Je,et,ze,ft,rt,Rt,H;function Ce(){dt=new rS(X),dt.init(),rt=new GE(X,dt),ut=new QM(X,dt,e,rt),$e=new BE(X,dt),ut.reverseDepthBuffer&&v&&$e.buffers.depth.setReversed(!0),Ct=new aS(X),qe=new TE,P=new VE(X,dt,$e,qe,ut,rt,Ct),T=new eS(A),Z=new iS(A),pe=new px(X),Rt=new KM(X,pe),ge=new sS(X,pe,Ct,Rt),he=new cS(X,ge,pe,Ct),et=new lS(X,ut,P),ye=new JM(qe),Ge=new wE(A,T,Z,dt,ut,Rt,ye),Re=new ZE(A,qe),Ne=new RE,ct=new IE(dt),Je=new $M(A,T,Z,$e,he,y,d),Oe=new zE(A,he,ut),H=new QE(X,Ct,ut,$e),ze=new ZM(X,dt,Ct),ft=new oS(X,dt,Ct),Ct.programs=Ge.programs,A.capabilities=ut,A.extensions=dt,A.properties=qe,A.renderLists=Ne,A.shadowMap=Oe,A.state=$e,A.info=Ct}Ce();const re=new $E(A,X);this.xr=re,this.getContext=function(){return X},this.getContextAttributes=function(){return X.getContextAttributes()},this.forceContextLoss=function(){const R=dt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=dt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return k},this.setPixelRatio=function(R){R!==void 0&&(k=R,this.setSize(oe,ce,!1))},this.getSize=function(R){return R.set(oe,ce)},this.setSize=function(R,G,ee=!0){if(re.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}oe=R,ce=G,t.width=Math.floor(R*k),t.height=Math.floor(G*k),ee===!0&&(t.style.width=R+"px",t.style.height=G+"px"),this.setViewport(0,0,R,G)},this.getDrawingBufferSize=function(R){return R.set(oe*k,ce*k).floor()},this.setDrawingBufferSize=function(R,G,ee){oe=R,ce=G,k=ee,t.width=Math.floor(R*ee),t.height=Math.floor(G*ee),this.setViewport(0,0,R,G)},this.getCurrentViewport=function(R){return R.copy(z)},this.getViewport=function(R){return R.copy(U)},this.setViewport=function(R,G,ee,te){R.isVector4?U.set(R.x,R.y,R.z,R.w):U.set(R,G,ee,te),$e.viewport(z.copy(U).multiplyScalar(k).round())},this.getScissor=function(R){return R.copy(ie)},this.setScissor=function(R,G,ee,te){R.isVector4?ie.set(R.x,R.y,R.z,R.w):ie.set(R,G,ee,te),$e.scissor(ne.copy(ie).multiplyScalar(k).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(R){$e.setScissorTest(Ie=R)},this.setOpaqueSort=function(R){le=R},this.setTransparentSort=function(R){se=R},this.getClearColor=function(R){return R.copy(Je.getClearColor())},this.setClearColor=function(){Je.setClearColor.apply(Je,arguments)},this.getClearAlpha=function(){return Je.getClearAlpha()},this.setClearAlpha=function(){Je.setClearAlpha.apply(Je,arguments)},this.clear=function(R=!0,G=!0,ee=!0){let te=0;if(R){let W=!1;if(V!==null){const we=V.texture.format;W=we===Rh||we===Ah||we===Th}if(W){const we=V.texture.type,Me=we===nr||we===ps||we===ra||we===lo||we===Eh||we===wh,We=Je.getClearColor(),He=Je.getClearAlpha(),tt=We.r,it=We.g,Xe=We.b;Me?(S[0]=tt,S[1]=it,S[2]=Xe,S[3]=He,X.clearBufferuiv(X.COLOR,0,S)):(E[0]=tt,E[1]=it,E[2]=Xe,E[3]=He,X.clearBufferiv(X.COLOR,0,E))}else te|=X.COLOR_BUFFER_BIT}G&&(te|=X.DEPTH_BUFFER_BIT),ee&&(te|=X.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),X.clear(te)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",de,!1),t.removeEventListener("webglcontextrestored",Le,!1),t.removeEventListener("webglcontextcreationerror",Pe,!1),Ne.dispose(),ct.dispose(),qe.dispose(),T.dispose(),Z.dispose(),he.dispose(),Rt.dispose(),H.dispose(),Ge.dispose(),re.dispose(),re.removeEventListener("sessionstart",gs),re.removeEventListener("sessionend",ir),Fi.stop()};function de(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),q=!0}function Le(){console.log("THREE.WebGLRenderer: Context Restored."),q=!1;const R=Ct.autoReset,G=Oe.enabled,ee=Oe.autoUpdate,te=Oe.needsUpdate,W=Oe.type;Ce(),Ct.autoReset=R,Oe.enabled=G,Oe.autoUpdate=ee,Oe.needsUpdate=te,Oe.type=W}function Pe(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function st(R){const G=R.target;G.removeEventListener("dispose",st),Ot(G)}function Ot(R){Kt(R),qe.remove(R)}function Kt(R){const G=qe.get(R).programs;G!==void 0&&(G.forEach(function(ee){Ge.releaseProgram(ee)}),R.isShaderMaterial&&Ge.releaseShaderCache(R))}this.renderBufferDirect=function(R,G,ee,te,W,we){G===null&&(G=Pt);const Me=W.isMesh&&W.matrixWorld.determinant()<0,We=ha(R,G,ee,te,W);$e.setMaterial(te,Me);let He=ee.index,tt=1;if(te.wireframe===!0){if(He=ge.getWireframeAttribute(ee),He===void 0)return;tt=2}const it=ee.drawRange,Xe=ee.attributes.position;let gt=it.start*tt,Tt=(it.start+it.count)*tt;we!==null&&(gt=Math.max(gt,we.start*tt),Tt=Math.min(Tt,(we.start+we.count)*tt)),He!==null?(gt=Math.max(gt,0),Tt=Math.min(Tt,He.count)):Xe!=null&&(gt=Math.max(gt,0),Tt=Math.min(Tt,Xe.count));const mt=Tt-gt;if(mt<0||mt===1/0)return;Rt.setup(W,te,We,ee,He);let dn,ot=ze;if(He!==null&&(dn=pe.get(He),ot=ft,ot.setIndex(dn)),W.isMesh)te.wireframe===!0?($e.setLineWidth(te.wireframeLinewidth*Nt()),ot.setMode(X.LINES)):ot.setMode(X.TRIANGLES);else if(W.isLine){let Ye=te.linewidth;Ye===void 0&&(Ye=1),$e.setLineWidth(Ye*Nt()),W.isLineSegments?ot.setMode(X.LINES):W.isLineLoop?ot.setMode(X.LINE_LOOP):ot.setMode(X.LINE_STRIP)}else W.isPoints?ot.setMode(X.POINTS):W.isSprite&&ot.setMode(X.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)ot.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(dt.get("WEBGL_multi_draw"))ot.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Ye=W._multiDrawStarts,ai=W._multiDrawCounts,Et=W._multiDrawCount,pn=He?pe.get(He).bytesPerElement:1,li=qe.get(te).currentProgram.getUniforms();for(let Zt=0;Zt<Et;Zt++)li.setValue(X,"_gl_DrawID",Zt),ot.render(Ye[Zt]/pn,ai[Zt])}else if(W.isInstancedMesh)ot.renderInstances(gt,mt,W.count);else if(ee.isInstancedBufferGeometry){const Ye=ee._maxInstanceCount!==void 0?ee._maxInstanceCount:1/0,ai=Math.min(ee.instanceCount,Ye);ot.renderInstances(gt,mt,ai)}else ot.render(gt,mt)};function yt(R,G,ee){R.transparent===!0&&R.side===Li&&R.forceSinglePass===!1?(R.side=Rn,R.needsUpdate=!0,vs(R,G,ee),R.side=Fr,R.needsUpdate=!0,vs(R,G,ee),R.side=Li):vs(R,G,ee)}this.compile=function(R,G,ee=null){ee===null&&(ee=R),x=ct.get(ee),x.init(G),L.push(x),ee.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(x.pushLight(W),W.castShadow&&x.pushShadow(W))}),R!==ee&&R.traverseVisible(function(W){W.isLight&&W.layers.test(G.layers)&&(x.pushLight(W),W.castShadow&&x.pushShadow(W))}),x.setupLights();const te=new Set;return R.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const we=W.material;if(we)if(Array.isArray(we))for(let Me=0;Me<we.length;Me++){const We=we[Me];yt(We,ee,W),te.add(We)}else yt(we,ee,W),te.add(we)}),L.pop(),x=null,te},this.compileAsync=function(R,G,ee=null){const te=this.compile(R,G,ee);return new Promise(W=>{function we(){if(te.forEach(function(Me){qe.get(Me).currentProgram.isReady()&&te.delete(Me)}),te.size===0){W(R);return}setTimeout(we,10)}dt.get("KHR_parallel_shader_compile")!==null?we():setTimeout(we,10)})};let Cn=null;function Sn(R){Cn&&Cn(R)}function gs(){Fi.stop()}function ir(){Fi.start()}const Fi=new Zg;Fi.setAnimationLoop(Sn),typeof self<"u"&&Fi.setContext(self),this.setAnimationLoop=function(R){Cn=R,re.setAnimationLoop(R),R===null?Fi.stop():Fi.start()},re.addEventListener("sessionstart",gs),re.addEventListener("sessionend",ir),this.render=function(R,G){if(G!==void 0&&G.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(q===!0)return;if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),G.parent===null&&G.matrixWorldAutoUpdate===!0&&G.updateMatrixWorld(),re.enabled===!0&&re.isPresenting===!0&&(re.cameraAutoUpdate===!0&&re.updateCamera(G),G=re.getCamera()),R.isScene===!0&&R.onBeforeRender(A,R,G,V),x=ct.get(R,L.length),x.init(G),L.push(x),Te.multiplyMatrices(G.projectionMatrix,G.matrixWorldInverse),Q.setFromProjectionMatrix(Te),Se=this.localClippingEnabled,fe=ye.init(this.clippingPlanes,Se),M=Ne.get(R,D.length),M.init(),D.push(M),re.enabled===!0&&re.isPresenting===!0){const we=A.xr.getDepthSensingMesh();we!==null&&Oi(we,G,-1/0,A.sortObjects)}Oi(R,G,0,A.sortObjects),M.finish(),A.sortObjects===!0&&M.sort(le,se),pt=re.enabled===!1||re.isPresenting===!1||re.hasDepthSensing()===!1,pt&&Je.addToRenderList(M,R),this.info.render.frame++,fe===!0&&ye.beginShadows();const ee=x.state.shadowsArray;Oe.render(ee,R,G),fe===!0&&ye.endShadows(),this.info.autoReset===!0&&this.info.reset();const te=M.opaque,W=M.transmissive;if(x.setupLights(),G.isArrayCamera){const we=G.cameras;if(W.length>0)for(let Me=0,We=we.length;Me<We;Me++){const He=we[Me];kr(te,W,R,He)}pt&&Je.render(R);for(let Me=0,We=we.length;Me<We;Me++){const He=we[Me];zr(M,R,He,He.viewport)}}else W.length>0&&kr(te,W,R,G),pt&&Je.render(R),zr(M,R,G);V!==null&&(P.updateMultisampleRenderTarget(V),P.updateRenderTargetMipmap(V)),R.isScene===!0&&R.onAfterRender(A,R,G),Rt.resetDefaultState(),b=-1,C=null,L.pop(),L.length>0?(x=L[L.length-1],fe===!0&&ye.setGlobalState(A.clippingPlanes,x.state.camera)):x=null,D.pop(),D.length>0?M=D[D.length-1]:M=null};function Oi(R,G,ee,te){if(R.visible===!1)return;if(R.layers.test(G.layers)){if(R.isGroup)ee=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(G);else if(R.isLight)x.pushLight(R),R.castShadow&&x.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||Q.intersectsSprite(R)){te&&Qe.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Te);const Me=he.update(R),We=R.material;We.visible&&M.push(R,Me,We,ee,Qe.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||Q.intersectsObject(R))){const Me=he.update(R),We=R.material;if(te&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Qe.copy(R.boundingSphere.center)):(Me.boundingSphere===null&&Me.computeBoundingSphere(),Qe.copy(Me.boundingSphere.center)),Qe.applyMatrix4(R.matrixWorld).applyMatrix4(Te)),Array.isArray(We)){const He=Me.groups;for(let tt=0,it=He.length;tt<it;tt++){const Xe=He[tt],gt=We[Xe.materialIndex];gt&&gt.visible&&M.push(R,Me,gt,ee,Qe.z,Xe)}}else We.visible&&M.push(R,Me,We,ee,Qe.z,null)}}const we=R.children;for(let Me=0,We=we.length;Me<We;Me++)Oi(we[Me],G,ee,te)}function zr(R,G,ee,te){const W=R.opaque,we=R.transmissive,Me=R.transparent;x.setupLightsView(ee),fe===!0&&ye.setGlobalState(A.clippingPlanes,ee),te&&$e.viewport(z.copy(te)),W.length>0&&rr(W,G,ee),we.length>0&&rr(we,G,ee),Me.length>0&&rr(Me,G,ee),$e.buffers.depth.setTest(!0),$e.buffers.depth.setMask(!0),$e.buffers.color.setMask(!0),$e.setPolygonOffset(!1)}function kr(R,G,ee,te){if((ee.isScene===!0?ee.overrideMaterial:null)!==null)return;x.state.transmissionRenderTarget[te.id]===void 0&&(x.state.transmissionRenderTarget[te.id]=new ms(1,1,{generateMipmaps:!0,type:dt.has("EXT_color_buffer_half_float")||dt.has("EXT_color_buffer_float")?oa:nr,minFilter:hs,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:St.workingColorSpace}));const we=x.state.transmissionRenderTarget[te.id],Me=te.viewport||z;we.setSize(Me.z,Me.w);const We=A.getRenderTarget();A.setRenderTarget(we),A.getClearColor(ae),ue=A.getClearAlpha(),ue<1&&A.setClearColor(16777215,.5),A.clear(),pt&&Je.render(ee);const He=A.toneMapping;A.toneMapping=Nr;const tt=te.viewport;if(te.viewport!==void 0&&(te.viewport=void 0),x.setupLightsView(te),fe===!0&&ye.setGlobalState(A.clippingPlanes,te),rr(R,ee,te),P.updateMultisampleRenderTarget(we),P.updateRenderTargetMipmap(we),dt.has("WEBGL_multisampled_render_to_texture")===!1){let it=!1;for(let Xe=0,gt=G.length;Xe<gt;Xe++){const Tt=G[Xe],mt=Tt.object,dn=Tt.geometry,ot=Tt.material,Ye=Tt.group;if(ot.side===Li&&mt.layers.test(te.layers)){const ai=ot.side;ot.side=Rn,ot.needsUpdate=!0,ua(mt,ee,te,dn,ot,Ye),ot.side=ai,ot.needsUpdate=!0,it=!0}}it===!0&&(P.updateMultisampleRenderTarget(we),P.updateRenderTargetMipmap(we))}A.setRenderTarget(We),A.setClearColor(ae,ue),tt!==void 0&&(te.viewport=tt),A.toneMapping=He}function rr(R,G,ee){const te=G.isScene===!0?G.overrideMaterial:null;for(let W=0,we=R.length;W<we;W++){const Me=R[W],We=Me.object,He=Me.geometry,tt=te===null?Me.material:te,it=Me.group;We.layers.test(ee.layers)&&ua(We,G,ee,He,tt,it)}}function ua(R,G,ee,te,W,we){R.onBeforeRender(A,G,ee,te,W,we),R.modelViewMatrix.multiplyMatrices(ee.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),W.onBeforeRender(A,G,ee,te,R,we),W.transparent===!0&&W.side===Li&&W.forceSinglePass===!1?(W.side=Rn,W.needsUpdate=!0,A.renderBufferDirect(ee,G,te,W,R,we),W.side=Fr,W.needsUpdate=!0,A.renderBufferDirect(ee,G,te,W,R,we),W.side=Li):A.renderBufferDirect(ee,G,te,W,R,we),R.onAfterRender(A,G,ee,te,W,we)}function vs(R,G,ee){G.isScene!==!0&&(G=Pt);const te=qe.get(R),W=x.state.lights,we=x.state.shadowsArray,Me=W.state.version,We=Ge.getParameters(R,W.state,we,G,ee),He=Ge.getProgramCacheKey(We);let tt=te.programs;te.environment=R.isMeshStandardMaterial?G.environment:null,te.fog=G.fog,te.envMap=(R.isMeshStandardMaterial?Z:T).get(R.envMap||te.environment),te.envMapRotation=te.environment!==null&&R.envMap===null?G.environmentRotation:R.envMapRotation,tt===void 0&&(R.addEventListener("dispose",st),tt=new Map,te.programs=tt);let it=tt.get(He);if(it!==void 0){if(te.currentProgram===it&&te.lightsStateVersion===Me)return Si(R,We),it}else We.uniforms=Ge.getUniforms(R),R.onBeforeCompile(We,A),it=Ge.acquireProgram(We,He),tt.set(He,it),te.uniforms=We.uniforms;const Xe=te.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Xe.clippingPlanes=ye.uniform),Si(R,We),te.needsLights=oc(R),te.lightsStateVersion=Me,te.needsLights&&(Xe.ambientLightColor.value=W.state.ambient,Xe.lightProbe.value=W.state.probe,Xe.directionalLights.value=W.state.directional,Xe.directionalLightShadows.value=W.state.directionalShadow,Xe.spotLights.value=W.state.spot,Xe.spotLightShadows.value=W.state.spotShadow,Xe.rectAreaLights.value=W.state.rectArea,Xe.ltc_1.value=W.state.rectAreaLTC1,Xe.ltc_2.value=W.state.rectAreaLTC2,Xe.pointLights.value=W.state.point,Xe.pointLightShadows.value=W.state.pointShadow,Xe.hemisphereLights.value=W.state.hemi,Xe.directionalShadowMap.value=W.state.directionalShadowMap,Xe.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Xe.spotShadowMap.value=W.state.spotShadowMap,Xe.spotLightMatrix.value=W.state.spotLightMatrix,Xe.spotLightMap.value=W.state.spotLightMap,Xe.pointShadowMap.value=W.state.pointShadowMap,Xe.pointShadowMatrix.value=W.state.pointShadowMatrix),te.currentProgram=it,te.uniformsList=null,it}function fa(R){if(R.uniformsList===null){const G=R.currentProgram.getUniforms();R.uniformsList=jl.seqWithValue(G.seq,R.uniforms)}return R.uniformsList}function Si(R,G){const ee=qe.get(R);ee.outputColorSpace=G.outputColorSpace,ee.batching=G.batching,ee.batchingColor=G.batchingColor,ee.instancing=G.instancing,ee.instancingColor=G.instancingColor,ee.instancingMorph=G.instancingMorph,ee.skinning=G.skinning,ee.morphTargets=G.morphTargets,ee.morphNormals=G.morphNormals,ee.morphColors=G.morphColors,ee.morphTargetsCount=G.morphTargetsCount,ee.numClippingPlanes=G.numClippingPlanes,ee.numIntersection=G.numClipIntersection,ee.vertexAlphas=G.vertexAlphas,ee.vertexTangents=G.vertexTangents,ee.toneMapping=G.toneMapping}function ha(R,G,ee,te,W){G.isScene!==!0&&(G=Pt),P.resetTextureUnits();const we=G.fog,Me=te.isMeshStandardMaterial?G.environment:null,We=V===null?A.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:ho,He=(te.isMeshStandardMaterial?Z:T).get(te.envMap||Me),tt=te.vertexColors===!0&&!!ee.attributes.color&&ee.attributes.color.itemSize===4,it=!!ee.attributes.tangent&&(!!te.normalMap||te.anisotropy>0),Xe=!!ee.morphAttributes.position,gt=!!ee.morphAttributes.normal,Tt=!!ee.morphAttributes.color;let mt=Nr;te.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(mt=A.toneMapping);const dn=ee.morphAttributes.position||ee.morphAttributes.normal||ee.morphAttributes.color,ot=dn!==void 0?dn.length:0,Ye=qe.get(te),ai=x.state.lights;if(fe===!0&&(Se===!0||R!==C)){const En=R===C&&te.id===b;ye.setState(te,R,En)}let Et=!1;te.version===Ye.__version?(Ye.needsLights&&Ye.lightsStateVersion!==ai.state.version||Ye.outputColorSpace!==We||W.isBatchedMesh&&Ye.batching===!1||!W.isBatchedMesh&&Ye.batching===!0||W.isBatchedMesh&&Ye.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Ye.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Ye.instancing===!1||!W.isInstancedMesh&&Ye.instancing===!0||W.isSkinnedMesh&&Ye.skinning===!1||!W.isSkinnedMesh&&Ye.skinning===!0||W.isInstancedMesh&&Ye.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Ye.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Ye.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Ye.instancingMorph===!1&&W.morphTexture!==null||Ye.envMap!==He||te.fog===!0&&Ye.fog!==we||Ye.numClippingPlanes!==void 0&&(Ye.numClippingPlanes!==ye.numPlanes||Ye.numIntersection!==ye.numIntersection)||Ye.vertexAlphas!==tt||Ye.vertexTangents!==it||Ye.morphTargets!==Xe||Ye.morphNormals!==gt||Ye.morphColors!==Tt||Ye.toneMapping!==mt||Ye.morphTargetsCount!==ot)&&(Et=!0):(Et=!0,Ye.__version=te.version);let pn=Ye.currentProgram;Et===!0&&(pn=vs(te,G,W));let li=!1,Zt=!1,Ei=!1;const It=pn.getUniforms(),Zn=Ye.uniforms;if($e.useProgram(pn.program)&&(li=!0,Zt=!0,Ei=!0),te.id!==b&&(b=te.id,Zt=!0),li||C!==R){$e.buffers.depth.getReversed()?(_e.copy(R.projectionMatrix),G_(_e),W_(_e),It.setValue(X,"projectionMatrix",_e)):It.setValue(X,"projectionMatrix",R.projectionMatrix),It.setValue(X,"viewMatrix",R.matrixWorldInverse);const Qn=It.map.cameraPosition;Qn!==void 0&&Qn.setValue(X,Ue.setFromMatrixPosition(R.matrixWorld)),ut.logarithmicDepthBuffer&&It.setValue(X,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(te.isMeshPhongMaterial||te.isMeshToonMaterial||te.isMeshLambertMaterial||te.isMeshBasicMaterial||te.isMeshStandardMaterial||te.isShaderMaterial)&&It.setValue(X,"isOrthographic",R.isOrthographicCamera===!0),C!==R&&(C=R,Zt=!0,Ei=!0)}if(W.isSkinnedMesh){It.setOptional(X,W,"bindMatrix"),It.setOptional(X,W,"bindMatrixInverse");const En=W.skeleton;En&&(En.boneTexture===null&&En.computeBoneTexture(),It.setValue(X,"boneTexture",En.boneTexture,P))}W.isBatchedMesh&&(It.setOptional(X,W,"batchingTexture"),It.setValue(X,"batchingTexture",W._matricesTexture,P),It.setOptional(X,W,"batchingIdTexture"),It.setValue(X,"batchingIdTexture",W._indirectTexture,P),It.setOptional(X,W,"batchingColorTexture"),W._colorsTexture!==null&&It.setValue(X,"batchingColorTexture",W._colorsTexture,P));const zi=ee.morphAttributes;if((zi.position!==void 0||zi.normal!==void 0||zi.color!==void 0)&&et.update(W,ee,pn),(Zt||Ye.receiveShadow!==W.receiveShadow)&&(Ye.receiveShadow=W.receiveShadow,It.setValue(X,"receiveShadow",W.receiveShadow)),te.isMeshGouraudMaterial&&te.envMap!==null&&(Zn.envMap.value=He,Zn.flipEnvMap.value=He.isCubeTexture&&He.isRenderTargetTexture===!1?-1:1),te.isMeshStandardMaterial&&te.envMap===null&&G.environment!==null&&(Zn.envMapIntensity.value=G.environmentIntensity),Zt&&(It.setValue(X,"toneMappingExposure",A.toneMappingExposure),Ye.needsLights&&da(Zn,Ei),we&&te.fog===!0&&Re.refreshFogUniforms(Zn,we),Re.refreshMaterialUniforms(Zn,te,k,ce,x.state.transmissionRenderTarget[R.id]),jl.upload(X,fa(Ye),Zn,P)),te.isShaderMaterial&&te.uniformsNeedUpdate===!0&&(jl.upload(X,fa(Ye),Zn,P),te.uniformsNeedUpdate=!1),te.isSpriteMaterial&&It.setValue(X,"center",W.center),It.setValue(X,"modelViewMatrix",W.modelViewMatrix),It.setValue(X,"normalMatrix",W.normalMatrix),It.setValue(X,"modelMatrix",W.matrixWorld),te.isShaderMaterial||te.isRawShaderMaterial){const En=te.uniformsGroups;for(let Qn=0,bn=En.length;Qn<bn;Qn++){const pa=En[Qn];H.update(pa,pn),H.bind(pa,pn)}}return pn}function da(R,G){R.ambientLightColor.needsUpdate=G,R.lightProbe.needsUpdate=G,R.directionalLights.needsUpdate=G,R.directionalLightShadows.needsUpdate=G,R.pointLights.needsUpdate=G,R.pointLightShadows.needsUpdate=G,R.spotLights.needsUpdate=G,R.spotLightShadows.needsUpdate=G,R.rectAreaLights.needsUpdate=G,R.hemisphereLights.needsUpdate=G}function oc(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return F},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(R,G,ee){qe.get(R.texture).__webglTexture=G,qe.get(R.depthTexture).__webglTexture=ee;const te=qe.get(R);te.__hasExternalTextures=!0,te.__autoAllocateDepthBuffer=ee===void 0,te.__autoAllocateDepthBuffer||dt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),te.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(R,G){const ee=qe.get(R);ee.__webglFramebuffer=G,ee.__useDefaultFramebuffer=G===void 0},this.setRenderTarget=function(R,G=0,ee=0){V=R,N=G,F=ee;let te=!0,W=null,we=!1,Me=!1;if(R){const He=qe.get(R);if(He.__useDefaultFramebuffer!==void 0)$e.bindFramebuffer(X.FRAMEBUFFER,null),te=!1;else if(He.__webglFramebuffer===void 0)P.setupRenderTarget(R);else if(He.__hasExternalTextures)P.rebindTextures(R,qe.get(R.texture).__webglTexture,qe.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){const Xe=R.depthTexture;if(He.__boundDepthTexture!==Xe){if(Xe!==null&&qe.has(Xe)&&(R.width!==Xe.image.width||R.height!==Xe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(R)}}const tt=R.texture;(tt.isData3DTexture||tt.isDataArrayTexture||tt.isCompressedArrayTexture)&&(Me=!0);const it=qe.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(it[G])?W=it[G][ee]:W=it[G],we=!0):R.samples>0&&P.useMultisampledRTT(R)===!1?W=qe.get(R).__webglMultisampledFramebuffer:Array.isArray(it)?W=it[ee]:W=it,z.copy(R.viewport),ne.copy(R.scissor),K=R.scissorTest}else z.copy(U).multiplyScalar(k).floor(),ne.copy(ie).multiplyScalar(k).floor(),K=Ie;if($e.bindFramebuffer(X.FRAMEBUFFER,W)&&te&&$e.drawBuffers(R,W),$e.viewport(z),$e.scissor(ne),$e.setScissorTest(K),we){const He=qe.get(R.texture);X.framebufferTexture2D(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,X.TEXTURE_CUBE_MAP_POSITIVE_X+G,He.__webglTexture,ee)}else if(Me){const He=qe.get(R.texture),tt=G||0;X.framebufferTextureLayer(X.FRAMEBUFFER,X.COLOR_ATTACHMENT0,He.__webglTexture,ee||0,tt)}b=-1},this.readRenderTargetPixels=function(R,G,ee,te,W,we,Me){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let We=qe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Me!==void 0&&(We=We[Me]),We){$e.bindFramebuffer(X.FRAMEBUFFER,We);try{const He=R.texture,tt=He.format,it=He.type;if(!ut.textureFormatReadable(tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ut.textureTypeReadable(it)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}G>=0&&G<=R.width-te&&ee>=0&&ee<=R.height-W&&X.readPixels(G,ee,te,W,rt.convert(tt),rt.convert(it),we)}finally{const He=V!==null?qe.get(V).__webglFramebuffer:null;$e.bindFramebuffer(X.FRAMEBUFFER,He)}}},this.readRenderTargetPixelsAsync=async function(R,G,ee,te,W,we,Me){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let We=qe.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Me!==void 0&&(We=We[Me]),We){const He=R.texture,tt=He.format,it=He.type;if(!ut.textureFormatReadable(tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ut.textureTypeReadable(it))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(G>=0&&G<=R.width-te&&ee>=0&&ee<=R.height-W){$e.bindFramebuffer(X.FRAMEBUFFER,We);const Xe=X.createBuffer();X.bindBuffer(X.PIXEL_PACK_BUFFER,Xe),X.bufferData(X.PIXEL_PACK_BUFFER,we.byteLength,X.STREAM_READ),X.readPixels(G,ee,te,W,rt.convert(tt),rt.convert(it),0);const gt=V!==null?qe.get(V).__webglFramebuffer:null;$e.bindFramebuffer(X.FRAMEBUFFER,gt);const Tt=X.fenceSync(X.SYNC_GPU_COMMANDS_COMPLETE,0);return X.flush(),await V_(X,Tt,4),X.bindBuffer(X.PIXEL_PACK_BUFFER,Xe),X.getBufferSubData(X.PIXEL_PACK_BUFFER,0,we),X.deleteBuffer(Xe),X.deleteSync(Tt),we}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(R,G=null,ee=0){R.isTexture!==!0&&(na("WebGLRenderer: copyFramebufferToTexture function signature has changed."),G=arguments[0]||null,R=arguments[1]);const te=Math.pow(2,-ee),W=Math.floor(R.image.width*te),we=Math.floor(R.image.height*te),Me=G!==null?G.x:0,We=G!==null?G.y:0;P.setTexture2D(R,0),X.copyTexSubImage2D(X.TEXTURE_2D,ee,0,0,Me,We,W,we),$e.unbindTexture()},this.copyTextureToTexture=function(R,G,ee=null,te=null,W=0){R.isTexture!==!0&&(na("WebGLRenderer: copyTextureToTexture function signature has changed."),te=arguments[0]||null,R=arguments[1],G=arguments[2],W=arguments[3]||0,ee=null);let we,Me,We,He,tt,it,Xe,gt,Tt;const mt=R.isCompressedTexture?R.mipmaps[W]:R.image;ee!==null?(we=ee.max.x-ee.min.x,Me=ee.max.y-ee.min.y,We=ee.isBox3?ee.max.z-ee.min.z:1,He=ee.min.x,tt=ee.min.y,it=ee.isBox3?ee.min.z:0):(we=mt.width,Me=mt.height,We=mt.depth||1,He=0,tt=0,it=0),te!==null?(Xe=te.x,gt=te.y,Tt=te.z):(Xe=0,gt=0,Tt=0);const dn=rt.convert(G.format),ot=rt.convert(G.type);let Ye;G.isData3DTexture?(P.setTexture3D(G,0),Ye=X.TEXTURE_3D):G.isDataArrayTexture||G.isCompressedArrayTexture?(P.setTexture2DArray(G,0),Ye=X.TEXTURE_2D_ARRAY):(P.setTexture2D(G,0),Ye=X.TEXTURE_2D),X.pixelStorei(X.UNPACK_FLIP_Y_WEBGL,G.flipY),X.pixelStorei(X.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),X.pixelStorei(X.UNPACK_ALIGNMENT,G.unpackAlignment);const ai=X.getParameter(X.UNPACK_ROW_LENGTH),Et=X.getParameter(X.UNPACK_IMAGE_HEIGHT),pn=X.getParameter(X.UNPACK_SKIP_PIXELS),li=X.getParameter(X.UNPACK_SKIP_ROWS),Zt=X.getParameter(X.UNPACK_SKIP_IMAGES);X.pixelStorei(X.UNPACK_ROW_LENGTH,mt.width),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,mt.height),X.pixelStorei(X.UNPACK_SKIP_PIXELS,He),X.pixelStorei(X.UNPACK_SKIP_ROWS,tt),X.pixelStorei(X.UNPACK_SKIP_IMAGES,it);const Ei=R.isDataArrayTexture||R.isData3DTexture,It=G.isDataArrayTexture||G.isData3DTexture;if(R.isRenderTargetTexture||R.isDepthTexture){const Zn=qe.get(R),zi=qe.get(G),En=qe.get(Zn.__renderTarget),Qn=qe.get(zi.__renderTarget);$e.bindFramebuffer(X.READ_FRAMEBUFFER,En.__webglFramebuffer),$e.bindFramebuffer(X.DRAW_FRAMEBUFFER,Qn.__webglFramebuffer);for(let bn=0;bn<We;bn++)Ei&&X.framebufferTextureLayer(X.READ_FRAMEBUFFER,X.COLOR_ATTACHMENT0,qe.get(R).__webglTexture,W,it+bn),R.isDepthTexture?(It&&X.framebufferTextureLayer(X.DRAW_FRAMEBUFFER,X.COLOR_ATTACHMENT0,qe.get(G).__webglTexture,W,Tt+bn),X.blitFramebuffer(He,tt,we,Me,Xe,gt,we,Me,X.DEPTH_BUFFER_BIT,X.NEAREST)):It?X.copyTexSubImage3D(Ye,W,Xe,gt,Tt+bn,He,tt,we,Me):X.copyTexSubImage2D(Ye,W,Xe,gt,Tt+bn,He,tt,we,Me);$e.bindFramebuffer(X.READ_FRAMEBUFFER,null),$e.bindFramebuffer(X.DRAW_FRAMEBUFFER,null)}else It?R.isDataTexture||R.isData3DTexture?X.texSubImage3D(Ye,W,Xe,gt,Tt,we,Me,We,dn,ot,mt.data):G.isCompressedArrayTexture?X.compressedTexSubImage3D(Ye,W,Xe,gt,Tt,we,Me,We,dn,mt.data):X.texSubImage3D(Ye,W,Xe,gt,Tt,we,Me,We,dn,ot,mt):R.isDataTexture?X.texSubImage2D(X.TEXTURE_2D,W,Xe,gt,we,Me,dn,ot,mt.data):R.isCompressedTexture?X.compressedTexSubImage2D(X.TEXTURE_2D,W,Xe,gt,mt.width,mt.height,dn,mt.data):X.texSubImage2D(X.TEXTURE_2D,W,Xe,gt,we,Me,dn,ot,mt);X.pixelStorei(X.UNPACK_ROW_LENGTH,ai),X.pixelStorei(X.UNPACK_IMAGE_HEIGHT,Et),X.pixelStorei(X.UNPACK_SKIP_PIXELS,pn),X.pixelStorei(X.UNPACK_SKIP_ROWS,li),X.pixelStorei(X.UNPACK_SKIP_IMAGES,Zt),W===0&&G.generateMipmaps&&X.generateMipmap(Ye),$e.unbindTexture()},this.copyTextureToTexture3D=function(R,G,ee=null,te=null,W=0){return R.isTexture!==!0&&(na("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ee=arguments[0]||null,te=arguments[1]||null,R=arguments[2],G=arguments[3],W=arguments[4]||0),na('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(R,G,ee,te,W)},this.initRenderTarget=function(R){qe.get(R).__webglFramebuffer===void 0&&P.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?P.setTextureCube(R,0):R.isData3DTexture?P.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?P.setTexture2DArray(R,0):P.setTexture2D(R,0),$e.unbindTexture()},this.resetState=function(){N=0,F=0,V=null,$e.reset(),Rt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return er}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=St._getDrawingBufferColorSpace(e),t.unpackColorSpace=St._getUnpackColorSpace()}}class Ph{constructor(e,t=1,r=1e3){this.isFog=!0,this.name="",this.color=new _t(e),this.near=t,this.far=r}clone(){return new Ph(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class e1 extends nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ni,this.environmentIntensity=1,this.environmentRotation=new Ni,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class r0 extends mo{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new _t(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Kl=new j,Zl=new j,lg=new Ht,ea=new Gg,Ol=new tc,yf=new j,cg=new j;class t1 extends nn{constructor(e=new Kn,t=new r0){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,r=[0];for(let a=1,l=t.count;a<l;a++)Kl.fromBufferAttribute(t,a-1),Zl.fromBufferAttribute(t,a),r[a]=r[a-1],r[a]+=Kl.distanceTo(Zl);e.setAttribute("lineDistance",new $t(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const r=this.geometry,a=this.matrixWorld,l=e.params.Line.threshold,u=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Ol.copy(r.boundingSphere),Ol.applyMatrix4(a),Ol.radius+=l,e.ray.intersectsSphere(Ol)===!1)return;lg.copy(a).invert(),ea.copy(e.ray).applyMatrix4(lg);const f=l/((this.scale.x+this.scale.y+this.scale.z)/3),d=f*f,m=this.isLineSegments?2:1,p=r.index,v=r.attributes.position;if(p!==null){const y=Math.max(0,u.start),S=Math.min(p.count,u.start+u.count);for(let E=y,M=S-1;E<M;E+=m){const x=p.getX(E),D=p.getX(E+1),L=zl(this,e,ea,d,x,D);L&&t.push(L)}if(this.isLineLoop){const E=p.getX(S-1),M=p.getX(y),x=zl(this,e,ea,d,E,M);x&&t.push(x)}}else{const y=Math.max(0,u.start),S=Math.min(v.count,u.start+u.count);for(let E=y,M=S-1;E<M;E+=m){const x=zl(this,e,ea,d,E,E+1);x&&t.push(x)}if(this.isLineLoop){const E=zl(this,e,ea,d,S-1,y);E&&t.push(E)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,u=a.length;l<u;l++){const f=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}}function zl(s,e,t,r,a,l){const u=s.geometry.attributes.position;if(Kl.fromBufferAttribute(u,a),Zl.fromBufferAttribute(u,l),t.distanceSqToSegment(Kl,Zl,yf,cg)>r)return;yf.applyMatrix4(s.matrixWorld);const d=e.ray.origin.distanceTo(yf);if(!(d<e.near||d>e.far))return{distance:d,point:cg.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}class rc extends Kn{constructor(e=1,t=32,r=0,a=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:r,thetaLength:a},t=Math.max(3,t);const l=[],u=[],f=[],d=[],m=new j,p=new xt;u.push(0,0,0),f.push(0,0,1),d.push(.5,.5);for(let g=0,v=3;g<=t;g++,v+=3){const y=r+g/t*a;m.x=e*Math.cos(y),m.y=e*Math.sin(y),u.push(m.x,m.y,m.z),f.push(0,0,1),p.x=(u[v]/e+1)/2,p.y=(u[v+1]/e+1)/2,d.push(p.x,p.y)}for(let g=1;g<=t;g++)l.push(g,g+1,0);this.setIndex(l),this.setAttribute("position",new $t(u,3)),this.setAttribute("normal",new $t(f,3)),this.setAttribute("uv",new $t(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rc(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Lh extends Kn{constructor(e=1,t=1,r=1,a=32,l=1,u=!1,f=0,d=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:r,radialSegments:a,heightSegments:l,openEnded:u,thetaStart:f,thetaLength:d};const m=this;a=Math.floor(a),l=Math.floor(l);const p=[],g=[],v=[],y=[];let S=0;const E=[],M=r/2;let x=0;D(),u===!1&&(e>0&&L(!0),t>0&&L(!1)),this.setIndex(p),this.setAttribute("position",new $t(g,3)),this.setAttribute("normal",new $t(v,3)),this.setAttribute("uv",new $t(y,2));function D(){const A=new j,q=new j;let N=0;const F=(t-e)/r;for(let V=0;V<=l;V++){const b=[],C=V/l,z=C*(t-e)+e;for(let ne=0;ne<=a;ne++){const K=ne/a,ae=K*d+f,ue=Math.sin(ae),oe=Math.cos(ae);q.x=z*ue,q.y=-C*r+M,q.z=z*oe,g.push(q.x,q.y,q.z),A.set(ue,F,oe).normalize(),v.push(A.x,A.y,A.z),y.push(K,1-C),b.push(S++)}E.push(b)}for(let V=0;V<a;V++)for(let b=0;b<l;b++){const C=E[b][V],z=E[b+1][V],ne=E[b+1][V+1],K=E[b][V+1];(e>0||b!==0)&&(p.push(C,z,K),N+=3),(t>0||b!==l-1)&&(p.push(z,ne,K),N+=3)}m.addGroup(x,N,0),x+=N}function L(A){const q=S,N=new xt,F=new j;let V=0;const b=A===!0?e:t,C=A===!0?1:-1;for(let ne=1;ne<=a;ne++)g.push(0,M*C,0),v.push(0,C,0),y.push(.5,.5),S++;const z=S;for(let ne=0;ne<=a;ne++){const ae=ne/a*d+f,ue=Math.cos(ae),oe=Math.sin(ae);F.x=b*oe,F.y=M*C,F.z=b*ue,g.push(F.x,F.y,F.z),v.push(0,C,0),N.x=ue*.5+.5,N.y=oe*.5*C+.5,y.push(N.x,N.y),S++}for(let ne=0;ne<a;ne++){const K=q+ne,ae=z+ne;A===!0?p.push(ae,ae+1,K):p.push(ae+1,ae,K),V+=3}m.addGroup(x,V,A===!0?1:2),x+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Lh(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Dh extends Kn{constructor(e=.5,t=1,r=32,a=1,l=0,u=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:r,phiSegments:a,thetaStart:l,thetaLength:u},r=Math.max(3,r),a=Math.max(1,a);const f=[],d=[],m=[],p=[];let g=e;const v=(t-e)/a,y=new j,S=new xt;for(let E=0;E<=a;E++){for(let M=0;M<=r;M++){const x=l+M/r*u;y.x=g*Math.cos(x),y.y=g*Math.sin(x),d.push(y.x,y.y,y.z),m.push(0,0,1),S.x=(y.x/t+1)/2,S.y=(y.y/t+1)/2,p.push(S.x,S.y)}g+=v}for(let E=0;E<a;E++){const M=E*(r+1);for(let x=0;x<r;x++){const D=x+M,L=D,A=D+r+1,q=D+r+2,N=D+1;f.push(L,A,N),f.push(A,q,N)}}this.setIndex(f),this.setAttribute("position",new $t(d,3)),this.setAttribute("normal",new $t(m,3)),this.setAttribute("uv",new $t(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dh(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class fo extends Kn{constructor(e=1,t=32,r=16,a=0,l=Math.PI*2,u=0,f=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:r,phiStart:a,phiLength:l,thetaStart:u,thetaLength:f},t=Math.max(3,Math.floor(t)),r=Math.max(2,Math.floor(r));const d=Math.min(u+f,Math.PI);let m=0;const p=[],g=new j,v=new j,y=[],S=[],E=[],M=[];for(let x=0;x<=r;x++){const D=[],L=x/r;let A=0;x===0&&u===0?A=.5/t:x===r&&d===Math.PI&&(A=-.5/t);for(let q=0;q<=t;q++){const N=q/t;g.x=-e*Math.cos(a+N*l)*Math.sin(u+L*f),g.y=e*Math.cos(u+L*f),g.z=e*Math.sin(a+N*l)*Math.sin(u+L*f),S.push(g.x,g.y,g.z),v.copy(g).normalize(),E.push(v.x,v.y,v.z),M.push(N+A,1-L),D.push(m++)}p.push(D)}for(let x=0;x<r;x++)for(let D=0;D<t;D++){const L=p[x][D+1],A=p[x][D],q=p[x+1][D],N=p[x+1][D+1];(x!==0||u>0)&&y.push(L,A,N),(x!==r-1||d<Math.PI)&&y.push(A,q,N)}this.setIndex(y),this.setAttribute("position",new $t(S,3)),this.setAttribute("normal",new $t(E,3)),this.setAttribute("uv",new $t(M,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class vt extends mo{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new _t(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new _t(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zg,this.normalScale=new xt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ni,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class sc extends nn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new _t(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class n1 extends sc{constructor(e,t,r){super(e,r),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new _t(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Mf=new Ht,ug=new j,fg=new j;class s0{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new xt(512,512),this.map=null,this.mapPass=null,this.matrix=new Ht,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ch,this._frameExtents=new xt(1,1),this._viewportCount=1,this._viewports=[new Dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,r=this.matrix;ug.setFromMatrixPosition(e.matrixWorld),t.position.copy(ug),fg.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(fg),t.updateMatrixWorld(),Mf.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Mf),r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(Mf)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const hg=new Ht,ta=new j,Sf=new j;class i1 extends s0{constructor(){super(new qn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new xt(4,2),this._viewportCount=6,this._viewports=[new Dt(2,1,1,1),new Dt(0,1,1,1),new Dt(3,1,1,1),new Dt(1,1,1,1),new Dt(3,0,1,1),new Dt(1,0,1,1)],this._cubeDirections=[new j(1,0,0),new j(-1,0,0),new j(0,0,1),new j(0,0,-1),new j(0,1,0),new j(0,-1,0)],this._cubeUps=[new j(0,1,0),new j(0,1,0),new j(0,1,0),new j(0,1,0),new j(0,0,1),new j(0,0,-1)]}updateMatrices(e,t=0){const r=this.camera,a=this.matrix,l=e.distance||r.far;l!==r.far&&(r.far=l,r.updateProjectionMatrix()),ta.setFromMatrixPosition(e.matrixWorld),r.position.copy(ta),Sf.copy(r.position),Sf.add(this._cubeDirections[t]),r.up.copy(this._cubeUps[t]),r.lookAt(Sf),r.updateMatrixWorld(),a.makeTranslation(-ta.x,-ta.y,-ta.z),hg.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hg)}}class dg extends sc{constructor(e,t,r=0,a=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=r,this.decay=a,this.shadow=new i1}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class r1 extends s0{constructor(){super(new Qg(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class s1 extends sc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(nn.DEFAULT_UP),this.updateMatrix(),this.target=new nn,this.shadow=new r1}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class o1 extends sc{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Mh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Mh);const bi={ak47:{id:"ak47",name:"AK-47",slot:"primary",damage:36,headMul:2,chestMul:1,stomachMul:.9,armMul:.75,legMul:.7,armorPen:.77,rpm:600,magSize:30,reserve:90,reloadTime:2.4,spread:.012,moveSpread:.045,recoilPitch:.042,recoilYaw:.018,recoilKick:1.35,range:120,isAuto:!0,isSniper:!1,melee:!1,meleeRange:0,color:3814184},m4a4:{id:"m4a4",name:"M4A4",slot:"primary",damage:31,headMul:2,chestMul:1,stomachMul:.9,armMul:.75,legMul:.7,armorPen:.7,rpm:666,magSize:30,reserve:90,reloadTime:3.1,spread:.008,moveSpread:.03,recoilPitch:.022,recoilYaw:.008,recoilKick:.72,range:120,isAuto:!0,isSniper:!1,melee:!1,meleeRange:0,color:2764328},awp:{id:"awp",name:"AWP",slot:"primary",damage:115,headMul:2,chestMul:1,stomachMul:1,armMul:.85,legMul:.75,armorPen:.97,rpm:41,magSize:10,reserve:30,reloadTime:3.7,spread:.002,moveSpread:.08,recoilPitch:.08,recoilYaw:.01,recoilKick:2.2,range:200,isAuto:!1,isSniper:!0,melee:!1,meleeRange:0,color:1713184},glock:{id:"glock",name:"Glock-18",slot:"secondary",damage:26,headMul:2,chestMul:1,stomachMul:.9,armMul:.7,legMul:.65,armorPen:.47,rpm:400,magSize:20,reserve:120,reloadTime:2.2,spread:.018,moveSpread:.04,recoilPitch:.02,recoilYaw:.01,recoilKick:.55,range:70,isAuto:!1,isSniper:!1,melee:!1,meleeRange:0,color:4868680},usp:{id:"usp",name:"USP-S",slot:"secondary",damage:33,headMul:2,chestMul:1,stomachMul:.9,armMul:.7,legMul:.65,armorPen:.5,rpm:352,magSize:12,reserve:24,reloadTime:2.2,spread:.012,moveSpread:.035,recoilPitch:.016,recoilYaw:.008,recoilKick:.48,range:75,isAuto:!1,isSniper:!1,melee:!1,meleeRange:0,color:3817026},deagle:{id:"deagle",name:"Desert Eagle",slot:"secondary",damage:53,headMul:2,chestMul:1,stomachMul:.95,armMul:.8,legMul:.7,armorPen:.93,rpm:267,magSize:7,reserve:35,reloadTime:2.2,spread:.02,moveSpread:.07,recoilPitch:.055,recoilYaw:.02,recoilKick:1.6,range:90,isAuto:!1,isSniper:!1,melee:!1,meleeRange:0,color:6969904},knife:{id:"knife",name:"Knife",slot:"melee",damage:55,headMul:1.2,chestMul:1,stomachMul:1,armMul:.8,legMul:.7,armorPen:.85,rpm:120,magSize:1,reserve:0,reloadTime:0,spread:0,moveSpread:0,recoilPitch:0,recoilYaw:0,recoilKick:.2,range:2.1,isAuto:!1,isSniper:!1,melee:!0,meleeRange:2.1,color:8949913}};function kl(s){const e=bi[s];return{id:s,mag:e.magSize,reserve:e.reserve,nextFire:0,reloading:!1,reloadEnd:0}}function a1(s,e){switch(e){case"head":return s.headMul;case"chest":return s.chestMul;case"stomach":return s.stomachMul;case"arm":return s.armMul;case"leg":return s.legMul}}function l1(s,e,t,r,a){if(s<=0)return{hp:0,armorLost:0};if(e==="head"){if(!r)return{hp:s,armorLost:0};const d=s*(1-a)*.55;return{hp:Math.max(1,s-d),armorLost:Math.min(t,15)}}if(e==="leg")return{hp:s,armorLost:0};if(t<=0)return{hp:s,armorLost:0};const l=(1-a)*.5+.15,u=s*l,f=Math.min(t,u*.6);return{hp:Math.max(1,s-u),armorLost:f}}class c1{constructor(){ke(this,"ctx",null);ke(this,"master",null);ke(this,"noise",null);ke(this,"lastStep",0)}resume(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.28,this.master.connect(this.ctx.destination),this.noise=this.makeNoise(1)}this.ctx.resume()}makeNoise(e){const t=this.ctx,r=t.createBuffer(1,t.sampleRate*e,t.sampleRate),a=r.getChannelData(0);for(let l=0;l<a.length;l++)a[l]=Math.random()*2-1;return r}envGain(e,t,r=.004){const a=this.ctx,l=a.createGain(),u=a.currentTime;return l.gain.setValueAtTime(1e-4,u),l.gain.exponentialRampToValueAtTime(t,u+r),l.gain.exponentialRampToValueAtTime(1e-4,u+e),l.connect(this.master),l}tone(e,t,r,a="square"){if(!this.ctx)return;const l=this.ctx.createOscillator();l.type=a,l.frequency.value=e,l.connect(this.envGain(t,r)),l.start(),l.stop(this.ctx.currentTime+t+.02)}noiseBurst(e,t,r,a){if(!this.ctx||!this.noise)return;const l=this.ctx.createBufferSource();l.buffer=this.noise;const u=this.ctx.createBiquadFilter();u.type="bandpass",u.frequency.value=r,u.Q.value=a,l.connect(u),u.connect(this.envGain(e,t,.002)),l.start(),l.stop(this.ctx.currentTime+e+.02)}gun(e){switch(this.resume(),e){case"ak47":this.noiseBurst(.12,.9,420,.7),this.noiseBurst(.08,.5,1800,1.2),this.tone(90,.09,.35,"sawtooth");break;case"m4a4":this.noiseBurst(.08,.7,900,1.1),this.noiseBurst(.06,.4,2400,1.4),this.tone(140,.05,.22,"square");break;case"awp":this.noiseBurst(.28,1,180,.5),this.noiseBurst(.18,.7,700,.8),this.tone(55,.22,.55,"sawtooth"),this.tone(220,.08,.2,"triangle");break;case"deagle":this.noiseBurst(.16,.85,280,.6),this.tone(70,.12,.4,"sawtooth"),this.noiseBurst(.08,.4,1600,1);break;case"glock":this.noiseBurst(.07,.55,1100,1.3),this.tone(180,.05,.18,"square");break;case"usp":this.noiseBurst(.06,.42,1300,1.5),this.tone(210,.04,.14,"triangle");break;case"knife":this.noiseBurst(.08,.3,3200,2),this.tone(600,.06,.12,"sawtooth");break;default:this.noiseBurst(.08,.5,800,1)}}empty(){this.resume(),this.tone(220,.04,.12,"square")}reload(){this.resume(),this.tone(180,.05,.12,"square"),window.setTimeout(()=>this.tone(140,.08,.1,"square"),180),window.setTimeout(()=>{this.tone(260,.05,.14,"square"),this.noiseBurst(.06,.15,2e3,2)},520)}footstep(e){this.resume();const t=performance.now(),r=e>4?340:480;t-this.lastStep<r||(this.lastStep=t,this.noiseBurst(.05,.18,180,.8),this.tone(70+Math.random()*20,.04,.08,"sine"))}hit(e){this.resume(),e?(this.tone(880,.07,.22,"square"),this.noiseBurst(.05,.2,2500,2)):(this.noiseBurst(.05,.22,400,1),this.tone(160,.04,.12,"sine"))}kill(){this.resume(),this.tone(660,.08,.2,"square"),window.setTimeout(()=>this.tone(990,.1,.22,"square"),70)}hurt(){this.resume(),this.noiseBurst(.1,.25,300,.7),this.tone(90,.1,.2,"sawtooth")}scope(){this.resume(),this.tone(420,.05,.1,"sine"),this.noiseBurst(.06,.12,1800,2)}plant(){this.resume(),this.noiseBurst(.15,.25,500,1),this.tone(240,.12,.15,"square")}defuse(){this.resume(),this.tone(300,.1,.12,"square"),this.noiseBurst(.12,.2,900,1.2)}beep(e){this.resume(),this.tone(e?880:620,.05,e?.22:.14,"square")}explode(){this.resume(),this.noiseBurst(.6,1,80,.4),this.noiseBurst(.4,.7,220,.6),this.tone(40,.5,.6,"sawtooth")}pickup(){this.resume(),this.tone(520,.06,.12,"triangle")}round(){this.resume(),this.tone(330,.12,.16,"square"),window.setTimeout(()=>this.tone(440,.16,.18,"square"),120)}}class u1{constructor(){ke(this,"keys",new Set);ke(this,"mx",0);ke(this,"my",0);ke(this,"fireDown",!1);ke(this,"firePressed",!1);ke(this,"altDown",!1);ke(this,"altPressed",!1);ke(this,"interactDown",!1);ke(this,"jumpPressed",!1);ke(this,"reloadPressed",!1);ke(this,"dropPressed",!1);ke(this,"slot",null);ke(this,"cycleSpec",0);ke(this,"takeoverPressed",!1);ke(this,"scoreboard",!1);ke(this,"locked",!1)}attach(e){const t=p=>{this.keys.add(p.code),p.code==="Space"&&(p.preventDefault(),this.jumpPressed=!0),p.code==="KeyR"&&(this.reloadPressed=!0),p.code==="KeyG"&&(this.dropPressed=!0),p.code==="Digit1"&&(this.slot=0),p.code==="Digit2"&&(this.slot=1),p.code==="Digit3"&&(this.slot=2),p.code==="KeyQ"&&(this.cycleSpec=-1),(p.code==="KeyF"||p.code==="KeyC")&&(this.takeoverPressed=!0),p.code==="Tab"&&(p.preventDefault(),this.scoreboard=!0)},r=p=>{this.keys.delete(p.code),p.code==="Tab"&&(this.scoreboard=!1)},a=p=>{if(document.pointerLockElement!==e){e.requestPointerLock();return}p.button===0&&(this.fireDown=!0,this.firePressed=!0),p.button===2&&(this.altDown=!0,this.altPressed=!0)},l=p=>{p.button===0&&(this.fireDown=!1),p.button===2&&(this.altDown=!1)},u=p=>{document.pointerLockElement===e&&(this.mx+=p.movementX,this.my+=p.movementY)},f=()=>{this.locked=document.pointerLockElement===e},d=p=>p.preventDefault(),m=()=>{this.keys.clear(),this.fireDown=!1};return window.addEventListener("keydown",t),window.addEventListener("keyup",r),e.addEventListener("mousedown",a),window.addEventListener("mouseup",l),window.addEventListener("mousemove",u),document.addEventListener("pointerlockchange",f),e.addEventListener("contextmenu",d),window.addEventListener("blur",m),()=>{window.removeEventListener("keydown",t),window.removeEventListener("keyup",r),e.removeEventListener("mousedown",a),window.removeEventListener("mouseup",l),window.removeEventListener("mousemove",u),document.removeEventListener("pointerlockchange",f),e.removeEventListener("contextmenu",d),window.removeEventListener("blur",m)}}axis(){let e=0,t=0;(this.keys.has("KeyW")||this.keys.has("ArrowUp"))&&(t-=1),(this.keys.has("KeyS")||this.keys.has("ArrowDown"))&&(t+=1),(this.keys.has("KeyA")||this.keys.has("ArrowLeft"))&&(e-=1),(this.keys.has("KeyD")||this.keys.has("ArrowRight"))&&(e+=1);const r=Math.hypot(e,t);return r>0&&(e/=r,t/=r),{x:e,z:t}}get interact(){return this.keys.has("KeyE")}get walk(){return this.keys.has("ShiftLeft")||this.keys.has("ShiftRight")}endFrame(){this.mx=0,this.my=0,this.firePressed=!1,this.altPressed=!1,this.jumpPressed=!1,this.reloadPressed=!1,this.dropPressed=!1,this.slot=null,this.cycleSpec=0,this.takeoverPressed=!1}}const eo=1,Dr=-56,Ir=-56,kn=112,$n=112;function jt(s,e){return e*kn+s}function ds(s,e){return[Math.floor(s-Dr),Math.floor(e-Ir)]}function yi(s,e){return s>=0&&e>=0&&s<kn&&e<$n}class f1{constructor(){ke(this,"walk",new Uint8Array(kn*$n));ke(this,"floor",new Float32Array(kn*$n));ke(this,"kind",new Uint8Array(kn*$n))}carve(e,t,r,a,l,u){const f=Math.min(e,r),d=Math.max(e,r),m=Math.min(t,a),p=Math.max(t,a);for(let g=m;g<p;g+=eo)for(let v=f;v<d;v+=eo){const[y,S]=ds(v+.01,g+.01);if(!yi(y,S))continue;const E=jt(y,S);this.walk[E]=1,this.floor[E]=l,this.kind[E]=u}}raise(e,t,r,a,l,u){const f=Math.min(e,r),d=Math.max(e,r),m=Math.min(t,a),p=Math.max(t,a);for(let g=m;g<p;g+=eo)for(let v=f;v<d;v+=eo){const[y,S]=ds(v+.01,g+.01);if(!yi(y,S))continue;const E=jt(y,S);this.walk[E]=1,this.floor[E]=l,u&&(this.kind[E]=u)}}stairs(e,t,r,a,l,u,f,d){const m=Math.min(e,r),p=Math.max(e,r),g=Math.min(t,a),v=Math.max(t,a),y=f==="x"?p-m:v-g;for(let S=g;S<v;S+=eo)for(let E=m;E<p;E+=eo){const M=f==="x"?(E-m+.5)/y:(S-g+.5)/y,x=l+(u-l)*M,[D,L]=ds(E+.01,S+.01);if(!yi(D,L))continue;const A=jt(D,L);this.walk[A]=1,this.floor[A]=x,this.kind[A]=d}}}function gh(s,e,t){const[r,a]=ds(e,t);if(!yi(r,a))return null;const l=jt(r,a);return s.walk[l]?s.floor[l]:null}function vh(s,e,t){const[r,a]=ds(e,t);return yi(r,a)?s.walk[jt(r,a)]===1:!1}function _h(s,e,t,r,a=8){if(!vh(s,e,t))return!1;for(let l=0;l<a;l++){const u=l/a*Math.PI*2;if(!vh(s,e+Math.cos(u)*r,t+Math.sin(u)*r))return!1}return!0}function Ql(s,e,t,r){let a=gh(s,e,t);a==null&&(a=0);for(let l=0;l<8;l++){const u=l/8*Math.PI*2,f=gh(s,e+Math.cos(u)*r,t+Math.sin(u)*r);f!=null&&(a=Math.max(a,f))}return a}function pg(s,e,t,r,a,l,u){const f=a-e,d=l-t,m=u-r,p=Math.hypot(f,d,m);if(p<.01)return!1;const g=Math.max(2,Math.ceil(p/.35));for(let v=1;v<g;v++){const y=v/g,S=e+f*y,E=t+d*y,M=r+m*y,[x,D]=ds(S,M);if(!yi(x,D))return!0;const L=jt(x,D);if(!s.walk[L]||E<s.floor[L]-.15||E>s.floor[L]+6.2)return!0}return!1}function h1(s){const e=new Uint8Array(kn*$n),t=[];for(let r=0;r<$n;r++)for(let a=0;a<kn;a++){const l=jt(a,r);if(!s.walk[l]||e[l])continue;const u=s.floor[l],f=s.kind[l];let d=1;for(;a+d<kn;){const p=jt(a+d,r);if(!s.walk[p]||e[p]||s.floor[p]!==u||s.kind[p]!==f)break;d++}let m=1;e:for(;r+m<$n;){for(let p=0;p<d;p++){const g=jt(a+p,r+m);if(!s.walk[g]||e[g]||s.floor[g]!==u||s.kind[g]!==f)break e}m++}for(let p=0;p<m;p++)for(let g=0;g<d;g++)e[jt(a+g,r+p)]=1;t.push({x:Dr+a,z:Ir+r,w:d,d:m,y:u,kind:f})}return t}function d1(s){const e=[],t=[],l=(u,f,d,m,p)=>{const g=Math.min(u,d),v=Math.max(u,d),y=Math.min(f,m),S=Math.max(f,m);e.push({minX:g,minY:p,minZ:y,maxX:v,maxY:p+5.6,maxZ:S}),t.push({x1:g,z1:y,x2:v,z2:S})};for(const u of[-1,1]){const f=new Uint8Array(kn*$n);for(let d=0;d<$n;d++)for(let m=0;m<kn;m++){const p=jt(m,d);if(!s.walk[p]||f[p])continue;const g=d+u;if(yi(m,g)&&s.walk[jt(m,g)])continue;const v=s.floor[p];let y=1;for(;m+y<kn;){const x=jt(m+y,d);if(!s.walk[x]||f[x]||s.floor[x]!==v)break;const D=d+u;if(yi(m+y,D)&&s.walk[jt(m+y,D)])break;y++}for(let x=0;x<y;x++)f[jt(m+x,d)]=1;const S=Dr+m,E=Dr+m+y,M=u<0?Ir+d:Ir+d+1;l(S,M-.55*.5,E,M+.55*.5,v)}}for(const u of[-1,1]){const f=new Uint8Array(kn*$n);for(let d=0;d<kn;d++)for(let m=0;m<$n;m++){const p=jt(d,m);if(!s.walk[p]||f[p])continue;const g=d+u;if(yi(g,m)&&s.walk[jt(g,m)])continue;const v=s.floor[p];let y=1;for(;m+y<$n;){const x=jt(d,m+y);if(!s.walk[x]||f[x]||s.floor[x]!==v)break;const D=d+u;if(yi(D,m+y)&&s.walk[jt(D,m+y)])break;y++}for(let x=0;x<y;x++)f[jt(d,m+x)]=1;const S=Ir+m,E=Ir+m+y,M=u<0?Dr+d:Dr+d+1;l(M-.55*.5,S,M+.55*.5,E,v)}}return{walls:e,lines:t}}function Ci(s,e,t,r,a,l=0){return{minX:s-t/2,minY:l,minZ:e-r/2,maxX:s+t/2,maxY:l+a,maxZ:e+r/2}}function p1(s){s.carve(-14,-52,14,-36,0,1),s.carve(-7,-36,7,8,0,1),s.carve(-8,-10,8,8,0,1),s.carve(-3,8,3,12,0,1),s.carve(-9,12,9,36,0,1),s.carve(-16,36,22,52,0,1),s.carve(-38,-52,-14,-38,0,2),s.carve(-48,-52,-34,18,0,2),s.carve(-48,14,-32,20,0,2),s.carve(-52,16,-24,38,0,3),s.carve(-26,28,-9,38,0,1),s.carve(14,-52,46,-36,0,1),s.carve(34,-36,48,22,0,1),s.carve(30,16,48,24,0,1),s.carve(16,20,48,42,0,3),s.carve(14,36,28,44,0,1),s.stairs(7,11,12,18,0,3.3,"x",1),s.carve(12,11,28,18,3.3,1),s.stairs(22,17,30,24,3.3,0,"z",3),s.carve(-5,6,5,14,0,1),s.carve(-6,32,10,38,0,1),s.carve(-32,24,-24,32,0,3),s.carve(18,32,36,42,0,3)}function m1(s){const e=[];for(let l=Ir+2;l<Ir+$n-2;l+=4)for(let u=Dr+2;u<Dr+kn-2;u+=4){if(!_h(s,u+.5,l+.5,.35))continue;const f=Ql(s,u+.5,l+.5,.2);e.push({id:e.length,x:u+.5,y:f,z:l+.5,tag:"",neighbors:[]})}const r=[{x:0,z:-44,tag:"tspawn"},{x:0,z:-22,tag:"tmid"},{x:0,z:0,tag:"xbox"},{x:0,z:10,tag:"doors"},{x:0,z:22,tag:"ctmid"},{x:4,z:44,tag:"ctspawn"},{x:-42,z:-44,tag:"tunnels_t"},{x:-41,z:-20,tag:"tunnels_mid"},{x:-41,z:6,tag:"tunnels_upper"},{x:-38,z:26,tag:"bsite"},{x:-18,z:32,tag:"bhall"},{x:28,z:-44,tag:"along_t"},{x:40,z:-20,tag:"along_mid"},{x:40,z:8,tag:"along_ct"},{x:36,z:28,tag:"asite"},{x:20,z:14,tag:"cat"},{x:26,z:20,tag:"ashort"}];for(const l of r)_h(s,l.x,l.z,.3)&&e.push({id:e.length,x:l.x,y:Ql(s,l.x,l.z,.2),z:l.z,tag:l.tag,neighbors:[]});const a=(l,u)=>{const f=u.x-l.x,d=u.z-l.z,m=Math.hypot(f,d);if(m<.5)return!1;const p=Math.ceil(m/.5);for(let g=1;g<p;g++){const v=g/p,y=l.x+f*v,S=l.z+d*v;if(!vh(s,y,S))return!1;const E=gh(s,y,S),M=l.y+(u.y-l.y)*v;if(E==null||Math.abs(E-M)>1.4)return!1}return!0};for(let l=0;l<e.length;l++)for(let u=l+1;u<e.length;u++)Math.hypot(e[l].x-e[u].x,e[l].z-e[u].z)>14||a(e[l],e[u])&&(e[l].neighbors.push(u),e[u].neighbors.push(l));return e}function xh(s,e,t){let r=0,a=1/0;for(const l of s.nav){const u=(l.x-e)**2+(l.z-t)**2;u<a&&(a=u,r=l.id)}return r}function g1(s,e,t){if(e===t)return[e];const r=s.nav.length,a=new Float32Array(r).fill(1/0),l=new Int32Array(r).fill(-1),u=[e],f=new Uint8Array(r);f[e]=1,a[e]=0;const d=m=>{const p=s.nav[m],g=s.nav[t];return Math.hypot(p.x-g.x,p.z-g.z)};for(;u.length;){let m=0,p=1/0;for(let y=0;y<u.length;y++){const S=a[u[y]]+d(u[y]);S<p&&(p=S,m=y)}const g=u.splice(m,1)[0];if(f[g]=0,g===t){const y=[g];let S=g;for(;l[S]!==-1;)S=l[S],y.push(S);return y.reverse(),y}const v=s.nav[g];for(const y of v.neighbors){const S=Math.hypot(s.nav[y].x-v.x,s.nav[y].z-v.z),E=a[g]+S;E<a[y]&&(a[y]=E,l[y]=g,f[y]||(u.push(y),f[y]=1))}}return[e]}const en={sand:new vt({color:12887402,roughness:.92,metalness:.02}),sandDark:new vt({color:9204552,roughness:.95}),tunnel:new vt({color:5917234,roughness:.9}),tunnelFloor:new vt({color:3813924,roughness:.95}),site:new vt({color:11569488,roughness:.9}),floor:new vt({color:10126424,roughness:.95}),crate:new vt({color:7029795,roughness:.8}),crateTop:new vt({color:8017200,roughness:.75}),metal:new vt({color:4873288,roughness:.45,metalness:.55}),metalDark:new vt({color:2765608,roughness:.5,metalness:.4}),trim:new vt({color:8020544,roughness:.85}),bombA:new vt({color:8007728,roughness:.7}),bombB:new vt({color:3166330,roughness:.7}),skyWall:new vt({color:14206096,roughness:1,side:Li})};function o0(s,e,t,r=!0,a=!1){const l=e.maxX-e.minX,u=e.maxY-e.minY,f=e.maxZ-e.minZ,d=new At(new tn(l,u,f),t);d.position.set((e.minX+e.maxX)/2,(e.minY+e.maxY)/2,(e.minZ+e.maxZ)/2),d.castShadow=a,d.receiveShadow=r,s.add(d)}function v1(s,e,t){const a=new At(new tn(8.2,.4,.6),en.metalDark);a.position.set(e,4.2,t),s.add(a);const l=new At(new tn(.4,4.2,.6),en.metalDark);l.position.set(e-3.9,4.2/2,t),s.add(l);const u=new At(new tn(.4,4.2,.6),en.metalDark);u.position.set(e+3.9,4.2/2,t),s.add(u);const f=new At(new tn(.12,3.6,1.8),en.metal);f.position.set(e-2.6,1.85,t+.85),f.rotation.y=.95,f.castShadow=!0,s.add(f);const d=new At(new tn(.12,3.6,1.8),en.metal);d.position.set(e+2.6,1.85,t+.85),d.rotation.y=-.95,d.castShadow=!0,s.add(d)}function mg(s,e,t,r,a){const l=new vt({color:a,roughness:.6}),u=e==="A"?[[-.7,1.4,.25,2.8,.2],[.7,1.4,.25,2.8,.2],[0,1.5,1.2,.25,.2]]:[[-.7,1.4,.25,2.8,.2],[.15,2.55,1.2,.25,.2],[.15,1.4,1.2,.25,.2],[.15,.25,1.2,.25,.2],[.7,2,.25,1,.2],[.7,.8,.25,1,.2]];for(const[f,d,m,p,g]of u){const v=new At(new tn(m,p,g),l);v.position.set(t+f,d,r),s.add(v)}}function gg(s,e,t,r){const a=new At(new Dh(3.2,3.6,24),r==="A"?en.bombA:en.bombB);a.rotation.x=-Math.PI/2,a.position.set(e,.03,t),s.add(a);const l=new At(new rc(1.1,16),r==="A"?en.bombA:en.bombB);l.rotation.x=-Math.PI/2,l.position.set(e,.04,t),s.add(l)}function _1(s,e){o0(s,e,en.crate,!0,!0);const t=e.maxX-e.minX,r=e.maxZ-e.minZ,a=new At(new tn(t*.08,e.maxY-e.minY+.02,r+.02),en.trim);a.position.set((e.minX+e.maxX)/2,(e.minY+e.maxY)/2,(e.minZ+e.maxZ)/2),s.add(a)}function x1(){const s=new f1;p1(s);const e=h1(s),{walls:t,lines:r}=d1(s),a=[Ci(3.2,-2.5,1.6,1.6,1.15),Ci(-3.5,18,1.4,1.4,1.1),Ci(32.5,26.5,1.8,1.8,1.2),Ci(40,34,1.5,2.2,1.3),Ci(24,30,1.4,1.4,1.1),Ci(-34,24,1.8,1.8,1.2),Ci(-44,30,2.4,1.6,1.4),Ci(-30,32,1.3,1.3,1.1),Ci(40,-40,1.2,1.2,1),Ci(-40,-8,1.2,1.6,1.1)],l=new un;for(const g of e){const v=new tn(g.w,.18,g.d),y=g.kind===2?en.tunnelFloor:g.kind===3?en.site:en.floor,S=new At(v,y);S.position.set(g.x+g.w/2,g.y-.08,g.z+g.d/2),S.receiveShadow=!0,l.add(S)}for(const g of t){const v=(g.minZ+g.maxZ)/2,y=(g.minX+g.maxX)/2,[S,E]=ds(y,v);let M=1;yi(S,E)&&(M=s.kind[jt(S,E)]);const x=M===2?en.tunnel:M===3?en.sandDark:en.sand;o0(l,g,x,!0,!1)}for(const g of a)_1(l,g);v1(l,0,10),gg(l,34,28,"A"),gg(l,-36,26,"B"),mg(l,"A",34,36.5,11553354),mg(l,"B",-36,35,4876976);const u=new At(new tn(16,.12,.12),en.metalDark);u.position.set(20,4.2,11.2),l.add(u);const f=new At(new tn(16,.12,.12),en.metalDark);f.position.set(20,4.2,17.7),l.add(f);const d=new At(new fo(180,16,12),new sa({color:8307944,side:Rn}));l.add(d);const m=new At(new rc(170,32),new vt({color:6969912,roughness:1}));m.rotation.x=-Math.PI/2,m.position.y=-.6,m.receiveShadow=!0,l.add(m);const p={walk:s.walk,floor:s.floor,kind:s.kind,walls:t,crates:a,wallLines:r,floorRects:e,plantA:{x:34,y:0,z:28,r:5.5},plantB:{x:-36,y:0,z:26,r:5.5},tSpawns:[{x:-6,y:0,z:-44,yaw:0},{x:-2,y:0,z:-46,yaw:0},{x:2,y:0,z:-44,yaw:0},{x:6,y:0,z:-46,yaw:0},{x:0,y:0,z:-41,yaw:0}],ctSpawns:[{x:-6,y:0,z:46,yaw:Math.PI},{x:0,y:0,z:48,yaw:Math.PI},{x:6,y:0,z:46,yaw:Math.PI},{x:12,y:0,z:48,yaw:Math.PI},{x:4,y:0,z:43,yaw:Math.PI}],nav:[],group:l};return p.nav=m1(p),p}function Ef(s,e,t){return Math.hypot(e-s.plantA.x,t-s.plantA.z)<=s.plantA.r?"A":Math.hypot(e-s.plantB.x,t-s.plantB.z)<=s.plantB.r?"B":null}function y1(s,e,t,r,a){for(const l of s){if(a>=l.maxY-.05)continue;const u=Math.max(l.minX,Math.min(e,l.maxX)),f=Math.max(l.minZ,Math.min(t,l.maxZ)),d=e-u,m=t-f;if(d*d+m*m<r*r)return l}return null}function vg(s,e,t,r,a,l,u){const f=a-e,d=l-t,m=u-r;let p=null;for(const g of s){const v=M1(e,t,r,f,d,m,g);v!=null&&v>=0&&v<=1&&(p==null||v<p)&&(p=v)}return p}function M1(s,e,t,r,a,l,u){const f=1/(r||1e-12),d=1/(a||1e-12),m=1/(l||1e-12);let p=0,g=1,v=(u.minX-s)*f,y=(u.maxX-s)*f;return v>y&&([v,y]=[y,v]),p=Math.max(p,v),g=Math.min(g,y),v=(u.minY-e)*d,y=(u.maxY-e)*d,v>y&&([v,y]=[y,v]),p=Math.max(p,v),g=Math.min(g,y),v=(u.minZ-t)*m,y=(u.maxZ-t)*m,v>y&&([v,y]=[y,v]),p=Math.max(p,v),g=Math.min(g,y),g>=p?p:null}const Yl=new vt({color:12886138,roughness:.7}),_g=new vt({color:1709328,roughness:.8});function S1(s){return s==="T"?{torso:new vt({color:9067042,roughness:.75}),vest:new vt({color:6044952,roughness:.7}),pants:new vt({color:3811352,roughness:.8}),hat:new vt({color:3811860,roughness:.7}),sleeve:new vt({color:8015388,roughness:.75})}:{torso:new vt({color:2771570,roughness:.7}),vest:new vt({color:1848142,roughness:.65}),pants:new vt({color:1713200,roughness:.8}),hat:new vt({color:4874312,roughness:.55,metalness:.2}),sleeve:new vt({color:3035256,roughness:.7})}}function Ut(s,e,t,r,a=0){const l=new At(new tn(s,e,t),r);return l.position.y=a,l.castShadow=!0,l.receiveShadow=!0,l}function a0(s){const e=new un,t=bi[s],r=new vt({color:t.color,roughness:.45,metalness:.35}),a=new vt({color:1710616,roughness:.4,metalness:.4}),l=new vt({color:5913112,roughness:.7});if(s==="knife"){const y=Ut(.04,.12,.04,l);y.rotation.x=Math.PI/2,e.add(y);const S=Ut(.02,.22,.05,new vt({color:12634320,metalness:.7,roughness:.25}));return S.position.set(0,.16,0),e.add(S),e}if(s==="awp"){e.add(Ut(.08,.1,1.15,r,0));const y=Ut(.035,.035,.45,a);y.position.set(0,.02,-.72),e.add(y);const S=Ut(.07,.12,.28,l);S.position.set(0,-.02,.52),e.add(S);const E=Ut(.05,.06,.28,a);E.position.set(0,.1,-.05),e.add(E);const M=Ut(.05,.14,.08,a);return M.position.set(0,-.1,.12),e.add(M),e}const u=s==="ak47"||s==="m4a4",f=u?.72:.32,d=Ut(.07,.09,f,r);e.add(d);const m=Ut(.03,.03,u?.28:.14,a);m.position.set(0,.015,-f/2-(u?.12:.06)),e.add(m);const p=Ut(.06,.08,u?.18:.08,s==="ak47"?l:a);p.position.set(0,-.01,f/2-.02),e.add(p);const g=Ut(.04,s==="ak47"?.16:.12,.07,a);g.position.set(0,-.1,.04),s==="ak47"&&(g.rotation.x=.25),e.add(g);const v=Ut(.04,.1,.05,a);return v.position.set(0,-.08,.14),v.rotation.x=.35,e.add(v),e}function E1(s){const e=S1(s),t=new un,r=new un;t.add(r);const a=Ut(.38,.52,.22,e.torso,1.28);r.add(a);const l=Ut(.42,.28,.26,e.vest,1.34);r.add(l);const u=new At(new fo(.13,10,8),Yl);if(u.position.y=1.68,u.castShadow=!0,r.add(u),s==="CT"){const x=new At(new fo(.14,10,8,0,Math.PI*2,0,Math.PI*.55),e.hat);x.position.y=1.72,r.add(x)}else{const x=Ut(.26,.08,.26,e.hat,1.8);r.add(x)}const f=new un;f.position.set(-.26,1.42,0);const d=Ut(.1,.32,.1,e.sleeve,-.14),m=Ut(.09,.28,.09,Yl,-.42);f.add(d,m),r.add(f);const p=new un;p.position.set(.26,1.42,0);const g=Ut(.1,.32,.1,e.sleeve,-.14),v=Ut(.09,.28,.09,Yl,-.42);p.add(g,v),r.add(p);const y=new un;y.position.set(-.11,.98,0),y.add(Ut(.13,.48,.14,e.pants,-.24)),y.add(Ut(.14,.1,.22,_g,-.52)),r.add(y);const S=new un;S.position.set(.11,.98,0),S.add(Ut(.13,.48,.14,e.pants,-.24)),S.add(Ut(.14,.1,.22,_g,-.52)),r.add(S);const E=new un;p.add(E),E.position.set(0,-.55,-.15);const M=new nn;return M.position.set(0,1.62,0),r.add(M),f.rotation.set(1.15,.15,.35),p.rotation.set(1.05,-.2,-.45),{root:t,body:r,head:u,torso:a,lArm:f,rArm:p,lLeg:y,rLeg:S,weapon:E,eye:M}}function w1(s,e){e?(s.rArm.rotation.set(.4,-.1,-.8),s.lArm.rotation.set(.3,.2,.5)):(s.lArm.rotation.set(1.15,.15,.35),s.rArm.rotation.set(1.05,-.2,-.45))}function T1(s,e,t,r){if(!r){s.body.rotation.x=1.35,s.body.position.y=.2;return}s.body.rotation.x=0,s.body.position.y=0;const a=Math.min(t,6)*.08;s.lLeg.rotation.x=Math.sin(e*10)*a,s.rLeg.rotation.x=-Math.sin(e*10)*a}function wf(s,e){for(;s.weapon.children.length;){const r=s.weapon.children[0];s.weapon.remove(r),l0(r)}const t=a0(e);e==="knife"?(t.rotation.set(1.2,0,.4),t.position.set(0,.05,0)):(t.rotation.set(-1.15,0,0),t.position.set(0,.02,-.05)),s.weapon.add(t),w1(s,e==="knife")}function l0(s){s.traverse(e=>{const t=e;t.geometry&&t.geometry.dispose()})}function A1(){const s=new un,e=Yl,t=new vt({color:4864552,roughness:.7}),r=new un;r.position.set(.18,-.22,-.28),r.add(Ut(.08,.08,.28,t));const a=Ut(.07,.07,.08,e);a.position.set(0,-.02,-.18),r.add(a),s.add(r);const l=new un;l.position.set(-.12,-.24,-.42),l.add(Ut(.07,.07,.22,t));const u=Ut(.06,.06,.07,e);u.position.set(0,0,-.14),l.add(u),s.add(l);const f=new un;return f.position.set(.12,-.18,-.48),s.add(f),{group:s,gun:f,punch:0}}function Tf(s,e){for(;s.gun.children.length;){const r=s.gun.children[0];s.gun.remove(r),l0(r)}const t=a0(e);t.scale.setScalar(e==="knife"?1.1:1.15),e==="knife"?(t.rotation.set(.4,.6,.2),t.position.set(.05,0,.1)):(t.rotation.set(.05,Math.PI,0),t.position.set(0,.02,0)),s.gun.add(t)}function On(s){return s.weapons[s.slot]??s.weapons[s.weapons.length-1]}function R1(s,e,t){const r=kl("knife"),a=kl(s==="T"?"glock":"usp");return e?[a,kl("deagle"),r]:[kl(t?"awp":s==="T"?"ak47":"m4a4"),a,r]}const C1=["Rebel","Havoc","Furia","Phoenix","Inferno"],b1=["Seal","Crash","Officer","Guardian","Sentinel"];function P1(){return Math.random()<.55?"A":"B"}function L1(s,e,t){const r=s.filter(u=>u.team==="T"),a=s.filter(u=>u.team==="CT"),l=t==="A"?"B":"A";r.forEach((u,f)=>{f===0||f===1||f===2?u.site=t:f===3?u.site="mid":u.site=l}),a.forEach((u,f)=>{f<=1?u.site="A":f<=3?u.site="B":u.site="mid"})}function ls(s){return s==="A"?{x:34,z:28}:s==="B"?{x:-36,z:26}:{x:0,z:16}}function D1(s,e,t){const r=ls(e);return s==="CT"?e==="A"?{x:28+t,z:34}:e==="B"?{x:-30+t,z:32}:{x:2+t*.3,z:22}:{x:r.x+t,z:r.z}}function I1(s,e,t,r){const a=xh(s,e.x,e.z),l=xh(s,t,r);e.path=g1(s,a,l),e.pathI=0,e.destX=t,e.destZ=r}function U1(s,e){if(!e.path.length)return{x:e.destX,z:e.destZ};for(;e.pathI<e.path.length;){const t=s.nav[e.path[e.pathI]];if(!t)break;if(Math.hypot(t.x-e.x,t.z-e.z)<1.4){e.pathI++;continue}return{x:t.x,z:t.z}}return{x:e.destX,z:e.destZ}}const Af=1/60,N1=-24,F1=7.4,Pr=.34,xg=1.58,yg=.95,Rf=3.4,Cf=5.2,Bl=40,Mg=4,O1=115,z1=4.5,Sg=.0022,k1=[{part:"head",cx:0,cy:1.68,cz:0,hx:.14,hy:.14,hz:.14},{part:"chest",cx:0,cy:1.38,cz:.02,hx:.22,hy:.17,hz:.14},{part:"stomach",cx:0,cy:1.08,cz:0,hx:.2,hy:.15,hz:.13},{part:"arm",cx:-.3,cy:1.28,cz:.08,hx:.1,hy:.28,hz:.1},{part:"arm",cx:.3,cy:1.28,cz:.08,hx:.1,hy:.28,hz:.1},{part:"leg",cx:-.11,cy:.48,cz:0,hx:.1,hy:.5,hz:.11},{part:"leg",cx:.11,cy:.48,cz:0,hx:.1,hy:.5,hz:.11}];class B1{constructor(e,t,r){ke(this,"renderer");ke(this,"scene");ke(this,"camera");ke(this,"world");ke(this,"input",new u1);ke(this,"audio",new c1);ke(this,"actors",[]);ke(this,"bomb");ke(this,"vm");ke(this,"options");ke(this,"phase","freezetime");ke(this,"phaseT",Mg);ke(this,"round",1);ke(this,"scoreT",0);ke(this,"scoreCT",0);ke(this,"execSite","A");ke(this,"killfeed",[]);ke(this,"killId",0);ke(this,"message","");ke(this,"hint","");ke(this,"specIndex",0);ke(this,"hitMarker",0);ke(this,"damageFlash",0);ke(this,"hudTimer",0);ke(this,"onHud");ke(this,"running",!1);ke(this,"last",0);ke(this,"acc",0);ke(this,"clock",0);ke(this,"detachInput");ke(this,"tracers",[]);ke(this,"muzzleLight");ke(this,"bombLight");ke(this,"explodeMesh");ke(this,"explodeT",0);ke(this,"lastBeep",0);ke(this,"camYaw",0);ke(this,"camPitch",0);ke(this,"raf",0);ke(this,"resizeObs");ke(this,"onKey",e=>{e.code==="KeyM"&&this.audio.resume()});this.options=t,this.onHud=r,this.renderer=new JE({canvas:e,antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.75)),this.renderer.setSize(e.clientWidth||window.innerWidth,e.clientHeight||window.innerHeight,!1),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Tg,this.renderer.autoClear=!1,this.renderer.outputColorSpace=Yn,this.scene=new e1,this.scene.background=new _t(8307944),this.scene.fog=new Ph(12110016,48,130),this.camera=new qn(75,1,.05,250),this.camera.layers.enable(0),this.camera.layers.enable(1),this.world=x1(),this.scene.add(this.world.group);const a=new n1(13625599,9073480,.85);a.layers.enable(0),a.layers.enable(1),this.scene.add(a);const l=new s1(16773328,1.15);l.position.set(30,70,-40),l.castShadow=!0,l.shadow.mapSize.set(1024,1024),l.shadow.camera.near=10,l.shadow.camera.far=160,l.shadow.camera.left=-70,l.shadow.camera.right=70,l.shadow.camera.top=70,l.shadow.camera.bottom=-70,l.layers.enable(0),l.layers.enable(1),this.scene.add(l);const u=new o1(16777215,.18);u.layers.enable(0),u.layers.enable(1),this.scene.add(u),this.muzzleLight=new dg(16764006,0,6),this.muzzleLight.layers.enable(0),this.muzzleLight.layers.enable(1),this.scene.add(this.muzzleLight),this.bombLight=new dg(16755251,0,8),this.scene.add(this.bombLight),this.explodeMesh=new At(new fo(1,16,12),new sa({color:16755268,transparent:!0,opacity:0})),this.explodeMesh.visible=!1,this.scene.add(this.explodeMesh),this.vm=A1(),this.vm.group.layers.set(1),this.vm.group.traverse(f=>f.layers.set(1)),this.camera.add(this.vm.group),this.scene.add(this.camera),this.bomb=this.makeBomb(),this.scene.add(this.bomb.mesh),this.spawnRound(!0),this.detachInput=this.input.attach(e),this.resizeObs=new ResizeObserver(()=>this.resize(e)),this.resizeObs.observe(e.parentElement||e),this.resize(e),window.addEventListener("keydown",this.onKey)}start(){this.running=!0,this.last=performance.now(),this.audio.resume(),this.pushHud();const e=t=>{if(!this.running)return;const r=Math.min(.05,(t-this.last)/1e3);for(this.last=t,this.acc+=r;this.acc>=Af;)this.fixed(Af),this.acc-=Af;this.clock+=r,this.render(r),this.hudTimer+=r,this.hudTimer>.05&&(this.hudTimer=0,this.pushHud()),this.raf=requestAnimationFrame(e)};this.raf=requestAnimationFrame(e)}dispose(){this.running=!1,cancelAnimationFrame(this.raf),this.detachInput(),this.resizeObs.disconnect(),window.removeEventListener("keydown",this.onKey),this.renderer.dispose()}resize(e){const t=e.clientWidth||window.innerWidth,r=e.clientHeight||window.innerHeight;this.renderer.setSize(t,r,!1),this.camera.aspect=t/Math.max(1,r),this.camera.updateProjectionMatrix()}makeBomb(){const e=new un,t=new At(new tn(.32,.16,.22),new vt({color:13150282,metalness:.4,roughness:.4}));t.castShadow=!0,e.add(t);const r=new At(new Lh(.015,.015,.28,6),new vt({color:3355443}));r.position.set(.1,.2,0),e.add(r);const a=new At(new tn(.04,.02,.04),new sa({color:16720384}));return a.position.set(-.1,.09,0),a.name="led",e.add(a),{x:0,y:0,z:0,planted:!1,dropped:!1,site:null,time:Bl,carrier:null,mesh:e}}pistolThisRound(){return this.options.pistolRound&&this.round===1}spawnRound(e){for(const v of this.actors)this.scene.remove(v.mesh.root);this.actors=[],this.killfeed=[],this.message=e?"手枪局":"",this.phase="freezetime",this.phaseT=Mg,this.execSite=P1(),this.bomb.planted=!1,this.bomb.dropped=!1,this.bomb.site=null,this.bomb.time=Bl,this.bomb.mesh.visible=!1;const t=this.pistolThisRound(),r=this.options.team,a=this.world.tSpawns,l=this.world.ctSpawns,u=(v,y,S,E,M)=>{const x=v==="T"?a[y]:l[y],D=E1(v),L=R1(v,t,E&&!t),A={id:`${v}-${y}`,name:S?"YOU":M,team:v,bot:!S,controlled:S,x:x.x,y:0,z:x.z,vx:0,vy:0,vz:0,yaw:x.yaw,pitch:0,hp:100,armor:t?50:100,helmet:!t,alive:!0,onGround:!0,crouch:!1,weapons:L,slot:0,spread:0,recoilP:0,recoilY:0,hasBomb:!1,plantProg:0,defuseProg:0,lastShot:0,scoped:!1,lastHurt:0,targetId:null,path:[],pathI:0,destX:x.x,destZ:x.z,site:"mid",strafe:1,strafeT:0,stuckT:0,lastX:x.x,lastZ:x.z,visibleToTeam:!0,seenByPlayerTeam:v===r,nextPath:0,nextShotCheck:0,walkPhase:Math.random()*10,muzzle:0,mesh:D,weaponId:L[0].id};return wf(D,A.weaponId),D.root.position.set(A.x,A.y,A.z),this.scene.add(D.root),this.actors.push(A),A};let f=0,d=0;for(let v=0;v<5;v++)u("T",v,r==="T"&&v===0,v===3,C1[f++]);for(let v=0;v<5;v++)u("CT",v,r==="CT"&&v===0,v===4,b1[d++]);const m=this.actors.filter(v=>v.team==="T"),p=m[Math.floor(Math.random()*m.length)];p.hasBomb=!0,p.site=this.execSite,this.bomb.carrier=p.id,L1(this.actors,r,this.execSite),this.specIndex=0;const g=this.player();this.camYaw=g.yaw,this.camPitch=0,Tf(this.vm,On(g).id),this.vm.group.traverse(v=>v.layers.set(1)),this.audio.round(),this.message=`${this.pistolThisRound()?"手枪局 · ":""}准备中 · T 进攻 ${this.execSite} 点`,this.hint="点击画面锁定鼠标 · WASD 移动 · 左键开火 · E 下包/拆包"}player(){return this.actors.find(e=>e.controlled&&e.alive)??this.actors.find(e=>e.controlled)??this.actors[0]}camActor(){const e=this.player();if(e.alive&&e.controlled)return e;const t=this.actors.filter(r=>r.team===e.team&&r.alive);return t.length?(this.specIndex=(this.specIndex%t.length+t.length)%t.length,t[this.specIndex]):e}lookDir(e,t){const r=Math.cos(t);return new j(Math.sin(e)*r,-Math.sin(t),Math.cos(e)*r)}eyeOf(e){return{x:e.x,y:e.y+(e.crouch?xg*.72:xg),z:e.z}}moveActor(e,t,r,a,l,u){if(!e.alive){e.vx=0,e.vz=0;return}const f=e.onGround,d=f?38:8,m=a;e.vx+=t*d*u,e.vz+=r*d*u;const p=Math.hypot(e.vx,e.vz),g=f?m:Math.max(m,p);if(p>g&&(e.vx=e.vx/p*g,e.vz=e.vz/p*g),f){const x=Math.exp(-8*u);e.vx*=x,e.vz*=x,l&&(e.vy=F1,e.onGround=!1)}e.vy+=N1*u;const v=e.x+e.vx*u,y=e.z+e.vz*u;this.tryMove(e,v,y),e.y+=e.vy*u;const S=this.standFloor(e.x,e.z,e.y),E=e.y-e.vy*u,M=S-E<=yg+.05;if(e.vy<=0&&e.y<=S&&(M||e.onGround&&Math.abs(S-E)<1.2)){if(e.vy<-12){const x=Math.min(40,Math.floor((-e.vy-12)*4));x>0&&(e.hp=Math.max(0,e.hp-x),e.controlled&&(this.damageFlash=.22,this.audio.hurt()),e.hp<=0&&(e.alive=!1,e.hasBomb&&this.dropBomb(e)))}e.y=S,e.vy=0,e.onGround=!0}else e.onGround=!1}standFloor(e,t,r){let a=Ql(this.world,e,t,Pr);for(const l of this.world.crates)e>l.minX-Pr&&e<l.maxX+Pr&&t>l.minZ-Pr&&t<l.maxZ+Pr&&r+.35>=l.maxY&&(a=Math.max(a,l.maxY));return a}blocked(e,t,r){return!_h(this.world,e,t,Pr)||Ql(this.world,e,t,Pr)-r>yg?!0:!!y1(this.world.crates,e,t,Pr,r+.4)}tryMove(e,t,r){if(!this.blocked(t,r,e.y)){e.x=t,e.z=r;return}if(!this.blocked(t,e.z,e.y)){e.x=t,e.vx*=.3;return}if(!this.blocked(e.x,r,e.y)){e.z=r,e.vz*=.3;return}e.vx=0,e.vz=0}fixed(e){if(this.input.locked&&this.audio.resume(),this.phaseT-=e,this.phase==="freezetime"&&this.phaseT<=0&&(this.phase="live",this.phaseT=O1,this.message="回合开始"),this.phase==="live"&&this.phaseT<=0&&this.endRound("CT","时间耗尽"),this.phase==="planted"){this.bomb.time-=e;const t=this.bomb.time<8?.35:this.bomb.time<16?.7:1.15;this.clock-this.lastBeep>t&&(this.lastBeep=this.clock,this.audio.beep(this.bomb.time<8)),this.bomb.time<=0&&(this.explode(),this.endRound("T","C4 爆炸"))}this.phase==="roundend"&&this.phaseT<=0&&(this.round++,this.spawnRound(!1)),this.updatePlayer(e);for(const t of this.actors)t.bot&&!t.controlled&&this.updateBot(t,e),this.updateCommon(t,e);this.updateBomb(e),this.checkRound(),this.input.endFrame(),this.hitMarker=Math.max(0,this.hitMarker-e),this.damageFlash=Math.max(0,this.damageFlash-e)}updatePlayer(e){const t=this.player(),r=this.camActor();if(this.camYaw+=this.input.mx*Sg*(r.scoped?.28:1),this.camPitch+=this.input.my*Sg*(r.scoped?.28:1),this.camPitch=Math.max(-1.45,Math.min(1.45,this.camPitch)),!t.alive){const E=()=>{const M=this.camActor();this.camYaw=M.yaw,this.camPitch=M.pitch};if(this.input.cycleSpec){const M=this.actors.filter(x=>x.team===t.team&&x.alive);M.length&&(this.specIndex=(this.specIndex+(this.input.cycleSpec>0?1:-1)+M.length)%M.length),E()}if(this.input.firePressed){const M=this.actors.filter(x=>x.team===t.team&&x.alive);M.length&&(this.specIndex=(this.specIndex+1)%M.length),E()}if(this.input.takeoverPressed){const M=this.camActor();M.alive&&M!==t&&(t.controlled=!1,M.controlled=!0,M.bot=!1,this.camYaw=M.yaw,this.camPitch=M.pitch,Tf(this.vm,On(M).id),this.vm.group.traverse(x=>x.layers.set(1)),this.message=`接管 ${M.name}`)}return}t.yaw=this.camYaw,t.pitch=this.camPitch+t.recoilP,this.input.slot!=null&&t.weapons[this.input.slot]&&(t.slot=this.input.slot,t.scoped=!1,this.equip(t));const a=On(t),l=bi[a.id];this.input.altPressed&&l.isSniper&&(t.scoped=!t.scoped,this.audio.scope()),l.isSniper||(t.scoped=!1),this.input.reloadPressed&&this.startReload(t),this.input.dropPressed&&t.hasBomb&&this.dropBomb(t);const u=this.phase==="freezetime"||this.phase==="roundend",f=this.input.axis(),d=Math.cos(t.yaw),m=Math.sin(t.yaw),p=f.x*d+f.z*m,g=-f.x*m+f.z*d,v=this.input.walk?2.6:t.scoped?3.2:5.7;u?(t.vx=0,t.vz=0):this.moveActor(t,p,g,v,this.input.jumpPressed,e);const y=Math.hypot(t.vx,t.vz);y>1.2&&t.onGround&&this.audio.footstep(y),this.handleUse(t,e),!u&&!a.reloading&&t.plantProg<=0&&t.defuseProg<=0&&(l.isAuto&&this.input.fireDown?this.tryFire(t,!0):!l.isAuto&&this.input.firePressed&&this.tryFire(t,!0))}handleUse(e,t){if(this.phase==="freezetime"||this.phase==="roundend")return;const r=this.input.interact;if(e.team==="T"&&e.hasBomb&&!this.bomb.planted){const a=Ef(this.world,e.x,e.z);a&&r&&Math.hypot(e.vx,e.vz)<.4?(e.plantProg+=t,e.plantProg>=Rf&&this.plant(e,a)):e.plantProg=0}else e.plantProg=0;e.team==="CT"&&this.bomb.planted&&Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z)<1.4&&r&&Math.hypot(e.vx,e.vz)<.4?(e.defuseProg+=t,e.defuseProg>=Cf&&this.defuse(e)):e.defuseProg=0,e.team==="T"&&this.bomb.dropped&&r&&Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z)<1.5&&this.pickupBomb(e)}updateBot(e,t){if(!e.alive||this.phase==="freezetime"||this.phase==="roundend")return;const a=this.visibleEnemies(e);if(a.length){const m=a.reduce((E,M)=>this.dist(e,M)<this.dist(e,E)?M:E);e.targetId=m.id,this.aimAt(e,m,t),e.strafeT-=t,e.strafeT<=0&&(e.strafe=Math.random()<.5?-1:1,e.strafeT=.35+Math.random()*.5);const p=Math.sin(e.yaw),g=Math.cos(e.yaw),v=e.strafe*g,y=-e.strafe*p,S=this.dist(e,m)<6?.4:-.15;this.moveActor(e,v+Math.sin(e.yaw)*S,y+Math.cos(e.yaw)*S,4.2,!1,t),e.weapons[0]&&e.slot!==0&&bi[On(e).id].melee,bi[On(e).id].melee&&this.dist(e,m)>2.4&&(e.slot=0,this.equip(e)),this.tryFire(e,!1),e.plantProg=0;return}e.targetId=null,e.team==="T"&&this.bomb.dropped&&!this.bomb.planted&&Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z)<1.4&&this.pickupBomb(e);let l=D1(e.team,e.site,(e.id.charCodeAt(e.id.length-1)-48)*.8);if(e.team==="T")if(this.bomb.planted){const m=this.bomb.site??this.execSite;l={x:ls(m).x+Math.sin(this.clock+e.walkPhase)*4,z:ls(m).z+Math.cos(this.clock)*3}}else e.hasBomb?l=ls(this.execSite):this.bomb.dropped?this.actors.filter(p=>p.team==="T"&&p.alive).sort((p,g)=>Math.hypot(p.x-this.bomb.x,p.z-this.bomb.z)-Math.hypot(g.x-this.bomb.x,g.z-this.bomb.z))[0]===e?l={x:this.bomb.x,z:this.bomb.z}:l=ls(this.execSite):l=e.site==="mid"?ls("mid"):ls(e.site==="A"||e.site==="B"?e.site:this.execSite);else this.bomb.planted&&(l={x:this.bomb.x,z:this.bomb.z});e.nextPath-=t,(e.nextPath<=0||e.path.length===0)&&(I1(this.world,e,l.x,l.z),e.nextPath=.7+Math.random()*.4);const u=U1(this.world,e);if(u){const m=u.x-e.x,p=u.z-e.z,g=Math.hypot(m,p)||1,v=Math.atan2(m,p);e.yaw=this.lerpAngle(e.yaw,v,1-Math.exp(-6*t)),e.pitch*=Math.exp(-4*t),this.moveActor(e,m/g,p/g,5.3,!1,t)}if(e.team==="T"&&e.hasBomb&&!this.bomb.planted){const m=Ef(this.world,e.x,e.z);m?(e.vx*=.2,e.vz*=.2,e.plantProg+=t,e.plantProg>=Rf&&this.plant(e,m)):e.plantProg=0}e.team==="CT"&&this.bomb.planted&&Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z)<1.3?this.actors.some(p=>p!==e&&p.team==="CT"&&p.alive&&p.defuseProg>.2)||(e.vx*=.15,e.vz*=.15,e.defuseProg+=t,e.defuseProg>=Cf&&this.defuse(e)):e.defuseProg=0;const f=Math.hypot(e.x-e.lastX,e.z-e.lastZ);if(e.stuckT+=t,e.stuckT>1.2){if(f<.25){const m=xh(this.world,e.x,e.z),p=this.world.nav[m];if(p&&p.neighbors.length){const g=p.neighbors[Math.floor(Math.random()*p.neighbors.length)];e.path=[m,g],e.pathI=0}}e.lastX=e.x,e.lastZ=e.z,e.stuckT=0}const d=On(e);d.mag===0&&d.reserve>0&&this.startReload(e)}updateCommon(e,t){e.spread=Math.max(0,e.spread-t*1.8),e.recoilP*=Math.exp(-6*t),e.recoilY*=Math.exp(-6*t),e.muzzle=Math.max(0,e.muzzle-t),e.walkPhase+=t*Math.hypot(e.vx,e.vz);const r=On(e);if(r.reloading&&this.clock>=r.reloadEnd){const l=bi[r.id].magSize-r.mag,u=Math.min(l,r.reserve);r.mag+=u,r.reserve-=u,r.reloading=!1}e.mesh.root.position.set(e.x,e.y,e.z),e.mesh.root.rotation.y=e.yaw,e.mesh.root.visible=e.alive||!0,T1(e.mesh,e.walkPhase,Math.hypot(e.vx,e.vz),e.alive),e.weaponId!==On(e).id&&(e.weaponId=On(e).id,wf(e.mesh,e.weaponId)),e.mesh.root.visible=e!==this.camActor()}visibleEnemies(e){const t=[],r=this.eyeOf(e),a=this.lookDir(e.yaw,e.pitch);for(const l of this.actors){if(!l.alive||l.team===e.team)continue;const u=l.x-e.x,f=l.y+1.3-r.y,d=l.z-e.z,m=Math.hypot(u,f,d);if(m>78)continue;const p=u/m,g=d/m,v=f/m;a.x*p+a.y*v+a.z*g<.25||pg(this.world,r.x,r.y,r.z,l.x,l.y+1.3,l.z)||vg(this.world.crates,r.x,r.y,r.z,l.x,l.y+1.3,l.z)==null&&(t.push(l),(e.team===this.options.team||e.controlled)&&(l.seenByPlayerTeam=!0))}return t}aimAt(e,t,r){const a=this.eyeOf(e),l=t.x-a.x,u=t.y+1.35-a.y,f=t.z-a.z,d=Math.atan2(l,f),m=-Math.atan2(u,Math.hypot(l,f)),p=.018+Math.hypot(e.vx,e.vz)*.008;e.yaw=this.lerpAngle(e.yaw,d+(Math.random()-.5)*p,1-Math.exp(-7*r)),e.pitch=e.pitch+(m-e.pitch)*(1-Math.exp(-6*r))}lerpAngle(e,t,r){let a=t-e;for(;a>Math.PI;)a-=Math.PI*2;for(;a<-Math.PI;)a+=Math.PI*2;return e+a*r}dist(e,t){return Math.hypot(e.x-t.x,e.y-t.y,e.z-t.z)}equip(e){const t=On(e).id;wf(e.mesh,t),e.weaponId=t,e.controlled&&(Tf(this.vm,t),this.vm.group.traverse(r=>r.layers.set(1))),e.scoped=!1}startReload(e){const t=On(e),r=bi[t.id];r.melee||t.reloading||t.mag>=r.magSize||t.reserve<=0||(t.reloading=!0,t.reloadEnd=this.clock+r.reloadTime,e.controlled&&this.audio.reload())}tryFire(e,t){const r=On(e),a=bi[r.id];if(r.reloading||this.clock<r.nextFire)return;if(a.isSniper&&!t&&(e.scoped=!0),!a.melee&&r.mag<=0){t&&this.audio.empty(),r.nextFire=this.clock+.18,this.startReload(e);return}r.nextFire=this.clock+60/a.rpm,a.melee||r.mag--,e.muzzle=.05,e.spread=Math.min(.12,e.spread+a.recoilKick*.02),e.recoilP+=a.recoilPitch,e.recoilY+=(Math.random()-.5)*a.recoilYaw*2,t&&(this.camPitch-=a.recoilPitch*.85,this.camYaw+=e.recoilY*.4,this.vm.punch=a.recoilKick),this.audio.gun(a.id);const l=this.eyeOf(e),u=Math.hypot(e.vx,e.vz),f=a.spread+e.spread+(e.onGround?0:.03)+u*a.moveSpread*.15,d=e.scoped?.15:a.isSniper?3.2:1,m=e.yaw+(Math.random()-.5)*f*d+e.recoilY*.15,p=e.pitch+(Math.random()-.5)*f*d,g=this.lookDir(m,p),v=a.melee?a.meleeRange:a.range,y=l.x+g.x*v,S=l.y+g.y*v,E=l.z+g.z*v,M=this.wallHitT(l.x,l.y,l.z,y,S,E),x=vg(this.world.crates,l.x,l.y,l.z,y,S,E);let D=1;M!=null&&(D=Math.min(D,M)),x!=null&&(D=Math.min(D,x));const L=this.traceActors(e,l.x,l.y,l.z,g.x*v,g.y*v,g.z*v,D),A=L?L.t:D;this.spawnTracer(l.x,l.y,l.z,l.x+g.x*v*A,l.y+g.y*v*A,l.z+g.z*v*A),L&&this.applyHit(e,L.actor,L.part,a.id)}wallHitT(e,t,r,a,l,u){const f=a-e,d=l-t,m=u-r,p=Math.hypot(f,d,m),g=Math.max(2,Math.ceil(p/.3));for(let v=1;v<=g;v++){const y=v/g;if(pg(this.world,e,t,r,e+f*y,t+d*y,r+m*y))return y}return null}traceActors(e,t,r,a,l,u,f,d){let m=null;for(const p of this.actors){if(!p.alive||p===e||p.team===e.team)continue;const g=Math.cos(p.yaw),v=Math.sin(p.yaw),y=t-p.x,S=a-p.z,E=y*g-S*v,M=y*v+S*g,x=r-p.y,D=l*g-f*v,L=l*v+f*g;for(const A of k1){const q={minX:A.cx-A.hx,maxX:A.cx+A.hx,minY:A.cy-A.hy,maxY:A.cy+A.hy,minZ:A.cz-A.hz,maxZ:A.cz+A.hz},N=H1(E,x,M,D,u,L,q);N!=null&&N>=0&&N<=d&&(!m||N<m.t)&&(m={actor:p,part:A.part,t:N})}}return m}applyHit(e,t,r,a){const l=bi[a],u=l.damage*a1(l,r),{hp:f,armorLost:d}=l1(u,r,t.armor,t.helmet,l.armorPen);t.armor=Math.max(0,t.armor-d),t.armor<=0&&(t.helmet=!1),t.hp-=f,t.lastHurt=this.clock,e.controlled&&(this.hitMarker=r==="head"?.28:.16,this.audio.hit(r==="head")),t.controlled&&(this.damageFlash=.25,this.audio.hurt()),t.hp<=0&&(t.hp=0,this.kill(e,t,a,r==="head"))}kill(e,t,r,a){t.alive=!1,t.hp=0,t.scoped=!1,t.vx=0,t.vz=0,t.hasBomb&&this.dropBomb(t),this.killfeed.unshift({id:++this.killId,t:this.clock,attacker:e.name,victim:t.name,weapon:r,headshot:a,attackerTeam:e.team}),this.killfeed=this.killfeed.slice(0,6),e.controlled&&this.audio.kill()}dropBomb(e){e.hasBomb=!1,this.bomb.dropped=!0,this.bomb.planted=!1,this.bomb.carrier=null,this.bomb.x=e.x,this.bomb.y=e.y+.2,this.bomb.z=e.z,this.bomb.mesh.visible=!0,this.bomb.mesh.position.set(this.bomb.x,this.bomb.y,this.bomb.z)}pickupBomb(e){if(!(e.team!=="T"||!e.alive)){for(const t of this.actors)t.hasBomb=!1;e.hasBomb=!0,this.bomb.dropped=!1,this.bomb.carrier=e.id,this.bomb.mesh.visible=!1,e.controlled&&this.audio.pickup()}}plant(e,t){e.hasBomb=!1,e.plantProg=0,this.bomb.planted=!0,this.bomb.dropped=!1,this.bomb.carrier=null,this.bomb.site=t,this.bomb.time=Bl,this.bomb.x=e.x,this.bomb.y=e.y+.12,this.bomb.z=e.z,this.bomb.mesh.visible=!0,this.bomb.mesh.position.set(this.bomb.x,this.bomb.y,this.bomb.z),this.phase="planted",this.phaseT=Bl,this.message=`C4 已安放于 ${t} 点`,this.audio.plant()}defuse(e){e.defuseProg=0,this.bomb.planted=!1,this.bomb.mesh.visible=!1,this.audio.defuse(),this.endRound("CT",`${e.name} 拆除了 C4`)}explode(){this.audio.explode(),this.explodeMesh.position.set(this.bomb.x,this.bomb.y+1,this.bomb.z),this.explodeMesh.visible=!0,this.explodeT=.8,this.explodeMesh.material.opacity=.9,this.explodeMesh.scale.setScalar(1),this.bomb.mesh.visible=!1;for(const e of this.actors){if(!e.alive)continue;Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z)<18&&(e.hp=0,e.alive=!1)}}endRound(e,t){this.phase!=="roundend"&&(this.phase="roundend",this.phaseT=z1,e==="T"?this.scoreT++:this.scoreCT++,this.message=`${e==="T"?"恐怖分子":"反恐精英"} 胜利 · ${t}`,this.audio.round())}checkRound(){if(this.phase==="roundend"||this.phase==="freezetime")return;const e=this.actors.some(r=>r.team==="T"&&r.alive);this.actors.some(r=>r.team==="CT"&&r.alive)?!e&&!this.bomb.planted&&this.endRound("CT","歼灭 T"):this.endRound("T","歼灭 CT")}updateBomb(e){if(this.bomb.carrier){const r=this.actors.find(a=>a.id===this.bomb.carrier);r&&r.hasBomb&&(this.bomb.x=r.x,this.bomb.y=r.y+.2,this.bomb.z=r.z)}if(this.bomb.dropped&&!this.bomb.planted&&(this.bomb.mesh.rotation.y+=e),this.bomb.planted){const r=this.bomb.mesh.getObjectByName("led");r&&r.material.color.set(this.clock%.5<.25?16720384:3342336),this.bombLight.position.set(this.bomb.x,this.bomb.y+.4,this.bomb.z),this.bombLight.intensity=this.clock%.5<.12?2.5:.2}else this.bombLight.intensity=0;for(const r of this.actors)r.seenByPlayerTeam=r.team===this.options.team||r.controlled&&r.alive;const t=this.actors.filter(r=>r.alive&&(r.team===this.options.team||r.controlled));for(const r of t)this.visibleEnemies(r);if(this.bomb.dropped&&!this.bomb.planted){for(const r of this.actors)if(r.team==="T"&&r.alive&&Math.hypot(r.x-this.bomb.x,r.z-this.bomb.z)<1.15){this.pickupBomb(r);break}}}spawnTracer(e,t,r,a,l,u){const f=new Kn().setFromPoints([new j(e,t,r),new j(a,l,u)]),d=new t1(f,new r0({color:16771232,transparent:!0,opacity:.7}));this.scene.add(d),this.tracers.push({line:d,t:.08})}render(e){const t=this.camActor(),r=this.eyeOf(t),a=this.camYaw,l=this.camPitch+(t.controlled&&t.alive?t.recoilP:0),u=this.lookDir(a,l);this.camera.position.set(r.x,r.y,r.z),this.camera.lookAt(r.x+u.x,r.y+u.y,r.z+u.z),this.camera.fov=t.scoped?18:75,this.camera.updateProjectionMatrix(),this.vm.punch=Math.max(0,this.vm.punch-e*8);const f=t.alive&&t.onGround?Math.sin(t.walkPhase*1.6)*Math.min(.03,Math.hypot(t.vx,t.vz)*.006):0;this.vm.group.position.set(f*.4,-this.vm.punch*.02+f,this.vm.punch*.04),this.vm.group.rotation.x=-this.vm.punch*.03,this.vm.group.visible=t.alive&&t.controlled&&!t.scoped,this.player().muzzle>0?(this.muzzleLight.position.set(r.x+u.x,r.y+u.y,r.z+u.z),this.muzzleLight.intensity=3.5):this.muzzleLight.intensity=0;for(let m=this.tracers.length-1;m>=0;m--){const p=this.tracers[m];p.t-=e;const g=p.line.material;g.opacity=Math.max(0,p.t/.08),p.t<=0&&(this.scene.remove(p.line),p.line.geometry.dispose(),g.dispose(),this.tracers.splice(m,1))}this.explodeT>0&&(this.explodeT-=e,this.explodeMesh.scale.setScalar(1+(.8-this.explodeT)*18),this.explodeMesh.material.opacity=Math.max(0,this.explodeT),this.explodeT<=0&&(this.explodeMesh.visible=!1)),this.renderer.clear(),this.camera.layers.set(0),this.renderer.render(this.scene,this.camera),this.vm.group.visible&&(this.renderer.clearDepth(),this.camera.layers.set(1),this.renderer.render(this.scene,this.camera)),this.camera.layers.enable(0),this.camera.layers.enable(1)}pushHud(){const e=this.player(),t=this.camActor(),r=On(e.alive&&e.controlled?e:t),a=bi[r.id],l=this.phase==="freezetime",u=this.actors.filter(g=>g.team===e.team&&g.alive&&g!==e),f=this.world.wallLines.filter((g,v)=>v%2===0).slice(0,400),d=this.actors.filter(g=>g.alive&&(g.team===e.team||g.seenByPlayerTeam||g.controlled)).map(g=>({id:g.id,x:g.x,z:g.z,yaw:g.yaw,team:g.team,self:g===t,bomb:g.hasBomb,seen:g.team!==e.team}));let m=null;if(this.bomb.planted||this.bomb.dropped)m={x:this.bomb.x,z:this.bomb.z,carried:!1};else{const g=this.actors.find(v=>v.hasBomb);g&&(g.team===e.team||e.team==="T")&&(m={x:g.x,z:g.z,carried:!0})}const p={hp:e.alive&&e.controlled?e.hp:t.hp,armor:e.alive&&e.controlled?e.armor:t.armor,helmet:e.alive&&e.controlled?e.helmet:t.helmet,alive:e.alive&&e.controlled,team:e.team,weapon:r.id,weaponName:a.name,mag:a.melee?0:r.mag,reserve:a.melee?0:r.reserve,reloading:r.reloading,scoped:t.scoped,holdingBomb:e.hasBomb,bombDropped:this.bomb.dropped,bombPlanted:this.bomb.planted,bombTime:this.bomb.time,plantProgress:(e.alive&&e.controlled?e.plantProg:t.plantProg)/Rf,defuseProgress:(e.alive&&e.controlled?e.defuseProg:t.defuseProg)/Cf,roundTime:this.phase==="planted"?this.bomb.time:this.phase==="freezetime"?this.phaseT:this.phaseT,phase:this.phase,freezeLeft:l?this.phaseT:0,scoreT:this.scoreT,scoreCT:this.scoreCT,round:this.round,pistolRound:this.pistolThisRound(),killfeed:this.killfeed.filter(g=>this.clock-g.t<6),message:this.message,hint:this.hint,spectating:e.alive&&e.controlled?null:t.name,canTakeover:!(e.alive&&e.controlled)&&t.alive&&t!==e,aliveTeammates:u.map(g=>({id:g.id,name:g.name})),minimap:{walls:f,floors:this.world.floorRects,sites:[{name:"A",x:this.world.plantA.x,z:this.world.plantA.z,r:this.world.plantA.r},{name:"B",x:this.world.plantB.x,z:this.world.plantB.z,r:this.world.plantB.r}],blips:d,bomb:m,yaw:t.yaw},hitMarker:this.hitMarker,damageFlash:this.damageFlash,names:this.actors.map(g=>({id:g.id,name:g.name,team:g.team,hp:Math.max(0,g.hp),alive:g.alive,weapon:On(g).id}))};if(e.alive&&e.controlled){const g=Ef(this.world,e.x,e.z);e.hasBomb&&g&&this.phase!=="freezetime"?this.hint=`按住 E 在 ${g} 点安放 C4`:e.team==="CT"&&this.bomb.planted&&Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z)<1.6?this.hint="按住 E 拆除 C4":e.team==="T"&&this.bomb.dropped&&Math.hypot(e.x-this.bomb.x,e.z-this.bomb.z)<2?this.hint="按 E 捡起 C4":this.hint="1/2/3 切枪 · R 换弹 · 右键 AWP 开镜 · G 丢包"}else p.canTakeover?this.hint="左键切换视角 · F 接管该队友":this.hint="等待回合结束";p.hint=this.hint,this.onHud(p)}}function H1(s,e,t,r,a,l,u){const f=1/(r||1e-12),d=1/(a||1e-12),m=1/(l||1e-12);let p=(u.minX-s)*f,g=(u.maxX-s)*f;p>g&&([p,g]=[g,p]);let v=p,y=g;return p=(u.minY-e)*d,g=(u.maxY-e)*d,p>g&&([p,g]=[g,p]),v=Math.max(v,p),y=Math.min(y,g),p=(u.minZ-t)*m,g=(u.maxZ-t)*m,p>g&&([p,g]=[g,p]),v=Math.max(v,p),y=Math.min(y,g),y>=v&&y>=0&&v<=1?v<0?y:v:null}const Ii={minX:-56,maxX:56,minZ:-56,maxZ:56};function rs(s,e){return(s-Ii.minX)/(Ii.maxX-Ii.minX)*e}function ss(s,e){return(1-(s-Ii.minZ)/(Ii.maxZ-Ii.minZ))*e}function V1(s,e){const t=s.width,r=s.getContext("2d");if(r){r.clearRect(0,0,t,t),r.fillStyle="#10160f",r.fillRect(0,0,t,t),r.fillStyle="#2a3320";for(const a of e.minimap.floors){const l=rs(a.x,t),u=ss(a.z+a.d,t),f=a.w/(Ii.maxX-Ii.minX)*t,d=a.d/(Ii.maxZ-Ii.minZ)*t;r.fillRect(l,u,f,d)}r.strokeStyle="#8a9a68",r.lineWidth=1,r.beginPath();for(const a of e.minimap.walls)r.moveTo(rs(a.x1,t),ss(a.z1,t)),r.lineTo(rs(a.x2,t),ss(a.z2,t));r.stroke(),r.font="bold 11px sans-serif",r.textAlign="center";for(const a of e.minimap.sites)r.fillStyle=a.name==="A"?"#c45a5a":"#5a7ac4",r.beginPath(),r.arc(rs(a.x,t),ss(a.z,t),7,0,Math.PI*2),r.fill(),r.fillStyle="#fff",r.fillText(a.name,rs(a.x,t),ss(a.z,t)+4);if(e.minimap.bomb){const a=rs(e.minimap.bomb.x,t),l=ss(e.minimap.bomb.z,t);r.fillStyle=e.bombPlanted?"#ff3b2a":"#e6c14a",r.fillRect(a-3,l-3,6,6)}for(const a of e.minimap.blips){const l=rs(a.x,t),u=ss(a.z,t);r.save(),r.translate(l,u),r.rotate(a.yaw),r.fillStyle=a.self?"#d8ff6a":a.team==="T"?"#e0a24a":"#6ab4ea",r.beginPath(),r.moveTo(0,-6),r.lineTo(4,5),r.lineTo(0,2),r.lineTo(-4,5),r.closePath(),r.fill(),a.bomb&&(r.fillStyle="#fff",r.fillRect(-1.5,-1,3,3)),r.restore()}}}function G1(s){const e=Math.max(0,Math.ceil(s)),t=Math.floor(e/60),r=e%60;return`${t}:${r.toString().padStart(2,"0")}`}function W1({hud:s,showBoard:e}){const t=oi.useRef(null);oi.useEffect(()=>{const l=t.current;if(!l)return;const u=Math.min(2,devicePixelRatio||1);l.width=196*u,l.height=196*u,V1(l,s)},[s]);const r=Math.round(s.hp),a=s.weapon==="knife"?"—":String(s.mag);return Ae.jsxs("div",{className:"hud",children:[Ae.jsx("div",{className:`flash${s.damageFlash>0?" on":""}`}),s.scoped&&Ae.jsxs("div",{className:"scope",children:[Ae.jsx("div",{className:"reticle"}),Ae.jsx("div",{className:"cx"}),Ae.jsx("div",{className:"cy"})]}),!s.scoped&&Ae.jsxs("div",{className:"crosshair",children:[Ae.jsx("i",{className:"h l"}),Ae.jsx("i",{className:"h r"}),Ae.jsx("i",{className:"v t"}),Ae.jsx("i",{className:"v b"}),Ae.jsx("i",{className:"dot"})]}),Ae.jsx("div",{className:`hitmark${s.hitMarker>0?" on":""}`}),Ae.jsx("div",{className:"minimap",children:Ae.jsx("canvas",{ref:t})}),Ae.jsxs("div",{className:"topbar",children:[Ae.jsx("span",{className:"ct",children:s.scoreCT}),Ae.jsx("span",{className:`clock${s.bombPlanted?" bomb":""}`,children:G1(s.roundTime)}),Ae.jsx("span",{className:"t",children:s.scoreT}),Ae.jsxs("span",{className:"round",children:["R",s.round,s.pistolRound?" 手枪局":"",s.phase==="freezetime"?" 准备":s.phase==="planted"?" 已下包":""]})]}),Ae.jsx("div",{className:"killfeed",children:s.killfeed.map(l=>Ae.jsxs("div",{className:`row ${l.attackerTeam}`,children:[l.attacker," [",l.weapon.toUpperCase(),"] ",l.victim,l.headshot?Ae.jsx("span",{className:"hs",children:"HS"}):null]},l.id))}),Ae.jsx("div",{className:"bottom-left",children:Ae.jsxs("div",{className:"hp",children:[Ae.jsxs("div",{children:[Ae.jsx("div",{className:"lab",children:"HP"}),Ae.jsx("div",{className:`n${r<=20?" low":""}`,children:r})]}),Ae.jsxs("div",{children:[Ae.jsx("div",{className:"lab",children:"ARMOR"}),Ae.jsxs("div",{className:"n armor",children:[Math.round(s.armor),s.helmet?" H":""]})]})]})}),Ae.jsxs("div",{className:"ammo",children:[s.weapon!=="knife"&&Ae.jsxs(Ae.Fragment,{children:[Ae.jsx("span",{className:"mag",children:a}),Ae.jsxs("span",{className:"res",children:[" / ",s.reserve]})]}),Ae.jsx("div",{className:"wname",children:s.weaponName}),s.reloading&&Ae.jsx("div",{className:"reload",children:"换弹中"})]}),s.holdingBomb&&Ae.jsx("div",{className:"bomb-icon",children:"C4"}),s.message&&(s.phase==="roundend"||s.phase==="freezetime"||s.bombPlanted)&&Ae.jsx("div",{className:"banner",children:s.message}),s.hint&&Ae.jsx("div",{className:"hint",children:s.hint}),(s.plantProgress>0||s.defuseProgress>0)&&Ae.jsx("div",{className:"progress",children:Ae.jsx("span",{style:{width:`${Math.min(100,(s.plantProgress||s.defuseProgress)*100)}%`}})}),s.spectating&&Ae.jsxs("div",{className:"spec",children:["正在观看 ",s.spectating,s.canTakeover?" · 按 F 接管":""]}),e&&Ae.jsxs("div",{className:"scoreboard",children:[Ae.jsxs("h3",{children:["TAB 计分板 · CT ",s.scoreCT," - ",s.scoreT," T"]}),Ae.jsxs("table",{children:[Ae.jsx("thead",{children:Ae.jsxs("tr",{children:[Ae.jsx("th",{children:"阵营"}),Ae.jsx("th",{children:"玩家"}),Ae.jsx("th",{children:"HP"}),Ae.jsx("th",{children:"武器"})]})}),Ae.jsx("tbody",{children:s.names.map(l=>Ae.jsxs("tr",{className:l.alive?l.team:`dead ${l.team}`,children:[Ae.jsx("td",{className:l.team,children:l.team}),Ae.jsx("td",{children:l.name}),Ae.jsx("td",{children:l.alive?Math.round(l.hp):"—"}),Ae.jsx("td",{children:l.weapon})]},l.id))})]})]})]})}function X1(){const s=oi.useRef(null),e=oi.useRef(null),[t,r]=oi.useState("menu"),[a,l]=oi.useState("T"),[u,f]=oi.useState(!0),[d,m]=oi.useState(null),[p,g]=oi.useState(!1);return oi.useEffect(()=>{if(t!=="play"||!s.current)return;const v={team:a,pistolRound:u},y=new B1(s.current,v,m);return e.current=y,y.start(),()=>{y.dispose(),e.current=null}},[t,a,u]),oi.useEffect(()=>{const v=S=>{S.code==="Tab"&&(S.preventDefault(),g(!0)),S.code==="Escape"&&t==="play"&&document.exitPointerLock()},y=S=>{S.code==="Tab"&&g(!1)};return window.addEventListener("keydown",v),window.addEventListener("keyup",y),()=>{window.removeEventListener("keydown",v),window.removeEventListener("keyup",y)}},[t]),Ae.jsxs("div",{className:"app",children:[Ae.jsx("canvas",{ref:s,className:"game"}),t==="play"&&d&&Ae.jsx(W1,{hud:d,showBoard:p}),t==="menu"&&Ae.jsx("div",{className:"menu",children:Ae.jsxs("div",{className:"panel",children:[Ae.jsx("h1",{children:"DUST II"}),Ae.jsx("div",{className:"sub",children:"5v5 第一人称对战原型 · 程序化地图 / 角色 / 枪声"}),Ae.jsxs("div",{className:"row",children:[Ae.jsx("button",{className:`team T${a==="T"?" on":""}`,onClick:()=>l("T"),children:"恐怖分子 T"}),Ae.jsx("button",{className:`team CT${a==="CT"?" on":""}`,onClick:()=>l("CT"),children:"反恐精英 CT"})]}),Ae.jsxs("label",{className:"check",children:[Ae.jsx("input",{type:"checkbox",checked:u,onChange:v=>f(v.target.checked)}),"第一回合手枪局（仅默认手枪 + 护甲 50）"]}),Ae.jsx("button",{className:"start",onClick:()=>r("play"),children:"开始比赛"}),Ae.jsxs("div",{className:"help",children:["WASD 移动 · 鼠标瞄准 · 左键开火 · 空格跳跃 · R 换弹 · 1/2/3 切枪",Ae.jsx("br",{}),"右键 AWP 开镜 · E 下包 / 拆包 / 捡包 · G 丢包 · TAB 计分板",Ae.jsx("br",{}),"阵亡后左键切换队友视角，F 接管该 Bot"]})]})})]})}Jv.createRoot(document.getElementById("root")).render(Ae.jsx(jv.StrictMode,{children:Ae.jsx(X1,{})}));

var Mv=Object.defineProperty;var Sv=(n,e,t)=>e in n?Mv(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var ee=(n,e,t)=>Sv(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function Ev(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Sm={exports:{}},Bl={},Em={exports:{}},Ge={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var $o=Symbol.for("react.element"),wv=Symbol.for("react.portal"),Tv=Symbol.for("react.fragment"),Av=Symbol.for("react.strict_mode"),Rv=Symbol.for("react.profiler"),Cv=Symbol.for("react.provider"),bv=Symbol.for("react.context"),Pv=Symbol.for("react.forward_ref"),Lv=Symbol.for("react.suspense"),Dv=Symbol.for("react.memo"),Nv=Symbol.for("react.lazy"),ih=Symbol.iterator;function Iv(n){return n===null||typeof n!="object"?null:(n=ih&&n[ih]||n["@@iterator"],typeof n=="function"?n:null)}var wm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Tm=Object.assign,Am={};function zs(n,e,t){this.props=n,this.context=e,this.refs=Am,this.updater=t||wm}zs.prototype.isReactComponent={};zs.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};zs.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function Rm(){}Rm.prototype=zs.prototype;function Vd(n,e,t){this.props=n,this.context=e,this.refs=Am,this.updater=t||wm}var Gd=Vd.prototype=new Rm;Gd.constructor=Vd;Tm(Gd,zs.prototype);Gd.isPureReactComponent=!0;var rh=Array.isArray,Cm=Object.prototype.hasOwnProperty,Hd={current:null},bm={key:!0,ref:!0,__self:!0,__source:!0};function Pm(n,e,t){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Cm.call(e,i)&&!bm.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=t;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(n&&n.defaultProps)for(i in a=n.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:$o,type:n,key:s,ref:o,props:r,_owner:Hd.current}}function Uv(n,e){return{$$typeof:$o,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function Wd(n){return typeof n=="object"&&n!==null&&n.$$typeof===$o}function Fv(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var sh=/\/+/g;function sc(n,e){return typeof n=="object"&&n!==null&&n.key!=null?Fv(""+n.key):e.toString(36)}function Ya(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case $o:case wv:o=!0}}if(o)return o=n,r=r(o),n=i===""?"."+sc(o,0):i,rh(r)?(t="",n!=null&&(t=n.replace(sh,"$&/")+"/"),Ya(r,e,t,"",function(c){return c})):r!=null&&(Wd(r)&&(r=Uv(r,t+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(sh,"$&/")+"/")+n)),e.push(r)),1;if(o=0,i=i===""?".":i+":",rh(n))for(var a=0;a<n.length;a++){s=n[a];var l=i+sc(s,a);o+=Ya(s,e,t,l,r)}else if(l=Iv(n),typeof l=="function")for(n=l.call(n),a=0;!(s=n.next()).done;)s=s.value,l=i+sc(s,a++),o+=Ya(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function sa(n,e,t){if(n==null)return n;var i=[],r=0;return Ya(n,i,"","",function(s){return e.call(t,s,r++)}),i}function Ov(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var nn={current:null},qa={transition:null},kv={ReactCurrentDispatcher:nn,ReactCurrentBatchConfig:qa,ReactCurrentOwner:Hd};function Lm(){throw Error("act(...) is not supported in production builds of React.")}Ge.Children={map:sa,forEach:function(n,e,t){sa(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return sa(n,function(){e++}),e},toArray:function(n){return sa(n,function(e){return e})||[]},only:function(n){if(!Wd(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};Ge.Component=zs;Ge.Fragment=Tv;Ge.Profiler=Rv;Ge.PureComponent=Vd;Ge.StrictMode=Av;Ge.Suspense=Lv;Ge.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=kv;Ge.act=Lm;Ge.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=Tm({},n.props),r=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Hd.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(l in e)Cm.call(e,l)&&!bm.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:$o,type:n.type,key:r,ref:s,props:i,_owner:o}};Ge.createContext=function(n){return n={$$typeof:bv,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:Cv,_context:n},n.Consumer=n};Ge.createElement=Pm;Ge.createFactory=function(n){var e=Pm.bind(null,n);return e.type=n,e};Ge.createRef=function(){return{current:null}};Ge.forwardRef=function(n){return{$$typeof:Pv,render:n}};Ge.isValidElement=Wd;Ge.lazy=function(n){return{$$typeof:Nv,_payload:{_status:-1,_result:n},_init:Ov}};Ge.memo=function(n,e){return{$$typeof:Dv,type:n,compare:e===void 0?null:e}};Ge.startTransition=function(n){var e=qa.transition;qa.transition={};try{n()}finally{qa.transition=e}};Ge.unstable_act=Lm;Ge.useCallback=function(n,e){return nn.current.useCallback(n,e)};Ge.useContext=function(n){return nn.current.useContext(n)};Ge.useDebugValue=function(){};Ge.useDeferredValue=function(n){return nn.current.useDeferredValue(n)};Ge.useEffect=function(n,e){return nn.current.useEffect(n,e)};Ge.useId=function(){return nn.current.useId()};Ge.useImperativeHandle=function(n,e,t){return nn.current.useImperativeHandle(n,e,t)};Ge.useInsertionEffect=function(n,e){return nn.current.useInsertionEffect(n,e)};Ge.useLayoutEffect=function(n,e){return nn.current.useLayoutEffect(n,e)};Ge.useMemo=function(n,e){return nn.current.useMemo(n,e)};Ge.useReducer=function(n,e,t){return nn.current.useReducer(n,e,t)};Ge.useRef=function(n){return nn.current.useRef(n)};Ge.useState=function(n){return nn.current.useState(n)};Ge.useSyncExternalStore=function(n,e,t){return nn.current.useSyncExternalStore(n,e,t)};Ge.useTransition=function(){return nn.current.useTransition()};Ge.version="18.3.1";Em.exports=Ge;var Tt=Em.exports;const Bv=Ev(Tt);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var zv=Tt,Vv=Symbol.for("react.element"),Gv=Symbol.for("react.fragment"),Hv=Object.prototype.hasOwnProperty,Wv=zv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,jv={key:!0,ref:!0,__self:!0,__source:!0};function Dm(n,e,t){var i,r={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)Hv.call(e,i)&&!jv.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Vv,type:n,key:s,ref:o,props:r,_owner:Wv.current}}Bl.Fragment=Gv;Bl.jsx=Dm;Bl.jsxs=Dm;Sm.exports=Bl;var b=Sm.exports,lu={},Nm={exports:{}},Mn={},Im={exports:{}},Um={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(N,q){var Z=N.length;N.push(q);e:for(;0<Z;){var le=Z-1>>>1,me=N[le];if(0<r(me,q))N[le]=q,N[Z]=me,Z=le;else break e}}function t(N){return N.length===0?null:N[0]}function i(N){if(N.length===0)return null;var q=N[0],Z=N.pop();if(Z!==q){N[0]=Z;e:for(var le=0,me=N.length,Ne=me>>>1;le<Ne;){var Y=2*(le+1)-1,re=N[Y],ve=Y+1,ce=N[ve];if(0>r(re,Z))ve<me&&0>r(ce,re)?(N[le]=ce,N[ve]=Z,le=ve):(N[le]=re,N[Y]=Z,le=Y);else if(ve<me&&0>r(ce,Z))N[le]=ce,N[ve]=Z,le=ve;else break e}}return q}function r(N,q){var Z=N.sortIndex-q.sortIndex;return Z!==0?Z:N.id-q.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();n.unstable_now=function(){return o.now()-a}}var l=[],c=[],d=1,f=null,h=3,p=!1,g=!1,_=!1,m=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,v=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function x(N){for(var q=t(c);q!==null;){if(q.callback===null)i(c);else if(q.startTime<=N)i(c),q.sortIndex=q.expirationTime,e(l,q);else break;q=t(c)}}function y(N){if(_=!1,x(N),!g)if(t(l)!==null)g=!0,W(P);else{var q=t(c);q!==null&&K(y,q.startTime-N)}}function P(N,q){g=!1,_&&(_=!1,u(R),R=-1),p=!0;var Z=h;try{for(x(q),f=t(l);f!==null&&(!(f.expirationTime>q)||N&&!D());){var le=f.callback;if(typeof le=="function"){f.callback=null,h=f.priorityLevel;var me=le(f.expirationTime<=q);q=n.unstable_now(),typeof me=="function"?f.callback=me:f===t(l)&&i(l),x(q)}else i(l);f=t(l)}if(f!==null)var Ne=!0;else{var Y=t(c);Y!==null&&K(y,Y.startTime-q),Ne=!1}return Ne}finally{f=null,h=Z,p=!1}}var E=!1,A=null,R=-1,w=5,M=-1;function D(){return!(n.unstable_now()-M<w)}function V(){if(A!==null){var N=n.unstable_now();M=N;var q=!0;try{q=A(!0,N)}finally{q?U():(E=!1,A=null)}}else E=!1}var U;if(typeof v=="function")U=function(){v(V)};else if(typeof MessageChannel<"u"){var B=new MessageChannel,X=B.port2;B.port1.onmessage=V,U=function(){X.postMessage(null)}}else U=function(){m(V,0)};function W(N){A=N,E||(E=!0,U())}function K(N,q){R=m(function(){N(n.unstable_now())},q)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(N){N.callback=null},n.unstable_continueExecution=function(){g||p||(g=!0,W(P))},n.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<N?Math.floor(1e3/N):5},n.unstable_getCurrentPriorityLevel=function(){return h},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(N){switch(h){case 1:case 2:case 3:var q=3;break;default:q=h}var Z=h;h=q;try{return N()}finally{h=Z}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(N,q){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var Z=h;h=N;try{return q()}finally{h=Z}},n.unstable_scheduleCallback=function(N,q,Z){var le=n.unstable_now();switch(typeof Z=="object"&&Z!==null?(Z=Z.delay,Z=typeof Z=="number"&&0<Z?le+Z:le):Z=le,N){case 1:var me=-1;break;case 2:me=250;break;case 5:me=1073741823;break;case 4:me=1e4;break;default:me=5e3}return me=Z+me,N={id:d++,callback:q,priorityLevel:N,startTime:Z,expirationTime:me,sortIndex:-1},Z>le?(N.sortIndex=Z,e(c,N),t(l)===null&&N===t(c)&&(_?(u(R),R=-1):_=!0,K(y,Z-le))):(N.sortIndex=me,e(l,N),g||p||(g=!0,W(P))),N},n.unstable_shouldYield=D,n.unstable_wrapCallback=function(N){var q=h;return function(){var Z=h;h=q;try{return N.apply(this,arguments)}finally{h=Z}}}})(Um);Im.exports=Um;var Xv=Im.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Yv=Tt,yn=Xv;function ie(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Fm=new Set,bo={};function zr(n,e){Rs(n,e),Rs(n+"Capture",e)}function Rs(n,e){for(bo[n]=e,n=0;n<e.length;n++)Fm.add(e[n])}var Si=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),cu=Object.prototype.hasOwnProperty,qv=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,oh={},ah={};function $v(n){return cu.call(ah,n)?!0:cu.call(oh,n)?!1:qv.test(n)?ah[n]=!0:(oh[n]=!0,!1)}function Kv(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function Zv(n,e,t,i){if(e===null||typeof e>"u"||Kv(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function rn(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var zt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){zt[n]=new rn(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];zt[e]=new rn(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){zt[n]=new rn(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){zt[n]=new rn(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){zt[n]=new rn(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){zt[n]=new rn(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){zt[n]=new rn(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){zt[n]=new rn(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){zt[n]=new rn(n,5,!1,n.toLowerCase(),null,!1,!1)});var jd=/[\-:]([a-z])/g;function Xd(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(jd,Xd);zt[e]=new rn(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(jd,Xd);zt[e]=new rn(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(jd,Xd);zt[e]=new rn(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){zt[n]=new rn(n,1,!1,n.toLowerCase(),null,!1,!1)});zt.xlinkHref=new rn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){zt[n]=new rn(n,1,!1,n.toLowerCase(),null,!0,!0)});function Yd(n,e,t,i){var r=zt.hasOwnProperty(e)?zt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Zv(e,t,r,i)&&(t=null),i||r===null?$v(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var Ri=Yv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,oa=Symbol.for("react.element"),os=Symbol.for("react.portal"),as=Symbol.for("react.fragment"),qd=Symbol.for("react.strict_mode"),uu=Symbol.for("react.profiler"),Om=Symbol.for("react.provider"),km=Symbol.for("react.context"),$d=Symbol.for("react.forward_ref"),du=Symbol.for("react.suspense"),fu=Symbol.for("react.suspense_list"),Kd=Symbol.for("react.memo"),Oi=Symbol.for("react.lazy"),Bm=Symbol.for("react.offscreen"),lh=Symbol.iterator;function Zs(n){return n===null||typeof n!="object"?null:(n=lh&&n[lh]||n["@@iterator"],typeof n=="function"?n:null)}var Mt=Object.assign,oc;function fo(n){if(oc===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);oc=e&&e[1]||""}return`
`+oc+n}var ac=!1;function lc(n,e){if(!n||ac)return"";ac=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){i=c}n.call(e.prototype)}else{try{throw Error()}catch(c){i=c}n()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=o&&0<=a);break}}}finally{ac=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?fo(n):""}function Qv(n){switch(n.tag){case 5:return fo(n.type);case 16:return fo("Lazy");case 13:return fo("Suspense");case 19:return fo("SuspenseList");case 0:case 2:case 15:return n=lc(n.type,!1),n;case 11:return n=lc(n.type.render,!1),n;case 1:return n=lc(n.type,!0),n;default:return""}}function hu(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case as:return"Fragment";case os:return"Portal";case uu:return"Profiler";case qd:return"StrictMode";case du:return"Suspense";case fu:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case km:return(n.displayName||"Context")+".Consumer";case Om:return(n._context.displayName||"Context")+".Provider";case $d:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Kd:return e=n.displayName||null,e!==null?e:hu(n.type)||"Memo";case Oi:e=n._payload,n=n._init;try{return hu(n(e))}catch{}}return null}function Jv(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return hu(e);case 8:return e===qd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function nr(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function zm(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function ex(n){var e=zm(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function aa(n){n._valueTracker||(n._valueTracker=ex(n))}function Vm(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=zm(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function dl(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function pu(n,e){var t=e.checked;return Mt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function ch(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=nr(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Gm(n,e){e=e.checked,e!=null&&Yd(n,"checked",e,!1)}function mu(n,e){Gm(n,e);var t=nr(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?gu(n,e.type,t):e.hasOwnProperty("defaultValue")&&gu(n,e.type,nr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function uh(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function gu(n,e,t){(e!=="number"||dl(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var ho=Array.isArray;function _s(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+nr(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function vu(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ie(91));return Mt({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function dh(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(ie(92));if(ho(t)){if(1<t.length)throw Error(ie(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:nr(t)}}function Hm(n,e){var t=nr(e.value),i=nr(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function fh(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function Wm(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function xu(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?Wm(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var la,jm=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(la=la||document.createElement("div"),la.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=la.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function Po(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var xo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},tx=["Webkit","ms","Moz","O"];Object.keys(xo).forEach(function(n){tx.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),xo[e]=xo[n]})});function Xm(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||xo.hasOwnProperty(n)&&xo[n]?(""+e).trim():e+"px"}function Ym(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=Xm(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var nx=Mt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function _u(n,e){if(e){if(nx[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ie(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ie(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ie(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ie(62))}}function yu(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Mu=null;function Zd(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Su=null,ys=null,Ms=null;function hh(n){if(n=Qo(n)){if(typeof Su!="function")throw Error(ie(280));var e=n.stateNode;e&&(e=Wl(e),Su(n.stateNode,n.type,e))}}function qm(n){ys?Ms?Ms.push(n):Ms=[n]:ys=n}function $m(){if(ys){var n=ys,e=Ms;if(Ms=ys=null,hh(n),e)for(n=0;n<e.length;n++)hh(e[n])}}function Km(n,e){return n(e)}function Zm(){}var cc=!1;function Qm(n,e,t){if(cc)return n(e,t);cc=!0;try{return Km(n,e,t)}finally{cc=!1,(ys!==null||Ms!==null)&&(Zm(),$m())}}function Lo(n,e){var t=n.stateNode;if(t===null)return null;var i=Wl(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(ie(231,e,typeof t));return t}var Eu=!1;if(Si)try{var Qs={};Object.defineProperty(Qs,"passive",{get:function(){Eu=!0}}),window.addEventListener("test",Qs,Qs),window.removeEventListener("test",Qs,Qs)}catch{Eu=!1}function ix(n,e,t,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(d){this.onError(d)}}var _o=!1,fl=null,hl=!1,wu=null,rx={onError:function(n){_o=!0,fl=n}};function sx(n,e,t,i,r,s,o,a,l){_o=!1,fl=null,ix.apply(rx,arguments)}function ox(n,e,t,i,r,s,o,a,l){if(sx.apply(this,arguments),_o){if(_o){var c=fl;_o=!1,fl=null}else throw Error(ie(198));hl||(hl=!0,wu=c)}}function Vr(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function Jm(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function ph(n){if(Vr(n)!==n)throw Error(ie(188))}function ax(n){var e=n.alternate;if(!e){if(e=Vr(n),e===null)throw Error(ie(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return ph(r),n;if(s===i)return ph(r),e;s=s.sibling}throw Error(ie(188))}if(t.return!==i.return)t=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===t){o=!0,t=r,i=s;break}if(a===i){o=!0,i=r,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,i=r;break}if(a===i){o=!0,i=s,t=r;break}a=a.sibling}if(!o)throw Error(ie(189))}}if(t.alternate!==i)throw Error(ie(190))}if(t.tag!==3)throw Error(ie(188));return t.stateNode.current===t?n:e}function e0(n){return n=ax(n),n!==null?t0(n):null}function t0(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=t0(n);if(e!==null)return e;n=n.sibling}return null}var n0=yn.unstable_scheduleCallback,mh=yn.unstable_cancelCallback,lx=yn.unstable_shouldYield,cx=yn.unstable_requestPaint,At=yn.unstable_now,ux=yn.unstable_getCurrentPriorityLevel,Qd=yn.unstable_ImmediatePriority,i0=yn.unstable_UserBlockingPriority,pl=yn.unstable_NormalPriority,dx=yn.unstable_LowPriority,r0=yn.unstable_IdlePriority,zl=null,ii=null;function fx(n){if(ii&&typeof ii.onCommitFiberRoot=="function")try{ii.onCommitFiberRoot(zl,n,void 0,(n.current.flags&128)===128)}catch{}}var Yn=Math.clz32?Math.clz32:mx,hx=Math.log,px=Math.LN2;function mx(n){return n>>>=0,n===0?32:31-(hx(n)/px|0)|0}var ca=64,ua=4194304;function po(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function ml(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~r;a!==0?i=po(a):(s&=o,s!==0&&(i=po(s)))}else o=t&~r,o!==0?i=po(o):s!==0&&(i=po(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-Yn(e),r=1<<t,i|=n[t],e&=~r;return i}function gx(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function vx(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-Yn(s),a=1<<o,l=r[o];l===-1?(!(a&t)||a&i)&&(r[o]=gx(a,e)):l<=e&&(n.expiredLanes|=a),s&=~a}}function Tu(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function s0(){var n=ca;return ca<<=1,!(ca&4194240)&&(ca=64),n}function uc(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function Ko(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-Yn(e),n[e]=t}function xx(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-Yn(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function Jd(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-Yn(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var it=0;function o0(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var a0,ef,l0,c0,u0,Au=!1,da=[],Wi=null,ji=null,Xi=null,Do=new Map,No=new Map,Bi=[],_x="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function gh(n,e){switch(n){case"focusin":case"focusout":Wi=null;break;case"dragenter":case"dragleave":ji=null;break;case"mouseover":case"mouseout":Xi=null;break;case"pointerover":case"pointerout":Do.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":No.delete(e.pointerId)}}function Js(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Qo(e),e!==null&&ef(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function yx(n,e,t,i,r){switch(e){case"focusin":return Wi=Js(Wi,n,e,t,i,r),!0;case"dragenter":return ji=Js(ji,n,e,t,i,r),!0;case"mouseover":return Xi=Js(Xi,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return Do.set(s,Js(Do.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,No.set(s,Js(No.get(s)||null,n,e,t,i,r)),!0}return!1}function d0(n){var e=Er(n.target);if(e!==null){var t=Vr(e);if(t!==null){if(e=t.tag,e===13){if(e=Jm(t),e!==null){n.blockedOn=e,u0(n.priority,function(){l0(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function $a(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=Ru(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);Mu=i,t.target.dispatchEvent(i),Mu=null}else return e=Qo(t),e!==null&&ef(e),n.blockedOn=t,!1;e.shift()}return!0}function vh(n,e,t){$a(n)&&t.delete(e)}function Mx(){Au=!1,Wi!==null&&$a(Wi)&&(Wi=null),ji!==null&&$a(ji)&&(ji=null),Xi!==null&&$a(Xi)&&(Xi=null),Do.forEach(vh),No.forEach(vh)}function eo(n,e){n.blockedOn===e&&(n.blockedOn=null,Au||(Au=!0,yn.unstable_scheduleCallback(yn.unstable_NormalPriority,Mx)))}function Io(n){function e(r){return eo(r,n)}if(0<da.length){eo(da[0],n);for(var t=1;t<da.length;t++){var i=da[t];i.blockedOn===n&&(i.blockedOn=null)}}for(Wi!==null&&eo(Wi,n),ji!==null&&eo(ji,n),Xi!==null&&eo(Xi,n),Do.forEach(e),No.forEach(e),t=0;t<Bi.length;t++)i=Bi[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<Bi.length&&(t=Bi[0],t.blockedOn===null);)d0(t),t.blockedOn===null&&Bi.shift()}var Ss=Ri.ReactCurrentBatchConfig,gl=!0;function Sx(n,e,t,i){var r=it,s=Ss.transition;Ss.transition=null;try{it=1,tf(n,e,t,i)}finally{it=r,Ss.transition=s}}function Ex(n,e,t,i){var r=it,s=Ss.transition;Ss.transition=null;try{it=4,tf(n,e,t,i)}finally{it=r,Ss.transition=s}}function tf(n,e,t,i){if(gl){var r=Ru(n,e,t,i);if(r===null)yc(n,e,i,vl,t),gh(n,i);else if(yx(r,n,e,t,i))i.stopPropagation();else if(gh(n,i),e&4&&-1<_x.indexOf(n)){for(;r!==null;){var s=Qo(r);if(s!==null&&a0(s),s=Ru(n,e,t,i),s===null&&yc(n,e,i,vl,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else yc(n,e,i,null,t)}}var vl=null;function Ru(n,e,t,i){if(vl=null,n=Zd(i),n=Er(n),n!==null)if(e=Vr(n),e===null)n=null;else if(t=e.tag,t===13){if(n=Jm(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return vl=n,null}function f0(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ux()){case Qd:return 1;case i0:return 4;case pl:case dx:return 16;case r0:return 536870912;default:return 16}default:return 16}}var Gi=null,nf=null,Ka=null;function h0(){if(Ka)return Ka;var n,e=nf,t=e.length,i,r="value"in Gi?Gi.value:Gi.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===r[s-i];i++);return Ka=r.slice(n,1<i?1-i:void 0)}function Za(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function fa(){return!0}function xh(){return!1}function Sn(n){function e(t,i,r,s,o){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?fa:xh,this.isPropagationStopped=xh,this}return Mt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=fa)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=fa)},persist:function(){},isPersistent:fa}),e}var Vs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},rf=Sn(Vs),Zo=Mt({},Vs,{view:0,detail:0}),wx=Sn(Zo),dc,fc,to,Vl=Mt({},Zo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:sf,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==to&&(to&&n.type==="mousemove"?(dc=n.screenX-to.screenX,fc=n.screenY-to.screenY):fc=dc=0,to=n),dc)},movementY:function(n){return"movementY"in n?n.movementY:fc}}),_h=Sn(Vl),Tx=Mt({},Vl,{dataTransfer:0}),Ax=Sn(Tx),Rx=Mt({},Zo,{relatedTarget:0}),hc=Sn(Rx),Cx=Mt({},Vs,{animationName:0,elapsedTime:0,pseudoElement:0}),bx=Sn(Cx),Px=Mt({},Vs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Lx=Sn(Px),Dx=Mt({},Vs,{data:0}),yh=Sn(Dx),Nx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Ix={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Ux={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Fx(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=Ux[n])?!!e[n]:!1}function sf(){return Fx}var Ox=Mt({},Zo,{key:function(n){if(n.key){var e=Nx[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=Za(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Ix[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:sf,charCode:function(n){return n.type==="keypress"?Za(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Za(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),kx=Sn(Ox),Bx=Mt({},Vl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Mh=Sn(Bx),zx=Mt({},Zo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:sf}),Vx=Sn(zx),Gx=Mt({},Vs,{propertyName:0,elapsedTime:0,pseudoElement:0}),Hx=Sn(Gx),Wx=Mt({},Vl,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),jx=Sn(Wx),Xx=[9,13,27,32],of=Si&&"CompositionEvent"in window,yo=null;Si&&"documentMode"in document&&(yo=document.documentMode);var Yx=Si&&"TextEvent"in window&&!yo,p0=Si&&(!of||yo&&8<yo&&11>=yo),Sh=" ",Eh=!1;function m0(n,e){switch(n){case"keyup":return Xx.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function g0(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var ls=!1;function qx(n,e){switch(n){case"compositionend":return g0(e);case"keypress":return e.which!==32?null:(Eh=!0,Sh);case"textInput":return n=e.data,n===Sh&&Eh?null:n;default:return null}}function $x(n,e){if(ls)return n==="compositionend"||!of&&m0(n,e)?(n=h0(),Ka=nf=Gi=null,ls=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return p0&&e.locale!=="ko"?null:e.data;default:return null}}var Kx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function wh(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!Kx[n.type]:e==="textarea"}function v0(n,e,t,i){qm(i),e=xl(e,"onChange"),0<e.length&&(t=new rf("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var Mo=null,Uo=null;function Zx(n){C0(n,0)}function Gl(n){var e=ds(n);if(Vm(e))return n}function Qx(n,e){if(n==="change")return e}var x0=!1;if(Si){var pc;if(Si){var mc="oninput"in document;if(!mc){var Th=document.createElement("div");Th.setAttribute("oninput","return;"),mc=typeof Th.oninput=="function"}pc=mc}else pc=!1;x0=pc&&(!document.documentMode||9<document.documentMode)}function Ah(){Mo&&(Mo.detachEvent("onpropertychange",_0),Uo=Mo=null)}function _0(n){if(n.propertyName==="value"&&Gl(Uo)){var e=[];v0(e,Uo,n,Zd(n)),Qm(Zx,e)}}function Jx(n,e,t){n==="focusin"?(Ah(),Mo=e,Uo=t,Mo.attachEvent("onpropertychange",_0)):n==="focusout"&&Ah()}function e_(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Gl(Uo)}function t_(n,e){if(n==="click")return Gl(e)}function n_(n,e){if(n==="input"||n==="change")return Gl(e)}function i_(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var Kn=typeof Object.is=="function"?Object.is:i_;function Fo(n,e){if(Kn(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!cu.call(e,r)||!Kn(n[r],e[r]))return!1}return!0}function Rh(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Ch(n,e){var t=Rh(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Rh(t)}}function y0(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?y0(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function M0(){for(var n=window,e=dl();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=dl(n.document)}return e}function af(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function r_(n){var e=M0(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&y0(t.ownerDocument.documentElement,t)){if(i!==null&&af(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=Ch(t,s);var o=Ch(t,i);r&&o&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var s_=Si&&"documentMode"in document&&11>=document.documentMode,cs=null,Cu=null,So=null,bu=!1;function bh(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;bu||cs==null||cs!==dl(i)||(i=cs,"selectionStart"in i&&af(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),So&&Fo(So,i)||(So=i,i=xl(Cu,"onSelect"),0<i.length&&(e=new rf("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=cs)))}function ha(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var us={animationend:ha("Animation","AnimationEnd"),animationiteration:ha("Animation","AnimationIteration"),animationstart:ha("Animation","AnimationStart"),transitionend:ha("Transition","TransitionEnd")},gc={},S0={};Si&&(S0=document.createElement("div").style,"AnimationEvent"in window||(delete us.animationend.animation,delete us.animationiteration.animation,delete us.animationstart.animation),"TransitionEvent"in window||delete us.transitionend.transition);function Hl(n){if(gc[n])return gc[n];if(!us[n])return n;var e=us[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in S0)return gc[n]=e[t];return n}var E0=Hl("animationend"),w0=Hl("animationiteration"),T0=Hl("animationstart"),A0=Hl("transitionend"),R0=new Map,Ph="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function or(n,e){R0.set(n,e),zr(e,[n])}for(var vc=0;vc<Ph.length;vc++){var xc=Ph[vc],o_=xc.toLowerCase(),a_=xc[0].toUpperCase()+xc.slice(1);or(o_,"on"+a_)}or(E0,"onAnimationEnd");or(w0,"onAnimationIteration");or(T0,"onAnimationStart");or("dblclick","onDoubleClick");or("focusin","onFocus");or("focusout","onBlur");or(A0,"onTransitionEnd");Rs("onMouseEnter",["mouseout","mouseover"]);Rs("onMouseLeave",["mouseout","mouseover"]);Rs("onPointerEnter",["pointerout","pointerover"]);Rs("onPointerLeave",["pointerout","pointerover"]);zr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));zr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));zr("onBeforeInput",["compositionend","keypress","textInput","paste"]);zr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));zr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));zr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var mo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),l_=new Set("cancel close invalid load scroll toggle".split(" ").concat(mo));function Lh(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,ox(i,e,void 0,n),n.currentTarget=null}function C0(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;Lh(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;Lh(r,a,c),s=l}}}if(hl)throw n=wu,hl=!1,wu=null,n}function ht(n,e){var t=e[Iu];t===void 0&&(t=e[Iu]=new Set);var i=n+"__bubble";t.has(i)||(b0(e,n,2,!1),t.add(i))}function _c(n,e,t){var i=0;e&&(i|=4),b0(t,n,i,e)}var pa="_reactListening"+Math.random().toString(36).slice(2);function Oo(n){if(!n[pa]){n[pa]=!0,Fm.forEach(function(t){t!=="selectionchange"&&(l_.has(t)||_c(t,!1,n),_c(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[pa]||(e[pa]=!0,_c("selectionchange",!1,e))}}function b0(n,e,t,i){switch(f0(e)){case 1:var r=Sx;break;case 4:r=Ex;break;default:r=tf}t=r.bind(null,e,t,n),r=void 0,!Eu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function yc(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Er(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}Qm(function(){var c=s,d=Zd(t),f=[];e:{var h=R0.get(n);if(h!==void 0){var p=rf,g=n;switch(n){case"keypress":if(Za(t)===0)break e;case"keydown":case"keyup":p=kx;break;case"focusin":g="focus",p=hc;break;case"focusout":g="blur",p=hc;break;case"beforeblur":case"afterblur":p=hc;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=_h;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Ax;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Vx;break;case E0:case w0:case T0:p=bx;break;case A0:p=Hx;break;case"scroll":p=wx;break;case"wheel":p=jx;break;case"copy":case"cut":case"paste":p=Lx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Mh}var _=(e&4)!==0,m=!_&&n==="scroll",u=_?h!==null?h+"Capture":null:h;_=[];for(var v=c,x;v!==null;){x=v;var y=x.stateNode;if(x.tag===5&&y!==null&&(x=y,u!==null&&(y=Lo(v,u),y!=null&&_.push(ko(v,y,x)))),m)break;v=v.return}0<_.length&&(h=new p(h,g,null,t,d),f.push({event:h,listeners:_}))}}if(!(e&7)){e:{if(h=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",h&&t!==Mu&&(g=t.relatedTarget||t.fromElement)&&(Er(g)||g[Ei]))break e;if((p||h)&&(h=d.window===d?d:(h=d.ownerDocument)?h.defaultView||h.parentWindow:window,p?(g=t.relatedTarget||t.toElement,p=c,g=g?Er(g):null,g!==null&&(m=Vr(g),g!==m||g.tag!==5&&g.tag!==6)&&(g=null)):(p=null,g=c),p!==g)){if(_=_h,y="onMouseLeave",u="onMouseEnter",v="mouse",(n==="pointerout"||n==="pointerover")&&(_=Mh,y="onPointerLeave",u="onPointerEnter",v="pointer"),m=p==null?h:ds(p),x=g==null?h:ds(g),h=new _(y,v+"leave",p,t,d),h.target=m,h.relatedTarget=x,y=null,Er(d)===c&&(_=new _(u,v+"enter",g,t,d),_.target=x,_.relatedTarget=m,y=_),m=y,p&&g)t:{for(_=p,u=g,v=0,x=_;x;x=Wr(x))v++;for(x=0,y=u;y;y=Wr(y))x++;for(;0<v-x;)_=Wr(_),v--;for(;0<x-v;)u=Wr(u),x--;for(;v--;){if(_===u||u!==null&&_===u.alternate)break t;_=Wr(_),u=Wr(u)}_=null}else _=null;p!==null&&Dh(f,h,p,_,!1),g!==null&&m!==null&&Dh(f,m,g,_,!0)}}e:{if(h=c?ds(c):window,p=h.nodeName&&h.nodeName.toLowerCase(),p==="select"||p==="input"&&h.type==="file")var P=Qx;else if(wh(h))if(x0)P=n_;else{P=e_;var E=Jx}else(p=h.nodeName)&&p.toLowerCase()==="input"&&(h.type==="checkbox"||h.type==="radio")&&(P=t_);if(P&&(P=P(n,c))){v0(f,P,t,d);break e}E&&E(n,h,c),n==="focusout"&&(E=h._wrapperState)&&E.controlled&&h.type==="number"&&gu(h,"number",h.value)}switch(E=c?ds(c):window,n){case"focusin":(wh(E)||E.contentEditable==="true")&&(cs=E,Cu=c,So=null);break;case"focusout":So=Cu=cs=null;break;case"mousedown":bu=!0;break;case"contextmenu":case"mouseup":case"dragend":bu=!1,bh(f,t,d);break;case"selectionchange":if(s_)break;case"keydown":case"keyup":bh(f,t,d)}var A;if(of)e:{switch(n){case"compositionstart":var R="onCompositionStart";break e;case"compositionend":R="onCompositionEnd";break e;case"compositionupdate":R="onCompositionUpdate";break e}R=void 0}else ls?m0(n,t)&&(R="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(R="onCompositionStart");R&&(p0&&t.locale!=="ko"&&(ls||R!=="onCompositionStart"?R==="onCompositionEnd"&&ls&&(A=h0()):(Gi=d,nf="value"in Gi?Gi.value:Gi.textContent,ls=!0)),E=xl(c,R),0<E.length&&(R=new yh(R,n,null,t,d),f.push({event:R,listeners:E}),A?R.data=A:(A=g0(t),A!==null&&(R.data=A)))),(A=Yx?qx(n,t):$x(n,t))&&(c=xl(c,"onBeforeInput"),0<c.length&&(d=new yh("onBeforeInput","beforeinput",null,t,d),f.push({event:d,listeners:c}),d.data=A))}C0(f,e)})}function ko(n,e,t){return{instance:n,listener:e,currentTarget:t}}function xl(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Lo(n,t),s!=null&&i.unshift(ko(n,s,r)),s=Lo(n,e),s!=null&&i.push(ko(n,s,r))),n=n.return}return i}function Wr(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Dh(n,e,t,i,r){for(var s=e._reactName,o=[];t!==null&&t!==i;){var a=t,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=Lo(t,s),l!=null&&o.unshift(ko(t,l,a))):r||(l=Lo(t,s),l!=null&&o.push(ko(t,l,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var c_=/\r\n?/g,u_=/\u0000|\uFFFD/g;function Nh(n){return(typeof n=="string"?n:""+n).replace(c_,`
`).replace(u_,"")}function ma(n,e,t){if(e=Nh(e),Nh(n)!==e&&t)throw Error(ie(425))}function _l(){}var Pu=null,Lu=null;function Du(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Nu=typeof setTimeout=="function"?setTimeout:void 0,d_=typeof clearTimeout=="function"?clearTimeout:void 0,Ih=typeof Promise=="function"?Promise:void 0,f_=typeof queueMicrotask=="function"?queueMicrotask:typeof Ih<"u"?function(n){return Ih.resolve(null).then(n).catch(h_)}:Nu;function h_(n){setTimeout(function(){throw n})}function Mc(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),Io(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);Io(e)}function Yi(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function Uh(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Gs=Math.random().toString(36).slice(2),ti="__reactFiber$"+Gs,Bo="__reactProps$"+Gs,Ei="__reactContainer$"+Gs,Iu="__reactEvents$"+Gs,p_="__reactListeners$"+Gs,m_="__reactHandles$"+Gs;function Er(n){var e=n[ti];if(e)return e;for(var t=n.parentNode;t;){if(e=t[Ei]||t[ti]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=Uh(n);n!==null;){if(t=n[ti])return t;n=Uh(n)}return e}n=t,t=n.parentNode}return null}function Qo(n){return n=n[ti]||n[Ei],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ds(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(ie(33))}function Wl(n){return n[Bo]||null}var Uu=[],fs=-1;function ar(n){return{current:n}}function pt(n){0>fs||(n.current=Uu[fs],Uu[fs]=null,fs--)}function lt(n,e){fs++,Uu[fs]=n.current,n.current=e}var ir={},qt=ar(ir),ln=ar(!1),Lr=ir;function Cs(n,e){var t=n.type.contextTypes;if(!t)return ir;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function cn(n){return n=n.childContextTypes,n!=null}function yl(){pt(ln),pt(qt)}function Fh(n,e,t){if(qt.current!==ir)throw Error(ie(168));lt(qt,e),lt(ln,t)}function P0(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ie(108,Jv(n)||"Unknown",r));return Mt({},t,i)}function Ml(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||ir,Lr=qt.current,lt(qt,n),lt(ln,ln.current),!0}function Oh(n,e,t){var i=n.stateNode;if(!i)throw Error(ie(169));t?(n=P0(n,e,Lr),i.__reactInternalMemoizedMergedChildContext=n,pt(ln),pt(qt),lt(qt,n)):pt(ln),lt(ln,t)}var mi=null,jl=!1,Sc=!1;function L0(n){mi===null?mi=[n]:mi.push(n)}function g_(n){jl=!0,L0(n)}function lr(){if(!Sc&&mi!==null){Sc=!0;var n=0,e=it;try{var t=mi;for(it=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}mi=null,jl=!1}catch(r){throw mi!==null&&(mi=mi.slice(n+1)),n0(Qd,lr),r}finally{it=e,Sc=!1}}return null}var hs=[],ps=0,Sl=null,El=0,Cn=[],bn=0,Dr=null,gi=1,vi="";function vr(n,e){hs[ps++]=El,hs[ps++]=Sl,Sl=n,El=e}function D0(n,e,t){Cn[bn++]=gi,Cn[bn++]=vi,Cn[bn++]=Dr,Dr=n;var i=gi;n=vi;var r=32-Yn(i)-1;i&=~(1<<r),t+=1;var s=32-Yn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,gi=1<<32-Yn(e)+r|t<<r|i,vi=s+n}else gi=1<<s|t<<r|i,vi=n}function lf(n){n.return!==null&&(vr(n,1),D0(n,1,0))}function cf(n){for(;n===Sl;)Sl=hs[--ps],hs[ps]=null,El=hs[--ps],hs[ps]=null;for(;n===Dr;)Dr=Cn[--bn],Cn[bn]=null,vi=Cn[--bn],Cn[bn]=null,gi=Cn[--bn],Cn[bn]=null}var _n=null,xn=null,mt=!1,Hn=null;function N0(n,e){var t=Pn(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function kh(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,_n=n,xn=Yi(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,_n=n,xn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=Dr!==null?{id:gi,overflow:vi}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Pn(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,_n=n,xn=null,!0):!1;default:return!1}}function Fu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Ou(n){if(mt){var e=xn;if(e){var t=e;if(!kh(n,e)){if(Fu(n))throw Error(ie(418));e=Yi(t.nextSibling);var i=_n;e&&kh(n,e)?N0(i,t):(n.flags=n.flags&-4097|2,mt=!1,_n=n)}}else{if(Fu(n))throw Error(ie(418));n.flags=n.flags&-4097|2,mt=!1,_n=n}}}function Bh(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;_n=n}function ga(n){if(n!==_n)return!1;if(!mt)return Bh(n),mt=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!Du(n.type,n.memoizedProps)),e&&(e=xn)){if(Fu(n))throw I0(),Error(ie(418));for(;e;)N0(n,e),e=Yi(e.nextSibling)}if(Bh(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(ie(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){xn=Yi(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}xn=null}}else xn=_n?Yi(n.stateNode.nextSibling):null;return!0}function I0(){for(var n=xn;n;)n=Yi(n.nextSibling)}function bs(){xn=_n=null,mt=!1}function uf(n){Hn===null?Hn=[n]:Hn.push(n)}var v_=Ri.ReactCurrentBatchConfig;function no(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(ie(309));var i=t.stateNode}if(!i)throw Error(ie(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(ie(284));if(!t._owner)throw Error(ie(290,n))}return n}function va(n,e){throw n=Object.prototype.toString.call(e),Error(ie(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function zh(n){var e=n._init;return e(n._payload)}function U0(n){function e(u,v){if(n){var x=u.deletions;x===null?(u.deletions=[v],u.flags|=16):x.push(v)}}function t(u,v){if(!n)return null;for(;v!==null;)e(u,v),v=v.sibling;return null}function i(u,v){for(u=new Map;v!==null;)v.key!==null?u.set(v.key,v):u.set(v.index,v),v=v.sibling;return u}function r(u,v){return u=Zi(u,v),u.index=0,u.sibling=null,u}function s(u,v,x){return u.index=x,n?(x=u.alternate,x!==null?(x=x.index,x<v?(u.flags|=2,v):x):(u.flags|=2,v)):(u.flags|=1048576,v)}function o(u){return n&&u.alternate===null&&(u.flags|=2),u}function a(u,v,x,y){return v===null||v.tag!==6?(v=bc(x,u.mode,y),v.return=u,v):(v=r(v,x),v.return=u,v)}function l(u,v,x,y){var P=x.type;return P===as?d(u,v,x.props.children,y,x.key):v!==null&&(v.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Oi&&zh(P)===v.type)?(y=r(v,x.props),y.ref=no(u,v,x),y.return=u,y):(y=rl(x.type,x.key,x.props,null,u.mode,y),y.ref=no(u,v,x),y.return=u,y)}function c(u,v,x,y){return v===null||v.tag!==4||v.stateNode.containerInfo!==x.containerInfo||v.stateNode.implementation!==x.implementation?(v=Pc(x,u.mode,y),v.return=u,v):(v=r(v,x.children||[]),v.return=u,v)}function d(u,v,x,y,P){return v===null||v.tag!==7?(v=br(x,u.mode,y,P),v.return=u,v):(v=r(v,x),v.return=u,v)}function f(u,v,x){if(typeof v=="string"&&v!==""||typeof v=="number")return v=bc(""+v,u.mode,x),v.return=u,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case oa:return x=rl(v.type,v.key,v.props,null,u.mode,x),x.ref=no(u,null,v),x.return=u,x;case os:return v=Pc(v,u.mode,x),v.return=u,v;case Oi:var y=v._init;return f(u,y(v._payload),x)}if(ho(v)||Zs(v))return v=br(v,u.mode,x,null),v.return=u,v;va(u,v)}return null}function h(u,v,x,y){var P=v!==null?v.key:null;if(typeof x=="string"&&x!==""||typeof x=="number")return P!==null?null:a(u,v,""+x,y);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case oa:return x.key===P?l(u,v,x,y):null;case os:return x.key===P?c(u,v,x,y):null;case Oi:return P=x._init,h(u,v,P(x._payload),y)}if(ho(x)||Zs(x))return P!==null?null:d(u,v,x,y,null);va(u,x)}return null}function p(u,v,x,y,P){if(typeof y=="string"&&y!==""||typeof y=="number")return u=u.get(x)||null,a(v,u,""+y,P);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case oa:return u=u.get(y.key===null?x:y.key)||null,l(v,u,y,P);case os:return u=u.get(y.key===null?x:y.key)||null,c(v,u,y,P);case Oi:var E=y._init;return p(u,v,x,E(y._payload),P)}if(ho(y)||Zs(y))return u=u.get(x)||null,d(v,u,y,P,null);va(v,y)}return null}function g(u,v,x,y){for(var P=null,E=null,A=v,R=v=0,w=null;A!==null&&R<x.length;R++){A.index>R?(w=A,A=null):w=A.sibling;var M=h(u,A,x[R],y);if(M===null){A===null&&(A=w);break}n&&A&&M.alternate===null&&e(u,A),v=s(M,v,R),E===null?P=M:E.sibling=M,E=M,A=w}if(R===x.length)return t(u,A),mt&&vr(u,R),P;if(A===null){for(;R<x.length;R++)A=f(u,x[R],y),A!==null&&(v=s(A,v,R),E===null?P=A:E.sibling=A,E=A);return mt&&vr(u,R),P}for(A=i(u,A);R<x.length;R++)w=p(A,u,R,x[R],y),w!==null&&(n&&w.alternate!==null&&A.delete(w.key===null?R:w.key),v=s(w,v,R),E===null?P=w:E.sibling=w,E=w);return n&&A.forEach(function(D){return e(u,D)}),mt&&vr(u,R),P}function _(u,v,x,y){var P=Zs(x);if(typeof P!="function")throw Error(ie(150));if(x=P.call(x),x==null)throw Error(ie(151));for(var E=P=null,A=v,R=v=0,w=null,M=x.next();A!==null&&!M.done;R++,M=x.next()){A.index>R?(w=A,A=null):w=A.sibling;var D=h(u,A,M.value,y);if(D===null){A===null&&(A=w);break}n&&A&&D.alternate===null&&e(u,A),v=s(D,v,R),E===null?P=D:E.sibling=D,E=D,A=w}if(M.done)return t(u,A),mt&&vr(u,R),P;if(A===null){for(;!M.done;R++,M=x.next())M=f(u,M.value,y),M!==null&&(v=s(M,v,R),E===null?P=M:E.sibling=M,E=M);return mt&&vr(u,R),P}for(A=i(u,A);!M.done;R++,M=x.next())M=p(A,u,R,M.value,y),M!==null&&(n&&M.alternate!==null&&A.delete(M.key===null?R:M.key),v=s(M,v,R),E===null?P=M:E.sibling=M,E=M);return n&&A.forEach(function(V){return e(u,V)}),mt&&vr(u,R),P}function m(u,v,x,y){if(typeof x=="object"&&x!==null&&x.type===as&&x.key===null&&(x=x.props.children),typeof x=="object"&&x!==null){switch(x.$$typeof){case oa:e:{for(var P=x.key,E=v;E!==null;){if(E.key===P){if(P=x.type,P===as){if(E.tag===7){t(u,E.sibling),v=r(E,x.props.children),v.return=u,u=v;break e}}else if(E.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Oi&&zh(P)===E.type){t(u,E.sibling),v=r(E,x.props),v.ref=no(u,E,x),v.return=u,u=v;break e}t(u,E);break}else e(u,E);E=E.sibling}x.type===as?(v=br(x.props.children,u.mode,y,x.key),v.return=u,u=v):(y=rl(x.type,x.key,x.props,null,u.mode,y),y.ref=no(u,v,x),y.return=u,u=y)}return o(u);case os:e:{for(E=x.key;v!==null;){if(v.key===E)if(v.tag===4&&v.stateNode.containerInfo===x.containerInfo&&v.stateNode.implementation===x.implementation){t(u,v.sibling),v=r(v,x.children||[]),v.return=u,u=v;break e}else{t(u,v);break}else e(u,v);v=v.sibling}v=Pc(x,u.mode,y),v.return=u,u=v}return o(u);case Oi:return E=x._init,m(u,v,E(x._payload),y)}if(ho(x))return g(u,v,x,y);if(Zs(x))return _(u,v,x,y);va(u,x)}return typeof x=="string"&&x!==""||typeof x=="number"?(x=""+x,v!==null&&v.tag===6?(t(u,v.sibling),v=r(v,x),v.return=u,u=v):(t(u,v),v=bc(x,u.mode,y),v.return=u,u=v),o(u)):t(u,v)}return m}var Ps=U0(!0),F0=U0(!1),wl=ar(null),Tl=null,ms=null,df=null;function ff(){df=ms=Tl=null}function hf(n){var e=wl.current;pt(wl),n._currentValue=e}function ku(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function Es(n,e){Tl=n,df=ms=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(an=!0),n.firstContext=null)}function Nn(n){var e=n._currentValue;if(df!==n)if(n={context:n,memoizedValue:e,next:null},ms===null){if(Tl===null)throw Error(ie(308));ms=n,Tl.dependencies={lanes:0,firstContext:n}}else ms=ms.next=n;return e}var wr=null;function pf(n){wr===null?wr=[n]:wr.push(n)}function O0(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,pf(e)):(t.next=r.next,r.next=t),e.interleaved=t,wi(n,i)}function wi(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var ki=!1;function mf(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function k0(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function yi(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function qi(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,Ke&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,wi(n,t)}return r=i.interleaved,r===null?(e.next=e,pf(i)):(e.next=r.next,r.next=e),i.interleaved=e,wi(n,t)}function Qa(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Jd(n,t)}}function Vh(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function Al(n,e,t,i){var r=n.updateQueue;ki=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var d=n.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==o&&(a===null?d.firstBaseUpdate=c:a.next=c,d.lastBaseUpdate=l))}if(s!==null){var f=r.baseState;o=0,d=c=l=null,a=s;do{var h=a.lane,p=a.eventTime;if((i&h)===h){d!==null&&(d=d.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var g=n,_=a;switch(h=e,p=t,_.tag){case 1:if(g=_.payload,typeof g=="function"){f=g.call(p,f,h);break e}f=g;break e;case 3:g.flags=g.flags&-65537|128;case 0:if(g=_.payload,h=typeof g=="function"?g.call(p,f,h):g,h==null)break e;f=Mt({},f,h);break e;case 2:ki=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,h=r.effects,h===null?r.effects=[a]:h.push(a))}else p={eventTime:p,lane:h,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(c=d=p,l=f):d=d.next=p,o|=h;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;h=a,a=h.next,h.next=null,r.lastBaseUpdate=h,r.shared.pending=null}}while(!0);if(d===null&&(l=f),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Ir|=o,n.lanes=o,n.memoizedState=f}}function Gh(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(ie(191,r));r.call(i)}}}var Jo={},ri=ar(Jo),zo=ar(Jo),Vo=ar(Jo);function Tr(n){if(n===Jo)throw Error(ie(174));return n}function gf(n,e){switch(lt(Vo,e),lt(zo,n),lt(ri,Jo),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:xu(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=xu(e,n)}pt(ri),lt(ri,e)}function Ls(){pt(ri),pt(zo),pt(Vo)}function B0(n){Tr(Vo.current);var e=Tr(ri.current),t=xu(e,n.type);e!==t&&(lt(zo,n),lt(ri,t))}function vf(n){zo.current===n&&(pt(ri),pt(zo))}var _t=ar(0);function Rl(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Ec=[];function xf(){for(var n=0;n<Ec.length;n++)Ec[n]._workInProgressVersionPrimary=null;Ec.length=0}var Ja=Ri.ReactCurrentDispatcher,wc=Ri.ReactCurrentBatchConfig,Nr=0,yt=null,bt=null,It=null,Cl=!1,Eo=!1,Go=0,x_=0;function Gt(){throw Error(ie(321))}function _f(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!Kn(n[t],e[t]))return!1;return!0}function yf(n,e,t,i,r,s){if(Nr=s,yt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Ja.current=n===null||n.memoizedState===null?S_:E_,n=t(i,r),Eo){s=0;do{if(Eo=!1,Go=0,25<=s)throw Error(ie(301));s+=1,It=bt=null,e.updateQueue=null,Ja.current=w_,n=t(i,r)}while(Eo)}if(Ja.current=bl,e=bt!==null&&bt.next!==null,Nr=0,It=bt=yt=null,Cl=!1,e)throw Error(ie(300));return n}function Mf(){var n=Go!==0;return Go=0,n}function Jn(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return It===null?yt.memoizedState=It=n:It=It.next=n,It}function In(){if(bt===null){var n=yt.alternate;n=n!==null?n.memoizedState:null}else n=bt.next;var e=It===null?yt.memoizedState:It.next;if(e!==null)It=e,bt=n;else{if(n===null)throw Error(ie(310));bt=n,n={memoizedState:bt.memoizedState,baseState:bt.baseState,baseQueue:bt.baseQueue,queue:bt.queue,next:null},It===null?yt.memoizedState=It=n:It=It.next=n}return It}function Ho(n,e){return typeof e=="function"?e(n):e}function Tc(n){var e=In(),t=e.queue;if(t===null)throw Error(ie(311));t.lastRenderedReducer=n;var i=bt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var d=c.lane;if((Nr&d)===d)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:n(i,c.action);else{var f={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=f,o=i):l=l.next=f,yt.lanes|=d,Ir|=d}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,Kn(i,e.memoizedState)||(an=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,yt.lanes|=s,Ir|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function Ac(n){var e=In(),t=e.queue;if(t===null)throw Error(ie(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var o=r=r.next;do s=n(s,o.action),o=o.next;while(o!==r);Kn(s,e.memoizedState)||(an=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function z0(){}function V0(n,e){var t=yt,i=In(),r=e(),s=!Kn(i.memoizedState,r);if(s&&(i.memoizedState=r,an=!0),i=i.queue,Sf(W0.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||It!==null&&It.memoizedState.tag&1){if(t.flags|=2048,Wo(9,H0.bind(null,t,i,r,e),void 0,null),Ut===null)throw Error(ie(349));Nr&30||G0(t,e,r)}return r}function G0(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=yt.updateQueue,e===null?(e={lastEffect:null,stores:null},yt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function H0(n,e,t,i){e.value=t,e.getSnapshot=i,j0(e)&&X0(n)}function W0(n,e,t){return t(function(){j0(e)&&X0(n)})}function j0(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!Kn(n,t)}catch{return!0}}function X0(n){var e=wi(n,1);e!==null&&qn(e,n,1,-1)}function Hh(n){var e=Jn();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ho,lastRenderedState:n},e.queue=n,n=n.dispatch=M_.bind(null,yt,n),[e.memoizedState,n]}function Wo(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=yt.updateQueue,e===null?(e={lastEffect:null,stores:null},yt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function Y0(){return In().memoizedState}function el(n,e,t,i){var r=Jn();yt.flags|=n,r.memoizedState=Wo(1|e,t,void 0,i===void 0?null:i)}function Xl(n,e,t,i){var r=In();i=i===void 0?null:i;var s=void 0;if(bt!==null){var o=bt.memoizedState;if(s=o.destroy,i!==null&&_f(i,o.deps)){r.memoizedState=Wo(e,t,s,i);return}}yt.flags|=n,r.memoizedState=Wo(1|e,t,s,i)}function Wh(n,e){return el(8390656,8,n,e)}function Sf(n,e){return Xl(2048,8,n,e)}function q0(n,e){return Xl(4,2,n,e)}function $0(n,e){return Xl(4,4,n,e)}function K0(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function Z0(n,e,t){return t=t!=null?t.concat([n]):null,Xl(4,4,K0.bind(null,e,n),t)}function Ef(){}function Q0(n,e){var t=In();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&_f(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function J0(n,e){var t=In();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&_f(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function eg(n,e,t){return Nr&21?(Kn(t,e)||(t=s0(),yt.lanes|=t,Ir|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,an=!0),n.memoizedState=t)}function __(n,e){var t=it;it=t!==0&&4>t?t:4,n(!0);var i=wc.transition;wc.transition={};try{n(!1),e()}finally{it=t,wc.transition=i}}function tg(){return In().memoizedState}function y_(n,e,t){var i=Ki(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},ng(n))ig(e,t);else if(t=O0(n,e,t,i),t!==null){var r=Jt();qn(t,n,i,r),rg(t,e,i)}}function M_(n,e,t){var i=Ki(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(ng(n))ig(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,t);if(r.hasEagerState=!0,r.eagerState=a,Kn(a,o)){var l=e.interleaved;l===null?(r.next=r,pf(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=O0(n,e,r,i),t!==null&&(r=Jt(),qn(t,n,i,r),rg(t,e,i))}}function ng(n){var e=n.alternate;return n===yt||e!==null&&e===yt}function ig(n,e){Eo=Cl=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function rg(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Jd(n,t)}}var bl={readContext:Nn,useCallback:Gt,useContext:Gt,useEffect:Gt,useImperativeHandle:Gt,useInsertionEffect:Gt,useLayoutEffect:Gt,useMemo:Gt,useReducer:Gt,useRef:Gt,useState:Gt,useDebugValue:Gt,useDeferredValue:Gt,useTransition:Gt,useMutableSource:Gt,useSyncExternalStore:Gt,useId:Gt,unstable_isNewReconciler:!1},S_={readContext:Nn,useCallback:function(n,e){return Jn().memoizedState=[n,e===void 0?null:e],n},useContext:Nn,useEffect:Wh,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,el(4194308,4,K0.bind(null,e,n),t)},useLayoutEffect:function(n,e){return el(4194308,4,n,e)},useInsertionEffect:function(n,e){return el(4,2,n,e)},useMemo:function(n,e){var t=Jn();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=Jn();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=y_.bind(null,yt,n),[i.memoizedState,n]},useRef:function(n){var e=Jn();return n={current:n},e.memoizedState=n},useState:Hh,useDebugValue:Ef,useDeferredValue:function(n){return Jn().memoizedState=n},useTransition:function(){var n=Hh(!1),e=n[0];return n=__.bind(null,n[1]),Jn().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=yt,r=Jn();if(mt){if(t===void 0)throw Error(ie(407));t=t()}else{if(t=e(),Ut===null)throw Error(ie(349));Nr&30||G0(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,Wh(W0.bind(null,i,s,n),[n]),i.flags|=2048,Wo(9,H0.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=Jn(),e=Ut.identifierPrefix;if(mt){var t=vi,i=gi;t=(i&~(1<<32-Yn(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Go++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=x_++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},E_={readContext:Nn,useCallback:Q0,useContext:Nn,useEffect:Sf,useImperativeHandle:Z0,useInsertionEffect:q0,useLayoutEffect:$0,useMemo:J0,useReducer:Tc,useRef:Y0,useState:function(){return Tc(Ho)},useDebugValue:Ef,useDeferredValue:function(n){var e=In();return eg(e,bt.memoizedState,n)},useTransition:function(){var n=Tc(Ho)[0],e=In().memoizedState;return[n,e]},useMutableSource:z0,useSyncExternalStore:V0,useId:tg,unstable_isNewReconciler:!1},w_={readContext:Nn,useCallback:Q0,useContext:Nn,useEffect:Sf,useImperativeHandle:Z0,useInsertionEffect:q0,useLayoutEffect:$0,useMemo:J0,useReducer:Ac,useRef:Y0,useState:function(){return Ac(Ho)},useDebugValue:Ef,useDeferredValue:function(n){var e=In();return bt===null?e.memoizedState=n:eg(e,bt.memoizedState,n)},useTransition:function(){var n=Ac(Ho)[0],e=In().memoizedState;return[n,e]},useMutableSource:z0,useSyncExternalStore:V0,useId:tg,unstable_isNewReconciler:!1};function Vn(n,e){if(n&&n.defaultProps){e=Mt({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function Bu(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:Mt({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var Yl={isMounted:function(n){return(n=n._reactInternals)?Vr(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=Jt(),r=Ki(n),s=yi(i,r);s.payload=e,t!=null&&(s.callback=t),e=qi(n,s,r),e!==null&&(qn(e,n,r,i),Qa(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=Jt(),r=Ki(n),s=yi(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=qi(n,s,r),e!==null&&(qn(e,n,r,i),Qa(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=Jt(),i=Ki(n),r=yi(t,i);r.tag=2,e!=null&&(r.callback=e),e=qi(n,r,i),e!==null&&(qn(e,n,i,t),Qa(e,n,i))}};function jh(n,e,t,i,r,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Fo(t,i)||!Fo(r,s):!0}function sg(n,e,t){var i=!1,r=ir,s=e.contextType;return typeof s=="object"&&s!==null?s=Nn(s):(r=cn(e)?Lr:qt.current,i=e.contextTypes,s=(i=i!=null)?Cs(n,r):ir),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Yl,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function Xh(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&Yl.enqueueReplaceState(e,e.state,null)}function zu(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},mf(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Nn(s):(s=cn(e)?Lr:qt.current,r.context=Cs(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Bu(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Yl.enqueueReplaceState(r,r.state,null),Al(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function Ds(n,e){try{var t="",i=e;do t+=Qv(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Rc(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function Vu(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var T_=typeof WeakMap=="function"?WeakMap:Map;function og(n,e,t){t=yi(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){Ll||(Ll=!0,Zu=i),Vu(n,e)},t}function ag(n,e,t){t=yi(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){Vu(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){Vu(n,e),typeof i!="function"&&($i===null?$i=new Set([this]):$i.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function Yh(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new T_;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=B_.bind(null,n,e,t),e.then(n,n))}function qh(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function $h(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=yi(-1,1),e.tag=2,qi(t,e,1))),t.lanes|=1),n)}var A_=Ri.ReactCurrentOwner,an=!1;function Zt(n,e,t,i){e.child=n===null?F0(e,null,t,i):Ps(e,n.child,t,i)}function Kh(n,e,t,i,r){t=t.render;var s=e.ref;return Es(e,r),i=yf(n,e,t,i,s,r),t=Mf(),n!==null&&!an?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ti(n,e,r)):(mt&&t&&lf(e),e.flags|=1,Zt(n,e,i,r),e.child)}function Zh(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!Lf(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,lg(n,e,s,i,r)):(n=rl(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:Fo,t(o,i)&&n.ref===e.ref)return Ti(n,e,r)}return e.flags|=1,n=Zi(s,i),n.ref=e.ref,n.return=e,e.child=n}function lg(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(Fo(s,i)&&n.ref===e.ref)if(an=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(an=!0);else return e.lanes=n.lanes,Ti(n,e,r)}return Gu(n,e,t,i,r)}function cg(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},lt(vs,gn),gn|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,lt(vs,gn),gn|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,lt(vs,gn),gn|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,lt(vs,gn),gn|=i;return Zt(n,e,r,t),e.child}function ug(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function Gu(n,e,t,i,r){var s=cn(t)?Lr:qt.current;return s=Cs(e,s),Es(e,r),t=yf(n,e,t,i,s,r),i=Mf(),n!==null&&!an?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ti(n,e,r)):(mt&&i&&lf(e),e.flags|=1,Zt(n,e,t,r),e.child)}function Qh(n,e,t,i,r){if(cn(t)){var s=!0;Ml(e)}else s=!1;if(Es(e,r),e.stateNode===null)tl(n,e),sg(e,t,i),zu(e,t,i,r),i=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=t.contextType;typeof c=="object"&&c!==null?c=Nn(c):(c=cn(t)?Lr:qt.current,c=Cs(e,c));var d=t.getDerivedStateFromProps,f=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";f||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&Xh(e,o,i,c),ki=!1;var h=e.memoizedState;o.state=h,Al(e,i,o,r),l=e.memoizedState,a!==i||h!==l||ln.current||ki?(typeof d=="function"&&(Bu(e,t,d,i),l=e.memoizedState),(a=ki||jh(e,t,a,i,h,l,c))?(f||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,k0(n,e),a=e.memoizedProps,c=e.type===e.elementType?a:Vn(e.type,a),o.props=c,f=e.pendingProps,h=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=Nn(l):(l=cn(t)?Lr:qt.current,l=Cs(e,l));var p=t.getDerivedStateFromProps;(d=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==f||h!==l)&&Xh(e,o,i,l),ki=!1,h=e.memoizedState,o.state=h,Al(e,i,o,r);var g=e.memoizedState;a!==f||h!==g||ln.current||ki?(typeof p=="function"&&(Bu(e,t,p,i),g=e.memoizedState),(c=ki||jh(e,t,c,i,h,g,l)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,g,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,g,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=g),o.props=i,o.state=g,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&h===n.memoizedState||(e.flags|=1024),i=!1)}return Hu(n,e,t,i,s,r)}function Hu(n,e,t,i,r,s){ug(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Oh(e,t,!1),Ti(n,e,s);i=e.stateNode,A_.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=Ps(e,n.child,null,s),e.child=Ps(e,null,a,s)):Zt(n,e,a,s),e.memoizedState=i.state,r&&Oh(e,t,!0),e.child}function dg(n){var e=n.stateNode;e.pendingContext?Fh(n,e.pendingContext,e.pendingContext!==e.context):e.context&&Fh(n,e.context,!1),gf(n,e.containerInfo)}function Jh(n,e,t,i,r){return bs(),uf(r),e.flags|=256,Zt(n,e,t,i),e.child}var Wu={dehydrated:null,treeContext:null,retryLane:0};function ju(n){return{baseLanes:n,cachePool:null,transitions:null}}function fg(n,e,t){var i=e.pendingProps,r=_t.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),lt(_t,r&1),n===null)return Ou(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,n=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Kl(o,i,0,null),n=br(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=ju(t),e.memoizedState=Wu,n):wf(e,o));if(r=n.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return R_(n,e,o,i,a,r,t);if(s){s=i.fallback,o=e.mode,r=n.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Zi(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=Zi(a,s):(s=br(s,o,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=n.child.memoizedState,o=o===null?ju(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=Wu,i}return s=n.child,n=s.sibling,i=Zi(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function wf(n,e){return e=Kl({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function xa(n,e,t,i){return i!==null&&uf(i),Ps(e,n.child,null,t),n=wf(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function R_(n,e,t,i,r,s,o){if(t)return e.flags&256?(e.flags&=-257,i=Rc(Error(ie(422))),xa(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Kl({mode:"visible",children:i.children},r,0,null),s=br(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ps(e,n.child,null,o),e.child.memoizedState=ju(o),e.memoizedState=Wu,s);if(!(e.mode&1))return xa(n,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(ie(419)),i=Rc(s,i,void 0),xa(n,e,o,i)}if(a=(o&n.childLanes)!==0,an||a){if(i=Ut,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,wi(n,r),qn(i,n,r,-1))}return Pf(),i=Rc(Error(ie(421))),xa(n,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=z_.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,xn=Yi(r.nextSibling),_n=e,mt=!0,Hn=null,n!==null&&(Cn[bn++]=gi,Cn[bn++]=vi,Cn[bn++]=Dr,gi=n.id,vi=n.overflow,Dr=e),e=wf(e,i.children),e.flags|=4096,e)}function ep(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),ku(n.return,e,t)}function Cc(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function hg(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Zt(n,e,i.children,t),i=_t.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&ep(n,t,e);else if(n.tag===19)ep(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(lt(_t,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&Rl(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Cc(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&Rl(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Cc(e,!0,t,null,s);break;case"together":Cc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function tl(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Ti(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),Ir|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(ie(153));if(e.child!==null){for(n=e.child,t=Zi(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=Zi(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function C_(n,e,t){switch(e.tag){case 3:dg(e),bs();break;case 5:B0(e);break;case 1:cn(e.type)&&Ml(e);break;case 4:gf(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;lt(wl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(lt(_t,_t.current&1),e.flags|=128,null):t&e.child.childLanes?fg(n,e,t):(lt(_t,_t.current&1),n=Ti(n,e,t),n!==null?n.sibling:null);lt(_t,_t.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return hg(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),lt(_t,_t.current),i)break;return null;case 22:case 23:return e.lanes=0,cg(n,e,t)}return Ti(n,e,t)}var pg,Xu,mg,gg;pg=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};Xu=function(){};mg=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,Tr(ri.current);var s=null;switch(t){case"input":r=pu(n,r),i=pu(n,i),s=[];break;case"select":r=Mt({},r,{value:void 0}),i=Mt({},i,{value:void 0}),s=[];break;case"textarea":r=vu(n,r),i=vu(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=_l)}_u(t,i);var o;t=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(bo.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(bo.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&ht("scroll",n),s||a===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};gg=function(n,e,t,i){t!==i&&(e.flags|=4)};function io(n,e){if(!mt)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function Ht(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function b_(n,e,t){var i=e.pendingProps;switch(cf(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ht(e),null;case 1:return cn(e.type)&&yl(),Ht(e),null;case 3:return i=e.stateNode,Ls(),pt(ln),pt(qt),xf(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(ga(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Hn!==null&&(ed(Hn),Hn=null))),Xu(n,e),Ht(e),null;case 5:vf(e);var r=Tr(Vo.current);if(t=e.type,n!==null&&e.stateNode!=null)mg(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ie(166));return Ht(e),null}if(n=Tr(ri.current),ga(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[ti]=e,i[Bo]=s,n=(e.mode&1)!==0,t){case"dialog":ht("cancel",i),ht("close",i);break;case"iframe":case"object":case"embed":ht("load",i);break;case"video":case"audio":for(r=0;r<mo.length;r++)ht(mo[r],i);break;case"source":ht("error",i);break;case"img":case"image":case"link":ht("error",i),ht("load",i);break;case"details":ht("toggle",i);break;case"input":ch(i,s),ht("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ht("invalid",i);break;case"textarea":dh(i,s),ht("invalid",i)}_u(t,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&ma(i.textContent,a,n),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&ma(i.textContent,a,n),r=["children",""+a]):bo.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&ht("scroll",i)}switch(t){case"input":aa(i),uh(i,s,!0);break;case"textarea":aa(i),fh(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=_l)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=Wm(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[ti]=e,n[Bo]=i,pg(n,e,!1,!1),e.stateNode=n;e:{switch(o=yu(t,i),t){case"dialog":ht("cancel",n),ht("close",n),r=i;break;case"iframe":case"object":case"embed":ht("load",n),r=i;break;case"video":case"audio":for(r=0;r<mo.length;r++)ht(mo[r],n);r=i;break;case"source":ht("error",n),r=i;break;case"img":case"image":case"link":ht("error",n),ht("load",n),r=i;break;case"details":ht("toggle",n),r=i;break;case"input":ch(n,i),r=pu(n,i),ht("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=Mt({},i,{value:void 0}),ht("invalid",n);break;case"textarea":dh(n,i),r=vu(n,i),ht("invalid",n);break;default:r=i}_u(t,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Ym(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&jm(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&Po(n,l):typeof l=="number"&&Po(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(bo.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ht("scroll",n):l!=null&&Yd(n,s,l,o))}switch(t){case"input":aa(n),uh(n,i,!1);break;case"textarea":aa(n),fh(n);break;case"option":i.value!=null&&n.setAttribute("value",""+nr(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?_s(n,!!i.multiple,s,!1):i.defaultValue!=null&&_s(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=_l)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Ht(e),null;case 6:if(n&&e.stateNode!=null)gg(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ie(166));if(t=Tr(Vo.current),Tr(ri.current),ga(e)){if(i=e.stateNode,t=e.memoizedProps,i[ti]=e,(s=i.nodeValue!==t)&&(n=_n,n!==null))switch(n.tag){case 3:ma(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&ma(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[ti]=e,e.stateNode=i}return Ht(e),null;case 13:if(pt(_t),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(mt&&xn!==null&&e.mode&1&&!(e.flags&128))I0(),bs(),e.flags|=98560,s=!1;else if(s=ga(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(ie(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ie(317));s[ti]=e}else bs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Ht(e),s=!1}else Hn!==null&&(ed(Hn),Hn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||_t.current&1?Pt===0&&(Pt=3):Pf())),e.updateQueue!==null&&(e.flags|=4),Ht(e),null);case 4:return Ls(),Xu(n,e),n===null&&Oo(e.stateNode.containerInfo),Ht(e),null;case 10:return hf(e.type._context),Ht(e),null;case 17:return cn(e.type)&&yl(),Ht(e),null;case 19:if(pt(_t),s=e.memoizedState,s===null)return Ht(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)io(s,!1);else{if(Pt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=Rl(n),o!==null){for(e.flags|=128,io(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return lt(_t,_t.current&1|2),e.child}n=n.sibling}s.tail!==null&&At()>Ns&&(e.flags|=128,i=!0,io(s,!1),e.lanes=4194304)}else{if(!i)if(n=Rl(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),io(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!mt)return Ht(e),null}else 2*At()-s.renderingStartTime>Ns&&t!==1073741824&&(e.flags|=128,i=!0,io(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=At(),e.sibling=null,t=_t.current,lt(_t,i?t&1|2:t&1),e):(Ht(e),null);case 22:case 23:return bf(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?gn&1073741824&&(Ht(e),e.subtreeFlags&6&&(e.flags|=8192)):Ht(e),null;case 24:return null;case 25:return null}throw Error(ie(156,e.tag))}function P_(n,e){switch(cf(e),e.tag){case 1:return cn(e.type)&&yl(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Ls(),pt(ln),pt(qt),xf(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return vf(e),null;case 13:if(pt(_t),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(ie(340));bs()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return pt(_t),null;case 4:return Ls(),null;case 10:return hf(e.type._context),null;case 22:case 23:return bf(),null;case 24:return null;default:return null}}var _a=!1,Xt=!1,L_=typeof WeakSet=="function"?WeakSet:Set,xe=null;function gs(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){Et(n,e,i)}else t.current=null}function Yu(n,e,t){try{t()}catch(i){Et(n,e,i)}}var tp=!1;function D_(n,e){if(Pu=gl,n=M0(),af(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,c=0,d=0,f=n,h=null;t:for(;;){for(var p;f!==t||r!==0&&f.nodeType!==3||(a=o+r),f!==s||i!==0&&f.nodeType!==3||(l=o+i),f.nodeType===3&&(o+=f.nodeValue.length),(p=f.firstChild)!==null;)h=f,f=p;for(;;){if(f===n)break t;if(h===t&&++c===r&&(a=o),h===s&&++d===i&&(l=o),(p=f.nextSibling)!==null)break;f=h,h=f.parentNode}f=p}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(Lu={focusedElem:n,selectionRange:t},gl=!1,xe=e;xe!==null;)if(e=xe,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,xe=n;else for(;xe!==null;){e=xe;try{var g=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(g!==null){var _=g.memoizedProps,m=g.memoizedState,u=e.stateNode,v=u.getSnapshotBeforeUpdate(e.elementType===e.type?_:Vn(e.type,_),m);u.__reactInternalSnapshotBeforeUpdate=v}break;case 3:var x=e.stateNode.containerInfo;x.nodeType===1?x.textContent="":x.nodeType===9&&x.documentElement&&x.removeChild(x.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ie(163))}}catch(y){Et(e,e.return,y)}if(n=e.sibling,n!==null){n.return=e.return,xe=n;break}xe=e.return}return g=tp,tp=!1,g}function wo(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&Yu(e,t,s)}r=r.next}while(r!==i)}}function ql(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function qu(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function vg(n){var e=n.alternate;e!==null&&(n.alternate=null,vg(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[ti],delete e[Bo],delete e[Iu],delete e[p_],delete e[m_])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function xg(n){return n.tag===5||n.tag===3||n.tag===4}function np(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||xg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function $u(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=_l));else if(i!==4&&(n=n.child,n!==null))for($u(n,e,t),n=n.sibling;n!==null;)$u(n,e,t),n=n.sibling}function Ku(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(Ku(n,e,t),n=n.sibling;n!==null;)Ku(n,e,t),n=n.sibling}var Ot=null,Gn=!1;function Pi(n,e,t){for(t=t.child;t!==null;)_g(n,e,t),t=t.sibling}function _g(n,e,t){if(ii&&typeof ii.onCommitFiberUnmount=="function")try{ii.onCommitFiberUnmount(zl,t)}catch{}switch(t.tag){case 5:Xt||gs(t,e);case 6:var i=Ot,r=Gn;Ot=null,Pi(n,e,t),Ot=i,Gn=r,Ot!==null&&(Gn?(n=Ot,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Ot.removeChild(t.stateNode));break;case 18:Ot!==null&&(Gn?(n=Ot,t=t.stateNode,n.nodeType===8?Mc(n.parentNode,t):n.nodeType===1&&Mc(n,t),Io(n)):Mc(Ot,t.stateNode));break;case 4:i=Ot,r=Gn,Ot=t.stateNode.containerInfo,Gn=!0,Pi(n,e,t),Ot=i,Gn=r;break;case 0:case 11:case 14:case 15:if(!Xt&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Yu(t,e,o),r=r.next}while(r!==i)}Pi(n,e,t);break;case 1:if(!Xt&&(gs(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(a){Et(t,e,a)}Pi(n,e,t);break;case 21:Pi(n,e,t);break;case 22:t.mode&1?(Xt=(i=Xt)||t.memoizedState!==null,Pi(n,e,t),Xt=i):Pi(n,e,t);break;default:Pi(n,e,t)}}function ip(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new L_),e.forEach(function(i){var r=V_.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function On(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Ot=a.stateNode,Gn=!1;break e;case 3:Ot=a.stateNode.containerInfo,Gn=!0;break e;case 4:Ot=a.stateNode.containerInfo,Gn=!0;break e}a=a.return}if(Ot===null)throw Error(ie(160));_g(s,o,r),Ot=null,Gn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Et(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)yg(e,n),e=e.sibling}function yg(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(On(e,n),Qn(n),i&4){try{wo(3,n,n.return),ql(3,n)}catch(_){Et(n,n.return,_)}try{wo(5,n,n.return)}catch(_){Et(n,n.return,_)}}break;case 1:On(e,n),Qn(n),i&512&&t!==null&&gs(t,t.return);break;case 5:if(On(e,n),Qn(n),i&512&&t!==null&&gs(t,t.return),n.flags&32){var r=n.stateNode;try{Po(r,"")}catch(_){Et(n,n.return,_)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,a=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Gm(r,s),yu(a,o);var c=yu(a,s);for(o=0;o<l.length;o+=2){var d=l[o],f=l[o+1];d==="style"?Ym(r,f):d==="dangerouslySetInnerHTML"?jm(r,f):d==="children"?Po(r,f):Yd(r,d,f,c)}switch(a){case"input":mu(r,s);break;case"textarea":Hm(r,s);break;case"select":var h=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?_s(r,!!s.multiple,p,!1):h!==!!s.multiple&&(s.defaultValue!=null?_s(r,!!s.multiple,s.defaultValue,!0):_s(r,!!s.multiple,s.multiple?[]:"",!1))}r[Bo]=s}catch(_){Et(n,n.return,_)}}break;case 6:if(On(e,n),Qn(n),i&4){if(n.stateNode===null)throw Error(ie(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(_){Et(n,n.return,_)}}break;case 3:if(On(e,n),Qn(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{Io(e.containerInfo)}catch(_){Et(n,n.return,_)}break;case 4:On(e,n),Qn(n);break;case 13:On(e,n),Qn(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Rf=At())),i&4&&ip(n);break;case 22:if(d=t!==null&&t.memoizedState!==null,n.mode&1?(Xt=(c=Xt)||d,On(e,n),Xt=c):On(e,n),Qn(n),i&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!d&&n.mode&1)for(xe=n,d=n.child;d!==null;){for(f=xe=d;xe!==null;){switch(h=xe,p=h.child,h.tag){case 0:case 11:case 14:case 15:wo(4,h,h.return);break;case 1:gs(h,h.return);var g=h.stateNode;if(typeof g.componentWillUnmount=="function"){i=h,t=h.return;try{e=i,g.props=e.memoizedProps,g.state=e.memoizedState,g.componentWillUnmount()}catch(_){Et(i,t,_)}}break;case 5:gs(h,h.return);break;case 22:if(h.memoizedState!==null){sp(f);continue}}p!==null?(p.return=h,xe=p):sp(f)}d=d.sibling}e:for(d=null,f=n;;){if(f.tag===5){if(d===null){d=f;try{r=f.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=f.stateNode,l=f.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Xm("display",o))}catch(_){Et(n,n.return,_)}}}else if(f.tag===6){if(d===null)try{f.stateNode.nodeValue=c?"":f.memoizedProps}catch(_){Et(n,n.return,_)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===n)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===n)break e;for(;f.sibling===null;){if(f.return===null||f.return===n)break e;d===f&&(d=null),f=f.return}d===f&&(d=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:On(e,n),Qn(n),i&4&&ip(n);break;case 21:break;default:On(e,n),Qn(n)}}function Qn(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(xg(t)){var i=t;break e}t=t.return}throw Error(ie(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Po(r,""),i.flags&=-33);var s=np(n);Ku(n,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=np(n);$u(n,a,o);break;default:throw Error(ie(161))}}catch(l){Et(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function N_(n,e,t){xe=n,Mg(n)}function Mg(n,e,t){for(var i=(n.mode&1)!==0;xe!==null;){var r=xe,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||_a;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||Xt;a=_a;var c=Xt;if(_a=o,(Xt=l)&&!c)for(xe=r;xe!==null;)o=xe,l=o.child,o.tag===22&&o.memoizedState!==null?op(r):l!==null?(l.return=o,xe=l):op(r);for(;s!==null;)xe=s,Mg(s),s=s.sibling;xe=r,_a=a,Xt=c}rp(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,xe=s):rp(n)}}function rp(n){for(;xe!==null;){var e=xe;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Xt||ql(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Xt)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:Vn(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Gh(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}Gh(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var f=d.dehydrated;f!==null&&Io(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ie(163))}Xt||e.flags&512&&qu(e)}catch(h){Et(e,e.return,h)}}if(e===n){xe=null;break}if(t=e.sibling,t!==null){t.return=e.return,xe=t;break}xe=e.return}}function sp(n){for(;xe!==null;){var e=xe;if(e===n){xe=null;break}var t=e.sibling;if(t!==null){t.return=e.return,xe=t;break}xe=e.return}}function op(n){for(;xe!==null;){var e=xe;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{ql(4,e)}catch(l){Et(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Et(e,r,l)}}var s=e.return;try{qu(e)}catch(l){Et(e,s,l)}break;case 5:var o=e.return;try{qu(e)}catch(l){Et(e,o,l)}}}catch(l){Et(e,e.return,l)}if(e===n){xe=null;break}var a=e.sibling;if(a!==null){a.return=e.return,xe=a;break}xe=e.return}}var I_=Math.ceil,Pl=Ri.ReactCurrentDispatcher,Tf=Ri.ReactCurrentOwner,Ln=Ri.ReactCurrentBatchConfig,Ke=0,Ut=null,Ct=null,kt=0,gn=0,vs=ar(0),Pt=0,jo=null,Ir=0,$l=0,Af=0,To=null,on=null,Rf=0,Ns=1/0,pi=null,Ll=!1,Zu=null,$i=null,ya=!1,Hi=null,Dl=0,Ao=0,Qu=null,nl=-1,il=0;function Jt(){return Ke&6?At():nl!==-1?nl:nl=At()}function Ki(n){return n.mode&1?Ke&2&&kt!==0?kt&-kt:v_.transition!==null?(il===0&&(il=s0()),il):(n=it,n!==0||(n=window.event,n=n===void 0?16:f0(n.type)),n):1}function qn(n,e,t,i){if(50<Ao)throw Ao=0,Qu=null,Error(ie(185));Ko(n,t,i),(!(Ke&2)||n!==Ut)&&(n===Ut&&(!(Ke&2)&&($l|=t),Pt===4&&zi(n,kt)),un(n,i),t===1&&Ke===0&&!(e.mode&1)&&(Ns=At()+500,jl&&lr()))}function un(n,e){var t=n.callbackNode;vx(n,e);var i=ml(n,n===Ut?kt:0);if(i===0)t!==null&&mh(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&mh(t),e===1)n.tag===0?g_(ap.bind(null,n)):L0(ap.bind(null,n)),f_(function(){!(Ke&6)&&lr()}),t=null;else{switch(o0(i)){case 1:t=Qd;break;case 4:t=i0;break;case 16:t=pl;break;case 536870912:t=r0;break;default:t=pl}t=bg(t,Sg.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function Sg(n,e){if(nl=-1,il=0,Ke&6)throw Error(ie(327));var t=n.callbackNode;if(ws()&&n.callbackNode!==t)return null;var i=ml(n,n===Ut?kt:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=Nl(n,i);else{e=i;var r=Ke;Ke|=2;var s=wg();(Ut!==n||kt!==e)&&(pi=null,Ns=At()+500,Cr(n,e));do try{O_();break}catch(a){Eg(n,a)}while(!0);ff(),Pl.current=s,Ke=r,Ct!==null?e=0:(Ut=null,kt=0,e=Pt)}if(e!==0){if(e===2&&(r=Tu(n),r!==0&&(i=r,e=Ju(n,r))),e===1)throw t=jo,Cr(n,0),zi(n,i),un(n,At()),t;if(e===6)zi(n,i);else{if(r=n.current.alternate,!(i&30)&&!U_(r)&&(e=Nl(n,i),e===2&&(s=Tu(n),s!==0&&(i=s,e=Ju(n,s))),e===1))throw t=jo,Cr(n,0),zi(n,i),un(n,At()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(ie(345));case 2:xr(n,on,pi);break;case 3:if(zi(n,i),(i&130023424)===i&&(e=Rf+500-At(),10<e)){if(ml(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){Jt(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=Nu(xr.bind(null,n,on,pi),e);break}xr(n,on,pi);break;case 4:if(zi(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var o=31-Yn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=At()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*I_(i/1960))-i,10<i){n.timeoutHandle=Nu(xr.bind(null,n,on,pi),i);break}xr(n,on,pi);break;case 5:xr(n,on,pi);break;default:throw Error(ie(329))}}}return un(n,At()),n.callbackNode===t?Sg.bind(null,n):null}function Ju(n,e){var t=To;return n.current.memoizedState.isDehydrated&&(Cr(n,e).flags|=256),n=Nl(n,e),n!==2&&(e=on,on=t,e!==null&&ed(e)),n}function ed(n){on===null?on=n:on.push.apply(on,n)}function U_(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!Kn(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function zi(n,e){for(e&=~Af,e&=~$l,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-Yn(e),i=1<<t;n[t]=-1,e&=~i}}function ap(n){if(Ke&6)throw Error(ie(327));ws();var e=ml(n,0);if(!(e&1))return un(n,At()),null;var t=Nl(n,e);if(n.tag!==0&&t===2){var i=Tu(n);i!==0&&(e=i,t=Ju(n,i))}if(t===1)throw t=jo,Cr(n,0),zi(n,e),un(n,At()),t;if(t===6)throw Error(ie(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,xr(n,on,pi),un(n,At()),null}function Cf(n,e){var t=Ke;Ke|=1;try{return n(e)}finally{Ke=t,Ke===0&&(Ns=At()+500,jl&&lr())}}function Ur(n){Hi!==null&&Hi.tag===0&&!(Ke&6)&&ws();var e=Ke;Ke|=1;var t=Ln.transition,i=it;try{if(Ln.transition=null,it=1,n)return n()}finally{it=i,Ln.transition=t,Ke=e,!(Ke&6)&&lr()}}function bf(){gn=vs.current,pt(vs)}function Cr(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,d_(t)),Ct!==null)for(t=Ct.return;t!==null;){var i=t;switch(cf(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&yl();break;case 3:Ls(),pt(ln),pt(qt),xf();break;case 5:vf(i);break;case 4:Ls();break;case 13:pt(_t);break;case 19:pt(_t);break;case 10:hf(i.type._context);break;case 22:case 23:bf()}t=t.return}if(Ut=n,Ct=n=Zi(n.current,null),kt=gn=e,Pt=0,jo=null,Af=$l=Ir=0,on=To=null,wr!==null){for(e=0;e<wr.length;e++)if(t=wr[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}t.pending=i}wr=null}return n}function Eg(n,e){do{var t=Ct;try{if(ff(),Ja.current=bl,Cl){for(var i=yt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Cl=!1}if(Nr=0,It=bt=yt=null,Eo=!1,Go=0,Tf.current=null,t===null||t.return===null){Pt=1,jo=e,Ct=null;break}e:{var s=n,o=t.return,a=t,l=e;if(e=kt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,d=a,f=d.tag;if(!(d.mode&1)&&(f===0||f===11||f===15)){var h=d.alternate;h?(d.updateQueue=h.updateQueue,d.memoizedState=h.memoizedState,d.lanes=h.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=qh(o);if(p!==null){p.flags&=-257,$h(p,o,a,s,e),p.mode&1&&Yh(s,c,e),e=p,l=c;var g=e.updateQueue;if(g===null){var _=new Set;_.add(l),e.updateQueue=_}else g.add(l);break e}else{if(!(e&1)){Yh(s,c,e),Pf();break e}l=Error(ie(426))}}else if(mt&&a.mode&1){var m=qh(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),$h(m,o,a,s,e),uf(Ds(l,a));break e}}s=l=Ds(l,a),Pt!==4&&(Pt=2),To===null?To=[s]:To.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=og(s,l,e);Vh(s,u);break e;case 1:a=l;var v=s.type,x=s.stateNode;if(!(s.flags&128)&&(typeof v.getDerivedStateFromError=="function"||x!==null&&typeof x.componentDidCatch=="function"&&($i===null||!$i.has(x)))){s.flags|=65536,e&=-e,s.lanes|=e;var y=ag(s,a,e);Vh(s,y);break e}}s=s.return}while(s!==null)}Ag(t)}catch(P){e=P,Ct===t&&t!==null&&(Ct=t=t.return);continue}break}while(!0)}function wg(){var n=Pl.current;return Pl.current=bl,n===null?bl:n}function Pf(){(Pt===0||Pt===3||Pt===2)&&(Pt=4),Ut===null||!(Ir&268435455)&&!($l&268435455)||zi(Ut,kt)}function Nl(n,e){var t=Ke;Ke|=2;var i=wg();(Ut!==n||kt!==e)&&(pi=null,Cr(n,e));do try{F_();break}catch(r){Eg(n,r)}while(!0);if(ff(),Ke=t,Pl.current=i,Ct!==null)throw Error(ie(261));return Ut=null,kt=0,Pt}function F_(){for(;Ct!==null;)Tg(Ct)}function O_(){for(;Ct!==null&&!lx();)Tg(Ct)}function Tg(n){var e=Cg(n.alternate,n,gn);n.memoizedProps=n.pendingProps,e===null?Ag(n):Ct=e,Tf.current=null}function Ag(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=P_(t,e),t!==null){t.flags&=32767,Ct=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Pt=6,Ct=null;return}}else if(t=b_(t,e,gn),t!==null){Ct=t;return}if(e=e.sibling,e!==null){Ct=e;return}Ct=e=n}while(e!==null);Pt===0&&(Pt=5)}function xr(n,e,t){var i=it,r=Ln.transition;try{Ln.transition=null,it=1,k_(n,e,t,i)}finally{Ln.transition=r,it=i}return null}function k_(n,e,t,i){do ws();while(Hi!==null);if(Ke&6)throw Error(ie(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(ie(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(xx(n,s),n===Ut&&(Ct=Ut=null,kt=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||ya||(ya=!0,bg(pl,function(){return ws(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=Ln.transition,Ln.transition=null;var o=it;it=1;var a=Ke;Ke|=4,Tf.current=null,D_(n,t),yg(t,n),r_(Lu),gl=!!Pu,Lu=Pu=null,n.current=t,N_(t),cx(),Ke=a,it=o,Ln.transition=s}else n.current=t;if(ya&&(ya=!1,Hi=n,Dl=r),s=n.pendingLanes,s===0&&($i=null),fx(t.stateNode),un(n,At()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(Ll)throw Ll=!1,n=Zu,Zu=null,n;return Dl&1&&n.tag!==0&&ws(),s=n.pendingLanes,s&1?n===Qu?Ao++:(Ao=0,Qu=n):Ao=0,lr(),null}function ws(){if(Hi!==null){var n=o0(Dl),e=Ln.transition,t=it;try{if(Ln.transition=null,it=16>n?16:n,Hi===null)var i=!1;else{if(n=Hi,Hi=null,Dl=0,Ke&6)throw Error(ie(331));var r=Ke;for(Ke|=4,xe=n.current;xe!==null;){var s=xe,o=s.child;if(xe.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(xe=c;xe!==null;){var d=xe;switch(d.tag){case 0:case 11:case 15:wo(8,d,s)}var f=d.child;if(f!==null)f.return=d,xe=f;else for(;xe!==null;){d=xe;var h=d.sibling,p=d.return;if(vg(d),d===c){xe=null;break}if(h!==null){h.return=p,xe=h;break}xe=p}}}var g=s.alternate;if(g!==null){var _=g.child;if(_!==null){g.child=null;do{var m=_.sibling;_.sibling=null,_=m}while(_!==null)}}xe=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,xe=o;else e:for(;xe!==null;){if(s=xe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:wo(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,xe=u;break e}xe=s.return}}var v=n.current;for(xe=v;xe!==null;){o=xe;var x=o.child;if(o.subtreeFlags&2064&&x!==null)x.return=o,xe=x;else e:for(o=v;xe!==null;){if(a=xe,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:ql(9,a)}}catch(P){Et(a,a.return,P)}if(a===o){xe=null;break e}var y=a.sibling;if(y!==null){y.return=a.return,xe=y;break e}xe=a.return}}if(Ke=r,lr(),ii&&typeof ii.onPostCommitFiberRoot=="function")try{ii.onPostCommitFiberRoot(zl,n)}catch{}i=!0}return i}finally{it=t,Ln.transition=e}}return!1}function lp(n,e,t){e=Ds(t,e),e=og(n,e,1),n=qi(n,e,1),e=Jt(),n!==null&&(Ko(n,1,e),un(n,e))}function Et(n,e,t){if(n.tag===3)lp(n,n,t);else for(;e!==null;){if(e.tag===3){lp(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&($i===null||!$i.has(i))){n=Ds(t,n),n=ag(e,n,1),e=qi(e,n,1),n=Jt(),e!==null&&(Ko(e,1,n),un(e,n));break}}e=e.return}}function B_(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=Jt(),n.pingedLanes|=n.suspendedLanes&t,Ut===n&&(kt&t)===t&&(Pt===4||Pt===3&&(kt&130023424)===kt&&500>At()-Rf?Cr(n,0):Af|=t),un(n,e)}function Rg(n,e){e===0&&(n.mode&1?(e=ua,ua<<=1,!(ua&130023424)&&(ua=4194304)):e=1);var t=Jt();n=wi(n,e),n!==null&&(Ko(n,e,t),un(n,t))}function z_(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),Rg(n,t)}function V_(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(ie(314))}i!==null&&i.delete(e),Rg(n,t)}var Cg;Cg=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||ln.current)an=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return an=!1,C_(n,e,t);an=!!(n.flags&131072)}else an=!1,mt&&e.flags&1048576&&D0(e,El,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;tl(n,e),n=e.pendingProps;var r=Cs(e,qt.current);Es(e,t),r=yf(null,e,i,n,r,t);var s=Mf();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,cn(i)?(s=!0,Ml(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,mf(e),r.updater=Yl,e.stateNode=r,r._reactInternals=e,zu(e,i,n,t),e=Hu(null,e,i,!0,s,t)):(e.tag=0,mt&&s&&lf(e),Zt(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(tl(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=H_(i),n=Vn(i,n),r){case 0:e=Gu(null,e,i,n,t);break e;case 1:e=Qh(null,e,i,n,t);break e;case 11:e=Kh(null,e,i,n,t);break e;case 14:e=Zh(null,e,i,Vn(i.type,n),t);break e}throw Error(ie(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Vn(i,r),Gu(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Vn(i,r),Qh(n,e,i,r,t);case 3:e:{if(dg(e),n===null)throw Error(ie(387));i=e.pendingProps,s=e.memoizedState,r=s.element,k0(n,e),Al(e,i,null,t);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Ds(Error(ie(423)),e),e=Jh(n,e,i,t,r);break e}else if(i!==r){r=Ds(Error(ie(424)),e),e=Jh(n,e,i,t,r);break e}else for(xn=Yi(e.stateNode.containerInfo.firstChild),_n=e,mt=!0,Hn=null,t=F0(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(bs(),i===r){e=Ti(n,e,t);break e}Zt(n,e,i,t)}e=e.child}return e;case 5:return B0(e),n===null&&Ou(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,o=r.children,Du(i,r)?o=null:s!==null&&Du(i,s)&&(e.flags|=32),ug(n,e),Zt(n,e,o,t),e.child;case 6:return n===null&&Ou(e),null;case 13:return fg(n,e,t);case 4:return gf(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=Ps(e,null,i,t):Zt(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Vn(i,r),Kh(n,e,i,r,t);case 7:return Zt(n,e,e.pendingProps,t),e.child;case 8:return Zt(n,e,e.pendingProps.children,t),e.child;case 12:return Zt(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,lt(wl,i._currentValue),i._currentValue=o,s!==null)if(Kn(s.value,o)){if(s.children===r.children&&!ln.current){e=Ti(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=yi(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?l.next=l:(l.next=d.next,d.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),ku(s.return,t,e),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ie(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),ku(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Zt(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Es(e,t),r=Nn(r),i=i(r),e.flags|=1,Zt(n,e,i,t),e.child;case 14:return i=e.type,r=Vn(i,e.pendingProps),r=Vn(i.type,r),Zh(n,e,i,r,t);case 15:return lg(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Vn(i,r),tl(n,e),e.tag=1,cn(i)?(n=!0,Ml(e)):n=!1,Es(e,t),sg(e,i,r),zu(e,i,r,t),Hu(null,e,i,!0,n,t);case 19:return hg(n,e,t);case 22:return cg(n,e,t)}throw Error(ie(156,e.tag))};function bg(n,e){return n0(n,e)}function G_(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Pn(n,e,t,i){return new G_(n,e,t,i)}function Lf(n){return n=n.prototype,!(!n||!n.isReactComponent)}function H_(n){if(typeof n=="function")return Lf(n)?1:0;if(n!=null){if(n=n.$$typeof,n===$d)return 11;if(n===Kd)return 14}return 2}function Zi(n,e){var t=n.alternate;return t===null?(t=Pn(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function rl(n,e,t,i,r,s){var o=2;if(i=n,typeof n=="function")Lf(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case as:return br(t.children,r,s,e);case qd:o=8,r|=8;break;case uu:return n=Pn(12,t,e,r|2),n.elementType=uu,n.lanes=s,n;case du:return n=Pn(13,t,e,r),n.elementType=du,n.lanes=s,n;case fu:return n=Pn(19,t,e,r),n.elementType=fu,n.lanes=s,n;case Bm:return Kl(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case Om:o=10;break e;case km:o=9;break e;case $d:o=11;break e;case Kd:o=14;break e;case Oi:o=16,i=null;break e}throw Error(ie(130,n==null?n:typeof n,""))}return e=Pn(o,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function br(n,e,t,i){return n=Pn(7,n,i,e),n.lanes=t,n}function Kl(n,e,t,i){return n=Pn(22,n,i,e),n.elementType=Bm,n.lanes=t,n.stateNode={isHidden:!1},n}function bc(n,e,t){return n=Pn(6,n,null,e),n.lanes=t,n}function Pc(n,e,t){return e=Pn(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function W_(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=uc(0),this.expirationTimes=uc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=uc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Df(n,e,t,i,r,s,o,a,l){return n=new W_(n,e,t,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Pn(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},mf(s),n}function j_(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:os,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function Pg(n){if(!n)return ir;n=n._reactInternals;e:{if(Vr(n)!==n||n.tag!==1)throw Error(ie(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(cn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ie(171))}if(n.tag===1){var t=n.type;if(cn(t))return P0(n,t,e)}return e}function Lg(n,e,t,i,r,s,o,a,l){return n=Df(t,i,!0,n,r,s,o,a,l),n.context=Pg(null),t=n.current,i=Jt(),r=Ki(t),s=yi(i,r),s.callback=e??null,qi(t,s,r),n.current.lanes=r,Ko(n,r,i),un(n,i),n}function Zl(n,e,t,i){var r=e.current,s=Jt(),o=Ki(r);return t=Pg(t),e.context===null?e.context=t:e.pendingContext=t,e=yi(s,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=qi(r,e,o),n!==null&&(qn(n,r,o,s),Qa(n,r,o)),o}function Il(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function cp(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function Nf(n,e){cp(n,e),(n=n.alternate)&&cp(n,e)}function X_(){return null}var Dg=typeof reportError=="function"?reportError:function(n){console.error(n)};function If(n){this._internalRoot=n}Ql.prototype.render=If.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(ie(409));Zl(n,e,null,null)};Ql.prototype.unmount=If.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;Ur(function(){Zl(null,n,null,null)}),e[Ei]=null}};function Ql(n){this._internalRoot=n}Ql.prototype.unstable_scheduleHydration=function(n){if(n){var e=c0();n={blockedOn:null,target:n,priority:e};for(var t=0;t<Bi.length&&e!==0&&e<Bi[t].priority;t++);Bi.splice(t,0,n),t===0&&d0(n)}};function Uf(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Jl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function up(){}function Y_(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Il(o);s.call(c)}}var o=Lg(e,i,n,0,null,!1,!1,"",up);return n._reactRootContainer=o,n[Ei]=o.current,Oo(n.nodeType===8?n.parentNode:n),Ur(),o}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=Il(l);a.call(c)}}var l=Df(n,0,!1,null,null,!1,!1,"",up);return n._reactRootContainer=l,n[Ei]=l.current,Oo(n.nodeType===8?n.parentNode:n),Ur(function(){Zl(e,l,t,i)}),l}function ec(n,e,t,i,r){var s=t._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=Il(o);a.call(l)}}Zl(e,o,n,r)}else o=Y_(t,e,n,r,i);return Il(o)}a0=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=po(e.pendingLanes);t!==0&&(Jd(e,t|1),un(e,At()),!(Ke&6)&&(Ns=At()+500,lr()))}break;case 13:Ur(function(){var i=wi(n,1);if(i!==null){var r=Jt();qn(i,n,1,r)}}),Nf(n,1)}};ef=function(n){if(n.tag===13){var e=wi(n,134217728);if(e!==null){var t=Jt();qn(e,n,134217728,t)}Nf(n,134217728)}};l0=function(n){if(n.tag===13){var e=Ki(n),t=wi(n,e);if(t!==null){var i=Jt();qn(t,n,e,i)}Nf(n,e)}};c0=function(){return it};u0=function(n,e){var t=it;try{return it=n,e()}finally{it=t}};Su=function(n,e,t){switch(e){case"input":if(mu(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=Wl(i);if(!r)throw Error(ie(90));Vm(i),mu(i,r)}}}break;case"textarea":Hm(n,t);break;case"select":e=t.value,e!=null&&_s(n,!!t.multiple,e,!1)}};Km=Cf;Zm=Ur;var q_={usingClientEntryPoint:!1,Events:[Qo,ds,Wl,qm,$m,Cf]},ro={findFiberByHostInstance:Er,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},$_={bundleType:ro.bundleType,version:ro.version,rendererPackageName:ro.rendererPackageName,rendererConfig:ro.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ri.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=e0(n),n===null?null:n.stateNode},findFiberByHostInstance:ro.findFiberByHostInstance||X_,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Ma=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Ma.isDisabled&&Ma.supportsFiber)try{zl=Ma.inject($_),ii=Ma}catch{}}Mn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=q_;Mn.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Uf(e))throw Error(ie(200));return j_(n,e,null,t)};Mn.createRoot=function(n,e){if(!Uf(n))throw Error(ie(299));var t=!1,i="",r=Dg;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Df(n,1,!1,null,null,t,!1,i,r),n[Ei]=e.current,Oo(n.nodeType===8?n.parentNode:n),new If(e)};Mn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(ie(188)):(n=Object.keys(n).join(","),Error(ie(268,n)));return n=e0(e),n=n===null?null:n.stateNode,n};Mn.flushSync=function(n){return Ur(n)};Mn.hydrate=function(n,e,t){if(!Jl(e))throw Error(ie(200));return ec(null,n,e,!0,t)};Mn.hydrateRoot=function(n,e,t){if(!Uf(n))throw Error(ie(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",o=Dg;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=Lg(e,null,n,1,t??null,r,!1,s,o),n[Ei]=e.current,Oo(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new Ql(e)};Mn.render=function(n,e,t){if(!Jl(e))throw Error(ie(200));return ec(null,n,e,!1,t)};Mn.unmountComponentAtNode=function(n){if(!Jl(n))throw Error(ie(40));return n._reactRootContainer?(Ur(function(){ec(null,null,n,!1,function(){n._reactRootContainer=null,n[Ei]=null})}),!0):!1};Mn.unstable_batchedUpdates=Cf;Mn.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!Jl(t))throw Error(ie(200));if(n==null||n._reactInternals===void 0)throw Error(ie(38));return ec(n,e,t,!1,i)};Mn.version="18.3.1-next-f1338f8080-20240426";function Ng(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Ng)}catch(n){console.error(n)}}Ng(),Nm.exports=Mn;var K_=Nm.exports,dp=K_;lu.createRoot=dp.createRoot,lu.hydrateRoot=dp.hydrateRoot;const Z_=({onStartGame:n})=>{const[e,t]=Tt.useState("CT"),[i,r]=Tt.useState(!1),[s,o]=Tt.useState(1.2);return b.jsxs("div",{className:"fixed inset-0 bg-slate-950 flex items-center justify-center p-6 z-50 overflow-y-auto",children:[b.jsx("div",{className:"absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-slate-950/90 to-slate-950 pointer-events-none"}),b.jsxs("div",{className:"relative w-full max-w-4xl rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl p-8 md:p-10 flex flex-col gap-8 backdrop-blur-xl",children:[b.jsxs("div",{className:"text-center flex flex-col items-center gap-2 border-b border-slate-800 pb-6",children:[b.jsx("div",{className:"flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase",children:"3D Web Tactical FPS Prototype"}),b.jsxs("h1",{className:"text-4xl md:text-5xl font-black tracking-widest text-slate-100 font-sans uppercase",children:["COUNTER-STRIKE: ",b.jsx("span",{className:"text-amber-400",children:"DUST II"})]}),b.jsx("p",{className:"text-slate-400 text-sm max-w-xl font-mono",children:"Full 5v5 procedural AI match with authentic Dust2 map zones (A/B sites, Mid Doors, Catwalk, Long A, B Tunnels), Hitbox system, C4 plant/defuse, and Web Audio sound."})]}),b.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[b.jsxs("div",{className:"flex flex-col gap-3",children:[b.jsx("label",{className:"text-xs font-bold text-slate-400 uppercase tracking-wider font-mono",children:"1. Choose Your Faction"}),b.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[b.jsxs("button",{type:"button",onClick:()=>t("CT"),className:`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${e==="CT"?"bg-sky-950/90 border-sky-400 text-sky-300 shadow-lg shadow-sky-950/50 scale-[1.02]":"bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"}`,children:[b.jsx("span",{className:"text-2xl",children:"👮‍♂️"}),b.jsx("span",{className:"font-black tracking-wider text-base font-sans",children:"COUNTER-TERRORISTS"}),b.jsx("span",{className:"text-[11px] text-center font-mono opacity-75",children:"Defend sites A & B, defuse C4 bomb"})]}),b.jsxs("button",{type:"button",onClick:()=>t("T"),className:`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${e==="T"?"bg-amber-950/90 border-amber-400 text-amber-300 shadow-lg shadow-amber-950/50 scale-[1.02]":"bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"}`,children:[b.jsx("span",{className:"text-2xl",children:"🥷"}),b.jsx("span",{className:"font-black tracking-wider text-base font-sans",children:"TERRORISTS"}),b.jsx("span",{className:"text-[11px] text-center font-mono opacity-75",children:"Infiltrate site, plant C4 explosive"})]})]})]}),b.jsxs("div",{className:"flex flex-col gap-4",children:[b.jsx("label",{className:"text-xs font-bold text-slate-400 uppercase tracking-wider font-mono",children:"2. Match Configuration"}),b.jsxs("div",{className:"flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800",children:[b.jsxs("div",{children:[b.jsx("div",{className:"font-bold text-sm text-slate-200",children:"Pistol Round Only"}),b.jsx("div",{className:"text-xs text-slate-400 font-mono",children:"Start and stay in standard CS pistol round"})]}),b.jsx("input",{type:"checkbox",checked:i,onChange:a=>r(a.target.checked),className:"w-5 h-5 rounded accent-amber-500 cursor-pointer"})]}),b.jsxs("div",{className:"flex flex-col gap-1.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800",children:[b.jsxs("div",{className:"flex justify-between items-center text-xs font-mono",children:[b.jsx("span",{className:"text-slate-300 font-bold",children:"Mouse Sensitivity"}),b.jsx("span",{className:"text-amber-400 font-bold",children:s.toFixed(1)})]}),b.jsx("input",{type:"range",min:"0.4",max:"3.0",step:"0.1",value:s,onChange:a=>o(parseFloat(a.target.value)),className:"w-full accent-amber-500 cursor-pointer"})]})]})]}),b.jsxs("div",{className:"p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-wrap justify-between gap-3 text-xs font-mono text-slate-400",children:[b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"WASD:"})," Move"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"Space:"})," Jump"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"Shift:"})," Walk"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"Ctrl:"})," Crouch"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"Left Click:"})," Shoot"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"Right Click:"})," Scope (AWP)"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"R:"})," Reload"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"1/2/3/5:"})," Weapons / C4"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"B:"})," Buy Menu"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"E:"})," Plant / Defuse / Bot Takeover"]}),b.jsxs("div",{children:[b.jsx("span",{className:"text-slate-200 font-bold",children:"TAB:"})," Scoreboard"]})]}),b.jsx("button",{onClick:()=>n(e,i,s),className:"w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-lg tracking-widest uppercase font-sans shadow-2xl shadow-amber-500/25 transform hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer",children:"DEPLOY TO DUST II (START 5v5)"})]})]})};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ff="170",Q_=0,fp=1,J_=2,Ig=1,Ug=2,hi=3,rr=0,en=1,Wn=2,Qi=0,Pr=1,hp=2,pp=3,mp=4,ey=5,Mr=100,ty=101,ny=102,iy=103,ry=104,sy=200,oy=201,ay=202,ly=203,td=204,nd=205,cy=206,uy=207,dy=208,fy=209,hy=210,py=211,my=212,gy=213,vy=214,id=0,rd=1,sd=2,Is=3,od=4,ad=5,ld=6,cd=7,Fg=0,xy=1,_y=2,Ji=0,yy=1,My=2,Sy=3,Ey=4,wy=5,Ty=6,Ay=7,Og=300,Us=301,Fs=302,ud=303,dd=304,tc=306,Fr=1e3,Ar=1001,fd=1002,$n=1003,Ry=1004,Sa=1005,ni=1006,Lc=1007,Rr=1008,Ai=1009,kg=1010,Bg=1011,Xo=1012,Of=1013,Or=1014,xi=1015,ea=1016,kf=1017,Bf=1018,Os=1020,zg=35902,Vg=1021,Gg=1022,Xn=1023,Hg=1024,Wg=1025,Ts=1026,ks=1027,jg=1028,zf=1029,Xg=1030,Vf=1031,Gf=1033,sl=33776,ol=33777,al=33778,ll=33779,hd=35840,pd=35841,md=35842,gd=35843,vd=36196,xd=37492,_d=37496,yd=37808,Md=37809,Sd=37810,Ed=37811,wd=37812,Td=37813,Ad=37814,Rd=37815,Cd=37816,bd=37817,Pd=37818,Ld=37819,Dd=37820,Nd=37821,cl=36492,Id=36494,Ud=36495,Yg=36283,Fd=36284,Od=36285,kd=36286,Cy=3200,by=3201,qg=0,Py=1,Vi="",Rn="srgb",Hs="srgb-linear",nc="linear",rt="srgb",jr=7680,gp=519,Ly=512,Dy=513,Ny=514,$g=515,Iy=516,Uy=517,Fy=518,Oy=519,vp=35044,xp="300 es",_i=2e3,Ul=2001;class Ws{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let _p=1234567;const Ro=Math.PI/180,Yo=180/Math.PI;function js(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[n&255]+Wt[n>>8&255]+Wt[n>>16&255]+Wt[n>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[t&63|128]+Wt[t>>8&255]+"-"+Wt[t>>16&255]+Wt[t>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function Qt(n,e,t){return Math.max(e,Math.min(t,n))}function Hf(n,e){return(n%e+e)%e}function ky(n,e,t,i,r){return i+(n-e)*(r-i)/(t-e)}function By(n,e,t){return n!==e?(t-n)/(e-n):0}function Co(n,e,t){return(1-t)*n+t*e}function zy(n,e,t,i){return Co(n,e,1-Math.exp(-t*i))}function Vy(n,e=1){return e-Math.abs(Hf(n,e*2)-e)}function Gy(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*(3-2*n))}function Hy(n,e,t){return n<=e?0:n>=t?1:(n=(n-e)/(t-e),n*n*n*(n*(n*6-15)+10))}function Wy(n,e){return n+Math.floor(Math.random()*(e-n+1))}function jy(n,e){return n+Math.random()*(e-n)}function Xy(n){return n*(.5-Math.random())}function Yy(n){n!==void 0&&(_p=n);let e=_p+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function qy(n){return n*Ro}function $y(n){return n*Yo}function Ky(n){return(n&n-1)===0&&n!==0}function Zy(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Qy(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function Jy(n,e,t,i,r){const s=Math.cos,o=Math.sin,a=s(t/2),l=o(t/2),c=s((e+i)/2),d=o((e+i)/2),f=s((e-i)/2),h=o((e-i)/2),p=s((i-e)/2),g=o((i-e)/2);switch(r){case"XYX":n.set(a*d,l*f,l*h,a*c);break;case"YZY":n.set(l*h,a*d,l*f,a*c);break;case"ZXZ":n.set(l*f,l*h,a*d,a*c);break;case"XZX":n.set(a*d,l*g,l*p,a*c);break;case"YXY":n.set(l*p,a*d,l*g,a*c);break;case"ZYZ":n.set(l*g,l*p,a*d,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ss(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function $t(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Yt={DEG2RAD:Ro,RAD2DEG:Yo,generateUUID:js,clamp:Qt,euclideanModulo:Hf,mapLinear:ky,inverseLerp:By,lerp:Co,damp:zy,pingpong:Vy,smoothstep:Gy,smootherstep:Hy,randInt:Wy,randFloat:jy,randFloatSpread:Xy,seededRandom:Yy,degToRad:qy,radToDeg:$y,isPowerOfTwo:Ky,ceilPowerOfTwo:Zy,floorPowerOfTwo:Qy,setQuaternionFromProperEuler:Jy,normalize:$t,denormalize:ss};class Ze{constructor(e=0,t=0){Ze.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Qt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Oe{constructor(e,t,i,r,s,o,a,l,c){Oe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=a,d[3]=t,d[4]=s,d[5]=l,d[6]=i,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],d=i[4],f=i[7],h=i[2],p=i[5],g=i[8],_=r[0],m=r[3],u=r[6],v=r[1],x=r[4],y=r[7],P=r[2],E=r[5],A=r[8];return s[0]=o*_+a*v+l*P,s[3]=o*m+a*x+l*E,s[6]=o*u+a*y+l*A,s[1]=c*_+d*v+f*P,s[4]=c*m+d*x+f*E,s[7]=c*u+d*y+f*A,s[2]=h*_+p*v+g*P,s[5]=h*m+p*x+g*E,s[8]=h*u+p*y+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8];return t*o*d-t*a*c-i*s*d+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8],f=d*o-a*c,h=a*l-d*s,p=c*s-o*l,g=t*f+i*h+r*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=f*_,e[1]=(r*c-d*i)*_,e[2]=(a*i-r*o)*_,e[3]=h*_,e[4]=(d*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=p*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Dc.makeScale(e,t)),this}rotate(e){return this.premultiply(Dc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Dc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Dc=new Oe;function Kg(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Fl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function eM(){const n=Fl("canvas");return n.style.display="block",n}const yp={};function go(n){n in yp||(yp[n]=!0,console.warn(n))}function tM(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function nM(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function iM(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const $e={enabled:!0,workingColorSpace:Hs,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===rt&&(n.r=Mi(n.r),n.g=Mi(n.g),n.b=Mi(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===rt&&(n.r=As(n.r),n.g=As(n.g),n.b=As(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Vi?nc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Mi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function As(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Mp=[.64,.33,.3,.6,.15,.06],Sp=[.2126,.7152,.0722],Ep=[.3127,.329],wp=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Tp=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);$e.define({[Hs]:{primaries:Mp,whitePoint:Ep,transfer:nc,toXYZ:wp,fromXYZ:Tp,luminanceCoefficients:Sp,workingColorSpaceConfig:{unpackColorSpace:Rn},outputColorSpaceConfig:{drawingBufferColorSpace:Rn}},[Rn]:{primaries:Mp,whitePoint:Ep,transfer:rt,toXYZ:wp,fromXYZ:Tp,luminanceCoefficients:Sp,outputColorSpaceConfig:{drawingBufferColorSpace:Rn}}});let Xr;class rM{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Xr===void 0&&(Xr=Fl("canvas")),Xr.width=e.width,Xr.height=e.height;const i=Xr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Xr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Fl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Mi(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Mi(t[i]/255)*255):t[i]=Mi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let sM=0;class Zg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:sM++}),this.uuid=js(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Nc(r[o].image)):s.push(Nc(r[o]))}else s=Nc(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Nc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?rM.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let oM=0;class tn extends Ws{constructor(e=tn.DEFAULT_IMAGE,t=tn.DEFAULT_MAPPING,i=Ar,r=Ar,s=ni,o=Rr,a=Xn,l=Ai,c=tn.DEFAULT_ANISOTROPY,d=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:oM++}),this.uuid=js(),this.name="",this.source=new Zg(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Og)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fr:e.x=e.x-Math.floor(e.x);break;case Ar:e.x=e.x<0?0:1;break;case fd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fr:e.y=e.y-Math.floor(e.y);break;case Ar:e.y=e.y<0?0:1;break;case fd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=Og;tn.DEFAULT_ANISOTROPY=1;class st{constructor(e=0,t=0,i=0,r=1){st.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],d=l[4],f=l[8],h=l[1],p=l[5],g=l[9],_=l[2],m=l[6],u=l[10];if(Math.abs(d-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const x=(c+1)/2,y=(p+1)/2,P=(u+1)/2,E=(d+h)/4,A=(f+_)/4,R=(g+m)/4;return x>y&&x>P?x<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(x),r=E/i,s=A/i):y>P?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=E/r,s=R/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=A/s,r=R/s),this.set(i,r,s,t),this}let v=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-d)*(h-d));return Math.abs(v)<.001&&(v=1),this.x=(m-g)/v,this.y=(f-_)/v,this.z=(h-d)/v,this.w=Math.acos((c+p+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class aM extends Ws{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new st(0,0,e,t),this.scissorTest=!1,this.viewport=new st(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ni,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new tn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Zg(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kr extends aM{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Qg extends tn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=$n,this.minFilter=$n,this.wrapR=Ar,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class lM extends tn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=$n,this.minFilter=$n,this.wrapR=Ar,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ta{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],d=i[r+2],f=i[r+3];const h=s[o+0],p=s[o+1],g=s[o+2],_=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=f;return}if(a===1){e[t+0]=h,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(f!==_||l!==h||c!==p||d!==g){let m=1-a;const u=l*h+c*p+d*g+f*_,v=u>=0?1:-1,x=1-u*u;if(x>Number.EPSILON){const P=Math.sqrt(x),E=Math.atan2(P,u*v);m=Math.sin(m*E)/P,a=Math.sin(a*E)/P}const y=a*v;if(l=l*m+h*y,c=c*m+p*y,d=d*m+g*y,f=f*m+_*y,m===1-a){const P=1/Math.sqrt(l*l+c*c+d*d+f*f);l*=P,c*=P,d*=P,f*=P}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],d=i[r+3],f=s[o],h=s[o+1],p=s[o+2],g=s[o+3];return e[t]=a*g+d*f+l*p-c*h,e[t+1]=l*g+d*h+c*f-a*p,e[t+2]=c*g+d*p+a*h-l*f,e[t+3]=d*g-a*f-l*h-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),d=a(r/2),f=a(s/2),h=l(i/2),p=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*d*f+c*p*g,this._y=c*p*f-h*d*g,this._z=c*d*g+h*p*f,this._w=c*d*f-h*p*g;break;case"YXZ":this._x=h*d*f+c*p*g,this._y=c*p*f-h*d*g,this._z=c*d*g-h*p*f,this._w=c*d*f+h*p*g;break;case"ZXY":this._x=h*d*f-c*p*g,this._y=c*p*f+h*d*g,this._z=c*d*g+h*p*f,this._w=c*d*f-h*p*g;break;case"ZYX":this._x=h*d*f-c*p*g,this._y=c*p*f+h*d*g,this._z=c*d*g-h*p*f,this._w=c*d*f+h*p*g;break;case"YZX":this._x=h*d*f+c*p*g,this._y=c*p*f+h*d*g,this._z=c*d*g-h*p*f,this._w=c*d*f-h*p*g;break;case"XZY":this._x=h*d*f-c*p*g,this._y=c*p*f-h*d*g,this._z=c*d*g+h*p*f,this._w=c*d*f+h*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],d=t[6],f=t[10],h=i+a+f;if(h>0){const p=.5/Math.sqrt(h+1);this._w=.25/p,this._x=(d-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>f){const p=2*Math.sqrt(1+i-a-f);this._w=(d-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>f){const p=2*Math.sqrt(1+a-i-f);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+f-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Qt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+o*a+r*c-s*l,this._y=r*d+o*l+s*a-i*c,this._z=s*d+o*c+i*l-r*a,this._w=o*d-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,a),f=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=o*f+this._w*h,this._x=i*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ap.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ap.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),d=2*(a*t-s*r),f=2*(s*i-o*t);return this.x=t+l*c+o*f-a*d,this.y=i+l*d+a*c-s*f,this.z=r+l*f+s*d-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Ic.copy(this).projectOnVector(e),this.sub(Ic)}reflect(e){return this.sub(Ic.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Qt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ic=new L,Ap=new ta;class Xs{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(kn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(kn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=kn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,kn):kn.fromBufferAttribute(s,o),kn.applyMatrix4(e.matrixWorld),this.expandByPoint(kn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ea.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Ea.copy(i.boundingBox)),Ea.applyMatrix4(e.matrixWorld),this.union(Ea)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,kn),kn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(so),wa.subVectors(this.max,so),Yr.subVectors(e.a,so),qr.subVectors(e.b,so),$r.subVectors(e.c,so),Li.subVectors(qr,Yr),Di.subVectors($r,qr),dr.subVectors(Yr,$r);let t=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-dr.z,dr.y,Li.z,0,-Li.x,Di.z,0,-Di.x,dr.z,0,-dr.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-dr.y,dr.x,0];return!Uc(t,Yr,qr,$r,wa)||(t=[1,0,0,0,1,0,0,0,1],!Uc(t,Yr,qr,$r,wa))?!1:(Ta.crossVectors(Li,Di),t=[Ta.x,Ta.y,Ta.z],Uc(t,Yr,qr,$r,wa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,kn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(kn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const li=[new L,new L,new L,new L,new L,new L,new L,new L],kn=new L,Ea=new Xs,Yr=new L,qr=new L,$r=new L,Li=new L,Di=new L,dr=new L,so=new L,wa=new L,Ta=new L,fr=new L;function Uc(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){fr.fromArray(n,s);const a=r.x*Math.abs(fr.x)+r.y*Math.abs(fr.y)+r.z*Math.abs(fr.z),l=e.dot(fr),c=t.dot(fr),d=i.dot(fr);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>a)return!1}return!0}const cM=new Xs,oo=new L,Fc=new L;class na{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):cM.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;oo.subVectors(e,this.center);const t=oo.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(oo,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Fc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(oo.copy(e.center).add(Fc)),this.expandByPoint(oo.copy(e.center).sub(Fc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ci=new L,Oc=new L,Aa=new L,Ni=new L,kc=new L,Ra=new L,Bc=new L;class Br{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ci)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ci.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ci.copy(this.origin).addScaledVector(this.direction,t),ci.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Oc.copy(e).add(t).multiplyScalar(.5),Aa.copy(t).sub(e).normalize(),Ni.copy(this.origin).sub(Oc);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Aa),a=Ni.dot(this.direction),l=-Ni.dot(Aa),c=Ni.lengthSq(),d=Math.abs(1-o*o);let f,h,p,g;if(d>0)if(f=o*l-a,h=o*a-l,g=s*d,f>=0)if(h>=-g)if(h<=g){const _=1/d;f*=_,h*=_,p=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),p=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),p=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Oc).addScaledVector(Aa,h),p}intersectSphere(e,t){ci.subVectors(e.center,this.origin);const i=ci.dot(this.direction),r=ci.dot(ci)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,d=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),d>=0?(s=(e.min.y-h.y)*d,o=(e.max.y-h.y)*d):(s=(e.max.y-h.y)*d,o=(e.min.y-h.y)*d),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,ci)!==null}intersectTriangle(e,t,i,r,s){kc.subVectors(t,e),Ra.subVectors(i,e),Bc.crossVectors(kc,Ra);let o=this.direction.dot(Bc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Ni.subVectors(this.origin,e);const l=a*this.direction.dot(Ra.crossVectors(Ni,Ra));if(l<0)return null;const c=a*this.direction.dot(kc.cross(Ni));if(c<0||l+c>o)return null;const d=-a*Ni.dot(Bc);return d<0?null:this.at(d/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ct{constructor(e,t,i,r,s,o,a,l,c,d,f,h,p,g,_,m){ct.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,d,f,h,p,g,_,m)}set(e,t,i,r,s,o,a,l,c,d,f,h,p,g,_,m){const u=this.elements;return u[0]=e,u[4]=t,u[8]=i,u[12]=r,u[1]=s,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=d,u[10]=f,u[14]=h,u[3]=p,u[7]=g,u[11]=_,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ct().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Kr.setFromMatrixColumn(e,0).length(),s=1/Kr.setFromMatrixColumn(e,1).length(),o=1/Kr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const h=o*d,p=o*f,g=a*d,_=a*f;t[0]=l*d,t[4]=-l*f,t[8]=c,t[1]=p+g*c,t[5]=h-_*c,t[9]=-a*l,t[2]=_-h*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){const h=l*d,p=l*f,g=c*d,_=c*f;t[0]=h+_*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*f,t[5]=o*d,t[9]=-a,t[2]=p*a-g,t[6]=_+h*a,t[10]=o*l}else if(e.order==="ZXY"){const h=l*d,p=l*f,g=c*d,_=c*f;t[0]=h-_*a,t[4]=-o*f,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*d,t[9]=_-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const h=o*d,p=o*f,g=a*d,_=a*f;t[0]=l*d,t[4]=g*c-p,t[8]=h*c+_,t[1]=l*f,t[5]=_*c+h,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const h=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*d,t[4]=_-h*f,t[8]=g*f+p,t[1]=f,t[5]=o*d,t[9]=-a*d,t[2]=-c*d,t[6]=p*f+g,t[10]=h-_*f}else if(e.order==="XZY"){const h=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*d,t[4]=-f,t[8]=c*d,t[1]=h*f+_,t[5]=o*d,t[9]=p*f-g,t[2]=g*f-p,t[6]=a*d,t[10]=_*f+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(uM,e,dM)}lookAt(e,t,i){const r=this.elements;return hn.subVectors(e,t),hn.lengthSq()===0&&(hn.z=1),hn.normalize(),Ii.crossVectors(i,hn),Ii.lengthSq()===0&&(Math.abs(i.z)===1?hn.x+=1e-4:hn.z+=1e-4,hn.normalize(),Ii.crossVectors(i,hn)),Ii.normalize(),Ca.crossVectors(hn,Ii),r[0]=Ii.x,r[4]=Ca.x,r[8]=hn.x,r[1]=Ii.y,r[5]=Ca.y,r[9]=hn.y,r[2]=Ii.z,r[6]=Ca.z,r[10]=hn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],d=i[1],f=i[5],h=i[9],p=i[13],g=i[2],_=i[6],m=i[10],u=i[14],v=i[3],x=i[7],y=i[11],P=i[15],E=r[0],A=r[4],R=r[8],w=r[12],M=r[1],D=r[5],V=r[9],U=r[13],B=r[2],X=r[6],W=r[10],K=r[14],N=r[3],q=r[7],Z=r[11],le=r[15];return s[0]=o*E+a*M+l*B+c*N,s[4]=o*A+a*D+l*X+c*q,s[8]=o*R+a*V+l*W+c*Z,s[12]=o*w+a*U+l*K+c*le,s[1]=d*E+f*M+h*B+p*N,s[5]=d*A+f*D+h*X+p*q,s[9]=d*R+f*V+h*W+p*Z,s[13]=d*w+f*U+h*K+p*le,s[2]=g*E+_*M+m*B+u*N,s[6]=g*A+_*D+m*X+u*q,s[10]=g*R+_*V+m*W+u*Z,s[14]=g*w+_*U+m*K+u*le,s[3]=v*E+x*M+y*B+P*N,s[7]=v*A+x*D+y*X+P*q,s[11]=v*R+x*V+y*W+P*Z,s[15]=v*w+x*U+y*K+P*le,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],d=e[2],f=e[6],h=e[10],p=e[14],g=e[3],_=e[7],m=e[11],u=e[15];return g*(+s*l*f-r*c*f-s*a*h+i*c*h+r*a*p-i*l*p)+_*(+t*l*p-t*c*h+s*o*h-r*o*p+r*c*d-s*l*d)+m*(+t*c*f-t*a*p-s*o*f+i*o*p+s*a*d-i*c*d)+u*(-r*a*d-t*l*f+t*a*h+r*o*f-i*o*h+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8],f=e[9],h=e[10],p=e[11],g=e[12],_=e[13],m=e[14],u=e[15],v=f*m*c-_*h*c+_*l*p-a*m*p-f*l*u+a*h*u,x=g*h*c-d*m*c-g*l*p+o*m*p+d*l*u-o*h*u,y=d*_*c-g*f*c+g*a*p-o*_*p-d*a*u+o*f*u,P=g*f*l-d*_*l-g*a*h+o*_*h+d*a*m-o*f*m,E=t*v+i*x+r*y+s*P;if(E===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/E;return e[0]=v*A,e[1]=(_*h*s-f*m*s-_*r*p+i*m*p+f*r*u-i*h*u)*A,e[2]=(a*m*s-_*l*s+_*r*c-i*m*c-a*r*u+i*l*u)*A,e[3]=(f*l*s-a*h*s-f*r*c+i*h*c+a*r*p-i*l*p)*A,e[4]=x*A,e[5]=(d*m*s-g*h*s+g*r*p-t*m*p-d*r*u+t*h*u)*A,e[6]=(g*l*s-o*m*s-g*r*c+t*m*c+o*r*u-t*l*u)*A,e[7]=(o*h*s-d*l*s+d*r*c-t*h*c-o*r*p+t*l*p)*A,e[8]=y*A,e[9]=(g*f*s-d*_*s-g*i*p+t*_*p+d*i*u-t*f*u)*A,e[10]=(o*_*s-g*a*s+g*i*c-t*_*c-o*i*u+t*a*u)*A,e[11]=(d*a*s-o*f*s-d*i*c+t*f*c+o*i*p-t*a*p)*A,e[12]=P*A,e[13]=(d*_*r-g*f*r+g*i*h-t*_*h-d*i*m+t*f*m)*A,e[14]=(g*a*r-o*_*r-g*i*l+t*_*l+o*i*m-t*a*m)*A,e[15]=(o*f*r-d*a*r+d*i*l-t*f*l-o*i*h+t*a*h)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,d=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,d*a+i,d*l-r*o,0,c*l-r*a,d*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,d=o+o,f=a+a,h=s*c,p=s*d,g=s*f,_=o*d,m=o*f,u=a*f,v=l*c,x=l*d,y=l*f,P=i.x,E=i.y,A=i.z;return r[0]=(1-(_+u))*P,r[1]=(p+y)*P,r[2]=(g-x)*P,r[3]=0,r[4]=(p-y)*E,r[5]=(1-(h+u))*E,r[6]=(m+v)*E,r[7]=0,r[8]=(g+x)*A,r[9]=(m-v)*A,r[10]=(1-(h+_))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Kr.set(r[0],r[1],r[2]).length();const o=Kr.set(r[4],r[5],r[6]).length(),a=Kr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Bn.copy(this);const c=1/s,d=1/o,f=1/a;return Bn.elements[0]*=c,Bn.elements[1]*=c,Bn.elements[2]*=c,Bn.elements[4]*=d,Bn.elements[5]*=d,Bn.elements[6]*=d,Bn.elements[8]*=f,Bn.elements[9]*=f,Bn.elements[10]*=f,t.setFromRotationMatrix(Bn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=_i){const l=this.elements,c=2*s/(t-e),d=2*s/(i-r),f=(t+e)/(t-e),h=(i+r)/(i-r);let p,g;if(a===_i)p=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===Ul)p=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=d,l[9]=h,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=_i){const l=this.elements,c=1/(t-e),d=1/(i-r),f=1/(o-s),h=(t+e)*c,p=(i+r)*d;let g,_;if(a===_i)g=(o+s)*f,_=-2*f;else if(a===Ul)g=s*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-h,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Kr=new L,Bn=new ct,uM=new L(0,0,0),dM=new L(1,1,1),Ii=new L,Ca=new L,hn=new L,Rp=new ct,Cp=new ta;class si{constructor(e=0,t=0,i=0,r=si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],d=r[9],f=r[2],h=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Qt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Qt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Rp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Rp,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Cp.setFromEuler(this),this.setFromQuaternion(Cp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}si.DEFAULT_ORDER="XYZ";class Jg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let fM=0;const bp=new L,Zr=new ta,ui=new ct,ba=new L,ao=new L,hM=new L,pM=new ta,Pp=new L(1,0,0),Lp=new L(0,1,0),Dp=new L(0,0,1),Np={type:"added"},mM={type:"removed"},Qr={type:"childadded",child:null},zc={type:"childremoved",child:null};class Ft extends Ws{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:fM++}),this.uuid=js(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ft.DEFAULT_UP.clone();const e=new L,t=new si,i=new ta,r=new L(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ct},normalMatrix:{value:new Oe}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=Ft.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Jg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Zr.setFromAxisAngle(e,t),this.quaternion.multiply(Zr),this}rotateOnWorldAxis(e,t){return Zr.setFromAxisAngle(e,t),this.quaternion.premultiply(Zr),this}rotateX(e){return this.rotateOnAxis(Pp,e)}rotateY(e){return this.rotateOnAxis(Lp,e)}rotateZ(e){return this.rotateOnAxis(Dp,e)}translateOnAxis(e,t){return bp.copy(e).applyQuaternion(this.quaternion),this.position.add(bp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Pp,e)}translateY(e){return this.translateOnAxis(Lp,e)}translateZ(e){return this.translateOnAxis(Dp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ui.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?ba.copy(e):ba.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ao.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ui.lookAt(ao,ba,this.up):ui.lookAt(ba,ao,this.up),this.quaternion.setFromRotationMatrix(ui),r&&(ui.extractRotation(r.matrixWorld),Zr.setFromRotationMatrix(ui),this.quaternion.premultiply(Zr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Np),Qr.child=e,this.dispatchEvent(Qr),Qr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(mM),zc.child=e,this.dispatchEvent(zc),zc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Np),Qr.child=e,this.dispatchEvent(Qr),Qr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ao,e,hM),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ao,pM,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),d=o(e.images),f=o(e.shapes),h=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),p.length>0&&(i.animations=p),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){const l=[];for(const c in a){const d=a[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Ft.DEFAULT_UP=new L(0,1,0);Ft.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ft.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const zn=new L,di=new L,Vc=new L,fi=new L,Jr=new L,es=new L,Ip=new L,Gc=new L,Hc=new L,Wc=new L,jc=new st,Xc=new st,Yc=new st;class jn{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),zn.subVectors(e,t),r.cross(zn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){zn.subVectors(r,t),di.subVectors(i,t),Vc.subVectors(e,t);const o=zn.dot(zn),a=zn.dot(di),l=zn.dot(Vc),c=di.dot(di),d=di.dot(Vc),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;const h=1/f,p=(c*l-a*d)*h,g=(o*d-a*l)*h;return s.set(1-p-g,g,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,fi)===null?!1:fi.x>=0&&fi.y>=0&&fi.x+fi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,fi.x),l.addScaledVector(o,fi.y),l.addScaledVector(a,fi.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return jc.setScalar(0),Xc.setScalar(0),Yc.setScalar(0),jc.fromBufferAttribute(e,t),Xc.fromBufferAttribute(e,i),Yc.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(jc,s.x),o.addScaledVector(Xc,s.y),o.addScaledVector(Yc,s.z),o}static isFrontFacing(e,t,i,r){return zn.subVectors(i,t),di.subVectors(e,t),zn.cross(di).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),di.subVectors(this.a,this.b),zn.cross(di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return jn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return jn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return jn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return jn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return jn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Jr.subVectors(r,i),es.subVectors(s,i),Gc.subVectors(e,i);const l=Jr.dot(Gc),c=es.dot(Gc);if(l<=0&&c<=0)return t.copy(i);Hc.subVectors(e,r);const d=Jr.dot(Hc),f=es.dot(Hc);if(d>=0&&f<=d)return t.copy(r);const h=l*f-d*c;if(h<=0&&l>=0&&d<=0)return o=l/(l-d),t.copy(i).addScaledVector(Jr,o);Wc.subVectors(e,s);const p=Jr.dot(Wc),g=es.dot(Wc);if(g>=0&&p<=g)return t.copy(s);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(es,a);const m=d*g-p*f;if(m<=0&&f-d>=0&&p-g>=0)return Ip.subVectors(s,r),a=(f-d)/(f-d+(p-g)),t.copy(r).addScaledVector(Ip,a);const u=1/(m+_+h);return o=_*u,a=h*u,t.copy(i).addScaledVector(Jr,o).addScaledVector(es,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const ev={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ui={h:0,s:0,l:0},Pa={h:0,s:0,l:0};function qc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class ke{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,$e.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=$e.workingColorSpace){return this.r=e,this.g=t,this.b=i,$e.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=$e.workingColorSpace){if(e=Hf(e,1),t=Qt(t,0,1),i=Qt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=qc(o,s,e+1/3),this.g=qc(o,s,e),this.b=qc(o,s,e-1/3)}return $e.toWorkingColorSpace(this,r),this}setStyle(e,t=Rn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rn){const i=ev[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Mi(e.r),this.g=Mi(e.g),this.b=Mi(e.b),this}copyLinearToSRGB(e){return this.r=As(e.r),this.g=As(e.g),this.b=As(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rn){return $e.fromWorkingColorSpace(jt.copy(this),e),Math.round(Qt(jt.r*255,0,255))*65536+Math.round(Qt(jt.g*255,0,255))*256+Math.round(Qt(jt.b*255,0,255))}getHexString(e=Rn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=$e.workingColorSpace){$e.fromWorkingColorSpace(jt.copy(this),t);const i=jt.r,r=jt.g,s=jt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const d=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=d<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=$e.workingColorSpace){return $e.fromWorkingColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Rn){$e.fromWorkingColorSpace(jt.copy(this),e);const t=jt.r,i=jt.g,r=jt.b;return e!==Rn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Ui),this.setHSL(Ui.h+e,Ui.s+t,Ui.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ui),e.getHSL(Pa);const i=Co(Ui.h,Pa.h,t),r=Co(Ui.s,Pa.s,t),s=Co(Ui.l,Pa.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const jt=new ke;ke.NAMES=ev;let gM=0;class Gr extends Ws{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:gM++}),this.uuid=js(),this.name="",this.blending=Pr,this.side=rr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=td,this.blendDst=nd,this.blendEquation=Mr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ke(0,0,0),this.blendAlpha=0,this.depthFunc=Is,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=gp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jr,this.stencilZFail=jr,this.stencilZPass=jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Pr&&(i.blending=this.blending),this.side!==rr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==td&&(i.blendSrc=this.blendSrc),this.blendDst!==nd&&(i.blendDst=this.blendDst),this.blendEquation!==Mr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Is&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==gp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==jr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==jr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class er extends Gr{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new ke(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=Fg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new L,La=new Ze;class Dn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=vp,this.updateRanges=[],this.gpuType=xi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)La.fromBufferAttribute(this,t),La.applyMatrix3(e),this.setXY(t,La.x,La.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ss(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=$t(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ss(t,this.array)),t}setX(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ss(t,this.array)),t}setY(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ss(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ss(t,this.array)),t}setW(e,t){return this.normalized&&(t=$t(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array),r=$t(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=$t(t,this.array),i=$t(i,this.array),r=$t(r,this.array),s=$t(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vp&&(e.usage=this.usage),e}}class tv extends Dn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class nv extends Dn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Bt extends Dn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let vM=0;const Tn=new ct,$c=new Ft,ts=new L,pn=new Xs,lo=new Xs,Nt=new L;class dn extends Ws{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:vM++}),this.uuid=js(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Kg(e)?nv:tv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Oe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Tn.makeRotationFromQuaternion(e),this.applyMatrix4(Tn),this}rotateX(e){return Tn.makeRotationX(e),this.applyMatrix4(Tn),this}rotateY(e){return Tn.makeRotationY(e),this.applyMatrix4(Tn),this}rotateZ(e){return Tn.makeRotationZ(e),this.applyMatrix4(Tn),this}translate(e,t,i){return Tn.makeTranslation(e,t,i),this.applyMatrix4(Tn),this}scale(e,t,i){return Tn.makeScale(e,t,i),this.applyMatrix4(Tn),this}lookAt(e){return $c.lookAt(e),$c.updateMatrix(),this.applyMatrix4($c.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ts).negate(),this.translate(ts.x,ts.y,ts.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Bt(i,3))}else{for(let i=0,r=t.count;i<r;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Xs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];pn.setFromBufferAttribute(s),this.morphTargetsRelative?(Nt.addVectors(this.boundingBox.min,pn.min),this.boundingBox.expandByPoint(Nt),Nt.addVectors(this.boundingBox.max,pn.max),this.boundingBox.expandByPoint(Nt)):(this.boundingBox.expandByPoint(pn.min),this.boundingBox.expandByPoint(pn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new na);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(pn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];lo.setFromBufferAttribute(a),this.morphTargetsRelative?(Nt.addVectors(pn.min,lo.min),pn.expandByPoint(Nt),Nt.addVectors(pn.max,lo.max),pn.expandByPoint(Nt)):(pn.expandByPoint(lo.min),pn.expandByPoint(lo.max))}pn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Nt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Nt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,d=a.count;c<d;c++)Nt.fromBufferAttribute(a,c),l&&(ts.fromBufferAttribute(e,c),Nt.add(ts)),r=Math.max(r,i.distanceToSquared(Nt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Dn(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let R=0;R<i.count;R++)a[R]=new L,l[R]=new L;const c=new L,d=new L,f=new L,h=new Ze,p=new Ze,g=new Ze,_=new L,m=new L;function u(R,w,M){c.fromBufferAttribute(i,R),d.fromBufferAttribute(i,w),f.fromBufferAttribute(i,M),h.fromBufferAttribute(s,R),p.fromBufferAttribute(s,w),g.fromBufferAttribute(s,M),d.sub(c),f.sub(c),p.sub(h),g.sub(h);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(_.copy(d).multiplyScalar(g.y).addScaledVector(f,-p.y).multiplyScalar(D),m.copy(f).multiplyScalar(p.x).addScaledVector(d,-g.x).multiplyScalar(D),a[R].add(_),a[w].add(_),a[M].add(_),l[R].add(m),l[w].add(m),l[M].add(m))}let v=this.groups;v.length===0&&(v=[{start:0,count:e.count}]);for(let R=0,w=v.length;R<w;++R){const M=v[R],D=M.start,V=M.count;for(let U=D,B=D+V;U<B;U+=3)u(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const x=new L,y=new L,P=new L,E=new L;function A(R){P.fromBufferAttribute(r,R),E.copy(P);const w=a[R];x.copy(w),x.sub(P.multiplyScalar(P.dot(w))).normalize(),y.crossVectors(E,w);const D=y.dot(l[R])<0?-1:1;o.setXYZW(R,x.x,x.y,x.z,D)}for(let R=0,w=v.length;R<w;++R){const M=v[R],D=M.start,V=M.count;for(let U=D,B=D+V;U<B;U+=3)A(e.getX(U+0)),A(e.getX(U+1)),A(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Dn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,p=i.count;h<p;h++)i.setXYZ(h,0,0,0);const r=new L,s=new L,o=new L,a=new L,l=new L,c=new L,d=new L,f=new L;if(e)for(let h=0,p=e.count;h<p;h+=3){const g=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),d.subVectors(o,s),f.subVectors(r,s),d.cross(f),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(d),l.add(d),c.add(d),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,p=t.count;h<p;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),d.subVectors(o,s),f.subVectors(r,s),d.cross(f),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Nt.fromBufferAttribute(e,t),Nt.normalize(),e.setXYZ(t,Nt.x,Nt.y,Nt.z)}toNonIndexed(){function e(a,l){const c=a.array,d=a.itemSize,f=a.normalized,h=new c.constructor(l.length*d);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*d;for(let u=0;u<d;u++)h[g++]=c[p++]}return new Dn(h,d,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new dn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let d=0,f=c.length;d<f;d++){const h=c[d],p=e(h,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let f=0,h=c.length;f<h;f++){const p=c[f];d.push(p.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const s=e.morphAttributes;for(const c in s){const d=[],f=s[c];for(let h=0,p=f.length;h<p;h++)d.push(f[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,d=o.length;c<d;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Up=new ct,hr=new Br,Da=new na,Fp=new L,Na=new L,Ia=new L,Ua=new L,Kc=new L,Fa=new L,Op=new L,Oa=new L;class ne extends Ft{constructor(e=new dn,t=new er){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Fa.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=a[l],f=s[l];d!==0&&(Kc.fromBufferAttribute(f,e),o?Fa.addScaledVector(Kc,d):Fa.addScaledVector(Kc.sub(t),d))}t.add(Fa)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Da.copy(i.boundingSphere),Da.applyMatrix4(s),hr.copy(e.ray).recast(e.near),!(Da.containsPoint(hr.origin)===!1&&(hr.intersectSphere(Da,Fp)===null||hr.origin.distanceToSquared(Fp)>(e.far-e.near)**2))&&(Up.copy(s).invert(),hr.copy(e.ray).applyMatrix4(Up),!(i.boundingBox!==null&&hr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,hr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,f=s.attributes.normal,h=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],u=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,P=x;y<P;y+=3){const E=a.getX(y),A=a.getX(y+1),R=a.getX(y+2);r=ka(this,u,e,i,c,d,f,E,A,R),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,u=_;m<u;m+=3){const v=a.getX(m),x=a.getX(m+1),y=a.getX(m+2);r=ka(this,o,e,i,c,d,f,v,x,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){const m=h[g],u=o[m.materialIndex],v=Math.max(m.start,p.start),x=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=v,P=x;y<P;y+=3){const E=y,A=y+1,R=y+2;r=ka(this,u,e,i,c,d,f,E,A,R),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,u=_;m<u;m+=3){const v=m,x=m+1,y=m+2;r=ka(this,o,e,i,c,d,f,v,x,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function xM(n,e,t,i,r,s,o,a){let l;if(e.side===en?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===rr,a),l===null)return null;Oa.copy(a),Oa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Oa);return c<t.near||c>t.far?null:{distance:c,point:Oa.clone(),object:n}}function ka(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Na),n.getVertexPosition(l,Ia),n.getVertexPosition(c,Ua);const d=xM(n,e,t,i,Na,Ia,Ua,Op);if(d){const f=new L;jn.getBarycoord(Op,Na,Ia,Ua,f),r&&(d.uv=jn.getInterpolatedAttribute(r,a,l,c,f,new Ze)),s&&(d.uv1=jn.getInterpolatedAttribute(s,a,l,c,f,new Ze)),o&&(d.normal=jn.getInterpolatedAttribute(o,a,l,c,f,new L),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new L,materialIndex:0};jn.getNormal(Na,Ia,Ua,h.normal),d.face=h,d.barycoord=f}return d}class ae extends dn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],d=[],f=[];let h=0,p=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Bt(c,3)),this.setAttribute("normal",new Bt(d,3)),this.setAttribute("uv",new Bt(f,2));function g(_,m,u,v,x,y,P,E,A,R,w){const M=y/A,D=P/R,V=y/2,U=P/2,B=E/2,X=A+1,W=R+1;let K=0,N=0;const q=new L;for(let Z=0;Z<W;Z++){const le=Z*D-U;for(let me=0;me<X;me++){const Ne=me*M-V;q[_]=Ne*v,q[m]=le*x,q[u]=B,c.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[u]=E>0?1:-1,d.push(q.x,q.y,q.z),f.push(me/A),f.push(1-Z/R),K+=1}}for(let Z=0;Z<R;Z++)for(let le=0;le<A;le++){const me=h+le+X*Z,Ne=h+le+X*(Z+1),Y=h+(le+1)+X*(Z+1),re=h+(le+1)+X*Z;l.push(me,Ne,re),l.push(Ne,Y,re),N+=6}a.addGroup(p,N,w),p+=N,h+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ae(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Bs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Kt(n){const e={};for(let t=0;t<n.length;t++){const i=Bs(n[t]);for(const r in i)e[r]=i[r]}return e}function _M(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function iv(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:$e.workingColorSpace}const yM={clone:Bs,merge:Kt};var MM=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,SM=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class sr extends Gr{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=MM,this.fragmentShader=SM,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bs(e.uniforms),this.uniformsGroups=_M(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class rv extends Ft{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=_i}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Fi=new L,kp=new Ze,Bp=new Ze;class vn extends rv{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Yo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ro*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Yo*2*Math.atan(Math.tan(Ro*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Fi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z),Fi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Fi.x,Fi.y).multiplyScalar(-e/Fi.z)}getViewSize(e,t){return this.getViewBounds(e,kp,Bp),t.subVectors(Bp,kp)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ro*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ns=-90,is=1;class EM extends Ft{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new vn(ns,is,e,t);r.layers=this.layers,this.add(r);const s=new vn(ns,is,e,t);s.layers=this.layers,this.add(s);const o=new vn(ns,is,e,t);o.layers=this.layers,this.add(o);const a=new vn(ns,is,e,t);a.layers=this.layers,this.add(a);const l=new vn(ns,is,e,t);l.layers=this.layers,this.add(l);const c=new vn(ns,is,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===_i)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ul)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,d]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),e.render(t,d),e.setRenderTarget(f,h,p),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}}class sv extends tn{constructor(e,t,i,r,s,o,a,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:Us,super(e,t,i,r,s,o,a,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class wM extends kr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new sv(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ni}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ae(5,5,5),s=new sr({name:"CubemapFromEquirect",uniforms:Bs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:en,blending:Qi});s.uniforms.tEquirect.value=t;const o=new ne(r,s),a=t.minFilter;return t.minFilter===Rr&&(t.minFilter=ni),new EM(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const Zc=new L,TM=new L,AM=new Oe;class _r{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Zc.subVectors(i,t).cross(TM.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Zc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||AM.getNormalMatrix(e),r=this.coplanarPoint(Zc).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pr=new na,Ba=new L;class Wf{constructor(e=new _r,t=new _r,i=new _r,r=new _r,s=new _r,o=new _r){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=_i){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],d=r[5],f=r[6],h=r[7],p=r[8],g=r[9],_=r[10],m=r[11],u=r[12],v=r[13],x=r[14],y=r[15];if(i[0].setComponents(l-s,h-c,m-p,y-u).normalize(),i[1].setComponents(l+s,h+c,m+p,y+u).normalize(),i[2].setComponents(l+o,h+d,m+g,y+v).normalize(),i[3].setComponents(l-o,h-d,m-g,y-v).normalize(),i[4].setComponents(l-a,h-f,m-_,y-x).normalize(),t===_i)i[5].setComponents(l+a,h+f,m+_,y+x).normalize();else if(t===Ul)i[5].setComponents(a,f,_,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pr)}intersectsSprite(e){return pr.center.set(0,0,0),pr.radius=.7071067811865476,pr.applyMatrix4(e.matrixWorld),this.intersectsSphere(pr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Ba.x=r.normal.x>0?e.max.x:e.min.x,Ba.y=r.normal.y>0?e.max.y:e.min.y,Ba.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ba)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ov(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function RM(n){const e=new WeakMap;function t(a,l){const c=a.array,d=a.usage,f=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){const d=l.array,f=l.updateRanges;if(n.bindBuffer(c,a),f.length===0)n.bufferSubData(c,0,d);else{f.sort((p,g)=>p.start-g.start);let h=0;for(let p=1;p<f.length;p++){const g=f[h],_=f[p];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let p=0,g=f.length;p<g;p++){const _=f[p];n.bufferSubData(c,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const d=e.get(a);(!d||d.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class tr extends dn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,d=l+1,f=e/a,h=t/l,p=[],g=[],_=[],m=[];for(let u=0;u<d;u++){const v=u*h-o;for(let x=0;x<c;x++){const y=x*f-s;g.push(y,-v,0),_.push(0,0,1),m.push(x/a),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let v=0;v<a;v++){const x=v+c*u,y=v+c*(u+1),P=v+1+c*(u+1),E=v+1+c*u;p.push(x,y,E),p.push(y,P,E)}this.setIndex(p),this.setAttribute("position",new Bt(g,3)),this.setAttribute("normal",new Bt(_,3)),this.setAttribute("uv",new Bt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new tr(e.width,e.height,e.widthSegments,e.heightSegments)}}var CM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,bM=`#ifdef USE_ALPHAHASH
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
#endif`,PM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,LM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,DM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,NM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,IM=`#ifdef USE_AOMAP
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
#endif`,UM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,FM=`#ifdef USE_BATCHING
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
#endif`,OM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,kM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,BM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,zM=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,VM=`#ifdef USE_IRIDESCENCE
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
#endif`,GM=`#ifdef USE_BUMPMAP
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
#endif`,HM=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,WM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,jM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,XM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,YM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,qM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,$M=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,KM=`#if defined( USE_COLOR_ALPHA )
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
#endif`,ZM=`#define PI 3.141592653589793
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
} // validated`,QM=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,JM=`vec3 transformedNormal = objectNormal;
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
#endif`,eS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,tS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,nS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,iS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,rS="gl_FragColor = linearToOutputTexel( gl_FragColor );",sS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,oS=`#ifdef USE_ENVMAP
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
#endif`,aS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,lS=`#ifdef USE_ENVMAP
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
#endif`,cS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,uS=`#ifdef USE_ENVMAP
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
#endif`,dS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,fS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,hS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,pS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,mS=`#ifdef USE_GRADIENTMAP
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
}`,gS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,vS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_S=`uniform bool receiveShadow;
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
#endif`,yS=`#ifdef USE_ENVMAP
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
#endif`,MS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,SS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ES=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,wS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,TS=`PhysicalMaterial material;
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
#endif`,AS=`struct PhysicalMaterial {
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
}`,RS=`
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
#endif`,CS=`#if defined( RE_IndirectDiffuse )
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
#endif`,bS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,PS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,LS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,DS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,NS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,IS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,US=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,FS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,OS=`#if defined( USE_POINTS_UV )
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
#endif`,kS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,BS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,zS=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,VS=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,GS=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,HS=`#ifdef USE_MORPHTARGETS
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
#endif`,WS=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,jS=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,XS=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,YS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,qS=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$S=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,KS=`#ifdef USE_NORMALMAP
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
#endif`,ZS=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,QS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,JS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,e1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,t1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,n1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,i1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,r1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,s1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,o1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,a1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,l1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,c1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,u1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,d1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,f1=`float getShadowMask() {
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
}`,h1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,p1=`#ifdef USE_SKINNING
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
#endif`,m1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,g1=`#ifdef USE_SKINNING
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
#endif`,v1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,x1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,_1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,y1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,M1=`#ifdef USE_TRANSMISSION
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
#endif`,S1=`#ifdef USE_TRANSMISSION
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
#endif`,E1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,w1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,T1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,A1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const R1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,C1=`uniform sampler2D t2D;
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
}`,b1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,P1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,L1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,D1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,N1=`#include <common>
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
}`,I1=`#if DEPTH_PACKING == 3200
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
}`,U1=`#define DISTANCE
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
}`,F1=`#define DISTANCE
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
}`,O1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,k1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,B1=`uniform float scale;
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
}`,z1=`uniform vec3 diffuse;
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
}`,V1=`#include <common>
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
}`,G1=`uniform vec3 diffuse;
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
}`,H1=`#define LAMBERT
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
}`,W1=`#define LAMBERT
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
}`,j1=`#define MATCAP
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
}`,X1=`#define MATCAP
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
}`,Y1=`#define NORMAL
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
}`,q1=`#define NORMAL
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
}`,$1=`#define PHONG
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
}`,K1=`#define PHONG
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
}`,Z1=`#define STANDARD
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
}`,Q1=`#define STANDARD
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
}`,J1=`#define TOON
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
}`,eE=`#define TOON
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
}`,tE=`uniform float size;
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
}`,nE=`uniform vec3 diffuse;
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
}`,iE=`#include <common>
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
}`,rE=`uniform vec3 color;
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
}`,sE=`uniform float rotation;
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
}`,oE=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:CM,alphahash_pars_fragment:bM,alphamap_fragment:PM,alphamap_pars_fragment:LM,alphatest_fragment:DM,alphatest_pars_fragment:NM,aomap_fragment:IM,aomap_pars_fragment:UM,batching_pars_vertex:FM,batching_vertex:OM,begin_vertex:kM,beginnormal_vertex:BM,bsdfs:zM,iridescence_fragment:VM,bumpmap_pars_fragment:GM,clipping_planes_fragment:HM,clipping_planes_pars_fragment:WM,clipping_planes_pars_vertex:jM,clipping_planes_vertex:XM,color_fragment:YM,color_pars_fragment:qM,color_pars_vertex:$M,color_vertex:KM,common:ZM,cube_uv_reflection_fragment:QM,defaultnormal_vertex:JM,displacementmap_pars_vertex:eS,displacementmap_vertex:tS,emissivemap_fragment:nS,emissivemap_pars_fragment:iS,colorspace_fragment:rS,colorspace_pars_fragment:sS,envmap_fragment:oS,envmap_common_pars_fragment:aS,envmap_pars_fragment:lS,envmap_pars_vertex:cS,envmap_physical_pars_fragment:yS,envmap_vertex:uS,fog_vertex:dS,fog_pars_vertex:fS,fog_fragment:hS,fog_pars_fragment:pS,gradientmap_pars_fragment:mS,lightmap_pars_fragment:gS,lights_lambert_fragment:vS,lights_lambert_pars_fragment:xS,lights_pars_begin:_S,lights_toon_fragment:MS,lights_toon_pars_fragment:SS,lights_phong_fragment:ES,lights_phong_pars_fragment:wS,lights_physical_fragment:TS,lights_physical_pars_fragment:AS,lights_fragment_begin:RS,lights_fragment_maps:CS,lights_fragment_end:bS,logdepthbuf_fragment:PS,logdepthbuf_pars_fragment:LS,logdepthbuf_pars_vertex:DS,logdepthbuf_vertex:NS,map_fragment:IS,map_pars_fragment:US,map_particle_fragment:FS,map_particle_pars_fragment:OS,metalnessmap_fragment:kS,metalnessmap_pars_fragment:BS,morphinstance_vertex:zS,morphcolor_vertex:VS,morphnormal_vertex:GS,morphtarget_pars_vertex:HS,morphtarget_vertex:WS,normal_fragment_begin:jS,normal_fragment_maps:XS,normal_pars_fragment:YS,normal_pars_vertex:qS,normal_vertex:$S,normalmap_pars_fragment:KS,clearcoat_normal_fragment_begin:ZS,clearcoat_normal_fragment_maps:QS,clearcoat_pars_fragment:JS,iridescence_pars_fragment:e1,opaque_fragment:t1,packing:n1,premultiplied_alpha_fragment:i1,project_vertex:r1,dithering_fragment:s1,dithering_pars_fragment:o1,roughnessmap_fragment:a1,roughnessmap_pars_fragment:l1,shadowmap_pars_fragment:c1,shadowmap_pars_vertex:u1,shadowmap_vertex:d1,shadowmask_pars_fragment:f1,skinbase_vertex:h1,skinning_pars_vertex:p1,skinning_vertex:m1,skinnormal_vertex:g1,specularmap_fragment:v1,specularmap_pars_fragment:x1,tonemapping_fragment:_1,tonemapping_pars_fragment:y1,transmission_fragment:M1,transmission_pars_fragment:S1,uv_pars_fragment:E1,uv_pars_vertex:w1,uv_vertex:T1,worldpos_vertex:A1,background_vert:R1,background_frag:C1,backgroundCube_vert:b1,backgroundCube_frag:P1,cube_vert:L1,cube_frag:D1,depth_vert:N1,depth_frag:I1,distanceRGBA_vert:U1,distanceRGBA_frag:F1,equirect_vert:O1,equirect_frag:k1,linedashed_vert:B1,linedashed_frag:z1,meshbasic_vert:V1,meshbasic_frag:G1,meshlambert_vert:H1,meshlambert_frag:W1,meshmatcap_vert:j1,meshmatcap_frag:X1,meshnormal_vert:Y1,meshnormal_frag:q1,meshphong_vert:$1,meshphong_frag:K1,meshphysical_vert:Z1,meshphysical_frag:Q1,meshtoon_vert:J1,meshtoon_frag:eE,points_vert:tE,points_frag:nE,shadow_vert:iE,shadow_frag:rE,sprite_vert:sE,sprite_frag:oE},ue={common:{diffuse:{value:new ke(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ke(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ke(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new ke(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},ei={basic:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new ke(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Kt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new ke(0)},specular:{value:new ke(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Kt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new ke(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Kt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new ke(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Kt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Kt([ue.points,ue.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Kt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Kt([ue.common,ue.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Kt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Kt([ue.sprite,ue.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:Kt([ue.common,ue.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:Kt([ue.lights,ue.fog,{color:{value:new ke(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};ei.physical={uniforms:Kt([ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new ke(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new ke(0)},specularColor:{value:new ke(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const za={r:0,b:0,g:0},mr=new si,aE=new ct;function lE(n,e,t,i,r,s,o){const a=new ke(0);let l=s===!0?0:1,c,d,f=null,h=0,p=null;function g(v){let x=v.isScene===!0?v.background:null;return x&&x.isTexture&&(x=(v.backgroundBlurriness>0?t:e).get(x)),x}function _(v){let x=!1;const y=g(v);y===null?u(a,l):y&&y.isColor&&(u(y,1),x=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||x)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(v,x){const y=g(x);y&&(y.isCubeTexture||y.mapping===tc)?(d===void 0&&(d=new ne(new ae(1,1,1),new sr({name:"BackgroundCubeMaterial",uniforms:Bs(ei.backgroundCube.uniforms),vertexShader:ei.backgroundCube.vertexShader,fragmentShader:ei.backgroundCube.fragmentShader,side:en,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(P,E,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),mr.copy(x.backgroundRotation),mr.x*=-1,mr.y*=-1,mr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(mr.y*=-1,mr.z*=-1),d.material.uniforms.envMap.value=y,d.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(aE.makeRotationFromEuler(mr)),d.material.toneMapped=$e.getTransfer(y.colorSpace)!==rt,(f!==y||h!==y.version||p!==n.toneMapping)&&(d.material.needsUpdate=!0,f=y,h=y.version,p=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new ne(new tr(2,2),new sr({name:"BackgroundMaterial",uniforms:Bs(ei.background.uniforms),vertexShader:ei.background.vertexShader,fragmentShader:ei.background.fragmentShader,side:rr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,c.material.toneMapped=$e.getTransfer(y.colorSpace)!==rt,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||h!==y.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,f=y,h=y.version,p=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function u(v,x){v.getRGB(za,iv(n)),i.buffers.color.setClear(za.r,za.g,za.b,x,o)}return{getClearColor:function(){return a},setClearColor:function(v,x=1){a.set(v),l=x,u(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,u(a,l)},render:_,addToRenderList:m}}function cE(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=h(null);let s=r,o=!1;function a(M,D,V,U,B){let X=!1;const W=f(U,V,D);s!==W&&(s=W,c(s.object)),X=p(M,U,V,B),X&&g(M,U,V,B),B!==null&&e.update(B,n.ELEMENT_ARRAY_BUFFER),(X||o)&&(o=!1,y(M,D,V,U),B!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(B).buffer))}function l(){return n.createVertexArray()}function c(M){return n.bindVertexArray(M)}function d(M){return n.deleteVertexArray(M)}function f(M,D,V){const U=V.wireframe===!0;let B=i[M.id];B===void 0&&(B={},i[M.id]=B);let X=B[D.id];X===void 0&&(X={},B[D.id]=X);let W=X[U];return W===void 0&&(W=h(l()),X[U]=W),W}function h(M){const D=[],V=[],U=[];for(let B=0;B<t;B++)D[B]=0,V[B]=0,U[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:V,attributeDivisors:U,object:M,attributes:{},index:null}}function p(M,D,V,U){const B=s.attributes,X=D.attributes;let W=0;const K=V.getAttributes();for(const N in K)if(K[N].location>=0){const Z=B[N];let le=X[N];if(le===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(le=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(le=M.instanceColor)),Z===void 0||Z.attribute!==le||le&&Z.data!==le.data)return!0;W++}return s.attributesNum!==W||s.index!==U}function g(M,D,V,U){const B={},X=D.attributes;let W=0;const K=V.getAttributes();for(const N in K)if(K[N].location>=0){let Z=X[N];Z===void 0&&(N==="instanceMatrix"&&M.instanceMatrix&&(Z=M.instanceMatrix),N==="instanceColor"&&M.instanceColor&&(Z=M.instanceColor));const le={};le.attribute=Z,Z&&Z.data&&(le.data=Z.data),B[N]=le,W++}s.attributes=B,s.attributesNum=W,s.index=U}function _(){const M=s.newAttributes;for(let D=0,V=M.length;D<V;D++)M[D]=0}function m(M){u(M,0)}function u(M,D){const V=s.newAttributes,U=s.enabledAttributes,B=s.attributeDivisors;V[M]=1,U[M]===0&&(n.enableVertexAttribArray(M),U[M]=1),B[M]!==D&&(n.vertexAttribDivisor(M,D),B[M]=D)}function v(){const M=s.newAttributes,D=s.enabledAttributes;for(let V=0,U=D.length;V<U;V++)D[V]!==M[V]&&(n.disableVertexAttribArray(V),D[V]=0)}function x(M,D,V,U,B,X,W){W===!0?n.vertexAttribIPointer(M,D,V,B,X):n.vertexAttribPointer(M,D,V,U,B,X)}function y(M,D,V,U){_();const B=U.attributes,X=V.getAttributes(),W=D.defaultAttributeValues;for(const K in X){const N=X[K];if(N.location>=0){let q=B[K];if(q===void 0&&(K==="instanceMatrix"&&M.instanceMatrix&&(q=M.instanceMatrix),K==="instanceColor"&&M.instanceColor&&(q=M.instanceColor)),q!==void 0){const Z=q.normalized,le=q.itemSize,me=e.get(q);if(me===void 0)continue;const Ne=me.buffer,Y=me.type,re=me.bytesPerElement,ve=Y===n.INT||Y===n.UNSIGNED_INT||q.gpuType===Of;if(q.isInterleavedBufferAttribute){const ce=q.data,Pe=ce.stride,Ie=q.offset;if(ce.isInstancedInterleavedBuffer){for(let Ve=0;Ve<N.locationSize;Ve++)u(N.location+Ve,ce.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Ve=0;Ve<N.locationSize;Ve++)m(N.location+Ve);n.bindBuffer(n.ARRAY_BUFFER,Ne);for(let Ve=0;Ve<N.locationSize;Ve++)x(N.location+Ve,le/N.locationSize,Y,Z,Pe*re,(Ie+le/N.locationSize*Ve)*re,ve)}else{if(q.isInstancedBufferAttribute){for(let ce=0;ce<N.locationSize;ce++)u(N.location+ce,q.meshPerAttribute);M.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let ce=0;ce<N.locationSize;ce++)m(N.location+ce);n.bindBuffer(n.ARRAY_BUFFER,Ne);for(let ce=0;ce<N.locationSize;ce++)x(N.location+ce,le/N.locationSize,Y,Z,le*re,le/N.locationSize*ce*re,ve)}}else if(W!==void 0){const Z=W[K];if(Z!==void 0)switch(Z.length){case 2:n.vertexAttrib2fv(N.location,Z);break;case 3:n.vertexAttrib3fv(N.location,Z);break;case 4:n.vertexAttrib4fv(N.location,Z);break;default:n.vertexAttrib1fv(N.location,Z)}}}}v()}function P(){R();for(const M in i){const D=i[M];for(const V in D){const U=D[V];for(const B in U)d(U[B].object),delete U[B];delete D[V]}delete i[M]}}function E(M){if(i[M.id]===void 0)return;const D=i[M.id];for(const V in D){const U=D[V];for(const B in U)d(U[B].object),delete U[B];delete D[V]}delete i[M.id]}function A(M){for(const D in i){const V=i[D];if(V[M.id]===void 0)continue;const U=V[M.id];for(const B in U)d(U[B].object),delete U[B];delete V[M.id]}}function R(){w(),o=!0,s!==r&&(s=r,c(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:R,resetDefaultState:w,dispose:P,releaseStatesOfGeometry:E,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:v}}function uE(n,e,t){let i;function r(c){i=c}function s(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function o(c,d,f){f!==0&&(n.drawArraysInstanced(i,c,d,f),t.update(d,i,f))}function a(c,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,f);let p=0;for(let g=0;g<f;g++)p+=d[g];t.update(p,i,1)}function l(c,d,f,h){if(f===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],d[g],h[g]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,d,0,h,0,f);let g=0;for(let _=0;_<f;_++)g+=d[_]*h[_];t.update(g,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function dE(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==Xn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const R=A===ea&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Ai&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==xi&&!R)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const f=t.logarithmicDepthBuffer===!0,h=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),u=n.getParameter(n.MAX_VERTEX_ATTRIBS),v=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),x=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=g>0,E=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reverseDepthBuffer:h,maxTextures:p,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:v,maxVaryings:x,maxFragmentUniforms:y,vertexTextures:P,maxSamples:E}}function fE(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new _r,a=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const p=f.length!==0||h||i!==0||r;return r=h,i=f.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){t=d(f,h,0)},this.setState=function(f,h,p){const g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,u=n.get(f);if(!r||g===null||g.length===0||s&&!m)s?d(null):c();else{const v=s?0:i,x=v*4;let y=u.clippingState||null;l.value=y,y=d(g,h,x,p);for(let P=0;P!==x;++P)y[P]=t[P];u.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(f,h,p,g){const _=f!==null?f.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const u=p+_*4,v=h.matrixWorldInverse;a.getNormalMatrix(v),(m===null||m.length<u)&&(m=new Float32Array(u));for(let x=0,y=p;x!==_;++x,y+=4)o.copy(f[x]).applyMatrix4(v,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function hE(n){let e=new WeakMap;function t(o,a){return a===ud?o.mapping=Us:a===dd&&(o.mapping=Fs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===ud||a===dd)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new wM(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class av extends rv{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=d*this.view.offsetY,l=a-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const xs=4,zp=[.125,.215,.35,.446,.526,.582],Sr=20,Qc=new av,Vp=new ke;let Jc=null,eu=0,tu=0,nu=!1;const yr=(1+Math.sqrt(5))/2,rs=1/yr,Gp=[new L(-yr,rs,0),new L(yr,rs,0),new L(-rs,0,yr),new L(rs,0,yr),new L(0,yr,-rs),new L(0,yr,rs),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class Hp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Jc=this._renderer.getRenderTarget(),eu=this._renderer.getActiveCubeFace(),tu=this._renderer.getActiveMipmapLevel(),nu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=jp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Jc,eu,tu),this._renderer.xr.enabled=nu,e.scissorTest=!1,Va(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Us||e.mapping===Fs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Jc=this._renderer.getRenderTarget(),eu=this._renderer.getActiveCubeFace(),tu=this._renderer.getActiveMipmapLevel(),nu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ni,minFilter:ni,generateMipmaps:!1,type:ea,format:Xn,colorSpace:Hs,depthBuffer:!1},r=Wp(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wp(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=pE(s)),this._blurMaterial=mE(s,e,t)}return r}_compileMaterial(e){const t=new ne(this._lodPlanes[0],e);this._renderer.compile(t,Qc)}_sceneToCubeUV(e,t,i,r){const a=new vn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,f=d.autoClear,h=d.toneMapping;d.getClearColor(Vp),d.toneMapping=Ji,d.autoClear=!1;const p=new er({name:"PMREM.Background",side:en,depthWrite:!1,depthTest:!1}),g=new ne(new ae,p);let _=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(Vp),_=!0);for(let u=0;u<6;u++){const v=u%3;v===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):v===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));const x=this._cubeSize;Va(r,v*x,u>2?x:0,x,x),d.setRenderTarget(r),_&&d.render(g,a),d.render(e,a)}g.geometry.dispose(),g.material.dispose(),d.toneMapping=h,d.autoClear=f,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Us||e.mapping===Fs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=jp());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new ne(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Va(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,Qc)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Gp[(r-s-1)%Gp.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,f=new ne(this._lodPlanes[r],c),h=c.uniforms,p=this._sizeLods[i]-1,g=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Sr-1),_=s/g,m=isFinite(s)?1+Math.floor(d*_):Sr;m>Sr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Sr}`);const u=[];let v=0;for(let A=0;A<Sr;++A){const R=A/_,w=Math.exp(-R*R/2);u.push(w),A===0?v+=w:A<m&&(v+=2*w)}for(let A=0;A<u.length;A++)u[A]=u[A]/v;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=u,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:x}=this;h.dTheta.value=g,h.mipInt.value=x-i;const y=this._sizeLods[r],P=3*y*(r>x-xs?r-x+xs:0),E=4*(this._cubeSize-y);Va(t,P,E,3*y,2*y),l.setRenderTarget(t),l.render(f,Qc)}}function pE(n){const e=[],t=[],i=[];let r=n;const s=n-xs+1+zp.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-xs?l=zp[o-n+xs-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),d=-c,f=1+c,h=[d,d,f,d,f,f,d,d,f,f,d,f],p=6,g=6,_=3,m=2,u=1,v=new Float32Array(_*g*p),x=new Float32Array(m*g*p),y=new Float32Array(u*g*p);for(let E=0;E<p;E++){const A=E%3*2/3-1,R=E>2?0:-1,w=[A,R,0,A+2/3,R,0,A+2/3,R+1,0,A,R,0,A+2/3,R+1,0,A,R+1,0];v.set(w,_*g*E),x.set(h,m*g*E);const M=[E,E,E,E,E,E];y.set(M,u*g*E)}const P=new dn;P.setAttribute("position",new Dn(v,_)),P.setAttribute("uv",new Dn(x,m)),P.setAttribute("faceIndex",new Dn(y,u)),e.push(P),r>xs&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Wp(n,e,t){const i=new kr(n,e,t);return i.texture.mapping=tc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Va(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function mE(n,e,t){const i=new Float32Array(Sr),r=new L(0,1,0);return new sr({name:"SphericalGaussianBlur",defines:{n:Sr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:jf(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function jp(){return new sr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jf(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Xp(){return new sr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function jf(){return`

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
	`}function gE(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===ud||l===dd,d=l===Us||l===Fs;if(c||d){let f=e.get(a);const h=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==h)return t===null&&(t=new Hp(n)),f=c?t.fromEquirectangular(a,f):t.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),f.texture;if(f!==void 0)return f.texture;{const p=a.image;return c&&p&&p.height>0||d&&p&&r(p)?(t===null&&(t=new Hp(n)),f=c?t.fromEquirectangular(a):t.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,e.set(a,f),a.addEventListener("dispose",s),f.texture):null}}}return a}function r(a){let l=0;const c=6;for(let d=0;d<c;d++)a[d]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function vE(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&go("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function xE(n,e,t,i){const r={},s=new WeakMap;function o(f){const h=f.target;h.index!==null&&e.remove(h.index);for(const g in h.attributes)e.remove(h.attributes[g]);for(const g in h.morphAttributes){const _=h.morphAttributes[g];for(let m=0,u=_.length;m<u;m++)e.remove(_[m])}h.removeEventListener("dispose",o),delete r[h.id];const p=s.get(h);p&&(e.remove(p),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,t.memory.geometries++),h}function l(f){const h=f.attributes;for(const g in h)e.update(h[g],n.ARRAY_BUFFER);const p=f.morphAttributes;for(const g in p){const _=p[g];for(let m=0,u=_.length;m<u;m++)e.update(_[m],n.ARRAY_BUFFER)}}function c(f){const h=[],p=f.index,g=f.attributes.position;let _=0;if(p!==null){const v=p.array;_=p.version;for(let x=0,y=v.length;x<y;x+=3){const P=v[x+0],E=v[x+1],A=v[x+2];h.push(P,E,E,A,A,P)}}else if(g!==void 0){const v=g.array;_=g.version;for(let x=0,y=v.length/3-1;x<y;x+=3){const P=x+0,E=x+1,A=x+2;h.push(P,E,E,A,A,P)}}else return;const m=new(Kg(h)?nv:tv)(h,1);m.version=_;const u=s.get(f);u&&e.remove(u),s.set(f,m)}function d(f){const h=s.get(f);if(h){const p=f.index;p!==null&&h.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:d}}function _E(n,e,t){let i;function r(h){i=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,p){n.drawElements(i,p,s,h*o),t.update(p,i,1)}function c(h,p,g){g!==0&&(n.drawElementsInstanced(i,p,s,h*o,g),t.update(p,i,g))}function d(h,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,h,0,g);let m=0;for(let u=0;u<g;u++)m+=p[u];t.update(m,i,1)}function f(h,p,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<h.length;u++)c(h[u]/o,p[u],_[u]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,h,0,_,0,g);let u=0;for(let v=0;v<g;v++)u+=p[v]*_[v];t.update(u,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=f}function yE(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function ME(n,e,t){const i=new WeakMap,r=new st;function s(o,a,l){const c=o.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=d!==void 0?d.length:0;let h=i.get(a);if(h===void 0||h.count!==f){let M=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",M)};var p=M;h!==void 0&&h.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,u=a.morphAttributes.position||[],v=a.morphAttributes.normal||[],x=a.morphAttributes.color||[];let y=0;g===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let P=a.attributes.position.count*y,E=1;P>e.maxTextureSize&&(E=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const A=new Float32Array(P*E*4*f),R=new Qg(A,P,E,f);R.type=xi,R.needsUpdate=!0;const w=y*4;for(let D=0;D<f;D++){const V=u[D],U=v[D],B=x[D],X=P*E*4*D;for(let W=0;W<V.count;W++){const K=W*w;g===!0&&(r.fromBufferAttribute(V,W),A[X+K+0]=r.x,A[X+K+1]=r.y,A[X+K+2]=r.z,A[X+K+3]=0),_===!0&&(r.fromBufferAttribute(U,W),A[X+K+4]=r.x,A[X+K+5]=r.y,A[X+K+6]=r.z,A[X+K+7]=0),m===!0&&(r.fromBufferAttribute(B,W),A[X+K+8]=r.x,A[X+K+9]=r.y,A[X+K+10]=r.z,A[X+K+11]=B.itemSize===4?r.w:1)}}h={count:f,texture:R,size:new Ze(P,E)},i.set(a,h),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function SE(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,d=l.geometry,f=e.get(l,d);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;r.get(h)!==c&&(h.update(),r.set(h,c))}return f}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class lv extends tn{constructor(e,t,i,r,s,o,a,l,c,d=Ts){if(d!==Ts&&d!==ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Ts&&(i=Or),i===void 0&&d===ks&&(i=Os),super(null,r,s,o,a,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:$n,this.minFilter=l!==void 0?l:$n,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const cv=new tn,Yp=new lv(1,1),uv=new Qg,dv=new lM,fv=new sv,qp=[],$p=[],Kp=new Float32Array(16),Zp=new Float32Array(9),Qp=new Float32Array(4);function Ys(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=qp[r];if(s===void 0&&(s=new Float32Array(r),qp[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Lt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Dt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ic(n,e){let t=$p[e];t===void 0&&(t=new Int32Array(e),$p[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function EE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function wE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2fv(this.addr,e),Dt(t,e)}}function TE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Lt(t,e))return;n.uniform3fv(this.addr,e),Dt(t,e)}}function AE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4fv(this.addr,e),Dt(t,e)}}function RE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Qp.set(i),n.uniformMatrix2fv(this.addr,!1,Qp),Dt(t,i)}}function CE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Zp.set(i),n.uniformMatrix3fv(this.addr,!1,Zp),Dt(t,i)}}function bE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Lt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Lt(t,i))return;Kp.set(i),n.uniformMatrix4fv(this.addr,!1,Kp),Dt(t,i)}}function PE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function LE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2iv(this.addr,e),Dt(t,e)}}function DE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3iv(this.addr,e),Dt(t,e)}}function NE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4iv(this.addr,e),Dt(t,e)}}function IE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function UE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Lt(t,e))return;n.uniform2uiv(this.addr,e),Dt(t,e)}}function FE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Lt(t,e))return;n.uniform3uiv(this.addr,e),Dt(t,e)}}function OE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Lt(t,e))return;n.uniform4uiv(this.addr,e),Dt(t,e)}}function kE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Yp.compareFunction=$g,s=Yp):s=cv,t.setTexture2D(e||s,r)}function BE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||dv,r)}function zE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||fv,r)}function VE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||uv,r)}function GE(n){switch(n){case 5126:return EE;case 35664:return wE;case 35665:return TE;case 35666:return AE;case 35674:return RE;case 35675:return CE;case 35676:return bE;case 5124:case 35670:return PE;case 35667:case 35671:return LE;case 35668:case 35672:return DE;case 35669:case 35673:return NE;case 5125:return IE;case 36294:return UE;case 36295:return FE;case 36296:return OE;case 35678:case 36198:case 36298:case 36306:case 35682:return kE;case 35679:case 36299:case 36307:return BE;case 35680:case 36300:case 36308:case 36293:return zE;case 36289:case 36303:case 36311:case 36292:return VE}}function HE(n,e){n.uniform1fv(this.addr,e)}function WE(n,e){const t=Ys(e,this.size,2);n.uniform2fv(this.addr,t)}function jE(n,e){const t=Ys(e,this.size,3);n.uniform3fv(this.addr,t)}function XE(n,e){const t=Ys(e,this.size,4);n.uniform4fv(this.addr,t)}function YE(n,e){const t=Ys(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function qE(n,e){const t=Ys(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function $E(n,e){const t=Ys(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function KE(n,e){n.uniform1iv(this.addr,e)}function ZE(n,e){n.uniform2iv(this.addr,e)}function QE(n,e){n.uniform3iv(this.addr,e)}function JE(n,e){n.uniform4iv(this.addr,e)}function ew(n,e){n.uniform1uiv(this.addr,e)}function tw(n,e){n.uniform2uiv(this.addr,e)}function nw(n,e){n.uniform3uiv(this.addr,e)}function iw(n,e){n.uniform4uiv(this.addr,e)}function rw(n,e,t){const i=this.cache,r=e.length,s=ic(t,r);Lt(i,s)||(n.uniform1iv(this.addr,s),Dt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||cv,s[o])}function sw(n,e,t){const i=this.cache,r=e.length,s=ic(t,r);Lt(i,s)||(n.uniform1iv(this.addr,s),Dt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||dv,s[o])}function ow(n,e,t){const i=this.cache,r=e.length,s=ic(t,r);Lt(i,s)||(n.uniform1iv(this.addr,s),Dt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||fv,s[o])}function aw(n,e,t){const i=this.cache,r=e.length,s=ic(t,r);Lt(i,s)||(n.uniform1iv(this.addr,s),Dt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||uv,s[o])}function lw(n){switch(n){case 5126:return HE;case 35664:return WE;case 35665:return jE;case 35666:return XE;case 35674:return YE;case 35675:return qE;case 35676:return $E;case 5124:case 35670:return KE;case 35667:case 35671:return ZE;case 35668:case 35672:return QE;case 35669:case 35673:return JE;case 5125:return ew;case 36294:return tw;case 36295:return nw;case 36296:return iw;case 35678:case 36198:case 36298:case 36306:case 35682:return rw;case 35679:case 36299:case 36307:return sw;case 35680:case 36300:case 36308:case 36293:return ow;case 36289:case 36303:case 36311:case 36292:return aw}}class cw{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=GE(t.type)}}class uw{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=lw(t.type)}}class dw{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const iu=/(\w+)(\])?(\[|\.)?/g;function Jp(n,e){n.seq.push(e),n.map[e.id]=e}function fw(n,e,t){const i=n.name,r=i.length;for(iu.lastIndex=0;;){const s=iu.exec(i),o=iu.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Jp(t,c===void 0?new cw(a,n,e):new uw(a,n,e));break}else{let f=t.map[a];f===void 0&&(f=new dw(a),Jp(t,f)),t=f}}}class ul{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);fw(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function em(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const hw=37297;let pw=0;function mw(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const tm=new Oe;function gw(n){$e._getMatrix(tm,$e.workingColorSpace,n);const e=`mat3( ${tm.elements.map(t=>t.toFixed(4))} )`;switch($e.getTransfer(n)){case nc:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function nm(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+mw(n.getShaderSource(e),o)}else return r}function vw(n,e){const t=gw(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function xw(n,e){let t;switch(e){case yy:t="Linear";break;case My:t="Reinhard";break;case Sy:t="Cineon";break;case Ey:t="ACESFilmic";break;case Ty:t="AgX";break;case Ay:t="Neutral";break;case wy:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ga=new L;function _w(){$e.getLuminanceCoefficients(Ga);const n=Ga.x.toFixed(4),e=Ga.y.toFixed(4),t=Ga.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function yw(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vo).join(`
`)}function Mw(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function Sw(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function vo(n){return n!==""}function im(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function rm(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Ew=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bd(n){return n.replace(Ew,Tw)}const ww=new Map;function Tw(n,e){let t=ze[e];if(t===void 0){const i=ww.get(e);if(i!==void 0)t=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Bd(t)}const Aw=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sm(n){return n.replace(Aw,Rw)}function Rw(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function om(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Cw(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ig?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Ug?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===hi&&(e="SHADOWMAP_TYPE_VSM"),e}function bw(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Us:case Fs:e="ENVMAP_TYPE_CUBE";break;case tc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Pw(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Fs:e="ENVMAP_MODE_REFRACTION";break}return e}function Lw(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Fg:e="ENVMAP_BLENDING_MULTIPLY";break;case xy:e="ENVMAP_BLENDING_MIX";break;case _y:e="ENVMAP_BLENDING_ADD";break}return e}function Dw(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function Nw(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Cw(t),c=bw(t),d=Pw(t),f=Lw(t),h=Dw(t),p=yw(t),g=Mw(s),_=r.createProgram();let m,u,v=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vo).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(vo).join(`
`),u.length>0&&(u+=`
`)):(m=[om(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(vo).join(`
`),u=[om(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ji?"#define TONE_MAPPING":"",t.toneMapping!==Ji?ze.tonemapping_pars_fragment:"",t.toneMapping!==Ji?xw("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,vw("linearToOutputTexel",t.outputColorSpace),_w(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(vo).join(`
`)),o=Bd(o),o=im(o,t),o=rm(o,t),a=Bd(a),a=im(a,t),a=rm(a,t),o=sm(o),a=sm(a),t.isRawShaderMaterial!==!0&&(v=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",t.glslVersion===xp?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===xp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const x=v+m+o,y=v+u+a,P=em(r,r.VERTEX_SHADER,x),E=em(r,r.FRAGMENT_SHADER,y);r.attachShader(_,P),r.attachShader(_,E),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function A(D){if(n.debug.checkShaderErrors){const V=r.getProgramInfoLog(_).trim(),U=r.getShaderInfoLog(P).trim(),B=r.getShaderInfoLog(E).trim();let X=!0,W=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(X=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,P,E);else{const K=nm(r,P,"vertex"),N=nm(r,E,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+V+`
`+K+`
`+N)}else V!==""?console.warn("THREE.WebGLProgram: Program Info Log:",V):(U===""||B==="")&&(W=!1);W&&(D.diagnostics={runnable:X,programLog:V,vertexShader:{log:U,prefix:m},fragmentShader:{log:B,prefix:u}})}r.deleteShader(P),r.deleteShader(E),R=new ul(r,_),w=Sw(r,_)}let R;this.getUniforms=function(){return R===void 0&&A(this),R};let w;this.getAttributes=function(){return w===void 0&&A(this),w};let M=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return M===!1&&(M=r.getProgramParameter(_,hw)),M},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=pw++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=P,this.fragmentShader=E,this}let Iw=0;class Uw{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new Fw(e),t.set(e,i)),i}}class Fw{constructor(e){this.id=Iw++,this.code=e,this.usedTimes=0}}function Ow(n,e,t,i,r,s,o){const a=new Jg,l=new Uw,c=new Set,d=[],f=r.logarithmicDepthBuffer,h=r.vertexTextures;let p=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(w){return c.add(w),w===0?"uv":`uv${w}`}function m(w,M,D,V,U){const B=V.fog,X=U.geometry,W=w.isMeshStandardMaterial?V.environment:null,K=(w.isMeshStandardMaterial?t:e).get(w.envMap||W),N=K&&K.mapping===tc?K.image.height:null,q=g[w.type];w.precision!==null&&(p=r.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const Z=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,le=Z!==void 0?Z.length:0;let me=0;X.morphAttributes.position!==void 0&&(me=1),X.morphAttributes.normal!==void 0&&(me=2),X.morphAttributes.color!==void 0&&(me=3);let Ne,Y,re,ve;if(q){const tt=ei[q];Ne=tt.vertexShader,Y=tt.fragmentShader}else Ne=w.vertexShader,Y=w.fragmentShader,l.update(w),re=l.getVertexShaderID(w),ve=l.getFragmentShaderID(w);const ce=n.getRenderTarget(),Pe=n.state.buffers.depth.getReversed(),Ie=U.isInstancedMesh===!0,Ve=U.isBatchedMesh===!0,vt=!!w.map,Ye=!!w.matcap,wt=!!K,k=!!w.aoMap,En=!!w.lightMap,He=!!w.bumpMap,We=!!w.normalMap,Ce=!!w.displacementMap,ut=!!w.emissiveMap,Re=!!w.metalnessMap,C=!!w.roughnessMap,S=w.anisotropy>0,z=w.clearcoat>0,Q=w.dispersion>0,te=w.iridescence>0,$=w.sheen>0,Te=w.transmission>0,fe=S&&!!w.anisotropyMap,_e=z&&!!w.clearcoatMap,qe=z&&!!w.clearcoatNormalMap,se=z&&!!w.clearcoatRoughnessMap,ye=te&&!!w.iridescenceMap,be=te&&!!w.iridescenceThicknessMap,Le=$&&!!w.sheenColorMap,Me=$&&!!w.sheenRoughnessMap,je=!!w.specularMap,Be=!!w.specularColorMap,ot=!!w.specularIntensityMap,I=Te&&!!w.transmissionMap,de=Te&&!!w.thicknessMap,j=!!w.gradientMap,J=!!w.alphaMap,ge=w.alphaTest>0,he=!!w.alphaHash,Ue=!!w.extensions;let St=Ji;w.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(St=n.toneMapping);const Vt={shaderID:q,shaderType:w.type,shaderName:w.name,vertexShader:Ne,fragmentShader:Y,defines:w.defines,customVertexShaderID:re,customFragmentShaderID:ve,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:Ve,batchingColor:Ve&&U._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&U.instanceColor!==null,instancingMorph:Ie&&U.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ce===null?n.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Hs,alphaToCoverage:!!w.alphaToCoverage,map:vt,matcap:Ye,envMap:wt,envMapMode:wt&&K.mapping,envMapCubeUVHeight:N,aoMap:k,lightMap:En,bumpMap:He,normalMap:We,displacementMap:h&&Ce,emissiveMap:ut,normalMapObjectSpace:We&&w.normalMapType===Py,normalMapTangentSpace:We&&w.normalMapType===qg,metalnessMap:Re,roughnessMap:C,anisotropy:S,anisotropyMap:fe,clearcoat:z,clearcoatMap:_e,clearcoatNormalMap:qe,clearcoatRoughnessMap:se,dispersion:Q,iridescence:te,iridescenceMap:ye,iridescenceThicknessMap:be,sheen:$,sheenColorMap:Le,sheenRoughnessMap:Me,specularMap:je,specularColorMap:Be,specularIntensityMap:ot,transmission:Te,transmissionMap:I,thicknessMap:de,gradientMap:j,opaque:w.transparent===!1&&w.blending===Pr&&w.alphaToCoverage===!1,alphaMap:J,alphaTest:ge,alphaHash:he,combine:w.combine,mapUv:vt&&_(w.map.channel),aoMapUv:k&&_(w.aoMap.channel),lightMapUv:En&&_(w.lightMap.channel),bumpMapUv:He&&_(w.bumpMap.channel),normalMapUv:We&&_(w.normalMap.channel),displacementMapUv:Ce&&_(w.displacementMap.channel),emissiveMapUv:ut&&_(w.emissiveMap.channel),metalnessMapUv:Re&&_(w.metalnessMap.channel),roughnessMapUv:C&&_(w.roughnessMap.channel),anisotropyMapUv:fe&&_(w.anisotropyMap.channel),clearcoatMapUv:_e&&_(w.clearcoatMap.channel),clearcoatNormalMapUv:qe&&_(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:se&&_(w.clearcoatRoughnessMap.channel),iridescenceMapUv:ye&&_(w.iridescenceMap.channel),iridescenceThicknessMapUv:be&&_(w.iridescenceThicknessMap.channel),sheenColorMapUv:Le&&_(w.sheenColorMap.channel),sheenRoughnessMapUv:Me&&_(w.sheenRoughnessMap.channel),specularMapUv:je&&_(w.specularMap.channel),specularColorMapUv:Be&&_(w.specularColorMap.channel),specularIntensityMapUv:ot&&_(w.specularIntensityMap.channel),transmissionMapUv:I&&_(w.transmissionMap.channel),thicknessMapUv:de&&_(w.thicknessMap.channel),alphaMapUv:J&&_(w.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(We||S),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!X.attributes.uv&&(vt||J),fog:!!B,useFog:w.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Pe,skinning:U.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:me,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&D.length>0,shadowMapType:n.shadowMap.type,toneMapping:St,decodeVideoTexture:vt&&w.map.isVideoTexture===!0&&$e.getTransfer(w.map.colorSpace)===rt,decodeVideoTextureEmissive:ut&&w.emissiveMap.isVideoTexture===!0&&$e.getTransfer(w.emissiveMap.colorSpace)===rt,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===Wn,flipSided:w.side===en,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Ue&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ue&&w.extensions.multiDraw===!0||Ve)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Vt.vertexUv1s=c.has(1),Vt.vertexUv2s=c.has(2),Vt.vertexUv3s=c.has(3),c.clear(),Vt}function u(w){const M=[];if(w.shaderID?M.push(w.shaderID):(M.push(w.customVertexShaderID),M.push(w.customFragmentShaderID)),w.defines!==void 0)for(const D in w.defines)M.push(D),M.push(w.defines[D]);return w.isRawShaderMaterial===!1&&(v(M,w),x(M,w),M.push(n.outputColorSpace)),M.push(w.customProgramCacheKey),M.join()}function v(w,M){w.push(M.precision),w.push(M.outputColorSpace),w.push(M.envMapMode),w.push(M.envMapCubeUVHeight),w.push(M.mapUv),w.push(M.alphaMapUv),w.push(M.lightMapUv),w.push(M.aoMapUv),w.push(M.bumpMapUv),w.push(M.normalMapUv),w.push(M.displacementMapUv),w.push(M.emissiveMapUv),w.push(M.metalnessMapUv),w.push(M.roughnessMapUv),w.push(M.anisotropyMapUv),w.push(M.clearcoatMapUv),w.push(M.clearcoatNormalMapUv),w.push(M.clearcoatRoughnessMapUv),w.push(M.iridescenceMapUv),w.push(M.iridescenceThicknessMapUv),w.push(M.sheenColorMapUv),w.push(M.sheenRoughnessMapUv),w.push(M.specularMapUv),w.push(M.specularColorMapUv),w.push(M.specularIntensityMapUv),w.push(M.transmissionMapUv),w.push(M.thicknessMapUv),w.push(M.combine),w.push(M.fogExp2),w.push(M.sizeAttenuation),w.push(M.morphTargetsCount),w.push(M.morphAttributeCount),w.push(M.numDirLights),w.push(M.numPointLights),w.push(M.numSpotLights),w.push(M.numSpotLightMaps),w.push(M.numHemiLights),w.push(M.numRectAreaLights),w.push(M.numDirLightShadows),w.push(M.numPointLightShadows),w.push(M.numSpotLightShadows),w.push(M.numSpotLightShadowsWithMaps),w.push(M.numLightProbes),w.push(M.shadowMapType),w.push(M.toneMapping),w.push(M.numClippingPlanes),w.push(M.numClipIntersection),w.push(M.depthPacking)}function x(w,M){a.disableAll(),M.supportsVertexTextures&&a.enable(0),M.instancing&&a.enable(1),M.instancingColor&&a.enable(2),M.instancingMorph&&a.enable(3),M.matcap&&a.enable(4),M.envMap&&a.enable(5),M.normalMapObjectSpace&&a.enable(6),M.normalMapTangentSpace&&a.enable(7),M.clearcoat&&a.enable(8),M.iridescence&&a.enable(9),M.alphaTest&&a.enable(10),M.vertexColors&&a.enable(11),M.vertexAlphas&&a.enable(12),M.vertexUv1s&&a.enable(13),M.vertexUv2s&&a.enable(14),M.vertexUv3s&&a.enable(15),M.vertexTangents&&a.enable(16),M.anisotropy&&a.enable(17),M.alphaHash&&a.enable(18),M.batching&&a.enable(19),M.dispersion&&a.enable(20),M.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),M.fog&&a.enable(0),M.useFog&&a.enable(1),M.flatShading&&a.enable(2),M.logarithmicDepthBuffer&&a.enable(3),M.reverseDepthBuffer&&a.enable(4),M.skinning&&a.enable(5),M.morphTargets&&a.enable(6),M.morphNormals&&a.enable(7),M.morphColors&&a.enable(8),M.premultipliedAlpha&&a.enable(9),M.shadowMapEnabled&&a.enable(10),M.doubleSided&&a.enable(11),M.flipSided&&a.enable(12),M.useDepthPacking&&a.enable(13),M.dithering&&a.enable(14),M.transmission&&a.enable(15),M.sheen&&a.enable(16),M.opaque&&a.enable(17),M.pointsUvs&&a.enable(18),M.decodeVideoTexture&&a.enable(19),M.decodeVideoTextureEmissive&&a.enable(20),M.alphaToCoverage&&a.enable(21),w.push(a.mask)}function y(w){const M=g[w.type];let D;if(M){const V=ei[M];D=yM.clone(V.uniforms)}else D=w.uniforms;return D}function P(w,M){let D;for(let V=0,U=d.length;V<U;V++){const B=d[V];if(B.cacheKey===M){D=B,++D.usedTimes;break}}return D===void 0&&(D=new Nw(n,M,w,s),d.push(D)),D}function E(w){if(--w.usedTimes===0){const M=d.indexOf(w);d[M]=d[d.length-1],d.pop(),w.destroy()}}function A(w){l.remove(w)}function R(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:y,acquireProgram:P,releaseProgram:E,releaseShaderCache:A,programs:d,dispose:R}}function kw(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function Bw(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function am(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function lm(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(f,h,p,g,_,m){let u=n[e];return u===void 0?(u={id:f.id,object:f,geometry:h,material:p,groupOrder:g,renderOrder:f.renderOrder,z:_,group:m},n[e]=u):(u.id=f.id,u.object=f,u.geometry=h,u.material=p,u.groupOrder=g,u.renderOrder=f.renderOrder,u.z=_,u.group=m),e++,u}function a(f,h,p,g,_,m){const u=o(f,h,p,g,_,m);p.transmission>0?i.push(u):p.transparent===!0?r.push(u):t.push(u)}function l(f,h,p,g,_,m){const u=o(f,h,p,g,_,m);p.transmission>0?i.unshift(u):p.transparent===!0?r.unshift(u):t.unshift(u)}function c(f,h){t.length>1&&t.sort(f||Bw),i.length>1&&i.sort(h||am),r.length>1&&r.sort(h||am)}function d(){for(let f=e,h=n.length;f<h;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:d,sort:c}}function zw(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new lm,n.set(i,[o])):r>=s.length?(o=new lm,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function Vw(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new ke};break;case"SpotLight":t={position:new L,direction:new L,color:new ke,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new ke,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new ke,groundColor:new ke};break;case"RectAreaLight":t={color:new ke,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function Gw(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let Hw=0;function Ww(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function jw(n){const e=new Vw,t=Gw(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const r=new L,s=new ct,o=new ct;function a(c){let d=0,f=0,h=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,g=0,_=0,m=0,u=0,v=0,x=0,y=0,P=0,E=0,A=0;c.sort(Ww);for(let w=0,M=c.length;w<M;w++){const D=c[w],V=D.color,U=D.intensity,B=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=V.r*U,f+=V.g*U,h+=V.b*U;else if(D.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(D.sh.coefficients[W],U);A++}else if(D.isDirectionalLight){const W=e.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const K=D.shadow,N=t.get(D);N.shadowIntensity=K.intensity,N.shadowBias=K.bias,N.shadowNormalBias=K.normalBias,N.shadowRadius=K.radius,N.shadowMapSize=K.mapSize,i.directionalShadow[p]=N,i.directionalShadowMap[p]=X,i.directionalShadowMatrix[p]=D.shadow.matrix,v++}i.directional[p]=W,p++}else if(D.isSpotLight){const W=e.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(V).multiplyScalar(U),W.distance=B,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,i.spot[_]=W;const K=D.shadow;if(D.map&&(i.spotLightMap[P]=D.map,P++,K.updateMatrices(D),D.castShadow&&E++),i.spotLightMatrix[_]=K.matrix,D.castShadow){const N=t.get(D);N.shadowIntensity=K.intensity,N.shadowBias=K.bias,N.shadowNormalBias=K.normalBias,N.shadowRadius=K.radius,N.shadowMapSize=K.mapSize,i.spotShadow[_]=N,i.spotShadowMap[_]=X,y++}_++}else if(D.isRectAreaLight){const W=e.get(D);W.color.copy(V).multiplyScalar(U),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),i.rectArea[m]=W,m++}else if(D.isPointLight){const W=e.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity),W.distance=D.distance,W.decay=D.decay,D.castShadow){const K=D.shadow,N=t.get(D);N.shadowIntensity=K.intensity,N.shadowBias=K.bias,N.shadowNormalBias=K.normalBias,N.shadowRadius=K.radius,N.shadowMapSize=K.mapSize,N.shadowCameraNear=K.camera.near,N.shadowCameraFar=K.camera.far,i.pointShadow[g]=N,i.pointShadowMap[g]=X,i.pointShadowMatrix[g]=D.shadow.matrix,x++}i.point[g]=W,g++}else if(D.isHemisphereLight){const W=e.get(D);W.skyColor.copy(D.color).multiplyScalar(U),W.groundColor.copy(D.groundColor).multiplyScalar(U),i.hemi[u]=W,u++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=f,i.ambient[2]=h;const R=i.hash;(R.directionalLength!==p||R.pointLength!==g||R.spotLength!==_||R.rectAreaLength!==m||R.hemiLength!==u||R.numDirectionalShadows!==v||R.numPointShadows!==x||R.numSpotShadows!==y||R.numSpotMaps!==P||R.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=_,i.rectArea.length=m,i.point.length=g,i.hemi.length=u,i.directionalShadow.length=v,i.directionalShadowMap.length=v,i.pointShadow.length=x,i.pointShadowMap.length=x,i.spotShadow.length=y,i.spotShadowMap.length=y,i.directionalShadowMatrix.length=v,i.pointShadowMatrix.length=x,i.spotLightMatrix.length=y+P-E,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=A,R.directionalLength=p,R.pointLength=g,R.spotLength=_,R.rectAreaLength=m,R.hemiLength=u,R.numDirectionalShadows=v,R.numPointShadows=x,R.numSpotShadows=y,R.numSpotMaps=P,R.numLightProbes=A,i.version=Hw++)}function l(c,d){let f=0,h=0,p=0,g=0,_=0;const m=d.matrixWorldInverse;for(let u=0,v=c.length;u<v;u++){const x=c[u];if(x.isDirectionalLight){const y=i.directional[f];y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),f++}else if(x.isSpotLight){const y=i.spot[p];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),y.direction.sub(r),y.direction.transformDirection(m),p++}else if(x.isRectAreaLight){const y=i.rectArea[g];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),o.identity(),s.copy(x.matrixWorld),s.premultiply(m),o.extractRotation(s),y.halfWidth.set(x.width*.5,0,0),y.halfHeight.set(0,x.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(x.isPointLight){const y=i.point[h];y.position.setFromMatrixPosition(x.matrixWorld),y.position.applyMatrix4(m),h++}else if(x.isHemisphereLight){const y=i.hemi[_];y.direction.setFromMatrixPosition(x.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:i}}function cm(n){const e=new jw(n),t=[],i=[];function r(d){c.camera=d,t.length=0,i.length=0}function s(d){t.push(d)}function o(d){i.push(d)}function a(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function Xw(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new cm(n),e.set(r,[a])):s>=o.length?(a=new cm(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}class Yw extends Gr{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Cy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class qw extends Gr{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const $w=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Kw=`uniform sampler2D shadow_pass;
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
}`;function Zw(n,e,t){let i=new Wf;const r=new Ze,s=new Ze,o=new st,a=new Yw({depthPacking:by}),l=new qw,c={},d=t.maxTextureSize,f={[rr]:en,[en]:rr,[Wn]:Wn},h=new sr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:$w,fragmentShader:Kw}),p=h.clone();p.defines.HORIZONTAL_PASS=1;const g=new dn;g.setAttribute("position",new Dn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ne(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ig;let u=this.type;this.render=function(E,A,R){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;const w=n.getRenderTarget(),M=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),V=n.state;V.setBlending(Qi),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const U=u!==hi&&this.type===hi,B=u===hi&&this.type!==hi;for(let X=0,W=E.length;X<W;X++){const K=E[X],N=K.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const q=N.getFrameExtents();if(r.multiply(q),s.copy(N.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/q.x),r.x=s.x*q.x,N.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/q.y),r.y=s.y*q.y,N.mapSize.y=s.y)),N.map===null||U===!0||B===!0){const le=this.type!==hi?{minFilter:$n,magFilter:$n}:{};N.map!==null&&N.map.dispose(),N.map=new kr(r.x,r.y,le),N.map.texture.name=K.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const Z=N.getViewportCount();for(let le=0;le<Z;le++){const me=N.getViewport(le);o.set(s.x*me.x,s.y*me.y,s.x*me.z,s.y*me.w),V.viewport(o),N.updateMatrices(K,le),i=N.getFrustum(),y(A,R,N.camera,K,this.type)}N.isPointLightShadow!==!0&&this.type===hi&&v(N,R),N.needsUpdate=!1}u=this.type,m.needsUpdate=!1,n.setRenderTarget(w,M,D)};function v(E,A){const R=e.update(_);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,p.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,p.needsUpdate=!0),E.mapPass===null&&(E.mapPass=new kr(r.x,r.y)),h.uniforms.shadow_pass.value=E.map.texture,h.uniforms.resolution.value=E.mapSize,h.uniforms.radius.value=E.radius,n.setRenderTarget(E.mapPass),n.clear(),n.renderBufferDirect(A,null,R,h,_,null),p.uniforms.shadow_pass.value=E.mapPass.texture,p.uniforms.resolution.value=E.mapSize,p.uniforms.radius.value=E.radius,n.setRenderTarget(E.map),n.clear(),n.renderBufferDirect(A,null,R,p,_,null)}function x(E,A,R,w){let M=null;const D=R.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)M=D;else if(M=R.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const V=M.uuid,U=A.uuid;let B=c[V];B===void 0&&(B={},c[V]=B);let X=B[U];X===void 0&&(X=M.clone(),B[U]=X,A.addEventListener("dispose",P)),M=X}if(M.visible=A.visible,M.wireframe=A.wireframe,w===hi?M.side=A.shadowSide!==null?A.shadowSide:A.side:M.side=A.shadowSide!==null?A.shadowSide:f[A.side],M.alphaMap=A.alphaMap,M.alphaTest=A.alphaTest,M.map=A.map,M.clipShadows=A.clipShadows,M.clippingPlanes=A.clippingPlanes,M.clipIntersection=A.clipIntersection,M.displacementMap=A.displacementMap,M.displacementScale=A.displacementScale,M.displacementBias=A.displacementBias,M.wireframeLinewidth=A.wireframeLinewidth,M.linewidth=A.linewidth,R.isPointLight===!0&&M.isMeshDistanceMaterial===!0){const V=n.properties.get(M);V.light=R}return M}function y(E,A,R,w,M){if(E.visible===!1)return;if(E.layers.test(A.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&M===hi)&&(!E.frustumCulled||i.intersectsObject(E))){E.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,E.matrixWorld);const U=e.update(E),B=E.material;if(Array.isArray(B)){const X=U.groups;for(let W=0,K=X.length;W<K;W++){const N=X[W],q=B[N.materialIndex];if(q&&q.visible){const Z=x(E,q,w,M);E.onBeforeShadow(n,E,A,R,U,Z,N),n.renderBufferDirect(R,null,U,Z,E,N),E.onAfterShadow(n,E,A,R,U,Z,N)}}}else if(B.visible){const X=x(E,B,w,M);E.onBeforeShadow(n,E,A,R,U,X,null),n.renderBufferDirect(R,null,U,X,E,null),E.onAfterShadow(n,E,A,R,U,X,null)}}const V=E.children;for(let U=0,B=V.length;U<B;U++)y(V[U],A,R,w,M)}function P(E){E.target.removeEventListener("dispose",P);for(const R in c){const w=c[R],M=E.target.uuid;M in w&&(w[M].dispose(),delete w[M])}}}const Qw={[id]:rd,[sd]:ld,[od]:cd,[Is]:ad,[rd]:id,[ld]:sd,[cd]:od,[ad]:Is};function Jw(n,e){function t(){let I=!1;const de=new st;let j=null;const J=new st(0,0,0,0);return{setMask:function(ge){j!==ge&&!I&&(n.colorMask(ge,ge,ge,ge),j=ge)},setLocked:function(ge){I=ge},setClear:function(ge,he,Ue,St,Vt){Vt===!0&&(ge*=St,he*=St,Ue*=St),de.set(ge,he,Ue,St),J.equals(de)===!1&&(n.clearColor(ge,he,Ue,St),J.copy(de))},reset:function(){I=!1,j=null,J.set(-1,0,0,0)}}}function i(){let I=!1,de=!1,j=null,J=null,ge=null;return{setReversed:function(he){if(de!==he){const Ue=e.get("EXT_clip_control");de?Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.ZERO_TO_ONE_EXT):Ue.clipControlEXT(Ue.LOWER_LEFT_EXT,Ue.NEGATIVE_ONE_TO_ONE_EXT);const St=ge;ge=null,this.setClear(St)}de=he},getReversed:function(){return de},setTest:function(he){he?ce(n.DEPTH_TEST):Pe(n.DEPTH_TEST)},setMask:function(he){j!==he&&!I&&(n.depthMask(he),j=he)},setFunc:function(he){if(de&&(he=Qw[he]),J!==he){switch(he){case id:n.depthFunc(n.NEVER);break;case rd:n.depthFunc(n.ALWAYS);break;case sd:n.depthFunc(n.LESS);break;case Is:n.depthFunc(n.LEQUAL);break;case od:n.depthFunc(n.EQUAL);break;case ad:n.depthFunc(n.GEQUAL);break;case ld:n.depthFunc(n.GREATER);break;case cd:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}J=he}},setLocked:function(he){I=he},setClear:function(he){ge!==he&&(de&&(he=1-he),n.clearDepth(he),ge=he)},reset:function(){I=!1,j=null,J=null,ge=null,de=!1}}}function r(){let I=!1,de=null,j=null,J=null,ge=null,he=null,Ue=null,St=null,Vt=null;return{setTest:function(tt){I||(tt?ce(n.STENCIL_TEST):Pe(n.STENCIL_TEST))},setMask:function(tt){de!==tt&&!I&&(n.stencilMask(tt),de=tt)},setFunc:function(tt,Un,oi){(j!==tt||J!==Un||ge!==oi)&&(n.stencilFunc(tt,Un,oi),j=tt,J=Un,ge=oi)},setOp:function(tt,Un,oi){(he!==tt||Ue!==Un||St!==oi)&&(n.stencilOp(tt,Un,oi),he=tt,Ue=Un,St=oi)},setLocked:function(tt){I=tt},setClear:function(tt){Vt!==tt&&(n.clearStencil(tt),Vt=tt)},reset:function(){I=!1,de=null,j=null,J=null,ge=null,he=null,Ue=null,St=null,Vt=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let d={},f={},h=new WeakMap,p=[],g=null,_=!1,m=null,u=null,v=null,x=null,y=null,P=null,E=null,A=new ke(0,0,0),R=0,w=!1,M=null,D=null,V=null,U=null,B=null;const X=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,K=0;const N=n.getParameter(n.VERSION);N.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(N)[1]),W=K>=1):N.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),W=K>=2);let q=null,Z={};const le=n.getParameter(n.SCISSOR_BOX),me=n.getParameter(n.VIEWPORT),Ne=new st().fromArray(le),Y=new st().fromArray(me);function re(I,de,j,J){const ge=new Uint8Array(4),he=n.createTexture();n.bindTexture(I,he),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ue=0;Ue<j;Ue++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(de,0,n.RGBA,1,1,J,0,n.RGBA,n.UNSIGNED_BYTE,ge):n.texImage2D(de+Ue,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ge);return he}const ve={};ve[n.TEXTURE_2D]=re(n.TEXTURE_2D,n.TEXTURE_2D,1),ve[n.TEXTURE_CUBE_MAP]=re(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ve[n.TEXTURE_2D_ARRAY]=re(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ve[n.TEXTURE_3D]=re(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ce(n.DEPTH_TEST),o.setFunc(Is),He(!1),We(fp),ce(n.CULL_FACE),k(Qi);function ce(I){d[I]!==!0&&(n.enable(I),d[I]=!0)}function Pe(I){d[I]!==!1&&(n.disable(I),d[I]=!1)}function Ie(I,de){return f[I]!==de?(n.bindFramebuffer(I,de),f[I]=de,I===n.DRAW_FRAMEBUFFER&&(f[n.FRAMEBUFFER]=de),I===n.FRAMEBUFFER&&(f[n.DRAW_FRAMEBUFFER]=de),!0):!1}function Ve(I,de){let j=p,J=!1;if(I){j=h.get(de),j===void 0&&(j=[],h.set(de,j));const ge=I.textures;if(j.length!==ge.length||j[0]!==n.COLOR_ATTACHMENT0){for(let he=0,Ue=ge.length;he<Ue;he++)j[he]=n.COLOR_ATTACHMENT0+he;j.length=ge.length,J=!0}}else j[0]!==n.BACK&&(j[0]=n.BACK,J=!0);J&&n.drawBuffers(j)}function vt(I){return g!==I?(n.useProgram(I),g=I,!0):!1}const Ye={[Mr]:n.FUNC_ADD,[ty]:n.FUNC_SUBTRACT,[ny]:n.FUNC_REVERSE_SUBTRACT};Ye[iy]=n.MIN,Ye[ry]=n.MAX;const wt={[sy]:n.ZERO,[oy]:n.ONE,[ay]:n.SRC_COLOR,[td]:n.SRC_ALPHA,[hy]:n.SRC_ALPHA_SATURATE,[dy]:n.DST_COLOR,[cy]:n.DST_ALPHA,[ly]:n.ONE_MINUS_SRC_COLOR,[nd]:n.ONE_MINUS_SRC_ALPHA,[fy]:n.ONE_MINUS_DST_COLOR,[uy]:n.ONE_MINUS_DST_ALPHA,[py]:n.CONSTANT_COLOR,[my]:n.ONE_MINUS_CONSTANT_COLOR,[gy]:n.CONSTANT_ALPHA,[vy]:n.ONE_MINUS_CONSTANT_ALPHA};function k(I,de,j,J,ge,he,Ue,St,Vt,tt){if(I===Qi){_===!0&&(Pe(n.BLEND),_=!1);return}if(_===!1&&(ce(n.BLEND),_=!0),I!==ey){if(I!==m||tt!==w){if((u!==Mr||y!==Mr)&&(n.blendEquation(n.FUNC_ADD),u=Mr,y=Mr),tt)switch(I){case Pr:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case hp:n.blendFunc(n.ONE,n.ONE);break;case pp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case mp:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case Pr:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case hp:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case pp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case mp:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}v=null,x=null,P=null,E=null,A.set(0,0,0),R=0,m=I,w=tt}return}ge=ge||de,he=he||j,Ue=Ue||J,(de!==u||ge!==y)&&(n.blendEquationSeparate(Ye[de],Ye[ge]),u=de,y=ge),(j!==v||J!==x||he!==P||Ue!==E)&&(n.blendFuncSeparate(wt[j],wt[J],wt[he],wt[Ue]),v=j,x=J,P=he,E=Ue),(St.equals(A)===!1||Vt!==R)&&(n.blendColor(St.r,St.g,St.b,Vt),A.copy(St),R=Vt),m=I,w=!1}function En(I,de){I.side===Wn?Pe(n.CULL_FACE):ce(n.CULL_FACE);let j=I.side===en;de&&(j=!j),He(j),I.blending===Pr&&I.transparent===!1?k(Qi):k(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),o.setFunc(I.depthFunc),o.setTest(I.depthTest),o.setMask(I.depthWrite),s.setMask(I.colorWrite);const J=I.stencilWrite;a.setTest(J),J&&(a.setMask(I.stencilWriteMask),a.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),a.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),ut(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?ce(n.SAMPLE_ALPHA_TO_COVERAGE):Pe(n.SAMPLE_ALPHA_TO_COVERAGE)}function He(I){M!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),M=I)}function We(I){I!==Q_?(ce(n.CULL_FACE),I!==D&&(I===fp?n.cullFace(n.BACK):I===J_?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Pe(n.CULL_FACE),D=I}function Ce(I){I!==V&&(W&&n.lineWidth(I),V=I)}function ut(I,de,j){I?(ce(n.POLYGON_OFFSET_FILL),(U!==de||B!==j)&&(n.polygonOffset(de,j),U=de,B=j)):Pe(n.POLYGON_OFFSET_FILL)}function Re(I){I?ce(n.SCISSOR_TEST):Pe(n.SCISSOR_TEST)}function C(I){I===void 0&&(I=n.TEXTURE0+X-1),q!==I&&(n.activeTexture(I),q=I)}function S(I,de,j){j===void 0&&(q===null?j=n.TEXTURE0+X-1:j=q);let J=Z[j];J===void 0&&(J={type:void 0,texture:void 0},Z[j]=J),(J.type!==I||J.texture!==de)&&(q!==j&&(n.activeTexture(j),q=j),n.bindTexture(I,de||ve[I]),J.type=I,J.texture=de)}function z(){const I=Z[q];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Q(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function te(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function $(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Te(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function fe(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function _e(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function qe(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function se(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ye(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function be(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Le(I){Ne.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),Ne.copy(I))}function Me(I){Y.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),Y.copy(I))}function je(I,de){let j=c.get(de);j===void 0&&(j=new WeakMap,c.set(de,j));let J=j.get(I);J===void 0&&(J=n.getUniformBlockIndex(de,I.name),j.set(I,J))}function Be(I,de){const J=c.get(de).get(I);l.get(de)!==J&&(n.uniformBlockBinding(de,J,I.__bindingPointIndex),l.set(de,J))}function ot(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},q=null,Z={},f={},h=new WeakMap,p=[],g=null,_=!1,m=null,u=null,v=null,x=null,y=null,P=null,E=null,A=new ke(0,0,0),R=0,w=!1,M=null,D=null,V=null,U=null,B=null,Ne.set(0,0,n.canvas.width,n.canvas.height),Y.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ce,disable:Pe,bindFramebuffer:Ie,drawBuffers:Ve,useProgram:vt,setBlending:k,setMaterial:En,setFlipSided:He,setCullFace:We,setLineWidth:Ce,setPolygonOffset:ut,setScissorTest:Re,activeTexture:C,bindTexture:S,unbindTexture:z,compressedTexImage2D:Q,compressedTexImage3D:te,texImage2D:ye,texImage3D:be,updateUBOMapping:je,uniformBlockBinding:Be,texStorage2D:qe,texStorage3D:se,texSubImage2D:$,texSubImage3D:Te,compressedTexSubImage2D:fe,compressedTexSubImage3D:_e,scissor:Le,viewport:Me,reset:ot}}function um(n,e,t,i){const r=eT(i);switch(t){case Vg:return n*e;case Hg:return n*e;case Wg:return n*e*2;case jg:return n*e/r.components*r.byteLength;case zf:return n*e/r.components*r.byteLength;case Xg:return n*e*2/r.components*r.byteLength;case Vf:return n*e*2/r.components*r.byteLength;case Gg:return n*e*3/r.components*r.byteLength;case Xn:return n*e*4/r.components*r.byteLength;case Gf:return n*e*4/r.components*r.byteLength;case sl:case ol:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case al:case ll:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case pd:case gd:return Math.max(n,16)*Math.max(e,8)/4;case hd:case md:return Math.max(n,8)*Math.max(e,8)/2;case vd:case xd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case _d:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case yd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Md:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Sd:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ed:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case wd:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Td:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ad:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Rd:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Cd:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case bd:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Pd:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ld:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Dd:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Nd:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case cl:case Id:case Ud:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Yg:case Fd:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Od:case kd:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function eT(n){switch(n){case Ai:case kg:return{byteLength:1,components:1};case Xo:case Bg:case ea:return{byteLength:2,components:1};case kf:case Bf:return{byteLength:2,components:4};case Or:case Of:case xi:return{byteLength:4,components:1};case zg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function tT(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ze,d=new WeakMap;let f;const h=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,S){return p?new OffscreenCanvas(C,S):Fl("canvas")}function _(C,S,z){let Q=1;const te=Re(C);if((te.width>z||te.height>z)&&(Q=z/Math.max(te.width,te.height)),Q<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const $=Math.floor(Q*te.width),Te=Math.floor(Q*te.height);f===void 0&&(f=g($,Te));const fe=S?g($,Te):f;return fe.width=$,fe.height=Te,fe.getContext("2d").drawImage(C,0,0,$,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+$+"x"+Te+")."),fe}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),C;return C}function m(C){return C.generateMipmaps}function u(C){n.generateMipmap(C)}function v(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function x(C,S,z,Q,te=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let $=S;if(S===n.RED&&(z===n.FLOAT&&($=n.R32F),z===n.HALF_FLOAT&&($=n.R16F),z===n.UNSIGNED_BYTE&&($=n.R8)),S===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&($=n.R8UI),z===n.UNSIGNED_SHORT&&($=n.R16UI),z===n.UNSIGNED_INT&&($=n.R32UI),z===n.BYTE&&($=n.R8I),z===n.SHORT&&($=n.R16I),z===n.INT&&($=n.R32I)),S===n.RG&&(z===n.FLOAT&&($=n.RG32F),z===n.HALF_FLOAT&&($=n.RG16F),z===n.UNSIGNED_BYTE&&($=n.RG8)),S===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&($=n.RG8UI),z===n.UNSIGNED_SHORT&&($=n.RG16UI),z===n.UNSIGNED_INT&&($=n.RG32UI),z===n.BYTE&&($=n.RG8I),z===n.SHORT&&($=n.RG16I),z===n.INT&&($=n.RG32I)),S===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&($=n.RGB8UI),z===n.UNSIGNED_SHORT&&($=n.RGB16UI),z===n.UNSIGNED_INT&&($=n.RGB32UI),z===n.BYTE&&($=n.RGB8I),z===n.SHORT&&($=n.RGB16I),z===n.INT&&($=n.RGB32I)),S===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&($=n.RGBA8UI),z===n.UNSIGNED_SHORT&&($=n.RGBA16UI),z===n.UNSIGNED_INT&&($=n.RGBA32UI),z===n.BYTE&&($=n.RGBA8I),z===n.SHORT&&($=n.RGBA16I),z===n.INT&&($=n.RGBA32I)),S===n.RGB&&z===n.UNSIGNED_INT_5_9_9_9_REV&&($=n.RGB9_E5),S===n.RGBA){const Te=te?nc:$e.getTransfer(Q);z===n.FLOAT&&($=n.RGBA32F),z===n.HALF_FLOAT&&($=n.RGBA16F),z===n.UNSIGNED_BYTE&&($=Te===rt?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT_4_4_4_4&&($=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&($=n.RGB5_A1)}return($===n.R16F||$===n.R32F||$===n.RG16F||$===n.RG32F||$===n.RGBA16F||$===n.RGBA32F)&&e.get("EXT_color_buffer_float"),$}function y(C,S){let z;return C?S===null||S===Or||S===Os?z=n.DEPTH24_STENCIL8:S===xi?z=n.DEPTH32F_STENCIL8:S===Xo&&(z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===Or||S===Os?z=n.DEPTH_COMPONENT24:S===xi?z=n.DEPTH_COMPONENT32F:S===Xo&&(z=n.DEPTH_COMPONENT16),z}function P(C,S){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==$n&&C.minFilter!==ni?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function E(C){const S=C.target;S.removeEventListener("dispose",E),R(S),S.isVideoTexture&&d.delete(S)}function A(C){const S=C.target;S.removeEventListener("dispose",A),M(S)}function R(C){const S=i.get(C);if(S.__webglInit===void 0)return;const z=C.source,Q=h.get(z);if(Q){const te=Q[S.__cacheKey];te.usedTimes--,te.usedTimes===0&&w(C),Object.keys(Q).length===0&&h.delete(z)}i.remove(C)}function w(C){const S=i.get(C);n.deleteTexture(S.__webglTexture);const z=C.source,Q=h.get(z);delete Q[S.__cacheKey],o.memory.textures--}function M(C){const S=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(S.__webglFramebuffer[Q]))for(let te=0;te<S.__webglFramebuffer[Q].length;te++)n.deleteFramebuffer(S.__webglFramebuffer[Q][te]);else n.deleteFramebuffer(S.__webglFramebuffer[Q]);S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer[Q])}else{if(Array.isArray(S.__webglFramebuffer))for(let Q=0;Q<S.__webglFramebuffer.length;Q++)n.deleteFramebuffer(S.__webglFramebuffer[Q]);else n.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&n.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&n.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let Q=0;Q<S.__webglColorRenderbuffer.length;Q++)S.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(S.__webglColorRenderbuffer[Q]);S.__webglDepthRenderbuffer&&n.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const z=C.textures;for(let Q=0,te=z.length;Q<te;Q++){const $=i.get(z[Q]);$.__webglTexture&&(n.deleteTexture($.__webglTexture),o.memory.textures--),i.remove(z[Q])}i.remove(C)}let D=0;function V(){D=0}function U(){const C=D;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),D+=1,C}function B(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function X(C,S){const z=i.get(C);if(C.isVideoTexture&&Ce(C),C.isRenderTargetTexture===!1&&C.version>0&&z.__version!==C.version){const Q=C.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(z,C,S);return}}t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+S)}function W(C,S){const z=i.get(C);if(C.version>0&&z.__version!==C.version){Y(z,C,S);return}t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+S)}function K(C,S){const z=i.get(C);if(C.version>0&&z.__version!==C.version){Y(z,C,S);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+S)}function N(C,S){const z=i.get(C);if(C.version>0&&z.__version!==C.version){re(z,C,S);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+S)}const q={[Fr]:n.REPEAT,[Ar]:n.CLAMP_TO_EDGE,[fd]:n.MIRRORED_REPEAT},Z={[$n]:n.NEAREST,[Ry]:n.NEAREST_MIPMAP_NEAREST,[Sa]:n.NEAREST_MIPMAP_LINEAR,[ni]:n.LINEAR,[Lc]:n.LINEAR_MIPMAP_NEAREST,[Rr]:n.LINEAR_MIPMAP_LINEAR},le={[Ly]:n.NEVER,[Oy]:n.ALWAYS,[Dy]:n.LESS,[$g]:n.LEQUAL,[Ny]:n.EQUAL,[Fy]:n.GEQUAL,[Iy]:n.GREATER,[Uy]:n.NOTEQUAL};function me(C,S){if(S.type===xi&&e.has("OES_texture_float_linear")===!1&&(S.magFilter===ni||S.magFilter===Lc||S.magFilter===Sa||S.magFilter===Rr||S.minFilter===ni||S.minFilter===Lc||S.minFilter===Sa||S.minFilter===Rr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,q[S.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,q[S.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,q[S.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,Z[S.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,Z[S.minFilter]),S.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,le[S.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===$n||S.minFilter!==Sa&&S.minFilter!==Rr||S.type===xi&&e.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||i.get(S).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),i.get(S).__currentAnisotropy=S.anisotropy}}}function Ne(C,S){let z=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",E));const Q=S.source;let te=h.get(Q);te===void 0&&(te={},h.set(Q,te));const $=B(S);if($!==C.__cacheKey){te[$]===void 0&&(te[$]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,z=!0),te[$].usedTimes++;const Te=te[C.__cacheKey];Te!==void 0&&(te[C.__cacheKey].usedTimes--,Te.usedTimes===0&&w(S)),C.__cacheKey=$,C.__webglTexture=te[$].texture}return z}function Y(C,S,z){let Q=n.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),S.isData3DTexture&&(Q=n.TEXTURE_3D);const te=Ne(C,S),$=S.source;t.bindTexture(Q,C.__webglTexture,n.TEXTURE0+z);const Te=i.get($);if($.version!==Te.__version||te===!0){t.activeTexture(n.TEXTURE0+z);const fe=$e.getPrimaries($e.workingColorSpace),_e=S.colorSpace===Vi?null:$e.getPrimaries(S.colorSpace),qe=S.colorSpace===Vi||fe===_e?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let se=_(S.image,!1,r.maxTextureSize);se=ut(S,se);const ye=s.convert(S.format,S.colorSpace),be=s.convert(S.type);let Le=x(S.internalFormat,ye,be,S.colorSpace,S.isVideoTexture);me(Q,S);let Me;const je=S.mipmaps,Be=S.isVideoTexture!==!0,ot=Te.__version===void 0||te===!0,I=$.dataReady,de=P(S,se);if(S.isDepthTexture)Le=y(S.format===ks,S.type),ot&&(Be?t.texStorage2D(n.TEXTURE_2D,1,Le,se.width,se.height):t.texImage2D(n.TEXTURE_2D,0,Le,se.width,se.height,0,ye,be,null));else if(S.isDataTexture)if(je.length>0){Be&&ot&&t.texStorage2D(n.TEXTURE_2D,de,Le,je[0].width,je[0].height);for(let j=0,J=je.length;j<J;j++)Me=je[j],Be?I&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,Me.width,Me.height,ye,be,Me.data):t.texImage2D(n.TEXTURE_2D,j,Le,Me.width,Me.height,0,ye,be,Me.data);S.generateMipmaps=!1}else Be?(ot&&t.texStorage2D(n.TEXTURE_2D,de,Le,se.width,se.height),I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,se.width,se.height,ye,be,se.data)):t.texImage2D(n.TEXTURE_2D,0,Le,se.width,se.height,0,ye,be,se.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){Be&&ot&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,Le,je[0].width,je[0].height,se.depth);for(let j=0,J=je.length;j<J;j++)if(Me=je[j],S.format!==Xn)if(ye!==null)if(Be){if(I)if(S.layerUpdates.size>0){const ge=um(Me.width,Me.height,S.format,S.type);for(const he of S.layerUpdates){const Ue=Me.data.subarray(he*ge/Me.data.BYTES_PER_ELEMENT,(he+1)*ge/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,he,Me.width,Me.height,1,ye,Ue)}S.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,Me.width,Me.height,se.depth,ye,Me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,Le,Me.width,Me.height,se.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?I&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,Me.width,Me.height,se.depth,ye,be,Me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,j,Le,Me.width,Me.height,se.depth,0,ye,be,Me.data)}else{Be&&ot&&t.texStorage2D(n.TEXTURE_2D,de,Le,je[0].width,je[0].height);for(let j=0,J=je.length;j<J;j++)Me=je[j],S.format!==Xn?ye!==null?Be?I&&t.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,Me.width,Me.height,ye,Me.data):t.compressedTexImage2D(n.TEXTURE_2D,j,Le,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?I&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,Me.width,Me.height,ye,be,Me.data):t.texImage2D(n.TEXTURE_2D,j,Le,Me.width,Me.height,0,ye,be,Me.data)}else if(S.isDataArrayTexture)if(Be){if(ot&&t.texStorage3D(n.TEXTURE_2D_ARRAY,de,Le,se.width,se.height,se.depth),I)if(S.layerUpdates.size>0){const j=um(se.width,se.height,S.format,S.type);for(const J of S.layerUpdates){const ge=se.data.subarray(J*j/se.data.BYTES_PER_ELEMENT,(J+1)*j/se.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,J,se.width,se.height,1,ye,be,ge)}S.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,se.width,se.height,se.depth,ye,be,se.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,se.width,se.height,se.depth,0,ye,be,se.data);else if(S.isData3DTexture)Be?(ot&&t.texStorage3D(n.TEXTURE_3D,de,Le,se.width,se.height,se.depth),I&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,se.width,se.height,se.depth,ye,be,se.data)):t.texImage3D(n.TEXTURE_3D,0,Le,se.width,se.height,se.depth,0,ye,be,se.data);else if(S.isFramebufferTexture){if(ot)if(Be)t.texStorage2D(n.TEXTURE_2D,de,Le,se.width,se.height);else{let j=se.width,J=se.height;for(let ge=0;ge<de;ge++)t.texImage2D(n.TEXTURE_2D,ge,Le,j,J,0,ye,be,null),j>>=1,J>>=1}}else if(je.length>0){if(Be&&ot){const j=Re(je[0]);t.texStorage2D(n.TEXTURE_2D,de,Le,j.width,j.height)}for(let j=0,J=je.length;j<J;j++)Me=je[j],Be?I&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,ye,be,Me):t.texImage2D(n.TEXTURE_2D,j,Le,ye,be,Me);S.generateMipmaps=!1}else if(Be){if(ot){const j=Re(se);t.texStorage2D(n.TEXTURE_2D,de,Le,j.width,j.height)}I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ye,be,se)}else t.texImage2D(n.TEXTURE_2D,0,Le,ye,be,se);m(S)&&u(Q),Te.__version=$.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function re(C,S,z){if(S.image.length!==6)return;const Q=Ne(C,S),te=S.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+z);const $=i.get(te);if(te.version!==$.__version||Q===!0){t.activeTexture(n.TEXTURE0+z);const Te=$e.getPrimaries($e.workingColorSpace),fe=S.colorSpace===Vi?null:$e.getPrimaries(S.colorSpace),_e=S.colorSpace===Vi||Te===fe?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,S.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,S.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const qe=S.isCompressedTexture||S.image[0].isCompressedTexture,se=S.image[0]&&S.image[0].isDataTexture,ye=[];for(let J=0;J<6;J++)!qe&&!se?ye[J]=_(S.image[J],!0,r.maxCubemapSize):ye[J]=se?S.image[J].image:S.image[J],ye[J]=ut(S,ye[J]);const be=ye[0],Le=s.convert(S.format,S.colorSpace),Me=s.convert(S.type),je=x(S.internalFormat,Le,Me,S.colorSpace),Be=S.isVideoTexture!==!0,ot=$.__version===void 0||Q===!0,I=te.dataReady;let de=P(S,be);me(n.TEXTURE_CUBE_MAP,S);let j;if(qe){Be&&ot&&t.texStorage2D(n.TEXTURE_CUBE_MAP,de,je,be.width,be.height);for(let J=0;J<6;J++){j=ye[J].mipmaps;for(let ge=0;ge<j.length;ge++){const he=j[ge];S.format!==Xn?Le!==null?Be?I&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,0,0,he.width,he.height,Le,he.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,je,he.width,he.height,0,he.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,0,0,he.width,he.height,Le,Me,he.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge,je,he.width,he.height,0,Le,Me,he.data)}}}else{if(j=S.mipmaps,Be&&ot){j.length>0&&de++;const J=Re(ye[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,de,je,J.width,J.height)}for(let J=0;J<6;J++)if(se){Be?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,ye[J].width,ye[J].height,Le,Me,ye[J].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,je,ye[J].width,ye[J].height,0,Le,Me,ye[J].data);for(let ge=0;ge<j.length;ge++){const Ue=j[ge].image[J].image;Be?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,0,0,Ue.width,Ue.height,Le,Me,Ue.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,je,Ue.width,Ue.height,0,Le,Me,Ue.data)}}else{Be?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Le,Me,ye[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,je,Le,Me,ye[J]);for(let ge=0;ge<j.length;ge++){const he=j[ge];Be?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,0,0,Le,Me,he.image[J]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,ge+1,je,Le,Me,he.image[J])}}}m(S)&&u(n.TEXTURE_CUBE_MAP),$.__version=te.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function ve(C,S,z,Q,te,$){const Te=s.convert(z.format,z.colorSpace),fe=s.convert(z.type),_e=x(z.internalFormat,Te,fe,z.colorSpace),qe=i.get(S),se=i.get(z);if(se.__renderTarget=S,!qe.__hasExternalTextures){const ye=Math.max(1,S.width>>$),be=Math.max(1,S.height>>$);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,$,_e,ye,be,S.depth,0,Te,fe,null):t.texImage2D(te,$,_e,ye,be,0,Te,fe,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),We(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,te,se.__webglTexture,0,He(S)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,te,se.__webglTexture,$),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ce(C,S,z){if(n.bindRenderbuffer(n.RENDERBUFFER,C),S.depthBuffer){const Q=S.depthTexture,te=Q&&Q.isDepthTexture?Q.type:null,$=y(S.stencilBuffer,te),Te=S.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,fe=He(S);We(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,fe,$,S.width,S.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,fe,$,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,$,S.width,S.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Te,n.RENDERBUFFER,C)}else{const Q=S.textures;for(let te=0;te<Q.length;te++){const $=Q[te],Te=s.convert($.format,$.colorSpace),fe=s.convert($.type),_e=x($.internalFormat,Te,fe,$.colorSpace),qe=He(S);z&&We(S)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,qe,_e,S.width,S.height):We(S)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,qe,_e,S.width,S.height):n.renderbufferStorage(n.RENDERBUFFER,_e,S.width,S.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Pe(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(S.depthTexture);Q.__renderTarget=S,(!Q.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),X(S.depthTexture,0);const te=Q.__webglTexture,$=He(S);if(S.depthTexture.format===Ts)We(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0);else if(S.depthTexture.format===ks)We(S)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0,$):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function Ie(C){const S=i.get(C),z=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const Q=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),Q){const te=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,Q.removeEventListener("dispose",te)};Q.addEventListener("dispose",te),S.__depthDisposeCallback=te}S.__boundDepthTexture=Q}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");Pe(S.__webglFramebuffer,C)}else if(z){S.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer[Q]),S.__webglDepthbuffer[Q]===void 0)S.__webglDepthbuffer[Q]=n.createRenderbuffer(),ce(S.__webglDepthbuffer[Q],C,!1);else{const te=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,$=S.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,$),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,$)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=n.createRenderbuffer(),ce(S.__webglDepthbuffer,C,!1);else{const Q=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,te=S.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,te),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,te)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Ve(C,S,z){const Q=i.get(C);S!==void 0&&ve(Q.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Ie(C)}function vt(C){const S=C.texture,z=i.get(C),Q=i.get(S);C.addEventListener("dispose",A);const te=C.textures,$=C.isWebGLCubeRenderTarget===!0,Te=te.length>1;if(Te||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=S.version,o.memory.textures++),$){z.__webglFramebuffer=[];for(let fe=0;fe<6;fe++)if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer[fe]=[];for(let _e=0;_e<S.mipmaps.length;_e++)z.__webglFramebuffer[fe][_e]=n.createFramebuffer()}else z.__webglFramebuffer[fe]=n.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){z.__webglFramebuffer=[];for(let fe=0;fe<S.mipmaps.length;fe++)z.__webglFramebuffer[fe]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(Te)for(let fe=0,_e=te.length;fe<_e;fe++){const qe=i.get(te[fe]);qe.__webglTexture===void 0&&(qe.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&We(C)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let fe=0;fe<te.length;fe++){const _e=te[fe];z.__webglColorRenderbuffer[fe]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[fe]);const qe=s.convert(_e.format,_e.colorSpace),se=s.convert(_e.type),ye=x(_e.internalFormat,qe,se,_e.colorSpace,C.isXRRenderTarget===!0),be=He(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,be,ye,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,z.__webglColorRenderbuffer[fe])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),ce(z.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if($){t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),me(n.TEXTURE_CUBE_MAP,S);for(let fe=0;fe<6;fe++)if(S.mipmaps&&S.mipmaps.length>0)for(let _e=0;_e<S.mipmaps.length;_e++)ve(z.__webglFramebuffer[fe][_e],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,_e);else ve(z.__webglFramebuffer[fe],C,S,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+fe,0);m(S)&&u(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let fe=0,_e=te.length;fe<_e;fe++){const qe=te[fe],se=i.get(qe);t.bindTexture(n.TEXTURE_2D,se.__webglTexture),me(n.TEXTURE_2D,qe),ve(z.__webglFramebuffer,C,qe,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,0),m(qe)&&u(n.TEXTURE_2D)}t.unbindTexture()}else{let fe=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(fe=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(fe,Q.__webglTexture),me(fe,S),S.mipmaps&&S.mipmaps.length>0)for(let _e=0;_e<S.mipmaps.length;_e++)ve(z.__webglFramebuffer[_e],C,S,n.COLOR_ATTACHMENT0,fe,_e);else ve(z.__webglFramebuffer,C,S,n.COLOR_ATTACHMENT0,fe,0);m(S)&&u(fe),t.unbindTexture()}C.depthBuffer&&Ie(C)}function Ye(C){const S=C.textures;for(let z=0,Q=S.length;z<Q;z++){const te=S[z];if(m(te)){const $=v(C),Te=i.get(te).__webglTexture;t.bindTexture($,Te),u($),t.unbindTexture()}}}const wt=[],k=[];function En(C){if(C.samples>0){if(We(C)===!1){const S=C.textures,z=C.width,Q=C.height;let te=n.COLOR_BUFFER_BIT;const $=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Te=i.get(C),fe=S.length>1;if(fe)for(let _e=0;_e<S.length;_e++)t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let _e=0;_e<S.length;_e++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),fe){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Te.__webglColorRenderbuffer[_e]);const qe=i.get(S[_e]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,qe,0)}n.blitFramebuffer(0,0,z,Q,0,0,z,Q,te,n.NEAREST),l===!0&&(wt.length=0,k.length=0,wt.push(n.COLOR_ATTACHMENT0+_e),C.depthBuffer&&C.resolveDepthBuffer===!1&&(wt.push($),k.push($),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,k)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,wt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),fe)for(let _e=0;_e<S.length;_e++){t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,Te.__webglColorRenderbuffer[_e]);const qe=i.get(S[_e]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,qe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const S=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[S])}}}function He(C){return Math.min(r.maxSamples,C.samples)}function We(C){const S=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Ce(C){const S=o.render.frame;d.get(C)!==S&&(d.set(C,S),C.update())}function ut(C,S){const z=C.colorSpace,Q=C.format,te=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||z!==Hs&&z!==Vi&&($e.getTransfer(z)===rt?(Q!==Xn||te!==Ai)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),S}function Re(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=U,this.resetTextureUnits=V,this.setTexture2D=X,this.setTexture2DArray=W,this.setTexture3D=K,this.setTextureCube=N,this.rebindTextures=Ve,this.setupRenderTarget=vt,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=En,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=ve,this.useMultisampledRTT=We}function nT(n,e){function t(i,r=Vi){let s;const o=$e.getTransfer(r);if(i===Ai)return n.UNSIGNED_BYTE;if(i===kf)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Bf)return n.UNSIGNED_SHORT_5_5_5_1;if(i===zg)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===kg)return n.BYTE;if(i===Bg)return n.SHORT;if(i===Xo)return n.UNSIGNED_SHORT;if(i===Of)return n.INT;if(i===Or)return n.UNSIGNED_INT;if(i===xi)return n.FLOAT;if(i===ea)return n.HALF_FLOAT;if(i===Vg)return n.ALPHA;if(i===Gg)return n.RGB;if(i===Xn)return n.RGBA;if(i===Hg)return n.LUMINANCE;if(i===Wg)return n.LUMINANCE_ALPHA;if(i===Ts)return n.DEPTH_COMPONENT;if(i===ks)return n.DEPTH_STENCIL;if(i===jg)return n.RED;if(i===zf)return n.RED_INTEGER;if(i===Xg)return n.RG;if(i===Vf)return n.RG_INTEGER;if(i===Gf)return n.RGBA_INTEGER;if(i===sl||i===ol||i===al||i===ll)if(o===rt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===sl)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ol)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===al)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ll)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===sl)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ol)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===al)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ll)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===hd||i===pd||i===md||i===gd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===hd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===pd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===md)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===gd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===vd||i===xd||i===_d)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===vd||i===xd)return o===rt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===_d)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===yd||i===Md||i===Sd||i===Ed||i===wd||i===Td||i===Ad||i===Rd||i===Cd||i===bd||i===Pd||i===Ld||i===Dd||i===Nd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===yd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Md)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Sd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ed)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===wd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Td)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ad)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Rd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Cd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===bd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Pd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ld)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Dd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Nd)return o===rt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===cl||i===Id||i===Ud)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===cl)return o===rt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Id)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ud)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Yg||i===Fd||i===Od||i===kd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===cl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Fd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Od)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===kd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Os?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class iT extends vn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class nt extends Ft{constructor(){super(),this.isGroup=!0,this.type="Group"}}const rT={type:"move"};class ru{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,i),u=this._getHandJoint(c,_);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const d=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=d.position.distanceTo(f.position),p=.02,g=.005;c.inputState.pinching&&h>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(rT)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new nt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const sT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,oT=`
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

}`;class aT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new tn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new sr({vertexShader:sT,fragmentShader:oT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ne(new tr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class lT extends Ws{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,d=null,f=null,h=null,p=null,g=null;const _=new aT,m=t.getContextAttributes();let u=null,v=null;const x=[],y=[],P=new Ze;let E=null;const A=new vn;A.viewport=new st;const R=new vn;R.viewport=new st;const w=[A,R],M=new iT;let D=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let re=x[Y];return re===void 0&&(re=new ru,x[Y]=re),re.getTargetRaySpace()},this.getControllerGrip=function(Y){let re=x[Y];return re===void 0&&(re=new ru,x[Y]=re),re.getGripSpace()},this.getHand=function(Y){let re=x[Y];return re===void 0&&(re=new ru,x[Y]=re),re.getHandSpace()};function U(Y){const re=y.indexOf(Y.inputSource);if(re===-1)return;const ve=x[re];ve!==void 0&&(ve.update(Y.inputSource,Y.frame,c||o),ve.dispatchEvent({type:Y.type,data:Y.inputSource}))}function B(){r.removeEventListener("select",U),r.removeEventListener("selectstart",U),r.removeEventListener("selectend",U),r.removeEventListener("squeeze",U),r.removeEventListener("squeezestart",U),r.removeEventListener("squeezeend",U),r.removeEventListener("end",B),r.removeEventListener("inputsourceschange",X);for(let Y=0;Y<x.length;Y++){const re=y[Y];re!==null&&(y[Y]=null,x[Y].disconnect(re))}D=null,V=null,_.reset(),e.setRenderTarget(u),p=null,h=null,f=null,r=null,v=null,Ne.stop(),i.isPresenting=!1,e.setPixelRatio(E),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:p},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",U),r.addEventListener("selectstart",U),r.addEventListener("selectend",U),r.addEventListener("squeeze",U),r.addEventListener("squeezestart",U),r.addEventListener("squeezeend",U),r.addEventListener("end",B),r.addEventListener("inputsourceschange",X),m.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const re={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,re),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),v=new kr(p.framebufferWidth,p.framebufferHeight,{format:Xn,type:Ai,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let re=null,ve=null,ce=null;m.depth&&(ce=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,re=m.stencil?ks:Ts,ve=m.stencil?Os:Or);const Pe={colorFormat:t.RGBA8,depthFormat:ce,scaleFactor:s};f=new XRWebGLBinding(r,t),h=f.createProjectionLayer(Pe),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new kr(h.textureWidth,h.textureHeight,{format:Xn,type:Ai,depthTexture:new lv(h.textureWidth,h.textureHeight,ve,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ne.setContext(r),Ne.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function X(Y){for(let re=0;re<Y.removed.length;re++){const ve=Y.removed[re],ce=y.indexOf(ve);ce>=0&&(y[ce]=null,x[ce].disconnect(ve))}for(let re=0;re<Y.added.length;re++){const ve=Y.added[re];let ce=y.indexOf(ve);if(ce===-1){for(let Ie=0;Ie<x.length;Ie++)if(Ie>=y.length){y.push(ve),ce=Ie;break}else if(y[Ie]===null){y[Ie]=ve,ce=Ie;break}if(ce===-1)break}const Pe=x[ce];Pe&&Pe.connect(ve)}}const W=new L,K=new L;function N(Y,re,ve){W.setFromMatrixPosition(re.matrixWorld),K.setFromMatrixPosition(ve.matrixWorld);const ce=W.distanceTo(K),Pe=re.projectionMatrix.elements,Ie=ve.projectionMatrix.elements,Ve=Pe[14]/(Pe[10]-1),vt=Pe[14]/(Pe[10]+1),Ye=(Pe[9]+1)/Pe[5],wt=(Pe[9]-1)/Pe[5],k=(Pe[8]-1)/Pe[0],En=(Ie[8]+1)/Ie[0],He=Ve*k,We=Ve*En,Ce=ce/(-k+En),ut=Ce*-k;if(re.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ut),Y.translateZ(Ce),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Pe[10]===-1)Y.projectionMatrix.copy(re.projectionMatrix),Y.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const Re=Ve+Ce,C=vt+Ce,S=He-ut,z=We+(ce-ut),Q=Ye*vt/C*Re,te=wt*vt/C*Re;Y.projectionMatrix.makePerspective(S,z,Q,te,Re,C),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function q(Y,re){re===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(re.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let re=Y.near,ve=Y.far;_.texture!==null&&(_.depthNear>0&&(re=_.depthNear),_.depthFar>0&&(ve=_.depthFar)),M.near=R.near=A.near=re,M.far=R.far=A.far=ve,(D!==M.near||V!==M.far)&&(r.updateRenderState({depthNear:M.near,depthFar:M.far}),D=M.near,V=M.far),A.layers.mask=Y.layers.mask|2,R.layers.mask=Y.layers.mask|4,M.layers.mask=A.layers.mask|R.layers.mask;const ce=Y.parent,Pe=M.cameras;q(M,ce);for(let Ie=0;Ie<Pe.length;Ie++)q(Pe[Ie],ce);Pe.length===2?N(M,A,R):M.projectionMatrix.copy(A.projectionMatrix),Z(Y,M,ce)};function Z(Y,re,ve){ve===null?Y.matrix.copy(re.matrixWorld):(Y.matrix.copy(ve.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(re.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(re.projectionMatrix),Y.projectionMatrixInverse.copy(re.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Yo*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return M},this.getFoveation=function(){if(!(h===null&&p===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Y)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(M)};let le=null;function me(Y,re){if(d=re.getViewerPose(c||o),g=re,d!==null){const ve=d.views;p!==null&&(e.setRenderTargetFramebuffer(v,p.framebuffer),e.setRenderTarget(v));let ce=!1;ve.length!==M.cameras.length&&(M.cameras.length=0,ce=!0);for(let Ie=0;Ie<ve.length;Ie++){const Ve=ve[Ie];let vt=null;if(p!==null)vt=p.getViewport(Ve);else{const wt=f.getViewSubImage(h,Ve);vt=wt.viewport,Ie===0&&(e.setRenderTargetTextures(v,wt.colorTexture,h.ignoreDepthValues?void 0:wt.depthStencilTexture),e.setRenderTarget(v))}let Ye=w[Ie];Ye===void 0&&(Ye=new vn,Ye.layers.enable(Ie),Ye.viewport=new st,w[Ie]=Ye),Ye.matrix.fromArray(Ve.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(Ve.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(vt.x,vt.y,vt.width,vt.height),Ie===0&&(M.matrix.copy(Ye.matrix),M.matrix.decompose(M.position,M.quaternion,M.scale)),ce===!0&&M.cameras.push(Ye)}const Pe=r.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")){const Ie=f.getDepthInformation(ve[0]);Ie&&Ie.isValid&&Ie.texture&&_.init(e,Ie,r.renderState)}}for(let ve=0;ve<x.length;ve++){const ce=y[ve],Pe=x[ve];ce!==null&&Pe!==void 0&&Pe.update(ce,re,c||o)}le&&le(Y,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),g=null}const Ne=new ov;Ne.setAnimationLoop(me),this.setAnimationLoop=function(Y){le=Y},this.dispose=function(){}}}const gr=new si,cT=new ct;function uT(n,e){function t(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,iv(n)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,v,x,y){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),f(m,u)):u.isMeshPhongMaterial?(s(m,u),d(m,u)):u.isMeshStandardMaterial?(s(m,u),h(m,u),u.isMeshPhysicalMaterial&&p(m,u,y)):u.isMeshMatcapMaterial?(s(m,u),g(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),_(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(o(m,u),u.isLineDashedMaterial&&a(m,u)):u.isPointsMaterial?l(m,u,v,x):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,t(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===en&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,t(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===en&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,t(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,t(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const v=e.get(u),x=v.envMap,y=v.envMapRotation;x&&(m.envMap.value=x,gr.copy(y),gr.x*=-1,gr.y*=-1,gr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(gr.y*=-1,gr.z*=-1),m.envMapRotation.value.setFromMatrix4(cT.makeRotationFromEuler(gr)),m.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,m.aoMapTransform))}function o(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform))}function a(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,v,x){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*v,m.scale.value=x*.5,u.map&&(m.map.value=u.map,t(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function d(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function f(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function h(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,v){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===en&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=v.texture,m.transmissionSamplerSize.value.set(v.width,v.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,u){u.matcap&&(m.matcap.value=u.matcap)}function _(m,u){const v=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(v.matrixWorld),m.nearDistance.value=v.shadow.camera.near,m.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function dT(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,x){const y=x.program;i.uniformBlockBinding(v,y)}function c(v,x){let y=r[v.id];y===void 0&&(g(v),y=d(v),r[v.id]=y,v.addEventListener("dispose",m));const P=x.program;i.updateUBOMapping(v,P);const E=e.render.frame;s[v.id]!==E&&(h(v),s[v.id]=E)}function d(v){const x=f();v.__bindingPointIndex=x;const y=n.createBuffer(),P=v.__size,E=v.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,P,E),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,x,y),y}function f(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){const x=r[v.id],y=v.uniforms,P=v.__cache;n.bindBuffer(n.UNIFORM_BUFFER,x);for(let E=0,A=y.length;E<A;E++){const R=Array.isArray(y[E])?y[E]:[y[E]];for(let w=0,M=R.length;w<M;w++){const D=R[w];if(p(D,E,w,P)===!0){const V=D.__offset,U=Array.isArray(D.value)?D.value:[D.value];let B=0;for(let X=0;X<U.length;X++){const W=U[X],K=_(W);typeof W=="number"||typeof W=="boolean"?(D.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,V+B,D.__data)):W.isMatrix3?(D.__data[0]=W.elements[0],D.__data[1]=W.elements[1],D.__data[2]=W.elements[2],D.__data[3]=0,D.__data[4]=W.elements[3],D.__data[5]=W.elements[4],D.__data[6]=W.elements[5],D.__data[7]=0,D.__data[8]=W.elements[6],D.__data[9]=W.elements[7],D.__data[10]=W.elements[8],D.__data[11]=0):(W.toArray(D.__data,B),B+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,V,D.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(v,x,y,P){const E=v.value,A=x+"_"+y;if(P[A]===void 0)return typeof E=="number"||typeof E=="boolean"?P[A]=E:P[A]=E.clone(),!0;{const R=P[A];if(typeof E=="number"||typeof E=="boolean"){if(R!==E)return P[A]=E,!0}else if(R.equals(E)===!1)return R.copy(E),!0}return!1}function g(v){const x=v.uniforms;let y=0;const P=16;for(let A=0,R=x.length;A<R;A++){const w=Array.isArray(x[A])?x[A]:[x[A]];for(let M=0,D=w.length;M<D;M++){const V=w[M],U=Array.isArray(V.value)?V.value:[V.value];for(let B=0,X=U.length;B<X;B++){const W=U[B],K=_(W),N=y%P,q=N%K.boundary,Z=N+q;y+=q,Z!==0&&P-Z<K.storage&&(y+=P-Z),V.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=y,y+=K.storage}}}const E=y%P;return E>0&&(y+=P-E),v.__size=y,v.__cache={},this}function _(v){const x={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(x.boundary=4,x.storage=4):v.isVector2?(x.boundary=8,x.storage=8):v.isVector3||v.isColor?(x.boundary=16,x.storage=12):v.isVector4?(x.boundary=16,x.storage=16):v.isMatrix3?(x.boundary=48,x.storage=48):v.isMatrix4?(x.boundary=64,x.storage=64):v.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",v),x}function m(v){const x=v.target;x.removeEventListener("dispose",m);const y=o.indexOf(x.__bindingPointIndex);o.splice(y,1),n.deleteBuffer(r[x.id]),delete r[x.id],delete s[x.id]}function u(){for(const v in r)n.deleteBuffer(r[v]);o=[],r={},s={}}return{bind:l,update:c,dispose:u}}class fT{constructor(e={}){const{canvas:t=eM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const g=new Uint32Array(4),_=new Int32Array(4);let m=null,u=null;const v=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Rn,this.toneMapping=Ji,this.toneMappingExposure=1;const y=this;let P=!1,E=0,A=0,R=null,w=-1,M=null;const D=new st,V=new st;let U=null;const B=new ke(0);let X=0,W=t.width,K=t.height,N=1,q=null,Z=null;const le=new st(0,0,W,K),me=new st(0,0,W,K);let Ne=!1;const Y=new Wf;let re=!1,ve=!1;const ce=new ct,Pe=new ct,Ie=new L,Ve=new st,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function wt(){return R===null?N:1}let k=i;function En(T,F){return t.getContext(T,F)}try{const T={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ff}`),t.addEventListener("webglcontextlost",J,!1),t.addEventListener("webglcontextrestored",ge,!1),t.addEventListener("webglcontextcreationerror",he,!1),k===null){const F="webgl2";if(k=En(F,T),k===null)throw En(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let He,We,Ce,ut,Re,C,S,z,Q,te,$,Te,fe,_e,qe,se,ye,be,Le,Me,je,Be,ot,I;function de(){He=new vE(k),He.init(),Be=new nT(k,He),We=new dE(k,He,e,Be),Ce=new Jw(k,He),We.reverseDepthBuffer&&h&&Ce.buffers.depth.setReversed(!0),ut=new yE(k),Re=new kw,C=new tT(k,He,Ce,Re,We,Be,ut),S=new hE(y),z=new gE(y),Q=new RM(k),ot=new cE(k,Q),te=new xE(k,Q,ut,ot),$=new SE(k,te,Q,ut),Le=new ME(k,We,C),se=new fE(Re),Te=new Ow(y,S,z,He,We,ot,se),fe=new uT(y,Re),_e=new zw,qe=new Xw(He),be=new lE(y,S,z,Ce,$,p,l),ye=new Zw(y,$,We),I=new dT(k,ut,We,Ce),Me=new uE(k,He,ut),je=new _E(k,He,ut),ut.programs=Te.programs,y.capabilities=We,y.extensions=He,y.properties=Re,y.renderLists=_e,y.shadowMap=ye,y.state=Ce,y.info=ut}de();const j=new lT(y,k);this.xr=j,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=He.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=He.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(T){T!==void 0&&(N=T,this.setSize(W,K,!1))},this.getSize=function(T){return T.set(W,K)},this.setSize=function(T,F,G=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=T,K=F,t.width=Math.floor(T*N),t.height=Math.floor(F*N),G===!0&&(t.style.width=T+"px",t.style.height=F+"px"),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(W*N,K*N).floor()},this.setDrawingBufferSize=function(T,F,G){W=T,K=F,N=G,t.width=Math.floor(T*G),t.height=Math.floor(F*G),this.setViewport(0,0,T,F)},this.getCurrentViewport=function(T){return T.copy(D)},this.getViewport=function(T){return T.copy(le)},this.setViewport=function(T,F,G,H){T.isVector4?le.set(T.x,T.y,T.z,T.w):le.set(T,F,G,H),Ce.viewport(D.copy(le).multiplyScalar(N).round())},this.getScissor=function(T){return T.copy(me)},this.setScissor=function(T,F,G,H){T.isVector4?me.set(T.x,T.y,T.z,T.w):me.set(T,F,G,H),Ce.scissor(V.copy(me).multiplyScalar(N).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(T){Ce.setScissorTest(Ne=T)},this.setOpaqueSort=function(T){q=T},this.setTransparentSort=function(T){Z=T},this.getClearColor=function(T){return T.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor.apply(be,arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha.apply(be,arguments)},this.clear=function(T=!0,F=!0,G=!0){let H=0;if(T){let O=!1;if(R!==null){const oe=R.texture.format;O=oe===Gf||oe===Vf||oe===zf}if(O){const oe=R.texture.type,pe=oe===Ai||oe===Or||oe===Xo||oe===Os||oe===kf||oe===Bf,Se=be.getClearColor(),Ee=be.getClearAlpha(),De=Se.r,Fe=Se.g,we=Se.b;pe?(g[0]=De,g[1]=Fe,g[2]=we,g[3]=Ee,k.clearBufferuiv(k.COLOR,0,g)):(_[0]=De,_[1]=Fe,_[2]=we,_[3]=Ee,k.clearBufferiv(k.COLOR,0,_))}else H|=k.COLOR_BUFFER_BIT}F&&(H|=k.DEPTH_BUFFER_BIT),G&&(H|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",J,!1),t.removeEventListener("webglcontextrestored",ge,!1),t.removeEventListener("webglcontextcreationerror",he,!1),_e.dispose(),qe.dispose(),Re.dispose(),S.dispose(),z.dispose(),$.dispose(),ot.dispose(),I.dispose(),Te.dispose(),j.dispose(),j.removeEventListener("sessionstart",$f),j.removeEventListener("sessionend",Kf),ur.stop()};function J(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const T=ut.autoReset,F=ye.enabled,G=ye.autoUpdate,H=ye.needsUpdate,O=ye.type;de(),ut.autoReset=T,ye.enabled=F,ye.autoUpdate=G,ye.needsUpdate=H,ye.type=O}function he(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function Ue(T){const F=T.target;F.removeEventListener("dispose",Ue),St(F)}function St(T){Vt(T),Re.remove(T)}function Vt(T){const F=Re.get(T).programs;F!==void 0&&(F.forEach(function(G){Te.releaseProgram(G)}),T.isShaderMaterial&&Te.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,G,H,O,oe){F===null&&(F=vt);const pe=O.isMesh&&O.matrixWorld.determinant()<0,Se=xv(T,F,G,H,O);Ce.setMaterial(H,pe);let Ee=G.index,De=1;if(H.wireframe===!0){if(Ee=te.getWireframeAttribute(G),Ee===void 0)return;De=2}const Fe=G.drawRange,we=G.attributes.position;let Qe=Fe.start*De,at=(Fe.start+Fe.count)*De;oe!==null&&(Qe=Math.max(Qe,oe.start*De),at=Math.min(at,(oe.start+oe.count)*De)),Ee!==null?(Qe=Math.max(Qe,0),at=Math.min(at,Ee.count)):we!=null&&(Qe=Math.max(Qe,0),at=Math.min(at,we.count));const dt=at-Qe;if(dt<0||dt===1/0)return;ot.setup(O,H,Se,G,Ee);let sn,Je=Me;if(Ee!==null&&(sn=Q.get(Ee),Je=je,Je.setIndex(sn)),O.isMesh)H.wireframe===!0?(Ce.setLineWidth(H.wireframeLinewidth*wt()),Je.setMode(k.LINES)):Je.setMode(k.TRIANGLES);else if(O.isLine){let Ae=H.linewidth;Ae===void 0&&(Ae=1),Ce.setLineWidth(Ae*wt()),O.isLineSegments?Je.setMode(k.LINES):O.isLineLoop?Je.setMode(k.LINE_LOOP):Je.setMode(k.LINE_STRIP)}else O.isPoints?Je.setMode(k.POINTS):O.isSprite&&Je.setMode(k.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)Je.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(He.get("WEBGL_multi_draw"))Je.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Ae=O._multiDrawStarts,ai=O._multiDrawCounts,et=O._multiDrawCount,Fn=Ee?Q.get(Ee).bytesPerElement:1,Hr=Re.get(H).currentProgram.getUniforms();for(let fn=0;fn<et;fn++)Hr.setValue(k,"_gl_DrawID",fn),Je.render(Ae[fn]/Fn,ai[fn])}else if(O.isInstancedMesh)Je.renderInstances(Qe,dt,O.count);else if(G.isInstancedBufferGeometry){const Ae=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,ai=Math.min(G.instanceCount,Ae);Je.renderInstances(Qe,dt,ai)}else Je.render(Qe,dt)};function tt(T,F,G){T.transparent===!0&&T.side===Wn&&T.forceSinglePass===!1?(T.side=en,T.needsUpdate=!0,ra(T,F,G),T.side=rr,T.needsUpdate=!0,ra(T,F,G),T.side=Wn):ra(T,F,G)}this.compile=function(T,F,G=null){G===null&&(G=T),u=qe.get(G),u.init(F),x.push(u),G.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(u.pushLight(O),O.castShadow&&u.pushShadow(O))}),T!==G&&T.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(u.pushLight(O),O.castShadow&&u.pushShadow(O))}),u.setupLights();const H=new Set;return T.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const oe=O.material;if(oe)if(Array.isArray(oe))for(let pe=0;pe<oe.length;pe++){const Se=oe[pe];tt(Se,G,O),H.add(Se)}else tt(oe,G,O),H.add(oe)}),x.pop(),u=null,H},this.compileAsync=function(T,F,G=null){const H=this.compile(T,F,G);return new Promise(O=>{function oe(){if(H.forEach(function(pe){Re.get(pe).currentProgram.isReady()&&H.delete(pe)}),H.size===0){O(T);return}setTimeout(oe,10)}He.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let Un=null;function oi(T){Un&&Un(T)}function $f(){ur.stop()}function Kf(){ur.start()}const ur=new ov;ur.setAnimationLoop(oi),typeof self<"u"&&ur.setContext(self),this.setAnimationLoop=function(T){Un=T,j.setAnimationLoop(T),T===null?ur.stop():ur.start()},j.addEventListener("sessionstart",$f),j.addEventListener("sessionend",Kf),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(F),F=j.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,F,R),u=qe.get(T,x.length),u.init(F),x.push(u),Pe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Y.setFromProjectionMatrix(Pe),ve=this.localClippingEnabled,re=se.init(this.clippingPlanes,ve),m=_e.get(T,v.length),m.init(),v.push(m),j.enabled===!0&&j.isPresenting===!0){const oe=y.xr.getDepthSensingMesh();oe!==null&&rc(oe,F,-1/0,y.sortObjects)}rc(T,F,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(q,Z),Ye=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,Ye&&be.addToRenderList(m,T),this.info.render.frame++,re===!0&&se.beginShadows();const G=u.state.shadowsArray;ye.render(G,T,F),re===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();const H=m.opaque,O=m.transmissive;if(u.setupLights(),F.isArrayCamera){const oe=F.cameras;if(O.length>0)for(let pe=0,Se=oe.length;pe<Se;pe++){const Ee=oe[pe];Qf(H,O,T,Ee)}Ye&&be.render(T);for(let pe=0,Se=oe.length;pe<Se;pe++){const Ee=oe[pe];Zf(m,T,Ee,Ee.viewport)}}else O.length>0&&Qf(H,O,T,F),Ye&&be.render(T),Zf(m,T,F);R!==null&&(C.updateMultisampleRenderTarget(R),C.updateRenderTargetMipmap(R)),T.isScene===!0&&T.onAfterRender(y,T,F),ot.resetDefaultState(),w=-1,M=null,x.pop(),x.length>0?(u=x[x.length-1],re===!0&&se.setGlobalState(y.clippingPlanes,u.state.camera)):u=null,v.pop(),v.length>0?m=v[v.length-1]:m=null};function rc(T,F,G,H){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLight)u.pushLight(T),T.castShadow&&u.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Y.intersectsSprite(T)){H&&Ve.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Pe);const pe=$.update(T),Se=T.material;Se.visible&&m.push(T,pe,Se,G,Ve.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Y.intersectsObject(T))){const pe=$.update(T),Se=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ve.copy(T.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ve.copy(pe.boundingSphere.center)),Ve.applyMatrix4(T.matrixWorld).applyMatrix4(Pe)),Array.isArray(Se)){const Ee=pe.groups;for(let De=0,Fe=Ee.length;De<Fe;De++){const we=Ee[De],Qe=Se[we.materialIndex];Qe&&Qe.visible&&m.push(T,pe,Qe,G,Ve.z,we)}}else Se.visible&&m.push(T,pe,Se,G,Ve.z,null)}}const oe=T.children;for(let pe=0,Se=oe.length;pe<Se;pe++)rc(oe[pe],F,G,H)}function Zf(T,F,G,H){const O=T.opaque,oe=T.transmissive,pe=T.transparent;u.setupLightsView(G),re===!0&&se.setGlobalState(y.clippingPlanes,G),H&&Ce.viewport(D.copy(H)),O.length>0&&ia(O,F,G),oe.length>0&&ia(oe,F,G),pe.length>0&&ia(pe,F,G),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function Qf(T,F,G,H){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[H.id]===void 0&&(u.state.transmissionRenderTarget[H.id]=new kr(1,1,{generateMipmaps:!0,type:He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float")?ea:Ai,minFilter:Rr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$e.workingColorSpace}));const oe=u.state.transmissionRenderTarget[H.id],pe=H.viewport||D;oe.setSize(pe.z,pe.w);const Se=y.getRenderTarget();y.setRenderTarget(oe),y.getClearColor(B),X=y.getClearAlpha(),X<1&&y.setClearColor(16777215,.5),y.clear(),Ye&&be.render(G);const Ee=y.toneMapping;y.toneMapping=Ji;const De=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),u.setupLightsView(H),re===!0&&se.setGlobalState(y.clippingPlanes,H),ia(T,G,H),C.updateMultisampleRenderTarget(oe),C.updateRenderTargetMipmap(oe),He.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let we=0,Qe=F.length;we<Qe;we++){const at=F[we],dt=at.object,sn=at.geometry,Je=at.material,Ae=at.group;if(Je.side===Wn&&dt.layers.test(H.layers)){const ai=Je.side;Je.side=en,Je.needsUpdate=!0,Jf(dt,G,H,sn,Je,Ae),Je.side=ai,Je.needsUpdate=!0,Fe=!0}}Fe===!0&&(C.updateMultisampleRenderTarget(oe),C.updateRenderTargetMipmap(oe))}y.setRenderTarget(Se),y.setClearColor(B,X),De!==void 0&&(H.viewport=De),y.toneMapping=Ee}function ia(T,F,G){const H=F.isScene===!0?F.overrideMaterial:null;for(let O=0,oe=T.length;O<oe;O++){const pe=T[O],Se=pe.object,Ee=pe.geometry,De=H===null?pe.material:H,Fe=pe.group;Se.layers.test(G.layers)&&Jf(Se,F,G,Ee,De,Fe)}}function Jf(T,F,G,H,O,oe){T.onBeforeRender(y,F,G,H,O,oe),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),O.onBeforeRender(y,F,G,H,T,oe),O.transparent===!0&&O.side===Wn&&O.forceSinglePass===!1?(O.side=en,O.needsUpdate=!0,y.renderBufferDirect(G,F,H,O,T,oe),O.side=rr,O.needsUpdate=!0,y.renderBufferDirect(G,F,H,O,T,oe),O.side=Wn):y.renderBufferDirect(G,F,H,O,T,oe),T.onAfterRender(y,F,G,H,O,oe)}function ra(T,F,G){F.isScene!==!0&&(F=vt);const H=Re.get(T),O=u.state.lights,oe=u.state.shadowsArray,pe=O.state.version,Se=Te.getParameters(T,O.state,oe,F,G),Ee=Te.getProgramCacheKey(Se);let De=H.programs;H.environment=T.isMeshStandardMaterial?F.environment:null,H.fog=F.fog,H.envMap=(T.isMeshStandardMaterial?z:S).get(T.envMap||H.environment),H.envMapRotation=H.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,De===void 0&&(T.addEventListener("dispose",Ue),De=new Map,H.programs=De);let Fe=De.get(Ee);if(Fe!==void 0){if(H.currentProgram===Fe&&H.lightsStateVersion===pe)return th(T,Se),Fe}else Se.uniforms=Te.getUniforms(T),T.onBeforeCompile(Se,y),Fe=Te.acquireProgram(Se,Ee),De.set(Ee,Fe),H.uniforms=Se.uniforms;const we=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(we.clippingPlanes=se.uniform),th(T,Se),H.needsLights=yv(T),H.lightsStateVersion=pe,H.needsLights&&(we.ambientLightColor.value=O.state.ambient,we.lightProbe.value=O.state.probe,we.directionalLights.value=O.state.directional,we.directionalLightShadows.value=O.state.directionalShadow,we.spotLights.value=O.state.spot,we.spotLightShadows.value=O.state.spotShadow,we.rectAreaLights.value=O.state.rectArea,we.ltc_1.value=O.state.rectAreaLTC1,we.ltc_2.value=O.state.rectAreaLTC2,we.pointLights.value=O.state.point,we.pointLightShadows.value=O.state.pointShadow,we.hemisphereLights.value=O.state.hemi,we.directionalShadowMap.value=O.state.directionalShadowMap,we.directionalShadowMatrix.value=O.state.directionalShadowMatrix,we.spotShadowMap.value=O.state.spotShadowMap,we.spotLightMatrix.value=O.state.spotLightMatrix,we.spotLightMap.value=O.state.spotLightMap,we.pointShadowMap.value=O.state.pointShadowMap,we.pointShadowMatrix.value=O.state.pointShadowMatrix),H.currentProgram=Fe,H.uniformsList=null,Fe}function eh(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=ul.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function th(T,F){const G=Re.get(T);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function xv(T,F,G,H,O){F.isScene!==!0&&(F=vt),C.resetTextureUnits();const oe=F.fog,pe=H.isMeshStandardMaterial?F.environment:null,Se=R===null?y.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:Hs,Ee=(H.isMeshStandardMaterial?z:S).get(H.envMap||pe),De=H.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Fe=!!G.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),we=!!G.morphAttributes.position,Qe=!!G.morphAttributes.normal,at=!!G.morphAttributes.color;let dt=Ji;H.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(dt=y.toneMapping);const sn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Je=sn!==void 0?sn.length:0,Ae=Re.get(H),ai=u.state.lights;if(re===!0&&(ve===!0||T!==M)){const wn=T===M&&H.id===w;se.setState(H,T,wn)}let et=!1;H.version===Ae.__version?(Ae.needsLights&&Ae.lightsStateVersion!==ai.state.version||Ae.outputColorSpace!==Se||O.isBatchedMesh&&Ae.batching===!1||!O.isBatchedMesh&&Ae.batching===!0||O.isBatchedMesh&&Ae.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ae.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ae.instancing===!1||!O.isInstancedMesh&&Ae.instancing===!0||O.isSkinnedMesh&&Ae.skinning===!1||!O.isSkinnedMesh&&Ae.skinning===!0||O.isInstancedMesh&&Ae.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ae.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ae.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ae.instancingMorph===!1&&O.morphTexture!==null||Ae.envMap!==Ee||H.fog===!0&&Ae.fog!==oe||Ae.numClippingPlanes!==void 0&&(Ae.numClippingPlanes!==se.numPlanes||Ae.numIntersection!==se.numIntersection)||Ae.vertexAlphas!==De||Ae.vertexTangents!==Fe||Ae.morphTargets!==we||Ae.morphNormals!==Qe||Ae.morphColors!==at||Ae.toneMapping!==dt||Ae.morphTargetsCount!==Je)&&(et=!0):(et=!0,Ae.__version=H.version);let Fn=Ae.currentProgram;et===!0&&(Fn=ra(H,F,O));let Hr=!1,fn=!1,$s=!1;const ft=Fn.getUniforms(),Zn=Ae.uniforms;if(Ce.useProgram(Fn.program)&&(Hr=!0,fn=!0,$s=!0),H.id!==w&&(w=H.id,fn=!0),Hr||M!==T){Ce.buffers.depth.getReversed()?(ce.copy(T.projectionMatrix),nM(ce),iM(ce),ft.setValue(k,"projectionMatrix",ce)):ft.setValue(k,"projectionMatrix",T.projectionMatrix),ft.setValue(k,"viewMatrix",T.matrixWorldInverse);const Ci=ft.map.cameraPosition;Ci!==void 0&&Ci.setValue(k,Ie.setFromMatrixPosition(T.matrixWorld)),We.logarithmicDepthBuffer&&ft.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ft.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),M!==T&&(M=T,fn=!0,$s=!0)}if(O.isSkinnedMesh){ft.setOptional(k,O,"bindMatrix"),ft.setOptional(k,O,"bindMatrixInverse");const wn=O.skeleton;wn&&(wn.boneTexture===null&&wn.computeBoneTexture(),ft.setValue(k,"boneTexture",wn.boneTexture,C))}O.isBatchedMesh&&(ft.setOptional(k,O,"batchingTexture"),ft.setValue(k,"batchingTexture",O._matricesTexture,C),ft.setOptional(k,O,"batchingIdTexture"),ft.setValue(k,"batchingIdTexture",O._indirectTexture,C),ft.setOptional(k,O,"batchingColorTexture"),O._colorsTexture!==null&&ft.setValue(k,"batchingColorTexture",O._colorsTexture,C));const Ks=G.morphAttributes;if((Ks.position!==void 0||Ks.normal!==void 0||Ks.color!==void 0)&&Le.update(O,G,Fn),(fn||Ae.receiveShadow!==O.receiveShadow)&&(Ae.receiveShadow=O.receiveShadow,ft.setValue(k,"receiveShadow",O.receiveShadow)),H.isMeshGouraudMaterial&&H.envMap!==null&&(Zn.envMap.value=Ee,Zn.flipEnvMap.value=Ee.isCubeTexture&&Ee.isRenderTargetTexture===!1?-1:1),H.isMeshStandardMaterial&&H.envMap===null&&F.environment!==null&&(Zn.envMapIntensity.value=F.environmentIntensity),fn&&(ft.setValue(k,"toneMappingExposure",y.toneMappingExposure),Ae.needsLights&&_v(Zn,$s),oe&&H.fog===!0&&fe.refreshFogUniforms(Zn,oe),fe.refreshMaterialUniforms(Zn,H,N,K,u.state.transmissionRenderTarget[T.id]),ul.upload(k,eh(Ae),Zn,C)),H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&(ul.upload(k,eh(Ae),Zn,C),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ft.setValue(k,"center",O.center),ft.setValue(k,"modelViewMatrix",O.modelViewMatrix),ft.setValue(k,"normalMatrix",O.normalMatrix),ft.setValue(k,"modelMatrix",O.matrixWorld),H.isShaderMaterial||H.isRawShaderMaterial){const wn=H.uniformsGroups;for(let Ci=0,bi=wn.length;Ci<bi;Ci++){const nh=wn[Ci];I.update(nh,Fn),I.bind(nh,Fn)}}return Fn}function _v(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function yv(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return E},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(T,F,G){Re.get(T.texture).__webglTexture=F,Re.get(T.depthTexture).__webglTexture=G;const H=Re.get(T);H.__hasExternalTextures=!0,H.__autoAllocateDepthBuffer=G===void 0,H.__autoAllocateDepthBuffer||He.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),H.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,F){const G=Re.get(T);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,G=0){R=T,E=F,A=G;let H=!0,O=null,oe=!1,pe=!1;if(T){const Ee=Re.get(T);if(Ee.__useDefaultFramebuffer!==void 0)Ce.bindFramebuffer(k.FRAMEBUFFER,null),H=!1;else if(Ee.__webglFramebuffer===void 0)C.setupRenderTarget(T);else if(Ee.__hasExternalTextures)C.rebindTextures(T,Re.get(T.texture).__webglTexture,Re.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const we=T.depthTexture;if(Ee.__boundDepthTexture!==we){if(we!==null&&Re.has(we)&&(T.width!==we.image.width||T.height!==we.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(T)}}const De=T.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(pe=!0);const Fe=Re.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Fe[F])?O=Fe[F][G]:O=Fe[F],oe=!0):T.samples>0&&C.useMultisampledRTT(T)===!1?O=Re.get(T).__webglMultisampledFramebuffer:Array.isArray(Fe)?O=Fe[G]:O=Fe,D.copy(T.viewport),V.copy(T.scissor),U=T.scissorTest}else D.copy(le).multiplyScalar(N).floor(),V.copy(me).multiplyScalar(N).floor(),U=Ne;if(Ce.bindFramebuffer(k.FRAMEBUFFER,O)&&H&&Ce.drawBuffers(T,O),Ce.viewport(D),Ce.scissor(V),Ce.setScissorTest(U),oe){const Ee=Re.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ee.__webglTexture,G)}else if(pe){const Ee=Re.get(T.texture),De=F||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ee.__webglTexture,G||0,De)}w=-1},this.readRenderTargetPixels=function(T,F,G,H,O,oe,pe){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Re.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&pe!==void 0&&(Se=Se[pe]),Se){Ce.bindFramebuffer(k.FRAMEBUFFER,Se);try{const Ee=T.texture,De=Ee.format,Fe=Ee.type;if(!We.textureFormatReadable(De)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!We.textureTypeReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-H&&G>=0&&G<=T.height-O&&k.readPixels(F,G,H,O,Be.convert(De),Be.convert(Fe),oe)}finally{const Ee=R!==null?Re.get(R).__webglFramebuffer:null;Ce.bindFramebuffer(k.FRAMEBUFFER,Ee)}}},this.readRenderTargetPixelsAsync=async function(T,F,G,H,O,oe,pe){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Re.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&pe!==void 0&&(Se=Se[pe]),Se){const Ee=T.texture,De=Ee.format,Fe=Ee.type;if(!We.textureFormatReadable(De))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!We.textureTypeReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=T.width-H&&G>=0&&G<=T.height-O){Ce.bindFramebuffer(k.FRAMEBUFFER,Se);const we=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,we),k.bufferData(k.PIXEL_PACK_BUFFER,oe.byteLength,k.STREAM_READ),k.readPixels(F,G,H,O,Be.convert(De),Be.convert(Fe),0);const Qe=R!==null?Re.get(R).__webglFramebuffer:null;Ce.bindFramebuffer(k.FRAMEBUFFER,Qe);const at=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await tM(k,at,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,we),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,oe),k.deleteBuffer(we),k.deleteSync(at),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,F=null,G=0){T.isTexture!==!0&&(go("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,T=arguments[1]);const H=Math.pow(2,-G),O=Math.floor(T.image.width*H),oe=Math.floor(T.image.height*H),pe=F!==null?F.x:0,Se=F!==null?F.y:0;C.setTexture2D(T,0),k.copyTexSubImage2D(k.TEXTURE_2D,G,0,0,pe,Se,O,oe),Ce.unbindTexture()},this.copyTextureToTexture=function(T,F,G=null,H=null,O=0){T.isTexture!==!0&&(go("WebGLRenderer: copyTextureToTexture function signature has changed."),H=arguments[0]||null,T=arguments[1],F=arguments[2],O=arguments[3]||0,G=null);let oe,pe,Se,Ee,De,Fe,we,Qe,at;const dt=T.isCompressedTexture?T.mipmaps[O]:T.image;G!==null?(oe=G.max.x-G.min.x,pe=G.max.y-G.min.y,Se=G.isBox3?G.max.z-G.min.z:1,Ee=G.min.x,De=G.min.y,Fe=G.isBox3?G.min.z:0):(oe=dt.width,pe=dt.height,Se=dt.depth||1,Ee=0,De=0,Fe=0),H!==null?(we=H.x,Qe=H.y,at=H.z):(we=0,Qe=0,at=0);const sn=Be.convert(F.format),Je=Be.convert(F.type);let Ae;F.isData3DTexture?(C.setTexture3D(F,0),Ae=k.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(C.setTexture2DArray(F,0),Ae=k.TEXTURE_2D_ARRAY):(C.setTexture2D(F,0),Ae=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,F.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,F.unpackAlignment);const ai=k.getParameter(k.UNPACK_ROW_LENGTH),et=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Fn=k.getParameter(k.UNPACK_SKIP_PIXELS),Hr=k.getParameter(k.UNPACK_SKIP_ROWS),fn=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,dt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,dt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Ee),k.pixelStorei(k.UNPACK_SKIP_ROWS,De),k.pixelStorei(k.UNPACK_SKIP_IMAGES,Fe);const $s=T.isDataArrayTexture||T.isData3DTexture,ft=F.isDataArrayTexture||F.isData3DTexture;if(T.isRenderTargetTexture||T.isDepthTexture){const Zn=Re.get(T),Ks=Re.get(F),wn=Re.get(Zn.__renderTarget),Ci=Re.get(Ks.__renderTarget);Ce.bindFramebuffer(k.READ_FRAMEBUFFER,wn.__webglFramebuffer),Ce.bindFramebuffer(k.DRAW_FRAMEBUFFER,Ci.__webglFramebuffer);for(let bi=0;bi<Se;bi++)$s&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Re.get(T).__webglTexture,O,Fe+bi),T.isDepthTexture?(ft&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Re.get(F).__webglTexture,O,at+bi),k.blitFramebuffer(Ee,De,oe,pe,we,Qe,oe,pe,k.DEPTH_BUFFER_BIT,k.NEAREST)):ft?k.copyTexSubImage3D(Ae,O,we,Qe,at+bi,Ee,De,oe,pe):k.copyTexSubImage2D(Ae,O,we,Qe,at+bi,Ee,De,oe,pe);Ce.bindFramebuffer(k.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ft?T.isDataTexture||T.isData3DTexture?k.texSubImage3D(Ae,O,we,Qe,at,oe,pe,Se,sn,Je,dt.data):F.isCompressedArrayTexture?k.compressedTexSubImage3D(Ae,O,we,Qe,at,oe,pe,Se,sn,dt.data):k.texSubImage3D(Ae,O,we,Qe,at,oe,pe,Se,sn,Je,dt):T.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,O,we,Qe,oe,pe,sn,Je,dt.data):T.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,O,we,Qe,dt.width,dt.height,sn,dt.data):k.texSubImage2D(k.TEXTURE_2D,O,we,Qe,oe,pe,sn,Je,dt);k.pixelStorei(k.UNPACK_ROW_LENGTH,ai),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,et),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Fn),k.pixelStorei(k.UNPACK_SKIP_ROWS,Hr),k.pixelStorei(k.UNPACK_SKIP_IMAGES,fn),O===0&&F.generateMipmaps&&k.generateMipmap(Ae),Ce.unbindTexture()},this.copyTextureToTexture3D=function(T,F,G=null,H=null,O=0){return T.isTexture!==!0&&(go("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,H=arguments[1]||null,T=arguments[2],F=arguments[3],O=arguments[4]||0),go('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(T,F,G,H,O)},this.initRenderTarget=function(T){Re.get(T).__webglFramebuffer===void 0&&C.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?C.setTextureCube(T,0):T.isData3DTexture?C.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?C.setTexture2DArray(T,0):C.setTexture2D(T,0),Ce.unbindTexture()},this.resetState=function(){E=0,A=0,R=null,Ce.reset(),ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _i}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=$e._getDrawingBufferColorSpace(e),t.unpackColorSpace=$e._getUnpackColorSpace()}}class Xf{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new ke(e),this.density=t}clone(){return new Xf(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class hT extends Ft{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class hv extends Gr{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new ke(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ol=new L,kl=new L,dm=new ct,co=new Br,Ha=new na,su=new L,fm=new L;class pT extends Ft{constructor(e=new dn,t=new hv){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Ol.fromBufferAttribute(t,r-1),kl.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Ol.distanceTo(kl);e.setAttribute("lineDistance",new Bt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ha.copy(i.boundingSphere),Ha.applyMatrix4(r),Ha.radius+=s,e.ray.intersectsSphere(Ha)===!1)return;dm.copy(r).invert(),co.copy(e.ray).applyMatrix4(dm);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const u=d.getX(_),v=d.getX(_+1),x=Wa(this,e,co,l,u,v);x&&t.push(x)}if(this.isLineLoop){const _=d.getX(g-1),m=d.getX(p),u=Wa(this,e,co,l,_,m);u&&t.push(u)}}else{const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const u=Wa(this,e,co,l,_,_+1);u&&t.push(u)}if(this.isLineLoop){const _=Wa(this,e,co,l,g-1,p);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Wa(n,e,t,i,r,s){const o=n.geometry.attributes.position;if(Ol.fromBufferAttribute(o,r),kl.fromBufferAttribute(o,s),t.distanceSqToSegment(Ol,kl,su,fm)>i)return;su.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(su);if(!(l<e.near||l>e.far))return{distance:l,point:fm.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}class pv extends Gr{static get type(){return"PointsMaterial"}constructor(e){super(),this.isPointsMaterial=!0,this.color=new ke(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const hm=new ct,zd=new Br,ja=new na,Xa=new L;class mT extends Ft{constructor(e=new dn,t=new pv){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ja.copy(i.boundingSphere),ja.applyMatrix4(r),ja.radius+=s,e.ray.intersectsSphere(ja)===!1)return;hm.copy(r).invert(),zd.copy(e.ray).applyMatrix4(hm);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,f=i.attributes.position;if(c!==null){const h=Math.max(0,o.start),p=Math.min(c.count,o.start+o.count);for(let g=h,_=p;g<_;g++){const m=c.getX(g);Xa.fromBufferAttribute(f,m),pm(Xa,m,l,r,e,t,this)}}else{const h=Math.max(0,o.start),p=Math.min(f.count,o.start+o.count);for(let g=h,_=p;g<_;g++)Xa.fromBufferAttribute(f,g),pm(Xa,g,l,r,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function pm(n,e,t,i,r,s,o){const a=zd.distanceSqToPoint(n);if(a<t){const l=new L;zd.closestPointToPoint(n,l),l.applyMatrix4(i);const c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}class cr extends tn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class mn extends dn{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const d=[],f=[],h=[],p=[];let g=0;const _=[],m=i/2;let u=0;v(),o===!1&&(e>0&&x(!0),t>0&&x(!1)),this.setIndex(d),this.setAttribute("position",new Bt(f,3)),this.setAttribute("normal",new Bt(h,3)),this.setAttribute("uv",new Bt(p,2));function v(){const y=new L,P=new L;let E=0;const A=(t-e)/i;for(let R=0;R<=s;R++){const w=[],M=R/s,D=M*(t-e)+e;for(let V=0;V<=r;V++){const U=V/r,B=U*l+a,X=Math.sin(B),W=Math.cos(B);P.x=D*X,P.y=-M*i+m,P.z=D*W,f.push(P.x,P.y,P.z),y.set(X,A,W).normalize(),h.push(y.x,y.y,y.z),p.push(U,1-M),w.push(g++)}_.push(w)}for(let R=0;R<r;R++)for(let w=0;w<s;w++){const M=_[w][R],D=_[w+1][R],V=_[w+1][R+1],U=_[w][R+1];(e>0||w!==0)&&(d.push(M,D,U),E+=3),(t>0||w!==s-1)&&(d.push(D,V,U),E+=3)}c.addGroup(u,E,0),u+=E}function x(y){const P=g,E=new Ze,A=new L;let R=0;const w=y===!0?e:t,M=y===!0?1:-1;for(let V=1;V<=r;V++)f.push(0,m*M,0),h.push(0,M,0),p.push(.5,.5),g++;const D=g;for(let V=0;V<=r;V++){const B=V/r*l+a,X=Math.cos(B),W=Math.sin(B);A.x=w*W,A.y=m*M,A.z=w*X,f.push(A.x,A.y,A.z),h.push(0,M,0),E.x=X*.5+.5,E.y=W*.5*M+.5,p.push(E.x,E.y),g++}for(let V=0;V<r;V++){const U=P+V,B=D+V;y===!0?d.push(B,B+1,U):d.push(B+1,B,U),R+=3}c.addGroup(u,R,y===!0?1:2),u+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Yf extends dn{constructor(e=.5,t=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const a=[],l=[],c=[],d=[];let f=e;const h=(t-e)/r,p=new L,g=new Ze;for(let _=0;_<=r;_++){for(let m=0;m<=i;m++){const u=s+m/i*o;p.x=f*Math.cos(u),p.y=f*Math.sin(u),l.push(p.x,p.y,p.z),c.push(0,0,1),g.x=(p.x/t+1)/2,g.y=(p.y/t+1)/2,d.push(g.x,g.y)}f+=h}for(let _=0;_<r;_++){const m=_*(i+1);for(let u=0;u<i;u++){const v=u+m,x=v,y=v+i+1,P=v+i+2,E=v+1;a.push(x,y,E),a.push(y,P,E)}}this.setIndex(a),this.setAttribute("position",new Bt(l,3)),this.setAttribute("normal",new Bt(c,3)),this.setAttribute("uv",new Bt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yf(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class qo extends dn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const d=[],f=new L,h=new L,p=[],g=[],_=[],m=[];for(let u=0;u<=i;u++){const v=[],x=u/i;let y=0;u===0&&o===0?y=.5/t:u===i&&l===Math.PI&&(y=-.5/t);for(let P=0;P<=t;P++){const E=P/t;f.x=-e*Math.cos(r+E*s)*Math.sin(o+x*a),f.y=e*Math.cos(o+x*a),f.z=e*Math.sin(r+E*s)*Math.sin(o+x*a),g.push(f.x,f.y,f.z),h.copy(f).normalize(),_.push(h.x,h.y,h.z),m.push(E+y,1-x),v.push(c++)}d.push(v)}for(let u=0;u<i;u++)for(let v=0;v<t;v++){const x=d[u][v+1],y=d[u][v],P=d[u+1][v],E=d[u+1][v+1];(u!==0||o>0)&&p.push(x,y,E),(u!==i-1||l<Math.PI)&&p.push(y,P,E)}this.setIndex(p),this.setAttribute("position",new Bt(g,3)),this.setAttribute("normal",new Bt(_,3)),this.setAttribute("uv",new Bt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Xe extends Gr{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ke(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ke(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=qg,this.normalScale=new Ze(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class qf extends Ft{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ke(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}const ou=new ct,mm=new L,gm=new L;class mv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ze(512,512),this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Wf,this._frameExtents=new Ze(1,1),this._viewportCount=1,this._viewports=[new st(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;mm.setFromMatrixPosition(e.matrixWorld),t.position.copy(mm),gm.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(gm),t.updateMatrixWorld(),ou.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ou),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(ou)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const vm=new ct,uo=new L,au=new L;class gT extends mv{constructor(){super(new vn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ze(4,2),this._viewportCount=6,this._viewports=[new st(2,1,1,1),new st(0,1,1,1),new st(3,1,1,1),new st(1,1,1,1),new st(3,0,1,1),new st(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),uo.setFromMatrixPosition(e.matrixWorld),i.position.copy(uo),au.copy(i.position),au.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(au),i.updateMatrixWorld(),r.makeTranslation(-uo.x,-uo.y,-uo.z),vm.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(vm)}}class gv extends qf{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new gT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class vT extends mv{constructor(){super(new av(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class xT extends qf{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ft.DEFAULT_UP),this.updateMatrix(),this.target=new Ft,this.shadow=new vT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class _T extends qf{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class yT{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=xm(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=xm();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function xm(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ff}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ff);const gt=new Map;function qs(n,e,t,i=.08){const r=n.getImageData(0,0,e,t),s=r.data;for(let o=0;o<s.length;o+=4){const a=(Math.random()-.5)*255*i;s[o]=Math.min(255,Math.max(0,s[o]+a)),s[o+1]=Math.min(255,Math.max(0,s[o+1]+a)),s[o+2]=Math.min(255,Math.max(0,s[o+2]+a))}n.putImageData(r,0,0)}function MT(){const n="sandstone_wall";if(gt.has(n))return gt.get(n);const e=document.createElement("canvas");e.width=512,e.height=512;const t=e.getContext("2d");t.fillStyle="#cfb58c",t.fillRect(0,0,512,512),t.strokeStyle="#9a815a",t.lineWidth=4;const i=64,r=128;for(let a=0;a<512;a+=i){const l=a/i%2===0?0:r/2;t.beginPath(),t.moveTo(0,a),t.lineTo(512,a),t.stroke();for(let c=-l;c<512;c+=r){t.beginPath(),t.moveTo(c,a),t.lineTo(c,a+i),t.stroke();const d=(Math.random()-.5)*20;t.fillStyle=`rgba(${190+d}, ${165+d}, ${125+d}, 0.25)`,t.fillRect(c+2,a+2,r-4,i-4)}}const s=t.createLinearGradient(0,400,0,512);s.addColorStop(0,"rgba(100, 80, 50, 0)"),s.addColorStop(1,"rgba(90, 70, 45, 0.4)"),t.fillStyle=s,t.fillRect(0,400,512,112),qs(t,512,512,.12);const o=new cr(e);return o.wrapS=Fr,o.wrapT=Fr,gt.set(n,o),o}function ST(){const n="ground_sand";if(gt.has(n))return gt.get(n);const e=document.createElement("canvas");e.width=512,e.height=512;const t=e.getContext("2d");t.fillStyle="#bfa275",t.fillRect(0,0,512,512),t.strokeStyle="#8c724b",t.lineWidth=3;for(let r=0;r<40;r++){const s=Math.random()*512,o=Math.random()*512,a=30+Math.random()*50;t.beginPath(),t.arc(s,o,a,0,Math.PI*2),t.stroke(),t.fillStyle="rgba(170, 140, 100, 0.15)",t.fill()}qs(t,512,512,.18);const i=new cr(e);return i.wrapS=Fr,i.wrapT=Fr,gt.set(n,i),i}function ET(n){const e=`wood_crate_${n||"std"}`;if(gt.has(e))return gt.get(e);const t=document.createElement("canvas");t.width=256,t.height=256;const i=t.getContext("2d");i.fillStyle="#9e6d3c",i.fillRect(0,0,256,256),i.fillStyle="#825529",i.lineWidth=4;for(let s=0;s<256;s+=42){i.beginPath(),i.moveTo(0,s),i.lineTo(256,s),i.strokeStyle="#4e3318",i.stroke();for(let o=0;o<256;o+=16)i.fillStyle="rgba(60, 35, 15, 0.12)",i.fillRect(o,s+2,8+Math.random()*6,38)}i.fillStyle="#5c4838",i.fillRect(0,0,256,18),i.fillRect(0,238,256,18),i.fillRect(0,0,18,256),i.fillRect(238,0,18,256),i.lineWidth=14,i.strokeStyle="#5c4838",i.beginPath(),i.moveTo(10,10),i.lineTo(246,246),i.stroke(),i.fillStyle="#222",[[12,12],[244,12],[12,244],[244,244],[128,128]].forEach(([s,o])=>{i.beginPath(),i.arc(s,o,5,0,Math.PI*2),i.fill(),i.fillStyle="#999",i.beginPath(),i.arc(s-1,o-1,2,0,Math.PI*2),i.fill(),i.fillStyle="#222"}),n?(i.save(),i.font="bold 84px Arial, sans-serif",i.fillStyle="rgba(235, 60, 40, 0.85)",i.textAlign="center",i.textBaseline="middle",i.fillText(n,128,128),i.restore()):(i.save(),i.font="bold 22px Arial, sans-serif",i.fillStyle="rgba(30, 25, 20, 0.7)",i.textAlign="center",i.fillText("FRAGILE",128,75),i.fillText("MILITARY",128,185),i.restore()),qs(i,256,256,.1);const r=new cr(t);return gt.set(e,r),r}function _m(n="mid_door"){const e=`metal_door_${n}`;if(gt.has(e))return gt.get(e);const t=document.createElement("canvas");t.width=512,t.height=512;const i=t.getContext("2d");i.fillStyle=n==="mid_door"?"#465646":"#2b5066",i.fillRect(0,0,512,512),i.strokeStyle="#222b22",i.lineWidth=6,i.strokeRect(20,20,472,472),i.fillStyle=n==="mid_door"?"#3b4b3b":"#234356",i.fillRect(35,35,442,210),i.fillRect(35,265,442,210);const r=30;for(let o=-50;o<550;o+=r*2)i.fillStyle="#e6b800",i.beginPath(),i.moveTo(o,475),i.lineTo(o+r,475),i.lineTo(o+r+35,512),i.lineTo(o+35,512),i.fill();i.fillStyle="#1a221a";for(let o=30;o<=480;o+=45)i.beginPath(),i.arc(28,o,4,0,Math.PI*2),i.arc(484,o,4,0,Math.PI*2),i.fill();i.save(),i.font="bold 36px monospace",i.fillStyle="rgba(255, 255, 255, 0.4)",i.textAlign="center",i.fillText("DO NOT BLOCK",256,140),i.font="bold 24px monospace",i.fillText("WARNING: MILITARY ZONE",256,370),i.restore(),qs(i,512,512,.15);const s=new cr(t);return gt.set(e,s),s}function ym(n){const e=`site_sign_${n}`;if(gt.has(e))return gt.get(e);const t=document.createElement("canvas");t.width=256,t.height=256;const i=t.getContext("2d");i.fillStyle="transparent",i.clearRect(0,0,256,256),i.save(),i.font="bold 120px Impact, Arial, sans-serif",i.fillStyle="#d8382c",i.strokeStyle="#111",i.lineWidth=8,i.textAlign="center",i.textBaseline="middle",i.strokeText(n,128,110),i.fillText(n,128,110),i.font="bold 36px Impact, Arial, sans-serif",i.strokeText(`BOMBSITE ${n}`,128,200),i.fillText(`BOMBSITE ${n}`,128,200),i.restore();const r=new cr(t);return gt.set(e,r),r}function wT(){const n="c4_keypad";if(gt.has(n))return gt.get(n);const e=document.createElement("canvas");e.width=256,e.height=256;const t=e.getContext("2d");t.fillStyle="#bc9363",t.fillRect(0,0,256,256),t.fillStyle="#1c1c1c",t.fillRect(0,25,256,40),t.fillRect(0,190,256,40),t.fillStyle="#2d2d2d",t.fillRect(35,75,186,105),t.fillStyle="#0f1f0f",t.fillRect(50,85,156,35),t.font="bold 22px monospace",t.fillStyle="#22ee33",t.textAlign="center",t.fillText("7355608",128,110),t.fillStyle="#888";for(let r=0;r<2;r++)for(let s=0;s<6;s++)t.fillRect(55+s*25,128+r*22,18,16);t.fillStyle="#cc0000",t.beginPath(),t.arc(200,92,5,0,Math.PI*2),t.fill();const i=new cr(e);return gt.set(n,i),i}function vv(){const n="ak47_wood";if(gt.has(n))return gt.get(n);const e=document.createElement("canvas");e.width=128,e.height=128;const t=e.getContext("2d");t.fillStyle="#6e2b0e",t.fillRect(0,0,128,128),t.strokeStyle="#421705",t.lineWidth=2;for(let r=0;r<128;r+=8)t.beginPath(),t.moveTo(0,r),t.bezierCurveTo(40,r+4,80,r-4,128,r),t.stroke();qs(t,128,128,.06);const i=new cr(e);return gt.set(n,i),i}function TT(n){const e=`uniform_${n}`;if(gt.has(e))return gt.get(e);const t=document.createElement("canvas");t.width=128,t.height=128;const i=t.getContext("2d");if(n==="CT"){i.fillStyle="#223244",i.fillRect(0,0,128,128);const s=["#1a2636","#2d4056","#141d28"];for(let o=0;o<30;o++){i.fillStyle=s[o%s.length];const a=Math.random()*128,l=Math.random()*128;i.fillRect(a,l,16+Math.random()*20,12+Math.random()*16)}}else{i.fillStyle="#9e8563",i.fillRect(0,0,128,128);const s=["#6e5b42","#baa07b","#4d3e2b"];for(let o=0;o<30;o++){i.fillStyle=s[o%s.length];const a=Math.random()*128,l=Math.random()*128;i.fillRect(a,l,16+Math.random()*20,12+Math.random()*16)}}qs(i,128,128,.08);const r=new cr(t);return gt.set(e,r),r}class AT{constructor(){ee(this,"scene");ee(this,"collisionBoxes",[]);ee(this,"plantZones",[]);ee(this,"waypoints",[]);ee(this,"spawnCT",[]);ee(this,"spawnT",[]);this.scene=new nt,this.buildMap(),this.buildWaypoints()}addAABB(e,t,i,r,s,o,a="wall"){this.collisionBoxes.push({min:new L(Math.min(e,r),Math.min(t,s),Math.min(i,o)),max:new L(Math.max(e,r),Math.max(t,s),Math.max(i,o)),type:a})}createWall(e,t,i,r,s,o,a){const l=new ae(r,s,o),c=new ne(l,a);return c.position.set(e,t+s/2,i),c.castShadow=!0,c.receiveShadow=!0,this.scene.add(c),this.addAABB(e-r/2,t,i-o/2,e+r/2,t+s,i+o/2,"wall"),c}createCrate(e,t,i,r=2,s){const o=new Xe({map:ET(s),roughness:.8,metalness:.1}),a=new ae(r,r,r),l=new ne(a,o);return l.position.set(e,t+r/2,i),l.castShadow=!0,l.receiveShadow=!0,this.scene.add(l),this.addAABB(e-r/2,t,i-r/2,e+r/2,t+r,i+r/2,"crate"),l}createDoubleCrate(e,t,i,r){this.createCrate(e,t,i,2,r),this.createCrate(e,t+2,i,2,r)}createRamp(e,t,i,r,s,o,a,l){const c=Math.hypot(r-e,o-i),d=s-t,f=new ae(a,.4,c),h=new ne(f,l),p=(e+r)/2,g=(t+s)/2,_=(i+o)/2;h.position.set(p,g,_);const m=Math.atan2(r-e,o-i),u=Math.atan2(d,c);h.rotation.y=m,h.rotation.x=-u,h.castShadow=!0,h.receiveShadow=!0,this.scene.add(h);const v=6;for(let x=0;x<v;x++){const y=x/v,P=e+(r-e)*y,E=t+(s-t)*y,A=i+(o-i)*y,R=d/v+.3;this.addAABB(P-a/2,E-.2,A-c/v/2,P+a/2,E+R,A+c/v/2,"ramp")}}buildMap(){const e=MT();e.repeat.set(4,2);const t=new Xe({map:e,roughness:.85,metalness:.05}),i=ST();i.repeat.set(24,24);const r=new Xe({map:i,roughness:.9,metalness:.02}),s=new tr(160,160),o=new ne(s,r);o.rotation.x=-Math.PI/2,o.position.y=0,o.receiveShadow=!0,this.scene.add(o);const a=new qo(150,32,16),l=new er({color:13164016,side:en}),c=new ne(a,l);this.scene.add(c),this.createWall(0,0,-55,140,12,4,t),this.createWall(0,0,60,140,12,4,t),this.createWall(-55,0,0,4,12,120,t),this.createWall(60,0,0,4,12,120,t),this.createWall(-10,0,45,2,7,20,t),this.createWall(-30,0,38,20,7,2,t),this.spawnT=[new L(-25,1,50),new L(-20,1,52),new L(-15,1,50),new L(-10,1,52),new L(-5,1,50)],this.createWall(-8,0,10,2,8,36,t),this.createWall(-8,0,-18,2,8,16,t),this.createWall(8,0,20,2,8,24,t),this.createCrate(5.5,0,8,2.4);const d=new Xe({map:_m("mid_door"),roughness:.6,metalness:.3}),f=new ne(new ae(4.2,6.5,.4),d);f.position.set(-3.6,3.25,-6),f.rotation.y=.22,f.castShadow=!0,this.scene.add(f),this.addAABB(-5.8,0,-6.8,-1.4,6.5,-5.2,"door");const h=new ne(new ae(4.2,6.5,.4),d);h.position.set(3.6,3.25,-6),h.rotation.y=-.22,h.castShadow=!0,this.scene.add(h),this.addAABB(1.4,0,-6.8,5.8,6.5,-5.2,"door");const p=new ae(6,.6,26),g=new ne(p,t);g.position.set(11,3.2,2),g.receiveShadow=!0,this.scene.add(g),this.addAABB(8,0,-11,14,3.5,15,"wall"),this.createRamp(7,0,16,11,3.5,12,4,t),this.createWall(14,3.5,-12,2,5,14,t),this.createWall(20,3.5,-18,12,5,2,t),this.createWall(32,0,15,2,8,38,t),this.createWall(38,0,32,10,8,2,t),this.createWall(38,0,24,10,8,2,t),this.createDoubleCrate(36,0,28,"A"),this.createWall(54,0,25,2,7,22,t),this.createCrate(46,0,18,2);const _=new Xe({map:_m("container"),roughness:.5,metalness:.4}),m=new ne(new ae(3.5,3.5,8),_);m.position.set(44,1.75,-5),m.castShadow=!0,this.scene.add(m),this.addAABB(42.25,0,-9,45.75,3.5,-1,"crate"),this.createRamp(42,0,-12,34,2.8,-22,6,t);const u=new ne(new ae(18,.6,16),t);u.position.set(26,2.5,-27),u.receiveShadow=!0,this.scene.add(u),this.addAABB(17,0,-35,35,2.8,-19,"wall"),this.createDoubleCrate(24,2.8,-26,"A"),this.createCrate(26,2.8,-26,2,"A"),this.createCrate(24,2.8,-28,2,"A"),this.createWall(26,2.8,-35,18,6,2,t),this.createWall(35,2.8,-27,2,6,16,t),this.createRamp(20,2.8,-32,14,0,-38,5,t);const v=new tr(3,3),x=new er({map:ym("A"),transparent:!0,depthWrite:!1}),y=new ne(v,x);y.position.set(26,4.5,-33.9),this.scene.add(y),this.plantZones.push({site:"A",min:new L(18,2,-32),max:new L(32,5,-22),center:new L(25,2.8,-27)}),this.createWall(-18,0,18,16,7,2,t),this.createWall(-22,0,8,20,7,2,t),this.createRamp(-14,0,12,-26,2.8,4,5,t),this.createWall(-44,0,5,2,7,26,t),this.createWall(-32,0,2,2,7,18,t);const P=new ne(new ae(12,.4,24),t);P.position.set(-38,6.8,5),this.scene.add(P),this.createWall(-38,0,-14,8,7,2,t);const E=new ne(new ae(14,.6,12),t);E.position.set(-40,1.8,-22),E.receiveShadow=!0,this.scene.add(E),this.addAABB(-47,0,-28,-33,2.1,-16,"wall"),this.createDoubleCrate(-30,0,-28,"B"),this.createCrate(-32,0,-28,2,"B"),this.createCrate(-28,0,-32,2,"B"),this.createWall(-48,0,-35,2,8,20,t),this.createWall(-35,0,-44,26,8,2,t),this.createWall(-18,0,-32,2,8,12,t),this.createWall(-18,0,-40,2,5,6,t),this.addAABB(-19,0,-43,-17,2.2,-37,"wall");const A=new tr(3,3),R=new er({map:ym("B"),transparent:!0,depthWrite:!1}),w=new ne(A,R);w.position.set(-35,4.5,-42.9),this.scene.add(w),this.plantZones.push({site:"B",min:new L(-38,0,-36),max:new L(-24,4,-22),center:new L(-30,.5,-28)}),this.createWall(5,0,-44,24,7,2,t),this.createCrate(2,0,-40,2),this.createCrate(12,0,-42,2),this.spawnCT=[new L(6,1,-46),new L(10,1,-46),new L(14,1,-46),new L(2,1,-46),new L(18,1,-46)];const M=new _T(16772829,.65);this.scene.add(M);const D=new xT(16775917,1.1);D.position.set(40,60,30),D.castShadow=!0,D.shadow.mapSize.width=2048,D.shadow.mapSize.height=2048,D.shadow.camera.near=10,D.shadow.camera.far=160,D.shadow.camera.left=-60,D.shadow.camera.right=60,D.shadow.camera.top=60,D.shadow.camera.bottom=-60,this.scene.add(D)}buildWaypoints(){this.waypoints=[{id:0,name:"T Spawn Main",pos:new L(-15,0,48),connections:[1,2,3],teamPriority:"T",siteTag:"SPAWN"},{id:1,name:"T Spawn to Long",pos:new L(10,0,46),connections:[0,4],teamPriority:"T",siteTag:"LONG"},{id:2,name:"T Spawn to Mid",pos:new L(-2,0,38),connections:[0,6],teamPriority:"T",siteTag:"MID"},{id:3,name:"T Spawn to Tunnels",pos:new L(-30,0,35),connections:[0,18],teamPriority:"T",siteTag:"TUNNEL"},{id:4,name:"Long Doors Outside",pos:new L(36,0,38),connections:[1,5],teamPriority:"T",siteTag:"LONG"},{id:5,name:"Long Doors Inside",pos:new L(36,0,20),connections:[4,7,8],teamPriority:"BOTH",siteTag:"LONG"},{id:6,name:"Top Mid",pos:new L(0,0,22),connections:[2,11,12,19],teamPriority:"BOTH",siteTag:"MID"},{id:7,name:"Pit",pos:new L(48,0,18),connections:[5,8],teamPriority:"BOTH",siteTag:"LONG"},{id:8,name:"Long Alley",pos:new L(42,0,2),connections:[5,7,9],teamPriority:"BOTH",siteTag:"LONG"},{id:9,name:"Long Corner / Car",pos:new L(40,0,-8),connections:[8,10],teamPriority:"BOTH",siteTag:"LONG"},{id:10,name:"Long Ramp to A",pos:new L(34,1.5,-16),connections:[9,15],teamPriority:"BOTH",siteTag:"LONG"},{id:11,name:"Mid Xbox",pos:new L(0,0,4),connections:[6,13,14],teamPriority:"BOTH",siteTag:"MID"},{id:12,name:"Mid Catwalk Stairs",pos:new L(10,2.5,14),connections:[6,13],teamPriority:"BOTH",siteTag:"MID"},{id:13,name:"Catwalk",pos:new L(11,3.5,0),connections:[11,12,14],teamPriority:"BOTH",siteTag:"A"},{id:14,name:"Short A Stairs",pos:new L(18,3.5,-14),connections:[13,16],teamPriority:"BOTH",siteTag:"A"},{id:15,name:"A Site Platform",pos:new L(25,2.8,-26),connections:[10,16,17,26],teamPriority:"BOTH",siteTag:"A"},{id:16,name:"A Short Entrance",pos:new L(22,3.5,-20),connections:[14,15],teamPriority:"BOTH",siteTag:"A"},{id:17,name:"Goose / Back of A",pos:new L(26,2.8,-32),connections:[15,27],teamPriority:"CT",siteTag:"A"},{id:18,name:"Outside Tunnels",pos:new L(-36,0,22),connections:[3,19,20],teamPriority:"T",siteTag:"TUNNEL"},{id:19,name:"Lower B Tunnels",pos:new L(-20,0,14),connections:[6,18,20],teamPriority:"BOTH",siteTag:"TUNNEL"},{id:20,name:"Upper B Tunnels",pos:new L(-38,2,4),connections:[18,19,21],teamPriority:"BOTH",siteTag:"TUNNEL"},{id:21,name:"Upper B Exit",pos:new L(-38,2,-16),connections:[20,22],teamPriority:"BOTH",siteTag:"TUNNEL"},{id:22,name:"B Platform",pos:new L(-38,2,-24),connections:[21,23,24],teamPriority:"BOTH",siteTag:"B"},{id:23,name:"B Site Center (Plant)",pos:new L(-28,0,-28),connections:[22,24,25],teamPriority:"BOTH",siteTag:"B"},{id:24,name:"Back of B / Car",pos:new L(-42,0,-36),connections:[22,23],teamPriority:"CT",siteTag:"B"},{id:25,name:"B Doors / Window",pos:new L(-18,0,-34),connections:[23,28],teamPriority:"BOTH",siteTag:"B"},{id:26,name:"CT Mid Doors",pos:new L(0,0,-14),connections:[11,27,28],teamPriority:"BOTH",siteTag:"MID"},{id:27,name:"CT Spawn Main",pos:new L(8,0,-42),connections:[15,17,26,28],teamPriority:"CT",siteTag:"SPAWN"},{id:28,name:"CT to B Ramp",pos:new L(-10,0,-36),connections:[25,26,27],teamPriority:"CT",siteTag:"B"}]}}class Mm{constructor(e){ee(this,"group");ee(this,"team");ee(this,"headGroup");ee(this,"chestGroup");ee(this,"stomachMesh");ee(this,"leftUpperArm");ee(this,"rightUpperArm");ee(this,"leftForearm");ee(this,"rightForearm");ee(this,"leftThigh");ee(this,"rightThigh");ee(this,"leftCalf");ee(this,"rightCalf");ee(this,"weaponMesh");ee(this,"hitboxMeshes",[]);ee(this,"isDead",!1);ee(this,"deathProgress",0);ee(this,"deathFallDir",new L);ee(this,"walkTime",0);ee(this,"isMoving",!1);ee(this,"isCrouching",!1);ee(this,"aimPitch",0);this.team=e,this.group=new nt;const t=TT(e),i=new Xe({map:t,roughness:.8,metalness:.1}),r=e==="CT"?1582131:4865068,s=new Xe({color:r,roughness:.7,metalness:.2}),o=e==="CT"?14463630:13014637,a=new Xe({color:o,roughness:.6}),l=new Xe({color:2040614,roughness:.9}),c=new Xe({color:1382426,roughness:.85}),d=(me,Ne,Y)=>{const re=new er({visible:!1}),ve=new ne(me,re);return this.hitboxMeshes.push({zone:Ne,mesh:ve,multiplier:Y}),ve};this.stomachMesh=new ne(new ae(.36,.22,.24),i),this.stomachMesh.position.set(0,.95,0),this.stomachMesh.castShadow=!0,this.group.add(this.stomachMesh);const f=new ne(new ae(.38,.08,.26),l);f.position.set(0,-.06,0),this.stomachMesh.add(f);const h=d(new ae(.4,.26,.28),"stomach",1.25);this.stomachMesh.add(h),this.chestGroup=new nt,this.chestGroup.position.set(0,.16,0),this.stomachMesh.add(this.chestGroup);const p=new ne(new ae(.44,.36,.26),i);p.position.set(0,.18,0),p.castShadow=!0,this.chestGroup.add(p);const g=new ne(new ae(.42,.32,.14),s);g.position.set(0,.18,.09),this.chestGroup.add(g);for(let me=-1;me<=1;me++){const Ne=new ne(new ae(.09,.14,.06),l);Ne.position.set(me*.11,.12,.18),this.chestGroup.add(Ne)}const _=d(new ae(.48,.38,.32),"chest",1);_.position.set(0,.18,0),this.chestGroup.add(_),this.headGroup=new nt,this.headGroup.position.set(0,.38,0),this.chestGroup.add(this.headGroup);const m=new ne(new mn(.08,.09,.1,8),a);m.position.set(0,.05,0),this.headGroup.add(m);const u=new ne(new ae(.24,.26,.24),a);if(u.position.set(0,.2,0),u.castShadow=!0,this.headGroup.add(u),e==="CT"){const me=new ne(new qo(.16,12,10),new Xe({color:1846074,roughness:.6}));me.position.set(0,.24,-.02),me.scale.set(1.05,.9,1.1),this.headGroup.add(me);const Ne=new ne(new ae(.22,.08,.08),new Xe({color:1122867,roughness:.2,metalness:.8}));Ne.position.set(0,.22,.11),this.headGroup.add(Ne);const Y=new ne(new ae(.28,.08,.06),l);Y.position.set(0,.2,0),this.headGroup.add(Y)}else{const me=new ne(new ae(.26,.12,.26),new Xe({color:8530466,roughness:.9}));me.position.set(0,.28,0),this.headGroup.add(me);const Ne=new ne(new ae(.2,.05,.04),new Xe({color:328965,roughness:.1,metalness:.9}));Ne.position.set(0,.22,.13),this.headGroup.add(Ne)}const v=d(new qo(.22,8,8),"head",2);v.position.set(0,.2,0),this.headGroup.add(v),this.leftUpperArm=new nt,this.leftUpperArm.position.set(-.28,.3,0),this.chestGroup.add(this.leftUpperArm);const x=new ne(new ae(.12,.26,.12),i);x.position.set(0,-.13,0),this.leftUpperArm.add(x),this.leftForearm=new nt,this.leftForearm.position.set(0,-.26,0),this.leftUpperArm.add(this.leftForearm);const y=new ne(new ae(.1,.24,.1),i);y.position.set(0,-.12,0),this.leftForearm.add(y);const P=new ne(new ae(.1,.1,.1),l);P.position.set(0,-.24,0),this.leftForearm.add(P);const E=d(new ae(.16,.54,.16),"arm_left",.8);E.position.set(0,-.25,0),this.leftUpperArm.add(E),this.rightUpperArm=new nt,this.rightUpperArm.position.set(.28,.3,0),this.chestGroup.add(this.rightUpperArm);const A=new ne(new ae(.12,.26,.12),i);A.position.set(0,-.13,0),this.rightUpperArm.add(A),this.rightForearm=new nt,this.rightForearm.position.set(0,-.26,0),this.rightUpperArm.add(this.rightForearm);const R=new ne(new ae(.1,.24,.1),i);R.position.set(0,-.12,0),this.rightForearm.add(R);const w=new ne(new ae(.1,.1,.1),l);w.position.set(0,-.24,0),this.rightForearm.add(w);const M=d(new ae(.16,.54,.16),"arm_right",.8);M.position.set(0,-.25,0),this.rightUpperArm.add(M),this.rightUpperArm.rotation.x=-Math.PI/3,this.rightUpperArm.rotation.y=-.3,this.rightForearm.rotation.x=-Math.PI/4,this.leftUpperArm.rotation.x=-Math.PI/2.6,this.leftUpperArm.rotation.y=.6,this.leftForearm.rotation.x=-Math.PI/5,this.weaponMesh=this.buildHeldWeaponMesh(),this.weaponMesh.position.set(0,-.25,.15),this.weaponMesh.rotation.x=Math.PI/2,this.rightForearm.add(this.weaponMesh),this.leftThigh=new nt,this.leftThigh.position.set(-.12,-.06,0),this.stomachMesh.add(this.leftThigh);const D=new ne(new ae(.15,.38,.16),i);D.position.set(0,-.19,0),D.castShadow=!0,this.leftThigh.add(D),this.leftCalf=new nt,this.leftCalf.position.set(0,-.38,0),this.leftThigh.add(this.leftCalf);const V=new ne(new ae(.13,.38,.14),i);V.position.set(0,-.19,0),this.leftCalf.add(V);const U=new ne(new ae(.14,.1,.06),l);U.position.set(0,-.04,.08),this.leftCalf.add(U);const B=new ne(new ae(.14,.14,.22),c);B.position.set(0,-.42,.04),this.leftCalf.add(B);const X=d(new ae(.18,.88,.22),"leg_left",.75);X.position.set(0,-.42,0),this.leftThigh.add(X),this.rightThigh=new nt,this.rightThigh.position.set(.12,-.06,0),this.stomachMesh.add(this.rightThigh);const W=new ne(new ae(.15,.38,.16),i);W.position.set(0,-.19,0),W.castShadow=!0,this.rightThigh.add(W);const K=new ne(new ae(.06,.16,.1),l);K.position.set(.09,-.16,0),this.rightThigh.add(K),this.rightCalf=new nt,this.rightCalf.position.set(0,-.38,0),this.rightThigh.add(this.rightCalf);const N=new ne(new ae(.13,.38,.14),i);N.position.set(0,-.19,0),this.rightCalf.add(N);const q=new ne(new ae(.14,.1,.06),l);q.position.set(0,-.04,.08),this.rightCalf.add(q);const Z=new ne(new ae(.14,.14,.22),c);Z.position.set(0,-.42,.04),this.rightCalf.add(Z);const le=d(new ae(.18,.88,.22),"leg_right",.75);le.position.set(0,-.42,0),this.rightThigh.add(le)}buildHeldWeaponMesh(){const e=new nt,t=new Xe({color:2236962,roughness:.4,metalness:.8}),i=new Xe({map:vv(),roughness:.7}),r=new ne(new ae(.06,.08,.35),t);e.add(r);const s=new ne(new mn(.015,.015,.3),t);s.rotation.x=Math.PI/2,s.position.set(0,.01,.3),e.add(s);const o=new ne(new ae(.07,.07,.2),i);o.position.set(0,-.01,.2),e.add(o);const a=new ne(new ae(.05,.1,.22),i);a.position.set(0,-.03,-.26),e.add(a);const l=new ne(new ae(.04,.16,.08),t);return l.position.set(0,-.1,.06),l.rotation.x=.25,e.add(l),e.scale.set(.9,.9,.9),e}update(e,t,i,r){if(this.isDead){if(this.deathProgress<1){this.deathProgress=Math.min(1,this.deathProgress+e*2.5);const s=this.deathProgress;this.group.position.y=Math.max(.15,this.group.position.y-e*2),this.group.rotation.x=-Math.PI/2*s,this.headGroup.rotation.x=-.4*s,this.leftThigh.rotation.x=.5*s,this.rightThigh.rotation.x=.3*s,this.leftUpperArm.rotation.z=-.8*s,this.rightUpperArm.rotation.z=.8*s}return}if(this.isMoving=t,this.aimPitch=r,this.chestGroup.rotation.x=this.aimPitch*.7,this.headGroup.rotation.x=this.aimPitch*.3,t){this.walkTime+=e*i*3.5;const s=Math.sin(this.walkTime)*.6;this.leftThigh.rotation.x=s,this.rightThigh.rotation.x=-s,this.leftCalf.rotation.x=Math.max(0,-Math.sin(this.walkTime)*.5),this.rightCalf.rotation.x=Math.max(0,Math.sin(this.walkTime)*.5),this.stomachMesh.position.y=.95+Math.abs(Math.sin(this.walkTime*2))*.04}else this.walkTime+=e*1.5,this.leftThigh.rotation.x=Yt.lerp(this.leftThigh.rotation.x,0,e*10),this.rightThigh.rotation.x=Yt.lerp(this.rightThigh.rotation.x,0,e*10),this.leftCalf.rotation.x=Yt.lerp(this.leftCalf.rotation.x,0,e*10),this.rightCalf.rotation.x=Yt.lerp(this.rightCalf.rotation.x,0,e*10),this.chestGroup.position.y=.16+Math.sin(this.walkTime)*.01}triggerDeath(e){this.isDead=!0,this.deathProgress=0,e&&this.deathFallDir.copy(e).normalize()}testHitboxes(e){if(this.isDead)return null;let t=null;const i=new ct,r=new Br;for(const{zone:s,mesh:o,multiplier:a}of this.hitboxMeshes){o.updateWorldMatrix(!0,!1),i.copy(o.matrixWorld).invert(),r.copy(e).applyMatrix4(i),o.geometry.boundingBox||o.geometry.computeBoundingBox();const l=o.geometry.boundingBox,c=r.intersectBox(l,new L);if(c){c.applyMatrix4(o.matrixWorld);const d=e.origin.distanceTo(c);(!t||d<t.distance)&&(t={zone:s,distance:d,point:c,multiplier:a})}}return t}}class RT{constructor(e){ee(this,"map");this.map=e}moveEntity(e,t,i,r=.35,s=1.8){let o=!1;t.y-=22*i;const a=e.clone();a.x+=t.x*i;for(const l of this.map.collisionBoxes)this.checkEntityAABBOverlap(a,l,r,s)&&(l.max.y-e.y<=.5&&l.max.y>=e.y?(a.y=l.max.y,o=!0):(t.x>0?a.x=l.min.x-r:t.x<0&&(a.x=l.max.x+r),t.x=0));a.z+=t.z*i;for(const l of this.map.collisionBoxes)this.checkEntityAABBOverlap(a,l,r,s)&&(l.max.y-e.y<=.5&&l.max.y>=e.y?(a.y=l.max.y,o=!0):(t.z>0?a.z=l.min.z-r:t.z<0&&(a.z=l.max.z+r),t.z=0));a.y+=t.y*i;for(const l of this.map.collisionBoxes)this.checkEntityAABBOverlap(a,l,r,s)&&(t.y<0?(a.y=l.max.y,t.y=0,o=!0):t.y>0&&(a.y=l.min.y-s,t.y=0));return a.y<=0&&(a.y=0,t.y=0,o=!0),o?(t.x-=t.x*10*i,t.z-=t.z*10*i,Math.abs(t.x)<.01&&(t.x=0),Math.abs(t.z)<.01&&(t.z=0)):(t.x*=.98,t.z*=.98),{pos:a,velocity:t,isGrounded:o}}checkEntityAABBOverlap(e,t,i,r){const s=e.x-i,o=e.x+i,a=e.y,l=e.y+r,c=e.z-i,d=e.z+i;return s<t.max.x&&o>t.min.x&&a<t.max.y&&l>t.min.y&&c<t.max.z&&d>t.min.z}raycastMap(e,t,i=150){let r=i,s=new L,o=new L(0,1,0),a=!1;const l=new Br(e,t.clone().normalize());if(t.y<-.001){const f=-e.y/t.y;f>0&&f<r&&(r=f,s=e.clone().add(t.clone().multiplyScalar(f)),o=new L(0,1,0),a=!0)}const c=new Xs,d=new L;for(const f of this.map.collisionBoxes){c.set(f.min,f.max);const h=l.intersectBox(c,d);if(h){const p=e.distanceTo(h);if(p<r){r=p,s.copy(h),a=!0;const g=.05;Math.abs(s.x-f.min.x)<g?o.set(-1,0,0):Math.abs(s.x-f.max.x)<g?o.set(1,0,0):Math.abs(s.y-f.min.y)<g?o.set(0,-1,0):Math.abs(s.y-f.max.y)<g?o.set(0,1,0):Math.abs(s.z-f.min.z)<g?o.set(0,0,-1):Math.abs(s.z-f.max.z)<g?o.set(0,0,1):o.set(0,1,0)}}}return{hit:a,distance:r,point:s,normal:o}}hasLineOfSight(e,t){const i=t.clone().sub(e),r=i.length();if(r<.1)return!0;i.normalize();const s=this.raycastMap(e,i,r);return!s.hit||s.distance>=r-.2}}const An={ak47:{id:"ak47",name:"AK-47",slot:"primary",price:2700,damage:36,headshotMultiplier:4,armorPenetration:.775,fireRate:.1,magazineSize:30,maxReserveAmmo:90,reloadTime:2.4,recoilClimb:.045,recoilSpread:.025,recoilRecovery:4.5,spreadMovingPenalty:.04,killReward:300,isAutomatic:!0,teamExclusive:"T"},m4a4:{id:"m4a4",name:"M4A4",slot:"primary",price:2900,damage:33,headshotMultiplier:4,armorPenetration:.7,fireRate:.09,magazineSize:30,maxReserveAmmo:90,reloadTime:2.2,recoilClimb:.032,recoilSpread:.015,recoilRecovery:5.2,spreadMovingPenalty:.03,killReward:300,isAutomatic:!0,teamExclusive:"CT"},awp:{id:"awp",name:"AWP Sniper",slot:"primary",price:4750,damage:115,headshotMultiplier:4,armorPenetration:.975,fireRate:1.4,magazineSize:5,maxReserveAmmo:30,reloadTime:3.2,recoilClimb:.12,recoilSpread:.01,recoilRecovery:3,spreadMovingPenalty:.15,scopedFov:20,killReward:100,isAutomatic:!1},glock:{id:"glock",name:"Glock-18",slot:"secondary",price:200,damage:28,headshotMultiplier:4,armorPenetration:.47,fireRate:.15,magazineSize:20,maxReserveAmmo:120,reloadTime:1.9,recoilClimb:.018,recoilSpread:.012,recoilRecovery:6,spreadMovingPenalty:.015,killReward:300,isAutomatic:!1,teamExclusive:"T"},usp:{id:"usp",name:"USP-S",slot:"secondary",price:200,damage:35,headshotMultiplier:4,armorPenetration:.505,fireRate:.17,magazineSize:12,maxReserveAmmo:24,reloadTime:2,recoilClimb:.02,recoilSpread:.008,recoilRecovery:6.5,spreadMovingPenalty:.02,killReward:300,isAutomatic:!1,teamExclusive:"CT"},deagle:{id:"deagle",name:"Desert Eagle",slot:"secondary",price:700,damage:63,headshotMultiplier:4,armorPenetration:.85,fireRate:.25,magazineSize:7,maxReserveAmmo:35,reloadTime:2.2,recoilClimb:.08,recoilSpread:.04,recoilRecovery:3.2,spreadMovingPenalty:.08,killReward:300,isAutomatic:!1},knife:{id:"knife",name:"Tactical Knife",slot:"melee",price:0,damage:40,headshotMultiplier:1,armorPenetration:.85,fireRate:.4,magazineSize:1,maxReserveAmmo:0,reloadTime:0,recoilClimb:0,recoilSpread:0,recoilRecovery:10,spreadMovingPenalty:0,killReward:1500,isAutomatic:!1},c4:{id:"c4",name:"C4 Explosive",slot:"bomb",price:0,damage:500,headshotMultiplier:1,armorPenetration:1,fireRate:1,magazineSize:1,maxReserveAmmo:0,reloadTime:0,recoilClimb:0,recoilSpread:0,recoilRecovery:10,spreadMovingPenalty:0,killReward:300,isAutomatic:!1,teamExclusive:"T"}};class CT{constructor(e,t){ee(this,"map");ee(this,"collision");this.map=e,this.collision=t}findPath(e,t){const i=this.getNearestWaypoint(e),r=this.getNearestWaypoint(t);if(i===r)return[r];const s=[i],o=new Map,a=new Map,l=new Map;this.map.waypoints.forEach(f=>{a.set(f.id,1/0),l.set(f.id,1/0)}),a.set(i,0);const c=this.map.waypoints[i],d=this.map.waypoints[r];for(l.set(i,c.pos.distanceTo(d.pos));s.length>0;){let f=s[0],h=l.get(f)??1/0;for(const g of s){const _=l.get(g)??1/0;_<h&&(h=_,f=g)}if(f===r){const g=[f];let _=f;for(;o.has(_);)_=o.get(_),g.unshift(_);return g}s.splice(s.indexOf(f),1);const p=this.map.waypoints[f];for(const g of p.connections){const _=this.map.waypoints[g],m=(a.get(f)??1/0)+p.pos.distanceTo(_.pos);m<(a.get(g)??1/0)&&(o.set(g,f),a.set(g,m),l.set(g,m+_.pos.distanceTo(d.pos)),s.includes(g)||s.push(g))}}return[r]}getNearestWaypoint(e){let t=0,i=1/0;return this.map.waypoints.forEach(r=>{const s=r.pos.distanceTo(e);s<i&&(i=s,t=r.id)}),t}updateBot(e,t,i,r,s,o,a,l,c){if(e.health<=0||e.isPlayer)return;const d=t.filter(v=>v.team!==e.team&&v.health>0);let f=null,h=1/0;const p=e.position.clone().add(new L(0,1.6,0)),g=new L(Math.sin(e.rotationY),0,Math.cos(e.rotationY));for(const v of d){const x=v.position.clone().add(new L(0,1.5,0)),y=x.clone().sub(p),P=y.length();P<80&&(y.normalize(),(g.angleTo(y)<Math.PI*.4||P<6)&&this.collision.hasLineOfSight(p,x)&&P<h&&(h=P,f=v))}if(f){e.targetEnemy=f,e.state="ENGAGE";const v=f.position.clone().sub(e.position),x=Math.atan2(v.x,v.z);e.rotationY=Yt.lerp(e.rotationY,x,r*10);const y=f.position.y+1.4-(e.position.y+1.5),P=Math.hypot(v.x,v.z);if(e.pitch=Math.atan2(y,P),e.reactionTimer>0)e.reactionTimer-=r;else{e.strafeTimer-=r,e.strafeTimer<=0&&(e.strafeDir=Math.random()>.5?1:-1,e.strafeTimer=.8+Math.random()*.8);const E=new L(Math.cos(e.rotationY),0,-Math.sin(e.rotationY)).multiplyScalar(e.strafeDir*2.2);e.velocity.x=E.x,e.velocity.z=E.z;const A=An[e.currentWeapon];if(e.fireCooldown>0)e.fireCooldown-=r;else if(e.burstPauseTimer>0)e.burstPauseTimer-=r;else{const R=e.ammo[e.currentWeapon];if(R&&R.clip>0){R.clip--,e.fireCooldown=A.fireRate,e.burstCount++;const w=Math.max(.35,.85-h/50),M=Math.random()<w;s(e,M),A.isAutomatic&&e.burstCount>=3&&(e.burstCount=0,e.burstPauseTimer=.35+Math.random()*.25)}else R&&R.reserve>0&&(R.clip=Math.min(A.magazineSize,R.reserve),R.reserve-=R.clip,e.fireCooldown=A.reloadTime)}}}else{if(e.targetEnemy=null,e.reactionTimer=.25+Math.random()*.2,e.burstCount=0,i.isPlanted)if(e.team==="CT"){if(e.state="RETAKE",i.position)if(e.position.distanceTo(i.position)<2.2){e.state="DEFUSING",e.plantDefuseTimer+=r;const x=e.hasDefuseKit?5:10;l(e),e.plantDefuseTimer>=x&&c(e),e.velocity.set(0,0,0);return}else e.path.length===0&&(e.path=this.findPath(e.position,i.position))}else e.state="DEFEND_BOMB";else if(e.team==="T"&&e.hasC4){const v=this.map.plantZones[0];if(e.position.distanceTo(v.center)<6){e.state="PLANTING",e.plantDefuseTimer+=r,o(e),e.plantDefuseTimer>=3.2&&a(e),e.velocity.set(0,0,0);return}else e.state="PATROL",e.path.length===0&&(e.path=this.findPath(e.position,v.center))}else if(e.state="PATROL",e.path.length===0){const v=this.selectTacticalWaypoint(e);e.path=this.findPath(e.position,v.pos)}if(e.path.length>0){const v=e.path[0],x=this.map.waypoints[v];if(Math.hypot(x.pos.x-e.position.x,x.pos.z-e.position.z)<1.8)e.path.shift();else{const P=x.pos.clone().sub(e.position);P.y=0,P.normalize();const E=Math.atan2(P.x,P.z);e.rotationY=Yt.lerp(e.rotationY,E,r*6);const A=4.2;e.velocity.x=P.x*A,e.velocity.z=P.z*A}}}const _=this.collision.moveEntity(e.position,e.velocity,r,.35,1.8);e.position.copy(_.pos),e.velocity.copy(_.velocity);const m=Math.hypot(e.velocity.x,e.velocity.z)>.4,u=Math.hypot(e.velocity.x,e.velocity.z);e.character.group.position.copy(e.position),e.character.group.rotation.y=e.rotationY,e.character.update(r,m,u,e.pitch)}selectTacticalWaypoint(e){if(e.team==="T"){const t=Math.random()>.5?15:23;return this.map.waypoints[t]}else{const t=[15,17,23,24,26],i=t[Math.floor(Math.random()*t.length)];return this.map.waypoints[i]}}}class bT{constructor(){ee(this,"scene");ee(this,"particles",[]);ee(this,"tracers",[]);ee(this,"pointGeo");ee(this,"pointMat");ee(this,"pointsMesh");ee(this,"maxParticles",600);ee(this,"positions");ee(this,"colors");ee(this,"screenShake",0);this.scene=new nt,this.positions=new Float32Array(this.maxParticles*3),this.colors=new Float32Array(this.maxParticles*3),this.pointGeo=new dn,this.pointGeo.setAttribute("position",new Dn(this.positions,3)),this.pointGeo.setAttribute("color",new Dn(this.colors,3)),this.pointMat=new pv({size:.15,vertexColors:!0,transparent:!0,opacity:.9,blending:Pr}),this.pointsMesh=new mT(this.pointGeo,this.pointMat),this.scene.add(this.pointsMesh)}addBulletTracer(e,t){const i=new dn().setFromPoints([e.clone(),t.clone()]),r=new hv({color:16771704,transparent:!0,opacity:.85,linewidth:2}),s=new pT(i,r);this.scene.add(s),this.tracers.push({line:s,start:e.clone(),end:t.clone(),life:.08,maxLife:.08})}addImpactSparks(e,t){for(let r=0;r<10;r++){this.particles.length>=this.maxParticles&&this.particles.shift();const s=t.clone().multiplyScalar(2+Math.random()*4);s.x+=(Math.random()-.5)*3,s.y+=(Math.random()-.5)*3,s.z+=(Math.random()-.5)*3,this.particles.push({position:e.clone().add(t.clone().multiplyScalar(.05)),velocity:s,color:new ke(16759603),size:.08,life:.2+Math.random()*.15,maxLife:.35,type:"spark"})}for(let r=0;r<6;r++){this.particles.length>=this.maxParticles&&this.particles.shift();const s=new L((Math.random()-.5)*1.5,Math.random()*1.5,(Math.random()-.5)*1.5);this.particles.push({position:e.clone(),velocity:s,color:new ke(13808780),size:.25,life:.4+Math.random()*.3,maxLife:.7,type:"smoke"})}}addBloodSpurt(e,t,i){const r=t?35:18,s=i?i.clone().multiplyScalar(2.5):new L(0,1,0);for(let o=0;o<r;o++){this.particles.length>=this.maxParticles&&this.particles.shift();const a=s.clone();a.x+=(Math.random()-.5)*3.5,a.y+=Math.random()*3,a.z+=(Math.random()-.5)*3.5;const l=new ke(t?10027008:11145489);this.particles.push({position:e.clone(),velocity:a,color:l,size:t?.18:.12,life:.4+Math.random()*.35,maxLife:.75,type:"blood"})}}addC4Explosion(e){this.screenShake=1.2;const t=new Yf(.5,2.5,32),i=new er({color:16742178,side:Wn,transparent:!0,opacity:.95}),r=new ne(t,i);r.rotation.x=-Math.PI/2,r.position.copy(e).add(new L(0,.1,0)),this.scene.add(r);let s=1;const o=setInterval(()=>{s+=.8,r.scale.set(s,s,s),i.opacity-=.05,i.opacity<=0&&(clearInterval(o),this.scene.remove(r),t.dispose(),i.dispose())},25);for(let a=0;a<150;a++){this.particles.length>=this.maxParticles&&this.particles.shift();const l=new L((Math.random()-.5)*18,Math.random()*16+2,(Math.random()-.5)*18),c=Math.random()>.4,d=c?new ke(16729088).lerp(new ke(16763904),Math.random()):new ke(3355443);this.particles.push({position:e.clone().add(new L((Math.random()-.5)*2,.5,(Math.random()-.5)*2)),velocity:l,color:d,size:c?.4:.6,life:1+Math.random()*1.5,maxLife:2.5,type:"debris"})}}update(e){this.screenShake>0&&(this.screenShake=Math.max(0,this.screenShake-e*2));for(let r=this.tracers.length-1;r>=0;r--){const s=this.tracers[r];s.life-=e;const o=s.life/s.maxLife;s.line.material.opacity=o,s.life<=0&&(this.scene.remove(s.line),s.line.geometry.dispose(),s.line.material.dispose(),this.tracers.splice(r,1))}let t=0;const i=new L(0,-9.8,0);for(let r=this.particles.length-1;r>=0;r--){const s=this.particles[r];if(s.life-=e,s.life<=0){this.particles.splice(r,1);continue}if(s.type==="spark"||s.type==="blood"||s.type==="debris"?s.velocity.addScaledVector(i,e):s.type==="smoke"&&(s.velocity.y+=e*.8,s.velocity.x*=.95,s.velocity.z*=.95),s.position.addScaledVector(s.velocity,e),s.position.y<.05&&(s.position.y=.05,s.velocity.y*=-.3),t<this.maxParticles){const o=t*3;this.positions[o]=s.position.x,this.positions[o+1]=s.position.y,this.positions[o+2]=s.position.z;const a=s.life/s.maxLife;this.colors[o]=s.color.r*a,this.colors[o+1]=s.color.g*a,this.colors[o+2]=s.color.b*a,t++}}for(let r=t;r<this.maxParticles;r++){const s=r*3;this.positions[s]=0,this.positions[s+1]=-999,this.positions[s+2]=0}this.pointGeo.attributes.position.needsUpdate=!0,this.pointGeo.attributes.color.needsUpdate=!0}}class PT{constructor(){ee(this,"ctx",null);ee(this,"isMuted",!1);ee(this,"masterGain",null)}init(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;this.ctx=new e,this.masterGain=this.ctx.createGain(),this.masterGain.gain.setValueAtTime(.7,this.ctx.currentTime),this.masterGain.connect(this.ctx.destination)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}setMuted(e){this.isMuted=e,this.masterGain&&this.ctx&&this.masterGain.gain.setValueAtTime(e?0:.7,this.ctx.currentTime)}createNoiseBuffer(e=.5){if(!this.ctx)return null;const t=this.ctx.sampleRate*e,i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),r=i.getChannelData(0);for(let s=0;s<t;s++)r[s]=Math.random()*2-1;return i}playGunshot(e){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const t=this.ctx.currentTime;switch(e){case"ak47":{const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sawtooth",i.frequency.setValueAtTime(140,t),i.frequency.exponentialRampToValueAtTime(30,t+.18),r.gain.setValueAtTime(.9,t),r.gain.exponentialRampToValueAtTime(.001,t+.2),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.2);const s=this.ctx.createBufferSource();s.buffer=this.createNoiseBuffer(.25);const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(1600,t),o.frequency.exponentialRampToValueAtTime(300,t+.25),o.Q.setValueAtTime(3.5,t);const a=this.ctx.createGain();a.gain.setValueAtTime(1,t),a.gain.exponentialRampToValueAtTime(.001,t+.22),s.connect(o),o.connect(a),a.connect(this.masterGain),s.start(t),s.stop(t+.25);break}case"m4a4":{const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(200,t),i.frequency.exponentialRampToValueAtTime(45,t+.14),r.gain.setValueAtTime(.7,t),r.gain.exponentialRampToValueAtTime(.001,t+.15),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.15);const s=this.ctx.createBufferSource();s.buffer=this.createNoiseBuffer(.18);const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(2400,t),o.frequency.exponentialRampToValueAtTime(400,t+.18),o.Q.setValueAtTime(2.5,t);const a=this.ctx.createGain();a.gain.setValueAtTime(.85,t),a.gain.exponentialRampToValueAtTime(.001,t+.16),s.connect(o),o.connect(a),a.connect(this.masterGain),s.start(t),s.stop(t+.18);break}case"awp":{const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(90,t),i.frequency.exponentialRampToValueAtTime(20,t+.6),r.gain.setValueAtTime(1,t),r.gain.exponentialRampToValueAtTime(.001,t+.6),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.6);const s=this.ctx.createBufferSource();s.buffer=this.createNoiseBuffer(.8);const o=this.ctx.createBiquadFilter();o.type="lowpass",o.frequency.setValueAtTime(3500,t),o.frequency.exponentialRampToValueAtTime(150,t+.7);const a=this.ctx.createGain();a.gain.setValueAtTime(1.2,t),a.gain.exponentialRampToValueAtTime(.001,t+.75),s.connect(o),o.connect(a),a.connect(this.masterGain),s.start(t),s.stop(t+.8);break}case"glock":{const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(260,t),i.frequency.exponentialRampToValueAtTime(60,t+.1),r.gain.setValueAtTime(.6,t),r.gain.exponentialRampToValueAtTime(.001,t+.1),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.1);const s=this.ctx.createBufferSource();s.buffer=this.createNoiseBuffer(.12);const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(1800,t);const a=this.ctx.createGain();a.gain.setValueAtTime(.6,t),a.gain.exponentialRampToValueAtTime(.001,t+.11),s.connect(o),o.connect(a),a.connect(this.masterGain),s.start(t),s.stop(t+.12);break}case"usp":{const i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.09);const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.setValueAtTime(3200,t),r.frequency.exponentialRampToValueAtTime(900,t+.08),r.Q.setValueAtTime(4,t);const s=this.ctx.createGain();s.gain.setValueAtTime(.7,t),s.gain.exponentialRampToValueAtTime(.001,t+.08),i.connect(r),r.connect(s),s.connect(this.masterGain),i.start(t),i.stop(t+.09);break}case"deagle":{const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sawtooth",i.frequency.setValueAtTime(160,t),i.frequency.exponentialRampToValueAtTime(35,t+.28),r.gain.setValueAtTime(.9,t),r.gain.exponentialRampToValueAtTime(.001,t+.3),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.3);const s=this.ctx.createBufferSource();s.buffer=this.createNoiseBuffer(.35);const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(1400,t),o.frequency.exponentialRampToValueAtTime(200,t+.35);const a=this.ctx.createGain();a.gain.setValueAtTime(1.1,t),a.gain.exponentialRampToValueAtTime(.001,t+.32),s.connect(o),o.connect(a),a.connect(this.masterGain),s.start(t),s.stop(t+.35);break}}}playKnifeSlash(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.createNoiseBuffer(.15);const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(900,e),i.frequency.exponentialRampToValueAtTime(2800,e+.08),i.frequency.exponentialRampToValueAtTime(400,e+.15);const r=this.ctx.createGain();r.gain.setValueAtTime(.5,e),r.gain.exponentialRampToValueAtTime(.001,e+.14),t.connect(i),i.connect(r),r.connect(this.masterGain),t.start(e),t.stop(e+.15)}playKnifeHit(e){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const t=this.ctx.currentTime;if(e){const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(240,t),i.frequency.exponentialRampToValueAtTime(50,t+.12),r.gain.setValueAtTime(.7,t),r.gain.exponentialRampToValueAtTime(.001,t+.12),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.12)}else{const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="square",i.frequency.setValueAtTime(2200,t),i.frequency.exponentialRampToValueAtTime(900,t+.07),r.gain.setValueAtTime(.5,t),r.gain.exponentialRampToValueAtTime(.001,t+.07),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.07)}}playFootstep(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime,t=this.ctx.createBufferSource();t.buffer=this.createNoiseBuffer(.08);const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(600+Math.random()*200,e),i.Q.setValueAtTime(2,e);const r=this.ctx.createGain();r.gain.setValueAtTime(.18,e),r.gain.exponentialRampToValueAtTime(.001,e+.07),t.connect(i),i.connect(r),r.connect(this.masterGain),t.start(e),t.stop(e+.08)}playJump(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(100,e),t.frequency.exponentialRampToValueAtTime(180,e+.09),i.gain.setValueAtTime(.2,e),i.gain.exponentialRampToValueAtTime(.001,e+.09),t.connect(i),i.connect(this.masterGain),t.start(e),t.stop(e+.09)}playLand(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(120,e),t.frequency.exponentialRampToValueAtTime(40,e+.15),i.gain.setValueAtTime(.35,e),i.gain.exponentialRampToValueAtTime(.001,e+.15),t.connect(i),i.connect(this.masterGain),t.start(e),t.stop(e+.15)}playReload(e){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const t=this.ctx.currentTime;if(e==="mag_out"){const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(450,t),i.frequency.exponentialRampToValueAtTime(180,t+.12),r.gain.setValueAtTime(.35,t),r.gain.exponentialRampToValueAtTime(.001,t+.12),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.12)}else if(e==="mag_in"){const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(200,t),i.frequency.exponentialRampToValueAtTime(600,t+.06),i.frequency.exponentialRampToValueAtTime(120,t+.14),r.gain.setValueAtTime(.5,t),r.gain.exponentialRampToValueAtTime(.001,t+.14),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.14)}else if(e==="bolt"){const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sawtooth",i.frequency.setValueAtTime(800,t),i.frequency.exponentialRampToValueAtTime(300,t+.16),r.gain.setValueAtTime(.4,t),r.gain.exponentialRampToValueAtTime(.001,t+.16),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.16)}}playScopeZoom(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(1200,e),t.frequency.exponentialRampToValueAtTime(600,e+.05),i.gain.setValueAtTime(.25,e),i.gain.exponentialRampToValueAtTime(.001,e+.05),t.connect(i),i.connect(this.masterGain),t.start(e),t.stop(e+.05)}playHit(e){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const t=this.ctx.currentTime;if(e){const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(2400,t),i.frequency.exponentialRampToValueAtTime(1600,t+.25),r.gain.setValueAtTime(.8,t),r.gain.exponentialRampToValueAtTime(.001,t+.25),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.25);const s=this.ctx.createOscillator(),o=this.ctx.createGain();s.type="triangle",s.frequency.setValueAtTime(3600,t),o.gain.setValueAtTime(.4,t),o.gain.exponentialRampToValueAtTime(.001,t+.18),s.connect(o),o.connect(this.masterGain),s.start(t),s.stop(t+.18)}else{const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(1e3,t),i.frequency.exponentialRampToValueAtTime(400,t+.06),r.gain.setValueAtTime(.3,t),r.gain.exponentialRampToValueAtTime(.001,t+.06),i.connect(r),r.connect(this.masterGain),i.start(t),i.stop(t+.06)}}playKillSound(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime;[523.25,659.25,783.99].forEach((t,i)=>{if(!this.ctx||!this.masterGain)return;const r=this.ctx.createOscillator(),s=this.ctx.createGain();r.type="sine",r.frequency.setValueAtTime(t,e+i*.03),s.gain.setValueAtTime(.25,e+i*.03),s.gain.exponentialRampToValueAtTime(.001,e+i*.03+.3),r.connect(s),s.connect(this.masterGain),r.start(e+i*.03),r.stop(e+i*.03+.3)})}playC4Beep(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(2800,e),i.gain.setValueAtTime(.65,e),i.gain.exponentialRampToValueAtTime(.001,e+.07),t.connect(i),i.connect(this.masterGain),t.start(e),t.stop(e+.07)}playC4Plant(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime;for(let t=0;t<4;t++){const i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(1400+t*200,e+t*.15),r.gain.setValueAtTime(.25,e+t*.15),r.gain.exponentialRampToValueAtTime(.001,e+t*.15+.08),i.connect(r),r.connect(this.masterGain),i.start(e+t*.15),i.stop(e+t*.15+.08)}}playC4Defuse(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="square",t.frequency.setValueAtTime(1900,e),t.frequency.exponentialRampToValueAtTime(800,e+.06),i.gain.setValueAtTime(.3,e),i.gain.exponentialRampToValueAtTime(.001,e+.06),t.connect(i),i.connect(this.masterGain),t.start(e),t.stop(e+.06)}playC4Explosion(){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(60,e),t.frequency.exponentialRampToValueAtTime(15,e+2.5),i.gain.setValueAtTime(1.5,e),i.gain.exponentialRampToValueAtTime(.001,e+2.5),t.connect(i),i.connect(this.masterGain),t.start(e),t.stop(e+2.5);const r=this.ctx.createBufferSource();r.buffer=this.createNoiseBuffer(3);const s=this.ctx.createBiquadFilter();s.type="lowpass",s.frequency.setValueAtTime(2500,e),s.frequency.exponentialRampToValueAtTime(80,e+2.8);const o=this.ctx.createGain();o.gain.setValueAtTime(1.8,e),o.gain.exponentialRampToValueAtTime(.001,e+3),r.connect(s),s.connect(o),o.connect(this.masterGain),r.start(e),r.stop(e+3)}playRadio(e){if(this.isMuted||(this.init(),!this.ctx||!this.masterGain))return;const t=this.ctx.currentTime,i=this.ctx.createBufferSource();i.buffer=this.createNoiseBuffer(.05);const r=this.ctx.createBiquadFilter();r.type="bandpass",r.frequency.setValueAtTime(2e3,t);const s=this.ctx.createGain();s.gain.setValueAtTime(.2,t),s.gain.exponentialRampToValueAtTime(.001,t+.05),i.connect(r),r.connect(s),s.connect(this.masterGain),i.start(t),i.stop(t+.05);let o=[440,554,659];e==="bomb_planted"?o=[350,440,350,440]:e==="bomb_defused"?o=[440,550,660,880]:e==="t_win"?o=[440,392,349,293]:e==="ct_win"?o=[349,440,523,698]:e==="round_start"&&(o=[523,659]),o.forEach((a,l)=>{if(!this.ctx||!this.masterGain)return;const c=this.ctx.createOscillator(),d=this.ctx.createGain();c.type="triangle",c.frequency.setValueAtTime(a,t+.06+l*.12),d.gain.setValueAtTime(.3,t+.06+l*.12),d.gain.exponentialRampToValueAtTime(.001,t+.06+l*.12+.18),c.connect(d),d.connect(this.masterGain),c.start(t+.06+l*.12),c.stop(t+.06+l*.12+.18)})}}const xt=new PT;class LT{constructor(){ee(this,"group");ee(this,"weaponMeshes",new Map);ee(this,"currentWeaponId","ak47");ee(this,"recoilPitch",0);ee(this,"recoilOffset",0);ee(this,"bobTime",0);ee(this,"swayX",0);ee(this,"swayY",0);ee(this,"reloadProgress",-1);ee(this,"reloadDuration",2);ee(this,"drawProgress",1);ee(this,"muzzleFlashMesh");ee(this,"muzzleFlashLight");ee(this,"muzzleFlashTimer",0);this.group=new nt,this.group.position.set(.24,-.22,-.42);const e=new tr(.18,.18),t=new er({color:16769126,transparent:!0,opacity:0,depthWrite:!1,side:Wn});this.muzzleFlashMesh=new ne(e,t),this.muzzleFlashMesh.visible=!1,this.group.add(this.muzzleFlashMesh),this.muzzleFlashLight=new gv(16755234,0,8),this.group.add(this.muzzleFlashLight),this.buildAK47(),this.buildM4A4(),this.buildAWP(),this.buildGlock(),this.buildUSP(),this.buildDeagle(),this.buildKnife(),this.buildC4(),this.setWeapon("ak47")}createHands(){const e=new nt,t=new Xe({color:2040614,roughness:.85}),i=new Xe({color:2834e3,roughness:.8}),r=new ne(new mn(.045,.05,.35,8),i);r.rotation.x=-Math.PI/3,r.position.set(.12,-.15,.15),e.add(r);const s=new ne(new ae(.06,.06,.1),t);s.position.set(.08,-.05,.02),e.add(s);const o=new ne(new mn(.045,.05,.35,8),i);o.rotation.x=-Math.PI/4,o.rotation.y=.5,o.position.set(-.16,-.18,.12),e.add(o);const a=new ne(new ae(.06,.06,.09),t);return a.position.set(-.06,-.04,-.15),e.add(a),e}buildAK47(){const e=new nt,t=new Xe({color:2369580,roughness:.4,metalness:.8}),i=new Xe({map:vv(),roughness:.65}),r=new ne(new ae(.05,.07,.32),t);e.add(r);const s=new ne(new mn(.012,.012,.28,8),t);s.rotation.x=Math.PI/2,s.position.set(0,.015,-.28),e.add(s);const o=new ne(new mn(.015,.015,.04,8),t);o.rotation.x=Math.PI/2,o.position.set(0,.015,-.43),e.add(o);const a=new ne(new ae(.055,.06,.18),i);a.position.set(0,.01,-.18),e.add(a);const l=new ne(new ae(.04,.09,.22),i);l.position.set(0,-.02,.25),e.add(l);const c=new ne(new ae(.035,.1,.05),i);c.position.set(0,-.08,.08),c.rotation.x=.35,e.add(c);const d=new ne(new ae(.035,.16,.07),t);d.position.set(0,-.1,-.04),d.rotation.x=.25,e.add(d);const f=new ne(new ae(.01,.035,.01),t);f.position.set(0,.045,-.4),e.add(f),e.add(this.createHands()),e.visible=!1,this.group.add(e),this.weaponMeshes.set("ak47",e)}buildM4A4(){const e=new nt,t=new Xe({color:1711650,roughness:.5,metalness:.7}),i=new Xe({color:5918786,roughness:.7}),r=new ne(new ae(.05,.08,.28),t);e.add(r);const s=new ne(new ae(.054,.054,.22),t);s.position.set(0,.01,-.22),e.add(s);const o=new ne(new mn(.012,.012,.22,8),t);o.rotation.x=Math.PI/2,o.position.set(0,.01,-.38),e.add(o);const a=new ne(new ae(.045,.09,.2),i);a.position.set(0,-.01,.22),e.add(a);const l=new ne(new ae(.03,.15,.06),t);l.position.set(0,-.09,-.05),l.rotation.x=.1,e.add(l);const c=new ne(new ae(.025,.035,.16),t);c.position.set(0,.055,.02),e.add(c),e.add(this.createHands()),e.visible=!1,this.group.add(e),this.weaponMeshes.set("m4a4",e)}buildAWP(){const e=new nt,t=new Xe({color:4017720,roughness:.6}),i=new Xe({color:1579549,roughness:.4,metalness:.85}),r=new ne(new ae(.06,.09,.5),t);r.position.set(0,0,0),e.add(r);const s=new ne(new ae(.05,.12,.28),t);s.position.set(0,-.02,.32),e.add(s);const o=new ne(new mn(.016,.018,.45,8),i);o.rotation.x=Math.PI/2,o.position.set(0,.02,-.45),e.add(o);const a=new ne(new ae(.04,.035,.08),i);a.position.set(0,.02,-.7),e.add(a);const l=new ne(new mn(.024,.028,.3,12),i);l.rotation.x=Math.PI/2,l.position.set(0,.08,-.05),e.add(l);const c=new ne(new ae(.02,.03,.03),i);c.position.set(0,.055,.04),e.add(c);const d=new ne(new ae(.02,.03,.03),i);d.position.set(0,.055,-.14),e.add(d);const f=new ne(new mn(.008,.008,.06),i);f.rotation.z=Math.PI/2.5,f.position.set(.04,.04,.08),e.add(f),e.add(this.createHands()),e.visible=!1,this.group.add(e),this.weaponMeshes.set("awp",e)}buildGlock(){const e=new nt,t=new Xe({color:1842721,roughness:.4,metalness:.7}),i=new Xe({color:2764080,roughness:.9}),r=new ne(new ae(.036,.04,.2),t);r.position.set(0,.02,-.05),e.add(r);const s=new ne(new ae(.034,.03,.18),i);s.position.set(0,-.01,-.05),e.add(s);const o=new ne(new ae(.032,.12,.05),i);o.position.set(0,-.07,.02),o.rotation.x=.25,e.add(o),e.add(this.createHands()),e.visible=!1,this.group.add(e),this.weaponMeshes.set("glock",e)}buildUSP(){const e=new nt,t=new Xe({color:3356733,roughness:.35,metalness:.8}),i=new Xe({color:1711134,roughness:.6}),r=new ne(new ae(.036,.042,.22),t);r.position.set(0,.02,-.05),e.add(r);const s=new ne(new ae(.032,.13,.055),i);s.position.set(0,-.07,.03),s.rotation.x=.25,e.add(s);const o=new ne(new mn(.018,.018,.2,12),i);o.rotation.x=Math.PI/2,o.position.set(0,.02,-.25),e.add(o),e.add(this.createHands()),e.visible=!1,this.group.add(e),this.weaponMeshes.set("usp",e)}buildDeagle(){const e=new nt,t=new Xe({color:10068909,roughness:.2,metalness:.9}),i=new Xe({color:1118997,roughness:.95}),r=new ne(new ae(.042,.055,.26),t);r.position.set(0,.025,-.08),e.add(r);const s=new ne(new ae(.038,.14,.065),i);s.position.set(0,-.07,.03),s.rotation.x=.28,e.add(s),e.add(this.createHands()),e.visible=!1,this.group.add(e),this.weaponMeshes.set("deagle",e)}buildKnife(){const e=new nt,t=new Xe({color:11910340,roughness:.15,metalness:.95}),i=new Xe({color:1975336,roughness:.9}),r=new ne(new ae(.03,.04,.14),i);r.position.set(0,-.02,.06),e.add(r);const s=new ne(new ae(.035,.06,.015),i);s.position.set(0,-.01,-.01),e.add(s);const o=new ne(new ae(.008,.045,.2),t);o.position.set(0,.01,-.11),o.rotation.x=-.08,e.add(o),e.add(this.createHands()),e.visible=!1,this.group.add(e),this.weaponMeshes.set("knife",e)}buildC4(){const e=new nt,t=new Xe({map:wT(),roughness:.7}),i=new ne(new ae(.18,.08,.24),t);i.position.set(0,-.02,-.05),e.add(i),e.add(this.createHands()),e.visible=!1,this.group.add(e),this.weaponMeshes.set("c4",e)}setWeapon(e){this.currentWeaponId=e,this.weaponMeshes.forEach((i,r)=>{i.visible=r===e}),this.drawProgress=0,this.reloadProgress=-1;let t=-.45;e==="awp"?t=-.72:e==="glock"||e==="usp"?t=-.32:e==="deagle"&&(t=-.35),this.muzzleFlashMesh.position.set(0,.02,t),this.muzzleFlashLight.position.set(0,.02,t)}triggerRecoil(e=.04){this.recoilPitch=Math.min(.2,this.recoilPitch+e),this.recoilOffset=Math.min(.08,this.recoilOffset+e*.7),this.muzzleFlashMesh.visible=!0,this.muzzleFlashMesh.material.opacity=.9,this.muzzleFlashMesh.rotation.z=Math.random()*Math.PI*2,this.muzzleFlashLight.intensity=3,this.muzzleFlashTimer=.06}triggerReload(e){this.reloadDuration=e,this.reloadProgress=0}addMouseSway(e,t){this.swayX+=e*8e-4,this.swayY+=t*8e-4,this.swayX=Yt.clamp(this.swayX,-.06,.06),this.swayY=Yt.clamp(this.swayY,-.06,.06)}update(e,t,i,r=!1){if(r&&this.currentWeaponId==="awp"){this.group.visible=!1;return}else this.group.visible=!0;this.muzzleFlashTimer>0&&(this.muzzleFlashTimer-=e,this.muzzleFlashTimer<=0&&(this.muzzleFlashMesh.visible=!1,this.muzzleFlashLight.intensity=0)),this.recoilPitch=Yt.lerp(this.recoilPitch,0,e*12),this.recoilOffset=Yt.lerp(this.recoilOffset,0,e*12),this.swayX=Yt.lerp(this.swayX,0,e*8),this.swayY=Yt.lerp(this.swayY,0,e*8);let s=0,o=0;t?(this.bobTime+=e*i*3.8,s=Math.cos(this.bobTime)*.015,o=Math.abs(Math.sin(this.bobTime))*.018):(this.bobTime+=e*1.5,o=Math.sin(this.bobTime)*.003),this.drawProgress<1&&(this.drawProgress=Math.min(1,this.drawProgress+e*3.5));const a=(1-this.drawProgress)*-.3;let l=0,c=0,d=0;if(this.reloadProgress>=0)if(this.reloadProgress+=e/this.reloadDuration,this.reloadProgress>=1)this.reloadProgress=-1;else{const g=this.reloadProgress;l=Math.sin(g*Math.PI)*.4,c=Math.sin(g*Math.PI)*-.3,d=-Math.sin(g*Math.PI)*.08}this.group.position.set(.24-this.swayX+s,-.22-this.swayY+o+a+d,-.42+this.recoilOffset),this.group.rotation.set(this.recoilPitch+this.swayY*1.5+l,-this.swayX*1.5,c)}}class DT{constructor(e,t,i="CT"){ee(this,"map");ee(this,"collision");ee(this,"botAI");ee(this,"particles");ee(this,"viewmodel");ee(this,"scene");ee(this,"camera");ee(this,"players",[]);ee(this,"playerTeam","CT");ee(this,"playerEntity",null);ee(this,"spectatingBot",null);ee(this,"round",1);ee(this,"scoreCT",0);ee(this,"scoreT",0);ee(this,"roundPhase","FREEZE");ee(this,"roundTimeLeft",115);ee(this,"freezeTimeLeft",5);ee(this,"endRoundTimer",0);ee(this,"winner",null);ee(this,"winReason","");ee(this,"isPistolRound",!0);ee(this,"c4Mesh",null);ee(this,"c4Light",null);ee(this,"c4IsPlanted",!1);ee(this,"c4IsDropped",!1);ee(this,"c4CarrierId",null);ee(this,"c4Position",null);ee(this,"c4PlantedSite",null);ee(this,"c4FuseTimeLeft",40);ee(this,"c4BeepTimer",1);ee(this,"plantProgress",0);ee(this,"defuseProgress",0);ee(this,"isPlayerPlanting",!1);ee(this,"isPlayerDefusing",!1);ee(this,"killFeed",[]);ee(this,"playerPitch",0);ee(this,"playerYaw",0);ee(this,"isScoped",!1);ee(this,"recoilOffsetPitch",0);ee(this,"recoilOffsetYaw",0);ee(this,"fireCooldown",0);ee(this,"isReloading",!1);ee(this,"reloadTimer",0);ee(this,"keys",{});ee(this,"mouseButtons",{});this.scene=e,this.camera=t,this.playerTeam=i,this.map=new AT,this.scene.add(this.map.scene),this.collision=new RT(this.map),this.botAI=new CT(this.map,this.collision),this.particles=new bT,this.scene.add(this.particles.scene),this.viewmodel=new LT,this.camera.add(this.viewmodel.group),this.scene.add(this.camera),this.createC4Mesh(),this.initMatch()}createC4Mesh(){this.c4Mesh=new nt;const e=new ae(.5,.25,.4),t=new Xe({color:10057557,roughness:.8}),i=new ne(e,t);i.castShadow=!0,this.c4Mesh.add(i),this.c4Light=new gv(16711680,0,4),this.c4Light.position.set(0,.2,0),this.c4Mesh.add(this.c4Light),this.c4Mesh.visible=!1,this.scene.add(this.c4Mesh)}initMatch(){this.round=1,this.scoreCT=0,this.scoreT=0,this.isPistolRound=!0,this.setupRoster(),this.startRound()}setupRoster(){this.players.forEach(i=>{this.scene.remove(i.character.group)}),this.players=[];const e=["Alpha","Bravo","Charlie","Delta","Echo"],t=["Phoenix","Leet","Guerilla","Anarchist","Balkan"];for(let i=0;i<5;i++){const r=this.playerTeam==="CT"&&i===0,s=new Mm("CT");this.scene.add(s.group);const o={id:`ct_${i}`,name:r?"You (CT)":`CT ${e[i]}`,team:"CT",isPlayer:r,character:s,position:this.map.spawnCT[i].clone(),velocity:new L,rotationY:Math.PI,pitch:0,health:100,armor:100,hasHelmet:!this.isPistolRound,hasDefuseKit:!this.isPistolRound&&i%2===0,hasC4:!1,money:this.isPistolRound?800:3500,kills:0,deaths:0,assists:0,damageDealt:0,score:0,primaryWeapon:this.isPistolRound?null:"m4a4",secondaryWeapon:"usp",currentWeapon:this.isPistolRound?"usp":"m4a4",ammo:{ak47:{clip:30,reserve:90},m4a4:{clip:30,reserve:90},awp:{clip:5,reserve:30},glock:{clip:20,reserve:120},usp:{clip:12,reserve:24},deagle:{clip:7,reserve:35},knife:{clip:1,reserve:0},c4:{clip:1,reserve:0}},state:"PATROL",targetWaypointId:null,path:[],targetEnemy:null,reactionTimer:.3,fireCooldown:0,burstCount:0,burstPauseTimer:0,strafeDir:1,strafeTimer:1,plantDefuseTimer:0};r&&(this.playerEntity=o),this.players.push(o)}for(let i=0;i<5;i++){const r=this.playerTeam==="T"&&i===0,s=new Mm("T");this.scene.add(s.group);const o={id:`t_${i}`,name:r?"You (T)":`T ${t[i]}`,team:"T",isPlayer:r,character:s,position:this.map.spawnT[i].clone(),velocity:new L,rotationY:0,pitch:0,health:100,armor:100,hasHelmet:!this.isPistolRound,hasDefuseKit:!1,hasC4:!1,money:this.isPistolRound?800:3500,kills:0,deaths:0,assists:0,damageDealt:0,score:0,primaryWeapon:this.isPistolRound?null:"ak47",secondaryWeapon:"glock",currentWeapon:this.isPistolRound?"glock":"ak47",ammo:{ak47:{clip:30,reserve:90},m4a4:{clip:30,reserve:90},awp:{clip:5,reserve:30},glock:{clip:20,reserve:120},usp:{clip:12,reserve:24},deagle:{clip:7,reserve:35},knife:{clip:1,reserve:0},c4:{clip:1,reserve:0}},state:"PATROL",targetWaypointId:null,path:[],targetEnemy:null,reactionTimer:.3,fireCooldown:0,burstCount:0,burstPauseTimer:0,strafeDir:1,strafeTimer:1,plantDefuseTimer:0};r&&(this.playerEntity=o),this.players.push(o)}}startRound(){this.roundPhase="FREEZE",this.freezeTimeLeft=4,this.roundTimeLeft=115,this.winner=null,this.winReason="",this.c4IsPlanted=!1,this.c4IsDropped=!1,this.c4Position=null,this.c4PlantedSite=null,this.c4FuseTimeLeft=40,this.c4BeepTimer=1,this.plantProgress=0,this.defuseProgress=0,this.isPlayerPlanting=!1,this.isPlayerDefusing=!1,this.c4Mesh&&(this.c4Mesh.visible=!1);let e=0,t=0;const i=this.players.filter(s=>s.team==="T");this.players.forEach(s=>{s.health=100,s.armor=100,s.hasC4=!1,s.character.isDead=!1,s.character.group.visible=!0,s.character.group.rotation.set(0,0,0),s.state="PATROL",s.path=[],s.targetEnemy=null,s.plantDefuseTimer=0,Object.keys(s.ammo).forEach(o=>{const a=o;s.ammo[a].clip=An[a].magazineSize,s.ammo[a].reserve=An[a].maxReserveAmmo}),s.team==="CT"?(s.position.copy(this.map.spawnCT[e%this.map.spawnCT.length]),s.rotationY=Math.PI,e++):(s.position.copy(this.map.spawnT[t%this.map.spawnT.length]),s.rotationY=0,t++),s.velocity.set(0,0,0)});const r=this.playerTeam==="T"&&this.playerEntity?this.playerEntity:i[Math.floor(Math.random()*i.length)];r.hasC4=!0,this.c4CarrierId=r.id,this.playerEntity&&(this.viewmodel.setWeapon(this.playerEntity.currentWeapon),this.playerYaw=this.playerEntity.rotationY,this.playerPitch=0),xt.playRadio("round_start")}endRound(e,t){this.roundPhase!=="ENDED"&&(this.roundPhase="ENDED",this.winner=e,this.winReason=t,this.endRoundTimer=6,e==="CT"?(this.scoreCT++,xt.playRadio("ct_win")):(this.scoreT++,xt.playRadio("t_win")),this.players.forEach(i=>{i.team===e?i.money=Math.min(16e3,i.money+3250):i.money=Math.min(16e3,i.money+1900)}),this.isPistolRound=!1)}buyWeapon(e){if(!this.playerEntity||this.roundPhase!=="FREEZE")return!1;const t=An[e];return this.playerEntity.money<t.price||t.teamExclusive&&t.teamExclusive!==this.playerEntity.team?!1:(this.playerEntity.money-=t.price,t.slot==="primary"?(this.playerEntity.primaryWeapon=e,this.playerEntity.currentWeapon=e):t.slot==="secondary"&&(this.playerEntity.secondaryWeapon=e,this.playerEntity.currentWeapon=e),this.viewmodel.setWeapon(e),!0)}buyEquipment(e){return!this.playerEntity||this.roundPhase!=="FREEZE"?!1:e==="armor"&&this.playerEntity.money>=650?(this.playerEntity.money-=650,this.playerEntity.armor=100,!0):e==="helmet"&&this.playerEntity.money>=1e3?(this.playerEntity.money-=1e3,this.playerEntity.armor=100,this.playerEntity.hasHelmet=!0,!0):e==="kit"&&this.playerEntity.team==="CT"&&this.playerEntity.money>=400?(this.playerEntity.money-=400,this.playerEntity.hasDefuseKit=!0,!0):!1}switchWeaponSlot(e){!this.playerEntity||this.playerEntity.health<=0||(e==="primary"&&this.playerEntity.primaryWeapon?(this.playerEntity.currentWeapon=this.playerEntity.primaryWeapon,this.viewmodel.setWeapon(this.playerEntity.primaryWeapon),this.isScoped=!1):e==="secondary"?(this.playerEntity.currentWeapon=this.playerEntity.secondaryWeapon,this.viewmodel.setWeapon(this.playerEntity.secondaryWeapon),this.isScoped=!1):e==="melee"?(this.playerEntity.currentWeapon="knife",this.viewmodel.setWeapon("knife"),this.isScoped=!1):e==="bomb"&&this.playerEntity.hasC4&&(this.playerEntity.currentWeapon="c4",this.viewmodel.setWeapon("c4"),this.isScoped=!1))}reloadPlayer(){if(!this.playerEntity||this.playerEntity.health<=0||this.isReloading)return;const e=this.playerEntity.currentWeapon,t=An[e],i=this.playerEntity.ammo[e];i.clip<t.magazineSize&&i.reserve>0&&(this.isReloading=!0,this.reloadTimer=t.reloadTime,this.viewmodel.triggerReload(t.reloadTime),xt.playReload("mag_out"),setTimeout(()=>xt.playReload("mag_in"),t.reloadTime*450),setTimeout(()=>xt.playReload("bolt"),t.reloadTime*850))}handlePlayerFire(){if(!this.playerEntity||this.playerEntity.health<=0||this.roundPhase==="FREEZE"||this.isReloading||this.fireCooldown>0)return;const e=this.playerEntity.currentWeapon,t=An[e],i=this.playerEntity.ammo[e];if(e==="knife"){this.fireCooldown=t.fireRate,xt.playKnifeSlash(),this.performKnifeAttack();return}if(e!=="c4"){if(i.clip<=0){this.reloadPlayer();return}i.clip--,this.fireCooldown=t.fireRate,this.viewmodel.triggerRecoil(t.recoilClimb),xt.playGunshot(e),this.recoilOffsetPitch+=t.recoilClimb,this.recoilOffsetYaw+=(Math.random()-.5)*t.recoilSpread,this.performBulletShot(this.playerEntity,e,!0)}}performKnifeAttack(){if(!this.playerEntity)return;const e=this.camera.position.clone(),t=new L;this.camera.getWorldDirection(t);const i=new Br(e,t),r=this.players.filter(a=>a.team!==this.playerEntity.team&&a.health>0);let s=null,o=2.5;for(const a of r){const l=a.character.testHitboxes(i);l&&l.distance<o&&(o=l.distance,s=a)}s&&(xt.playKnifeHit(!0),this.applyDamage(s,this.playerEntity,55,"knife",!1),this.particles.addBloodSpurt(s.position.clone().add(new L(0,1.2,0)),!1))}performBulletShot(e,t,i){const r=An[t],s=i?this.camera.position.clone():e.position.clone().add(new L(0,1.5,0)),o=new L;if(i){this.camera.getWorldDirection(o);const _=(Math.hypot(e.velocity.x,e.velocity.z)>.5?r.spreadMovingPenalty:0)+this.recoilOffsetPitch*.4;o.x+=(Math.random()-.5)*_,o.y+=(Math.random()-.5)*_,o.z+=(Math.random()-.5)*_,o.normalize()}else o.set(Math.sin(e.rotationY),Math.sin(e.pitch),Math.cos(e.rotationY)).normalize();const a=new Br(s,o),l=this.collision.raycastMap(s,o,120),c=this.players.filter(g=>g.team!==e.team&&g.health>0);let d=null,f=null,h=l.hit?l.distance:120;for(const g of c){const _=g.character.testHitboxes(a);_&&_.distance<h&&(h=_.distance,d=g,f={dist:_.distance,mult:_.multiplier,zone:_.zone,point:_.point})}const p=f?f.point:l.hit?l.point:s.clone().add(o.clone().multiplyScalar(60));if(this.particles.addBulletTracer(s,p),d&&f){const g=f.zone==="head";let _=r.damage*f.mult;if(d.armor>0&&f.zone!=="leg_left"&&f.zone!=="leg_right"){const m=1-r.armorPenetration,u=_*m;d.armor=Math.max(0,d.armor-u*.5),_-=u*.5}i&&xt.playHit(g),this.particles.addBloodSpurt(f.point,g,o),this.applyDamage(d,e,Math.round(_),t,g)}else l.hit&&this.particles.addImpactSparks(l.point,l.normal)}applyDamage(e,t,i,r,s){if(e.health-=i,t.damageDealt+=i,e.health<=0){e.health=0,e.deaths++,t.kills++,t.score+=s?3:2,t.money=Math.min(16e3,t.money+An[r].killReward),e.character.triggerDeath(),e.hasC4&&(e.hasC4=!1,this.c4IsDropped=!0,this.c4Position=e.position.clone(),this.c4Mesh&&(this.c4Mesh.position.copy(this.c4Position),this.c4Mesh.visible=!0));const o={id:`${Date.now()}_${Math.random()}`,killerName:t.name,killerTeam:t.team,victimName:e.name,victimTeam:e.team,weapon:r,isHeadshot:s,timestamp:Date.now()};this.killFeed.unshift(o),this.killFeed.length>6&&this.killFeed.pop(),t.isPlayer&&xt.playKillSound(),this.checkRoundWinConditions()}}checkRoundWinConditions(){if(this.roundPhase==="ENDED")return;const e=this.players.filter(i=>i.team==="CT"&&i.health>0).length;this.players.filter(i=>i.team==="T"&&i.health>0).length===0&&!this.c4IsPlanted?this.endRound("CT","TERRORISTS ELIMINATED"):e===0&&!this.c4IsPlanted?this.endRound("T","COUNTER-TERRORISTS ELIMINATED"):e===0&&this.c4IsPlanted}takeOverBot(e){const t=this.players.find(i=>i.id===e&&i.health>0&&i.team===this.playerTeam);t&&(this.playerEntity&&(this.playerEntity.isPlayer=!1),t.isPlayer=!0,this.playerEntity=t,this.spectatingBot=null,this.viewmodel.setWeapon(t.currentWeapon),this.playerYaw=t.rotationY,this.playerPitch=0)}update(e){if(this.particles.update(e),this.roundPhase==="FREEZE"?(this.freezeTimeLeft-=e,this.freezeTimeLeft<=0&&(this.roundPhase="LIVE")):this.roundPhase==="LIVE"?this.c4IsPlanted||(this.roundTimeLeft-=e,this.roundTimeLeft<=0&&this.endRound("CT","TIME EXPIRED")):this.roundPhase==="ENDED"&&(this.endRoundTimer-=e,this.endRoundTimer<=0&&(this.round++,this.startRound())),this.c4IsPlanted){this.c4FuseTimeLeft-=e;const i=Math.max(.12,this.c4FuseTimeLeft/40*.9+.1);this.c4BeepTimer-=e,this.c4BeepTimer<=0&&(this.c4BeepTimer=i,xt.playC4Beep(),this.c4Light&&(this.c4Light.intensity=4,setTimeout(()=>{this.c4Light&&(this.c4Light.intensity=0)},80))),this.c4FuseTimeLeft<=0&&(this.c4IsPlanted=!1,this.c4Position&&(this.particles.addC4Explosion(this.c4Position),xt.playC4Explosion(),this.players.forEach(r=>{r.health>0&&this.c4Position&&r.position.distanceTo(this.c4Position)<28&&(r.health=0,r.character.triggerDeath())})),this.endRound("T","TARGET DESTROYED"))}this.updateHumanPlayer(e);const t={isPlanted:this.c4IsPlanted,position:this.c4Position,plantedSite:this.c4PlantedSite};if(this.players.forEach(i=>{this.botAI.updateBot(i,this.players,t,e,(r,s)=>{this.performBulletShot(r,r.currentWeapon,!1)},r=>{},r=>{this.c4IsPlanted=!0,this.c4Position=r.position.clone(),this.c4PlantedSite=this.map.plantZones[0].site,this.c4Mesh&&(this.c4Mesh.position.copy(this.c4Position),this.c4Mesh.visible=!0),xt.playRadio("bomb_planted")},r=>{},r=>{this.c4IsPlanted=!1,xt.playRadio("bomb_defused"),this.endRound("CT","BOMB DEFUSED")})}),this.c4IsDropped&&this.c4Position){const i=this.players.filter(r=>r.team==="T"&&r.health>0);for(const r of i)if(r.position.distanceTo(this.c4Position)<2){r.hasC4=!0,this.c4IsDropped=!1,this.c4Position=null,this.c4Mesh&&(this.c4Mesh.visible=!1);break}}}updateHumanPlayer(e){if(!this.playerEntity)return;if(this.playerEntity.health<=0){const d=this.players.filter(f=>f.team===this.playerTeam&&f.health>0);if(d.length>0){(!this.spectatingBot||this.spectatingBot.health<=0)&&(this.spectatingBot=d[0]);const f=this.spectatingBot.position.clone().add(new L(0,1.8,0));this.camera.position.lerp(f,e*8),this.camera.rotation.set(0,this.spectatingBot.rotationY,0)}return}if(this.fireCooldown>0&&(this.fireCooldown-=e),this.isReloading&&(this.reloadTimer-=e,this.reloadTimer<=0)){this.isReloading=!1;const d=this.playerEntity.currentWeapon,f=An[d],h=this.playerEntity.ammo[d],p=f.magazineSize-h.clip,g=Math.min(p,h.reserve);h.clip+=g,h.reserve-=g}this.recoilOffsetPitch=Yt.lerp(this.recoilOffsetPitch,0,e*5),this.recoilOffsetYaw=Yt.lerp(this.recoilOffsetYaw,0,e*5);const t=An[this.playerEntity.currentWeapon];this.mouseButtons[0]&&t.isAutomatic&&this.handlePlayerFire();const i=new L;this.keys.KeyW&&(i.z-=1),this.keys.KeyS&&(i.z+=1),this.keys.KeyA&&(i.x-=1),this.keys.KeyD&&(i.x+=1);let r=5.2;if(this.keys.ShiftLeft&&(r=2.6),this.keys.ControlLeft&&(r=2.2),i.length()>0){i.normalize();const d=Math.sin(this.playerYaw),f=Math.cos(this.playerYaw);this.playerEntity.velocity.x=(i.x*f+i.z*d)*r,this.playerEntity.velocity.z=(-i.x*d+i.z*f)*r,Math.random()<e*2.8&&!this.keys.ShiftLeft&&xt.playFootstep()}this.keys.Space&&this.playerEntity.position.y<=.1&&(this.playerEntity.velocity.y=7,xt.playJump());const s=this.collision.moveEntity(this.playerEntity.position,this.playerEntity.velocity,e,.35,1.8);this.playerEntity.position.copy(s.pos),this.playerEntity.velocity.copy(s.velocity),this.playerEntity.rotationY=this.playerYaw;const a=1.65+(this.keys.ControlLeft?-.4:0);this.camera.position.set(this.playerEntity.position.x,this.playerEntity.position.y+a,this.playerEntity.position.z),this.camera.rotation.order="YXZ",this.camera.rotation.y=this.playerYaw+this.recoilOffsetYaw,this.camera.rotation.x=Yt.clamp(this.playerPitch+this.recoilOffsetPitch,-Math.PI/2.2,Math.PI/2.2),this.particles.screenShake>0&&(this.camera.position.x+=(Math.random()-.5)*this.particles.screenShake*.4,this.camera.position.y+=(Math.random()-.5)*this.particles.screenShake*.4);const l=Math.hypot(this.playerEntity.velocity.x,this.playerEntity.velocity.z)>.4,c=Math.hypot(this.playerEntity.velocity.x,this.playerEntity.velocity.z);this.viewmodel.update(e,l,c,this.isScoped),this.handleBombKeyHold(e)}handleBombKeyHold(e){if(this.playerEntity)if(this.keys.KeyE){if(this.playerEntity.team==="T"&&this.playerEntity.hasC4&&!this.c4IsPlanted)this.map.plantZones.some(i=>this.playerEntity.position.x>=i.min.x&&this.playerEntity.position.x<=i.max.x&&this.playerEntity.position.z>=i.min.z&&this.playerEntity.position.z<=i.max.z)&&(this.isPlayerPlanting=!0,this.plantProgress=Math.min(1,this.plantProgress+e/3.2),this.plantProgress>=1&&(this.c4IsPlanted=!0,this.playerEntity.hasC4=!1,this.c4Position=this.playerEntity.position.clone(),this.c4PlantedSite=this.map.plantZones[0].site,this.c4Mesh&&(this.c4Mesh.position.copy(this.c4Position),this.c4Mesh.visible=!0),xt.playRadio("bomb_planted"),this.isPlayerPlanting=!1,this.plantProgress=0));else if(this.playerEntity.team==="CT"&&this.c4IsPlanted&&this.c4Position&&this.playerEntity.position.distanceTo(this.c4Position)<2.5){this.isPlayerDefusing=!0;const i=this.playerEntity.hasDefuseKit?5:10;this.defuseProgress=Math.min(1,this.defuseProgress+e/i),this.defuseProgress>=1&&(this.c4IsPlanted=!1,xt.playRadio("bomb_defused"),this.endRound("CT","BOMB DEFUSED"),this.isPlayerDefusing=!1,this.defuseProgress=0)}}else this.isPlayerPlanting=!1,this.plantProgress=0,this.isPlayerDefusing=!1,this.defuseProgress=0}getGameState(){return{round:this.round,scoreCT:this.scoreCT,scoreT:this.scoreT,roundPhase:this.roundPhase,roundTimeLeft:this.roundTimeLeft,winner:this.winner,winReason:this.winReason,isPistolRound:this.isPistolRound,playerEntity:this.playerEntity,c4:{isPlanted:this.c4IsPlanted,isDropped:this.c4IsDropped,carrierId:this.c4CarrierId,position:this.c4Position,plantedSite:this.c4PlantedSite,fuseTimeLeft:this.c4FuseTimeLeft,plantProgress:this.plantProgress,defuseProgress:this.defuseProgress},spectatingBot:this.spectatingBot,killFeed:[...this.killFeed]}}}const NT=({players:n,playerEntity:e,c4:t})=>{const i=Tt.useRef(null);return Tt.useEffect(()=>{const r=i.current;if(!r)return;const s=r.getContext("2d");if(!s)return;const o=r.width,a=r.height,l=(p,g)=>{const m=o-30,u=a-15*2,v=(p- -55)/115,x=(g- -55)/115;return{x:15+v*m,y:15+x*u}};s.clearRect(0,0,o,a),s.fillStyle="rgba(12, 18, 24, 0.85)",s.beginPath(),s.arc(o/2,a/2,o/2-2,0,Math.PI*2),s.fill(),s.strokeStyle="rgba(70, 100, 120, 0.6)",s.lineWidth=2,s.stroke(),s.strokeStyle="rgba(255, 255, 255, 0.05)",s.lineWidth=1,[.25,.5,.75].forEach(p=>{s.beginPath(),s.arc(o/2,a/2,(o/2-2)*p,0,Math.PI*2),s.stroke()}),s.save(),s.lineWidth=4,s.strokeStyle="rgba(180, 160, 130, 0.5)",s.fillStyle="rgba(150, 130, 100, 0.18)";const c=(p,g=!0)=>{s.beginPath();const _=l(p[0][0],p[0][1]);s.moveTo(_.x,_.y);for(let m=1;m<p.length;m++){const u=l(p[m][0],p[m][1]);s.lineTo(u.x,u.y)}s.closePath(),g&&s.fill(),s.stroke()};c([[-30,38],[10,38],[10,56],[-30,56]]),c([[32,40],[42,40],[42,20],[32,20]]),c([[36,20],[54,20],[54,-10],[36,-10]]),c([[34,-10],[44,-10],[34,-22],[24,-22]]),c([[16,-18],[36,-18],[36,-36],[16,-36]]),c([[8,16],[14,16],[14,-14],[8,-14]]),c([[14,-10],[24,-10],[24,-18],[14,-18]]),c([[-8,30],[8,30],[8,-15],[-8,-15]]),c([[-18,18],[-8,18],[-26,4],[-36,4]]),c([[-45,18],[-32,18],[-32,-16],[-45,-16]]),c([[-48,-16],[-18,-16],[-18,-44],[-48,-44]]),c([[-5,-36],[22,-36],[22,-48],[-5,-48]]),s.restore();const d=l(25,-27),f=l(-30,-30);s.save(),s.font='bold 14px "Rajdhani", sans-serif',s.textAlign="center",s.textBaseline="middle",s.fillStyle="#ff4433",s.beginPath(),s.arc(d.x,d.y,9,0,Math.PI*2),s.fill(),s.fillStyle="#ffffff",s.fillText("A",d.x,d.y+1),s.fillStyle="#ff4433",s.beginPath(),s.arc(f.x,f.y,9,0,Math.PI*2),s.fill(),s.fillStyle="#ffffff",s.fillText("B",f.x,f.y+1),s.restore();const h=e?e.team:"CT";if(n.forEach(p=>{if(p.health<=0)return;const g=l(p.position.x,p.position.z),_=e&&p.id===e.id,m=p.team===h;if(_){s.save(),s.fillStyle="rgba(255, 220, 50, 0.25)",s.beginPath(),s.moveTo(g.x,g.y);const u=p.rotationY-Math.PI/2;s.arc(g.x,g.y,28,u-.5,u+.5),s.closePath(),s.fill(),s.fillStyle="#ffe033",s.strokeStyle="#000000",s.lineWidth=1.5,s.beginPath(),s.arc(g.x,g.y,5,0,Math.PI*2),s.fill(),s.stroke(),s.restore()}else m?(s.fillStyle=p.team==="CT"?"#44aaff":"#ffaa33",s.strokeStyle="#000",s.lineWidth=1,s.beginPath(),s.arc(g.x,g.y,4,0,Math.PI*2),s.fill(),s.stroke()):(s.fillStyle="#ff2222",s.strokeStyle="#fff",s.lineWidth=1,s.beginPath(),s.arc(g.x,g.y,4,0,Math.PI*2),s.fill(),s.stroke())}),t.position){const p=l(t.position.x,t.position.z);s.save();const g=(Math.sin(Date.now()*.008)+1)/2;s.fillStyle=t.isPlanted?`rgba(255, 0, 0, ${.6+g*.4})`:"#ff9900",s.beginPath(),s.arc(p.x,p.y,6+g*2,0,Math.PI*2),s.fill(),s.strokeStyle="#ffffff",s.lineWidth=1.5,s.stroke(),s.fillStyle="#ffffff",s.font="bold 9px monospace",s.textAlign="center",s.textBaseline="middle",s.fillText("C4",p.x,p.y),s.restore()}},[n,e,t]),b.jsxs("div",{className:"relative rounded-full overflow-hidden border-2 border-slate-700/80 shadow-2xl shadow-black/80 bg-slate-950/80 backdrop-blur-sm pointer-events-none",children:[b.jsx("canvas",{ref:i,width:200,height:200,className:"w-[180px] h-[180px] md:w-[200px] md:h-[200px]"}),b.jsx("div",{className:"absolute top-2 left-2 text-[10px] tracking-widest font-mono text-slate-400 uppercase",children:"DUST II"})]})},IT=({entries:n})=>b.jsx("div",{className:"absolute top-4 right-4 flex flex-col gap-1.5 pointer-events-none z-30 max-w-sm",children:n.map(e=>{const t=e.killerTeam==="CT",i=e.victimTeam==="CT",r=e.weapon.toUpperCase();return b.jsxs("div",{className:"flex items-center gap-2 px-3 py-1.5 rounded bg-black/75 border border-slate-700/60 backdrop-blur-md text-xs font-semibold tracking-wider text-slate-200 animate-fadeIn",children:[b.jsx("span",{className:t?"text-sky-400 font-bold":"text-amber-400 font-bold",children:e.killerName}),b.jsx("span",{className:"px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono",children:r}),e.isHeadshot&&b.jsx("span",{className:"text-red-500 font-bold text-xs",title:"Headshot",children:"🎯"}),b.jsx("span",{className:i?"text-sky-400 font-bold":"text-amber-400 font-bold",children:e.victimName})]},e.id)})}),UT=({players:n,playerEntity:e,scoreCT:t,scoreT:i,round:r})=>{const s=n.filter(l=>l.team==="CT"),o=n.filter(l=>l.team==="T"),a=(l,c)=>{const d=c==="CT";return b.jsxs("div",{className:"flex flex-col gap-1",children:[b.jsxs("div",{className:`flex items-center px-4 py-2 rounded text-xs font-bold uppercase tracking-wider ${d?"bg-sky-950/80 text-sky-300 border-l-4 border-sky-500":"bg-amber-950/80 text-amber-300 border-l-4 border-amber-500"}`,children:[b.jsx("div",{className:"w-48 font-bold",children:d?"Counter-Terrorists":"Terrorists"}),b.jsx("div",{className:"w-16 text-center",children:"Status"}),b.jsx("div",{className:"w-16 text-center",children:"K"}),b.jsx("div",{className:"w-16 text-center",children:"A"}),b.jsx("div",{className:"w-16 text-center",children:"D"}),b.jsx("div",{className:"w-20 text-center",children:"Money"}),b.jsx("div",{className:"w-16 text-center",children:"Score"})]}),l.map(f=>{const h=e&&f.id===e.id,p=f.health>0;return b.jsxs("div",{className:`flex items-center px-4 py-2.5 rounded text-sm font-medium transition-colors ${h?"bg-slate-800/90 text-white border border-amber-400/60 shadow-lg shadow-black/50":"bg-black/60 text-slate-300 hover:bg-slate-900/60"}`,children:[b.jsxs("div",{className:"w-48 flex items-center gap-2",children:[b.jsx("span",{className:`font-semibold ${d?"text-sky-300":"text-amber-300"}`,children:f.name}),f.hasC4&&b.jsx("span",{className:"text-xs px-1 rounded bg-red-800 text-white font-mono",children:"C4"}),f.hasDefuseKit&&b.jsx("span",{className:"text-xs px-1 rounded bg-blue-800 text-white font-mono",children:"KIT"})]}),b.jsx("div",{className:"w-16 text-center text-xs",children:p?b.jsxs("span",{className:"text-emerald-400 font-bold",children:[f.health," HP"]}):b.jsx("span",{className:"text-red-500/80 font-bold",children:"DEAD"})}),b.jsx("div",{className:"w-16 text-center font-mono font-bold text-slate-100",children:f.kills}),b.jsx("div",{className:"w-16 text-center font-mono text-slate-400",children:f.assists}),b.jsx("div",{className:"w-16 text-center font-mono text-slate-400",children:f.deaths}),b.jsxs("div",{className:"w-20 text-center font-mono text-emerald-400 font-semibold",children:["$",f.money]}),b.jsx("div",{className:"w-16 text-center font-mono font-bold text-amber-300",children:f.score})]},f.id)})]})};return b.jsx("div",{className:"fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 pointer-events-none animate-fadeIn",children:b.jsxs("div",{className:"w-full max-w-4xl p-6 rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl shadow-black flex flex-col gap-6",children:[b.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-4",children:[b.jsxs("div",{className:"flex items-center gap-3",children:[b.jsx("span",{className:"text-2xl font-black tracking-widest text-slate-100 font-sans",children:"DUST II"}),b.jsx("span",{className:"px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-slate-400",children:"Competitive 5v5"}),b.jsx("span",{className:"px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-emerald-400",children:"128 Tick"})]}),b.jsxs("div",{className:"flex items-center gap-6",children:[b.jsxs("div",{className:"flex items-center gap-2 text-sky-400 font-black text-3xl font-mono",children:[b.jsx("span",{children:"CT"}),b.jsx("span",{children:t})]}),b.jsx("div",{className:"text-slate-500 font-mono text-xl font-bold",children:":"}),b.jsxs("div",{className:"flex items-center gap-2 text-amber-400 font-black text-3xl font-mono",children:[b.jsx("span",{children:i}),b.jsx("span",{children:"T"})]})]}),b.jsxs("div",{className:"text-right",children:[b.jsxs("div",{className:"text-xs text-slate-400 font-mono uppercase tracking-wider",children:["Round ",r]}),b.jsx("div",{className:"text-xs text-slate-500 font-mono",children:"MR12 Match"})]})]}),a(s,"CT"),a(o,"T")]})})},FT=({playerEntity:n,onBuyWeapon:e,onBuyEquipment:t,onClose:i})=>{if(!n)return null;const r=n.money,s=n.team==="CT",o=[{id:"ak47",category:"Rifles"},{id:"m4a4",category:"Rifles"},{id:"awp",category:"Snipers"},{id:"deagle",category:"Pistols"},{id:"glock",category:"Pistols"},{id:"usp",category:"Pistols"}];return b.jsx("div",{className:"fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4",children:b.jsxs("div",{className:"w-full max-w-3xl rounded-xl bg-slate-950/95 border border-slate-700/80 shadow-2xl p-6 flex flex-col gap-6",children:[b.jsxs("div",{className:"flex items-center justify-between border-b border-slate-800 pb-4",children:[b.jsxs("div",{children:[b.jsx("h2",{className:"text-xl font-black text-slate-100 tracking-wider font-sans",children:"BUY MENU"}),b.jsx("p",{className:"text-xs text-slate-400 font-mono",children:"Select weapons and tactical gear for this round"})]}),b.jsxs("div",{className:"flex items-center gap-4",children:[b.jsxs("div",{className:"text-right",children:[b.jsx("span",{className:"text-xs text-slate-400 font-mono",children:"CURRENT FUNDS"}),b.jsxs("div",{className:"text-2xl font-black text-emerald-400 font-mono",children:["$",r]})]}),b.jsx("button",{onClick:i,className:"px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors",children:"ESC / CLOSE"})]})]}),b.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[b.jsxs("div",{className:"flex flex-col gap-3",children:[b.jsx("h3",{className:"text-xs font-bold text-amber-400 uppercase tracking-wider font-mono",children:"Firearms"}),b.jsx("div",{className:"flex flex-col gap-2",children:o.map(({id:a,category:l})=>{const c=An[a],d=r>=c.price,f=!c.teamExclusive||c.teamExclusive===n.team,h=n.primaryWeapon===a||n.secondaryWeapon===a;return b.jsxs("button",{disabled:!d||!f||h,onClick:()=>e(a),className:`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${h?"bg-slate-900/40 border-slate-800 opacity-50 cursor-not-allowed":d&&f?"bg-slate-900/90 border-slate-700/80 hover:border-amber-400/80 hover:bg-slate-800/90 cursor-pointer text-slate-100 shadow-md":"bg-black/40 border-slate-800/50 opacity-40 cursor-not-allowed text-slate-500"}`,children:[b.jsxs("div",{children:[b.jsx("div",{className:"font-bold text-sm text-slate-100",children:c.name}),b.jsxs("div",{className:"text-[11px] text-slate-400 font-mono",children:[l," • ",c.magazineSize," Rnds • ",c.damage," Dmg"]})]}),b.jsxs("div",{className:"text-right",children:[b.jsxs("div",{className:"font-mono font-bold text-emerald-400",children:["$",c.price]}),h&&b.jsx("div",{className:"text-[10px] text-slate-400 font-mono",children:"EQUIPPED"})]})]},a)})})]}),b.jsxs("div",{className:"flex flex-col gap-3",children:[b.jsx("h3",{className:"text-xs font-bold text-sky-400 uppercase tracking-wider font-mono",children:"Equipment & Armor"}),b.jsxs("div",{className:"flex flex-col gap-2",children:[b.jsxs("button",{disabled:r<650||n.armor>=100,onClick:()=>t("armor"),className:`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${r>=650&&n.armor<100?"bg-slate-900/90 border-slate-700/80 hover:border-sky-400/80 hover:bg-slate-800/90 cursor-pointer text-slate-100":"bg-black/40 border-slate-800/50 opacity-40 cursor-not-allowed text-slate-500"}`,children:[b.jsxs("div",{children:[b.jsx("div",{className:"font-bold text-sm text-slate-100",children:"Kevlar Body Armor"}),b.jsx("div",{className:"text-[11px] text-slate-400 font-mono",children:"Reduces chest and body bullet damage"})]}),b.jsx("div",{className:"font-mono font-bold text-emerald-400",children:"$650"})]}),b.jsxs("button",{disabled:r<1e3||n.armor>=100&&n.hasHelmet,onClick:()=>t("helmet"),className:`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${r>=1e3&&(!n.hasHelmet||n.armor<100)?"bg-slate-900/90 border-slate-700/80 hover:border-sky-400/80 hover:bg-slate-800/90 cursor-pointer text-slate-100":"bg-black/40 border-slate-800/50 opacity-40 cursor-not-allowed text-slate-500"}`,children:[b.jsxs("div",{children:[b.jsx("div",{className:"font-bold text-sm text-slate-100",children:"Kevlar + Helmet"}),b.jsx("div",{className:"text-[11px] text-slate-400 font-mono",children:"Prevents instant death from most headshots"})]}),b.jsx("div",{className:"font-mono font-bold text-emerald-400",children:"$1000"})]}),s&&b.jsxs("button",{disabled:r<400||n.hasDefuseKit,onClick:()=>t("kit"),className:`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${r>=400&&!n.hasDefuseKit?"bg-slate-900/90 border-slate-700/80 hover:border-sky-400/80 hover:bg-slate-800/90 cursor-pointer text-slate-100":"bg-black/40 border-slate-800/50 opacity-40 cursor-not-allowed text-slate-500"}`,children:[b.jsxs("div",{children:[b.jsx("div",{className:"font-bold text-sm text-slate-100",children:"Defuse Kit"}),b.jsx("div",{className:"text-[11px] text-slate-400 font-mono",children:"Cuts C4 defusal time in half (10s → 5s)"})]}),b.jsx("div",{className:"font-mono font-bold text-emerald-400",children:"$400"})]})]})]})]})]})})},OT=({spectatingBot:n,aliveTeammates:e,onTakeOver:t,onCycleTeammate:i})=>n?b.jsxs("div",{className:"fixed inset-x-0 bottom-12 flex flex-col items-center gap-4 z-40 pointer-events-auto animate-fadeIn",children:[b.jsxs("div",{className:"px-6 py-3 rounded-xl bg-slate-950/90 border border-slate-700/80 shadow-2xl backdrop-blur-md flex items-center gap-6",children:[b.jsx("button",{onClick:()=>i(-1),className:"px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors",children:"◀ PREV"}),b.jsxs("div",{className:"text-center",children:[b.jsx("div",{className:"text-[11px] text-amber-400 font-mono tracking-widest uppercase font-bold",children:"SPECTATING TEAMMATE"}),b.jsx("div",{className:"text-lg font-bold text-slate-100 font-sans",children:n.name}),b.jsxs("div",{className:"text-xs text-slate-400 font-mono mt-0.5",children:[n.health," HP • ",n.armor," AP • ",n.currentWeapon.toUpperCase()]})]}),b.jsx("button",{onClick:()=>i(1),className:"px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold transition-colors",children:"NEXT ▶"})]}),b.jsx("button",{onClick:()=>t(n.id),className:"px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm tracking-wider uppercase font-mono shadow-xl shadow-amber-500/20 transform hover:scale-105 active:scale-95 transition-all cursor-pointer",children:"PRESS [E] TO TAKE OVER BOT"})]}):null,kT=({gameState:n,allPlayers:e,showScoreboard:t,showBuyMenu:i,isScoped:r,recoilSpread:s,onBuyWeapon:o,onBuyEquipment:a,onCloseBuyMenu:l,onTakeOverBot:c,onCycleSpectator:d})=>{const{round:f,scoreCT:h,scoreT:p,roundPhase:g,roundTimeLeft:_,winner:m,winReason:u,playerEntity:v,c4:x,spectatingBot:y,killFeed:P}=n,E=v&&v.health>0?v:y,A=E?An[E.currentWeapon]:null,R=E&&A?E.ammo[E.currentWeapon]:null,w=e.filter(U=>U.team==="CT"),M=e.filter(U=>U.team==="T"),D=!v||v.health<=0,V=U=>{const B=Math.floor(Math.max(0,U)/60),X=Math.floor(Math.max(0,U)%60);return`${B}:${X<10?"0":""}${X}`};return b.jsxs("div",{className:"fixed inset-0 pointer-events-none select-none overflow-hidden font-sans text-white z-20",children:[b.jsx("div",{className:"absolute top-4 left-4 pointer-events-none",children:b.jsx(NT,{players:e,playerEntity:v,c4:x})}),b.jsx(IT,{entries:P}),b.jsx("div",{className:"absolute top-4 inset-x-0 flex justify-center items-center pointer-events-none",children:b.jsxs("div",{className:"flex items-center gap-3 px-6 py-2 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-2xl backdrop-blur-md",children:[b.jsx("div",{className:"flex items-center gap-1.5",children:w.map(U=>b.jsxs("div",{className:`w-6 h-8 rounded flex flex-col items-center justify-between p-0.5 border ${U.health>0?"bg-sky-950/90 border-sky-500 text-sky-400":"bg-black/80 border-slate-800 text-slate-600 opacity-40"}`,title:`${U.name} (${U.health} HP)`,children:[b.jsx("div",{className:"text-[9px] font-bold",children:"CT"}),U.health>0?b.jsx("div",{className:"w-full bg-slate-800 h-1 rounded-full overflow-hidden",children:b.jsx("div",{className:"bg-sky-400 h-full",style:{width:`${U.health}%`}})}):b.jsx("span",{className:"text-[9px]",children:"💀"})]},U.id))}),b.jsxs("div",{className:"flex items-center gap-4 px-3 py-1 bg-black/60 rounded-lg border border-slate-800/80",children:[b.jsx("span",{className:"text-xl font-black font-mono text-sky-400",children:h}),b.jsxs("div",{className:"flex flex-col items-center",children:[x.isPlanted?b.jsxs("div",{className:"flex items-center gap-1 text-red-500 font-mono font-black text-base animate-pulse",children:[b.jsx("span",{children:"💣"}),b.jsxs("span",{children:[Math.ceil(x.fuseTimeLeft),"s"]})]}):g==="FREEZE"?b.jsx("div",{className:"text-xs font-mono font-bold text-amber-400 uppercase tracking-widest",children:"FREEZE"}):b.jsx("div",{className:"text-base font-mono font-bold text-slate-200",children:V(_)}),b.jsxs("span",{className:"text-[9px] font-mono text-slate-500",children:["ROUND ",f]})]}),b.jsx("span",{className:"text-xl font-black font-mono text-amber-400",children:p})]}),b.jsx("div",{className:"flex items-center gap-1.5",children:M.map(U=>b.jsxs("div",{className:`w-6 h-8 rounded flex flex-col items-center justify-between p-0.5 border ${U.health>0?"bg-amber-950/90 border-amber-500 text-amber-400":"bg-black/80 border-slate-800 text-slate-600 opacity-40"}`,title:`${U.name} (${U.health} HP)`,children:[b.jsx("div",{className:"text-[9px] font-bold",children:"T"}),U.health>0?b.jsx("div",{className:"w-full bg-slate-800 h-1 rounded-full overflow-hidden",children:b.jsx("div",{className:"bg-amber-400 h-full",style:{width:`${U.health}%`}})}):b.jsx("span",{className:"text-[9px]",children:"💀"})]},U.id))})]})}),!r&&b.jsx("div",{className:"absolute inset-0 flex items-center justify-center pointer-events-none",children:b.jsxs("div",{className:"relative flex items-center justify-center",children:[b.jsx("div",{className:"w-1 h-1 bg-emerald-400 rounded-full shadow-sm shadow-black"}),b.jsx("div",{className:"absolute w-0.5 bg-emerald-400 shadow-sm shadow-black",style:{height:"9px",transform:`translateY(-${7+s*14}px)`}}),b.jsx("div",{className:"absolute w-0.5 bg-emerald-400 shadow-sm shadow-black",style:{height:"9px",transform:`translateY(${7+s*14}px)`}}),b.jsx("div",{className:"absolute h-0.5 bg-emerald-400 shadow-sm shadow-black",style:{width:"9px",transform:`translateX(-${7+s*14}px)`}}),b.jsx("div",{className:"absolute h-0.5 bg-emerald-400 shadow-sm shadow-black",style:{width:"9px",transform:`translateX(${7+s*14}px)`}})]})}),r&&b.jsx("div",{className:"fixed inset-0 flex items-center justify-center z-10 pointer-events-none bg-black/20",children:b.jsxs("div",{className:"w-[85vmin] h-[85vmin] rounded-full border-[100vmin] border-black relative overflow-hidden shadow-2xl flex items-center justify-center",children:[b.jsx("div",{className:"absolute inset-x-0 top-1/2 h-[1px] bg-black/90 shadow-sm"}),b.jsx("div",{className:"absolute inset-y-0 left-1/2 w-[1px] bg-black/90 shadow-sm"}),b.jsx("div",{className:"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center",children:b.jsx("div",{className:"w-2 h-2 rounded-full border border-red-500/80 bg-red-500/30"})}),b.jsx("div",{className:"absolute inset-0 rounded-full shadow-[inset_0_0_80px_rgba(0,0,0,0.85)]"})]})}),(x.plantProgress>0||x.defuseProgress>0)&&b.jsx("div",{className:"fixed inset-0 flex items-center justify-center z-30 pointer-events-none",children:b.jsxs("div",{className:"flex flex-col items-center gap-2 p-4 rounded-xl bg-black/80 border border-slate-700 shadow-2xl backdrop-blur-md",children:[b.jsx("div",{className:"text-xs font-mono font-bold tracking-widest uppercase text-amber-400",children:x.plantProgress>0?"PLANTING C4...":"DEFUSING C4..."}),b.jsx("div",{className:"w-48 bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-600",children:b.jsx("div",{className:`h-full transition-all duration-75 ${x.plantProgress>0?"bg-amber-500":"bg-sky-500"}`,style:{width:`${(x.plantProgress>0?x.plantProgress:x.defuseProgress)*100}%`}})})]})}),g==="ENDED"&&m&&b.jsx("div",{className:"fixed inset-0 flex items-center justify-center z-40 pointer-events-none animate-fadeIn",children:b.jsxs("div",{className:"px-12 py-6 rounded-2xl bg-black/90 border-2 border-slate-700 shadow-2xl backdrop-blur-lg text-center flex flex-col gap-2",children:[b.jsx("h1",{className:`text-4xl font-black tracking-widest font-sans uppercase ${m==="CT"?"text-sky-400":"text-amber-400"}`,children:m==="CT"?"COUNTER-TERRORISTS WIN":"TERRORISTS WIN"}),b.jsx("p",{className:"text-sm font-mono text-slate-300 uppercase tracking-wider",children:u})]})}),E&&b.jsxs("div",{className:"absolute inset-x-8 bottom-6 flex justify-between items-end pointer-events-none",children:[b.jsxs("div",{className:"flex items-center gap-4",children:[b.jsxs("div",{className:"flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-2xl backdrop-blur-md",children:[b.jsx("span",{className:"text-emerald-400 font-bold text-lg font-mono",children:"➕"}),b.jsxs("div",{children:[b.jsx("div",{className:"text-[10px] text-slate-400 font-mono tracking-widest uppercase",children:"HEALTH"}),b.jsx("div",{className:`text-3xl font-black font-mono ${E.health>25?"text-white":"text-red-500 animate-pulse"}`,children:E.health})]})]}),b.jsxs("div",{className:"flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-2xl backdrop-blur-md",children:[b.jsx("span",{className:"text-sky-400 font-bold text-lg font-mono",children:"🛡️"}),b.jsxs("div",{children:[b.jsx("div",{className:"text-[10px] text-slate-400 font-mono tracking-widest uppercase",children:"ARMOR"}),b.jsxs("div",{className:"text-3xl font-black font-mono text-white",children:[E.armor,E.hasHelmet&&b.jsx("span",{className:"text-xs text-sky-400 ml-1",children:"HELMET"})]})]})]})]}),A&&R&&b.jsx("div",{className:"flex items-center gap-4",children:b.jsx("div",{className:"flex items-center gap-4 px-6 py-3 rounded-xl bg-slate-950/85 border border-slate-700/80 shadow-2xl backdrop-blur-md text-right",children:b.jsxs("div",{children:[b.jsx("div",{className:"text-[10px] text-slate-400 font-mono tracking-widest uppercase",children:A.name}),b.jsx("div",{className:"text-3xl font-black font-mono text-white",children:A.slot==="melee"||A.slot==="bomb"?b.jsx("span",{className:"text-lg text-slate-400",children:"READY"}):b.jsxs(b.Fragment,{children:[b.jsx("span",{className:R.clip<=5?"text-red-400":"text-white",children:R.clip}),b.jsx("span",{className:"text-slate-500 text-xl font-normal mx-1",children:"/"}),b.jsx("span",{className:"text-slate-400 text-xl",children:R.reserve})]})})]})})})]}),D&&b.jsx(OT,{spectatingBot:y,aliveTeammates:e.filter(U=>{var B;return U.team===((B=n.playerEntity)==null?void 0:B.team)&&U.health>0}),onTakeOver:c,onCycleTeammate:d}),i&&b.jsx(FT,{playerEntity:v,onBuyWeapon:o,onBuyEquipment:a,onClose:l}),t&&b.jsx(UT,{players:e,playerEntity:v,scoreCT:h,scoreT:p,round:f})]})},BT=({playerTeam:n,isPistolOnly:e,mouseSensitivity:t,onExitToMenu:i})=>{var x,y,P;const r=Tt.useRef(null),s=Tt.useRef(null),[o,a]=Tt.useState(null),[l,c]=Tt.useState(!1),[d,f]=Tt.useState(!1),[h,p]=Tt.useState(!1);Tt.useEffect(()=>{if(!r.current)return;const E=new hT;E.background=new ke(13164016),E.fog=new Xf(13164016,.008);const A=new vn(75,window.innerWidth/window.innerHeight,.05,250),R=new fT({antialias:!0,powerPreference:"high-performance"});R.setSize(window.innerWidth,window.innerHeight),R.setPixelRatio(Math.min(window.devicePixelRatio,2)),R.shadowMap.enabled=!0,R.shadowMap.type=Ug,r.current.appendChild(R.domElement);const w=new DT(E,A,n);w.isPistolRound=e,s.current=w;const M=()=>{r.current&&(A.aspect=window.innerWidth/window.innerHeight,A.updateProjectionMatrix(),R.setSize(window.innerWidth,window.innerHeight))};window.addEventListener("resize",M);const D=()=>{const W=document.pointerLockElement===R.domElement;p(W)};document.addEventListener("pointerlockchange",D);const V=new yT;let U,B=0;const X=()=>{U=requestAnimationFrame(X);const W=Math.min(.05,V.getDelta());w.update(W);const K=w.isScoped?25:75;Math.abs(A.fov-K)>.1&&(A.fov=Yt.lerp(A.fov,K,W*20),A.updateProjectionMatrix()),R.render(E,A),B+=W,B>=.016&&(B=0,a(w.getGameState()))};return X(),()=>{cancelAnimationFrame(U),window.removeEventListener("resize",M),document.removeEventListener("pointerlockchange",D),r.current&&R.domElement&&r.current.removeChild(R.domElement),R.dispose()}},[n,e]);const g=Tt.useCallback(()=>{if(r.current){xt.init();const E=r.current.querySelector("canvas");E&&document.pointerLockElement!==E&&!d&&E.requestPointerLock()}},[d]);Tt.useEffect(()=>{const E=s.current;if(!E)return;const A=B=>{var W;if(document.pointerLockElement!==((W=r.current)==null?void 0:W.querySelector("canvas")))return;const X=t*.002;E.playerYaw-=B.movementX*X,E.playerPitch-=B.movementY*X,E.viewmodel.addMouseSway(B.movementX,B.movementY)},R=B=>{var X;xt.init(),document.pointerLockElement===((X=r.current)==null?void 0:X.querySelector("canvas"))&&(E.mouseButtons[B.button]=!0,B.button===0?E.handlePlayerFire():B.button===2&&E.playerEntity&&E.playerEntity.currentWeapon==="awp"&&(E.isScoped=!E.isScoped,xt.playScopeZoom()))},w=B=>{E.mouseButtons[B.button]=!1},M=B=>{xt.init(),E.keys[B.code]=!0,B.code==="KeyB"?E.roundPhase==="FREEZE"&&f(X=>(X||document.exitPointerLock(),!X)):B.code==="Tab"?(B.preventDefault(),c(!0)):B.code==="KeyR"?E.reloadPlayer():B.code==="Digit1"?E.switchWeaponSlot("primary"):B.code==="Digit2"?E.switchWeaponSlot("secondary"):B.code==="Digit3"?E.switchWeaponSlot("melee"):B.code==="Digit5"?E.switchWeaponSlot("bomb"):B.code==="KeyE"?E.playerEntity&&E.playerEntity.health<=0&&E.spectatingBot&&E.takeOverBot(E.spectatingBot.id):B.code==="Escape"&&d&&f(!1)},D=B=>{E.keys[B.code]=!1,B.code==="Tab"&&c(!1)},V=B=>{B.preventDefault()},U=B=>{E.playerEntity&&(B.deltaY>0?E.playerEntity.currentWeapon===E.playerEntity.primaryWeapon?E.switchWeaponSlot("secondary"):E.playerEntity.currentWeapon===E.playerEntity.secondaryWeapon?E.switchWeaponSlot("melee"):E.switchWeaponSlot("primary"):E.playerEntity.currentWeapon==="knife"?E.switchWeaponSlot("secondary"):E.playerEntity.currentWeapon===E.playerEntity.secondaryWeapon?E.switchWeaponSlot("primary"):E.switchWeaponSlot("melee"))};return window.addEventListener("mousemove",A),window.addEventListener("mousedown",R),window.addEventListener("mouseup",w),window.addEventListener("keydown",M),window.addEventListener("keyup",D),window.addEventListener("contextmenu",V),window.addEventListener("wheel",U),()=>{window.removeEventListener("mousemove",A),window.removeEventListener("mousedown",R),window.removeEventListener("mouseup",w),window.removeEventListener("keydown",M),window.removeEventListener("keyup",D),window.removeEventListener("contextmenu",V),window.removeEventListener("wheel",U)}},[t,d]);const _=E=>{s.current&&s.current.buyWeapon(E)},m=E=>{s.current&&s.current.buyEquipment(E)},u=E=>{s.current&&s.current.takeOverBot(E)},v=E=>{const A=s.current;if(!A)return;const R=A.players.filter(D=>D.team===A.playerTeam&&D.health>0);if(R.length===0)return;let w=A.spectatingBot?R.findIndex(D=>{var V;return D.id===((V=A.spectatingBot)==null?void 0:V.id)}):0;w===-1&&(w=0);let M=(w+E+R.length)%R.length;A.spectatingBot=R[M]};return b.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-black select-none",children:[b.jsx("div",{ref:r,onClick:g,className:"w-full h-full cursor-crosshair"}),!h&&!d&&b.jsx("div",{onClick:g,className:"fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 cursor-pointer",children:b.jsxs("div",{className:"px-8 py-5 rounded-2xl bg-slate-900/90 border border-slate-700 shadow-2xl text-center flex flex-col items-center gap-3",children:[b.jsx("div",{className:"text-3xl",children:"🎯"}),b.jsx("div",{className:"text-xl font-black text-slate-100 font-sans tracking-wider uppercase",children:"CLICK TO RESUME CONTROLS"}),b.jsx("p",{className:"text-xs text-slate-400 font-mono",children:"Locks mouse cursor for first-person FPS aiming"}),b.jsx("button",{onClick:i,className:"mt-2 px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold",children:"EXIT TO MAIN MENU"})]})}),o&&b.jsx(kT,{gameState:o,allPlayers:((x=s.current)==null?void 0:x.players)||[],showScoreboard:l,showBuyMenu:d,isScoped:((y=s.current)==null?void 0:y.isScoped)||!1,recoilSpread:((P=s.current)==null?void 0:P.recoilOffsetPitch)||0,onBuyWeapon:_,onBuyEquipment:m,onCloseBuyMenu:()=>f(!1),onTakeOverBot:u,onCycleSpectator:v})]})};function zT(){const[n,e]=Tt.useState(!1),[t,i]=Tt.useState("CT"),[r,s]=Tt.useState(!1),[o,a]=Tt.useState(1.2),l=(d,f,h)=>{i(d),s(f),a(h),e(!0)},c=()=>{e(!1)};return b.jsx("div",{className:"w-screen h-screen overflow-hidden bg-black select-none font-sans",children:n?b.jsx(BT,{playerTeam:t,isPistolOnly:r,mouseSensitivity:o,onExitToMenu:c}):b.jsx(Z_,{onStartGame:l})})}lu.createRoot(document.getElementById("root")).render(b.jsx(Bv.StrictMode,{children:b.jsx(zT,{})}));

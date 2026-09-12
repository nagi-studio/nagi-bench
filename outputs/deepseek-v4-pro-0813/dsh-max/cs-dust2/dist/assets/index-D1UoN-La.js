var Dv=Object.defineProperty;var Iv=(n,e,t)=>e in n?Dv(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var ye=(n,e,t)=>Iv(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function Uv(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Nm={exports:{}},Hl={},zm={exports:{}},Xe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Qo=Symbol.for("react.element"),Nv=Symbol.for("react.portal"),zv=Symbol.for("react.fragment"),Fv=Symbol.for("react.strict_mode"),kv=Symbol.for("react.profiler"),Ov=Symbol.for("react.provider"),Bv=Symbol.for("react.context"),Hv=Symbol.for("react.forward_ref"),Vv=Symbol.for("react.suspense"),Gv=Symbol.for("react.memo"),Wv=Symbol.for("react.lazy"),mh=Symbol.iterator;function Xv(n){return n===null||typeof n!="object"?null:(n=mh&&n[mh]||n["@@iterator"],typeof n=="function"?n:null)}var Fm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},km=Object.assign,Om={};function qs(n,e,t){this.props=n,this.context=e,this.refs=Om,this.updater=t||Fm}qs.prototype.isReactComponent={};qs.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};qs.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function Bm(){}Bm.prototype=qs.prototype;function Jf(n,e,t){this.props=n,this.context=e,this.refs=Om,this.updater=t||Fm}var ed=Jf.prototype=new Bm;ed.constructor=Jf;km(ed,qs.prototype);ed.isPureReactComponent=!0;var gh=Array.isArray,Hm=Object.prototype.hasOwnProperty,td={current:null},Vm={key:!0,ref:!0,__self:!0,__source:!0};function Gm(n,e,t){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Hm.call(e,i)&&!Vm.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=t;else if(1<a){for(var l=Array(a),u=0;u<a;u++)l[u]=arguments[u+2];r.children=l}if(n&&n.defaultProps)for(i in a=n.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:Qo,type:n,key:s,ref:o,props:r,_owner:td.current}}function Yv(n,e){return{$$typeof:Qo,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function nd(n){return typeof n=="object"&&n!==null&&n.$$typeof===Qo}function jv(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var vh=/\/+/g;function lu(n,e){return typeof n=="object"&&n!==null&&n.key!=null?jv(""+n.key):e.toString(36)}function Za(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case Qo:case Nv:o=!0}}if(o)return o=n,r=r(o),n=i===""?"."+lu(o,0):i,gh(r)?(t="",n!=null&&(t=n.replace(vh,"$&/")+"/"),Za(r,e,t,"",function(u){return u})):r!=null&&(nd(r)&&(r=Yv(r,t+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(vh,"$&/")+"/")+n)),e.push(r)),1;if(o=0,i=i===""?".":i+":",gh(n))for(var a=0;a<n.length;a++){s=n[a];var l=i+lu(s,a);o+=Za(s,e,t,l,r)}else if(l=Xv(n),typeof l=="function")for(n=l.call(n),a=0;!(s=n.next()).done;)s=s.value,l=i+lu(s,a++),o+=Za(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function ca(n,e,t){if(n==null)return n;var i=[],r=0;return Za(n,i,"","",function(s){return e.call(t,s,r++)}),i}function qv(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var un={current:null},Qa={transition:null},$v={ReactCurrentDispatcher:un,ReactCurrentBatchConfig:Qa,ReactCurrentOwner:td};function Wm(){throw Error("act(...) is not supported in production builds of React.")}Xe.Children={map:ca,forEach:function(n,e,t){ca(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return ca(n,function(){e++}),e},toArray:function(n){return ca(n,function(e){return e})||[]},only:function(n){if(!nd(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};Xe.Component=qs;Xe.Fragment=zv;Xe.Profiler=kv;Xe.PureComponent=Jf;Xe.StrictMode=Fv;Xe.Suspense=Vv;Xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$v;Xe.act=Wm;Xe.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=km({},n.props),r=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=td.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(l in e)Hm.call(e,l)&&!Vm.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){a=Array(l);for(var u=0;u<l;u++)a[u]=arguments[u+2];i.children=a}return{$$typeof:Qo,type:n.type,key:r,ref:s,props:i,_owner:o}};Xe.createContext=function(n){return n={$$typeof:Bv,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:Ov,_context:n},n.Consumer=n};Xe.createElement=Gm;Xe.createFactory=function(n){var e=Gm.bind(null,n);return e.type=n,e};Xe.createRef=function(){return{current:null}};Xe.forwardRef=function(n){return{$$typeof:Hv,render:n}};Xe.isValidElement=nd;Xe.lazy=function(n){return{$$typeof:Wv,_payload:{_status:-1,_result:n},_init:qv}};Xe.memo=function(n,e){return{$$typeof:Gv,type:n,compare:e===void 0?null:e}};Xe.startTransition=function(n){var e=Qa.transition;Qa.transition={};try{n()}finally{Qa.transition=e}};Xe.unstable_act=Wm;Xe.useCallback=function(n,e){return un.current.useCallback(n,e)};Xe.useContext=function(n){return un.current.useContext(n)};Xe.useDebugValue=function(){};Xe.useDeferredValue=function(n){return un.current.useDeferredValue(n)};Xe.useEffect=function(n,e){return un.current.useEffect(n,e)};Xe.useId=function(){return un.current.useId()};Xe.useImperativeHandle=function(n,e,t){return un.current.useImperativeHandle(n,e,t)};Xe.useInsertionEffect=function(n,e){return un.current.useInsertionEffect(n,e)};Xe.useLayoutEffect=function(n,e){return un.current.useLayoutEffect(n,e)};Xe.useMemo=function(n,e){return un.current.useMemo(n,e)};Xe.useReducer=function(n,e,t){return un.current.useReducer(n,e,t)};Xe.useRef=function(n){return un.current.useRef(n)};Xe.useState=function(n){return un.current.useState(n)};Xe.useSyncExternalStore=function(n,e,t){return un.current.useSyncExternalStore(n,e,t)};Xe.useTransition=function(){return un.current.useTransition()};Xe.version="18.3.1";zm.exports=Xe;var Dt=zm.exports;const Kv=Uv(Dt);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zv=Dt,Qv=Symbol.for("react.element"),Jv=Symbol.for("react.fragment"),e_=Object.prototype.hasOwnProperty,t_=Zv.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n_={key:!0,ref:!0,__self:!0,__source:!0};function Xm(n,e,t){var i,r={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)e_.call(e,i)&&!n_.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:Qv,type:n,key:s,ref:o,props:r,_owner:t_.current}}Hl.Fragment=Jv;Hl.jsx=Xm;Hl.jsxs=Xm;Nm.exports=Hl;var ae=Nm.exports,Ym={exports:{}},bn={},jm={exports:{}},qm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(b,k){var V=b.length;b.push(k);e:for(;0<V;){var ee=V-1>>>1,re=b[ee];if(0<r(re,k))b[ee]=k,b[V]=re,V=ee;else break e}}function t(b){return b.length===0?null:b[0]}function i(b){if(b.length===0)return null;var k=b[0],V=b.pop();if(V!==k){b[0]=V;e:for(var ee=0,re=b.length,Ie=re>>>1;ee<Ie;){var $=2*(ee+1)-1,ie=b[$],fe=$+1,le=b[fe];if(0>r(ie,V))fe<re&&0>r(le,ie)?(b[ee]=le,b[fe]=V,ee=fe):(b[ee]=ie,b[$]=V,ee=$);else if(fe<re&&0>r(le,V))b[ee]=le,b[fe]=V,ee=fe;else break e}}return k}function r(b,k){var V=b.sortIndex-k.sortIndex;return V!==0?V:b.id-k.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();n.unstable_now=function(){return o.now()-a}}var l=[],u=[],f=1,h=null,d=3,p=!1,v=!1,x=!1,m=typeof setTimeout=="function"?setTimeout:null,c=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function _(b){for(var k=t(u);k!==null;){if(k.callback===null)i(u);else if(k.startTime<=b)i(u),k.sortIndex=k.expirationTime,e(l,k);else break;k=t(u)}}function S(b){if(x=!1,_(b),!v)if(t(l)!==null)v=!0,B(P);else{var k=t(u);k!==null&&q(S,k.startTime-b)}}function P(b,k){v=!1,x&&(x=!1,c(L),L=-1),p=!0;var V=d;try{for(_(k),h=t(l);h!==null&&(!(h.expirationTime>k)||b&&!R());){var ee=h.callback;if(typeof ee=="function"){h.callback=null,d=h.priorityLevel;var re=ee(h.expirationTime<=k);k=n.unstable_now(),typeof re=="function"?h.callback=re:h===t(l)&&i(l),_(k)}else i(l);h=t(l)}if(h!==null)var Ie=!0;else{var $=t(u);$!==null&&q(S,$.startTime-k),Ie=!1}return Ie}finally{h=null,d=V,p=!1}}var A=!1,T=null,L=-1,w=5,y=-1;function R(){return!(n.unstable_now()-y<w)}function I(){if(T!==null){var b=n.unstable_now();y=b;var k=!0;try{k=T(!0,b)}finally{k?D():(A=!1,T=null)}}else A=!1}var D;if(typeof g=="function")D=function(){g(I)};else if(typeof MessageChannel<"u"){var G=new MessageChannel,W=G.port2;G.port1.onmessage=I,D=function(){W.postMessage(null)}}else D=function(){m(I,0)};function B(b){T=b,A||(A=!0,D())}function q(b,k){L=m(function(){b(n.unstable_now())},k)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(b){b.callback=null},n.unstable_continueExecution=function(){v||p||(v=!0,B(P))},n.unstable_forceFrameRate=function(b){0>b||125<b?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):w=0<b?Math.floor(1e3/b):5},n.unstable_getCurrentPriorityLevel=function(){return d},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(b){switch(d){case 1:case 2:case 3:var k=3;break;default:k=d}var V=d;d=k;try{return b()}finally{d=V}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(b,k){switch(b){case 1:case 2:case 3:case 4:case 5:break;default:b=3}var V=d;d=b;try{return k()}finally{d=V}},n.unstable_scheduleCallback=function(b,k,V){var ee=n.unstable_now();switch(typeof V=="object"&&V!==null?(V=V.delay,V=typeof V=="number"&&0<V?ee+V:ee):V=ee,b){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=V+re,b={id:f++,callback:k,priorityLevel:b,startTime:V,expirationTime:re,sortIndex:-1},V>ee?(b.sortIndex=V,e(u,b),t(l)===null&&b===t(u)&&(x?(c(L),L=-1):x=!0,q(S,V-ee))):(b.sortIndex=re,e(l,b),v||p||(v=!0,B(P))),b},n.unstable_shouldYield=R,n.unstable_wrapCallback=function(b){var k=d;return function(){var V=d;d=k;try{return b.apply(this,arguments)}finally{d=V}}}})(qm);jm.exports=qm;var i_=jm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r_=Dt,Rn=i_;function se(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var $m=new Set,Uo={};function qr(n,e){Ns(n,e),Ns(n+"Capture",e)}function Ns(n,e){for(Uo[n]=e,n=0;n<e.length;n++)$m.add(e[n])}var Ii=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),pc=Object.prototype.hasOwnProperty,s_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,_h={},xh={};function o_(n){return pc.call(xh,n)?!0:pc.call(_h,n)?!1:s_.test(n)?xh[n]=!0:(_h[n]=!0,!1)}function a_(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function l_(n,e,t,i){if(e===null||typeof e>"u"||a_(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function cn(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var qt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){qt[n]=new cn(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];qt[e]=new cn(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){qt[n]=new cn(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){qt[n]=new cn(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){qt[n]=new cn(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){qt[n]=new cn(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){qt[n]=new cn(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){qt[n]=new cn(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){qt[n]=new cn(n,5,!1,n.toLowerCase(),null,!1,!1)});var id=/[\-:]([a-z])/g;function rd(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(id,rd);qt[e]=new cn(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(id,rd);qt[e]=new cn(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(id,rd);qt[e]=new cn(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){qt[n]=new cn(n,1,!1,n.toLowerCase(),null,!1,!1)});qt.xlinkHref=new cn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){qt[n]=new cn(n,1,!1,n.toLowerCase(),null,!0,!0)});function sd(n,e,t,i){var r=qt.hasOwnProperty(e)?qt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(l_(e,t,r,i)&&(t=null),i||r===null?o_(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var ki=r_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,fa=Symbol.for("react.element"),hs=Symbol.for("react.portal"),ps=Symbol.for("react.fragment"),od=Symbol.for("react.strict_mode"),mc=Symbol.for("react.profiler"),Km=Symbol.for("react.provider"),Zm=Symbol.for("react.context"),ad=Symbol.for("react.forward_ref"),gc=Symbol.for("react.suspense"),vc=Symbol.for("react.suspense_list"),ld=Symbol.for("react.memo"),$i=Symbol.for("react.lazy"),Qm=Symbol.for("react.offscreen"),yh=Symbol.iterator;function no(n){return n===null||typeof n!="object"?null:(n=yh&&n[yh]||n["@@iterator"],typeof n=="function"?n:null)}var Tt=Object.assign,uu;function xo(n){if(uu===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);uu=e&&e[1]||""}return`
`+uu+n}var cu=!1;function fu(n,e){if(!n||cu)return"";cu=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var i=u}Reflect.construct(n,[],e)}else{try{e.call()}catch(u){i=u}n.call(e.prototype)}else{try{throw Error()}catch(u){i=u}n()}}catch(u){if(u&&i&&typeof u.stack=="string"){for(var r=u.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=o&&0<=a);break}}}finally{cu=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?xo(n):""}function u_(n){switch(n.tag){case 5:return xo(n.type);case 16:return xo("Lazy");case 13:return xo("Suspense");case 19:return xo("SuspenseList");case 0:case 2:case 15:return n=fu(n.type,!1),n;case 11:return n=fu(n.type.render,!1),n;case 1:return n=fu(n.type,!0),n;default:return""}}function _c(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case ps:return"Fragment";case hs:return"Portal";case mc:return"Profiler";case od:return"StrictMode";case gc:return"Suspense";case vc:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case Zm:return(n.displayName||"Context")+".Consumer";case Km:return(n._context.displayName||"Context")+".Provider";case ad:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case ld:return e=n.displayName||null,e!==null?e:_c(n.type)||"Memo";case $i:e=n._payload,n=n._init;try{return _c(n(e))}catch{}}return null}function c_(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return _c(e);case 8:return e===od?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function hr(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Jm(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function f_(n){var e=Jm(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function da(n){n._valueTracker||(n._valueTracker=f_(n))}function e0(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=Jm(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function ml(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function xc(n,e){var t=e.checked;return Tt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function Sh(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=hr(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function t0(n,e){e=e.checked,e!=null&&sd(n,"checked",e,!1)}function yc(n,e){t0(n,e);var t=hr(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?Sc(n,e.type,t):e.hasOwnProperty("defaultValue")&&Sc(n,e.type,hr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function Mh(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function Sc(n,e,t){(e!=="number"||ml(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var yo=Array.isArray;function As(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+hr(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function Mc(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(se(91));return Tt({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Eh(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(se(92));if(yo(t)){if(1<t.length)throw Error(se(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:hr(t)}}function n0(n,e){var t=hr(e.value),i=hr(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function Th(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function i0(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ec(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?i0(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var ha,r0=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(ha=ha||document.createElement("div"),ha.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=ha.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function No(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var wo={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},d_=["Webkit","ms","Moz","O"];Object.keys(wo).forEach(function(n){d_.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),wo[e]=wo[n]})});function s0(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||wo.hasOwnProperty(n)&&wo[n]?(""+e).trim():e+"px"}function o0(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=s0(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var h_=Tt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Tc(n,e){if(e){if(h_[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(se(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(se(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(se(61))}if(e.style!=null&&typeof e.style!="object")throw Error(se(62))}}function wc(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ac=null;function ud(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Cc=null,Cs=null,Rs=null;function wh(n){if(n=ta(n)){if(typeof Cc!="function")throw Error(se(280));var e=n.stateNode;e&&(e=Yl(e),Cc(n.stateNode,n.type,e))}}function a0(n){Cs?Rs?Rs.push(n):Rs=[n]:Cs=n}function l0(){if(Cs){var n=Cs,e=Rs;if(Rs=Cs=null,wh(n),e)for(n=0;n<e.length;n++)wh(e[n])}}function u0(n,e){return n(e)}function c0(){}var du=!1;function f0(n,e,t){if(du)return n(e,t);du=!0;try{return u0(n,e,t)}finally{du=!1,(Cs!==null||Rs!==null)&&(c0(),l0())}}function zo(n,e){var t=n.stateNode;if(t===null)return null;var i=Yl(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(se(231,e,typeof t));return t}var Rc=!1;if(Ii)try{var io={};Object.defineProperty(io,"passive",{get:function(){Rc=!0}}),window.addEventListener("test",io,io),window.removeEventListener("test",io,io)}catch{Rc=!1}function p_(n,e,t,i,r,s,o,a,l){var u=Array.prototype.slice.call(arguments,3);try{e.apply(t,u)}catch(f){this.onError(f)}}var Ao=!1,gl=null,vl=!1,bc=null,m_={onError:function(n){Ao=!0,gl=n}};function g_(n,e,t,i,r,s,o,a,l){Ao=!1,gl=null,p_.apply(m_,arguments)}function v_(n,e,t,i,r,s,o,a,l){if(g_.apply(this,arguments),Ao){if(Ao){var u=gl;Ao=!1,gl=null}else throw Error(se(198));vl||(vl=!0,bc=u)}}function $r(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function d0(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function Ah(n){if($r(n)!==n)throw Error(se(188))}function __(n){var e=n.alternate;if(!e){if(e=$r(n),e===null)throw Error(se(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return Ah(r),n;if(s===i)return Ah(r),e;s=s.sibling}throw Error(se(188))}if(t.return!==i.return)t=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===t){o=!0,t=r,i=s;break}if(a===i){o=!0,i=r,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,i=r;break}if(a===i){o=!0,i=s,t=r;break}a=a.sibling}if(!o)throw Error(se(189))}}if(t.alternate!==i)throw Error(se(190))}if(t.tag!==3)throw Error(se(188));return t.stateNode.current===t?n:e}function h0(n){return n=__(n),n!==null?p0(n):null}function p0(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=p0(n);if(e!==null)return e;n=n.sibling}return null}var m0=Rn.unstable_scheduleCallback,Ch=Rn.unstable_cancelCallback,x_=Rn.unstable_shouldYield,y_=Rn.unstable_requestPaint,bt=Rn.unstable_now,S_=Rn.unstable_getCurrentPriorityLevel,cd=Rn.unstable_ImmediatePriority,g0=Rn.unstable_UserBlockingPriority,_l=Rn.unstable_NormalPriority,M_=Rn.unstable_LowPriority,v0=Rn.unstable_IdlePriority,Vl=null,ci=null;function E_(n){if(ci&&typeof ci.onCommitFiberRoot=="function")try{ci.onCommitFiberRoot(Vl,n,void 0,(n.current.flags&128)===128)}catch{}}var Qn=Math.clz32?Math.clz32:A_,T_=Math.log,w_=Math.LN2;function A_(n){return n>>>=0,n===0?32:31-(T_(n)/w_|0)|0}var pa=64,ma=4194304;function So(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function xl(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~r;a!==0?i=So(a):(s&=o,s!==0&&(i=So(s)))}else o=t&~r,o!==0?i=So(o):s!==0&&(i=So(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-Qn(e),r=1<<t,i|=n[t],e&=~r;return i}function C_(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function R_(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-Qn(s),a=1<<o,l=r[o];l===-1?(!(a&t)||a&i)&&(r[o]=C_(a,e)):l<=e&&(n.expiredLanes|=a),s&=~a}}function Pc(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function _0(){var n=pa;return pa<<=1,!(pa&4194240)&&(pa=64),n}function hu(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function Jo(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-Qn(e),n[e]=t}function b_(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-Qn(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function fd(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-Qn(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var st=0;function x0(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var y0,dd,S0,M0,E0,Lc=!1,ga=[],ir=null,rr=null,sr=null,Fo=new Map,ko=new Map,Zi=[],P_="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Rh(n,e){switch(n){case"focusin":case"focusout":ir=null;break;case"dragenter":case"dragleave":rr=null;break;case"mouseover":case"mouseout":sr=null;break;case"pointerover":case"pointerout":Fo.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":ko.delete(e.pointerId)}}function ro(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=ta(e),e!==null&&dd(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function L_(n,e,t,i,r){switch(e){case"focusin":return ir=ro(ir,n,e,t,i,r),!0;case"dragenter":return rr=ro(rr,n,e,t,i,r),!0;case"mouseover":return sr=ro(sr,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return Fo.set(s,ro(Fo.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,ko.set(s,ro(ko.get(s)||null,n,e,t,i,r)),!0}return!1}function T0(n){var e=Ur(n.target);if(e!==null){var t=$r(e);if(t!==null){if(e=t.tag,e===13){if(e=d0(t),e!==null){n.blockedOn=e,E0(n.priority,function(){S0(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Ja(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=Dc(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);Ac=i,t.target.dispatchEvent(i),Ac=null}else return e=ta(t),e!==null&&dd(e),n.blockedOn=t,!1;e.shift()}return!0}function bh(n,e,t){Ja(n)&&t.delete(e)}function D_(){Lc=!1,ir!==null&&Ja(ir)&&(ir=null),rr!==null&&Ja(rr)&&(rr=null),sr!==null&&Ja(sr)&&(sr=null),Fo.forEach(bh),ko.forEach(bh)}function so(n,e){n.blockedOn===e&&(n.blockedOn=null,Lc||(Lc=!0,Rn.unstable_scheduleCallback(Rn.unstable_NormalPriority,D_)))}function Oo(n){function e(r){return so(r,n)}if(0<ga.length){so(ga[0],n);for(var t=1;t<ga.length;t++){var i=ga[t];i.blockedOn===n&&(i.blockedOn=null)}}for(ir!==null&&so(ir,n),rr!==null&&so(rr,n),sr!==null&&so(sr,n),Fo.forEach(e),ko.forEach(e),t=0;t<Zi.length;t++)i=Zi[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<Zi.length&&(t=Zi[0],t.blockedOn===null);)T0(t),t.blockedOn===null&&Zi.shift()}var bs=ki.ReactCurrentBatchConfig,yl=!0;function I_(n,e,t,i){var r=st,s=bs.transition;bs.transition=null;try{st=1,hd(n,e,t,i)}finally{st=r,bs.transition=s}}function U_(n,e,t,i){var r=st,s=bs.transition;bs.transition=null;try{st=4,hd(n,e,t,i)}finally{st=r,bs.transition=s}}function hd(n,e,t,i){if(yl){var r=Dc(n,e,t,i);if(r===null)Eu(n,e,i,Sl,t),Rh(n,i);else if(L_(r,n,e,t,i))i.stopPropagation();else if(Rh(n,i),e&4&&-1<P_.indexOf(n)){for(;r!==null;){var s=ta(r);if(s!==null&&y0(s),s=Dc(n,e,t,i),s===null&&Eu(n,e,i,Sl,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else Eu(n,e,i,null,t)}}var Sl=null;function Dc(n,e,t,i){if(Sl=null,n=ud(i),n=Ur(n),n!==null)if(e=$r(n),e===null)n=null;else if(t=e.tag,t===13){if(n=d0(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return Sl=n,null}function w0(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(S_()){case cd:return 1;case g0:return 4;case _l:case M_:return 16;case v0:return 536870912;default:return 16}default:return 16}}var tr=null,pd=null,el=null;function A0(){if(el)return el;var n,e=pd,t=e.length,i,r="value"in tr?tr.value:tr.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===r[s-i];i++);return el=r.slice(n,1<i?1-i:void 0)}function tl(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function va(){return!0}function Ph(){return!1}function Pn(n){function e(t,i,r,s,o){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?va:Ph,this.isPropagationStopped=Ph,this}return Tt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=va)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=va)},persist:function(){},isPersistent:va}),e}var $s={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},md=Pn($s),ea=Tt({},$s,{view:0,detail:0}),N_=Pn(ea),pu,mu,oo,Gl=Tt({},ea,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:gd,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==oo&&(oo&&n.type==="mousemove"?(pu=n.screenX-oo.screenX,mu=n.screenY-oo.screenY):mu=pu=0,oo=n),pu)},movementY:function(n){return"movementY"in n?n.movementY:mu}}),Lh=Pn(Gl),z_=Tt({},Gl,{dataTransfer:0}),F_=Pn(z_),k_=Tt({},ea,{relatedTarget:0}),gu=Pn(k_),O_=Tt({},$s,{animationName:0,elapsedTime:0,pseudoElement:0}),B_=Pn(O_),H_=Tt({},$s,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),V_=Pn(H_),G_=Tt({},$s,{data:0}),Dh=Pn(G_),W_={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},X_={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Y_={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function j_(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=Y_[n])?!!e[n]:!1}function gd(){return j_}var q_=Tt({},ea,{key:function(n){if(n.key){var e=W_[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=tl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?X_[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:gd,charCode:function(n){return n.type==="keypress"?tl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?tl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),$_=Pn(q_),K_=Tt({},Gl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Ih=Pn(K_),Z_=Tt({},ea,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:gd}),Q_=Pn(Z_),J_=Tt({},$s,{propertyName:0,elapsedTime:0,pseudoElement:0}),ex=Pn(J_),tx=Tt({},Gl,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),nx=Pn(tx),ix=[9,13,27,32],vd=Ii&&"CompositionEvent"in window,Co=null;Ii&&"documentMode"in document&&(Co=document.documentMode);var rx=Ii&&"TextEvent"in window&&!Co,C0=Ii&&(!vd||Co&&8<Co&&11>=Co),Uh=" ",Nh=!1;function R0(n,e){switch(n){case"keyup":return ix.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function b0(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var ms=!1;function sx(n,e){switch(n){case"compositionend":return b0(e);case"keypress":return e.which!==32?null:(Nh=!0,Uh);case"textInput":return n=e.data,n===Uh&&Nh?null:n;default:return null}}function ox(n,e){if(ms)return n==="compositionend"||!vd&&R0(n,e)?(n=A0(),el=pd=tr=null,ms=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return C0&&e.locale!=="ko"?null:e.data;default:return null}}var ax={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function zh(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!ax[n.type]:e==="textarea"}function P0(n,e,t,i){a0(i),e=Ml(e,"onChange"),0<e.length&&(t=new md("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var Ro=null,Bo=null;function lx(n){H0(n,0)}function Wl(n){var e=_s(n);if(e0(e))return n}function ux(n,e){if(n==="change")return e}var L0=!1;if(Ii){var vu;if(Ii){var _u="oninput"in document;if(!_u){var Fh=document.createElement("div");Fh.setAttribute("oninput","return;"),_u=typeof Fh.oninput=="function"}vu=_u}else vu=!1;L0=vu&&(!document.documentMode||9<document.documentMode)}function kh(){Ro&&(Ro.detachEvent("onpropertychange",D0),Bo=Ro=null)}function D0(n){if(n.propertyName==="value"&&Wl(Bo)){var e=[];P0(e,Bo,n,ud(n)),f0(lx,e)}}function cx(n,e,t){n==="focusin"?(kh(),Ro=e,Bo=t,Ro.attachEvent("onpropertychange",D0)):n==="focusout"&&kh()}function fx(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Wl(Bo)}function dx(n,e){if(n==="click")return Wl(e)}function hx(n,e){if(n==="input"||n==="change")return Wl(e)}function px(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var ti=typeof Object.is=="function"?Object.is:px;function Ho(n,e){if(ti(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!pc.call(e,r)||!ti(n[r],e[r]))return!1}return!0}function Oh(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Bh(n,e){var t=Oh(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Oh(t)}}function I0(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?I0(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function U0(){for(var n=window,e=ml();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=ml(n.document)}return e}function _d(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function mx(n){var e=U0(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&I0(t.ownerDocument.documentElement,t)){if(i!==null&&_d(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=Bh(t,s);var o=Bh(t,i);r&&o&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var gx=Ii&&"documentMode"in document&&11>=document.documentMode,gs=null,Ic=null,bo=null,Uc=!1;function Hh(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;Uc||gs==null||gs!==ml(i)||(i=gs,"selectionStart"in i&&_d(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),bo&&Ho(bo,i)||(bo=i,i=Ml(Ic,"onSelect"),0<i.length&&(e=new md("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=gs)))}function _a(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var vs={animationend:_a("Animation","AnimationEnd"),animationiteration:_a("Animation","AnimationIteration"),animationstart:_a("Animation","AnimationStart"),transitionend:_a("Transition","TransitionEnd")},xu={},N0={};Ii&&(N0=document.createElement("div").style,"AnimationEvent"in window||(delete vs.animationend.animation,delete vs.animationiteration.animation,delete vs.animationstart.animation),"TransitionEvent"in window||delete vs.transitionend.transition);function Xl(n){if(xu[n])return xu[n];if(!vs[n])return n;var e=vs[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in N0)return xu[n]=e[t];return n}var z0=Xl("animationend"),F0=Xl("animationiteration"),k0=Xl("animationstart"),O0=Xl("transitionend"),B0=new Map,Vh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function vr(n,e){B0.set(n,e),qr(e,[n])}for(var yu=0;yu<Vh.length;yu++){var Su=Vh[yu],vx=Su.toLowerCase(),_x=Su[0].toUpperCase()+Su.slice(1);vr(vx,"on"+_x)}vr(z0,"onAnimationEnd");vr(F0,"onAnimationIteration");vr(k0,"onAnimationStart");vr("dblclick","onDoubleClick");vr("focusin","onFocus");vr("focusout","onBlur");vr(O0,"onTransitionEnd");Ns("onMouseEnter",["mouseout","mouseover"]);Ns("onMouseLeave",["mouseout","mouseover"]);Ns("onPointerEnter",["pointerout","pointerover"]);Ns("onPointerLeave",["pointerout","pointerover"]);qr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));qr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));qr("onBeforeInput",["compositionend","keypress","textInput","paste"]);qr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));qr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));qr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Mo="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),xx=new Set("cancel close invalid load scroll toggle".split(" ").concat(Mo));function Gh(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,v_(i,e,void 0,n),n.currentTarget=null}function H0(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,u=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;Gh(r,a,u),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,u=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;Gh(r,a,u),s=l}}}if(vl)throw n=bc,vl=!1,bc=null,n}function vt(n,e){var t=e[Oc];t===void 0&&(t=e[Oc]=new Set);var i=n+"__bubble";t.has(i)||(V0(e,n,2,!1),t.add(i))}function Mu(n,e,t){var i=0;e&&(i|=4),V0(t,n,i,e)}var xa="_reactListening"+Math.random().toString(36).slice(2);function Vo(n){if(!n[xa]){n[xa]=!0,$m.forEach(function(t){t!=="selectionchange"&&(xx.has(t)||Mu(t,!1,n),Mu(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[xa]||(e[xa]=!0,Mu("selectionchange",!1,e))}}function V0(n,e,t,i){switch(w0(e)){case 1:var r=I_;break;case 4:r=U_;break;default:r=hd}t=r.bind(null,e,t,n),r=void 0,!Rc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function Eu(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Ur(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}f0(function(){var u=s,f=ud(t),h=[];e:{var d=B0.get(n);if(d!==void 0){var p=md,v=n;switch(n){case"keypress":if(tl(t)===0)break e;case"keydown":case"keyup":p=$_;break;case"focusin":v="focus",p=gu;break;case"focusout":v="blur",p=gu;break;case"beforeblur":case"afterblur":p=gu;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Lh;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=F_;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Q_;break;case z0:case F0:case k0:p=B_;break;case O0:p=ex;break;case"scroll":p=N_;break;case"wheel":p=nx;break;case"copy":case"cut":case"paste":p=V_;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Ih}var x=(e&4)!==0,m=!x&&n==="scroll",c=x?d!==null?d+"Capture":null:d;x=[];for(var g=u,_;g!==null;){_=g;var S=_.stateNode;if(_.tag===5&&S!==null&&(_=S,c!==null&&(S=zo(g,c),S!=null&&x.push(Go(g,S,_)))),m)break;g=g.return}0<x.length&&(d=new p(d,v,null,t,f),h.push({event:d,listeners:x}))}}if(!(e&7)){e:{if(d=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",d&&t!==Ac&&(v=t.relatedTarget||t.fromElement)&&(Ur(v)||v[Ui]))break e;if((p||d)&&(d=f.window===f?f:(d=f.ownerDocument)?d.defaultView||d.parentWindow:window,p?(v=t.relatedTarget||t.toElement,p=u,v=v?Ur(v):null,v!==null&&(m=$r(v),v!==m||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=u),p!==v)){if(x=Lh,S="onMouseLeave",c="onMouseEnter",g="mouse",(n==="pointerout"||n==="pointerover")&&(x=Ih,S="onPointerLeave",c="onPointerEnter",g="pointer"),m=p==null?d:_s(p),_=v==null?d:_s(v),d=new x(S,g+"leave",p,t,f),d.target=m,d.relatedTarget=_,S=null,Ur(f)===u&&(x=new x(c,g+"enter",v,t,f),x.target=_,x.relatedTarget=m,S=x),m=S,p&&v)t:{for(x=p,c=v,g=0,_=x;_;_=Zr(_))g++;for(_=0,S=c;S;S=Zr(S))_++;for(;0<g-_;)x=Zr(x),g--;for(;0<_-g;)c=Zr(c),_--;for(;g--;){if(x===c||c!==null&&x===c.alternate)break t;x=Zr(x),c=Zr(c)}x=null}else x=null;p!==null&&Wh(h,d,p,x,!1),v!==null&&m!==null&&Wh(h,m,v,x,!0)}}e:{if(d=u?_s(u):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var P=ux;else if(zh(d))if(L0)P=hx;else{P=fx;var A=cx}else(p=d.nodeName)&&p.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(P=dx);if(P&&(P=P(n,u))){P0(h,P,t,f);break e}A&&A(n,d,u),n==="focusout"&&(A=d._wrapperState)&&A.controlled&&d.type==="number"&&Sc(d,"number",d.value)}switch(A=u?_s(u):window,n){case"focusin":(zh(A)||A.contentEditable==="true")&&(gs=A,Ic=u,bo=null);break;case"focusout":bo=Ic=gs=null;break;case"mousedown":Uc=!0;break;case"contextmenu":case"mouseup":case"dragend":Uc=!1,Hh(h,t,f);break;case"selectionchange":if(gx)break;case"keydown":case"keyup":Hh(h,t,f)}var T;if(vd)e:{switch(n){case"compositionstart":var L="onCompositionStart";break e;case"compositionend":L="onCompositionEnd";break e;case"compositionupdate":L="onCompositionUpdate";break e}L=void 0}else ms?R0(n,t)&&(L="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(L="onCompositionStart");L&&(C0&&t.locale!=="ko"&&(ms||L!=="onCompositionStart"?L==="onCompositionEnd"&&ms&&(T=A0()):(tr=f,pd="value"in tr?tr.value:tr.textContent,ms=!0)),A=Ml(u,L),0<A.length&&(L=new Dh(L,n,null,t,f),h.push({event:L,listeners:A}),T?L.data=T:(T=b0(t),T!==null&&(L.data=T)))),(T=rx?sx(n,t):ox(n,t))&&(u=Ml(u,"onBeforeInput"),0<u.length&&(f=new Dh("onBeforeInput","beforeinput",null,t,f),h.push({event:f,listeners:u}),f.data=T))}H0(h,e)})}function Go(n,e,t){return{instance:n,listener:e,currentTarget:t}}function Ml(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=zo(n,t),s!=null&&i.unshift(Go(n,s,r)),s=zo(n,e),s!=null&&i.push(Go(n,s,r))),n=n.return}return i}function Zr(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Wh(n,e,t,i,r){for(var s=e._reactName,o=[];t!==null&&t!==i;){var a=t,l=a.alternate,u=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&u!==null&&(a=u,r?(l=zo(t,s),l!=null&&o.unshift(Go(t,l,a))):r||(l=zo(t,s),l!=null&&o.push(Go(t,l,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var yx=/\r\n?/g,Sx=/\u0000|\uFFFD/g;function Xh(n){return(typeof n=="string"?n:""+n).replace(yx,`
`).replace(Sx,"")}function ya(n,e,t){if(e=Xh(e),Xh(n)!==e&&t)throw Error(se(425))}function El(){}var Nc=null,zc=null;function Fc(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var kc=typeof setTimeout=="function"?setTimeout:void 0,Mx=typeof clearTimeout=="function"?clearTimeout:void 0,Yh=typeof Promise=="function"?Promise:void 0,Ex=typeof queueMicrotask=="function"?queueMicrotask:typeof Yh<"u"?function(n){return Yh.resolve(null).then(n).catch(Tx)}:kc;function Tx(n){setTimeout(function(){throw n})}function Tu(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),Oo(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);Oo(e)}function or(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function jh(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Ks=Math.random().toString(36).slice(2),ai="__reactFiber$"+Ks,Wo="__reactProps$"+Ks,Ui="__reactContainer$"+Ks,Oc="__reactEvents$"+Ks,wx="__reactListeners$"+Ks,Ax="__reactHandles$"+Ks;function Ur(n){var e=n[ai];if(e)return e;for(var t=n.parentNode;t;){if(e=t[Ui]||t[ai]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=jh(n);n!==null;){if(t=n[ai])return t;n=jh(n)}return e}n=t,t=n.parentNode}return null}function ta(n){return n=n[ai]||n[Ui],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function _s(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(se(33))}function Yl(n){return n[Wo]||null}var Bc=[],xs=-1;function _r(n){return{current:n}}function _t(n){0>xs||(n.current=Bc[xs],Bc[xs]=null,xs--)}function pt(n,e){xs++,Bc[xs]=n.current,n.current=e}var pr={},sn=_r(pr),gn=_r(!1),Hr=pr;function zs(n,e){var t=n.type.contextTypes;if(!t)return pr;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function vn(n){return n=n.childContextTypes,n!=null}function Tl(){_t(gn),_t(sn)}function qh(n,e,t){if(sn.current!==pr)throw Error(se(168));pt(sn,e),pt(gn,t)}function G0(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(se(108,c_(n)||"Unknown",r));return Tt({},t,i)}function wl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||pr,Hr=sn.current,pt(sn,n),pt(gn,gn.current),!0}function $h(n,e,t){var i=n.stateNode;if(!i)throw Error(se(169));t?(n=G0(n,e,Hr),i.__reactInternalMemoizedMergedChildContext=n,_t(gn),_t(sn),pt(sn,n)):_t(gn),pt(gn,t)}var wi=null,jl=!1,wu=!1;function W0(n){wi===null?wi=[n]:wi.push(n)}function Cx(n){jl=!0,W0(n)}function xr(){if(!wu&&wi!==null){wu=!0;var n=0,e=st;try{var t=wi;for(st=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}wi=null,jl=!1}catch(r){throw wi!==null&&(wi=wi.slice(n+1)),m0(cd,xr),r}finally{st=e,wu=!1}}return null}var ys=[],Ss=0,Al=null,Cl=0,Nn=[],zn=0,Vr=null,Ai=1,Ci="";function Rr(n,e){ys[Ss++]=Cl,ys[Ss++]=Al,Al=n,Cl=e}function X0(n,e,t){Nn[zn++]=Ai,Nn[zn++]=Ci,Nn[zn++]=Vr,Vr=n;var i=Ai;n=Ci;var r=32-Qn(i)-1;i&=~(1<<r),t+=1;var s=32-Qn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,Ai=1<<32-Qn(e)+r|t<<r|i,Ci=s+n}else Ai=1<<s|t<<r|i,Ci=n}function xd(n){n.return!==null&&(Rr(n,1),X0(n,1,0))}function yd(n){for(;n===Al;)Al=ys[--Ss],ys[Ss]=null,Cl=ys[--Ss],ys[Ss]=null;for(;n===Vr;)Vr=Nn[--zn],Nn[zn]=null,Ci=Nn[--zn],Nn[zn]=null,Ai=Nn[--zn],Nn[zn]=null}var Cn=null,An=null,yt=!1,$n=null;function Y0(n,e){var t=Fn(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function Kh(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,Cn=n,An=or(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,Cn=n,An=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=Vr!==null?{id:Ai,overflow:Ci}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Fn(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,Cn=n,An=null,!0):!1;default:return!1}}function Hc(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Vc(n){if(yt){var e=An;if(e){var t=e;if(!Kh(n,e)){if(Hc(n))throw Error(se(418));e=or(t.nextSibling);var i=Cn;e&&Kh(n,e)?Y0(i,t):(n.flags=n.flags&-4097|2,yt=!1,Cn=n)}}else{if(Hc(n))throw Error(se(418));n.flags=n.flags&-4097|2,yt=!1,Cn=n}}}function Zh(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Cn=n}function Sa(n){if(n!==Cn)return!1;if(!yt)return Zh(n),yt=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!Fc(n.type,n.memoizedProps)),e&&(e=An)){if(Hc(n))throw j0(),Error(se(418));for(;e;)Y0(n,e),e=or(e.nextSibling)}if(Zh(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(se(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){An=or(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}An=null}}else An=Cn?or(n.stateNode.nextSibling):null;return!0}function j0(){for(var n=An;n;)n=or(n.nextSibling)}function Fs(){An=Cn=null,yt=!1}function Sd(n){$n===null?$n=[n]:$n.push(n)}var Rx=ki.ReactCurrentBatchConfig;function ao(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(se(309));var i=t.stateNode}if(!i)throw Error(se(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(se(284));if(!t._owner)throw Error(se(290,n))}return n}function Ma(n,e){throw n=Object.prototype.toString.call(e),Error(se(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function Qh(n){var e=n._init;return e(n._payload)}function q0(n){function e(c,g){if(n){var _=c.deletions;_===null?(c.deletions=[g],c.flags|=16):_.push(g)}}function t(c,g){if(!n)return null;for(;g!==null;)e(c,g),g=g.sibling;return null}function i(c,g){for(c=new Map;g!==null;)g.key!==null?c.set(g.key,g):c.set(g.index,g),g=g.sibling;return c}function r(c,g){return c=cr(c,g),c.index=0,c.sibling=null,c}function s(c,g,_){return c.index=_,n?(_=c.alternate,_!==null?(_=_.index,_<g?(c.flags|=2,g):_):(c.flags|=2,g)):(c.flags|=1048576,g)}function o(c){return n&&c.alternate===null&&(c.flags|=2),c}function a(c,g,_,S){return g===null||g.tag!==6?(g=Du(_,c.mode,S),g.return=c,g):(g=r(g,_),g.return=c,g)}function l(c,g,_,S){var P=_.type;return P===ps?f(c,g,_.props.children,S,_.key):g!==null&&(g.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===$i&&Qh(P)===g.type)?(S=r(g,_.props),S.ref=ao(c,g,_),S.return=c,S):(S=ll(_.type,_.key,_.props,null,c.mode,S),S.ref=ao(c,g,_),S.return=c,S)}function u(c,g,_,S){return g===null||g.tag!==4||g.stateNode.containerInfo!==_.containerInfo||g.stateNode.implementation!==_.implementation?(g=Iu(_,c.mode,S),g.return=c,g):(g=r(g,_.children||[]),g.return=c,g)}function f(c,g,_,S,P){return g===null||g.tag!==7?(g=Br(_,c.mode,S,P),g.return=c,g):(g=r(g,_),g.return=c,g)}function h(c,g,_){if(typeof g=="string"&&g!==""||typeof g=="number")return g=Du(""+g,c.mode,_),g.return=c,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case fa:return _=ll(g.type,g.key,g.props,null,c.mode,_),_.ref=ao(c,null,g),_.return=c,_;case hs:return g=Iu(g,c.mode,_),g.return=c,g;case $i:var S=g._init;return h(c,S(g._payload),_)}if(yo(g)||no(g))return g=Br(g,c.mode,_,null),g.return=c,g;Ma(c,g)}return null}function d(c,g,_,S){var P=g!==null?g.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return P!==null?null:a(c,g,""+_,S);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case fa:return _.key===P?l(c,g,_,S):null;case hs:return _.key===P?u(c,g,_,S):null;case $i:return P=_._init,d(c,g,P(_._payload),S)}if(yo(_)||no(_))return P!==null?null:f(c,g,_,S,null);Ma(c,_)}return null}function p(c,g,_,S,P){if(typeof S=="string"&&S!==""||typeof S=="number")return c=c.get(_)||null,a(g,c,""+S,P);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case fa:return c=c.get(S.key===null?_:S.key)||null,l(g,c,S,P);case hs:return c=c.get(S.key===null?_:S.key)||null,u(g,c,S,P);case $i:var A=S._init;return p(c,g,_,A(S._payload),P)}if(yo(S)||no(S))return c=c.get(_)||null,f(g,c,S,P,null);Ma(g,S)}return null}function v(c,g,_,S){for(var P=null,A=null,T=g,L=g=0,w=null;T!==null&&L<_.length;L++){T.index>L?(w=T,T=null):w=T.sibling;var y=d(c,T,_[L],S);if(y===null){T===null&&(T=w);break}n&&T&&y.alternate===null&&e(c,T),g=s(y,g,L),A===null?P=y:A.sibling=y,A=y,T=w}if(L===_.length)return t(c,T),yt&&Rr(c,L),P;if(T===null){for(;L<_.length;L++)T=h(c,_[L],S),T!==null&&(g=s(T,g,L),A===null?P=T:A.sibling=T,A=T);return yt&&Rr(c,L),P}for(T=i(c,T);L<_.length;L++)w=p(T,c,L,_[L],S),w!==null&&(n&&w.alternate!==null&&T.delete(w.key===null?L:w.key),g=s(w,g,L),A===null?P=w:A.sibling=w,A=w);return n&&T.forEach(function(R){return e(c,R)}),yt&&Rr(c,L),P}function x(c,g,_,S){var P=no(_);if(typeof P!="function")throw Error(se(150));if(_=P.call(_),_==null)throw Error(se(151));for(var A=P=null,T=g,L=g=0,w=null,y=_.next();T!==null&&!y.done;L++,y=_.next()){T.index>L?(w=T,T=null):w=T.sibling;var R=d(c,T,y.value,S);if(R===null){T===null&&(T=w);break}n&&T&&R.alternate===null&&e(c,T),g=s(R,g,L),A===null?P=R:A.sibling=R,A=R,T=w}if(y.done)return t(c,T),yt&&Rr(c,L),P;if(T===null){for(;!y.done;L++,y=_.next())y=h(c,y.value,S),y!==null&&(g=s(y,g,L),A===null?P=y:A.sibling=y,A=y);return yt&&Rr(c,L),P}for(T=i(c,T);!y.done;L++,y=_.next())y=p(T,c,L,y.value,S),y!==null&&(n&&y.alternate!==null&&T.delete(y.key===null?L:y.key),g=s(y,g,L),A===null?P=y:A.sibling=y,A=y);return n&&T.forEach(function(I){return e(c,I)}),yt&&Rr(c,L),P}function m(c,g,_,S){if(typeof _=="object"&&_!==null&&_.type===ps&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case fa:e:{for(var P=_.key,A=g;A!==null;){if(A.key===P){if(P=_.type,P===ps){if(A.tag===7){t(c,A.sibling),g=r(A,_.props.children),g.return=c,c=g;break e}}else if(A.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===$i&&Qh(P)===A.type){t(c,A.sibling),g=r(A,_.props),g.ref=ao(c,A,_),g.return=c,c=g;break e}t(c,A);break}else e(c,A);A=A.sibling}_.type===ps?(g=Br(_.props.children,c.mode,S,_.key),g.return=c,c=g):(S=ll(_.type,_.key,_.props,null,c.mode,S),S.ref=ao(c,g,_),S.return=c,c=S)}return o(c);case hs:e:{for(A=_.key;g!==null;){if(g.key===A)if(g.tag===4&&g.stateNode.containerInfo===_.containerInfo&&g.stateNode.implementation===_.implementation){t(c,g.sibling),g=r(g,_.children||[]),g.return=c,c=g;break e}else{t(c,g);break}else e(c,g);g=g.sibling}g=Iu(_,c.mode,S),g.return=c,c=g}return o(c);case $i:return A=_._init,m(c,g,A(_._payload),S)}if(yo(_))return v(c,g,_,S);if(no(_))return x(c,g,_,S);Ma(c,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,g!==null&&g.tag===6?(t(c,g.sibling),g=r(g,_),g.return=c,c=g):(t(c,g),g=Du(_,c.mode,S),g.return=c,c=g),o(c)):t(c,g)}return m}var ks=q0(!0),$0=q0(!1),Rl=_r(null),bl=null,Ms=null,Md=null;function Ed(){Md=Ms=bl=null}function Td(n){var e=Rl.current;_t(Rl),n._currentValue=e}function Gc(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function Ps(n,e){bl=n,Md=Ms=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(mn=!0),n.firstContext=null)}function On(n){var e=n._currentValue;if(Md!==n)if(n={context:n,memoizedValue:e,next:null},Ms===null){if(bl===null)throw Error(se(308));Ms=n,bl.dependencies={lanes:0,firstContext:n}}else Ms=Ms.next=n;return e}var Nr=null;function wd(n){Nr===null?Nr=[n]:Nr.push(n)}function K0(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,wd(e)):(t.next=r.next,r.next=t),e.interleaved=t,Ni(n,i)}function Ni(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var Ki=!1;function Ad(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Z0(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Li(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function ar(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,Ze&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ni(n,t)}return r=i.interleaved,r===null?(e.next=e,wd(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ni(n,t)}function nl(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,fd(n,t)}}function Jh(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function Pl(n,e,t,i){var r=n.updateQueue;Ki=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,u=l.next;l.next=null,o===null?s=u:o.next=u,o=l;var f=n.alternate;f!==null&&(f=f.updateQueue,a=f.lastBaseUpdate,a!==o&&(a===null?f.firstBaseUpdate=u:a.next=u,f.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,f=u=l=null,a=s;do{var d=a.lane,p=a.eventTime;if((i&d)===d){f!==null&&(f=f.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=n,x=a;switch(d=e,p=t,x.tag){case 1:if(v=x.payload,typeof v=="function"){h=v.call(p,h,d);break e}h=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=x.payload,d=typeof v=="function"?v.call(p,h,d):v,d==null)break e;h=Tt({},h,d);break e;case 2:Ki=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,d=r.effects,d===null?r.effects=[a]:d.push(a))}else p={eventTime:p,lane:d,tag:a.tag,payload:a.payload,callback:a.callback,next:null},f===null?(u=f=p,l=h):f=f.next=p,o|=d;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;d=a,a=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(f===null&&(l=h),r.baseState=l,r.firstBaseUpdate=u,r.lastBaseUpdate=f,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Wr|=o,n.lanes=o,n.memoizedState=h}}function ep(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(se(191,r));r.call(i)}}}var na={},fi=_r(na),Xo=_r(na),Yo=_r(na);function zr(n){if(n===na)throw Error(se(174));return n}function Cd(n,e){switch(pt(Yo,e),pt(Xo,n),pt(fi,na),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Ec(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=Ec(e,n)}_t(fi),pt(fi,e)}function Os(){_t(fi),_t(Xo),_t(Yo)}function Q0(n){zr(Yo.current);var e=zr(fi.current),t=Ec(e,n.type);e!==t&&(pt(Xo,n),pt(fi,t))}function Rd(n){Xo.current===n&&(_t(fi),_t(Xo))}var St=_r(0);function Ll(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Au=[];function bd(){for(var n=0;n<Au.length;n++)Au[n]._workInProgressVersionPrimary=null;Au.length=0}var il=ki.ReactCurrentDispatcher,Cu=ki.ReactCurrentBatchConfig,Gr=0,Mt=null,Nt=null,Bt=null,Dl=!1,Po=!1,jo=0,bx=0;function Zt(){throw Error(se(321))}function Pd(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!ti(n[t],e[t]))return!1;return!0}function Ld(n,e,t,i,r,s){if(Gr=s,Mt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,il.current=n===null||n.memoizedState===null?Ix:Ux,n=t(i,r),Po){s=0;do{if(Po=!1,jo=0,25<=s)throw Error(se(301));s+=1,Bt=Nt=null,e.updateQueue=null,il.current=Nx,n=t(i,r)}while(Po)}if(il.current=Il,e=Nt!==null&&Nt.next!==null,Gr=0,Bt=Nt=Mt=null,Dl=!1,e)throw Error(se(300));return n}function Dd(){var n=jo!==0;return jo=0,n}function si(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Bt===null?Mt.memoizedState=Bt=n:Bt=Bt.next=n,Bt}function Bn(){if(Nt===null){var n=Mt.alternate;n=n!==null?n.memoizedState:null}else n=Nt.next;var e=Bt===null?Mt.memoizedState:Bt.next;if(e!==null)Bt=e,Nt=n;else{if(n===null)throw Error(se(310));Nt=n,n={memoizedState:Nt.memoizedState,baseState:Nt.baseState,baseQueue:Nt.baseQueue,queue:Nt.queue,next:null},Bt===null?Mt.memoizedState=Bt=n:Bt=Bt.next=n}return Bt}function qo(n,e){return typeof e=="function"?e(n):e}function Ru(n){var e=Bn(),t=e.queue;if(t===null)throw Error(se(311));t.lastRenderedReducer=n;var i=Nt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,u=s;do{var f=u.lane;if((Gr&f)===f)l!==null&&(l=l.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),i=u.hasEagerState?u.eagerState:n(i,u.action);else{var h={lane:f,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,Mt.lanes|=f,Wr|=f}u=u.next}while(u!==null&&u!==s);l===null?o=i:l.next=a,ti(i,e.memoizedState)||(mn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,Mt.lanes|=s,Wr|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function bu(n){var e=Bn(),t=e.queue;if(t===null)throw Error(se(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var o=r=r.next;do s=n(s,o.action),o=o.next;while(o!==r);ti(s,e.memoizedState)||(mn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function J0(){}function eg(n,e){var t=Mt,i=Bn(),r=e(),s=!ti(i.memoizedState,r);if(s&&(i.memoizedState=r,mn=!0),i=i.queue,Id(ig.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||Bt!==null&&Bt.memoizedState.tag&1){if(t.flags|=2048,$o(9,ng.bind(null,t,i,r,e),void 0,null),Ht===null)throw Error(se(349));Gr&30||tg(t,e,r)}return r}function tg(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=Mt.updateQueue,e===null?(e={lastEffect:null,stores:null},Mt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function ng(n,e,t,i){e.value=t,e.getSnapshot=i,rg(e)&&sg(n)}function ig(n,e,t){return t(function(){rg(e)&&sg(n)})}function rg(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!ti(n,t)}catch{return!0}}function sg(n){var e=Ni(n,1);e!==null&&Jn(e,n,1,-1)}function tp(n){var e=si();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:qo,lastRenderedState:n},e.queue=n,n=n.dispatch=Dx.bind(null,Mt,n),[e.memoizedState,n]}function $o(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=Mt.updateQueue,e===null?(e={lastEffect:null,stores:null},Mt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function og(){return Bn().memoizedState}function rl(n,e,t,i){var r=si();Mt.flags|=n,r.memoizedState=$o(1|e,t,void 0,i===void 0?null:i)}function ql(n,e,t,i){var r=Bn();i=i===void 0?null:i;var s=void 0;if(Nt!==null){var o=Nt.memoizedState;if(s=o.destroy,i!==null&&Pd(i,o.deps)){r.memoizedState=$o(e,t,s,i);return}}Mt.flags|=n,r.memoizedState=$o(1|e,t,s,i)}function np(n,e){return rl(8390656,8,n,e)}function Id(n,e){return ql(2048,8,n,e)}function ag(n,e){return ql(4,2,n,e)}function lg(n,e){return ql(4,4,n,e)}function ug(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function cg(n,e,t){return t=t!=null?t.concat([n]):null,ql(4,4,ug.bind(null,e,n),t)}function Ud(){}function fg(n,e){var t=Bn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Pd(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function dg(n,e){var t=Bn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Pd(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function hg(n,e,t){return Gr&21?(ti(t,e)||(t=_0(),Mt.lanes|=t,Wr|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,mn=!0),n.memoizedState=t)}function Px(n,e){var t=st;st=t!==0&&4>t?t:4,n(!0);var i=Cu.transition;Cu.transition={};try{n(!1),e()}finally{st=t,Cu.transition=i}}function pg(){return Bn().memoizedState}function Lx(n,e,t){var i=ur(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},mg(n))gg(e,t);else if(t=K0(n,e,t,i),t!==null){var r=ln();Jn(t,n,i,r),vg(t,e,i)}}function Dx(n,e,t){var i=ur(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(mg(n))gg(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,t);if(r.hasEagerState=!0,r.eagerState=a,ti(a,o)){var l=e.interleaved;l===null?(r.next=r,wd(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=K0(n,e,r,i),t!==null&&(r=ln(),Jn(t,n,i,r),vg(t,e,i))}}function mg(n){var e=n.alternate;return n===Mt||e!==null&&e===Mt}function gg(n,e){Po=Dl=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function vg(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,fd(n,t)}}var Il={readContext:On,useCallback:Zt,useContext:Zt,useEffect:Zt,useImperativeHandle:Zt,useInsertionEffect:Zt,useLayoutEffect:Zt,useMemo:Zt,useReducer:Zt,useRef:Zt,useState:Zt,useDebugValue:Zt,useDeferredValue:Zt,useTransition:Zt,useMutableSource:Zt,useSyncExternalStore:Zt,useId:Zt,unstable_isNewReconciler:!1},Ix={readContext:On,useCallback:function(n,e){return si().memoizedState=[n,e===void 0?null:e],n},useContext:On,useEffect:np,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,rl(4194308,4,ug.bind(null,e,n),t)},useLayoutEffect:function(n,e){return rl(4194308,4,n,e)},useInsertionEffect:function(n,e){return rl(4,2,n,e)},useMemo:function(n,e){var t=si();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=si();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=Lx.bind(null,Mt,n),[i.memoizedState,n]},useRef:function(n){var e=si();return n={current:n},e.memoizedState=n},useState:tp,useDebugValue:Ud,useDeferredValue:function(n){return si().memoizedState=n},useTransition:function(){var n=tp(!1),e=n[0];return n=Px.bind(null,n[1]),si().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=Mt,r=si();if(yt){if(t===void 0)throw Error(se(407));t=t()}else{if(t=e(),Ht===null)throw Error(se(349));Gr&30||tg(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,np(ig.bind(null,i,s,n),[n]),i.flags|=2048,$o(9,ng.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=si(),e=Ht.identifierPrefix;if(yt){var t=Ci,i=Ai;t=(i&~(1<<32-Qn(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=jo++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=bx++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},Ux={readContext:On,useCallback:fg,useContext:On,useEffect:Id,useImperativeHandle:cg,useInsertionEffect:ag,useLayoutEffect:lg,useMemo:dg,useReducer:Ru,useRef:og,useState:function(){return Ru(qo)},useDebugValue:Ud,useDeferredValue:function(n){var e=Bn();return hg(e,Nt.memoizedState,n)},useTransition:function(){var n=Ru(qo)[0],e=Bn().memoizedState;return[n,e]},useMutableSource:J0,useSyncExternalStore:eg,useId:pg,unstable_isNewReconciler:!1},Nx={readContext:On,useCallback:fg,useContext:On,useEffect:Id,useImperativeHandle:cg,useInsertionEffect:ag,useLayoutEffect:lg,useMemo:dg,useReducer:bu,useRef:og,useState:function(){return bu(qo)},useDebugValue:Ud,useDeferredValue:function(n){var e=Bn();return Nt===null?e.memoizedState=n:hg(e,Nt.memoizedState,n)},useTransition:function(){var n=bu(qo)[0],e=Bn().memoizedState;return[n,e]},useMutableSource:J0,useSyncExternalStore:eg,useId:pg,unstable_isNewReconciler:!1};function jn(n,e){if(n&&n.defaultProps){e=Tt({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function Wc(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:Tt({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var $l={isMounted:function(n){return(n=n._reactInternals)?$r(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=ln(),r=ur(n),s=Li(i,r);s.payload=e,t!=null&&(s.callback=t),e=ar(n,s,r),e!==null&&(Jn(e,n,r,i),nl(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=ln(),r=ur(n),s=Li(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=ar(n,s,r),e!==null&&(Jn(e,n,r,i),nl(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=ln(),i=ur(n),r=Li(t,i);r.tag=2,e!=null&&(r.callback=e),e=ar(n,r,i),e!==null&&(Jn(e,n,i,t),nl(e,n,i))}};function ip(n,e,t,i,r,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Ho(t,i)||!Ho(r,s):!0}function _g(n,e,t){var i=!1,r=pr,s=e.contextType;return typeof s=="object"&&s!==null?s=On(s):(r=vn(e)?Hr:sn.current,i=e.contextTypes,s=(i=i!=null)?zs(n,r):pr),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=$l,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function rp(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&$l.enqueueReplaceState(e,e.state,null)}function Xc(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},Ad(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=On(s):(s=vn(e)?Hr:sn.current,r.context=zs(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Wc(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&$l.enqueueReplaceState(r,r.state,null),Pl(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function Bs(n,e){try{var t="",i=e;do t+=u_(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Pu(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function Yc(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var zx=typeof WeakMap=="function"?WeakMap:Map;function xg(n,e,t){t=Li(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){Nl||(Nl=!0,nf=i),Yc(n,e)},t}function yg(n,e,t){t=Li(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){Yc(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){Yc(n,e),typeof i!="function"&&(lr===null?lr=new Set([this]):lr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function sp(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new zx;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=Kx.bind(null,n,e,t),e.then(n,n))}function op(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function ap(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=Li(-1,1),e.tag=2,ar(t,e,1))),t.lanes|=1),n)}var Fx=ki.ReactCurrentOwner,mn=!1;function an(n,e,t,i){e.child=n===null?$0(e,null,t,i):ks(e,n.child,t,i)}function lp(n,e,t,i,r){t=t.render;var s=e.ref;return Ps(e,r),i=Ld(n,e,t,i,s,r),t=Dd(),n!==null&&!mn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,zi(n,e,r)):(yt&&t&&xd(e),e.flags|=1,an(n,e,i,r),e.child)}function up(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!Vd(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,Sg(n,e,s,i,r)):(n=ll(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:Ho,t(o,i)&&n.ref===e.ref)return zi(n,e,r)}return e.flags|=1,n=cr(s,i),n.ref=e.ref,n.return=e,e.child=n}function Sg(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(Ho(s,i)&&n.ref===e.ref)if(mn=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(mn=!0);else return e.lanes=n.lanes,zi(n,e,r)}return jc(n,e,t,i,r)}function Mg(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},pt(Ts,Tn),Tn|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,pt(Ts,Tn),Tn|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,pt(Ts,Tn),Tn|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,pt(Ts,Tn),Tn|=i;return an(n,e,r,t),e.child}function Eg(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function jc(n,e,t,i,r){var s=vn(t)?Hr:sn.current;return s=zs(e,s),Ps(e,r),t=Ld(n,e,t,i,s,r),i=Dd(),n!==null&&!mn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,zi(n,e,r)):(yt&&i&&xd(e),e.flags|=1,an(n,e,t,r),e.child)}function cp(n,e,t,i,r){if(vn(t)){var s=!0;wl(e)}else s=!1;if(Ps(e,r),e.stateNode===null)sl(n,e),_g(e,t,i),Xc(e,t,i,r),i=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,u=t.contextType;typeof u=="object"&&u!==null?u=On(u):(u=vn(t)?Hr:sn.current,u=zs(e,u));var f=t.getDerivedStateFromProps,h=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==u)&&rp(e,o,i,u),Ki=!1;var d=e.memoizedState;o.state=d,Pl(e,i,o,r),l=e.memoizedState,a!==i||d!==l||gn.current||Ki?(typeof f=="function"&&(Wc(e,t,f,i),l=e.memoizedState),(a=Ki||ip(e,t,a,i,d,l,u))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=u,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,Z0(n,e),a=e.memoizedProps,u=e.type===e.elementType?a:jn(e.type,a),o.props=u,h=e.pendingProps,d=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=On(l):(l=vn(t)?Hr:sn.current,l=zs(e,l));var p=t.getDerivedStateFromProps;(f=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||d!==l)&&rp(e,o,i,l),Ki=!1,d=e.memoizedState,o.state=d,Pl(e,i,o,r);var v=e.memoizedState;a!==h||d!==v||gn.current||Ki?(typeof p=="function"&&(Wc(e,t,p,i),v=e.memoizedState),(u=Ki||ip(e,t,u,i,d,v,l)||!1)?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&d===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&d===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=l,i=u):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&d===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&d===n.memoizedState||(e.flags|=1024),i=!1)}return qc(n,e,t,i,s,r)}function qc(n,e,t,i,r,s){Eg(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&$h(e,t,!1),zi(n,e,s);i=e.stateNode,Fx.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=ks(e,n.child,null,s),e.child=ks(e,null,a,s)):an(n,e,a,s),e.memoizedState=i.state,r&&$h(e,t,!0),e.child}function Tg(n){var e=n.stateNode;e.pendingContext?qh(n,e.pendingContext,e.pendingContext!==e.context):e.context&&qh(n,e.context,!1),Cd(n,e.containerInfo)}function fp(n,e,t,i,r){return Fs(),Sd(r),e.flags|=256,an(n,e,t,i),e.child}var $c={dehydrated:null,treeContext:null,retryLane:0};function Kc(n){return{baseLanes:n,cachePool:null,transitions:null}}function wg(n,e,t){var i=e.pendingProps,r=St.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),pt(St,r&1),n===null)return Vc(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,n=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Ql(o,i,0,null),n=Br(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=Kc(t),e.memoizedState=$c,n):Nd(e,o));if(r=n.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return kx(n,e,o,i,a,r,t);if(s){s=i.fallback,o=e.mode,r=n.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=cr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=cr(a,s):(s=Br(s,o,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=n.child.memoizedState,o=o===null?Kc(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=$c,i}return s=n.child,n=s.sibling,i=cr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function Nd(n,e){return e=Ql({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function Ea(n,e,t,i){return i!==null&&Sd(i),ks(e,n.child,null,t),n=Nd(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function kx(n,e,t,i,r,s,o){if(t)return e.flags&256?(e.flags&=-257,i=Pu(Error(se(422))),Ea(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Ql({mode:"visible",children:i.children},r,0,null),s=Br(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&ks(e,n.child,null,o),e.child.memoizedState=Kc(o),e.memoizedState=$c,s);if(!(e.mode&1))return Ea(n,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(se(419)),i=Pu(s,i,void 0),Ea(n,e,o,i)}if(a=(o&n.childLanes)!==0,mn||a){if(i=Ht,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ni(n,r),Jn(i,n,r,-1))}return Hd(),i=Pu(Error(se(421))),Ea(n,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=Zx.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,An=or(r.nextSibling),Cn=e,yt=!0,$n=null,n!==null&&(Nn[zn++]=Ai,Nn[zn++]=Ci,Nn[zn++]=Vr,Ai=n.id,Ci=n.overflow,Vr=e),e=Nd(e,i.children),e.flags|=4096,e)}function dp(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),Gc(n.return,e,t)}function Lu(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function Ag(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(an(n,e,i.children,t),i=St.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&dp(n,t,e);else if(n.tag===19)dp(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(pt(St,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&Ll(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Lu(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&Ll(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Lu(e,!0,t,null,s);break;case"together":Lu(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function sl(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function zi(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),Wr|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(se(153));if(e.child!==null){for(n=e.child,t=cr(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=cr(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function Ox(n,e,t){switch(e.tag){case 3:Tg(e),Fs();break;case 5:Q0(e);break;case 1:vn(e.type)&&wl(e);break;case 4:Cd(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;pt(Rl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(pt(St,St.current&1),e.flags|=128,null):t&e.child.childLanes?wg(n,e,t):(pt(St,St.current&1),n=zi(n,e,t),n!==null?n.sibling:null);pt(St,St.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return Ag(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),pt(St,St.current),i)break;return null;case 22:case 23:return e.lanes=0,Mg(n,e,t)}return zi(n,e,t)}var Cg,Zc,Rg,bg;Cg=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};Zc=function(){};Rg=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,zr(fi.current);var s=null;switch(t){case"input":r=xc(n,r),i=xc(n,i),s=[];break;case"select":r=Tt({},r,{value:void 0}),i=Tt({},i,{value:void 0}),s=[];break;case"textarea":r=Mc(n,r),i=Mc(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=El)}Tc(t,i);var o;t=null;for(u in r)if(!i.hasOwnProperty(u)&&r.hasOwnProperty(u)&&r[u]!=null)if(u==="style"){var a=r[u];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(Uo.hasOwnProperty(u)?s||(s=[]):(s=s||[]).push(u,null));for(u in i){var l=i[u];if(a=r?.[u],i.hasOwnProperty(u)&&l!==a&&(l!=null||a!=null))if(u==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(u,t)),t=l;else u==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(u,l)):u==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(u,""+l):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(Uo.hasOwnProperty(u)?(l!=null&&u==="onScroll"&&vt("scroll",n),s||a===l||(s=[])):(s=s||[]).push(u,l))}t&&(s=s||[]).push("style",t);var u=s;(e.updateQueue=u)&&(e.flags|=4)}};bg=function(n,e,t,i){t!==i&&(e.flags|=4)};function lo(n,e){if(!yt)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function Qt(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function Bx(n,e,t){var i=e.pendingProps;switch(yd(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Qt(e),null;case 1:return vn(e.type)&&Tl(),Qt(e),null;case 3:return i=e.stateNode,Os(),_t(gn),_t(sn),bd(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(Sa(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,$n!==null&&(of($n),$n=null))),Zc(n,e),Qt(e),null;case 5:Rd(e);var r=zr(Yo.current);if(t=e.type,n!==null&&e.stateNode!=null)Rg(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(se(166));return Qt(e),null}if(n=zr(fi.current),Sa(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[ai]=e,i[Wo]=s,n=(e.mode&1)!==0,t){case"dialog":vt("cancel",i),vt("close",i);break;case"iframe":case"object":case"embed":vt("load",i);break;case"video":case"audio":for(r=0;r<Mo.length;r++)vt(Mo[r],i);break;case"source":vt("error",i);break;case"img":case"image":case"link":vt("error",i),vt("load",i);break;case"details":vt("toggle",i);break;case"input":Sh(i,s),vt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},vt("invalid",i);break;case"textarea":Eh(i,s),vt("invalid",i)}Tc(t,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&ya(i.textContent,a,n),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&ya(i.textContent,a,n),r=["children",""+a]):Uo.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&vt("scroll",i)}switch(t){case"input":da(i),Mh(i,s,!0);break;case"textarea":da(i),Th(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=El)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=i0(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[ai]=e,n[Wo]=i,Cg(n,e,!1,!1),e.stateNode=n;e:{switch(o=wc(t,i),t){case"dialog":vt("cancel",n),vt("close",n),r=i;break;case"iframe":case"object":case"embed":vt("load",n),r=i;break;case"video":case"audio":for(r=0;r<Mo.length;r++)vt(Mo[r],n);r=i;break;case"source":vt("error",n),r=i;break;case"img":case"image":case"link":vt("error",n),vt("load",n),r=i;break;case"details":vt("toggle",n),r=i;break;case"input":Sh(n,i),r=xc(n,i),vt("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=Tt({},i,{value:void 0}),vt("invalid",n);break;case"textarea":Eh(n,i),r=Mc(n,i),vt("invalid",n);break;default:r=i}Tc(t,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?o0(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&r0(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&No(n,l):typeof l=="number"&&No(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Uo.hasOwnProperty(s)?l!=null&&s==="onScroll"&&vt("scroll",n):l!=null&&sd(n,s,l,o))}switch(t){case"input":da(n),Mh(n,i,!1);break;case"textarea":da(n),Th(n);break;case"option":i.value!=null&&n.setAttribute("value",""+hr(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?As(n,!!i.multiple,s,!1):i.defaultValue!=null&&As(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=El)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Qt(e),null;case 6:if(n&&e.stateNode!=null)bg(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(se(166));if(t=zr(Yo.current),zr(fi.current),Sa(e)){if(i=e.stateNode,t=e.memoizedProps,i[ai]=e,(s=i.nodeValue!==t)&&(n=Cn,n!==null))switch(n.tag){case 3:ya(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&ya(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[ai]=e,e.stateNode=i}return Qt(e),null;case 13:if(_t(St),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(yt&&An!==null&&e.mode&1&&!(e.flags&128))j0(),Fs(),e.flags|=98560,s=!1;else if(s=Sa(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(se(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(se(317));s[ai]=e}else Fs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Qt(e),s=!1}else $n!==null&&(of($n),$n=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||St.current&1?zt===0&&(zt=3):Hd())),e.updateQueue!==null&&(e.flags|=4),Qt(e),null);case 4:return Os(),Zc(n,e),n===null&&Vo(e.stateNode.containerInfo),Qt(e),null;case 10:return Td(e.type._context),Qt(e),null;case 17:return vn(e.type)&&Tl(),Qt(e),null;case 19:if(_t(St),s=e.memoizedState,s===null)return Qt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)lo(s,!1);else{if(zt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=Ll(n),o!==null){for(e.flags|=128,lo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return pt(St,St.current&1|2),e.child}n=n.sibling}s.tail!==null&&bt()>Hs&&(e.flags|=128,i=!0,lo(s,!1),e.lanes=4194304)}else{if(!i)if(n=Ll(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),lo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!yt)return Qt(e),null}else 2*bt()-s.renderingStartTime>Hs&&t!==1073741824&&(e.flags|=128,i=!0,lo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=bt(),e.sibling=null,t=St.current,pt(St,i?t&1|2:t&1),e):(Qt(e),null);case 22:case 23:return Bd(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Tn&1073741824&&(Qt(e),e.subtreeFlags&6&&(e.flags|=8192)):Qt(e),null;case 24:return null;case 25:return null}throw Error(se(156,e.tag))}function Hx(n,e){switch(yd(e),e.tag){case 1:return vn(e.type)&&Tl(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Os(),_t(gn),_t(sn),bd(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return Rd(e),null;case 13:if(_t(St),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(se(340));Fs()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return _t(St),null;case 4:return Os(),null;case 10:return Td(e.type._context),null;case 22:case 23:return Bd(),null;case 24:return null;default:return null}}var Ta=!1,tn=!1,Vx=typeof WeakSet=="function"?WeakSet:Set,Se=null;function Es(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){Rt(n,e,i)}else t.current=null}function Qc(n,e,t){try{t()}catch(i){Rt(n,e,i)}}var hp=!1;function Gx(n,e){if(Nc=yl,n=U0(),_d(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,u=0,f=0,h=n,d=null;t:for(;;){for(var p;h!==t||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(p=h.firstChild)!==null;)d=h,h=p;for(;;){if(h===n)break t;if(d===t&&++u===r&&(a=o),d===s&&++f===i&&(l=o),(p=h.nextSibling)!==null)break;h=d,d=h.parentNode}h=p}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(zc={focusedElem:n,selectionRange:t},yl=!1,Se=e;Se!==null;)if(e=Se,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,Se=n;else for(;Se!==null;){e=Se;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var x=v.memoizedProps,m=v.memoizedState,c=e.stateNode,g=c.getSnapshotBeforeUpdate(e.elementType===e.type?x:jn(e.type,x),m);c.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var _=e.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(se(163))}}catch(S){Rt(e,e.return,S)}if(n=e.sibling,n!==null){n.return=e.return,Se=n;break}Se=e.return}return v=hp,hp=!1,v}function Lo(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&Qc(e,t,s)}r=r.next}while(r!==i)}}function Kl(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function Jc(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function Pg(n){var e=n.alternate;e!==null&&(n.alternate=null,Pg(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[ai],delete e[Wo],delete e[Oc],delete e[wx],delete e[Ax])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Lg(n){return n.tag===5||n.tag===3||n.tag===4}function pp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Lg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function ef(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=El));else if(i!==4&&(n=n.child,n!==null))for(ef(n,e,t),n=n.sibling;n!==null;)ef(n,e,t),n=n.sibling}function tf(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(tf(n,e,t),n=n.sibling;n!==null;)tf(n,e,t),n=n.sibling}var Xt=null,qn=!1;function Hi(n,e,t){for(t=t.child;t!==null;)Dg(n,e,t),t=t.sibling}function Dg(n,e,t){if(ci&&typeof ci.onCommitFiberUnmount=="function")try{ci.onCommitFiberUnmount(Vl,t)}catch{}switch(t.tag){case 5:tn||Es(t,e);case 6:var i=Xt,r=qn;Xt=null,Hi(n,e,t),Xt=i,qn=r,Xt!==null&&(qn?(n=Xt,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Xt.removeChild(t.stateNode));break;case 18:Xt!==null&&(qn?(n=Xt,t=t.stateNode,n.nodeType===8?Tu(n.parentNode,t):n.nodeType===1&&Tu(n,t),Oo(n)):Tu(Xt,t.stateNode));break;case 4:i=Xt,r=qn,Xt=t.stateNode.containerInfo,qn=!0,Hi(n,e,t),Xt=i,qn=r;break;case 0:case 11:case 14:case 15:if(!tn&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Qc(t,e,o),r=r.next}while(r!==i)}Hi(n,e,t);break;case 1:if(!tn&&(Es(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(a){Rt(t,e,a)}Hi(n,e,t);break;case 21:Hi(n,e,t);break;case 22:t.mode&1?(tn=(i=tn)||t.memoizedState!==null,Hi(n,e,t),tn=i):Hi(n,e,t);break;default:Hi(n,e,t)}}function mp(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new Vx),e.forEach(function(i){var r=Qx.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function Gn(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Xt=a.stateNode,qn=!1;break e;case 3:Xt=a.stateNode.containerInfo,qn=!0;break e;case 4:Xt=a.stateNode.containerInfo,qn=!0;break e}a=a.return}if(Xt===null)throw Error(se(160));Dg(s,o,r),Xt=null,qn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(u){Rt(r,e,u)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Ig(e,n),e=e.sibling}function Ig(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Gn(e,n),ii(n),i&4){try{Lo(3,n,n.return),Kl(3,n)}catch(x){Rt(n,n.return,x)}try{Lo(5,n,n.return)}catch(x){Rt(n,n.return,x)}}break;case 1:Gn(e,n),ii(n),i&512&&t!==null&&Es(t,t.return);break;case 5:if(Gn(e,n),ii(n),i&512&&t!==null&&Es(t,t.return),n.flags&32){var r=n.stateNode;try{No(r,"")}catch(x){Rt(n,n.return,x)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,a=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&t0(r,s),wc(a,o);var u=wc(a,s);for(o=0;o<l.length;o+=2){var f=l[o],h=l[o+1];f==="style"?o0(r,h):f==="dangerouslySetInnerHTML"?r0(r,h):f==="children"?No(r,h):sd(r,f,h,u)}switch(a){case"input":yc(r,s);break;case"textarea":n0(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?As(r,!!s.multiple,p,!1):d!==!!s.multiple&&(s.defaultValue!=null?As(r,!!s.multiple,s.defaultValue,!0):As(r,!!s.multiple,s.multiple?[]:"",!1))}r[Wo]=s}catch(x){Rt(n,n.return,x)}}break;case 6:if(Gn(e,n),ii(n),i&4){if(n.stateNode===null)throw Error(se(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(x){Rt(n,n.return,x)}}break;case 3:if(Gn(e,n),ii(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{Oo(e.containerInfo)}catch(x){Rt(n,n.return,x)}break;case 4:Gn(e,n),ii(n);break;case 13:Gn(e,n),ii(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(kd=bt())),i&4&&mp(n);break;case 22:if(f=t!==null&&t.memoizedState!==null,n.mode&1?(tn=(u=tn)||f,Gn(e,n),tn=u):Gn(e,n),ii(n),i&8192){if(u=n.memoizedState!==null,(n.stateNode.isHidden=u)&&!f&&n.mode&1)for(Se=n,f=n.child;f!==null;){for(h=Se=f;Se!==null;){switch(d=Se,p=d.child,d.tag){case 0:case 11:case 14:case 15:Lo(4,d,d.return);break;case 1:Es(d,d.return);var v=d.stateNode;if(typeof v.componentWillUnmount=="function"){i=d,t=d.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(x){Rt(i,t,x)}}break;case 5:Es(d,d.return);break;case 22:if(d.memoizedState!==null){vp(h);continue}}p!==null?(p.return=d,Se=p):vp(h)}f=f.sibling}e:for(f=null,h=n;;){if(h.tag===5){if(f===null){f=h;try{r=h.stateNode,u?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=s0("display",o))}catch(x){Rt(n,n.return,x)}}}else if(h.tag===6){if(f===null)try{h.stateNode.nodeValue=u?"":h.memoizedProps}catch(x){Rt(n,n.return,x)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===n)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===n)break e;for(;h.sibling===null;){if(h.return===null||h.return===n)break e;f===h&&(f=null),h=h.return}f===h&&(f=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Gn(e,n),ii(n),i&4&&mp(n);break;case 21:break;default:Gn(e,n),ii(n)}}function ii(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(Lg(t)){var i=t;break e}t=t.return}throw Error(se(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(No(r,""),i.flags&=-33);var s=pp(n);tf(n,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=pp(n);ef(n,a,o);break;default:throw Error(se(161))}}catch(l){Rt(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function Wx(n,e,t){Se=n,Ug(n)}function Ug(n,e,t){for(var i=(n.mode&1)!==0;Se!==null;){var r=Se,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||Ta;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||tn;a=Ta;var u=tn;if(Ta=o,(tn=l)&&!u)for(Se=r;Se!==null;)o=Se,l=o.child,o.tag===22&&o.memoizedState!==null?_p(r):l!==null?(l.return=o,Se=l):_p(r);for(;s!==null;)Se=s,Ug(s),s=s.sibling;Se=r,Ta=a,tn=u}gp(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,Se=s):gp(n)}}function gp(n){for(;Se!==null;){var e=Se;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:tn||Kl(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!tn)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:jn(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&ep(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}ep(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var u=e.alternate;if(u!==null){var f=u.memoizedState;if(f!==null){var h=f.dehydrated;h!==null&&Oo(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(se(163))}tn||e.flags&512&&Jc(e)}catch(d){Rt(e,e.return,d)}}if(e===n){Se=null;break}if(t=e.sibling,t!==null){t.return=e.return,Se=t;break}Se=e.return}}function vp(n){for(;Se!==null;){var e=Se;if(e===n){Se=null;break}var t=e.sibling;if(t!==null){t.return=e.return,Se=t;break}Se=e.return}}function _p(n){for(;Se!==null;){var e=Se;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{Kl(4,e)}catch(l){Rt(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Rt(e,r,l)}}var s=e.return;try{Jc(e)}catch(l){Rt(e,s,l)}break;case 5:var o=e.return;try{Jc(e)}catch(l){Rt(e,o,l)}}}catch(l){Rt(e,e.return,l)}if(e===n){Se=null;break}var a=e.sibling;if(a!==null){a.return=e.return,Se=a;break}Se=e.return}}var Xx=Math.ceil,Ul=ki.ReactCurrentDispatcher,zd=ki.ReactCurrentOwner,kn=ki.ReactCurrentBatchConfig,Ze=0,Ht=null,It=null,jt=0,Tn=0,Ts=_r(0),zt=0,Ko=null,Wr=0,Zl=0,Fd=0,Do=null,hn=null,kd=0,Hs=1/0,Ti=null,Nl=!1,nf=null,lr=null,wa=!1,nr=null,zl=0,Io=0,rf=null,ol=-1,al=0;function ln(){return Ze&6?bt():ol!==-1?ol:ol=bt()}function ur(n){return n.mode&1?Ze&2&&jt!==0?jt&-jt:Rx.transition!==null?(al===0&&(al=_0()),al):(n=st,n!==0||(n=window.event,n=n===void 0?16:w0(n.type)),n):1}function Jn(n,e,t,i){if(50<Io)throw Io=0,rf=null,Error(se(185));Jo(n,t,i),(!(Ze&2)||n!==Ht)&&(n===Ht&&(!(Ze&2)&&(Zl|=t),zt===4&&Qi(n,jt)),_n(n,i),t===1&&Ze===0&&!(e.mode&1)&&(Hs=bt()+500,jl&&xr()))}function _n(n,e){var t=n.callbackNode;R_(n,e);var i=xl(n,n===Ht?jt:0);if(i===0)t!==null&&Ch(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&Ch(t),e===1)n.tag===0?Cx(xp.bind(null,n)):W0(xp.bind(null,n)),Ex(function(){!(Ze&6)&&xr()}),t=null;else{switch(x0(i)){case 1:t=cd;break;case 4:t=g0;break;case 16:t=_l;break;case 536870912:t=v0;break;default:t=_l}t=Vg(t,Ng.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function Ng(n,e){if(ol=-1,al=0,Ze&6)throw Error(se(327));var t=n.callbackNode;if(Ls()&&n.callbackNode!==t)return null;var i=xl(n,n===Ht?jt:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=Fl(n,i);else{e=i;var r=Ze;Ze|=2;var s=Fg();(Ht!==n||jt!==e)&&(Ti=null,Hs=bt()+500,Or(n,e));do try{qx();break}catch(a){zg(n,a)}while(!0);Ed(),Ul.current=s,Ze=r,It!==null?e=0:(Ht=null,jt=0,e=zt)}if(e!==0){if(e===2&&(r=Pc(n),r!==0&&(i=r,e=sf(n,r))),e===1)throw t=Ko,Or(n,0),Qi(n,i),_n(n,bt()),t;if(e===6)Qi(n,i);else{if(r=n.current.alternate,!(i&30)&&!Yx(r)&&(e=Fl(n,i),e===2&&(s=Pc(n),s!==0&&(i=s,e=sf(n,s))),e===1))throw t=Ko,Or(n,0),Qi(n,i),_n(n,bt()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(se(345));case 2:br(n,hn,Ti);break;case 3:if(Qi(n,i),(i&130023424)===i&&(e=kd+500-bt(),10<e)){if(xl(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){ln(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=kc(br.bind(null,n,hn,Ti),e);break}br(n,hn,Ti);break;case 4:if(Qi(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var o=31-Qn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=bt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Xx(i/1960))-i,10<i){n.timeoutHandle=kc(br.bind(null,n,hn,Ti),i);break}br(n,hn,Ti);break;case 5:br(n,hn,Ti);break;default:throw Error(se(329))}}}return _n(n,bt()),n.callbackNode===t?Ng.bind(null,n):null}function sf(n,e){var t=Do;return n.current.memoizedState.isDehydrated&&(Or(n,e).flags|=256),n=Fl(n,e),n!==2&&(e=hn,hn=t,e!==null&&of(e)),n}function of(n){hn===null?hn=n:hn.push.apply(hn,n)}function Yx(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!ti(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Qi(n,e){for(e&=~Fd,e&=~Zl,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-Qn(e),i=1<<t;n[t]=-1,e&=~i}}function xp(n){if(Ze&6)throw Error(se(327));Ls();var e=xl(n,0);if(!(e&1))return _n(n,bt()),null;var t=Fl(n,e);if(n.tag!==0&&t===2){var i=Pc(n);i!==0&&(e=i,t=sf(n,i))}if(t===1)throw t=Ko,Or(n,0),Qi(n,e),_n(n,bt()),t;if(t===6)throw Error(se(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,br(n,hn,Ti),_n(n,bt()),null}function Od(n,e){var t=Ze;Ze|=1;try{return n(e)}finally{Ze=t,Ze===0&&(Hs=bt()+500,jl&&xr())}}function Xr(n){nr!==null&&nr.tag===0&&!(Ze&6)&&Ls();var e=Ze;Ze|=1;var t=kn.transition,i=st;try{if(kn.transition=null,st=1,n)return n()}finally{st=i,kn.transition=t,Ze=e,!(Ze&6)&&xr()}}function Bd(){Tn=Ts.current,_t(Ts)}function Or(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,Mx(t)),It!==null)for(t=It.return;t!==null;){var i=t;switch(yd(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Tl();break;case 3:Os(),_t(gn),_t(sn),bd();break;case 5:Rd(i);break;case 4:Os();break;case 13:_t(St);break;case 19:_t(St);break;case 10:Td(i.type._context);break;case 22:case 23:Bd()}t=t.return}if(Ht=n,It=n=cr(n.current,null),jt=Tn=e,zt=0,Ko=null,Fd=Zl=Wr=0,hn=Do=null,Nr!==null){for(e=0;e<Nr.length;e++)if(t=Nr[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}t.pending=i}Nr=null}return n}function zg(n,e){do{var t=It;try{if(Ed(),il.current=Il,Dl){for(var i=Mt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Dl=!1}if(Gr=0,Bt=Nt=Mt=null,Po=!1,jo=0,zd.current=null,t===null||t.return===null){zt=1,Ko=e,It=null;break}e:{var s=n,o=t.return,a=t,l=e;if(e=jt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var u=l,f=a,h=f.tag;if(!(f.mode&1)&&(h===0||h===11||h===15)){var d=f.alternate;d?(f.updateQueue=d.updateQueue,f.memoizedState=d.memoizedState,f.lanes=d.lanes):(f.updateQueue=null,f.memoizedState=null)}var p=op(o);if(p!==null){p.flags&=-257,ap(p,o,a,s,e),p.mode&1&&sp(s,u,e),e=p,l=u;var v=e.updateQueue;if(v===null){var x=new Set;x.add(l),e.updateQueue=x}else v.add(l);break e}else{if(!(e&1)){sp(s,u,e),Hd();break e}l=Error(se(426))}}else if(yt&&a.mode&1){var m=op(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),ap(m,o,a,s,e),Sd(Bs(l,a));break e}}s=l=Bs(l,a),zt!==4&&(zt=2),Do===null?Do=[s]:Do.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var c=xg(s,l,e);Jh(s,c);break e;case 1:a=l;var g=s.type,_=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(lr===null||!lr.has(_)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=yg(s,a,e);Jh(s,S);break e}}s=s.return}while(s!==null)}Og(t)}catch(P){e=P,It===t&&t!==null&&(It=t=t.return);continue}break}while(!0)}function Fg(){var n=Ul.current;return Ul.current=Il,n===null?Il:n}function Hd(){(zt===0||zt===3||zt===2)&&(zt=4),Ht===null||!(Wr&268435455)&&!(Zl&268435455)||Qi(Ht,jt)}function Fl(n,e){var t=Ze;Ze|=2;var i=Fg();(Ht!==n||jt!==e)&&(Ti=null,Or(n,e));do try{jx();break}catch(r){zg(n,r)}while(!0);if(Ed(),Ze=t,Ul.current=i,It!==null)throw Error(se(261));return Ht=null,jt=0,zt}function jx(){for(;It!==null;)kg(It)}function qx(){for(;It!==null&&!x_();)kg(It)}function kg(n){var e=Hg(n.alternate,n,Tn);n.memoizedProps=n.pendingProps,e===null?Og(n):It=e,zd.current=null}function Og(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=Hx(t,e),t!==null){t.flags&=32767,It=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{zt=6,It=null;return}}else if(t=Bx(t,e,Tn),t!==null){It=t;return}if(e=e.sibling,e!==null){It=e;return}It=e=n}while(e!==null);zt===0&&(zt=5)}function br(n,e,t){var i=st,r=kn.transition;try{kn.transition=null,st=1,$x(n,e,t,i)}finally{kn.transition=r,st=i}return null}function $x(n,e,t,i){do Ls();while(nr!==null);if(Ze&6)throw Error(se(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(se(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(b_(n,s),n===Ht&&(It=Ht=null,jt=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||wa||(wa=!0,Vg(_l,function(){return Ls(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=kn.transition,kn.transition=null;var o=st;st=1;var a=Ze;Ze|=4,zd.current=null,Gx(n,t),Ig(t,n),mx(zc),yl=!!Nc,zc=Nc=null,n.current=t,Wx(t),y_(),Ze=a,st=o,kn.transition=s}else n.current=t;if(wa&&(wa=!1,nr=n,zl=r),s=n.pendingLanes,s===0&&(lr=null),E_(t.stateNode),_n(n,bt()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(Nl)throw Nl=!1,n=nf,nf=null,n;return zl&1&&n.tag!==0&&Ls(),s=n.pendingLanes,s&1?n===rf?Io++:(Io=0,rf=n):Io=0,xr(),null}function Ls(){if(nr!==null){var n=x0(zl),e=kn.transition,t=st;try{if(kn.transition=null,st=16>n?16:n,nr===null)var i=!1;else{if(n=nr,nr=null,zl=0,Ze&6)throw Error(se(331));var r=Ze;for(Ze|=4,Se=n.current;Se!==null;){var s=Se,o=s.child;if(Se.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var u=a[l];for(Se=u;Se!==null;){var f=Se;switch(f.tag){case 0:case 11:case 15:Lo(8,f,s)}var h=f.child;if(h!==null)h.return=f,Se=h;else for(;Se!==null;){f=Se;var d=f.sibling,p=f.return;if(Pg(f),f===u){Se=null;break}if(d!==null){d.return=p,Se=d;break}Se=p}}}var v=s.alternate;if(v!==null){var x=v.child;if(x!==null){v.child=null;do{var m=x.sibling;x.sibling=null,x=m}while(x!==null)}}Se=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,Se=o;else e:for(;Se!==null;){if(s=Se,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Lo(9,s,s.return)}var c=s.sibling;if(c!==null){c.return=s.return,Se=c;break e}Se=s.return}}var g=n.current;for(Se=g;Se!==null;){o=Se;var _=o.child;if(o.subtreeFlags&2064&&_!==null)_.return=o,Se=_;else e:for(o=g;Se!==null;){if(a=Se,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Kl(9,a)}}catch(P){Rt(a,a.return,P)}if(a===o){Se=null;break e}var S=a.sibling;if(S!==null){S.return=a.return,Se=S;break e}Se=a.return}}if(Ze=r,xr(),ci&&typeof ci.onPostCommitFiberRoot=="function")try{ci.onPostCommitFiberRoot(Vl,n)}catch{}i=!0}return i}finally{st=t,kn.transition=e}}return!1}function yp(n,e,t){e=Bs(t,e),e=xg(n,e,1),n=ar(n,e,1),e=ln(),n!==null&&(Jo(n,1,e),_n(n,e))}function Rt(n,e,t){if(n.tag===3)yp(n,n,t);else for(;e!==null;){if(e.tag===3){yp(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(lr===null||!lr.has(i))){n=Bs(t,n),n=yg(e,n,1),e=ar(e,n,1),n=ln(),e!==null&&(Jo(e,1,n),_n(e,n));break}}e=e.return}}function Kx(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=ln(),n.pingedLanes|=n.suspendedLanes&t,Ht===n&&(jt&t)===t&&(zt===4||zt===3&&(jt&130023424)===jt&&500>bt()-kd?Or(n,0):Fd|=t),_n(n,e)}function Bg(n,e){e===0&&(n.mode&1?(e=ma,ma<<=1,!(ma&130023424)&&(ma=4194304)):e=1);var t=ln();n=Ni(n,e),n!==null&&(Jo(n,e,t),_n(n,t))}function Zx(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),Bg(n,t)}function Qx(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(se(314))}i!==null&&i.delete(e),Bg(n,t)}var Hg;Hg=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||gn.current)mn=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return mn=!1,Ox(n,e,t);mn=!!(n.flags&131072)}else mn=!1,yt&&e.flags&1048576&&X0(e,Cl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;sl(n,e),n=e.pendingProps;var r=zs(e,sn.current);Ps(e,t),r=Ld(null,e,i,n,r,t);var s=Dd();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,vn(i)?(s=!0,wl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Ad(e),r.updater=$l,e.stateNode=r,r._reactInternals=e,Xc(e,i,n,t),e=qc(null,e,i,!0,s,t)):(e.tag=0,yt&&s&&xd(e),an(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(sl(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=ey(i),n=jn(i,n),r){case 0:e=jc(null,e,i,n,t);break e;case 1:e=cp(null,e,i,n,t);break e;case 11:e=lp(null,e,i,n,t);break e;case 14:e=up(null,e,i,jn(i.type,n),t);break e}throw Error(se(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:jn(i,r),jc(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:jn(i,r),cp(n,e,i,r,t);case 3:e:{if(Tg(e),n===null)throw Error(se(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Z0(n,e),Pl(e,i,null,t);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Bs(Error(se(423)),e),e=fp(n,e,i,t,r);break e}else if(i!==r){r=Bs(Error(se(424)),e),e=fp(n,e,i,t,r);break e}else for(An=or(e.stateNode.containerInfo.firstChild),Cn=e,yt=!0,$n=null,t=$0(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Fs(),i===r){e=zi(n,e,t);break e}an(n,e,i,t)}e=e.child}return e;case 5:return Q0(e),n===null&&Vc(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,o=r.children,Fc(i,r)?o=null:s!==null&&Fc(i,s)&&(e.flags|=32),Eg(n,e),an(n,e,o,t),e.child;case 6:return n===null&&Vc(e),null;case 13:return wg(n,e,t);case 4:return Cd(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=ks(e,null,i,t):an(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:jn(i,r),lp(n,e,i,r,t);case 7:return an(n,e,e.pendingProps,t),e.child;case 8:return an(n,e,e.pendingProps.children,t),e.child;case 12:return an(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,pt(Rl,i._currentValue),i._currentValue=o,s!==null)if(ti(s.value,o)){if(s.children===r.children&&!gn.current){e=zi(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Li(-1,t&-t),l.tag=2;var u=s.updateQueue;if(u!==null){u=u.shared;var f=u.pending;f===null?l.next=l:(l.next=f.next,f.next=l),u.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),Gc(s.return,t,e),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(se(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),Gc(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}an(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ps(e,t),r=On(r),i=i(r),e.flags|=1,an(n,e,i,t),e.child;case 14:return i=e.type,r=jn(i,e.pendingProps),r=jn(i.type,r),up(n,e,i,r,t);case 15:return Sg(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:jn(i,r),sl(n,e),e.tag=1,vn(i)?(n=!0,wl(e)):n=!1,Ps(e,t),_g(e,i,r),Xc(e,i,r,t),qc(null,e,i,!0,n,t);case 19:return Ag(n,e,t);case 22:return Mg(n,e,t)}throw Error(se(156,e.tag))};function Vg(n,e){return m0(n,e)}function Jx(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Fn(n,e,t,i){return new Jx(n,e,t,i)}function Vd(n){return n=n.prototype,!(!n||!n.isReactComponent)}function ey(n){if(typeof n=="function")return Vd(n)?1:0;if(n!=null){if(n=n.$$typeof,n===ad)return 11;if(n===ld)return 14}return 2}function cr(n,e){var t=n.alternate;return t===null?(t=Fn(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function ll(n,e,t,i,r,s){var o=2;if(i=n,typeof n=="function")Vd(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case ps:return Br(t.children,r,s,e);case od:o=8,r|=8;break;case mc:return n=Fn(12,t,e,r|2),n.elementType=mc,n.lanes=s,n;case gc:return n=Fn(13,t,e,r),n.elementType=gc,n.lanes=s,n;case vc:return n=Fn(19,t,e,r),n.elementType=vc,n.lanes=s,n;case Qm:return Ql(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case Km:o=10;break e;case Zm:o=9;break e;case ad:o=11;break e;case ld:o=14;break e;case $i:o=16,i=null;break e}throw Error(se(130,n==null?n:typeof n,""))}return e=Fn(o,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function Br(n,e,t,i){return n=Fn(7,n,i,e),n.lanes=t,n}function Ql(n,e,t,i){return n=Fn(22,n,i,e),n.elementType=Qm,n.lanes=t,n.stateNode={isHidden:!1},n}function Du(n,e,t){return n=Fn(6,n,null,e),n.lanes=t,n}function Iu(n,e,t){return e=Fn(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function ty(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=hu(0),this.expirationTimes=hu(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=hu(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Gd(n,e,t,i,r,s,o,a,l){return n=new ty(n,e,t,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Fn(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ad(s),n}function ny(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:hs,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function Gg(n){if(!n)return pr;n=n._reactInternals;e:{if($r(n)!==n||n.tag!==1)throw Error(se(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(vn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(se(171))}if(n.tag===1){var t=n.type;if(vn(t))return G0(n,t,e)}return e}function Wg(n,e,t,i,r,s,o,a,l){return n=Gd(t,i,!0,n,r,s,o,a,l),n.context=Gg(null),t=n.current,i=ln(),r=ur(t),s=Li(i,r),s.callback=e??null,ar(t,s,r),n.current.lanes=r,Jo(n,r,i),_n(n,i),n}function Jl(n,e,t,i){var r=e.current,s=ln(),o=ur(r);return t=Gg(t),e.context===null?e.context=t:e.pendingContext=t,e=Li(s,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=ar(r,e,o),n!==null&&(Jn(n,r,o,s),nl(n,r,o)),o}function kl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Sp(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function Wd(n,e){Sp(n,e),(n=n.alternate)&&Sp(n,e)}function iy(){return null}var Xg=typeof reportError=="function"?reportError:function(n){console.error(n)};function Xd(n){this._internalRoot=n}eu.prototype.render=Xd.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(se(409));Jl(n,e,null,null)};eu.prototype.unmount=Xd.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;Xr(function(){Jl(null,n,null,null)}),e[Ui]=null}};function eu(n){this._internalRoot=n}eu.prototype.unstable_scheduleHydration=function(n){if(n){var e=M0();n={blockedOn:null,target:n,priority:e};for(var t=0;t<Zi.length&&e!==0&&e<Zi[t].priority;t++);Zi.splice(t,0,n),t===0&&T0(n)}};function Yd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function tu(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Mp(){}function ry(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var u=kl(o);s.call(u)}}var o=Wg(e,i,n,0,null,!1,!1,"",Mp);return n._reactRootContainer=o,n[Ui]=o.current,Vo(n.nodeType===8?n.parentNode:n),Xr(),o}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var u=kl(l);a.call(u)}}var l=Gd(n,0,!1,null,null,!1,!1,"",Mp);return n._reactRootContainer=l,n[Ui]=l.current,Vo(n.nodeType===8?n.parentNode:n),Xr(function(){Jl(e,l,t,i)}),l}function nu(n,e,t,i,r){var s=t._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=kl(o);a.call(l)}}Jl(e,o,n,r)}else o=ry(t,e,n,r,i);return kl(o)}y0=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=So(e.pendingLanes);t!==0&&(fd(e,t|1),_n(e,bt()),!(Ze&6)&&(Hs=bt()+500,xr()))}break;case 13:Xr(function(){var i=Ni(n,1);if(i!==null){var r=ln();Jn(i,n,1,r)}}),Wd(n,1)}};dd=function(n){if(n.tag===13){var e=Ni(n,134217728);if(e!==null){var t=ln();Jn(e,n,134217728,t)}Wd(n,134217728)}};S0=function(n){if(n.tag===13){var e=ur(n),t=Ni(n,e);if(t!==null){var i=ln();Jn(t,n,e,i)}Wd(n,e)}};M0=function(){return st};E0=function(n,e){var t=st;try{return st=n,e()}finally{st=t}};Cc=function(n,e,t){switch(e){case"input":if(yc(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=Yl(i);if(!r)throw Error(se(90));e0(i),yc(i,r)}}}break;case"textarea":n0(n,t);break;case"select":e=t.value,e!=null&&As(n,!!t.multiple,e,!1)}};u0=Od;c0=Xr;var sy={usingClientEntryPoint:!1,Events:[ta,_s,Yl,a0,l0,Od]},uo={findFiberByHostInstance:Ur,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},oy={bundleType:uo.bundleType,version:uo.version,rendererPackageName:uo.rendererPackageName,rendererConfig:uo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:ki.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=h0(n),n===null?null:n.stateNode},findFiberByHostInstance:uo.findFiberByHostInstance||iy,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Aa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Aa.isDisabled&&Aa.supportsFiber)try{Vl=Aa.inject(oy),ci=Aa}catch{}}bn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=sy;bn.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Yd(e))throw Error(se(200));return ny(n,e,null,t)};bn.createRoot=function(n,e){if(!Yd(n))throw Error(se(299));var t=!1,i="",r=Xg;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Gd(n,1,!1,null,null,t,!1,i,r),n[Ui]=e.current,Vo(n.nodeType===8?n.parentNode:n),new Xd(e)};bn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(se(188)):(n=Object.keys(n).join(","),Error(se(268,n)));return n=h0(e),n=n===null?null:n.stateNode,n};bn.flushSync=function(n){return Xr(n)};bn.hydrate=function(n,e,t){if(!tu(e))throw Error(se(200));return nu(null,n,e,!0,t)};bn.hydrateRoot=function(n,e,t){if(!Yd(n))throw Error(se(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",o=Xg;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=Wg(e,null,n,1,t??null,r,!1,s,o),n[Ui]=e.current,Vo(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new eu(e)};bn.render=function(n,e,t){if(!tu(e))throw Error(se(200));return nu(null,n,e,!1,t)};bn.unmountComponentAtNode=function(n){if(!tu(n))throw Error(se(40));return n._reactRootContainer?(Xr(function(){nu(null,null,n,!1,function(){n._reactRootContainer=null,n[Ui]=null})}),!0):!1};bn.unstable_batchedUpdates=Od;bn.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!tu(t))throw Error(se(200));if(n==null||n._reactInternals===void 0)throw Error(se(38));return nu(n,e,t,!1,i)};bn.version="18.3.1-next-f1338f8080-20240426";function Yg(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Yg)}catch(n){console.error(n)}}Yg(),Ym.exports=bn;var ay=Ym.exports,jg,Ep=ay;jg=Ep.createRoot,Ep.hydrateRoot;class ly{constructor(){ye(this,"ctx",null);ye(this,"master",null);ye(this,"noiseBuf",null);ye(this,"lx",0);ye(this,"ly",0);ye(this,"lz",0);ye(this,"lyaw",0);ye(this,"lpitch",0);ye(this,"panners",[]);ye(this,"pannerIdx",0)}init(){if(this.ctx){this.ctx.state==="suspended"&&this.ctx.resume();return}const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.master=this.ctx.createGain(),this.master.gain.value=.55,this.master.connect(this.ctx.destination);const t=this.ctx.sampleRate;this.noiseBuf=this.ctx.createBuffer(1,t,this.ctx.sampleRate);const i=this.noiseBuf.getChannelData(0);for(let r=0;r<t;r++)i[r]=Math.random()*2-1}setListener(e,t,i,r,s){if(this.lx=e,this.ly=t,this.lz=i,this.lyaw=r,this.lpitch=s,!this.ctx)return;const o=this.ctx.listener;if(typeof o.setPosition=="function")o.setPosition(e,t,i),o.setOrientation(-Math.sin(r)*Math.cos(s),Math.sin(s),-Math.cos(r)*Math.cos(s),0,1,0);else{o.positionX.value=e,o.positionY.value=t,o.positionZ.value=i;const a=-Math.sin(r)*Math.cos(s),l=Math.sin(s),u=-Math.cos(r)*Math.cos(s);o.forwardX.value=a,o.forwardY.value=l,o.forwardZ.value=u,o.upX.value=0,o.upY.value=1,o.upZ.value=0}}pan(e,t,i){const r=this.ctx.createGain(),s=e-this.lx,o=t-this.ly,a=i-this.lz,l=Math.hypot(s,o,a),u=Math.max(.04,1/(1+l*.09));r.gain.value=u;{const f=this.ctx.createPanner();f.panningModel="HRTF",f.distanceModel="linear",f.refDistance=4,f.maxDistance=80,f.rolloffFactor=1,f.positionX.value=e,f.positionY.value=t,f.positionZ.value=i,r.connect(f),f.connect(this.master)}return r}noise(e,t,i,r,s,o=0){if(!this.ctx||!this.noiseBuf)return;const a=this.ctx.createBufferSource();a.buffer=this.noiseBuf,a.loop=!0;const l=this.ctx.createBiquadFilter();l.type=i,l.frequency.value=t;const u=this.ctx.createGain(),f=this.ctx.currentTime+o;u.gain.setValueAtTime(r,f),u.gain.exponentialRampToValueAtTime(.001,f+e),a.connect(l),l.connect(u),u.connect(s??this.master),a.start(f,Math.random()),a.stop(f+e+.05)}tone(e,t,i,r,s,o=0,a=0){if(!this.ctx)return;const l=this.ctx.createOscillator();l.type=i;const u=this.ctx.currentTime+o;l.frequency.setValueAtTime(e,u),a!==0&&l.frequency.exponentialRampToValueAtTime(Math.max(20,e+a),u+t);const f=this.ctx.createGain();f.gain.setValueAtTime(r,u),f.gain.exponentialRampToValueAtTime(.001,u+t),l.connect(f),f.connect(s??this.master),l.start(u),l.stop(u+t+.05)}shot(e,t,i,r){if(!this.ctx)return;const s=this.pan(t,i,r),a=Math.hypot(t-this.lx,i-this.ly,r-this.lz)<8?1.6:1;switch(e){case"ak47":this.noise(.16,900,"lowpass",1.1*a,s),this.tone(95,.13,"square",.55*a,s,0,-45),this.tone(160,.1,"sawtooth",.3*a,s);break;case"m4a4":this.noise(.12,1400,"lowpass",.9*a,s),this.tone(130,.09,"square",.4*a,s,0,-30);break;case"awp":this.noise(.5,700,"lowpass",1.4*a,s),this.tone(55,.45,"sine",1.1*a,s,0,-25),this.tone(220,.25,"sawtooth",.3*a,s);break;case"deagle":this.noise(.16,1100,"lowpass",.95*a,s),this.tone(110,.12,"square",.5*a,s,0,-40);break;case"glock":case"usp":this.noise(.1,1900,"lowpass",.7*a,s),this.tone(280,.07,"square",.3*a,s);break;case"knife":this.noise(.14,2600,"bandpass",.3,s);break}}reload(e){this.ctx&&(e==="pistol"?(this.noise(.06,2200,"bandpass",.4,void 0,0),this.noise(.06,2600,"bandpass",.5,void 0,.5),this.noise(.07,2e3,"bandpass",.4,void 0,.9)):e==="rifle"?(this.noise(.07,1800,"bandpass",.5,void 0,0),this.noise(.07,2e3,"bandpass",.55,void 0,.55),this.noise(.09,1600,"bandpass",.5,void 0,1.1),this.tone(400,.05,"square",.15,void 0,1.35)):(this.noise(.08,1500,"bandpass",.5,void 0,0),this.noise(.08,1700,"bandpass",.55,void 0,.7),this.noise(.1,1400,"bandpass",.5,void 0,1.4),this.tone(300,.06,"square",.18,void 0,1.75)))}footstep(e,t,i,r){if(!this.ctx||Math.hypot(e-this.lx,t-this.ly,i-this.lz)>22)return;const o=this.pan(e,t,i);this.noise(.07,r?700:480,"lowpass",r?.5:.34,o),this.tone(r?95:80,.06,"sine",.35,o)}scope(e){this.ctx&&(e?(this.noise(.05,3e3,"highpass",.35),this.tone(900,.04,"sine",.2)):this.noise(.04,2400,"highpass",.3))}hit(e){this.ctx&&(this.tone(e?1500:1100,.06,"square",.28),this.noise(.04,3200,"highpass",.25))}kill(){this.ctx&&(this.tone(880,.09,"sine",.3),this.tone(1320,.14,"sine",.28,void 0,.07))}plantTick(){this.tone(1200,.05,"square",.22)}plantDone(){this.tone(600,.1,"square",.3),this.tone(900,.16,"square",.3,void 0,.1)}defuseTick(){this.tone(1500,.05,"sine",.22)}defused(){this.tone(1e3,.1,"sine",.3),this.tone(1400,.2,"sine",.3,void 0,.1)}explode(e,t,i){if(!this.ctx)return;const r=this.pan(e,t,i);this.noise(1.6,400,"lowpass",1.5,r),this.tone(40,1.3,"sine",1.2,r,0,-20)}roundStart(){this.tone(520,.12,"square",.25),this.tone(780,.2,"square",.25,void 0,.13)}roundEnd(e){const t=e?660:330;this.tone(t,.18,"square",.28),this.tone(t*1.5,.3,"square",.26,void 0,.18)}pickup(){this.tone(700,.07,"square",.25),this.tone(1050,.1,"square",.22,void 0,.06)}switchW(){this.noise(.05,1800,"bandpass",.3)}door(){this.noise(.3,500,"lowpass",.4)}beep(){if(!this.ctx||!this.master)return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="square",t.frequency.value=1180,i.gain.setValueAtTime(.001,e),i.gain.exponentialRampToValueAtTime(.16,e+.01),i.gain.exponentialRampToValueAtTime(1e-4,e+.09),t.connect(i).connect(this.master),t.start(e),t.stop(e+.1)}hurt(){this.tone(180,.12,"sawtooth",.3),this.noise(.1,800,"lowpass",.25)}}const af={ak47:{id:"ak47",name:"AK-47",slot:"primary",damage:36,armorAbsorb:.5,rpm:600,magSize:30,reserve:90,auto:!0,reloadTime:2.5,drawTime:1,spreadBase:.0038,spreadPerShot:.0032,spreadMax:.03,spreadMove:.012,spreadAir:.05,recoilKick:2.5,recoilMax:9,reloadSound:"rifle",fireSound:"ak",loudness:1,tracerColor:16765562},m4a4:{id:"m4a4",name:"M4A4",slot:"primary",damage:33,armorAbsorb:.5,rpm:667,magSize:30,reserve:90,auto:!0,reloadTime:3,drawTime:1,spreadBase:.0032,spreadPerShot:.002,spreadMax:.019,spreadMove:.01,spreadAir:.045,recoilKick:1.45,recoilMax:5.5,reloadSound:"rifle",fireSound:"m4",loudness:.9,tracerColor:16771496},awp:{id:"awp",name:"AWP",slot:"primary",damage:115,armorAbsorb:.25,rpm:41,magSize:5,reserve:30,auto:!1,reloadTime:3.7,drawTime:1.25,spreadBase:.14,spreadPerShot:.1,spreadMax:.3,spreadMove:.16,spreadAir:.3,recoilKick:11,recoilMax:14,zoomLevels:[0,1,2],zoomFovs:[70,40,12],spreadScoped:6e-4,reloadSound:"awp",fireSound:"awp",loudness:1.3,tracerColor:16769184},glock:{id:"glock",name:"Glock-18",slot:"secondary",damage:30,armorAbsorb:.5,rpm:400,magSize:20,reserve:120,auto:!1,reloadTime:2.2,drawTime:.6,spreadBase:.0045,spreadPerShot:.0028,spreadMax:.024,spreadMove:.011,spreadAir:.04,recoilKick:1.15,recoilMax:4.5,reloadSound:"pistol",fireSound:"pistol",loudness:.7,tracerColor:16773312},usp:{id:"usp",name:"USP-S",slot:"secondary",damage:35,armorAbsorb:.5,rpm:352,magSize:12,reserve:24,auto:!1,reloadTime:2.2,drawTime:.6,spreadBase:.0035,spreadPerShot:.0025,spreadMax:.021,spreadMove:.01,spreadAir:.038,recoilKick:1.3,recoilMax:4,reloadSound:"pistol",fireSound:"pistol",loudness:.65,tracerColor:16773312},deagle:{id:"deagle",name:"沙漠之鹰",slot:"secondary",damage:53,armorAbsorb:.5,rpm:267,magSize:7,reserve:35,auto:!1,reloadTime:2.2,drawTime:.8,spreadBase:.006,spreadPerShot:.007,spreadMax:.05,spreadMove:.016,spreadAir:.06,recoilKick:4,recoilMax:9,reloadSound:"pistol",fireSound:"deagle",loudness:.95,tracerColor:16769168},knife:{id:"knife",name:"军刀",slot:"melee",damage:40,armorAbsorb:.25,rpm:120,magSize:0,reserve:0,auto:!1,reloadTime:0,drawTime:.4,spreadBase:0,spreadPerShot:0,spreadMax:0,spreadMove:0,spreadAir:0,recoilKick:0,recoilMax:0,reloadSound:"none",fireSound:"knife",loudness:.2,tracerColor:16777215}},uy={head:2,chest:1,stomach:1.15,arms:.85,legs:.75},et={gravity:28,jumpVel:7,playerRun:5,playerWalk:2.6,botRun:4.4,botWalk:2.4,hw:.3,height:1.8,eye:1.62,stepMax:.56},Wt={freezeTime:8,liveTime:100,bombTime:35,plantTime:3.5,defuseTime:6,endTime:3.5,winRounds:8,bombRadius:24,bombDamage:500},ri={tick:.1,viewDist:40,fov:Math.PI*.94,reactionMin:.28,reactionMax:.6,aimSpeed:10,repathInterval:3.2},cy={T:{primary:null,secondary:"glock",armor:0},CT:{primary:null,secondary:"usp",armor:0}},Ca=(n=0,e=0,t=0)=>({x:n,y:e,z:t});function At(n,e,t,i){const r=n-t,s=e-i;return Math.hypot(r,s)}function fy(n,e){return Math.hypot(n.x-e.x,n.y-e.y,n.z-e.z)}function lf(n,e,t){return n<e?e:n>t?t:n}function Tp(n,e,t){return n+(e-n)*t}function uf(n,e){let t=n-e;for(;t>Math.PI;)t-=Math.PI*2;for(;t<-Math.PI;)t+=Math.PI*2;return t}function Uu(n,e,t){return n+lf(uf(e,n),-t,t)}function wp(n,e,t,i,r,s,o){let a=0,l=1/0;if(Math.abs(i)<1e-9){if(n<o.minX||n>o.maxX)return-1}else{let u=(o.minX-n)/i,f=(o.maxX-n)/i;if(u>f){const h=u;u=f,f=h}if(u>a&&(a=u),f<l&&(l=f),a>l)return-1}if(Math.abs(r)<1e-9){if(e<o.minY||e>o.maxY)return-1}else{let u=(o.minY-e)/r,f=(o.maxY-e)/r;if(u>f){const h=u;u=f,f=h}if(u>a&&(a=u),f<l&&(l=f),a>l)return-1}if(Math.abs(s)<1e-9){if(t<o.minZ||t>o.maxZ)return-1}else{let u=(o.minZ-t)/s,f=(o.maxZ-t)/s;if(u>f){const h=u;u=f,f=h}if(u>a&&(a=u),f<l&&(l=f),a>l)return-1}return a}function Nu(n,e,t,i,r,s){const o=s?.skip,a=s?.stepMax??.56;let l=!1,u=!1,f=!1;for(let h=0;h<2;h++){for(const d of r)if(!(o&&o(d))&&!(e.y+i<=d.minY+1e-4||e.y>=d.maxY-1e-4)&&!(d.step&&d.maxY-e.y<=a+1e-4)&&e.x+t>d.minX&&e.x-t<d.maxX&&e.z+t>d.minZ&&e.z-t<d.maxZ){if(n.x+t>d.minX&&n.x-t<d.maxX)continue;const p=e.x+t-d.minX,v=d.maxX-(e.x-t);Math.abs(p)<Math.abs(v)?e.x-=p+.002:e.x+=v+.002,u=!0}for(const d of r)if(!(o&&o(d))&&!(e.y+i<=d.minY+1e-4||e.y>=d.maxY-1e-4)&&!(d.step&&d.maxY-e.y<=a+1e-4)&&e.z+t>d.minZ&&e.z-t<d.maxZ&&e.x+t>d.minX&&e.x-t<d.maxX){if(n.z+t>d.minZ&&n.z-t<d.maxZ)continue;const p=e.z+t-d.minZ,v=d.maxZ-(e.z-t);Math.abs(p)<Math.abs(v)?e.z-=p+.002:e.z+=v+.002,f=!0}}for(const h of r){if(o&&o(h))continue;const d=e.x+t>h.minX+.03&&e.x-t<h.maxX-.03,p=e.z+t>h.minZ+.03&&e.z-t<h.maxZ-.03;!d||!p||e.y<h.maxY&&e.y+i>h.minY&&(n.y>=h.maxY-1e-4||e.y>=h.maxY-.55&&e.y<h.maxY&&n.y>e.y?(e.y=h.maxY,l=!0):n.y+i<=h.minY+1e-4&&e.y+i>h.minY&&(e.y=h.minY-i))}return{grounded:l,hitWallX:u,hitWallZ:f}}function dy(n,e,t,i,r,s,o=!1){let a=-1/0;for(const l of r)l.maxY>i+.01&&!(o&&l.step&&l.maxY<=i+.57)||n+t>l.minX&&n-t<l.maxX&&e+t>l.minZ&&e-t<l.maxZ&&l.maxY>a&&(a=l.maxY);return a}function hy(n,e,t,i,r=Math.random){let s,o,a;const l=Math.abs(n),u=Math.abs(e),f=Math.abs(t);l<u&&l<f?(s=0,o=-t,a=e):u<f?(s=-t,o=0,a=n):(s=-e,o=n,a=0);const h=Math.hypot(s,o,a)||1;s/=h,o/=h,a/=h;const d=e*a-t*o,p=t*s-n*a,v=n*o-e*s,x=Math.hypot(d,p,v)||1,m=r()*Math.PI*2,c=Math.tan(i)*Math.sqrt(r()),g=Math.cos(m)*c,_=Math.sin(m)*c,S=n+s*g+d/x*_,P=e+o*g+p/x*_,A=t+a*g+v/x*_,T=Math.hypot(S,P,A)||1;return{x:S/T,y:P/T,z:A/T}}function py(n){let e=n>>>0;return()=>{e|=0,e=e+1831565813|0;let t=Math.imul(e^e>>>15,1|e);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}const Z=(n,e,t,i,r,s,o="#c9ab78",a={})=>({x0:n,z0:e,x1:t,z1:i,y0:r,y1:s,color:o,...a}),Ue="#c9ab78",Gt="#b0986a",my="#b5a184",gy="#5d4630",X=[];X.push(Z(-60,-60.6,66,-59.8,0,4.4,Ue));X.push(Z(65.8,-60.6,66.6,60.6,0,4.4,Ue));X.push(Z(-60.6,59.8,66.6,60.6,0,4.4,Ue));X.push(Z(-60.6,-60.6,-59.8,60.6,0,4.4,Ue));X.push(Z(-8.4,-18.4,0,-17.6,0,4.4,Ue));X.push(Z(4,-18.4,10,-17.6,0,4.4,Ue));X.push(Z(14,-18.4,15.6,-17.6,0,4.4,Ue));const Yt={x0:0,z0:-18.25,x1:4,z1:-17.75,y0:0,y1:4.2,color:gy},vy=[{x0:0,x1:2,hinge:-1},{x0:2,x1:4,hinge:1}];X.push(Z(-8.4,-18.4,-7.6,10.4,0,4.4,Ue));X.push(Z(3.6,-12.4,4.4,10.4,0,4.4,Ue));X.push(Z(-40.4,9.6,-8,10.4,0,4.4,Ue));X.push(Z(3.6,10,4.4,60,0,4.4,Ue));X.push(Z(-60,10,-54,60,0,4.4,Gt));X.push(Z(-58,-58,-22,-32,0,1.2,"#d0b184",{walkable:!0}));X.push(Z(-54.4,-28,-53.6,10,0,4.4,Ue));X.push(Z(-40.4,-28,-39.6,10,0,4.4,Ue));X.push(Z(-60,-32,-54,10,0,4.4,Gt));X.push(Z(-54,-29,-44,-28,0,.3,"#d8c093",{step:!0}));X.push(Z(-54,-30,-44,-29,0,.6,"#d8c093",{step:!0}));X.push(Z(-54,-31,-44,-30,0,.9,"#d8c093",{step:!0}));X.push(Z(-54,-32,-44,-31,0,1.2,"#d8c093",{step:!0}));X.push(Z(56.6,-58,57.4,-10,0,4.4,Ue));X.push(Z(56.6,0,57.4,10,0,4.4,Ue));X.push(Z(54.6,-14,55.4,-10,0,4.4,Ue));X.push(Z(54.6,0,55.4,60,0,4.4,Ue));X.push(Z(55.4,-14,56.6,-10,0,4.4,Gt));X.push(Z(-24.4,-46.4,57,-45.6,0,4.4,Ue));X.push(Z(-21.6,-52,-21.3,-46,0,.3,"#d8c093",{step:!0}));X.push(Z(-21.9,-52,-21.6,-46,0,.6,"#d8c093",{step:!0}));X.push(Z(-22.2,-52,-21.9,-46,0,.9,"#d8c093",{step:!0}));X.push(Z(-22.2,-58,-21.8,-52,1.2,2.2,Ue,{rail:!0}));X.push(Z(-60,-60,-24,-58,0,4.4,Gt));X.push(Z(-22,-46,4,-32,0,4.4,Gt));X.push(Z(-40,-32,-27,-18,0,4.4,Gt));X.push(Z(46,-14.4,55,-13.6,0,4.4,Ue));X.push(Z(9.6,-12.3,10.4,60,0,4.4,Ue));X.push(Z(4,-12.3,10,60,0,4.4,Gt));X.push(Z(-8.4,-26,-7.6,-18,0,4.4,Ue));X.push(Z(-24,-22,-8,-18,0,4.4,Gt));X.push(Z(4,-12.3,20.4,-11.5,0,4.4,Ue));X.push(Z(15.6,-17.6,16.4,-12,0,4.4,Ue));X.push(Z(16.4,-17.7,20.4,-17.1,0,4.4,Ue));X.push(Z(9.6,-22,10.4,-13.25,0,4.4,Ue));X.push(Z(13.6,-22,14.4,-13.25,0,4.4,Ue));X.push(Z(10,-13.25,14,-12,0,.4,"#d8c093",{step:!0}));X.push(Z(10,-14.5,14,-13.25,0,.8,"#d8c093",{step:!0}));X.push(Z(10,-15.75,14,-14.5,0,1.2,"#d8c093",{step:!0}));X.push(Z(10,-17,14,-15.75,0,1.6,"#d8c093",{step:!0}));X.push(Z(10,-18.25,14,-17,0,2,"#d8c093",{step:!0}));X.push(Z(10,-19.5,14,-18.25,0,2.4,"#d8c093",{step:!0}));X.push(Z(10,-20.75,14,-19.5,0,2.8,"#d8c093",{step:!0}));X.push(Z(10,-22,14,-20.75,0,3.2,"#d8c093",{step:!0}));X.push(Z(16,-18.4,20,-17.6,0,.4,"#d8c093",{step:!0}));X.push(Z(16,-19.2,20,-18.4,0,.8,"#d8c093",{step:!0}));X.push(Z(16,-20,20,-19.2,0,1.2,"#d8c093",{step:!0}));X.push(Z(16,-20.8,20,-20,0,1.6,"#d8c093",{step:!0}));X.push(Z(16,-21.6,20,-20.8,0,2,"#d8c093",{step:!0}));X.push(Z(16,-22.4,20,-21.6,0,2.2,"#d8c093",{step:!0}));X.push(Z(19.6,-22.4,20.4,-17.6,0,2.2,Ue));X.push(Z(20,-46,26,-26,0,1.2,"#d0b184",{walkable:!0}));X.push(Z(19.6,-46,20.4,-26,1.2,4.4,Ue));X.push(Z(25.6,-46,26.4,-42,1.2,4.4,Ue));X.push(Z(25.6,-36,26.4,-32,1.2,4.4,Ue));X.push(Z(25.6,-28,26.4,-26,1.2,4.4,Ue));X.push(Z(25.6,-42,26.4,-36,3.2,5.2,Ue));X.push(Z(25.6,-32,26.4,-28,1.2,2.2,Ue));X.push(Z(25.6,-32,26.4,-28,3.2,5.2,Ue));X.push(Z(20,-23.2,26,-18,1.8,2.2,"#d0b184",{walkable:!0}));X.push(Z(20,-26,26,-24.6,1.2,1.7,"#d8c093",{step:!0}));X.push(Z(20,-24.6,26,-23.2,1.2,2.2,"#d8c093",{step:!0}));X.push(Z(26,-42,29,-36,0,1.2,"#d0b184",{walkable:!0}));X.push(Z(26,-32,29,-28,0,1.2,"#d0b184",{walkable:!0}));X.push(Z(26,-36,29,-32,0,3.2,Gt));X.push(Z(26,-28,29,-26,0,3.2,Gt));X.push(Z(26,-46,29,-42,0,4.4,Gt));X.push(Z(26,-46,28,-42,0,4.4,Gt));X.push(Z(26,-36,28,-32,0,4.4,Gt));X.push(Z(26,-28,28,-26,0,4.4,Gt));X.push(Z(26,-22,28,-17.6,0,4.4,Gt));X.push(Z(16.5,-26.4,20,-26,-2,4.4,Ue));X.push(Z(20,-26.4,26,-26,-2,0,Ue));X.push(Z(20.4,-21.6,28,-20.8,-2,4.4,Ue));X.push(Z(16,-21.6,20,-20.8,-2,0,Ue));X.push(Z(27.6,-24,28.4,-22,-2,0,Ue));X.push(Z(15.6,-24,16.4,-22,-2,3.2,Ue));X.push(Z(15.6,-26,16.5,-24,-.4,0,"#d8c093",{step:!0}));X.push(Z(16.5,-26,17.4,-24,-.8,-.4,"#d8c093",{step:!0}));X.push(Z(17.4,-26,18.3,-24,-1.2,-.8,"#d8c093",{step:!0}));X.push(Z(18.3,-26,19.2,-24,-1.6,-1.2,"#d8c093",{step:!0}));X.push(Z(19.2,-26,20.1,-24,-2,-1.6,"#d8c093",{step:!0}));X.push(Z(27,-26,27.9,-24,-2,-1.6,"#d8c093",{step:!0}));X.push(Z(27.9,-26,28.8,-24,-2,-1.2,"#d8c093",{step:!0}));X.push(Z(28.8,-26,29.7,-24,-2,-.8,"#d8c093",{step:!0}));X.push(Z(29.7,-26,30.6,-24,-2,-.4,"#d8c093",{step:!0}));X.push(Z(30.6,-26,31.5,-24,-2,0,"#d8c093",{step:!0}));X.push(Z(27.6,-22,28.4,-14,0,4.4,Ue));X.push(Z(45.6,-26,46.4,-14,0,4.4,Ue));X.push(Z(28,-26.4,38,-26,0,4.4,Ue));X.push(Z(38,-23.33,46,-22,0,.4,"#d8c093",{step:!0}));X.push(Z(38,-24.67,46,-23.33,0,.8,"#d8c093",{step:!0}));X.push(Z(38,-26,46,-24.67,0,1.2,"#d8c093",{step:!0}));X.push(Z(46,-26,57,-14,0,4.4,Gt));X.push(Z(29,-46,58,-26,0,1.2,"#d0b184",{walkable:!0}));X.push(Z(45.6,-26.4,58,-25.6,1.2,4.4,Ue));X.push(Z(57.6,-46,58.4,-26,1.2,4.4,Ue));X.push(Z(28.6,-46,29.4,-42,1.2,4.4,Ue));X.push(Z(28.6,-36,29.4,-32,1.2,4.4,Ue));X.push(Z(28.6,-28,29.4,-26,1.2,4.4,Ue));X.push(Z(-22,-32,15.6,-26,0,3.2,Gt,{walkable:!0}));X.push(Z(-27,-26,-8,-22,0,3.2,Gt,{walkable:!0}));X.push(Z(-8,-26,20,-22,3.2,3.6,"#d8c093",{walkable:!0}));X.push(Z(-8,-22.3,10,-22,3.2,3.9,Ue,{rail:!0}));X.push(Z(14,-22.3,20,-22,3.2,3.9,Ue,{rail:!0}));X.push(Z(-8,-26,20,-25.7,3.2,3.9,Ue,{rail:!0}));X.push(Z(-22,-26.3,-8,-26,3.2,3.9,Ue,{rail:!0}));X.push(Z(-27,-32,-22,-26,0,1.2,"#d0b184",{walkable:!0}));X.push(Z(-23,-32,-22,-27,1.2,2.7,"#d8c093",{step:!0}));X.push(Z(-24,-32,-23,-27,1.2,2.2,"#d8c093",{step:!0}));X.push(Z(-25,-32,-24,-27,1.2,1.7,"#d8c093",{step:!0}));X.push(Z(-27,-32,-23.1,-26,3.2,3.6,"#d8c093",{walkable:!0}));X.push(Z(-22,-46,15.6,-32,0,4.4,my));const $t=(n,e,t,i,r)=>Z(n-t/2,e-t/2,n+t/2,e+t/2,r,r+i,"#8a6a45");X.push($t(-46,-52,2.2,1.2,1.2));X.push($t(-36,-46,1.6,1.1,1.2));X.push($t(-54,-44,1.3,1,1.2));X.push($t(42,-40,2.6,1.5,1.2));X.push($t(37,-33,1.5,1.1,1.2));X.push($t(50,-46,1.6,1.2,1.2));X.push($t(24,-30,1.2,1.2,1.2));X.push($t(-3,2,1.6,1.1,0));X.push($t(-48,42,1.7,1.1,0));X.push($t(-20,46,1.3,1,0));X.push($t(22,26,1.8,1.2,0));X.push($t(44,20,1.3,1,0));X.push($t(32,-24,1.4,1.1,0));X.push($t(2,-22,1.3,1,0));X.push($t(61,-30,1.3,1,0));X.push($t(18,-38,1.2,1,1.2));X.push($t(23,-21,1.2,1.2,0));for(const n of X)if(n.step){const e=n.y1;n.y0=e-.35}const iu=[{x0:-54,z0:10,x1:4,z1:60,y:0},{x0:-54,z0:-28,x1:-40,z1:10,y:0},{x0:-10,z0:-18,x1:4,z1:10,y:0},{x0:10,z0:-14,x1:55,z1:60,y:0},{x0:-8,z0:-26,x1:15.6,z1:-18.4,y:0},{x0:20,z0:-22,x1:26,z1:-17.6,y:0},{x0:16.4,z0:-17.1,x1:26,z1:-14,y:0},{x0:4,z0:-18,x1:16,z1:-12,y:0},{x0:28,z0:-26,x1:46,z1:-14,y:0},{x0:57,z0:-58,x1:66,z1:10,y:0},{x0:55,z0:-10,x1:57,z1:0,y:0},{x0:55,z0:0,x1:57,z1:10,y:0},{x0:57,z0:10,x1:66,z1:60,y:0},{x0:-21.3,z0:-60,x1:66,z1:-46,y:0},{x0:-22.6,z0:-60,x1:-21.3,z1:-52,y:0},{x0:16,z0:-26,x1:28,z1:-22,y:-2},{x0:-54,z0:-29,x1:-44,z1:-28,y:.3},{x0:-54,z0:-30,x1:-44,z1:-29,y:.6},{x0:-54,z0:-31,x1:-44,z1:-30,y:.9},{x0:-54,z0:-32,x1:-44,z1:-31,y:1.2},{x0:16,z0:-18.4,x1:20,z1:-17.6,y:.4},{x0:16,z0:-19.2,x1:20,z1:-18.4,y:.8},{x0:16,z0:-20,x1:20,z1:-19.2,y:1.2},{x0:16,z0:-20.8,x1:20,z1:-20,y:1.6},{x0:16,z0:-21.6,x1:20,z1:-20.8,y:2},{x0:16,z0:-22.4,x1:20,z1:-21.6,y:2.2},{x0:15.6,z0:-26,x1:16.5,z1:-24,y:0},{x0:16.5,z0:-26,x1:17.4,z1:-24,y:-.4},{x0:17.4,z0:-26,x1:18.3,z1:-24,y:-.8},{x0:18.3,z0:-26,x1:19.2,z1:-24,y:-1.2},{x0:19.2,z0:-26,x1:20.1,z1:-24,y:-1.6},{x0:10,z0:-13.25,x1:14,z1:-12,y:.4},{x0:10,z0:-14.5,x1:14,z1:-13.25,y:.8},{x0:10,z0:-15.75,x1:14,z1:-14.5,y:1.2},{x0:10,z0:-17,x1:14,z1:-15.75,y:1.6},{x0:10,z0:-18.25,x1:14,z1:-17,y:2},{x0:10,z0:-19.5,x1:14,z1:-18.25,y:2.4},{x0:10,z0:-20.75,x1:14,z1:-19.5,y:2.8},{x0:10,z0:-22,x1:14,z1:-20.75,y:3.2},{x0:27,z0:-26,x1:27.9,z1:-24,y:-1.6},{x0:27.9,z0:-26,x1:28.8,z1:-24,y:-1.2},{x0:28.8,z0:-26,x1:29.7,z1:-24,y:-.8},{x0:29.7,z0:-26,x1:30.6,z1:-24,y:-.4},{x0:30.6,z0:-26,x1:31.5,z1:-24,y:0},{x0:38,z0:-23.33,x1:46,z1:-22,y:.4},{x0:38,z0:-24.67,x1:46,z1:-23.33,y:.8},{x0:38,z0:-26,x1:46,z1:-24.67,y:1.2},{x0:-21.6,z0:-52,x1:-21.3,z1:-46,y:.3},{x0:-21.9,z0:-52,x1:-21.6,z1:-46,y:.6},{x0:-22.2,z0:-52,x1:-21.9,z1:-46,y:.9},{x0:-58,z0:-58,x1:-21.9,z1:-32,y:1.2},{x0:29,z0:-46,x1:58,z1:-26,y:1.2},{x0:20,z0:-46,x1:26,z1:-26,y:1.2},{x0:26,z0:-42,x1:29,z1:-36,y:1.2},{x0:26,z0:-32,x1:29,z1:-28,y:1.2},{x0:20,z0:-23.2,x1:26,z1:-18,y:2.2},{x0:20,z0:-26,x1:26,z1:-24.6,y:1.7},{x0:20,z0:-24.6,x1:26,z1:-23.2,y:2.2},{x0:-27,z0:-26,x1:-8,z1:-22,y:3.2},{x0:-22,z0:-32,x1:15.6,z1:-26,y:3.2},{x0:-8,z0:-26,x1:20,z1:-22,y:3.2},{x0:-27,z0:-32,x1:-23.1,z1:-26,y:3.2},{x0:-27,z0:-32,x1:-22,z1:-26,y:1.2},{x0:-23,z0:-32,x1:-22,z1:-27,y:2.7},{x0:-24,z0:-32,x1:-23,z1:-27,y:2.2},{x0:-25,z0:-32,x1:-24,z1:-27,y:1.7}];for(const n of iu)(n.x1-n.x0<=1.6||n.z1-n.z0<=1.6)&&(n.thin=!0);const _y={T:[{x:18,z:24},{x:28,z:30},{x:38,z:24},{x:46,z:30},{x:34,z:40}],CT:[{x:-48,z:24},{x:-38,z:30},{x:-28,z:24},{x:-18,z:30},{x:-44,z:38}]},Dn={tSpawn:[{x:20,z:20},{x:30,z:26},{x:44,z:16},{x:30,z:44},{x:18,z:44}],tMid:[{x:0,z:-21},{x:12,z:-24}],tunnels:[{x:32,z:-20},{x:42,z:-24},{x:30,z:-17}],lower:[{x:24,z:-24}],aLong:[{x:61,z:-20},{x:61,z:-44},{x:50,z:-52}],bSite:[{x:36,z:-32},{x:44,z:-40},{x:52,z:-30},{x:44,z:-29}],aSite:[{x:-30,z:-44},{x:-44,z:-50},{x:-52,z:-38}],ctSpawn:[{x:-44,z:24},{x:-36,z:34},{x:-24,z:24},{x:-16,z:34},{x:-40,z:44}],mid:[{x:-2,z:-6},{x:0,z:4}],midToB:[{x:8,z:-15},{x:16,z:-15},{x:18,z:-24},{x:18,z:-38}],bDoors:[{x:24,z:-39}]},co={aSite:[{x:-30,z:-44},{x:-52,z:-38},{x:-40,z:-48}],bSite:[{x:44,z:-40},{x:36,z:-32},{x:52,z:-30}],mid:[{x:-2,z:-4},{x:-2,z:2}]},qg={A:{x0:-58,z0:-58,x1:-22,z1:-32,name:"A点"},B:{x0:29,z0:-46,x1:58,z1:-26,name:"B点"}},Qr={A:[{x:-40,z:-45},{x:-34,z:-50},{x:-46,z:-50}],B:[{x:40,z:-35},{x:48,z:-35},{x:40,z:-42}]};{const n=new Set;for(const e of iu){if(e.thin)continue;const t=`${e.x0},${e.z0},${e.x1},${e.z1}`;n.has(t)||(n.add(t),X.push(Z(e.x0,e.z0,e.x1,e.z1,e.y-.5,e.y,"#c4a878",{floor:!0})))}}const xy=X.map(n=>({minX:n.x0,maxX:n.x1,minY:n.y0,maxY:n.y1,minZ:n.z0,maxZ:n.z1,penetrable:n.penetrable,step:!!n.step})),cf=xy,yy=X.filter(n=>!n.step&&!n.walkable&&!n.floor).map(n=>({minX:n.x0,maxX:n.x1,minY:n.y0,maxY:n.y1,minZ:n.z0,maxZ:n.z1})),Sy=X.filter(n=>!n.floor),Ap={minX:Yt.x0,maxX:Yt.x1,minY:Yt.y0,maxY:Yt.y1,minZ:Yt.z0,maxZ:Yt.z1,penetrable:!0},Cp={walls:X.filter(n=>!n.step&&!n.floor&&n.y0<=0&&n.y1>=2).map(n=>({x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1})),floors:iu.map(n=>({x0:n.x0,z0:n.z0,x1:n.x1,z1:n.z1}))};function My(n,e,t,i,r,s,o){const a=i-n,l=r-e,u=s-t;let f=0,h=1;const d=(p,v,x,m,c)=>{if(Math.abs(c)<1e-12)return p>=x&&p<=m;let g=(x-p)/c,_=(m-p)/c;if(g>_){const S=g;g=_,_=S}return g>f&&(f=g),_<h&&(h=_),f<=h};return!(!d(n,i,o.minX,o.maxX,a)||!d(e,r,o.minY,o.maxY,l)||!d(t,s,o.minZ,o.maxZ,u))}function Rp(n,e,t,i,r,s){for(const o of cf)if(My(n,e,t,i,r,s,o))return!1;return!0}const Je=.9,bp=-60.9,vi=-60.9,Ct=6;function Ey(){const n=Math.ceil((66.9-bp)/Je)+1,e=Math.ceil((-vi+60.9)/Je)+1,t=bp,i=(y,R)=>R*n+y,r=[],s=yy.map(y=>({minX:y.minX,maxX:y.maxX,minZ:y.minZ,maxZ:y.maxZ,minY:y.minY,maxY:y.maxY}));for(const y of X)(y.step||y.walkable)&&s.push({minX:y.x0,maxX:y.x1,minZ:y.z0,maxZ:y.z1,minY:y.y0,maxY:y.y1,step:!!y.step});const o=1.8;for(let y=0;y<e;y++)for(let R=0;R<n;R++){const I=t+R*Je,D=vi+y*Je,G=I+Je,W=D+Je,B=[],q=new Set;for(const k of iu)if(k.thin){const V=(I+G)/2,ee=(D+W)/2;if(V>=k.x0-.3&&V<=k.x1+.3&&ee>=k.z0-.3&&ee<=k.z1+.3){const re=Math.round(k.y*100);q.has(re)||(q.add(re),B.push(k.y))}}else{const V=Math.max(I,k.x0),ee=Math.min(G,k.x1),re=Math.max(D,k.z0),Ie=Math.min(W,k.z1);if(ee-V>=.02&&Ie-re>=.02){const $=Math.round(k.y*100);q.has($)||(q.add($),B.push(k.y))}}const b=[];for(const k of B){let V=!1;for(const ee of s){if(k+o<=ee.minY+.02||k>=ee.maxY-.02||ee.maxY-k<=.62)continue;let re;if(ee.step){const Ie=(I+G)/2,$=(D+W)/2;re=Ie>=ee.minX-.3&&Ie<=ee.maxX+.3&&$>=ee.minZ-.3&&$<=ee.maxZ+.3}else re=I<ee.maxX-.02&&G>ee.minX+.02&&D<ee.maxZ-.02&&W>ee.minZ+.02;if(re){V=!0;break}}V||b.push(k)}b.sort((k,V)=>k-V),r.push(b)}const a=(y,R)=>{const I=Math.floor((y-t)/Je),D=Math.floor((R-vi)/Je);return I<0||I>=n||D<0||D>=e?null:[I,D]},l=(y,R)=>{const I=r[i(y[0],y[1])];if(!I.length)return-1;let D=0;for(let G=0;G<I.length;G++)Math.abs(I[G]-R)<Math.abs(I[D]-R)&&(D=G);return D},u=new Map;for(const y of s){const R=Math.floor((y.minX-.2)/4),I=Math.floor((y.maxX+.2)/4),D=Math.floor((y.minZ-.2)/4),G=Math.floor((y.maxZ+.2)/4);for(let W=R;W<=I;W++)for(let B=D;B<=G;B++){const q=`${W},${B}`,b=u.get(q);b?b.push(y):u.set(q,[y])}}const f=(y,R,I,D,G)=>{const W=Math.min(y,I)-.2,B=Math.max(y,I)+.2,q=Math.min(R,D)-.2,b=Math.max(R,D)+.2;for(let k=Math.floor(W/4);k<=Math.floor(B/4);k++)for(let V=Math.floor(q/4);V<=Math.floor(b/4);V++){const ee=u.get(`${k},${V}`);if(ee)for(const re of ee)G.push(re)}},h=(y,R,I,D,G,W,B,q)=>{const b=I-y,k=D-R;let V=0,ee=1;const re=(Ie,$,ie,fe,le)=>{if(Math.abs(le)<1e-12)return Ie>=ie&&Ie<=fe;let ce=(ie-Ie)/le,Pe=(fe-Ie)/le;if(ce>Pe){const ze=ce;ce=Pe,Pe=ze}return ce>V&&(V=ce),Pe<ee&&(ee=Pe),V<=ee};return!re(y,I,G,B,b)||!re(R,D,W,q,k)?-1:V},d=(y,R,I,D,G)=>{const W=[];f(y,R,I,D,W);for(const B of W)if(!(B.maxY-G<=.57)&&!(B.minY-G>=1.78)&&Pp(y,R,I,D,B.minX-.2,B.minZ-.2,B.maxX+.2,B.maxZ+.2))return!1;return!0},p=(y,R,I,D,G,W)=>{const B=[],q=[];f(y,R,I,D,q);for(const k of q){if(k.maxY<=G+.02||k.minY>=G+1.78)continue;const V=h(y,R,I,D,k.minX-.2,k.minZ-.2,k.maxX+.2,k.maxZ+.2);V>=0&&B.push({t:V,top:k.maxY})}B.sort((k,V)=>k.t-V.t);let b=G;for(const k of B)if(k.top<=b+.57)b=Math.max(b,k.top);else return!1;return b>=W-.02},v=new Int8Array(n*e*Ct*8*Ct);{const y=[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]];for(let R=0;R<e;R++)for(let I=0;I<n;I++){const D=i(I,R),G=r[D],W=t+I*Je+Je/2,B=vi+R*Je+Je/2;for(let q=0;q<G.length;q++){const b=G[q],k=D*Ct+q;for(let V=0;V<9;V++){if(V===4)continue;const ee=I+y[V][0],re=R+y[V][1];if(ee<0||ee>=n||re<0||re>=e)continue;const Ie=i(ee,re),$=r[Ie],ie=t+ee*Je+Je/2,fe=vi+re*Je+Je/2,le=(k*8+V)*Ct;for(let ce=0;ce<$.length;ce++){const Pe=$[ce];let ze=!0;Pe-b>.02?ze=p(W,B,ie,fe,b,Pe):Pe>b-.02&&(ze=d(W,B,ie,fe,b)),v[le+ce]=ze?1:0}}}}}const x=new Float32Array(n*e*Ct),m=new Int32Array(n*e*Ct),c=new Uint32Array(n*e*Ct);let g=0;const _=(y,R,I,D,G,W)=>{const B=a(y,I),q=a(D,G);if(!B||!q)return null;const b=i(B[0],B[1]),k=i(q[0],q[1]);if(!r[b].length||!r[k].length)return null;const V=l(B,R),ee=W!==void 0?l(q,W):0,re=b*Ct+V,Ie=k*Ct+ee;if(re===Ie)return[{x:D,z:G,y:r[k][ee]}];g++;const $=x,ie=m,fe=c,le=g,ce=[],Pe=(Le,De)=>{ce.push({i:Le,f:De});let _e=ce.length-1;for(;_e>0;){const Ve=_e-1>>1;if(ce[Ve].f<=ce[_e].f)break;[ce[Ve],ce[_e]]=[ce[_e],ce[Ve]],_e=Ve}},ze=()=>{const Le=ce[0].i,De=ce.pop();if(ce.length){ce[0]=De;let _e=0;for(;;){const Ve=_e*2+1,we=Ve+1;let C=_e;if(Ve<ce.length&&ce[Ve].f<ce[C].f&&(C=Ve),we<ce.length&&ce[we].f<ce[C].f&&(C=we),C===_e)break;[ce[C],ce[_e]]=[ce[_e],ce[C]],_e=C}}return Le},ut=Le=>{const De=Le/Ct|0,_e=De%n,Ve=De/n|0,we=Le%Ct,C=Math.hypot(_e-q[0],Ve-q[1]),M=W!==void 0&&r[De][we]!==void 0?Math.abs(r[De][we]-W)*.5:0;return(C+M)*1.001};$[re]=0,fe[re]=le,Pe(re,ut(re));let Ye=!1,xt=re;for(;ce.length;){const Le=ze();if(fe[Le]===le&&Le!==re)continue;fe[Le]=le;const De=Le/Ct|0;if(De===k){const O=Le%Ct;if(W===void 0||Math.abs(r[De][O]-W)<=.61){Ye=!0,xt=Le;break}}const _e=Le%Ct,Ve=r[De][_e],we=De%n,C=De/n|0,M=(O,J)=>{const ne=O/Ct|0,Q=O%Ct,Te=r[ne][Q];if(Te===void 0||Math.abs(Te-Ve)>.6)return;const de=fe[O]===le?$[O]:1/0,me=$[Le]+J;me<de&&($[O]=me,ie[O]=Le,Pe(O,me+ut(O)))};for(let O=0;O<r[De].length;O++){if(O===_e)continue;const J=r[De][O]>Ve;M(De*Ct+O,J?2.5:.25)}for(let O=-1;O<=1;O++)for(let J=-1;J<=1;J++){if(!J&&!O)continue;const ne=we+J,Q=C+O;if(ne<0||ne>=n||Q<0||Q>=e)continue;const Te=i(ne,Q),de=J!==0&&O!==0?1.414:1,me=(O+1)*3+(J+1),qe=((De*Ct+_e)*8+me)*Ct;for(let oe=0;oe<r[Te].length;oe++)v[qe+oe]&&M(Te*Ct+oe,de)}}if(!Ye)return null;const N=[];let Ut=xt;for(;Ut!==-1&&Ut!==re;){const Le=Ut/Ct|0,De=Ut%Ct;N.push({x:t+Le%n*Je+Je/2,z:vi+(Le/n|0)*Je+Je/2,y:r[Le][De]}),Ut=ie[Ut]}return N.push({x:y,z:I,y:r[b][V]}),N.reverse(),N},S=(y,R,I,D)=>{for(const G of s)if(Pp(y,R,I,D,G.minX-.2,G.minZ-.2,G.maxX+.2,G.maxZ+.2))return!1;return!0};return{path:(y,R,I,D,G,W)=>{const B=_(y,R,I,D,G,W);if(!B)return null;const q=[B[0]];let b=0;for(;b<B.length-1;){let k=b+1;for(let V=B.length-1;V>b+1;V--)if(!(Math.abs(B[V].y-B[b].y)>.01)&&S(B[b].x,B[b].z,B[V].x,B[V].z)){k=V;break}q.push(B[k]),b=k}return q},pathRaw:_,nearestWalkable:(y,R)=>{const I=a(y,R);if(I){const D=r[i(I[0],I[1])];if(D.length)return{x:t+I[0]*Je+Je/2,z:vi+I[1]*Je+Je/2,y:D[0]}}for(let D=1;D<20;D++)for(let G=-D;G<=D;G++)for(let W=-D;W<=D;W++){if(Math.max(Math.abs(W),Math.abs(G))!==D)continue;const B=I?I[0]+W:0,q=I?I[1]+G:0;if(B<0||B>=n||q<0||q>=e)continue;const b=r[i(B,q)];if(b.length)return{x:t+B*Je+Je/2,z:vi+q*Je+Je/2,y:b[0]}}return null},randomPointNear:(y,R,I,D=Math.random)=>{for(let G=0;G<24;G++){const W=D()*Math.PI*2,B=D()*I,q=y+Math.cos(W)*B,b=R+Math.sin(W)*B,k=a(q,b);if(k){const V=r[i(k[0],k[1])];if(V.length)return{x:t+k[0]*Je+Je/2,z:vi+k[1]*Je+Je/2,y:V[0]}}}return null},floorYAt:(y,R)=>{const I=a(y,R);if(!I)return null;const D=r[i(I[0],I[1])];return D.length?D[0]:null},debugLayers:(y,R)=>{const I=a(y,R);return I?[...r[i(I[0],I[1])]]:[]}}}function Pp(n,e,t,i,r,s,o,a){if(Math.max(n,t)<r||Math.min(n,t)>o||Math.max(e,i)<s||Math.min(e,i)>a)return!1;if(n>=r&&n<=o&&e>=s&&e<=a||t>=r&&t<=o&&i>=s&&i<=a)return!0;const l=t-n,u=i-e,f=[[r,s,o,s],[o,s,o,a],[o,a,r,a],[r,a,r,s]];for(const[h,d,p,v]of f){const x=p-h,m=v-d,c=l*m-u*x;if(Math.abs(c)<1e-12)continue;const g=((h-n)*m-(d-e)*x)/c;if(g<0||g>1)continue;const _=((h-n)*u-(d-e)*l)/c;if(_>=0&&_<=1)return!0}return!1}const Vi=Ey();function fo(n,e,t){const i=qg[t];return n>=i.x0&&n<=i.x1&&e>=i.z0&&e<=i.z1}const Lp=["primary","secondary","melee","bomb"],Ty={primary:"主武器",secondary:"副武器",melee:"近战",bomb:"C4"};class wy{constructor(e){ye(this,"team");ye(this,"opts");ye(this,"audio",null);ye(this,"combatants",[]);ye(this,"playerIdx",0);ye(this,"colliders",[]);ye(this,"doorOpen",!1);ye(this,"phase","menu");ye(this,"freezeT",0);ye(this,"roundT",0);ye(this,"bombT",0);ye(this,"endT",0);ye(this,"roundNum",0);ye(this,"scoreT",0);ye(this,"scoreCT",0);ye(this,"bomb",{state:"carried",carrierId:-1,x:0,y:0,z:0,timer:Wt.bombTime,beepT:0});ye(this,"tSite","A");ye(this,"tPlantPoint",{x:-40,z:-45});ye(this,"events",[]);ye(this,"killfeed",[]);ye(this,"spotted",{});ye(this,"time",0);ye(this,"roundEndText","");ye(this,"winner",null);ye(this,"specIdx",0);ye(this,"hitmarkerT",0);ye(this,"hitHead",!1);ye(this,"hurtFlash",0);ye(this,"input",{keys:new Set,mx:0,my:0,lmb:!1,rmb:!1,lmbPressed:!1,rmbPressed:!1,interact:!1,interactPressed:!1,takePressed:!1,wheel:0});ye(this,"hudTimer",0);ye(this,"rng",Math.random);ye(this,"endReason","");ye(this,"hud",this.getHud());ye(this,"onHud",null);this.opts=e,this.team=e.team,this.rng=py((Date.now()^2654435769)>>>0),this.colliders=[...cf],this.createCombatants()}createCombatants(){const e=["1","2","3","4","5"];let t=0;for(const i of["CT","T"])for(let r=0;r<5;r++){const s=i===this.team&&r===0;this.combatants.push({id:t++,team:i,name:`${i}-${e[r]}`,isPlayer:s,alive:!0,pos:Ca(0,0,0),vel:Ca(),yaw:0,pitch:0,hp:100,armor:0,slots:{},curSlot:"secondary",ammo:{},reloading:!1,reloadT:0,drawT:0,fireCd:0,spread:0,recoil:0,zoom:0,carriesBomb:!1,plantT:0,defuseT:0,anim:{movePhase:0,speed:0,state:"idle",fireFlash:0,crouch:0,deadT:0},kills:0,deaths:0,brain:null,hurtT:0,footT:0,lastAttackerId:-1})}for(const i of this.combatants)i.isPlayer||(i.brain=this.newBrain());this.playerIdx=this.combatants.find(i=>i.isPlayer).id}newBrain(){return{mode:"patrol",path:[],pathIdx:0,goal:null,repathT:0,stuckT:0,lastX:0,lastZ:0,targetId:null,lastSeen:null,reactT:0,burstN:0,burstCd:0,strafeDir:1,strafeT:0,aimYaw:0,aimPitch:0,aimError:.04,patrolIdx:0,holdPt:null,tickT:0,wanderT:0,chainIdx:0,lastFireT:-99,lastNodeD:1/0}}tChain(){return this.tSite==="A"?[{x:60,z:-8},{x:30,z:-52},{...this.tPlantPoint}]:[{x:36,z:-18},{...this.tPlantPoint}]}advanceChain(e,t){const i=this.tChain(),r=t.goal??{x:i[Math.min(t.chainIdx,i.length-1)].x,z:i[Math.min(t.chainIdx,i.length-1)].z};return At(e.pos.x,e.pos.z,r.x,r.z)<3.5&&t.chainIdx<i.length-1&&t.chainIdx++,i[Math.min(t.chainIdx,i.length-1)]}ctChain(e){const t=e.holdPt??co.aSite[0];return Math.abs(t.x-36)<20&&t.z<-25?[{x:8,z:-15},{x:22,z:-30},{...t}]:t.z<-30?[{x:-48,z:-18},{...t}]:[{x:-2,z:-4},{...t}]}giveWeapon(e,t,i){if(i===null){delete e.slots[t];return}e.slots[t]=i;const r=af[i];e.ammo[i]={mag:r.magSize,reserve:r.reserve}}curWeapon(e){const t=e.slots[e.curSlot];return t?af[t]:null}startMatch(){this.scoreT=0,this.scoreCT=0,this.roundNum=0,this.winner=null,this.phase="menu",this.startRound()}startRound(){this.roundNum++,this.phase="freeze",this.freezeT=Wt.freezeTime,this.roundT=Wt.liveTime,this.bombT=Wt.bombTime,this.roundEndText="",this.endReason="",this.doorOpen=!1,this.colliders=[...cf,Ap],this.bomb.state="carried",this.bomb.carrierId=-1,this.tSite=this.rng()<.5?"A":"B",this.tPlantPoint={...Qr[this.tSite][Math.floor(this.rng()*Qr[this.tSite].length)]};for(let r=0;r<this.combatants.length;r++){const s=this.combatants[r],o=_y[s.team][s.team==="CT",s.id%5];s.alive=!0,s.pos=Ca(o.x,0,o.z),s.vel=Ca(),s.hp=100,s.armor=0,s.yaw=s.team==="T"?Math.PI/2:-Math.PI/2,s.pitch=0,s.reloading=!1,s.drawT=0,s.fireCd=0,s.spread=0,s.recoil=0,s.zoom=0,s.carriesBomb=!1,s.plantT=0,s.defuseT=0,s.anim.state="idle",s.anim.speed=0,s.anim.crouch=0,s.anim.deadT=0,s.slots={},s.ammo={};const a=this.loadoutFor(s);this.giveWeapon(s,"primary",a.primary),this.giveWeapon(s,"secondary",a.secondary),this.giveWeapon(s,"melee","knife"),s.armor=a.armor,s.curSlot=a.primary?"primary":"secondary",s.brain&&this.resetBrain(s.brain,s)}const e=this.combatants.filter(r=>r.team==="T"),t=e[Math.floor(this.rng()*e.length)];t.carriesBomb=!0,this.bomb.carrierId=t.id;for(const r of e){if(!r.brain)continue;const s=this.tChain();if(r.brain.chainIdx=0,r.carriesBomb)r.brain.mode="plant",r.brain.goal={...s[0]};else{r.brain.mode="goto";const o=Vi.randomPointNear(t.pos.x,t.pos.z,6,this.rng);r.brain.goal=o??{x:t.pos.x,z:t.pos.z}}this.setPath(r,r.brain,r.brain.goal)}this.combatants.filter(r=>r.team==="CT").forEach((r,s)=>{if(r.brain){const o=s%2===0?co.aSite:co.bSite;r.brain.holdPt=o[Math.floor(this.rng()*o.length)],s===4&&(r.brain.holdPt=co.mid[0]),r.brain.mode="goto";const a=this.ctChain(r.brain);r.brain.chainIdx=0,r.brain.goal={...a[0]},this.setPath(r,r.brain,r.brain.goal)}}),this.events.push({type:"roundStart"}),this.emitHud()}loadoutFor(e){if(this.roundNum===1)return cy[e.team];if(e.isPlayer)return{primary:this.opts.primary==="awp"?"awp":e.team==="T"?"ak47":"m4a4",secondary:"deagle",armor:100};const t=e.id%5===2;return{primary:t?"awp":e.team==="T"?"ak47":"m4a4",secondary:t?"deagle":e.team==="T"?"glock":"usp",armor:100}}resetBrain(e,t){e.mode="patrol",e.path=[],e.pathIdx=0,e.goal=null,e.targetId=null,e.lastSeen=null,e.reactT=0,e.burstN=0,e.burstCd=0,e.stuckT=0,e.tickT=this.rng()*ri.tick,e.patrolIdx=Math.floor(this.rng()*4),e.aimYaw=t.yaw,e.aimPitch=0,e.lastX=t.pos.x,e.lastZ=t.pos.z,e.chainIdx=0}endRound(e,t){this.phase==="roundEnd"||this.phase==="matchEnd"||(this.phase="roundEnd",this.endT=Wt.endTime,this.winner=e,this.endReason=t,e==="T"?this.scoreT++:this.scoreCT++,this.roundEndText=`${e==="T"?"T方":"CT方"}胜利 — ${t}`,this.events.push({type:"roundEnd",win:e===this.team}),this.emitHud())}checkWin(){const e=this.combatants.some(r=>r.team==="CT"&&r.alive),t=this.combatants.some(r=>r.team==="T"&&r.alive),i=this.bomb.state==="planted";if(i&&this.bomb.timer<=0){this.explodeBomb();return}if(i){if(!e){this.endRound("T","CT全灭且炸弹已安放");return}if(!t)return}else{if(!e){this.endRound("T","CT全灭");return}if(!t){this.endRound("CT","T全灭");return}if(this.roundT<=0){this.endRound("CT","时间耗尽");return}}}explodeBomb(){const e=this.bomb.x,t=this.bomb.y,i=this.bomb.z;this.events.push({type:"explosion",x:e,y:t,z:i});for(const r of this.combatants){if(!r.alive)continue;const s=fy(r.pos,{x:e,y:r.pos.y,z:i});if(s<Wt.bombRadius){const o=Wt.bombDamage*Math.max(0,1-s/Wt.bombRadius);this.applyDamage(r,o,"chest",null)}}this.bomb.state="planted",this.bomb.timer=-1,this.endRound("T","C4 爆炸")}updateBombCarrier(){const e=this.combatants[this.bomb.carrierId];e&&e.alive&&e.carriesBomb&&(this.bomb.x=e.pos.x,this.bomb.y=e.pos.y+1.3,this.bomb.z=e.pos.z)}moveEntity(e,t,i,r,s,o){if(this.phase==="freeze"||!e.alive){e.anim.speed=0;return}const a=40,l=i*s,u=r*s;e.vel.x=Tp(e.vel.x,l,Math.min(1,a*t)),e.vel.z=Tp(e.vel.z,u,Math.min(1,a*t)),e.vel.y-=et.gravity*t;const f={...e.pos},h={...e.pos,x:e.pos.x+e.vel.x*t,z:e.pos.z+e.vel.z*t},d={...h},p=Nu(f,d,et.hw,et.height,this.colliders,{stepMax:et.stepMax});if(p.hitWallX||p.hitWallZ){const g={...f,y:f.y+et.stepMax},_={...h,y:f.y+et.stepMax};Nu(g,_,et.hw,et.height,this.colliders,{stepMax:et.stepMax});const S=At(f.x,f.z,d.x,d.z),P=At(f.x,f.z,_.x,_.z);let A=!1;for(const T of this.colliders)if(T.step&&!(_.y<T.maxY-1e-4)&&_.x+et.hw>T.minX&&_.x-et.hw<T.maxX&&_.z+et.hw>T.minZ&&_.z-et.hw<T.maxZ){A=!0;break}P>S+.005||A?(e.pos.x=_.x,e.pos.z=_.z,e.pos.y=_.y):(e.pos.x=d.x,e.pos.z=d.z)}else e.pos.x=d.x,e.pos.z=d.z;const v={...e.pos};e.pos.y+=e.vel.y*t,Nu(v,e.pos,et.hw,et.height,this.colliders,{stepMax:et.stepMax});const x=dy(e.pos.x,e.pos.z,et.hw,e.pos.y+.05,this.colliders,void 0,!0);x!==-1/0&&(e.pos.y=x,e.vel.y=0);const m=x!==-1/0;o&&m&&(e.vel.y=et.jumpVel);const c=Math.hypot(e.vel.x,e.vel.z);e.anim.speed=c,c>.5&&m?(e.anim.movePhase+=t*(6+c*1.8),e.footT-=t,e.footT<=0&&(e.footT=.42-Math.min(.15,c*.02),this.events.push({type:"footstep",x:e.pos.x,y:e.pos.y,z:e.pos.z,run:c>3.4}))):e.anim.movePhase=0}hitboxes(e){const t=e.anim.state==="plant"||e.anim.state==="defuse"?.45:0,i=e.pos.y-t,r=.32,s=(o,a,l,u,f,h,d)=>({part:o,box:{minX:e.pos.x+a,maxX:e.pos.x+l,minY:i+u,maxY:i+f,minZ:e.pos.z+h,maxZ:e.pos.z+d}});return[s("head",-.14,.14,1.5,1.8,-.14,.14),s("chest",-.21,.21,1.22,1.5,-.18,.18),s("stomach",-.2,.2,.92,1.22,-.17,.17),s("arms",-r,-.2,.98,1.5,-.14,.14),s("arms",.2,r,.98,1.5,-.14,.14),s("legs",-.16,-.05,0,.92,-.15,.15),s("legs",.05,.16,0,.92,-.15,.15)]}fireBullet(e,t,i){const r=e.pos.y+et.eye,s=e.pos.x,o=r,a=e.pos.z;let l=1,u=0,f=null;for(let h=0;h<3;h++){let d=1/0,p=null,v="chest",x=null;for(const m of this.combatants)if(!(!m.alive||m.id===e.id))for(const c of this.hitboxes(m)){const g=wp(s,o,a,t.x,t.y,t.z,c.box);g>=0&&g+u<d&&(d=g+u,p=m,v=c.part,x=null)}for(const m of this.colliders){const c=wp(s,o,a,t.x,t.y,t.z,m);c>=0&&c+u<d&&(d=c+u,p=null,x=m)}if(p){const m=d-u;f={x:s+t.x*m,y:o+t.y*m,z:a+t.z*m};const c=i.damage*uy[v]*l;this.applyDamage(p,c,v,e,i),this.events.push({type:"blood",x:f.x,y:f.y,z:f.z});return}if(x){const m=d-u;if(f={x:s+t.x*m,y:o+t.y*m,z:a+t.z*m},x.penetrable){l*=.55,u=d+.05;continue}return}return}}applyDamage(e,t,i,r,s){if(!e.alive||this.phase==="roundEnd")return;const o=s?s.armorAbsorb:.5;let a=t;if(e.armor>0&&i!=="head"){const l=Math.min(e.armor,a*o);e.armor-=l,a-=l}else if(e.armor>0&&i==="head"){const l=Math.min(e.armor,a*o*.6);e.armor-=l,a-=l}a=Math.round(a),e.hp-=a,e.hurtT=.35,e.lastAttackerId=r?r.id:-1,r&&r.isPlayer&&(this.hitmarkerT=.18,this.hitHead=i==="head",this.events.push({type:"hitmarker",headshot:i==="head"})),r&&e.isPlayer&&(this.hurtFlash=.4,this.events.push({type:"hurt"})),e.hp<=0&&this.kill(e,r,i)}kill(e,t,i){if(!e.alive)return;e.alive=!1,e.deaths++,e.anim.state="dead",e.anim.deadT=0,e.reloading=!1,e.plantT=0,e.defuseT=0,t&&t.kills++;const r=t&&this.curWeapon(t)?this.curWeapon(t).name:"C4",s=t?t.isPlayer?"你":t.name:"C4",o=i==="head",a=`${s} [${r}]${o?" 爆头":""} ${e.isPlayer?"你":e.name}`;this.killfeed.unshift({text:a,t:this.time,team:e.team,headshot:o}),this.killfeed.length>6&&this.killfeed.pop(),t&&t.isPlayer&&this.events.push({type:"kill"}),e.carriesBomb&&(e.carriesBomb=!1,this.bomb.state="dropped",this.bomb.x=e.pos.x,this.bomb.y=e.pos.y,this.bomb.z=e.pos.z,this.bomb.carrierId=-1),e.isPlayer&&(this.specIdx=-1,this.cycleSpectate()),this.checkWin(),this.emitHud()}updatePlayer(e){const t=this.combatants[this.playerIdx];if(!t||!t.alive)return;const i=this.input.keys;let r=0,s=0;i.has("KeyW")&&(s-=1),i.has("KeyS")&&(s+=1),i.has("KeyA")&&(r-=1),i.has("KeyD")&&(r+=1);const o=Math.hypot(r,s);o>0&&(r/=o,s/=o);const a=Math.sin(t.yaw),l=Math.cos(t.yaw),u=r*l-s*a,f=-(r*a+s*l),d=i.has("ShiftLeft")||i.has("ShiftRight")?et.playerWalk:et.playerRun;this.moveEntity(t,e,u,f,d,i.has("Space")),t.yaw-=this.input.mx*.0021,t.pitch+=this.input.my*.0021,t.pitch=lf(t.pitch,-1.53,1.53),this.input.mx=0,this.input.my=0;const p=this.curWeapon(t);if(p){const x=p.slot==="melee"?0:Math.hypot(t.vel.x,t.vel.z)>3.4?p.spreadMove:Math.hypot(t.vel.x,t.vel.z)>.4?p.spreadMove*.4:0;t.spread=Math.max(p.spreadBase+x,t.spread-e*.22),t.recoil=Math.max(0,t.recoil-e*16)}if(this.input.rmbPressed&&p&&p.id==="awp"&&t.drawT<=0&&(t.zoom=(t.zoom+1)%3,this.events.push({type:"scope",on:t.zoom>0})),i.has("KeyR")&&this.startReload(t),this.input.keys.has("Digit1")&&this.switchSlot(t,"primary"),this.input.keys.has("Digit2")&&this.switchSlot(t,"secondary"),this.input.keys.has("Digit3")&&this.switchSlot(t,"melee"),this.input.keys.has("Digit4")&&t.carriesBomb&&this.switchSlot(t,"bomb"),this.input.wheel!==0){const x=Lp.filter(g=>g!=="bomb"||t.carriesBomb),m=x.indexOf(t.curSlot),c=x[(m+(this.input.wheel>0?1:x.length-1))%x.length];this.switchSlot(t,c),this.input.wheel=0}const v=this.input.lmb&&p&&p.slot!=="bomb";v?(p.auto||this.input.lmbPressed)&&this.tryFire(t,!0):p&&t.curSlot==="bomb"&&this.input.lmb&&t.carriesBomb?this.canPlant(t)&&(t.anim.state="plant",t.plantT+=e,t.plantT>=Wt.plantTime&&this.plantBomb(t)):!v&&t.curSlot==="bomb"&&(t.plantT=0,t.anim.state==="plant"&&(t.anim.state="idle")),this.input.interact&&this.bomb.state==="planted"&&t.team==="CT"&&At(t.pos.x,t.pos.z,this.bomb.x,this.bomb.z)<1.3?(t.anim.state="defuse",t.defuseT+=e,t.defuseT>=Wt.defuseTime&&this.defuseBomb(t)):t.anim.state==="defuse"&&(t.anim.state="idle",t.defuseT=0),t.team==="T"&&!t.carriesBomb&&this.bomb.state==="dropped"&&At(t.pos.x,t.pos.z,this.bomb.x,this.bomb.z)<1&&this.pickupBomb(t),this.input.lmbPressed=!1,this.input.rmbPressed=!1,this.input.takePressed=!1,this.input.interactPressed=!1,this.input.wheel=0}canPlant(e){return e.team==="T"&&e.carriesBomb&&(fo(e.pos.x,e.pos.z,"A")||fo(e.pos.x,e.pos.z,"B"))}plantBomb(e){e.carriesBomb=!1,e.curSlot=e.slots.primary?"primary":"secondary",this.bomb.state="planted",this.bomb.x=e.pos.x,this.bomb.y=e.pos.y,this.bomb.z=e.pos.z,this.bomb.timer=Wt.bombTime,this.bomb.beepT=0,this.phase="planted",e.anim.state="idle",this.events.push({type:"plantDone",x:this.bomb.x,y:this.bomb.y,z:this.bomb.z}),this.emitHud()}defuseBomb(e){this.bomb.state="dropped",e.anim.state="idle",e.defuseT=0,this.events.push({type:"defused"}),this.endRound("CT","成功拆弹")}pickupBomb(e){if(e.carriesBomb=!0,this.bomb.state="carried",this.bomb.carrierId=e.id,this.events.push({type:"pickup"}),e.brain){const t=this.tChain();e.brain.chainIdx=t.length-1,e.brain.mode="plant",e.brain.goal={...t[t.length-1]},this.setPath(e,e.brain,e.brain.goal)}this.emitHud()}switchSlot(e,t){if(e.curSlot===t||!e.slots[t])return;e.reloading&&e.curSlot==="primary"&&(e.reloading=!1),e.curSlot=t;const i=this.curWeapon(e);e.drawT=i?i.drawTime:.3,e.plantT=0,e.zoom=0,this.events.push({type:"switch"})}startReload(e){const t=this.curWeapon(e);if(!t||t.id==="knife"||e.reloading||e.drawT>0)return;const i=e.ammo[t.id];!i||i.mag>=t.magSize||i.reserve<=0||(e.reloading=!0,e.reloadT=t.reloadTime,e.zoom=0,this.events.push({type:"reload",reload:t.reloadSound}))}tryFire(e,t){const i=this.curWeapon(e);if(!i||e.reloading||e.drawT>0||e.fireCd>0)return;if(i.id==="knife"){this.knifeSwing(e);return}const r=e.ammo[i.id];if(!r||r.mag<=0){this.startReload(e);return}e.fireCd=60/i.rpm,r.mag--;const s=Math.hypot(e.vel.x,e.vel.z),o=s>3.4?i.spreadMove:s>.4?i.spreadMove*.35:0;e.spread=Math.min(i.spreadMax,e.spread+i.spreadPerShot+o),e.recoil=Math.min(i.recoilMax,e.recoil+i.recoilKick*(.6+this.rng()*.4)),e.pitch+=i.recoilKick*.016*(.75+this.rng()*.5);const l=i.id==="awp"&&e.zoom>0&&i.spreadScoped!==void 0?i.spreadScoped:e.spread,u=this.aimDir(e),f=hy(u.x,u.y,u.z,l,this.rng);this.fireBullet(e,f,i),e.anim.fireFlash=.06;const h=this.muzzlePos(e);this.events.push({type:"shot",x:h.x,y:h.y,z:h.z,weapon:i.id}),i.id==="awp"&&e.zoom>0&&(e.pitch+=.02),this.emitHud()}knifeSwing(e){e.fireCd=.55;const t=this.aimDir(e);for(const i of this.combatants){if(!i.alive||i.id===e.id)continue;const r=i.pos.x-e.pos.x,s=i.pos.z-e.pos.z,o=Math.hypot(r,s);if(o<1.9&&Math.acos(lf((r*t.x+s*t.z)/(o||1),-1,1))<.9){this.applyDamage(i,40,"chest",e),e.anim.fireFlash=.1;return}}this.events.push({type:"shot",x:e.pos.x,y:e.pos.y+1.4,z:e.pos.z,weapon:"knife"})}aimDir(e){return{x:-Math.sin(e.yaw)*Math.cos(e.pitch),y:Math.sin(e.pitch),z:-Math.cos(e.yaw)*Math.cos(e.pitch)}}muzzlePos(e){const t=this.aimDir(e),i=e.pos.y+et.eye;return{x:e.pos.x+t.x*.8,y:i+t.y*.8,z:e.pos.z+t.z*.8}}canSee(e,t){if(!t.alive)return!1;const i=At(e.pos.x,e.pos.z,t.pos.x,t.pos.z);if(i>ri.viewDist)return!1;const r={x:t.pos.x-e.pos.x,z:t.pos.z-e.pos.z};if(Math.abs(uf(Math.atan2(-r.x,-r.z),e.yaw))>ri.fov/2&&i>6)return!1;const o=e.pos.y+et.eye;return Rp(e.pos.x,o,e.pos.z,t.pos.x,t.pos.y+et.eye,t.pos.z)||Rp(e.pos.x,o,e.pos.z,t.pos.x,t.pos.y+1.2,t.pos.z)}aiTickBrain(e,t,i){let r=null,s=1/0;for(const o of this.combatants)if(!(o.team===e.team||!o.alive)&&this.canSee(e,o)){const a=At(e.pos.x,e.pos.z,o.pos.x,o.pos.z);a<s&&(s=a,r=o),this.spotted[o.id]={x:o.pos.x,z:o.pos.z,t:this.time}}if(r?(t.targetId=r.id,t.lastSeen={x:r.pos.x,z:r.pos.z,t:this.time},t.mode!=="combat"&&(t.mode="combat",t.reactT=ri.reactionMin+this.rng()*(ri.reactionMax-ri.reactionMin),t.burstN=0)):t.mode==="combat"&&t.lastSeen&&this.time-t.lastSeen.t>2.5&&(e.team==="T"&&e.carriesBomb&&this.bomb.state!=="planted"?(t.mode="plant",t.goal={...this.advanceChain(e,t)},this.setPath(e,t,t.goal)):(t.mode="goto",t.goal={x:t.lastSeen.x,z:t.lastSeen.z},this.setPath(e,t,t.goal))),t.targetId!==null&&t.mode==="combat"){const o=this.combatants[t.targetId];o&&o.alive&&this.canSee(e,o)?t.lastSeen={x:o.pos.x,z:o.pos.z,t:this.time}:t.targetId=null}if(e.team==="CT"&&this.bomb.state==="planted"&&t.mode!=="defuse"&&(t.mode="goto",t.goal={x:this.bomb.x,z:this.bomb.z},this.setPath(e,t,t.goal)),e.team==="T"&&this.bomb.state==="planted"&&t.mode!=="hold"&&t.mode!=="combat"&&(t.mode="hold",t.goal=null),e.team==="T"&&this.bomb.state==="dropped"&&!e.carriesBomb&&t.mode!=="combat"&&(this.combatants.find(a=>a.carriesBomb)||(t.mode="goto",t.goal={x:this.bomb.x,z:this.bomb.z},this.setPath(e,t,t.goal))),e.team==="T"&&e.carriesBomb&&this.bomb.state!=="planted"&&t.mode!=="plant"&&t.mode!=="combat"&&(t.mode="plant",t.goal={...this.advanceChain(e,t)},this.setPath(e,t,t.goal)),e.team==="T"&&!e.carriesBomb&&this.bomb.state==="carried"&&t.mode==="patrol"){const o=this.combatants.find(a=>a.carriesBomb);if(o){t.mode="goto";const a=Vi.randomPointNear(o.pos.x,o.pos.z,6,this.rng);t.goal=a??{x:o.pos.x,z:o.pos.z},this.setPath(e,t,t.goal)}}if(e.team==="CT"&&this.bomb.state!=="planted"&&t.mode==="patrol"&&t.holdPt){const o=this.ctChain(t),a=o[Math.min(t.chainIdx,o.length-1)],l=At(e.pos.x,e.pos.z,a.x,a.z);t.chainIdx<o.length-1&&l<4&&(t.chainIdx++,t.mode="goto",t.goal={...o[t.chainIdx]},this.setPath(e,t,t.goal))}}setPath(e,t,i){const r=Vi.path(e.pos.x,e.pos.y,e.pos.z,i.x,i.z,this.floorNear(i.x,i.z));r&&r.length>0?(t.path=r,t.pathIdx=0):t.path=[],t.repathT=ri.repathInterval*(.6+this.rng()*.8),t.stuckT=0,t.lastX=e.pos.x,t.lastZ=e.pos.z,t.lastNodeD=1/0}floorNear(e,t){return Vi.floorYAt(e,t)??void 0}aiMoveAlong(e,t,i,r,s){let o=0,a=0;if(t.path.length>0){const l=t.path[t.pathIdx]??t.path[t.path.length-1],u=l.x-e.pos.x,f=l.z-e.pos.z,h=Math.hypot(u,f);if(h<.35)if(l.y>e.pos.y+.35){const d=t.path[Math.min(t.pathIdx+1,t.path.length-1)],p=d.x-e.pos.x,v=d.z-e.pos.z,x=Math.hypot(p,v)||1;o=p/x,a=v/x}else t.pathIdx<t.path.length-1?(t.pathIdx++,t.lastNodeD=1/0):t.path=[];else o=u/h,a=f/h}if(this.moveEntity(e,i,o,a,r,!1),s&&(o!==0||a!==0)){const l=Math.atan2(-o,-a);e.yaw=Uu(e.yaw,l,8*i)}if(t.stuckT+=i,t.stuckT>.7){const l=t.path[t.pathIdx],u=l?At(e.pos.x,e.pos.z,l.x,l.z):-1,f=t.lastNodeD-u,h=At(e.pos.x,e.pos.z,t.lastX,t.lastZ);if(u>.8&&f<.35&&h<2.4||h<.35){t.path=[];const d=Vi.nearestWalkable(e.pos.x,e.pos.z);if(d){const p=Vi.path(e.pos.x,e.pos.y,e.pos.z,d.x,d.z,d.y);if(p&&t.goal){const v=Vi.path(d.x,d.y,d.z,t.goal.x,t.goal.z,this.floorNear(t.goal.x,t.goal.z));v&&(t.path=[...p,...v.slice(1)],t.pathIdx=0)}t.path.length===0&&(t.path=[{x:d.x,z:d.z,y:d.y}],t.pathIdx=0,t.repathT=.5)}t.mode==="goto"&&t.path.length===0&&(t.mode="patrol")}t.lastX=e.pos.x,t.lastZ=e.pos.z,t.lastNodeD=u,t.stuckT=0}}aiCombat(e,t,i){const r=t.targetId!==null?this.combatants[t.targetId]:null;if(!r||!r.alive){t.mode="patrol";return}const s=At(e.pos.x,e.pos.z,r.pos.x,r.pos.z),o=r.pos.y+1.3,a=r.pos.x-e.pos.x,l=r.pos.z-e.pos.z,u=Math.atan2(-a,-l),f=e.pos.y+et.eye,h=Math.atan2(o-f,s||1);t.reactT>0?(t.reactT-=i,t.aimError=.09):t.aimError=Math.max(.016,t.aimError-i*.16),e.yaw=Uu(e.yaw,u,ri.aimSpeed*i),e.pitch=Uu(e.pitch,h,ri.aimSpeed*i);{const g=this.curWeapon(e);g&&(e.spread=Math.max(g.spreadBase,e.spread-i*.22))}t.strafeT-=i,t.strafeT<=0&&(t.strafeT=.5+this.rng()*.9,t.strafeDir=this.rng()<.5?-1:1),t.stuckT+=i,t.stuckT>.8&&(At(e.pos.x,e.pos.z,t.lastX,t.lastZ)<.6&&(t.strafeDir*=-1),t.lastX=e.pos.x,t.lastZ=e.pos.z,t.stuckT=0);let d=0,p=0;const v=this.curWeapon(e),x=v&&v.id==="awp"?14:7;if(this.time-t.lastFireT<.6)d=0,p=0;else if(s>x+5)d=a/s,p=l/s;else if(s<x-3)d=-a/s,p=-l/s;else{const g=-l/s,_=a/s;d=g*t.strafeDir,p=_*t.strafeDir}this.moveEntity(e,i,d,p,s<6?et.botWalk:et.botRun,!1),t.reactT<=0&&this.canSee(e,r)&&Math.abs(uf(e.yaw,u))+Math.abs(e.pitch-h)+t.aimError<.085&&(t.burstCd-=i,t.burstCd<=0&&(this.tryFire(e,!1),t.lastFireT=this.time,t.burstN++,v&&v.id==="awp"?t.burstCd=1.4+this.rng()*.6:t.burstN>=4+Math.floor(this.rng()*4)?(t.burstN=0,t.burstCd=.4+this.rng()*.5):t.burstCd=60/(v?v.rpm:400)));const c=v?e.ammo[v.id]:void 0;v&&c&&c.mag<=0&&this.startReload(e),t.lastSeen&&this.time-t.lastSeen.t>3.5&&(t.mode="goto",t.goal={x:t.lastSeen.x,z:t.lastSeen.z},this.setPath(e,t,t.goal))}aiGoto(e,t,i){if(!t.goal){t.mode="patrol";return}if(At(e.pos.x,e.pos.z,t.goal.x,t.goal.z)<1.6){t.goal=null,t.mode="patrol";return}if(t.path.length===0){t.repathT<=0?this.setPath(e,t,t.goal):t.repathT-=i;return}if(this.bomb.state==="planted"&&e.team==="CT"&&At(e.pos.x,e.pos.z,this.bomb.x,this.bomb.z)<1.4){t.mode="defuse",t.goal=null,t.path=[];return}if(this.bomb.state==="dropped"&&e.team==="T"&&At(e.pos.x,e.pos.z,this.bomb.x,this.bomb.z)<1.2){this.pickupBomb(e),t.goal=null,t.mode="goto";const s=this.tSite,o=Qr[s][Math.floor(this.rng()*Qr[s].length)];t.goal=o,this.setPath(e,t,t.goal),t.mode="plant";return}this.aiMoveAlong(e,t,i,et.botRun,!0)}aiPlant(e,t,i){if(!e.carriesBomb){t.mode="goto";const s=Qr[this.tSite][Math.floor(this.rng()*Qr[this.tSite].length)];t.goal=s,this.setPath(e,t,t.goal);return}if(!(fo(e.pos.x,e.pos.z,"A")?"A":fo(e.pos.x,e.pos.z,"B")?"B":null)){const s=this.advanceChain(e,t);!t.goal||t.goal.x!==s.x||t.goal.z!==s.z?(t.goal={...s},this.setPath(e,t,t.goal)):t.path.length===0&&t.repathT<=0&&this.setPath(e,t,t.goal),this.aiMoveAlong(e,t,i,et.botRun,!0);return}e.anim.state="plant",e.plantT+=i,this.moveEntity(e,i,0,0,0,!1),e.plantT>=Wt.plantTime&&(this.plantBomb(e),t.mode="hold",t.goal=null);for(const s of this.combatants)if(s.team!==e.team&&s.alive&&At(e.pos.x,e.pos.z,s.pos.x,s.pos.z)<5&&this.canSee(e,s)){e.anim.state="idle",e.plantT=0,t.mode="combat",t.targetId=s.id,t.reactT=.2;return}}aiDefuse(e,t,i){if(this.bomb.state!=="planted"){t.mode="patrol";return}if(At(e.pos.x,e.pos.z,this.bomb.x,this.bomb.z)>1.4){t.goal={x:this.bomb.x,z:this.bomb.z},this.setPath(e,t,t.goal),t.mode="goto";return}if(e.anim.state="defuse",e.defuseT+=i,this.moveEntity(e,i,0,0,0,!1),e.defuseT>=Wt.defuseTime){this.defuseBomb(e),t.mode="hold";return}e.hurtT>.2&&t.lastSeen!==null&&this.time-t.lastSeen.t<1}aiHold(e,t,i){if(!t.goal){const s=fo(this.bomb.x,this.bomb.z,"A")?"A":"B",o=co[s==="A"?"aSite":"bSite"];t.goal=o[Math.floor(this.rng()*o.length)],this.setPath(e,t,t.goal);return}if(At(e.pos.x,e.pos.z,t.goal.x,t.goal.z)<2){e.yaw+=i*.6,this.moveEntity(e,i,0,0,0,!1),this.rng()<i*.3&&(t.goal=null);return}this.aiMoveAlong(e,t,i,et.botRun,!0)}aiPatrol(e,t,i){if(this.phase==="freeze"){this.moveEntity(e,i,0,0,0,!1);return}if(!t.goal){if(t.wanderT-=i,t.wanderT>0){this.moveEntity(e,i,0,0,0,!1),e.yaw+=i*.5;return}t.wanderT=2+this.rng()*3;const s=e.team==="T"?[...Dn.tSpawn,...Dn.tMid,...Dn.aLong,...Dn.tunnels,...Dn.lower,...Dn.bSite]:[...Dn.ctSpawn,...Dn.mid,...Dn.midToB,...Dn.bDoors,...Dn.aSite,...Dn.bSite],o=t.holdPt??s[Math.floor(this.rng()*s.length)],a=Vi.randomPointNear(o.x,o.z,9,this.rng);a&&(t.goal={x:a.x,z:a.z},this.setPath(e,t,t.goal));return}if(At(e.pos.x,e.pos.z,t.goal.x,t.goal.z)<1.5){t.goal=null,t.path=[];return}t.path.length===0&&t.repathT<=0&&this.setPath(e,t,t.goal),this.aiMoveAlong(e,t,i,et.botWalk+this.rng()*.4,!0)}spectateTargets(){const e=this.combatants[this.playerIdx],t=this.combatants.filter(i=>i.alive&&i.team===e.team);return t.length>0?t:this.combatants.filter(i=>i.alive)}cycleSpectate(){const e=this.spectateTargets();e.length!==0&&(this.specIdx=(this.specIdx+1)%e.length)}takeoverSpectate(){const e=this.combatants[this.playerIdx],i=this.spectateTargets()[this.specIdx];i&&i.team===e.team&&(this.playerIdx=i.id,i.isPlayer=!0,i.brain=null,this.specIdx=-1,this.emitHud())}update(e){if(this.phase==="menu"||this.phase==="matchEnd"){this.emitHud();return}e=Math.min(e,.05),this.time+=e,this.updateDoors(),this.bomb.state==="carried"&&this.updateBombCarrier(),this.bomb.state==="planted"&&this.phase==="planted"&&(this.bomb.timer-=e,this.bomb.beepT-=e,this.bomb.beepT<=0&&(this.bomb.beepT=this.bomb.timer<10?.4:1,this.events.push({type:"bombBeep",x:this.bomb.x,y:this.bomb.y,z:this.bomb.z}))),this.phase==="freeze"?(this.freezeT-=e,this.freezeT<=0&&(this.phase="live",this.freezeT=0)):this.phase==="live"?(this.roundT-=e,this.checkWin()):this.phase==="planted"?this.checkWin():this.phase==="roundEnd"&&(this.endT-=e,this.endT<=0&&(this.scoreT>=Wt.winRounds||this.scoreCT>=Wt.winRounds?this.phase="matchEnd":this.startRound())),this.hitmarkerT=Math.max(0,this.hitmarkerT-e),this.hurtFlash=Math.max(0,this.hurtFlash-e*1.1),this.updatePlayer(e);{const i=this.combatants[this.playerIdx];i&&!i.alive&&this.input.takePressed&&(this.takeoverSpectate(),this.input.takePressed=!1)}const t=this.combatants[this.playerIdx];if(t&&t.alive)for(const i of this.combatants)i.team!==t.team&&i.alive&&this.canSee(t,i)&&(this.spotted[i.id]={x:i.pos.x,z:i.pos.z,t:this.time});(t&&!t.alive&&this.phase==="live"||t&&!t.alive&&this.phase==="planted")&&this.specIdx<0&&(this.specIdx=0);for(const i of this.combatants){if(!i.alive){i.anim.state==="dead"&&(i.anim.deadT+=e);continue}if(i.fireCd-=e,i.drawT-=e,i.hurtT-=e,i.reloading&&(i.reloadT-=e,i.reloadT<=0)){const r=this.curWeapon(i);if(r&&r.id!=="knife"){const s=i.ammo[r.id],o=r.magSize-s.mag,a=Math.min(o,s.reserve);s.mag+=a,s.reserve-=a}i.reloading=!1}if(i.anim.fireFlash>0&&(i.anim.fireFlash-=e),i.brain){i.brain.tickT-=e,i.brain.tickT<=0&&(i.brain.tickT=ri.tick,this.aiTickBrain(i,i.brain,e));const r=i.brain;switch(r.mode){case"combat":this.aiCombat(i,r,e);break;case"goto":this.aiGoto(i,r,e);break;case"plant":this.aiPlant(i,r,e);break;case"defuse":this.aiDefuse(i,r,e);break;case"hold":this.aiHold(i,r,e);break;default:this.aiPatrol(i,r,e);break}}}this.hudTimer-=e,this.hudTimer<=0&&(this.hudTimer=.04,this.emitHud())}updateDoors(){if(!this.doorOpen)for(const e of this.combatants){if(!e.alive)continue;const t=(Yt.x0+Yt.x1)/2,i=(Yt.z0+Yt.z1)/2;if(At(e.pos.x,e.pos.z,t,i)<2.4){this.doorOpen=!0,this.colliders=this.colliders.filter(r=>r!==Ap),this.events.push({type:"door"});return}}}getHud(){const e=this.combatants[this.playerIdx],t=e?this.curWeapon(e):null,i=e&&t?e.ammo[t.id]:void 0;let r=0,s="";this.phase==="freeze"?(r=this.freezeT,s="冻结时间"):this.phase==="live"?(r=this.roundT,s="回合时间"):this.phase==="planted"&&(r=Math.max(0,this.bomb.timer),s="C4 倒计时");const o=this.combatants.filter(l=>l.team===e?.team).map(l=>({id:l.id,name:l.name,alive:l.alive,hp:l.hp})),a=this.bomb.state!=="carried"||this.spotted[this.bomb.carrierId]!==void 0;return{phase:this.phase,hp:e?Math.max(0,Math.round(e.hp)):0,armor:e?Math.round(e.armor):0,weaponName:t?t.name:"—",mag:i?i.mag:0,reserve:i?i.reserve:0,slots:Lp.filter(l=>l!=="bomb"||e&&e.carriesBomb).map(l=>({key:l,label:Ty[l],has:!!e?.slots[l],cur:e?.curSlot===l})),scoreT:this.scoreT,scoreCT:this.scoreCT,roundNum:this.roundNum,timer:r,timerLabel:s,bombCarried:e?e.carriesBomb:!1,bombDropped:this.bomb.state==="dropped",bombPlanted:this.bomb.state==="planted",bombX:this.bomb.x,bombZ:this.bomb.z,siteHint:this.siteHint(),killfeed:[...this.killfeed],spectate:e&&!e.alive?{name:this.spectateTargets()[this.specIdx]?.name??"—",index:Math.max(0,this.specIdx),list:o,takeover:this.spectateTargets()[this.specIdx]?.team===e.team}:null,dead:e?!e.alive:!1,hitmarkerT:this.hitmarkerT,hitHead:this.hitHead,hurtFlash:this.hurtFlash,roundEndText:this.roundEndText,matchEnd:this.phase==="matchEnd"?{scoreT:this.scoreT,scoreCT:this.scoreCT,winner:this.scoreT>=Wt.winRounds?"T":"CT"}:null,interact:this.interactInfo(e),minimap:{px:e?e.pos.x:0,pz:e?e.pos.z:0,pyaw:e?e.yaw:0,teammates:this.combatants.filter(l=>l.team===e?.team&&l.alive&&l.id!==e?.id).map(l=>({x:l.pos.x,z:l.pos.z,id:l.id,hp:l.hp})),enemies:this.combatants.filter(l=>l.team!==e?.team&&l.alive&&this.spotted[l.id]&&this.time-this.spotted[l.id].t<3.5).map(l=>({x:l.pos.x,z:l.pos.z})),bomb:a&&this.bomb.state!=="carried"?{x:this.bomb.x,z:this.bomb.z,carried:!1,planted:this.bomb.state==="planted"}:null,carrierId:this.bomb.carrierId},spread:e?e.spread:0,zoom:e?e.zoom:0,kills:e?e.kills:0,deaths:e?e.deaths:0,playersAlive:{t:this.combatants.filter(l=>l.team==="T"&&l.alive).length,ct:this.combatants.filter(l=>l.team==="CT"&&l.alive).length}}}siteHint(){const e=this.combatants[this.playerIdx];return e?this.bomb.state==="planted"?e.team==="CT"?"C4 已安放 — 立即拆除！":"C4 已安放 — 守住！":e.carriesBomb?"携带 C4 — 前往 A点 / B点，按 4 装备后按住左键安放":e.team==="T"&&this.bomb.state==="dropped"?"C4 掉落 — 前往拾取！":e.team==="T"?"跟随 C4 推点":"阻止 T 方安放 C4":""}interactInfo(e){return!e||!e.alive?null:e.team==="CT"&&this.bomb.state==="planted"&&At(e.pos.x,e.pos.z,this.bomb.x,this.bomb.z)<1.3?{label:"按住 E 拆除 C4",progress:e.defuseT/Wt.defuseTime}:e.team==="T"&&this.bomb.state==="dropped"&&At(e.pos.x,e.pos.z,this.bomb.x,this.bomb.z)<1?{label:"拾取 C4",progress:0}:null}emitHud(){this.hud=this.getHud(),this.onHud?.(this.hud)}drainEvents(){const e=this.events;return this.events=[],e}viewCombatant(){const e=this.combatants[this.playerIdx];if(!e)return null;if(e.alive)return e;const t=this.spectateTargets();return t.length===0?e:t[Math.max(0,this.specIdx)%t.length]}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const jd="170",Ay=0,Dp=1,Cy=2,$g=1,Kg=2,Ei=3,mr=0,xn=1,li=2,fr=0,Ds=1,Ip=2,Up=3,Np=4,Ry=5,Dr=100,by=101,Py=102,Ly=103,Dy=104,Iy=200,Uy=201,Ny=202,zy=203,ff=204,df=205,Fy=206,ky=207,Oy=208,By=209,Hy=210,Vy=211,Gy=212,Wy=213,Xy=214,hf=0,pf=1,mf=2,Vs=3,gf=4,vf=5,_f=6,xf=7,qd=0,Yy=1,jy=2,dr=0,qy=1,$y=2,Ky=3,Zy=4,Qy=5,Jy=6,e1=7,Zg=300,Gs=301,Ws=302,yf=303,Sf=304,ru=306,Mf=1e3,Fr=1001,Ef=1002,ei=1003,t1=1004,Ra=1005,ui=1006,zu=1007,kr=1008,Fi=1009,Qg=1010,Jg=1011,Zo=1012,$d=1013,Yr=1014,Ri=1015,ia=1016,Kd=1017,Zd=1018,Xs=1020,ev=35902,tv=1021,nv=1022,Zn=1023,iv=1024,rv=1025,Is=1026,Ys=1027,sv=1028,Qd=1029,ov=1030,Jd=1031,eh=1033,ul=33776,cl=33777,fl=33778,dl=33779,Tf=35840,wf=35841,Af=35842,Cf=35843,Rf=36196,bf=37492,Pf=37496,Lf=37808,Df=37809,If=37810,Uf=37811,Nf=37812,zf=37813,Ff=37814,kf=37815,Of=37816,Bf=37817,Hf=37818,Vf=37819,Gf=37820,Wf=37821,hl=36492,Xf=36494,Yf=36495,av=36283,jf=36284,qf=36285,$f=36286,n1=3200,i1=3201,lv=0,r1=1,Ji="",Un="srgb",Zs="srgb-linear",su="linear",ot="srgb",Jr=7680,zp=519,s1=512,o1=513,a1=514,uv=515,l1=516,u1=517,c1=518,f1=519,Fp=35044,kp="300 es",bi=2e3,Ol=2001;class Qs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Jt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Fu=Math.PI/180,Kf=180/Math.PI;function ra(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Jt[n&255]+Jt[n>>8&255]+Jt[n>>16&255]+Jt[n>>24&255]+"-"+Jt[e&255]+Jt[e>>8&255]+"-"+Jt[e>>16&15|64]+Jt[e>>24&255]+"-"+Jt[t&63|128]+Jt[t>>8&255]+"-"+Jt[t>>16&255]+Jt[t>>24&255]+Jt[i&255]+Jt[i>>8&255]+Jt[i>>16&255]+Jt[i>>24&255]).toLowerCase()}function pn(n,e,t){return Math.max(e,Math.min(t,n))}function d1(n,e){return(n%e+e)%e}function ku(n,e,t){return(1-t)*n+t*e}function ho(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function dn(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class tt{constructor(e=0,t=0){tt.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(pn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class He{constructor(e,t,i,r,s,o,a,l,u){He.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,u)}set(e,t,i,r,s,o,a,l,u){const f=this.elements;return f[0]=e,f[1]=r,f[2]=a,f[3]=t,f[4]=s,f[5]=l,f[6]=i,f[7]=o,f[8]=u,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],u=i[1],f=i[4],h=i[7],d=i[2],p=i[5],v=i[8],x=r[0],m=r[3],c=r[6],g=r[1],_=r[4],S=r[7],P=r[2],A=r[5],T=r[8];return s[0]=o*x+a*g+l*P,s[3]=o*m+a*_+l*A,s[6]=o*c+a*S+l*T,s[1]=u*x+f*g+h*P,s[4]=u*m+f*_+h*A,s[7]=u*c+f*S+h*T,s[2]=d*x+p*g+v*P,s[5]=d*m+p*_+v*A,s[8]=d*c+p*S+v*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],f=e[8];return t*o*f-t*a*u-i*s*f+i*a*l+r*s*u-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],f=e[8],h=f*o-a*u,d=a*l-f*s,p=u*s-o*l,v=t*h+i*d+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return e[0]=h*x,e[1]=(r*u-f*i)*x,e[2]=(a*i-r*o)*x,e[3]=d*x,e[4]=(f*t-r*l)*x,e[5]=(r*s-a*t)*x,e[6]=p*x,e[7]=(i*l-u*t)*x,e[8]=(o*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),u=Math.sin(s);return this.set(i*l,i*u,-i*(l*o+u*a)+o+e,-r*u,r*l,-r*(-u*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Ou.makeScale(e,t)),this}rotate(e){return this.premultiply(Ou.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ou.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ou=new He;function cv(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Bl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function h1(){const n=Bl("canvas");return n.style.display="block",n}const Op={};function Eo(n){n in Op||(Op[n]=!0,console.warn(n))}function p1(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function m1(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function g1(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Ke={enabled:!0,workingColorSpace:Zs,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ot&&(n.r=Di(n.r),n.g=Di(n.g),n.b=Di(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ot&&(n.r=Us(n.r),n.g=Us(n.g),n.b=Us(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Ji?su:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Di(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Us(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Bp=[.64,.33,.3,.6,.15,.06],Hp=[.2126,.7152,.0722],Vp=[.3127,.329],Gp=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Wp=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Ke.define({[Zs]:{primaries:Bp,whitePoint:Vp,transfer:su,toXYZ:Gp,fromXYZ:Wp,luminanceCoefficients:Hp,workingColorSpaceConfig:{unpackColorSpace:Un},outputColorSpaceConfig:{drawingBufferColorSpace:Un}},[Un]:{primaries:Bp,whitePoint:Vp,transfer:ot,toXYZ:Gp,fromXYZ:Wp,luminanceCoefficients:Hp,outputColorSpaceConfig:{drawingBufferColorSpace:Un}}});let es;class v1{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{es===void 0&&(es=Bl("canvas")),es.width=e.width,es.height=e.height;const i=es.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=es}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Bl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Di(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Di(t[i]/255)*255):t[i]=Di(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let _1=0;class fv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:_1++}),this.uuid=ra(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Bu(r[o].image)):s.push(Bu(r[o]))}else s=Bu(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Bu(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?v1.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let x1=0;class yn extends Qs{constructor(e=yn.DEFAULT_IMAGE,t=yn.DEFAULT_MAPPING,i=Fr,r=Fr,s=ui,o=kr,a=Zn,l=Fi,u=yn.DEFAULT_ANISOTROPY,f=Ji){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:x1++}),this.uuid=ra(),this.name="",this.source=new fv(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=u,this.format=a,this.internalFormat=null,this.type=l,this.offset=new tt(0,0),this.repeat=new tt(1,1),this.center=new tt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=f,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Mf:e.x=e.x-Math.floor(e.x);break;case Fr:e.x=e.x<0?0:1;break;case Ef:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Mf:e.y=e.y-Math.floor(e.y);break;case Fr:e.y=e.y<0?0:1;break;case Ef:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yn.DEFAULT_IMAGE=null;yn.DEFAULT_MAPPING=Zg;yn.DEFAULT_ANISOTROPY=1;class at{constructor(e=0,t=0,i=0,r=1){at.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,u=l[0],f=l[4],h=l[8],d=l[1],p=l[5],v=l[9],x=l[2],m=l[6],c=l[10];if(Math.abs(f-d)<.01&&Math.abs(h-x)<.01&&Math.abs(v-m)<.01){if(Math.abs(f+d)<.1&&Math.abs(h+x)<.1&&Math.abs(v+m)<.1&&Math.abs(u+p+c-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(u+1)/2,S=(p+1)/2,P=(c+1)/2,A=(f+d)/4,T=(h+x)/4,L=(v+m)/4;return _>S&&_>P?_<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(_),r=A/i,s=T/i):S>P?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=A/r,s=L/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=T/s,r=L/s),this.set(i,r,s,t),this}let g=Math.sqrt((m-v)*(m-v)+(h-x)*(h-x)+(d-f)*(d-f));return Math.abs(g)<.001&&(g=1),this.x=(m-v)/g,this.y=(h-x)/g,this.z=(d-f)/g,this.w=Math.acos((u+p+c-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class y1 extends Qs{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new at(0,0,e,t),this.scissorTest=!1,this.viewport=new at(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ui,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new yn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new fv(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class jr extends y1{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class dv extends yn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ei,this.minFilter=ei,this.wrapR=Fr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class S1 extends yn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=ei,this.minFilter=ei,this.wrapR=Fr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class sa{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],u=i[r+1],f=i[r+2],h=i[r+3];const d=s[o+0],p=s[o+1],v=s[o+2],x=s[o+3];if(a===0){e[t+0]=l,e[t+1]=u,e[t+2]=f,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=v,e[t+3]=x;return}if(h!==x||l!==d||u!==p||f!==v){let m=1-a;const c=l*d+u*p+f*v+h*x,g=c>=0?1:-1,_=1-c*c;if(_>Number.EPSILON){const P=Math.sqrt(_),A=Math.atan2(P,c*g);m=Math.sin(m*A)/P,a=Math.sin(a*A)/P}const S=a*g;if(l=l*m+d*S,u=u*m+p*S,f=f*m+v*S,h=h*m+x*S,m===1-a){const P=1/Math.sqrt(l*l+u*u+f*f+h*h);l*=P,u*=P,f*=P,h*=P}}e[t]=l,e[t+1]=u,e[t+2]=f,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],u=i[r+2],f=i[r+3],h=s[o],d=s[o+1],p=s[o+2],v=s[o+3];return e[t]=a*v+f*h+l*p-u*d,e[t+1]=l*v+f*d+u*h-a*p,e[t+2]=u*v+f*p+a*d-l*h,e[t+3]=f*v-a*h-l*d-u*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,u=a(i/2),f=a(r/2),h=a(s/2),d=l(i/2),p=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=d*f*h+u*p*v,this._y=u*p*h-d*f*v,this._z=u*f*v+d*p*h,this._w=u*f*h-d*p*v;break;case"YXZ":this._x=d*f*h+u*p*v,this._y=u*p*h-d*f*v,this._z=u*f*v-d*p*h,this._w=u*f*h+d*p*v;break;case"ZXY":this._x=d*f*h-u*p*v,this._y=u*p*h+d*f*v,this._z=u*f*v+d*p*h,this._w=u*f*h-d*p*v;break;case"ZYX":this._x=d*f*h-u*p*v,this._y=u*p*h+d*f*v,this._z=u*f*v-d*p*h,this._w=u*f*h+d*p*v;break;case"YZX":this._x=d*f*h+u*p*v,this._y=u*p*h+d*f*v,this._z=u*f*v-d*p*h,this._w=u*f*h-d*p*v;break;case"XZY":this._x=d*f*h-u*p*v,this._y=u*p*h-d*f*v,this._z=u*f*v+d*p*h,this._w=u*f*h+d*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],u=t[2],f=t[6],h=t[10],d=i+a+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(f-l)*p,this._y=(s-u)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(f-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+u)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-u)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+f)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+u)/p,this._y=(l+f)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(pn(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,u=t._z,f=t._w;return this._x=i*f+o*a+r*u-s*l,this._y=r*f+o*l+s*a-i*u,this._z=s*f+o*u+i*l-r*a,this._w=o*f-i*a-r*l-s*u,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const u=Math.sqrt(l),f=Math.atan2(u,a),h=Math.sin((1-t)*f)/u,d=Math.sin(t*f)/u;return this._w=o*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class H{constructor(e=0,t=0,i=0){H.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Xp.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Xp.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,u=2*(o*r-a*i),f=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*u+o*h-a*f,this.y=i+l*f+a*u-s*h,this.z=r+l*h+s*f-o*u,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Hu.copy(this).projectOnVector(e),this.sub(Hu)}reflect(e){return this.sub(Hu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(pn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Hu=new H,Xp=new sa;class oa{constructor(e=new H(1/0,1/0,1/0),t=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Wn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Wn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Wn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Wn):Wn.fromBufferAttribute(s,o),Wn.applyMatrix4(e.matrixWorld),this.expandByPoint(Wn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ba.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),ba.copy(i.boundingBox)),ba.applyMatrix4(e.matrixWorld),this.union(ba)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Wn),Wn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(po),Pa.subVectors(this.max,po),ts.subVectors(e.a,po),ns.subVectors(e.b,po),is.subVectors(e.c,po),Gi.subVectors(ns,ts),Wi.subVectors(is,ns),Mr.subVectors(ts,is);let t=[0,-Gi.z,Gi.y,0,-Wi.z,Wi.y,0,-Mr.z,Mr.y,Gi.z,0,-Gi.x,Wi.z,0,-Wi.x,Mr.z,0,-Mr.x,-Gi.y,Gi.x,0,-Wi.y,Wi.x,0,-Mr.y,Mr.x,0];return!Vu(t,ts,ns,is,Pa)||(t=[1,0,0,0,1,0,0,0,1],!Vu(t,ts,ns,is,Pa))?!1:(La.crossVectors(Gi,Wi),t=[La.x,La.y,La.z],Vu(t,ts,ns,is,Pa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Wn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Wn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(_i[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),_i[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),_i[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),_i[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),_i[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),_i[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),_i[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),_i[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(_i),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const _i=[new H,new H,new H,new H,new H,new H,new H,new H],Wn=new H,ba=new oa,ts=new H,ns=new H,is=new H,Gi=new H,Wi=new H,Mr=new H,po=new H,Pa=new H,La=new H,Er=new H;function Vu(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Er.fromArray(n,s);const a=r.x*Math.abs(Er.x)+r.y*Math.abs(Er.y)+r.z*Math.abs(Er.z),l=e.dot(Er),u=t.dot(Er),f=i.dot(Er);if(Math.max(-Math.max(l,u,f),Math.min(l,u,f))>a)return!1}return!0}const M1=new oa,mo=new H,Gu=new H;class th{constructor(e=new H,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):M1.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;mo.subVectors(e,this.center);const t=mo.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(mo,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Gu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(mo.copy(e.center).add(Gu)),this.expandByPoint(mo.copy(e.center).sub(Gu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const xi=new H,Wu=new H,Da=new H,Xi=new H,Xu=new H,Ia=new H,Yu=new H;class E1{constructor(e=new H,t=new H(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,xi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=xi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(xi.copy(this.origin).addScaledVector(this.direction,t),xi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Wu.copy(e).add(t).multiplyScalar(.5),Da.copy(t).sub(e).normalize(),Xi.copy(this.origin).sub(Wu);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Da),a=Xi.dot(this.direction),l=-Xi.dot(Da),u=Xi.lengthSq(),f=Math.abs(1-o*o);let h,d,p,v;if(f>0)if(h=o*l-a,d=o*a-l,v=s*f,h>=0)if(d>=-v)if(d<=v){const x=1/f;h*=x,d*=x,p=h*(h+o*d+2*a)+d*(o*h+d+2*l)+u}else d=s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+u;else d=-s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+u;else d<=-v?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+u):d<=v?(h=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+u):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+d*(d+2*l)+u);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+u;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Wu).addScaledVector(Da,d),p}intersectSphere(e,t){xi.subVectors(e.center,this.origin);const i=xi.dot(this.direction),r=xi.dot(xi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const u=1/this.direction.x,f=1/this.direction.y,h=1/this.direction.z,d=this.origin;return u>=0?(i=(e.min.x-d.x)*u,r=(e.max.x-d.x)*u):(i=(e.max.x-d.x)*u,r=(e.min.x-d.x)*u),f>=0?(s=(e.min.y-d.y)*f,o=(e.max.y-d.y)*f):(s=(e.max.y-d.y)*f,o=(e.min.y-d.y)*f),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,xi)!==null}intersectTriangle(e,t,i,r,s){Xu.subVectors(t,e),Ia.subVectors(i,e),Yu.crossVectors(Xu,Ia);let o=this.direction.dot(Yu),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Xi.subVectors(this.origin,e);const l=a*this.direction.dot(Ia.crossVectors(Xi,Ia));if(l<0)return null;const u=a*this.direction.dot(Xu.cross(Xi));if(u<0||l+u>o)return null;const f=-a*Xi.dot(Yu);return f<0?null:this.at(f/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Et{constructor(e,t,i,r,s,o,a,l,u,f,h,d,p,v,x,m){Et.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,u,f,h,d,p,v,x,m)}set(e,t,i,r,s,o,a,l,u,f,h,d,p,v,x,m){const c=this.elements;return c[0]=e,c[4]=t,c[8]=i,c[12]=r,c[1]=s,c[5]=o,c[9]=a,c[13]=l,c[2]=u,c[6]=f,c[10]=h,c[14]=d,c[3]=p,c[7]=v,c[11]=x,c[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Et().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/rs.setFromMatrixColumn(e,0).length(),s=1/rs.setFromMatrixColumn(e,1).length(),o=1/rs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),u=Math.sin(r),f=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const d=o*f,p=o*h,v=a*f,x=a*h;t[0]=l*f,t[4]=-l*h,t[8]=u,t[1]=p+v*u,t[5]=d-x*u,t[9]=-a*l,t[2]=x-d*u,t[6]=v+p*u,t[10]=o*l}else if(e.order==="YXZ"){const d=l*f,p=l*h,v=u*f,x=u*h;t[0]=d+x*a,t[4]=v*a-p,t[8]=o*u,t[1]=o*h,t[5]=o*f,t[9]=-a,t[2]=p*a-v,t[6]=x+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*f,p=l*h,v=u*f,x=u*h;t[0]=d-x*a,t[4]=-o*h,t[8]=v+p*a,t[1]=p+v*a,t[5]=o*f,t[9]=x-d*a,t[2]=-o*u,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*f,p=o*h,v=a*f,x=a*h;t[0]=l*f,t[4]=v*u-p,t[8]=d*u+x,t[1]=l*h,t[5]=x*u+d,t[9]=p*u-v,t[2]=-u,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,p=o*u,v=a*l,x=a*u;t[0]=l*f,t[4]=x-d*h,t[8]=v*h+p,t[1]=h,t[5]=o*f,t[9]=-a*f,t[2]=-u*f,t[6]=p*h+v,t[10]=d-x*h}else if(e.order==="XZY"){const d=o*l,p=o*u,v=a*l,x=a*u;t[0]=l*f,t[4]=-h,t[8]=u*f,t[1]=d*h+x,t[5]=o*f,t[9]=p*h-v,t[2]=v*h-p,t[6]=a*f,t[10]=x*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(T1,e,w1)}lookAt(e,t,i){const r=this.elements;return Mn.subVectors(e,t),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Yi.crossVectors(i,Mn),Yi.lengthSq()===0&&(Math.abs(i.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Yi.crossVectors(i,Mn)),Yi.normalize(),Ua.crossVectors(Mn,Yi),r[0]=Yi.x,r[4]=Ua.x,r[8]=Mn.x,r[1]=Yi.y,r[5]=Ua.y,r[9]=Mn.y,r[2]=Yi.z,r[6]=Ua.z,r[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],u=i[12],f=i[1],h=i[5],d=i[9],p=i[13],v=i[2],x=i[6],m=i[10],c=i[14],g=i[3],_=i[7],S=i[11],P=i[15],A=r[0],T=r[4],L=r[8],w=r[12],y=r[1],R=r[5],I=r[9],D=r[13],G=r[2],W=r[6],B=r[10],q=r[14],b=r[3],k=r[7],V=r[11],ee=r[15];return s[0]=o*A+a*y+l*G+u*b,s[4]=o*T+a*R+l*W+u*k,s[8]=o*L+a*I+l*B+u*V,s[12]=o*w+a*D+l*q+u*ee,s[1]=f*A+h*y+d*G+p*b,s[5]=f*T+h*R+d*W+p*k,s[9]=f*L+h*I+d*B+p*V,s[13]=f*w+h*D+d*q+p*ee,s[2]=v*A+x*y+m*G+c*b,s[6]=v*T+x*R+m*W+c*k,s[10]=v*L+x*I+m*B+c*V,s[14]=v*w+x*D+m*q+c*ee,s[3]=g*A+_*y+S*G+P*b,s[7]=g*T+_*R+S*W+P*k,s[11]=g*L+_*I+S*B+P*V,s[15]=g*w+_*D+S*q+P*ee,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],u=e[13],f=e[2],h=e[6],d=e[10],p=e[14],v=e[3],x=e[7],m=e[11],c=e[15];return v*(+s*l*h-r*u*h-s*a*d+i*u*d+r*a*p-i*l*p)+x*(+t*l*p-t*u*d+s*o*d-r*o*p+r*u*f-s*l*f)+m*(+t*u*h-t*a*p-s*o*h+i*o*p+s*a*f-i*u*f)+c*(-r*a*f-t*l*h+t*a*d+r*o*h-i*o*d+i*l*f)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],u=e[7],f=e[8],h=e[9],d=e[10],p=e[11],v=e[12],x=e[13],m=e[14],c=e[15],g=h*m*u-x*d*u+x*l*p-a*m*p-h*l*c+a*d*c,_=v*d*u-f*m*u-v*l*p+o*m*p+f*l*c-o*d*c,S=f*x*u-v*h*u+v*a*p-o*x*p-f*a*c+o*h*c,P=v*h*l-f*x*l-v*a*d+o*x*d+f*a*m-o*h*m,A=t*g+i*_+r*S+s*P;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/A;return e[0]=g*T,e[1]=(x*d*s-h*m*s-x*r*p+i*m*p+h*r*c-i*d*c)*T,e[2]=(a*m*s-x*l*s+x*r*u-i*m*u-a*r*c+i*l*c)*T,e[3]=(h*l*s-a*d*s-h*r*u+i*d*u+a*r*p-i*l*p)*T,e[4]=_*T,e[5]=(f*m*s-v*d*s+v*r*p-t*m*p-f*r*c+t*d*c)*T,e[6]=(v*l*s-o*m*s-v*r*u+t*m*u+o*r*c-t*l*c)*T,e[7]=(o*d*s-f*l*s+f*r*u-t*d*u-o*r*p+t*l*p)*T,e[8]=S*T,e[9]=(v*h*s-f*x*s-v*i*p+t*x*p+f*i*c-t*h*c)*T,e[10]=(o*x*s-v*a*s+v*i*u-t*x*u-o*i*c+t*a*c)*T,e[11]=(f*a*s-o*h*s-f*i*u+t*h*u+o*i*p-t*a*p)*T,e[12]=P*T,e[13]=(f*x*r-v*h*r+v*i*d-t*x*d-f*i*m+t*h*m)*T,e[14]=(v*a*r-o*x*r-v*i*l+t*x*l+o*i*m-t*a*m)*T,e[15]=(o*h*r-f*a*r+f*i*l-t*h*l-o*i*d+t*a*d)*T,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,u=s*o,f=s*a;return this.set(u*o+i,u*a-r*l,u*l+r*a,0,u*a+r*l,f*a+i,f*l-r*o,0,u*l-r*a,f*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,u=s+s,f=o+o,h=a+a,d=s*u,p=s*f,v=s*h,x=o*f,m=o*h,c=a*h,g=l*u,_=l*f,S=l*h,P=i.x,A=i.y,T=i.z;return r[0]=(1-(x+c))*P,r[1]=(p+S)*P,r[2]=(v-_)*P,r[3]=0,r[4]=(p-S)*A,r[5]=(1-(d+c))*A,r[6]=(m+g)*A,r[7]=0,r[8]=(v+_)*T,r[9]=(m-g)*T,r[10]=(1-(d+x))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=rs.set(r[0],r[1],r[2]).length();const o=rs.set(r[4],r[5],r[6]).length(),a=rs.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Xn.copy(this);const u=1/s,f=1/o,h=1/a;return Xn.elements[0]*=u,Xn.elements[1]*=u,Xn.elements[2]*=u,Xn.elements[4]*=f,Xn.elements[5]*=f,Xn.elements[6]*=f,Xn.elements[8]*=h,Xn.elements[9]*=h,Xn.elements[10]*=h,t.setFromRotationMatrix(Xn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=bi){const l=this.elements,u=2*s/(t-e),f=2*s/(i-r),h=(t+e)/(t-e),d=(i+r)/(i-r);let p,v;if(a===bi)p=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===Ol)p=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=f,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=bi){const l=this.elements,u=1/(t-e),f=1/(i-r),h=1/(o-s),d=(t+e)*u,p=(i+r)*f;let v,x;if(a===bi)v=(o+s)*h,x=-2*h;else if(a===Ol)v=s*h,x=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*u,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*f,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const rs=new H,Xn=new Et,T1=new H(0,0,0),w1=new H(1,1,1),Yi=new H,Ua=new H,Mn=new H,Yp=new Et,jp=new sa;class pi{constructor(e=0,t=0,i=0,r=pi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],u=r[5],f=r[9],h=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(pn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-f,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,u),this._z=0);break;case"YXZ":this._x=Math.asin(-pn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,u)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(pn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,u)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-pn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,u));break;case"YZX":this._z=Math.asin(pn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-f,u),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-pn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,u),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-f,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Yp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Yp,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return jp.setFromEuler(this),this.setFromQuaternion(jp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}pi.DEFAULT_ORDER="XYZ";class hv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let A1=0;const qp=new H,ss=new sa,yi=new Et,Na=new H,go=new H,C1=new H,R1=new sa,$p=new H(1,0,0),Kp=new H(0,1,0),Zp=new H(0,0,1),Qp={type:"added"},b1={type:"removed"},os={type:"childadded",child:null},ju={type:"childremoved",child:null};class Vt extends Qs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:A1++}),this.uuid=ra(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Vt.DEFAULT_UP.clone();const e=new H,t=new pi,i=new sa,r=new H(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Et},normalMatrix:{value:new He}}),this.matrix=new Et,this.matrixWorld=new Et,this.matrixAutoUpdate=Vt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new hv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ss.setFromAxisAngle(e,t),this.quaternion.multiply(ss),this}rotateOnWorldAxis(e,t){return ss.setFromAxisAngle(e,t),this.quaternion.premultiply(ss),this}rotateX(e){return this.rotateOnAxis($p,e)}rotateY(e){return this.rotateOnAxis(Kp,e)}rotateZ(e){return this.rotateOnAxis(Zp,e)}translateOnAxis(e,t){return qp.copy(e).applyQuaternion(this.quaternion),this.position.add(qp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis($p,e)}translateY(e){return this.translateOnAxis(Kp,e)}translateZ(e){return this.translateOnAxis(Zp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(yi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Na.copy(e):Na.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),go.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?yi.lookAt(go,Na,this.up):yi.lookAt(Na,go,this.up),this.quaternion.setFromRotationMatrix(yi),r&&(yi.extractRotation(r.matrixWorld),ss.setFromRotationMatrix(yi),this.quaternion.premultiply(ss.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Qp),os.child=e,this.dispatchEvent(os),os.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(b1),ju.child=e,this.dispatchEvent(ju),ju.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),yi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),yi.multiply(e.parent.matrixWorld)),e.applyMatrix4(yi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Qp),os.child=e,this.dispatchEvent(os),os.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(go,e,C1),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(go,R1,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let u=0,f=l.length;u<f;u++){const h=l[u];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,u=this.material.length;l<u;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),u=o(e.textures),f=o(e.images),h=o(e.shapes),d=o(e.skeletons),p=o(e.animations),v=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),u.length>0&&(i.textures=u),f.length>0&&(i.images=f),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const u in a){const f=a[u];delete f.metadata,l.push(f)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Vt.DEFAULT_UP=new H(0,1,0);Vt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Vt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Yn=new H,Si=new H,qu=new H,Mi=new H,as=new H,ls=new H,Jp=new H,$u=new H,Ku=new H,Zu=new H,Qu=new at,Ju=new at,ec=new at;class Kn{constructor(e=new H,t=new H,i=new H){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Yn.subVectors(e,t),r.cross(Yn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Yn.subVectors(r,t),Si.subVectors(i,t),qu.subVectors(e,t);const o=Yn.dot(Yn),a=Yn.dot(Si),l=Yn.dot(qu),u=Si.dot(Si),f=Si.dot(qu),h=o*u-a*a;if(h===0)return s.set(0,0,0),null;const d=1/h,p=(u*l-a*f)*d,v=(o*f-a*l)*d;return s.set(1-p-v,v,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,Mi)===null?!1:Mi.x>=0&&Mi.y>=0&&Mi.x+Mi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,Mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Mi.x),l.addScaledVector(o,Mi.y),l.addScaledVector(a,Mi.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return Qu.setScalar(0),Ju.setScalar(0),ec.setScalar(0),Qu.fromBufferAttribute(e,t),Ju.fromBufferAttribute(e,i),ec.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Qu,s.x),o.addScaledVector(Ju,s.y),o.addScaledVector(ec,s.z),o}static isFrontFacing(e,t,i,r){return Yn.subVectors(i,t),Si.subVectors(e,t),Yn.cross(Si).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Yn.subVectors(this.c,this.b),Si.subVectors(this.a,this.b),Yn.cross(Si).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Kn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Kn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;as.subVectors(r,i),ls.subVectors(s,i),$u.subVectors(e,i);const l=as.dot($u),u=ls.dot($u);if(l<=0&&u<=0)return t.copy(i);Ku.subVectors(e,r);const f=as.dot(Ku),h=ls.dot(Ku);if(f>=0&&h<=f)return t.copy(r);const d=l*h-f*u;if(d<=0&&l>=0&&f<=0)return o=l/(l-f),t.copy(i).addScaledVector(as,o);Zu.subVectors(e,s);const p=as.dot(Zu),v=ls.dot(Zu);if(v>=0&&p<=v)return t.copy(s);const x=p*u-l*v;if(x<=0&&u>=0&&v<=0)return a=u/(u-v),t.copy(i).addScaledVector(ls,a);const m=f*v-p*h;if(m<=0&&h-f>=0&&p-v>=0)return Jp.subVectors(s,r),a=(h-f)/(h-f+(p-v)),t.copy(r).addScaledVector(Jp,a);const c=1/(m+x+d);return o=x*c,a=d*c,t.copy(i).addScaledVector(as,o).addScaledVector(ls,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const pv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ji={h:0,s:0,l:0},za={h:0,s:0,l:0};function tc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Un){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ke.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Ke.workingColorSpace){return this.r=e,this.g=t,this.b=i,Ke.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Ke.workingColorSpace){if(e=d1(e,1),t=pn(t,0,1),i=pn(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=tc(o,s,e+1/3),this.g=tc(o,s,e),this.b=tc(o,s,e-1/3)}return Ke.toWorkingColorSpace(this,r),this}setStyle(e,t=Un){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Un){const i=pv[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Di(e.r),this.g=Di(e.g),this.b=Di(e.b),this}copyLinearToSRGB(e){return this.r=Us(e.r),this.g=Us(e.g),this.b=Us(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Un){return Ke.fromWorkingColorSpace(en.copy(this),e),Math.round(pn(en.r*255,0,255))*65536+Math.round(pn(en.g*255,0,255))*256+Math.round(pn(en.b*255,0,255))}getHexString(e=Un){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ke.workingColorSpace){Ke.fromWorkingColorSpace(en.copy(this),t);const i=en.r,r=en.g,s=en.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,u;const f=(a+o)/2;if(a===o)l=0,u=0;else{const h=o-a;switch(u=f<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=u,e.l=f,e}getRGB(e,t=Ke.workingColorSpace){return Ke.fromWorkingColorSpace(en.copy(this),t),e.r=en.r,e.g=en.g,e.b=en.b,e}getStyle(e=Un){Ke.fromWorkingColorSpace(en.copy(this),e);const t=en.r,i=en.g,r=en.b;return e!==Un?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(ji),this.setHSL(ji.h+e,ji.s+t,ji.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(ji),e.getHSL(za);const i=ku(ji.h,za.h,t),r=ku(ji.s,za.s,t),s=ku(ji.l,za.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const en=new je;je.NAMES=pv;let P1=0;class aa extends Qs{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:P1++}),this.uuid=ra(),this.name="",this.blending=Ds,this.side=mr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ff,this.blendDst=df,this.blendEquation=Dr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=Vs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=zp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Jr,this.stencilZFail=Jr,this.stencilZPass=Jr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ds&&(i.blending=this.blending),this.side!==mr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==ff&&(i.blendSrc=this.blendSrc),this.blendDst!==df&&(i.blendDst=this.blendDst),this.blendEquation!==Dr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Vs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==zp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Jr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Jr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Jr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class er extends aa{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.combine=qd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Pt=new H,Fa=new tt;class di{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Fp,this.updateRanges=[],this.gpuType=Ri,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Fa.fromBufferAttribute(this,t),Fa.applyMatrix3(e),this.setXY(t,Fa.x,Fa.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ho(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=dn(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ho(t,this.array)),t}setX(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ho(t,this.array)),t}setY(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ho(t,this.array)),t}setZ(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ho(t,this.array)),t}setW(e,t){return this.normalized&&(t=dn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),i=dn(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),i=dn(i,this.array),r=dn(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=dn(t,this.array),i=dn(i,this.array),r=dn(r,this.array),s=dn(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Fp&&(e.usage=this.usage),e}}class mv extends di{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class gv extends di{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class hi extends di{constructor(e,t,i){super(new Float32Array(e),t,i)}}let L1=0;const In=new Et,nc=new Vt,us=new H,En=new oa,vo=new oa,Ot=new H;class yr extends Qs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:L1++}),this.uuid=ra(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(cv(e)?gv:mv)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new He().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return In.makeRotationFromQuaternion(e),this.applyMatrix4(In),this}rotateX(e){return In.makeRotationX(e),this.applyMatrix4(In),this}rotateY(e){return In.makeRotationY(e),this.applyMatrix4(In),this}rotateZ(e){return In.makeRotationZ(e),this.applyMatrix4(In),this}translate(e,t,i){return In.makeTranslation(e,t,i),this.applyMatrix4(In),this}scale(e,t,i){return In.makeScale(e,t,i),this.applyMatrix4(In),this}lookAt(e){return nc.lookAt(e),nc.updateMatrix(),this.applyMatrix4(nc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(us).negate(),this.translate(us.x,us.y,us.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new hi(i,3))}else{for(let i=0,r=t.count;i<r;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new oa);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];En.setFromBufferAttribute(s),this.morphTargetsRelative?(Ot.addVectors(this.boundingBox.min,En.min),this.boundingBox.expandByPoint(Ot),Ot.addVectors(this.boundingBox.max,En.max),this.boundingBox.expandByPoint(Ot)):(this.boundingBox.expandByPoint(En.min),this.boundingBox.expandByPoint(En.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new th);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(e){const i=this.boundingSphere.center;if(En.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];vo.setFromBufferAttribute(a),this.morphTargetsRelative?(Ot.addVectors(En.min,vo.min),En.expandByPoint(Ot),Ot.addVectors(En.max,vo.max),En.expandByPoint(Ot)):(En.expandByPoint(vo.min),En.expandByPoint(vo.max))}En.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Ot.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ot));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let u=0,f=a.count;u<f;u++)Ot.fromBufferAttribute(a,u),l&&(us.fromBufferAttribute(e,u),Ot.add(us)),r=Math.max(r,i.distanceToSquared(Ot))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new di(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<i.count;L++)a[L]=new H,l[L]=new H;const u=new H,f=new H,h=new H,d=new tt,p=new tt,v=new tt,x=new H,m=new H;function c(L,w,y){u.fromBufferAttribute(i,L),f.fromBufferAttribute(i,w),h.fromBufferAttribute(i,y),d.fromBufferAttribute(s,L),p.fromBufferAttribute(s,w),v.fromBufferAttribute(s,y),f.sub(u),h.sub(u),p.sub(d),v.sub(d);const R=1/(p.x*v.y-v.x*p.y);isFinite(R)&&(x.copy(f).multiplyScalar(v.y).addScaledVector(h,-p.y).multiplyScalar(R),m.copy(h).multiplyScalar(p.x).addScaledVector(f,-v.x).multiplyScalar(R),a[L].add(x),a[w].add(x),a[y].add(x),l[L].add(m),l[w].add(m),l[y].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let L=0,w=g.length;L<w;++L){const y=g[L],R=y.start,I=y.count;for(let D=R,G=R+I;D<G;D+=3)c(e.getX(D+0),e.getX(D+1),e.getX(D+2))}const _=new H,S=new H,P=new H,A=new H;function T(L){P.fromBufferAttribute(r,L),A.copy(P);const w=a[L];_.copy(w),_.sub(P.multiplyScalar(P.dot(w))).normalize(),S.crossVectors(A,w);const R=S.dot(l[L])<0?-1:1;o.setXYZW(L,_.x,_.y,_.z,R)}for(let L=0,w=g.length;L<w;++L){const y=g[L],R=y.start,I=y.count;for(let D=R,G=R+I;D<G;D+=3)T(e.getX(D+0)),T(e.getX(D+1)),T(e.getX(D+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new di(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new H,s=new H,o=new H,a=new H,l=new H,u=new H,f=new H,h=new H;if(e)for(let d=0,p=e.count;d<p;d+=3){const v=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,v),s.fromBufferAttribute(t,x),o.fromBufferAttribute(t,m),f.subVectors(o,s),h.subVectors(r,s),f.cross(h),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,x),u.fromBufferAttribute(i,m),a.add(f),l.add(f),u.add(f),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,u.x,u.y,u.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),f.subVectors(o,s),h.subVectors(r,s),f.cross(h),i.setXYZ(d+0,f.x,f.y,f.z),i.setXYZ(d+1,f.x,f.y,f.z),i.setXYZ(d+2,f.x,f.y,f.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ot.fromBufferAttribute(e,t),Ot.normalize(),e.setXYZ(t,Ot.x,Ot.y,Ot.z)}toNonIndexed(){function e(a,l){const u=a.array,f=a.itemSize,h=a.normalized,d=new u.constructor(l.length*f);let p=0,v=0;for(let x=0,m=l.length;x<m;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*f;for(let c=0;c<f;c++)d[v++]=u[p++]}return new di(d,f,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new yr,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],u=e(l,i);t.setAttribute(a,u)}const s=this.morphAttributes;for(const a in s){const l=[],u=s[a];for(let f=0,h=u.length;f<h;f++){const d=u[f],p=e(d,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const u=o[a];t.addGroup(u.start,u.count,u.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const u in l)l[u]!==void 0&&(e[u]=l[u]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const u=i[l];e.data.attributes[l]=u.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const u=this.morphAttributes[l],f=[];for(let h=0,d=u.length;h<d;h++){const p=u[h];f.push(p.toJSON(e.data))}f.length>0&&(r[l]=f,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const u in r){const f=r[u];this.setAttribute(u,f.clone(t))}const s=e.morphAttributes;for(const u in s){const f=[],h=s[u];for(let d=0,p=h.length;d<p;d++)f.push(h[d].clone(t));this.morphAttributes[u]=f}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let u=0,f=o.length;u<f;u++){const h=o[u];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const em=new Et,Tr=new E1,ka=new th,tm=new H,Oa=new H,Ba=new H,Ha=new H,ic=new H,Va=new H,nm=new H,Ga=new H;class ht extends Vt{constructor(e=new yr,t=new er){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){Va.set(0,0,0);for(let l=0,u=s.length;l<u;l++){const f=a[l],h=s[l];f!==0&&(ic.fromBufferAttribute(h,e),o?Va.addScaledVector(ic,f):Va.addScaledVector(ic.sub(t),f))}t.add(Va)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ka.copy(i.boundingSphere),ka.applyMatrix4(s),Tr.copy(e.ray).recast(e.near),!(ka.containsPoint(Tr.origin)===!1&&(Tr.intersectSphere(ka,tm)===null||Tr.origin.distanceToSquared(tm)>(e.far-e.near)**2))&&(em.copy(s).invert(),Tr.copy(e.ray).applyMatrix4(em),!(i.boundingBox!==null&&Tr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Tr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,u=s.attributes.uv,f=s.attributes.uv1,h=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,x=d.length;v<x;v++){const m=d[v],c=o[m.materialIndex],g=Math.max(m.start,p.start),_=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let S=g,P=_;S<P;S+=3){const A=a.getX(S),T=a.getX(S+1),L=a.getX(S+2);r=Wa(this,c,e,i,u,f,h,A,T,L),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let m=v,c=x;m<c;m+=3){const g=a.getX(m),_=a.getX(m+1),S=a.getX(m+2);r=Wa(this,o,e,i,u,f,h,g,_,S),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,x=d.length;v<x;v++){const m=d[v],c=o[m.materialIndex],g=Math.max(m.start,p.start),_=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let S=g,P=_;S<P;S+=3){const A=S,T=S+1,L=S+2;r=Wa(this,c,e,i,u,f,h,A,T,L),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=v,c=x;m<c;m+=3){const g=m,_=m+1,S=m+2;r=Wa(this,o,e,i,u,f,h,g,_,S),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function D1(n,e,t,i,r,s,o,a){let l;if(e.side===xn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===mr,a),l===null)return null;Ga.copy(a),Ga.applyMatrix4(n.matrixWorld);const u=t.ray.origin.distanceTo(Ga);return u<t.near||u>t.far?null:{distance:u,point:Ga.clone(),object:n}}function Wa(n,e,t,i,r,s,o,a,l,u){n.getVertexPosition(a,Oa),n.getVertexPosition(l,Ba),n.getVertexPosition(u,Ha);const f=D1(n,e,t,i,Oa,Ba,Ha,nm);if(f){const h=new H;Kn.getBarycoord(nm,Oa,Ba,Ha,h),r&&(f.uv=Kn.getInterpolatedAttribute(r,a,l,u,h,new tt)),s&&(f.uv1=Kn.getInterpolatedAttribute(s,a,l,u,h,new tt)),o&&(f.normal=Kn.getInterpolatedAttribute(o,a,l,u,h,new H),f.normal.dot(i.direction)>0&&f.normal.multiplyScalar(-1));const d={a,b:l,c:u,normal:new H,materialIndex:0};Kn.getNormal(Oa,Ba,Ha,d.normal),f.face=d,f.barycoord=h}return f}class rn extends yr{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],u=[],f=[],h=[];let d=0,p=0;v("z","y","x",-1,-1,i,t,e,o,s,0),v("z","y","x",1,-1,i,t,-e,o,s,1),v("x","z","y",1,1,e,i,t,r,o,2),v("x","z","y",1,-1,e,i,-t,r,o,3),v("x","y","z",1,-1,e,t,i,r,s,4),v("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new hi(u,3)),this.setAttribute("normal",new hi(f,3)),this.setAttribute("uv",new hi(h,2));function v(x,m,c,g,_,S,P,A,T,L,w){const y=S/T,R=P/L,I=S/2,D=P/2,G=A/2,W=T+1,B=L+1;let q=0,b=0;const k=new H;for(let V=0;V<B;V++){const ee=V*R-D;for(let re=0;re<W;re++){const Ie=re*y-I;k[x]=Ie*g,k[m]=ee*_,k[c]=G,u.push(k.x,k.y,k.z),k[x]=0,k[m]=0,k[c]=A>0?1:-1,f.push(k.x,k.y,k.z),h.push(re/T),h.push(1-V/L),q+=1}}for(let V=0;V<L;V++)for(let ee=0;ee<T;ee++){const re=d+ee+W*V,Ie=d+ee+W*(V+1),$=d+(ee+1)+W*(V+1),ie=d+(ee+1)+W*V;l.push(re,Ie,ie),l.push(Ie,$,ie),b+=6}a.addGroup(p,b,w),p+=b,d+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function js(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function on(n){const e={};for(let t=0;t<n.length;t++){const i=js(n[t]);for(const r in i)e[r]=i[r]}return e}function I1(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function vv(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ke.workingColorSpace}const U1={clone:js,merge:on};var N1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,z1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class gr extends aa{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=N1,this.fragmentShader=z1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=js(e.uniforms),this.uniformsGroups=I1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class _v extends Vt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Et,this.projectionMatrix=new Et,this.projectionMatrixInverse=new Et,this.coordinateSystem=bi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const qi=new H,im=new tt,rm=new tt;class wn extends _v{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Kf*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Fu*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Kf*2*Math.atan(Math.tan(Fu*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){qi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(qi.x,qi.y).multiplyScalar(-e/qi.z),qi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(qi.x,qi.y).multiplyScalar(-e/qi.z)}getViewSize(e,t){return this.getViewBounds(e,im,rm),t.subVectors(rm,im)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Fu*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,u=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/u,r*=o.width/l,i*=o.height/u}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const cs=-90,fs=1;class F1 extends Vt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new wn(cs,fs,e,t);r.layers=this.layers,this.add(r);const s=new wn(cs,fs,e,t);s.layers=this.layers,this.add(s);const o=new wn(cs,fs,e,t);o.layers=this.layers,this.add(o);const a=new wn(cs,fs,e,t);a.layers=this.layers,this.add(a);const l=new wn(cs,fs,e,t);l.layers=this.layers,this.add(l);const u=new wn(cs,fs,e,t);u.layers=this.layers,this.add(u)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const u of t)this.remove(u);if(e===bi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ol)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const u of t)this.add(u),u.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,u,f]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,u),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,f),e.setRenderTarget(h,d,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class xv extends yn{constructor(e,t,i,r,s,o,a,l,u,f){e=e!==void 0?e:[],t=t!==void 0?t:Gs,super(e,t,i,r,s,o,a,l,u,f),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class k1 extends jr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new xv(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ui}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new rn(5,5,5),s=new gr({name:"CubemapFromEquirect",uniforms:js(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:xn,blending:fr});s.uniforms.tEquirect.value=t;const o=new ht(r,s),a=t.minFilter;return t.minFilter===kr&&(t.minFilter=ui),new F1(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const rc=new H,O1=new H,B1=new He;class Pr{constructor(e=new H(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=rc.subVectors(i,t).cross(O1.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(rc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||B1.getNormalMatrix(e),r=this.coplanarPoint(rc).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const wr=new th,Xa=new H;class nh{constructor(e=new Pr,t=new Pr,i=new Pr,r=new Pr,s=new Pr,o=new Pr){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=bi){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],u=r[4],f=r[5],h=r[6],d=r[7],p=r[8],v=r[9],x=r[10],m=r[11],c=r[12],g=r[13],_=r[14],S=r[15];if(i[0].setComponents(l-s,d-u,m-p,S-c).normalize(),i[1].setComponents(l+s,d+u,m+p,S+c).normalize(),i[2].setComponents(l+o,d+f,m+v,S+g).normalize(),i[3].setComponents(l-o,d-f,m-v,S-g).normalize(),i[4].setComponents(l-a,d-h,m-x,S-_).normalize(),t===bi)i[5].setComponents(l+a,d+h,m+x,S+_).normalize();else if(t===Ol)i[5].setComponents(a,h,x,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),wr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),wr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(wr)}intersectsSprite(e){return wr.center.set(0,0,0),wr.radius=.7071067811865476,wr.applyMatrix4(e.matrixWorld),this.intersectsSphere(wr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Xa.x=r.normal.x>0?e.max.x:e.min.x,Xa.y=r.normal.y>0?e.max.y:e.min.y,Xa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Xa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function yv(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function H1(n){const e=new WeakMap;function t(a,l){const u=a.array,f=a.usage,h=u.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,u,f),a.onUploadCallback();let p;if(u instanceof Float32Array)p=n.FLOAT;else if(u instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(u instanceof Int16Array)p=n.SHORT;else if(u instanceof Uint32Array)p=n.UNSIGNED_INT;else if(u instanceof Int32Array)p=n.INT;else if(u instanceof Int8Array)p=n.BYTE;else if(u instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:d,type:p,bytesPerElement:u.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,u){const f=l.array,h=l.updateRanges;if(n.bindBuffer(u,a),h.length===0)n.bufferSubData(u,0,f);else{h.sort((p,v)=>p.start-v.start);let d=0;for(let p=1;p<h.length;p++){const v=h[d],x=h[p];x.start<=v.start+v.count+1?v.count=Math.max(v.count,x.start+x.count-v.start):(++d,h[d]=x)}h.length=d+1;for(let p=0,v=h.length;p<v;p++){const x=h[p];n.bufferSubData(u,x.start*f.BYTES_PER_ELEMENT,f,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const f=e.get(a);(!f||f.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const u=e.get(a);if(u===void 0)e.set(a,t(a,l));else if(u.version<a.version){if(u.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,a,l),u.version=a.version}}return{get:r,remove:s,update:o}}class Pi extends yr{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),u=a+1,f=l+1,h=e/a,d=t/l,p=[],v=[],x=[],m=[];for(let c=0;c<f;c++){const g=c*d-o;for(let _=0;_<u;_++){const S=_*h-s;v.push(S,-g,0),x.push(0,0,1),m.push(_/a),m.push(1-c/l)}}for(let c=0;c<l;c++)for(let g=0;g<a;g++){const _=g+u*c,S=g+u*(c+1),P=g+1+u*(c+1),A=g+1+u*c;p.push(_,S,A),p.push(S,P,A)}this.setIndex(p),this.setAttribute("position",new hi(v,3)),this.setAttribute("normal",new hi(x,3)),this.setAttribute("uv",new hi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pi(e.width,e.height,e.widthSegments,e.heightSegments)}}var V1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,G1=`#ifdef USE_ALPHAHASH
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
#endif`,W1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,X1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Y1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,j1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,q1=`#ifdef USE_AOMAP
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
#endif`,$1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,K1=`#ifdef USE_BATCHING
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
#endif`,Z1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Q1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,J1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,eS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,tS=`#ifdef USE_IRIDESCENCE
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
#endif`,nS=`#ifdef USE_BUMPMAP
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
#endif`,iS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,rS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,oS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,aS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,lS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,uS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,cS=`#if defined( USE_COLOR_ALPHA )
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
#endif`,fS=`#define PI 3.141592653589793
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
} // validated`,dS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,hS=`vec3 transformedNormal = objectNormal;
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
#endif`,pS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,mS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,gS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,vS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,_S="gl_FragColor = linearToOutputTexel( gl_FragColor );",xS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,yS=`#ifdef USE_ENVMAP
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
#endif`,SS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,MS=`#ifdef USE_ENVMAP
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
#endif`,ES=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,TS=`#ifdef USE_ENVMAP
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
#endif`,wS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,AS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,CS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,RS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,bS=`#ifdef USE_GRADIENTMAP
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
}`,PS=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,LS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,DS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,IS=`uniform bool receiveShadow;
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
#endif`,US=`#ifdef USE_ENVMAP
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
#endif`,NS=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,FS=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,kS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,OS=`PhysicalMaterial material;
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
#endif`,BS=`struct PhysicalMaterial {
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
}`,HS=`
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
#endif`,VS=`#if defined( RE_IndirectDiffuse )
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
#endif`,GS=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,WS=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,XS=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,YS=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,jS=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qS=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$S=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,KS=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ZS=`#if defined( USE_POINTS_UV )
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
#endif`,QS=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,JS=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,eM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,tM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,iM=`#ifdef USE_MORPHTARGETS
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
#endif`,rM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,oM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,aM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,lM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,cM=`#ifdef USE_NORMALMAP
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
#endif`,fM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,dM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,pM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,mM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,gM=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,vM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,_M=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,xM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,yM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,SM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,MM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,EM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,TM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,wM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,AM=`float getShadowMask() {
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
}`,CM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,RM=`#ifdef USE_SKINNING
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
#endif`,bM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,PM=`#ifdef USE_SKINNING
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
#endif`,LM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,DM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,IM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,UM=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,NM=`#ifdef USE_TRANSMISSION
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
#endif`,zM=`#ifdef USE_TRANSMISSION
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
#endif`,FM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,OM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,BM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const HM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,VM=`uniform sampler2D t2D;
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
}`,GM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,WM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,XM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,YM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jM=`#include <common>
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
}`,qM=`#if DEPTH_PACKING == 3200
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
}`,$M=`#define DISTANCE
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
}`,KM=`#define DISTANCE
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
}`,ZM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,QM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,JM=`uniform float scale;
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
}`,eE=`uniform vec3 diffuse;
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
}`,tE=`#include <common>
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
}`,nE=`uniform vec3 diffuse;
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
}`,iE=`#define LAMBERT
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
}`,rE=`#define LAMBERT
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
}`,sE=`#define MATCAP
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
}`,oE=`#define MATCAP
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
}`,aE=`#define NORMAL
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
}`,lE=`#define NORMAL
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
}`,uE=`#define PHONG
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
}`,cE=`#define PHONG
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
}`,fE=`#define STANDARD
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
}`,dE=`#define STANDARD
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
}`,hE=`#define TOON
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
}`,pE=`#define TOON
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
}`,mE=`uniform float size;
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
}`,gE=`uniform vec3 diffuse;
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
}`,vE=`#include <common>
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
}`,_E=`uniform vec3 color;
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
}`,xE=`uniform float rotation;
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
}`,yE=`uniform vec3 diffuse;
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
}`,We={alphahash_fragment:V1,alphahash_pars_fragment:G1,alphamap_fragment:W1,alphamap_pars_fragment:X1,alphatest_fragment:Y1,alphatest_pars_fragment:j1,aomap_fragment:q1,aomap_pars_fragment:$1,batching_pars_vertex:K1,batching_vertex:Z1,begin_vertex:Q1,beginnormal_vertex:J1,bsdfs:eS,iridescence_fragment:tS,bumpmap_pars_fragment:nS,clipping_planes_fragment:iS,clipping_planes_pars_fragment:rS,clipping_planes_pars_vertex:sS,clipping_planes_vertex:oS,color_fragment:aS,color_pars_fragment:lS,color_pars_vertex:uS,color_vertex:cS,common:fS,cube_uv_reflection_fragment:dS,defaultnormal_vertex:hS,displacementmap_pars_vertex:pS,displacementmap_vertex:mS,emissivemap_fragment:gS,emissivemap_pars_fragment:vS,colorspace_fragment:_S,colorspace_pars_fragment:xS,envmap_fragment:yS,envmap_common_pars_fragment:SS,envmap_pars_fragment:MS,envmap_pars_vertex:ES,envmap_physical_pars_fragment:US,envmap_vertex:TS,fog_vertex:wS,fog_pars_vertex:AS,fog_fragment:CS,fog_pars_fragment:RS,gradientmap_pars_fragment:bS,lightmap_pars_fragment:PS,lights_lambert_fragment:LS,lights_lambert_pars_fragment:DS,lights_pars_begin:IS,lights_toon_fragment:NS,lights_toon_pars_fragment:zS,lights_phong_fragment:FS,lights_phong_pars_fragment:kS,lights_physical_fragment:OS,lights_physical_pars_fragment:BS,lights_fragment_begin:HS,lights_fragment_maps:VS,lights_fragment_end:GS,logdepthbuf_fragment:WS,logdepthbuf_pars_fragment:XS,logdepthbuf_pars_vertex:YS,logdepthbuf_vertex:jS,map_fragment:qS,map_pars_fragment:$S,map_particle_fragment:KS,map_particle_pars_fragment:ZS,metalnessmap_fragment:QS,metalnessmap_pars_fragment:JS,morphinstance_vertex:eM,morphcolor_vertex:tM,morphnormal_vertex:nM,morphtarget_pars_vertex:iM,morphtarget_vertex:rM,normal_fragment_begin:sM,normal_fragment_maps:oM,normal_pars_fragment:aM,normal_pars_vertex:lM,normal_vertex:uM,normalmap_pars_fragment:cM,clearcoat_normal_fragment_begin:fM,clearcoat_normal_fragment_maps:dM,clearcoat_pars_fragment:hM,iridescence_pars_fragment:pM,opaque_fragment:mM,packing:gM,premultiplied_alpha_fragment:vM,project_vertex:_M,dithering_fragment:xM,dithering_pars_fragment:yM,roughnessmap_fragment:SM,roughnessmap_pars_fragment:MM,shadowmap_pars_fragment:EM,shadowmap_pars_vertex:TM,shadowmap_vertex:wM,shadowmask_pars_fragment:AM,skinbase_vertex:CM,skinning_pars_vertex:RM,skinning_vertex:bM,skinnormal_vertex:PM,specularmap_fragment:LM,specularmap_pars_fragment:DM,tonemapping_fragment:IM,tonemapping_pars_fragment:UM,transmission_fragment:NM,transmission_pars_fragment:zM,uv_pars_fragment:FM,uv_pars_vertex:kM,uv_vertex:OM,worldpos_vertex:BM,background_vert:HM,background_frag:VM,backgroundCube_vert:GM,backgroundCube_frag:WM,cube_vert:XM,cube_frag:YM,depth_vert:jM,depth_frag:qM,distanceRGBA_vert:$M,distanceRGBA_frag:KM,equirect_vert:ZM,equirect_frag:QM,linedashed_vert:JM,linedashed_frag:eE,meshbasic_vert:tE,meshbasic_frag:nE,meshlambert_vert:iE,meshlambert_frag:rE,meshmatcap_vert:sE,meshmatcap_frag:oE,meshnormal_vert:aE,meshnormal_frag:lE,meshphong_vert:uE,meshphong_frag:cE,meshphysical_vert:fE,meshphysical_frag:dE,meshtoon_vert:hE,meshtoon_frag:pE,points_vert:mE,points_frag:gE,shadow_vert:vE,shadow_frag:_E,sprite_vert:xE,sprite_frag:yE},he={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new tt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new tt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},oi={basic:{uniforms:on([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:on([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new je(0)}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:on([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:on([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:on([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new je(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:on([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:on([he.points,he.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:on([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:on([he.common,he.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:on([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:on([he.sprite,he.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distanceRGBA:{uniforms:on([he.common,he.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distanceRGBA_vert,fragmentShader:We.distanceRGBA_frag},shadow:{uniforms:on([he.lights,he.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};oi.physical={uniforms:on([oi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new tt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new tt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new tt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const Ya={r:0,b:0,g:0},Ar=new pi,SE=new Et;function ME(n,e,t,i,r,s,o){const a=new je(0);let l=s===!0?0:1,u,f,h=null,d=0,p=null;function v(g){let _=g.isScene===!0?g.background:null;return _&&_.isTexture&&(_=(g.backgroundBlurriness>0?t:e).get(_)),_}function x(g){let _=!1;const S=v(g);S===null?c(a,l):S&&S.isColor&&(c(S,1),_=!0);const P=n.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(g,_){const S=v(_);S&&(S.isCubeTexture||S.mapping===ru)?(f===void 0&&(f=new ht(new rn(1,1,1),new gr({name:"BackgroundCubeMaterial",uniforms:js(oi.backgroundCube.uniforms),vertexShader:oi.backgroundCube.vertexShader,fragmentShader:oi.backgroundCube.fragmentShader,side:xn,depthTest:!1,depthWrite:!1,fog:!1})),f.geometry.deleteAttribute("normal"),f.geometry.deleteAttribute("uv"),f.onBeforeRender=function(P,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(f.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(f)),Ar.copy(_.backgroundRotation),Ar.x*=-1,Ar.y*=-1,Ar.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Ar.y*=-1,Ar.z*=-1),f.material.uniforms.envMap.value=S,f.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,f.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,f.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,f.material.uniforms.backgroundRotation.value.setFromMatrix4(SE.makeRotationFromEuler(Ar)),f.material.toneMapped=Ke.getTransfer(S.colorSpace)!==ot,(h!==S||d!==S.version||p!==n.toneMapping)&&(f.material.needsUpdate=!0,h=S,d=S.version,p=n.toneMapping),f.layers.enableAll(),g.unshift(f,f.geometry,f.material,0,0,null)):S&&S.isTexture&&(u===void 0&&(u=new ht(new Pi(2,2),new gr({name:"BackgroundMaterial",uniforms:js(oi.background.uniforms),vertexShader:oi.background.vertexShader,fragmentShader:oi.background.fragmentShader,side:mr,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),Object.defineProperty(u.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(u)),u.material.uniforms.t2D.value=S,u.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,u.material.toneMapped=Ke.getTransfer(S.colorSpace)!==ot,S.matrixAutoUpdate===!0&&S.updateMatrix(),u.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||d!==S.version||p!==n.toneMapping)&&(u.material.needsUpdate=!0,h=S,d=S.version,p=n.toneMapping),u.layers.enableAll(),g.unshift(u,u.geometry,u.material,0,0,null))}function c(g,_){g.getRGB(Ya,vv(n)),i.buffers.color.setClear(Ya.r,Ya.g,Ya.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(g,_=1){a.set(g),l=_,c(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,c(a,l)},render:x,addToRenderList:m}}function EE(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(y,R,I,D,G){let W=!1;const B=h(D,I,R);s!==B&&(s=B,u(s.object)),W=p(y,D,I,G),W&&v(y,D,I,G),G!==null&&e.update(G,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,S(y,R,I,D),G!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function l(){return n.createVertexArray()}function u(y){return n.bindVertexArray(y)}function f(y){return n.deleteVertexArray(y)}function h(y,R,I){const D=I.wireframe===!0;let G=i[y.id];G===void 0&&(G={},i[y.id]=G);let W=G[R.id];W===void 0&&(W={},G[R.id]=W);let B=W[D];return B===void 0&&(B=d(l()),W[D]=B),B}function d(y){const R=[],I=[],D=[];for(let G=0;G<t;G++)R[G]=0,I[G]=0,D[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:D,object:y,attributes:{},index:null}}function p(y,R,I,D){const G=s.attributes,W=R.attributes;let B=0;const q=I.getAttributes();for(const b in q)if(q[b].location>=0){const V=G[b];let ee=W[b];if(ee===void 0&&(b==="instanceMatrix"&&y.instanceMatrix&&(ee=y.instanceMatrix),b==="instanceColor"&&y.instanceColor&&(ee=y.instanceColor)),V===void 0||V.attribute!==ee||ee&&V.data!==ee.data)return!0;B++}return s.attributesNum!==B||s.index!==D}function v(y,R,I,D){const G={},W=R.attributes;let B=0;const q=I.getAttributes();for(const b in q)if(q[b].location>=0){let V=W[b];V===void 0&&(b==="instanceMatrix"&&y.instanceMatrix&&(V=y.instanceMatrix),b==="instanceColor"&&y.instanceColor&&(V=y.instanceColor));const ee={};ee.attribute=V,V&&V.data&&(ee.data=V.data),G[b]=ee,B++}s.attributes=G,s.attributesNum=B,s.index=D}function x(){const y=s.newAttributes;for(let R=0,I=y.length;R<I;R++)y[R]=0}function m(y){c(y,0)}function c(y,R){const I=s.newAttributes,D=s.enabledAttributes,G=s.attributeDivisors;I[y]=1,D[y]===0&&(n.enableVertexAttribArray(y),D[y]=1),G[y]!==R&&(n.vertexAttribDivisor(y,R),G[y]=R)}function g(){const y=s.newAttributes,R=s.enabledAttributes;for(let I=0,D=R.length;I<D;I++)R[I]!==y[I]&&(n.disableVertexAttribArray(I),R[I]=0)}function _(y,R,I,D,G,W,B){B===!0?n.vertexAttribIPointer(y,R,I,G,W):n.vertexAttribPointer(y,R,I,D,G,W)}function S(y,R,I,D){x();const G=D.attributes,W=I.getAttributes(),B=R.defaultAttributeValues;for(const q in W){const b=W[q];if(b.location>=0){let k=G[q];if(k===void 0&&(q==="instanceMatrix"&&y.instanceMatrix&&(k=y.instanceMatrix),q==="instanceColor"&&y.instanceColor&&(k=y.instanceColor)),k!==void 0){const V=k.normalized,ee=k.itemSize,re=e.get(k);if(re===void 0)continue;const Ie=re.buffer,$=re.type,ie=re.bytesPerElement,fe=$===n.INT||$===n.UNSIGNED_INT||k.gpuType===$d;if(k.isInterleavedBufferAttribute){const le=k.data,ce=le.stride,Pe=k.offset;if(le.isInstancedInterleavedBuffer){for(let ze=0;ze<b.locationSize;ze++)c(b.location+ze,le.meshPerAttribute);y.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=le.meshPerAttribute*le.count)}else for(let ze=0;ze<b.locationSize;ze++)m(b.location+ze);n.bindBuffer(n.ARRAY_BUFFER,Ie);for(let ze=0;ze<b.locationSize;ze++)_(b.location+ze,ee/b.locationSize,$,V,ce*ie,(Pe+ee/b.locationSize*ze)*ie,fe)}else{if(k.isInstancedBufferAttribute){for(let le=0;le<b.locationSize;le++)c(b.location+le,k.meshPerAttribute);y.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let le=0;le<b.locationSize;le++)m(b.location+le);n.bindBuffer(n.ARRAY_BUFFER,Ie);for(let le=0;le<b.locationSize;le++)_(b.location+le,ee/b.locationSize,$,V,ee*ie,ee/b.locationSize*le*ie,fe)}}else if(B!==void 0){const V=B[q];if(V!==void 0)switch(V.length){case 2:n.vertexAttrib2fv(b.location,V);break;case 3:n.vertexAttrib3fv(b.location,V);break;case 4:n.vertexAttrib4fv(b.location,V);break;default:n.vertexAttrib1fv(b.location,V)}}}}g()}function P(){L();for(const y in i){const R=i[y];for(const I in R){const D=R[I];for(const G in D)f(D[G].object),delete D[G];delete R[I]}delete i[y]}}function A(y){if(i[y.id]===void 0)return;const R=i[y.id];for(const I in R){const D=R[I];for(const G in D)f(D[G].object),delete D[G];delete R[I]}delete i[y.id]}function T(y){for(const R in i){const I=i[R];if(I[y.id]===void 0)continue;const D=I[y.id];for(const G in D)f(D[G].object),delete D[G];delete I[y.id]}}function L(){w(),o=!0,s!==r&&(s=r,u(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:L,resetDefaultState:w,dispose:P,releaseStatesOfGeometry:A,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:m,disableUnusedAttributes:g}}function TE(n,e,t){let i;function r(u){i=u}function s(u,f){n.drawArrays(i,u,f),t.update(f,i,1)}function o(u,f,h){h!==0&&(n.drawArraysInstanced(i,u,f,h),t.update(f,i,h))}function a(u,f,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,u,0,f,0,h);let p=0;for(let v=0;v<h;v++)p+=f[v];t.update(p,i,1)}function l(u,f,h,d){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<u.length;v++)o(u[v],f[v],d[v]);else{p.multiDrawArraysInstancedWEBGL(i,u,0,f,0,d,0,h);let v=0;for(let x=0;x<h;x++)v+=f[x]*d[x];t.update(v,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function wE(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const T=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==Zn&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){const L=T===ia&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==Fi&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&T!==Ri&&!L)}function l(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let u=t.precision!==void 0?t.precision:"highp";const f=l(u);f!==u&&(console.warn("THREE.WebGLRenderer:",u,"not supported, using",f,"instead."),u=f);const h=t.logarithmicDepthBuffer===!0,d=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),c=n.getParameter(n.MAX_VERTEX_ATTRIBS),g=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),P=v>0,A=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:u,logarithmicDepthBuffer:h,reverseDepthBuffer:d,maxTextures:p,maxVertexTextures:v,maxTextureSize:x,maxCubemapSize:m,maxAttributes:c,maxVertexUniforms:g,maxVaryings:_,maxFragmentUniforms:S,vertexTextures:P,maxSamples:A}}function AE(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new Pr,a=new He,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||i!==0||r;return r=d,i=h.length,p},this.beginShadows=function(){s=!0,f(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){t=f(h,d,0)},this.setState=function(h,d,p){const v=h.clippingPlanes,x=h.clipIntersection,m=h.clipShadows,c=n.get(h);if(!r||v===null||v.length===0||s&&!m)s?f(null):u();else{const g=s?0:i,_=g*4;let S=c.clippingState||null;l.value=S,S=f(v,d,_,p);for(let P=0;P!==_;++P)S[P]=t[P];c.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=g}};function u(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function f(h,d,p,v){const x=h!==null?h.length:0;let m=null;if(x!==0){if(m=l.value,v!==!0||m===null){const c=p+x*4,g=d.matrixWorldInverse;a.getNormalMatrix(g),(m===null||m.length<c)&&(m=new Float32Array(c));for(let _=0,S=p;_!==x;++_,S+=4)o.copy(h[_]).applyMatrix4(g,a),o.normal.toArray(m,S),m[S+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function CE(n){let e=new WeakMap;function t(o,a){return a===yf?o.mapping=Gs:a===Sf&&(o.mapping=Ws),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===yf||a===Sf)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const u=new k1(l.height);return u.fromEquirectangularTexture(n,o),e.set(o,u),o.addEventListener("dispose",r),t(u.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Sv extends _v{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const u=(this.right-this.left)/this.view.fullWidth/this.zoom,f=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=u*this.view.offsetX,o=s+u*this.view.width,a-=f*this.view.offsetY,l=a-f*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ws=4,sm=[.125,.215,.35,.446,.526,.582],Ir=20,sc=new Sv,om=new je;let oc=null,ac=0,lc=0,uc=!1;const Lr=(1+Math.sqrt(5))/2,ds=1/Lr,am=[new H(-Lr,ds,0),new H(Lr,ds,0),new H(-ds,0,Lr),new H(ds,0,Lr),new H(0,Lr,-ds),new H(0,Lr,ds),new H(-1,1,-1),new H(1,1,-1),new H(-1,1,1),new H(1,1,1)];class lm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){oc=this._renderer.getRenderTarget(),ac=this._renderer.getActiveCubeFace(),lc=this._renderer.getActiveMipmapLevel(),uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=fm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=cm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(oc,ac,lc),this._renderer.xr.enabled=uc,e.scissorTest=!1,ja(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gs||e.mapping===Ws?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),oc=this._renderer.getRenderTarget(),ac=this._renderer.getActiveCubeFace(),lc=this._renderer.getActiveMipmapLevel(),uc=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ui,minFilter:ui,generateMipmaps:!1,type:ia,format:Zn,colorSpace:Zs,depthBuffer:!1},r=um(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=um(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=RE(s)),this._blurMaterial=bE(s,e,t)}return r}_compileMaterial(e){const t=new ht(this._lodPlanes[0],e);this._renderer.compile(t,sc)}_sceneToCubeUV(e,t,i,r){const a=new wn(90,1,t,i),l=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(om),f.toneMapping=dr,f.autoClear=!1;const p=new er({name:"PMREM.Background",side:xn,depthWrite:!1,depthTest:!1}),v=new ht(new rn,p);let x=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,x=!0):(p.color.copy(om),x=!0);for(let c=0;c<6;c++){const g=c%3;g===0?(a.up.set(0,l[c],0),a.lookAt(u[c],0,0)):g===1?(a.up.set(0,0,l[c]),a.lookAt(0,u[c],0)):(a.up.set(0,l[c],0),a.lookAt(0,0,u[c]));const _=this._cubeSize;ja(r,g*_,c>2?_:0,_,_),f.setRenderTarget(r),x&&f.render(v,a),f.render(e,a)}v.geometry.dispose(),v.material.dispose(),f.toneMapping=d,f.autoClear=h,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Gs||e.mapping===Ws;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=fm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=cm());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new ht(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;ja(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,sc)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=am[(r-s-1)%am.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,u=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const f=3,h=new ht(this._lodPlanes[r],u),d=u.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Ir-1),x=s/v,m=isFinite(s)?1+Math.floor(f*x):Ir;m>Ir&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Ir}`);const c=[];let g=0;for(let T=0;T<Ir;++T){const L=T/x,w=Math.exp(-L*L/2);c.push(w),T===0?g+=w:T<m&&(g+=2*w)}for(let T=0;T<c.length;T++)c[T]=c[T]/g;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=c,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:_}=this;d.dTheta.value=v,d.mipInt.value=_-i;const S=this._sizeLods[r],P=3*S*(r>_-ws?r-_+ws:0),A=4*(this._cubeSize-S);ja(t,P,A,3*S,2*S),l.setRenderTarget(t),l.render(h,sc)}}function RE(n){const e=[],t=[],i=[];let r=n;const s=n-ws+1+sm.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-ws?l=sm[o-n+ws-1]:o===0&&(l=0),i.push(l);const u=1/(a-2),f=-u,h=1+u,d=[f,f,h,f,h,h,f,f,h,h,f,h],p=6,v=6,x=3,m=2,c=1,g=new Float32Array(x*v*p),_=new Float32Array(m*v*p),S=new Float32Array(c*v*p);for(let A=0;A<p;A++){const T=A%3*2/3-1,L=A>2?0:-1,w=[T,L,0,T+2/3,L,0,T+2/3,L+1,0,T,L,0,T+2/3,L+1,0,T,L+1,0];g.set(w,x*v*A),_.set(d,m*v*A);const y=[A,A,A,A,A,A];S.set(y,c*v*A)}const P=new yr;P.setAttribute("position",new di(g,x)),P.setAttribute("uv",new di(_,m)),P.setAttribute("faceIndex",new di(S,c)),e.push(P),r>ws&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function um(n,e,t){const i=new jr(n,e,t);return i.texture.mapping=ru,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ja(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function bE(n,e,t){const i=new Float32Array(Ir),r=new H(0,1,0);return new gr({name:"SphericalGaussianBlur",defines:{n:Ir,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ih(),fragmentShader:`

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
		`,blending:fr,depthTest:!1,depthWrite:!1})}function cm(){return new gr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ih(),fragmentShader:`

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
		`,blending:fr,depthTest:!1,depthWrite:!1})}function fm(){return new gr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ih(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:fr,depthTest:!1,depthWrite:!1})}function ih(){return`

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
	`}function PE(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,u=l===yf||l===Sf,f=l===Gs||l===Ws;if(u||f){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new lm(n)),h=u?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return u&&p&&p.height>0||f&&p&&r(p)?(t===null&&(t=new lm(n)),h=u?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const u=6;for(let f=0;f<u;f++)a[f]!==void 0&&l++;return l===u}function s(a){const l=a.target;l.removeEventListener("dispose",s);const u=e.get(l);u!==void 0&&(e.delete(l),u.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function LE(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&Eo("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function DE(n,e,t,i){const r={},s=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const v in d.attributes)e.remove(d.attributes[v]);for(const v in d.morphAttributes){const x=d.morphAttributes[v];for(let m=0,c=x.length;m<c;m++)e.remove(x[m])}d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const v in d)e.update(d[v],n.ARRAY_BUFFER);const p=h.morphAttributes;for(const v in p){const x=p[v];for(let m=0,c=x.length;m<c;m++)e.update(x[m],n.ARRAY_BUFFER)}}function u(h){const d=[],p=h.index,v=h.attributes.position;let x=0;if(p!==null){const g=p.array;x=p.version;for(let _=0,S=g.length;_<S;_+=3){const P=g[_+0],A=g[_+1],T=g[_+2];d.push(P,A,A,T,T,P)}}else if(v!==void 0){const g=v.array;x=v.version;for(let _=0,S=g.length/3-1;_<S;_+=3){const P=_+0,A=_+1,T=_+2;d.push(P,A,A,T,T,P)}}else return;const m=new(cv(d)?gv:mv)(d,1);m.version=x;const c=s.get(h);c&&e.remove(c),s.set(h,m)}function f(h){const d=s.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&u(h)}else u(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:f}}function IE(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,p){n.drawElements(i,p,s,d*o),t.update(p,i,1)}function u(d,p,v){v!==0&&(n.drawElementsInstanced(i,p,s,d*o,v),t.update(p,i,v))}function f(d,p,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,d,0,v);let m=0;for(let c=0;c<v;c++)m+=p[c];t.update(m,i,1)}function h(d,p,v,x){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let c=0;c<d.length;c++)u(d[c]/o,p[c],x[c]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,d,0,x,0,v);let c=0;for(let g=0;g<v;g++)c+=p[g]*x[g];t.update(c,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=u,this.renderMultiDraw=f,this.renderMultiDrawInstances=h}function UE(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function NE(n,e,t){const i=new WeakMap,r=new at;function s(o,a,l){const u=o.morphTargetInfluences,f=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=f!==void 0?f.length:0;let d=i.get(a);if(d===void 0||d.count!==h){let y=function(){L.dispose(),i.delete(a),a.removeEventListener("dispose",y)};var p=y;d!==void 0&&d.texture.dispose();const v=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,c=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let S=0;v===!0&&(S=1),x===!0&&(S=2),m===!0&&(S=3);let P=a.attributes.position.count*S,A=1;P>e.maxTextureSize&&(A=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const T=new Float32Array(P*A*4*h),L=new dv(T,P,A,h);L.type=Ri,L.needsUpdate=!0;const w=S*4;for(let R=0;R<h;R++){const I=c[R],D=g[R],G=_[R],W=P*A*4*R;for(let B=0;B<I.count;B++){const q=B*w;v===!0&&(r.fromBufferAttribute(I,B),T[W+q+0]=r.x,T[W+q+1]=r.y,T[W+q+2]=r.z,T[W+q+3]=0),x===!0&&(r.fromBufferAttribute(D,B),T[W+q+4]=r.x,T[W+q+5]=r.y,T[W+q+6]=r.z,T[W+q+7]=0),m===!0&&(r.fromBufferAttribute(G,B),T[W+q+8]=r.x,T[W+q+9]=r.y,T[W+q+10]=r.z,T[W+q+11]=G.itemSize===4?r.w:1)}}d={count:h,texture:L,size:new tt(P,A)},i.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let v=0;for(let m=0;m<u.length;m++)v+=u[m];const x=a.morphTargetsRelative?1:1-v;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",u)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function zE(n,e,t,i){let r=new WeakMap;function s(l){const u=i.render.frame,f=l.geometry,h=e.get(l,f);if(r.get(h)!==u&&(e.update(h),r.set(h,u)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==u&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,u))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return h}function o(){r=new WeakMap}function a(l){const u=l.target;u.removeEventListener("dispose",a),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:s,dispose:o}}class Mv extends yn{constructor(e,t,i,r,s,o,a,l,u,f=Is){if(f!==Is&&f!==Ys)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&f===Is&&(i=Yr),i===void 0&&f===Ys&&(i=Xs),super(null,r,s,o,a,l,f,i,u),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:ei,this.minFilter=l!==void 0?l:ei,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Ev=new yn,dm=new Mv(1,1),Tv=new dv,wv=new S1,Av=new xv,hm=[],pm=[],mm=new Float32Array(16),gm=new Float32Array(9),vm=new Float32Array(4);function Js(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=hm[r];if(s===void 0&&(s=new Float32Array(r),hm[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Ft(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function kt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ou(n,e){let t=pm[e];t===void 0&&(t=new Int32Array(e),pm[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function FE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function kE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;n.uniform2fv(this.addr,e),kt(t,e)}}function OE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ft(t,e))return;n.uniform3fv(this.addr,e),kt(t,e)}}function BE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;n.uniform4fv(this.addr,e),kt(t,e)}}function HE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ft(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),kt(t,e)}else{if(Ft(t,i))return;vm.set(i),n.uniformMatrix2fv(this.addr,!1,vm),kt(t,i)}}function VE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ft(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),kt(t,e)}else{if(Ft(t,i))return;gm.set(i),n.uniformMatrix3fv(this.addr,!1,gm),kt(t,i)}}function GE(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ft(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),kt(t,e)}else{if(Ft(t,i))return;mm.set(i),n.uniformMatrix4fv(this.addr,!1,mm),kt(t,i)}}function WE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function XE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;n.uniform2iv(this.addr,e),kt(t,e)}}function YE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;n.uniform3iv(this.addr,e),kt(t,e)}}function jE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;n.uniform4iv(this.addr,e),kt(t,e)}}function qE(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function $E(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ft(t,e))return;n.uniform2uiv(this.addr,e),kt(t,e)}}function KE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ft(t,e))return;n.uniform3uiv(this.addr,e),kt(t,e)}}function ZE(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ft(t,e))return;n.uniform4uiv(this.addr,e),kt(t,e)}}function QE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(dm.compareFunction=uv,s=dm):s=Ev,t.setTexture2D(e||s,r)}function JE(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||wv,r)}function eT(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Av,r)}function tT(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Tv,r)}function nT(n){switch(n){case 5126:return FE;case 35664:return kE;case 35665:return OE;case 35666:return BE;case 35674:return HE;case 35675:return VE;case 35676:return GE;case 5124:case 35670:return WE;case 35667:case 35671:return XE;case 35668:case 35672:return YE;case 35669:case 35673:return jE;case 5125:return qE;case 36294:return $E;case 36295:return KE;case 36296:return ZE;case 35678:case 36198:case 36298:case 36306:case 35682:return QE;case 35679:case 36299:case 36307:return JE;case 35680:case 36300:case 36308:case 36293:return eT;case 36289:case 36303:case 36311:case 36292:return tT}}function iT(n,e){n.uniform1fv(this.addr,e)}function rT(n,e){const t=Js(e,this.size,2);n.uniform2fv(this.addr,t)}function sT(n,e){const t=Js(e,this.size,3);n.uniform3fv(this.addr,t)}function oT(n,e){const t=Js(e,this.size,4);n.uniform4fv(this.addr,t)}function aT(n,e){const t=Js(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function lT(n,e){const t=Js(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function uT(n,e){const t=Js(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function cT(n,e){n.uniform1iv(this.addr,e)}function fT(n,e){n.uniform2iv(this.addr,e)}function dT(n,e){n.uniform3iv(this.addr,e)}function hT(n,e){n.uniform4iv(this.addr,e)}function pT(n,e){n.uniform1uiv(this.addr,e)}function mT(n,e){n.uniform2uiv(this.addr,e)}function gT(n,e){n.uniform3uiv(this.addr,e)}function vT(n,e){n.uniform4uiv(this.addr,e)}function _T(n,e,t){const i=this.cache,r=e.length,s=ou(t,r);Ft(i,s)||(n.uniform1iv(this.addr,s),kt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Ev,s[o])}function xT(n,e,t){const i=this.cache,r=e.length,s=ou(t,r);Ft(i,s)||(n.uniform1iv(this.addr,s),kt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||wv,s[o])}function yT(n,e,t){const i=this.cache,r=e.length,s=ou(t,r);Ft(i,s)||(n.uniform1iv(this.addr,s),kt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||Av,s[o])}function ST(n,e,t){const i=this.cache,r=e.length,s=ou(t,r);Ft(i,s)||(n.uniform1iv(this.addr,s),kt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Tv,s[o])}function MT(n){switch(n){case 5126:return iT;case 35664:return rT;case 35665:return sT;case 35666:return oT;case 35674:return aT;case 35675:return lT;case 35676:return uT;case 5124:case 35670:return cT;case 35667:case 35671:return fT;case 35668:case 35672:return dT;case 35669:case 35673:return hT;case 5125:return pT;case 36294:return mT;case 36295:return gT;case 36296:return vT;case 35678:case 36198:case 36298:case 36306:case 35682:return _T;case 35679:case 36299:case 36307:return xT;case 35680:case 36300:case 36308:case 36293:return yT;case 36289:case 36303:case 36311:case 36292:return ST}}class ET{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=nT(t.type)}}class TT{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=MT(t.type)}}class wT{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const cc=/(\w+)(\])?(\[|\.)?/g;function _m(n,e){n.seq.push(e),n.map[e.id]=e}function AT(n,e,t){const i=n.name,r=i.length;for(cc.lastIndex=0;;){const s=cc.exec(i),o=cc.lastIndex;let a=s[1];const l=s[2]==="]",u=s[3];if(l&&(a=a|0),u===void 0||u==="["&&o+2===r){_m(t,u===void 0?new ET(a,n,e):new TT(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new wT(a),_m(t,h)),t=h}}}class pl{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);AT(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function xm(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const CT=37297;let RT=0;function bT(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const ym=new He;function PT(n){Ke._getMatrix(ym,Ke.workingColorSpace,n);const e=`mat3( ${ym.elements.map(t=>t.toFixed(4))} )`;switch(Ke.getTransfer(n)){case su:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Sm(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+bT(n.getShaderSource(e),o)}else return r}function LT(n,e){const t=PT(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function DT(n,e){let t;switch(e){case qy:t="Linear";break;case $y:t="Reinhard";break;case Ky:t="Cineon";break;case Zy:t="ACESFilmic";break;case Jy:t="AgX";break;case e1:t="Neutral";break;case Qy:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const qa=new H;function IT(){Ke.getLuminanceCoefficients(qa);const n=qa.x.toFixed(4),e=qa.y.toFixed(4),t=qa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function UT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(To).join(`
`)}function NT(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function zT(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function To(n){return n!==""}function Mm(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Em(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const FT=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zf(n){return n.replace(FT,OT)}const kT=new Map;function OT(n,e){let t=We[e];if(t===void 0){const i=kT.get(e);if(i!==void 0)t=We[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Zf(t)}const BT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tm(n){return n.replace(BT,HT)}function HT(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function wm(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function VT(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===$g?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Kg?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Ei&&(e="SHADOWMAP_TYPE_VSM"),e}function GT(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Gs:case Ws:e="ENVMAP_TYPE_CUBE";break;case ru:e="ENVMAP_TYPE_CUBE_UV";break}return e}function WT(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Ws:e="ENVMAP_MODE_REFRACTION";break}return e}function XT(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case qd:e="ENVMAP_BLENDING_MULTIPLY";break;case Yy:e="ENVMAP_BLENDING_MIX";break;case jy:e="ENVMAP_BLENDING_ADD";break}return e}function YT(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function jT(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=VT(t),u=GT(t),f=WT(t),h=XT(t),d=YT(t),p=UT(t),v=NT(s),x=r.createProgram();let m,c,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(To).join(`
`),m.length>0&&(m+=`
`),c=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(To).join(`
`),c.length>0&&(c+=`
`)):(m=[wm(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+f:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(To).join(`
`),c=[wm(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==dr?"#define TONE_MAPPING":"",t.toneMapping!==dr?We.tonemapping_pars_fragment:"",t.toneMapping!==dr?DT("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,LT("linearToOutputTexel",t.outputColorSpace),IT(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(To).join(`
`)),o=Zf(o),o=Mm(o,t),o=Em(o,t),a=Zf(a),a=Mm(a,t),a=Em(a,t),o=Tm(o),a=Tm(a),t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,c=["#define varying in",t.glslVersion===kp?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===kp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+c);const _=g+m+o,S=g+c+a,P=xm(r,r.VERTEX_SHADER,_),A=xm(r,r.FRAGMENT_SHADER,S);r.attachShader(x,P),r.attachShader(x,A),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function T(R){if(n.debug.checkShaderErrors){const I=r.getProgramInfoLog(x).trim(),D=r.getShaderInfoLog(P).trim(),G=r.getShaderInfoLog(A).trim();let W=!0,B=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(W=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,x,P,A);else{const q=Sm(r,P,"vertex"),b=Sm(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+I+`
`+q+`
`+b)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(D===""||G==="")&&(B=!1);B&&(R.diagnostics={runnable:W,programLog:I,vertexShader:{log:D,prefix:m},fragmentShader:{log:G,prefix:c}})}r.deleteShader(P),r.deleteShader(A),L=new pl(r,x),w=zT(r,x)}let L;this.getUniforms=function(){return L===void 0&&T(this),L};let w;this.getAttributes=function(){return w===void 0&&T(this),w};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(x,CT)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=RT++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=P,this.fragmentShader=A,this}let qT=0;class $T{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new KT(e),t.set(e,i)),i}}class KT{constructor(e){this.id=qT++,this.code=e,this.usedTimes=0}}function ZT(n,e,t,i,r,s,o){const a=new hv,l=new $T,u=new Set,f=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(w){return u.add(w),w===0?"uv":`uv${w}`}function m(w,y,R,I,D){const G=I.fog,W=D.geometry,B=w.isMeshStandardMaterial?I.environment:null,q=(w.isMeshStandardMaterial?t:e).get(w.envMap||B),b=q&&q.mapping===ru?q.image.height:null,k=v[w.type];w.precision!==null&&(p=r.getMaxPrecision(w.precision),p!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",p,"instead."));const V=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ee=V!==void 0?V.length:0;let re=0;W.morphAttributes.position!==void 0&&(re=1),W.morphAttributes.normal!==void 0&&(re=2),W.morphAttributes.color!==void 0&&(re=3);let Ie,$,ie,fe;if(k){const rt=oi[k];Ie=rt.vertexShader,$=rt.fragmentShader}else Ie=w.vertexShader,$=w.fragmentShader,l.update(w),ie=l.getVertexShaderID(w),fe=l.getFragmentShaderID(w);const le=n.getRenderTarget(),ce=n.state.buffers.depth.getReversed(),Pe=D.isInstancedMesh===!0,ze=D.isBatchedMesh===!0,ut=!!w.map,Ye=!!w.matcap,xt=!!q,N=!!w.aoMap,Ut=!!w.lightMap,Le=!!w.bumpMap,De=!!w.normalMap,_e=!!w.displacementMap,Ve=!!w.emissiveMap,we=!!w.metalnessMap,C=!!w.roughnessMap,M=w.anisotropy>0,O=w.clearcoat>0,J=w.dispersion>0,ne=w.iridescence>0,Q=w.sheen>0,Te=w.transmission>0,de=M&&!!w.anisotropyMap,me=O&&!!w.clearcoatMap,qe=O&&!!w.clearcoatNormalMap,oe=O&&!!w.clearcoatRoughnessMap,Me=ne&&!!w.iridescenceMap,Ne=ne&&!!w.iridescenceThicknessMap,Fe=Q&&!!w.sheenColorMap,Ee=Q&&!!w.sheenRoughnessMap,$e=!!w.specularMap,Ge=!!w.specularColorMap,ct=!!w.specularIntensityMap,U=Te&&!!w.transmissionMap,pe=Te&&!!w.thicknessMap,K=!!w.gradientMap,te=!!w.alphaMap,xe=w.alphaTest>0,ge=!!w.alphaHash,Oe=!!w.extensions;let wt=dr;w.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(wt=n.toneMapping);const Kt={shaderID:k,shaderType:w.type,shaderName:w.name,vertexShader:Ie,fragmentShader:$,defines:w.defines,customVertexShaderID:ie,customFragmentShaderID:fe,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:p,batching:ze,batchingColor:ze&&D._colorsTexture!==null,instancing:Pe,instancingColor:Pe&&D.instanceColor!==null,instancingMorph:Pe&&D.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:le===null?n.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:Zs,alphaToCoverage:!!w.alphaToCoverage,map:ut,matcap:Ye,envMap:xt,envMapMode:xt&&q.mapping,envMapCubeUVHeight:b,aoMap:N,lightMap:Ut,bumpMap:Le,normalMap:De,displacementMap:d&&_e,emissiveMap:Ve,normalMapObjectSpace:De&&w.normalMapType===r1,normalMapTangentSpace:De&&w.normalMapType===lv,metalnessMap:we,roughnessMap:C,anisotropy:M,anisotropyMap:de,clearcoat:O,clearcoatMap:me,clearcoatNormalMap:qe,clearcoatRoughnessMap:oe,dispersion:J,iridescence:ne,iridescenceMap:Me,iridescenceThicknessMap:Ne,sheen:Q,sheenColorMap:Fe,sheenRoughnessMap:Ee,specularMap:$e,specularColorMap:Ge,specularIntensityMap:ct,transmission:Te,transmissionMap:U,thicknessMap:pe,gradientMap:K,opaque:w.transparent===!1&&w.blending===Ds&&w.alphaToCoverage===!1,alphaMap:te,alphaTest:xe,alphaHash:ge,combine:w.combine,mapUv:ut&&x(w.map.channel),aoMapUv:N&&x(w.aoMap.channel),lightMapUv:Ut&&x(w.lightMap.channel),bumpMapUv:Le&&x(w.bumpMap.channel),normalMapUv:De&&x(w.normalMap.channel),displacementMapUv:_e&&x(w.displacementMap.channel),emissiveMapUv:Ve&&x(w.emissiveMap.channel),metalnessMapUv:we&&x(w.metalnessMap.channel),roughnessMapUv:C&&x(w.roughnessMap.channel),anisotropyMapUv:de&&x(w.anisotropyMap.channel),clearcoatMapUv:me&&x(w.clearcoatMap.channel),clearcoatNormalMapUv:qe&&x(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:oe&&x(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Me&&x(w.iridescenceMap.channel),iridescenceThicknessMapUv:Ne&&x(w.iridescenceThicknessMap.channel),sheenColorMapUv:Fe&&x(w.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&x(w.sheenRoughnessMap.channel),specularMapUv:$e&&x(w.specularMap.channel),specularColorMapUv:Ge&&x(w.specularColorMap.channel),specularIntensityMapUv:ct&&x(w.specularIntensityMap.channel),transmissionMapUv:U&&x(w.transmissionMap.channel),thicknessMapUv:pe&&x(w.thicknessMap.channel),alphaMapUv:te&&x(w.alphaMap.channel),vertexTangents:!!W.attributes.tangent&&(De||M),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!W.attributes.uv&&(ut||te),fog:!!G,useFog:w.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:ce,skinning:D.isSkinnedMesh===!0,morphTargets:W.morphAttributes.position!==void 0,morphNormals:W.morphAttributes.normal!==void 0,morphColors:W.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:re,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:w.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:wt,decodeVideoTexture:ut&&w.map.isVideoTexture===!0&&Ke.getTransfer(w.map.colorSpace)===ot,decodeVideoTextureEmissive:Ve&&w.emissiveMap.isVideoTexture===!0&&Ke.getTransfer(w.emissiveMap.colorSpace)===ot,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===li,flipSided:w.side===xn,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Oe&&w.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Oe&&w.extensions.multiDraw===!0||ze)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Kt.vertexUv1s=u.has(1),Kt.vertexUv2s=u.has(2),Kt.vertexUv3s=u.has(3),u.clear(),Kt}function c(w){const y=[];if(w.shaderID?y.push(w.shaderID):(y.push(w.customVertexShaderID),y.push(w.customFragmentShaderID)),w.defines!==void 0)for(const R in w.defines)y.push(R),y.push(w.defines[R]);return w.isRawShaderMaterial===!1&&(g(y,w),_(y,w),y.push(n.outputColorSpace)),y.push(w.customProgramCacheKey),y.join()}function g(w,y){w.push(y.precision),w.push(y.outputColorSpace),w.push(y.envMapMode),w.push(y.envMapCubeUVHeight),w.push(y.mapUv),w.push(y.alphaMapUv),w.push(y.lightMapUv),w.push(y.aoMapUv),w.push(y.bumpMapUv),w.push(y.normalMapUv),w.push(y.displacementMapUv),w.push(y.emissiveMapUv),w.push(y.metalnessMapUv),w.push(y.roughnessMapUv),w.push(y.anisotropyMapUv),w.push(y.clearcoatMapUv),w.push(y.clearcoatNormalMapUv),w.push(y.clearcoatRoughnessMapUv),w.push(y.iridescenceMapUv),w.push(y.iridescenceThicknessMapUv),w.push(y.sheenColorMapUv),w.push(y.sheenRoughnessMapUv),w.push(y.specularMapUv),w.push(y.specularColorMapUv),w.push(y.specularIntensityMapUv),w.push(y.transmissionMapUv),w.push(y.thicknessMapUv),w.push(y.combine),w.push(y.fogExp2),w.push(y.sizeAttenuation),w.push(y.morphTargetsCount),w.push(y.morphAttributeCount),w.push(y.numDirLights),w.push(y.numPointLights),w.push(y.numSpotLights),w.push(y.numSpotLightMaps),w.push(y.numHemiLights),w.push(y.numRectAreaLights),w.push(y.numDirLightShadows),w.push(y.numPointLightShadows),w.push(y.numSpotLightShadows),w.push(y.numSpotLightShadowsWithMaps),w.push(y.numLightProbes),w.push(y.shadowMapType),w.push(y.toneMapping),w.push(y.numClippingPlanes),w.push(y.numClipIntersection),w.push(y.depthPacking)}function _(w,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),w.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reverseDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),w.push(a.mask)}function S(w){const y=v[w.type];let R;if(y){const I=oi[y];R=U1.clone(I.uniforms)}else R=w.uniforms;return R}function P(w,y){let R;for(let I=0,D=f.length;I<D;I++){const G=f[I];if(G.cacheKey===y){R=G,++R.usedTimes;break}}return R===void 0&&(R=new jT(n,y,w,s),f.push(R)),R}function A(w){if(--w.usedTimes===0){const y=f.indexOf(w);f[y]=f[f.length-1],f.pop(),w.destroy()}}function T(w){l.remove(w)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:c,getUniforms:S,acquireProgram:P,releaseProgram:A,releaseShaderCache:T,programs:f,dispose:L}}function QT(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function JT(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Am(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Cm(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,d,p,v,x,m){let c=n[e];return c===void 0?(c={id:h.id,object:h,geometry:d,material:p,groupOrder:v,renderOrder:h.renderOrder,z:x,group:m},n[e]=c):(c.id=h.id,c.object=h,c.geometry=d,c.material=p,c.groupOrder=v,c.renderOrder=h.renderOrder,c.z=x,c.group=m),e++,c}function a(h,d,p,v,x,m){const c=o(h,d,p,v,x,m);p.transmission>0?i.push(c):p.transparent===!0?r.push(c):t.push(c)}function l(h,d,p,v,x,m){const c=o(h,d,p,v,x,m);p.transmission>0?i.unshift(c):p.transparent===!0?r.unshift(c):t.unshift(c)}function u(h,d){t.length>1&&t.sort(h||JT),i.length>1&&i.sort(d||Am),r.length>1&&r.sort(d||Am)}function f(){for(let h=e,d=n.length;h<d;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:f,sort:u}}function e2(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new Cm,n.set(i,[o])):r>=s.length?(o=new Cm,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function t2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new H,color:new je};break;case"SpotLight":t={position:new H,direction:new H,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new H,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new H,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new H,halfWidth:new H,halfHeight:new H};break}return n[e.id]=t,t}}}function n2(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new tt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let i2=0;function r2(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function s2(n){const e=new t2,t=n2(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new H);const r=new H,s=new Et,o=new Et;function a(u){let f=0,h=0,d=0;for(let w=0;w<9;w++)i.probe[w].set(0,0,0);let p=0,v=0,x=0,m=0,c=0,g=0,_=0,S=0,P=0,A=0,T=0;u.sort(r2);for(let w=0,y=u.length;w<y;w++){const R=u[w],I=R.color,D=R.intensity,G=R.distance,W=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)f+=I.r*D,h+=I.g*D,d+=I.b*D;else if(R.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(R.sh.coefficients[B],D);T++}else if(R.isDirectionalLight){const B=e.get(R);if(B.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const q=R.shadow,b=t.get(R);b.shadowIntensity=q.intensity,b.shadowBias=q.bias,b.shadowNormalBias=q.normalBias,b.shadowRadius=q.radius,b.shadowMapSize=q.mapSize,i.directionalShadow[p]=b,i.directionalShadowMap[p]=W,i.directionalShadowMatrix[p]=R.shadow.matrix,g++}i.directional[p]=B,p++}else if(R.isSpotLight){const B=e.get(R);B.position.setFromMatrixPosition(R.matrixWorld),B.color.copy(I).multiplyScalar(D),B.distance=G,B.coneCos=Math.cos(R.angle),B.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),B.decay=R.decay,i.spot[x]=B;const q=R.shadow;if(R.map&&(i.spotLightMap[P]=R.map,P++,q.updateMatrices(R),R.castShadow&&A++),i.spotLightMatrix[x]=q.matrix,R.castShadow){const b=t.get(R);b.shadowIntensity=q.intensity,b.shadowBias=q.bias,b.shadowNormalBias=q.normalBias,b.shadowRadius=q.radius,b.shadowMapSize=q.mapSize,i.spotShadow[x]=b,i.spotShadowMap[x]=W,S++}x++}else if(R.isRectAreaLight){const B=e.get(R);B.color.copy(I).multiplyScalar(D),B.halfWidth.set(R.width*.5,0,0),B.halfHeight.set(0,R.height*.5,0),i.rectArea[m]=B,m++}else if(R.isPointLight){const B=e.get(R);if(B.color.copy(R.color).multiplyScalar(R.intensity),B.distance=R.distance,B.decay=R.decay,R.castShadow){const q=R.shadow,b=t.get(R);b.shadowIntensity=q.intensity,b.shadowBias=q.bias,b.shadowNormalBias=q.normalBias,b.shadowRadius=q.radius,b.shadowMapSize=q.mapSize,b.shadowCameraNear=q.camera.near,b.shadowCameraFar=q.camera.far,i.pointShadow[v]=b,i.pointShadowMap[v]=W,i.pointShadowMatrix[v]=R.shadow.matrix,_++}i.point[v]=B,v++}else if(R.isHemisphereLight){const B=e.get(R);B.skyColor.copy(R.color).multiplyScalar(D),B.groundColor.copy(R.groundColor).multiplyScalar(D),i.hemi[c]=B,c++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=f,i.ambient[1]=h,i.ambient[2]=d;const L=i.hash;(L.directionalLength!==p||L.pointLength!==v||L.spotLength!==x||L.rectAreaLength!==m||L.hemiLength!==c||L.numDirectionalShadows!==g||L.numPointShadows!==_||L.numSpotShadows!==S||L.numSpotMaps!==P||L.numLightProbes!==T)&&(i.directional.length=p,i.spot.length=x,i.rectArea.length=m,i.point.length=v,i.hemi.length=c,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=S+P-A,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=T,L.directionalLength=p,L.pointLength=v,L.spotLength=x,L.rectAreaLength=m,L.hemiLength=c,L.numDirectionalShadows=g,L.numPointShadows=_,L.numSpotShadows=S,L.numSpotMaps=P,L.numLightProbes=T,i.version=i2++)}function l(u,f){let h=0,d=0,p=0,v=0,x=0;const m=f.matrixWorldInverse;for(let c=0,g=u.length;c<g;c++){const _=u[c];if(_.isDirectionalLight){const S=i.directional[h];S.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),h++}else if(_.isSpotLight){const S=i.spot[p];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),p++}else if(_.isRectAreaLight){const S=i.rectArea[v];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),o.identity(),s.copy(_.matrixWorld),s.premultiply(m),o.extractRotation(s),S.halfWidth.set(_.width*.5,0,0),S.halfHeight.set(0,_.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),v++}else if(_.isPointLight){const S=i.point[d];S.position.setFromMatrixPosition(_.matrixWorld),S.position.applyMatrix4(m),d++}else if(_.isHemisphereLight){const S=i.hemi[x];S.direction.setFromMatrixPosition(_.matrixWorld),S.direction.transformDirection(m),x++}}}return{setup:a,setupView:l,state:i}}function Rm(n){const e=new s2(n),t=[],i=[];function r(f){u.camera=f,t.length=0,i.length=0}function s(f){t.push(f)}function o(f){i.push(f)}function a(){e.setup(t)}function l(f){e.setupView(t,f)}const u={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:u,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function o2(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Rm(n),e.set(r,[a])):s>=o.length?(a=new Rm(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}class a2 extends aa{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=n1,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class l2 extends aa{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const u2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,c2=`uniform sampler2D shadow_pass;
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
}`;function f2(n,e,t){let i=new nh;const r=new tt,s=new tt,o=new at,a=new a2({depthPacking:i1}),l=new l2,u={},f=t.maxTextureSize,h={[mr]:xn,[xn]:mr,[li]:li},d=new gr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new tt},radius:{value:4}},vertexShader:u2,fragmentShader:c2}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const v=new yr;v.setAttribute("position",new di(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ht(v,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=$g;let c=this.type;this.render=function(A,T,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const w=n.getRenderTarget(),y=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),I=n.state;I.setBlending(fr),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const D=c!==Ei&&this.type===Ei,G=c===Ei&&this.type!==Ei;for(let W=0,B=A.length;W<B;W++){const q=A[W],b=q.shadow;if(b===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(b.autoUpdate===!1&&b.needsUpdate===!1)continue;r.copy(b.mapSize);const k=b.getFrameExtents();if(r.multiply(k),s.copy(b.mapSize),(r.x>f||r.y>f)&&(r.x>f&&(s.x=Math.floor(f/k.x),r.x=s.x*k.x,b.mapSize.x=s.x),r.y>f&&(s.y=Math.floor(f/k.y),r.y=s.y*k.y,b.mapSize.y=s.y)),b.map===null||D===!0||G===!0){const ee=this.type!==Ei?{minFilter:ei,magFilter:ei}:{};b.map!==null&&b.map.dispose(),b.map=new jr(r.x,r.y,ee),b.map.texture.name=q.name+".shadowMap",b.camera.updateProjectionMatrix()}n.setRenderTarget(b.map),n.clear();const V=b.getViewportCount();for(let ee=0;ee<V;ee++){const re=b.getViewport(ee);o.set(s.x*re.x,s.y*re.y,s.x*re.z,s.y*re.w),I.viewport(o),b.updateMatrices(q,ee),i=b.getFrustum(),S(T,L,b.camera,q,this.type)}b.isPointLightShadow!==!0&&this.type===Ei&&g(b,L),b.needsUpdate=!1}c=this.type,m.needsUpdate=!1,n.setRenderTarget(w,y,R)};function g(A,T){const L=e.update(x);d.defines.VSM_SAMPLES!==A.blurSamples&&(d.defines.VSM_SAMPLES=A.blurSamples,p.defines.VSM_SAMPLES=A.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new jr(r.x,r.y)),d.uniforms.shadow_pass.value=A.map.texture,d.uniforms.resolution.value=A.mapSize,d.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(T,null,L,d,x,null),p.uniforms.shadow_pass.value=A.mapPass.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(T,null,L,p,x,null)}function _(A,T,L,w){let y=null;const R=L.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(R!==void 0)y=R;else if(y=L.isPointLight===!0?l:a,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const I=y.uuid,D=T.uuid;let G=u[I];G===void 0&&(G={},u[I]=G);let W=G[D];W===void 0&&(W=y.clone(),G[D]=W,T.addEventListener("dispose",P)),y=W}if(y.visible=T.visible,y.wireframe=T.wireframe,w===Ei?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:h[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const I=n.properties.get(y);I.light=L}return y}function S(A,T,L,w,y){if(A.visible===!1)return;if(A.layers.test(T.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===Ei)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,A.matrixWorld);const D=e.update(A),G=A.material;if(Array.isArray(G)){const W=D.groups;for(let B=0,q=W.length;B<q;B++){const b=W[B],k=G[b.materialIndex];if(k&&k.visible){const V=_(A,k,w,y);A.onBeforeShadow(n,A,T,L,D,V,b),n.renderBufferDirect(L,null,D,V,A,b),A.onAfterShadow(n,A,T,L,D,V,b)}}}else if(G.visible){const W=_(A,G,w,y);A.onBeforeShadow(n,A,T,L,D,W,null),n.renderBufferDirect(L,null,D,W,A,null),A.onAfterShadow(n,A,T,L,D,W,null)}}const I=A.children;for(let D=0,G=I.length;D<G;D++)S(I[D],T,L,w,y)}function P(A){A.target.removeEventListener("dispose",P);for(const L in u){const w=u[L],y=A.target.uuid;y in w&&(w[y].dispose(),delete w[y])}}}const d2={[hf]:pf,[mf]:_f,[gf]:xf,[Vs]:vf,[pf]:hf,[_f]:mf,[xf]:gf,[vf]:Vs};function h2(n,e){function t(){let U=!1;const pe=new at;let K=null;const te=new at(0,0,0,0);return{setMask:function(xe){K!==xe&&!U&&(n.colorMask(xe,xe,xe,xe),K=xe)},setLocked:function(xe){U=xe},setClear:function(xe,ge,Oe,wt,Kt){Kt===!0&&(xe*=wt,ge*=wt,Oe*=wt),pe.set(xe,ge,Oe,wt),te.equals(pe)===!1&&(n.clearColor(xe,ge,Oe,wt),te.copy(pe))},reset:function(){U=!1,K=null,te.set(-1,0,0,0)}}}function i(){let U=!1,pe=!1,K=null,te=null,xe=null;return{setReversed:function(ge){if(pe!==ge){const Oe=e.get("EXT_clip_control");pe?Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.ZERO_TO_ONE_EXT):Oe.clipControlEXT(Oe.LOWER_LEFT_EXT,Oe.NEGATIVE_ONE_TO_ONE_EXT);const wt=xe;xe=null,this.setClear(wt)}pe=ge},getReversed:function(){return pe},setTest:function(ge){ge?le(n.DEPTH_TEST):ce(n.DEPTH_TEST)},setMask:function(ge){K!==ge&&!U&&(n.depthMask(ge),K=ge)},setFunc:function(ge){if(pe&&(ge=d2[ge]),te!==ge){switch(ge){case hf:n.depthFunc(n.NEVER);break;case pf:n.depthFunc(n.ALWAYS);break;case mf:n.depthFunc(n.LESS);break;case Vs:n.depthFunc(n.LEQUAL);break;case gf:n.depthFunc(n.EQUAL);break;case vf:n.depthFunc(n.GEQUAL);break;case _f:n.depthFunc(n.GREATER);break;case xf:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}te=ge}},setLocked:function(ge){U=ge},setClear:function(ge){xe!==ge&&(pe&&(ge=1-ge),n.clearDepth(ge),xe=ge)},reset:function(){U=!1,K=null,te=null,xe=null,pe=!1}}}function r(){let U=!1,pe=null,K=null,te=null,xe=null,ge=null,Oe=null,wt=null,Kt=null;return{setTest:function(rt){U||(rt?le(n.STENCIL_TEST):ce(n.STENCIL_TEST))},setMask:function(rt){pe!==rt&&!U&&(n.stencilMask(rt),pe=rt)},setFunc:function(rt,Hn,mi){(K!==rt||te!==Hn||xe!==mi)&&(n.stencilFunc(rt,Hn,mi),K=rt,te=Hn,xe=mi)},setOp:function(rt,Hn,mi){(ge!==rt||Oe!==Hn||wt!==mi)&&(n.stencilOp(rt,Hn,mi),ge=rt,Oe=Hn,wt=mi)},setLocked:function(rt){U=rt},setClear:function(rt){Kt!==rt&&(n.clearStencil(rt),Kt=rt)},reset:function(){U=!1,pe=null,K=null,te=null,xe=null,ge=null,Oe=null,wt=null,Kt=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,u=new WeakMap;let f={},h={},d=new WeakMap,p=[],v=null,x=!1,m=null,c=null,g=null,_=null,S=null,P=null,A=null,T=new je(0,0,0),L=0,w=!1,y=null,R=null,I=null,D=null,G=null;const W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,q=0;const b=n.getParameter(n.VERSION);b.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(b)[1]),B=q>=1):b.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(b)[1]),B=q>=2);let k=null,V={};const ee=n.getParameter(n.SCISSOR_BOX),re=n.getParameter(n.VIEWPORT),Ie=new at().fromArray(ee),$=new at().fromArray(re);function ie(U,pe,K,te){const xe=new Uint8Array(4),ge=n.createTexture();n.bindTexture(U,ge),n.texParameteri(U,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(U,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Oe=0;Oe<K;Oe++)U===n.TEXTURE_3D||U===n.TEXTURE_2D_ARRAY?n.texImage3D(pe,0,n.RGBA,1,1,te,0,n.RGBA,n.UNSIGNED_BYTE,xe):n.texImage2D(pe+Oe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xe);return ge}const fe={};fe[n.TEXTURE_2D]=ie(n.TEXTURE_2D,n.TEXTURE_2D,1),fe[n.TEXTURE_CUBE_MAP]=ie(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),fe[n.TEXTURE_2D_ARRAY]=ie(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),fe[n.TEXTURE_3D]=ie(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),le(n.DEPTH_TEST),o.setFunc(Vs),Le(!1),De(Dp),le(n.CULL_FACE),N(fr);function le(U){f[U]!==!0&&(n.enable(U),f[U]=!0)}function ce(U){f[U]!==!1&&(n.disable(U),f[U]=!1)}function Pe(U,pe){return h[U]!==pe?(n.bindFramebuffer(U,pe),h[U]=pe,U===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=pe),U===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=pe),!0):!1}function ze(U,pe){let K=p,te=!1;if(U){K=d.get(pe),K===void 0&&(K=[],d.set(pe,K));const xe=U.textures;if(K.length!==xe.length||K[0]!==n.COLOR_ATTACHMENT0){for(let ge=0,Oe=xe.length;ge<Oe;ge++)K[ge]=n.COLOR_ATTACHMENT0+ge;K.length=xe.length,te=!0}}else K[0]!==n.BACK&&(K[0]=n.BACK,te=!0);te&&n.drawBuffers(K)}function ut(U){return v!==U?(n.useProgram(U),v=U,!0):!1}const Ye={[Dr]:n.FUNC_ADD,[by]:n.FUNC_SUBTRACT,[Py]:n.FUNC_REVERSE_SUBTRACT};Ye[Ly]=n.MIN,Ye[Dy]=n.MAX;const xt={[Iy]:n.ZERO,[Uy]:n.ONE,[Ny]:n.SRC_COLOR,[ff]:n.SRC_ALPHA,[Hy]:n.SRC_ALPHA_SATURATE,[Oy]:n.DST_COLOR,[Fy]:n.DST_ALPHA,[zy]:n.ONE_MINUS_SRC_COLOR,[df]:n.ONE_MINUS_SRC_ALPHA,[By]:n.ONE_MINUS_DST_COLOR,[ky]:n.ONE_MINUS_DST_ALPHA,[Vy]:n.CONSTANT_COLOR,[Gy]:n.ONE_MINUS_CONSTANT_COLOR,[Wy]:n.CONSTANT_ALPHA,[Xy]:n.ONE_MINUS_CONSTANT_ALPHA};function N(U,pe,K,te,xe,ge,Oe,wt,Kt,rt){if(U===fr){x===!0&&(ce(n.BLEND),x=!1);return}if(x===!1&&(le(n.BLEND),x=!0),U!==Ry){if(U!==m||rt!==w){if((c!==Dr||S!==Dr)&&(n.blendEquation(n.FUNC_ADD),c=Dr,S=Dr),rt)switch(U){case Ds:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ip:n.blendFunc(n.ONE,n.ONE);break;case Up:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Np:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Ds:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Ip:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Up:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Np:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}g=null,_=null,P=null,A=null,T.set(0,0,0),L=0,m=U,w=rt}return}xe=xe||pe,ge=ge||K,Oe=Oe||te,(pe!==c||xe!==S)&&(n.blendEquationSeparate(Ye[pe],Ye[xe]),c=pe,S=xe),(K!==g||te!==_||ge!==P||Oe!==A)&&(n.blendFuncSeparate(xt[K],xt[te],xt[ge],xt[Oe]),g=K,_=te,P=ge,A=Oe),(wt.equals(T)===!1||Kt!==L)&&(n.blendColor(wt.r,wt.g,wt.b,Kt),T.copy(wt),L=Kt),m=U,w=!1}function Ut(U,pe){U.side===li?ce(n.CULL_FACE):le(n.CULL_FACE);let K=U.side===xn;pe&&(K=!K),Le(K),U.blending===Ds&&U.transparent===!1?N(fr):N(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const te=U.stencilWrite;a.setTest(te),te&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),Ve(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?le(n.SAMPLE_ALPHA_TO_COVERAGE):ce(n.SAMPLE_ALPHA_TO_COVERAGE)}function Le(U){y!==U&&(U?n.frontFace(n.CW):n.frontFace(n.CCW),y=U)}function De(U){U!==Ay?(le(n.CULL_FACE),U!==R&&(U===Dp?n.cullFace(n.BACK):U===Cy?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ce(n.CULL_FACE),R=U}function _e(U){U!==I&&(B&&n.lineWidth(U),I=U)}function Ve(U,pe,K){U?(le(n.POLYGON_OFFSET_FILL),(D!==pe||G!==K)&&(n.polygonOffset(pe,K),D=pe,G=K)):ce(n.POLYGON_OFFSET_FILL)}function we(U){U?le(n.SCISSOR_TEST):ce(n.SCISSOR_TEST)}function C(U){U===void 0&&(U=n.TEXTURE0+W-1),k!==U&&(n.activeTexture(U),k=U)}function M(U,pe,K){K===void 0&&(k===null?K=n.TEXTURE0+W-1:K=k);let te=V[K];te===void 0&&(te={type:void 0,texture:void 0},V[K]=te),(te.type!==U||te.texture!==pe)&&(k!==K&&(n.activeTexture(K),k=K),n.bindTexture(U,pe||fe[U]),te.type=U,te.texture=pe)}function O(){const U=V[k];U!==void 0&&U.type!==void 0&&(n.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function J(){try{n.compressedTexImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ne(){try{n.compressedTexImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Q(){try{n.texSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Te(){try{n.texSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function de(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function qe(){try{n.texStorage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function oe(){try{n.texStorage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Me(){try{n.texImage2D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ne(){try{n.texImage3D.apply(n,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Fe(U){Ie.equals(U)===!1&&(n.scissor(U.x,U.y,U.z,U.w),Ie.copy(U))}function Ee(U){$.equals(U)===!1&&(n.viewport(U.x,U.y,U.z,U.w),$.copy(U))}function $e(U,pe){let K=u.get(pe);K===void 0&&(K=new WeakMap,u.set(pe,K));let te=K.get(U);te===void 0&&(te=n.getUniformBlockIndex(pe,U.name),K.set(U,te))}function Ge(U,pe){const te=u.get(pe).get(U);l.get(pe)!==te&&(n.uniformBlockBinding(pe,te,U.__bindingPointIndex),l.set(pe,te))}function ct(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),f={},k=null,V={},h={},d=new WeakMap,p=[],v=null,x=!1,m=null,c=null,g=null,_=null,S=null,P=null,A=null,T=new je(0,0,0),L=0,w=!1,y=null,R=null,I=null,D=null,G=null,Ie.set(0,0,n.canvas.width,n.canvas.height),$.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:le,disable:ce,bindFramebuffer:Pe,drawBuffers:ze,useProgram:ut,setBlending:N,setMaterial:Ut,setFlipSided:Le,setCullFace:De,setLineWidth:_e,setPolygonOffset:Ve,setScissorTest:we,activeTexture:C,bindTexture:M,unbindTexture:O,compressedTexImage2D:J,compressedTexImage3D:ne,texImage2D:Me,texImage3D:Ne,updateUBOMapping:$e,uniformBlockBinding:Ge,texStorage2D:qe,texStorage3D:oe,texSubImage2D:Q,texSubImage3D:Te,compressedTexSubImage2D:de,compressedTexSubImage3D:me,scissor:Fe,viewport:Ee,reset:ct}}function bm(n,e,t,i){const r=p2(i);switch(t){case tv:return n*e;case iv:return n*e;case rv:return n*e*2;case sv:return n*e/r.components*r.byteLength;case Qd:return n*e/r.components*r.byteLength;case ov:return n*e*2/r.components*r.byteLength;case Jd:return n*e*2/r.components*r.byteLength;case nv:return n*e*3/r.components*r.byteLength;case Zn:return n*e*4/r.components*r.byteLength;case eh:return n*e*4/r.components*r.byteLength;case ul:case cl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case fl:case dl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case wf:case Cf:return Math.max(n,16)*Math.max(e,8)/4;case Tf:case Af:return Math.max(n,8)*Math.max(e,8)/2;case Rf:case bf:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Pf:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Lf:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Df:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case If:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Uf:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Nf:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case zf:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ff:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case kf:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Of:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Bf:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Hf:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Vf:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case Gf:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Wf:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case hl:case Xf:case Yf:return Math.ceil(n/4)*Math.ceil(e/4)*16;case av:case jf:return Math.ceil(n/4)*Math.ceil(e/4)*8;case qf:case $f:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function p2(n){switch(n){case Fi:case Qg:return{byteLength:1,components:1};case Zo:case Jg:case ia:return{byteLength:2,components:1};case Kd:case Zd:return{byteLength:2,components:4};case Yr:case $d:case Ri:return{byteLength:4,components:1};case ev:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function m2(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new tt,f=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(C,M){return p?new OffscreenCanvas(C,M):Bl("canvas")}function x(C,M,O){let J=1;const ne=we(C);if((ne.width>O||ne.height>O)&&(J=O/Math.max(ne.width,ne.height)),J<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const Q=Math.floor(J*ne.width),Te=Math.floor(J*ne.height);h===void 0&&(h=v(Q,Te));const de=M?v(Q,Te):h;return de.width=Q,de.height=Te,de.getContext("2d").drawImage(C,0,0,Q,Te),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+Q+"x"+Te+")."),de}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),C;return C}function m(C){return C.generateMipmaps}function c(C){n.generateMipmap(C)}function g(C){return C.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?n.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(C,M,O,J,ne=!1){if(C!==null){if(n[C]!==void 0)return n[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let Q=M;if(M===n.RED&&(O===n.FLOAT&&(Q=n.R32F),O===n.HALF_FLOAT&&(Q=n.R16F),O===n.UNSIGNED_BYTE&&(Q=n.R8)),M===n.RED_INTEGER&&(O===n.UNSIGNED_BYTE&&(Q=n.R8UI),O===n.UNSIGNED_SHORT&&(Q=n.R16UI),O===n.UNSIGNED_INT&&(Q=n.R32UI),O===n.BYTE&&(Q=n.R8I),O===n.SHORT&&(Q=n.R16I),O===n.INT&&(Q=n.R32I)),M===n.RG&&(O===n.FLOAT&&(Q=n.RG32F),O===n.HALF_FLOAT&&(Q=n.RG16F),O===n.UNSIGNED_BYTE&&(Q=n.RG8)),M===n.RG_INTEGER&&(O===n.UNSIGNED_BYTE&&(Q=n.RG8UI),O===n.UNSIGNED_SHORT&&(Q=n.RG16UI),O===n.UNSIGNED_INT&&(Q=n.RG32UI),O===n.BYTE&&(Q=n.RG8I),O===n.SHORT&&(Q=n.RG16I),O===n.INT&&(Q=n.RG32I)),M===n.RGB_INTEGER&&(O===n.UNSIGNED_BYTE&&(Q=n.RGB8UI),O===n.UNSIGNED_SHORT&&(Q=n.RGB16UI),O===n.UNSIGNED_INT&&(Q=n.RGB32UI),O===n.BYTE&&(Q=n.RGB8I),O===n.SHORT&&(Q=n.RGB16I),O===n.INT&&(Q=n.RGB32I)),M===n.RGBA_INTEGER&&(O===n.UNSIGNED_BYTE&&(Q=n.RGBA8UI),O===n.UNSIGNED_SHORT&&(Q=n.RGBA16UI),O===n.UNSIGNED_INT&&(Q=n.RGBA32UI),O===n.BYTE&&(Q=n.RGBA8I),O===n.SHORT&&(Q=n.RGBA16I),O===n.INT&&(Q=n.RGBA32I)),M===n.RGB&&O===n.UNSIGNED_INT_5_9_9_9_REV&&(Q=n.RGB9_E5),M===n.RGBA){const Te=ne?su:Ke.getTransfer(J);O===n.FLOAT&&(Q=n.RGBA32F),O===n.HALF_FLOAT&&(Q=n.RGBA16F),O===n.UNSIGNED_BYTE&&(Q=Te===ot?n.SRGB8_ALPHA8:n.RGBA8),O===n.UNSIGNED_SHORT_4_4_4_4&&(Q=n.RGBA4),O===n.UNSIGNED_SHORT_5_5_5_1&&(Q=n.RGB5_A1)}return(Q===n.R16F||Q===n.R32F||Q===n.RG16F||Q===n.RG32F||Q===n.RGBA16F||Q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Q}function S(C,M){let O;return C?M===null||M===Yr||M===Xs?O=n.DEPTH24_STENCIL8:M===Ri?O=n.DEPTH32F_STENCIL8:M===Zo&&(O=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Yr||M===Xs?O=n.DEPTH_COMPONENT24:M===Ri?O=n.DEPTH_COMPONENT32F:M===Zo&&(O=n.DEPTH_COMPONENT16),O}function P(C,M){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==ei&&C.minFilter!==ui?Math.log2(Math.max(M.width,M.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?M.mipmaps.length:1}function A(C){const M=C.target;M.removeEventListener("dispose",A),L(M),M.isVideoTexture&&f.delete(M)}function T(C){const M=C.target;M.removeEventListener("dispose",T),y(M)}function L(C){const M=i.get(C);if(M.__webglInit===void 0)return;const O=C.source,J=d.get(O);if(J){const ne=J[M.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&w(C),Object.keys(J).length===0&&d.delete(O)}i.remove(C)}function w(C){const M=i.get(C);n.deleteTexture(M.__webglTexture);const O=C.source,J=d.get(O);delete J[M.__cacheKey],o.memory.textures--}function y(C){const M=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(M.__webglFramebuffer[J]))for(let ne=0;ne<M.__webglFramebuffer[J].length;ne++)n.deleteFramebuffer(M.__webglFramebuffer[J][ne]);else n.deleteFramebuffer(M.__webglFramebuffer[J]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[J])}else{if(Array.isArray(M.__webglFramebuffer))for(let J=0;J<M.__webglFramebuffer.length;J++)n.deleteFramebuffer(M.__webglFramebuffer[J]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let J=0;J<M.__webglColorRenderbuffer.length;J++)M.__webglColorRenderbuffer[J]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[J]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const O=C.textures;for(let J=0,ne=O.length;J<ne;J++){const Q=i.get(O[J]);Q.__webglTexture&&(n.deleteTexture(Q.__webglTexture),o.memory.textures--),i.remove(O[J])}i.remove(C)}let R=0;function I(){R=0}function D(){const C=R;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),R+=1,C}function G(C){const M=[];return M.push(C.wrapS),M.push(C.wrapT),M.push(C.wrapR||0),M.push(C.magFilter),M.push(C.minFilter),M.push(C.anisotropy),M.push(C.internalFormat),M.push(C.format),M.push(C.type),M.push(C.generateMipmaps),M.push(C.premultiplyAlpha),M.push(C.flipY),M.push(C.unpackAlignment),M.push(C.colorSpace),M.join()}function W(C,M){const O=i.get(C);if(C.isVideoTexture&&_e(C),C.isRenderTargetTexture===!1&&C.version>0&&O.__version!==C.version){const J=C.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{$(O,C,M);return}}t.bindTexture(n.TEXTURE_2D,O.__webglTexture,n.TEXTURE0+M)}function B(C,M){const O=i.get(C);if(C.version>0&&O.__version!==C.version){$(O,C,M);return}t.bindTexture(n.TEXTURE_2D_ARRAY,O.__webglTexture,n.TEXTURE0+M)}function q(C,M){const O=i.get(C);if(C.version>0&&O.__version!==C.version){$(O,C,M);return}t.bindTexture(n.TEXTURE_3D,O.__webglTexture,n.TEXTURE0+M)}function b(C,M){const O=i.get(C);if(C.version>0&&O.__version!==C.version){ie(O,C,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,O.__webglTexture,n.TEXTURE0+M)}const k={[Mf]:n.REPEAT,[Fr]:n.CLAMP_TO_EDGE,[Ef]:n.MIRRORED_REPEAT},V={[ei]:n.NEAREST,[t1]:n.NEAREST_MIPMAP_NEAREST,[Ra]:n.NEAREST_MIPMAP_LINEAR,[ui]:n.LINEAR,[zu]:n.LINEAR_MIPMAP_NEAREST,[kr]:n.LINEAR_MIPMAP_LINEAR},ee={[s1]:n.NEVER,[f1]:n.ALWAYS,[o1]:n.LESS,[uv]:n.LEQUAL,[a1]:n.EQUAL,[c1]:n.GEQUAL,[l1]:n.GREATER,[u1]:n.NOTEQUAL};function re(C,M){if(M.type===Ri&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===ui||M.magFilter===zu||M.magFilter===Ra||M.magFilter===kr||M.minFilter===ui||M.minFilter===zu||M.minFilter===Ra||M.minFilter===kr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(C,n.TEXTURE_WRAP_S,k[M.wrapS]),n.texParameteri(C,n.TEXTURE_WRAP_T,k[M.wrapT]),(C===n.TEXTURE_3D||C===n.TEXTURE_2D_ARRAY)&&n.texParameteri(C,n.TEXTURE_WRAP_R,k[M.wrapR]),n.texParameteri(C,n.TEXTURE_MAG_FILTER,V[M.magFilter]),n.texParameteri(C,n.TEXTURE_MIN_FILTER,V[M.minFilter]),M.compareFunction&&(n.texParameteri(C,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(C,n.TEXTURE_COMPARE_FUNC,ee[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===ei||M.minFilter!==Ra&&M.minFilter!==kr||M.type===Ri&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const O=e.get("EXT_texture_filter_anisotropic");n.texParameterf(C,O.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function Ie(C,M){let O=!1;C.__webglInit===void 0&&(C.__webglInit=!0,M.addEventListener("dispose",A));const J=M.source;let ne=d.get(J);ne===void 0&&(ne={},d.set(J,ne));const Q=G(M);if(Q!==C.__cacheKey){ne[Q]===void 0&&(ne[Q]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,O=!0),ne[Q].usedTimes++;const Te=ne[C.__cacheKey];Te!==void 0&&(ne[C.__cacheKey].usedTimes--,Te.usedTimes===0&&w(M)),C.__cacheKey=Q,C.__webglTexture=ne[Q].texture}return O}function $(C,M,O){let J=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(J=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(J=n.TEXTURE_3D);const ne=Ie(C,M),Q=M.source;t.bindTexture(J,C.__webglTexture,n.TEXTURE0+O);const Te=i.get(Q);if(Q.version!==Te.__version||ne===!0){t.activeTexture(n.TEXTURE0+O);const de=Ke.getPrimaries(Ke.workingColorSpace),me=M.colorSpace===Ji?null:Ke.getPrimaries(M.colorSpace),qe=M.colorSpace===Ji||de===me?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let oe=x(M.image,!1,r.maxTextureSize);oe=Ve(M,oe);const Me=s.convert(M.format,M.colorSpace),Ne=s.convert(M.type);let Fe=_(M.internalFormat,Me,Ne,M.colorSpace,M.isVideoTexture);re(J,M);let Ee;const $e=M.mipmaps,Ge=M.isVideoTexture!==!0,ct=Te.__version===void 0||ne===!0,U=Q.dataReady,pe=P(M,oe);if(M.isDepthTexture)Fe=S(M.format===Ys,M.type),ct&&(Ge?t.texStorage2D(n.TEXTURE_2D,1,Fe,oe.width,oe.height):t.texImage2D(n.TEXTURE_2D,0,Fe,oe.width,oe.height,0,Me,Ne,null));else if(M.isDataTexture)if($e.length>0){Ge&&ct&&t.texStorage2D(n.TEXTURE_2D,pe,Fe,$e[0].width,$e[0].height);for(let K=0,te=$e.length;K<te;K++)Ee=$e[K],Ge?U&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,Ee.width,Ee.height,Me,Ne,Ee.data):t.texImage2D(n.TEXTURE_2D,K,Fe,Ee.width,Ee.height,0,Me,Ne,Ee.data);M.generateMipmaps=!1}else Ge?(ct&&t.texStorage2D(n.TEXTURE_2D,pe,Fe,oe.width,oe.height),U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,oe.width,oe.height,Me,Ne,oe.data)):t.texImage2D(n.TEXTURE_2D,0,Fe,oe.width,oe.height,0,Me,Ne,oe.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ge&&ct&&t.texStorage3D(n.TEXTURE_2D_ARRAY,pe,Fe,$e[0].width,$e[0].height,oe.depth);for(let K=0,te=$e.length;K<te;K++)if(Ee=$e[K],M.format!==Zn)if(Me!==null)if(Ge){if(U)if(M.layerUpdates.size>0){const xe=bm(Ee.width,Ee.height,M.format,M.type);for(const ge of M.layerUpdates){const Oe=Ee.data.subarray(ge*xe/Ee.data.BYTES_PER_ELEMENT,(ge+1)*xe/Ee.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,ge,Ee.width,Ee.height,1,Me,Oe)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,Ee.width,Ee.height,oe.depth,Me,Ee.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,Fe,Ee.width,Ee.height,oe.depth,0,Ee.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ge?U&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,Ee.width,Ee.height,oe.depth,Me,Ne,Ee.data):t.texImage3D(n.TEXTURE_2D_ARRAY,K,Fe,Ee.width,Ee.height,oe.depth,0,Me,Ne,Ee.data)}else{Ge&&ct&&t.texStorage2D(n.TEXTURE_2D,pe,Fe,$e[0].width,$e[0].height);for(let K=0,te=$e.length;K<te;K++)Ee=$e[K],M.format!==Zn?Me!==null?Ge?U&&t.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,Ee.width,Ee.height,Me,Ee.data):t.compressedTexImage2D(n.TEXTURE_2D,K,Fe,Ee.width,Ee.height,0,Ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ge?U&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,Ee.width,Ee.height,Me,Ne,Ee.data):t.texImage2D(n.TEXTURE_2D,K,Fe,Ee.width,Ee.height,0,Me,Ne,Ee.data)}else if(M.isDataArrayTexture)if(Ge){if(ct&&t.texStorage3D(n.TEXTURE_2D_ARRAY,pe,Fe,oe.width,oe.height,oe.depth),U)if(M.layerUpdates.size>0){const K=bm(oe.width,oe.height,M.format,M.type);for(const te of M.layerUpdates){const xe=oe.data.subarray(te*K/oe.data.BYTES_PER_ELEMENT,(te+1)*K/oe.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,te,oe.width,oe.height,1,Me,Ne,xe)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,Me,Ne,oe.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Fe,oe.width,oe.height,oe.depth,0,Me,Ne,oe.data);else if(M.isData3DTexture)Ge?(ct&&t.texStorage3D(n.TEXTURE_3D,pe,Fe,oe.width,oe.height,oe.depth),U&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,Me,Ne,oe.data)):t.texImage3D(n.TEXTURE_3D,0,Fe,oe.width,oe.height,oe.depth,0,Me,Ne,oe.data);else if(M.isFramebufferTexture){if(ct)if(Ge)t.texStorage2D(n.TEXTURE_2D,pe,Fe,oe.width,oe.height);else{let K=oe.width,te=oe.height;for(let xe=0;xe<pe;xe++)t.texImage2D(n.TEXTURE_2D,xe,Fe,K,te,0,Me,Ne,null),K>>=1,te>>=1}}else if($e.length>0){if(Ge&&ct){const K=we($e[0]);t.texStorage2D(n.TEXTURE_2D,pe,Fe,K.width,K.height)}for(let K=0,te=$e.length;K<te;K++)Ee=$e[K],Ge?U&&t.texSubImage2D(n.TEXTURE_2D,K,0,0,Me,Ne,Ee):t.texImage2D(n.TEXTURE_2D,K,Fe,Me,Ne,Ee);M.generateMipmaps=!1}else if(Ge){if(ct){const K=we(oe);t.texStorage2D(n.TEXTURE_2D,pe,Fe,K.width,K.height)}U&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Me,Ne,oe)}else t.texImage2D(n.TEXTURE_2D,0,Fe,Me,Ne,oe);m(M)&&c(J),Te.__version=Q.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function ie(C,M,O){if(M.image.length!==6)return;const J=Ie(C,M),ne=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,C.__webglTexture,n.TEXTURE0+O);const Q=i.get(ne);if(ne.version!==Q.__version||J===!0){t.activeTexture(n.TEXTURE0+O);const Te=Ke.getPrimaries(Ke.workingColorSpace),de=M.colorSpace===Ji?null:Ke.getPrimaries(M.colorSpace),me=M.colorSpace===Ji||Te===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,me);const qe=M.isCompressedTexture||M.image[0].isCompressedTexture,oe=M.image[0]&&M.image[0].isDataTexture,Me=[];for(let te=0;te<6;te++)!qe&&!oe?Me[te]=x(M.image[te],!0,r.maxCubemapSize):Me[te]=oe?M.image[te].image:M.image[te],Me[te]=Ve(M,Me[te]);const Ne=Me[0],Fe=s.convert(M.format,M.colorSpace),Ee=s.convert(M.type),$e=_(M.internalFormat,Fe,Ee,M.colorSpace),Ge=M.isVideoTexture!==!0,ct=Q.__version===void 0||J===!0,U=ne.dataReady;let pe=P(M,Ne);re(n.TEXTURE_CUBE_MAP,M);let K;if(qe){Ge&&ct&&t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,$e,Ne.width,Ne.height);for(let te=0;te<6;te++){K=Me[te].mipmaps;for(let xe=0;xe<K.length;xe++){const ge=K[xe];M.format!==Zn?Fe!==null?Ge?U&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,0,0,ge.width,ge.height,Fe,ge.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,$e,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ge?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,0,0,ge.width,ge.height,Fe,Ee,ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe,$e,ge.width,ge.height,0,Fe,Ee,ge.data)}}}else{if(K=M.mipmaps,Ge&&ct){K.length>0&&pe++;const te=we(Me[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,pe,$e,te.width,te.height)}for(let te=0;te<6;te++)if(oe){Ge?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Me[te].width,Me[te].height,Fe,Ee,Me[te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,$e,Me[te].width,Me[te].height,0,Fe,Ee,Me[te].data);for(let xe=0;xe<K.length;xe++){const Oe=K[xe].image[te].image;Ge?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,0,0,Oe.width,Oe.height,Fe,Ee,Oe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,$e,Oe.width,Oe.height,0,Fe,Ee,Oe.data)}}else{Ge?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Fe,Ee,Me[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,$e,Fe,Ee,Me[te]);for(let xe=0;xe<K.length;xe++){const ge=K[xe];Ge?U&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,0,0,Fe,Ee,ge.image[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,xe+1,$e,Fe,Ee,ge.image[te])}}}m(M)&&c(n.TEXTURE_CUBE_MAP),Q.__version=ne.version,M.onUpdate&&M.onUpdate(M)}C.__version=M.version}function fe(C,M,O,J,ne,Q){const Te=s.convert(O.format,O.colorSpace),de=s.convert(O.type),me=_(O.internalFormat,Te,de,O.colorSpace),qe=i.get(M),oe=i.get(O);if(oe.__renderTarget=M,!qe.__hasExternalTextures){const Me=Math.max(1,M.width>>Q),Ne=Math.max(1,M.height>>Q);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,Q,me,Me,Ne,M.depth,0,Te,de,null):t.texImage2D(ne,Q,me,Me,Ne,0,Te,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,C),De(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,J,ne,oe.__webglTexture,0,Le(M)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,J,ne,oe.__webglTexture,Q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function le(C,M,O){if(n.bindRenderbuffer(n.RENDERBUFFER,C),M.depthBuffer){const J=M.depthTexture,ne=J&&J.isDepthTexture?J.type:null,Q=S(M.stencilBuffer,ne),Te=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=Le(M);De(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,de,Q,M.width,M.height):O?n.renderbufferStorageMultisample(n.RENDERBUFFER,de,Q,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,Q,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Te,n.RENDERBUFFER,C)}else{const J=M.textures;for(let ne=0;ne<J.length;ne++){const Q=J[ne],Te=s.convert(Q.format,Q.colorSpace),de=s.convert(Q.type),me=_(Q.internalFormat,Te,de,Q.colorSpace),qe=Le(M);O&&De(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,qe,me,M.width,M.height):De(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,qe,me,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,me,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function ce(C,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,C),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const J=i.get(M.depthTexture);J.__renderTarget=M,(!J.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),W(M.depthTexture,0);const ne=J.__webglTexture,Q=Le(M);if(M.depthTexture.format===Is)De(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ne,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ne,0);else if(M.depthTexture.format===Ys)De(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ne,0,Q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function Pe(C){const M=i.get(C),O=C.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==C.depthTexture){const J=C.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),J){const ne=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,J.removeEventListener("dispose",ne)};J.addEventListener("dispose",ne),M.__depthDisposeCallback=ne}M.__boundDepthTexture=J}if(C.depthTexture&&!M.__autoAllocateDepthBuffer){if(O)throw new Error("target.depthTexture not supported in Cube render targets");ce(M.__webglFramebuffer,C)}else if(O){M.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[J]),M.__webglDepthbuffer[J]===void 0)M.__webglDepthbuffer[J]=n.createRenderbuffer(),le(M.__webglDepthbuffer[J],C,!1);else{const ne=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Q=M.__webglDepthbuffer[J];n.bindRenderbuffer(n.RENDERBUFFER,Q),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,Q)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),le(M.__webglDepthbuffer,C,!1);else{const J=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,J,n.RENDERBUFFER,ne)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ze(C,M,O){const J=i.get(C);M!==void 0&&fe(J.__webglFramebuffer,C,C.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),O!==void 0&&Pe(C)}function ut(C){const M=C.texture,O=i.get(C),J=i.get(M);C.addEventListener("dispose",T);const ne=C.textures,Q=C.isWebGLCubeRenderTarget===!0,Te=ne.length>1;if(Te||(J.__webglTexture===void 0&&(J.__webglTexture=n.createTexture()),J.__version=M.version,o.memory.textures++),Q){O.__webglFramebuffer=[];for(let de=0;de<6;de++)if(M.mipmaps&&M.mipmaps.length>0){O.__webglFramebuffer[de]=[];for(let me=0;me<M.mipmaps.length;me++)O.__webglFramebuffer[de][me]=n.createFramebuffer()}else O.__webglFramebuffer[de]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){O.__webglFramebuffer=[];for(let de=0;de<M.mipmaps.length;de++)O.__webglFramebuffer[de]=n.createFramebuffer()}else O.__webglFramebuffer=n.createFramebuffer();if(Te)for(let de=0,me=ne.length;de<me;de++){const qe=i.get(ne[de]);qe.__webglTexture===void 0&&(qe.__webglTexture=n.createTexture(),o.memory.textures++)}if(C.samples>0&&De(C)===!1){O.__webglMultisampledFramebuffer=n.createFramebuffer(),O.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,O.__webglMultisampledFramebuffer);for(let de=0;de<ne.length;de++){const me=ne[de];O.__webglColorRenderbuffer[de]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,O.__webglColorRenderbuffer[de]);const qe=s.convert(me.format,me.colorSpace),oe=s.convert(me.type),Me=_(me.internalFormat,qe,oe,me.colorSpace,C.isXRRenderTarget===!0),Ne=Le(C);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ne,Me,C.width,C.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,O.__webglColorRenderbuffer[de])}n.bindRenderbuffer(n.RENDERBUFFER,null),C.depthBuffer&&(O.__webglDepthRenderbuffer=n.createRenderbuffer(),le(O.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Q){t.bindTexture(n.TEXTURE_CUBE_MAP,J.__webglTexture),re(n.TEXTURE_CUBE_MAP,M);for(let de=0;de<6;de++)if(M.mipmaps&&M.mipmaps.length>0)for(let me=0;me<M.mipmaps.length;me++)fe(O.__webglFramebuffer[de][me],C,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,me);else fe(O.__webglFramebuffer[de],C,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(M)&&c(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Te){for(let de=0,me=ne.length;de<me;de++){const qe=ne[de],oe=i.get(qe);t.bindTexture(n.TEXTURE_2D,oe.__webglTexture),re(n.TEXTURE_2D,qe),fe(O.__webglFramebuffer,C,qe,n.COLOR_ATTACHMENT0+de,n.TEXTURE_2D,0),m(qe)&&c(n.TEXTURE_2D)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(de=C.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,J.__webglTexture),re(de,M),M.mipmaps&&M.mipmaps.length>0)for(let me=0;me<M.mipmaps.length;me++)fe(O.__webglFramebuffer[me],C,M,n.COLOR_ATTACHMENT0,de,me);else fe(O.__webglFramebuffer,C,M,n.COLOR_ATTACHMENT0,de,0);m(M)&&c(de),t.unbindTexture()}C.depthBuffer&&Pe(C)}function Ye(C){const M=C.textures;for(let O=0,J=M.length;O<J;O++){const ne=M[O];if(m(ne)){const Q=g(C),Te=i.get(ne).__webglTexture;t.bindTexture(Q,Te),c(Q),t.unbindTexture()}}}const xt=[],N=[];function Ut(C){if(C.samples>0){if(De(C)===!1){const M=C.textures,O=C.width,J=C.height;let ne=n.COLOR_BUFFER_BIT;const Q=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Te=i.get(C),de=M.length>1;if(de)for(let me=0;me<M.length;me++)t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Te.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglFramebuffer);for(let me=0;me<M.length;me++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),de){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Te.__webglColorRenderbuffer[me]);const qe=i.get(M[me]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,qe,0)}n.blitFramebuffer(0,0,O,J,0,0,O,J,ne,n.NEAREST),l===!0&&(xt.length=0,N.length=0,xt.push(n.COLOR_ATTACHMENT0+me),C.depthBuffer&&C.resolveDepthBuffer===!1&&(xt.push(Q),N.push(Q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,N)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,xt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),de)for(let me=0;me<M.length;me++){t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.RENDERBUFFER,Te.__webglColorRenderbuffer[me]);const qe=i.get(M[me]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Te.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+me,n.TEXTURE_2D,qe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Te.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const M=C.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function Le(C){return Math.min(r.maxSamples,C.samples)}function De(C){const M=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function _e(C){const M=o.render.frame;f.get(C)!==M&&(f.set(C,M),C.update())}function Ve(C,M){const O=C.colorSpace,J=C.format,ne=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||O!==Zs&&O!==Ji&&(Ke.getTransfer(O)===ot?(J!==Zn||ne!==Fi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",O)),M}function we(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(u.width=C.naturalWidth||C.width,u.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(u.width=C.displayWidth,u.height=C.displayHeight):(u.width=C.width,u.height=C.height),u}this.allocateTextureUnit=D,this.resetTextureUnits=I,this.setTexture2D=W,this.setTexture2DArray=B,this.setTexture3D=q,this.setTextureCube=b,this.rebindTextures=ze,this.setupRenderTarget=ut,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=Ut,this.setupDepthRenderbuffer=Pe,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=De}function g2(n,e){function t(i,r=Ji){let s;const o=Ke.getTransfer(r);if(i===Fi)return n.UNSIGNED_BYTE;if(i===Kd)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Zd)return n.UNSIGNED_SHORT_5_5_5_1;if(i===ev)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Qg)return n.BYTE;if(i===Jg)return n.SHORT;if(i===Zo)return n.UNSIGNED_SHORT;if(i===$d)return n.INT;if(i===Yr)return n.UNSIGNED_INT;if(i===Ri)return n.FLOAT;if(i===ia)return n.HALF_FLOAT;if(i===tv)return n.ALPHA;if(i===nv)return n.RGB;if(i===Zn)return n.RGBA;if(i===iv)return n.LUMINANCE;if(i===rv)return n.LUMINANCE_ALPHA;if(i===Is)return n.DEPTH_COMPONENT;if(i===Ys)return n.DEPTH_STENCIL;if(i===sv)return n.RED;if(i===Qd)return n.RED_INTEGER;if(i===ov)return n.RG;if(i===Jd)return n.RG_INTEGER;if(i===eh)return n.RGBA_INTEGER;if(i===ul||i===cl||i===fl||i===dl)if(o===ot)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ul)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===cl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===fl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===dl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ul)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===cl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===fl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===dl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Tf||i===wf||i===Af||i===Cf)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Tf)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===wf)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Af)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Cf)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Rf||i===bf||i===Pf)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Rf||i===bf)return o===ot?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Pf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Lf||i===Df||i===If||i===Uf||i===Nf||i===zf||i===Ff||i===kf||i===Of||i===Bf||i===Hf||i===Vf||i===Gf||i===Wf)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Lf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Df)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===If)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Uf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Nf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===zf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ff)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===kf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Of)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Bf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Hf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Vf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Gf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Wf)return o===ot?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===hl||i===Xf||i===Yf)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===hl)return o===ot?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Xf)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Yf)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===av||i===jf||i===qf||i===$f)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===hl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===jf)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===qf)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===$f)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Xs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class v2 extends wn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class lt extends Vt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _2={type:"move"};class fc{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,u=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(u&&e.hand){o=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),c=this._getHandJoint(u,x);m!==null&&(c.matrix.fromArray(m.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,c.jointRadius=m.radius),c.visible=m!==null}const f=u.joints["index-finger-tip"],h=u.joints["thumb-tip"],d=f.position.distanceTo(h.position),p=.02,v=.005;u.inputState.pinching&&d>p+v?(u.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!u.inputState.pinching&&d<=p-v&&(u.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(_2)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),u!==null&&(u.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new lt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const x2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,y2=`
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

}`;class S2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new yn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new gr({vertexShader:x2,fragmentShader:y2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ht(new Pi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class M2 extends Qs{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,u=null,f=null,h=null,d=null,p=null,v=null;const x=new S2,m=t.getContextAttributes();let c=null,g=null;const _=[],S=[],P=new tt;let A=null;const T=new wn;T.viewport=new at;const L=new wn;L.viewport=new at;const w=[T,L],y=new v2;let R=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ie=_[$];return ie===void 0&&(ie=new fc,_[$]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function($){let ie=_[$];return ie===void 0&&(ie=new fc,_[$]=ie),ie.getGripSpace()},this.getHand=function($){let ie=_[$];return ie===void 0&&(ie=new fc,_[$]=ie),ie.getHandSpace()};function D($){const ie=S.indexOf($.inputSource);if(ie===-1)return;const fe=_[ie];fe!==void 0&&(fe.update($.inputSource,$.frame,u||o),fe.dispatchEvent({type:$.type,data:$.inputSource}))}function G(){r.removeEventListener("select",D),r.removeEventListener("selectstart",D),r.removeEventListener("selectend",D),r.removeEventListener("squeeze",D),r.removeEventListener("squeezestart",D),r.removeEventListener("squeezeend",D),r.removeEventListener("end",G),r.removeEventListener("inputsourceschange",W);for(let $=0;$<_.length;$++){const ie=S[$];ie!==null&&(S[$]=null,_[$].disconnect(ie))}R=null,I=null,x.reset(),e.setRenderTarget(c),p=null,d=null,h=null,r=null,g=null,Ie.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return u||o},this.setReferenceSpace=function($){u=$},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(c=e.getRenderTarget(),r.addEventListener("select",D),r.addEventListener("selectstart",D),r.addEventListener("selectend",D),r.addEventListener("squeeze",D),r.addEventListener("squeezestart",D),r.addEventListener("squeezeend",D),r.addEventListener("end",G),r.addEventListener("inputsourceschange",W),m.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const ie={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,ie),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new jr(p.framebufferWidth,p.framebufferHeight,{format:Zn,type:Fi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let ie=null,fe=null,le=null;m.depth&&(le=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ie=m.stencil?Ys:Is,fe=m.stencil?Xs:Yr);const ce={colorFormat:t.RGBA8,depthFormat:le,scaleFactor:s};h=new XRWebGLBinding(r,t),d=h.createProjectionLayer(ce),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),g=new jr(d.textureWidth,d.textureHeight,{format:Zn,type:Fi,depthTexture:new Mv(d.textureWidth,d.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,ie),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),u=null,o=await r.requestReferenceSpace(a),Ie.setContext(r),Ie.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function W($){for(let ie=0;ie<$.removed.length;ie++){const fe=$.removed[ie],le=S.indexOf(fe);le>=0&&(S[le]=null,_[le].disconnect(fe))}for(let ie=0;ie<$.added.length;ie++){const fe=$.added[ie];let le=S.indexOf(fe);if(le===-1){for(let Pe=0;Pe<_.length;Pe++)if(Pe>=S.length){S.push(fe),le=Pe;break}else if(S[Pe]===null){S[Pe]=fe,le=Pe;break}if(le===-1)break}const ce=_[le];ce&&ce.connect(fe)}}const B=new H,q=new H;function b($,ie,fe){B.setFromMatrixPosition(ie.matrixWorld),q.setFromMatrixPosition(fe.matrixWorld);const le=B.distanceTo(q),ce=ie.projectionMatrix.elements,Pe=fe.projectionMatrix.elements,ze=ce[14]/(ce[10]-1),ut=ce[14]/(ce[10]+1),Ye=(ce[9]+1)/ce[5],xt=(ce[9]-1)/ce[5],N=(ce[8]-1)/ce[0],Ut=(Pe[8]+1)/Pe[0],Le=ze*N,De=ze*Ut,_e=le/(-N+Ut),Ve=_e*-N;if(ie.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Ve),$.translateZ(_e),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),ce[10]===-1)$.projectionMatrix.copy(ie.projectionMatrix),$.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const we=ze+_e,C=ut+_e,M=Le-Ve,O=De+(le-Ve),J=Ye*ut/C*we,ne=xt*ut/C*we;$.projectionMatrix.makePerspective(M,O,J,ne,we,C),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function k($,ie){ie===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ie.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;let ie=$.near,fe=$.far;x.texture!==null&&(x.depthNear>0&&(ie=x.depthNear),x.depthFar>0&&(fe=x.depthFar)),y.near=L.near=T.near=ie,y.far=L.far=T.far=fe,(R!==y.near||I!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),R=y.near,I=y.far),T.layers.mask=$.layers.mask|2,L.layers.mask=$.layers.mask|4,y.layers.mask=T.layers.mask|L.layers.mask;const le=$.parent,ce=y.cameras;k(y,le);for(let Pe=0;Pe<ce.length;Pe++)k(ce[Pe],le);ce.length===2?b(y,T,L):y.projectionMatrix.copy(T.projectionMatrix),V($,y,le)};function V($,ie,fe){fe===null?$.matrix.copy(ie.matrixWorld):($.matrix.copy(fe.matrixWorld),$.matrix.invert(),$.matrix.multiply(ie.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ie.projectionMatrix),$.projectionMatrixInverse.copy(ie.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Kf*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function($){l=$,d!==null&&(d.fixedFoveation=$),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=$)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(y)};let ee=null;function re($,ie){if(f=ie.getViewerPose(u||o),v=ie,f!==null){const fe=f.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let le=!1;fe.length!==y.cameras.length&&(y.cameras.length=0,le=!0);for(let Pe=0;Pe<fe.length;Pe++){const ze=fe[Pe];let ut=null;if(p!==null)ut=p.getViewport(ze);else{const xt=h.getViewSubImage(d,ze);ut=xt.viewport,Pe===0&&(e.setRenderTargetTextures(g,xt.colorTexture,d.ignoreDepthValues?void 0:xt.depthStencilTexture),e.setRenderTarget(g))}let Ye=w[Pe];Ye===void 0&&(Ye=new wn,Ye.layers.enable(Pe),Ye.viewport=new at,w[Pe]=Ye),Ye.matrix.fromArray(ze.transform.matrix),Ye.matrix.decompose(Ye.position,Ye.quaternion,Ye.scale),Ye.projectionMatrix.fromArray(ze.projectionMatrix),Ye.projectionMatrixInverse.copy(Ye.projectionMatrix).invert(),Ye.viewport.set(ut.x,ut.y,ut.width,ut.height),Pe===0&&(y.matrix.copy(Ye.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),le===!0&&y.cameras.push(Ye)}const ce=r.enabledFeatures;if(ce&&ce.includes("depth-sensing")){const Pe=h.getDepthInformation(fe[0]);Pe&&Pe.isValid&&Pe.texture&&x.init(e,Pe,r.renderState)}}for(let fe=0;fe<_.length;fe++){const le=S[fe],ce=_[fe];le!==null&&ce!==void 0&&ce.update(le,ie,u||o)}ee&&ee($,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),v=null}const Ie=new yv;Ie.setAnimationLoop(re),this.setAnimationLoop=function($){ee=$},this.dispose=function(){}}}const Cr=new pi,E2=new Et;function T2(n,e){function t(m,c){m.matrixAutoUpdate===!0&&m.updateMatrix(),c.value.copy(m.matrix)}function i(m,c){c.color.getRGB(m.fogColor.value,vv(n)),c.isFog?(m.fogNear.value=c.near,m.fogFar.value=c.far):c.isFogExp2&&(m.fogDensity.value=c.density)}function r(m,c,g,_,S){c.isMeshBasicMaterial||c.isMeshLambertMaterial?s(m,c):c.isMeshToonMaterial?(s(m,c),h(m,c)):c.isMeshPhongMaterial?(s(m,c),f(m,c)):c.isMeshStandardMaterial?(s(m,c),d(m,c),c.isMeshPhysicalMaterial&&p(m,c,S)):c.isMeshMatcapMaterial?(s(m,c),v(m,c)):c.isMeshDepthMaterial?s(m,c):c.isMeshDistanceMaterial?(s(m,c),x(m,c)):c.isMeshNormalMaterial?s(m,c):c.isLineBasicMaterial?(o(m,c),c.isLineDashedMaterial&&a(m,c)):c.isPointsMaterial?l(m,c,g,_):c.isSpriteMaterial?u(m,c):c.isShadowMaterial?(m.color.value.copy(c.color),m.opacity.value=c.opacity):c.isShaderMaterial&&(c.uniformsNeedUpdate=!1)}function s(m,c){m.opacity.value=c.opacity,c.color&&m.diffuse.value.copy(c.color),c.emissive&&m.emissive.value.copy(c.emissive).multiplyScalar(c.emissiveIntensity),c.map&&(m.map.value=c.map,t(c.map,m.mapTransform)),c.alphaMap&&(m.alphaMap.value=c.alphaMap,t(c.alphaMap,m.alphaMapTransform)),c.bumpMap&&(m.bumpMap.value=c.bumpMap,t(c.bumpMap,m.bumpMapTransform),m.bumpScale.value=c.bumpScale,c.side===xn&&(m.bumpScale.value*=-1)),c.normalMap&&(m.normalMap.value=c.normalMap,t(c.normalMap,m.normalMapTransform),m.normalScale.value.copy(c.normalScale),c.side===xn&&m.normalScale.value.negate()),c.displacementMap&&(m.displacementMap.value=c.displacementMap,t(c.displacementMap,m.displacementMapTransform),m.displacementScale.value=c.displacementScale,m.displacementBias.value=c.displacementBias),c.emissiveMap&&(m.emissiveMap.value=c.emissiveMap,t(c.emissiveMap,m.emissiveMapTransform)),c.specularMap&&(m.specularMap.value=c.specularMap,t(c.specularMap,m.specularMapTransform)),c.alphaTest>0&&(m.alphaTest.value=c.alphaTest);const g=e.get(c),_=g.envMap,S=g.envMapRotation;_&&(m.envMap.value=_,Cr.copy(S),Cr.x*=-1,Cr.y*=-1,Cr.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(Cr.y*=-1,Cr.z*=-1),m.envMapRotation.value.setFromMatrix4(E2.makeRotationFromEuler(Cr)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=c.reflectivity,m.ior.value=c.ior,m.refractionRatio.value=c.refractionRatio),c.lightMap&&(m.lightMap.value=c.lightMap,m.lightMapIntensity.value=c.lightMapIntensity,t(c.lightMap,m.lightMapTransform)),c.aoMap&&(m.aoMap.value=c.aoMap,m.aoMapIntensity.value=c.aoMapIntensity,t(c.aoMap,m.aoMapTransform))}function o(m,c){m.diffuse.value.copy(c.color),m.opacity.value=c.opacity,c.map&&(m.map.value=c.map,t(c.map,m.mapTransform))}function a(m,c){m.dashSize.value=c.dashSize,m.totalSize.value=c.dashSize+c.gapSize,m.scale.value=c.scale}function l(m,c,g,_){m.diffuse.value.copy(c.color),m.opacity.value=c.opacity,m.size.value=c.size*g,m.scale.value=_*.5,c.map&&(m.map.value=c.map,t(c.map,m.uvTransform)),c.alphaMap&&(m.alphaMap.value=c.alphaMap,t(c.alphaMap,m.alphaMapTransform)),c.alphaTest>0&&(m.alphaTest.value=c.alphaTest)}function u(m,c){m.diffuse.value.copy(c.color),m.opacity.value=c.opacity,m.rotation.value=c.rotation,c.map&&(m.map.value=c.map,t(c.map,m.mapTransform)),c.alphaMap&&(m.alphaMap.value=c.alphaMap,t(c.alphaMap,m.alphaMapTransform)),c.alphaTest>0&&(m.alphaTest.value=c.alphaTest)}function f(m,c){m.specular.value.copy(c.specular),m.shininess.value=Math.max(c.shininess,1e-4)}function h(m,c){c.gradientMap&&(m.gradientMap.value=c.gradientMap)}function d(m,c){m.metalness.value=c.metalness,c.metalnessMap&&(m.metalnessMap.value=c.metalnessMap,t(c.metalnessMap,m.metalnessMapTransform)),m.roughness.value=c.roughness,c.roughnessMap&&(m.roughnessMap.value=c.roughnessMap,t(c.roughnessMap,m.roughnessMapTransform)),c.envMap&&(m.envMapIntensity.value=c.envMapIntensity)}function p(m,c,g){m.ior.value=c.ior,c.sheen>0&&(m.sheenColor.value.copy(c.sheenColor).multiplyScalar(c.sheen),m.sheenRoughness.value=c.sheenRoughness,c.sheenColorMap&&(m.sheenColorMap.value=c.sheenColorMap,t(c.sheenColorMap,m.sheenColorMapTransform)),c.sheenRoughnessMap&&(m.sheenRoughnessMap.value=c.sheenRoughnessMap,t(c.sheenRoughnessMap,m.sheenRoughnessMapTransform))),c.clearcoat>0&&(m.clearcoat.value=c.clearcoat,m.clearcoatRoughness.value=c.clearcoatRoughness,c.clearcoatMap&&(m.clearcoatMap.value=c.clearcoatMap,t(c.clearcoatMap,m.clearcoatMapTransform)),c.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=c.clearcoatRoughnessMap,t(c.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),c.clearcoatNormalMap&&(m.clearcoatNormalMap.value=c.clearcoatNormalMap,t(c.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(c.clearcoatNormalScale),c.side===xn&&m.clearcoatNormalScale.value.negate())),c.dispersion>0&&(m.dispersion.value=c.dispersion),c.iridescence>0&&(m.iridescence.value=c.iridescence,m.iridescenceIOR.value=c.iridescenceIOR,m.iridescenceThicknessMinimum.value=c.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=c.iridescenceThicknessRange[1],c.iridescenceMap&&(m.iridescenceMap.value=c.iridescenceMap,t(c.iridescenceMap,m.iridescenceMapTransform)),c.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=c.iridescenceThicknessMap,t(c.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),c.transmission>0&&(m.transmission.value=c.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),c.transmissionMap&&(m.transmissionMap.value=c.transmissionMap,t(c.transmissionMap,m.transmissionMapTransform)),m.thickness.value=c.thickness,c.thicknessMap&&(m.thicknessMap.value=c.thicknessMap,t(c.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=c.attenuationDistance,m.attenuationColor.value.copy(c.attenuationColor)),c.anisotropy>0&&(m.anisotropyVector.value.set(c.anisotropy*Math.cos(c.anisotropyRotation),c.anisotropy*Math.sin(c.anisotropyRotation)),c.anisotropyMap&&(m.anisotropyMap.value=c.anisotropyMap,t(c.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=c.specularIntensity,m.specularColor.value.copy(c.specularColor),c.specularColorMap&&(m.specularColorMap.value=c.specularColorMap,t(c.specularColorMap,m.specularColorMapTransform)),c.specularIntensityMap&&(m.specularIntensityMap.value=c.specularIntensityMap,t(c.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,c){c.matcap&&(m.matcap.value=c.matcap)}function x(m,c){const g=e.get(c).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function w2(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,_){const S=_.program;i.uniformBlockBinding(g,S)}function u(g,_){let S=r[g.id];S===void 0&&(v(g),S=f(g),r[g.id]=S,g.addEventListener("dispose",m));const P=_.program;i.updateUBOMapping(g,P);const A=e.render.frame;s[g.id]!==A&&(d(g),s[g.id]=A)}function f(g){const _=h();g.__bindingPointIndex=_;const S=n.createBuffer(),P=g.__size,A=g.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,P,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,S),S}function h(){for(let g=0;g<a;g++)if(o.indexOf(g)===-1)return o.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(g){const _=r[g.id],S=g.uniforms,P=g.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let A=0,T=S.length;A<T;A++){const L=Array.isArray(S[A])?S[A]:[S[A]];for(let w=0,y=L.length;w<y;w++){const R=L[w];if(p(R,A,w,P)===!0){const I=R.__offset,D=Array.isArray(R.value)?R.value:[R.value];let G=0;for(let W=0;W<D.length;W++){const B=D[W],q=x(B);typeof B=="number"||typeof B=="boolean"?(R.__data[0]=B,n.bufferSubData(n.UNIFORM_BUFFER,I+G,R.__data)):B.isMatrix3?(R.__data[0]=B.elements[0],R.__data[1]=B.elements[1],R.__data[2]=B.elements[2],R.__data[3]=0,R.__data[4]=B.elements[3],R.__data[5]=B.elements[4],R.__data[6]=B.elements[5],R.__data[7]=0,R.__data[8]=B.elements[6],R.__data[9]=B.elements[7],R.__data[10]=B.elements[8],R.__data[11]=0):(B.toArray(R.__data,G),G+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(g,_,S,P){const A=g.value,T=_+"_"+S;if(P[T]===void 0)return typeof A=="number"||typeof A=="boolean"?P[T]=A:P[T]=A.clone(),!0;{const L=P[T];if(typeof A=="number"||typeof A=="boolean"){if(L!==A)return P[T]=A,!0}else if(L.equals(A)===!1)return L.copy(A),!0}return!1}function v(g){const _=g.uniforms;let S=0;const P=16;for(let T=0,L=_.length;T<L;T++){const w=Array.isArray(_[T])?_[T]:[_[T]];for(let y=0,R=w.length;y<R;y++){const I=w[y],D=Array.isArray(I.value)?I.value:[I.value];for(let G=0,W=D.length;G<W;G++){const B=D[G],q=x(B),b=S%P,k=b%q.boundary,V=b+k;S+=k,V!==0&&P-V<q.storage&&(S+=P-V),I.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=S,S+=q.storage}}}const A=S%P;return A>0&&(S+=P-A),g.__size=S,g.__cache={},this}function x(g){const _={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(_.boundary=4,_.storage=4):g.isVector2?(_.boundary=8,_.storage=8):g.isVector3||g.isColor?(_.boundary=16,_.storage=12):g.isVector4?(_.boundary=16,_.storage=16):g.isMatrix3?(_.boundary=48,_.storage=48):g.isMatrix4?(_.boundary=64,_.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),_}function m(g){const _=g.target;_.removeEventListener("dispose",m);const S=o.indexOf(_.__bindingPointIndex);o.splice(S,1),n.deleteBuffer(r[_.id]),delete r[_.id],delete s[_.id]}function c(){for(const g in r)n.deleteBuffer(r[g]);o=[],r={},s={}}return{bind:l,update:u,dispose:c}}class A2{constructor(e={}){const{canvas:t=h1(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:u=!1,powerPreference:f="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:d=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const v=new Uint32Array(4),x=new Int32Array(4);let m=null,c=null;const g=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Un,this.toneMapping=dr,this.toneMappingExposure=1;const S=this;let P=!1,A=0,T=0,L=null,w=-1,y=null;const R=new at,I=new at;let D=null;const G=new je(0);let W=0,B=t.width,q=t.height,b=1,k=null,V=null;const ee=new at(0,0,B,q),re=new at(0,0,B,q);let Ie=!1;const $=new nh;let ie=!1,fe=!1;const le=new Et,ce=new Et,Pe=new H,ze=new at,ut={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function xt(){return L===null?b:1}let N=i;function Ut(E,z){return t.getContext(E,z)}try{const E={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:u,powerPreference:f,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${jd}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",ge,!1),N===null){const z="webgl2";if(N=Ut(z,E),N===null)throw Ut(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let Le,De,_e,Ve,we,C,M,O,J,ne,Q,Te,de,me,qe,oe,Me,Ne,Fe,Ee,$e,Ge,ct,U;function pe(){Le=new LE(N),Le.init(),Ge=new g2(N,Le),De=new wE(N,Le,e,Ge),_e=new h2(N,Le),De.reverseDepthBuffer&&d&&_e.buffers.depth.setReversed(!0),Ve=new UE(N),we=new QT,C=new m2(N,Le,_e,we,De,Ge,Ve),M=new CE(S),O=new PE(S),J=new H1(N),ct=new EE(N,J),ne=new DE(N,J,Ve,ct),Q=new zE(N,ne,J,Ve),Fe=new NE(N,De,C),oe=new AE(we),Te=new ZT(S,M,O,Le,De,ct,oe),de=new T2(S,we),me=new e2,qe=new o2(Le),Ne=new ME(S,M,O,_e,Q,p,l),Me=new f2(S,Q,De),U=new w2(N,Ve,De,_e),Ee=new TE(N,Le,Ve),$e=new IE(N,Le,Ve),Ve.programs=Te.programs,S.capabilities=De,S.extensions=Le,S.properties=we,S.renderLists=me,S.shadowMap=Me,S.state=_e,S.info=Ve}pe();const K=new M2(S,N);this.xr=K,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const E=Le.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){const E=Le.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return b},this.setPixelRatio=function(E){E!==void 0&&(b=E,this.setSize(B,q,!1))},this.getSize=function(E){return E.set(B,q)},this.setSize=function(E,z,Y=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}B=E,q=z,t.width=Math.floor(E*b),t.height=Math.floor(z*b),Y===!0&&(t.style.width=E+"px",t.style.height=z+"px"),this.setViewport(0,0,E,z)},this.getDrawingBufferSize=function(E){return E.set(B*b,q*b).floor()},this.setDrawingBufferSize=function(E,z,Y){B=E,q=z,b=Y,t.width=Math.floor(E*Y),t.height=Math.floor(z*Y),this.setViewport(0,0,E,z)},this.getCurrentViewport=function(E){return E.copy(R)},this.getViewport=function(E){return E.copy(ee)},this.setViewport=function(E,z,Y,j){E.isVector4?ee.set(E.x,E.y,E.z,E.w):ee.set(E,z,Y,j),_e.viewport(R.copy(ee).multiplyScalar(b).round())},this.getScissor=function(E){return E.copy(re)},this.setScissor=function(E,z,Y,j){E.isVector4?re.set(E.x,E.y,E.z,E.w):re.set(E,z,Y,j),_e.scissor(I.copy(re).multiplyScalar(b).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(E){_e.setScissorTest(Ie=E)},this.setOpaqueSort=function(E){k=E},this.setTransparentSort=function(E){V=E},this.getClearColor=function(E){return E.copy(Ne.getClearColor())},this.setClearColor=function(){Ne.setClearColor.apply(Ne,arguments)},this.getClearAlpha=function(){return Ne.getClearAlpha()},this.setClearAlpha=function(){Ne.setClearAlpha.apply(Ne,arguments)},this.clear=function(E=!0,z=!0,Y=!0){let j=0;if(E){let F=!1;if(L!==null){const ue=L.texture.format;F=ue===eh||ue===Jd||ue===Qd}if(F){const ue=L.texture.type,ve=ue===Fi||ue===Yr||ue===Zo||ue===Xs||ue===Kd||ue===Zd,Ae=Ne.getClearColor(),Ce=Ne.getClearAlpha(),ke=Ae.r,Be=Ae.g,Re=Ae.b;ve?(v[0]=ke,v[1]=Be,v[2]=Re,v[3]=Ce,N.clearBufferuiv(N.COLOR,0,v)):(x[0]=ke,x[1]=Be,x[2]=Re,x[3]=Ce,N.clearBufferiv(N.COLOR,0,x))}else j|=N.COLOR_BUFFER_BIT}z&&(j|=N.DEPTH_BUFFER_BIT),Y&&(j|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),me.dispose(),qe.dispose(),we.dispose(),M.dispose(),O.dispose(),Q.dispose(),ct.dispose(),U.dispose(),Te.dispose(),K.dispose(),K.removeEventListener("sessionstart",ah),K.removeEventListener("sessionend",lh),Sr.stop()};function te(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;const E=Ve.autoReset,z=Me.enabled,Y=Me.autoUpdate,j=Me.needsUpdate,F=Me.type;pe(),Ve.autoReset=E,Me.enabled=z,Me.autoUpdate=Y,Me.needsUpdate=j,Me.type=F}function ge(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Oe(E){const z=E.target;z.removeEventListener("dispose",Oe),wt(z)}function wt(E){Kt(E),we.remove(E)}function Kt(E){const z=we.get(E).programs;z!==void 0&&(z.forEach(function(Y){Te.releaseProgram(Y)}),E.isShaderMaterial&&Te.releaseShaderCache(E))}this.renderBufferDirect=function(E,z,Y,j,F,ue){z===null&&(z=ut);const ve=F.isMesh&&F.matrixWorld.determinant()<0,Ae=bv(E,z,Y,j,F);_e.setMaterial(j,ve);let Ce=Y.index,ke=1;if(j.wireframe===!0){if(Ce=ne.getWireframeAttribute(Y),Ce===void 0)return;ke=2}const Be=Y.drawRange,Re=Y.attributes.position;let Qe=Be.start*ke,ft=(Be.start+Be.count)*ke;ue!==null&&(Qe=Math.max(Qe,ue.start*ke),ft=Math.min(ft,(ue.start+ue.count)*ke)),Ce!==null?(Qe=Math.max(Qe,0),ft=Math.min(ft,Ce.count)):Re!=null&&(Qe=Math.max(Qe,0),ft=Math.min(ft,Re.count));const mt=ft-Qe;if(mt<0||mt===1/0)return;ct.setup(F,j,Ae,Y,Ce);let fn,nt=Ee;if(Ce!==null&&(fn=J.get(Ce),nt=$e,nt.setIndex(fn)),F.isMesh)j.wireframe===!0?(_e.setLineWidth(j.wireframeLinewidth*xt()),nt.setMode(N.LINES)):nt.setMode(N.TRIANGLES);else if(F.isLine){let be=j.linewidth;be===void 0&&(be=1),_e.setLineWidth(be*xt()),F.isLineSegments?nt.setMode(N.LINES):F.isLineLoop?nt.setMode(N.LINE_LOOP):nt.setMode(N.LINE_STRIP)}else F.isPoints?nt.setMode(N.POINTS):F.isSprite&&nt.setMode(N.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)nt.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(Le.get("WEBGL_multi_draw"))nt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const be=F._multiDrawStarts,gi=F._multiDrawCounts,it=F._multiDrawCount,Vn=Ce?J.get(Ce).bytesPerElement:1,Kr=we.get(j).currentProgram.getUniforms();for(let Sn=0;Sn<it;Sn++)Kr.setValue(N,"_gl_DrawID",Sn),nt.render(be[Sn]/Vn,gi[Sn])}else if(F.isInstancedMesh)nt.renderInstances(Qe,mt,F.count);else if(Y.isInstancedBufferGeometry){const be=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,gi=Math.min(Y.instanceCount,be);nt.renderInstances(Qe,mt,gi)}else nt.render(Qe,mt)};function rt(E,z,Y){E.transparent===!0&&E.side===li&&E.forceSinglePass===!1?(E.side=xn,E.needsUpdate=!0,ua(E,z,Y),E.side=mr,E.needsUpdate=!0,ua(E,z,Y),E.side=li):ua(E,z,Y)}this.compile=function(E,z,Y=null){Y===null&&(Y=E),c=qe.get(Y),c.init(z),_.push(c),Y.traverseVisible(function(F){F.isLight&&F.layers.test(z.layers)&&(c.pushLight(F),F.castShadow&&c.pushShadow(F))}),E!==Y&&E.traverseVisible(function(F){F.isLight&&F.layers.test(z.layers)&&(c.pushLight(F),F.castShadow&&c.pushShadow(F))}),c.setupLights();const j=new Set;return E.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const ue=F.material;if(ue)if(Array.isArray(ue))for(let ve=0;ve<ue.length;ve++){const Ae=ue[ve];rt(Ae,Y,F),j.add(Ae)}else rt(ue,Y,F),j.add(ue)}),_.pop(),c=null,j},this.compileAsync=function(E,z,Y=null){const j=this.compile(E,z,Y);return new Promise(F=>{function ue(){if(j.forEach(function(ve){we.get(ve).currentProgram.isReady()&&j.delete(ve)}),j.size===0){F(E);return}setTimeout(ue,10)}Le.get("KHR_parallel_shader_compile")!==null?ue():setTimeout(ue,10)})};let Hn=null;function mi(E){Hn&&Hn(E)}function ah(){Sr.stop()}function lh(){Sr.start()}const Sr=new yv;Sr.setAnimationLoop(mi),typeof self<"u"&&Sr.setContext(self),this.setAnimationLoop=function(E){Hn=E,K.setAnimationLoop(E),E===null?Sr.stop():Sr.start()},K.addEventListener("sessionstart",ah),K.addEventListener("sessionend",lh),this.render=function(E,z){if(z!==void 0&&z.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(z),z=K.getCamera()),E.isScene===!0&&E.onBeforeRender(S,E,z,L),c=qe.get(E,_.length),c.init(z),_.push(c),ce.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),$.setFromProjectionMatrix(ce),fe=this.localClippingEnabled,ie=oe.init(this.clippingPlanes,fe),m=me.get(E,g.length),m.init(),g.push(m),K.enabled===!0&&K.isPresenting===!0){const ue=S.xr.getDepthSensingMesh();ue!==null&&au(ue,z,-1/0,S.sortObjects)}au(E,z,0,S.sortObjects),m.finish(),S.sortObjects===!0&&m.sort(k,V),Ye=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,Ye&&Ne.addToRenderList(m,E),this.info.render.frame++,ie===!0&&oe.beginShadows();const Y=c.state.shadowsArray;Me.render(Y,E,z),ie===!0&&oe.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=m.opaque,F=m.transmissive;if(c.setupLights(),z.isArrayCamera){const ue=z.cameras;if(F.length>0)for(let ve=0,Ae=ue.length;ve<Ae;ve++){const Ce=ue[ve];ch(j,F,E,Ce)}Ye&&Ne.render(E);for(let ve=0,Ae=ue.length;ve<Ae;ve++){const Ce=ue[ve];uh(m,E,Ce,Ce.viewport)}}else F.length>0&&ch(j,F,E,z),Ye&&Ne.render(E),uh(m,E,z);L!==null&&(C.updateMultisampleRenderTarget(L),C.updateRenderTargetMipmap(L)),E.isScene===!0&&E.onAfterRender(S,E,z),ct.resetDefaultState(),w=-1,y=null,_.pop(),_.length>0?(c=_[_.length-1],ie===!0&&oe.setGlobalState(S.clippingPlanes,c.state.camera)):c=null,g.pop(),g.length>0?m=g[g.length-1]:m=null};function au(E,z,Y,j){if(E.visible===!1)return;if(E.layers.test(z.layers)){if(E.isGroup)Y=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(z);else if(E.isLight)c.pushLight(E),E.castShadow&&c.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||$.intersectsSprite(E)){j&&ze.setFromMatrixPosition(E.matrixWorld).applyMatrix4(ce);const ve=Q.update(E),Ae=E.material;Ae.visible&&m.push(E,ve,Ae,Y,ze.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||$.intersectsObject(E))){const ve=Q.update(E),Ae=E.material;if(j&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),ze.copy(E.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),ze.copy(ve.boundingSphere.center)),ze.applyMatrix4(E.matrixWorld).applyMatrix4(ce)),Array.isArray(Ae)){const Ce=ve.groups;for(let ke=0,Be=Ce.length;ke<Be;ke++){const Re=Ce[ke],Qe=Ae[Re.materialIndex];Qe&&Qe.visible&&m.push(E,ve,Qe,Y,ze.z,Re)}}else Ae.visible&&m.push(E,ve,Ae,Y,ze.z,null)}}const ue=E.children;for(let ve=0,Ae=ue.length;ve<Ae;ve++)au(ue[ve],z,Y,j)}function uh(E,z,Y,j){const F=E.opaque,ue=E.transmissive,ve=E.transparent;c.setupLightsView(Y),ie===!0&&oe.setGlobalState(S.clippingPlanes,Y),j&&_e.viewport(R.copy(j)),F.length>0&&la(F,z,Y),ue.length>0&&la(ue,z,Y),ve.length>0&&la(ve,z,Y),_e.buffers.depth.setTest(!0),_e.buffers.depth.setMask(!0),_e.buffers.color.setMask(!0),_e.setPolygonOffset(!1)}function ch(E,z,Y,j){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;c.state.transmissionRenderTarget[j.id]===void 0&&(c.state.transmissionRenderTarget[j.id]=new jr(1,1,{generateMipmaps:!0,type:Le.has("EXT_color_buffer_half_float")||Le.has("EXT_color_buffer_float")?ia:Fi,minFilter:kr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ke.workingColorSpace}));const ue=c.state.transmissionRenderTarget[j.id],ve=j.viewport||R;ue.setSize(ve.z,ve.w);const Ae=S.getRenderTarget();S.setRenderTarget(ue),S.getClearColor(G),W=S.getClearAlpha(),W<1&&S.setClearColor(16777215,.5),S.clear(),Ye&&Ne.render(Y);const Ce=S.toneMapping;S.toneMapping=dr;const ke=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),c.setupLightsView(j),ie===!0&&oe.setGlobalState(S.clippingPlanes,j),la(E,Y,j),C.updateMultisampleRenderTarget(ue),C.updateRenderTargetMipmap(ue),Le.has("WEBGL_multisampled_render_to_texture")===!1){let Be=!1;for(let Re=0,Qe=z.length;Re<Qe;Re++){const ft=z[Re],mt=ft.object,fn=ft.geometry,nt=ft.material,be=ft.group;if(nt.side===li&&mt.layers.test(j.layers)){const gi=nt.side;nt.side=xn,nt.needsUpdate=!0,fh(mt,Y,j,fn,nt,be),nt.side=gi,nt.needsUpdate=!0,Be=!0}}Be===!0&&(C.updateMultisampleRenderTarget(ue),C.updateRenderTargetMipmap(ue))}S.setRenderTarget(Ae),S.setClearColor(G,W),ke!==void 0&&(j.viewport=ke),S.toneMapping=Ce}function la(E,z,Y){const j=z.isScene===!0?z.overrideMaterial:null;for(let F=0,ue=E.length;F<ue;F++){const ve=E[F],Ae=ve.object,Ce=ve.geometry,ke=j===null?ve.material:j,Be=ve.group;Ae.layers.test(Y.layers)&&fh(Ae,z,Y,Ce,ke,Be)}}function fh(E,z,Y,j,F,ue){E.onBeforeRender(S,z,Y,j,F,ue),E.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),F.onBeforeRender(S,z,Y,j,E,ue),F.transparent===!0&&F.side===li&&F.forceSinglePass===!1?(F.side=xn,F.needsUpdate=!0,S.renderBufferDirect(Y,z,j,F,E,ue),F.side=mr,F.needsUpdate=!0,S.renderBufferDirect(Y,z,j,F,E,ue),F.side=li):S.renderBufferDirect(Y,z,j,F,E,ue),E.onAfterRender(S,z,Y,j,F,ue)}function ua(E,z,Y){z.isScene!==!0&&(z=ut);const j=we.get(E),F=c.state.lights,ue=c.state.shadowsArray,ve=F.state.version,Ae=Te.getParameters(E,F.state,ue,z,Y),Ce=Te.getProgramCacheKey(Ae);let ke=j.programs;j.environment=E.isMeshStandardMaterial?z.environment:null,j.fog=z.fog,j.envMap=(E.isMeshStandardMaterial?O:M).get(E.envMap||j.environment),j.envMapRotation=j.environment!==null&&E.envMap===null?z.environmentRotation:E.envMapRotation,ke===void 0&&(E.addEventListener("dispose",Oe),ke=new Map,j.programs=ke);let Be=ke.get(Ce);if(Be!==void 0){if(j.currentProgram===Be&&j.lightsStateVersion===ve)return hh(E,Ae),Be}else Ae.uniforms=Te.getUniforms(E),E.onBeforeCompile(Ae,S),Be=Te.acquireProgram(Ae,Ce),ke.set(Ce,Be),j.uniforms=Ae.uniforms;const Re=j.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Re.clippingPlanes=oe.uniform),hh(E,Ae),j.needsLights=Lv(E),j.lightsStateVersion=ve,j.needsLights&&(Re.ambientLightColor.value=F.state.ambient,Re.lightProbe.value=F.state.probe,Re.directionalLights.value=F.state.directional,Re.directionalLightShadows.value=F.state.directionalShadow,Re.spotLights.value=F.state.spot,Re.spotLightShadows.value=F.state.spotShadow,Re.rectAreaLights.value=F.state.rectArea,Re.ltc_1.value=F.state.rectAreaLTC1,Re.ltc_2.value=F.state.rectAreaLTC2,Re.pointLights.value=F.state.point,Re.pointLightShadows.value=F.state.pointShadow,Re.hemisphereLights.value=F.state.hemi,Re.directionalShadowMap.value=F.state.directionalShadowMap,Re.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Re.spotShadowMap.value=F.state.spotShadowMap,Re.spotLightMatrix.value=F.state.spotLightMatrix,Re.spotLightMap.value=F.state.spotLightMap,Re.pointShadowMap.value=F.state.pointShadowMap,Re.pointShadowMatrix.value=F.state.pointShadowMatrix),j.currentProgram=Be,j.uniformsList=null,Be}function dh(E){if(E.uniformsList===null){const z=E.currentProgram.getUniforms();E.uniformsList=pl.seqWithValue(z.seq,E.uniforms)}return E.uniformsList}function hh(E,z){const Y=we.get(E);Y.outputColorSpace=z.outputColorSpace,Y.batching=z.batching,Y.batchingColor=z.batchingColor,Y.instancing=z.instancing,Y.instancingColor=z.instancingColor,Y.instancingMorph=z.instancingMorph,Y.skinning=z.skinning,Y.morphTargets=z.morphTargets,Y.morphNormals=z.morphNormals,Y.morphColors=z.morphColors,Y.morphTargetsCount=z.morphTargetsCount,Y.numClippingPlanes=z.numClippingPlanes,Y.numIntersection=z.numClipIntersection,Y.vertexAlphas=z.vertexAlphas,Y.vertexTangents=z.vertexTangents,Y.toneMapping=z.toneMapping}function bv(E,z,Y,j,F){z.isScene!==!0&&(z=ut),C.resetTextureUnits();const ue=z.fog,ve=j.isMeshStandardMaterial?z.environment:null,Ae=L===null?S.outputColorSpace:L.isXRRenderTarget===!0?L.texture.colorSpace:Zs,Ce=(j.isMeshStandardMaterial?O:M).get(j.envMap||ve),ke=j.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Be=!!Y.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Re=!!Y.morphAttributes.position,Qe=!!Y.morphAttributes.normal,ft=!!Y.morphAttributes.color;let mt=dr;j.toneMapped&&(L===null||L.isXRRenderTarget===!0)&&(mt=S.toneMapping);const fn=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,nt=fn!==void 0?fn.length:0,be=we.get(j),gi=c.state.lights;if(ie===!0&&(fe===!0||E!==y)){const Ln=E===y&&j.id===w;oe.setState(j,E,Ln)}let it=!1;j.version===be.__version?(be.needsLights&&be.lightsStateVersion!==gi.state.version||be.outputColorSpace!==Ae||F.isBatchedMesh&&be.batching===!1||!F.isBatchedMesh&&be.batching===!0||F.isBatchedMesh&&be.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&be.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&be.instancing===!1||!F.isInstancedMesh&&be.instancing===!0||F.isSkinnedMesh&&be.skinning===!1||!F.isSkinnedMesh&&be.skinning===!0||F.isInstancedMesh&&be.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&be.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&be.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&be.instancingMorph===!1&&F.morphTexture!==null||be.envMap!==Ce||j.fog===!0&&be.fog!==ue||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==oe.numPlanes||be.numIntersection!==oe.numIntersection)||be.vertexAlphas!==ke||be.vertexTangents!==Be||be.morphTargets!==Re||be.morphNormals!==Qe||be.morphColors!==ft||be.toneMapping!==mt||be.morphTargetsCount!==nt)&&(it=!0):(it=!0,be.__version=j.version);let Vn=be.currentProgram;it===!0&&(Vn=ua(j,z,F));let Kr=!1,Sn=!1,eo=!1;const gt=Vn.getUniforms(),ni=be.uniforms;if(_e.useProgram(Vn.program)&&(Kr=!0,Sn=!0,eo=!0),j.id!==w&&(w=j.id,Sn=!0),Kr||y!==E){_e.buffers.depth.getReversed()?(le.copy(E.projectionMatrix),m1(le),g1(le),gt.setValue(N,"projectionMatrix",le)):gt.setValue(N,"projectionMatrix",E.projectionMatrix),gt.setValue(N,"viewMatrix",E.matrixWorldInverse);const Oi=gt.map.cameraPosition;Oi!==void 0&&Oi.setValue(N,Pe.setFromMatrixPosition(E.matrixWorld)),De.logarithmicDepthBuffer&&gt.setValue(N,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&gt.setValue(N,"isOrthographic",E.isOrthographicCamera===!0),y!==E&&(y=E,Sn=!0,eo=!0)}if(F.isSkinnedMesh){gt.setOptional(N,F,"bindMatrix"),gt.setOptional(N,F,"bindMatrixInverse");const Ln=F.skeleton;Ln&&(Ln.boneTexture===null&&Ln.computeBoneTexture(),gt.setValue(N,"boneTexture",Ln.boneTexture,C))}F.isBatchedMesh&&(gt.setOptional(N,F,"batchingTexture"),gt.setValue(N,"batchingTexture",F._matricesTexture,C),gt.setOptional(N,F,"batchingIdTexture"),gt.setValue(N,"batchingIdTexture",F._indirectTexture,C),gt.setOptional(N,F,"batchingColorTexture"),F._colorsTexture!==null&&gt.setValue(N,"batchingColorTexture",F._colorsTexture,C));const to=Y.morphAttributes;if((to.position!==void 0||to.normal!==void 0||to.color!==void 0)&&Fe.update(F,Y,Vn),(Sn||be.receiveShadow!==F.receiveShadow)&&(be.receiveShadow=F.receiveShadow,gt.setValue(N,"receiveShadow",F.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(ni.envMap.value=Ce,ni.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&z.environment!==null&&(ni.envMapIntensity.value=z.environmentIntensity),Sn&&(gt.setValue(N,"toneMappingExposure",S.toneMappingExposure),be.needsLights&&Pv(ni,eo),ue&&j.fog===!0&&de.refreshFogUniforms(ni,ue),de.refreshMaterialUniforms(ni,j,b,q,c.state.transmissionRenderTarget[E.id]),pl.upload(N,dh(be),ni,C)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(pl.upload(N,dh(be),ni,C),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&gt.setValue(N,"center",F.center),gt.setValue(N,"modelViewMatrix",F.modelViewMatrix),gt.setValue(N,"normalMatrix",F.normalMatrix),gt.setValue(N,"modelMatrix",F.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const Ln=j.uniformsGroups;for(let Oi=0,Bi=Ln.length;Oi<Bi;Oi++){const ph=Ln[Oi];U.update(ph,Vn),U.bind(ph,Vn)}}return Vn}function Pv(E,z){E.ambientLightColor.needsUpdate=z,E.lightProbe.needsUpdate=z,E.directionalLights.needsUpdate=z,E.directionalLightShadows.needsUpdate=z,E.pointLights.needsUpdate=z,E.pointLightShadows.needsUpdate=z,E.spotLights.needsUpdate=z,E.spotLightShadows.needsUpdate=z,E.rectAreaLights.needsUpdate=z,E.hemisphereLights.needsUpdate=z}function Lv(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return L},this.setRenderTargetTextures=function(E,z,Y){we.get(E.texture).__webglTexture=z,we.get(E.depthTexture).__webglTexture=Y;const j=we.get(E);j.__hasExternalTextures=!0,j.__autoAllocateDepthBuffer=Y===void 0,j.__autoAllocateDepthBuffer||Le.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),j.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(E,z){const Y=we.get(E);Y.__webglFramebuffer=z,Y.__useDefaultFramebuffer=z===void 0},this.setRenderTarget=function(E,z=0,Y=0){L=E,A=z,T=Y;let j=!0,F=null,ue=!1,ve=!1;if(E){const Ce=we.get(E);if(Ce.__useDefaultFramebuffer!==void 0)_e.bindFramebuffer(N.FRAMEBUFFER,null),j=!1;else if(Ce.__webglFramebuffer===void 0)C.setupRenderTarget(E);else if(Ce.__hasExternalTextures)C.rebindTextures(E,we.get(E.texture).__webglTexture,we.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){const Re=E.depthTexture;if(Ce.__boundDepthTexture!==Re){if(Re!==null&&we.has(Re)&&(E.width!==Re.image.width||E.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(E)}}const ke=E.texture;(ke.isData3DTexture||ke.isDataArrayTexture||ke.isCompressedArrayTexture)&&(ve=!0);const Be=we.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Be[z])?F=Be[z][Y]:F=Be[z],ue=!0):E.samples>0&&C.useMultisampledRTT(E)===!1?F=we.get(E).__webglMultisampledFramebuffer:Array.isArray(Be)?F=Be[Y]:F=Be,R.copy(E.viewport),I.copy(E.scissor),D=E.scissorTest}else R.copy(ee).multiplyScalar(b).floor(),I.copy(re).multiplyScalar(b).floor(),D=Ie;if(_e.bindFramebuffer(N.FRAMEBUFFER,F)&&j&&_e.drawBuffers(E,F),_e.viewport(R),_e.scissor(I),_e.setScissorTest(D),ue){const Ce=we.get(E.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+z,Ce.__webglTexture,Y)}else if(ve){const Ce=we.get(E.texture),ke=z||0;N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ce.__webglTexture,Y||0,ke)}w=-1},this.readRenderTargetPixels=function(E,z,Y,j,F,ue,ve){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ae=we.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ve!==void 0&&(Ae=Ae[ve]),Ae){_e.bindFramebuffer(N.FRAMEBUFFER,Ae);try{const Ce=E.texture,ke=Ce.format,Be=Ce.type;if(!De.textureFormatReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!De.textureTypeReadable(Be)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=E.width-j&&Y>=0&&Y<=E.height-F&&N.readPixels(z,Y,j,F,Ge.convert(ke),Ge.convert(Be),ue)}finally{const Ce=L!==null?we.get(L).__webglFramebuffer:null;_e.bindFramebuffer(N.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(E,z,Y,j,F,ue,ve){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ae=we.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&ve!==void 0&&(Ae=Ae[ve]),Ae){const Ce=E.texture,ke=Ce.format,Be=Ce.type;if(!De.textureFormatReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!De.textureTypeReadable(Be))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(z>=0&&z<=E.width-j&&Y>=0&&Y<=E.height-F){_e.bindFramebuffer(N.FRAMEBUFFER,Ae);const Re=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,Re),N.bufferData(N.PIXEL_PACK_BUFFER,ue.byteLength,N.STREAM_READ),N.readPixels(z,Y,j,F,Ge.convert(ke),Ge.convert(Be),0);const Qe=L!==null?we.get(L).__webglFramebuffer:null;_e.bindFramebuffer(N.FRAMEBUFFER,Qe);const ft=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await p1(N,ft,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,Re),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,ue),N.deleteBuffer(Re),N.deleteSync(ft),ue}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(E,z=null,Y=0){E.isTexture!==!0&&(Eo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),z=arguments[0]||null,E=arguments[1]);const j=Math.pow(2,-Y),F=Math.floor(E.image.width*j),ue=Math.floor(E.image.height*j),ve=z!==null?z.x:0,Ae=z!==null?z.y:0;C.setTexture2D(E,0),N.copyTexSubImage2D(N.TEXTURE_2D,Y,0,0,ve,Ae,F,ue),_e.unbindTexture()},this.copyTextureToTexture=function(E,z,Y=null,j=null,F=0){E.isTexture!==!0&&(Eo("WebGLRenderer: copyTextureToTexture function signature has changed."),j=arguments[0]||null,E=arguments[1],z=arguments[2],F=arguments[3]||0,Y=null);let ue,ve,Ae,Ce,ke,Be,Re,Qe,ft;const mt=E.isCompressedTexture?E.mipmaps[F]:E.image;Y!==null?(ue=Y.max.x-Y.min.x,ve=Y.max.y-Y.min.y,Ae=Y.isBox3?Y.max.z-Y.min.z:1,Ce=Y.min.x,ke=Y.min.y,Be=Y.isBox3?Y.min.z:0):(ue=mt.width,ve=mt.height,Ae=mt.depth||1,Ce=0,ke=0,Be=0),j!==null?(Re=j.x,Qe=j.y,ft=j.z):(Re=0,Qe=0,ft=0);const fn=Ge.convert(z.format),nt=Ge.convert(z.type);let be;z.isData3DTexture?(C.setTexture3D(z,0),be=N.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(C.setTexture2DArray(z,0),be=N.TEXTURE_2D_ARRAY):(C.setTexture2D(z,0),be=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,z.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,z.unpackAlignment);const gi=N.getParameter(N.UNPACK_ROW_LENGTH),it=N.getParameter(N.UNPACK_IMAGE_HEIGHT),Vn=N.getParameter(N.UNPACK_SKIP_PIXELS),Kr=N.getParameter(N.UNPACK_SKIP_ROWS),Sn=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,mt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,mt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Ce),N.pixelStorei(N.UNPACK_SKIP_ROWS,ke),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Be);const eo=E.isDataArrayTexture||E.isData3DTexture,gt=z.isDataArrayTexture||z.isData3DTexture;if(E.isRenderTargetTexture||E.isDepthTexture){const ni=we.get(E),to=we.get(z),Ln=we.get(ni.__renderTarget),Oi=we.get(to.__renderTarget);_e.bindFramebuffer(N.READ_FRAMEBUFFER,Ln.__webglFramebuffer),_e.bindFramebuffer(N.DRAW_FRAMEBUFFER,Oi.__webglFramebuffer);for(let Bi=0;Bi<Ae;Bi++)eo&&N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,we.get(E).__webglTexture,F,Be+Bi),E.isDepthTexture?(gt&&N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,we.get(z).__webglTexture,F,ft+Bi),N.blitFramebuffer(Ce,ke,ue,ve,Re,Qe,ue,ve,N.DEPTH_BUFFER_BIT,N.NEAREST)):gt?N.copyTexSubImage3D(be,F,Re,Qe,ft+Bi,Ce,ke,ue,ve):N.copyTexSubImage2D(be,F,Re,Qe,ft+Bi,Ce,ke,ue,ve);_e.bindFramebuffer(N.READ_FRAMEBUFFER,null),_e.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else gt?E.isDataTexture||E.isData3DTexture?N.texSubImage3D(be,F,Re,Qe,ft,ue,ve,Ae,fn,nt,mt.data):z.isCompressedArrayTexture?N.compressedTexSubImage3D(be,F,Re,Qe,ft,ue,ve,Ae,fn,mt.data):N.texSubImage3D(be,F,Re,Qe,ft,ue,ve,Ae,fn,nt,mt):E.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,F,Re,Qe,ue,ve,fn,nt,mt.data):E.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,F,Re,Qe,mt.width,mt.height,fn,mt.data):N.texSubImage2D(N.TEXTURE_2D,F,Re,Qe,ue,ve,fn,nt,mt);N.pixelStorei(N.UNPACK_ROW_LENGTH,gi),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,it),N.pixelStorei(N.UNPACK_SKIP_PIXELS,Vn),N.pixelStorei(N.UNPACK_SKIP_ROWS,Kr),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Sn),F===0&&z.generateMipmaps&&N.generateMipmap(be),_e.unbindTexture()},this.copyTextureToTexture3D=function(E,z,Y=null,j=null,F=0){return E.isTexture!==!0&&(Eo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),Y=arguments[0]||null,j=arguments[1]||null,E=arguments[2],z=arguments[3],F=arguments[4]||0),Eo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(E,z,Y,j,F)},this.initRenderTarget=function(E){we.get(E).__webglFramebuffer===void 0&&C.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?C.setTextureCube(E,0):E.isData3DTexture?C.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?C.setTexture2DArray(E,0):C.setTexture2D(E,0),_e.unbindTexture()},this.resetState=function(){A=0,T=0,L=null,_e.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return bi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Ke._getDrawingBufferColorSpace(e),t.unpackColorSpace=Ke._getUnpackColorSpace()}}class rh{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new je(e),this.near=t,this.far=i}clone(){return new rh(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class C2 extends Vt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new pi,this.environmentIntensity=1,this.environmentRotation=new pi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class sh extends yr{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let u=0;const f=[],h=new H,d=new H,p=[],v=[],x=[],m=[];for(let c=0;c<=i;c++){const g=[],_=c/i;let S=0;c===0&&o===0?S=.5/t:c===i&&l===Math.PI&&(S=-.5/t);for(let P=0;P<=t;P++){const A=P/t;h.x=-e*Math.cos(r+A*s)*Math.sin(o+_*a),h.y=e*Math.cos(o+_*a),h.z=e*Math.sin(r+A*s)*Math.sin(o+_*a),v.push(h.x,h.y,h.z),d.copy(h).normalize(),x.push(d.x,d.y,d.z),m.push(A+S,1-_),g.push(u++)}f.push(g)}for(let c=0;c<i;c++)for(let g=0;g<t;g++){const _=f[c][g+1],S=f[c][g],P=f[c+1][g],A=f[c+1][g+1];(c!==0||o>0)&&p.push(_,S,A),(c!==i-1||l<Math.PI)&&p.push(S,P,A)}this.setIndex(p),this.setAttribute("position",new hi(v,3)),this.setAttribute("normal",new hi(x,3)),this.setAttribute("uv",new hi(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new sh(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class nn extends aa{static get type(){return"MeshLambertMaterial"}constructor(e){super(),this.isMeshLambertMaterial=!0,this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=lv,this.normalScale=new tt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new pi,this.combine=qd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class oh extends Vt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class R2 extends oh{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const dc=new Et,Pm=new H,Lm=new H;class Cv{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new tt(512,512),this.map=null,this.mapPass=null,this.matrix=new Et,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new nh,this._frameExtents=new tt(1,1),this._viewportCount=1,this._viewports=[new at(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Pm.setFromMatrixPosition(e.matrixWorld),t.position.copy(Pm),Lm.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Lm),t.updateMatrixWorld(),dc.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(dc),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(dc)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Dm=new Et,_o=new H,hc=new H;class b2 extends Cv{constructor(){super(new wn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new tt(4,2),this._viewportCount=6,this._viewports=[new at(2,1,1,1),new at(0,1,1,1),new at(3,1,1,1),new at(1,1,1,1),new at(3,0,1,1),new at(1,0,1,1)],this._cubeDirections=[new H(1,0,0),new H(-1,0,0),new H(0,0,1),new H(0,0,-1),new H(0,1,0),new H(0,-1,0)],this._cubeUps=[new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,1,0),new H(0,0,1),new H(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),_o.setFromMatrixPosition(e.matrixWorld),i.position.copy(_o),hc.copy(i.position),hc.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(hc),i.updateMatrixWorld(),r.makeTranslation(-_o.x,-_o.y,-_o.z),Dm.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Dm)}}class P2 extends oh{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new b2}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class L2 extends Cv{constructor(){super(new Sv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class D2 extends oh{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Vt.DEFAULT_UP),this.updateMatrix(),this.target=new Vt,this.shadow=new L2}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:jd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=jd);const $a=14267791,I2=4478318,U2=2898e3,N2=11570519,z2=9071168;function Lt(n,e,t,i,r){const s=new ht(new rn(n,e,t),r??new nn({color:i}));return s.castShadow=!0,s}function F2(n){const e=new lt,t=n==="CT"?I2:N2,i=n==="CT"?U2:z2,r=new nn({color:t}),s=new nn({color:i}),o=new nn({color:$a}),a=new nn({color:i}),l=new lt;l.position.set(0,.9,0),e.add(l);const u=Lt(.3,.2,.2,i,s);u.position.y=.12,l.add(u);const f=Lt(.42,.42,.24,t,r);f.position.y=.42,l.add(f);const h=Lt(.44,.2,.26,n==="CT"?2042429:7033392,s);h.position.y=.4,l.add(h);const d=new lt;d.position.set(0,.72,0),l.add(d);const p=Lt(.24,.24,.24,$a,o);if(p.position.y=.13,d.add(p),n==="CT"){const re=Lt(.28,.14,.3,i,s);re.position.y=.29,d.add(re)}else{const re=Lt(.26,.09,.26,8019002);re.position.y=.26,d.add(re);const Ie=Lt(.1,.1,.16,8019002);Ie.position.set(0,.24,-.18),d.add(Ie)}const v=new lt;v.position.set(-.27,.62,0),l.add(v);const x=Lt(.1,.3,.12,t,r);x.position.y=-.15,v.add(x);const m=new lt;m.position.y=-.3,v.add(m);const c=Lt(.09,.28,.1,t,r);c.position.y=-.14,m.add(c);const g=Lt(.08,.08,.08,$a,o);g.position.y=-.3,m.add(g);const _=new lt;_.position.set(.27,.62,0),l.add(_);const S=Lt(.1,.3,.12,t,r);S.position.y=-.15,_.add(S);const P=new lt;P.position.y=-.3,_.add(P);const A=Lt(.09,.28,.1,t,r);A.position.y=-.14,P.add(A);const T=Lt(.08,.08,.08,$a,o);T.position.y=-.3,P.add(T);const L=new lt;L.position.set(-.11,.88,0),e.add(L);const w=Lt(.13,.44,.14,i,a);w.position.y=-.22,L.add(w);const y=new lt;y.position.y=-.44,L.add(y);const R=Lt(.11,.4,.12,i,a);R.position.y=-.2,y.add(R);const I=Lt(.11,.1,.24,i,a);I.position.set(0,-.42,.06),y.add(I);const D=new lt;D.position.set(.11,.88,0),e.add(D);const G=Lt(.13,.44,.14,i,a);G.position.y=-.22,D.add(G);const W=new lt;W.position.y=-.44,D.add(W);const B=Lt(.11,.4,.12,i,a);B.position.y=-.2,W.add(B);const q=Lt(.11,.1,.24,i,a);q.position.set(0,-.42,.06),W.add(q);const b=new lt;b.position.set(.08,.42,.14),l.add(b);const k={};for(const re of["ak47","m4a4","awp","glock","usp","deagle"]){const Ie=k2(re);Ie.visible=!1,b.add(Ie),k[re]=Ie}const V=Rv();V.position.set(-.12,.34,-.16),V.visible=!1,l.add(V);const ee=Lt(.02,.02,.02,n==="CT"?6728447:16755268);return ee.position.set(0,.45,0),ee.visible=!1,l.add(ee),_.rotation.x=-1.25,v.rotation.x=-1.05,v.rotation.z=.25,{group:e,torso:l,head:d,armL:v,armR:_,foreL:m,foreR:P,legL:L,legR:D,shinL:y,shinR:W,weaponGroup:b,weaponMeshes:k,bombMesh:V,headlight:ee}}function k2(n){const e=new lt,t=new nn({color:3356735}),i=new nn({color:1842979}),r=new nn({color:9067060}),s=new nn({color:3951162}),o=(a,l,u,f,h=0,d=0,p=0)=>{const v=new ht(new rn(a,l,u),f);return v.position.set(h,d,p),v.castShadow=!0,e.add(v),v};return n==="ak47"?(o(.06,.09,.42,t,0,.02,-.05),o(.05,.08,.16,r,0,-.02,.2),o(.06,.09,.16,r,0,-.05,.28),o(.04,.1,.1,i,0,-.08,.05),o(.03,.03,.3,t,0,.07,-.22),o(.035,.05,.04,i,0,.1,.02)):n==="m4a4"?(o(.06,.09,.4,t,0,.02,-.04),o(.05,.08,.2,i,0,-.02,.16),o(.05,.07,.2,i,0,-.03,.26),o(.04,.12,.08,i,0,-.09,.04),o(.03,.03,.3,t,0,.07,-.2),o(.06,.05,.08,i,0,.12,-.08)):n==="awp"?(o(.06,.09,.46,s,0,.02,-.02),o(.05,.08,.18,i,0,-.02,.24),o(.03,.03,.4,t,0,.06,-.28),o(.05,.05,.16,i,0,.11,-.02),o(.04,.08,.08,i,0,-.07,.08)):n==="glock"?(o(.05,.08,.2,i,0,.02,0),o(.04,.04,.1,t,0,.06,-.13),o(.05,.1,.06,i,0,-.07,.03)):n==="usp"?(o(.05,.08,.22,i,0,.02,0),o(.04,.04,.12,t,0,.06,-.14),o(.05,.1,.06,i,0,-.07,.04)):n==="deagle"&&(o(.06,.09,.26,t,0,.02,0),o(.05,.05,.14,t,0,.06,-.16),o(.06,.12,.07,i,0,-.08,.04)),e.rotation.x=-Math.PI/2,e.position.set(.1,-.06,.24),e}function Rv(){const n=new lt,e=new ht(new rn(.28,.22,.4),new nn({color:4872762}));e.castShadow=!0,n.add(e);const t=new ht(new rn(.06,.06,.06),new nn({color:16724787,emissive:16720418,emissiveIntensity:1}));return t.position.set(.1,.08,.12),n.add(t),n}function Qf(n){return new nn({color:n})}function dt(n,e,t,i,r,s,o=0,a=0,l=0){const u=new ht(new rn(t,i,r),Qf(s));return u.position.set(o,a,l),u.name=e,n.add(u),u}function O2(n){const e=new lt,t=[],i=(o,a)=>(t.push({name:o,obj:a}),a),r=new Vt,s=new ht(new Pi(.16,.16),new er({color:16769162,transparent:!0,opacity:.9,side:li,depthWrite:!1}));if(s.visible=!1,e.add(r),r.add(s),n==="ak47"){i("receiver",dt(e,"receiver",.07,.1,.4,3817286,0,.02,.05)),i("barrel",dt(e,"barrel",.035,.035,.3,2764339,0,.075,-.3)),i("wood",dt(e,"wood",.06,.09,.18,9067060,0,-.01,-.24)),i("stock",dt(e,"stock",.06,.1,.18,9067060,0,-.04,.33));const o=new lt;o.position.set(0,-.09,.02),i("mag",dt(o,"magmesh",.05,.14,.09,5916210,0,0,.02)),i("maggroup",o),i("sight",dt(e,"sight",.03,.05,.02,2237994,0,.1,-.32)),r.position.set(0,.075,-.45)}else if(n==="m4a4"){i("receiver",dt(e,"receiver",.07,.1,.42,3356735,0,.02,.03)),i("barrel",dt(e,"barrel",.035,.035,.28,2764339,0,.075,-.28)),i("hand",dt(e,"hand",.06,.09,.2,1842979,0,-.01,-.22)),i("stock",dt(e,"stock",.06,.08,.22,1842979,0,-.03,.32));const o=new lt;o.position.set(0,-.09,.02),i("mag",dt(o,"magmesh",.05,.15,.08,1842979,0,0,.02)),i("maggroup",o),i("carry",dt(e,"carry",.05,.04,.09,1842979,0,.11,-.08)),r.position.set(0,.075,-.43)}else if(n==="awp"){i("receiver",dt(e,"receiver",.07,.1,.48,3951162,0,.02,.02)),i("barrel",dt(e,"barrel",.04,.04,.4,2764339,0,.075,-.4)),i("stock",dt(e,"stock",.06,.08,.2,2237983,0,-.03,.34)),i("scope",dt(e,"scope",.05,.05,.18,1119e3,0,.12,-.05));const o=new lt;o.position.set(0,-.09,.04),i("mag",dt(o,"magmesh",.05,.1,.08,2237983,0,0,.02)),i("maggroup",o),r.position.set(0,.075,-.62)}else if(n==="glock"||n==="usp"){const o=n==="glock"?2895667:3817286;i("slide",dt(e,"slide",.055,.07,.24,o,0,.06,0)),i("frame",dt(e,"frame",.06,.12,.1,o,0,-.045,.06)),i("barrel",dt(e,"barrel",.035,.035,.05,2237994,0,.06,-.15)),r.position.set(0,.06,-.16)}else n==="deagle"?(i("slide",dt(e,"slide",.065,.08,.3,5593955,0,.06,0)),i("frame",dt(e,"frame",.07,.14,.1,3356735,0,-.05,.06)),i("barrel",dt(e,"barrel",.04,.04,.08,2237994,0,.06,-.2)),r.position.set(0,.06,-.22)):(i("blade",dt(e,"blade",.03,.06,.22,12106946,0,.08,-.1)),i("guard",dt(e,"guard",.08,.02,.02,2895667,0,.05,.02)),i("handle",dt(e,"handle",.04,.04,.12,3813154,0,.05,.08)),r.position.set(0,.08,-.22));return e.traverse(o=>{o.isMesh&&(o.castShadow=!1)}),{group:e,muzzle:r,flash:s,magGroup:t.find(o=>o.name==="maggroup")?.obj,parts:t}}function B2(){const n=new lt,e=new ht(new rn(.3,.22,.42),Qf(4872762));n.add(e);const t=new ht(new rn(.16,.14,.02),Qf(1842979));t.position.set(0,.12,.1),n.add(t);const i=new ht(new rn(.06,.06,.06),new nn({color:16724787,emissive:16720418,emissiveIntensity:1}));return i.position.set(.1,.1,.15),n.add(i),n}const H2=10470622,V2=9407090,G2=12175048;class W2{constructor(e,t){ye(this,"renderer");ye(this,"scene");ye(this,"camera");ye(this,"game");ye(this,"wrap",new Map);ye(this,"viewmodels",new Map);ye(this,"vmHolder");ye(this,"vmBomb");ye(this,"doorGroup");ye(this,"doorRot",0);ye(this,"bombMesh");ye(this,"bombLight");ye(this,"tracers",[]);ye(this,"bloods",[]);ye(this,"flashes",[]);ye(this,"explosion");ye(this,"explosionLight");ye(this,"explosionT",-1);ye(this,"sun");ye(this,"camShake",0);ye(this,"shakeX",0);ye(this,"shakeY",0);ye(this,"time",0);ye(this,"fog");this.game=t,this.renderer=new A2({canvas:e,antialias:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Kg,this.scene=new C2,this.scene.background=new je(H2),this.fog=new rh(G2,40,140),this.scene.fog=this.fog,this.camera=new wn(75,1,.08,300),this.camera.rotation.order="YXZ",this.scene.add(this.camera);const i=new R2(13624562,7168848,.85);this.scene.add(i),this.sun=new D2(16773590,1.35),this.sun.position.set(40,70,20),this.sun.castShadow=!0,this.sun.shadow.mapSize.set(2048,2048),this.sun.shadow.camera.left=-90,this.sun.shadow.camera.right=90,this.sun.shadow.camera.top=90,this.sun.shadow.camera.bottom=-90,this.sun.shadow.camera.far=260,this.sun.shadow.bias=-4e-4,this.scene.add(this.sun),this.scene.add(this.sun.target),this.buildWorld(),this.vmHolder=new lt,this.camera.add(this.vmHolder),this.vmBomb=B2(),this.vmBomb.visible=!1,this.vmHolder.add(this.vmBomb),this.explosion=new ht(new sh(1,20,16),new er({color:16752704,transparent:!0,opacity:.9,depthWrite:!1})),this.explosion.visible=!1,this.scene.add(this.explosion),this.explosionLight=new P2(16747056,0,40),this.scene.add(this.explosionLight)}buildWorld(){for(const o of Sy){const a=o.x1-o.x0,l=o.y1-o.y0,u=o.z1-o.z0;if(a<=.001||l<=.001||u<=.001)continue;const f=new ht(new rn(a,l,u),new nn({color:new je(o.color)}));f.position.set((o.x0+o.x1)/2,(o.y0+o.y1)/2,(o.z0+o.z1)/2),f.castShadow=!o.step,f.receiveShadow=!0,this.scene.add(f)}const e=new ht(new Pi(240,240),new nn({color:V2}));e.rotation.x=-Math.PI/2,e.position.set(3,-.06,0),e.receiveShadow=!0,this.scene.add(e);for(const o of["A","B"]){const a=qg[o],l=new ht(new Pi(a.x1-a.x0,a.z1-a.z0),new er({color:o==="A"?12819018:4881091,transparent:!0,opacity:.35,depthWrite:!1}));l.rotation.x=-Math.PI/2,l.position.set((a.x0+a.x1)/2,1.205,(a.z0+a.z1)/2),this.scene.add(l)}this.doorGroup=new lt;const t=new nn({color:new je(Yt.color)});for(const o of vy){const a=new lt,l=o.x1-o.x0,u=new ht(new rn(l,Yt.y1-Yt.y0,.09),t);u.position.set(l/2,(Yt.y0+Yt.y1)/2,0),u.castShadow=!0,a.add(u),a.position.set(o.x0,0,(Yt.z0+Yt.z1)/2),this.doorGroup.add(a),a.userData.hinge=o.hinge,this.doorGroup.userData.pivots=this.doorGroup.userData.pivots||[],this.doorGroup.userData.pivots.push(a)}this.scene.add(this.doorGroup),this.bombMesh=Rv(),this.bombLight=this.bombMesh.children[1],this.bombMesh.visible=!1,this.scene.add(this.bombMesh);for(const o of this.game.combatants)this.addCombatant(o);const i=new er({color:16767370,transparent:!0,opacity:.85,depthWrite:!1});for(let o=0;o<48;o++){const a=new ht(new rn(.022,.022,1),i);a.visible=!1,this.scene.add(a),this.tracers.push({mesh:a,life:0,max:.09})}const r=new er({color:11543064,transparent:!0,opacity:.9,depthWrite:!1});for(let o=0;o<48;o++){const a=new ht(new Pi(.16,.16),r);a.visible=!1,this.scene.add(a),this.bloods.push({mesh:a,life:0})}const s=new er({color:16771232,transparent:!0,opacity:.95,depthWrite:!1});for(let o=0;o<24;o++){const a=new ht(new Pi(.3,.3),s);a.visible=!1,this.scene.add(a),this.flashes.push({mesh:a,life:0})}}addCombatant(e){const t=F2(e.team),i=new lt;i.add(t.group),this.scene.add(i),this.wrap.set(e.id,{wrap:i,humanoid:t,lastY:e.pos.y,deadT:0})}reset(e){for(const[,t]of this.wrap)this.scene.remove(t.wrap);this.wrap.clear();for(const t of e.combatants)this.addCombatant(t);this.game=e,this.bombMesh.visible=!1,this.vmHolder.visible=!1,this.doorRot=0,this.explosionT=-1,this.explosion.visible=!1,this.explosionLight.intensity=0,this.camShake=0}resize(e,t){this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}curWeapon(e){const t=e.slots[e.curSlot];return t?af[t]:null}getViewmodel(e){let t=this.viewmodels.get(e);return t||(t=O2(e),this.viewmodels.set(e,t),this.vmHolder.add(t.group),t.group.visible=!1),t}addShake(e){this.camShake=Math.min(.6,this.camShake+e)}spawnEffects(e,t){const i=Math.random;for(const r of e)switch(r.type){case"tracer":{const s=r.x,o=r.y??0,a=r.z??0,l=r.x2,u=r.y2??o,f=r.z2;if(s===void 0||l===void 0||f===void 0)break;const h=this.tracers.find(m=>m.life<=0)??this.tracers[0],d=l-s,p=u-o,v=f-a,x=Math.hypot(d,p,v)||1;h.mesh.scale.set(1,1,x),h.mesh.position.set(s+d/2,o+p/2,a+v/2),h.mesh.lookAt(l,u,f),h.mesh.visible=!0,h.life=h.max;break}case"blood":{if(r.x===void 0)break;const s=this.bloods.find(o=>o.life<=0)??this.bloods[0];s.mesh.position.set(r.x,r.y??1.2,r.z??0),s.mesh.rotation.set(i()*Math.PI,i()*Math.PI,0),s.mesh.visible=!0,s.life=.5;break}case"muzzle":{if(r.x===void 0)break;const s=this.flashes.find(o=>o.life<=0)??this.flashes[0];s.mesh.position.set(r.x,r.y??1.5,r.z??0),s.mesh.rotation.z=i()*Math.PI,s.mesh.visible=!0,s.life=.06;break}case"explosion":{r.x!==void 0&&(this.explosion.position.set(r.x,r.y??1,r.z??0),this.explosionLight.position.set(r.x,(r.y??1)+1.5,r.z??0),this.explosion.visible=!0,this.explosionT=0,this.addShake(.5));break}}if(t){const r=this.curWeapon(t);if(r&&t.anim.fireFlash>0){const s=this.getViewmodel(r.id);s&&(s.flash.visible=t.anim.fireFlash>0)}}}frame(e,t,i){this.time+=e;const r=this.game,s=r.viewCombatant(),o=s!==null&&s.isPlayer&&s.alive,a=r.combatants[r.playerIdx]??null,l=r.doorOpen?1.25:0;this.doorRot+=(l-this.doorRot)*Math.min(1,e*6);const u=this.doorGroup.userData.pivots??[];for(const c of u)c.rotation.y=c.userData.hinge===-1?-this.doorRot:this.doorRot;for(const c of r.combatants){const g=this.wrap.get(c.id);if(!g)continue;g.wrap.visible=!(c.isPlayer&&c.alive),g.wrap.position.set(c.pos.x,c.pos.y,c.pos.z),g.wrap.rotation.y=c.yaw;const _=g.humanoid;if(c.alive){_.group.rotation.x=0,_.group.position.y=0,g.deadT=0;const S=c.anim.speed,P=Math.min(1,S/5)*.7,A=c.anim.movePhase;_.legL.rotation.x=Math.sin(A)*P,_.legR.rotation.x=-Math.sin(A)*P,_.shinL.rotation.x=Math.max(0,-Math.sin(A))*P*.8,_.shinR.rotation.x=Math.max(0,Math.sin(A))*P*.8,_.armL.rotation.x=.4*P*Math.sin(A+Math.PI),_.armR.rotation.x=-.4*P*Math.sin(A+Math.PI),_.torso.rotation.x=c.pitch*.75;const T=Math.max(c.anim.crouch,c.anim.state==="plant"||c.anim.state==="defuse"?1:0);_.group.scale.y=1-T*.22,_.group.position.y=-T*.32,_.headlight.visible=!1}else g.deadT=Math.min(1,g.deadT+e*2.5),_.group.rotation.x=-g.deadT*Math.PI*.5,_.group.scale.y=1,_.group.position.y=0,_.headlight.visible=c.team!==r.combatants[r.playerIdx]?.team;c.alive&&c.team===(a?a.team:"T")&&!c.isPlayer&&(_.headlight.visible=!0)}const f=r.bomb;if(f.state==="carried"){const c=r.combatants.find(g=>g.id===f.carrierId);c&&(this.bombMesh.visible=!0,this.bombMesh.position.set(c.pos.x+Math.sin(c.yaw)*.22,c.pos.y+1.05,c.pos.z+Math.cos(c.yaw)*.22),this.bombMesh.rotation.y=c.yaw,this.bombLight.material.emissiveIntensity=.15)}else{this.bombMesh.visible=!0,this.bombMesh.position.set(f.x,f.y,f.z),this.bombMesh.rotation.y+=e*.5;const c=f.state==="planted"&&Math.sin(this.time*8)>0;this.bombLight.material.emissiveIntensity=c?2.2:.6}this.spawnEffects(i,a),this.updateEffects(e);let h=s?{x:s.pos.x,y:s.pos.y+1.62,z:s.pos.z}:{x:0,y:1.6,z:0},d=s?s.yaw:0,p=s?s.pitch:0;if(!s)h={x:0,y:18,z:-20},d=0,p=-.6;else if(!o){const g=-Math.sin(s.yaw),_=-Math.cos(s.yaw);h={x:s.pos.x-g*3.4,y:s.pos.y+1.9,z:s.pos.z-_*3.4},d=s.yaw,p=Math.atan2(s.pos.y+1.4-h.y,3.4)}this.camShake>0?(this.camShake=Math.max(0,this.camShake-e*2.2),this.shakeX=(Math.random()-.5)*this.camShake*.5,this.shakeY=(Math.random()-.5)*this.camShake*.5):(this.shakeX=0,this.shakeY=0),this.camera.position.set(h.x+this.shakeX,h.y+this.shakeY,h.z),this.camera.rotation.y=d,this.camera.rotation.x=p;const v=s?this.curWeapon(s):null,x=75;let m=x;if(v&&v.id==="awp"&&s&&s.zoom>0&&v.zoomFovs){const c=v.zoomFovs[Math.min(s.zoom,v.zoomFovs.length-1)];m+=(c-m)*Math.min(1,e*14)}else m+=(x-m)*Math.min(1,e*10);if(Math.abs(m-this.camera.fov)>.01&&(this.camera.fov=m,this.camera.updateProjectionMatrix()),o&&s){this.vmHolder.visible=!0;const c=this.curWeapon(s),g=c?this.getViewmodel(c.id):null;for(const _ of this.viewmodels.values())_.group.visible=!1;if(g&&(g.group.visible=!0,g.group.visible=s.curSlot!=="bomb"),this.vmBomb.visible=s.curSlot==="bomb"&&s.carriesBomb,g){const _=s.recoil,S=Math.sin(this.time*1.7)*.004,P=Math.cos(this.time*1.3)*.003,A=Math.hypot(s.vel.x,s.vel.z);g.group.position.set(.24+S+Math.min(.04,A*.006)*Math.sin(this.time*9),-.24+P+Math.min(.04,A*.006)*Math.cos(this.time*8),-.42+_*.02),g.group.rotation.set(_*.03,0,0),g.flash.visible=s.anim.fireFlash>0,s.reloading&&(g.group.rotation.x+=.7,g.group.position.y-=.08)}v&&v.id==="awp"&&s.zoom>0&&(this.vmHolder.visible=!1)}else this.vmHolder.visible=!1;this.renderer.render(this.scene,this.camera)}updateEffects(e){for(const t of this.tracers)t.life>0&&(t.life-=e,t.mesh.material.opacity=Math.max(0,t.life/t.max)*.85,t.life<=0&&(t.mesh.visible=!1));for(const t of this.bloods)t.life>0&&(t.life-=e,t.mesh.material.opacity=Math.max(0,t.life/.5)*.9,t.mesh.position.y-=e*.3,t.life<=0&&(t.mesh.visible=!1));for(const t of this.flashes)t.life>0&&(t.life-=e,t.mesh.material.opacity=Math.max(0,t.life/.06),t.life<=0&&(t.mesh.visible=!1));if(this.explosionT>=0){this.explosionT+=e;const t=this.explosionT/.8;if(t>=1)this.explosion.visible=!1,this.explosionLight.intensity=0,this.explosionT=-1;else{const i=1+t*9;this.explosion.scale.setScalar(i),this.explosion.material.opacity=Math.max(0,1-t),this.explosionLight.intensity=(1-t)*22}}}dispose(){this.renderer.dispose()}}const Im=-60,X2=66,Um=-60,Y2=60;function j2({hud:n}){const e=Dt.useRef(null);return Dt.useEffect(()=>{const t=e.current;if(!t)return;const i=t.getContext("2d");if(!i)return;const r=t.width,s=t.height,o=r/(X2-Im),a=s/(Y2-Um),l=v=>(v-Im)*o,u=v=>(v-Um)*a;i.clearRect(0,0,r,s),i.fillStyle="rgba(20,22,28,0.72)",i.fillRect(0,0,r,s);for(const v of Cp.floors)i.fillStyle="rgba(150,140,115,0.5)",i.fillRect(l(v.x0),u(v.z0),(v.x1-v.x0)*o,(v.z1-v.z0)*a);for(const v of Cp.walls)i.fillStyle="rgba(235,225,200,0.75)",i.fillRect(l(v.x0),u(v.z0),(v.x1-v.x0)*o,(v.z1-v.z0)*a);i.fillStyle="rgba(240,180,60,0.35)",i.fillRect(l(-58),u(-58),36*o,26*a),i.fillStyle="rgba(90,140,240,0.35)",i.fillRect(l(29),u(-46),29*o,20*a);const f=n.minimap.bomb;f&&(i.fillStyle=f.planted?"#ff4030":"#ffd24a",i.beginPath(),i.arc(l(f.x),u(f.z),4,0,Math.PI*2),i.fill());for(const v of n.minimap.teammates)i.fillStyle="#58c06a",i.beginPath(),i.arc(l(v.x),u(v.z),3.2,0,Math.PI*2),i.fill();for(const v of n.minimap.enemies)i.fillStyle="#e04848",i.beginPath(),i.arc(l(v.x),u(v.z),3.2,0,Math.PI*2),i.fill();const h=l(n.minimap.px),d=u(n.minimap.pz),p=Math.atan2(-Math.cos(n.minimap.pyaw)*a,-Math.sin(n.minimap.pyaw)*o);i.save(),i.translate(h,d),i.rotate(p),i.fillStyle="#ffffff",i.beginPath(),i.moveTo(6,0),i.lineTo(-4,4.5),i.lineTo(-2,0),i.lineTo(-4,-4.5),i.closePath(),i.fill(),i.restore()},[n]),ae.jsx("canvas",{ref:e,width:200,height:200,style:{width:200,height:200,imageRendering:"pixelated"}})}const Ka={height:12,borderRadius:3,transition:"width 0.15s"};function q2({hud:n,onCycleSpec:e,onTakeover:t}){const i=7+n.spread*420,r=n.zoom>0;return ae.jsxs("div",{style:{position:"absolute",inset:0,pointerEvents:"none",userSelect:"none",color:"#e8e8e8",fontFamily:"system-ui, sans-serif"},children:[n.hurtFlash>0&&ae.jsx("div",{style:{position:"absolute",inset:0,background:`radial-gradient(ellipse at center, transparent 40%, rgba(200,30,20,${Math.min(.55,n.hurtFlash)}) 100%)`}}),ae.jsxs("div",{style:{position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",display:"flex",gap:18,alignItems:"center",background:"rgba(10,12,16,0.55)",padding:"6px 18px",borderRadius:6},children:[ae.jsxs("span",{style:{fontWeight:700},children:["T ",ae.jsx("b",{style:{color:"#ffcf6e"},children:n.scoreT})," : ",ae.jsx("b",{style:{color:"#7ea8ff"},children:n.scoreCT})," CT"]}),ae.jsx("span",{style:{fontSize:22,fontVariantNumeric:"tabular-nums",fontWeight:700},children:n.timerLabel}),ae.jsxs("span",{style:{fontSize:12,opacity:.8},children:["回合 ",n.roundNum]})]}),ae.jsxs("div",{style:{position:"absolute",top:12,left:12,display:"flex",gap:8,background:"rgba(10,12,16,0.55)",padding:"6px 12px",borderRadius:6,fontSize:12},children:[ae.jsxs("span",{style:{color:"#ffcf6e"},children:["T ",n.playersAlive.t]}),ae.jsxs("span",{style:{color:"#7ea8ff"},children:["CT ",n.playersAlive.ct]})]}),ae.jsx("div",{style:{position:"absolute",top:12,right:12,border:"2px solid rgba(255,255,255,0.25)",borderRadius:6,overflow:"hidden"},children:ae.jsx(j2,{hud:n})}),ae.jsx("div",{style:{position:"absolute",top:64,right:12,display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"},children:n.killfeed.map(s=>ae.jsxs("div",{style:{background:"rgba(10,12,16,0.6)",padding:"3px 10px",borderRadius:4,fontSize:13,animation:"kf-fade 5s linear forwards"},children:[s.headshot&&ae.jsx("span",{style:{color:"#ff8a6e"},children:"☠ "}),ae.jsx("span",{style:{color:s.team==="T"?"#ffcf6e":"#7ea8ff"},children:s.text})]},`${s.t}-${s.text}`))}),ae.jsxs("div",{style:{position:"absolute",bottom:16,left:16,width:260},children:[ae.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:6},children:[ae.jsxs("span",{style:{fontSize:18,fontWeight:700,width:58,textAlign:"right"},children:["❤ ",n.hp]}),ae.jsx("div",{style:{flex:1,background:"rgba(0,0,0,0.5)",...Ka},children:ae.jsx("div",{style:{width:`${n.hp}%`,background:n.hp>30?"#d6483a":"#a02014",...Ka}})})]}),ae.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8,marginBottom:10},children:[ae.jsxs("span",{style:{fontSize:13,width:58,textAlign:"right",opacity:.85},children:["🛡 ",n.armor]}),ae.jsx("div",{style:{flex:1,background:"rgba(0,0,0,0.5)",...Ka},children:ae.jsx("div",{style:{width:`${n.armor}%`,background:"#3f6fb8",...Ka}})})]}),ae.jsx("div",{style:{fontSize:14,opacity:.9},children:n.weaponName}),ae.jsxs("div",{style:{fontSize:22,fontVariantNumeric:"tabular-nums",fontWeight:700},children:[n.mag," ",ae.jsxs("span",{style:{fontSize:13,opacity:.7,fontWeight:400},children:["/ ",n.reserve]})]}),ae.jsx("div",{style:{display:"flex",gap:6,marginTop:6},children:n.slots.map(s=>ae.jsx("div",{style:{padding:"3px 8px",borderRadius:4,fontSize:12,background:s.cur?"rgba(255,255,255,0.28)":"rgba(0,0,0,0.4)",opacity:s.has?1:.35,border:s.cur?"1px solid rgba(255,255,255,0.7)":"1px solid transparent"},children:s.label},s.key))})]}),ae.jsxs("div",{style:{position:"absolute",bottom:18,left:"50%",transform:"translateX(-50%)",textAlign:"center"},children:[n.interact&&ae.jsxs("div",{style:{marginBottom:6,fontSize:15,fontWeight:600},children:[n.interact.label,n.interact.progress>0&&ae.jsx("div",{style:{width:160,height:6,background:"rgba(0,0,0,0.5)",margin:"6px auto 0",borderRadius:3},children:ae.jsx("div",{style:{width:`${Math.min(1,n.interact.progress)*100}%`,height:6,background:"#ffd24a",borderRadius:3}})})]}),ae.jsx("div",{style:{fontSize:13,opacity:.75},children:n.siteHint})]}),!r&&ae.jsxs("div",{style:{position:"absolute",left:"50%",top:"50%",width:0,height:0},children:[ae.jsx("div",{style:{position:"absolute",width:2,height:10,background:"#7df07d",left:-1,top:-10-i}}),ae.jsx("div",{style:{position:"absolute",width:2,height:10,background:"#7df07d",left:-1,top:i}}),ae.jsx("div",{style:{position:"absolute",width:10,height:2,background:"#7df07d",top:-1,left:-10-i}}),ae.jsx("div",{style:{position:"absolute",width:10,height:2,background:"#7df07d",top:-1,left:i}}),n.hitmarkerT>0&&ae.jsxs("div",{style:{position:"absolute",left:-9,top:-9,width:18,height:18},children:[ae.jsx("div",{style:{position:"absolute",width:2,height:8,background:n.hitHead?"#ff5040":"#ffffff",transform:"rotate(45deg)",left:8,top:5}}),ae.jsx("div",{style:{position:"absolute",width:2,height:8,background:n.hitHead?"#ff5040":"#ffffff",transform:"rotate(-45deg)",left:8,top:5}}),ae.jsx("div",{style:{position:"absolute",width:2,height:8,background:n.hitHead?"#ff5040":"#ffffff",transform:"rotate(135deg)",left:8,top:5}}),ae.jsx("div",{style:{position:"absolute",width:2,height:8,background:n.hitHead?"#ff5040":"#ffffff",transform:"rotate(-135deg)",left:8,top:5}})]})]}),r&&ae.jsx("div",{style:{position:"absolute",inset:0,background:"radial-gradient(circle at center, transparent 0%, transparent 30%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.96) 100%)"},children:ae.jsxs("div",{style:{position:"absolute",left:"50%",top:"50%",width:0,height:0},children:[ae.jsx("div",{style:{position:"absolute",width:1,height:"46vh",background:"rgba(0,0,0,0.9)",left:-.5,top:"-46vh"}}),ae.jsx("div",{style:{position:"absolute",width:1,height:"46vh",background:"rgba(0,0,0,0.9)",left:-.5,top:0}}),ae.jsx("div",{style:{position:"absolute",width:"46vw",height:1,background:"rgba(0,0,0,0.9)",top:-.5,left:"-46vw"}}),ae.jsx("div",{style:{position:"absolute",width:"46vw",height:1,background:"rgba(0,0,0,0.9)",top:-.5,left:0}}),ae.jsx("div",{style:{position:"absolute",width:6,height:6,background:"rgba(0,0,0,0.85)",borderRadius:3,left:-3,top:-3}})]})}),n.dead&&n.spectate&&ae.jsx("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",paddingBottom:70},children:ae.jsxs("div",{style:{background:"rgba(10,12,16,0.85)",padding:"14px 22px",borderRadius:8,textAlign:"center",pointerEvents:"auto"},children:[ae.jsx("div",{style:{fontSize:20,fontWeight:700,marginBottom:4},children:"你已阵亡"}),ae.jsxs("div",{style:{fontSize:14,opacity:.9,marginBottom:10},children:["观战中：",ae.jsx("b",{children:n.spectate.name}),"（",n.spectate.index+1,"/",n.spectate.list.length,"）"]}),ae.jsxs("div",{style:{display:"flex",gap:10,justifyContent:"center"},children:[ae.jsx("button",{onClick:e,style:{padding:"8px 16px",borderRadius:5,border:"1px solid rgba(255,255,255,0.4)",background:"rgba(255,255,255,0.12)",color:"#fff",cursor:"pointer",fontSize:14},children:"切换视角（点击）"}),n.spectate.takeover&&ae.jsx("button",{onClick:t,style:{padding:"8px 16px",borderRadius:5,border:"1px solid #ffd24a",background:"rgba(255,210,74,0.25)",color:"#ffd24a",cursor:"pointer",fontSize:14},children:"接管该队友（F）"})]})]})}),n.roundEndText&&ae.jsx("div",{style:{position:"absolute",top:"34%",left:0,right:0,textAlign:"center"},children:ae.jsx("div",{style:{display:"inline-block",background:"rgba(10,12,16,0.85)",padding:"12px 30px",borderRadius:8,fontSize:24,fontWeight:700,animation:"kf-in 0.3s ease"},children:n.roundEndText})}),ae.jsx("style",{children:`
        @keyframes kf-fade { 0% { opacity: 0; } 6% { opacity: 1; } 78% { opacity: 1; } 100% { opacity: 0; } }
        @keyframes kf-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
      `})]})}function $2({onStart:n,matchEnd:e}){const[t,i]=Dt.useState("T"),[r,s]=Dt.useState("rifle"),o=(a,l,u,f,h)=>ae.jsxs("div",{onClick:h,style:{flex:1,border:a?`2px solid ${u}`:"2px solid rgba(255,255,255,0.18)",background:a?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.04)",borderRadius:10,padding:"18px 22px",cursor:"pointer",textAlign:"center",transition:"all 0.15s"},children:[ae.jsx("div",{style:{fontSize:26,fontWeight:800,color:u},children:l}),ae.jsx("div",{style:{fontSize:12,opacity:.75,marginTop:6},children:f})]});return ae.jsx("div",{style:{position:"absolute",inset:0,zIndex:30,background:"radial-gradient(ellipse at center, #2c3a4a 0%, #12161c 75%)",display:"flex",alignItems:"center",justifyContent:"center",color:"#e8e8e8"},children:ae.jsxs("div",{style:{width:560,maxWidth:"92vw",textAlign:"center"},children:[ae.jsx("h1",{style:{fontSize:44,margin:"0 0 4px",letterSpacing:4},children:"DUST2"}),ae.jsx("div",{style:{fontSize:14,opacity:.8,marginBottom:26},children:"程序化 5v5 第一人称射击原型 · 无外部素材"}),e&&ae.jsx("div",{style:{marginBottom:20,background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"14px"},children:ae.jsxs("div",{style:{fontSize:20,fontWeight:700},children:["比赛结束 ",e.scoreT," : ",e.scoreCT,ae.jsxs("span",{style:{color:e.winner==="T"?"#ffcf6e":"#7ea8ff",marginLeft:8},children:[e.winner," 获胜"]})]})}),ae.jsxs("div",{style:{display:"flex",gap:14,marginBottom:14},children:[o(t==="T","T · 恐怖分子","#ffcf6e","AK-47 / 格洛克 · 下包",()=>i("T")),o(t==="CT","CT · 反恐精英","#7ea8ff","M4A4 / USP · 拆包",()=>i("CT"))]}),ae.jsxs("div",{style:{display:"flex",gap:14,marginBottom:24},children:[o(r==="rifle","步枪","#ffffff",t==="T"?"AK-47":"M4A4",()=>s("rifle")),o(r==="awp","狙击手","#ff9a6e","AWP · 右键三段开镜",()=>s("awp"))]}),ae.jsx("button",{onClick:()=>n(t,r),style:{width:"100%",padding:"14px",fontSize:18,fontWeight:700,letterSpacing:2,borderRadius:8,border:"none",cursor:"pointer",background:"linear-gradient(180deg, #e8a33d, #c07e20)",color:"#14100a"},children:"进入对战（点击后锁定鼠标）"}),ae.jsxs("div",{style:{marginTop:22,fontSize:12,opacity:.65,lineHeight:1.9},children:["WASD 移动 · Shift 静步 · 空格 跳 · 鼠标左键 射击 · R 换弹 · 1/2/3/4 或滚轮 切枪",ae.jsx("br",{}),"AWP 右键开镜 · E 拆包（CT）· 4 装备 C4 后按住左键下包（T）· 死亡后 F 接管队友"]})]})})}const K2=new Set(["KeyW","KeyA","KeyS","KeyD","Space","ShiftLeft","ShiftRight","KeyR","Digit1","Digit2","Digit3","Digit4"]);function Z2(n,e){if(n)switch(e.type){case"shot":n.shot(e.weapon??"usp",e.x??0,e.y??0,e.z??0);break;case"reload":e.reload&&e.reload!=="none"&&n.reload(e.reload);break;case"footstep":n.footstep(e.x??0,e.y??0,e.z??0,!!e.run);break;case"scope":n.scope(!!e.on);break;case"hitmarker":n.hit(!!e.headshot);break;case"kill":n.kill();break;case"plantTick":n.plantTick();break;case"plantDone":n.plantDone();break;case"defuseTick":n.defuseTick();break;case"defused":n.defused();break;case"explosion":n.explode(e.x??0,e.y??0,e.z??0);break;case"roundStart":n.roundStart();break;case"roundEnd":n.roundEnd(!!e.win);break;case"pickup":n.pickup();break;case"switch":n.switchW();break;case"door":n.door();break;case"hurt":n.hurt();break;case"bombBeep":n.beep();break}}function Q2(){const n=Dt.useRef(null),e=Dt.useRef(null),t=Dt.useRef(null),i=Dt.useRef(null),r=Dt.useRef(null),s=Dt.useRef(!1),[o,a]=Dt.useState(!1),[l,u]=Dt.useState(null),[f,h]=Dt.useState(!1),d=Dt.useCallback((x,m)=>{const c=n.current;if(!c)return;const g=new wy({team:x,primary:m}),_=i.current??new ly;_.init(),g.audio=_,i.current=_;const S=t.current;S?S.reset(g):t.current=new W2(c,g),e.current=g,g.startMatch(),r.current=g.hud,u(g.hud),a(!0),s.current=!0,h(!1),c.requestPointerLock()},[]);Dt.useEffect(()=>{if(!o)return;let x=0,m=performance.now();const c=g=>{const _=e.current,S=Math.min(.05,(g-m)/1e3)||1/60;if(m=g,_){_.update(S);const P=_.drainEvents(),A=i.current,T=_.viewCombatant();A&&T&&A.setListener(T.pos.x,T.pos.y+1.62,T.pos.z,T.yaw,T.pitch);for(const L of P)Z2(A,L);t.current?.frame(S,_.hud,P),r.current=_.hud,u(_.hud)}x=requestAnimationFrame(c)};return x=requestAnimationFrame(c),()=>cancelAnimationFrame(x)},[o]),Dt.useEffect(()=>{if(!o)return;const x=A=>{const T=e.current;T&&(K2.has(A.code)&&(T.input.keys.add(A.code),A.code==="Space"&&A.preventDefault()),A.code==="KeyE"&&(T.input.interact=!0,T.input.interactPressed=!0),A.code==="KeyF"&&(T.input.takePressed=!0))},m=A=>{const T=e.current;T&&(T.input.keys.delete(A.code),A.code==="KeyE"&&(T.input.interact=!1))},c=A=>{const T=e.current;T&&(T.input.mx+=A.movementX,T.input.my+=A.movementY)},g=A=>{const T=e.current;!T||document.pointerLockElement!==n.current||(A.button===0?r.current?.dead?T.cycleSpectate():(T.input.lmb=!0,T.input.lmbPressed=!0):A.button===2&&(T.input.rmb=!0,T.input.rmbPressed=!0))},_=A=>{const T=e.current;T&&(A.button===0&&(T.input.lmb=!1),A.button===2&&(T.input.rmb=!1))},S=A=>{const T=e.current;T&&(T.input.wheel+=A.deltaY>0?1:-1)},P=A=>A.preventDefault();return window.addEventListener("keydown",x),window.addEventListener("keyup",m),window.addEventListener("mousemove",c),window.addEventListener("mousedown",g),window.addEventListener("mouseup",_),window.addEventListener("wheel",S),window.addEventListener("contextmenu",P),()=>{window.removeEventListener("keydown",x),window.removeEventListener("keyup",m),window.removeEventListener("mousemove",c),window.removeEventListener("mousedown",g),window.removeEventListener("mouseup",_),window.removeEventListener("wheel",S),window.removeEventListener("contextmenu",P)}},[o]),Dt.useEffect(()=>{const x=()=>{const c=e.current;!(document.pointerLockElement===n.current)&&c&&c.phase!=="matchEnd"&&c.phase!=="menu"?h(!0):h(!1)},m=()=>{t.current?.resize(window.innerWidth,window.innerHeight)};return document.addEventListener("pointerlockchange",x),window.addEventListener("resize",m),()=>{document.removeEventListener("pointerlockchange",x),window.removeEventListener("resize",m)}},[]);const p=l?.matchEnd??null,v=!o||p!==null;return ae.jsxs("div",{style:{position:"fixed",inset:0},children:[ae.jsx("canvas",{ref:n,style:{width:"100%",height:"100%",display:"block",background:"#9fc4de"},onClick:()=>{s.current&&f&&!p&&n.current?.requestPointerLock()}}),o&&l&&!v&&ae.jsx(q2,{hud:l,onCycleSpec:()=>e.current?.cycleSpectate(),onTakeover:()=>{e.current&&(e.current.input.takePressed=!0)}}),v&&ae.jsx($2,{onStart:d,matchEnd:p}),o&&f&&!v&&ae.jsx("div",{style:{position:"absolute",inset:0,zIndex:25,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontFamily:"system-ui, sans-serif",cursor:"pointer"},onClick:()=>n.current?.requestPointerLock(),children:ae.jsxs("div",{style:{textAlign:"center"},children:[ae.jsx("div",{style:{fontSize:26,fontWeight:700,marginBottom:8},children:"游戏已暂停"}),ae.jsx("div",{style:{opacity:.8},children:"点击继续（重新锁定鼠标）"})]})})]})}jg(document.getElementById("root")).render(ae.jsx(Kv.StrictMode,{children:ae.jsx(Q2,{})}));

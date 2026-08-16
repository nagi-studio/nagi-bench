var a_=Object.defineProperty;var o_=(n,e,t)=>e in n?a_(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var Z=(n,e,t)=>o_(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function l_(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var nm={exports:{}},Cl={},im={exports:{}},Ye={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var za=Symbol.for("react.element"),c_=Symbol.for("react.portal"),u_=Symbol.for("react.fragment"),h_=Symbol.for("react.strict_mode"),d_=Symbol.for("react.profiler"),f_=Symbol.for("react.provider"),p_=Symbol.for("react.context"),m_=Symbol.for("react.forward_ref"),g_=Symbol.for("react.suspense"),__=Symbol.for("react.memo"),v_=Symbol.for("react.lazy"),vd=Symbol.iterator;function x_(n){return n===null||typeof n!="object"?null:(n=vd&&n[vd]||n["@@iterator"],typeof n=="function"?n:null)}var rm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},sm=Object.assign,am={};function Bs(n,e,t){this.props=n,this.context=e,this.refs=am,this.updater=t||rm}Bs.prototype.isReactComponent={};Bs.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};Bs.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function om(){}om.prototype=Bs.prototype;function hh(n,e,t){this.props=n,this.context=e,this.refs=am,this.updater=t||rm}var dh=hh.prototype=new om;dh.constructor=hh;sm(dh,Bs.prototype);dh.isPureReactComponent=!0;var xd=Array.isArray,lm=Object.prototype.hasOwnProperty,fh={current:null},cm={key:!0,ref:!0,__self:!0,__source:!0};function um(n,e,t){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)lm.call(e,i)&&!cm.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=t;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(n&&n.defaultProps)for(i in o=n.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:za,type:n,key:s,ref:a,props:r,_owner:fh.current}}function y_(n,e){return{$$typeof:za,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function ph(n){return typeof n=="object"&&n!==null&&n.$$typeof===za}function S_(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var yd=/\/+/g;function ec(n,e){return typeof n=="object"&&n!==null&&n.key!=null?S_(""+n.key):e.toString(36)}function Bo(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var a=!1;if(n===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(n.$$typeof){case za:case c_:a=!0}}if(a)return a=n,r=r(a),n=i===""?"."+ec(a,0):i,xd(r)?(t="",n!=null&&(t=n.replace(yd,"$&/")+"/"),Bo(r,e,t,"",function(c){return c})):r!=null&&(ph(r)&&(r=y_(r,t+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(yd,"$&/")+"/")+n)),e.push(r)),1;if(a=0,i=i===""?".":i+":",xd(n))for(var o=0;o<n.length;o++){s=n[o];var l=i+ec(s,o);a+=Bo(s,e,t,l,r)}else if(l=x_(n),typeof l=="function")for(n=l.call(n),o=0;!(s=n.next()).done;)s=s.value,l=i+ec(s,o++),a+=Bo(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function $a(n,e,t){if(n==null)return n;var i=[],r=0;return Bo(n,i,"","",function(s){return e.call(t,s,r++)}),i}function M_(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var rn={current:null},zo={transition:null},E_={ReactCurrentDispatcher:rn,ReactCurrentBatchConfig:zo,ReactCurrentOwner:fh};function hm(){throw Error("act(...) is not supported in production builds of React.")}Ye.Children={map:$a,forEach:function(n,e,t){$a(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return $a(n,function(){e++}),e},toArray:function(n){return $a(n,function(e){return e})||[]},only:function(n){if(!ph(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};Ye.Component=Bs;Ye.Fragment=u_;Ye.Profiler=d_;Ye.PureComponent=hh;Ye.StrictMode=h_;Ye.Suspense=g_;Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=E_;Ye.act=hm;Ye.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=sm({},n.props),r=n.key,s=n.ref,a=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=fh.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var o=n.type.defaultProps;for(l in e)lm.call(e,l)&&!cm.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:za,type:n.type,key:r,ref:s,props:i,_owner:a}};Ye.createContext=function(n){return n={$$typeof:p_,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:f_,_context:n},n.Consumer=n};Ye.createElement=um;Ye.createFactory=function(n){var e=um.bind(null,n);return e.type=n,e};Ye.createRef=function(){return{current:null}};Ye.forwardRef=function(n){return{$$typeof:m_,render:n}};Ye.isValidElement=ph;Ye.lazy=function(n){return{$$typeof:v_,_payload:{_status:-1,_result:n},_init:M_}};Ye.memo=function(n,e){return{$$typeof:__,type:n,compare:e===void 0?null:e}};Ye.startTransition=function(n){var e=zo.transition;zo.transition={};try{n()}finally{zo.transition=e}};Ye.unstable_act=hm;Ye.useCallback=function(n,e){return rn.current.useCallback(n,e)};Ye.useContext=function(n){return rn.current.useContext(n)};Ye.useDebugValue=function(){};Ye.useDeferredValue=function(n){return rn.current.useDeferredValue(n)};Ye.useEffect=function(n,e){return rn.current.useEffect(n,e)};Ye.useId=function(){return rn.current.useId()};Ye.useImperativeHandle=function(n,e,t){return rn.current.useImperativeHandle(n,e,t)};Ye.useInsertionEffect=function(n,e){return rn.current.useInsertionEffect(n,e)};Ye.useLayoutEffect=function(n,e){return rn.current.useLayoutEffect(n,e)};Ye.useMemo=function(n,e){return rn.current.useMemo(n,e)};Ye.useReducer=function(n,e,t){return rn.current.useReducer(n,e,t)};Ye.useRef=function(n){return rn.current.useRef(n)};Ye.useState=function(n){return rn.current.useState(n)};Ye.useSyncExternalStore=function(n,e,t){return rn.current.useSyncExternalStore(n,e,t)};Ye.useTransition=function(){return rn.current.useTransition()};Ye.version="18.3.1";im.exports=Ye;var Qt=im.exports;const w_=l_(Qt);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var T_=Qt,A_=Symbol.for("react.element"),R_=Symbol.for("react.fragment"),b_=Object.prototype.hasOwnProperty,C_=T_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,P_={key:!0,ref:!0,__self:!0,__source:!0};function dm(n,e,t){var i,r={},s=null,a=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)b_.call(e,i)&&!P_.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:A_,type:n,key:s,ref:a,props:r,_owner:C_.current}}Cl.Fragment=R_;Cl.jsx=dm;Cl.jsxs=dm;nm.exports=Cl;var b=nm.exports,ou={},fm={exports:{}},wn={},pm={exports:{}},mm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(D,O){var B=D.length;D.push(O);e:for(;0<B;){var $=B-1>>>1,Q=D[$];if(0<r(Q,O))D[$]=O,D[B]=Q,B=$;else break e}}function t(D){return D.length===0?null:D[0]}function i(D){if(D.length===0)return null;var O=D[0],B=D.pop();if(B!==O){D[0]=B;e:for(var $=0,Q=D.length,X=Q>>>1;$<X;){var J=2*($+1)-1,ce=D[J],me=J+1,ge=D[me];if(0>r(ce,B))me<Q&&0>r(ge,ce)?(D[$]=ge,D[me]=B,$=me):(D[$]=ce,D[J]=B,$=J);else if(me<Q&&0>r(ge,B))D[$]=ge,D[me]=B,$=me;else break e}}return O}function r(D,O){var B=D.sortIndex-O.sortIndex;return B!==0?B:D.id-O.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();n.unstable_now=function(){return a.now()-o}}var l=[],c=[],h=1,f=null,d=3,p=!1,v=!1,x=!1,m=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function g(D){for(var O=t(c);O!==null;){if(O.callback===null)i(c);else if(O.startTime<=D)i(c),O.sortIndex=O.expirationTime,e(l,O);else break;O=t(c)}}function y(D){if(x=!1,g(D),!v)if(t(l)!==null)v=!0,j(C);else{var O=t(c);O!==null&&K(y,O.startTime-D)}}function C(D,O){v=!1,x&&(x=!1,u(I),I=-1),p=!0;var B=d;try{for(g(O),f=t(l);f!==null&&(!(f.expirationTime>O)||D&&!F());){var $=f.callback;if(typeof $=="function"){f.callback=null,d=f.priorityLevel;var Q=$(f.expirationTime<=O);O=n.unstable_now(),typeof Q=="function"?f.callback=Q:f===t(l)&&i(l),g(O)}else i(l);f=t(l)}if(f!==null)var X=!0;else{var J=t(c);J!==null&&K(y,J.startTime-O),X=!1}return X}finally{f=null,d=B,p=!1}}var T=!1,A=null,I=-1,S=5,E=-1;function F(){return!(n.unstable_now()-E<S)}function z(){if(A!==null){var D=n.unstable_now();E=D;var O=!0;try{O=A(!0,D)}finally{O?q():(T=!1,A=null)}}else T=!1}var q;if(typeof _=="function")q=function(){_(z)};else if(typeof MessageChannel<"u"){var L=new MessageChannel,k=L.port2;L.port1.onmessage=z,q=function(){k.postMessage(null)}}else q=function(){m(z,0)};function j(D){A=D,T||(T=!0,q())}function K(D,O){I=m(function(){D(n.unstable_now())},O)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(D){D.callback=null},n.unstable_continueExecution=function(){v||p||(v=!0,j(C))},n.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):S=0<D?Math.floor(1e3/D):5},n.unstable_getCurrentPriorityLevel=function(){return d},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(D){switch(d){case 1:case 2:case 3:var O=3;break;default:O=d}var B=d;d=O;try{return D()}finally{d=B}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(D,O){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var B=d;d=D;try{return O()}finally{d=B}},n.unstable_scheduleCallback=function(D,O,B){var $=n.unstable_now();switch(typeof B=="object"&&B!==null?(B=B.delay,B=typeof B=="number"&&0<B?$+B:$):B=$,D){case 1:var Q=-1;break;case 2:Q=250;break;case 5:Q=1073741823;break;case 4:Q=1e4;break;default:Q=5e3}return Q=B+Q,D={id:h++,callback:O,priorityLevel:D,startTime:B,expirationTime:Q,sortIndex:-1},B>$?(D.sortIndex=B,e(c,D),t(l)===null&&D===t(c)&&(x?(u(I),I=-1):x=!0,K(y,B-$))):(D.sortIndex=Q,e(l,D),v||p||(v=!0,j(C))),D},n.unstable_shouldYield=F,n.unstable_wrapCallback=function(D){var O=d;return function(){var B=d;d=O;try{return D.apply(this,arguments)}finally{d=B}}}})(mm);pm.exports=mm;var L_=pm.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var N_=Qt,En=L_;function ie(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var gm=new Set,Sa={};function Or(n,e){bs(n,e),bs(n+"Capture",e)}function bs(n,e){for(Sa[n]=e,n=0;n<e.length;n++)gm.add(e[n])}var yi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),lu=Object.prototype.hasOwnProperty,D_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Sd={},Md={};function I_(n){return lu.call(Md,n)?!0:lu.call(Sd,n)?!1:D_.test(n)?Md[n]=!0:(Sd[n]=!0,!1)}function U_(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function O_(n,e,t,i){if(e===null||typeof e>"u"||U_(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function sn(n,e,t,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Bt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Bt[n]=new sn(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Bt[e]=new sn(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Bt[n]=new sn(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Bt[n]=new sn(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Bt[n]=new sn(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Bt[n]=new sn(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Bt[n]=new sn(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Bt[n]=new sn(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Bt[n]=new sn(n,5,!1,n.toLowerCase(),null,!1,!1)});var mh=/[\-:]([a-z])/g;function gh(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(mh,gh);Bt[e]=new sn(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(mh,gh);Bt[e]=new sn(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(mh,gh);Bt[e]=new sn(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Bt[n]=new sn(n,1,!1,n.toLowerCase(),null,!1,!1)});Bt.xlinkHref=new sn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Bt[n]=new sn(n,1,!1,n.toLowerCase(),null,!0,!0)});function _h(n,e,t,i){var r=Bt.hasOwnProperty(e)?Bt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(O_(e,t,r,i)&&(t=null),i||r===null?I_(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var Ti=N_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ka=Symbol.for("react.element"),as=Symbol.for("react.portal"),os=Symbol.for("react.fragment"),vh=Symbol.for("react.strict_mode"),cu=Symbol.for("react.profiler"),_m=Symbol.for("react.provider"),vm=Symbol.for("react.context"),xh=Symbol.for("react.forward_ref"),uu=Symbol.for("react.suspense"),hu=Symbol.for("react.suspense_list"),yh=Symbol.for("react.memo"),Ni=Symbol.for("react.lazy"),xm=Symbol.for("react.offscreen"),Ed=Symbol.iterator;function js(n){return n===null||typeof n!="object"?null:(n=Ed&&n[Ed]||n["@@iterator"],typeof n=="function"?n:null)}var _t=Object.assign,tc;function oa(n){if(tc===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);tc=e&&e[1]||""}return`
`+tc+n}var nc=!1;function ic(n,e){if(!n||nc)return"";nc=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){i=c}n.call(e.prototype)}else{try{throw Error()}catch(c){i=c}n()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=a&&0<=o);break}}}finally{nc=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?oa(n):""}function k_(n){switch(n.tag){case 5:return oa(n.type);case 16:return oa("Lazy");case 13:return oa("Suspense");case 19:return oa("SuspenseList");case 0:case 2:case 15:return n=ic(n.type,!1),n;case 11:return n=ic(n.type.render,!1),n;case 1:return n=ic(n.type,!0),n;default:return""}}function du(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case os:return"Fragment";case as:return"Portal";case cu:return"Profiler";case vh:return"StrictMode";case uu:return"Suspense";case hu:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case vm:return(n.displayName||"Context")+".Consumer";case _m:return(n._context.displayName||"Context")+".Provider";case xh:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case yh:return e=n.displayName||null,e!==null?e:du(n.type)||"Memo";case Ni:e=n._payload,n=n._init;try{return du(n(e))}catch{}}return null}function F_(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return du(e);case 8:return e===vh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Qi(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function ym(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function B_(n){var e=ym(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function Za(n){n._valueTracker||(n._valueTracker=B_(n))}function Sm(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=ym(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function Qo(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function fu(n,e){var t=e.checked;return _t({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function wd(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=Qi(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Mm(n,e){e=e.checked,e!=null&&_h(n,"checked",e,!1)}function pu(n,e){Mm(n,e);var t=Qi(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?mu(n,e.type,t):e.hasOwnProperty("defaultValue")&&mu(n,e.type,Qi(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function Td(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function mu(n,e,t){(e!=="number"||Qo(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var la=Array.isArray;function ys(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+Qi(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function gu(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ie(91));return _t({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Ad(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(ie(92));if(la(t)){if(1<t.length)throw Error(ie(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:Qi(t)}}function Em(n,e){var t=Qi(e.value),i=Qi(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function Rd(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function wm(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function _u(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?wm(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Qa,Tm=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(Qa=Qa||document.createElement("div"),Qa.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Qa.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function Ma(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var ha={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},z_=["Webkit","ms","Moz","O"];Object.keys(ha).forEach(function(n){z_.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),ha[e]=ha[n]})});function Am(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||ha.hasOwnProperty(n)&&ha[n]?(""+e).trim():e+"px"}function Rm(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=Am(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var G_=_t({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function vu(n,e){if(e){if(G_[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ie(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ie(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ie(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ie(62))}}function xu(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var yu=null;function Sh(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Su=null,Ss=null,Ms=null;function bd(n){if(n=Va(n)){if(typeof Su!="function")throw Error(ie(280));var e=n.stateNode;e&&(e=Il(e),Su(n.stateNode,n.type,e))}}function bm(n){Ss?Ms?Ms.push(n):Ms=[n]:Ss=n}function Cm(){if(Ss){var n=Ss,e=Ms;if(Ms=Ss=null,bd(n),e)for(n=0;n<e.length;n++)bd(e[n])}}function Pm(n,e){return n(e)}function Lm(){}var rc=!1;function Nm(n,e,t){if(rc)return n(e,t);rc=!0;try{return Pm(n,e,t)}finally{rc=!1,(Ss!==null||Ms!==null)&&(Lm(),Cm())}}function Ea(n,e){var t=n.stateNode;if(t===null)return null;var i=Il(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(ie(231,e,typeof t));return t}var Mu=!1;if(yi)try{var Xs={};Object.defineProperty(Xs,"passive",{get:function(){Mu=!0}}),window.addEventListener("test",Xs,Xs),window.removeEventListener("test",Xs,Xs)}catch{Mu=!1}function H_(n,e,t,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(h){this.onError(h)}}var da=!1,Jo=null,el=!1,Eu=null,V_={onError:function(n){da=!0,Jo=n}};function W_(n,e,t,i,r,s,a,o,l){da=!1,Jo=null,H_.apply(V_,arguments)}function j_(n,e,t,i,r,s,a,o,l){if(W_.apply(this,arguments),da){if(da){var c=Jo;da=!1,Jo=null}else throw Error(ie(198));el||(el=!0,Eu=c)}}function kr(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function Dm(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function Cd(n){if(kr(n)!==n)throw Error(ie(188))}function X_(n){var e=n.alternate;if(!e){if(e=kr(n),e===null)throw Error(ie(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return Cd(r),n;if(s===i)return Cd(r),e;s=s.sibling}throw Error(ie(188))}if(t.return!==i.return)t=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===t){a=!0,t=r,i=s;break}if(o===i){a=!0,i=r,t=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===t){a=!0,t=s,i=r;break}if(o===i){a=!0,i=s,t=r;break}o=o.sibling}if(!a)throw Error(ie(189))}}if(t.alternate!==i)throw Error(ie(190))}if(t.tag!==3)throw Error(ie(188));return t.stateNode.current===t?n:e}function Im(n){return n=X_(n),n!==null?Um(n):null}function Um(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=Um(n);if(e!==null)return e;n=n.sibling}return null}var Om=En.unstable_scheduleCallback,Pd=En.unstable_cancelCallback,Y_=En.unstable_shouldYield,q_=En.unstable_requestPaint,Et=En.unstable_now,$_=En.unstable_getCurrentPriorityLevel,Mh=En.unstable_ImmediatePriority,km=En.unstable_UserBlockingPriority,tl=En.unstable_NormalPriority,K_=En.unstable_LowPriority,Fm=En.unstable_IdlePriority,Pl=null,ii=null;function Z_(n){if(ii&&typeof ii.onCommitFiberRoot=="function")try{ii.onCommitFiberRoot(Pl,n,void 0,(n.current.flags&128)===128)}catch{}}var Xn=Math.clz32?Math.clz32:ev,Q_=Math.log,J_=Math.LN2;function ev(n){return n>>>=0,n===0?32:31-(Q_(n)/J_|0)|0}var Ja=64,eo=4194304;function ca(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function nl(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,a=t&268435455;if(a!==0){var o=a&~r;o!==0?i=ca(o):(s&=a,s!==0&&(i=ca(s)))}else a=t&~r,a!==0?i=ca(a):s!==0&&(i=ca(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-Xn(e),r=1<<t,i|=n[t],e&=~r;return i}function tv(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function nv(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var a=31-Xn(s),o=1<<a,l=r[a];l===-1?(!(o&t)||o&i)&&(r[a]=tv(o,e)):l<=e&&(n.expiredLanes|=o),s&=~o}}function wu(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Bm(){var n=Ja;return Ja<<=1,!(Ja&4194240)&&(Ja=64),n}function sc(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function Ga(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-Xn(e),n[e]=t}function iv(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-Xn(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function Eh(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-Xn(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var Qe=0;function zm(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var Gm,wh,Hm,Vm,Wm,Tu=!1,to=[],zi=null,Gi=null,Hi=null,wa=new Map,Ta=new Map,Ii=[],rv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ld(n,e){switch(n){case"focusin":case"focusout":zi=null;break;case"dragenter":case"dragleave":Gi=null;break;case"mouseover":case"mouseout":Hi=null;break;case"pointerover":case"pointerout":wa.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ta.delete(e.pointerId)}}function Ys(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Va(e),e!==null&&wh(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function sv(n,e,t,i,r){switch(e){case"focusin":return zi=Ys(zi,n,e,t,i,r),!0;case"dragenter":return Gi=Ys(Gi,n,e,t,i,r),!0;case"mouseover":return Hi=Ys(Hi,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return wa.set(s,Ys(wa.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ta.set(s,Ys(Ta.get(s)||null,n,e,t,i,r)),!0}return!1}function jm(n){var e=vr(n.target);if(e!==null){var t=kr(e);if(t!==null){if(e=t.tag,e===13){if(e=Dm(t),e!==null){n.blockedOn=e,Wm(n.priority,function(){Hm(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Go(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=Au(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);yu=i,t.target.dispatchEvent(i),yu=null}else return e=Va(t),e!==null&&wh(e),n.blockedOn=t,!1;e.shift()}return!0}function Nd(n,e,t){Go(n)&&t.delete(e)}function av(){Tu=!1,zi!==null&&Go(zi)&&(zi=null),Gi!==null&&Go(Gi)&&(Gi=null),Hi!==null&&Go(Hi)&&(Hi=null),wa.forEach(Nd),Ta.forEach(Nd)}function qs(n,e){n.blockedOn===e&&(n.blockedOn=null,Tu||(Tu=!0,En.unstable_scheduleCallback(En.unstable_NormalPriority,av)))}function Aa(n){function e(r){return qs(r,n)}if(0<to.length){qs(to[0],n);for(var t=1;t<to.length;t++){var i=to[t];i.blockedOn===n&&(i.blockedOn=null)}}for(zi!==null&&qs(zi,n),Gi!==null&&qs(Gi,n),Hi!==null&&qs(Hi,n),wa.forEach(e),Ta.forEach(e),t=0;t<Ii.length;t++)i=Ii[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<Ii.length&&(t=Ii[0],t.blockedOn===null);)jm(t),t.blockedOn===null&&Ii.shift()}var Es=Ti.ReactCurrentBatchConfig,il=!0;function ov(n,e,t,i){var r=Qe,s=Es.transition;Es.transition=null;try{Qe=1,Th(n,e,t,i)}finally{Qe=r,Es.transition=s}}function lv(n,e,t,i){var r=Qe,s=Es.transition;Es.transition=null;try{Qe=4,Th(n,e,t,i)}finally{Qe=r,Es.transition=s}}function Th(n,e,t,i){if(il){var r=Au(n,e,t,i);if(r===null)mc(n,e,i,rl,t),Ld(n,i);else if(sv(r,n,e,t,i))i.stopPropagation();else if(Ld(n,i),e&4&&-1<rv.indexOf(n)){for(;r!==null;){var s=Va(r);if(s!==null&&Gm(s),s=Au(n,e,t,i),s===null&&mc(n,e,i,rl,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else mc(n,e,i,null,t)}}var rl=null;function Au(n,e,t,i){if(rl=null,n=Sh(i),n=vr(n),n!==null)if(e=kr(n),e===null)n=null;else if(t=e.tag,t===13){if(n=Dm(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return rl=n,null}function Xm(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch($_()){case Mh:return 1;case km:return 4;case tl:case K_:return 16;case Fm:return 536870912;default:return 16}default:return 16}}var Oi=null,Ah=null,Ho=null;function Ym(){if(Ho)return Ho;var n,e=Ah,t=e.length,i,r="value"in Oi?Oi.value:Oi.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var a=t-n;for(i=1;i<=a&&e[t-i]===r[s-i];i++);return Ho=r.slice(n,1<i?1-i:void 0)}function Vo(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function no(){return!0}function Dd(){return!1}function Tn(n){function e(t,i,r,s,a){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in n)n.hasOwnProperty(o)&&(t=n[o],this[o]=t?t(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?no:Dd,this.isPropagationStopped=Dd,this}return _t(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=no)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=no)},persist:function(){},isPersistent:no}),e}var zs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Rh=Tn(zs),Ha=_t({},zs,{view:0,detail:0}),cv=Tn(Ha),ac,oc,$s,Ll=_t({},Ha,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:bh,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==$s&&($s&&n.type==="mousemove"?(ac=n.screenX-$s.screenX,oc=n.screenY-$s.screenY):oc=ac=0,$s=n),ac)},movementY:function(n){return"movementY"in n?n.movementY:oc}}),Id=Tn(Ll),uv=_t({},Ll,{dataTransfer:0}),hv=Tn(uv),dv=_t({},Ha,{relatedTarget:0}),lc=Tn(dv),fv=_t({},zs,{animationName:0,elapsedTime:0,pseudoElement:0}),pv=Tn(fv),mv=_t({},zs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),gv=Tn(mv),_v=_t({},zs,{data:0}),Ud=Tn(_v),vv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},xv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},yv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Sv(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=yv[n])?!!e[n]:!1}function bh(){return Sv}var Mv=_t({},Ha,{key:function(n){if(n.key){var e=vv[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=Vo(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?xv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:bh,charCode:function(n){return n.type==="keypress"?Vo(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Vo(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Ev=Tn(Mv),wv=_t({},Ll,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Od=Tn(wv),Tv=_t({},Ha,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:bh}),Av=Tn(Tv),Rv=_t({},zs,{propertyName:0,elapsedTime:0,pseudoElement:0}),bv=Tn(Rv),Cv=_t({},Ll,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Pv=Tn(Cv),Lv=[9,13,27,32],Ch=yi&&"CompositionEvent"in window,fa=null;yi&&"documentMode"in document&&(fa=document.documentMode);var Nv=yi&&"TextEvent"in window&&!fa,qm=yi&&(!Ch||fa&&8<fa&&11>=fa),kd=" ",Fd=!1;function $m(n,e){switch(n){case"keyup":return Lv.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Km(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var ls=!1;function Dv(n,e){switch(n){case"compositionend":return Km(e);case"keypress":return e.which!==32?null:(Fd=!0,kd);case"textInput":return n=e.data,n===kd&&Fd?null:n;default:return null}}function Iv(n,e){if(ls)return n==="compositionend"||!Ch&&$m(n,e)?(n=Ym(),Ho=Ah=Oi=null,ls=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return qm&&e.locale!=="ko"?null:e.data;default:return null}}var Uv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Bd(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!Uv[n.type]:e==="textarea"}function Zm(n,e,t,i){bm(i),e=sl(e,"onChange"),0<e.length&&(t=new Rh("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var pa=null,Ra=null;function Ov(n){l0(n,0)}function Nl(n){var e=hs(n);if(Sm(e))return n}function kv(n,e){if(n==="change")return e}var Qm=!1;if(yi){var cc;if(yi){var uc="oninput"in document;if(!uc){var zd=document.createElement("div");zd.setAttribute("oninput","return;"),uc=typeof zd.oninput=="function"}cc=uc}else cc=!1;Qm=cc&&(!document.documentMode||9<document.documentMode)}function Gd(){pa&&(pa.detachEvent("onpropertychange",Jm),Ra=pa=null)}function Jm(n){if(n.propertyName==="value"&&Nl(Ra)){var e=[];Zm(e,Ra,n,Sh(n)),Nm(Ov,e)}}function Fv(n,e,t){n==="focusin"?(Gd(),pa=e,Ra=t,pa.attachEvent("onpropertychange",Jm)):n==="focusout"&&Gd()}function Bv(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Nl(Ra)}function zv(n,e){if(n==="click")return Nl(e)}function Gv(n,e){if(n==="input"||n==="change")return Nl(e)}function Hv(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var Kn=typeof Object.is=="function"?Object.is:Hv;function ba(n,e){if(Kn(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!lu.call(e,r)||!Kn(n[r],e[r]))return!1}return!0}function Hd(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function Vd(n,e){var t=Hd(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Hd(t)}}function e0(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?e0(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function t0(){for(var n=window,e=Qo();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=Qo(n.document)}return e}function Ph(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function Vv(n){var e=t0(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&e0(t.ownerDocument.documentElement,t)){if(i!==null&&Ph(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=Vd(t,s);var a=Vd(t,i);r&&a&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==a.node||n.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Wv=yi&&"documentMode"in document&&11>=document.documentMode,cs=null,Ru=null,ma=null,bu=!1;function Wd(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;bu||cs==null||cs!==Qo(i)||(i=cs,"selectionStart"in i&&Ph(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),ma&&ba(ma,i)||(ma=i,i=sl(Ru,"onSelect"),0<i.length&&(e=new Rh("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=cs)))}function io(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var us={animationend:io("Animation","AnimationEnd"),animationiteration:io("Animation","AnimationIteration"),animationstart:io("Animation","AnimationStart"),transitionend:io("Transition","TransitionEnd")},hc={},n0={};yi&&(n0=document.createElement("div").style,"AnimationEvent"in window||(delete us.animationend.animation,delete us.animationiteration.animation,delete us.animationstart.animation),"TransitionEvent"in window||delete us.transitionend.transition);function Dl(n){if(hc[n])return hc[n];if(!us[n])return n;var e=us[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in n0)return hc[n]=e[t];return n}var i0=Dl("animationend"),r0=Dl("animationiteration"),s0=Dl("animationstart"),a0=Dl("transitionend"),o0=new Map,jd="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function tr(n,e){o0.set(n,e),Or(e,[n])}for(var dc=0;dc<jd.length;dc++){var fc=jd[dc],jv=fc.toLowerCase(),Xv=fc[0].toUpperCase()+fc.slice(1);tr(jv,"on"+Xv)}tr(i0,"onAnimationEnd");tr(r0,"onAnimationIteration");tr(s0,"onAnimationStart");tr("dblclick","onDoubleClick");tr("focusin","onFocus");tr("focusout","onBlur");tr(a0,"onTransitionEnd");bs("onMouseEnter",["mouseout","mouseover"]);bs("onMouseLeave",["mouseout","mouseover"]);bs("onPointerEnter",["pointerout","pointerover"]);bs("onPointerLeave",["pointerout","pointerover"]);Or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Or("onBeforeInput",["compositionend","keypress","textInput","paste"]);Or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ua="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Yv=new Set("cancel close invalid load scroll toggle".split(" ").concat(ua));function Xd(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,j_(i,e,void 0,n),n.currentTarget=null}function l0(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;Xd(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;Xd(r,o,c),s=l}}}if(el)throw n=Eu,el=!1,Eu=null,n}function at(n,e){var t=e[Du];t===void 0&&(t=e[Du]=new Set);var i=n+"__bubble";t.has(i)||(c0(e,n,2,!1),t.add(i))}function pc(n,e,t){var i=0;e&&(i|=4),c0(t,n,i,e)}var ro="_reactListening"+Math.random().toString(36).slice(2);function Ca(n){if(!n[ro]){n[ro]=!0,gm.forEach(function(t){t!=="selectionchange"&&(Yv.has(t)||pc(t,!1,n),pc(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[ro]||(e[ro]=!0,pc("selectionchange",!1,e))}}function c0(n,e,t,i){switch(Xm(e)){case 1:var r=ov;break;case 4:r=lv;break;default:r=Th}t=r.bind(null,e,t,n),r=void 0,!Mu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function mc(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=vr(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}Nm(function(){var c=s,h=Sh(t),f=[];e:{var d=o0.get(n);if(d!==void 0){var p=Rh,v=n;switch(n){case"keypress":if(Vo(t)===0)break e;case"keydown":case"keyup":p=Ev;break;case"focusin":v="focus",p=lc;break;case"focusout":v="blur",p=lc;break;case"beforeblur":case"afterblur":p=lc;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=Id;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=hv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Av;break;case i0:case r0:case s0:p=pv;break;case a0:p=bv;break;case"scroll":p=cv;break;case"wheel":p=Pv;break;case"copy":case"cut":case"paste":p=gv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Od}var x=(e&4)!==0,m=!x&&n==="scroll",u=x?d!==null?d+"Capture":null:d;x=[];for(var _=c,g;_!==null;){g=_;var y=g.stateNode;if(g.tag===5&&y!==null&&(g=y,u!==null&&(y=Ea(_,u),y!=null&&x.push(Pa(_,y,g)))),m)break;_=_.return}0<x.length&&(d=new p(d,v,null,t,h),f.push({event:d,listeners:x}))}}if(!(e&7)){e:{if(d=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",d&&t!==yu&&(v=t.relatedTarget||t.fromElement)&&(vr(v)||v[Si]))break e;if((p||d)&&(d=h.window===h?h:(d=h.ownerDocument)?d.defaultView||d.parentWindow:window,p?(v=t.relatedTarget||t.toElement,p=c,v=v?vr(v):null,v!==null&&(m=kr(v),v!==m||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(x=Id,y="onMouseLeave",u="onMouseEnter",_="mouse",(n==="pointerout"||n==="pointerover")&&(x=Od,y="onPointerLeave",u="onPointerEnter",_="pointer"),m=p==null?d:hs(p),g=v==null?d:hs(v),d=new x(y,_+"leave",p,t,h),d.target=m,d.relatedTarget=g,y=null,vr(h)===c&&(x=new x(u,_+"enter",v,t,h),x.target=g,x.relatedTarget=m,y=x),m=y,p&&v)t:{for(x=p,u=v,_=0,g=x;g;g=Br(g))_++;for(g=0,y=u;y;y=Br(y))g++;for(;0<_-g;)x=Br(x),_--;for(;0<g-_;)u=Br(u),g--;for(;_--;){if(x===u||u!==null&&x===u.alternate)break t;x=Br(x),u=Br(u)}x=null}else x=null;p!==null&&Yd(f,d,p,x,!1),v!==null&&m!==null&&Yd(f,m,v,x,!0)}}e:{if(d=c?hs(c):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var C=kv;else if(Bd(d))if(Qm)C=Gv;else{C=Bv;var T=Fv}else(p=d.nodeName)&&p.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(C=zv);if(C&&(C=C(n,c))){Zm(f,C,t,h);break e}T&&T(n,d,c),n==="focusout"&&(T=d._wrapperState)&&T.controlled&&d.type==="number"&&mu(d,"number",d.value)}switch(T=c?hs(c):window,n){case"focusin":(Bd(T)||T.contentEditable==="true")&&(cs=T,Ru=c,ma=null);break;case"focusout":ma=Ru=cs=null;break;case"mousedown":bu=!0;break;case"contextmenu":case"mouseup":case"dragend":bu=!1,Wd(f,t,h);break;case"selectionchange":if(Wv)break;case"keydown":case"keyup":Wd(f,t,h)}var A;if(Ch)e:{switch(n){case"compositionstart":var I="onCompositionStart";break e;case"compositionend":I="onCompositionEnd";break e;case"compositionupdate":I="onCompositionUpdate";break e}I=void 0}else ls?$m(n,t)&&(I="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(I="onCompositionStart");I&&(qm&&t.locale!=="ko"&&(ls||I!=="onCompositionStart"?I==="onCompositionEnd"&&ls&&(A=Ym()):(Oi=h,Ah="value"in Oi?Oi.value:Oi.textContent,ls=!0)),T=sl(c,I),0<T.length&&(I=new Ud(I,n,null,t,h),f.push({event:I,listeners:T}),A?I.data=A:(A=Km(t),A!==null&&(I.data=A)))),(A=Nv?Dv(n,t):Iv(n,t))&&(c=sl(c,"onBeforeInput"),0<c.length&&(h=new Ud("onBeforeInput","beforeinput",null,t,h),f.push({event:h,listeners:c}),h.data=A))}l0(f,e)})}function Pa(n,e,t){return{instance:n,listener:e,currentTarget:t}}function sl(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Ea(n,t),s!=null&&i.unshift(Pa(n,s,r)),s=Ea(n,e),s!=null&&i.push(Pa(n,s,r))),n=n.return}return i}function Br(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Yd(n,e,t,i,r){for(var s=e._reactName,a=[];t!==null&&t!==i;){var o=t,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=Ea(t,s),l!=null&&a.unshift(Pa(t,l,o))):r||(l=Ea(t,s),l!=null&&a.push(Pa(t,l,o)))),t=t.return}a.length!==0&&n.push({event:e,listeners:a})}var qv=/\r\n?/g,$v=/\u0000|\uFFFD/g;function qd(n){return(typeof n=="string"?n:""+n).replace(qv,`
`).replace($v,"")}function so(n,e,t){if(e=qd(e),qd(n)!==e&&t)throw Error(ie(425))}function al(){}var Cu=null,Pu=null;function Lu(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Nu=typeof setTimeout=="function"?setTimeout:void 0,Kv=typeof clearTimeout=="function"?clearTimeout:void 0,$d=typeof Promise=="function"?Promise:void 0,Zv=typeof queueMicrotask=="function"?queueMicrotask:typeof $d<"u"?function(n){return $d.resolve(null).then(n).catch(Qv)}:Nu;function Qv(n){setTimeout(function(){throw n})}function gc(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),Aa(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);Aa(e)}function Vi(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function Kd(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Gs=Math.random().toString(36).slice(2),ni="__reactFiber$"+Gs,La="__reactProps$"+Gs,Si="__reactContainer$"+Gs,Du="__reactEvents$"+Gs,Jv="__reactListeners$"+Gs,ex="__reactHandles$"+Gs;function vr(n){var e=n[ni];if(e)return e;for(var t=n.parentNode;t;){if(e=t[Si]||t[ni]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=Kd(n);n!==null;){if(t=n[ni])return t;n=Kd(n)}return e}n=t,t=n.parentNode}return null}function Va(n){return n=n[ni]||n[Si],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function hs(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(ie(33))}function Il(n){return n[La]||null}var Iu=[],ds=-1;function nr(n){return{current:n}}function ct(n){0>ds||(n.current=Iu[ds],Iu[ds]=null,ds--)}function st(n,e){ds++,Iu[ds]=n.current,n.current=e}var Ji={},Xt=nr(Ji),hn=nr(!1),Rr=Ji;function Cs(n,e){var t=n.type.contextTypes;if(!t)return Ji;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function dn(n){return n=n.childContextTypes,n!=null}function ol(){ct(hn),ct(Xt)}function Zd(n,e,t){if(Xt.current!==Ji)throw Error(ie(168));st(Xt,e),st(hn,t)}function u0(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ie(108,F_(n)||"Unknown",r));return _t({},t,i)}function ll(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||Ji,Rr=Xt.current,st(Xt,n),st(hn,hn.current),!0}function Qd(n,e,t){var i=n.stateNode;if(!i)throw Error(ie(169));t?(n=u0(n,e,Rr),i.__reactInternalMemoizedMergedChildContext=n,ct(hn),ct(Xt),st(Xt,n)):ct(hn),st(hn,t)}var fi=null,Ul=!1,_c=!1;function h0(n){fi===null?fi=[n]:fi.push(n)}function tx(n){Ul=!0,h0(n)}function ir(){if(!_c&&fi!==null){_c=!0;var n=0,e=Qe;try{var t=fi;for(Qe=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}fi=null,Ul=!1}catch(r){throw fi!==null&&(fi=fi.slice(n+1)),Om(Mh,ir),r}finally{Qe=e,_c=!1}}return null}var fs=[],ps=0,cl=null,ul=0,bn=[],Cn=0,br=null,gi=1,_i="";function hr(n,e){fs[ps++]=ul,fs[ps++]=cl,cl=n,ul=e}function d0(n,e,t){bn[Cn++]=gi,bn[Cn++]=_i,bn[Cn++]=br,br=n;var i=gi;n=_i;var r=32-Xn(i)-1;i&=~(1<<r),t+=1;var s=32-Xn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,gi=1<<32-Xn(e)+r|t<<r|i,_i=s+n}else gi=1<<s|t<<r|i,_i=n}function Lh(n){n.return!==null&&(hr(n,1),d0(n,1,0))}function Nh(n){for(;n===cl;)cl=fs[--ps],fs[ps]=null,ul=fs[--ps],fs[ps]=null;for(;n===br;)br=bn[--Cn],bn[Cn]=null,_i=bn[--Cn],bn[Cn]=null,gi=bn[--Cn],bn[Cn]=null}var Mn=null,Sn=null,ut=!1,Vn=null;function f0(n,e){var t=Dn(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function Jd(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,Mn=n,Sn=Vi(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,Mn=n,Sn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=br!==null?{id:gi,overflow:_i}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Dn(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,Mn=n,Sn=null,!0):!1;default:return!1}}function Uu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Ou(n){if(ut){var e=Sn;if(e){var t=e;if(!Jd(n,e)){if(Uu(n))throw Error(ie(418));e=Vi(t.nextSibling);var i=Mn;e&&Jd(n,e)?f0(i,t):(n.flags=n.flags&-4097|2,ut=!1,Mn=n)}}else{if(Uu(n))throw Error(ie(418));n.flags=n.flags&-4097|2,ut=!1,Mn=n}}}function ef(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Mn=n}function ao(n){if(n!==Mn)return!1;if(!ut)return ef(n),ut=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!Lu(n.type,n.memoizedProps)),e&&(e=Sn)){if(Uu(n))throw p0(),Error(ie(418));for(;e;)f0(n,e),e=Vi(e.nextSibling)}if(ef(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(ie(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){Sn=Vi(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}Sn=null}}else Sn=Mn?Vi(n.stateNode.nextSibling):null;return!0}function p0(){for(var n=Sn;n;)n=Vi(n.nextSibling)}function Ps(){Sn=Mn=null,ut=!1}function Dh(n){Vn===null?Vn=[n]:Vn.push(n)}var nx=Ti.ReactCurrentBatchConfig;function Ks(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(ie(309));var i=t.stateNode}if(!i)throw Error(ie(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof n!="string")throw Error(ie(284));if(!t._owner)throw Error(ie(290,n))}return n}function oo(n,e){throw n=Object.prototype.toString.call(e),Error(ie(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function tf(n){var e=n._init;return e(n._payload)}function m0(n){function e(u,_){if(n){var g=u.deletions;g===null?(u.deletions=[_],u.flags|=16):g.push(_)}}function t(u,_){if(!n)return null;for(;_!==null;)e(u,_),_=_.sibling;return null}function i(u,_){for(u=new Map;_!==null;)_.key!==null?u.set(_.key,_):u.set(_.index,_),_=_.sibling;return u}function r(u,_){return u=Yi(u,_),u.index=0,u.sibling=null,u}function s(u,_,g){return u.index=g,n?(g=u.alternate,g!==null?(g=g.index,g<_?(u.flags|=2,_):g):(u.flags|=2,_)):(u.flags|=1048576,_)}function a(u){return n&&u.alternate===null&&(u.flags|=2),u}function o(u,_,g,y){return _===null||_.tag!==6?(_=wc(g,u.mode,y),_.return=u,_):(_=r(_,g),_.return=u,_)}function l(u,_,g,y){var C=g.type;return C===os?h(u,_,g.props.children,y,g.key):_!==null&&(_.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===Ni&&tf(C)===_.type)?(y=r(_,g.props),y.ref=Ks(u,_,g),y.return=u,y):(y=Ko(g.type,g.key,g.props,null,u.mode,y),y.ref=Ks(u,_,g),y.return=u,y)}function c(u,_,g,y){return _===null||_.tag!==4||_.stateNode.containerInfo!==g.containerInfo||_.stateNode.implementation!==g.implementation?(_=Tc(g,u.mode,y),_.return=u,_):(_=r(_,g.children||[]),_.return=u,_)}function h(u,_,g,y,C){return _===null||_.tag!==7?(_=Er(g,u.mode,y,C),_.return=u,_):(_=r(_,g),_.return=u,_)}function f(u,_,g){if(typeof _=="string"&&_!==""||typeof _=="number")return _=wc(""+_,u.mode,g),_.return=u,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Ka:return g=Ko(_.type,_.key,_.props,null,u.mode,g),g.ref=Ks(u,null,_),g.return=u,g;case as:return _=Tc(_,u.mode,g),_.return=u,_;case Ni:var y=_._init;return f(u,y(_._payload),g)}if(la(_)||js(_))return _=Er(_,u.mode,g,null),_.return=u,_;oo(u,_)}return null}function d(u,_,g,y){var C=_!==null?_.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return C!==null?null:o(u,_,""+g,y);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Ka:return g.key===C?l(u,_,g,y):null;case as:return g.key===C?c(u,_,g,y):null;case Ni:return C=g._init,d(u,_,C(g._payload),y)}if(la(g)||js(g))return C!==null?null:h(u,_,g,y,null);oo(u,g)}return null}function p(u,_,g,y,C){if(typeof y=="string"&&y!==""||typeof y=="number")return u=u.get(g)||null,o(_,u,""+y,C);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case Ka:return u=u.get(y.key===null?g:y.key)||null,l(_,u,y,C);case as:return u=u.get(y.key===null?g:y.key)||null,c(_,u,y,C);case Ni:var T=y._init;return p(u,_,g,T(y._payload),C)}if(la(y)||js(y))return u=u.get(g)||null,h(_,u,y,C,null);oo(_,y)}return null}function v(u,_,g,y){for(var C=null,T=null,A=_,I=_=0,S=null;A!==null&&I<g.length;I++){A.index>I?(S=A,A=null):S=A.sibling;var E=d(u,A,g[I],y);if(E===null){A===null&&(A=S);break}n&&A&&E.alternate===null&&e(u,A),_=s(E,_,I),T===null?C=E:T.sibling=E,T=E,A=S}if(I===g.length)return t(u,A),ut&&hr(u,I),C;if(A===null){for(;I<g.length;I++)A=f(u,g[I],y),A!==null&&(_=s(A,_,I),T===null?C=A:T.sibling=A,T=A);return ut&&hr(u,I),C}for(A=i(u,A);I<g.length;I++)S=p(A,u,I,g[I],y),S!==null&&(n&&S.alternate!==null&&A.delete(S.key===null?I:S.key),_=s(S,_,I),T===null?C=S:T.sibling=S,T=S);return n&&A.forEach(function(F){return e(u,F)}),ut&&hr(u,I),C}function x(u,_,g,y){var C=js(g);if(typeof C!="function")throw Error(ie(150));if(g=C.call(g),g==null)throw Error(ie(151));for(var T=C=null,A=_,I=_=0,S=null,E=g.next();A!==null&&!E.done;I++,E=g.next()){A.index>I?(S=A,A=null):S=A.sibling;var F=d(u,A,E.value,y);if(F===null){A===null&&(A=S);break}n&&A&&F.alternate===null&&e(u,A),_=s(F,_,I),T===null?C=F:T.sibling=F,T=F,A=S}if(E.done)return t(u,A),ut&&hr(u,I),C;if(A===null){for(;!E.done;I++,E=g.next())E=f(u,E.value,y),E!==null&&(_=s(E,_,I),T===null?C=E:T.sibling=E,T=E);return ut&&hr(u,I),C}for(A=i(u,A);!E.done;I++,E=g.next())E=p(A,u,I,E.value,y),E!==null&&(n&&E.alternate!==null&&A.delete(E.key===null?I:E.key),_=s(E,_,I),T===null?C=E:T.sibling=E,T=E);return n&&A.forEach(function(z){return e(u,z)}),ut&&hr(u,I),C}function m(u,_,g,y){if(typeof g=="object"&&g!==null&&g.type===os&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case Ka:e:{for(var C=g.key,T=_;T!==null;){if(T.key===C){if(C=g.type,C===os){if(T.tag===7){t(u,T.sibling),_=r(T,g.props.children),_.return=u,u=_;break e}}else if(T.elementType===C||typeof C=="object"&&C!==null&&C.$$typeof===Ni&&tf(C)===T.type){t(u,T.sibling),_=r(T,g.props),_.ref=Ks(u,T,g),_.return=u,u=_;break e}t(u,T);break}else e(u,T);T=T.sibling}g.type===os?(_=Er(g.props.children,u.mode,y,g.key),_.return=u,u=_):(y=Ko(g.type,g.key,g.props,null,u.mode,y),y.ref=Ks(u,_,g),y.return=u,u=y)}return a(u);case as:e:{for(T=g.key;_!==null;){if(_.key===T)if(_.tag===4&&_.stateNode.containerInfo===g.containerInfo&&_.stateNode.implementation===g.implementation){t(u,_.sibling),_=r(_,g.children||[]),_.return=u,u=_;break e}else{t(u,_);break}else e(u,_);_=_.sibling}_=Tc(g,u.mode,y),_.return=u,u=_}return a(u);case Ni:return T=g._init,m(u,_,T(g._payload),y)}if(la(g))return v(u,_,g,y);if(js(g))return x(u,_,g,y);oo(u,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,_!==null&&_.tag===6?(t(u,_.sibling),_=r(_,g),_.return=u,u=_):(t(u,_),_=wc(g,u.mode,y),_.return=u,u=_),a(u)):t(u,_)}return m}var Ls=m0(!0),g0=m0(!1),hl=nr(null),dl=null,ms=null,Ih=null;function Uh(){Ih=ms=dl=null}function Oh(n){var e=hl.current;ct(hl),n._currentValue=e}function ku(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function ws(n,e){dl=n,Ih=ms=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(un=!0),n.firstContext=null)}function Un(n){var e=n._currentValue;if(Ih!==n)if(n={context:n,memoizedValue:e,next:null},ms===null){if(dl===null)throw Error(ie(308));ms=n,dl.dependencies={lanes:0,firstContext:n}}else ms=ms.next=n;return e}var xr=null;function kh(n){xr===null?xr=[n]:xr.push(n)}function _0(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,kh(e)):(t.next=r.next,r.next=t),e.interleaved=t,Mi(n,i)}function Mi(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var Di=!1;function Fh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function v0(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function xi(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function Wi(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,Ke&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Mi(n,t)}return r=i.interleaved,r===null?(e.next=e,kh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Mi(n,t)}function Wo(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Eh(n,t)}}function nf(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var a={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=a:s=s.next=a,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function fl(n,e,t,i){var r=n.updateQueue;Di=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var h=n.alternate;h!==null&&(h=h.updateQueue,o=h.lastBaseUpdate,o!==a&&(o===null?h.firstBaseUpdate=c:o.next=c,h.lastBaseUpdate=l))}if(s!==null){var f=r.baseState;a=0,h=c=l=null,o=s;do{var d=o.lane,p=o.eventTime;if((i&d)===d){h!==null&&(h=h.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var v=n,x=o;switch(d=e,p=t,x.tag){case 1:if(v=x.payload,typeof v=="function"){f=v.call(p,f,d);break e}f=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=x.payload,d=typeof v=="function"?v.call(p,f,d):v,d==null)break e;f=_t({},f,d);break e;case 2:Di=!0}}o.callback!==null&&o.lane!==0&&(n.flags|=64,d=r.effects,d===null?r.effects=[o]:d.push(o))}else p={eventTime:p,lane:d,tag:o.tag,payload:o.payload,callback:o.callback,next:null},h===null?(c=h=p,l=f):h=h.next=p,a|=d;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;d=o,o=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(h===null&&(l=f),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=h,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Pr|=a,n.lanes=a,n.memoizedState=f}}function rf(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(ie(191,r));r.call(i)}}}var Wa={},ri=nr(Wa),Na=nr(Wa),Da=nr(Wa);function yr(n){if(n===Wa)throw Error(ie(174));return n}function Bh(n,e){switch(st(Da,e),st(Na,n),st(ri,Wa),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:_u(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=_u(e,n)}ct(ri),st(ri,e)}function Ns(){ct(ri),ct(Na),ct(Da)}function x0(n){yr(Da.current);var e=yr(ri.current),t=_u(e,n.type);e!==t&&(st(Na,n),st(ri,t))}function zh(n){Na.current===n&&(ct(ri),ct(Na))}var mt=nr(0);function pl(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var vc=[];function Gh(){for(var n=0;n<vc.length;n++)vc[n]._workInProgressVersionPrimary=null;vc.length=0}var jo=Ti.ReactCurrentDispatcher,xc=Ti.ReactCurrentBatchConfig,Cr=0,gt=null,At=null,It=null,ml=!1,ga=!1,Ia=0,ix=0;function Gt(){throw Error(ie(321))}function Hh(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!Kn(n[t],e[t]))return!1;return!0}function Vh(n,e,t,i,r,s){if(Cr=s,gt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,jo.current=n===null||n.memoizedState===null?ox:lx,n=t(i,r),ga){s=0;do{if(ga=!1,Ia=0,25<=s)throw Error(ie(301));s+=1,It=At=null,e.updateQueue=null,jo.current=cx,n=t(i,r)}while(ga)}if(jo.current=gl,e=At!==null&&At.next!==null,Cr=0,It=At=gt=null,ml=!1,e)throw Error(ie(300));return n}function Wh(){var n=Ia!==0;return Ia=0,n}function ei(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return It===null?gt.memoizedState=It=n:It=It.next=n,It}function On(){if(At===null){var n=gt.alternate;n=n!==null?n.memoizedState:null}else n=At.next;var e=It===null?gt.memoizedState:It.next;if(e!==null)It=e,At=n;else{if(n===null)throw Error(ie(310));At=n,n={memoizedState:At.memoizedState,baseState:At.baseState,baseQueue:At.baseQueue,queue:At.queue,next:null},It===null?gt.memoizedState=It=n:It=It.next=n}return It}function Ua(n,e){return typeof e=="function"?e(n):e}function yc(n){var e=On(),t=e.queue;if(t===null)throw Error(ie(311));t.lastRenderedReducer=n;var i=At,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var h=c.lane;if((Cr&h)===h)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:n(i,c.action);else{var f={lane:h,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=f,a=i):l=l.next=f,gt.lanes|=h,Pr|=h}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,Kn(i,e.memoizedState)||(un=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,gt.lanes|=s,Pr|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function Sc(n){var e=On(),t=e.queue;if(t===null)throw Error(ie(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var a=r=r.next;do s=n(s,a.action),a=a.next;while(a!==r);Kn(s,e.memoizedState)||(un=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function y0(){}function S0(n,e){var t=gt,i=On(),r=e(),s=!Kn(i.memoizedState,r);if(s&&(i.memoizedState=r,un=!0),i=i.queue,jh(w0.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||It!==null&&It.memoizedState.tag&1){if(t.flags|=2048,Oa(9,E0.bind(null,t,i,r,e),void 0,null),Ut===null)throw Error(ie(349));Cr&30||M0(t,e,r)}return r}function M0(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function E0(n,e,t,i){e.value=t,e.getSnapshot=i,T0(e)&&A0(n)}function w0(n,e,t){return t(function(){T0(e)&&A0(n)})}function T0(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!Kn(n,t)}catch{return!0}}function A0(n){var e=Mi(n,1);e!==null&&Yn(e,n,1,-1)}function sf(n){var e=ei();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ua,lastRenderedState:n},e.queue=n,n=n.dispatch=ax.bind(null,gt,n),[e.memoizedState,n]}function Oa(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function R0(){return On().memoizedState}function Xo(n,e,t,i){var r=ei();gt.flags|=n,r.memoizedState=Oa(1|e,t,void 0,i===void 0?null:i)}function Ol(n,e,t,i){var r=On();i=i===void 0?null:i;var s=void 0;if(At!==null){var a=At.memoizedState;if(s=a.destroy,i!==null&&Hh(i,a.deps)){r.memoizedState=Oa(e,t,s,i);return}}gt.flags|=n,r.memoizedState=Oa(1|e,t,s,i)}function af(n,e){return Xo(8390656,8,n,e)}function jh(n,e){return Ol(2048,8,n,e)}function b0(n,e){return Ol(4,2,n,e)}function C0(n,e){return Ol(4,4,n,e)}function P0(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function L0(n,e,t){return t=t!=null?t.concat([n]):null,Ol(4,4,P0.bind(null,e,n),t)}function Xh(){}function N0(n,e){var t=On();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Hh(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function D0(n,e){var t=On();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Hh(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function I0(n,e,t){return Cr&21?(Kn(t,e)||(t=Bm(),gt.lanes|=t,Pr|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,un=!0),n.memoizedState=t)}function rx(n,e){var t=Qe;Qe=t!==0&&4>t?t:4,n(!0);var i=xc.transition;xc.transition={};try{n(!1),e()}finally{Qe=t,xc.transition=i}}function U0(){return On().memoizedState}function sx(n,e,t){var i=Xi(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},O0(n))k0(e,t);else if(t=_0(n,e,t,i),t!==null){var r=nn();Yn(t,n,i,r),F0(t,e,i)}}function ax(n,e,t){var i=Xi(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(O0(n))k0(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,t);if(r.hasEagerState=!0,r.eagerState=o,Kn(o,a)){var l=e.interleaved;l===null?(r.next=r,kh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=_0(n,e,r,i),t!==null&&(r=nn(),Yn(t,n,i,r),F0(t,e,i))}}function O0(n){var e=n.alternate;return n===gt||e!==null&&e===gt}function k0(n,e){ga=ml=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function F0(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Eh(n,t)}}var gl={readContext:Un,useCallback:Gt,useContext:Gt,useEffect:Gt,useImperativeHandle:Gt,useInsertionEffect:Gt,useLayoutEffect:Gt,useMemo:Gt,useReducer:Gt,useRef:Gt,useState:Gt,useDebugValue:Gt,useDeferredValue:Gt,useTransition:Gt,useMutableSource:Gt,useSyncExternalStore:Gt,useId:Gt,unstable_isNewReconciler:!1},ox={readContext:Un,useCallback:function(n,e){return ei().memoizedState=[n,e===void 0?null:e],n},useContext:Un,useEffect:af,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,Xo(4194308,4,P0.bind(null,e,n),t)},useLayoutEffect:function(n,e){return Xo(4194308,4,n,e)},useInsertionEffect:function(n,e){return Xo(4,2,n,e)},useMemo:function(n,e){var t=ei();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=ei();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=sx.bind(null,gt,n),[i.memoizedState,n]},useRef:function(n){var e=ei();return n={current:n},e.memoizedState=n},useState:sf,useDebugValue:Xh,useDeferredValue:function(n){return ei().memoizedState=n},useTransition:function(){var n=sf(!1),e=n[0];return n=rx.bind(null,n[1]),ei().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=gt,r=ei();if(ut){if(t===void 0)throw Error(ie(407));t=t()}else{if(t=e(),Ut===null)throw Error(ie(349));Cr&30||M0(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,af(w0.bind(null,i,s,n),[n]),i.flags|=2048,Oa(9,E0.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=ei(),e=Ut.identifierPrefix;if(ut){var t=_i,i=gi;t=(i&~(1<<32-Xn(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Ia++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=ix++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},lx={readContext:Un,useCallback:N0,useContext:Un,useEffect:jh,useImperativeHandle:L0,useInsertionEffect:b0,useLayoutEffect:C0,useMemo:D0,useReducer:yc,useRef:R0,useState:function(){return yc(Ua)},useDebugValue:Xh,useDeferredValue:function(n){var e=On();return I0(e,At.memoizedState,n)},useTransition:function(){var n=yc(Ua)[0],e=On().memoizedState;return[n,e]},useMutableSource:y0,useSyncExternalStore:S0,useId:U0,unstable_isNewReconciler:!1},cx={readContext:Un,useCallback:N0,useContext:Un,useEffect:jh,useImperativeHandle:L0,useInsertionEffect:b0,useLayoutEffect:C0,useMemo:D0,useReducer:Sc,useRef:R0,useState:function(){return Sc(Ua)},useDebugValue:Xh,useDeferredValue:function(n){var e=On();return At===null?e.memoizedState=n:I0(e,At.memoizedState,n)},useTransition:function(){var n=Sc(Ua)[0],e=On().memoizedState;return[n,e]},useMutableSource:y0,useSyncExternalStore:S0,useId:U0,unstable_isNewReconciler:!1};function Gn(n,e){if(n&&n.defaultProps){e=_t({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function Fu(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:_t({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var kl={isMounted:function(n){return(n=n._reactInternals)?kr(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=nn(),r=Xi(n),s=xi(i,r);s.payload=e,t!=null&&(s.callback=t),e=Wi(n,s,r),e!==null&&(Yn(e,n,r,i),Wo(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=nn(),r=Xi(n),s=xi(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=Wi(n,s,r),e!==null&&(Yn(e,n,r,i),Wo(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=nn(),i=Xi(n),r=xi(t,i);r.tag=2,e!=null&&(r.callback=e),e=Wi(n,r,i),e!==null&&(Yn(e,n,i,t),Wo(e,n,i))}};function of(n,e,t,i,r,s,a){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!ba(t,i)||!ba(r,s):!0}function B0(n,e,t){var i=!1,r=Ji,s=e.contextType;return typeof s=="object"&&s!==null?s=Un(s):(r=dn(e)?Rr:Xt.current,i=e.contextTypes,s=(i=i!=null)?Cs(n,r):Ji),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=kl,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function lf(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&kl.enqueueReplaceState(e,e.state,null)}function Bu(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},Fh(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Un(s):(s=dn(e)?Rr:Xt.current,r.context=Cs(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Fu(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&kl.enqueueReplaceState(r,r.state,null),fl(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function Ds(n,e){try{var t="",i=e;do t+=k_(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Mc(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function zu(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var ux=typeof WeakMap=="function"?WeakMap:Map;function z0(n,e,t){t=xi(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){vl||(vl=!0,Ku=i),zu(n,e)},t}function G0(n,e,t){t=xi(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){zu(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){zu(n,e),typeof i!="function"&&(ji===null?ji=new Set([this]):ji.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),t}function cf(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new ux;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=wx.bind(null,n,e,t),e.then(n,n))}function uf(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function hf(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=xi(-1,1),e.tag=2,Wi(t,e,1))),t.lanes|=1),n)}var hx=Ti.ReactCurrentOwner,un=!1;function Jt(n,e,t,i){e.child=n===null?g0(e,null,t,i):Ls(e,n.child,t,i)}function df(n,e,t,i,r){t=t.render;var s=e.ref;return ws(e,r),i=Vh(n,e,t,i,s,r),t=Wh(),n!==null&&!un?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ei(n,e,r)):(ut&&t&&Lh(e),e.flags|=1,Jt(n,e,i,r),e.child)}function ff(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!ed(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,H0(n,e,s,i,r)):(n=Ko(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var a=s.memoizedProps;if(t=t.compare,t=t!==null?t:ba,t(a,i)&&n.ref===e.ref)return Ei(n,e,r)}return e.flags|=1,n=Yi(s,i),n.ref=e.ref,n.return=e,e.child=n}function H0(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(ba(s,i)&&n.ref===e.ref)if(un=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(un=!0);else return e.lanes=n.lanes,Ei(n,e,r)}return Gu(n,e,t,i,r)}function V0(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},st(_s,xn),xn|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,st(_s,xn),xn|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,st(_s,xn),xn|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,st(_s,xn),xn|=i;return Jt(n,e,r,t),e.child}function W0(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function Gu(n,e,t,i,r){var s=dn(t)?Rr:Xt.current;return s=Cs(e,s),ws(e,r),t=Vh(n,e,t,i,s,r),i=Wh(),n!==null&&!un?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ei(n,e,r)):(ut&&i&&Lh(e),e.flags|=1,Jt(n,e,t,r),e.child)}function pf(n,e,t,i,r){if(dn(t)){var s=!0;ll(e)}else s=!1;if(ws(e,r),e.stateNode===null)Yo(n,e),B0(e,t,i),Bu(e,t,i,r),i=!0;else if(n===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=t.contextType;typeof c=="object"&&c!==null?c=Un(c):(c=dn(t)?Rr:Xt.current,c=Cs(e,c));var h=t.getDerivedStateFromProps,f=typeof h=="function"||typeof a.getSnapshotBeforeUpdate=="function";f||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&lf(e,a,i,c),Di=!1;var d=e.memoizedState;a.state=d,fl(e,i,a,r),l=e.memoizedState,o!==i||d!==l||hn.current||Di?(typeof h=="function"&&(Fu(e,t,h,i),l=e.memoizedState),(o=Di||of(e,t,o,i,d,l,c))?(f||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,v0(n,e),o=e.memoizedProps,c=e.type===e.elementType?o:Gn(e.type,o),a.props=c,f=e.pendingProps,d=a.context,l=t.contextType,typeof l=="object"&&l!==null?l=Un(l):(l=dn(t)?Rr:Xt.current,l=Cs(e,l));var p=t.getDerivedStateFromProps;(h=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==f||d!==l)&&lf(e,a,i,l),Di=!1,d=e.memoizedState,a.state=d,fl(e,i,a,r);var v=e.memoizedState;o!==f||d!==v||hn.current||Di?(typeof p=="function"&&(Fu(e,t,p,i),v=e.memoizedState),(c=Di||of(e,t,c,i,d,v,l)||!1)?(h||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,v,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,v,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===n.memoizedProps&&d===n.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===n.memoizedProps&&d===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),a.props=i,a.state=v,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===n.memoizedProps&&d===n.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===n.memoizedProps&&d===n.memoizedState||(e.flags|=1024),i=!1)}return Hu(n,e,t,i,s,r)}function Hu(n,e,t,i,r,s){W0(n,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Qd(e,t,!1),Ei(n,e,s);i=e.stateNode,hx.current=e;var o=a&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&a?(e.child=Ls(e,n.child,null,s),e.child=Ls(e,null,o,s)):Jt(n,e,o,s),e.memoizedState=i.state,r&&Qd(e,t,!0),e.child}function j0(n){var e=n.stateNode;e.pendingContext?Zd(n,e.pendingContext,e.pendingContext!==e.context):e.context&&Zd(n,e.context,!1),Bh(n,e.containerInfo)}function mf(n,e,t,i,r){return Ps(),Dh(r),e.flags|=256,Jt(n,e,t,i),e.child}var Vu={dehydrated:null,treeContext:null,retryLane:0};function Wu(n){return{baseLanes:n,cachePool:null,transitions:null}}function X0(n,e,t){var i=e.pendingProps,r=mt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=n!==null&&n.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),st(mt,r&1),n===null)return Ou(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,n=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=zl(a,i,0,null),n=Er(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=Wu(t),e.memoizedState=Vu,n):Yh(e,a));if(r=n.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return dx(n,e,a,i,o,r,t);if(s){s=i.fallback,a=e.mode,r=n.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Yi(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=Yi(o,s):(s=Er(s,a,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=n.child.memoizedState,a=a===null?Wu(t):{baseLanes:a.baseLanes|t,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=n.childLanes&~t,e.memoizedState=Vu,i}return s=n.child,n=s.sibling,i=Yi(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function Yh(n,e){return e=zl({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function lo(n,e,t,i){return i!==null&&Dh(i),Ls(e,n.child,null,t),n=Yh(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function dx(n,e,t,i,r,s,a){if(t)return e.flags&256?(e.flags&=-257,i=Mc(Error(ie(422))),lo(n,e,a,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=zl({mode:"visible",children:i.children},r,0,null),s=Er(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ls(e,n.child,null,a),e.child.memoizedState=Wu(a),e.memoizedState=Vu,s);if(!(e.mode&1))return lo(n,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(ie(419)),i=Mc(s,i,void 0),lo(n,e,a,i)}if(o=(a&n.childLanes)!==0,un||o){if(i=Ut,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Mi(n,r),Yn(i,n,r,-1))}return Jh(),i=Mc(Error(ie(421))),lo(n,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=Tx.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,Sn=Vi(r.nextSibling),Mn=e,ut=!0,Vn=null,n!==null&&(bn[Cn++]=gi,bn[Cn++]=_i,bn[Cn++]=br,gi=n.id,_i=n.overflow,br=e),e=Yh(e,i.children),e.flags|=4096,e)}function gf(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),ku(n.return,e,t)}function Ec(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function Y0(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Jt(n,e,i.children,t),i=mt.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&gf(n,t,e);else if(n.tag===19)gf(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(st(mt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&pl(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Ec(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&pl(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Ec(e,!0,t,null,s);break;case"together":Ec(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Yo(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Ei(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),Pr|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(ie(153));if(e.child!==null){for(n=e.child,t=Yi(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=Yi(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function fx(n,e,t){switch(e.tag){case 3:j0(e),Ps();break;case 5:x0(e);break;case 1:dn(e.type)&&ll(e);break;case 4:Bh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;st(hl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(st(mt,mt.current&1),e.flags|=128,null):t&e.child.childLanes?X0(n,e,t):(st(mt,mt.current&1),n=Ei(n,e,t),n!==null?n.sibling:null);st(mt,mt.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return Y0(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),st(mt,mt.current),i)break;return null;case 22:case 23:return e.lanes=0,V0(n,e,t)}return Ei(n,e,t)}var q0,ju,$0,K0;q0=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};ju=function(){};$0=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,yr(ri.current);var s=null;switch(t){case"input":r=fu(n,r),i=fu(n,i),s=[];break;case"select":r=_t({},r,{value:void 0}),i=_t({},i,{value:void 0}),s=[];break;case"textarea":r=gu(n,r),i=gu(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=al)}vu(t,i);var a;t=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(t||(t={}),t[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Sa.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(t||(t={}),t[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(t||(t={}),t[a]=l[a])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Sa.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&at("scroll",n),s||o===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};K0=function(n,e,t,i){t!==i&&(e.flags|=4)};function Zs(n,e){if(!ut)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function Ht(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function px(n,e,t){var i=e.pendingProps;switch(Nh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ht(e),null;case 1:return dn(e.type)&&ol(),Ht(e),null;case 3:return i=e.stateNode,Ns(),ct(hn),ct(Xt),Gh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(ao(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Vn!==null&&(Ju(Vn),Vn=null))),ju(n,e),Ht(e),null;case 5:zh(e);var r=yr(Da.current);if(t=e.type,n!==null&&e.stateNode!=null)$0(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ie(166));return Ht(e),null}if(n=yr(ri.current),ao(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[ni]=e,i[La]=s,n=(e.mode&1)!==0,t){case"dialog":at("cancel",i),at("close",i);break;case"iframe":case"object":case"embed":at("load",i);break;case"video":case"audio":for(r=0;r<ua.length;r++)at(ua[r],i);break;case"source":at("error",i);break;case"img":case"image":case"link":at("error",i),at("load",i);break;case"details":at("toggle",i);break;case"input":wd(i,s),at("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},at("invalid",i);break;case"textarea":Ad(i,s),at("invalid",i)}vu(t,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&so(i.textContent,o,n),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&so(i.textContent,o,n),r=["children",""+o]):Sa.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&at("scroll",i)}switch(t){case"input":Za(i),Td(i,s,!0);break;case"textarea":Za(i),Rd(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=al)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=wm(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=a.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=a.createElement(t,{is:i.is}):(n=a.createElement(t),t==="select"&&(a=n,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):n=a.createElementNS(n,t),n[ni]=e,n[La]=i,q0(n,e,!1,!1),e.stateNode=n;e:{switch(a=xu(t,i),t){case"dialog":at("cancel",n),at("close",n),r=i;break;case"iframe":case"object":case"embed":at("load",n),r=i;break;case"video":case"audio":for(r=0;r<ua.length;r++)at(ua[r],n);r=i;break;case"source":at("error",n),r=i;break;case"img":case"image":case"link":at("error",n),at("load",n),r=i;break;case"details":at("toggle",n),r=i;break;case"input":wd(n,i),r=fu(n,i),at("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=_t({},i,{value:void 0}),at("invalid",n);break;case"textarea":Ad(n,i),r=gu(n,i),at("invalid",n);break;default:r=i}vu(t,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?Rm(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Tm(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&Ma(n,l):typeof l=="number"&&Ma(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Sa.hasOwnProperty(s)?l!=null&&s==="onScroll"&&at("scroll",n):l!=null&&_h(n,s,l,a))}switch(t){case"input":Za(n),Td(n,i,!1);break;case"textarea":Za(n),Rd(n);break;case"option":i.value!=null&&n.setAttribute("value",""+Qi(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?ys(n,!!i.multiple,s,!1):i.defaultValue!=null&&ys(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=al)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Ht(e),null;case 6:if(n&&e.stateNode!=null)K0(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ie(166));if(t=yr(Da.current),yr(ri.current),ao(e)){if(i=e.stateNode,t=e.memoizedProps,i[ni]=e,(s=i.nodeValue!==t)&&(n=Mn,n!==null))switch(n.tag){case 3:so(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&so(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[ni]=e,e.stateNode=i}return Ht(e),null;case 13:if(ct(mt),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(ut&&Sn!==null&&e.mode&1&&!(e.flags&128))p0(),Ps(),e.flags|=98560,s=!1;else if(s=ao(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(ie(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ie(317));s[ni]=e}else Ps(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Ht(e),s=!1}else Vn!==null&&(Ju(Vn),Vn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||mt.current&1?Rt===0&&(Rt=3):Jh())),e.updateQueue!==null&&(e.flags|=4),Ht(e),null);case 4:return Ns(),ju(n,e),n===null&&Ca(e.stateNode.containerInfo),Ht(e),null;case 10:return Oh(e.type._context),Ht(e),null;case 17:return dn(e.type)&&ol(),Ht(e),null;case 19:if(ct(mt),s=e.memoizedState,s===null)return Ht(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)Zs(s,!1);else{if(Rt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(a=pl(n),a!==null){for(e.flags|=128,Zs(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,n=a.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return st(mt,mt.current&1|2),e.child}n=n.sibling}s.tail!==null&&Et()>Is&&(e.flags|=128,i=!0,Zs(s,!1),e.lanes=4194304)}else{if(!i)if(n=pl(a),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),Zs(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!ut)return Ht(e),null}else 2*Et()-s.renderingStartTime>Is&&t!==1073741824&&(e.flags|=128,i=!0,Zs(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(t=s.last,t!==null?t.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Et(),e.sibling=null,t=mt.current,st(mt,i?t&1|2:t&1),e):(Ht(e),null);case 22:case 23:return Qh(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?xn&1073741824&&(Ht(e),e.subtreeFlags&6&&(e.flags|=8192)):Ht(e),null;case 24:return null;case 25:return null}throw Error(ie(156,e.tag))}function mx(n,e){switch(Nh(e),e.tag){case 1:return dn(e.type)&&ol(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Ns(),ct(hn),ct(Xt),Gh(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return zh(e),null;case 13:if(ct(mt),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(ie(340));Ps()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return ct(mt),null;case 4:return Ns(),null;case 10:return Oh(e.type._context),null;case 22:case 23:return Qh(),null;case 24:return null;default:return null}}var co=!1,jt=!1,gx=typeof WeakSet=="function"?WeakSet:Set,pe=null;function gs(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){yt(n,e,i)}else t.current=null}function Xu(n,e,t){try{t()}catch(i){yt(n,e,i)}}var _f=!1;function _x(n,e){if(Cu=il,n=t0(),Ph(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var a=0,o=-1,l=-1,c=0,h=0,f=n,d=null;t:for(;;){for(var p;f!==t||r!==0&&f.nodeType!==3||(o=a+r),f!==s||i!==0&&f.nodeType!==3||(l=a+i),f.nodeType===3&&(a+=f.nodeValue.length),(p=f.firstChild)!==null;)d=f,f=p;for(;;){if(f===n)break t;if(d===t&&++c===r&&(o=a),d===s&&++h===i&&(l=a),(p=f.nextSibling)!==null)break;f=d,d=f.parentNode}f=p}t=o===-1||l===-1?null:{start:o,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(Pu={focusedElem:n,selectionRange:t},il=!1,pe=e;pe!==null;)if(e=pe,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,pe=n;else for(;pe!==null;){e=pe;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var x=v.memoizedProps,m=v.memoizedState,u=e.stateNode,_=u.getSnapshotBeforeUpdate(e.elementType===e.type?x:Gn(e.type,x),m);u.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var g=e.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ie(163))}}catch(y){yt(e,e.return,y)}if(n=e.sibling,n!==null){n.return=e.return,pe=n;break}pe=e.return}return v=_f,_f=!1,v}function _a(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&Xu(e,t,s)}r=r.next}while(r!==i)}}function Fl(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function Yu(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function Z0(n){var e=n.alternate;e!==null&&(n.alternate=null,Z0(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[ni],delete e[La],delete e[Du],delete e[Jv],delete e[ex])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Q0(n){return n.tag===5||n.tag===3||n.tag===4}function vf(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Q0(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function qu(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=al));else if(i!==4&&(n=n.child,n!==null))for(qu(n,e,t),n=n.sibling;n!==null;)qu(n,e,t),n=n.sibling}function $u(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for($u(n,e,t),n=n.sibling;n!==null;)$u(n,e,t),n=n.sibling}var Ot=null,Hn=!1;function Ai(n,e,t){for(t=t.child;t!==null;)J0(n,e,t),t=t.sibling}function J0(n,e,t){if(ii&&typeof ii.onCommitFiberUnmount=="function")try{ii.onCommitFiberUnmount(Pl,t)}catch{}switch(t.tag){case 5:jt||gs(t,e);case 6:var i=Ot,r=Hn;Ot=null,Ai(n,e,t),Ot=i,Hn=r,Ot!==null&&(Hn?(n=Ot,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Ot.removeChild(t.stateNode));break;case 18:Ot!==null&&(Hn?(n=Ot,t=t.stateNode,n.nodeType===8?gc(n.parentNode,t):n.nodeType===1&&gc(n,t),Aa(n)):gc(Ot,t.stateNode));break;case 4:i=Ot,r=Hn,Ot=t.stateNode.containerInfo,Hn=!0,Ai(n,e,t),Ot=i,Hn=r;break;case 0:case 11:case 14:case 15:if(!jt&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Xu(t,e,a),r=r.next}while(r!==i)}Ai(n,e,t);break;case 1:if(!jt&&(gs(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(o){yt(t,e,o)}Ai(n,e,t);break;case 21:Ai(n,e,t);break;case 22:t.mode&1?(jt=(i=jt)||t.memoizedState!==null,Ai(n,e,t),jt=i):Ai(n,e,t);break;default:Ai(n,e,t)}}function xf(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new gx),e.forEach(function(i){var r=Ax.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function kn(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:Ot=o.stateNode,Hn=!1;break e;case 3:Ot=o.stateNode.containerInfo,Hn=!0;break e;case 4:Ot=o.stateNode.containerInfo,Hn=!0;break e}o=o.return}if(Ot===null)throw Error(ie(160));J0(s,a,r),Ot=null,Hn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){yt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)eg(e,n),e=e.sibling}function eg(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(kn(e,n),Jn(n),i&4){try{_a(3,n,n.return),Fl(3,n)}catch(x){yt(n,n.return,x)}try{_a(5,n,n.return)}catch(x){yt(n,n.return,x)}}break;case 1:kn(e,n),Jn(n),i&512&&t!==null&&gs(t,t.return);break;case 5:if(kn(e,n),Jn(n),i&512&&t!==null&&gs(t,t.return),n.flags&32){var r=n.stateNode;try{Ma(r,"")}catch(x){yt(n,n.return,x)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,a=t!==null?t.memoizedProps:s,o=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Mm(r,s),xu(o,a);var c=xu(o,s);for(a=0;a<l.length;a+=2){var h=l[a],f=l[a+1];h==="style"?Rm(r,f):h==="dangerouslySetInnerHTML"?Tm(r,f):h==="children"?Ma(r,f):_h(r,h,f,c)}switch(o){case"input":pu(r,s);break;case"textarea":Em(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?ys(r,!!s.multiple,p,!1):d!==!!s.multiple&&(s.defaultValue!=null?ys(r,!!s.multiple,s.defaultValue,!0):ys(r,!!s.multiple,s.multiple?[]:"",!1))}r[La]=s}catch(x){yt(n,n.return,x)}}break;case 6:if(kn(e,n),Jn(n),i&4){if(n.stateNode===null)throw Error(ie(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(x){yt(n,n.return,x)}}break;case 3:if(kn(e,n),Jn(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{Aa(e.containerInfo)}catch(x){yt(n,n.return,x)}break;case 4:kn(e,n),Jn(n);break;case 13:kn(e,n),Jn(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Kh=Et())),i&4&&xf(n);break;case 22:if(h=t!==null&&t.memoizedState!==null,n.mode&1?(jt=(c=jt)||h,kn(e,n),jt=c):kn(e,n),Jn(n),i&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!h&&n.mode&1)for(pe=n,h=n.child;h!==null;){for(f=pe=h;pe!==null;){switch(d=pe,p=d.child,d.tag){case 0:case 11:case 14:case 15:_a(4,d,d.return);break;case 1:gs(d,d.return);var v=d.stateNode;if(typeof v.componentWillUnmount=="function"){i=d,t=d.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(x){yt(i,t,x)}}break;case 5:gs(d,d.return);break;case 22:if(d.memoizedState!==null){Sf(f);continue}}p!==null?(p.return=d,pe=p):Sf(f)}h=h.sibling}e:for(h=null,f=n;;){if(f.tag===5){if(h===null){h=f;try{r=f.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=f.stateNode,l=f.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=Am("display",a))}catch(x){yt(n,n.return,x)}}}else if(f.tag===6){if(h===null)try{f.stateNode.nodeValue=c?"":f.memoizedProps}catch(x){yt(n,n.return,x)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===n)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===n)break e;for(;f.sibling===null;){if(f.return===null||f.return===n)break e;h===f&&(h=null),f=f.return}h===f&&(h=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:kn(e,n),Jn(n),i&4&&xf(n);break;case 21:break;default:kn(e,n),Jn(n)}}function Jn(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(Q0(t)){var i=t;break e}t=t.return}throw Error(ie(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Ma(r,""),i.flags&=-33);var s=vf(n);$u(n,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=vf(n);qu(n,o,a);break;default:throw Error(ie(161))}}catch(l){yt(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function vx(n,e,t){pe=n,tg(n)}function tg(n,e,t){for(var i=(n.mode&1)!==0;pe!==null;){var r=pe,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||co;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||jt;o=co;var c=jt;if(co=a,(jt=l)&&!c)for(pe=r;pe!==null;)a=pe,l=a.child,a.tag===22&&a.memoizedState!==null?Mf(r):l!==null?(l.return=a,pe=l):Mf(r);for(;s!==null;)pe=s,tg(s),s=s.sibling;pe=r,co=o,jt=c}yf(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,pe=s):yf(n)}}function yf(n){for(;pe!==null;){var e=pe;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:jt||Fl(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!jt)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:Gn(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&rf(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}rf(e,a,t)}break;case 5:var o=e.stateNode;if(t===null&&e.flags&4){t=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var h=c.memoizedState;if(h!==null){var f=h.dehydrated;f!==null&&Aa(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ie(163))}jt||e.flags&512&&Yu(e)}catch(d){yt(e,e.return,d)}}if(e===n){pe=null;break}if(t=e.sibling,t!==null){t.return=e.return,pe=t;break}pe=e.return}}function Sf(n){for(;pe!==null;){var e=pe;if(e===n){pe=null;break}var t=e.sibling;if(t!==null){t.return=e.return,pe=t;break}pe=e.return}}function Mf(n){for(;pe!==null;){var e=pe;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{Fl(4,e)}catch(l){yt(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){yt(e,r,l)}}var s=e.return;try{Yu(e)}catch(l){yt(e,s,l)}break;case 5:var a=e.return;try{Yu(e)}catch(l){yt(e,a,l)}}}catch(l){yt(e,e.return,l)}if(e===n){pe=null;break}var o=e.sibling;if(o!==null){o.return=e.return,pe=o;break}pe=e.return}}var xx=Math.ceil,_l=Ti.ReactCurrentDispatcher,qh=Ti.ReactCurrentOwner,In=Ti.ReactCurrentBatchConfig,Ke=0,Ut=null,Tt=null,Ft=0,xn=0,_s=nr(0),Rt=0,ka=null,Pr=0,Bl=0,$h=0,va=null,on=null,Kh=0,Is=1/0,di=null,vl=!1,Ku=null,ji=null,uo=!1,ki=null,xl=0,xa=0,Zu=null,qo=-1,$o=0;function nn(){return Ke&6?Et():qo!==-1?qo:qo=Et()}function Xi(n){return n.mode&1?Ke&2&&Ft!==0?Ft&-Ft:nx.transition!==null?($o===0&&($o=Bm()),$o):(n=Qe,n!==0||(n=window.event,n=n===void 0?16:Xm(n.type)),n):1}function Yn(n,e,t,i){if(50<xa)throw xa=0,Zu=null,Error(ie(185));Ga(n,t,i),(!(Ke&2)||n!==Ut)&&(n===Ut&&(!(Ke&2)&&(Bl|=t),Rt===4&&Ui(n,Ft)),fn(n,i),t===1&&Ke===0&&!(e.mode&1)&&(Is=Et()+500,Ul&&ir()))}function fn(n,e){var t=n.callbackNode;nv(n,e);var i=nl(n,n===Ut?Ft:0);if(i===0)t!==null&&Pd(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&Pd(t),e===1)n.tag===0?tx(Ef.bind(null,n)):h0(Ef.bind(null,n)),Zv(function(){!(Ke&6)&&ir()}),t=null;else{switch(zm(i)){case 1:t=Mh;break;case 4:t=km;break;case 16:t=tl;break;case 536870912:t=Fm;break;default:t=tl}t=cg(t,ng.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function ng(n,e){if(qo=-1,$o=0,Ke&6)throw Error(ie(327));var t=n.callbackNode;if(Ts()&&n.callbackNode!==t)return null;var i=nl(n,n===Ut?Ft:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=yl(n,i);else{e=i;var r=Ke;Ke|=2;var s=rg();(Ut!==n||Ft!==e)&&(di=null,Is=Et()+500,Mr(n,e));do try{Mx();break}catch(o){ig(n,o)}while(!0);Uh(),_l.current=s,Ke=r,Tt!==null?e=0:(Ut=null,Ft=0,e=Rt)}if(e!==0){if(e===2&&(r=wu(n),r!==0&&(i=r,e=Qu(n,r))),e===1)throw t=ka,Mr(n,0),Ui(n,i),fn(n,Et()),t;if(e===6)Ui(n,i);else{if(r=n.current.alternate,!(i&30)&&!yx(r)&&(e=yl(n,i),e===2&&(s=wu(n),s!==0&&(i=s,e=Qu(n,s))),e===1))throw t=ka,Mr(n,0),Ui(n,i),fn(n,Et()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(ie(345));case 2:dr(n,on,di);break;case 3:if(Ui(n,i),(i&130023424)===i&&(e=Kh+500-Et(),10<e)){if(nl(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){nn(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=Nu(dr.bind(null,n,on,di),e);break}dr(n,on,di);break;case 4:if(Ui(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var a=31-Xn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Et()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*xx(i/1960))-i,10<i){n.timeoutHandle=Nu(dr.bind(null,n,on,di),i);break}dr(n,on,di);break;case 5:dr(n,on,di);break;default:throw Error(ie(329))}}}return fn(n,Et()),n.callbackNode===t?ng.bind(null,n):null}function Qu(n,e){var t=va;return n.current.memoizedState.isDehydrated&&(Mr(n,e).flags|=256),n=yl(n,e),n!==2&&(e=on,on=t,e!==null&&Ju(e)),n}function Ju(n){on===null?on=n:on.push.apply(on,n)}function yx(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!Kn(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Ui(n,e){for(e&=~$h,e&=~Bl,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-Xn(e),i=1<<t;n[t]=-1,e&=~i}}function Ef(n){if(Ke&6)throw Error(ie(327));Ts();var e=nl(n,0);if(!(e&1))return fn(n,Et()),null;var t=yl(n,e);if(n.tag!==0&&t===2){var i=wu(n);i!==0&&(e=i,t=Qu(n,i))}if(t===1)throw t=ka,Mr(n,0),Ui(n,e),fn(n,Et()),t;if(t===6)throw Error(ie(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,dr(n,on,di),fn(n,Et()),null}function Zh(n,e){var t=Ke;Ke|=1;try{return n(e)}finally{Ke=t,Ke===0&&(Is=Et()+500,Ul&&ir())}}function Lr(n){ki!==null&&ki.tag===0&&!(Ke&6)&&Ts();var e=Ke;Ke|=1;var t=In.transition,i=Qe;try{if(In.transition=null,Qe=1,n)return n()}finally{Qe=i,In.transition=t,Ke=e,!(Ke&6)&&ir()}}function Qh(){xn=_s.current,ct(_s)}function Mr(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,Kv(t)),Tt!==null)for(t=Tt.return;t!==null;){var i=t;switch(Nh(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&ol();break;case 3:Ns(),ct(hn),ct(Xt),Gh();break;case 5:zh(i);break;case 4:Ns();break;case 13:ct(mt);break;case 19:ct(mt);break;case 10:Oh(i.type._context);break;case 22:case 23:Qh()}t=t.return}if(Ut=n,Tt=n=Yi(n.current,null),Ft=xn=e,Rt=0,ka=null,$h=Bl=Pr=0,on=va=null,xr!==null){for(e=0;e<xr.length;e++)if(t=xr[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}t.pending=i}xr=null}return n}function ig(n,e){do{var t=Tt;try{if(Uh(),jo.current=gl,ml){for(var i=gt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}ml=!1}if(Cr=0,It=At=gt=null,ga=!1,Ia=0,qh.current=null,t===null||t.return===null){Rt=1,ka=e,Tt=null;break}e:{var s=n,a=t.return,o=t,l=e;if(e=Ft,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,h=o,f=h.tag;if(!(h.mode&1)&&(f===0||f===11||f===15)){var d=h.alternate;d?(h.updateQueue=d.updateQueue,h.memoizedState=d.memoizedState,h.lanes=d.lanes):(h.updateQueue=null,h.memoizedState=null)}var p=uf(a);if(p!==null){p.flags&=-257,hf(p,a,o,s,e),p.mode&1&&cf(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var x=new Set;x.add(l),e.updateQueue=x}else v.add(l);break e}else{if(!(e&1)){cf(s,c,e),Jh();break e}l=Error(ie(426))}}else if(ut&&o.mode&1){var m=uf(a);if(m!==null){!(m.flags&65536)&&(m.flags|=256),hf(m,a,o,s,e),Dh(Ds(l,o));break e}}s=l=Ds(l,o),Rt!==4&&(Rt=2),va===null?va=[s]:va.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=z0(s,l,e);nf(s,u);break e;case 1:o=l;var _=s.type,g=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(ji===null||!ji.has(g)))){s.flags|=65536,e&=-e,s.lanes|=e;var y=G0(s,o,e);nf(s,y);break e}}s=s.return}while(s!==null)}ag(t)}catch(C){e=C,Tt===t&&t!==null&&(Tt=t=t.return);continue}break}while(!0)}function rg(){var n=_l.current;return _l.current=gl,n===null?gl:n}function Jh(){(Rt===0||Rt===3||Rt===2)&&(Rt=4),Ut===null||!(Pr&268435455)&&!(Bl&268435455)||Ui(Ut,Ft)}function yl(n,e){var t=Ke;Ke|=2;var i=rg();(Ut!==n||Ft!==e)&&(di=null,Mr(n,e));do try{Sx();break}catch(r){ig(n,r)}while(!0);if(Uh(),Ke=t,_l.current=i,Tt!==null)throw Error(ie(261));return Ut=null,Ft=0,Rt}function Sx(){for(;Tt!==null;)sg(Tt)}function Mx(){for(;Tt!==null&&!Y_();)sg(Tt)}function sg(n){var e=lg(n.alternate,n,xn);n.memoizedProps=n.pendingProps,e===null?ag(n):Tt=e,qh.current=null}function ag(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=mx(t,e),t!==null){t.flags&=32767,Tt=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Rt=6,Tt=null;return}}else if(t=px(t,e,xn),t!==null){Tt=t;return}if(e=e.sibling,e!==null){Tt=e;return}Tt=e=n}while(e!==null);Rt===0&&(Rt=5)}function dr(n,e,t){var i=Qe,r=In.transition;try{In.transition=null,Qe=1,Ex(n,e,t,i)}finally{In.transition=r,Qe=i}return null}function Ex(n,e,t,i){do Ts();while(ki!==null);if(Ke&6)throw Error(ie(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(ie(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(iv(n,s),n===Ut&&(Tt=Ut=null,Ft=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||uo||(uo=!0,cg(tl,function(){return Ts(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=In.transition,In.transition=null;var a=Qe;Qe=1;var o=Ke;Ke|=4,qh.current=null,_x(n,t),eg(t,n),Vv(Pu),il=!!Cu,Pu=Cu=null,n.current=t,vx(t),q_(),Ke=o,Qe=a,In.transition=s}else n.current=t;if(uo&&(uo=!1,ki=n,xl=r),s=n.pendingLanes,s===0&&(ji=null),Z_(t.stateNode),fn(n,Et()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(vl)throw vl=!1,n=Ku,Ku=null,n;return xl&1&&n.tag!==0&&Ts(),s=n.pendingLanes,s&1?n===Zu?xa++:(xa=0,Zu=n):xa=0,ir(),null}function Ts(){if(ki!==null){var n=zm(xl),e=In.transition,t=Qe;try{if(In.transition=null,Qe=16>n?16:n,ki===null)var i=!1;else{if(n=ki,ki=null,xl=0,Ke&6)throw Error(ie(331));var r=Ke;for(Ke|=4,pe=n.current;pe!==null;){var s=pe,a=s.child;if(pe.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(pe=c;pe!==null;){var h=pe;switch(h.tag){case 0:case 11:case 15:_a(8,h,s)}var f=h.child;if(f!==null)f.return=h,pe=f;else for(;pe!==null;){h=pe;var d=h.sibling,p=h.return;if(Z0(h),h===c){pe=null;break}if(d!==null){d.return=p,pe=d;break}pe=p}}}var v=s.alternate;if(v!==null){var x=v.child;if(x!==null){v.child=null;do{var m=x.sibling;x.sibling=null,x=m}while(x!==null)}}pe=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,pe=a;else e:for(;pe!==null;){if(s=pe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:_a(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,pe=u;break e}pe=s.return}}var _=n.current;for(pe=_;pe!==null;){a=pe;var g=a.child;if(a.subtreeFlags&2064&&g!==null)g.return=a,pe=g;else e:for(a=_;pe!==null;){if(o=pe,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:Fl(9,o)}}catch(C){yt(o,o.return,C)}if(o===a){pe=null;break e}var y=o.sibling;if(y!==null){y.return=o.return,pe=y;break e}pe=o.return}}if(Ke=r,ir(),ii&&typeof ii.onPostCommitFiberRoot=="function")try{ii.onPostCommitFiberRoot(Pl,n)}catch{}i=!0}return i}finally{Qe=t,In.transition=e}}return!1}function wf(n,e,t){e=Ds(t,e),e=z0(n,e,1),n=Wi(n,e,1),e=nn(),n!==null&&(Ga(n,1,e),fn(n,e))}function yt(n,e,t){if(n.tag===3)wf(n,n,t);else for(;e!==null;){if(e.tag===3){wf(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(ji===null||!ji.has(i))){n=Ds(t,n),n=G0(e,n,1),e=Wi(e,n,1),n=nn(),e!==null&&(Ga(e,1,n),fn(e,n));break}}e=e.return}}function wx(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=nn(),n.pingedLanes|=n.suspendedLanes&t,Ut===n&&(Ft&t)===t&&(Rt===4||Rt===3&&(Ft&130023424)===Ft&&500>Et()-Kh?Mr(n,0):$h|=t),fn(n,e)}function og(n,e){e===0&&(n.mode&1?(e=eo,eo<<=1,!(eo&130023424)&&(eo=4194304)):e=1);var t=nn();n=Mi(n,e),n!==null&&(Ga(n,e,t),fn(n,t))}function Tx(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),og(n,t)}function Ax(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(ie(314))}i!==null&&i.delete(e),og(n,t)}var lg;lg=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||hn.current)un=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return un=!1,fx(n,e,t);un=!!(n.flags&131072)}else un=!1,ut&&e.flags&1048576&&d0(e,ul,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Yo(n,e),n=e.pendingProps;var r=Cs(e,Xt.current);ws(e,t),r=Vh(null,e,i,n,r,t);var s=Wh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,dn(i)?(s=!0,ll(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Fh(e),r.updater=kl,e.stateNode=r,r._reactInternals=e,Bu(e,i,n,t),e=Hu(null,e,i,!0,s,t)):(e.tag=0,ut&&s&&Lh(e),Jt(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(Yo(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=bx(i),n=Gn(i,n),r){case 0:e=Gu(null,e,i,n,t);break e;case 1:e=pf(null,e,i,n,t);break e;case 11:e=df(null,e,i,n,t);break e;case 14:e=ff(null,e,i,Gn(i.type,n),t);break e}throw Error(ie(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),Gu(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),pf(n,e,i,r,t);case 3:e:{if(j0(e),n===null)throw Error(ie(387));i=e.pendingProps,s=e.memoizedState,r=s.element,v0(n,e),fl(e,i,null,t);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Ds(Error(ie(423)),e),e=mf(n,e,i,t,r);break e}else if(i!==r){r=Ds(Error(ie(424)),e),e=mf(n,e,i,t,r);break e}else for(Sn=Vi(e.stateNode.containerInfo.firstChild),Mn=e,ut=!0,Vn=null,t=g0(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Ps(),i===r){e=Ei(n,e,t);break e}Jt(n,e,i,t)}e=e.child}return e;case 5:return x0(e),n===null&&Ou(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,a=r.children,Lu(i,r)?a=null:s!==null&&Lu(i,s)&&(e.flags|=32),W0(n,e),Jt(n,e,a,t),e.child;case 6:return n===null&&Ou(e),null;case 13:return X0(n,e,t);case 4:return Bh(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=Ls(e,null,i,t):Jt(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),df(n,e,i,r,t);case 7:return Jt(n,e,e.pendingProps,t),e.child;case 8:return Jt(n,e,e.pendingProps.children,t),e.child;case 12:return Jt(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,st(hl,i._currentValue),i._currentValue=a,s!==null)if(Kn(s.value,a)){if(s.children===r.children&&!hn.current){e=Ei(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=xi(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var h=c.pending;h===null?l.next=l:(l.next=h.next,h.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),ku(s.return,t,e),o.lanes|=t;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(ie(341));a.lanes|=t,o=a.alternate,o!==null&&(o.lanes|=t),ku(a,t,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}Jt(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,ws(e,t),r=Un(r),i=i(r),e.flags|=1,Jt(n,e,i,t),e.child;case 14:return i=e.type,r=Gn(i,e.pendingProps),r=Gn(i.type,r),ff(n,e,i,r,t);case 15:return H0(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),Yo(n,e),e.tag=1,dn(i)?(n=!0,ll(e)):n=!1,ws(e,t),B0(e,i,r),Bu(e,i,r,t),Hu(null,e,i,!0,n,t);case 19:return Y0(n,e,t);case 22:return V0(n,e,t)}throw Error(ie(156,e.tag))};function cg(n,e){return Om(n,e)}function Rx(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Dn(n,e,t,i){return new Rx(n,e,t,i)}function ed(n){return n=n.prototype,!(!n||!n.isReactComponent)}function bx(n){if(typeof n=="function")return ed(n)?1:0;if(n!=null){if(n=n.$$typeof,n===xh)return 11;if(n===yh)return 14}return 2}function Yi(n,e){var t=n.alternate;return t===null?(t=Dn(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function Ko(n,e,t,i,r,s){var a=2;if(i=n,typeof n=="function")ed(n)&&(a=1);else if(typeof n=="string")a=5;else e:switch(n){case os:return Er(t.children,r,s,e);case vh:a=8,r|=8;break;case cu:return n=Dn(12,t,e,r|2),n.elementType=cu,n.lanes=s,n;case uu:return n=Dn(13,t,e,r),n.elementType=uu,n.lanes=s,n;case hu:return n=Dn(19,t,e,r),n.elementType=hu,n.lanes=s,n;case xm:return zl(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case _m:a=10;break e;case vm:a=9;break e;case xh:a=11;break e;case yh:a=14;break e;case Ni:a=16,i=null;break e}throw Error(ie(130,n==null?n:typeof n,""))}return e=Dn(a,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function Er(n,e,t,i){return n=Dn(7,n,i,e),n.lanes=t,n}function zl(n,e,t,i){return n=Dn(22,n,i,e),n.elementType=xm,n.lanes=t,n.stateNode={isHidden:!1},n}function wc(n,e,t){return n=Dn(6,n,null,e),n.lanes=t,n}function Tc(n,e,t){return e=Dn(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function Cx(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=sc(0),this.expirationTimes=sc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=sc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function td(n,e,t,i,r,s,a,o,l){return n=new Cx(n,e,t,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Dn(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},Fh(s),n}function Px(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:as,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function ug(n){if(!n)return Ji;n=n._reactInternals;e:{if(kr(n)!==n||n.tag!==1)throw Error(ie(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(dn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ie(171))}if(n.tag===1){var t=n.type;if(dn(t))return u0(n,t,e)}return e}function hg(n,e,t,i,r,s,a,o,l){return n=td(t,i,!0,n,r,s,a,o,l),n.context=ug(null),t=n.current,i=nn(),r=Xi(t),s=xi(i,r),s.callback=e??null,Wi(t,s,r),n.current.lanes=r,Ga(n,r,i),fn(n,i),n}function Gl(n,e,t,i){var r=e.current,s=nn(),a=Xi(r);return t=ug(t),e.context===null?e.context=t:e.pendingContext=t,e=xi(s,a),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=Wi(r,e,a),n!==null&&(Yn(n,r,a,s),Wo(n,r,a)),a}function Sl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Tf(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function nd(n,e){Tf(n,e),(n=n.alternate)&&Tf(n,e)}function Lx(){return null}var dg=typeof reportError=="function"?reportError:function(n){console.error(n)};function id(n){this._internalRoot=n}Hl.prototype.render=id.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(ie(409));Gl(n,e,null,null)};Hl.prototype.unmount=id.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;Lr(function(){Gl(null,n,null,null)}),e[Si]=null}};function Hl(n){this._internalRoot=n}Hl.prototype.unstable_scheduleHydration=function(n){if(n){var e=Vm();n={blockedOn:null,target:n,priority:e};for(var t=0;t<Ii.length&&e!==0&&e<Ii[t].priority;t++);Ii.splice(t,0,n),t===0&&jm(n)}};function rd(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Vl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Af(){}function Nx(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Sl(a);s.call(c)}}var a=hg(e,i,n,0,null,!1,!1,"",Af);return n._reactRootContainer=a,n[Si]=a.current,Ca(n.nodeType===8?n.parentNode:n),Lr(),a}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=Sl(l);o.call(c)}}var l=td(n,0,!1,null,null,!1,!1,"",Af);return n._reactRootContainer=l,n[Si]=l.current,Ca(n.nodeType===8?n.parentNode:n),Lr(function(){Gl(e,l,t,i)}),l}function Wl(n,e,t,i,r){var s=t._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=Sl(a);o.call(l)}}Gl(e,a,n,r)}else a=Nx(t,e,n,r,i);return Sl(a)}Gm=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=ca(e.pendingLanes);t!==0&&(Eh(e,t|1),fn(e,Et()),!(Ke&6)&&(Is=Et()+500,ir()))}break;case 13:Lr(function(){var i=Mi(n,1);if(i!==null){var r=nn();Yn(i,n,1,r)}}),nd(n,1)}};wh=function(n){if(n.tag===13){var e=Mi(n,134217728);if(e!==null){var t=nn();Yn(e,n,134217728,t)}nd(n,134217728)}};Hm=function(n){if(n.tag===13){var e=Xi(n),t=Mi(n,e);if(t!==null){var i=nn();Yn(t,n,e,i)}nd(n,e)}};Vm=function(){return Qe};Wm=function(n,e){var t=Qe;try{return Qe=n,e()}finally{Qe=t}};Su=function(n,e,t){switch(e){case"input":if(pu(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=Il(i);if(!r)throw Error(ie(90));Sm(i),pu(i,r)}}}break;case"textarea":Em(n,t);break;case"select":e=t.value,e!=null&&ys(n,!!t.multiple,e,!1)}};Pm=Zh;Lm=Lr;var Dx={usingClientEntryPoint:!1,Events:[Va,hs,Il,bm,Cm,Zh]},Qs={findFiberByHostInstance:vr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Ix={bundleType:Qs.bundleType,version:Qs.version,rendererPackageName:Qs.rendererPackageName,rendererConfig:Qs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ti.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=Im(n),n===null?null:n.stateNode},findFiberByHostInstance:Qs.findFiberByHostInstance||Lx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ho=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ho.isDisabled&&ho.supportsFiber)try{Pl=ho.inject(Ix),ii=ho}catch{}}wn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Dx;wn.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!rd(e))throw Error(ie(200));return Px(n,e,null,t)};wn.createRoot=function(n,e){if(!rd(n))throw Error(ie(299));var t=!1,i="",r=dg;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=td(n,1,!1,null,null,t,!1,i,r),n[Si]=e.current,Ca(n.nodeType===8?n.parentNode:n),new id(e)};wn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(ie(188)):(n=Object.keys(n).join(","),Error(ie(268,n)));return n=Im(e),n=n===null?null:n.stateNode,n};wn.flushSync=function(n){return Lr(n)};wn.hydrate=function(n,e,t){if(!Vl(e))throw Error(ie(200));return Wl(null,n,e,!0,t)};wn.hydrateRoot=function(n,e,t){if(!rd(n))throw Error(ie(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",a=dg;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),e=hg(e,null,n,1,t??null,r,!1,s,a),n[Si]=e.current,Ca(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new Hl(e)};wn.render=function(n,e,t){if(!Vl(e))throw Error(ie(200));return Wl(null,n,e,!1,t)};wn.unmountComponentAtNode=function(n){if(!Vl(n))throw Error(ie(40));return n._reactRootContainer?(Lr(function(){Wl(null,null,n,!1,function(){n._reactRootContainer=null,n[Si]=null})}),!0):!1};wn.unstable_batchedUpdates=Zh;wn.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!Vl(t))throw Error(ie(200));if(n==null||n._reactInternals===void 0)throw Error(ie(38));return Wl(n,e,t,!1,i)};wn.version="18.3.1-next-f1338f8080-20240426";function fg(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(fg)}catch(n){console.error(n)}}fg(),fm.exports=wn;var Ux=fm.exports,Rf=Ux;ou.createRoot=Rf.createRoot,ou.hydrateRoot=Rf.hydrateRoot;/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const sd="160",Ox=0,bf=1,kx=2,pg=1,mg=2,hi=3,er=0,pn=1,pi=2,qi=0,As=1,eh=2,Cf=3,Pf=4,Fx=5,mr=100,Bx=101,zx=102,Lf=103,Nf=104,Gx=200,Hx=201,Vx=202,Wx=203,th=204,nh=205,jx=206,Xx=207,Yx=208,qx=209,$x=210,Kx=211,Zx=212,Qx=213,Jx=214,ey=0,ty=1,ny=2,Ml=3,iy=4,ry=5,sy=6,ay=7,gg=0,oy=1,ly=2,$i=0,cy=1,uy=2,hy=3,_g=4,dy=5,fy=6,vg=300,Us=301,Os=302,ih=303,rh=304,jl=306,Sr=1e3,Wn=1001,sh=1002,en=1003,Df=1004,Ac=1005,Pn=1006,py=1007,Fa=1008,Ki=1009,my=1010,gy=1011,ad=1012,xg=1013,Fi=1014,Bi=1015,Ba=1016,yg=1017,Sg=1018,wr=1020,_y=1021,jn=1023,vy=1024,xy=1025,Tr=1026,ks=1027,yy=1028,Mg=1029,Sy=1030,Eg=1031,wg=1033,Rc=33776,bc=33777,Cc=33778,Pc=33779,If=35840,Uf=35841,Of=35842,kf=35843,Tg=36196,Ff=37492,Bf=37496,zf=37808,Gf=37809,Hf=37810,Vf=37811,Wf=37812,jf=37813,Xf=37814,Yf=37815,qf=37816,$f=37817,Kf=37818,Zf=37819,Qf=37820,Jf=37821,Lc=36492,ep=36494,tp=36495,My=36283,np=36284,ip=36285,rp=36286,Ag=3e3,Ar=3001,Ey=3200,wy=3201,Rg=0,Ty=1,Nn="",kt="srgb",wi="srgb-linear",od="display-p3",Xl="display-p3-linear",El="linear",ot="srgb",wl="rec709",Tl="p3",zr=7680,sp=519,Ay=512,Ry=513,by=514,bg=515,Cy=516,Py=517,Ly=518,Ny=519,ah=35044,ap="300 es",oh=1035,vi=2e3,Al=2001;class Hs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Vt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Nc=Math.PI/180,lh=180/Math.PI;function Zi(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Vt[n&255]+Vt[n>>8&255]+Vt[n>>16&255]+Vt[n>>24&255]+"-"+Vt[e&255]+Vt[e>>8&255]+"-"+Vt[e>>16&15|64]+Vt[e>>24&255]+"-"+Vt[t&63|128]+Vt[t>>8&255]+"-"+Vt[t>>16&255]+Vt[t>>24&255]+Vt[i&255]+Vt[i>>8&255]+Vt[i>>16&255]+Vt[i>>24&255]).toLowerCase()}function ln(n,e,t){return Math.max(e,Math.min(t,n))}function Dy(n,e){return(n%e+e)%e}function Dc(n,e,t){return(1-t)*n+t*e}function op(n){return(n&n-1)===0&&n!==0}function ch(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function mi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function tt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class Ce{constructor(e=0,t=0){Ce.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ln(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class je{constructor(e,t,i,r,s,a,o,l,c){je.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c)}set(e,t,i,r,s,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=o,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],f=i[7],d=i[2],p=i[5],v=i[8],x=r[0],m=r[3],u=r[6],_=r[1],g=r[4],y=r[7],C=r[2],T=r[5],A=r[8];return s[0]=a*x+o*_+l*C,s[3]=a*m+o*g+l*T,s[6]=a*u+o*y+l*A,s[1]=c*x+h*_+f*C,s[4]=c*m+h*g+f*T,s[7]=c*u+h*y+f*A,s[2]=d*x+p*_+v*C,s[5]=d*m+p*g+v*T,s[8]=d*u+p*y+v*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*s*h+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,d=o*l-h*s,p=c*s-a*l,v=t*f+i*d+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return e[0]=f*x,e[1]=(r*c-h*i)*x,e[2]=(o*i-r*a)*x,e[3]=d*x,e[4]=(h*t-r*l)*x,e[5]=(r*s-o*t)*x,e[6]=p*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Ic.makeScale(e,t)),this}rotate(e){return this.premultiply(Ic.makeRotation(-e)),this}translate(e,t){return this.premultiply(Ic.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Ic=new je;function Cg(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Rl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Iy(){const n=Rl("canvas");return n.style.display="block",n}const lp={};function ya(n){n in lp||(lp[n]=!0,console.warn(n))}const cp=new je().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),up=new je().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),fo={[wi]:{transfer:El,primaries:wl,toReference:n=>n,fromReference:n=>n},[kt]:{transfer:ot,primaries:wl,toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[Xl]:{transfer:El,primaries:Tl,toReference:n=>n.applyMatrix3(up),fromReference:n=>n.applyMatrix3(cp)},[od]:{transfer:ot,primaries:Tl,toReference:n=>n.convertSRGBToLinear().applyMatrix3(up),fromReference:n=>n.applyMatrix3(cp).convertLinearToSRGB()}},Uy=new Set([wi,Xl]),et={enabled:!0,_workingColorSpace:wi,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!Uy.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=fo[e].toReference,r=fo[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return fo[n].primaries},getTransfer:function(n){return n===Nn?El:fo[n].transfer}};function Rs(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Uc(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Gr;class Pg{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Gr===void 0&&(Gr=Rl("canvas")),Gr.width=e.width,Gr.height=e.height;const i=Gr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Gr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Rs(s[a]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Rs(t[i]/255)*255):t[i]=Rs(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Oy=0;class Lg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Oy++}),this.uuid=Zi(),this.data=e,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Oc(r[a].image)):s.push(Oc(r[a]))}else s=Oc(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function Oc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Pg.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ky=0;class mn extends Hs{constructor(e=mn.DEFAULT_IMAGE,t=mn.DEFAULT_MAPPING,i=Wn,r=Wn,s=Pn,a=Fa,o=jn,l=Ki,c=mn.DEFAULT_ANISOTROPY,h=Nn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ky++}),this.uuid=Zi(),this.name="",this.source=new Lg(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ce(0,0),this.repeat=new Ce(1,1),this.center=new Ce(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(ya("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Ar?kt:Nn),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Sr:e.x=e.x-Math.floor(e.x);break;case Wn:e.x=e.x<0?0:1;break;case sh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Sr:e.y=e.y-Math.floor(e.y);break;case Wn:e.y=e.y<0?0:1;break;case sh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return ya("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===kt?Ar:Ag}set encoding(e){ya("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=e===Ar?kt:Nn}}mn.DEFAULT_IMAGE=null;mn.DEFAULT_MAPPING=vg;mn.DEFAULT_ANISOTROPY=1;class ht{constructor(e=0,t=0,i=0,r=1){ht.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*t+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*t+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*t+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],h=l[4],f=l[8],d=l[1],p=l[5],v=l[9],x=l[2],m=l[6],u=l[10];if(Math.abs(h-d)<.01&&Math.abs(f-x)<.01&&Math.abs(v-m)<.01){if(Math.abs(h+d)<.1&&Math.abs(f+x)<.1&&Math.abs(v+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const g=(c+1)/2,y=(p+1)/2,C=(u+1)/2,T=(h+d)/4,A=(f+x)/4,I=(v+m)/4;return g>y&&g>C?g<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(g),r=T/i,s=A/i):y>C?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=T/r,s=I/r):C<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(C),i=A/s,r=I/s),this.set(i,r,s,t),this}let _=Math.sqrt((m-v)*(m-v)+(f-x)*(f-x)+(d-h)*(d-h));return Math.abs(_)<.001&&(_=1),this.x=(m-v)/_,this.y=(f-x)/_,this.z=(d-h)/_,this.w=Math.acos((c+p+u-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Fy extends Hs{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ht(0,0,e,t),this.scissorTest=!1,this.viewport=new ht(0,0,e,t);const r={width:e,height:t,depth:1};i.encoding!==void 0&&(ya("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),i.colorSpace=i.encoding===Ar?kt:Nn),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Pn,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},i),this.texture=new mn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=i.generateMipmaps,this.texture.internalFormat=i.internalFormat,this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}setSize(e,t,i=1){(this.width!==e||this.height!==t||this.depth!==i)&&(this.width=e,this.height=t,this.depth=i,this.texture.image.width=e,this.texture.image.height=t,this.texture.image.depth=i,this.dispose()),this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.texture=e.texture.clone(),this.texture.isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Lg(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Nr extends Fy{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Ng extends mn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=en,this.minFilter=en,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class By extends mn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=en,this.minFilter=en,this.wrapR=Wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ja{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,a,o){let l=i[r+0],c=i[r+1],h=i[r+2],f=i[r+3];const d=s[a+0],p=s[a+1],v=s[a+2],x=s[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f;return}if(o===1){e[t+0]=d,e[t+1]=p,e[t+2]=v,e[t+3]=x;return}if(f!==x||l!==d||c!==p||h!==v){let m=1-o;const u=l*d+c*p+h*v+f*x,_=u>=0?1:-1,g=1-u*u;if(g>Number.EPSILON){const C=Math.sqrt(g),T=Math.atan2(C,u*_);m=Math.sin(m*T)/C,o=Math.sin(o*T)/C}const y=o*_;if(l=l*m+d*y,c=c*m+p*y,h=h*m+v*y,f=f*m+x*y,m===1-o){const C=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=C,c*=C,h*=C,f*=C}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],h=i[r+3],f=s[a],d=s[a+1],p=s[a+2],v=s[a+3];return e[t]=o*v+h*f+l*p-c*d,e[t+1]=l*v+h*d+c*f-o*p,e[t+2]=c*v+h*p+o*d-l*f,e[t+3]=h*v-o*f-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(r/2),f=o(s/2),d=l(i/2),p=l(r/2),v=l(s/2);switch(a){case"XYZ":this._x=d*h*f+c*p*v,this._y=c*p*f-d*h*v,this._z=c*h*v+d*p*f,this._w=c*h*f-d*p*v;break;case"YXZ":this._x=d*h*f+c*p*v,this._y=c*p*f-d*h*v,this._z=c*h*v-d*p*f,this._w=c*h*f+d*p*v;break;case"ZXY":this._x=d*h*f-c*p*v,this._y=c*p*f+d*h*v,this._z=c*h*v+d*p*f,this._w=c*h*f-d*p*v;break;case"ZYX":this._x=d*h*f-c*p*v,this._y=c*p*f+d*h*v,this._z=c*h*v-d*p*f,this._w=c*h*f+d*p*v;break;case"YZX":this._x=d*h*f+c*p*v,this._y=c*p*f+d*h*v,this._z=c*h*v-d*p*f,this._w=c*h*f-d*p*v;break;case"XZY":this._x=d*h*f-c*p*v,this._y=c*p*f-d*h*v,this._z=c*h*v+d*p*f,this._w=c*h*f+d*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],d=i+o+f;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>f){const p=2*Math.sqrt(1+i-o-f);this._w=(h-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>f){const p=2*Math.sqrt(1+o-i-f);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+f-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ln(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+r*c-s*l,this._y=r*h+a*l+s*o-i*c,this._z=s*h+a*c+i*l-r*o,this._w=a*h-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const p=1-t;return this._w=p*a+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),f=Math.sin((1-t)*h)/c,d=Math.sin(t*h)/c;return this._w=a*f+this._w*d,this._x=i*f+this._x*d,this._y=r*f+this._y*d,this._z=s*f+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=Math.random(),t=Math.sqrt(1-e),i=Math.sqrt(e),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(t*Math.cos(r),i*Math.sin(s),i*Math.cos(s),t*Math.sin(r))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,i=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(hp.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(hp.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),h=2*(o*t-s*r),f=2*(s*i-a*t);return this.x=t+l*c+a*f-o*h,this.y=i+l*h+o*c-s*f,this.z=r+l*f+s*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,a=t.x,o=t.y,l=t.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return kc.copy(this).projectOnVector(e),this.sub(kc)}reflect(e){return this.sub(kc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(ln(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=(Math.random()-.5)*2,t=Math.random()*Math.PI*2,i=Math.sqrt(1-e**2);return this.x=i*Math.cos(t),this.y=i*Math.sin(t),this.z=e,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const kc=new P,hp=new ja;class tn{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Fn):Fn.fromBufferAttribute(s,a),Fn.applyMatrix4(e.matrixWorld),this.expandByPoint(Fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),po.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),po.copy(i.boundingBox)),po.applyMatrix4(e.matrixWorld),this.union(po)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Fn),Fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Js),mo.subVectors(this.max,Js),Hr.subVectors(e.a,Js),Vr.subVectors(e.b,Js),Wr.subVectors(e.c,Js),Ri.subVectors(Vr,Hr),bi.subVectors(Wr,Vr),ar.subVectors(Hr,Wr);let t=[0,-Ri.z,Ri.y,0,-bi.z,bi.y,0,-ar.z,ar.y,Ri.z,0,-Ri.x,bi.z,0,-bi.x,ar.z,0,-ar.x,-Ri.y,Ri.x,0,-bi.y,bi.x,0,-ar.y,ar.x,0];return!Fc(t,Hr,Vr,Wr,mo)||(t=[1,0,0,0,1,0,0,0,1],!Fc(t,Hr,Vr,Wr,mo))?!1:(go.crossVectors(Ri,bi),t=[go.x,go.y,go.z],Fc(t,Hr,Vr,Wr,mo))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ai[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ai[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ai[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ai[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ai[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ai[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ai[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ai[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ai),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ai=[new P,new P,new P,new P,new P,new P,new P,new P],Fn=new P,po=new tn,Hr=new P,Vr=new P,Wr=new P,Ri=new P,bi=new P,ar=new P,Js=new P,mo=new P,go=new P,or=new P;function Fc(n,e,t,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){or.fromArray(n,s);const o=r.x*Math.abs(or.x)+r.y*Math.abs(or.y)+r.z*Math.abs(or.z),l=e.dot(or),c=t.dot(or),h=i.dot(or);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const zy=new tn,ea=new P,Bc=new P;class Yl{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):zy.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ea.subVectors(e,this.center);const t=ea.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(ea,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Bc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ea.copy(e.center).add(Bc)),this.expandByPoint(ea.copy(e.center).sub(Bc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const oi=new P,zc=new P,_o=new P,Ci=new P,Gc=new P,vo=new P,Hc=new P;class ql{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,oi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=oi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(oi.copy(this.origin).addScaledVector(this.direction,t),oi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){zc.copy(e).add(t).multiplyScalar(.5),_o.copy(t).sub(e).normalize(),Ci.copy(this.origin).sub(zc);const s=e.distanceTo(t)*.5,a=-this.direction.dot(_o),o=Ci.dot(this.direction),l=-Ci.dot(_o),c=Ci.lengthSq(),h=Math.abs(1-a*a);let f,d,p,v;if(h>0)if(f=a*l-o,d=a*o-l,v=s*h,f>=0)if(d>=-v)if(d<=v){const x=1/h;f*=x,d*=x,p=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=s,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;else d<=-v?(f=Math.max(0,-(-a*s+o)),d=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+c):d<=v?(f=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(f=Math.max(0,-(a*s+o)),d=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+c);else d=a>0?-s:s,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(zc).addScaledVector(_o,d),p}intersectSphere(e,t){oi.subVectors(e.center,this.origin);const i=oi.dot(this.direction),r=oi.dot(oi)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),h>=0?(s=(e.min.y-d.y)*h,a=(e.max.y-d.y)*h):(s=(e.max.y-d.y)*h,a=(e.min.y-d.y)*h),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,oi)!==null}intersectTriangle(e,t,i,r,s){Gc.subVectors(t,e),vo.subVectors(i,e),Hc.crossVectors(Gc,vo);let a=this.direction.dot(Hc),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ci.subVectors(this.origin,e);const l=o*this.direction.dot(vo.crossVectors(Ci,vo));if(l<0)return null;const c=o*this.direction.dot(Gc.cross(Ci));if(c<0||l+c>a)return null;const h=-o*Ci.dot(Hc);return h<0?null:this.at(h/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class St{constructor(e,t,i,r,s,a,o,l,c,h,f,d,p,v,x,m){St.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,a,o,l,c,h,f,d,p,v,x,m)}set(e,t,i,r,s,a,o,l,c,h,f,d,p,v,x,m){const u=this.elements;return u[0]=e,u[4]=t,u[8]=i,u[12]=r,u[1]=s,u[5]=a,u[9]=o,u[13]=l,u[2]=c,u[6]=h,u[10]=f,u[14]=d,u[3]=p,u[7]=v,u[11]=x,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new St().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/jr.setFromMatrixColumn(e,0).length(),s=1/jr.setFromMatrixColumn(e,1).length(),a=1/jr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const d=a*h,p=a*f,v=o*h,x=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=p+v*c,t[5]=d-x*c,t[9]=-o*l,t[2]=x-d*c,t[6]=v+p*c,t[10]=a*l}else if(e.order==="YXZ"){const d=l*h,p=l*f,v=c*h,x=c*f;t[0]=d+x*o,t[4]=v*o-p,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=p*o-v,t[6]=x+d*o,t[10]=a*l}else if(e.order==="ZXY"){const d=l*h,p=l*f,v=c*h,x=c*f;t[0]=d-x*o,t[4]=-a*f,t[8]=v+p*o,t[1]=p+v*o,t[5]=a*h,t[9]=x-d*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const d=a*h,p=a*f,v=o*h,x=o*f;t[0]=l*h,t[4]=v*c-p,t[8]=d*c+x,t[1]=l*f,t[5]=x*c+d,t[9]=p*c-v,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const d=a*l,p=a*c,v=o*l,x=o*c;t[0]=l*h,t[4]=x-d*f,t[8]=v*f+p,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=p*f+v,t[10]=d-x*f}else if(e.order==="XZY"){const d=a*l,p=a*c,v=o*l,x=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=d*f+x,t[5]=a*h,t[9]=p*f-v,t[2]=v*f-p,t[6]=o*h,t[10]=x*f+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Gy,e,Hy)}lookAt(e,t,i){const r=this.elements;return _n.subVectors(e,t),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Pi.crossVectors(i,_n),Pi.lengthSq()===0&&(Math.abs(i.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Pi.crossVectors(i,_n)),Pi.normalize(),xo.crossVectors(_n,Pi),r[0]=Pi.x,r[4]=xo.x,r[8]=_n.x,r[1]=Pi.y,r[5]=xo.y,r[9]=_n.y,r[2]=Pi.z,r[6]=xo.z,r[10]=_n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],f=i[5],d=i[9],p=i[13],v=i[2],x=i[6],m=i[10],u=i[14],_=i[3],g=i[7],y=i[11],C=i[15],T=r[0],A=r[4],I=r[8],S=r[12],E=r[1],F=r[5],z=r[9],q=r[13],L=r[2],k=r[6],j=r[10],K=r[14],D=r[3],O=r[7],B=r[11],$=r[15];return s[0]=a*T+o*E+l*L+c*D,s[4]=a*A+o*F+l*k+c*O,s[8]=a*I+o*z+l*j+c*B,s[12]=a*S+o*q+l*K+c*$,s[1]=h*T+f*E+d*L+p*D,s[5]=h*A+f*F+d*k+p*O,s[9]=h*I+f*z+d*j+p*B,s[13]=h*S+f*q+d*K+p*$,s[2]=v*T+x*E+m*L+u*D,s[6]=v*A+x*F+m*k+u*O,s[10]=v*I+x*z+m*j+u*B,s[14]=v*S+x*q+m*K+u*$,s[3]=_*T+g*E+y*L+C*D,s[7]=_*A+g*F+y*k+C*O,s[11]=_*I+g*z+y*j+C*B,s[15]=_*S+g*q+y*K+C*$,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],d=e[10],p=e[14],v=e[3],x=e[7],m=e[11],u=e[15];return v*(+s*l*f-r*c*f-s*o*d+i*c*d+r*o*p-i*l*p)+x*(+t*l*p-t*c*d+s*a*d-r*a*p+r*c*h-s*l*h)+m*(+t*c*f-t*o*p-s*a*f+i*a*p+s*o*h-i*c*h)+u*(-r*o*h-t*l*f+t*o*d+r*a*f-i*a*d+i*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],p=e[11],v=e[12],x=e[13],m=e[14],u=e[15],_=f*m*c-x*d*c+x*l*p-o*m*p-f*l*u+o*d*u,g=v*d*c-h*m*c-v*l*p+a*m*p+h*l*u-a*d*u,y=h*x*c-v*f*c+v*o*p-a*x*p-h*o*u+a*f*u,C=v*f*l-h*x*l-v*o*d+a*x*d+h*o*m-a*f*m,T=t*_+i*g+r*y+s*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=_*A,e[1]=(x*d*s-f*m*s-x*r*p+i*m*p+f*r*u-i*d*u)*A,e[2]=(o*m*s-x*l*s+x*r*c-i*m*c-o*r*u+i*l*u)*A,e[3]=(f*l*s-o*d*s-f*r*c+i*d*c+o*r*p-i*l*p)*A,e[4]=g*A,e[5]=(h*m*s-v*d*s+v*r*p-t*m*p-h*r*u+t*d*u)*A,e[6]=(v*l*s-a*m*s-v*r*c+t*m*c+a*r*u-t*l*u)*A,e[7]=(a*d*s-h*l*s+h*r*c-t*d*c-a*r*p+t*l*p)*A,e[8]=y*A,e[9]=(v*f*s-h*x*s-v*i*p+t*x*p+h*i*u-t*f*u)*A,e[10]=(a*x*s-v*o*s+v*i*c-t*x*c-a*i*u+t*o*u)*A,e[11]=(h*o*s-a*f*s-h*i*c+t*f*c+a*i*p-t*o*p)*A,e[12]=C*A,e[13]=(h*x*r-v*f*r+v*i*d-t*x*d-h*i*m+t*f*m)*A,e[14]=(v*o*r-a*x*r-v*i*l+t*x*l+a*i*m-t*o*m)*A,e[15]=(a*f*r-h*o*r+h*i*l-t*f*l-a*i*d+t*o*d)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,h=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,h*o+i,h*l-r*a,0,c*l-r*o,h*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,a=t._y,o=t._z,l=t._w,c=s+s,h=a+a,f=o+o,d=s*c,p=s*h,v=s*f,x=a*h,m=a*f,u=o*f,_=l*c,g=l*h,y=l*f,C=i.x,T=i.y,A=i.z;return r[0]=(1-(x+u))*C,r[1]=(p+y)*C,r[2]=(v-g)*C,r[3]=0,r[4]=(p-y)*T,r[5]=(1-(d+u))*T,r[6]=(m+_)*T,r[7]=0,r[8]=(v+g)*A,r[9]=(m-_)*A,r[10]=(1-(d+x))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=jr.set(r[0],r[1],r[2]).length();const a=jr.set(r[4],r[5],r[6]).length(),o=jr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Bn.copy(this);const c=1/s,h=1/a,f=1/o;return Bn.elements[0]*=c,Bn.elements[1]*=c,Bn.elements[2]*=c,Bn.elements[4]*=h,Bn.elements[5]*=h,Bn.elements[6]*=h,Bn.elements[8]*=f,Bn.elements[9]*=f,Bn.elements[10]*=f,t.setFromRotationMatrix(Bn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,t,i,r,s,a,o=vi){const l=this.elements,c=2*s/(t-e),h=2*s/(i-r),f=(t+e)/(t-e),d=(i+r)/(i-r);let p,v;if(o===vi)p=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===Al)p=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=h,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,a,o=vi){const l=this.elements,c=1/(t-e),h=1/(i-r),f=1/(a-s),d=(t+e)*c,p=(i+r)*h;let v,x;if(o===vi)v=(a+s)*f,x=-2*f;else if(o===Al)v=s*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const jr=new P,Bn=new St,Gy=new P(0,0,0),Hy=new P(1,1,1),Pi=new P,xo=new P,_n=new P,dp=new St,fp=new ja;class Xa{constructor(e=0,t=0,i=0,r=Xa.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],h=r[9],f=r[2],d=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(ln(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ln(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(ln(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-ln(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ln(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ln(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return dp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dp,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return fp.setFromEuler(this),this.setFromQuaternion(fp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Xa.DEFAULT_ORDER="XYZ";class Dg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Vy=0;const pp=new P,Xr=new ja,li=new St,yo=new P,ta=new P,Wy=new P,jy=new ja,mp=new P(1,0,0),gp=new P(0,1,0),_p=new P(0,0,1),Xy={type:"added"},Yy={type:"removed"};class bt extends Hs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Vy++}),this.uuid=Zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bt.DEFAULT_UP.clone();const e=new P,t=new Xa,i=new ja,r=new P(1,1,1);function s(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new St},normalMatrix:{value:new je}}),this.matrix=new St,this.matrixWorld=new St,this.matrixAutoUpdate=bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Dg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Xr.setFromAxisAngle(e,t),this.quaternion.multiply(Xr),this}rotateOnWorldAxis(e,t){return Xr.setFromAxisAngle(e,t),this.quaternion.premultiply(Xr),this}rotateX(e){return this.rotateOnAxis(mp,e)}rotateY(e){return this.rotateOnAxis(gp,e)}rotateZ(e){return this.rotateOnAxis(_p,e)}translateOnAxis(e,t){return pp.copy(e).applyQuaternion(this.quaternion),this.position.add(pp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(mp,e)}translateY(e){return this.translateOnAxis(gp,e)}translateZ(e){return this.translateOnAxis(_p,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(li.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?yo.copy(e):yo.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ta.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?li.lookAt(ta,yo,this.up):li.lookAt(yo,ta,this.up),this.quaternion.setFromRotationMatrix(li),r&&(li.extractRotation(r.matrixWorld),Xr.setFromRotationMatrix(li),this.quaternion.premultiply(Xr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.parent!==null&&e.parent.remove(e),e.parent=this,this.children.push(e),e.dispatchEvent(Xy)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Yy)),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),li.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),li.multiply(e.parent.matrixWorld)),e.applyMatrix4(li),this.add(e),e.updateWorldMatrix(!1,!0),this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ta,e,Wy),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ta,jy,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++){const s=t[i];(s.matrixWorldAutoUpdate===!0||e===!0)&&s.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.matrixWorldAutoUpdate===!0&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++){const o=r[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),d=a(e.skeletons),p=a(e.animations),v=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}bt.DEFAULT_UP=new P(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const zn=new P,ci=new P,Vc=new P,ui=new P,Yr=new P,qr=new P,vp=new P,Wc=new P,jc=new P,Xc=new P;let So=!1;class Ln{constructor(e=new P,t=new P,i=new P){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),zn.subVectors(e,t),r.cross(zn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){zn.subVectors(r,t),ci.subVectors(i,t),Vc.subVectors(e,t);const a=zn.dot(zn),o=zn.dot(ci),l=zn.dot(Vc),c=ci.dot(ci),h=ci.dot(Vc),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const d=1/f,p=(c*l-o*h)*d,v=(a*h-o*l)*d;return s.set(1-p-v,v,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,ui)===null?!1:ui.x>=0&&ui.y>=0&&ui.x+ui.y<=1}static getUV(e,t,i,r,s,a,o,l){return So===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),So=!0),this.getInterpolation(e,t,i,r,s,a,o,l)}static getInterpolation(e,t,i,r,s,a,o,l){return this.getBarycoord(e,t,i,r,ui)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,ui.x),l.addScaledVector(a,ui.y),l.addScaledVector(o,ui.z),l)}static isFrontFacing(e,t,i,r){return zn.subVectors(i,t),ci.subVectors(e,t),zn.cross(ci).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),ci.subVectors(this.a,this.b),zn.cross(ci).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Ln.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Ln.getBarycoord(e,this.a,this.b,this.c,t)}getUV(e,t,i,r,s){return So===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),So=!0),Ln.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}getInterpolation(e,t,i,r,s){return Ln.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Ln.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Ln.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let a,o;Yr.subVectors(r,i),qr.subVectors(s,i),Wc.subVectors(e,i);const l=Yr.dot(Wc),c=qr.dot(Wc);if(l<=0&&c<=0)return t.copy(i);jc.subVectors(e,r);const h=Yr.dot(jc),f=qr.dot(jc);if(h>=0&&f<=h)return t.copy(r);const d=l*f-h*c;if(d<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Yr,a);Xc.subVectors(e,s);const p=Yr.dot(Xc),v=qr.dot(Xc);if(v>=0&&p<=v)return t.copy(s);const x=p*c-l*v;if(x<=0&&c>=0&&v<=0)return o=c/(c-v),t.copy(i).addScaledVector(qr,o);const m=h*v-p*f;if(m<=0&&f-h>=0&&p-v>=0)return vp.subVectors(s,r),o=(f-h)/(f-h+(p-v)),t.copy(r).addScaledVector(vp,o);const u=1/(m+x+d);return a=x*u,o=d*u,t.copy(i).addScaledVector(Yr,a).addScaledVector(qr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Ig={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Li={h:0,s:0,l:0},Mo={h:0,s:0,l:0};function Yc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class qe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=kt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=et.workingColorSpace){return this.r=e,this.g=t,this.b=i,et.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=et.workingColorSpace){if(e=Dy(e,1),t=ln(t,0,1),i=ln(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,a=2*i-s;this.r=Yc(a,s,e+1/3),this.g=Yc(a,s,e),this.b=Yc(a,s,e-1/3)}return et.toWorkingColorSpace(this,r),this}setStyle(e,t=kt){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=kt){const i=Ig[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Rs(e.r),this.g=Rs(e.g),this.b=Rs(e.b),this}copyLinearToSRGB(e){return this.r=Uc(e.r),this.g=Uc(e.g),this.b=Uc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=kt){return et.fromWorkingColorSpace(Wt.copy(this),e),Math.round(ln(Wt.r*255,0,255))*65536+Math.round(ln(Wt.g*255,0,255))*256+Math.round(ln(Wt.b*255,0,255))}getHexString(e=kt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.fromWorkingColorSpace(Wt.copy(this),t);const i=Wt.r,r=Wt.g,s=Wt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=et.workingColorSpace){return et.fromWorkingColorSpace(Wt.copy(this),t),e.r=Wt.r,e.g=Wt.g,e.b=Wt.b,e}getStyle(e=kt){et.fromWorkingColorSpace(Wt.copy(this),e);const t=Wt.r,i=Wt.g,r=Wt.b;return e!==kt?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Li),this.setHSL(Li.h+e,Li.s+t,Li.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Li),e.getHSL(Mo);const i=Dc(Li.h,Mo.h,t),r=Dc(Li.s,Mo.s,t),s=Dc(Li.l,Mo.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Wt=new qe;qe.NAMES=Ig;let qy=0;class Fr extends Hs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:qy++}),this.uuid=Zi(),this.name="",this.type="Material",this.blending=As,this.side=er,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=th,this.blendDst=nh,this.blendEquation=mr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=Ml,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=sp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=zr,this.stencilZFail=zr,this.stencilZPass=zr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==As&&(i.blending=this.blending),this.side!==er&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==th&&(i.blendSrc=this.blendSrc),this.blendDst!==nh&&(i.blendDst=this.blendDst),this.blendEquation!==mr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ml&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==sp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==zr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==zr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==zr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(t){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Dr extends Fr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=gg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const wt=new P,Eo=new Ce;class qn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=ah,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Bi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Eo.fromBufferAttribute(this,t),Eo.applyMatrix3(e),this.setXY(t,Eo.x,Eo.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix3(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)wt.fromBufferAttribute(this,t),wt.applyMatrix4(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)wt.fromBufferAttribute(this,t),wt.applyNormalMatrix(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)wt.fromBufferAttribute(this,t),wt.transformDirection(e),this.setXYZ(t,wt.x,wt.y,wt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=mi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=tt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=mi(t,this.array)),t}setX(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=mi(t,this.array)),t}setY(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=mi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=mi(t,this.array)),t}setW(e,t){return this.normalized&&(t=tt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),i=tt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),i=tt(i,this.array),r=tt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=tt(t,this.array),i=tt(i,this.array),r=tt(r,this.array),s=tt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ah&&(e.usage=this.usage),e}}class Ug extends qn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Og extends qn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class $n extends qn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let $y=0;const Rn=new St,qc=new bt,$r=new P,vn=new tn,na=new tn,Dt=new P;class Zn extends Hs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:$y++}),this.uuid=Zi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cg(e)?Og:Ug)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new je().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Rn.makeRotationFromQuaternion(e),this.applyMatrix4(Rn),this}rotateX(e){return Rn.makeRotationX(e),this.applyMatrix4(Rn),this}rotateY(e){return Rn.makeRotationY(e),this.applyMatrix4(Rn),this}rotateZ(e){return Rn.makeRotationZ(e),this.applyMatrix4(Rn),this}translate(e,t,i){return Rn.makeTranslation(e,t,i),this.applyMatrix4(Rn),this}scale(e,t,i){return Rn.makeScale(e,t,i),this.applyMatrix4(Rn),this}lookAt(e){return qc.lookAt(e),qc.updateMatrix(),this.applyMatrix4(qc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($r).negate(),this.translate($r.x,$r.y,$r.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new $n(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new tn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];vn.setFromBufferAttribute(s),this.morphTargetsRelative?(Dt.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(Dt),Dt.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(Dt)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Yl);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new P,1/0);return}if(e){const i=this.boundingSphere.center;if(vn.setFromBufferAttribute(e),t)for(let s=0,a=t.length;s<a;s++){const o=t[s];na.setFromBufferAttribute(o),this.morphTargetsRelative?(Dt.addVectors(vn.min,na.min),vn.expandByPoint(Dt),Dt.addVectors(vn.max,na.max),vn.expandByPoint(Dt)):(vn.expandByPoint(na.min),vn.expandByPoint(na.max))}vn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Dt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Dt));if(t)for(let s=0,a=t.length;s<a;s++){const o=t[s],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Dt.fromBufferAttribute(o,c),l&&($r.fromBufferAttribute(e,c),Dt.add($r)),r=Math.max(r,i.distanceToSquared(Dt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.array,r=t.position.array,s=t.normal.array,a=t.uv.array,o=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new qn(new Float32Array(4*o),4));const l=this.getAttribute("tangent").array,c=[],h=[];for(let E=0;E<o;E++)c[E]=new P,h[E]=new P;const f=new P,d=new P,p=new P,v=new Ce,x=new Ce,m=new Ce,u=new P,_=new P;function g(E,F,z){f.fromArray(r,E*3),d.fromArray(r,F*3),p.fromArray(r,z*3),v.fromArray(a,E*2),x.fromArray(a,F*2),m.fromArray(a,z*2),d.sub(f),p.sub(f),x.sub(v),m.sub(v);const q=1/(x.x*m.y-m.x*x.y);isFinite(q)&&(u.copy(d).multiplyScalar(m.y).addScaledVector(p,-x.y).multiplyScalar(q),_.copy(p).multiplyScalar(x.x).addScaledVector(d,-m.x).multiplyScalar(q),c[E].add(u),c[F].add(u),c[z].add(u),h[E].add(_),h[F].add(_),h[z].add(_))}let y=this.groups;y.length===0&&(y=[{start:0,count:i.length}]);for(let E=0,F=y.length;E<F;++E){const z=y[E],q=z.start,L=z.count;for(let k=q,j=q+L;k<j;k+=3)g(i[k+0],i[k+1],i[k+2])}const C=new P,T=new P,A=new P,I=new P;function S(E){A.fromArray(s,E*3),I.copy(A);const F=c[E];C.copy(F),C.sub(A.multiplyScalar(A.dot(F))).normalize(),T.crossVectors(I,F);const q=T.dot(h[E])<0?-1:1;l[E*4]=C.x,l[E*4+1]=C.y,l[E*4+2]=C.z,l[E*4+3]=q}for(let E=0,F=y.length;E<F;++E){const z=y[E],q=z.start,L=z.count;for(let k=q,j=q+L;k<j;k+=3)S(i[k+0]),S(i[k+1]),S(i[k+2])}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new qn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new P,s=new P,a=new P,o=new P,l=new P,c=new P,h=new P,f=new P;if(e)for(let d=0,p=e.count;d<p;d+=3){const v=e.getX(d+0),x=e.getX(d+1),m=e.getX(d+2);r.fromBufferAttribute(t,v),s.fromBufferAttribute(t,x),a.fromBufferAttribute(t,m),h.subVectors(a,s),f.subVectors(r,s),h.cross(f),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,m),o.add(h),l.add(h),c.add(h),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)r.fromBufferAttribute(t,d+0),s.fromBufferAttribute(t,d+1),a.fromBufferAttribute(t,d+2),h.subVectors(a,s),f.subVectors(r,s),h.cross(f),i.setXYZ(d+0,h.x,h.y,h.z),i.setXYZ(d+1,h.x,h.y,h.z),i.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Dt.fromBufferAttribute(e,t),Dt.normalize(),e.setXYZ(t,Dt.x,Dt.y,Dt.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,d=new c.constructor(l.length*h);let p=0,v=0;for(let x=0,m=l.length;x<m;x++){o.isInterleavedBufferAttribute?p=l[x]*o.data.stride+o.offset:p=l[x]*h;for(let u=0;u<h;u++)d[v++]=c[p++]}return new qn(d,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Zn,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);t.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let h=0,f=c.length;h<f;h++){const d=c[h],p=e(d,i);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,d=c.length;f<d;f++){const p=c[f];h.push(p.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],f=s[c];for(let d=0,p=f.length;d<p;d++)h.push(f[d].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const xp=new St,lr=new ql,wo=new Yl,yp=new P,Kr=new P,Zr=new P,Qr=new P,$c=new P,To=new P,Ao=new Ce,Ro=new Ce,bo=new Ce,Sp=new P,Mp=new P,Ep=new P,Co=new P,Po=new P;class ee extends bt{constructor(e=new Zn,t=new Dr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){To.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=o[l],f=s[l];h!==0&&($c.fromBufferAttribute(f,e),a?To.addScaledVector($c,h):To.addScaledVector($c.sub(t),h))}t.add(To)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),wo.copy(i.boundingSphere),wo.applyMatrix4(s),lr.copy(e.ray).recast(e.near),!(wo.containsPoint(lr.origin)===!1&&(lr.intersectSphere(wo,yp)===null||lr.origin.distanceToSquared(yp)>(e.far-e.near)**2))&&(xp.copy(s).invert(),lr.copy(e.ray).applyMatrix4(xp),!(i.boundingBox!==null&&lr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,lr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,x=d.length;v<x;v++){const m=d[v],u=a[m.materialIndex],_=Math.max(m.start,p.start),g=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,C=g;y<C;y+=3){const T=o.getX(y),A=o.getX(y+1),I=o.getX(y+2);r=Lo(this,u,e,i,c,h,f,T,A,I),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,p.start),x=Math.min(o.count,p.start+p.count);for(let m=v,u=x;m<u;m+=3){const _=o.getX(m),g=o.getX(m+1),y=o.getX(m+2);r=Lo(this,a,e,i,c,h,f,_,g,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,x=d.length;v<x;v++){const m=d[v],u=a[m.materialIndex],_=Math.max(m.start,p.start),g=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let y=_,C=g;y<C;y+=3){const T=y,A=y+1,I=y+2;r=Lo(this,u,e,i,c,h,f,T,A,I),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let m=v,u=x;m<u;m+=3){const _=m,g=m+1,y=m+2;r=Lo(this,a,e,i,c,h,f,_,g,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function Ky(n,e,t,i,r,s,a,o){let l;if(e.side===pn?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===er,o),l===null)return null;Po.copy(o),Po.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Po);return c<t.near||c>t.far?null:{distance:c,point:Po.clone(),object:n}}function Lo(n,e,t,i,r,s,a,o,l,c){n.getVertexPosition(o,Kr),n.getVertexPosition(l,Zr),n.getVertexPosition(c,Qr);const h=Ky(n,e,t,i,Kr,Zr,Qr,Co);if(h){r&&(Ao.fromBufferAttribute(r,o),Ro.fromBufferAttribute(r,l),bo.fromBufferAttribute(r,c),h.uv=Ln.getInterpolation(Co,Kr,Zr,Qr,Ao,Ro,bo,new Ce)),s&&(Ao.fromBufferAttribute(s,o),Ro.fromBufferAttribute(s,l),bo.fromBufferAttribute(s,c),h.uv1=Ln.getInterpolation(Co,Kr,Zr,Qr,Ao,Ro,bo,new Ce),h.uv2=h.uv1),a&&(Sp.fromBufferAttribute(a,o),Mp.fromBufferAttribute(a,l),Ep.fromBufferAttribute(a,c),h.normal=Ln.getInterpolation(Co,Kr,Zr,Qr,Sp,Mp,Ep,new P),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new P,materialIndex:0};Ln.getNormal(Kr,Zr,Qr,f.normal),h.face=f}return h}class ae extends Zn{constructor(e=1,t=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],h=[],f=[];let d=0,p=0;v("z","y","x",-1,-1,i,t,e,a,s,0),v("z","y","x",1,-1,i,t,-e,a,s,1),v("x","z","y",1,1,e,i,t,r,a,2),v("x","z","y",1,-1,e,i,-t,r,a,3),v("x","y","z",1,-1,e,t,i,r,s,4),v("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new $n(c,3)),this.setAttribute("normal",new $n(h,3)),this.setAttribute("uv",new $n(f,2));function v(x,m,u,_,g,y,C,T,A,I,S){const E=y/A,F=C/I,z=y/2,q=C/2,L=T/2,k=A+1,j=I+1;let K=0,D=0;const O=new P;for(let B=0;B<j;B++){const $=B*F-q;for(let Q=0;Q<k;Q++){const X=Q*E-z;O[x]=X*_,O[m]=$*g,O[u]=L,c.push(O.x,O.y,O.z),O[x]=0,O[m]=0,O[u]=T>0?1:-1,h.push(O.x,O.y,O.z),f.push(Q/A),f.push(1-B/I),K+=1}}for(let B=0;B<I;B++)for(let $=0;$<A;$++){const Q=d+$+k*B,X=d+$+k*(B+1),J=d+($+1)+k*(B+1),ce=d+($+1)+k*B;l.push(Q,X,ce),l.push(X,J,ce),D+=6}o.addGroup(p,D,S),p+=D,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ae(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Fs(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Zt(n){const e={};for(let t=0;t<n.length;t++){const i=Fs(n[t]);for(const r in i)e[r]=i[r]}return e}function Zy(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function kg(n){return n.getRenderTarget()===null?n.outputColorSpace:et.workingColorSpace}const Qy={clone:Fs,merge:Zt};var Jy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,eS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ir extends Fr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Jy,this.fragmentShader=eS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Fs(e.uniforms),this.uniformsGroups=Zy(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?t.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[r]={type:"m4",value:a.toArray()}:t.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Fg extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new St,this.projectionMatrix=new St,this.projectionMatrixInverse=new St,this.coordinateSystem=vi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class yn extends Fg{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=lh*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Nc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return lh*2*Math.atan(Math.tan(Nc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(e,t,i,r,s,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Nc*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,t-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Jr=-90,es=1;class tS extends bt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new yn(Jr,es,e,t);r.layers=this.layers,this.add(r);const s=new yn(Jr,es,e,t);s.layers=this.layers,this.add(s);const a=new yn(Jr,es,e,t);a.layers=this.layers,this.add(a);const o=new yn(Jr,es,e,t);o.layers=this.layers,this.add(o);const l=new yn(Jr,es,e,t);l.layers=this.layers,this.add(l);const c=new yn(Jr,es,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,a,o,l]=t;for(const c of t)this.remove(c);if(e===vi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Al)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,h]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,a),e.setRenderTarget(i,2,r),e.render(t,o),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,h),e.setRenderTarget(f,d,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class Bg extends mn{constructor(e,t,i,r,s,a,o,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Us,super(e,t,i,r,s,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class nS extends Nr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];t.encoding!==void 0&&(ya("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),t.colorSpace=t.encoding===Ar?kt:Nn),this.texture=new Bg(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Pn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ae(5,5,5),s=new Ir({name:"CubemapFromEquirect",uniforms:Fs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:pn,blending:qi});s.uniforms.tEquirect.value=t;const a=new ee(r,s),o=t.minFilter;return t.minFilter===Fa&&(t.minFilter=Pn),new tS(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,r);e.setRenderTarget(s)}}const Kc=new P,iS=new P,rS=new je;class fr{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=Kc.subVectors(i,t).cross(iS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Kc),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||rS.getNormalMatrix(e),r=this.coplanarPoint(Kc).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const cr=new Yl,No=new P;class ld{constructor(e=new fr,t=new fr,i=new fr,r=new fr,s=new fr,a=new fr){this.planes=[e,t,i,r,s,a]}set(e,t,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=vi){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],h=r[5],f=r[6],d=r[7],p=r[8],v=r[9],x=r[10],m=r[11],u=r[12],_=r[13],g=r[14],y=r[15];if(i[0].setComponents(l-s,d-c,m-p,y-u).normalize(),i[1].setComponents(l+s,d+c,m+p,y+u).normalize(),i[2].setComponents(l+a,d+h,m+v,y+_).normalize(),i[3].setComponents(l-a,d-h,m-v,y-_).normalize(),i[4].setComponents(l-o,d-f,m-x,y-g).normalize(),t===vi)i[5].setComponents(l+o,d+f,m+x,y+g).normalize();else if(t===Al)i[5].setComponents(o,f,x,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),cr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),cr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(cr)}intersectsSprite(e){return cr.center.set(0,0,0),cr.radius=.7071067811865476,cr.applyMatrix4(e.matrixWorld),this.intersectsSphere(cr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(No.x=r.normal.x>0?e.max.x:e.min.x,No.y=r.normal.y>0?e.max.y:e.min.y,No.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(No)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function zg(){let n=null,e=!1,t=null,i=null;function r(s,a){t(s,a),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function sS(n,e){const t=e.isWebGL2,i=new WeakMap;function r(c,h){const f=c.array,d=c.usage,p=f.byteLength,v=n.createBuffer();n.bindBuffer(h,v),n.bufferData(h,f,d),c.onUploadCallback();let x;if(f instanceof Float32Array)x=n.FLOAT;else if(f instanceof Uint16Array)if(c.isFloat16BufferAttribute)if(t)x=n.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=n.UNSIGNED_SHORT;else if(f instanceof Int16Array)x=n.SHORT;else if(f instanceof Uint32Array)x=n.UNSIGNED_INT;else if(f instanceof Int32Array)x=n.INT;else if(f instanceof Int8Array)x=n.BYTE;else if(f instanceof Uint8Array)x=n.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)x=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:v,type:x,bytesPerElement:f.BYTES_PER_ELEMENT,version:c.version,size:p}}function s(c,h,f){const d=h.array,p=h._updateRange,v=h.updateRanges;if(n.bindBuffer(f,c),p.count===-1&&v.length===0&&n.bufferSubData(f,0,d),v.length!==0){for(let x=0,m=v.length;x<m;x++){const u=v[x];t?n.bufferSubData(f,u.start*d.BYTES_PER_ELEMENT,d,u.start,u.count):n.bufferSubData(f,u.start*d.BYTES_PER_ELEMENT,d.subarray(u.start,u.start+u.count))}h.clearUpdateRanges()}p.count!==-1&&(t?n.bufferSubData(f,p.offset*d.BYTES_PER_ELEMENT,d,p.offset,p.count):n.bufferSubData(f,p.offset*d.BYTES_PER_ELEMENT,d.subarray(p.offset,p.offset+p.count)),p.count=-1),h.onUploadCallback()}function a(c){return c.isInterleavedBufferAttribute&&(c=c.data),i.get(c)}function o(c){c.isInterleavedBufferAttribute&&(c=c.data);const h=i.get(c);h&&(n.deleteBuffer(h.buffer),i.delete(c))}function l(c,h){if(c.isGLBufferAttribute){const d=i.get(c);(!d||d.version<c.version)&&i.set(c,{buffer:c.buffer,type:c.type,bytesPerElement:c.elementSize,version:c.version});return}c.isInterleavedBufferAttribute&&(c=c.data);const f=i.get(c);if(f===void 0)i.set(c,r(c,h));else if(f.version<c.version){if(f.size!==c.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(f.buffer,c,h),f.version=c.version}}return{get:a,remove:o,update:l}}class Ur extends Zn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,a=t/2,o=Math.floor(i),l=Math.floor(r),c=o+1,h=l+1,f=e/o,d=t/l,p=[],v=[],x=[],m=[];for(let u=0;u<h;u++){const _=u*d-a;for(let g=0;g<c;g++){const y=g*f-s;v.push(y,-_,0),x.push(0,0,1),m.push(g/o),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let _=0;_<o;_++){const g=_+c*u,y=_+c*(u+1),C=_+1+c*(u+1),T=_+1+c*u;p.push(g,y,T),p.push(y,C,T)}this.setIndex(p),this.setAttribute("position",new $n(v,3)),this.setAttribute("normal",new $n(x,3)),this.setAttribute("uv",new $n(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ur(e.width,e.height,e.widthSegments,e.heightSegments)}}var aS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,oS=`#ifdef USE_ALPHAHASH
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
#endif`,lS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,uS=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,hS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,dS=`#ifdef USE_AOMAP
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
#endif`,fS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pS=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
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
#endif`,mS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,gS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_S=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,xS=`#ifdef USE_IRIDESCENCE
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
#endif`,yS=`#ifdef USE_BUMPMAP
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
#endif`,SS=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
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
#endif`,MS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ES=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,wS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,TS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,AS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,RS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,bS=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,CS=`#define PI 3.141592653589793
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
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
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
} // validated`,PS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,LS=`vec3 transformedNormal = objectNormal;
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
#endif`,NS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,DS=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,IS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,US=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,OS="gl_FragColor = linearToOutputTexel( gl_FragColor );",kS=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,FS=`#ifdef USE_ENVMAP
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
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
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
#endif`,BS=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,zS=`#ifdef USE_ENVMAP
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
#endif`,GS=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,HS=`#ifdef USE_ENVMAP
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
#endif`,VS=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,WS=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jS=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,XS=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,YS=`#ifdef USE_GRADIENTMAP
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
}`,qS=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,$S=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,KS=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ZS=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,QS=`uniform bool receiveShadow;
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
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
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
#endif`,JS=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
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
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
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
#endif`,eM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,nM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,iM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,rM=`PhysicalMaterial material;
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
#endif`,sM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
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
}`,aM=`
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
#endif`,oM=`#if defined( RE_IndirectDiffuse )
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
#endif`,lM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cM=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,uM=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hM=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,dM=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,fM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gM=`#if defined( USE_POINTS_UV )
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
#endif`,_M=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,xM=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,SM=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,MM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,EM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,wM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,TM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,AM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,RM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,bM=`#ifdef USE_NORMALMAP
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
#endif`,CM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,PM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,LM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,NM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,DM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,IM=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
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
}`,UM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,OM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,FM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,BM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,zM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,GM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
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
		return shadow;
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
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
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
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,HM=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
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
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,VM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,WM=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,jM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,XM=`#ifdef USE_SKINNING
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
#endif`,YM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,qM=`#ifdef USE_SKINNING
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
#endif`,$M=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,KM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,ZM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,QM=`#ifndef saturate
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
vec3 OptimizedCineonToneMapping( vec3 color ) {
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
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,JM=`#ifdef USE_TRANSMISSION
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
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,eE=`#ifdef USE_TRANSMISSION
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
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,tE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,iE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const sE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,aE=`uniform sampler2D t2D;
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
}`,oE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hE=`#include <common>
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
}`,dE=`#if DEPTH_PACKING == 3200
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
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
	#endif
}`,fE=`#define DISTANCE
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
}`,pE=`#define DISTANCE
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,mE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_E=`uniform float scale;
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
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vE=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xE=`#include <common>
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
}`,yE=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,SE=`#define LAMBERT
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
}`,ME=`#define LAMBERT
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,EE=`#define MATCAP
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
}`,wE=`#define MATCAP
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,TE=`#define NORMAL
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
}`,AE=`#define NORMAL
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
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,RE=`#define PHONG
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
}`,bE=`#define PHONG
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,CE=`#define STANDARD
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
}`,PE=`#define STANDARD
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,LE=`#define TOON
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
}`,NE=`#define TOON
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,DE=`uniform float size;
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
}`,IE=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,UE=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
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
}`,OE=`uniform vec3 color;
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
}`,kE=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
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
}`,FE=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Fe={alphahash_fragment:aS,alphahash_pars_fragment:oS,alphamap_fragment:lS,alphamap_pars_fragment:cS,alphatest_fragment:uS,alphatest_pars_fragment:hS,aomap_fragment:dS,aomap_pars_fragment:fS,batching_pars_vertex:pS,batching_vertex:mS,begin_vertex:gS,beginnormal_vertex:_S,bsdfs:vS,iridescence_fragment:xS,bumpmap_pars_fragment:yS,clipping_planes_fragment:SS,clipping_planes_pars_fragment:MS,clipping_planes_pars_vertex:ES,clipping_planes_vertex:wS,color_fragment:TS,color_pars_fragment:AS,color_pars_vertex:RS,color_vertex:bS,common:CS,cube_uv_reflection_fragment:PS,defaultnormal_vertex:LS,displacementmap_pars_vertex:NS,displacementmap_vertex:DS,emissivemap_fragment:IS,emissivemap_pars_fragment:US,colorspace_fragment:OS,colorspace_pars_fragment:kS,envmap_fragment:FS,envmap_common_pars_fragment:BS,envmap_pars_fragment:zS,envmap_pars_vertex:GS,envmap_physical_pars_fragment:JS,envmap_vertex:HS,fog_vertex:VS,fog_pars_vertex:WS,fog_fragment:jS,fog_pars_fragment:XS,gradientmap_pars_fragment:YS,lightmap_fragment:qS,lightmap_pars_fragment:$S,lights_lambert_fragment:KS,lights_lambert_pars_fragment:ZS,lights_pars_begin:QS,lights_toon_fragment:eM,lights_toon_pars_fragment:tM,lights_phong_fragment:nM,lights_phong_pars_fragment:iM,lights_physical_fragment:rM,lights_physical_pars_fragment:sM,lights_fragment_begin:aM,lights_fragment_maps:oM,lights_fragment_end:lM,logdepthbuf_fragment:cM,logdepthbuf_pars_fragment:uM,logdepthbuf_pars_vertex:hM,logdepthbuf_vertex:dM,map_fragment:fM,map_pars_fragment:pM,map_particle_fragment:mM,map_particle_pars_fragment:gM,metalnessmap_fragment:_M,metalnessmap_pars_fragment:vM,morphcolor_vertex:xM,morphnormal_vertex:yM,morphtarget_pars_vertex:SM,morphtarget_vertex:MM,normal_fragment_begin:EM,normal_fragment_maps:wM,normal_pars_fragment:TM,normal_pars_vertex:AM,normal_vertex:RM,normalmap_pars_fragment:bM,clearcoat_normal_fragment_begin:CM,clearcoat_normal_fragment_maps:PM,clearcoat_pars_fragment:LM,iridescence_pars_fragment:NM,opaque_fragment:DM,packing:IM,premultiplied_alpha_fragment:UM,project_vertex:OM,dithering_fragment:kM,dithering_pars_fragment:FM,roughnessmap_fragment:BM,roughnessmap_pars_fragment:zM,shadowmap_pars_fragment:GM,shadowmap_pars_vertex:HM,shadowmap_vertex:VM,shadowmask_pars_fragment:WM,skinbase_vertex:jM,skinning_pars_vertex:XM,skinning_vertex:YM,skinnormal_vertex:qM,specularmap_fragment:$M,specularmap_pars_fragment:KM,tonemapping_fragment:ZM,tonemapping_pars_fragment:QM,transmission_fragment:JM,transmission_pars_fragment:eE,uv_pars_fragment:tE,uv_pars_vertex:nE,uv_vertex:iE,worldpos_vertex:rE,background_vert:sE,background_frag:aE,backgroundCube_vert:oE,backgroundCube_frag:lE,cube_vert:cE,cube_frag:uE,depth_vert:hE,depth_frag:dE,distanceRGBA_vert:fE,distanceRGBA_frag:pE,equirect_vert:mE,equirect_frag:gE,linedashed_vert:_E,linedashed_frag:vE,meshbasic_vert:xE,meshbasic_frag:yE,meshlambert_vert:SE,meshlambert_frag:ME,meshmatcap_vert:EE,meshmatcap_frag:wE,meshnormal_vert:TE,meshnormal_frag:AE,meshphong_vert:RE,meshphong_frag:bE,meshphysical_vert:CE,meshphysical_frag:PE,meshtoon_vert:LE,meshtoon_frag:NE,points_vert:DE,points_frag:IE,shadow_vert:UE,shadow_frag:OE,sprite_vert:kE,sprite_frag:FE},le={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new Ce(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new Ce(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},ti={basic:{uniforms:Zt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:Fe.meshbasic_vert,fragmentShader:Fe.meshbasic_frag},lambert:{uniforms:Zt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new qe(0)}}]),vertexShader:Fe.meshlambert_vert,fragmentShader:Fe.meshlambert_frag},phong:{uniforms:Zt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:Fe.meshphong_vert,fragmentShader:Fe.meshphong_frag},standard:{uniforms:Zt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag},toon:{uniforms:Zt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new qe(0)}}]),vertexShader:Fe.meshtoon_vert,fragmentShader:Fe.meshtoon_frag},matcap:{uniforms:Zt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:Fe.meshmatcap_vert,fragmentShader:Fe.meshmatcap_frag},points:{uniforms:Zt([le.points,le.fog]),vertexShader:Fe.points_vert,fragmentShader:Fe.points_frag},dashed:{uniforms:Zt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Fe.linedashed_vert,fragmentShader:Fe.linedashed_frag},depth:{uniforms:Zt([le.common,le.displacementmap]),vertexShader:Fe.depth_vert,fragmentShader:Fe.depth_frag},normal:{uniforms:Zt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:Fe.meshnormal_vert,fragmentShader:Fe.meshnormal_frag},sprite:{uniforms:Zt([le.sprite,le.fog]),vertexShader:Fe.sprite_vert,fragmentShader:Fe.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Fe.background_vert,fragmentShader:Fe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Fe.backgroundCube_vert,fragmentShader:Fe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Fe.cube_vert,fragmentShader:Fe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Fe.equirect_vert,fragmentShader:Fe.equirect_frag},distanceRGBA:{uniforms:Zt([le.common,le.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Fe.distanceRGBA_vert,fragmentShader:Fe.distanceRGBA_frag},shadow:{uniforms:Zt([le.lights,le.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:Fe.shadow_vert,fragmentShader:Fe.shadow_frag}};ti.physical={uniforms:Zt([ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new Ce(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new Ce},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new Ce},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:Fe.meshphysical_vert,fragmentShader:Fe.meshphysical_frag};const Do={r:0,b:0,g:0};function BE(n,e,t,i,r,s,a){const o=new qe(0);let l=s===!0?0:1,c,h,f=null,d=0,p=null;function v(m,u){let _=!1,g=u.isScene===!0?u.background:null;g&&g.isTexture&&(g=(u.backgroundBlurriness>0?t:e).get(g)),g===null?x(o,l):g&&g.isColor&&(x(g,1),_=!0);const y=n.xr.getEnvironmentBlendMode();y==="additive"?i.buffers.color.setClear(0,0,0,1,a):y==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||_)&&n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil),g&&(g.isCubeTexture||g.mapping===jl)?(h===void 0&&(h=new ee(new ae(1,1,1),new Ir({name:"BackgroundCubeMaterial",uniforms:Fs(ti.backgroundCube.uniforms),vertexShader:ti.backgroundCube.vertexShader,fragmentShader:ti.backgroundCube.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(C,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),h.material.uniforms.envMap.value=g,h.material.uniforms.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=u.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,h.material.toneMapped=et.getTransfer(g.colorSpace)!==ot,(f!==g||d!==g.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,f=g,d=g.version,p=n.toneMapping),h.layers.enableAll(),m.unshift(h,h.geometry,h.material,0,0,null)):g&&g.isTexture&&(c===void 0&&(c=new ee(new Ur(2,2),new Ir({name:"BackgroundMaterial",uniforms:Fs(ti.background.uniforms),vertexShader:ti.background.vertexShader,fragmentShader:ti.background.fragmentShader,side:er,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=g,c.material.uniforms.backgroundIntensity.value=u.backgroundIntensity,c.material.toneMapped=et.getTransfer(g.colorSpace)!==ot,g.matrixAutoUpdate===!0&&g.updateMatrix(),c.material.uniforms.uvTransform.value.copy(g.matrix),(f!==g||d!==g.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,f=g,d=g.version,p=n.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null))}function x(m,u){m.getRGB(Do,kg(n)),i.buffers.color.setClear(Do.r,Do.g,Do.b,u,a)}return{getClearColor:function(){return o},setClearColor:function(m,u=1){o.set(m),l=u,x(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(m){l=m,x(o,l)},render:v}}function zE(n,e,t,i){const r=n.getParameter(n.MAX_VERTEX_ATTRIBS),s=i.isWebGL2?null:e.get("OES_vertex_array_object"),a=i.isWebGL2||s!==null,o={},l=m(null);let c=l,h=!1;function f(L,k,j,K,D){let O=!1;if(a){const B=x(K,j,k);c!==B&&(c=B,p(c.object)),O=u(L,K,j,D),O&&_(L,K,j,D)}else{const B=k.wireframe===!0;(c.geometry!==K.id||c.program!==j.id||c.wireframe!==B)&&(c.geometry=K.id,c.program=j.id,c.wireframe=B,O=!0)}D!==null&&t.update(D,n.ELEMENT_ARRAY_BUFFER),(O||h)&&(h=!1,I(L,k,j,K),D!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(D).buffer))}function d(){return i.isWebGL2?n.createVertexArray():s.createVertexArrayOES()}function p(L){return i.isWebGL2?n.bindVertexArray(L):s.bindVertexArrayOES(L)}function v(L){return i.isWebGL2?n.deleteVertexArray(L):s.deleteVertexArrayOES(L)}function x(L,k,j){const K=j.wireframe===!0;let D=o[L.id];D===void 0&&(D={},o[L.id]=D);let O=D[k.id];O===void 0&&(O={},D[k.id]=O);let B=O[K];return B===void 0&&(B=m(d()),O[K]=B),B}function m(L){const k=[],j=[],K=[];for(let D=0;D<r;D++)k[D]=0,j[D]=0,K[D]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:j,attributeDivisors:K,object:L,attributes:{},index:null}}function u(L,k,j,K){const D=c.attributes,O=k.attributes;let B=0;const $=j.getAttributes();for(const Q in $)if($[Q].location>=0){const J=D[Q];let ce=O[Q];if(ce===void 0&&(Q==="instanceMatrix"&&L.instanceMatrix&&(ce=L.instanceMatrix),Q==="instanceColor"&&L.instanceColor&&(ce=L.instanceColor)),J===void 0||J.attribute!==ce||ce&&J.data!==ce.data)return!0;B++}return c.attributesNum!==B||c.index!==K}function _(L,k,j,K){const D={},O=k.attributes;let B=0;const $=j.getAttributes();for(const Q in $)if($[Q].location>=0){let J=O[Q];J===void 0&&(Q==="instanceMatrix"&&L.instanceMatrix&&(J=L.instanceMatrix),Q==="instanceColor"&&L.instanceColor&&(J=L.instanceColor));const ce={};ce.attribute=J,J&&J.data&&(ce.data=J.data),D[Q]=ce,B++}c.attributes=D,c.attributesNum=B,c.index=K}function g(){const L=c.newAttributes;for(let k=0,j=L.length;k<j;k++)L[k]=0}function y(L){C(L,0)}function C(L,k){const j=c.newAttributes,K=c.enabledAttributes,D=c.attributeDivisors;j[L]=1,K[L]===0&&(n.enableVertexAttribArray(L),K[L]=1),D[L]!==k&&((i.isWebGL2?n:e.get("ANGLE_instanced_arrays"))[i.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](L,k),D[L]=k)}function T(){const L=c.newAttributes,k=c.enabledAttributes;for(let j=0,K=k.length;j<K;j++)k[j]!==L[j]&&(n.disableVertexAttribArray(j),k[j]=0)}function A(L,k,j,K,D,O,B){B===!0?n.vertexAttribIPointer(L,k,j,D,O):n.vertexAttribPointer(L,k,j,K,D,O)}function I(L,k,j,K){if(i.isWebGL2===!1&&(L.isInstancedMesh||K.isInstancedBufferGeometry)&&e.get("ANGLE_instanced_arrays")===null)return;g();const D=K.attributes,O=j.getAttributes(),B=k.defaultAttributeValues;for(const $ in O){const Q=O[$];if(Q.location>=0){let X=D[$];if(X===void 0&&($==="instanceMatrix"&&L.instanceMatrix&&(X=L.instanceMatrix),$==="instanceColor"&&L.instanceColor&&(X=L.instanceColor)),X!==void 0){const J=X.normalized,ce=X.itemSize,me=t.get(X);if(me===void 0)continue;const ge=me.buffer,Pe=me.type,Oe=me.bytesPerElement,Re=i.isWebGL2===!0&&(Pe===n.INT||Pe===n.UNSIGNED_INT||X.gpuType===xg);if(X.isInterleavedBufferAttribute){const $e=X.data,G=$e.stride,Yt=X.offset;if($e.isInstancedInterleavedBuffer){for(let Ee=0;Ee<Q.locationSize;Ee++)C(Q.location+Ee,$e.meshPerAttribute);L.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=$e.meshPerAttribute*$e.count)}else for(let Ee=0;Ee<Q.locationSize;Ee++)y(Q.location+Ee);n.bindBuffer(n.ARRAY_BUFFER,ge);for(let Ee=0;Ee<Q.locationSize;Ee++)A(Q.location+Ee,ce/Q.locationSize,Pe,J,G*Oe,(Yt+ce/Q.locationSize*Ee)*Oe,Re)}else{if(X.isInstancedBufferAttribute){for(let $e=0;$e<Q.locationSize;$e++)C(Q.location+$e,X.meshPerAttribute);L.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let $e=0;$e<Q.locationSize;$e++)y(Q.location+$e);n.bindBuffer(n.ARRAY_BUFFER,ge);for(let $e=0;$e<Q.locationSize;$e++)A(Q.location+$e,ce/Q.locationSize,Pe,J,ce*Oe,ce/Q.locationSize*$e*Oe,Re)}}else if(B!==void 0){const J=B[$];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(Q.location,J);break;case 3:n.vertexAttrib3fv(Q.location,J);break;case 4:n.vertexAttrib4fv(Q.location,J);break;default:n.vertexAttrib1fv(Q.location,J)}}}}T()}function S(){z();for(const L in o){const k=o[L];for(const j in k){const K=k[j];for(const D in K)v(K[D].object),delete K[D];delete k[j]}delete o[L]}}function E(L){if(o[L.id]===void 0)return;const k=o[L.id];for(const j in k){const K=k[j];for(const D in K)v(K[D].object),delete K[D];delete k[j]}delete o[L.id]}function F(L){for(const k in o){const j=o[k];if(j[L.id]===void 0)continue;const K=j[L.id];for(const D in K)v(K[D].object),delete K[D];delete j[L.id]}}function z(){q(),h=!0,c!==l&&(c=l,p(c.object))}function q(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:z,resetDefaultState:q,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfProgram:F,initAttributes:g,enableAttribute:y,disableUnusedAttributes:T}}function GE(n,e,t,i){const r=i.isWebGL2;let s;function a(h){s=h}function o(h,f){n.drawArrays(s,h,f),t.update(f,s,1)}function l(h,f,d){if(d===0)return;let p,v;if(r)p=n,v="drawArraysInstanced";else if(p=e.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",p===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[v](s,h,f,d),t.update(f,s,d)}function c(h,f,d){if(d===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<d;v++)this.render(h[v],f[v]);else{p.multiDrawArraysWEBGL(s,h,0,f,0,d);let v=0;for(let x=0;x<d;x++)v+=f[x];t.update(v,s,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=c}function HE(n,e,t){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");i=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function s(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&n.constructor.name==="WebGL2RenderingContext";let o=t.precision!==void 0?t.precision:"highp";const l=s(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);const c=a||e.has("WEBGL_draw_buffers"),h=t.logarithmicDepthBuffer===!0,f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),d=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),p=n.getParameter(n.MAX_TEXTURE_SIZE),v=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),x=n.getParameter(n.MAX_VERTEX_ATTRIBS),m=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),u=n.getParameter(n.MAX_VARYING_VECTORS),_=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),g=d>0,y=a||e.has("OES_texture_float"),C=g&&y,T=a?n.getParameter(n.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:c,getMaxAnisotropy:r,getMaxPrecision:s,precision:o,logarithmicDepthBuffer:h,maxTextures:f,maxVertexTextures:d,maxTextureSize:p,maxCubemapSize:v,maxAttributes:x,maxVertexUniforms:m,maxVaryings:u,maxFragmentUniforms:_,vertexTextures:g,floatFragmentTextures:y,floatVertexTextures:C,maxSamples:T}}function VE(n){const e=this;let t=null,i=0,r=!1,s=!1;const a=new fr,o=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const p=f.length!==0||d||i!==0||r;return r=d,i=f.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){t=h(f,d,0)},this.setState=function(f,d,p){const v=f.clippingPlanes,x=f.clipIntersection,m=f.clipShadows,u=n.get(f);if(!r||v===null||v.length===0||s&&!m)s?h(null):c();else{const _=s?0:i,g=_*4;let y=u.clippingState||null;l.value=y,y=h(v,d,g,p);for(let C=0;C!==g;++C)y[C]=t[C];u.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(f,d,p,v){const x=f!==null?f.length:0;let m=null;if(x!==0){if(m=l.value,v!==!0||m===null){const u=p+x*4,_=d.matrixWorldInverse;o.getNormalMatrix(_),(m===null||m.length<u)&&(m=new Float32Array(u));for(let g=0,y=p;g!==x;++g,y+=4)a.copy(f[g]).applyMatrix4(_,o),a.normal.toArray(m,y),m[y+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,m}}function WE(n){let e=new WeakMap;function t(a,o){return o===ih?a.mapping=Us:o===rh&&(a.mapping=Os),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===ih||o===rh)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new nS(l.height/2);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",r),t(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Gg extends Fg{constructor(e=-1,t=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const vs=4,wp=[.125,.215,.35,.446,.526,.582],gr=20,Zc=new Gg,Tp=new qe;let Qc=null,Jc=0,eu=0;const pr=(1+Math.sqrt(5))/2,ts=1/pr,Ap=[new P(1,1,1),new P(-1,1,1),new P(1,1,-1),new P(-1,1,-1),new P(0,pr,ts),new P(0,pr,-ts),new P(ts,0,pr),new P(-ts,0,pr),new P(pr,ts,0),new P(-pr,ts,0)];class Rp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){Qc=this._renderer.getRenderTarget(),Jc=this._renderer.getActiveCubeFace(),eu=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Cp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Qc,Jc,eu),e.scissorTest=!1,Io(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Us||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Qc=this._renderer.getRenderTarget(),Jc=this._renderer.getActiveCubeFace(),eu=this._renderer.getActiveMipmapLevel();const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Pn,minFilter:Pn,generateMipmaps:!1,type:Ba,format:jn,colorSpace:wi,depthBuffer:!1},r=bp(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bp(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=jE(s)),this._blurMaterial=XE(s,e,t)}return r}_compileMaterial(e){const t=new ee(this._lodPlanes[0],e);this._renderer.compile(t,Zc)}_sceneToCubeUV(e,t,i,r){const o=new yn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,d=h.toneMapping;h.getClearColor(Tp),h.toneMapping=$i,h.autoClear=!1;const p=new Dr({name:"PMREM.Background",side:pn,depthWrite:!1,depthTest:!1}),v=new ee(new ae,p);let x=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,x=!0):(p.color.copy(Tp),x=!0);for(let u=0;u<6;u++){const _=u%3;_===0?(o.up.set(0,l[u],0),o.lookAt(c[u],0,0)):_===1?(o.up.set(0,0,l[u]),o.lookAt(0,c[u],0)):(o.up.set(0,l[u],0),o.lookAt(0,0,c[u]));const g=this._cubeSize;Io(r,_*g,u>2?g:0,g,g),h.setRenderTarget(r),x&&h.render(v,o),h.render(e,o)}v.geometry.dispose(),v.material.dispose(),h.toneMapping=d,h.autoClear=f,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Us||e.mapping===Os;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Cp());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new ee(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Io(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,Zc)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Ap[(r-1)%Ap.length];this._blur(e,r-1,r,s,a)}t.autoClear=i}_blur(e,t,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,f=new ee(this._lodPlanes[r],c),d=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*gr-1),x=s/v,m=isFinite(s)?1+Math.floor(h*x):gr;m>gr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${gr}`);const u=[];let _=0;for(let A=0;A<gr;++A){const I=A/x,S=Math.exp(-I*I/2);u.push(S),A===0?_+=S:A<m&&(_+=2*S)}for(let A=0;A<u.length;A++)u[A]=u[A]/_;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=u,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:g}=this;d.dTheta.value=v,d.mipInt.value=g-i;const y=this._sizeLods[r],C=3*y*(r>g-vs?r-g+vs:0),T=4*(this._cubeSize-y);Io(t,C,T,3*y,2*y),l.setRenderTarget(t),l.render(f,Zc)}}function jE(n){const e=[],t=[],i=[];let r=n;const s=n-vs+1+wp.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);t.push(o);let l=1/o;a>n-vs?l=wp[a-n+vs-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,f=1+c,d=[h,h,f,h,f,f,h,h,f,f,h,f],p=6,v=6,x=3,m=2,u=1,_=new Float32Array(x*v*p),g=new Float32Array(m*v*p),y=new Float32Array(u*v*p);for(let T=0;T<p;T++){const A=T%3*2/3-1,I=T>2?0:-1,S=[A,I,0,A+2/3,I,0,A+2/3,I+1,0,A,I,0,A+2/3,I+1,0,A,I+1,0];_.set(S,x*v*T),g.set(d,m*v*T);const E=[T,T,T,T,T,T];y.set(E,u*v*T)}const C=new Zn;C.setAttribute("position",new qn(_,x)),C.setAttribute("uv",new qn(g,m)),C.setAttribute("faceIndex",new qn(y,u)),e.push(C),r>vs&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function bp(n,e,t){const i=new Nr(n,e,t);return i.texture.mapping=jl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Io(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function XE(n,e,t){const i=new Float32Array(gr),r=new P(0,1,0);return new Ir({name:"SphericalGaussianBlur",defines:{n:gr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:cd(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function Cp(){return new Ir({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:cd(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function Pp(){return new Ir({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:cd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qi,depthTest:!1,depthWrite:!1})}function cd(){return`

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
	`}function YE(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===ih||l===rh,h=l===Us||l===Os;if(c||h)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=e.get(o);return t===null&&(t=new Rp(n)),f=c?t.fromEquirectangular(o,f):t.fromCubemap(o,f),e.set(o,f),f.texture}else{if(e.has(o))return e.get(o).texture;{const f=o.image;if(c&&f&&f.height>0||h&&f&&r(f)){t===null&&(t=new Rp(n));const d=c?t.fromEquirectangular(o):t.fromCubemap(o);return e.set(o,d),o.addEventListener("dispose",s),d.texture}else return null}}}return o}function r(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function qE(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(i){i.isWebGL2?(t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance")):(t("WEBGL_depth_texture"),t("OES_texture_float"),t("OES_texture_half_float"),t("OES_texture_half_float_linear"),t("OES_standard_derivatives"),t("OES_element_index_uint"),t("OES_vertex_array_object"),t("ANGLE_instanced_arrays")),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture")},get:function(i){const r=t(i);return r===null&&console.warn("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function $E(n,e,t,i){const r={},s=new WeakMap;function a(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const v in d.attributes)e.remove(d.attributes[v]);for(const v in d.morphAttributes){const x=d.morphAttributes[v];for(let m=0,u=x.length;m<u;m++)e.remove(x[m])}d.removeEventListener("dispose",a),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function o(f,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,t.memory.geometries++),d}function l(f){const d=f.attributes;for(const v in d)e.update(d[v],n.ARRAY_BUFFER);const p=f.morphAttributes;for(const v in p){const x=p[v];for(let m=0,u=x.length;m<u;m++)e.update(x[m],n.ARRAY_BUFFER)}}function c(f){const d=[],p=f.index,v=f.attributes.position;let x=0;if(p!==null){const _=p.array;x=p.version;for(let g=0,y=_.length;g<y;g+=3){const C=_[g+0],T=_[g+1],A=_[g+2];d.push(C,T,T,A,A,C)}}else if(v!==void 0){const _=v.array;x=v.version;for(let g=0,y=_.length/3-1;g<y;g+=3){const C=g+0,T=g+1,A=g+2;d.push(C,T,T,A,A,C)}}else return;const m=new(Cg(d)?Og:Ug)(d,1);m.version=x;const u=s.get(f);u&&e.remove(u),s.set(f,m)}function h(f){const d=s.get(f);if(d){const p=f.index;p!==null&&d.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function KE(n,e,t,i){const r=i.isWebGL2;let s;function a(p){s=p}let o,l;function c(p){o=p.type,l=p.bytesPerElement}function h(p,v){n.drawElements(s,v,o,p*l),t.update(v,s,1)}function f(p,v,x){if(x===0)return;let m,u;if(r)m=n,u="drawElementsInstanced";else if(m=e.get("ANGLE_instanced_arrays"),u="drawElementsInstancedANGLE",m===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[u](s,v,o,p*l,x),t.update(v,s,x)}function d(p,v,x){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<x;u++)this.render(p[u]/l,v[u]);else{m.multiDrawElementsWEBGL(s,v,0,o,p,0,x);let u=0;for(let _=0;_<x;_++)u+=v[_];t.update(u,s,1)}}this.setMode=a,this.setIndex=c,this.render=h,this.renderInstances=f,this.renderMultiDraw=d}function ZE(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(s/3);break;case n.LINES:t.lines+=o*(s/2);break;case n.LINE_STRIP:t.lines+=o*(s-1);break;case n.LINE_LOOP:t.lines+=o*s;break;case n.POINTS:t.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function QE(n,e){return n[0]-e[0]}function JE(n,e){return Math.abs(e[1])-Math.abs(n[1])}function ew(n,e,t){const i={},r=new Float32Array(8),s=new WeakMap,a=new ht,o=[];for(let c=0;c<8;c++)o[c]=[c,0];function l(c,h,f){const d=c.morphTargetInfluences;if(e.isWebGL2===!0){const v=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,x=v!==void 0?v.length:0;let m=s.get(h);if(m===void 0||m.count!==x){let k=function(){q.dispose(),s.delete(h),h.removeEventListener("dispose",k)};var p=k;m!==void 0&&m.texture.dispose();const g=h.morphAttributes.position!==void 0,y=h.morphAttributes.normal!==void 0,C=h.morphAttributes.color!==void 0,T=h.morphAttributes.position||[],A=h.morphAttributes.normal||[],I=h.morphAttributes.color||[];let S=0;g===!0&&(S=1),y===!0&&(S=2),C===!0&&(S=3);let E=h.attributes.position.count*S,F=1;E>e.maxTextureSize&&(F=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const z=new Float32Array(E*F*4*x),q=new Ng(z,E,F,x);q.type=Bi,q.needsUpdate=!0;const L=S*4;for(let j=0;j<x;j++){const K=T[j],D=A[j],O=I[j],B=E*F*4*j;for(let $=0;$<K.count;$++){const Q=$*L;g===!0&&(a.fromBufferAttribute(K,$),z[B+Q+0]=a.x,z[B+Q+1]=a.y,z[B+Q+2]=a.z,z[B+Q+3]=0),y===!0&&(a.fromBufferAttribute(D,$),z[B+Q+4]=a.x,z[B+Q+5]=a.y,z[B+Q+6]=a.z,z[B+Q+7]=0),C===!0&&(a.fromBufferAttribute(O,$),z[B+Q+8]=a.x,z[B+Q+9]=a.y,z[B+Q+10]=a.z,z[B+Q+11]=O.itemSize===4?a.w:1)}}m={count:x,texture:q,size:new Ce(E,F)},s.set(h,m),h.addEventListener("dispose",k)}let u=0;for(let g=0;g<d.length;g++)u+=d[g];const _=h.morphTargetsRelative?1:1-u;f.getUniforms().setValue(n,"morphTargetBaseInfluence",_),f.getUniforms().setValue(n,"morphTargetInfluences",d),f.getUniforms().setValue(n,"morphTargetsTexture",m.texture,t),f.getUniforms().setValue(n,"morphTargetsTextureSize",m.size)}else{const v=d===void 0?0:d.length;let x=i[h.id];if(x===void 0||x.length!==v){x=[];for(let y=0;y<v;y++)x[y]=[y,0];i[h.id]=x}for(let y=0;y<v;y++){const C=x[y];C[0]=y,C[1]=d[y]}x.sort(JE);for(let y=0;y<8;y++)y<v&&x[y][1]?(o[y][0]=x[y][0],o[y][1]=x[y][1]):(o[y][0]=Number.MAX_SAFE_INTEGER,o[y][1]=0);o.sort(QE);const m=h.morphAttributes.position,u=h.morphAttributes.normal;let _=0;for(let y=0;y<8;y++){const C=o[y],T=C[0],A=C[1];T!==Number.MAX_SAFE_INTEGER&&A?(m&&h.getAttribute("morphTarget"+y)!==m[T]&&h.setAttribute("morphTarget"+y,m[T]),u&&h.getAttribute("morphNormal"+y)!==u[T]&&h.setAttribute("morphNormal"+y,u[T]),r[y]=A,_+=A):(m&&h.hasAttribute("morphTarget"+y)===!0&&h.deleteAttribute("morphTarget"+y),u&&h.hasAttribute("morphNormal"+y)===!0&&h.deleteAttribute("morphNormal"+y),r[y]=0)}const g=h.morphTargetsRelative?1:1-_;f.getUniforms().setValue(n,"morphTargetBaseInfluence",g),f.getUniforms().setValue(n,"morphTargetInfluences",r)}}return{update:l}}function tw(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,f=e.get(l,h);if(r.get(f)!==c&&(e.update(f),r.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return f}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:a}}class Hg extends mn{constructor(e,t,i,r,s,a,o,l,c,h){if(h=h!==void 0?h:Tr,h!==Tr&&h!==ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Tr&&(i=Fi),i===void 0&&h===ks&&(i=wr),super(null,r,s,a,o,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=o!==void 0?o:en,this.minFilter=l!==void 0?l:en,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Vg=new mn,Wg=new Hg(1,1);Wg.compareFunction=bg;const jg=new Ng,Xg=new By,Yg=new Bg,Lp=[],Np=[],Dp=new Float32Array(16),Ip=new Float32Array(9),Up=new Float32Array(4);function Vs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=Lp[r];if(s===void 0&&(s=new Float32Array(r),Lp[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(s,o)}return s}function Ct(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Pt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function $l(n,e){let t=Np[e];t===void 0&&(t=new Int32Array(e),Np[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function nw(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function iw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;n.uniform2fv(this.addr,e),Pt(t,e)}}function rw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Ct(t,e))return;n.uniform3fv(this.addr,e),Pt(t,e)}}function sw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;n.uniform4fv(this.addr,e),Pt(t,e)}}function aw(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ct(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,i))return;Up.set(i),n.uniformMatrix2fv(this.addr,!1,Up),Pt(t,i)}}function ow(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ct(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,i))return;Ip.set(i),n.uniformMatrix3fv(this.addr,!1,Ip),Pt(t,i)}}function lw(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Ct(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Pt(t,e)}else{if(Ct(t,i))return;Dp.set(i),n.uniformMatrix4fv(this.addr,!1,Dp),Pt(t,i)}}function cw(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function uw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;n.uniform2iv(this.addr,e),Pt(t,e)}}function hw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;n.uniform3iv(this.addr,e),Pt(t,e)}}function dw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;n.uniform4iv(this.addr,e),Pt(t,e)}}function fw(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function pw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Ct(t,e))return;n.uniform2uiv(this.addr,e),Pt(t,e)}}function mw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Ct(t,e))return;n.uniform3uiv(this.addr,e),Pt(t,e)}}function gw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Ct(t,e))return;n.uniform4uiv(this.addr,e),Pt(t,e)}}function _w(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);const s=this.type===n.SAMPLER_2D_SHADOW?Wg:Vg;t.setTexture2D(e||s,r)}function vw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Xg,r)}function xw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||Yg,r)}function yw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||jg,r)}function Sw(n){switch(n){case 5126:return nw;case 35664:return iw;case 35665:return rw;case 35666:return sw;case 35674:return aw;case 35675:return ow;case 35676:return lw;case 5124:case 35670:return cw;case 35667:case 35671:return uw;case 35668:case 35672:return hw;case 35669:case 35673:return dw;case 5125:return fw;case 36294:return pw;case 36295:return mw;case 36296:return gw;case 35678:case 36198:case 36298:case 36306:case 35682:return _w;case 35679:case 36299:case 36307:return vw;case 35680:case 36300:case 36308:case 36293:return xw;case 36289:case 36303:case 36311:case 36292:return yw}}function Mw(n,e){n.uniform1fv(this.addr,e)}function Ew(n,e){const t=Vs(e,this.size,2);n.uniform2fv(this.addr,t)}function ww(n,e){const t=Vs(e,this.size,3);n.uniform3fv(this.addr,t)}function Tw(n,e){const t=Vs(e,this.size,4);n.uniform4fv(this.addr,t)}function Aw(n,e){const t=Vs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Rw(n,e){const t=Vs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function bw(n,e){const t=Vs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Cw(n,e){n.uniform1iv(this.addr,e)}function Pw(n,e){n.uniform2iv(this.addr,e)}function Lw(n,e){n.uniform3iv(this.addr,e)}function Nw(n,e){n.uniform4iv(this.addr,e)}function Dw(n,e){n.uniform1uiv(this.addr,e)}function Iw(n,e){n.uniform2uiv(this.addr,e)}function Uw(n,e){n.uniform3uiv(this.addr,e)}function Ow(n,e){n.uniform4uiv(this.addr,e)}function kw(n,e,t){const i=this.cache,r=e.length,s=$l(t,r);Ct(i,s)||(n.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)t.setTexture2D(e[a]||Vg,s[a])}function Fw(n,e,t){const i=this.cache,r=e.length,s=$l(t,r);Ct(i,s)||(n.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)t.setTexture3D(e[a]||Xg,s[a])}function Bw(n,e,t){const i=this.cache,r=e.length,s=$l(t,r);Ct(i,s)||(n.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)t.setTextureCube(e[a]||Yg,s[a])}function zw(n,e,t){const i=this.cache,r=e.length,s=$l(t,r);Ct(i,s)||(n.uniform1iv(this.addr,s),Pt(i,s));for(let a=0;a!==r;++a)t.setTexture2DArray(e[a]||jg,s[a])}function Gw(n){switch(n){case 5126:return Mw;case 35664:return Ew;case 35665:return ww;case 35666:return Tw;case 35674:return Aw;case 35675:return Rw;case 35676:return bw;case 5124:case 35670:return Cw;case 35667:case 35671:return Pw;case 35668:case 35672:return Lw;case 35669:case 35673:return Nw;case 5125:return Dw;case 36294:return Iw;case 36295:return Uw;case 36296:return Ow;case 35678:case 36198:case 36298:case 36306:case 35682:return kw;case 35679:case 36299:case 36307:return Fw;case 35680:case 36300:case 36308:case 36293:return Bw;case 36289:case 36303:case 36311:case 36292:return zw}}class Hw{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Sw(t.type)}}class Vw{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Gw(t.type)}}class Ww{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,t[o.id],i)}}}const tu=/(\w+)(\])?(\[|\.)?/g;function Op(n,e){n.seq.push(e),n.map[e.id]=e}function jw(n,e,t){const i=n.name,r=i.length;for(tu.lastIndex=0;;){const s=tu.exec(i),a=tu.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Op(t,c===void 0?new Hw(o,n,e):new Vw(o,n,e));break}else{let f=t.map[o];f===void 0&&(f=new Ww(o),Op(t,f)),t=f}}}class Zo{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),a=e.getUniformLocation(t,s.name);jw(s,a,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,a=t.length;s!==a;++s){const o=t[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in t&&i.push(a)}return i}}function kp(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Xw=37297;let Yw=0;function qw(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}function $w(n){const e=et.getPrimaries(et.workingColorSpace),t=et.getPrimaries(n);let i;switch(e===t?i="":e===Tl&&t===wl?i="LinearDisplayP3ToLinearSRGB":e===wl&&t===Tl&&(i="LinearSRGBToLinearDisplayP3"),n){case wi:case Xl:return[i,"LinearTransferOETF"];case kt:case od:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Fp(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+qw(n.getShaderSource(e),a)}else return r}function Kw(n,e){const t=$w(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Zw(n,e){let t;switch(e){case cy:t="Linear";break;case uy:t="Reinhard";break;case hy:t="OptimizedCineon";break;case _g:t="ACESFilmic";break;case fy:t="AgX";break;case dy:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Qw(n){return[n.extensionDerivatives||n.envMapCubeUVHeight||n.bumpMap||n.normalMapTangentSpace||n.clearcoatNormalMap||n.flatShading||n.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(n.extensionFragDepth||n.logarithmicDepthBuffer)&&n.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",n.extensionDrawBuffers&&n.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(n.extensionShaderTextureLOD||n.envMap||n.transmission)&&n.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xs).join(`
`)}function Jw(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(xs).join(`
`)}function eT(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function tT(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),t[a]={type:s.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function xs(n){return n!==""}function Bp(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function zp(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const nT=/^[ \t]*#include +<([\w\d./]+)>/gm;function uh(n){return n.replace(nT,rT)}const iT=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function rT(n,e){let t=Fe[e];if(t===void 0){const i=iT.get(e);if(i!==void 0)t=Fe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return uh(t)}const sT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Gp(n){return n.replace(sT,aT)}function aT(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Hp(n){let e="precision "+n.precision+` float;
precision `+n.precision+" int;";return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function oT(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===pg?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===mg?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===hi&&(e="SHADOWMAP_TYPE_VSM"),e}function lT(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Us:case Os:e="ENVMAP_TYPE_CUBE";break;case jl:e="ENVMAP_TYPE_CUBE_UV";break}return e}function cT(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Os:e="ENVMAP_MODE_REFRACTION";break}return e}function uT(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case gg:e="ENVMAP_BLENDING_MULTIPLY";break;case oy:e="ENVMAP_BLENDING_MIX";break;case ly:e="ENVMAP_BLENDING_ADD";break}return e}function hT(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function dT(n,e,t,i){const r=n.getContext(),s=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=oT(t),c=lT(t),h=cT(t),f=uT(t),d=hT(t),p=t.isWebGL2?"":Qw(t),v=Jw(t),x=eT(s),m=r.createProgram();let u,_,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(xs).join(`
`),u.length>0&&(u+=`
`),_=[p,"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(xs).join(`
`),_.length>0&&(_+=`
`)):(u=[Hp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors&&t.isWebGL2?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0&&t.isWebGL2?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xs).join(`
`),_=[p,Hp(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.useLegacyLights?"#define LEGACY_LIGHTS":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.logarithmicDepthBuffer&&t.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$i?"#define TONE_MAPPING":"",t.toneMapping!==$i?Fe.tonemapping_pars_fragment:"",t.toneMapping!==$i?Zw("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Fe.colorspace_pars_fragment,Kw("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(xs).join(`
`)),a=uh(a),a=Bp(a,t),a=zp(a,t),o=uh(o),o=Bp(o,t),o=zp(o,t),a=Gp(a),o=Gp(o),t.isWebGL2&&t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,u=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+u,_=["precision mediump sampler2DArray;","#define varying in",t.glslVersion===ap?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ap?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const y=g+u+a,C=g+_+o,T=kp(r,r.VERTEX_SHADER,y),A=kp(r,r.FRAGMENT_SHADER,C);r.attachShader(m,T),r.attachShader(m,A),t.index0AttributeName!==void 0?r.bindAttribLocation(m,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(m,0,"position"),r.linkProgram(m);function I(z){if(n.debug.checkShaderErrors){const q=r.getProgramInfoLog(m).trim(),L=r.getShaderInfoLog(T).trim(),k=r.getShaderInfoLog(A).trim();let j=!0,K=!0;if(r.getProgramParameter(m,r.LINK_STATUS)===!1)if(j=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,m,T,A);else{const D=Fp(r,T,"vertex"),O=Fp(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(m,r.VALIDATE_STATUS)+`

Program Info Log: `+q+`
`+D+`
`+O)}else q!==""?console.warn("THREE.WebGLProgram: Program Info Log:",q):(L===""||k==="")&&(K=!1);K&&(z.diagnostics={runnable:j,programLog:q,vertexShader:{log:L,prefix:u},fragmentShader:{log:k,prefix:_}})}r.deleteShader(T),r.deleteShader(A),S=new Zo(r,m),E=tT(r,m)}let S;this.getUniforms=function(){return S===void 0&&I(this),S};let E;this.getAttributes=function(){return E===void 0&&I(this),E};let F=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return F===!1&&(F=r.getProgramParameter(m,Xw)),F},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(m),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Yw++,this.cacheKey=e,this.usedTimes=1,this.program=m,this.vertexShader=T,this.fragmentShader=A,this}let fT=0;class pT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new mT(e),t.set(e,i)),i}}class mT{constructor(e){this.id=fT++,this.code=e,this.usedTimes=0}}function gT(n,e,t,i,r,s,a){const o=new Dg,l=new pT,c=[],h=r.isWebGL2,f=r.logarithmicDepthBuffer,d=r.vertexTextures;let p=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return S===0?"uv":`uv${S}`}function m(S,E,F,z,q){const L=z.fog,k=q.geometry,j=S.isMeshStandardMaterial?z.environment:null,K=(S.isMeshStandardMaterial?t:e).get(S.envMap||j),D=K&&K.mapping===jl?K.image.height:null,O=v[S.type];S.precision!==null&&(p=r.getMaxPrecision(S.precision),p!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",p,"instead."));const B=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,$=B!==void 0?B.length:0;let Q=0;k.morphAttributes.position!==void 0&&(Q=1),k.morphAttributes.normal!==void 0&&(Q=2),k.morphAttributes.color!==void 0&&(Q=3);let X,J,ce,me;if(O){const qt=ti[O];X=qt.vertexShader,J=qt.fragmentShader}else X=S.vertexShader,J=S.fragmentShader,l.update(S),ce=l.getVertexShaderID(S),me=l.getFragmentShaderID(S);const ge=n.getRenderTarget(),Pe=q.isInstancedMesh===!0,Oe=q.isBatchedMesh===!0,Re=!!S.map,$e=!!S.matcap,G=!!K,Yt=!!S.aoMap,Ee=!!S.lightMap,De=!!S.bumpMap,xe=!!S.normalMap,dt=!!S.displacementMap,Be=!!S.emissiveMap,R=!!S.metalnessMap,M=!!S.roughnessMap,V=S.anisotropy>0,re=S.clearcoat>0,ne=S.iridescence>0,se=S.sheen>0,ye=S.transmission>0,de=V&&!!S.anisotropyMap,_e=re&&!!S.clearcoatMap,Ae=re&&!!S.clearcoatNormalMap,ze=re&&!!S.clearcoatRoughnessMap,te=ne&&!!S.iridescenceMap,Je=ne&&!!S.iridescenceThicknessMap,Xe=se&&!!S.sheenColorMap,Ne=se&&!!S.sheenRoughnessMap,Me=!!S.specularMap,ve=!!S.specularColorMap,ke=!!S.specularIntensityMap,Ze=ye&&!!S.transmissionMap,vt=ye&&!!S.thicknessMap,Ve=!!S.gradientMap,oe=!!S.alphaMap,N=S.alphaTest>0,ue=!!S.alphaHash,he=!!S.extensions,be=!!k.attributes.uv1,we=!!k.attributes.uv2,nt=!!k.attributes.uv3;let it=$i;return S.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(it=n.toneMapping),{isWebGL2:h,shaderID:O,shaderType:S.type,shaderName:S.name,vertexShader:X,fragmentShader:J,defines:S.defines,customVertexShaderID:ce,customFragmentShaderID:me,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:p,batching:Oe,instancing:Pe,instancingColor:Pe&&q.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:ge===null?n.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:wi,map:Re,matcap:$e,envMap:G,envMapMode:G&&K.mapping,envMapCubeUVHeight:D,aoMap:Yt,lightMap:Ee,bumpMap:De,normalMap:xe,displacementMap:d&&dt,emissiveMap:Be,normalMapObjectSpace:xe&&S.normalMapType===Ty,normalMapTangentSpace:xe&&S.normalMapType===Rg,metalnessMap:R,roughnessMap:M,anisotropy:V,anisotropyMap:de,clearcoat:re,clearcoatMap:_e,clearcoatNormalMap:Ae,clearcoatRoughnessMap:ze,iridescence:ne,iridescenceMap:te,iridescenceThicknessMap:Je,sheen:se,sheenColorMap:Xe,sheenRoughnessMap:Ne,specularMap:Me,specularColorMap:ve,specularIntensityMap:ke,transmission:ye,transmissionMap:Ze,thicknessMap:vt,gradientMap:Ve,opaque:S.transparent===!1&&S.blending===As,alphaMap:oe,alphaTest:N,alphaHash:ue,combine:S.combine,mapUv:Re&&x(S.map.channel),aoMapUv:Yt&&x(S.aoMap.channel),lightMapUv:Ee&&x(S.lightMap.channel),bumpMapUv:De&&x(S.bumpMap.channel),normalMapUv:xe&&x(S.normalMap.channel),displacementMapUv:dt&&x(S.displacementMap.channel),emissiveMapUv:Be&&x(S.emissiveMap.channel),metalnessMapUv:R&&x(S.metalnessMap.channel),roughnessMapUv:M&&x(S.roughnessMap.channel),anisotropyMapUv:de&&x(S.anisotropyMap.channel),clearcoatMapUv:_e&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:Ae&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ze&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:te&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:Je&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:Xe&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&x(S.sheenRoughnessMap.channel),specularMapUv:Me&&x(S.specularMap.channel),specularColorMapUv:ve&&x(S.specularColorMap.channel),specularIntensityMapUv:ke&&x(S.specularIntensityMap.channel),transmissionMapUv:Ze&&x(S.transmissionMap.channel),thicknessMapUv:vt&&x(S.thicknessMap.channel),alphaMapUv:oe&&x(S.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(xe||V),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,vertexUv1s:be,vertexUv2s:we,vertexUv3s:nt,pointsUvs:q.isPoints===!0&&!!k.attributes.uv&&(Re||oe),fog:!!L,useFog:S.fog===!0,fogExp2:L&&L.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:q.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:$,morphTextureStride:Q,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&F.length>0,shadowMapType:n.shadowMap.type,toneMapping:it,useLegacyLights:n._useLegacyLights,decodeVideoTexture:Re&&S.map.isVideoTexture===!0&&et.getTransfer(S.map.colorSpace)===ot,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===pi,flipSided:S.side===pn,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionDerivatives:he&&S.extensions.derivatives===!0,extensionFragDepth:he&&S.extensions.fragDepth===!0,extensionDrawBuffers:he&&S.extensions.drawBuffers===!0,extensionShaderTextureLOD:he&&S.extensions.shaderTextureLOD===!0,extensionClipCullDistance:he&&S.extensions.clipCullDistance&&i.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||i.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||i.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||i.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()}}function u(S){const E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(const F in S.defines)E.push(F),E.push(S.defines[F]);return S.isRawShaderMaterial===!1&&(_(E,S),g(E,S),E.push(n.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function _(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function g(S,E){o.disableAll(),E.isWebGL2&&o.enable(0),E.supportsVertexTextures&&o.enable(1),E.instancing&&o.enable(2),E.instancingColor&&o.enable(3),E.matcap&&o.enable(4),E.envMap&&o.enable(5),E.normalMapObjectSpace&&o.enable(6),E.normalMapTangentSpace&&o.enable(7),E.clearcoat&&o.enable(8),E.iridescence&&o.enable(9),E.alphaTest&&o.enable(10),E.vertexColors&&o.enable(11),E.vertexAlphas&&o.enable(12),E.vertexUv1s&&o.enable(13),E.vertexUv2s&&o.enable(14),E.vertexUv3s&&o.enable(15),E.vertexTangents&&o.enable(16),E.anisotropy&&o.enable(17),E.alphaHash&&o.enable(18),E.batching&&o.enable(19),S.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.skinning&&o.enable(4),E.morphTargets&&o.enable(5),E.morphNormals&&o.enable(6),E.morphColors&&o.enable(7),E.premultipliedAlpha&&o.enable(8),E.shadowMapEnabled&&o.enable(9),E.useLegacyLights&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),S.push(o.mask)}function y(S){const E=v[S.type];let F;if(E){const z=ti[E];F=Qy.clone(z.uniforms)}else F=S.uniforms;return F}function C(S,E){let F;for(let z=0,q=c.length;z<q;z++){const L=c[z];if(L.cacheKey===E){F=L,++F.usedTimes;break}}return F===void 0&&(F=new dT(n,E,S,s),c.push(F)),F}function T(S){if(--S.usedTimes===0){const E=c.indexOf(S);c[E]=c[c.length-1],c.pop(),S.destroy()}}function A(S){l.remove(S)}function I(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:y,acquireProgram:C,releaseProgram:T,releaseShaderCache:A,programs:c,dispose:I}}function _T(){let n=new WeakMap;function e(s){let a=n.get(s);return a===void 0&&(a={},n.set(s,a)),a}function t(s){n.delete(s)}function i(s,a,o){n.get(s)[a]=o}function r(){n=new WeakMap}return{get:e,remove:t,update:i,dispose:r}}function vT(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Vp(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Wp(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function a(f,d,p,v,x,m){let u=n[e];return u===void 0?(u={id:f.id,object:f,geometry:d,material:p,groupOrder:v,renderOrder:f.renderOrder,z:x,group:m},n[e]=u):(u.id=f.id,u.object=f,u.geometry=d,u.material=p,u.groupOrder=v,u.renderOrder=f.renderOrder,u.z=x,u.group=m),e++,u}function o(f,d,p,v,x,m){const u=a(f,d,p,v,x,m);p.transmission>0?i.push(u):p.transparent===!0?r.push(u):t.push(u)}function l(f,d,p,v,x,m){const u=a(f,d,p,v,x,m);p.transmission>0?i.unshift(u):p.transparent===!0?r.unshift(u):t.unshift(u)}function c(f,d){t.length>1&&t.sort(f||vT),i.length>1&&i.sort(d||Vp),r.length>1&&r.sort(d||Vp)}function h(){for(let f=e,d=n.length;f<d;f++){const p=n[f];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:h,sort:c}}function xT(){let n=new WeakMap;function e(i,r){const s=n.get(i);let a;return s===void 0?(a=new Wp,n.set(i,[a])):r>=s.length?(a=new Wp,s.push(a)):a=s[r],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function yT(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new qe};break;case"SpotLight":t={position:new P,direction:new P,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new P,halfWidth:new P,halfHeight:new P};break}return n[e.id]=t,t}}}function ST(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ce,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let MT=0;function ET(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function wT(n,e){const t=new yT,i=ST(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)r.probe.push(new P);const s=new P,a=new St,o=new St;function l(h,f){let d=0,p=0,v=0;for(let z=0;z<9;z++)r.probe[z].set(0,0,0);let x=0,m=0,u=0,_=0,g=0,y=0,C=0,T=0,A=0,I=0,S=0;h.sort(ET);const E=f===!0?Math.PI:1;for(let z=0,q=h.length;z<q;z++){const L=h[z],k=L.color,j=L.intensity,K=L.distance,D=L.shadow&&L.shadow.map?L.shadow.map.texture:null;if(L.isAmbientLight)d+=k.r*j*E,p+=k.g*j*E,v+=k.b*j*E;else if(L.isLightProbe){for(let O=0;O<9;O++)r.probe[O].addScaledVector(L.sh.coefficients[O],j);S++}else if(L.isDirectionalLight){const O=t.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity*E),L.castShadow){const B=L.shadow,$=i.get(L);$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,r.directionalShadow[x]=$,r.directionalShadowMap[x]=D,r.directionalShadowMatrix[x]=L.shadow.matrix,y++}r.directional[x]=O,x++}else if(L.isSpotLight){const O=t.get(L);O.position.setFromMatrixPosition(L.matrixWorld),O.color.copy(k).multiplyScalar(j*E),O.distance=K,O.coneCos=Math.cos(L.angle),O.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),O.decay=L.decay,r.spot[u]=O;const B=L.shadow;if(L.map&&(r.spotLightMap[A]=L.map,A++,B.updateMatrices(L),L.castShadow&&I++),r.spotLightMatrix[u]=B.matrix,L.castShadow){const $=i.get(L);$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,r.spotShadow[u]=$,r.spotShadowMap[u]=D,T++}u++}else if(L.isRectAreaLight){const O=t.get(L);O.color.copy(k).multiplyScalar(j),O.halfWidth.set(L.width*.5,0,0),O.halfHeight.set(0,L.height*.5,0),r.rectArea[_]=O,_++}else if(L.isPointLight){const O=t.get(L);if(O.color.copy(L.color).multiplyScalar(L.intensity*E),O.distance=L.distance,O.decay=L.decay,L.castShadow){const B=L.shadow,$=i.get(L);$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,$.shadowCameraNear=B.camera.near,$.shadowCameraFar=B.camera.far,r.pointShadow[m]=$,r.pointShadowMap[m]=D,r.pointShadowMatrix[m]=L.shadow.matrix,C++}r.point[m]=O,m++}else if(L.isHemisphereLight){const O=t.get(L);O.skyColor.copy(L.color).multiplyScalar(j*E),O.groundColor.copy(L.groundColor).multiplyScalar(j*E),r.hemi[g]=O,g++}}_>0&&(e.isWebGL2?n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=le.LTC_FLOAT_1,r.rectAreaLTC2=le.LTC_FLOAT_2):(r.rectAreaLTC1=le.LTC_HALF_1,r.rectAreaLTC2=le.LTC_HALF_2):n.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=le.LTC_FLOAT_1,r.rectAreaLTC2=le.LTC_FLOAT_2):n.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=le.LTC_HALF_1,r.rectAreaLTC2=le.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=d,r.ambient[1]=p,r.ambient[2]=v;const F=r.hash;(F.directionalLength!==x||F.pointLength!==m||F.spotLength!==u||F.rectAreaLength!==_||F.hemiLength!==g||F.numDirectionalShadows!==y||F.numPointShadows!==C||F.numSpotShadows!==T||F.numSpotMaps!==A||F.numLightProbes!==S)&&(r.directional.length=x,r.spot.length=u,r.rectArea.length=_,r.point.length=m,r.hemi.length=g,r.directionalShadow.length=y,r.directionalShadowMap.length=y,r.pointShadow.length=C,r.pointShadowMap.length=C,r.spotShadow.length=T,r.spotShadowMap.length=T,r.directionalShadowMatrix.length=y,r.pointShadowMatrix.length=C,r.spotLightMatrix.length=T+A-I,r.spotLightMap.length=A,r.numSpotLightShadowsWithMaps=I,r.numLightProbes=S,F.directionalLength=x,F.pointLength=m,F.spotLength=u,F.rectAreaLength=_,F.hemiLength=g,F.numDirectionalShadows=y,F.numPointShadows=C,F.numSpotShadows=T,F.numSpotMaps=A,F.numLightProbes=S,r.version=MT++)}function c(h,f){let d=0,p=0,v=0,x=0,m=0;const u=f.matrixWorldInverse;for(let _=0,g=h.length;_<g;_++){const y=h[_];if(y.isDirectionalLight){const C=r.directional[d];C.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),C.direction.sub(s),C.direction.transformDirection(u),d++}else if(y.isSpotLight){const C=r.spot[v];C.position.setFromMatrixPosition(y.matrixWorld),C.position.applyMatrix4(u),C.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),C.direction.sub(s),C.direction.transformDirection(u),v++}else if(y.isRectAreaLight){const C=r.rectArea[x];C.position.setFromMatrixPosition(y.matrixWorld),C.position.applyMatrix4(u),o.identity(),a.copy(y.matrixWorld),a.premultiply(u),o.extractRotation(a),C.halfWidth.set(y.width*.5,0,0),C.halfHeight.set(0,y.height*.5,0),C.halfWidth.applyMatrix4(o),C.halfHeight.applyMatrix4(o),x++}else if(y.isPointLight){const C=r.point[p];C.position.setFromMatrixPosition(y.matrixWorld),C.position.applyMatrix4(u),p++}else if(y.isHemisphereLight){const C=r.hemi[m];C.direction.setFromMatrixPosition(y.matrixWorld),C.direction.transformDirection(u),m++}}}return{setup:l,setupView:c,state:r}}function jp(n,e){const t=new wT(n,e),i=[],r=[];function s(){i.length=0,r.length=0}function a(f){i.push(f)}function o(f){r.push(f)}function l(f){t.setup(i,f)}function c(f){t.setupView(i,f)}return{init:s,state:{lightsArray:i,shadowsArray:r,lights:t},setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function TT(n,e){let t=new WeakMap;function i(s,a=0){const o=t.get(s);let l;return o===void 0?(l=new jp(n,e),t.set(s,[l])):a>=o.length?(l=new jp(n,e),o.push(l)):l=o[a],l}function r(){t=new WeakMap}return{get:i,dispose:r}}class AT extends Fr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ey,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class RT extends Fr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const bT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,CT=`uniform sampler2D shadow_pass;
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
}`;function PT(n,e,t){let i=new ld;const r=new Ce,s=new Ce,a=new ht,o=new AT({depthPacking:wy}),l=new RT,c={},h=t.maxTextureSize,f={[er]:pn,[pn]:er,[pi]:pi},d=new Ir({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ce},radius:{value:4}},vertexShader:bT,fragmentShader:CT}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const v=new Zn;v.setAttribute("position",new qn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ee(v,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pg;let u=this.type;this.render=function(T,A,I){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const S=n.getRenderTarget(),E=n.getActiveCubeFace(),F=n.getActiveMipmapLevel(),z=n.state;z.setBlending(qi),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const q=u!==hi&&this.type===hi,L=u===hi&&this.type!==hi;for(let k=0,j=T.length;k<j;k++){const K=T[k],D=K.shadow;if(D===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;r.copy(D.mapSize);const O=D.getFrameExtents();if(r.multiply(O),s.copy(D.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/O.x),r.x=s.x*O.x,D.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/O.y),r.y=s.y*O.y,D.mapSize.y=s.y)),D.map===null||q===!0||L===!0){const $=this.type!==hi?{minFilter:en,magFilter:en}:{};D.map!==null&&D.map.dispose(),D.map=new Nr(r.x,r.y,$),D.map.texture.name=K.name+".shadowMap",D.camera.updateProjectionMatrix()}n.setRenderTarget(D.map),n.clear();const B=D.getViewportCount();for(let $=0;$<B;$++){const Q=D.getViewport($);a.set(s.x*Q.x,s.y*Q.y,s.x*Q.z,s.y*Q.w),z.viewport(a),D.updateMatrices(K,$),i=D.getFrustum(),y(A,I,D.camera,K,this.type)}D.isPointLightShadow!==!0&&this.type===hi&&_(D,I),D.needsUpdate=!1}u=this.type,m.needsUpdate=!1,n.setRenderTarget(S,E,F)};function _(T,A){const I=e.update(x);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Nr(r.x,r.y)),d.uniforms.shadow_pass.value=T.map.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,I,d,x,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,I,p,x,null)}function g(T,A,I,S){let E=null;const F=I.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(F!==void 0)E=F;else if(E=I.isPointLight===!0?l:o,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=E.uuid,q=A.uuid;let L=c[z];L===void 0&&(L={},c[z]=L);let k=L[q];k===void 0&&(k=E.clone(),L[q]=k,A.addEventListener("dispose",C)),E=k}if(E.visible=A.visible,E.wireframe=A.wireframe,S===hi?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:f[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,I.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const z=n.properties.get(E);z.light=I}return E}function y(T,A,I,S,E){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&E===hi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,T.matrixWorld);const q=e.update(T),L=T.material;if(Array.isArray(L)){const k=q.groups;for(let j=0,K=k.length;j<K;j++){const D=k[j],O=L[D.materialIndex];if(O&&O.visible){const B=g(T,O,S,E);T.onBeforeShadow(n,T,A,I,q,B,D),n.renderBufferDirect(I,null,q,B,T,D),T.onAfterShadow(n,T,A,I,q,B,D)}}}else if(L.visible){const k=g(T,L,S,E);T.onBeforeShadow(n,T,A,I,q,k,null),n.renderBufferDirect(I,null,q,k,T,null),T.onAfterShadow(n,T,A,I,q,k,null)}}const z=T.children;for(let q=0,L=z.length;q<L;q++)y(z[q],A,I,S,E)}function C(T){T.target.removeEventListener("dispose",C);for(const I in c){const S=c[I],E=T.target.uuid;E in S&&(S[E].dispose(),delete S[E])}}}function LT(n,e,t){const i=t.isWebGL2;function r(){let N=!1;const ue=new ht;let he=null;const be=new ht(0,0,0,0);return{setMask:function(we){he!==we&&!N&&(n.colorMask(we,we,we,we),he=we)},setLocked:function(we){N=we},setClear:function(we,nt,it,Lt,qt){qt===!0&&(we*=Lt,nt*=Lt,it*=Lt),ue.set(we,nt,it,Lt),be.equals(ue)===!1&&(n.clearColor(we,nt,it,Lt),be.copy(ue))},reset:function(){N=!1,he=null,be.set(-1,0,0,0)}}}function s(){let N=!1,ue=null,he=null,be=null;return{setTest:function(we){we?Oe(n.DEPTH_TEST):Re(n.DEPTH_TEST)},setMask:function(we){ue!==we&&!N&&(n.depthMask(we),ue=we)},setFunc:function(we){if(he!==we){switch(we){case ey:n.depthFunc(n.NEVER);break;case ty:n.depthFunc(n.ALWAYS);break;case ny:n.depthFunc(n.LESS);break;case Ml:n.depthFunc(n.LEQUAL);break;case iy:n.depthFunc(n.EQUAL);break;case ry:n.depthFunc(n.GEQUAL);break;case sy:n.depthFunc(n.GREATER);break;case ay:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}he=we}},setLocked:function(we){N=we},setClear:function(we){be!==we&&(n.clearDepth(we),be=we)},reset:function(){N=!1,ue=null,he=null,be=null}}}function a(){let N=!1,ue=null,he=null,be=null,we=null,nt=null,it=null,Lt=null,qt=null;return{setTest:function(rt){N||(rt?Oe(n.STENCIL_TEST):Re(n.STENCIL_TEST))},setMask:function(rt){ue!==rt&&!N&&(n.stencilMask(rt),ue=rt)},setFunc:function(rt,$t,Qn){(he!==rt||be!==$t||we!==Qn)&&(n.stencilFunc(rt,$t,Qn),he=rt,be=$t,we=Qn)},setOp:function(rt,$t,Qn){(nt!==rt||it!==$t||Lt!==Qn)&&(n.stencilOp(rt,$t,Qn),nt=rt,it=$t,Lt=Qn)},setLocked:function(rt){N=rt},setClear:function(rt){qt!==rt&&(n.clearStencil(rt),qt=rt)},reset:function(){N=!1,ue=null,he=null,be=null,we=null,nt=null,it=null,Lt=null,qt=null}}}const o=new r,l=new s,c=new a,h=new WeakMap,f=new WeakMap;let d={},p={},v=new WeakMap,x=[],m=null,u=!1,_=null,g=null,y=null,C=null,T=null,A=null,I=null,S=new qe(0,0,0),E=0,F=!1,z=null,q=null,L=null,k=null,j=null;const K=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let D=!1,O=0;const B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(B)[1]),D=O>=1):B.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),D=O>=2);let $=null,Q={};const X=n.getParameter(n.SCISSOR_BOX),J=n.getParameter(n.VIEWPORT),ce=new ht().fromArray(X),me=new ht().fromArray(J);function ge(N,ue,he,be){const we=new Uint8Array(4),nt=n.createTexture();n.bindTexture(N,nt),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let it=0;it<he;it++)i&&(N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY)?n.texImage3D(ue,0,n.RGBA,1,1,be,0,n.RGBA,n.UNSIGNED_BYTE,we):n.texImage2D(ue+it,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,we);return nt}const Pe={};Pe[n.TEXTURE_2D]=ge(n.TEXTURE_2D,n.TEXTURE_2D,1),Pe[n.TEXTURE_CUBE_MAP]=ge(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),i&&(Pe[n.TEXTURE_2D_ARRAY]=ge(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Pe[n.TEXTURE_3D]=ge(n.TEXTURE_3D,n.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),c.setClear(0),Oe(n.DEPTH_TEST),l.setFunc(Ml),Be(!1),R(bf),Oe(n.CULL_FACE),xe(qi);function Oe(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function Re(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function $e(N,ue){return p[N]!==ue?(n.bindFramebuffer(N,ue),p[N]=ue,i&&(N===n.DRAW_FRAMEBUFFER&&(p[n.FRAMEBUFFER]=ue),N===n.FRAMEBUFFER&&(p[n.DRAW_FRAMEBUFFER]=ue)),!0):!1}function G(N,ue){let he=x,be=!1;if(N)if(he=v.get(ue),he===void 0&&(he=[],v.set(ue,he)),N.isWebGLMultipleRenderTargets){const we=N.texture;if(he.length!==we.length||he[0]!==n.COLOR_ATTACHMENT0){for(let nt=0,it=we.length;nt<it;nt++)he[nt]=n.COLOR_ATTACHMENT0+nt;he.length=we.length,be=!0}}else he[0]!==n.COLOR_ATTACHMENT0&&(he[0]=n.COLOR_ATTACHMENT0,be=!0);else he[0]!==n.BACK&&(he[0]=n.BACK,be=!0);be&&(t.isWebGL2?n.drawBuffers(he):e.get("WEBGL_draw_buffers").drawBuffersWEBGL(he))}function Yt(N){return m!==N?(n.useProgram(N),m=N,!0):!1}const Ee={[mr]:n.FUNC_ADD,[Bx]:n.FUNC_SUBTRACT,[zx]:n.FUNC_REVERSE_SUBTRACT};if(i)Ee[Lf]=n.MIN,Ee[Nf]=n.MAX;else{const N=e.get("EXT_blend_minmax");N!==null&&(Ee[Lf]=N.MIN_EXT,Ee[Nf]=N.MAX_EXT)}const De={[Gx]:n.ZERO,[Hx]:n.ONE,[Vx]:n.SRC_COLOR,[th]:n.SRC_ALPHA,[$x]:n.SRC_ALPHA_SATURATE,[Yx]:n.DST_COLOR,[jx]:n.DST_ALPHA,[Wx]:n.ONE_MINUS_SRC_COLOR,[nh]:n.ONE_MINUS_SRC_ALPHA,[qx]:n.ONE_MINUS_DST_COLOR,[Xx]:n.ONE_MINUS_DST_ALPHA,[Kx]:n.CONSTANT_COLOR,[Zx]:n.ONE_MINUS_CONSTANT_COLOR,[Qx]:n.CONSTANT_ALPHA,[Jx]:n.ONE_MINUS_CONSTANT_ALPHA};function xe(N,ue,he,be,we,nt,it,Lt,qt,rt){if(N===qi){u===!0&&(Re(n.BLEND),u=!1);return}if(u===!1&&(Oe(n.BLEND),u=!0),N!==Fx){if(N!==_||rt!==F){if((g!==mr||T!==mr)&&(n.blendEquation(n.FUNC_ADD),g=mr,T=mr),rt)switch(N){case As:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case eh:n.blendFunc(n.ONE,n.ONE);break;case Cf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Pf:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case As:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case eh:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Cf:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Pf:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}y=null,C=null,A=null,I=null,S.set(0,0,0),E=0,_=N,F=rt}return}we=we||ue,nt=nt||he,it=it||be,(ue!==g||we!==T)&&(n.blendEquationSeparate(Ee[ue],Ee[we]),g=ue,T=we),(he!==y||be!==C||nt!==A||it!==I)&&(n.blendFuncSeparate(De[he],De[be],De[nt],De[it]),y=he,C=be,A=nt,I=it),(Lt.equals(S)===!1||qt!==E)&&(n.blendColor(Lt.r,Lt.g,Lt.b,qt),S.copy(Lt),E=qt),_=N,F=!1}function dt(N,ue){N.side===pi?Re(n.CULL_FACE):Oe(n.CULL_FACE);let he=N.side===pn;ue&&(he=!he),Be(he),N.blending===As&&N.transparent===!1?xe(qi):xe(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),l.setFunc(N.depthFunc),l.setTest(N.depthTest),l.setMask(N.depthWrite),o.setMask(N.colorWrite);const be=N.stencilWrite;c.setTest(be),be&&(c.setMask(N.stencilWriteMask),c.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),c.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),V(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?Oe(n.SAMPLE_ALPHA_TO_COVERAGE):Re(n.SAMPLE_ALPHA_TO_COVERAGE)}function Be(N){z!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),z=N)}function R(N){N!==Ox?(Oe(n.CULL_FACE),N!==q&&(N===bf?n.cullFace(n.BACK):N===kx?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Re(n.CULL_FACE),q=N}function M(N){N!==L&&(D&&n.lineWidth(N),L=N)}function V(N,ue,he){N?(Oe(n.POLYGON_OFFSET_FILL),(k!==ue||j!==he)&&(n.polygonOffset(ue,he),k=ue,j=he)):Re(n.POLYGON_OFFSET_FILL)}function re(N){N?Oe(n.SCISSOR_TEST):Re(n.SCISSOR_TEST)}function ne(N){N===void 0&&(N=n.TEXTURE0+K-1),$!==N&&(n.activeTexture(N),$=N)}function se(N,ue,he){he===void 0&&($===null?he=n.TEXTURE0+K-1:he=$);let be=Q[he];be===void 0&&(be={type:void 0,texture:void 0},Q[he]=be),(be.type!==N||be.texture!==ue)&&($!==he&&(n.activeTexture(he),$=he),n.bindTexture(N,ue||Pe[N]),be.type=N,be.texture=ue)}function ye(){const N=Q[$];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function de(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _e(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ae(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ze(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function te(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Je(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Xe(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ne(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Me(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ke(N){ce.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),ce.copy(N))}function Ze(N){me.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),me.copy(N))}function vt(N,ue){let he=f.get(ue);he===void 0&&(he=new WeakMap,f.set(ue,he));let be=he.get(N);be===void 0&&(be=n.getUniformBlockIndex(ue,N.name),he.set(N,be))}function Ve(N,ue){const be=f.get(ue).get(N);h.get(ue)!==be&&(n.uniformBlockBinding(ue,be,N.__bindingPointIndex),h.set(ue,be))}function oe(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),i===!0&&(n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null)),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},$=null,Q={},p={},v=new WeakMap,x=[],m=null,u=!1,_=null,g=null,y=null,C=null,T=null,A=null,I=null,S=new qe(0,0,0),E=0,F=!1,z=null,q=null,L=null,k=null,j=null,ce.set(0,0,n.canvas.width,n.canvas.height),me.set(0,0,n.canvas.width,n.canvas.height),o.reset(),l.reset(),c.reset()}return{buffers:{color:o,depth:l,stencil:c},enable:Oe,disable:Re,bindFramebuffer:$e,drawBuffers:G,useProgram:Yt,setBlending:xe,setMaterial:dt,setFlipSided:Be,setCullFace:R,setLineWidth:M,setPolygonOffset:V,setScissorTest:re,activeTexture:ne,bindTexture:se,unbindTexture:ye,compressedTexImage2D:de,compressedTexImage3D:_e,texImage2D:Me,texImage3D:ve,updateUBOMapping:vt,uniformBlockBinding:Ve,texStorage2D:Xe,texStorage3D:Ne,texSubImage2D:Ae,texSubImage3D:ze,compressedTexSubImage2D:te,compressedTexSubImage3D:Je,scissor:ke,viewport:Ze,reset:oe}}function NT(n,e,t,i,r,s,a){const o=r.isWebGL2,l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let f;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(R,M){return p?new OffscreenCanvas(R,M):Rl("canvas")}function x(R,M,V,re){let ne=1;if((R.width>re||R.height>re)&&(ne=re/Math.max(R.width,R.height)),ne<1||M===!0)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap){const se=M?ch:Math.floor,ye=se(ne*R.width),de=se(ne*R.height);f===void 0&&(f=v(ye,de));const _e=V?v(ye,de):f;return _e.width=ye,_e.height=de,_e.getContext("2d").drawImage(R,0,0,ye,de),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+R.width+"x"+R.height+") to ("+ye+"x"+de+")."),_e}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+R.width+"x"+R.height+")."),R;return R}function m(R){return op(R.width)&&op(R.height)}function u(R){return o?!1:R.wrapS!==Wn||R.wrapT!==Wn||R.minFilter!==en&&R.minFilter!==Pn}function _(R,M){return R.generateMipmaps&&M&&R.minFilter!==en&&R.minFilter!==Pn}function g(R){n.generateMipmap(R)}function y(R,M,V,re,ne=!1){if(o===!1)return M;if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let se=M;if(M===n.RED&&(V===n.FLOAT&&(se=n.R32F),V===n.HALF_FLOAT&&(se=n.R16F),V===n.UNSIGNED_BYTE&&(se=n.R8)),M===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(se=n.R8UI),V===n.UNSIGNED_SHORT&&(se=n.R16UI),V===n.UNSIGNED_INT&&(se=n.R32UI),V===n.BYTE&&(se=n.R8I),V===n.SHORT&&(se=n.R16I),V===n.INT&&(se=n.R32I)),M===n.RG&&(V===n.FLOAT&&(se=n.RG32F),V===n.HALF_FLOAT&&(se=n.RG16F),V===n.UNSIGNED_BYTE&&(se=n.RG8)),M===n.RGBA){const ye=ne?El:et.getTransfer(re);V===n.FLOAT&&(se=n.RGBA32F),V===n.HALF_FLOAT&&(se=n.RGBA16F),V===n.UNSIGNED_BYTE&&(se=ye===ot?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(se=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(se=n.RGB5_A1)}return(se===n.R16F||se===n.R32F||se===n.RG16F||se===n.RG32F||se===n.RGBA16F||se===n.RGBA32F)&&e.get("EXT_color_buffer_float"),se}function C(R,M,V){return _(R,V)===!0||R.isFramebufferTexture&&R.minFilter!==en&&R.minFilter!==Pn?Math.log2(Math.max(M.width,M.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?M.mipmaps.length:1}function T(R){return R===en||R===Df||R===Ac?n.NEAREST:n.LINEAR}function A(R){const M=R.target;M.removeEventListener("dispose",A),S(M),M.isVideoTexture&&h.delete(M)}function I(R){const M=R.target;M.removeEventListener("dispose",I),F(M)}function S(R){const M=i.get(R);if(M.__webglInit===void 0)return;const V=R.source,re=d.get(V);if(re){const ne=re[M.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&E(R),Object.keys(re).length===0&&d.delete(V)}i.remove(R)}function E(R){const M=i.get(R);n.deleteTexture(M.__webglTexture);const V=R.source,re=d.get(V);delete re[M.__cacheKey],a.memory.textures--}function F(R){const M=R.texture,V=i.get(R),re=i.get(M);if(re.__webglTexture!==void 0&&(n.deleteTexture(re.__webglTexture),a.memory.textures--),R.depthTexture&&R.depthTexture.dispose(),R.isWebGLCubeRenderTarget)for(let ne=0;ne<6;ne++){if(Array.isArray(V.__webglFramebuffer[ne]))for(let se=0;se<V.__webglFramebuffer[ne].length;se++)n.deleteFramebuffer(V.__webglFramebuffer[ne][se]);else n.deleteFramebuffer(V.__webglFramebuffer[ne]);V.__webglDepthbuffer&&n.deleteRenderbuffer(V.__webglDepthbuffer[ne])}else{if(Array.isArray(V.__webglFramebuffer))for(let ne=0;ne<V.__webglFramebuffer.length;ne++)n.deleteFramebuffer(V.__webglFramebuffer[ne]);else n.deleteFramebuffer(V.__webglFramebuffer);if(V.__webglDepthbuffer&&n.deleteRenderbuffer(V.__webglDepthbuffer),V.__webglMultisampledFramebuffer&&n.deleteFramebuffer(V.__webglMultisampledFramebuffer),V.__webglColorRenderbuffer)for(let ne=0;ne<V.__webglColorRenderbuffer.length;ne++)V.__webglColorRenderbuffer[ne]&&n.deleteRenderbuffer(V.__webglColorRenderbuffer[ne]);V.__webglDepthRenderbuffer&&n.deleteRenderbuffer(V.__webglDepthRenderbuffer)}if(R.isWebGLMultipleRenderTargets)for(let ne=0,se=M.length;ne<se;ne++){const ye=i.get(M[ne]);ye.__webglTexture&&(n.deleteTexture(ye.__webglTexture),a.memory.textures--),i.remove(M[ne])}i.remove(M),i.remove(R)}let z=0;function q(){z=0}function L(){const R=z;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),z+=1,R}function k(R){const M=[];return M.push(R.wrapS),M.push(R.wrapT),M.push(R.wrapR||0),M.push(R.magFilter),M.push(R.minFilter),M.push(R.anisotropy),M.push(R.internalFormat),M.push(R.format),M.push(R.type),M.push(R.generateMipmaps),M.push(R.premultiplyAlpha),M.push(R.flipY),M.push(R.unpackAlignment),M.push(R.colorSpace),M.join()}function j(R,M){const V=i.get(R);if(R.isVideoTexture&&dt(R),R.isRenderTargetTexture===!1&&R.version>0&&V.__version!==R.version){const re=R.image;if(re===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(re.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ce(V,R,M);return}}t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+M)}function K(R,M){const V=i.get(R);if(R.version>0&&V.__version!==R.version){ce(V,R,M);return}t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+M)}function D(R,M){const V=i.get(R);if(R.version>0&&V.__version!==R.version){ce(V,R,M);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+M)}function O(R,M){const V=i.get(R);if(R.version>0&&V.__version!==R.version){me(V,R,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+M)}const B={[Sr]:n.REPEAT,[Wn]:n.CLAMP_TO_EDGE,[sh]:n.MIRRORED_REPEAT},$={[en]:n.NEAREST,[Df]:n.NEAREST_MIPMAP_NEAREST,[Ac]:n.NEAREST_MIPMAP_LINEAR,[Pn]:n.LINEAR,[py]:n.LINEAR_MIPMAP_NEAREST,[Fa]:n.LINEAR_MIPMAP_LINEAR},Q={[Ay]:n.NEVER,[Ny]:n.ALWAYS,[Ry]:n.LESS,[bg]:n.LEQUAL,[by]:n.EQUAL,[Ly]:n.GEQUAL,[Cy]:n.GREATER,[Py]:n.NOTEQUAL};function X(R,M,V){if(V?(n.texParameteri(R,n.TEXTURE_WRAP_S,B[M.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,B[M.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,B[M.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,$[M.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,$[M.minFilter])):(n.texParameteri(R,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(R,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,n.CLAMP_TO_EDGE),(M.wrapS!==Wn||M.wrapT!==Wn)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),n.texParameteri(R,n.TEXTURE_MAG_FILTER,T(M.magFilter)),n.texParameteri(R,n.TEXTURE_MIN_FILTER,T(M.minFilter)),M.minFilter!==en&&M.minFilter!==Pn&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),M.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,Q[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){const re=e.get("EXT_texture_filter_anisotropic");if(M.magFilter===en||M.minFilter!==Ac&&M.minFilter!==Fa||M.type===Bi&&e.has("OES_texture_float_linear")===!1||o===!1&&M.type===Ba&&e.has("OES_texture_half_float_linear")===!1)return;(M.anisotropy>1||i.get(M).__currentAnisotropy)&&(n.texParameterf(R,re.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy)}}function J(R,M){let V=!1;R.__webglInit===void 0&&(R.__webglInit=!0,M.addEventListener("dispose",A));const re=M.source;let ne=d.get(re);ne===void 0&&(ne={},d.set(re,ne));const se=k(M);if(se!==R.__cacheKey){ne[se]===void 0&&(ne[se]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,V=!0),ne[se].usedTimes++;const ye=ne[R.__cacheKey];ye!==void 0&&(ne[R.__cacheKey].usedTimes--,ye.usedTimes===0&&E(M)),R.__cacheKey=se,R.__webglTexture=ne[se].texture}return V}function ce(R,M,V){let re=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(re=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(re=n.TEXTURE_3D);const ne=J(R,M),se=M.source;t.bindTexture(re,R.__webglTexture,n.TEXTURE0+V);const ye=i.get(se);if(se.version!==ye.__version||ne===!0){t.activeTexture(n.TEXTURE0+V);const de=et.getPrimaries(et.workingColorSpace),_e=M.colorSpace===Nn?null:et.getPrimaries(M.colorSpace),Ae=M.colorSpace===Nn||de===_e?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const ze=u(M)&&m(M.image)===!1;let te=x(M.image,ze,!1,r.maxTextureSize);te=Be(M,te);const Je=m(te)||o,Xe=s.convert(M.format,M.colorSpace);let Ne=s.convert(M.type),Me=y(M.internalFormat,Xe,Ne,M.colorSpace,M.isVideoTexture);X(re,M,Je);let ve;const ke=M.mipmaps,Ze=o&&M.isVideoTexture!==!0&&Me!==Tg,vt=ye.__version===void 0||ne===!0,Ve=C(M,te,Je);if(M.isDepthTexture)Me=n.DEPTH_COMPONENT,o?M.type===Bi?Me=n.DEPTH_COMPONENT32F:M.type===Fi?Me=n.DEPTH_COMPONENT24:M.type===wr?Me=n.DEPTH24_STENCIL8:Me=n.DEPTH_COMPONENT16:M.type===Bi&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),M.format===Tr&&Me===n.DEPTH_COMPONENT&&M.type!==ad&&M.type!==Fi&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),M.type=Fi,Ne=s.convert(M.type)),M.format===ks&&Me===n.DEPTH_COMPONENT&&(Me=n.DEPTH_STENCIL,M.type!==wr&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),M.type=wr,Ne=s.convert(M.type))),vt&&(Ze?t.texStorage2D(n.TEXTURE_2D,1,Me,te.width,te.height):t.texImage2D(n.TEXTURE_2D,0,Me,te.width,te.height,0,Xe,Ne,null));else if(M.isDataTexture)if(ke.length>0&&Je){Ze&&vt&&t.texStorage2D(n.TEXTURE_2D,Ve,Me,ke[0].width,ke[0].height);for(let oe=0,N=ke.length;oe<N;oe++)ve=ke[oe],Ze?t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ve.width,ve.height,Xe,Ne,ve.data):t.texImage2D(n.TEXTURE_2D,oe,Me,ve.width,ve.height,0,Xe,Ne,ve.data);M.generateMipmaps=!1}else Ze?(vt&&t.texStorage2D(n.TEXTURE_2D,Ve,Me,te.width,te.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,te.width,te.height,Xe,Ne,te.data)):t.texImage2D(n.TEXTURE_2D,0,Me,te.width,te.height,0,Xe,Ne,te.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ze&&vt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ve,Me,ke[0].width,ke[0].height,te.depth);for(let oe=0,N=ke.length;oe<N;oe++)ve=ke[oe],M.format!==jn?Xe!==null?Ze?t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,ve.width,ve.height,te.depth,Xe,ve.data,0,0):t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,oe,Me,ve.width,ve.height,te.depth,0,ve.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ze?t.texSubImage3D(n.TEXTURE_2D_ARRAY,oe,0,0,0,ve.width,ve.height,te.depth,Xe,Ne,ve.data):t.texImage3D(n.TEXTURE_2D_ARRAY,oe,Me,ve.width,ve.height,te.depth,0,Xe,Ne,ve.data)}else{Ze&&vt&&t.texStorage2D(n.TEXTURE_2D,Ve,Me,ke[0].width,ke[0].height);for(let oe=0,N=ke.length;oe<N;oe++)ve=ke[oe],M.format!==jn?Xe!==null?Ze?t.compressedTexSubImage2D(n.TEXTURE_2D,oe,0,0,ve.width,ve.height,Xe,ve.data):t.compressedTexImage2D(n.TEXTURE_2D,oe,Me,ve.width,ve.height,0,ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ze?t.texSubImage2D(n.TEXTURE_2D,oe,0,0,ve.width,ve.height,Xe,Ne,ve.data):t.texImage2D(n.TEXTURE_2D,oe,Me,ve.width,ve.height,0,Xe,Ne,ve.data)}else if(M.isDataArrayTexture)Ze?(vt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ve,Me,te.width,te.height,te.depth),t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,Xe,Ne,te.data)):t.texImage3D(n.TEXTURE_2D_ARRAY,0,Me,te.width,te.height,te.depth,0,Xe,Ne,te.data);else if(M.isData3DTexture)Ze?(vt&&t.texStorage3D(n.TEXTURE_3D,Ve,Me,te.width,te.height,te.depth),t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,Xe,Ne,te.data)):t.texImage3D(n.TEXTURE_3D,0,Me,te.width,te.height,te.depth,0,Xe,Ne,te.data);else if(M.isFramebufferTexture){if(vt)if(Ze)t.texStorage2D(n.TEXTURE_2D,Ve,Me,te.width,te.height);else{let oe=te.width,N=te.height;for(let ue=0;ue<Ve;ue++)t.texImage2D(n.TEXTURE_2D,ue,Me,oe,N,0,Xe,Ne,null),oe>>=1,N>>=1}}else if(ke.length>0&&Je){Ze&&vt&&t.texStorage2D(n.TEXTURE_2D,Ve,Me,ke[0].width,ke[0].height);for(let oe=0,N=ke.length;oe<N;oe++)ve=ke[oe],Ze?t.texSubImage2D(n.TEXTURE_2D,oe,0,0,Xe,Ne,ve):t.texImage2D(n.TEXTURE_2D,oe,Me,Xe,Ne,ve);M.generateMipmaps=!1}else Ze?(vt&&t.texStorage2D(n.TEXTURE_2D,Ve,Me,te.width,te.height),t.texSubImage2D(n.TEXTURE_2D,0,0,0,Xe,Ne,te)):t.texImage2D(n.TEXTURE_2D,0,Me,Xe,Ne,te);_(M,Je)&&g(re),ye.__version=se.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function me(R,M,V){if(M.image.length!==6)return;const re=J(R,M),ne=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+V);const se=i.get(ne);if(ne.version!==se.__version||re===!0){t.activeTexture(n.TEXTURE0+V);const ye=et.getPrimaries(et.workingColorSpace),de=M.colorSpace===Nn?null:et.getPrimaries(M.colorSpace),_e=M.colorSpace===Nn||ye===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Ae=M.isCompressedTexture||M.image[0].isCompressedTexture,ze=M.image[0]&&M.image[0].isDataTexture,te=[];for(let oe=0;oe<6;oe++)!Ae&&!ze?te[oe]=x(M.image[oe],!1,!0,r.maxCubemapSize):te[oe]=ze?M.image[oe].image:M.image[oe],te[oe]=Be(M,te[oe]);const Je=te[0],Xe=m(Je)||o,Ne=s.convert(M.format,M.colorSpace),Me=s.convert(M.type),ve=y(M.internalFormat,Ne,Me,M.colorSpace),ke=o&&M.isVideoTexture!==!0,Ze=se.__version===void 0||re===!0;let vt=C(M,Je,Xe);X(n.TEXTURE_CUBE_MAP,M,Xe);let Ve;if(Ae){ke&&Ze&&t.texStorage2D(n.TEXTURE_CUBE_MAP,vt,ve,Je.width,Je.height);for(let oe=0;oe<6;oe++){Ve=te[oe].mipmaps;for(let N=0;N<Ve.length;N++){const ue=Ve[N];M.format!==jn?Ne!==null?ke?t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,N,0,0,ue.width,ue.height,Ne,ue.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,N,ve,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,N,0,0,ue.width,ue.height,Ne,Me,ue.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,N,ve,ue.width,ue.height,0,Ne,Me,ue.data)}}}else{Ve=M.mipmaps,ke&&Ze&&(Ve.length>0&&vt++,t.texStorage2D(n.TEXTURE_CUBE_MAP,vt,ve,te[0].width,te[0].height));for(let oe=0;oe<6;oe++)if(ze){ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,te[oe].width,te[oe].height,Ne,Me,te[oe].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ve,te[oe].width,te[oe].height,0,Ne,Me,te[oe].data);for(let N=0;N<Ve.length;N++){const he=Ve[N].image[oe].image;ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,N+1,0,0,he.width,he.height,Ne,Me,he.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,N+1,ve,he.width,he.height,0,Ne,Me,he.data)}}else{ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,0,0,Ne,Me,te[oe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,0,ve,Ne,Me,te[oe]);for(let N=0;N<Ve.length;N++){const ue=Ve[N];ke?t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,N+1,0,0,Ne,Me,ue.image[oe]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+oe,N+1,ve,Ne,Me,ue.image[oe])}}}_(M,Xe)&&g(n.TEXTURE_CUBE_MAP),se.__version=ne.version,M.onUpdate&&M.onUpdate(M)}R.__version=M.version}function ge(R,M,V,re,ne,se){const ye=s.convert(V.format,V.colorSpace),de=s.convert(V.type),_e=y(V.internalFormat,ye,de,V.colorSpace);if(!i.get(M).__hasExternalTextures){const ze=Math.max(1,M.width>>se),te=Math.max(1,M.height>>se);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,se,_e,ze,te,M.depth,0,ye,de,null):t.texImage2D(ne,se,_e,ze,te,0,ye,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),xe(M)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,re,ne,i.get(V).__webglTexture,0,De(M)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,re,ne,i.get(V).__webglTexture,se),t.bindFramebuffer(n.FRAMEBUFFER,null)}function Pe(R,M,V){if(n.bindRenderbuffer(n.RENDERBUFFER,R),M.depthBuffer&&!M.stencilBuffer){let re=o===!0?n.DEPTH_COMPONENT24:n.DEPTH_COMPONENT16;if(V||xe(M)){const ne=M.depthTexture;ne&&ne.isDepthTexture&&(ne.type===Bi?re=n.DEPTH_COMPONENT32F:ne.type===Fi&&(re=n.DEPTH_COMPONENT24));const se=De(M);xe(M)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,se,re,M.width,M.height):n.renderbufferStorageMultisample(n.RENDERBUFFER,se,re,M.width,M.height)}else n.renderbufferStorage(n.RENDERBUFFER,re,M.width,M.height);n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.RENDERBUFFER,R)}else if(M.depthBuffer&&M.stencilBuffer){const re=De(M);V&&xe(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,re,n.DEPTH24_STENCIL8,M.width,M.height):xe(M)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,re,n.DEPTH24_STENCIL8,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,n.DEPTH_STENCIL,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.RENDERBUFFER,R)}else{const re=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let ne=0;ne<re.length;ne++){const se=re[ne],ye=s.convert(se.format,se.colorSpace),de=s.convert(se.type),_e=y(se.internalFormat,ye,de,se.colorSpace),Ae=De(M);V&&xe(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ae,_e,M.width,M.height):xe(M)?l.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ae,_e,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,_e,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Oe(R,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),j(M.depthTexture,0);const re=i.get(M.depthTexture).__webglTexture,ne=De(M);if(M.depthTexture.format===Tr)xe(M)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,re,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,re,0);else if(M.depthTexture.format===ks)xe(M)?l.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,re,0,ne):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,re,0);else throw new Error("Unknown depthTexture format")}function Re(R){const M=i.get(R),V=R.isWebGLCubeRenderTarget===!0;if(R.depthTexture&&!M.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");Oe(M.__webglFramebuffer,R)}else if(V){M.__webglDepthbuffer=[];for(let re=0;re<6;re++)t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[re]),M.__webglDepthbuffer[re]=n.createRenderbuffer(),Pe(M.__webglDepthbuffer[re],R,!1)}else t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=n.createRenderbuffer(),Pe(M.__webglDepthbuffer,R,!1);t.bindFramebuffer(n.FRAMEBUFFER,null)}function $e(R,M,V){const re=i.get(R);M!==void 0&&ge(re.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Re(R)}function G(R){const M=R.texture,V=i.get(R),re=i.get(M);R.addEventListener("dispose",I),R.isWebGLMultipleRenderTargets!==!0&&(re.__webglTexture===void 0&&(re.__webglTexture=n.createTexture()),re.__version=M.version,a.memory.textures++);const ne=R.isWebGLCubeRenderTarget===!0,se=R.isWebGLMultipleRenderTargets===!0,ye=m(R)||o;if(ne){V.__webglFramebuffer=[];for(let de=0;de<6;de++)if(o&&M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer[de]=[];for(let _e=0;_e<M.mipmaps.length;_e++)V.__webglFramebuffer[de][_e]=n.createFramebuffer()}else V.__webglFramebuffer[de]=n.createFramebuffer()}else{if(o&&M.mipmaps&&M.mipmaps.length>0){V.__webglFramebuffer=[];for(let de=0;de<M.mipmaps.length;de++)V.__webglFramebuffer[de]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(se)if(r.drawBuffers){const de=R.texture;for(let _e=0,Ae=de.length;_e<Ae;_e++){const ze=i.get(de[_e]);ze.__webglTexture===void 0&&(ze.__webglTexture=n.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&R.samples>0&&xe(R)===!1){const de=se?M:[M];V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let _e=0;_e<de.length;_e++){const Ae=de[_e];V.__webglColorRenderbuffer[_e]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[_e]);const ze=s.convert(Ae.format,Ae.colorSpace),te=s.convert(Ae.type),Je=y(Ae.internalFormat,ze,te,Ae.colorSpace,R.isXRRenderTarget===!0),Xe=De(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Xe,Je,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,V.__webglColorRenderbuffer[_e])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),Pe(V.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ne){t.bindTexture(n.TEXTURE_CUBE_MAP,re.__webglTexture),X(n.TEXTURE_CUBE_MAP,M,ye);for(let de=0;de<6;de++)if(o&&M.mipmaps&&M.mipmaps.length>0)for(let _e=0;_e<M.mipmaps.length;_e++)ge(V.__webglFramebuffer[de][_e],R,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,_e);else ge(V.__webglFramebuffer[de],R,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);_(M,ye)&&g(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(se){const de=R.texture;for(let _e=0,Ae=de.length;_e<Ae;_e++){const ze=de[_e],te=i.get(ze);t.bindTexture(n.TEXTURE_2D,te.__webglTexture),X(n.TEXTURE_2D,ze,ye),ge(V.__webglFramebuffer,R,ze,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,0),_(ze,ye)&&g(n.TEXTURE_2D)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(o?de=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),t.bindTexture(de,re.__webglTexture),X(de,M,ye),o&&M.mipmaps&&M.mipmaps.length>0)for(let _e=0;_e<M.mipmaps.length;_e++)ge(V.__webglFramebuffer[_e],R,M,n.COLOR_ATTACHMENT0,de,_e);else ge(V.__webglFramebuffer,R,M,n.COLOR_ATTACHMENT0,de,0);_(M,ye)&&g(de),t.unbindTexture()}R.depthBuffer&&Re(R)}function Yt(R){const M=m(R)||o,V=R.isWebGLMultipleRenderTargets===!0?R.texture:[R.texture];for(let re=0,ne=V.length;re<ne;re++){const se=V[re];if(_(se,M)){const ye=R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,de=i.get(se).__webglTexture;t.bindTexture(ye,de),g(ye),t.unbindTexture()}}}function Ee(R){if(o&&R.samples>0&&xe(R)===!1){const M=R.isWebGLMultipleRenderTargets?R.texture:[R.texture],V=R.width,re=R.height;let ne=n.COLOR_BUFFER_BIT;const se=[],ye=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=i.get(R),_e=R.isWebGLMultipleRenderTargets===!0;if(_e)for(let Ae=0;Ae<M.length;Ae++)t.bindFramebuffer(n.FRAMEBUFFER,de.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,de.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,de.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglFramebuffer);for(let Ae=0;Ae<M.length;Ae++){se.push(n.COLOR_ATTACHMENT0+Ae),R.depthBuffer&&se.push(ye);const ze=de.__ignoreDepthValues!==void 0?de.__ignoreDepthValues:!1;if(ze===!1&&(R.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),_e&&n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,de.__webglColorRenderbuffer[Ae]),ze===!0&&(n.invalidateFramebuffer(n.READ_FRAMEBUFFER,[ye]),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[ye])),_e){const te=i.get(M[Ae]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,te,0)}n.blitFramebuffer(0,0,V,re,0,0,V,re,ne,n.NEAREST),c&&n.invalidateFramebuffer(n.READ_FRAMEBUFFER,se)}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),_e)for(let Ae=0;Ae<M.length;Ae++){t.bindFramebuffer(n.FRAMEBUFFER,de.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.RENDERBUFFER,de.__webglColorRenderbuffer[Ae]);const ze=i.get(M[Ae]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,de.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ae,n.TEXTURE_2D,ze,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,de.__webglMultisampledFramebuffer)}}function De(R){return Math.min(r.maxSamples,R.samples)}function xe(R){const M=i.get(R);return o&&R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function dt(R){const M=a.render.frame;h.get(R)!==M&&(h.set(R,M),R.update())}function Be(R,M){const V=R.colorSpace,re=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||R.format===oh||V!==wi&&V!==Nn&&(et.getTransfer(V)===ot?o===!1?e.has("EXT_sRGB")===!0&&re===jn?(R.format=oh,R.minFilter=Pn,R.generateMipmaps=!1):M=Pg.sRGBToLinear(M):(re!==jn||ne!==Ki)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),M}this.allocateTextureUnit=L,this.resetTextureUnits=q,this.setTexture2D=j,this.setTexture2DArray=K,this.setTexture3D=D,this.setTextureCube=O,this.rebindTextures=$e,this.setupRenderTarget=G,this.updateRenderTargetMipmap=Yt,this.updateMultisampleRenderTarget=Ee,this.setupDepthRenderbuffer=Re,this.setupFrameBufferTexture=ge,this.useMultisampledRTT=xe}function DT(n,e,t){const i=t.isWebGL2;function r(s,a=Nn){let o;const l=et.getTransfer(a);if(s===Ki)return n.UNSIGNED_BYTE;if(s===yg)return n.UNSIGNED_SHORT_4_4_4_4;if(s===Sg)return n.UNSIGNED_SHORT_5_5_5_1;if(s===my)return n.BYTE;if(s===gy)return n.SHORT;if(s===ad)return n.UNSIGNED_SHORT;if(s===xg)return n.INT;if(s===Fi)return n.UNSIGNED_INT;if(s===Bi)return n.FLOAT;if(s===Ba)return i?n.HALF_FLOAT:(o=e.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(s===_y)return n.ALPHA;if(s===jn)return n.RGBA;if(s===vy)return n.LUMINANCE;if(s===xy)return n.LUMINANCE_ALPHA;if(s===Tr)return n.DEPTH_COMPONENT;if(s===ks)return n.DEPTH_STENCIL;if(s===oh)return o=e.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(s===yy)return n.RED;if(s===Mg)return n.RED_INTEGER;if(s===Sy)return n.RG;if(s===Eg)return n.RG_INTEGER;if(s===wg)return n.RGBA_INTEGER;if(s===Rc||s===bc||s===Cc||s===Pc)if(l===ot)if(o=e.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(s===Rc)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===bc)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Cc)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Pc)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=e.get("WEBGL_compressed_texture_s3tc"),o!==null){if(s===Rc)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===bc)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Cc)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Pc)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===If||s===Uf||s===Of||s===kf)if(o=e.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(s===If)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Uf)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Of)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===kf)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Tg)return o=e.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Ff||s===Bf)if(o=e.get("WEBGL_compressed_texture_etc"),o!==null){if(s===Ff)return l===ot?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(s===Bf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===zf||s===Gf||s===Hf||s===Vf||s===Wf||s===jf||s===Xf||s===Yf||s===qf||s===$f||s===Kf||s===Zf||s===Qf||s===Jf)if(o=e.get("WEBGL_compressed_texture_astc"),o!==null){if(s===zf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===Gf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Hf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Vf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Wf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===jf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Xf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Yf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===qf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===$f)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Kf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Zf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Qf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Jf)return l===ot?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Lc||s===ep||s===tp)if(o=e.get("EXT_texture_compression_bptc"),o!==null){if(s===Lc)return l===ot?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===ep)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===tp)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===My||s===np||s===ip||s===rp)if(o=e.get("EXT_texture_compression_rgtc"),o!==null){if(s===Lc)return o.COMPRESSED_RED_RGTC1_EXT;if(s===np)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===ip)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===rp)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===wr?i?n.UNSIGNED_INT_24_8:(o=e.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):n[s]!==void 0?n[s]:null}return{convert:r}}class IT extends yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class He extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const UT={type:"move"};class nu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new He,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new He,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new He,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const m=t.getJointPose(x,i),u=this._getHandJoint(c,x);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=h.position.distanceTo(f.position),p=.02,v=.005;c.inputState.pinching&&d>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(UT)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new He;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class OT extends Hs{constructor(e,t){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,d=null,p=null,v=null;const x=t.getContextAttributes();let m=null,u=null;const _=[],g=[],y=new Ce;let C=null;const T=new yn;T.layers.enable(1),T.viewport=new ht;const A=new yn;A.layers.enable(2),A.viewport=new ht;const I=[T,A],S=new IT;S.layers.enable(1),S.layers.enable(2);let E=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let J=_[X];return J===void 0&&(J=new nu,_[X]=J),J.getTargetRaySpace()},this.getControllerGrip=function(X){let J=_[X];return J===void 0&&(J=new nu,_[X]=J),J.getGripSpace()},this.getHand=function(X){let J=_[X];return J===void 0&&(J=new nu,_[X]=J),J.getHandSpace()};function z(X){const J=g.indexOf(X.inputSource);if(J===-1)return;const ce=_[J];ce!==void 0&&(ce.update(X.inputSource,X.frame,c||a),ce.dispatchEvent({type:X.type,data:X.inputSource}))}function q(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",q),r.removeEventListener("inputsourceschange",L);for(let X=0;X<_.length;X++){const J=g[X];J!==null&&(g[X]=null,_[X].disconnect(J))}E=null,F=null,e.setRenderTarget(m),p=null,d=null,f=null,r=null,u=null,Q.stop(),i.isPresenting=!1,e.setPixelRatio(C),e.setSize(y.width,y.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(m=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",q),r.addEventListener("inputsourceschange",L),x.xrCompatible!==!0&&await t.makeXRCompatible(),C=e.getPixelRatio(),e.getSize(y),r.renderState.layers===void 0||e.capabilities.isWebGL2===!1){const J={antialias:r.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,J),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),u=new Nr(p.framebufferWidth,p.framebufferHeight,{format:jn,type:Ki,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil})}else{let J=null,ce=null,me=null;x.depth&&(me=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,J=x.stencil?ks:Tr,ce=x.stencil?wr:Fi);const ge={colorFormat:t.RGBA8,depthFormat:me,scaleFactor:s};f=new XRWebGLBinding(r,t),d=f.createProjectionLayer(ge),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),u=new Nr(d.textureWidth,d.textureHeight,{format:jn,type:Ki,depthTexture:new Hg(d.textureWidth,d.textureHeight,ce,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0});const Pe=e.properties.get(u);Pe.__ignoreDepthValues=d.ignoreDepthValues}u.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),Q.setContext(r),Q.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function L(X){for(let J=0;J<X.removed.length;J++){const ce=X.removed[J],me=g.indexOf(ce);me>=0&&(g[me]=null,_[me].disconnect(ce))}for(let J=0;J<X.added.length;J++){const ce=X.added[J];let me=g.indexOf(ce);if(me===-1){for(let Pe=0;Pe<_.length;Pe++)if(Pe>=g.length){g.push(ce),me=Pe;break}else if(g[Pe]===null){g[Pe]=ce,me=Pe;break}if(me===-1)break}const ge=_[me];ge&&ge.connect(ce)}}const k=new P,j=new P;function K(X,J,ce){k.setFromMatrixPosition(J.matrixWorld),j.setFromMatrixPosition(ce.matrixWorld);const me=k.distanceTo(j),ge=J.projectionMatrix.elements,Pe=ce.projectionMatrix.elements,Oe=ge[14]/(ge[10]-1),Re=ge[14]/(ge[10]+1),$e=(ge[9]+1)/ge[5],G=(ge[9]-1)/ge[5],Yt=(ge[8]-1)/ge[0],Ee=(Pe[8]+1)/Pe[0],De=Oe*Yt,xe=Oe*Ee,dt=me/(-Yt+Ee),Be=dt*-Yt;J.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Be),X.translateZ(dt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const R=Oe+dt,M=Re+dt,V=De-Be,re=xe+(me-Be),ne=$e*Re/M*R,se=G*Re/M*R;X.projectionMatrix.makePerspective(V,re,ne,se,R,M),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function D(X,J){J===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(J.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;S.near=A.near=T.near=X.near,S.far=A.far=T.far=X.far,(E!==S.near||F!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),E=S.near,F=S.far);const J=X.parent,ce=S.cameras;D(S,J);for(let me=0;me<ce.length;me++)D(ce[me],J);ce.length===2?K(S,T,A):S.projectionMatrix.copy(T.projectionMatrix),O(X,S,J)};function O(X,J,ce){ce===null?X.matrix.copy(J.matrixWorld):(X.matrix.copy(ce.matrixWorld),X.matrix.invert(),X.matrix.multiply(J.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=lh*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=X)};let B=null;function $(X,J){if(h=J.getViewerPose(c||a),v=J,h!==null){const ce=h.views;p!==null&&(e.setRenderTargetFramebuffer(u,p.framebuffer),e.setRenderTarget(u));let me=!1;ce.length!==S.cameras.length&&(S.cameras.length=0,me=!0);for(let ge=0;ge<ce.length;ge++){const Pe=ce[ge];let Oe=null;if(p!==null)Oe=p.getViewport(Pe);else{const $e=f.getViewSubImage(d,Pe);Oe=$e.viewport,ge===0&&(e.setRenderTargetTextures(u,$e.colorTexture,d.ignoreDepthValues?void 0:$e.depthStencilTexture),e.setRenderTarget(u))}let Re=I[ge];Re===void 0&&(Re=new yn,Re.layers.enable(ge),Re.viewport=new ht,I[ge]=Re),Re.matrix.fromArray(Pe.transform.matrix),Re.matrix.decompose(Re.position,Re.quaternion,Re.scale),Re.projectionMatrix.fromArray(Pe.projectionMatrix),Re.projectionMatrixInverse.copy(Re.projectionMatrix).invert(),Re.viewport.set(Oe.x,Oe.y,Oe.width,Oe.height),ge===0&&(S.matrix.copy(Re.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),me===!0&&S.cameras.push(Re)}}for(let ce=0;ce<_.length;ce++){const me=g[ce],ge=_[ce];me!==null&&ge!==void 0&&ge.update(me,J,c||a)}B&&B(X,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),v=null}const Q=new zg;Q.setAnimationLoop($),this.setAnimationLoop=function(X){B=X},this.dispose=function(){}}}function kT(n,e){function t(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,kg(n)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,_,g,y){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),f(m,u)):u.isMeshPhongMaterial?(s(m,u),h(m,u)):u.isMeshStandardMaterial?(s(m,u),d(m,u),u.isMeshPhysicalMaterial&&p(m,u,y)):u.isMeshMatcapMaterial?(s(m,u),v(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),x(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(a(m,u),u.isLineDashedMaterial&&o(m,u)):u.isPointsMaterial?l(m,u,_,g):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,t(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===pn&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,t(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===pn&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,t(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,t(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const _=e.get(u).envMap;if(_&&(m.envMap.value=_,m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap){m.lightMap.value=u.lightMap;const g=n._useLegacyLights===!0?Math.PI:1;m.lightMapIntensity.value=u.lightMapIntensity*g,t(u.lightMap,m.lightMapTransform)}u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,m.aoMapTransform))}function a(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform))}function o(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,_,g){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*_,m.scale.value=g*.5,u.map&&(m.map.value=u.map,t(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function h(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function f(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function d(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,m.roughnessMapTransform)),e.get(u).envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,_){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===pn&&m.clearcoatNormalScale.value.negate())),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,u){u.matcap&&(m.matcap.value=u.matcap)}function x(m,u){const _=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function FT(n,e,t,i){let r={},s={},a=[];const o=t.isWebGL2?n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(_,g){const y=g.program;i.uniformBlockBinding(_,y)}function c(_,g){let y=r[_.id];y===void 0&&(v(_),y=h(_),r[_.id]=y,_.addEventListener("dispose",m));const C=g.program;i.updateUBOMapping(_,C);const T=e.render.frame;s[_.id]!==T&&(d(_),s[_.id]=T)}function h(_){const g=f();_.__bindingPointIndex=g;const y=n.createBuffer(),C=_.__size,T=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,y),n.bufferData(n.UNIFORM_BUFFER,C,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,g,y),y}function f(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(_){const g=r[_.id],y=_.uniforms,C=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,g);for(let T=0,A=y.length;T<A;T++){const I=Array.isArray(y[T])?y[T]:[y[T]];for(let S=0,E=I.length;S<E;S++){const F=I[S];if(p(F,T,S,C)===!0){const z=F.__offset,q=Array.isArray(F.value)?F.value:[F.value];let L=0;for(let k=0;k<q.length;k++){const j=q[k],K=x(j);typeof j=="number"||typeof j=="boolean"?(F.__data[0]=j,n.bufferSubData(n.UNIFORM_BUFFER,z+L,F.__data)):j.isMatrix3?(F.__data[0]=j.elements[0],F.__data[1]=j.elements[1],F.__data[2]=j.elements[2],F.__data[3]=0,F.__data[4]=j.elements[3],F.__data[5]=j.elements[4],F.__data[6]=j.elements[5],F.__data[7]=0,F.__data[8]=j.elements[6],F.__data[9]=j.elements[7],F.__data[10]=j.elements[8],F.__data[11]=0):(j.toArray(F.__data,L),L+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,z,F.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(_,g,y,C){const T=_.value,A=g+"_"+y;if(C[A]===void 0)return typeof T=="number"||typeof T=="boolean"?C[A]=T:C[A]=T.clone(),!0;{const I=C[A];if(typeof T=="number"||typeof T=="boolean"){if(I!==T)return C[A]=T,!0}else if(I.equals(T)===!1)return I.copy(T),!0}return!1}function v(_){const g=_.uniforms;let y=0;const C=16;for(let A=0,I=g.length;A<I;A++){const S=Array.isArray(g[A])?g[A]:[g[A]];for(let E=0,F=S.length;E<F;E++){const z=S[E],q=Array.isArray(z.value)?z.value:[z.value];for(let L=0,k=q.length;L<k;L++){const j=q[L],K=x(j),D=y%C;D!==0&&C-D<K.boundary&&(y+=C-D),z.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=y,y+=K.storage}}}const T=y%C;return T>0&&(y+=C-T),_.__size=y,_.__cache={},this}function x(_){const g={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(g.boundary=4,g.storage=4):_.isVector2?(g.boundary=8,g.storage=8):_.isVector3||_.isColor?(g.boundary=16,g.storage=12):_.isVector4?(g.boundary=16,g.storage=16):_.isMatrix3?(g.boundary=48,g.storage=48):_.isMatrix4?(g.boundary=64,g.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),g}function m(_){const g=_.target;g.removeEventListener("dispose",m);const y=a.indexOf(g.__bindingPointIndex);a.splice(y,1),n.deleteBuffer(r[g.id]),delete r[g.id],delete s[g.id]}function u(){for(const _ in r)n.deleteBuffer(r[_]);a=[],r={},s={}}return{bind:l,update:c,dispose:u}}class qg{constructor(e={}){const{canvas:t=Iy(),context:i=null,depth:r=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let d;i!==null?d=i.getContextAttributes().alpha:d=a;const p=new Uint32Array(4),v=new Int32Array(4);let x=null,m=null;const u=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kt,this._useLegacyLights=!1,this.toneMapping=$i,this.toneMappingExposure=1;const g=this;let y=!1,C=0,T=0,A=null,I=-1,S=null;const E=new ht,F=new ht;let z=null;const q=new qe(0);let L=0,k=t.width,j=t.height,K=1,D=null,O=null;const B=new ht(0,0,k,j),$=new ht(0,0,k,j);let Q=!1;const X=new ld;let J=!1,ce=!1,me=null;const ge=new St,Pe=new Ce,Oe=new P,Re={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function $e(){return A===null?K:1}let G=i;function Yt(w,U){for(let W=0;W<w.length;W++){const Y=w[W],H=t.getContext(Y,U);if(H!==null)return H}return null}try{const w={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${sd}`),t.addEventListener("webglcontextlost",oe,!1),t.addEventListener("webglcontextrestored",N,!1),t.addEventListener("webglcontextcreationerror",ue,!1),G===null){const U=["webgl2","webgl","experimental-webgl"];if(g.isWebGL1Renderer===!0&&U.shift(),G=Yt(U,w),G===null)throw Yt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&G instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),G.getShaderPrecisionFormat===void 0&&(G.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let Ee,De,xe,dt,Be,R,M,V,re,ne,se,ye,de,_e,Ae,ze,te,Je,Xe,Ne,Me,ve,ke,Ze;function vt(){Ee=new qE(G),De=new HE(G,Ee,e),Ee.init(De),ve=new DT(G,Ee,De),xe=new LT(G,Ee,De),dt=new ZE(G),Be=new _T,R=new NT(G,Ee,xe,Be,De,ve,dt),M=new WE(g),V=new YE(g),re=new sS(G,De),ke=new zE(G,Ee,re,De),ne=new $E(G,re,dt,ke),se=new tw(G,ne,re,dt),Xe=new ew(G,De,R),ze=new VE(Be),ye=new gT(g,M,V,Ee,De,ke,ze),de=new kT(g,Be),_e=new xT,Ae=new TT(Ee,De),Je=new BE(g,M,V,xe,se,d,l),te=new PT(g,se,De),Ze=new FT(G,dt,De,xe),Ne=new GE(G,Ee,dt,De),Me=new KE(G,Ee,dt,De),dt.programs=ye.programs,g.capabilities=De,g.extensions=Ee,g.properties=Be,g.renderLists=_e,g.shadowMap=te,g.state=xe,g.info=dt}vt();const Ve=new OT(g,G);this.xr=Ve,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const w=Ee.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=Ee.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(w){w!==void 0&&(K=w,this.setSize(k,j,!1))},this.getSize=function(w){return w.set(k,j)},this.setSize=function(w,U,W=!0){if(Ve.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=w,j=U,t.width=Math.floor(w*K),t.height=Math.floor(U*K),W===!0&&(t.style.width=w+"px",t.style.height=U+"px"),this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(k*K,j*K).floor()},this.setDrawingBufferSize=function(w,U,W){k=w,j=U,K=W,t.width=Math.floor(w*W),t.height=Math.floor(U*W),this.setViewport(0,0,w,U)},this.getCurrentViewport=function(w){return w.copy(E)},this.getViewport=function(w){return w.copy(B)},this.setViewport=function(w,U,W,Y){w.isVector4?B.set(w.x,w.y,w.z,w.w):B.set(w,U,W,Y),xe.viewport(E.copy(B).multiplyScalar(K).floor())},this.getScissor=function(w){return w.copy($)},this.setScissor=function(w,U,W,Y){w.isVector4?$.set(w.x,w.y,w.z,w.w):$.set(w,U,W,Y),xe.scissor(F.copy($).multiplyScalar(K).floor())},this.getScissorTest=function(){return Q},this.setScissorTest=function(w){xe.setScissorTest(Q=w)},this.setOpaqueSort=function(w){D=w},this.setTransparentSort=function(w){O=w},this.getClearColor=function(w){return w.copy(Je.getClearColor())},this.setClearColor=function(){Je.setClearColor.apply(Je,arguments)},this.getClearAlpha=function(){return Je.getClearAlpha()},this.setClearAlpha=function(){Je.setClearAlpha.apply(Je,arguments)},this.clear=function(w=!0,U=!0,W=!0){let Y=0;if(w){let H=!1;if(A!==null){const fe=A.texture.format;H=fe===wg||fe===Eg||fe===Mg}if(H){const fe=A.texture.type,Se=fe===Ki||fe===Fi||fe===ad||fe===wr||fe===yg||fe===Sg,Te=Je.getClearColor(),Le=Je.getClearAlpha(),Ge=Te.r,Ie=Te.g,Ue=Te.b;Se?(p[0]=Ge,p[1]=Ie,p[2]=Ue,p[3]=Le,G.clearBufferuiv(G.COLOR,0,p)):(v[0]=Ge,v[1]=Ie,v[2]=Ue,v[3]=Le,G.clearBufferiv(G.COLOR,0,v))}else Y|=G.COLOR_BUFFER_BIT}U&&(Y|=G.DEPTH_BUFFER_BIT),W&&(Y|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G.clear(Y)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",oe,!1),t.removeEventListener("webglcontextrestored",N,!1),t.removeEventListener("webglcontextcreationerror",ue,!1),_e.dispose(),Ae.dispose(),Be.dispose(),M.dispose(),V.dispose(),se.dispose(),ke.dispose(),Ze.dispose(),ye.dispose(),Ve.dispose(),Ve.removeEventListener("sessionstart",qt),Ve.removeEventListener("sessionend",rt),me&&(me.dispose(),me=null),$t.stop()};function oe(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function N(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const w=dt.autoReset,U=te.enabled,W=te.autoUpdate,Y=te.needsUpdate,H=te.type;vt(),dt.autoReset=w,te.enabled=U,te.autoUpdate=W,te.needsUpdate=Y,te.type=H}function ue(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function he(w){const U=w.target;U.removeEventListener("dispose",he),be(U)}function be(w){we(w),Be.remove(w)}function we(w){const U=Be.get(w).programs;U!==void 0&&(U.forEach(function(W){ye.releaseProgram(W)}),w.isShaderMaterial&&ye.releaseShaderCache(w))}this.renderBufferDirect=function(w,U,W,Y,H,fe){U===null&&(U=Re);const Se=H.isMesh&&H.matrixWorld.determinant()<0,Te=n_(w,U,W,Y,H);xe.setMaterial(Y,Se);let Le=W.index,Ge=1;if(Y.wireframe===!0){if(Le=ne.getWireframeAttribute(W),Le===void 0)return;Ge=2}const Ie=W.drawRange,Ue=W.attributes.position;let Mt=Ie.start*Ge,gn=(Ie.start+Ie.count)*Ge;fe!==null&&(Mt=Math.max(Mt,fe.start*Ge),gn=Math.min(gn,(fe.start+fe.count)*Ge)),Le!==null?(Mt=Math.max(Mt,0),gn=Math.min(gn,Le.count)):Ue!=null&&(Mt=Math.max(Mt,0),gn=Math.min(gn,Ue.count));const Nt=gn-Mt;if(Nt<0||Nt===1/0)return;ke.setup(H,Y,Te,W,Le);let si,ft=Ne;if(Le!==null&&(si=re.get(Le),ft=Me,ft.setIndex(si)),H.isMesh)Y.wireframe===!0?(xe.setLineWidth(Y.wireframeLinewidth*$e()),ft.setMode(G.LINES)):ft.setMode(G.TRIANGLES);else if(H.isLine){let We=Y.linewidth;We===void 0&&(We=1),xe.setLineWidth(We*$e()),H.isLineSegments?ft.setMode(G.LINES):H.isLineLoop?ft.setMode(G.LINE_LOOP):ft.setMode(G.LINE_STRIP)}else H.isPoints?ft.setMode(G.POINTS):H.isSprite&&ft.setMode(G.TRIANGLES);if(H.isBatchedMesh)ft.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else if(H.isInstancedMesh)ft.renderInstances(Mt,Nt,H.count);else if(W.isInstancedBufferGeometry){const We=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Kl=Math.min(W.instanceCount,We);ft.renderInstances(Mt,Nt,Kl)}else ft.render(Mt,Nt)};function nt(w,U,W){w.transparent===!0&&w.side===pi&&w.forceSinglePass===!1?(w.side=pn,w.needsUpdate=!0,qa(w,U,W),w.side=er,w.needsUpdate=!0,qa(w,U,W),w.side=pi):qa(w,U,W)}this.compile=function(w,U,W=null){W===null&&(W=w),m=Ae.get(W),m.init(),_.push(m),W.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),w!==W&&w.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(m.pushLight(H),H.castShadow&&m.pushShadow(H))}),m.setupLights(g._useLegacyLights);const Y=new Set;return w.traverse(function(H){const fe=H.material;if(fe)if(Array.isArray(fe))for(let Se=0;Se<fe.length;Se++){const Te=fe[Se];nt(Te,W,H),Y.add(Te)}else nt(fe,W,H),Y.add(fe)}),_.pop(),m=null,Y},this.compileAsync=function(w,U,W=null){const Y=this.compile(w,U,W);return new Promise(H=>{function fe(){if(Y.forEach(function(Se){Be.get(Se).currentProgram.isReady()&&Y.delete(Se)}),Y.size===0){H(w);return}setTimeout(fe,10)}Ee.get("KHR_parallel_shader_compile")!==null?fe():setTimeout(fe,10)})};let it=null;function Lt(w){it&&it(w)}function qt(){$t.stop()}function rt(){$t.start()}const $t=new zg;$t.setAnimationLoop(Lt),typeof self<"u"&&$t.setContext(self),this.setAnimationLoop=function(w){it=w,Ve.setAnimationLoop(w),w===null?$t.stop():$t.start()},Ve.addEventListener("sessionstart",qt),Ve.addEventListener("sessionend",rt),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Ve.enabled===!0&&Ve.isPresenting===!0&&(Ve.cameraAutoUpdate===!0&&Ve.updateCamera(U),U=Ve.getCamera()),w.isScene===!0&&w.onBeforeRender(g,w,U,A),m=Ae.get(w,_.length),m.init(),_.push(m),ge.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),X.setFromProjectionMatrix(ge),ce=this.localClippingEnabled,J=ze.init(this.clippingPlanes,ce),x=_e.get(w,u.length),x.init(),u.push(x),Qn(w,U,0,g.sortObjects),x.finish(),g.sortObjects===!0&&x.sort(D,O),this.info.render.frame++,J===!0&&ze.beginShadows();const W=m.state.shadowsArray;if(te.render(W,w,U),J===!0&&ze.endShadows(),this.info.autoReset===!0&&this.info.reset(),Je.render(x,w),m.setupLights(g._useLegacyLights),U.isArrayCamera){const Y=U.cameras;for(let H=0,fe=Y.length;H<fe;H++){const Se=Y[H];dd(x,w,Se,Se.viewport)}}else dd(x,w,U);A!==null&&(R.updateMultisampleRenderTarget(A),R.updateRenderTargetMipmap(A)),w.isScene===!0&&w.onAfterRender(g,w,U),ke.resetDefaultState(),I=-1,S=null,_.pop(),_.length>0?m=_[_.length-1]:m=null,u.pop(),u.length>0?x=u[u.length-1]:x=null};function Qn(w,U,W,Y){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)W=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(U);else if(w.isLight)m.pushLight(w),w.castShadow&&m.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||X.intersectsSprite(w)){Y&&Oe.setFromMatrixPosition(w.matrixWorld).applyMatrix4(ge);const Se=se.update(w),Te=w.material;Te.visible&&x.push(w,Se,Te,W,Oe.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||X.intersectsObject(w))){const Se=se.update(w),Te=w.material;if(Y&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),Oe.copy(w.boundingSphere.center)):(Se.boundingSphere===null&&Se.computeBoundingSphere(),Oe.copy(Se.boundingSphere.center)),Oe.applyMatrix4(w.matrixWorld).applyMatrix4(ge)),Array.isArray(Te)){const Le=Se.groups;for(let Ge=0,Ie=Le.length;Ge<Ie;Ge++){const Ue=Le[Ge],Mt=Te[Ue.materialIndex];Mt&&Mt.visible&&x.push(w,Se,Mt,W,Oe.z,Ue)}}else Te.visible&&x.push(w,Se,Te,W,Oe.z,null)}}const fe=w.children;for(let Se=0,Te=fe.length;Se<Te;Se++)Qn(fe[Se],U,W,Y)}function dd(w,U,W,Y){const H=w.opaque,fe=w.transmissive,Se=w.transparent;m.setupLightsView(W),J===!0&&ze.setGlobalState(g.clippingPlanes,W),fe.length>0&&t_(H,fe,U,W),Y&&xe.viewport(E.copy(Y)),H.length>0&&Ya(H,U,W),fe.length>0&&Ya(fe,U,W),Se.length>0&&Ya(Se,U,W),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function t_(w,U,W,Y){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;const fe=De.isWebGL2;me===null&&(me=new Nr(1,1,{generateMipmaps:!0,type:Ee.has("EXT_color_buffer_half_float")?Ba:Ki,minFilter:Fa,samples:fe?4:0})),g.getDrawingBufferSize(Pe),fe?me.setSize(Pe.x,Pe.y):me.setSize(ch(Pe.x),ch(Pe.y));const Se=g.getRenderTarget();g.setRenderTarget(me),g.getClearColor(q),L=g.getClearAlpha(),L<1&&g.setClearColor(16777215,.5),g.clear();const Te=g.toneMapping;g.toneMapping=$i,Ya(w,W,Y),R.updateMultisampleRenderTarget(me),R.updateRenderTargetMipmap(me);let Le=!1;for(let Ge=0,Ie=U.length;Ge<Ie;Ge++){const Ue=U[Ge],Mt=Ue.object,gn=Ue.geometry,Nt=Ue.material,si=Ue.group;if(Nt.side===pi&&Mt.layers.test(Y.layers)){const ft=Nt.side;Nt.side=pn,Nt.needsUpdate=!0,fd(Mt,W,Y,gn,Nt,si),Nt.side=ft,Nt.needsUpdate=!0,Le=!0}}Le===!0&&(R.updateMultisampleRenderTarget(me),R.updateRenderTargetMipmap(me)),g.setRenderTarget(Se),g.setClearColor(q,L),g.toneMapping=Te}function Ya(w,U,W){const Y=U.isScene===!0?U.overrideMaterial:null;for(let H=0,fe=w.length;H<fe;H++){const Se=w[H],Te=Se.object,Le=Se.geometry,Ge=Y===null?Se.material:Y,Ie=Se.group;Te.layers.test(W.layers)&&fd(Te,U,W,Le,Ge,Ie)}}function fd(w,U,W,Y,H,fe){w.onBeforeRender(g,U,W,Y,H,fe),w.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),H.onBeforeRender(g,U,W,Y,w,fe),H.transparent===!0&&H.side===pi&&H.forceSinglePass===!1?(H.side=pn,H.needsUpdate=!0,g.renderBufferDirect(W,U,Y,H,w,fe),H.side=er,H.needsUpdate=!0,g.renderBufferDirect(W,U,Y,H,w,fe),H.side=pi):g.renderBufferDirect(W,U,Y,H,w,fe),w.onAfterRender(g,U,W,Y,H,fe)}function qa(w,U,W){U.isScene!==!0&&(U=Re);const Y=Be.get(w),H=m.state.lights,fe=m.state.shadowsArray,Se=H.state.version,Te=ye.getParameters(w,H.state,fe,U,W),Le=ye.getProgramCacheKey(Te);let Ge=Y.programs;Y.environment=w.isMeshStandardMaterial?U.environment:null,Y.fog=U.fog,Y.envMap=(w.isMeshStandardMaterial?V:M).get(w.envMap||Y.environment),Ge===void 0&&(w.addEventListener("dispose",he),Ge=new Map,Y.programs=Ge);let Ie=Ge.get(Le);if(Ie!==void 0){if(Y.currentProgram===Ie&&Y.lightsStateVersion===Se)return md(w,Te),Ie}else Te.uniforms=ye.getUniforms(w),w.onBuild(W,Te,g),w.onBeforeCompile(Te,g),Ie=ye.acquireProgram(Te,Le),Ge.set(Le,Ie),Y.uniforms=Te.uniforms;const Ue=Y.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(Ue.clippingPlanes=ze.uniform),md(w,Te),Y.needsLights=r_(w),Y.lightsStateVersion=Se,Y.needsLights&&(Ue.ambientLightColor.value=H.state.ambient,Ue.lightProbe.value=H.state.probe,Ue.directionalLights.value=H.state.directional,Ue.directionalLightShadows.value=H.state.directionalShadow,Ue.spotLights.value=H.state.spot,Ue.spotLightShadows.value=H.state.spotShadow,Ue.rectAreaLights.value=H.state.rectArea,Ue.ltc_1.value=H.state.rectAreaLTC1,Ue.ltc_2.value=H.state.rectAreaLTC2,Ue.pointLights.value=H.state.point,Ue.pointLightShadows.value=H.state.pointShadow,Ue.hemisphereLights.value=H.state.hemi,Ue.directionalShadowMap.value=H.state.directionalShadowMap,Ue.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ue.spotShadowMap.value=H.state.spotShadowMap,Ue.spotLightMatrix.value=H.state.spotLightMatrix,Ue.spotLightMap.value=H.state.spotLightMap,Ue.pointShadowMap.value=H.state.pointShadowMap,Ue.pointShadowMatrix.value=H.state.pointShadowMatrix),Y.currentProgram=Ie,Y.uniformsList=null,Ie}function pd(w){if(w.uniformsList===null){const U=w.currentProgram.getUniforms();w.uniformsList=Zo.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function md(w,U){const W=Be.get(w);W.outputColorSpace=U.outputColorSpace,W.batching=U.batching,W.instancing=U.instancing,W.instancingColor=U.instancingColor,W.skinning=U.skinning,W.morphTargets=U.morphTargets,W.morphNormals=U.morphNormals,W.morphColors=U.morphColors,W.morphTargetsCount=U.morphTargetsCount,W.numClippingPlanes=U.numClippingPlanes,W.numIntersection=U.numClipIntersection,W.vertexAlphas=U.vertexAlphas,W.vertexTangents=U.vertexTangents,W.toneMapping=U.toneMapping}function n_(w,U,W,Y,H){U.isScene!==!0&&(U=Re),R.resetTextureUnits();const fe=U.fog,Se=Y.isMeshStandardMaterial?U.environment:null,Te=A===null?g.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:wi,Le=(Y.isMeshStandardMaterial?V:M).get(Y.envMap||Se),Ge=Y.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ie=!!W.attributes.tangent&&(!!Y.normalMap||Y.anisotropy>0),Ue=!!W.morphAttributes.position,Mt=!!W.morphAttributes.normal,gn=!!W.morphAttributes.color;let Nt=$i;Y.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(Nt=g.toneMapping);const si=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ft=si!==void 0?si.length:0,We=Be.get(Y),Kl=m.state.lights;if(J===!0&&(ce===!0||w!==S)){const An=w===S&&Y.id===I;ze.setState(Y,w,An)}let xt=!1;Y.version===We.__version?(We.needsLights&&We.lightsStateVersion!==Kl.state.version||We.outputColorSpace!==Te||H.isBatchedMesh&&We.batching===!1||!H.isBatchedMesh&&We.batching===!0||H.isInstancedMesh&&We.instancing===!1||!H.isInstancedMesh&&We.instancing===!0||H.isSkinnedMesh&&We.skinning===!1||!H.isSkinnedMesh&&We.skinning===!0||H.isInstancedMesh&&We.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&We.instancingColor===!1&&H.instanceColor!==null||We.envMap!==Le||Y.fog===!0&&We.fog!==fe||We.numClippingPlanes!==void 0&&(We.numClippingPlanes!==ze.numPlanes||We.numIntersection!==ze.numIntersection)||We.vertexAlphas!==Ge||We.vertexTangents!==Ie||We.morphTargets!==Ue||We.morphNormals!==Mt||We.morphColors!==gn||We.toneMapping!==Nt||De.isWebGL2===!0&&We.morphTargetsCount!==ft)&&(xt=!0):(xt=!0,We.__version=Y.version);let rr=We.currentProgram;xt===!0&&(rr=qa(Y,U,H));let gd=!1,Ws=!1,Zl=!1;const zt=rr.getUniforms(),sr=We.uniforms;if(xe.useProgram(rr.program)&&(gd=!0,Ws=!0,Zl=!0),Y.id!==I&&(I=Y.id,Ws=!0),gd||S!==w){zt.setValue(G,"projectionMatrix",w.projectionMatrix),zt.setValue(G,"viewMatrix",w.matrixWorldInverse);const An=zt.map.cameraPosition;An!==void 0&&An.setValue(G,Oe.setFromMatrixPosition(w.matrixWorld)),De.logarithmicDepthBuffer&&zt.setValue(G,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(Y.isMeshPhongMaterial||Y.isMeshToonMaterial||Y.isMeshLambertMaterial||Y.isMeshBasicMaterial||Y.isMeshStandardMaterial||Y.isShaderMaterial)&&zt.setValue(G,"isOrthographic",w.isOrthographicCamera===!0),S!==w&&(S=w,Ws=!0,Zl=!0)}if(H.isSkinnedMesh){zt.setOptional(G,H,"bindMatrix"),zt.setOptional(G,H,"bindMatrixInverse");const An=H.skeleton;An&&(De.floatVertexTextures?(An.boneTexture===null&&An.computeBoneTexture(),zt.setValue(G,"boneTexture",An.boneTexture,R)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}H.isBatchedMesh&&(zt.setOptional(G,H,"batchingTexture"),zt.setValue(G,"batchingTexture",H._matricesTexture,R));const Ql=W.morphAttributes;if((Ql.position!==void 0||Ql.normal!==void 0||Ql.color!==void 0&&De.isWebGL2===!0)&&Xe.update(H,W,rr),(Ws||We.receiveShadow!==H.receiveShadow)&&(We.receiveShadow=H.receiveShadow,zt.setValue(G,"receiveShadow",H.receiveShadow)),Y.isMeshGouraudMaterial&&Y.envMap!==null&&(sr.envMap.value=Le,sr.flipEnvMap.value=Le.isCubeTexture&&Le.isRenderTargetTexture===!1?-1:1),Ws&&(zt.setValue(G,"toneMappingExposure",g.toneMappingExposure),We.needsLights&&i_(sr,Zl),fe&&Y.fog===!0&&de.refreshFogUniforms(sr,fe),de.refreshMaterialUniforms(sr,Y,K,j,me),Zo.upload(G,pd(We),sr,R)),Y.isShaderMaterial&&Y.uniformsNeedUpdate===!0&&(Zo.upload(G,pd(We),sr,R),Y.uniformsNeedUpdate=!1),Y.isSpriteMaterial&&zt.setValue(G,"center",H.center),zt.setValue(G,"modelViewMatrix",H.modelViewMatrix),zt.setValue(G,"normalMatrix",H.normalMatrix),zt.setValue(G,"modelMatrix",H.matrixWorld),Y.isShaderMaterial||Y.isRawShaderMaterial){const An=Y.uniformsGroups;for(let Jl=0,s_=An.length;Jl<s_;Jl++)if(De.isWebGL2){const _d=An[Jl];Ze.update(_d,rr),Ze.bind(_d,rr)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return rr}function i_(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function r_(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(w,U,W){Be.get(w.texture).__webglTexture=U,Be.get(w.depthTexture).__webglTexture=W;const Y=Be.get(w);Y.__hasExternalTextures=!0,Y.__hasExternalTextures&&(Y.__autoAllocateDepthBuffer=W===void 0,Y.__autoAllocateDepthBuffer||Ee.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Y.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(w,U){const W=Be.get(w);W.__webglFramebuffer=U,W.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,W=0){A=w,C=U,T=W;let Y=!0,H=null,fe=!1,Se=!1;if(w){const Le=Be.get(w);Le.__useDefaultFramebuffer!==void 0?(xe.bindFramebuffer(G.FRAMEBUFFER,null),Y=!1):Le.__webglFramebuffer===void 0?R.setupRenderTarget(w):Le.__hasExternalTextures&&R.rebindTextures(w,Be.get(w.texture).__webglTexture,Be.get(w.depthTexture).__webglTexture);const Ge=w.texture;(Ge.isData3DTexture||Ge.isDataArrayTexture||Ge.isCompressedArrayTexture)&&(Se=!0);const Ie=Be.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Ie[U])?H=Ie[U][W]:H=Ie[U],fe=!0):De.isWebGL2&&w.samples>0&&R.useMultisampledRTT(w)===!1?H=Be.get(w).__webglMultisampledFramebuffer:Array.isArray(Ie)?H=Ie[W]:H=Ie,E.copy(w.viewport),F.copy(w.scissor),z=w.scissorTest}else E.copy(B).multiplyScalar(K).floor(),F.copy($).multiplyScalar(K).floor(),z=Q;if(xe.bindFramebuffer(G.FRAMEBUFFER,H)&&De.drawBuffers&&Y&&xe.drawBuffers(w,H),xe.viewport(E),xe.scissor(F),xe.setScissorTest(z),fe){const Le=Be.get(w.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+U,Le.__webglTexture,W)}else if(Se){const Le=Be.get(w.texture),Ge=U||0;G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,Le.__webglTexture,W||0,Ge)}I=-1},this.readRenderTargetPixels=function(w,U,W,Y,H,fe,Se){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Te=Be.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&Se!==void 0&&(Te=Te[Se]),Te){xe.bindFramebuffer(G.FRAMEBUFFER,Te);try{const Le=w.texture,Ge=Le.format,Ie=Le.type;if(Ge!==jn&&ve.convert(Ge)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ue=Ie===Ba&&(Ee.has("EXT_color_buffer_half_float")||De.isWebGL2&&Ee.has("EXT_color_buffer_float"));if(Ie!==Ki&&ve.convert(Ie)!==G.getParameter(G.IMPLEMENTATION_COLOR_READ_TYPE)&&!(Ie===Bi&&(De.isWebGL2||Ee.has("OES_texture_float")||Ee.has("WEBGL_color_buffer_float")))&&!Ue){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=w.width-Y&&W>=0&&W<=w.height-H&&G.readPixels(U,W,Y,H,ve.convert(Ge),ve.convert(Ie),fe)}finally{const Le=A!==null?Be.get(A).__webglFramebuffer:null;xe.bindFramebuffer(G.FRAMEBUFFER,Le)}}},this.copyFramebufferToTexture=function(w,U,W=0){const Y=Math.pow(2,-W),H=Math.floor(U.image.width*Y),fe=Math.floor(U.image.height*Y);R.setTexture2D(U,0),G.copyTexSubImage2D(G.TEXTURE_2D,W,0,0,w.x,w.y,H,fe),xe.unbindTexture()},this.copyTextureToTexture=function(w,U,W,Y=0){const H=U.image.width,fe=U.image.height,Se=ve.convert(W.format),Te=ve.convert(W.type);R.setTexture2D(W,0),G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,W.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,W.unpackAlignment),U.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,Y,w.x,w.y,H,fe,Se,Te,U.image.data):U.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,Y,w.x,w.y,U.mipmaps[0].width,U.mipmaps[0].height,Se,U.mipmaps[0].data):G.texSubImage2D(G.TEXTURE_2D,Y,w.x,w.y,Se,Te,U.image),Y===0&&W.generateMipmaps&&G.generateMipmap(G.TEXTURE_2D),xe.unbindTexture()},this.copyTextureToTexture3D=function(w,U,W,Y,H=0){if(g.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const fe=w.max.x-w.min.x+1,Se=w.max.y-w.min.y+1,Te=w.max.z-w.min.z+1,Le=ve.convert(Y.format),Ge=ve.convert(Y.type);let Ie;if(Y.isData3DTexture)R.setTexture3D(Y,0),Ie=G.TEXTURE_3D;else if(Y.isDataArrayTexture||Y.isCompressedArrayTexture)R.setTexture2DArray(Y,0),Ie=G.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}G.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,Y.flipY),G.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),G.pixelStorei(G.UNPACK_ALIGNMENT,Y.unpackAlignment);const Ue=G.getParameter(G.UNPACK_ROW_LENGTH),Mt=G.getParameter(G.UNPACK_IMAGE_HEIGHT),gn=G.getParameter(G.UNPACK_SKIP_PIXELS),Nt=G.getParameter(G.UNPACK_SKIP_ROWS),si=G.getParameter(G.UNPACK_SKIP_IMAGES),ft=W.isCompressedTexture?W.mipmaps[H]:W.image;G.pixelStorei(G.UNPACK_ROW_LENGTH,ft.width),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ft.height),G.pixelStorei(G.UNPACK_SKIP_PIXELS,w.min.x),G.pixelStorei(G.UNPACK_SKIP_ROWS,w.min.y),G.pixelStorei(G.UNPACK_SKIP_IMAGES,w.min.z),W.isDataTexture||W.isData3DTexture?G.texSubImage3D(Ie,H,U.x,U.y,U.z,fe,Se,Te,Le,Ge,ft.data):W.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),G.compressedTexSubImage3D(Ie,H,U.x,U.y,U.z,fe,Se,Te,Le,ft.data)):G.texSubImage3D(Ie,H,U.x,U.y,U.z,fe,Se,Te,Le,Ge,ft),G.pixelStorei(G.UNPACK_ROW_LENGTH,Ue),G.pixelStorei(G.UNPACK_IMAGE_HEIGHT,Mt),G.pixelStorei(G.UNPACK_SKIP_PIXELS,gn),G.pixelStorei(G.UNPACK_SKIP_ROWS,Nt),G.pixelStorei(G.UNPACK_SKIP_IMAGES,si),H===0&&Y.generateMipmaps&&G.generateMipmap(Ie),xe.unbindTexture()},this.initTexture=function(w){w.isCubeTexture?R.setTextureCube(w,0):w.isData3DTexture?R.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?R.setTexture2DArray(w,0):R.setTexture2D(w,0),xe.unbindTexture()},this.resetState=function(){C=0,T=0,A=null,xe.reset(),ke.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return vi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===od?"display-p3":"srgb",t.unpackColorSpace=et.workingColorSpace===Xl?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===kt?Ar:Ag}set outputEncoding(e){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=e===Ar?kt:wi}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(e){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=e}}class BT extends qg{}BT.prototype.isWebGL1Renderer=!0;class ud{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new qe(e),this.density=t}clone(){return new ud(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class zT extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t}}class GT{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ah,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Zi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Kt=new P;class bl{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)Kt.fromBufferAttribute(this,t),Kt.applyMatrix4(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Kt.fromBufferAttribute(this,t),Kt.applyNormalMatrix(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Kt.fromBufferAttribute(this,t),Kt.transformDirection(e),this.setXYZ(t,Kt.x,Kt.y,Kt.z);return this}setX(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=tt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=mi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=mi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=mi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=mi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),i=tt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),i=tt(i,this.array),r=tt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=tt(t,this.array),i=tt(i,this.array),r=tt(r,this.array),s=tt(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new qn(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new bl(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class $g extends Fr{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new qe(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let ns;const ia=new P,is=new P,rs=new P,ss=new Ce,ra=new Ce,Kg=new St,Uo=new P,sa=new P,Oo=new P,Xp=new Ce,iu=new Ce,Yp=new Ce;class HT extends bt{constructor(e=new $g){if(super(),this.isSprite=!0,this.type="Sprite",ns===void 0){ns=new Zn;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),i=new GT(t,5);ns.setIndex([0,1,2,0,2,3]),ns.setAttribute("position",new bl(i,3,0,!1)),ns.setAttribute("uv",new bl(i,2,3,!1))}this.geometry=ns,this.material=e,this.center=new Ce(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),is.setFromMatrixScale(this.matrixWorld),Kg.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),rs.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&is.multiplyScalar(-rs.z);const i=this.material.rotation;let r,s;i!==0&&(s=Math.cos(i),r=Math.sin(i));const a=this.center;ko(Uo.set(-.5,-.5,0),rs,a,is,r,s),ko(sa.set(.5,-.5,0),rs,a,is,r,s),ko(Oo.set(.5,.5,0),rs,a,is,r,s),Xp.set(0,0),iu.set(1,0),Yp.set(1,1);let o=e.ray.intersectTriangle(Uo,sa,Oo,!1,ia);if(o===null&&(ko(sa.set(-.5,.5,0),rs,a,is,r,s),iu.set(0,1),o=e.ray.intersectTriangle(Uo,Oo,sa,!1,ia),o===null))return;const l=e.ray.origin.distanceTo(ia);l<e.near||l>e.far||t.push({distance:l,point:ia.clone(),uv:Ln.getInterpolation(ia,Uo,sa,Oo,Xp,iu,Yp,new Ce),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function ko(n,e,t,i,r,s){ss.subVectors(n,t).addScalar(.5).multiply(i),r!==void 0?(ra.x=s*ss.x-r*ss.y,ra.y=r*ss.x+s*ss.y):ra.copy(ss),n.copy(e),n.x+=ra.x,n.y+=ra.y,n.applyMatrix4(Kg)}class Zg extends Fr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const qp=new P,$p=new P,Kp=new St,ru=new ql,Fo=new Yl;class VT extends bt{constructor(e=new Zn,t=new Zg){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)qp.fromBufferAttribute(t,r-1),$p.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=qp.distanceTo($p);e.setAttribute("lineDistance",new $n(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Fo.copy(i.boundingSphere),Fo.applyMatrix4(r),Fo.radius+=s,e.ray.intersectsSphere(Fo)===!1)return;Kp.copy(r).invert(),ru.copy(e.ray).applyMatrix4(Kp);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=new P,h=new P,f=new P,d=new P,p=this.isLineSegments?2:1,v=i.index,m=i.attributes.position;if(v!==null){const u=Math.max(0,a.start),_=Math.min(v.count,a.start+a.count);for(let g=u,y=_-1;g<y;g+=p){const C=v.getX(g),T=v.getX(g+1);if(c.fromBufferAttribute(m,C),h.fromBufferAttribute(m,T),ru.distanceSqToSegment(c,h,d,f)>l)continue;d.applyMatrix4(this.matrixWorld);const I=e.ray.origin.distanceTo(d);I<e.near||I>e.far||t.push({distance:I,point:f.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}else{const u=Math.max(0,a.start),_=Math.min(m.count,a.start+a.count);for(let g=u,y=_-1;g<y;g+=p){if(c.fromBufferAttribute(m,g),h.fromBufferAttribute(m,g+1),ru.distanceSqToSegment(c,h,d,f)>l)continue;d.applyMatrix4(this.matrixWorld);const T=e.ray.origin.distanceTo(d);T<e.near||T>e.far||t.push({distance:T,point:f.clone().applyMatrix4(this.matrixWorld),index:g,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}class ur extends mn{constructor(e,t,i,r,s,a,o,l,c){super(e,t,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class cn extends Zn{constructor(e=1,t=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],f=[],d=[],p=[];let v=0;const x=[],m=i/2;let u=0;_(),a===!1&&(e>0&&g(!0),t>0&&g(!1)),this.setIndex(h),this.setAttribute("position",new $n(f,3)),this.setAttribute("normal",new $n(d,3)),this.setAttribute("uv",new $n(p,2));function _(){const y=new P,C=new P;let T=0;const A=(t-e)/i;for(let I=0;I<=s;I++){const S=[],E=I/s,F=E*(t-e)+e;for(let z=0;z<=r;z++){const q=z/r,L=q*l+o,k=Math.sin(L),j=Math.cos(L);C.x=F*k,C.y=-E*i+m,C.z=F*j,f.push(C.x,C.y,C.z),y.set(k,A,j).normalize(),d.push(y.x,y.y,y.z),p.push(q,1-E),S.push(v++)}x.push(S)}for(let I=0;I<r;I++)for(let S=0;S<s;S++){const E=x[S][I],F=x[S+1][I],z=x[S+1][I+1],q=x[S][I+1];h.push(E,F,q),h.push(F,z,q),T+=6}c.addGroup(u,T,0),u+=T}function g(y){const C=v,T=new Ce,A=new P;let I=0;const S=y===!0?e:t,E=y===!0?1:-1;for(let z=1;z<=r;z++)f.push(0,m*E,0),d.push(0,E,0),p.push(.5,.5),v++;const F=v;for(let z=0;z<=r;z++){const L=z/r*l+o,k=Math.cos(L),j=Math.sin(L);A.x=S*j,A.y=m*E,A.z=S*k,f.push(A.x,A.y,A.z),d.push(0,E,0),T.x=k*.5+.5,T.y=j*.5*E+.5,p.push(T.x,T.y),v++}for(let z=0;z<r;z++){const q=C+z,L=F+z;y===!0?h.push(L,L+1,q):h.push(L+1,L,q),I+=3}c.addGroup(u,I,y===!0?1:2),u+=I}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class lt extends Fr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Rg,this.normalScale=new Ce(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class hd extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}class WT extends hd{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const su=new St,Zp=new P,Qp=new P;class Qg{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ce(512,512),this.map=null,this.mapPass=null,this.matrix=new St,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ld,this._frameExtents=new Ce(1,1),this._viewportCount=1,this._viewports=[new ht(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Zp.setFromMatrixPosition(e.matrixWorld),t.position.copy(Zp),Qp.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Qp),t.updateMatrixWorld(),su.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(su),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(su)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Jp=new St,aa=new P,au=new P;class jT extends Qg{constructor(){super(new yn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ce(4,2),this._viewportCount=6,this._viewports=[new ht(2,1,1,1),new ht(0,1,1,1),new ht(3,1,1,1),new ht(1,1,1,1),new ht(3,0,1,1),new ht(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),aa.setFromMatrixPosition(e.matrixWorld),i.position.copy(aa),au.copy(i.position),au.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(au),i.updateMatrixWorld(),r.makeTranslation(-aa.x,-aa.y,-aa.z),Jp.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jp)}}class Jg extends hd{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new jT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class XT extends Qg{constructor(){super(new Gg(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class YT extends hd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new XT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class qT{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=em(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=em();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function em(){return(typeof performance>"u"?Date:performance).now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:sd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=sd);class _r{static createCanvas(e,t){const i=document.createElement("canvas");i.width=e,i.height=t;const r=i.getContext("2d");return{canvas:i,ctx:r}}static getSandstoneWall(){const e="sandstone_wall";if(this.cache.has(e))return this.cache.get(e);const{canvas:t,ctx:i}=this.createCanvas(512,512);i.fillStyle="#d6b887",i.fillRect(0,0,512,512);const r=i.getImageData(0,0,512,512),s=r.data;for(let c=0;c<s.length;c+=4){const h=(Math.random()-.5)*35;s[c]=Math.min(255,Math.max(0,s[c]+h)),s[c+1]=Math.min(255,Math.max(0,s[c+1]+h*.9)),s[c+2]=Math.min(255,Math.max(0,s[c+2]+h*.7))}i.putImageData(r,0,0),i.strokeStyle="#8f7756",i.lineWidth=4;const a=8,o=512/a;for(let c=0;c<=a;c++){const h=c*o;if(i.beginPath(),i.moveTo(0,h),i.lineTo(512,h),i.stroke(),c<a){const p=c%2*64;for(let v=0;v<=5;v++){const x=v*128-p;i.beginPath(),i.moveTo(x,h),i.lineTo(x,h+o),i.stroke(),i.strokeStyle="rgba(255, 240, 210, 0.2)",i.lineWidth=2,i.beginPath(),i.moveTo(x+2,h+2),i.lineTo(x+128-p-2,h+2),i.stroke(),i.strokeStyle="#8f7756",i.lineWidth=4}}}const l=new ur(t);return l.wrapS=Sr,l.wrapT=Sr,this.cache.set(e,l),l}static getSandGround(){const e="sand_ground";if(this.cache.has(e))return this.cache.get(e);const{canvas:t,ctx:i}=this.createCanvas(512,512);i.fillStyle="#cfb07e",i.fillRect(0,0,512,512);const r=i.getImageData(0,0,512,512),s=r.data;for(let o=0;o<s.length;o+=4){const l=(Math.random()-.5)*45;s[o]=Math.min(255,Math.max(0,s[o]+l)),s[o+1]=Math.min(255,Math.max(0,s[o+1]+l*.9)),s[o+2]=Math.min(255,Math.max(0,s[o+2]+l*.7))}i.putImageData(r,0,0),i.strokeStyle="rgba(100, 80, 55, 0.15)",i.lineWidth=6,i.beginPath(),i.moveTo(30,0),i.bezierCurveTo(150,200,350,300,480,512),i.stroke();const a=new ur(t);return a.wrapS=Sr,a.wrapT=Sr,this.cache.set(e,a),a}static getWoodCrate(){const e="wood_crate";if(this.cache.has(e))return this.cache.get(e);const{canvas:t,ctx:i}=this.createCanvas(512,512);i.fillStyle="#a67843",i.fillRect(0,0,512,512),i.fillStyle="#8e6231";for(let l=0;l<512;l+=64)i.fillRect(0,l,512,4);const r=i.getImageData(0,0,512,512),s=r.data;for(let l=0;l<s.length;l+=4){const c=(Math.random()-.5)*30;s[l]=Math.min(255,Math.max(0,s[l]+c)),s[l+1]=Math.min(255,Math.max(0,s[l+1]+c*.8)),s[l+2]=Math.min(255,Math.max(0,s[l+2]+c*.6))}i.putImageData(r,0,0),i.fillStyle="#4a4238",i.fillRect(0,0,512,32),i.fillRect(0,480,512,32),i.fillRect(0,0,32,512),i.fillRect(480,0,32,512),i.strokeStyle="#4a4238",i.lineWidth=28,i.beginPath(),i.moveTo(32,32),i.lineTo(480,480),i.stroke(),i.fillStyle="#222",[[16,16],[496,16],[16,496],[496,496],[256,16],[256,496],[16,256],[496,256]].forEach(([l,c])=>{i.beginPath(),i.arc(l,c,6,0,Math.PI*2),i.fill()});const o=new ur(t);return this.cache.set(e,o),o}static getMetalDoor(){const e="metal_door";if(this.cache.has(e))return this.cache.get(e);const{canvas:t,ctx:i}=this.createCanvas(512,512);i.fillStyle="#44564c",i.fillRect(0,0,512,512);const r=i.getImageData(0,0,512,512),s=r.data;for(let o=0;o<s.length;o+=4){const l=(Math.random()-.5)*50;s[o]=Math.min(255,Math.max(0,s[o]+l+15)),s[o+1]=Math.min(255,Math.max(0,s[o+1]+l)),s[o+2]=Math.min(255,Math.max(0,s[o+2]+l*.8))}i.putImageData(r,0,0),i.strokeStyle="#28362e",i.lineWidth=10,i.strokeRect(20,20,472,472),i.strokeRect(40,40,432,200),i.strokeRect(40,270,432,200),i.fillStyle="#1b241f";for(let o=30;o<500;o+=80)i.beginPath(),i.arc(30,o,5,0,Math.PI*2),i.arc(482,o,5,0,Math.PI*2),i.fill();const a=new ur(t);return this.cache.set(e,a),a}static getSiteDecal(e){const t=`site_decal_${e}`;if(this.cache.has(t))return this.cache.get(t);const{canvas:i,ctx:r}=this.createCanvas(256,256);r.clearRect(0,0,256,256),r.fillStyle="#dc2626",r.font='bold 160px "Chakra Petch", sans-serif',r.textAlign="center",r.textBaseline="middle",r.shadowColor="#b91c1c",r.shadowBlur=15,r.fillText(e,128,128),r.strokeStyle="#dc2626",r.lineWidth=8,r.beginPath(),r.arc(128,128,105,0,Math.PI*2),r.stroke();const s=new ur(i);return this.cache.set(t,s),s}static getMuzzleFlash(){const e="muzzle_flash";if(this.cache.has(e))return this.cache.get(e);const{canvas:t,ctx:i}=this.createCanvas(128,128),r=i.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,"rgba(255, 255, 220, 1.0)"),r.addColorStop(.3,"rgba(255, 180, 50, 0.8)"),r.addColorStop(.7,"rgba(255, 80, 10, 0.4)"),r.addColorStop(1,"rgba(255, 40, 0, 0)"),i.fillStyle=r,i.fillRect(0,0,128,128);const s=new ur(t);return this.cache.set(e,s),s}static getBulletHole(){const e="bullet_hole";if(this.cache.has(e))return this.cache.get(e);const{canvas:t,ctx:i}=this.createCanvas(64,64),r=i.createRadialGradient(32,32,0,32,32,30);r.addColorStop(0,"#111"),r.addColorStop(.3,"#262626"),r.addColorStop(.6,"#404040"),r.addColorStop(1,"rgba(0,0,0,0)"),i.fillStyle=r,i.fillRect(0,0,64,64);const s=new ur(t);return this.cache.set(e,s),s}}Z(_r,"cache",new Map);class $T{constructor(){Z(this,"group");Z(this,"colliders",[]);Z(this,"siteAZone");Z(this,"siteBZone");Z(this,"sandMat");Z(this,"wallMat");Z(this,"crateMat");Z(this,"doorMat");Z(this,"darkTunnelMat");this.group=new He;const e=_r.getSandGround();e.repeat.set(24,24),this.sandMat=new lt({map:e,roughness:.9,metalness:.05});const t=_r.getSandstoneWall();t.repeat.set(4,2),this.wallMat=new lt({map:t,roughness:.85,metalness:.1});const i=_r.getWoodCrate();this.crateMat=new lt({map:i,roughness:.75,metalness:.1});const r=_r.getMetalDoor();this.doorMat=new lt({map:r,roughness:.5,metalness:.6}),this.darkTunnelMat=new lt({color:4011307,roughness:.95,metalness:.05}),this.siteAZone=new tn(new P(15,0,-50),new P(35,6,-30)),this.siteBZone=new tn(new P(-55,0,-45),new P(-35,6,-25)),this.buildMap()}addBlock(e,t,i,r,s,a,o,l="concrete",c=1,h=1){const f=new ae(r,s,a),d=new ee(f,o);d.position.set(e,t+s/2,i),d.castShadow=!0,d.receiveShadow=!0,this.group.add(d);const p=r/2,v=a/2,x=new tn(new P(e-p,t,i-v),new P(e+p,t+s,i+v));return this.colliders.push({box:x,type:l==="wood"?"crate":l==="metal"?"door":"wall",materialType:l,mesh:d}),d}buildMap(){const e=new Ur(240,240),t=new ee(e,this.sandMat);t.rotation.x=-Math.PI/2,t.position.set(0,0,0),t.receiveShadow=!0,this.group.add(t),this.colliders.push({box:new tn(new P(-120,-10,-120),new P(120,0,120)),type:"ground",materialType:"concrete"});const i=8;this.addBlock(0,0,75,140,i,4,this.wallMat),this.addBlock(0,0,-75,140,i,4,this.wallMat),this.addBlock(70,0,0,4,i,150,this.wallMat),this.addBlock(-70,0,0,4,i,150,this.wallMat),this.addBlock(-20,0,60,4,i,26,this.wallMat),this.addBlock(20,0,60,4,i,26,this.wallMat),this.addBlock(-8,0,58,2.5,2.5,2.5,this.crateMat,"wood"),this.addBlock(10,0,55,3,2,2,this.crateMat,"wood"),this.addBlock(-6,0,35,2,i,25,this.wallMat),this.addBlock(6,0,35,2,i,25,this.wallMat),this.addBlock(32,0,55,20,i,4,this.wallMat),this.addBlock(28,0,42,3,i,1,this.doorMat,"metal"),this.addBlock(36,0,42,3,i,1,this.doorMat,"metal"),this.addBlock(22,0,35,2,i,20,this.wallMat),this.addBlock(42,0,35,2,i,20,this.wallMat),this.addBlock(32,i-1,35,20,2,20,this.wallMat),this.addBlock(42,0,0,4,i,50,this.wallMat),this.addBlock(26,0,10,4,i,30,this.wallMat),this.addBlock(48,0,25,12,1.5,14,this.wallMat),this.addBlock(45,0,28,6,1.2,4,this.crateMat,"wood"),this.addBlock(36,0,2,3,3,6,this.doorMat,"metal"),this.addBlock(38,0,-15,3.5,3,3.5,this.crateMat,"wood"),this.addBlock(30,0,-28,8,1.5,10,this.wallMat),this.addBlock(24,0,-42,20,1.6,22,this.wallMat),this.addSiteDecal(24,1.65,-42,"A"),this.addBlock(22,1.6,-42,2.5,2.5,2.5,this.crateMat,"wood"),this.addBlock(22,4.1,-42,2.2,2.2,2.2,this.crateMat,"wood"),this.addBlock(25,1.6,-42,2.5,2.5,2.5,this.crateMat,"wood"),this.addBlock(20,1.6,-38,2.2,2.2,2.2,this.crateMat,"wood"),this.addBlock(24,0,-56,24,i,4,this.wallMat),this.addBlock(38,0,-42,4,i,26,this.wallMat),this.addBlock(14,0,-46,6,.8,12,this.wallMat),this.addBlock(10,0,12,4,i,28,this.wallMat),this.addBlock(-8,0,15,4,i,24,this.wallMat),this.addBlock(4,0,4,3.2,3.2,3.2,this.crateMat,"wood"),this.addBlock(-2.8,0,-12,3.6,i,.8,this.doorMat,"metal"),this.addBlock(3.2,0,-11.5,3.4,i,.8,this.doorMat,"metal"),this.addBlock(0,5.5,-12,12,2.5,2,this.wallMat),this.addBlock(11,0,-10,5,3.5,22,this.wallMat),this.addBlock(8,0,2,4,1.8,4,this.wallMat),this.addBlock(14,0,-26,8,3.5,12,this.wallMat),this.addBlock(16,0,-32,6,2.2,6,this.wallMat),this.addBlock(6,3.5,-22,2,5,20,this.wallMat),this.addBlock(-18,0,10,16,i,4,this.darkTunnelMat),this.addBlock(-18,0,2,16,i,4,this.darkTunnelMat),this.addBlock(-18,i-1,6,16,2,12,this.darkTunnelMat),this.addBlock(-32,0,15,4,i,35,this.darkTunnelMat),this.addBlock(-46,0,15,4,i,35,this.darkTunnelMat),this.addBlock(-39,i-1,15,16,2,35,this.darkTunnelMat),this.addBlock(-39,0,-3,12,1.5,8,this.darkTunnelMat),this.addBlock(-30,0,-20,4,i,18,this.wallMat),this.addBlock(-62,0,-35,4,i,34,this.wallMat),this.addBlock(-45,0,-52,36,i,4,this.wallMat),this.addBlock(-50,0,-38,16,1.5,18,this.wallMat),this.addSiteDecal(-44,1.55,-34,"B"),this.addBlock(-45,0,-32,2.5,2.5,2.5,this.crateMat,"wood"),this.addBlock(-45,2.5,-32,2.2,2.2,2.2,this.crateMat,"wood"),this.addBlock(-42,0,-32,2.5,2.5,2.5,this.crateMat,"wood"),this.addBlock(-52,1.5,-42,3,2.5,3,this.crateMat,"wood"),this.addBlock(-38,0,-42,2.5,2.5,2.5,this.crateMat,"wood"),this.addBlock(-28,2.5,-28,4,3,4,this.wallMat),this.addBlock(-28,0,-28,4,2.5,4,this.wallMat),this.addBlock(-30,0,-38,1,i,3.5,this.doorMat,"metal"),this.addBlock(0,0,-60,30,i,4,this.wallMat),this.addBlock(-15,0,-50,4,i,20,this.wallMat),this.addBlock(0,0,-48,4,2.5,4,this.crateMat,"wood"),this.addBlock(-6,0,-30,4,i,22,this.wallMat)}addSiteDecal(e,t,i,r){const s=_r.getSiteDecal(r),a=new Dr({map:s,transparent:!0,depthWrite:!1}),o=new Ur(6,6),l=new ee(o,a);l.rotation.x=-Math.PI/2,l.position.set(e,t+.02,i),this.group.add(l)}raycast(e,t,i=200){const r=new ql(e,t.clone().normalize());let s=i,a=null;const o=new P;for(const l of this.colliders)if(r.intersectBox(l.box,o)){const c=e.distanceTo(o);if(c<s){s=c;const h=new P,f=l.box.getCenter(new P),d=l.box.getSize(new P),p=o.clone().sub(f);p.x/=d.x/2,p.y/=d.y/2,p.z/=d.z/2;const v=Math.abs(p.x),x=Math.abs(p.y),m=Math.abs(p.z);v>x&&v>m?h.set(Math.sign(p.x),0,0):x>v&&x>m?h.set(0,Math.sign(p.y),0):h.set(0,0,Math.sign(p.z)),a={distance:c,point:o.clone(),normal:h,materialType:l.materialType||"concrete"}}}return a?{hit:!0,...a}:null}checkEntityCollision(e,t=.5,i=1.8){const r=e.clone();let s=!1,a=!1;const o=new tn(new P(r.x-t,r.y,r.z-t),new P(r.x+t,r.y+i,r.z+t));for(const l of this.colliders)if(o.intersectsBox(l.box)){const c=l.box.max.x-o.min.x,h=o.max.x-l.box.min.x,f=Math.min(c,h),d=l.box.max.z-o.min.z,p=o.max.z-l.box.min.z,v=Math.min(d,p),x=l.box.max.y-o.min.y;if(o.max.y-l.box.min.y,x<.6&&e.y>=l.box.max.y-.4){r.y=l.box.max.y,s=!0,o.min.y=r.y,o.max.y=r.y+i;continue}f<v?(c<h?r.x+=f:r.x-=f,a=!0):(d<p?r.z+=v:r.z-=v,a=!0),o.min.x=r.x-t,o.max.x=r.x+t,o.min.z=r.z-t,o.max.z=r.z+t}return r.y<=0&&(r.y=0,s=!0),{position:r,isGrounded:s,collidedWithWall:a}}getBombSiteAt(e){return this.siteAZone.containsPoint(e)?"A":this.siteBZone.containsPoint(e)?"B":null}}class KT{constructor(){Z(this,"waypoints",new Map);this.initWaypoints()}addNode(e,t,i,r,s,a=[]){this.waypoints.set(e,{id:e,position:new P(t,i,r),zone:s,connectedIds:[...a]})}connect(e,t){const i=this.waypoints.get(e),r=this.waypoints.get(t);i&&r&&(i.connectedIds.includes(t)||i.connectedIds.push(t),r.connectedIds.includes(e)||r.connectedIds.push(e))}initWaypoints(){this.addNode("T_SPAWN_1",-8,0,60,"T_SPAWN"),this.addNode("T_SPAWN_2",0,0,60,"T_SPAWN"),this.addNode("T_SPAWN_3",8,0,60,"T_SPAWN"),this.addNode("T_SPAWN_MAIN",0,0,52,"T_SPAWN"),this.connect("T_SPAWN_1","T_SPAWN_MAIN"),this.connect("T_SPAWN_2","T_SPAWN_MAIN"),this.connect("T_SPAWN_3","T_SPAWN_MAIN"),this.addNode("T_MID_TOP",0,0,42,"T_MID"),this.addNode("T_MID_SLOPE",0,0,25,"T_MID"),this.connect("T_SPAWN_MAIN","T_MID_TOP"),this.connect("T_MID_TOP","T_MID_SLOPE"),this.addNode("T_OUTSIDE_LONG",22,0,50,"OUTSIDE_LONG"),this.addNode("LONG_DOORS_T",32,0,46,"OUTSIDE_LONG"),this.addNode("LONG_DOORS_INSIDE",32,0,35,"LONG_DOORS"),this.addNode("LONG_DOORS_CORNER",36,0,24,"LONG_DOORS"),this.connect("T_SPAWN_MAIN","T_OUTSIDE_LONG"),this.connect("T_OUTSIDE_LONG","LONG_DOORS_T"),this.connect("LONG_DOORS_T","LONG_DOORS_INSIDE"),this.connect("LONG_DOORS_INSIDE","LONG_DOORS_CORNER"),this.addNode("LONG_A_CORNER",36,0,16,"LONG_A"),this.addNode("LONG_A_PIT",46,0,22,"PIT"),this.addNode("LONG_A_MIDWAY",36,0,0,"LONG_A"),this.addNode("LONG_A_CROSS",34,0,-16,"LONG_A"),this.addNode("LONG_A_RAMP",28,1,-28,"A_SITE"),this.connect("LONG_DOORS_CORNER","LONG_A_CORNER"),this.connect("LONG_A_CORNER","LONG_A_PIT"),this.connect("LONG_A_CORNER","LONG_A_MIDWAY"),this.connect("LONG_A_PIT","LONG_A_MIDWAY"),this.connect("LONG_A_MIDWAY","LONG_A_CROSS"),this.connect("LONG_A_CROSS","LONG_A_RAMP"),this.addNode("A_SITE_DEFAULT",24,1.6,-40,"A_SITE"),this.addNode("A_SITE_GOOSE",24,1.6,-50,"A_SITE"),this.addNode("A_SITE_NINJA",34,1.6,-42,"A_SITE"),this.addNode("A_SITE_SHORT_ENTRY",18,2.2,-32,"A_SITE"),this.connect("LONG_A_RAMP","A_SITE_DEFAULT"),this.connect("A_SITE_DEFAULT","A_SITE_GOOSE"),this.connect("A_SITE_DEFAULT","A_SITE_NINJA"),this.connect("A_SITE_DEFAULT","A_SITE_SHORT_ENTRY"),this.addNode("LOWER_MID",0,0,10,"MID"),this.addNode("XBOX_CORNER",4,0,4,"MID"),this.addNode("CATWALK_STAIRS",8,1.8,2,"CATWALK"),this.addNode("CATWALK_MID",11,3.5,-8,"CATWALK"),this.addNode("SHORT_A_BEND",14,3.5,-20,"SHORT_A"),this.addNode("SHORT_A_STAIRS",16,2.8,-28,"SHORT_A"),this.connect("T_MID_SLOPE","LOWER_MID"),this.connect("LOWER_MID","XBOX_CORNER"),this.connect("XBOX_CORNER","CATWALK_STAIRS"),this.connect("CATWALK_STAIRS","CATWALK_MID"),this.connect("CATWALK_MID","SHORT_A_BEND"),this.connect("SHORT_A_BEND","SHORT_A_STAIRS"),this.connect("SHORT_A_STAIRS","A_SITE_SHORT_ENTRY"),this.addNode("MID_DOORS_T_SIDE",0,0,-6,"MID"),this.addNode("MID_DOORS_GAP",0,0,-12,"MID_DOORS"),this.addNode("MID_DOORS_CT_SIDE",0,0,-18,"CT_MID"),this.connect("LOWER_MID","MID_DOORS_T_SIDE"),this.connect("MID_DOORS_T_SIDE","MID_DOORS_GAP"),this.connect("MID_DOORS_GAP","MID_DOORS_CT_SIDE"),this.addNode("LOWER_TUNNEL_MID_ENTRY",-8,0,10,"LOWER_TUNNEL"),this.addNode("LOWER_TUNNEL_MIDWAY",-18,0,6,"LOWER_TUNNEL"),this.addNode("LOWER_TUNNEL_UPPER_JUNCTION",-34,0,6,"B_TUNNEL"),this.connect("LOWER_MID","LOWER_TUNNEL_MID_ENTRY"),this.connect("LOWER_TUNNEL_MID_ENTRY","LOWER_TUNNEL_MIDWAY"),this.connect("LOWER_TUNNEL_MIDWAY","LOWER_TUNNEL_UPPER_JUNCTION"),this.addNode("UPPER_TUNNEL_T_ENTRY",-24,0,48,"B_TUNNEL"),this.addNode("UPPER_TUNNEL_SOUTH",-36,0,36,"B_TUNNEL"),this.addNode("UPPER_TUNNEL_NORTH",-36,0,16,"B_TUNNEL"),this.addNode("UPPER_TUNNEL_EXIT",-38,0,-2,"B_TUNNEL"),this.connect("T_SPAWN_1","UPPER_TUNNEL_T_ENTRY"),this.connect("UPPER_TUNNEL_T_ENTRY","UPPER_TUNNEL_SOUTH"),this.connect("UPPER_TUNNEL_SOUTH","UPPER_TUNNEL_NORTH"),this.connect("UPPER_TUNNEL_NORTH","LOWER_TUNNEL_UPPER_JUNCTION"),this.connect("LOWER_TUNNEL_UPPER_JUNCTION","UPPER_TUNNEL_EXIT"),this.addNode("B_SITE_ENTRY_RAMP",-40,0,-12,"B_SITE"),this.addNode("B_SITE_DEFAULT",-44,0,-32,"B_SITE"),this.addNode("B_SITE_BACK_PLAT",-52,1.5,-40,"B_SITE"),this.addNode("B_SITE_WINDOW",-30,2.5,-28,"B_SITE"),this.addNode("B_SITE_DOORS",-30,0,-38,"B_SITE"),this.connect("UPPER_TUNNEL_EXIT","B_SITE_ENTRY_RAMP"),this.connect("B_SITE_ENTRY_RAMP","B_SITE_DEFAULT"),this.connect("B_SITE_DEFAULT","B_SITE_BACK_PLAT"),this.connect("B_SITE_DEFAULT","B_SITE_WINDOW"),this.connect("B_SITE_DEFAULT","B_SITE_DOORS"),this.addNode("CT_MID",-8,0,-32,"CT_MID"),this.addNode("CT_SPAWN_1",-5,0,-52,"CT_SPAWN"),this.addNode("CT_SPAWN_2",0,0,-52,"CT_SPAWN"),this.addNode("CT_SPAWN_3",6,0,-52,"CT_SPAWN"),this.addNode("CT_RAMP_A",14,0,-46,"CT_SPAWN"),this.connect("MID_DOORS_CT_SIDE","CT_MID"),this.connect("CT_MID","B_SITE_DOORS"),this.connect("CT_MID","B_SITE_WINDOW"),this.connect("CT_MID","CT_SPAWN_1"),this.connect("CT_SPAWN_1","CT_SPAWN_2"),this.connect("CT_SPAWN_2","CT_SPAWN_3"),this.connect("CT_SPAWN_3","CT_RAMP_A"),this.connect("CT_RAMP_A","A_SITE_DEFAULT")}getClosestWaypoint(e){let t=null,i=1/0;for(const r of this.waypoints.values()){const s=r.position.distanceTo(e);s<i&&(i=s,t=r)}return t||this.waypoints.get("T_SPAWN_MAIN")}getWaypointsByZone(e){const t=[];for(const i of this.waypoints.values())i.zone===e&&t.push(i);return t}findPath(e,t){const i=this.getClosestWaypoint(e),r=this.getClosestWaypoint(t);if(i.id===r.id)return[t.clone()];const s=new Set([i.id]),a=new Map,o=new Map;o.set(i.id,0);const l=new Map;for(l.set(i.id,i.position.distanceTo(r.position));s.size>0;){let c="",h=1/0;for(const p of s){const v=l.get(p)??1/0;v<h&&(h=v,c=p)}if(c===r.id){const p=[t.clone()];let v=c;for(;a.has(v);){const x=this.waypoints.get(v);p.unshift(x.position.clone()),v=a.get(v)}return p}s.delete(c);const f=this.waypoints.get(c),d=o.get(c)??1/0;for(const p of f.connectedIds){const v=this.waypoints.get(p);if(!v)continue;const x=f.position.distanceTo(v.position),m=d+x;if(m<(o.get(p)??1/0)){a.set(p,c),o.set(p,m);const u=v.position.distanceTo(r.position);l.set(p,m+u),s.add(p)}}}return[t.clone()]}}class e_{constructor(e,t=!1){Z(this,"root");Z(this,"team");Z(this,"isPlayer");Z(this,"pelvis");Z(this,"torso");Z(this,"head");Z(this,"leftUpperArm");Z(this,"leftForearm");Z(this,"rightUpperArm");Z(this,"rightForearm");Z(this,"leftThigh");Z(this,"leftShin");Z(this,"rightThigh");Z(this,"rightShin");Z(this,"weaponHolder");Z(this,"weaponMeshes",new Map);Z(this,"currentWeaponId","ak47");Z(this,"animTime",0);Z(this,"isDead",!1);Z(this,"deathProgress",0);Z(this,"isShooting",!1);Z(this,"shootTimer",0);Z(this,"isReloading",!1);Z(this,"reloadTimer",0);Z(this,"hitboxes",[]);this.team=e,this.isPlayer=t,this.root=new He,this.pelvis=new He,this.torso=new He,this.head=new He,this.leftUpperArm=new He,this.leftForearm=new He,this.rightUpperArm=new He,this.rightForearm=new He,this.leftThigh=new He,this.leftShin=new He,this.rightThigh=new He,this.rightShin=new He,this.weaponHolder=new He,this.buildCharacterHierarchy(),this.buildWeaponMeshes(),this.setupHitboxes()}buildCharacterHierarchy(){const e=this.team==="CT",t=e?2570054:6122815,i=e?1845299:4864812,r=14131574,s=1515562,a=e?1779249:7232331,o=e?3049153:1710618,l=new lt({color:t,roughness:.8}),c=new lt({color:i,roughness:.7,metalness:.1}),h=new lt({color:r,roughness:.9}),f=new lt({color:s,roughness:.6}),d=new lt({color:a,roughness:.5,metalness:.2}),p=new lt({color:o,roughness:.2,metalness:.8});this.pelvis.position.set(0,.9,0);const v=new ee(new ae(.36,.2,.24),l);v.castShadow=!0,this.pelvis.add(v),this.root.add(this.pelvis);const x=new ee(new ae(.38,.08,.26),f);x.position.set(0,.06,0),this.pelvis.add(x),this.torso.position.set(0,.12,0),this.pelvis.add(this.torso);const m=new ee(new ae(.42,.45,.26),l);m.position.set(0,.22,0),m.castShadow=!0,this.torso.add(m);const u=new ee(new ae(.45,.42,.29),c);u.position.set(0,.22,0),u.castShadow=!0,this.torso.add(u);const _=new ee(new ae(.12,.14,.08),f);_.position.set(-.12,.18,.16),this.torso.add(_);const g=new ee(new ae(.12,.14,.08),f);g.position.set(.12,.18,.16),this.torso.add(g),this.head.position.set(0,.48,0),this.torso.add(this.head);const y=new ee(new cn(.08,.09,.1,8),h);y.position.set(0,.05,0),this.head.add(y);const C=new ee(new ae(.24,.26,.24),e?l:h);if(C.position.set(0,.18,0),C.castShadow=!0,this.head.add(C),e){const B=new ae(.28,.18,.28),$=new ee(B,d);$.position.set(0,.24,0),$.castShadow=!0,this.head.add($);const Q=new ee(new ae(.22,.08,.08),p);Q.position.set(0,.2,.13),this.head.add(Q);const X=new ee(new ae(.06,.1,.08),f);X.position.set(-.15,.18,0),this.head.add(X);const J=new ee(new ae(.06,.1,.08),f);J.position.set(.15,.18,0),this.head.add(J)}else{const B=new ee(new ae(.25,.2,.25),d);B.position.set(0,.17,.01),this.head.add(B);const $=new ee(new ae(.22,.06,.06),p);$.position.set(0,.21,.13),this.head.add($)}this.leftUpperArm.position.set(-.28,.38,0),this.torso.add(this.leftUpperArm);const T=new ee(new ae(.14,.26,.14),l);T.position.set(0,-.12,0),T.castShadow=!0,this.leftUpperArm.add(T),this.leftForearm.position.set(0,-.24,0),this.leftUpperArm.add(this.leftForearm);const A=new ee(new ae(.12,.24,.12),l);A.position.set(0,-.1,0),A.castShadow=!0,this.leftForearm.add(A);const I=new ee(new ae(.1,.1,.1),f);I.position.set(0,-.23,0),this.leftForearm.add(I),this.rightUpperArm.position.set(.28,.38,0),this.torso.add(this.rightUpperArm);const S=new ee(new ae(.14,.26,.14),l);S.position.set(0,-.12,0),S.castShadow=!0,this.rightUpperArm.add(S),this.rightForearm.position.set(0,-.24,0),this.rightUpperArm.add(this.rightForearm);const E=new ee(new ae(.12,.24,.12),l);E.position.set(0,-.1,0),E.castShadow=!0,this.rightForearm.add(E);const F=new ee(new ae(.1,.1,.1),f);F.position.set(0,-.23,0),this.rightForearm.add(F),this.weaponHolder.position.set(0,-.24,.15),this.weaponHolder.rotation.x=-Math.PI/2,this.rightForearm.add(this.weaponHolder),this.leftThigh.position.set(-.12,-.05,0),this.pelvis.add(this.leftThigh);const z=new ee(new ae(.16,.38,.16),l);z.position.set(0,-.18,0),z.castShadow=!0,this.leftThigh.add(z),this.leftShin.position.set(0,-.38,0),this.leftThigh.add(this.leftShin);const q=new ee(new ae(.14,.38,.14),l);q.position.set(0,-.18,0),q.castShadow=!0,this.leftShin.add(q);const L=new ee(new ae(.15,.1,.08),f);L.position.set(0,.02,.08),this.leftShin.add(L);const k=new ee(new ae(.15,.14,.22),f);k.position.set(0,-.38,.03),k.castShadow=!0,this.leftShin.add(k),this.rightThigh.position.set(.12,-.05,0),this.pelvis.add(this.rightThigh);const j=new ee(new ae(.16,.38,.16),l);j.position.set(0,-.18,0),j.castShadow=!0,this.rightThigh.add(j),this.rightShin.position.set(0,-.38,0),this.rightThigh.add(this.rightShin);const K=new ee(new ae(.14,.38,.14),l);K.position.set(0,-.18,0),K.castShadow=!0,this.rightShin.add(K);const D=new ee(new ae(.15,.1,.08),f);D.position.set(0,.02,.08),this.rightShin.add(D);const O=new ee(new ae(.15,.14,.22),f);O.position.set(0,-.38,.03),O.castShadow=!0,this.rightShin.add(O),this.setAimPosture(0,0)}buildWeaponMeshes(){const e=new lt({color:2040865,roughness:.4,metalness:.8}),t=new lt({color:7552283,roughness:.7}),i=new lt({color:4016694,roughness:.6,metalness:.3}),r=new lt({color:9072203,roughness:.9}),s=new Dr({color:2293538}),a=new lt({color:1515562,roughness:.6}),o=new He,l=new ee(new ae(.06,.1,.4),e);o.add(l);const c=new ee(new cn(.015,.015,.35,8),e);c.rotation.x=Math.PI/2,c.position.set(0,.02,.35),o.add(c);const h=new ee(new ae(.05,.12,.28),t);h.position.set(0,-.04,-.3),o.add(h);const f=new ee(new ae(.06,.08,.2),t);f.position.set(0,.02,.2),o.add(f);const d=new ee(new ae(.04,.2,.08),e);d.position.set(0,-.12,.06),d.rotation.x=.3,o.add(d),this.weaponMeshes.set("ak47",o);const p=new He,v=new ee(new ae(.06,.11,.42),e);p.add(v);const x=new ee(new cn(.018,.018,.3,8),e);x.rotation.x=Math.PI/2,x.position.set(0,.02,.32),p.add(x);const m=new ee(new ae(.05,.12,.24),e);m.position.set(0,-.02,-.28),p.add(m);const u=new ee(new ae(.04,.18,.07),e);u.position.set(0,-.12,.05),p.add(u),this.weaponMeshes.set("m4a4",p);const _=new He,g=new ee(new ae(.07,.12,.6),i);_.add(g);const y=new ee(new cn(.02,.02,.5,8),e);y.rotation.x=Math.PI/2,y.position.set(0,.02,.5),_.add(y);const C=new ee(new cn(.03,.03,.3,8),e);C.rotation.x=Math.PI/2,C.position.set(0,.11,.05),_.add(C),this.weaponMeshes.set("awp",_);const T=new He,A=new ee(new ae(.05,.08,.22),e);T.add(A);const I=new ee(new ae(.04,.14,.07),e);I.position.set(0,-.09,-.05),I.rotation.x=-.2,T.add(I),this.weaponMeshes.set("deagle",T);const S=new He,E=new ee(new ae(.045,.07,.18),e);S.add(E);const F=new ee(new ae(.04,.12,.06),e);F.position.set(0,-.08,-.04),F.rotation.x=-.2,S.add(F),this.weaponMeshes.set("glock",S);const z=new He,q=new ee(new ae(.045,.07,.18),e);z.add(q);const L=new ee(new cn(.02,.02,.16,8),e);L.rotation.x=Math.PI/2,L.position.set(0,.01,.16),z.add(L);const k=new ee(new ae(.04,.12,.06),e);k.position.set(0,-.08,-.04),k.rotation.x=-.2,z.add(k),this.weaponMeshes.set("usp",z);const j=new He,K=new ee(new ae(.02,.06,.22),e);K.position.set(0,0,.1),j.add(K);const D=new ee(new ae(.03,.05,.12),t);D.position.set(0,0,-.06),j.add(D),this.weaponMeshes.set("knife",j);const O=new He,B=new ee(new ae(.18,.12,.25),r);O.add(B);const $=new ee(new ae(.12,.02,.14),a);$.position.set(0,.06,-.02),O.add($);const Q=new ee(new Ur(.08,.04),s);Q.rotation.x=-Math.PI/2,Q.position.set(0,.075,.06),O.add(Q),this.weaponMeshes.set("c4",O),this.setWeapon(this.currentWeaponId)}setWeapon(e){for(this.currentWeaponId=e;this.weaponHolder.children.length>0;)this.weaponHolder.remove(this.weaponHolder.children[0]);const t=this.weaponMeshes.get(e);t&&this.weaponHolder.add(t)}setupHitboxes(){this.hitboxes=[{zone:"head",box:new tn,mesh:this.head,multiplier:2.5},{zone:"chest",box:new tn,mesh:this.torso,multiplier:1},{zone:"stomach",box:new tn,mesh:this.pelvis,multiplier:1.25},{zone:"arms",box:new tn,mesh:this.rightUpperArm,multiplier:1},{zone:"legs",box:new tn,mesh:this.leftThigh,multiplier:.75}]}updateHitboxes(){this.root.updateMatrixWorld(!0);const e=this.root.position,i=this.pelvis.position.y<.7?-.4:0;this.hitboxes[0].box.setFromCenterAndSize(new P(e.x,e.y+1.65+i,e.z),new P(.4,.4,.4)),this.hitboxes[1].box.setFromCenterAndSize(new P(e.x,e.y+1.25+i,e.z),new P(.55,.45,.4)),this.hitboxes[2].box.setFromCenterAndSize(new P(e.x,e.y+.9+i,e.z),new P(.5,.35,.4)),this.hitboxes[3].box.setFromCenterAndSize(new P(e.x,e.y+1.2+i,e.z),new P(.85,.45,.5)),this.hitboxes[4].box.setFromCenterAndSize(new P(e.x,e.y+.45+i/2,e.z),new P(.55,.85+i,.5))}setAimPosture(e,t){this.root.rotation.y=t,this.torso.rotation.x=e*.5,this.head.rotation.x=e*.5,this.rightUpperArm.rotation.x=-Math.PI/2.3+e*.5,this.rightUpperArm.rotation.y=-.25,this.rightForearm.rotation.x=-.3,this.leftUpperArm.rotation.x=-Math.PI/2.5+e*.5,this.leftUpperArm.rotation.y=.45,this.leftForearm.rotation.x=-.5}updateAnimation(e,t,i,r){if(this.isDead){this.deathProgress=Math.min(1,this.deathProgress+e*3);const a=this.deathProgress;this.pelvis.position.y=.9*(1-a)+.2*a,this.pelvis.rotation.x=-Math.PI/2.2*a,this.head.rotation.x=.6*a,this.leftThigh.rotation.x=.8*a,this.rightThigh.rotation.x=-.4*a,this.leftUpperArm.rotation.z=-1.2*a,this.rightUpperArm.rotation.z=1.2*a;return}const s=r?.55:.9;if(this.pelvis.position.y+=(s-this.pelvis.position.y)*15*e,t>.5&&i){this.animTime+=e*t*2.8;const a=Math.sin(this.animTime)*.65;this.leftThigh.rotation.x=a,this.rightThigh.rotation.x=-a,this.leftShin.rotation.x=Math.max(0,-a*.8),this.rightShin.rotation.x=Math.max(0,a*.8),this.pelvis.position.y+=Math.abs(Math.sin(this.animTime*2))*.03}else this.leftThigh.rotation.x*=.8,this.rightThigh.rotation.x*=.8,this.leftShin.rotation.x*=.8,this.rightShin.rotation.x*=.8;this.isShooting?(this.shootTimer-=e,this.shootTimer<=0&&(this.isShooting=!1),this.rightUpperArm.position.z=-.05,this.weaponHolder.position.z=.1):(this.rightUpperArm.position.z*=.85,this.weaponHolder.position.z=.15),this.isReloading&&(this.reloadTimer-=e,this.reloadTimer<=0&&(this.isReloading=!1),this.leftUpperArm.rotation.x=-.2,this.leftForearm.rotation.x=-.8)}triggerShootAnim(){this.isShooting=!0,this.shootTimer=.12}triggerReloadAnim(e){this.isReloading=!0,this.reloadTimer=e}kill(){this.isDead=!0,this.deathProgress=0}reset(){this.isDead=!1,this.deathProgress=0,this.pelvis.position.set(0,.9,0),this.pelvis.rotation.set(0,0,0),this.setAimPosture(0,0)}}const an={ak47:{id:"ak47",name:"AK-47",slot:"primary",damage:36,headshotMultiplier:4,armorPenetration:.775,fireRate:10,magSize:30,maxReserve:90,reloadTime:2.4,recoilPitch:.045,recoilYaw:.022,spreadBase:.008,spreadMove:.045,scopedSpread:.008,rangeModifier:.98,hasScope:!1,scopeZoomFov:75,price:2700,killAward:300},m4a4:{id:"m4a4",name:"M4A4",slot:"primary",damage:33,headshotMultiplier:4,armorPenetration:.7,fireRate:11.1,magSize:30,maxReserve:90,reloadTime:2.2,recoilPitch:.032,recoilYaw:.015,spreadBase:.006,spreadMove:.035,scopedSpread:.006,rangeModifier:.97,hasScope:!1,scopeZoomFov:75,price:3100,killAward:300},awp:{id:"awp",name:"AWP",slot:"primary",damage:115,headshotMultiplier:4,armorPenetration:.975,fireRate:1.4,magSize:5,maxReserve:30,reloadTime:3.2,recoilPitch:.09,recoilYaw:.02,spreadBase:.08,spreadMove:.12,scopedSpread:5e-4,rangeModifier:.995,hasScope:!0,scopeZoomFov:20,price:4750,killAward:100},deagle:{id:"deagle",name:"Desert Eagle",slot:"secondary",damage:53,headshotMultiplier:4,armorPenetration:.93,fireRate:4,magSize:7,maxReserve:35,reloadTime:2.1,recoilPitch:.065,recoilYaw:.03,spreadBase:.012,spreadMove:.05,scopedSpread:.012,rangeModifier:.85,hasScope:!1,scopeZoomFov:75,price:700,killAward:300},glock:{id:"glock",name:"Glock-18",slot:"secondary",damage:28,headshotMultiplier:4,armorPenetration:.47,fireRate:6.6,magSize:20,maxReserve:120,reloadTime:2.1,recoilPitch:.02,recoilYaw:.01,spreadBase:.015,spreadMove:.03,scopedSpread:.015,rangeModifier:.85,hasScope:!1,scopeZoomFov:75,price:200,killAward:300},usp:{id:"usp",name:"USP-S",slot:"secondary",damage:35,headshotMultiplier:4,armorPenetration:.5,fireRate:5.8,magSize:12,maxReserve:24,reloadTime:2.1,recoilPitch:.022,recoilYaw:.009,spreadBase:.008,spreadMove:.028,scopedSpread:.008,rangeModifier:.91,hasScope:!1,scopeZoomFov:75,price:200,killAward:300},knife:{id:"knife",name:"Combat Knife",slot:"knife",damage:40,headshotMultiplier:2,armorPenetration:.85,fireRate:2.5,magSize:1,maxReserve:1,reloadTime:.1,recoilPitch:.01,recoilYaw:.01,spreadBase:.001,spreadMove:.001,scopedSpread:.001,rangeModifier:1,hasScope:!1,scopeZoomFov:75,price:0,killAward:1500},c4:{id:"c4",name:"C4 Explosive",slot:"c4",damage:500,headshotMultiplier:1,armorPenetration:1,fireRate:1,magSize:1,maxReserve:1,reloadTime:.1,recoilPitch:0,recoilYaw:0,spreadBase:0,spreadMove:0,scopedSpread:0,rangeModifier:1,hasScope:!1,scopeZoomFov:75,price:0,killAward:0}};class ZT{constructor(){Z(this,"ctx",null);Z(this,"isMuted",!1);Z(this,"masterGain",null);Z(this,"sfxGain",null)}initContext(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;this.ctx=new e,this.masterGain=this.ctx.createGain(),this.masterGain.gain.value=.7,this.masterGain.connect(this.ctx.destination),this.sfxGain=this.ctx.createGain(),this.sfxGain.gain.value=.8,this.sfxGain.connect(this.masterGain)}this.ctx.state==="suspended"&&this.ctx.resume()}unlockAudio(){this.initContext()}setMuted(e){this.isMuted=e,this.masterGain&&this.ctx&&this.masterGain.gain.setValueAtTime(e?0:.7,this.ctx.currentTime)}createNoiseBuffer(e){if(!this.ctx)return null;const t=this.ctx.sampleRate*e,i=this.ctx.createBuffer(1,t,this.ctx.sampleRate),r=i.getChannelData(0);let s=0;for(let a=0;a<t;a++){const o=Math.random()*2-1;r[a]=(s+.02*o)/1.02,s=r[a],r[a]*=3.5}return i}playAK47(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(140,t),i.frequency.exponentialRampToValueAtTime(35,t+.15),r.gain.setValueAtTime(.9*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.18),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.18);const s=this.ctx.createBufferSource(),a=this.createNoiseBuffer(.25);if(a){s.buffer=a;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(1600,t),o.Q.setValueAtTime(1.2,t);const l=this.ctx.createGain();l.gain.setValueAtTime(1.2*e,t),l.gain.exponentialRampToValueAtTime(.01,t+.22),s.connect(o),o.connect(l),l.connect(this.sfxGain),s.start(t),s.stop(t+.25)}}playM4A4(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(180,t),i.frequency.exponentialRampToValueAtTime(45,t+.12),r.gain.setValueAtTime(.7*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.14),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.14);const s=this.ctx.createBufferSource(),a=this.createNoiseBuffer(.18);if(a){s.buffer=a;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(2400,t),o.Q.setValueAtTime(1.8,t);const l=this.ctx.createGain();l.gain.setValueAtTime(1*e,t),l.gain.exponentialRampToValueAtTime(.01,t+.16),s.connect(o),o.connect(l),l.connect(this.sfxGain),s.start(t),s.stop(t+.18)}}playAWP(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sawtooth",i.frequency.setValueAtTime(110,t),i.frequency.exponentialRampToValueAtTime(25,t+.4),r.gain.setValueAtTime(1.4*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.45),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.45);const s=this.ctx.createBufferSource(),a=this.createNoiseBuffer(.6);if(a){s.buffer=a;const o=this.ctx.createBiquadFilter();o.type="lowpass",o.frequency.setValueAtTime(3200,t),o.frequency.exponentialRampToValueAtTime(300,t+.5);const l=this.ctx.createGain();l.gain.setValueAtTime(1.5*e,t),l.gain.exponentialRampToValueAtTime(.001,t+.55),s.connect(o),o.connect(l),l.connect(this.sfxGain),s.start(t),s.stop(t+.6)}}playDeagle(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(160,t),i.frequency.exponentialRampToValueAtTime(40,t+.16),r.gain.setValueAtTime(1*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.2),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.2);const s=this.ctx.createBufferSource(),a=this.createNoiseBuffer(.22);if(a){s.buffer=a;const o=this.ctx.createBiquadFilter();o.type="bandpass",o.frequency.setValueAtTime(1800,t);const l=this.ctx.createGain();l.gain.setValueAtTime(1.1*e,t),l.gain.exponentialRampToValueAtTime(.01,t+.2),s.connect(o),o.connect(l),l.connect(this.sfxGain),s.start(t),s.stop(t+.22)}}playGlock(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(220,t),i.frequency.exponentialRampToValueAtTime(60,t+.09),r.gain.setValueAtTime(.6*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.1),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.1);const s=this.ctx.createBufferSource(),a=this.createNoiseBuffer(.12);if(a){s.buffer=a;const o=this.ctx.createBiquadFilter();o.type="highpass",o.frequency.setValueAtTime(1200,t);const l=this.ctx.createGain();l.gain.setValueAtTime(.7*e,t),l.gain.exponentialRampToValueAtTime(.01,t+.1),s.connect(o),o.connect(l),l.connect(this.sfxGain),s.start(t),s.stop(t+.12)}}playUSP(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createBufferSource(),r=this.createNoiseBuffer(.09);if(r){i.buffer=r;const s=this.ctx.createBiquadFilter();s.type="bandpass",s.frequency.setValueAtTime(3e3,t),s.Q.setValueAtTime(3,t);const a=this.ctx.createGain();a.gain.setValueAtTime(.85*e,t),a.gain.exponentialRampToValueAtTime(.01,t+.08),i.connect(s),s.connect(a),a.connect(this.sfxGain),i.start(t),i.stop(t+.09)}}playKnifeSlash(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createBufferSource(),r=this.createNoiseBuffer(.15);if(r){i.buffer=r;const s=this.ctx.createBiquadFilter();s.type="bandpass",s.frequency.setValueAtTime(800,t),s.frequency.exponentialRampToValueAtTime(2400,t+.12);const a=this.ctx.createGain();a.gain.setValueAtTime(.5*e,t),a.gain.exponentialRampToValueAtTime(.01,t+.14),i.connect(s),s.connect(a),a.connect(this.sfxGain),i.start(t),i.stop(t+.15)}}playKnifeHit(e=1){this.isMuted||this.playHitFlesh(e)}playWeaponShot(e,t=1){switch(e){case"ak47":this.playAK47(t);break;case"m4a4":this.playM4A4(t);break;case"awp":this.playAWP(t);break;case"deagle":this.playDeagle(t);break;case"glock":this.playGlock(t);break;case"usp":this.playUSP(t);break;case"knife":this.playKnifeSlash(t);break}}playReload(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="square",i.frequency.setValueAtTime(600,t+.1),r.gain.setValueAtTime(.3*e,t+.1),r.gain.exponentialRampToValueAtTime(.001,t+.15),i.connect(r),r.connect(this.sfxGain),i.start(t+.1),i.stop(t+.15);const s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type="triangle",s.frequency.setValueAtTime(900,t+.9),a.gain.setValueAtTime(.5*e,t+.9),a.gain.exponentialRampToValueAtTime(.001,t+.98),s.connect(a),a.connect(this.sfxGain),s.start(t+.9),s.stop(t+.98);const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type="sawtooth",o.frequency.setValueAtTime(450,t+1.4),o.frequency.exponentialRampToValueAtTime(750,t+1.55),l.gain.setValueAtTime(.4*e,t+1.4),l.gain.exponentialRampToValueAtTime(.001,t+1.6),o.connect(l),l.connect(this.sfxGain),o.start(t+1.4),o.stop(t+1.6)}playScope(e=.8){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(300,t),i.frequency.exponentialRampToValueAtTime(180,t+.08),r.gain.setValueAtTime(.4*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.08),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.08)}playFootstep(e=.4){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(90,t),i.frequency.exponentialRampToValueAtTime(30,t+.06),r.gain.setValueAtTime(.35*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.07),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.07)}playHitFlesh(e=.8){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="triangle",i.frequency.setValueAtTime(250,t),i.frequency.exponentialRampToValueAtTime(60,t+.08),r.gain.setValueAtTime(.7*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.09),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.09)}playHeadshotDink(e=1){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(2400,t),i.frequency.exponentialRampToValueAtTime(1800,t+.25),r.gain.setValueAtTime(.85*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.25),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.25)}playRicochet(e=.5){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine";const s=1800+Math.random()*1200;i.frequency.setValueAtTime(s,t),i.frequency.exponentialRampToValueAtTime(s*.4,t+.12),r.gain.setValueAtTime(.4*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.12),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.12)}playKillFeedback(){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(880,e),t.frequency.setValueAtTime(1320,e+.08),i.gain.setValueAtTime(.5,e),i.gain.exponentialRampToValueAtTime(.001,e+.25),t.connect(i),i.connect(this.sfxGain),t.start(e),t.stop(e+.25)}playC4Beep(e=.9){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createOscillator(),r=this.ctx.createGain();i.type="sine",i.frequency.setValueAtTime(1600,t),r.gain.setValueAtTime(.7*e,t),r.gain.exponentialRampToValueAtTime(.001,t+.08),i.connect(r),r.connect(this.sfxGain),i.start(t),i.stop(t+.08)}playC4Planting(e=.7){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime;for(let i=0;i<4;i++){const r=this.ctx.createOscillator(),s=this.ctx.createGain();r.type="triangle",r.frequency.setValueAtTime(700+i*150,t+i*.15),s.gain.setValueAtTime(.3*e,t+i*.15),s.gain.exponentialRampToValueAtTime(.001,t+i*.15+.06),r.connect(s),s.connect(this.sfxGain),r.start(t+i*.15),r.stop(t+i*.15+.07)}}playBombPlanted(){this.playC4Beep(1)}playC4Defusing(e=.6){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime,i=this.ctx.createBufferSource(),r=this.createNoiseBuffer(.1);if(r){i.buffer=r;const s=this.ctx.createBiquadFilter();s.type="highpass",s.frequency.setValueAtTime(3500,t);const a=this.ctx.createGain();a.gain.setValueAtTime(.4*e,t),a.gain.exponentialRampToValueAtTime(.01,t+.08),i.connect(s),s.connect(a),a.connect(this.sfxGain),i.start(t),i.stop(t+.1)}}playC4Explosion(){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const e=this.ctx.currentTime,t=this.ctx.createOscillator(),i=this.ctx.createGain();t.type="sawtooth",t.frequency.setValueAtTime(80,e),t.frequency.exponentialRampToValueAtTime(15,e+2.5),i.gain.setValueAtTime(2,e),i.gain.exponentialRampToValueAtTime(.001,e+3),t.connect(i),i.connect(this.sfxGain),t.start(e),t.stop(e+3);const r=this.ctx.createBufferSource(),s=this.createNoiseBuffer(3);if(s){r.buffer=s;const a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.setValueAtTime(2e3,e),a.frequency.exponentialRampToValueAtTime(100,e+2.8);const o=this.ctx.createGain();o.gain.setValueAtTime(2.2,e),o.gain.exponentialRampToValueAtTime(.001,e+3),r.connect(a),a.connect(o),o.connect(this.sfxGain),r.start(e),r.stop(e+3)}}playRoundWin(e){if(this.isMuted||(this.initContext(),!this.ctx||!this.sfxGain))return;const t=this.ctx.currentTime;(e?[440,554,659]:[330,392,493]).forEach((r,s)=>{const a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type="triangle",a.frequency.setValueAtTime(r,t+s*.08),o.gain.setValueAtTime(.3,t+s*.08),o.gain.exponentialRampToValueAtTime(.001,t+1.2),a.connect(o),o.connect(this.sfxGain),a.start(t+s*.08),a.stop(t+1.2)})}}const pt=new ZT;class tm{constructor(e,t,i,r,s,a){Z(this,"state");Z(this,"model");Z(this,"navGraph");Z(this,"map");Z(this,"role","entry");Z(this,"botState","patrol");Z(this,"targetSite","A");Z(this,"path",[]);Z(this,"currentPathIndex",0);Z(this,"moveSpeed",4.8);Z(this,"targetLookDir",new P);Z(this,"targetEnemy",null);Z(this,"reactionTimer",0);Z(this,"shootCooldown",0);Z(this,"burstCount",0);Z(this,"burstMax",4);Z(this,"burstPauseTimer",0);Z(this,"aimInaccuracy",new P);Z(this,"actionTimer",0);this.navGraph=s,this.map=a,this.state={id:e,name:t,team:i,isPlayer:!1,isAlive:!0,health:100,maxHealth:100,armor:100,hasHelmet:!0,hasDefuseKit:i==="CT",position:r.clone(),velocity:new P,rotation:{yaw:0,pitch:0},isGrounded:!0,isCrouching:!1,isPlanting:!1,isDefusing:!1,isReloading:!1,isScoped:!1,currentWeapon:i==="T"?"ak47":"m4a4",inventory:{primary:i==="T"?"ak47":"m4a4",secondary:i==="T"?"glock":"usp",knife:"knife",c4:!1,currentSlot:"primary",ammo:{ak47:{current:30,reserve:90},m4a4:{current:30,reserve:90},awp:{current:5,reserve:30},deagle:{current:7,reserve:35},glock:{current:20,reserve:120},usp:{current:12,reserve:24},knife:{current:1,reserve:1},c4:{current:1,reserve:1}}},kills:0,deaths:0,assists:0,score:0,ping:Math.floor(15+Math.random()*35)},this.model=new e_(i,!1),this.model.root.position.copy(r),this.model.setWeapon(this.state.currentWeapon)}initRoundStrategy(e,t,i){this.state.isAlive=!0,this.state.health=100,this.state.armor=e?0:100,this.state.hasHelmet=!e,this.state.isPlanting=!1,this.state.isDefusing=!1,this.state.isReloading=!1,this.targetEnemy=null,this.reactionTimer=0,this.shootCooldown=0,e?(this.state.inventory.primary=null,this.state.inventory.currentSlot="secondary",this.state.currentWeapon=this.state.team==="T"?"glock":"usp"):(Math.random()<.25?(this.state.inventory.primary="awp",this.state.currentWeapon="awp"):(this.state.inventory.primary=this.state.team==="T"?"ak47":"m4a4",this.state.currentWeapon=this.state.team==="T"?"ak47":"m4a4"),this.state.inventory.currentSlot="primary");const r=this.state.currentWeapon,s=an[r];this.state.inventory.ammo[r]={current:s.magSize,reserve:s.maxReserve},this.model.reset(),this.model.setWeapon(this.state.currentWeapon),this.targetSite=i,this.state.inventory.c4=t,this.state.team==="T"?t?(this.role="carrier",this.botState="rush_site",this.planPathToSite(this.targetSite)):(this.role=Math.random()<.6?"entry":"support",this.botState="rush_site",this.planPathToSite(this.targetSite)):(this.role="anchor",this.botState="hold_angle",this.planCTDefensePath())}planPathToSite(e){const t=e==="A"?"A_SITE_DEFAULT":"B_SITE_DEFAULT",i=this.navGraph.waypoints.get(t);i&&(this.path=this.navGraph.findPath(this.state.position,i.position),this.currentPathIndex=0)}planCTDefensePath(){const e=["A_SITE_DEFAULT","A_SITE_GOOSE","MID_DOORS_CT_SIDE","B_SITE_DEFAULT","B_SITE_BACK_PLAT"],t=e[Math.floor(Math.random()*e.length)],i=this.navGraph.waypoints.get(t);i&&(this.path=this.navGraph.findPath(this.state.position,i.position),this.currentPathIndex=0)}updatePerception(e){var a;if(!this.state.isAlive)return;let t=null,i=1/0;const r=this.state.position.clone().add(new P(0,1.65,0)),s=new P(0,0,-1).applyAxisAngle(new P(0,1,0),this.state.rotation.yaw);for(const o of e){if(o.id===this.state.id||!o.isAlive||o.team===this.state.team)continue;const l=o.position.clone().add(new P(0,1.4,0)),c=r.distanceTo(l);if(c>75)continue;const h=l.clone().sub(r).normalize();if(s.dot(h)>.35||c<6){const d=this.map.raycast(r,h,c);(!d||d.distance>=c-.5)&&c<i&&(i=c,t=o)}}t?((a=this.targetEnemy)==null?void 0:a.id)!==t.id&&(this.targetEnemy=t,this.reactionTimer=.25+Math.random()*.15):this.targetEnemy=null}update(e,t,i,r,s){if(!this.state.isAlive)return;this.updatePerception(t),i&&this.state.team==="CT"&&this.botState!=="defuse_bomb"&&this.botState!=="engage"&&r&&(this.botState="retake_site",this.path=this.navGraph.findPath(this.state.position,r),this.currentPathIndex=0),this.targetEnemy&&this.targetEnemy.isAlive?this.executeCombat(e,s):this.executeObjectives(e,i,r),this.executeMovement(e),this.model.root.position.copy(this.state.position),this.model.setAimPosture(this.state.rotation.pitch,this.state.rotation.yaw),this.model.updateHitboxes();const a=new Ce(this.state.velocity.x,this.state.velocity.z).length();this.model.updateAnimation(e,a,this.state.isGrounded,this.state.isCrouching)}executeCombat(e,t){if(!this.targetEnemy)return;const i=this.state.position.clone().add(new P(0,1.65,0)),s=this.targetEnemy.position.clone().add(new P(0,1.5,0)).clone().sub(i).normalize(),a=Math.atan2(-s.x,-s.z),o=Math.asin(s.y);let l=a-this.state.rotation.yaw;for(;l>Math.PI;)l-=Math.PI*2;for(;l<-Math.PI;)l+=Math.PI*2;if(this.state.rotation.yaw+=l*Math.min(1,12*e),this.state.rotation.pitch+=(o-this.state.rotation.pitch)*Math.min(1,12*e),this.reactionTimer>0){this.reactionTimer-=e;return}const c=this.state.inventory.ammo[this.state.currentWeapon];if(c.current<=0){!this.state.isReloading&&c.reserve>0&&this.reload();return}if(this.shootCooldown-=e,this.burstPauseTimer-=e,this.burstPauseTimer<=0&&this.shootCooldown<=0){const h=an[this.state.currentWeapon],f=(Math.random()-.5)*h.spreadBase*2,d=s.clone();d.x+=f+(Math.random()-.5)*.02,d.y+=f*.5+(Math.random()-.5)*.02,d.z+=f+(Math.random()-.5)*.02,d.normalize(),c.current--,this.shootCooldown=1/h.fireRate,this.burstCount++,this.model.triggerShootAnim(),pt.playWeaponShot(this.state.currentWeapon,.7),t(this.state,i,d,this.state.currentWeapon),this.burstCount>=this.burstMax&&(this.burstCount=0,this.burstPauseTimer=.35+Math.random()*.25)}}executeObjectives(e,t,i){if(this.state.team==="T"&&this.state.inventory.c4&&!t&&this.map.getBombSiteAt(this.state.position)){this.botState="plant_bomb",this.state.isPlanting=!0,this.actionTimer+=e,pt.playC4Planting(.3),this.actionTimer>=3&&(this.state.isPlanting=!1,this.state.inventory.c4=!1,this.actionTimer=0);return}if(this.state.team==="CT"&&t&&i&&this.state.position.distanceTo(i)<2.5){this.botState="defuse_bomb",this.state.isDefusing=!0,this.actionTimer+=e,pt.playC4Defusing(.4);const s=this.state.hasDefuseKit?5:10;this.actionTimer>=s&&(this.state.isDefusing=!1,this.actionTimer=0);return}if(this.state.isPlanting=!1,this.state.isDefusing=!1,this.actionTimer=0,this.path.length>0&&this.currentPathIndex<this.path.length){const r=this.path[this.currentPathIndex],s=new Ce(this.state.position.x,this.state.position.z),a=new Ce(r.x,r.z);if(s.distanceTo(a)<1.2)this.currentPathIndex++;else{const l=r.clone().sub(this.state.position);l.y=0,l.normalize(),this.state.velocity.x=l.x*this.moveSpeed,this.state.velocity.z=l.z*this.moveSpeed;let h=Math.atan2(-l.x,-l.z)-this.state.rotation.yaw;for(;h>Math.PI;)h-=Math.PI*2;for(;h<-Math.PI;)h+=Math.PI*2;this.state.rotation.yaw+=h*Math.min(1,8*e)}}else this.state.velocity.x*=.8,this.state.velocity.z*=.8}reload(){const e=an[this.state.currentWeapon],t=this.state.inventory.ammo[this.state.currentWeapon];this.state.isReloading||t.current>=e.magSize||t.reserve<=0||(this.state.isReloading=!0,this.model.triggerReloadAnim(e.reloadTime),pt.playReload(.5),setTimeout(()=>{if(this.state.isAlive){const i=e.magSize-t.current,r=Math.min(i,t.reserve);t.current+=r,t.reserve-=r,this.state.isReloading=!1}},e.reloadTime*1e3))}executeMovement(e){(this.state.isPlanting||this.state.isDefusing)&&(this.state.velocity.x=0,this.state.velocity.z=0),this.state.velocity.y-=18*e;const t=this.state.position.clone();t.x+=this.state.velocity.x*e,t.y+=this.state.velocity.y*e,t.z+=this.state.velocity.z*e;const i=this.map.checkEntityCollision(t,.45,1.8);this.state.position.copy(i.position),this.state.isGrounded=i.isGrounded,i.isGrounded&&this.state.velocity.y<0&&(this.state.velocity.y=0)}takeDamage(e,t,i){if(!this.state.isAlive)return{isKilled:!1,finalDamage:0};let r=e;if(this.state.armor>0){const a=an[t.currentWeapon].armorPenetration,o=r*a,l=(r-o)*.5;this.state.armor=Math.max(0,this.state.armor-l),r=o}return this.state.health=Math.max(0,this.state.health-Math.round(r)),this.state.health<=0?(this.state.isAlive=!1,this.state.deaths++,this.model.kill(),{isKilled:!0,finalDamage:Math.round(r)}):{isKilled:!1,finalDamage:Math.round(r)}}}class QT{constructor(e,t){Z(this,"group");Z(this,"camera");Z(this,"team");Z(this,"weaponRoot");Z(this,"weaponMeshes",new Map);Z(this,"leftArmGroup");Z(this,"rightArmGroup");Z(this,"currentWeaponId","ak47");Z(this,"bobTime",0);Z(this,"swayPitch",0);Z(this,"swayYaw",0);Z(this,"recoilOffset",new P);Z(this,"recoilRot",new Xa);Z(this,"reloadProgress",0);Z(this,"isReloading",!1);Z(this,"reloadDuration",2);Z(this,"muzzleFlashLight");Z(this,"muzzleFlashSprite");Z(this,"flashTimer",0);this.camera=e,this.team=t,this.group=new He,this.weaponRoot=new He,this.weaponRoot.position.set(.22,-.22,-.42),this.group.add(this.weaponRoot),this.leftArmGroup=new He,this.rightArmGroup=new He,this.weaponRoot.add(this.leftArmGroup),this.weaponRoot.add(this.rightArmGroup),this.muzzleFlashLight=new Jg(16755251,0,8),this.muzzleFlashLight.position.set(.22,-.15,-.85),this.group.add(this.muzzleFlashLight);const i=new $g({map:_r.getMuzzleFlash(),blending:eh,transparent:!0,opacity:0});this.muzzleFlashSprite=new HT(i),this.muzzleFlashSprite.scale.set(.4,.4,.4),this.muzzleFlashSprite.position.set(.22,-.15,-.85),this.group.add(this.muzzleFlashSprite),this.buildArms(),this.buildWeaponModels(),this.setWeapon("ak47")}buildArms(){const e=this.team==="CT"?2570054:6122815,t=new lt({color:e,roughness:.8}),i=new lt({color:1710618,roughness:.6}),r=new ee(new ae(.08,.08,.35),t);r.position.set(.06,-.06,.15),r.rotation.x=.2,this.rightArmGroup.add(r);const s=new ee(new ae(.07,.07,.1),i);s.position.set(.06,-.04,-.02),this.rightArmGroup.add(s);const a=new ee(new ae(.08,.08,.38),t);a.position.set(-.24,-.08,.12),a.rotation.set(.3,.5,-.2),this.leftArmGroup.add(a);const o=new ee(new ae(.07,.07,.1),i);o.position.set(-.1,-.01,-.18),o.rotation.set(.2,.4,0),this.leftArmGroup.add(o)}buildWeaponModels(){const e=new lt({color:2237993,roughness:.35,metalness:.85}),t=new lt({color:7552283,roughness:.65}),i=new lt({color:4016694,roughness:.5,metalness:.4}),r=new lt({color:12633544,roughness:.2,metalness:.95}),s=new lt({color:9072203,roughness:.9}),a=new Dr({color:3407667}),o=new He,l=new ee(new ae(.05,.07,.32),e);o.add(l);const c=new ee(new cn(.012,.012,.35,12),e);c.rotation.x=Math.PI/2,c.position.set(0,.01,-.3),o.add(c);const h=new ee(new cn(.01,.01,.25,12),e);h.rotation.x=Math.PI/2,h.position.set(0,.03,-.25),o.add(h);const f=new ee(new ae(.055,.06,.18),t);f.position.set(0,.01,-.2),o.add(f);const d=new ee(new ae(.045,.09,.22),t);d.position.set(0,-.02,.25),o.add(d);const p=new ee(new ae(.035,.16,.07),e);p.position.set(0,-.1,-.06),p.rotation.x=.25,o.add(p);const v=new ee(new ae(.01,.025,.01),e);v.position.set(0,.045,-.44),o.add(v),this.weaponMeshes.set("ak47",o);const x=new He,m=new ee(new ae(.05,.08,.35),e);x.add(m);const u=new ee(new cn(.014,.014,.3,12),e);u.rotation.x=Math.PI/2,u.position.set(0,.01,-.3),x.add(u);const _=new ee(new ae(.055,.06,.2),e);_.position.set(0,.01,-.22),x.add(_);const g=new ee(new ae(.045,.09,.2),e);g.position.set(0,-.01,.25),x.add(g);const y=new ee(new ae(.035,.15,.06),e);y.position.set(0,-.09,-.04),x.add(y);const C=new ee(new ae(.03,.035,.15),e);C.position.set(0,.055,.02),x.add(C),this.weaponMeshes.set("m4a4",x);const T=new He,A=new ee(new ae(.06,.09,.45),i);T.add(A);const I=new ee(new cn(.015,.015,.45,12),e);I.rotation.x=Math.PI/2,I.position.set(0,.01,-.4),T.add(I);const S=new ee(new cn(.024,.024,.28,12),e);S.rotation.x=Math.PI/2,S.position.set(0,.08,-.05),T.add(S);const E=new ee(new ae(.05,.1,.28),i);E.position.set(0,-.02,.32),T.add(E),this.weaponMeshes.set("awp",T);const F=new He,z=new ee(new ae(.045,.065,.24),r);z.position.set(0,.03,-.06),F.add(z);const q=new ee(new ae(.04,.05,.2),e);q.position.set(0,.01,-.05),F.add(q);const L=new ee(new ae(.038,.12,.06),e);L.position.set(0,-.06,.02),L.rotation.x=-.2,F.add(L),this.weaponMeshes.set("deagle",F);const k=new He,j=new ee(new ae(.038,.05,.2),e);j.position.set(0,.02,-.05),k.add(j);const K=new ee(new ae(.035,.11,.055),e);K.position.set(0,-.05,.02),K.rotation.x=-.18,k.add(K),this.weaponMeshes.set("glock",k);const D=new He,O=new ee(new ae(.038,.05,.2),e);O.position.set(0,.02,-.05),D.add(O);const B=new ee(new cn(.018,.018,.18,12),e);B.rotation.x=Math.PI/2,B.position.set(0,.02,-.23),D.add(B);const $=new ee(new ae(.035,.11,.055),e);$.position.set(0,-.05,.02),$.rotation.x=-.18,D.add($),this.weaponMeshes.set("usp",D);const Q=new He,X=new ee(new ae(.015,.05,.24),r);X.position.set(0,.02,-.15),Q.add(X);const J=new ee(new ae(.03,.04,.12),e);J.position.set(0,0,.02),Q.add(J),this.weaponMeshes.set("knife",Q);const ce=new He,me=new ee(new ae(.16,.1,.22),s);ce.add(me);const ge=new ee(new ae(.1,.02,.12),e);ge.position.set(0,.05,-.02),ce.add(ge);const Pe=new ee(new Ur(.07,.035),a);Pe.rotation.x=-Math.PI/2,Pe.position.set(0,.062,.05),ce.add(Pe),this.weaponMeshes.set("c4",ce)}setWeapon(e){this.currentWeaponId=e,this.weaponMeshes.forEach(i=>{this.weaponRoot.remove(i)});const t=this.weaponMeshes.get(e);t&&this.weaponRoot.add(t),e==="knife"?(this.leftArmGroup.visible=!1,this.rightArmGroup.position.set(0,0,0)):e==="glock"||e==="usp"||e==="deagle"?(this.leftArmGroup.visible=!0,this.leftArmGroup.position.set(.12,.02,-.1),this.rightArmGroup.position.set(0,0,0)):e==="c4"?(this.leftArmGroup.visible=!0,this.leftArmGroup.position.set(.08,.04,-.08),this.rightArmGroup.position.set(0,0,0)):(this.leftArmGroup.visible=!0,this.leftArmGroup.position.set(0,0,0),this.rightArmGroup.position.set(0,0,0))}triggerShoot(e,t){this.recoilOffset.z+=.045,this.recoilRot.x-=e*.8,this.recoilRot.y+=(Math.random()-.5)*t,this.muzzleFlashLight.intensity=3,this.muzzleFlashSprite.material.opacity=1,this.flashTimer=.04}triggerReload(e){this.isReloading=!0,this.reloadDuration=e,this.reloadProgress=0}addSway(e,t){this.swayYaw-=e*.0012,this.swayPitch-=t*.0012,this.swayYaw=Math.max(-.06,Math.min(.06,this.swayYaw)),this.swayPitch=Math.max(-.06,Math.min(.06,this.swayPitch))}update(e,t,i,r){this.group.visible=!r,this.flashTimer>0&&(this.flashTimer-=e,this.flashTimer<=0&&(this.muzzleFlashLight.intensity=0,this.muzzleFlashSprite.material.opacity=0)),this.swayYaw*=.85,this.swayPitch*=.85,this.recoilOffset.multiplyScalar(.8),this.recoilRot.x*=.82,this.recoilRot.y*=.82;let s=0,a=0;t>.5&&i?(this.bobTime+=e*t*2.6,s=Math.sin(this.bobTime)*.015,a=Math.abs(Math.sin(this.bobTime*2))*.012):(this.bobTime+=e*1.5,s=Math.sin(this.bobTime)*.002,a=Math.cos(this.bobTime*2)*.002);let o=0,l=0;if(this.isReloading)if(this.reloadProgress+=e/this.reloadDuration,this.reloadProgress>=1)this.isReloading=!1;else{const h=this.reloadProgress;o=-Math.sin(h*Math.PI)*.12,l=Math.sin(h*Math.PI)*.35}const c=new P(.22,-.22,-.42);this.weaponRoot.position.set(c.x+s+this.swayYaw+this.recoilOffset.x,c.y+a+this.swayPitch+this.recoilOffset.y+o,c.z+this.recoilOffset.z),this.weaponRoot.rotation.set(this.swayPitch*1.5+this.recoilRot.x+l,this.swayYaw*1.5+this.recoilRot.y,this.swayYaw*.8)}}class JT{constructor(e,t){Z(this,"container");Z(this,"callbacks");Z(this,"scene");Z(this,"camera");Z(this,"renderer");Z(this,"animFrameId",0);Z(this,"clock");Z(this,"map");Z(this,"navGraph");Z(this,"viewModel");Z(this,"player");Z(this,"playerModel");Z(this,"bots",[]);Z(this,"allEntities",[]);Z(this,"roundState");Z(this,"tracers",[]);Z(this,"particles",[]);Z(this,"plantedC4Mesh",null);Z(this,"c4BeepTimer",0);Z(this,"c4Light",null);Z(this,"isPointerLocked",!1);Z(this,"keys",{});Z(this,"mouseButtons",{});Z(this,"mouseDelta",{x:0,y:0});Z(this,"playerEyeHeight",1.65);Z(this,"playerRecoilPitch",0);Z(this,"playerRecoilYaw",0);Z(this,"shootTimer",0);Z(this,"actionTimer",0);Z(this,"isSpectating",!1);Z(this,"spectatingTargetId",null);Z(this,"screenShake",0);Z(this,"onWindowResize",()=>{if(!this.container)return;const e=this.container.clientWidth,t=this.container.clientHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)});Z(this,"loop",()=>{var i;this.animFrameId=requestAnimationFrame(this.loop);const e=Math.min(.1,this.clock.getDelta());this.updateRoundLogic(e),this.updatePlayer(e),this.updateBots(e),this.updateVisualEffects(e),this.updateCamera(e),this.updateEntityList();const t=this.isSpectating&&((i=this.bots.find(r=>r.state.id===this.spectatingTargetId))==null?void 0:i.state)||null;this.callbacks.onStateUpdate({player:this.player,round:this.roundState,allEntities:this.allEntities,spectatingEntity:t,isSpectating:this.isSpectating}),this.renderer.render(this.scene,this.camera)});this.container=e,this.callbacks=t,this.clock=new qT,this.scene=new zT,this.scene.background=new qe(13952753),this.scene.fog=new ud(13952753,.005),this.camera=new yn(75,e.clientWidth/e.clientHeight,.05,300),this.camera.position.set(0,1.65,50),this.renderer=new qg({antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=mg,this.renderer.toneMapping=_g,this.renderer.toneMappingExposure=1.1,e.appendChild(this.renderer.domElement),this.map=new $T,this.scene.add(this.map.group),this.navGraph=new KT,this.setupLighting(),this.player=this.createPlayerState("CT"),this.playerModel=new e_("CT",!0),this.playerModel.root.visible=!1,this.scene.add(this.playerModel.root),this.viewModel=new QT(this.camera,"CT"),this.camera.add(this.viewModel.group),this.scene.add(this.camera),this.roundState={roundNumber:1,scoreCT:0,scoreT:0,status:"freezetime",timer:5,maxRoundTime:115,bombState:{isPlanted:!1,site:null,position:null,timer:40,planterId:null,carrierId:null,isDropped:!1,droppedPosition:null,defusingPlayerId:null,defuseProgress:0},winner:null,winReason:null,isPistolRound:!0},this.initBots(),this.bindEvents(),this.startRound(!0),this.loop()}setupLighting(){const e=new WT(16774885,9075037,.7);this.scene.add(e);const t=new YT(16775917,1.4);t.position.set(45,80,45),t.castShadow=!0,t.shadow.mapSize.width=2048,t.shadow.mapSize.height=2048,t.shadow.camera.near=10,t.shadow.camera.far=250,t.shadow.camera.left=-90,t.shadow.camera.right=90,t.shadow.camera.top=90,t.shadow.camera.bottom=-90,t.shadow.bias=-4e-4,this.scene.add(t)}createPlayerState(e){return{id:"player_0",name:"Player (You)",team:e,isPlayer:!0,isAlive:!0,health:100,maxHealth:100,armor:0,hasHelmet:!1,hasDefuseKit:e==="CT",position:new P(0,0,-52),velocity:new P,rotation:{yaw:0,pitch:0},isGrounded:!0,isCrouching:!1,isPlanting:!1,isDefusing:!1,isReloading:!1,isScoped:!1,currentWeapon:e==="CT"?"usp":"glock",inventory:{primary:null,secondary:e==="CT"?"usp":"glock",knife:"knife",c4:!1,currentSlot:"secondary",ammo:{ak47:{current:30,reserve:90},m4a4:{current:30,reserve:90},awp:{current:5,reserve:30},deagle:{current:7,reserve:35},glock:{current:20,reserve:120},usp:{current:12,reserve:24},knife:{current:1,reserve:1},c4:{current:1,reserve:1}}},kills:0,deaths:0,assists:0,score:0,ping:5}}initBots(){this.bots=[];const e=["Ghost","Viper","Razor","Echo"],t=["Boris","Ivan","Dimitri","Viktor","Nikolai"];for(let i=0;i<4;i++){const r=new tm(`bot_ct_${i+1}`,e[i],"CT",new P(-6+i*4,0,-52),this.navGraph,this.map);this.bots.push(r),this.scene.add(r.model.root)}for(let i=0;i<5;i++){const r=new tm(`bot_t_${i+1}`,t[i],"T",new P(-8+i*4,0,58),this.navGraph,this.map);this.bots.push(r),this.scene.add(r.model.root)}}startRound(e=!1){this.roundState.isPistolRound=e,this.roundState.status="freezetime",this.roundState.timer=5,this.roundState.winner=null,this.roundState.winReason=null,this.roundState.bombState={isPlanted:!1,site:null,position:null,timer:40,planterId:null,carrierId:null,isDropped:!1,droppedPosition:null,defusingPlayerId:null,defuseProgress:0},this.plantedC4Mesh&&(this.scene.remove(this.plantedC4Mesh),this.plantedC4Mesh=null),this.c4Light&&(this.scene.remove(this.c4Light),this.c4Light=null),this.player.isAlive=!0,this.player.health=100,this.player.armor=e?0:100,this.player.hasHelmet=!e,this.player.isPlanting=!1,this.player.isDefusing=!1,this.player.isReloading=!1,this.player.isScoped=!1,this.isSpectating=!1,this.spectatingTargetId=null,this.player.team==="CT"?(this.player.position.set(0,0,-52),this.player.rotation.yaw=0,this.player.rotation.pitch=0,e&&(this.player.inventory.primary=null,this.player.inventory.secondary="usp",this.player.inventory.currentSlot="secondary",this.player.currentWeapon="usp")):(this.player.position.set(0,0,56),this.player.rotation.yaw=Math.PI,this.player.rotation.pitch=0,e&&(this.player.inventory.primary=null,this.player.inventory.secondary="glock",this.player.inventory.currentSlot="secondary",this.player.currentWeapon="glock"));const t=this.player.currentWeapon,i=an[t];this.player.inventory.ammo[t]={current:i.magSize,reserve:i.maxReserve},this.viewModel.setWeapon(t);const r=Math.random()<.55?"A":"B",s=this.bots.filter(o=>o.state.team==="T"),a=Math.floor(Math.random()*s.length);this.bots.forEach(o=>{const l=o.state.team==="CT",c=!l&&s.indexOf(o)===a;if(l){const h=this.bots.indexOf(o);o.state.position.set(-6+h*4,0,-52)}else{const h=s.indexOf(o);o.state.position.set(-8+h*4,0,58)}o.initRoundStrategy(e,c,r)}),this.updateEntityList()}setPlayerWeapon(e){if(!this.player.isAlive||this.player.isReloading)return;const t=an[e];this.player.currentWeapon=e,this.player.inventory.currentSlot=t.slot,this.player.isScoped=!1,this.camera.fov=75,this.camera.updateProjectionMatrix(),this.viewModel.setWeapon(e),pt.playScope(.2)}buyWeapon(e){this.roundState.status!=="freezetime"&&this.roundState.timer<this.roundState.maxRoundTime-20;const t=an[e];t.slot==="primary"?this.player.inventory.primary=e:t.slot==="secondary"&&(this.player.inventory.secondary=e),this.player.inventory.ammo[e]={current:t.magSize,reserve:t.maxReserve},this.setPlayerWeapon(e)}buyGear(e){e==="armor"?this.player.armor=100:e==="helmet"?(this.player.armor=100,this.player.hasHelmet=!0):e==="kit"&&(this.player.hasDefuseKit=!0)}bindEvents(){window.addEventListener("resize",this.onWindowResize);const e=this.renderer.domElement;e.addEventListener("click",()=>{pt.unlockAudio(),this.isPointerLocked||e.requestPointerLock()}),document.addEventListener("pointerlockchange",()=>{this.isPointerLocked=document.pointerLockElement===e}),window.addEventListener("mousemove",t=>{this.isPointerLocked&&(this.mouseDelta.x+=t.movementX,this.mouseDelta.y+=t.movementY,this.viewModel.addSway(t.movementX,t.movementY))}),window.addEventListener("mousedown",t=>{if(pt.unlockAudio(),this.mouseButtons[t.button]=!0,t.button===2&&this.isPointerLocked&&this.player.isAlive){const i=an[this.player.currentWeapon];i.hasScope&&(this.player.isScoped=!this.player.isScoped,this.camera.fov=this.player.isScoped?i.scopeZoomFov:75,this.camera.updateProjectionMatrix(),pt.playScope())}!this.player.isAlive&&this.isSpectating&&t.button===0&&this.cycleSpectatorTarget()}),window.addEventListener("mouseup",t=>{this.mouseButtons[t.button]=!1}),window.addEventListener("contextmenu",t=>t.preventDefault()),window.addEventListener("keydown",t=>{if(this.keys[t.code]=!0,!this.player.isAlive){(t.code==="KeyE"||t.code==="Space")&&this.takeOverBot();return}t.code==="Digit1"&&this.player.inventory.primary?this.setPlayerWeapon(this.player.inventory.primary):t.code==="Digit2"?this.setPlayerWeapon(this.player.inventory.secondary):t.code==="Digit3"?this.setPlayerWeapon("knife"):t.code==="Digit4"&&this.player.inventory.c4&&this.setPlayerWeapon("c4"),t.code==="KeyR"&&this.reloadPlayerWeapon()}),window.addEventListener("keyup",t=>{this.keys[t.code]=!1})}reloadPlayerWeapon(){const e=this.player.currentWeapon,t=an[e],i=this.player.inventory.ammo[e];this.player.isReloading||i.current>=t.magSize||i.reserve<=0||e==="knife"||e==="c4"||(this.player.isReloading=!0,this.player.isScoped=!1,this.camera.fov=75,this.camera.updateProjectionMatrix(),this.viewModel.triggerReload(t.reloadTime),pt.playReload(.8),setTimeout(()=>{if(this.player.isAlive){const r=t.magSize-i.current,s=Math.min(r,i.reserve);i.current+=s,i.reserve-=s,this.player.isReloading=!1}},t.reloadTime*1e3))}cycleSpectatorTarget(){const e=this.bots.filter(i=>i.state.team===this.player.team&&i.state.isAlive);if(e.length===0)return;let t=0;this.spectatingTargetId&&(t=(e.findIndex(r=>r.state.id===this.spectatingTargetId)+1)%e.length),this.spectatingTargetId=e[t].state.id}takeOverBot(){const e=this.bots.find(t=>t.state.id===this.spectatingTargetId&&t.state.isAlive);e&&(this.player.isAlive=!0,this.player.health=e.state.health,this.player.armor=e.state.armor,this.player.hasHelmet=e.state.hasHelmet,this.player.position.copy(e.state.position),this.player.velocity.copy(e.state.velocity),this.player.rotation.yaw=e.state.rotation.yaw,this.player.rotation.pitch=e.state.rotation.pitch,this.player.inventory={...e.state.inventory},this.player.currentWeapon=e.state.currentWeapon,this.viewModel.setWeapon(this.player.currentWeapon),e.state.isAlive=!1,e.model.root.visible=!1,this.isSpectating=!1,this.spectatingTargetId=null)}fireBullet(e,t,i,r){const s=an[r],a=e.isPlayer;let o=200,l=null;const c=new ql(t,i),h=new P;if(!a&&this.player.isAlive&&this.player.team!==e.team){this.playerModel.updateHitboxes();for(const p of this.playerModel.hitboxes)if(c.intersectBox(p.box,h)){const v=t.distanceTo(h);v<o&&(o=v,l={entity:this.player,hitbox:p.zone,point:h.clone(),multiplier:p.multiplier})}}for(const p of this.bots)if(!(!p.state.isAlive||p.state.team===e.team)){for(const v of p.model.hitboxes)if(c.intersectBox(v.box,h)){const x=t.distanceTo(h);x<o&&(o=x,l={entity:p.state,bot:p,hitbox:v.zone,point:h.clone(),multiplier:v.multiplier})}}const f=this.map.raycast(t,i,o);let d=t.clone().add(i.clone().multiplyScalar(150));if(f&&(!l||f.distance<o))d=f.point,this.createWallImpact(f.point,f.normal,f.materialType),pt.playRicochet(.4);else if(l){d=l.point;const p=l.hitbox==="head",v=s.damage*l.multiplier;if(this.createBloodImpact(l.point),p?pt.playHeadshotDink(1):pt.playHitFlesh(.8),l.entity.isPlayer){let x=v;if(this.player.armor>0){const m=x*s.armorPenetration;this.player.armor=Math.max(0,this.player.armor-(x-m)*.5),x=m}this.player.health=Math.max(0,this.player.health-Math.round(x)),this.callbacks.onDamageTaken(Math.round(x),p),this.player.health<=0&&(this.player.isAlive=!1,this.player.deaths++,this.isSpectating=!0,this.cycleSpectatorTarget(),this.callbacks.onKillFeed({id:`kf_${Date.now()}_${Math.random()}`,killerId:e.id,killerName:e.name,killerTeam:e.team,victimId:this.player.id,victimName:this.player.name,victimTeam:this.player.team,weapon:r,isHeadshot:p,isWallbang:!1,isNoScope:!1,timestamp:Date.now()}))}else if(l.bot){const x=l.bot.takeDamage(v,e,l.hitbox);a&&(this.screenShake=p?.05:.02),x.isKilled&&(e.kills++,e.score+=2,a&&pt.playKillFeedback(),l.bot.state.inventory.c4&&(this.roundState.bombState.isDropped=!0,this.roundState.bombState.droppedPosition=l.bot.state.position.clone()),this.callbacks.onKillFeed({id:`kf_${Date.now()}_${Math.random()}`,killerId:e.id,killerName:e.name,killerTeam:e.team,victimId:l.bot.state.id,victimName:l.bot.state.name,victimTeam:l.bot.state.team,weapon:r,isHeadshot:p,isWallbang:!1,isNoScope:r==="awp"&&!e.isScoped,timestamp:Date.now()}))}}this.createTracer(t,d)}createTracer(e,t){const i=[e.clone(),t.clone()],r=new Zn().setFromPoints(i),s=new Zg({color:16765565,transparent:!0,opacity:.8,linewidth:2}),a=new VT(r,s);this.scene.add(a),this.tracers.push({line:a,life:.08,maxLife:.08})}createWallImpact(e,t,i){const r=new Dr({color:16763972}),s=new ae(.04,.04,.04);for(let a=0;a<5;a++){const o=new ee(s,r);o.position.copy(e);const l=t.clone().add(new P((Math.random()-.5)*2,Math.random()*2,(Math.random()-.5)*2)).normalize().multiplyScalar(4+Math.random()*4);this.scene.add(o),this.particles.push({mesh:o,vel:l,life:.25})}}createBloodImpact(e){const t=new Dr({color:10027008}),i=new ae(.06,.06,.06);for(let r=0;r<6;r++){const s=new ee(i,t);s.position.copy(e);const a=new P((Math.random()-.5)*3,Math.random()*3,(Math.random()-.5)*3);this.scene.add(s),this.particles.push({mesh:s,vel:a,life:.35})}}spawnPlantedC4(e,t){this.roundState.bombState.isPlanted=!0,this.roundState.bombState.site=t,this.roundState.bombState.position=e.clone(),this.roundState.bombState.timer=40,this.roundState.status="bomb_planted",pt.playBombPlanted(),this.plantedC4Mesh=new He;const i=new ee(new ae(.25,.15,.35),new lt({color:9072203,roughness:.9}));i.position.y=.075,this.plantedC4Mesh.add(i);const r=new ee(new ae(.15,.03,.18),new lt({color:2236962}));r.position.set(0,.16,-.04),this.plantedC4Mesh.add(r),this.plantedC4Mesh.position.copy(e),this.scene.add(this.plantedC4Mesh),this.c4Light=new Jg(16711680,0,10),this.c4Light.position.set(e.x,e.y+.3,e.z),this.scene.add(this.c4Light)}detonateC4(){pt.playC4Explosion(),this.screenShake=.4,this.plantedC4Mesh&&(this.scene.remove(this.plantedC4Mesh),this.plantedC4Mesh=null),this.c4Light&&(this.scene.remove(this.c4Light),this.c4Light=null);const e=this.roundState.bombState.position;e&&(this.player.isAlive&&this.player.position.distanceTo(e)<45&&(this.player.health=0,this.player.isAlive=!1,this.player.deaths++),this.bots.forEach(t=>{t.state.isAlive&&t.state.position.distanceTo(e)<45&&(t.state.health=0,t.state.isAlive=!1,t.state.deaths++,t.model.kill())})),this.endRound("T","Target Bombed")}defuseC4Success(){this.plantedC4Mesh&&(this.scene.remove(this.plantedC4Mesh),this.plantedC4Mesh=null),this.c4Light&&(this.scene.remove(this.c4Light),this.c4Light=null),this.endRound("CT","Bomb Defused")}endRound(e,t){this.roundState.status="round_end",this.roundState.winner=e,this.roundState.winReason=t,e==="CT"?(this.roundState.scoreCT++,pt.playRoundWin(!0)):(this.roundState.scoreT++,pt.playRoundWin(!1)),setTimeout(()=>{this.roundState.roundNumber++,this.startRound(!1)},5e3)}updateRoundLogic(e){if(this.roundState.status==="freezetime"){this.roundState.timer-=e,this.roundState.timer<=0&&(this.roundState.status="live",this.roundState.timer=this.roundState.maxRoundTime);return}if(this.roundState.status==="live"){if(this.roundState.timer-=e,this.roundState.timer<=0){this.endRound("CT","Time Expired");return}const t=(this.player.team==="CT"&&this.player.isAlive?1:0)+this.bots.filter(r=>r.state.team==="CT"&&r.state.isAlive).length;if((this.player.team==="T"&&this.player.isAlive?1:0)+this.bots.filter(r=>r.state.team==="T"&&r.state.isAlive).length===0){this.endRound("CT","Terrorists Eliminated");return}if(t===0){this.endRound("T","Counter-Terrorists Eliminated");return}}if(this.roundState.status==="bomb_planted"){this.roundState.bombState.timer-=e;const t=this.roundState.bombState.timer,i=Math.max(.12,t/40*1);if(this.c4BeepTimer+=e,this.c4BeepTimer>=i&&(this.c4BeepTimer=0,pt.playC4Beep(.8),this.c4Light&&(this.c4Light.intensity=3,setTimeout(()=>{this.c4Light&&(this.c4Light.intensity=0)},60))),this.roundState.bombState.timer<=0){this.detonateC4();return}(this.player.team==="CT"&&this.player.isAlive?1:0)+this.bots.filter(r=>r.state.team==="CT"&&r.state.isAlive).length}}updatePlayer(e){if(!this.player.isAlive||this.isSpectating)return;const t=this.roundState.status==="freezetime";this.isPointerLocked&&(this.player.rotation.yaw-=this.mouseDelta.x*.0022,this.player.rotation.pitch-=this.mouseDelta.y*.0022,this.player.rotation.pitch=Math.max(-Math.PI/2.2,Math.min(Math.PI/2.2,this.player.rotation.pitch)),this.mouseDelta.x=0,this.mouseDelta.y=0);let i=0,r=0;t||(this.keys.KeyW&&(i+=1),this.keys.KeyS&&(i-=1),this.keys.KeyA&&(r-=1),this.keys.KeyD&&(r+=1));const s=this.keys.ControlLeft||this.keys.KeyC,a=this.keys.ShiftLeft;this.player.isCrouching=s;let o=5.2;s?o=2.4:a&&(o=3);const l=new Ce(r,i);l.lengthSq()>0&&l.normalize();const c=new P(0,0,-1).applyAxisAngle(new P(0,1,0),this.player.rotation.yaw),h=new P(1,0,0).applyAxisAngle(new P(0,1,0),this.player.rotation.yaw),f=(c.x*l.y+h.x*l.x)*o,d=(c.z*l.y+h.z*l.x)*o,p=this.player.isGrounded?15:2.5;this.player.velocity.x+=(f-this.player.velocity.x)*p*e,this.player.velocity.z+=(d-this.player.velocity.z)*p*e,this.keys.Space&&this.player.isGrounded&&!t&&(this.player.velocity.y=6.2,this.player.isGrounded=!1,pt.playFootstep(.6)),this.player.velocity.y-=19.6*e;const v=this.player.position.clone();v.x+=this.player.velocity.x*e,v.y+=this.player.velocity.y*e,v.z+=this.player.velocity.z*e;const x=this.map.checkEntityCollision(v,.45,s?1.2:1.8);this.player.position.copy(x.position),this.player.isGrounded=x.isGrounded,x.isGrounded&&this.player.velocity.y<0&&(this.player.velocity.y=0),this.shootTimer-=e,this.mouseButtons[0]&&this.isPointerLocked&&!t&&this.handlePlayerFire(),this.handlePlayerInteractions(e);const m=new Ce(this.player.velocity.x,this.player.velocity.z).length();this.viewModel.update(e,m,this.player.isGrounded,this.player.isScoped)}handlePlayerFire(){const e=this.player.currentWeapon,t=an[e],i=this.player.inventory.ammo[e];if(this.player.isReloading||this.shootTimer>0)return;if(e==="knife"){this.shootTimer=1/t.fireRate,pt.playKnifeSlash(),this.viewModel.triggerShoot(.02,.01);const o=this.camera.position.clone(),l=new P(0,0,-1).applyQuaternion(this.camera.quaternion);this.fireBullet(this.player,o,l,"knife");return}if(e==="c4")return;if(i.current<=0){this.reloadPlayerWeapon();return}i.current--,this.shootTimer=1/t.fireRate,this.player.rotation.pitch+=t.recoilPitch*.4,this.player.rotation.yaw+=(Math.random()-.5)*t.recoilYaw*.4,this.viewModel.triggerShoot(t.recoilPitch,t.recoilYaw),pt.playWeaponShot(e);const r=new Ce(this.player.velocity.x,this.player.velocity.z).length();let s=t.spreadBase+(r>1?t.spreadMove:0);this.player.isScoped&&(s=t.scopedSpread);const a=new P(0,0,-1).applyQuaternion(this.camera.quaternion);a.x+=(Math.random()-.5)*s,a.y+=(Math.random()-.5)*s,a.z+=(Math.random()-.5)*s,a.normalize(),this.fireBullet(this.player,this.camera.position.clone(),a,e)}handlePlayerInteractions(e){const t=this.keys.KeyE&&this.isPointerLocked;if(this.player.team==="T"&&this.player.inventory.c4&&!this.roundState.bombState.isPlanted){const i=this.map.getBombSiteAt(this.player.position);if(i&&t){this.player.isPlanting=!0,this.actionTimer+=e,pt.playC4Planting(.4),this.callbacks.onPlantProgress(this.actionTimer/3),this.actionTimer>=3&&(this.player.isPlanting=!1,this.player.inventory.c4=!1,this.actionTimer=0,this.callbacks.onPlantProgress(0),this.spawnPlantedC4(this.player.position.clone(),i));return}}if(this.player.team==="CT"&&this.roundState.bombState.isPlanted&&this.roundState.bombState.position&&this.player.position.distanceTo(this.roundState.bombState.position)<2.8&&t){this.player.isDefusing=!0,this.actionTimer+=e,pt.playC4Defusing(.5);const r=this.player.hasDefuseKit?5:10;this.callbacks.onDefuseProgress(this.actionTimer/r),this.actionTimer>=r&&(this.player.isDefusing=!1,this.actionTimer=0,this.callbacks.onDefuseProgress(0),this.defuseC4Success());return}this.player.isPlanting=!1,this.player.isDefusing=!1,this.actionTimer>0&&(this.actionTimer=0,this.callbacks.onPlantProgress(0),this.callbacks.onDefuseProgress(0))}updateBots(e){const t=this.roundState.bombState.isPlanted,i=this.roundState.bombState.position;this.bots.forEach(r=>{if(r.update(e,this.allEntities,t,i,(s,a,o,l)=>{this.fireBullet(s,a,o,l)}),r.state.isPlanting&&r.actionTimer>=3){const s=this.map.getBombSiteAt(r.state.position)||"A";this.spawnPlantedC4(r.state.position.clone(),s)}if(r.state.isDefusing){const s=r.state.hasDefuseKit?5:10;r.actionTimer>=s&&this.defuseC4Success()}})}updateVisualEffects(e){for(let t=this.tracers.length-1;t>=0;t--){const i=this.tracers[t];i.life-=e;const r=i.line.material;r.opacity=i.life/i.maxLife,i.life<=0&&(this.scene.remove(i.line),this.tracers.splice(t,1))}for(let t=this.particles.length-1;t>=0;t--){const i=this.particles[t];i.life-=e,i.mesh.position.addScaledVector(i.vel,e),i.vel.y-=9.8*e,i.mesh.scale.multiplyScalar(.95),i.life<=0&&(this.scene.remove(i.mesh),this.particles.splice(t,1))}this.screenShake>0&&(this.screenShake=Math.max(0,this.screenShake-e*1.5))}updateCamera(e){if(this.isSpectating){const i=this.bots.find(r=>r.state.id===this.spectatingTargetId&&r.state.isAlive);if(i){const r=i.state.position.clone().add(new P(0,1.8,0)),s=i.state.rotation.yaw,a=new P(.5,.4,2.2).applyAxisAngle(new P(0,1,0),s);this.camera.position.copy(r.clone().add(a)),this.camera.lookAt(r)}else this.cycleSpectatorTarget();return}const t=this.player.position.y+(this.player.isCrouching?1.1:this.playerEyeHeight);this.camera.position.set(this.player.position.x,t,this.player.position.z),this.screenShake>0&&(this.camera.position.x+=(Math.random()-.5)*this.screenShake,this.camera.position.y+=(Math.random()-.5)*this.screenShake,this.camera.position.z+=(Math.random()-.5)*this.screenShake),this.camera.rotation.set(0,0,0),this.camera.rotation.y=this.player.rotation.yaw,this.camera.rotation.x=this.player.rotation.pitch}updateEntityList(){this.allEntities=[this.player,...this.bots.map(e=>e.state)]}destroy(){this.animFrameId&&cancelAnimationFrame(this.animFrameId),window.removeEventListener("resize",this.onWindowResize),this.renderer.dispose()}}const e1=({player:n,allEntities:e,round:t})=>{const s=(a,o)=>{const l=(a+70)/140*160+15,c=(-o+75)/150*160+15;return{x:l,y:c}};return b.jsxs("div",{className:"relative w-[190px] h-[190px] bg-[#0c121e]/85 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden pointer-events-none select-none",children:[b.jsxs("svg",{className:"absolute inset-0 w-full h-full",viewBox:"0 0 190 190",children:[b.jsx("rect",{x:"75",y:"150",width:"40",height:"25",fill:"#1e293b",rx:"4",opacity:"0.6"}),b.jsx("text",{x:"95",y:"166",fill:"#94a3b8",fontSize:"8",fontWeight:"600",textAnchor:"middle",children:"T SPAWN"}),b.jsx("path",{d:"M 125 145 L 155 145 L 155 55 L 130 55",fill:"none",stroke:"#334155",strokeWidth:"12",strokeLinecap:"round",strokeLinejoin:"round"}),b.jsx("text",{x:"160",y:"105",fill:"#64748b",fontSize:"7",fontWeight:"bold",children:"LONG A"}),b.jsx("rect",{x:"110",y:"32",width:"30",height:"28",fill:"#1e293b",rx:"4",stroke:"#eab308",strokeWidth:"1.5"}),b.jsx("text",{x:"125",y:"50",fill:"#eab308",fontSize:"13",fontWeight:"bold",textAnchor:"middle",children:"A"}),b.jsx("path",{d:"M 95 105 L 115 105 L 115 55 L 110 55",fill:"none",stroke:"#334155",strokeWidth:"8",strokeLinecap:"round",strokeLinejoin:"round"}),b.jsx("path",{d:"M 95 140 L 95 65",fill:"none",stroke:"#334155",strokeWidth:"12",strokeLinecap:"round"}),b.jsx("line",{x1:"88",y1:"90",x2:"102",y2:"90",stroke:"#f59e0b",strokeWidth:"2",strokeDasharray:"2,2"}),b.jsx("text",{x:"95",y:"85",fill:"#64748b",fontSize:"7",fontWeight:"bold",textAnchor:"middle",children:"MID"}),b.jsx("path",{d:"M 65 140 L 45 140 L 45 60 L 35 60",fill:"none",stroke:"#334155",strokeWidth:"10",strokeLinecap:"round",strokeLinejoin:"round"}),b.jsx("text",{x:"32",y:"105",fill:"#64748b",fontSize:"7",fontWeight:"bold",children:"TUNNELS"}),b.jsx("rect",{x:"15",y:"35",width:"30",height:"32",fill:"#1e293b",rx:"4",stroke:"#eab308",strokeWidth:"1.5"}),b.jsx("text",{x:"30",y:"54",fill:"#eab308",fontSize:"13",fontWeight:"bold",textAnchor:"middle",children:"B"}),b.jsx("rect",{x:"75",y:"15",width:"40",height:"22",fill:"#1e293b",rx:"4",opacity:"0.6"}),b.jsx("text",{x:"95",y:"29",fill:"#94a3b8",fontSize:"8",fontWeight:"600",textAnchor:"middle",children:"CT SPAWN"}),t.bombState.isPlanted&&t.bombState.position&&b.jsx("g",{children:(()=>{const a=s(t.bombState.position.x,t.bombState.position.z);return b.jsxs("g",{transform:`translate(${a.x}, ${a.y})`,className:"animate-pulse",children:[b.jsx("circle",{r:"7",fill:"#ef4444",opacity:"0.4"}),b.jsx("circle",{r:"4",fill:"#ef4444"}),b.jsx("text",{y:"3",fill:"#ffffff",fontSize:"7",fontWeight:"bold",textAnchor:"middle",children:"C4"})]})})()}),t.bombState.isDropped&&t.bombState.droppedPosition&&b.jsx("g",{children:(()=>{const a=s(t.bombState.droppedPosition.x,t.bombState.droppedPosition.z);return b.jsxs("g",{transform:`translate(${a.x}, ${a.y})`,children:[b.jsx("circle",{r:"4",fill:"#f59e0b"}),b.jsx("text",{y:"3",fill:"#000",fontSize:"6",fontWeight:"bold",textAnchor:"middle",children:"C4"})]})})()}),e.map(a=>{if(!a.isAlive)return null;const o=s(a.position.x,a.position.z),l=a.isPlayer,c=a.team===n.team;if(!c&&!l&&n.position.distanceTo(a.position)>35)return null;const h=a.team==="CT"?"#38bdf8":"#fb923c";return b.jsx("g",{transform:`translate(${o.x}, ${o.y})`,children:l?b.jsx("g",{transform:`rotate(${-a.rotation.yaw*180/Math.PI})`,children:b.jsx("polygon",{points:"0,-7 5,5 0,2 -5,5",fill:"#22c55e",stroke:"#ffffff",strokeWidth:"1"})}):b.jsxs("g",{children:[b.jsx("circle",{r:c?3.5:3,fill:h,stroke:"#ffffff",strokeWidth:"0.8"}),b.jsx("line",{x1:"0",y1:"0",x2:-Math.sin(a.rotation.yaw)*6,y2:-Math.cos(a.rotation.yaw)*6,stroke:h,strokeWidth:"1",opacity:"0.8"})]})},a.id)})]}),b.jsx("div",{className:"absolute inset-0 rounded-2xl border border-sky-400/20 pointer-events-none"}),b.jsx("div",{className:"absolute top-2 left-2 text-[10px] font-mono font-bold text-slate-400 tracking-wider",children:"RADAR // DUST II"})]})},t1=({entries:n})=>b.jsx("div",{className:"fixed top-5 right-5 z-40 flex flex-col items-end gap-1.5 pointer-events-none select-none",children:n.slice(-5).map(e=>{const t=e.killerTeam==="CT"?"text-sky-400":"text-amber-400",i=e.victimTeam==="CT"?"text-sky-400":"text-amber-400";return b.jsxs("div",{className:"flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-xs font-mono font-bold shadow-lg animate-slide-in",children:[b.jsx("span",{className:`${t} tracking-wide`,children:e.killerName}),b.jsx("span",{className:"px-1.5 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] uppercase",children:e.weapon}),e.isHeadshot&&b.jsx("span",{className:"text-red-500 text-xs font-black",title:"Headshot",children:"🎯"}),e.isNoScope&&b.jsx("span",{className:"text-purple-400 text-xs font-black",title:"No Scope",children:"⚡"}),b.jsx("span",{className:`${i} tracking-wide`,children:e.victimName})]},e.id)})}),n1=({weaponId:n,isScoped:e,isCrouching:t,speed:i})=>{if(e&&n==="awp")return null;const r=5,s=Math.min(18,i*2.5),a=t?-2:0,o=Math.max(3,r+s+a),l=9,c=2,h="#22c55e";return b.jsx("div",{className:"fixed inset-0 pointer-events-none z-20 flex items-center justify-center select-none",children:b.jsxs("div",{className:"relative w-0 h-0 flex items-center justify-center",children:[b.jsx("div",{className:"absolute rounded-full",style:{width:2,height:2,backgroundColor:h,boxShadow:"0 0 1px black"}}),b.jsx("div",{className:"absolute",style:{width:c,height:l,backgroundColor:h,top:-(o+l),left:-c/2,boxShadow:"0 0 1px black"}}),b.jsx("div",{className:"absolute",style:{width:c,height:l,backgroundColor:h,top:o,left:-c/2,boxShadow:"0 0 1px black"}}),b.jsx("div",{className:"absolute",style:{width:l,height:c,backgroundColor:h,left:-(o+l),top:-c/2,boxShadow:"0 0 1px black"}}),b.jsx("div",{className:"absolute",style:{width:l,height:c,backgroundColor:h,left:o,top:-c/2,boxShadow:"0 0 1px black"}})]})})},i1=({isScoped:n})=>n?b.jsxs("div",{className:"fixed inset-0 pointer-events-none z-30 select-none flex items-center justify-center",children:[b.jsx("div",{className:"absolute inset-0 bg-black",style:{maskImage:"radial-gradient(circle at center, transparent 38vmin, black 40vmin)",WebkitMaskImage:"radial-gradient(circle at center, transparent 38vmin, black 40vmin)"}}),b.jsxs("div",{className:"relative w-[76vmin] h-[76vmin] rounded-full border border-black/80 flex items-center justify-center overflow-hidden",children:[b.jsx("div",{className:"absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.8)] rounded-full"}),b.jsx("div",{className:"absolute w-full h-[1px] bg-black/90 shadow-[0_0_1px_black]"}),b.jsx("div",{className:"absolute h-full w-[1px] bg-black/90 shadow-[0_0_1px_black]"}),b.jsx("div",{className:"absolute w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"}),[-80,-50,-25,25,50,80].map(e=>b.jsx("div",{className:"absolute h-3 w-[1px] bg-black/80",style:{transform:`translateX(${e}px)`}},e)),[-80,-50,-25,25,50,80].map(e=>b.jsx("div",{className:"absolute w-3 h-[1px] bg-black/80",style:{transform:`translateY(${e}px)`}},e))]})]}):null,r1=({player:n,round:e,allEntities:t,spectatingEntity:i,isSpectating:r,killfeed:s,damageFlash:a,plantProgress:o,defuseProgress:l,onOpenBuyMenu:c,onOpenControls:h,onTakeOverBot:f})=>{const d=an[n.currentWeapon],p=n.inventory.ammo[n.currentWeapon],v=t.filter(u=>u.team==="CT"),x=t.filter(u=>u.team==="T");v.filter(u=>u.isAlive).length,x.filter(u=>u.isAlive).length;const m=u=>{const _=Math.floor(u/60),g=Math.floor(u%60);return`${_}:${g<10?"0":""}${g}`};return b.jsxs("div",{className:"fixed inset-0 pointer-events-none z-10 select-none flex flex-col justify-between p-6",children:[b.jsx(i1,{isScoped:n.isScoped}),b.jsx(n1,{weaponId:n.currentWeapon,isScoped:n.isScoped,isCrouching:n.isCrouching,speed:s1(n.velocity.x,n.velocity.z)}),b.jsx("div",{className:`fixed inset-0 pointer-events-none z-20 transition-opacity duration-150 ${a?"opacity-100":"opacity-0"}`,style:{boxShadow:"inset 0 0 100px rgba(220, 38, 38, 0.65)",backgroundColor:"rgba(220, 38, 38, 0.1)"}}),b.jsx(t1,{entries:s}),b.jsxs("div",{className:"flex items-start justify-between",children:[b.jsx(e1,{player:n,allEntities:t,round:e}),b.jsxs("div",{className:"flex items-center gap-4 bg-[#0a0f1d]/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl",children:[b.jsx("div",{className:"flex items-center gap-1.5",children:v.map(u=>b.jsx("div",{className:`w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] font-bold ${u.isAlive?"bg-sky-950 border-sky-400/60 text-sky-200":"bg-black/60 border-white/5 text-slate-600 opacity-40"}`,title:`${u.name} (${u.isAlive?`${u.health} HP`:"Dead"})`,children:u.isPlayer?"★":"CT"},u.id))}),b.jsxs("div",{className:"flex items-center gap-4 px-4 border-x border-white/10",children:[b.jsx("span",{className:"text-2xl font-black text-sky-400 font-['Chakra_Petch']",children:e.scoreCT}),b.jsxs("div",{className:"flex flex-col items-center min-w-[70px]",children:[e.status==="bomb_planted"?b.jsxs("div",{className:"flex items-center gap-1 text-red-500 font-mono font-black animate-pulse",children:[b.jsx("span",{className:"text-sm",children:"💣"}),b.jsxs("span",{className:"text-lg",children:[e.bombState.timer.toFixed(1),"s"]})]}):b.jsx("span",{className:"text-lg font-mono font-bold text-slate-100",children:m(e.timer)}),b.jsx("span",{className:"text-[9px] font-mono uppercase tracking-widest text-slate-400",children:e.status==="freezetime"?"FREEZETIME":e.status==="bomb_planted"?"PLANTED":`ROUND ${e.roundNumber}`})]}),b.jsx("span",{className:"text-2xl font-black text-amber-400 font-['Chakra_Petch']",children:e.scoreT})]}),b.jsx("div",{className:"flex items-center gap-1.5",children:x.map(u=>b.jsx("div",{className:`w-7 h-7 rounded-lg border flex items-center justify-center text-[11px] font-bold ${u.isAlive?"bg-amber-950 border-amber-400/60 text-amber-200":"bg-black/60 border-white/5 text-slate-600 opacity-40"}`,title:`${u.name} (${u.isAlive?`${u.health} HP`:"Dead"})`,children:u.inventory.c4?"💣":"T"},u.id))})]}),b.jsxs("div",{className:"flex items-center gap-2 pointer-events-auto",children:[b.jsx("button",{onClick:c,className:"px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold transition-all shadow-lg backdrop-blur-md",children:"ARSENAL [B]"}),b.jsx("button",{onClick:h,className:"px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 text-xs font-mono font-bold transition-all shadow-lg backdrop-blur-md",children:"CONTROLS [?]"})]})]}),b.jsxs("div",{className:"flex flex-col items-center justify-center gap-3",children:[o>0&&b.jsxs("div",{className:"flex flex-col items-center gap-1 bg-black/80 px-6 py-3 rounded-2xl border border-red-500/40 backdrop-blur-md",children:[b.jsx("span",{className:"text-xs font-mono font-bold text-red-400 tracking-wider",children:"PLANTING C4 EXPLOSIVE..."}),b.jsx("div",{className:"w-48 h-2.5 rounded-full bg-white/10 overflow-hidden",children:b.jsx("div",{className:"h-full bg-red-500 transition-all duration-75",style:{width:`${o*100}%`}})})]}),l>0&&b.jsxs("div",{className:"flex flex-col items-center gap-1 bg-black/80 px-6 py-3 rounded-2xl border border-sky-500/40 backdrop-blur-md",children:[b.jsx("span",{className:"text-xs font-mono font-bold text-sky-400 tracking-wider",children:"DEFUSING C4 BOMB..."}),b.jsx("div",{className:"w-48 h-2.5 rounded-full bg-white/10 overflow-hidden",children:b.jsx("div",{className:"h-full bg-sky-400 transition-all duration-75",style:{width:`${l*100}%`}})})]}),e.status==="round_end"&&b.jsxs("div",{className:"bg-black/90 px-10 py-6 rounded-3xl border border-white/20 shadow-2xl flex flex-col items-center gap-1.5 animate-bounce-short backdrop-blur-lg",children:[b.jsx("h2",{className:`text-3xl font-black font-['Chakra_Petch'] uppercase tracking-widest ${e.winner==="CT"?"text-sky-400":"text-amber-400"}`,children:e.winner==="CT"?"COUNTER-TERRORISTS WIN":"TERRORISTS WIN"}),b.jsx("p",{className:"text-sm font-mono text-slate-300",children:e.winReason})]}),r&&b.jsxs("div",{className:"flex flex-col items-center gap-2 bg-[#0b1329]/95 px-8 py-4 rounded-2xl border border-sky-400/40 shadow-2xl backdrop-blur-lg pointer-events-auto",children:[b.jsxs("div",{className:"text-xs font-mono text-slate-400",children:["SPECTATING TEAMMATE:"," ",b.jsx("span",{className:"text-sky-300 font-bold",children:(i==null?void 0:i.name)||"Teammate"})]}),b.jsx("button",{onClick:f,className:"px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-mono font-bold text-sm shadow-lg hover:brightness-110 active:scale-95 transition-all",children:"PRESS [E] OR CLICK TO TAKE OVER BOT"}),b.jsx("div",{className:"text-[10px] text-slate-400",children:"Left click to switch between surviving teammates"})]})]}),b.jsxs("div",{className:"flex items-end justify-between",children:[b.jsxs("div",{className:"flex items-center gap-3 bg-[#0a0f1d]/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl",children:[b.jsxs("div",{className:"flex items-center gap-3",children:[b.jsx("div",{className:"flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 text-red-500 font-black text-lg",children:"+"}),b.jsxs("div",{className:"flex flex-col",children:[b.jsx("span",{className:"text-3xl font-black text-white font-['Chakra_Petch'] leading-none",children:n.isAlive?n.health:0}),b.jsx("span",{className:"text-[10px] font-mono text-slate-400 tracking-wider",children:"HEALTH"})]})]}),b.jsx("div",{className:"h-8 w-[1px] bg-white/10 mx-2"}),b.jsxs("div",{className:"flex items-center gap-3",children:[b.jsx("div",{className:"flex items-center justify-center w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 font-black text-lg",children:"🛡️"}),b.jsxs("div",{className:"flex flex-col",children:[b.jsxs("div",{className:"flex items-center gap-1.5",children:[b.jsx("span",{className:"text-3xl font-black text-white font-['Chakra_Petch'] leading-none",children:n.armor}),n.hasHelmet&&b.jsx("span",{className:"text-[10px] px-1.5 py-0.5 rounded bg-sky-500/30 text-sky-300 font-mono font-bold",children:"HELMET"})]}),b.jsx("span",{className:"text-[10px] font-mono text-slate-400 tracking-wider",children:"ARMOR"})]})]})]}),b.jsxs("div",{className:"flex items-center gap-2 bg-[#0a0f1d]/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10",children:[b.jsxs("div",{className:`px-3 py-1 rounded-lg text-xs font-mono font-bold ${n.inventory.currentSlot==="primary"?"bg-sky-500 text-black shadow-md":"text-slate-400"}`,children:["[1] ",n.inventory.primary?n.inventory.primary.toUpperCase():"---"]}),b.jsxs("div",{className:`px-3 py-1 rounded-lg text-xs font-mono font-bold ${n.inventory.currentSlot==="secondary"?"bg-sky-500 text-black shadow-md":"text-slate-400"}`,children:["[2] ",n.inventory.secondary.toUpperCase()]}),b.jsx("div",{className:`px-3 py-1 rounded-lg text-xs font-mono font-bold ${n.inventory.currentSlot==="knife"?"bg-sky-500 text-black shadow-md":"text-slate-400"}`,children:"[3] KNIFE"}),n.inventory.c4&&b.jsx("div",{className:`px-3 py-1 rounded-lg text-xs font-mono font-bold ${n.inventory.currentSlot==="c4"?"bg-red-500 text-white shadow-md":"text-red-400"}`,children:"[4] C4"})]}),b.jsxs("div",{className:"flex items-center gap-4 bg-[#0a0f1d]/90 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shadow-2xl",children:[b.jsxs("div",{className:"flex flex-col items-end",children:[b.jsx("span",{className:"text-xl font-bold font-['Chakra_Petch'] text-sky-400 uppercase",children:d.name}),b.jsx("span",{className:"text-[10px] font-mono text-slate-400",children:n.isReloading?"RELOADING...":n.isScoped?"SCOPED":"READY"})]}),b.jsx("div",{className:"h-8 w-[1px] bg-white/10"}),b.jsx("div",{className:"flex items-baseline gap-1.5 font-['Chakra_Petch']",children:n.currentWeapon!=="knife"&&n.currentWeapon!=="c4"?b.jsxs(b.Fragment,{children:[b.jsx("span",{className:"text-4xl font-black text-white",children:p.current}),b.jsxs("span",{className:"text-xl font-bold text-slate-500",children:["/ ",p.reserve]})]}):b.jsx("span",{className:"text-3xl font-black text-slate-400",children:"∞"})})]})]})]})};function s1(n,e){return Math.sqrt(n*n+e*e)}const a1=({isOpen:n,onClose:e,onBuyWeapon:t,onBuyGear:i,onTogglePistolRound:r,isPistolRound:s})=>{if(!n)return null;const a=["ak47","m4a4","awp"],o=["deagle","glock","usp"];return b.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md select-none",children:b.jsxs("div",{className:"w-[850px] max-w-[95vw] rounded-3xl bg-[#0f172a]/95 border border-white/10 p-8 shadow-2xl text-white",children:[b.jsxs("div",{className:"flex items-center justify-between border-b border-white/10 pb-4 mb-6",children:[b.jsxs("div",{children:[b.jsx("h2",{className:"text-2xl font-black tracking-wider uppercase font-['Chakra_Petch'] text-sky-400",children:"EQUIPMENT & LOADOUT MENU"}),b.jsx("p",{className:"text-xs text-slate-400 font-mono mt-0.5",children:"Select weapons and tactical armor for the round"})]}),b.jsxs("div",{className:"flex items-center gap-3",children:[b.jsx("button",{onClick:r,className:`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${s?"bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30":"bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"}`,children:s?"✓ PISTOL ROUND MODE (ACTIVE)":"START PISTOL ROUND"}),b.jsx("button",{onClick:e,className:"px-4 py-2 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold hover:bg-red-500/30 transition-all",children:"CLOSE [B]"})]})]}),b.jsxs("div",{className:"grid grid-cols-3 gap-6",children:[b.jsxs("div",{className:"space-y-3",children:[b.jsx("h3",{className:"text-xs font-mono font-bold text-slate-400 tracking-wider uppercase border-b border-white/5 pb-1.5",children:"PRIMARY RIFLES"}),a.map(l=>{const c=an[l];return b.jsxs("button",{onClick:()=>{t(l),e()},className:"w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-400/50 hover:bg-sky-500/10 transition-all group",children:[b.jsxs("div",{className:"flex justify-between items-center",children:[b.jsx("span",{className:"font-bold text-sm text-slate-100 group-hover:text-sky-300",children:c.name}),b.jsxs("span",{className:"text-xs font-mono font-bold text-emerald-400",children:["$",c.price]})]}),b.jsxs("div",{className:"text-[11px] text-slate-400 font-mono mt-1",children:["DMG ",c.damage," • RPM ",Math.round(c.fireRate*60)," • MAG ",c.magSize]})]},l)})]}),b.jsxs("div",{className:"space-y-3",children:[b.jsx("h3",{className:"text-xs font-mono font-bold text-slate-400 tracking-wider uppercase border-b border-white/5 pb-1.5",children:"SECONDARY PISTOLS"}),o.map(l=>{const c=an[l];return b.jsxs("button",{onClick:()=>{t(l),e()},className:"w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-400/50 hover:bg-amber-500/10 transition-all group",children:[b.jsxs("div",{className:"flex justify-between items-center",children:[b.jsx("span",{className:"font-bold text-sm text-slate-100 group-hover:text-amber-300",children:c.name}),b.jsxs("span",{className:"text-xs font-mono font-bold text-emerald-400",children:["$",c.price]})]}),b.jsxs("div",{className:"text-[11px] text-slate-400 font-mono mt-1",children:["DMG ",c.damage," • RPM ",Math.round(c.fireRate*60)," • MAG ",c.magSize]})]},l)})]}),b.jsxs("div",{className:"space-y-3",children:[b.jsx("h3",{className:"text-xs font-mono font-bold text-slate-400 tracking-wider uppercase border-b border-white/5 pb-1.5",children:"GEAR & DEFENSE"}),b.jsxs("button",{onClick:()=>{i("armor"),e()},className:"w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all group",children:[b.jsxs("div",{className:"flex justify-between items-center",children:[b.jsx("span",{className:"font-bold text-sm text-slate-100 group-hover:text-emerald-300",children:"Kevlar Body Armor"}),b.jsx("span",{className:"text-xs font-mono font-bold text-emerald-400",children:"$650"})]}),b.jsx("div",{className:"text-[11px] text-slate-400 font-mono mt-1",children:"Reduces torso & body ballistic damage"})]}),b.jsxs("button",{onClick:()=>{i("helmet"),e()},className:"w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-400/50 hover:bg-emerald-500/10 transition-all group",children:[b.jsxs("div",{className:"flex justify-between items-center",children:[b.jsx("span",{className:"font-bold text-sm text-slate-100 group-hover:text-emerald-300",children:"Helmet + Kevlar Vest"}),b.jsx("span",{className:"text-xs font-mono font-bold text-emerald-400",children:"$1000"})]}),b.jsx("div",{className:"text-[11px] text-slate-400 font-mono mt-1",children:"Prevents 1-shot headshot kills from M4 & pistols"})]}),b.jsxs("button",{onClick:()=>{i("kit"),e()},className:"w-full text-left p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-400/50 hover:bg-blue-500/10 transition-all group",children:[b.jsxs("div",{className:"flex justify-between items-center",children:[b.jsx("span",{className:"font-bold text-sm text-slate-100 group-hover:text-blue-300",children:"Defusal Kit (CT)"}),b.jsx("span",{className:"text-xs font-mono font-bold text-emerald-400",children:"$400"})]}),b.jsx("div",{className:"text-[11px] text-slate-400 font-mono mt-1",children:"Reduces bomb defusal time from 10s down to 5s"})]})]})]}),b.jsxs("div",{className:"mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-slate-400",children:[b.jsx("div",{children:"Press [B] during match anytime to re-open this armory"}),b.jsx("div",{className:"text-sky-400 font-semibold",children:"DUST II TACTICAL ARSENAL"})]})]})})},o1=({isOpen:n,round:e,allEntities:t})=>{if(!n)return null;const i=t.filter(s=>s.team==="CT"),r=t.filter(s=>s.team==="T");return b.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md select-none",children:b.jsxs("div",{className:"w-[850px] max-w-[95vw] rounded-3xl bg-[#0d1424]/95 border border-white/15 p-6 shadow-2xl text-white font-mono",children:[b.jsxs("div",{className:"flex items-center justify-between border-b border-white/10 pb-4 mb-4",children:[b.jsx("div",{className:"flex items-center gap-3",children:b.jsxs("span",{className:"text-xl font-bold font-['Chakra_Petch'] text-sky-400",children:["COUNTER-TERRORISTS: ",e.scoreCT]})}),b.jsxs("div",{className:"flex flex-col items-center",children:[b.jsxs("span",{className:"text-2xl font-black text-white font-['Chakra_Petch']",children:["ROUND ",e.roundNumber]}),b.jsx("span",{className:"text-xs text-amber-400 uppercase tracking-widest font-bold",children:e.status==="freezetime"?"FREEZETIME":e.status==="bomb_planted"?"BOMB PLANTED":"LIVE"})]}),b.jsx("div",{className:"flex items-center gap-3",children:b.jsxs("span",{className:"text-xl font-bold font-['Chakra_Petch'] text-amber-400",children:["TERRORISTS: ",e.scoreT]})})]}),b.jsxs("div",{className:"mb-6",children:[b.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-sky-950/60 rounded-t-xl border border-sky-500/20 text-xs font-bold text-sky-300",children:[b.jsx("span",{className:"w-48",children:"COUNTER-TERRORIST TEAM"}),b.jsx("span",{className:"w-16 text-center",children:"STATUS"}),b.jsx("span",{className:"w-16 text-center",children:"KILLS"}),b.jsx("span",{className:"w-16 text-center",children:"DEATHS"}),b.jsx("span",{className:"w-16 text-center",children:"SCORE"}),b.jsx("span",{className:"w-16 text-center",children:"PING"})]}),b.jsx("div",{className:"divide-y divide-white/5 border-x border-b border-white/10 rounded-b-xl overflow-hidden bg-black/40",children:i.map(s=>b.jsxs("div",{className:`flex items-center justify-between px-4 py-2.5 text-xs ${s.isPlayer?"bg-sky-500/15 font-bold text-sky-200":"text-slate-300"} ${s.isAlive?"":"opacity-40 line-through"}`,children:[b.jsxs("span",{className:"w-48 flex items-center gap-2",children:[b.jsx("span",{className:"w-2 h-2 rounded-full bg-sky-400"}),s.name," ",s.isPlayer&&"⭐ (YOU)"]}),b.jsx("span",{className:"w-16 text-center font-bold",children:s.isAlive?b.jsxs("span",{className:"text-emerald-400",children:[s.health," HP"]}):b.jsx("span",{className:"text-red-400",children:"DEAD"})}),b.jsx("span",{className:"w-16 text-center font-bold text-white",children:s.kills}),b.jsx("span",{className:"w-16 text-center text-slate-400",children:s.deaths}),b.jsx("span",{className:"w-16 text-center font-bold text-amber-400",children:s.score}),b.jsxs("span",{className:"w-16 text-center text-slate-400",children:[s.ping,"ms"]})]},s.id))})]}),b.jsxs("div",{children:[b.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-amber-950/60 rounded-t-xl border border-amber-500/20 text-xs font-bold text-amber-300",children:[b.jsx("span",{className:"w-48",children:"TERRORIST TEAM"}),b.jsx("span",{className:"w-16 text-center",children:"STATUS"}),b.jsx("span",{className:"w-16 text-center",children:"KILLS"}),b.jsx("span",{className:"w-16 text-center",children:"DEATHS"}),b.jsx("span",{className:"w-16 text-center",children:"SCORE"}),b.jsx("span",{className:"w-16 text-center",children:"PING"})]}),b.jsx("div",{className:"divide-y divide-white/5 border-x border-b border-white/10 rounded-b-xl overflow-hidden bg-black/40",children:r.map(s=>b.jsxs("div",{className:`flex items-center justify-between px-4 py-2.5 text-xs ${s.isPlayer?"bg-amber-500/15 font-bold text-amber-200":"text-slate-300"} ${s.isAlive?"":"opacity-40 line-through"}`,children:[b.jsxs("span",{className:"w-48 flex items-center gap-2",children:[b.jsx("span",{className:"w-2 h-2 rounded-full bg-amber-400"}),s.name," ",s.inventory.c4&&"💣"]}),b.jsx("span",{className:"w-16 text-center font-bold",children:s.isAlive?b.jsxs("span",{className:"text-emerald-400",children:[s.health," HP"]}):b.jsx("span",{className:"text-red-400",children:"DEAD"})}),b.jsx("span",{className:"w-16 text-center font-bold text-white",children:s.kills}),b.jsx("span",{className:"w-16 text-center text-slate-400",children:s.deaths}),b.jsx("span",{className:"w-16 text-center font-bold text-amber-400",children:s.score}),b.jsxs("span",{className:"w-16 text-center text-slate-400",children:[s.ping,"ms"]})]},s.id))})]}),b.jsx("div",{className:"mt-4 text-center text-xs text-slate-400",children:"Hold [TAB] to view scoreboard"})]})})},l1=({isOpen:n,onClose:e})=>{if(!n)return null;const t=[{key:"W A S D",desc:"Move Forward / Left / Back / Right"},{key:"Mouse",desc:"Look / Turn view"},{key:"Left Click",desc:"Fire Weapon / Slash Knife"},{key:"Right Click",desc:"AWP Sniper Scope Toggle"},{key:"Space",desc:"Jump / Takeover Bot when dead"},{key:"Shift / Ctrl",desc:"Walk (Silent) / Crouch"},{key:"R",desc:"Reload Ammo"},{key:"1, 2, 3, 4",desc:"Select Primary / Pistol / Knife / C4"},{key:"E",desc:"Plant C4 (T) / Defuse C4 (CT) / Take control of bot"},{key:"B",desc:"Open Arsenal & Loadout Buy Menu"},{key:"Tab",desc:"Show 5v5 Scoreboard & KDA"}];return b.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md select-none",children:b.jsxs("div",{className:"w-[600px] max-w-[95vw] rounded-3xl bg-[#0f172a]/95 border border-white/10 p-6 shadow-2xl text-white",children:[b.jsxs("div",{className:"flex items-center justify-between border-b border-white/10 pb-4 mb-4",children:[b.jsx("h2",{className:"text-xl font-bold font-['Chakra_Petch'] text-sky-400",children:"CONTROLS & SHORTCUTS"}),b.jsx("button",{onClick:e,className:"px-3 py-1.5 rounded-lg bg-white/10 text-xs font-mono font-bold hover:bg-white/20",children:"CLOSE [ESC]"})]}),b.jsx("div",{className:"grid grid-cols-1 gap-2",children:t.map((i,r)=>b.jsxs("div",{className:"flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5",children:[b.jsx("span",{className:"px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-sky-300 font-mono font-bold text-xs",children:i.key}),b.jsx("span",{className:"text-xs text-slate-300 font-medium",children:i.desc})]},r))})]})})},c1=()=>{var I;const n=Qt.useRef(null),e=Qt.useRef(null),[t,i]=Qt.useState({player:null,round:null,allEntities:[],spectatingEntity:null,isSpectating:!1}),[r,s]=Qt.useState([]),[a,o]=Qt.useState(!1),[l,c]=Qt.useState(0),[h,f]=Qt.useState(0),[d,p]=Qt.useState(!1),[v,x]=Qt.useState(!1),[m,u]=Qt.useState(!1),[_,g]=Qt.useState(!1);Qt.useEffect(()=>{if(!n.current)return;const S=new JT(n.current,{onStateUpdate:q=>{i({player:{...q.player},round:{...q.round},allEntities:[...q.allEntities],spectatingEntity:q.spectatingEntity?{...q.spectatingEntity}:null,isSpectating:q.isSpectating})},onKillFeed:q=>{s(L=>[...L,q])},onDamageTaken:()=>{o(!0),setTimeout(()=>o(!1),120)},onPlantProgress:q=>{c(q)},onDefuseProgress:q=>{f(q)}});e.current=S;const E=()=>{const q=document.pointerLockElement===S.renderer.domElement;g(q),q&&(p(!1),u(!1))};document.addEventListener("pointerlockchange",E);const F=q=>{q.code==="KeyB"&&(p(L=>!L),document.pointerLockElement&&document.exitPointerLock()),q.code==="Tab"&&(q.preventDefault(),x(!0))},z=q=>{q.code==="Tab"&&x(!1)};return window.addEventListener("keydown",F),window.addEventListener("keyup",z),()=>{document.removeEventListener("pointerlockchange",E),window.removeEventListener("keydown",F),window.removeEventListener("keyup",z),S.destroy()}},[]);const y=S=>{var E;(E=e.current)==null||E.buyWeapon(S)},C=S=>{var E;(E=e.current)==null||E.buyGear(S)},T=()=>{var S;(S=e.current)==null||S.startRound(!0),p(!1)},A=()=>{var S;(S=e.current)==null||S.takeOverBot()};return b.jsxs("div",{className:"relative w-screen h-screen overflow-hidden bg-black select-none font-['Inter']",children:[b.jsx("div",{ref:n,className:"absolute inset-0 w-full h-full cursor-crosshair"}),t.player&&t.round&&b.jsx(r1,{player:t.player,round:t.round,allEntities:t.allEntities,spectatingEntity:t.spectatingEntity,isSpectating:t.isSpectating,killfeed:r,damageFlash:a,plantProgress:l,defuseProgress:h,onOpenBuyMenu:()=>{p(!0),document.pointerLockElement&&document.exitPointerLock()},onOpenControls:()=>{u(!0),document.pointerLockElement&&document.exitPointerLock()},onTakeOverBot:A}),!_&&!d&&!m&&b.jsx("div",{onClick:()=>{e.current&&e.current.renderer.domElement.requestPointerLock()},className:"fixed inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm cursor-pointer select-none",children:b.jsxs("div",{className:"flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#0b1329]/95 border border-sky-400/30 shadow-2xl text-center max-w-md animate-fade-in",children:[b.jsx("div",{className:"w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl shadow-inner",children:"🎯"}),b.jsxs("div",{children:[b.jsx("h1",{className:"text-3xl font-black font-['Chakra_Petch'] text-white tracking-wider",children:"DUST II 5v5 PROTOTYPE"}),b.jsx("p",{className:"text-xs text-slate-400 font-mono mt-1",children:"Counter-Strike 5v5 Dust2 Match Engine (Procedural 3D)"})]}),b.jsx("div",{className:"w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-mono font-bold text-sm shadow-lg shadow-sky-500/25",children:"CLICK TO ENTER COMBAT"}),b.jsxs("div",{className:"text-[11px] font-mono text-slate-400 space-y-0.5",children:[b.jsx("div",{children:"WASD Move • Left Click Fire • Right Click Scope"}),b.jsx("div",{children:"[B] Arsenal Loadout • [E] Plant / Defuse • [Tab] Scoreboard"})]})]})}),b.jsx(a1,{isOpen:d,onClose:()=>p(!1),onBuyWeapon:y,onBuyGear:C,onTogglePistolRound:T,isPistolRound:((I=t.round)==null?void 0:I.isPistolRound)||!1}),t.round&&b.jsx(o1,{isOpen:v,round:t.round,allEntities:t.allEntities}),b.jsx(l1,{isOpen:m,onClose:()=>u(!1)})]})};ou.createRoot(document.getElementById("root")).render(b.jsx(w_.StrictMode,{children:b.jsx(c1,{})}));

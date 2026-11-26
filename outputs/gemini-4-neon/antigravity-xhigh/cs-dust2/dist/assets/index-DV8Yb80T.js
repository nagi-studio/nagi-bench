var v_=Object.defineProperty;var __=(n,e,t)=>e in n?v_(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var B=(n,e,t)=>__(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function x_(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var c0={exports:{}},ql={},u0={exports:{}},Ye={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ko=Symbol.for("react.element"),y_=Symbol.for("react.portal"),S_=Symbol.for("react.fragment"),M_=Symbol.for("react.strict_mode"),w_=Symbol.for("react.profiler"),E_=Symbol.for("react.provider"),T_=Symbol.for("react.context"),A_=Symbol.for("react.forward_ref"),b_=Symbol.for("react.suspense"),C_=Symbol.for("react.memo"),P_=Symbol.for("react.lazy"),Bf=Symbol.iterator;function R_(n){return n===null||typeof n!="object"?null:(n=Bf&&n[Bf]||n["@@iterator"],typeof n=="function"?n:null)}var h0={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},d0=Object.assign,f0={};function ks(n,e,t){this.props=n,this.context=e,this.refs=f0,this.updater=t||h0}ks.prototype.isReactComponent={};ks.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};ks.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function p0(){}p0.prototype=ks.prototype;function gd(n,e,t){this.props=n,this.context=e,this.refs=f0,this.updater=t||h0}var vd=gd.prototype=new p0;vd.constructor=gd;d0(vd,ks.prototype);vd.isPureReactComponent=!0;var Hf=Array.isArray,m0=Object.prototype.hasOwnProperty,_d={current:null},g0={key:!0,ref:!0,__self:!0,__source:!0};function v0(n,e,t){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)m0.call(e,i)&&!g0.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=t;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(n&&n.defaultProps)for(i in a=n.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:Ko,type:n,key:s,ref:o,props:r,_owner:_d.current}}function L_(n,e){return{$$typeof:Ko,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function xd(n){return typeof n=="object"&&n!==null&&n.$$typeof===Ko}function N_(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var Gf=/\/+/g;function wc(n,e){return typeof n=="object"&&n!==null&&n.key!=null?N_(""+n.key):e.toString(36)}function Ja(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case Ko:case y_:o=!0}}if(o)return o=n,r=r(o),n=i===""?"."+wc(o,0):i,Hf(r)?(t="",n!=null&&(t=n.replace(Gf,"$&/")+"/"),Ja(r,e,t,"",function(c){return c})):r!=null&&(xd(r)&&(r=L_(r,t+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(Gf,"$&/")+"/")+n)),e.push(r)),1;if(o=0,i=i===""?".":i+":",Hf(n))for(var a=0;a<n.length;a++){s=n[a];var l=i+wc(s,a);o+=Ja(s,e,t,l,r)}else if(l=R_(n),typeof l=="function")for(n=l.call(n),a=0;!(s=n.next()).done;)s=s.value,l=i+wc(s,a++),o+=Ja(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function sa(n,e,t){if(n==null)return n;var i=[],r=0;return Ja(n,i,"","",function(s){return e.call(t,s,r++)}),i}function D_(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var nn={current:null},Qa={transition:null},I_={ReactCurrentDispatcher:nn,ReactCurrentBatchConfig:Qa,ReactCurrentOwner:_d};function _0(){throw Error("act(...) is not supported in production builds of React.")}Ye.Children={map:sa,forEach:function(n,e,t){sa(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return sa(n,function(){e++}),e},toArray:function(n){return sa(n,function(e){return e})||[]},only:function(n){if(!xd(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};Ye.Component=ks;Ye.Fragment=S_;Ye.Profiler=w_;Ye.PureComponent=gd;Ye.StrictMode=M_;Ye.Suspense=b_;Ye.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=I_;Ye.act=_0;Ye.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=d0({},n.props),r=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=_d.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(l in e)m0.call(e,l)&&!g0.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:Ko,type:n.type,key:r,ref:s,props:i,_owner:o}};Ye.createContext=function(n){return n={$$typeof:T_,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:E_,_context:n},n.Consumer=n};Ye.createElement=v0;Ye.createFactory=function(n){var e=v0.bind(null,n);return e.type=n,e};Ye.createRef=function(){return{current:null}};Ye.forwardRef=function(n){return{$$typeof:A_,render:n}};Ye.isValidElement=xd;Ye.lazy=function(n){return{$$typeof:P_,_payload:{_status:-1,_result:n},_init:D_}};Ye.memo=function(n,e){return{$$typeof:C_,type:n,compare:e===void 0?null:e}};Ye.startTransition=function(n){var e=Qa.transition;Qa.transition={};try{n()}finally{Qa.transition=e}};Ye.unstable_act=_0;Ye.useCallback=function(n,e){return nn.current.useCallback(n,e)};Ye.useContext=function(n){return nn.current.useContext(n)};Ye.useDebugValue=function(){};Ye.useDeferredValue=function(n){return nn.current.useDeferredValue(n)};Ye.useEffect=function(n,e){return nn.current.useEffect(n,e)};Ye.useId=function(){return nn.current.useId()};Ye.useImperativeHandle=function(n,e,t){return nn.current.useImperativeHandle(n,e,t)};Ye.useInsertionEffect=function(n,e){return nn.current.useInsertionEffect(n,e)};Ye.useLayoutEffect=function(n,e){return nn.current.useLayoutEffect(n,e)};Ye.useMemo=function(n,e){return nn.current.useMemo(n,e)};Ye.useReducer=function(n,e,t){return nn.current.useReducer(n,e,t)};Ye.useRef=function(n){return nn.current.useRef(n)};Ye.useState=function(n){return nn.current.useState(n)};Ye.useSyncExternalStore=function(n,e,t){return nn.current.useSyncExternalStore(n,e,t)};Ye.useTransition=function(){return nn.current.useTransition()};Ye.version="18.3.1";u0.exports=Ye;var Xn=u0.exports;const U_=x_(Xn);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var z_=Xn,F_=Symbol.for("react.element"),O_=Symbol.for("react.fragment"),k_=Object.prototype.hasOwnProperty,B_=z_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,H_={key:!0,ref:!0,__self:!0,__source:!0};function x0(n,e,t){var i,r={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)k_.call(e,i)&&!H_.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:F_,type:n,key:s,ref:o,props:r,_owner:B_.current}}ql.Fragment=O_;ql.jsx=x0;ql.jsxs=x0;c0.exports=ql;var L=c0.exports,Iu={},y0={exports:{}},wn={},S0={exports:{}},M0={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(N,$){var J=N.length;N.push($);e:for(;0<J;){var Z=J-1>>>1,me=N[Z];if(0<r(me,$))N[Z]=$,N[J]=me,J=Z;else break e}}function t(N){return N.length===0?null:N[0]}function i(N){if(N.length===0)return null;var $=N[0],J=N.pop();if(J!==$){N[0]=J;e:for(var Z=0,me=N.length,Ae=me>>>1;Z<Ae;){var W=2*(Z+1)-1,ne=N[W],le=W+1,se=N[le];if(0>r(ne,J))le<me&&0>r(se,ne)?(N[Z]=se,N[le]=J,Z=le):(N[Z]=ne,N[W]=J,Z=W);else if(le<me&&0>r(se,J))N[Z]=se,N[le]=J,Z=le;else break e}}return $}function r(N,$){var J=N.sortIndex-$.sortIndex;return J!==0?J:N.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();n.unstable_now=function(){return o.now()-a}}var l=[],c=[],h=1,u=null,f=3,p=!1,m=!1,x=!1,v=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function g(N){for(var $=t(c);$!==null;){if($.callback===null)i(c);else if($.startTime<=N)i(c),$.sortIndex=$.expirationTime,e(l,$);else break;$=t(c)}}function S(N){if(x=!1,g(N),!m)if(t(l)!==null)m=!0,k(A);else{var $=t(c);$!==null&&K(S,$.startTime-N)}}function A(N,$){m=!1,x&&(x=!1,d(C),C=-1),p=!0;var J=f;try{for(g($),u=t(l);u!==null&&(!(u.expirationTime>$)||N&&!w());){var Z=u.callback;if(typeof Z=="function"){u.callback=null,f=u.priorityLevel;var me=Z(u.expirationTime<=$);$=n.unstable_now(),typeof me=="function"?u.callback=me:u===t(l)&&i(l),g($)}else i(l);u=t(l)}if(u!==null)var Ae=!0;else{var W=t(c);W!==null&&K(S,W.startTime-$),Ae=!1}return Ae}finally{u=null,f=J,p=!1}}var T=!1,E=null,C=-1,z=5,y=-1;function w(){return!(n.unstable_now()-y<z)}function O(){if(E!==null){var N=n.unstable_now();y=N;var $=!0;try{$=E(!0,N)}finally{$?G():(T=!1,E=null)}}else T=!1}var G;if(typeof _=="function")G=function(){_(O)};else if(typeof MessageChannel<"u"){var Y=new MessageChannel,j=Y.port2;Y.port1.onmessage=O,G=function(){j.postMessage(null)}}else G=function(){v(O,0)};function k(N){E=N,T||(T=!0,G())}function K(N,$){C=v(function(){N(n.unstable_now())},$)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(N){N.callback=null},n.unstable_continueExecution=function(){m||p||(m=!0,k(A))},n.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<N?Math.floor(1e3/N):5},n.unstable_getCurrentPriorityLevel=function(){return f},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(N){switch(f){case 1:case 2:case 3:var $=3;break;default:$=f}var J=f;f=$;try{return N()}finally{f=J}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(N,$){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var J=f;f=N;try{return $()}finally{f=J}},n.unstable_scheduleCallback=function(N,$,J){var Z=n.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?Z+J:Z):J=Z,N){case 1:var me=-1;break;case 2:me=250;break;case 5:me=1073741823;break;case 4:me=1e4;break;default:me=5e3}return me=J+me,N={id:h++,callback:$,priorityLevel:N,startTime:J,expirationTime:me,sortIndex:-1},J>Z?(N.sortIndex=J,e(c,N),t(l)===null&&N===t(c)&&(x?(d(C),C=-1):x=!0,K(S,J-Z))):(N.sortIndex=me,e(l,N),m||p||(m=!0,k(A))),N},n.unstable_shouldYield=w,n.unstable_wrapCallback=function(N){var $=f;return function(){var J=f;f=$;try{return N.apply(this,arguments)}finally{f=J}}}})(M0);S0.exports=M0;var G_=S0.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var V_=Xn,Mn=G_;function ae(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var w0=new Set,bo={};function Or(n,e){As(n,e),As(n+"Capture",e)}function As(n,e){for(bo[n]=e,n=0;n<e.length;n++)w0.add(e[n])}var Mi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Uu=Object.prototype.hasOwnProperty,W_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Vf={},Wf={};function X_(n){return Uu.call(Wf,n)?!0:Uu.call(Vf,n)?!1:W_.test(n)?Wf[n]=!0:(Vf[n]=!0,!1)}function j_(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function Y_(n,e,t,i){if(e===null||typeof e>"u"||j_(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function rn(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Gt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Gt[n]=new rn(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Gt[e]=new rn(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Gt[n]=new rn(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Gt[n]=new rn(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Gt[n]=new rn(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Gt[n]=new rn(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Gt[n]=new rn(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Gt[n]=new rn(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Gt[n]=new rn(n,5,!1,n.toLowerCase(),null,!1,!1)});var yd=/[\-:]([a-z])/g;function Sd(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(yd,Sd);Gt[e]=new rn(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(yd,Sd);Gt[e]=new rn(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(yd,Sd);Gt[e]=new rn(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Gt[n]=new rn(n,1,!1,n.toLowerCase(),null,!1,!1)});Gt.xlinkHref=new rn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Gt[n]=new rn(n,1,!1,n.toLowerCase(),null,!0,!0)});function Md(n,e,t,i){var r=Gt.hasOwnProperty(e)?Gt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Y_(e,t,r,i)&&(t=null),i||r===null?X_(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var Ci=V_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,oa=Symbol.for("react.element"),is=Symbol.for("react.portal"),rs=Symbol.for("react.fragment"),wd=Symbol.for("react.strict_mode"),zu=Symbol.for("react.profiler"),E0=Symbol.for("react.provider"),T0=Symbol.for("react.context"),Ed=Symbol.for("react.forward_ref"),Fu=Symbol.for("react.suspense"),Ou=Symbol.for("react.suspense_list"),Td=Symbol.for("react.memo"),Fi=Symbol.for("react.lazy"),A0=Symbol.for("react.offscreen"),Xf=Symbol.iterator;function js(n){return n===null||typeof n!="object"?null:(n=Xf&&n[Xf]||n["@@iterator"],typeof n=="function"?n:null)}var yt=Object.assign,Ec;function lo(n){if(Ec===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);Ec=e&&e[1]||""}return`
`+Ec+n}var Tc=!1;function Ac(n,e){if(!n||Tc)return"";Tc=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){i=c}n.call(e.prototype)}else{try{throw Error()}catch(c){i=c}n()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=o&&0<=a);break}}}finally{Tc=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?lo(n):""}function Z_(n){switch(n.tag){case 5:return lo(n.type);case 16:return lo("Lazy");case 13:return lo("Suspense");case 19:return lo("SuspenseList");case 0:case 2:case 15:return n=Ac(n.type,!1),n;case 11:return n=Ac(n.type.render,!1),n;case 1:return n=Ac(n.type,!0),n;default:return""}}function ku(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case rs:return"Fragment";case is:return"Portal";case zu:return"Profiler";case wd:return"StrictMode";case Fu:return"Suspense";case Ou:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case T0:return(n.displayName||"Context")+".Consumer";case E0:return(n._context.displayName||"Context")+".Provider";case Ed:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case Td:return e=n.displayName||null,e!==null?e:ku(n.type)||"Memo";case Fi:e=n._payload,n=n._init;try{return ku(n(e))}catch{}}return null}function K_(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ku(e);case 8:return e===wd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function tr(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function b0(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function $_(n){var e=b0(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function aa(n){n._valueTracker||(n._valueTracker=$_(n))}function C0(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=b0(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function vl(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Bu(n,e){var t=e.checked;return yt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function jf(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=tr(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function P0(n,e){e=e.checked,e!=null&&Md(n,"checked",e,!1)}function Hu(n,e){P0(n,e);var t=tr(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?Gu(n,e.type,t):e.hasOwnProperty("defaultValue")&&Gu(n,e.type,tr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function Yf(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function Gu(n,e,t){(e!=="number"||vl(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var co=Array.isArray;function vs(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+tr(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function Vu(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ae(91));return yt({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Zf(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(ae(92));if(co(t)){if(1<t.length)throw Error(ae(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:tr(t)}}function R0(n,e){var t=tr(e.value),i=tr(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function Kf(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function L0(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Wu(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?L0(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var la,N0=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(la=la||document.createElement("div"),la.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=la.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function Co(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var po={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},q_=["Webkit","ms","Moz","O"];Object.keys(po).forEach(function(n){q_.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),po[e]=po[n]})});function D0(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||po.hasOwnProperty(n)&&po[n]?(""+e).trim():e+"px"}function I0(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=D0(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var J_=yt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Xu(n,e){if(e){if(J_[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ae(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ae(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ae(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ae(62))}}function ju(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Yu=null;function Ad(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Zu=null,_s=null,xs=null;function $f(n){if(n=Jo(n)){if(typeof Zu!="function")throw Error(ae(280));var e=n.stateNode;e&&(e=nc(e),Zu(n.stateNode,n.type,e))}}function U0(n){_s?xs?xs.push(n):xs=[n]:_s=n}function z0(){if(_s){var n=_s,e=xs;if(xs=_s=null,$f(n),e)for(n=0;n<e.length;n++)$f(e[n])}}function F0(n,e){return n(e)}function O0(){}var bc=!1;function k0(n,e,t){if(bc)return n(e,t);bc=!0;try{return F0(n,e,t)}finally{bc=!1,(_s!==null||xs!==null)&&(O0(),z0())}}function Po(n,e){var t=n.stateNode;if(t===null)return null;var i=nc(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(ae(231,e,typeof t));return t}var Ku=!1;if(Mi)try{var Ys={};Object.defineProperty(Ys,"passive",{get:function(){Ku=!0}}),window.addEventListener("test",Ys,Ys),window.removeEventListener("test",Ys,Ys)}catch{Ku=!1}function Q_(n,e,t,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(h){this.onError(h)}}var mo=!1,_l=null,xl=!1,$u=null,ex={onError:function(n){mo=!0,_l=n}};function tx(n,e,t,i,r,s,o,a,l){mo=!1,_l=null,Q_.apply(ex,arguments)}function nx(n,e,t,i,r,s,o,a,l){if(tx.apply(this,arguments),mo){if(mo){var c=_l;mo=!1,_l=null}else throw Error(ae(198));xl||(xl=!0,$u=c)}}function kr(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function B0(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function qf(n){if(kr(n)!==n)throw Error(ae(188))}function ix(n){var e=n.alternate;if(!e){if(e=kr(n),e===null)throw Error(ae(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return qf(r),n;if(s===i)return qf(r),e;s=s.sibling}throw Error(ae(188))}if(t.return!==i.return)t=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===t){o=!0,t=r,i=s;break}if(a===i){o=!0,i=r,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,i=r;break}if(a===i){o=!0,i=s,t=r;break}a=a.sibling}if(!o)throw Error(ae(189))}}if(t.alternate!==i)throw Error(ae(190))}if(t.tag!==3)throw Error(ae(188));return t.stateNode.current===t?n:e}function H0(n){return n=ix(n),n!==null?G0(n):null}function G0(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=G0(n);if(e!==null)return e;n=n.sibling}return null}var V0=Mn.unstable_scheduleCallback,Jf=Mn.unstable_cancelCallback,rx=Mn.unstable_shouldYield,sx=Mn.unstable_requestPaint,Tt=Mn.unstable_now,ox=Mn.unstable_getCurrentPriorityLevel,bd=Mn.unstable_ImmediatePriority,W0=Mn.unstable_UserBlockingPriority,yl=Mn.unstable_NormalPriority,ax=Mn.unstable_LowPriority,X0=Mn.unstable_IdlePriority,Jl=null,ii=null;function lx(n){if(ii&&typeof ii.onCommitFiberRoot=="function")try{ii.onCommitFiberRoot(Jl,n,void 0,(n.current.flags&128)===128)}catch{}}var Yn=Math.clz32?Math.clz32:hx,cx=Math.log,ux=Math.LN2;function hx(n){return n>>>=0,n===0?32:31-(cx(n)/ux|0)|0}var ca=64,ua=4194304;function uo(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Sl(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~r;a!==0?i=uo(a):(s&=o,s!==0&&(i=uo(s)))}else o=t&~r,o!==0?i=uo(o):s!==0&&(i=uo(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-Yn(e),r=1<<t,i|=n[t],e&=~r;return i}function dx(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function fx(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-Yn(s),a=1<<o,l=r[o];l===-1?(!(a&t)||a&i)&&(r[o]=dx(a,e)):l<=e&&(n.expiredLanes|=a),s&=~a}}function qu(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function j0(){var n=ca;return ca<<=1,!(ca&4194240)&&(ca=64),n}function Cc(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function $o(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-Yn(e),n[e]=t}function px(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-Yn(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function Cd(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-Yn(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var st=0;function Y0(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var Z0,Pd,K0,$0,q0,Ju=!1,ha=[],Xi=null,ji=null,Yi=null,Ro=new Map,Lo=new Map,ki=[],mx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Qf(n,e){switch(n){case"focusin":case"focusout":Xi=null;break;case"dragenter":case"dragleave":ji=null;break;case"mouseover":case"mouseout":Yi=null;break;case"pointerover":case"pointerout":Ro.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Lo.delete(e.pointerId)}}function Zs(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Jo(e),e!==null&&Pd(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function gx(n,e,t,i,r){switch(e){case"focusin":return Xi=Zs(Xi,n,e,t,i,r),!0;case"dragenter":return ji=Zs(ji,n,e,t,i,r),!0;case"mouseover":return Yi=Zs(Yi,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return Ro.set(s,Zs(Ro.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Lo.set(s,Zs(Lo.get(s)||null,n,e,t,i,r)),!0}return!1}function J0(n){var e=wr(n.target);if(e!==null){var t=kr(e);if(t!==null){if(e=t.tag,e===13){if(e=B0(t),e!==null){n.blockedOn=e,q0(n.priority,function(){K0(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function el(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=Qu(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);Yu=i,t.target.dispatchEvent(i),Yu=null}else return e=Jo(t),e!==null&&Pd(e),n.blockedOn=t,!1;e.shift()}return!0}function ep(n,e,t){el(n)&&t.delete(e)}function vx(){Ju=!1,Xi!==null&&el(Xi)&&(Xi=null),ji!==null&&el(ji)&&(ji=null),Yi!==null&&el(Yi)&&(Yi=null),Ro.forEach(ep),Lo.forEach(ep)}function Ks(n,e){n.blockedOn===e&&(n.blockedOn=null,Ju||(Ju=!0,Mn.unstable_scheduleCallback(Mn.unstable_NormalPriority,vx)))}function No(n){function e(r){return Ks(r,n)}if(0<ha.length){Ks(ha[0],n);for(var t=1;t<ha.length;t++){var i=ha[t];i.blockedOn===n&&(i.blockedOn=null)}}for(Xi!==null&&Ks(Xi,n),ji!==null&&Ks(ji,n),Yi!==null&&Ks(Yi,n),Ro.forEach(e),Lo.forEach(e),t=0;t<ki.length;t++)i=ki[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<ki.length&&(t=ki[0],t.blockedOn===null);)J0(t),t.blockedOn===null&&ki.shift()}var ys=Ci.ReactCurrentBatchConfig,Ml=!0;function _x(n,e,t,i){var r=st,s=ys.transition;ys.transition=null;try{st=1,Rd(n,e,t,i)}finally{st=r,ys.transition=s}}function xx(n,e,t,i){var r=st,s=ys.transition;ys.transition=null;try{st=4,Rd(n,e,t,i)}finally{st=r,ys.transition=s}}function Rd(n,e,t,i){if(Ml){var r=Qu(n,e,t,i);if(r===null)Oc(n,e,i,wl,t),Qf(n,i);else if(gx(r,n,e,t,i))i.stopPropagation();else if(Qf(n,i),e&4&&-1<mx.indexOf(n)){for(;r!==null;){var s=Jo(r);if(s!==null&&Z0(s),s=Qu(n,e,t,i),s===null&&Oc(n,e,i,wl,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else Oc(n,e,i,null,t)}}var wl=null;function Qu(n,e,t,i){if(wl=null,n=Ad(i),n=wr(n),n!==null)if(e=kr(n),e===null)n=null;else if(t=e.tag,t===13){if(n=B0(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return wl=n,null}function Q0(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(ox()){case bd:return 1;case W0:return 4;case yl:case ax:return 16;case X0:return 536870912;default:return 16}default:return 16}}var Gi=null,Ld=null,tl=null;function eg(){if(tl)return tl;var n,e=Ld,t=e.length,i,r="value"in Gi?Gi.value:Gi.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===r[s-i];i++);return tl=r.slice(n,1<i?1-i:void 0)}function nl(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function da(){return!0}function tp(){return!1}function En(n){function e(t,i,r,s,o){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?da:tp,this.isPropagationStopped=tp,this}return yt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=da)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=da)},persist:function(){},isPersistent:da}),e}var Bs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Nd=En(Bs),qo=yt({},Bs,{view:0,detail:0}),yx=En(qo),Pc,Rc,$s,Ql=yt({},qo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Dd,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==$s&&($s&&n.type==="mousemove"?(Pc=n.screenX-$s.screenX,Rc=n.screenY-$s.screenY):Rc=Pc=0,$s=n),Pc)},movementY:function(n){return"movementY"in n?n.movementY:Rc}}),np=En(Ql),Sx=yt({},Ql,{dataTransfer:0}),Mx=En(Sx),wx=yt({},qo,{relatedTarget:0}),Lc=En(wx),Ex=yt({},Bs,{animationName:0,elapsedTime:0,pseudoElement:0}),Tx=En(Ex),Ax=yt({},Bs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),bx=En(Ax),Cx=yt({},Bs,{data:0}),ip=En(Cx),Px={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Rx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Lx={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Nx(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=Lx[n])?!!e[n]:!1}function Dd(){return Nx}var Dx=yt({},qo,{key:function(n){if(n.key){var e=Px[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=nl(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Rx[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Dd,charCode:function(n){return n.type==="keypress"?nl(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?nl(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Ix=En(Dx),Ux=yt({},Ql,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),rp=En(Ux),zx=yt({},qo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Dd}),Fx=En(zx),Ox=yt({},Bs,{propertyName:0,elapsedTime:0,pseudoElement:0}),kx=En(Ox),Bx=yt({},Ql,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Hx=En(Bx),Gx=[9,13,27,32],Id=Mi&&"CompositionEvent"in window,go=null;Mi&&"documentMode"in document&&(go=document.documentMode);var Vx=Mi&&"TextEvent"in window&&!go,tg=Mi&&(!Id||go&&8<go&&11>=go),sp=" ",op=!1;function ng(n,e){switch(n){case"keyup":return Gx.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function ig(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var ss=!1;function Wx(n,e){switch(n){case"compositionend":return ig(e);case"keypress":return e.which!==32?null:(op=!0,sp);case"textInput":return n=e.data,n===sp&&op?null:n;default:return null}}function Xx(n,e){if(ss)return n==="compositionend"||!Id&&ng(n,e)?(n=eg(),tl=Ld=Gi=null,ss=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return tg&&e.locale!=="ko"?null:e.data;default:return null}}var jx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ap(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!jx[n.type]:e==="textarea"}function rg(n,e,t,i){U0(i),e=El(e,"onChange"),0<e.length&&(t=new Nd("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var vo=null,Do=null;function Yx(n){mg(n,0)}function ec(n){var e=ls(n);if(C0(e))return n}function Zx(n,e){if(n==="change")return e}var sg=!1;if(Mi){var Nc;if(Mi){var Dc="oninput"in document;if(!Dc){var lp=document.createElement("div");lp.setAttribute("oninput","return;"),Dc=typeof lp.oninput=="function"}Nc=Dc}else Nc=!1;sg=Nc&&(!document.documentMode||9<document.documentMode)}function cp(){vo&&(vo.detachEvent("onpropertychange",og),Do=vo=null)}function og(n){if(n.propertyName==="value"&&ec(Do)){var e=[];rg(e,Do,n,Ad(n)),k0(Yx,e)}}function Kx(n,e,t){n==="focusin"?(cp(),vo=e,Do=t,vo.attachEvent("onpropertychange",og)):n==="focusout"&&cp()}function $x(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return ec(Do)}function qx(n,e){if(n==="click")return ec(e)}function Jx(n,e){if(n==="input"||n==="change")return ec(e)}function Qx(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var Kn=typeof Object.is=="function"?Object.is:Qx;function Io(n,e){if(Kn(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!Uu.call(e,r)||!Kn(n[r],e[r]))return!1}return!0}function up(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function hp(n,e){var t=up(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=up(t)}}function ag(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?ag(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function lg(){for(var n=window,e=vl();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=vl(n.document)}return e}function Ud(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function ey(n){var e=lg(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&ag(t.ownerDocument.documentElement,t)){if(i!==null&&Ud(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=hp(t,s);var o=hp(t,i);r&&o&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var ty=Mi&&"documentMode"in document&&11>=document.documentMode,os=null,eh=null,_o=null,th=!1;function dp(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;th||os==null||os!==vl(i)||(i=os,"selectionStart"in i&&Ud(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),_o&&Io(_o,i)||(_o=i,i=El(eh,"onSelect"),0<i.length&&(e=new Nd("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=os)))}function fa(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var as={animationend:fa("Animation","AnimationEnd"),animationiteration:fa("Animation","AnimationIteration"),animationstart:fa("Animation","AnimationStart"),transitionend:fa("Transition","TransitionEnd")},Ic={},cg={};Mi&&(cg=document.createElement("div").style,"AnimationEvent"in window||(delete as.animationend.animation,delete as.animationiteration.animation,delete as.animationstart.animation),"TransitionEvent"in window||delete as.transitionend.transition);function tc(n){if(Ic[n])return Ic[n];if(!as[n])return n;var e=as[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in cg)return Ic[n]=e[t];return n}var ug=tc("animationend"),hg=tc("animationiteration"),dg=tc("animationstart"),fg=tc("transitionend"),pg=new Map,fp="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function sr(n,e){pg.set(n,e),Or(e,[n])}for(var Uc=0;Uc<fp.length;Uc++){var zc=fp[Uc],ny=zc.toLowerCase(),iy=zc[0].toUpperCase()+zc.slice(1);sr(ny,"on"+iy)}sr(ug,"onAnimationEnd");sr(hg,"onAnimationIteration");sr(dg,"onAnimationStart");sr("dblclick","onDoubleClick");sr("focusin","onFocus");sr("focusout","onBlur");sr(fg,"onTransitionEnd");As("onMouseEnter",["mouseout","mouseover"]);As("onMouseLeave",["mouseout","mouseover"]);As("onPointerEnter",["pointerout","pointerover"]);As("onPointerLeave",["pointerout","pointerover"]);Or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Or("onBeforeInput",["compositionend","keypress","textInput","paste"]);Or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ho="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ry=new Set("cancel close invalid load scroll toggle".split(" ").concat(ho));function pp(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,nx(i,e,void 0,n),n.currentTarget=null}function mg(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;pp(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;pp(r,a,c),s=l}}}if(xl)throw n=$u,xl=!1,$u=null,n}function dt(n,e){var t=e[oh];t===void 0&&(t=e[oh]=new Set);var i=n+"__bubble";t.has(i)||(gg(e,n,2,!1),t.add(i))}function Fc(n,e,t){var i=0;e&&(i|=4),gg(t,n,i,e)}var pa="_reactListening"+Math.random().toString(36).slice(2);function Uo(n){if(!n[pa]){n[pa]=!0,w0.forEach(function(t){t!=="selectionchange"&&(ry.has(t)||Fc(t,!1,n),Fc(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[pa]||(e[pa]=!0,Fc("selectionchange",!1,e))}}function gg(n,e,t,i){switch(Q0(e)){case 1:var r=_x;break;case 4:r=xx;break;default:r=Rd}t=r.bind(null,e,t,n),r=void 0,!Ku||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function Oc(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=wr(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}k0(function(){var c=s,h=Ad(t),u=[];e:{var f=pg.get(n);if(f!==void 0){var p=Nd,m=n;switch(n){case"keypress":if(nl(t)===0)break e;case"keydown":case"keyup":p=Ix;break;case"focusin":m="focus",p=Lc;break;case"focusout":m="blur",p=Lc;break;case"beforeblur":case"afterblur":p=Lc;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=np;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Mx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Fx;break;case ug:case hg:case dg:p=Tx;break;case fg:p=kx;break;case"scroll":p=yx;break;case"wheel":p=Hx;break;case"copy":case"cut":case"paste":p=bx;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=rp}var x=(e&4)!==0,v=!x&&n==="scroll",d=x?f!==null?f+"Capture":null:f;x=[];for(var _=c,g;_!==null;){g=_;var S=g.stateNode;if(g.tag===5&&S!==null&&(g=S,d!==null&&(S=Po(_,d),S!=null&&x.push(zo(_,S,g)))),v)break;_=_.return}0<x.length&&(f=new p(f,m,null,t,h),u.push({event:f,listeners:x}))}}if(!(e&7)){e:{if(f=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",f&&t!==Yu&&(m=t.relatedTarget||t.fromElement)&&(wr(m)||m[wi]))break e;if((p||f)&&(f=h.window===h?h:(f=h.ownerDocument)?f.defaultView||f.parentWindow:window,p?(m=t.relatedTarget||t.toElement,p=c,m=m?wr(m):null,m!==null&&(v=kr(m),m!==v||m.tag!==5&&m.tag!==6)&&(m=null)):(p=null,m=c),p!==m)){if(x=np,S="onMouseLeave",d="onMouseEnter",_="mouse",(n==="pointerout"||n==="pointerover")&&(x=rp,S="onPointerLeave",d="onPointerEnter",_="pointer"),v=p==null?f:ls(p),g=m==null?f:ls(m),f=new x(S,_+"leave",p,t,h),f.target=v,f.relatedTarget=g,S=null,wr(h)===c&&(x=new x(d,_+"enter",m,t,h),x.target=g,x.relatedTarget=v,S=x),v=S,p&&m)t:{for(x=p,d=m,_=0,g=x;g;g=Gr(g))_++;for(g=0,S=d;S;S=Gr(S))g++;for(;0<_-g;)x=Gr(x),_--;for(;0<g-_;)d=Gr(d),g--;for(;_--;){if(x===d||d!==null&&x===d.alternate)break t;x=Gr(x),d=Gr(d)}x=null}else x=null;p!==null&&mp(u,f,p,x,!1),m!==null&&v!==null&&mp(u,v,m,x,!0)}}e:{if(f=c?ls(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var A=Zx;else if(ap(f))if(sg)A=Jx;else{A=$x;var T=Kx}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(A=qx);if(A&&(A=A(n,c))){rg(u,A,t,h);break e}T&&T(n,f,c),n==="focusout"&&(T=f._wrapperState)&&T.controlled&&f.type==="number"&&Gu(f,"number",f.value)}switch(T=c?ls(c):window,n){case"focusin":(ap(T)||T.contentEditable==="true")&&(os=T,eh=c,_o=null);break;case"focusout":_o=eh=os=null;break;case"mousedown":th=!0;break;case"contextmenu":case"mouseup":case"dragend":th=!1,dp(u,t,h);break;case"selectionchange":if(ty)break;case"keydown":case"keyup":dp(u,t,h)}var E;if(Id)e:{switch(n){case"compositionstart":var C="onCompositionStart";break e;case"compositionend":C="onCompositionEnd";break e;case"compositionupdate":C="onCompositionUpdate";break e}C=void 0}else ss?ng(n,t)&&(C="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(C="onCompositionStart");C&&(tg&&t.locale!=="ko"&&(ss||C!=="onCompositionStart"?C==="onCompositionEnd"&&ss&&(E=eg()):(Gi=h,Ld="value"in Gi?Gi.value:Gi.textContent,ss=!0)),T=El(c,C),0<T.length&&(C=new ip(C,n,null,t,h),u.push({event:C,listeners:T}),E?C.data=E:(E=ig(t),E!==null&&(C.data=E)))),(E=Vx?Wx(n,t):Xx(n,t))&&(c=El(c,"onBeforeInput"),0<c.length&&(h=new ip("onBeforeInput","beforeinput",null,t,h),u.push({event:h,listeners:c}),h.data=E))}mg(u,e)})}function zo(n,e,t){return{instance:n,listener:e,currentTarget:t}}function El(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Po(n,t),s!=null&&i.unshift(zo(n,s,r)),s=Po(n,e),s!=null&&i.push(zo(n,s,r))),n=n.return}return i}function Gr(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function mp(n,e,t,i,r){for(var s=e._reactName,o=[];t!==null&&t!==i;){var a=t,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=Po(t,s),l!=null&&o.unshift(zo(t,l,a))):r||(l=Po(t,s),l!=null&&o.push(zo(t,l,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var sy=/\r\n?/g,oy=/\u0000|\uFFFD/g;function gp(n){return(typeof n=="string"?n:""+n).replace(sy,`
`).replace(oy,"")}function ma(n,e,t){if(e=gp(e),gp(n)!==e&&t)throw Error(ae(425))}function Tl(){}var nh=null,ih=null;function rh(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var sh=typeof setTimeout=="function"?setTimeout:void 0,ay=typeof clearTimeout=="function"?clearTimeout:void 0,vp=typeof Promise=="function"?Promise:void 0,ly=typeof queueMicrotask=="function"?queueMicrotask:typeof vp<"u"?function(n){return vp.resolve(null).then(n).catch(cy)}:sh;function cy(n){setTimeout(function(){throw n})}function kc(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),No(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);No(e)}function Zi(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function _p(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Hs=Math.random().toString(36).slice(2),ti="__reactFiber$"+Hs,Fo="__reactProps$"+Hs,wi="__reactContainer$"+Hs,oh="__reactEvents$"+Hs,uy="__reactListeners$"+Hs,hy="__reactHandles$"+Hs;function wr(n){var e=n[ti];if(e)return e;for(var t=n.parentNode;t;){if(e=t[wi]||t[ti]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=_p(n);n!==null;){if(t=n[ti])return t;n=_p(n)}return e}n=t,t=n.parentNode}return null}function Jo(n){return n=n[ti]||n[wi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function ls(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(ae(33))}function nc(n){return n[Fo]||null}var ah=[],cs=-1;function or(n){return{current:n}}function pt(n){0>cs||(n.current=ah[cs],ah[cs]=null,cs--)}function ut(n,e){cs++,ah[cs]=n.current,n.current=e}var nr={},$t=or(nr),un=or(!1),Rr=nr;function bs(n,e){var t=n.type.contextTypes;if(!t)return nr;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function hn(n){return n=n.childContextTypes,n!=null}function Al(){pt(un),pt($t)}function xp(n,e,t){if($t.current!==nr)throw Error(ae(168));ut($t,e),ut(un,t)}function vg(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ae(108,K_(n)||"Unknown",r));return yt({},t,i)}function bl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||nr,Rr=$t.current,ut($t,n),ut(un,un.current),!0}function yp(n,e,t){var i=n.stateNode;if(!i)throw Error(ae(169));t?(n=vg(n,e,Rr),i.__reactInternalMemoizedMergedChildContext=n,pt(un),pt($t),ut($t,n)):pt(un),ut(un,t)}var gi=null,ic=!1,Bc=!1;function _g(n){gi===null?gi=[n]:gi.push(n)}function dy(n){ic=!0,_g(n)}function ar(){if(!Bc&&gi!==null){Bc=!0;var n=0,e=st;try{var t=gi;for(st=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}gi=null,ic=!1}catch(r){throw gi!==null&&(gi=gi.slice(n+1)),V0(bd,ar),r}finally{st=e,Bc=!1}}return null}var us=[],hs=0,Cl=null,Pl=0,Cn=[],Pn=0,Lr=null,vi=1,_i="";function vr(n,e){us[hs++]=Pl,us[hs++]=Cl,Cl=n,Pl=e}function xg(n,e,t){Cn[Pn++]=vi,Cn[Pn++]=_i,Cn[Pn++]=Lr,Lr=n;var i=vi;n=_i;var r=32-Yn(i)-1;i&=~(1<<r),t+=1;var s=32-Yn(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,vi=1<<32-Yn(e)+r|t<<r|i,_i=s+n}else vi=1<<s|t<<r|i,_i=n}function zd(n){n.return!==null&&(vr(n,1),xg(n,1,0))}function Fd(n){for(;n===Cl;)Cl=us[--hs],us[hs]=null,Pl=us[--hs],us[hs]=null;for(;n===Lr;)Lr=Cn[--Pn],Cn[Pn]=null,_i=Cn[--Pn],Cn[Pn]=null,vi=Cn[--Pn],Cn[Pn]=null}var Sn=null,yn=null,gt=!1,Gn=null;function yg(n,e){var t=Rn(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function Sp(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,Sn=n,yn=Zi(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,Sn=n,yn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=Lr!==null?{id:vi,overflow:_i}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=Rn(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,Sn=n,yn=null,!0):!1;default:return!1}}function lh(n){return(n.mode&1)!==0&&(n.flags&128)===0}function ch(n){if(gt){var e=yn;if(e){var t=e;if(!Sp(n,e)){if(lh(n))throw Error(ae(418));e=Zi(t.nextSibling);var i=Sn;e&&Sp(n,e)?yg(i,t):(n.flags=n.flags&-4097|2,gt=!1,Sn=n)}}else{if(lh(n))throw Error(ae(418));n.flags=n.flags&-4097|2,gt=!1,Sn=n}}}function Mp(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Sn=n}function ga(n){if(n!==Sn)return!1;if(!gt)return Mp(n),gt=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!rh(n.type,n.memoizedProps)),e&&(e=yn)){if(lh(n))throw Sg(),Error(ae(418));for(;e;)yg(n,e),e=Zi(e.nextSibling)}if(Mp(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(ae(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){yn=Zi(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}yn=null}}else yn=Sn?Zi(n.stateNode.nextSibling):null;return!0}function Sg(){for(var n=yn;n;)n=Zi(n.nextSibling)}function Cs(){yn=Sn=null,gt=!1}function Od(n){Gn===null?Gn=[n]:Gn.push(n)}var fy=Ci.ReactCurrentBatchConfig;function qs(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(ae(309));var i=t.stateNode}if(!i)throw Error(ae(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(ae(284));if(!t._owner)throw Error(ae(290,n))}return n}function va(n,e){throw n=Object.prototype.toString.call(e),Error(ae(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function wp(n){var e=n._init;return e(n._payload)}function Mg(n){function e(d,_){if(n){var g=d.deletions;g===null?(d.deletions=[_],d.flags|=16):g.push(_)}}function t(d,_){if(!n)return null;for(;_!==null;)e(d,_),_=_.sibling;return null}function i(d,_){for(d=new Map;_!==null;)_.key!==null?d.set(_.key,_):d.set(_.index,_),_=_.sibling;return d}function r(d,_){return d=Ji(d,_),d.index=0,d.sibling=null,d}function s(d,_,g){return d.index=g,n?(g=d.alternate,g!==null?(g=g.index,g<_?(d.flags|=2,_):g):(d.flags|=2,_)):(d.flags|=1048576,_)}function o(d){return n&&d.alternate===null&&(d.flags|=2),d}function a(d,_,g,S){return _===null||_.tag!==6?(_=Yc(g,d.mode,S),_.return=d,_):(_=r(_,g),_.return=d,_)}function l(d,_,g,S){var A=g.type;return A===rs?h(d,_,g.props.children,S,g.key):_!==null&&(_.elementType===A||typeof A=="object"&&A!==null&&A.$$typeof===Fi&&wp(A)===_.type)?(S=r(_,g.props),S.ref=qs(d,_,g),S.return=d,S):(S=cl(g.type,g.key,g.props,null,d.mode,S),S.ref=qs(d,_,g),S.return=d,S)}function c(d,_,g,S){return _===null||_.tag!==4||_.stateNode.containerInfo!==g.containerInfo||_.stateNode.implementation!==g.implementation?(_=Zc(g,d.mode,S),_.return=d,_):(_=r(_,g.children||[]),_.return=d,_)}function h(d,_,g,S,A){return _===null||_.tag!==7?(_=Pr(g,d.mode,S,A),_.return=d,_):(_=r(_,g),_.return=d,_)}function u(d,_,g){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Yc(""+_,d.mode,g),_.return=d,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case oa:return g=cl(_.type,_.key,_.props,null,d.mode,g),g.ref=qs(d,null,_),g.return=d,g;case is:return _=Zc(_,d.mode,g),_.return=d,_;case Fi:var S=_._init;return u(d,S(_._payload),g)}if(co(_)||js(_))return _=Pr(_,d.mode,g,null),_.return=d,_;va(d,_)}return null}function f(d,_,g,S){var A=_!==null?_.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return A!==null?null:a(d,_,""+g,S);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case oa:return g.key===A?l(d,_,g,S):null;case is:return g.key===A?c(d,_,g,S):null;case Fi:return A=g._init,f(d,_,A(g._payload),S)}if(co(g)||js(g))return A!==null?null:h(d,_,g,S,null);va(d,g)}return null}function p(d,_,g,S,A){if(typeof S=="string"&&S!==""||typeof S=="number")return d=d.get(g)||null,a(_,d,""+S,A);if(typeof S=="object"&&S!==null){switch(S.$$typeof){case oa:return d=d.get(S.key===null?g:S.key)||null,l(_,d,S,A);case is:return d=d.get(S.key===null?g:S.key)||null,c(_,d,S,A);case Fi:var T=S._init;return p(d,_,g,T(S._payload),A)}if(co(S)||js(S))return d=d.get(g)||null,h(_,d,S,A,null);va(_,S)}return null}function m(d,_,g,S){for(var A=null,T=null,E=_,C=_=0,z=null;E!==null&&C<g.length;C++){E.index>C?(z=E,E=null):z=E.sibling;var y=f(d,E,g[C],S);if(y===null){E===null&&(E=z);break}n&&E&&y.alternate===null&&e(d,E),_=s(y,_,C),T===null?A=y:T.sibling=y,T=y,E=z}if(C===g.length)return t(d,E),gt&&vr(d,C),A;if(E===null){for(;C<g.length;C++)E=u(d,g[C],S),E!==null&&(_=s(E,_,C),T===null?A=E:T.sibling=E,T=E);return gt&&vr(d,C),A}for(E=i(d,E);C<g.length;C++)z=p(E,d,C,g[C],S),z!==null&&(n&&z.alternate!==null&&E.delete(z.key===null?C:z.key),_=s(z,_,C),T===null?A=z:T.sibling=z,T=z);return n&&E.forEach(function(w){return e(d,w)}),gt&&vr(d,C),A}function x(d,_,g,S){var A=js(g);if(typeof A!="function")throw Error(ae(150));if(g=A.call(g),g==null)throw Error(ae(151));for(var T=A=null,E=_,C=_=0,z=null,y=g.next();E!==null&&!y.done;C++,y=g.next()){E.index>C?(z=E,E=null):z=E.sibling;var w=f(d,E,y.value,S);if(w===null){E===null&&(E=z);break}n&&E&&w.alternate===null&&e(d,E),_=s(w,_,C),T===null?A=w:T.sibling=w,T=w,E=z}if(y.done)return t(d,E),gt&&vr(d,C),A;if(E===null){for(;!y.done;C++,y=g.next())y=u(d,y.value,S),y!==null&&(_=s(y,_,C),T===null?A=y:T.sibling=y,T=y);return gt&&vr(d,C),A}for(E=i(d,E);!y.done;C++,y=g.next())y=p(E,d,C,y.value,S),y!==null&&(n&&y.alternate!==null&&E.delete(y.key===null?C:y.key),_=s(y,_,C),T===null?A=y:T.sibling=y,T=y);return n&&E.forEach(function(O){return e(d,O)}),gt&&vr(d,C),A}function v(d,_,g,S){if(typeof g=="object"&&g!==null&&g.type===rs&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case oa:e:{for(var A=g.key,T=_;T!==null;){if(T.key===A){if(A=g.type,A===rs){if(T.tag===7){t(d,T.sibling),_=r(T,g.props.children),_.return=d,d=_;break e}}else if(T.elementType===A||typeof A=="object"&&A!==null&&A.$$typeof===Fi&&wp(A)===T.type){t(d,T.sibling),_=r(T,g.props),_.ref=qs(d,T,g),_.return=d,d=_;break e}t(d,T);break}else e(d,T);T=T.sibling}g.type===rs?(_=Pr(g.props.children,d.mode,S,g.key),_.return=d,d=_):(S=cl(g.type,g.key,g.props,null,d.mode,S),S.ref=qs(d,_,g),S.return=d,d=S)}return o(d);case is:e:{for(T=g.key;_!==null;){if(_.key===T)if(_.tag===4&&_.stateNode.containerInfo===g.containerInfo&&_.stateNode.implementation===g.implementation){t(d,_.sibling),_=r(_,g.children||[]),_.return=d,d=_;break e}else{t(d,_);break}else e(d,_);_=_.sibling}_=Zc(g,d.mode,S),_.return=d,d=_}return o(d);case Fi:return T=g._init,v(d,_,T(g._payload),S)}if(co(g))return m(d,_,g,S);if(js(g))return x(d,_,g,S);va(d,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,_!==null&&_.tag===6?(t(d,_.sibling),_=r(_,g),_.return=d,d=_):(t(d,_),_=Yc(g,d.mode,S),_.return=d,d=_),o(d)):t(d,_)}return v}var Ps=Mg(!0),wg=Mg(!1),Rl=or(null),Ll=null,ds=null,kd=null;function Bd(){kd=ds=Ll=null}function Hd(n){var e=Rl.current;pt(Rl),n._currentValue=e}function uh(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function Ss(n,e){Ll=n,kd=ds=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(cn=!0),n.firstContext=null)}function Dn(n){var e=n._currentValue;if(kd!==n)if(n={context:n,memoizedValue:e,next:null},ds===null){if(Ll===null)throw Error(ae(308));ds=n,Ll.dependencies={lanes:0,firstContext:n}}else ds=ds.next=n;return e}var Er=null;function Gd(n){Er===null?Er=[n]:Er.push(n)}function Eg(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,Gd(e)):(t.next=r.next,r.next=t),e.interleaved=t,Ei(n,i)}function Ei(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var Oi=!1;function Vd(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Tg(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Si(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function Ki(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,Qe&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ei(n,t)}return r=i.interleaved,r===null?(e.next=e,Gd(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ei(n,t)}function il(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Cd(n,t)}}function Ep(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function Nl(n,e,t,i){var r=n.updateQueue;Oi=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var h=n.alternate;h!==null&&(h=h.updateQueue,a=h.lastBaseUpdate,a!==o&&(a===null?h.firstBaseUpdate=c:a.next=c,h.lastBaseUpdate=l))}if(s!==null){var u=r.baseState;o=0,h=c=l=null,a=s;do{var f=a.lane,p=a.eventTime;if((i&f)===f){h!==null&&(h=h.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var m=n,x=a;switch(f=e,p=t,x.tag){case 1:if(m=x.payload,typeof m=="function"){u=m.call(p,u,f);break e}u=m;break e;case 3:m.flags=m.flags&-65537|128;case 0:if(m=x.payload,f=typeof m=="function"?m.call(p,u,f):m,f==null)break e;u=yt({},u,f);break e;case 2:Oi=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,f=r.effects,f===null?r.effects=[a]:f.push(a))}else p={eventTime:p,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},h===null?(c=h=p,l=u):h=h.next=p,o|=f;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;f=a,a=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(h===null&&(l=u),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=h,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Dr|=o,n.lanes=o,n.memoizedState=u}}function Tp(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(ae(191,r));r.call(i)}}}var Qo={},ri=or(Qo),Oo=or(Qo),ko=or(Qo);function Tr(n){if(n===Qo)throw Error(ae(174));return n}function Wd(n,e){switch(ut(ko,e),ut(Oo,n),ut(ri,Qo),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Wu(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=Wu(e,n)}pt(ri),ut(ri,e)}function Rs(){pt(ri),pt(Oo),pt(ko)}function Ag(n){Tr(ko.current);var e=Tr(ri.current),t=Wu(e,n.type);e!==t&&(ut(Oo,n),ut(ri,t))}function Xd(n){Oo.current===n&&(pt(ri),pt(Oo))}var vt=or(0);function Dl(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Hc=[];function jd(){for(var n=0;n<Hc.length;n++)Hc[n]._workInProgressVersionPrimary=null;Hc.length=0}var rl=Ci.ReactCurrentDispatcher,Gc=Ci.ReactCurrentBatchConfig,Nr=0,xt=null,Pt=null,zt=null,Il=!1,xo=!1,Bo=0,py=0;function Vt(){throw Error(ae(321))}function Yd(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!Kn(n[t],e[t]))return!1;return!0}function Zd(n,e,t,i,r,s){if(Nr=s,xt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,rl.current=n===null||n.memoizedState===null?_y:xy,n=t(i,r),xo){s=0;do{if(xo=!1,Bo=0,25<=s)throw Error(ae(301));s+=1,zt=Pt=null,e.updateQueue=null,rl.current=yy,n=t(i,r)}while(xo)}if(rl.current=Ul,e=Pt!==null&&Pt.next!==null,Nr=0,zt=Pt=xt=null,Il=!1,e)throw Error(ae(300));return n}function Kd(){var n=Bo!==0;return Bo=0,n}function Qn(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return zt===null?xt.memoizedState=zt=n:zt=zt.next=n,zt}function In(){if(Pt===null){var n=xt.alternate;n=n!==null?n.memoizedState:null}else n=Pt.next;var e=zt===null?xt.memoizedState:zt.next;if(e!==null)zt=e,Pt=n;else{if(n===null)throw Error(ae(310));Pt=n,n={memoizedState:Pt.memoizedState,baseState:Pt.baseState,baseQueue:Pt.baseQueue,queue:Pt.queue,next:null},zt===null?xt.memoizedState=zt=n:zt=zt.next=n}return zt}function Ho(n,e){return typeof e=="function"?e(n):e}function Vc(n){var e=In(),t=e.queue;if(t===null)throw Error(ae(311));t.lastRenderedReducer=n;var i=Pt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var h=c.lane;if((Nr&h)===h)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:n(i,c.action);else{var u={lane:h,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=u,o=i):l=l.next=u,xt.lanes|=h,Dr|=h}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,Kn(i,e.memoizedState)||(cn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,xt.lanes|=s,Dr|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function Wc(n){var e=In(),t=e.queue;if(t===null)throw Error(ae(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var o=r=r.next;do s=n(s,o.action),o=o.next;while(o!==r);Kn(s,e.memoizedState)||(cn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function bg(){}function Cg(n,e){var t=xt,i=In(),r=e(),s=!Kn(i.memoizedState,r);if(s&&(i.memoizedState=r,cn=!0),i=i.queue,$d(Lg.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||zt!==null&&zt.memoizedState.tag&1){if(t.flags|=2048,Go(9,Rg.bind(null,t,i,r,e),void 0,null),Ft===null)throw Error(ae(349));Nr&30||Pg(t,e,r)}return r}function Pg(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=xt.updateQueue,e===null?(e={lastEffect:null,stores:null},xt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function Rg(n,e,t,i){e.value=t,e.getSnapshot=i,Ng(e)&&Dg(n)}function Lg(n,e,t){return t(function(){Ng(e)&&Dg(n)})}function Ng(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!Kn(n,t)}catch{return!0}}function Dg(n){var e=Ei(n,1);e!==null&&Zn(e,n,1,-1)}function Ap(n){var e=Qn();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ho,lastRenderedState:n},e.queue=n,n=n.dispatch=vy.bind(null,xt,n),[e.memoizedState,n]}function Go(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=xt.updateQueue,e===null?(e={lastEffect:null,stores:null},xt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function Ig(){return In().memoizedState}function sl(n,e,t,i){var r=Qn();xt.flags|=n,r.memoizedState=Go(1|e,t,void 0,i===void 0?null:i)}function rc(n,e,t,i){var r=In();i=i===void 0?null:i;var s=void 0;if(Pt!==null){var o=Pt.memoizedState;if(s=o.destroy,i!==null&&Yd(i,o.deps)){r.memoizedState=Go(e,t,s,i);return}}xt.flags|=n,r.memoizedState=Go(1|e,t,s,i)}function bp(n,e){return sl(8390656,8,n,e)}function $d(n,e){return rc(2048,8,n,e)}function Ug(n,e){return rc(4,2,n,e)}function zg(n,e){return rc(4,4,n,e)}function Fg(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function Og(n,e,t){return t=t!=null?t.concat([n]):null,rc(4,4,Fg.bind(null,e,n),t)}function qd(){}function kg(n,e){var t=In();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Yd(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function Bg(n,e){var t=In();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&Yd(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function Hg(n,e,t){return Nr&21?(Kn(t,e)||(t=j0(),xt.lanes|=t,Dr|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,cn=!0),n.memoizedState=t)}function my(n,e){var t=st;st=t!==0&&4>t?t:4,n(!0);var i=Gc.transition;Gc.transition={};try{n(!1),e()}finally{st=t,Gc.transition=i}}function Gg(){return In().memoizedState}function gy(n,e,t){var i=qi(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},Vg(n))Wg(e,t);else if(t=Eg(n,e,t,i),t!==null){var r=en();Zn(t,n,i,r),Xg(t,e,i)}}function vy(n,e,t){var i=qi(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(Vg(n))Wg(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,t);if(r.hasEagerState=!0,r.eagerState=a,Kn(a,o)){var l=e.interleaved;l===null?(r.next=r,Gd(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=Eg(n,e,r,i),t!==null&&(r=en(),Zn(t,n,i,r),Xg(t,e,i))}}function Vg(n){var e=n.alternate;return n===xt||e!==null&&e===xt}function Wg(n,e){xo=Il=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function Xg(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,Cd(n,t)}}var Ul={readContext:Dn,useCallback:Vt,useContext:Vt,useEffect:Vt,useImperativeHandle:Vt,useInsertionEffect:Vt,useLayoutEffect:Vt,useMemo:Vt,useReducer:Vt,useRef:Vt,useState:Vt,useDebugValue:Vt,useDeferredValue:Vt,useTransition:Vt,useMutableSource:Vt,useSyncExternalStore:Vt,useId:Vt,unstable_isNewReconciler:!1},_y={readContext:Dn,useCallback:function(n,e){return Qn().memoizedState=[n,e===void 0?null:e],n},useContext:Dn,useEffect:bp,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,sl(4194308,4,Fg.bind(null,e,n),t)},useLayoutEffect:function(n,e){return sl(4194308,4,n,e)},useInsertionEffect:function(n,e){return sl(4,2,n,e)},useMemo:function(n,e){var t=Qn();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=Qn();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=gy.bind(null,xt,n),[i.memoizedState,n]},useRef:function(n){var e=Qn();return n={current:n},e.memoizedState=n},useState:Ap,useDebugValue:qd,useDeferredValue:function(n){return Qn().memoizedState=n},useTransition:function(){var n=Ap(!1),e=n[0];return n=my.bind(null,n[1]),Qn().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=xt,r=Qn();if(gt){if(t===void 0)throw Error(ae(407));t=t()}else{if(t=e(),Ft===null)throw Error(ae(349));Nr&30||Pg(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,bp(Lg.bind(null,i,s,n),[n]),i.flags|=2048,Go(9,Rg.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=Qn(),e=Ft.identifierPrefix;if(gt){var t=_i,i=vi;t=(i&~(1<<32-Yn(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Bo++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=py++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},xy={readContext:Dn,useCallback:kg,useContext:Dn,useEffect:$d,useImperativeHandle:Og,useInsertionEffect:Ug,useLayoutEffect:zg,useMemo:Bg,useReducer:Vc,useRef:Ig,useState:function(){return Vc(Ho)},useDebugValue:qd,useDeferredValue:function(n){var e=In();return Hg(e,Pt.memoizedState,n)},useTransition:function(){var n=Vc(Ho)[0],e=In().memoizedState;return[n,e]},useMutableSource:bg,useSyncExternalStore:Cg,useId:Gg,unstable_isNewReconciler:!1},yy={readContext:Dn,useCallback:kg,useContext:Dn,useEffect:$d,useImperativeHandle:Og,useInsertionEffect:Ug,useLayoutEffect:zg,useMemo:Bg,useReducer:Wc,useRef:Ig,useState:function(){return Wc(Ho)},useDebugValue:qd,useDeferredValue:function(n){var e=In();return Pt===null?e.memoizedState=n:Hg(e,Pt.memoizedState,n)},useTransition:function(){var n=Wc(Ho)[0],e=In().memoizedState;return[n,e]},useMutableSource:bg,useSyncExternalStore:Cg,useId:Gg,unstable_isNewReconciler:!1};function Bn(n,e){if(n&&n.defaultProps){e=yt({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function hh(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:yt({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var sc={isMounted:function(n){return(n=n._reactInternals)?kr(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=en(),r=qi(n),s=Si(i,r);s.payload=e,t!=null&&(s.callback=t),e=Ki(n,s,r),e!==null&&(Zn(e,n,r,i),il(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=en(),r=qi(n),s=Si(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=Ki(n,s,r),e!==null&&(Zn(e,n,r,i),il(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=en(),i=qi(n),r=Si(t,i);r.tag=2,e!=null&&(r.callback=e),e=Ki(n,r,i),e!==null&&(Zn(e,n,i,t),il(e,n,i))}};function Cp(n,e,t,i,r,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Io(t,i)||!Io(r,s):!0}function jg(n,e,t){var i=!1,r=nr,s=e.contextType;return typeof s=="object"&&s!==null?s=Dn(s):(r=hn(e)?Rr:$t.current,i=e.contextTypes,s=(i=i!=null)?bs(n,r):nr),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=sc,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function Pp(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&sc.enqueueReplaceState(e,e.state,null)}function dh(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},Vd(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Dn(s):(s=hn(e)?Rr:$t.current,r.context=bs(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(hh(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&sc.enqueueReplaceState(r,r.state,null),Nl(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function Ls(n,e){try{var t="",i=e;do t+=Z_(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Xc(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function fh(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var Sy=typeof WeakMap=="function"?WeakMap:Map;function Yg(n,e,t){t=Si(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){Fl||(Fl=!0,wh=i),fh(n,e)},t}function Zg(n,e,t){t=Si(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){fh(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){fh(n,e),typeof i!="function"&&($i===null?$i=new Set([this]):$i.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function Rp(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new Sy;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=Uy.bind(null,n,e,t),e.then(n,n))}function Lp(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function Np(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=Si(-1,1),e.tag=2,Ki(t,e,1))),t.lanes|=1),n)}var My=Ci.ReactCurrentOwner,cn=!1;function Qt(n,e,t,i){e.child=n===null?wg(e,null,t,i):Ps(e,n.child,t,i)}function Dp(n,e,t,i,r){t=t.render;var s=e.ref;return Ss(e,r),i=Zd(n,e,t,i,s,r),t=Kd(),n!==null&&!cn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ti(n,e,r)):(gt&&t&&zd(e),e.flags|=1,Qt(n,e,i,r),e.child)}function Ip(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!of(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,Kg(n,e,s,i,r)):(n=cl(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:Io,t(o,i)&&n.ref===e.ref)return Ti(n,e,r)}return e.flags|=1,n=Ji(s,i),n.ref=e.ref,n.return=e,e.child=n}function Kg(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(Io(s,i)&&n.ref===e.ref)if(cn=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(cn=!0);else return e.lanes=n.lanes,Ti(n,e,r)}return ph(n,e,t,i,r)}function $g(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ut(ps,_n),_n|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,ut(ps,_n),_n|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,ut(ps,_n),_n|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,ut(ps,_n),_n|=i;return Qt(n,e,r,t),e.child}function qg(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function ph(n,e,t,i,r){var s=hn(t)?Rr:$t.current;return s=bs(e,s),Ss(e,r),t=Zd(n,e,t,i,s,r),i=Kd(),n!==null&&!cn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ti(n,e,r)):(gt&&i&&zd(e),e.flags|=1,Qt(n,e,t,r),e.child)}function Up(n,e,t,i,r){if(hn(t)){var s=!0;bl(e)}else s=!1;if(Ss(e,r),e.stateNode===null)ol(n,e),jg(e,t,i),dh(e,t,i,r),i=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=t.contextType;typeof c=="object"&&c!==null?c=Dn(c):(c=hn(t)?Rr:$t.current,c=bs(e,c));var h=t.getDerivedStateFromProps,u=typeof h=="function"||typeof o.getSnapshotBeforeUpdate=="function";u||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&Pp(e,o,i,c),Oi=!1;var f=e.memoizedState;o.state=f,Nl(e,i,o,r),l=e.memoizedState,a!==i||f!==l||un.current||Oi?(typeof h=="function"&&(hh(e,t,h,i),l=e.memoizedState),(a=Oi||Cp(e,t,a,i,f,l,c))?(u||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,Tg(n,e),a=e.memoizedProps,c=e.type===e.elementType?a:Bn(e.type,a),o.props=c,u=e.pendingProps,f=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=Dn(l):(l=hn(t)?Rr:$t.current,l=bs(e,l));var p=t.getDerivedStateFromProps;(h=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==u||f!==l)&&Pp(e,o,i,l),Oi=!1,f=e.memoizedState,o.state=f,Nl(e,i,o,r);var m=e.memoizedState;a!==u||f!==m||un.current||Oi?(typeof p=="function"&&(hh(e,t,p,i),m=e.memoizedState),(c=Oi||Cp(e,t,c,i,f,m,l)||!1)?(h||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,m,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,m,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&f===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&f===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=m),o.props=i,o.state=m,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&f===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&f===n.memoizedState||(e.flags|=1024),i=!1)}return mh(n,e,t,i,s,r)}function mh(n,e,t,i,r,s){qg(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&yp(e,t,!1),Ti(n,e,s);i=e.stateNode,My.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=Ps(e,n.child,null,s),e.child=Ps(e,null,a,s)):Qt(n,e,a,s),e.memoizedState=i.state,r&&yp(e,t,!0),e.child}function Jg(n){var e=n.stateNode;e.pendingContext?xp(n,e.pendingContext,e.pendingContext!==e.context):e.context&&xp(n,e.context,!1),Wd(n,e.containerInfo)}function zp(n,e,t,i,r){return Cs(),Od(r),e.flags|=256,Qt(n,e,t,i),e.child}var gh={dehydrated:null,treeContext:null,retryLane:0};function vh(n){return{baseLanes:n,cachePool:null,transitions:null}}function Qg(n,e,t){var i=e.pendingProps,r=vt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),ut(vt,r&1),n===null)return ch(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,n=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=lc(o,i,0,null),n=Pr(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=vh(t),e.memoizedState=gh,n):Jd(e,o));if(r=n.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return wy(n,e,o,i,a,r,t);if(s){s=i.fallback,o=e.mode,r=n.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Ji(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=Ji(a,s):(s=Pr(s,o,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=n.child.memoizedState,o=o===null?vh(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=gh,i}return s=n.child,n=s.sibling,i=Ji(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function Jd(n,e){return e=lc({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function _a(n,e,t,i){return i!==null&&Od(i),Ps(e,n.child,null,t),n=Jd(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function wy(n,e,t,i,r,s,o){if(t)return e.flags&256?(e.flags&=-257,i=Xc(Error(ae(422))),_a(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=lc({mode:"visible",children:i.children},r,0,null),s=Pr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ps(e,n.child,null,o),e.child.memoizedState=vh(o),e.memoizedState=gh,s);if(!(e.mode&1))return _a(n,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(ae(419)),i=Xc(s,i,void 0),_a(n,e,o,i)}if(a=(o&n.childLanes)!==0,cn||a){if(i=Ft,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ei(n,r),Zn(i,n,r,-1))}return sf(),i=Xc(Error(ae(421))),_a(n,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=zy.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,yn=Zi(r.nextSibling),Sn=e,gt=!0,Gn=null,n!==null&&(Cn[Pn++]=vi,Cn[Pn++]=_i,Cn[Pn++]=Lr,vi=n.id,_i=n.overflow,Lr=e),e=Jd(e,i.children),e.flags|=4096,e)}function Fp(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),uh(n.return,e,t)}function jc(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function ev(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Qt(n,e,i.children,t),i=vt.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&Fp(n,t,e);else if(n.tag===19)Fp(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(ut(vt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&Dl(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),jc(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&Dl(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}jc(e,!0,t,null,s);break;case"together":jc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function ol(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Ti(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),Dr|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(ae(153));if(e.child!==null){for(n=e.child,t=Ji(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=Ji(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function Ey(n,e,t){switch(e.tag){case 3:Jg(e),Cs();break;case 5:Ag(e);break;case 1:hn(e.type)&&bl(e);break;case 4:Wd(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ut(Rl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ut(vt,vt.current&1),e.flags|=128,null):t&e.child.childLanes?Qg(n,e,t):(ut(vt,vt.current&1),n=Ti(n,e,t),n!==null?n.sibling:null);ut(vt,vt.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return ev(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ut(vt,vt.current),i)break;return null;case 22:case 23:return e.lanes=0,$g(n,e,t)}return Ti(n,e,t)}var tv,_h,nv,iv;tv=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};_h=function(){};nv=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,Tr(ri.current);var s=null;switch(t){case"input":r=Bu(n,r),i=Bu(n,i),s=[];break;case"select":r=yt({},r,{value:void 0}),i=yt({},i,{value:void 0}),s=[];break;case"textarea":r=Vu(n,r),i=Vu(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=Tl)}Xu(t,i);var o;t=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(bo.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(bo.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&dt("scroll",n),s||a===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};iv=function(n,e,t,i){t!==i&&(e.flags|=4)};function Js(n,e){if(!gt)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function Wt(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function Ty(n,e,t){var i=e.pendingProps;switch(Fd(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Wt(e),null;case 1:return hn(e.type)&&Al(),Wt(e),null;case 3:return i=e.stateNode,Rs(),pt(un),pt($t),jd(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(ga(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Gn!==null&&(Ah(Gn),Gn=null))),_h(n,e),Wt(e),null;case 5:Xd(e);var r=Tr(ko.current);if(t=e.type,n!==null&&e.stateNode!=null)nv(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ae(166));return Wt(e),null}if(n=Tr(ri.current),ga(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[ti]=e,i[Fo]=s,n=(e.mode&1)!==0,t){case"dialog":dt("cancel",i),dt("close",i);break;case"iframe":case"object":case"embed":dt("load",i);break;case"video":case"audio":for(r=0;r<ho.length;r++)dt(ho[r],i);break;case"source":dt("error",i);break;case"img":case"image":case"link":dt("error",i),dt("load",i);break;case"details":dt("toggle",i);break;case"input":jf(i,s),dt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},dt("invalid",i);break;case"textarea":Zf(i,s),dt("invalid",i)}Xu(t,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&ma(i.textContent,a,n),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&ma(i.textContent,a,n),r=["children",""+a]):bo.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&dt("scroll",i)}switch(t){case"input":aa(i),Yf(i,s,!0);break;case"textarea":aa(i),Kf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Tl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=L0(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[ti]=e,n[Fo]=i,tv(n,e,!1,!1),e.stateNode=n;e:{switch(o=ju(t,i),t){case"dialog":dt("cancel",n),dt("close",n),r=i;break;case"iframe":case"object":case"embed":dt("load",n),r=i;break;case"video":case"audio":for(r=0;r<ho.length;r++)dt(ho[r],n);r=i;break;case"source":dt("error",n),r=i;break;case"img":case"image":case"link":dt("error",n),dt("load",n),r=i;break;case"details":dt("toggle",n),r=i;break;case"input":jf(n,i),r=Bu(n,i),dt("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=yt({},i,{value:void 0}),dt("invalid",n);break;case"textarea":Zf(n,i),r=Vu(n,i),dt("invalid",n);break;default:r=i}Xu(t,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?I0(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&N0(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&Co(n,l):typeof l=="number"&&Co(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(bo.hasOwnProperty(s)?l!=null&&s==="onScroll"&&dt("scroll",n):l!=null&&Md(n,s,l,o))}switch(t){case"input":aa(n),Yf(n,i,!1);break;case"textarea":aa(n),Kf(n);break;case"option":i.value!=null&&n.setAttribute("value",""+tr(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?vs(n,!!i.multiple,s,!1):i.defaultValue!=null&&vs(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=Tl)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Wt(e),null;case 6:if(n&&e.stateNode!=null)iv(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ae(166));if(t=Tr(ko.current),Tr(ri.current),ga(e)){if(i=e.stateNode,t=e.memoizedProps,i[ti]=e,(s=i.nodeValue!==t)&&(n=Sn,n!==null))switch(n.tag){case 3:ma(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&ma(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[ti]=e,e.stateNode=i}return Wt(e),null;case 13:if(pt(vt),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(gt&&yn!==null&&e.mode&1&&!(e.flags&128))Sg(),Cs(),e.flags|=98560,s=!1;else if(s=ga(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(ae(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ae(317));s[ti]=e}else Cs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Wt(e),s=!1}else Gn!==null&&(Ah(Gn),Gn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||vt.current&1?Lt===0&&(Lt=3):sf())),e.updateQueue!==null&&(e.flags|=4),Wt(e),null);case 4:return Rs(),_h(n,e),n===null&&Uo(e.stateNode.containerInfo),Wt(e),null;case 10:return Hd(e.type._context),Wt(e),null;case 17:return hn(e.type)&&Al(),Wt(e),null;case 19:if(pt(vt),s=e.memoizedState,s===null)return Wt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)Js(s,!1);else{if(Lt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=Dl(n),o!==null){for(e.flags|=128,Js(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return ut(vt,vt.current&1|2),e.child}n=n.sibling}s.tail!==null&&Tt()>Ns&&(e.flags|=128,i=!0,Js(s,!1),e.lanes=4194304)}else{if(!i)if(n=Dl(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),Js(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!gt)return Wt(e),null}else 2*Tt()-s.renderingStartTime>Ns&&t!==1073741824&&(e.flags|=128,i=!0,Js(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Tt(),e.sibling=null,t=vt.current,ut(vt,i?t&1|2:t&1),e):(Wt(e),null);case 22:case 23:return rf(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?_n&1073741824&&(Wt(e),e.subtreeFlags&6&&(e.flags|=8192)):Wt(e),null;case 24:return null;case 25:return null}throw Error(ae(156,e.tag))}function Ay(n,e){switch(Fd(e),e.tag){case 1:return hn(e.type)&&Al(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Rs(),pt(un),pt($t),jd(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return Xd(e),null;case 13:if(pt(vt),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(ae(340));Cs()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return pt(vt),null;case 4:return Rs(),null;case 10:return Hd(e.type._context),null;case 22:case 23:return rf(),null;case 24:return null;default:return null}}var xa=!1,Zt=!1,by=typeof WeakSet=="function"?WeakSet:Set,Te=null;function fs(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){Mt(n,e,i)}else t.current=null}function xh(n,e,t){try{t()}catch(i){Mt(n,e,i)}}var Op=!1;function Cy(n,e){if(nh=Ml,n=lg(),Ud(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,c=0,h=0,u=n,f=null;t:for(;;){for(var p;u!==t||r!==0&&u.nodeType!==3||(a=o+r),u!==s||i!==0&&u.nodeType!==3||(l=o+i),u.nodeType===3&&(o+=u.nodeValue.length),(p=u.firstChild)!==null;)f=u,u=p;for(;;){if(u===n)break t;if(f===t&&++c===r&&(a=o),f===s&&++h===i&&(l=o),(p=u.nextSibling)!==null)break;u=f,f=u.parentNode}u=p}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(ih={focusedElem:n,selectionRange:t},Ml=!1,Te=e;Te!==null;)if(e=Te,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,Te=n;else for(;Te!==null;){e=Te;try{var m=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(m!==null){var x=m.memoizedProps,v=m.memoizedState,d=e.stateNode,_=d.getSnapshotBeforeUpdate(e.elementType===e.type?x:Bn(e.type,x),v);d.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var g=e.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ae(163))}}catch(S){Mt(e,e.return,S)}if(n=e.sibling,n!==null){n.return=e.return,Te=n;break}Te=e.return}return m=Op,Op=!1,m}function yo(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&xh(e,t,s)}r=r.next}while(r!==i)}}function oc(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function yh(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function rv(n){var e=n.alternate;e!==null&&(n.alternate=null,rv(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[ti],delete e[Fo],delete e[oh],delete e[uy],delete e[hy])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function sv(n){return n.tag===5||n.tag===3||n.tag===4}function kp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||sv(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Sh(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=Tl));else if(i!==4&&(n=n.child,n!==null))for(Sh(n,e,t),n=n.sibling;n!==null;)Sh(n,e,t),n=n.sibling}function Mh(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(Mh(n,e,t),n=n.sibling;n!==null;)Mh(n,e,t),n=n.sibling}var Bt=null,Hn=!1;function Ri(n,e,t){for(t=t.child;t!==null;)ov(n,e,t),t=t.sibling}function ov(n,e,t){if(ii&&typeof ii.onCommitFiberUnmount=="function")try{ii.onCommitFiberUnmount(Jl,t)}catch{}switch(t.tag){case 5:Zt||fs(t,e);case 6:var i=Bt,r=Hn;Bt=null,Ri(n,e,t),Bt=i,Hn=r,Bt!==null&&(Hn?(n=Bt,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Bt.removeChild(t.stateNode));break;case 18:Bt!==null&&(Hn?(n=Bt,t=t.stateNode,n.nodeType===8?kc(n.parentNode,t):n.nodeType===1&&kc(n,t),No(n)):kc(Bt,t.stateNode));break;case 4:i=Bt,r=Hn,Bt=t.stateNode.containerInfo,Hn=!0,Ri(n,e,t),Bt=i,Hn=r;break;case 0:case 11:case 14:case 15:if(!Zt&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&xh(t,e,o),r=r.next}while(r!==i)}Ri(n,e,t);break;case 1:if(!Zt&&(fs(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(a){Mt(t,e,a)}Ri(n,e,t);break;case 21:Ri(n,e,t);break;case 22:t.mode&1?(Zt=(i=Zt)||t.memoizedState!==null,Ri(n,e,t),Zt=i):Ri(n,e,t);break;default:Ri(n,e,t)}}function Bp(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new by),e.forEach(function(i){var r=Fy.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function zn(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Bt=a.stateNode,Hn=!1;break e;case 3:Bt=a.stateNode.containerInfo,Hn=!0;break e;case 4:Bt=a.stateNode.containerInfo,Hn=!0;break e}a=a.return}if(Bt===null)throw Error(ae(160));ov(s,o,r),Bt=null,Hn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Mt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)av(e,n),e=e.sibling}function av(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(zn(e,n),Jn(n),i&4){try{yo(3,n,n.return),oc(3,n)}catch(x){Mt(n,n.return,x)}try{yo(5,n,n.return)}catch(x){Mt(n,n.return,x)}}break;case 1:zn(e,n),Jn(n),i&512&&t!==null&&fs(t,t.return);break;case 5:if(zn(e,n),Jn(n),i&512&&t!==null&&fs(t,t.return),n.flags&32){var r=n.stateNode;try{Co(r,"")}catch(x){Mt(n,n.return,x)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,a=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&P0(r,s),ju(a,o);var c=ju(a,s);for(o=0;o<l.length;o+=2){var h=l[o],u=l[o+1];h==="style"?I0(r,u):h==="dangerouslySetInnerHTML"?N0(r,u):h==="children"?Co(r,u):Md(r,h,u,c)}switch(a){case"input":Hu(r,s);break;case"textarea":R0(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?vs(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?vs(r,!!s.multiple,s.defaultValue,!0):vs(r,!!s.multiple,s.multiple?[]:"",!1))}r[Fo]=s}catch(x){Mt(n,n.return,x)}}break;case 6:if(zn(e,n),Jn(n),i&4){if(n.stateNode===null)throw Error(ae(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(x){Mt(n,n.return,x)}}break;case 3:if(zn(e,n),Jn(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{No(e.containerInfo)}catch(x){Mt(n,n.return,x)}break;case 4:zn(e,n),Jn(n);break;case 13:zn(e,n),Jn(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(tf=Tt())),i&4&&Bp(n);break;case 22:if(h=t!==null&&t.memoizedState!==null,n.mode&1?(Zt=(c=Zt)||h,zn(e,n),Zt=c):zn(e,n),Jn(n),i&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!h&&n.mode&1)for(Te=n,h=n.child;h!==null;){for(u=Te=h;Te!==null;){switch(f=Te,p=f.child,f.tag){case 0:case 11:case 14:case 15:yo(4,f,f.return);break;case 1:fs(f,f.return);var m=f.stateNode;if(typeof m.componentWillUnmount=="function"){i=f,t=f.return;try{e=i,m.props=e.memoizedProps,m.state=e.memoizedState,m.componentWillUnmount()}catch(x){Mt(i,t,x)}}break;case 5:fs(f,f.return);break;case 22:if(f.memoizedState!==null){Gp(u);continue}}p!==null?(p.return=f,Te=p):Gp(u)}h=h.sibling}e:for(h=null,u=n;;){if(u.tag===5){if(h===null){h=u;try{r=u.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=u.stateNode,l=u.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=D0("display",o))}catch(x){Mt(n,n.return,x)}}}else if(u.tag===6){if(h===null)try{u.stateNode.nodeValue=c?"":u.memoizedProps}catch(x){Mt(n,n.return,x)}}else if((u.tag!==22&&u.tag!==23||u.memoizedState===null||u===n)&&u.child!==null){u.child.return=u,u=u.child;continue}if(u===n)break e;for(;u.sibling===null;){if(u.return===null||u.return===n)break e;h===u&&(h=null),u=u.return}h===u&&(h=null),u.sibling.return=u.return,u=u.sibling}}break;case 19:zn(e,n),Jn(n),i&4&&Bp(n);break;case 21:break;default:zn(e,n),Jn(n)}}function Jn(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(sv(t)){var i=t;break e}t=t.return}throw Error(ae(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Co(r,""),i.flags&=-33);var s=kp(n);Mh(n,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=kp(n);Sh(n,a,o);break;default:throw Error(ae(161))}}catch(l){Mt(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function Py(n,e,t){Te=n,lv(n)}function lv(n,e,t){for(var i=(n.mode&1)!==0;Te!==null;){var r=Te,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||xa;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||Zt;a=xa;var c=Zt;if(xa=o,(Zt=l)&&!c)for(Te=r;Te!==null;)o=Te,l=o.child,o.tag===22&&o.memoizedState!==null?Vp(r):l!==null?(l.return=o,Te=l):Vp(r);for(;s!==null;)Te=s,lv(s),s=s.sibling;Te=r,xa=a,Zt=c}Hp(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,Te=s):Hp(n)}}function Hp(n){for(;Te!==null;){var e=Te;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Zt||oc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Zt)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:Bn(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Tp(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}Tp(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var h=c.memoizedState;if(h!==null){var u=h.dehydrated;u!==null&&No(u)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ae(163))}Zt||e.flags&512&&yh(e)}catch(f){Mt(e,e.return,f)}}if(e===n){Te=null;break}if(t=e.sibling,t!==null){t.return=e.return,Te=t;break}Te=e.return}}function Gp(n){for(;Te!==null;){var e=Te;if(e===n){Te=null;break}var t=e.sibling;if(t!==null){t.return=e.return,Te=t;break}Te=e.return}}function Vp(n){for(;Te!==null;){var e=Te;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{oc(4,e)}catch(l){Mt(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Mt(e,r,l)}}var s=e.return;try{yh(e)}catch(l){Mt(e,s,l)}break;case 5:var o=e.return;try{yh(e)}catch(l){Mt(e,o,l)}}}catch(l){Mt(e,e.return,l)}if(e===n){Te=null;break}var a=e.sibling;if(a!==null){a.return=e.return,Te=a;break}Te=e.return}}var Ry=Math.ceil,zl=Ci.ReactCurrentDispatcher,Qd=Ci.ReactCurrentOwner,Nn=Ci.ReactCurrentBatchConfig,Qe=0,Ft=null,Ct=null,Ht=0,_n=0,ps=or(0),Lt=0,Vo=null,Dr=0,ac=0,ef=0,So=null,ln=null,tf=0,Ns=1/0,mi=null,Fl=!1,wh=null,$i=null,ya=!1,Vi=null,Ol=0,Mo=0,Eh=null,al=-1,ll=0;function en(){return Qe&6?Tt():al!==-1?al:al=Tt()}function qi(n){return n.mode&1?Qe&2&&Ht!==0?Ht&-Ht:fy.transition!==null?(ll===0&&(ll=j0()),ll):(n=st,n!==0||(n=window.event,n=n===void 0?16:Q0(n.type)),n):1}function Zn(n,e,t,i){if(50<Mo)throw Mo=0,Eh=null,Error(ae(185));$o(n,t,i),(!(Qe&2)||n!==Ft)&&(n===Ft&&(!(Qe&2)&&(ac|=t),Lt===4&&Bi(n,Ht)),dn(n,i),t===1&&Qe===0&&!(e.mode&1)&&(Ns=Tt()+500,ic&&ar()))}function dn(n,e){var t=n.callbackNode;fx(n,e);var i=Sl(n,n===Ft?Ht:0);if(i===0)t!==null&&Jf(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&Jf(t),e===1)n.tag===0?dy(Wp.bind(null,n)):_g(Wp.bind(null,n)),ly(function(){!(Qe&6)&&ar()}),t=null;else{switch(Y0(i)){case 1:t=bd;break;case 4:t=W0;break;case 16:t=yl;break;case 536870912:t=X0;break;default:t=yl}t=gv(t,cv.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function cv(n,e){if(al=-1,ll=0,Qe&6)throw Error(ae(327));var t=n.callbackNode;if(Ms()&&n.callbackNode!==t)return null;var i=Sl(n,n===Ft?Ht:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=kl(n,i);else{e=i;var r=Qe;Qe|=2;var s=hv();(Ft!==n||Ht!==e)&&(mi=null,Ns=Tt()+500,Cr(n,e));do try{Dy();break}catch(a){uv(n,a)}while(!0);Bd(),zl.current=s,Qe=r,Ct!==null?e=0:(Ft=null,Ht=0,e=Lt)}if(e!==0){if(e===2&&(r=qu(n),r!==0&&(i=r,e=Th(n,r))),e===1)throw t=Vo,Cr(n,0),Bi(n,i),dn(n,Tt()),t;if(e===6)Bi(n,i);else{if(r=n.current.alternate,!(i&30)&&!Ly(r)&&(e=kl(n,i),e===2&&(s=qu(n),s!==0&&(i=s,e=Th(n,s))),e===1))throw t=Vo,Cr(n,0),Bi(n,i),dn(n,Tt()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(ae(345));case 2:_r(n,ln,mi);break;case 3:if(Bi(n,i),(i&130023424)===i&&(e=tf+500-Tt(),10<e)){if(Sl(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){en(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=sh(_r.bind(null,n,ln,mi),e);break}_r(n,ln,mi);break;case 4:if(Bi(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var o=31-Yn(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=Tt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Ry(i/1960))-i,10<i){n.timeoutHandle=sh(_r.bind(null,n,ln,mi),i);break}_r(n,ln,mi);break;case 5:_r(n,ln,mi);break;default:throw Error(ae(329))}}}return dn(n,Tt()),n.callbackNode===t?cv.bind(null,n):null}function Th(n,e){var t=So;return n.current.memoizedState.isDehydrated&&(Cr(n,e).flags|=256),n=kl(n,e),n!==2&&(e=ln,ln=t,e!==null&&Ah(e)),n}function Ah(n){ln===null?ln=n:ln.push.apply(ln,n)}function Ly(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!Kn(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Bi(n,e){for(e&=~ef,e&=~ac,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-Yn(e),i=1<<t;n[t]=-1,e&=~i}}function Wp(n){if(Qe&6)throw Error(ae(327));Ms();var e=Sl(n,0);if(!(e&1))return dn(n,Tt()),null;var t=kl(n,e);if(n.tag!==0&&t===2){var i=qu(n);i!==0&&(e=i,t=Th(n,i))}if(t===1)throw t=Vo,Cr(n,0),Bi(n,e),dn(n,Tt()),t;if(t===6)throw Error(ae(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,_r(n,ln,mi),dn(n,Tt()),null}function nf(n,e){var t=Qe;Qe|=1;try{return n(e)}finally{Qe=t,Qe===0&&(Ns=Tt()+500,ic&&ar())}}function Ir(n){Vi!==null&&Vi.tag===0&&!(Qe&6)&&Ms();var e=Qe;Qe|=1;var t=Nn.transition,i=st;try{if(Nn.transition=null,st=1,n)return n()}finally{st=i,Nn.transition=t,Qe=e,!(Qe&6)&&ar()}}function rf(){_n=ps.current,pt(ps)}function Cr(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,ay(t)),Ct!==null)for(t=Ct.return;t!==null;){var i=t;switch(Fd(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Al();break;case 3:Rs(),pt(un),pt($t),jd();break;case 5:Xd(i);break;case 4:Rs();break;case 13:pt(vt);break;case 19:pt(vt);break;case 10:Hd(i.type._context);break;case 22:case 23:rf()}t=t.return}if(Ft=n,Ct=n=Ji(n.current,null),Ht=_n=e,Lt=0,Vo=null,ef=ac=Dr=0,ln=So=null,Er!==null){for(e=0;e<Er.length;e++)if(t=Er[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}t.pending=i}Er=null}return n}function uv(n,e){do{var t=Ct;try{if(Bd(),rl.current=Ul,Il){for(var i=xt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Il=!1}if(Nr=0,zt=Pt=xt=null,xo=!1,Bo=0,Qd.current=null,t===null||t.return===null){Lt=1,Vo=e,Ct=null;break}e:{var s=n,o=t.return,a=t,l=e;if(e=Ht,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,h=a,u=h.tag;if(!(h.mode&1)&&(u===0||u===11||u===15)){var f=h.alternate;f?(h.updateQueue=f.updateQueue,h.memoizedState=f.memoizedState,h.lanes=f.lanes):(h.updateQueue=null,h.memoizedState=null)}var p=Lp(o);if(p!==null){p.flags&=-257,Np(p,o,a,s,e),p.mode&1&&Rp(s,c,e),e=p,l=c;var m=e.updateQueue;if(m===null){var x=new Set;x.add(l),e.updateQueue=x}else m.add(l);break e}else{if(!(e&1)){Rp(s,c,e),sf();break e}l=Error(ae(426))}}else if(gt&&a.mode&1){var v=Lp(o);if(v!==null){!(v.flags&65536)&&(v.flags|=256),Np(v,o,a,s,e),Od(Ls(l,a));break e}}s=l=Ls(l,a),Lt!==4&&(Lt=2),So===null?So=[s]:So.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=Yg(s,l,e);Ep(s,d);break e;case 1:a=l;var _=s.type,g=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&($i===null||!$i.has(g)))){s.flags|=65536,e&=-e,s.lanes|=e;var S=Zg(s,a,e);Ep(s,S);break e}}s=s.return}while(s!==null)}fv(t)}catch(A){e=A,Ct===t&&t!==null&&(Ct=t=t.return);continue}break}while(!0)}function hv(){var n=zl.current;return zl.current=Ul,n===null?Ul:n}function sf(){(Lt===0||Lt===3||Lt===2)&&(Lt=4),Ft===null||!(Dr&268435455)&&!(ac&268435455)||Bi(Ft,Ht)}function kl(n,e){var t=Qe;Qe|=2;var i=hv();(Ft!==n||Ht!==e)&&(mi=null,Cr(n,e));do try{Ny();break}catch(r){uv(n,r)}while(!0);if(Bd(),Qe=t,zl.current=i,Ct!==null)throw Error(ae(261));return Ft=null,Ht=0,Lt}function Ny(){for(;Ct!==null;)dv(Ct)}function Dy(){for(;Ct!==null&&!rx();)dv(Ct)}function dv(n){var e=mv(n.alternate,n,_n);n.memoizedProps=n.pendingProps,e===null?fv(n):Ct=e,Qd.current=null}function fv(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=Ay(t,e),t!==null){t.flags&=32767,Ct=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Lt=6,Ct=null;return}}else if(t=Ty(t,e,_n),t!==null){Ct=t;return}if(e=e.sibling,e!==null){Ct=e;return}Ct=e=n}while(e!==null);Lt===0&&(Lt=5)}function _r(n,e,t){var i=st,r=Nn.transition;try{Nn.transition=null,st=1,Iy(n,e,t,i)}finally{Nn.transition=r,st=i}return null}function Iy(n,e,t,i){do Ms();while(Vi!==null);if(Qe&6)throw Error(ae(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(ae(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(px(n,s),n===Ft&&(Ct=Ft=null,Ht=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||ya||(ya=!0,gv(yl,function(){return Ms(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=Nn.transition,Nn.transition=null;var o=st;st=1;var a=Qe;Qe|=4,Qd.current=null,Cy(n,t),av(t,n),ey(ih),Ml=!!nh,ih=nh=null,n.current=t,Py(t),sx(),Qe=a,st=o,Nn.transition=s}else n.current=t;if(ya&&(ya=!1,Vi=n,Ol=r),s=n.pendingLanes,s===0&&($i=null),lx(t.stateNode),dn(n,Tt()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(Fl)throw Fl=!1,n=wh,wh=null,n;return Ol&1&&n.tag!==0&&Ms(),s=n.pendingLanes,s&1?n===Eh?Mo++:(Mo=0,Eh=n):Mo=0,ar(),null}function Ms(){if(Vi!==null){var n=Y0(Ol),e=Nn.transition,t=st;try{if(Nn.transition=null,st=16>n?16:n,Vi===null)var i=!1;else{if(n=Vi,Vi=null,Ol=0,Qe&6)throw Error(ae(331));var r=Qe;for(Qe|=4,Te=n.current;Te!==null;){var s=Te,o=s.child;if(Te.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(Te=c;Te!==null;){var h=Te;switch(h.tag){case 0:case 11:case 15:yo(8,h,s)}var u=h.child;if(u!==null)u.return=h,Te=u;else for(;Te!==null;){h=Te;var f=h.sibling,p=h.return;if(rv(h),h===c){Te=null;break}if(f!==null){f.return=p,Te=f;break}Te=p}}}var m=s.alternate;if(m!==null){var x=m.child;if(x!==null){m.child=null;do{var v=x.sibling;x.sibling=null,x=v}while(x!==null)}}Te=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,Te=o;else e:for(;Te!==null;){if(s=Te,s.flags&2048)switch(s.tag){case 0:case 11:case 15:yo(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,Te=d;break e}Te=s.return}}var _=n.current;for(Te=_;Te!==null;){o=Te;var g=o.child;if(o.subtreeFlags&2064&&g!==null)g.return=o,Te=g;else e:for(o=_;Te!==null;){if(a=Te,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:oc(9,a)}}catch(A){Mt(a,a.return,A)}if(a===o){Te=null;break e}var S=a.sibling;if(S!==null){S.return=a.return,Te=S;break e}Te=a.return}}if(Qe=r,ar(),ii&&typeof ii.onPostCommitFiberRoot=="function")try{ii.onPostCommitFiberRoot(Jl,n)}catch{}i=!0}return i}finally{st=t,Nn.transition=e}}return!1}function Xp(n,e,t){e=Ls(t,e),e=Yg(n,e,1),n=Ki(n,e,1),e=en(),n!==null&&($o(n,1,e),dn(n,e))}function Mt(n,e,t){if(n.tag===3)Xp(n,n,t);else for(;e!==null;){if(e.tag===3){Xp(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&($i===null||!$i.has(i))){n=Ls(t,n),n=Zg(e,n,1),e=Ki(e,n,1),n=en(),e!==null&&($o(e,1,n),dn(e,n));break}}e=e.return}}function Uy(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=en(),n.pingedLanes|=n.suspendedLanes&t,Ft===n&&(Ht&t)===t&&(Lt===4||Lt===3&&(Ht&130023424)===Ht&&500>Tt()-tf?Cr(n,0):ef|=t),dn(n,e)}function pv(n,e){e===0&&(n.mode&1?(e=ua,ua<<=1,!(ua&130023424)&&(ua=4194304)):e=1);var t=en();n=Ei(n,e),n!==null&&($o(n,e,t),dn(n,t))}function zy(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),pv(n,t)}function Fy(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(ae(314))}i!==null&&i.delete(e),pv(n,t)}var mv;mv=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||un.current)cn=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return cn=!1,Ey(n,e,t);cn=!!(n.flags&131072)}else cn=!1,gt&&e.flags&1048576&&xg(e,Pl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;ol(n,e),n=e.pendingProps;var r=bs(e,$t.current);Ss(e,t),r=Zd(null,e,i,n,r,t);var s=Kd();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,hn(i)?(s=!0,bl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Vd(e),r.updater=sc,e.stateNode=r,r._reactInternals=e,dh(e,i,n,t),e=mh(null,e,i,!0,s,t)):(e.tag=0,gt&&s&&zd(e),Qt(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(ol(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=ky(i),n=Bn(i,n),r){case 0:e=ph(null,e,i,n,t);break e;case 1:e=Up(null,e,i,n,t);break e;case 11:e=Dp(null,e,i,n,t);break e;case 14:e=Ip(null,e,i,Bn(i.type,n),t);break e}throw Error(ae(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Bn(i,r),ph(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Bn(i,r),Up(n,e,i,r,t);case 3:e:{if(Jg(e),n===null)throw Error(ae(387));i=e.pendingProps,s=e.memoizedState,r=s.element,Tg(n,e),Nl(e,i,null,t);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Ls(Error(ae(423)),e),e=zp(n,e,i,t,r);break e}else if(i!==r){r=Ls(Error(ae(424)),e),e=zp(n,e,i,t,r);break e}else for(yn=Zi(e.stateNode.containerInfo.firstChild),Sn=e,gt=!0,Gn=null,t=wg(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Cs(),i===r){e=Ti(n,e,t);break e}Qt(n,e,i,t)}e=e.child}return e;case 5:return Ag(e),n===null&&ch(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,o=r.children,rh(i,r)?o=null:s!==null&&rh(i,s)&&(e.flags|=32),qg(n,e),Qt(n,e,o,t),e.child;case 6:return n===null&&ch(e),null;case 13:return Qg(n,e,t);case 4:return Wd(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=Ps(e,null,i,t):Qt(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Bn(i,r),Dp(n,e,i,r,t);case 7:return Qt(n,e,e.pendingProps,t),e.child;case 8:return Qt(n,e,e.pendingProps.children,t),e.child;case 12:return Qt(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,ut(Rl,i._currentValue),i._currentValue=o,s!==null)if(Kn(s.value,o)){if(s.children===r.children&&!un.current){e=Ti(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Si(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var h=c.pending;h===null?l.next=l:(l.next=h.next,h.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),uh(s.return,t,e),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(ae(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),uh(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}Qt(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ss(e,t),r=Dn(r),i=i(r),e.flags|=1,Qt(n,e,i,t),e.child;case 14:return i=e.type,r=Bn(i,e.pendingProps),r=Bn(i.type,r),Ip(n,e,i,r,t);case 15:return Kg(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Bn(i,r),ol(n,e),e.tag=1,hn(i)?(n=!0,bl(e)):n=!1,Ss(e,t),jg(e,i,r),dh(e,i,r,t),mh(null,e,i,!0,n,t);case 19:return ev(n,e,t);case 22:return $g(n,e,t)}throw Error(ae(156,e.tag))};function gv(n,e){return V0(n,e)}function Oy(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Rn(n,e,t,i){return new Oy(n,e,t,i)}function of(n){return n=n.prototype,!(!n||!n.isReactComponent)}function ky(n){if(typeof n=="function")return of(n)?1:0;if(n!=null){if(n=n.$$typeof,n===Ed)return 11;if(n===Td)return 14}return 2}function Ji(n,e){var t=n.alternate;return t===null?(t=Rn(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function cl(n,e,t,i,r,s){var o=2;if(i=n,typeof n=="function")of(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case rs:return Pr(t.children,r,s,e);case wd:o=8,r|=8;break;case zu:return n=Rn(12,t,e,r|2),n.elementType=zu,n.lanes=s,n;case Fu:return n=Rn(13,t,e,r),n.elementType=Fu,n.lanes=s,n;case Ou:return n=Rn(19,t,e,r),n.elementType=Ou,n.lanes=s,n;case A0:return lc(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case E0:o=10;break e;case T0:o=9;break e;case Ed:o=11;break e;case Td:o=14;break e;case Fi:o=16,i=null;break e}throw Error(ae(130,n==null?n:typeof n,""))}return e=Rn(o,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function Pr(n,e,t,i){return n=Rn(7,n,i,e),n.lanes=t,n}function lc(n,e,t,i){return n=Rn(22,n,i,e),n.elementType=A0,n.lanes=t,n.stateNode={isHidden:!1},n}function Yc(n,e,t){return n=Rn(6,n,null,e),n.lanes=t,n}function Zc(n,e,t){return e=Rn(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function By(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Cc(0),this.expirationTimes=Cc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Cc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function af(n,e,t,i,r,s,o,a,l){return n=new By(n,e,t,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Rn(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},Vd(s),n}function Hy(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:is,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function vv(n){if(!n)return nr;n=n._reactInternals;e:{if(kr(n)!==n||n.tag!==1)throw Error(ae(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(hn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ae(171))}if(n.tag===1){var t=n.type;if(hn(t))return vg(n,t,e)}return e}function _v(n,e,t,i,r,s,o,a,l){return n=af(t,i,!0,n,r,s,o,a,l),n.context=vv(null),t=n.current,i=en(),r=qi(t),s=Si(i,r),s.callback=e??null,Ki(t,s,r),n.current.lanes=r,$o(n,r,i),dn(n,i),n}function cc(n,e,t,i){var r=e.current,s=en(),o=qi(r);return t=vv(t),e.context===null?e.context=t:e.pendingContext=t,e=Si(s,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=Ki(r,e,o),n!==null&&(Zn(n,r,o,s),il(n,r,o)),o}function Bl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function jp(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function lf(n,e){jp(n,e),(n=n.alternate)&&jp(n,e)}function Gy(){return null}var xv=typeof reportError=="function"?reportError:function(n){console.error(n)};function cf(n){this._internalRoot=n}uc.prototype.render=cf.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(ae(409));cc(n,e,null,null)};uc.prototype.unmount=cf.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;Ir(function(){cc(null,n,null,null)}),e[wi]=null}};function uc(n){this._internalRoot=n}uc.prototype.unstable_scheduleHydration=function(n){if(n){var e=$0();n={blockedOn:null,target:n,priority:e};for(var t=0;t<ki.length&&e!==0&&e<ki[t].priority;t++);ki.splice(t,0,n),t===0&&J0(n)}};function uf(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function hc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Yp(){}function Vy(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Bl(o);s.call(c)}}var o=_v(e,i,n,0,null,!1,!1,"",Yp);return n._reactRootContainer=o,n[wi]=o.current,Uo(n.nodeType===8?n.parentNode:n),Ir(),o}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=Bl(l);a.call(c)}}var l=af(n,0,!1,null,null,!1,!1,"",Yp);return n._reactRootContainer=l,n[wi]=l.current,Uo(n.nodeType===8?n.parentNode:n),Ir(function(){cc(e,l,t,i)}),l}function dc(n,e,t,i,r){var s=t._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=Bl(o);a.call(l)}}cc(e,o,n,r)}else o=Vy(t,e,n,r,i);return Bl(o)}Z0=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=uo(e.pendingLanes);t!==0&&(Cd(e,t|1),dn(e,Tt()),!(Qe&6)&&(Ns=Tt()+500,ar()))}break;case 13:Ir(function(){var i=Ei(n,1);if(i!==null){var r=en();Zn(i,n,1,r)}}),lf(n,1)}};Pd=function(n){if(n.tag===13){var e=Ei(n,134217728);if(e!==null){var t=en();Zn(e,n,134217728,t)}lf(n,134217728)}};K0=function(n){if(n.tag===13){var e=qi(n),t=Ei(n,e);if(t!==null){var i=en();Zn(t,n,e,i)}lf(n,e)}};$0=function(){return st};q0=function(n,e){var t=st;try{return st=n,e()}finally{st=t}};Zu=function(n,e,t){switch(e){case"input":if(Hu(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=nc(i);if(!r)throw Error(ae(90));C0(i),Hu(i,r)}}}break;case"textarea":R0(n,t);break;case"select":e=t.value,e!=null&&vs(n,!!t.multiple,e,!1)}};F0=nf;O0=Ir;var Wy={usingClientEntryPoint:!1,Events:[Jo,ls,nc,U0,z0,nf]},Qs={findFiberByHostInstance:wr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Xy={bundleType:Qs.bundleType,version:Qs.version,rendererPackageName:Qs.rendererPackageName,rendererConfig:Qs.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ci.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=H0(n),n===null?null:n.stateNode},findFiberByHostInstance:Qs.findFiberByHostInstance||Gy,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Sa=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Sa.isDisabled&&Sa.supportsFiber)try{Jl=Sa.inject(Xy),ii=Sa}catch{}}wn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Wy;wn.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!uf(e))throw Error(ae(200));return Hy(n,e,null,t)};wn.createRoot=function(n,e){if(!uf(n))throw Error(ae(299));var t=!1,i="",r=xv;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=af(n,1,!1,null,null,t,!1,i,r),n[wi]=e.current,Uo(n.nodeType===8?n.parentNode:n),new cf(e)};wn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(ae(188)):(n=Object.keys(n).join(","),Error(ae(268,n)));return n=H0(e),n=n===null?null:n.stateNode,n};wn.flushSync=function(n){return Ir(n)};wn.hydrate=function(n,e,t){if(!hc(e))throw Error(ae(200));return dc(null,n,e,!0,t)};wn.hydrateRoot=function(n,e,t){if(!uf(n))throw Error(ae(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",o=xv;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=_v(e,null,n,1,t??null,r,!1,s,o),n[wi]=e.current,Uo(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new uc(e)};wn.render=function(n,e,t){if(!hc(e))throw Error(ae(200));return dc(null,n,e,!1,t)};wn.unmountComponentAtNode=function(n){if(!hc(n))throw Error(ae(40));return n._reactRootContainer?(Ir(function(){dc(null,null,n,!1,function(){n._reactRootContainer=null,n[wi]=null})}),!0):!1};wn.unstable_batchedUpdates=nf;wn.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!hc(t))throw Error(ae(200));if(n==null||n._reactInternals===void 0)throw Error(ae(38));return dc(n,e,t,!1,i)};wn.version="18.3.1-next-f1338f8080-20240426";function yv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(yv)}catch(n){console.error(n)}}yv(),y0.exports=wn;var jy=y0.exports,Zp=jy;Iu.createRoot=Zp.createRoot,Iu.hydrateRoot=Zp.hydrateRoot;/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const hf="169",Yy=0,Kp=1,Zy=2,Sv=1,Mv=2,pi=3,ir=0,fn=1,ni=2,Qi=0,ws=1,$p=2,qp=3,Jp=4,Ky=5,Sr=100,$y=101,qy=102,Jy=103,Qy=104,eS=200,tS=201,nS=202,iS=203,bh=204,Ch=205,rS=206,sS=207,oS=208,aS=209,lS=210,cS=211,uS=212,hS=213,dS=214,Ph=0,Rh=1,Lh=2,Ds=3,Nh=4,Dh=5,Ih=6,Uh=7,wv=0,fS=1,pS=2,er=0,mS=1,gS=2,vS=3,Ev=4,_S=5,xS=6,yS=7,Tv=300,Is=301,Us=302,zh=303,Fh=304,fc=306,Ai=1e3,Ar=1001,Oh=1002,Ln=1003,SS=1004,Ma=1005,Vn=1006,Kc=1007,br=1008,bi=1009,Av=1010,bv=1011,Wo=1012,df=1013,Ur=1014,xi=1015,ea=1016,ff=1017,pf=1018,zs=1020,Cv=35902,Pv=1021,Rv=1022,jn=1023,Lv=1024,Nv=1025,Es=1026,Fs=1027,Dv=1028,mf=1029,Iv=1030,gf=1031,vf=1033,ul=33776,hl=33777,dl=33778,fl=33779,kh=35840,Bh=35841,Hh=35842,Gh=35843,Vh=36196,Wh=37492,Xh=37496,jh=37808,Yh=37809,Zh=37810,Kh=37811,$h=37812,qh=37813,Jh=37814,Qh=37815,ed=37816,td=37817,nd=37818,id=37819,rd=37820,sd=37821,pl=36492,od=36494,ad=36495,Uv=36283,ld=36284,cd=36285,ud=36286,MS=3200,wS=3201,zv=0,ES=1,Hi="",Et="srgb",lr="srgb-linear",_f="display-p3",pc="display-p3-linear",Hl="linear",ft="srgb",Gl="rec709",Vl="p3",Vr=7680,Qp=519,TS=512,AS=513,bS=514,Fv=515,CS=516,PS=517,RS=518,LS=519,em=35044,tm="300 es",yi=2e3,Wl=2001;class Gs{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const Xt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],$c=Math.PI/180,hd=180/Math.PI;function Vs(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Xt[n&255]+Xt[n>>8&255]+Xt[n>>16&255]+Xt[n>>24&255]+"-"+Xt[e&255]+Xt[e>>8&255]+"-"+Xt[e>>16&15|64]+Xt[e>>24&255]+"-"+Xt[t&63|128]+Xt[t>>8&255]+"-"+Xt[t>>16&255]+Xt[t>>24&255]+Xt[i&255]+Xt[i>>8&255]+Xt[i>>16&255]+Xt[i>>24&255]).toLowerCase()}function Kt(n,e,t){return Math.max(e,Math.min(t,n))}function NS(n,e){return(n%e+e)%e}function qc(n,e,t){return(1-t)*n+t*e}function eo(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function an(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class pe{constructor(e=0,t=0){pe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Kt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class je{constructor(e,t,i,r,s,o,a,l,c){je.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const h=this.elements;return h[0]=e,h[1]=r,h[2]=a,h[3]=t,h[4]=s,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],p=i[5],m=i[8],x=r[0],v=r[3],d=r[6],_=r[1],g=r[4],S=r[7],A=r[2],T=r[5],E=r[8];return s[0]=o*x+a*_+l*A,s[3]=o*v+a*g+l*T,s[6]=o*d+a*S+l*E,s[1]=c*x+h*_+u*A,s[4]=c*v+h*g+u*T,s[7]=c*d+h*S+u*E,s[2]=f*x+p*_+m*A,s[5]=f*v+p*g+m*T,s[8]=f*d+p*S+m*E,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8];return t*o*h-t*a*c-i*s*h+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=h*o-a*c,f=a*l-h*s,p=c*s-o*l,m=t*u+i*f+r*p;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/m;return e[0]=u*x,e[1]=(r*c-h*i)*x,e[2]=(a*i-r*o)*x,e[3]=f*x,e[4]=(h*t-r*l)*x,e[5]=(r*s-a*t)*x,e[6]=p*x,e[7]=(i*l-c*t)*x,e[8]=(o*t-i*s)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Jc.makeScale(e,t)),this}rotate(e){return this.premultiply(Jc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Jc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Jc=new je;function Ov(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Xl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function DS(){const n=Xl("canvas");return n.style.display="block",n}const nm={};function ml(n){n in nm||(nm[n]=!0,console.warn(n))}function IS(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function US(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function zS(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const im=new je().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),rm=new je().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),to={[lr]:{transfer:Hl,primaries:Gl,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[Et]:{transfer:ft,primaries:Gl,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[pc]:{transfer:Hl,primaries:Vl,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(rm),fromReference:n=>n.applyMatrix3(im)},[_f]:{transfer:ft,primaries:Vl,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(rm),fromReference:n=>n.applyMatrix3(im).convertLinearToSRGB()}},FS=new Set([lr,pc]),it={enabled:!0,_workingColorSpace:lr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!FS.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,e,t){if(this.enabled===!1||e===t||!e||!t)return n;const i=to[e].toReference,r=to[t].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,e){return this.convert(n,this._workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this._workingColorSpace)},getPrimaries:function(n){return to[n].primaries},getTransfer:function(n){return n===Hi?Hl:to[n].transfer},getLuminanceCoefficients:function(n,e=this._workingColorSpace){return n.fromArray(to[e].luminanceCoefficients)}};function Ts(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Qc(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Wr;class OS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Wr===void 0&&(Wr=Xl("canvas")),Wr.width=e.width,Wr.height=e.height;const i=Wr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Wr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Xl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ts(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ts(t[i]/255)*255):t[i]=Ts(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let kS=0;class kv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:kS++}),this.uuid=Vs(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(eu(r[o].image)):s.push(eu(r[o]))}else s=eu(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function eu(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?OS.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let BS=0;class tn extends Gs{constructor(e=tn.DEFAULT_IMAGE,t=tn.DEFAULT_MAPPING,i=Ar,r=Ar,s=Vn,o=br,a=jn,l=bi,c=tn.DEFAULT_ANISOTROPY,h=Hi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:BS++}),this.uuid=Vs(),this.name="",this.source=new kv(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new pe(0,0),this.repeat=new pe(1,1),this.center=new pe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new je,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Tv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ai:e.x=e.x-Math.floor(e.x);break;case Ar:e.x=e.x<0?0:1;break;case Oh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ai:e.y=e.y-Math.floor(e.y);break;case Ar:e.y=e.y<0?0:1;break;case Oh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}tn.DEFAULT_IMAGE=null;tn.DEFAULT_MAPPING=Tv;tn.DEFAULT_ANISOTROPY=1;class ot{constructor(e=0,t=0,i=0,r=1){ot.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],p=l[5],m=l[9],x=l[2],v=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-x)<.01&&Math.abs(m-v)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+x)<.1&&Math.abs(m+v)<.1&&Math.abs(c+p+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const g=(c+1)/2,S=(p+1)/2,A=(d+1)/2,T=(h+f)/4,E=(u+x)/4,C=(m+v)/4;return g>S&&g>A?g<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(g),r=T/i,s=E/i):S>A?S<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(S),i=T/r,s=C/r):A<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),i=E/s,r=C/s),this.set(i,r,s,t),this}let _=Math.sqrt((v-m)*(v-m)+(u-x)*(u-x)+(f-h)*(f-h));return Math.abs(_)<.001&&(_=1),this.x=(v-m)/_,this.y=(u-x)/_,this.z=(f-h)/_,this.w=Math.acos((c+p+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class HS extends Gs{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ot(0,0,e,t),this.scissorTest=!1,this.viewport=new ot(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new tn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new kv(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zr extends HS{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Bv extends tn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Ar,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class GS extends tn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Ln,this.minFilter=Ln,this.wrapR=Ar,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ta{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],h=i[r+2],u=i[r+3];const f=s[o+0],p=s[o+1],m=s[o+2],x=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=m,e[t+3]=x;return}if(u!==x||l!==f||c!==p||h!==m){let v=1-a;const d=l*f+c*p+h*m+u*x,_=d>=0?1:-1,g=1-d*d;if(g>Number.EPSILON){const A=Math.sqrt(g),T=Math.atan2(A,d*_);v=Math.sin(v*T)/A,a=Math.sin(a*T)/A}const S=a*_;if(l=l*v+f*S,c=c*v+p*S,h=h*v+m*S,u=u*v+x*S,v===1-a){const A=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=A,c*=A,h*=A,u*=A}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],h=i[r+3],u=s[o],f=s[o+1],p=s[o+2],m=s[o+3];return e[t]=a*m+h*u+l*p-c*f,e[t+1]=l*m+h*f+c*u-a*p,e[t+2]=c*m+h*p+a*f-l*u,e[t+3]=h*m-a*u-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(r/2),u=a(s/2),f=l(i/2),p=l(r/2),m=l(s/2);switch(o){case"XYZ":this._x=f*h*u+c*p*m,this._y=c*p*u-f*h*m,this._z=c*h*m+f*p*u,this._w=c*h*u-f*p*m;break;case"YXZ":this._x=f*h*u+c*p*m,this._y=c*p*u-f*h*m,this._z=c*h*m-f*p*u,this._w=c*h*u+f*p*m;break;case"ZXY":this._x=f*h*u-c*p*m,this._y=c*p*u+f*h*m,this._z=c*h*m+f*p*u,this._w=c*h*u-f*p*m;break;case"ZYX":this._x=f*h*u-c*p*m,this._y=c*p*u+f*h*m,this._z=c*h*m-f*p*u,this._w=c*h*u+f*p*m;break;case"YZX":this._x=f*h*u+c*p*m,this._y=c*p*u+f*h*m,this._z=c*h*m-f*p*u,this._w=c*h*u-f*p*m;break;case"XZY":this._x=f*h*u-c*p*m,this._y=c*p*u-f*h*m,this._z=c*h*m+f*p*u,this._w=c*h*u+f*p*m;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=i+a+u;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(h-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>u){const p=2*Math.sqrt(1+i-a-u);this._w=(h-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>u){const p=2*Math.sqrt(1+a-i-u);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+h)/p}else{const p=2*Math.sqrt(1+u-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Kt(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+o*a+r*c-s*l,this._y=r*h+o*l+s*a-i*c,this._z=s*h+o*c+i*l-r*a,this._w=o*h-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,a),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=o*u+this._w*f,this._x=i*u+this._x*f,this._y=r*u+this._y*f,this._z=s*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),h=2*(a*t-s*r),u=2*(s*i-o*t);return this.x=t+l*c+o*u-a*h,this.y=i+l*h+a*c-s*u,this.z=r+l*u+s*h-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return tu.copy(this).projectOnVector(e),this.sub(tu)}reflect(e){return this.sub(tu.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Kt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const tu=new D,sm=new ta;class na{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Fn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Fn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Fn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Fn):Fn.fromBufferAttribute(s,o),Fn.applyMatrix4(e.matrixWorld),this.expandByPoint(Fn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wa.copy(i.boundingBox)),wa.applyMatrix4(e.matrixWorld),this.union(wa)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Fn),Fn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(no),Ea.subVectors(this.max,no),Xr.subVectors(e.a,no),jr.subVectors(e.b,no),Yr.subVectors(e.c,no),Li.subVectors(jr,Xr),Ni.subVectors(Yr,jr),ur.subVectors(Xr,Yr);let t=[0,-Li.z,Li.y,0,-Ni.z,Ni.y,0,-ur.z,ur.y,Li.z,0,-Li.x,Ni.z,0,-Ni.x,ur.z,0,-ur.x,-Li.y,Li.x,0,-Ni.y,Ni.x,0,-ur.y,ur.x,0];return!nu(t,Xr,jr,Yr,Ea)||(t=[1,0,0,0,1,0,0,0,1],!nu(t,Xr,jr,Yr,Ea))?!1:(Ta.crossVectors(Li,Ni),t=[Ta.x,Ta.y,Ta.z],nu(t,Xr,jr,Yr,Ea))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Fn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Fn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ci),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ci=[new D,new D,new D,new D,new D,new D,new D,new D],Fn=new D,wa=new na,Xr=new D,jr=new D,Yr=new D,Li=new D,Ni=new D,ur=new D,no=new D,Ea=new D,Ta=new D,hr=new D;function nu(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){hr.fromArray(n,s);const a=r.x*Math.abs(hr.x)+r.y*Math.abs(hr.y)+r.z*Math.abs(hr.z),l=e.dot(hr),c=t.dot(hr),h=i.dot(hr);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}const VS=new na,io=new D,iu=new D;class mc{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):VS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;io.subVectors(e,this.center);const t=io.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(io,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(iu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(io.copy(e.center).add(iu)),this.expandByPoint(io.copy(e.center).sub(iu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ui=new D,ru=new D,Aa=new D,Di=new D,su=new D,ba=new D,ou=new D;class Hv{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ui)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ui.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ui.copy(this.origin).addScaledVector(this.direction,t),ui.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){ru.copy(e).add(t).multiplyScalar(.5),Aa.copy(t).sub(e).normalize(),Di.copy(this.origin).sub(ru);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Aa),a=Di.dot(this.direction),l=-Di.dot(Aa),c=Di.lengthSq(),h=Math.abs(1-o*o);let u,f,p,m;if(h>0)if(u=o*l-a,f=o*a-l,m=s*h,u>=0)if(f>=-m)if(f<=m){const x=1/h;u*=x,f*=x,p=u*(u+o*f+2*a)+f*(o*u+f+2*l)+c}else f=s,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;else f=-s,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;else f<=-m?(u=Math.max(0,-(-o*s+a)),f=u>0?-s:Math.min(Math.max(-s,-l),s),p=-u*u+f*(f+2*l)+c):f<=m?(u=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(u=Math.max(0,-(o*s+a)),f=u>0?s:Math.min(Math.max(-s,-l),s),p=-u*u+f*(f+2*l)+c);else f=o>0?-s:s,u=Math.max(0,-(o*f+a)),p=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(ru).addScaledVector(Aa,f),p}intersectSphere(e,t){ui.subVectors(e.center,this.origin);const i=ui.dot(this.direction),r=ui.dot(ui)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),h>=0?(s=(e.min.y-f.y)*h,o=(e.max.y-f.y)*h):(s=(e.max.y-f.y)*h,o=(e.min.y-f.y)*h),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(a=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,ui)!==null}intersectTriangle(e,t,i,r,s){su.subVectors(t,e),ba.subVectors(i,e),ou.crossVectors(su,ba);let o=this.direction.dot(ou),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Di.subVectors(this.origin,e);const l=a*this.direction.dot(ba.crossVectors(Di,ba));if(l<0)return null;const c=a*this.direction.dot(su.cross(Di));if(c<0||l+c>o)return null;const h=-a*Di.dot(ou);return h<0?null:this.at(h/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class mt{constructor(e,t,i,r,s,o,a,l,c,h,u,f,p,m,x,v){mt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,h,u,f,p,m,x,v)}set(e,t,i,r,s,o,a,l,c,h,u,f,p,m,x,v){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=r,d[1]=s,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=p,d[7]=m,d[11]=x,d[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new mt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/Zr.setFromMatrixColumn(e,0).length(),s=1/Zr.setFromMatrixColumn(e,1).length(),o=1/Zr.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(e.order==="XYZ"){const f=o*h,p=o*u,m=a*h,x=a*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=p+m*c,t[5]=f-x*c,t[9]=-a*l,t[2]=x-f*c,t[6]=m+p*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*h,p=l*u,m=c*h,x=c*u;t[0]=f+x*a,t[4]=m*a-p,t[8]=o*c,t[1]=o*u,t[5]=o*h,t[9]=-a,t[2]=p*a-m,t[6]=x+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*h,p=l*u,m=c*h,x=c*u;t[0]=f-x*a,t[4]=-o*u,t[8]=m+p*a,t[1]=p+m*a,t[5]=o*h,t[9]=x-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*h,p=o*u,m=a*h,x=a*u;t[0]=l*h,t[4]=m*c-p,t[8]=f*c+x,t[1]=l*u,t[5]=x*c+f,t[9]=p*c-m,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,p=o*c,m=a*l,x=a*c;t[0]=l*h,t[4]=x-f*u,t[8]=m*u+p,t[1]=u,t[5]=o*h,t[9]=-a*h,t[2]=-c*h,t[6]=p*u+m,t[10]=f-x*u}else if(e.order==="XZY"){const f=o*l,p=o*c,m=a*l,x=a*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+x,t[5]=o*h,t[9]=p*u-m,t[2]=m*u-p,t[6]=a*h,t[10]=x*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(WS,e,XS)}lookAt(e,t,i){const r=this.elements;return gn.subVectors(e,t),gn.lengthSq()===0&&(gn.z=1),gn.normalize(),Ii.crossVectors(i,gn),Ii.lengthSq()===0&&(Math.abs(i.z)===1?gn.x+=1e-4:gn.z+=1e-4,gn.normalize(),Ii.crossVectors(i,gn)),Ii.normalize(),Ca.crossVectors(gn,Ii),r[0]=Ii.x,r[4]=Ca.x,r[8]=gn.x,r[1]=Ii.y,r[5]=Ca.y,r[9]=gn.y,r[2]=Ii.z,r[6]=Ca.z,r[10]=gn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],p=i[13],m=i[2],x=i[6],v=i[10],d=i[14],_=i[3],g=i[7],S=i[11],A=i[15],T=r[0],E=r[4],C=r[8],z=r[12],y=r[1],w=r[5],O=r[9],G=r[13],Y=r[2],j=r[6],k=r[10],K=r[14],N=r[3],$=r[7],J=r[11],Z=r[15];return s[0]=o*T+a*y+l*Y+c*N,s[4]=o*E+a*w+l*j+c*$,s[8]=o*C+a*O+l*k+c*J,s[12]=o*z+a*G+l*K+c*Z,s[1]=h*T+u*y+f*Y+p*N,s[5]=h*E+u*w+f*j+p*$,s[9]=h*C+u*O+f*k+p*J,s[13]=h*z+u*G+f*K+p*Z,s[2]=m*T+x*y+v*Y+d*N,s[6]=m*E+x*w+v*j+d*$,s[10]=m*C+x*O+v*k+d*J,s[14]=m*z+x*G+v*K+d*Z,s[3]=_*T+g*y+S*Y+A*N,s[7]=_*E+g*w+S*j+A*$,s[11]=_*C+g*O+S*k+A*J,s[15]=_*z+g*G+S*K+A*Z,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],p=e[14],m=e[3],x=e[7],v=e[11],d=e[15];return m*(+s*l*u-r*c*u-s*a*f+i*c*f+r*a*p-i*l*p)+x*(+t*l*p-t*c*f+s*o*f-r*o*p+r*c*h-s*l*h)+v*(+t*c*u-t*a*p-s*o*u+i*o*p+s*a*h-i*c*h)+d*(-r*a*h-t*l*u+t*a*f+r*o*u-i*o*f+i*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],p=e[11],m=e[12],x=e[13],v=e[14],d=e[15],_=u*v*c-x*f*c+x*l*p-a*v*p-u*l*d+a*f*d,g=m*f*c-h*v*c-m*l*p+o*v*p+h*l*d-o*f*d,S=h*x*c-m*u*c+m*a*p-o*x*p-h*a*d+o*u*d,A=m*u*l-h*x*l-m*a*f+o*x*f+h*a*v-o*u*v,T=t*_+i*g+r*S+s*A;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const E=1/T;return e[0]=_*E,e[1]=(x*f*s-u*v*s-x*r*p+i*v*p+u*r*d-i*f*d)*E,e[2]=(a*v*s-x*l*s+x*r*c-i*v*c-a*r*d+i*l*d)*E,e[3]=(u*l*s-a*f*s-u*r*c+i*f*c+a*r*p-i*l*p)*E,e[4]=g*E,e[5]=(h*v*s-m*f*s+m*r*p-t*v*p-h*r*d+t*f*d)*E,e[6]=(m*l*s-o*v*s-m*r*c+t*v*c+o*r*d-t*l*d)*E,e[7]=(o*f*s-h*l*s+h*r*c-t*f*c-o*r*p+t*l*p)*E,e[8]=S*E,e[9]=(m*u*s-h*x*s-m*i*p+t*x*p+h*i*d-t*u*d)*E,e[10]=(o*x*s-m*a*s+m*i*c-t*x*c-o*i*d+t*a*d)*E,e[11]=(h*a*s-o*u*s-h*i*c+t*u*c+o*i*p-t*a*p)*E,e[12]=A*E,e[13]=(h*x*r-m*u*r+m*i*f-t*x*f-h*i*v+t*u*v)*E,e[14]=(m*a*r-o*x*r-m*i*l+t*x*l+o*i*v-t*a*v)*E,e[15]=(o*u*r-h*a*r+h*i*l-t*u*l-o*i*f+t*a*f)*E,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,h=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,h*a+i,h*l-r*o,0,c*l-r*a,h*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,h=o+o,u=a+a,f=s*c,p=s*h,m=s*u,x=o*h,v=o*u,d=a*u,_=l*c,g=l*h,S=l*u,A=i.x,T=i.y,E=i.z;return r[0]=(1-(x+d))*A,r[1]=(p+S)*A,r[2]=(m-g)*A,r[3]=0,r[4]=(p-S)*T,r[5]=(1-(f+d))*T,r[6]=(v+_)*T,r[7]=0,r[8]=(m+g)*E,r[9]=(v-_)*E,r[10]=(1-(f+x))*E,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=Zr.set(r[0],r[1],r[2]).length();const o=Zr.set(r[4],r[5],r[6]).length(),a=Zr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],On.copy(this);const c=1/s,h=1/o,u=1/a;return On.elements[0]*=c,On.elements[1]*=c,On.elements[2]*=c,On.elements[4]*=h,On.elements[5]*=h,On.elements[6]*=h,On.elements[8]*=u,On.elements[9]*=u,On.elements[10]*=u,t.setFromRotationMatrix(On),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=yi){const l=this.elements,c=2*s/(t-e),h=2*s/(i-r),u=(t+e)/(t-e),f=(i+r)/(i-r);let p,m;if(a===yi)p=-(o+s)/(o-s),m=-2*o*s/(o-s);else if(a===Wl)p=-o/(o-s),m=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=u,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=m,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=yi){const l=this.elements,c=1/(t-e),h=1/(i-r),u=1/(o-s),f=(t+e)*c,p=(i+r)*h;let m,x;if(a===yi)m=(o+s)*u,x=-2*u;else if(a===Wl)m=s*u,x=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*h,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=x,l[14]=-m,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Zr=new D,On=new mt,WS=new D(0,0,0),XS=new D(1,1,1),Ii=new D,Ca=new D,gn=new D,om=new mt,am=new ta;class oi{constructor(e=0,t=0,i=0,r=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],h=r[9],u=r[2],f=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(Kt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Kt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(Kt(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Kt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Kt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Kt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return om.makeRotationFromQuaternion(e),this.setFromRotationMatrix(om,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return am.setFromEuler(this),this.setFromQuaternion(am,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class Gv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let jS=0;const lm=new D,Kr=new ta,hi=new mt,Pa=new D,ro=new D,YS=new D,ZS=new ta,cm=new D(1,0,0),um=new D(0,1,0),hm=new D(0,0,1),dm={type:"added"},KS={type:"removed"},$r={type:"childadded",child:null},au={type:"childremoved",child:null};class Ot extends Gs{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jS++}),this.uuid=Vs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ot.DEFAULT_UP.clone();const e=new D,t=new oi,i=new ta,r=new D(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new mt},normalMatrix:{value:new je}}),this.matrix=new mt,this.matrixWorld=new mt,this.matrixAutoUpdate=Ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Gv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Kr.setFromAxisAngle(e,t),this.quaternion.multiply(Kr),this}rotateOnWorldAxis(e,t){return Kr.setFromAxisAngle(e,t),this.quaternion.premultiply(Kr),this}rotateX(e){return this.rotateOnAxis(cm,e)}rotateY(e){return this.rotateOnAxis(um,e)}rotateZ(e){return this.rotateOnAxis(hm,e)}translateOnAxis(e,t){return lm.copy(e).applyQuaternion(this.quaternion),this.position.add(lm.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(cm,e)}translateY(e){return this.translateOnAxis(um,e)}translateZ(e){return this.translateOnAxis(hm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Pa.copy(e):Pa.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ro.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(ro,Pa,this.up):hi.lookAt(Pa,ro,this.up),this.quaternion.setFromRotationMatrix(hi),r&&(hi.extractRotation(r.matrixWorld),Kr.setFromRotationMatrix(hi),this.quaternion.premultiply(Kr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dm),$r.child=e,this.dispatchEvent($r),$r.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(KS),au.child=e,this.dispatchEvent(au),au.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hi.multiply(e.parent.matrixWorld)),e.applyMatrix4(hi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dm),$r.child=e,this.dispatchEvent($r),$r.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ro,e,YS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ro,ZS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];s(e.shapes,u)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),h=o(e.images),u=o(e.shapes),f=o(e.skeletons),p=o(e.animations),m=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),m.length>0&&(i.nodes=m)}return i.object=r,i;function o(a){const l=[];for(const c in a){const h=a[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Ot.DEFAULT_UP=new D(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const kn=new D,di=new D,lu=new D,fi=new D,qr=new D,Jr=new D,fm=new D,cu=new D,uu=new D,hu=new D,du=new ot,fu=new ot,pu=new ot;class Wn{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),kn.subVectors(e,t),r.cross(kn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){kn.subVectors(r,t),di.subVectors(i,t),lu.subVectors(e,t);const o=kn.dot(kn),a=kn.dot(di),l=kn.dot(lu),c=di.dot(di),h=di.dot(lu),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;const f=1/u,p=(c*l-a*h)*f,m=(o*h-a*l)*f;return s.set(1-p-m,m,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,fi)===null?!1:fi.x>=0&&fi.y>=0&&fi.x+fi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,fi.x),l.addScaledVector(o,fi.y),l.addScaledVector(a,fi.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return du.setScalar(0),fu.setScalar(0),pu.setScalar(0),du.fromBufferAttribute(e,t),fu.fromBufferAttribute(e,i),pu.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(du,s.x),o.addScaledVector(fu,s.y),o.addScaledVector(pu,s.z),o}static isFrontFacing(e,t,i,r){return kn.subVectors(i,t),di.subVectors(e,t),kn.cross(di).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return kn.subVectors(this.c,this.b),di.subVectors(this.a,this.b),kn.cross(di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Wn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Wn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Wn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Wn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Wn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;qr.subVectors(r,i),Jr.subVectors(s,i),cu.subVectors(e,i);const l=qr.dot(cu),c=Jr.dot(cu);if(l<=0&&c<=0)return t.copy(i);uu.subVectors(e,r);const h=qr.dot(uu),u=Jr.dot(uu);if(h>=0&&u<=h)return t.copy(r);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return o=l/(l-h),t.copy(i).addScaledVector(qr,o);hu.subVectors(e,s);const p=qr.dot(hu),m=Jr.dot(hu);if(m>=0&&p<=m)return t.copy(s);const x=p*c-l*m;if(x<=0&&c>=0&&m<=0)return a=c/(c-m),t.copy(i).addScaledVector(Jr,a);const v=h*m-p*u;if(v<=0&&u-h>=0&&p-m>=0)return fm.subVectors(s,r),a=(u-h)/(u-h+(p-m)),t.copy(r).addScaledVector(fm,a);const d=1/(v+x+f);return o=x*d,a=f*d,t.copy(i).addScaledVector(qr,o).addScaledVector(Jr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Vv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ui={h:0,s:0,l:0},Ra={h:0,s:0,l:0};function mu(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Ze{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Et){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,it.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=it.workingColorSpace){return this.r=e,this.g=t,this.b=i,it.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=it.workingColorSpace){if(e=NS(e,1),t=Kt(t,0,1),i=Kt(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=mu(o,s,e+1/3),this.g=mu(o,s,e),this.b=mu(o,s,e-1/3)}return it.toWorkingColorSpace(this,r),this}setStyle(e,t=Et){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Et){const i=Vv[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ts(e.r),this.g=Ts(e.g),this.b=Ts(e.b),this}copyLinearToSRGB(e){return this.r=Qc(e.r),this.g=Qc(e.g),this.b=Qc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Et){return it.fromWorkingColorSpace(jt.copy(this),e),Math.round(Kt(jt.r*255,0,255))*65536+Math.round(Kt(jt.g*255,0,255))*256+Math.round(Kt(jt.b*255,0,255))}getHexString(e=Et){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=it.workingColorSpace){it.fromWorkingColorSpace(jt.copy(this),t);const i=jt.r,r=jt.g,s=jt.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const h=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=h<=.5?u/(o+a):u/(2-o-a),o){case i:l=(r-s)/u+(r<s?6:0);break;case r:l=(s-i)/u+2;break;case s:l=(i-r)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=it.workingColorSpace){return it.fromWorkingColorSpace(jt.copy(this),t),e.r=jt.r,e.g=jt.g,e.b=jt.b,e}getStyle(e=Et){it.fromWorkingColorSpace(jt.copy(this),e);const t=jt.r,i=jt.g,r=jt.b;return e!==Et?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Ui),this.setHSL(Ui.h+e,Ui.s+t,Ui.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Ui),e.getHSL(Ra);const i=qc(Ui.h,Ra.h,t),r=qc(Ui.s,Ra.s,t),s=qc(Ui.l,Ra.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const jt=new Ze;Ze.NAMES=Vv;let $S=0;class Ws extends Gs{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:$S++}),this.uuid=Vs(),this.name="",this.type="Material",this.blending=ws,this.side=ir,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=bh,this.blendDst=Ch,this.blendEquation=Sr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ze(0,0,0),this.blendAlpha=0,this.depthFunc=Ds,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Qp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vr,this.stencilZFail=Vr,this.stencilZPass=Vr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ws&&(i.blending=this.blending),this.side!==ir&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==bh&&(i.blendSrc=this.blendSrc),this.blendDst!==Ch&&(i.blendDst=this.blendDst),this.blendEquation!==Sr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ds&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Qp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Vr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Vr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Vr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Rt extends Ws{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ze(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=wv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const bt=new D,La=new pe;class si{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=em,this.updateRanges=[],this.gpuType=xi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)La.fromBufferAttribute(this,t),La.applyMatrix3(e),this.setXY(t,La.x,La.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix3(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyMatrix4(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.applyNormalMatrix(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)bt.fromBufferAttribute(this,t),bt.transformDirection(e),this.setXYZ(t,bt.x,bt.y,bt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=eo(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=an(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=eo(t,this.array)),t}setX(e,t){return this.normalized&&(t=an(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=eo(t,this.array)),t}setY(e,t){return this.normalized&&(t=an(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=eo(t,this.array)),t}setZ(e,t){return this.normalized&&(t=an(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=eo(t,this.array)),t}setW(e,t){return this.normalized&&(t=an(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=an(t,this.array),i=an(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=an(t,this.array),i=an(i,this.array),r=an(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=an(t,this.array),i=an(i,this.array),r=an(r,this.array),s=an(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==em&&(e.usage=this.usage),e}}class Wv extends si{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Xv extends si{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class at extends si{constructor(e,t,i){super(new Float32Array(e),t,i)}}let qS=0;const An=new mt,gu=new Ot,Qr=new D,vn=new na,so=new na,It=new D;class qt extends Gs{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:qS++}),this.uuid=Vs(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Ov(e)?Xv:Wv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new je().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,i){return An.makeTranslation(e,t,i),this.applyMatrix4(An),this}scale(e,t,i){return An.makeScale(e,t,i),this.applyMatrix4(An),this}lookAt(e){return gu.lookAt(e),gu.updateMatrix(),this.applyMatrix4(gu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qr).negate(),this.translate(Qr.x,Qr.y,Qr.z),this}setFromPoints(e){const t=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];t.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new at(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new na);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];vn.setFromBufferAttribute(s),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new mc);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(vn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];so.setFromBufferAttribute(a),this.morphTargetsRelative?(It.addVectors(vn.min,so.min),vn.expandByPoint(It),It.addVectors(vn.max,so.max),vn.expandByPoint(It)):(vn.expandByPoint(so.min),vn.expandByPoint(so.max))}vn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)It.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(It));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)It.fromBufferAttribute(a,c),l&&(Qr.fromBufferAttribute(e,c),It.add(Qr)),r=Math.max(r,i.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new si(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<i.count;C++)a[C]=new D,l[C]=new D;const c=new D,h=new D,u=new D,f=new pe,p=new pe,m=new pe,x=new D,v=new D;function d(C,z,y){c.fromBufferAttribute(i,C),h.fromBufferAttribute(i,z),u.fromBufferAttribute(i,y),f.fromBufferAttribute(s,C),p.fromBufferAttribute(s,z),m.fromBufferAttribute(s,y),h.sub(c),u.sub(c),p.sub(f),m.sub(f);const w=1/(p.x*m.y-m.x*p.y);isFinite(w)&&(x.copy(h).multiplyScalar(m.y).addScaledVector(u,-p.y).multiplyScalar(w),v.copy(u).multiplyScalar(p.x).addScaledVector(h,-m.x).multiplyScalar(w),a[C].add(x),a[z].add(x),a[y].add(x),l[C].add(v),l[z].add(v),l[y].add(v))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let C=0,z=_.length;C<z;++C){const y=_[C],w=y.start,O=y.count;for(let G=w,Y=w+O;G<Y;G+=3)d(e.getX(G+0),e.getX(G+1),e.getX(G+2))}const g=new D,S=new D,A=new D,T=new D;function E(C){A.fromBufferAttribute(r,C),T.copy(A);const z=a[C];g.copy(z),g.sub(A.multiplyScalar(A.dot(z))).normalize(),S.crossVectors(T,z);const w=S.dot(l[C])<0?-1:1;o.setXYZW(C,g.x,g.y,g.z,w)}for(let C=0,z=_.length;C<z;++C){const y=_[C],w=y.start,O=y.count;for(let G=w,Y=w+O;G<Y;G+=3)E(e.getX(G+0)),E(e.getX(G+1)),E(e.getX(G+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new si(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new D,s=new D,o=new D,a=new D,l=new D,c=new D,h=new D,u=new D;if(e)for(let f=0,p=e.count;f<p;f+=3){const m=e.getX(f+0),x=e.getX(f+1),v=e.getX(f+2);r.fromBufferAttribute(t,m),s.fromBufferAttribute(t,x),o.fromBufferAttribute(t,v),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(i,m),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,v),a.add(h),l.add(h),c.add(h),i.setXYZ(m,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(v,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)It.fromBufferAttribute(e,t),It.normalize(),e.setXYZ(t,It.x,It.y,It.z)}toNonIndexed(){function e(a,l){const c=a.array,h=a.itemSize,u=a.normalized,f=new c.constructor(l.length*h);let p=0,m=0;for(let x=0,v=l.length;x<v;x++){a.isInterleavedBufferAttribute?p=l[x]*a.data.stride+a.offset:p=l[x]*h;for(let d=0;d<h;d++)f[m++]=c[p++]}return new si(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new qt,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let h=0,u=c.length;h<u;h++){const f=c[h],p=e(f,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const p=c[u];h.push(p.toJSON(e.data))}h.length>0&&(r[l]=h,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const h=r[c];this.setAttribute(c,h.clone(t))}const s=e.morphAttributes;for(const c in s){const h=[],u=s[c];for(let f=0,p=u.length;f<p;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,h=o.length;c<h;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pm=new mt,dr=new Hv,Na=new mc,mm=new D,Da=new D,Ia=new D,Ua=new D,vu=new D,za=new D,gm=new D,Fa=new D;class We extends Ot{constructor(e=new qt,t=new Rt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){za.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const h=a[l],u=s[l];h!==0&&(vu.fromBufferAttribute(u,e),o?za.addScaledVector(vu,h):za.addScaledVector(vu.sub(t),h))}t.add(za)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Na.copy(i.boundingSphere),Na.applyMatrix4(s),dr.copy(e.ray).recast(e.near),!(Na.containsPoint(dr.origin)===!1&&(dr.intersectSphere(Na,mm)===null||dr.origin.distanceToSquared(mm)>(e.far-e.near)**2))&&(pm.copy(s).invert(),dr.copy(e.ray).applyMatrix4(pm),!(i.boundingBox!==null&&dr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,dr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,f=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=f.length;m<x;m++){const v=f[m],d=o[v.materialIndex],_=Math.max(v.start,p.start),g=Math.min(a.count,Math.min(v.start+v.count,p.start+p.count));for(let S=_,A=g;S<A;S+=3){const T=a.getX(S),E=a.getX(S+1),C=a.getX(S+2);r=Oa(this,d,e,i,c,h,u,T,E,C),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=v.materialIndex,t.push(r))}}else{const m=Math.max(0,p.start),x=Math.min(a.count,p.start+p.count);for(let v=m,d=x;v<d;v+=3){const _=a.getX(v),g=a.getX(v+1),S=a.getX(v+2);r=Oa(this,o,e,i,c,h,u,_,g,S),r&&(r.faceIndex=Math.floor(v/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,x=f.length;m<x;m++){const v=f[m],d=o[v.materialIndex],_=Math.max(v.start,p.start),g=Math.min(l.count,Math.min(v.start+v.count,p.start+p.count));for(let S=_,A=g;S<A;S+=3){const T=S,E=S+1,C=S+2;r=Oa(this,d,e,i,c,h,u,T,E,C),r&&(r.faceIndex=Math.floor(S/3),r.face.materialIndex=v.materialIndex,t.push(r))}}else{const m=Math.max(0,p.start),x=Math.min(l.count,p.start+p.count);for(let v=m,d=x;v<d;v+=3){const _=v,g=v+1,S=v+2;r=Oa(this,o,e,i,c,h,u,_,g,S),r&&(r.faceIndex=Math.floor(v/3),t.push(r))}}}}function JS(n,e,t,i,r,s,o,a){let l;if(e.side===fn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===ir,a),l===null)return null;Fa.copy(a),Fa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Fa);return c<t.near||c>t.far?null:{distance:c,point:Fa.clone(),object:n}}function Oa(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Da),n.getVertexPosition(l,Ia),n.getVertexPosition(c,Ua);const h=JS(n,e,t,i,Da,Ia,Ua,gm);if(h){const u=new D;Wn.getBarycoord(gm,Da,Ia,Ua,u),r&&(h.uv=Wn.getInterpolatedAttribute(r,a,l,c,u,new pe)),s&&(h.uv1=Wn.getInterpolatedAttribute(s,a,l,c,u,new pe)),o&&(h.normal=Wn.getInterpolatedAttribute(o,a,l,c,u,new D),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new D,materialIndex:0};Wn.getNormal(Da,Ia,Ua,f.normal),h.face=f,h.barycoord=u}return h}class Pe extends qt{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],h=[],u=[];let f=0,p=0;m("z","y","x",-1,-1,i,t,e,o,s,0),m("z","y","x",1,-1,i,t,-e,o,s,1),m("x","z","y",1,1,e,i,t,r,o,2),m("x","z","y",1,-1,e,i,-t,r,o,3),m("x","y","z",1,-1,e,t,i,r,s,4),m("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new at(c,3)),this.setAttribute("normal",new at(h,3)),this.setAttribute("uv",new at(u,2));function m(x,v,d,_,g,S,A,T,E,C,z){const y=S/E,w=A/C,O=S/2,G=A/2,Y=T/2,j=E+1,k=C+1;let K=0,N=0;const $=new D;for(let J=0;J<k;J++){const Z=J*w-G;for(let me=0;me<j;me++){const Ae=me*y-O;$[x]=Ae*_,$[v]=Z*g,$[d]=Y,c.push($.x,$.y,$.z),$[x]=0,$[v]=0,$[d]=T>0?1:-1,h.push($.x,$.y,$.z),u.push(me/E),u.push(1-J/C),K+=1}}for(let J=0;J<C;J++)for(let Z=0;Z<E;Z++){const me=f+Z+j*J,Ae=f+Z+j*(J+1),W=f+(Z+1)+j*(J+1),ne=f+(Z+1)+j*J;l.push(me,Ae,ne),l.push(Ae,W,ne),N+=6}a.addGroup(p,N,z),p+=N,f+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pe(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Os(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function Jt(n){const e={};for(let t=0;t<n.length;t++){const i=Os(n[t]);for(const r in i)e[r]=i[r]}return e}function QS(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function jv(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:it.workingColorSpace}const e1={clone:Os,merge:Jt};var t1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,n1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class rr extends Ws{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=t1,this.fragmentShader=n1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=QS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Yv extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new mt,this.projectionMatrix=new mt,this.projectionMatrixInverse=new mt,this.coordinateSystem=yi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const zi=new D,vm=new pe,_m=new pe;class xn extends Yv{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=hd*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan($c*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return hd*2*Math.atan(Math.tan($c*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){zi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(zi.x,zi.y).multiplyScalar(-e/zi.z),zi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(zi.x,zi.y).multiplyScalar(-e/zi.z)}getViewSize(e,t){return this.getViewBounds(e,vm,_m),t.subVectors(_m,vm)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan($c*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const es=-90,ts=1;class i1 extends Ot{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new xn(es,ts,e,t);r.layers=this.layers,this.add(r);const s=new xn(es,ts,e,t);s.layers=this.layers,this.add(s);const o=new xn(es,ts,e,t);o.layers=this.layers,this.add(o);const a=new xn(es,ts,e,t);a.layers=this.layers,this.add(a);const l=new xn(es,ts,e,t);l.layers=this.layers,this.add(l);const c=new xn(es,ts,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===yi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Wl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),m=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(t,h),e.setRenderTarget(u,f,p),e.xr.enabled=m,i.texture.needsPMREMUpdate=!0}}class Zv extends tn{constructor(e,t,i,r,s,o,a,l,c,h){e=e!==void 0?e:[],t=t!==void 0?t:Is,super(e,t,i,r,s,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class r1 extends zr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Zv(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Vn}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Pe(5,5,5),s=new rr({name:"CubemapFromEquirect",uniforms:Os(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:fn,blending:Qi});s.uniforms.tEquirect.value=t;const o=new We(r,s),a=t.minFilter;return t.minFilter===br&&(t.minFilter=Vn),new i1(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const _u=new D,s1=new D,o1=new je;class xr{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=_u.subVectors(i,t).cross(s1.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(_u),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||o1.getNormalMatrix(e),r=this.coplanarPoint(_u).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const fr=new mc,ka=new D;class xf{constructor(e=new xr,t=new xr,i=new xr,r=new xr,s=new xr,o=new xr){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=yi){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],h=r[5],u=r[6],f=r[7],p=r[8],m=r[9],x=r[10],v=r[11],d=r[12],_=r[13],g=r[14],S=r[15];if(i[0].setComponents(l-s,f-c,v-p,S-d).normalize(),i[1].setComponents(l+s,f+c,v+p,S+d).normalize(),i[2].setComponents(l+o,f+h,v+m,S+_).normalize(),i[3].setComponents(l-o,f-h,v-m,S-_).normalize(),i[4].setComponents(l-a,f-u,v-x,S-g).normalize(),t===yi)i[5].setComponents(l+a,f+u,v+x,S+g).normalize();else if(t===Wl)i[5].setComponents(a,u,x,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),fr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),fr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(fr)}intersectsSprite(e){return fr.center.set(0,0,0),fr.radius=.7071067811865476,fr.applyMatrix4(e.matrixWorld),this.intersectsSphere(fr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(ka.x=r.normal.x>0?e.max.x:e.min.x,ka.y=r.normal.y>0?e.max.y:e.min.y,ka.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(ka)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Kv(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function a1(n){const e=new WeakMap;function t(a,l){const c=a.array,h=a.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function i(a,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,a),u.length===0)n.bufferSubData(c,0,h);else{u.sort((p,m)=>p.start-m.start);let f=0;for(let p=1;p<u.length;p++){const m=u[f],x=u[p];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++f,u[f]=x)}u.length=f+1;for(let p=0,m=u.length;p<m;p++){const x=u[p];n.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class Wi extends qt{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,h=l+1,u=e/a,f=t/l,p=[],m=[],x=[],v=[];for(let d=0;d<h;d++){const _=d*f-o;for(let g=0;g<c;g++){const S=g*u-s;m.push(S,-_,0),x.push(0,0,1),v.push(g/a),v.push(1-d/l)}}for(let d=0;d<l;d++)for(let _=0;_<a;_++){const g=_+c*d,S=_+c*(d+1),A=_+1+c*(d+1),T=_+1+c*d;p.push(g,S,T),p.push(S,A,T)}this.setIndex(p),this.setAttribute("position",new at(m,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wi(e.width,e.height,e.widthSegments,e.heightSegments)}}var l1=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,c1=`#ifdef USE_ALPHAHASH
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
#endif`,u1=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,h1=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,d1=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,f1=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,p1=`#ifdef USE_AOMAP
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
#endif`,m1=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,g1=`#ifdef USE_BATCHING
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
#endif`,v1=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_1=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,x1=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,y1=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,S1=`#ifdef USE_IRIDESCENCE
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
#endif`,M1=`#ifdef USE_BUMPMAP
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
#endif`,w1=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,E1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,T1=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,A1=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,b1=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,C1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,P1=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,R1=`#if defined( USE_COLOR_ALPHA )
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
#endif`,L1=`#define PI 3.141592653589793
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
} // validated`,N1=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,D1=`vec3 transformedNormal = objectNormal;
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
#endif`,I1=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,U1=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,z1=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,F1=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,O1="gl_FragColor = linearToOutputTexel( gl_FragColor );",k1=`
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
}`,B1=`#ifdef USE_ENVMAP
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
#endif`,H1=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,G1=`#ifdef USE_ENVMAP
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
#endif`,V1=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,W1=`#ifdef USE_ENVMAP
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
#endif`,X1=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,j1=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Y1=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Z1=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,K1=`#ifdef USE_GRADIENTMAP
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
}`,$1=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,q1=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,J1=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Q1=`uniform bool receiveShadow;
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
#endif`,eM=`#ifdef USE_ENVMAP
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
#endif`,tM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,nM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,iM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,rM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sM=`PhysicalMaterial material;
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
#endif`,oM=`struct PhysicalMaterial {
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
#endif`,lM=`#if defined( RE_IndirectDiffuse )
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
#endif`,cM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,uM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,vM=`#if defined( USE_POINTS_UV )
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
#endif`,xM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,SM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,MM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wM=`#ifdef USE_MORPHTARGETS
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
#endif`,EM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,TM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,AM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,bM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,CM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,PM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,RM=`#ifdef USE_NORMALMAP
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
#endif`,LM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,NM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,DM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,IM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,UM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,zM=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,FM=`#ifdef PREMULTIPLIED_ALPHA
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
#endif`,BM=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,HM=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,GM=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,VM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,WM=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,XM=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,jM=`float getShadowMask() {
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
}`,YM=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ZM=`#ifdef USE_SKINNING
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
#endif`,KM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$M=`#ifdef USE_SKINNING
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
#endif`,qM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,JM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,QM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,ew=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,tw=`#ifdef USE_TRANSMISSION
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
#endif`,nw=`#ifdef USE_TRANSMISSION
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
#endif`,iw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sw=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ow=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const aw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lw=`uniform sampler2D t2D;
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
}`,cw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,hw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fw=`#include <common>
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
}`,pw=`#if DEPTH_PACKING == 3200
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
}`,mw=`#define DISTANCE
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
}`,gw=`#define DISTANCE
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
}`,vw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_w=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xw=`uniform float scale;
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
}`,yw=`uniform vec3 diffuse;
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
}`,Sw=`#include <common>
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
}`,Mw=`uniform vec3 diffuse;
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
}`,ww=`#define LAMBERT
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
}`,Ew=`#define LAMBERT
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
}`,Tw=`#define MATCAP
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
}`,Aw=`#define MATCAP
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
}`,bw=`#define NORMAL
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
}`,Cw=`#define NORMAL
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
}`,Pw=`#define PHONG
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
}`,Rw=`#define PHONG
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
}`,Lw=`#define STANDARD
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
}`,Nw=`#define STANDARD
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
}`,Dw=`#define TOON
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
}`,Iw=`#define TOON
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
}`,Uw=`uniform float size;
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
}`,zw=`uniform vec3 diffuse;
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
}`,Fw=`#include <common>
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
}`,Ow=`uniform vec3 color;
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
}`,kw=`uniform float rotation;
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
}`,Bw=`uniform vec3 diffuse;
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
}`,Xe={alphahash_fragment:l1,alphahash_pars_fragment:c1,alphamap_fragment:u1,alphamap_pars_fragment:h1,alphatest_fragment:d1,alphatest_pars_fragment:f1,aomap_fragment:p1,aomap_pars_fragment:m1,batching_pars_vertex:g1,batching_vertex:v1,begin_vertex:_1,beginnormal_vertex:x1,bsdfs:y1,iridescence_fragment:S1,bumpmap_pars_fragment:M1,clipping_planes_fragment:w1,clipping_planes_pars_fragment:E1,clipping_planes_pars_vertex:T1,clipping_planes_vertex:A1,color_fragment:b1,color_pars_fragment:C1,color_pars_vertex:P1,color_vertex:R1,common:L1,cube_uv_reflection_fragment:N1,defaultnormal_vertex:D1,displacementmap_pars_vertex:I1,displacementmap_vertex:U1,emissivemap_fragment:z1,emissivemap_pars_fragment:F1,colorspace_fragment:O1,colorspace_pars_fragment:k1,envmap_fragment:B1,envmap_common_pars_fragment:H1,envmap_pars_fragment:G1,envmap_pars_vertex:V1,envmap_physical_pars_fragment:eM,envmap_vertex:W1,fog_vertex:X1,fog_pars_vertex:j1,fog_fragment:Y1,fog_pars_fragment:Z1,gradientmap_pars_fragment:K1,lightmap_pars_fragment:$1,lights_lambert_fragment:q1,lights_lambert_pars_fragment:J1,lights_pars_begin:Q1,lights_toon_fragment:tM,lights_toon_pars_fragment:nM,lights_phong_fragment:iM,lights_phong_pars_fragment:rM,lights_physical_fragment:sM,lights_physical_pars_fragment:oM,lights_fragment_begin:aM,lights_fragment_maps:lM,lights_fragment_end:cM,logdepthbuf_fragment:uM,logdepthbuf_pars_fragment:hM,logdepthbuf_pars_vertex:dM,logdepthbuf_vertex:fM,map_fragment:pM,map_pars_fragment:mM,map_particle_fragment:gM,map_particle_pars_fragment:vM,metalnessmap_fragment:_M,metalnessmap_pars_fragment:xM,morphinstance_vertex:yM,morphcolor_vertex:SM,morphnormal_vertex:MM,morphtarget_pars_vertex:wM,morphtarget_vertex:EM,normal_fragment_begin:TM,normal_fragment_maps:AM,normal_pars_fragment:bM,normal_pars_vertex:CM,normal_vertex:PM,normalmap_pars_fragment:RM,clearcoat_normal_fragment_begin:LM,clearcoat_normal_fragment_maps:NM,clearcoat_pars_fragment:DM,iridescence_pars_fragment:IM,opaque_fragment:UM,packing:zM,premultiplied_alpha_fragment:FM,project_vertex:OM,dithering_fragment:kM,dithering_pars_fragment:BM,roughnessmap_fragment:HM,roughnessmap_pars_fragment:GM,shadowmap_pars_fragment:VM,shadowmap_pars_vertex:WM,shadowmap_vertex:XM,shadowmask_pars_fragment:jM,skinbase_vertex:YM,skinning_pars_vertex:ZM,skinning_vertex:KM,skinnormal_vertex:$M,specularmap_fragment:qM,specularmap_pars_fragment:JM,tonemapping_fragment:QM,tonemapping_pars_fragment:ew,transmission_fragment:tw,transmission_pars_fragment:nw,uv_pars_fragment:iw,uv_pars_vertex:rw,uv_vertex:sw,worldpos_vertex:ow,background_vert:aw,background_frag:lw,backgroundCube_vert:cw,backgroundCube_frag:uw,cube_vert:hw,cube_frag:dw,depth_vert:fw,depth_frag:pw,distanceRGBA_vert:mw,distanceRGBA_frag:gw,equirect_vert:vw,equirect_frag:_w,linedashed_vert:xw,linedashed_frag:yw,meshbasic_vert:Sw,meshbasic_frag:Mw,meshlambert_vert:ww,meshlambert_frag:Ew,meshmatcap_vert:Tw,meshmatcap_frag:Aw,meshnormal_vert:bw,meshnormal_frag:Cw,meshphong_vert:Pw,meshphong_frag:Rw,meshphysical_vert:Lw,meshphysical_frag:Nw,meshtoon_vert:Dw,meshtoon_frag:Iw,points_vert:Uw,points_frag:zw,shadow_vert:Fw,shadow_frag:Ow,sprite_vert:kw,sprite_frag:Bw},ve={common:{diffuse:{value:new Ze(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new je}},envmap:{envMap:{value:null},envMapRotation:{value:new je},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new je}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new je}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new je},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new je},normalScale:{value:new pe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new je},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new je}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new je}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new je}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ze(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Ze(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0},uvTransform:{value:new je}},sprite:{diffuse:{value:new Ze(16777215)},opacity:{value:1},center:{value:new pe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new je},alphaMap:{value:null},alphaMapTransform:{value:new je},alphaTest:{value:0}}},ei={basic:{uniforms:Jt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:Jt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:Jt([ve.common,ve.specularmap,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)},specular:{value:new Ze(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:Jt([ve.common,ve.envmap,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.roughnessmap,ve.metalnessmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:Jt([ve.common,ve.aomap,ve.lightmap,ve.emissivemap,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.gradientmap,ve.fog,ve.lights,{emissive:{value:new Ze(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:Jt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,ve.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:Jt([ve.points,ve.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:Jt([ve.common,ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:Jt([ve.common,ve.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:Jt([ve.common,ve.bumpmap,ve.normalmap,ve.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:Jt([ve.sprite,ve.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new je},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new je}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:Jt([ve.common,ve.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:Jt([ve.lights,ve.fog,{color:{value:new Ze(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};ei.physical={uniforms:Jt([ei.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new je},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new je},clearcoatNormalScale:{value:new pe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new je},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new je},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new je},sheen:{value:0},sheenColor:{value:new Ze(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new je},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new je},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new je},transmissionSamplerSize:{value:new pe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new je},attenuationDistance:{value:0},attenuationColor:{value:new Ze(0)},specularColor:{value:new Ze(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new je},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new je},anisotropyVector:{value:new pe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new je}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};const Ba={r:0,b:0,g:0},pr=new oi,Hw=new mt;function Gw(n,e,t,i,r,s,o){const a=new Ze(0);let l=s===!0?0:1,c,h,u=null,f=0,p=null;function m(_){let g=_.isScene===!0?_.background:null;return g&&g.isTexture&&(g=(_.backgroundBlurriness>0?t:e).get(g)),g}function x(_){let g=!1;const S=m(_);S===null?d(a,l):S&&S.isColor&&(d(S,1),g=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,o):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||g)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function v(_,g){const S=m(g);S&&(S.isCubeTexture||S.mapping===fc)?(h===void 0&&(h=new We(new Pe(1,1,1),new rr({name:"BackgroundCubeMaterial",uniforms:Os(ei.backgroundCube.uniforms),vertexShader:ei.backgroundCube.vertexShader,fragmentShader:ei.backgroundCube.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(A,T,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),pr.copy(g.backgroundRotation),pr.x*=-1,pr.y*=-1,pr.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(pr.y*=-1,pr.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Hw.makeRotationFromEuler(pr)),h.material.toneMapped=it.getTransfer(S.colorSpace)!==ft,(u!==S||f!==S.version||p!==n.toneMapping)&&(h.material.needsUpdate=!0,u=S,f=S.version,p=n.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new We(new Wi(2,2),new rr({name:"BackgroundMaterial",uniforms:Os(ei.background.uniforms),vertexShader:ei.background.vertexShader,fragmentShader:ei.background.fragmentShader,side:ir,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.toneMapped=it.getTransfer(S.colorSpace)!==ft,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||f!==S.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,u=S,f=S.version,p=n.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null))}function d(_,g){_.getRGB(Ba,jv(n)),i.buffers.color.setClear(Ba.r,Ba.g,Ba.b,g,o)}return{getClearColor:function(){return a},setClearColor:function(_,g=1){a.set(_),l=g,d(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,d(a,l)},render:x,addToRenderList:v}}function Vw(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(y,w,O,G,Y){let j=!1;const k=u(G,O,w);s!==k&&(s=k,c(s.object)),j=p(y,G,O,Y),j&&m(y,G,O,Y),Y!==null&&e.update(Y,n.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,S(y,w,O,G),Y!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return n.createVertexArray()}function c(y){return n.bindVertexArray(y)}function h(y){return n.deleteVertexArray(y)}function u(y,w,O){const G=O.wireframe===!0;let Y=i[y.id];Y===void 0&&(Y={},i[y.id]=Y);let j=Y[w.id];j===void 0&&(j={},Y[w.id]=j);let k=j[G];return k===void 0&&(k=f(l()),j[G]=k),k}function f(y){const w=[],O=[],G=[];for(let Y=0;Y<t;Y++)w[Y]=0,O[Y]=0,G[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:w,enabledAttributes:O,attributeDivisors:G,object:y,attributes:{},index:null}}function p(y,w,O,G){const Y=s.attributes,j=w.attributes;let k=0;const K=O.getAttributes();for(const N in K)if(K[N].location>=0){const J=Y[N];let Z=j[N];if(Z===void 0&&(N==="instanceMatrix"&&y.instanceMatrix&&(Z=y.instanceMatrix),N==="instanceColor"&&y.instanceColor&&(Z=y.instanceColor)),J===void 0||J.attribute!==Z||Z&&J.data!==Z.data)return!0;k++}return s.attributesNum!==k||s.index!==G}function m(y,w,O,G){const Y={},j=w.attributes;let k=0;const K=O.getAttributes();for(const N in K)if(K[N].location>=0){let J=j[N];J===void 0&&(N==="instanceMatrix"&&y.instanceMatrix&&(J=y.instanceMatrix),N==="instanceColor"&&y.instanceColor&&(J=y.instanceColor));const Z={};Z.attribute=J,J&&J.data&&(Z.data=J.data),Y[N]=Z,k++}s.attributes=Y,s.attributesNum=k,s.index=G}function x(){const y=s.newAttributes;for(let w=0,O=y.length;w<O;w++)y[w]=0}function v(y){d(y,0)}function d(y,w){const O=s.newAttributes,G=s.enabledAttributes,Y=s.attributeDivisors;O[y]=1,G[y]===0&&(n.enableVertexAttribArray(y),G[y]=1),Y[y]!==w&&(n.vertexAttribDivisor(y,w),Y[y]=w)}function _(){const y=s.newAttributes,w=s.enabledAttributes;for(let O=0,G=w.length;O<G;O++)w[O]!==y[O]&&(n.disableVertexAttribArray(O),w[O]=0)}function g(y,w,O,G,Y,j,k){k===!0?n.vertexAttribIPointer(y,w,O,Y,j):n.vertexAttribPointer(y,w,O,G,Y,j)}function S(y,w,O,G){x();const Y=G.attributes,j=O.getAttributes(),k=w.defaultAttributeValues;for(const K in j){const N=j[K];if(N.location>=0){let $=Y[K];if($===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&($=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&($=y.instanceColor)),$!==void 0){const J=$.normalized,Z=$.itemSize,me=e.get($);if(me===void 0)continue;const Ae=me.buffer,W=me.type,ne=me.bytesPerElement,le=W===n.INT||W===n.UNSIGNED_INT||$.gpuType===df;if($.isInterleavedBufferAttribute){const se=$.data,be=se.stride,Le=$.offset;if(se.isInstancedInterleavedBuffer){for(let Fe=0;Fe<N.locationSize;Fe++)d(N.location+Fe,se.meshPerAttribute);y.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=se.meshPerAttribute*se.count)}else for(let Fe=0;Fe<N.locationSize;Fe++)v(N.location+Fe);n.bindBuffer(n.ARRAY_BUFFER,Ae);for(let Fe=0;Fe<N.locationSize;Fe++)g(N.location+Fe,Z/N.locationSize,W,J,be*ne,(Le+Z/N.locationSize*Fe)*ne,le)}else{if($.isInstancedBufferAttribute){for(let se=0;se<N.locationSize;se++)d(N.location+se,$.meshPerAttribute);y.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let se=0;se<N.locationSize;se++)v(N.location+se);n.bindBuffer(n.ARRAY_BUFFER,Ae);for(let se=0;se<N.locationSize;se++)g(N.location+se,Z/N.locationSize,W,J,Z*ne,Z/N.locationSize*se*ne,le)}}else if(k!==void 0){const J=k[K];if(J!==void 0)switch(J.length){case 2:n.vertexAttrib2fv(N.location,J);break;case 3:n.vertexAttrib3fv(N.location,J);break;case 4:n.vertexAttrib4fv(N.location,J);break;default:n.vertexAttrib1fv(N.location,J)}}}}_()}function A(){C();for(const y in i){const w=i[y];for(const O in w){const G=w[O];for(const Y in G)h(G[Y].object),delete G[Y];delete w[O]}delete i[y]}}function T(y){if(i[y.id]===void 0)return;const w=i[y.id];for(const O in w){const G=w[O];for(const Y in G)h(G[Y].object),delete G[Y];delete w[O]}delete i[y.id]}function E(y){for(const w in i){const O=i[w];if(O[y.id]===void 0)continue;const G=O[y.id];for(const Y in G)h(G[Y].object),delete G[Y];delete O[y.id]}}function C(){z(),o=!0,s!==r&&(s=r,c(s.object))}function z(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:C,resetDefaultState:z,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:v,disableUnusedAttributes:_}}function Ww(n,e,t){let i;function r(c){i=c}function s(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function o(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function a(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let p=0;for(let m=0;m<u;m++)p+=h[m];t.update(p,i,1)}function l(c,h,u,f){if(u===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<c.length;m++)o(c[m],h[m],f[m]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let m=0;for(let x=0;x<u;x++)m+=h[x];for(let x=0;x<f.length;x++)t.update(m,i,f[x])}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function Xw(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const E=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(E){return!(E!==jn&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){const C=E===ea&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==bi&&i.convert(E)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&E!==xi&&!C)}function l(E){if(E==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(f===!0){const E=e.get("EXT_clip_control");E.clipControlEXT(E.LOWER_LEFT_EXT,E.ZERO_TO_ONE_EXT)}const p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),v=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),_=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),g=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=m>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:v,maxAttributes:d,maxVertexUniforms:_,maxVaryings:g,maxFragmentUniforms:S,vertexTextures:A,maxSamples:T}}function jw(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new xr,a=new je,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const p=u.length!==0||f||i!==0||r;return r=f,i=u.length,p},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,p){const m=u.clippingPlanes,x=u.clipIntersection,v=u.clipShadows,d=n.get(u);if(!r||m===null||m.length===0||s&&!v)s?h(null):c();else{const _=s?0:i,g=_*4;let S=d.clippingState||null;l.value=S,S=h(m,f,g,p);for(let A=0;A!==g;++A)S[A]=t[A];d.clippingState=S,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,f,p,m){const x=u!==null?u.length:0;let v=null;if(x!==0){if(v=l.value,m!==!0||v===null){const d=p+x*4,_=f.matrixWorldInverse;a.getNormalMatrix(_),(v===null||v.length<d)&&(v=new Float32Array(d));for(let g=0,S=p;g!==x;++g,S+=4)o.copy(u[g]).applyMatrix4(_,a),o.normal.toArray(v,S),v[S+3]=o.constant}l.value=v,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,v}}function Yw(n){let e=new WeakMap;function t(o,a){return a===zh?o.mapping=Is:a===Fh&&(o.mapping=Us),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===zh||a===Fh)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new r1(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class $v extends Yv{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const ms=4,xm=[.125,.215,.35,.446,.526,.582],Mr=20,xu=new $v,ym=new Ze;let yu=null,Su=0,Mu=0,wu=!1;const yr=(1+Math.sqrt(5))/2,ns=1/yr,Sm=[new D(-yr,ns,0),new D(yr,ns,0),new D(-ns,0,yr),new D(ns,0,yr),new D(0,yr,-ns),new D(0,yr,ns),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)];class Mm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){yu=this._renderer.getRenderTarget(),Su=this._renderer.getActiveCubeFace(),Mu=this._renderer.getActiveMipmapLevel(),wu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Em(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(yu,Su,Mu),this._renderer.xr.enabled=wu,e.scissorTest=!1,Ha(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Is||e.mapping===Us?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),yu=this._renderer.getRenderTarget(),Su=this._renderer.getActiveCubeFace(),Mu=this._renderer.getActiveMipmapLevel(),wu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Vn,minFilter:Vn,generateMipmaps:!1,type:ea,format:jn,colorSpace:lr,depthBuffer:!1},r=wm(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wm(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Zw(s)),this._blurMaterial=Kw(s,e,t)}return r}_compileMaterial(e){const t=new We(this._lodPlanes[0],e);this._renderer.compile(t,xu)}_sceneToCubeUV(e,t,i,r){const a=new xn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,f=h.toneMapping;h.getClearColor(ym),h.toneMapping=er,h.autoClear=!1;const p=new Rt({name:"PMREM.Background",side:fn,depthWrite:!1,depthTest:!1}),m=new We(new Pe,p);let x=!1;const v=e.background;v?v.isColor&&(p.color.copy(v),e.background=null,x=!0):(p.color.copy(ym),x=!0);for(let d=0;d<6;d++){const _=d%3;_===0?(a.up.set(0,l[d],0),a.lookAt(c[d],0,0)):_===1?(a.up.set(0,0,l[d]),a.lookAt(0,c[d],0)):(a.up.set(0,l[d],0),a.lookAt(0,0,c[d]));const g=this._cubeSize;Ha(r,_*g,d>2?g:0,g,g),h.setRenderTarget(r),x&&h.render(m,a),h.render(e,a)}m.geometry.dispose(),m.material.dispose(),h.toneMapping=f,h.autoClear=u,e.background=v}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Is||e.mapping===Us;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Em());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new We(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Ha(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,xu)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=Sm[(r-s-1)%Sm.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new We(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,m=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*Mr-1),x=s/m,v=isFinite(s)?1+Math.floor(h*x):Mr;v>Mr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${v} samples when the maximum is set to ${Mr}`);const d=[];let _=0;for(let E=0;E<Mr;++E){const C=E/x,z=Math.exp(-C*C/2);d.push(z),E===0?_+=z:E<v&&(_+=2*z)}for(let E=0;E<d.length;E++)d[E]=d[E]/_;f.envMap.value=e.texture,f.samples.value=v,f.weights.value=d,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:g}=this;f.dTheta.value=m,f.mipInt.value=g-i;const S=this._sizeLods[r],A=3*S*(r>g-ms?r-g+ms:0),T=4*(this._cubeSize-S);Ha(t,A,T,3*S,2*S),l.setRenderTarget(t),l.render(u,xu)}}function Zw(n){const e=[],t=[],i=[];let r=n;const s=n-ms+1+xm.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-ms?l=xm[o-n+ms-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,m=6,x=3,v=2,d=1,_=new Float32Array(x*m*p),g=new Float32Array(v*m*p),S=new Float32Array(d*m*p);for(let T=0;T<p;T++){const E=T%3*2/3-1,C=T>2?0:-1,z=[E,C,0,E+2/3,C,0,E+2/3,C+1,0,E,C,0,E+2/3,C+1,0,E,C+1,0];_.set(z,x*m*T),g.set(f,v*m*T);const y=[T,T,T,T,T,T];S.set(y,d*m*T)}const A=new qt;A.setAttribute("position",new si(_,x)),A.setAttribute("uv",new si(g,v)),A.setAttribute("faceIndex",new si(S,d)),e.push(A),r>ms&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function wm(n,e,t){const i=new zr(n,e,t);return i.texture.mapping=fc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ha(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function Kw(n,e,t){const i=new Float32Array(Mr),r=new D(0,1,0);return new rr({name:"SphericalGaussianBlur",defines:{n:Mr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:yf(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Em(){return new rr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yf(),fragmentShader:`

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
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function Tm(){return new rr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Qi,depthTest:!1,depthWrite:!1})}function yf(){return`

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
	`}function $w(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===zh||l===Fh,h=l===Is||l===Us;if(c||h){let u=e.get(a);const f=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Mm(n)),u=c?t.fromEquirectangular(a,u):t.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return c&&p&&p.height>0||h&&p&&r(p)?(t===null&&(t=new Mm(n)),u=c?t.fromEquirectangular(a):t.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,e.set(a,u),a.addEventListener("dispose",s),u.texture):null}}}return a}function r(a){let l=0;const c=6;for(let h=0;h<c;h++)a[h]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function qw(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&ml("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Jw(n,e,t,i){const r={},s=new WeakMap;function o(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const m in f.attributes)e.remove(f.attributes[m]);for(const m in f.morphAttributes){const x=f.morphAttributes[m];for(let v=0,d=x.length;v<d;v++)e.remove(x[v])}f.removeEventListener("dispose",o),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(u,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const m in f)e.update(f[m],n.ARRAY_BUFFER);const p=u.morphAttributes;for(const m in p){const x=p[m];for(let v=0,d=x.length;v<d;v++)e.update(x[v],n.ARRAY_BUFFER)}}function c(u){const f=[],p=u.index,m=u.attributes.position;let x=0;if(p!==null){const _=p.array;x=p.version;for(let g=0,S=_.length;g<S;g+=3){const A=_[g+0],T=_[g+1],E=_[g+2];f.push(A,T,T,E,E,A)}}else if(m!==void 0){const _=m.array;x=m.version;for(let g=0,S=_.length/3-1;g<S;g+=3){const A=g+0,T=g+1,E=g+2;f.push(A,T,T,E,E,A)}}else return;const v=new(Ov(f)?Xv:Wv)(f,1);v.version=x;const d=s.get(u);d&&e.remove(d),s.set(u,v)}function h(u){const f=s.get(u);if(f){const p=u.index;p!==null&&f.version<p.version&&c(u)}else c(u);return s.get(u)}return{get:a,update:l,getWireframeAttribute:h}}function Qw(n,e,t){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,p){n.drawElements(i,p,s,f*o),t.update(p,i,1)}function c(f,p,m){m!==0&&(n.drawElementsInstanced(i,p,s,f*o,m),t.update(p,i,m))}function h(f,p,m){if(m===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,m);let v=0;for(let d=0;d<m;d++)v+=p[d];t.update(v,i,1)}function u(f,p,m,x){if(m===0)return;const v=e.get("WEBGL_multi_draw");if(v===null)for(let d=0;d<f.length;d++)c(f[d]/o,p[d],x[d]);else{v.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,x,0,m);let d=0;for(let _=0;_<m;_++)d+=p[_];for(let _=0;_<x.length;_++)t.update(d,i,x[_])}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function e2(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function t2(n,e,t){const i=new WeakMap,r=new ot;function s(o,a,l){const c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(a);if(f===void 0||f.count!==u){let y=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",y)};var p=y;f!==void 0&&f.texture.dispose();const m=a.morphAttributes.position!==void 0,x=a.morphAttributes.normal!==void 0,v=a.morphAttributes.color!==void 0,d=a.morphAttributes.position||[],_=a.morphAttributes.normal||[],g=a.morphAttributes.color||[];let S=0;m===!0&&(S=1),x===!0&&(S=2),v===!0&&(S=3);let A=a.attributes.position.count*S,T=1;A>e.maxTextureSize&&(T=Math.ceil(A/e.maxTextureSize),A=e.maxTextureSize);const E=new Float32Array(A*T*4*u),C=new Bv(E,A,T,u);C.type=xi,C.needsUpdate=!0;const z=S*4;for(let w=0;w<u;w++){const O=d[w],G=_[w],Y=g[w],j=A*T*4*w;for(let k=0;k<O.count;k++){const K=k*z;m===!0&&(r.fromBufferAttribute(O,k),E[j+K+0]=r.x,E[j+K+1]=r.y,E[j+K+2]=r.z,E[j+K+3]=0),x===!0&&(r.fromBufferAttribute(G,k),E[j+K+4]=r.x,E[j+K+5]=r.y,E[j+K+6]=r.z,E[j+K+7]=0),v===!0&&(r.fromBufferAttribute(Y,k),E[j+K+8]=r.x,E[j+K+9]=r.y,E[j+K+10]=r.z,E[j+K+11]=Y.itemSize===4?r.w:1)}}f={count:u,texture:C,size:new pe(A,T)},i.set(a,f),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let m=0;for(let v=0;v<c.length;v++)m+=c[v];const x=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function n2(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,h=l.geometry,u=e.get(l,h);if(r.get(u)!==c&&(e.update(u),r.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return u}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class qv extends tn{constructor(e,t,i,r,s,o,a,l,c,h=Es){if(h!==Es&&h!==Fs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&h===Es&&(i=Ur),i===void 0&&h===Fs&&(i=zs),super(null,r,s,o,a,l,h,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Ln,this.minFilter=l!==void 0?l:Ln,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Jv=new tn,Am=new qv(1,1),Qv=new Bv,e_=new GS,t_=new Zv,bm=[],Cm=[],Pm=new Float32Array(16),Rm=new Float32Array(9),Lm=new Float32Array(4);function Xs(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=bm[r];if(s===void 0&&(s=new Float32Array(r),bm[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Nt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Dt(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function gc(n,e){let t=Cm[e];t===void 0&&(t=new Int32Array(e),Cm[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function i2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function r2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2fv(this.addr,e),Dt(t,e)}}function s2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;n.uniform3fv(this.addr,e),Dt(t,e)}}function o2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4fv(this.addr,e),Dt(t,e)}}function a2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Dt(t,e)}else{if(Nt(t,i))return;Lm.set(i),n.uniformMatrix2fv(this.addr,!1,Lm),Dt(t,i)}}function l2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Dt(t,e)}else{if(Nt(t,i))return;Rm.set(i),n.uniformMatrix3fv(this.addr,!1,Rm),Dt(t,i)}}function c2(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Dt(t,e)}else{if(Nt(t,i))return;Pm.set(i),n.uniformMatrix4fv(this.addr,!1,Pm),Dt(t,i)}}function u2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function h2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2iv(this.addr,e),Dt(t,e)}}function d2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;n.uniform3iv(this.addr,e),Dt(t,e)}}function f2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4iv(this.addr,e),Dt(t,e)}}function p2(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function m2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2uiv(this.addr,e),Dt(t,e)}}function g2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;n.uniform3uiv(this.addr,e),Dt(t,e)}}function v2(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4uiv(this.addr,e),Dt(t,e)}}function _2(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Am.compareFunction=Fv,s=Am):s=Jv,t.setTexture2D(e||s,r)}function x2(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||e_,r)}function y2(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||t_,r)}function S2(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Qv,r)}function M2(n){switch(n){case 5126:return i2;case 35664:return r2;case 35665:return s2;case 35666:return o2;case 35674:return a2;case 35675:return l2;case 35676:return c2;case 5124:case 35670:return u2;case 35667:case 35671:return h2;case 35668:case 35672:return d2;case 35669:case 35673:return f2;case 5125:return p2;case 36294:return m2;case 36295:return g2;case 36296:return v2;case 35678:case 36198:case 36298:case 36306:case 35682:return _2;case 35679:case 36299:case 36307:return x2;case 35680:case 36300:case 36308:case 36293:return y2;case 36289:case 36303:case 36311:case 36292:return S2}}function w2(n,e){n.uniform1fv(this.addr,e)}function E2(n,e){const t=Xs(e,this.size,2);n.uniform2fv(this.addr,t)}function T2(n,e){const t=Xs(e,this.size,3);n.uniform3fv(this.addr,t)}function A2(n,e){const t=Xs(e,this.size,4);n.uniform4fv(this.addr,t)}function b2(n,e){const t=Xs(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function C2(n,e){const t=Xs(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function P2(n,e){const t=Xs(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function R2(n,e){n.uniform1iv(this.addr,e)}function L2(n,e){n.uniform2iv(this.addr,e)}function N2(n,e){n.uniform3iv(this.addr,e)}function D2(n,e){n.uniform4iv(this.addr,e)}function I2(n,e){n.uniform1uiv(this.addr,e)}function U2(n,e){n.uniform2uiv(this.addr,e)}function z2(n,e){n.uniform3uiv(this.addr,e)}function F2(n,e){n.uniform4uiv(this.addr,e)}function O2(n,e,t){const i=this.cache,r=e.length,s=gc(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Dt(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||Jv,s[o])}function k2(n,e,t){const i=this.cache,r=e.length,s=gc(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Dt(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||e_,s[o])}function B2(n,e,t){const i=this.cache,r=e.length,s=gc(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Dt(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||t_,s[o])}function H2(n,e,t){const i=this.cache,r=e.length,s=gc(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Dt(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Qv,s[o])}function G2(n){switch(n){case 5126:return w2;case 35664:return E2;case 35665:return T2;case 35666:return A2;case 35674:return b2;case 35675:return C2;case 35676:return P2;case 5124:case 35670:return R2;case 35667:case 35671:return L2;case 35668:case 35672:return N2;case 35669:case 35673:return D2;case 5125:return I2;case 36294:return U2;case 36295:return z2;case 36296:return F2;case 35678:case 36198:case 36298:case 36306:case 35682:return O2;case 35679:case 36299:case 36307:return k2;case 35680:case 36300:case 36308:case 36293:return B2;case 36289:case 36303:case 36311:case 36292:return H2}}class V2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=M2(t.type)}}class W2{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=G2(t.type)}}class X2{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const Eu=/(\w+)(\])?(\[|\.)?/g;function Nm(n,e){n.seq.push(e),n.map[e.id]=e}function j2(n,e,t){const i=n.name,r=i.length;for(Eu.lastIndex=0;;){const s=Eu.exec(i),o=Eu.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Nm(t,c===void 0?new V2(a,n,e):new W2(a,n,e));break}else{let u=t.map[a];u===void 0&&(u=new X2(a),Nm(t,u)),t=u}}}class gl{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);j2(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function Dm(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Y2=37297;let Z2=0;function K2(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}function $2(n){const e=it.getPrimaries(it.workingColorSpace),t=it.getPrimaries(n);let i;switch(e===t?i="":e===Vl&&t===Gl?i="LinearDisplayP3ToLinearSRGB":e===Gl&&t===Vl&&(i="LinearSRGBToLinearDisplayP3"),n){case lr:case pc:return[i,"LinearTransferOETF"];case Et:case _f:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Im(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+K2(n.getShaderSource(e),o)}else return r}function q2(n,e){const t=$2(e);return`vec4 ${n}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function J2(n,e){let t;switch(e){case mS:t="Linear";break;case gS:t="Reinhard";break;case vS:t="Cineon";break;case Ev:t="ACESFilmic";break;case xS:t="AgX";break;case yS:t="Neutral";break;case _S:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Ga=new D;function Q2(){it.getLuminanceCoefficients(Ga);const n=Ga.x.toFixed(4),e=Ga.y.toFixed(4),t=Ga.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function eE(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fo).join(`
`)}function tE(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function nE(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function fo(n){return n!==""}function Um(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function zm(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const iE=/^[ \t]*#include +<([\w\d./]+)>/gm;function dd(n){return n.replace(iE,sE)}const rE=new Map;function sE(n,e){let t=Xe[e];if(t===void 0){const i=rE.get(e);if(i!==void 0)t=Xe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return dd(t)}const oE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fm(n){return n.replace(oE,aE)}function aE(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Om(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function lE(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Sv?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Mv?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===pi&&(e="SHADOWMAP_TYPE_VSM"),e}function cE(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Is:case Us:e="ENVMAP_TYPE_CUBE";break;case fc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function uE(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Us:e="ENVMAP_MODE_REFRACTION";break}return e}function hE(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case wv:e="ENVMAP_BLENDING_MULTIPLY";break;case fS:e="ENVMAP_BLENDING_MIX";break;case pS:e="ENVMAP_BLENDING_ADD";break}return e}function dE(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function fE(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=lE(t),c=cE(t),h=uE(t),u=hE(t),f=dE(t),p=eE(t),m=tE(s),x=r.createProgram();let v,d,_=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(v=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(fo).join(`
`),v.length>0&&(v+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m].filter(fo).join(`
`),d.length>0&&(d+=`
`)):(v=[Om(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fo).join(`
`),d=[Om(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,m,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==er?"#define TONE_MAPPING":"",t.toneMapping!==er?Xe.tonemapping_pars_fragment:"",t.toneMapping!==er?J2("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,q2("linearToOutputTexel",t.outputColorSpace),Q2(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fo).join(`
`)),o=dd(o),o=Um(o,t),o=zm(o,t),a=dd(a),a=Um(a,t),a=zm(a,t),o=Fm(o),a=Fm(a),t.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,v=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,d=["#define varying in",t.glslVersion===tm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===tm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const g=_+v+o,S=_+d+a,A=Dm(r,r.VERTEX_SHADER,g),T=Dm(r,r.FRAGMENT_SHADER,S);r.attachShader(x,A),r.attachShader(x,T),t.index0AttributeName!==void 0?r.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function E(w){if(n.debug.checkShaderErrors){const O=r.getProgramInfoLog(x).trim(),G=r.getShaderInfoLog(A).trim(),Y=r.getShaderInfoLog(T).trim();let j=!0,k=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(j=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,x,A,T);else{const K=Im(r,A,"vertex"),N=Im(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+w.name+`
Material Type: `+w.type+`

Program Info Log: `+O+`
`+K+`
`+N)}else O!==""?console.warn("THREE.WebGLProgram: Program Info Log:",O):(G===""||Y==="")&&(k=!1);k&&(w.diagnostics={runnable:j,programLog:O,vertexShader:{log:G,prefix:v},fragmentShader:{log:Y,prefix:d}})}r.deleteShader(A),r.deleteShader(T),C=new gl(r,x),z=nE(r,x)}let C;this.getUniforms=function(){return C===void 0&&E(this),C};let z;this.getAttributes=function(){return z===void 0&&E(this),z};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=r.getProgramParameter(x,Y2)),y},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Z2++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=A,this.fragmentShader=T,this}let pE=0;class mE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new gE(e),t.set(e,i)),i}}class gE{constructor(e){this.id=pE++,this.code=e,this.usedTimes=0}}function vE(n,e,t,i,r,s,o){const a=new Gv,l=new mE,c=new Set,h=[],u=r.logarithmicDepthBuffer,f=r.reverseDepthBuffer,p=r.vertexTextures;let m=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return c.add(y),y===0?"uv":`uv${y}`}function d(y,w,O,G,Y){const j=G.fog,k=Y.geometry,K=y.isMeshStandardMaterial?G.environment:null,N=(y.isMeshStandardMaterial?t:e).get(y.envMap||K),$=N&&N.mapping===fc?N.image.height:null,J=x[y.type];y.precision!==null&&(m=r.getMaxPrecision(y.precision),m!==y.precision&&console.warn("THREE.WebGLProgram.getParameters:",y.precision,"not supported, using",m,"instead."));const Z=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,me=Z!==void 0?Z.length:0;let Ae=0;k.morphAttributes.position!==void 0&&(Ae=1),k.morphAttributes.normal!==void 0&&(Ae=2),k.morphAttributes.color!==void 0&&(Ae=3);let W,ne,le,se;if(J){const on=ei[J];W=on.vertexShader,ne=on.fragmentShader}else W=y.vertexShader,ne=y.fragmentShader,l.update(y),le=l.getVertexShaderID(y),se=l.getFragmentShaderID(y);const be=n.getRenderTarget(),Le=Y.isInstancedMesh===!0,Fe=Y.isBatchedMesh===!0,Ge=!!y.map,te=!!y.matcap,R=!!N,ue=!!y.aoMap,he=!!y.lightMap,oe=!!y.bumpMap,fe=!!y.normalMap,Ie=!!y.displacementMap,_e=!!y.emissiveMap,P=!!y.metalnessMap,M=!!y.roughnessMap,H=y.anisotropy>0,Q=y.clearcoat>0,ie=y.dispersion>0,ee=y.iridescence>0,Ne=y.sheen>0,ge=y.transmission>0,we=H&&!!y.anisotropyMap,Ke=Q&&!!y.clearcoatMap,ce=Q&&!!y.clearcoatNormalMap,Ee=Q&&!!y.clearcoatRoughnessMap,Be=ee&&!!y.iridescenceMap,He=ee&&!!y.iridescenceThicknessMap,Ce=Ne&&!!y.sheenColorMap,$e=Ne&&!!y.sheenRoughnessMap,Ve=!!y.specularMap,ct=!!y.specularColorMap,I=!!y.specularIntensityMap,Se=ge&&!!y.transmissionMap,q=ge&&!!y.thicknessMap,re=!!y.gradientMap,xe=!!y.alphaMap,Me=y.alphaTest>0,qe=!!y.alphaHash,At=!!y.extensions;let sn=er;y.toneMapped&&(be===null||be.isXRRenderTarget===!0)&&(sn=n.toneMapping);const et={shaderID:J,shaderType:y.type,shaderName:y.name,vertexShader:W,fragmentShader:ne,defines:y.defines,customVertexShaderID:le,customFragmentShaderID:se,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:m,batching:Fe,batchingColor:Fe&&Y._colorsTexture!==null,instancing:Le,instancingColor:Le&&Y.instanceColor!==null,instancingMorph:Le&&Y.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:be===null?n.outputColorSpace:be.isXRRenderTarget===!0?be.texture.colorSpace:lr,alphaToCoverage:!!y.alphaToCoverage,map:Ge,matcap:te,envMap:R,envMapMode:R&&N.mapping,envMapCubeUVHeight:$,aoMap:ue,lightMap:he,bumpMap:oe,normalMap:fe,displacementMap:p&&Ie,emissiveMap:_e,normalMapObjectSpace:fe&&y.normalMapType===ES,normalMapTangentSpace:fe&&y.normalMapType===zv,metalnessMap:P,roughnessMap:M,anisotropy:H,anisotropyMap:we,clearcoat:Q,clearcoatMap:Ke,clearcoatNormalMap:ce,clearcoatRoughnessMap:Ee,dispersion:ie,iridescence:ee,iridescenceMap:Be,iridescenceThicknessMap:He,sheen:Ne,sheenColorMap:Ce,sheenRoughnessMap:$e,specularMap:Ve,specularColorMap:ct,specularIntensityMap:I,transmission:ge,transmissionMap:Se,thicknessMap:q,gradientMap:re,opaque:y.transparent===!1&&y.blending===ws&&y.alphaToCoverage===!1,alphaMap:xe,alphaTest:Me,alphaHash:qe,combine:y.combine,mapUv:Ge&&v(y.map.channel),aoMapUv:ue&&v(y.aoMap.channel),lightMapUv:he&&v(y.lightMap.channel),bumpMapUv:oe&&v(y.bumpMap.channel),normalMapUv:fe&&v(y.normalMap.channel),displacementMapUv:Ie&&v(y.displacementMap.channel),emissiveMapUv:_e&&v(y.emissiveMap.channel),metalnessMapUv:P&&v(y.metalnessMap.channel),roughnessMapUv:M&&v(y.roughnessMap.channel),anisotropyMapUv:we&&v(y.anisotropyMap.channel),clearcoatMapUv:Ke&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:ce&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Be&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:He&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ce&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:$e&&v(y.sheenRoughnessMap.channel),specularMapUv:Ve&&v(y.specularMap.channel),specularColorMapUv:ct&&v(y.specularColorMap.channel),specularIntensityMapUv:I&&v(y.specularIntensityMap.channel),transmissionMapUv:Se&&v(y.transmissionMap.channel),thicknessMapUv:q&&v(y.thicknessMap.channel),alphaMapUv:xe&&v(y.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(fe||H),vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:Y.isPoints===!0&&!!k.attributes.uv&&(Ge||xe),fog:!!j,useFog:y.fog===!0,fogExp2:!!j&&j.isFogExp2,flatShading:y.flatShading===!0,sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:u,reverseDepthBuffer:f,skinning:Y.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:Ae,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:y.dithering,shadowMapEnabled:n.shadowMap.enabled&&O.length>0,shadowMapType:n.shadowMap.type,toneMapping:sn,decodeVideoTexture:Ge&&y.map.isVideoTexture===!0&&it.getTransfer(y.map.colorSpace)===ft,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===ni,flipSided:y.side===fn,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:At&&y.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(At&&y.extensions.multiDraw===!0||Fe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return et.vertexUv1s=c.has(1),et.vertexUv2s=c.has(2),et.vertexUv3s=c.has(3),c.clear(),et}function _(y){const w=[];if(y.shaderID?w.push(y.shaderID):(w.push(y.customVertexShaderID),w.push(y.customFragmentShaderID)),y.defines!==void 0)for(const O in y.defines)w.push(O),w.push(y.defines[O]);return y.isRawShaderMaterial===!1&&(g(w,y),S(w,y),w.push(n.outputColorSpace)),w.push(y.customProgramCacheKey),w.join()}function g(y,w){y.push(w.precision),y.push(w.outputColorSpace),y.push(w.envMapMode),y.push(w.envMapCubeUVHeight),y.push(w.mapUv),y.push(w.alphaMapUv),y.push(w.lightMapUv),y.push(w.aoMapUv),y.push(w.bumpMapUv),y.push(w.normalMapUv),y.push(w.displacementMapUv),y.push(w.emissiveMapUv),y.push(w.metalnessMapUv),y.push(w.roughnessMapUv),y.push(w.anisotropyMapUv),y.push(w.clearcoatMapUv),y.push(w.clearcoatNormalMapUv),y.push(w.clearcoatRoughnessMapUv),y.push(w.iridescenceMapUv),y.push(w.iridescenceThicknessMapUv),y.push(w.sheenColorMapUv),y.push(w.sheenRoughnessMapUv),y.push(w.specularMapUv),y.push(w.specularColorMapUv),y.push(w.specularIntensityMapUv),y.push(w.transmissionMapUv),y.push(w.thicknessMapUv),y.push(w.combine),y.push(w.fogExp2),y.push(w.sizeAttenuation),y.push(w.morphTargetsCount),y.push(w.morphAttributeCount),y.push(w.numDirLights),y.push(w.numPointLights),y.push(w.numSpotLights),y.push(w.numSpotLightMaps),y.push(w.numHemiLights),y.push(w.numRectAreaLights),y.push(w.numDirLightShadows),y.push(w.numPointLightShadows),y.push(w.numSpotLightShadows),y.push(w.numSpotLightShadowsWithMaps),y.push(w.numLightProbes),y.push(w.shadowMapType),y.push(w.toneMapping),y.push(w.numClippingPlanes),y.push(w.numClipIntersection),y.push(w.depthPacking)}function S(y,w){a.disableAll(),w.supportsVertexTextures&&a.enable(0),w.instancing&&a.enable(1),w.instancingColor&&a.enable(2),w.instancingMorph&&a.enable(3),w.matcap&&a.enable(4),w.envMap&&a.enable(5),w.normalMapObjectSpace&&a.enable(6),w.normalMapTangentSpace&&a.enable(7),w.clearcoat&&a.enable(8),w.iridescence&&a.enable(9),w.alphaTest&&a.enable(10),w.vertexColors&&a.enable(11),w.vertexAlphas&&a.enable(12),w.vertexUv1s&&a.enable(13),w.vertexUv2s&&a.enable(14),w.vertexUv3s&&a.enable(15),w.vertexTangents&&a.enable(16),w.anisotropy&&a.enable(17),w.alphaHash&&a.enable(18),w.batching&&a.enable(19),w.dispersion&&a.enable(20),w.batchingColor&&a.enable(21),y.push(a.mask),a.disableAll(),w.fog&&a.enable(0),w.useFog&&a.enable(1),w.flatShading&&a.enable(2),w.logarithmicDepthBuffer&&a.enable(3),w.reverseDepthBuffer&&a.enable(4),w.skinning&&a.enable(5),w.morphTargets&&a.enable(6),w.morphNormals&&a.enable(7),w.morphColors&&a.enable(8),w.premultipliedAlpha&&a.enable(9),w.shadowMapEnabled&&a.enable(10),w.doubleSided&&a.enable(11),w.flipSided&&a.enable(12),w.useDepthPacking&&a.enable(13),w.dithering&&a.enable(14),w.transmission&&a.enable(15),w.sheen&&a.enable(16),w.opaque&&a.enable(17),w.pointsUvs&&a.enable(18),w.decodeVideoTexture&&a.enable(19),w.alphaToCoverage&&a.enable(20),y.push(a.mask)}function A(y){const w=x[y.type];let O;if(w){const G=ei[w];O=e1.clone(G.uniforms)}else O=y.uniforms;return O}function T(y,w){let O;for(let G=0,Y=h.length;G<Y;G++){const j=h[G];if(j.cacheKey===w){O=j,++O.usedTimes;break}}return O===void 0&&(O=new fE(n,w,y,s),h.push(O)),O}function E(y){if(--y.usedTimes===0){const w=h.indexOf(y);h[w]=h[h.length-1],h.pop(),y.destroy()}}function C(y){l.remove(y)}function z(){l.dispose()}return{getParameters:d,getProgramCacheKey:_,getUniforms:A,acquireProgram:T,releaseProgram:E,releaseShaderCache:C,programs:h,dispose:z}}function _E(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function xE(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function km(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Bm(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(u,f,p,m,x,v){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:p,groupOrder:m,renderOrder:u.renderOrder,z:x,group:v},n[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=p,d.groupOrder=m,d.renderOrder=u.renderOrder,d.z=x,d.group=v),e++,d}function a(u,f,p,m,x,v){const d=o(u,f,p,m,x,v);p.transmission>0?i.push(d):p.transparent===!0?r.push(d):t.push(d)}function l(u,f,p,m,x,v){const d=o(u,f,p,m,x,v);p.transmission>0?i.unshift(d):p.transparent===!0?r.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||xE),i.length>1&&i.sort(f||km),r.length>1&&r.sort(f||km)}function h(){for(let u=e,f=n.length;u<f;u++){const p=n[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:h,sort:c}}function yE(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new Bm,n.set(i,[o])):r>=s.length?(o=new Bm,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function SE(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Ze};break;case"SpotLight":t={position:new D,direction:new D,color:new Ze,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Ze,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Ze,groundColor:new Ze};break;case"RectAreaLight":t={color:new Ze,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function ME(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new pe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let wE=0;function EE(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function TE(n){const e=new SE,t=ME(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const r=new D,s=new mt,o=new mt;function a(c){let h=0,u=0,f=0;for(let z=0;z<9;z++)i.probe[z].set(0,0,0);let p=0,m=0,x=0,v=0,d=0,_=0,g=0,S=0,A=0,T=0,E=0;c.sort(EE);for(let z=0,y=c.length;z<y;z++){const w=c[z],O=w.color,G=w.intensity,Y=w.distance,j=w.shadow&&w.shadow.map?w.shadow.map.texture:null;if(w.isAmbientLight)h+=O.r*G,u+=O.g*G,f+=O.b*G;else if(w.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(w.sh.coefficients[k],G);E++}else if(w.isDirectionalLight){const k=e.get(w);if(k.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const K=w.shadow,N=t.get(w);N.shadowIntensity=K.intensity,N.shadowBias=K.bias,N.shadowNormalBias=K.normalBias,N.shadowRadius=K.radius,N.shadowMapSize=K.mapSize,i.directionalShadow[p]=N,i.directionalShadowMap[p]=j,i.directionalShadowMatrix[p]=w.shadow.matrix,_++}i.directional[p]=k,p++}else if(w.isSpotLight){const k=e.get(w);k.position.setFromMatrixPosition(w.matrixWorld),k.color.copy(O).multiplyScalar(G),k.distance=Y,k.coneCos=Math.cos(w.angle),k.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),k.decay=w.decay,i.spot[x]=k;const K=w.shadow;if(w.map&&(i.spotLightMap[A]=w.map,A++,K.updateMatrices(w),w.castShadow&&T++),i.spotLightMatrix[x]=K.matrix,w.castShadow){const N=t.get(w);N.shadowIntensity=K.intensity,N.shadowBias=K.bias,N.shadowNormalBias=K.normalBias,N.shadowRadius=K.radius,N.shadowMapSize=K.mapSize,i.spotShadow[x]=N,i.spotShadowMap[x]=j,S++}x++}else if(w.isRectAreaLight){const k=e.get(w);k.color.copy(O).multiplyScalar(G),k.halfWidth.set(w.width*.5,0,0),k.halfHeight.set(0,w.height*.5,0),i.rectArea[v]=k,v++}else if(w.isPointLight){const k=e.get(w);if(k.color.copy(w.color).multiplyScalar(w.intensity),k.distance=w.distance,k.decay=w.decay,w.castShadow){const K=w.shadow,N=t.get(w);N.shadowIntensity=K.intensity,N.shadowBias=K.bias,N.shadowNormalBias=K.normalBias,N.shadowRadius=K.radius,N.shadowMapSize=K.mapSize,N.shadowCameraNear=K.camera.near,N.shadowCameraFar=K.camera.far,i.pointShadow[m]=N,i.pointShadowMap[m]=j,i.pointShadowMatrix[m]=w.shadow.matrix,g++}i.point[m]=k,m++}else if(w.isHemisphereLight){const k=e.get(w);k.skyColor.copy(w.color).multiplyScalar(G),k.groundColor.copy(w.groundColor).multiplyScalar(G),i.hemi[d]=k,d++}}v>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ve.LTC_FLOAT_1,i.rectAreaLTC2=ve.LTC_FLOAT_2):(i.rectAreaLTC1=ve.LTC_HALF_1,i.rectAreaLTC2=ve.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const C=i.hash;(C.directionalLength!==p||C.pointLength!==m||C.spotLength!==x||C.rectAreaLength!==v||C.hemiLength!==d||C.numDirectionalShadows!==_||C.numPointShadows!==g||C.numSpotShadows!==S||C.numSpotMaps!==A||C.numLightProbes!==E)&&(i.directional.length=p,i.spot.length=x,i.rectArea.length=v,i.point.length=m,i.hemi.length=d,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=g,i.pointShadowMap.length=g,i.spotShadow.length=S,i.spotShadowMap.length=S,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=g,i.spotLightMatrix.length=S+A-T,i.spotLightMap.length=A,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=E,C.directionalLength=p,C.pointLength=m,C.spotLength=x,C.rectAreaLength=v,C.hemiLength=d,C.numDirectionalShadows=_,C.numPointShadows=g,C.numSpotShadows=S,C.numSpotMaps=A,C.numLightProbes=E,i.version=wE++)}function l(c,h){let u=0,f=0,p=0,m=0,x=0;const v=h.matrixWorldInverse;for(let d=0,_=c.length;d<_;d++){const g=c[d];if(g.isDirectionalLight){const S=i.directional[u];S.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(v),u++}else if(g.isSpotLight){const S=i.spot[p];S.position.setFromMatrixPosition(g.matrixWorld),S.position.applyMatrix4(v),S.direction.setFromMatrixPosition(g.matrixWorld),r.setFromMatrixPosition(g.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(v),p++}else if(g.isRectAreaLight){const S=i.rectArea[m];S.position.setFromMatrixPosition(g.matrixWorld),S.position.applyMatrix4(v),o.identity(),s.copy(g.matrixWorld),s.premultiply(v),o.extractRotation(s),S.halfWidth.set(g.width*.5,0,0),S.halfHeight.set(0,g.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),m++}else if(g.isPointLight){const S=i.point[f];S.position.setFromMatrixPosition(g.matrixWorld),S.position.applyMatrix4(v),f++}else if(g.isHemisphereLight){const S=i.hemi[x];S.direction.setFromMatrixPosition(g.matrixWorld),S.direction.transformDirection(v),x++}}}return{setup:a,setupView:l,state:i}}function Hm(n){const e=new TE(n),t=[],i=[];function r(h){c.camera=h,t.length=0,i.length=0}function s(h){t.push(h)}function o(h){i.push(h)}function a(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function AE(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new Hm(n),e.set(r,[a])):s>=o.length?(a=new Hm(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}class bE extends Ws{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=MS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class CE extends Ws{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const PE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,RE=`uniform sampler2D shadow_pass;
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
}`;function LE(n,e,t){let i=new xf;const r=new pe,s=new pe,o=new ot,a=new bE({depthPacking:wS}),l=new CE,c={},h=t.maxTextureSize,u={[ir]:fn,[fn]:ir,[ni]:ni},f=new rr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new pe},radius:{value:4}},vertexShader:PE,fragmentShader:RE}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const m=new qt;m.setAttribute("position",new si(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new We(m,f),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Sv;let d=this.type;this.render=function(T,E,C){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||T.length===0)return;const z=n.getRenderTarget(),y=n.getActiveCubeFace(),w=n.getActiveMipmapLevel(),O=n.state;O.setBlending(Qi),O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const G=d!==pi&&this.type===pi,Y=d===pi&&this.type!==pi;for(let j=0,k=T.length;j<k;j++){const K=T[j],N=K.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const $=N.getFrameExtents();if(r.multiply($),s.copy(N.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/$.x),r.x=s.x*$.x,N.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/$.y),r.y=s.y*$.y,N.mapSize.y=s.y)),N.map===null||G===!0||Y===!0){const Z=this.type!==pi?{minFilter:Ln,magFilter:Ln}:{};N.map!==null&&N.map.dispose(),N.map=new zr(r.x,r.y,Z),N.map.texture.name=K.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();const J=N.getViewportCount();for(let Z=0;Z<J;Z++){const me=N.getViewport(Z);o.set(s.x*me.x,s.y*me.y,s.x*me.z,s.y*me.w),O.viewport(o),N.updateMatrices(K,Z),i=N.getFrustum(),S(E,C,N.camera,K,this.type)}N.isPointLightShadow!==!0&&this.type===pi&&_(N,C),N.needsUpdate=!1}d=this.type,v.needsUpdate=!1,n.setRenderTarget(z,y,w)};function _(T,E){const C=e.update(x);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new zr(r.x,r.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(E,null,C,f,x,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(E,null,C,p,x,null)}function g(T,E,C,z){let y=null;const w=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(w!==void 0)y=w;else if(y=C.isPointLight===!0?l:a,n.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0){const O=y.uuid,G=E.uuid;let Y=c[O];Y===void 0&&(Y={},c[O]=Y);let j=Y[G];j===void 0&&(j=y.clone(),Y[G]=j,E.addEventListener("dispose",A)),y=j}if(y.visible=E.visible,y.wireframe=E.wireframe,z===pi?y.side=E.shadowSide!==null?E.shadowSide:E.side:y.side=E.shadowSide!==null?E.shadowSide:u[E.side],y.alphaMap=E.alphaMap,y.alphaTest=E.alphaTest,y.map=E.map,y.clipShadows=E.clipShadows,y.clippingPlanes=E.clippingPlanes,y.clipIntersection=E.clipIntersection,y.displacementMap=E.displacementMap,y.displacementScale=E.displacementScale,y.displacementBias=E.displacementBias,y.wireframeLinewidth=E.wireframeLinewidth,y.linewidth=E.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const O=n.properties.get(y);O.light=C}return y}function S(T,E,C,z,y){if(T.visible===!1)return;if(T.layers.test(E.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&y===pi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const G=e.update(T),Y=T.material;if(Array.isArray(Y)){const j=G.groups;for(let k=0,K=j.length;k<K;k++){const N=j[k],$=Y[N.materialIndex];if($&&$.visible){const J=g(T,$,z,y);T.onBeforeShadow(n,T,E,C,G,J,N),n.renderBufferDirect(C,null,G,J,T,N),T.onAfterShadow(n,T,E,C,G,J,N)}}}else if(Y.visible){const j=g(T,Y,z,y);T.onBeforeShadow(n,T,E,C,G,j,null),n.renderBufferDirect(C,null,G,j,T,null),T.onAfterShadow(n,T,E,C,G,j,null)}}const O=T.children;for(let G=0,Y=O.length;G<Y;G++)S(O[G],E,C,z,y)}function A(T){T.target.removeEventListener("dispose",A);for(const C in c){const z=c[C],y=T.target.uuid;y in z&&(z[y].dispose(),delete z[y])}}}const NE={[Ph]:Rh,[Lh]:Ih,[Nh]:Uh,[Ds]:Dh,[Rh]:Ph,[Ih]:Lh,[Uh]:Nh,[Dh]:Ds};function DE(n){function e(){let I=!1;const Se=new ot;let q=null;const re=new ot(0,0,0,0);return{setMask:function(xe){q!==xe&&!I&&(n.colorMask(xe,xe,xe,xe),q=xe)},setLocked:function(xe){I=xe},setClear:function(xe,Me,qe,At,sn){sn===!0&&(xe*=At,Me*=At,qe*=At),Se.set(xe,Me,qe,At),re.equals(Se)===!1&&(n.clearColor(xe,Me,qe,At),re.copy(Se))},reset:function(){I=!1,q=null,re.set(-1,0,0,0)}}}function t(){let I=!1,Se=!1,q=null,re=null,xe=null;return{setReversed:function(Me){Se=Me},setTest:function(Me){Me?le(n.DEPTH_TEST):se(n.DEPTH_TEST)},setMask:function(Me){q!==Me&&!I&&(n.depthMask(Me),q=Me)},setFunc:function(Me){if(Se&&(Me=NE[Me]),re!==Me){switch(Me){case Ph:n.depthFunc(n.NEVER);break;case Rh:n.depthFunc(n.ALWAYS);break;case Lh:n.depthFunc(n.LESS);break;case Ds:n.depthFunc(n.LEQUAL);break;case Nh:n.depthFunc(n.EQUAL);break;case Dh:n.depthFunc(n.GEQUAL);break;case Ih:n.depthFunc(n.GREATER);break;case Uh:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}re=Me}},setLocked:function(Me){I=Me},setClear:function(Me){xe!==Me&&(n.clearDepth(Me),xe=Me)},reset:function(){I=!1,q=null,re=null,xe=null}}}function i(){let I=!1,Se=null,q=null,re=null,xe=null,Me=null,qe=null,At=null,sn=null;return{setTest:function(et){I||(et?le(n.STENCIL_TEST):se(n.STENCIL_TEST))},setMask:function(et){Se!==et&&!I&&(n.stencilMask(et),Se=et)},setFunc:function(et,on,li){(q!==et||re!==on||xe!==li)&&(n.stencilFunc(et,on,li),q=et,re=on,xe=li)},setOp:function(et,on,li){(Me!==et||qe!==on||At!==li)&&(n.stencilOp(et,on,li),Me=et,qe=on,At=li)},setLocked:function(et){I=et},setClear:function(et){sn!==et&&(n.clearStencil(et),sn=et)},reset:function(){I=!1,Se=null,q=null,re=null,xe=null,Me=null,qe=null,At=null,sn=null}}}const r=new e,s=new t,o=new i,a=new WeakMap,l=new WeakMap;let c={},h={},u=new WeakMap,f=[],p=null,m=!1,x=null,v=null,d=null,_=null,g=null,S=null,A=null,T=new Ze(0,0,0),E=0,C=!1,z=null,y=null,w=null,O=null,G=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let j=!1,k=0;const K=n.getParameter(n.VERSION);K.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(K)[1]),j=k>=1):K.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),j=k>=2);let N=null,$={};const J=n.getParameter(n.SCISSOR_BOX),Z=n.getParameter(n.VIEWPORT),me=new ot().fromArray(J),Ae=new ot().fromArray(Z);function W(I,Se,q,re){const xe=new Uint8Array(4),Me=n.createTexture();n.bindTexture(I,Me),n.texParameteri(I,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(I,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let qe=0;qe<q;qe++)I===n.TEXTURE_3D||I===n.TEXTURE_2D_ARRAY?n.texImage3D(Se,0,n.RGBA,1,1,re,0,n.RGBA,n.UNSIGNED_BYTE,xe):n.texImage2D(Se+qe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,xe);return Me}const ne={};ne[n.TEXTURE_2D]=W(n.TEXTURE_2D,n.TEXTURE_2D,1),ne[n.TEXTURE_CUBE_MAP]=W(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),ne[n.TEXTURE_2D_ARRAY]=W(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),ne[n.TEXTURE_3D]=W(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),le(n.DEPTH_TEST),s.setFunc(Ds),he(!1),oe(Kp),le(n.CULL_FACE),R(Qi);function le(I){c[I]!==!0&&(n.enable(I),c[I]=!0)}function se(I){c[I]!==!1&&(n.disable(I),c[I]=!1)}function be(I,Se){return h[I]!==Se?(n.bindFramebuffer(I,Se),h[I]=Se,I===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=Se),I===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=Se),!0):!1}function Le(I,Se){let q=f,re=!1;if(I){q=u.get(Se),q===void 0&&(q=[],u.set(Se,q));const xe=I.textures;if(q.length!==xe.length||q[0]!==n.COLOR_ATTACHMENT0){for(let Me=0,qe=xe.length;Me<qe;Me++)q[Me]=n.COLOR_ATTACHMENT0+Me;q.length=xe.length,re=!0}}else q[0]!==n.BACK&&(q[0]=n.BACK,re=!0);re&&n.drawBuffers(q)}function Fe(I){return p!==I?(n.useProgram(I),p=I,!0):!1}const Ge={[Sr]:n.FUNC_ADD,[$y]:n.FUNC_SUBTRACT,[qy]:n.FUNC_REVERSE_SUBTRACT};Ge[Jy]=n.MIN,Ge[Qy]=n.MAX;const te={[eS]:n.ZERO,[tS]:n.ONE,[nS]:n.SRC_COLOR,[bh]:n.SRC_ALPHA,[lS]:n.SRC_ALPHA_SATURATE,[oS]:n.DST_COLOR,[rS]:n.DST_ALPHA,[iS]:n.ONE_MINUS_SRC_COLOR,[Ch]:n.ONE_MINUS_SRC_ALPHA,[aS]:n.ONE_MINUS_DST_COLOR,[sS]:n.ONE_MINUS_DST_ALPHA,[cS]:n.CONSTANT_COLOR,[uS]:n.ONE_MINUS_CONSTANT_COLOR,[hS]:n.CONSTANT_ALPHA,[dS]:n.ONE_MINUS_CONSTANT_ALPHA};function R(I,Se,q,re,xe,Me,qe,At,sn,et){if(I===Qi){m===!0&&(se(n.BLEND),m=!1);return}if(m===!1&&(le(n.BLEND),m=!0),I!==Ky){if(I!==x||et!==C){if((v!==Sr||g!==Sr)&&(n.blendEquation(n.FUNC_ADD),v=Sr,g=Sr),et)switch(I){case ws:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case $p:n.blendFunc(n.ONE,n.ONE);break;case qp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Jp:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}else switch(I){case ws:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case $p:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case qp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Jp:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",I);break}d=null,_=null,S=null,A=null,T.set(0,0,0),E=0,x=I,C=et}return}xe=xe||Se,Me=Me||q,qe=qe||re,(Se!==v||xe!==g)&&(n.blendEquationSeparate(Ge[Se],Ge[xe]),v=Se,g=xe),(q!==d||re!==_||Me!==S||qe!==A)&&(n.blendFuncSeparate(te[q],te[re],te[Me],te[qe]),d=q,_=re,S=Me,A=qe),(At.equals(T)===!1||sn!==E)&&(n.blendColor(At.r,At.g,At.b,sn),T.copy(At),E=sn),x=I,C=!1}function ue(I,Se){I.side===ni?se(n.CULL_FACE):le(n.CULL_FACE);let q=I.side===fn;Se&&(q=!q),he(q),I.blending===ws&&I.transparent===!1?R(Qi):R(I.blending,I.blendEquation,I.blendSrc,I.blendDst,I.blendEquationAlpha,I.blendSrcAlpha,I.blendDstAlpha,I.blendColor,I.blendAlpha,I.premultipliedAlpha),s.setFunc(I.depthFunc),s.setTest(I.depthTest),s.setMask(I.depthWrite),r.setMask(I.colorWrite);const re=I.stencilWrite;o.setTest(re),re&&(o.setMask(I.stencilWriteMask),o.setFunc(I.stencilFunc,I.stencilRef,I.stencilFuncMask),o.setOp(I.stencilFail,I.stencilZFail,I.stencilZPass)),Ie(I.polygonOffset,I.polygonOffsetFactor,I.polygonOffsetUnits),I.alphaToCoverage===!0?le(n.SAMPLE_ALPHA_TO_COVERAGE):se(n.SAMPLE_ALPHA_TO_COVERAGE)}function he(I){z!==I&&(I?n.frontFace(n.CW):n.frontFace(n.CCW),z=I)}function oe(I){I!==Yy?(le(n.CULL_FACE),I!==y&&(I===Kp?n.cullFace(n.BACK):I===Zy?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):se(n.CULL_FACE),y=I}function fe(I){I!==w&&(j&&n.lineWidth(I),w=I)}function Ie(I,Se,q){I?(le(n.POLYGON_OFFSET_FILL),(O!==Se||G!==q)&&(n.polygonOffset(Se,q),O=Se,G=q)):se(n.POLYGON_OFFSET_FILL)}function _e(I){I?le(n.SCISSOR_TEST):se(n.SCISSOR_TEST)}function P(I){I===void 0&&(I=n.TEXTURE0+Y-1),N!==I&&(n.activeTexture(I),N=I)}function M(I,Se,q){q===void 0&&(N===null?q=n.TEXTURE0+Y-1:q=N);let re=$[q];re===void 0&&(re={type:void 0,texture:void 0},$[q]=re),(re.type!==I||re.texture!==Se)&&(N!==q&&(n.activeTexture(q),N=q),n.bindTexture(I,Se||ne[I]),re.type=I,re.texture=Se)}function H(){const I=$[N];I!==void 0&&I.type!==void 0&&(n.bindTexture(I.type,null),I.type=void 0,I.texture=void 0)}function Q(){try{n.compressedTexImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ie(){try{n.compressedTexImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ee(){try{n.texSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ne(){try{n.texSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ge(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function we(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ke(){try{n.texStorage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function ce(){try{n.texStorage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Ee(){try{n.texImage2D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function Be(){try{n.texImage3D.apply(n,arguments)}catch(I){console.error("THREE.WebGLState:",I)}}function He(I){me.equals(I)===!1&&(n.scissor(I.x,I.y,I.z,I.w),me.copy(I))}function Ce(I){Ae.equals(I)===!1&&(n.viewport(I.x,I.y,I.z,I.w),Ae.copy(I))}function $e(I,Se){let q=l.get(Se);q===void 0&&(q=new WeakMap,l.set(Se,q));let re=q.get(I);re===void 0&&(re=n.getUniformBlockIndex(Se,I.name),q.set(I,re))}function Ve(I,Se){const re=l.get(Se).get(I);a.get(Se)!==re&&(n.uniformBlockBinding(Se,re,I.__bindingPointIndex),a.set(Se,re))}function ct(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),c={},N=null,$={},h={},u=new WeakMap,f=[],p=null,m=!1,x=null,v=null,d=null,_=null,g=null,S=null,A=null,T=new Ze(0,0,0),E=0,C=!1,z=null,y=null,w=null,O=null,G=null,me.set(0,0,n.canvas.width,n.canvas.height),Ae.set(0,0,n.canvas.width,n.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:le,disable:se,bindFramebuffer:be,drawBuffers:Le,useProgram:Fe,setBlending:R,setMaterial:ue,setFlipSided:he,setCullFace:oe,setLineWidth:fe,setPolygonOffset:Ie,setScissorTest:_e,activeTexture:P,bindTexture:M,unbindTexture:H,compressedTexImage2D:Q,compressedTexImage3D:ie,texImage2D:Ee,texImage3D:Be,updateUBOMapping:$e,uniformBlockBinding:Ve,texStorage2D:Ke,texStorage3D:ce,texSubImage2D:ee,texSubImage3D:Ne,compressedTexSubImage2D:ge,compressedTexSubImage3D:we,scissor:He,viewport:Ce,reset:ct}}function Gm(n,e,t,i){const r=IE(i);switch(t){case Pv:return n*e;case Lv:return n*e;case Nv:return n*e*2;case Dv:return n*e/r.components*r.byteLength;case mf:return n*e/r.components*r.byteLength;case Iv:return n*e*2/r.components*r.byteLength;case gf:return n*e*2/r.components*r.byteLength;case Rv:return n*e*3/r.components*r.byteLength;case jn:return n*e*4/r.components*r.byteLength;case vf:return n*e*4/r.components*r.byteLength;case ul:case hl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case dl:case fl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Bh:case Gh:return Math.max(n,16)*Math.max(e,8)/4;case kh:case Hh:return Math.max(n,8)*Math.max(e,8)/2;case Vh:case Wh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Xh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case jh:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Yh:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Zh:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Kh:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case $h:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case qh:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Jh:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Qh:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ed:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case td:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case nd:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case id:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case rd:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case sd:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case pl:case od:case ad:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Uv:case ld:return Math.ceil(n/4)*Math.ceil(e/4)*8;case cd:case ud:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function IE(n){switch(n){case bi:case Av:return{byteLength:1,components:1};case Wo:case bv:case ea:return{byteLength:2,components:1};case ff:case pf:return{byteLength:2,components:4};case Ur:case df:case xi:return{byteLength:4,components:1};case Cv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function UE(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new pe,h=new WeakMap;let u;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,M){return p?new OffscreenCanvas(P,M):Xl("canvas")}function x(P,M,H){let Q=1;const ie=_e(P);if((ie.width>H||ie.height>H)&&(Q=H/Math.max(ie.width,ie.height)),Q<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const ee=Math.floor(Q*ie.width),Ne=Math.floor(Q*ie.height);u===void 0&&(u=m(ee,Ne));const ge=M?m(ee,Ne):u;return ge.width=ee,ge.height=Ne,ge.getContext("2d").drawImage(P,0,0,ee,Ne),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ie.width+"x"+ie.height+") to ("+ee+"x"+Ne+")."),ge}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ie.width+"x"+ie.height+")."),P;return P}function v(P){return P.generateMipmaps&&P.minFilter!==Ln&&P.minFilter!==Vn}function d(P){n.generateMipmap(P)}function _(P,M,H,Q,ie=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let ee=M;if(M===n.RED&&(H===n.FLOAT&&(ee=n.R32F),H===n.HALF_FLOAT&&(ee=n.R16F),H===n.UNSIGNED_BYTE&&(ee=n.R8)),M===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.R8UI),H===n.UNSIGNED_SHORT&&(ee=n.R16UI),H===n.UNSIGNED_INT&&(ee=n.R32UI),H===n.BYTE&&(ee=n.R8I),H===n.SHORT&&(ee=n.R16I),H===n.INT&&(ee=n.R32I)),M===n.RG&&(H===n.FLOAT&&(ee=n.RG32F),H===n.HALF_FLOAT&&(ee=n.RG16F),H===n.UNSIGNED_BYTE&&(ee=n.RG8)),M===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RG8UI),H===n.UNSIGNED_SHORT&&(ee=n.RG16UI),H===n.UNSIGNED_INT&&(ee=n.RG32UI),H===n.BYTE&&(ee=n.RG8I),H===n.SHORT&&(ee=n.RG16I),H===n.INT&&(ee=n.RG32I)),M===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RGB8UI),H===n.UNSIGNED_SHORT&&(ee=n.RGB16UI),H===n.UNSIGNED_INT&&(ee=n.RGB32UI),H===n.BYTE&&(ee=n.RGB8I),H===n.SHORT&&(ee=n.RGB16I),H===n.INT&&(ee=n.RGB32I)),M===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(ee=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(ee=n.RGBA16UI),H===n.UNSIGNED_INT&&(ee=n.RGBA32UI),H===n.BYTE&&(ee=n.RGBA8I),H===n.SHORT&&(ee=n.RGBA16I),H===n.INT&&(ee=n.RGBA32I)),M===n.RGB&&H===n.UNSIGNED_INT_5_9_9_9_REV&&(ee=n.RGB9_E5),M===n.RGBA){const Ne=ie?Hl:it.getTransfer(Q);H===n.FLOAT&&(ee=n.RGBA32F),H===n.HALF_FLOAT&&(ee=n.RGBA16F),H===n.UNSIGNED_BYTE&&(ee=Ne===ft?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(ee=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(ee=n.RGB5_A1)}return(ee===n.R16F||ee===n.R32F||ee===n.RG16F||ee===n.RG32F||ee===n.RGBA16F||ee===n.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function g(P,M){let H;return P?M===null||M===Ur||M===zs?H=n.DEPTH24_STENCIL8:M===xi?H=n.DEPTH32F_STENCIL8:M===Wo&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Ur||M===zs?H=n.DEPTH_COMPONENT24:M===xi?H=n.DEPTH_COMPONENT32F:M===Wo&&(H=n.DEPTH_COMPONENT16),H}function S(P,M){return v(P)===!0||P.isFramebufferTexture&&P.minFilter!==Ln&&P.minFilter!==Vn?Math.log2(Math.max(M.width,M.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?M.mipmaps.length:1}function A(P){const M=P.target;M.removeEventListener("dispose",A),E(M),M.isVideoTexture&&h.delete(M)}function T(P){const M=P.target;M.removeEventListener("dispose",T),z(M)}function E(P){const M=i.get(P);if(M.__webglInit===void 0)return;const H=P.source,Q=f.get(H);if(Q){const ie=Q[M.__cacheKey];ie.usedTimes--,ie.usedTimes===0&&C(P),Object.keys(Q).length===0&&f.delete(H)}i.remove(P)}function C(P){const M=i.get(P);n.deleteTexture(M.__webglTexture);const H=P.source,Q=f.get(H);delete Q[M.__cacheKey],o.memory.textures--}function z(P){const M=i.get(P);if(P.depthTexture&&P.depthTexture.dispose(),P.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(M.__webglFramebuffer[Q]))for(let ie=0;ie<M.__webglFramebuffer[Q].length;ie++)n.deleteFramebuffer(M.__webglFramebuffer[Q][ie]);else n.deleteFramebuffer(M.__webglFramebuffer[Q]);M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer[Q])}else{if(Array.isArray(M.__webglFramebuffer))for(let Q=0;Q<M.__webglFramebuffer.length;Q++)n.deleteFramebuffer(M.__webglFramebuffer[Q]);else n.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&n.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&n.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let Q=0;Q<M.__webglColorRenderbuffer.length;Q++)M.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(M.__webglColorRenderbuffer[Q]);M.__webglDepthRenderbuffer&&n.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const H=P.textures;for(let Q=0,ie=H.length;Q<ie;Q++){const ee=i.get(H[Q]);ee.__webglTexture&&(n.deleteTexture(ee.__webglTexture),o.memory.textures--),i.remove(H[Q])}i.remove(P)}let y=0;function w(){y=0}function O(){const P=y;return P>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+r.maxTextures),y+=1,P}function G(P){const M=[];return M.push(P.wrapS),M.push(P.wrapT),M.push(P.wrapR||0),M.push(P.magFilter),M.push(P.minFilter),M.push(P.anisotropy),M.push(P.internalFormat),M.push(P.format),M.push(P.type),M.push(P.generateMipmaps),M.push(P.premultiplyAlpha),M.push(P.flipY),M.push(P.unpackAlignment),M.push(P.colorSpace),M.join()}function Y(P,M){const H=i.get(P);if(P.isVideoTexture&&fe(P),P.isRenderTargetTexture===!1&&P.version>0&&H.__version!==P.version){const Q=P.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Ae(H,P,M);return}}t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+M)}function j(P,M){const H=i.get(P);if(P.version>0&&H.__version!==P.version){Ae(H,P,M);return}t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+M)}function k(P,M){const H=i.get(P);if(P.version>0&&H.__version!==P.version){Ae(H,P,M);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+M)}function K(P,M){const H=i.get(P);if(P.version>0&&H.__version!==P.version){W(H,P,M);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+M)}const N={[Ai]:n.REPEAT,[Ar]:n.CLAMP_TO_EDGE,[Oh]:n.MIRRORED_REPEAT},$={[Ln]:n.NEAREST,[SS]:n.NEAREST_MIPMAP_NEAREST,[Ma]:n.NEAREST_MIPMAP_LINEAR,[Vn]:n.LINEAR,[Kc]:n.LINEAR_MIPMAP_NEAREST,[br]:n.LINEAR_MIPMAP_LINEAR},J={[TS]:n.NEVER,[LS]:n.ALWAYS,[AS]:n.LESS,[Fv]:n.LEQUAL,[bS]:n.EQUAL,[RS]:n.GEQUAL,[CS]:n.GREATER,[PS]:n.NOTEQUAL};function Z(P,M){if(M.type===xi&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Vn||M.magFilter===Kc||M.magFilter===Ma||M.magFilter===br||M.minFilter===Vn||M.minFilter===Kc||M.minFilter===Ma||M.minFilter===br)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,N[M.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,N[M.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,N[M.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,$[M.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,$[M.minFilter]),M.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,J[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Ln||M.minFilter!==Ma&&M.minFilter!==br||M.type===xi&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||i.get(M).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),i.get(M).__currentAnisotropy=M.anisotropy}}}function me(P,M){let H=!1;P.__webglInit===void 0&&(P.__webglInit=!0,M.addEventListener("dispose",A));const Q=M.source;let ie=f.get(Q);ie===void 0&&(ie={},f.set(Q,ie));const ee=G(M);if(ee!==P.__cacheKey){ie[ee]===void 0&&(ie[ee]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,H=!0),ie[ee].usedTimes++;const Ne=ie[P.__cacheKey];Ne!==void 0&&(ie[P.__cacheKey].usedTimes--,Ne.usedTimes===0&&C(M)),P.__cacheKey=ee,P.__webglTexture=ie[ee].texture}return H}function Ae(P,M,H){let Q=n.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),M.isData3DTexture&&(Q=n.TEXTURE_3D);const ie=me(P,M),ee=M.source;t.bindTexture(Q,P.__webglTexture,n.TEXTURE0+H);const Ne=i.get(ee);if(ee.version!==Ne.__version||ie===!0){t.activeTexture(n.TEXTURE0+H);const ge=it.getPrimaries(it.workingColorSpace),we=M.colorSpace===Hi?null:it.getPrimaries(M.colorSpace),Ke=M.colorSpace===Hi||ge===we?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let ce=x(M.image,!1,r.maxTextureSize);ce=Ie(M,ce);const Ee=s.convert(M.format,M.colorSpace),Be=s.convert(M.type);let He=_(M.internalFormat,Ee,Be,M.colorSpace,M.isVideoTexture);Z(Q,M);let Ce;const $e=M.mipmaps,Ve=M.isVideoTexture!==!0,ct=Ne.__version===void 0||ie===!0,I=ee.dataReady,Se=S(M,ce);if(M.isDepthTexture)He=g(M.format===Fs,M.type),ct&&(Ve?t.texStorage2D(n.TEXTURE_2D,1,He,ce.width,ce.height):t.texImage2D(n.TEXTURE_2D,0,He,ce.width,ce.height,0,Ee,Be,null));else if(M.isDataTexture)if($e.length>0){Ve&&ct&&t.texStorage2D(n.TEXTURE_2D,Se,He,$e[0].width,$e[0].height);for(let q=0,re=$e.length;q<re;q++)Ce=$e[q],Ve?I&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,Ce.width,Ce.height,Ee,Be,Ce.data):t.texImage2D(n.TEXTURE_2D,q,He,Ce.width,Ce.height,0,Ee,Be,Ce.data);M.generateMipmaps=!1}else Ve?(ct&&t.texStorage2D(n.TEXTURE_2D,Se,He,ce.width,ce.height),I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ce.width,ce.height,Ee,Be,ce.data)):t.texImage2D(n.TEXTURE_2D,0,He,ce.width,ce.height,0,Ee,Be,ce.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Ve&&ct&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Se,He,$e[0].width,$e[0].height,ce.depth);for(let q=0,re=$e.length;q<re;q++)if(Ce=$e[q],M.format!==jn)if(Ee!==null)if(Ve){if(I)if(M.layerUpdates.size>0){const xe=Gm(Ce.width,Ce.height,M.format,M.type);for(const Me of M.layerUpdates){const qe=Ce.data.subarray(Me*xe/Ce.data.BYTES_PER_ELEMENT,(Me+1)*xe/Ce.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,Me,Ce.width,Ce.height,1,Ee,qe,0,0)}M.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,Ce.width,Ce.height,ce.depth,Ee,Ce.data,0,0)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,q,He,Ce.width,Ce.height,ce.depth,0,Ce.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ve?I&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,Ce.width,Ce.height,ce.depth,Ee,Be,Ce.data):t.texImage3D(n.TEXTURE_2D_ARRAY,q,He,Ce.width,Ce.height,ce.depth,0,Ee,Be,Ce.data)}else{Ve&&ct&&t.texStorage2D(n.TEXTURE_2D,Se,He,$e[0].width,$e[0].height);for(let q=0,re=$e.length;q<re;q++)Ce=$e[q],M.format!==jn?Ee!==null?Ve?I&&t.compressedTexSubImage2D(n.TEXTURE_2D,q,0,0,Ce.width,Ce.height,Ee,Ce.data):t.compressedTexImage2D(n.TEXTURE_2D,q,He,Ce.width,Ce.height,0,Ce.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ve?I&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,Ce.width,Ce.height,Ee,Be,Ce.data):t.texImage2D(n.TEXTURE_2D,q,He,Ce.width,Ce.height,0,Ee,Be,Ce.data)}else if(M.isDataArrayTexture)if(Ve){if(ct&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Se,He,ce.width,ce.height,ce.depth),I)if(M.layerUpdates.size>0){const q=Gm(ce.width,ce.height,M.format,M.type);for(const re of M.layerUpdates){const xe=ce.data.subarray(re*q/ce.data.BYTES_PER_ELEMENT,(re+1)*q/ce.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,re,ce.width,ce.height,1,Ee,Be,xe)}M.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ce.width,ce.height,ce.depth,Ee,Be,ce.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,He,ce.width,ce.height,ce.depth,0,Ee,Be,ce.data);else if(M.isData3DTexture)Ve?(ct&&t.texStorage3D(n.TEXTURE_3D,Se,He,ce.width,ce.height,ce.depth),I&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ce.width,ce.height,ce.depth,Ee,Be,ce.data)):t.texImage3D(n.TEXTURE_3D,0,He,ce.width,ce.height,ce.depth,0,Ee,Be,ce.data);else if(M.isFramebufferTexture){if(ct)if(Ve)t.texStorage2D(n.TEXTURE_2D,Se,He,ce.width,ce.height);else{let q=ce.width,re=ce.height;for(let xe=0;xe<Se;xe++)t.texImage2D(n.TEXTURE_2D,xe,He,q,re,0,Ee,Be,null),q>>=1,re>>=1}}else if($e.length>0){if(Ve&&ct){const q=_e($e[0]);t.texStorage2D(n.TEXTURE_2D,Se,He,q.width,q.height)}for(let q=0,re=$e.length;q<re;q++)Ce=$e[q],Ve?I&&t.texSubImage2D(n.TEXTURE_2D,q,0,0,Ee,Be,Ce):t.texImage2D(n.TEXTURE_2D,q,He,Ee,Be,Ce);M.generateMipmaps=!1}else if(Ve){if(ct){const q=_e(ce);t.texStorage2D(n.TEXTURE_2D,Se,He,q.width,q.height)}I&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Ee,Be,ce)}else t.texImage2D(n.TEXTURE_2D,0,He,Ee,Be,ce);v(M)&&d(Q),Ne.__version=ee.version,M.onUpdate&&M.onUpdate(M)}P.__version=M.version}function W(P,M,H){if(M.image.length!==6)return;const Q=me(P,M),ie=M.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+H);const ee=i.get(ie);if(ie.version!==ee.__version||Q===!0){t.activeTexture(n.TEXTURE0+H);const Ne=it.getPrimaries(it.workingColorSpace),ge=M.colorSpace===Hi?null:it.getPrimaries(M.colorSpace),we=M.colorSpace===Hi||Ne===ge?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,M.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,M.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);const Ke=M.isCompressedTexture||M.image[0].isCompressedTexture,ce=M.image[0]&&M.image[0].isDataTexture,Ee=[];for(let re=0;re<6;re++)!Ke&&!ce?Ee[re]=x(M.image[re],!0,r.maxCubemapSize):Ee[re]=ce?M.image[re].image:M.image[re],Ee[re]=Ie(M,Ee[re]);const Be=Ee[0],He=s.convert(M.format,M.colorSpace),Ce=s.convert(M.type),$e=_(M.internalFormat,He,Ce,M.colorSpace),Ve=M.isVideoTexture!==!0,ct=ee.__version===void 0||Q===!0,I=ie.dataReady;let Se=S(M,Be);Z(n.TEXTURE_CUBE_MAP,M);let q;if(Ke){Ve&&ct&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,$e,Be.width,Be.height);for(let re=0;re<6;re++){q=Ee[re].mipmaps;for(let xe=0;xe<q.length;xe++){const Me=q[xe];M.format!==jn?He!==null?Ve?I&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe,0,0,Me.width,Me.height,He,Me.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe,$e,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ve?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe,0,0,Me.width,Me.height,He,Ce,Me.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe,$e,Me.width,Me.height,0,He,Ce,Me.data)}}}else{if(q=M.mipmaps,Ve&&ct){q.length>0&&Se++;const re=_e(Ee[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Se,$e,re.width,re.height)}for(let re=0;re<6;re++)if(ce){Ve?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,Ee[re].width,Ee[re].height,He,Ce,Ee[re].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,$e,Ee[re].width,Ee[re].height,0,He,Ce,Ee[re].data);for(let xe=0;xe<q.length;xe++){const qe=q[xe].image[re].image;Ve?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe+1,0,0,qe.width,qe.height,He,Ce,qe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe+1,$e,qe.width,qe.height,0,He,Ce,qe.data)}}else{Ve?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,He,Ce,Ee[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,$e,He,Ce,Ee[re]);for(let xe=0;xe<q.length;xe++){const Me=q[xe];Ve?I&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe+1,0,0,He,Ce,Me.image[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,xe+1,$e,He,Ce,Me.image[re])}}}v(M)&&d(n.TEXTURE_CUBE_MAP),ee.__version=ie.version,M.onUpdate&&M.onUpdate(M)}P.__version=M.version}function ne(P,M,H,Q,ie,ee){const Ne=s.convert(H.format,H.colorSpace),ge=s.convert(H.type),we=_(H.internalFormat,Ne,ge,H.colorSpace);if(!i.get(M).__hasExternalTextures){const ce=Math.max(1,M.width>>ee),Ee=Math.max(1,M.height>>ee);ie===n.TEXTURE_3D||ie===n.TEXTURE_2D_ARRAY?t.texImage3D(ie,ee,we,ce,Ee,M.depth,0,Ne,ge,null):t.texImage2D(ie,ee,we,ce,Ee,0,Ne,ge,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),oe(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,ie,i.get(H).__webglTexture,0,he(M)):(ie===n.TEXTURE_2D||ie>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ie<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,ie,i.get(H).__webglTexture,ee),t.bindFramebuffer(n.FRAMEBUFFER,null)}function le(P,M,H){if(n.bindRenderbuffer(n.RENDERBUFFER,P),M.depthBuffer){const Q=M.depthTexture,ie=Q&&Q.isDepthTexture?Q.type:null,ee=g(M.stencilBuffer,ie),Ne=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ge=he(M);oe(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ge,ee,M.width,M.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,ge,ee,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,ee,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Ne,n.RENDERBUFFER,P)}else{const Q=M.textures;for(let ie=0;ie<Q.length;ie++){const ee=Q[ie],Ne=s.convert(ee.format,ee.colorSpace),ge=s.convert(ee.type),we=_(ee.internalFormat,Ne,ge,ee.colorSpace),Ke=he(M);H&&oe(M)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ke,we,M.width,M.height):oe(M)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ke,we,M.width,M.height):n.renderbufferStorage(n.RENDERBUFFER,we,M.width,M.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function se(P,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),Y(M.depthTexture,0);const Q=i.get(M.depthTexture).__webglTexture,ie=he(M);if(M.depthTexture.format===Es)oe(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0,ie):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Q,0);else if(M.depthTexture.format===Fs)oe(M)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0,ie):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function be(P){const M=i.get(P),H=P.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==P.depthTexture){const Q=P.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),Q){const ie=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,Q.removeEventListener("dispose",ie)};Q.addEventListener("dispose",ie),M.__depthDisposeCallback=ie}M.__boundDepthTexture=Q}if(P.depthTexture&&!M.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");se(M.__webglFramebuffer,P)}else if(H){M.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer[Q]),M.__webglDepthbuffer[Q]===void 0)M.__webglDepthbuffer[Q]=n.createRenderbuffer(),le(M.__webglDepthbuffer[Q],P,!1);else{const ie=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ee=M.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,ee),n.framebufferRenderbuffer(n.FRAMEBUFFER,ie,n.RENDERBUFFER,ee)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=n.createRenderbuffer(),le(M.__webglDepthbuffer,P,!1);else{const Q=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=M.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ie),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ie)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function Le(P,M,H){const Q=i.get(P);M!==void 0&&ne(Q.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&be(P)}function Fe(P){const M=P.texture,H=i.get(P),Q=i.get(M);P.addEventListener("dispose",T);const ie=P.textures,ee=P.isWebGLCubeRenderTarget===!0,Ne=ie.length>1;if(Ne||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=M.version,o.memory.textures++),ee){H.__webglFramebuffer=[];for(let ge=0;ge<6;ge++)if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer[ge]=[];for(let we=0;we<M.mipmaps.length;we++)H.__webglFramebuffer[ge][we]=n.createFramebuffer()}else H.__webglFramebuffer[ge]=n.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){H.__webglFramebuffer=[];for(let ge=0;ge<M.mipmaps.length;ge++)H.__webglFramebuffer[ge]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(Ne)for(let ge=0,we=ie.length;ge<we;ge++){const Ke=i.get(ie[ge]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&oe(P)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ge=0;ge<ie.length;ge++){const we=ie[ge];H.__webglColorRenderbuffer[ge]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[ge]);const Ke=s.convert(we.format,we.colorSpace),ce=s.convert(we.type),Ee=_(we.internalFormat,Ke,ce,we.colorSpace,P.isXRRenderTarget===!0),Be=he(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Be,Ee,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ge,n.RENDERBUFFER,H.__webglColorRenderbuffer[ge])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),le(H.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ee){t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),Z(n.TEXTURE_CUBE_MAP,M);for(let ge=0;ge<6;ge++)if(M.mipmaps&&M.mipmaps.length>0)for(let we=0;we<M.mipmaps.length;we++)ne(H.__webglFramebuffer[ge][we],P,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,we);else ne(H.__webglFramebuffer[ge],P,M,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0);v(M)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ne){for(let ge=0,we=ie.length;ge<we;ge++){const Ke=ie[ge],ce=i.get(Ke);t.bindTexture(n.TEXTURE_2D,ce.__webglTexture),Z(n.TEXTURE_2D,Ke),ne(H.__webglFramebuffer,P,Ke,n.COLOR_ATTACHMENT0+ge,n.TEXTURE_2D,0),v(Ke)&&d(n.TEXTURE_2D)}t.unbindTexture()}else{let ge=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ge=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ge,Q.__webglTexture),Z(ge,M),M.mipmaps&&M.mipmaps.length>0)for(let we=0;we<M.mipmaps.length;we++)ne(H.__webglFramebuffer[we],P,M,n.COLOR_ATTACHMENT0,ge,we);else ne(H.__webglFramebuffer,P,M,n.COLOR_ATTACHMENT0,ge,0);v(M)&&d(ge),t.unbindTexture()}P.depthBuffer&&be(P)}function Ge(P){const M=P.textures;for(let H=0,Q=M.length;H<Q;H++){const ie=M[H];if(v(ie)){const ee=P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,Ne=i.get(ie).__webglTexture;t.bindTexture(ee,Ne),d(ee),t.unbindTexture()}}}const te=[],R=[];function ue(P){if(P.samples>0){if(oe(P)===!1){const M=P.textures,H=P.width,Q=P.height;let ie=n.COLOR_BUFFER_BIT;const ee=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Ne=i.get(P),ge=M.length>1;if(ge)for(let we=0;we<M.length;we++)t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+we,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+we,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let we=0;we<M.length;we++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ie|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ie|=n.STENCIL_BUFFER_BIT)),ge){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Ne.__webglColorRenderbuffer[we]);const Ke=i.get(M[we]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ke,0)}n.blitFramebuffer(0,0,H,Q,0,0,H,Q,ie,n.NEAREST),l===!0&&(te.length=0,R.length=0,te.push(n.COLOR_ATTACHMENT0+we),P.depthBuffer&&P.resolveDepthBuffer===!1&&(te.push(ee),R.push(ee),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,R)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,te))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),ge)for(let we=0;we<M.length;we++){t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+we,n.RENDERBUFFER,Ne.__webglColorRenderbuffer[we]);const Ke=i.get(M[we]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Ne.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+we,n.TEXTURE_2D,Ke,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const M=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[M])}}}function he(P){return Math.min(r.maxSamples,P.samples)}function oe(P){const M=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function fe(P){const M=o.render.frame;h.get(P)!==M&&(h.set(P,M),P.update())}function Ie(P,M){const H=P.colorSpace,Q=P.format,ie=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||H!==lr&&H!==Hi&&(it.getTransfer(H)===ft?(Q!==jn||ie!==bi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),M}function _e(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=w,this.setTexture2D=Y,this.setTexture2DArray=j,this.setTexture3D=k,this.setTextureCube=K,this.rebindTextures=Le,this.setupRenderTarget=Fe,this.updateRenderTargetMipmap=Ge,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=be,this.setupFrameBufferTexture=ne,this.useMultisampledRTT=oe}function zE(n,e){function t(i,r=Hi){let s;const o=it.getTransfer(r);if(i===bi)return n.UNSIGNED_BYTE;if(i===ff)return n.UNSIGNED_SHORT_4_4_4_4;if(i===pf)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Cv)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Av)return n.BYTE;if(i===bv)return n.SHORT;if(i===Wo)return n.UNSIGNED_SHORT;if(i===df)return n.INT;if(i===Ur)return n.UNSIGNED_INT;if(i===xi)return n.FLOAT;if(i===ea)return n.HALF_FLOAT;if(i===Pv)return n.ALPHA;if(i===Rv)return n.RGB;if(i===jn)return n.RGBA;if(i===Lv)return n.LUMINANCE;if(i===Nv)return n.LUMINANCE_ALPHA;if(i===Es)return n.DEPTH_COMPONENT;if(i===Fs)return n.DEPTH_STENCIL;if(i===Dv)return n.RED;if(i===mf)return n.RED_INTEGER;if(i===Iv)return n.RG;if(i===gf)return n.RG_INTEGER;if(i===vf)return n.RGBA_INTEGER;if(i===ul||i===hl||i===dl||i===fl)if(o===ft)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ul)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===hl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===dl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===fl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ul)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===hl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===dl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===fl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===kh||i===Bh||i===Hh||i===Gh)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===kh)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Bh)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Hh)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Gh)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Vh||i===Wh||i===Xh)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Vh||i===Wh)return o===ft?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Xh)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===jh||i===Yh||i===Zh||i===Kh||i===$h||i===qh||i===Jh||i===Qh||i===ed||i===td||i===nd||i===id||i===rd||i===sd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===jh)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Yh)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Zh)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Kh)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$h)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===qh)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Jh)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Qh)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ed)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===td)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===nd)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===id)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===rd)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===sd)return o===ft?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===pl||i===od||i===ad)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===pl)return o===ft?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===od)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ad)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Uv||i===ld||i===cd||i===ud)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===pl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===ld)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===cd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ud)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===zs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class FE extends xn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class lt extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const OE={type:"move"};class Tu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new lt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new lt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new lt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const x of e.hand.values()){const v=t.getJointPose(x,i),d=this._getHandJoint(c,x);v!==null&&(d.matrix.fromArray(v.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=v.radius),d.visible=v!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),p=.02,m=.005;c.inputState.pinching&&f>p+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(OE)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new lt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const kE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,BE=`
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

}`;class HE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new tn,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new rr({vertexShader:kE,fragmentShader:BE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new We(new Wi(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class GE extends Gs{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,h=null,u=null,f=null,p=null,m=null;const x=new HE,v=t.getContextAttributes();let d=null,_=null;const g=[],S=[],A=new pe;let T=null;const E=new xn;E.layers.enable(1),E.viewport=new ot;const C=new xn;C.layers.enable(2),C.viewport=new ot;const z=[E,C],y=new FE;y.layers.enable(1),y.layers.enable(2);let w=null,O=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let ne=g[W];return ne===void 0&&(ne=new Tu,g[W]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(W){let ne=g[W];return ne===void 0&&(ne=new Tu,g[W]=ne),ne.getGripSpace()},this.getHand=function(W){let ne=g[W];return ne===void 0&&(ne=new Tu,g[W]=ne),ne.getHandSpace()};function G(W){const ne=S.indexOf(W.inputSource);if(ne===-1)return;const le=g[ne];le!==void 0&&(le.update(W.inputSource,W.frame,c||o),le.dispatchEvent({type:W.type,data:W.inputSource}))}function Y(){r.removeEventListener("select",G),r.removeEventListener("selectstart",G),r.removeEventListener("selectend",G),r.removeEventListener("squeeze",G),r.removeEventListener("squeezestart",G),r.removeEventListener("squeezeend",G),r.removeEventListener("end",Y),r.removeEventListener("inputsourceschange",j);for(let W=0;W<g.length;W++){const ne=S[W];ne!==null&&(S[W]=null,g[W].disconnect(ne))}w=null,O=null,x.reset(),e.setRenderTarget(d),p=null,f=null,u=null,r=null,_=null,Ae.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(A.width,A.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){s=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){a=W,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return u},this.getFrame=function(){return m},this.getSession=function(){return r},this.setSession=async function(W){if(r=W,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",G),r.addEventListener("selectstart",G),r.addEventListener("selectend",G),r.addEventListener("squeeze",G),r.addEventListener("squeezestart",G),r.addEventListener("squeezeend",G),r.addEventListener("end",Y),r.addEventListener("inputsourceschange",j),v.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(A),r.renderState.layers===void 0){const ne={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,ne),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),_=new zr(p.framebufferWidth,p.framebufferHeight,{format:jn,type:bi,colorSpace:e.outputColorSpace,stencilBuffer:v.stencil})}else{let ne=null,le=null,se=null;v.depth&&(se=v.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ne=v.stencil?Fs:Es,le=v.stencil?zs:Ur);const be={colorFormat:t.RGBA8,depthFormat:se,scaleFactor:s};u=new XRWebGLBinding(r,t),f=u.createProjectionLayer(be),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),_=new zr(f.textureWidth,f.textureHeight,{format:jn,type:bi,depthTexture:new qv(f.textureWidth,f.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:v.stencil,colorSpace:e.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ae.setContext(r),Ae.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function j(W){for(let ne=0;ne<W.removed.length;ne++){const le=W.removed[ne],se=S.indexOf(le);se>=0&&(S[se]=null,g[se].disconnect(le))}for(let ne=0;ne<W.added.length;ne++){const le=W.added[ne];let se=S.indexOf(le);if(se===-1){for(let Le=0;Le<g.length;Le++)if(Le>=S.length){S.push(le),se=Le;break}else if(S[Le]===null){S[Le]=le,se=Le;break}if(se===-1)break}const be=g[se];be&&be.connect(le)}}const k=new D,K=new D;function N(W,ne,le){k.setFromMatrixPosition(ne.matrixWorld),K.setFromMatrixPosition(le.matrixWorld);const se=k.distanceTo(K),be=ne.projectionMatrix.elements,Le=le.projectionMatrix.elements,Fe=be[14]/(be[10]-1),Ge=be[14]/(be[10]+1),te=(be[9]+1)/be[5],R=(be[9]-1)/be[5],ue=(be[8]-1)/be[0],he=(Le[8]+1)/Le[0],oe=Fe*ue,fe=Fe*he,Ie=se/(-ue+he),_e=Ie*-ue;if(ne.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(_e),W.translateZ(Ie),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),be[10]===-1)W.projectionMatrix.copy(ne.projectionMatrix),W.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const P=Fe+Ie,M=Ge+Ie,H=oe-_e,Q=fe+(se-_e),ie=te*Ge/M*P,ee=R*Ge/M*P;W.projectionMatrix.makePerspective(H,Q,ie,ee,P,M),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function $(W,ne){ne===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(ne.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(r===null)return;let ne=W.near,le=W.far;x.texture!==null&&(x.depthNear>0&&(ne=x.depthNear),x.depthFar>0&&(le=x.depthFar)),y.near=C.near=E.near=ne,y.far=C.far=E.far=le,(w!==y.near||O!==y.far)&&(r.updateRenderState({depthNear:y.near,depthFar:y.far}),w=y.near,O=y.far);const se=W.parent,be=y.cameras;$(y,se);for(let Le=0;Le<be.length;Le++)$(be[Le],se);be.length===2?N(y,E,C):y.projectionMatrix.copy(E.projectionMatrix),J(W,y,se)};function J(W,ne,le){le===null?W.matrix.copy(ne.matrixWorld):(W.matrix.copy(le.matrixWorld),W.matrix.invert(),W.matrix.multiply(ne.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(ne.projectionMatrix),W.projectionMatrixInverse.copy(ne.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=hd*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(W){l=W,f!==null&&(f.fixedFoveation=W),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=W)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(y)};let Z=null;function me(W,ne){if(h=ne.getViewerPose(c||o),m=ne,h!==null){const le=h.views;p!==null&&(e.setRenderTargetFramebuffer(_,p.framebuffer),e.setRenderTarget(_));let se=!1;le.length!==y.cameras.length&&(y.cameras.length=0,se=!0);for(let Le=0;Le<le.length;Le++){const Fe=le[Le];let Ge=null;if(p!==null)Ge=p.getViewport(Fe);else{const R=u.getViewSubImage(f,Fe);Ge=R.viewport,Le===0&&(e.setRenderTargetTextures(_,R.colorTexture,f.ignoreDepthValues?void 0:R.depthStencilTexture),e.setRenderTarget(_))}let te=z[Le];te===void 0&&(te=new xn,te.layers.enable(Le),te.viewport=new ot,z[Le]=te),te.matrix.fromArray(Fe.transform.matrix),te.matrix.decompose(te.position,te.quaternion,te.scale),te.projectionMatrix.fromArray(Fe.projectionMatrix),te.projectionMatrixInverse.copy(te.projectionMatrix).invert(),te.viewport.set(Ge.x,Ge.y,Ge.width,Ge.height),Le===0&&(y.matrix.copy(te.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),se===!0&&y.cameras.push(te)}const be=r.enabledFeatures;if(be&&be.includes("depth-sensing")){const Le=u.getDepthInformation(le[0]);Le&&Le.isValid&&Le.texture&&x.init(e,Le,r.renderState)}}for(let le=0;le<g.length;le++){const se=S[le],be=g[le];se!==null&&be!==void 0&&be.update(se,ne,c||o)}Z&&Z(W,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),m=null}const Ae=new Kv;Ae.setAnimationLoop(me),this.setAnimationLoop=function(W){Z=W},this.dispose=function(){}}}const mr=new oi,VE=new mt;function WE(n,e){function t(v,d){v.matrixAutoUpdate===!0&&v.updateMatrix(),d.value.copy(v.matrix)}function i(v,d){d.color.getRGB(v.fogColor.value,jv(n)),d.isFog?(v.fogNear.value=d.near,v.fogFar.value=d.far):d.isFogExp2&&(v.fogDensity.value=d.density)}function r(v,d,_,g,S){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(v,d):d.isMeshToonMaterial?(s(v,d),u(v,d)):d.isMeshPhongMaterial?(s(v,d),h(v,d)):d.isMeshStandardMaterial?(s(v,d),f(v,d),d.isMeshPhysicalMaterial&&p(v,d,S)):d.isMeshMatcapMaterial?(s(v,d),m(v,d)):d.isMeshDepthMaterial?s(v,d):d.isMeshDistanceMaterial?(s(v,d),x(v,d)):d.isMeshNormalMaterial?s(v,d):d.isLineBasicMaterial?(o(v,d),d.isLineDashedMaterial&&a(v,d)):d.isPointsMaterial?l(v,d,_,g):d.isSpriteMaterial?c(v,d):d.isShadowMaterial?(v.color.value.copy(d.color),v.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(v,d){v.opacity.value=d.opacity,d.color&&v.diffuse.value.copy(d.color),d.emissive&&v.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(v.map.value=d.map,t(d.map,v.mapTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,t(d.alphaMap,v.alphaMapTransform)),d.bumpMap&&(v.bumpMap.value=d.bumpMap,t(d.bumpMap,v.bumpMapTransform),v.bumpScale.value=d.bumpScale,d.side===fn&&(v.bumpScale.value*=-1)),d.normalMap&&(v.normalMap.value=d.normalMap,t(d.normalMap,v.normalMapTransform),v.normalScale.value.copy(d.normalScale),d.side===fn&&v.normalScale.value.negate()),d.displacementMap&&(v.displacementMap.value=d.displacementMap,t(d.displacementMap,v.displacementMapTransform),v.displacementScale.value=d.displacementScale,v.displacementBias.value=d.displacementBias),d.emissiveMap&&(v.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,v.emissiveMapTransform)),d.specularMap&&(v.specularMap.value=d.specularMap,t(d.specularMap,v.specularMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest);const _=e.get(d),g=_.envMap,S=_.envMapRotation;g&&(v.envMap.value=g,mr.copy(S),mr.x*=-1,mr.y*=-1,mr.z*=-1,g.isCubeTexture&&g.isRenderTargetTexture===!1&&(mr.y*=-1,mr.z*=-1),v.envMapRotation.value.setFromMatrix4(VE.makeRotationFromEuler(mr)),v.flipEnvMap.value=g.isCubeTexture&&g.isRenderTargetTexture===!1?-1:1,v.reflectivity.value=d.reflectivity,v.ior.value=d.ior,v.refractionRatio.value=d.refractionRatio),d.lightMap&&(v.lightMap.value=d.lightMap,v.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,v.lightMapTransform)),d.aoMap&&(v.aoMap.value=d.aoMap,v.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,v.aoMapTransform))}function o(v,d){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,d.map&&(v.map.value=d.map,t(d.map,v.mapTransform))}function a(v,d){v.dashSize.value=d.dashSize,v.totalSize.value=d.dashSize+d.gapSize,v.scale.value=d.scale}function l(v,d,_,g){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,v.size.value=d.size*_,v.scale.value=g*.5,d.map&&(v.map.value=d.map,t(d.map,v.uvTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,t(d.alphaMap,v.alphaMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest)}function c(v,d){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,v.rotation.value=d.rotation,d.map&&(v.map.value=d.map,t(d.map,v.mapTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,t(d.alphaMap,v.alphaMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest)}function h(v,d){v.specular.value.copy(d.specular),v.shininess.value=Math.max(d.shininess,1e-4)}function u(v,d){d.gradientMap&&(v.gradientMap.value=d.gradientMap)}function f(v,d){v.metalness.value=d.metalness,d.metalnessMap&&(v.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,v.metalnessMapTransform)),v.roughness.value=d.roughness,d.roughnessMap&&(v.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,v.roughnessMapTransform)),d.envMap&&(v.envMapIntensity.value=d.envMapIntensity)}function p(v,d,_){v.ior.value=d.ior,d.sheen>0&&(v.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),v.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(v.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,v.sheenColorMapTransform)),d.sheenRoughnessMap&&(v.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,v.sheenRoughnessMapTransform))),d.clearcoat>0&&(v.clearcoat.value=d.clearcoat,v.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(v.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,v.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(v.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===fn&&v.clearcoatNormalScale.value.negate())),d.dispersion>0&&(v.dispersion.value=d.dispersion),d.iridescence>0&&(v.iridescence.value=d.iridescence,v.iridescenceIOR.value=d.iridescenceIOR,v.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],v.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(v.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,v.iridescenceMapTransform)),d.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),d.transmission>0&&(v.transmission.value=d.transmission,v.transmissionSamplerMap.value=_.texture,v.transmissionSamplerSize.value.set(_.width,_.height),d.transmissionMap&&(v.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,v.transmissionMapTransform)),v.thickness.value=d.thickness,d.thicknessMap&&(v.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=d.attenuationDistance,v.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(v.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(v.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=d.specularIntensity,v.specularColor.value.copy(d.specularColor),d.specularColorMap&&(v.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,v.specularColorMapTransform)),d.specularIntensityMap&&(v.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,v.specularIntensityMapTransform))}function m(v,d){d.matcap&&(v.matcap.value=d.matcap)}function x(v,d){const _=e.get(d).light;v.referencePosition.value.setFromMatrixPosition(_.matrixWorld),v.nearDistance.value=_.shadow.camera.near,v.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function XE(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,g){const S=g.program;i.uniformBlockBinding(_,S)}function c(_,g){let S=r[_.id];S===void 0&&(m(_),S=h(_),r[_.id]=S,_.addEventListener("dispose",v));const A=g.program;i.updateUBOMapping(_,A);const T=e.render.frame;s[_.id]!==T&&(f(_),s[_.id]=T)}function h(_){const g=u();_.__bindingPointIndex=g;const S=n.createBuffer(),A=_.__size,T=_.usage;return n.bindBuffer(n.UNIFORM_BUFFER,S),n.bufferData(n.UNIFORM_BUFFER,A,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,g,S),S}function u(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(_){const g=r[_.id],S=_.uniforms,A=_.__cache;n.bindBuffer(n.UNIFORM_BUFFER,g);for(let T=0,E=S.length;T<E;T++){const C=Array.isArray(S[T])?S[T]:[S[T]];for(let z=0,y=C.length;z<y;z++){const w=C[z];if(p(w,T,z,A)===!0){const O=w.__offset,G=Array.isArray(w.value)?w.value:[w.value];let Y=0;for(let j=0;j<G.length;j++){const k=G[j],K=x(k);typeof k=="number"||typeof k=="boolean"?(w.__data[0]=k,n.bufferSubData(n.UNIFORM_BUFFER,O+Y,w.__data)):k.isMatrix3?(w.__data[0]=k.elements[0],w.__data[1]=k.elements[1],w.__data[2]=k.elements[2],w.__data[3]=0,w.__data[4]=k.elements[3],w.__data[5]=k.elements[4],w.__data[6]=k.elements[5],w.__data[7]=0,w.__data[8]=k.elements[6],w.__data[9]=k.elements[7],w.__data[10]=k.elements[8],w.__data[11]=0):(k.toArray(w.__data,Y),Y+=K.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,O,w.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(_,g,S,A){const T=_.value,E=g+"_"+S;if(A[E]===void 0)return typeof T=="number"||typeof T=="boolean"?A[E]=T:A[E]=T.clone(),!0;{const C=A[E];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return A[E]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function m(_){const g=_.uniforms;let S=0;const A=16;for(let E=0,C=g.length;E<C;E++){const z=Array.isArray(g[E])?g[E]:[g[E]];for(let y=0,w=z.length;y<w;y++){const O=z[y],G=Array.isArray(O.value)?O.value:[O.value];for(let Y=0,j=G.length;Y<j;Y++){const k=G[Y],K=x(k),N=S%A,$=N%K.boundary,J=N+$;S+=$,J!==0&&A-J<K.storage&&(S+=A-J),O.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=S,S+=K.storage}}}const T=S%A;return T>0&&(S+=A-T),_.__size=S,_.__cache={},this}function x(_){const g={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(g.boundary=4,g.storage=4):_.isVector2?(g.boundary=8,g.storage=8):_.isVector3||_.isColor?(g.boundary=16,g.storage=12):_.isVector4?(g.boundary=16,g.storage=16):_.isMatrix3?(g.boundary=48,g.storage=48):_.isMatrix4?(g.boundary=64,g.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),g}function v(_){const g=_.target;g.removeEventListener("dispose",v);const S=o.indexOf(g.__bindingPointIndex);o.splice(S,1),n.deleteBuffer(r[g.id]),delete r[g.id],delete s[g.id]}function d(){for(const _ in r)n.deleteBuffer(r[_]);o=[],r={},s={}}return{bind:l,update:c,dispose:d}}class jE{constructor(e={}){const{canvas:t=DS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=e;this.isWebGLRenderer=!0;let f;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=i.getContextAttributes().alpha}else f=o;const p=new Uint32Array(4),m=new Int32Array(4);let x=null,v=null;const d=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Et,this.toneMapping=er,this.toneMappingExposure=1;const g=this;let S=!1,A=0,T=0,E=null,C=-1,z=null;const y=new ot,w=new ot;let O=null;const G=new Ze(0);let Y=0,j=t.width,k=t.height,K=1,N=null,$=null;const J=new ot(0,0,j,k),Z=new ot(0,0,j,k);let me=!1;const Ae=new xf;let W=!1,ne=!1;const le=new mt,se=new mt,be=new D,Le=new ot,Fe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ge=!1;function te(){return E===null?K:1}let R=i;function ue(b,U){return t.getContext(b,U)}try{const b={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${hf}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",xe,!1),t.addEventListener("webglcontextcreationerror",Me,!1),R===null){const U="webgl2";if(R=ue(U,b),R===null)throw ue(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let he,oe,fe,Ie,_e,P,M,H,Q,ie,ee,Ne,ge,we,Ke,ce,Ee,Be,He,Ce,$e,Ve,ct,I;function Se(){he=new qw(R),he.init(),Ve=new zE(R,he),oe=new Xw(R,he,e,Ve),fe=new DE(R),oe.reverseDepthBuffer&&fe.buffers.depth.setReversed(!0),Ie=new e2(R),_e=new _E,P=new UE(R,he,fe,_e,oe,Ve,Ie),M=new Yw(g),H=new $w(g),Q=new a1(R),ct=new Vw(R,Q),ie=new Jw(R,Q,Ie,ct),ee=new n2(R,ie,Q,Ie),He=new t2(R,oe,P),ce=new jw(_e),Ne=new vE(g,M,H,he,oe,ct,ce),ge=new WE(g,_e),we=new yE,Ke=new AE(he),Be=new Gw(g,M,H,fe,ee,f,l),Ee=new LE(g,ee,oe),I=new XE(R,Ie,oe,fe),Ce=new Ww(R,he,Ie),$e=new Qw(R,he,Ie),Ie.programs=Ne.programs,g.capabilities=oe,g.extensions=he,g.properties=_e,g.renderLists=we,g.shadowMap=Ee,g.state=fe,g.info=Ie}Se();const q=new GE(g,R);this.xr=q,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const b=he.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=he.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(b){b!==void 0&&(K=b,this.setSize(j,k,!1))},this.getSize=function(b){return b.set(j,k)},this.setSize=function(b,U,V=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}j=b,k=U,t.width=Math.floor(b*K),t.height=Math.floor(U*K),V===!0&&(t.style.width=b+"px",t.style.height=U+"px"),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(j*K,k*K).floor()},this.setDrawingBufferSize=function(b,U,V){j=b,k=U,K=V,t.width=Math.floor(b*V),t.height=Math.floor(U*V),this.setViewport(0,0,b,U)},this.getCurrentViewport=function(b){return b.copy(y)},this.getViewport=function(b){return b.copy(J)},this.setViewport=function(b,U,V,X){b.isVector4?J.set(b.x,b.y,b.z,b.w):J.set(b,U,V,X),fe.viewport(y.copy(J).multiplyScalar(K).round())},this.getScissor=function(b){return b.copy(Z)},this.setScissor=function(b,U,V,X){b.isVector4?Z.set(b.x,b.y,b.z,b.w):Z.set(b,U,V,X),fe.scissor(w.copy(Z).multiplyScalar(K).round())},this.getScissorTest=function(){return me},this.setScissorTest=function(b){fe.setScissorTest(me=b)},this.setOpaqueSort=function(b){N=b},this.setTransparentSort=function(b){$=b},this.getClearColor=function(b){return b.copy(Be.getClearColor())},this.setClearColor=function(){Be.setClearColor.apply(Be,arguments)},this.getClearAlpha=function(){return Be.getClearAlpha()},this.setClearAlpha=function(){Be.setClearAlpha.apply(Be,arguments)},this.clear=function(b=!0,U=!0,V=!0){let X=0;if(b){let F=!1;if(E!==null){const de=E.texture.format;F=de===vf||de===gf||de===mf}if(F){const de=E.texture.type,ye=de===bi||de===Ur||de===Wo||de===zs||de===ff||de===pf,Re=Be.getClearColor(),De=Be.getClearAlpha(),Oe=Re.r,ke=Re.g,Ue=Re.b;ye?(p[0]=Oe,p[1]=ke,p[2]=Ue,p[3]=De,R.clearBufferuiv(R.COLOR,0,p)):(m[0]=Oe,m[1]=ke,m[2]=Ue,m[3]=De,R.clearBufferiv(R.COLOR,0,m))}else X|=R.COLOR_BUFFER_BIT}U&&(X|=R.DEPTH_BUFFER_BIT,R.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),V&&(X|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",xe,!1),t.removeEventListener("webglcontextcreationerror",Me,!1),we.dispose(),Ke.dispose(),_e.dispose(),M.dispose(),H.dispose(),ee.dispose(),ct.dispose(),I.dispose(),Ne.dispose(),q.dispose(),q.removeEventListener("sessionstart",Nf),q.removeEventListener("sessionend",Df),cr.stop()};function re(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function xe(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const b=Ie.autoReset,U=Ee.enabled,V=Ee.autoUpdate,X=Ee.needsUpdate,F=Ee.type;Se(),Ie.autoReset=b,Ee.enabled=U,Ee.autoUpdate=V,Ee.needsUpdate=X,Ee.type=F}function Me(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function qe(b){const U=b.target;U.removeEventListener("dispose",qe),At(U)}function At(b){sn(b),_e.remove(b)}function sn(b){const U=_e.get(b).programs;U!==void 0&&(U.forEach(function(V){Ne.releaseProgram(V)}),b.isShaderMaterial&&Ne.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,V,X,F,de){U===null&&(U=Fe);const ye=F.isMesh&&F.matrixWorld.determinant()<0,Re=f_(b,U,V,X,F);fe.setMaterial(X,ye);let De=V.index,Oe=1;if(X.wireframe===!0){if(De=ie.getWireframeAttribute(V),De===void 0)return;Oe=2}const ke=V.drawRange,Ue=V.attributes.position;let rt=ke.start*Oe,ht=(ke.start+ke.count)*Oe;de!==null&&(rt=Math.max(rt,de.start*Oe),ht=Math.min(ht,(de.start+de.count)*Oe)),De!==null?(rt=Math.max(rt,0),ht=Math.min(ht,De.count)):Ue!=null&&(rt=Math.max(rt,0),ht=Math.min(ht,Ue.count));const St=ht-rt;if(St<0||St===1/0)return;ct.setup(F,X,Re,V,De);let pn,tt=Ce;if(De!==null&&(pn=Q.get(De),tt=$e,tt.setIndex(pn)),F.isMesh)X.wireframe===!0?(fe.setLineWidth(X.wireframeLinewidth*te()),tt.setMode(R.LINES)):tt.setMode(R.TRIANGLES);else if(F.isLine){let ze=X.linewidth;ze===void 0&&(ze=1),fe.setLineWidth(ze*te()),F.isLineSegments?tt.setMode(R.LINES):F.isLineLoop?tt.setMode(R.LINE_LOOP):tt.setMode(R.LINE_STRIP)}else F.isPoints?tt.setMode(R.POINTS):F.isSprite&&tt.setMode(R.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)tt.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(he.get("WEBGL_multi_draw"))tt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const ze=F._multiDrawStarts,kt=F._multiDrawCounts,nt=F._multiDrawCount,Un=De?Q.get(De).bytesPerElement:1,Hr=_e.get(X).currentProgram.getUniforms();for(let mn=0;mn<nt;mn++)Hr.setValue(R,"_gl_DrawID",mn),tt.render(ze[mn]/Un,kt[mn])}else if(F.isInstancedMesh)tt.renderInstances(rt,St,F.count);else if(V.isInstancedBufferGeometry){const ze=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,kt=Math.min(V.instanceCount,ze);tt.renderInstances(rt,St,kt)}else tt.render(rt,St)};function et(b,U,V){b.transparent===!0&&b.side===ni&&b.forceSinglePass===!1?(b.side=fn,b.needsUpdate=!0,ra(b,U,V),b.side=ir,b.needsUpdate=!0,ra(b,U,V),b.side=ni):ra(b,U,V)}this.compile=function(b,U,V=null){V===null&&(V=b),v=Ke.get(V),v.init(U),_.push(v),V.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(v.pushLight(F),F.castShadow&&v.pushShadow(F))}),b!==V&&b.traverseVisible(function(F){F.isLight&&F.layers.test(U.layers)&&(v.pushLight(F),F.castShadow&&v.pushShadow(F))}),v.setupLights();const X=new Set;return b.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const de=F.material;if(de)if(Array.isArray(de))for(let ye=0;ye<de.length;ye++){const Re=de[ye];et(Re,V,F),X.add(Re)}else et(de,V,F),X.add(de)}),_.pop(),v=null,X},this.compileAsync=function(b,U,V=null){const X=this.compile(b,U,V);return new Promise(F=>{function de(){if(X.forEach(function(ye){_e.get(ye).currentProgram.isReady()&&X.delete(ye)}),X.size===0){F(b);return}setTimeout(de,10)}he.get("KHR_parallel_shader_compile")!==null?de():setTimeout(de,10)})};let on=null;function li(b){on&&on(b)}function Nf(){cr.stop()}function Df(){cr.start()}const cr=new Kv;cr.setAnimationLoop(li),typeof self<"u"&&cr.setContext(self),this.setAnimationLoop=function(b){on=b,q.setAnimationLoop(b),b===null?cr.stop():cr.start()},q.addEventListener("sessionstart",Nf),q.addEventListener("sessionend",Df),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(U),U=q.getCamera()),b.isScene===!0&&b.onBeforeRender(g,b,U,E),v=Ke.get(b,_.length),v.init(U),_.push(v),se.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ae.setFromProjectionMatrix(se),ne=this.localClippingEnabled,W=ce.init(this.clippingPlanes,ne),x=we.get(b,d.length),x.init(),d.push(x),q.enabled===!0&&q.isPresenting===!0){const de=g.xr.getDepthSensingMesh();de!==null&&xc(de,U,-1/0,g.sortObjects)}xc(b,U,0,g.sortObjects),x.finish(),g.sortObjects===!0&&x.sort(N,$),Ge=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Ge&&Be.addToRenderList(x,b),this.info.render.frame++,W===!0&&ce.beginShadows();const V=v.state.shadowsArray;Ee.render(V,b,U),W===!0&&ce.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=x.opaque,F=x.transmissive;if(v.setupLights(),U.isArrayCamera){const de=U.cameras;if(F.length>0)for(let ye=0,Re=de.length;ye<Re;ye++){const De=de[ye];Uf(X,F,b,De)}Ge&&Be.render(b);for(let ye=0,Re=de.length;ye<Re;ye++){const De=de[ye];If(x,b,De,De.viewport)}}else F.length>0&&Uf(X,F,b,U),Ge&&Be.render(b),If(x,b,U);E!==null&&(P.updateMultisampleRenderTarget(E),P.updateRenderTargetMipmap(E)),b.isScene===!0&&b.onAfterRender(g,b,U),ct.resetDefaultState(),C=-1,z=null,_.pop(),_.length>0?(v=_[_.length-1],W===!0&&ce.setGlobalState(g.clippingPlanes,v.state.camera)):v=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function xc(b,U,V,X){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)V=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)v.pushLight(b),b.castShadow&&v.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Ae.intersectsSprite(b)){X&&Le.setFromMatrixPosition(b.matrixWorld).applyMatrix4(se);const ye=ee.update(b),Re=b.material;Re.visible&&x.push(b,ye,Re,V,Le.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Ae.intersectsObject(b))){const ye=ee.update(b),Re=b.material;if(X&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Le.copy(b.boundingSphere.center)):(ye.boundingSphere===null&&ye.computeBoundingSphere(),Le.copy(ye.boundingSphere.center)),Le.applyMatrix4(b.matrixWorld).applyMatrix4(se)),Array.isArray(Re)){const De=ye.groups;for(let Oe=0,ke=De.length;Oe<ke;Oe++){const Ue=De[Oe],rt=Re[Ue.materialIndex];rt&&rt.visible&&x.push(b,ye,rt,V,Le.z,Ue)}}else Re.visible&&x.push(b,ye,Re,V,Le.z,null)}}const de=b.children;for(let ye=0,Re=de.length;ye<Re;ye++)xc(de[ye],U,V,X)}function If(b,U,V,X){const F=b.opaque,de=b.transmissive,ye=b.transparent;v.setupLightsView(V),W===!0&&ce.setGlobalState(g.clippingPlanes,V),X&&fe.viewport(y.copy(X)),F.length>0&&ia(F,U,V),de.length>0&&ia(de,U,V),ye.length>0&&ia(ye,U,V),fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function Uf(b,U,V,X){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;v.state.transmissionRenderTarget[X.id]===void 0&&(v.state.transmissionRenderTarget[X.id]=new zr(1,1,{generateMipmaps:!0,type:he.has("EXT_color_buffer_half_float")||he.has("EXT_color_buffer_float")?ea:bi,minFilter:br,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:it.workingColorSpace}));const de=v.state.transmissionRenderTarget[X.id],ye=X.viewport||y;de.setSize(ye.z,ye.w);const Re=g.getRenderTarget();g.setRenderTarget(de),g.getClearColor(G),Y=g.getClearAlpha(),Y<1&&g.setClearColor(16777215,.5),g.clear(),Ge&&Be.render(V);const De=g.toneMapping;g.toneMapping=er;const Oe=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),v.setupLightsView(X),W===!0&&ce.setGlobalState(g.clippingPlanes,X),ia(b,V,X),P.updateMultisampleRenderTarget(de),P.updateRenderTargetMipmap(de),he.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let Ue=0,rt=U.length;Ue<rt;Ue++){const ht=U[Ue],St=ht.object,pn=ht.geometry,tt=ht.material,ze=ht.group;if(tt.side===ni&&St.layers.test(X.layers)){const kt=tt.side;tt.side=fn,tt.needsUpdate=!0,zf(St,V,X,pn,tt,ze),tt.side=kt,tt.needsUpdate=!0,ke=!0}}ke===!0&&(P.updateMultisampleRenderTarget(de),P.updateRenderTargetMipmap(de))}g.setRenderTarget(Re),g.setClearColor(G,Y),Oe!==void 0&&(X.viewport=Oe),g.toneMapping=De}function ia(b,U,V){const X=U.isScene===!0?U.overrideMaterial:null;for(let F=0,de=b.length;F<de;F++){const ye=b[F],Re=ye.object,De=ye.geometry,Oe=X===null?ye.material:X,ke=ye.group;Re.layers.test(V.layers)&&zf(Re,U,V,De,Oe,ke)}}function zf(b,U,V,X,F,de){b.onBeforeRender(g,U,V,X,F,de),b.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),F.onBeforeRender(g,U,V,X,b,de),F.transparent===!0&&F.side===ni&&F.forceSinglePass===!1?(F.side=fn,F.needsUpdate=!0,g.renderBufferDirect(V,U,X,F,b,de),F.side=ir,F.needsUpdate=!0,g.renderBufferDirect(V,U,X,F,b,de),F.side=ni):g.renderBufferDirect(V,U,X,F,b,de),b.onAfterRender(g,U,V,X,F,de)}function ra(b,U,V){U.isScene!==!0&&(U=Fe);const X=_e.get(b),F=v.state.lights,de=v.state.shadowsArray,ye=F.state.version,Re=Ne.getParameters(b,F.state,de,U,V),De=Ne.getProgramCacheKey(Re);let Oe=X.programs;X.environment=b.isMeshStandardMaterial?U.environment:null,X.fog=U.fog,X.envMap=(b.isMeshStandardMaterial?H:M).get(b.envMap||X.environment),X.envMapRotation=X.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Oe===void 0&&(b.addEventListener("dispose",qe),Oe=new Map,X.programs=Oe);let ke=Oe.get(De);if(ke!==void 0){if(X.currentProgram===ke&&X.lightsStateVersion===ye)return Of(b,Re),ke}else Re.uniforms=Ne.getUniforms(b),b.onBeforeCompile(Re,g),ke=Ne.acquireProgram(Re,De),Oe.set(De,ke),X.uniforms=Re.uniforms;const Ue=X.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ue.clippingPlanes=ce.uniform),Of(b,Re),X.needsLights=m_(b),X.lightsStateVersion=ye,X.needsLights&&(Ue.ambientLightColor.value=F.state.ambient,Ue.lightProbe.value=F.state.probe,Ue.directionalLights.value=F.state.directional,Ue.directionalLightShadows.value=F.state.directionalShadow,Ue.spotLights.value=F.state.spot,Ue.spotLightShadows.value=F.state.spotShadow,Ue.rectAreaLights.value=F.state.rectArea,Ue.ltc_1.value=F.state.rectAreaLTC1,Ue.ltc_2.value=F.state.rectAreaLTC2,Ue.pointLights.value=F.state.point,Ue.pointLightShadows.value=F.state.pointShadow,Ue.hemisphereLights.value=F.state.hemi,Ue.directionalShadowMap.value=F.state.directionalShadowMap,Ue.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Ue.spotShadowMap.value=F.state.spotShadowMap,Ue.spotLightMatrix.value=F.state.spotLightMatrix,Ue.spotLightMap.value=F.state.spotLightMap,Ue.pointShadowMap.value=F.state.pointShadowMap,Ue.pointShadowMatrix.value=F.state.pointShadowMatrix),X.currentProgram=ke,X.uniformsList=null,ke}function Ff(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=gl.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Of(b,U){const V=_e.get(b);V.outputColorSpace=U.outputColorSpace,V.batching=U.batching,V.batchingColor=U.batchingColor,V.instancing=U.instancing,V.instancingColor=U.instancingColor,V.instancingMorph=U.instancingMorph,V.skinning=U.skinning,V.morphTargets=U.morphTargets,V.morphNormals=U.morphNormals,V.morphColors=U.morphColors,V.morphTargetsCount=U.morphTargetsCount,V.numClippingPlanes=U.numClippingPlanes,V.numIntersection=U.numClipIntersection,V.vertexAlphas=U.vertexAlphas,V.vertexTangents=U.vertexTangents,V.toneMapping=U.toneMapping}function f_(b,U,V,X,F){U.isScene!==!0&&(U=Fe),P.resetTextureUnits();const de=U.fog,ye=X.isMeshStandardMaterial?U.environment:null,Re=E===null?g.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:lr,De=(X.isMeshStandardMaterial?H:M).get(X.envMap||ye),Oe=X.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,ke=!!V.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Ue=!!V.morphAttributes.position,rt=!!V.morphAttributes.normal,ht=!!V.morphAttributes.color;let St=er;X.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(St=g.toneMapping);const pn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,tt=pn!==void 0?pn.length:0,ze=_e.get(X),kt=v.state.lights;if(W===!0&&(ne===!0||b!==z)){const Tn=b===z&&X.id===C;ce.setState(X,b,Tn)}let nt=!1;X.version===ze.__version?(ze.needsLights&&ze.lightsStateVersion!==kt.state.version||ze.outputColorSpace!==Re||F.isBatchedMesh&&ze.batching===!1||!F.isBatchedMesh&&ze.batching===!0||F.isBatchedMesh&&ze.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&ze.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&ze.instancing===!1||!F.isInstancedMesh&&ze.instancing===!0||F.isSkinnedMesh&&ze.skinning===!1||!F.isSkinnedMesh&&ze.skinning===!0||F.isInstancedMesh&&ze.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&ze.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&ze.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&ze.instancingMorph===!1&&F.morphTexture!==null||ze.envMap!==De||X.fog===!0&&ze.fog!==de||ze.numClippingPlanes!==void 0&&(ze.numClippingPlanes!==ce.numPlanes||ze.numIntersection!==ce.numIntersection)||ze.vertexAlphas!==Oe||ze.vertexTangents!==ke||ze.morphTargets!==Ue||ze.morphNormals!==rt||ze.morphColors!==ht||ze.toneMapping!==St||ze.morphTargetsCount!==tt)&&(nt=!0):(nt=!0,ze.__version=X.version);let Un=ze.currentProgram;nt===!0&&(Un=ra(X,U,F));let Hr=!1,mn=!1,yc=!1;const wt=Un.getUniforms(),Pi=ze.uniforms;if(fe.useProgram(Un.program)&&(Hr=!0,mn=!0,yc=!0),X.id!==C&&(C=X.id,mn=!0),Hr||z!==b){oe.reverseDepthBuffer?(le.copy(b.projectionMatrix),US(le),zS(le),wt.setValue(R,"projectionMatrix",le)):wt.setValue(R,"projectionMatrix",b.projectionMatrix),wt.setValue(R,"viewMatrix",b.matrixWorldInverse);const Tn=wt.map.cameraPosition;Tn!==void 0&&Tn.setValue(R,be.setFromMatrixPosition(b.matrixWorld)),oe.logarithmicDepthBuffer&&wt.setValue(R,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&wt.setValue(R,"isOrthographic",b.isOrthographicCamera===!0),z!==b&&(z=b,mn=!0,yc=!0)}if(F.isSkinnedMesh){wt.setOptional(R,F,"bindMatrix"),wt.setOptional(R,F,"bindMatrixInverse");const Tn=F.skeleton;Tn&&(Tn.boneTexture===null&&Tn.computeBoneTexture(),wt.setValue(R,"boneTexture",Tn.boneTexture,P))}F.isBatchedMesh&&(wt.setOptional(R,F,"batchingTexture"),wt.setValue(R,"batchingTexture",F._matricesTexture,P),wt.setOptional(R,F,"batchingIdTexture"),wt.setValue(R,"batchingIdTexture",F._indirectTexture,P),wt.setOptional(R,F,"batchingColorTexture"),F._colorsTexture!==null&&wt.setValue(R,"batchingColorTexture",F._colorsTexture,P));const Sc=V.morphAttributes;if((Sc.position!==void 0||Sc.normal!==void 0||Sc.color!==void 0)&&He.update(F,V,Un),(mn||ze.receiveShadow!==F.receiveShadow)&&(ze.receiveShadow=F.receiveShadow,wt.setValue(R,"receiveShadow",F.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Pi.envMap.value=De,Pi.flipEnvMap.value=De.isCubeTexture&&De.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&U.environment!==null&&(Pi.envMapIntensity.value=U.environmentIntensity),mn&&(wt.setValue(R,"toneMappingExposure",g.toneMappingExposure),ze.needsLights&&p_(Pi,yc),de&&X.fog===!0&&ge.refreshFogUniforms(Pi,de),ge.refreshMaterialUniforms(Pi,X,K,k,v.state.transmissionRenderTarget[b.id]),gl.upload(R,Ff(ze),Pi,P)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(gl.upload(R,Ff(ze),Pi,P),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&wt.setValue(R,"center",F.center),wt.setValue(R,"modelViewMatrix",F.modelViewMatrix),wt.setValue(R,"normalMatrix",F.normalMatrix),wt.setValue(R,"modelMatrix",F.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const Tn=X.uniformsGroups;for(let Mc=0,g_=Tn.length;Mc<g_;Mc++){const kf=Tn[Mc];I.update(kf,Un),I.bind(kf,Un)}}return Un}function p_(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function m_(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(b,U,V){_e.get(b.texture).__webglTexture=U,_e.get(b.depthTexture).__webglTexture=V;const X=_e.get(b);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=V===void 0,X.__autoAllocateDepthBuffer||he.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,U){const V=_e.get(b);V.__webglFramebuffer=U,V.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,V=0){E=b,A=U,T=V;let X=!0,F=null,de=!1,ye=!1;if(b){const De=_e.get(b);if(De.__useDefaultFramebuffer!==void 0)fe.bindFramebuffer(R.FRAMEBUFFER,null),X=!1;else if(De.__webglFramebuffer===void 0)P.setupRenderTarget(b);else if(De.__hasExternalTextures)P.rebindTextures(b,_e.get(b.texture).__webglTexture,_e.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Ue=b.depthTexture;if(De.__boundDepthTexture!==Ue){if(Ue!==null&&_e.has(Ue)&&(b.width!==Ue.image.width||b.height!==Ue.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");P.setupDepthRenderbuffer(b)}}const Oe=b.texture;(Oe.isData3DTexture||Oe.isDataArrayTexture||Oe.isCompressedArrayTexture)&&(ye=!0);const ke=_e.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ke[U])?F=ke[U][V]:F=ke[U],de=!0):b.samples>0&&P.useMultisampledRTT(b)===!1?F=_e.get(b).__webglMultisampledFramebuffer:Array.isArray(ke)?F=ke[V]:F=ke,y.copy(b.viewport),w.copy(b.scissor),O=b.scissorTest}else y.copy(J).multiplyScalar(K).floor(),w.copy(Z).multiplyScalar(K).floor(),O=me;if(fe.bindFramebuffer(R.FRAMEBUFFER,F)&&X&&fe.drawBuffers(b,F),fe.viewport(y),fe.scissor(w),fe.setScissorTest(O),de){const De=_e.get(b.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+U,De.__webglTexture,V)}else if(ye){const De=_e.get(b.texture),Oe=U||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,De.__webglTexture,V||0,Oe)}C=-1},this.readRenderTargetPixels=function(b,U,V,X,F,de,ye){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Re=_e.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ye!==void 0&&(Re=Re[ye]),Re){fe.bindFramebuffer(R.FRAMEBUFFER,Re);try{const De=b.texture,Oe=De.format,ke=De.type;if(!oe.textureFormatReadable(Oe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!oe.textureTypeReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-X&&V>=0&&V<=b.height-F&&R.readPixels(U,V,X,F,Ve.convert(Oe),Ve.convert(ke),de)}finally{const De=E!==null?_e.get(E).__webglFramebuffer:null;fe.bindFramebuffer(R.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(b,U,V,X,F,de,ye){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Re=_e.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ye!==void 0&&(Re=Re[ye]),Re){const De=b.texture,Oe=De.format,ke=De.type;if(!oe.textureFormatReadable(Oe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!oe.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=b.width-X&&V>=0&&V<=b.height-F){fe.bindFramebuffer(R.FRAMEBUFFER,Re);const Ue=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Ue),R.bufferData(R.PIXEL_PACK_BUFFER,de.byteLength,R.STREAM_READ),R.readPixels(U,V,X,F,Ve.convert(Oe),Ve.convert(ke),0);const rt=E!==null?_e.get(E).__webglFramebuffer:null;fe.bindFramebuffer(R.FRAMEBUFFER,rt);const ht=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await IS(R,ht,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Ue),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,de),R.deleteBuffer(Ue),R.deleteSync(ht),de}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,U=null,V=0){b.isTexture!==!0&&(ml("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,b=arguments[1]);const X=Math.pow(2,-V),F=Math.floor(b.image.width*X),de=Math.floor(b.image.height*X),ye=U!==null?U.x:0,Re=U!==null?U.y:0;P.setTexture2D(b,0),R.copyTexSubImage2D(R.TEXTURE_2D,V,0,0,ye,Re,F,de),fe.unbindTexture()},this.copyTextureToTexture=function(b,U,V=null,X=null,F=0){b.isTexture!==!0&&(ml("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,b=arguments[1],U=arguments[2],F=arguments[3]||0,V=null);let de,ye,Re,De,Oe,ke;V!==null?(de=V.max.x-V.min.x,ye=V.max.y-V.min.y,Re=V.min.x,De=V.min.y):(de=b.image.width,ye=b.image.height,Re=0,De=0),X!==null?(Oe=X.x,ke=X.y):(Oe=0,ke=0);const Ue=Ve.convert(U.format),rt=Ve.convert(U.type);P.setTexture2D(U,0),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,U.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,U.unpackAlignment);const ht=R.getParameter(R.UNPACK_ROW_LENGTH),St=R.getParameter(R.UNPACK_IMAGE_HEIGHT),pn=R.getParameter(R.UNPACK_SKIP_PIXELS),tt=R.getParameter(R.UNPACK_SKIP_ROWS),ze=R.getParameter(R.UNPACK_SKIP_IMAGES),kt=b.isCompressedTexture?b.mipmaps[F]:b.image;R.pixelStorei(R.UNPACK_ROW_LENGTH,kt.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,kt.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Re),R.pixelStorei(R.UNPACK_SKIP_ROWS,De),b.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,F,Oe,ke,de,ye,Ue,rt,kt.data):b.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,F,Oe,ke,kt.width,kt.height,Ue,kt.data):R.texSubImage2D(R.TEXTURE_2D,F,Oe,ke,de,ye,Ue,rt,kt),R.pixelStorei(R.UNPACK_ROW_LENGTH,ht),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,St),R.pixelStorei(R.UNPACK_SKIP_PIXELS,pn),R.pixelStorei(R.UNPACK_SKIP_ROWS,tt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ze),F===0&&U.generateMipmaps&&R.generateMipmap(R.TEXTURE_2D),fe.unbindTexture()},this.copyTextureToTexture3D=function(b,U,V=null,X=null,F=0){b.isTexture!==!0&&(ml("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,X=arguments[1]||null,b=arguments[2],U=arguments[3],F=arguments[4]||0);let de,ye,Re,De,Oe,ke,Ue,rt,ht;const St=b.isCompressedTexture?b.mipmaps[F]:b.image;V!==null?(de=V.max.x-V.min.x,ye=V.max.y-V.min.y,Re=V.max.z-V.min.z,De=V.min.x,Oe=V.min.y,ke=V.min.z):(de=St.width,ye=St.height,Re=St.depth,De=0,Oe=0,ke=0),X!==null?(Ue=X.x,rt=X.y,ht=X.z):(Ue=0,rt=0,ht=0);const pn=Ve.convert(U.format),tt=Ve.convert(U.type);let ze;if(U.isData3DTexture)P.setTexture3D(U,0),ze=R.TEXTURE_3D;else if(U.isDataArrayTexture||U.isCompressedArrayTexture)P.setTexture2DArray(U,0),ze=R.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,U.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,U.unpackAlignment);const kt=R.getParameter(R.UNPACK_ROW_LENGTH),nt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Un=R.getParameter(R.UNPACK_SKIP_PIXELS),Hr=R.getParameter(R.UNPACK_SKIP_ROWS),mn=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,St.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,St.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,De),R.pixelStorei(R.UNPACK_SKIP_ROWS,Oe),R.pixelStorei(R.UNPACK_SKIP_IMAGES,ke),b.isDataTexture||b.isData3DTexture?R.texSubImage3D(ze,F,Ue,rt,ht,de,ye,Re,pn,tt,St.data):U.isCompressedArrayTexture?R.compressedTexSubImage3D(ze,F,Ue,rt,ht,de,ye,Re,pn,St.data):R.texSubImage3D(ze,F,Ue,rt,ht,de,ye,Re,pn,tt,St),R.pixelStorei(R.UNPACK_ROW_LENGTH,kt),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,nt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Un),R.pixelStorei(R.UNPACK_SKIP_ROWS,Hr),R.pixelStorei(R.UNPACK_SKIP_IMAGES,mn),F===0&&U.generateMipmaps&&R.generateMipmap(ze),fe.unbindTexture()},this.initRenderTarget=function(b){_e.get(b).__webglFramebuffer===void 0&&P.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?P.setTextureCube(b,0):b.isData3DTexture?P.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?P.setTexture2DArray(b,0):P.setTexture2D(b,0),fe.unbindTexture()},this.resetState=function(){A=0,T=0,E=null,fe.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===_f?"display-p3":"srgb",t.unpackColorSpace=it.workingColorSpace===pc?"display-p3":"srgb"}}class Sf{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ze(e),this.density=t}clone(){return new Sf(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class YE extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class n_ extends Ws{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ze(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const jl=new D,Yl=new D,Vm=new mt,oo=new Hv,Va=new mc,Au=new D,Wm=new D;class ZE extends Ot{constructor(e=new qt,t=new n_){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)jl.fromBufferAttribute(t,r-1),Yl.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=jl.distanceTo(Yl);e.setAttribute("lineDistance",new at(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Va.copy(i.boundingSphere),Va.applyMatrix4(r),Va.radius+=s,e.ray.intersectsSphere(Va)===!1)return;Vm.copy(r).invert(),oo.copy(e.ray).applyMatrix4(Vm);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,h=i.index,f=i.attributes.position;if(h!==null){const p=Math.max(0,o.start),m=Math.min(h.count,o.start+o.count);for(let x=p,v=m-1;x<v;x+=c){const d=h.getX(x),_=h.getX(x+1),g=Wa(this,e,oo,l,d,_);g&&t.push(g)}if(this.isLineLoop){const x=h.getX(m-1),v=h.getX(p),d=Wa(this,e,oo,l,x,v);d&&t.push(d)}}else{const p=Math.max(0,o.start),m=Math.min(f.count,o.start+o.count);for(let x=p,v=m-1;x<v;x+=c){const d=Wa(this,e,oo,l,x,x+1);d&&t.push(d)}if(this.isLineLoop){const x=Wa(this,e,oo,l,m-1,p);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Wa(n,e,t,i,r,s){const o=n.geometry.attributes.position;if(jl.fromBufferAttribute(o,r),Yl.fromBufferAttribute(o,s),t.distanceSqToSegment(jl,Yl,Au,Wm)>i)return;Au.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(Au);if(!(l<e.near||l>e.far))return{distance:l,point:Wm.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}class $n extends tn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ai{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const i=this.getLengths();let r=0;const s=i.length;let o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);const h=i[r],f=i[r+1]-h,p=(o-h)/f;return(r+p)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new pe:new D);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){const i=new D,r=[],s=[],o=[],a=new D,l=new mt;for(let p=0;p<=e;p++){const m=p/e;r[p]=this.getTangentAt(m,new D)}s[0]=new D,o[0]=new D;let c=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),f=Math.abs(r[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),f<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let p=1;p<=e;p++){if(s[p]=s[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(r[p-1],r[p]),a.length()>Number.EPSILON){a.normalize();const m=Math.acos(Kt(r[p-1].dot(r[p]),-1,1));s[p].applyMatrix4(l.makeRotationAxis(a,m))}o[p].crossVectors(r[p],s[p])}if(t===!0){let p=Math.acos(Kt(s[0].dot(s[e]),-1,1));p/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(p=-p);for(let m=1;m<=e;m++)s[m].applyMatrix4(l.makeRotationAxis(r[m],p*m)),o[m].crossVectors(r[m],s[m])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Mf extends ai{constructor(e=0,t=0,i=1,r=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new pe){const i=t,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+e*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,p=c-this.aY;l=f*h-p*u+this.aX,c=f*u+p*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class KE extends Mf{constructor(e,t,i,r,s,o){super(e,t,i,i,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function wf(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,h,u){let f=(o-s)/c-(a-s)/(c+h)+(a-o)/h,p=(a-o)/h-(l-o)/(h+u)+(l-a)/u;f*=h,p*=h,r(o,a,f,p)},calc:function(s){const o=s*s,a=o*s;return n+e*s+t*o+i*a}}}const Xa=new D,bu=new wf,Cu=new wf,Pu=new wf;class $E extends ai{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new D){const i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,h;this.closed||a>0?c=r[(a-1)%s]:(Xa.subVectors(r[0],r[1]).add(r[0]),c=Xa);const u=r[a%s],f=r[(a+1)%s];if(this.closed||a+2<s?h=r[(a+2)%s]:(Xa.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Xa),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let m=Math.pow(c.distanceToSquared(u),p),x=Math.pow(u.distanceToSquared(f),p),v=Math.pow(f.distanceToSquared(h),p);x<1e-4&&(x=1),m<1e-4&&(m=x),v<1e-4&&(v=x),bu.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,m,x,v),Cu.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,m,x,v),Pu.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,m,x,v)}else this.curveType==="catmullrom"&&(bu.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),Cu.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),Pu.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return i.set(bu.calc(l),Cu.calc(l),Pu.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new D().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Xm(n,e,t,i,r){const s=(i-e)*.5,o=(r-t)*.5,a=n*n,l=n*a;return(2*t-2*i+s+o)*l+(-3*t+3*i-2*s-o)*a+s*n+t}function qE(n,e){const t=1-n;return t*t*e}function JE(n,e){return 2*(1-n)*n*e}function QE(n,e){return n*n*e}function wo(n,e,t,i){return qE(n,e)+JE(n,t)+QE(n,i)}function eT(n,e){const t=1-n;return t*t*t*e}function tT(n,e){const t=1-n;return 3*t*t*n*e}function nT(n,e){return 3*(1-n)*n*n*e}function iT(n,e){return n*n*n*e}function Eo(n,e,t,i,r){return eT(n,e)+tT(n,t)+nT(n,i)+iT(n,r)}class i_ extends ai{constructor(e=new pe,t=new pe,i=new pe,r=new pe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new pe){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Eo(e,r.x,s.x,o.x,a.x),Eo(e,r.y,s.y,o.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class rT extends ai{constructor(e=new D,t=new D,i=new D,r=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=r}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return i.set(Eo(e,r.x,s.x,o.x,a.x),Eo(e,r.y,s.y,o.y,a.y),Eo(e,r.z,s.z,o.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class r_ extends ai{constructor(e=new pe,t=new pe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new pe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new pe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class sT extends ai{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class s_ extends ai{constructor(e=new pe,t=new pe,i=new pe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new pe){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(wo(e,r.x,s.x,o.x),wo(e,r.y,s.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class oT extends ai{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,r=this.v0,s=this.v1,o=this.v2;return i.set(wo(e,r.x,s.x,o.x),wo(e,r.y,s.y,o.y),wo(e,r.z,s.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class o_ extends ai{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new pe){const i=t,r=this.points,s=(r.length-1)*e,o=Math.floor(s),a=s-o,l=r[o===0?o:o-1],c=r[o],h=r[o>r.length-2?r.length-1:o+1],u=r[o>r.length-3?r.length-1:o+2];return i.set(Xm(a,l.x,c.x,h.x,u.x),Xm(a,l.y,c.y,h.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const r=this.points[t];e.points.push(r.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const r=e.points[t];this.points.push(new pe().fromArray(r))}return this}}var fd=Object.freeze({__proto__:null,ArcCurve:KE,CatmullRomCurve3:$E,CubicBezierCurve:i_,CubicBezierCurve3:rT,EllipseCurve:Mf,LineCurve:r_,LineCurve3:sT,QuadraticBezierCurve:s_,QuadraticBezierCurve3:oT,SplineCurve:o_});class aT extends ai{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new fd[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=i){const o=r[s]-i,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}s++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,r=this.curves.length;i<r;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(r.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const r=this.curves[t];e.curves.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const r=e.curves[t];this.curves.push(new fd[r.type]().fromJSON(r))}return this}}class jm extends aT{constructor(e){super(),this.type="Path",this.currentPoint=new pe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new r_(this.currentPoint.clone(),new pe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,r){const s=new s_(this.currentPoint.clone(),new pe(e,t),new pe(i,r));return this.curves.push(s),this.currentPoint.set(i,r),this}bezierCurveTo(e,t,i,r,s,o){const a=new i_(this.currentPoint.clone(),new pe(e,t),new pe(i,r),new pe(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new o_(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,r,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,i,r,s,o),this}absarc(e,t,i,r,s,o){return this.absellipse(e,t,i,i,r,s,o),this}ellipse(e,t,i,r,s,o,a,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,r,s,o,a,l),this}absellipse(e,t,i,r,s,o,a,l){const c=new Mf(e,t,i,r,s,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Ef extends qt{constructor(e=1,t=32,i=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:i,thetaLength:r},t=Math.max(3,t);const s=[],o=[],a=[],l=[],c=new D,h=new pe;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,f=3;u<=t;u++,f+=3){const p=i+u/t*r;c.x=e*Math.cos(p),c.y=e*Math.sin(p),o.push(c.x,c.y,c.z),a.push(0,0,1),h.x=(o[f]/e+1)/2,h.y=(o[f+1]/e+1)/2,l.push(h.x,h.y)}for(let u=1;u<=t;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(a,3)),this.setAttribute("uv",new at(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ef(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class Ut extends qt{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],f=[],p=[];let m=0;const x=[],v=i/2;let d=0;_(),o===!1&&(e>0&&g(!0),t>0&&g(!1)),this.setIndex(h),this.setAttribute("position",new at(u,3)),this.setAttribute("normal",new at(f,3)),this.setAttribute("uv",new at(p,2));function _(){const S=new D,A=new D;let T=0;const E=(t-e)/i;for(let C=0;C<=s;C++){const z=[],y=C/s,w=y*(t-e)+e;for(let O=0;O<=r;O++){const G=O/r,Y=G*l+a,j=Math.sin(Y),k=Math.cos(Y);A.x=w*j,A.y=-y*i+v,A.z=w*k,u.push(A.x,A.y,A.z),S.set(j,E,k).normalize(),f.push(S.x,S.y,S.z),p.push(G,1-y),z.push(m++)}x.push(z)}for(let C=0;C<r;C++)for(let z=0;z<s;z++){const y=x[z][C],w=x[z+1][C],O=x[z+1][C+1],G=x[z][C+1];e>0&&(h.push(y,w,G),T+=3),t>0&&(h.push(w,O,G),T+=3)}c.addGroup(d,T,0),d+=T}function g(S){const A=m,T=new pe,E=new D;let C=0;const z=S===!0?e:t,y=S===!0?1:-1;for(let O=1;O<=r;O++)u.push(0,v*y,0),f.push(0,y,0),p.push(.5,.5),m++;const w=m;for(let O=0;O<=r;O++){const Y=O/r*l+a,j=Math.cos(Y),k=Math.sin(Y);E.x=z*k,E.y=v*y,E.z=z*j,u.push(E.x,E.y,E.z),f.push(0,y,0),T.x=j*.5+.5,T.y=k*.5*y+.5,p.push(T.x,T.y),m++}for(let O=0;O<r;O++){const G=A+O,Y=w+O;S===!0?h.push(Y,Y+1,G):h.push(Y+1,Y,G),C+=3}c.addGroup(d,C,S===!0?1:2),d+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ut(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Tf extends Ut{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Tf(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Af extends qt{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const s=[],o=[];a(r),c(i),h(),this.setAttribute("position",new at(s,3)),this.setAttribute("normal",new at(s.slice(),3)),this.setAttribute("uv",new at(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(_){const g=new D,S=new D,A=new D;for(let T=0;T<t.length;T+=3)p(t[T+0],g),p(t[T+1],S),p(t[T+2],A),l(g,S,A,_)}function l(_,g,S,A){const T=A+1,E=[];for(let C=0;C<=T;C++){E[C]=[];const z=_.clone().lerp(S,C/T),y=g.clone().lerp(S,C/T),w=T-C;for(let O=0;O<=w;O++)O===0&&C===T?E[C][O]=z:E[C][O]=z.clone().lerp(y,O/w)}for(let C=0;C<T;C++)for(let z=0;z<2*(T-C)-1;z++){const y=Math.floor(z/2);z%2===0?(f(E[C][y+1]),f(E[C+1][y]),f(E[C][y])):(f(E[C][y+1]),f(E[C+1][y+1]),f(E[C+1][y]))}}function c(_){const g=new D;for(let S=0;S<s.length;S+=3)g.x=s[S+0],g.y=s[S+1],g.z=s[S+2],g.normalize().multiplyScalar(_),s[S+0]=g.x,s[S+1]=g.y,s[S+2]=g.z}function h(){const _=new D;for(let g=0;g<s.length;g+=3){_.x=s[g+0],_.y=s[g+1],_.z=s[g+2];const S=v(_)/2/Math.PI+.5,A=d(_)/Math.PI+.5;o.push(S,1-A)}m(),u()}function u(){for(let _=0;_<o.length;_+=6){const g=o[_+0],S=o[_+2],A=o[_+4],T=Math.max(g,S,A),E=Math.min(g,S,A);T>.9&&E<.1&&(g<.2&&(o[_+0]+=1),S<.2&&(o[_+2]+=1),A<.2&&(o[_+4]+=1))}}function f(_){s.push(_.x,_.y,_.z)}function p(_,g){const S=_*3;g.x=e[S+0],g.y=e[S+1],g.z=e[S+2]}function m(){const _=new D,g=new D,S=new D,A=new D,T=new pe,E=new pe,C=new pe;for(let z=0,y=0;z<s.length;z+=9,y+=6){_.set(s[z+0],s[z+1],s[z+2]),g.set(s[z+3],s[z+4],s[z+5]),S.set(s[z+6],s[z+7],s[z+8]),T.set(o[y+0],o[y+1]),E.set(o[y+2],o[y+3]),C.set(o[y+4],o[y+5]),A.copy(_).add(g).add(S).divideScalar(3);const w=v(A);x(T,y+0,_,w),x(E,y+2,g,w),x(C,y+4,S,w)}}function x(_,g,S,A){A<0&&_.x===1&&(o[g]=_.x-1),S.x===0&&S.z===0&&(o[g]=A/2/Math.PI+.5)}function v(_){return Math.atan2(_.z,-_.x)}function d(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Af(e.vertices,e.indices,e.radius,e.details)}}class a_ extends jm{constructor(e){super(e),this.uuid=Vs(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,r=this.holes.length;i<r;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(r.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const r=this.holes[t];e.holes.push(r.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const r=e.holes[t];this.holes.push(new jm().fromJSON(r))}return this}}const lT={triangulate:function(n,e,t=2){const i=e&&e.length,r=i?e[0]*t:n.length;let s=l_(n,0,r,t,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c,h,u,f,p;if(i&&(s=fT(n,e,s,t)),n.length>80*t){a=c=n[0],l=h=n[1];for(let m=t;m<r;m+=t)u=n[m],f=n[m+1],u<a&&(a=u),f<l&&(l=f),u>c&&(c=u),f>h&&(h=f);p=Math.max(c-a,h-l),p=p!==0?32767/p:0}return Xo(s,o,t,a,l,p,0),o}};function l_(n,e,t,i,r){let s,o;if(r===ET(n,e,t,i)>0)for(s=e;s<t;s+=i)o=Ym(s,n[s],n[s+1],o);else for(s=t-i;s>=e;s-=i)o=Ym(s,n[s],n[s+1],o);return o&&vc(o,o.next)&&(Yo(o),o=o.next),o}function Fr(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(vc(t,t.next)||_t(t.prev,t,t.next)===0)){if(Yo(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Xo(n,e,t,i,r,s,o){if(!n)return;!o&&s&&_T(n,i,r,s);let a=n,l,c;for(;n.prev!==n.next;){if(l=n.prev,c=n.next,s?uT(n,i,r,s):cT(n)){e.push(l.i/t|0),e.push(n.i/t|0),e.push(c.i/t|0),Yo(n),n=c.next,a=c.next;continue}if(n=c,n===a){o?o===1?(n=hT(Fr(n),e,t),Xo(n,e,t,i,r,s,2)):o===2&&dT(n,e,t,i,r,s):Xo(Fr(n),e,t,i,r,s,1);break}}}function cT(n){const e=n.prev,t=n,i=n.next;if(_t(e,t,i)>=0)return!1;const r=e.x,s=t.x,o=i.x,a=e.y,l=t.y,c=i.y,h=r<s?r<o?r:o:s<o?s:o,u=a<l?a<c?a:c:l<c?l:c,f=r>s?r>o?r:o:s>o?s:o,p=a>l?a>c?a:c:l>c?l:c;let m=i.next;for(;m!==e;){if(m.x>=h&&m.x<=f&&m.y>=u&&m.y<=p&&gs(r,a,s,l,o,c,m.x,m.y)&&_t(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function uT(n,e,t,i){const r=n.prev,s=n,o=n.next;if(_t(r,s,o)>=0)return!1;const a=r.x,l=s.x,c=o.x,h=r.y,u=s.y,f=o.y,p=a<l?a<c?a:c:l<c?l:c,m=h<u?h<f?h:f:u<f?u:f,x=a>l?a>c?a:c:l>c?l:c,v=h>u?h>f?h:f:u>f?u:f,d=pd(p,m,e,t,i),_=pd(x,v,e,t,i);let g=n.prevZ,S=n.nextZ;for(;g&&g.z>=d&&S&&S.z<=_;){if(g.x>=p&&g.x<=x&&g.y>=m&&g.y<=v&&g!==r&&g!==o&&gs(a,h,l,u,c,f,g.x,g.y)&&_t(g.prev,g,g.next)>=0||(g=g.prevZ,S.x>=p&&S.x<=x&&S.y>=m&&S.y<=v&&S!==r&&S!==o&&gs(a,h,l,u,c,f,S.x,S.y)&&_t(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;g&&g.z>=d;){if(g.x>=p&&g.x<=x&&g.y>=m&&g.y<=v&&g!==r&&g!==o&&gs(a,h,l,u,c,f,g.x,g.y)&&_t(g.prev,g,g.next)>=0)return!1;g=g.prevZ}for(;S&&S.z<=_;){if(S.x>=p&&S.x<=x&&S.y>=m&&S.y<=v&&S!==r&&S!==o&&gs(a,h,l,u,c,f,S.x,S.y)&&_t(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function hT(n,e,t){let i=n;do{const r=i.prev,s=i.next.next;!vc(r,s)&&c_(r,i,i.next,s)&&jo(r,s)&&jo(s,r)&&(e.push(r.i/t|0),e.push(i.i/t|0),e.push(s.i/t|0),Yo(i),Yo(i.next),i=n=s),i=i.next}while(i!==n);return Fr(i)}function dT(n,e,t,i,r,s){let o=n;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&ST(o,a)){let l=u_(o,a);o=Fr(o,o.next),l=Fr(l,l.next),Xo(o,e,t,i,r,s,0),Xo(l,e,t,i,r,s,0);return}a=a.next}o=o.next}while(o!==n)}function fT(n,e,t,i){const r=[];let s,o,a,l,c;for(s=0,o=e.length;s<o;s++)a=e[s]*i,l=s<o-1?e[s+1]*i:n.length,c=l_(n,a,l,i,!1),c===c.next&&(c.steiner=!0),r.push(yT(c));for(r.sort(pT),s=0;s<r.length;s++)t=mT(r[s],t);return t}function pT(n,e){return n.x-e.x}function mT(n,e){const t=gT(n,e);if(!t)return e;const i=u_(t,n);return Fr(i,i.next),Fr(t,t.next)}function gT(n,e){let t=e,i=-1/0,r;const s=n.x,o=n.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const f=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=s&&f>i&&(i=f,r=t.x<t.next.x?t:t.next,f===s))return r}t=t.next}while(t!==e);if(!r)return null;const a=r,l=r.x,c=r.y;let h=1/0,u;t=r;do s>=t.x&&t.x>=l&&s!==t.x&&gs(o<c?s:i,o,l,c,o<c?i:s,o,t.x,t.y)&&(u=Math.abs(o-t.y)/(s-t.x),jo(t,n)&&(u<h||u===h&&(t.x>r.x||t.x===r.x&&vT(r,t)))&&(r=t,h=u)),t=t.next;while(t!==a);return r}function vT(n,e){return _t(n.prev,n,e.prev)<0&&_t(e.next,n,n.next)<0}function _T(n,e,t,i){let r=n;do r.z===0&&(r.z=pd(r.x,r.y,e,t,i)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==n);r.prevZ.nextZ=null,r.prevZ=null,xT(r)}function xT(n){let e,t,i,r,s,o,a,l,c=1;do{for(t=n,n=null,s=null,o=0;t;){for(o++,i=t,a=0,e=0;e<c&&(a++,i=i.nextZ,!!i);e++);for(l=c;a>0||l>0&&i;)a!==0&&(l===0||!i||t.z<=i.z)?(r=t,t=t.nextZ,a--):(r=i,i=i.nextZ,l--),s?s.nextZ=r:n=r,r.prevZ=s,s=r;t=i}s.nextZ=null,c*=2}while(o>1);return n}function pd(n,e,t,i,r){return n=(n-t)*r|0,e=(e-i)*r|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function yT(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function gs(n,e,t,i,r,s,o,a){return(r-o)*(e-a)>=(n-o)*(s-a)&&(n-o)*(i-a)>=(t-o)*(e-a)&&(t-o)*(s-a)>=(r-o)*(i-a)}function ST(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!MT(n,e)&&(jo(n,e)&&jo(e,n)&&wT(n,e)&&(_t(n.prev,n,e.prev)||_t(n,e.prev,e))||vc(n,e)&&_t(n.prev,n,n.next)>0&&_t(e.prev,e,e.next)>0)}function _t(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function vc(n,e){return n.x===e.x&&n.y===e.y}function c_(n,e,t,i){const r=Ya(_t(n,e,t)),s=Ya(_t(n,e,i)),o=Ya(_t(t,i,n)),a=Ya(_t(t,i,e));return!!(r!==s&&o!==a||r===0&&ja(n,t,e)||s===0&&ja(n,i,e)||o===0&&ja(t,n,i)||a===0&&ja(t,e,i))}function ja(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function Ya(n){return n>0?1:n<0?-1:0}function MT(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&c_(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function jo(n,e){return _t(n.prev,n,n.next)<0?_t(n,e,n.next)>=0&&_t(n,n.prev,e)>=0:_t(n,e,n.prev)<0||_t(n,n.next,e)<0}function wT(n,e){let t=n,i=!1;const r=(n.x+e.x)/2,s=(n.y+e.y)/2;do t.y>s!=t.next.y>s&&t.next.y!==t.y&&r<(t.next.x-t.x)*(s-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function u_(n,e){const t=new md(n.i,n.x,n.y),i=new md(e.i,e.x,e.y),r=n.next,s=e.prev;return n.next=e,e.prev=n,t.next=r,r.prev=t,i.next=t,t.prev=i,s.next=i,i.prev=s,i}function Ym(n,e,t,i){const r=new md(n,e,t);return i?(r.next=i.next,r.prev=i,i.next.prev=r,i.next=r):(r.prev=r,r.next=r),r}function Yo(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function md(n,e,t){this.i=n,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function ET(n,e,t,i){let r=0;for(let s=e,o=t-i;s<t;s+=i)r+=(n[o]-n[s])*(n[s+1]+n[o+1]),o=s;return r}class To{static area(e){const t=e.length;let i=0;for(let r=t-1,s=0;s<t;r=s++)i+=e[r].x*e[s].y-e[s].x*e[r].y;return i*.5}static isClockWise(e){return To.area(e)<0}static triangulateShape(e,t){const i=[],r=[],s=[];Zm(e),Km(i,e);let o=e.length;t.forEach(Zm);for(let l=0;l<t.length;l++)r.push(o),o+=t[l].length,Km(i,t[l]);const a=lT.triangulate(i,r);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function Zm(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Km(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class bf extends qt{constructor(e=new a_([new pe(.5,.5),new pe(-.5,.5),new pe(-.5,-.5),new pe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,r=[],s=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];o(c)}this.setAttribute("position",new at(r,3)),this.setAttribute("uv",new at(s,2)),this.computeVertexNormals();function o(a){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,p=t.bevelThickness!==void 0?t.bevelThickness:.2,m=t.bevelSize!==void 0?t.bevelSize:p-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,v=t.bevelSegments!==void 0?t.bevelSegments:3;const d=t.extrudePath,_=t.UVGenerator!==void 0?t.UVGenerator:TT;let g,S=!1,A,T,E,C;d&&(g=d.getSpacedPoints(h),S=!0,f=!1,A=d.computeFrenetFrames(h,!1),T=new D,E=new D,C=new D),f||(v=0,p=0,m=0,x=0);const z=a.extractPoints(c);let y=z.shape;const w=z.holes;if(!To.isClockWise(y)){y=y.reverse();for(let te=0,R=w.length;te<R;te++){const ue=w[te];To.isClockWise(ue)&&(w[te]=ue.reverse())}}const G=To.triangulateShape(y,w),Y=y;for(let te=0,R=w.length;te<R;te++){const ue=w[te];y=y.concat(ue)}function j(te,R,ue){return R||console.error("THREE.ExtrudeGeometry: vec does not exist"),te.clone().addScaledVector(R,ue)}const k=y.length,K=G.length;function N(te,R,ue){let he,oe,fe;const Ie=te.x-R.x,_e=te.y-R.y,P=ue.x-te.x,M=ue.y-te.y,H=Ie*Ie+_e*_e,Q=Ie*M-_e*P;if(Math.abs(Q)>Number.EPSILON){const ie=Math.sqrt(H),ee=Math.sqrt(P*P+M*M),Ne=R.x-_e/ie,ge=R.y+Ie/ie,we=ue.x-M/ee,Ke=ue.y+P/ee,ce=((we-Ne)*M-(Ke-ge)*P)/(Ie*M-_e*P);he=Ne+Ie*ce-te.x,oe=ge+_e*ce-te.y;const Ee=he*he+oe*oe;if(Ee<=2)return new pe(he,oe);fe=Math.sqrt(Ee/2)}else{let ie=!1;Ie>Number.EPSILON?P>Number.EPSILON&&(ie=!0):Ie<-Number.EPSILON?P<-Number.EPSILON&&(ie=!0):Math.sign(_e)===Math.sign(M)&&(ie=!0),ie?(he=-_e,oe=Ie,fe=Math.sqrt(H)):(he=Ie,oe=_e,fe=Math.sqrt(H/2))}return new pe(he/fe,oe/fe)}const $=[];for(let te=0,R=Y.length,ue=R-1,he=te+1;te<R;te++,ue++,he++)ue===R&&(ue=0),he===R&&(he=0),$[te]=N(Y[te],Y[ue],Y[he]);const J=[];let Z,me=$.concat();for(let te=0,R=w.length;te<R;te++){const ue=w[te];Z=[];for(let he=0,oe=ue.length,fe=oe-1,Ie=he+1;he<oe;he++,fe++,Ie++)fe===oe&&(fe=0),Ie===oe&&(Ie=0),Z[he]=N(ue[he],ue[fe],ue[Ie]);J.push(Z),me=me.concat(Z)}for(let te=0;te<v;te++){const R=te/v,ue=p*Math.cos(R*Math.PI/2),he=m*Math.sin(R*Math.PI/2)+x;for(let oe=0,fe=Y.length;oe<fe;oe++){const Ie=j(Y[oe],$[oe],he);se(Ie.x,Ie.y,-ue)}for(let oe=0,fe=w.length;oe<fe;oe++){const Ie=w[oe];Z=J[oe];for(let _e=0,P=Ie.length;_e<P;_e++){const M=j(Ie[_e],Z[_e],he);se(M.x,M.y,-ue)}}}const Ae=m+x;for(let te=0;te<k;te++){const R=f?j(y[te],me[te],Ae):y[te];S?(E.copy(A.normals[0]).multiplyScalar(R.x),T.copy(A.binormals[0]).multiplyScalar(R.y),C.copy(g[0]).add(E).add(T),se(C.x,C.y,C.z)):se(R.x,R.y,0)}for(let te=1;te<=h;te++)for(let R=0;R<k;R++){const ue=f?j(y[R],me[R],Ae):y[R];S?(E.copy(A.normals[te]).multiplyScalar(ue.x),T.copy(A.binormals[te]).multiplyScalar(ue.y),C.copy(g[te]).add(E).add(T),se(C.x,C.y,C.z)):se(ue.x,ue.y,u/h*te)}for(let te=v-1;te>=0;te--){const R=te/v,ue=p*Math.cos(R*Math.PI/2),he=m*Math.sin(R*Math.PI/2)+x;for(let oe=0,fe=Y.length;oe<fe;oe++){const Ie=j(Y[oe],$[oe],he);se(Ie.x,Ie.y,u+ue)}for(let oe=0,fe=w.length;oe<fe;oe++){const Ie=w[oe];Z=J[oe];for(let _e=0,P=Ie.length;_e<P;_e++){const M=j(Ie[_e],Z[_e],he);S?se(M.x,M.y+g[h-1].y,g[h-1].x+ue):se(M.x,M.y,u+ue)}}}W(),ne();function W(){const te=r.length/3;if(f){let R=0,ue=k*R;for(let he=0;he<K;he++){const oe=G[he];be(oe[2]+ue,oe[1]+ue,oe[0]+ue)}R=h+v*2,ue=k*R;for(let he=0;he<K;he++){const oe=G[he];be(oe[0]+ue,oe[1]+ue,oe[2]+ue)}}else{for(let R=0;R<K;R++){const ue=G[R];be(ue[2],ue[1],ue[0])}for(let R=0;R<K;R++){const ue=G[R];be(ue[0]+k*h,ue[1]+k*h,ue[2]+k*h)}}i.addGroup(te,r.length/3-te,0)}function ne(){const te=r.length/3;let R=0;le(Y,R),R+=Y.length;for(let ue=0,he=w.length;ue<he;ue++){const oe=w[ue];le(oe,R),R+=oe.length}i.addGroup(te,r.length/3-te,1)}function le(te,R){let ue=te.length;for(;--ue>=0;){const he=ue;let oe=ue-1;oe<0&&(oe=te.length-1);for(let fe=0,Ie=h+v*2;fe<Ie;fe++){const _e=k*fe,P=k*(fe+1),M=R+he+_e,H=R+oe+_e,Q=R+oe+P,ie=R+he+P;Le(M,H,Q,ie)}}}function se(te,R,ue){l.push(te),l.push(R),l.push(ue)}function be(te,R,ue){Fe(te),Fe(R),Fe(ue);const he=r.length/3,oe=_.generateTopUV(i,r,he-3,he-2,he-1);Ge(oe[0]),Ge(oe[1]),Ge(oe[2])}function Le(te,R,ue,he){Fe(te),Fe(R),Fe(he),Fe(R),Fe(ue),Fe(he);const oe=r.length/3,fe=_.generateSideWallUV(i,r,oe-6,oe-3,oe-2,oe-1);Ge(fe[0]),Ge(fe[1]),Ge(fe[3]),Ge(fe[1]),Ge(fe[2]),Ge(fe[3])}function Fe(te){r.push(l[te*3+0]),r.push(l[te*3+1]),r.push(l[te*3+2])}function Ge(te){s.push(te.x),s.push(te.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return AT(t,i,e)}static fromJSON(e,t){const i=[];for(let s=0,o=e.shapes.length;s<o;s++){const a=t[e.shapes[s]];i.push(a)}const r=e.options.extrudePath;return r!==void 0&&(e.options.extrudePath=new fd[r.type]().fromJSON(r)),new bf(i,e.options)}}const TT={generateTopUV:function(n,e,t,i,r){const s=e[t*3],o=e[t*3+1],a=e[i*3],l=e[i*3+1],c=e[r*3],h=e[r*3+1];return[new pe(s,o),new pe(a,l),new pe(c,h)]},generateSideWallUV:function(n,e,t,i,r,s){const o=e[t*3],a=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],u=e[i*3+2],f=e[r*3],p=e[r*3+1],m=e[r*3+2],x=e[s*3],v=e[s*3+1],d=e[s*3+2];return Math.abs(a-h)<Math.abs(o-c)?[new pe(o,1-l),new pe(c,1-u),new pe(f,1-m),new pe(x,1-d)]:[new pe(a,1-l),new pe(h,1-u),new pe(p,1-m),new pe(v,1-d)]}};function AT(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,r=n.length;i<r;i++){const s=n[i];t.shapes.push(s.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Zo extends Af{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Zo(e.radius,e.detail)}}class Cf extends qt{constructor(e=.5,t=1,i=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:i,phiSegments:r,thetaStart:s,thetaLength:o},i=Math.max(3,i),r=Math.max(1,r);const a=[],l=[],c=[],h=[];let u=e;const f=(t-e)/r,p=new D,m=new pe;for(let x=0;x<=r;x++){for(let v=0;v<=i;v++){const d=s+v/i*o;p.x=u*Math.cos(d),p.y=u*Math.sin(d),l.push(p.x,p.y,p.z),c.push(0,0,1),m.x=(p.x/t+1)/2,m.y=(p.y/t+1)/2,h.push(m.x,m.y)}u+=f}for(let x=0;x<r;x++){const v=x*(i+1);for(let d=0;d<i;d++){const _=d+v,g=_,S=_+i+1,A=_+i+2,T=_+1;a.push(g,S,T),a.push(S,A,T)}}this.setIndex(a),this.setAttribute("position",new at(l,3)),this.setAttribute("normal",new at(c,3)),this.setAttribute("uv",new at(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cf(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class _c extends qt{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const h=[],u=new D,f=new D,p=[],m=[],x=[],v=[];for(let d=0;d<=i;d++){const _=[],g=d/i;let S=0;d===0&&o===0?S=.5/t:d===i&&l===Math.PI&&(S=-.5/t);for(let A=0;A<=t;A++){const T=A/t;u.x=-e*Math.cos(r+T*s)*Math.sin(o+g*a),u.y=e*Math.cos(o+g*a),u.z=e*Math.sin(r+T*s)*Math.sin(o+g*a),m.push(u.x,u.y,u.z),f.copy(u).normalize(),x.push(f.x,f.y,f.z),v.push(T+S,1-g),_.push(c++)}h.push(_)}for(let d=0;d<i;d++)for(let _=0;_<t;_++){const g=h[d][_+1],S=h[d][_],A=h[d+1][_],T=h[d+1][_+1];(d!==0||o>0)&&p.push(g,S,T),(d!==i-1||l<Math.PI)&&p.push(S,A,T)}this.setIndex(p),this.setAttribute("position",new at(m,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(v,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _c(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Pf extends qt{constructor(e=1,t=.4,i=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:r,arc:s},i=Math.floor(i),r=Math.floor(r);const o=[],a=[],l=[],c=[],h=new D,u=new D,f=new D;for(let p=0;p<=i;p++)for(let m=0;m<=r;m++){const x=m/r*s,v=p/i*Math.PI*2;u.x=(e+t*Math.cos(v))*Math.cos(x),u.y=(e+t*Math.cos(v))*Math.sin(x),u.z=t*Math.sin(v),a.push(u.x,u.y,u.z),h.x=e*Math.cos(x),h.y=e*Math.sin(x),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(m/r),c.push(p/i)}for(let p=1;p<=i;p++)for(let m=1;m<=r;m++){const x=(r+1)*p+m-1,v=(r+1)*(p-1)+m-1,d=(r+1)*(p-1)+m,_=(r+1)*p+m;o.push(x,v,_),o.push(v,d,_)}this.setIndex(o),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(l,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Pf(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Je extends Ws{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Ze(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ze(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zv,this.normalScale=new pe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Rf extends Ot{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ze(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class bT extends Rf{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ze(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Ru=new mt,$m=new D,qm=new D;class h_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new pe(512,512),this.map=null,this.mapPass=null,this.matrix=new mt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new xf,this._frameExtents=new pe(1,1),this._viewportCount=1,this._viewports=[new ot(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;$m.setFromMatrixPosition(e.matrixWorld),t.position.copy($m),qm.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(qm),t.updateMatrixWorld(),Ru.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ru),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ru)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Jm=new mt,ao=new D,Lu=new D;class CT extends h_{constructor(){super(new xn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new pe(4,2),this._viewportCount=6,this._viewports=[new ot(2,1,1,1),new ot(0,1,1,1),new ot(3,1,1,1),new ot(1,1,1,1),new ot(3,0,1,1),new ot(1,0,1,1)],this._cubeDirections=[new D(1,0,0),new D(-1,0,0),new D(0,0,1),new D(0,0,-1),new D(0,1,0),new D(0,-1,0)],this._cubeUps=[new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,1,0),new D(0,0,1),new D(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),ao.setFromMatrixPosition(e.matrixWorld),i.position.copy(ao),Lu.copy(i.position),Lu.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(Lu),i.updateMatrixWorld(),r.makeTranslation(-ao.x,-ao.y,-ao.z),Jm.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Jm)}}class Zl extends Rf{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new CT}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class PT extends h_{constructor(){super(new $v(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Qm extends Rf{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new PT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:hf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=hf);function qn(n,e){const t=document.createElement("canvas");t.width=n,t.height=e;const i=t.getContext("2d");return[t,i]}function Br(n){let e=n>>>0;return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}function RT(){const[n,e]=qn(512,512),t=Br(101);e.fillStyle="#c8aa7a",e.fillRect(0,0,512,512);for(let r=0;r<400;r++){const s=t()*512,o=t()*512,a=8+t()*34,l=t()>.5?"rgba(220,192,145,0.16)":"rgba(150,120,80,0.14)";e.fillStyle=l,e.beginPath(),e.arc(s,o,a,0,Math.PI*2),e.fill()}e.strokeStyle="rgba(110, 88, 58, 0.16)",e.lineWidth=2;for(let r=0;r<512;r+=64){e.beginPath(),e.moveTo(0,r),e.lineTo(512,r),e.stroke();const s=r/64%2===0?0:32;for(let o=s;o<512;o+=64)e.beginPath(),e.moveTo(o,r),e.lineTo(o,r+64),e.stroke()}for(let r=0;r<6e3;r++){const s=t()*512,o=t()*512;e.fillStyle=t()>.5?"rgba(245,230,195,0.22)":"rgba(95,74,48,0.2)",e.fillRect(s,o,2,2)}const i=new $n(n);return i.wrapS=i.wrapT=Ai,i.repeat.set(22,22),i.colorSpace=Et,i}function LT(){const[n,e]=qn(512,512),t=Br(202),i=e.createLinearGradient(0,0,0,512);i.addColorStop(0,"#dfc59c"),i.addColorStop(.6,"#d1b383"),i.addColorStop(1,"#b69464"),e.fillStyle=i,e.fillRect(0,0,512,512);for(let s=0;s<16;s++){const o=s*32;e.fillStyle="rgba(115, 88, 56, 0.12)",e.fillRect(0,o,512,2);const a=s%2*32;for(let l=0;l<8;l++){const c=l*64+a;t()<.28&&(e.fillStyle=t()>.5?"rgba(170,136,92,0.24)":"rgba(235,212,175,0.18)",e.fillRect(c+2,o+2,60,28)),e.fillStyle="rgba(100, 76, 48, 0.1)",e.fillRect(c,o,2,32)}}for(let s=0;s<320;s++){const o=t()*512,a=t()*512,l=6+t()*24;e.fillStyle=t()>.5?"rgba(120,90,55,0.08)":"rgba(245,232,205,0.08)",e.beginPath(),e.arc(o,a,l,0,Math.PI*2),e.fill()}e.fillStyle="rgba(155, 92, 62, 0.25)",e.fillRect(0,44,512,14);const r=new $n(n);return r.wrapS=r.wrapT=Ai,r.colorSpace=Et,r}function NT(){const[n,e]=qn(256,256),t=Br(303);e.fillStyle="#bfa071",e.fillRect(0,0,256,256);for(let r=0;r<16;r++)e.fillStyle=r%2===0?"rgba(95,72,44,0.15)":"rgba(235,215,175,0.12)",e.fillRect(0,r*16,256,8);for(let r=0;r<1200;r++)e.fillStyle=t()>.5?"rgba(80,60,35,0.18)":"rgba(240,220,185,0.16)",e.fillRect(t()*256,t()*256,2,2);const i=new $n(n);return i.wrapS=i.wrapT=Ai,i.colorSpace=Et,i}function DT(){const[n,e]=qn(512,512),t=Br(404);e.fillStyle="#8b775b",e.fillRect(0,0,512,512);for(let r=0;r<12;r++){const s=r*42.6,o=r%2*32;for(let a=-1;a<9;a++){const l=a*64+o,c=Math.floor(115+t()*32);e.fillStyle=`rgb(${c+16}, ${c}, ${c-22})`,e.fillRect(l+2,s+2,60,39)}}for(let r=0;r<2e3;r++)e.fillStyle=t()>.5?"rgba(30,22,14,0.22)":"rgba(210,190,155,0.12)",e.fillRect(t()*512,t()*512,2,2);const i=new $n(n);return i.wrapS=i.wrapT=Ai,i.colorSpace=Et,i}function IT(){const[n,e]=qn(256,256),t=Br(505);e.fillStyle="#a4794b",e.fillRect(0,0,256,256);for(let r=0;r<6;r++){const s=r*42.6;e.fillStyle=r%2===0?"#9e7346":"#ae8253",e.fillRect(0,s,256,41),e.fillStyle="#5c3f21",e.fillRect(0,s+40,256,3)}for(let r=0;r<400;r++)e.fillStyle=t()>.5?"rgba(70,45,20,0.16)":"rgba(215,175,120,0.12)",e.fillRect(t()*256,t()*256,20+t()*45,2);e.strokeStyle="#7c5730",e.lineWidth=22,e.beginPath(),e.moveTo(16,16),e.lineTo(240,240),e.stroke(),e.strokeStyle="#8b6339",e.lineWidth=26,e.strokeRect(13,13,230,230),e.strokeStyle="#4e351c",e.lineWidth=3,e.strokeRect(26,26,204,204),e.fillStyle="#363636";for(const[r,s]of[[14,14],[242,14],[14,242],[242,242]])e.beginPath(),e.arc(r,s,4,0,Math.PI*2),e.fill();const i=new $n(n);return i.colorSpace=Et,i}function UT(){const[n,e]=qn(256,256),t=Br(606);e.fillStyle="#4b5b47",e.fillRect(0,0,256,256);for(let r=18;r<238;r+=28)e.fillStyle="#3d4b39",e.fillRect(r,22,14,212),e.fillStyle="#5c6e57",e.fillRect(r+14,22,4,212);e.strokeStyle="#2f3a2c",e.lineWidth=18,e.strokeRect(9,9,238,238),e.fillStyle="rgba(225, 190, 70, 0.72)",e.fillRect(28,34,64,10),e.font="bold 18px monospace",e.fillText("MIL-D2",30,68);for(let r=0;r<500;r++)e.fillStyle=t()>.5?"rgba(20,25,20,0.16)":"rgba(180,175,140,0.1)",e.fillRect(t()*256,t()*256,3,3);const i=new $n(n);return i.colorSpace=Et,i}function zT(){const[n,e]=qn(256,512),t=Br(707);e.fillStyle="#5d3e27",e.fillRect(0,0,256,512);for(let r=0;r<6;r++){const s=r*42.6;e.fillStyle=r%2===0?"#624229":"#533721",e.fillRect(s,0,41,512),e.fillStyle="#2d1c10",e.fillRect(s+40,0,3,512)}for(let r=0;r<600;r++)e.fillStyle=t()>.5?"rgba(30,18,8,0.2)":"rgba(155,112,72,0.12)",e.fillRect(t()*256,t()*512,2,24+t()*40);e.fillStyle="#2c2f33";for(const r of[40,240,440]){e.fillRect(0,r,256,26),e.fillStyle="#555b61";for(let s=20;s<250;s+=42)e.beginPath(),e.arc(s,r+13,4.5,0,Math.PI*2),e.fill();e.fillStyle="#2c2f33"}const i=new $n(n);return i.colorSpace=Et,i}function FT(){const[n,e]=qn(256,256);e.fillStyle="#2f5879",e.fillRect(0,0,256,256);for(let i=0;i<8;i++)e.fillStyle=i%2===0?"#274c69":"#376489",e.fillRect(0,i*32,256,30);e.strokeStyle="#1c3548",e.lineWidth=10,e.strokeRect(5,5,246,246);const t=new $n(n);return t.colorSpace=Et,t}function e0(n){const[e,t]=qn(256,256);t.clearRect(0,0,256,256),t.strokeStyle="rgba(185, 38, 30, 0.88)",t.lineWidth=14,t.beginPath(),t.arc(128,128,102,0,Math.PI*2),t.stroke(),t.fillStyle="rgba(195, 42, 32, 0.92)",t.font="900 156px Impact, Arial Black, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,128,138);const i=new $n(e);return i.colorSpace=Et,i}function t0(n){const[e,t]=qn(512,512);t.clearRect(0,0,512,512),t.strokeStyle="rgba(215, 55, 35, 0.72)",t.lineWidth=14,t.setLineDash([36,18]),t.strokeRect(18,18,476,476),t.setLineDash([]),t.fillStyle="rgba(220, 62, 42, 0.24)",t.font="900 220px Impact, Arial Black, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(n,256,266);const i=new $n(e);return i.colorSpace=Et,i}function OT(){const[n,e]=qn(256,256);e.fillStyle="#c5a87a",e.fillRect(0,0,256,256);for(let i=0;i<12;i++){const r=i*21.333333333333332;e.fillStyle="#b49566",e.fillRect(0,r,256,10),e.fillStyle="#8b6f47",e.fillRect(0,r+10,256,4)}const t=new $n(n);return t.wrapS=t.wrapT=Ai,t.colorSpace=Et,t}function kT(){return{sandGround:RT(),sandstoneWall:LT(),sandstoneTrim:NT(),tunnelStone:DT(),woodCrate:IT(),militaryCrate:UT(),midDoorWood:zT(),blueMetal:FT(),siteADecal:e0("A"),siteBDecal:e0("B"),siteFloorA:t0("A"),siteFloorB:t0("B"),stairsTex:OT()}}function BT(){const n=new lt,e=[],t=[],i=[],r=kT(),s=new Je({map:r.sandGround,roughness:.94,metalness:.02}),o=(j,k,K=!1)=>{const N=(K?r.tunnelStone:r.sandstoneWall).clone();return N.needsUpdate=!0,N.wrapS=N.wrapT=Ai,N.repeat.set(Math.max(1,j/5),Math.max(1,k/5)),new Je({map:N,roughness:.88,metalness:.03})},a=new Je({map:r.sandstoneTrim,roughness:.9}),l=new Je({map:r.woodCrate,roughness:.82}),c=new Je({map:r.militaryCrate,roughness:.68,metalness:.25}),h=new Je({map:r.midDoorWood,roughness:.78,metalness:.12}),u=new Je({map:r.blueMetal,roughness:.55,metalness:.45}),f=new Je({color:3883078,roughness:.5,metalness:.6}),p=new Je({map:r.stairsTex,roughness:.9}),m=(j,k,K,N,$,J,Z={})=>{const me=Math.min(j,N),Ae=Math.max(j,N),W=Math.min(k,$),ne=Math.max(k,$),le=Math.min(K,J),se=Math.max(K,J),be=Ae-me,Le=ne-W,Fe=se-le;e.push({minX:me,maxX:Ae,minY:W,maxY:ne,minZ:le,maxZ:se,material:Z.material??"sandstone",blocksVision:Z.blocksVision??!0});const Ge=Math.max(be,Fe),te=Z.customMat??(Z.material==="crate"?l:Z.material==="door"?h:Z.material==="metal"?c:Z.material==="ground"?a:o(Ge,Le,Z.tunnel)),R=new We(new Pe(be,Le,Fe),te);if(R.position.set((me+Ae)*.5,(W+ne)*.5,(le+se)*.5),R.castShadow=Z.castShadow??Le>.3,R.receiveShadow=Z.receiveShadow??!0,n.add(R),Z.trimCap&&Le>=3.5){const ue=new We(new Pe(be+.16,.22,Fe+.16),a);ue.position.set((me+Ae)*.5,ne+.11,(le+se)*.5),ue.receiveShadow=!0,n.add(ue)}Z.mapKind!==null&&i.push({x1:me,z1:le,x2:Ae,z2:se,kind:Z.mapKind??(Z.material==="crate"||Z.material==="metal"?"crate":"wall")})},x=(j,k,K,N,$,J,Z,me=0)=>{const Ae=Math.min(j,K),W=Math.max(j,K),ne=Math.min(k,N),le=Math.max(k,N);t.push({minX:Ae,maxX:W,minZ:ne,maxZ:le,yStart:$,yEnd:J,axis:Z}),i.push({x1:Ae,z1:ne,x2:W,z2:le,kind:"ramp"});const se=new a_,be=Z==="+x"||Z==="-x"?W-Ae:le-ne,Le=Z==="+x"||Z==="-x"?le-ne:W-Ae,Fe=Math.max(0,$),Ge=Math.max(0,J);se.moveTo(0,0),se.lineTo(be,0),se.lineTo(be,Ge),se.lineTo(0,Fe),se.closePath();const te=new bf(se,{depth:Le,bevelEnabled:!1}),R=new We(te,p);if(R.castShadow=!0,R.receiveShadow=!0,Z==="+x"?R.position.set(Ae,0,ne):Z==="-x"?(R.rotation.y=Math.PI,R.position.set(W,0,le)):Z==="+z"?(R.rotation.y=-Math.PI/2,R.position.set(W,0,ne)):(R.rotation.y=Math.PI/2,R.position.set(Ae,0,le)),n.add(R),me>0)for(let ue=0;ue<me;ue++){const he=(ue+.5)/me,oe=$+(J-$)*he,fe=be/me,Ie=Z==="+x"||Z==="-x"?fe:Le,_e=Z==="+x"||Z==="-x"?Le:fe,P=new We(new Pe(Ie,.14,_e),a);Z==="+x"?P.position.set(Ae+he*be,oe-.05,(ne+le)*.5):Z==="-x"?P.position.set(W-he*be,oe-.05,(ne+le)*.5):Z==="+z"?P.position.set((Ae+W)*.5,oe-.05,ne+he*be):P.position.set((Ae+W)*.5,oe-.05,le-he*be),P.receiveShadow=!0,n.add(P)}},v=(j,k,K,N=8139561)=>{e.push({minX:j-.42,maxX:j+.42,minY:k,maxY:k+1.15,minZ:K-.42,maxZ:K+.42,material:"metal",blocksVision:!0});const Z=new Je({color:N,roughness:.55,metalness:.45}),me=new We(new Ut(.42,.42,1.15,14),Z);me.position.set(j,k+1.15*.5,K),me.castShadow=!0,me.receiveShadow=!0,n.add(me);for(const Ae of[-.32,.32]){const W=new We(new Pf(.43,.025,8,16),f);W.rotation.x=Math.PI/2,W.position.set(j,k+1.15*.5+Ae,K),n.add(W)}},d=(j,k,K,N,$)=>{const J=Math.abs(Math.sin(N))>.7,Z=J?2.1:1.05,me=J?1.05:2.1;e.push({minX:j-Z,maxX:j+Z,minY:k,maxY:k+1.45,minZ:K-me,maxZ:K+me,material:"metal",blocksVision:!0}),i.push({x1:j-Z,z1:K-me,x2:j+Z,z2:K+me,kind:"crate"});const Ae=new lt;Ae.position.set(j,k,K),Ae.rotation.y=N;const W=new Je({color:$,roughness:.5,metalness:.4}),ne=new Je({color:2504e3,roughness:.2,metalness:.7}),le=new Je({color:1776927,roughness:.9}),se=new We(new Pe(1.9,.65,4),W);se.position.set(0,.62,0),se.castShadow=!0,se.receiveShadow=!0,Ae.add(se);const be=new We(new Pe(1.68,.62,2),W);be.position.set(0,1.2,-.15),be.castShadow=!0,Ae.add(be);const Le=new We(new Pe(1.72,.44,1.75),ne);Le.position.set(0,1.22,-.15),Ae.add(Le);for(const[Fe,Ge]of[[-.92,-1.25],[.92,-1.25],[-.92,1.25],[.92,1.25]]){const te=new We(new Ut(.36,.36,.26,12),le);te.rotation.z=Math.PI/2,te.position.set(Fe,.36,Ge),Ae.add(te)}n.add(Ae)},_=new We(new Pe(104,1,108),s);_.position.set(2,-.5,6),_.receiveShadow=!0,n.add(_),e.push({minX:-50,maxX:54,minY:-1,maxY:0,minZ:-48,maxZ:60,material:"ground",blocksVision:!0}),m(-45,0,-41,-43,7.5,55,{trimCap:!0}),m(46,0,-41,48,7.5,55,{trimCap:!0}),m(-45,0,-41,48,7.5,-39,{trimCap:!0}),m(-45,0,53,48,7.5,55,{trimCap:!0});const g=new Je({color:13216639,roughness:.95}),S=[[-58,0,-30,10,14,14],[-56,0,10,8,12,16],[56,0,-25,10,16,16],[58,0,20,12,13,18],[-20,0,-54,16,15,10],[22,0,-56,18,17,12],[0,0,68,22,14,10]];for(const[j,k,K,N,$,J]of S){const Z=new We(new Pe(N,$,J),g);Z.position.set(j,k+$*.5,K),n.add(Z)}m(-16,0,36,18,2,53,{material:"ground",mapKind:"elevated",castShadow:!1}),m(-16,2,35.4,-4.2,3.15,36.2,{trimCap:!1}),m(4.2,2,35.4,18,3.15,36.2,{trimCap:!1}),m(-12,2,46,-9.5,3.6,48.5,{material:"crate"}),m(10,2,47,12.5,3.5,49.5,{material:"crate"}),v(13.2,2,48.2,3497085),x(-4,28,4,36,0,2,"+z",8),x(18,36,24,48,2,0,"+x",0),x(-24,36,-16,48,0,2,"+x",0),m(-43,0,47,-24,5.5,53,{trimCap:!0}),m(36,0,47,46,5.5,53,{trimCap:!0}),m(-7.2,0,6,-6,6.2,36,{trimCap:!0}),m(-7.2,0,-11.5,-6,6.2,-2,{trimCap:!0}),m(-7.2,3.8,-2,-6,6.2,6,{mapKind:null}),m(12,0,12,13.5,6,26,{trimCap:!0}),m(4.5,0,18.5,7.2,1.5,21,{material:"crate"}),m(-4.2,0,14.5,-2,1.4,16.8,{material:"crate"}),m(2,0,-5.8,4.8,1.55,-3,{material:"crate"}),m(4.8,0,-5.2,6,.78,-3.8,{material:"crate"}),m(-16,0,-12.8,-4.5,6.5,-11.4,{trimCap:!0}),m(4.5,0,-12.8,14,6.5,-11.4,{trimCap:!0}),m(-4.5,4.1,-12.8,4.5,6.5,-11.4,{mapKind:null}),m(-4.5,0,-12.35,-1.25,4.05,-11.75,{material:"door",mapKind:"door"}),m(1.25,0,-13,4.5,4.05,-12.4,{material:"door",mapKind:"door"}),m(-4.7,0,-12.9,-4.3,4.2,-11.3,{customMat:f,mapKind:null}),m(4.3,0,-12.9,4.7,4.2,-11.3,{customMat:f,mapKind:null}),m(-7.5,0,-17.5,-5.2,1.45,-15.2,{material:"crate"}),x(8,6,14,12,0,2.4,"+x",10),m(8,0,12,14,3.2,12.6,{mapKind:"wall"}),m(8,0,5.4,14,2.6,6,{mapKind:"wall"}),m(14,0,-26,19.5,2.4,12,{material:"ground",mapKind:"elevated",castShadow:!0}),m(19.5,0,-20,22,6.2,12,{trimCap:!0}),m(13.3,2.4,-4,14,5.2,6,{mapKind:"wall"}),m(13.4,2.4,-16,14,3.45,-4,{mapKind:"wall"}),m(16.8,2.4,-14.5,19.2,3.8,-12.2,{material:"crate"}),x(19.5,-26,22.5,-20,2.4,2.8,"+x",4),m(14,0,-30,22,4.8,-26,{trimCap:!0}),x(14,-37,22.5,-30,0,2.8,"+x",11),m(14,0,-39,22.5,5.8,-37,{trimCap:!0}),m(3.5,0,-36.5,5.8,1.5,-34.2,{material:"metal"}),v(6.5,0,-35.8,3889481),m(22.5,0,-39,46,2.8,-20,{material:"ground",mapKind:"elevated",castShadow:!0}),m(22.5,2.8,-20.6,31,4.1,-19.8,{mapKind:"wall"}),m(41,2.8,-20.6,46,5.6,-19.8,{trimCap:!1}),m(38.5,2.8,-34,40.5,6.2,-32,{trimCap:!1}),m(28,2.8,-30.5,30.6,4.8,-27.9,{material:"crate"}),m(28.3,4.8,-30.2,30.3,6.3,-28.2,{material:"crate"}),m(30.6,2.8,-29.8,32.8,4.3,-27.6,{material:"metal"}),m(25,2.8,-25,27.2,4.2,-23,{material:"crate"}),v(35.2,2.8,-24.2,8139561),v(36.1,2.8,-23.7,3497085);const A=new We(new Wi(3.2,3.2),new Rt({map:r.siteADecal,transparent:!0,depthWrite:!1}));A.position.set(32,5.1,-38.92),n.add(A);const T=new We(new Wi(11,10),new Rt({map:r.siteFloorA,transparent:!0,depthWrite:!1}));T.rotation.x=-Math.PI/2,T.position.set(30.5,2.82,-28.5),n.add(T),i.push({x1:25,z1:-34,x2:36,z2:-22,kind:"site"}),x(31,-20,41,-10,0,2.8,"-z",0),m(22,0,-20,31,5.4,-10,{trimCap:!0}),m(22,0,-10,32,6.2,24,{trimCap:!0}),m(21.4,0,24,22.4,5.2,26.5,{mapKind:"wall"}),m(21.4,0,34,22.4,5.2,36,{mapKind:"wall"}),m(22,0,35.5,24.2,5.2,36.5,{mapKind:"wall"}),m(29.8,0,35.5,32.5,5.2,36.5,{mapKind:"wall"}),m(31.5,0,24,32.5,5.2,26.5,{mapKind:"wall"}),m(31.5,0,33,32.5,5.2,36.5,{mapKind:"wall"}),m(31.7,0,26.5,32.3,3.6,28,{customMat:u,material:"door",mapKind:"door"}),m(31.7,0,31.5,32.3,3.6,33,{customMat:u,material:"door",mapKind:"door"}),m(21.4,4.6,24,32.5,5.3,36.5,{mapKind:"tunnel",castShadow:!0}),m(32.5,0,14.5,35.2,1.85,18.2,{customMat:u,material:"metal"}),d(42.5,0,-2.5,.05,10175796),m(39.5,0,29,42.2,1.45,31.5,{material:"crate"}),m(42.5,0,32.5,45.2,1.9,35,{material:"crate"}),m(32.5,0,-2,34.8,1.5,.5,{material:"crate"}),m(-43,0,27.5,-34,5.8,29,{tunnel:!0}),m(-27,0,27.5,-21,5.8,29,{tunnel:!0}),m(-34,3.8,27.5,-27,5.8,29,{tunnel:!0,mapKind:null}),m(-22.5,0,6,-21,5.8,28.5,{tunnel:!0}),m(-22.5,0,-12,-21,5.8,-2,{tunnel:!0}),m(-22.5,3.8,-2,-21,5.8,6,{tunnel:!0,mapKind:null}),m(-43,0,-12.8,-34,6.2,-11.4,{tunnel:!0}),m(-26,0,-12.8,-15.5,6.2,-11.4,{tunnel:!0}),m(-34,3.8,-12.8,-26,6.2,-11.4,{tunnel:!0,mapKind:null}),m(-43,4.6,-12.5,-21,5.6,28.5,{tunnel:!0,mapKind:"tunnel"}),m(-31.5,0,12,-29,4.6,14.5,{tunnel:!0}),m(-39.5,0,16,-37,1.5,18.5,{material:"crate"}),m(-25.5,0,20,-23,1.5,22.5,{material:"crate"}),m(-38,0,2,-35.6,1.5,4.5,{material:"crate"}),m(-21,0,6,-7.2,5.4,7.2,{tunnel:!0}),m(-21,0,-3.2,-7.2,5.4,-2,{tunnel:!0}),m(-21,4.4,-3,-7.2,5.4,7,{tunnel:!0,mapKind:"tunnel"}),m(-36,0,35,-33.5,1.5,37.5,{material:"crate"}),m(-16.2,0,-17,-15,6.5,-12,{trimCap:!0}),m(-16.2,0,-29,-15,6.5,-23,{trimCap:!0}),m(-16.2,0,-39,-15,6.5,-33,{trimCap:!0}),m(-16.2,3.9,-23,-15,6.5,-17,{mapKind:null}),m(-16.2,3.6,-33,-15,6.5,-29,{mapKind:null}),m(-16,0,-23,-15.3,3.85,-21.3,{material:"door",mapKind:"door"}),m(-16,0,-18.7,-15.3,3.85,-17,{material:"door",mapKind:"door"}),m(-16.2,0,-33,-15,.85,-29,{mapKind:null}),x(-18.2,-33,-16.2,-29,0,.85,"+x",3),x(-15,-33,-13,-29,.85,0,"+x",3),m(-43,0,-39,-34,.9,-27,{material:"ground",mapKind:"elevated"}),x(-34,-36,-30.5,-28,.9,0,"+x",4),m(-31,0,-26.5,-28.4,2,-24,{material:"crate"}),m(-30.7,2,-26.2,-28.7,3.5,-24.3,{material:"crate"}),m(-28.4,0,-25.8,-26.2,1.45,-23.8,{material:"metal"}),m(-38,.9,-34,-35.6,2.5,-31.6,{material:"crate"}),d(-21.5,0,-15.8,Math.PI*.42,5401436),v(-39.5,0,-19,8139561),v(-38.6,0,-18.4,4545124);const E=new We(new Wi(3.2,3.2),new Rt({map:r.siteBDecal,transparent:!0,depthWrite:!1}));E.position.set(-29,3.8,-38.92),n.add(E);const C=new We(new Wi(11,12),new Rt({map:r.siteFloorB,transparent:!0,depthWrite:!1}));C.rotation.x=-Math.PI/2,C.position.set(-28.5,.03,-25.5),n.add(C),i.push({x1:-34,z1:-32,x2:-22,z2:-19,kind:"site"});const z=[[-31,4.1,20],[-31,4.1,4],[-30,4.1,-6],[-14,3.9,2],[27,4.1,30]],y=new Rt({color:16770218});for(const[j,k,K]of z){const N=new We(new Pe(.6,.16,.6),y);N.position.set(j,k,K),n.add(N);const $=new Zl(16765578,14,22,1.4);$.position.set(j,k-.3,K),n.add($)}return{group:n,colliders:e,ramps:t,bombsites:[{id:"A",label:"A 点",minX:24.5,maxX:37.5,minY:2,maxY:6,minZ:-35,maxZ:-21.5,center:{x:30.8,y:2.8,z:-26.2}},{id:"B",label:"B 点",minX:-35.5,maxX:-21.5,minY:-.5,maxY:3.5,minZ:-33,maxZ:-18.5,center:{x:-27.2,y:0,z:-28}}],callouts:[{name:"A 点 (Bombsite A)",minX:22,maxX:46,minZ:-39,maxZ:-20,priority:3},{name:"B 点 (Bombsite B)",minX:-43,maxX:-16,minZ:-39,maxZ:-12,priority:3},{name:"CT 出生点",minX:-1,maxX:15,minZ:-39,maxZ:-25,priority:3},{name:"T 出生点",minX:-18,maxX:20,minZ:36,maxZ:53,priority:3},{name:"猫道 (Catwalk / Short)",minX:12,maxX:22,minZ:-26,maxZ:13,priority:3},{name:"A 大 (A Long)",minX:31,maxX:46,minZ:-20,maxZ:38,priority:2},{name:"A 大门 (Long Doors)",minX:21,maxX:33,minZ:24,maxZ:37,priority:3},{name:"中门 (Mid Doors)",minX:-7,maxX:8,minZ:-16,maxZ:-7,priority:4},{name:"中路 (Middle)",minX:-7,maxX:13,minZ:-12,maxZ:36,priority:1},{name:"CT 中路 (CT Mid)",minX:-16,maxX:13,minZ:-28,maxZ:-12,priority:2},{name:"B 洞下层 (Lower Tunnels)",minX:-22,maxX:-6,minZ:-3,maxZ:7,priority:3},{name:"B 洞 (B Tunnels)",minX:-43,maxX:-21,minZ:-12,maxZ:30,priority:2},{name:"B 洞外 (Outside Tunnels)",minX:-43,maxX:-16,minZ:28,maxZ:48,priority:1},{name:"A 大外 (Outside Long)",minX:18,maxX:46,minZ:36,maxZ:48,priority:1}],spawnsCT:[{x:6.5,y:0,z:-31.5},{x:9.5,y:0,z:-32},{x:3.5,y:0,z:-30.5},{x:11.5,y:0,z:-33.5},{x:7.5,y:0,z:-28.5}],spawnsT:[{x:0,y:2,z:44},{x:-4.5,y:2,z:45},{x:4.5,y:2,z:45},{x:-8,y:2,z:42.5},{x:8,y:2,z:42.5}],minimapRects:i,bounds:{minX:-45,maxX:48,minZ:-41,maxZ:55}}}function HT(n,e,t){let i=null;for(const r of t)n>=r.minX&&n<=r.maxX&&e>=r.minZ&&e<=r.maxZ&&(!i||(r.priority??0)>(i.priority??0))&&(i=r);return i?i.name:"Dust2"}const Za=.42,GT=1.8,VT=1.25,Ka=1.62,$a=1.12,WT=21.5,XT=7.4,Lf=.52;function jT(n,e,t){let i=0;return n.axis==="+x"?i=(e-n.minX)/Math.max(.001,n.maxX-n.minX):n.axis==="-x"?i=(n.maxX-e)/Math.max(.001,n.maxX-n.minX):n.axis==="+z"?i=(t-n.minZ)/Math.max(.001,n.maxZ-n.minZ):i=(n.maxZ-t)/Math.max(.001,n.maxZ-n.minZ),i=Math.max(0,Math.min(1,i)),n.yStart+(n.yEnd-n.yStart)*i}function Kl(n,e,t,i,r,s){let o=-100;const a=t+Lf;for(let c=0;c<r.length;c++){const h=r[c];n+i>h.minX&&n-i<h.maxX&&e+i>h.minZ&&e-i<h.maxZ&&h.maxY<=a&&h.maxY>o&&(o=h.maxY)}const l=i*.65;for(let c=0;c<s.length;c++){const h=s[c];if(n>=h.minX-l&&n<=h.maxX+l&&e>=h.minZ-l&&e<=h.maxZ+l){const u=Math.max(h.minX,Math.min(h.maxX,n)),f=Math.max(h.minZ,Math.min(h.maxZ,e)),p=jT(h,u,f);p<=a+.3&&p>o&&(o=p)}}return o>-50?o:0}function YT(n,e,t,i){const r=n.y+Lf,s=n.y+t-.05;for(let o=0;o<3;o++)for(let a=0;a<i.length;a++){const l=i[a];if(l.maxY<=r||l.minY>=s)continue;const c=Math.max(l.minX,Math.min(n.x,l.maxX)),h=Math.max(l.minZ,Math.min(n.z,l.maxZ)),u=n.x-c,f=n.z-h,p=u*u+f*f;if(p<e*e)if(p>1e-8){const m=Math.sqrt(p),x=e-m+.001;n.x+=u/m*x,n.z+=f/m*x}else{const m=Math.abs(n.x-l.minX),x=Math.abs(l.maxX-n.x),v=Math.abs(n.z-l.minZ),d=Math.abs(l.maxZ-n.z),_=Math.min(m,x,v,d);_===m?n.x=l.minX-e-.002:_===x?n.x=l.maxX+e+.002:_===v?n.z=l.minZ-e-.002:n.z=l.maxZ+e+.002}}}function ZT(n,e,t,i,r,s){let o=999;const a=r*.85;for(let l=0;l<s.length;l++){const c=s[l];n+a>c.minX&&n-a<c.maxX&&e+a>c.minZ&&e-a<c.maxZ&&c.minY>=t+i*.5&&c.minY<o&&(o=c.minY)}return o}function gr(n,e,t,i){const r=n.crouching?VT:GT;let s=0;const o=Math.hypot(n.vel.x*e,n.vel.z*e),a=Math.max(1,Math.ceil(o/.25)),l=e/a;for(let u=0;u<a;u++){n.pos.x+=n.vel.x*l,n.pos.z+=n.vel.z*l;const f=Kl(n.pos.x,n.pos.z,n.pos.y,Za,t,i);n.onGround&&f>n.pos.y&&f<=n.pos.y+Lf+.25&&(n.pos.y=f),YT(n.pos,Za,r,t)}const c=n.onGround;if(n.vel.y-=WT*e,n.pos.y+=n.vel.y*e,n.vel.y>0){const u=ZT(n.pos.x,n.pos.z,n.pos.y,r,Za,t);n.pos.y+r>u&&(n.pos.y=u-r,n.vel.y=0)}const h=Kl(n.pos.x,n.pos.z,n.pos.y,Za,t,i);return n.pos.y<=h?(!c&&n.vel.y<-3.5&&(s=-n.vel.y),n.pos.y=h,n.vel.y=0,n.onGround=!0):c&&n.vel.y<=0&&n.pos.y-h<=.32?(n.pos.y=h,n.vel.y=0,n.onGround=!0):n.onGround=!1,{landedSpeed:s}}function d_(n,e,t,i,r=!1){let s=t,o={x:0,y:1,z:0},a="sandstone",l=!1;const c=Math.abs(e.x)>1e-8?1/e.x:1e12,h=Math.abs(e.y)>1e-8?1/e.y:1e12,u=Math.abs(e.z)>1e-8?1/e.z:1e12;for(let f=0;f<i.length;f++){const p=i[f];if(r&&p.blocksVision===!1)continue;let m=(p.minX-n.x)*c,x=(p.maxX-n.x)*c,v=-1;if(m>x){const O=m;m=x,x=O,v=1}let d=(p.minY-n.y)*h,_=(p.maxY-n.y)*h,g=-1;if(d>_){const O=d;d=_,_=O,g=1}let S=(p.minZ-n.z)*u,A=(p.maxZ-n.z)*u,T=-1;if(S>A){const O=S;S=A,A=O,T=1}let E=m,C=v,z=0,y=0;d>E&&(E=d,C=0,z=g,y=0),S>E&&(E=S,C=0,z=0,y=T),Math.min(x,_,A)>=Math.max(0,E)&&E>=0&&E<s&&(s=E,o={x:C,y:z,z:y},a=p.material,l=!0)}return l?{distance:s,point:{x:n.x+e.x*s,y:n.y+e.y*s,z:n.z+e.z*s},normal:o,material:a}:null}function Ao(n,e,t){const i=e.x-n.x,r=e.y-n.y,s=e.z-n.z,o=Math.hypot(i,r,s);if(o<.05)return!0;const a={x:i/o,y:r/o,z:s/o};return d_(n,a,o-.1,t,!0)===null}const KT={head:2,stomach:1.2,chest:1,arm:.8,leg:.75},$T={head:"爆头",chest:"胸部",stomach:"腹部",arm:"手臂",leg:"腿部"},Yt={ak47:{id:"ak47",name:"AK-47",shortName:"AK-47",slot:"primary",price:2700,baseDamage:48,armorPenetration:.78,fireInterval:.1,automatic:!0,magSize:30,reserveMax:90,reloadTime:2.4,moveSpeedMultiplier:.88,baseSpread:.004,moveSpread:.042,recoilSpreadPerShot:.017,maxSpread:.1,recoilPitch:.036,recoilYaw:.016,range:140,killReward:300},m4a4:{id:"m4a4",name:"M4A4",shortName:"M4A4",slot:"primary",price:3100,baseDamage:38,armorPenetration:.72,fireInterval:.088,automatic:!0,magSize:30,reserveMax:90,reloadTime:2.15,moveSpeedMultiplier:.9,baseSpread:.003,moveSpread:.032,recoilSpreadPerShot:.009,maxSpread:.056,recoilPitch:.017,recoilYaw:.007,range:140,killReward:300},awp:{id:"awp",name:"AWP",shortName:"AWP",slot:"primary",price:4750,baseDamage:120,armorPenetration:.96,fireInterval:1.48,automatic:!1,magSize:5,reserveMax:30,reloadTime:3.1,moveSpeedMultiplier:.8,baseSpread:.052,moveSpread:.065,recoilSpreadPerShot:.05,maxSpread:.12,recoilPitch:.075,recoilYaw:.012,range:200,canScope:!0,killReward:100},glock:{id:"glock",name:"Glock-18",shortName:"Glock",slot:"secondary",price:200,baseDamage:28,armorPenetration:.5,fireInterval:.15,automatic:!1,magSize:20,reserveMax:120,reloadTime:1.95,moveSpeedMultiplier:.97,baseSpread:.007,moveSpread:.022,recoilSpreadPerShot:.011,maxSpread:.055,recoilPitch:.014,recoilYaw:.006,range:95,killReward:300},usp:{id:"usp",name:"USP-S",shortName:"USP-S",slot:"secondary",price:200,baseDamage:35,armorPenetration:.54,fireInterval:.17,automatic:!1,magSize:12,reserveMax:24,reloadTime:2.05,moveSpeedMultiplier:.97,baseSpread:.0045,moveSpread:.024,recoilSpreadPerShot:.011,maxSpread:.05,recoilPitch:.015,recoilYaw:.005,range:105,suppressed:!0,killReward:300},deagle:{id:"deagle",name:"Desert Eagle",shortName:"沙鹰",slot:"secondary",price:700,baseDamage:56,armorPenetration:.91,fireInterval:.24,automatic:!1,magSize:7,reserveMax:35,reloadTime:2.2,moveSpeedMultiplier:.94,baseSpread:.005,moveSpread:.044,recoilSpreadPerShot:.032,maxSpread:.095,recoilPitch:.045,recoilYaw:.016,range:120,killReward:300},knife:{id:"knife",name:"战术匕首",shortName:"刀",slot:"melee",price:0,baseDamage:35,heavyDamage:65,armorPenetration:.85,fireInterval:.42,heavyInterval:.85,automatic:!1,magSize:0,reserveMax:0,reloadTime:0,moveSpeedMultiplier:1.08,baseSpread:0,moveSpread:0,recoilSpreadPerShot:0,maxSpread:0,recoilPitch:0,recoilYaw:0,range:2.55,isMelee:!0,killReward:1500},c4:{id:"c4",name:"C4 炸弹",shortName:"C4",slot:"c4",price:0,baseDamage:0,armorPenetration:0,fireInterval:.5,automatic:!1,magSize:0,reserveMax:0,reloadTime:0,moveSpeedMultiplier:1.04,baseSpread:0,moveSpread:0,recoilSpreadPerShot:0,maxSpread:0,recoilPitch:0,recoilYaw:0,range:0,isUtility:!0,killReward:0}};function qT(n,e,t,i,r,s){const o=s??n.baseDamage,a=n.id==="awp"?.001:n.slot==="primary"?.003:n.slot==="secondary"?.0065:0,l=Math.max(.55,1-Math.max(0,r-12)*a),c=o*KT[e]*l;if(t>0&&(e==="chest"||e==="stomach"||e==="arm"||e==="head"&&i)){const u=c*n.armorPenetration,f=c-u,p=Math.min(t,Math.max(1,Math.round(f*.55)));return{hpDamage:Math.max(1,Math.round(u)),armorDamage:p,rawDamage:Math.round(c),zone:e,armorMitigated:!0}}return{hpDamage:Math.max(1,Math.round(c)),armorDamage:0,rawDamage:Math.round(c),zone:e,armorMitigated:!1}}function n0(n){return n==="CT"?"usp":"glock"}function JT(n){return n==="CT"?"m4a4":"ak47"}const QT=[{zone:"head",minX:-.15,maxX:.15,minY:1.5,maxY:1.84,minZ:-.15,maxZ:.15},{zone:"chest",minX:-.23,maxX:.23,minY:1.15,maxY:1.5,minZ:-.15,maxZ:.15},{zone:"stomach",minX:-.21,maxX:.21,minY:.84,maxY:1.15,minZ:-.14,maxZ:.14},{zone:"arm",minX:-.37,maxX:-.21,minY:1,maxY:1.48,minZ:-.26,maxZ:.12},{zone:"arm",minX:.21,maxX:.37,minY:1,maxY:1.48,minZ:-.26,maxZ:.12},{zone:"leg",minX:-.22,maxX:-.02,minY:0,maxY:.84,minZ:-.14,maxZ:.14},{zone:"leg",minX:.02,maxX:.22,minY:0,maxY:.84,minZ:-.14,maxZ:.14}],eA=[{zone:"head",minX:-.15,maxX:.15,minY:1.04,maxY:1.36,minZ:-.18,maxZ:.12},{zone:"chest",minX:-.24,maxX:.24,minY:.72,maxY:1.04,minZ:-.17,maxZ:.15},{zone:"stomach",minX:-.22,maxX:.22,minY:.48,maxY:.72,minZ:-.16,maxZ:.16},{zone:"arm",minX:-.38,maxX:-.22,minY:.62,maxY:1.02,minZ:-.28,maxZ:.12},{zone:"arm",minX:.22,maxX:.38,minY:.62,maxY:1.02,minZ:-.28,maxZ:.12},{zone:"leg",minX:-.23,maxX:-.02,minY:0,maxY:.48,minZ:-.22,maxZ:.18},{zone:"leg",minX:.02,maxX:.23,minY:0,maxY:.48,minZ:-.22,maxZ:.18}];function tA(n,e,t,i,r,s,o,a){const l=Math.abs(i)>1e-8?1/i:1e12,c=Math.abs(r)>1e-8?1/r:1e12,h=Math.abs(s)>1e-8?1/s:1e12;let u=(o.minX-n)*l,f=(o.maxX-n)*l;if(u>f){const g=u;u=f,f=g}let p=(o.minY-e)*c,m=(o.maxY-e)*c;if(p>m){const g=p;p=m,m=g}let x=(o.minZ-t)*h,v=(o.maxZ-t)*h;if(x>v){const g=x;x=v,v=g}const d=Math.max(u,p,x);return Math.min(f,m,v)>=Math.max(0,d)&&d>=0&&d<a?d:null}function nA(n,e,t,i,r,s){const o=i.y+(s?.68:.92),a=i.x-n.x,l=o-n.y,c=i.z-n.z,h=a*e.x+l*e.y+c*e.z;if(h<-1.1||h>t+1.1||a*a+l*l+c*c-Math.max(0,h)*Math.max(0,h)>1.35*1.35)return null;const f=Math.cos(-r),p=Math.sin(-r),m=n.x-i.x,x=n.y-i.y,v=n.z-i.z,d=m*f+v*p,_=x,g=-m*p+v*f,S=e.x*f+e.z*p,A=e.y,T=-e.x*p+e.z*f,E=s?eA:QT;let C=t,z=null;for(let y=0;y<E.length;y++){const w=E[y],O=tA(d,_,g,S,A,T,w,C+.08);if(O!==null){const G=w.zone==="head"&&z!=="head"&&O<=C+.06;(O<C||G)&&(C=O,z=w.zone)}}return z?{distance:C,zone:z,point:{x:n.x+e.x*C,y:n.y+e.y*C,z:n.z+e.z*C}}:null}function $l(n){const e=new lt,t=new Je({color:2764082,roughness:.42,metalness:.72}),i=new Je({color:1974308,roughness:.72,metalness:.25}),r=new Je({color:8079908,roughness:.65,metalness:.08}),s=new Je({color:13160406,roughness:.26,metalness:.88}),o=new Je({color:4939071,roughness:.68,metalness:.2}),a=new Je({color:2845859,roughness:.15,metalness:.9}),l=new Je({color:12042956,roughness:.22,metalness:.92}),c=new Je({color:12757616,roughness:.8}),h=new Je({color:3033652,roughness:.6}),u=new Rt({color:7208840}),f=new Rt({color:16722731}),p=(m,x,v,d,_,g=0,S=0,A=0)=>{const T=new We(m,x);return T.position.set(v,d,_),T.rotation.set(g,S,A),e.add(T),T};if(n==="ak47")p(new Pe(.055,.085,.34),t,0,.01,-.02),p(new Pe(.048,.095,.24),r,0,-.015,.25,.12,0,0),p(new Pe(.056,.068,.21),r,0,.012,-.29),p(new Ut(.012,.012,.42,10),t,0,.015,-.49,Math.PI/2),p(new Ut(.014,.014,.22,8),t,0,.042,-.35,Math.PI/2),p(new Pe(.014,.048,.018),t,0,.048,-.66),p(new Pe(.036,.14,.068),r,0,-.085,-.11,.22,0,0),p(new Pe(.034,.12,.064),r,0,-.19,-.155,.48,0,0),p(new Pe(.038,.11,.048),r,0,-.075,.09,-.28,0,0),p(new Pe(.03,.014,.022),s,.036,.028,-.06);else if(n==="m4a4")p(new Pe(.056,.092,.3),i,0,.012,-.02),p(new Pe(.032,.016,.44),t,0,.064,-.14),p(new Pe(.032,.036,.035),i,0,.085,.06),p(new Ut(.02,.02,.18,8),i,0,.02,.2,Math.PI/2),p(new Pe(.046,.105,.12),i,0,-.005,.28),p(new Pe(.058,.064,.24),t,0,.018,-.29),p(new Ut(.012,.012,.3,10),t,0,.018,-.52,Math.PI/2),p(new Ut(.017,.015,.06,8),i,0,.018,-.68,Math.PI/2),p(new Pe(.016,.058,.034),t,0,.058,-.45),p(new Pe(.034,.17,.066),t,0,-.095,-.1,.12,0,0),p(new Pe(.036,.11,.046),i,0,-.075,.08,-.26,0,0);else if(n==="awp")p(new Pe(.06,.082,.56),o,0,0,-.14),p(new Pe(.052,.105,.28),o,0,-.018,.24),p(new Pe(.046,.03,.13),i,0,.045,.22),p(new Ut(.016,.019,.62,12),t,0,.028,-.68,Math.PI/2),p(new Pe(.04,.034,.075),i,0,.028,-1),p(new Pe(.028,.042,.025),i,0,.068,-.02),p(new Pe(.028,.042,.025),i,0,.068,-.18),p(new Ut(.022,.022,.34,14),i,0,.105,-.12,Math.PI/2),p(new Ut(.032,.024,.08,14),i,0,.105,-.32,Math.PI/2),p(new Ut(.028,.028,.01,14),a,0,.105,-.36,Math.PI/2),p(new Ut(.008,.008,.055,8),s,.045,.025,.04,0,0,Math.PI/2),p(new Pe(.038,.095,.08),i,0,-.075,-.12),p(new Ut(.009,.009,.22,8),t,-.028,-.035,-.44,Math.PI/2),p(new Ut(.009,.009,.22,8),t,.028,-.035,-.44,Math.PI/2);else if(n==="glock")p(new Pe(.038,.044,.22),i,0,.032,-.06),p(new Pe(.034,.026,.2),t,0,.002,-.05),p(new Pe(.034,.115,.052),i,0,-.055,.02,-.22,0,0),p(new Pe(.012,.014,.014),s,0,.058,-.155);else if(n==="usp")p(new Pe(.038,.044,.22),t,0,.032,-.05),p(new Pe(.034,.026,.21),i,0,.002,-.05),p(new Pe(.034,.115,.05),i,0,-.055,.025,-.2,0,0),p(new Ut(.018,.018,.21,12),i,0,.028,-.26,Math.PI/2);else if(n==="deagle")p(new Pe(.046,.056,.29),s,0,.036,-.09),p(new Pe(.042,.028,.23),t,0,.002,-.06),p(new Pe(.04,.125,.062),i,0,-.058,.02,-.22,0,0),p(new Pe(.014,.016,.02),i,0,.068,-.21);else if(n==="knife")p(new Pe(.026,.038,.13),i,0,-.01,.02),p(new Pe(.036,.064,.014),t,0,0,-.048),p(new Pe(.008,.04,.18),l,0,.006,-.14),p(new Tf(.022,.07,4),l,0,.006,-.26,-Math.PI/2,Math.PI/4,0);else if(n==="c4"){p(new Pe(.22,.11,.15),c,0,0,-.08),p(new Pe(.18,.025,.11),h,0,.06,-.08),p(new Pe(.085,.012,.038),u,-.025,.074,-.095);const m=p(new _c(.012,8,8),f,.055,.076,-.095);m.name="c4_led",p(new Pe(.022,.118,.156),i,-.065,0,-.08),p(new Pe(.022,.118,.156),i,.065,0,-.08)}return e}class iA{constructor(){B(this,"root",new lt);B(this,"weaponPivot",new lt);B(this,"currentWeaponGroup",null);B(this,"armsGroup",new lt);B(this,"muzzleLight");B(this,"muzzleFlashMesh");B(this,"activeWeapon","usp");B(this,"activeTeam","CT");B(this,"bobPhase",0);B(this,"recoilZ",0);B(this,"recoilPitch",0);B(this,"swingPhase",0);B(this,"drawOffset",0);B(this,"swayX",0);B(this,"swayY",0);B(this,"muzzleTimer",0);this.root.add(this.weaponPivot),this.buildArms("CT"),this.weaponPivot.add(this.armsGroup),this.muzzleLight=new Zl(16758861,0,7),this.muzzleLight.position.set(.18,-.08,-.95),this.root.add(this.muzzleLight);const e=new Zo(.07,0),t=new Rt({color:16769674,transparent:!0,opacity:.9,depthTest:!1});this.muzzleFlashMesh=new We(e,t),this.muzzleFlashMesh.visible=!1,this.weaponPivot.add(this.muzzleFlashMesh),this.setWeapon("usp","CT")}buildArms(e){for(;this.armsGroup.children.length>0;)this.armsGroup.remove(this.armsGroup.children[0]);const t=e==="CT"?2702162:8087111,i=e==="CT"?1974824:3877920,r=new Je({color:t,roughness:.85}),s=new Je({color:i,roughness:.78}),o=new We(new Pe(.082,.082,.36),r);o.position.set(.09,-.13,.24),o.rotation.set(.28,-.18,0),this.armsGroup.add(o);const a=new We(new Pe(.072,.072,.1),s);a.position.set(.02,-.065,.07),this.armsGroup.add(a);const l=new We(new Pe(.08,.08,.38),r);l.position.set(-.22,-.15,.08),l.rotation.set(.22,.56,.12),this.armsGroup.add(l);const c=new We(new Pe(.07,.068,.1),s);c.position.set(-.04,-.055,-.16),this.armsGroup.add(c)}setWeapon(e,t){if(this.activeTeam!==t&&(this.activeTeam=t,this.buildArms(t)),this.activeWeapon===e&&this.currentWeaponGroup)return;this.activeWeapon=e,this.currentWeaponGroup&&this.weaponPivot.remove(this.currentWeaponGroup),this.currentWeaponGroup=$l(e),this.weaponPivot.add(this.currentWeaponGroup),this.drawOffset=1;const i=e==="awp"?-1.05:e==="ak47"||e==="m4a4"?-.74:e==="usp"?-.38:-.26;this.muzzleFlashMesh.position.set(0,.025,i)}triggerFire(e){if(e==="knife"){this.swingPhase=1;return}if(e==="c4")return;const t=e==="awp"?2.4:e==="deagle"?1.8:e==="ak47"?1.35:.85;if(this.recoilZ=Math.min(.16,this.recoilZ+.055*t),this.recoilPitch=Math.min(.32,this.recoilPitch+.085*t),e!=="usp"){this.muzzleTimer=.045,this.muzzleFlashMesh.rotation.set(Math.random()*6,Math.random()*6,Math.random()*6);const i=e==="awp"?1.55:e==="ak47"?1.15:.85;this.muzzleFlashMesh.scale.setScalar(i)}}addLookSway(e,t){this.swayX=Math.max(-.04,Math.min(.04,this.swayX-e*18e-5)),this.swayY=Math.max(-.03,Math.min(.03,this.swayY+t*18e-5))}update(e,t,i,r,s,o){this.root.visible=!o;const a=Math.exp(-e*12);this.swayX*=a,this.swayY*=a,this.recoilZ*=Math.exp(-e*16),this.recoilPitch*=Math.exp(-e*14),this.drawOffset=Math.max(0,this.drawOffset-e*4.5),this.swingPhase=Math.max(0,this.swingPhase-e*3.8),i&&t>.4?this.bobPhase+=e*(5.5+t*1.1):this.bobPhase+=e*1.3;const l=i?Math.min(1,t/5.5):.08,c=Math.cos(this.bobPhase)*.011*l,h=Math.abs(Math.sin(this.bobPhase))*.012*l,u=r?Math.sin(s*Math.PI):0,f=this.activeWeapon==="c4"?.04:this.activeWeapon==="knife"?.22:.24,p=this.activeWeapon==="c4"?-.26:-.21,m=this.activeWeapon==="awp"?-.44:this.activeWeapon==="knife"?-.38:-.46,x=this.activeWeapon==="knife"?-Math.sin(this.swingPhase*Math.PI)*.24:0,v=this.activeWeapon==="knife"?-Math.sin(this.swingPhase*Math.PI)*.16:0,d=this.activeWeapon==="knife"?Math.sin(this.swingPhase*Math.PI)*1.1:0;if(this.weaponPivot.position.set(f+c+this.swayX+x,p-h+this.swayY-this.drawOffset*.24-u*.14,m+this.recoilZ+v),this.weaponPivot.rotation.set(this.recoilPitch-this.drawOffset*.45-u*.42,d+(this.activeWeapon==="knife"?.25:.03),-this.swayX*1.6+u*.35),this.activeWeapon==="c4"&&this.currentWeaponGroup){const _=this.currentWeaponGroup.getObjectByName("c4_led");_&&(_.visible=Math.floor(performance.now()/350)%2===0)}this.muzzleTimer>0?(this.muzzleTimer-=e,this.muzzleFlashMesh.visible=!0,this.muzzleLight.intensity=6.5):(this.muzzleFlashMesh.visible=!1,this.muzzleLight.intensity=0)}}class rA{constructor(e){B(this,"root",new lt);B(this,"bodyPivot",new lt);B(this,"upperBody",new lt);B(this,"headGroup",new lt);B(this,"leftShoulder",new lt);B(this,"rightShoulder",new lt);B(this,"leftHip",new lt);B(this,"rightHip",new lt);B(this,"leftKnee",new lt);B(this,"rightKnee",new lt);B(this,"weaponMount",new lt);B(this,"weaponMesh",null);B(this,"backC4Mesh");B(this,"muzzleFlash");B(this,"allyMarker");B(this,"currentWeapon",null);B(this,"stridePhase",0);B(this,"recoilKick",0);B(this,"muzzleTimer",0);B(this,"deathFallProgress",0);B(this,"deathFallDir",1);this.team=e,this.root.add(this.bodyPivot);const t=e==="CT",i=new Je({color:t?2505039:10191449,roughness:.85}),r=new Je({color:t?1977405:6049083,roughness:.88}),s=new Je({color:t?1778475:4863269,roughness:.72,metalness:.15}),o=new Je({color:t?3889272:9384999,roughness:.78}),a=new Je({color:14002565,roughness:.76}),l=new Je({color:t?1382170:4535590,roughness:.85}),c=new Je({color:t?2436406:2301467,roughness:.55,metalness:.2}),h=new Je({color:t?3107737:1184791,roughness:.15,metalness:.85}),u=(d,_,g,S,A,T,E,C)=>{const z=new We(new Pe(d,_,g),S);return z.position.set(A,T,E),z.castShadow=!0,z.receiveShadow=!0,C.add(z),z};u(.36,.16,.22,r,0,.88,0,this.bodyPivot),u(.38,.06,.24,s,0,.94,0,this.bodyPivot),u(.08,.1,.08,s,-.2,.9,.02,this.bodyPivot),u(.08,.1,.08,s,.2,.9,.02,this.bodyPivot);const f=(d,_,g)=>{d.position.set(g*.11,.84,0),this.bodyPivot.add(d),u(.145,.4,.165,r,0,-.2,0,d),u(.12,.1,.05,s,0,-.4,-.085,d),_.position.set(0,-.42,0),d.add(_),u(.125,.34,.14,r,0,-.17,.01,_),u(.135,.12,.24,l,0,-.36,-.04,_)};f(this.leftHip,this.leftKnee,-1),f(this.rightHip,this.rightKnee,1),this.upperBody.position.set(0,.96,0),this.bodyPivot.add(this.upperBody),u(.35,.22,.21,i,0,.11,0,this.upperBody),u(.42,.32,.24,i,0,.36,0,this.upperBody),u(.44,.34,.28,s,0,.34,0,this.upperBody),u(.08,.12,.05,o,-.11,.26,-.155,this.upperBody),u(.08,.12,.05,o,0,.26,-.155,this.upperBody),u(.08,.12,.05,o,.11,.26,-.155,this.upperBody),t?(u(.28,.3,.12,s,0,.34,.18,this.upperBody),u(.02,.24,.02,l,-.1,.56,.18,this.upperBody)):u(.32,.09,.26,o,0,.52,0,this.upperBody),this.backC4Mesh=$l("c4"),this.backC4Mesh.position.set(0,.33,.2),this.backC4Mesh.rotation.set(Math.PI/2,0,0),this.backC4Mesh.scale.setScalar(1.05),this.backC4Mesh.visible=!1,this.upperBody.add(this.backC4Mesh),this.headGroup.position.set(0,.54,0),this.upperBody.add(this.headGroup),u(.11,.08,.11,t?c:a,0,.03,0,this.headGroup),u(.22,.24,.23,t?c:a,0,.18,0,this.headGroup),t?(u(.255,.14,.27,c,0,.245,.005,this.headGroup),u(.265,.05,.12,o,0,.22,-.1,this.headGroup),u(.21,.075,.05,h,0,.2,-.12,this.headGroup),u(.16,.08,.04,l,0,.11,-.11,this.headGroup)):(u(.245,.12,.25,o,0,.255,.01,this.headGroup),u(.24,.04,.255,l,0,.24,.005,this.headGroup),u(.2,.052,.04,h,0,.195,-.118,this.headGroup),u(.16,.06,.03,l,0,.11,-.112,this.headGroup)),this.leftShoulder.position.set(-.26,.45,0),this.upperBody.add(this.leftShoulder),u(.12,.11,.13,o,0,0,0,this.leftShoulder);const p=new lt;p.rotation.set(1.02,.42,.12),this.leftShoulder.add(p),u(.105,.28,.11,i,0,-.14,0,p);const m=new lt;m.position.set(0,-.27,0),m.rotation.set(.32,.25,0),p.add(m),u(.092,.25,.095,i,0,-.12,0,m),u(.082,.09,.09,l,0,-.26,0,m),this.rightShoulder.position.set(.26,.45,0),this.upperBody.add(this.rightShoulder),u(.12,.11,.13,o,0,0,0,this.rightShoulder);const x=new lt;x.rotation.set(.95,-.18,-.08),this.rightShoulder.add(x),u(.105,.28,.11,i,0,-.14,0,x);const v=new lt;v.position.set(0,-.27,0),v.rotation.set(.45,-.22,0),x.add(v),u(.092,.24,.095,i,0,-.12,0,v),u(.082,.09,.09,l,0,-.25,0,v),this.weaponMount.position.set(.14,.34,-.34),this.upperBody.add(this.weaponMount),this.muzzleFlash=new We(new Zo(.12,0),new Rt({color:16766571})),this.muzzleFlash.visible=!1,this.weaponMount.add(this.muzzleFlash),this.allyMarker=new We(new Zo(.09,0),new Rt({color:t?6013183:16760405})),this.allyMarker.position.set(0,2.15,0),this.allyMarker.visible=!1,this.root.add(this.allyMarker)}setWeapon(e){if(this.currentWeapon===e)return;this.currentWeapon=e,this.weaponMesh&&this.weaponMount.remove(this.weaponMesh),this.weaponMesh=$l(e),this.weaponMesh.scale.setScalar(1.12),this.weaponMount.add(this.weaponMesh);const t=e==="awp"?-1.1:e==="ak47"||e==="m4a4"?-.78:-.36;this.muzzleFlash.position.set(0,.03,t)}triggerFire(e=!1){this.recoilKick=.12,e||(this.muzzleTimer=.05,this.muzzleFlash.rotation.set(Math.random()*6,Math.random()*6,0))}resetAlive(){this.deathFallProgress=0,this.deathFallDir=Math.random()>.5?1:-1,this.bodyPivot.rotation.set(0,0,0),this.bodyPivot.position.set(0,0,0),this.root.visible=!0}update(e,t,i,r,s,o,a,l,c,h){if(this.root.position.set(t.x,t.y,t.z),this.root.rotation.y=i,this.root.visible=!h,this.backC4Mesh.visible=l&&a,this.allyMarker.visible=c&&a&&!h,this.allyMarker.visible&&(this.allyMarker.rotation.y+=e*2.5),!a){this.muzzleFlash.visible=!1,this.deathFallProgress=Math.min(1,this.deathFallProgress+e*3.4);const u=1-Math.pow(1-this.deathFallProgress,3);this.bodyPivot.rotation.x=u*(Math.PI*.48),this.bodyPivot.rotation.z=u*.25*this.deathFallDir,this.bodyPivot.position.y=u*.14;return}if(this.recoilKick*=Math.exp(-e*15),this.muzzleTimer>0?(this.muzzleTimer-=e,this.muzzleFlash.visible=!0):this.muzzleFlash.visible=!1,this.upperBody.rotation.x=Math.max(-.65,Math.min(.65,r*.72))+this.recoilKick,this.weaponMount.position.z=-.34+this.recoilKick*.45,o)this.bodyPivot.position.y=-.36,this.leftHip.rotation.x=.85,this.rightHip.rotation.x=.85,this.leftKnee.rotation.x=-1.35,this.rightKnee.rotation.x=-1.35;else if(this.bodyPivot.position.y=0,s>.35){this.stridePhase+=e*(4.5+s*1.45);const u=Math.sin(this.stridePhase)*Math.min(.75,s*.13);this.leftHip.rotation.x=u,this.rightHip.rotation.x=-u,this.leftKnee.rotation.x=Math.min(0,-Math.cos(this.stridePhase)*.55-.15),this.rightKnee.rotation.x=Math.min(0,Math.cos(this.stridePhase)*.55-.15)}else{const u=Math.exp(-e*12);this.leftHip.rotation.x*=u,this.rightHip.rotation.x*=u,this.leftKnee.rotation.x*=u,this.rightKnee.rotation.x*=u}}}const sA=[{id:"t_spawn_mid",x:0,y:2,z:44,zone:"T_SPAWN"},{id:"t_spawn_east",x:14,y:2,z:42,zone:"T_SPAWN"},{id:"t_spawn_west",x:-13,y:2,z:42,zone:"T_SPAWN"},{id:"suicide_top",x:0,y:2,z:36.5,zone:"T_SPAWN"},{id:"suicide_bot",x:0,y:0,z:27,zone:"MID"},{id:"top_mid",x:.5,y:0,z:20,zone:"MID"},{id:"top_mid_east",x:10,y:0,z:29.5,zone:"MID"},{id:"mid_center",x:1,y:0,z:9,zone:"MID"},{id:"mid_lower",x:-2.5,y:0,z:2,zone:"MID"},{id:"mid_xbox",x:-1,y:0,z:-5,zone:"MID"},{id:"mid_doors_s",x:0,y:0,z:-9.5,zone:"MID"},{id:"mid_doors_n",x:0,y:0,z:-15.5,zone:"MID"},{id:"ct_mid",x:-1.5,y:0,z:-21,zone:"MID"},{id:"ct_mid_w",x:-10.5,y:0,z:-20,zone:"MID"},{id:"ct_mid_nw",x:-10,y:0,z:-31,zone:"MID"},{id:"cat_stairs_bot",x:6.5,y:0,z:9,zone:"CAT"},{id:"cat_stairs_top",x:15.8,y:2.4,z:9,zone:"CAT"},{id:"cat_south",x:16.5,y:2.4,z:1,zone:"CAT"},{id:"cat_mid",x:15.5,y:2.4,z:-9,zone:"CAT"},{id:"cat_north",x:15.5,y:2.4,z:-17,zone:"CAT"},{id:"cat_short",x:18,y:2.4,z:-23,zone:"CAT"},{id:"ct_spawn_w",x:2,y:0,z:-29,zone:"CT_SPAWN"},{id:"ct_spawn_mid",x:7.5,y:0,z:-32,zone:"CT_SPAWN"},{id:"ct_ramp_bot",x:13,y:0,z:-33.5,zone:"CT_SPAWN"},{id:"t_east_ramp_top",x:17.5,y:2,z:42,zone:"A_LONG"},{id:"t_east_ramp_bot",x:25.5,y:0,z:42,zone:"A_LONG"},{id:"outside_long",x:27,y:0,z:38.5,zone:"A_LONG"},{id:"long_doors_in",x:27,y:0,z:34,zone:"A_LONG"},{id:"long_doors_room",x:27,y:0,z:29.75,zone:"A_LONG"},{id:"long_mid_conn",x:18,y:0,z:29.75,zone:"A_LONG"},{id:"long_doors_out",x:34,y:0,z:29.75,zone:"A_LONG"},{id:"a_long_south",x:37.5,y:0,z:26,zone:"A_LONG"},{id:"a_long_corner",x:38.5,y:0,z:16,zone:"A_LONG"},{id:"a_long_mid",x:38,y:0,z:5,zone:"A_LONG"},{id:"a_long_north",x:37.2,y:0,z:-5,zone:"A_LONG"},{id:"a_ramp_bot",x:35.5,y:0,z:-10,zone:"A_LONG"},{id:"a_ramp_top",x:34,y:2.8,z:-21.5,zone:"A_SITE"},{id:"a_site_plant",x:31.5,y:2.8,z:-25.5,zone:"A_SITE"},{id:"a_site_mid",x:25.8,y:2.8,z:-27.2,zone:"A_SITE"},{id:"a_site_short",x:23.5,y:2.8,z:-23,zone:"A_SITE"},{id:"a_site_ct",x:23.8,y:2.8,z:-33.5,zone:"A_SITE"},{id:"a_site_back",x:27.5,y:2.8,z:-34.5,zone:"A_SITE"},{id:"a_site_goose",x:35.5,y:2.8,z:-34.5,zone:"A_SITE"},{id:"t_west_ramp_top",x:-16.5,y:2,z:42,zone:"B_TUN"},{id:"t_west_ramp_bot",x:-25.5,y:0,z:42,zone:"B_TUN"},{id:"outside_b",x:-30.5,y:0,z:34.5,zone:"B_TUN"},{id:"b_tun_entry",x:-30.5,y:0,z:25.5,zone:"B_TUN"},{id:"b_tun_upper_w",x:-34.5,y:0,z:14,zone:"B_TUN"},{id:"b_tun_upper_e",x:-26,y:0,z:14,zone:"B_TUN"},{id:"b_tun_junction",x:-29.5,y:0,z:3.5,zone:"B_TUN"},{id:"b_tun_lower_w",x:-20,y:0,z:2,zone:"B_TUN"},{id:"b_tun_lower_e",x:-8.5,y:0,z:2,zone:"B_TUN"},{id:"b_tun_exit",x:-30,y:0,z:-9,zone:"B_TUN"},{id:"b_site_entry",x:-30,y:0,z:-15.5,zone:"B_SITE"},{id:"b_site_south",x:-27.5,y:0,z:-20,zone:"B_SITE"},{id:"b_site_west",x:-35.5,y:0,z:-21,zone:"B_SITE"},{id:"b_site_east_lane",x:-23.8,y:0,z:-25,zone:"B_SITE"},{id:"b_site_doors",x:-20,y:0,z:-20,zone:"B_SITE"},{id:"b_doors_gap",x:-15.6,y:0,z:-20,zone:"B_SITE"},{id:"b_site_plant",x:-26.5,y:0,z:-29.5,zone:"B_SITE"},{id:"b_site_window",x:-20.5,y:0,z:-31,zone:"B_SITE"},{id:"b_window_gap",x:-15.6,y:.85,z:-31,zone:"B_SITE"},{id:"b_site_plat",x:-36.5,y:.9,z:-29.5,zone:"B_SITE"}],oA=[["t_spawn_mid","suicide_top"],["t_spawn_mid","t_spawn_east"],["t_spawn_mid","t_spawn_west"],["t_spawn_east","t_east_ramp_top"],["t_spawn_west","t_west_ramp_top"],["suicide_top","suicide_bot"],["suicide_bot","top_mid"],["suicide_bot","top_mid_east"],["top_mid","top_mid_east"],["top_mid","mid_center"],["mid_center","cat_stairs_bot"],["mid_center","mid_lower"],["mid_lower","mid_xbox"],["mid_xbox","mid_doors_s"],["mid_doors_s","mid_doors_n"],["mid_doors_n","ct_mid"],["ct_mid","ct_mid_w"],["ct_mid","ct_spawn_w"],["ct_mid_w","ct_mid_nw"],["ct_mid_nw","ct_spawn_w"],["cat_stairs_bot","cat_stairs_top"],["cat_stairs_top","cat_south"],["cat_south","cat_mid"],["cat_mid","cat_north"],["cat_north","cat_short"],["cat_short","a_site_short"],["ct_spawn_w","ct_spawn_mid"],["ct_spawn_mid","ct_ramp_bot"],["ct_ramp_bot","a_site_ct"],["t_east_ramp_top","t_east_ramp_bot"],["t_east_ramp_bot","outside_long"],["outside_long","long_doors_in"],["long_doors_in","long_doors_room"],["top_mid_east","long_mid_conn"],["long_mid_conn","long_doors_room"],["long_doors_room","long_doors_out"],["long_doors_out","a_long_south"],["a_long_south","a_long_corner"],["a_long_corner","a_long_mid"],["a_long_mid","a_long_north"],["a_long_north","a_ramp_bot"],["a_ramp_bot","a_ramp_top"],["a_ramp_top","a_site_plant"],["a_ramp_top","a_site_goose"],["a_site_plant","a_site_mid"],["a_site_mid","a_site_short"],["a_site_mid","a_site_back"],["a_site_mid","a_site_ct"],["a_site_plant","a_site_goose"],["a_site_short","a_site_ct"],["a_site_ct","a_site_back"],["a_site_back","a_site_goose"],["t_west_ramp_top","t_west_ramp_bot"],["t_west_ramp_bot","outside_b"],["outside_b","b_tun_entry"],["b_tun_entry","b_tun_upper_w"],["b_tun_entry","b_tun_upper_e"],["b_tun_upper_w","b_tun_junction"],["b_tun_upper_e","b_tun_junction"],["b_tun_junction","b_tun_lower_w"],["b_tun_lower_w","b_tun_lower_e"],["b_tun_lower_e","mid_lower"],["b_tun_junction","b_tun_exit"],["b_tun_exit","b_site_entry"],["b_site_entry","b_site_south"],["b_site_entry","b_site_west"],["b_site_south","b_site_doors"],["b_site_south","b_site_west"],["b_site_south","b_site_east_lane"],["b_site_doors","b_site_east_lane"],["b_site_east_lane","b_site_plant"],["b_site_east_lane","b_site_window"],["b_site_doors","b_doors_gap"],["b_doors_gap","ct_mid_w"],["b_site_doors","b_site_window"],["b_site_plant","b_site_window"],["b_site_plant","b_site_plat"],["b_site_window","b_window_gap"],["b_window_gap","ct_mid_nw"]];class aA{constructor(){B(this,"nodes",new Map);B(this,"nodeList",[]);for(const e of sA){const t={...e,neighbors:[]};this.nodes.set(t.id,t),this.nodeList.push(t)}for(const[e,t]of oA){const i=this.nodes.get(e),r=this.nodes.get(t);i&&r&&(i.neighbors.includes(t)||i.neighbors.push(t),r.neighbors.includes(e)||r.neighbors.push(e))}}findNearestNode(e){let t=this.nodeList[0],i=1/0;for(let r=0;r<this.nodeList.length;r++){const s=this.nodeList[r],o=s.x-e.x,a=(s.y-e.y)*2.6,l=s.z-e.z,c=o*o+a*a+l*l;c<i&&(i=c,t=s)}return t}getNode(e){return this.nodes.get(e)}findPath(e,t){const i=this.findNearestNode(e),r=this.findNearestNode(t);if(i.id===r.id)return[{x:t.x,y:t.y,z:t.z}];const s=new Set([i.id]),o=new Map,a=new Map([[i.id,0]]),l=new Map([[i.id,this.dist(i,r)]]);for(;s.size>0;){let c="",h=1/0;for(const p of s){const m=l.get(p)??1/0;m<h&&(h=m,c=p)}if(c===r.id){const p=[];let m=c;for(;m;){const x=this.nodes.get(m);p.push({x:x.x,y:x.y,z:x.z}),m=o.get(m)}return p.reverse(),p.push({x:t.x,y:t.y,z:t.z}),p}s.delete(c);const u=this.nodes.get(c),f=a.get(c)??1/0;for(const p of u.neighbors){const m=this.nodes.get(p),x=f+this.dist(u,m);x<(a.get(p)??1/0)&&(o.set(p,c),a.set(p,x),l.set(p,x+this.dist(m,r)),s.add(p))}}return[{x:t.x,y:t.y,z:t.z}]}dist(e,t){return Math.hypot(e.x-t.x,(e.y-t.y)*1.4,e.z-t.z)}}const i0={0:["a_site_goose","a_site_plant","a_ramp_top"],1:["a_long_north","a_site_short","cat_short"],2:["mid_doors_n","ct_mid","cat_north"],3:["b_site_plant","b_site_plat","b_site_doors"],4:["b_site_window","b_site_south","ct_mid_w"]},lA=[["long_doors_room","a_long_corner","a_ramp_top","a_site_plant"],["long_doors_room","a_long_mid","a_site_goose"],["top_mid","cat_stairs_top","cat_north","a_site_short","a_site_plant"],["top_mid","cat_stairs_top","cat_mid","a_site_back"],["mid_center","mid_doors_n","ct_spawn_mid","a_site_ct"]],cA=[["b_tun_entry","b_tun_junction","b_site_entry","b_site_plant"],["b_tun_entry","b_tun_upper_w","b_site_entry","b_site_plat"],["b_tun_entry","b_tun_junction","b_site_south","b_site_doors"],["mid_lower","b_tun_lower_w","b_tun_exit","b_site_plant"],["mid_xbox","mid_doors_n","ct_mid_w","b_site_doors"]];function qa(n){for(;n>Math.PI;)n-=Math.PI*2;for(;n<-Math.PI;)n+=Math.PI*2;return n}class uA{constructor(e,t){B(this,"state","PATROL");B(this,"path",[]);B(this,"pathIndex",0);B(this,"goalPos",null);B(this,"repathTimer",0);B(this,"reactionTimer",0);B(this,"burstTimer",0);B(this,"burstPause",0);B(this,"strafeDir",1);B(this,"strafeTimer",0);B(this,"lastCheckPos",{x:0,y:0,z:0});B(this,"stuckTimer",0);B(this,"unstuckNudgeTimer",0);B(this,"unstuckDir",{x:0,z:0});B(this,"routeNodes",[]);B(this,"routeStep",0);B(this,"alertTargetPos",null);B(this,"alertTimer",0);B(this,"aimJitterX",0);B(this,"aimJitterY",0);B(this,"jitterTimer",0);this.slotIndex=e,this.team=t}resetForRound(e){if(this.path=[],this.pathIndex=0,this.goalPos=null,this.repathTimer=.1+Math.random()*.35,this.reactionTimer=0,this.burstTimer=0,this.burstPause=0,this.stuckTimer=0,this.unstuckNudgeTimer=0,this.alertTargetPos=null,this.alertTimer=0,this.routeStep=0,this.team==="CT"){const t=i0[this.slotIndex%5];this.routeNodes=[t[Math.floor(Math.random()*t.length)]],this.state="PATROL"}else{const t=e.targetSite==="A"?lA:cA;this.routeNodes=[...t[this.slotIndex%t.length]],this.state="ADVANCE_SITE"}}notifyDamageFrom(e){this.alertTargetPos={...e},this.alertTimer=3.5}update(e,t,i,r,s,o){const a={moveX:0,moveZ:0,walk:!1,crouch:!1,targetYaw:t.yaw,targetPitch:0,fire:!1,reload:!1,wantPlant:!1,wantDefuse:!1,spottedEnemyIds:[]};if(!t.alive)return a;this.repathTimer-=e,this.alertTimer=Math.max(0,this.alertTimer-e),this.jitterTimer-=e,this.jitterTimer<=0&&(this.jitterTimer=.18+Math.random()*.2,this.aimJitterX=(Math.random()-.5)*.045,this.aimJitterY=(Math.random()-.5)*.032);const l={x:t.pos.x,y:t.pos.y+1.56,z:t.pos.z};let c=null,h=1/0;const u=-Math.sin(t.yaw),f=-Math.cos(t.yaw);for(let _=0;_<i.length;_++){const g=i[_];if(!g.alive||g.team===t.team)continue;const S=g.pos.x-t.pos.x,A=g.pos.y-t.pos.y,T=g.pos.z-t.pos.z,E=Math.hypot(S,A,T);if(E>78)continue;const C=Math.hypot(S,T)+1e-4,z=(S*u+T*f)/C;if(!(E<6||z>.34))continue;const w={x:g.pos.x,y:g.pos.y+1.25,z:g.pos.z},O={x:g.pos.x,y:g.pos.y+1.62,z:g.pos.z};(Ao(l,w,s)||Ao(l,O,s))&&(a.spottedEnemyIds.push(g.id),E<h&&(h=E,c=g))}const p=o.targetSite==="A"?o.siteACenter:o.siteBCenter;let m=null,x=!1,v=!1;if(t.team==="T")if(o.bombState==="planted"&&o.bombPos){this.state="DEFEND_BOMB";const _=this.slotIndex*1.35%(Math.PI*2);m={x:o.bombPos.x+Math.cos(_)*4.5,y:o.bombPos.y,z:o.bombPos.z+Math.sin(_)*4.5}}else if(o.bombState==="dropped"&&o.bombPos)this.state="HUNT_BOMB",m=o.bombPos;else if(t.hasBomb){const _=Math.hypot(t.pos.x-p.x,t.pos.z-p.z),g=Math.abs(t.pos.y-p.y)<.9;_<3.2&&g&&!c?(this.state="PLANT_BOMB",x=!0,m=null):(this.state="ADVANCE_SITE",m=this.getRouteOrFallback(t.pos,r,p))}else this.state="ADVANCE_SITE",m=this.getRouteOrFallback(t.pos,r,p);else if(o.bombState==="planted"&&o.bombPos){const _=Math.hypot(t.pos.x-o.bombPos.x,t.pos.z-o.bombPos.z);o.defuserId===t.id&&_<2.2&&(!c||h>12)?(this.state="DEFUSE_BOMB",v=!0,m=null):(this.state="ROTATE_DEFUSE",m=o.bombPos)}else if(this.state="PATROL",m=this.getRouteOrFallback(t.pos,r,o.siteACenter),m&&Math.hypot(t.pos.x-m.x,t.pos.z-m.z)<2.2&&(this.state="HOLD_ANGLE",this.repathTimer<=-7.5)){const _=i0[this.slotIndex%5];this.routeNodes=[_[Math.floor(Math.random()*_.length)]],this.routeStep=0,this.repathTimer=.2}if(c){this.state="ENGAGE",this.alertTargetPos={...c.pos},this.alertTimer=3,this.reactionTimer+=e;const _=h<22&&Math.random()<.3?1.58:1.28,g=c.pos.x-t.pos.x,S=c.pos.y+_-(t.pos.y+1.56),A=c.pos.z-t.pos.z,T=Math.hypot(g,A)+.001,E=Math.atan2(-g,-A)+this.aimJitterX,C=Math.atan2(S,T)+this.aimJitterY,z=qa(E-t.yaw);a.targetYaw=t.yaw+Math.max(-e*8.5,Math.min(e*8.5,z)),a.targetPitch=Math.max(-.85,Math.min(.85,C)),this.strafeTimer-=e,this.strafeTimer<=0&&(this.strafeTimer=.45+Math.random()*.65,this.strafeDir=Math.random()>.5?1:-1);const y=t.primaryWeaponId==="awp";if(!y&&h>5){const w=Math.cos(t.yaw),O=-Math.sin(t.yaw);a.moveX=w*this.strafeDir*.65,a.moveZ=O*this.strafeDir*.65}else h<4.5&&(a.moveX=-g/T,a.moveZ=-A/T);return this.reactionTimer>.22&&Math.abs(z)<.24&&(this.burstPause>0?this.burstPause-=e:(a.fire=!0,this.burstTimer+=e,this.burstTimer>(y?.15:.45+Math.random()*.35)&&(this.burstTimer=0,this.burstPause=y?.3:.22+Math.random()*.22))),t.activeMag===0&&!t.isReloading&&(a.reload=!0),a}if(this.reactionTimer=Math.max(0,this.reactionTimer-e*2),a.wantPlant=x,a.wantDefuse=v,x||v){if(a.crouch=!0,o.bombPos&&v){const _=o.bombPos.x-t.pos.x,g=o.bombPos.z-t.pos.z;a.targetYaw=Math.atan2(-_,-g),a.targetPitch=-.5}return a}if(t.activeMag<=4&&!t.isReloading&&t.activeMag>=0&&(a.reload=!0),m){for((this.path.length===0||this.pathIndex>=this.path.length||!this.goalPos||Math.hypot(m.x-this.goalPos.x,m.z-this.goalPos.z)>3.5||this.repathTimer<=0)&&(this.goalPos={...m},this.path=r.findPath(t.pos,m),this.pathIndex=0,this.repathTimer=1.6+Math.random()*.8);this.pathIndex<this.path.length;){const g=this.path[this.pathIndex];if(Math.hypot(g.x-t.pos.x,g.z-t.pos.z)<1.35)this.pathIndex++;else break}if(this.pathIndex<this.path.length){const g=this.path[this.pathIndex],S=g.x-t.pos.x,A=g.z-t.pos.z,T=Math.hypot(S,A)+1e-4;if(this.stuckTimer+=e,this.stuckTimer>.65){const E=Math.hypot(t.pos.x-this.lastCheckPos.x,t.pos.z-this.lastCheckPos.z);if(this.lastCheckPos={...t.pos},this.stuckTimer=0,E<.28){this.unstuckNudgeTimer=.45;const C=Math.random()>.5?1:-1;this.unstuckDir={x:-A/T*C,z:S/T*C},this.repathTimer=.05}}if(this.unstuckNudgeTimer>0?(this.unstuckNudgeTimer-=e,a.moveX=this.unstuckDir.x*.85+S/T*.35,a.moveZ=this.unstuckDir.z*.85+A/T*.35):(a.moveX=S/T,a.moveZ=A/T),this.alertTargetPos&&this.alertTimer>0){const E=this.alertTargetPos.x-t.pos.x,C=this.alertTargetPos.z-t.pos.z,z=Math.atan2(-E,-C),y=qa(z-t.yaw);a.targetYaw=t.yaw+Math.max(-e*5.5,Math.min(e*5.5,y))}else{const E=Math.atan2(-S,-A),C=qa(E-t.yaw);a.targetYaw=t.yaw+Math.max(-e*5.2,Math.min(e*5.2,C))}}else{const g=this.alertTargetPos&&this.alertTimer>0?this.alertTargetPos:t.team==="CT"?{x:0,z:20}:{x:0,z:-20},S=g.x-t.pos.x,A=g.z-t.pos.z,T=Math.atan2(-S,-A)+Math.sin(performance.now()*.001+this.slotIndex)*.45,E=qa(T-t.yaw);a.targetYaw=t.yaw+Math.max(-e*2.5,Math.min(e*2.5,E))}}for(let _=0;_<i.length;_++){const g=i[_];if(!g.alive||g.id===t.id)continue;const S=t.pos.x-g.pos.x,A=t.pos.z-g.pos.z,T=Math.hypot(S,A);if(T>.01&&T<1.35){const E=(1.35-T)*.85;a.moveX+=S/T*E,a.moveZ+=A/T*E}}const d=Math.hypot(a.moveX,a.moveZ);return d>1&&(a.moveX/=d,a.moveZ/=d),a}getRouteOrFallback(e,t,i){for(;this.routeStep<this.routeNodes.length;){const r=t.getNode(this.routeNodes[this.routeStep]);if(!r){this.routeStep++;continue}if(Math.hypot(r.x-e.x,r.z-e.z)<2.6&&this.routeStep<this.routeNodes.length-1)this.routeStep++;else return{x:r.x,y:r.y,z:r.z}}return i}}class hA{constructor(){B(this,"ctx",null);B(this,"masterGain",null);B(this,"noiseBuffer",null);B(this,"volume",.75);B(this,"listenerPos",{x:0,y:0,z:0});B(this,"listenerRightX",1);B(this,"listenerRightZ",0)}unlock(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.masterGain=this.ctx.createGain(),this.masterGain.gain.value=this.volume,this.masterGain.connect(this.ctx.destination),this.noiseBuffer=this.createNoiseBuffer(this.ctx,2)}this.ctx.state==="suspended"&&this.ctx.resume()}setVolume(e){this.volume=Math.max(0,Math.min(1,e)),this.masterGain&&(this.masterGain.gain.value=this.volume)}updateListener(e,t){this.listenerPos=e,this.listenerRightX=Math.cos(t),this.listenerRightZ=-Math.sin(t)}createNoiseBuffer(e,t){const i=Math.floor(e.sampleRate*t),r=e.createBuffer(1,i,e.sampleRate),s=r.getChannelData(0);for(let o=0;o<i;o++)s[o]=Math.random()*2-1;return r}makeSpatialDestination(e,t=65){if(!this.ctx||!this.masterGain)return null;if(!e)return{node:this.masterGain,gainScale:1};const i=e.x-this.listenerPos.x,r=e.y-this.listenerPos.y,s=e.z-this.listenerPos.z,o=Math.hypot(i,r,s);if(o>t)return null;const a=Math.pow(Math.max(0,1-o/t),1.65);if(a<.015)return null;if(typeof this.ctx.createStereoPanner=="function"&&o>.5){const l=this.ctx.createStereoPanner(),c=(i*this.listenerRightX+s*this.listenerRightZ)/o;return l.pan.value=Math.max(-.92,Math.min(.92,c)),l.connect(this.masterGain),{node:l,gainScale:a}}return{node:this.masterGain,gainScale:a}}playNoiseBurst(e,t,i,r,s,o,a,l=1){if(!this.ctx||!this.noiseBuffer)return;const c=this.ctx.createBufferSource();c.buffer=this.noiseBuffer;const h=this.ctx.createBiquadFilter();h.type=s,h.Q.value=l,h.frequency.setValueAtTime(o,t),h.frequency.exponentialRampToValueAtTime(Math.max(40,a),t+i);const u=this.ctx.createGain();u.gain.setValueAtTime(Math.max(1e-4,r),t),u.gain.exponentialRampToValueAtTime(1e-4,t+i),c.connect(h),h.connect(u),u.connect(e),c.start(t,Math.random()*.8,i+.02)}playTone(e,t,i,r,s,o,a){if(!this.ctx)return;const l=this.ctx.createOscillator();l.type=r,l.frequency.setValueAtTime(s,t),o!==s&&l.frequency.exponentialRampToValueAtTime(Math.max(20,o),t+i);const c=this.ctx.createGain();c.gain.setValueAtTime(Math.max(1e-4,a),t),c.gain.exponentialRampToValueAtTime(1e-4,t+i),l.connect(c),c.connect(e),l.start(t),l.stop(t+i+.02)}playWeaponFire(e,t){if(!this.ctx)return;const i=e==="usp"?28:e==="awp"?95:70,r=this.makeSpatialDestination(t,i);if(!r)return;const s=this.ctx.currentTime,o=r.gainScale,a=r.node;e==="ak47"?(this.playTone(a,s,.11,"triangle",175,48,.42*o),this.playNoiseBurst(a,s,.17,.52*o,"bandpass",1800,320,.85),this.playNoiseBurst(a,s,.045,.34*o,"highpass",2600,1200,.7),this.playNoiseBurst(a,s+.04,.16,.14*o,"lowpass",950,220,.7)):e==="m4a4"?(this.playTone(a,s,.08,"triangle",235,72,.3*o),this.playNoiseBurst(a,s,.115,.42*o,"bandpass",2600,620,1),this.playNoiseBurst(a,s,.035,.32*o,"highpass",3400,1600,.8)):e==="awp"?(this.playTone(a,s,.28,"sine",130,26,.75*o),this.playTone(a,s,.14,"sawtooth",260,42,.35*o),this.playNoiseBurst(a,s,.42,.72*o,"lowpass",3200,160,.65),this.playNoiseBurst(a,s+.08,.45,.25*o,"bandpass",780,180,.8),o>.35&&(this.playTone(a,s+.48,.045,"square",1400,900,.08*o),this.playTone(a,s+.62,.055,"square",1050,1650,.09*o))):e==="glock"?(this.playTone(a,s,.06,"triangle",320,110,.22*o),this.playNoiseBurst(a,s,.085,.28*o,"bandpass",2500,820,1.2)):e==="usp"?(this.playTone(a,s,.035,"triangle",460,190,.12*o),this.playNoiseBurst(a,s,.055,.18*o,"bandpass",3200,1400,1.9)):e==="deagle"?(this.playTone(a,s,.15,"triangle",210,46,.54*o),this.playNoiseBurst(a,s,.22,.56*o,"bandpass",1500,290,.8),this.playTone(a,s,.09,"sine",1650,820,.11*o)):e==="knife"&&this.playNoiseBurst(a,s,.11,.22*o,"bandpass",900,2600,2.2)}playReload(e){if(!this.ctx)return;const t=this.makeSpatialDestination(e,18);if(!t)return;const i=this.ctx.currentTime,r=t.gainScale,s=t.node;this.playTone(s,i,.04,"square",920,480,.09*r),this.playTone(s,i+.65,.06,"triangle",320,180,.14*r),this.playNoiseBurst(s,i+.65,.05,.12*r,"bandpass",1400,600,1.5),this.playNoiseBurst(s,i+1.25,.07,.14*r,"highpass",2200,1200,1.4),this.playTone(s,i+1.32,.05,"square",1350,1850,.09*r)}playScopeZoom(){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime;this.playTone(this.masterGain,e,.045,"sine",1100,1750,.12),this.playTone(this.masterGain,e+.03,.03,"triangle",1900,1400,.07)}playFootstep(e,t=!1){if(!this.ctx)return;const i=this.makeSpatialDestination(e,24);if(!i)return;const r=this.ctx.currentTime,s=i.gainScale*(t?1.45:.72),o=.85+Math.random()*.3;this.playNoiseBurst(i.node,r,t?.09:.055,.16*s,"bandpass",780*o,260*o,1.1),t&&this.playTone(i.node,r,.07,"sine",110,45,.16*s)}playHitFeedback(e,t){if(!this.ctx||!this.masterGain)return;const i=this.ctx.currentTime;e?(this.playTone(this.masterGain,i,.12,"triangle",2650,1950,.28),this.playTone(this.masterGain,i,.07,"square",3850,2900,.14),this.playNoiseBurst(this.masterGain,i,.05,.18,"highpass",3e3,1800,1.4)):(this.playTone(this.masterGain,i,.055,"triangle",980,420,.22),this.playNoiseBurst(this.masterGain,i,.035,.14,"bandpass",1800,800,1.2)),t&&(this.playTone(this.masterGain,i+.05,.12,"sine",880,1320,.18),this.playTone(this.masterGain,i+.11,.18,"sine",1320,1760,.15))}playDamageTaken(e){if(!this.ctx||!this.masterGain)return;const t=this.ctx.currentTime;this.playTone(this.masterGain,t,.11,"sine",e?520:155,55,.28),this.playNoiseBurst(this.masterGain,t,.08,.2,"lowpass",900,200,.9)}playC4PlantKey(){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime,t=1400+Math.floor(Math.random()*4)*180;this.playTone(this.masterGain,e,.05,"square",t,t,.12)}playC4Beep(e){if(!this.ctx)return;const t=this.makeSpatialDestination(e,78);if(!t)return;const i=this.ctx.currentTime,r=Math.max(.2,t.gainScale);this.playTone(t.node,i,.09,"sine",2480,2480,.22*r),this.playTone(t.node,i,.085,"triangle",4960,4960,.06*r)}playC4DefuseStart(){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime;this.playTone(this.masterGain,e,.07,"square",680,920,.12),this.playTone(this.masterGain,e+.08,.09,"square",920,1240,.11)}playC4Defused(){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime;this.playTone(this.masterGain,e,.12,"sine",660,660,.18),this.playTone(this.masterGain,e+.13,.12,"sine",880,880,.18),this.playTone(this.masterGain,e+.26,.25,"sine",1320,1320,.22)}playC4Explosion(){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime;this.playTone(this.masterGain,e,1.6,"sine",95,18,.85),this.playTone(this.masterGain,e,.9,"sawtooth",140,24,.45),this.playNoiseBurst(this.masterGain,e,1.85,.88,"lowpass",1800,95,.7),this.playNoiseBurst(this.masterGain,e+.12,1.4,.48,"bandpass",620,120,.8),this.playNoiseBurst(this.masterGain,e+.35,1.1,.22,"highpass",1600,400,.9)}playDryFire(){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime;this.playTone(this.masterGain,e,.025,"square",1700,1100,.1)}}class dA{constructor(){B(this,"group",new lt);B(this,"tracers",[]);B(this,"particles",[]);B(this,"decals",[]);B(this,"c4WorldProp",new lt);B(this,"c4BeaconLight");B(this,"c4HaloRing");B(this,"c4LedMesh",null);B(this,"explosionMesh");B(this,"explosionLight");B(this,"explosionTimer",0);B(this,"sharedBoxGeo",new Pe(.06,.06,.06));B(this,"sharedDecalGeo",new Ef(.065,8));B(this,"matSpark",new Rt({color:16765547}));B(this,"matDust",new Rt({color:13283463}));B(this,"matBlood",new Rt({color:12066077}));B(this,"matFire",new Rt({color:16739106}));B(this,"matHole",new Rt({color:1972758,transparent:!0,opacity:.78,depthWrite:!1}));const e=$l("c4");e.scale.setScalar(1.35),e.position.set(0,.08,0),this.c4WorldProp.add(e),this.c4LedMesh=e.getObjectByName("c4_led")??null,this.c4BeaconLight=new Zl(16722731,0,9),this.c4BeaconLight.position.set(0,.35,0),this.c4WorldProp.add(this.c4BeaconLight),this.c4HaloRing=new We(new Cf(.32,.42,20),new Rt({color:16757563,side:ni,transparent:!0,opacity:.72})),this.c4HaloRing.rotation.x=-Math.PI/2,this.c4HaloRing.position.y=.04,this.c4WorldProp.add(this.c4HaloRing),this.c4WorldProp.visible=!1,this.group.add(this.c4WorldProp),this.explosionMesh=new We(new _c(1,18,14),new Rt({color:16743972,transparent:!0,opacity:.9})),this.explosionMesh.visible=!1,this.group.add(this.explosionMesh),this.explosionLight=new Zl(16747056,0,55),this.group.add(this.explosionLight)}spawnTracer(e,t,i=16770206){const r=[new D(e.x,e.y,e.z),new D(t.x,t.y,t.z)],s=new qt().setFromPoints(r),o=new n_({color:i,transparent:!0,opacity:.85}),a=new ZE(s,o);this.group.add(a),this.tracers.push({line:a,life:.065,maxLife:.065})}spawnWallImpact(e,t,i=!1){const r=new We(this.sharedDecalGeo,this.matHole);if(r.position.set(e.x+t.x*.015,e.y+t.y*.015,e.z+t.z*.015),r.lookAt(e.x+t.x,e.y+t.y,e.z+t.z),this.group.add(r),this.decals.push({mesh:r,life:14}),this.decals.length>65){const o=this.decals.shift();this.group.remove(o.mesh)}const s=i?7:5;for(let o=0;o<s;o++){const a=new We(this.sharedBoxGeo,i?this.matSpark:this.matDust);a.position.set(e.x,e.y,e.z);const l=2.2+Math.random()*3.8;this.group.add(a),this.particles.push({mesh:a,vx:(t.x+(Math.random()-.5)*1.2)*l,vy:(t.y+Math.random()*.9)*l,vz:(t.z+(Math.random()-.5)*1.2)*l,life:.25+Math.random()*.2,maxLife:.45,gravity:12})}}spawnBloodImpact(e,t){const i=t?11:6;for(let r=0;r<i;r++){const s=new We(this.sharedBoxGeo,this.matBlood);s.scale.setScalar(t?1.3:.95),s.position.set(e.x,e.y,e.z),this.group.add(s),this.particles.push({mesh:s,vx:(Math.random()-.5)*5.2,vy:1+Math.random()*3.4,vz:(Math.random()-.5)*5.2,life:.28+Math.random()*.22,maxLife:.5,gravity:14})}}triggerExplosion(e){this.explosionTimer=1.4,this.explosionMesh.visible=!0,this.explosionMesh.position.set(e.x,e.y+.8,e.z),this.explosionMesh.scale.setScalar(1),this.explosionLight.position.set(e.x,e.y+2.5,e.z),this.explosionLight.intensity=140;for(let t=0;t<42;t++){const i=new We(this.sharedBoxGeo,t%3===0?this.matFire:t%3===1?this.matSpark:this.matDust);i.scale.setScalar(2.4+Math.random()*3.2),i.position.set(e.x,e.y+.5,e.z),this.group.add(i);const r=Math.random()*Math.PI*2,s=6+Math.random()*14;this.particles.push({mesh:i,vx:Math.cos(r)*s,vy:5+Math.random()*12,vz:Math.sin(r)*s,life:.7+Math.random()*.8,maxLife:1.5,gravity:15})}}updateC4Prop(e,t,i,r,s){if(this.c4WorldProp.visible=e&&t!==null,!(!e||!t))if(this.c4WorldProp.position.set(t.x,t.y,t.z),i){this.c4BeaconLight.color.setHex(16720418),this.c4BeaconLight.intensity=r?12:.8,this.c4LedMesh&&(this.c4LedMesh.visible=r),this.c4HaloRing.material.color.setHex(16724770);const o=1+Math.sin(s*8)*.18;this.c4HaloRing.scale.setScalar(o)}else this.c4BeaconLight.color.setHex(16758835),this.c4BeaconLight.intensity=4+Math.sin(s*5)*2,this.c4LedMesh&&(this.c4LedMesh.visible=!0),this.c4HaloRing.material.color.setHex(16763207),this.c4HaloRing.scale.setScalar(1.1+Math.sin(s*5)*.15)}clearRoundDecals(){for(const e of this.decals)this.group.remove(e.mesh);this.decals=[]}update(e){for(let t=this.tracers.length-1;t>=0;t--){const i=this.tracers[t];i.life-=e,i.life<=0?(this.group.remove(i.line),i.line.geometry.dispose(),i.line.material.dispose(),this.tracers.splice(t,1)):i.line.material.opacity=i.life/i.maxLife}for(let t=this.particles.length-1;t>=0;t--){const i=this.particles[t];if(i.life-=e,i.life<=0)this.group.remove(i.mesh),this.particles.splice(t,1);else{i.vy-=i.gravity*e,i.mesh.position.x+=i.vx*e,i.mesh.position.y+=i.vy*e,i.mesh.position.z+=i.vz*e,i.mesh.rotation.x+=e*6,i.mesh.rotation.y+=e*5;const r=Math.max(.05,i.life/i.maxLife);i.mesh.scale.multiplyScalar(Math.pow(.85,e*8)*(r>0?1:.01))}}for(let t=this.decals.length-1;t>=0;t--)this.decals[t].life-=e,this.decals[t].life<=0&&(this.group.remove(this.decals[t].mesh),this.decals.splice(t,1));if(this.explosionTimer>0){this.explosionTimer-=e;const t=1-Math.max(0,this.explosionTimer/1.4),i=1.5+t*18;this.explosionMesh.scale.setScalar(i),this.explosionMesh.material.opacity=Math.max(0,(1-t)*.85),this.explosionLight.intensity=Math.max(0,(1-t)*140),this.explosionTimer<=0&&(this.explosionMesh.visible=!1,this.explosionLight.intensity=0)}}}const Nu=1/60,r0=5.9,fA=.56,pA=.52,mA=3.2,gA=5,Du=40,vA=115,s0=2.2,_A=4.4,o0=["Alpha","Bravo","Viper","Ghost","Sentinel"],a0=["Kobra","Vandal","Reaper","Mirage","Jackal"];class xA{constructor(e,t){B(this,"container");B(this,"onHudUpdate");B(this,"mapData");B(this,"nav");B(this,"audio",new hA);B(this,"effects",new dA);B(this,"viewmodel",new iA);B(this,"scene");B(this,"camera");B(this,"renderer");B(this,"agents",[]);B(this,"controlledAgentId","");B(this,"spectatedAgentId","");B(this,"playerTeam","CT");B(this,"gameMode","standard");B(this,"started",!1);B(this,"paused",!1);B(this,"pointerLocked",!1);B(this,"buyMenuOpen",!1);B(this,"scoreboardOpen",!1);B(this,"roundNumber",1);B(this,"roundPhase","freezetime");B(this,"roundTimer",s0);B(this,"scoreCT",0);B(this,"scoreT",0);B(this,"roundWinner",null);B(this,"roundWinReason","");B(this,"announcement","");B(this,"announcementTimer",0);B(this,"bombState","carried");B(this,"bombSite",null);B(this,"bombPos",null);B(this,"bombTimer",Du);B(this,"bombBeepAccum",0);B(this,"bombLedOn",!1);B(this,"bombLedTimer",0);B(this,"roundTargetSite","A");B(this,"activePlanterId",null);B(this,"plantProgress",0);B(this,"plantKeySoundTimer",0);B(this,"activeDefuserId",null);B(this,"defuseProgress",0);B(this,"scopeLevel",0);B(this,"unscopeBoltTimer",0);B(this,"currentFov",75);B(this,"cameraShake",0);B(this,"hitmarkerTime",0);B(this,"hitmarkerHeadshot",!1);B(this,"hitmarkerKill",!1);B(this,"damageIndicatorAngle",null);B(this,"damageIndicatorTimer",0);B(this,"damageFlashAlpha",0);B(this,"lastHitZone",null);B(this,"lastHitDamage",0);B(this,"killfeed",[]);B(this,"nextKillId",1);B(this,"sensitivity",1);B(this,"volume",.75);B(this,"keys",new Set);B(this,"mouseLeftDown",!1);B(this,"mouseRightClicked",!1);B(this,"rafId",0);B(this,"lastFrameTime",0);B(this,"accumulator",0);B(this,"elapsed",0);B(this,"hudEmitAccum",0);B(this,"disposed",!1);B(this,"handleResize",()=>{const e=Math.max(1,this.container.clientWidth),t=Math.max(1,this.container.clientHeight);this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)});B(this,"handlePointerLockChange",()=>{this.pointerLocked=document.pointerLockElement===this.renderer.domElement,!this.pointerLocked&&this.started&&!this.buyMenuOpen?(this.paused=!0,this.keys.clear(),this.mouseLeftDown=!1):this.pointerLocked&&(this.paused=!1,this.buyMenuOpen=!1),this.emitHudSnapshot()});B(this,"handleMouseMove",e=>{if(!this.pointerLocked||!this.started||this.paused||this.buyMenuOpen)return;const t=this.getControlledAgent();if(!t||!t.alive)return;const i=this.scopeLevel===2?.22:this.scopeLevel===1?.42:1,r=.0021*this.sensitivity*i;t.yaw-=e.movementX*r,t.pitch=Math.max(-1.46,Math.min(1.46,t.pitch-e.movementY*r)),this.viewmodel.addLookSway(e.movementX,e.movementY)});B(this,"handleMouseDown",e=>{if(!this.started||this.paused||this.buyMenuOpen)return;if(this.audio.unlock(),!this.pointerLocked){this.requestPointerLock();return}const t=this.getControlledAgent();if(t&&!t.alive){e.button===0&&this.cycleSpectator(1),e.button===2&&this.cycleSpectator(-1);return}e.button===0?this.mouseLeftDown=!0:e.button===2&&(this.mouseRightClicked=!0)});B(this,"handleMouseUp",e=>{if(e.button===0){this.mouseLeftDown=!1;const t=this.getControlledAgent();t&&(t.semiAutoLatch=!1)}});B(this,"handleWheel",e=>{if(!this.pointerLocked||!this.started||this.paused)return;const t=this.getControlledAgent();if(!t||!t.alive)return;const i=[];t.slots.primary&&i.push("primary"),t.slots.secondary&&i.push("secondary"),i.push("melee"),t.slots.c4&&i.push("c4");const s=(i.indexOf(t.activeSlot)+(e.deltaY>0?1:-1)+i.length)%i.length;this.switchSlot(t,i[s]),this.emitHudSnapshot()});B(this,"handleKeyDown",e=>{const t=e.code;if(t==="Tab"){e.preventDefault(),this.scoreboardOpen=!0,this.emitHudSnapshot();return}if(!this.started)return;if(t==="KeyB"){this.paused||(this.buyMenuOpen=!this.buyMenuOpen,this.buyMenuOpen?(this.exitPointerLock(),this.keys.clear(),this.mouseLeftDown=!1):this.requestPointerLock(),this.emitHudSnapshot());return}if(t==="Escape"){this.buyMenuOpen&&this.closeBuyMenu();return}if(this.keys.add(t),this.paused||this.buyMenuOpen)return;const i=this.getControlledAgent();if(i){if(!i.alive){t==="KeyE"?this.takeoverSpectatedBot():t==="KeyA"||t==="ArrowLeft"?this.cycleSpectator(-1):(t==="KeyD"||t==="ArrowRight")&&this.cycleSpectator(1);return}t==="Digit1"?this.switchSlot(i,"primary"):t==="Digit2"?this.switchSlot(i,"secondary"):t==="Digit3"?this.switchSlot(i,"melee"):t==="Digit4"||t==="Digit5"?this.switchSlot(i,"c4"):t==="KeyQ"?this.switchSlot(i,i.lastSlot):t==="KeyR"&&this.startReload(i)}});B(this,"handleKeyUp",e=>{if(e.code==="Tab"){e.preventDefault(),this.scoreboardOpen=!1,this.emitHudSnapshot();return}this.keys.delete(e.code)});B(this,"handleContextMenu",e=>e.preventDefault());B(this,"loop",e=>{if(this.disposed)return;this.rafId=requestAnimationFrame(this.loop);const t=Math.min(.05,Math.max(.001,(e-this.lastFrameTime)/1e3));if(this.lastFrameTime=e,this.started&&!this.paused){for(this.accumulator+=t;this.accumulator>=Nu;)this.fixedUpdate(Nu),this.accumulator-=Nu;this.effects.update(t),this.updateCameraAndViewmodel(t)}else if(!this.started){this.elapsed+=t;const i=this.elapsed*.14;this.camera.position.set(Math.cos(i)*28+8,16.5,Math.sin(i)*26-6),this.camera.lookAt(8,2.2,-10),this.viewmodel.root.visible=!1}this.renderer.render(this.scene,this.camera),this.hudEmitAccum+=t,this.hudEmitAccum>=.04&&(this.hudEmitAccum=0,this.emitHudSnapshot())});this.container=e,this.onHudUpdate=t,this.scene=new YE,this.scene.background=new Ze(13229293),this.scene.fog=new Sf(14208181,.0068);const i=Math.max(1,e.clientWidth),r=Math.max(1,e.clientHeight);this.camera=new xn(75,i/r,.06,260),this.camera.rotation.order="YXZ",this.camera.add(this.viewmodel.root),this.scene.add(this.camera),this.renderer=new jE({antialias:!0,powerPreference:"high-performance"}),this.renderer.setSize(i,r),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Mv,this.renderer.toneMapping=Ev,this.renderer.toneMappingExposure=1.08,e.innerHTML="",e.appendChild(this.renderer.domElement);const s=new bT(16774108,12097128,.92);this.scene.add(s);const o=new Qm(16773332,1.85);o.position.set(42,68,30),o.castShadow=!0,o.shadow.mapSize.set(2048,2048),o.shadow.camera.near=10,o.shadow.camera.far=175,o.shadow.camera.left=-60,o.shadow.camera.right=60,o.shadow.camera.top=60,o.shadow.camera.bottom=-60,o.shadow.bias=-5e-4,this.scene.add(o);const a=new Qm(10208488,.35);a.position.set(-45,30,-40),this.scene.add(a),this.mapData=BT(),this.scene.add(this.mapData.group),this.scene.add(this.effects.group),this.nav=new aA,this.createAgents(),this.setupRound(!0),this.bindEvents(),this.lastFrameTime=performance.now(),this.emitHudSnapshot(),this.loop(this.lastFrameTime)}createAgents(){for(const t of this.agents)this.scene.remove(t.rig.root);this.agents=[];const e=(t,i,r)=>{const s=`${t}_${i}`,o=t==="CT"?o0:a0,a=new rA(t);return this.scene.add(a.root),{id:s,name:r?"YOU":o[i],team:t,slotIndex:i,isHuman:r,alive:!0,body:{pos:{x:0,y:0,z:0},vel:{x:0,y:0,z:0},onGround:!0,crouching:!1},yaw:0,pitch:0,hp:100,armor:100,hasHelmet:!1,money:800,kills:0,deaths:0,slots:{primary:null,secondary:n0(t),melee:"knife",c4:!1},activeSlot:"secondary",lastSlot:"melee",ammo:{},fireCooldown:0,reloading:!1,reloadTimer:0,recoilSpread:0,recoilKickPitch:0,shotCount:0,semiAutoLatch:!1,stepAccum:0,spottedUntil:0,rig:a,brain:new uA(i,t)}};for(let t=0;t<5;t++){const i=this.playerTeam==="CT"&&t===0,r=e("CT",t,i);this.agents.push(r),i&&(this.controlledAgentId=r.id)}for(let t=0;t<5;t++){const i=this.playerTeam==="T"&&t===0,r=e("T",t,i);this.agents.push(r),i&&(this.controlledAgentId=r.id)}this.spectatedAgentId=this.controlledAgentId}isCurrentRoundPistol(){return this.gameMode==="pistol_only"?!0:this.gameMode==="full_buy"?!1:this.roundNumber===1}initWeaponAmmo(e,t){const i=Yt[t];e.ammo[t]={mag:i.magSize,reserve:i.reserveMax}}setupRound(e=!1){if(e){this.roundNumber=1,this.scoreCT=0,this.scoreT=0,this.killfeed=[];for(const a of this.agents)a.kills=0,a.deaths=0}const t=this.isCurrentRoundPistol();this.roundPhase="freezetime",this.roundTimer=s0,this.roundWinner=null,this.roundWinReason="",this.scopeLevel=0,this.unscopeBoltTimer=0,this.activePlanterId=null,this.plantProgress=0,this.activeDefuserId=null,this.defuseProgress=0,this.effects.clearRoundDecals();for(const a of this.agents)a.isHuman=a.team===this.playerTeam&&a.slotIndex===0,a.isHuman?(a.name="YOU",this.controlledAgentId=a.id,this.spectatedAgentId=a.id):a.name=(a.team==="CT"?o0:a0)[a.slotIndex];this.roundTargetSite=Math.random()<.55?"A":"B";const i=this.agents.filter(a=>a.team==="T"),r=this.playerTeam==="T"&&this.roundNumber===1?i[0]:i[Math.floor(Math.random()*i.length)];this.bombState="carried",this.bombSite=null,this.bombPos=null,this.bombTimer=Du,this.bombBeepAccum=0;for(const a of this.agents){const l=a.team==="CT"?this.mapData.spawnsCT:this.mapData.spawnsT,c=l[a.slotIndex%l.length];a.alive=!0,a.hp=100,a.body.pos={x:c.x,y:c.y,z:c.z},a.body.vel={x:0,y:0,z:0},a.body.onGround=!0,a.body.crouching=!1,a.yaw=a.team==="CT"?Math.PI:0,a.pitch=0,a.fireCooldown=0,a.reloading=!1,a.reloadTimer=0,a.recoilSpread=0,a.recoilKickPitch=0,a.shotCount=0,a.spottedUntil=0,a.slots.c4=a.id===r.id;const h=n0(a.team);if(a.ammo={},t)a.armor=100,a.hasHelmet=!1,a.money=800,a.slots.primary=null,a.slots.secondary=h,this.initWeaponAmmo(a,h),a.activeSlot="secondary",a.lastSlot="melee";else{a.armor=100,a.hasHelmet=!0,a.money=Math.max(a.money,1e4);const u=!a.isHuman&&a.slotIndex===2?"awp":JT(a.team),f=!a.isHuman&&a.slotIndex===3?"deagle":h;a.slots.primary=u,a.slots.secondary=f,this.initWeaponAmmo(a,u),this.initWeaponAmmo(a,f),a.activeSlot="primary",a.lastSlot="secondary"}a.rig.resetAlive(),a.rig.setWeapon(this.getActiveWeaponId(a))}const s=this.getTacticsContext();for(const a of this.agents)a.brain.resetForRound(s);this.showAnnouncement(t?`第 ${this.roundNumber} 回合 · 手枪局 (PISTOL ROUND)`:`第 ${this.roundNumber} 回合 · 全枪局 — 按 [B] 自由选枪`,3);const o=this.getViewedAgent();o&&this.viewmodel.setWeapon(this.getActiveWeaponId(o),o.team),this.emitHudSnapshot()}getTacticsContext(){let e=null;if(this.bombState==="planted"&&this.bombPos){let t=1/0;for(const i of this.agents){if(!i.alive||i.team!=="CT"||i.isHuman)continue;const r=Math.hypot(i.body.pos.x-this.bombPos.x,i.body.pos.z-this.bombPos.z);r<t&&(t=r,e=i.id)}}return{targetSite:this.roundTargetSite,bombState:this.bombState,bombPos:this.bombPos,bombSite:this.bombSite,siteACenter:this.mapData.bombsites[0].center,siteBCenter:this.mapData.bombsites[1].center,defuserId:e}}getAgent(e){return this.agents.find(t=>t.id===e)}getControlledAgent(){return this.getAgent(this.controlledAgentId)}getViewedAgent(){const e=this.getControlledAgent();if(e&&e.alive)return e;const t=this.getAgent(this.spectatedAgentId);if(t&&t.alive)return t;const i=this.agents.find(r=>r.team===this.playerTeam&&r.alive);return i?(this.spectatedAgentId=i.id,i):e??this.agents[0]}getActiveWeaponId(e){return e.activeSlot==="primary"&&e.slots.primary?e.slots.primary:e.activeSlot==="secondary"&&e.slots.secondary?e.slots.secondary:e.activeSlot==="c4"&&e.slots.c4?"c4":"knife"}switchSlot(e,t){t==="primary"&&!e.slots.primary||t==="secondary"&&!e.slots.secondary||t==="c4"&&!e.slots.c4||e.activeSlot!==t&&(e.lastSlot=e.activeSlot,e.activeSlot=t,e.reloading=!1,e.reloadTimer=0,e.fireCooldown=Math.max(e.fireCooldown,.22),e.isHuman&&(this.scopeLevel=0,this.viewmodel.setWeapon(this.getActiveWeaponId(e),e.team)),e.rig.setWeapon(this.getActiveWeaponId(e)))}showAnnouncement(e,t=2.8){this.announcement=e,this.announcementTimer=t}startGame(e,t){this.audio.unlock();const i=this.playerTeam!==e;this.playerTeam=e,this.gameMode=t,this.started=!0,this.paused=!1,this.buyMenuOpen=!1,i&&this.createAgents(),this.setupRound(!0),this.requestPointerLock()}resumeGame(){this.audio.unlock(),this.paused=!1,this.buyMenuOpen=!1,this.requestPointerLock(),this.emitHudSnapshot()}togglePause(){this.started&&(this.paused=!this.paused,this.paused?(this.buyMenuOpen=!1,this.exitPointerLock()):this.requestPointerLock(),this.emitHudSnapshot())}setTeamAndRestart(e){this.playerTeam=e,this.createAgents(),this.setupRound(!0),this.paused=!1,this.buyMenuOpen=!1,this.requestPointerLock()}setGameModeAndRestart(e){this.gameMode=e,this.setupRound(!0),this.paused=!1,this.buyMenuOpen=!1,this.requestPointerLock()}skipToFullBuyRound(){this.gameMode==="pistol_only"&&(this.gameMode="standard"),this.roundNumber=Math.max(2,this.roundNumber+1),this.setupRound(!1),this.paused=!1,this.buyMenuOpen=!1,this.requestPointerLock()}setSensitivity(e){this.sensitivity=Math.max(.2,Math.min(3,e)),this.emitHudSnapshot()}setVolume(e){this.volume=Math.max(0,Math.min(1,e)),this.audio.setVolume(this.volume),this.emitHudSnapshot()}closeBuyMenu(){this.buyMenuOpen=!1,this.started&&!this.paused&&this.requestPointerLock(),this.emitHudSnapshot()}buyWeapon(e){const t=this.getControlledAgent();if(!t||!t.alive)return!1;const i=Yt[e];return!i||i.slot==="melee"||i.slot==="c4"?!1:this.isCurrentRoundPistol()&&i.slot==="primary"?(this.showAnnouncement("手枪局禁止购买主武器！",1.8),this.emitHudSnapshot(),!1):t.money<i.price?(this.showAnnouncement(`资金不足 ($${i.price})`,1.6),this.emitHudSnapshot(),!1):(t.money-=i.price,i.slot==="primary"?(t.slots.primary=e,this.initWeaponAmmo(t,e),this.switchSlot(t,"primary")):i.slot==="secondary"&&(t.slots.secondary=e,this.initWeaponAmmo(t,e),this.switchSlot(t,"secondary")),this.audio.playReload(),this.showAnnouncement(`已装备 ${i.name}`,1.4),this.emitHudSnapshot(),!0)}buyArmor(e){const t=this.getControlledAgent();if(!t||!t.alive)return!1;if(this.isCurrentRoundPistol()&&e)return this.showAnnouncement("手枪局护甲配置为防弹衣（无头盔）",1.8),!1;const i=e?1e3:650;return t.money<i?(this.showAnnouncement("资金不足",1.4),!1):(t.money-=i,t.armor=100,e&&(t.hasHelmet=!0),this.emitHudSnapshot(),!0)}takeoverSpectatedBot(){const e=this.getControlledAgent();if(!e||e.alive)return!1;const t=this.getAgent(this.spectatedAgentId);if(!t||!t.alive||t.team!==this.playerTeam)return!1;e.isHuman=!1,t.isHuman=!0;const i=t.name;return t.name=`YOU (${i})`,this.controlledAgentId=t.id,this.scopeLevel=0,this.viewmodel.setWeapon(this.getActiveWeaponId(t),t.team),this.showAnnouncement(`已接管存活队友 ${i}！`,2.2),this.emitHudSnapshot(),!0}cycleSpectator(e){const t=this.agents.filter(s=>s.team===this.playerTeam&&s.alive);if(t.length===0)return;const i=t.findIndex(s=>s.id===this.spectatedAgentId),r=t[(i+e+t.length)%t.length];this.spectatedAgentId=r.id,this.viewmodel.setWeapon(this.getActiveWeaponId(r),r.team),this.emitHudSnapshot()}requestPointerLock(){const e=this.renderer.domElement;if(document.pointerLockElement!==e&&e.requestPointerLock)try{e.requestPointerLock()}catch{}}exitPointerLock(){document.pointerLockElement&&document.exitPointerLock&&document.exitPointerLock()}bindEvents(){window.addEventListener("resize",this.handleResize),document.addEventListener("pointerlockchange",this.handlePointerLockChange),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mousedown",this.handleMouseDown),document.addEventListener("mouseup",this.handleMouseUp),document.addEventListener("wheel",this.handleWheel,{passive:!0}),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),this.renderer.domElement.addEventListener("contextmenu",this.handleContextMenu)}dispose(){this.disposed=!0,cancelAnimationFrame(this.rafId),window.removeEventListener("resize",this.handleResize),document.removeEventListener("pointerlockchange",this.handlePointerLockChange),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mouseup",this.handleMouseUp),document.removeEventListener("wheel",this.handleWheel),window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),this.renderer.domElement.removeEventListener("contextmenu",this.handleContextMenu),this.renderer.dispose()}fixedUpdate(e){this.elapsed+=e,this.hitmarkerTime=Math.max(0,this.hitmarkerTime-e),this.damageFlashAlpha=Math.max(0,this.damageFlashAlpha-e*1.9),this.cameraShake=Math.max(0,this.cameraShake-e*2.5),this.damageIndicatorTimer>0&&(this.damageIndicatorTimer-=e,this.damageIndicatorTimer<=0&&(this.damageIndicatorAngle=null)),this.announcementTimer>0&&(this.announcementTimer-=e,this.announcementTimer<=0&&(this.announcement="")),this.unscopeBoltTimer>0&&(this.unscopeBoltTimer-=e);const t=this.elapsed;if(this.killfeed.length>0&&t-this.killfeed[0].timestamp>6.5&&(this.killfeed=this.killfeed.filter(a=>t-a.timestamp<=6.5)),this.roundTimer=Math.max(0,this.roundTimer-e),this.roundPhase==="freezetime")this.roundTimer<=0&&(this.roundPhase="live",this.roundTimer=vA);else if(this.roundPhase==="round_end"){if(this.roundTimer<=0){this.roundNumber++,this.setupRound(!1);return}}else this.roundPhase==="live"&&this.bombState!=="planted"&&this.roundTimer<=0&&this.endRound("CT","时间耗尽 · CT 防守成功");const i=this.agents.map(a=>{const l=this.getActiveWeaponId(a),c=a.ammo[l];return{id:a.id,team:a.team,alive:a.alive,pos:a.body.pos,yaw:a.yaw,pitch:a.pitch,hasBomb:a.slots.c4,hp:a.hp,isReloading:a.reloading,activeMag:c?c.mag:-1,hasPrimary:a.slots.primary!==null,primaryWeaponId:a.slots.primary}}),r=this.getTacticsContext();for(let a=0;a<this.agents.length;a++){const l=this.agents[a];if(this.updateAgentTimers(l,e),!l.alive){l.rig.update(e,l.body.pos,l.yaw,l.pitch,0,!1,!1,!1,!1,!1);continue}l.isHuman?this.updateHumanAgent(l,e):this.updateBotAgent(l,e,i,r),l.team==="T"&&this.bombState==="dropped"&&this.bombPos&&Math.hypot(l.body.pos.x-this.bombPos.x,l.body.pos.z-this.bombPos.z)<1.55&&Math.abs(l.body.pos.y-this.bombPos.y)<1.4&&(l.slots.c4=!0,this.bombState="carried",this.bombPos=null,l.isHuman&&this.showAnnouncement("你已拾取 C4 炸弹！前往 A点 或 B点 安放",2.4));const c=Math.hypot(l.body.vel.x,l.body.vel.z),h=this.getViewedAgent(),u=(h==null?void 0:h.id)===l.id,f=l.team===this.playerTeam&&!u;l.rig.setWeapon(this.getActiveWeaponId(l)),l.rig.update(e,l.body.pos,l.yaw,l.pitch,c,l.body.crouching,l.alive,l.slots.c4,f,u)}this.updatePlayerSpotting(),this.updateBombLogic(e);const s=this.bombState==="dropped"||this.bombState==="planted";this.effects.updateC4Prop(s,this.bombPos,this.bombState==="planted",this.bombLedOn,this.elapsed);const o=this.getViewedAgent();o&&this.audio.updateListener({x:o.body.pos.x,y:o.body.pos.y+(o.body.crouching?$a:Ka),z:o.body.pos.z},o.yaw),this.mouseRightClicked=!1}updateAgentTimers(e,t){if(e.fireCooldown=Math.max(0,e.fireCooldown-t),e.recoilSpread=Math.max(0,e.recoilSpread-t*.14),e.recoilKickPitch*=Math.exp(-t*11),e.recoilSpread<.002&&(e.shotCount=0),e.reloading){const i=Yt[this.getActiveWeaponId(e)];if(e.reloadTimer-=t,e.reloadTimer<=0){e.reloading=!1;const r=e.ammo[i.id];if(r&&i.magSize>0){const s=i.magSize-r.mag,o=Math.min(s,r.reserve);r.mag+=o,r.reserve-=o}}}}updateHumanAgent(e,t){const i=this.roundPhase!=="freezetime",r=this.getActiveWeaponId(e),s=Yt[r];e.body.crouching=this.keys.has("ControlLeft")||this.keys.has("ControlRight")||this.keys.has("KeyC");const o=this.keys.has("ShiftLeft")||this.keys.has("ShiftRight");this.mouseRightClicked&&!this.buyMenuOpen&&(s.canScope&&!e.reloading&&this.unscopeBoltTimer<=0?(this.scopeLevel=(this.scopeLevel+1)%3,this.audio.playScopeZoom()):s.isMelee&&this.roundPhase==="live"&&this.tryFireWeapon(e,!0));const a=this.keys.has("KeyE"),l=this.getBombsiteAt(e.body.pos),c=this.roundPhase==="live"&&e.team==="T"&&e.slots.c4&&l!==null&&this.bombState==="carried"&&(a||r==="c4"&&this.mouseLeftDown),h=this.roundPhase==="live"&&e.team==="CT"&&this.bombState==="planted"&&this.bombPos!==null&&a&&Math.hypot(e.body.pos.x-this.bombPos.x,e.body.pos.z-this.bombPos.z)<2.65&&Math.abs(e.body.pos.y-this.bombPos.y)<1.6;if(c&&l){e.body.crouching=!0,e.body.vel.x=0,e.body.vel.z=0,this.advancePlant(e,l.id,t),gr(e.body,t,this.mapData.colliders,this.mapData.ramps);return}else this.activePlanterId===e.id&&(this.activePlanterId=null,this.plantProgress=0);if(h){e.body.crouching=!0,e.body.vel.x=0,e.body.vel.z=0,this.advanceDefuse(e,t),gr(e.body,t,this.mapData.colliders,this.mapData.ramps);return}else this.activeDefuserId===e.id&&(this.activeDefuserId=null,this.defuseProgress=0);let u=0,f=0;i&&!this.buyMenuOpen&&(this.keys.has("KeyW")&&(u+=1),this.keys.has("KeyS")&&(u-=1),this.keys.has("KeyD")&&(f+=1),this.keys.has("KeyA")&&(f-=1));const p=Math.hypot(u,f);p>0&&(u/=p,f/=p);let m=r0*s.moveSpeedMultiplier;this.scopeLevel>0?m*=.56:e.body.crouching?m*=pA:o&&(m*=fA);const x=-Math.sin(e.yaw),v=-Math.cos(e.yaw),d=Math.cos(e.yaw),_=-Math.sin(e.yaw),g=(x*u+d*f)*m,S=(v*u+_*f)*m,A=e.body.onGround?18:4.5;e.body.vel.x+=(g-e.body.vel.x)*Math.min(1,A*t),e.body.vel.z+=(S-e.body.vel.z)*Math.min(1,A*t),i&&!this.buyMenuOpen&&this.keys.has("Space")&&e.body.onGround&&(e.body.vel.y=XT,e.body.onGround=!1);const{landedSpeed:T}=gr(e.body,t,this.mapData.colliders,this.mapData.ramps);T>4.2&&this.audio.playFootstep(void 0,!0);const E=Math.hypot(e.body.vel.x,e.body.vel.z);e.body.onGround&&E>3.2&&!o&&!e.body.crouching&&(e.stepAccum+=E*t,e.stepAccum>=2.15&&(e.stepAccum=0,this.audio.playFootstep(void 0,!1))),this.mouseLeftDown&&this.roundPhase==="live"&&!this.buyMenuOpen&&r!=="c4"&&(s.automatic||!e.semiAutoLatch)&&(this.tryFireWeapon(e,!1),s.automatic||(e.semiAutoLatch=!0))}updateBotAgent(e,t,i,r){const s=i.find(u=>u.id===e.id),o=e.brain.update(t,s,i,this.nav,this.mapData.colliders,r);if(e.team===this.playerTeam)for(const u of o.spottedEnemyIds){const f=this.getAgent(u);f&&(f.spottedUntil=Math.max(f.spottedUntil,this.elapsed+1.4))}if(e.yaw=o.targetYaw,e.pitch=o.targetPitch,e.body.crouching=o.crouch,this.roundPhase==="freezetime"){e.body.vel.x=0,e.body.vel.z=0,gr(e.body,t,this.mapData.colliders,this.mapData.ramps);return}if(o.wantPlant&&e.team==="T"&&e.slots.c4&&this.bombState==="carried"){const u=this.getBombsiteAt(e.body.pos);if(u){e.body.vel.x=0,e.body.vel.z=0,this.advancePlant(e,u.id,t),gr(e.body,t,this.mapData.colliders,this.mapData.ramps);return}}else this.activePlanterId===e.id&&(this.activePlanterId=null,this.plantProgress=0);if(o.wantDefuse&&e.team==="CT"&&this.bombState==="planted"&&this.bombPos){e.body.vel.x=0,e.body.vel.z=0,this.advanceDefuse(e,t),gr(e.body,t,this.mapData.colliders,this.mapData.ramps);return}else this.activeDefuserId===e.id&&(this.activeDefuserId=null,this.defuseProgress=0);if(e.slots.primary){const u=e.ammo[e.slots.primary];u&&(u.mag>0||u.reserve>0)?e.activeSlot!=="primary"&&this.switchSlot(e,"primary"):e.slots.secondary&&e.activeSlot!=="secondary"&&this.switchSlot(e,"secondary")}const a=this.getActiveWeaponId(e),l=Yt[a],c=r0*.88*l.moveSpeedMultiplier*(o.crouch?.55:1);e.body.vel.x+=(o.moveX*c-e.body.vel.x)*Math.min(1,14*t),e.body.vel.z+=(o.moveZ*c-e.body.vel.z)*Math.min(1,14*t),gr(e.body,t,this.mapData.colliders,this.mapData.ramps);const h=Math.hypot(e.body.vel.x,e.body.vel.z);e.body.onGround&&h>2.8&&(e.stepAccum+=h*t,e.stepAccum>=2.3&&(e.stepAccum=0,this.audio.playFootstep(e.body.pos,!1))),o.reload&&this.startReload(e),o.fire&&this.roundPhase==="live"&&this.tryFireWeapon(e,!1)}startReload(e){const t=this.getActiveWeaponId(e),i=Yt[t];if(e.reloading||i.magSize<=0)return;const r=e.ammo[t];!r||r.mag>=i.magSize||r.reserve<=0||(e.reloading=!0,e.reloadTimer=i.reloadTime,e.isHuman?(this.scopeLevel=0,this.audio.playReload()):this.audio.playReload(e.body.pos))}tryFireWeapon(e,t){if(e.fireCooldown>0||e.reloading)return;const i=this.getActiveWeaponId(e),r=Yt[i];if(r.isUtility)return;const s=e.ammo[i];if(!r.isMelee&&s){if(s.mag<=0){e.isHuman&&this.audio.playDryFire(),this.startReload(e);return}s.mag--}e.fireCooldown=t&&r.heavyInterval?r.heavyInterval:r.fireInterval,e.shotCount++;const o=this.getViewedAgent();(o==null?void 0:o.id)===e.id?(this.viewmodel.triggerFire(i),this.audio.playWeaponFire(i)):this.audio.playWeaponFire(i,e.body.pos),e.rig.triggerFire(r.suppressed);const l=e.body.crouching?$a:Ka,c={x:e.body.pos.x,y:e.body.pos.y+l,z:e.body.pos.z},h=Math.hypot(e.body.vel.x,e.body.vel.z),u=Math.min(1,h/5.5);let f=r.baseSpread+r.moveSpread*u+e.recoilSpread;e.body.crouching&&(f*=.72),e.body.onGround||(f+=.055),r.canScope&&(e.isHuman&&this.scopeLevel>0||!e.isHuman&&h<1.2)&&(f=.001+u*.012),e.isHuman||(f+=i==="awp"?.018:.026),f=Math.min(r.maxSpread+.05,f);const p=(Math.random()-.5)*2*f,m=(Math.random()-.5)*2*f,x=e.yaw+p,v=Math.max(-1.48,Math.min(1.48,e.pitch+m)),d=Math.cos(v),_={x:-Math.sin(x)*d,y:Math.sin(v),z:-Math.cos(x)*d};if(!r.isMelee&&(e.recoilSpread=Math.min(r.maxSpread,e.recoilSpread+r.recoilSpreadPerShot),e.isHuman)){const C=r.recoilPitch*(1+Math.min(.65,e.shotCount*.08)),z=(Math.random()-.5)*2*r.recoilYaw;e.pitch=Math.min(1.46,e.pitch+C),e.yaw+=z,e.recoilKickPitch+=C,i==="awp"&&(this.cameraShake=.25,this.scopeLevel>0&&(this.scopeLevel=0,this.unscopeBoltTimer=.72))}const g=d_(c,_,r.range,this.mapData.colliders,!1);let S=g?g.distance:r.range,A=null,T="chest",E=g?g.point:{x:c.x+_.x*S,y:c.y+_.y*S,z:c.z+_.z*S};for(let C=0;C<this.agents.length;C++){const z=this.agents[C];if(!z.alive||z.id===e.id||z.team===e.team)continue;const y=nA(c,_,S,z.body.pos,z.yaw,z.body.crouching);y&&y.distance<S&&(S=y.distance,A=z,T=y.zone,E=y.point)}if(!r.isMelee){const C={x:c.x+_.x*.65+Math.cos(e.yaw)*.14,y:c.y+_.y*.65-.1,z:c.z+_.z*.65-Math.sin(e.yaw)*.14};this.effects.spawnTracer(C,E,i==="awp"?16774594:i==="ak47"?16764006:16770206)}if(A){let C=t&&r.heavyDamage?r.heavyDamage:void 0;if(r.isMelee&&t){const y=-Math.sin(A.yaw),w=-Math.cos(A.yaw);_.x*y+_.z*w>.55&&(C=135)}const z=qT(r,T,A.armor,A.hasHelmet,S,C);this.applyDamage(e,A,z.hpDamage,z.armorDamage,T,i,E)}else g&&!r.isMelee&&this.effects.spawnWallImpact(g.point,g.normal,g.material==="metal"||g.material==="door");!r.isMelee&&s&&s.mag===0&&s.reserve>0&&this.startReload(e)}applyDamage(e,t,i,r,s,o,a){if(!t.alive)return;t.hp=Math.max(0,t.hp-i),t.armor=Math.max(0,t.armor-r);const l=s==="head",c=t.hp<=0;if(this.effects.spawnBloodImpact(a,l),e&&!t.isHuman&&t.brain.notifyDamageFrom(e.body.pos),e&&e.isHuman&&(this.hitmarkerTime=c?.34:.2,this.hitmarkerHeadshot=l,this.hitmarkerKill=c,this.lastHitZone=s,this.lastHitDamage=i,this.audio.playHitFeedback(l,c)),t.isHuman&&(this.damageFlashAlpha=Math.min(.65,this.damageFlashAlpha+(l?.45:.28)),this.cameraShake=Math.max(this.cameraShake,l?.24:.12),this.audio.playDamageTaken(l),e)){const h=e.body.pos.x-t.body.pos.x,u=e.body.pos.z-t.body.pos.z,f=Math.atan2(h,-u);this.damageIndicatorAngle=f+t.yaw,this.damageIndicatorTimer=1.1}c&&this.handleAgentDeath(t,e,o,l)}handleAgentDeath(e,t,i,r){if(e.alive=!1,e.deaths++,e.reloading=!1,this.activePlanterId===e.id&&(this.activePlanterId=null,this.plantProgress=0),this.activeDefuserId===e.id&&(this.activeDefuserId=null,this.defuseProgress=0),e.slots.c4&&this.bombState==="carried"){e.slots.c4=!1;const s=Kl(e.body.pos.x,e.body.pos.z,e.body.pos.y,.3,this.mapData.colliders,this.mapData.ramps);this.bombState="dropped",this.bombPos={x:e.body.pos.x,y:s,z:e.body.pos.z},this.playerTeam==="T"&&this.showAnnouncement("C4 炸弹已掉落！前往小地图标记处拾取",2.8)}if(t&&(t.kills++,t.money=Math.min(16e3,t.money+Yt[i].killReward)),this.killfeed.push({id:this.nextKillId++,killerName:t?t.name:"C4 爆炸",killerTeam:t?t.team:"T",victimName:e.name,victimTeam:e.team,weapon:i,headshot:r,timestamp:this.elapsed}),this.killfeed.length>6&&this.killfeed.shift(),e.isHuman){this.scopeLevel=0;const s=this.agents.find(o=>o.team===this.playerTeam&&o.alive);s&&(this.spectatedAgentId=s.id,this.viewmodel.setWeapon(this.getActiveWeaponId(s),s.team))}this.checkEliminationWinCondition(),this.emitHudSnapshot()}checkEliminationWinCondition(){if(this.roundPhase!=="live")return;const e=this.agents.filter(i=>i.team==="CT"&&i.alive).length,t=this.agents.filter(i=>i.team==="T"&&i.alive).length;e===0?this.endRound("T","CT 全员阵亡 · 恐怖分子获胜"):t===0&&this.bombState!=="planted"&&this.endRound("CT","T 全员阵亡 · 反恐精英获胜")}getBombsiteAt(e){for(const t of this.mapData.bombsites)if(e.x>=t.minX&&e.x<=t.maxX&&e.y>=t.minY&&e.y<=t.maxY&&e.z>=t.minZ&&e.z<=t.maxZ)return t;return null}advancePlant(e,t,i){if(this.activePlanterId!==e.id&&(this.activePlanterId=e.id,this.plantProgress=0,this.plantKeySoundTimer=0),this.plantProgress+=i/mA,this.plantKeySoundTimer-=i,this.plantKeySoundTimer<=0&&e.isHuman&&(this.plantKeySoundTimer=.34,this.audio.playC4PlantKey()),this.plantProgress>=1){this.activePlanterId=null,this.plantProgress=0,e.slots.c4=!1,e.activeSlot==="c4"&&this.switchSlot(e,e.slots.primary?"primary":"secondary");const r=Kl(e.body.pos.x,e.body.pos.z,e.body.pos.y,.3,this.mapData.colliders,this.mapData.ramps);this.bombState="planted",this.bombSite=t,this.bombPos={x:e.body.pos.x,y:r,z:e.body.pos.z},this.bombTimer=Du,this.bombBeepAccum=0,e.money=Math.min(16e3,e.money+300),this.audio.playC4Beep(this.bombPos),this.showAnnouncement(`警告：C4 炸弹已安放在 ${t} 点！`,3.4),this.emitHudSnapshot()}}advanceDefuse(e,t){this.activeDefuserId!==e.id&&(this.activeDefuserId=e.id,this.defuseProgress=0,e.isHuman&&this.audio.playC4DefuseStart()),this.defuseProgress+=t/gA,this.defuseProgress>=1&&(this.activeDefuserId=null,this.defuseProgress=0,this.bombState="defused",this.audio.playC4Defused(),e.money=Math.min(16e3,e.money+300),this.endRound("CT","C4 炸弹已成功拆除 · 反恐精英获胜"))}updateBombLogic(e){if(this.bombState!=="planted"||!this.bombPos||this.roundPhase!=="live")return;this.bombTimer=Math.max(0,this.bombTimer-e);const t=this.bombTimer>15?1:this.bombTimer>5?.45:Math.max(.14,this.bombTimer*.08);if(this.bombBeepAccum+=e,this.bombBeepAccum>=t&&(this.bombBeepAccum=0,this.bombLedOn=!0,this.bombLedTimer=.1,this.audio.playC4Beep(this.bombPos)),this.bombLedTimer>0&&(this.bombLedTimer-=e,this.bombLedTimer<=0&&(this.bombLedOn=!1)),this.bombTimer<=0){this.bombState="exploded",this.audio.playC4Explosion(),this.effects.triggerExplosion(this.bombPos),this.cameraShake=.85;for(const i of this.agents){if(!i.alive)continue;const r=Math.hypot(i.body.pos.x-this.bombPos.x,i.body.pos.y-this.bombPos.y,i.body.pos.z-this.bombPos.z);if(r<24){const s=Math.round((1-r/24)*260);this.applyDamage(null,i,s,0,"chest","c4",i.body.pos)}}this.endRound("T","C4 炸弹成功引爆 · 恐怖分子获胜")}}endRound(e,t){if(this.roundPhase!=="round_end"){this.roundPhase="round_end",this.roundTimer=_A,this.roundWinner=e,this.roundWinReason=t,e==="CT"?this.scoreCT++:this.scoreT++;for(const i of this.agents)i.money=Math.min(16e3,i.money+(i.team===e?3250:2400));this.emitHudSnapshot()}}updatePlayerSpotting(){const e=this.getViewedAgent();if(!e||!e.alive)return;const t={x:e.body.pos.x,y:e.body.pos.y+(e.body.crouching?$a:Ka),z:e.body.pos.z},i=-Math.sin(e.yaw),r=-Math.cos(e.yaw);for(const s of this.agents){if(!s.alive||s.team===this.playerTeam)continue;const o=s.body.pos.x-t.x,a=s.body.pos.z-t.z,l=Math.hypot(o,a)+.001;if((o*i+a*r)/l<.3)continue;const h={x:s.body.pos.x,y:s.body.pos.y+1.25,z:s.body.pos.z},u={x:s.body.pos.x,y:s.body.pos.y+1.62,z:s.body.pos.z};(Ao(t,h,this.mapData.colliders)||Ao(t,u,this.mapData.colliders))&&(s.spottedUntil=Math.max(s.spottedUntil,this.elapsed+1.6))}}updateCameraAndViewmodel(e){const t=this.getViewedAgent();if(!t)return;const i=t.isHuman&&this.scopeLevel===2?13:t.isHuman&&this.scopeLevel===1?28:75;this.currentFov+=(i-this.currentFov)*Math.min(1,e*20),Math.abs(this.camera.fov-this.currentFov)>.05&&(this.camera.fov=this.currentFov,this.camera.updateProjectionMatrix());const r=t.body.crouching?$a:Ka,s=this.cameraShake>0?(Math.random()-.5)*this.cameraShake*.25:0,o=this.cameraShake>0?(Math.random()-.5)*this.cameraShake*.25:0;t.alive?(this.camera.position.set(t.body.pos.x+s,t.body.pos.y+r+o,t.body.pos.z),this.camera.rotation.set(t.pitch,t.yaw,0)):(this.camera.position.set(t.body.pos.x,t.body.pos.y+3.2,t.body.pos.z+2.8),this.camera.lookAt(t.body.pos.x,t.body.pos.y+.5,t.body.pos.z));const a=this.getActiveWeaponId(t),l=Yt[a],c=t.reloading&&l.reloadTime>0?Math.max(0,Math.min(1,1-t.reloadTimer/l.reloadTime)):0;this.viewmodel.setWeapon(a,t.team),this.viewmodel.update(e,Math.hypot(t.body.vel.x,t.body.vel.z),t.body.onGround,t.reloading,c,!t.alive||t.isHuman&&this.scopeLevel>0)}emitHudSnapshot(){const e=this.getControlledAgent(),t=this.getViewedAgent()??e??this.agents[0],i=!!(e&&!e.alive),r=this.getActiveWeaponId(t),s=Yt[r],o=t.ammo[r],a=this.getBombsiteAt(t.body.pos),l=!i&&this.roundPhase==="live"&&t.team==="T"&&t.slots.c4&&a!==null&&this.bombState==="carried",c=!i&&this.roundPhase==="live"&&t.team==="CT"&&this.bombState==="planted"&&this.bombPos!==null&&Math.hypot(t.body.pos.x-this.bombPos.x,t.body.pos.z-this.bombPos.z)<2.65;let h="none",u=0;this.activePlanterId===t.id?(h="planting",u=Math.min(1,this.plantProgress)):this.activeDefuserId===t.id&&(h="defusing",u=Math.min(1,this.defuseProgress));const f=Math.hypot(t.body.vel.x,t.body.vel.z),p=(s.baseSpread+s.moveSpread*Math.min(1,f/5.5)+t.recoilSpread)*420;let m=this.bombPos,x=!1;if(this.bombState==="planted")x=!0;else if(this.bombState==="dropped")x=this.playerTeam==="T"||this.isPointSeenByPlayerTeam(this.bombPos);else if(this.bombState==="carried"){const A=this.agents.find(T=>T.slots.c4&&T.alive);A&&(m=A.body.pos,x=this.playerTeam==="T"||A.spottedUntil>this.elapsed)}const v=this.agents.map(A=>({id:A.id,team:A.team,x:A.body.pos.x,z:A.body.pos.z,yaw:A.yaw,alive:A.alive,isControlled:A.id===t.id,hasBomb:A.slots.c4,visible:A.team===this.playerTeam||A.alive&&A.spottedUntil>this.elapsed})),d=this.agents.map(A=>({id:A.id,name:A.name,team:A.team,isHuman:A.isHuman,alive:A.alive,hp:A.hp,armor:A.armor,hasHelmet:A.hasHelmet,kills:A.kills,deaths:A.deaths,money:A.money,weapon:this.getActiveWeaponId(A),hasBomb:A.slots.c4})),_=this.agents.filter(A=>A.team==="CT").map(A=>A.alive),g=this.agents.filter(A=>A.team==="T").map(A=>A.alive),S={started:this.started,paused:this.paused,pointerLocked:this.pointerLocked,buyMenuOpen:this.buyMenuOpen,scoreboardOpen:this.scoreboardOpen,gameMode:this.gameMode,playerTeam:this.playerTeam,roundNumber:this.roundNumber,isPistolRound:this.isCurrentRoundPistol(),roundPhase:this.roundPhase,roundTimer:this.roundTimer,scoreCT:this.scoreCT,scoreT:this.scoreT,roundWinner:this.roundWinner,roundWinReason:this.roundWinReason,controlledId:t.id,controlledName:t.name,isSpectating:i,canTakeover:i&&t.alive&&t.team===this.playerTeam,alive:t.alive,hp:t.hp,armor:t.armor,hasHelmet:t.hasHelmet,money:t.money,callout:HT(t.body.pos.x,t.body.pos.z,this.mapData.callouts),activeSlot:t.activeSlot,activeWeapon:r,activeWeaponName:s.name,mag:o?o.mag:-1,reserve:o?o.reserve:-1,reloading:t.reloading,reloadProgress:t.reloading&&s.reloadTime>0?Math.max(0,Math.min(1,1-t.reloadTimer/s.reloadTime)):0,scopeLevel:t.isHuman?this.scopeLevel:0,crosshairSpread:Math.max(4,Math.min(48,p)),slots:{...t.slots},bombState:this.bombState,bombSite:this.bombSite,bombTimer:this.bombTimer,bombPos:m,bombVisibleToPlayer:x,inBombsite:a?a.id:null,canPlant:l,canDefuse:c,actionType:h,actionProgress:u,hitmarkerTime:this.hitmarkerTime,hitmarkerHeadshot:this.hitmarkerHeadshot,hitmarkerKill:this.hitmarkerKill,damageIndicatorAngle:this.damageIndicatorAngle,damageFlashAlpha:this.damageFlashAlpha,lastHitZone:this.lastHitZone,lastHitDamage:this.lastHitDamage,announcement:this.announcement,killfeed:[...this.killfeed],minimapActors:v,scoreboard:d,ctAliveCount:_.filter(Boolean).length,tAliveCount:g.filter(Boolean).length,ctRosterAlive:_,tRosterAlive:g,sensitivity:this.sensitivity,volume:this.volume};this.onHudUpdate(S)}isPointSeenByPlayerTeam(e){if(!e)return!1;const t={x:e.x,y:e.y+.35,z:e.z};for(const i of this.agents){if(!i.alive||i.team!==this.playerTeam)continue;const r={x:i.body.pos.x,y:i.body.pos.y+1.55,z:i.body.pos.z};if(Ao(r,t,this.mapData.colliders))return!0}return!1}}const bn=216,l0=10,yA=({mapData:n,hud:e})=>{const t=Xn.useRef(null);return Xn.useEffect(()=>{const i=t.current;if(!i||!n)return;const r=i.getContext("2d");if(!r)return;const{minX:s,maxX:o,minZ:a,maxZ:l}=n.bounds,c=o-s,h=l-a,u=Math.min((bn-l0*2)/c,(bn-l0*2)/h),f=(bn-c*u)*.5,p=(bn-h*u)*.5,m=d=>f+(d-s)*u,x=d=>p+(d-a)*u;r.clearRect(0,0,bn,bn),r.fillStyle="rgba(13, 18, 24, 0.88)",r.fillRect(0,0,bn,bn),r.fillStyle="#3b352c",r.fillRect(m(-43),x(-39),89*u,92*u);const v=(d,_,g)=>{r.fillStyle=_,g&&(r.strokeStyle=g);for(const S of n.minimapRects){if(S.kind!==d)continue;const A=m(S.x1),T=x(S.z1),E=Math.max(1.5,(S.x2-S.x1)*u),C=Math.max(1.5,(S.z2-S.z1)*u);r.fillRect(A,T,E,C),g&&(r.lineWidth=1,r.strokeRect(A,T,E,C))}};if(v("tunnel","rgba(26, 24, 22, 0.82)"),v("elevated","#554b3c"),v("ramp","#675b48"),v("site","rgba(210, 56, 42, 0.34)","rgba(235, 86, 65, 0.85)"),v("crate","#7a6345"),v("wall","#191f26"),v("door","#a97442"),r.font="bold 11px system-ui, sans-serif",r.textAlign="center",r.textBaseline="middle",r.fillStyle="#ff6b57",r.fillText("A",m(31),x(-28.5)),r.fillText("B",m(-28),x(-25.5)),r.font="600 8px system-ui, sans-serif",r.fillStyle="rgba(220, 212, 195, 0.62)",r.fillText("MID",m(0),x(-4)),r.fillText("CAT",m(16.8),x(-5)),r.fillText("LONG",m(38.5),x(10)),r.fillText("TUN",m(-31),x(10)),r.fillText("CT",m(7),x(-33)),r.fillText("T",m(0),x(45)),e.bombVisibleToPlayer&&e.bombPos){const d=m(e.bombPos.x),_=x(e.bombPos.z),g=5.5+Math.sin(performance.now()*.012)*2.2;e.bombState==="planted"&&(r.strokeStyle="rgba(255, 58, 48, 0.9)",r.lineWidth=1.6,r.beginPath(),r.arc(d,_,g+2,0,Math.PI*2),r.stroke()),r.fillStyle=e.bombState==="planted"?"#ff3329":"#ffc83d",r.fillRect(d-3.5,_-3.5,7,7),r.strokeStyle="#111",r.lineWidth=1,r.strokeRect(d-3.5,_-3.5,7,7)}for(const d of e.minimapActors){if(!d.visible)continue;const _=m(d.x),g=x(d.z);if(!d.alive){d.team===e.playerTeam&&(r.strokeStyle="rgba(180, 190, 200, 0.45)",r.lineWidth=1.4,r.beginPath(),r.moveTo(_-3,g-3),r.lineTo(_+3,g+3),r.moveTo(_+3,g-3),r.lineTo(_-3,g+3),r.stroke());continue}if(d.isControlled){const S=Math.atan2(-Math.cos(d.yaw),-Math.sin(d.yaw));r.fillStyle="rgba(110, 220, 255, 0.22)",r.beginPath(),r.moveTo(_,g),r.arc(_,g,24,S-.55,S+.55),r.closePath(),r.fill(),r.save(),r.translate(_,g),r.rotate(S+Math.PI/2),r.fillStyle="#48f5a1",r.beginPath(),r.moveTo(0,-6.5),r.lineTo(4.6,5),r.lineTo(0,2.5),r.lineTo(-4.6,5),r.closePath(),r.fill(),r.strokeStyle="#081014",r.lineWidth=1.2,r.stroke(),r.restore()}else{const S=d.team===e.playerTeam;r.fillStyle=S?d.team==="CT"?"#54b7ff":"#f5be49":"#ff3f3f",r.beginPath(),r.arc(_,g,S?4.2:4.6,0,Math.PI*2),r.fill(),r.strokeStyle="#0b0f14",r.lineWidth=1.3,r.stroke()}}r.strokeStyle="rgba(255, 255, 255, 0.18)",r.lineWidth=1.5,r.strokeRect(.75,.75,bn-1.5,bn-1.5)},[n,e]),L.jsxs("div",{className:"minimap-shell",children:[L.jsx("canvas",{ref:t,width:bn,height:bn,className:"minimap-canvas"}),L.jsxs("div",{className:"minimap-callout",children:[L.jsx("span",{className:"callout-dot"}),L.jsx("span",{children:e.callout})]})]})};function SA(n){const e=Math.max(0,Math.ceil(n)),t=Math.floor(e/60),i=e%60;return`${t}:${i<10?"0":""}${i}`}const MA=({hud:n,mapData:e,onTakeover:t})=>{const i=n.scopeLevel>0&&n.alive&&!n.isSpectating,r=Math.round(n.crosshairSpread);return L.jsxs("div",{className:"hud-layer",children:[(n.damageFlashAlpha>.01||n.alive&&n.hp<=25)&&L.jsx("div",{className:"damage-vignette",style:{opacity:Math.max(n.damageFlashAlpha,n.alive&&n.hp<=25?.35:0)}}),i&&L.jsxs("div",{className:`awp-scope-overlay zoom-${n.scopeLevel}`,children:[L.jsxs("div",{className:"scope-ring",children:[L.jsx("div",{className:"scope-line-h"}),L.jsx("div",{className:"scope-line-v"}),L.jsx("div",{className:"scope-ticks-h"}),L.jsx("div",{className:"scope-ticks-v"}),L.jsx("div",{className:"scope-center-dot"})]}),L.jsx("div",{className:"scope-zoom-tag",children:n.scopeLevel===2?"8.0x":"3.5x"})]}),!i&&n.alive&&!n.buyMenuOpen&&L.jsxs("div",{className:"crosshair-root",children:[L.jsx("div",{className:"ch-tick ch-top",style:{transform:`translate(-50%, ${-r-9}px)`}}),L.jsx("div",{className:"ch-tick ch-bot",style:{transform:`translate(-50%, ${r}px)`}}),L.jsx("div",{className:"ch-tick ch-left",style:{transform:`translate(${-r-9}px, -50%)`}}),L.jsx("div",{className:"ch-tick ch-right",style:{transform:`translate(${r}px, -50%)`}}),L.jsx("div",{className:"ch-dot"})]}),n.hitmarkerTime>0&&L.jsxs("div",{className:`hitmarker ${n.hitmarkerHeadshot?"headshot":""} ${n.hitmarkerKill?"kill":""}`,children:[L.jsx("span",{className:"hm-arm hm-1"}),L.jsx("span",{className:"hm-arm hm-2"}),L.jsx("span",{className:"hm-arm hm-3"}),L.jsx("span",{className:"hm-arm hm-4"}),n.lastHitZone&&L.jsxs("div",{className:"hm-label",children:[$T[n.lastHitZone]," -",n.lastHitDamage]})]}),n.damageIndicatorAngle!==null&&L.jsx("div",{className:"damage-dir-wrapper",style:{transform:`translate(-50%, -50%) rotate(${n.damageIndicatorAngle}rad)`},children:L.jsx("div",{className:"damage-dir-arrow"})}),L.jsx(yA,{mapData:e,hud:n}),L.jsxs("div",{className:"top-bar",children:[L.jsx("div",{className:"team-roster roster-ct",children:n.ctRosterAlive.map((s,o)=>L.jsx("div",{className:`roster-pip ct ${s?"alive":"dead"}`},o))}),L.jsxs("div",{className:"score-box score-ct",children:[L.jsx("span",{className:"score-label",children:"CT"}),L.jsx("span",{className:"score-num",children:n.scoreCT})]}),L.jsx("div",{className:`clock-box ${n.bombState==="planted"?"bomb-active":""}`,children:n.bombState==="planted"?L.jsxs(L.Fragment,{children:[L.jsxs("span",{className:"bomb-badge",children:["C4 · ",n.bombSite,"点"]}),L.jsxs("span",{className:"clock-time",children:[n.bombTimer.toFixed(1),"s"]})]}):L.jsxs(L.Fragment,{children:[L.jsxs("span",{className:"round-meta",children:["R",n.roundNumber," ",n.isPistolRound?"手枪局":"全枪局"]}),L.jsx("span",{className:"clock-time",children:SA(n.roundTimer)})]})}),L.jsxs("div",{className:"score-box score-t",children:[L.jsx("span",{className:"score-num",children:n.scoreT}),L.jsx("span",{className:"score-label",children:"T"})]}),L.jsx("div",{className:"team-roster roster-t",children:n.tRosterAlive.map((s,o)=>L.jsx("div",{className:`roster-pip t ${s?"alive":"dead"}`},o))})]}),L.jsx("div",{className:"killfeed",children:n.killfeed.map(s=>{var o;return L.jsxs("div",{className:"killfeed-item",children:[L.jsx("span",{className:`kf-name ${s.killerTeam.toLowerCase()}`,children:s.killerName}),L.jsxs("span",{className:"kf-weapon",children:["[",((o=Yt[s.weapon])==null?void 0:o.shortName)??s.weapon,"]"]}),s.headshot&&L.jsx("span",{className:"kf-hs",title:"爆头",children:"HS"}),L.jsx("span",{className:`kf-name ${s.victimTeam.toLowerCase()}`,children:s.victimName})]},s.id)})}),n.announcement&&L.jsx("div",{className:"hud-announcement",children:n.announcement}),n.roundPhase==="round_end"&&n.roundWinner&&L.jsxs("div",{className:`round-end-banner winner-${n.roundWinner.toLowerCase()}`,children:[L.jsx("div",{className:"reb-title",children:n.roundWinner==="CT"?"反恐精英 胜利 (CT WIN)":"恐怖分子 胜利 (T WIN)"}),L.jsx("div",{className:"reb-reason",children:n.roundWinReason})]}),n.actionType!=="none"&&L.jsxs("div",{className:"action-progress-box",children:[L.jsx("div",{className:"ap-title",children:n.actionType==="planting"?"正在安放 C4 炸弹...":"正在拆除 C4 炸弹..."}),L.jsx("div",{className:"ap-track",children:L.jsx("div",{className:`ap-fill ${n.actionType}`,style:{width:`${Math.round(n.actionProgress*100)}%`}})})]}),n.actionType==="none"&&n.canPlant&&L.jsxs("div",{className:"context-prompt plant",children:["位于 ",L.jsxs("strong",{children:[n.inBombsite," 点"]})," — 按住 ",L.jsx("kbd",{children:"E"})," 安放 C4 炸弹"]}),n.actionType==="none"&&n.canDefuse&&L.jsxs("div",{className:"context-prompt defuse",children:["靠近已安放 C4 — 按住 ",L.jsx("kbd",{children:"E"})," 拆除炸弹"]}),n.isSpectating&&n.roundPhase==="live"&&L.jsxs("div",{className:"spectator-banner",children:[L.jsxs("div",{className:"spec-title",children:["已阵亡 · 正在观战队友: ",L.jsx("strong",{children:n.controlledName})]}),L.jsxs("div",{className:"spec-actions",children:[L.jsx("span",{children:"[左键 / 右键] 切换存活队友"}),n.canTakeover&&L.jsx("button",{className:"spec-takeover-btn",onClick:t,children:"按 [E] 接管该队友"})]})]}),L.jsxs("div",{className:"hud-bottom-left",children:[L.jsxs("div",{className:`vital-card hp-card ${n.hp<=25?"critical":""}`,children:[L.jsx("span",{className:"vital-icon",children:"+"}),L.jsx("span",{className:"vital-value",children:n.hp})]}),L.jsxs("div",{className:"vital-card armor-card",children:[L.jsx("span",{className:"vital-icon",children:n.hasHelmet?"⛨":"◈"}),L.jsx("span",{className:"vital-value",children:n.armor}),L.jsx("span",{className:"vital-sub",children:n.hasHelmet?"防弹衣+头盔":"防弹衣"})]}),L.jsxs("div",{className:"money-pill",children:["$",n.money]})]}),L.jsxs("div",{className:"hud-bottom-right",children:[L.jsxs("div",{className:"weapon-slots",children:[L.jsxs("div",{className:`slot-chip ${n.activeSlot==="primary"?"active":""} ${n.slots.primary?"":"empty"}`,children:[L.jsx("span",{className:"slot-key",children:"1"}),L.jsx("span",{children:n.slots.primary?Yt[n.slots.primary].shortName:"—"})]}),L.jsxs("div",{className:`slot-chip ${n.activeSlot==="secondary"?"active":""}`,children:[L.jsx("span",{className:"slot-key",children:"2"}),L.jsx("span",{children:n.slots.secondary?Yt[n.slots.secondary].shortName:"—"})]}),L.jsxs("div",{className:`slot-chip ${n.activeSlot==="melee"?"active":""}`,children:[L.jsx("span",{className:"slot-key",children:"3"}),L.jsx("span",{children:"匕首"})]}),n.slots.c4&&L.jsxs("div",{className:`slot-chip c4-chip ${n.activeSlot==="c4"?"active":""}`,children:[L.jsx("span",{className:"slot-key",children:"4"}),L.jsx("span",{children:"C4"})]})]}),L.jsxs("div",{className:"ammo-panel",children:[L.jsxs("div",{className:"ammo-weapon-name",children:[n.activeWeaponName,n.activeWeapon==="awp"&&L.jsx("span",{className:"hint-chip",children:"右键开镜"})]}),n.reloading?L.jsxs("div",{className:"reload-wrap",children:[L.jsx("span",{className:"reload-label",children:"换弹中..."}),L.jsx("div",{className:"reload-bar",children:L.jsx("div",{className:"reload-fill",style:{width:`${Math.round(n.reloadProgress*100)}%`}})})]}):n.mag>=0?L.jsxs("div",{className:"ammo-numbers",children:[L.jsx("span",{className:`ammo-mag ${n.mag<=5?"low":""}`,children:n.mag}),L.jsx("span",{className:"ammo-sep",children:"/"}),L.jsx("span",{className:"ammo-res",children:n.reserve})]}):L.jsx("div",{className:"ammo-numbers melee-tag",children:n.activeWeapon==="c4"?"前往包点按 [E]":"左键挥砍 / 右键重刺"})]}),L.jsx("div",{className:"quick-keys-hint",children:"[B] 武器商店 · [R] 换弹 · [Tab] 战绩 · [Esc] 菜单"})]})]})},wA=({hud:n})=>{if(!n.scoreboardOpen)return null;const e=n.scoreboard.filter(r=>r.team==="CT").sort((r,s)=>s.kills-r.kills),t=n.scoreboard.filter(r=>r.team==="T").sort((r,s)=>s.kills-r.kills),i=(r,s,o,a)=>L.jsxs("div",{className:`sb-team ${s}`,children:[L.jsxs("div",{className:"sb-team-header",children:[L.jsx("span",{children:r}),L.jsx("span",{className:"sb-team-score",children:o})]}),L.jsxs("div",{className:"sb-row sb-head",children:[L.jsx("span",{children:"干员"}),L.jsx("span",{children:"状态"}),L.jsx("span",{children:"武器"}),L.jsx("span",{children:"金钱"}),L.jsx("span",{children:"K"}),L.jsx("span",{children:"D"})]}),a.map(l=>{var c;return L.jsxs("div",{className:`sb-row ${l.isHuman?"is-human":""} ${l.alive?"":"is-dead"}`,children:[L.jsxs("span",{className:"sb-name",children:[l.name,l.hasBomb&&L.jsx("em",{className:"sb-c4",children:"C4"})]}),L.jsx("span",{children:l.alive?`${l.hp} HP`:"阵亡"}),L.jsx("span",{children:((c=Yt[l.weapon])==null?void 0:c.shortName)??l.weapon}),L.jsxs("span",{children:["$",l.money]}),L.jsx("strong",{children:l.kills}),L.jsx("span",{children:l.deaths})]},l.id)})]});return L.jsx("div",{className:"scoreboard-backdrop",children:L.jsxs("div",{className:"scoreboard-panel",children:[L.jsxs("div",{className:"sb-top",children:[L.jsx("h2",{children:"DE_DUST2 · 5v5 战术对抗"}),L.jsxs("span",{children:["第 ",n.roundNumber," 回合 · ",n.isPistolRound?"手枪局":"全枪局"]})]}),L.jsxs("div",{className:"sb-grid",children:[i("反恐精英 (CT)","ct",n.scoreCT,e),i("恐怖分子 (T)","t",n.scoreT,t)]})]})})},EA=[{id:"ak47",desc:"高伤害 · 强后坐力 · 经典点射/压枪"},{id:"m4a4",desc:"中等伤害 · 低后坐力 · 高射速稳定"},{id:"awp",desc:"单发致命 · 极低射速 · 右键双倍开镜"}],TA=[{id:"glock",desc:"T 阵营默认手枪 · 20发大弹匣"},{id:"usp",desc:"CT 阵营默认消音手枪 · 高精准"},{id:"deagle",desc:"沙鹰 · 高穿甲重火力 · 7发小弹匣"}],AA=({hud:n,onBuyWeapon:e,onBuyArmor:t,onClose:i})=>n.buyMenuOpen?L.jsx("div",{className:"modal-backdrop",children:L.jsxs("div",{className:"buy-panel",children:[L.jsxs("div",{className:"buy-header",children:[L.jsxs("div",{children:[L.jsx("h2",{children:"战术军械库 · 购买装备"}),L.jsx("p",{children:n.isPistolRound?"当前为手枪局：仅限手枪与防弹衣（主武器与头盔已锁定）":"全枪局已开放：可自由装备 AK-47 / M4A4 / AWP / 沙鹰 / 默认手枪"})]}),L.jsxs("div",{className:"buy-cash",children:["$",n.money]})]}),L.jsxs("div",{className:"buy-columns",children:[L.jsxs("div",{className:"buy-col",children:[L.jsx("h3",{children:"主武器 (Rifles / Sniper)"}),EA.map(({id:r,desc:s})=>{const o=Yt[r],a=n.isPistolRound,l=n.slots.primary===r,c=n.money>=o.price;return L.jsxs("button",{className:`buy-item ${l?"owned":""} ${a?"locked":""}`,disabled:a||!c,onClick:()=>e(r),children:[L.jsxs("div",{className:"bi-top",children:[L.jsx("strong",{children:o.name}),L.jsx("span",{className:"bi-price",children:a?"手枪局锁定":`$${o.price}`})]}),L.jsx("div",{className:"bi-desc",children:s}),L.jsxs("div",{className:"bi-stats",children:["伤害 ",o.baseDamage," · 弹匣 ",o.magSize,"/",o.reserveMax]})]},r)})]}),L.jsxs("div",{className:"buy-col",children:[L.jsx("h3",{children:"副武器手枪 (Pistols)"}),TA.map(({id:r,desc:s})=>{const o=Yt[r],a=n.slots.secondary===r,l=n.money>=o.price;return L.jsxs("button",{className:`buy-item ${a?"owned":""}`,disabled:!l,onClick:()=>e(r),children:[L.jsxs("div",{className:"bi-top",children:[L.jsx("strong",{children:o.name}),L.jsxs("span",{className:"bi-price",children:["$",o.price]})]}),L.jsx("div",{className:"bi-desc",children:s}),L.jsxs("div",{className:"bi-stats",children:["伤害 ",o.baseDamage," · 弹匣 ",o.magSize,"/",o.reserveMax]})]},r)}),L.jsx("h3",{style:{marginTop:14},children:"战术护甲 (Armor)"}),L.jsxs("div",{className:"armor-row",children:[L.jsx("button",{className:"buy-item compact",disabled:n.money<650,onClick:()=>t(!1),children:L.jsxs("div",{className:"bi-top",children:[L.jsx("strong",{children:"凯夫拉防弹衣"}),L.jsx("span",{className:"bi-price",children:"$650"})]})}),L.jsx("button",{className:`buy-item compact ${n.isPistolRound?"locked":""}`,disabled:n.isPistolRound||n.money<1e3,onClick:()=>t(!0),children:L.jsxs("div",{className:"bi-top",children:[L.jsx("strong",{children:"防弹衣 + 头盔"}),L.jsx("span",{className:"bi-price",children:n.isPistolRound?"锁定":"$1000"})]})})]})]})]}),L.jsx("div",{className:"buy-footer",children:L.jsx("button",{className:"btn-primary",onClick:i,children:"返回战斗 [B / Esc]"})})]})}):null,bA=({hud:n,onStart:e,onResume:t,onSwitchTeam:i,onSwitchMode:r,onSkipToFullBuy:s,onSetSensitivity:o,onSetVolume:a})=>{const[l,c]=Xn.useState(n.playerTeam),[h,u]=Xn.useState(n.gameMode);return n.started?n.paused&&!n.buyMenuOpen?L.jsx("div",{className:"modal-backdrop",children:L.jsxs("div",{className:"pause-panel",children:[L.jsxs("div",{className:"pause-head",children:[L.jsx("h2",{children:"游戏已暂停 · DE_DUST2"}),L.jsxs("span",{className:"pause-score",children:["CT ",n.scoreCT," : ",n.scoreT," T (R",n.roundNumber,")"]})]}),L.jsxs("div",{className:"pause-sliders",children:[L.jsxs("label",{children:[L.jsxs("span",{children:["鼠标灵敏度: ",n.sensitivity.toFixed(2)]}),L.jsx("input",{type:"range",min:"0.2",max:"2.5",step:"0.05",value:n.sensitivity,onChange:f=>o(parseFloat(f.target.value))})]}),L.jsxs("label",{children:[L.jsxs("span",{children:["主音量: ",Math.round(n.volume*100),"%"]}),L.jsx("input",{type:"range",min:"0",max:"1",step:"0.05",value:n.volume,onChange:f=>a(parseFloat(f.target.value))})]})]}),L.jsxs("div",{className:"pause-quick-actions",children:[L.jsx("button",{className:"btn-primary full",onClick:t,children:"继续战斗 (重新锁定视角)"}),L.jsxs("div",{className:"pause-btn-row",children:[L.jsxs("button",{className:"btn-secondary",onClick:()=>i(n.playerTeam==="CT"?"T":"CT"),children:["切换阵营 (",n.playerTeam==="CT"?"改为 T 阵营":"改为 CT 阵营",")"]}),L.jsx("button",{className:"btn-secondary",onClick:s,children:"直接进入全枪局 (体验 AK/M4/AWP)"})]}),L.jsxs("div",{className:"pause-btn-row",children:[L.jsx("button",{className:"btn-secondary",onClick:()=>r("standard"),children:"重开标准赛 (R1 手枪局)"}),L.jsx("button",{className:"btn-secondary",onClick:()=>r("full_buy"),children:"重开全枪局模式"})]})]}),L.jsxs("div",{className:"pause-help",children:[L.jsx("strong",{children:"操作速查："})," WASD 移动 · Space 跳跃 · Shift 静步 · Ctrl/C 蹲伏 · R 换弹 · 1/2/3/4/Q/滚轮 切枪 · 右键 AWP 开镜 / 匕首重击 · E 安放或拆除 C4（阵亡时按 E 接管存活队友）· B 武器商店 · Tab 战绩板"]})]})}):null:L.jsx("div",{className:"title-backdrop",children:L.jsxs("div",{className:"title-card",children:[L.jsx("div",{className:"title-eyebrow",children:"THREE.JS · PROCEDURAL 3D TACTICAL FPS"}),L.jsx("h1",{className:"title-heading",children:"DE_DUST2 // 5v5"}),L.jsx("p",{className:"title-sub",children:"完整 Dust2 核心地图（T/CT出生点 · A大 · A点 · 中门 · 猫道 · B洞 · B点）· 分区 Hitbox · 5v5 AI 寻路与 C4 攻防 · Web Audio 合成音效"}),L.jsxs("div",{className:"setup-section",children:[L.jsx("label",{children:"选择阵营 (SIDE)"}),L.jsxs("div",{className:"choice-grid two",children:[L.jsxs("button",{className:`choice-card ct ${l==="CT"?"active":""}`,onClick:()=>c("CT"),children:[L.jsx("strong",{children:"反恐精英 (CT)"}),L.jsx("span",{children:"默认 USP-S / M4A4 · 防守包点 & 拆除 C4"})]}),L.jsxs("button",{className:`choice-card t ${l==="T"?"active":""}`,onClick:()=>c("T"),children:[L.jsx("strong",{children:"恐怖分子 (T)"}),L.jsx("span",{children:"默认 Glock-18 / AK-47 · 携带并安放 C4"})]})]})]}),L.jsxs("div",{className:"setup-section",children:[L.jsx("label",{children:"开局模式 (MATCH MODE)"}),L.jsxs("div",{className:"choice-grid three",children:[L.jsxs("button",{className:`choice-card ${h==="standard"?"active":""}`,onClick:()=>u("standard"),children:[L.jsx("strong",{children:"标准竞赛 (推荐)"}),L.jsx("span",{children:"R1 手枪局开局 → R2+ 全枪局"})]}),L.jsxs("button",{className:`choice-card ${h==="pistol_only"?"active":""}`,onClick:()=>u("pistol_only"),children:[L.jsx("strong",{children:"纯手枪局模式"}),L.jsx("span",{children:"仅手枪与防弹衣对决"})]}),L.jsxs("button",{className:`choice-card ${h==="full_buy"?"active":""}`,onClick:()=>u("full_buy"),children:[L.jsx("strong",{children:"全枪局热身"}),L.jsx("span",{children:"首回合即开放 AK/M4/AWP/沙鹰"})]})]})]}),L.jsxs("div",{className:"controls-strip",children:[L.jsxs("span",{children:[L.jsx("kbd",{children:"WASD"})," 移动"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"Space"})," 跳跃"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"Shift"})," 静步"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"Ctrl"})," 蹲下"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"左键"})," 开火"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"右键"})," AWP开镜/重刀"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"1-4"})," 切枪"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"R"})," 换弹"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"E"})," 下包/拆包/接管AI"]}),L.jsxs("span",{children:[L.jsx("kbd",{children:"B"})," 购买武器"]})]}),L.jsx("button",{className:"btn-launch",onClick:()=>e(l,h),children:"进入 Dust2 战场 (锁定鼠标)"})]})})};function CA(){const n=Xn.useRef(null),e=Xn.useRef(null),[t,i]=Xn.useState(null);Xn.useEffect(()=>{const s=n.current;if(!s)return;const o=new xA(s,a=>{i(a)});return e.current=o,()=>{o.dispose(),e.current=null}},[]);const r=e.current;return L.jsxs("div",{className:"app-root",children:[L.jsx("div",{ref:n,className:"viewport-canvas-host"}),t&&t.started&&L.jsx(MA,{hud:t,mapData:r?r.mapData:null,onTakeover:()=>r==null?void 0:r.takeoverSpectatedBot()}),t&&L.jsx(wA,{hud:t}),t&&L.jsx(AA,{hud:t,onBuyWeapon:s=>r==null?void 0:r.buyWeapon(s),onBuyArmor:s=>r==null?void 0:r.buyArmor(s),onClose:()=>r==null?void 0:r.closeBuyMenu()}),t&&L.jsx(bA,{hud:t,onStart:(s,o)=>r==null?void 0:r.startGame(s,o),onResume:()=>r==null?void 0:r.resumeGame(),onSwitchTeam:s=>r==null?void 0:r.setTeamAndRestart(s),onSwitchMode:s=>r==null?void 0:r.setGameModeAndRestart(s),onSkipToFullBuy:()=>r==null?void 0:r.skipToFullBuyRound(),onSetSensitivity:s=>r==null?void 0:r.setSensitivity(s),onSetVolume:s=>r==null?void 0:r.setVolume(s)})]})}Iu.createRoot(document.getElementById("root")).render(L.jsx(U_.StrictMode,{children:L.jsx(CA,{})}));

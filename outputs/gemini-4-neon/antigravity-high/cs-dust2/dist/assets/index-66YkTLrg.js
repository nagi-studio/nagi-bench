var T_=Object.defineProperty;var A_=(n,e,t)=>e in n?T_(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var O=(n,e,t)=>A_(n,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=t(r);fetch(r.href,s)}})();function b_(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}var Am={exports:{}},kl={},bm={exports:{}},Xe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var jo=Symbol.for("react.element"),C_=Symbol.for("react.portal"),R_=Symbol.for("react.fragment"),P_=Symbol.for("react.strict_mode"),L_=Symbol.for("react.profiler"),D_=Symbol.for("react.provider"),I_=Symbol.for("react.context"),N_=Symbol.for("react.forward_ref"),U_=Symbol.for("react.suspense"),z_=Symbol.for("react.memo"),F_=Symbol.for("react.lazy"),df=Symbol.iterator;function k_(n){return n===null||typeof n!="object"?null:(n=df&&n[df]||n["@@iterator"],typeof n=="function"?n:null)}var Cm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Rm=Object.assign,Pm={};function Bs(n,e,t){this.props=n,this.context=e,this.refs=Pm,this.updater=t||Cm}Bs.prototype.isReactComponent={};Bs.prototype.setState=function(n,e){if(typeof n!="object"&&typeof n!="function"&&n!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,n,e,"setState")};Bs.prototype.forceUpdate=function(n){this.updater.enqueueForceUpdate(this,n,"forceUpdate")};function Lm(){}Lm.prototype=Bs.prototype;function jd(n,e,t){this.props=n,this.context=e,this.refs=Pm,this.updater=t||Cm}var Yd=jd.prototype=new Lm;Yd.constructor=jd;Rm(Yd,Bs.prototype);Yd.isPureReactComponent=!0;var hf=Array.isArray,Dm=Object.prototype.hasOwnProperty,qd={current:null},Im={key:!0,ref:!0,__self:!0,__source:!0};function Nm(n,e,t){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)Dm.call(e,i)&&!Im.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=t;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(n&&n.defaultProps)for(i in a=n.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:jo,type:n,key:s,ref:o,props:r,_owner:qd.current}}function O_(n,e){return{$$typeof:jo,type:n.type,key:e,ref:n.ref,props:n.props,_owner:n._owner}}function $d(n){return typeof n=="object"&&n!==null&&n.$$typeof===jo}function B_(n){var e={"=":"=0",":":"=2"};return"$"+n.replace(/[=:]/g,function(t){return e[t]})}var ff=/\/+/g;function oc(n,e){return typeof n=="object"&&n!==null&&n.key!=null?B_(""+n.key):e.toString(36)}function Xa(n,e,t,i,r){var s=typeof n;(s==="undefined"||s==="boolean")&&(n=null);var o=!1;if(n===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(n.$$typeof){case jo:case C_:o=!0}}if(o)return o=n,r=r(o),n=i===""?"."+oc(o,0):i,hf(r)?(t="",n!=null&&(t=n.replace(ff,"$&/")+"/"),Xa(r,e,t,"",function(c){return c})):r!=null&&($d(r)&&(r=O_(r,t+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(ff,"$&/")+"/")+n)),e.push(r)),1;if(o=0,i=i===""?".":i+":",hf(n))for(var a=0;a<n.length;a++){s=n[a];var l=i+oc(s,a);o+=Xa(s,e,t,l,r)}else if(l=k_(n),typeof l=="function")for(n=l.call(n),a=0;!(s=n.next()).done;)s=s.value,l=i+oc(s,a++),o+=Xa(s,e,t,l,r);else if(s==="object")throw e=String(n),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function ra(n,e,t){if(n==null)return n;var i=[],r=0;return Xa(n,i,"","",function(s){return e.call(t,s,r++)}),i}function H_(n){if(n._status===-1){var e=n._result;e=e(),e.then(function(t){(n._status===0||n._status===-1)&&(n._status=1,n._result=t)},function(t){(n._status===0||n._status===-1)&&(n._status=2,n._result=t)}),n._status===-1&&(n._status=0,n._result=e)}if(n._status===1)return n._result.default;throw n._result}var an={current:null},ja={transition:null},V_={ReactCurrentDispatcher:an,ReactCurrentBatchConfig:ja,ReactCurrentOwner:qd};function Um(){throw Error("act(...) is not supported in production builds of React.")}Xe.Children={map:ra,forEach:function(n,e,t){ra(n,function(){e.apply(this,arguments)},t)},count:function(n){var e=0;return ra(n,function(){e++}),e},toArray:function(n){return ra(n,function(e){return e})||[]},only:function(n){if(!$d(n))throw Error("React.Children.only expected to receive a single React element child.");return n}};Xe.Component=Bs;Xe.Fragment=R_;Xe.Profiler=L_;Xe.PureComponent=jd;Xe.StrictMode=P_;Xe.Suspense=U_;Xe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=V_;Xe.act=Um;Xe.cloneElement=function(n,e,t){if(n==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+n+".");var i=Rm({},n.props),r=n.key,s=n.ref,o=n._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=qd.current),e.key!==void 0&&(r=""+e.key),n.type&&n.type.defaultProps)var a=n.type.defaultProps;for(l in e)Dm.call(e,l)&&!Im.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=t;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:jo,type:n.type,key:r,ref:s,props:i,_owner:o}};Xe.createContext=function(n){return n={$$typeof:I_,_currentValue:n,_currentValue2:n,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},n.Provider={$$typeof:D_,_context:n},n.Consumer=n};Xe.createElement=Nm;Xe.createFactory=function(n){var e=Nm.bind(null,n);return e.type=n,e};Xe.createRef=function(){return{current:null}};Xe.forwardRef=function(n){return{$$typeof:N_,render:n}};Xe.isValidElement=$d;Xe.lazy=function(n){return{$$typeof:F_,_payload:{_status:-1,_result:n},_init:H_}};Xe.memo=function(n,e){return{$$typeof:z_,type:n,compare:e===void 0?null:e}};Xe.startTransition=function(n){var e=ja.transition;ja.transition={};try{n()}finally{ja.transition=e}};Xe.unstable_act=Um;Xe.useCallback=function(n,e){return an.current.useCallback(n,e)};Xe.useContext=function(n){return an.current.useContext(n)};Xe.useDebugValue=function(){};Xe.useDeferredValue=function(n){return an.current.useDeferredValue(n)};Xe.useEffect=function(n,e){return an.current.useEffect(n,e)};Xe.useId=function(){return an.current.useId()};Xe.useImperativeHandle=function(n,e,t){return an.current.useImperativeHandle(n,e,t)};Xe.useInsertionEffect=function(n,e){return an.current.useInsertionEffect(n,e)};Xe.useLayoutEffect=function(n,e){return an.current.useLayoutEffect(n,e)};Xe.useMemo=function(n,e){return an.current.useMemo(n,e)};Xe.useReducer=function(n,e,t){return an.current.useReducer(n,e,t)};Xe.useRef=function(n){return an.current.useRef(n)};Xe.useState=function(n){return an.current.useState(n)};Xe.useSyncExternalStore=function(n,e,t){return an.current.useSyncExternalStore(n,e,t)};Xe.useTransition=function(){return an.current.useTransition()};Xe.version="18.3.1";bm.exports=Xe;var Zt=bm.exports;const zm=b_(Zt);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var G_=Zt,W_=Symbol.for("react.element"),X_=Symbol.for("react.fragment"),j_=Object.prototype.hasOwnProperty,Y_=G_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,q_={key:!0,ref:!0,__self:!0,__source:!0};function Fm(n,e,t){var i,r={},s=null,o=null;t!==void 0&&(s=""+t),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)j_.call(e,i)&&!q_.hasOwnProperty(i)&&(r[i]=e[i]);if(n&&n.defaultProps)for(i in e=n.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:W_,type:n,key:s,ref:o,props:r,_owner:Y_.current}}kl.Fragment=X_;kl.jsx=Fm;kl.jsxs=Fm;Am.exports=kl;var L=Am.exports,hu={},km={exports:{}},An={},Om={exports:{}},Bm={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(n){function e(D,$){var ee=D.length;D.push($);e:for(;0<ee;){var ce=ee-1>>>1,ye=D[ce];if(0<r(ye,$))D[ce]=$,D[ee]=ye,ee=ce;else break e}}function t(D){return D.length===0?null:D[0]}function i(D){if(D.length===0)return null;var $=D[0],ee=D.pop();if(ee!==$){D[0]=ee;e:for(var ce=0,ye=D.length,Ge=ye>>>1;ce<Ge;){var q=2*(ce+1)-1,se=D[q],pe=q+1,ue=D[pe];if(0>r(se,ee))pe<ye&&0>r(ue,se)?(D[ce]=ue,D[pe]=ee,ce=pe):(D[ce]=se,D[q]=ee,ce=q);else if(pe<ye&&0>r(ue,ee))D[ce]=ue,D[pe]=ee,ce=pe;else break e}}return $}function r(D,$){var ee=D.sortIndex-$.sortIndex;return ee!==0?ee:D.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;n.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();n.unstable_now=function(){return o.now()-a}}var l=[],c=[],d=1,h=null,f=3,p=!1,v=!1,y=!1,m=typeof setTimeout=="function"?setTimeout:null,u=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function _(D){for(var $=t(c);$!==null;){if($.callback===null)i(c);else if($.startTime<=D)i(c),$.sortIndex=$.expirationTime,e(l,$);else break;$=t(c)}}function x(D){if(y=!1,_(D),!v)if(t(l)!==null)v=!0,X(w);else{var $=t(c);$!==null&&J(x,$.startTime-D)}}function w(D,$){v=!1,y&&(y=!1,u(C),C=-1),p=!0;var ee=f;try{for(_($),h=t(l);h!==null&&(!(h.expirationTime>$)||D&&!P());){var ce=h.callback;if(typeof ce=="function"){h.callback=null,f=h.priorityLevel;var ye=ce(h.expirationTime<=$);$=n.unstable_now(),typeof ye=="function"?h.callback=ye:h===t(l)&&i(l),_($)}else i(l);h=t(l)}if(h!==null)var Ge=!0;else{var q=t(c);q!==null&&J(x,q.startTime-$),Ge=!1}return Ge}finally{h=null,f=ee,p=!1}}var T=!1,A=null,C=-1,M=5,S=-1;function P(){return!(n.unstable_now()-S<M)}function B(){if(A!==null){var D=n.unstable_now();S=D;var $=!0;try{$=A(!0,D)}finally{$?z():(T=!1,A=null)}}else T=!1}var z;if(typeof g=="function")z=function(){g(B)};else if(typeof MessageChannel<"u"){var V=new MessageChannel,Y=V.port2;V.port1.onmessage=B,z=function(){Y.postMessage(null)}}else z=function(){m(B,0)};function X(D){A=D,T||(T=!0,z())}function J(D,$){C=m(function(){D(n.unstable_now())},$)}n.unstable_IdlePriority=5,n.unstable_ImmediatePriority=1,n.unstable_LowPriority=4,n.unstable_NormalPriority=3,n.unstable_Profiling=null,n.unstable_UserBlockingPriority=2,n.unstable_cancelCallback=function(D){D.callback=null},n.unstable_continueExecution=function(){v||p||(v=!0,X(w))},n.unstable_forceFrameRate=function(D){0>D||125<D?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):M=0<D?Math.floor(1e3/D):5},n.unstable_getCurrentPriorityLevel=function(){return f},n.unstable_getFirstCallbackNode=function(){return t(l)},n.unstable_next=function(D){switch(f){case 1:case 2:case 3:var $=3;break;default:$=f}var ee=f;f=$;try{return D()}finally{f=ee}},n.unstable_pauseExecution=function(){},n.unstable_requestPaint=function(){},n.unstable_runWithPriority=function(D,$){switch(D){case 1:case 2:case 3:case 4:case 5:break;default:D=3}var ee=f;f=D;try{return $()}finally{f=ee}},n.unstable_scheduleCallback=function(D,$,ee){var ce=n.unstable_now();switch(typeof ee=="object"&&ee!==null?(ee=ee.delay,ee=typeof ee=="number"&&0<ee?ce+ee:ce):ee=ce,D){case 1:var ye=-1;break;case 2:ye=250;break;case 5:ye=1073741823;break;case 4:ye=1e4;break;default:ye=5e3}return ye=ee+ye,D={id:d++,callback:$,priorityLevel:D,startTime:ee,expirationTime:ye,sortIndex:-1},ee>ce?(D.sortIndex=ee,e(c,D),t(l)===null&&D===t(c)&&(y?(u(C),C=-1):y=!0,J(x,ee-ce))):(D.sortIndex=ye,e(l,D),v||p||(v=!0,X(w))),D},n.unstable_shouldYield=P,n.unstable_wrapCallback=function(D){var $=f;return function(){var ee=f;f=$;try{return D.apply(this,arguments)}finally{f=ee}}}})(Bm);Om.exports=Bm;var $_=Om.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var K_=Zt,Tn=$_;function re(n){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+n,t=1;t<arguments.length;t++)e+="&args[]="+encodeURIComponent(arguments[t]);return"Minified React error #"+n+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Hm=new Set,Ao={};function Or(n,e){bs(n,e),bs(n+"Capture",e)}function bs(n,e){for(Ao[n]=e,n=0;n<e.length;n++)Hm.add(e[n])}var Ai=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),fu=Object.prototype.hasOwnProperty,Z_=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,pf={},mf={};function Q_(n){return fu.call(mf,n)?!0:fu.call(pf,n)?!1:Z_.test(n)?mf[n]=!0:(pf[n]=!0,!1)}function J_(n,e,t,i){if(t!==null&&t.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:t!==null?!t.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function ev(n,e,t,i){if(e===null||typeof e>"u"||J_(n,e,t,i))return!0;if(i)return!1;if(t!==null)switch(t.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function ln(n,e,t,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=t,this.propertyName=n,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Wt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){Wt[n]=new ln(n,0,!1,n,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var e=n[0];Wt[e]=new ln(e,1,!1,n[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(n){Wt[n]=new ln(n,2,!1,n.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){Wt[n]=new ln(n,2,!1,n,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){Wt[n]=new ln(n,3,!1,n.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(n){Wt[n]=new ln(n,3,!0,n,null,!1,!1)});["capture","download"].forEach(function(n){Wt[n]=new ln(n,4,!1,n,null,!1,!1)});["cols","rows","size","span"].forEach(function(n){Wt[n]=new ln(n,6,!1,n,null,!1,!1)});["rowSpan","start"].forEach(function(n){Wt[n]=new ln(n,5,!1,n.toLowerCase(),null,!1,!1)});var Kd=/[\-:]([a-z])/g;function Zd(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var e=n.replace(Kd,Zd);Wt[e]=new ln(e,1,!1,n,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var e=n.replace(Kd,Zd);Wt[e]=new ln(e,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(n){var e=n.replace(Kd,Zd);Wt[e]=new ln(e,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(n){Wt[n]=new ln(n,1,!1,n.toLowerCase(),null,!1,!1)});Wt.xlinkHref=new ln("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(n){Wt[n]=new ln(n,1,!1,n.toLowerCase(),null,!0,!0)});function Qd(n,e,t,i){var r=Wt.hasOwnProperty(e)?Wt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(ev(e,t,r,i)&&(t=null),i||r===null?Q_(e)&&(t===null?n.removeAttribute(e):n.setAttribute(e,""+t)):r.mustUseProperty?n[r.propertyName]=t===null?r.type===3?!1:"":t:(e=r.attributeName,i=r.attributeNamespace,t===null?n.removeAttribute(e):(r=r.type,t=r===3||r===4&&t===!0?"":""+t,i?n.setAttributeNS(i,e,t):n.setAttribute(e,t))))}var Li=K_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,sa=Symbol.for("react.element"),ss=Symbol.for("react.portal"),os=Symbol.for("react.fragment"),Jd=Symbol.for("react.strict_mode"),pu=Symbol.for("react.profiler"),Vm=Symbol.for("react.provider"),Gm=Symbol.for("react.context"),eh=Symbol.for("react.forward_ref"),mu=Symbol.for("react.suspense"),gu=Symbol.for("react.suspense_list"),th=Symbol.for("react.memo"),Hi=Symbol.for("react.lazy"),Wm=Symbol.for("react.offscreen"),gf=Symbol.iterator;function $s(n){return n===null||typeof n!="object"?null:(n=gf&&n[gf]||n["@@iterator"],typeof n=="function"?n:null)}var Et=Object.assign,ac;function uo(n){if(ac===void 0)try{throw Error()}catch(t){var e=t.stack.trim().match(/\n( *(at )?)/);ac=e&&e[1]||""}return`
`+ac+n}var lc=!1;function cc(n,e){if(!n||lc)return"";lc=!0;var t=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(n,[],e)}else{try{e.call()}catch(c){i=c}n.call(e.prototype)}else{try{throw Error()}catch(c){i=c}n()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return n.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",n.displayName)),l}while(1<=o&&0<=a);break}}}finally{lc=!1,Error.prepareStackTrace=t}return(n=n?n.displayName||n.name:"")?uo(n):""}function tv(n){switch(n.tag){case 5:return uo(n.type);case 16:return uo("Lazy");case 13:return uo("Suspense");case 19:return uo("SuspenseList");case 0:case 2:case 15:return n=cc(n.type,!1),n;case 11:return n=cc(n.type.render,!1),n;case 1:return n=cc(n.type,!0),n;default:return""}}function _u(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case os:return"Fragment";case ss:return"Portal";case pu:return"Profiler";case Jd:return"StrictMode";case mu:return"Suspense";case gu:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case Gm:return(n.displayName||"Context")+".Consumer";case Vm:return(n._context.displayName||"Context")+".Provider";case eh:var e=n.render;return n=n.displayName,n||(n=e.displayName||e.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case th:return e=n.displayName||null,e!==null?e:_u(n.type)||"Memo";case Hi:e=n._payload,n=n._init;try{return _u(n(e))}catch{}}return null}function nv(n){var e=n.type;switch(n.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=e.render,n=n.displayName||n.name||"",e.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return _u(e);case 8:return e===Jd?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function rr(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Xm(n){var e=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function iv(n){var e=Xm(n)?"checked":"value",t=Object.getOwnPropertyDescriptor(n.constructor.prototype,e),i=""+n[e];if(!n.hasOwnProperty(e)&&typeof t<"u"&&typeof t.get=="function"&&typeof t.set=="function"){var r=t.get,s=t.set;return Object.defineProperty(n,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(n,e,{enumerable:t.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){n._valueTracker=null,delete n[e]}}}}function oa(n){n._valueTracker||(n._valueTracker=iv(n))}function jm(n){if(!n)return!1;var e=n._valueTracker;if(!e)return!0;var t=e.getValue(),i="";return n&&(i=Xm(n)?n.checked?"true":"false":n.value),n=i,n!==t?(e.setValue(n),!0):!1}function cl(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function vu(n,e){var t=e.checked;return Et({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:t??n._wrapperState.initialChecked})}function _f(n,e){var t=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;t=rr(e.value!=null?e.value:t),n._wrapperState={initialChecked:i,initialValue:t,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Ym(n,e){e=e.checked,e!=null&&Qd(n,"checked",e,!1)}function xu(n,e){Ym(n,e);var t=rr(e.value),i=e.type;if(t!=null)i==="number"?(t===0&&n.value===""||n.value!=t)&&(n.value=""+t):n.value!==""+t&&(n.value=""+t);else if(i==="submit"||i==="reset"){n.removeAttribute("value");return}e.hasOwnProperty("value")?yu(n,e.type,t):e.hasOwnProperty("defaultValue")&&yu(n,e.type,rr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(n.defaultChecked=!!e.defaultChecked)}function vf(n,e,t){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+n._wrapperState.initialValue,t||e===n.value||(n.value=e),n.defaultValue=e}t=n.name,t!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,t!==""&&(n.name=t)}function yu(n,e,t){(e!=="number"||cl(n.ownerDocument)!==n)&&(t==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+t&&(n.defaultValue=""+t))}var ho=Array.isArray;function vs(n,e,t,i){if(n=n.options,e){e={};for(var r=0;r<t.length;r++)e["$"+t[r]]=!0;for(t=0;t<n.length;t++)r=e.hasOwnProperty("$"+n[t].value),n[t].selected!==r&&(n[t].selected=r),r&&i&&(n[t].defaultSelected=!0)}else{for(t=""+rr(t),e=null,r=0;r<n.length;r++){if(n[r].value===t){n[r].selected=!0,i&&(n[r].defaultSelected=!0);return}e!==null||n[r].disabled||(e=n[r])}e!==null&&(e.selected=!0)}}function Su(n,e){if(e.dangerouslySetInnerHTML!=null)throw Error(re(91));return Et({},e,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function xf(n,e){var t=e.value;if(t==null){if(t=e.children,e=e.defaultValue,t!=null){if(e!=null)throw Error(re(92));if(ho(t)){if(1<t.length)throw Error(re(93));t=t[0]}e=t}e==null&&(e=""),t=e}n._wrapperState={initialValue:rr(t)}}function qm(n,e){var t=rr(e.value),i=rr(e.defaultValue);t!=null&&(t=""+t,t!==n.value&&(n.value=t),e.defaultValue==null&&n.defaultValue!==t&&(n.defaultValue=t)),i!=null&&(n.defaultValue=""+i)}function yf(n){var e=n.textContent;e===n._wrapperState.initialValue&&e!==""&&e!==null&&(n.value=e)}function $m(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Mu(n,e){return n==null||n==="http://www.w3.org/1999/xhtml"?$m(e):n==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var aa,Km=function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,t,i,r){MSApp.execUnsafeLocalFunction(function(){return n(e,t,i,r)})}:n}(function(n,e){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=e;else{for(aa=aa||document.createElement("div"),aa.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=aa.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;e.firstChild;)n.appendChild(e.firstChild)}});function bo(n,e){if(e){var t=n.firstChild;if(t&&t===n.lastChild&&t.nodeType===3){t.nodeValue=e;return}}n.textContent=e}var _o={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},rv=["Webkit","ms","Moz","O"];Object.keys(_o).forEach(function(n){rv.forEach(function(e){e=e+n.charAt(0).toUpperCase()+n.substring(1),_o[e]=_o[n]})});function Zm(n,e,t){return e==null||typeof e=="boolean"||e===""?"":t||typeof e!="number"||e===0||_o.hasOwnProperty(n)&&_o[n]?(""+e).trim():e+"px"}function Qm(n,e){n=n.style;for(var t in e)if(e.hasOwnProperty(t)){var i=t.indexOf("--")===0,r=Zm(t,e[t],i);t==="float"&&(t="cssFloat"),i?n.setProperty(t,r):n[t]=r}}var sv=Et({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function wu(n,e){if(e){if(sv[n]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(re(137,n));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(re(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(re(61))}if(e.style!=null&&typeof e.style!="object")throw Error(re(62))}}function Eu(n,e){if(n.indexOf("-")===-1)return typeof e.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Tu=null;function nh(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Au=null,xs=null,ys=null;function Sf(n){if(n=$o(n)){if(typeof Au!="function")throw Error(re(280));var e=n.stateNode;e&&(e=Gl(e),Au(n.stateNode,n.type,e))}}function Jm(n){xs?ys?ys.push(n):ys=[n]:xs=n}function e0(){if(xs){var n=xs,e=ys;if(ys=xs=null,Sf(n),e)for(n=0;n<e.length;n++)Sf(e[n])}}function t0(n,e){return n(e)}function n0(){}var uc=!1;function i0(n,e,t){if(uc)return n(e,t);uc=!0;try{return t0(n,e,t)}finally{uc=!1,(xs!==null||ys!==null)&&(n0(),e0())}}function Co(n,e){var t=n.stateNode;if(t===null)return null;var i=Gl(t);if(i===null)return null;t=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(n=n.type,i=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!i;break e;default:n=!1}if(n)return null;if(t&&typeof t!="function")throw Error(re(231,e,typeof t));return t}var bu=!1;if(Ai)try{var Ks={};Object.defineProperty(Ks,"passive",{get:function(){bu=!0}}),window.addEventListener("test",Ks,Ks),window.removeEventListener("test",Ks,Ks)}catch{bu=!1}function ov(n,e,t,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(t,c)}catch(d){this.onError(d)}}var vo=!1,ul=null,dl=!1,Cu=null,av={onError:function(n){vo=!0,ul=n}};function lv(n,e,t,i,r,s,o,a,l){vo=!1,ul=null,ov.apply(av,arguments)}function cv(n,e,t,i,r,s,o,a,l){if(lv.apply(this,arguments),vo){if(vo){var c=ul;vo=!1,ul=null}else throw Error(re(198));dl||(dl=!0,Cu=c)}}function Br(n){var e=n,t=n;if(n.alternate)for(;e.return;)e=e.return;else{n=e;do e=n,e.flags&4098&&(t=e.return),n=e.return;while(n)}return e.tag===3?t:null}function r0(n){if(n.tag===13){var e=n.memoizedState;if(e===null&&(n=n.alternate,n!==null&&(e=n.memoizedState)),e!==null)return e.dehydrated}return null}function Mf(n){if(Br(n)!==n)throw Error(re(188))}function uv(n){var e=n.alternate;if(!e){if(e=Br(n),e===null)throw Error(re(188));return e!==n?null:n}for(var t=n,i=e;;){var r=t.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){t=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===t)return Mf(r),n;if(s===i)return Mf(r),e;s=s.sibling}throw Error(re(188))}if(t.return!==i.return)t=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===t){o=!0,t=r,i=s;break}if(a===i){o=!0,i=r,t=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===t){o=!0,t=s,i=r;break}if(a===i){o=!0,i=s,t=r;break}a=a.sibling}if(!o)throw Error(re(189))}}if(t.alternate!==i)throw Error(re(190))}if(t.tag!==3)throw Error(re(188));return t.stateNode.current===t?n:e}function s0(n){return n=uv(n),n!==null?o0(n):null}function o0(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var e=o0(n);if(e!==null)return e;n=n.sibling}return null}var a0=Tn.unstable_scheduleCallback,wf=Tn.unstable_cancelCallback,dv=Tn.unstable_shouldYield,hv=Tn.unstable_requestPaint,bt=Tn.unstable_now,fv=Tn.unstable_getCurrentPriorityLevel,ih=Tn.unstable_ImmediatePriority,l0=Tn.unstable_UserBlockingPriority,hl=Tn.unstable_NormalPriority,pv=Tn.unstable_LowPriority,c0=Tn.unstable_IdlePriority,Ol=null,si=null;function mv(n){if(si&&typeof si.onCommitFiberRoot=="function")try{si.onCommitFiberRoot(Ol,n,void 0,(n.current.flags&128)===128)}catch{}}var $n=Math.clz32?Math.clz32:vv,gv=Math.log,_v=Math.LN2;function vv(n){return n>>>=0,n===0?32:31-(gv(n)/_v|0)|0}var la=64,ca=4194304;function fo(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function fl(n,e){var t=n.pendingLanes;if(t===0)return 0;var i=0,r=n.suspendedLanes,s=n.pingedLanes,o=t&268435455;if(o!==0){var a=o&~r;a!==0?i=fo(a):(s&=o,s!==0&&(i=fo(s)))}else o=t&~r,o!==0?i=fo(o):s!==0&&(i=fo(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=t&16),e=n.entangledLanes,e!==0)for(n=n.entanglements,e&=i;0<e;)t=31-$n(e),r=1<<t,i|=n[t],e&=~r;return i}function xv(n,e){switch(n){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function yv(n,e){for(var t=n.suspendedLanes,i=n.pingedLanes,r=n.expirationTimes,s=n.pendingLanes;0<s;){var o=31-$n(s),a=1<<o,l=r[o];l===-1?(!(a&t)||a&i)&&(r[o]=xv(a,e)):l<=e&&(n.expiredLanes|=a),s&=~a}}function Ru(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function u0(){var n=la;return la<<=1,!(la&4194240)&&(la=64),n}function dc(n){for(var e=[],t=0;31>t;t++)e.push(n);return e}function Yo(n,e,t){n.pendingLanes|=e,e!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,e=31-$n(e),n[e]=t}function Sv(n,e){var t=n.pendingLanes&~e;n.pendingLanes=e,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=e,n.mutableReadLanes&=e,n.entangledLanes&=e,e=n.entanglements;var i=n.eventTimes;for(n=n.expirationTimes;0<t;){var r=31-$n(t),s=1<<r;e[r]=0,i[r]=-1,n[r]=-1,t&=~s}}function rh(n,e){var t=n.entangledLanes|=e;for(n=n.entanglements;t;){var i=31-$n(t),r=1<<i;r&e|n[i]&e&&(n[i]|=e),t&=~r}}var lt=0;function d0(n){return n&=-n,1<n?4<n?n&268435455?16:536870912:4:1}var h0,sh,f0,p0,m0,Pu=!1,ua=[],qi=null,$i=null,Ki=null,Ro=new Map,Po=new Map,Gi=[],Mv="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ef(n,e){switch(n){case"focusin":case"focusout":qi=null;break;case"dragenter":case"dragleave":$i=null;break;case"mouseover":case"mouseout":Ki=null;break;case"pointerover":case"pointerout":Ro.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Po.delete(e.pointerId)}}function Zs(n,e,t,i,r,s){return n===null||n.nativeEvent!==s?(n={blockedOn:e,domEventName:t,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=$o(e),e!==null&&sh(e)),n):(n.eventSystemFlags|=i,e=n.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),n)}function wv(n,e,t,i,r){switch(e){case"focusin":return qi=Zs(qi,n,e,t,i,r),!0;case"dragenter":return $i=Zs($i,n,e,t,i,r),!0;case"mouseover":return Ki=Zs(Ki,n,e,t,i,r),!0;case"pointerover":var s=r.pointerId;return Ro.set(s,Zs(Ro.get(s)||null,n,e,t,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Po.set(s,Zs(Po.get(s)||null,n,e,t,i,r)),!0}return!1}function g0(n){var e=Er(n.target);if(e!==null){var t=Br(e);if(t!==null){if(e=t.tag,e===13){if(e=r0(t),e!==null){n.blockedOn=e,m0(n.priority,function(){f0(t)});return}}else if(e===3&&t.stateNode.current.memoizedState.isDehydrated){n.blockedOn=t.tag===3?t.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Ya(n){if(n.blockedOn!==null)return!1;for(var e=n.targetContainers;0<e.length;){var t=Lu(n.domEventName,n.eventSystemFlags,e[0],n.nativeEvent);if(t===null){t=n.nativeEvent;var i=new t.constructor(t.type,t);Tu=i,t.target.dispatchEvent(i),Tu=null}else return e=$o(t),e!==null&&sh(e),n.blockedOn=t,!1;e.shift()}return!0}function Tf(n,e,t){Ya(n)&&t.delete(e)}function Ev(){Pu=!1,qi!==null&&Ya(qi)&&(qi=null),$i!==null&&Ya($i)&&($i=null),Ki!==null&&Ya(Ki)&&(Ki=null),Ro.forEach(Tf),Po.forEach(Tf)}function Qs(n,e){n.blockedOn===e&&(n.blockedOn=null,Pu||(Pu=!0,Tn.unstable_scheduleCallback(Tn.unstable_NormalPriority,Ev)))}function Lo(n){function e(r){return Qs(r,n)}if(0<ua.length){Qs(ua[0],n);for(var t=1;t<ua.length;t++){var i=ua[t];i.blockedOn===n&&(i.blockedOn=null)}}for(qi!==null&&Qs(qi,n),$i!==null&&Qs($i,n),Ki!==null&&Qs(Ki,n),Ro.forEach(e),Po.forEach(e),t=0;t<Gi.length;t++)i=Gi[t],i.blockedOn===n&&(i.blockedOn=null);for(;0<Gi.length&&(t=Gi[0],t.blockedOn===null);)g0(t),t.blockedOn===null&&Gi.shift()}var Ss=Li.ReactCurrentBatchConfig,pl=!0;function Tv(n,e,t,i){var r=lt,s=Ss.transition;Ss.transition=null;try{lt=1,oh(n,e,t,i)}finally{lt=r,Ss.transition=s}}function Av(n,e,t,i){var r=lt,s=Ss.transition;Ss.transition=null;try{lt=4,oh(n,e,t,i)}finally{lt=r,Ss.transition=s}}function oh(n,e,t,i){if(pl){var r=Lu(n,e,t,i);if(r===null)Sc(n,e,i,ml,t),Ef(n,i);else if(wv(r,n,e,t,i))i.stopPropagation();else if(Ef(n,i),e&4&&-1<Mv.indexOf(n)){for(;r!==null;){var s=$o(r);if(s!==null&&h0(s),s=Lu(n,e,t,i),s===null&&Sc(n,e,i,ml,t),s===r)break;r=s}r!==null&&i.stopPropagation()}else Sc(n,e,i,null,t)}}var ml=null;function Lu(n,e,t,i){if(ml=null,n=nh(i),n=Er(n),n!==null)if(e=Br(n),e===null)n=null;else if(t=e.tag,t===13){if(n=r0(e),n!==null)return n;n=null}else if(t===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;n=null}else e!==n&&(n=null);return ml=n,null}function _0(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(fv()){case ih:return 1;case l0:return 4;case hl:case pv:return 16;case c0:return 536870912;default:return 16}default:return 16}}var ji=null,ah=null,qa=null;function v0(){if(qa)return qa;var n,e=ah,t=e.length,i,r="value"in ji?ji.value:ji.textContent,s=r.length;for(n=0;n<t&&e[n]===r[n];n++);var o=t-n;for(i=1;i<=o&&e[t-i]===r[s-i];i++);return qa=r.slice(n,1<i?1-i:void 0)}function $a(n){var e=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&e===13&&(n=13)):n=e,n===10&&(n=13),32<=n||n===13?n:0}function da(){return!0}function Af(){return!1}function bn(n){function e(t,i,r,s,o){this._reactName=t,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in n)n.hasOwnProperty(a)&&(t=n[a],this[a]=t?t(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?da:Af,this.isPropagationStopped=Af,this}return Et(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var t=this.nativeEvent;t&&(t.preventDefault?t.preventDefault():typeof t.returnValue!="unknown"&&(t.returnValue=!1),this.isDefaultPrevented=da)},stopPropagation:function(){var t=this.nativeEvent;t&&(t.stopPropagation?t.stopPropagation():typeof t.cancelBubble!="unknown"&&(t.cancelBubble=!0),this.isPropagationStopped=da)},persist:function(){},isPersistent:da}),e}var Hs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},lh=bn(Hs),qo=Et({},Hs,{view:0,detail:0}),bv=bn(qo),hc,fc,Js,Bl=Et({},qo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ch,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Js&&(Js&&n.type==="mousemove"?(hc=n.screenX-Js.screenX,fc=n.screenY-Js.screenY):fc=hc=0,Js=n),hc)},movementY:function(n){return"movementY"in n?n.movementY:fc}}),bf=bn(Bl),Cv=Et({},Bl,{dataTransfer:0}),Rv=bn(Cv),Pv=Et({},qo,{relatedTarget:0}),pc=bn(Pv),Lv=Et({},Hs,{animationName:0,elapsedTime:0,pseudoElement:0}),Dv=bn(Lv),Iv=Et({},Hs,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),Nv=bn(Iv),Uv=Et({},Hs,{data:0}),Cf=bn(Uv),zv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Fv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},kv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ov(n){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(n):(n=kv[n])?!!e[n]:!1}function ch(){return Ov}var Bv=Et({},qo,{key:function(n){if(n.key){var e=zv[n.key]||n.key;if(e!=="Unidentified")return e}return n.type==="keypress"?(n=$a(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?Fv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ch,charCode:function(n){return n.type==="keypress"?$a(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?$a(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),Hv=bn(Bv),Vv=Et({},Bl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Rf=bn(Vv),Gv=Et({},qo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ch}),Wv=bn(Gv),Xv=Et({},Hs,{propertyName:0,elapsedTime:0,pseudoElement:0}),jv=bn(Xv),Yv=Et({},Bl,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),qv=bn(Yv),$v=[9,13,27,32],uh=Ai&&"CompositionEvent"in window,xo=null;Ai&&"documentMode"in document&&(xo=document.documentMode);var Kv=Ai&&"TextEvent"in window&&!xo,x0=Ai&&(!uh||xo&&8<xo&&11>=xo),Pf=" ",Lf=!1;function y0(n,e){switch(n){case"keyup":return $v.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function S0(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var as=!1;function Zv(n,e){switch(n){case"compositionend":return S0(e);case"keypress":return e.which!==32?null:(Lf=!0,Pf);case"textInput":return n=e.data,n===Pf&&Lf?null:n;default:return null}}function Qv(n,e){if(as)return n==="compositionend"||!uh&&y0(n,e)?(n=v0(),qa=ah=ji=null,as=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return x0&&e.locale!=="ko"?null:e.data;default:return null}}var Jv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Df(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e==="input"?!!Jv[n.type]:e==="textarea"}function M0(n,e,t,i){Jm(i),e=gl(e,"onChange"),0<e.length&&(t=new lh("onChange","change",null,t,i),n.push({event:t,listeners:e}))}var yo=null,Do=null;function ex(n){I0(n,0)}function Hl(n){var e=us(n);if(jm(e))return n}function tx(n,e){if(n==="change")return e}var w0=!1;if(Ai){var mc;if(Ai){var gc="oninput"in document;if(!gc){var If=document.createElement("div");If.setAttribute("oninput","return;"),gc=typeof If.oninput=="function"}mc=gc}else mc=!1;w0=mc&&(!document.documentMode||9<document.documentMode)}function Nf(){yo&&(yo.detachEvent("onpropertychange",E0),Do=yo=null)}function E0(n){if(n.propertyName==="value"&&Hl(Do)){var e=[];M0(e,Do,n,nh(n)),i0(ex,e)}}function nx(n,e,t){n==="focusin"?(Nf(),yo=e,Do=t,yo.attachEvent("onpropertychange",E0)):n==="focusout"&&Nf()}function ix(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Hl(Do)}function rx(n,e){if(n==="click")return Hl(e)}function sx(n,e){if(n==="input"||n==="change")return Hl(e)}function ox(n,e){return n===e&&(n!==0||1/n===1/e)||n!==n&&e!==e}var Qn=typeof Object.is=="function"?Object.is:ox;function Io(n,e){if(Qn(n,e))return!0;if(typeof n!="object"||n===null||typeof e!="object"||e===null)return!1;var t=Object.keys(n),i=Object.keys(e);if(t.length!==i.length)return!1;for(i=0;i<t.length;i++){var r=t[i];if(!fu.call(e,r)||!Qn(n[r],e[r]))return!1}return!0}function Uf(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function zf(n,e){var t=Uf(n);n=0;for(var i;t;){if(t.nodeType===3){if(i=n+t.textContent.length,n<=e&&i>=e)return{node:t,offset:e-n};n=i}e:{for(;t;){if(t.nextSibling){t=t.nextSibling;break e}t=t.parentNode}t=void 0}t=Uf(t)}}function T0(n,e){return n&&e?n===e?!0:n&&n.nodeType===3?!1:e&&e.nodeType===3?T0(n,e.parentNode):"contains"in n?n.contains(e):n.compareDocumentPosition?!!(n.compareDocumentPosition(e)&16):!1:!1}function A0(){for(var n=window,e=cl();e instanceof n.HTMLIFrameElement;){try{var t=typeof e.contentWindow.location.href=="string"}catch{t=!1}if(t)n=e.contentWindow;else break;e=cl(n.document)}return e}function dh(n){var e=n&&n.nodeName&&n.nodeName.toLowerCase();return e&&(e==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||e==="textarea"||n.contentEditable==="true")}function ax(n){var e=A0(),t=n.focusedElem,i=n.selectionRange;if(e!==t&&t&&t.ownerDocument&&T0(t.ownerDocument.documentElement,t)){if(i!==null&&dh(t)){if(e=i.start,n=i.end,n===void 0&&(n=e),"selectionStart"in t)t.selectionStart=e,t.selectionEnd=Math.min(n,t.value.length);else if(n=(e=t.ownerDocument||document)&&e.defaultView||window,n.getSelection){n=n.getSelection();var r=t.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!n.extend&&s>i&&(r=i,i=s,s=r),r=zf(t,s);var o=zf(t,i);r&&o&&(n.rangeCount!==1||n.anchorNode!==r.node||n.anchorOffset!==r.offset||n.focusNode!==o.node||n.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),n.removeAllRanges(),s>i?(n.addRange(e),n.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),n.addRange(e)))}}for(e=[],n=t;n=n.parentNode;)n.nodeType===1&&e.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof t.focus=="function"&&t.focus(),t=0;t<e.length;t++)n=e[t],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var lx=Ai&&"documentMode"in document&&11>=document.documentMode,ls=null,Du=null,So=null,Iu=!1;function Ff(n,e,t){var i=t.window===t?t.document:t.nodeType===9?t:t.ownerDocument;Iu||ls==null||ls!==cl(i)||(i=ls,"selectionStart"in i&&dh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),So&&Io(So,i)||(So=i,i=gl(Du,"onSelect"),0<i.length&&(e=new lh("onSelect","select",null,e,t),n.push({event:e,listeners:i}),e.target=ls)))}function ha(n,e){var t={};return t[n.toLowerCase()]=e.toLowerCase(),t["Webkit"+n]="webkit"+e,t["Moz"+n]="moz"+e,t}var cs={animationend:ha("Animation","AnimationEnd"),animationiteration:ha("Animation","AnimationIteration"),animationstart:ha("Animation","AnimationStart"),transitionend:ha("Transition","TransitionEnd")},_c={},b0={};Ai&&(b0=document.createElement("div").style,"AnimationEvent"in window||(delete cs.animationend.animation,delete cs.animationiteration.animation,delete cs.animationstart.animation),"TransitionEvent"in window||delete cs.transitionend.transition);function Vl(n){if(_c[n])return _c[n];if(!cs[n])return n;var e=cs[n],t;for(t in e)if(e.hasOwnProperty(t)&&t in b0)return _c[n]=e[t];return n}var C0=Vl("animationend"),R0=Vl("animationiteration"),P0=Vl("animationstart"),L0=Vl("transitionend"),D0=new Map,kf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function lr(n,e){D0.set(n,e),Or(e,[n])}for(var vc=0;vc<kf.length;vc++){var xc=kf[vc],cx=xc.toLowerCase(),ux=xc[0].toUpperCase()+xc.slice(1);lr(cx,"on"+ux)}lr(C0,"onAnimationEnd");lr(R0,"onAnimationIteration");lr(P0,"onAnimationStart");lr("dblclick","onDoubleClick");lr("focusin","onFocus");lr("focusout","onBlur");lr(L0,"onTransitionEnd");bs("onMouseEnter",["mouseout","mouseover"]);bs("onMouseLeave",["mouseout","mouseover"]);bs("onPointerEnter",["pointerout","pointerover"]);bs("onPointerLeave",["pointerout","pointerover"]);Or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Or("onBeforeInput",["compositionend","keypress","textInput","paste"]);Or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var po="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),dx=new Set("cancel close invalid load scroll toggle".split(" ").concat(po));function Of(n,e,t){var i=n.type||"unknown-event";n.currentTarget=t,cv(i,e,void 0,n),n.currentTarget=null}function I0(n,e){e=(e&4)!==0;for(var t=0;t<n.length;t++){var i=n[t],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;Of(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;Of(r,a,c),s=l}}}if(dl)throw n=Cu,dl=!1,Cu=null,n}function vt(n,e){var t=e[ku];t===void 0&&(t=e[ku]=new Set);var i=n+"__bubble";t.has(i)||(N0(e,n,2,!1),t.add(i))}function yc(n,e,t){var i=0;e&&(i|=4),N0(t,n,i,e)}var fa="_reactListening"+Math.random().toString(36).slice(2);function No(n){if(!n[fa]){n[fa]=!0,Hm.forEach(function(t){t!=="selectionchange"&&(dx.has(t)||yc(t,!1,n),yc(t,!0,n))});var e=n.nodeType===9?n:n.ownerDocument;e===null||e[fa]||(e[fa]=!0,yc("selectionchange",!1,e))}}function N0(n,e,t,i){switch(_0(e)){case 1:var r=Tv;break;case 4:r=Av;break;default:r=oh}t=r.bind(null,e,t,n),r=void 0,!bu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?n.addEventListener(e,t,{capture:!0,passive:r}):n.addEventListener(e,t,!0):r!==void 0?n.addEventListener(e,t,{passive:r}):n.addEventListener(e,t,!1)}function Sc(n,e,t,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=Er(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}i0(function(){var c=s,d=nh(t),h=[];e:{var f=D0.get(n);if(f!==void 0){var p=lh,v=n;switch(n){case"keypress":if($a(t)===0)break e;case"keydown":case"keyup":p=Hv;break;case"focusin":v="focus",p=pc;break;case"focusout":v="blur",p=pc;break;case"beforeblur":case"afterblur":p=pc;break;case"click":if(t.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=bf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=Rv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=Wv;break;case C0:case R0:case P0:p=Dv;break;case L0:p=jv;break;case"scroll":p=bv;break;case"wheel":p=qv;break;case"copy":case"cut":case"paste":p=Nv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=Rf}var y=(e&4)!==0,m=!y&&n==="scroll",u=y?f!==null?f+"Capture":null:f;y=[];for(var g=c,_;g!==null;){_=g;var x=_.stateNode;if(_.tag===5&&x!==null&&(_=x,u!==null&&(x=Co(g,u),x!=null&&y.push(Uo(g,x,_)))),m)break;g=g.return}0<y.length&&(f=new p(f,v,null,t,d),h.push({event:f,listeners:y}))}}if(!(e&7)){e:{if(f=n==="mouseover"||n==="pointerover",p=n==="mouseout"||n==="pointerout",f&&t!==Tu&&(v=t.relatedTarget||t.fromElement)&&(Er(v)||v[bi]))break e;if((p||f)&&(f=d.window===d?d:(f=d.ownerDocument)?f.defaultView||f.parentWindow:window,p?(v=t.relatedTarget||t.toElement,p=c,v=v?Er(v):null,v!==null&&(m=Br(v),v!==m||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(y=bf,x="onMouseLeave",u="onMouseEnter",g="mouse",(n==="pointerout"||n==="pointerover")&&(y=Rf,x="onPointerLeave",u="onPointerEnter",g="pointer"),m=p==null?f:us(p),_=v==null?f:us(v),f=new y(x,g+"leave",p,t,d),f.target=m,f.relatedTarget=_,x=null,Er(d)===c&&(y=new y(u,g+"enter",v,t,d),y.target=_,y.relatedTarget=m,x=y),m=x,p&&v)t:{for(y=p,u=v,g=0,_=y;_;_=Vr(_))g++;for(_=0,x=u;x;x=Vr(x))_++;for(;0<g-_;)y=Vr(y),g--;for(;0<_-g;)u=Vr(u),_--;for(;g--;){if(y===u||u!==null&&y===u.alternate)break t;y=Vr(y),u=Vr(u)}y=null}else y=null;p!==null&&Bf(h,f,p,y,!1),v!==null&&m!==null&&Bf(h,m,v,y,!0)}}e:{if(f=c?us(c):window,p=f.nodeName&&f.nodeName.toLowerCase(),p==="select"||p==="input"&&f.type==="file")var w=tx;else if(Df(f))if(w0)w=sx;else{w=ix;var T=nx}else(p=f.nodeName)&&p.toLowerCase()==="input"&&(f.type==="checkbox"||f.type==="radio")&&(w=rx);if(w&&(w=w(n,c))){M0(h,w,t,d);break e}T&&T(n,f,c),n==="focusout"&&(T=f._wrapperState)&&T.controlled&&f.type==="number"&&yu(f,"number",f.value)}switch(T=c?us(c):window,n){case"focusin":(Df(T)||T.contentEditable==="true")&&(ls=T,Du=c,So=null);break;case"focusout":So=Du=ls=null;break;case"mousedown":Iu=!0;break;case"contextmenu":case"mouseup":case"dragend":Iu=!1,Ff(h,t,d);break;case"selectionchange":if(lx)break;case"keydown":case"keyup":Ff(h,t,d)}var A;if(uh)e:{switch(n){case"compositionstart":var C="onCompositionStart";break e;case"compositionend":C="onCompositionEnd";break e;case"compositionupdate":C="onCompositionUpdate";break e}C=void 0}else as?y0(n,t)&&(C="onCompositionEnd"):n==="keydown"&&t.keyCode===229&&(C="onCompositionStart");C&&(x0&&t.locale!=="ko"&&(as||C!=="onCompositionStart"?C==="onCompositionEnd"&&as&&(A=v0()):(ji=d,ah="value"in ji?ji.value:ji.textContent,as=!0)),T=gl(c,C),0<T.length&&(C=new Cf(C,n,null,t,d),h.push({event:C,listeners:T}),A?C.data=A:(A=S0(t),A!==null&&(C.data=A)))),(A=Kv?Zv(n,t):Qv(n,t))&&(c=gl(c,"onBeforeInput"),0<c.length&&(d=new Cf("onBeforeInput","beforeinput",null,t,d),h.push({event:d,listeners:c}),d.data=A))}I0(h,e)})}function Uo(n,e,t){return{instance:n,listener:e,currentTarget:t}}function gl(n,e){for(var t=e+"Capture",i=[];n!==null;){var r=n,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Co(n,t),s!=null&&i.unshift(Uo(n,s,r)),s=Co(n,e),s!=null&&i.push(Uo(n,s,r))),n=n.return}return i}function Vr(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Bf(n,e,t,i,r){for(var s=e._reactName,o=[];t!==null&&t!==i;){var a=t,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=Co(t,s),l!=null&&o.unshift(Uo(t,l,a))):r||(l=Co(t,s),l!=null&&o.push(Uo(t,l,a)))),t=t.return}o.length!==0&&n.push({event:e,listeners:o})}var hx=/\r\n?/g,fx=/\u0000|\uFFFD/g;function Hf(n){return(typeof n=="string"?n:""+n).replace(hx,`
`).replace(fx,"")}function pa(n,e,t){if(e=Hf(e),Hf(n)!==e&&t)throw Error(re(425))}function _l(){}var Nu=null,Uu=null;function zu(n,e){return n==="textarea"||n==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Fu=typeof setTimeout=="function"?setTimeout:void 0,px=typeof clearTimeout=="function"?clearTimeout:void 0,Vf=typeof Promise=="function"?Promise:void 0,mx=typeof queueMicrotask=="function"?queueMicrotask:typeof Vf<"u"?function(n){return Vf.resolve(null).then(n).catch(gx)}:Fu;function gx(n){setTimeout(function(){throw n})}function Mc(n,e){var t=e,i=0;do{var r=t.nextSibling;if(n.removeChild(t),r&&r.nodeType===8)if(t=r.data,t==="/$"){if(i===0){n.removeChild(r),Lo(e);return}i--}else t!=="$"&&t!=="$?"&&t!=="$!"||i++;t=r}while(t);Lo(e)}function Zi(n){for(;n!=null;n=n.nextSibling){var e=n.nodeType;if(e===1||e===3)break;if(e===8){if(e=n.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return n}function Gf(n){n=n.previousSibling;for(var e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="$"||t==="$!"||t==="$?"){if(e===0)return n;e--}else t==="/$"&&e++}n=n.previousSibling}return null}var Vs=Math.random().toString(36).slice(2),ii="__reactFiber$"+Vs,zo="__reactProps$"+Vs,bi="__reactContainer$"+Vs,ku="__reactEvents$"+Vs,_x="__reactListeners$"+Vs,vx="__reactHandles$"+Vs;function Er(n){var e=n[ii];if(e)return e;for(var t=n.parentNode;t;){if(e=t[bi]||t[ii]){if(t=e.alternate,e.child!==null||t!==null&&t.child!==null)for(n=Gf(n);n!==null;){if(t=n[ii])return t;n=Gf(n)}return e}n=t,t=n.parentNode}return null}function $o(n){return n=n[ii]||n[bi],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function us(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(re(33))}function Gl(n){return n[zo]||null}var Ou=[],ds=-1;function cr(n){return{current:n}}function xt(n){0>ds||(n.current=Ou[ds],Ou[ds]=null,ds--)}function ft(n,e){ds++,Ou[ds]=n.current,n.current=e}var sr={},Qt=cr(sr),mn=cr(!1),Dr=sr;function Cs(n,e){var t=n.type.contextTypes;if(!t)return sr;var i=n.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in t)r[s]=e[s];return i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=e,n.__reactInternalMemoizedMaskedChildContext=r),r}function gn(n){return n=n.childContextTypes,n!=null}function vl(){xt(mn),xt(Qt)}function Wf(n,e,t){if(Qt.current!==sr)throw Error(re(168));ft(Qt,e),ft(mn,t)}function U0(n,e,t){var i=n.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return t;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(re(108,nv(n)||"Unknown",r));return Et({},t,i)}function xl(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||sr,Dr=Qt.current,ft(Qt,n),ft(mn,mn.current),!0}function Xf(n,e,t){var i=n.stateNode;if(!i)throw Error(re(169));t?(n=U0(n,e,Dr),i.__reactInternalMemoizedMergedChildContext=n,xt(mn),xt(Qt),ft(Qt,n)):xt(mn),ft(mn,t)}var vi=null,Wl=!1,wc=!1;function z0(n){vi===null?vi=[n]:vi.push(n)}function xx(n){Wl=!0,z0(n)}function ur(){if(!wc&&vi!==null){wc=!0;var n=0,e=lt;try{var t=vi;for(lt=1;n<t.length;n++){var i=t[n];do i=i(!0);while(i!==null)}vi=null,Wl=!1}catch(r){throw vi!==null&&(vi=vi.slice(n+1)),a0(ih,ur),r}finally{lt=e,wc=!1}}return null}var hs=[],fs=0,yl=null,Sl=0,Ln=[],Dn=0,Ir=null,yi=1,Si="";function vr(n,e){hs[fs++]=Sl,hs[fs++]=yl,yl=n,Sl=e}function F0(n,e,t){Ln[Dn++]=yi,Ln[Dn++]=Si,Ln[Dn++]=Ir,Ir=n;var i=yi;n=Si;var r=32-$n(i)-1;i&=~(1<<r),t+=1;var s=32-$n(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,yi=1<<32-$n(e)+r|t<<r|i,Si=s+n}else yi=1<<s|t<<r|i,Si=n}function hh(n){n.return!==null&&(vr(n,1),F0(n,1,0))}function fh(n){for(;n===yl;)yl=hs[--fs],hs[fs]=null,Sl=hs[--fs],hs[fs]=null;for(;n===Ir;)Ir=Ln[--Dn],Ln[Dn]=null,Si=Ln[--Dn],Ln[Dn]=null,yi=Ln[--Dn],Ln[Dn]=null}var En=null,wn=null,St=!1,jn=null;function k0(n,e){var t=In(5,null,null,0);t.elementType="DELETED",t.stateNode=e,t.return=n,e=n.deletions,e===null?(n.deletions=[t],n.flags|=16):e.push(t)}function jf(n,e){switch(n.tag){case 5:var t=n.type;return e=e.nodeType!==1||t.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(n.stateNode=e,En=n,wn=Zi(e.firstChild),!0):!1;case 6:return e=n.pendingProps===""||e.nodeType!==3?null:e,e!==null?(n.stateNode=e,En=n,wn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(t=Ir!==null?{id:yi,overflow:Si}:null,n.memoizedState={dehydrated:e,treeContext:t,retryLane:1073741824},t=In(18,null,null,0),t.stateNode=e,t.return=n,n.child=t,En=n,wn=null,!0):!1;default:return!1}}function Bu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function Hu(n){if(St){var e=wn;if(e){var t=e;if(!jf(n,e)){if(Bu(n))throw Error(re(418));e=Zi(t.nextSibling);var i=En;e&&jf(n,e)?k0(i,t):(n.flags=n.flags&-4097|2,St=!1,En=n)}}else{if(Bu(n))throw Error(re(418));n.flags=n.flags&-4097|2,St=!1,En=n}}}function Yf(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;En=n}function ma(n){if(n!==En)return!1;if(!St)return Yf(n),St=!0,!1;var e;if((e=n.tag!==3)&&!(e=n.tag!==5)&&(e=n.type,e=e!=="head"&&e!=="body"&&!zu(n.type,n.memoizedProps)),e&&(e=wn)){if(Bu(n))throw O0(),Error(re(418));for(;e;)k0(n,e),e=Zi(e.nextSibling)}if(Yf(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(re(317));e:{for(n=n.nextSibling,e=0;n;){if(n.nodeType===8){var t=n.data;if(t==="/$"){if(e===0){wn=Zi(n.nextSibling);break e}e--}else t!=="$"&&t!=="$!"&&t!=="$?"||e++}n=n.nextSibling}wn=null}}else wn=En?Zi(n.stateNode.nextSibling):null;return!0}function O0(){for(var n=wn;n;)n=Zi(n.nextSibling)}function Rs(){wn=En=null,St=!1}function ph(n){jn===null?jn=[n]:jn.push(n)}var yx=Li.ReactCurrentBatchConfig;function eo(n,e,t){if(n=t.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(t._owner){if(t=t._owner,t){if(t.tag!==1)throw Error(re(309));var i=t.stateNode}if(!i)throw Error(re(147,n));var r=i,s=""+n;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof n!="string")throw Error(re(284));if(!t._owner)throw Error(re(290,n))}return n}function ga(n,e){throw n=Object.prototype.toString.call(e),Error(re(31,n==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":n))}function qf(n){var e=n._init;return e(n._payload)}function B0(n){function e(u,g){if(n){var _=u.deletions;_===null?(u.deletions=[g],u.flags|=16):_.push(g)}}function t(u,g){if(!n)return null;for(;g!==null;)e(u,g),g=g.sibling;return null}function i(u,g){for(u=new Map;g!==null;)g.key!==null?u.set(g.key,g):u.set(g.index,g),g=g.sibling;return u}function r(u,g){return u=tr(u,g),u.index=0,u.sibling=null,u}function s(u,g,_){return u.index=_,n?(_=u.alternate,_!==null?(_=_.index,_<g?(u.flags|=2,g):_):(u.flags|=2,g)):(u.flags|=1048576,g)}function o(u){return n&&u.alternate===null&&(u.flags|=2),u}function a(u,g,_,x){return g===null||g.tag!==6?(g=Pc(_,u.mode,x),g.return=u,g):(g=r(g,_),g.return=u,g)}function l(u,g,_,x){var w=_.type;return w===os?d(u,g,_.props.children,x,_.key):g!==null&&(g.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===Hi&&qf(w)===g.type)?(x=r(g,_.props),x.ref=eo(u,g,_),x.return=u,x):(x=nl(_.type,_.key,_.props,null,u.mode,x),x.ref=eo(u,g,_),x.return=u,x)}function c(u,g,_,x){return g===null||g.tag!==4||g.stateNode.containerInfo!==_.containerInfo||g.stateNode.implementation!==_.implementation?(g=Lc(_,u.mode,x),g.return=u,g):(g=r(g,_.children||[]),g.return=u,g)}function d(u,g,_,x,w){return g===null||g.tag!==7?(g=Lr(_,u.mode,x,w),g.return=u,g):(g=r(g,_),g.return=u,g)}function h(u,g,_){if(typeof g=="string"&&g!==""||typeof g=="number")return g=Pc(""+g,u.mode,_),g.return=u,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case sa:return _=nl(g.type,g.key,g.props,null,u.mode,_),_.ref=eo(u,null,g),_.return=u,_;case ss:return g=Lc(g,u.mode,_),g.return=u,g;case Hi:var x=g._init;return h(u,x(g._payload),_)}if(ho(g)||$s(g))return g=Lr(g,u.mode,_,null),g.return=u,g;ga(u,g)}return null}function f(u,g,_,x){var w=g!==null?g.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return w!==null?null:a(u,g,""+_,x);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case sa:return _.key===w?l(u,g,_,x):null;case ss:return _.key===w?c(u,g,_,x):null;case Hi:return w=_._init,f(u,g,w(_._payload),x)}if(ho(_)||$s(_))return w!==null?null:d(u,g,_,x,null);ga(u,_)}return null}function p(u,g,_,x,w){if(typeof x=="string"&&x!==""||typeof x=="number")return u=u.get(_)||null,a(g,u,""+x,w);if(typeof x=="object"&&x!==null){switch(x.$$typeof){case sa:return u=u.get(x.key===null?_:x.key)||null,l(g,u,x,w);case ss:return u=u.get(x.key===null?_:x.key)||null,c(g,u,x,w);case Hi:var T=x._init;return p(u,g,_,T(x._payload),w)}if(ho(x)||$s(x))return u=u.get(_)||null,d(g,u,x,w,null);ga(g,x)}return null}function v(u,g,_,x){for(var w=null,T=null,A=g,C=g=0,M=null;A!==null&&C<_.length;C++){A.index>C?(M=A,A=null):M=A.sibling;var S=f(u,A,_[C],x);if(S===null){A===null&&(A=M);break}n&&A&&S.alternate===null&&e(u,A),g=s(S,g,C),T===null?w=S:T.sibling=S,T=S,A=M}if(C===_.length)return t(u,A),St&&vr(u,C),w;if(A===null){for(;C<_.length;C++)A=h(u,_[C],x),A!==null&&(g=s(A,g,C),T===null?w=A:T.sibling=A,T=A);return St&&vr(u,C),w}for(A=i(u,A);C<_.length;C++)M=p(A,u,C,_[C],x),M!==null&&(n&&M.alternate!==null&&A.delete(M.key===null?C:M.key),g=s(M,g,C),T===null?w=M:T.sibling=M,T=M);return n&&A.forEach(function(P){return e(u,P)}),St&&vr(u,C),w}function y(u,g,_,x){var w=$s(_);if(typeof w!="function")throw Error(re(150));if(_=w.call(_),_==null)throw Error(re(151));for(var T=w=null,A=g,C=g=0,M=null,S=_.next();A!==null&&!S.done;C++,S=_.next()){A.index>C?(M=A,A=null):M=A.sibling;var P=f(u,A,S.value,x);if(P===null){A===null&&(A=M);break}n&&A&&P.alternate===null&&e(u,A),g=s(P,g,C),T===null?w=P:T.sibling=P,T=P,A=M}if(S.done)return t(u,A),St&&vr(u,C),w;if(A===null){for(;!S.done;C++,S=_.next())S=h(u,S.value,x),S!==null&&(g=s(S,g,C),T===null?w=S:T.sibling=S,T=S);return St&&vr(u,C),w}for(A=i(u,A);!S.done;C++,S=_.next())S=p(A,u,C,S.value,x),S!==null&&(n&&S.alternate!==null&&A.delete(S.key===null?C:S.key),g=s(S,g,C),T===null?w=S:T.sibling=S,T=S);return n&&A.forEach(function(B){return e(u,B)}),St&&vr(u,C),w}function m(u,g,_,x){if(typeof _=="object"&&_!==null&&_.type===os&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case sa:e:{for(var w=_.key,T=g;T!==null;){if(T.key===w){if(w=_.type,w===os){if(T.tag===7){t(u,T.sibling),g=r(T,_.props.children),g.return=u,u=g;break e}}else if(T.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===Hi&&qf(w)===T.type){t(u,T.sibling),g=r(T,_.props),g.ref=eo(u,T,_),g.return=u,u=g;break e}t(u,T);break}else e(u,T);T=T.sibling}_.type===os?(g=Lr(_.props.children,u.mode,x,_.key),g.return=u,u=g):(x=nl(_.type,_.key,_.props,null,u.mode,x),x.ref=eo(u,g,_),x.return=u,u=x)}return o(u);case ss:e:{for(T=_.key;g!==null;){if(g.key===T)if(g.tag===4&&g.stateNode.containerInfo===_.containerInfo&&g.stateNode.implementation===_.implementation){t(u,g.sibling),g=r(g,_.children||[]),g.return=u,u=g;break e}else{t(u,g);break}else e(u,g);g=g.sibling}g=Lc(_,u.mode,x),g.return=u,u=g}return o(u);case Hi:return T=_._init,m(u,g,T(_._payload),x)}if(ho(_))return v(u,g,_,x);if($s(_))return y(u,g,_,x);ga(u,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,g!==null&&g.tag===6?(t(u,g.sibling),g=r(g,_),g.return=u,u=g):(t(u,g),g=Pc(_,u.mode,x),g.return=u,u=g),o(u)):t(u,g)}return m}var Ps=B0(!0),H0=B0(!1),Ml=cr(null),wl=null,ps=null,mh=null;function gh(){mh=ps=wl=null}function _h(n){var e=Ml.current;xt(Ml),n._currentValue=e}function Vu(n,e,t){for(;n!==null;){var i=n.alternate;if((n.childLanes&e)!==e?(n.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),n===t)break;n=n.return}}function Ms(n,e){wl=n,mh=ps=null,n=n.dependencies,n!==null&&n.firstContext!==null&&(n.lanes&e&&(pn=!0),n.firstContext=null)}function zn(n){var e=n._currentValue;if(mh!==n)if(n={context:n,memoizedValue:e,next:null},ps===null){if(wl===null)throw Error(re(308));ps=n,wl.dependencies={lanes:0,firstContext:n}}else ps=ps.next=n;return e}var Tr=null;function vh(n){Tr===null?Tr=[n]:Tr.push(n)}function V0(n,e,t,i){var r=e.interleaved;return r===null?(t.next=t,vh(e)):(t.next=r.next,r.next=t),e.interleaved=t,Ci(n,i)}function Ci(n,e){n.lanes|=e;var t=n.alternate;for(t!==null&&(t.lanes|=e),t=n,n=n.return;n!==null;)n.childLanes|=e,t=n.alternate,t!==null&&(t.childLanes|=e),t=n,n=n.return;return t.tag===3?t.stateNode:null}var Vi=!1;function xh(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function G0(n,e){n=n.updateQueue,e.updateQueue===n&&(e.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function Ei(n,e){return{eventTime:n,lane:e,tag:0,payload:null,callback:null,next:null}}function Qi(n,e,t){var i=n.updateQueue;if(i===null)return null;if(i=i.shared,et&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ci(n,t)}return r=i.interleaved,r===null?(e.next=e,vh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ci(n,t)}function Ka(n,e,t){if(e=e.updateQueue,e!==null&&(e=e.shared,(t&4194240)!==0)){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,rh(n,t)}}function $f(n,e){var t=n.updateQueue,i=n.alternate;if(i!==null&&(i=i.updateQueue,t===i)){var r=null,s=null;if(t=t.firstBaseUpdate,t!==null){do{var o={eventTime:t.eventTime,lane:t.lane,tag:t.tag,payload:t.payload,callback:t.callback,next:null};s===null?r=s=o:s=s.next=o,t=t.next}while(t!==null);s===null?r=s=e:s=s.next=e}else r=s=e;t={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},n.updateQueue=t;return}n=t.lastBaseUpdate,n===null?t.firstBaseUpdate=e:n.next=e,t.lastBaseUpdate=e}function El(n,e,t,i){var r=n.updateQueue;Vi=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var d=n.alternate;d!==null&&(d=d.updateQueue,a=d.lastBaseUpdate,a!==o&&(a===null?d.firstBaseUpdate=c:a.next=c,d.lastBaseUpdate=l))}if(s!==null){var h=r.baseState;o=0,d=c=l=null,a=s;do{var f=a.lane,p=a.eventTime;if((i&f)===f){d!==null&&(d=d.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=n,y=a;switch(f=e,p=t,y.tag){case 1:if(v=y.payload,typeof v=="function"){h=v.call(p,h,f);break e}h=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=y.payload,f=typeof v=="function"?v.call(p,h,f):v,f==null)break e;h=Et({},h,f);break e;case 2:Vi=!0}}a.callback!==null&&a.lane!==0&&(n.flags|=64,f=r.effects,f===null?r.effects=[a]:f.push(a))}else p={eventTime:p,lane:f,tag:a.tag,payload:a.payload,callback:a.callback,next:null},d===null?(c=d=p,l=h):d=d.next=p,o|=f;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;f=a,a=f.next,f.next=null,r.lastBaseUpdate=f,r.shared.pending=null}}while(!0);if(d===null&&(l=h),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=d,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Ur|=o,n.lanes=o,n.memoizedState=h}}function Kf(n,e,t){if(n=e.effects,e.effects=null,n!==null)for(e=0;e<n.length;e++){var i=n[e],r=i.callback;if(r!==null){if(i.callback=null,i=t,typeof r!="function")throw Error(re(191,r));r.call(i)}}}var Ko={},oi=cr(Ko),Fo=cr(Ko),ko=cr(Ko);function Ar(n){if(n===Ko)throw Error(re(174));return n}function yh(n,e){switch(ft(ko,e),ft(Fo,n),ft(oi,Ko),n=e.nodeType,n){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Mu(null,"");break;default:n=n===8?e.parentNode:e,e=n.namespaceURI||null,n=n.tagName,e=Mu(e,n)}xt(oi),ft(oi,e)}function Ls(){xt(oi),xt(Fo),xt(ko)}function W0(n){Ar(ko.current);var e=Ar(oi.current),t=Mu(e,n.type);e!==t&&(ft(Fo,n),ft(oi,t))}function Sh(n){Fo.current===n&&(xt(oi),xt(Fo))}var Mt=cr(0);function Tl(n){for(var e=n;e!==null;){if(e.tag===13){var t=e.memoizedState;if(t!==null&&(t=t.dehydrated,t===null||t.data==="$?"||t.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Ec=[];function Mh(){for(var n=0;n<Ec.length;n++)Ec[n]._workInProgressVersionPrimary=null;Ec.length=0}var Za=Li.ReactCurrentDispatcher,Tc=Li.ReactCurrentBatchConfig,Nr=0,wt=null,Lt=null,kt=null,Al=!1,Mo=!1,Oo=0,Sx=0;function jt(){throw Error(re(321))}function wh(n,e){if(e===null)return!1;for(var t=0;t<e.length&&t<n.length;t++)if(!Qn(n[t],e[t]))return!1;return!0}function Eh(n,e,t,i,r,s){if(Nr=s,wt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Za.current=n===null||n.memoizedState===null?Tx:Ax,n=t(i,r),Mo){s=0;do{if(Mo=!1,Oo=0,25<=s)throw Error(re(301));s+=1,kt=Lt=null,e.updateQueue=null,Za.current=bx,n=t(i,r)}while(Mo)}if(Za.current=bl,e=Lt!==null&&Lt.next!==null,Nr=0,kt=Lt=wt=null,Al=!1,e)throw Error(re(300));return n}function Th(){var n=Oo!==0;return Oo=0,n}function ti(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return kt===null?wt.memoizedState=kt=n:kt=kt.next=n,kt}function Fn(){if(Lt===null){var n=wt.alternate;n=n!==null?n.memoizedState:null}else n=Lt.next;var e=kt===null?wt.memoizedState:kt.next;if(e!==null)kt=e,Lt=n;else{if(n===null)throw Error(re(310));Lt=n,n={memoizedState:Lt.memoizedState,baseState:Lt.baseState,baseQueue:Lt.baseQueue,queue:Lt.queue,next:null},kt===null?wt.memoizedState=kt=n:kt=kt.next=n}return kt}function Bo(n,e){return typeof e=="function"?e(n):e}function Ac(n){var e=Fn(),t=e.queue;if(t===null)throw Error(re(311));t.lastRenderedReducer=n;var i=Lt,r=i.baseQueue,s=t.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,t.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var d=c.lane;if((Nr&d)===d)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:n(i,c.action);else{var h={lane:d,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=h,o=i):l=l.next=h,wt.lanes|=d,Ur|=d}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,Qn(i,e.memoizedState)||(pn=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,t.lastRenderedState=i}if(n=t.interleaved,n!==null){r=n;do s=r.lane,wt.lanes|=s,Ur|=s,r=r.next;while(r!==n)}else r===null&&(t.lanes=0);return[e.memoizedState,t.dispatch]}function bc(n){var e=Fn(),t=e.queue;if(t===null)throw Error(re(311));t.lastRenderedReducer=n;var i=t.dispatch,r=t.pending,s=e.memoizedState;if(r!==null){t.pending=null;var o=r=r.next;do s=n(s,o.action),o=o.next;while(o!==r);Qn(s,e.memoizedState)||(pn=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),t.lastRenderedState=s}return[s,i]}function X0(){}function j0(n,e){var t=wt,i=Fn(),r=e(),s=!Qn(i.memoizedState,r);if(s&&(i.memoizedState=r,pn=!0),i=i.queue,Ah($0.bind(null,t,i,n),[n]),i.getSnapshot!==e||s||kt!==null&&kt.memoizedState.tag&1){if(t.flags|=2048,Ho(9,q0.bind(null,t,i,r,e),void 0,null),Ot===null)throw Error(re(349));Nr&30||Y0(t,e,r)}return r}function Y0(n,e,t){n.flags|=16384,n={getSnapshot:e,value:t},e=wt.updateQueue,e===null?(e={lastEffect:null,stores:null},wt.updateQueue=e,e.stores=[n]):(t=e.stores,t===null?e.stores=[n]:t.push(n))}function q0(n,e,t,i){e.value=t,e.getSnapshot=i,K0(e)&&Z0(n)}function $0(n,e,t){return t(function(){K0(e)&&Z0(n)})}function K0(n){var e=n.getSnapshot;n=n.value;try{var t=e();return!Qn(n,t)}catch{return!0}}function Z0(n){var e=Ci(n,1);e!==null&&Kn(e,n,1,-1)}function Zf(n){var e=ti();return typeof n=="function"&&(n=n()),e.memoizedState=e.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Bo,lastRenderedState:n},e.queue=n,n=n.dispatch=Ex.bind(null,wt,n),[e.memoizedState,n]}function Ho(n,e,t,i){return n={tag:n,create:e,destroy:t,deps:i,next:null},e=wt.updateQueue,e===null?(e={lastEffect:null,stores:null},wt.updateQueue=e,e.lastEffect=n.next=n):(t=e.lastEffect,t===null?e.lastEffect=n.next=n:(i=t.next,t.next=n,n.next=i,e.lastEffect=n)),n}function Q0(){return Fn().memoizedState}function Qa(n,e,t,i){var r=ti();wt.flags|=n,r.memoizedState=Ho(1|e,t,void 0,i===void 0?null:i)}function Xl(n,e,t,i){var r=Fn();i=i===void 0?null:i;var s=void 0;if(Lt!==null){var o=Lt.memoizedState;if(s=o.destroy,i!==null&&wh(i,o.deps)){r.memoizedState=Ho(e,t,s,i);return}}wt.flags|=n,r.memoizedState=Ho(1|e,t,s,i)}function Qf(n,e){return Qa(8390656,8,n,e)}function Ah(n,e){return Xl(2048,8,n,e)}function J0(n,e){return Xl(4,2,n,e)}function eg(n,e){return Xl(4,4,n,e)}function tg(n,e){if(typeof e=="function")return n=n(),e(n),function(){e(null)};if(e!=null)return n=n(),e.current=n,function(){e.current=null}}function ng(n,e,t){return t=t!=null?t.concat([n]):null,Xl(4,4,tg.bind(null,e,n),t)}function bh(){}function ig(n,e){var t=Fn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&wh(e,i[1])?i[0]:(t.memoizedState=[n,e],n)}function rg(n,e){var t=Fn();e=e===void 0?null:e;var i=t.memoizedState;return i!==null&&e!==null&&wh(e,i[1])?i[0]:(n=n(),t.memoizedState=[n,e],n)}function sg(n,e,t){return Nr&21?(Qn(t,e)||(t=u0(),wt.lanes|=t,Ur|=t,n.baseState=!0),e):(n.baseState&&(n.baseState=!1,pn=!0),n.memoizedState=t)}function Mx(n,e){var t=lt;lt=t!==0&&4>t?t:4,n(!0);var i=Tc.transition;Tc.transition={};try{n(!1),e()}finally{lt=t,Tc.transition=i}}function og(){return Fn().memoizedState}function wx(n,e,t){var i=er(n);if(t={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null},ag(n))lg(e,t);else if(t=V0(n,e,t,i),t!==null){var r=rn();Kn(t,n,i,r),cg(t,e,i)}}function Ex(n,e,t){var i=er(n),r={lane:i,action:t,hasEagerState:!1,eagerState:null,next:null};if(ag(n))lg(e,r);else{var s=n.alternate;if(n.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,t);if(r.hasEagerState=!0,r.eagerState=a,Qn(a,o)){var l=e.interleaved;l===null?(r.next=r,vh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}t=V0(n,e,r,i),t!==null&&(r=rn(),Kn(t,n,i,r),cg(t,e,i))}}function ag(n){var e=n.alternate;return n===wt||e!==null&&e===wt}function lg(n,e){Mo=Al=!0;var t=n.pending;t===null?e.next=e:(e.next=t.next,t.next=e),n.pending=e}function cg(n,e,t){if(t&4194240){var i=e.lanes;i&=n.pendingLanes,t|=i,e.lanes=t,rh(n,t)}}var bl={readContext:zn,useCallback:jt,useContext:jt,useEffect:jt,useImperativeHandle:jt,useInsertionEffect:jt,useLayoutEffect:jt,useMemo:jt,useReducer:jt,useRef:jt,useState:jt,useDebugValue:jt,useDeferredValue:jt,useTransition:jt,useMutableSource:jt,useSyncExternalStore:jt,useId:jt,unstable_isNewReconciler:!1},Tx={readContext:zn,useCallback:function(n,e){return ti().memoizedState=[n,e===void 0?null:e],n},useContext:zn,useEffect:Qf,useImperativeHandle:function(n,e,t){return t=t!=null?t.concat([n]):null,Qa(4194308,4,tg.bind(null,e,n),t)},useLayoutEffect:function(n,e){return Qa(4194308,4,n,e)},useInsertionEffect:function(n,e){return Qa(4,2,n,e)},useMemo:function(n,e){var t=ti();return e=e===void 0?null:e,n=n(),t.memoizedState=[n,e],n},useReducer:function(n,e,t){var i=ti();return e=t!==void 0?t(e):e,i.memoizedState=i.baseState=e,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:e},i.queue=n,n=n.dispatch=wx.bind(null,wt,n),[i.memoizedState,n]},useRef:function(n){var e=ti();return n={current:n},e.memoizedState=n},useState:Zf,useDebugValue:bh,useDeferredValue:function(n){return ti().memoizedState=n},useTransition:function(){var n=Zf(!1),e=n[0];return n=Mx.bind(null,n[1]),ti().memoizedState=n,[e,n]},useMutableSource:function(){},useSyncExternalStore:function(n,e,t){var i=wt,r=ti();if(St){if(t===void 0)throw Error(re(407));t=t()}else{if(t=e(),Ot===null)throw Error(re(349));Nr&30||Y0(i,e,t)}r.memoizedState=t;var s={value:t,getSnapshot:e};return r.queue=s,Qf($0.bind(null,i,s,n),[n]),i.flags|=2048,Ho(9,q0.bind(null,i,s,t,e),void 0,null),t},useId:function(){var n=ti(),e=Ot.identifierPrefix;if(St){var t=Si,i=yi;t=(i&~(1<<32-$n(i)-1)).toString(32)+t,e=":"+e+"R"+t,t=Oo++,0<t&&(e+="H"+t.toString(32)),e+=":"}else t=Sx++,e=":"+e+"r"+t.toString(32)+":";return n.memoizedState=e},unstable_isNewReconciler:!1},Ax={readContext:zn,useCallback:ig,useContext:zn,useEffect:Ah,useImperativeHandle:ng,useInsertionEffect:J0,useLayoutEffect:eg,useMemo:rg,useReducer:Ac,useRef:Q0,useState:function(){return Ac(Bo)},useDebugValue:bh,useDeferredValue:function(n){var e=Fn();return sg(e,Lt.memoizedState,n)},useTransition:function(){var n=Ac(Bo)[0],e=Fn().memoizedState;return[n,e]},useMutableSource:X0,useSyncExternalStore:j0,useId:og,unstable_isNewReconciler:!1},bx={readContext:zn,useCallback:ig,useContext:zn,useEffect:Ah,useImperativeHandle:ng,useInsertionEffect:J0,useLayoutEffect:eg,useMemo:rg,useReducer:bc,useRef:Q0,useState:function(){return bc(Bo)},useDebugValue:bh,useDeferredValue:function(n){var e=Fn();return Lt===null?e.memoizedState=n:sg(e,Lt.memoizedState,n)},useTransition:function(){var n=bc(Bo)[0],e=Fn().memoizedState;return[n,e]},useMutableSource:X0,useSyncExternalStore:j0,useId:og,unstable_isNewReconciler:!1};function Wn(n,e){if(n&&n.defaultProps){e=Et({},e),n=n.defaultProps;for(var t in n)e[t]===void 0&&(e[t]=n[t]);return e}return e}function Gu(n,e,t,i){e=n.memoizedState,t=t(i,e),t=t==null?e:Et({},e,t),n.memoizedState=t,n.lanes===0&&(n.updateQueue.baseState=t)}var jl={isMounted:function(n){return(n=n._reactInternals)?Br(n)===n:!1},enqueueSetState:function(n,e,t){n=n._reactInternals;var i=rn(),r=er(n),s=Ei(i,r);s.payload=e,t!=null&&(s.callback=t),e=Qi(n,s,r),e!==null&&(Kn(e,n,r,i),Ka(e,n,r))},enqueueReplaceState:function(n,e,t){n=n._reactInternals;var i=rn(),r=er(n),s=Ei(i,r);s.tag=1,s.payload=e,t!=null&&(s.callback=t),e=Qi(n,s,r),e!==null&&(Kn(e,n,r,i),Ka(e,n,r))},enqueueForceUpdate:function(n,e){n=n._reactInternals;var t=rn(),i=er(n),r=Ei(t,i);r.tag=2,e!=null&&(r.callback=e),e=Qi(n,r,i),e!==null&&(Kn(e,n,i,t),Ka(e,n,i))}};function Jf(n,e,t,i,r,s,o){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Io(t,i)||!Io(r,s):!0}function ug(n,e,t){var i=!1,r=sr,s=e.contextType;return typeof s=="object"&&s!==null?s=zn(s):(r=gn(e)?Dr:Qt.current,i=e.contextTypes,s=(i=i!=null)?Cs(n,r):sr),e=new e(t,s),n.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=jl,n.stateNode=e,e._reactInternals=n,i&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=s),e}function ep(n,e,t,i){n=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(t,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(t,i),e.state!==n&&jl.enqueueReplaceState(e,e.state,null)}function Wu(n,e,t,i){var r=n.stateNode;r.props=t,r.state=n.memoizedState,r.refs={},xh(n);var s=e.contextType;typeof s=="object"&&s!==null?r.context=zn(s):(s=gn(e)?Dr:Qt.current,r.context=Cs(n,s)),r.state=n.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Gu(n,e,s,t),r.state=n.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&jl.enqueueReplaceState(r,r.state,null),El(n,t,r,i),r.state=n.memoizedState),typeof r.componentDidMount=="function"&&(n.flags|=4194308)}function Ds(n,e){try{var t="",i=e;do t+=tv(i),i=i.return;while(i);var r=t}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:n,source:e,stack:r,digest:null}}function Cc(n,e,t){return{value:n,source:null,stack:t??null,digest:e??null}}function Xu(n,e){try{console.error(e.value)}catch(t){setTimeout(function(){throw t})}}var Cx=typeof WeakMap=="function"?WeakMap:Map;function dg(n,e,t){t=Ei(-1,t),t.tag=3,t.payload={element:null};var i=e.value;return t.callback=function(){Rl||(Rl=!0,td=i),Xu(n,e)},t}function hg(n,e,t){t=Ei(-1,t),t.tag=3;var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;t.payload=function(){return i(r)},t.callback=function(){Xu(n,e)}}var s=n.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(t.callback=function(){Xu(n,e),typeof i!="function"&&(Ji===null?Ji=new Set([this]):Ji.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),t}function tp(n,e,t){var i=n.pingCache;if(i===null){i=n.pingCache=new Cx;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(t)||(r.add(t),n=Vx.bind(null,n,e,t),e.then(n,n))}function np(n){do{var e;if((e=n.tag===13)&&(e=n.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return n;n=n.return}while(n!==null);return null}function ip(n,e,t,i,r){return n.mode&1?(n.flags|=65536,n.lanes=r,n):(n===e?n.flags|=65536:(n.flags|=128,t.flags|=131072,t.flags&=-52805,t.tag===1&&(t.alternate===null?t.tag=17:(e=Ei(-1,1),e.tag=2,Qi(t,e,1))),t.lanes|=1),n)}var Rx=Li.ReactCurrentOwner,pn=!1;function tn(n,e,t,i){e.child=n===null?H0(e,null,t,i):Ps(e,n.child,t,i)}function rp(n,e,t,i,r){t=t.render;var s=e.ref;return Ms(e,r),i=Eh(n,e,t,i,s,r),t=Th(),n!==null&&!pn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ri(n,e,r)):(St&&t&&hh(e),e.flags|=1,tn(n,e,i,r),e.child)}function sp(n,e,t,i,r){if(n===null){var s=t.type;return typeof s=="function"&&!Uh(s)&&s.defaultProps===void 0&&t.compare===null&&t.defaultProps===void 0?(e.tag=15,e.type=s,fg(n,e,s,i,r)):(n=nl(t.type,null,i,e,e.mode,r),n.ref=e.ref,n.return=e,e.child=n)}if(s=n.child,!(n.lanes&r)){var o=s.memoizedProps;if(t=t.compare,t=t!==null?t:Io,t(o,i)&&n.ref===e.ref)return Ri(n,e,r)}return e.flags|=1,n=tr(s,i),n.ref=e.ref,n.return=e,e.child=n}function fg(n,e,t,i,r){if(n!==null){var s=n.memoizedProps;if(Io(s,i)&&n.ref===e.ref)if(pn=!1,e.pendingProps=i=s,(n.lanes&r)!==0)n.flags&131072&&(pn=!0);else return e.lanes=n.lanes,Ri(n,e,r)}return ju(n,e,t,i,r)}function pg(n,e,t){var i=e.pendingProps,r=i.children,s=n!==null?n.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ft(gs,Sn),Sn|=t;else{if(!(t&1073741824))return n=s!==null?s.baseLanes|t:t,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:n,cachePool:null,transitions:null},e.updateQueue=null,ft(gs,Sn),Sn|=n,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:t,ft(gs,Sn),Sn|=i}else s!==null?(i=s.baseLanes|t,e.memoizedState=null):i=t,ft(gs,Sn),Sn|=i;return tn(n,e,r,t),e.child}function mg(n,e){var t=e.ref;(n===null&&t!==null||n!==null&&n.ref!==t)&&(e.flags|=512,e.flags|=2097152)}function ju(n,e,t,i,r){var s=gn(t)?Dr:Qt.current;return s=Cs(e,s),Ms(e,r),t=Eh(n,e,t,i,s,r),i=Th(),n!==null&&!pn?(e.updateQueue=n.updateQueue,e.flags&=-2053,n.lanes&=~r,Ri(n,e,r)):(St&&i&&hh(e),e.flags|=1,tn(n,e,t,r),e.child)}function op(n,e,t,i,r){if(gn(t)){var s=!0;xl(e)}else s=!1;if(Ms(e,r),e.stateNode===null)Ja(n,e),ug(e,t,i),Wu(e,t,i,r),i=!0;else if(n===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=t.contextType;typeof c=="object"&&c!==null?c=zn(c):(c=gn(t)?Dr:Qt.current,c=Cs(e,c));var d=t.getDerivedStateFromProps,h=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&ep(e,o,i,c),Vi=!1;var f=e.memoizedState;o.state=f,El(e,i,o,r),l=e.memoizedState,a!==i||f!==l||mn.current||Vi?(typeof d=="function"&&(Gu(e,t,d,i),l=e.memoizedState),(a=Vi||Jf(e,t,a,i,f,l,c))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,G0(n,e),a=e.memoizedProps,c=e.type===e.elementType?a:Wn(e.type,a),o.props=c,h=e.pendingProps,f=o.context,l=t.contextType,typeof l=="object"&&l!==null?l=zn(l):(l=gn(t)?Dr:Qt.current,l=Cs(e,l));var p=t.getDerivedStateFromProps;(d=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==h||f!==l)&&ep(e,o,i,l),Vi=!1,f=e.memoizedState,o.state=f,El(e,i,o,r);var v=e.memoizedState;a!==h||f!==v||mn.current||Vi?(typeof p=="function"&&(Gu(e,t,p,i),v=e.memoizedState),(c=Vi||Jf(e,t,c,i,f,v,l)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&f===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&f===n.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===n.memoizedProps&&f===n.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===n.memoizedProps&&f===n.memoizedState||(e.flags|=1024),i=!1)}return Yu(n,e,t,i,s,r)}function Yu(n,e,t,i,r,s){mg(n,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&Xf(e,t,!1),Ri(n,e,s);i=e.stateNode,Rx.current=e;var a=o&&typeof t.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,n!==null&&o?(e.child=Ps(e,n.child,null,s),e.child=Ps(e,null,a,s)):tn(n,e,a,s),e.memoizedState=i.state,r&&Xf(e,t,!0),e.child}function gg(n){var e=n.stateNode;e.pendingContext?Wf(n,e.pendingContext,e.pendingContext!==e.context):e.context&&Wf(n,e.context,!1),yh(n,e.containerInfo)}function ap(n,e,t,i,r){return Rs(),ph(r),e.flags|=256,tn(n,e,t,i),e.child}var qu={dehydrated:null,treeContext:null,retryLane:0};function $u(n){return{baseLanes:n,cachePool:null,transitions:null}}function _g(n,e,t){var i=e.pendingProps,r=Mt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=n!==null&&n.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(n===null||n.memoizedState!==null)&&(r|=1),ft(Mt,r&1),n===null)return Hu(e),n=e.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?(e.mode&1?n.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,n=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=$l(o,i,0,null),n=Lr(n,i,t,null),s.return=e,n.return=e,s.sibling=n,e.child=s,e.child.memoizedState=$u(t),e.memoizedState=qu,n):Ch(e,o));if(r=n.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return Px(n,e,o,i,a,r,t);if(s){s=i.fallback,o=e.mode,r=n.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=tr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=tr(a,s):(s=Lr(s,o,t,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=n.child.memoizedState,o=o===null?$u(t):{baseLanes:o.baseLanes|t,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=n.childLanes&~t,e.memoizedState=qu,i}return s=n.child,n=s.sibling,i=tr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=t),i.return=e,i.sibling=null,n!==null&&(t=e.deletions,t===null?(e.deletions=[n],e.flags|=16):t.push(n)),e.child=i,e.memoizedState=null,i}function Ch(n,e){return e=$l({mode:"visible",children:e},n.mode,0,null),e.return=n,n.child=e}function _a(n,e,t,i){return i!==null&&ph(i),Ps(e,n.child,null,t),n=Ch(e,e.pendingProps.children),n.flags|=2,e.memoizedState=null,n}function Px(n,e,t,i,r,s,o){if(t)return e.flags&256?(e.flags&=-257,i=Cc(Error(re(422))),_a(n,e,o,i)):e.memoizedState!==null?(e.child=n.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=$l({mode:"visible",children:i.children},r,0,null),s=Lr(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ps(e,n.child,null,o),e.child.memoizedState=$u(o),e.memoizedState=qu,s);if(!(e.mode&1))return _a(n,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(re(419)),i=Cc(s,i,void 0),_a(n,e,o,i)}if(a=(o&n.childLanes)!==0,pn||a){if(i=Ot,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ci(n,r),Kn(i,n,r,-1))}return Nh(),i=Cc(Error(re(421))),_a(n,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=n.child,e=Gx.bind(null,n),r._reactRetry=e,null):(n=s.treeContext,wn=Zi(r.nextSibling),En=e,St=!0,jn=null,n!==null&&(Ln[Dn++]=yi,Ln[Dn++]=Si,Ln[Dn++]=Ir,yi=n.id,Si=n.overflow,Ir=e),e=Ch(e,i.children),e.flags|=4096,e)}function lp(n,e,t){n.lanes|=e;var i=n.alternate;i!==null&&(i.lanes|=e),Vu(n.return,e,t)}function Rc(n,e,t,i,r){var s=n.memoizedState;s===null?n.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:t,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=t,s.tailMode=r)}function vg(n,e,t){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(tn(n,e,i.children,t),i=Mt.current,i&2)i=i&1|2,e.flags|=128;else{if(n!==null&&n.flags&128)e:for(n=e.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&lp(n,t,e);else if(n.tag===19)lp(n,t,e);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break e;for(;n.sibling===null;){if(n.return===null||n.return===e)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}i&=1}if(ft(Mt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(t=e.child,r=null;t!==null;)n=t.alternate,n!==null&&Tl(n)===null&&(r=t),t=t.sibling;t=r,t===null?(r=e.child,e.child=null):(r=t.sibling,t.sibling=null),Rc(e,!1,r,t,s);break;case"backwards":for(t=null,r=e.child,e.child=null;r!==null;){if(n=r.alternate,n!==null&&Tl(n)===null){e.child=r;break}n=r.sibling,r.sibling=t,t=r,r=n}Rc(e,!0,t,null,s);break;case"together":Rc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Ja(n,e){!(e.mode&1)&&n!==null&&(n.alternate=null,e.alternate=null,e.flags|=2)}function Ri(n,e,t){if(n!==null&&(e.dependencies=n.dependencies),Ur|=e.lanes,!(t&e.childLanes))return null;if(n!==null&&e.child!==n.child)throw Error(re(153));if(e.child!==null){for(n=e.child,t=tr(n,n.pendingProps),e.child=t,t.return=e;n.sibling!==null;)n=n.sibling,t=t.sibling=tr(n,n.pendingProps),t.return=e;t.sibling=null}return e.child}function Lx(n,e,t){switch(e.tag){case 3:gg(e),Rs();break;case 5:W0(e);break;case 1:gn(e.type)&&xl(e);break;case 4:yh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ft(Ml,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ft(Mt,Mt.current&1),e.flags|=128,null):t&e.child.childLanes?_g(n,e,t):(ft(Mt,Mt.current&1),n=Ri(n,e,t),n!==null?n.sibling:null);ft(Mt,Mt.current&1);break;case 19:if(i=(t&e.childLanes)!==0,n.flags&128){if(i)return vg(n,e,t);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ft(Mt,Mt.current),i)break;return null;case 22:case 23:return e.lanes=0,pg(n,e,t)}return Ri(n,e,t)}var xg,Ku,yg,Sg;xg=function(n,e){for(var t=e.child;t!==null;){if(t.tag===5||t.tag===6)n.appendChild(t.stateNode);else if(t.tag!==4&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return;t=t.return}t.sibling.return=t.return,t=t.sibling}};Ku=function(){};yg=function(n,e,t,i){var r=n.memoizedProps;if(r!==i){n=e.stateNode,Ar(oi.current);var s=null;switch(t){case"input":r=vu(n,r),i=vu(n,i),s=[];break;case"select":r=Et({},r,{value:void 0}),i=Et({},i,{value:void 0}),s=[];break;case"textarea":r=Su(n,r),i=Su(n,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(n.onclick=_l)}wu(t,i);var o;t=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(t||(t={}),t[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Ao.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(t||(t={}),t[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(t||(t={}),t[o]=l[o])}else t||(s||(s=[]),s.push(c,t)),t=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Ao.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&vt("scroll",n),s||a===l||(s=[])):(s=s||[]).push(c,l))}t&&(s=s||[]).push("style",t);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};Sg=function(n,e,t,i){t!==i&&(e.flags|=4)};function to(n,e){if(!St)switch(n.tailMode){case"hidden":e=n.tail;for(var t=null;e!==null;)e.alternate!==null&&(t=e),e=e.sibling;t===null?n.tail=null:t.sibling=null;break;case"collapsed":t=n.tail;for(var i=null;t!==null;)t.alternate!==null&&(i=t),t=t.sibling;i===null?e||n.tail===null?n.tail=null:n.tail.sibling=null:i.sibling=null}}function Yt(n){var e=n.alternate!==null&&n.alternate.child===n.child,t=0,i=0;if(e)for(var r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=n,r=r.sibling;else for(r=n.child;r!==null;)t|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=n,r=r.sibling;return n.subtreeFlags|=i,n.childLanes=t,e}function Dx(n,e,t){var i=e.pendingProps;switch(fh(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Yt(e),null;case 1:return gn(e.type)&&vl(),Yt(e),null;case 3:return i=e.stateNode,Ls(),xt(mn),xt(Qt),Mh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(n===null||n.child===null)&&(ma(e)?e.flags|=4:n===null||n.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,jn!==null&&(rd(jn),jn=null))),Ku(n,e),Yt(e),null;case 5:Sh(e);var r=Ar(ko.current);if(t=e.type,n!==null&&e.stateNode!=null)yg(n,e,t,i,r),n.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(re(166));return Yt(e),null}if(n=Ar(oi.current),ma(e)){i=e.stateNode,t=e.type;var s=e.memoizedProps;switch(i[ii]=e,i[zo]=s,n=(e.mode&1)!==0,t){case"dialog":vt("cancel",i),vt("close",i);break;case"iframe":case"object":case"embed":vt("load",i);break;case"video":case"audio":for(r=0;r<po.length;r++)vt(po[r],i);break;case"source":vt("error",i);break;case"img":case"image":case"link":vt("error",i),vt("load",i);break;case"details":vt("toggle",i);break;case"input":_f(i,s),vt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},vt("invalid",i);break;case"textarea":xf(i,s),vt("invalid",i)}wu(t,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&pa(i.textContent,a,n),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&pa(i.textContent,a,n),r=["children",""+a]):Ao.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&vt("scroll",i)}switch(t){case"input":oa(i),vf(i,s,!0);break;case"textarea":oa(i),yf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=_l)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=$m(t)),n==="http://www.w3.org/1999/xhtml"?t==="script"?(n=o.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof i.is=="string"?n=o.createElement(t,{is:i.is}):(n=o.createElement(t),t==="select"&&(o=n,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):n=o.createElementNS(n,t),n[ii]=e,n[zo]=i,xg(n,e,!1,!1),e.stateNode=n;e:{switch(o=Eu(t,i),t){case"dialog":vt("cancel",n),vt("close",n),r=i;break;case"iframe":case"object":case"embed":vt("load",n),r=i;break;case"video":case"audio":for(r=0;r<po.length;r++)vt(po[r],n);r=i;break;case"source":vt("error",n),r=i;break;case"img":case"image":case"link":vt("error",n),vt("load",n),r=i;break;case"details":vt("toggle",n),r=i;break;case"input":_f(n,i),r=vu(n,i),vt("invalid",n);break;case"option":r=i;break;case"select":n._wrapperState={wasMultiple:!!i.multiple},r=Et({},i,{value:void 0}),vt("invalid",n);break;case"textarea":xf(n,i),r=Su(n,i),vt("invalid",n);break;default:r=i}wu(t,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Qm(n,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Km(n,l)):s==="children"?typeof l=="string"?(t!=="textarea"||l!=="")&&bo(n,l):typeof l=="number"&&bo(n,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Ao.hasOwnProperty(s)?l!=null&&s==="onScroll"&&vt("scroll",n):l!=null&&Qd(n,s,l,o))}switch(t){case"input":oa(n),vf(n,i,!1);break;case"textarea":oa(n),yf(n);break;case"option":i.value!=null&&n.setAttribute("value",""+rr(i.value));break;case"select":n.multiple=!!i.multiple,s=i.value,s!=null?vs(n,!!i.multiple,s,!1):i.defaultValue!=null&&vs(n,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(n.onclick=_l)}switch(t){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Yt(e),null;case 6:if(n&&e.stateNode!=null)Sg(n,e,n.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(re(166));if(t=Ar(ko.current),Ar(oi.current),ma(e)){if(i=e.stateNode,t=e.memoizedProps,i[ii]=e,(s=i.nodeValue!==t)&&(n=En,n!==null))switch(n.tag){case 3:pa(i.nodeValue,t,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&pa(i.nodeValue,t,(n.mode&1)!==0)}s&&(e.flags|=4)}else i=(t.nodeType===9?t:t.ownerDocument).createTextNode(i),i[ii]=e,e.stateNode=i}return Yt(e),null;case 13:if(xt(Mt),i=e.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(St&&wn!==null&&e.mode&1&&!(e.flags&128))O0(),Rs(),e.flags|=98560,s=!1;else if(s=ma(e),i!==null&&i.dehydrated!==null){if(n===null){if(!s)throw Error(re(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(re(317));s[ii]=e}else Rs(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Yt(e),s=!1}else jn!==null&&(rd(jn),jn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=t,e):(i=i!==null,i!==(n!==null&&n.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(n===null||Mt.current&1?Dt===0&&(Dt=3):Nh())),e.updateQueue!==null&&(e.flags|=4),Yt(e),null);case 4:return Ls(),Ku(n,e),n===null&&No(e.stateNode.containerInfo),Yt(e),null;case 10:return _h(e.type._context),Yt(e),null;case 17:return gn(e.type)&&vl(),Yt(e),null;case 19:if(xt(Mt),s=e.memoizedState,s===null)return Yt(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)to(s,!1);else{if(Dt!==0||n!==null&&n.flags&128)for(n=e.child;n!==null;){if(o=Tl(n),o!==null){for(e.flags|=128,to(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=t,t=e.child;t!==null;)s=t,n=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=n,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,n=o.dependencies,s.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t=t.sibling;return ft(Mt,Mt.current&1|2),e.child}n=n.sibling}s.tail!==null&&bt()>Is&&(e.flags|=128,i=!0,to(s,!1),e.lanes=4194304)}else{if(!i)if(n=Tl(o),n!==null){if(e.flags|=128,i=!0,t=n.updateQueue,t!==null&&(e.updateQueue=t,e.flags|=4),to(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!St)return Yt(e),null}else 2*bt()-s.renderingStartTime>Is&&t!==1073741824&&(e.flags|=128,i=!0,to(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(t=s.last,t!==null?t.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=bt(),e.sibling=null,t=Mt.current,ft(Mt,i?t&1|2:t&1),e):(Yt(e),null);case 22:case 23:return Ih(),i=e.memoizedState!==null,n!==null&&n.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Sn&1073741824&&(Yt(e),e.subtreeFlags&6&&(e.flags|=8192)):Yt(e),null;case 24:return null;case 25:return null}throw Error(re(156,e.tag))}function Ix(n,e){switch(fh(e),e.tag){case 1:return gn(e.type)&&vl(),n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 3:return Ls(),xt(mn),xt(Qt),Mh(),n=e.flags,n&65536&&!(n&128)?(e.flags=n&-65537|128,e):null;case 5:return Sh(e),null;case 13:if(xt(Mt),n=e.memoizedState,n!==null&&n.dehydrated!==null){if(e.alternate===null)throw Error(re(340));Rs()}return n=e.flags,n&65536?(e.flags=n&-65537|128,e):null;case 19:return xt(Mt),null;case 4:return Ls(),null;case 10:return _h(e.type._context),null;case 22:case 23:return Ih(),null;case 24:return null;default:return null}}var va=!1,Kt=!1,Nx=typeof WeakSet=="function"?WeakSet:Set,xe=null;function ms(n,e){var t=n.ref;if(t!==null)if(typeof t=="function")try{t(null)}catch(i){At(n,e,i)}else t.current=null}function Zu(n,e,t){try{t()}catch(i){At(n,e,i)}}var cp=!1;function Ux(n,e){if(Nu=pl,n=A0(),dh(n)){if("selectionStart"in n)var t={start:n.selectionStart,end:n.selectionEnd};else e:{t=(t=n.ownerDocument)&&t.defaultView||window;var i=t.getSelection&&t.getSelection();if(i&&i.rangeCount!==0){t=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{t.nodeType,s.nodeType}catch{t=null;break e}var o=0,a=-1,l=-1,c=0,d=0,h=n,f=null;t:for(;;){for(var p;h!==t||r!==0&&h.nodeType!==3||(a=o+r),h!==s||i!==0&&h.nodeType!==3||(l=o+i),h.nodeType===3&&(o+=h.nodeValue.length),(p=h.firstChild)!==null;)f=h,h=p;for(;;){if(h===n)break t;if(f===t&&++c===r&&(a=o),f===s&&++d===i&&(l=o),(p=h.nextSibling)!==null)break;h=f,f=h.parentNode}h=p}t=a===-1||l===-1?null:{start:a,end:l}}else t=null}t=t||{start:0,end:0}}else t=null;for(Uu={focusedElem:n,selectionRange:t},pl=!1,xe=e;xe!==null;)if(e=xe,n=e.child,(e.subtreeFlags&1028)!==0&&n!==null)n.return=e,xe=n;else for(;xe!==null;){e=xe;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var y=v.memoizedProps,m=v.memoizedState,u=e.stateNode,g=u.getSnapshotBeforeUpdate(e.elementType===e.type?y:Wn(e.type,y),m);u.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var _=e.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(re(163))}}catch(x){At(e,e.return,x)}if(n=e.sibling,n!==null){n.return=e.return,xe=n;break}xe=e.return}return v=cp,cp=!1,v}function wo(n,e,t){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&n)===n){var s=r.destroy;r.destroy=void 0,s!==void 0&&Zu(e,t,s)}r=r.next}while(r!==i)}}function Yl(n,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var t=e=e.next;do{if((t.tag&n)===n){var i=t.create;t.destroy=i()}t=t.next}while(t!==e)}}function Qu(n){var e=n.ref;if(e!==null){var t=n.stateNode;switch(n.tag){case 5:n=t;break;default:n=t}typeof e=="function"?e(n):e.current=n}}function Mg(n){var e=n.alternate;e!==null&&(n.alternate=null,Mg(e)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(e=n.stateNode,e!==null&&(delete e[ii],delete e[zo],delete e[ku],delete e[_x],delete e[vx])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function wg(n){return n.tag===5||n.tag===3||n.tag===4}function up(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||wg(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Ju(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.nodeType===8?t.parentNode.insertBefore(n,e):t.insertBefore(n,e):(t.nodeType===8?(e=t.parentNode,e.insertBefore(n,t)):(e=t,e.appendChild(n)),t=t._reactRootContainer,t!=null||e.onclick!==null||(e.onclick=_l));else if(i!==4&&(n=n.child,n!==null))for(Ju(n,e,t),n=n.sibling;n!==null;)Ju(n,e,t),n=n.sibling}function ed(n,e,t){var i=n.tag;if(i===5||i===6)n=n.stateNode,e?t.insertBefore(n,e):t.appendChild(n);else if(i!==4&&(n=n.child,n!==null))for(ed(n,e,t),n=n.sibling;n!==null;)ed(n,e,t),n=n.sibling}var Ht=null,Xn=!1;function Ni(n,e,t){for(t=t.child;t!==null;)Eg(n,e,t),t=t.sibling}function Eg(n,e,t){if(si&&typeof si.onCommitFiberUnmount=="function")try{si.onCommitFiberUnmount(Ol,t)}catch{}switch(t.tag){case 5:Kt||ms(t,e);case 6:var i=Ht,r=Xn;Ht=null,Ni(n,e,t),Ht=i,Xn=r,Ht!==null&&(Xn?(n=Ht,t=t.stateNode,n.nodeType===8?n.parentNode.removeChild(t):n.removeChild(t)):Ht.removeChild(t.stateNode));break;case 18:Ht!==null&&(Xn?(n=Ht,t=t.stateNode,n.nodeType===8?Mc(n.parentNode,t):n.nodeType===1&&Mc(n,t),Lo(n)):Mc(Ht,t.stateNode));break;case 4:i=Ht,r=Xn,Ht=t.stateNode.containerInfo,Xn=!0,Ni(n,e,t),Ht=i,Xn=r;break;case 0:case 11:case 14:case 15:if(!Kt&&(i=t.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&Zu(t,e,o),r=r.next}while(r!==i)}Ni(n,e,t);break;case 1:if(!Kt&&(ms(t,e),i=t.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=t.memoizedProps,i.state=t.memoizedState,i.componentWillUnmount()}catch(a){At(t,e,a)}Ni(n,e,t);break;case 21:Ni(n,e,t);break;case 22:t.mode&1?(Kt=(i=Kt)||t.memoizedState!==null,Ni(n,e,t),Kt=i):Ni(n,e,t);break;default:Ni(n,e,t)}}function dp(n){var e=n.updateQueue;if(e!==null){n.updateQueue=null;var t=n.stateNode;t===null&&(t=n.stateNode=new Nx),e.forEach(function(i){var r=Wx.bind(null,n,i);t.has(i)||(t.add(i),i.then(r,r))})}}function Bn(n,e){var t=e.deletions;if(t!==null)for(var i=0;i<t.length;i++){var r=t[i];try{var s=n,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:Ht=a.stateNode,Xn=!1;break e;case 3:Ht=a.stateNode.containerInfo,Xn=!0;break e;case 4:Ht=a.stateNode.containerInfo,Xn=!0;break e}a=a.return}if(Ht===null)throw Error(re(160));Eg(s,o,r),Ht=null,Xn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){At(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)Tg(e,n),e=e.sibling}function Tg(n,e){var t=n.alternate,i=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(Bn(e,n),ei(n),i&4){try{wo(3,n,n.return),Yl(3,n)}catch(y){At(n,n.return,y)}try{wo(5,n,n.return)}catch(y){At(n,n.return,y)}}break;case 1:Bn(e,n),ei(n),i&512&&t!==null&&ms(t,t.return);break;case 5:if(Bn(e,n),ei(n),i&512&&t!==null&&ms(t,t.return),n.flags&32){var r=n.stateNode;try{bo(r,"")}catch(y){At(n,n.return,y)}}if(i&4&&(r=n.stateNode,r!=null)){var s=n.memoizedProps,o=t!==null?t.memoizedProps:s,a=n.type,l=n.updateQueue;if(n.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&Ym(r,s),Eu(a,o);var c=Eu(a,s);for(o=0;o<l.length;o+=2){var d=l[o],h=l[o+1];d==="style"?Qm(r,h):d==="dangerouslySetInnerHTML"?Km(r,h):d==="children"?bo(r,h):Qd(r,d,h,c)}switch(a){case"input":xu(r,s);break;case"textarea":qm(r,s);break;case"select":var f=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?vs(r,!!s.multiple,p,!1):f!==!!s.multiple&&(s.defaultValue!=null?vs(r,!!s.multiple,s.defaultValue,!0):vs(r,!!s.multiple,s.multiple?[]:"",!1))}r[zo]=s}catch(y){At(n,n.return,y)}}break;case 6:if(Bn(e,n),ei(n),i&4){if(n.stateNode===null)throw Error(re(162));r=n.stateNode,s=n.memoizedProps;try{r.nodeValue=s}catch(y){At(n,n.return,y)}}break;case 3:if(Bn(e,n),ei(n),i&4&&t!==null&&t.memoizedState.isDehydrated)try{Lo(e.containerInfo)}catch(y){At(n,n.return,y)}break;case 4:Bn(e,n),ei(n);break;case 13:Bn(e,n),ei(n),r=n.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Lh=bt())),i&4&&dp(n);break;case 22:if(d=t!==null&&t.memoizedState!==null,n.mode&1?(Kt=(c=Kt)||d,Bn(e,n),Kt=c):Bn(e,n),ei(n),i&8192){if(c=n.memoizedState!==null,(n.stateNode.isHidden=c)&&!d&&n.mode&1)for(xe=n,d=n.child;d!==null;){for(h=xe=d;xe!==null;){switch(f=xe,p=f.child,f.tag){case 0:case 11:case 14:case 15:wo(4,f,f.return);break;case 1:ms(f,f.return);var v=f.stateNode;if(typeof v.componentWillUnmount=="function"){i=f,t=f.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(y){At(i,t,y)}}break;case 5:ms(f,f.return);break;case 22:if(f.memoizedState!==null){fp(h);continue}}p!==null?(p.return=f,xe=p):fp(h)}d=d.sibling}e:for(d=null,h=n;;){if(h.tag===5){if(d===null){d=h;try{r=h.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=h.stateNode,l=h.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=Zm("display",o))}catch(y){At(n,n.return,y)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=c?"":h.memoizedProps}catch(y){At(n,n.return,y)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===n)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===n)break e;for(;h.sibling===null;){if(h.return===null||h.return===n)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:Bn(e,n),ei(n),i&4&&dp(n);break;case 21:break;default:Bn(e,n),ei(n)}}function ei(n){var e=n.flags;if(e&2){try{e:{for(var t=n.return;t!==null;){if(wg(t)){var i=t;break e}t=t.return}throw Error(re(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(bo(r,""),i.flags&=-33);var s=up(n);ed(n,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=up(n);Ju(n,a,o);break;default:throw Error(re(161))}}catch(l){At(n,n.return,l)}n.flags&=-3}e&4096&&(n.flags&=-4097)}function zx(n,e,t){xe=n,Ag(n)}function Ag(n,e,t){for(var i=(n.mode&1)!==0;xe!==null;){var r=xe,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||va;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||Kt;a=va;var c=Kt;if(va=o,(Kt=l)&&!c)for(xe=r;xe!==null;)o=xe,l=o.child,o.tag===22&&o.memoizedState!==null?pp(r):l!==null?(l.return=o,xe=l):pp(r);for(;s!==null;)xe=s,Ag(s),s=s.sibling;xe=r,va=a,Kt=c}hp(n)}else r.subtreeFlags&8772&&s!==null?(s.return=r,xe=s):hp(n)}}function hp(n){for(;xe!==null;){var e=xe;if(e.flags&8772){var t=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Kt||Yl(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Kt)if(t===null)i.componentDidMount();else{var r=e.elementType===e.type?t.memoizedProps:Wn(e.type,t.memoizedProps);i.componentDidUpdate(r,t.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Kf(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(t=null,e.child!==null)switch(e.child.tag){case 5:t=e.child.stateNode;break;case 1:t=e.child.stateNode}Kf(e,o,t)}break;case 5:var a=e.stateNode;if(t===null&&e.flags&4){t=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&t.focus();break;case"img":l.src&&(t.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var d=c.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&Lo(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(re(163))}Kt||e.flags&512&&Qu(e)}catch(f){At(e,e.return,f)}}if(e===n){xe=null;break}if(t=e.sibling,t!==null){t.return=e.return,xe=t;break}xe=e.return}}function fp(n){for(;xe!==null;){var e=xe;if(e===n){xe=null;break}var t=e.sibling;if(t!==null){t.return=e.return,xe=t;break}xe=e.return}}function pp(n){for(;xe!==null;){var e=xe;try{switch(e.tag){case 0:case 11:case 15:var t=e.return;try{Yl(4,e)}catch(l){At(e,t,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){At(e,r,l)}}var s=e.return;try{Qu(e)}catch(l){At(e,s,l)}break;case 5:var o=e.return;try{Qu(e)}catch(l){At(e,o,l)}}}catch(l){At(e,e.return,l)}if(e===n){xe=null;break}var a=e.sibling;if(a!==null){a.return=e.return,xe=a;break}xe=e.return}}var Fx=Math.ceil,Cl=Li.ReactCurrentDispatcher,Rh=Li.ReactCurrentOwner,Nn=Li.ReactCurrentBatchConfig,et=0,Ot=null,Pt=null,Gt=0,Sn=0,gs=cr(0),Dt=0,Vo=null,Ur=0,ql=0,Ph=0,Eo=null,hn=null,Lh=0,Is=1/0,_i=null,Rl=!1,td=null,Ji=null,xa=!1,Yi=null,Pl=0,To=0,nd=null,el=-1,tl=0;function rn(){return et&6?bt():el!==-1?el:el=bt()}function er(n){return n.mode&1?et&2&&Gt!==0?Gt&-Gt:yx.transition!==null?(tl===0&&(tl=u0()),tl):(n=lt,n!==0||(n=window.event,n=n===void 0?16:_0(n.type)),n):1}function Kn(n,e,t,i){if(50<To)throw To=0,nd=null,Error(re(185));Yo(n,t,i),(!(et&2)||n!==Ot)&&(n===Ot&&(!(et&2)&&(ql|=t),Dt===4&&Wi(n,Gt)),_n(n,i),t===1&&et===0&&!(e.mode&1)&&(Is=bt()+500,Wl&&ur()))}function _n(n,e){var t=n.callbackNode;yv(n,e);var i=fl(n,n===Ot?Gt:0);if(i===0)t!==null&&wf(t),n.callbackNode=null,n.callbackPriority=0;else if(e=i&-i,n.callbackPriority!==e){if(t!=null&&wf(t),e===1)n.tag===0?xx(mp.bind(null,n)):z0(mp.bind(null,n)),mx(function(){!(et&6)&&ur()}),t=null;else{switch(d0(i)){case 1:t=ih;break;case 4:t=l0;break;case 16:t=hl;break;case 536870912:t=c0;break;default:t=hl}t=Ng(t,bg.bind(null,n))}n.callbackPriority=e,n.callbackNode=t}}function bg(n,e){if(el=-1,tl=0,et&6)throw Error(re(327));var t=n.callbackNode;if(ws()&&n.callbackNode!==t)return null;var i=fl(n,n===Ot?Gt:0);if(i===0)return null;if(i&30||i&n.expiredLanes||e)e=Ll(n,i);else{e=i;var r=et;et|=2;var s=Rg();(Ot!==n||Gt!==e)&&(_i=null,Is=bt()+500,Pr(n,e));do try{Bx();break}catch(a){Cg(n,a)}while(!0);gh(),Cl.current=s,et=r,Pt!==null?e=0:(Ot=null,Gt=0,e=Dt)}if(e!==0){if(e===2&&(r=Ru(n),r!==0&&(i=r,e=id(n,r))),e===1)throw t=Vo,Pr(n,0),Wi(n,i),_n(n,bt()),t;if(e===6)Wi(n,i);else{if(r=n.current.alternate,!(i&30)&&!kx(r)&&(e=Ll(n,i),e===2&&(s=Ru(n),s!==0&&(i=s,e=id(n,s))),e===1))throw t=Vo,Pr(n,0),Wi(n,i),_n(n,bt()),t;switch(n.finishedWork=r,n.finishedLanes=i,e){case 0:case 1:throw Error(re(345));case 2:xr(n,hn,_i);break;case 3:if(Wi(n,i),(i&130023424)===i&&(e=Lh+500-bt(),10<e)){if(fl(n,0)!==0)break;if(r=n.suspendedLanes,(r&i)!==i){rn(),n.pingedLanes|=n.suspendedLanes&r;break}n.timeoutHandle=Fu(xr.bind(null,n,hn,_i),e);break}xr(n,hn,_i);break;case 4:if(Wi(n,i),(i&4194240)===i)break;for(e=n.eventTimes,r=-1;0<i;){var o=31-$n(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=bt()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Fx(i/1960))-i,10<i){n.timeoutHandle=Fu(xr.bind(null,n,hn,_i),i);break}xr(n,hn,_i);break;case 5:xr(n,hn,_i);break;default:throw Error(re(329))}}}return _n(n,bt()),n.callbackNode===t?bg.bind(null,n):null}function id(n,e){var t=Eo;return n.current.memoizedState.isDehydrated&&(Pr(n,e).flags|=256),n=Ll(n,e),n!==2&&(e=hn,hn=t,e!==null&&rd(e)),n}function rd(n){hn===null?hn=n:hn.push.apply(hn,n)}function kx(n){for(var e=n;;){if(e.flags&16384){var t=e.updateQueue;if(t!==null&&(t=t.stores,t!==null))for(var i=0;i<t.length;i++){var r=t[i],s=r.getSnapshot;r=r.value;try{if(!Qn(s(),r))return!1}catch{return!1}}}if(t=e.child,e.subtreeFlags&16384&&t!==null)t.return=e,e=t;else{if(e===n)break;for(;e.sibling===null;){if(e.return===null||e.return===n)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Wi(n,e){for(e&=~Ph,e&=~ql,n.suspendedLanes|=e,n.pingedLanes&=~e,n=n.expirationTimes;0<e;){var t=31-$n(e),i=1<<t;n[t]=-1,e&=~i}}function mp(n){if(et&6)throw Error(re(327));ws();var e=fl(n,0);if(!(e&1))return _n(n,bt()),null;var t=Ll(n,e);if(n.tag!==0&&t===2){var i=Ru(n);i!==0&&(e=i,t=id(n,i))}if(t===1)throw t=Vo,Pr(n,0),Wi(n,e),_n(n,bt()),t;if(t===6)throw Error(re(345));return n.finishedWork=n.current.alternate,n.finishedLanes=e,xr(n,hn,_i),_n(n,bt()),null}function Dh(n,e){var t=et;et|=1;try{return n(e)}finally{et=t,et===0&&(Is=bt()+500,Wl&&ur())}}function zr(n){Yi!==null&&Yi.tag===0&&!(et&6)&&ws();var e=et;et|=1;var t=Nn.transition,i=lt;try{if(Nn.transition=null,lt=1,n)return n()}finally{lt=i,Nn.transition=t,et=e,!(et&6)&&ur()}}function Ih(){Sn=gs.current,xt(gs)}function Pr(n,e){n.finishedWork=null,n.finishedLanes=0;var t=n.timeoutHandle;if(t!==-1&&(n.timeoutHandle=-1,px(t)),Pt!==null)for(t=Pt.return;t!==null;){var i=t;switch(fh(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&vl();break;case 3:Ls(),xt(mn),xt(Qt),Mh();break;case 5:Sh(i);break;case 4:Ls();break;case 13:xt(Mt);break;case 19:xt(Mt);break;case 10:_h(i.type._context);break;case 22:case 23:Ih()}t=t.return}if(Ot=n,Pt=n=tr(n.current,null),Gt=Sn=e,Dt=0,Vo=null,Ph=ql=Ur=0,hn=Eo=null,Tr!==null){for(e=0;e<Tr.length;e++)if(t=Tr[e],i=t.interleaved,i!==null){t.interleaved=null;var r=i.next,s=t.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}t.pending=i}Tr=null}return n}function Cg(n,e){do{var t=Pt;try{if(gh(),Za.current=bl,Al){for(var i=wt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Al=!1}if(Nr=0,kt=Lt=wt=null,Mo=!1,Oo=0,Rh.current=null,t===null||t.return===null){Dt=1,Vo=e,Pt=null;break}e:{var s=n,o=t.return,a=t,l=e;if(e=Gt,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,d=a,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var f=d.alternate;f?(d.updateQueue=f.updateQueue,d.memoizedState=f.memoizedState,d.lanes=f.lanes):(d.updateQueue=null,d.memoizedState=null)}var p=np(o);if(p!==null){p.flags&=-257,ip(p,o,a,s,e),p.mode&1&&tp(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var y=new Set;y.add(l),e.updateQueue=y}else v.add(l);break e}else{if(!(e&1)){tp(s,c,e),Nh();break e}l=Error(re(426))}}else if(St&&a.mode&1){var m=np(o);if(m!==null){!(m.flags&65536)&&(m.flags|=256),ip(m,o,a,s,e),ph(Ds(l,a));break e}}s=l=Ds(l,a),Dt!==4&&(Dt=2),Eo===null?Eo=[s]:Eo.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var u=dg(s,l,e);$f(s,u);break e;case 1:a=l;var g=s.type,_=s.stateNode;if(!(s.flags&128)&&(typeof g.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(Ji===null||!Ji.has(_)))){s.flags|=65536,e&=-e,s.lanes|=e;var x=hg(s,a,e);$f(s,x);break e}}s=s.return}while(s!==null)}Lg(t)}catch(w){e=w,Pt===t&&t!==null&&(Pt=t=t.return);continue}break}while(!0)}function Rg(){var n=Cl.current;return Cl.current=bl,n===null?bl:n}function Nh(){(Dt===0||Dt===3||Dt===2)&&(Dt=4),Ot===null||!(Ur&268435455)&&!(ql&268435455)||Wi(Ot,Gt)}function Ll(n,e){var t=et;et|=2;var i=Rg();(Ot!==n||Gt!==e)&&(_i=null,Pr(n,e));do try{Ox();break}catch(r){Cg(n,r)}while(!0);if(gh(),et=t,Cl.current=i,Pt!==null)throw Error(re(261));return Ot=null,Gt=0,Dt}function Ox(){for(;Pt!==null;)Pg(Pt)}function Bx(){for(;Pt!==null&&!dv();)Pg(Pt)}function Pg(n){var e=Ig(n.alternate,n,Sn);n.memoizedProps=n.pendingProps,e===null?Lg(n):Pt=e,Rh.current=null}function Lg(n){var e=n;do{var t=e.alternate;if(n=e.return,e.flags&32768){if(t=Ix(t,e),t!==null){t.flags&=32767,Pt=t;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Dt=6,Pt=null;return}}else if(t=Dx(t,e,Sn),t!==null){Pt=t;return}if(e=e.sibling,e!==null){Pt=e;return}Pt=e=n}while(e!==null);Dt===0&&(Dt=5)}function xr(n,e,t){var i=lt,r=Nn.transition;try{Nn.transition=null,lt=1,Hx(n,e,t,i)}finally{Nn.transition=r,lt=i}return null}function Hx(n,e,t,i){do ws();while(Yi!==null);if(et&6)throw Error(re(327));t=n.finishedWork;var r=n.finishedLanes;if(t===null)return null;if(n.finishedWork=null,n.finishedLanes=0,t===n.current)throw Error(re(177));n.callbackNode=null,n.callbackPriority=0;var s=t.lanes|t.childLanes;if(Sv(n,s),n===Ot&&(Pt=Ot=null,Gt=0),!(t.subtreeFlags&2064)&&!(t.flags&2064)||xa||(xa=!0,Ng(hl,function(){return ws(),null})),s=(t.flags&15990)!==0,t.subtreeFlags&15990||s){s=Nn.transition,Nn.transition=null;var o=lt;lt=1;var a=et;et|=4,Rh.current=null,Ux(n,t),Tg(t,n),ax(Uu),pl=!!Nu,Uu=Nu=null,n.current=t,zx(t),hv(),et=a,lt=o,Nn.transition=s}else n.current=t;if(xa&&(xa=!1,Yi=n,Pl=r),s=n.pendingLanes,s===0&&(Ji=null),mv(t.stateNode),_n(n,bt()),e!==null)for(i=n.onRecoverableError,t=0;t<e.length;t++)r=e[t],i(r.value,{componentStack:r.stack,digest:r.digest});if(Rl)throw Rl=!1,n=td,td=null,n;return Pl&1&&n.tag!==0&&ws(),s=n.pendingLanes,s&1?n===nd?To++:(To=0,nd=n):To=0,ur(),null}function ws(){if(Yi!==null){var n=d0(Pl),e=Nn.transition,t=lt;try{if(Nn.transition=null,lt=16>n?16:n,Yi===null)var i=!1;else{if(n=Yi,Yi=null,Pl=0,et&6)throw Error(re(331));var r=et;for(et|=4,xe=n.current;xe!==null;){var s=xe,o=s.child;if(xe.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(xe=c;xe!==null;){var d=xe;switch(d.tag){case 0:case 11:case 15:wo(8,d,s)}var h=d.child;if(h!==null)h.return=d,xe=h;else for(;xe!==null;){d=xe;var f=d.sibling,p=d.return;if(Mg(d),d===c){xe=null;break}if(f!==null){f.return=p,xe=f;break}xe=p}}}var v=s.alternate;if(v!==null){var y=v.child;if(y!==null){v.child=null;do{var m=y.sibling;y.sibling=null,y=m}while(y!==null)}}xe=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,xe=o;else e:for(;xe!==null;){if(s=xe,s.flags&2048)switch(s.tag){case 0:case 11:case 15:wo(9,s,s.return)}var u=s.sibling;if(u!==null){u.return=s.return,xe=u;break e}xe=s.return}}var g=n.current;for(xe=g;xe!==null;){o=xe;var _=o.child;if(o.subtreeFlags&2064&&_!==null)_.return=o,xe=_;else e:for(o=g;xe!==null;){if(a=xe,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Yl(9,a)}}catch(w){At(a,a.return,w)}if(a===o){xe=null;break e}var x=a.sibling;if(x!==null){x.return=a.return,xe=x;break e}xe=a.return}}if(et=r,ur(),si&&typeof si.onPostCommitFiberRoot=="function")try{si.onPostCommitFiberRoot(Ol,n)}catch{}i=!0}return i}finally{lt=t,Nn.transition=e}}return!1}function gp(n,e,t){e=Ds(t,e),e=dg(n,e,1),n=Qi(n,e,1),e=rn(),n!==null&&(Yo(n,1,e),_n(n,e))}function At(n,e,t){if(n.tag===3)gp(n,n,t);else for(;e!==null;){if(e.tag===3){gp(e,n,t);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Ji===null||!Ji.has(i))){n=Ds(t,n),n=hg(e,n,1),e=Qi(e,n,1),n=rn(),e!==null&&(Yo(e,1,n),_n(e,n));break}}e=e.return}}function Vx(n,e,t){var i=n.pingCache;i!==null&&i.delete(e),e=rn(),n.pingedLanes|=n.suspendedLanes&t,Ot===n&&(Gt&t)===t&&(Dt===4||Dt===3&&(Gt&130023424)===Gt&&500>bt()-Lh?Pr(n,0):Ph|=t),_n(n,e)}function Dg(n,e){e===0&&(n.mode&1?(e=ca,ca<<=1,!(ca&130023424)&&(ca=4194304)):e=1);var t=rn();n=Ci(n,e),n!==null&&(Yo(n,e,t),_n(n,t))}function Gx(n){var e=n.memoizedState,t=0;e!==null&&(t=e.retryLane),Dg(n,t)}function Wx(n,e){var t=0;switch(n.tag){case 13:var i=n.stateNode,r=n.memoizedState;r!==null&&(t=r.retryLane);break;case 19:i=n.stateNode;break;default:throw Error(re(314))}i!==null&&i.delete(e),Dg(n,t)}var Ig;Ig=function(n,e,t){if(n!==null)if(n.memoizedProps!==e.pendingProps||mn.current)pn=!0;else{if(!(n.lanes&t)&&!(e.flags&128))return pn=!1,Lx(n,e,t);pn=!!(n.flags&131072)}else pn=!1,St&&e.flags&1048576&&F0(e,Sl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Ja(n,e),n=e.pendingProps;var r=Cs(e,Qt.current);Ms(e,t),r=Eh(null,e,i,n,r,t);var s=Th();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,gn(i)?(s=!0,xl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,xh(e),r.updater=jl,e.stateNode=r,r._reactInternals=e,Wu(e,i,n,t),e=Yu(null,e,i,!0,s,t)):(e.tag=0,St&&s&&hh(e),tn(null,e,r,t),e=e.child),e;case 16:i=e.elementType;e:{switch(Ja(n,e),n=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=jx(i),n=Wn(i,n),r){case 0:e=ju(null,e,i,n,t);break e;case 1:e=op(null,e,i,n,t);break e;case 11:e=rp(null,e,i,n,t);break e;case 14:e=sp(null,e,i,Wn(i.type,n),t);break e}throw Error(re(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Wn(i,r),ju(n,e,i,r,t);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Wn(i,r),op(n,e,i,r,t);case 3:e:{if(gg(e),n===null)throw Error(re(387));i=e.pendingProps,s=e.memoizedState,r=s.element,G0(n,e),El(e,i,null,t);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Ds(Error(re(423)),e),e=ap(n,e,i,t,r);break e}else if(i!==r){r=Ds(Error(re(424)),e),e=ap(n,e,i,t,r);break e}else for(wn=Zi(e.stateNode.containerInfo.firstChild),En=e,St=!0,jn=null,t=H0(e,null,i,t),e.child=t;t;)t.flags=t.flags&-3|4096,t=t.sibling;else{if(Rs(),i===r){e=Ri(n,e,t);break e}tn(n,e,i,t)}e=e.child}return e;case 5:return W0(e),n===null&&Hu(e),i=e.type,r=e.pendingProps,s=n!==null?n.memoizedProps:null,o=r.children,zu(i,r)?o=null:s!==null&&zu(i,s)&&(e.flags|=32),mg(n,e),tn(n,e,o,t),e.child;case 6:return n===null&&Hu(e),null;case 13:return _g(n,e,t);case 4:return yh(e,e.stateNode.containerInfo),i=e.pendingProps,n===null?e.child=Ps(e,null,i,t):tn(n,e,i,t),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Wn(i,r),rp(n,e,i,r,t);case 7:return tn(n,e,e.pendingProps,t),e.child;case 8:return tn(n,e,e.pendingProps.children,t),e.child;case 12:return tn(n,e,e.pendingProps.children,t),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,ft(Ml,i._currentValue),i._currentValue=o,s!==null)if(Qn(s.value,o)){if(s.children===r.children&&!mn.current){e=Ri(n,e,t);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ei(-1,t&-t),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var d=c.pending;d===null?l.next=l:(l.next=d.next,d.next=l),c.pending=l}}s.lanes|=t,l=s.alternate,l!==null&&(l.lanes|=t),Vu(s.return,t,e),a.lanes|=t;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(re(341));o.lanes|=t,a=o.alternate,a!==null&&(a.lanes|=t),Vu(o,t,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}tn(n,e,r.children,t),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ms(e,t),r=zn(r),i=i(r),e.flags|=1,tn(n,e,i,t),e.child;case 14:return i=e.type,r=Wn(i,e.pendingProps),r=Wn(i.type,r),sp(n,e,i,r,t);case 15:return fg(n,e,e.type,e.pendingProps,t);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Wn(i,r),Ja(n,e),e.tag=1,gn(i)?(n=!0,xl(e)):n=!1,Ms(e,t),ug(e,i,r),Wu(e,i,r,t),Yu(null,e,i,!0,n,t);case 19:return vg(n,e,t);case 22:return pg(n,e,t)}throw Error(re(156,e.tag))};function Ng(n,e){return a0(n,e)}function Xx(n,e,t,i){this.tag=n,this.key=t,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function In(n,e,t,i){return new Xx(n,e,t,i)}function Uh(n){return n=n.prototype,!(!n||!n.isReactComponent)}function jx(n){if(typeof n=="function")return Uh(n)?1:0;if(n!=null){if(n=n.$$typeof,n===eh)return 11;if(n===th)return 14}return 2}function tr(n,e){var t=n.alternate;return t===null?(t=In(n.tag,e,n.key,n.mode),t.elementType=n.elementType,t.type=n.type,t.stateNode=n.stateNode,t.alternate=n,n.alternate=t):(t.pendingProps=e,t.type=n.type,t.flags=0,t.subtreeFlags=0,t.deletions=null),t.flags=n.flags&14680064,t.childLanes=n.childLanes,t.lanes=n.lanes,t.child=n.child,t.memoizedProps=n.memoizedProps,t.memoizedState=n.memoizedState,t.updateQueue=n.updateQueue,e=n.dependencies,t.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},t.sibling=n.sibling,t.index=n.index,t.ref=n.ref,t}function nl(n,e,t,i,r,s){var o=2;if(i=n,typeof n=="function")Uh(n)&&(o=1);else if(typeof n=="string")o=5;else e:switch(n){case os:return Lr(t.children,r,s,e);case Jd:o=8,r|=8;break;case pu:return n=In(12,t,e,r|2),n.elementType=pu,n.lanes=s,n;case mu:return n=In(13,t,e,r),n.elementType=mu,n.lanes=s,n;case gu:return n=In(19,t,e,r),n.elementType=gu,n.lanes=s,n;case Wm:return $l(t,r,s,e);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case Vm:o=10;break e;case Gm:o=9;break e;case eh:o=11;break e;case th:o=14;break e;case Hi:o=16,i=null;break e}throw Error(re(130,n==null?n:typeof n,""))}return e=In(o,t,e,r),e.elementType=n,e.type=i,e.lanes=s,e}function Lr(n,e,t,i){return n=In(7,n,i,e),n.lanes=t,n}function $l(n,e,t,i){return n=In(22,n,i,e),n.elementType=Wm,n.lanes=t,n.stateNode={isHidden:!1},n}function Pc(n,e,t){return n=In(6,n,null,e),n.lanes=t,n}function Lc(n,e,t){return e=In(4,n.children!==null?n.children:[],n.key,e),e.lanes=t,e.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},e}function Yx(n,e,t,i,r){this.tag=e,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=dc(0),this.expirationTimes=dc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=dc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function zh(n,e,t,i,r,s,o,a,l){return n=new Yx(n,e,t,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=In(3,null,null,e),n.current=s,s.stateNode=n,s.memoizedState={element:i,isDehydrated:t,cache:null,transitions:null,pendingSuspenseBoundaries:null},xh(s),n}function qx(n,e,t){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ss,key:i==null?null:""+i,children:n,containerInfo:e,implementation:t}}function Ug(n){if(!n)return sr;n=n._reactInternals;e:{if(Br(n)!==n||n.tag!==1)throw Error(re(170));var e=n;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(gn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(re(171))}if(n.tag===1){var t=n.type;if(gn(t))return U0(n,t,e)}return e}function zg(n,e,t,i,r,s,o,a,l){return n=zh(t,i,!0,n,r,s,o,a,l),n.context=Ug(null),t=n.current,i=rn(),r=er(t),s=Ei(i,r),s.callback=e??null,Qi(t,s,r),n.current.lanes=r,Yo(n,r,i),_n(n,i),n}function Kl(n,e,t,i){var r=e.current,s=rn(),o=er(r);return t=Ug(t),e.context===null?e.context=t:e.pendingContext=t,e=Ei(s,o),e.payload={element:n},i=i===void 0?null:i,i!==null&&(e.callback=i),n=Qi(r,e,o),n!==null&&(Kn(n,r,o,s),Ka(n,r,o)),o}function Dl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function _p(n,e){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var t=n.retryLane;n.retryLane=t!==0&&t<e?t:e}}function Fh(n,e){_p(n,e),(n=n.alternate)&&_p(n,e)}function $x(){return null}var Fg=typeof reportError=="function"?reportError:function(n){console.error(n)};function kh(n){this._internalRoot=n}Zl.prototype.render=kh.prototype.render=function(n){var e=this._internalRoot;if(e===null)throw Error(re(409));Kl(n,e,null,null)};Zl.prototype.unmount=kh.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var e=n.containerInfo;zr(function(){Kl(null,n,null,null)}),e[bi]=null}};function Zl(n){this._internalRoot=n}Zl.prototype.unstable_scheduleHydration=function(n){if(n){var e=p0();n={blockedOn:null,target:n,priority:e};for(var t=0;t<Gi.length&&e!==0&&e<Gi[t].priority;t++);Gi.splice(t,0,n),t===0&&g0(n)}};function Oh(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Ql(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function vp(){}function Kx(n,e,t,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=Dl(o);s.call(c)}}var o=zg(e,i,n,0,null,!1,!1,"",vp);return n._reactRootContainer=o,n[bi]=o.current,No(n.nodeType===8?n.parentNode:n),zr(),o}for(;r=n.lastChild;)n.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=Dl(l);a.call(c)}}var l=zh(n,0,!1,null,null,!1,!1,"",vp);return n._reactRootContainer=l,n[bi]=l.current,No(n.nodeType===8?n.parentNode:n),zr(function(){Kl(e,l,t,i)}),l}function Jl(n,e,t,i,r){var s=t._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=Dl(o);a.call(l)}}Kl(e,o,n,r)}else o=Kx(t,e,n,r,i);return Dl(o)}h0=function(n){switch(n.tag){case 3:var e=n.stateNode;if(e.current.memoizedState.isDehydrated){var t=fo(e.pendingLanes);t!==0&&(rh(e,t|1),_n(e,bt()),!(et&6)&&(Is=bt()+500,ur()))}break;case 13:zr(function(){var i=Ci(n,1);if(i!==null){var r=rn();Kn(i,n,1,r)}}),Fh(n,1)}};sh=function(n){if(n.tag===13){var e=Ci(n,134217728);if(e!==null){var t=rn();Kn(e,n,134217728,t)}Fh(n,134217728)}};f0=function(n){if(n.tag===13){var e=er(n),t=Ci(n,e);if(t!==null){var i=rn();Kn(t,n,e,i)}Fh(n,e)}};p0=function(){return lt};m0=function(n,e){var t=lt;try{return lt=n,e()}finally{lt=t}};Au=function(n,e,t){switch(e){case"input":if(xu(n,t),e=t.name,t.type==="radio"&&e!=null){for(t=n;t.parentNode;)t=t.parentNode;for(t=t.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<t.length;e++){var i=t[e];if(i!==n&&i.form===n.form){var r=Gl(i);if(!r)throw Error(re(90));jm(i),xu(i,r)}}}break;case"textarea":qm(n,t);break;case"select":e=t.value,e!=null&&vs(n,!!t.multiple,e,!1)}};t0=Dh;n0=zr;var Zx={usingClientEntryPoint:!1,Events:[$o,us,Gl,Jm,e0,Dh]},no={findFiberByHostInstance:Er,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Qx={bundleType:no.bundleType,version:no.version,rendererPackageName:no.rendererPackageName,rendererConfig:no.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Li.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=s0(n),n===null?null:n.stateNode},findFiberByHostInstance:no.findFiberByHostInstance||$x,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ya=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ya.isDisabled&&ya.supportsFiber)try{Ol=ya.inject(Qx),si=ya}catch{}}An.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Zx;An.createPortal=function(n,e){var t=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Oh(e))throw Error(re(200));return qx(n,e,null,t)};An.createRoot=function(n,e){if(!Oh(n))throw Error(re(299));var t=!1,i="",r=Fg;return e!=null&&(e.unstable_strictMode===!0&&(t=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=zh(n,1,!1,null,null,t,!1,i,r),n[bi]=e.current,No(n.nodeType===8?n.parentNode:n),new kh(e)};An.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var e=n._reactInternals;if(e===void 0)throw typeof n.render=="function"?Error(re(188)):(n=Object.keys(n).join(","),Error(re(268,n)));return n=s0(e),n=n===null?null:n.stateNode,n};An.flushSync=function(n){return zr(n)};An.hydrate=function(n,e,t){if(!Ql(e))throw Error(re(200));return Jl(null,n,e,!0,t)};An.hydrateRoot=function(n,e,t){if(!Oh(n))throw Error(re(405));var i=t!=null&&t.hydratedSources||null,r=!1,s="",o=Fg;if(t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(s=t.identifierPrefix),t.onRecoverableError!==void 0&&(o=t.onRecoverableError)),e=zg(e,null,n,1,t??null,r,!1,s,o),n[bi]=e.current,No(n),i)for(n=0;n<i.length;n++)t=i[n],r=t._getVersion,r=r(t._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[t,r]:e.mutableSourceEagerHydrationData.push(t,r);return new Zl(e)};An.render=function(n,e,t){if(!Ql(e))throw Error(re(200));return Jl(null,n,e,!1,t)};An.unmountComponentAtNode=function(n){if(!Ql(n))throw Error(re(40));return n._reactRootContainer?(zr(function(){Jl(null,null,n,!1,function(){n._reactRootContainer=null,n[bi]=null})}),!0):!1};An.unstable_batchedUpdates=Dh;An.unstable_renderSubtreeIntoContainer=function(n,e,t,i){if(!Ql(t))throw Error(re(200));if(n==null||n._reactInternals===void 0)throw Error(re(38));return Jl(n,e,t,!1,i)};An.version="18.3.1-next-f1338f8080-20240426";function kg(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(kg)}catch(n){console.error(n)}}kg(),km.exports=An;var Jx=km.exports,xp=Jx;hu.createRoot=xp.createRoot,hu.hydrateRoot=xp.hydrateRoot;const Qe={GRAVITY:24,PLAYER_RADIUS:.44,PLAYER_HEIGHT:1.78,PLAYER_CROUCH_HEIGHT:1.24,EYE_HEIGHT:1.62,CROUCH_EYE_HEIGHT:1.12,BASE_MOVE_SPEED:6.4,WALK_SPEED_MULT:.54,CROUCH_SPEED_MULT:.48,JUMP_SPEED:7.4,STEP_HEIGHT:.52,GROUND_ACCEL:58,GROUND_FRICTION:10.5,AIR_ACCEL:14,FIXED_DT:1/60,MAX_FRAME_DT:.05},Ye={FREEZE_TIME:4,BUY_WINDOW:22,ROUND_TIME:115,BOMB_TIMER:40,PLANT_TIME:3.2,DEFUSE_TIME:5,ROUND_END_TIME:4.5,PISTOL_ROUND_MONEY:800,PISTOL_ROUND_ARMOR:100,FULL_BUY_START_MONEY:5500,WIN_REWARD:3250,LOSS_REWARD:2400,BOMB_PLANT_BONUS:800,MAX_MONEY:16e3,ARMOR_COST:650,HELMET_COST:350},ey={head:2,chest:1,stomach:1.2,arm:.85,leg:.75},rs={DEFAULT_FOV:75,NEAR:.08,FAR:220,DEFAULT_SENSITIVITY:.0022},Gr={MIN_X:-52,MAX_X:52,MIN_Z:-52,MAX_Z:52},ty={CT:["Alpha","Bravo","Vanguard","Spectre","Sentinel"],T:["Viper","Mirage","Jackal","Nomad","Scorpion"]},Ue={ak47:{id:"ak47",name:"AK-47",shortName:"AK-47",slot:"primary",price:2700,damage:36,armorPenetration:.82,fireRate:600,automatic:!0,magSize:30,reserveAmmo:90,reloadTime:2.4,moveSpeedMult:.86,baseSpread:.004,moveSpread:.045,jumpSpread:.095,recoilPitch:.036,recoilYaw:.022,recoilSpreadGain:.014,recoilRecovery:5.2,range:140,killReward:300},m4a4:{id:"m4a4",name:"M4A4",shortName:"M4A4",slot:"primary",price:3100,damage:30,armorPenetration:.72,fireRate:680,automatic:!0,magSize:30,reserveAmmo:90,reloadTime:2.3,moveSpeedMult:.88,baseSpread:.003,moveSpread:.034,jumpSpread:.08,recoilPitch:.019,recoilYaw:.011,recoilSpreadGain:.0085,recoilRecovery:7.4,range:140,killReward:300},awp:{id:"awp",name:"AWP",shortName:"AWP",slot:"primary",price:4750,damage:115,armorPenetration:.975,fireRate:41,automatic:!1,magSize:10,reserveAmmo:30,reloadTime:3.4,moveSpeedMult:.78,baseSpread:6e-4,moveSpread:.075,jumpSpread:.14,recoilPitch:.065,recoilYaw:.015,recoilSpreadGain:.04,recoilRecovery:3.5,range:200,canScope:!0,scopeFovs:[28,13],killReward:100},glock:{id:"glock",name:"Glock-18",shortName:"GLOCK",slot:"secondary",price:200,damage:22,armorPenetration:.55,fireRate:400,automatic:!1,magSize:20,reserveAmmo:120,reloadTime:1.9,moveSpeedMult:.96,baseSpread:.006,moveSpread:.018,jumpSpread:.055,recoilPitch:.014,recoilYaw:.008,recoilSpreadGain:.007,recoilRecovery:8,range:90,killReward:300},usp:{id:"usp",name:"USP-S",shortName:"USP-S",slot:"secondary",price:200,damage:26,armorPenetration:.58,fireRate:350,automatic:!1,magSize:12,reserveAmmo:24,reloadTime:2,moveSpeedMult:.96,baseSpread:.004,moveSpread:.016,jumpSpread:.052,recoilPitch:.015,recoilYaw:.006,recoilSpreadGain:.0075,recoilRecovery:8.5,range:95,killReward:300},deagle:{id:"deagle",name:"Desert Eagle",shortName:"DEAGLE",slot:"secondary",price:700,damage:48,armorPenetration:.88,fireRate:240,automatic:!1,magSize:7,reserveAmmo:35,reloadTime:2.1,moveSpeedMult:.92,baseSpread:.005,moveSpread:.036,jumpSpread:.085,recoilPitch:.048,recoilYaw:.018,recoilSpreadGain:.022,recoilRecovery:4.5,range:110,killReward:300},knife:{id:"knife",name:"Tactical Knife",shortName:"KNIFE",slot:"melee",price:0,damage:45,armorPenetration:.85,fireRate:130,automatic:!0,magSize:0,reserveAmmo:0,reloadTime:0,moveSpeedMult:1.08,baseSpread:0,moveSpread:0,jumpSpread:0,recoilPitch:0,recoilYaw:0,recoilSpreadGain:0,recoilRecovery:10,range:2.45,isMelee:!0,killReward:1500},c4:{id:"c4",name:"C4 Explosive",shortName:"C4",slot:"c4",price:0,damage:0,armorPenetration:1,fireRate:60,automatic:!1,magSize:0,reserveAmmo:0,reloadTime:0,moveSpeedMult:1,baseSpread:0,moveSpread:0,jumpSpread:0,recoilPitch:0,recoilYaw:0,recoilSpreadGain:0,recoilRecovery:10,range:0,isBomb:!0,killReward:0}},ny=({hud:n,onBuy:e,onClose:t})=>{const i=n.isPistolRound,r=[{key:"1",id:"ak47",name:Ue.ak47.name,desc:"高伤害 · 强后坐力 · 30发步枪",price:Ue.ak47.price,category:"主武器",locked:i,lockReason:"手枪局禁用主武器",owned:n.slots.primary==="ak47"},{key:"2",id:"m4a4",name:Ue.m4a4.name,desc:"中伤害 · 低后坐 · 高射速步枪",price:Ue.m4a4.price,category:"主武器",locked:i,lockReason:"手枪局禁用主武器",owned:n.slots.primary==="m4a4"},{key:"3",id:"awp",name:Ue.awp.name,desc:"单发致命 · 右键双倍开镜狙击",price:Ue.awp.price,category:"主武器",locked:i,lockReason:"手枪局禁用主武器",owned:n.slots.primary==="awp"},{key:"4",id:"deagle",name:Ue.deagle.name,desc:"高穿甲大口径手枪 · 7发弹匣",price:Ue.deagle.price,category:"副武器",owned:n.slots.secondary==="deagle"},{key:"5",id:"usp",name:Ue.usp.name,desc:"消音精准手枪 · 12发弹匣",price:Ue.usp.price,category:"副武器",owned:n.slots.secondary==="usp"},{key:"6",id:"glock",name:Ue.glock.name,desc:"20发大弹匣手枪 · 移动稳定",price:Ue.glock.price,category:"副武器",owned:n.slots.secondary==="glock"},{key:"7",id:"armor",name:"凯夫拉防弹衣 (Kevlar)",desc:"100 护甲 · 显著降低身体中弹伤害",price:Ye.ARMOR_COST,category:"装备",owned:n.armor>=100},{key:"8",id:"helmet",name:"战术头盔 (Helmet)",desc:"降低头部中弹伤害（需防弹衣）",price:Ye.HELMET_COST,category:"装备",locked:i||n.armor<=0,lockReason:i?"手枪局禁用头盔":"请先购买防弹衣",owned:n.hasHelmet}];return Zt.useEffect(()=>{const s=o=>{const a=parseInt(o.key,10)-1;if(a>=0&&a<r.length){const l=r[a];!l.locked&&!l.owned&&n.money>=l.price&&e(l.id)}};return window.addEventListener("keydown",s),()=>window.removeEventListener("keydown",s)},[n.money,i,n.armor,n.hasHelmet]),L.jsx("div",{style:{position:"fixed",inset:0,background:"rgba(6, 10, 16, 0.72)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50},onMouseDown:s=>s.stopPropagation(),children:L.jsxs("div",{style:{width:680,maxWidth:"94vw",background:"linear-gradient(160deg, rgba(19, 26, 38, 0.96), rgba(11, 15, 24, 0.98))",border:"1px solid rgba(255, 255, 255, 0.16)",borderRadius:12,padding:22,boxShadow:"0 24px 64px rgba(0,0,0,0.65)"},children:[L.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14},children:[L.jsxs("div",{children:[L.jsx("div",{style:{fontSize:18,fontWeight:800,letterSpacing:"0.06em"},children:"战术军械库 // BUY MENU"}),L.jsx("div",{style:{fontSize:12,color:"#9fb2c8",marginTop:2},children:i?"当前为第一回合手枪局：仅允许购买手枪与基础护甲（第二回合起解锁全步枪/AWP）":"按数字键 [1-8] 或点击购买 · 按 [B] 或 [ESC] 返回战场"})]}),L.jsxs("div",{style:{textAlign:"right"},children:[L.jsxs("div",{style:{fontSize:22,fontWeight:800,color:"#4ade80"},children:["$",n.money]}),L.jsx("div",{style:{fontSize:11,color:"#94a3b8"},children:"当前资金"})]})]}),L.jsx("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:10},children:r.map(s=>{const o=n.money>=s.price,a=!!(s.locked||s.owned||!o);return L.jsxs("button",{disabled:a,onClick:()=>e(s.id),style:{textAlign:"left",padding:"12px 14px",borderRadius:8,border:s.owned?"1px solid rgba(74, 222, 128, 0.5)":a?"1px solid rgba(255,255,255,0.08)":"1px solid rgba(245, 185, 66, 0.45)",background:s.owned?"rgba(34, 197, 94, 0.12)":a?"rgba(255,255,255,0.03)":"rgba(255,255,255,0.07)",color:a?"#64748b":"#f1f5f9",cursor:a?"not-allowed":"pointer",transition:"all 0.12s"},children:[L.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[L.jsxs("span",{style:{fontWeight:700,fontSize:14},children:[L.jsxs("span",{style:{color:"#f5b942",marginRight:6},children:["[",s.key,"]"]}),s.name]}),L.jsx("span",{style:{fontWeight:800,fontSize:13,color:s.owned||o&&!s.locked?"#4ade80":"#ef4444"},children:s.owned?"已装备":`$${s.price}`})]}),L.jsx("div",{style:{fontSize:11,color:s.locked?"#f87171":"#94a3b8",marginTop:4},children:s.locked?s.lockReason:`${s.category} · ${s.desc}`})]},s.id)})}),L.jsx("div",{style:{marginTop:16,display:"flex",justifyContent:"flex-end"},children:L.jsx("button",{onClick:t,style:{padding:"8px 20px",borderRadius:6,border:"1px solid rgba(255,255,255,0.2)",background:"#f5b942",color:"#111827",fontWeight:800,cursor:"pointer",fontSize:13},children:"返回游戏 [B / ESC]"})})]})})},Ft=204;function Ct(n,e){const t=(n-Gr.MIN_X)/(Gr.MAX_X-Gr.MIN_X),i=(e-Gr.MIN_Z)/(Gr.MAX_Z-Gr.MIN_Z);return[t*Ft,i*Ft]}const iy=({mapData:n,agents:e,bomb:t,playerTeam:i,callout:r})=>{const s=Zt.useRef(null),o=Zt.useRef(null);return Zt.useEffect(()=>{const a=s.current;if(!a)return;const l=a.getContext("2d");if(!l)return;l.clearRect(0,0,Ft,Ft),l.fillStyle="rgba(13, 18, 26, 0.92)",l.fillRect(0,0,Ft,Ft),l.strokeStyle="rgba(120, 160, 200, 0.08)",l.lineWidth=1;for(let w=0;w<=Ft;w+=34)l.beginPath(),l.moveTo(w,0),l.lineTo(w,Ft),l.stroke(),l.beginPath(),l.moveTo(0,w),l.lineTo(Ft,w),l.stroke();for(const w of n.boxes){if(w.radarType!=="floor")continue;const[T,A]=Ct(w.x1,w.z1),[C,M]=Ct(w.x2,w.z2),S=Math.round(w.y2*10);l.fillStyle=`rgb(${56+S}, ${66+S}, ${76+S})`,l.fillRect(T,A,C-T,M-A)}for(const w of n.ramps){const[T,A]=Ct(w.x1,w.z1),[C,M]=Ct(w.x2,w.z2);l.fillStyle="#4c5966",l.fillRect(T,A,C-T,M-A)}for(const w of n.boxes)if(w.radarType==="crate"){const[T,A]=Ct(w.x1,w.z1),[C,M]=Ct(w.x2,w.z2);l.fillStyle="#8b7355",l.fillRect(T,A,Math.max(2,C-T),Math.max(2,M-A))}else if(w.radarType==="door"){const[T,A]=Ct(w.x1,w.z1),[C,M]=Ct(w.x2,w.z2);l.fillStyle="#d49a52",l.fillRect(T,A,Math.max(2,C-T),Math.max(2,M-A))}for(const w of n.boxes){if(w.radarType!=="wall")continue;const[T,A]=Ct(w.x1,w.z1),[C,M]=Ct(w.x2,w.z2);l.fillStyle="rgba(20, 26, 36, 0.92)",l.fillRect(T,A,C-T,M-A),l.strokeStyle="rgba(165, 185, 210, 0.24)",l.lineWidth=.7,l.strokeRect(T,A,C-T,M-A)}for(const w of n.plantZones){const[T,A]=Ct(w.x1,w.z1),[C,M]=Ct(w.x2,w.z2);l.fillStyle="rgba(230, 72, 54, 0.22)",l.fillRect(T,A,C-T,M-A),l.strokeStyle="rgba(235, 90, 70, 0.7)",l.lineWidth=1,l.strokeRect(T,A,C-T,M-A),l.fillStyle="#ff6b57",l.font="bold 13px sans-serif",l.textAlign="center",l.textBaseline="middle",l.fillText(w.site??"",(T+C)/2,(A+M)/2)}l.fillStyle="rgba(220, 232, 245, 0.45)",l.font="bold 8px sans-serif",l.textAlign="center";const[c,d]=Ct(-2,-18);l.fillText("MID",c,d);const[h,f]=Ct(11,-38);l.fillText("CT",h,f);const[p,v]=Ct(0,41);l.fillText("T",p,v);const[y,m]=Ct(13,-27);l.fillText("CAT",y,m);const[u,g]=Ct(39,-3);l.fillText("LONG",u,g);const[_,x]=Ct(-36,12);l.fillText("B-TUN",_,x)},[n]),Zt.useEffect(()=>{const a=o.current;if(!a)return;const l=a.getContext("2d");if(l){if(l.clearRect(0,0,Ft,Ft),t.visible&&t.state!=="defused"&&t.state!=="exploded"){const[c,d]=Ct(t.x,t.z),h=t.state==="planted"?.5+.5*Math.sin(performance.now()*.014):1;t.state==="planted"&&(l.beginPath(),l.arc(c,d,6+h*5,0,Math.PI*2),l.strokeStyle=`rgba(255, 58, 48, ${.85-h*.45})`,l.lineWidth=2,l.stroke()),l.fillStyle=t.state==="planted"?"#ff3326":"#f5b942",l.fillRect(c-4,d-4,8,8),l.strokeStyle="#111",l.lineWidth=1,l.strokeRect(c-4,d-4,8,8)}for(const c of e){if(!c.alive)continue;const d=c.team===i;if(!d&&(!c.spotted||c.lastSpottedAlpha<=.02))continue;const[h,f]=Ct(c.x,c.z),p=-Math.sin(c.yaw),v=-Math.cos(c.yaw),y=Math.atan2(v,p);if(c.isPlayer||c.isSpectated){l.save(),l.translate(h,f),l.rotate(y);const m=l.createRadialGradient(0,0,2,0,0,28);m.addColorStop(0,"rgba(255, 255, 255, 0.34)"),m.addColorStop(1,"rgba(255, 255, 255, 0)"),l.fillStyle=m,l.beginPath(),l.moveTo(0,0),l.arc(0,0,28,-.58,.58),l.closePath(),l.fill(),l.restore()}l.save(),l.globalAlpha=d?1:c.lastSpottedAlpha,l.translate(h,f),c.isPlayer||c.isSpectated?(l.rotate(y),l.fillStyle="#47ff8d",l.beginPath(),l.moveTo(6.5,0),l.lineTo(-4.5,-4.5),l.lineTo(-2.5,0),l.lineTo(-4.5,4.5),l.closePath(),l.fill(),l.strokeStyle="#0a1410",l.lineWidth=1.2,l.stroke()):d?(l.fillStyle=i==="CT"?"#5cb8ff":"#f2b84b",l.beginPath(),l.arc(0,0,3.8,0,Math.PI*2),l.fill(),l.strokeStyle="#0d1520",l.lineWidth=1.2,l.stroke(),l.rotate(y),l.strokeStyle="#ffffff",l.lineWidth=1.3,l.beginPath(),l.moveTo(2,0),l.lineTo(6,0),l.stroke()):(l.fillStyle="#ff3b30",l.beginPath(),l.moveTo(0,-4.5),l.lineTo(4.5,0),l.lineTo(0,4.5),l.lineTo(-4.5,0),l.closePath(),l.fill(),l.strokeStyle="#1f0808",l.lineWidth=1,l.stroke()),l.restore()}}},[e,t,i]),L.jsxs("div",{style:{position:"fixed",top:14,left:14,width:Ft+8,background:"rgba(10, 14, 22, 0.84)",border:"1px solid rgba(255,255,255,0.16)",borderRadius:6,padding:4,boxShadow:"0 8px 24px rgba(0,0,0,0.45)",pointerEvents:"none",zIndex:20},children:[L.jsxs("div",{style:{position:"relative",width:Ft,height:Ft,overflow:"hidden",borderRadius:3},children:[L.jsx("canvas",{ref:s,width:Ft,height:Ft,style:{position:"absolute",inset:0}}),L.jsx("canvas",{ref:o,width:Ft,height:Ft,style:{position:"absolute",inset:0}})]}),L.jsxs("div",{style:{marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,fontWeight:600,color:"#d9e4f0",padding:"0 4px",letterSpacing:"0.02em"},children:[L.jsx("span",{style:{color:"#f5b942"},children:"DUST2"}),L.jsx("span",{style:{opacity:.9,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:145},children:r})]})]})};function ry(n){const e=Math.max(0,Math.ceil(n)),t=Math.floor(e/60),i=e%60;return`${t}:${i.toString().padStart(2,"0")}`}const sy=({hud:n,mapData:e})=>{const t=n.scopeLevel>0&&n.alive,i=n.crosshairSpread;return L.jsxs("div",{style:{position:"fixed",inset:0,pointerEvents:"none",zIndex:15},children:[t&&L.jsxs("div",{style:{position:"fixed",inset:0,zIndex:16,background:"radial-gradient(circle at center, transparent 0%, transparent 37%, rgba(0,0,0,0.92) 38.2%, #000 44%)"},children:[L.jsx("div",{style:{position:"absolute",top:"50%",left:0,right:0,height:1.5,background:"rgba(0,0,0,0.88)"}}),L.jsx("div",{style:{position:"absolute",left:"50%",top:0,bottom:0,width:1.5,background:"rgba(0,0,0,0.88)"}}),[-48,-24,24,48].map(r=>L.jsxs(zm.Fragment,{children:[L.jsx("div",{style:{position:"absolute",top:"calc(50% - 5px)",left:`calc(50% + ${r}px)`,width:1.5,height:11,background:"#000"}}),L.jsx("div",{style:{position:"absolute",left:"calc(50% - 5px)",top:`calc(50% + ${r}px)`,height:1.5,width:11,background:"#000"}})]},r)),L.jsx("div",{style:{position:"absolute",left:"50%",top:"50%",width:4,height:4,marginLeft:-2,marginTop:-2,borderRadius:"50%",background:"#ff3030",boxShadow:"0 0 6px #ff3030"}}),L.jsxs("div",{style:{position:"absolute",left:"calc(50% + 90px)",top:"calc(50% + 14px)",fontSize:12,fontFamily:"monospace",color:"rgba(120, 230, 140, 0.85)",fontWeight:700},children:["ZOOM ",n.scopeLevel===2?"4.5x":"2.2x"]})]}),n.damageFlash>.01&&L.jsx("div",{style:{position:"fixed",inset:0,background:`radial-gradient(circle, transparent 42%, rgba(220, 30, 30, ${n.damageFlash*.65}) 100%)`}}),n.damageIndicators.map(r=>L.jsx("div",{style:{position:"fixed",left:"50%",top:"50%",width:140,height:140,marginLeft:-70,marginTop:-70,transform:`rotate(${-r.angle}rad)`},children:L.jsx("div",{style:{width:34,height:6,margin:"0 auto",borderRadius:4,background:"rgba(255, 52, 52, 0.88)",boxShadow:"0 0 10px rgba(255, 40, 40, 0.9)"}})},r.id)),!t&&n.alive&&L.jsxs("div",{style:{position:"fixed",left:"50%",top:"50%"},children:[L.jsx("div",{style:{position:"absolute",left:-1,top:-(i+9),width:2,height:9,background:"#47ff8d",boxShadow:"0 0 2px #000"}}),L.jsx("div",{style:{position:"absolute",left:-1,top:i,width:2,height:9,background:"#47ff8d",boxShadow:"0 0 2px #000"}}),L.jsx("div",{style:{position:"absolute",top:-1,left:-(i+9),width:9,height:2,background:"#47ff8d",boxShadow:"0 0 2px #000"}}),L.jsx("div",{style:{position:"absolute",top:-1,left:i,width:9,height:2,background:"#47ff8d",boxShadow:"0 0 2px #000"}}),L.jsx("div",{style:{position:"absolute",left:-1,top:-1,width:2,height:2,background:"#47ff8d",boxShadow:"0 0 2px #000"}})]}),n.hitMarker.active&&L.jsx("div",{style:{position:"fixed",left:"50%",top:"50%",zIndex:25},children:[45,135,225,315].map(r=>L.jsx("div",{style:{position:"absolute",left:-1,top:-1,width:2,height:n.hitMarker.kill?14:10,background:n.hitMarker.headshot||n.hitMarker.kill?"#ff3b30":"#ffffff",transformOrigin:"50% 0%",transform:`rotate(${r}deg) translateY(5px)`,boxShadow:"0 0 4px rgba(0,0,0,0.9)"}},r))}),L.jsx(iy,{mapData:e,agents:n.minimapAgents,bomb:n.minimapBomb,playerTeam:n.playerTeam,callout:n.callout}),L.jsxs("div",{style:{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",display:"flex",alignItems:"center",gap:10,background:"rgba(10, 14, 22, 0.84)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:8,padding:"6px 16px",boxShadow:"0 6px 24px rgba(0,0,0,0.45)",zIndex:20},children:[L.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[L.jsxs("div",{style:{textAlign:"right"},children:[L.jsxs("div",{style:{fontSize:10,color:"#60a5fa",fontWeight:700},children:["CT 存活 ",n.ctAlive,"/5"]}),L.jsx("div",{style:{display:"flex",gap:3,justifyContent:"flex-end",marginTop:2},children:Array.from({length:5}).map((r,s)=>L.jsx("div",{style:{width:7,height:7,borderRadius:2,background:s<n.ctAlive?"#60a5fa":"rgba(255,255,255,0.14)"}},s))})]}),L.jsx("div",{style:{fontSize:24,fontWeight:900,color:"#60a5fa",minWidth:26,textAlign:"center"},children:n.ctScore})]}),L.jsxs("div",{style:{minWidth:106,textAlign:"center",padding:"2px 12px",borderLeft:"1px solid rgba(255,255,255,0.12)",borderRight:"1px solid rgba(255,255,255,0.12)"},children:[n.roundPhase==="bomb_planted"?L.jsxs("div",{className:"pulse-fast",style:{color:"#ff3b30",fontWeight:900,fontSize:16},children:["💣 ",n.bombPlantedSite,"点 ",n.bombTimeRemaining.toFixed(1),"s"]}):L.jsx("div",{style:{fontSize:20,fontWeight:900,fontVariantNumeric:"tabular-nums",color:"#f8fafc"},children:ry(n.phaseTimer)}),L.jsxs("div",{style:{fontSize:10,fontWeight:700,color:n.isPistolRound?"#f5b942":"#94a3b8"},children:["R",n.roundNumber," ",n.isPistolRound?"· 手枪局":n.roundPhase==="freeze"?"· 购买准备":""]})]}),L.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[L.jsx("div",{style:{fontSize:24,fontWeight:900,color:"#f59e0b",minWidth:26,textAlign:"center"},children:n.tScore}),L.jsxs("div",{children:[L.jsxs("div",{style:{fontSize:10,color:"#f59e0b",fontWeight:700},children:["T 存活 ",n.tAlive,"/5"]}),L.jsx("div",{style:{display:"flex",gap:3,marginTop:2},children:Array.from({length:5}).map((r,s)=>L.jsx("div",{style:{width:7,height:7,borderRadius:2,background:s<n.tAlive?"#f59e0b":"rgba(255,255,255,0.14)"}},s))})]})]})]}),L.jsx("div",{style:{position:"fixed",top:14,right:14,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:5,zIndex:20},children:n.killFeed.map(r=>L.jsxs("div",{className:"fade-in",style:{display:"flex",alignItems:"center",gap:7,background:"rgba(10, 14, 22, 0.82)",border:r.killerName==="YOU"||r.victimName==="YOU"?"1px solid rgba(245, 185, 66, 0.65)":"1px solid rgba(255,255,255,0.1)",borderRadius:5,padding:"4px 10px",fontSize:12,fontWeight:700,boxShadow:"0 4px 12px rgba(0,0,0,0.4)"},children:[L.jsx("span",{style:{color:r.killerTeam==="CT"?"#60a5fa":"#f59e0b"},children:r.killerName}),L.jsx("span",{style:{padding:"1px 6px",borderRadius:3,background:"rgba(255,255,255,0.1)",color:"#e2e8f0",fontSize:10},children:r.weaponName}),r.headshot&&L.jsx("span",{style:{color:"#ff453a",fontSize:11,fontWeight:900},title:"爆头击杀",children:"⊕HS"}),L.jsx("span",{style:{color:r.victimTeam==="CT"?"#60a5fa":"#f59e0b"},children:r.victimName})]},r.id))}),n.announcement&&!n.roundBanner&&L.jsx("div",{style:{position:"fixed",top:86,left:"50%",transform:"translateX(-50%)",background:"rgba(12, 17, 27, 0.85)",border:"1px solid rgba(245, 185, 66, 0.45)",color:"#fef08a",padding:"7px 18px",borderRadius:6,fontSize:13,fontWeight:800,letterSpacing:"0.04em",zIndex:22},children:n.announcement}),n.canBuy&&!n.buyMenuOpen&&n.alive&&!n.isSpectating&&L.jsx("div",{style:{position:"fixed",bottom:94,left:18,background:"rgba(34, 197, 94, 0.2)",border:"1px solid rgba(74, 222, 128, 0.5)",color:"#86efac",padding:"4px 10px",borderRadius:5,fontSize:12,fontWeight:700},children:"🛒 购买区内 · 按 [B] 打开武器购买菜单"}),n.interactionPrompt&&!n.actionProgress&&L.jsx("div",{style:{position:"fixed",bottom:160,left:"50%",transform:"translateX(-50%)",background:"rgba(15, 20, 30, 0.88)",border:"1px solid #f5b942",color:"#fde68a",padding:"8px 18px",borderRadius:6,fontSize:14,fontWeight:800,zIndex:22},children:n.interactionPrompt}),n.actionProgress&&L.jsxs("div",{style:{position:"fixed",bottom:165,left:"50%",transform:"translateX(-50%)",width:260,background:"rgba(10, 14, 22, 0.9)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:8,padding:"10px 14px",textAlign:"center",zIndex:24},children:[L.jsx("div",{style:{fontSize:13,fontWeight:800,color:"#f8fafc",marginBottom:6},children:n.actionProgress.label}),L.jsx("div",{style:{height:8,background:"rgba(255,255,255,0.14)",borderRadius:4,overflow:"hidden"},children:L.jsx("div",{style:{width:`${Math.min(100,n.actionProgress.progress*100)}%`,height:"100%",background:"linear-gradient(90deg, #f59e0b, #ef4444)"}})})]}),n.reloading&&n.alive&&L.jsxs("div",{style:{position:"fixed",top:"calc(50% + 34px)",left:"50%",transform:"translateX(-50%)",width:96,textAlign:"center",zIndex:22},children:[L.jsx("div",{style:{fontSize:10,fontWeight:800,color:"#fde68a",marginBottom:3},children:"换弹中..."}),L.jsx("div",{style:{height:4,background:"rgba(0,0,0,0.65)",borderRadius:2,overflow:"hidden"},children:L.jsx("div",{style:{width:`${Math.min(100,n.reloadProgress*100)}%`,height:"100%",background:"#f5b942"}})})]}),n.isSpectating&&L.jsxs("div",{style:{position:"fixed",bottom:92,left:"50%",transform:"translateX(-50%)",background:"rgba(10, 15, 24, 0.9)",border:"1px solid rgba(96, 165, 250, 0.5)",borderRadius:8,padding:"10px 22px",textAlign:"center",zIndex:25},children:[L.jsxs("div",{style:{fontSize:13,fontWeight:800,color:"#93c5fd"},children:["正在观战队友：",n.spectateTargetName]}),L.jsx("div",{style:{fontSize:12,color:"#e2e8f0",marginTop:4},children:n.canTakeoverBot?L.jsxs(L.Fragment,{children:[L.jsx("span",{style:{color:"#4ade80",fontWeight:800},children:"按 [E] 立即接管操控该 Bot"}),L.jsx("span",{style:{opacity:.75},children:" · 左键/右键/Space 切换队友"})]}):"左键/右键 切换观战队友"})]}),n.roundBanner&&L.jsxs("div",{className:"fade-in",style:{position:"fixed",top:"24%",left:"50%",transform:"translateX(-50%)",background:n.roundBanner.team==="CT"?"linear-gradient(90deg, rgba(29,78,216,0.92), rgba(37,99,235,0.92))":"linear-gradient(90deg, rgba(180,83,9,0.92), rgba(217,119,6,0.92))",border:"2px solid rgba(255,255,255,0.3)",borderRadius:10,padding:"16px 38px",textAlign:"center",boxShadow:"0 18px 50px rgba(0,0,0,0.65)",zIndex:30},children:[L.jsx("div",{style:{fontSize:26,fontWeight:900,letterSpacing:"0.06em",color:"#fff"},children:n.roundBanner.title}),L.jsx("div",{style:{fontSize:13,color:"rgba(255,255,255,0.92)",marginTop:4,fontWeight:600},children:n.roundBanner.subtitle})]}),L.jsxs("div",{style:{position:"fixed",bottom:16,left:16,display:"flex",alignItems:"center",gap:16,background:"rgba(10, 14, 22, 0.84)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:8,padding:"10px 18px",zIndex:20},children:[L.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:6},children:[L.jsx("span",{style:{fontSize:13,color:"#ef4444",fontWeight:800},children:"✚"}),L.jsx("span",{style:{fontSize:32,fontWeight:900,fontVariantNumeric:"tabular-nums",color:n.hp<=25?"#ef4444":"#f8fafc"},children:n.hp})]}),L.jsx("div",{style:{width:1,height:28,background:"rgba(255,255,255,0.14)"}}),L.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:6},children:[L.jsx("span",{style:{fontSize:13,color:"#60a5fa",fontWeight:800},children:n.hasHelmet?"🪖":"🛡"}),L.jsx("span",{style:{fontSize:26,fontWeight:800,fontVariantNumeric:"tabular-nums",color:"#bfdbfe"},children:n.armor})]}),L.jsx("div",{style:{width:1,height:28,background:"rgba(255,255,255,0.14)"}}),L.jsxs("div",{style:{fontSize:22,fontWeight:800,color:"#4ade80",fontVariantNumeric:"tabular-nums"},children:["$",n.money]})]}),L.jsxs("div",{style:{position:"fixed",bottom:16,right:16,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,zIndex:20},children:[L.jsxs("div",{style:{display:"flex",gap:6},children:[n.slots.primary&&L.jsx(Sa,{num:"1",label:Ue[n.slots.primary].shortName,active:n.activeWeapon===n.slots.primary}),n.slots.secondary&&L.jsx(Sa,{num:"2",label:Ue[n.slots.secondary].shortName,active:n.activeWeapon===n.slots.secondary}),L.jsx(Sa,{num:"3",label:"KNIFE",active:n.activeWeapon==="knife"}),n.slots.c4&&L.jsx(Sa,{num:"5",label:"C4",active:n.activeWeapon==="c4",highlight:"#ef4444"})]}),L.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:14,background:"rgba(10, 14, 22, 0.84)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:8,padding:"10px 18px"},children:[L.jsx("span",{style:{fontSize:13,fontWeight:800,color:"#f5b942",letterSpacing:"0.05em"},children:n.activeWeaponName}),n.activeWeapon==="knife"||n.activeWeapon==="c4"?L.jsx("span",{style:{fontSize:24,fontWeight:900,color:"#cbd5e1"},children:"∞"}):L.jsxs("div",{style:{display:"flex",alignItems:"baseline",gap:5,fontVariantNumeric:"tabular-nums"},children:[L.jsx("span",{style:{fontSize:32,fontWeight:900,color:n.ammoInMag<=5?"#f87171":"#f8fafc"},children:n.ammoInMag}),L.jsxs("span",{style:{fontSize:16,fontWeight:700,color:"#94a3b8"},children:["/ ",n.reserveAmmo]})]})]})]})]})},Sa=({num:n,label:e,active:t,highlight:i})=>L.jsxs("div",{style:{padding:"3px 8px",borderRadius:4,fontSize:11,fontWeight:800,background:t?i?`${i}dd`:"rgba(245, 185, 66, 0.92)":"rgba(10, 14, 22, 0.76)",color:t?i?"#fff":"#0f172a":"#94a3b8",border:t?"1px solid rgba(255,255,255,0.4)":"1px solid rgba(255,255,255,0.1)"},children:[L.jsx("span",{style:{opacity:.75,marginRight:4},children:n}),e]}),oy=({hud:n})=>{const e=n.scoreboard.filter(r=>r.team==="CT").sort((r,s)=>s.kills-r.kills||r.deaths-s.deaths),t=n.scoreboard.filter(r=>r.team==="T").sort((r,s)=>s.kills-r.kills||r.deaths-s.deaths),i=(r,s,o,a)=>L.jsxs("div",{style:{marginBottom:14},children:[L.jsxs("div",{style:{display:"flex",justifyContent:"space-between",padding:"6px 12px",background:`${o}22`,borderLeft:`4px solid ${o}`,fontWeight:800,fontSize:13,color:o},children:[L.jsx("span",{children:r}),L.jsxs("span",{children:["胜场: ",s]})]}),L.jsxs("table",{style:{width:"100%",borderCollapse:"collapse",fontSize:12},children:[L.jsx("thead",{children:L.jsxs("tr",{style:{color:"#94a3b8",borderBottom:"1px solid rgba(255,255,255,0.1)",textAlign:"left"},children:[L.jsx("th",{style:{padding:"6px 10px"},children:"玩家"}),L.jsx("th",{style:{padding:"6px 8px"},children:"状态"}),L.jsx("th",{style:{padding:"6px 8px"},children:"武器"}),L.jsx("th",{style:{padding:"6px 8px",textAlign:"right"},children:"资金"}),L.jsx("th",{style:{padding:"6px 8px",textAlign:"right"},children:"击杀"}),L.jsx("th",{style:{padding:"6px 10px",textAlign:"right"},children:"死亡"})]})}),L.jsx("tbody",{children:a.map(l=>L.jsxs("tr",{style:{borderBottom:"1px solid rgba(255,255,255,0.05)",background:l.isHuman?"rgba(255,255,255,0.08)":"transparent",opacity:l.alive?1:.48},children:[L.jsxs("td",{style:{padding:"6px 10px",fontWeight:l.isHuman?800:500},children:[l.name,l.hasC4&&L.jsx("span",{style:{marginLeft:6,padding:"1px 5px",borderRadius:3,background:"#dc2626",color:"#fff",fontSize:10,fontWeight:800},children:"C4"})]}),L.jsx("td",{style:{padding:"6px 8px",color:l.alive?"#4ade80":"#ef4444"},children:l.alive?`${l.hp} HP`:"阵亡"}),L.jsx("td",{style:{padding:"6px 8px",color:"#cbd5e1"},children:l.alive?l.weaponShort:"-"}),L.jsxs("td",{style:{padding:"6px 8px",textAlign:"right",color:"#86efac"},children:["$",l.money]}),L.jsx("td",{style:{padding:"6px 8px",textAlign:"right",fontWeight:700},children:l.kills}),L.jsx("td",{style:{padding:"6px 10px",textAlign:"right"},children:l.deaths})]},l.id))})]})]});return L.jsx("div",{style:{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none",zIndex:45},children:L.jsxs("div",{style:{width:640,maxWidth:"94vw",background:"rgba(11, 16, 24, 0.92)",border:"1px solid rgba(255,255,255,0.16)",borderRadius:10,padding:18,boxShadow:"0 20px 60px rgba(0,0,0,0.65)"},children:[L.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,borderBottom:"1px solid rgba(255,255,255,0.1)",paddingBottom:8},children:[L.jsx("span",{style:{fontWeight:800,fontSize:16,letterSpacing:"0.06em"},children:"DUST2 // 5v5 战绩面板"}),L.jsxs("span",{style:{fontSize:12,color:"#f5b942",fontWeight:700},children:["第 ",n.roundNumber," 回合 ",n.isPistolRound?"· 手枪局":""]})]}),i("反恐精英 (CT)",n.ctScore,"#60a5fa",e),i("恐怖分子 (T)",n.tScore,"#f59e0b",t)]})})},ay=({hud:n,onStart:e,onResume:t,onRestart:i,onSensitivityChange:r,onMuteToggle:s})=>{const[o,a]=Zt.useState("CT"),[l,c]=Zt.useState("competitive"),[d,h]=Zt.useState(rs.DEFAULT_SENSITIVITY),[f,p]=Zt.useState(!1),v=n.started&&n.paused;return L.jsx("div",{style:{position:"fixed",inset:0,background:v?"rgba(8, 12, 18, 0.72)":"radial-gradient(circle at 50% 35%, rgba(28, 36, 48, 0.72), rgba(8, 11, 18, 0.90))",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:60},children:L.jsxs("div",{style:{width:600,maxWidth:"94vw",background:"linear-gradient(160deg, rgba(18, 24, 34, 0.96), rgba(10, 14, 22, 0.98))",border:"1px solid rgba(255,255,255,0.16)",borderRadius:14,padding:28,boxShadow:"0 28px 80px rgba(0,0,0,0.7)"},children:[L.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18},children:[L.jsxs("div",{children:[L.jsx("div",{style:{fontSize:11,fontWeight:700,color:"#f5b942",letterSpacing:"0.16em"},children:"THREE.JS PROCEDURAL TACTICAL FPS"}),L.jsxs("h1",{style:{fontSize:30,fontWeight:900,letterSpacing:"0.04em",marginTop:2},children:["DE_DUST2 ",L.jsx("span",{style:{color:"#f5b942"},children:"5v5"})]}),L.jsx("div",{style:{fontSize:12,color:"#94a3b8",marginTop:4},children:"全区域复刻：T/CT 出生点 · A大 · A点 · 中门 · 猫道 · B洞 · B点"})]}),L.jsx("button",{onClick:()=>{const y=!f;p(y),s(y)},style:{padding:"6px 12px",borderRadius:6,border:"1px solid rgba(255,255,255,0.16)",background:f?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.08)",color:"#e2e8f0",fontSize:12,cursor:"pointer",fontWeight:600},children:f?"🔇 已静音":"🔊 音效开启"})]}),v?L.jsxs("div",{style:{marginBottom:18,padding:12,borderRadius:8,background:"rgba(255,255,255,0.04)"},children:[L.jsx("div",{style:{fontSize:14,fontWeight:700},children:"游戏已暂停"}),L.jsxs("div",{style:{fontSize:12,color:"#94a3b8",marginTop:4},children:["当前比分：CT ",n.ctScore," : ",n.tScore," T · 第 ",n.roundNumber," 回合"]})]}):L.jsxs(L.Fragment,{children:[L.jsxs("div",{style:{marginBottom:14},children:[L.jsx("div",{style:{fontSize:12,fontWeight:700,color:"#cbd5e1",marginBottom:6},children:"选择阵营 (1 玩家 + 4 AI 队友 vs 5 AI 敌人)"}),L.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[L.jsxs("button",{onClick:()=>a("CT"),style:{padding:"12px 14px",borderRadius:8,border:o==="CT"?"2px solid #60a5fa":"1px solid rgba(255,255,255,0.12)",background:o==="CT"?"rgba(59, 130, 246, 0.2)":"rgba(255,255,255,0.04)",color:"#f8fafc",cursor:"pointer",textAlign:"left"},children:[L.jsx("div",{style:{fontWeight:800,color:"#60a5fa",fontSize:15},children:"反恐精英 (CT)"}),L.jsx("div",{style:{fontSize:11,color:"#94a3b8",marginTop:2},children:"默认 USP-S · 守卫 A/B 点并拆除 C4"})]}),L.jsxs("button",{onClick:()=>a("T"),style:{padding:"12px 14px",borderRadius:8,border:o==="T"?"2px solid #f59e0b":"1px solid rgba(255,255,255,0.12)",background:o==="T"?"rgba(245, 158, 11, 0.2)":"rgba(255,255,255,0.04)",color:"#f8fafc",cursor:"pointer",textAlign:"left"},children:[L.jsx("div",{style:{fontWeight:800,color:"#f59e0b",fontSize:15},children:"恐怖分子 (T)"}),L.jsx("div",{style:{fontSize:11,color:"#94a3b8",marginTop:2},children:"默认 Glock-18 · 携带 C4 突入 A/B 点安放"})]})]})]}),L.jsxs("div",{style:{marginBottom:16},children:[L.jsx("div",{style:{fontSize:12,fontWeight:700,color:"#cbd5e1",marginBottom:6},children:"开局规则"}),L.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10},children:[L.jsxs("button",{onClick:()=>c("competitive"),style:{padding:"10px 12px",borderRadius:8,border:l==="competitive"?"2px solid #4ade80":"1px solid rgba(255,255,255,0.12)",background:l==="competitive"?"rgba(34, 197, 94, 0.16)":"rgba(255,255,255,0.04)",color:"#f8fafc",cursor:"pointer",textAlign:"left"},children:[L.jsx("div",{style:{fontWeight:800,fontSize:13},children:"标准竞技（手枪局开局）"}),L.jsx("div",{style:{fontSize:11,color:"#94a3b8",marginTop:2},children:"R1 全员默认手枪+手枪局护甲，R2 起购买步枪/AWP"})]}),L.jsxs("button",{onClick:()=>c("full_buy"),style:{padding:"10px 12px",borderRadius:8,border:l==="full_buy"?"2px solid #f5b942":"1px solid rgba(255,255,255,0.12)",background:l==="full_buy"?"rgba(245, 185, 66, 0.16)":"rgba(255,255,255,0.04)",color:"#f8fafc",cursor:"pointer",textAlign:"left"},children:[L.jsx("div",{style:{fontWeight:800,fontSize:13},children:"全枪械实战（即刻满配）"}),L.jsx("div",{style:{fontSize:11,color:"#94a3b8",marginTop:2},children:"开局 $5500，立即按 [B] 体验 AK-47 / M4A4 / AWP / 沙鹰"})]})]})]})]}),L.jsxs("div",{style:{marginBottom:18,display:"flex",alignItems:"center",gap:12},children:[L.jsx("span",{style:{fontSize:12,color:"#cbd5e1",whiteSpace:"nowrap"},children:"鼠标灵敏度"}),L.jsx("input",{type:"range",min:8e-4,max:.005,step:2e-4,value:d,onChange:y=>{const m=parseFloat(y.target.value);h(m),r(m)},style:{flex:1,accentColor:"#f5b942"}}),L.jsx("span",{style:{fontSize:12,color:"#f5b942",width:38,textAlign:"right"},children:(d*1e3).toFixed(1)})]}),L.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"5px 14px",fontSize:11,color:"#9fb2c8",background:"rgba(0,0,0,0.28)",padding:"10px 12px",borderRadius:8,marginBottom:20},children:[L.jsxs("div",{children:[L.jsx("b",{style:{color:"#f1f5f9"},children:"WASD / Space / Ctrl"})," 移动 / 跳跃 / 蹲下"]}),L.jsxs("div",{children:[L.jsx("b",{style:{color:"#f1f5f9"},children:"左键 / 右键"})," 开火 / AWP双倍开镜 / 刀重击"]}),L.jsxs("div",{children:[L.jsx("b",{style:{color:"#f1f5f9"},children:"1 / 2 / 3 / 5 / 滚轮"})," 切枪 (主/副/刀/C4)"]}),L.jsxs("div",{children:[L.jsx("b",{style:{color:"#f1f5f9"},children:"R / B / G"})," 换弹 / 购买菜单 / 丢弃C4"]}),L.jsxs("div",{children:[L.jsx("b",{style:{color:"#f1f5f9"},children:"长按 E"})," 安放C4 / 拆除C4 / 阵亡接管Bot"]}),L.jsxs("div",{children:[L.jsx("b",{style:{color:"#f1f5f9"},children:"Tab / Shift"})," 战绩板 / 静步走"]})]}),L.jsx("div",{style:{display:"flex",gap:10},children:v?L.jsxs(L.Fragment,{children:[L.jsx("button",{onClick:t,style:{flex:1,padding:"12px 18px",borderRadius:8,border:"none",background:"#f5b942",color:"#0f172a",fontWeight:900,fontSize:14,cursor:"pointer"},children:"继续对战"}),L.jsx("button",{onClick:i,style:{padding:"12px 16px",borderRadius:8,border:"1px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.08)",color:"#f1f5f9",fontWeight:700,fontSize:13,cursor:"pointer"},children:"重新开局"})]}):L.jsx("button",{onClick:()=>e(o,l),style:{flex:1,padding:"13px 20px",borderRadius:8,border:"none",background:"linear-gradient(90deg, #f59e0b, #fbbf24)",color:"#0f172a",fontWeight:900,fontSize:15,letterSpacing:"0.06em",cursor:"pointer"},children:"进入 DUST2 战场 (锁定鼠标视角)"})})]})})};/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Bh="170",ly=0,yp=1,cy=2,Og=1,Bg=2,gi=3,or=0,sn=1,xi=2,nr=0,Es=1,Sp=2,Mp=3,wp=4,uy=5,Mr=100,dy=101,hy=102,fy=103,py=104,my=200,gy=201,_y=202,vy=203,sd=204,od=205,xy=206,yy=207,Sy=208,My=209,wy=210,Ey=211,Ty=212,Ay=213,by=214,ad=0,ld=1,cd=2,Ns=3,ud=4,dd=5,hd=6,fd=7,Hg=0,Cy=1,Ry=2,ir=0,Py=1,Ly=2,Dy=3,Vg=4,Iy=5,Ny=6,Uy=7,Gg=300,Us=301,zs=302,pd=303,md=304,ec=306,Go=1e3,br=1001,gd=1002,Zn=1003,zy=1004,Ma=1005,ri=1006,Dc=1007,Cr=1008,Pi=1009,Wg=1010,Xg=1011,Wo=1012,Hh=1013,Fr=1014,Mi=1015,Zo=1016,Vh=1017,Gh=1018,Fs=1020,jg=35902,Yg=1021,qg=1022,qn=1023,$g=1024,Kg=1025,Ts=1026,ks=1027,Zg=1028,Wh=1029,Qg=1030,Xh=1031,jh=1033,il=33776,rl=33777,sl=33778,ol=33779,_d=35840,vd=35841,xd=35842,yd=35843,Sd=36196,Md=37492,wd=37496,Ed=37808,Td=37809,Ad=37810,bd=37811,Cd=37812,Rd=37813,Pd=37814,Ld=37815,Dd=37816,Id=37817,Nd=37818,Ud=37819,zd=37820,Fd=37821,al=36492,kd=36494,Od=36495,Jg=36283,Bd=36284,Hd=36285,Vd=36286,Fy=3200,ky=3201,e_=0,Oy=1,Xi="",nn="srgb",Gs="srgb-linear",tc="linear",ct="srgb",Wr=7680,Ep=519,By=512,Hy=513,Vy=514,t_=515,Gy=516,Wy=517,Xy=518,jy=519,Tp=35044,Ap="300 es",wi=2e3,Il=2001;class Ws{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ic=Math.PI/180,Gd=180/Math.PI;function Qo(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(qt[n&255]+qt[n>>8&255]+qt[n>>16&255]+qt[n>>24&255]+"-"+qt[e&255]+qt[e>>8&255]+"-"+qt[e>>16&15|64]+qt[e>>24&255]+"-"+qt[t&63|128]+qt[t>>8&255]+"-"+qt[t>>16&255]+qt[t>>24&255]+qt[i&255]+qt[i>>8&255]+qt[i>>16&255]+qt[i>>24&255]).toLowerCase()}function fn(n,e,t){return Math.max(e,Math.min(t,n))}function Yy(n,e){return(n%e+e)%e}function Nc(n,e,t){return(1-t)*n+t*e}function io(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function un(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}class $e{constructor(e=0,t=0){$e.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(fn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Oe{constructor(e,t,i,r,s,o,a,l,c){Oe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){const d=this.elements;return d[0]=e,d[1]=r,d[2]=a,d[3]=t,d[4]=s,d[5]=l,d[6]=i,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],d=i[4],h=i[7],f=i[2],p=i[5],v=i[8],y=r[0],m=r[3],u=r[6],g=r[1],_=r[4],x=r[7],w=r[2],T=r[5],A=r[8];return s[0]=o*y+a*g+l*w,s[3]=o*m+a*_+l*T,s[6]=o*u+a*x+l*A,s[1]=c*y+d*g+h*w,s[4]=c*m+d*_+h*T,s[7]=c*u+d*x+h*A,s[2]=f*y+p*g+v*w,s[5]=f*m+p*_+v*T,s[8]=f*u+p*x+v*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8];return t*o*d-t*a*c-i*s*d+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8],h=d*o-a*c,f=a*l-d*s,p=c*s-o*l,v=t*h+i*f+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/v;return e[0]=h*y,e[1]=(r*c-d*i)*y,e[2]=(a*i-r*o)*y,e[3]=f*y,e[4]=(d*t-r*l)*y,e[5]=(r*s-a*t)*y,e[6]=p*y,e[7]=(i*l-c*t)*y,e[8]=(o*t-i*s)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Uc.makeScale(e,t)),this}rotate(e){return this.premultiply(Uc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Uc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Uc=new Oe;function n_(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Nl(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function qy(){const n=Nl("canvas");return n.style.display="block",n}const bp={};function mo(n){n in bp||(bp[n]=!0,console.warn(n))}function $y(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}function Ky(n){const e=n.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function Zy(n){const e=n.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Je={enabled:!0,workingColorSpace:Gs,spaces:{},convert:function(n,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===ct&&(n.r=Ti(n.r),n.g=Ti(n.g),n.b=Ti(n.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(n.applyMatrix3(this.spaces[e].toXYZ),n.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===ct&&(n.r=As(n.r),n.g=As(n.g),n.b=As(n.b))),n},fromWorkingColorSpace:function(n,e){return this.convert(n,this.workingColorSpace,e)},toWorkingColorSpace:function(n,e){return this.convert(n,e,this.workingColorSpace)},getPrimaries:function(n){return this.spaces[n].primaries},getTransfer:function(n){return n===Xi?tc:this.spaces[n].transfer},getLuminanceCoefficients:function(n,e=this.workingColorSpace){return n.fromArray(this.spaces[e].luminanceCoefficients)},define:function(n){Object.assign(this.spaces,n)},_getMatrix:function(n,e,t){return n.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(n){return this.spaces[n].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(n=this.workingColorSpace){return this.spaces[n].workingColorSpaceConfig.unpackColorSpace}};function Ti(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function As(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}const Cp=[.64,.33,.3,.6,.15,.06],Rp=[.2126,.7152,.0722],Pp=[.3127,.329],Lp=new Oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Dp=new Oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Je.define({[Gs]:{primaries:Cp,whitePoint:Pp,transfer:tc,toXYZ:Lp,fromXYZ:Dp,luminanceCoefficients:Rp,workingColorSpaceConfig:{unpackColorSpace:nn},outputColorSpaceConfig:{drawingBufferColorSpace:nn}},[nn]:{primaries:Cp,whitePoint:Pp,transfer:ct,toXYZ:Lp,fromXYZ:Dp,luminanceCoefficients:Rp,outputColorSpaceConfig:{drawingBufferColorSpace:nn}}});let Xr;class Qy{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Xr===void 0&&(Xr=Nl("canvas")),Xr.width=e.width,Xr.height=e.height;const i=Xr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Xr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Nl("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Ti(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Ti(t[i]/255)*255):t[i]=Ti(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Jy=0;class i_{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Jy++}),this.uuid=Qo(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(zc(r[o].image)):s.push(zc(r[o]))}else s=zc(r);i.url=s}return t||(e.images[this.uuid]=i),i}}function zc(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Qy.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let eS=0;class on extends Ws{constructor(e=on.DEFAULT_IMAGE,t=on.DEFAULT_MAPPING,i=br,r=br,s=ri,o=Cr,a=qn,l=Pi,c=on.DEFAULT_ANISOTROPY,d=Xi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:eS++}),this.uuid=Qo(),this.name="",this.source=new i_(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new $e(0,0),this.repeat=new $e(1,1),this.center=new $e(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Go:e.x=e.x-Math.floor(e.x);break;case br:e.x=e.x<0?0:1;break;case gd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Go:e.y=e.y-Math.floor(e.y);break;case br:e.y=e.y<0?0:1;break;case gd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}on.DEFAULT_IMAGE=null;on.DEFAULT_MAPPING=Gg;on.DEFAULT_ANISOTROPY=1;class ut{constructor(e=0,t=0,i=0,r=1){ut.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s;const l=e.elements,c=l[0],d=l[4],h=l[8],f=l[1],p=l[5],v=l[9],y=l[2],m=l[6],u=l[10];if(Math.abs(d-f)<.01&&Math.abs(h-y)<.01&&Math.abs(v-m)<.01){if(Math.abs(d+f)<.1&&Math.abs(h+y)<.1&&Math.abs(v+m)<.1&&Math.abs(c+p+u-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const _=(c+1)/2,x=(p+1)/2,w=(u+1)/2,T=(d+f)/4,A=(h+y)/4,C=(v+m)/4;return _>x&&_>w?_<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(_),r=T/i,s=A/i):x>w?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=T/r,s=C/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=A/s,r=C/s),this.set(i,r,s,t),this}let g=Math.sqrt((m-v)*(m-v)+(h-y)*(h-y)+(f-d)*(f-d));return Math.abs(g)<.001&&(g=1),this.x=(m-v)/g,this.y=(h-y)/g,this.z=(f-d)/g,this.w=Math.acos((c+p+u-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class tS extends Ws{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ut(0,0,e,t),this.scissorTest=!1,this.viewport=new ut(0,0,e,t);const r={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ri,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new on(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new i_(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kr extends tS{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class r_ extends on{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zn,this.minFilter=Zn,this.wrapR=br,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class nS extends on{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=Zn,this.minFilter=Zn,this.wrapR=br,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Jo{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],d=i[r+2],h=i[r+3];const f=s[o+0],p=s[o+1],v=s[o+2],y=s[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h;return}if(a===1){e[t+0]=f,e[t+1]=p,e[t+2]=v,e[t+3]=y;return}if(h!==y||l!==f||c!==p||d!==v){let m=1-a;const u=l*f+c*p+d*v+h*y,g=u>=0?1:-1,_=1-u*u;if(_>Number.EPSILON){const w=Math.sqrt(_),T=Math.atan2(w,u*g);m=Math.sin(m*T)/w,a=Math.sin(a*T)/w}const x=a*g;if(l=l*m+f*x,c=c*m+p*x,d=d*m+v*x,h=h*m+y*x,m===1-a){const w=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=w,c*=w,d*=w,h*=w}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],d=i[r+3],h=s[o],f=s[o+1],p=s[o+2],v=s[o+3];return e[t]=a*v+d*h+l*p-c*f,e[t+1]=l*v+d*f+c*h-a*p,e[t+2]=c*v+d*p+a*f-l*h,e[t+3]=d*v-a*h-l*f-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),d=a(r/2),h=a(s/2),f=l(i/2),p=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=f*d*h+c*p*v,this._y=c*p*h-f*d*v,this._z=c*d*v+f*p*h,this._w=c*d*h-f*p*v;break;case"YXZ":this._x=f*d*h+c*p*v,this._y=c*p*h-f*d*v,this._z=c*d*v-f*p*h,this._w=c*d*h+f*p*v;break;case"ZXY":this._x=f*d*h-c*p*v,this._y=c*p*h+f*d*v,this._z=c*d*v+f*p*h,this._w=c*d*h-f*p*v;break;case"ZYX":this._x=f*d*h-c*p*v,this._y=c*p*h+f*d*v,this._z=c*d*v-f*p*h,this._w=c*d*h+f*p*v;break;case"YZX":this._x=f*d*h+c*p*v,this._y=c*p*h+f*d*v,this._z=c*d*v-f*p*h,this._w=c*d*h-f*p*v;break;case"XZY":this._x=f*d*h-c*p*v,this._y=c*p*h-f*d*v,this._z=c*d*v+f*p*h,this._w=c*d*h+f*p*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],d=t[6],h=t[10],f=i+a+h;if(f>0){const p=.5/Math.sqrt(f+1);this._w=.25/p,this._x=(d-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>h){const p=2*Math.sqrt(1+i-a-h);this._w=(d-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-i-h);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(fn(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+o*a+r*c-s*l,this._y=r*d+o*l+s*a-i*c,this._z=s*d+o*c+i*l-r*a,this._w=o*d-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,o=this._w;let a=o*e._w+i*e._x+r*e._y+s*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=i,this._y=r,this._z=s,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*i+t*this._x,this._y=p*r+t*this._y,this._z=p*s+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,a),h=Math.sin((1-t)*d)/c,f=Math.sin(t*d)/c;return this._w=o*h+this._w*f,this._x=i*h+this._x*f,this._y=r*h+this._y*f,this._z=s*h+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class I{constructor(e=0,t=0,i=0){I.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ip.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ip.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),d=2*(a*t-s*r),h=2*(s*i-o*t);return this.x=t+l*c+o*h-a*d,this.y=i+l*d+a*c-s*h,this.z=r+l*h+s*d-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Fc.copy(this).projectOnVector(e),this.sub(Fc)}reflect(e){return this.sub(Fc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(fn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Fc=new I,Ip=new Jo;class ea{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Hn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Hn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=Hn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Hn):Hn.fromBufferAttribute(s,o),Hn.applyMatrix4(e.matrixWorld),this.expandByPoint(Hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wa.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wa.copy(i.boundingBox)),wa.applyMatrix4(e.matrixWorld),this.union(wa)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Hn),Hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ro),Ea.subVectors(this.max,ro),jr.subVectors(e.a,ro),Yr.subVectors(e.b,ro),qr.subVectors(e.c,ro),Ui.subVectors(Yr,jr),zi.subVectors(qr,Yr),hr.subVectors(jr,qr);let t=[0,-Ui.z,Ui.y,0,-zi.z,zi.y,0,-hr.z,hr.y,Ui.z,0,-Ui.x,zi.z,0,-zi.x,hr.z,0,-hr.x,-Ui.y,Ui.x,0,-zi.y,zi.x,0,-hr.y,hr.x,0];return!kc(t,jr,Yr,qr,Ea)||(t=[1,0,0,0,1,0,0,0,1],!kc(t,jr,Yr,qr,Ea))?!1:(Ta.crossVectors(Ui,zi),t=[Ta.x,Ta.y,Ta.z],kc(t,jr,Yr,qr,Ea))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Hn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(di),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const di=[new I,new I,new I,new I,new I,new I,new I,new I],Hn=new I,wa=new ea,jr=new I,Yr=new I,qr=new I,Ui=new I,zi=new I,hr=new I,ro=new I,Ea=new I,Ta=new I,fr=new I;function kc(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){fr.fromArray(n,s);const a=r.x*Math.abs(fr.x)+r.y*Math.abs(fr.y)+r.z*Math.abs(fr.z),l=e.dot(fr),c=t.dot(fr),d=i.dot(fr);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>a)return!1}return!0}const iS=new ea,so=new I,Oc=new I;class nc{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):iS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;so.subVectors(e,this.center);const t=so.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(so,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Oc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(so.copy(e.center).add(Oc)),this.expandByPoint(so.copy(e.center).sub(Oc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const hi=new I,Bc=new I,Aa=new I,Fi=new I,Hc=new I,ba=new I,Vc=new I;class Yh{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,hi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=hi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(hi.copy(this.origin).addScaledVector(this.direction,t),hi.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){Bc.copy(e).add(t).multiplyScalar(.5),Aa.copy(t).sub(e).normalize(),Fi.copy(this.origin).sub(Bc);const s=e.distanceTo(t)*.5,o=-this.direction.dot(Aa),a=Fi.dot(this.direction),l=-Fi.dot(Aa),c=Fi.lengthSq(),d=Math.abs(1-o*o);let h,f,p,v;if(d>0)if(h=o*l-a,f=o*a-l,v=s*d,h>=0)if(f>=-v)if(f<=v){const y=1/d;h*=y,f*=y,p=h*(h+o*f+2*a)+f*(o*h+f+2*l)+c}else f=s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f=-s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;else f<=-v?(h=Math.max(0,-(-o*s+a)),f=h>0?-s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c):f<=v?(h=0,f=Math.min(Math.max(-s,-l),s),p=f*(f+2*l)+c):(h=Math.max(0,-(o*s+a)),f=h>0?s:Math.min(Math.max(-s,-l),s),p=-h*h+f*(f+2*l)+c);else f=o>0?-s:s,h=Math.max(0,-(o*f+a)),p=-h*h+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Bc).addScaledVector(Aa,f),p}intersectSphere(e,t){hi.subVectors(e.center,this.origin);const i=hi.dot(this.direction),r=hi.dot(hi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,r=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,r=(e.min.x-f.x)*c),d>=0?(s=(e.min.y-f.y)*d,o=(e.max.y-f.y)*d):(s=(e.max.y-f.y)*d,o=(e.min.y-f.y)*d),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-f.z)*h,l=(e.max.z-f.z)*h):(a=(e.max.z-f.z)*h,l=(e.min.z-f.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,hi)!==null}intersectTriangle(e,t,i,r,s){Hc.subVectors(t,e),ba.subVectors(i,e),Vc.crossVectors(Hc,ba);let o=this.direction.dot(Vc),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;Fi.subVectors(this.origin,e);const l=a*this.direction.dot(ba.crossVectors(Fi,ba));if(l<0)return null;const c=a*this.direction.dot(Hc.cross(Fi));if(c<0||l+c>o)return null;const d=-a*Fi.dot(Vc);return d<0?null:this.at(d/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yt{constructor(e,t,i,r,s,o,a,l,c,d,h,f,p,v,y,m){yt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,d,h,f,p,v,y,m)}set(e,t,i,r,s,o,a,l,c,d,h,f,p,v,y,m){const u=this.elements;return u[0]=e,u[4]=t,u[8]=i,u[12]=r,u[1]=s,u[5]=o,u[9]=a,u[13]=l,u[2]=c,u[6]=d,u[10]=h,u[14]=f,u[3]=p,u[7]=v,u[11]=y,u[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new yt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,r=1/$r.setFromMatrixColumn(e,0).length(),s=1/$r.setFromMatrixColumn(e,1).length(),o=1/$r.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),d=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){const f=o*d,p=o*h,v=a*d,y=a*h;t[0]=l*d,t[4]=-l*h,t[8]=c,t[1]=p+v*c,t[5]=f-y*c,t[9]=-a*l,t[2]=y-f*c,t[6]=v+p*c,t[10]=o*l}else if(e.order==="YXZ"){const f=l*d,p=l*h,v=c*d,y=c*h;t[0]=f+y*a,t[4]=v*a-p,t[8]=o*c,t[1]=o*h,t[5]=o*d,t[9]=-a,t[2]=p*a-v,t[6]=y+f*a,t[10]=o*l}else if(e.order==="ZXY"){const f=l*d,p=l*h,v=c*d,y=c*h;t[0]=f-y*a,t[4]=-o*h,t[8]=v+p*a,t[1]=p+v*a,t[5]=o*d,t[9]=y-f*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const f=o*d,p=o*h,v=a*d,y=a*h;t[0]=l*d,t[4]=v*c-p,t[8]=f*c+y,t[1]=l*h,t[5]=y*c+f,t[9]=p*c-v,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const f=o*l,p=o*c,v=a*l,y=a*c;t[0]=l*d,t[4]=y-f*h,t[8]=v*h+p,t[1]=h,t[5]=o*d,t[9]=-a*d,t[2]=-c*d,t[6]=p*h+v,t[10]=f-y*h}else if(e.order==="XZY"){const f=o*l,p=o*c,v=a*l,y=a*c;t[0]=l*d,t[4]=-h,t[8]=c*d,t[1]=f*h+y,t[5]=o*d,t[9]=p*h-v,t[2]=v*h-p,t[6]=a*d,t[10]=y*h+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(rS,e,sS)}lookAt(e,t,i){const r=this.elements;return xn.subVectors(e,t),xn.lengthSq()===0&&(xn.z=1),xn.normalize(),ki.crossVectors(i,xn),ki.lengthSq()===0&&(Math.abs(i.z)===1?xn.x+=1e-4:xn.z+=1e-4,xn.normalize(),ki.crossVectors(i,xn)),ki.normalize(),Ca.crossVectors(xn,ki),r[0]=ki.x,r[4]=Ca.x,r[8]=xn.x,r[1]=ki.y,r[5]=Ca.y,r[9]=xn.y,r[2]=ki.z,r[6]=Ca.z,r[10]=xn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],d=i[1],h=i[5],f=i[9],p=i[13],v=i[2],y=i[6],m=i[10],u=i[14],g=i[3],_=i[7],x=i[11],w=i[15],T=r[0],A=r[4],C=r[8],M=r[12],S=r[1],P=r[5],B=r[9],z=r[13],V=r[2],Y=r[6],X=r[10],J=r[14],D=r[3],$=r[7],ee=r[11],ce=r[15];return s[0]=o*T+a*S+l*V+c*D,s[4]=o*A+a*P+l*Y+c*$,s[8]=o*C+a*B+l*X+c*ee,s[12]=o*M+a*z+l*J+c*ce,s[1]=d*T+h*S+f*V+p*D,s[5]=d*A+h*P+f*Y+p*$,s[9]=d*C+h*B+f*X+p*ee,s[13]=d*M+h*z+f*J+p*ce,s[2]=v*T+y*S+m*V+u*D,s[6]=v*A+y*P+m*Y+u*$,s[10]=v*C+y*B+m*X+u*ee,s[14]=v*M+y*z+m*J+u*ce,s[3]=g*T+_*S+x*V+w*D,s[7]=g*A+_*P+x*Y+w*$,s[11]=g*C+_*B+x*X+w*ee,s[15]=g*M+_*z+x*J+w*ce,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],d=e[2],h=e[6],f=e[10],p=e[14],v=e[3],y=e[7],m=e[11],u=e[15];return v*(+s*l*h-r*c*h-s*a*f+i*c*f+r*a*p-i*l*p)+y*(+t*l*p-t*c*f+s*o*f-r*o*p+r*c*d-s*l*d)+m*(+t*c*h-t*a*p-s*o*h+i*o*p+s*a*d-i*c*d)+u*(-r*a*d-t*l*h+t*a*f+r*o*h-i*o*f+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],d=e[8],h=e[9],f=e[10],p=e[11],v=e[12],y=e[13],m=e[14],u=e[15],g=h*m*c-y*f*c+y*l*p-a*m*p-h*l*u+a*f*u,_=v*f*c-d*m*c-v*l*p+o*m*p+d*l*u-o*f*u,x=d*y*c-v*h*c+v*a*p-o*y*p-d*a*u+o*h*u,w=v*h*l-d*y*l-v*a*f+o*y*f+d*a*m-o*h*m,T=t*g+i*_+r*x+s*w;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/T;return e[0]=g*A,e[1]=(y*f*s-h*m*s-y*r*p+i*m*p+h*r*u-i*f*u)*A,e[2]=(a*m*s-y*l*s+y*r*c-i*m*c-a*r*u+i*l*u)*A,e[3]=(h*l*s-a*f*s-h*r*c+i*f*c+a*r*p-i*l*p)*A,e[4]=_*A,e[5]=(d*m*s-v*f*s+v*r*p-t*m*p-d*r*u+t*f*u)*A,e[6]=(v*l*s-o*m*s-v*r*c+t*m*c+o*r*u-t*l*u)*A,e[7]=(o*f*s-d*l*s+d*r*c-t*f*c-o*r*p+t*l*p)*A,e[8]=x*A,e[9]=(v*h*s-d*y*s-v*i*p+t*y*p+d*i*u-t*h*u)*A,e[10]=(o*y*s-v*a*s+v*i*c-t*y*c-o*i*u+t*a*u)*A,e[11]=(d*a*s-o*h*s-d*i*c+t*h*c+o*i*p-t*a*p)*A,e[12]=w*A,e[13]=(d*y*r-v*h*r+v*i*f-t*y*f-d*i*m+t*h*m)*A,e[14]=(v*a*r-o*y*r-v*i*l+t*y*l+o*i*m-t*a*m)*A,e[15]=(o*h*r-d*a*r+d*i*l-t*h*l-o*i*f+t*a*f)*A,this}scale(e){const t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,d=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,d*a+i,d*l-r*o,0,c*l-r*a,d*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){const r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,d=o+o,h=a+a,f=s*c,p=s*d,v=s*h,y=o*d,m=o*h,u=a*h,g=l*c,_=l*d,x=l*h,w=i.x,T=i.y,A=i.z;return r[0]=(1-(y+u))*w,r[1]=(p+x)*w,r[2]=(v-_)*w,r[3]=0,r[4]=(p-x)*T,r[5]=(1-(f+u))*T,r[6]=(m+g)*T,r[7]=0,r[8]=(v+_)*A,r[9]=(m-g)*A,r[10]=(1-(f+y))*A,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){const r=this.elements;let s=$r.set(r[0],r[1],r[2]).length();const o=$r.set(r[4],r[5],r[6]).length(),a=$r.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Vn.copy(this);const c=1/s,d=1/o,h=1/a;return Vn.elements[0]*=c,Vn.elements[1]*=c,Vn.elements[2]*=c,Vn.elements[4]*=d,Vn.elements[5]*=d,Vn.elements[6]*=d,Vn.elements[8]*=h,Vn.elements[9]*=h,Vn.elements[10]*=h,t.setFromRotationMatrix(Vn),i.x=s,i.y=o,i.z=a,this}makePerspective(e,t,i,r,s,o,a=wi){const l=this.elements,c=2*s/(t-e),d=2*s/(i-r),h=(t+e)/(t-e),f=(i+r)/(i-r);let p,v;if(a===wi)p=-(o+s)/(o-s),v=-2*o*s/(o-s);else if(a===Il)p=-o/(o-s),v=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=d,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=v,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=wi){const l=this.elements,c=1/(t-e),d=1/(i-r),h=1/(o-s),f=(t+e)*c,p=(i+r)*d;let v,y;if(a===wi)v=(o+s)*h,y=-2*h;else if(a===Il)v=s*h,y=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-f,l[1]=0,l[5]=2*d,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=y,l[14]=-v,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const $r=new I,Vn=new yt,rS=new I(0,0,0),sS=new I(1,1,1),ki=new I,Ca=new I,xn=new I,Np=new yt,Up=new Jo;class li{constructor(e=0,t=0,i=0,r=li.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],d=r[9],h=r[2],f=r[6],p=r[10];switch(t){case"XYZ":this._y=Math.asin(fn(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-fn(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(fn(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-fn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(fn(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-fn(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-d,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Np.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Np,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Up.setFromEuler(this),this.setFromQuaternion(Up,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}li.DEFAULT_ORDER="XYZ";class qh{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let oS=0;const zp=new I,Kr=new Jo,fi=new yt,Ra=new I,oo=new I,aS=new I,lS=new Jo,Fp=new I(1,0,0),kp=new I(0,1,0),Op=new I(0,0,1),Bp={type:"added"},cS={type:"removed"},Zr={type:"childadded",child:null},Gc={type:"childremoved",child:null};class Bt extends Ws{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:oS++}),this.uuid=Qo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Bt.DEFAULT_UP.clone();const e=new I,t=new li,i=new Jo,r=new I(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new yt},normalMatrix:{value:new Oe}}),this.matrix=new yt,this.matrixWorld=new yt,this.matrixAutoUpdate=Bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qh,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Kr.setFromAxisAngle(e,t),this.quaternion.multiply(Kr),this}rotateOnWorldAxis(e,t){return Kr.setFromAxisAngle(e,t),this.quaternion.premultiply(Kr),this}rotateX(e){return this.rotateOnAxis(Fp,e)}rotateY(e){return this.rotateOnAxis(kp,e)}rotateZ(e){return this.rotateOnAxis(Op,e)}translateOnAxis(e,t){return zp.copy(e).applyQuaternion(this.quaternion),this.position.add(zp.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Fp,e)}translateY(e){return this.translateOnAxis(kp,e)}translateZ(e){return this.translateOnAxis(Op,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(fi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ra.copy(e):Ra.set(e,t,i);const r=this.parent;this.updateWorldMatrix(!0,!1),oo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?fi.lookAt(oo,Ra,this.up):fi.lookAt(Ra,oo,this.up),this.quaternion.setFromRotationMatrix(fi),r&&(fi.extractRotation(r.matrixWorld),Kr.setFromRotationMatrix(fi),this.quaternion.premultiply(Kr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Bp),Zr.child=e,this.dispatchEvent(Zr),Zr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(cS),Gc.child=e,this.dispatchEvent(Gc),Gc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),fi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),fi.multiply(e.parent.matrixWorld)),e.applyMatrix4(fi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Bp),Zr.child=e,this.dispatchEvent(Zr),Zr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(oo,e,aS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(oo,lS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),d=o(e.images),h=o(e.shapes),f=o(e.skeletons),p=o(e.animations),v=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const c in a){const d=a[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Bt.DEFAULT_UP=new I(0,1,0);Bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Gn=new I,pi=new I,Wc=new I,mi=new I,Qr=new I,Jr=new I,Hp=new I,Xc=new I,jc=new I,Yc=new I,qc=new ut,$c=new ut,Kc=new ut;class Yn{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Gn.subVectors(e,t),r.cross(Gn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Gn.subVectors(r,t),pi.subVectors(i,t),Wc.subVectors(e,t);const o=Gn.dot(Gn),a=Gn.dot(pi),l=Gn.dot(Wc),c=pi.dot(pi),d=pi.dot(Wc),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;const f=1/h,p=(c*l-a*d)*f,v=(o*d-a*l)*f;return s.set(1-p-v,v,p)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,mi)===null?!1:mi.x>=0&&mi.y>=0&&mi.x+mi.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,mi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,mi.x),l.addScaledVector(o,mi.y),l.addScaledVector(a,mi.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return qc.setScalar(0),$c.setScalar(0),Kc.setScalar(0),qc.fromBufferAttribute(e,t),$c.fromBufferAttribute(e,i),Kc.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(qc,s.x),o.addScaledVector($c,s.y),o.addScaledVector(Kc,s.z),o}static isFrontFacing(e,t,i,r){return Gn.subVectors(i,t),pi.subVectors(e,t),Gn.cross(pi).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Gn.subVectors(this.c,this.b),pi.subVectors(this.a,this.b),Gn.cross(pi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Yn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Yn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return Yn.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return Yn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Yn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,r=this.b,s=this.c;let o,a;Qr.subVectors(r,i),Jr.subVectors(s,i),Xc.subVectors(e,i);const l=Qr.dot(Xc),c=Jr.dot(Xc);if(l<=0&&c<=0)return t.copy(i);jc.subVectors(e,r);const d=Qr.dot(jc),h=Jr.dot(jc);if(d>=0&&h<=d)return t.copy(r);const f=l*h-d*c;if(f<=0&&l>=0&&d<=0)return o=l/(l-d),t.copy(i).addScaledVector(Qr,o);Yc.subVectors(e,s);const p=Qr.dot(Yc),v=Jr.dot(Yc);if(v>=0&&p<=v)return t.copy(s);const y=p*c-l*v;if(y<=0&&c>=0&&v<=0)return a=c/(c-v),t.copy(i).addScaledVector(Jr,a);const m=d*v-p*h;if(m<=0&&h-d>=0&&p-v>=0)return Hp.subVectors(s,r),a=(h-d)/(h-d+(p-v)),t.copy(r).addScaledVector(Hp,a);const u=1/(m+y+f);return o=y*u,a=f*u,t.copy(i).addScaledVector(Qr,o).addScaledVector(Jr,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const s_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Oi={h:0,s:0,l:0},Pa={h:0,s:0,l:0};function Zc(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class qe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=nn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,t),this}setRGB(e,t,i,r=Je.workingColorSpace){return this.r=e,this.g=t,this.b=i,Je.toWorkingColorSpace(this,r),this}setHSL(e,t,i,r=Je.workingColorSpace){if(e=Yy(e,1),t=fn(t,0,1),i=fn(i,0,1),t===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Zc(o,s,e+1/3),this.g=Zc(o,s,e),this.b=Zc(o,s,e-1/3)}return Je.toWorkingColorSpace(this,r),this}setStyle(e,t=nn){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=nn){const i=s_[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}copyLinearToSRGB(e){return this.r=As(e.r),this.g=As(e.g),this.b=As(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=nn){return Je.fromWorkingColorSpace($t.copy(this),e),Math.round(fn($t.r*255,0,255))*65536+Math.round(fn($t.g*255,0,255))*256+Math.round(fn($t.b*255,0,255))}getHexString(e=nn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Je.workingColorSpace){Je.fromWorkingColorSpace($t.copy(this),t);const i=$t.r,r=$t.g,s=$t.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const d=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=d<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=Je.workingColorSpace){return Je.fromWorkingColorSpace($t.copy(this),t),e.r=$t.r,e.g=$t.g,e.b=$t.b,e}getStyle(e=nn){Je.fromWorkingColorSpace($t.copy(this),e);const t=$t.r,i=$t.g,r=$t.b;return e!==nn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Oi),this.setHSL(Oi.h+e,Oi.s+t,Oi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Oi),e.getHSL(Pa);const i=Nc(Oi.h,Pa.h,t),r=Nc(Oi.s,Pa.s,t),s=Nc(Oi.l,Pa.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const $t=new qe;qe.NAMES=s_;let uS=0;class Xs extends Ws{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:uS++}),this.uuid=Qo(),this.name="",this.blending=Es,this.side=or,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sd,this.blendDst=od,this.blendEquation=Mr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new qe(0,0,0),this.blendAlpha=0,this.depthFunc=Ns,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ep,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wr,this.stencilZFail=Wr,this.stencilZPass=Wr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const r=this[t];if(r===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Es&&(i.blending=this.blending),this.side!==or&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==sd&&(i.blendSrc=this.blendSrc),this.blendDst!==od&&(i.blendDst=this.blendDst),this.blendEquation!==Mr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Ns&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ep&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Wr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Wr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(t){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Un extends Xs{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new qe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.combine=Hg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new I,La=new $e;class ai{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Tp,this.updateRanges=[],this.gpuType=Mi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)La.fromBufferAttribute(this,t),La.applyMatrix3(e),this.setXY(t,La.x,La.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=io(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=un(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=io(t,this.array)),t}setX(e,t){return this.normalized&&(t=un(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=io(t,this.array)),t}setY(e,t){return this.normalized&&(t=un(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=io(t,this.array)),t}setZ(e,t){return this.normalized&&(t=un(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=io(t,this.array)),t}setW(e,t){return this.normalized&&(t=un(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=un(t,this.array),i=un(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=un(t,this.array),i=un(i,this.array),r=un(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=un(t,this.array),i=un(i,this.array),r=un(r,this.array),s=un(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Tp&&(e.usage=this.usage),e}}class o_ extends ai{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class a_ extends ai{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class It extends ai{constructor(e,t,i){super(new Float32Array(e),t,i)}}let dS=0;const Pn=new yt,Qc=new Bt,es=new I,yn=new ea,ao=new ea,zt=new I;class Cn extends Ws{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:dS++}),this.uuid=Qo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(n_(e)?a_:o_)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Oe().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Pn.makeRotationFromQuaternion(e),this.applyMatrix4(Pn),this}rotateX(e){return Pn.makeRotationX(e),this.applyMatrix4(Pn),this}rotateY(e){return Pn.makeRotationY(e),this.applyMatrix4(Pn),this}rotateZ(e){return Pn.makeRotationZ(e),this.applyMatrix4(Pn),this}translate(e,t,i){return Pn.makeTranslation(e,t,i),this.applyMatrix4(Pn),this}scale(e,t,i){return Pn.makeScale(e,t,i),this.applyMatrix4(Pn),this}lookAt(e){return Qc.lookAt(e),Qc.updateMatrix(),this.applyMatrix4(Qc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(es).negate(),this.translate(es.x,es.y,es.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new It(i,3))}else{for(let i=0,r=t.count;i<r;i++){const s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ea);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){const s=t[i];yn.setFromBufferAttribute(s),this.morphTargetsRelative?(zt.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(zt),zt.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(zt)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new nc);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){const i=this.boundingSphere.center;if(yn.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){const a=t[s];ao.setFromBufferAttribute(a),this.morphTargetsRelative?(zt.addVectors(yn.min,ao.min),yn.expandByPoint(zt),zt.addVectors(yn.max,ao.max),yn.expandByPoint(zt)):(yn.expandByPoint(ao.min),yn.expandByPoint(ao.max))}yn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)zt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(zt));if(t)for(let s=0,o=t.length;s<o;s++){const a=t[s],l=this.morphTargetsRelative;for(let c=0,d=a.count;c<d;c++)zt.fromBufferAttribute(a,c),l&&(es.fromBufferAttribute(e,c),zt.add(es)),r=Math.max(r,i.distanceToSquared(zt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,r=t.normal,s=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ai(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let C=0;C<i.count;C++)a[C]=new I,l[C]=new I;const c=new I,d=new I,h=new I,f=new $e,p=new $e,v=new $e,y=new I,m=new I;function u(C,M,S){c.fromBufferAttribute(i,C),d.fromBufferAttribute(i,M),h.fromBufferAttribute(i,S),f.fromBufferAttribute(s,C),p.fromBufferAttribute(s,M),v.fromBufferAttribute(s,S),d.sub(c),h.sub(c),p.sub(f),v.sub(f);const P=1/(p.x*v.y-v.x*p.y);isFinite(P)&&(y.copy(d).multiplyScalar(v.y).addScaledVector(h,-p.y).multiplyScalar(P),m.copy(h).multiplyScalar(p.x).addScaledVector(d,-v.x).multiplyScalar(P),a[C].add(y),a[M].add(y),a[S].add(y),l[C].add(m),l[M].add(m),l[S].add(m))}let g=this.groups;g.length===0&&(g=[{start:0,count:e.count}]);for(let C=0,M=g.length;C<M;++C){const S=g[C],P=S.start,B=S.count;for(let z=P,V=P+B;z<V;z+=3)u(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const _=new I,x=new I,w=new I,T=new I;function A(C){w.fromBufferAttribute(r,C),T.copy(w);const M=a[C];_.copy(M),_.sub(w.multiplyScalar(w.dot(M))).normalize(),x.crossVectors(T,M);const P=x.dot(l[C])<0?-1:1;o.setXYZW(C,_.x,_.y,_.z,P)}for(let C=0,M=g.length;C<M;++C){const S=g[C],P=S.start,B=S.count;for(let z=P,V=P+B;z<V;z+=3)A(e.getX(z+0)),A(e.getX(z+1)),A(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ai(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,p=i.count;f<p;f++)i.setXYZ(f,0,0,0);const r=new I,s=new I,o=new I,a=new I,l=new I,c=new I,d=new I,h=new I;if(e)for(let f=0,p=e.count;f<p;f+=3){const v=e.getX(f+0),y=e.getX(f+1),m=e.getX(f+2);r.fromBufferAttribute(t,v),s.fromBufferAttribute(t,y),o.fromBufferAttribute(t,m),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,m),a.add(d),l.add(d),c.add(d),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let f=0,p=t.count;f<p;f+=3)r.fromBufferAttribute(t,f+0),s.fromBufferAttribute(t,f+1),o.fromBufferAttribute(t,f+2),d.subVectors(o,s),h.subVectors(r,s),d.cross(h),i.setXYZ(f+0,d.x,d.y,d.z),i.setXYZ(f+1,d.x,d.y,d.z),i.setXYZ(f+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)zt.fromBufferAttribute(e,t),zt.normalize(),e.setXYZ(t,zt.x,zt.y,zt.z)}toNonIndexed(){function e(a,l){const c=a.array,d=a.itemSize,h=a.normalized,f=new c.constructor(l.length*d);let p=0,v=0;for(let y=0,m=l.length;y<m;y++){a.isInterleavedBufferAttribute?p=l[y]*a.data.stride+a.offset:p=l[y]*d;for(let u=0;u<d;u++)f[v++]=c[p++]}return new ai(f,d,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Cn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);t.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let d=0,h=c.length;d<h;d++){const f=c[d],p=e(f,i);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,f=c.length;h<f;h++){const p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(r[l]=d,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const r=e.attributes;for(const c in r){const d=r[c];this.setAttribute(c,d.clone(t))}const s=e.morphAttributes;for(const c in s){const d=[],h=s[c];for(let f=0,p=h.length;f<p;f++)d.push(h[f].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,d=o.length;c<d;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vp=new yt,pr=new Yh,Da=new nc,Gp=new I,Ia=new I,Na=new I,Ua=new I,Jc=new I,za=new I,Wp=new I,Fa=new I;class K extends Bt{constructor(e=new Cn,t=new Un){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){za.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=a[l],h=s[l];d!==0&&(Jc.fromBufferAttribute(h,e),o?za.addScaledVector(Jc,d):za.addScaledVector(Jc.sub(t),d))}t.add(za)}return t}raycast(e,t){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Da.copy(i.boundingSphere),Da.applyMatrix4(s),pr.copy(e.ray).recast(e.near),!(Da.containsPoint(pr.origin)===!1&&(pr.intersectSphere(Da,Gp)===null||pr.origin.distanceToSquared(Gp)>(e.far-e.near)**2))&&(Vp.copy(s).invert(),pr.copy(e.ray).applyMatrix4(Vp),!(i.boundingBox!==null&&pr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,pr)))}_computeIntersections(e,t,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,h=s.attributes.normal,f=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,y=f.length;v<y;v++){const m=f[v],u=o[m.materialIndex],g=Math.max(m.start,p.start),_=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let x=g,w=_;x<w;x+=3){const T=a.getX(x),A=a.getX(x+1),C=a.getX(x+2);r=ka(this,u,e,i,c,d,h,T,A,C),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,p.start),y=Math.min(a.count,p.start+p.count);for(let m=v,u=y;m<u;m+=3){const g=a.getX(m),_=a.getX(m+1),x=a.getX(m+2);r=ka(this,o,e,i,c,d,h,g,_,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,y=f.length;v<y;v++){const m=f[v],u=o[m.materialIndex],g=Math.max(m.start,p.start),_=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let x=g,w=_;x<w;x+=3){const T=x,A=x+1,C=x+2;r=ka(this,u,e,i,c,d,h,T,A,C),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{const v=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=v,u=y;m<u;m+=3){const g=m,_=m+1,x=m+2;r=ka(this,o,e,i,c,d,h,g,_,x),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}}function hS(n,e,t,i,r,s,o,a){let l;if(e.side===sn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===or,a),l===null)return null;Fa.copy(a),Fa.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Fa);return c<t.near||c>t.far?null:{distance:c,point:Fa.clone(),object:n}}function ka(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,Ia),n.getVertexPosition(l,Na),n.getVertexPosition(c,Ua);const d=hS(n,e,t,i,Ia,Na,Ua,Wp);if(d){const h=new I;Yn.getBarycoord(Wp,Ia,Na,Ua,h),r&&(d.uv=Yn.getInterpolatedAttribute(r,a,l,c,h,new $e)),s&&(d.uv1=Yn.getInterpolatedAttribute(s,a,l,c,h,new $e)),o&&(d.normal=Yn.getInterpolatedAttribute(o,a,l,c,h,new I),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const f={a,b:l,c,normal:new I,materialIndex:0};Yn.getNormal(Ia,Na,Ua,f.normal),d.face=f,d.barycoord=h}return d}class ie extends Cn{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],d=[],h=[];let f=0,p=0;v("z","y","x",-1,-1,i,t,e,o,s,0),v("z","y","x",1,-1,i,t,-e,o,s,1),v("x","z","y",1,1,e,i,t,r,o,2),v("x","z","y",1,-1,e,i,-t,r,o,3),v("x","y","z",1,-1,e,t,i,r,s,4),v("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new It(c,3)),this.setAttribute("normal",new It(d,3)),this.setAttribute("uv",new It(h,2));function v(y,m,u,g,_,x,w,T,A,C,M){const S=x/A,P=w/C,B=x/2,z=w/2,V=T/2,Y=A+1,X=C+1;let J=0,D=0;const $=new I;for(let ee=0;ee<X;ee++){const ce=ee*P-z;for(let ye=0;ye<Y;ye++){const Ge=ye*S-B;$[y]=Ge*g,$[m]=ce*_,$[u]=V,c.push($.x,$.y,$.z),$[y]=0,$[m]=0,$[u]=T>0?1:-1,d.push($.x,$.y,$.z),h.push(ye/A),h.push(1-ee/C),J+=1}}for(let ee=0;ee<C;ee++)for(let ce=0;ce<A;ce++){const ye=f+ce+Y*ee,Ge=f+ce+Y*(ee+1),q=f+(ce+1)+Y*(ee+1),se=f+(ce+1)+Y*ee;l.push(ye,Ge,se),l.push(Ge,q,se),D+=6}a.addGroup(p,D,M),p+=D,f+=J}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ie(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Os(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const r=n[t][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone():Array.isArray(r)?e[t][i]=r.slice():e[t][i]=r}}return e}function en(n){const e={};for(let t=0;t<n.length;t++){const i=Os(n[t]);for(const r in i)e[r]=i[r]}return e}function fS(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function l_(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const pS={clone:Os,merge:en};var mS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,gS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ar extends Xs{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=mS,this.fragmentShader=gS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Os(e.uniforms),this.uniformsGroups=fS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class c_ extends Bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yt,this.projectionMatrix=new yt,this.projectionMatrixInverse=new yt,this.coordinateSystem=wi}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Bi=new I,Xp=new $e,jp=new $e;class Mn extends c_{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Gd*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Ic*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Gd*2*Math.atan(Math.tan(Ic*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Bi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z),Bi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Bi.x,Bi.y).multiplyScalar(-e/Bi.z)}getViewSize(e,t){return this.getViewBounds(e,Xp,jp),t.subVectors(jp,Xp)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Ic*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ts=-90,ns=1;class _S extends Bt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Mn(ts,ns,e,t);r.layers=this.layers,this.add(r);const s=new Mn(ts,ns,e,t);s.layers=this.layers,this.add(s);const o=new Mn(ts,ns,e,t);o.layers=this.layers,this.add(o);const a=new Mn(ts,ns,e,t);a.layers=this.layers,this.add(a);const l=new Mn(ts,ns,e,t);l.layers=this.layers,this.add(l);const c=new Mn(ts,ns,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(const c of t)this.remove(c);if(e===wi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Il)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,d]=this.children,h=e.getRenderTarget(),f=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(t,s),e.setRenderTarget(i,1,r),e.render(t,o),e.setRenderTarget(i,2,r),e.render(t,a),e.setRenderTarget(i,3,r),e.render(t,l),e.setRenderTarget(i,4,r),e.render(t,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),e.render(t,d),e.setRenderTarget(h,f,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class u_ extends on{constructor(e,t,i,r,s,o,a,l,c,d){e=e!==void 0?e:[],t=t!==void 0?t:Us,super(e,t,i,r,s,o,a,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class vS extends kr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new u_(r,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:ri}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new ie(5,5,5),s=new ar({name:"CubemapFromEquirect",uniforms:Os(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:sn,blending:nr});s.uniforms.tEquirect.value=t;const o=new K(r,s),a=t.minFilter;return t.minFilter===Cr&&(t.minFilter=ri),new _S(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,i,r){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}}const eu=new I,xS=new I,yS=new Oe;class yr{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const r=eu.subVectors(i,t).cross(xS.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(eu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:t.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||yS.getNormalMatrix(e),r=this.coplanarPoint(eu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const mr=new nc,Oa=new I;class $h{constructor(e=new yr,t=new yr,i=new yr,r=new yr,s=new yr,o=new yr){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=wi){const i=this.planes,r=e.elements,s=r[0],o=r[1],a=r[2],l=r[3],c=r[4],d=r[5],h=r[6],f=r[7],p=r[8],v=r[9],y=r[10],m=r[11],u=r[12],g=r[13],_=r[14],x=r[15];if(i[0].setComponents(l-s,f-c,m-p,x-u).normalize(),i[1].setComponents(l+s,f+c,m+p,x+u).normalize(),i[2].setComponents(l+o,f+d,m+v,x+g).normalize(),i[3].setComponents(l-o,f-d,m-v,x-g).normalize(),i[4].setComponents(l-a,f-h,m-y,x-_).normalize(),t===wi)i[5].setComponents(l+a,f+h,m+y,x+_).normalize();else if(t===Il)i[5].setComponents(a,h,y,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),mr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mr)}intersectsSprite(e){return mr.center.set(0,0,0),mr.radius=.7071067811865476,mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(mr)}intersectsSphere(e){const t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const r=t[i];if(Oa.x=r.normal.x>0?e.max.x:e.min.x,Oa.y=r.normal.y>0?e.max.y:e.min.y,Oa.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Oa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function d_(){let n=null,e=!1,t=null,i=null;function r(s,o){t(s,o),i=n.requestAnimationFrame(r)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function SS(n){const e=new WeakMap;function t(a,l){const c=a.array,d=a.usage,h=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,d),a.onUploadCallback();let p;if(c instanceof Float32Array)p=n.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=n.HALF_FLOAT:p=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=n.SHORT;else if(c instanceof Uint32Array)p=n.UNSIGNED_INT;else if(c instanceof Int32Array)p=n.INT;else if(c instanceof Int8Array)p=n.BYTE;else if(c instanceof Uint8Array)p=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){const d=l.array,h=l.updateRanges;if(n.bindBuffer(c,a),h.length===0)n.bufferSubData(c,0,d);else{h.sort((p,v)=>p.start-v.start);let f=0;for(let p=1;p<h.length;p++){const v=h[f],y=h[p];y.start<=v.start+v.count+1?v.count=Math.max(v.count,y.start+y.count-v.start):(++f,h[f]=y)}h.length=f+1;for(let p=0,v=h.length;p<v;p++){const y=h[p];n.bufferSubData(c,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const d=e.get(a);(!d||d.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}class ta extends Cn{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};const s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,d=l+1,h=e/a,f=t/l,p=[],v=[],y=[],m=[];for(let u=0;u<d;u++){const g=u*f-o;for(let _=0;_<c;_++){const x=_*h-s;v.push(x,-g,0),y.push(0,0,1),m.push(_/a),m.push(1-u/l)}}for(let u=0;u<l;u++)for(let g=0;g<a;g++){const _=g+c*u,x=g+c*(u+1),w=g+1+c*(u+1),T=g+1+c*u;p.push(_,x,T),p.push(x,w,T)}this.setIndex(p),this.setAttribute("position",new It(v,3)),this.setAttribute("normal",new It(y,3)),this.setAttribute("uv",new It(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ta(e.width,e.height,e.widthSegments,e.heightSegments)}}var MS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wS=`#ifdef USE_ALPHAHASH
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
#endif`,ES=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,TS=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,AS=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bS=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,CS=`#ifdef USE_AOMAP
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
#endif`,RS=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,PS=`#ifdef USE_BATCHING
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
#endif`,LS=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,DS=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,IS=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,NS=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,US=`#ifdef USE_IRIDESCENCE
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
#endif`,zS=`#ifdef USE_BUMPMAP
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
#endif`,FS=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,kS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,OS=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,BS=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,HS=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,VS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,GS=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,WS=`#if defined( USE_COLOR_ALPHA )
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
#endif`,XS=`#define PI 3.141592653589793
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
} // validated`,jS=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,YS=`vec3 transformedNormal = objectNormal;
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
#endif`,qS=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,$S=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,KS=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ZS=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,QS="gl_FragColor = linearToOutputTexel( gl_FragColor );",JS=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,eM=`#ifdef USE_ENVMAP
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
#endif`,tM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,nM=`#ifdef USE_ENVMAP
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
#endif`,iM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,rM=`#ifdef USE_ENVMAP
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
#endif`,sM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,oM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,aM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,lM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,cM=`#ifdef USE_GRADIENTMAP
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
}`,uM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,dM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,hM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,fM=`uniform bool receiveShadow;
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
#endif`,pM=`#ifdef USE_ENVMAP
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
#endif`,mM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,gM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_M=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xM=`PhysicalMaterial material;
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
#endif`,yM=`struct PhysicalMaterial {
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
}`,SM=`
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
#endif`,MM=`#if defined( RE_IndirectDiffuse )
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
#endif`,wM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,EM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,TM=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,AM=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bM=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,CM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,RM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,PM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,LM=`#if defined( USE_POINTS_UV )
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
#endif`,DM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,IM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,NM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,UM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,FM=`#ifdef USE_MORPHTARGETS
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
#endif`,kM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,OM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,BM=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,HM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,VM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,GM=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,WM=`#ifdef USE_NORMALMAP
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
#endif`,XM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,jM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,YM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$M=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,KM=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ZM=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,QM=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,JM=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,e1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,t1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,n1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,i1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,r1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,s1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,o1=`float getShadowMask() {
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
}`,a1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,l1=`#ifdef USE_SKINNING
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
#endif`,c1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,u1=`#ifdef USE_SKINNING
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
#endif`,d1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,h1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,f1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,p1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,m1=`#ifdef USE_TRANSMISSION
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
#endif`,g1=`#ifdef USE_TRANSMISSION
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
#endif`,_1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,v1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,x1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,y1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const S1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,M1=`uniform sampler2D t2D;
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
}`,w1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,E1=`#ifdef ENVMAP_TYPE_CUBE
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
}`,T1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,A1=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,b1=`#include <common>
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
}`,C1=`#if DEPTH_PACKING == 3200
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
}`,R1=`#define DISTANCE
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
}`,P1=`#define DISTANCE
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
}`,L1=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,D1=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,I1=`uniform float scale;
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
}`,N1=`uniform vec3 diffuse;
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
}`,U1=`#include <common>
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
}`,z1=`uniform vec3 diffuse;
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
}`,F1=`#define LAMBERT
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
}`,k1=`#define LAMBERT
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
}`,O1=`#define MATCAP
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
}`,B1=`#define MATCAP
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
}`,H1=`#define NORMAL
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
}`,V1=`#define NORMAL
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
}`,G1=`#define PHONG
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
}`,W1=`#define PHONG
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
}`,X1=`#define STANDARD
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
}`,j1=`#define STANDARD
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
}`,Y1=`#define TOON
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
}`,q1=`#define TOON
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
}`,$1=`uniform float size;
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
}`,K1=`uniform vec3 diffuse;
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
}`,Z1=`#include <common>
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
}`,Q1=`uniform vec3 color;
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
}`,J1=`uniform float rotation;
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
}`,ew=`uniform vec3 diffuse;
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
}`,He={alphahash_fragment:MS,alphahash_pars_fragment:wS,alphamap_fragment:ES,alphamap_pars_fragment:TS,alphatest_fragment:AS,alphatest_pars_fragment:bS,aomap_fragment:CS,aomap_pars_fragment:RS,batching_pars_vertex:PS,batching_vertex:LS,begin_vertex:DS,beginnormal_vertex:IS,bsdfs:NS,iridescence_fragment:US,bumpmap_pars_fragment:zS,clipping_planes_fragment:FS,clipping_planes_pars_fragment:kS,clipping_planes_pars_vertex:OS,clipping_planes_vertex:BS,color_fragment:HS,color_pars_fragment:VS,color_pars_vertex:GS,color_vertex:WS,common:XS,cube_uv_reflection_fragment:jS,defaultnormal_vertex:YS,displacementmap_pars_vertex:qS,displacementmap_vertex:$S,emissivemap_fragment:KS,emissivemap_pars_fragment:ZS,colorspace_fragment:QS,colorspace_pars_fragment:JS,envmap_fragment:eM,envmap_common_pars_fragment:tM,envmap_pars_fragment:nM,envmap_pars_vertex:iM,envmap_physical_pars_fragment:pM,envmap_vertex:rM,fog_vertex:sM,fog_pars_vertex:oM,fog_fragment:aM,fog_pars_fragment:lM,gradientmap_pars_fragment:cM,lightmap_pars_fragment:uM,lights_lambert_fragment:dM,lights_lambert_pars_fragment:hM,lights_pars_begin:fM,lights_toon_fragment:mM,lights_toon_pars_fragment:gM,lights_phong_fragment:_M,lights_phong_pars_fragment:vM,lights_physical_fragment:xM,lights_physical_pars_fragment:yM,lights_fragment_begin:SM,lights_fragment_maps:MM,lights_fragment_end:wM,logdepthbuf_fragment:EM,logdepthbuf_pars_fragment:TM,logdepthbuf_pars_vertex:AM,logdepthbuf_vertex:bM,map_fragment:CM,map_pars_fragment:RM,map_particle_fragment:PM,map_particle_pars_fragment:LM,metalnessmap_fragment:DM,metalnessmap_pars_fragment:IM,morphinstance_vertex:NM,morphcolor_vertex:UM,morphnormal_vertex:zM,morphtarget_pars_vertex:FM,morphtarget_vertex:kM,normal_fragment_begin:OM,normal_fragment_maps:BM,normal_pars_fragment:HM,normal_pars_vertex:VM,normal_vertex:GM,normalmap_pars_fragment:WM,clearcoat_normal_fragment_begin:XM,clearcoat_normal_fragment_maps:jM,clearcoat_pars_fragment:YM,iridescence_pars_fragment:qM,opaque_fragment:$M,packing:KM,premultiplied_alpha_fragment:ZM,project_vertex:QM,dithering_fragment:JM,dithering_pars_fragment:e1,roughnessmap_fragment:t1,roughnessmap_pars_fragment:n1,shadowmap_pars_fragment:i1,shadowmap_pars_vertex:r1,shadowmap_vertex:s1,shadowmask_pars_fragment:o1,skinbase_vertex:a1,skinning_pars_vertex:l1,skinning_vertex:c1,skinnormal_vertex:u1,specularmap_fragment:d1,specularmap_pars_fragment:h1,tonemapping_fragment:f1,tonemapping_pars_fragment:p1,transmission_fragment:m1,transmission_pars_fragment:g1,uv_pars_fragment:_1,uv_pars_vertex:v1,uv_vertex:x1,worldpos_vertex:y1,background_vert:S1,background_frag:M1,backgroundCube_vert:w1,backgroundCube_frag:E1,cube_vert:T1,cube_frag:A1,depth_vert:b1,depth_frag:C1,distanceRGBA_vert:R1,distanceRGBA_frag:P1,equirect_vert:L1,equirect_frag:D1,linedashed_vert:I1,linedashed_frag:N1,meshbasic_vert:U1,meshbasic_frag:z1,meshlambert_vert:F1,meshlambert_frag:k1,meshmatcap_vert:O1,meshmatcap_frag:B1,meshnormal_vert:H1,meshnormal_frag:V1,meshphong_vert:G1,meshphong_frag:W1,meshphysical_vert:X1,meshphysical_frag:j1,meshtoon_vert:Y1,meshtoon_frag:q1,points_vert:$1,points_frag:K1,shadow_vert:Z1,shadow_frag:Q1,sprite_vert:J1,sprite_frag:ew},de={common:{diffuse:{value:new qe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Oe}},envmap:{envMap:{value:null},envMapRotation:{value:new Oe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Oe},normalScale:{value:new $e(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new qe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new qe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0},uvTransform:{value:new Oe}},sprite:{diffuse:{value:new qe(16777215)},opacity:{value:1},center:{value:new $e(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Oe},alphaMap:{value:null},alphaMapTransform:{value:new Oe},alphaTest:{value:0}}},ni={basic:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:He.meshbasic_vert,fragmentShader:He.meshbasic_frag},lambert:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new qe(0)}}]),vertexShader:He.meshlambert_vert,fragmentShader:He.meshlambert_frag},phong:{uniforms:en([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new qe(0)},specular:{value:new qe(1118481)},shininess:{value:30}}]),vertexShader:He.meshphong_vert,fragmentShader:He.meshphong_frag},standard:{uniforms:en([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new qe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag},toon:{uniforms:en([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new qe(0)}}]),vertexShader:He.meshtoon_vert,fragmentShader:He.meshtoon_frag},matcap:{uniforms:en([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:He.meshmatcap_vert,fragmentShader:He.meshmatcap_frag},points:{uniforms:en([de.points,de.fog]),vertexShader:He.points_vert,fragmentShader:He.points_frag},dashed:{uniforms:en([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:He.linedashed_vert,fragmentShader:He.linedashed_frag},depth:{uniforms:en([de.common,de.displacementmap]),vertexShader:He.depth_vert,fragmentShader:He.depth_frag},normal:{uniforms:en([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:He.meshnormal_vert,fragmentShader:He.meshnormal_frag},sprite:{uniforms:en([de.sprite,de.fog]),vertexShader:He.sprite_vert,fragmentShader:He.sprite_frag},background:{uniforms:{uvTransform:{value:new Oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:He.background_vert,fragmentShader:He.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Oe}},vertexShader:He.backgroundCube_vert,fragmentShader:He.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:He.cube_vert,fragmentShader:He.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:He.equirect_vert,fragmentShader:He.equirect_frag},distanceRGBA:{uniforms:en([de.common,de.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:He.distanceRGBA_vert,fragmentShader:He.distanceRGBA_frag},shadow:{uniforms:en([de.lights,de.fog,{color:{value:new qe(0)},opacity:{value:1}}]),vertexShader:He.shadow_vert,fragmentShader:He.shadow_frag}};ni.physical={uniforms:en([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Oe},clearcoatNormalScale:{value:new $e(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Oe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Oe},sheen:{value:0},sheenColor:{value:new qe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Oe},transmissionSamplerSize:{value:new $e},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Oe},attenuationDistance:{value:0},attenuationColor:{value:new qe(0)},specularColor:{value:new qe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Oe},anisotropyVector:{value:new $e},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Oe}}]),vertexShader:He.meshphysical_vert,fragmentShader:He.meshphysical_frag};const Ba={r:0,b:0,g:0},gr=new li,tw=new yt;function nw(n,e,t,i,r,s,o){const a=new qe(0);let l=s===!0?0:1,c,d,h=null,f=0,p=null;function v(g){let _=g.isScene===!0?g.background:null;return _&&_.isTexture&&(_=(g.backgroundBlurriness>0?t:e).get(_)),_}function y(g){let _=!1;const x=v(g);x===null?u(a,l):x&&x.isColor&&(u(x,1),_=!0);const w=n.xr.getEnvironmentBlendMode();w==="additive"?i.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,o),(n.autoClear||_)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function m(g,_){const x=v(_);x&&(x.isCubeTexture||x.mapping===ec)?(d===void 0&&(d=new K(new ie(1,1,1),new ar({name:"BackgroundCubeMaterial",uniforms:Os(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:sn,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(w,T,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(d)),gr.copy(_.backgroundRotation),gr.x*=-1,gr.y*=-1,gr.z*=-1,x.isCubeTexture&&x.isRenderTargetTexture===!1&&(gr.y*=-1,gr.z*=-1),d.material.uniforms.envMap.value=x,d.material.uniforms.flipEnvMap.value=x.isCubeTexture&&x.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(tw.makeRotationFromEuler(gr)),d.material.toneMapped=Je.getTransfer(x.colorSpace)!==ct,(h!==x||f!==x.version||p!==n.toneMapping)&&(d.material.needsUpdate=!0,h=x,f=x.version,p=n.toneMapping),d.layers.enableAll(),g.unshift(d,d.geometry,d.material,0,0,null)):x&&x.isTexture&&(c===void 0&&(c=new K(new ta(2,2),new ar({name:"BackgroundMaterial",uniforms:Os(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:or,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=x,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.toneMapped=Je.getTransfer(x.colorSpace)!==ct,x.matrixAutoUpdate===!0&&x.updateMatrix(),c.material.uniforms.uvTransform.value.copy(x.matrix),(h!==x||f!==x.version||p!==n.toneMapping)&&(c.material.needsUpdate=!0,h=x,f=x.version,p=n.toneMapping),c.layers.enableAll(),g.unshift(c,c.geometry,c.material,0,0,null))}function u(g,_){g.getRGB(Ba,l_(n)),i.buffers.color.setClear(Ba.r,Ba.g,Ba.b,_,o)}return{getClearColor:function(){return a},setClearColor:function(g,_=1){a.set(g),l=_,u(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(g){l=g,u(a,l)},render:y,addToRenderList:m}}function iw(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=f(null);let s=r,o=!1;function a(S,P,B,z,V){let Y=!1;const X=h(z,B,P);s!==X&&(s=X,c(s.object)),Y=p(S,z,B,V),Y&&v(S,z,B,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,x(S,P,B,z),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(S){return n.bindVertexArray(S)}function d(S){return n.deleteVertexArray(S)}function h(S,P,B){const z=B.wireframe===!0;let V=i[S.id];V===void 0&&(V={},i[S.id]=V);let Y=V[P.id];Y===void 0&&(Y={},V[P.id]=Y);let X=Y[z];return X===void 0&&(X=f(l()),Y[z]=X),X}function f(S){const P=[],B=[],z=[];for(let V=0;V<t;V++)P[V]=0,B[V]=0,z[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:B,attributeDivisors:z,object:S,attributes:{},index:null}}function p(S,P,B,z){const V=s.attributes,Y=P.attributes;let X=0;const J=B.getAttributes();for(const D in J)if(J[D].location>=0){const ee=V[D];let ce=Y[D];if(ce===void 0&&(D==="instanceMatrix"&&S.instanceMatrix&&(ce=S.instanceMatrix),D==="instanceColor"&&S.instanceColor&&(ce=S.instanceColor)),ee===void 0||ee.attribute!==ce||ce&&ee.data!==ce.data)return!0;X++}return s.attributesNum!==X||s.index!==z}function v(S,P,B,z){const V={},Y=P.attributes;let X=0;const J=B.getAttributes();for(const D in J)if(J[D].location>=0){let ee=Y[D];ee===void 0&&(D==="instanceMatrix"&&S.instanceMatrix&&(ee=S.instanceMatrix),D==="instanceColor"&&S.instanceColor&&(ee=S.instanceColor));const ce={};ce.attribute=ee,ee&&ee.data&&(ce.data=ee.data),V[D]=ce,X++}s.attributes=V,s.attributesNum=X,s.index=z}function y(){const S=s.newAttributes;for(let P=0,B=S.length;P<B;P++)S[P]=0}function m(S){u(S,0)}function u(S,P){const B=s.newAttributes,z=s.enabledAttributes,V=s.attributeDivisors;B[S]=1,z[S]===0&&(n.enableVertexAttribArray(S),z[S]=1),V[S]!==P&&(n.vertexAttribDivisor(S,P),V[S]=P)}function g(){const S=s.newAttributes,P=s.enabledAttributes;for(let B=0,z=P.length;B<z;B++)P[B]!==S[B]&&(n.disableVertexAttribArray(B),P[B]=0)}function _(S,P,B,z,V,Y,X){X===!0?n.vertexAttribIPointer(S,P,B,V,Y):n.vertexAttribPointer(S,P,B,z,V,Y)}function x(S,P,B,z){y();const V=z.attributes,Y=B.getAttributes(),X=P.defaultAttributeValues;for(const J in Y){const D=Y[J];if(D.location>=0){let $=V[J];if($===void 0&&(J==="instanceMatrix"&&S.instanceMatrix&&($=S.instanceMatrix),J==="instanceColor"&&S.instanceColor&&($=S.instanceColor)),$!==void 0){const ee=$.normalized,ce=$.itemSize,ye=e.get($);if(ye===void 0)continue;const Ge=ye.buffer,q=ye.type,se=ye.bytesPerElement,pe=q===n.INT||q===n.UNSIGNED_INT||$.gpuType===Hh;if($.isInterleavedBufferAttribute){const ue=$.data,Pe=ue.stride,De=$.offset;if(ue.isInstancedInterleavedBuffer){for(let ze=0;ze<D.locationSize;ze++)u(D.location+ze,ue.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let ze=0;ze<D.locationSize;ze++)m(D.location+ze);n.bindBuffer(n.ARRAY_BUFFER,Ge);for(let ze=0;ze<D.locationSize;ze++)_(D.location+ze,ce/D.locationSize,q,ee,Pe*se,(De+ce/D.locationSize*ze)*se,pe)}else{if($.isInstancedBufferAttribute){for(let ue=0;ue<D.locationSize;ue++)u(D.location+ue,$.meshPerAttribute);S.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ue=0;ue<D.locationSize;ue++)m(D.location+ue);n.bindBuffer(n.ARRAY_BUFFER,Ge);for(let ue=0;ue<D.locationSize;ue++)_(D.location+ue,ce/D.locationSize,q,ee,ce*se,ce/D.locationSize*ue*se,pe)}}else if(X!==void 0){const ee=X[J];if(ee!==void 0)switch(ee.length){case 2:n.vertexAttrib2fv(D.location,ee);break;case 3:n.vertexAttrib3fv(D.location,ee);break;case 4:n.vertexAttrib4fv(D.location,ee);break;default:n.vertexAttrib1fv(D.location,ee)}}}}g()}function w(){C();for(const S in i){const P=i[S];for(const B in P){const z=P[B];for(const V in z)d(z[V].object),delete z[V];delete P[B]}delete i[S]}}function T(S){if(i[S.id]===void 0)return;const P=i[S.id];for(const B in P){const z=P[B];for(const V in z)d(z[V].object),delete z[V];delete P[B]}delete i[S.id]}function A(S){for(const P in i){const B=i[P];if(B[S.id]===void 0)continue;const z=B[S.id];for(const V in z)d(z[V].object),delete z[V];delete B[S.id]}}function C(){M(),o=!0,s!==r&&(s=r,c(s.object))}function M(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:C,resetDefaultState:M,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfProgram:A,initAttributes:y,enableAttribute:m,disableUnusedAttributes:g}}function rw(n,e,t){let i;function r(c){i=c}function s(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function o(c,d,h){h!==0&&(n.drawArraysInstanced(i,c,d,h),t.update(d,i,h))}function a(c,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,h);let p=0;for(let v=0;v<h;v++)p+=d[v];t.update(p,i,1)}function l(c,d,h,f){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let v=0;v<c.length;v++)o(c[v],d[v],f[v]);else{p.multiDrawArraysInstancedWEBGL(i,c,0,d,0,f,0,h);let v=0;for(let y=0;y<h;y++)v+=d[y]*f[y];t.update(v,i,1)}}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function sw(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(A){return!(A!==qn&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const C=A===Zo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Pi&&i.convert(A)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Mi&&!C)}function l(A){if(A==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const h=t.logarithmicDepthBuffer===!0,f=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),p=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),u=n.getParameter(n.MAX_VERTEX_ATTRIBS),g=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),_=n.getParameter(n.MAX_VARYING_VECTORS),x=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=v>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reverseDepthBuffer:f,maxTextures:p,maxVertexTextures:v,maxTextureSize:y,maxCubemapSize:m,maxAttributes:u,maxVertexUniforms:g,maxVaryings:_,maxFragmentUniforms:x,vertexTextures:w,maxSamples:T}}function ow(n){const e=this;let t=null,i=0,r=!1,s=!1;const o=new yr,a=new Oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,f){const p=h.length!==0||f||i!==0||r;return r=f,i=h.length,p},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,f){t=d(h,f,0)},this.setState=function(h,f,p){const v=h.clippingPlanes,y=h.clipIntersection,m=h.clipShadows,u=n.get(h);if(!r||v===null||v.length===0||s&&!m)s?d(null):c();else{const g=s?0:i,_=g*4;let x=u.clippingState||null;l.value=x,x=d(v,f,_,p);for(let w=0;w!==_;++w)x[w]=t[w];u.clippingState=x,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=g}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(h,f,p,v){const y=h!==null?h.length:0;let m=null;if(y!==0){if(m=l.value,v!==!0||m===null){const u=p+y*4,g=f.matrixWorldInverse;a.getNormalMatrix(g),(m===null||m.length<u)&&(m=new Float32Array(u));for(let _=0,x=p;_!==y;++_,x+=4)o.copy(h[_]).applyMatrix4(g,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function aw(n){let e=new WeakMap;function t(o,a){return a===pd?o.mapping=Us:a===md&&(o.mapping=zs),o}function i(o){if(o&&o.isTexture){const a=o.mapping;if(a===pd||a===md)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new vS(l.height);return c.fromEquirectangularTexture(n,o),e.set(o,c),o.addEventListener("dispose",r),t(c.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class h_ extends c_{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=d*this.view.offsetY,l=a-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const _s=4,Yp=[.125,.215,.35,.446,.526,.582],wr=20,tu=new h_,qp=new qe;let nu=null,iu=0,ru=0,su=!1;const Sr=(1+Math.sqrt(5))/2,is=1/Sr,$p=[new I(-Sr,is,0),new I(Sr,is,0),new I(-is,0,Sr),new I(is,0,Sr),new I(0,Sr,-is),new I(0,Sr,is),new I(-1,1,-1),new I(1,1,-1),new I(-1,1,1),new I(1,1,1)];class Kp{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,r=100){nu=this._renderer.getRenderTarget(),iu=this._renderer.getActiveCubeFace(),ru=this._renderer.getActiveMipmapLevel(),su=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),t>0&&this._blur(s,0,0,t),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Jp(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Qp(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(nu,iu,ru),this._renderer.xr.enabled=su,e.scissorTest=!1,Ha(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Us||e.mapping===zs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),nu=this._renderer.getRenderTarget(),iu=this._renderer.getActiveCubeFace(),ru=this._renderer.getActiveMipmapLevel(),su=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:ri,minFilter:ri,generateMipmaps:!1,type:Zo,format:qn,colorSpace:Gs,depthBuffer:!1},r=Zp(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Zp(e,t,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=lw(s)),this._blurMaterial=cw(s,e,t)}return r}_compileMaterial(e){const t=new K(this._lodPlanes[0],e);this._renderer.compile(t,tu)}_sceneToCubeUV(e,t,i,r){const a=new Mn(90,1,t,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(qp),d.toneMapping=ir,d.autoClear=!1;const p=new Un({name:"PMREM.Background",side:sn,depthWrite:!1,depthTest:!1}),v=new K(new ie,p);let y=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,y=!0):(p.color.copy(qp),y=!0);for(let u=0;u<6;u++){const g=u%3;g===0?(a.up.set(0,l[u],0),a.lookAt(c[u],0,0)):g===1?(a.up.set(0,0,l[u]),a.lookAt(0,c[u],0)):(a.up.set(0,l[u],0),a.lookAt(0,0,c[u]));const _=this._cubeSize;Ha(r,g*_,u>2?_:0,_,_),d.setRenderTarget(r),y&&d.render(v,a),d.render(e,a)}v.geometry.dispose(),v.material.dispose(),d.toneMapping=f,d.autoClear=h,e.background=m}_textureToCubeUV(e,t){const i=this._renderer,r=e.mapping===Us||e.mapping===zs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Jp()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Qp());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new K(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Ha(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,tu)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=$p[(r-s-1)%$p.length];this._blur(e,s-1,s,o,a)}t.autoClear=i}_blur(e,t,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,t,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,h=new K(this._lodPlanes[r],c),f=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*wr-1),y=s/v,m=isFinite(s)?1+Math.floor(d*y):wr;m>wr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${wr}`);const u=[];let g=0;for(let A=0;A<wr;++A){const C=A/y,M=Math.exp(-C*C/2);u.push(M),A===0?g+=M:A<m&&(g+=2*M)}for(let A=0;A<u.length;A++)u[A]=u[A]/g;f.envMap.value=e.texture,f.samples.value=m,f.weights.value=u,f.latitudinal.value=o==="latitudinal",a&&(f.poleAxis.value=a);const{_lodMax:_}=this;f.dTheta.value=v,f.mipInt.value=_-i;const x=this._sizeLods[r],w=3*x*(r>_-_s?r-_+_s:0),T=4*(this._cubeSize-x);Ha(t,w,T,3*x,2*x),l.setRenderTarget(t),l.render(h,tu)}}function lw(n){const e=[],t=[],i=[];let r=n;const s=n-_s+1+Yp.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);t.push(a);let l=1/a;o>n-_s?l=Yp[o-n+_s-1]:o===0&&(l=0),i.push(l);const c=1/(a-2),d=-c,h=1+c,f=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,v=6,y=3,m=2,u=1,g=new Float32Array(y*v*p),_=new Float32Array(m*v*p),x=new Float32Array(u*v*p);for(let T=0;T<p;T++){const A=T%3*2/3-1,C=T>2?0:-1,M=[A,C,0,A+2/3,C,0,A+2/3,C+1,0,A,C,0,A+2/3,C+1,0,A,C+1,0];g.set(M,y*v*T),_.set(f,m*v*T);const S=[T,T,T,T,T,T];x.set(S,u*v*T)}const w=new Cn;w.setAttribute("position",new ai(g,y)),w.setAttribute("uv",new ai(_,m)),w.setAttribute("faceIndex",new ai(x,u)),e.push(w),r>_s&&r--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Zp(n,e,t){const i=new kr(n,e,t);return i.texture.mapping=ec,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ha(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function cw(n,e,t){const i=new Float32Array(wr),r=new I(0,1,0);return new ar({name:"SphericalGaussianBlur",defines:{n:wr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Kh(),fragmentShader:`

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
		`,blending:nr,depthTest:!1,depthWrite:!1})}function Qp(){return new ar({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Kh(),fragmentShader:`

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
		`,blending:nr,depthTest:!1,depthWrite:!1})}function Jp(){return new ar({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Kh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:nr,depthTest:!1,depthWrite:!1})}function Kh(){return`

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
	`}function uw(n){let e=new WeakMap,t=null;function i(a){if(a&&a.isTexture){const l=a.mapping,c=l===pd||l===md,d=l===Us||l===zs;if(c||d){let h=e.get(a);const f=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==f)return t===null&&(t=new Kp(n)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||d&&p&&r(p)?(t===null&&(t=new Kp(n)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",s),h.texture):null}}}return a}function r(a){let l=0;const c=6;for(let d=0;d<c;d++)a[d]!==void 0&&l++;return l===c}function s(a){const l=a.target;l.removeEventListener("dispose",s);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:o}}function dw(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const r=t(i);return r===null&&mo("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function hw(n,e,t,i){const r={},s=new WeakMap;function o(h){const f=h.target;f.index!==null&&e.remove(f.index);for(const v in f.attributes)e.remove(f.attributes[v]);for(const v in f.morphAttributes){const y=f.morphAttributes[v];for(let m=0,u=y.length;m<u;m++)e.remove(y[m])}f.removeEventListener("dispose",o),delete r[f.id];const p=s.get(f);p&&(e.remove(p),s.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function a(h,f){return r[f.id]===!0||(f.addEventListener("dispose",o),r[f.id]=!0,t.memory.geometries++),f}function l(h){const f=h.attributes;for(const v in f)e.update(f[v],n.ARRAY_BUFFER);const p=h.morphAttributes;for(const v in p){const y=p[v];for(let m=0,u=y.length;m<u;m++)e.update(y[m],n.ARRAY_BUFFER)}}function c(h){const f=[],p=h.index,v=h.attributes.position;let y=0;if(p!==null){const g=p.array;y=p.version;for(let _=0,x=g.length;_<x;_+=3){const w=g[_+0],T=g[_+1],A=g[_+2];f.push(w,T,T,A,A,w)}}else if(v!==void 0){const g=v.array;y=v.version;for(let _=0,x=g.length/3-1;_<x;_+=3){const w=_+0,T=_+1,A=_+2;f.push(w,T,T,A,A,w)}}else return;const m=new(n_(f)?a_:o_)(f,1);m.version=y;const u=s.get(h);u&&e.remove(u),s.set(h,m)}function d(h){const f=s.get(h);if(f){const p=h.index;p!==null&&f.version<p.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:d}}function fw(n,e,t){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,p){n.drawElements(i,p,s,f*o),t.update(p,i,1)}function c(f,p,v){v!==0&&(n.drawElementsInstanced(i,p,s,f*o,v),t.update(p,i,v))}function d(f,p,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,p,0,s,f,0,v);let m=0;for(let u=0;u<v;u++)m+=p[u];t.update(m,i,1)}function h(f,p,v,y){if(v===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let u=0;u<f.length;u++)c(f[u]/o,p[u],y[u]);else{m.multiDrawElementsInstancedWEBGL(i,p,0,s,f,0,y,0,v);let u=0;for(let g=0;g<v;g++)u+=p[g]*y[g];t.update(u,i,1)}}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function pw(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function mw(n,e,t){const i=new WeakMap,r=new ut;function s(o,a,l){const c=o.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=d!==void 0?d.length:0;let f=i.get(a);if(f===void 0||f.count!==h){let S=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",S)};var p=S;f!==void 0&&f.texture.dispose();const v=a.morphAttributes.position!==void 0,y=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,u=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let x=0;v===!0&&(x=1),y===!0&&(x=2),m===!0&&(x=3);let w=a.attributes.position.count*x,T=1;w>e.maxTextureSize&&(T=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const A=new Float32Array(w*T*4*h),C=new r_(A,w,T,h);C.type=Mi,C.needsUpdate=!0;const M=x*4;for(let P=0;P<h;P++){const B=u[P],z=g[P],V=_[P],Y=w*T*4*P;for(let X=0;X<B.count;X++){const J=X*M;v===!0&&(r.fromBufferAttribute(B,X),A[Y+J+0]=r.x,A[Y+J+1]=r.y,A[Y+J+2]=r.z,A[Y+J+3]=0),y===!0&&(r.fromBufferAttribute(z,X),A[Y+J+4]=r.x,A[Y+J+5]=r.y,A[Y+J+6]=r.z,A[Y+J+7]=0),m===!0&&(r.fromBufferAttribute(V,X),A[Y+J+8]=r.x,A[Y+J+9]=r.y,A[Y+J+10]=r.z,A[Y+J+11]=V.itemSize===4?r.w:1)}}f={count:h,texture:C,size:new $e(w,T)},i.set(a,f),a.addEventListener("dispose",S)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let v=0;for(let m=0;m<c.length;m++)v+=c[m];const y=a.morphTargetsRelative?1:1-v;l.getUniforms().setValue(n,"morphTargetBaseInfluence",y),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:s}}function gw(n,e,t,i){let r=new WeakMap;function s(l){const c=i.render.frame,d=l.geometry,h=e.get(l,d);if(r.get(h)!==c&&(e.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),r.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;r.get(f)!==c&&(f.update(),r.set(f,c))}return h}function o(){r=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:s,dispose:o}}class f_ extends on{constructor(e,t,i,r,s,o,a,l,c,d=Ts){if(d!==Ts&&d!==ks)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&d===Ts&&(i=Fr),i===void 0&&d===ks&&(i=Fs),super(null,r,s,o,a,l,d,i,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Zn,this.minFilter=l!==void 0?l:Zn,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const p_=new on,em=new f_(1,1),m_=new r_,g_=new nS,__=new u_,tm=[],nm=[],im=new Float32Array(16),rm=new Float32Array(9),sm=new Float32Array(4);function js(n,e,t){const i=n[0];if(i<=0||i>0)return n;const r=e*t;let s=tm[r];if(s===void 0&&(s=new Float32Array(r),tm[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function Nt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function Ut(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function ic(n,e){let t=nm[e];t===void 0&&(t=new Int32Array(e),nm[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function _w(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function vw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2fv(this.addr,e),Ut(t,e)}}function xw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;n.uniform3fv(this.addr,e),Ut(t,e)}}function yw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4fv(this.addr,e),Ut(t,e)}}function Sw(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,i))return;sm.set(i),n.uniformMatrix2fv(this.addr,!1,sm),Ut(t,i)}}function Mw(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,i))return;rm.set(i),n.uniformMatrix3fv(this.addr,!1,rm),Ut(t,i)}}function ww(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Nt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),Ut(t,e)}else{if(Nt(t,i))return;im.set(i),n.uniformMatrix4fv(this.addr,!1,im),Ut(t,i)}}function Ew(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Tw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2iv(this.addr,e),Ut(t,e)}}function Aw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;n.uniform3iv(this.addr,e),Ut(t,e)}}function bw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4iv(this.addr,e),Ut(t,e)}}function Cw(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Rw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;n.uniform2uiv(this.addr,e),Ut(t,e)}}function Pw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;n.uniform3uiv(this.addr,e),Ut(t,e)}}function Lw(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;n.uniform4uiv(this.addr,e),Ut(t,e)}}function Dw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(em.compareFunction=t_,s=em):s=p_,t.setTexture2D(e||s,r)}function Iw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||g_,r)}function Nw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||__,r)}function Uw(n,e,t){const i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||m_,r)}function zw(n){switch(n){case 5126:return _w;case 35664:return vw;case 35665:return xw;case 35666:return yw;case 35674:return Sw;case 35675:return Mw;case 35676:return ww;case 5124:case 35670:return Ew;case 35667:case 35671:return Tw;case 35668:case 35672:return Aw;case 35669:case 35673:return bw;case 5125:return Cw;case 36294:return Rw;case 36295:return Pw;case 36296:return Lw;case 35678:case 36198:case 36298:case 36306:case 35682:return Dw;case 35679:case 36299:case 36307:return Iw;case 35680:case 36300:case 36308:case 36293:return Nw;case 36289:case 36303:case 36311:case 36292:return Uw}}function Fw(n,e){n.uniform1fv(this.addr,e)}function kw(n,e){const t=js(e,this.size,2);n.uniform2fv(this.addr,t)}function Ow(n,e){const t=js(e,this.size,3);n.uniform3fv(this.addr,t)}function Bw(n,e){const t=js(e,this.size,4);n.uniform4fv(this.addr,t)}function Hw(n,e){const t=js(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Vw(n,e){const t=js(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Gw(n,e){const t=js(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Ww(n,e){n.uniform1iv(this.addr,e)}function Xw(n,e){n.uniform2iv(this.addr,e)}function jw(n,e){n.uniform3iv(this.addr,e)}function Yw(n,e){n.uniform4iv(this.addr,e)}function qw(n,e){n.uniform1uiv(this.addr,e)}function $w(n,e){n.uniform2uiv(this.addr,e)}function Kw(n,e){n.uniform3uiv(this.addr,e)}function Zw(n,e){n.uniform4uiv(this.addr,e)}function Qw(n,e,t){const i=this.cache,r=e.length,s=ic(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let o=0;o!==r;++o)t.setTexture2D(e[o]||p_,s[o])}function Jw(n,e,t){const i=this.cache,r=e.length,s=ic(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||g_,s[o])}function eE(n,e,t){const i=this.cache,r=e.length,s=ic(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||__,s[o])}function tE(n,e,t){const i=this.cache,r=e.length,s=ic(t,r);Nt(i,s)||(n.uniform1iv(this.addr,s),Ut(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||m_,s[o])}function nE(n){switch(n){case 5126:return Fw;case 35664:return kw;case 35665:return Ow;case 35666:return Bw;case 35674:return Hw;case 35675:return Vw;case 35676:return Gw;case 5124:case 35670:return Ww;case 35667:case 35671:return Xw;case 35668:case 35672:return jw;case 35669:case 35673:return Yw;case 5125:return qw;case 36294:return $w;case 36295:return Kw;case 36296:return Zw;case 35678:case 36198:case 36298:case 36306:case 35682:return Qw;case 35679:case 36299:case 36307:return Jw;case 35680:case 36300:case 36308:case 36293:return eE;case 36289:case 36303:case 36311:case 36292:return tE}}class iE{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=zw(t.type)}}class rE{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=nE(t.type)}}class sE{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,t[a.id],i)}}}const ou=/(\w+)(\])?(\[|\.)?/g;function om(n,e){n.seq.push(e),n.map[e.id]=e}function oE(n,e,t){const i=n.name,r=i.length;for(ou.lastIndex=0;;){const s=ou.exec(i),o=ou.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){om(t,c===void 0?new iE(a,n,e):new rE(a,n,e));break}else{let h=t.map[a];h===void 0&&(h=new sE(a),om(t,h)),t=h}}}class ll{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(t,r),o=e.getUniformLocation(t,s.name);oE(s,o,this)}}setValue(e,t,i,r){const s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){const r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){const a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in t&&i.push(o)}return i}}function am(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const aE=37297;let lE=0;function cE(n,e){const t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}const lm=new Oe;function uE(n){Je._getMatrix(lm,Je.workingColorSpace,n);const e=`mat3( ${lm.elements.map(t=>t.toFixed(4))} )`;switch(Je.getTransfer(n)){case tc:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function cm(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=n.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+cE(n.getShaderSource(e),o)}else return r}function dE(n,e){const t=uE(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function hE(n,e){let t;switch(e){case Py:t="Linear";break;case Ly:t="Reinhard";break;case Dy:t="Cineon";break;case Vg:t="ACESFilmic";break;case Ny:t="AgX";break;case Uy:t="Neutral";break;case Iy:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Va=new I;function fE(){Je.getLuminanceCoefficients(Va);const n=Va.x.toFixed(4),e=Va.y.toFixed(4),t=Va.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function pE(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(go).join(`
`)}function mE(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function gE(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(e,r),o=s.name;let a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function go(n){return n!==""}function um(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function dm(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const _E=/^[ \t]*#include +<([\w\d./]+)>/gm;function Wd(n){return n.replace(_E,xE)}const vE=new Map;function xE(n,e){let t=He[e];if(t===void 0){const i=vE.get(e);if(i!==void 0)t=He[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Wd(t)}const yE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function hm(n){return n.replace(yE,SE)}function SE(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function fm(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function ME(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Og?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===Bg?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===gi&&(e="SHADOWMAP_TYPE_VSM"),e}function wE(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Us:case zs:e="ENVMAP_TYPE_CUBE";break;case ec:e="ENVMAP_TYPE_CUBE_UV";break}return e}function EE(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case zs:e="ENVMAP_MODE_REFRACTION";break}return e}function TE(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Hg:e="ENVMAP_BLENDING_MULTIPLY";break;case Cy:e="ENVMAP_BLENDING_MIX";break;case Ry:e="ENVMAP_BLENDING_ADD";break}return e}function AE(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:i,maxMip:t}}function bE(n,e,t,i){const r=n.getContext(),s=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=ME(t),c=wE(t),d=EE(t),h=TE(t),f=AE(t),p=pE(t),v=mE(s),y=r.createProgram();let m,u,g=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(go).join(`
`),m.length>0&&(m+=`
`),u=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v].filter(go).join(`
`),u.length>0&&(u+=`
`)):(m=[fm(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(go).join(`
`),u=[fm(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,v,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ir?"#define TONE_MAPPING":"",t.toneMapping!==ir?He.tonemapping_pars_fragment:"",t.toneMapping!==ir?hE("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",He.colorspace_pars_fragment,dE("linearToOutputTexel",t.outputColorSpace),fE(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(go).join(`
`)),o=Wd(o),o=um(o,t),o=dm(o,t),a=Wd(a),a=um(a,t),a=dm(a,t),o=hm(o),a=hm(a),t.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,u=["#define varying in",t.glslVersion===Ap?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ap?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+u);const _=g+m+o,x=g+u+a,w=am(r,r.VERTEX_SHADER,_),T=am(r,r.FRAGMENT_SHADER,x);r.attachShader(y,w),r.attachShader(y,T),t.index0AttributeName!==void 0?r.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function A(P){if(n.debug.checkShaderErrors){const B=r.getProgramInfoLog(y).trim(),z=r.getShaderInfoLog(w).trim(),V=r.getShaderInfoLog(T).trim();let Y=!0,X=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(Y=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,y,w,T);else{const J=cm(r,w,"vertex"),D=cm(r,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+J+`
`+D)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(z===""||V==="")&&(X=!1);X&&(P.diagnostics={runnable:Y,programLog:B,vertexShader:{log:z,prefix:m},fragmentShader:{log:V,prefix:u}})}r.deleteShader(w),r.deleteShader(T),C=new ll(r,y),M=gE(r,y)}let C;this.getUniforms=function(){return C===void 0&&A(this),C};let M;this.getAttributes=function(){return M===void 0&&A(this),M};let S=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return S===!1&&(S=r.getProgramParameter(y,aE)),S},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=lE++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=w,this.fragmentShader=T,this}let CE=0;class RE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(t),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new PE(e),t.set(e,i)),i}}class PE{constructor(e){this.id=CE++,this.code=e,this.usedTimes=0}}function LE(n,e,t,i,r,s,o){const a=new qh,l=new RE,c=new Set,d=[],h=r.logarithmicDepthBuffer,f=r.vertexTextures;let p=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,S,P,B,z){const V=B.fog,Y=z.geometry,X=M.isMeshStandardMaterial?B.environment:null,J=(M.isMeshStandardMaterial?t:e).get(M.envMap||X),D=J&&J.mapping===ec?J.image.height:null,$=v[M.type];M.precision!==null&&(p=r.getMaxPrecision(M.precision),p!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const ee=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,ce=ee!==void 0?ee.length:0;let ye=0;Y.morphAttributes.position!==void 0&&(ye=1),Y.morphAttributes.normal!==void 0&&(ye=2),Y.morphAttributes.color!==void 0&&(ye=3);let Ge,q,se,pe;if($){const at=ni[$];Ge=at.vertexShader,q=at.fragmentShader}else Ge=M.vertexShader,q=M.fragmentShader,l.update(M),se=l.getVertexShaderID(M),pe=l.getFragmentShaderID(M);const ue=n.getRenderTarget(),Pe=n.state.buffers.depth.getReversed(),De=z.isInstancedMesh===!0,ze=z.isBatchedMesh===!0,pt=!!M.map,je=!!M.matcap,mt=!!J,U=!!M.aoMap,Jt=!!M.lightMap,Ve=!!M.bumpMap,We=!!M.normalMap,Ce=!!M.displacementMap,nt=!!M.emissiveMap,Re=!!M.metalnessMap,R=!!M.roughnessMap,E=M.anisotropy>0,H=M.clearcoat>0,Q=M.dispersion>0,ne=M.iridescence>0,Z=M.sheen>0,we=M.transmission>0,he=E&&!!M.anisotropyMap,_e=H&&!!M.clearcoatMap,Ze=H&&!!M.clearcoatNormalMap,ae=H&&!!M.clearcoatRoughnessMap,Se=ne&&!!M.iridescenceMap,Le=ne&&!!M.iridescenceThicknessMap,Ie=Z&&!!M.sheenColorMap,Me=Z&&!!M.sheenRoughnessMap,Ke=!!M.specularMap,Be=!!M.specularColorMap,dt=!!M.specularIntensityMap,N=we&&!!M.transmissionMap,fe=we&&!!M.thicknessMap,j=!!M.gradientMap,te=!!M.alphaMap,ve=M.alphaTest>0,me=!!M.alphaHash,Fe=!!M.extensions;let Tt=ir;M.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(Tt=n.toneMapping);const Xt={shaderID:$,shaderType:M.type,shaderName:M.name,vertexShader:Ge,fragmentShader:q,defines:M.defines,customVertexShaderID:se,customFragmentShaderID:pe,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:ze,batchingColor:ze&&z._colorsTexture!==null,instancing:De,instancingColor:De&&z.instanceColor!==null,instancingMorph:De&&z.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ue===null?n.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:Gs,alphaToCoverage:!!M.alphaToCoverage,map:pt,matcap:je,envMap:mt,envMapMode:mt&&J.mapping,envMapCubeUVHeight:D,aoMap:U,lightMap:Jt,bumpMap:Ve,normalMap:We,displacementMap:f&&Ce,emissiveMap:nt,normalMapObjectSpace:We&&M.normalMapType===Oy,normalMapTangentSpace:We&&M.normalMapType===e_,metalnessMap:Re,roughnessMap:R,anisotropy:E,anisotropyMap:he,clearcoat:H,clearcoatMap:_e,clearcoatNormalMap:Ze,clearcoatRoughnessMap:ae,dispersion:Q,iridescence:ne,iridescenceMap:Se,iridescenceThicknessMap:Le,sheen:Z,sheenColorMap:Ie,sheenRoughnessMap:Me,specularMap:Ke,specularColorMap:Be,specularIntensityMap:dt,transmission:we,transmissionMap:N,thicknessMap:fe,gradientMap:j,opaque:M.transparent===!1&&M.blending===Es&&M.alphaToCoverage===!1,alphaMap:te,alphaTest:ve,alphaHash:me,combine:M.combine,mapUv:pt&&y(M.map.channel),aoMapUv:U&&y(M.aoMap.channel),lightMapUv:Jt&&y(M.lightMap.channel),bumpMapUv:Ve&&y(M.bumpMap.channel),normalMapUv:We&&y(M.normalMap.channel),displacementMapUv:Ce&&y(M.displacementMap.channel),emissiveMapUv:nt&&y(M.emissiveMap.channel),metalnessMapUv:Re&&y(M.metalnessMap.channel),roughnessMapUv:R&&y(M.roughnessMap.channel),anisotropyMapUv:he&&y(M.anisotropyMap.channel),clearcoatMapUv:_e&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:Ze&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ae&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Se&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:Le&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:Ie&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:Me&&y(M.sheenRoughnessMap.channel),specularMapUv:Ke&&y(M.specularMap.channel),specularColorMapUv:Be&&y(M.specularColorMap.channel),specularIntensityMapUv:dt&&y(M.specularIntensityMap.channel),transmissionMapUv:N&&y(M.transmissionMap.channel),thicknessMapUv:fe&&y(M.thicknessMap.channel),alphaMapUv:te&&y(M.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(We||E),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!Y.attributes.uv&&(pt||te),fog:!!V,useFog:M.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reverseDepthBuffer:Pe,skinning:z.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:ce,morphTextureStride:ye,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:Tt,decodeVideoTexture:pt&&M.map.isVideoTexture===!0&&Je.getTransfer(M.map.colorSpace)===ct,decodeVideoTextureEmissive:nt&&M.emissiveMap.isVideoTexture===!0&&Je.getTransfer(M.emissiveMap.colorSpace)===ct,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===xi,flipSided:M.side===sn,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Fe&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Fe&&M.extensions.multiDraw===!0||ze)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return Xt.vertexUv1s=c.has(1),Xt.vertexUv2s=c.has(2),Xt.vertexUv3s=c.has(3),c.clear(),Xt}function u(M){const S=[];if(M.shaderID?S.push(M.shaderID):(S.push(M.customVertexShaderID),S.push(M.customFragmentShaderID)),M.defines!==void 0)for(const P in M.defines)S.push(P),S.push(M.defines[P]);return M.isRawShaderMaterial===!1&&(g(S,M),_(S,M),S.push(n.outputColorSpace)),S.push(M.customProgramCacheKey),S.join()}function g(M,S){M.push(S.precision),M.push(S.outputColorSpace),M.push(S.envMapMode),M.push(S.envMapCubeUVHeight),M.push(S.mapUv),M.push(S.alphaMapUv),M.push(S.lightMapUv),M.push(S.aoMapUv),M.push(S.bumpMapUv),M.push(S.normalMapUv),M.push(S.displacementMapUv),M.push(S.emissiveMapUv),M.push(S.metalnessMapUv),M.push(S.roughnessMapUv),M.push(S.anisotropyMapUv),M.push(S.clearcoatMapUv),M.push(S.clearcoatNormalMapUv),M.push(S.clearcoatRoughnessMapUv),M.push(S.iridescenceMapUv),M.push(S.iridescenceThicknessMapUv),M.push(S.sheenColorMapUv),M.push(S.sheenRoughnessMapUv),M.push(S.specularMapUv),M.push(S.specularColorMapUv),M.push(S.specularIntensityMapUv),M.push(S.transmissionMapUv),M.push(S.thicknessMapUv),M.push(S.combine),M.push(S.fogExp2),M.push(S.sizeAttenuation),M.push(S.morphTargetsCount),M.push(S.morphAttributeCount),M.push(S.numDirLights),M.push(S.numPointLights),M.push(S.numSpotLights),M.push(S.numSpotLightMaps),M.push(S.numHemiLights),M.push(S.numRectAreaLights),M.push(S.numDirLightShadows),M.push(S.numPointLightShadows),M.push(S.numSpotLightShadows),M.push(S.numSpotLightShadowsWithMaps),M.push(S.numLightProbes),M.push(S.shadowMapType),M.push(S.toneMapping),M.push(S.numClippingPlanes),M.push(S.numClipIntersection),M.push(S.depthPacking)}function _(M,S){a.disableAll(),S.supportsVertexTextures&&a.enable(0),S.instancing&&a.enable(1),S.instancingColor&&a.enable(2),S.instancingMorph&&a.enable(3),S.matcap&&a.enable(4),S.envMap&&a.enable(5),S.normalMapObjectSpace&&a.enable(6),S.normalMapTangentSpace&&a.enable(7),S.clearcoat&&a.enable(8),S.iridescence&&a.enable(9),S.alphaTest&&a.enable(10),S.vertexColors&&a.enable(11),S.vertexAlphas&&a.enable(12),S.vertexUv1s&&a.enable(13),S.vertexUv2s&&a.enable(14),S.vertexUv3s&&a.enable(15),S.vertexTangents&&a.enable(16),S.anisotropy&&a.enable(17),S.alphaHash&&a.enable(18),S.batching&&a.enable(19),S.dispersion&&a.enable(20),S.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),S.fog&&a.enable(0),S.useFog&&a.enable(1),S.flatShading&&a.enable(2),S.logarithmicDepthBuffer&&a.enable(3),S.reverseDepthBuffer&&a.enable(4),S.skinning&&a.enable(5),S.morphTargets&&a.enable(6),S.morphNormals&&a.enable(7),S.morphColors&&a.enable(8),S.premultipliedAlpha&&a.enable(9),S.shadowMapEnabled&&a.enable(10),S.doubleSided&&a.enable(11),S.flipSided&&a.enable(12),S.useDepthPacking&&a.enable(13),S.dithering&&a.enable(14),S.transmission&&a.enable(15),S.sheen&&a.enable(16),S.opaque&&a.enable(17),S.pointsUvs&&a.enable(18),S.decodeVideoTexture&&a.enable(19),S.decodeVideoTextureEmissive&&a.enable(20),S.alphaToCoverage&&a.enable(21),M.push(a.mask)}function x(M){const S=v[M.type];let P;if(S){const B=ni[S];P=pS.clone(B.uniforms)}else P=M.uniforms;return P}function w(M,S){let P;for(let B=0,z=d.length;B<z;B++){const V=d[B];if(V.cacheKey===S){P=V,++P.usedTimes;break}}return P===void 0&&(P=new bE(n,S,M,s),d.push(P)),P}function T(M){if(--M.usedTimes===0){const S=d.indexOf(M);d[S]=d[d.length-1],d.pop(),M.destroy()}}function A(M){l.remove(M)}function C(){l.dispose()}return{getParameters:m,getProgramCacheKey:u,getUniforms:x,acquireProgram:w,releaseProgram:T,releaseShaderCache:A,programs:d,dispose:C}}function DE(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function IE(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function pm(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function mm(){const n=[];let e=0;const t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h,f,p,v,y,m){let u=n[e];return u===void 0?(u={id:h.id,object:h,geometry:f,material:p,groupOrder:v,renderOrder:h.renderOrder,z:y,group:m},n[e]=u):(u.id=h.id,u.object=h,u.geometry=f,u.material=p,u.groupOrder=v,u.renderOrder=h.renderOrder,u.z=y,u.group=m),e++,u}function a(h,f,p,v,y,m){const u=o(h,f,p,v,y,m);p.transmission>0?i.push(u):p.transparent===!0?r.push(u):t.push(u)}function l(h,f,p,v,y,m){const u=o(h,f,p,v,y,m);p.transmission>0?i.unshift(u):p.transparent===!0?r.unshift(u):t.unshift(u)}function c(h,f){t.length>1&&t.sort(h||IE),i.length>1&&i.sort(f||pm),r.length>1&&r.sort(f||pm)}function d(){for(let h=e,f=n.length;h<f;h++){const p=n[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:a,unshift:l,finish:d,sort:c}}function NE(){let n=new WeakMap;function e(i,r){const s=n.get(i);let o;return s===void 0?(o=new mm,n.set(i,[o])):r>=s.length?(o=new mm,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function UE(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new I,color:new qe};break;case"SpotLight":t={position:new I,direction:new I,color:new qe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new qe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new qe,groundColor:new qe};break;case"RectAreaLight":t={color:new qe,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function zE(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new $e,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let FE=0;function kE(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function OE(n){const e=new UE,t=zE(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new I);const r=new I,s=new yt,o=new yt;function a(c){let d=0,h=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let p=0,v=0,y=0,m=0,u=0,g=0,_=0,x=0,w=0,T=0,A=0;c.sort(kE);for(let M=0,S=c.length;M<S;M++){const P=c[M],B=P.color,z=P.intensity,V=P.distance,Y=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)d+=B.r*z,h+=B.g*z,f+=B.b*z;else if(P.isLightProbe){for(let X=0;X<9;X++)i.probe[X].addScaledVector(P.sh.coefficients[X],z);A++}else if(P.isDirectionalLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const J=P.shadow,D=t.get(P);D.shadowIntensity=J.intensity,D.shadowBias=J.bias,D.shadowNormalBias=J.normalBias,D.shadowRadius=J.radius,D.shadowMapSize=J.mapSize,i.directionalShadow[p]=D,i.directionalShadowMap[p]=Y,i.directionalShadowMatrix[p]=P.shadow.matrix,g++}i.directional[p]=X,p++}else if(P.isSpotLight){const X=e.get(P);X.position.setFromMatrixPosition(P.matrixWorld),X.color.copy(B).multiplyScalar(z),X.distance=V,X.coneCos=Math.cos(P.angle),X.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),X.decay=P.decay,i.spot[y]=X;const J=P.shadow;if(P.map&&(i.spotLightMap[w]=P.map,w++,J.updateMatrices(P),P.castShadow&&T++),i.spotLightMatrix[y]=J.matrix,P.castShadow){const D=t.get(P);D.shadowIntensity=J.intensity,D.shadowBias=J.bias,D.shadowNormalBias=J.normalBias,D.shadowRadius=J.radius,D.shadowMapSize=J.mapSize,i.spotShadow[y]=D,i.spotShadowMap[y]=Y,x++}y++}else if(P.isRectAreaLight){const X=e.get(P);X.color.copy(B).multiplyScalar(z),X.halfWidth.set(P.width*.5,0,0),X.halfHeight.set(0,P.height*.5,0),i.rectArea[m]=X,m++}else if(P.isPointLight){const X=e.get(P);if(X.color.copy(P.color).multiplyScalar(P.intensity),X.distance=P.distance,X.decay=P.decay,P.castShadow){const J=P.shadow,D=t.get(P);D.shadowIntensity=J.intensity,D.shadowBias=J.bias,D.shadowNormalBias=J.normalBias,D.shadowRadius=J.radius,D.shadowMapSize=J.mapSize,D.shadowCameraNear=J.camera.near,D.shadowCameraFar=J.camera.far,i.pointShadow[v]=D,i.pointShadowMap[v]=Y,i.pointShadowMatrix[v]=P.shadow.matrix,_++}i.point[v]=X,v++}else if(P.isHemisphereLight){const X=e.get(P);X.skyColor.copy(P.color).multiplyScalar(z),X.groundColor.copy(P.groundColor).multiplyScalar(z),i.hemi[u]=X,u++}}m>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2):(i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=h,i.ambient[2]=f;const C=i.hash;(C.directionalLength!==p||C.pointLength!==v||C.spotLength!==y||C.rectAreaLength!==m||C.hemiLength!==u||C.numDirectionalShadows!==g||C.numPointShadows!==_||C.numSpotShadows!==x||C.numSpotMaps!==w||C.numLightProbes!==A)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=m,i.point.length=v,i.hemi.length=u,i.directionalShadow.length=g,i.directionalShadowMap.length=g,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=x,i.spotShadowMap.length=x,i.directionalShadowMatrix.length=g,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=x+w-T,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=A,C.directionalLength=p,C.pointLength=v,C.spotLength=y,C.rectAreaLength=m,C.hemiLength=u,C.numDirectionalShadows=g,C.numPointShadows=_,C.numSpotShadows=x,C.numSpotMaps=w,C.numLightProbes=A,i.version=FE++)}function l(c,d){let h=0,f=0,p=0,v=0,y=0;const m=d.matrixWorldInverse;for(let u=0,g=c.length;u<g;u++){const _=c[u];if(_.isDirectionalLight){const x=i.directional[h];x.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),h++}else if(_.isSpotLight){const x=i.spot[p];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),x.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),x.direction.sub(r),x.direction.transformDirection(m),p++}else if(_.isRectAreaLight){const x=i.rectArea[v];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),o.identity(),s.copy(_.matrixWorld),s.premultiply(m),o.extractRotation(s),x.halfWidth.set(_.width*.5,0,0),x.halfHeight.set(0,_.height*.5,0),x.halfWidth.applyMatrix4(o),x.halfHeight.applyMatrix4(o),v++}else if(_.isPointLight){const x=i.point[f];x.position.setFromMatrixPosition(_.matrixWorld),x.position.applyMatrix4(m),f++}else if(_.isHemisphereLight){const x=i.hemi[y];x.direction.setFromMatrixPosition(_.matrixWorld),x.direction.transformDirection(m),y++}}}return{setup:a,setupView:l,state:i}}function gm(n){const e=new OE(n),t=[],i=[];function r(d){c.camera=d,t.length=0,i.length=0}function s(d){t.push(d)}function o(d){i.push(d)}function a(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:a,setupLightsView:l,pushLight:s,pushShadow:o}}function BE(n){let e=new WeakMap;function t(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new gm(n),e.set(r,[a])):s>=o.length?(a=new gm(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}class HE extends Xs{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Fy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class VE extends Xs{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const GE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,WE=`uniform sampler2D shadow_pass;
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
}`;function XE(n,e,t){let i=new $h;const r=new $e,s=new $e,o=new ut,a=new HE({depthPacking:ky}),l=new VE,c={},d=t.maxTextureSize,h={[or]:sn,[sn]:or,[xi]:xi},f=new ar({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new $e},radius:{value:4}},vertexShader:GE,fragmentShader:WE}),p=f.clone();p.defines.HORIZONTAL_PASS=1;const v=new Cn;v.setAttribute("position",new ai(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new K(v,f),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Og;let u=this.type;this.render=function(T,A,C){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;const M=n.getRenderTarget(),S=n.getActiveCubeFace(),P=n.getActiveMipmapLevel(),B=n.state;B.setBlending(nr),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const z=u!==gi&&this.type===gi,V=u===gi&&this.type!==gi;for(let Y=0,X=T.length;Y<X;Y++){const J=T[Y],D=J.shadow;if(D===void 0){console.warn("THREE.WebGLShadowMap:",J,"has no shadow.");continue}if(D.autoUpdate===!1&&D.needsUpdate===!1)continue;r.copy(D.mapSize);const $=D.getFrameExtents();if(r.multiply($),s.copy(D.mapSize),(r.x>d||r.y>d)&&(r.x>d&&(s.x=Math.floor(d/$.x),r.x=s.x*$.x,D.mapSize.x=s.x),r.y>d&&(s.y=Math.floor(d/$.y),r.y=s.y*$.y,D.mapSize.y=s.y)),D.map===null||z===!0||V===!0){const ce=this.type!==gi?{minFilter:Zn,magFilter:Zn}:{};D.map!==null&&D.map.dispose(),D.map=new kr(r.x,r.y,ce),D.map.texture.name=J.name+".shadowMap",D.camera.updateProjectionMatrix()}n.setRenderTarget(D.map),n.clear();const ee=D.getViewportCount();for(let ce=0;ce<ee;ce++){const ye=D.getViewport(ce);o.set(s.x*ye.x,s.y*ye.y,s.x*ye.z,s.y*ye.w),B.viewport(o),D.updateMatrices(J,ce),i=D.getFrustum(),x(A,C,D.camera,J,this.type)}D.isPointLightShadow!==!0&&this.type===gi&&g(D,C),D.needsUpdate=!1}u=this.type,m.needsUpdate=!1,n.setRenderTarget(M,S,P)};function g(T,A){const C=e.update(y);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new kr(r.x,r.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(A,null,C,f,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(A,null,C,p,y,null)}function _(T,A,C,M){let S=null;const P=C.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)S=P;else if(S=C.isPointLight===!0?l:a,n.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const B=S.uuid,z=A.uuid;let V=c[B];V===void 0&&(V={},c[B]=V);let Y=V[z];Y===void 0&&(Y=S.clone(),V[z]=Y,A.addEventListener("dispose",w)),S=Y}if(S.visible=A.visible,S.wireframe=A.wireframe,M===gi?S.side=A.shadowSide!==null?A.shadowSide:A.side:S.side=A.shadowSide!==null?A.shadowSide:h[A.side],S.alphaMap=A.alphaMap,S.alphaTest=A.alphaTest,S.map=A.map,S.clipShadows=A.clipShadows,S.clippingPlanes=A.clippingPlanes,S.clipIntersection=A.clipIntersection,S.displacementMap=A.displacementMap,S.displacementScale=A.displacementScale,S.displacementBias=A.displacementBias,S.wireframeLinewidth=A.wireframeLinewidth,S.linewidth=A.linewidth,C.isPointLight===!0&&S.isMeshDistanceMaterial===!0){const B=n.properties.get(S);B.light=C}return S}function x(T,A,C,M,S){if(T.visible===!1)return;if(T.layers.test(A.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&S===gi)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,T.matrixWorld);const z=e.update(T),V=T.material;if(Array.isArray(V)){const Y=z.groups;for(let X=0,J=Y.length;X<J;X++){const D=Y[X],$=V[D.materialIndex];if($&&$.visible){const ee=_(T,$,M,S);T.onBeforeShadow(n,T,A,C,z,ee,D),n.renderBufferDirect(C,null,z,ee,T,D),T.onAfterShadow(n,T,A,C,z,ee,D)}}}else if(V.visible){const Y=_(T,V,M,S);T.onBeforeShadow(n,T,A,C,z,Y,null),n.renderBufferDirect(C,null,z,Y,T,null),T.onAfterShadow(n,T,A,C,z,Y,null)}}const B=T.children;for(let z=0,V=B.length;z<V;z++)x(B[z],A,C,M,S)}function w(T){T.target.removeEventListener("dispose",w);for(const C in c){const M=c[C],S=T.target.uuid;S in M&&(M[S].dispose(),delete M[S])}}}const jE={[ad]:ld,[cd]:hd,[ud]:fd,[Ns]:dd,[ld]:ad,[hd]:cd,[fd]:ud,[dd]:Ns};function YE(n,e){function t(){let N=!1;const fe=new ut;let j=null;const te=new ut(0,0,0,0);return{setMask:function(ve){j!==ve&&!N&&(n.colorMask(ve,ve,ve,ve),j=ve)},setLocked:function(ve){N=ve},setClear:function(ve,me,Fe,Tt,Xt){Xt===!0&&(ve*=Tt,me*=Tt,Fe*=Tt),fe.set(ve,me,Fe,Tt),te.equals(fe)===!1&&(n.clearColor(ve,me,Fe,Tt),te.copy(fe))},reset:function(){N=!1,j=null,te.set(-1,0,0,0)}}}function i(){let N=!1,fe=!1,j=null,te=null,ve=null;return{setReversed:function(me){if(fe!==me){const Fe=e.get("EXT_clip_control");fe?Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.ZERO_TO_ONE_EXT):Fe.clipControlEXT(Fe.LOWER_LEFT_EXT,Fe.NEGATIVE_ONE_TO_ONE_EXT);const Tt=ve;ve=null,this.setClear(Tt)}fe=me},getReversed:function(){return fe},setTest:function(me){me?ue(n.DEPTH_TEST):Pe(n.DEPTH_TEST)},setMask:function(me){j!==me&&!N&&(n.depthMask(me),j=me)},setFunc:function(me){if(fe&&(me=jE[me]),te!==me){switch(me){case ad:n.depthFunc(n.NEVER);break;case ld:n.depthFunc(n.ALWAYS);break;case cd:n.depthFunc(n.LESS);break;case Ns:n.depthFunc(n.LEQUAL);break;case ud:n.depthFunc(n.EQUAL);break;case dd:n.depthFunc(n.GEQUAL);break;case hd:n.depthFunc(n.GREATER);break;case fd:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}te=me}},setLocked:function(me){N=me},setClear:function(me){ve!==me&&(fe&&(me=1-me),n.clearDepth(me),ve=me)},reset:function(){N=!1,j=null,te=null,ve=null,fe=!1}}}function r(){let N=!1,fe=null,j=null,te=null,ve=null,me=null,Fe=null,Tt=null,Xt=null;return{setTest:function(at){N||(at?ue(n.STENCIL_TEST):Pe(n.STENCIL_TEST))},setMask:function(at){fe!==at&&!N&&(n.stencilMask(at),fe=at)},setFunc:function(at,kn,ci){(j!==at||te!==kn||ve!==ci)&&(n.stencilFunc(at,kn,ci),j=at,te=kn,ve=ci)},setOp:function(at,kn,ci){(me!==at||Fe!==kn||Tt!==ci)&&(n.stencilOp(at,kn,ci),me=at,Fe=kn,Tt=ci)},setLocked:function(at){N=at},setClear:function(at){Xt!==at&&(n.clearStencil(at),Xt=at)},reset:function(){N=!1,fe=null,j=null,te=null,ve=null,me=null,Fe=null,Tt=null,Xt=null}}}const s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let d={},h={},f=new WeakMap,p=[],v=null,y=!1,m=null,u=null,g=null,_=null,x=null,w=null,T=null,A=new qe(0,0,0),C=0,M=!1,S=null,P=null,B=null,z=null,V=null;const Y=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,J=0;const D=n.getParameter(n.VERSION);D.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(D)[1]),X=J>=1):D.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(D)[1]),X=J>=2);let $=null,ee={};const ce=n.getParameter(n.SCISSOR_BOX),ye=n.getParameter(n.VIEWPORT),Ge=new ut().fromArray(ce),q=new ut().fromArray(ye);function se(N,fe,j,te){const ve=new Uint8Array(4),me=n.createTexture();n.bindTexture(N,me),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Fe=0;Fe<j;Fe++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(fe,0,n.RGBA,1,1,te,0,n.RGBA,n.UNSIGNED_BYTE,ve):n.texImage2D(fe+Fe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ve);return me}const pe={};pe[n.TEXTURE_2D]=se(n.TEXTURE_2D,n.TEXTURE_2D,1),pe[n.TEXTURE_CUBE_MAP]=se(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),pe[n.TEXTURE_2D_ARRAY]=se(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),pe[n.TEXTURE_3D]=se(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ue(n.DEPTH_TEST),o.setFunc(Ns),Ve(!1),We(yp),ue(n.CULL_FACE),U(nr);function ue(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function Pe(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function De(N,fe){return h[N]!==fe?(n.bindFramebuffer(N,fe),h[N]=fe,N===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=fe),N===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=fe),!0):!1}function ze(N,fe){let j=p,te=!1;if(N){j=f.get(fe),j===void 0&&(j=[],f.set(fe,j));const ve=N.textures;if(j.length!==ve.length||j[0]!==n.COLOR_ATTACHMENT0){for(let me=0,Fe=ve.length;me<Fe;me++)j[me]=n.COLOR_ATTACHMENT0+me;j.length=ve.length,te=!0}}else j[0]!==n.BACK&&(j[0]=n.BACK,te=!0);te&&n.drawBuffers(j)}function pt(N){return v!==N?(n.useProgram(N),v=N,!0):!1}const je={[Mr]:n.FUNC_ADD,[dy]:n.FUNC_SUBTRACT,[hy]:n.FUNC_REVERSE_SUBTRACT};je[fy]=n.MIN,je[py]=n.MAX;const mt={[my]:n.ZERO,[gy]:n.ONE,[_y]:n.SRC_COLOR,[sd]:n.SRC_ALPHA,[wy]:n.SRC_ALPHA_SATURATE,[Sy]:n.DST_COLOR,[xy]:n.DST_ALPHA,[vy]:n.ONE_MINUS_SRC_COLOR,[od]:n.ONE_MINUS_SRC_ALPHA,[My]:n.ONE_MINUS_DST_COLOR,[yy]:n.ONE_MINUS_DST_ALPHA,[Ey]:n.CONSTANT_COLOR,[Ty]:n.ONE_MINUS_CONSTANT_COLOR,[Ay]:n.CONSTANT_ALPHA,[by]:n.ONE_MINUS_CONSTANT_ALPHA};function U(N,fe,j,te,ve,me,Fe,Tt,Xt,at){if(N===nr){y===!0&&(Pe(n.BLEND),y=!1);return}if(y===!1&&(ue(n.BLEND),y=!0),N!==uy){if(N!==m||at!==M){if((u!==Mr||x!==Mr)&&(n.blendEquation(n.FUNC_ADD),u=Mr,x=Mr),at)switch(N){case Es:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Sp:n.blendFunc(n.ONE,n.ONE);break;case Mp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case wp:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Es:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Sp:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case Mp:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case wp:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}g=null,_=null,w=null,T=null,A.set(0,0,0),C=0,m=N,M=at}return}ve=ve||fe,me=me||j,Fe=Fe||te,(fe!==u||ve!==x)&&(n.blendEquationSeparate(je[fe],je[ve]),u=fe,x=ve),(j!==g||te!==_||me!==w||Fe!==T)&&(n.blendFuncSeparate(mt[j],mt[te],mt[me],mt[Fe]),g=j,_=te,w=me,T=Fe),(Tt.equals(A)===!1||Xt!==C)&&(n.blendColor(Tt.r,Tt.g,Tt.b,Xt),A.copy(Tt),C=Xt),m=N,M=!1}function Jt(N,fe){N.side===xi?Pe(n.CULL_FACE):ue(n.CULL_FACE);let j=N.side===sn;fe&&(j=!j),Ve(j),N.blending===Es&&N.transparent===!1?U(nr):U(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const te=N.stencilWrite;a.setTest(te),te&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),nt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ue(n.SAMPLE_ALPHA_TO_COVERAGE):Pe(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ve(N){S!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),S=N)}function We(N){N!==ly?(ue(n.CULL_FACE),N!==P&&(N===yp?n.cullFace(n.BACK):N===cy?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Pe(n.CULL_FACE),P=N}function Ce(N){N!==B&&(X&&n.lineWidth(N),B=N)}function nt(N,fe,j){N?(ue(n.POLYGON_OFFSET_FILL),(z!==fe||V!==j)&&(n.polygonOffset(fe,j),z=fe,V=j)):Pe(n.POLYGON_OFFSET_FILL)}function Re(N){N?ue(n.SCISSOR_TEST):Pe(n.SCISSOR_TEST)}function R(N){N===void 0&&(N=n.TEXTURE0+Y-1),$!==N&&(n.activeTexture(N),$=N)}function E(N,fe,j){j===void 0&&($===null?j=n.TEXTURE0+Y-1:j=$);let te=ee[j];te===void 0&&(te={type:void 0,texture:void 0},ee[j]=te),(te.type!==N||te.texture!==fe)&&($!==j&&(n.activeTexture(j),$=j),n.bindTexture(N,fe||pe[N]),te.type=N,te.texture=fe)}function H(){const N=ee[$];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function Q(){try{n.compressedTexImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ne(){try{n.compressedTexImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Z(){try{n.texSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function we(){try{n.texSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function he(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function _e(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ze(){try{n.texStorage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ae(){try{n.texStorage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Se(){try{n.texImage2D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Le(){try{n.texImage3D.apply(n,arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ie(N){Ge.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),Ge.copy(N))}function Me(N){q.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),q.copy(N))}function Ke(N,fe){let j=c.get(fe);j===void 0&&(j=new WeakMap,c.set(fe,j));let te=j.get(N);te===void 0&&(te=n.getUniformBlockIndex(fe,N.name),j.set(N,te))}function Be(N,fe){const te=c.get(fe).get(N);l.get(fe)!==te&&(n.uniformBlockBinding(fe,te,N.__bindingPointIndex),l.set(fe,te))}function dt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},$=null,ee={},h={},f=new WeakMap,p=[],v=null,y=!1,m=null,u=null,g=null,_=null,x=null,w=null,T=null,A=new qe(0,0,0),C=0,M=!1,S=null,P=null,B=null,z=null,V=null,Ge.set(0,0,n.canvas.width,n.canvas.height),q.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ue,disable:Pe,bindFramebuffer:De,drawBuffers:ze,useProgram:pt,setBlending:U,setMaterial:Jt,setFlipSided:Ve,setCullFace:We,setLineWidth:Ce,setPolygonOffset:nt,setScissorTest:Re,activeTexture:R,bindTexture:E,unbindTexture:H,compressedTexImage2D:Q,compressedTexImage3D:ne,texImage2D:Se,texImage3D:Le,updateUBOMapping:Ke,uniformBlockBinding:Be,texStorage2D:Ze,texStorage3D:ae,texSubImage2D:Z,texSubImage3D:we,compressedTexSubImage2D:he,compressedTexSubImage3D:_e,scissor:Ie,viewport:Me,reset:dt}}function _m(n,e,t,i){const r=qE(i);switch(t){case Yg:return n*e;case $g:return n*e;case Kg:return n*e*2;case Zg:return n*e/r.components*r.byteLength;case Wh:return n*e/r.components*r.byteLength;case Qg:return n*e*2/r.components*r.byteLength;case Xh:return n*e*2/r.components*r.byteLength;case qg:return n*e*3/r.components*r.byteLength;case qn:return n*e*4/r.components*r.byteLength;case jh:return n*e*4/r.components*r.byteLength;case il:case rl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case sl:case ol:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case vd:case yd:return Math.max(n,16)*Math.max(e,8)/4;case _d:case xd:return Math.max(n,8)*Math.max(e,8)/2;case Sd:case Md:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case wd:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ed:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Td:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ad:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case bd:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Cd:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Rd:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Pd:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ld:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Dd:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case Id:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case Nd:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case Ud:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case zd:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case Fd:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case al:case kd:case Od:return Math.ceil(n/4)*Math.ceil(e/4)*16;case Jg:case Bd:return Math.ceil(n/4)*Math.ceil(e/4)*8;case Hd:case Vd:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function qE(n){switch(n){case Pi:case Wg:return{byteLength:1,components:1};case Wo:case Xg:case Zo:return{byteLength:2,components:1};case Vh:case Gh:return{byteLength:2,components:4};case Fr:case Hh:case Mi:return{byteLength:4,components:1};case jg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function $E(n,e,t,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new $e,d=new WeakMap;let h;const f=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(R,E){return p?new OffscreenCanvas(R,E):Nl("canvas")}function y(R,E,H){let Q=1;const ne=Re(R);if((ne.width>H||ne.height>H)&&(Q=H/Math.max(ne.width,ne.height)),Q<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){const Z=Math.floor(Q*ne.width),we=Math.floor(Q*ne.height);h===void 0&&(h=v(Z,we));const he=E?v(Z,we):h;return he.width=Z,he.height=we,he.getContext("2d").drawImage(R,0,0,Z,we),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+Z+"x"+we+")."),he}else return"data"in R&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),R;return R}function m(R){return R.generateMipmaps}function u(R){n.generateMipmap(R)}function g(R){return R.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?n.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function _(R,E,H,Q,ne=!1){if(R!==null){if(n[R]!==void 0)return n[R];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Z=E;if(E===n.RED&&(H===n.FLOAT&&(Z=n.R32F),H===n.HALF_FLOAT&&(Z=n.R16F),H===n.UNSIGNED_BYTE&&(Z=n.R8)),E===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(Z=n.R8UI),H===n.UNSIGNED_SHORT&&(Z=n.R16UI),H===n.UNSIGNED_INT&&(Z=n.R32UI),H===n.BYTE&&(Z=n.R8I),H===n.SHORT&&(Z=n.R16I),H===n.INT&&(Z=n.R32I)),E===n.RG&&(H===n.FLOAT&&(Z=n.RG32F),H===n.HALF_FLOAT&&(Z=n.RG16F),H===n.UNSIGNED_BYTE&&(Z=n.RG8)),E===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(Z=n.RG8UI),H===n.UNSIGNED_SHORT&&(Z=n.RG16UI),H===n.UNSIGNED_INT&&(Z=n.RG32UI),H===n.BYTE&&(Z=n.RG8I),H===n.SHORT&&(Z=n.RG16I),H===n.INT&&(Z=n.RG32I)),E===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(Z=n.RGB8UI),H===n.UNSIGNED_SHORT&&(Z=n.RGB16UI),H===n.UNSIGNED_INT&&(Z=n.RGB32UI),H===n.BYTE&&(Z=n.RGB8I),H===n.SHORT&&(Z=n.RGB16I),H===n.INT&&(Z=n.RGB32I)),E===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(Z=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(Z=n.RGBA16UI),H===n.UNSIGNED_INT&&(Z=n.RGBA32UI),H===n.BYTE&&(Z=n.RGBA8I),H===n.SHORT&&(Z=n.RGBA16I),H===n.INT&&(Z=n.RGBA32I)),E===n.RGB&&H===n.UNSIGNED_INT_5_9_9_9_REV&&(Z=n.RGB9_E5),E===n.RGBA){const we=ne?tc:Je.getTransfer(Q);H===n.FLOAT&&(Z=n.RGBA32F),H===n.HALF_FLOAT&&(Z=n.RGBA16F),H===n.UNSIGNED_BYTE&&(Z=we===ct?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(Z=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(Z=n.RGB5_A1)}return(Z===n.R16F||Z===n.R32F||Z===n.RG16F||Z===n.RG32F||Z===n.RGBA16F||Z===n.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function x(R,E){let H;return R?E===null||E===Fr||E===Fs?H=n.DEPTH24_STENCIL8:E===Mi?H=n.DEPTH32F_STENCIL8:E===Wo&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Fr||E===Fs?H=n.DEPTH_COMPONENT24:E===Mi?H=n.DEPTH_COMPONENT32F:E===Wo&&(H=n.DEPTH_COMPONENT16),H}function w(R,E){return m(R)===!0||R.isFramebufferTexture&&R.minFilter!==Zn&&R.minFilter!==ri?Math.log2(Math.max(E.width,E.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?E.mipmaps.length:1}function T(R){const E=R.target;E.removeEventListener("dispose",T),C(E),E.isVideoTexture&&d.delete(E)}function A(R){const E=R.target;E.removeEventListener("dispose",A),S(E)}function C(R){const E=i.get(R);if(E.__webglInit===void 0)return;const H=R.source,Q=f.get(H);if(Q){const ne=Q[E.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&M(R),Object.keys(Q).length===0&&f.delete(H)}i.remove(R)}function M(R){const E=i.get(R);n.deleteTexture(E.__webglTexture);const H=R.source,Q=f.get(H);delete Q[E.__cacheKey],o.memory.textures--}function S(R){const E=i.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),i.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(E.__webglFramebuffer[Q]))for(let ne=0;ne<E.__webglFramebuffer[Q].length;ne++)n.deleteFramebuffer(E.__webglFramebuffer[Q][ne]);else n.deleteFramebuffer(E.__webglFramebuffer[Q]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[Q])}else{if(Array.isArray(E.__webglFramebuffer))for(let Q=0;Q<E.__webglFramebuffer.length;Q++)n.deleteFramebuffer(E.__webglFramebuffer[Q]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let Q=0;Q<E.__webglColorRenderbuffer.length;Q++)E.__webglColorRenderbuffer[Q]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[Q]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const H=R.textures;for(let Q=0,ne=H.length;Q<ne;Q++){const Z=i.get(H[Q]);Z.__webglTexture&&(n.deleteTexture(Z.__webglTexture),o.memory.textures--),i.remove(H[Q])}i.remove(R)}let P=0;function B(){P=0}function z(){const R=P;return R>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+R+" texture units while this GPU supports only "+r.maxTextures),P+=1,R}function V(R){const E=[];return E.push(R.wrapS),E.push(R.wrapT),E.push(R.wrapR||0),E.push(R.magFilter),E.push(R.minFilter),E.push(R.anisotropy),E.push(R.internalFormat),E.push(R.format),E.push(R.type),E.push(R.generateMipmaps),E.push(R.premultiplyAlpha),E.push(R.flipY),E.push(R.unpackAlignment),E.push(R.colorSpace),E.join()}function Y(R,E){const H=i.get(R);if(R.isVideoTexture&&Ce(R),R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){const Q=R.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{q(H,R,E);return}}t.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+E)}function X(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){q(H,R,E);return}t.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+E)}function J(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){q(H,R,E);return}t.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+E)}function D(R,E){const H=i.get(R);if(R.version>0&&H.__version!==R.version){se(H,R,E);return}t.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+E)}const $={[Go]:n.REPEAT,[br]:n.CLAMP_TO_EDGE,[gd]:n.MIRRORED_REPEAT},ee={[Zn]:n.NEAREST,[zy]:n.NEAREST_MIPMAP_NEAREST,[Ma]:n.NEAREST_MIPMAP_LINEAR,[ri]:n.LINEAR,[Dc]:n.LINEAR_MIPMAP_NEAREST,[Cr]:n.LINEAR_MIPMAP_LINEAR},ce={[By]:n.NEVER,[jy]:n.ALWAYS,[Hy]:n.LESS,[t_]:n.LEQUAL,[Vy]:n.EQUAL,[Xy]:n.GEQUAL,[Gy]:n.GREATER,[Wy]:n.NOTEQUAL};function ye(R,E){if(E.type===Mi&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===ri||E.magFilter===Dc||E.magFilter===Ma||E.magFilter===Cr||E.minFilter===ri||E.minFilter===Dc||E.minFilter===Ma||E.minFilter===Cr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(R,n.TEXTURE_WRAP_S,$[E.wrapS]),n.texParameteri(R,n.TEXTURE_WRAP_T,$[E.wrapT]),(R===n.TEXTURE_3D||R===n.TEXTURE_2D_ARRAY)&&n.texParameteri(R,n.TEXTURE_WRAP_R,$[E.wrapR]),n.texParameteri(R,n.TEXTURE_MAG_FILTER,ee[E.magFilter]),n.texParameteri(R,n.TEXTURE_MIN_FILTER,ee[E.minFilter]),E.compareFunction&&(n.texParameteri(R,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(R,n.TEXTURE_COMPARE_FUNC,ce[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Zn||E.minFilter!==Ma&&E.minFilter!==Cr||E.type===Mi&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");n.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function Ge(R,E){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,E.addEventListener("dispose",T));const Q=E.source;let ne=f.get(Q);ne===void 0&&(ne={},f.set(Q,ne));const Z=V(E);if(Z!==R.__cacheKey){ne[Z]===void 0&&(ne[Z]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,H=!0),ne[Z].usedTimes++;const we=ne[R.__cacheKey];we!==void 0&&(ne[R.__cacheKey].usedTimes--,we.usedTimes===0&&M(E)),R.__cacheKey=Z,R.__webglTexture=ne[Z].texture}return H}function q(R,E,H){let Q=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(Q=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(Q=n.TEXTURE_3D);const ne=Ge(R,E),Z=E.source;t.bindTexture(Q,R.__webglTexture,n.TEXTURE0+H);const we=i.get(Z);if(Z.version!==we.__version||ne===!0){t.activeTexture(n.TEXTURE0+H);const he=Je.getPrimaries(Je.workingColorSpace),_e=E.colorSpace===Xi?null:Je.getPrimaries(E.colorSpace),Ze=E.colorSpace===Xi||he===_e?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ze);let ae=y(E.image,!1,r.maxTextureSize);ae=nt(E,ae);const Se=s.convert(E.format,E.colorSpace),Le=s.convert(E.type);let Ie=_(E.internalFormat,Se,Le,E.colorSpace,E.isVideoTexture);ye(Q,E);let Me;const Ke=E.mipmaps,Be=E.isVideoTexture!==!0,dt=we.__version===void 0||ne===!0,N=Z.dataReady,fe=w(E,ae);if(E.isDepthTexture)Ie=x(E.format===ks,E.type),dt&&(Be?t.texStorage2D(n.TEXTURE_2D,1,Ie,ae.width,ae.height):t.texImage2D(n.TEXTURE_2D,0,Ie,ae.width,ae.height,0,Se,Le,null));else if(E.isDataTexture)if(Ke.length>0){Be&&dt&&t.texStorage2D(n.TEXTURE_2D,fe,Ie,Ke[0].width,Ke[0].height);for(let j=0,te=Ke.length;j<te;j++)Me=Ke[j],Be?N&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,Me.width,Me.height,Se,Le,Me.data):t.texImage2D(n.TEXTURE_2D,j,Ie,Me.width,Me.height,0,Se,Le,Me.data);E.generateMipmaps=!1}else Be?(dt&&t.texStorage2D(n.TEXTURE_2D,fe,Ie,ae.width,ae.height),N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ae.width,ae.height,Se,Le,ae.data)):t.texImage2D(n.TEXTURE_2D,0,Ie,ae.width,ae.height,0,Se,Le,ae.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Be&&dt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Ie,Ke[0].width,Ke[0].height,ae.depth);for(let j=0,te=Ke.length;j<te;j++)if(Me=Ke[j],E.format!==qn)if(Se!==null)if(Be){if(N)if(E.layerUpdates.size>0){const ve=_m(Me.width,Me.height,E.format,E.type);for(const me of E.layerUpdates){const Fe=Me.data.subarray(me*ve/Me.data.BYTES_PER_ELEMENT,(me+1)*ve/Me.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,me,Me.width,Me.height,1,Se,Fe)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,Me.width,Me.height,ae.depth,Se,Me.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,j,Ie,Me.width,Me.height,ae.depth,0,Me.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Be?N&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,j,0,0,0,Me.width,Me.height,ae.depth,Se,Le,Me.data):t.texImage3D(n.TEXTURE_2D_ARRAY,j,Ie,Me.width,Me.height,ae.depth,0,Se,Le,Me.data)}else{Be&&dt&&t.texStorage2D(n.TEXTURE_2D,fe,Ie,Ke[0].width,Ke[0].height);for(let j=0,te=Ke.length;j<te;j++)Me=Ke[j],E.format!==qn?Se!==null?Be?N&&t.compressedTexSubImage2D(n.TEXTURE_2D,j,0,0,Me.width,Me.height,Se,Me.data):t.compressedTexImage2D(n.TEXTURE_2D,j,Ie,Me.width,Me.height,0,Me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Be?N&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,Me.width,Me.height,Se,Le,Me.data):t.texImage2D(n.TEXTURE_2D,j,Ie,Me.width,Me.height,0,Se,Le,Me.data)}else if(E.isDataArrayTexture)if(Be){if(dt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,fe,Ie,ae.width,ae.height,ae.depth),N)if(E.layerUpdates.size>0){const j=_m(ae.width,ae.height,E.format,E.type);for(const te of E.layerUpdates){const ve=ae.data.subarray(te*j/ae.data.BYTES_PER_ELEMENT,(te+1)*j/ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,te,ae.width,ae.height,1,Se,Le,ve)}E.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,Se,Le,ae.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Ie,ae.width,ae.height,ae.depth,0,Se,Le,ae.data);else if(E.isData3DTexture)Be?(dt&&t.texStorage3D(n.TEXTURE_3D,fe,Ie,ae.width,ae.height,ae.depth),N&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,Se,Le,ae.data)):t.texImage3D(n.TEXTURE_3D,0,Ie,ae.width,ae.height,ae.depth,0,Se,Le,ae.data);else if(E.isFramebufferTexture){if(dt)if(Be)t.texStorage2D(n.TEXTURE_2D,fe,Ie,ae.width,ae.height);else{let j=ae.width,te=ae.height;for(let ve=0;ve<fe;ve++)t.texImage2D(n.TEXTURE_2D,ve,Ie,j,te,0,Se,Le,null),j>>=1,te>>=1}}else if(Ke.length>0){if(Be&&dt){const j=Re(Ke[0]);t.texStorage2D(n.TEXTURE_2D,fe,Ie,j.width,j.height)}for(let j=0,te=Ke.length;j<te;j++)Me=Ke[j],Be?N&&t.texSubImage2D(n.TEXTURE_2D,j,0,0,Se,Le,Me):t.texImage2D(n.TEXTURE_2D,j,Ie,Se,Le,Me);E.generateMipmaps=!1}else if(Be){if(dt){const j=Re(ae);t.texStorage2D(n.TEXTURE_2D,fe,Ie,j.width,j.height)}N&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,Se,Le,ae)}else t.texImage2D(n.TEXTURE_2D,0,Ie,Se,Le,ae);m(E)&&u(Q),we.__version=Z.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function se(R,E,H){if(E.image.length!==6)return;const Q=Ge(R,E),ne=E.source;t.bindTexture(n.TEXTURE_CUBE_MAP,R.__webglTexture,n.TEXTURE0+H);const Z=i.get(ne);if(ne.version!==Z.__version||Q===!0){t.activeTexture(n.TEXTURE0+H);const we=Je.getPrimaries(Je.workingColorSpace),he=E.colorSpace===Xi?null:Je.getPrimaries(E.colorSpace),_e=E.colorSpace===Xi||we===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,_e);const Ze=E.isCompressedTexture||E.image[0].isCompressedTexture,ae=E.image[0]&&E.image[0].isDataTexture,Se=[];for(let te=0;te<6;te++)!Ze&&!ae?Se[te]=y(E.image[te],!0,r.maxCubemapSize):Se[te]=ae?E.image[te].image:E.image[te],Se[te]=nt(E,Se[te]);const Le=Se[0],Ie=s.convert(E.format,E.colorSpace),Me=s.convert(E.type),Ke=_(E.internalFormat,Ie,Me,E.colorSpace),Be=E.isVideoTexture!==!0,dt=Z.__version===void 0||Q===!0,N=ne.dataReady;let fe=w(E,Le);ye(n.TEXTURE_CUBE_MAP,E);let j;if(Ze){Be&&dt&&t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,Ke,Le.width,Le.height);for(let te=0;te<6;te++){j=Se[te].mipmaps;for(let ve=0;ve<j.length;ve++){const me=j[ve];E.format!==qn?Ie!==null?Be?N&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve,0,0,me.width,me.height,Ie,me.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve,Ke,me.width,me.height,0,me.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Be?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve,0,0,me.width,me.height,Ie,Me,me.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve,Ke,me.width,me.height,0,Ie,Me,me.data)}}}else{if(j=E.mipmaps,Be&&dt){j.length>0&&fe++;const te=Re(Se[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,fe,Ke,te.width,te.height)}for(let te=0;te<6;te++)if(ae){Be?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Se[te].width,Se[te].height,Ie,Me,Se[te].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ke,Se[te].width,Se[te].height,0,Ie,Me,Se[te].data);for(let ve=0;ve<j.length;ve++){const Fe=j[ve].image[te].image;Be?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve+1,0,0,Fe.width,Fe.height,Ie,Me,Fe.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve+1,Ke,Fe.width,Fe.height,0,Ie,Me,Fe.data)}}else{Be?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,0,0,Ie,Me,Se[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,0,Ke,Ie,Me,Se[te]);for(let ve=0;ve<j.length;ve++){const me=j[ve];Be?N&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve+1,0,0,Ie,Me,me.image[te]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+te,ve+1,Ke,Ie,Me,me.image[te])}}}m(E)&&u(n.TEXTURE_CUBE_MAP),Z.__version=ne.version,E.onUpdate&&E.onUpdate(E)}R.__version=E.version}function pe(R,E,H,Q,ne,Z){const we=s.convert(H.format,H.colorSpace),he=s.convert(H.type),_e=_(H.internalFormat,we,he,H.colorSpace),Ze=i.get(E),ae=i.get(H);if(ae.__renderTarget=E,!Ze.__hasExternalTextures){const Se=Math.max(1,E.width>>Z),Le=Math.max(1,E.height>>Z);ne===n.TEXTURE_3D||ne===n.TEXTURE_2D_ARRAY?t.texImage3D(ne,Z,_e,Se,Le,E.depth,0,we,he,null):t.texImage2D(ne,Z,_e,Se,Le,0,we,he,null)}t.bindFramebuffer(n.FRAMEBUFFER,R),We(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Q,ne,ae.__webglTexture,0,Ve(E)):(ne===n.TEXTURE_2D||ne>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Q,ne,ae.__webglTexture,Z),t.bindFramebuffer(n.FRAMEBUFFER,null)}function ue(R,E,H){if(n.bindRenderbuffer(n.RENDERBUFFER,R),E.depthBuffer){const Q=E.depthTexture,ne=Q&&Q.isDepthTexture?Q.type:null,Z=x(E.stencilBuffer,ne),we=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=Ve(E);We(E)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,he,Z,E.width,E.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,he,Z,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,Z,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,we,n.RENDERBUFFER,R)}else{const Q=E.textures;for(let ne=0;ne<Q.length;ne++){const Z=Q[ne],we=s.convert(Z.format,Z.colorSpace),he=s.convert(Z.type),_e=_(Z.internalFormat,we,he,Z.colorSpace),Ze=Ve(E);H&&We(E)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ze,_e,E.width,E.height):We(E)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ze,_e,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,_e,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Pe(R,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,R),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=i.get(E.depthTexture);Q.__renderTarget=E,(!Q.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),Y(E.depthTexture,0);const ne=Q.__webglTexture,Z=Ve(E);if(E.depthTexture.format===Ts)We(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ne,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ne,0);else if(E.depthTexture.format===ks)We(E)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ne,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ne,0);else throw new Error("Unknown depthTexture format")}function De(R){const E=i.get(R),H=R.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==R.depthTexture){const Q=R.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),Q){const ne=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,Q.removeEventListener("dispose",ne)};Q.addEventListener("dispose",ne),E.__depthDisposeCallback=ne}E.__boundDepthTexture=Q}if(R.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");Pe(E.__webglFramebuffer,R)}else if(H){E.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[Q]),E.__webglDepthbuffer[Q]===void 0)E.__webglDepthbuffer[Q]=n.createRenderbuffer(),ue(E.__webglDepthbuffer[Q],R,!1);else{const ne=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Z=E.__webglDepthbuffer[Q];n.bindRenderbuffer(n.RENDERBUFFER,Z),n.framebufferRenderbuffer(n.FRAMEBUFFER,ne,n.RENDERBUFFER,Z)}}else if(t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),ue(E.__webglDepthbuffer,R,!1);else{const Q=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ne=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ne),n.framebufferRenderbuffer(n.FRAMEBUFFER,Q,n.RENDERBUFFER,ne)}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ze(R,E,H){const Q=i.get(R);E!==void 0&&pe(Q.__webglFramebuffer,R,R.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&De(R)}function pt(R){const E=R.texture,H=i.get(R),Q=i.get(E);R.addEventListener("dispose",A);const ne=R.textures,Z=R.isWebGLCubeRenderTarget===!0,we=ne.length>1;if(we||(Q.__webglTexture===void 0&&(Q.__webglTexture=n.createTexture()),Q.__version=E.version,o.memory.textures++),Z){H.__webglFramebuffer=[];for(let he=0;he<6;he++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[he]=[];for(let _e=0;_e<E.mipmaps.length;_e++)H.__webglFramebuffer[he][_e]=n.createFramebuffer()}else H.__webglFramebuffer[he]=n.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let he=0;he<E.mipmaps.length;he++)H.__webglFramebuffer[he]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(we)for(let he=0,_e=ne.length;he<_e;he++){const Ze=i.get(ne[he]);Ze.__webglTexture===void 0&&(Ze.__webglTexture=n.createTexture(),o.memory.textures++)}if(R.samples>0&&We(R)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let he=0;he<ne.length;he++){const _e=ne[he];H.__webglColorRenderbuffer[he]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[he]);const Ze=s.convert(_e.format,_e.colorSpace),ae=s.convert(_e.type),Se=_(_e.internalFormat,Ze,ae,_e.colorSpace,R.isXRRenderTarget===!0),Le=Ve(R);n.renderbufferStorageMultisample(n.RENDERBUFFER,Le,Se,R.width,R.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,H.__webglColorRenderbuffer[he])}n.bindRenderbuffer(n.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),ue(H.__webglDepthRenderbuffer,R,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(Z){t.bindTexture(n.TEXTURE_CUBE_MAP,Q.__webglTexture),ye(n.TEXTURE_CUBE_MAP,E);for(let he=0;he<6;he++)if(E.mipmaps&&E.mipmaps.length>0)for(let _e=0;_e<E.mipmaps.length;_e++)pe(H.__webglFramebuffer[he][_e],R,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,_e);else pe(H.__webglFramebuffer[he],R,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);m(E)&&u(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(we){for(let he=0,_e=ne.length;he<_e;he++){const Ze=ne[he],ae=i.get(Ze);t.bindTexture(n.TEXTURE_2D,ae.__webglTexture),ye(n.TEXTURE_2D,Ze),pe(H.__webglFramebuffer,R,Ze,n.COLOR_ATTACHMENT0+he,n.TEXTURE_2D,0),m(Ze)&&u(n.TEXTURE_2D)}t.unbindTexture()}else{let he=n.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(he=R.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,Q.__webglTexture),ye(he,E),E.mipmaps&&E.mipmaps.length>0)for(let _e=0;_e<E.mipmaps.length;_e++)pe(H.__webglFramebuffer[_e],R,E,n.COLOR_ATTACHMENT0,he,_e);else pe(H.__webglFramebuffer,R,E,n.COLOR_ATTACHMENT0,he,0);m(E)&&u(he),t.unbindTexture()}R.depthBuffer&&De(R)}function je(R){const E=R.textures;for(let H=0,Q=E.length;H<Q;H++){const ne=E[H];if(m(ne)){const Z=g(R),we=i.get(ne).__webglTexture;t.bindTexture(Z,we),u(Z),t.unbindTexture()}}}const mt=[],U=[];function Jt(R){if(R.samples>0){if(We(R)===!1){const E=R.textures,H=R.width,Q=R.height;let ne=n.COLOR_BUFFER_BIT;const Z=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,we=i.get(R),he=E.length>1;if(he)for(let _e=0;_e<E.length;_e++)t.bindFramebuffer(n.FRAMEBUFFER,we.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,we.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,we.__webglMultisampledFramebuffer),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let _e=0;_e<E.length;_e++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(ne|=n.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(ne|=n.STENCIL_BUFFER_BIT)),he){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,we.__webglColorRenderbuffer[_e]);const Ze=i.get(E[_e]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Ze,0)}n.blitFramebuffer(0,0,H,Q,0,0,H,Q,ne,n.NEAREST),l===!0&&(mt.length=0,U.length=0,mt.push(n.COLOR_ATTACHMENT0+_e),R.depthBuffer&&R.resolveDepthBuffer===!1&&(mt.push(Z),U.push(Z),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,U)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,mt))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),he)for(let _e=0;_e<E.length;_e++){t.bindFramebuffer(n.FRAMEBUFFER,we.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.RENDERBUFFER,we.__webglColorRenderbuffer[_e]);const Ze=i.get(E[_e]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,we.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+_e,n.TEXTURE_2D,Ze,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,we.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.resolveDepthBuffer===!1&&l){const E=R.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function Ve(R){return Math.min(r.maxSamples,R.samples)}function We(R){const E=i.get(R);return R.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ce(R){const E=o.render.frame;d.get(R)!==E&&(d.set(R,E),R.update())}function nt(R,E){const H=R.colorSpace,Q=R.format,ne=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==Gs&&H!==Xi&&(Je.getTransfer(H)===ct?(Q!==qn||ne!==Pi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function Re(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=B,this.setTexture2D=Y,this.setTexture2DArray=X,this.setTexture3D=J,this.setTextureCube=D,this.rebindTextures=ze,this.setupRenderTarget=pt,this.updateRenderTargetMipmap=je,this.updateMultisampleRenderTarget=Jt,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=pe,this.useMultisampledRTT=We}function KE(n,e){function t(i,r=Xi){let s;const o=Je.getTransfer(r);if(i===Pi)return n.UNSIGNED_BYTE;if(i===Vh)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Gh)return n.UNSIGNED_SHORT_5_5_5_1;if(i===jg)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Wg)return n.BYTE;if(i===Xg)return n.SHORT;if(i===Wo)return n.UNSIGNED_SHORT;if(i===Hh)return n.INT;if(i===Fr)return n.UNSIGNED_INT;if(i===Mi)return n.FLOAT;if(i===Zo)return n.HALF_FLOAT;if(i===Yg)return n.ALPHA;if(i===qg)return n.RGB;if(i===qn)return n.RGBA;if(i===$g)return n.LUMINANCE;if(i===Kg)return n.LUMINANCE_ALPHA;if(i===Ts)return n.DEPTH_COMPONENT;if(i===ks)return n.DEPTH_STENCIL;if(i===Zg)return n.RED;if(i===Wh)return n.RED_INTEGER;if(i===Qg)return n.RG;if(i===Xh)return n.RG_INTEGER;if(i===jh)return n.RGBA_INTEGER;if(i===il||i===rl||i===sl||i===ol)if(o===ct)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===il)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===rl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===sl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ol)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===il)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===rl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===sl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ol)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===_d||i===vd||i===xd||i===yd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===_d)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===yd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Sd||i===Md||i===wd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Sd||i===Md)return o===ct?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===wd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ed||i===Td||i===Ad||i===bd||i===Cd||i===Rd||i===Pd||i===Ld||i===Dd||i===Id||i===Nd||i===Ud||i===zd||i===Fd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Ed)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Td)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ad)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===bd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Cd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Rd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Pd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ld)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Dd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Id)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Nd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ud)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===zd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Fd)return o===ct?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===al||i===kd||i===Od)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===al)return o===ct?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===kd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Od)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Jg||i===Bd||i===Hd||i===Vd)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===al)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Bd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Hd)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Vd)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Fs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}class ZE extends Mn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class ot extends Bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const QE={type:"move"};class au{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ot,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ot,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ot,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const y of e.hand.values()){const m=t.getJointPose(y,i),u=this._getHandJoint(c,y);m!==null&&(u.matrix.fromArray(m.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,u.jointRadius=m.radius),u.visible=m!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],f=d.position.distanceTo(h.position),p=.02,v=.005;c.inputState.pinching&&f>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(QE)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ot;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const JE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,e2=`
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

}`;class t2{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const r=new on,s=e.properties.get(r);s.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ar({vertexShader:JE,fragmentShader:e2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new K(new ta(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class n2 extends Ws{constructor(e,t){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,d=null,h=null,f=null,p=null,v=null;const y=new t2,m=t.getContextAttributes();let u=null,g=null;const _=[],x=[],w=new $e;let T=null;const A=new Mn;A.viewport=new ut;const C=new Mn;C.viewport=new ut;const M=[A,C],S=new ZE;let P=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let se=_[q];return se===void 0&&(se=new au,_[q]=se),se.getTargetRaySpace()},this.getControllerGrip=function(q){let se=_[q];return se===void 0&&(se=new au,_[q]=se),se.getGripSpace()},this.getHand=function(q){let se=_[q];return se===void 0&&(se=new au,_[q]=se),se.getHandSpace()};function z(q){const se=x.indexOf(q.inputSource);if(se===-1)return;const pe=_[se];pe!==void 0&&(pe.update(q.inputSource,q.frame,c||o),pe.dispatchEvent({type:q.type,data:q.inputSource}))}function V(){r.removeEventListener("select",z),r.removeEventListener("selectstart",z),r.removeEventListener("selectend",z),r.removeEventListener("squeeze",z),r.removeEventListener("squeezestart",z),r.removeEventListener("squeezeend",z),r.removeEventListener("end",V),r.removeEventListener("inputsourceschange",Y);for(let q=0;q<_.length;q++){const se=x[q];se!==null&&(x[q]=null,_[q].disconnect(se))}P=null,B=null,y.reset(),e.setRenderTarget(u),p=null,f=null,h=null,r=null,g=null,Ge.stop(),i.isPresenting=!1,e.setPixelRatio(T),e.setSize(w.width,w.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(q){c=q},this.getBaseLayer=function(){return f!==null?f:p},this.getBinding=function(){return h},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(q){if(r=q,r!==null){if(u=e.getRenderTarget(),r.addEventListener("select",z),r.addEventListener("selectstart",z),r.addEventListener("selectend",z),r.addEventListener("squeeze",z),r.addEventListener("squeezestart",z),r.addEventListener("squeezeend",z),r.addEventListener("end",V),r.addEventListener("inputsourceschange",Y),m.xrCompatible!==!0&&await t.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(w),r.renderState.layers===void 0){const se={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,t,se),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),g=new kr(p.framebufferWidth,p.framebufferHeight,{format:qn,type:Pi,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let se=null,pe=null,ue=null;m.depth&&(ue=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,se=m.stencil?ks:Ts,pe=m.stencil?Fs:Fr);const Pe={colorFormat:t.RGBA8,depthFormat:ue,scaleFactor:s};h=new XRWebGLBinding(r,t),f=h.createProjectionLayer(Pe),r.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),g=new kr(f.textureWidth,f.textureHeight,{format:qn,type:Pi,depthTexture:new f_(f.textureWidth,f.textureHeight,pe,void 0,void 0,void 0,void 0,void 0,void 0,se),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Ge.setContext(r),Ge.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function Y(q){for(let se=0;se<q.removed.length;se++){const pe=q.removed[se],ue=x.indexOf(pe);ue>=0&&(x[ue]=null,_[ue].disconnect(pe))}for(let se=0;se<q.added.length;se++){const pe=q.added[se];let ue=x.indexOf(pe);if(ue===-1){for(let De=0;De<_.length;De++)if(De>=x.length){x.push(pe),ue=De;break}else if(x[De]===null){x[De]=pe,ue=De;break}if(ue===-1)break}const Pe=_[ue];Pe&&Pe.connect(pe)}}const X=new I,J=new I;function D(q,se,pe){X.setFromMatrixPosition(se.matrixWorld),J.setFromMatrixPosition(pe.matrixWorld);const ue=X.distanceTo(J),Pe=se.projectionMatrix.elements,De=pe.projectionMatrix.elements,ze=Pe[14]/(Pe[10]-1),pt=Pe[14]/(Pe[10]+1),je=(Pe[9]+1)/Pe[5],mt=(Pe[9]-1)/Pe[5],U=(Pe[8]-1)/Pe[0],Jt=(De[8]+1)/De[0],Ve=ze*U,We=ze*Jt,Ce=ue/(-U+Jt),nt=Ce*-U;if(se.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(nt),q.translateZ(Ce),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert(),Pe[10]===-1)q.projectionMatrix.copy(se.projectionMatrix),q.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{const Re=ze+Ce,R=pt+Ce,E=Ve-nt,H=We+(ue-nt),Q=je*pt/R*Re,ne=mt*pt/R*Re;q.projectionMatrix.makePerspective(E,H,Q,ne,Re,R),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}}function $(q,se){se===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(se.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(r===null)return;let se=q.near,pe=q.far;y.texture!==null&&(y.depthNear>0&&(se=y.depthNear),y.depthFar>0&&(pe=y.depthFar)),S.near=C.near=A.near=se,S.far=C.far=A.far=pe,(P!==S.near||B!==S.far)&&(r.updateRenderState({depthNear:S.near,depthFar:S.far}),P=S.near,B=S.far),A.layers.mask=q.layers.mask|2,C.layers.mask=q.layers.mask|4,S.layers.mask=A.layers.mask|C.layers.mask;const ue=q.parent,Pe=S.cameras;$(S,ue);for(let De=0;De<Pe.length;De++)$(Pe[De],ue);Pe.length===2?D(S,A,C):S.projectionMatrix.copy(A.projectionMatrix),ee(q,S,ue)};function ee(q,se,pe){pe===null?q.matrix.copy(se.matrixWorld):(q.matrix.copy(pe.matrixWorld),q.matrix.invert(),q.matrix.multiply(se.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(se.projectionMatrix),q.projectionMatrixInverse.copy(se.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=Gd*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return S},this.getFoveation=function(){if(!(f===null&&p===null))return l},this.setFoveation=function(q){l=q,f!==null&&(f.fixedFoveation=q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=q)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(S)};let ce=null;function ye(q,se){if(d=se.getViewerPose(c||o),v=se,d!==null){const pe=d.views;p!==null&&(e.setRenderTargetFramebuffer(g,p.framebuffer),e.setRenderTarget(g));let ue=!1;pe.length!==S.cameras.length&&(S.cameras.length=0,ue=!0);for(let De=0;De<pe.length;De++){const ze=pe[De];let pt=null;if(p!==null)pt=p.getViewport(ze);else{const mt=h.getViewSubImage(f,ze);pt=mt.viewport,De===0&&(e.setRenderTargetTextures(g,mt.colorTexture,f.ignoreDepthValues?void 0:mt.depthStencilTexture),e.setRenderTarget(g))}let je=M[De];je===void 0&&(je=new Mn,je.layers.enable(De),je.viewport=new ut,M[De]=je),je.matrix.fromArray(ze.transform.matrix),je.matrix.decompose(je.position,je.quaternion,je.scale),je.projectionMatrix.fromArray(ze.projectionMatrix),je.projectionMatrixInverse.copy(je.projectionMatrix).invert(),je.viewport.set(pt.x,pt.y,pt.width,pt.height),De===0&&(S.matrix.copy(je.matrix),S.matrix.decompose(S.position,S.quaternion,S.scale)),ue===!0&&S.cameras.push(je)}const Pe=r.enabledFeatures;if(Pe&&Pe.includes("depth-sensing")){const De=h.getDepthInformation(pe[0]);De&&De.isValid&&De.texture&&y.init(e,De,r.renderState)}}for(let pe=0;pe<_.length;pe++){const ue=x[pe],Pe=_[pe];ue!==null&&Pe!==void 0&&Pe.update(ue,se,c||o)}ce&&ce(q,se),se.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:se}),v=null}const Ge=new d_;Ge.setAnimationLoop(ye),this.setAnimationLoop=function(q){ce=q},this.dispose=function(){}}}const _r=new li,i2=new yt;function r2(n,e){function t(m,u){m.matrixAutoUpdate===!0&&m.updateMatrix(),u.value.copy(m.matrix)}function i(m,u){u.color.getRGB(m.fogColor.value,l_(n)),u.isFog?(m.fogNear.value=u.near,m.fogFar.value=u.far):u.isFogExp2&&(m.fogDensity.value=u.density)}function r(m,u,g,_,x){u.isMeshBasicMaterial||u.isMeshLambertMaterial?s(m,u):u.isMeshToonMaterial?(s(m,u),h(m,u)):u.isMeshPhongMaterial?(s(m,u),d(m,u)):u.isMeshStandardMaterial?(s(m,u),f(m,u),u.isMeshPhysicalMaterial&&p(m,u,x)):u.isMeshMatcapMaterial?(s(m,u),v(m,u)):u.isMeshDepthMaterial?s(m,u):u.isMeshDistanceMaterial?(s(m,u),y(m,u)):u.isMeshNormalMaterial?s(m,u):u.isLineBasicMaterial?(o(m,u),u.isLineDashedMaterial&&a(m,u)):u.isPointsMaterial?l(m,u,g,_):u.isSpriteMaterial?c(m,u):u.isShadowMaterial?(m.color.value.copy(u.color),m.opacity.value=u.opacity):u.isShaderMaterial&&(u.uniformsNeedUpdate=!1)}function s(m,u){m.opacity.value=u.opacity,u.color&&m.diffuse.value.copy(u.color),u.emissive&&m.emissive.value.copy(u.emissive).multiplyScalar(u.emissiveIntensity),u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.bumpMap&&(m.bumpMap.value=u.bumpMap,t(u.bumpMap,m.bumpMapTransform),m.bumpScale.value=u.bumpScale,u.side===sn&&(m.bumpScale.value*=-1)),u.normalMap&&(m.normalMap.value=u.normalMap,t(u.normalMap,m.normalMapTransform),m.normalScale.value.copy(u.normalScale),u.side===sn&&m.normalScale.value.negate()),u.displacementMap&&(m.displacementMap.value=u.displacementMap,t(u.displacementMap,m.displacementMapTransform),m.displacementScale.value=u.displacementScale,m.displacementBias.value=u.displacementBias),u.emissiveMap&&(m.emissiveMap.value=u.emissiveMap,t(u.emissiveMap,m.emissiveMapTransform)),u.specularMap&&(m.specularMap.value=u.specularMap,t(u.specularMap,m.specularMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest);const g=e.get(u),_=g.envMap,x=g.envMapRotation;_&&(m.envMap.value=_,_r.copy(x),_r.x*=-1,_r.y*=-1,_r.z*=-1,_.isCubeTexture&&_.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),m.envMapRotation.value.setFromMatrix4(i2.makeRotationFromEuler(_r)),m.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=u.reflectivity,m.ior.value=u.ior,m.refractionRatio.value=u.refractionRatio),u.lightMap&&(m.lightMap.value=u.lightMap,m.lightMapIntensity.value=u.lightMapIntensity,t(u.lightMap,m.lightMapTransform)),u.aoMap&&(m.aoMap.value=u.aoMap,m.aoMapIntensity.value=u.aoMapIntensity,t(u.aoMap,m.aoMapTransform))}function o(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform))}function a(m,u){m.dashSize.value=u.dashSize,m.totalSize.value=u.dashSize+u.gapSize,m.scale.value=u.scale}function l(m,u,g,_){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.size.value=u.size*g,m.scale.value=_*.5,u.map&&(m.map.value=u.map,t(u.map,m.uvTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function c(m,u){m.diffuse.value.copy(u.color),m.opacity.value=u.opacity,m.rotation.value=u.rotation,u.map&&(m.map.value=u.map,t(u.map,m.mapTransform)),u.alphaMap&&(m.alphaMap.value=u.alphaMap,t(u.alphaMap,m.alphaMapTransform)),u.alphaTest>0&&(m.alphaTest.value=u.alphaTest)}function d(m,u){m.specular.value.copy(u.specular),m.shininess.value=Math.max(u.shininess,1e-4)}function h(m,u){u.gradientMap&&(m.gradientMap.value=u.gradientMap)}function f(m,u){m.metalness.value=u.metalness,u.metalnessMap&&(m.metalnessMap.value=u.metalnessMap,t(u.metalnessMap,m.metalnessMapTransform)),m.roughness.value=u.roughness,u.roughnessMap&&(m.roughnessMap.value=u.roughnessMap,t(u.roughnessMap,m.roughnessMapTransform)),u.envMap&&(m.envMapIntensity.value=u.envMapIntensity)}function p(m,u,g){m.ior.value=u.ior,u.sheen>0&&(m.sheenColor.value.copy(u.sheenColor).multiplyScalar(u.sheen),m.sheenRoughness.value=u.sheenRoughness,u.sheenColorMap&&(m.sheenColorMap.value=u.sheenColorMap,t(u.sheenColorMap,m.sheenColorMapTransform)),u.sheenRoughnessMap&&(m.sheenRoughnessMap.value=u.sheenRoughnessMap,t(u.sheenRoughnessMap,m.sheenRoughnessMapTransform))),u.clearcoat>0&&(m.clearcoat.value=u.clearcoat,m.clearcoatRoughness.value=u.clearcoatRoughness,u.clearcoatMap&&(m.clearcoatMap.value=u.clearcoatMap,t(u.clearcoatMap,m.clearcoatMapTransform)),u.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=u.clearcoatRoughnessMap,t(u.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),u.clearcoatNormalMap&&(m.clearcoatNormalMap.value=u.clearcoatNormalMap,t(u.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(u.clearcoatNormalScale),u.side===sn&&m.clearcoatNormalScale.value.negate())),u.dispersion>0&&(m.dispersion.value=u.dispersion),u.iridescence>0&&(m.iridescence.value=u.iridescence,m.iridescenceIOR.value=u.iridescenceIOR,m.iridescenceThicknessMinimum.value=u.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=u.iridescenceThicknessRange[1],u.iridescenceMap&&(m.iridescenceMap.value=u.iridescenceMap,t(u.iridescenceMap,m.iridescenceMapTransform)),u.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=u.iridescenceThicknessMap,t(u.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),u.transmission>0&&(m.transmission.value=u.transmission,m.transmissionSamplerMap.value=g.texture,m.transmissionSamplerSize.value.set(g.width,g.height),u.transmissionMap&&(m.transmissionMap.value=u.transmissionMap,t(u.transmissionMap,m.transmissionMapTransform)),m.thickness.value=u.thickness,u.thicknessMap&&(m.thicknessMap.value=u.thicknessMap,t(u.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=u.attenuationDistance,m.attenuationColor.value.copy(u.attenuationColor)),u.anisotropy>0&&(m.anisotropyVector.value.set(u.anisotropy*Math.cos(u.anisotropyRotation),u.anisotropy*Math.sin(u.anisotropyRotation)),u.anisotropyMap&&(m.anisotropyMap.value=u.anisotropyMap,t(u.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=u.specularIntensity,m.specularColor.value.copy(u.specularColor),u.specularColorMap&&(m.specularColorMap.value=u.specularColorMap,t(u.specularColorMap,m.specularColorMapTransform)),u.specularIntensityMap&&(m.specularIntensityMap.value=u.specularIntensityMap,t(u.specularIntensityMap,m.specularIntensityMapTransform))}function v(m,u){u.matcap&&(m.matcap.value=u.matcap)}function y(m,u){const g=e.get(u).light;m.referencePosition.value.setFromMatrixPosition(g.matrixWorld),m.nearDistance.value=g.shadow.camera.near,m.farDistance.value=g.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function s2(n,e,t,i){let r={},s={},o=[];const a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(g,_){const x=_.program;i.uniformBlockBinding(g,x)}function c(g,_){let x=r[g.id];x===void 0&&(v(g),x=d(g),r[g.id]=x,g.addEventListener("dispose",m));const w=_.program;i.updateUBOMapping(g,w);const T=e.render.frame;s[g.id]!==T&&(f(g),s[g.id]=T)}function d(g){const _=h();g.__bindingPointIndex=_;const x=n.createBuffer(),w=g.__size,T=g.usage;return n.bindBuffer(n.UNIFORM_BUFFER,x),n.bufferData(n.UNIFORM_BUFFER,w,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,_,x),x}function h(){for(let g=0;g<a;g++)if(o.indexOf(g)===-1)return o.push(g),g;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(g){const _=r[g.id],x=g.uniforms,w=g.__cache;n.bindBuffer(n.UNIFORM_BUFFER,_);for(let T=0,A=x.length;T<A;T++){const C=Array.isArray(x[T])?x[T]:[x[T]];for(let M=0,S=C.length;M<S;M++){const P=C[M];if(p(P,T,M,w)===!0){const B=P.__offset,z=Array.isArray(P.value)?P.value:[P.value];let V=0;for(let Y=0;Y<z.length;Y++){const X=z[Y],J=y(X);typeof X=="number"||typeof X=="boolean"?(P.__data[0]=X,n.bufferSubData(n.UNIFORM_BUFFER,B+V,P.__data)):X.isMatrix3?(P.__data[0]=X.elements[0],P.__data[1]=X.elements[1],P.__data[2]=X.elements[2],P.__data[3]=0,P.__data[4]=X.elements[3],P.__data[5]=X.elements[4],P.__data[6]=X.elements[5],P.__data[7]=0,P.__data[8]=X.elements[6],P.__data[9]=X.elements[7],P.__data[10]=X.elements[8],P.__data[11]=0):(X.toArray(P.__data,V),V+=J.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,B,P.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function p(g,_,x,w){const T=g.value,A=_+"_"+x;if(w[A]===void 0)return typeof T=="number"||typeof T=="boolean"?w[A]=T:w[A]=T.clone(),!0;{const C=w[A];if(typeof T=="number"||typeof T=="boolean"){if(C!==T)return w[A]=T,!0}else if(C.equals(T)===!1)return C.copy(T),!0}return!1}function v(g){const _=g.uniforms;let x=0;const w=16;for(let A=0,C=_.length;A<C;A++){const M=Array.isArray(_[A])?_[A]:[_[A]];for(let S=0,P=M.length;S<P;S++){const B=M[S],z=Array.isArray(B.value)?B.value:[B.value];for(let V=0,Y=z.length;V<Y;V++){const X=z[V],J=y(X),D=x%w,$=D%J.boundary,ee=D+$;x+=$,ee!==0&&w-ee<J.storage&&(x+=w-ee),B.__data=new Float32Array(J.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=x,x+=J.storage}}}const T=x%w;return T>0&&(x+=w-T),g.__size=x,g.__cache={},this}function y(g){const _={boundary:0,storage:0};return typeof g=="number"||typeof g=="boolean"?(_.boundary=4,_.storage=4):g.isVector2?(_.boundary=8,_.storage=8):g.isVector3||g.isColor?(_.boundary=16,_.storage=12):g.isVector4?(_.boundary=16,_.storage=16):g.isMatrix3?(_.boundary=48,_.storage=48):g.isMatrix4?(_.boundary=64,_.storage=64):g.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",g),_}function m(g){const _=g.target;_.removeEventListener("dispose",m);const x=o.indexOf(_.__bindingPointIndex);o.splice(x,1),n.deleteBuffer(r[_.id]),delete r[_.id],delete s[_.id]}function u(){for(const g in r)n.deleteBuffer(r[g]);o=[],r={},s={}}return{bind:l,update:c,dispose:u}}class o2{constructor(e={}){const{canvas:t=qy(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reverseDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=o;const v=new Uint32Array(4),y=new Int32Array(4);let m=null,u=null;const g=[],_=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=nn,this.toneMapping=ir,this.toneMappingExposure=1;const x=this;let w=!1,T=0,A=0,C=null,M=-1,S=null;const P=new ut,B=new ut;let z=null;const V=new qe(0);let Y=0,X=t.width,J=t.height,D=1,$=null,ee=null;const ce=new ut(0,0,X,J),ye=new ut(0,0,X,J);let Ge=!1;const q=new $h;let se=!1,pe=!1;const ue=new yt,Pe=new yt,De=new I,ze=new ut,pt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let je=!1;function mt(){return C===null?D:1}let U=i;function Jt(b,F){return t.getContext(b,F)}try{const b={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Bh}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",ve,!1),t.addEventListener("webglcontextcreationerror",me,!1),U===null){const F="webgl2";if(U=Jt(F,b),U===null)throw Jt(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Ve,We,Ce,nt,Re,R,E,H,Q,ne,Z,we,he,_e,Ze,ae,Se,Le,Ie,Me,Ke,Be,dt,N;function fe(){Ve=new dw(U),Ve.init(),Be=new KE(U,Ve),We=new sw(U,Ve,e,Be),Ce=new YE(U,Ve),We.reverseDepthBuffer&&f&&Ce.buffers.depth.setReversed(!0),nt=new pw(U),Re=new DE,R=new $E(U,Ve,Ce,Re,We,Be,nt),E=new aw(x),H=new uw(x),Q=new SS(U),dt=new iw(U,Q),ne=new hw(U,Q,nt,dt),Z=new gw(U,ne,Q,nt),Ie=new mw(U,We,R),ae=new ow(Re),we=new LE(x,E,H,Ve,We,dt,ae),he=new r2(x,Re),_e=new NE,Ze=new BE(Ve),Le=new nw(x,E,H,Ce,Z,p,l),Se=new XE(x,Z,We),N=new s2(U,nt,We,Ce),Me=new rw(U,Ve,nt),Ke=new fw(U,Ve,nt),nt.programs=we.programs,x.capabilities=We,x.extensions=Ve,x.properties=Re,x.renderLists=_e,x.shadowMap=Se,x.state=Ce,x.info=nt}fe();const j=new n2(x,U);this.xr=j,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const b=Ve.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Ve.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return D},this.setPixelRatio=function(b){b!==void 0&&(D=b,this.setSize(X,J,!1))},this.getSize=function(b){return b.set(X,J)},this.setSize=function(b,F,G=!0){if(j.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}X=b,J=F,t.width=Math.floor(b*D),t.height=Math.floor(F*D),G===!0&&(t.style.width=b+"px",t.style.height=F+"px"),this.setViewport(0,0,b,F)},this.getDrawingBufferSize=function(b){return b.set(X*D,J*D).floor()},this.setDrawingBufferSize=function(b,F,G){X=b,J=F,D=G,t.width=Math.floor(b*G),t.height=Math.floor(F*G),this.setViewport(0,0,b,F)},this.getCurrentViewport=function(b){return b.copy(P)},this.getViewport=function(b){return b.copy(ce)},this.setViewport=function(b,F,G,W){b.isVector4?ce.set(b.x,b.y,b.z,b.w):ce.set(b,F,G,W),Ce.viewport(P.copy(ce).multiplyScalar(D).round())},this.getScissor=function(b){return b.copy(ye)},this.setScissor=function(b,F,G,W){b.isVector4?ye.set(b.x,b.y,b.z,b.w):ye.set(b,F,G,W),Ce.scissor(B.copy(ye).multiplyScalar(D).round())},this.getScissorTest=function(){return Ge},this.setScissorTest=function(b){Ce.setScissorTest(Ge=b)},this.setOpaqueSort=function(b){$=b},this.setTransparentSort=function(b){ee=b},this.getClearColor=function(b){return b.copy(Le.getClearColor())},this.setClearColor=function(){Le.setClearColor.apply(Le,arguments)},this.getClearAlpha=function(){return Le.getClearAlpha()},this.setClearAlpha=function(){Le.setClearAlpha.apply(Le,arguments)},this.clear=function(b=!0,F=!0,G=!0){let W=0;if(b){let k=!1;if(C!==null){const le=C.texture.format;k=le===jh||le===Xh||le===Wh}if(k){const le=C.texture.type,ge=le===Pi||le===Fr||le===Wo||le===Fs||le===Vh||le===Gh,Ee=Le.getClearColor(),Te=Le.getClearAlpha(),Ne=Ee.r,ke=Ee.g,Ae=Ee.b;ge?(v[0]=Ne,v[1]=ke,v[2]=Ae,v[3]=Te,U.clearBufferuiv(U.COLOR,0,v)):(y[0]=Ne,y[1]=ke,y[2]=Ae,y[3]=Te,U.clearBufferiv(U.COLOR,0,y))}else W|=U.COLOR_BUFFER_BIT}F&&(W|=U.DEPTH_BUFFER_BIT),G&&(W|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",ve,!1),t.removeEventListener("webglcontextcreationerror",me,!1),_e.dispose(),Ze.dispose(),Re.dispose(),E.dispose(),H.dispose(),Z.dispose(),dt.dispose(),N.dispose(),we.dispose(),j.dispose(),j.removeEventListener("sessionstart",nf),j.removeEventListener("sessionend",rf),dr.stop()};function te(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function ve(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const b=nt.autoReset,F=Se.enabled,G=Se.autoUpdate,W=Se.needsUpdate,k=Se.type;fe(),nt.autoReset=b,Se.enabled=F,Se.autoUpdate=G,Se.needsUpdate=W,Se.type=k}function me(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Fe(b){const F=b.target;F.removeEventListener("dispose",Fe),Tt(F)}function Tt(b){Xt(b),Re.remove(b)}function Xt(b){const F=Re.get(b).programs;F!==void 0&&(F.forEach(function(G){we.releaseProgram(G)}),b.isShaderMaterial&&we.releaseShaderCache(b))}this.renderBufferDirect=function(b,F,G,W,k,le){F===null&&(F=pt);const ge=k.isMesh&&k.matrixWorld.determinant()<0,Ee=M_(b,F,G,W,k);Ce.setMaterial(W,ge);let Te=G.index,Ne=1;if(W.wireframe===!0){if(Te=ne.getWireframeAttribute(G),Te===void 0)return;Ne=2}const ke=G.drawRange,Ae=G.attributes.position;let tt=ke.start*Ne,ht=(ke.start+ke.count)*Ne;le!==null&&(tt=Math.max(tt,le.start*Ne),ht=Math.min(ht,(le.start+le.count)*Ne)),Te!==null?(tt=Math.max(tt,0),ht=Math.min(ht,Te.count)):Ae!=null&&(tt=Math.max(tt,0),ht=Math.min(ht,Ae.count));const gt=ht-tt;if(gt<0||gt===1/0)return;dt.setup(k,W,Ee,G,Te);let cn,rt=Me;if(Te!==null&&(cn=Q.get(Te),rt=Ke,rt.setIndex(cn)),k.isMesh)W.wireframe===!0?(Ce.setLineWidth(W.wireframeLinewidth*mt()),rt.setMode(U.LINES)):rt.setMode(U.TRIANGLES);else if(k.isLine){let be=W.linewidth;be===void 0&&(be=1),Ce.setLineWidth(be*mt()),k.isLineSegments?rt.setMode(U.LINES):k.isLineLoop?rt.setMode(U.LINE_LOOP):rt.setMode(U.LINE_STRIP)}else k.isPoints?rt.setMode(U.POINTS):k.isSprite&&rt.setMode(U.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)rt.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))rt.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const be=k._multiDrawStarts,ui=k._multiDrawCounts,st=k._multiDrawCount,On=Te?Q.get(Te).bytesPerElement:1,Hr=Re.get(W).currentProgram.getUniforms();for(let vn=0;vn<st;vn++)Hr.setValue(U,"_gl_DrawID",vn),rt.render(be[vn]/On,ui[vn])}else if(k.isInstancedMesh)rt.renderInstances(tt,gt,k.count);else if(G.isInstancedBufferGeometry){const be=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,ui=Math.min(G.instanceCount,be);rt.renderInstances(tt,gt,ui)}else rt.render(tt,gt)};function at(b,F,G){b.transparent===!0&&b.side===xi&&b.forceSinglePass===!1?(b.side=sn,b.needsUpdate=!0,ia(b,F,G),b.side=or,b.needsUpdate=!0,ia(b,F,G),b.side=xi):ia(b,F,G)}this.compile=function(b,F,G=null){G===null&&(G=b),u=Ze.get(G),u.init(F),_.push(u),G.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(u.pushLight(k),k.castShadow&&u.pushShadow(k))}),b!==G&&b.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(u.pushLight(k),k.castShadow&&u.pushShadow(k))}),u.setupLights();const W=new Set;return b.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const le=k.material;if(le)if(Array.isArray(le))for(let ge=0;ge<le.length;ge++){const Ee=le[ge];at(Ee,G,k),W.add(Ee)}else at(le,G,k),W.add(le)}),_.pop(),u=null,W},this.compileAsync=function(b,F,G=null){const W=this.compile(b,F,G);return new Promise(k=>{function le(){if(W.forEach(function(ge){Re.get(ge).currentProgram.isReady()&&W.delete(ge)}),W.size===0){k(b);return}setTimeout(le,10)}Ve.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let kn=null;function ci(b){kn&&kn(b)}function nf(){dr.stop()}function rf(){dr.start()}const dr=new d_;dr.setAnimationLoop(ci),typeof self<"u"&&dr.setContext(self),this.setAnimationLoop=function(b){kn=b,j.setAnimationLoop(b),b===null?dr.stop():dr.start()},j.addEventListener("sessionstart",nf),j.addEventListener("sessionend",rf),this.render=function(b,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),j.enabled===!0&&j.isPresenting===!0&&(j.cameraAutoUpdate===!0&&j.updateCamera(F),F=j.getCamera()),b.isScene===!0&&b.onBeforeRender(x,b,F,C),u=Ze.get(b,_.length),u.init(F),_.push(u),Pe.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),q.setFromProjectionMatrix(Pe),pe=this.localClippingEnabled,se=ae.init(this.clippingPlanes,pe),m=_e.get(b,g.length),m.init(),g.push(m),j.enabled===!0&&j.isPresenting===!0){const le=x.xr.getDepthSensingMesh();le!==null&&sc(le,F,-1/0,x.sortObjects)}sc(b,F,0,x.sortObjects),m.finish(),x.sortObjects===!0&&m.sort($,ee),je=j.enabled===!1||j.isPresenting===!1||j.hasDepthSensing()===!1,je&&Le.addToRenderList(m,b),this.info.render.frame++,se===!0&&ae.beginShadows();const G=u.state.shadowsArray;Se.render(G,b,F),se===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=m.opaque,k=m.transmissive;if(u.setupLights(),F.isArrayCamera){const le=F.cameras;if(k.length>0)for(let ge=0,Ee=le.length;ge<Ee;ge++){const Te=le[ge];of(W,k,b,Te)}je&&Le.render(b);for(let ge=0,Ee=le.length;ge<Ee;ge++){const Te=le[ge];sf(m,b,Te,Te.viewport)}}else k.length>0&&of(W,k,b,F),je&&Le.render(b),sf(m,b,F);C!==null&&(R.updateMultisampleRenderTarget(C),R.updateRenderTargetMipmap(C)),b.isScene===!0&&b.onAfterRender(x,b,F),dt.resetDefaultState(),M=-1,S=null,_.pop(),_.length>0?(u=_[_.length-1],se===!0&&ae.setGlobalState(x.clippingPlanes,u.state.camera)):u=null,g.pop(),g.length>0?m=g[g.length-1]:m=null};function sc(b,F,G,W){if(b.visible===!1)return;if(b.layers.test(F.layers)){if(b.isGroup)G=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(F);else if(b.isLight)u.pushLight(b),b.castShadow&&u.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||q.intersectsSprite(b)){W&&ze.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Pe);const ge=Z.update(b),Ee=b.material;Ee.visible&&m.push(b,ge,Ee,G,ze.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||q.intersectsObject(b))){const ge=Z.update(b),Ee=b.material;if(W&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ze.copy(b.boundingSphere.center)):(ge.boundingSphere===null&&ge.computeBoundingSphere(),ze.copy(ge.boundingSphere.center)),ze.applyMatrix4(b.matrixWorld).applyMatrix4(Pe)),Array.isArray(Ee)){const Te=ge.groups;for(let Ne=0,ke=Te.length;Ne<ke;Ne++){const Ae=Te[Ne],tt=Ee[Ae.materialIndex];tt&&tt.visible&&m.push(b,ge,tt,G,ze.z,Ae)}}else Ee.visible&&m.push(b,ge,Ee,G,ze.z,null)}}const le=b.children;for(let ge=0,Ee=le.length;ge<Ee;ge++)sc(le[ge],F,G,W)}function sf(b,F,G,W){const k=b.opaque,le=b.transmissive,ge=b.transparent;u.setupLightsView(G),se===!0&&ae.setGlobalState(x.clippingPlanes,G),W&&Ce.viewport(P.copy(W)),k.length>0&&na(k,F,G),le.length>0&&na(le,F,G),ge.length>0&&na(ge,F,G),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function of(b,F,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;u.state.transmissionRenderTarget[W.id]===void 0&&(u.state.transmissionRenderTarget[W.id]=new kr(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float")?Zo:Pi,minFilter:Cr,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const le=u.state.transmissionRenderTarget[W.id],ge=W.viewport||P;le.setSize(ge.z,ge.w);const Ee=x.getRenderTarget();x.setRenderTarget(le),x.getClearColor(V),Y=x.getClearAlpha(),Y<1&&x.setClearColor(16777215,.5),x.clear(),je&&Le.render(G);const Te=x.toneMapping;x.toneMapping=ir;const Ne=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),u.setupLightsView(W),se===!0&&ae.setGlobalState(x.clippingPlanes,W),na(b,G,W),R.updateMultisampleRenderTarget(le),R.updateRenderTargetMipmap(le),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let ke=!1;for(let Ae=0,tt=F.length;Ae<tt;Ae++){const ht=F[Ae],gt=ht.object,cn=ht.geometry,rt=ht.material,be=ht.group;if(rt.side===xi&&gt.layers.test(W.layers)){const ui=rt.side;rt.side=sn,rt.needsUpdate=!0,af(gt,G,W,cn,rt,be),rt.side=ui,rt.needsUpdate=!0,ke=!0}}ke===!0&&(R.updateMultisampleRenderTarget(le),R.updateRenderTargetMipmap(le))}x.setRenderTarget(Ee),x.setClearColor(V,Y),Ne!==void 0&&(W.viewport=Ne),x.toneMapping=Te}function na(b,F,G){const W=F.isScene===!0?F.overrideMaterial:null;for(let k=0,le=b.length;k<le;k++){const ge=b[k],Ee=ge.object,Te=ge.geometry,Ne=W===null?ge.material:W,ke=ge.group;Ee.layers.test(G.layers)&&af(Ee,F,G,Te,Ne,ke)}}function af(b,F,G,W,k,le){b.onBeforeRender(x,F,G,W,k,le),b.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),k.onBeforeRender(x,F,G,W,b,le),k.transparent===!0&&k.side===xi&&k.forceSinglePass===!1?(k.side=sn,k.needsUpdate=!0,x.renderBufferDirect(G,F,W,k,b,le),k.side=or,k.needsUpdate=!0,x.renderBufferDirect(G,F,W,k,b,le),k.side=xi):x.renderBufferDirect(G,F,W,k,b,le),b.onAfterRender(x,F,G,W,k,le)}function ia(b,F,G){F.isScene!==!0&&(F=pt);const W=Re.get(b),k=u.state.lights,le=u.state.shadowsArray,ge=k.state.version,Ee=we.getParameters(b,k.state,le,F,G),Te=we.getProgramCacheKey(Ee);let Ne=W.programs;W.environment=b.isMeshStandardMaterial?F.environment:null,W.fog=F.fog,W.envMap=(b.isMeshStandardMaterial?H:E).get(b.envMap||W.environment),W.envMapRotation=W.environment!==null&&b.envMap===null?F.environmentRotation:b.envMapRotation,Ne===void 0&&(b.addEventListener("dispose",Fe),Ne=new Map,W.programs=Ne);let ke=Ne.get(Te);if(ke!==void 0){if(W.currentProgram===ke&&W.lightsStateVersion===ge)return cf(b,Ee),ke}else Ee.uniforms=we.getUniforms(b),b.onBeforeCompile(Ee,x),ke=we.acquireProgram(Ee,Te),Ne.set(Te,ke),W.uniforms=Ee.uniforms;const Ae=W.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ae.clippingPlanes=ae.uniform),cf(b,Ee),W.needsLights=E_(b),W.lightsStateVersion=ge,W.needsLights&&(Ae.ambientLightColor.value=k.state.ambient,Ae.lightProbe.value=k.state.probe,Ae.directionalLights.value=k.state.directional,Ae.directionalLightShadows.value=k.state.directionalShadow,Ae.spotLights.value=k.state.spot,Ae.spotLightShadows.value=k.state.spotShadow,Ae.rectAreaLights.value=k.state.rectArea,Ae.ltc_1.value=k.state.rectAreaLTC1,Ae.ltc_2.value=k.state.rectAreaLTC2,Ae.pointLights.value=k.state.point,Ae.pointLightShadows.value=k.state.pointShadow,Ae.hemisphereLights.value=k.state.hemi,Ae.directionalShadowMap.value=k.state.directionalShadowMap,Ae.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Ae.spotShadowMap.value=k.state.spotShadowMap,Ae.spotLightMatrix.value=k.state.spotLightMatrix,Ae.spotLightMap.value=k.state.spotLightMap,Ae.pointShadowMap.value=k.state.pointShadowMap,Ae.pointShadowMatrix.value=k.state.pointShadowMatrix),W.currentProgram=ke,W.uniformsList=null,ke}function lf(b){if(b.uniformsList===null){const F=b.currentProgram.getUniforms();b.uniformsList=ll.seqWithValue(F.seq,b.uniforms)}return b.uniformsList}function cf(b,F){const G=Re.get(b);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function M_(b,F,G,W,k){F.isScene!==!0&&(F=pt),R.resetTextureUnits();const le=F.fog,ge=W.isMeshStandardMaterial?F.environment:null,Ee=C===null?x.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:Gs,Te=(W.isMeshStandardMaterial?H:E).get(W.envMap||ge),Ne=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,ke=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ae=!!G.morphAttributes.position,tt=!!G.morphAttributes.normal,ht=!!G.morphAttributes.color;let gt=ir;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(gt=x.toneMapping);const cn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,rt=cn!==void 0?cn.length:0,be=Re.get(W),ui=u.state.lights;if(se===!0&&(pe===!0||b!==S)){const Rn=b===S&&W.id===M;ae.setState(W,b,Rn)}let st=!1;W.version===be.__version?(be.needsLights&&be.lightsStateVersion!==ui.state.version||be.outputColorSpace!==Ee||k.isBatchedMesh&&be.batching===!1||!k.isBatchedMesh&&be.batching===!0||k.isBatchedMesh&&be.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&be.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&be.instancing===!1||!k.isInstancedMesh&&be.instancing===!0||k.isSkinnedMesh&&be.skinning===!1||!k.isSkinnedMesh&&be.skinning===!0||k.isInstancedMesh&&be.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&be.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&be.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&be.instancingMorph===!1&&k.morphTexture!==null||be.envMap!==Te||W.fog===!0&&be.fog!==le||be.numClippingPlanes!==void 0&&(be.numClippingPlanes!==ae.numPlanes||be.numIntersection!==ae.numIntersection)||be.vertexAlphas!==Ne||be.vertexTangents!==ke||be.morphTargets!==Ae||be.morphNormals!==tt||be.morphColors!==ht||be.toneMapping!==gt||be.morphTargetsCount!==rt)&&(st=!0):(st=!0,be.__version=W.version);let On=be.currentProgram;st===!0&&(On=ia(W,F,k));let Hr=!1,vn=!1,Ys=!1;const _t=On.getUniforms(),Jn=be.uniforms;if(Ce.useProgram(On.program)&&(Hr=!0,vn=!0,Ys=!0),W.id!==M&&(M=W.id,vn=!0),Hr||S!==b){Ce.buffers.depth.getReversed()?(ue.copy(b.projectionMatrix),Ky(ue),Zy(ue),_t.setValue(U,"projectionMatrix",ue)):_t.setValue(U,"projectionMatrix",b.projectionMatrix),_t.setValue(U,"viewMatrix",b.matrixWorldInverse);const Di=_t.map.cameraPosition;Di!==void 0&&Di.setValue(U,De.setFromMatrixPosition(b.matrixWorld)),We.logarithmicDepthBuffer&&_t.setValue(U,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&_t.setValue(U,"isOrthographic",b.isOrthographicCamera===!0),S!==b&&(S=b,vn=!0,Ys=!0)}if(k.isSkinnedMesh){_t.setOptional(U,k,"bindMatrix"),_t.setOptional(U,k,"bindMatrixInverse");const Rn=k.skeleton;Rn&&(Rn.boneTexture===null&&Rn.computeBoneTexture(),_t.setValue(U,"boneTexture",Rn.boneTexture,R))}k.isBatchedMesh&&(_t.setOptional(U,k,"batchingTexture"),_t.setValue(U,"batchingTexture",k._matricesTexture,R),_t.setOptional(U,k,"batchingIdTexture"),_t.setValue(U,"batchingIdTexture",k._indirectTexture,R),_t.setOptional(U,k,"batchingColorTexture"),k._colorsTexture!==null&&_t.setValue(U,"batchingColorTexture",k._colorsTexture,R));const qs=G.morphAttributes;if((qs.position!==void 0||qs.normal!==void 0||qs.color!==void 0)&&Ie.update(k,G,On),(vn||be.receiveShadow!==k.receiveShadow)&&(be.receiveShadow=k.receiveShadow,_t.setValue(U,"receiveShadow",k.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Jn.envMap.value=Te,Jn.flipEnvMap.value=Te.isCubeTexture&&Te.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&F.environment!==null&&(Jn.envMapIntensity.value=F.environmentIntensity),vn&&(_t.setValue(U,"toneMappingExposure",x.toneMappingExposure),be.needsLights&&w_(Jn,Ys),le&&W.fog===!0&&he.refreshFogUniforms(Jn,le),he.refreshMaterialUniforms(Jn,W,D,J,u.state.transmissionRenderTarget[b.id]),ll.upload(U,lf(be),Jn,R)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(ll.upload(U,lf(be),Jn,R),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&_t.setValue(U,"center",k.center),_t.setValue(U,"modelViewMatrix",k.modelViewMatrix),_t.setValue(U,"normalMatrix",k.normalMatrix),_t.setValue(U,"modelMatrix",k.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const Rn=W.uniformsGroups;for(let Di=0,Ii=Rn.length;Di<Ii;Di++){const uf=Rn[Di];N.update(uf,On),N.bind(uf,On)}}return On}function w_(b,F){b.ambientLightColor.needsUpdate=F,b.lightProbe.needsUpdate=F,b.directionalLights.needsUpdate=F,b.directionalLightShadows.needsUpdate=F,b.pointLights.needsUpdate=F,b.pointLightShadows.needsUpdate=F,b.spotLights.needsUpdate=F,b.spotLightShadows.needsUpdate=F,b.rectAreaLights.needsUpdate=F,b.hemisphereLights.needsUpdate=F}function E_(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(b,F,G){Re.get(b.texture).__webglTexture=F,Re.get(b.depthTexture).__webglTexture=G;const W=Re.get(b);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||Ve.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,F){const G=Re.get(b);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(b,F=0,G=0){C=b,T=F,A=G;let W=!0,k=null,le=!1,ge=!1;if(b){const Te=Re.get(b);if(Te.__useDefaultFramebuffer!==void 0)Ce.bindFramebuffer(U.FRAMEBUFFER,null),W=!1;else if(Te.__webglFramebuffer===void 0)R.setupRenderTarget(b);else if(Te.__hasExternalTextures)R.rebindTextures(b,Re.get(b.texture).__webglTexture,Re.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Ae=b.depthTexture;if(Te.__boundDepthTexture!==Ae){if(Ae!==null&&Re.has(Ae)&&(b.width!==Ae.image.width||b.height!==Ae.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");R.setupDepthRenderbuffer(b)}}const Ne=b.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ge=!0);const ke=Re.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ke[F])?k=ke[F][G]:k=ke[F],le=!0):b.samples>0&&R.useMultisampledRTT(b)===!1?k=Re.get(b).__webglMultisampledFramebuffer:Array.isArray(ke)?k=ke[G]:k=ke,P.copy(b.viewport),B.copy(b.scissor),z=b.scissorTest}else P.copy(ce).multiplyScalar(D).floor(),B.copy(ye).multiplyScalar(D).floor(),z=Ge;if(Ce.bindFramebuffer(U.FRAMEBUFFER,k)&&W&&Ce.drawBuffers(b,k),Ce.viewport(P),Ce.scissor(B),Ce.setScissorTest(z),le){const Te=Re.get(b.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+F,Te.__webglTexture,G)}else if(ge){const Te=Re.get(b.texture),Ne=F||0;U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,Te.__webglTexture,G||0,Ne)}M=-1},this.readRenderTargetPixels=function(b,F,G,W,k,le,ge){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ee=Re.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ge!==void 0&&(Ee=Ee[ge]),Ee){Ce.bindFramebuffer(U.FRAMEBUFFER,Ee);try{const Te=b.texture,Ne=Te.format,ke=Te.type;if(!We.textureFormatReadable(Ne)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!We.textureTypeReadable(ke)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=b.width-W&&G>=0&&G<=b.height-k&&U.readPixels(F,G,W,k,Be.convert(Ne),Be.convert(ke),le)}finally{const Te=C!==null?Re.get(C).__webglFramebuffer:null;Ce.bindFramebuffer(U.FRAMEBUFFER,Te)}}},this.readRenderTargetPixelsAsync=async function(b,F,G,W,k,le,ge){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ee=Re.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ge!==void 0&&(Ee=Ee[ge]),Ee){const Te=b.texture,Ne=Te.format,ke=Te.type;if(!We.textureFormatReadable(Ne))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!We.textureTypeReadable(ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=b.width-W&&G>=0&&G<=b.height-k){Ce.bindFramebuffer(U.FRAMEBUFFER,Ee);const Ae=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ae),U.bufferData(U.PIXEL_PACK_BUFFER,le.byteLength,U.STREAM_READ),U.readPixels(F,G,W,k,Be.convert(Ne),Be.convert(ke),0);const tt=C!==null?Re.get(C).__webglFramebuffer:null;Ce.bindFramebuffer(U.FRAMEBUFFER,tt);const ht=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await $y(U,ht,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ae),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,le),U.deleteBuffer(Ae),U.deleteSync(ht),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(b,F=null,G=0){b.isTexture!==!0&&(mo("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,b=arguments[1]);const W=Math.pow(2,-G),k=Math.floor(b.image.width*W),le=Math.floor(b.image.height*W),ge=F!==null?F.x:0,Ee=F!==null?F.y:0;R.setTexture2D(b,0),U.copyTexSubImage2D(U.TEXTURE_2D,G,0,0,ge,Ee,k,le),Ce.unbindTexture()},this.copyTextureToTexture=function(b,F,G=null,W=null,k=0){b.isTexture!==!0&&(mo("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,b=arguments[1],F=arguments[2],k=arguments[3]||0,G=null);let le,ge,Ee,Te,Ne,ke,Ae,tt,ht;const gt=b.isCompressedTexture?b.mipmaps[k]:b.image;G!==null?(le=G.max.x-G.min.x,ge=G.max.y-G.min.y,Ee=G.isBox3?G.max.z-G.min.z:1,Te=G.min.x,Ne=G.min.y,ke=G.isBox3?G.min.z:0):(le=gt.width,ge=gt.height,Ee=gt.depth||1,Te=0,Ne=0,ke=0),W!==null?(Ae=W.x,tt=W.y,ht=W.z):(Ae=0,tt=0,ht=0);const cn=Be.convert(F.format),rt=Be.convert(F.type);let be;F.isData3DTexture?(R.setTexture3D(F,0),be=U.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(R.setTexture2DArray(F,0),be=U.TEXTURE_2D_ARRAY):(R.setTexture2D(F,0),be=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,F.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,F.unpackAlignment);const ui=U.getParameter(U.UNPACK_ROW_LENGTH),st=U.getParameter(U.UNPACK_IMAGE_HEIGHT),On=U.getParameter(U.UNPACK_SKIP_PIXELS),Hr=U.getParameter(U.UNPACK_SKIP_ROWS),vn=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,gt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,gt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Te),U.pixelStorei(U.UNPACK_SKIP_ROWS,Ne),U.pixelStorei(U.UNPACK_SKIP_IMAGES,ke);const Ys=b.isDataArrayTexture||b.isData3DTexture,_t=F.isDataArrayTexture||F.isData3DTexture;if(b.isRenderTargetTexture||b.isDepthTexture){const Jn=Re.get(b),qs=Re.get(F),Rn=Re.get(Jn.__renderTarget),Di=Re.get(qs.__renderTarget);Ce.bindFramebuffer(U.READ_FRAMEBUFFER,Rn.__webglFramebuffer),Ce.bindFramebuffer(U.DRAW_FRAMEBUFFER,Di.__webglFramebuffer);for(let Ii=0;Ii<Ee;Ii++)Ys&&U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Re.get(b).__webglTexture,k,ke+Ii),b.isDepthTexture?(_t&&U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Re.get(F).__webglTexture,k,ht+Ii),U.blitFramebuffer(Te,Ne,le,ge,Ae,tt,le,ge,U.DEPTH_BUFFER_BIT,U.NEAREST)):_t?U.copyTexSubImage3D(be,k,Ae,tt,ht+Ii,Te,Ne,le,ge):U.copyTexSubImage2D(be,k,Ae,tt,ht+Ii,Te,Ne,le,ge);Ce.bindFramebuffer(U.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else _t?b.isDataTexture||b.isData3DTexture?U.texSubImage3D(be,k,Ae,tt,ht,le,ge,Ee,cn,rt,gt.data):F.isCompressedArrayTexture?U.compressedTexSubImage3D(be,k,Ae,tt,ht,le,ge,Ee,cn,gt.data):U.texSubImage3D(be,k,Ae,tt,ht,le,ge,Ee,cn,rt,gt):b.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,k,Ae,tt,le,ge,cn,rt,gt.data):b.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,k,Ae,tt,gt.width,gt.height,cn,gt.data):U.texSubImage2D(U.TEXTURE_2D,k,Ae,tt,le,ge,cn,rt,gt);U.pixelStorei(U.UNPACK_ROW_LENGTH,ui),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,st),U.pixelStorei(U.UNPACK_SKIP_PIXELS,On),U.pixelStorei(U.UNPACK_SKIP_ROWS,Hr),U.pixelStorei(U.UNPACK_SKIP_IMAGES,vn),k===0&&F.generateMipmaps&&U.generateMipmap(be),Ce.unbindTexture()},this.copyTextureToTexture3D=function(b,F,G=null,W=null,k=0){return b.isTexture!==!0&&(mo("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,b=arguments[2],F=arguments[3],k=arguments[4]||0),mo('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(b,F,G,W,k)},this.initRenderTarget=function(b){Re.get(b).__webglFramebuffer===void 0&&R.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?R.setTextureCube(b,0):b.isData3DTexture?R.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?R.setTexture2DArray(b,0):R.setTexture2D(b,0),Ce.unbindTexture()},this.resetState=function(){T=0,A=0,C=null,Ce.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Je._getDrawingBufferColorSpace(e),t.unpackColorSpace=Je._getUnpackColorSpace()}}class Zh{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new qe(e),this.density=t}clone(){return new Zh(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class a2 extends Bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new li,this.environmentIntensity=1,this.environmentRotation=new li,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class v_ extends Xs{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new qe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ul=new I,zl=new I,vm=new yt,lo=new Yh,Ga=new nc,lu=new I,xm=new I;class l2 extends Bt{constructor(e=new Cn,t=new v_){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)Ul.fromBufferAttribute(t,r-1),zl.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=Ul.distanceTo(zl);e.setAttribute("lineDistance",new It(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ga.copy(i.boundingSphere),Ga.applyMatrix4(r),Ga.radius+=s,e.ray.intersectsSphere(Ga)===!1)return;vm.copy(r).invert(),lo.copy(e.ray).applyMatrix4(vm);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,d=i.index,f=i.attributes.position;if(d!==null){const p=Math.max(0,o.start),v=Math.min(d.count,o.start+o.count);for(let y=p,m=v-1;y<m;y+=c){const u=d.getX(y),g=d.getX(y+1),_=Wa(this,e,lo,l,u,g);_&&t.push(_)}if(this.isLineLoop){const y=d.getX(v-1),m=d.getX(p),u=Wa(this,e,lo,l,y,m);u&&t.push(u)}}else{const p=Math.max(0,o.start),v=Math.min(f.count,o.start+o.count);for(let y=p,m=v-1;y<m;y+=c){const u=Wa(this,e,lo,l,y,y+1);u&&t.push(u)}if(this.isLineLoop){const y=Wa(this,e,lo,l,v-1,p);y&&t.push(y)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Wa(n,e,t,i,r,s){const o=n.geometry.attributes.position;if(Ul.fromBufferAttribute(o,r),zl.fromBufferAttribute(o,s),t.distanceSqToSegment(Ul,zl,lu,xm)>i)return;lu.applyMatrix4(n.matrixWorld);const l=e.ray.origin.distanceTo(lu);if(!(l<e.near||l>e.far))return{distance:l,point:xm.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}class Qh extends on{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Vt extends Cn{constructor(e=1,t=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const d=[],h=[],f=[],p=[];let v=0;const y=[],m=i/2;let u=0;g(),o===!1&&(e>0&&_(!0),t>0&&_(!1)),this.setIndex(d),this.setAttribute("position",new It(h,3)),this.setAttribute("normal",new It(f,3)),this.setAttribute("uv",new It(p,2));function g(){const x=new I,w=new I;let T=0;const A=(t-e)/i;for(let C=0;C<=s;C++){const M=[],S=C/s,P=S*(t-e)+e;for(let B=0;B<=r;B++){const z=B/r,V=z*l+a,Y=Math.sin(V),X=Math.cos(V);w.x=P*Y,w.y=-S*i+m,w.z=P*X,h.push(w.x,w.y,w.z),x.set(Y,A,X).normalize(),f.push(x.x,x.y,x.z),p.push(z,1-S),M.push(v++)}y.push(M)}for(let C=0;C<r;C++)for(let M=0;M<s;M++){const S=y[M][C],P=y[M+1][C],B=y[M+1][C+1],z=y[M][C+1];(e>0||M!==0)&&(d.push(S,P,z),T+=3),(t>0||M!==s-1)&&(d.push(P,B,z),T+=3)}c.addGroup(u,T,0),u+=T}function _(x){const w=v,T=new $e,A=new I;let C=0;const M=x===!0?e:t,S=x===!0?1:-1;for(let B=1;B<=r;B++)h.push(0,m*S,0),f.push(0,S,0),p.push(.5,.5),v++;const P=v;for(let B=0;B<=r;B++){const V=B/r*l+a,Y=Math.cos(V),X=Math.sin(V);A.x=M*X,A.y=m*S,A.z=M*Y,h.push(A.x,A.y,A.z),f.push(0,S,0),T.x=Y*.5+.5,T.y=X*.5*S+.5,p.push(T.x,T.y),v++}for(let B=0;B<r;B++){const z=w+B,V=P+B;x===!0?d.push(V,V+1,z):d.push(V+1,V,z),C+=3}c.addGroup(u,C,x===!0?1:2),u+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vt(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Jh extends Vt{constructor(e=1,t=1,i=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,e,t,i,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Jh(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ef extends Cn{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};const s=[],o=[];a(r),c(i),d(),this.setAttribute("position",new It(s,3)),this.setAttribute("normal",new It(s.slice(),3)),this.setAttribute("uv",new It(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(g){const _=new I,x=new I,w=new I;for(let T=0;T<t.length;T+=3)p(t[T+0],_),p(t[T+1],x),p(t[T+2],w),l(_,x,w,g)}function l(g,_,x,w){const T=w+1,A=[];for(let C=0;C<=T;C++){A[C]=[];const M=g.clone().lerp(x,C/T),S=_.clone().lerp(x,C/T),P=T-C;for(let B=0;B<=P;B++)B===0&&C===T?A[C][B]=M:A[C][B]=M.clone().lerp(S,B/P)}for(let C=0;C<T;C++)for(let M=0;M<2*(T-C)-1;M++){const S=Math.floor(M/2);M%2===0?(f(A[C][S+1]),f(A[C+1][S]),f(A[C][S])):(f(A[C][S+1]),f(A[C+1][S+1]),f(A[C+1][S]))}}function c(g){const _=new I;for(let x=0;x<s.length;x+=3)_.x=s[x+0],_.y=s[x+1],_.z=s[x+2],_.normalize().multiplyScalar(g),s[x+0]=_.x,s[x+1]=_.y,s[x+2]=_.z}function d(){const g=new I;for(let _=0;_<s.length;_+=3){g.x=s[_+0],g.y=s[_+1],g.z=s[_+2];const x=m(g)/2/Math.PI+.5,w=u(g)/Math.PI+.5;o.push(x,1-w)}v(),h()}function h(){for(let g=0;g<o.length;g+=6){const _=o[g+0],x=o[g+2],w=o[g+4],T=Math.max(_,x,w),A=Math.min(_,x,w);T>.9&&A<.1&&(_<.2&&(o[g+0]+=1),x<.2&&(o[g+2]+=1),w<.2&&(o[g+4]+=1))}}function f(g){s.push(g.x,g.y,g.z)}function p(g,_){const x=g*3;_.x=e[x+0],_.y=e[x+1],_.z=e[x+2]}function v(){const g=new I,_=new I,x=new I,w=new I,T=new $e,A=new $e,C=new $e;for(let M=0,S=0;M<s.length;M+=9,S+=6){g.set(s[M+0],s[M+1],s[M+2]),_.set(s[M+3],s[M+4],s[M+5]),x.set(s[M+6],s[M+7],s[M+8]),T.set(o[S+0],o[S+1]),A.set(o[S+2],o[S+3]),C.set(o[S+4],o[S+5]),w.copy(g).add(_).add(x).divideScalar(3);const P=m(w);y(T,S+0,g,P),y(A,S+2,_,P),y(C,S+4,x,P)}}function y(g,_,x,w){w<0&&g.x===1&&(o[_]=g.x-1),x.x===0&&x.z===0&&(o[_]=w/2/Math.PI+.5)}function m(g){return Math.atan2(g.z,-g.x)}function u(g){return Math.atan2(-g.y,Math.sqrt(g.x*g.x+g.z*g.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ef(e.vertices,e.indices,e.radius,e.details)}}class rc extends ef{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new rc(e.radius,e.detail)}}class Xo extends Cn{constructor(e=1,t=32,i=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(o+a,Math.PI);let c=0;const d=[],h=new I,f=new I,p=[],v=[],y=[],m=[];for(let u=0;u<=i;u++){const g=[],_=u/i;let x=0;u===0&&o===0?x=.5/t:u===i&&l===Math.PI&&(x=-.5/t);for(let w=0;w<=t;w++){const T=w/t;h.x=-e*Math.cos(r+T*s)*Math.sin(o+_*a),h.y=e*Math.cos(o+_*a),h.z=e*Math.sin(r+T*s)*Math.sin(o+_*a),v.push(h.x,h.y,h.z),f.copy(h).normalize(),y.push(f.x,f.y,f.z),m.push(T+x,1-_),g.push(c++)}d.push(g)}for(let u=0;u<i;u++)for(let g=0;g<t;g++){const _=d[u][g+1],x=d[u][g],w=d[u+1][g],T=d[u+1][g+1];(u!==0||o>0)&&p.push(_,x,T),(u!==i-1||l<Math.PI)&&p.push(x,w,T)}this.setIndex(p),this.setAttribute("position",new It(v,3)),this.setAttribute("normal",new It(y,3)),this.setAttribute("uv",new It(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class it extends Xs{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new qe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new qe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=e_,this.normalScale=new $e(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new li,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class tf extends Bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new qe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class c2 extends tf{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Bt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new qe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const cu=new yt,ym=new I,Sm=new I;class x_{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new $e(512,512),this.map=null,this.mapPass=null,this.matrix=new yt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $h,this._frameExtents=new $e(1,1),this._viewportCount=1,this._viewports=[new ut(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;ym.setFromMatrixPosition(e.matrixWorld),t.position.copy(ym),Sm.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Sm),t.updateMatrixWorld(),cu.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(cu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(cu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Mm=new yt,co=new I,uu=new I;class u2 extends x_{constructor(){super(new Mn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new $e(4,2),this._viewportCount=6,this._viewports=[new ut(2,1,1,1),new ut(0,1,1,1),new ut(3,1,1,1),new ut(1,1,1,1),new ut(3,0,1,1),new ut(1,0,1,1)],this._cubeDirections=[new I(1,0,0),new I(-1,0,0),new I(0,0,1),new I(0,0,-1),new I(0,1,0),new I(0,-1,0)],this._cubeUps=[new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,1,0),new I(0,0,1),new I(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,r=this.matrix,s=e.distance||i.far;s!==i.far&&(i.far=s,i.updateProjectionMatrix()),co.setFromMatrixPosition(e.matrixWorld),i.position.copy(co),uu.copy(i.position),uu.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(uu),i.updateMatrixWorld(),r.makeTranslation(-co.x,-co.y,-co.z),Mm.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Mm)}}class Rr extends tf{constructor(e,t,i=0,r=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new u2}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class d2 extends x_{constructor(){super(new h_(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class h2 extends tf{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Bt.DEFAULT_UP),this.updateMatrix(),this.target=new Bt,this.shadow=new d2}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}const wm=new yt;class f2{constructor(e,t,i=0,r=1/0){this.ray=new Yh(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new qh,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return wm.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(wm),this}intersectObject(e,t=!0,i=[]){return Xd(e,this,i,t),i.sort(Em),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Xd(e[r],this,i,t);return i.sort(Em),i}}function Em(n,e){return n.distance-e.distance}function Xd(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let o=0,a=s.length;o<a;o++)Xd(s[o],e,t,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Bh}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Bh);let y_=0;function oe(n,e,t,i,r,s,o,a="wall",l=!0){return{id:`b_${y_++}`,x1:Math.min(n,i),y1:Math.min(e,r),z1:Math.min(t,s),x2:Math.max(n,i),y2:Math.max(e,r),z2:Math.max(t,s),material:o,solid:l,radarType:a}}let S_=0;function dn(n,e,t,i,r,s,o,a="sand",l=.6){return{id:`r_${S_++}`,x1:Math.min(n,t),z1:Math.min(e,i),x2:Math.max(n,t),z2:Math.max(e,i),yStart:r,yEnd:s,axis:o,thickness:l,material:a}}function p2(){y_=0,S_=0;const n=[],e=[];n.push(oe(-54,-2,-54,54,-.5,54,"sand","none",!0)),n.push(oe(-24,-.5,34,24,3,48,"sand","floor")),n.push(oe(24,-.5,24,44,3,42,"sand","floor")),n.push(oe(30,-.5,-16,48,1.5,12,"sand","floor")),n.push(oe(30,-.5,-46,48,3.4,-28,"stone_floor","floor")),n.push(oe(-8,-.5,10,12,1.6,22,"sand","floor")),n.push(oe(-10,-.5,-20,6,0,0,"sand","floor")),n.push(oe(-22,-.5,-44,4,0,-20,"stone_floor","floor")),n.push(oe(4,-.5,-44,18,0,-32,"stone_floor","floor")),n.push(oe(6,-.5,-26,12,3,-6,"stone_floor","floor")),n.push(oe(6,-.5,-32,24,3,-24,"stone_floor","floor")),n.push(oe(-44,-.5,28,-36,1.8,42,"sand","floor")),n.push(oe(-44,-.5,-8,-26,1.8,28,"stone_floor","floor")),n.push(oe(-46,-.5,-44,-22,.5,-16,"sand","floor")),n.push(oe(-46,.5,-44,-40,1.2,-37,"stone_floor","floor")),e.push(dn(-40,-44,-37.5,-37,1.2,.5,"x","stone_floor",.4)),e.push(dn(-6,22,8,34,1.6,3,"z","sand",1.2)),e.push(dn(10,18,24,26,1.6,3,"x","sand",1.2)),e.push(dn(28,12,44,24,1.5,3,"z","stone_floor",1.2)),e.push(dn(30,-28,48,-16,3.4,1.5,"z","sand",1.4)),e.push(dn(-10,0,6,10,0,1.6,"z","sand",1)),e.push(dn(6,-6,12,10,3,1.6,"z","stone_floor",1.4)),e.push(dn(24,-32,30,-26,3,3.4,"x","stone_floor",1.2)),e.push(dn(18,-44,30,-34,0,3.4,"x","sand",1.2)),e.push(dn(-36,28,-24,42,1.8,3,"x","sand",1.2)),e.push(dn(-26,-8,-10,0,1.8,0,"x","stone_floor",1.2)),e.push(dn(-42,-16,-30,-8,.5,1.8,"z","stone_floor",1.2)),e.push(dn(-22.5,-31,-20,-25,.5,0,"x","stone_floor",.4)),e.push(dn(-22.5,-40,-20,-35,.5,0,"x","stone_floor",.4)),n.push(oe(-46,-.5,48,26,11,50,"wall_sandstone")),n.push(oe(-46,-.5,42,-24,10.5,48,"wall_sandstone")),n.push(oe(24,-.5,42,46,10.5,48,"wall_sandstone")),n.push(oe(44,-.5,12,50,11.5,44,"wall_sandstone")),n.push(oe(48,-.5,-48,50,12,14,"wall_sandstone")),n.push(oe(-48,-.5,-46,-22,11,-44,"wall_sandstone")),n.push(oe(-22,-.5,-46,30,10.5,-44,"wall_plaster")),n.push(oe(30,-.5,-48,50,11.5,-46,"wall_sandstone")),n.push(oe(-48,-.5,-46,-46,11,-14,"wall_sandstone")),n.push(oe(-46,-.5,-16,-44,10.5,44,"wall_sandstone")),n.push(oe(-26,-.5,22,-8,10,34,"wall_plaster")),n.push(oe(-8,-.5,28,-6,9.5,34,"wall_sandstone")),n.push(oe(8,-.5,26,24,10.2,34,"wall_plaster")),n.push(oe(12,-.5,10,28,10.5,18,"wall_sandstone")),n.push(oe(12,-.5,-24,30,11,12,"wall_plaster")),n.push(oe(24,-.5,-26,30,9,-24,"wall_sandstone")),n.push(oe(24,-.5,23,31,9.5,24.5,"wall_sandstone")),n.push(oe(39,-.5,23,44,9.5,24.5,"wall_sandstone")),n.push(oe(31,6.2,23,39,9.5,24.5,"wall_sandstone","none")),n.push(oe(28,-.5,11.2,35.2,9.5,12.6,"wall_sandstone")),n.push(oe(41.8,-.5,11.2,44,9.5,12.6,"wall_sandstone")),n.push(oe(35.2,5.4,11.2,41.8,9.5,12.6,"wall_sandstone","none")),n.push(oe(35.2,1.5,11.4,36.4,5.4,12.1,"door_metal","door")),n.push(oe(40.6,1.5,11.7,41.8,5.4,12.4,"door_metal","door")),n.push(oe(28,7.6,12,44,8.6,24,"roof","none")),n.push(oe(-26,-.5,0,-10,10.5,22,"wall_sandstone")),n.push(oe(-10,-.5,10,-8,10.5,22,"wall_sandstone")),n.push(oe(-26,-.5,-20,-10,10.5,-8,"wall_plaster")),n.push(oe(-30,-.5,-16,-22,9.5,-8,"wall_sandstone")),n.push(oe(-46,-.5,-16,-42,9.5,-8,"wall_sandstone")),n.push(oe(-44,6.2,14,-26,7.2,26,"roof","none")),n.push(oe(-44,6.2,-8,-26,7.2,10,"roof","none")),n.push(oe(-26,5.5,-8,-10,6.5,0,"roof","none")),n.push(oe(-36.2,1.8,8,-33.6,6.2,10.6,"wall_dark","wall")),n.push(oe(-10,-.5,-21.2,-6.2,9.5,-18.8,"wall_sandstone")),n.push(oe(.6,-.5,-21.2,6,9.5,-18.8,"wall_sandstone")),n.push(oe(-6.2,4.2,-21.2,.6,9.5,-18.8,"wall_sandstone","none")),n.push(oe(-6.2,0,-20.6,-4.2,4.2,-19.8,"door_wood","door")),n.push(oe(-1.4,0,-20,.6,4.2,-19.2,"door_wood","door")),n.push(oe(5.5,3,-26,6.2,3.85,-8,"wall_sandstone","wall")),n.push(oe(6,3,-32.6,24,3.75,-31.9,"wall_sandstone","wall")),n.push(oe(18,-.5,-34,30,3.4,-32,"wall_sandstone","wall")),n.push(oe(-22.8,-.5,-25,-21.4,9.5,-16,"wall_sandstone")),n.push(oe(-22.8,4.2,-31,-21.4,9.5,-25,"wall_sandstone","none")),n.push(oe(-22.6,.5,-31,-21.8,4.2,-29.8,"door_wood","door")),n.push(oe(-22.2,.5,-26.2,-21.4,4.2,-25,"door_wood","door")),n.push(oe(-22.8,-.5,-35,-21.4,9.5,-31,"wall_sandstone")),n.push(oe(-22.8,3.9,-40,-21.4,9.5,-35,"wall_sandstone","none")),n.push(oe(-22.8,-.5,-44,-21.4,9.5,-40,"wall_sandstone")),n.push(oe(2.8,0,-6.2,5.4,1.9,-3.6,"crate_wood","crate")),n.push(oe(-7.6,1.6,13.5,-5.4,3.3,15.8,"crate_wood","crate")),n.push(oe(36,3.4,-39.5,39.2,5.4,-36.5,"crate_wood","crate")),n.push(oe(37.2,5.4,-39,39,6.8,-37,"crate_green","crate")),n.push(oe(32.5,3.4,-33.5,34.8,5,-31.2,"crate_green","crate")),n.push(oe(44.2,3.4,-44.5,46.8,5,-42.2,"crate_wood","crate")),n.push(oe(30.4,1.5,-11.5,32.8,3.3,-8.5,"crate_green","crate")),n.push(oe(44,1.5,-13,47.4,2.7,-7.8,"car_metal","crate")),n.push(oe(44.3,2.7,-11.8,47.1,3.55,-9,"car_metal","crate")),n.push(oe(42.5,1.5,4,46.5,2.7,6.2,"crate_wood","crate")),n.push(oe(26.5,3,30,29,4.8,32.5,"crate_wood","crate")),n.push(oe(-35.5,.5,-31,-32.2,2.5,-28,"crate_wood","crate")),n.push(oe(-34.8,2.5,-30.5,-32.7,4,-28.5,"crate_green","crate")),n.push(oe(-40.5,.5,-35.8,-37.5,2.6,-32.8,"crate_wood","crate")),n.push(oe(-44.8,.5,-23.5,-41.8,1.7,-18.5,"car_metal","crate")),n.push(oe(-44.4,1.7,-22.4,-42.1,2.5,-19.6,"car_metal","crate")),n.push(oe(-27.2,.5,-24.5,-24.8,2.1,-22.2,"crate_green","crate")),n.push(oe(-12.5,0,-34.5,-9.8,1.8,-32,"crate_green","crate")),n.push(oe(8,0,-42,10.8,1.7,-39.5,"crate_wood","crate")),n.push(oe(-14,3,39.5,-11.5,4.7,42,"crate_wood","crate")),n.push(oe(11.5,3,39.5,14,4.7,42,"crate_wood","crate")),n.push(oe(32,3.41,-43.5,44.5,3.44,-30.5,"site_a","none",!1)),n.push(oe(-41.5,.51,-39,-27,.54,-24.5,"site_b","none",!1));const t=[{name:"A Site",site:"A",x1:31.5,z1:-44,x2:45,z2:-30,floorY:3.4},{name:"B Site",site:"B",x1:-42,z1:-39.5,x2:-26.5,z2:-24,floorY:.5}],i={CT:{name:"CT Spawn",x1:1,z1:-44,x2:20,z2:-31,floorY:0},T:{name:"T Spawn",x1:-24,z1:34,x2:24,z2:48,floorY:3}},r=[{name:"T 出生点 (T Spawn)",x1:-24,z1:34,x2:24,z2:48,floorY:3},{name:"CT 出生点 (CT Spawn)",x1:4,z1:-44,x2:20,z2:-32,floorY:0},{name:"A点 (A Site)",x1:30,z1:-46,x2:48,z2:-28,floorY:3.4},{name:"A大斜坡 (A Ramp)",x1:30,z1:-28,x2:48,z2:-16,floorY:2.4},{name:"A大 (A Long)",x1:30,z1:-16,x2:48,z2:12,floorY:1.5},{name:"A大房 (Long Doors)",x1:28,z1:12,x2:44,z2:24,floorY:2.2},{name:"A大外 (Outside Long)",x1:24,z1:24,x2:44,z2:42,floorY:3},{name:"猫道 (Catwalk / A Short)",x1:6,z1:-32,x2:30,z2:-6,floorY:3},{name:"猫道楼梯 (Short Stairs)",x1:6,z1:-6,x2:12,z2:10,floorY:2.3},{name:"中门 (Mid Doors)",x1:-10,z1:-24,x2:6,z2:-16,floorY:0},{name:"中路 (Mid)",x1:-10,z1:-16,x2:6,z2:10,floorY:.5},{name:"中路高台 (Top Mid)",x1:-8,z1:10,x2:12,z2:34,floorY:2},{name:"CT中路 (CT Mid)",x1:-22,z1:-44,x2:4,z2:-20,floorY:0},{name:"B洞下层 (Lower Tunnels)",x1:-26,z1:-8,x2:-10,z2:0,floorY:.9},{name:"B洞上层 (Upper Tunnels)",x1:-44,z1:-16,x2:-26,z2:28,floorY:1.8},{name:"B洞外 (Outside Tunnels)",x1:-44,z1:28,x2:-24,z2:42,floorY:2.4},{name:"B点 (B Site)",x1:-46,z1:-44,x2:-22,z2:-16,floorY:.5}],s={CT:[{x:13.5,y:0,z:-38.5,yaw:Math.PI*.5},{x:11,y:0,z:-35.5,yaw:Math.PI*.5},{x:6.5,y:0,z:-37.5,yaw:Math.PI*.5},{x:15.5,y:0,z:-41.5,yaw:-Math.PI*.4},{x:5.5,y:0,z:-41.5,yaw:Math.PI*.55}],T:[{x:.5,y:3,z:42.5,yaw:0},{x:-5.5,y:3,z:43,yaw:0},{x:6.5,y:3,z:43,yaw:0},{x:-16.5,y:3,z:43.5,yaw:.4},{x:17.5,y:3,z:43.5,yaw:-.4}]};return{boxes:n,ramps:e,plantZones:t,buyZones:i,callouts:r,spawns:s}}function m2(n,e,t){for(const i of n.callouts)if(e>=i.x1&&e<=i.x2&&t>=i.z1&&t<=i.z2)return i.name;return"Dust2"}function Fl(n,e,t,i){for(const r of n.plantZones)if(e>=r.x1&&e<=r.x2&&i>=r.z1&&i<=r.z2&&Math.abs(t-r.floorY)<1.6)return r.site??null;return null}function Tm(n,e,t,i){const r=n.buyZones[e];return t>=r.x1&&t<=r.x2&&i>=r.z1&&i<=r.z2}class g2{constructor(e,t,i){O(this,"nav");O(this,"physics");O(this,"mapData");O(this,"roleMap",new Map);O(this,"pathMap",new Map);O(this,"pathIndexMap",new Map);O(this,"repathTimerMap",new Map);O(this,"strafeDirMap",new Map);O(this,"strafeTimerMap",new Map);O(this,"reactionTimerMap",new Map);O(this,"lastTargetMap",new Map);O(this,"lastPosMap",new Map);O(this,"stuckTimerMap",new Map);O(this,"keypadTimerMap",new Map);O(this,"holdTimerMap",new Map);this.nav=e,this.physics=t,this.mapData=i}resetForRound(e,t,i){this.pathMap.clear(),this.pathIndexMap.clear(),this.repathTimerMap.clear(),this.reactionTimerMap.clear(),this.lastTargetMap.clear(),this.stuckTimerMap.clear(),this.holdTimerMap.clear();const r=["a_long","a_short","mid","b_site","b_site"],s=["a_long","a_long","a_short","a_short","mid"],o=["b_tun","b_tun","b_tun","mid","a_short"];let a=0,l=0;for(const c of e){if(c.team==="CT")this.roleMap.set(c.id,r[a%r.length]),a++;else{const d=i==="A"?s:o;this.roleMap.set(c.id,d[l%d.length]),l++}this.strafeDirMap.set(c.id,Math.random()<.5?-1:1),this.strafeTimerMap.set(c.id,.8+Math.random()*1.2),this.lastPosMap.set(c.id,c.pos.clone()),this.repathTimerMap.set(c.id,Math.random()*.4),c.isHuman||this.botBuyEquipment(c,t)}}botBuyEquipment(e,t){var i;if(t){e.money>=Ue.deagle.price&&Math.random()<.25&&(e.money-=Ue.deagle.price,e.equipWeapon("deagle"));return}if(e.armor<80&&e.money>=Ye.ARMOR_COST&&(e.money-=Ye.ARMOR_COST,e.armor=100),!e.hasHelmet&&e.armor>0&&e.money>=Ye.HELMET_COST&&(e.money-=Ye.HELMET_COST,e.hasHelmet=!0),!e.primary){const r=this.roleMap.get(e.id)??"mid";(r==="mid"||r==="a_long")&&Math.random()<.38&&e.money>=Ue.awp.price?(e.money-=Ue.awp.price,e.equipWeapon("awp")):e.team==="T"&&e.money>=Ue.ak47.price?(e.money-=Ue.ak47.price,e.equipWeapon("ak47")):e.team==="CT"&&e.money>=Ue.m4a4.price?(e.money-=Ue.m4a4.price,e.equipWeapon("m4a4")):e.money>=Ue.ak47.price?(e.money-=Ue.ak47.price,e.equipWeapon(e.team==="T"?"ak47":"m4a4")):e.money>=Ue.deagle.price&&((i=e.secondary)==null?void 0:i.id)!=="deagle"&&(e.money-=Ue.deagle.price,e.equipWeapon("deagle"))}}updateBot(e,t,i){if(!e.alive||e.isHuman)return;if(i.roundPhase==="freeze"){e.vel.x*=.8,e.vel.z*=.8,this.physics.moveCharacter(e.pos,e.vel,t,Qe.PLAYER_HEIGHT);return}e.fireCooldown>0&&(e.fireCooldown-=t),e.updateReload(t);const r=Ue[e.getActiveWeaponId()];e.recoilSpread=Math.max(0,e.recoilSpread-r.recoilRecovery*.015*t),!e.isPlanting&&!e.isDefusing&&this.ensureCombatWeapon(e);const s=this.findVisibleEnemy(e,i.combatants,i.time);if(e.isPlanting)if(!e.hasC4||i.bombState!=="carried")e.isPlanting=!1,e.plantProgress=0;else if(s&&s.pos.distanceTo(e.pos)<11)e.isPlanting=!1,e.plantProgress=0,this.ensureCombatWeapon(e);else{e.vel.x=0,e.vel.z=0,e.crouching=!0,e.plantProgress+=t/Ye.PLANT_TIME;const l=(this.keypadTimerMap.get(e.id)??0)-t;if(l<=0?(i.onBotKeypadBeep(e.pos),this.keypadTimerMap.set(e.id,.45)):this.keypadTimerMap.set(e.id,l),e.plantProgress>=1){const c=Fl(this.mapData,e.pos.x,e.pos.y,e.pos.z)??i.tExecuteSite;e.isPlanting=!1,e.plantProgress=0,e.crouching=!1,i.onBotPlantComplete(e,c)}this.physics.moveCharacter(e.pos,e.vel,t,Qe.PLAYER_CROUCH_HEIGHT);return}if(e.isDefusing){const l=e.pos.distanceTo(i.bombPos);if(i.bombState!=="planted"||l>3)e.isDefusing=!1,e.defuseProgress=0;else if(s&&s.pos.distanceTo(e.pos)<12&&e.defuseProgress<.72)e.isDefusing=!1,e.defuseProgress=0;else{e.vel.x=0,e.vel.z=0,e.crouching=!0,this.aimAtPoint(e,i.bombPos,t,6),e.defuseProgress+=t/Ye.DEFUSE_TIME,e.defuseProgress>=1&&(e.isDefusing=!1,e.defuseProgress=0,e.crouching=!1,i.onBotDefuseComplete(e)),this.physics.moveCharacter(e.pos,e.vel,t,Qe.PLAYER_CROUCH_HEIGHT);return}}if(e.crouching=!1,s){this.lastTargetMap.get(e.id)!==s.id&&(this.lastTargetMap.set(e.id,s.id),this.reactionTimerMap.set(e.id,.22+Math.random()*.24));const c=s.pos.clone();c.y+=1.28,this.aimAtPoint(e,c,t,9.5);const d=e.getActiveWeaponId(),h=e.pos.distanceTo(s.pos);if(d==="awp")e.vel.x*=Math.max(0,1-t*10),e.vel.z*=Math.max(0,1-t*10);else{let p=(this.strafeTimerMap.get(e.id)??.6)-t;p<=0&&(this.strafeDirMap.set(e.id,-(this.strafeDirMap.get(e.id)??1)),p=.45+Math.random()*.7),this.strafeTimerMap.set(e.id,p);const v=new I(s.pos.x-e.pos.x,0,s.pos.z-e.pos.z).normalize(),y=new I(-v.z,0,v.x),m=this.strafeDirMap.get(e.id)??1,u=y.multiplyScalar(m*.65);h>26?u.addScaledVector(v,.4):h<6&&u.addScaledVector(v,-.45),u.normalize();const g=Qe.BASE_MOVE_SPEED*r.moveSpeedMult*.58;e.vel.x=u.x*g,e.vel.z=u.z*g}const f=(this.reactionTimerMap.get(e.id)??0)-t;if(this.reactionTimerMap.set(e.id,f),f<=0&&!e.reloading&&e.fireCooldown<=0){const p=e.getActiveWeaponInstance();if(p&&p.ammoInMag<=0)p.reserveAmmo>0?e.startReload():e.activeSlot==="primary"&&e.secondary&&e.switchSlot("secondary");else if(d!=="knife"&&d!=="c4"){const v=e.getLookDirection(),y=c.clone().sub(e.getEyePosition()).normalize();if(v.dot(y)>.94){const m=d==="awp"?.24:.34,u=c.clone().add(new I((Math.random()-.5)*m,(Math.random()-.42)*m*.85,(Math.random()-.5)*m));i.onBotFire(e,u)}}}this.applyGravityAndMove(e,t);return}else this.lastTargetMap.set(e.id,null);const o=e.getActiveWeaponInstance();o&&!e.reloading&&o.ammoInMag<Ue[o.id].magSize*.4&&o.reserveAmmo>0&&e.startReload();const a=this.chooseObjectiveGoal(e,i);if(e.team==="T"&&e.hasC4&&i.bombState==="carried"&&i.roundPhase==="live"&&Fl(this.mapData,e.pos.x,e.pos.y,e.pos.z)){e.isPlanting=!0,e.plantProgress=0,e.switchSlot("c4"),this.keypadTimerMap.set(e.id,.15),e.vel.x=0,e.vel.z=0,this.applyGravityAndMove(e,t);return}if(e.team==="CT"&&i.bombState==="planted"&&e.pos.distanceTo(i.bombPos)<2.25&&!i.combatants.some(c=>c.alive&&c.team==="CT"&&c.id!==e.id&&c.isDefusing)){e.isDefusing=!0,e.defuseProgress=0,i.onBotDefuseStart(i.bombPos),e.vel.x=0,e.vel.z=0,this.applyGravityAndMove(e,t);return}this.followPathTo(e,a,t,r.moveSpeedMult),this.applyGravityAndMove(e,t)}ensureCombatWeapon(e){e.primary&&(e.primary.ammoInMag>0||e.primary.reserveAmmo>0)?e.activeSlot!=="primary"&&e.switchSlot("primary"):e.secondary&&(e.secondary.ammoInMag>0||e.secondary.reserveAmmo>0)?e.activeSlot!=="secondary"&&e.switchSlot("secondary"):e.activeSlot!=="melee"&&e.switchSlot("melee")}chooseObjectiveGoal(e,t){const i=this.roleMap.get(e.id)??"mid";if(e.team==="T"){if(t.bombState==="planted"){const r=t.bombSite==="A"?"a_site":"b_site",s=this.nav.getNodesByTag(r);if(s.length>0){const o=Math.abs(this.hashId(e.id))%s.length;return s[o]}return{x:t.bombPos.x,y:t.bombPos.y,z:t.bombPos.z}}if(t.bombState==="dropped"){const r=this.findClosestAliveTeamMember(t.combatants,"T",t.bombPos);if(r&&r.id===e.id)return{x:t.bombPos.x,y:t.bombPos.y,z:t.bombPos.z}}if(e.hasC4){const r=this.nav.getNode(t.tExecuteSite==="A"?"a_site_plant":"b_site_plant");if(r)return r}return t.tExecuteSite==="A"?i==="a_long"?this.nav.getNode("a_site_goose"):i==="a_short"?this.nav.getNode("a_site_nw"):this.nav.getNode("a_site_s"):i==="b_tun"?this.nav.getNode("b_site_plant"):i==="mid"?this.nav.getNode("b_site_e"):this.nav.getNode("b_site_back")}else{if(t.bombState==="planted"){const a=this.findClosestAliveTeamMember(t.combatants,"CT",t.bombPos);if(a&&a.id===e.id)return{x:t.bombPos.x,y:t.bombPos.y,z:t.bombPos.z};const l=t.bombSite==="A"?"a_site":"b_site",c=this.nav.getNodesByTag(l);if(c.length>0){const d=Math.abs(this.hashId(e.id))%c.length;return c[d]}return{x:t.bombPos.x,y:t.bombPos.y,z:t.bombPos.z}}let r=(this.holdTimerMap.get(e.id)??0)+.016;this.holdTimerMap.set(e.id,r);const s=Math.floor(r/14)%2===0;return i==="a_long"?s?this.nav.getNode("a_long_n"):this.nav.getNode("a_site_goose"):i==="a_short"?s?this.nav.getNode("cat_bridge"):this.nav.getNode("a_site_nw"):i==="mid"?s?this.nav.getNode("ct_mid_s"):this.nav.getNode("cat_mid"):this.hashId(e.id)%2===0?s?this.nav.getNode("b_site_back"):this.nav.getNode("b_site_ne"):s?this.nav.getNode("b_site_e"):this.nav.getNode("ct_mid_w")}}followPathTo(e,t,i,r){if(Math.hypot(t.x-e.pos.x,t.z-e.pos.z)<1.35&&Math.abs(t.y-e.pos.y)<1.5){e.vel.x*=Math.max(0,1-i*10),e.vel.z*=Math.max(0,1-i*10),e.yaw+=Math.sin(performance.now()*7e-4+this.hashId(e.id))*.35*i,e.pitch*=Math.max(0,1-i*6);return}let o=(this.repathTimerMap.get(e.id)??0)-i,a=this.pathMap.get(e.id);!a||a.length===0||o<=0?(a=this.nav.findPath(e.pos,t),this.pathMap.set(e.id,a),this.pathIndexMap.set(e.id,0),this.repathTimerMap.set(e.id,1.4+Math.random()*.8)):this.repathTimerMap.set(e.id,o);let l=this.pathIndexMap.get(e.id)??0;for(;l<a.length-1;){const g=a[l];if(Math.hypot(g.x-e.pos.x,g.z-e.pos.z)<1.45&&Math.abs(g.y-e.pos.y)<1.6)l++;else break}this.pathIndexMap.set(e.id,l);const c=a[Math.min(l,a.length-1)],d=c.x-e.pos.x,h=c.z-e.pos.z,f=Math.hypot(d,h)||1;let p=d/f,v=h/f;const y=this.lastPosMap.get(e.id);if(y)if(Math.hypot(e.pos.x-y.x,e.pos.z-y.z)<.015){const _=(this.stuckTimerMap.get(e.id)??0)+i;if(this.stuckTimerMap.set(e.id,_),_>.45){const x=this.strafeDirMap.get(e.id)??1;p=p*.35-v*x*.9,v=v*.35+p*x*.9,_>1.1&&(this.strafeDirMap.set(e.id,-x),this.repathTimerMap.set(e.id,0),this.stuckTimerMap.set(e.id,0),e.grounded&&(e.vel.y=Qe.JUMP_SPEED*.75))}}else this.stuckTimerMap.set(e.id,0);this.lastPosMap.set(e.id,e.pos.clone());const m=Qe.BASE_MOVE_SPEED*r*.88;e.vel.x=p*m,e.vel.z=v*m;const u=Math.atan2(-p,-v);e.yaw=this.lerpAngle(e.yaw,u,Math.min(1,i*8.5)),e.pitch*=Math.max(0,1-i*8)}findVisibleEnemy(e,t,i){const r=e.getEyePosition(),s=e.getLookDirection();let o=null,a=68;for(const l of t){if(!l.alive||l.team===e.team)continue;const c=l.pos.clone();c.y+=1.25;const d=c.clone().sub(r),h=d.length();if(h>a)continue;const f=d.clone().divideScalar(h);s.dot(f)<.35&&h>11.5||this.physics.hasLineOfSight(r,c)&&(l.lastSpottedTime=i,a=h,o=l)}return o}findClosestAliveTeamMember(e,t,i){let r=null,s=1/0;for(const o of e){if(!o.alive||o.team!==t)continue;const a=o.pos.distanceTo(i);a<s&&(s=a,r=o)}return r}aimAtPoint(e,t,i,r){const s=e.getEyePosition(),o=t.x-s.x,a=t.y-s.y,l=t.z-s.z,c=Math.hypot(o,l)||.001,d=Math.atan2(-o,-l),h=Math.max(-1.2,Math.min(1.2,Math.atan2(a,c)));e.yaw=this.lerpAngle(e.yaw,d,Math.min(1,i*r)),e.pitch+=(h-e.pitch)*Math.min(1,i*r)}applyGravityAndMove(e,t){e.vel.y-=Qe.GRAVITY*t;const i=e.crouching?Qe.PLAYER_CROUCH_HEIGHT:Qe.PLAYER_HEIGHT,r=this.physics.moveCharacter(e.pos,e.vel,t,i);e.grounded=r.grounded}lerpAngle(e,t,i){let r=t-e;for(;r>Math.PI;)r-=Math.PI*2;for(;r<-Math.PI;)r+=Math.PI*2;return e+r*i}hashId(e){let t=0;for(let i=0;i<e.length;i++)t=t*31+e.charCodeAt(i)|0;return t}}class _2{constructor(){O(this,"ctx",null);O(this,"noiseBuffer",null);O(this,"masterGain",null);O(this,"listenerPos",{x:0,y:0,z:0});O(this,"listenerYaw",0);O(this,"muted",!1)}unlock(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;if(!e)return;this.ctx=new e,this.masterGain=this.ctx.createGain(),this.masterGain.gain.value=.65,this.masterGain.connect(this.ctx.destination),this.noiseBuffer=this.createNoiseBuffer(this.ctx,2)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume().catch(()=>{})}setMuted(e){this.muted=e,this.masterGain&&this.ctx&&this.masterGain.gain.setTargetAtTime(e?0:.65,this.ctx.currentTime,.02)}isMuted(){return this.muted}updateListener(e,t){this.listenerPos=e,this.listenerYaw=t}createNoiseBuffer(e,t){const i=Math.floor(e.sampleRate*t),r=e.createBuffer(1,i,e.sampleRate),s=r.getChannelData(0);for(let o=0;o<i;o++)s[o]=Math.random()*2-1;return r}createSpatialOut(e,t=65){if(!this.ctx||!this.masterGain||this.muted)return null;if(!e)return{node:this.masterGain,gain:1};const i=e.x-this.listenerPos.x,r=e.y-this.listenerPos.y,s=e.z-this.listenerPos.z,o=Math.sqrt(i*i+r*r+s*s);if(o>t)return null;const a=Math.max(.02,Math.pow(1-o/t,1.8)),l=Math.cos(this.listenerYaw),c=-Math.sin(this.listenerYaw),d=Math.sqrt(i*i+s*s)+.001,h=Math.max(-.92,Math.min(.92,(i*l+s*c)/d)),f=this.ctx.createGain();if(f.gain.value=a,typeof this.ctx.createStereoPanner=="function"){const p=this.ctx.createStereoPanner();p.pan.value=h,f.connect(p),p.connect(this.masterGain)}else f.connect(this.masterGain);return{node:f,gain:a}}playWeaponFire(e,t){if(!this.ctx||!this.noiseBuffer)return;const i=this.createSpatialOut(t,e==="awp"?95:e==="usp"?42:78);if(!i)return;const r=this.ctx.currentTime;e==="ak47"?(this.burstNoise(i.node,r,.24,900,.7,.95,"bandpass"),this.burstNoise(i.node,r,.14,2400,1.1,.65,"highpass"),this.toneSweep(i.node,r,165,42,.16,.85,"triangle"),this.toneSweep(i.node,r+.015,780,320,.045,.22,"sawtooth")):e==="m4a4"?(this.burstNoise(i.node,r,.17,1650,.9,.82,"bandpass"),this.burstNoise(i.node,r,.1,3400,.8,.52,"highpass"),this.toneSweep(i.node,r,210,58,.11,.6,"triangle"),this.toneSweep(i.node,r,1100,520,.03,.2,"square")):e==="awp"?(this.burstNoise(i.node,r,.58,650,.5,1.15,"lowpass"),this.burstNoise(i.node,r,.32,1800,.7,.9,"bandpass"),this.toneSweep(i.node,r,130,26,.42,1.1,"sine"),this.toneSweep(i.node,r,240,48,.28,.7,"sawtooth"),this.burstNoise(i.node,r+.18,.35,900,.8,.24,"bandpass"),t||(this.playMechanicalClick(i.node,r+.48,1900,.18),this.playMechanicalClick(i.node,r+.68,1450,.22))):e==="glock"?(this.burstNoise(i.node,r,.11,1900,1,.62,"bandpass"),this.toneSweep(i.node,r,280,75,.08,.52,"triangle")):e==="usp"?(this.burstNoise(i.node,r,.08,2800,1.5,.38,"bandpass"),this.toneSweep(i.node,r,420,120,.055,.28,"sine"),this.playMechanicalClick(i.node,r+.01,3200,.12)):e==="deagle"?(this.burstNoise(i.node,r,.28,1100,.7,.98,"bandpass"),this.toneSweep(i.node,r,185,38,.2,.92,"triangle"),this.toneSweep(i.node,r+.01,950,340,.06,.3,"sawtooth")):e==="knife"&&(this.burstNoise(i.node,r,.13,1200,2.2,.32,"bandpass"),this.toneSweep(i.node,r,520,180,.1,.12,"sine"))}playReload(e,t){if(!this.ctx||!this.noiseBuffer)return;const i=this.createSpatialOut(t,22);if(!i)return;const r=this.ctx.currentTime;e==="start"?(this.playMechanicalClick(i.node,r,1600,.26),this.burstNoise(i.node,r+.06,.09,900,1.5,.18,"bandpass"),this.playMechanicalClick(i.node,r+.22,1100,.2)):(this.playMechanicalClick(i.node,r,1200,.28),this.playMechanicalClick(i.node,r+.09,2100,.24),this.burstNoise(i.node,r+.11,.07,2600,1.2,.2,"bandpass"))}playScope(e){if(!this.ctx)return;const t=this.createSpatialOut(void 0);if(!t)return;const i=this.ctx.currentTime,r=e===0?1100:e===1?1750:2300;this.playMechanicalClick(t.node,i,r,.26),this.toneSweep(t.node,i,r*.6,r*1.1,.045,.12,"sine")}playFootstep(e,t=!0){if(!this.ctx||!this.noiseBuffer)return;const i=this.createSpatialOut(e,t?28:12);if(!i)return;const r=this.ctx.currentTime,s=t?.22:.08;this.burstNoise(i.node,r,.065,650+Math.random()*280,1.1,s,"bandpass"),this.toneSweep(i.node,r,110+Math.random()*25,48,.055,s*.85,"sine")}playHitFeedback(e){if(!this.ctx||!this.noiseBuffer)return;const t=this.createSpatialOut(void 0);if(!t)return;const i=this.ctx.currentTime;e?(this.toneSweep(t.node,i,2850,1650,.09,.48,"triangle"),this.toneSweep(t.node,i,1480,820,.07,.35,"sawtooth"),this.burstNoise(t.node,i,.05,3800,2,.32,"bandpass")):(this.toneSweep(t.node,i,620,260,.05,.28,"triangle"),this.burstNoise(t.node,i,.04,1500,1.5,.2,"bandpass"))}playKillChime(e){if(!this.ctx)return;const t=this.createSpatialOut(void 0);if(!t)return;const i=this.ctx.currentTime,r=e?987.77:783.99;this.toneSweep(t.node,i,r,r,.11,.22,"sine"),this.toneSweep(t.node,i+.075,r*1.25,r*1.25,.16,.24,"sine")}playHurt(){if(!this.ctx||!this.noiseBuffer)return;const e=this.createSpatialOut(void 0);if(!e)return;const t=this.ctx.currentTime;this.toneSweep(e.node,t,170,62,.14,.45,"sawtooth"),this.burstNoise(e.node,t,.08,900,1,.3,"lowpass")}playC4Keypad(e){if(!this.ctx)return;const t=this.createSpatialOut(e,32);if(!t)return;const i=this.ctx.currentTime,r=1400+Math.floor(Math.random()*5)*180;this.toneSweep(t.node,i,r,r,.06,.25,"square")}playC4Beep(e,t=0){if(!this.ctx)return;const i=this.createSpatialOut(e,85);if(!i)return;const r=this.ctx.currentTime,s=2650+t*450;this.toneSweep(i.node,r,s,s,.09,.38,"sine"),this.toneSweep(i.node,r,s*2,s*2,.06,.12,"square")}playC4Planted(){if(!this.ctx)return;const e=this.createSpatialOut(void 0);if(!e)return;const t=this.ctx.currentTime;this.toneSweep(e.node,t,880,880,.12,.28,"sine"),this.toneSweep(e.node,t+.14,1175,1175,.16,.3,"sine")}playC4DefuseStart(e){if(!this.ctx)return;const t=this.createSpatialOut(e,36);if(!t)return;const i=this.ctx.currentTime;this.toneSweep(t.node,i,1250,900,.08,.28,"square"),this.toneSweep(t.node,i+.1,950,1400,.1,.24,"sine")}playC4Defused(){if(!this.ctx)return;const e=this.createSpatialOut(void 0);if(!e)return;const t=this.ctx.currentTime;this.toneSweep(e.node,t,523.25,523.25,.12,.28,"triangle"),this.toneSweep(e.node,t+.12,659.25,659.25,.12,.28,"triangle"),this.toneSweep(e.node,t+.24,783.99,783.99,.25,.32,"triangle")}playC4Explosion(e){if(!this.ctx||!this.noiseBuffer)return;const t=this.createSpatialOut(e,180);if(!t)return;const i=this.ctx.currentTime;this.burstNoise(t.node,i,1.8,320,.4,1.4,"lowpass"),this.burstNoise(t.node,i,1.1,1100,.6,1,"bandpass"),this.toneSweep(t.node,i,95,18,1.25,1.3,"sine"),this.toneSweep(t.node,i,140,24,.85,.9,"sawtooth")}playBulletImpact(e,t=!1){if(!this.ctx||!this.noiseBuffer)return;const i=this.createSpatialOut(e,35);if(!i)return;const r=this.ctx.currentTime;t?this.toneSweep(i.node,r,2200+Math.random()*600,900,.08,.22,"triangle"):this.burstNoise(i.node,r,.055,1400,1.2,.22,"bandpass")}playBuySound(){if(!this.ctx)return;const e=this.createSpatialOut(void 0);if(!e)return;const t=this.ctx.currentTime;this.playMechanicalClick(e.node,t,1800,.24),this.toneSweep(e.node,t+.04,1046,1318,.09,.18,"triangle")}playRoundEnd(e){if(!this.ctx)return;const t=this.createSpatialOut(void 0);if(!t)return;const i=this.ctx.currentTime;(e?[523.25,659.25,783.99,1046.5]:[440,392,349.23,311.13]).forEach((s,o)=>{this.toneSweep(t.node,i+o*.11,s,s,.22,.2,"triangle")})}playMechanicalClick(e,t,i,r){if(!this.ctx)return;const s=this.ctx.createOscillator(),o=this.ctx.createGain();s.type="square",s.frequency.setValueAtTime(i,t),s.frequency.exponentialRampToValueAtTime(i*.45,t+.03),o.gain.setValueAtTime(r,t),o.gain.exponentialRampToValueAtTime(.001,t+.035),s.connect(o),o.connect(e),s.start(t),s.stop(t+.04)}toneSweep(e,t,i,r,s,o,a){if(!this.ctx)return;const l=this.ctx.createOscillator(),c=this.ctx.createGain();l.type=a,l.frequency.setValueAtTime(Math.max(20,i),t),l.frequency.exponentialRampToValueAtTime(Math.max(20,r),t+s),c.gain.setValueAtTime(o,t),c.gain.exponentialRampToValueAtTime(.001,t+s),l.connect(c),c.connect(e),l.start(t),l.stop(t+s+.01)}burstNoise(e,t,i,r,s,o,a){if(!this.ctx||!this.noiseBuffer)return;const l=this.ctx.createBufferSource();l.buffer=this.noiseBuffer;const c=this.ctx.createBiquadFilter();c.type=a,c.frequency.setValueAtTime(r,t),c.Q.setValueAtTime(s,t);const d=this.ctx.createGain();d.gain.setValueAtTime(o,t),d.gain.exponentialRampToValueAtTime(.001,t+i),l.connect(c),c.connect(d),d.connect(e),l.start(t,Math.random()*.8,i+.02)}}class v2{constructor(e,t){O(this,"root");O(this,"upperBody");O(this,"headGroup");O(this,"leftLeg");O(this,"rightLeg");O(this,"weaponMount");O(this,"hitboxMeshes",[]);O(this,"weaponMeshes",new Map);O(this,"currentWeapon","glock");O(this,"walkPhase",0);O(this,"deadProgress",0);O(this,"isDead",!1);O(this,"muzzleFlash");O(this,"muzzleTimer",0);this.root=new ot,this.root.name=`Humanoid_${e}`;const i=t==="CT",r=new it({color:"#d9a782",roughness:.75}),s=new it({color:i?"#243a54":"#7a6345",roughness:.85}),o=new it({color:i?"#1a2736":"#4a3d2d",roughness:.78}),a=new it({color:i?"#3e7cb1":"#c97b32",roughness:.7}),l=new it({color:i?"#223142":"#9c8663",roughness:.88}),c=new it({color:"#1b1d20",roughness:.8}),d=new it({color:i?"#2b3c4f":"#3a2d20",roughness:.72}),h=(z,V)=>(z.castShadow=!0,z.receiveShadow=!0,z.userData={agentId:e,hitboxZone:V},this.hitboxMeshes.push(z),z),f=z=>{const V=new ot;V.position.set(z*.135,.86,0);const Y=h(new K(new ie(.175,.42,.19),l),"leg");Y.position.set(0,-.21,0),V.add(Y);const X=new K(new ie(.15,.1,.05),d);X.position.set(0,-.4,-.09),V.add(X);const J=h(new K(new ie(.15,.36,.16),l),"leg");J.position.set(0,-.58,.01),V.add(J);const D=h(new K(new ie(.16,.14,.26),c),"leg");return D.position.set(0,-.79,-.04),V.add(D),V};this.leftLeg=f(-1),this.rightLeg=f(1),this.root.add(this.leftLeg,this.rightLeg),this.upperBody=new ot,this.upperBody.position.set(0,.86,0),this.root.add(this.upperBody);const p=h(new K(new ie(.42,.11,.25),d),"stomach");p.position.set(0,.05,0),this.upperBody.add(p);const v=h(new K(new ie(.4,.22,.24),s),"stomach");v.position.set(0,.21,0),this.upperBody.add(v);const y=h(new K(new ie(.46,.34,.28),o),"chest");y.position.set(0,.47,0),this.upperBody.add(y);const m=new K(new ie(.47,.07,.295),a);m.position.set(0,.56,0),this.upperBody.add(m);for(let z=-1;z<=1;z++){const V=new K(new ie(.08,.13,.06),d);V.position.set(z*.11,.37,-.15),this.upperBody.add(V)}const u=new K(new ie(.3,.32,.13),d);if(u.position.set(0,.45,.18),this.upperBody.add(u),i){const z=new K(new Vt(.008,.008,.32,6),c);z.position.set(.11,.72,.2),this.upperBody.add(z)}this.headGroup=new ot,this.headGroup.position.set(0,.66,0),this.upperBody.add(this.headGroup);const g=h(new K(new Vt(.068,.078,.09,8),r),"head");g.position.set(0,.04,0),this.headGroup.add(g);const _=h(new K(new ie(.24,.26,.24),r),"head");if(_.position.set(0,.19,0),this.headGroup.add(_),i){const z=h(new K(new ie(.248,.16,.248),d),"head");z.position.set(0,.14,0),this.headGroup.add(z);const V=h(new K(new ie(.28,.16,.29),new it({color:"#1f334a",roughness:.55})),"head");V.position.set(0,.27,.01),this.headGroup.add(V);const Y=new K(new ie(.22,.075,.05),new it({color:"#58b4e8",roughness:.2,metalness:.5}));Y.position.set(0,.2,-.125),this.headGroup.add(Y)}else{const z=h(new K(new ie(.265,.12,.265),a),"head");z.position.set(0,.28,.01),this.headGroup.add(z);const V=h(new K(new ie(.255,.1,.255),new it({color:"#8f4c1f",roughness:.85})),"head");V.position.set(0,.12,-.005),this.headGroup.add(V);const Y=new K(new ie(.2,.055,.04),new it({color:"#141414",roughness:.25,metalness:.4}));Y.position.set(0,.2,-.125),this.headGroup.add(Y)}const x=new ot;x.position.set(0,.54,0),this.upperBody.add(x);const w=h(new K(new ie(.14,.14,.15),s),"arm");w.position.set(.29,0,-.02),x.add(w);const T=h(new K(new ie(.12,.12,.3),s),"arm");T.position.set(.27,-.08,-.16),T.rotation.x=.22,T.rotation.y=.14,x.add(T);const A=h(new K(new ie(.11,.11,.28),s),"arm");A.position.set(.2,-.1,-.37),A.rotation.y=.26,x.add(A);const C=h(new K(new ie(.09,.09,.1),r),"arm");C.position.set(.15,-.1,-.49),x.add(C);const M=h(new K(new ie(.14,.14,.15),s),"arm");M.position.set(-.29,0,-.02),x.add(M);const S=h(new K(new ie(.12,.12,.32),s),"arm");S.position.set(-.24,-.08,-.2),S.rotation.y=-.35,x.add(S);const P=h(new K(new ie(.11,.11,.32),s),"arm");P.position.set(-.04,-.1,-.44),P.rotation.y=-.62,x.add(P);const B=h(new K(new ie(.09,.09,.1),r),"arm");B.position.set(.12,-.1,-.62),x.add(B),this.weaponMount=new ot,this.weaponMount.position.set(.16,-.07,-.5),x.add(this.weaponMount),this.buildWorldWeapons(),this.setWeapon(i?"usp":"glock"),this.muzzleFlash=new K(new rc(.12,0),new Un({color:"#ffcf5c",transparent:!0,opacity:.92})),this.muzzleFlash.visible=!1,this.muzzleFlash.position.set(0,.04,-.62),this.weaponMount.add(this.muzzleFlash)}buildWorldWeapons(){const e=new it({color:"#24272c",roughness:.45,metalness:.65}),t=new it({color:"#8a929a",roughness:.35,metalness:.8}),i=new it({color:"#8a552a",roughness:.78}),r=new it({color:"#395238",roughness:.65}),s=new it({color:"#7a725c",roughness:.85}),o=new ot,a=new K(new ie(.065,.1,.44),e),l=new K(new ie(.055,.09,.24),i);l.position.set(0,-.02,.3);const c=new K(new ie(.06,.07,.22),i);c.position.set(0,0,-.26);const d=new K(new Vt(.016,.016,.32,8),e);d.rotation.x=Math.PI/2,d.position.set(0,.02,-.48);const h=new K(new ie(.045,.21,.08),i);h.position.set(0,-.14,-.08),h.rotation.x=.26,o.add(a,l,c,d,h),this.weaponMeshes.set("ak47",o);const f=new ot,p=new K(new ie(.065,.11,.42),e),v=new K(new ie(.055,.1,.24),e);v.position.set(0,-.01,.28);const y=new K(new Vt(.016,.016,.38,8),e);y.rotation.x=Math.PI/2,y.position.set(0,.02,-.36);const m=new K(new ie(.045,.18,.075),e);m.position.set(0,-.12,-.08),m.rotation.x=.12,f.add(p,v,y,m),this.weaponMeshes.set("m4a4",f);const u=new ot,g=new K(new ie(.07,.11,.62),r),_=new K(new ie(.06,.11,.26),r);_.position.set(0,-.01,.36);const x=new K(new Vt(.018,.02,.56,8),e);x.rotation.x=Math.PI/2,x.position.set(0,.03,-.54);const w=new K(new Vt(.028,.024,.3,8),e);w.rotation.x=Math.PI/2,w.position.set(0,.1,-.04),u.add(g,_,x,w),this.weaponMeshes.set("awp",u);const T=new ot,A=new K(new ie(.045,.06,.22),e),C=new K(new ie(.04,.12,.06),e);C.position.set(0,-.07,.06),C.rotation.x=-.2,T.add(A,C),this.weaponMeshes.set("glock",T);const M=new ot,S=new K(new ie(.045,.06,.22),e),P=new K(new Vt(.018,.018,.19,8),e);P.rotation.x=Math.PI/2,P.position.set(0,.005,-.2);const B=new K(new ie(.04,.12,.06),e);B.position.set(0,-.07,.06),M.add(S,P,B),this.weaponMeshes.set("usp",M);const z=new ot,V=new K(new ie(.055,.075,.28),t),Y=new K(new ie(.046,.13,.07),e);Y.position.set(0,-.08,.08),Y.rotation.x=-.22,z.add(V,Y),this.weaponMeshes.set("deagle",z);const X=new ot,J=new K(new ie(.018,.045,.22),t);J.position.set(0,0,-.1);const D=new K(new ie(.03,.04,.11),e);D.position.set(0,0,.06),X.add(J,D),this.weaponMeshes.set("knife",X);const $=new ot,ee=new K(new ie(.18,.08,.24),s),ce=new K(new ie(.04,.02,.04),new Un({color:"#ff2b2b"}));ce.position.set(.04,.045,-.04),$.add(ee,ce),this.weaponMeshes.set("c4",$);for(const[ye,Ge]of this.weaponMeshes.entries())Ge.visible=ye===this.currentWeapon,this.weaponMount.add(Ge)}setWeapon(e){if(this.currentWeapon===e)return;const t=this.weaponMeshes.get(this.currentWeapon);t&&(t.visible=!1),this.currentWeapon=e;const i=this.weaponMeshes.get(e);i&&(i.visible=!0)}triggerMuzzleFlash(){this.muzzleTimer=.055,this.muzzleFlash.visible=!0,this.muzzleFlash.rotation.set(Math.random()*3,Math.random()*3,0)}setDead(e){this.isDead=e,e||(this.deadProgress=0,this.root.rotation.x=0,this.root.rotation.z=0,this.root.visible=!0)}update(e,t,i,r,s,o,a){if(this.root.visible=a,this.root.position.copy(t),this.muzzleTimer>0&&(this.muzzleTimer-=e,this.muzzleTimer<=0&&(this.muzzleFlash.visible=!1)),this.isDead){this.deadProgress=Math.min(1,this.deadProgress+e*4.5),this.root.rotation.set(-this.deadProgress*(Math.PI*.48),i,0,"YXZ"),this.root.position.y=t.y+.12*this.deadProgress;return}this.root.rotation.set(0,i,0,"YXZ");const l=o?.6:.86;if(this.upperBody.position.y+=(l-this.upperBody.position.y)*Math.min(1,e*14),this.upperBody.rotation.x=Math.max(-.45,Math.min(.45,r*.55)),this.headGroup.rotation.x=Math.max(-.45,Math.min(.45,r*.45)),s>.35){this.walkPhase+=e*s*2.1;const c=Math.sin(this.walkPhase)*Math.min(.65,s*.11);this.leftLeg.rotation.x=c,this.rightLeg.rotation.x=-c}else this.leftLeg.rotation.x*=Math.max(0,1-e*10),this.rightLeg.rotation.x*=Math.max(0,1-e*10)}}class x2{constructor(e,t,i,r){O(this,"id");O(this,"name");O(this,"team");O(this,"isHuman");O(this,"pos",new I);O(this,"vel",new I);O(this,"yaw",0);O(this,"pitch",0);O(this,"hp",100);O(this,"armor",0);O(this,"hasHelmet",!1);O(this,"money",Ye.PISTOL_ROUND_MONEY);O(this,"alive",!0);O(this,"grounded",!1);O(this,"crouching",!1);O(this,"walking",!1);O(this,"primary",null);O(this,"secondary",null);O(this,"hasC4",!1);O(this,"activeSlot","secondary");O(this,"fireCooldown",0);O(this,"reloading",!1);O(this,"reloadTimer",0);O(this,"reloadDuration",0);O(this,"scopeLevel",0);O(this,"recoilSpread",0);O(this,"recoilPitchAccum",0);O(this,"shotsFiredBurst",0);O(this,"isPlanting",!1);O(this,"plantProgress",0);O(this,"isDefusing",!1);O(this,"defuseProgress",0);O(this,"footstepAccum",0);O(this,"kills",0);O(this,"deaths",0);O(this,"assists",0);O(this,"lastSpottedTime",-99);O(this,"model");this.id=e,this.name=t,this.team=i,this.isHuman=r,this.model=new v2(e,i),this.giveDefaultPistol()}giveDefaultPistol(){const e=this.team==="CT"?"usp":"glock",t=Ue[e];this.secondary={id:e,ammoInMag:t.magSize,reserveAmmo:t.reserveAmmo}}resetForRound(e,t,i){if(this.pos.set(e.x,e.y,e.z),this.vel.set(0,0,0),this.yaw=e.yaw,this.pitch=0,this.hp=100,this.alive=!0,this.grounded=!0,this.crouching=!1,this.walking=!1,this.fireCooldown=0,this.reloading=!1,this.reloadTimer=0,this.scopeLevel=0,this.recoilSpread=0,this.recoilPitchAccum=0,this.shotsFiredBurst=0,this.isPlanting=!1,this.plantProgress=0,this.isDefusing=!1,this.defuseProgress=0,this.hasC4=!1,this.lastSpottedTime=-99,t)this.primary=null,this.giveDefaultPistol(),this.armor=Ye.PISTOL_ROUND_ARMOR,this.hasHelmet=!1,this.activeSlot="secondary";else if(!i)this.primary=null,this.giveDefaultPistol(),this.armor=0,this.hasHelmet=!1,this.activeSlot="secondary";else{if(this.primary){const r=Ue[this.primary.id];this.primary.ammoInMag=r.magSize,this.primary.reserveAmmo=r.reserveAmmo}if(this.secondary){const r=Ue[this.secondary.id];this.secondary.ammoInMag=r.magSize,this.secondary.reserveAmmo=r.reserveAmmo}else this.giveDefaultPistol();this.activeSlot=this.primary?"primary":"secondary"}this.model.setDead(!1),this.model.setWeapon(this.getActiveWeaponId())}getActiveWeaponId(){return this.activeSlot==="primary"&&this.primary?this.primary.id:this.activeSlot==="secondary"&&this.secondary?this.secondary.id:this.activeSlot==="c4"&&this.hasC4?"c4":"knife"}getActiveWeaponInstance(){return this.activeSlot==="primary"?this.primary:this.activeSlot==="secondary"?this.secondary:null}switchSlot(e){return e==="primary"&&!this.primary||e==="secondary"&&!this.secondary||e==="c4"&&!this.hasC4||this.activeSlot===e?!1:(this.activeSlot=e,this.reloading=!1,this.reloadTimer=0,this.scopeLevel=0,this.isPlanting=!1,this.plantProgress=0,this.model.setWeapon(this.getActiveWeaponId()),!0)}equipWeapon(e){const t=Ue[e],i={id:e,ammoInMag:t.magSize,reserveAmmo:t.reserveAmmo};t.slot==="primary"?(this.primary=i,this.activeSlot="primary"):t.slot==="secondary"&&(this.secondary=i,this.primary||(this.activeSlot="secondary")),this.reloading=!1,this.scopeLevel=0,this.model.setWeapon(this.getActiveWeaponId())}startReload(){const e=this.getActiveWeaponInstance();if(!e||this.reloading)return!1;const t=Ue[e.id];return e.ammoInMag>=t.magSize||e.reserveAmmo<=0?!1:(this.reloading=!0,this.reloadDuration=t.reloadTime,this.reloadTimer=t.reloadTime,this.scopeLevel=0,!0)}updateReload(e){if(!this.reloading)return!1;if(this.reloadTimer-=e,this.reloadTimer<=0){const t=this.getActiveWeaponInstance();if(t){const r=Ue[t.id].magSize-t.ammoInMag,s=Math.min(r,t.reserveAmmo);t.ammoInMag+=s,t.reserveAmmo-=s}return this.reloading=!1,this.reloadTimer=0,!0}return!1}getEyePosition(){const e=this.crouching?Qe.CROUCH_EYE_HEIGHT:Qe.EYE_HEIGHT;return new I(this.pos.x,this.pos.y+e,this.pos.z)}getLookDirection(){const e=Math.cos(this.pitch);return new I(-Math.sin(this.yaw)*e,Math.sin(this.pitch),-Math.cos(this.yaw)*e).normalize()}applyHitDamage(e,t,i){if(!this.alive)return{finalDamage:0,killed:!1};const r=ey[i];let s=e*r;if(this.armor>0&&i!=="leg"&&(i!=="head"||this.hasHelmet)){const c=s*t,d=s-c,h=Math.ceil(d*.55);if(this.armor>=h)this.armor-=h,s=c;else{const f=this.armor/Math.max(1,h);s=s-d*f,this.armor=0,this.hasHelmet=!1}}const a=Math.max(1,Math.round(s));this.hp=Math.max(0,this.hp-a);const l=this.hp<=0;return l&&(this.alive=!1,this.deaths+=1,this.isPlanting=!1,this.isDefusing=!1,this.reloading=!1,this.scopeLevel=0,this.model.setDead(!0)),{finalDamage:a,killed:l}}}function y2(n){const t=document.createElement("canvas");t.width=256,t.height=256;const i=t.getContext("2d"),r=o=>{const a=Math.sin(o*12.9898+78.233)*43758.5453;return a-Math.floor(a)};if(n==="sand"){i.fillStyle="#d4b483",i.fillRect(0,0,256,256);for(let o=0;o<256;o+=8)i.fillStyle=o%16===0?"rgba(180,140,85,0.16)":"rgba(245,225,185,0.12)",i.fillRect(0,o,256,4);for(let o=0;o<1600;o++){const a=Math.floor(r(o)*256),l=Math.floor(r(o+5e3)*256);i.fillStyle=o%2===0?"rgba(120,90,55,0.16)":"rgba(255,240,210,0.18)",i.fillRect(a,l,2,2)}}else if(n==="stone_floor"){i.fillStyle="#b9a68a",i.fillRect(0,0,256,256);const o=64;for(let a=0;a<256;a+=o)for(let l=0;l<256;l+=o){const c=(r(l*13+a*31)-.5)*18;i.fillStyle=`rgb(${185+c}, ${166+c}, ${138+c})`,i.fillRect(l+2,a+2,o-4,o-4),i.strokeStyle="rgba(85,72,54,0.35)",i.lineWidth=2,i.strokeRect(l+1,a+1,o-2,o-2)}for(let a=0;a<800;a++)i.fillStyle="rgba(70,60,45,0.12)",i.fillRect(r(a)*256,r(a+999)*256,2,2)}else if(n==="wall_sandstone"){i.fillStyle="#ceb086",i.fillRect(0,0,256,256);const o=8,a=256/o;for(let c=0;c<o;c++){const d=c%2*32;for(let h=-32;h<256;h+=64){const f=(r(c*97+h*17)-.5)*20;i.fillStyle=`rgb(${208+f}, ${176+f}, ${134+f})`,i.fillRect(h+d+2,c*a+2,60,a-4)}i.fillStyle="rgba(110,85,55,0.32)",i.fillRect(0,c*a,256,2)}const l=i.createLinearGradient(0,256*.65,0,256);l.addColorStop(0,"rgba(90,68,42,0)"),l.addColorStop(1,"rgba(90,68,42,0.22)"),i.fillStyle=l,i.fillRect(0,0,256,256)}else if(n==="wall_plaster"){i.fillStyle="#dfd0b4",i.fillRect(0,0,256,256);for(let o=0;o<900;o++){const a=r(o)*256,l=r(o+2e3)*256;i.fillStyle=o%3===0?"rgba(160,135,100,0.14)":"rgba(255,248,235,0.16)",i.fillRect(a,l,6,4)}i.fillStyle="rgba(155,126,88,0.35)",i.fillRect(0,0,256,12),i.fillRect(0,240,256,16)}else if(n==="wall_dark"){i.fillStyle="#7d6e5d",i.fillRect(0,0,256,256);for(let o=0;o<256;o+=32)i.fillStyle="rgba(40,34,28,0.28)",i.fillRect(0,o,256,2);for(let o=0;o<700;o++)i.fillStyle="rgba(30,24,20,0.18)",i.fillRect(r(o)*256,r(o+4e3)*256,3,3)}else if(n==="crate_wood"){i.fillStyle="#9c7344",i.fillRect(0,0,256,256);for(let o=0;o<256;o+=32){const a=(r(o*7)-.5)*18;i.fillStyle=`rgb(${156+a}, ${115+a}, ${68+a})`,i.fillRect(0,o+1,256,30),i.fillStyle="rgba(55,35,16,0.45)",i.fillRect(0,o,256,2)}i.strokeStyle="#5c3f20",i.lineWidth=18,i.strokeRect(9,9,238,238),i.beginPath(),i.moveTo(14,14),i.lineTo(242,242),i.stroke(),i.strokeStyle="#b48752",i.lineWidth=4,i.strokeRect(18,18,220,220)}else if(n==="crate_green")i.fillStyle="#4f6246",i.fillRect(0,0,256,256),i.strokeStyle="#313f2b",i.lineWidth=16,i.strokeRect(8,8,240,240),i.fillStyle="#c8b45c",i.fillRect(28,256/2-10,200,20),i.fillStyle="#2d3728",i.font="bold 26px monospace",i.textAlign="center",i.fillText("SUPPLY",256/2,256/2+8);else if(n==="door_wood"){i.fillStyle="#735032",i.fillRect(0,0,256,256);for(let o=0;o<256;o+=28)i.fillStyle="rgba(35,22,12,0.38)",i.fillRect(o,0,3,256);i.fillStyle="#383d42",i.fillRect(0,26,256,16),i.fillRect(0,256/2-8,256,16),i.fillRect(0,214,256,16),i.strokeStyle="#24272b",i.lineWidth=10,i.strokeRect(5,5,246,246)}else if(n==="door_metal")i.fillStyle="#475c6e",i.fillRect(0,0,256,256),i.strokeStyle="#263440",i.lineWidth=14,i.strokeRect(7,7,242,242),i.fillStyle="#314250",i.fillRect(24,24,208,256/2-36),i.fillRect(24,256/2+12,208,256/2-36);else if(n==="roof"){i.fillStyle="#8b7355",i.fillRect(0,0,256,256);for(let o=0;o<256;o+=32)i.fillStyle="rgba(40,30,20,0.32)",i.fillRect(o,0,6,256)}else n==="car_metal"?(i.fillStyle="#5c6b73",i.fillRect(0,0,256,256),i.fillStyle="rgba(130,80,45,0.28)",i.fillRect(0,256*.7,256,256*.3),i.strokeStyle="#2c353b",i.lineWidth=8,i.strokeRect(4,4,248,248)):(n==="site_a"||n==="site_b")&&(i.clearRect(0,0,256,256),i.fillStyle="rgba(210, 180, 130, 0.25)",i.fillRect(0,0,256,256),i.strokeStyle="#d93829",i.lineWidth=10,i.setLineDash([22,12]),i.strokeRect(10,10,236,236),i.setLineDash([]),i.fillStyle="rgba(217, 56, 41, 0.85)",i.font="bold 148px sans-serif",i.textAlign="center",i.textBaseline="middle",i.fillText(n==="site_a"?"A":"B",256/2,256/2+6));const s=new Qh(t);return s.wrapS=Go,s.wrapT=Go,s.colorSpace=nn,s.anisotropy=4,s}function S2(n){const{x1:e,z1:t,x2:i,z2:r,yStart:s,yEnd:o,axis:a,thickness:l}=n,c=s,d=a==="x"?o:s,h=o,f=a==="x"?s:o,p=Math.min(c,d,h,f)-l,v=[[e,c,t],[i,d,t],[i,h,r],[e,f,r],[e,p,t],[i,p,t],[i,p,r],[e,p,r]],y=[],m=[],u=(_,x,w,T,A=.25,C=.25)=>{const M=v[_],S=v[x],P=v[w],B=v[T],z=Math.hypot(S[0]-M[0],S[1]-M[1],S[2]-M[2])*A,V=Math.hypot(B[0]-M[0],B[1]-M[1],B[2]-M[2])*C;y.push(...M,...B,...P),m.push(0,0,0,V,z,V),y.push(...M,...P,...S),m.push(0,0,z,V,z,0)};u(0,1,2,3),u(1,0,4,5),u(3,2,6,7),u(0,3,7,4),u(2,1,5,6);const g=new Cn;return g.setAttribute("position",new It(y,3)),g.setAttribute("uv",new It(m,2)),g.computeVertexNormals(),g}function M2(n,e){const t=new ot;t.name="Dust2Map",n.background=new qe("#8ec5e8"),n.fog=new Zh("#d9c8ae",.0052);const i=document.createElement("canvas");i.width=16,i.height=256;const r=i.getContext("2d"),s=r.createLinearGradient(0,0,0,256);s.addColorStop(0,"#2c6eb5"),s.addColorStop(.45,"#6baad9"),s.addColorStop(.75,"#d5c8b0"),s.addColorStop(1,"#d4b483"),r.fillStyle=s,r.fillRect(0,0,16,256);const o=new Qh(i);o.colorSpace=nn;const a=new K(new Xo(165,24,16),new Un({map:o,side:sn,fog:!1}));n.add(a);const l=new c2("#b9dcff","#a88352",.78);l.position.set(0,60,0),n.add(l);const c=new h2("#fff2d6",1.45);c.position.set(48,72,36),c.castShadow=!0,c.shadow.mapSize.width=2048,c.shadow.mapSize.height=2048,c.shadow.camera.near=10,c.shadow.camera.far=190;const d=64;c.shadow.camera.left=-d,c.shadow.camera.right=d,c.shadow.camera.top=d,c.shadow.camera.bottom=-d,c.shadow.bias=-5e-4,n.add(c);const h=new Rr("#ffcc88",22,26,1.5);h.position.set(-35,5.2,16),t.add(h);const f=new Rr("#ffcc88",22,26,1.5);f.position.set(-35,5.2,-2),t.add(f);const p=new Rr("#ffd299",18,20,1.5);p.position.set(-18,4.6,-4),t.add(p);const v=new Rr("#ffe0b2",20,24,1.5);v.position.set(36,6.8,18),t.add(v);const y=new Map,m=["sand","stone_floor","wall_sandstone","wall_plaster","wall_dark","crate_wood","crate_green","door_wood","door_metal","roof","site_a","site_b","car_metal"];for(const w of m)y.set(w,y2(w));const u=w=>{const T=w.x2-w.x1,A=w.y2-w.y1,C=w.z2-w.z1;if(w.material==="site_a"||w.material==="site_b")return new it({map:y.get(w.material),transparent:!0,roughness:.9,polygonOffset:!0,polygonOffsetFactor:-1});const M=y.get(w.material),S=w.material==="crate_wood"||w.material==="crate_green"||w.material==="door_wood"||w.material==="door_metal"||w.material==="car_metal";let P=M;if(!S){P=M.clone(),P.needsUpdate=!0;const B=Math.max(T,C),z=Math.max(A,Math.min(T,C));P.repeat.set(Math.max(1,B/5),Math.max(1,z/5))}return new it({map:P,roughness:w.material==="car_metal"||w.material==="door_metal"?.55:.88,metalness:w.material==="car_metal"||w.material==="door_metal"?.35:.04})};for(const w of e.boxes){const T=w.x2-w.x1,A=w.y2-w.y1,C=w.z2-w.z1,M=new ie(T,A,C),S=u(w),P=new K(M,S);P.position.set((w.x1+w.x2)*.5,(w.y1+w.y2)*.5,(w.z1+w.z2)*.5),P.castShadow=w.solid&&w.radarType!=="floor"&&w.radarType!=="none",P.receiveShadow=!0,P.userData={mapSolid:w.solid,boxId:w.id},t.add(P)}for(const w of e.ramps){const T=S2(w),A=new it({map:y.get(w.material),roughness:.9,metalness:.02}),C=new K(T,A);C.receiveShadow=!0,C.castShadow=!1,C.userData={mapSolid:!0,rampId:w.id},t.add(C)}du(t,"A",47.8,6.2,-37,-Math.PI/2),du(t,"B",-45.8,3.6,-31.5,Math.PI/2),du(t,"MID",-8,6.2,-18.7,0);const g=new it({color:"#d7be98",roughness:.92}),_=new it({color:"#c4a678",roughness:.85}),x=[[-56,11,-35],[56,13,-38],[20,12,-55],[-26,12,56],[54,11,20]];for(const[w,T,A]of x){const C=new K(new ie(8,T*2,8),g);C.position.set(w,T,A),t.add(C);const M=new K(new Xo(3.8,12,10,0,Math.PI*2,0,Math.PI/2),_);M.position.set(w,T*2,A),t.add(M)}return n.add(t),t}function du(n,e,t,i,r,s){const o=document.createElement("canvas");o.width=256,o.height=128;const a=o.getContext("2d");a.fillStyle="rgba(205, 175, 132, 0.1)",a.fillRect(0,0,256,128),a.fillStyle="#c82d20",a.font="bold 92px sans-serif",a.textAlign="center",a.textBaseline="middle",a.fillText(e,128,66);const l=new Qh(o);l.colorSpace=nn;const c=new K(new ta(4.2,2.1),new Un({map:l,transparent:!0,depthWrite:!1}));c.position.set(t,i,r),c.rotation.y=s,n.add(c)}class w2{constructor(){O(this,"nodes",new Map);this.buildDust2Graph()}addNode(e,t,i,r,s){this.nodes.set(e,{id:e,x:t,y:i,z:r,neighbors:[],tags:s})}connect(e,t){const i=this.nodes.get(e),r=this.nodes.get(t);!i||!r||(i.neighbors.includes(t)||i.neighbors.push(t),r.neighbors.includes(e)||r.neighbors.push(e))}buildDust2Graph(){this.addNode("t_spawn_c",0,3,41,["t_spawn"]),this.addNode("t_spawn_e",18,3,39,["t_spawn"]),this.addNode("t_spawn_w",-18,3,39,["t_spawn"]),this.addNode("out_long_s",34,3,36),this.addNode("out_long_n",35,3,26),this.addNode("long_doors_in",36,2.2,18),this.addNode("long_doors_exit",38.5,1.5,11.5),this.addNode("a_long_s",38,1.5,5),this.addNode("a_long_m",37,1.5,-5),this.addNode("a_long_n",38,1.5,-15,["ct_hold_a"]),this.addNode("a_ramp",38,2.5,-22),this.addNode("a_site_s",38,3.4,-30,["a_site"]),this.addNode("a_site_plant",40.5,3.4,-34.5,["a_site","plant_a"]),this.addNode("a_site_goose",43,3.4,-42,["a_site","ct_hold_a"]),this.addNode("a_site_nw",32.5,3.4,-40,["a_site","ct_hold_a"]),this.addNode("suicide",1,2.3,28),this.addNode("top_mid",2,1.6,17),this.addNode("top_mid_e",9,1.6,18),this.addNode("mid_long_conn",18,2.4,22),this.addNode("mid_ramp",-2,.8,5),this.addNode("mid_lower",-2,0,-5,["mid"]),this.addNode("mid_lower_n",-2.8,0,-15,["mid"]),this.addNode("mid_doors",-2.8,0,-20,["mid_doors"]),this.addNode("ct_mid_s",-2.8,0,-25,["ct_mid","ct_hold_mid"]),this.addNode("ct_mid_c",-7,0,-30,["ct_mid"]),this.addNode("ct_mid_w",-16,0,-28,["ct_mid","ct_hold_b"]),this.addNode("ct_mid_nw",-16,0,-37.5,["ct_mid"]),this.addNode("ct_spawn_w",6,0,-37,["ct_spawn"]),this.addNode("ct_spawn_e",15,0,-38,["ct_spawn"]),this.addNode("ct_ramp_mid",24,1.7,-39),this.addNode("short_stairs_bot",9,1.8,7),this.addNode("short_stairs_top",9,3,-6),this.addNode("cat_mid",9,3,-16,["catwalk","ct_hold_mid"]),this.addNode("cat_corner",9,3,-28,["catwalk"]),this.addNode("cat_bridge",18,3,-28.5,["catwalk","ct_hold_a"]),this.addNode("short_a_top",29,3.4,-29,["catwalk"]),this.addNode("out_b",-32,2.4,35),this.addNode("b_tun_entry",-39,1.8,30),this.addNode("b_tun_s",-39,1.8,17),this.addNode("b_tun_m",-39,1.8,5),this.addNode("b_tun_n",-36,1.8,-4,["b_tunnels"]),this.addNode("b_tun_exit",-36,1.1,-12),this.addNode("b_lower_w",-24,1.6,-4),this.addNode("b_lower_e",-11,.1,-4),this.addNode("b_site_s",-36,.5,-19,["b_site"]),this.addNode("b_site_w",-37.2,.5,-28,["b_site"]),this.addNode("b_site_plant",-33.8,.5,-35.5,["b_site","plant_b"]),this.addNode("b_site_e",-28.5,.5,-28,["b_site","ct_hold_b"]),this.addNode("b_site_ne",-28.5,.5,-37.5,["b_site","ct_hold_b"]),this.addNode("b_site_back",-42.5,1.2,-40.5,["b_site","ct_hold_b"]),this.addNode("b_doors",-21.5,.25,-28),this.addNode("b_window",-21.5,.25,-37.5),this.connect("t_spawn_c","t_spawn_e"),this.connect("t_spawn_c","t_spawn_w"),this.connect("t_spawn_c","suicide"),this.connect("t_spawn_e","out_long_s"),this.connect("out_long_s","out_long_n"),this.connect("out_long_n","mid_long_conn"),this.connect("mid_long_conn","top_mid_e"),this.connect("out_long_n","long_doors_in"),this.connect("long_doors_in","long_doors_exit"),this.connect("long_doors_exit","a_long_s"),this.connect("a_long_s","a_long_m"),this.connect("a_long_m","a_long_n"),this.connect("a_long_n","a_ramp"),this.connect("a_ramp","a_site_s"),this.connect("a_site_s","a_site_plant"),this.connect("a_site_plant","a_site_goose"),this.connect("a_site_plant","a_site_nw"),this.connect("a_site_s","a_site_nw"),this.connect("a_site_goose","a_site_nw"),this.connect("suicide","top_mid"),this.connect("top_mid","top_mid_e"),this.connect("top_mid","mid_ramp"),this.connect("mid_ramp","mid_lower"),this.connect("mid_lower","mid_lower_n"),this.connect("mid_lower_n","mid_doors"),this.connect("mid_doors","ct_mid_s"),this.connect("ct_mid_s","ct_mid_c"),this.connect("ct_mid_c","ct_mid_w"),this.connect("ct_mid_c","ct_mid_nw"),this.connect("ct_mid_w","ct_mid_nw"),this.connect("ct_mid_s","ct_spawn_w"),this.connect("ct_mid_c","ct_spawn_w"),this.connect("ct_spawn_w","ct_spawn_e"),this.connect("ct_spawn_e","ct_ramp_mid"),this.connect("ct_ramp_mid","a_site_nw"),this.connect("top_mid_e","short_stairs_bot"),this.connect("top_mid","short_stairs_bot"),this.connect("short_stairs_bot","short_stairs_top"),this.connect("short_stairs_top","cat_mid"),this.connect("cat_mid","cat_corner"),this.connect("cat_corner","cat_bridge"),this.connect("cat_bridge","short_a_top"),this.connect("short_a_top","a_site_s"),this.connect("short_a_top","a_site_nw"),this.connect("t_spawn_w","out_b"),this.connect("out_b","b_tun_entry"),this.connect("b_tun_entry","b_tun_s"),this.connect("b_tun_s","b_tun_m"),this.connect("b_tun_m","b_tun_n"),this.connect("b_tun_n","b_tun_exit"),this.connect("b_tun_n","b_lower_w"),this.connect("b_lower_w","b_lower_e"),this.connect("b_lower_e","mid_lower"),this.connect("b_tun_exit","b_site_s"),this.connect("b_site_s","b_site_e"),this.connect("b_site_s","b_site_w"),this.connect("b_site_w","b_site_plant"),this.connect("b_site_e","b_site_plant"),this.connect("b_site_plant","b_site_ne"),this.connect("b_site_plant","b_site_back"),this.connect("b_site_e","b_site_ne"),this.connect("b_site_e","b_doors"),this.connect("b_doors","ct_mid_w"),this.connect("b_site_ne","b_window"),this.connect("b_window","ct_mid_nw")}getNode(e){return this.nodes.get(e)}getNodesByTag(e){var i;const t=[];for(const r of this.nodes.values())(i=r.tags)!=null&&i.includes(e)&&t.push(r);return t}findNearestNode(e,t,i){let r=null,s=1/0;for(const o of this.nodes.values()){const a=o.x-e,l=(o.y-t)*2.5,c=o.z-i,d=a*a+l*l+c*c;d<s&&(s=d,r=o)}return r}findPath(e,t){const i=this.findNearestNode(e.x,e.y,e.z),r=this.findNearestNode(t.x,t.y,t.z);if(i.id===r.id)return[{x:t.x,y:t.y,z:t.z}];const s=new Set([i.id]),o=new Map,a=new Map([[i.id,0]]),l=new Map([[i.id,this.dist(i,r)]]);for(;s.size>0;){let c="",d=1/0;for(const f of s){const p=l.get(f)??1/0;p<d&&(d=p,c=f)}if(c===r.id){const f=[];let p=c;for(;p;){const v=this.nodes.get(p);f.push({x:v.x,y:v.y,z:v.z}),p=o.get(p)}return f.reverse(),f.push({x:t.x,y:t.y,z:t.z}),f}s.delete(c);const h=this.nodes.get(c);for(const f of h.neighbors){const p=this.nodes.get(f),v=(a.get(c)??1/0)+this.dist(h,p);v<(a.get(f)??1/0)&&(o.set(f,c),a.set(f,v),l.set(f,v+this.dist(p,r)),s.add(f))}}return[{x:t.x,y:t.y,z:t.z}]}dist(e,t){return Math.hypot(e.x-t.x,(e.y-t.y)*1.4,e.z-t.z)}}class E2{constructor(e){O(this,"solidBoxes");O(this,"ramps");this.solidBoxes=e.boxes.filter(t=>t.solid),this.ramps=e.ramps}getRampHeight(e,t,i){if(e.axis==="x"){const r=Math.max(0,Math.min(1,(t-e.x1)/(e.x2-e.x1)));return e.yStart+r*(e.yEnd-e.yStart)}else{const r=Math.max(0,Math.min(1,(i-e.z1)/(e.z2-e.z1)));return e.yStart+r*(e.yEnd-e.yStart)}}moveCharacter(e,t,i,r,s=Qe.PLAYER_RADIUS){const o=t.x*i,a=t.z*i,l=.22,c=Math.hypot(o,a),d=Math.max(1,Math.ceil(c/l)),h=o/d,f=a/d;for(let m=0;m<d;m++)e.x+=h,this.resolveHorizontal(e,t,s,r,"x"),e.z+=f,this.resolveHorizontal(e,t,s,r,"z");const p=e.y;e.y+=t.y*i;let v=-999;for(const m of this.solidBoxes)e.x+s<=m.x1||e.x-s>=m.x2||e.z+s<=m.z1||e.z-s>=m.z2||(m.y2<=p+Qe.STEP_HEIGHT+.05&&m.y2>v&&(v=m.y2),t.y>0&&p+r<=m.y1+.08&&e.y+r>m.y1&&(e.y=m.y1-r,t.y=0));for(const m of this.ramps){if(e.x+s*.65<m.x1||e.x-s*.65>m.x2||e.z+s*.65<m.z1||e.z-s*.65>m.z2)continue;const u=this.getRampHeight(m,e.x,e.z);u<=p+Qe.STEP_HEIGHT+.35&&u>v&&(v=u)}let y=!1;if(v>-900){const m=t.y<=0&&p-v<=.32&&p>=v-.05;(e.y<=v||m)&&(e.y=v,t.y<0&&(t.y=0),y=!0)}return{grounded:y}}resolveHorizontal(e,t,i,r,s){const o=e.y,a=e.y+r;for(const l of this.solidBoxes)if(!(l.y2<=o+Qe.STEP_HEIGHT)&&!(l.y1>=a-.05)&&!(e.x+i<=l.x1||e.x-i>=l.x2)&&!(e.z+i<=l.z1||e.z-i>=l.z2))if(s==="x"){const c=l.x1-i,d=l.x2+i,h=Math.abs(e.x-c),f=Math.abs(e.x-d);h<f?e.x=c:e.x=d,t.x=0}else{const c=l.z1-i,d=l.z2+i,h=Math.abs(e.z-c),f=Math.abs(e.z-d);h<f?e.z=c:e.z=d,t.z=0}}raycastMap(e,t,i){let r=i,s=null,o="wall_sandstone";const a=Math.abs(t.x)>1e-8?1/t.x:1e12,l=Math.abs(t.y)>1e-8?1/t.y:1e12,c=Math.abs(t.z)>1e-8?1/t.z:1e12;for(const d of this.solidBoxes){let h=(d.x1-e.x)*a,f=(d.x2-e.x)*a,p=-1;if(h>f){const T=h;h=f,f=T,p=1}let v=(d.y1-e.y)*l,y=(d.y2-e.y)*l,m=-1;if(v>y){const T=v;v=y,y=T,m=1}let u=(d.z1-e.z)*c,g=(d.z2-e.z)*c,_=-1;if(u>g){const T=u;u=g,g=T,_=1}const x=Math.max(h,v,u);Math.min(f,y,g)>=Math.max(.001,x)&&x<r&&x>=.001&&(r=x,o=d.material,x===h?s=new I(p,0,0):x===v?s=new I(0,m,0):s=new I(0,0,_))}for(const d of this.ramps){const h=this.raycastRampPlane(e,t,d,r);h&&h.t<r&&(r=h.t,s=h.normal,o=d.material)}return s?{distance:r,point:e.clone().addScaledVector(t,r),normal:s,materialKind:o}:null}raycastRampPlane(e,t,i,r){let s=0,o=0,a=0,l;if(i.axis==="x"){if(s=(i.yEnd-i.yStart)/(i.x2-i.x1),o=t.y-s*t.x,Math.abs(o)<1e-6)return null;a=i.yStart+s*(e.x-i.x1)-e.y,l=new I(-s,1,0).normalize()}else{if(s=(i.yEnd-i.yStart)/(i.z2-i.z1),o=t.y-s*t.z,Math.abs(o)<1e-6)return null;a=i.yStart+s*(e.z-i.z1)-e.y,l=new I(0,1,-s).normalize()}const c=a/o;if(c<.001||c>=r)return null;const d=e.x+t.x*c,h=e.z+t.z*c;return d>=i.x1&&d<=i.x2&&h>=i.z1&&h<=i.z2?{t:c,normal:l}:null}hasLineOfSight(e,t){const i=t.clone().sub(e),r=i.length();if(r<.05)return!0;const s=i.divideScalar(r);return this.raycastMap(e,s,r-.12)===null}}class T2{constructor(e){O(this,"root");O(this,"weaponPivot");O(this,"models",new Map);O(this,"currentWeapon","glock");O(this,"muzzleMesh");O(this,"muzzleLight");O(this,"muzzleTimer",0);O(this,"recoilKickZ",0);O(this,"recoilKickPitch",0);O(this,"equipAnim",0);O(this,"slashAnim",0);O(this,"walkBobPhase",0);O(this,"c4Led",null);O(this,"c4BlinkTimer",0);this.root=new ot,this.weaponPivot=new ot,this.root.add(this.weaponPivot),e.add(this.root),this.buildAllWeapons(),this.muzzleMesh=new K(new rc(.075,0),new Un({color:"#ffd966",transparent:!0,opacity:.92})),this.muzzleMesh.visible=!1,this.weaponPivot.add(this.muzzleMesh),this.muzzleLight=new Rr("#ffb84d",0,5.5),this.muzzleLight.position.set(.22,-.1,-.75),this.root.add(this.muzzleLight),this.setWeapon("usp",!0)}buildAllWeapons(){const e=new it({color:"#22262b",roughness:.42,metalness:.72}),t=new it({color:"#393f47",roughness:.38,metalness:.78}),i=new it({color:"#b8c0c8",roughness:.25,metalness:.9}),r=new it({color:"#8f5527",roughness:.72}),s=new it({color:"#375436",roughness:.65}),o=new it({color:"#2c3138",roughness:.85}),a=new it({color:"#35485e",roughness:.88}),l=(H,Q,ne)=>{const Z=new K(new ie(.085,.085,.14),o);Z.position.set(...ne);const we=new K(new ie(.095,.095,.26),a);we.position.set(ne[0]+.05,ne[1]-.05,ne[2]+.16),we.rotation.y=-.2,H.add(Z,we);const he=new K(new ie(.08,.075,.13),o);he.position.set(...Q);const _e=new K(new ie(.09,.09,.32),a);_e.position.set(Q[0]-.11,Q[1]-.08,Q[2]+.18),_e.rotation.y=.42,_e.rotation.x=.12,H.add(he,_e)},c=new ot,d=new K(new ie(.068,.095,.42),e),h=new K(new ie(.058,.04,.32),t);h.position.set(0,.055,.02);const f=new K(new ie(.062,.075,.25),r);f.position.set(0,.005,-.32);const p=new K(new ie(.056,.09,.24),r);p.position.set(0,-.025,.31);const v=new K(new Vt(.015,.016,.36,10),e);v.rotation.x=Math.PI/2,v.position.set(0,.02,-.56);const y=new K(new Vt(.012,.012,.24,8),t);y.rotation.x=Math.PI/2,y.position.set(0,.045,-.39);const m=new K(new ie(.014,.045,.02),e);m.position.set(0,.052,-.71);const u=new K(new ie(.044,.14,.08),r);u.position.set(0,-.1,-.11),u.rotation.x=.18;const g=new K(new ie(.044,.13,.078),r);g.position.set(0,-.21,-.15),g.rotation.x=.42,c.add(d,h,f,p,v,y,m,u,g),l(c,[-.04,-.04,-.32],[.02,-.09,.09]),c.position.set(.24,-.23,-.44),this.models.set("ak47",c);const _=new ot,x=new K(new ie(.068,.1,.38),e),w=new K(new ie(.05,.03,.44),t);w.position.set(0,.06,-.12);const T=new K(new ie(.064,.078,.28),t);T.position.set(0,.005,-.32);const A=new K(new Vt(.014,.015,.34,10),e);A.rotation.x=Math.PI/2,A.position.set(0,.015,-.55);const C=new K(new ie(.016,.06,.04),e);C.position.set(0,.065,-.47);const M=new K(new ie(.04,.045,.08),e);M.position.set(0,.08,.08);const S=new K(new ie(.045,.19,.075),e);S.position.set(0,-.13,-.1),S.rotation.x=.1;const P=new K(new ie(.056,.095,.24),e);P.position.set(0,-.01,.28),_.add(x,w,T,A,C,M,S,P),l(_,[-.04,-.04,-.32],[.02,-.09,.09]),_.position.set(.24,-.23,-.44),this.models.set("m4a4",_);const B=new ot,z=new K(new ie(.072,.098,.62),s),V=new K(new ie(.06,.105,.26),s);V.position.set(0,-.015,.36);const Y=new K(new Vt(.017,.021,.62,10),e);Y.rotation.x=Math.PI/2,Y.position.set(0,.025,-.56);const X=new K(new ie(.036,.036,.08),e);X.position.set(0,.025,-.88);const J=new K(new Vt(.025,.022,.34,12),e);J.rotation.x=Math.PI/2,J.position.set(0,.105,-.06);const D=new K(new Vt(.036,.026,.1,12),e);D.rotation.x=Math.PI/2,D.position.set(0,.105,-.25);const $=new K(new ie(.026,.05,.03),t);$.position.set(0,.068,-.14);const ee=$.clone();ee.position.set(0,.068,.04);const ce=new K(new ie(.06,.018,.018),i);ce.position.set(.048,.03,.12),B.add(z,V,Y,X,J,D,$,ee,ce),l(B,[-.04,-.04,-.3],[.02,-.09,.1]),B.position.set(.24,-.24,-.44),this.models.set("awp",B);const ye=new ot,Ge=new K(new ie(.048,.056,.26),e),q=new K(new ie(.044,.032,.24),t);q.position.set(0,-.036,.005);const se=new K(new ie(.042,.13,.068),e);se.position.set(0,-.095,.075),se.rotation.x=-.22,ye.add(Ge,q,se),l(ye,[-.03,-.1,.06],[.01,-.1,.09]),ye.position.set(.22,-.22,-.46),this.models.set("glock",ye);const pe=new ot,ue=new K(new ie(.046,.056,.25),e),Pe=new K(new Vt(.019,.019,.24,12),e);Pe.rotation.x=Math.PI/2,Pe.position.set(0,.005,-.24);const De=new K(new ie(.042,.13,.068),t);De.position.set(0,-.095,.075),De.rotation.x=-.2,pe.add(ue,Pe,De),l(pe,[-.03,-.1,.06],[.01,-.1,.09]),pe.position.set(.22,-.22,-.46),this.models.set("usp",pe);const ze=new ot,pt=new K(new ie(.056,.072,.32),i),je=new K(new ie(.03,.018,.28),e);je.position.set(0,.04,-.01);const mt=new K(new ie(.048,.145,.076),e);mt.position.set(0,-.1,.09),mt.rotation.x=-.24,ze.add(pt,je,mt),l(ze,[-.03,-.1,.07],[.01,-.1,.1]),ze.position.set(.22,-.22,-.46),this.models.set("deagle",ze);const U=new ot,Jt=new K(new ie(.014,.048,.26),i);Jt.position.set(0,.01,-.13);const Ve=new K(new Jh(.028,.09,4),i);Ve.rotation.x=-Math.PI/2,Ve.position.set(0,.01,-.29);const We=new K(new ie(.04,.08,.025),e);We.position.set(0,0,0);const Ce=new K(new ie(.036,.045,.14),e);Ce.position.set(0,0,.08),U.add(Jt,Ve,We,Ce),l(U,[-.25,-.14,.02],[.01,-.02,.1]),U.position.set(.24,-.22,-.42),U.rotation.y=.22,U.rotation.z=-.15,this.models.set("knife",U);const nt=new ot,Re=new K(new ie(.22,.09,.28),new it({color:"#7a725a",roughness:.85})),R=new K(new ie(.11,.015,.06),new Un({color:"#243a24"}));R.position.set(0,.048,-.06);const E=new K(new ie(.12,.015,.11),e);E.position.set(0,.048,.05),this.c4Led=new K(new ie(.026,.02,.026),new Un({color:"#ff2424"})),this.c4Led.position.set(.075,.052,-.06),nt.add(Re,R,E,this.c4Led),l(nt,[-.12,-.03,.02],[.12,-.03,.02]),nt.position.set(.02,-.26,-.44),nt.rotation.x=.42,this.models.set("c4",nt);for(const[H,Q]of this.models.entries())Q.visible=!1,this.weaponPivot.add(Q)}setWeapon(e,t=!1){if(this.currentWeapon===e&&!t)return;const i=this.models.get(this.currentWeapon);i&&(i.visible=!1),this.currentWeapon=e;const r=this.models.get(e);r&&(r.visible=!0),this.equipAnim=t?0:1;const s={ak47:-1.16,m4a4:-1.15,awp:-1.35,glock:-.68,usp:-.84,deagle:-.72,knife:-.6,c4:-.5};this.muzzleMesh.position.set(.23,-.2,s[e])}triggerFire(e){if(e==="knife"){this.slashAnim=1;return}if(e==="c4")return;const t={ak47:[.085,.14],m4a4:[.052,.08],awp:[.15,.22],glock:[.04,.08],usp:[.035,.07],deagle:[.11,.24],knife:[0,0],c4:[0,0]},[i,r]=t[e];this.recoilKickZ=Math.min(.18,this.recoilKickZ+i),this.recoilKickPitch=Math.min(.32,this.recoilKickPitch+r),e!=="usp"&&(this.muzzleTimer=.045,this.muzzleMesh.visible=!0,this.muzzleMesh.rotation.set(Math.random()*4,Math.random()*4,0),this.muzzleMesh.scale.setScalar(e==="awp"?1.55:e==="ak47"?1.15:.9),this.muzzleLight.intensity=e==="awp"?5.5:3.2)}update(e,t,i,r,s,o,a){this.root.visible=a&&!o,this.muzzleTimer>0&&(this.muzzleTimer-=e,this.muzzleTimer<=0&&(this.muzzleMesh.visible=!1,this.muzzleLight.intensity=0)),this.c4Led&&this.currentWeapon==="c4"&&(this.c4BlinkTimer+=e,this.c4Led.visible=Math.floor(this.c4BlinkTimer*3)%2===0),this.recoilKickZ=Math.max(0,this.recoilKickZ-e*.55),this.recoilKickPitch=Math.max(0,this.recoilKickPitch-e*1.45),this.equipAnim=Math.max(0,this.equipAnim-e*4.2),this.slashAnim=Math.max(0,this.slashAnim-e*4.5),i&&t>.4?this.walkBobPhase+=e*t*1.85:this.walkBobPhase+=e*1.1;const l=i&&t>.4?Math.min(.018,t*.0028):.0025,c=Math.cos(this.walkBobPhase)*l,d=Math.abs(Math.sin(this.walkBobPhase))*l*-1.2;let h=0,f=0,p=0;if(r){const u=Math.sin(s*Math.PI);h=-.14*u,f=.48*u,p=-.28*u}let v=0,y=0,m=0;if(this.slashAnim>0){const u=Math.sin(this.slashAnim*Math.PI);v=-.22*u,y=.65*u,m=-.45*u}this.weaponPivot.position.set(c,d-this.equipAnim*.24+h,this.recoilKickZ+v),this.weaponPivot.rotation.set(this.recoilKickPitch-this.equipAnim*.35+p+m,y,f)}}class A2{constructor(e,t){O(this,"container");O(this,"onHudUpdate");O(this,"renderer");O(this,"scene");O(this,"camera");O(this,"viewModel");O(this,"sound",new _2);O(this,"mapData");O(this,"physics");O(this,"nav");O(this,"botAI");O(this,"combatants",[]);O(this,"humanTeam","CT");O(this,"gameMode","competitive");O(this,"spectateId",null);O(this,"started",!1);O(this,"paused",!1);O(this,"pointerLocked",!1);O(this,"buyMenuOpen",!1);O(this,"scoreboardOpen",!1);O(this,"roundNumber",1);O(this,"roundPhase","freeze");O(this,"phaseTimer",Ye.FREEZE_TIME);O(this,"liveElapsed",0);O(this,"ctScore",0);O(this,"tScore",0);O(this,"tExecuteSite","A");O(this,"roundBanner",null);O(this,"announcement",null);O(this,"announcementTimer",0);O(this,"bombState","carried");O(this,"bombPos",new I);O(this,"bombSite",null);O(this,"bombTimer",Ye.BOMB_TIMER);O(this,"bombBeepTimer",0);O(this,"bombWorldMesh");O(this,"bombLedMesh");O(this,"bombLight");O(this,"explosionMesh");O(this,"explosionLight");O(this,"explosionTimer",0);O(this,"screenShake",0);O(this,"keys",new Set);O(this,"mouseLeftDown",!1);O(this,"mouseLeftJustPressed",!1);O(this,"mouseSensitivity",rs.DEFAULT_SENSITIVITY);O(this,"prevSlot","secondary");O(this,"playerKeypadBeepTimer",0);O(this,"playerDefuseSoundPlayed",!1);O(this,"raycaster",new f2);O(this,"tracers",[]);O(this,"sparks",[]);O(this,"killFeed",[]);O(this,"killSeq",0);O(this,"hitMarker",{active:!1,headshot:!1,kill:!1,seq:0,timer:0});O(this,"damageFlash",0);O(this,"damageIndicators",[]);O(this,"dmgIndSeq",0);O(this,"rafId",0);O(this,"lastFrameTime",0);O(this,"accumulator",0);O(this,"simTime",0);O(this,"hudEmitAccum",0);O(this,"disposed",!1);O(this,"loop",e=>{if(this.disposed)return;this.rafId=requestAnimationFrame(this.loop);const t=Math.min(Qe.MAX_FRAME_DT,(e-this.lastFrameTime)/1e3);if(this.lastFrameTime=e,this.started&&!this.paused){for(this.accumulator+=t;this.accumulator>=Qe.FIXED_DT;)this.fixedStep(Qe.FIXED_DT),this.accumulator-=Qe.FIXED_DT;this.updateVisualFX(t)}else if(!this.started){const i=e*18e-5;this.camera.position.set(Math.cos(i)*28,22,Math.sin(i)*28-4),this.camera.lookAt(4,2,-10),this.viewModel.root.visible=!1}this.renderer.render(this.scene,this.camera),this.hudEmitAccum+=t,this.hudEmitAccum>=.04&&(this.hudEmitAccum=0,this.emitHud())});O(this,"handleResize",()=>{const e=this.container.clientWidth,t=Math.max(1,this.container.clientHeight);this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)});O(this,"handlePointerLockChange",()=>{this.pointerLocked=document.pointerLockElement===this.renderer.domElement,!this.pointerLocked&&this.started&&!this.buyMenuOpen?(this.paused=!0,this.mouseLeftDown=!1,this.keys.clear()):this.pointerLocked&&(this.paused=!1,this.buyMenuOpen=!1),this.emitHud()});O(this,"handleContextMenu",e=>{this.started&&e.preventDefault()});O(this,"handleMouseMove",e=>{if(!this.pointerLocked||this.paused||this.buyMenuOpen)return;const t=this.getHumanPlayer();if(!t||!t.alive)return;const i=t.scopeLevel===2?.32:t.scopeLevel===1?.55:1;t.yaw-=e.movementX*this.mouseSensitivity*i,t.pitch-=e.movementY*this.mouseSensitivity*i,t.pitch=Math.max(-1.46,Math.min(1.46,t.pitch))});O(this,"handleMouseDown",e=>{if(!this.started||this.paused||this.buyMenuOpen)return;if(this.sound.unlock(),!this.pointerLocked){this.requestPointerLock();return}const t=this.getHumanPlayer();if(t){if(!t.alive){e.button===0?this.cycleSpectate(1):e.button===2&&this.cycleSpectate(-1);return}if(e.button===0)this.mouseLeftDown=!0,this.mouseLeftJustPressed=!0;else if(e.button===2){const i=t.getActiveWeaponId(),r=Ue[i];r.canScope&&!t.reloading?(t.scopeLevel=(t.scopeLevel+1)%3,this.sound.playScope(t.scopeLevel),this.emitHud()):r.isMelee&&t.fireCooldown<=0&&this.roundPhase!=="freeze"&&this.fireWeapon(t,void 0,!0)}}});O(this,"handleMouseUp",e=>{e.button===0&&(this.mouseLeftDown=!1)});O(this,"handleWheel",e=>{if(!this.pointerLocked||this.paused||this.buyMenuOpen)return;const t=this.getHumanPlayer();if(!t||!t.alive)return;const i=[];t.primary&&i.push("primary"),t.secondary&&i.push("secondary"),i.push("melee"),t.hasC4&&i.push("c4");const s=(i.indexOf(t.activeSlot)+(e.deltaY>0?1:-1)+i.length)%i.length;this.switchPlayerSlot(t,i[s])});O(this,"handleKeyDown",e=>{var i;if(!this.started)return;if(e.code==="Tab"){e.preventDefault(),this.scoreboardOpen=!0,this.emitHud();return}if(e.code==="KeyB"&&!this.paused){const r=this.getHumanPlayer();r&&r.alive&&this.canPlayerBuy(r)?(this.buyMenuOpen=!this.buyMenuOpen,this.buyMenuOpen?(i=document.exitPointerLock)==null||i.call(document):this.requestPointerLock(),this.emitHud()):this.buyMenuOpen&&this.closeBuyMenu();return}if(e.code==="Escape"&&this.buyMenuOpen){this.closeBuyMenu();return}this.keys.add(e.code);const t=this.getHumanPlayer();if(t){if(!t.alive){e.code==="KeyE"?this.tryTakeoverSpectatedBot():e.code==="Space"&&this.cycleSpectate(1);return}if(!(this.paused||this.buyMenuOpen)){if(e.code==="Digit1")this.switchPlayerSlot(t,"primary");else if(e.code==="Digit2")this.switchPlayerSlot(t,"secondary");else if(e.code==="Digit3")this.switchPlayerSlot(t,"melee");else if(e.code==="Digit4"||e.code==="Digit5")this.switchPlayerSlot(t,"c4");else if(e.code==="KeyQ")this.switchPlayerSlot(t,this.prevSlot);else if(e.code==="KeyR")t.startReload()&&(this.sound.playReload("start"),this.emitHud());else if(e.code==="KeyG"&&t.hasC4&&this.bombState==="carried"){t.hasC4=!1,this.bombState="dropped";const r=t.getLookDirection().setY(0).normalize().multiplyScalar(1.4);this.bombPos.copy(t.pos).add(r),this.bombWorldMesh.position.copy(this.bombPos),this.bombWorldMesh.visible=!0,t.activeSlot==="c4"&&(t.switchSlot(t.primary?"primary":"secondary"),this.viewModel.setWeapon(t.getActiveWeaponId())),this.showAnnouncement("已丢弃 C4 炸弹",1.8),this.emitHud()}}}});O(this,"handleKeyUp",e=>{this.keys.delete(e.code),e.code==="Tab"&&(this.scoreboardOpen=!1,this.emitHud())});this.container=e,this.onHudUpdate=t,this.renderer=new o2({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setSize(e.clientWidth,e.clientHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Bg,this.renderer.toneMapping=Vg,this.renderer.toneMappingExposure=1.08,e.appendChild(this.renderer.domElement),this.scene=new a2,this.camera=new Mn(rs.DEFAULT_FOV,e.clientWidth/Math.max(1,e.clientHeight),rs.NEAR,rs.FAR),this.camera.rotation.order="YXZ",this.scene.add(this.camera),this.viewModel=new T2(this.camera),this.mapData=p2(),M2(this.scene,this.mapData),this.physics=new E2(this.mapData),this.nav=new w2,this.botAI=new g2(this.nav,this.physics,this.mapData);const{group:i,led:r,light:s}=this.createWorldC4Prop();this.bombWorldMesh=i,this.bombLedMesh=r,this.bombLight=s,this.scene.add(this.bombWorldMesh),this.explosionMesh=new K(new Xo(1,20,16),new Un({color:"#ff8a24",transparent:!0,opacity:.85})),this.explosionMesh.visible=!1,this.scene.add(this.explosionMesh),this.explosionLight=new Rr("#ff9430",0,90),this.scene.add(this.explosionLight),this.initTeams("CT","competitive"),this.bindEvents(),this.lastFrameTime=performance.now(),this.emitHud(),this.loop(this.lastFrameTime)}createWorldC4Prop(){const e=new ot,t=new K(new ie(.32,.14,.42),new it({color:"#8a7e60",roughness:.82}));t.position.y=.07,t.castShadow=!0;const i=new K(new ie(.16,.02,.16),new it({color:"#22262b",roughness:.5}));i.position.set(0,.145,.06);const r=new K(new ie(.055,.03,.055),new Un({color:"#ff2424"}));r.position.set(.08,.155,-.09);const s=new Rr("#ff2020",0,9);return s.position.set(0,.35,0),e.add(t,i,r,s),e.visible=!1,{group:e,led:r,light:s}}initTeams(e,t){for(const r of this.combatants)this.scene.remove(r.model.root);this.combatants=[],this.humanTeam=e,this.gameMode=t,this.ctScore=0,this.tScore=0,this.roundNumber=1,this.killFeed=[];const i=t==="competitive"?Ye.PISTOL_ROUND_MONEY:Ye.FULL_BUY_START_MONEY;["CT","T"].forEach(r=>{for(let s=0;s<5;s++){const o=r===e&&s===0,a=o?"YOU":`${r}-${ty[r][s]}`,l=new x2(`${r}_${s}`,a,r,o);l.money=i,this.combatants.push(l),this.scene.add(l.model.root)}}),this.startRound(!0)}startMatch(e,t){this.sound.unlock(),this.started=!0,this.paused=!1,this.buyMenuOpen=!1,this.initTeams(e,t),this.requestPointerLock(),this.emitHud()}resumeGame(){this.sound.unlock(),this.paused=!1,this.buyMenuOpen=!1,this.requestPointerLock(),this.emitHud()}restartMatch(){this.startMatch(this.humanTeam,this.gameMode)}setMuted(e){this.sound.setMuted(e)}setSensitivity(e){this.mouseSensitivity=e}requestPointerLock(){var e,t;document.pointerLockElement!==this.renderer.domElement&&((t=(e=this.renderer.domElement).requestPointerLock)==null||t.call(e))}closeBuyMenu(){this.buyMenuOpen=!1,this.started&&!this.paused&&this.requestPointerLock(),this.emitHud()}buyItem(e){const t=this.getHumanPlayer();if(!t||!t.alive||!this.canPlayerBuy(t))return!1;const i=this.isCurrentPistolRound();if(e==="armor")return t.armor>=100||t.money<Ye.ARMOR_COST?!1:(t.money-=Ye.ARMOR_COST,t.armor=100,this.sound.playBuySound(),this.emitHud(),!0);if(e==="helmet")return i||t.hasHelmet||t.armor<=0||t.money<Ye.HELMET_COST?!1:(t.money-=Ye.HELMET_COST,t.hasHelmet=!0,this.sound.playBuySound(),this.emitHud(),!0);const r=Ue[e];return!r||r.price<=0||i&&r.slot==="primary"||t.money<r.price?!1:(t.money-=r.price,t.equipWeapon(e),this.viewModel.setWeapon(t.getActiveWeaponId()),this.sound.playBuySound(),this.emitHud(),!0)}isCurrentPistolRound(){return this.gameMode==="competitive"&&this.roundNumber===1}startRound(e){const t=this.isCurrentPistolRound();this.roundPhase="freeze",this.phaseTimer=Ye.FREEZE_TIME,this.liveElapsed=0,this.roundBanner=null,this.spectateId=null,this.tExecuteSite=Math.random()<.52?"A":"B",this.bombState="carried",this.bombSite=null,this.bombTimer=Ye.BOMB_TIMER,this.bombBeepTimer=0,this.bombWorldMesh.visible=!1,this.bombLight.intensity=0;for(const l of this.combatants)l.isHuman=l.id===`${this.humanTeam}_0`;const i=this.combatants.filter(l=>l.team==="CT"),r=this.combatants.filter(l=>l.team==="T");if(i.forEach((l,c)=>{const d=!e&&l.alive&&!t;l.resetForRound(this.mapData.spawns.CT[c],t,d)}),r.forEach((l,c)=>{const d=!e&&l.alive&&!t;l.resetForRound(this.mapData.spawns.T[c],t,d)}),!t&&e)for(const l of this.combatants)l.armor=100,l.hasHelmet=!0,l.isHuman&&l.equipWeapon(l.team==="T"?"ak47":"m4a4");const s=this.humanTeam==="T"&&Math.random()<.55?0:Math.floor(Math.random()*r.length),o=r[s];o.hasC4=!0,this.bombPos.copy(o.pos),this.botAI.resetForRound(this.combatants,t,this.tExecuteSite);const a=this.getHumanPlayer();a&&this.viewModel.setWeapon(a.getActiveWeaponId(),!0),this.showAnnouncement(t?`第 ${this.roundNumber} 回合 · 手枪局 (PISTOL ROUND)`:`第 ${this.roundNumber} 回合 · 按 [B] 购买装备`),this.emitHud()}getHumanPlayer(){return this.combatants.find(e=>e.isHuman)}getViewedCombatant(){const e=this.getHumanPlayer();if(e&&e.alive)return e;if(this.spectateId){const i=this.combatants.find(r=>r.id===this.spectateId&&r.alive);if(i)return i}const t=this.combatants.find(i=>i.team===this.humanTeam&&i.alive);return t?(this.spectateId=t.id,t):e}cycleSpectate(e=1){const t=this.combatants.filter(o=>o.team===this.humanTeam&&o.alive);if(t.length===0)return;const r=(t.findIndex(o=>o.id===this.spectateId)+e+t.length)%t.length;this.spectateId=t[r].id;const s=t[r];this.viewModel.setWeapon(s.getActiveWeaponId(),!0),this.emitHud()}tryTakeoverSpectatedBot(){const e=this.getHumanPlayer();if(!e||e.alive)return;const t=this.combatants.find(i=>i.id===this.spectateId&&i.team===this.humanTeam&&i.alive&&!i.isHuman);t&&(e.isHuman=!1,t.isHuman=!0,t.isPlanting=!1,t.isDefusing=!1,this.spectateId=null,this.viewModel.setWeapon(t.getActiveWeaponId(),!0),this.showAnnouncement(`已接管队友 ${t.name}！`),this.sound.playBuySound(),this.emitHud())}canPlayerBuy(e){return this.roundPhase==="round_end"?!1:this.roundPhase==="freeze"?!0:this.roundPhase==="live"&&this.liveElapsed<=Ye.BUY_WINDOW?Tm(this.mapData,e.team,e.pos.x,e.pos.z):!1}showAnnouncement(e,t=3.2){this.announcement=e,this.announcementTimer=t}fixedStep(e){if(this.simTime+=e,this.announcementTimer>0&&(this.announcementTimer-=e,this.announcementTimer<=0&&(this.announcement=null)),this.roundPhase==="freeze")this.phaseTimer-=e,this.phaseTimer<=0&&(this.roundPhase="live",this.phaseTimer=Ye.ROUND_TIME,this.liveElapsed=0,this.showAnnouncement("回合开始！GO GO GO!",2));else if(this.roundPhase==="live")this.phaseTimer-=e,this.liveElapsed+=e,this.phaseTimer<=0&&this.finishRound("CT","时间耗尽 · CT 守包成功");else if(this.roundPhase==="bomb_planted")this.bombTimer-=e,this.phaseTimer=Math.max(0,this.bombTimer),this.updatePlantedBomb(e),this.bombTimer<=0&&this.detonateBomb();else if(this.roundPhase==="round_end"&&(this.phaseTimer-=e,this.phaseTimer<=0)){this.roundNumber+=1,this.startRound(!1);return}const t=this.getHumanPlayer();t&&t.alive&&this.updateHumanPlayer(t,e);const i={time:this.simTime,roundPhase:this.roundPhase,isPistolRound:this.isCurrentPistolRound(),combatants:this.combatants,bombState:this.bombState,bombPos:this.bombPos,bombSite:this.bombSite,tExecuteSite:this.tExecuteSite,onBotFire:(s,o)=>this.fireWeapon(s,o),onBotPlantComplete:(s,o)=>this.completeBombPlant(s,o),onBotDefuseComplete:s=>this.completeBombDefuse(s),onBotKeypadBeep:s=>this.sound.playC4Keypad(s),onBotDefuseStart:s=>this.sound.playC4DefuseStart(s)};for(const s of this.combatants)!s.isHuman&&s.alive&&(this.botAI.updateBot(s,e,i),this.updateCombatantFootsteps(s,e));if(this.updateBombCarrierAndPickup(),t&&t.alive){const s=t.getEyePosition(),o=t.getLookDirection();for(const a of this.combatants){if(!a.alive||a.team===t.team)continue;const l=a.pos.clone();l.y+=1.25;const c=l.clone().sub(s);c.length()<85&&o.dot(c.normalize())>.35&&this.physics.hasLineOfSight(s,l)&&(a.lastSpottedTime=this.simTime)}}if(this.roundPhase==="live"||this.roundPhase==="bomb_planted"){const s=this.combatants.filter(a=>a.team==="CT"&&a.alive).length,o=this.combatants.filter(a=>a.team==="T"&&a.alive).length;s===0?this.finishRound("T","反恐精英全军覆没 · T 获胜"):o===0&&this.bombState!=="planted"&&this.finishRound("CT","恐怖分子全部消灭 · CT 获胜")}const r=this.getViewedCombatant();for(const s of this.combatants){const o=Math.hypot(s.vel.x,s.vel.z),a=(r==null?void 0:r.id)===s.id&&s.alive;s.model.update(e,s.pos,s.yaw,s.pitch,o,s.crouching,!a)}if(r){const s=r.getEyePosition();this.camera.position.copy(s),this.screenShake>0&&(this.camera.position.x+=(Math.random()-.5)*this.screenShake*.45,this.camera.position.y+=(Math.random()-.5)*this.screenShake*.45),this.camera.rotation.set(r.pitch,r.yaw,0,"YXZ");const o=Ue[r.getActiveWeaponId()];let a=rs.DEFAULT_FOV;o.canScope&&r.scopeLevel>0&&o.scopeFovs&&(a=o.scopeFovs[r.scopeLevel-1]??28),Math.abs(this.camera.fov-a)>.1&&(this.camera.fov+=(a-this.camera.fov)*Math.min(1,e*18),this.camera.updateProjectionMatrix()),this.sound.updateListener(s,r.yaw),this.viewModel.setWeapon(r.getActiveWeaponId());const l=r.reloading&&r.reloadDuration>0?1-r.reloadTimer/r.reloadDuration:0;this.viewModel.update(e,Math.hypot(r.vel.x,r.vel.z),r.grounded,r.reloading,l,r.scopeLevel>0,r.alive)}this.mouseLeftJustPressed=!1}updateHumanPlayer(e,t){e.fireCooldown>0&&(e.fireCooldown-=t),e.updateReload(t)&&this.sound.playReload("end");const i=e.getActiveWeaponId(),r=Ue[i];if(e.recoilSpread=Math.max(0,e.recoilSpread-r.recoilRecovery*.015*t),!this.mouseLeftDown&&(e.shotsFiredBurst=Math.max(0,e.shotsFiredBurst-t*14),e.recoilPitchAccum>0)){const f=Math.min(e.recoilPitchAccum,t*r.recoilRecovery*.06);e.pitch=Math.max(-1.45,e.pitch-f*.45),e.recoilPitchAccum-=f}const s=this.roundPhase!=="freeze"&&!this.buyMenuOpen;e.crouching=this.keys.has("ControlLeft")||this.keys.has("KeyC"),e.walking=this.keys.has("ShiftLeft")||this.keys.has("ShiftRight");const o=this.keys.has("KeyE"),a=e.team==="T"&&e.hasC4&&this.bombState==="carried"&&this.roundPhase==="live"?Fl(this.mapData,e.pos.x,e.pos.y,e.pos.z):null;if(s&&a!==null&&(o||i==="c4"&&this.mouseLeftDown)&&a?(e.isPlanting||(e.isPlanting=!0,e.plantProgress=0,e.switchSlot("c4"),this.playerKeypadBeepTimer=.05),e.plantProgress+=t/Ye.PLANT_TIME,this.playerKeypadBeepTimer-=t,this.playerKeypadBeepTimer<=0&&(this.sound.playC4Keypad(),this.playerKeypadBeepTimer=.45),e.vel.x=0,e.vel.z=0,e.crouching=!0,e.plantProgress>=1&&(e.isPlanting=!1,e.plantProgress=0,this.completeBombPlant(e,a))):e.isPlanting&&(e.isPlanting=!1,e.plantProgress=0,e.primary?e.switchSlot("primary"):e.secondary&&e.switchSlot("secondary")),s&&e.team==="CT"&&this.bombState==="planted"&&e.pos.distanceTo(this.bombPos)<2.6&&o?(e.isDefusing||(e.isDefusing=!0,e.defuseProgress=0,this.playerDefuseSoundPlayed=!1),this.playerDefuseSoundPlayed||(this.sound.playC4DefuseStart(),this.playerDefuseSoundPlayed=!0),e.defuseProgress+=t/Ye.DEFUSE_TIME,e.vel.x=0,e.vel.z=0,e.crouching=!0,e.defuseProgress>=1&&(e.isDefusing=!1,e.defuseProgress=0,this.completeBombDefuse(e))):e.isDefusing&&(e.isDefusing=!1,e.defuseProgress=0),s&&!e.isPlanting&&!e.isDefusing){let f=0,p=0;this.keys.has("KeyW")&&(f+=1),this.keys.has("KeyS")&&(f-=1),this.keys.has("KeyD")&&(p+=1),this.keys.has("KeyA")&&(p-=1);const v=Math.sin(e.yaw),y=Math.cos(e.yaw);let m=-v*f+y*p,u=-y*f-v*p;const g=Math.hypot(m,u);g>.001&&(m/=g,u/=g);let _=Qe.BASE_MOVE_SPEED*r.moveSpeedMult;if(e.scopeLevel>0?_*=.56:e.crouching?_*=Qe.CROUCH_SPEED_MULT:e.walking&&(_*=Qe.WALK_SPEED_MULT),e.grounded){const x=Math.hypot(e.vel.x,e.vel.z);if(x>.01){const w=x*Qe.GROUND_FRICTION*t,T=Math.max(0,x-w)/x;e.vel.x*=T,e.vel.z*=T}if(g>.001){e.vel.x+=m*Qe.GROUND_ACCEL*t,e.vel.z+=u*Qe.GROUND_ACCEL*t;const w=Math.hypot(e.vel.x,e.vel.z);w>_&&(e.vel.x=e.vel.x/w*_,e.vel.z=e.vel.z/w*_)}this.keys.has("Space")&&(e.vel.y=Qe.JUMP_SPEED,e.grounded=!1)}else if(g>.001){e.vel.x+=m*Qe.AIR_ACCEL*t,e.vel.z+=u*Qe.AIR_ACCEL*t;const x=Math.hypot(e.vel.x,e.vel.z);x>_*1.05&&(e.vel.x=e.vel.x/x*_*1.05,e.vel.z=e.vel.z/x*_*1.05)}}else e.vel.x*=.7,e.vel.z*=.7;e.vel.y-=Qe.GRAVITY*t;const d=e.crouching?Qe.PLAYER_CROUCH_HEIGHT:Qe.PLAYER_HEIGHT,h=this.physics.moveCharacter(e.pos,e.vel,t,d);e.grounded=h.grounded,this.updateCombatantFootsteps(e,t),this.pointerLocked&&!this.buyMenuOpen&&!e.isPlanting&&!e.isDefusing&&!e.reloading&&i!=="c4"&&this.roundPhase!=="freeze"&&(r.automatic?this.mouseLeftDown:this.mouseLeftJustPressed)&&e.fireCooldown<=0&&this.fireWeapon(e)}updateCombatantFootsteps(e,t){const i=Math.hypot(e.vel.x,e.vel.z);if(e.grounded&&i>1.6&&!e.walking&&!e.crouching){if(e.footstepAccum+=i*t,e.footstepAccum>=2.25){e.footstepAccum=0;const r=this.getViewedCombatant(),s=(r==null?void 0:r.id)===e.id?void 0:e.pos;this.sound.playFootstep(s,!0)}}else e.footstepAccum=0}fireWeapon(e,t,i=!1){const r=e.getActiveWeaponId(),s=Ue[r];if(s.isBomb)return;if(s.isMelee){e.fireCooldown=i?.85:60/s.fireRate;const w=this.getViewedCombatant();(w==null?void 0:w.id)===e.id?(this.viewModel.triggerFire("knife"),this.sound.playWeaponFire("knife")):this.sound.playWeaponFire("knife",e.pos);const T=e.getEyePosition(),A=e.getLookDirection(),C=this.raycastCombatants(e,T,A,s.range);if(C){const M=i?65:s.damage;this.applyCombatHit(e,C.victim,C.zone,M,s.armorPenetration,r,C.point)}return}const o=e.getActiveWeaponInstance();if(!o)return;if(o.ammoInMag<=0){e.startReload()&&this.sound.playReload("start",e.isHuman?void 0:e.pos);return}o.ammoInMag-=1,e.fireCooldown=60/s.fireRate,e.shotsFiredBurst+=1;const a=this.getViewedCombatant();(a==null?void 0:a.id)===e.id?(this.viewModel.triggerFire(r),this.sound.playWeaponFire(r)):(e.model.triggerMuzzleFlash(),this.sound.playWeaponFire(r,e.pos));const l=e.getEyePosition();let c;t?c=t.clone().sub(l).normalize():c=e.getLookDirection();const d=Math.hypot(e.vel.x,e.vel.z);let h=s.baseSpread+e.recoilSpread;e.grounded?d>1.2&&(h+=s.moveSpread*Math.min(1,d/Qe.BASE_MOVE_SPEED)):h+=s.jumpSpread,e.crouching&&(h*=.68),r==="awp"&&(e.scopeLevel===0&&e.isHuman?h+=.065:e.scopeLevel>0&&d<.8&&e.grounded&&(h=4e-4));const f=new I().crossVectors(c,new I(0,1,0)).normalize(),p=new I().crossVectors(f,c).normalize(),v=Math.random()*Math.PI*2,y=Math.random()*h;c.addScaledVector(f,Math.cos(v)*y),c.addScaledVector(p,Math.sin(v)*y),c.normalize();const m=this.physics.raycastMap(l,c,s.range),u=m?m.distance:s.range,g=this.raycastCombatants(e,l,c,u);let _;if(g)_=g.point,this.applyCombatHit(e,g.victim,g.zone,s.damage,s.armorPenetration,r,g.point),this.spawnImpactSpark(g.point,"#d92b2b");else if(m){_=m.point,this.spawnImpactSpark(m.point,"#f2d08a");const w=m.materialKind==="door_metal"||m.materialKind==="car_metal";this.sound.playBulletImpact(m.point,w)}else _=l.clone().addScaledVector(c,s.range);const x=l.clone().addScaledVector(c,.55);if(x.y-=.06,this.spawnTracer(x,_,r==="awp"),e.recoilSpread=Math.min(.11,e.recoilSpread+s.recoilSpreadGain),e.isHuman){const w=1+Math.min(1.2,e.shotsFiredBurst*.09),T=s.recoilPitch*(.85+Math.random()*.3)*w,A=(Math.random()-.5)*2*s.recoilYaw*w;e.pitch=Math.min(1.45,e.pitch+T),e.yaw+=A,e.recoilPitchAccum+=T}r==="awp"&&e.scopeLevel>0&&(e.scopeLevel=0),o.ammoInMag===0&&o.reserveAmmo>0&&e.startReload()&&this.sound.playReload("start",e.isHuman?void 0:e.pos),e.isHuman&&this.emitHud()}raycastCombatants(e,t,i,r){const s=[],o=new Map;for(const f of this.combatants){if(!f.alive||f.id===e.id||f.team===e.team)continue;const p=f.pos.clone();p.y+=1;const v=p.sub(t),y=v.dot(i);y<-.5||y>r+1||v.lengthSq()-y*y>1.4||(o.set(f.id,f),f.model.root.updateMatrixWorld(!0),s.push(...f.model.hitboxMeshes))}if(s.length===0)return null;this.raycaster.set(t,i),this.raycaster.near=.05,this.raycaster.far=r;const a=this.raycaster.intersectObjects(s,!1);if(a.length===0)return null;const l=a[0],c=l.object.userData.agentId,d=l.object.userData.hitboxZone||"chest",h=o.get(c);return h?{victim:h,zone:d,distance:l.distance,point:l.point.clone()}:null}applyCombatHit(e,t,i,r,s,o,a){const l=i==="head",{killed:c}=t.applyHitDamage(r,s,i);if(e.lastSpottedTime=this.simTime,e.isHuman&&(this.hitMarker={active:!0,headshot:l,kill:c,seq:this.hitMarker.seq+1,timer:c?.34:.2},this.sound.playHitFeedback(l),c&&this.sound.playKillChime(l)),t.isHuman){this.damageFlash=Math.min(1,this.damageFlash+(l?.85:.5)),this.sound.playHurt();const d=e.pos.x-t.pos.x,h=e.pos.z-t.pos.z,p=Math.atan2(-d,-h)-t.yaw;this.damageIndicators.push({id:this.dmgIndSeq++,angle:p,timestamp:performance.now()})}if(c){if(e.kills+=1,e.money=Math.min(Ye.MAX_MONEY,e.money+Ue[o].killReward),t.hasC4&&this.bombState==="carried"&&(t.hasC4=!1,this.bombState="dropped",this.bombPos.copy(t.pos),this.bombWorldMesh.position.copy(this.bombPos),this.bombWorldMesh.visible=!0,this.bombLight.intensity=1.6,this.showAnnouncement("C4 炸弹已掉落！",2.4)),this.killFeed.unshift({id:this.killSeq++,killerName:e.name,killerTeam:e.team,victimName:t.name,victimTeam:t.team,weaponName:Ue[o].shortName,headshot:l,timestamp:performance.now()}),this.killFeed.length>6&&this.killFeed.pop(),t.isHuman){const d=this.combatants.find(h=>h.team===this.humanTeam&&h.alive);d&&(this.spectateId=d.id,this.showAnnouncement(`你已阵亡 · 按 [E] 接管队友 ${d.name}`,4.5))}this.emitHud()}}updateBombCarrierAndPickup(){if(this.bombState==="carried"){const e=this.combatants.find(t=>t.alive&&t.hasC4);e&&(this.bombPos.copy(e.pos),this.bombWorldMesh.visible=!1)}else if(this.bombState==="dropped"){this.bombWorldMesh.visible=!0,this.bombWorldMesh.position.copy(this.bombPos);for(const e of this.combatants)if(e.alive&&e.team==="T"&&e.pos.distanceTo(this.bombPos)<1.85){e.hasC4=!0,this.bombState="carried",this.bombWorldMesh.visible=!1,this.bombLight.intensity=0,this.showAnnouncement(`${e.name} 拾取了 C4 炸弹`,2.2);break}}}completeBombPlant(e,t){e.hasC4=!1,e.money=Math.min(Ye.MAX_MONEY,e.money+300),e.primary?e.switchSlot("primary"):e.secondary&&e.switchSlot("secondary"),this.bombState="planted",this.bombSite=t,this.bombPos.copy(e.pos),this.bombTimer=Ye.BOMB_TIMER,this.bombBeepTimer=.05,this.roundPhase="bomb_planted",this.phaseTimer=this.bombTimer,this.bombWorldMesh.position.copy(this.bombPos),this.bombWorldMesh.visible=!0,this.sound.playC4Planted(),this.showAnnouncement(`C4 已在 ${t} 点安放！倒计时 ${Ye.BOMB_TIMER} 秒`,3.5),this.emitHud()}updatePlantedBomb(e){this.bombBeepTimer-=e;const t=1-Math.max(0,this.bombTimer/Ye.BOMB_TIMER),i=Math.max(.14,1.05-t*.92);this.bombBeepTimer<=0?(this.bombBeepTimer=i,this.sound.playC4Beep(this.bombPos,t),this.bombLedMesh.visible=!0,this.bombLight.intensity=4.5):this.bombBeepTimer<i*.65&&(this.bombLedMesh.visible=!1,this.bombLight.intensity=.3)}completeBombDefuse(e){this.bombState="defused",this.bombLight.intensity=0,this.bombLedMesh.visible=!1,e.money=Math.min(Ye.MAX_MONEY,e.money+300),this.sound.playC4Defused(),this.finishRound("CT",`C4 已被 ${e.name} 成功拆除 · CT 获胜`)}detonateBomb(){this.bombState="exploded",this.bombWorldMesh.visible=!1,this.bombLight.intensity=0,this.explosionMesh.position.copy(this.bombPos),this.explosionMesh.scale.setScalar(1),this.explosionMesh.visible=!0,this.explosionLight.position.set(this.bombPos.x,this.bombPos.y+3,this.bombPos.z),this.explosionLight.intensity=35,this.explosionTimer=1.4,this.screenShake=1.2,this.sound.playC4Explosion(this.bombPos);for(const e of this.combatants){if(!e.alive)continue;const t=e.pos.distanceTo(this.bombPos);if(t<24){const i=Math.round((1-t/24)*260);e.applyHitDamage(i,1,"chest")}}this.finishRound("T","C4 炸弹引爆 · T 获胜")}finishRound(e,t){if(this.roundPhase==="round_end")return;this.roundPhase="round_end",this.phaseTimer=Ye.ROUND_END_TIME,e==="CT"?this.ctScore+=1:this.tScore+=1;const i=this.bombState==="planted"||this.bombState==="exploded"||this.bombState==="defused";for(const r of this.combatants){let s=r.team===e?Ye.WIN_REWARD:Ye.LOSS_REWARD;r.team==="T"&&e==="CT"&&i&&(s+=Ye.BOMB_PLANT_BONUS),r.money=Math.min(Ye.MAX_MONEY,r.money+s)}this.roundBanner={title:e==="CT"?"反恐精英胜利 (CT WIN)":"恐怖分子胜利 (T WIN)",subtitle:t,team:e},this.sound.playRoundEnd(e===this.humanTeam),this.emitHud()}spawnTracer(e,t,i){const r=new Cn().setFromPoints([e,t]),s=new v_({color:i?"#fff5c0":"#ffdf88",transparent:!0,opacity:i?.9:.6}),o=new l2(r,s);this.scene.add(o);const a=i?.24:.08;this.tracers.push({line:o,life:a,maxLife:a})}spawnImpactSpark(e,t){const i=new K(new ie(.11,.11,.11),new Un({color:t,transparent:!0,opacity:.95}));i.position.copy(e),this.scene.add(i),this.sparks.push({mesh:i,life:.22,maxLife:.22})}updateVisualFX(e){for(let i=this.tracers.length-1;i>=0;i--){const r=this.tracers[i];r.life-=e,r.life<=0?(this.scene.remove(r.line),r.line.geometry.dispose(),r.line.material.dispose(),this.tracers.splice(i,1)):r.line.material.opacity=r.life/r.maxLife*.75}for(let i=this.sparks.length-1;i>=0;i--){const r=this.sparks[i];r.life-=e,r.life<=0?(this.scene.remove(r.mesh),r.mesh.geometry.dispose(),r.mesh.material.dispose(),this.sparks.splice(i,1)):(r.mesh.scale.setScalar(1+(1-r.life/r.maxLife)*1.4),r.mesh.material.opacity=r.life/r.maxLife)}if(this.hitMarker.timer>0&&(this.hitMarker.timer-=e,this.hitMarker.timer<=0&&(this.hitMarker.active=!1)),this.damageFlash>0&&(this.damageFlash=Math.max(0,this.damageFlash-e*2.2)),this.screenShake>0&&(this.screenShake=Math.max(0,this.screenShake-e*1.1)),this.explosionTimer>0){this.explosionTimer-=e;const i=1-Math.max(0,this.explosionTimer/1.4);this.explosionMesh.scale.setScalar(1+i*22),this.explosionMesh.material.opacity=Math.max(0,(1-i)*.85),this.explosionLight.intensity=Math.max(0,(1-i)*35),this.explosionTimer<=0&&(this.explosionMesh.visible=!1)}const t=performance.now();this.killFeed=this.killFeed.filter(i=>t-i.timestamp<7500),this.damageIndicators=this.damageIndicators.filter(i=>t-i.timestamp<1400)}bindEvents(){window.addEventListener("resize",this.handleResize),window.addEventListener("keydown",this.handleKeyDown),window.addEventListener("keyup",this.handleKeyUp),window.addEventListener("mousemove",this.handleMouseMove),window.addEventListener("mousedown",this.handleMouseDown),window.addEventListener("mouseup",this.handleMouseUp),window.addEventListener("wheel",this.handleWheel,{passive:!0}),window.addEventListener("contextmenu",this.handleContextMenu),document.addEventListener("pointerlockchange",this.handlePointerLockChange)}switchPlayerSlot(e,t){const i=e.activeSlot;e.switchSlot(t)&&(this.prevSlot=i,this.viewModel.setWeapon(e.getActiveWeaponId()),this.emitHud())}emitHud(){var u,g;const e=this.getHumanPlayer(),t=this.getViewedCombatant()??e,i=t?t.getActiveWeaponId():"usp",r=Ue[i],s=t==null?void 0:t.getActiveWeaponInstance(),o=t?Math.hypot(t.vel.x,t.vel.z):0,a=r.baseSpread+((t==null?void 0:t.recoilSpread)??0)+(t&&!t.grounded?r.jumpSpread:o/Qe.BASE_MOVE_SPEED*r.moveSpread),l=Math.min(48,Math.max(4,Math.round(a*460))),c=!!(e&&!e.alive&&t&&t.id!==e.id),d=!!(c&&t&&t.alive&&!t.isHuman),h=t&&t.alive?Fl(this.mapData,t.pos.x,t.pos.y,t.pos.z):null;let f=null,p=null;t&&t.alive&&(t.isPlanting?f={label:"正在安放 C4...",progress:t.plantProgress}:t.isDefusing?f={label:"正在拆除 C4...",progress:t.defuseProgress}:c||(t.team==="T"&&t.hasC4&&this.bombState==="carried"&&h&&this.roundPhase==="live"?p=`按住 [E] 在 ${h} 点安放 C4`:t.team==="CT"&&this.bombState==="planted"&&t.pos.distanceTo(this.bombPos)<2.8&&(p="按住 [E] 拆除 C4 炸弹")));const v=this.combatants.map(_=>{const x=_.team!==this.humanTeam,w=this.simTime-_.lastSpottedTime,T=!x||w<2.2,A=x?Math.max(0,1-w/2.2):1;return{id:_.id,team:_.team,x:_.pos.x,z:_.pos.z,yaw:_.yaw,alive:_.alive,isPlayer:_.isHuman,isSpectated:!!(c&&(t==null?void 0:t.id)===_.id),hasC4:_.hasC4,spotted:T,lastSpottedAlpha:A}}),y=this.humanTeam==="T"||this.bombState==="planted"||this.bombState==="dropped"&&!!(t&&this.physics.hasLineOfSight(t.getEyePosition(),this.bombPos)),m={started:this.started,paused:this.paused,pointerLocked:this.pointerLocked,buyMenuOpen:this.buyMenuOpen,scoreboardOpen:this.scoreboardOpen,playerTeam:this.humanTeam,controlledName:(e==null?void 0:e.name)??"YOU",isSpectating:c,spectateTargetName:(t==null?void 0:t.name)??"",canTakeoverBot:d,roundNumber:this.roundNumber,isPistolRound:this.isCurrentPistolRound(),roundPhase:this.roundPhase,phaseTimer:Math.max(0,this.phaseTimer),ctScore:this.ctScore,tScore:this.tScore,ctAlive:this.combatants.filter(_=>_.team==="CT"&&_.alive).length,tAlive:this.combatants.filter(_=>_.team==="T"&&_.alive).length,roundBanner:this.roundBanner,hp:(t==null?void 0:t.hp)??0,armor:(t==null?void 0:t.armor)??0,hasHelmet:(t==null?void 0:t.hasHelmet)??!1,money:(t==null?void 0:t.money)??0,alive:(t==null?void 0:t.alive)??!1,callout:t?m2(this.mapData,t.pos.x,t.pos.z):"Dust2",activeWeapon:i,activeWeaponName:r.name,ammoInMag:(s==null?void 0:s.ammoInMag)??0,reserveAmmo:(s==null?void 0:s.reserveAmmo)??0,reloading:(t==null?void 0:t.reloading)??!1,reloadProgress:t&&t.reloading&&t.reloadDuration>0?1-t.reloadTimer/t.reloadDuration:0,scopeLevel:(t==null?void 0:t.scopeLevel)??0,crosshairSpread:l,slots:{primary:((u=t==null?void 0:t.primary)==null?void 0:u.id)??null,secondary:((g=t==null?void 0:t.secondary)==null?void 0:g.id)??null,melee:"knife",c4:(t==null?void 0:t.hasC4)??!1},inBuyZone:e?Tm(this.mapData,e.team,e.pos.x,e.pos.z):!1,canBuy:e?this.canPlayerBuy(e):!1,inPlantZone:h,bombState:this.bombState,bombPlantedSite:this.bombSite,bombTimeRemaining:this.bombTimer,actionProgress:f,interactionPrompt:p,hitMarker:{active:this.hitMarker.active,headshot:this.hitMarker.headshot,kill:this.hitMarker.kill,seq:this.hitMarker.seq},damageFlash:this.damageFlash,damageIndicators:[...this.damageIndicators],killFeed:[...this.killFeed],minimapAgents:v,minimapBomb:{state:this.bombState,x:this.bombPos.x,z:this.bombPos.z,site:this.bombSite??void 0,visible:y},scoreboard:this.combatants.map(_=>({id:_.id,name:_.name,team:_.team,alive:_.alive,isHuman:_.isHuman,kills:_.kills,deaths:_.deaths,assists:_.assists,money:_.money,hp:_.hp,hasC4:_.hasC4,weaponShort:Ue[_.getActiveWeaponId()].shortName})),announcement:this.announcement};this.onHudUpdate(m)}dispose(){this.disposed=!0,cancelAnimationFrame(this.rafId),window.removeEventListener("resize",this.handleResize),window.removeEventListener("keydown",this.handleKeyDown),window.removeEventListener("keyup",this.handleKeyUp),window.removeEventListener("mousemove",this.handleMouseMove),window.removeEventListener("mousedown",this.handleMouseDown),window.removeEventListener("mouseup",this.handleMouseUp),window.removeEventListener("wheel",this.handleWheel),window.removeEventListener("contextmenu",this.handleContextMenu),document.removeEventListener("pointerlockchange",this.handlePointerLockChange),this.renderer.dispose(),this.renderer.domElement.parentNode===this.container&&this.container.removeChild(this.renderer.domElement)}}const b2=()=>{const n=Zt.useRef(null),e=Zt.useRef(null),[t,i]=Zt.useState(null);Zt.useEffect(()=>{const c=n.current;if(!c)return;const d=new A2(c,h=>{i(h)});return e.current=d,()=>{d.dispose(),e.current=null}},[]);const r=(c,d)=>{var h;(h=e.current)==null||h.startMatch(c,d)},s=()=>{var c;(c=e.current)==null||c.resumeGame()},o=()=>{var c;(c=e.current)==null||c.restartMatch()},a=c=>{var d;(d=e.current)==null||d.buyItem(c)},l=()=>{var c;(c=e.current)==null||c.closeBuyMenu()};return L.jsxs("div",{style:{position:"relative",width:"100vw",height:"100vh",overflow:"hidden"},children:[L.jsx("div",{ref:n,style:{width:"100%",height:"100%"},onClick:()=>{var c;t!=null&&t.started&&!t.paused&&!t.buyMenuOpen&&!t.pointerLocked&&((c=e.current)==null||c.requestPointerLock())}}),t&&t.started&&e.current&&L.jsx(sy,{hud:t,mapData:e.current.mapData}),t&&t.started&&t.buyMenuOpen&&L.jsx(ny,{hud:t,onBuy:a,onClose:l}),t&&t.started&&t.scoreboardOpen&&L.jsx(oy,{hud:t}),t&&(!t.started||t.paused)&&L.jsx(ay,{hud:t,onStart:r,onResume:s,onRestart:o,onSensitivityChange:c=>{var d;return(d=e.current)==null?void 0:d.setSensitivity(c)},onMuteToggle:c=>{var d;return(d=e.current)==null?void 0:d.setMuted(c)}})]})};hu.createRoot(document.getElementById("root")).render(L.jsx(zm.StrictMode,{children:L.jsx(b2,{})}));

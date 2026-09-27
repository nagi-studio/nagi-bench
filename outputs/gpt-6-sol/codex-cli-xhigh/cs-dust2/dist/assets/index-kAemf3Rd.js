var Pv=Object.defineProperty;var Lv=(s,e,t)=>e in s?Pv(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var Qe=(s,e,t)=>Lv(s,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const l of a)if(l.type==="childList")for(const c of l.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function t(a){const l={};return a.integrity&&(l.integrity=a.integrity),a.referrerPolicy&&(l.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?l.credentials="include":a.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function r(a){if(a.ep)return;a.ep=!0;const l=t(a);fetch(a.href,l)}})();var Oc={exports:{}},Go={},zc={exports:{}},mt={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zp;function Dv(){if(Zp)return mt;Zp=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),a=Symbol.for("react.profiler"),l=Symbol.for("react.provider"),c=Symbol.for("react.context"),f=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),p=Symbol.for("react.memo"),g=Symbol.for("react.lazy"),v=Symbol.iterator;function x(U){return U===null||typeof U!="object"?null:(U=v&&U[v]||U["@@iterator"],typeof U=="function"?U:null)}var S={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,w={};function y(U,re,Fe){this.props=U,this.context=re,this.refs=w,this.updater=Fe||S}y.prototype.isReactComponent={},y.prototype.setState=function(U,re){if(typeof U!="object"&&typeof U!="function"&&U!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,U,re,"setState")},y.prototype.forceUpdate=function(U){this.updater.enqueueForceUpdate(this,U,"forceUpdate")};function _(){}_.prototype=y.prototype;function I(U,re,Fe){this.props=U,this.context=re,this.refs=w,this.updater=Fe||S}var L=I.prototype=new _;L.constructor=I,M(L,y.prototype),L.isPureReactComponent=!0;var b=Array.isArray,z=Object.prototype.hasOwnProperty,F={current:null},O={key:!0,ref:!0,__self:!0,__source:!0};function X(U,re,Fe){var Xe,He={},ee=null,fe=null;if(re!=null)for(Xe in re.ref!==void 0&&(fe=re.ref),re.key!==void 0&&(ee=""+re.key),re)z.call(re,Xe)&&!O.hasOwnProperty(Xe)&&(He[Xe]=re[Xe]);var Me=arguments.length-2;if(Me===1)He.children=Fe;else if(1<Me){for(var Le=Array(Me),Ne=0;Ne<Me;Ne++)Le[Ne]=arguments[Ne+2];He.children=Le}if(U&&U.defaultProps)for(Xe in Me=U.defaultProps,Me)He[Xe]===void 0&&(He[Xe]=Me[Xe]);return{$$typeof:s,type:U,key:ee,ref:fe,props:He,_owner:F.current}}function C(U,re){return{$$typeof:s,type:U.type,key:re,ref:U.ref,props:U.props,_owner:U._owner}}function R(U){return typeof U=="object"&&U!==null&&U.$$typeof===s}function B(U){var re={"=":"=0",":":"=2"};return"$"+U.replace(/[=:]/g,function(Fe){return re[Fe]})}var $=/\/+/g;function te(U,re){return typeof U=="object"&&U!==null&&U.key!=null?B(""+U.key):re.toString(36)}function ue(U,re,Fe,Xe,He){var ee=typeof U;(ee==="undefined"||ee==="boolean")&&(U=null);var fe=!1;if(U===null)fe=!0;else switch(ee){case"string":case"number":fe=!0;break;case"object":switch(U.$$typeof){case s:case e:fe=!0}}if(fe)return fe=U,He=He(fe),U=Xe===""?"."+te(fe,0):Xe,b(He)?(Fe="",U!=null&&(Fe=U.replace($,"$&/")+"/"),ue(He,re,Fe,"",function(Ne){return Ne})):He!=null&&(R(He)&&(He=C(He,Fe+(!He.key||fe&&fe.key===He.key?"":(""+He.key).replace($,"$&/")+"/")+U)),re.push(He)),1;if(fe=0,Xe=Xe===""?".":Xe+":",b(U))for(var Me=0;Me<U.length;Me++){ee=U[Me];var Le=Xe+te(ee,Me);fe+=ue(ee,re,Fe,Le,He)}else if(Le=x(U),typeof Le=="function")for(U=Le.call(U),Me=0;!(ee=U.next()).done;)ee=ee.value,Le=Xe+te(ee,Me++),fe+=ue(ee,re,Fe,Le,He);else if(ee==="object")throw re=String(U),Error("Objects are not valid as a React child (found: "+(re==="[object Object]"?"object with keys {"+Object.keys(U).join(", ")+"}":re)+"). If you meant to render a collection of children, use an array instead.");return fe}function ae(U,re,Fe){if(U==null)return U;var Xe=[],He=0;return ue(U,Xe,"","",function(ee){return re.call(Fe,ee,He++)}),Xe}function oe(U){if(U._status===-1){var re=U._result;re=re(),re.then(function(Fe){(U._status===0||U._status===-1)&&(U._status=1,U._result=Fe)},function(Fe){(U._status===0||U._status===-1)&&(U._status=2,U._result=Fe)}),U._status===-1&&(U._status=0,U._result=re)}if(U._status===1)return U._result.default;throw U._result}var he={current:null},H={transition:null},ce={ReactCurrentDispatcher:he,ReactCurrentBatchConfig:H,ReactCurrentOwner:F};function se(){throw Error("act(...) is not supported in production builds of React.")}return mt.Children={map:ae,forEach:function(U,re,Fe){ae(U,function(){re.apply(this,arguments)},Fe)},count:function(U){var re=0;return ae(U,function(){re++}),re},toArray:function(U){return ae(U,function(re){return re})||[]},only:function(U){if(!R(U))throw Error("React.Children.only expected to receive a single React element child.");return U}},mt.Component=y,mt.Fragment=t,mt.Profiler=a,mt.PureComponent=I,mt.StrictMode=r,mt.Suspense=h,mt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ce,mt.act=se,mt.cloneElement=function(U,re,Fe){if(U==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+U+".");var Xe=M({},U.props),He=U.key,ee=U.ref,fe=U._owner;if(re!=null){if(re.ref!==void 0&&(ee=re.ref,fe=F.current),re.key!==void 0&&(He=""+re.key),U.type&&U.type.defaultProps)var Me=U.type.defaultProps;for(Le in re)z.call(re,Le)&&!O.hasOwnProperty(Le)&&(Xe[Le]=re[Le]===void 0&&Me!==void 0?Me[Le]:re[Le])}var Le=arguments.length-2;if(Le===1)Xe.children=Fe;else if(1<Le){Me=Array(Le);for(var Ne=0;Ne<Le;Ne++)Me[Ne]=arguments[Ne+2];Xe.children=Me}return{$$typeof:s,type:U.type,key:He,ref:ee,props:Xe,_owner:fe}},mt.createContext=function(U){return U={$$typeof:c,_currentValue:U,_currentValue2:U,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},U.Provider={$$typeof:l,_context:U},U.Consumer=U},mt.createElement=X,mt.createFactory=function(U){var re=X.bind(null,U);return re.type=U,re},mt.createRef=function(){return{current:null}},mt.forwardRef=function(U){return{$$typeof:f,render:U}},mt.isValidElement=R,mt.lazy=function(U){return{$$typeof:g,_payload:{_status:-1,_result:U},_init:oe}},mt.memo=function(U,re){return{$$typeof:p,type:U,compare:re===void 0?null:re}},mt.startTransition=function(U){var re=H.transition;H.transition={};try{U()}finally{H.transition=re}},mt.unstable_act=se,mt.useCallback=function(U,re){return he.current.useCallback(U,re)},mt.useContext=function(U){return he.current.useContext(U)},mt.useDebugValue=function(){},mt.useDeferredValue=function(U){return he.current.useDeferredValue(U)},mt.useEffect=function(U,re){return he.current.useEffect(U,re)},mt.useId=function(){return he.current.useId()},mt.useImperativeHandle=function(U,re,Fe){return he.current.useImperativeHandle(U,re,Fe)},mt.useInsertionEffect=function(U,re){return he.current.useInsertionEffect(U,re)},mt.useLayoutEffect=function(U,re){return he.current.useLayoutEffect(U,re)},mt.useMemo=function(U,re){return he.current.useMemo(U,re)},mt.useReducer=function(U,re,Fe){return he.current.useReducer(U,re,Fe)},mt.useRef=function(U){return he.current.useRef(U)},mt.useState=function(U){return he.current.useState(U)},mt.useSyncExternalStore=function(U,re,Fe){return he.current.useSyncExternalStore(U,re,Fe)},mt.useTransition=function(){return he.current.useTransition()},mt.version="18.3.1",mt}var Qp;function hd(){return Qp||(Qp=1,zc.exports=Dv()),zc.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Jp;function Iv(){if(Jp)return Go;Jp=1;var s=hd(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,l={key:!0,ref:!0,__self:!0,__source:!0};function c(f,h,p){var g,v={},x=null,S=null;p!==void 0&&(x=""+p),h.key!==void 0&&(x=""+h.key),h.ref!==void 0&&(S=h.ref);for(g in h)r.call(h,g)&&!l.hasOwnProperty(g)&&(v[g]=h[g]);if(f&&f.defaultProps)for(g in h=f.defaultProps,h)v[g]===void 0&&(v[g]=h[g]);return{$$typeof:e,type:f,key:x,ref:S,props:v,_owner:a.current}}return Go.Fragment=t,Go.jsx=c,Go.jsxs=c,Go}var em;function Uv(){return em||(em=1,Oc.exports=Iv()),Oc.exports}var K=Uv(),Yr=hd(),vl={},kc={exports:{}},On={},Bc={exports:{}},Hc={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var tm;function Nv(){return tm||(tm=1,(function(s){function e(H,ce){var se=H.length;H.push(ce);e:for(;0<se;){var U=se-1>>>1,re=H[U];if(0<a(re,ce))H[U]=ce,H[se]=re,se=U;else break e}}function t(H){return H.length===0?null:H[0]}function r(H){if(H.length===0)return null;var ce=H[0],se=H.pop();if(se!==ce){H[0]=se;e:for(var U=0,re=H.length,Fe=re>>>1;U<Fe;){var Xe=2*(U+1)-1,He=H[Xe],ee=Xe+1,fe=H[ee];if(0>a(He,se))ee<re&&0>a(fe,He)?(H[U]=fe,H[ee]=se,U=ee):(H[U]=He,H[Xe]=se,U=Xe);else if(ee<re&&0>a(fe,se))H[U]=fe,H[ee]=se,U=ee;else break e}}return ce}function a(H,ce){var se=H.sortIndex-ce.sortIndex;return se!==0?se:H.id-ce.id}if(typeof performance=="object"&&typeof performance.now=="function"){var l=performance;s.unstable_now=function(){return l.now()}}else{var c=Date,f=c.now();s.unstable_now=function(){return c.now()-f}}var h=[],p=[],g=1,v=null,x=3,S=!1,M=!1,w=!1,y=typeof setTimeout=="function"?setTimeout:null,_=typeof clearTimeout=="function"?clearTimeout:null,I=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function L(H){for(var ce=t(p);ce!==null;){if(ce.callback===null)r(p);else if(ce.startTime<=H)r(p),ce.sortIndex=ce.expirationTime,e(h,ce);else break;ce=t(p)}}function b(H){if(w=!1,L(H),!M)if(t(h)!==null)M=!0,oe(z);else{var ce=t(p);ce!==null&&he(b,ce.startTime-H)}}function z(H,ce){M=!1,w&&(w=!1,_(X),X=-1),S=!0;var se=x;try{for(L(ce),v=t(h);v!==null&&(!(v.expirationTime>ce)||H&&!B());){var U=v.callback;if(typeof U=="function"){v.callback=null,x=v.priorityLevel;var re=U(v.expirationTime<=ce);ce=s.unstable_now(),typeof re=="function"?v.callback=re:v===t(h)&&r(h),L(ce)}else r(h);v=t(h)}if(v!==null)var Fe=!0;else{var Xe=t(p);Xe!==null&&he(b,Xe.startTime-ce),Fe=!1}return Fe}finally{v=null,x=se,S=!1}}var F=!1,O=null,X=-1,C=5,R=-1;function B(){return!(s.unstable_now()-R<C)}function $(){if(O!==null){var H=s.unstable_now();R=H;var ce=!0;try{ce=O(!0,H)}finally{ce?te():(F=!1,O=null)}}else F=!1}var te;if(typeof I=="function")te=function(){I($)};else if(typeof MessageChannel<"u"){var ue=new MessageChannel,ae=ue.port2;ue.port1.onmessage=$,te=function(){ae.postMessage(null)}}else te=function(){y($,0)};function oe(H){O=H,F||(F=!0,te())}function he(H,ce){X=y(function(){H(s.unstable_now())},ce)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(H){H.callback=null},s.unstable_continueExecution=function(){M||S||(M=!0,oe(z))},s.unstable_forceFrameRate=function(H){0>H||125<H?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<H?Math.floor(1e3/H):5},s.unstable_getCurrentPriorityLevel=function(){return x},s.unstable_getFirstCallbackNode=function(){return t(h)},s.unstable_next=function(H){switch(x){case 1:case 2:case 3:var ce=3;break;default:ce=x}var se=x;x=ce;try{return H()}finally{x=se}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(H,ce){switch(H){case 1:case 2:case 3:case 4:case 5:break;default:H=3}var se=x;x=H;try{return ce()}finally{x=se}},s.unstable_scheduleCallback=function(H,ce,se){var U=s.unstable_now();switch(typeof se=="object"&&se!==null?(se=se.delay,se=typeof se=="number"&&0<se?U+se:U):se=U,H){case 1:var re=-1;break;case 2:re=250;break;case 5:re=1073741823;break;case 4:re=1e4;break;default:re=5e3}return re=se+re,H={id:g++,callback:ce,priorityLevel:H,startTime:se,expirationTime:re,sortIndex:-1},se>U?(H.sortIndex=se,e(p,H),t(h)===null&&H===t(p)&&(w?(_(X),X=-1):w=!0,he(b,se-U))):(H.sortIndex=re,e(h,H),M||S||(M=!0,oe(z))),H},s.unstable_shouldYield=B,s.unstable_wrapCallback=function(H){var ce=x;return function(){var se=x;x=ce;try{return H.apply(this,arguments)}finally{x=se}}}})(Hc)),Hc}var nm;function Fv(){return nm||(nm=1,Bc.exports=Nv()),Bc.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var im;function Ov(){if(im)return On;im=1;var s=hd(),e=Fv();function t(n){for(var i="https://reactjs.org/docs/error-decoder.html?invariant="+n,o=1;o<arguments.length;o++)i+="&args[]="+encodeURIComponent(arguments[o]);return"Minified React error #"+n+"; visit "+i+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var r=new Set,a={};function l(n,i){c(n,i),c(n+"Capture",i)}function c(n,i){for(a[n]=i,n=0;n<i.length;n++)r.add(i[n])}var f=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),h=Object.prototype.hasOwnProperty,p=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,g={},v={};function x(n){return h.call(v,n)?!0:h.call(g,n)?!1:p.test(n)?v[n]=!0:(g[n]=!0,!1)}function S(n,i,o,u){if(o!==null&&o.type===0)return!1;switch(typeof i){case"function":case"symbol":return!0;case"boolean":return u?!1:o!==null?!o.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,i,o,u){if(i===null||typeof i>"u"||S(n,i,o,u))return!0;if(u)return!1;if(o!==null)switch(o.type){case 3:return!i;case 4:return i===!1;case 5:return isNaN(i);case 6:return isNaN(i)||1>i}return!1}function w(n,i,o,u,d,m,E){this.acceptsBooleans=i===2||i===3||i===4,this.attributeName=u,this.attributeNamespace=d,this.mustUseProperty=o,this.propertyName=n,this.type=i,this.sanitizeURL=m,this.removeEmptyString=E}var y={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){y[n]=new w(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var i=n[0];y[i]=new w(i,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){y[n]=new w(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){y[n]=new w(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){y[n]=new w(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){y[n]=new w(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){y[n]=new w(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){y[n]=new w(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){y[n]=new w(n,5,!1,n.toLowerCase(),null,!1,!1)});var _=/[\-:]([a-z])/g;function I(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var i=n.replace(_,I);y[i]=new w(i,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var i=n.replace(_,I);y[i]=new w(i,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var i=n.replace(_,I);y[i]=new w(i,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){y[n]=new w(n,1,!1,n.toLowerCase(),null,!1,!1)}),y.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){y[n]=new w(n,1,!1,n.toLowerCase(),null,!0,!0)});function L(n,i,o,u){var d=y.hasOwnProperty(i)?y[i]:null;(d!==null?d.type!==0:u||!(2<i.length)||i[0]!=="o"&&i[0]!=="O"||i[1]!=="n"&&i[1]!=="N")&&(M(i,o,d,u)&&(o=null),u||d===null?x(i)&&(o===null?n.removeAttribute(i):n.setAttribute(i,""+o)):d.mustUseProperty?n[d.propertyName]=o===null?d.type===3?!1:"":o:(i=d.attributeName,u=d.attributeNamespace,o===null?n.removeAttribute(i):(d=d.type,o=d===3||d===4&&o===!0?"":""+o,u?n.setAttributeNS(u,i,o):n.setAttribute(i,o))))}var b=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,z=Symbol.for("react.element"),F=Symbol.for("react.portal"),O=Symbol.for("react.fragment"),X=Symbol.for("react.strict_mode"),C=Symbol.for("react.profiler"),R=Symbol.for("react.provider"),B=Symbol.for("react.context"),$=Symbol.for("react.forward_ref"),te=Symbol.for("react.suspense"),ue=Symbol.for("react.suspense_list"),ae=Symbol.for("react.memo"),oe=Symbol.for("react.lazy"),he=Symbol.for("react.offscreen"),H=Symbol.iterator;function ce(n){return n===null||typeof n!="object"?null:(n=H&&n[H]||n["@@iterator"],typeof n=="function"?n:null)}var se=Object.assign,U;function re(n){if(U===void 0)try{throw Error()}catch(o){var i=o.stack.trim().match(/\n( *(at )?)/);U=i&&i[1]||""}return`
`+U+n}var Fe=!1;function Xe(n,i){if(!n||Fe)return"";Fe=!0;var o=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(i)if(i=function(){throw Error()},Object.defineProperty(i.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(i,[])}catch(J){var u=J}Reflect.construct(n,[],i)}else{try{i.call()}catch(J){u=J}n.call(i.prototype)}else{try{throw Error()}catch(J){u=J}n()}}catch(J){if(J&&u&&typeof J.stack=="string"){for(var d=J.stack.split(`
`),m=u.stack.split(`
`),E=d.length-1,D=m.length-1;1<=E&&0<=D&&d[E]!==m[D];)D--;for(;1<=E&&0<=D;E--,D--)if(d[E]!==m[D]){if(E!==1||D!==1)do if(E--,D--,0>D||d[E]!==m[D]){var k=`
`+d[E].replace(" at new "," at ");return n.displayName&&k.includes("<anonymous>")&&(k=k.replace("<anonymous>",n.displayName)),k}while(1<=E&&0<=D);break}}}finally{Fe=!1,Error.prepareStackTrace=o}return(n=n?n.displayName||n.name:"")?re(n):""}function He(n){switch(n.tag){case 5:return re(n.type);case 16:return re("Lazy");case 13:return re("Suspense");case 19:return re("SuspenseList");case 0:case 2:case 15:return n=Xe(n.type,!1),n;case 11:return n=Xe(n.type.render,!1),n;case 1:return n=Xe(n.type,!0),n;default:return""}}function ee(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case O:return"Fragment";case F:return"Portal";case C:return"Profiler";case X:return"StrictMode";case te:return"Suspense";case ue:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case B:return(n.displayName||"Context")+".Consumer";case R:return(n._context.displayName||"Context")+".Provider";case $:var i=n.render;return n=n.displayName,n||(n=i.displayName||i.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case ae:return i=n.displayName||null,i!==null?i:ee(n.type)||"Memo";case oe:i=n._payload,n=n._init;try{return ee(n(i))}catch{}}return null}function fe(n){var i=n.type;switch(n.tag){case 24:return"Cache";case 9:return(i.displayName||"Context")+".Consumer";case 10:return(i._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=i.render,n=n.displayName||n.name||"",i.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return i;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return ee(i);case 8:return i===X?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof i=="function")return i.displayName||i.name||null;if(typeof i=="string")return i}return null}function Me(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Le(n){var i=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(i==="checkbox"||i==="radio")}function Ne(n){var i=Le(n)?"checked":"value",o=Object.getOwnPropertyDescriptor(n.constructor.prototype,i),u=""+n[i];if(!n.hasOwnProperty(i)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var d=o.get,m=o.set;return Object.defineProperty(n,i,{configurable:!0,get:function(){return d.call(this)},set:function(E){u=""+E,m.call(this,E)}}),Object.defineProperty(n,i,{enumerable:o.enumerable}),{getValue:function(){return u},setValue:function(E){u=""+E},stopTracking:function(){n._valueTracker=null,delete n[i]}}}}function pt(n){n._valueTracker||(n._valueTracker=Ne(n))}function Qt(n){if(!n)return!1;var i=n._valueTracker;if(!i)return!0;var o=i.getValue(),u="";return n&&(u=Le(n)?n.checked?"true":"false":n.value),n=u,n!==o?(i.setValue(n),!0):!1}function N(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function Pt(n,i){var o=i.checked;return se({},i,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:o??n._wrapperState.initialChecked})}function ct(n,i){var o=i.defaultValue==null?"":i.defaultValue,u=i.checked!=null?i.checked:i.defaultChecked;o=Me(i.value!=null?i.value:o),n._wrapperState={initialChecked:u,initialValue:o,controlled:i.type==="checkbox"||i.type==="radio"?i.checked!=null:i.value!=null}}function it(n,i){i=i.checked,i!=null&&L(n,"checked",i,!1)}function Ve(n,i){it(n,i);var o=Me(i.value),u=i.type;if(o!=null)u==="number"?(o===0&&n.value===""||n.value!=o)&&(n.value=""+o):n.value!==""+o&&(n.value=""+o);else if(u==="submit"||u==="reset"){n.removeAttribute("value");return}i.hasOwnProperty("value")?Ge(n,i.type,o):i.hasOwnProperty("defaultValue")&&Ge(n,i.type,Me(i.defaultValue)),i.checked==null&&i.defaultChecked!=null&&(n.defaultChecked=!!i.defaultChecked)}function Ut(n,i,o){if(i.hasOwnProperty("value")||i.hasOwnProperty("defaultValue")){var u=i.type;if(!(u!=="submit"&&u!=="reset"||i.value!==void 0&&i.value!==null))return;i=""+n._wrapperState.initialValue,o||i===n.value||(n.value=i),n.defaultValue=i}o=n.name,o!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,o!==""&&(n.name=o)}function Ge(n,i,o){(i!=="number"||N(n.ownerDocument)!==n)&&(o==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+o&&(n.defaultValue=""+o))}var lt=Array.isArray;function zt(n,i,o,u){if(n=n.options,i){i={};for(var d=0;d<o.length;d++)i["$"+o[d]]=!0;for(o=0;o<n.length;o++)d=i.hasOwnProperty("$"+n[o].value),n[o].selected!==d&&(n[o].selected=d),d&&u&&(n[o].defaultSelected=!0)}else{for(o=""+Me(o),i=null,d=0;d<n.length;d++){if(n[d].value===o){n[d].selected=!0,u&&(n[d].defaultSelected=!0);return}i!==null||n[d].disabled||(i=n[d])}i!==null&&(i.selected=!0)}}function kt(n,i){if(i.dangerouslySetInnerHTML!=null)throw Error(t(91));return se({},i,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function P(n,i){var o=i.value;if(o==null){if(o=i.children,i=i.defaultValue,o!=null){if(i!=null)throw Error(t(92));if(lt(o)){if(1<o.length)throw Error(t(93));o=o[0]}i=o}i==null&&(i=""),o=i}n._wrapperState={initialValue:Me(o)}}function T(n,i){var o=Me(i.value),u=Me(i.defaultValue);o!=null&&(o=""+o,o!==n.value&&(n.value=o),i.defaultValue==null&&n.defaultValue!==o&&(n.defaultValue=o)),u!=null&&(n.defaultValue=""+u)}function Z(n){var i=n.textContent;i===n._wrapperState.initialValue&&i!==""&&i!==null&&(n.value=i)}function de(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function ge(n,i){return n==null||n==="http://www.w3.org/1999/xhtml"?de(i):n==="http://www.w3.org/2000/svg"&&i==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var le,$e=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(i,o,u,d){MSApp.execUnsafeLocalFunction(function(){return n(i,o,u,d)})}:n})(function(n,i){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=i;else{for(le=le||document.createElement("div"),le.innerHTML="<svg>"+i.valueOf().toString()+"</svg>",i=le.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;i.firstChild;)n.appendChild(i.firstChild)}});function we(n,i){if(i){var o=n.firstChild;if(o&&o===n.lastChild&&o.nodeType===3){o.nodeValue=i;return}}n.textContent=i}var ze={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Ke=["Webkit","ms","Moz","O"];Object.keys(ze).forEach(function(n){Ke.forEach(function(i){i=i+n.charAt(0).toUpperCase()+n.substring(1),ze[i]=ze[n]})});function Ee(n,i,o){return i==null||typeof i=="boolean"||i===""?"":o||typeof i!="number"||i===0||ze.hasOwnProperty(n)&&ze[n]?(""+i).trim():i+"px"}function Pe(n,i){n=n.style;for(var o in i)if(i.hasOwnProperty(o)){var u=o.indexOf("--")===0,d=Ee(o,i[o],u);o==="float"&&(o="cssFloat"),u?n.setProperty(o,d):n[o]=d}}var rt=se({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ye(n,i){if(i){if(rt[n]&&(i.children!=null||i.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(i.dangerouslySetInnerHTML!=null){if(i.children!=null)throw Error(t(60));if(typeof i.dangerouslySetInnerHTML!="object"||!("__html"in i.dangerouslySetInnerHTML))throw Error(t(61))}if(i.style!=null&&typeof i.style!="object")throw Error(t(62))}}function Re(n,i){if(n.indexOf("-")===-1)return typeof i.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ft=null;function V(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var ye=null,Ae=null,De=null;function xe(n){if(n=Co(n)){if(typeof ye!="function")throw Error(t(280));var i=n.stateNode;i&&(i=Da(i),ye(n.stateNode,n.type,i))}}function pe(n){Ae?De?De.push(n):De=[n]:Ae=n}function We(){if(Ae){var n=Ae,i=De;if(De=Ae=null,xe(n),i)for(n=0;n<i.length;n++)xe(i[n])}}function ut(n,i){return n(i)}function Ct(){}var Mt=!1;function Qn(n,i,o){if(Mt)return n(i,o);Mt=!0;try{return ut(n,i,o)}finally{Mt=!1,(Ae!==null||De!==null)&&(Ct(),We())}}function pn(n,i){var o=n.stateNode;if(o===null)return null;var u=Da(o);if(u===null)return null;o=u[i];e:switch(i){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(u=!u.disabled)||(n=n.type,u=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!u;break e;default:n=!1}if(n)return null;if(o&&typeof o!="function")throw Error(t(231,i,typeof o));return o}var fs=!1;if(f)try{var Hn={};Object.defineProperty(Hn,"passive",{get:function(){fs=!0}}),window.addEventListener("test",Hn,Hn),window.removeEventListener("test",Hn,Hn)}catch{fs=!1}function co(n,i,o,u,d,m,E,D,k){var J=Array.prototype.slice.call(arguments,3);try{i.apply(o,J)}catch(ve){this.onError(ve)}}var Qi=!1,Dr=null,Di=!1,ds=null,hs={onError:function(n){Qi=!0,Dr=n}};function fa(n,i,o,u,d,m,E,D,k){Qi=!1,Dr=null,co.apply(hs,arguments)}function da(n,i,o,u,d,m,E,D,k){if(fa.apply(this,arguments),Qi){if(Qi){var J=Dr;Qi=!1,Dr=null}else throw Error(t(198));Di||(Di=!0,ds=J)}}function Ii(n){var i=n,o=n;if(n.alternate)for(;i.return;)i=i.return;else{n=i;do i=n,(i.flags&4098)!==0&&(o=i.return),n=i.return;while(n)}return i.tag===3?o:null}function ha(n){if(n.tag===13){var i=n.memoizedState;if(i===null&&(n=n.alternate,n!==null&&(i=n.memoizedState)),i!==null)return i.dehydrated}return null}function pa(n){if(Ii(n)!==n)throw Error(t(188))}function ou(n){var i=n.alternate;if(!i){if(i=Ii(n),i===null)throw Error(t(188));return i!==n?null:n}for(var o=n,u=i;;){var d=o.return;if(d===null)break;var m=d.alternate;if(m===null){if(u=d.return,u!==null){o=u;continue}break}if(d.child===m.child){for(m=d.child;m;){if(m===o)return pa(d),n;if(m===u)return pa(d),i;m=m.sibling}throw Error(t(188))}if(o.return!==u.return)o=d,u=m;else{for(var E=!1,D=d.child;D;){if(D===o){E=!0,o=d,u=m;break}if(D===u){E=!0,u=d,o=m;break}D=D.sibling}if(!E){for(D=m.child;D;){if(D===o){E=!0,o=m,u=d;break}if(D===u){E=!0,u=m,o=d;break}D=D.sibling}if(!E)throw Error(t(189))}}if(o.alternate!==u)throw Error(t(190))}if(o.tag!==3)throw Error(t(188));return o.stateNode.current===o?n:i}function ma(n){return n=ou(n),n!==null?ga(n):null}function ga(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var i=ga(n);if(i!==null)return i;n=n.sibling}return null}var A=e.unstable_scheduleCallback,Y=e.unstable_cancelCallback,ne=e.unstable_shouldYield,ie=e.unstable_requestPaint,W=e.unstable_now,Se=e.unstable_getCurrentPriorityLevel,Ce=e.unstable_ImmediatePriority,ke=e.unstable_UserBlockingPriority,Ie=e.unstable_NormalPriority,nt=e.unstable_LowPriority,st=e.unstable_IdlePriority,Ze=null,ot=null;function Rt(n){if(ot&&typeof ot.onCommitFiberRoot=="function")try{ot.onCommitFiberRoot(Ze,n,void 0,(n.current.flags&128)===128)}catch{}}var Et=Math.clz32?Math.clz32:Je,Nt=Math.log,bt=Math.LN2;function Je(n){return n>>>=0,n===0?32:31-(Nt(n)/bt|0)|0}var Lt=64,gt=4194304;function Jt(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function oi(n,i){var o=n.pendingLanes;if(o===0)return 0;var u=0,d=n.suspendedLanes,m=n.pingedLanes,E=o&268435455;if(E!==0){var D=E&~d;D!==0?u=Jt(D):(m&=E,m!==0&&(u=Jt(m)))}else E=o&~d,E!==0?u=Jt(E):m!==0&&(u=Jt(m));if(u===0)return 0;if(i!==0&&i!==u&&(i&d)===0&&(d=u&-u,m=i&-i,d>=m||d===16&&(m&4194240)!==0))return i;if((u&4)!==0&&(u|=o&16),i=n.entangledLanes,i!==0)for(n=n.entanglements,i&=u;0<i;)o=31-Et(i),d=1<<o,u|=n[o],i&=~d;return u}function En(n,i){switch(n){case 1:case 2:case 4:return i+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return i+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ir(n,i){for(var o=n.suspendedLanes,u=n.pingedLanes,d=n.expirationTimes,m=n.pendingLanes;0<m;){var E=31-Et(m),D=1<<E,k=d[E];k===-1?((D&o)===0||(D&u)!==0)&&(d[E]=En(D,i)):k<=i&&(n.expiredLanes|=D),m&=~D}}function Ft(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Tn(){var n=Lt;return Lt<<=1,(Lt&4194240)===0&&(Lt=64),n}function mn(n){for(var i=[],o=0;31>o;o++)i.push(n);return i}function Yt(n,i,o){n.pendingLanes|=i,i!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,i=31-Et(i),n[i]=o}function gn(n,i){var o=n.pendingLanes&~i;n.pendingLanes=i,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=i,n.mutableReadLanes&=i,n.entangledLanes&=i,i=n.entanglements;var u=n.eventTimes;for(n=n.expirationTimes;0<o;){var d=31-Et(o),m=1<<d;i[d]=0,u[d]=-1,n[d]=-1,o&=~m}}function Ur(n,i){var o=n.entangledLanes|=i;for(n=n.entanglements;o;){var u=31-Et(o),d=1<<u;d&i|n[u]&i&&(n[u]|=i),o&=~d}}var vt=0;function bd(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var Pd,au,Ld,Dd,Id,lu=!1,va=[],Ji=null,er=null,tr=null,fo=new Map,ho=new Map,nr=[],Qg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ud(n,i){switch(n){case"focusin":case"focusout":Ji=null;break;case"dragenter":case"dragleave":er=null;break;case"mouseover":case"mouseout":tr=null;break;case"pointerover":case"pointerout":fo.delete(i.pointerId);break;case"gotpointercapture":case"lostpointercapture":ho.delete(i.pointerId)}}function po(n,i,o,u,d,m){return n===null||n.nativeEvent!==m?(n={blockedOn:i,domEventName:o,eventSystemFlags:u,nativeEvent:m,targetContainers:[d]},i!==null&&(i=Co(i),i!==null&&au(i)),n):(n.eventSystemFlags|=u,i=n.targetContainers,d!==null&&i.indexOf(d)===-1&&i.push(d),n)}function Jg(n,i,o,u,d){switch(i){case"focusin":return Ji=po(Ji,n,i,o,u,d),!0;case"dragenter":return er=po(er,n,i,o,u,d),!0;case"mouseover":return tr=po(tr,n,i,o,u,d),!0;case"pointerover":var m=d.pointerId;return fo.set(m,po(fo.get(m)||null,n,i,o,u,d)),!0;case"gotpointercapture":return m=d.pointerId,ho.set(m,po(ho.get(m)||null,n,i,o,u,d)),!0}return!1}function Nd(n){var i=Nr(n.target);if(i!==null){var o=Ii(i);if(o!==null){if(i=o.tag,i===13){if(i=ha(o),i!==null){n.blockedOn=i,Id(n.priority,function(){Ld(o)});return}}else if(i===3&&o.stateNode.current.memoizedState.isDehydrated){n.blockedOn=o.tag===3?o.stateNode.containerInfo:null;return}}}n.blockedOn=null}function _a(n){if(n.blockedOn!==null)return!1;for(var i=n.targetContainers;0<i.length;){var o=cu(n.domEventName,n.eventSystemFlags,i[0],n.nativeEvent);if(o===null){o=n.nativeEvent;var u=new o.constructor(o.type,o);ft=u,o.target.dispatchEvent(u),ft=null}else return i=Co(o),i!==null&&au(i),n.blockedOn=o,!1;i.shift()}return!0}function Fd(n,i,o){_a(n)&&o.delete(i)}function e0(){lu=!1,Ji!==null&&_a(Ji)&&(Ji=null),er!==null&&_a(er)&&(er=null),tr!==null&&_a(tr)&&(tr=null),fo.forEach(Fd),ho.forEach(Fd)}function mo(n,i){n.blockedOn===i&&(n.blockedOn=null,lu||(lu=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,e0)))}function go(n){function i(d){return mo(d,n)}if(0<va.length){mo(va[0],n);for(var o=1;o<va.length;o++){var u=va[o];u.blockedOn===n&&(u.blockedOn=null)}}for(Ji!==null&&mo(Ji,n),er!==null&&mo(er,n),tr!==null&&mo(tr,n),fo.forEach(i),ho.forEach(i),o=0;o<nr.length;o++)u=nr[o],u.blockedOn===n&&(u.blockedOn=null);for(;0<nr.length&&(o=nr[0],o.blockedOn===null);)Nd(o),o.blockedOn===null&&nr.shift()}var ps=b.ReactCurrentBatchConfig,xa=!0;function t0(n,i,o,u){var d=vt,m=ps.transition;ps.transition=null;try{vt=1,uu(n,i,o,u)}finally{vt=d,ps.transition=m}}function n0(n,i,o,u){var d=vt,m=ps.transition;ps.transition=null;try{vt=4,uu(n,i,o,u)}finally{vt=d,ps.transition=m}}function uu(n,i,o,u){if(xa){var d=cu(n,i,o,u);if(d===null)Ru(n,i,u,ya,o),Ud(n,u);else if(Jg(d,n,i,o,u))u.stopPropagation();else if(Ud(n,u),i&4&&-1<Qg.indexOf(n)){for(;d!==null;){var m=Co(d);if(m!==null&&Pd(m),m=cu(n,i,o,u),m===null&&Ru(n,i,u,ya,o),m===d)break;d=m}d!==null&&u.stopPropagation()}else Ru(n,i,u,null,o)}}var ya=null;function cu(n,i,o,u){if(ya=null,n=V(u),n=Nr(n),n!==null)if(i=Ii(n),i===null)n=null;else if(o=i.tag,o===13){if(n=ha(i),n!==null)return n;n=null}else if(o===3){if(i.stateNode.current.memoizedState.isDehydrated)return i.tag===3?i.stateNode.containerInfo:null;n=null}else i!==n&&(n=null);return ya=n,null}function Od(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Se()){case Ce:return 1;case ke:return 4;case Ie:case nt:return 16;case st:return 536870912;default:return 16}default:return 16}}var ir=null,fu=null,Sa=null;function zd(){if(Sa)return Sa;var n,i=fu,o=i.length,u,d="value"in ir?ir.value:ir.textContent,m=d.length;for(n=0;n<o&&i[n]===d[n];n++);var E=o-n;for(u=1;u<=E&&i[o-u]===d[m-u];u++);return Sa=d.slice(n,1<u?1-u:void 0)}function Ma(n){var i=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&i===13&&(n=13)):n=i,n===10&&(n=13),32<=n||n===13?n:0}function Ea(){return!0}function kd(){return!1}function Vn(n){function i(o,u,d,m,E){this._reactName=o,this._targetInst=d,this.type=u,this.nativeEvent=m,this.target=E,this.currentTarget=null;for(var D in n)n.hasOwnProperty(D)&&(o=n[D],this[D]=o?o(m):m[D]);return this.isDefaultPrevented=(m.defaultPrevented!=null?m.defaultPrevented:m.returnValue===!1)?Ea:kd,this.isPropagationStopped=kd,this}return se(i.prototype,{preventDefault:function(){this.defaultPrevented=!0;var o=this.nativeEvent;o&&(o.preventDefault?o.preventDefault():typeof o.returnValue!="unknown"&&(o.returnValue=!1),this.isDefaultPrevented=Ea)},stopPropagation:function(){var o=this.nativeEvent;o&&(o.stopPropagation?o.stopPropagation():typeof o.cancelBubble!="unknown"&&(o.cancelBubble=!0),this.isPropagationStopped=Ea)},persist:function(){},isPersistent:Ea}),i}var ms={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},du=Vn(ms),vo=se({},ms,{view:0,detail:0}),i0=Vn(vo),hu,pu,_o,Ta=se({},vo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:gu,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==_o&&(_o&&n.type==="mousemove"?(hu=n.screenX-_o.screenX,pu=n.screenY-_o.screenY):pu=hu=0,_o=n),hu)},movementY:function(n){return"movementY"in n?n.movementY:pu}}),Bd=Vn(Ta),r0=se({},Ta,{dataTransfer:0}),s0=Vn(r0),o0=se({},vo,{relatedTarget:0}),mu=Vn(o0),a0=se({},ms,{animationName:0,elapsedTime:0,pseudoElement:0}),l0=Vn(a0),u0=se({},ms,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),c0=Vn(u0),f0=se({},ms,{data:0}),Hd=Vn(f0),d0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},h0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},p0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function m0(n){var i=this.nativeEvent;return i.getModifierState?i.getModifierState(n):(n=p0[n])?!!i[n]:!1}function gu(){return m0}var g0=se({},vo,{key:function(n){if(n.key){var i=d0[n.key]||n.key;if(i!=="Unidentified")return i}return n.type==="keypress"?(n=Ma(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?h0[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:gu,charCode:function(n){return n.type==="keypress"?Ma(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?Ma(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),v0=Vn(g0),_0=se({},Ta,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Vd=Vn(_0),x0=se({},vo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:gu}),y0=Vn(x0),S0=se({},ms,{propertyName:0,elapsedTime:0,pseudoElement:0}),M0=Vn(S0),E0=se({},Ta,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),T0=Vn(E0),w0=[9,13,27,32],vu=f&&"CompositionEvent"in window,xo=null;f&&"documentMode"in document&&(xo=document.documentMode);var A0=f&&"TextEvent"in window&&!xo,Gd=f&&(!vu||xo&&8<xo&&11>=xo),Wd=" ",Xd=!1;function jd(n,i){switch(n){case"keyup":return w0.indexOf(i.keyCode)!==-1;case"keydown":return i.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Yd(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var gs=!1;function R0(n,i){switch(n){case"compositionend":return Yd(i);case"keypress":return i.which!==32?null:(Xd=!0,Wd);case"textInput":return n=i.data,n===Wd&&Xd?null:n;default:return null}}function C0(n,i){if(gs)return n==="compositionend"||!vu&&jd(n,i)?(n=zd(),Sa=fu=ir=null,gs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(i.ctrlKey||i.altKey||i.metaKey)||i.ctrlKey&&i.altKey){if(i.char&&1<i.char.length)return i.char;if(i.which)return String.fromCharCode(i.which)}return null;case"compositionend":return Gd&&i.locale!=="ko"?null:i.data;default:return null}}var b0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function qd(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i==="input"?!!b0[n.type]:i==="textarea"}function $d(n,i,o,u){pe(u),i=ba(i,"onChange"),0<i.length&&(o=new du("onChange","change",null,o,u),n.push({event:o,listeners:i}))}var yo=null,So=null;function P0(n){hh(n,0)}function wa(n){var i=Ss(n);if(Qt(i))return n}function L0(n,i){if(n==="change")return i}var Kd=!1;if(f){var _u;if(f){var xu="oninput"in document;if(!xu){var Zd=document.createElement("div");Zd.setAttribute("oninput","return;"),xu=typeof Zd.oninput=="function"}_u=xu}else _u=!1;Kd=_u&&(!document.documentMode||9<document.documentMode)}function Qd(){yo&&(yo.detachEvent("onpropertychange",Jd),So=yo=null)}function Jd(n){if(n.propertyName==="value"&&wa(So)){var i=[];$d(i,So,n,V(n)),Qn(P0,i)}}function D0(n,i,o){n==="focusin"?(Qd(),yo=i,So=o,yo.attachEvent("onpropertychange",Jd)):n==="focusout"&&Qd()}function I0(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return wa(So)}function U0(n,i){if(n==="click")return wa(i)}function N0(n,i){if(n==="input"||n==="change")return wa(i)}function F0(n,i){return n===i&&(n!==0||1/n===1/i)||n!==n&&i!==i}var ai=typeof Object.is=="function"?Object.is:F0;function Mo(n,i){if(ai(n,i))return!0;if(typeof n!="object"||n===null||typeof i!="object"||i===null)return!1;var o=Object.keys(n),u=Object.keys(i);if(o.length!==u.length)return!1;for(u=0;u<o.length;u++){var d=o[u];if(!h.call(i,d)||!ai(n[d],i[d]))return!1}return!0}function eh(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function th(n,i){var o=eh(n);n=0;for(var u;o;){if(o.nodeType===3){if(u=n+o.textContent.length,n<=i&&u>=i)return{node:o,offset:i-n};n=u}e:{for(;o;){if(o.nextSibling){o=o.nextSibling;break e}o=o.parentNode}o=void 0}o=eh(o)}}function nh(n,i){return n&&i?n===i?!0:n&&n.nodeType===3?!1:i&&i.nodeType===3?nh(n,i.parentNode):"contains"in n?n.contains(i):n.compareDocumentPosition?!!(n.compareDocumentPosition(i)&16):!1:!1}function ih(){for(var n=window,i=N();i instanceof n.HTMLIFrameElement;){try{var o=typeof i.contentWindow.location.href=="string"}catch{o=!1}if(o)n=i.contentWindow;else break;i=N(n.document)}return i}function yu(n){var i=n&&n.nodeName&&n.nodeName.toLowerCase();return i&&(i==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||i==="textarea"||n.contentEditable==="true")}function O0(n){var i=ih(),o=n.focusedElem,u=n.selectionRange;if(i!==o&&o&&o.ownerDocument&&nh(o.ownerDocument.documentElement,o)){if(u!==null&&yu(o)){if(i=u.start,n=u.end,n===void 0&&(n=i),"selectionStart"in o)o.selectionStart=i,o.selectionEnd=Math.min(n,o.value.length);else if(n=(i=o.ownerDocument||document)&&i.defaultView||window,n.getSelection){n=n.getSelection();var d=o.textContent.length,m=Math.min(u.start,d);u=u.end===void 0?m:Math.min(u.end,d),!n.extend&&m>u&&(d=u,u=m,m=d),d=th(o,m);var E=th(o,u);d&&E&&(n.rangeCount!==1||n.anchorNode!==d.node||n.anchorOffset!==d.offset||n.focusNode!==E.node||n.focusOffset!==E.offset)&&(i=i.createRange(),i.setStart(d.node,d.offset),n.removeAllRanges(),m>u?(n.addRange(i),n.extend(E.node,E.offset)):(i.setEnd(E.node,E.offset),n.addRange(i)))}}for(i=[],n=o;n=n.parentNode;)n.nodeType===1&&i.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof o.focus=="function"&&o.focus(),o=0;o<i.length;o++)n=i[o],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var z0=f&&"documentMode"in document&&11>=document.documentMode,vs=null,Su=null,Eo=null,Mu=!1;function rh(n,i,o){var u=o.window===o?o.document:o.nodeType===9?o:o.ownerDocument;Mu||vs==null||vs!==N(u)||(u=vs,"selectionStart"in u&&yu(u)?u={start:u.selectionStart,end:u.selectionEnd}:(u=(u.ownerDocument&&u.ownerDocument.defaultView||window).getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}),Eo&&Mo(Eo,u)||(Eo=u,u=ba(Su,"onSelect"),0<u.length&&(i=new du("onSelect","select",null,i,o),n.push({event:i,listeners:u}),i.target=vs)))}function Aa(n,i){var o={};return o[n.toLowerCase()]=i.toLowerCase(),o["Webkit"+n]="webkit"+i,o["Moz"+n]="moz"+i,o}var _s={animationend:Aa("Animation","AnimationEnd"),animationiteration:Aa("Animation","AnimationIteration"),animationstart:Aa("Animation","AnimationStart"),transitionend:Aa("Transition","TransitionEnd")},Eu={},sh={};f&&(sh=document.createElement("div").style,"AnimationEvent"in window||(delete _s.animationend.animation,delete _s.animationiteration.animation,delete _s.animationstart.animation),"TransitionEvent"in window||delete _s.transitionend.transition);function Ra(n){if(Eu[n])return Eu[n];if(!_s[n])return n;var i=_s[n],o;for(o in i)if(i.hasOwnProperty(o)&&o in sh)return Eu[n]=i[o];return n}var oh=Ra("animationend"),ah=Ra("animationiteration"),lh=Ra("animationstart"),uh=Ra("transitionend"),ch=new Map,fh="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function rr(n,i){ch.set(n,i),l(i,[n])}for(var Tu=0;Tu<fh.length;Tu++){var wu=fh[Tu],k0=wu.toLowerCase(),B0=wu[0].toUpperCase()+wu.slice(1);rr(k0,"on"+B0)}rr(oh,"onAnimationEnd"),rr(ah,"onAnimationIteration"),rr(lh,"onAnimationStart"),rr("dblclick","onDoubleClick"),rr("focusin","onFocus"),rr("focusout","onBlur"),rr(uh,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),l("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),l("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),l("onBeforeInput",["compositionend","keypress","textInput","paste"]),l("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),l("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var To="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),H0=new Set("cancel close invalid load scroll toggle".split(" ").concat(To));function dh(n,i,o){var u=n.type||"unknown-event";n.currentTarget=o,da(u,i,void 0,n),n.currentTarget=null}function hh(n,i){i=(i&4)!==0;for(var o=0;o<n.length;o++){var u=n[o],d=u.event;u=u.listeners;e:{var m=void 0;if(i)for(var E=u.length-1;0<=E;E--){var D=u[E],k=D.instance,J=D.currentTarget;if(D=D.listener,k!==m&&d.isPropagationStopped())break e;dh(d,D,J),m=k}else for(E=0;E<u.length;E++){if(D=u[E],k=D.instance,J=D.currentTarget,D=D.listener,k!==m&&d.isPropagationStopped())break e;dh(d,D,J),m=k}}}if(Di)throw n=ds,Di=!1,ds=null,n}function Bt(n,i){var o=i[Iu];o===void 0&&(o=i[Iu]=new Set);var u=n+"__bubble";o.has(u)||(ph(i,n,2,!1),o.add(u))}function Au(n,i,o){var u=0;i&&(u|=4),ph(o,n,u,i)}var Ca="_reactListening"+Math.random().toString(36).slice(2);function wo(n){if(!n[Ca]){n[Ca]=!0,r.forEach(function(o){o!=="selectionchange"&&(H0.has(o)||Au(o,!1,n),Au(o,!0,n))});var i=n.nodeType===9?n:n.ownerDocument;i===null||i[Ca]||(i[Ca]=!0,Au("selectionchange",!1,i))}}function ph(n,i,o,u){switch(Od(i)){case 1:var d=t0;break;case 4:d=n0;break;default:d=uu}o=d.bind(null,i,o,n),d=void 0,!fs||i!=="touchstart"&&i!=="touchmove"&&i!=="wheel"||(d=!0),u?d!==void 0?n.addEventListener(i,o,{capture:!0,passive:d}):n.addEventListener(i,o,!0):d!==void 0?n.addEventListener(i,o,{passive:d}):n.addEventListener(i,o,!1)}function Ru(n,i,o,u,d){var m=u;if((i&1)===0&&(i&2)===0&&u!==null)e:for(;;){if(u===null)return;var E=u.tag;if(E===3||E===4){var D=u.stateNode.containerInfo;if(D===d||D.nodeType===8&&D.parentNode===d)break;if(E===4)for(E=u.return;E!==null;){var k=E.tag;if((k===3||k===4)&&(k=E.stateNode.containerInfo,k===d||k.nodeType===8&&k.parentNode===d))return;E=E.return}for(;D!==null;){if(E=Nr(D),E===null)return;if(k=E.tag,k===5||k===6){u=m=E;continue e}D=D.parentNode}}u=u.return}Qn(function(){var J=m,ve=V(o),_e=[];e:{var me=ch.get(n);if(me!==void 0){var Ue=du,Be=n;switch(n){case"keypress":if(Ma(o)===0)break e;case"keydown":case"keyup":Ue=v0;break;case"focusin":Be="focus",Ue=mu;break;case"focusout":Be="blur",Ue=mu;break;case"beforeblur":case"afterblur":Ue=mu;break;case"click":if(o.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":Ue=Bd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":Ue=s0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":Ue=y0;break;case oh:case ah:case lh:Ue=l0;break;case uh:Ue=M0;break;case"scroll":Ue=i0;break;case"wheel":Ue=T0;break;case"copy":case"cut":case"paste":Ue=c0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":Ue=Vd}var je=(i&4)!==0,qt=!je&&n==="scroll",q=je?me!==null?me+"Capture":null:me;je=[];for(var G=J,Q;G!==null;){Q=G;var Te=Q.stateNode;if(Q.tag===5&&Te!==null&&(Q=Te,q!==null&&(Te=pn(G,q),Te!=null&&je.push(Ao(G,Te,Q)))),qt)break;G=G.return}0<je.length&&(me=new Ue(me,Be,null,o,ve),_e.push({event:me,listeners:je}))}}if((i&7)===0){e:{if(me=n==="mouseover"||n==="pointerover",Ue=n==="mouseout"||n==="pointerout",me&&o!==ft&&(Be=o.relatedTarget||o.fromElement)&&(Nr(Be)||Be[Ui]))break e;if((Ue||me)&&(me=ve.window===ve?ve:(me=ve.ownerDocument)?me.defaultView||me.parentWindow:window,Ue?(Be=o.relatedTarget||o.toElement,Ue=J,Be=Be?Nr(Be):null,Be!==null&&(qt=Ii(Be),Be!==qt||Be.tag!==5&&Be.tag!==6)&&(Be=null)):(Ue=null,Be=J),Ue!==Be)){if(je=Bd,Te="onMouseLeave",q="onMouseEnter",G="mouse",(n==="pointerout"||n==="pointerover")&&(je=Vd,Te="onPointerLeave",q="onPointerEnter",G="pointer"),qt=Ue==null?me:Ss(Ue),Q=Be==null?me:Ss(Be),me=new je(Te,G+"leave",Ue,o,ve),me.target=qt,me.relatedTarget=Q,Te=null,Nr(ve)===J&&(je=new je(q,G+"enter",Be,o,ve),je.target=Q,je.relatedTarget=qt,Te=je),qt=Te,Ue&&Be)t:{for(je=Ue,q=Be,G=0,Q=je;Q;Q=xs(Q))G++;for(Q=0,Te=q;Te;Te=xs(Te))Q++;for(;0<G-Q;)je=xs(je),G--;for(;0<Q-G;)q=xs(q),Q--;for(;G--;){if(je===q||q!==null&&je===q.alternate)break t;je=xs(je),q=xs(q)}je=null}else je=null;Ue!==null&&mh(_e,me,Ue,je,!1),Be!==null&&qt!==null&&mh(_e,qt,Be,je,!0)}}e:{if(me=J?Ss(J):window,Ue=me.nodeName&&me.nodeName.toLowerCase(),Ue==="select"||Ue==="input"&&me.type==="file")var qe=L0;else if(qd(me))if(Kd)qe=N0;else{qe=I0;var et=D0}else(Ue=me.nodeName)&&Ue.toLowerCase()==="input"&&(me.type==="checkbox"||me.type==="radio")&&(qe=U0);if(qe&&(qe=qe(n,J))){$d(_e,qe,o,ve);break e}et&&et(n,me,J),n==="focusout"&&(et=me._wrapperState)&&et.controlled&&me.type==="number"&&Ge(me,"number",me.value)}switch(et=J?Ss(J):window,n){case"focusin":(qd(et)||et.contentEditable==="true")&&(vs=et,Su=J,Eo=null);break;case"focusout":Eo=Su=vs=null;break;case"mousedown":Mu=!0;break;case"contextmenu":case"mouseup":case"dragend":Mu=!1,rh(_e,o,ve);break;case"selectionchange":if(z0)break;case"keydown":case"keyup":rh(_e,o,ve)}var tt;if(vu)e:{switch(n){case"compositionstart":var at="onCompositionStart";break e;case"compositionend":at="onCompositionEnd";break e;case"compositionupdate":at="onCompositionUpdate";break e}at=void 0}else gs?jd(n,o)&&(at="onCompositionEnd"):n==="keydown"&&o.keyCode===229&&(at="onCompositionStart");at&&(Gd&&o.locale!=="ko"&&(gs||at!=="onCompositionStart"?at==="onCompositionEnd"&&gs&&(tt=zd()):(ir=ve,fu="value"in ir?ir.value:ir.textContent,gs=!0)),et=ba(J,at),0<et.length&&(at=new Hd(at,n,null,o,ve),_e.push({event:at,listeners:et}),tt?at.data=tt:(tt=Yd(o),tt!==null&&(at.data=tt)))),(tt=A0?R0(n,o):C0(n,o))&&(J=ba(J,"onBeforeInput"),0<J.length&&(ve=new Hd("onBeforeInput","beforeinput",null,o,ve),_e.push({event:ve,listeners:J}),ve.data=tt))}hh(_e,i)})}function Ao(n,i,o){return{instance:n,listener:i,currentTarget:o}}function ba(n,i){for(var o=i+"Capture",u=[];n!==null;){var d=n,m=d.stateNode;d.tag===5&&m!==null&&(d=m,m=pn(n,o),m!=null&&u.unshift(Ao(n,m,d)),m=pn(n,i),m!=null&&u.push(Ao(n,m,d))),n=n.return}return u}function xs(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function mh(n,i,o,u,d){for(var m=i._reactName,E=[];o!==null&&o!==u;){var D=o,k=D.alternate,J=D.stateNode;if(k!==null&&k===u)break;D.tag===5&&J!==null&&(D=J,d?(k=pn(o,m),k!=null&&E.unshift(Ao(o,k,D))):d||(k=pn(o,m),k!=null&&E.push(Ao(o,k,D)))),o=o.return}E.length!==0&&n.push({event:i,listeners:E})}var V0=/\r\n?/g,G0=/\u0000|\uFFFD/g;function gh(n){return(typeof n=="string"?n:""+n).replace(V0,`
`).replace(G0,"")}function Pa(n,i,o){if(i=gh(i),gh(n)!==i&&o)throw Error(t(425))}function La(){}var Cu=null,bu=null;function Pu(n,i){return n==="textarea"||n==="noscript"||typeof i.children=="string"||typeof i.children=="number"||typeof i.dangerouslySetInnerHTML=="object"&&i.dangerouslySetInnerHTML!==null&&i.dangerouslySetInnerHTML.__html!=null}var Lu=typeof setTimeout=="function"?setTimeout:void 0,W0=typeof clearTimeout=="function"?clearTimeout:void 0,vh=typeof Promise=="function"?Promise:void 0,X0=typeof queueMicrotask=="function"?queueMicrotask:typeof vh<"u"?function(n){return vh.resolve(null).then(n).catch(j0)}:Lu;function j0(n){setTimeout(function(){throw n})}function Du(n,i){var o=i,u=0;do{var d=o.nextSibling;if(n.removeChild(o),d&&d.nodeType===8)if(o=d.data,o==="/$"){if(u===0){n.removeChild(d),go(i);return}u--}else o!=="$"&&o!=="$?"&&o!=="$!"||u++;o=d}while(o);go(i)}function sr(n){for(;n!=null;n=n.nextSibling){var i=n.nodeType;if(i===1||i===3)break;if(i===8){if(i=n.data,i==="$"||i==="$!"||i==="$?")break;if(i==="/$")return null}}return n}function _h(n){n=n.previousSibling;for(var i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="$"||o==="$!"||o==="$?"){if(i===0)return n;i--}else o==="/$"&&i++}n=n.previousSibling}return null}var ys=Math.random().toString(36).slice(2),yi="__reactFiber$"+ys,Ro="__reactProps$"+ys,Ui="__reactContainer$"+ys,Iu="__reactEvents$"+ys,Y0="__reactListeners$"+ys,q0="__reactHandles$"+ys;function Nr(n){var i=n[yi];if(i)return i;for(var o=n.parentNode;o;){if(i=o[Ui]||o[yi]){if(o=i.alternate,i.child!==null||o!==null&&o.child!==null)for(n=_h(n);n!==null;){if(o=n[yi])return o;n=_h(n)}return i}n=o,o=n.parentNode}return null}function Co(n){return n=n[yi]||n[Ui],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ss(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function Da(n){return n[Ro]||null}var Uu=[],Ms=-1;function or(n){return{current:n}}function Ht(n){0>Ms||(n.current=Uu[Ms],Uu[Ms]=null,Ms--)}function Ot(n,i){Ms++,Uu[Ms]=n.current,n.current=i}var ar={},vn=or(ar),Dn=or(!1),Fr=ar;function Es(n,i){var o=n.type.contextTypes;if(!o)return ar;var u=n.stateNode;if(u&&u.__reactInternalMemoizedUnmaskedChildContext===i)return u.__reactInternalMemoizedMaskedChildContext;var d={},m;for(m in o)d[m]=i[m];return u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=i,n.__reactInternalMemoizedMaskedChildContext=d),d}function In(n){return n=n.childContextTypes,n!=null}function Ia(){Ht(Dn),Ht(vn)}function xh(n,i,o){if(vn.current!==ar)throw Error(t(168));Ot(vn,i),Ot(Dn,o)}function yh(n,i,o){var u=n.stateNode;if(i=i.childContextTypes,typeof u.getChildContext!="function")return o;u=u.getChildContext();for(var d in u)if(!(d in i))throw Error(t(108,fe(n)||"Unknown",d));return se({},o,u)}function Ua(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||ar,Fr=vn.current,Ot(vn,n),Ot(Dn,Dn.current),!0}function Sh(n,i,o){var u=n.stateNode;if(!u)throw Error(t(169));o?(n=yh(n,i,Fr),u.__reactInternalMemoizedMergedChildContext=n,Ht(Dn),Ht(vn),Ot(vn,n)):Ht(Dn),Ot(Dn,o)}var Ni=null,Na=!1,Nu=!1;function Mh(n){Ni===null?Ni=[n]:Ni.push(n)}function $0(n){Na=!0,Mh(n)}function lr(){if(!Nu&&Ni!==null){Nu=!0;var n=0,i=vt;try{var o=Ni;for(vt=1;n<o.length;n++){var u=o[n];do u=u(!0);while(u!==null)}Ni=null,Na=!1}catch(d){throw Ni!==null&&(Ni=Ni.slice(n+1)),A(Ce,lr),d}finally{vt=i,Nu=!1}}return null}var Ts=[],ws=0,Fa=null,Oa=0,Jn=[],ei=0,Or=null,Fi=1,Oi="";function zr(n,i){Ts[ws++]=Oa,Ts[ws++]=Fa,Fa=n,Oa=i}function Eh(n,i,o){Jn[ei++]=Fi,Jn[ei++]=Oi,Jn[ei++]=Or,Or=n;var u=Fi;n=Oi;var d=32-Et(u)-1;u&=~(1<<d),o+=1;var m=32-Et(i)+d;if(30<m){var E=d-d%5;m=(u&(1<<E)-1).toString(32),u>>=E,d-=E,Fi=1<<32-Et(i)+d|o<<d|u,Oi=m+n}else Fi=1<<m|o<<d|u,Oi=n}function Fu(n){n.return!==null&&(zr(n,1),Eh(n,1,0))}function Ou(n){for(;n===Fa;)Fa=Ts[--ws],Ts[ws]=null,Oa=Ts[--ws],Ts[ws]=null;for(;n===Or;)Or=Jn[--ei],Jn[ei]=null,Oi=Jn[--ei],Jn[ei]=null,Fi=Jn[--ei],Jn[ei]=null}var Gn=null,Wn=null,Vt=!1,li=null;function Th(n,i){var o=ri(5,null,null,0);o.elementType="DELETED",o.stateNode=i,o.return=n,i=n.deletions,i===null?(n.deletions=[o],n.flags|=16):i.push(o)}function wh(n,i){switch(n.tag){case 5:var o=n.type;return i=i.nodeType!==1||o.toLowerCase()!==i.nodeName.toLowerCase()?null:i,i!==null?(n.stateNode=i,Gn=n,Wn=sr(i.firstChild),!0):!1;case 6:return i=n.pendingProps===""||i.nodeType!==3?null:i,i!==null?(n.stateNode=i,Gn=n,Wn=null,!0):!1;case 13:return i=i.nodeType!==8?null:i,i!==null?(o=Or!==null?{id:Fi,overflow:Oi}:null,n.memoizedState={dehydrated:i,treeContext:o,retryLane:1073741824},o=ri(18,null,null,0),o.stateNode=i,o.return=n,n.child=o,Gn=n,Wn=null,!0):!1;default:return!1}}function zu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function ku(n){if(Vt){var i=Wn;if(i){var o=i;if(!wh(n,i)){if(zu(n))throw Error(t(418));i=sr(o.nextSibling);var u=Gn;i&&wh(n,i)?Th(u,o):(n.flags=n.flags&-4097|2,Vt=!1,Gn=n)}}else{if(zu(n))throw Error(t(418));n.flags=n.flags&-4097|2,Vt=!1,Gn=n}}}function Ah(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Gn=n}function za(n){if(n!==Gn)return!1;if(!Vt)return Ah(n),Vt=!0,!1;var i;if((i=n.tag!==3)&&!(i=n.tag!==5)&&(i=n.type,i=i!=="head"&&i!=="body"&&!Pu(n.type,n.memoizedProps)),i&&(i=Wn)){if(zu(n))throw Rh(),Error(t(418));for(;i;)Th(n,i),i=sr(i.nextSibling)}if(Ah(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,i=0;n;){if(n.nodeType===8){var o=n.data;if(o==="/$"){if(i===0){Wn=sr(n.nextSibling);break e}i--}else o!=="$"&&o!=="$!"&&o!=="$?"||i++}n=n.nextSibling}Wn=null}}else Wn=Gn?sr(n.stateNode.nextSibling):null;return!0}function Rh(){for(var n=Wn;n;)n=sr(n.nextSibling)}function As(){Wn=Gn=null,Vt=!1}function Bu(n){li===null?li=[n]:li.push(n)}var K0=b.ReactCurrentBatchConfig;function bo(n,i,o){if(n=o.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(o._owner){if(o=o._owner,o){if(o.tag!==1)throw Error(t(309));var u=o.stateNode}if(!u)throw Error(t(147,n));var d=u,m=""+n;return i!==null&&i.ref!==null&&typeof i.ref=="function"&&i.ref._stringRef===m?i.ref:(i=function(E){var D=d.refs;E===null?delete D[m]:D[m]=E},i._stringRef=m,i)}if(typeof n!="string")throw Error(t(284));if(!o._owner)throw Error(t(290,n))}return n}function ka(n,i){throw n=Object.prototype.toString.call(i),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(i).join(", ")+"}":n))}function Ch(n){var i=n._init;return i(n._payload)}function bh(n){function i(q,G){if(n){var Q=q.deletions;Q===null?(q.deletions=[G],q.flags|=16):Q.push(G)}}function o(q,G){if(!n)return null;for(;G!==null;)i(q,G),G=G.sibling;return null}function u(q,G){for(q=new Map;G!==null;)G.key!==null?q.set(G.key,G):q.set(G.index,G),G=G.sibling;return q}function d(q,G){return q=gr(q,G),q.index=0,q.sibling=null,q}function m(q,G,Q){return q.index=Q,n?(Q=q.alternate,Q!==null?(Q=Q.index,Q<G?(q.flags|=2,G):Q):(q.flags|=2,G)):(q.flags|=1048576,G)}function E(q){return n&&q.alternate===null&&(q.flags|=2),q}function D(q,G,Q,Te){return G===null||G.tag!==6?(G=Lc(Q,q.mode,Te),G.return=q,G):(G=d(G,Q),G.return=q,G)}function k(q,G,Q,Te){var qe=Q.type;return qe===O?ve(q,G,Q.props.children,Te,Q.key):G!==null&&(G.elementType===qe||typeof qe=="object"&&qe!==null&&qe.$$typeof===oe&&Ch(qe)===G.type)?(Te=d(G,Q.props),Te.ref=bo(q,G,Q),Te.return=q,Te):(Te=ul(Q.type,Q.key,Q.props,null,q.mode,Te),Te.ref=bo(q,G,Q),Te.return=q,Te)}function J(q,G,Q,Te){return G===null||G.tag!==4||G.stateNode.containerInfo!==Q.containerInfo||G.stateNode.implementation!==Q.implementation?(G=Dc(Q,q.mode,Te),G.return=q,G):(G=d(G,Q.children||[]),G.return=q,G)}function ve(q,G,Q,Te,qe){return G===null||G.tag!==7?(G=jr(Q,q.mode,Te,qe),G.return=q,G):(G=d(G,Q),G.return=q,G)}function _e(q,G,Q){if(typeof G=="string"&&G!==""||typeof G=="number")return G=Lc(""+G,q.mode,Q),G.return=q,G;if(typeof G=="object"&&G!==null){switch(G.$$typeof){case z:return Q=ul(G.type,G.key,G.props,null,q.mode,Q),Q.ref=bo(q,null,G),Q.return=q,Q;case F:return G=Dc(G,q.mode,Q),G.return=q,G;case oe:var Te=G._init;return _e(q,Te(G._payload),Q)}if(lt(G)||ce(G))return G=jr(G,q.mode,Q,null),G.return=q,G;ka(q,G)}return null}function me(q,G,Q,Te){var qe=G!==null?G.key:null;if(typeof Q=="string"&&Q!==""||typeof Q=="number")return qe!==null?null:D(q,G,""+Q,Te);if(typeof Q=="object"&&Q!==null){switch(Q.$$typeof){case z:return Q.key===qe?k(q,G,Q,Te):null;case F:return Q.key===qe?J(q,G,Q,Te):null;case oe:return qe=Q._init,me(q,G,qe(Q._payload),Te)}if(lt(Q)||ce(Q))return qe!==null?null:ve(q,G,Q,Te,null);ka(q,Q)}return null}function Ue(q,G,Q,Te,qe){if(typeof Te=="string"&&Te!==""||typeof Te=="number")return q=q.get(Q)||null,D(G,q,""+Te,qe);if(typeof Te=="object"&&Te!==null){switch(Te.$$typeof){case z:return q=q.get(Te.key===null?Q:Te.key)||null,k(G,q,Te,qe);case F:return q=q.get(Te.key===null?Q:Te.key)||null,J(G,q,Te,qe);case oe:var et=Te._init;return Ue(q,G,Q,et(Te._payload),qe)}if(lt(Te)||ce(Te))return q=q.get(Q)||null,ve(G,q,Te,qe,null);ka(G,Te)}return null}function Be(q,G,Q,Te){for(var qe=null,et=null,tt=G,at=G=0,ln=null;tt!==null&&at<Q.length;at++){tt.index>at?(ln=tt,tt=null):ln=tt.sibling;var wt=me(q,tt,Q[at],Te);if(wt===null){tt===null&&(tt=ln);break}n&&tt&&wt.alternate===null&&i(q,tt),G=m(wt,G,at),et===null?qe=wt:et.sibling=wt,et=wt,tt=ln}if(at===Q.length)return o(q,tt),Vt&&zr(q,at),qe;if(tt===null){for(;at<Q.length;at++)tt=_e(q,Q[at],Te),tt!==null&&(G=m(tt,G,at),et===null?qe=tt:et.sibling=tt,et=tt);return Vt&&zr(q,at),qe}for(tt=u(q,tt);at<Q.length;at++)ln=Ue(tt,q,at,Q[at],Te),ln!==null&&(n&&ln.alternate!==null&&tt.delete(ln.key===null?at:ln.key),G=m(ln,G,at),et===null?qe=ln:et.sibling=ln,et=ln);return n&&tt.forEach(function(vr){return i(q,vr)}),Vt&&zr(q,at),qe}function je(q,G,Q,Te){var qe=ce(Q);if(typeof qe!="function")throw Error(t(150));if(Q=qe.call(Q),Q==null)throw Error(t(151));for(var et=qe=null,tt=G,at=G=0,ln=null,wt=Q.next();tt!==null&&!wt.done;at++,wt=Q.next()){tt.index>at?(ln=tt,tt=null):ln=tt.sibling;var vr=me(q,tt,wt.value,Te);if(vr===null){tt===null&&(tt=ln);break}n&&tt&&vr.alternate===null&&i(q,tt),G=m(vr,G,at),et===null?qe=vr:et.sibling=vr,et=vr,tt=ln}if(wt.done)return o(q,tt),Vt&&zr(q,at),qe;if(tt===null){for(;!wt.done;at++,wt=Q.next())wt=_e(q,wt.value,Te),wt!==null&&(G=m(wt,G,at),et===null?qe=wt:et.sibling=wt,et=wt);return Vt&&zr(q,at),qe}for(tt=u(q,tt);!wt.done;at++,wt=Q.next())wt=Ue(tt,q,at,wt.value,Te),wt!==null&&(n&&wt.alternate!==null&&tt.delete(wt.key===null?at:wt.key),G=m(wt,G,at),et===null?qe=wt:et.sibling=wt,et=wt);return n&&tt.forEach(function(bv){return i(q,bv)}),Vt&&zr(q,at),qe}function qt(q,G,Q,Te){if(typeof Q=="object"&&Q!==null&&Q.type===O&&Q.key===null&&(Q=Q.props.children),typeof Q=="object"&&Q!==null){switch(Q.$$typeof){case z:e:{for(var qe=Q.key,et=G;et!==null;){if(et.key===qe){if(qe=Q.type,qe===O){if(et.tag===7){o(q,et.sibling),G=d(et,Q.props.children),G.return=q,q=G;break e}}else if(et.elementType===qe||typeof qe=="object"&&qe!==null&&qe.$$typeof===oe&&Ch(qe)===et.type){o(q,et.sibling),G=d(et,Q.props),G.ref=bo(q,et,Q),G.return=q,q=G;break e}o(q,et);break}else i(q,et);et=et.sibling}Q.type===O?(G=jr(Q.props.children,q.mode,Te,Q.key),G.return=q,q=G):(Te=ul(Q.type,Q.key,Q.props,null,q.mode,Te),Te.ref=bo(q,G,Q),Te.return=q,q=Te)}return E(q);case F:e:{for(et=Q.key;G!==null;){if(G.key===et)if(G.tag===4&&G.stateNode.containerInfo===Q.containerInfo&&G.stateNode.implementation===Q.implementation){o(q,G.sibling),G=d(G,Q.children||[]),G.return=q,q=G;break e}else{o(q,G);break}else i(q,G);G=G.sibling}G=Dc(Q,q.mode,Te),G.return=q,q=G}return E(q);case oe:return et=Q._init,qt(q,G,et(Q._payload),Te)}if(lt(Q))return Be(q,G,Q,Te);if(ce(Q))return je(q,G,Q,Te);ka(q,Q)}return typeof Q=="string"&&Q!==""||typeof Q=="number"?(Q=""+Q,G!==null&&G.tag===6?(o(q,G.sibling),G=d(G,Q),G.return=q,q=G):(o(q,G),G=Lc(Q,q.mode,Te),G.return=q,q=G),E(q)):o(q,G)}return qt}var Rs=bh(!0),Ph=bh(!1),Ba=or(null),Ha=null,Cs=null,Hu=null;function Vu(){Hu=Cs=Ha=null}function Gu(n){var i=Ba.current;Ht(Ba),n._currentValue=i}function Wu(n,i,o){for(;n!==null;){var u=n.alternate;if((n.childLanes&i)!==i?(n.childLanes|=i,u!==null&&(u.childLanes|=i)):u!==null&&(u.childLanes&i)!==i&&(u.childLanes|=i),n===o)break;n=n.return}}function bs(n,i){Ha=n,Hu=Cs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&i)!==0&&(Un=!0),n.firstContext=null)}function ti(n){var i=n._currentValue;if(Hu!==n)if(n={context:n,memoizedValue:i,next:null},Cs===null){if(Ha===null)throw Error(t(308));Cs=n,Ha.dependencies={lanes:0,firstContext:n}}else Cs=Cs.next=n;return i}var kr=null;function Xu(n){kr===null?kr=[n]:kr.push(n)}function Lh(n,i,o,u){var d=i.interleaved;return d===null?(o.next=o,Xu(i)):(o.next=d.next,d.next=o),i.interleaved=o,zi(n,u)}function zi(n,i){n.lanes|=i;var o=n.alternate;for(o!==null&&(o.lanes|=i),o=n,n=n.return;n!==null;)n.childLanes|=i,o=n.alternate,o!==null&&(o.childLanes|=i),o=n,n=n.return;return o.tag===3?o.stateNode:null}var ur=!1;function ju(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Dh(n,i){n=n.updateQueue,i.updateQueue===n&&(i.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function ki(n,i){return{eventTime:n,lane:i,tag:0,payload:null,callback:null,next:null}}function cr(n,i,o){var u=n.updateQueue;if(u===null)return null;if(u=u.shared,(Tt&2)!==0){var d=u.pending;return d===null?i.next=i:(i.next=d.next,d.next=i),u.pending=i,zi(n,o)}return d=u.interleaved,d===null?(i.next=i,Xu(u)):(i.next=d.next,d.next=i),u.interleaved=i,zi(n,o)}function Va(n,i,o){if(i=i.updateQueue,i!==null&&(i=i.shared,(o&4194240)!==0)){var u=i.lanes;u&=n.pendingLanes,o|=u,i.lanes=o,Ur(n,o)}}function Ih(n,i){var o=n.updateQueue,u=n.alternate;if(u!==null&&(u=u.updateQueue,o===u)){var d=null,m=null;if(o=o.firstBaseUpdate,o!==null){do{var E={eventTime:o.eventTime,lane:o.lane,tag:o.tag,payload:o.payload,callback:o.callback,next:null};m===null?d=m=E:m=m.next=E,o=o.next}while(o!==null);m===null?d=m=i:m=m.next=i}else d=m=i;o={baseState:u.baseState,firstBaseUpdate:d,lastBaseUpdate:m,shared:u.shared,effects:u.effects},n.updateQueue=o;return}n=o.lastBaseUpdate,n===null?o.firstBaseUpdate=i:n.next=i,o.lastBaseUpdate=i}function Ga(n,i,o,u){var d=n.updateQueue;ur=!1;var m=d.firstBaseUpdate,E=d.lastBaseUpdate,D=d.shared.pending;if(D!==null){d.shared.pending=null;var k=D,J=k.next;k.next=null,E===null?m=J:E.next=J,E=k;var ve=n.alternate;ve!==null&&(ve=ve.updateQueue,D=ve.lastBaseUpdate,D!==E&&(D===null?ve.firstBaseUpdate=J:D.next=J,ve.lastBaseUpdate=k))}if(m!==null){var _e=d.baseState;E=0,ve=J=k=null,D=m;do{var me=D.lane,Ue=D.eventTime;if((u&me)===me){ve!==null&&(ve=ve.next={eventTime:Ue,lane:0,tag:D.tag,payload:D.payload,callback:D.callback,next:null});e:{var Be=n,je=D;switch(me=i,Ue=o,je.tag){case 1:if(Be=je.payload,typeof Be=="function"){_e=Be.call(Ue,_e,me);break e}_e=Be;break e;case 3:Be.flags=Be.flags&-65537|128;case 0:if(Be=je.payload,me=typeof Be=="function"?Be.call(Ue,_e,me):Be,me==null)break e;_e=se({},_e,me);break e;case 2:ur=!0}}D.callback!==null&&D.lane!==0&&(n.flags|=64,me=d.effects,me===null?d.effects=[D]:me.push(D))}else Ue={eventTime:Ue,lane:me,tag:D.tag,payload:D.payload,callback:D.callback,next:null},ve===null?(J=ve=Ue,k=_e):ve=ve.next=Ue,E|=me;if(D=D.next,D===null){if(D=d.shared.pending,D===null)break;me=D,D=me.next,me.next=null,d.lastBaseUpdate=me,d.shared.pending=null}}while(!0);if(ve===null&&(k=_e),d.baseState=k,d.firstBaseUpdate=J,d.lastBaseUpdate=ve,i=d.shared.interleaved,i!==null){d=i;do E|=d.lane,d=d.next;while(d!==i)}else m===null&&(d.shared.lanes=0);Vr|=E,n.lanes=E,n.memoizedState=_e}}function Uh(n,i,o){if(n=i.effects,i.effects=null,n!==null)for(i=0;i<n.length;i++){var u=n[i],d=u.callback;if(d!==null){if(u.callback=null,u=o,typeof d!="function")throw Error(t(191,d));d.call(u)}}}var Po={},Si=or(Po),Lo=or(Po),Do=or(Po);function Br(n){if(n===Po)throw Error(t(174));return n}function Yu(n,i){switch(Ot(Do,i),Ot(Lo,n),Ot(Si,Po),n=i.nodeType,n){case 9:case 11:i=(i=i.documentElement)?i.namespaceURI:ge(null,"");break;default:n=n===8?i.parentNode:i,i=n.namespaceURI||null,n=n.tagName,i=ge(i,n)}Ht(Si),Ot(Si,i)}function Ps(){Ht(Si),Ht(Lo),Ht(Do)}function Nh(n){Br(Do.current);var i=Br(Si.current),o=ge(i,n.type);i!==o&&(Ot(Lo,n),Ot(Si,o))}function qu(n){Lo.current===n&&(Ht(Si),Ht(Lo))}var Gt=or(0);function Wa(n){for(var i=n;i!==null;){if(i.tag===13){var o=i.memoizedState;if(o!==null&&(o=o.dehydrated,o===null||o.data==="$?"||o.data==="$!"))return i}else if(i.tag===19&&i.memoizedProps.revealOrder!==void 0){if((i.flags&128)!==0)return i}else if(i.child!==null){i.child.return=i,i=i.child;continue}if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return null;i=i.return}i.sibling.return=i.return,i=i.sibling}return null}var $u=[];function Ku(){for(var n=0;n<$u.length;n++)$u[n]._workInProgressVersionPrimary=null;$u.length=0}var Xa=b.ReactCurrentDispatcher,Zu=b.ReactCurrentBatchConfig,Hr=0,Wt=null,en=null,on=null,ja=!1,Io=!1,Uo=0,Z0=0;function _n(){throw Error(t(321))}function Qu(n,i){if(i===null)return!1;for(var o=0;o<i.length&&o<n.length;o++)if(!ai(n[o],i[o]))return!1;return!0}function Ju(n,i,o,u,d,m){if(Hr=m,Wt=i,i.memoizedState=null,i.updateQueue=null,i.lanes=0,Xa.current=n===null||n.memoizedState===null?tv:nv,n=o(u,d),Io){m=0;do{if(Io=!1,Uo=0,25<=m)throw Error(t(301));m+=1,on=en=null,i.updateQueue=null,Xa.current=iv,n=o(u,d)}while(Io)}if(Xa.current=$a,i=en!==null&&en.next!==null,Hr=0,on=en=Wt=null,ja=!1,i)throw Error(t(300));return n}function ec(){var n=Uo!==0;return Uo=0,n}function Mi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return on===null?Wt.memoizedState=on=n:on=on.next=n,on}function ni(){if(en===null){var n=Wt.alternate;n=n!==null?n.memoizedState:null}else n=en.next;var i=on===null?Wt.memoizedState:on.next;if(i!==null)on=i,en=n;else{if(n===null)throw Error(t(310));en=n,n={memoizedState:en.memoizedState,baseState:en.baseState,baseQueue:en.baseQueue,queue:en.queue,next:null},on===null?Wt.memoizedState=on=n:on=on.next=n}return on}function No(n,i){return typeof i=="function"?i(n):i}function tc(n){var i=ni(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var u=en,d=u.baseQueue,m=o.pending;if(m!==null){if(d!==null){var E=d.next;d.next=m.next,m.next=E}u.baseQueue=d=m,o.pending=null}if(d!==null){m=d.next,u=u.baseState;var D=E=null,k=null,J=m;do{var ve=J.lane;if((Hr&ve)===ve)k!==null&&(k=k.next={lane:0,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null}),u=J.hasEagerState?J.eagerState:n(u,J.action);else{var _e={lane:ve,action:J.action,hasEagerState:J.hasEagerState,eagerState:J.eagerState,next:null};k===null?(D=k=_e,E=u):k=k.next=_e,Wt.lanes|=ve,Vr|=ve}J=J.next}while(J!==null&&J!==m);k===null?E=u:k.next=D,ai(u,i.memoizedState)||(Un=!0),i.memoizedState=u,i.baseState=E,i.baseQueue=k,o.lastRenderedState=u}if(n=o.interleaved,n!==null){d=n;do m=d.lane,Wt.lanes|=m,Vr|=m,d=d.next;while(d!==n)}else d===null&&(o.lanes=0);return[i.memoizedState,o.dispatch]}function nc(n){var i=ni(),o=i.queue;if(o===null)throw Error(t(311));o.lastRenderedReducer=n;var u=o.dispatch,d=o.pending,m=i.memoizedState;if(d!==null){o.pending=null;var E=d=d.next;do m=n(m,E.action),E=E.next;while(E!==d);ai(m,i.memoizedState)||(Un=!0),i.memoizedState=m,i.baseQueue===null&&(i.baseState=m),o.lastRenderedState=m}return[m,u]}function Fh(){}function Oh(n,i){var o=Wt,u=ni(),d=i(),m=!ai(u.memoizedState,d);if(m&&(u.memoizedState=d,Un=!0),u=u.queue,ic(Bh.bind(null,o,u,n),[n]),u.getSnapshot!==i||m||on!==null&&on.memoizedState.tag&1){if(o.flags|=2048,Fo(9,kh.bind(null,o,u,d,i),void 0,null),an===null)throw Error(t(349));(Hr&30)!==0||zh(o,i,d)}return d}function zh(n,i,o){n.flags|=16384,n={getSnapshot:i,value:o},i=Wt.updateQueue,i===null?(i={lastEffect:null,stores:null},Wt.updateQueue=i,i.stores=[n]):(o=i.stores,o===null?i.stores=[n]:o.push(n))}function kh(n,i,o,u){i.value=o,i.getSnapshot=u,Hh(i)&&Vh(n)}function Bh(n,i,o){return o(function(){Hh(i)&&Vh(n)})}function Hh(n){var i=n.getSnapshot;n=n.value;try{var o=i();return!ai(n,o)}catch{return!0}}function Vh(n){var i=zi(n,1);i!==null&&di(i,n,1,-1)}function Gh(n){var i=Mi();return typeof n=="function"&&(n=n()),i.memoizedState=i.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:No,lastRenderedState:n},i.queue=n,n=n.dispatch=ev.bind(null,Wt,n),[i.memoizedState,n]}function Fo(n,i,o,u){return n={tag:n,create:i,destroy:o,deps:u,next:null},i=Wt.updateQueue,i===null?(i={lastEffect:null,stores:null},Wt.updateQueue=i,i.lastEffect=n.next=n):(o=i.lastEffect,o===null?i.lastEffect=n.next=n:(u=o.next,o.next=n,n.next=u,i.lastEffect=n)),n}function Wh(){return ni().memoizedState}function Ya(n,i,o,u){var d=Mi();Wt.flags|=n,d.memoizedState=Fo(1|i,o,void 0,u===void 0?null:u)}function qa(n,i,o,u){var d=ni();u=u===void 0?null:u;var m=void 0;if(en!==null){var E=en.memoizedState;if(m=E.destroy,u!==null&&Qu(u,E.deps)){d.memoizedState=Fo(i,o,m,u);return}}Wt.flags|=n,d.memoizedState=Fo(1|i,o,m,u)}function Xh(n,i){return Ya(8390656,8,n,i)}function ic(n,i){return qa(2048,8,n,i)}function jh(n,i){return qa(4,2,n,i)}function Yh(n,i){return qa(4,4,n,i)}function qh(n,i){if(typeof i=="function")return n=n(),i(n),function(){i(null)};if(i!=null)return n=n(),i.current=n,function(){i.current=null}}function $h(n,i,o){return o=o!=null?o.concat([n]):null,qa(4,4,qh.bind(null,i,n),o)}function rc(){}function Kh(n,i){var o=ni();i=i===void 0?null:i;var u=o.memoizedState;return u!==null&&i!==null&&Qu(i,u[1])?u[0]:(o.memoizedState=[n,i],n)}function Zh(n,i){var o=ni();i=i===void 0?null:i;var u=o.memoizedState;return u!==null&&i!==null&&Qu(i,u[1])?u[0]:(n=n(),o.memoizedState=[n,i],n)}function Qh(n,i,o){return(Hr&21)===0?(n.baseState&&(n.baseState=!1,Un=!0),n.memoizedState=o):(ai(o,i)||(o=Tn(),Wt.lanes|=o,Vr|=o,n.baseState=!0),i)}function Q0(n,i){var o=vt;vt=o!==0&&4>o?o:4,n(!0);var u=Zu.transition;Zu.transition={};try{n(!1),i()}finally{vt=o,Zu.transition=u}}function Jh(){return ni().memoizedState}function J0(n,i,o){var u=pr(n);if(o={lane:u,action:o,hasEagerState:!1,eagerState:null,next:null},ep(n))tp(i,o);else if(o=Lh(n,i,o,u),o!==null){var d=An();di(o,n,u,d),np(o,i,u)}}function ev(n,i,o){var u=pr(n),d={lane:u,action:o,hasEagerState:!1,eagerState:null,next:null};if(ep(n))tp(i,d);else{var m=n.alternate;if(n.lanes===0&&(m===null||m.lanes===0)&&(m=i.lastRenderedReducer,m!==null))try{var E=i.lastRenderedState,D=m(E,o);if(d.hasEagerState=!0,d.eagerState=D,ai(D,E)){var k=i.interleaved;k===null?(d.next=d,Xu(i)):(d.next=k.next,k.next=d),i.interleaved=d;return}}catch{}finally{}o=Lh(n,i,d,u),o!==null&&(d=An(),di(o,n,u,d),np(o,i,u))}}function ep(n){var i=n.alternate;return n===Wt||i!==null&&i===Wt}function tp(n,i){Io=ja=!0;var o=n.pending;o===null?i.next=i:(i.next=o.next,o.next=i),n.pending=i}function np(n,i,o){if((o&4194240)!==0){var u=i.lanes;u&=n.pendingLanes,o|=u,i.lanes=o,Ur(n,o)}}var $a={readContext:ti,useCallback:_n,useContext:_n,useEffect:_n,useImperativeHandle:_n,useInsertionEffect:_n,useLayoutEffect:_n,useMemo:_n,useReducer:_n,useRef:_n,useState:_n,useDebugValue:_n,useDeferredValue:_n,useTransition:_n,useMutableSource:_n,useSyncExternalStore:_n,useId:_n,unstable_isNewReconciler:!1},tv={readContext:ti,useCallback:function(n,i){return Mi().memoizedState=[n,i===void 0?null:i],n},useContext:ti,useEffect:Xh,useImperativeHandle:function(n,i,o){return o=o!=null?o.concat([n]):null,Ya(4194308,4,qh.bind(null,i,n),o)},useLayoutEffect:function(n,i){return Ya(4194308,4,n,i)},useInsertionEffect:function(n,i){return Ya(4,2,n,i)},useMemo:function(n,i){var o=Mi();return i=i===void 0?null:i,n=n(),o.memoizedState=[n,i],n},useReducer:function(n,i,o){var u=Mi();return i=o!==void 0?o(i):i,u.memoizedState=u.baseState=i,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:i},u.queue=n,n=n.dispatch=J0.bind(null,Wt,n),[u.memoizedState,n]},useRef:function(n){var i=Mi();return n={current:n},i.memoizedState=n},useState:Gh,useDebugValue:rc,useDeferredValue:function(n){return Mi().memoizedState=n},useTransition:function(){var n=Gh(!1),i=n[0];return n=Q0.bind(null,n[1]),Mi().memoizedState=n,[i,n]},useMutableSource:function(){},useSyncExternalStore:function(n,i,o){var u=Wt,d=Mi();if(Vt){if(o===void 0)throw Error(t(407));o=o()}else{if(o=i(),an===null)throw Error(t(349));(Hr&30)!==0||zh(u,i,o)}d.memoizedState=o;var m={value:o,getSnapshot:i};return d.queue=m,Xh(Bh.bind(null,u,m,n),[n]),u.flags|=2048,Fo(9,kh.bind(null,u,m,o,i),void 0,null),o},useId:function(){var n=Mi(),i=an.identifierPrefix;if(Vt){var o=Oi,u=Fi;o=(u&~(1<<32-Et(u)-1)).toString(32)+o,i=":"+i+"R"+o,o=Uo++,0<o&&(i+="H"+o.toString(32)),i+=":"}else o=Z0++,i=":"+i+"r"+o.toString(32)+":";return n.memoizedState=i},unstable_isNewReconciler:!1},nv={readContext:ti,useCallback:Kh,useContext:ti,useEffect:ic,useImperativeHandle:$h,useInsertionEffect:jh,useLayoutEffect:Yh,useMemo:Zh,useReducer:tc,useRef:Wh,useState:function(){return tc(No)},useDebugValue:rc,useDeferredValue:function(n){var i=ni();return Qh(i,en.memoizedState,n)},useTransition:function(){var n=tc(No)[0],i=ni().memoizedState;return[n,i]},useMutableSource:Fh,useSyncExternalStore:Oh,useId:Jh,unstable_isNewReconciler:!1},iv={readContext:ti,useCallback:Kh,useContext:ti,useEffect:ic,useImperativeHandle:$h,useInsertionEffect:jh,useLayoutEffect:Yh,useMemo:Zh,useReducer:nc,useRef:Wh,useState:function(){return nc(No)},useDebugValue:rc,useDeferredValue:function(n){var i=ni();return en===null?i.memoizedState=n:Qh(i,en.memoizedState,n)},useTransition:function(){var n=nc(No)[0],i=ni().memoizedState;return[n,i]},useMutableSource:Fh,useSyncExternalStore:Oh,useId:Jh,unstable_isNewReconciler:!1};function ui(n,i){if(n&&n.defaultProps){i=se({},i),n=n.defaultProps;for(var o in n)i[o]===void 0&&(i[o]=n[o]);return i}return i}function sc(n,i,o,u){i=n.memoizedState,o=o(u,i),o=o==null?i:se({},i,o),n.memoizedState=o,n.lanes===0&&(n.updateQueue.baseState=o)}var Ka={isMounted:function(n){return(n=n._reactInternals)?Ii(n)===n:!1},enqueueSetState:function(n,i,o){n=n._reactInternals;var u=An(),d=pr(n),m=ki(u,d);m.payload=i,o!=null&&(m.callback=o),i=cr(n,m,d),i!==null&&(di(i,n,d,u),Va(i,n,d))},enqueueReplaceState:function(n,i,o){n=n._reactInternals;var u=An(),d=pr(n),m=ki(u,d);m.tag=1,m.payload=i,o!=null&&(m.callback=o),i=cr(n,m,d),i!==null&&(di(i,n,d,u),Va(i,n,d))},enqueueForceUpdate:function(n,i){n=n._reactInternals;var o=An(),u=pr(n),d=ki(o,u);d.tag=2,i!=null&&(d.callback=i),i=cr(n,d,u),i!==null&&(di(i,n,u,o),Va(i,n,u))}};function ip(n,i,o,u,d,m,E){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(u,m,E):i.prototype&&i.prototype.isPureReactComponent?!Mo(o,u)||!Mo(d,m):!0}function rp(n,i,o){var u=!1,d=ar,m=i.contextType;return typeof m=="object"&&m!==null?m=ti(m):(d=In(i)?Fr:vn.current,u=i.contextTypes,m=(u=u!=null)?Es(n,d):ar),i=new i(o,m),n.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=Ka,n.stateNode=i,i._reactInternals=n,u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=d,n.__reactInternalMemoizedMaskedChildContext=m),i}function sp(n,i,o,u){n=i.state,typeof i.componentWillReceiveProps=="function"&&i.componentWillReceiveProps(o,u),typeof i.UNSAFE_componentWillReceiveProps=="function"&&i.UNSAFE_componentWillReceiveProps(o,u),i.state!==n&&Ka.enqueueReplaceState(i,i.state,null)}function oc(n,i,o,u){var d=n.stateNode;d.props=o,d.state=n.memoizedState,d.refs={},ju(n);var m=i.contextType;typeof m=="object"&&m!==null?d.context=ti(m):(m=In(i)?Fr:vn.current,d.context=Es(n,m)),d.state=n.memoizedState,m=i.getDerivedStateFromProps,typeof m=="function"&&(sc(n,i,m,o),d.state=n.memoizedState),typeof i.getDerivedStateFromProps=="function"||typeof d.getSnapshotBeforeUpdate=="function"||typeof d.UNSAFE_componentWillMount!="function"&&typeof d.componentWillMount!="function"||(i=d.state,typeof d.componentWillMount=="function"&&d.componentWillMount(),typeof d.UNSAFE_componentWillMount=="function"&&d.UNSAFE_componentWillMount(),i!==d.state&&Ka.enqueueReplaceState(d,d.state,null),Ga(n,o,d,u),d.state=n.memoizedState),typeof d.componentDidMount=="function"&&(n.flags|=4194308)}function Ls(n,i){try{var o="",u=i;do o+=He(u),u=u.return;while(u);var d=o}catch(m){d=`
Error generating stack: `+m.message+`
`+m.stack}return{value:n,source:i,stack:d,digest:null}}function ac(n,i,o){return{value:n,source:null,stack:o??null,digest:i??null}}function lc(n,i){try{console.error(i.value)}catch(o){setTimeout(function(){throw o})}}var rv=typeof WeakMap=="function"?WeakMap:Map;function op(n,i,o){o=ki(-1,o),o.tag=3,o.payload={element:null};var u=i.value;return o.callback=function(){il||(il=!0,Ec=u),lc(n,i)},o}function ap(n,i,o){o=ki(-1,o),o.tag=3;var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var d=i.value;o.payload=function(){return u(d)},o.callback=function(){lc(n,i)}}var m=n.stateNode;return m!==null&&typeof m.componentDidCatch=="function"&&(o.callback=function(){lc(n,i),typeof u!="function"&&(dr===null?dr=new Set([this]):dr.add(this));var E=i.stack;this.componentDidCatch(i.value,{componentStack:E!==null?E:""})}),o}function lp(n,i,o){var u=n.pingCache;if(u===null){u=n.pingCache=new rv;var d=new Set;u.set(i,d)}else d=u.get(i),d===void 0&&(d=new Set,u.set(i,d));d.has(o)||(d.add(o),n=_v.bind(null,n,i,o),i.then(n,n))}function up(n){do{var i;if((i=n.tag===13)&&(i=n.memoizedState,i=i!==null?i.dehydrated!==null:!0),i)return n;n=n.return}while(n!==null);return null}function cp(n,i,o,u,d){return(n.mode&1)===0?(n===i?n.flags|=65536:(n.flags|=128,o.flags|=131072,o.flags&=-52805,o.tag===1&&(o.alternate===null?o.tag=17:(i=ki(-1,1),i.tag=2,cr(o,i,1))),o.lanes|=1),n):(n.flags|=65536,n.lanes=d,n)}var sv=b.ReactCurrentOwner,Un=!1;function wn(n,i,o,u){i.child=n===null?Ph(i,null,o,u):Rs(i,n.child,o,u)}function fp(n,i,o,u,d){o=o.render;var m=i.ref;return bs(i,d),u=Ju(n,i,o,u,m,d),o=ec(),n!==null&&!Un?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Bi(n,i,d)):(Vt&&o&&Fu(i),i.flags|=1,wn(n,i,u,d),i.child)}function dp(n,i,o,u,d){if(n===null){var m=o.type;return typeof m=="function"&&!Pc(m)&&m.defaultProps===void 0&&o.compare===null&&o.defaultProps===void 0?(i.tag=15,i.type=m,hp(n,i,m,u,d)):(n=ul(o.type,null,u,i,i.mode,d),n.ref=i.ref,n.return=i,i.child=n)}if(m=n.child,(n.lanes&d)===0){var E=m.memoizedProps;if(o=o.compare,o=o!==null?o:Mo,o(E,u)&&n.ref===i.ref)return Bi(n,i,d)}return i.flags|=1,n=gr(m,u),n.ref=i.ref,n.return=i,i.child=n}function hp(n,i,o,u,d){if(n!==null){var m=n.memoizedProps;if(Mo(m,u)&&n.ref===i.ref)if(Un=!1,i.pendingProps=u=m,(n.lanes&d)!==0)(n.flags&131072)!==0&&(Un=!0);else return i.lanes=n.lanes,Bi(n,i,d)}return uc(n,i,o,u,d)}function pp(n,i,o){var u=i.pendingProps,d=u.children,m=n!==null?n.memoizedState:null;if(u.mode==="hidden")if((i.mode&1)===0)i.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ot(Is,Xn),Xn|=o;else{if((o&1073741824)===0)return n=m!==null?m.baseLanes|o:o,i.lanes=i.childLanes=1073741824,i.memoizedState={baseLanes:n,cachePool:null,transitions:null},i.updateQueue=null,Ot(Is,Xn),Xn|=n,null;i.memoizedState={baseLanes:0,cachePool:null,transitions:null},u=m!==null?m.baseLanes:o,Ot(Is,Xn),Xn|=u}else m!==null?(u=m.baseLanes|o,i.memoizedState=null):u=o,Ot(Is,Xn),Xn|=u;return wn(n,i,d,o),i.child}function mp(n,i){var o=i.ref;(n===null&&o!==null||n!==null&&n.ref!==o)&&(i.flags|=512,i.flags|=2097152)}function uc(n,i,o,u,d){var m=In(o)?Fr:vn.current;return m=Es(i,m),bs(i,d),o=Ju(n,i,o,u,m,d),u=ec(),n!==null&&!Un?(i.updateQueue=n.updateQueue,i.flags&=-2053,n.lanes&=~d,Bi(n,i,d)):(Vt&&u&&Fu(i),i.flags|=1,wn(n,i,o,d),i.child)}function gp(n,i,o,u,d){if(In(o)){var m=!0;Ua(i)}else m=!1;if(bs(i,d),i.stateNode===null)Qa(n,i),rp(i,o,u),oc(i,o,u,d),u=!0;else if(n===null){var E=i.stateNode,D=i.memoizedProps;E.props=D;var k=E.context,J=o.contextType;typeof J=="object"&&J!==null?J=ti(J):(J=In(o)?Fr:vn.current,J=Es(i,J));var ve=o.getDerivedStateFromProps,_e=typeof ve=="function"||typeof E.getSnapshotBeforeUpdate=="function";_e||typeof E.UNSAFE_componentWillReceiveProps!="function"&&typeof E.componentWillReceiveProps!="function"||(D!==u||k!==J)&&sp(i,E,u,J),ur=!1;var me=i.memoizedState;E.state=me,Ga(i,u,E,d),k=i.memoizedState,D!==u||me!==k||Dn.current||ur?(typeof ve=="function"&&(sc(i,o,ve,u),k=i.memoizedState),(D=ur||ip(i,o,D,u,me,k,J))?(_e||typeof E.UNSAFE_componentWillMount!="function"&&typeof E.componentWillMount!="function"||(typeof E.componentWillMount=="function"&&E.componentWillMount(),typeof E.UNSAFE_componentWillMount=="function"&&E.UNSAFE_componentWillMount()),typeof E.componentDidMount=="function"&&(i.flags|=4194308)):(typeof E.componentDidMount=="function"&&(i.flags|=4194308),i.memoizedProps=u,i.memoizedState=k),E.props=u,E.state=k,E.context=J,u=D):(typeof E.componentDidMount=="function"&&(i.flags|=4194308),u=!1)}else{E=i.stateNode,Dh(n,i),D=i.memoizedProps,J=i.type===i.elementType?D:ui(i.type,D),E.props=J,_e=i.pendingProps,me=E.context,k=o.contextType,typeof k=="object"&&k!==null?k=ti(k):(k=In(o)?Fr:vn.current,k=Es(i,k));var Ue=o.getDerivedStateFromProps;(ve=typeof Ue=="function"||typeof E.getSnapshotBeforeUpdate=="function")||typeof E.UNSAFE_componentWillReceiveProps!="function"&&typeof E.componentWillReceiveProps!="function"||(D!==_e||me!==k)&&sp(i,E,u,k),ur=!1,me=i.memoizedState,E.state=me,Ga(i,u,E,d);var Be=i.memoizedState;D!==_e||me!==Be||Dn.current||ur?(typeof Ue=="function"&&(sc(i,o,Ue,u),Be=i.memoizedState),(J=ur||ip(i,o,J,u,me,Be,k)||!1)?(ve||typeof E.UNSAFE_componentWillUpdate!="function"&&typeof E.componentWillUpdate!="function"||(typeof E.componentWillUpdate=="function"&&E.componentWillUpdate(u,Be,k),typeof E.UNSAFE_componentWillUpdate=="function"&&E.UNSAFE_componentWillUpdate(u,Be,k)),typeof E.componentDidUpdate=="function"&&(i.flags|=4),typeof E.getSnapshotBeforeUpdate=="function"&&(i.flags|=1024)):(typeof E.componentDidUpdate!="function"||D===n.memoizedProps&&me===n.memoizedState||(i.flags|=4),typeof E.getSnapshotBeforeUpdate!="function"||D===n.memoizedProps&&me===n.memoizedState||(i.flags|=1024),i.memoizedProps=u,i.memoizedState=Be),E.props=u,E.state=Be,E.context=k,u=J):(typeof E.componentDidUpdate!="function"||D===n.memoizedProps&&me===n.memoizedState||(i.flags|=4),typeof E.getSnapshotBeforeUpdate!="function"||D===n.memoizedProps&&me===n.memoizedState||(i.flags|=1024),u=!1)}return cc(n,i,o,u,m,d)}function cc(n,i,o,u,d,m){mp(n,i);var E=(i.flags&128)!==0;if(!u&&!E)return d&&Sh(i,o,!1),Bi(n,i,m);u=i.stateNode,sv.current=i;var D=E&&typeof o.getDerivedStateFromError!="function"?null:u.render();return i.flags|=1,n!==null&&E?(i.child=Rs(i,n.child,null,m),i.child=Rs(i,null,D,m)):wn(n,i,D,m),i.memoizedState=u.state,d&&Sh(i,o,!0),i.child}function vp(n){var i=n.stateNode;i.pendingContext?xh(n,i.pendingContext,i.pendingContext!==i.context):i.context&&xh(n,i.context,!1),Yu(n,i.containerInfo)}function _p(n,i,o,u,d){return As(),Bu(d),i.flags|=256,wn(n,i,o,u),i.child}var fc={dehydrated:null,treeContext:null,retryLane:0};function dc(n){return{baseLanes:n,cachePool:null,transitions:null}}function xp(n,i,o){var u=i.pendingProps,d=Gt.current,m=!1,E=(i.flags&128)!==0,D;if((D=E)||(D=n!==null&&n.memoizedState===null?!1:(d&2)!==0),D?(m=!0,i.flags&=-129):(n===null||n.memoizedState!==null)&&(d|=1),Ot(Gt,d&1),n===null)return ku(i),n=i.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((i.mode&1)===0?i.lanes=1:n.data==="$!"?i.lanes=8:i.lanes=1073741824,null):(E=u.children,n=u.fallback,m?(u=i.mode,m=i.child,E={mode:"hidden",children:E},(u&1)===0&&m!==null?(m.childLanes=0,m.pendingProps=E):m=cl(E,u,0,null),n=jr(n,u,o,null),m.return=i,n.return=i,m.sibling=n,i.child=m,i.child.memoizedState=dc(o),i.memoizedState=fc,n):hc(i,E));if(d=n.memoizedState,d!==null&&(D=d.dehydrated,D!==null))return ov(n,i,E,u,D,d,o);if(m){m=u.fallback,E=i.mode,d=n.child,D=d.sibling;var k={mode:"hidden",children:u.children};return(E&1)===0&&i.child!==d?(u=i.child,u.childLanes=0,u.pendingProps=k,i.deletions=null):(u=gr(d,k),u.subtreeFlags=d.subtreeFlags&14680064),D!==null?m=gr(D,m):(m=jr(m,E,o,null),m.flags|=2),m.return=i,u.return=i,u.sibling=m,i.child=u,u=m,m=i.child,E=n.child.memoizedState,E=E===null?dc(o):{baseLanes:E.baseLanes|o,cachePool:null,transitions:E.transitions},m.memoizedState=E,m.childLanes=n.childLanes&~o,i.memoizedState=fc,u}return m=n.child,n=m.sibling,u=gr(m,{mode:"visible",children:u.children}),(i.mode&1)===0&&(u.lanes=o),u.return=i,u.sibling=null,n!==null&&(o=i.deletions,o===null?(i.deletions=[n],i.flags|=16):o.push(n)),i.child=u,i.memoizedState=null,u}function hc(n,i){return i=cl({mode:"visible",children:i},n.mode,0,null),i.return=n,n.child=i}function Za(n,i,o,u){return u!==null&&Bu(u),Rs(i,n.child,null,o),n=hc(i,i.pendingProps.children),n.flags|=2,i.memoizedState=null,n}function ov(n,i,o,u,d,m,E){if(o)return i.flags&256?(i.flags&=-257,u=ac(Error(t(422))),Za(n,i,E,u)):i.memoizedState!==null?(i.child=n.child,i.flags|=128,null):(m=u.fallback,d=i.mode,u=cl({mode:"visible",children:u.children},d,0,null),m=jr(m,d,E,null),m.flags|=2,u.return=i,m.return=i,u.sibling=m,i.child=u,(i.mode&1)!==0&&Rs(i,n.child,null,E),i.child.memoizedState=dc(E),i.memoizedState=fc,m);if((i.mode&1)===0)return Za(n,i,E,null);if(d.data==="$!"){if(u=d.nextSibling&&d.nextSibling.dataset,u)var D=u.dgst;return u=D,m=Error(t(419)),u=ac(m,u,void 0),Za(n,i,E,u)}if(D=(E&n.childLanes)!==0,Un||D){if(u=an,u!==null){switch(E&-E){case 4:d=2;break;case 16:d=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:d=32;break;case 536870912:d=268435456;break;default:d=0}d=(d&(u.suspendedLanes|E))!==0?0:d,d!==0&&d!==m.retryLane&&(m.retryLane=d,zi(n,d),di(u,n,d,-1))}return bc(),u=ac(Error(t(421))),Za(n,i,E,u)}return d.data==="$?"?(i.flags|=128,i.child=n.child,i=xv.bind(null,n),d._reactRetry=i,null):(n=m.treeContext,Wn=sr(d.nextSibling),Gn=i,Vt=!0,li=null,n!==null&&(Jn[ei++]=Fi,Jn[ei++]=Oi,Jn[ei++]=Or,Fi=n.id,Oi=n.overflow,Or=i),i=hc(i,u.children),i.flags|=4096,i)}function yp(n,i,o){n.lanes|=i;var u=n.alternate;u!==null&&(u.lanes|=i),Wu(n.return,i,o)}function pc(n,i,o,u,d){var m=n.memoizedState;m===null?n.memoizedState={isBackwards:i,rendering:null,renderingStartTime:0,last:u,tail:o,tailMode:d}:(m.isBackwards=i,m.rendering=null,m.renderingStartTime=0,m.last=u,m.tail=o,m.tailMode=d)}function Sp(n,i,o){var u=i.pendingProps,d=u.revealOrder,m=u.tail;if(wn(n,i,u.children,o),u=Gt.current,(u&2)!==0)u=u&1|2,i.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=i.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&yp(n,o,i);else if(n.tag===19)yp(n,o,i);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===i)break e;for(;n.sibling===null;){if(n.return===null||n.return===i)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}u&=1}if(Ot(Gt,u),(i.mode&1)===0)i.memoizedState=null;else switch(d){case"forwards":for(o=i.child,d=null;o!==null;)n=o.alternate,n!==null&&Wa(n)===null&&(d=o),o=o.sibling;o=d,o===null?(d=i.child,i.child=null):(d=o.sibling,o.sibling=null),pc(i,!1,d,o,m);break;case"backwards":for(o=null,d=i.child,i.child=null;d!==null;){if(n=d.alternate,n!==null&&Wa(n)===null){i.child=d;break}n=d.sibling,d.sibling=o,o=d,d=n}pc(i,!0,o,null,m);break;case"together":pc(i,!1,null,null,void 0);break;default:i.memoizedState=null}return i.child}function Qa(n,i){(i.mode&1)===0&&n!==null&&(n.alternate=null,i.alternate=null,i.flags|=2)}function Bi(n,i,o){if(n!==null&&(i.dependencies=n.dependencies),Vr|=i.lanes,(o&i.childLanes)===0)return null;if(n!==null&&i.child!==n.child)throw Error(t(153));if(i.child!==null){for(n=i.child,o=gr(n,n.pendingProps),i.child=o,o.return=i;n.sibling!==null;)n=n.sibling,o=o.sibling=gr(n,n.pendingProps),o.return=i;o.sibling=null}return i.child}function av(n,i,o){switch(i.tag){case 3:vp(i),As();break;case 5:Nh(i);break;case 1:In(i.type)&&Ua(i);break;case 4:Yu(i,i.stateNode.containerInfo);break;case 10:var u=i.type._context,d=i.memoizedProps.value;Ot(Ba,u._currentValue),u._currentValue=d;break;case 13:if(u=i.memoizedState,u!==null)return u.dehydrated!==null?(Ot(Gt,Gt.current&1),i.flags|=128,null):(o&i.child.childLanes)!==0?xp(n,i,o):(Ot(Gt,Gt.current&1),n=Bi(n,i,o),n!==null?n.sibling:null);Ot(Gt,Gt.current&1);break;case 19:if(u=(o&i.childLanes)!==0,(n.flags&128)!==0){if(u)return Sp(n,i,o);i.flags|=128}if(d=i.memoizedState,d!==null&&(d.rendering=null,d.tail=null,d.lastEffect=null),Ot(Gt,Gt.current),u)break;return null;case 22:case 23:return i.lanes=0,pp(n,i,o)}return Bi(n,i,o)}var Mp,mc,Ep,Tp;Mp=function(n,i){for(var o=i.child;o!==null;){if(o.tag===5||o.tag===6)n.appendChild(o.stateNode);else if(o.tag!==4&&o.child!==null){o.child.return=o,o=o.child;continue}if(o===i)break;for(;o.sibling===null;){if(o.return===null||o.return===i)return;o=o.return}o.sibling.return=o.return,o=o.sibling}},mc=function(){},Ep=function(n,i,o,u){var d=n.memoizedProps;if(d!==u){n=i.stateNode,Br(Si.current);var m=null;switch(o){case"input":d=Pt(n,d),u=Pt(n,u),m=[];break;case"select":d=se({},d,{value:void 0}),u=se({},u,{value:void 0}),m=[];break;case"textarea":d=kt(n,d),u=kt(n,u),m=[];break;default:typeof d.onClick!="function"&&typeof u.onClick=="function"&&(n.onclick=La)}Ye(o,u);var E;o=null;for(J in d)if(!u.hasOwnProperty(J)&&d.hasOwnProperty(J)&&d[J]!=null)if(J==="style"){var D=d[J];for(E in D)D.hasOwnProperty(E)&&(o||(o={}),o[E]="")}else J!=="dangerouslySetInnerHTML"&&J!=="children"&&J!=="suppressContentEditableWarning"&&J!=="suppressHydrationWarning"&&J!=="autoFocus"&&(a.hasOwnProperty(J)?m||(m=[]):(m=m||[]).push(J,null));for(J in u){var k=u[J];if(D=d!=null?d[J]:void 0,u.hasOwnProperty(J)&&k!==D&&(k!=null||D!=null))if(J==="style")if(D){for(E in D)!D.hasOwnProperty(E)||k&&k.hasOwnProperty(E)||(o||(o={}),o[E]="");for(E in k)k.hasOwnProperty(E)&&D[E]!==k[E]&&(o||(o={}),o[E]=k[E])}else o||(m||(m=[]),m.push(J,o)),o=k;else J==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,D=D?D.__html:void 0,k!=null&&D!==k&&(m=m||[]).push(J,k)):J==="children"?typeof k!="string"&&typeof k!="number"||(m=m||[]).push(J,""+k):J!=="suppressContentEditableWarning"&&J!=="suppressHydrationWarning"&&(a.hasOwnProperty(J)?(k!=null&&J==="onScroll"&&Bt("scroll",n),m||D===k||(m=[])):(m=m||[]).push(J,k))}o&&(m=m||[]).push("style",o);var J=m;(i.updateQueue=J)&&(i.flags|=4)}},Tp=function(n,i,o,u){o!==u&&(i.flags|=4)};function Oo(n,i){if(!Vt)switch(n.tailMode){case"hidden":i=n.tail;for(var o=null;i!==null;)i.alternate!==null&&(o=i),i=i.sibling;o===null?n.tail=null:o.sibling=null;break;case"collapsed":o=n.tail;for(var u=null;o!==null;)o.alternate!==null&&(u=o),o=o.sibling;u===null?i||n.tail===null?n.tail=null:n.tail.sibling=null:u.sibling=null}}function xn(n){var i=n.alternate!==null&&n.alternate.child===n.child,o=0,u=0;if(i)for(var d=n.child;d!==null;)o|=d.lanes|d.childLanes,u|=d.subtreeFlags&14680064,u|=d.flags&14680064,d.return=n,d=d.sibling;else for(d=n.child;d!==null;)o|=d.lanes|d.childLanes,u|=d.subtreeFlags,u|=d.flags,d.return=n,d=d.sibling;return n.subtreeFlags|=u,n.childLanes=o,i}function lv(n,i,o){var u=i.pendingProps;switch(Ou(i),i.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return xn(i),null;case 1:return In(i.type)&&Ia(),xn(i),null;case 3:return u=i.stateNode,Ps(),Ht(Dn),Ht(vn),Ku(),u.pendingContext&&(u.context=u.pendingContext,u.pendingContext=null),(n===null||n.child===null)&&(za(i)?i.flags|=4:n===null||n.memoizedState.isDehydrated&&(i.flags&256)===0||(i.flags|=1024,li!==null&&(Ac(li),li=null))),mc(n,i),xn(i),null;case 5:qu(i);var d=Br(Do.current);if(o=i.type,n!==null&&i.stateNode!=null)Ep(n,i,o,u,d),n.ref!==i.ref&&(i.flags|=512,i.flags|=2097152);else{if(!u){if(i.stateNode===null)throw Error(t(166));return xn(i),null}if(n=Br(Si.current),za(i)){u=i.stateNode,o=i.type;var m=i.memoizedProps;switch(u[yi]=i,u[Ro]=m,n=(i.mode&1)!==0,o){case"dialog":Bt("cancel",u),Bt("close",u);break;case"iframe":case"object":case"embed":Bt("load",u);break;case"video":case"audio":for(d=0;d<To.length;d++)Bt(To[d],u);break;case"source":Bt("error",u);break;case"img":case"image":case"link":Bt("error",u),Bt("load",u);break;case"details":Bt("toggle",u);break;case"input":ct(u,m),Bt("invalid",u);break;case"select":u._wrapperState={wasMultiple:!!m.multiple},Bt("invalid",u);break;case"textarea":P(u,m),Bt("invalid",u)}Ye(o,m),d=null;for(var E in m)if(m.hasOwnProperty(E)){var D=m[E];E==="children"?typeof D=="string"?u.textContent!==D&&(m.suppressHydrationWarning!==!0&&Pa(u.textContent,D,n),d=["children",D]):typeof D=="number"&&u.textContent!==""+D&&(m.suppressHydrationWarning!==!0&&Pa(u.textContent,D,n),d=["children",""+D]):a.hasOwnProperty(E)&&D!=null&&E==="onScroll"&&Bt("scroll",u)}switch(o){case"input":pt(u),Ut(u,m,!0);break;case"textarea":pt(u),Z(u);break;case"select":case"option":break;default:typeof m.onClick=="function"&&(u.onclick=La)}u=d,i.updateQueue=u,u!==null&&(i.flags|=4)}else{E=d.nodeType===9?d:d.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=de(o)),n==="http://www.w3.org/1999/xhtml"?o==="script"?(n=E.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof u.is=="string"?n=E.createElement(o,{is:u.is}):(n=E.createElement(o),o==="select"&&(E=n,u.multiple?E.multiple=!0:u.size&&(E.size=u.size))):n=E.createElementNS(n,o),n[yi]=i,n[Ro]=u,Mp(n,i,!1,!1),i.stateNode=n;e:{switch(E=Re(o,u),o){case"dialog":Bt("cancel",n),Bt("close",n),d=u;break;case"iframe":case"object":case"embed":Bt("load",n),d=u;break;case"video":case"audio":for(d=0;d<To.length;d++)Bt(To[d],n);d=u;break;case"source":Bt("error",n),d=u;break;case"img":case"image":case"link":Bt("error",n),Bt("load",n),d=u;break;case"details":Bt("toggle",n),d=u;break;case"input":ct(n,u),d=Pt(n,u),Bt("invalid",n);break;case"option":d=u;break;case"select":n._wrapperState={wasMultiple:!!u.multiple},d=se({},u,{value:void 0}),Bt("invalid",n);break;case"textarea":P(n,u),d=kt(n,u),Bt("invalid",n);break;default:d=u}Ye(o,d),D=d;for(m in D)if(D.hasOwnProperty(m)){var k=D[m];m==="style"?Pe(n,k):m==="dangerouslySetInnerHTML"?(k=k?k.__html:void 0,k!=null&&$e(n,k)):m==="children"?typeof k=="string"?(o!=="textarea"||k!=="")&&we(n,k):typeof k=="number"&&we(n,""+k):m!=="suppressContentEditableWarning"&&m!=="suppressHydrationWarning"&&m!=="autoFocus"&&(a.hasOwnProperty(m)?k!=null&&m==="onScroll"&&Bt("scroll",n):k!=null&&L(n,m,k,E))}switch(o){case"input":pt(n),Ut(n,u,!1);break;case"textarea":pt(n),Z(n);break;case"option":u.value!=null&&n.setAttribute("value",""+Me(u.value));break;case"select":n.multiple=!!u.multiple,m=u.value,m!=null?zt(n,!!u.multiple,m,!1):u.defaultValue!=null&&zt(n,!!u.multiple,u.defaultValue,!0);break;default:typeof d.onClick=="function"&&(n.onclick=La)}switch(o){case"button":case"input":case"select":case"textarea":u=!!u.autoFocus;break e;case"img":u=!0;break e;default:u=!1}}u&&(i.flags|=4)}i.ref!==null&&(i.flags|=512,i.flags|=2097152)}return xn(i),null;case 6:if(n&&i.stateNode!=null)Tp(n,i,n.memoizedProps,u);else{if(typeof u!="string"&&i.stateNode===null)throw Error(t(166));if(o=Br(Do.current),Br(Si.current),za(i)){if(u=i.stateNode,o=i.memoizedProps,u[yi]=i,(m=u.nodeValue!==o)&&(n=Gn,n!==null))switch(n.tag){case 3:Pa(u.nodeValue,o,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Pa(u.nodeValue,o,(n.mode&1)!==0)}m&&(i.flags|=4)}else u=(o.nodeType===9?o:o.ownerDocument).createTextNode(u),u[yi]=i,i.stateNode=u}return xn(i),null;case 13:if(Ht(Gt),u=i.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Vt&&Wn!==null&&(i.mode&1)!==0&&(i.flags&128)===0)Rh(),As(),i.flags|=98560,m=!1;else if(m=za(i),u!==null&&u.dehydrated!==null){if(n===null){if(!m)throw Error(t(318));if(m=i.memoizedState,m=m!==null?m.dehydrated:null,!m)throw Error(t(317));m[yi]=i}else As(),(i.flags&128)===0&&(i.memoizedState=null),i.flags|=4;xn(i),m=!1}else li!==null&&(Ac(li),li=null),m=!0;if(!m)return i.flags&65536?i:null}return(i.flags&128)!==0?(i.lanes=o,i):(u=u!==null,u!==(n!==null&&n.memoizedState!==null)&&u&&(i.child.flags|=8192,(i.mode&1)!==0&&(n===null||(Gt.current&1)!==0?tn===0&&(tn=3):bc())),i.updateQueue!==null&&(i.flags|=4),xn(i),null);case 4:return Ps(),mc(n,i),n===null&&wo(i.stateNode.containerInfo),xn(i),null;case 10:return Gu(i.type._context),xn(i),null;case 17:return In(i.type)&&Ia(),xn(i),null;case 19:if(Ht(Gt),m=i.memoizedState,m===null)return xn(i),null;if(u=(i.flags&128)!==0,E=m.rendering,E===null)if(u)Oo(m,!1);else{if(tn!==0||n!==null&&(n.flags&128)!==0)for(n=i.child;n!==null;){if(E=Wa(n),E!==null){for(i.flags|=128,Oo(m,!1),u=E.updateQueue,u!==null&&(i.updateQueue=u,i.flags|=4),i.subtreeFlags=0,u=o,o=i.child;o!==null;)m=o,n=u,m.flags&=14680066,E=m.alternate,E===null?(m.childLanes=0,m.lanes=n,m.child=null,m.subtreeFlags=0,m.memoizedProps=null,m.memoizedState=null,m.updateQueue=null,m.dependencies=null,m.stateNode=null):(m.childLanes=E.childLanes,m.lanes=E.lanes,m.child=E.child,m.subtreeFlags=0,m.deletions=null,m.memoizedProps=E.memoizedProps,m.memoizedState=E.memoizedState,m.updateQueue=E.updateQueue,m.type=E.type,n=E.dependencies,m.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),o=o.sibling;return Ot(Gt,Gt.current&1|2),i.child}n=n.sibling}m.tail!==null&&W()>Us&&(i.flags|=128,u=!0,Oo(m,!1),i.lanes=4194304)}else{if(!u)if(n=Wa(E),n!==null){if(i.flags|=128,u=!0,o=n.updateQueue,o!==null&&(i.updateQueue=o,i.flags|=4),Oo(m,!0),m.tail===null&&m.tailMode==="hidden"&&!E.alternate&&!Vt)return xn(i),null}else 2*W()-m.renderingStartTime>Us&&o!==1073741824&&(i.flags|=128,u=!0,Oo(m,!1),i.lanes=4194304);m.isBackwards?(E.sibling=i.child,i.child=E):(o=m.last,o!==null?o.sibling=E:i.child=E,m.last=E)}return m.tail!==null?(i=m.tail,m.rendering=i,m.tail=i.sibling,m.renderingStartTime=W(),i.sibling=null,o=Gt.current,Ot(Gt,u?o&1|2:o&1),i):(xn(i),null);case 22:case 23:return Cc(),u=i.memoizedState!==null,n!==null&&n.memoizedState!==null!==u&&(i.flags|=8192),u&&(i.mode&1)!==0?(Xn&1073741824)!==0&&(xn(i),i.subtreeFlags&6&&(i.flags|=8192)):xn(i),null;case 24:return null;case 25:return null}throw Error(t(156,i.tag))}function uv(n,i){switch(Ou(i),i.tag){case 1:return In(i.type)&&Ia(),n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 3:return Ps(),Ht(Dn),Ht(vn),Ku(),n=i.flags,(n&65536)!==0&&(n&128)===0?(i.flags=n&-65537|128,i):null;case 5:return qu(i),null;case 13:if(Ht(Gt),n=i.memoizedState,n!==null&&n.dehydrated!==null){if(i.alternate===null)throw Error(t(340));As()}return n=i.flags,n&65536?(i.flags=n&-65537|128,i):null;case 19:return Ht(Gt),null;case 4:return Ps(),null;case 10:return Gu(i.type._context),null;case 22:case 23:return Cc(),null;case 24:return null;default:return null}}var Ja=!1,yn=!1,cv=typeof WeakSet=="function"?WeakSet:Set,Oe=null;function Ds(n,i){var o=n.ref;if(o!==null)if(typeof o=="function")try{o(null)}catch(u){jt(n,i,u)}else o.current=null}function gc(n,i,o){try{o()}catch(u){jt(n,i,u)}}var wp=!1;function fv(n,i){if(Cu=xa,n=ih(),yu(n)){if("selectionStart"in n)var o={start:n.selectionStart,end:n.selectionEnd};else e:{o=(o=n.ownerDocument)&&o.defaultView||window;var u=o.getSelection&&o.getSelection();if(u&&u.rangeCount!==0){o=u.anchorNode;var d=u.anchorOffset,m=u.focusNode;u=u.focusOffset;try{o.nodeType,m.nodeType}catch{o=null;break e}var E=0,D=-1,k=-1,J=0,ve=0,_e=n,me=null;t:for(;;){for(var Ue;_e!==o||d!==0&&_e.nodeType!==3||(D=E+d),_e!==m||u!==0&&_e.nodeType!==3||(k=E+u),_e.nodeType===3&&(E+=_e.nodeValue.length),(Ue=_e.firstChild)!==null;)me=_e,_e=Ue;for(;;){if(_e===n)break t;if(me===o&&++J===d&&(D=E),me===m&&++ve===u&&(k=E),(Ue=_e.nextSibling)!==null)break;_e=me,me=_e.parentNode}_e=Ue}o=D===-1||k===-1?null:{start:D,end:k}}else o=null}o=o||{start:0,end:0}}else o=null;for(bu={focusedElem:n,selectionRange:o},xa=!1,Oe=i;Oe!==null;)if(i=Oe,n=i.child,(i.subtreeFlags&1028)!==0&&n!==null)n.return=i,Oe=n;else for(;Oe!==null;){i=Oe;try{var Be=i.alternate;if((i.flags&1024)!==0)switch(i.tag){case 0:case 11:case 15:break;case 1:if(Be!==null){var je=Be.memoizedProps,qt=Be.memoizedState,q=i.stateNode,G=q.getSnapshotBeforeUpdate(i.elementType===i.type?je:ui(i.type,je),qt);q.__reactInternalSnapshotBeforeUpdate=G}break;case 3:var Q=i.stateNode.containerInfo;Q.nodeType===1?Q.textContent="":Q.nodeType===9&&Q.documentElement&&Q.removeChild(Q.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Te){jt(i,i.return,Te)}if(n=i.sibling,n!==null){n.return=i.return,Oe=n;break}Oe=i.return}return Be=wp,wp=!1,Be}function zo(n,i,o){var u=i.updateQueue;if(u=u!==null?u.lastEffect:null,u!==null){var d=u=u.next;do{if((d.tag&n)===n){var m=d.destroy;d.destroy=void 0,m!==void 0&&gc(i,o,m)}d=d.next}while(d!==u)}}function el(n,i){if(i=i.updateQueue,i=i!==null?i.lastEffect:null,i!==null){var o=i=i.next;do{if((o.tag&n)===n){var u=o.create;o.destroy=u()}o=o.next}while(o!==i)}}function vc(n){var i=n.ref;if(i!==null){var o=n.stateNode;switch(n.tag){case 5:n=o;break;default:n=o}typeof i=="function"?i(n):i.current=n}}function Ap(n){var i=n.alternate;i!==null&&(n.alternate=null,Ap(i)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(i=n.stateNode,i!==null&&(delete i[yi],delete i[Ro],delete i[Iu],delete i[Y0],delete i[q0])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function Rp(n){return n.tag===5||n.tag===3||n.tag===4}function Cp(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||Rp(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function _c(n,i,o){var u=n.tag;if(u===5||u===6)n=n.stateNode,i?o.nodeType===8?o.parentNode.insertBefore(n,i):o.insertBefore(n,i):(o.nodeType===8?(i=o.parentNode,i.insertBefore(n,o)):(i=o,i.appendChild(n)),o=o._reactRootContainer,o!=null||i.onclick!==null||(i.onclick=La));else if(u!==4&&(n=n.child,n!==null))for(_c(n,i,o),n=n.sibling;n!==null;)_c(n,i,o),n=n.sibling}function xc(n,i,o){var u=n.tag;if(u===5||u===6)n=n.stateNode,i?o.insertBefore(n,i):o.appendChild(n);else if(u!==4&&(n=n.child,n!==null))for(xc(n,i,o),n=n.sibling;n!==null;)xc(n,i,o),n=n.sibling}var fn=null,ci=!1;function fr(n,i,o){for(o=o.child;o!==null;)bp(n,i,o),o=o.sibling}function bp(n,i,o){if(ot&&typeof ot.onCommitFiberUnmount=="function")try{ot.onCommitFiberUnmount(Ze,o)}catch{}switch(o.tag){case 5:yn||Ds(o,i);case 6:var u=fn,d=ci;fn=null,fr(n,i,o),fn=u,ci=d,fn!==null&&(ci?(n=fn,o=o.stateNode,n.nodeType===8?n.parentNode.removeChild(o):n.removeChild(o)):fn.removeChild(o.stateNode));break;case 18:fn!==null&&(ci?(n=fn,o=o.stateNode,n.nodeType===8?Du(n.parentNode,o):n.nodeType===1&&Du(n,o),go(n)):Du(fn,o.stateNode));break;case 4:u=fn,d=ci,fn=o.stateNode.containerInfo,ci=!0,fr(n,i,o),fn=u,ci=d;break;case 0:case 11:case 14:case 15:if(!yn&&(u=o.updateQueue,u!==null&&(u=u.lastEffect,u!==null))){d=u=u.next;do{var m=d,E=m.destroy;m=m.tag,E!==void 0&&((m&2)!==0||(m&4)!==0)&&gc(o,i,E),d=d.next}while(d!==u)}fr(n,i,o);break;case 1:if(!yn&&(Ds(o,i),u=o.stateNode,typeof u.componentWillUnmount=="function"))try{u.props=o.memoizedProps,u.state=o.memoizedState,u.componentWillUnmount()}catch(D){jt(o,i,D)}fr(n,i,o);break;case 21:fr(n,i,o);break;case 22:o.mode&1?(yn=(u=yn)||o.memoizedState!==null,fr(n,i,o),yn=u):fr(n,i,o);break;default:fr(n,i,o)}}function Pp(n){var i=n.updateQueue;if(i!==null){n.updateQueue=null;var o=n.stateNode;o===null&&(o=n.stateNode=new cv),i.forEach(function(u){var d=yv.bind(null,n,u);o.has(u)||(o.add(u),u.then(d,d))})}}function fi(n,i){var o=i.deletions;if(o!==null)for(var u=0;u<o.length;u++){var d=o[u];try{var m=n,E=i,D=E;e:for(;D!==null;){switch(D.tag){case 5:fn=D.stateNode,ci=!1;break e;case 3:fn=D.stateNode.containerInfo,ci=!0;break e;case 4:fn=D.stateNode.containerInfo,ci=!0;break e}D=D.return}if(fn===null)throw Error(t(160));bp(m,E,d),fn=null,ci=!1;var k=d.alternate;k!==null&&(k.return=null),d.return=null}catch(J){jt(d,i,J)}}if(i.subtreeFlags&12854)for(i=i.child;i!==null;)Lp(i,n),i=i.sibling}function Lp(n,i){var o=n.alternate,u=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(fi(i,n),Ei(n),u&4){try{zo(3,n,n.return),el(3,n)}catch(je){jt(n,n.return,je)}try{zo(5,n,n.return)}catch(je){jt(n,n.return,je)}}break;case 1:fi(i,n),Ei(n),u&512&&o!==null&&Ds(o,o.return);break;case 5:if(fi(i,n),Ei(n),u&512&&o!==null&&Ds(o,o.return),n.flags&32){var d=n.stateNode;try{we(d,"")}catch(je){jt(n,n.return,je)}}if(u&4&&(d=n.stateNode,d!=null)){var m=n.memoizedProps,E=o!==null?o.memoizedProps:m,D=n.type,k=n.updateQueue;if(n.updateQueue=null,k!==null)try{D==="input"&&m.type==="radio"&&m.name!=null&&it(d,m),Re(D,E);var J=Re(D,m);for(E=0;E<k.length;E+=2){var ve=k[E],_e=k[E+1];ve==="style"?Pe(d,_e):ve==="dangerouslySetInnerHTML"?$e(d,_e):ve==="children"?we(d,_e):L(d,ve,_e,J)}switch(D){case"input":Ve(d,m);break;case"textarea":T(d,m);break;case"select":var me=d._wrapperState.wasMultiple;d._wrapperState.wasMultiple=!!m.multiple;var Ue=m.value;Ue!=null?zt(d,!!m.multiple,Ue,!1):me!==!!m.multiple&&(m.defaultValue!=null?zt(d,!!m.multiple,m.defaultValue,!0):zt(d,!!m.multiple,m.multiple?[]:"",!1))}d[Ro]=m}catch(je){jt(n,n.return,je)}}break;case 6:if(fi(i,n),Ei(n),u&4){if(n.stateNode===null)throw Error(t(162));d=n.stateNode,m=n.memoizedProps;try{d.nodeValue=m}catch(je){jt(n,n.return,je)}}break;case 3:if(fi(i,n),Ei(n),u&4&&o!==null&&o.memoizedState.isDehydrated)try{go(i.containerInfo)}catch(je){jt(n,n.return,je)}break;case 4:fi(i,n),Ei(n);break;case 13:fi(i,n),Ei(n),d=n.child,d.flags&8192&&(m=d.memoizedState!==null,d.stateNode.isHidden=m,!m||d.alternate!==null&&d.alternate.memoizedState!==null||(Mc=W())),u&4&&Pp(n);break;case 22:if(ve=o!==null&&o.memoizedState!==null,n.mode&1?(yn=(J=yn)||ve,fi(i,n),yn=J):fi(i,n),Ei(n),u&8192){if(J=n.memoizedState!==null,(n.stateNode.isHidden=J)&&!ve&&(n.mode&1)!==0)for(Oe=n,ve=n.child;ve!==null;){for(_e=Oe=ve;Oe!==null;){switch(me=Oe,Ue=me.child,me.tag){case 0:case 11:case 14:case 15:zo(4,me,me.return);break;case 1:Ds(me,me.return);var Be=me.stateNode;if(typeof Be.componentWillUnmount=="function"){u=me,o=me.return;try{i=u,Be.props=i.memoizedProps,Be.state=i.memoizedState,Be.componentWillUnmount()}catch(je){jt(u,o,je)}}break;case 5:Ds(me,me.return);break;case 22:if(me.memoizedState!==null){Up(_e);continue}}Ue!==null?(Ue.return=me,Oe=Ue):Up(_e)}ve=ve.sibling}e:for(ve=null,_e=n;;){if(_e.tag===5){if(ve===null){ve=_e;try{d=_e.stateNode,J?(m=d.style,typeof m.setProperty=="function"?m.setProperty("display","none","important"):m.display="none"):(D=_e.stateNode,k=_e.memoizedProps.style,E=k!=null&&k.hasOwnProperty("display")?k.display:null,D.style.display=Ee("display",E))}catch(je){jt(n,n.return,je)}}}else if(_e.tag===6){if(ve===null)try{_e.stateNode.nodeValue=J?"":_e.memoizedProps}catch(je){jt(n,n.return,je)}}else if((_e.tag!==22&&_e.tag!==23||_e.memoizedState===null||_e===n)&&_e.child!==null){_e.child.return=_e,_e=_e.child;continue}if(_e===n)break e;for(;_e.sibling===null;){if(_e.return===null||_e.return===n)break e;ve===_e&&(ve=null),_e=_e.return}ve===_e&&(ve=null),_e.sibling.return=_e.return,_e=_e.sibling}}break;case 19:fi(i,n),Ei(n),u&4&&Pp(n);break;case 21:break;default:fi(i,n),Ei(n)}}function Ei(n){var i=n.flags;if(i&2){try{e:{for(var o=n.return;o!==null;){if(Rp(o)){var u=o;break e}o=o.return}throw Error(t(160))}switch(u.tag){case 5:var d=u.stateNode;u.flags&32&&(we(d,""),u.flags&=-33);var m=Cp(n);xc(n,m,d);break;case 3:case 4:var E=u.stateNode.containerInfo,D=Cp(n);_c(n,D,E);break;default:throw Error(t(161))}}catch(k){jt(n,n.return,k)}n.flags&=-3}i&4096&&(n.flags&=-4097)}function dv(n,i,o){Oe=n,Dp(n)}function Dp(n,i,o){for(var u=(n.mode&1)!==0;Oe!==null;){var d=Oe,m=d.child;if(d.tag===22&&u){var E=d.memoizedState!==null||Ja;if(!E){var D=d.alternate,k=D!==null&&D.memoizedState!==null||yn;D=Ja;var J=yn;if(Ja=E,(yn=k)&&!J)for(Oe=d;Oe!==null;)E=Oe,k=E.child,E.tag===22&&E.memoizedState!==null?Np(d):k!==null?(k.return=E,Oe=k):Np(d);for(;m!==null;)Oe=m,Dp(m),m=m.sibling;Oe=d,Ja=D,yn=J}Ip(n)}else(d.subtreeFlags&8772)!==0&&m!==null?(m.return=d,Oe=m):Ip(n)}}function Ip(n){for(;Oe!==null;){var i=Oe;if((i.flags&8772)!==0){var o=i.alternate;try{if((i.flags&8772)!==0)switch(i.tag){case 0:case 11:case 15:yn||el(5,i);break;case 1:var u=i.stateNode;if(i.flags&4&&!yn)if(o===null)u.componentDidMount();else{var d=i.elementType===i.type?o.memoizedProps:ui(i.type,o.memoizedProps);u.componentDidUpdate(d,o.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}var m=i.updateQueue;m!==null&&Uh(i,m,u);break;case 3:var E=i.updateQueue;if(E!==null){if(o=null,i.child!==null)switch(i.child.tag){case 5:o=i.child.stateNode;break;case 1:o=i.child.stateNode}Uh(i,E,o)}break;case 5:var D=i.stateNode;if(o===null&&i.flags&4){o=D;var k=i.memoizedProps;switch(i.type){case"button":case"input":case"select":case"textarea":k.autoFocus&&o.focus();break;case"img":k.src&&(o.src=k.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(i.memoizedState===null){var J=i.alternate;if(J!==null){var ve=J.memoizedState;if(ve!==null){var _e=ve.dehydrated;_e!==null&&go(_e)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}yn||i.flags&512&&vc(i)}catch(me){jt(i,i.return,me)}}if(i===n){Oe=null;break}if(o=i.sibling,o!==null){o.return=i.return,Oe=o;break}Oe=i.return}}function Up(n){for(;Oe!==null;){var i=Oe;if(i===n){Oe=null;break}var o=i.sibling;if(o!==null){o.return=i.return,Oe=o;break}Oe=i.return}}function Np(n){for(;Oe!==null;){var i=Oe;try{switch(i.tag){case 0:case 11:case 15:var o=i.return;try{el(4,i)}catch(k){jt(i,o,k)}break;case 1:var u=i.stateNode;if(typeof u.componentDidMount=="function"){var d=i.return;try{u.componentDidMount()}catch(k){jt(i,d,k)}}var m=i.return;try{vc(i)}catch(k){jt(i,m,k)}break;case 5:var E=i.return;try{vc(i)}catch(k){jt(i,E,k)}}}catch(k){jt(i,i.return,k)}if(i===n){Oe=null;break}var D=i.sibling;if(D!==null){D.return=i.return,Oe=D;break}Oe=i.return}}var hv=Math.ceil,tl=b.ReactCurrentDispatcher,yc=b.ReactCurrentOwner,ii=b.ReactCurrentBatchConfig,Tt=0,an=null,Kt=null,dn=0,Xn=0,Is=or(0),tn=0,ko=null,Vr=0,nl=0,Sc=0,Bo=null,Nn=null,Mc=0,Us=1/0,Hi=null,il=!1,Ec=null,dr=null,rl=!1,hr=null,sl=0,Ho=0,Tc=null,ol=-1,al=0;function An(){return(Tt&6)!==0?W():ol!==-1?ol:ol=W()}function pr(n){return(n.mode&1)===0?1:(Tt&2)!==0&&dn!==0?dn&-dn:K0.transition!==null?(al===0&&(al=Tn()),al):(n=vt,n!==0||(n=window.event,n=n===void 0?16:Od(n.type)),n)}function di(n,i,o,u){if(50<Ho)throw Ho=0,Tc=null,Error(t(185));Yt(n,o,u),((Tt&2)===0||n!==an)&&(n===an&&((Tt&2)===0&&(nl|=o),tn===4&&mr(n,dn)),Fn(n,u),o===1&&Tt===0&&(i.mode&1)===0&&(Us=W()+500,Na&&lr()))}function Fn(n,i){var o=n.callbackNode;Ir(n,i);var u=oi(n,n===an?dn:0);if(u===0)o!==null&&Y(o),n.callbackNode=null,n.callbackPriority=0;else if(i=u&-u,n.callbackPriority!==i){if(o!=null&&Y(o),i===1)n.tag===0?$0(Op.bind(null,n)):Mh(Op.bind(null,n)),X0(function(){(Tt&6)===0&&lr()}),o=null;else{switch(bd(u)){case 1:o=Ce;break;case 4:o=ke;break;case 16:o=Ie;break;case 536870912:o=st;break;default:o=Ie}o=Xp(o,Fp.bind(null,n))}n.callbackPriority=i,n.callbackNode=o}}function Fp(n,i){if(ol=-1,al=0,(Tt&6)!==0)throw Error(t(327));var o=n.callbackNode;if(Ns()&&n.callbackNode!==o)return null;var u=oi(n,n===an?dn:0);if(u===0)return null;if((u&30)!==0||(u&n.expiredLanes)!==0||i)i=ll(n,u);else{i=u;var d=Tt;Tt|=2;var m=kp();(an!==n||dn!==i)&&(Hi=null,Us=W()+500,Wr(n,i));do try{gv();break}catch(D){zp(n,D)}while(!0);Vu(),tl.current=m,Tt=d,Kt!==null?i=0:(an=null,dn=0,i=tn)}if(i!==0){if(i===2&&(d=Ft(n),d!==0&&(u=d,i=wc(n,d))),i===1)throw o=ko,Wr(n,0),mr(n,u),Fn(n,W()),o;if(i===6)mr(n,u);else{if(d=n.current.alternate,(u&30)===0&&!pv(d)&&(i=ll(n,u),i===2&&(m=Ft(n),m!==0&&(u=m,i=wc(n,m))),i===1))throw o=ko,Wr(n,0),mr(n,u),Fn(n,W()),o;switch(n.finishedWork=d,n.finishedLanes=u,i){case 0:case 1:throw Error(t(345));case 2:Xr(n,Nn,Hi);break;case 3:if(mr(n,u),(u&130023424)===u&&(i=Mc+500-W(),10<i)){if(oi(n,0)!==0)break;if(d=n.suspendedLanes,(d&u)!==u){An(),n.pingedLanes|=n.suspendedLanes&d;break}n.timeoutHandle=Lu(Xr.bind(null,n,Nn,Hi),i);break}Xr(n,Nn,Hi);break;case 4:if(mr(n,u),(u&4194240)===u)break;for(i=n.eventTimes,d=-1;0<u;){var E=31-Et(u);m=1<<E,E=i[E],E>d&&(d=E),u&=~m}if(u=d,u=W()-u,u=(120>u?120:480>u?480:1080>u?1080:1920>u?1920:3e3>u?3e3:4320>u?4320:1960*hv(u/1960))-u,10<u){n.timeoutHandle=Lu(Xr.bind(null,n,Nn,Hi),u);break}Xr(n,Nn,Hi);break;case 5:Xr(n,Nn,Hi);break;default:throw Error(t(329))}}}return Fn(n,W()),n.callbackNode===o?Fp.bind(null,n):null}function wc(n,i){var o=Bo;return n.current.memoizedState.isDehydrated&&(Wr(n,i).flags|=256),n=ll(n,i),n!==2&&(i=Nn,Nn=o,i!==null&&Ac(i)),n}function Ac(n){Nn===null?Nn=n:Nn.push.apply(Nn,n)}function pv(n){for(var i=n;;){if(i.flags&16384){var o=i.updateQueue;if(o!==null&&(o=o.stores,o!==null))for(var u=0;u<o.length;u++){var d=o[u],m=d.getSnapshot;d=d.value;try{if(!ai(m(),d))return!1}catch{return!1}}}if(o=i.child,i.subtreeFlags&16384&&o!==null)o.return=i,i=o;else{if(i===n)break;for(;i.sibling===null;){if(i.return===null||i.return===n)return!0;i=i.return}i.sibling.return=i.return,i=i.sibling}}return!0}function mr(n,i){for(i&=~Sc,i&=~nl,n.suspendedLanes|=i,n.pingedLanes&=~i,n=n.expirationTimes;0<i;){var o=31-Et(i),u=1<<o;n[o]=-1,i&=~u}}function Op(n){if((Tt&6)!==0)throw Error(t(327));Ns();var i=oi(n,0);if((i&1)===0)return Fn(n,W()),null;var o=ll(n,i);if(n.tag!==0&&o===2){var u=Ft(n);u!==0&&(i=u,o=wc(n,u))}if(o===1)throw o=ko,Wr(n,0),mr(n,i),Fn(n,W()),o;if(o===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=i,Xr(n,Nn,Hi),Fn(n,W()),null}function Rc(n,i){var o=Tt;Tt|=1;try{return n(i)}finally{Tt=o,Tt===0&&(Us=W()+500,Na&&lr())}}function Gr(n){hr!==null&&hr.tag===0&&(Tt&6)===0&&Ns();var i=Tt;Tt|=1;var o=ii.transition,u=vt;try{if(ii.transition=null,vt=1,n)return n()}finally{vt=u,ii.transition=o,Tt=i,(Tt&6)===0&&lr()}}function Cc(){Xn=Is.current,Ht(Is)}function Wr(n,i){n.finishedWork=null,n.finishedLanes=0;var o=n.timeoutHandle;if(o!==-1&&(n.timeoutHandle=-1,W0(o)),Kt!==null)for(o=Kt.return;o!==null;){var u=o;switch(Ou(u),u.tag){case 1:u=u.type.childContextTypes,u!=null&&Ia();break;case 3:Ps(),Ht(Dn),Ht(vn),Ku();break;case 5:qu(u);break;case 4:Ps();break;case 13:Ht(Gt);break;case 19:Ht(Gt);break;case 10:Gu(u.type._context);break;case 22:case 23:Cc()}o=o.return}if(an=n,Kt=n=gr(n.current,null),dn=Xn=i,tn=0,ko=null,Sc=nl=Vr=0,Nn=Bo=null,kr!==null){for(i=0;i<kr.length;i++)if(o=kr[i],u=o.interleaved,u!==null){o.interleaved=null;var d=u.next,m=o.pending;if(m!==null){var E=m.next;m.next=d,u.next=E}o.pending=u}kr=null}return n}function zp(n,i){do{var o=Kt;try{if(Vu(),Xa.current=$a,ja){for(var u=Wt.memoizedState;u!==null;){var d=u.queue;d!==null&&(d.pending=null),u=u.next}ja=!1}if(Hr=0,on=en=Wt=null,Io=!1,Uo=0,yc.current=null,o===null||o.return===null){tn=1,ko=i,Kt=null;break}e:{var m=n,E=o.return,D=o,k=i;if(i=dn,D.flags|=32768,k!==null&&typeof k=="object"&&typeof k.then=="function"){var J=k,ve=D,_e=ve.tag;if((ve.mode&1)===0&&(_e===0||_e===11||_e===15)){var me=ve.alternate;me?(ve.updateQueue=me.updateQueue,ve.memoizedState=me.memoizedState,ve.lanes=me.lanes):(ve.updateQueue=null,ve.memoizedState=null)}var Ue=up(E);if(Ue!==null){Ue.flags&=-257,cp(Ue,E,D,m,i),Ue.mode&1&&lp(m,J,i),i=Ue,k=J;var Be=i.updateQueue;if(Be===null){var je=new Set;je.add(k),i.updateQueue=je}else Be.add(k);break e}else{if((i&1)===0){lp(m,J,i),bc();break e}k=Error(t(426))}}else if(Vt&&D.mode&1){var qt=up(E);if(qt!==null){(qt.flags&65536)===0&&(qt.flags|=256),cp(qt,E,D,m,i),Bu(Ls(k,D));break e}}m=k=Ls(k,D),tn!==4&&(tn=2),Bo===null?Bo=[m]:Bo.push(m),m=E;do{switch(m.tag){case 3:m.flags|=65536,i&=-i,m.lanes|=i;var q=op(m,k,i);Ih(m,q);break e;case 1:D=k;var G=m.type,Q=m.stateNode;if((m.flags&128)===0&&(typeof G.getDerivedStateFromError=="function"||Q!==null&&typeof Q.componentDidCatch=="function"&&(dr===null||!dr.has(Q)))){m.flags|=65536,i&=-i,m.lanes|=i;var Te=ap(m,D,i);Ih(m,Te);break e}}m=m.return}while(m!==null)}Hp(o)}catch(qe){i=qe,Kt===o&&o!==null&&(Kt=o=o.return);continue}break}while(!0)}function kp(){var n=tl.current;return tl.current=$a,n===null?$a:n}function bc(){(tn===0||tn===3||tn===2)&&(tn=4),an===null||(Vr&268435455)===0&&(nl&268435455)===0||mr(an,dn)}function ll(n,i){var o=Tt;Tt|=2;var u=kp();(an!==n||dn!==i)&&(Hi=null,Wr(n,i));do try{mv();break}catch(d){zp(n,d)}while(!0);if(Vu(),Tt=o,tl.current=u,Kt!==null)throw Error(t(261));return an=null,dn=0,tn}function mv(){for(;Kt!==null;)Bp(Kt)}function gv(){for(;Kt!==null&&!ne();)Bp(Kt)}function Bp(n){var i=Wp(n.alternate,n,Xn);n.memoizedProps=n.pendingProps,i===null?Hp(n):Kt=i,yc.current=null}function Hp(n){var i=n;do{var o=i.alternate;if(n=i.return,(i.flags&32768)===0){if(o=lv(o,i,Xn),o!==null){Kt=o;return}}else{if(o=uv(o,i),o!==null){o.flags&=32767,Kt=o;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{tn=6,Kt=null;return}}if(i=i.sibling,i!==null){Kt=i;return}Kt=i=n}while(i!==null);tn===0&&(tn=5)}function Xr(n,i,o){var u=vt,d=ii.transition;try{ii.transition=null,vt=1,vv(n,i,o,u)}finally{ii.transition=d,vt=u}return null}function vv(n,i,o,u){do Ns();while(hr!==null);if((Tt&6)!==0)throw Error(t(327));o=n.finishedWork;var d=n.finishedLanes;if(o===null)return null;if(n.finishedWork=null,n.finishedLanes=0,o===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var m=o.lanes|o.childLanes;if(gn(n,m),n===an&&(Kt=an=null,dn=0),(o.subtreeFlags&2064)===0&&(o.flags&2064)===0||rl||(rl=!0,Xp(Ie,function(){return Ns(),null})),m=(o.flags&15990)!==0,(o.subtreeFlags&15990)!==0||m){m=ii.transition,ii.transition=null;var E=vt;vt=1;var D=Tt;Tt|=4,yc.current=null,fv(n,o),Lp(o,n),O0(bu),xa=!!Cu,bu=Cu=null,n.current=o,dv(o),ie(),Tt=D,vt=E,ii.transition=m}else n.current=o;if(rl&&(rl=!1,hr=n,sl=d),m=n.pendingLanes,m===0&&(dr=null),Rt(o.stateNode),Fn(n,W()),i!==null)for(u=n.onRecoverableError,o=0;o<i.length;o++)d=i[o],u(d.value,{componentStack:d.stack,digest:d.digest});if(il)throw il=!1,n=Ec,Ec=null,n;return(sl&1)!==0&&n.tag!==0&&Ns(),m=n.pendingLanes,(m&1)!==0?n===Tc?Ho++:(Ho=0,Tc=n):Ho=0,lr(),null}function Ns(){if(hr!==null){var n=bd(sl),i=ii.transition,o=vt;try{if(ii.transition=null,vt=16>n?16:n,hr===null)var u=!1;else{if(n=hr,hr=null,sl=0,(Tt&6)!==0)throw Error(t(331));var d=Tt;for(Tt|=4,Oe=n.current;Oe!==null;){var m=Oe,E=m.child;if((Oe.flags&16)!==0){var D=m.deletions;if(D!==null){for(var k=0;k<D.length;k++){var J=D[k];for(Oe=J;Oe!==null;){var ve=Oe;switch(ve.tag){case 0:case 11:case 15:zo(8,ve,m)}var _e=ve.child;if(_e!==null)_e.return=ve,Oe=_e;else for(;Oe!==null;){ve=Oe;var me=ve.sibling,Ue=ve.return;if(Ap(ve),ve===J){Oe=null;break}if(me!==null){me.return=Ue,Oe=me;break}Oe=Ue}}}var Be=m.alternate;if(Be!==null){var je=Be.child;if(je!==null){Be.child=null;do{var qt=je.sibling;je.sibling=null,je=qt}while(je!==null)}}Oe=m}}if((m.subtreeFlags&2064)!==0&&E!==null)E.return=m,Oe=E;else e:for(;Oe!==null;){if(m=Oe,(m.flags&2048)!==0)switch(m.tag){case 0:case 11:case 15:zo(9,m,m.return)}var q=m.sibling;if(q!==null){q.return=m.return,Oe=q;break e}Oe=m.return}}var G=n.current;for(Oe=G;Oe!==null;){E=Oe;var Q=E.child;if((E.subtreeFlags&2064)!==0&&Q!==null)Q.return=E,Oe=Q;else e:for(E=G;Oe!==null;){if(D=Oe,(D.flags&2048)!==0)try{switch(D.tag){case 0:case 11:case 15:el(9,D)}}catch(qe){jt(D,D.return,qe)}if(D===E){Oe=null;break e}var Te=D.sibling;if(Te!==null){Te.return=D.return,Oe=Te;break e}Oe=D.return}}if(Tt=d,lr(),ot&&typeof ot.onPostCommitFiberRoot=="function")try{ot.onPostCommitFiberRoot(Ze,n)}catch{}u=!0}return u}finally{vt=o,ii.transition=i}}return!1}function Vp(n,i,o){i=Ls(o,i),i=op(n,i,1),n=cr(n,i,1),i=An(),n!==null&&(Yt(n,1,i),Fn(n,i))}function jt(n,i,o){if(n.tag===3)Vp(n,n,o);else for(;i!==null;){if(i.tag===3){Vp(i,n,o);break}else if(i.tag===1){var u=i.stateNode;if(typeof i.type.getDerivedStateFromError=="function"||typeof u.componentDidCatch=="function"&&(dr===null||!dr.has(u))){n=Ls(o,n),n=ap(i,n,1),i=cr(i,n,1),n=An(),i!==null&&(Yt(i,1,n),Fn(i,n));break}}i=i.return}}function _v(n,i,o){var u=n.pingCache;u!==null&&u.delete(i),i=An(),n.pingedLanes|=n.suspendedLanes&o,an===n&&(dn&o)===o&&(tn===4||tn===3&&(dn&130023424)===dn&&500>W()-Mc?Wr(n,0):Sc|=o),Fn(n,i)}function Gp(n,i){i===0&&((n.mode&1)===0?i=1:(i=gt,gt<<=1,(gt&130023424)===0&&(gt=4194304)));var o=An();n=zi(n,i),n!==null&&(Yt(n,i,o),Fn(n,o))}function xv(n){var i=n.memoizedState,o=0;i!==null&&(o=i.retryLane),Gp(n,o)}function yv(n,i){var o=0;switch(n.tag){case 13:var u=n.stateNode,d=n.memoizedState;d!==null&&(o=d.retryLane);break;case 19:u=n.stateNode;break;default:throw Error(t(314))}u!==null&&u.delete(i),Gp(n,o)}var Wp;Wp=function(n,i,o){if(n!==null)if(n.memoizedProps!==i.pendingProps||Dn.current)Un=!0;else{if((n.lanes&o)===0&&(i.flags&128)===0)return Un=!1,av(n,i,o);Un=(n.flags&131072)!==0}else Un=!1,Vt&&(i.flags&1048576)!==0&&Eh(i,Oa,i.index);switch(i.lanes=0,i.tag){case 2:var u=i.type;Qa(n,i),n=i.pendingProps;var d=Es(i,vn.current);bs(i,o),d=Ju(null,i,u,n,d,o);var m=ec();return i.flags|=1,typeof d=="object"&&d!==null&&typeof d.render=="function"&&d.$$typeof===void 0?(i.tag=1,i.memoizedState=null,i.updateQueue=null,In(u)?(m=!0,Ua(i)):m=!1,i.memoizedState=d.state!==null&&d.state!==void 0?d.state:null,ju(i),d.updater=Ka,i.stateNode=d,d._reactInternals=i,oc(i,u,n,o),i=cc(null,i,u,!0,m,o)):(i.tag=0,Vt&&m&&Fu(i),wn(null,i,d,o),i=i.child),i;case 16:u=i.elementType;e:{switch(Qa(n,i),n=i.pendingProps,d=u._init,u=d(u._payload),i.type=u,d=i.tag=Mv(u),n=ui(u,n),d){case 0:i=uc(null,i,u,n,o);break e;case 1:i=gp(null,i,u,n,o);break e;case 11:i=fp(null,i,u,n,o);break e;case 14:i=dp(null,i,u,ui(u.type,n),o);break e}throw Error(t(306,u,""))}return i;case 0:return u=i.type,d=i.pendingProps,d=i.elementType===u?d:ui(u,d),uc(n,i,u,d,o);case 1:return u=i.type,d=i.pendingProps,d=i.elementType===u?d:ui(u,d),gp(n,i,u,d,o);case 3:e:{if(vp(i),n===null)throw Error(t(387));u=i.pendingProps,m=i.memoizedState,d=m.element,Dh(n,i),Ga(i,u,null,o);var E=i.memoizedState;if(u=E.element,m.isDehydrated)if(m={element:u,isDehydrated:!1,cache:E.cache,pendingSuspenseBoundaries:E.pendingSuspenseBoundaries,transitions:E.transitions},i.updateQueue.baseState=m,i.memoizedState=m,i.flags&256){d=Ls(Error(t(423)),i),i=_p(n,i,u,o,d);break e}else if(u!==d){d=Ls(Error(t(424)),i),i=_p(n,i,u,o,d);break e}else for(Wn=sr(i.stateNode.containerInfo.firstChild),Gn=i,Vt=!0,li=null,o=Ph(i,null,u,o),i.child=o;o;)o.flags=o.flags&-3|4096,o=o.sibling;else{if(As(),u===d){i=Bi(n,i,o);break e}wn(n,i,u,o)}i=i.child}return i;case 5:return Nh(i),n===null&&ku(i),u=i.type,d=i.pendingProps,m=n!==null?n.memoizedProps:null,E=d.children,Pu(u,d)?E=null:m!==null&&Pu(u,m)&&(i.flags|=32),mp(n,i),wn(n,i,E,o),i.child;case 6:return n===null&&ku(i),null;case 13:return xp(n,i,o);case 4:return Yu(i,i.stateNode.containerInfo),u=i.pendingProps,n===null?i.child=Rs(i,null,u,o):wn(n,i,u,o),i.child;case 11:return u=i.type,d=i.pendingProps,d=i.elementType===u?d:ui(u,d),fp(n,i,u,d,o);case 7:return wn(n,i,i.pendingProps,o),i.child;case 8:return wn(n,i,i.pendingProps.children,o),i.child;case 12:return wn(n,i,i.pendingProps.children,o),i.child;case 10:e:{if(u=i.type._context,d=i.pendingProps,m=i.memoizedProps,E=d.value,Ot(Ba,u._currentValue),u._currentValue=E,m!==null)if(ai(m.value,E)){if(m.children===d.children&&!Dn.current){i=Bi(n,i,o);break e}}else for(m=i.child,m!==null&&(m.return=i);m!==null;){var D=m.dependencies;if(D!==null){E=m.child;for(var k=D.firstContext;k!==null;){if(k.context===u){if(m.tag===1){k=ki(-1,o&-o),k.tag=2;var J=m.updateQueue;if(J!==null){J=J.shared;var ve=J.pending;ve===null?k.next=k:(k.next=ve.next,ve.next=k),J.pending=k}}m.lanes|=o,k=m.alternate,k!==null&&(k.lanes|=o),Wu(m.return,o,i),D.lanes|=o;break}k=k.next}}else if(m.tag===10)E=m.type===i.type?null:m.child;else if(m.tag===18){if(E=m.return,E===null)throw Error(t(341));E.lanes|=o,D=E.alternate,D!==null&&(D.lanes|=o),Wu(E,o,i),E=m.sibling}else E=m.child;if(E!==null)E.return=m;else for(E=m;E!==null;){if(E===i){E=null;break}if(m=E.sibling,m!==null){m.return=E.return,E=m;break}E=E.return}m=E}wn(n,i,d.children,o),i=i.child}return i;case 9:return d=i.type,u=i.pendingProps.children,bs(i,o),d=ti(d),u=u(d),i.flags|=1,wn(n,i,u,o),i.child;case 14:return u=i.type,d=ui(u,i.pendingProps),d=ui(u.type,d),dp(n,i,u,d,o);case 15:return hp(n,i,i.type,i.pendingProps,o);case 17:return u=i.type,d=i.pendingProps,d=i.elementType===u?d:ui(u,d),Qa(n,i),i.tag=1,In(u)?(n=!0,Ua(i)):n=!1,bs(i,o),rp(i,u,d),oc(i,u,d,o),cc(null,i,u,!0,n,o);case 19:return Sp(n,i,o);case 22:return pp(n,i,o)}throw Error(t(156,i.tag))};function Xp(n,i){return A(n,i)}function Sv(n,i,o,u){this.tag=n,this.key=o,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=i,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=u,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ri(n,i,o,u){return new Sv(n,i,o,u)}function Pc(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Mv(n){if(typeof n=="function")return Pc(n)?1:0;if(n!=null){if(n=n.$$typeof,n===$)return 11;if(n===ae)return 14}return 2}function gr(n,i){var o=n.alternate;return o===null?(o=ri(n.tag,i,n.key,n.mode),o.elementType=n.elementType,o.type=n.type,o.stateNode=n.stateNode,o.alternate=n,n.alternate=o):(o.pendingProps=i,o.type=n.type,o.flags=0,o.subtreeFlags=0,o.deletions=null),o.flags=n.flags&14680064,o.childLanes=n.childLanes,o.lanes=n.lanes,o.child=n.child,o.memoizedProps=n.memoizedProps,o.memoizedState=n.memoizedState,o.updateQueue=n.updateQueue,i=n.dependencies,o.dependencies=i===null?null:{lanes:i.lanes,firstContext:i.firstContext},o.sibling=n.sibling,o.index=n.index,o.ref=n.ref,o}function ul(n,i,o,u,d,m){var E=2;if(u=n,typeof n=="function")Pc(n)&&(E=1);else if(typeof n=="string")E=5;else e:switch(n){case O:return jr(o.children,d,m,i);case X:E=8,d|=8;break;case C:return n=ri(12,o,i,d|2),n.elementType=C,n.lanes=m,n;case te:return n=ri(13,o,i,d),n.elementType=te,n.lanes=m,n;case ue:return n=ri(19,o,i,d),n.elementType=ue,n.lanes=m,n;case he:return cl(o,d,m,i);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case R:E=10;break e;case B:E=9;break e;case $:E=11;break e;case ae:E=14;break e;case oe:E=16,u=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return i=ri(E,o,i,d),i.elementType=n,i.type=u,i.lanes=m,i}function jr(n,i,o,u){return n=ri(7,n,u,i),n.lanes=o,n}function cl(n,i,o,u){return n=ri(22,n,u,i),n.elementType=he,n.lanes=o,n.stateNode={isHidden:!1},n}function Lc(n,i,o){return n=ri(6,n,null,i),n.lanes=o,n}function Dc(n,i,o){return i=ri(4,n.children!==null?n.children:[],n.key,i),i.lanes=o,i.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},i}function Ev(n,i,o,u,d){this.tag=i,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=mn(0),this.expirationTimes=mn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=mn(0),this.identifierPrefix=u,this.onRecoverableError=d,this.mutableSourceEagerHydrationData=null}function Ic(n,i,o,u,d,m,E,D,k){return n=new Ev(n,i,o,D,k),i===1?(i=1,m===!0&&(i|=8)):i=0,m=ri(3,null,null,i),n.current=m,m.stateNode=n,m.memoizedState={element:u,isDehydrated:o,cache:null,transitions:null,pendingSuspenseBoundaries:null},ju(m),n}function Tv(n,i,o){var u=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:F,key:u==null?null:""+u,children:n,containerInfo:i,implementation:o}}function jp(n){if(!n)return ar;n=n._reactInternals;e:{if(Ii(n)!==n||n.tag!==1)throw Error(t(170));var i=n;do{switch(i.tag){case 3:i=i.stateNode.context;break e;case 1:if(In(i.type)){i=i.stateNode.__reactInternalMemoizedMergedChildContext;break e}}i=i.return}while(i!==null);throw Error(t(171))}if(n.tag===1){var o=n.type;if(In(o))return yh(n,o,i)}return i}function Yp(n,i,o,u,d,m,E,D,k){return n=Ic(o,u,!0,n,d,m,E,D,k),n.context=jp(null),o=n.current,u=An(),d=pr(o),m=ki(u,d),m.callback=i??null,cr(o,m,d),n.current.lanes=d,Yt(n,d,u),Fn(n,u),n}function fl(n,i,o,u){var d=i.current,m=An(),E=pr(d);return o=jp(o),i.context===null?i.context=o:i.pendingContext=o,i=ki(m,E),i.payload={element:n},u=u===void 0?null:u,u!==null&&(i.callback=u),n=cr(d,i,E),n!==null&&(di(n,d,E,m),Va(n,d,E)),E}function dl(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function qp(n,i){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var o=n.retryLane;n.retryLane=o!==0&&o<i?o:i}}function Uc(n,i){qp(n,i),(n=n.alternate)&&qp(n,i)}function wv(){return null}var $p=typeof reportError=="function"?reportError:function(n){console.error(n)};function Nc(n){this._internalRoot=n}hl.prototype.render=Nc.prototype.render=function(n){var i=this._internalRoot;if(i===null)throw Error(t(409));fl(n,i,null,null)},hl.prototype.unmount=Nc.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var i=n.containerInfo;Gr(function(){fl(null,n,null,null)}),i[Ui]=null}};function hl(n){this._internalRoot=n}hl.prototype.unstable_scheduleHydration=function(n){if(n){var i=Dd();n={blockedOn:null,target:n,priority:i};for(var o=0;o<nr.length&&i!==0&&i<nr[o].priority;o++);nr.splice(o,0,n),o===0&&Nd(n)}};function Fc(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function pl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function Kp(){}function Av(n,i,o,u,d){if(d){if(typeof u=="function"){var m=u;u=function(){var J=dl(E);m.call(J)}}var E=Yp(i,u,n,0,null,!1,!1,"",Kp);return n._reactRootContainer=E,n[Ui]=E.current,wo(n.nodeType===8?n.parentNode:n),Gr(),E}for(;d=n.lastChild;)n.removeChild(d);if(typeof u=="function"){var D=u;u=function(){var J=dl(k);D.call(J)}}var k=Ic(n,0,!1,null,null,!1,!1,"",Kp);return n._reactRootContainer=k,n[Ui]=k.current,wo(n.nodeType===8?n.parentNode:n),Gr(function(){fl(i,k,o,u)}),k}function ml(n,i,o,u,d){var m=o._reactRootContainer;if(m){var E=m;if(typeof d=="function"){var D=d;d=function(){var k=dl(E);D.call(k)}}fl(i,E,n,d)}else E=Av(o,i,n,d,u);return dl(E)}Pd=function(n){switch(n.tag){case 3:var i=n.stateNode;if(i.current.memoizedState.isDehydrated){var o=Jt(i.pendingLanes);o!==0&&(Ur(i,o|1),Fn(i,W()),(Tt&6)===0&&(Us=W()+500,lr()))}break;case 13:Gr(function(){var u=zi(n,1);if(u!==null){var d=An();di(u,n,1,d)}}),Uc(n,1)}},au=function(n){if(n.tag===13){var i=zi(n,134217728);if(i!==null){var o=An();di(i,n,134217728,o)}Uc(n,134217728)}},Ld=function(n){if(n.tag===13){var i=pr(n),o=zi(n,i);if(o!==null){var u=An();di(o,n,i,u)}Uc(n,i)}},Dd=function(){return vt},Id=function(n,i){var o=vt;try{return vt=n,i()}finally{vt=o}},ye=function(n,i,o){switch(i){case"input":if(Ve(n,o),i=o.name,o.type==="radio"&&i!=null){for(o=n;o.parentNode;)o=o.parentNode;for(o=o.querySelectorAll("input[name="+JSON.stringify(""+i)+'][type="radio"]'),i=0;i<o.length;i++){var u=o[i];if(u!==n&&u.form===n.form){var d=Da(u);if(!d)throw Error(t(90));Qt(u),Ve(u,d)}}}break;case"textarea":T(n,o);break;case"select":i=o.value,i!=null&&zt(n,!!o.multiple,i,!1)}},ut=Rc,Ct=Gr;var Rv={usingClientEntryPoint:!1,Events:[Co,Ss,Da,pe,We,Rc]},Vo={findFiberByHostInstance:Nr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Cv={bundleType:Vo.bundleType,version:Vo.version,rendererPackageName:Vo.rendererPackageName,rendererConfig:Vo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:b.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=ma(n),n===null?null:n.stateNode},findFiberByHostInstance:Vo.findFiberByHostInstance||wv,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var gl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!gl.isDisabled&&gl.supportsFiber)try{Ze=gl.inject(Cv),ot=gl}catch{}}return On.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Rv,On.createPortal=function(n,i){var o=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Fc(i))throw Error(t(200));return Tv(n,i,null,o)},On.createRoot=function(n,i){if(!Fc(n))throw Error(t(299));var o=!1,u="",d=$p;return i!=null&&(i.unstable_strictMode===!0&&(o=!0),i.identifierPrefix!==void 0&&(u=i.identifierPrefix),i.onRecoverableError!==void 0&&(d=i.onRecoverableError)),i=Ic(n,1,!1,null,null,o,!1,u,d),n[Ui]=i.current,wo(n.nodeType===8?n.parentNode:n),new Nc(i)},On.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var i=n._reactInternals;if(i===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=ma(i),n=n===null?null:n.stateNode,n},On.flushSync=function(n){return Gr(n)},On.hydrate=function(n,i,o){if(!pl(i))throw Error(t(200));return ml(null,n,i,!0,o)},On.hydrateRoot=function(n,i,o){if(!Fc(n))throw Error(t(405));var u=o!=null&&o.hydratedSources||null,d=!1,m="",E=$p;if(o!=null&&(o.unstable_strictMode===!0&&(d=!0),o.identifierPrefix!==void 0&&(m=o.identifierPrefix),o.onRecoverableError!==void 0&&(E=o.onRecoverableError)),i=Yp(i,null,n,1,o??null,d,!1,m,E),n[Ui]=i.current,wo(n),u)for(n=0;n<u.length;n++)o=u[n],d=o._getVersion,d=d(o._source),i.mutableSourceEagerHydrationData==null?i.mutableSourceEagerHydrationData=[o,d]:i.mutableSourceEagerHydrationData.push(o,d);return new hl(i)},On.render=function(n,i,o){if(!pl(i))throw Error(t(200));return ml(null,n,i,!1,o)},On.unmountComponentAtNode=function(n){if(!pl(n))throw Error(t(40));return n._reactRootContainer?(Gr(function(){ml(null,null,n,!1,function(){n._reactRootContainer=null,n[Ui]=null})}),!0):!1},On.unstable_batchedUpdates=Rc,On.unstable_renderSubtreeIntoContainer=function(n,i,o,u){if(!pl(o))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return ml(n,i,o,!1,u)},On.version="18.3.1-next-f1338f8080-20240426",On}var rm;function zv(){if(rm)return kc.exports;rm=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),kc.exports=Ov(),kc.exports}var sm;function kv(){if(sm)return vl;sm=1;var s=zv();return vl.createRoot=s.createRoot,vl.hydrateRoot=s.hydrateRoot,vl}var Bv=kv();/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const pd="180",Hv=0,om=1,Vv=2,pg=1,Gv=2,Yi=3,Pr=0,Bn=1,$i=2,Cr=0,Qs=1,am=2,lm=3,um=4,Wv=5,ns=100,Xv=101,jv=102,Yv=103,qv=104,$v=200,Kv=201,Zv=202,Qv=203,Ef=204,Tf=205,Jv=206,e_=207,t_=208,n_=209,i_=210,r_=211,s_=212,o_=213,a_=214,wf=0,Af=1,Rf=2,eo=3,Cf=4,bf=5,Pf=6,Lf=7,mg=0,l_=1,u_=2,br=0,c_=1,f_=2,d_=3,gg=4,h_=5,p_=6,m_=7,vg=300,to=301,no=302,Df=303,If=304,nu=306,Uf=1e3,rs=1001,Nf=1002,_i=1003,g_=1004,_l=1005,wi=1006,Vc=1007,ss=1008,bi=1009,_g=1010,xg=1011,ea=1012,md=1013,us=1014,Ki=1015,la=1016,gd=1017,vd=1018,ta=1020,yg=35902,Sg=35899,Mg=1021,Eg=1022,vi=1023,na=1026,ia=1027,Tg=1028,_d=1029,wg=1030,xd=1031,yd=1033,Wl=33776,Xl=33777,jl=33778,Yl=33779,Ff=35840,Of=35841,zf=35842,kf=35843,Bf=36196,Hf=37492,Vf=37496,Gf=37808,Wf=37809,Xf=37810,jf=37811,Yf=37812,qf=37813,$f=37814,Kf=37815,Zf=37816,Qf=37817,Jf=37818,ed=37819,td=37820,nd=37821,id=36492,rd=36494,sd=36495,od=36283,ad=36284,ld=36285,ud=36286,v_=3200,__=3201,Ag=0,x_=1,wr="",qn="srgb",io="srgb-linear",$l="linear",Dt="srgb",Fs=7680,cm=519,y_=512,S_=513,M_=514,Rg=515,E_=516,T_=517,w_=518,A_=519,fm=35044,dm="300 es",Ai=2e3,Kl=2001;class oo{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){const r=this._listeners;return r===void 0?!1:r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){const r=this._listeners;if(r===void 0)return;const a=r[e];if(a!==void 0){const l=a.indexOf(t);l!==-1&&a.splice(l,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const r=t[e.type];if(r!==void 0){e.target=this;const a=r.slice(0);for(let l=0,c=a.length;l<c;l++)a[l].call(this,e);e.target=null}}}const Sn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let hm=1234567;const Qo=Math.PI/180,ra=180/Math.PI;function ao(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(Sn[s&255]+Sn[s>>8&255]+Sn[s>>16&255]+Sn[s>>24&255]+"-"+Sn[e&255]+Sn[e>>8&255]+"-"+Sn[e>>16&15|64]+Sn[e>>24&255]+"-"+Sn[t&63|128]+Sn[t>>8&255]+"-"+Sn[t>>16&255]+Sn[t>>24&255]+Sn[r&255]+Sn[r>>8&255]+Sn[r>>16&255]+Sn[r>>24&255]).toLowerCase()}function xt(s,e,t){return Math.max(e,Math.min(t,s))}function Sd(s,e){return(s%e+e)%e}function R_(s,e,t,r,a){return r+(s-e)*(a-r)/(t-e)}function C_(s,e,t){return s!==e?(t-s)/(e-s):0}function Jo(s,e,t){return(1-t)*s+t*e}function b_(s,e,t,r){return Jo(s,e,1-Math.exp(-t*r))}function P_(s,e=1){return e-Math.abs(Sd(s,e*2)-e)}function L_(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function D_(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function I_(s,e){return s+Math.floor(Math.random()*(e-s+1))}function U_(s,e){return s+Math.random()*(e-s)}function N_(s){return s*(.5-Math.random())}function F_(s){s!==void 0&&(hm=s);let e=hm+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function O_(s){return s*Qo}function z_(s){return s*ra}function k_(s){return(s&s-1)===0&&s!==0}function B_(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function H_(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function V_(s,e,t,r,a){const l=Math.cos,c=Math.sin,f=l(t/2),h=c(t/2),p=l((e+r)/2),g=c((e+r)/2),v=l((e-r)/2),x=c((e-r)/2),S=l((r-e)/2),M=c((r-e)/2);switch(a){case"XYX":s.set(f*g,h*v,h*x,f*p);break;case"YZY":s.set(h*x,f*g,h*v,f*p);break;case"ZXZ":s.set(h*v,h*x,f*g,f*p);break;case"XZX":s.set(f*g,h*M,h*S,f*p);break;case"YXY":s.set(h*S,f*g,h*M,f*p);break;case"ZYZ":s.set(h*M,h*S,f*g,f*p);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Ks(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Cn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const xl={DEG2RAD:Qo,RAD2DEG:ra,generateUUID:ao,clamp:xt,euclideanModulo:Sd,mapLinear:R_,inverseLerp:C_,lerp:Jo,damp:b_,pingpong:P_,smoothstep:L_,smootherstep:D_,randInt:I_,randFloat:U_,randFloatSpread:N_,seededRandom:F_,degToRad:O_,radToDeg:z_,isPowerOfTwo:k_,ceilPowerOfTwo:B_,floorPowerOfTwo:H_,setQuaternionFromProperEuler:V_,normalize:Cn,denormalize:Ks};class St{constructor(e=0,t=0){St.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,a=e.elements;return this.x=a[0]*t+a[3]*r+a[6],this.y=a[1]*t+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=xt(this.x,e.x,t.x),this.y=xt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=xt(this.x,e,t),this.y=xt(this.y,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(xt(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(xt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),a=Math.sin(t),l=this.x-e.x,c=this.y-e.y;return this.x=l*r-c*a+e.x,this.y=l*a+c*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ua{constructor(e=0,t=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=a}static slerpFlat(e,t,r,a,l,c,f){let h=r[a+0],p=r[a+1],g=r[a+2],v=r[a+3];const x=l[c+0],S=l[c+1],M=l[c+2],w=l[c+3];if(f===0){e[t+0]=h,e[t+1]=p,e[t+2]=g,e[t+3]=v;return}if(f===1){e[t+0]=x,e[t+1]=S,e[t+2]=M,e[t+3]=w;return}if(v!==w||h!==x||p!==S||g!==M){let y=1-f;const _=h*x+p*S+g*M+v*w,I=_>=0?1:-1,L=1-_*_;if(L>Number.EPSILON){const z=Math.sqrt(L),F=Math.atan2(z,_*I);y=Math.sin(y*F)/z,f=Math.sin(f*F)/z}const b=f*I;if(h=h*y+x*b,p=p*y+S*b,g=g*y+M*b,v=v*y+w*b,y===1-f){const z=1/Math.sqrt(h*h+p*p+g*g+v*v);h*=z,p*=z,g*=z,v*=z}}e[t]=h,e[t+1]=p,e[t+2]=g,e[t+3]=v}static multiplyQuaternionsFlat(e,t,r,a,l,c){const f=r[a],h=r[a+1],p=r[a+2],g=r[a+3],v=l[c],x=l[c+1],S=l[c+2],M=l[c+3];return e[t]=f*M+g*v+h*S-p*x,e[t+1]=h*M+g*x+p*v-f*S,e[t+2]=p*M+g*S+f*x-h*v,e[t+3]=g*M-f*v-h*x-p*S,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,a){return this._x=e,this._y=t,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,a=e._y,l=e._z,c=e._order,f=Math.cos,h=Math.sin,p=f(r/2),g=f(a/2),v=f(l/2),x=h(r/2),S=h(a/2),M=h(l/2);switch(c){case"XYZ":this._x=x*g*v+p*S*M,this._y=p*S*v-x*g*M,this._z=p*g*M+x*S*v,this._w=p*g*v-x*S*M;break;case"YXZ":this._x=x*g*v+p*S*M,this._y=p*S*v-x*g*M,this._z=p*g*M-x*S*v,this._w=p*g*v+x*S*M;break;case"ZXY":this._x=x*g*v-p*S*M,this._y=p*S*v+x*g*M,this._z=p*g*M+x*S*v,this._w=p*g*v-x*S*M;break;case"ZYX":this._x=x*g*v-p*S*M,this._y=p*S*v+x*g*M,this._z=p*g*M-x*S*v,this._w=p*g*v+x*S*M;break;case"YZX":this._x=x*g*v+p*S*M,this._y=p*S*v+x*g*M,this._z=p*g*M-x*S*v,this._w=p*g*v-x*S*M;break;case"XZY":this._x=x*g*v-p*S*M,this._y=p*S*v-x*g*M,this._z=p*g*M+x*S*v,this._w=p*g*v+x*S*M;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],a=t[4],l=t[8],c=t[1],f=t[5],h=t[9],p=t[2],g=t[6],v=t[10],x=r+f+v;if(x>0){const S=.5/Math.sqrt(x+1);this._w=.25/S,this._x=(g-h)*S,this._y=(l-p)*S,this._z=(c-a)*S}else if(r>f&&r>v){const S=2*Math.sqrt(1+r-f-v);this._w=(g-h)/S,this._x=.25*S,this._y=(a+c)/S,this._z=(l+p)/S}else if(f>v){const S=2*Math.sqrt(1+f-r-v);this._w=(l-p)/S,this._x=(a+c)/S,this._y=.25*S,this._z=(h+g)/S}else{const S=2*Math.sqrt(1+v-r-f);this._w=(c-a)/S,this._x=(l+p)/S,this._y=(h+g)/S,this._z=.25*S}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<1e-8?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(xt(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,t/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,a=e._y,l=e._z,c=e._w,f=t._x,h=t._y,p=t._z,g=t._w;return this._x=r*g+c*f+a*p-l*h,this._y=a*g+c*h+l*f-r*p,this._z=l*g+c*p+r*h-a*f,this._w=c*g-r*f-a*h-l*p,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const r=this._x,a=this._y,l=this._z,c=this._w;let f=c*e._w+r*e._x+a*e._y+l*e._z;if(f<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,f=-f):this.copy(e),f>=1)return this._w=c,this._x=r,this._y=a,this._z=l,this;const h=1-f*f;if(h<=Number.EPSILON){const S=1-t;return this._w=S*c+t*this._w,this._x=S*r+t*this._x,this._y=S*a+t*this._y,this._z=S*l+t*this._z,this.normalize(),this}const p=Math.sqrt(h),g=Math.atan2(p,f),v=Math.sin((1-t)*g)/p,x=Math.sin(t*g)/p;return this._w=c*v+this._w*x,this._x=r*v+this._x*x,this._y=a*v+this._y*x,this._z=l*v+this._z*x,this._onChangeCallback(),this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),l=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),l*Math.sin(t),l*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class j{constructor(e=0,t=0,r=0){j.prototype.isVector3=!0,this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(pm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(pm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[3]*r+l[6]*a,this.y=l[1]*t+l[4]*r+l[7]*a,this.z=l[2]*t+l[5]*r+l[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=e.elements,c=1/(l[3]*t+l[7]*r+l[11]*a+l[15]);return this.x=(l[0]*t+l[4]*r+l[8]*a+l[12])*c,this.y=(l[1]*t+l[5]*r+l[9]*a+l[13])*c,this.z=(l[2]*t+l[6]*r+l[10]*a+l[14])*c,this}applyQuaternion(e){const t=this.x,r=this.y,a=this.z,l=e.x,c=e.y,f=e.z,h=e.w,p=2*(c*a-f*r),g=2*(f*t-l*a),v=2*(l*r-c*t);return this.x=t+h*p+c*v-f*g,this.y=r+h*g+f*p-l*v,this.z=a+h*v+l*g-c*p,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,a=this.z,l=e.elements;return this.x=l[0]*t+l[4]*r+l[8]*a,this.y=l[1]*t+l[5]*r+l[9]*a,this.z=l[2]*t+l[6]*r+l[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=xt(this.x,e.x,t.x),this.y=xt(this.y,e.y,t.y),this.z=xt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=xt(this.x,e,t),this.y=xt(this.y,e,t),this.z=xt(this.z,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(xt(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,a=e.y,l=e.z,c=t.x,f=t.y,h=t.z;return this.x=a*h-l*f,this.y=l*c-r*h,this.z=r*f-a*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return Gc.copy(this).projectOnVector(e),this.sub(Gc)}reflect(e){return this.sub(Gc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(xt(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return t*t+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const a=Math.sin(t)*e;return this.x=a*Math.sin(r),this.y=Math.cos(t)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Gc=new j,pm=new ua;class dt{constructor(e,t,r,a,l,c,f,h,p){dt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,c,f,h,p)}set(e,t,r,a,l,c,f,h,p){const g=this.elements;return g[0]=e,g[1]=a,g[2]=f,g[3]=t,g[4]=l,g[5]=h,g[6]=r,g[7]=c,g[8]=p,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,c=r[0],f=r[3],h=r[6],p=r[1],g=r[4],v=r[7],x=r[2],S=r[5],M=r[8],w=a[0],y=a[3],_=a[6],I=a[1],L=a[4],b=a[7],z=a[2],F=a[5],O=a[8];return l[0]=c*w+f*I+h*z,l[3]=c*y+f*L+h*F,l[6]=c*_+f*b+h*O,l[1]=p*w+g*I+v*z,l[4]=p*y+g*L+v*F,l[7]=p*_+g*b+v*O,l[2]=x*w+S*I+M*z,l[5]=x*y+S*L+M*F,l[8]=x*_+S*b+M*O,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],c=e[4],f=e[5],h=e[6],p=e[7],g=e[8];return t*c*g-t*f*p-r*l*g+r*f*h+a*l*p-a*c*h}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],c=e[4],f=e[5],h=e[6],p=e[7],g=e[8],v=g*c-f*p,x=f*h-g*l,S=p*l-c*h,M=t*v+r*x+a*S;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/M;return e[0]=v*w,e[1]=(a*p-g*r)*w,e[2]=(f*r-a*c)*w,e[3]=x*w,e[4]=(g*t-a*h)*w,e[5]=(a*l-f*t)*w,e[6]=S*w,e[7]=(r*h-p*t)*w,e[8]=(c*t-r*l)*w,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,a,l,c,f){const h=Math.cos(l),p=Math.sin(l);return this.set(r*h,r*p,-r*(h*c+p*f)+c+e,-a*p,a*h,-a*(-p*c+h*f)+f+t,0,0,1),this}scale(e,t){return this.premultiply(Wc.makeScale(e,t)),this}rotate(e){return this.premultiply(Wc.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<9;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wc=new dt;function Cg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Zl(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function G_(){const s=Zl("canvas");return s.style.display="block",s}const mm={};function sa(s){s in mm||(mm[s]=!0,console.warn(s))}function W_(s,e,t){return new Promise(function(r,a){function l(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:a();break;case s.TIMEOUT_EXPIRED:setTimeout(l,t);break;default:r()}}setTimeout(l,t)})}const gm=new dt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),vm=new dt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function X_(){const s={enabled:!0,workingColorSpace:io,spaces:{},convert:function(a,l,c){return this.enabled===!1||l===c||!l||!c||(this.spaces[l].transfer===Dt&&(a.r=Zi(a.r),a.g=Zi(a.g),a.b=Zi(a.b)),this.spaces[l].primaries!==this.spaces[c].primaries&&(a.applyMatrix3(this.spaces[l].toXYZ),a.applyMatrix3(this.spaces[c].fromXYZ)),this.spaces[c].transfer===Dt&&(a.r=Js(a.r),a.g=Js(a.g),a.b=Js(a.b))),a},workingToColorSpace:function(a,l){return this.convert(a,this.workingColorSpace,l)},colorSpaceToWorking:function(a,l){return this.convert(a,l,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===wr?$l:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,l=this.workingColorSpace){return a.fromArray(this.spaces[l].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,l,c){return a.copy(this.spaces[l].toXYZ).multiply(this.spaces[c].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(a,l){return sa("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(a,l)},toWorkingColorSpace:function(a,l){return sa("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(a,l)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],r=[.3127,.329];return s.define({[io]:{primaries:e,whitePoint:r,transfer:$l,toXYZ:gm,fromXYZ:vm,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:qn},outputColorSpaceConfig:{drawingBufferColorSpace:qn}},[qn]:{primaries:e,whitePoint:r,transfer:Dt,toXYZ:gm,fromXYZ:vm,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:qn}}}),s}const At=X_();function Zi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Js(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let Os;class j_{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let r;if(e instanceof HTMLCanvasElement)r=e;else{Os===void 0&&(Os=Zl("canvas")),Os.width=e.width,Os.height=e.height;const a=Os.getContext("2d");e instanceof ImageData?a.putImageData(e,0,0):a.drawImage(e,0,0,e.width,e.height),r=Os}return r.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Zl("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),l=a.data;for(let c=0;c<l.length;c++)l[c]=Zi(l[c]/255)*255;return r.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Zi(t[r]/255)*255):t[r]=Zi(t[r]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Y_=0;class Md{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Y_++}),this.uuid=ao(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let l;if(Array.isArray(a)){l=[];for(let c=0,f=a.length;c<f;c++)a[c].isDataTexture?l.push(Xc(a[c].image)):l.push(Xc(a[c]))}else l=Xc(a);r.url=l}return t||(e.images[this.uuid]=r),r}}function Xc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?j_.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let q_=0;const jc=new j;class Ln extends oo{constructor(e=Ln.DEFAULT_IMAGE,t=Ln.DEFAULT_MAPPING,r=rs,a=rs,l=wi,c=ss,f=vi,h=bi,p=Ln.DEFAULT_ANISOTROPY,g=wr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:q_++}),this.uuid=ao(),this.name="",this.source=new Md(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=l,this.minFilter=c,this.anisotropy=p,this.format=f,this.internalFormat=null,this.type=h,this.offset=new St(0,0),this.repeat=new St(1,1),this.center=new St(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new dt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=g,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(jc).x}get height(){return this.source.getSize(jc).y}get depth(){return this.source.getSize(jc).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const r=e[t];if(r===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}a&&r&&a.isVector2&&r.isVector2||a&&r&&a.isVector3&&r.isVector3||a&&r&&a.isMatrix3&&r.isMatrix3?a.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==vg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Uf:e.x=e.x-Math.floor(e.x);break;case rs:e.x=e.x<0?0:1;break;case Nf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Uf:e.y=e.y-Math.floor(e.y);break;case rs:e.y=e.y<0?0:1;break;case Nf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ln.DEFAULT_IMAGE=null;Ln.DEFAULT_MAPPING=vg;Ln.DEFAULT_ANISOTROPY=1;class It{constructor(e=0,t=0,r=0,a=1){It.prototype.isVector4=!0,this.x=e,this.y=t,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,a){return this.x=e,this.y=t,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,l=this.w,c=e.elements;return this.x=c[0]*t+c[4]*r+c[8]*a+c[12]*l,this.y=c[1]*t+c[5]*r+c[9]*a+c[13]*l,this.z=c[2]*t+c[6]*r+c[10]*a+c[14]*l,this.w=c[3]*t+c[7]*r+c[11]*a+c[15]*l,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,a,l;const h=e.elements,p=h[0],g=h[4],v=h[8],x=h[1],S=h[5],M=h[9],w=h[2],y=h[6],_=h[10];if(Math.abs(g-x)<.01&&Math.abs(v-w)<.01&&Math.abs(M-y)<.01){if(Math.abs(g+x)<.1&&Math.abs(v+w)<.1&&Math.abs(M+y)<.1&&Math.abs(p+S+_-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const L=(p+1)/2,b=(S+1)/2,z=(_+1)/2,F=(g+x)/4,O=(v+w)/4,X=(M+y)/4;return L>b&&L>z?L<.01?(r=0,a=.707106781,l=.707106781):(r=Math.sqrt(L),a=F/r,l=O/r):b>z?b<.01?(r=.707106781,a=0,l=.707106781):(a=Math.sqrt(b),r=F/a,l=X/a):z<.01?(r=.707106781,a=.707106781,l=0):(l=Math.sqrt(z),r=O/l,a=X/l),this.set(r,a,l,t),this}let I=Math.sqrt((y-M)*(y-M)+(v-w)*(v-w)+(x-g)*(x-g));return Math.abs(I)<.001&&(I=1),this.x=(y-M)/I,this.y=(v-w)/I,this.z=(x-g)/I,this.w=Math.acos((p+S+_-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=xt(this.x,e.x,t.x),this.y=xt(this.y,e.y,t.y),this.z=xt(this.z,e.z,t.z),this.w=xt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=xt(this.x,e,t),this.y=xt(this.y,e,t),this.z=xt(this.z,e,t),this.w=xt(this.w,e,t),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(xt(r,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class $_ extends oo{constructor(e=1,t=1,r={}){super(),r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:wi,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},r),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=r.depth,this.scissor=new It(0,0,e,t),this.scissorTest=!1,this.viewport=new It(0,0,e,t);const a={width:e,height:t,depth:r.depth},l=new Ln(a);this.textures=[];const c=r.count;for(let f=0;f<c;f++)this.textures[f]=l.clone(),this.textures[f].isRenderTargetTexture=!0,this.textures[f].renderTarget=this;this._setTextureOptions(r),this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=r.depthTexture,this.samples=r.samples,this.multiview=r.multiview}_setTextureOptions(e={}){const t={minFilter:wi,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let r=0;r<this.textures.length;r++)this.textures[r].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let a=0,l=this.textures.length;a<l;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=r,this.textures[a].isArrayTexture=this.textures[a].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,r=e.textures.length;t<r;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const a=Object.assign({},e.textures[t].image);this.textures[t].source=new Md(a)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class cs extends $_{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class bg extends Ln{constructor(e=null,t=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=_i,this.minFilter=_i,this.wrapR=rs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class K_ extends Ln{constructor(e=null,t=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=_i,this.minFilter=_i,this.wrapR=rs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ca{constructor(e=new j(1/0,1/0,1/0),t=new j(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(hi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(hi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=hi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const l=r.getAttribute("position");if(t===!0&&l!==void 0&&e.isInstancedMesh!==!0)for(let c=0,f=l.count;c<f;c++)e.isMesh===!0?e.getVertexPosition(c,hi):hi.fromBufferAttribute(l,c),hi.applyMatrix4(e.matrixWorld),this.expandByPoint(hi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),yl.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),yl.copy(r.boundingBox)),yl.applyMatrix4(e.matrixWorld),this.union(yl)}const a=e.children;for(let l=0,c=a.length;l<c;l++)this.expandByObject(a[l],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,hi),hi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Wo),Sl.subVectors(this.max,Wo),zs.subVectors(e.a,Wo),ks.subVectors(e.b,Wo),Bs.subVectors(e.c,Wo),_r.subVectors(ks,zs),xr.subVectors(Bs,ks),qr.subVectors(zs,Bs);let t=[0,-_r.z,_r.y,0,-xr.z,xr.y,0,-qr.z,qr.y,_r.z,0,-_r.x,xr.z,0,-xr.x,qr.z,0,-qr.x,-_r.y,_r.x,0,-xr.y,xr.x,0,-qr.y,qr.x,0];return!Yc(t,zs,ks,Bs,Sl)||(t=[1,0,0,0,1,0,0,0,1],!Yc(t,zs,ks,Bs,Sl))?!1:(Ml.crossVectors(_r,xr),t=[Ml.x,Ml.y,Ml.z],Yc(t,zs,ks,Bs,Sl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,hi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(hi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Vi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Vi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Vi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Vi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Vi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Vi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Vi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Vi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Vi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Vi=[new j,new j,new j,new j,new j,new j,new j,new j],hi=new j,yl=new ca,zs=new j,ks=new j,Bs=new j,_r=new j,xr=new j,qr=new j,Wo=new j,Sl=new j,Ml=new j,$r=new j;function Yc(s,e,t,r,a){for(let l=0,c=s.length-3;l<=c;l+=3){$r.fromArray(s,l);const f=a.x*Math.abs($r.x)+a.y*Math.abs($r.y)+a.z*Math.abs($r.z),h=e.dot($r),p=t.dot($r),g=r.dot($r);if(Math.max(-Math.max(h,p,g),Math.min(h,p,g))>f)return!1}return!0}const Z_=new ca,Xo=new j,qc=new j;class iu{constructor(e=new j,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):Z_.setFromPoints(e).getCenter(r);let a=0;for(let l=0,c=e.length;l<c;l++)a=Math.max(a,r.distanceToSquared(e[l]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Xo.subVectors(e,this.center);const t=Xo.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),a=(r-this.radius)*.5;this.center.addScaledVector(Xo,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(qc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Xo.copy(e.center).add(qc)),this.expandByPoint(Xo.copy(e.center).sub(qc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Gi=new j,$c=new j,El=new j,yr=new j,Kc=new j,Tl=new j,Zc=new j;class Pg{constructor(e=new j,t=new j(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Gi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Gi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Gi.copy(this.origin).addScaledVector(this.direction,t),Gi.distanceToSquared(e))}distanceSqToSegment(e,t,r,a){$c.copy(e).add(t).multiplyScalar(.5),El.copy(t).sub(e).normalize(),yr.copy(this.origin).sub($c);const l=e.distanceTo(t)*.5,c=-this.direction.dot(El),f=yr.dot(this.direction),h=-yr.dot(El),p=yr.lengthSq(),g=Math.abs(1-c*c);let v,x,S,M;if(g>0)if(v=c*h-f,x=c*f-h,M=l*g,v>=0)if(x>=-M)if(x<=M){const w=1/g;v*=w,x*=w,S=v*(v+c*x+2*f)+x*(c*v+x+2*h)+p}else x=l,v=Math.max(0,-(c*x+f)),S=-v*v+x*(x+2*h)+p;else x=-l,v=Math.max(0,-(c*x+f)),S=-v*v+x*(x+2*h)+p;else x<=-M?(v=Math.max(0,-(-c*l+f)),x=v>0?-l:Math.min(Math.max(-l,-h),l),S=-v*v+x*(x+2*h)+p):x<=M?(v=0,x=Math.min(Math.max(-l,-h),l),S=x*(x+2*h)+p):(v=Math.max(0,-(c*l+f)),x=v>0?l:Math.min(Math.max(-l,-h),l),S=-v*v+x*(x+2*h)+p);else x=c>0?-l:l,v=Math.max(0,-(c*x+f)),S=-v*v+x*(x+2*h)+p;return r&&r.copy(this.origin).addScaledVector(this.direction,v),a&&a.copy($c).addScaledVector(El,x),S}intersectSphere(e,t){Gi.subVectors(e.center,this.origin);const r=Gi.dot(this.direction),a=Gi.dot(Gi)-r*r,l=e.radius*e.radius;if(a>l)return null;const c=Math.sqrt(l-a),f=r-c,h=r+c;return h<0?null:f<0?this.at(h,t):this.at(f,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,a,l,c,f,h;const p=1/this.direction.x,g=1/this.direction.y,v=1/this.direction.z,x=this.origin;return p>=0?(r=(e.min.x-x.x)*p,a=(e.max.x-x.x)*p):(r=(e.max.x-x.x)*p,a=(e.min.x-x.x)*p),g>=0?(l=(e.min.y-x.y)*g,c=(e.max.y-x.y)*g):(l=(e.max.y-x.y)*g,c=(e.min.y-x.y)*g),r>c||l>a||((l>r||isNaN(r))&&(r=l),(c<a||isNaN(a))&&(a=c),v>=0?(f=(e.min.z-x.z)*v,h=(e.max.z-x.z)*v):(f=(e.max.z-x.z)*v,h=(e.min.z-x.z)*v),r>h||f>a)||((f>r||r!==r)&&(r=f),(h<a||a!==a)&&(a=h),a<0)?null:this.at(r>=0?r:a,t)}intersectsBox(e){return this.intersectBox(e,Gi)!==null}intersectTriangle(e,t,r,a,l){Kc.subVectors(t,e),Tl.subVectors(r,e),Zc.crossVectors(Kc,Tl);let c=this.direction.dot(Zc),f;if(c>0){if(a)return null;f=1}else if(c<0)f=-1,c=-c;else return null;yr.subVectors(this.origin,e);const h=f*this.direction.dot(Tl.crossVectors(yr,Tl));if(h<0)return null;const p=f*this.direction.dot(Kc.cross(yr));if(p<0||h+p>c)return null;const g=-f*yr.dot(Zc);return g<0?null:this.at(g/c,l)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xt{constructor(e,t,r,a,l,c,f,h,p,g,v,x,S,M,w,y){Xt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,a,l,c,f,h,p,g,v,x,S,M,w,y)}set(e,t,r,a,l,c,f,h,p,g,v,x,S,M,w,y){const _=this.elements;return _[0]=e,_[4]=t,_[8]=r,_[12]=a,_[1]=l,_[5]=c,_[9]=f,_[13]=h,_[2]=p,_[6]=g,_[10]=v,_[14]=x,_[3]=S,_[7]=M,_[11]=w,_[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Xt().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,r=e.elements,a=1/Hs.setFromMatrixColumn(e,0).length(),l=1/Hs.setFromMatrixColumn(e,1).length(),c=1/Hs.setFromMatrixColumn(e,2).length();return t[0]=r[0]*a,t[1]=r[1]*a,t[2]=r[2]*a,t[3]=0,t[4]=r[4]*l,t[5]=r[5]*l,t[6]=r[6]*l,t[7]=0,t[8]=r[8]*c,t[9]=r[9]*c,t[10]=r[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,a=e.y,l=e.z,c=Math.cos(r),f=Math.sin(r),h=Math.cos(a),p=Math.sin(a),g=Math.cos(l),v=Math.sin(l);if(e.order==="XYZ"){const x=c*g,S=c*v,M=f*g,w=f*v;t[0]=h*g,t[4]=-h*v,t[8]=p,t[1]=S+M*p,t[5]=x-w*p,t[9]=-f*h,t[2]=w-x*p,t[6]=M+S*p,t[10]=c*h}else if(e.order==="YXZ"){const x=h*g,S=h*v,M=p*g,w=p*v;t[0]=x+w*f,t[4]=M*f-S,t[8]=c*p,t[1]=c*v,t[5]=c*g,t[9]=-f,t[2]=S*f-M,t[6]=w+x*f,t[10]=c*h}else if(e.order==="ZXY"){const x=h*g,S=h*v,M=p*g,w=p*v;t[0]=x-w*f,t[4]=-c*v,t[8]=M+S*f,t[1]=S+M*f,t[5]=c*g,t[9]=w-x*f,t[2]=-c*p,t[6]=f,t[10]=c*h}else if(e.order==="ZYX"){const x=c*g,S=c*v,M=f*g,w=f*v;t[0]=h*g,t[4]=M*p-S,t[8]=x*p+w,t[1]=h*v,t[5]=w*p+x,t[9]=S*p-M,t[2]=-p,t[6]=f*h,t[10]=c*h}else if(e.order==="YZX"){const x=c*h,S=c*p,M=f*h,w=f*p;t[0]=h*g,t[4]=w-x*v,t[8]=M*v+S,t[1]=v,t[5]=c*g,t[9]=-f*g,t[2]=-p*g,t[6]=S*v+M,t[10]=x-w*v}else if(e.order==="XZY"){const x=c*h,S=c*p,M=f*h,w=f*p;t[0]=h*g,t[4]=-v,t[8]=p*g,t[1]=x*v+w,t[5]=c*g,t[9]=S*v-M,t[2]=M*v-S,t[6]=f*g,t[10]=w*v+x}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Q_,e,J_)}lookAt(e,t,r){const a=this.elements;return jn.subVectors(e,t),jn.lengthSq()===0&&(jn.z=1),jn.normalize(),Sr.crossVectors(r,jn),Sr.lengthSq()===0&&(Math.abs(r.z)===1?jn.x+=1e-4:jn.z+=1e-4,jn.normalize(),Sr.crossVectors(r,jn)),Sr.normalize(),wl.crossVectors(jn,Sr),a[0]=Sr.x,a[4]=wl.x,a[8]=jn.x,a[1]=Sr.y,a[5]=wl.y,a[9]=jn.y,a[2]=Sr.z,a[6]=wl.z,a[10]=jn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,l=this.elements,c=r[0],f=r[4],h=r[8],p=r[12],g=r[1],v=r[5],x=r[9],S=r[13],M=r[2],w=r[6],y=r[10],_=r[14],I=r[3],L=r[7],b=r[11],z=r[15],F=a[0],O=a[4],X=a[8],C=a[12],R=a[1],B=a[5],$=a[9],te=a[13],ue=a[2],ae=a[6],oe=a[10],he=a[14],H=a[3],ce=a[7],se=a[11],U=a[15];return l[0]=c*F+f*R+h*ue+p*H,l[4]=c*O+f*B+h*ae+p*ce,l[8]=c*X+f*$+h*oe+p*se,l[12]=c*C+f*te+h*he+p*U,l[1]=g*F+v*R+x*ue+S*H,l[5]=g*O+v*B+x*ae+S*ce,l[9]=g*X+v*$+x*oe+S*se,l[13]=g*C+v*te+x*he+S*U,l[2]=M*F+w*R+y*ue+_*H,l[6]=M*O+w*B+y*ae+_*ce,l[10]=M*X+w*$+y*oe+_*se,l[14]=M*C+w*te+y*he+_*U,l[3]=I*F+L*R+b*ue+z*H,l[7]=I*O+L*B+b*ae+z*ce,l[11]=I*X+L*$+b*oe+z*se,l[15]=I*C+L*te+b*he+z*U,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],a=e[8],l=e[12],c=e[1],f=e[5],h=e[9],p=e[13],g=e[2],v=e[6],x=e[10],S=e[14],M=e[3],w=e[7],y=e[11],_=e[15];return M*(+l*h*v-a*p*v-l*f*x+r*p*x+a*f*S-r*h*S)+w*(+t*h*S-t*p*x+l*c*x-a*c*S+a*p*g-l*h*g)+y*(+t*p*v-t*f*S-l*c*v+r*c*S+l*f*g-r*p*g)+_*(-a*f*g-t*h*v+t*f*x+a*c*v-r*c*x+r*h*g)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],l=e[3],c=e[4],f=e[5],h=e[6],p=e[7],g=e[8],v=e[9],x=e[10],S=e[11],M=e[12],w=e[13],y=e[14],_=e[15],I=v*y*p-w*x*p+w*h*S-f*y*S-v*h*_+f*x*_,L=M*x*p-g*y*p-M*h*S+c*y*S+g*h*_-c*x*_,b=g*w*p-M*v*p+M*f*S-c*w*S-g*f*_+c*v*_,z=M*v*h-g*w*h-M*f*x+c*w*x+g*f*y-c*v*y,F=t*I+r*L+a*b+l*z;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const O=1/F;return e[0]=I*O,e[1]=(w*x*l-v*y*l-w*a*S+r*y*S+v*a*_-r*x*_)*O,e[2]=(f*y*l-w*h*l+w*a*p-r*y*p-f*a*_+r*h*_)*O,e[3]=(v*h*l-f*x*l-v*a*p+r*x*p+f*a*S-r*h*S)*O,e[4]=L*O,e[5]=(g*y*l-M*x*l+M*a*S-t*y*S-g*a*_+t*x*_)*O,e[6]=(M*h*l-c*y*l-M*a*p+t*y*p+c*a*_-t*h*_)*O,e[7]=(c*x*l-g*h*l+g*a*p-t*x*p-c*a*S+t*h*S)*O,e[8]=b*O,e[9]=(M*v*l-g*w*l-M*r*S+t*w*S+g*r*_-t*v*_)*O,e[10]=(c*w*l-M*f*l+M*r*p-t*w*p-c*r*_+t*f*_)*O,e[11]=(g*f*l-c*v*l-g*r*p+t*v*p+c*r*S-t*f*S)*O,e[12]=z*O,e[13]=(g*w*a-M*v*a+M*r*x-t*w*x-g*r*y+t*v*y)*O,e[14]=(M*f*a-c*w*a-M*r*h+t*w*h+c*r*y-t*f*y)*O,e[15]=(c*v*a-g*f*a+g*r*h-t*v*h-c*r*x+t*f*x)*O,this}scale(e){const t=this.elements,r=e.x,a=e.y,l=e.z;return t[0]*=r,t[4]*=a,t[8]*=l,t[1]*=r,t[5]*=a,t[9]*=l,t[2]*=r,t[6]*=a,t[10]*=l,t[3]*=r,t[7]*=a,t[11]*=l,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,a))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),a=Math.sin(t),l=1-r,c=e.x,f=e.y,h=e.z,p=l*c,g=l*f;return this.set(p*c+r,p*f-a*h,p*h+a*f,0,p*f+a*h,g*f+r,g*h-a*c,0,p*h-a*f,g*h+a*c,l*h*h+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,a,l,c){return this.set(1,r,l,0,e,1,c,0,t,a,1,0,0,0,0,1),this}compose(e,t,r){const a=this.elements,l=t._x,c=t._y,f=t._z,h=t._w,p=l+l,g=c+c,v=f+f,x=l*p,S=l*g,M=l*v,w=c*g,y=c*v,_=f*v,I=h*p,L=h*g,b=h*v,z=r.x,F=r.y,O=r.z;return a[0]=(1-(w+_))*z,a[1]=(S+b)*z,a[2]=(M-L)*z,a[3]=0,a[4]=(S-b)*F,a[5]=(1-(x+_))*F,a[6]=(y+I)*F,a[7]=0,a[8]=(M+L)*O,a[9]=(y-I)*O,a[10]=(1-(x+w))*O,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,r){const a=this.elements;let l=Hs.set(a[0],a[1],a[2]).length();const c=Hs.set(a[4],a[5],a[6]).length(),f=Hs.set(a[8],a[9],a[10]).length();this.determinant()<0&&(l=-l),e.x=a[12],e.y=a[13],e.z=a[14],pi.copy(this);const p=1/l,g=1/c,v=1/f;return pi.elements[0]*=p,pi.elements[1]*=p,pi.elements[2]*=p,pi.elements[4]*=g,pi.elements[5]*=g,pi.elements[6]*=g,pi.elements[8]*=v,pi.elements[9]*=v,pi.elements[10]*=v,t.setFromRotationMatrix(pi),r.x=l,r.y=c,r.z=f,this}makePerspective(e,t,r,a,l,c,f=Ai,h=!1){const p=this.elements,g=2*l/(t-e),v=2*l/(r-a),x=(t+e)/(t-e),S=(r+a)/(r-a);let M,w;if(h)M=l/(c-l),w=c*l/(c-l);else if(f===Ai)M=-(c+l)/(c-l),w=-2*c*l/(c-l);else if(f===Kl)M=-c/(c-l),w=-c*l/(c-l);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+f);return p[0]=g,p[4]=0,p[8]=x,p[12]=0,p[1]=0,p[5]=v,p[9]=S,p[13]=0,p[2]=0,p[6]=0,p[10]=M,p[14]=w,p[3]=0,p[7]=0,p[11]=-1,p[15]=0,this}makeOrthographic(e,t,r,a,l,c,f=Ai,h=!1){const p=this.elements,g=2/(t-e),v=2/(r-a),x=-(t+e)/(t-e),S=-(r+a)/(r-a);let M,w;if(h)M=1/(c-l),w=c/(c-l);else if(f===Ai)M=-2/(c-l),w=-(c+l)/(c-l);else if(f===Kl)M=-1/(c-l),w=-l/(c-l);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+f);return p[0]=g,p[4]=0,p[8]=0,p[12]=x,p[1]=0,p[5]=v,p[9]=0,p[13]=S,p[2]=0,p[6]=0,p[10]=M,p[14]=w,p[3]=0,p[7]=0,p[11]=0,p[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<16;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}}const Hs=new j,pi=new Xt,Q_=new j(0,0,0),J_=new j(1,1,1),Sr=new j,wl=new j,jn=new j,_m=new Xt,xm=new ua;class Pi{constructor(e=0,t=0,r=0,a=Pi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,a=this._order){return this._x=e,this._y=t,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const a=e.elements,l=a[0],c=a[4],f=a[8],h=a[1],p=a[5],g=a[9],v=a[2],x=a[6],S=a[10];switch(t){case"XYZ":this._y=Math.asin(xt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-g,S),this._z=Math.atan2(-c,l)):(this._x=Math.atan2(x,p),this._z=0);break;case"YXZ":this._x=Math.asin(-xt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(f,S),this._z=Math.atan2(h,p)):(this._y=Math.atan2(-v,l),this._z=0);break;case"ZXY":this._x=Math.asin(xt(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(-v,S),this._z=Math.atan2(-c,p)):(this._y=0,this._z=Math.atan2(h,l));break;case"ZYX":this._y=Math.asin(-xt(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(x,S),this._z=Math.atan2(h,l)):(this._x=0,this._z=Math.atan2(-c,p));break;case"YZX":this._z=Math.asin(xt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-g,p),this._y=Math.atan2(-v,l)):(this._x=0,this._y=Math.atan2(f,S));break;case"XZY":this._z=Math.asin(-xt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(x,p),this._y=Math.atan2(f,l)):(this._x=Math.atan2(-g,S),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return _m.makeRotationFromQuaternion(e),this.setFromRotationMatrix(_m,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return xm.setFromEuler(this),this.setFromQuaternion(xm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Pi.DEFAULT_ORDER="XYZ";class Lg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ex=0;const ym=new j,Vs=new ua,Wi=new Xt,Al=new j,jo=new j,tx=new j,nx=new ua,Sm=new j(1,0,0),Mm=new j(0,1,0),Em=new j(0,0,1),Tm={type:"added"},ix={type:"removed"},Gs={type:"childadded",child:null},Qc={type:"childremoved",child:null};class cn extends oo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ex++}),this.uuid=ao(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=cn.DEFAULT_UP.clone();const e=new j,t=new Pi,r=new ua,a=new j(1,1,1);function l(){r.setFromEuler(t,!1)}function c(){t.setFromQuaternion(r,void 0,!1)}t._onChange(l),r._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new Xt},normalMatrix:{value:new dt}}),this.matrix=new Xt,this.matrixWorld=new Xt,this.matrixAutoUpdate=cn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Lg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Vs.setFromAxisAngle(e,t),this.quaternion.multiply(Vs),this}rotateOnWorldAxis(e,t){return Vs.setFromAxisAngle(e,t),this.quaternion.premultiply(Vs),this}rotateX(e){return this.rotateOnAxis(Sm,e)}rotateY(e){return this.rotateOnAxis(Mm,e)}rotateZ(e){return this.rotateOnAxis(Em,e)}translateOnAxis(e,t){return ym.copy(e).applyQuaternion(this.quaternion),this.position.add(ym.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Sm,e)}translateY(e){return this.translateOnAxis(Mm,e)}translateZ(e){return this.translateOnAxis(Em,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wi.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?Al.copy(e):Al.set(e,t,r);const a=this.parent;this.updateWorldMatrix(!0,!1),jo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wi.lookAt(jo,Al,this.up):Wi.lookAt(Al,jo,this.up),this.quaternion.setFromRotationMatrix(Wi),a&&(Wi.extractRotation(a.matrixWorld),Vs.setFromRotationMatrix(Wi),this.quaternion.premultiply(Vs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Tm),Gs.child=e,this.dispatchEvent(Gs),Gs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ix),Qc.child=e,this.dispatchEvent(Qc),Qc.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Tm),Gs.child=e,this.dispatchEvent(Gs),Gs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,a=this.children.length;r<a;r++){const c=this.children[r].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const a=this.children;for(let l=0,c=a.length;l<c;l++)a[l].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(jo,e,tx),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(jo,nx,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let l=0,c=a.length;l<c;l++)a[l].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(f=>({...f,boundingBox:f.boundingBox?f.boundingBox.toJSON():void 0,boundingSphere:f.boundingSphere?f.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(f=>({...f})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(e),a.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function l(f,h){return f[h.uuid]===void 0&&(f[h.uuid]=h.toJSON(e)),h.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=l(e.geometries,this.geometry);const f=this.geometry.parameters;if(f!==void 0&&f.shapes!==void 0){const h=f.shapes;if(Array.isArray(h))for(let p=0,g=h.length;p<g;p++){const v=h[p];l(e.shapes,v)}else l(e.shapes,h)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(l(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const f=[];for(let h=0,p=this.material.length;h<p;h++)f.push(l(e.materials,this.material[h]));a.material=f}else a.material=l(e.materials,this.material);if(this.children.length>0){a.children=[];for(let f=0;f<this.children.length;f++)a.children.push(this.children[f].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let f=0;f<this.animations.length;f++){const h=this.animations[f];a.animations.push(l(e.animations,h))}}if(t){const f=c(e.geometries),h=c(e.materials),p=c(e.textures),g=c(e.images),v=c(e.shapes),x=c(e.skeletons),S=c(e.animations),M=c(e.nodes);f.length>0&&(r.geometries=f),h.length>0&&(r.materials=h),p.length>0&&(r.textures=p),g.length>0&&(r.images=g),v.length>0&&(r.shapes=v),x.length>0&&(r.skeletons=x),S.length>0&&(r.animations=S),M.length>0&&(r.nodes=M)}return r.object=a,r;function c(f){const h=[];for(const p in f){const g=f[p];delete g.metadata,h.push(g)}return h}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}cn.DEFAULT_UP=new j(0,1,0);cn.DEFAULT_MATRIX_AUTO_UPDATE=!0;cn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const mi=new j,Xi=new j,Jc=new j,ji=new j,Ws=new j,Xs=new j,wm=new j,ef=new j,tf=new j,nf=new j,rf=new It,sf=new It,of=new It;class gi{constructor(e=new j,t=new j,r=new j){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,a){a.subVectors(r,t),mi.subVectors(e,t),a.cross(mi);const l=a.lengthSq();return l>0?a.multiplyScalar(1/Math.sqrt(l)):a.set(0,0,0)}static getBarycoord(e,t,r,a,l){mi.subVectors(a,t),Xi.subVectors(r,t),Jc.subVectors(e,t);const c=mi.dot(mi),f=mi.dot(Xi),h=mi.dot(Jc),p=Xi.dot(Xi),g=Xi.dot(Jc),v=c*p-f*f;if(v===0)return l.set(0,0,0),null;const x=1/v,S=(p*h-f*g)*x,M=(c*g-f*h)*x;return l.set(1-S-M,M,S)}static containsPoint(e,t,r,a){return this.getBarycoord(e,t,r,a,ji)===null?!1:ji.x>=0&&ji.y>=0&&ji.x+ji.y<=1}static getInterpolation(e,t,r,a,l,c,f,h){return this.getBarycoord(e,t,r,a,ji)===null?(h.x=0,h.y=0,"z"in h&&(h.z=0),"w"in h&&(h.w=0),null):(h.setScalar(0),h.addScaledVector(l,ji.x),h.addScaledVector(c,ji.y),h.addScaledVector(f,ji.z),h)}static getInterpolatedAttribute(e,t,r,a,l,c){return rf.setScalar(0),sf.setScalar(0),of.setScalar(0),rf.fromBufferAttribute(e,t),sf.fromBufferAttribute(e,r),of.fromBufferAttribute(e,a),c.setScalar(0),c.addScaledVector(rf,l.x),c.addScaledVector(sf,l.y),c.addScaledVector(of,l.z),c}static isFrontFacing(e,t,r,a){return mi.subVectors(r,t),Xi.subVectors(e,t),mi.cross(Xi).dot(a)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,a){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,r,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return mi.subVectors(this.c,this.b),Xi.subVectors(this.a,this.b),mi.cross(Xi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return gi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return gi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,a,l){return gi.getInterpolation(e,this.a,this.b,this.c,t,r,a,l)}containsPoint(e){return gi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return gi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,a=this.b,l=this.c;let c,f;Ws.subVectors(a,r),Xs.subVectors(l,r),ef.subVectors(e,r);const h=Ws.dot(ef),p=Xs.dot(ef);if(h<=0&&p<=0)return t.copy(r);tf.subVectors(e,a);const g=Ws.dot(tf),v=Xs.dot(tf);if(g>=0&&v<=g)return t.copy(a);const x=h*v-g*p;if(x<=0&&h>=0&&g<=0)return c=h/(h-g),t.copy(r).addScaledVector(Ws,c);nf.subVectors(e,l);const S=Ws.dot(nf),M=Xs.dot(nf);if(M>=0&&S<=M)return t.copy(l);const w=S*p-h*M;if(w<=0&&p>=0&&M<=0)return f=p/(p-M),t.copy(r).addScaledVector(Xs,f);const y=g*M-S*v;if(y<=0&&v-g>=0&&S-M>=0)return wm.subVectors(l,a),f=(v-g)/(v-g+(S-M)),t.copy(a).addScaledVector(wm,f);const _=1/(y+w+x);return c=w*_,f=x*_,t.copy(r).addScaledVector(Ws,c).addScaledVector(Xs,f)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Dg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Mr={h:0,s:0,l:0},Rl={h:0,s:0,l:0};function af(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class yt{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,At.colorSpaceToWorking(this,t),this}setRGB(e,t,r,a=At.workingColorSpace){return this.r=e,this.g=t,this.b=r,At.colorSpaceToWorking(this,a),this}setHSL(e,t,r,a=At.workingColorSpace){if(e=Sd(e,1),t=xt(t,0,1),r=xt(r,0,1),t===0)this.r=this.g=this.b=r;else{const l=r<=.5?r*(1+t):r+t-r*t,c=2*r-l;this.r=af(c,l,e+1/3),this.g=af(c,l,e),this.b=af(c,l,e-1/3)}return At.colorSpaceToWorking(this,a),this}setStyle(e,t=qn){function r(l){l!==void 0&&parseFloat(l)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let l;const c=a[1],f=a[2];switch(c){case"rgb":case"rgba":if(l=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setRGB(Math.min(255,parseInt(l[1],10))/255,Math.min(255,parseInt(l[2],10))/255,Math.min(255,parseInt(l[3],10))/255,t);if(l=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setRGB(Math.min(100,parseInt(l[1],10))/100,Math.min(100,parseInt(l[2],10))/100,Math.min(100,parseInt(l[3],10))/100,t);break;case"hsl":case"hsla":if(l=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(f))return r(l[4]),this.setHSL(parseFloat(l[1])/360,parseFloat(l[2])/100,parseFloat(l[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const l=a[1],c=l.length;if(c===3)return this.setRGB(parseInt(l.charAt(0),16)/15,parseInt(l.charAt(1),16)/15,parseInt(l.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(l,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=qn){const r=Dg[e.toLowerCase()];return r!==void 0?this.setHex(r,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zi(e.r),this.g=Zi(e.g),this.b=Zi(e.b),this}copyLinearToSRGB(e){return this.r=Js(e.r),this.g=Js(e.g),this.b=Js(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qn){return At.workingToColorSpace(Mn.copy(this),e),Math.round(xt(Mn.r*255,0,255))*65536+Math.round(xt(Mn.g*255,0,255))*256+Math.round(xt(Mn.b*255,0,255))}getHexString(e=qn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=At.workingColorSpace){At.workingToColorSpace(Mn.copy(this),t);const r=Mn.r,a=Mn.g,l=Mn.b,c=Math.max(r,a,l),f=Math.min(r,a,l);let h,p;const g=(f+c)/2;if(f===c)h=0,p=0;else{const v=c-f;switch(p=g<=.5?v/(c+f):v/(2-c-f),c){case r:h=(a-l)/v+(a<l?6:0);break;case a:h=(l-r)/v+2;break;case l:h=(r-a)/v+4;break}h/=6}return e.h=h,e.s=p,e.l=g,e}getRGB(e,t=At.workingColorSpace){return At.workingToColorSpace(Mn.copy(this),t),e.r=Mn.r,e.g=Mn.g,e.b=Mn.b,e}getStyle(e=qn){At.workingToColorSpace(Mn.copy(this),e);const t=Mn.r,r=Mn.g,a=Mn.b;return e!==qn?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,t,r){return this.getHSL(Mr),this.setHSL(Mr.h+e,Mr.s+t,Mr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(Mr),e.getHSL(Rl);const r=Jo(Mr.h,Rl.h,t),a=Jo(Mr.s,Rl.s,t),l=Jo(Mr.l,Rl.l,t);return this.setHSL(r,a,l),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,a=this.b,l=e.elements;return this.r=l[0]*t+l[3]*r+l[6]*a,this.g=l[1]*t+l[4]*r+l[7]*a,this.b=l[2]*t+l[5]*r+l[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Mn=new yt;yt.NAMES=Dg;let rx=0;class lo extends oo{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:rx++}),this.uuid=ao(),this.name="",this.type="Material",this.blending=Qs,this.side=Pr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ef,this.blendDst=Tf,this.blendEquation=ns,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new yt(0,0,0),this.blendAlpha=0,this.depthFunc=eo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=cm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fs,this.stencilZFail=Fs,this.stencilZPass=Fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(r.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(r.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Qs&&(r.blending=this.blending),this.side!==Pr&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Ef&&(r.blendSrc=this.blendSrc),this.blendDst!==Tf&&(r.blendDst=this.blendDst),this.blendEquation!==ns&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==eo&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==cm&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fs&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Fs&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Fs&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(l){const c=[];for(const f in l){const h=l[f];delete h.metadata,c.push(h)}return c}if(t){const l=a(e.textures),c=a(e.images);l.length>0&&(r.textures=l),c.length>0&&(r.images=c)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const a=t.length;r=new Array(a);for(let l=0;l!==a;++l)r[l]=t[l].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class oa extends lo{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pi,this.combine=mg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Zt=new j,Cl=new St;let sx=0;class xi{constructor(e,t,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:sx++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=fm,this.updateRanges=[],this.gpuType=Ki,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let a=0,l=this.itemSize;a<l;a++)this.array[e+a]=t.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)Cl.fromBufferAttribute(this,t),Cl.applyMatrix3(e),this.setXY(t,Cl.x,Cl.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix3(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)Zt.fromBufferAttribute(this,t),Zt.applyMatrix4(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)Zt.fromBufferAttribute(this,t),Zt.applyNormalMatrix(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)Zt.fromBufferAttribute(this,t),Zt.transformDirection(e),this.setXYZ(t,Zt.x,Zt.y,Zt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=Ks(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=Cn(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Ks(t,this.array)),t}setX(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Ks(t,this.array)),t}setY(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Ks(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Ks(t,this.array)),t}setW(e,t){return this.normalized&&(t=Cn(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),r=Cn(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,a){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),r=Cn(r,this.array),a=Cn(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,t,r,a,l){return e*=this.itemSize,this.normalized&&(t=Cn(t,this.array),r=Cn(r,this.array),a=Cn(a,this.array),l=Cn(l,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=l,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==fm&&(e.usage=this.usage),e}}class Ig extends xi{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class Ug extends xi{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class hn extends xi{constructor(e,t,r){super(new Float32Array(e),t,r)}}let ox=0;const si=new Xt,lf=new cn,js=new j,Yn=new ca,Yo=new ca,un=new j;class Zn extends oo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ox++}),this.uuid=ao(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Cg(e)?Ug:Ig)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const l=new dt().getNormalMatrix(e);r.applyNormalMatrix(l),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return si.makeRotationFromQuaternion(e),this.applyMatrix4(si),this}rotateX(e){return si.makeRotationX(e),this.applyMatrix4(si),this}rotateY(e){return si.makeRotationY(e),this.applyMatrix4(si),this}rotateZ(e){return si.makeRotationZ(e),this.applyMatrix4(si),this}translate(e,t,r){return si.makeTranslation(e,t,r),this.applyMatrix4(si),this}scale(e,t,r){return si.makeScale(e,t,r),this.applyMatrix4(si),this}lookAt(e){return lf.lookAt(e),lf.updateMatrix(),this.applyMatrix4(lf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(js).negate(),this.translate(js.x,js.y,js.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const r=[];for(let a=0,l=e.length;a<l;a++){const c=e[a];r.push(c.x,c.y,c.z||0)}this.setAttribute("position",new hn(r,3))}else{const r=Math.min(e.length,t.count);for(let a=0;a<r;a++){const l=e[a];t.setXYZ(a,l.x,l.y,l.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ca);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new j(-1/0,-1/0,-1/0),new j(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const l=t[r];Yn.setFromBufferAttribute(l),this.morphTargetsRelative?(un.addVectors(this.boundingBox.min,Yn.min),this.boundingBox.expandByPoint(un),un.addVectors(this.boundingBox.max,Yn.max),this.boundingBox.expandByPoint(un)):(this.boundingBox.expandByPoint(Yn.min),this.boundingBox.expandByPoint(Yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new iu);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new j,1/0);return}if(e){const r=this.boundingSphere.center;if(Yn.setFromBufferAttribute(e),t)for(let l=0,c=t.length;l<c;l++){const f=t[l];Yo.setFromBufferAttribute(f),this.morphTargetsRelative?(un.addVectors(Yn.min,Yo.min),Yn.expandByPoint(un),un.addVectors(Yn.max,Yo.max),Yn.expandByPoint(un)):(Yn.expandByPoint(Yo.min),Yn.expandByPoint(Yo.max))}Yn.getCenter(r);let a=0;for(let l=0,c=e.count;l<c;l++)un.fromBufferAttribute(e,l),a=Math.max(a,r.distanceToSquared(un));if(t)for(let l=0,c=t.length;l<c;l++){const f=t[l],h=this.morphTargetsRelative;for(let p=0,g=f.count;p<g;p++)un.fromBufferAttribute(f,p),h&&(js.fromBufferAttribute(e,p),un.add(js)),a=Math.max(a,r.distanceToSquared(un))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,a=t.normal,l=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new xi(new Float32Array(4*r.count),4));const c=this.getAttribute("tangent"),f=[],h=[];for(let X=0;X<r.count;X++)f[X]=new j,h[X]=new j;const p=new j,g=new j,v=new j,x=new St,S=new St,M=new St,w=new j,y=new j;function _(X,C,R){p.fromBufferAttribute(r,X),g.fromBufferAttribute(r,C),v.fromBufferAttribute(r,R),x.fromBufferAttribute(l,X),S.fromBufferAttribute(l,C),M.fromBufferAttribute(l,R),g.sub(p),v.sub(p),S.sub(x),M.sub(x);const B=1/(S.x*M.y-M.x*S.y);isFinite(B)&&(w.copy(g).multiplyScalar(M.y).addScaledVector(v,-S.y).multiplyScalar(B),y.copy(v).multiplyScalar(S.x).addScaledVector(g,-M.x).multiplyScalar(B),f[X].add(w),f[C].add(w),f[R].add(w),h[X].add(y),h[C].add(y),h[R].add(y))}let I=this.groups;I.length===0&&(I=[{start:0,count:e.count}]);for(let X=0,C=I.length;X<C;++X){const R=I[X],B=R.start,$=R.count;for(let te=B,ue=B+$;te<ue;te+=3)_(e.getX(te+0),e.getX(te+1),e.getX(te+2))}const L=new j,b=new j,z=new j,F=new j;function O(X){z.fromBufferAttribute(a,X),F.copy(z);const C=f[X];L.copy(C),L.sub(z.multiplyScalar(z.dot(C))).normalize(),b.crossVectors(F,C);const B=b.dot(h[X])<0?-1:1;c.setXYZW(X,L.x,L.y,L.z,B)}for(let X=0,C=I.length;X<C;++X){const R=I[X],B=R.start,$=R.count;for(let te=B,ue=B+$;te<ue;te+=3)O(e.getX(te+0)),O(e.getX(te+1)),O(e.getX(te+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new xi(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let x=0,S=r.count;x<S;x++)r.setXYZ(x,0,0,0);const a=new j,l=new j,c=new j,f=new j,h=new j,p=new j,g=new j,v=new j;if(e)for(let x=0,S=e.count;x<S;x+=3){const M=e.getX(x+0),w=e.getX(x+1),y=e.getX(x+2);a.fromBufferAttribute(t,M),l.fromBufferAttribute(t,w),c.fromBufferAttribute(t,y),g.subVectors(c,l),v.subVectors(a,l),g.cross(v),f.fromBufferAttribute(r,M),h.fromBufferAttribute(r,w),p.fromBufferAttribute(r,y),f.add(g),h.add(g),p.add(g),r.setXYZ(M,f.x,f.y,f.z),r.setXYZ(w,h.x,h.y,h.z),r.setXYZ(y,p.x,p.y,p.z)}else for(let x=0,S=t.count;x<S;x+=3)a.fromBufferAttribute(t,x+0),l.fromBufferAttribute(t,x+1),c.fromBufferAttribute(t,x+2),g.subVectors(c,l),v.subVectors(a,l),g.cross(v),r.setXYZ(x+0,g.x,g.y,g.z),r.setXYZ(x+1,g.x,g.y,g.z),r.setXYZ(x+2,g.x,g.y,g.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)un.fromBufferAttribute(e,t),un.normalize(),e.setXYZ(t,un.x,un.y,un.z)}toNonIndexed(){function e(f,h){const p=f.array,g=f.itemSize,v=f.normalized,x=new p.constructor(h.length*g);let S=0,M=0;for(let w=0,y=h.length;w<y;w++){f.isInterleavedBufferAttribute?S=h[w]*f.data.stride+f.offset:S=h[w]*g;for(let _=0;_<g;_++)x[M++]=p[S++]}return new xi(x,g,v)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Zn,r=this.index.array,a=this.attributes;for(const f in a){const h=a[f],p=e(h,r);t.setAttribute(f,p)}const l=this.morphAttributes;for(const f in l){const h=[],p=l[f];for(let g=0,v=p.length;g<v;g++){const x=p[g],S=e(x,r);h.push(S)}t.morphAttributes[f]=h}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let f=0,h=c.length;f<h;f++){const p=c[f];t.addGroup(p.start,p.count,p.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const h=this.parameters;for(const p in h)h[p]!==void 0&&(e[p]=h[p]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const h in r){const p=r[h];e.data.attributes[h]=p.toJSON(e.data)}const a={};let l=!1;for(const h in this.morphAttributes){const p=this.morphAttributes[h],g=[];for(let v=0,x=p.length;v<x;v++){const S=p[v];g.push(S.toJSON(e.data))}g.length>0&&(a[h]=g,l=!0)}l&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const f=this.boundingSphere;return f!==null&&(e.data.boundingSphere=f.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone());const a=e.attributes;for(const p in a){const g=a[p];this.setAttribute(p,g.clone(t))}const l=e.morphAttributes;for(const p in l){const g=[],v=l[p];for(let x=0,S=v.length;x<S;x++)g.push(v[x].clone(t));this.morphAttributes[p]=g}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let p=0,g=c.length;p<g;p++){const v=c[p];this.addGroup(v.start,v.count,v.materialIndex)}const f=e.boundingBox;f!==null&&(this.boundingBox=f.clone());const h=e.boundingSphere;return h!==null&&(this.boundingSphere=h.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Am=new Xt,Kr=new Pg,bl=new iu,Rm=new j,Pl=new j,Ll=new j,Dl=new j,uf=new j,Il=new j,Cm=new j,Ul=new j;class $t extends cn{constructor(e=new Zn,t=new oa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const f=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}getVertexPosition(e,t){const r=this.geometry,a=r.attributes.position,l=r.morphAttributes.position,c=r.morphTargetsRelative;t.fromBufferAttribute(a,e);const f=this.morphTargetInfluences;if(l&&f){Il.set(0,0,0);for(let h=0,p=l.length;h<p;h++){const g=f[h],v=l[h];g!==0&&(uf.fromBufferAttribute(v,e),c?Il.addScaledVector(uf,g):Il.addScaledVector(uf.sub(t),g))}t.add(Il)}return t}raycast(e,t){const r=this.geometry,a=this.material,l=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),bl.copy(r.boundingSphere),bl.applyMatrix4(l),Kr.copy(e.ray).recast(e.near),!(bl.containsPoint(Kr.origin)===!1&&(Kr.intersectSphere(bl,Rm)===null||Kr.origin.distanceToSquared(Rm)>(e.far-e.near)**2))&&(Am.copy(l).invert(),Kr.copy(e.ray).applyMatrix4(Am),!(r.boundingBox!==null&&Kr.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,Kr)))}_computeIntersections(e,t,r){let a;const l=this.geometry,c=this.material,f=l.index,h=l.attributes.position,p=l.attributes.uv,g=l.attributes.uv1,v=l.attributes.normal,x=l.groups,S=l.drawRange;if(f!==null)if(Array.isArray(c))for(let M=0,w=x.length;M<w;M++){const y=x[M],_=c[y.materialIndex],I=Math.max(y.start,S.start),L=Math.min(f.count,Math.min(y.start+y.count,S.start+S.count));for(let b=I,z=L;b<z;b+=3){const F=f.getX(b),O=f.getX(b+1),X=f.getX(b+2);a=Nl(this,_,e,r,p,g,v,F,O,X),a&&(a.faceIndex=Math.floor(b/3),a.face.materialIndex=y.materialIndex,t.push(a))}}else{const M=Math.max(0,S.start),w=Math.min(f.count,S.start+S.count);for(let y=M,_=w;y<_;y+=3){const I=f.getX(y),L=f.getX(y+1),b=f.getX(y+2);a=Nl(this,c,e,r,p,g,v,I,L,b),a&&(a.faceIndex=Math.floor(y/3),t.push(a))}}else if(h!==void 0)if(Array.isArray(c))for(let M=0,w=x.length;M<w;M++){const y=x[M],_=c[y.materialIndex],I=Math.max(y.start,S.start),L=Math.min(h.count,Math.min(y.start+y.count,S.start+S.count));for(let b=I,z=L;b<z;b+=3){const F=b,O=b+1,X=b+2;a=Nl(this,_,e,r,p,g,v,F,O,X),a&&(a.faceIndex=Math.floor(b/3),a.face.materialIndex=y.materialIndex,t.push(a))}}else{const M=Math.max(0,S.start),w=Math.min(h.count,S.start+S.count);for(let y=M,_=w;y<_;y+=3){const I=y,L=y+1,b=y+2;a=Nl(this,c,e,r,p,g,v,I,L,b),a&&(a.faceIndex=Math.floor(y/3),t.push(a))}}}}function ax(s,e,t,r,a,l,c,f){let h;if(e.side===Bn?h=r.intersectTriangle(c,l,a,!0,f):h=r.intersectTriangle(a,l,c,e.side===Pr,f),h===null)return null;Ul.copy(f),Ul.applyMatrix4(s.matrixWorld);const p=t.ray.origin.distanceTo(Ul);return p<t.near||p>t.far?null:{distance:p,point:Ul.clone(),object:s}}function Nl(s,e,t,r,a,l,c,f,h,p){s.getVertexPosition(f,Pl),s.getVertexPosition(h,Ll),s.getVertexPosition(p,Dl);const g=ax(s,e,t,r,Pl,Ll,Dl,Cm);if(g){const v=new j;gi.getBarycoord(Cm,Pl,Ll,Dl,v),a&&(g.uv=gi.getInterpolatedAttribute(a,f,h,p,v,new St)),l&&(g.uv1=gi.getInterpolatedAttribute(l,f,h,p,v,new St)),c&&(g.normal=gi.getInterpolatedAttribute(c,f,h,p,v,new j),g.normal.dot(r.direction)>0&&g.normal.multiplyScalar(-1));const x={a:f,b:h,c:p,normal:new j,materialIndex:0};gi.getNormal(Pl,Ll,Dl,x.normal),g.face=x,g.barycoord=v}return g}class Li extends Zn{constructor(e=1,t=1,r=1,a=1,l=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:a,heightSegments:l,depthSegments:c};const f=this;a=Math.floor(a),l=Math.floor(l),c=Math.floor(c);const h=[],p=[],g=[],v=[];let x=0,S=0;M("z","y","x",-1,-1,r,t,e,c,l,0),M("z","y","x",1,-1,r,t,-e,c,l,1),M("x","z","y",1,1,e,r,t,a,c,2),M("x","z","y",1,-1,e,r,-t,a,c,3),M("x","y","z",1,-1,e,t,r,a,l,4),M("x","y","z",-1,-1,e,t,-r,a,l,5),this.setIndex(h),this.setAttribute("position",new hn(p,3)),this.setAttribute("normal",new hn(g,3)),this.setAttribute("uv",new hn(v,2));function M(w,y,_,I,L,b,z,F,O,X,C){const R=b/O,B=z/X,$=b/2,te=z/2,ue=F/2,ae=O+1,oe=X+1;let he=0,H=0;const ce=new j;for(let se=0;se<oe;se++){const U=se*B-te;for(let re=0;re<ae;re++){const Fe=re*R-$;ce[w]=Fe*I,ce[y]=U*L,ce[_]=ue,p.push(ce.x,ce.y,ce.z),ce[w]=0,ce[y]=0,ce[_]=F>0?1:-1,g.push(ce.x,ce.y,ce.z),v.push(re/O),v.push(1-se/X),he+=1}}for(let se=0;se<X;se++)for(let U=0;U<O;U++){const re=x+U+ae*se,Fe=x+U+ae*(se+1),Xe=x+(U+1)+ae*(se+1),He=x+(U+1)+ae*se;h.push(re,Fe,He),h.push(Fe,Xe,He),H+=6}f.addGroup(S,H,C),S+=H,x+=he}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Li(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ro(s){const e={};for(const t in s){e[t]={};for(const r in s[t]){const a=s[t][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=a.clone():Array.isArray(a)?e[t][r]=a.slice():e[t][r]=a}}return e}function bn(s){const e={};for(let t=0;t<s.length;t++){const r=ro(s[t]);for(const a in r)e[a]=r[a]}return e}function lx(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Ng(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:At.workingColorSpace}const ux={clone:ro,merge:bn};var cx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,fx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Lr extends lo{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=cx,this.fragmentShader=fx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ro(e.uniforms),this.uniformsGroups=lx(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const c=this.uniforms[a].value;c&&c.isTexture?t.uniforms[a]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[a]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[a]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[a]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[a]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[a]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[a]={type:"m4",value:c.toArray()}:t.uniforms[a]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}}class Fg extends cn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xt,this.projectionMatrix=new Xt,this.projectionMatrixInverse=new Xt,this.coordinateSystem=Ai,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Er=new j,bm=new St,Pm=new St;class Kn extends Fg{constructor(e=50,t=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ra*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Qo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ra*2*Math.atan(Math.tan(Qo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){Er.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Er.x,Er.y).multiplyScalar(-e/Er.z),Er.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(Er.x,Er.y).multiplyScalar(-e/Er.z)}getViewSize(e,t){return this.getViewBounds(e,bm,Pm),t.subVectors(Pm,bm)}setViewOffset(e,t,r,a,l,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Qo*.5*this.fov)/this.zoom,r=2*t,a=this.aspect*r,l=-.5*a;const c=this.view;if(this.view!==null&&this.view.enabled){const h=c.fullWidth,p=c.fullHeight;l+=c.offsetX*a/h,t-=c.offsetY*r/p,a*=c.width/h,r*=c.height/p}const f=this.filmOffset;f!==0&&(l+=e*f/this.getFilmWidth()),this.projectionMatrix.makePerspective(l,l+a,t,t-r,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ys=-90,qs=1;class dx extends cn{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Kn(Ys,qs,e,t);a.layers=this.layers,this.add(a);const l=new Kn(Ys,qs,e,t);l.layers=this.layers,this.add(l);const c=new Kn(Ys,qs,e,t);c.layers=this.layers,this.add(c);const f=new Kn(Ys,qs,e,t);f.layers=this.layers,this.add(f);const h=new Kn(Ys,qs,e,t);h.layers=this.layers,this.add(h);const p=new Kn(Ys,qs,e,t);p.layers=this.layers,this.add(p)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,a,l,c,f,h]=t;for(const p of t)this.remove(p);if(e===Ai)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),l.up.set(0,0,-1),l.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),f.up.set(0,1,0),f.lookAt(0,0,1),h.up.set(0,1,0),h.lookAt(0,0,-1);else if(e===Kl)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),l.up.set(0,0,1),l.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),f.up.set(0,-1,0),f.lookAt(0,0,1),h.up.set(0,-1,0),h.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const p of t)this.add(p),p.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[l,c,f,h,p,g]=this.children,v=e.getRenderTarget(),x=e.getActiveCubeFace(),S=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const w=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(t,l),e.setRenderTarget(r,1,a),e.render(t,c),e.setRenderTarget(r,2,a),e.render(t,f),e.setRenderTarget(r,3,a),e.render(t,h),e.setRenderTarget(r,4,a),e.render(t,p),r.texture.generateMipmaps=w,e.setRenderTarget(r,5,a),e.render(t,g),e.setRenderTarget(v,x,S),e.xr.enabled=M,r.texture.needsPMREMUpdate=!0}}class Og extends Ln{constructor(e=[],t=to,r,a,l,c,f,h,p,g){super(e,t,r,a,l,c,f,h,p,g),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class hx extends cs{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new Og(a),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Li(5,5,5),l=new Lr({name:"CubemapFromEquirect",uniforms:ro(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:Bn,blending:Cr});l.uniforms.tEquirect.value=t;const c=new $t(a,l),f=t.minFilter;return t.minFilter===ss&&(t.minFilter=wi),new dx(1,10,this).update(e,c),t.minFilter=f,c.geometry.dispose(),c.material.dispose(),this}clear(e,t=!0,r=!0,a=!0){const l=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,r,a);e.setRenderTarget(l)}}class Rr extends cn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const px={type:"move"};class cf{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Rr,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Rr,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new j,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new j),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Rr,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new j,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new j),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let a=null,l=null,c=null;const f=this._targetRay,h=this._grip,p=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(p&&e.hand){c=!0;for(const w of e.hand.values()){const y=t.getJointPose(w,r),_=this._getHandJoint(p,w);y!==null&&(_.matrix.fromArray(y.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=y.radius),_.visible=y!==null}const g=p.joints["index-finger-tip"],v=p.joints["thumb-tip"],x=g.position.distanceTo(v.position),S=.02,M=.005;p.inputState.pinching&&x>S+M?(p.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!p.inputState.pinching&&x<=S-M&&(p.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else h!==null&&e.gripSpace&&(l=t.getPose(e.gripSpace,r),l!==null&&(h.matrix.fromArray(l.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,l.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(l.linearVelocity)):h.hasLinearVelocity=!1,l.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(l.angularVelocity)):h.hasAngularVelocity=!1));f!==null&&(a=t.getPose(e.targetRaySpace,r),a===null&&l!==null&&(a=l),a!==null&&(f.matrix.fromArray(a.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,a.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(a.linearVelocity)):f.hasLinearVelocity=!1,a.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(a.angularVelocity)):f.hasAngularVelocity=!1,this.dispatchEvent(px)))}return f!==null&&(f.visible=a!==null),h!==null&&(h.visible=l!==null),p!==null&&(p.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new Rr;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}class Ed{constructor(e,t=1,r=1e3){this.isFog=!0,this.name="",this.color=new yt(e),this.near=t,this.far=r}clone(){return new Ed(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class mx extends cn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pi,this.environmentIntensity=1,this.environmentRotation=new Pi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const ff=new j,gx=new j,vx=new dt;class es{constructor(e=new j(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,a){return this.normal.set(e,t,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const a=ff.subVectors(r,t).cross(gx.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const r=e.delta(ff),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const l=-(e.start.dot(this.normal)+this.constant)/a;return l<0||l>1?null:t.copy(e.start).addScaledVector(r,l)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||vx.getNormalMatrix(e),a=this.coplanarPoint(ff).applyMatrix4(e),l=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(l),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zr=new iu,_x=new St(.5,.5),Fl=new j;class Td{constructor(e=new es,t=new es,r=new es,a=new es,l=new es,c=new es){this.planes=[e,t,r,a,l,c]}set(e,t,r,a,l,c){const f=this.planes;return f[0].copy(e),f[1].copy(t),f[2].copy(r),f[3].copy(a),f[4].copy(l),f[5].copy(c),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=Ai,r=!1){const a=this.planes,l=e.elements,c=l[0],f=l[1],h=l[2],p=l[3],g=l[4],v=l[5],x=l[6],S=l[7],M=l[8],w=l[9],y=l[10],_=l[11],I=l[12],L=l[13],b=l[14],z=l[15];if(a[0].setComponents(p-c,S-g,_-M,z-I).normalize(),a[1].setComponents(p+c,S+g,_+M,z+I).normalize(),a[2].setComponents(p+f,S+v,_+w,z+L).normalize(),a[3].setComponents(p-f,S-v,_-w,z-L).normalize(),r)a[4].setComponents(h,x,y,b).normalize(),a[5].setComponents(p-h,S-x,_-y,z-b).normalize();else if(a[4].setComponents(p-h,S-x,_-y,z-b).normalize(),t===Ai)a[5].setComponents(p+h,S+x,_+y,z+b).normalize();else if(t===Kl)a[5].setComponents(h,x,y,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zr)}intersectsSprite(e){Zr.center.set(0,0,0);const t=_x.distanceTo(e.center);return Zr.radius=.7071067811865476+t,Zr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zr)}intersectsSphere(e){const t=this.planes,r=e.center,a=-e.radius;for(let l=0;l<6;l++)if(t[l].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const a=t[r];if(Fl.x=a.normal.x>0?e.max.x:e.min.x,Fl.y=a.normal.y>0?e.max.y:e.min.y,Fl.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Fl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class zg extends lo{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ql=new j,Jl=new j,Lm=new Xt,qo=new Pg,Ol=new iu,df=new j,Dm=new j;class xx extends cn{constructor(e=new Zn,t=new zg){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,r=[0];for(let a=1,l=t.count;a<l;a++)Ql.fromBufferAttribute(t,a-1),Jl.fromBufferAttribute(t,a),r[a]=r[a-1],r[a]+=Ql.distanceTo(Jl);e.setAttribute("lineDistance",new hn(r,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const r=this.geometry,a=this.matrixWorld,l=e.params.Line.threshold,c=r.drawRange;if(r.boundingSphere===null&&r.computeBoundingSphere(),Ol.copy(r.boundingSphere),Ol.applyMatrix4(a),Ol.radius+=l,e.ray.intersectsSphere(Ol)===!1)return;Lm.copy(a).invert(),qo.copy(e.ray).applyMatrix4(Lm);const f=l/((this.scale.x+this.scale.y+this.scale.z)/3),h=f*f,p=this.isLineSegments?2:1,g=r.index,x=r.attributes.position;if(g!==null){const S=Math.max(0,c.start),M=Math.min(g.count,c.start+c.count);for(let w=S,y=M-1;w<y;w+=p){const _=g.getX(w),I=g.getX(w+1),L=zl(this,e,qo,h,_,I,w);L&&t.push(L)}if(this.isLineLoop){const w=g.getX(M-1),y=g.getX(S),_=zl(this,e,qo,h,w,y,M-1);_&&t.push(_)}}else{const S=Math.max(0,c.start),M=Math.min(x.count,c.start+c.count);for(let w=S,y=M-1;w<y;w+=p){const _=zl(this,e,qo,h,w,w+1,w);_&&t.push(_)}if(this.isLineLoop){const w=zl(this,e,qo,h,M-1,S,M-1);w&&t.push(w)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,r=Object.keys(t);if(r.length>0){const a=t[r[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let l=0,c=a.length;l<c;l++){const f=a[l].name||String(l);this.morphTargetInfluences.push(0),this.morphTargetDictionary[f]=l}}}}}function zl(s,e,t,r,a,l,c){const f=s.geometry.attributes.position;if(Ql.fromBufferAttribute(f,a),Jl.fromBufferAttribute(f,l),t.distanceSqToSegment(Ql,Jl,df,Dm)>r)return;df.applyMatrix4(s.matrixWorld);const p=e.ray.origin.distanceTo(df);if(!(p<e.near||p>e.far))return{distance:p,point:Dm.clone().applyMatrix4(s.matrixWorld),index:c,face:null,faceIndex:null,barycoord:null,object:s}}class Im extends Ln{constructor(e,t,r,a,l,c,f,h,p){super(e,t,r,a,l,c,f,h,p),this.isCanvasTexture=!0,this.needsUpdate=!0}}class kg extends Ln{constructor(e,t,r=us,a,l,c,f=_i,h=_i,p,g=na,v=1){if(g!==na&&g!==ia)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const x={width:e,height:t,depth:v};super(x,a,l,c,f,h,g,r,p),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Md(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Bg extends Ln{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class os extends Zn{constructor(e=1,t=1,r=1,a=32,l=1,c=!1,f=0,h=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:r,radialSegments:a,heightSegments:l,openEnded:c,thetaStart:f,thetaLength:h};const p=this;a=Math.floor(a),l=Math.floor(l);const g=[],v=[],x=[],S=[];let M=0;const w=[],y=r/2;let _=0;I(),c===!1&&(e>0&&L(!0),t>0&&L(!1)),this.setIndex(g),this.setAttribute("position",new hn(v,3)),this.setAttribute("normal",new hn(x,3)),this.setAttribute("uv",new hn(S,2));function I(){const b=new j,z=new j;let F=0;const O=(t-e)/r;for(let X=0;X<=l;X++){const C=[],R=X/l,B=R*(t-e)+e;for(let $=0;$<=a;$++){const te=$/a,ue=te*h+f,ae=Math.sin(ue),oe=Math.cos(ue);z.x=B*ae,z.y=-R*r+y,z.z=B*oe,v.push(z.x,z.y,z.z),b.set(ae,O,oe).normalize(),x.push(b.x,b.y,b.z),S.push(te,1-R),C.push(M++)}w.push(C)}for(let X=0;X<a;X++)for(let C=0;C<l;C++){const R=w[C][X],B=w[C+1][X],$=w[C+1][X+1],te=w[C][X+1];(e>0||C!==0)&&(g.push(R,B,te),F+=3),(t>0||C!==l-1)&&(g.push(B,$,te),F+=3)}p.addGroup(_,F,0),_+=F}function L(b){const z=M,F=new St,O=new j;let X=0;const C=b===!0?e:t,R=b===!0?1:-1;for(let $=1;$<=a;$++)v.push(0,y*R,0),x.push(0,R,0),S.push(.5,.5),M++;const B=M;for(let $=0;$<=a;$++){const ue=$/a*h+f,ae=Math.cos(ue),oe=Math.sin(ue);O.x=C*oe,O.y=y*R,O.z=C*ae,v.push(O.x,O.y,O.z),x.push(0,R,0),F.x=ae*.5+.5,F.y=oe*.5*R+.5,S.push(F.x,F.y),M++}for(let $=0;$<a;$++){const te=z+$,ue=B+$;b===!0?g.push(ue,ue+1,te):g.push(ue+1,ue,te),X+=3}p.addGroup(_,X,b===!0?1:2),_+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new os(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class wd extends os{constructor(e=1,t=1,r=32,a=1,l=!1,c=0,f=Math.PI*2){super(0,e,t,r,a,l,c,f),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:r,heightSegments:a,openEnded:l,thetaStart:c,thetaLength:f}}static fromJSON(e){return new wd(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class so extends Zn{constructor(e=1,t=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:a};const l=e/2,c=t/2,f=Math.floor(r),h=Math.floor(a),p=f+1,g=h+1,v=e/f,x=t/h,S=[],M=[],w=[],y=[];for(let _=0;_<g;_++){const I=_*x-c;for(let L=0;L<p;L++){const b=L*v-l;M.push(b,-I,0),w.push(0,0,1),y.push(L/f),y.push(1-_/h)}}for(let _=0;_<h;_++)for(let I=0;I<f;I++){const L=I+p*_,b=I+p*(_+1),z=I+1+p*(_+1),F=I+1+p*_;S.push(L,b,F),S.push(b,z,F)}this.setIndex(S),this.setAttribute("position",new hn(M,3)),this.setAttribute("normal",new hn(w,3)),this.setAttribute("uv",new hn(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new so(e.width,e.height,e.widthSegments,e.heightSegments)}}class eu extends Zn{constructor(e=1,t=32,r=16,a=0,l=Math.PI*2,c=0,f=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:r,phiStart:a,phiLength:l,thetaStart:c,thetaLength:f},t=Math.max(3,Math.floor(t)),r=Math.max(2,Math.floor(r));const h=Math.min(c+f,Math.PI);let p=0;const g=[],v=new j,x=new j,S=[],M=[],w=[],y=[];for(let _=0;_<=r;_++){const I=[],L=_/r;let b=0;_===0&&c===0?b=.5/t:_===r&&h===Math.PI&&(b=-.5/t);for(let z=0;z<=t;z++){const F=z/t;v.x=-e*Math.cos(a+F*l)*Math.sin(c+L*f),v.y=e*Math.cos(c+L*f),v.z=e*Math.sin(a+F*l)*Math.sin(c+L*f),M.push(v.x,v.y,v.z),x.copy(v).normalize(),w.push(x.x,x.y,x.z),y.push(F+b,1-L),I.push(p++)}g.push(I)}for(let _=0;_<r;_++)for(let I=0;I<t;I++){const L=g[_][I+1],b=g[_][I],z=g[_+1][I],F=g[_+1][I+1];(_!==0||c>0)&&S.push(L,b,F),(_!==r-1||h<Math.PI)&&S.push(b,z,F)}this.setIndex(S),this.setAttribute("position",new hn(M,3)),this.setAttribute("normal",new hn(w,3)),this.setAttribute("uv",new hn(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new eu(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ru extends Zn{constructor(e=1,t=.4,r=12,a=48,l=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:r,tubularSegments:a,arc:l},r=Math.floor(r),a=Math.floor(a);const c=[],f=[],h=[],p=[],g=new j,v=new j,x=new j;for(let S=0;S<=r;S++)for(let M=0;M<=a;M++){const w=M/a*l,y=S/r*Math.PI*2;v.x=(e+t*Math.cos(y))*Math.cos(w),v.y=(e+t*Math.cos(y))*Math.sin(w),v.z=t*Math.sin(y),f.push(v.x,v.y,v.z),g.x=e*Math.cos(w),g.y=e*Math.sin(w),x.subVectors(v,g).normalize(),h.push(x.x,x.y,x.z),p.push(M/a),p.push(S/r)}for(let S=1;S<=r;S++)for(let M=1;M<=a;M++){const w=(a+1)*S+M-1,y=(a+1)*(S-1)+M-1,_=(a+1)*(S-1)+M,I=(a+1)*S+M;c.push(w,y,I),c.push(y,_,I)}this.setIndex(c),this.setAttribute("position",new hn(f,3)),this.setAttribute("normal",new hn(h,3)),this.setAttribute("uv",new hn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ru(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class nn extends lo{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ag,this.normalScale=new St(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class yx extends lo{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=v_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Sx extends lo{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ad extends cn{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new yt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Mx extends Ad{constructor(e,t,r){super(e,r),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new yt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const hf=new Xt,Um=new j,Nm=new j;class Hg{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new St(512,512),this.mapType=bi,this.map=null,this.mapPass=null,this.matrix=new Xt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Td,this._frameExtents=new St(1,1),this._viewportCount=1,this._viewports=[new It(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,r=this.matrix;Um.setFromMatrixPosition(e.matrixWorld),t.position.copy(Um),Nm.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Nm),t.updateMatrixWorld(),hf.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(hf,t.coordinateSystem,t.reversedDepth),t.reversedDepth?r.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):r.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),r.multiply(hf)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Fm=new Xt,$o=new j,pf=new j;class Ex extends Hg{constructor(){super(new Kn(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new St(4,2),this._viewportCount=6,this._viewports=[new It(2,1,1,1),new It(0,1,1,1),new It(3,1,1,1),new It(1,1,1,1),new It(3,0,1,1),new It(1,0,1,1)],this._cubeDirections=[new j(1,0,0),new j(-1,0,0),new j(0,0,1),new j(0,0,-1),new j(0,1,0),new j(0,-1,0)],this._cubeUps=[new j(0,1,0),new j(0,1,0),new j(0,1,0),new j(0,1,0),new j(0,0,1),new j(0,0,-1)]}updateMatrices(e,t=0){const r=this.camera,a=this.matrix,l=e.distance||r.far;l!==r.far&&(r.far=l,r.updateProjectionMatrix()),$o.setFromMatrixPosition(e.matrixWorld),r.position.copy($o),pf.copy(r.position),pf.add(this._cubeDirections[t]),r.up.copy(this._cubeUps[t]),r.lookAt(pf),r.updateMatrixWorld(),a.makeTranslation(-$o.x,-$o.y,-$o.z),Fm.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Fm,r.coordinateSystem,r.reversedDepth)}}class Tx extends Ad{constructor(e,t,r=0,a=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=r,this.decay=a,this.shadow=new Ex}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Vg extends Fg{constructor(e=-1,t=1,r=1,a=-1,l=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=a,this.near=l,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,a,l,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=l,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let l=r-e,c=r+e,f=a+t,h=a-t;if(this.view!==null&&this.view.enabled){const p=(this.right-this.left)/this.view.fullWidth/this.zoom,g=(this.top-this.bottom)/this.view.fullHeight/this.zoom;l+=p*this.view.offsetX,c=l+p*this.view.width,f-=g*this.view.offsetY,h=f-g*this.view.height}this.projectionMatrix.makeOrthographic(l,c,f,h,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class wx extends Hg{constructor(){super(new Vg(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Ax extends Ad{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(cn.DEFAULT_UP),this.updateMatrix(),this.target=new cn,this.shadow=new wx}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Rx extends Kn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}function Om(s,e,t,r){const a=Cx(r);switch(t){case Mg:return s*e;case Tg:return s*e/a.components*a.byteLength;case _d:return s*e/a.components*a.byteLength;case wg:return s*e*2/a.components*a.byteLength;case xd:return s*e*2/a.components*a.byteLength;case Eg:return s*e*3/a.components*a.byteLength;case vi:return s*e*4/a.components*a.byteLength;case yd:return s*e*4/a.components*a.byteLength;case Wl:case Xl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case jl:case Yl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Of:case kf:return Math.max(s,16)*Math.max(e,8)/4;case Ff:case zf:return Math.max(s,8)*Math.max(e,8)/2;case Bf:case Hf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Vf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Gf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Wf:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Xf:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case jf:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Yf:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case qf:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case $f:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Kf:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Zf:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Qf:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Jf:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case ed:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case td:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case nd:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case id:case rd:case sd:return Math.ceil(s/4)*Math.ceil(e/4)*16;case od:case ad:return Math.ceil(s/4)*Math.ceil(e/4)*8;case ld:case ud:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Cx(s){switch(s){case bi:case _g:return{byteLength:1,components:1};case ea:case xg:case la:return{byteLength:2,components:1};case gd:case vd:return{byteLength:2,components:4};case us:case md:case Ki:return{byteLength:4,components:1};case yg:case Sg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:pd}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=pd);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Gg(){let s=null,e=!1,t=null,r=null;function a(l,c){t(l,c),r=s.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(r=s.requestAnimationFrame(a),e=!0)},stop:function(){s.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(l){t=l},setContext:function(l){s=l}}}function bx(s){const e=new WeakMap;function t(f,h){const p=f.array,g=f.usage,v=p.byteLength,x=s.createBuffer();s.bindBuffer(h,x),s.bufferData(h,p,g),f.onUploadCallback();let S;if(p instanceof Float32Array)S=s.FLOAT;else if(typeof Float16Array<"u"&&p instanceof Float16Array)S=s.HALF_FLOAT;else if(p instanceof Uint16Array)f.isFloat16BufferAttribute?S=s.HALF_FLOAT:S=s.UNSIGNED_SHORT;else if(p instanceof Int16Array)S=s.SHORT;else if(p instanceof Uint32Array)S=s.UNSIGNED_INT;else if(p instanceof Int32Array)S=s.INT;else if(p instanceof Int8Array)S=s.BYTE;else if(p instanceof Uint8Array)S=s.UNSIGNED_BYTE;else if(p instanceof Uint8ClampedArray)S=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+p);return{buffer:x,type:S,bytesPerElement:p.BYTES_PER_ELEMENT,version:f.version,size:v}}function r(f,h,p){const g=h.array,v=h.updateRanges;if(s.bindBuffer(p,f),v.length===0)s.bufferSubData(p,0,g);else{v.sort((S,M)=>S.start-M.start);let x=0;for(let S=1;S<v.length;S++){const M=v[x],w=v[S];w.start<=M.start+M.count+1?M.count=Math.max(M.count,w.start+w.count-M.start):(++x,v[x]=w)}v.length=x+1;for(let S=0,M=v.length;S<M;S++){const w=v[S];s.bufferSubData(p,w.start*g.BYTES_PER_ELEMENT,g,w.start,w.count)}h.clearUpdateRanges()}h.onUploadCallback()}function a(f){return f.isInterleavedBufferAttribute&&(f=f.data),e.get(f)}function l(f){f.isInterleavedBufferAttribute&&(f=f.data);const h=e.get(f);h&&(s.deleteBuffer(h.buffer),e.delete(f))}function c(f,h){if(f.isInterleavedBufferAttribute&&(f=f.data),f.isGLBufferAttribute){const g=e.get(f);(!g||g.version<f.version)&&e.set(f,{buffer:f.buffer,type:f.type,bytesPerElement:f.elementSize,version:f.version});return}const p=e.get(f);if(p===void 0)e.set(f,t(f,h));else if(p.version<f.version){if(p.size!==f.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(p.buffer,f,h),p.version=f.version}}return{get:a,remove:l,update:c}}var Px=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Lx=`#ifdef USE_ALPHAHASH
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
#endif`,Dx=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ix=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Ux=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Nx=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Fx=`#ifdef USE_AOMAP
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
#endif`,Ox=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,zx=`#ifdef USE_BATCHING
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
#endif`,kx=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Bx=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Hx=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Vx=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Gx=`#ifdef USE_IRIDESCENCE
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
#endif`,Wx=`#ifdef USE_BUMPMAP
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
#endif`,Xx=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,jx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Yx=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,qx=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$x=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Kx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Zx=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Qx=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Jx=`#define PI 3.141592653589793
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
} // validated`,ey=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,ty=`vec3 transformedNormal = objectNormal;
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
#endif`,ny=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,iy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ry=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,sy=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,oy="gl_FragColor = linearToOutputTexel( gl_FragColor );",ay=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,ly=`#ifdef USE_ENVMAP
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
#endif`,uy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,cy=`#ifdef USE_ENVMAP
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
#endif`,fy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,dy=`#ifdef USE_ENVMAP
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
#endif`,hy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,py=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,my=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gy=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,vy=`#ifdef USE_GRADIENTMAP
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
}`,_y=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,xy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,yy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Sy=`uniform bool receiveShadow;
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
#endif`,My=`#ifdef USE_ENVMAP
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
#endif`,Ey=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ty=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ay=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Ry=`PhysicalMaterial material;
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
#endif`,Cy=`struct PhysicalMaterial {
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
}`,by=`
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
#endif`,Py=`#if defined( RE_IndirectDiffuse )
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
#endif`,Ly=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Dy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Iy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Uy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ny=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Fy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Oy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,zy=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ky=`#if defined( USE_POINTS_UV )
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
#endif`,By=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Hy=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Vy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Gy=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Wy=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Xy=`#ifdef USE_MORPHTARGETS
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
#endif`,jy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yy=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,qy=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$y=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ky=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zy=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qy=`#ifdef USE_NORMALMAP
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
#endif`,Jy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eS=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tS=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nS=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iS=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rS=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,oS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,aS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,uS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,cS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
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
#endif`,dS=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pS=`float getShadowMask() {
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
}`,mS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gS=`#ifdef USE_SKINNING
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
#endif`,vS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,_S=`#ifdef USE_SKINNING
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
#endif`,xS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,SS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,MS=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,ES=`#ifdef USE_TRANSMISSION
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
#endif`,TS=`#ifdef USE_TRANSMISSION
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
#endif`,wS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,AS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,RS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,CS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const bS=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,PS=`uniform sampler2D t2D;
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
}`,LS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,DS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,IS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,US=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,NS=`#include <common>
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
}`,FS=`#if DEPTH_PACKING == 3200
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
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,OS=`#define DISTANCE
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
}`,zS=`#define DISTANCE
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
}`,kS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,BS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HS=`uniform float scale;
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
}`,VS=`uniform vec3 diffuse;
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
}`,GS=`#include <common>
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
}`,WS=`uniform vec3 diffuse;
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
}`,XS=`#define LAMBERT
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
}`,jS=`#define LAMBERT
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
}`,YS=`#define MATCAP
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
}`,qS=`#define MATCAP
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
}`,$S=`#define NORMAL
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
}`,KS=`#define NORMAL
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
}`,ZS=`#define PHONG
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
}`,QS=`#define PHONG
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
}`,JS=`#define STANDARD
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
}`,eM=`#define STANDARD
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
}`,tM=`#define TOON
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
}`,nM=`#define TOON
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
}`,iM=`uniform float size;
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
}`,rM=`uniform vec3 diffuse;
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
}`,sM=`#include <common>
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
}`,oM=`uniform vec3 color;
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
}`,aM=`uniform float rotation;
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
}`,lM=`uniform vec3 diffuse;
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
}`,ht={alphahash_fragment:Px,alphahash_pars_fragment:Lx,alphamap_fragment:Dx,alphamap_pars_fragment:Ix,alphatest_fragment:Ux,alphatest_pars_fragment:Nx,aomap_fragment:Fx,aomap_pars_fragment:Ox,batching_pars_vertex:zx,batching_vertex:kx,begin_vertex:Bx,beginnormal_vertex:Hx,bsdfs:Vx,iridescence_fragment:Gx,bumpmap_pars_fragment:Wx,clipping_planes_fragment:Xx,clipping_planes_pars_fragment:jx,clipping_planes_pars_vertex:Yx,clipping_planes_vertex:qx,color_fragment:$x,color_pars_fragment:Kx,color_pars_vertex:Zx,color_vertex:Qx,common:Jx,cube_uv_reflection_fragment:ey,defaultnormal_vertex:ty,displacementmap_pars_vertex:ny,displacementmap_vertex:iy,emissivemap_fragment:ry,emissivemap_pars_fragment:sy,colorspace_fragment:oy,colorspace_pars_fragment:ay,envmap_fragment:ly,envmap_common_pars_fragment:uy,envmap_pars_fragment:cy,envmap_pars_vertex:fy,envmap_physical_pars_fragment:My,envmap_vertex:dy,fog_vertex:hy,fog_pars_vertex:py,fog_fragment:my,fog_pars_fragment:gy,gradientmap_pars_fragment:vy,lightmap_pars_fragment:_y,lights_lambert_fragment:xy,lights_lambert_pars_fragment:yy,lights_pars_begin:Sy,lights_toon_fragment:Ey,lights_toon_pars_fragment:Ty,lights_phong_fragment:wy,lights_phong_pars_fragment:Ay,lights_physical_fragment:Ry,lights_physical_pars_fragment:Cy,lights_fragment_begin:by,lights_fragment_maps:Py,lights_fragment_end:Ly,logdepthbuf_fragment:Dy,logdepthbuf_pars_fragment:Iy,logdepthbuf_pars_vertex:Uy,logdepthbuf_vertex:Ny,map_fragment:Fy,map_pars_fragment:Oy,map_particle_fragment:zy,map_particle_pars_fragment:ky,metalnessmap_fragment:By,metalnessmap_pars_fragment:Hy,morphinstance_vertex:Vy,morphcolor_vertex:Gy,morphnormal_vertex:Wy,morphtarget_pars_vertex:Xy,morphtarget_vertex:jy,normal_fragment_begin:Yy,normal_fragment_maps:qy,normal_pars_fragment:$y,normal_pars_vertex:Ky,normal_vertex:Zy,normalmap_pars_fragment:Qy,clearcoat_normal_fragment_begin:Jy,clearcoat_normal_fragment_maps:eS,clearcoat_pars_fragment:tS,iridescence_pars_fragment:nS,opaque_fragment:iS,packing:rS,premultiplied_alpha_fragment:sS,project_vertex:oS,dithering_fragment:aS,dithering_pars_fragment:lS,roughnessmap_fragment:uS,roughnessmap_pars_fragment:cS,shadowmap_pars_fragment:fS,shadowmap_pars_vertex:dS,shadowmap_vertex:hS,shadowmask_pars_fragment:pS,skinbase_vertex:mS,skinning_pars_vertex:gS,skinning_vertex:vS,skinnormal_vertex:_S,specularmap_fragment:xS,specularmap_pars_fragment:yS,tonemapping_fragment:SS,tonemapping_pars_fragment:MS,transmission_fragment:ES,transmission_pars_fragment:TS,uv_pars_fragment:wS,uv_pars_vertex:AS,uv_vertex:RS,worldpos_vertex:CS,background_vert:bS,background_frag:PS,backgroundCube_vert:LS,backgroundCube_frag:DS,cube_vert:IS,cube_frag:US,depth_vert:NS,depth_frag:FS,distanceRGBA_vert:OS,distanceRGBA_frag:zS,equirect_vert:kS,equirect_frag:BS,linedashed_vert:HS,linedashed_frag:VS,meshbasic_vert:GS,meshbasic_frag:WS,meshlambert_vert:XS,meshlambert_frag:jS,meshmatcap_vert:YS,meshmatcap_frag:qS,meshnormal_vert:$S,meshnormal_frag:KS,meshphong_vert:ZS,meshphong_frag:QS,meshphysical_vert:JS,meshphysical_frag:eM,meshtoon_vert:tM,meshtoon_frag:nM,points_vert:iM,points_frag:rM,shadow_vert:sM,shadow_frag:oM,sprite_vert:aM,sprite_frag:lM},be={common:{diffuse:{value:new yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new dt}},envmap:{envMap:{value:null},envMapRotation:{value:new dt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new dt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new dt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new dt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new dt},normalScale:{value:new St(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new dt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new dt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new dt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new dt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0},uvTransform:{value:new dt}},sprite:{diffuse:{value:new yt(16777215)},opacity:{value:1},center:{value:new St(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new dt},alphaMap:{value:null},alphaMapTransform:{value:new dt},alphaTest:{value:0}}},Ti={basic:{uniforms:bn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.fog]),vertexShader:ht.meshbasic_vert,fragmentShader:ht.meshbasic_frag},lambert:{uniforms:bn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new yt(0)}}]),vertexShader:ht.meshlambert_vert,fragmentShader:ht.meshlambert_frag},phong:{uniforms:bn([be.common,be.specularmap,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.fog,be.lights,{emissive:{value:new yt(0)},specular:{value:new yt(1118481)},shininess:{value:30}}]),vertexShader:ht.meshphong_vert,fragmentShader:ht.meshphong_frag},standard:{uniforms:bn([be.common,be.envmap,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.roughnessmap,be.metalnessmap,be.fog,be.lights,{emissive:{value:new yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ht.meshphysical_vert,fragmentShader:ht.meshphysical_frag},toon:{uniforms:bn([be.common,be.aomap,be.lightmap,be.emissivemap,be.bumpmap,be.normalmap,be.displacementmap,be.gradientmap,be.fog,be.lights,{emissive:{value:new yt(0)}}]),vertexShader:ht.meshtoon_vert,fragmentShader:ht.meshtoon_frag},matcap:{uniforms:bn([be.common,be.bumpmap,be.normalmap,be.displacementmap,be.fog,{matcap:{value:null}}]),vertexShader:ht.meshmatcap_vert,fragmentShader:ht.meshmatcap_frag},points:{uniforms:bn([be.points,be.fog]),vertexShader:ht.points_vert,fragmentShader:ht.points_frag},dashed:{uniforms:bn([be.common,be.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ht.linedashed_vert,fragmentShader:ht.linedashed_frag},depth:{uniforms:bn([be.common,be.displacementmap]),vertexShader:ht.depth_vert,fragmentShader:ht.depth_frag},normal:{uniforms:bn([be.common,be.bumpmap,be.normalmap,be.displacementmap,{opacity:{value:1}}]),vertexShader:ht.meshnormal_vert,fragmentShader:ht.meshnormal_frag},sprite:{uniforms:bn([be.sprite,be.fog]),vertexShader:ht.sprite_vert,fragmentShader:ht.sprite_frag},background:{uniforms:{uvTransform:{value:new dt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ht.background_vert,fragmentShader:ht.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new dt}},vertexShader:ht.backgroundCube_vert,fragmentShader:ht.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ht.cube_vert,fragmentShader:ht.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ht.equirect_vert,fragmentShader:ht.equirect_frag},distanceRGBA:{uniforms:bn([be.common,be.displacementmap,{referencePosition:{value:new j},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ht.distanceRGBA_vert,fragmentShader:ht.distanceRGBA_frag},shadow:{uniforms:bn([be.lights,be.fog,{color:{value:new yt(0)},opacity:{value:1}}]),vertexShader:ht.shadow_vert,fragmentShader:ht.shadow_frag}};Ti.physical={uniforms:bn([Ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new dt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new dt},clearcoatNormalScale:{value:new St(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new dt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new dt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new dt},sheen:{value:0},sheenColor:{value:new yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new dt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new dt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new dt},transmissionSamplerSize:{value:new St},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new dt},attenuationDistance:{value:0},attenuationColor:{value:new yt(0)},specularColor:{value:new yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new dt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new dt},anisotropyVector:{value:new St},anisotropyMap:{value:null},anisotropyMapTransform:{value:new dt}}]),vertexShader:ht.meshphysical_vert,fragmentShader:ht.meshphysical_frag};const kl={r:0,b:0,g:0},Qr=new Pi,uM=new Xt;function cM(s,e,t,r,a,l,c){const f=new yt(0);let h=l===!0?0:1,p,g,v=null,x=0,S=null;function M(L){let b=L.isScene===!0?L.background:null;return b&&b.isTexture&&(b=(L.backgroundBlurriness>0?t:e).get(b)),b}function w(L){let b=!1;const z=M(L);z===null?_(f,h):z&&z.isColor&&(_(z,1),b=!0);const F=s.xr.getEnvironmentBlendMode();F==="additive"?r.buffers.color.setClear(0,0,0,1,c):F==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,c),(s.autoClear||b)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function y(L,b){const z=M(b);z&&(z.isCubeTexture||z.mapping===nu)?(g===void 0&&(g=new $t(new Li(1,1,1),new Lr({name:"BackgroundCubeMaterial",uniforms:ro(Ti.backgroundCube.uniforms),vertexShader:Ti.backgroundCube.vertexShader,fragmentShader:Ti.backgroundCube.fragmentShader,side:Bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),g.geometry.deleteAttribute("normal"),g.geometry.deleteAttribute("uv"),g.onBeforeRender=function(F,O,X){this.matrixWorld.copyPosition(X.matrixWorld)},Object.defineProperty(g.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(g)),Qr.copy(b.backgroundRotation),Qr.x*=-1,Qr.y*=-1,Qr.z*=-1,z.isCubeTexture&&z.isRenderTargetTexture===!1&&(Qr.y*=-1,Qr.z*=-1),g.material.uniforms.envMap.value=z,g.material.uniforms.flipEnvMap.value=z.isCubeTexture&&z.isRenderTargetTexture===!1?-1:1,g.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,g.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,g.material.uniforms.backgroundRotation.value.setFromMatrix4(uM.makeRotationFromEuler(Qr)),g.material.toneMapped=At.getTransfer(z.colorSpace)!==Dt,(v!==z||x!==z.version||S!==s.toneMapping)&&(g.material.needsUpdate=!0,v=z,x=z.version,S=s.toneMapping),g.layers.enableAll(),L.unshift(g,g.geometry,g.material,0,0,null)):z&&z.isTexture&&(p===void 0&&(p=new $t(new so(2,2),new Lr({name:"BackgroundMaterial",uniforms:ro(Ti.background.uniforms),vertexShader:Ti.background.vertexShader,fragmentShader:Ti.background.fragmentShader,side:Pr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),p.geometry.deleteAttribute("normal"),Object.defineProperty(p.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(p)),p.material.uniforms.t2D.value=z,p.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,p.material.toneMapped=At.getTransfer(z.colorSpace)!==Dt,z.matrixAutoUpdate===!0&&z.updateMatrix(),p.material.uniforms.uvTransform.value.copy(z.matrix),(v!==z||x!==z.version||S!==s.toneMapping)&&(p.material.needsUpdate=!0,v=z,x=z.version,S=s.toneMapping),p.layers.enableAll(),L.unshift(p,p.geometry,p.material,0,0,null))}function _(L,b){L.getRGB(kl,Ng(s)),r.buffers.color.setClear(kl.r,kl.g,kl.b,b,c)}function I(){g!==void 0&&(g.geometry.dispose(),g.material.dispose(),g=void 0),p!==void 0&&(p.geometry.dispose(),p.material.dispose(),p=void 0)}return{getClearColor:function(){return f},setClearColor:function(L,b=1){f.set(L),h=b,_(f,h)},getClearAlpha:function(){return h},setClearAlpha:function(L){h=L,_(f,h)},render:w,addToRenderList:y,dispose:I}}function fM(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),r={},a=x(null);let l=a,c=!1;function f(R,B,$,te,ue){let ae=!1;const oe=v(te,$,B);l!==oe&&(l=oe,p(l.object)),ae=S(R,te,$,ue),ae&&M(R,te,$,ue),ue!==null&&e.update(ue,s.ELEMENT_ARRAY_BUFFER),(ae||c)&&(c=!1,b(R,B,$,te),ue!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(ue).buffer))}function h(){return s.createVertexArray()}function p(R){return s.bindVertexArray(R)}function g(R){return s.deleteVertexArray(R)}function v(R,B,$){const te=$.wireframe===!0;let ue=r[R.id];ue===void 0&&(ue={},r[R.id]=ue);let ae=ue[B.id];ae===void 0&&(ae={},ue[B.id]=ae);let oe=ae[te];return oe===void 0&&(oe=x(h()),ae[te]=oe),oe}function x(R){const B=[],$=[],te=[];for(let ue=0;ue<t;ue++)B[ue]=0,$[ue]=0,te[ue]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:$,attributeDivisors:te,object:R,attributes:{},index:null}}function S(R,B,$,te){const ue=l.attributes,ae=B.attributes;let oe=0;const he=$.getAttributes();for(const H in he)if(he[H].location>=0){const se=ue[H];let U=ae[H];if(U===void 0&&(H==="instanceMatrix"&&R.instanceMatrix&&(U=R.instanceMatrix),H==="instanceColor"&&R.instanceColor&&(U=R.instanceColor)),se===void 0||se.attribute!==U||U&&se.data!==U.data)return!0;oe++}return l.attributesNum!==oe||l.index!==te}function M(R,B,$,te){const ue={},ae=B.attributes;let oe=0;const he=$.getAttributes();for(const H in he)if(he[H].location>=0){let se=ae[H];se===void 0&&(H==="instanceMatrix"&&R.instanceMatrix&&(se=R.instanceMatrix),H==="instanceColor"&&R.instanceColor&&(se=R.instanceColor));const U={};U.attribute=se,se&&se.data&&(U.data=se.data),ue[H]=U,oe++}l.attributes=ue,l.attributesNum=oe,l.index=te}function w(){const R=l.newAttributes;for(let B=0,$=R.length;B<$;B++)R[B]=0}function y(R){_(R,0)}function _(R,B){const $=l.newAttributes,te=l.enabledAttributes,ue=l.attributeDivisors;$[R]=1,te[R]===0&&(s.enableVertexAttribArray(R),te[R]=1),ue[R]!==B&&(s.vertexAttribDivisor(R,B),ue[R]=B)}function I(){const R=l.newAttributes,B=l.enabledAttributes;for(let $=0,te=B.length;$<te;$++)B[$]!==R[$]&&(s.disableVertexAttribArray($),B[$]=0)}function L(R,B,$,te,ue,ae,oe){oe===!0?s.vertexAttribIPointer(R,B,$,ue,ae):s.vertexAttribPointer(R,B,$,te,ue,ae)}function b(R,B,$,te){w();const ue=te.attributes,ae=$.getAttributes(),oe=B.defaultAttributeValues;for(const he in ae){const H=ae[he];if(H.location>=0){let ce=ue[he];if(ce===void 0&&(he==="instanceMatrix"&&R.instanceMatrix&&(ce=R.instanceMatrix),he==="instanceColor"&&R.instanceColor&&(ce=R.instanceColor)),ce!==void 0){const se=ce.normalized,U=ce.itemSize,re=e.get(ce);if(re===void 0)continue;const Fe=re.buffer,Xe=re.type,He=re.bytesPerElement,ee=Xe===s.INT||Xe===s.UNSIGNED_INT||ce.gpuType===md;if(ce.isInterleavedBufferAttribute){const fe=ce.data,Me=fe.stride,Le=ce.offset;if(fe.isInstancedInterleavedBuffer){for(let Ne=0;Ne<H.locationSize;Ne++)_(H.location+Ne,fe.meshPerAttribute);R.isInstancedMesh!==!0&&te._maxInstanceCount===void 0&&(te._maxInstanceCount=fe.meshPerAttribute*fe.count)}else for(let Ne=0;Ne<H.locationSize;Ne++)y(H.location+Ne);s.bindBuffer(s.ARRAY_BUFFER,Fe);for(let Ne=0;Ne<H.locationSize;Ne++)L(H.location+Ne,U/H.locationSize,Xe,se,Me*He,(Le+U/H.locationSize*Ne)*He,ee)}else{if(ce.isInstancedBufferAttribute){for(let fe=0;fe<H.locationSize;fe++)_(H.location+fe,ce.meshPerAttribute);R.isInstancedMesh!==!0&&te._maxInstanceCount===void 0&&(te._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let fe=0;fe<H.locationSize;fe++)y(H.location+fe);s.bindBuffer(s.ARRAY_BUFFER,Fe);for(let fe=0;fe<H.locationSize;fe++)L(H.location+fe,U/H.locationSize,Xe,se,U*He,U/H.locationSize*fe*He,ee)}}else if(oe!==void 0){const se=oe[he];if(se!==void 0)switch(se.length){case 2:s.vertexAttrib2fv(H.location,se);break;case 3:s.vertexAttrib3fv(H.location,se);break;case 4:s.vertexAttrib4fv(H.location,se);break;default:s.vertexAttrib1fv(H.location,se)}}}}I()}function z(){X();for(const R in r){const B=r[R];for(const $ in B){const te=B[$];for(const ue in te)g(te[ue].object),delete te[ue];delete B[$]}delete r[R]}}function F(R){if(r[R.id]===void 0)return;const B=r[R.id];for(const $ in B){const te=B[$];for(const ue in te)g(te[ue].object),delete te[ue];delete B[$]}delete r[R.id]}function O(R){for(const B in r){const $=r[B];if($[R.id]===void 0)continue;const te=$[R.id];for(const ue in te)g(te[ue].object),delete te[ue];delete $[R.id]}}function X(){C(),c=!0,l!==a&&(l=a,p(l.object))}function C(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:f,reset:X,resetDefaultState:C,dispose:z,releaseStatesOfGeometry:F,releaseStatesOfProgram:O,initAttributes:w,enableAttribute:y,disableUnusedAttributes:I}}function dM(s,e,t){let r;function a(p){r=p}function l(p,g){s.drawArrays(r,p,g),t.update(g,r,1)}function c(p,g,v){v!==0&&(s.drawArraysInstanced(r,p,g,v),t.update(g,r,v))}function f(p,g,v){if(v===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,p,0,g,0,v);let S=0;for(let M=0;M<v;M++)S+=g[M];t.update(S,r,1)}function h(p,g,v,x){if(v===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let M=0;M<p.length;M++)c(p[M],g[M],x[M]);else{S.multiDrawArraysInstancedWEBGL(r,p,0,g,0,x,0,v);let M=0;for(let w=0;w<v;w++)M+=g[w]*x[w];t.update(M,r,1)}}this.setMode=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=f,this.renderMultiDrawInstances=h}function hM(s,e,t,r){let a;function l(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const O=e.get("EXT_texture_filter_anisotropic");a=s.getParameter(O.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function c(O){return!(O!==vi&&r.convert(O)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function f(O){const X=O===la&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(O!==bi&&r.convert(O)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&O!==Ki&&!X)}function h(O){if(O==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";O="mediump"}return O==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let p=t.precision!==void 0?t.precision:"highp";const g=h(p);g!==p&&(console.warn("THREE.WebGLRenderer:",p,"not supported, using",g,"instead."),p=g);const v=t.logarithmicDepthBuffer===!0,x=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),S=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=s.getParameter(s.MAX_TEXTURE_SIZE),y=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),I=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),L=s.getParameter(s.MAX_VARYING_VECTORS),b=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),z=M>0,F=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:l,getMaxPrecision:h,textureFormatReadable:c,textureTypeReadable:f,precision:p,logarithmicDepthBuffer:v,reversedDepthBuffer:x,maxTextures:S,maxVertexTextures:M,maxTextureSize:w,maxCubemapSize:y,maxAttributes:_,maxVertexUniforms:I,maxVaryings:L,maxFragmentUniforms:b,vertexTextures:z,maxSamples:F}}function pM(s){const e=this;let t=null,r=0,a=!1,l=!1;const c=new es,f=new dt,h={value:null,needsUpdate:!1};this.uniform=h,this.numPlanes=0,this.numIntersection=0,this.init=function(v,x){const S=v.length!==0||x||r!==0||a;return a=x,r=v.length,S},this.beginShadows=function(){l=!0,g(null)},this.endShadows=function(){l=!1},this.setGlobalState=function(v,x){t=g(v,x,0)},this.setState=function(v,x,S){const M=v.clippingPlanes,w=v.clipIntersection,y=v.clipShadows,_=s.get(v);if(!a||M===null||M.length===0||l&&!y)l?g(null):p();else{const I=l?0:r,L=I*4;let b=_.clippingState||null;h.value=b,b=g(M,x,L,S);for(let z=0;z!==L;++z)b[z]=t[z];_.clippingState=b,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=I}};function p(){h.value!==t&&(h.value=t,h.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function g(v,x,S,M){const w=v!==null?v.length:0;let y=null;if(w!==0){if(y=h.value,M!==!0||y===null){const _=S+w*4,I=x.matrixWorldInverse;f.getNormalMatrix(I),(y===null||y.length<_)&&(y=new Float32Array(_));for(let L=0,b=S;L!==w;++L,b+=4)c.copy(v[L]).applyMatrix4(I,f),c.normal.toArray(y,b),y[b+3]=c.constant}h.value=y,h.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,y}}function mM(s){let e=new WeakMap;function t(c,f){return f===Df?c.mapping=to:f===If&&(c.mapping=no),c}function r(c){if(c&&c.isTexture){const f=c.mapping;if(f===Df||f===If)if(e.has(c)){const h=e.get(c).texture;return t(h,c.mapping)}else{const h=c.image;if(h&&h.height>0){const p=new hx(h.height);return p.fromEquirectangularTexture(s,c),e.set(c,p),c.addEventListener("dispose",a),t(p.texture,c.mapping)}else return null}}return c}function a(c){const f=c.target;f.removeEventListener("dispose",a);const h=e.get(f);h!==void 0&&(e.delete(f),h.dispose())}function l(){e=new WeakMap}return{get:r,dispose:l}}const Zs=4,zm=[.125,.215,.35,.446,.526,.582],is=20,mf=new Vg,km=new yt;let gf=null,vf=0,_f=0,xf=!1;const ts=(1+Math.sqrt(5))/2,$s=1/ts,Bm=[new j(-ts,$s,0),new j(ts,$s,0),new j(-$s,0,ts),new j($s,0,ts),new j(0,ts,-$s),new j(0,ts,$s),new j(-1,1,-1),new j(1,1,-1),new j(-1,1,1),new j(1,1,1)],gM=new j;class Hm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,r=.1,a=100,l={}){const{size:c=256,position:f=gM}=l;gf=this._renderer.getRenderTarget(),vf=this._renderer.getActiveCubeFace(),_f=this._renderer.getActiveMipmapLevel(),xf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(c);const h=this._allocateTargets();return h.depthBuffer=!0,this._sceneToCubeUV(e,r,a,h,f),t>0&&this._blur(h,0,0,t),this._applyPMREM(h),this._cleanup(h),h}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Wm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Gm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(gf,vf,_f),this._renderer.xr.enabled=xf,e.scissorTest=!1,Bl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===to||e.mapping===no?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),gf=this._renderer.getRenderTarget(),vf=this._renderer.getActiveCubeFace(),_f=this._renderer.getActiveMipmapLevel(),xf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:wi,minFilter:wi,generateMipmaps:!1,type:la,format:vi,colorSpace:io,depthBuffer:!1},a=Vm(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Vm(e,t,r);const{_lodMax:l}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=vM(l)),this._blurMaterial=_M(l,e,t)}return a}_compileMaterial(e){const t=new $t(this._lodPlanes[0],e);this._renderer.compile(t,mf)}_sceneToCubeUV(e,t,r,a,l){const h=new Kn(90,1,t,r),p=[1,-1,1,1,1,1],g=[1,1,1,-1,-1,-1],v=this._renderer,x=v.autoClear,S=v.toneMapping;v.getClearColor(km),v.toneMapping=br,v.autoClear=!1,v.state.buffers.depth.getReversed()&&(v.setRenderTarget(a),v.clearDepth(),v.setRenderTarget(null));const w=new oa({name:"PMREM.Background",side:Bn,depthWrite:!1,depthTest:!1}),y=new $t(new Li,w);let _=!1;const I=e.background;I?I.isColor&&(w.color.copy(I),e.background=null,_=!0):(w.color.copy(km),_=!0);for(let L=0;L<6;L++){const b=L%3;b===0?(h.up.set(0,p[L],0),h.position.set(l.x,l.y,l.z),h.lookAt(l.x+g[L],l.y,l.z)):b===1?(h.up.set(0,0,p[L]),h.position.set(l.x,l.y,l.z),h.lookAt(l.x,l.y+g[L],l.z)):(h.up.set(0,p[L],0),h.position.set(l.x,l.y,l.z),h.lookAt(l.x,l.y,l.z+g[L]));const z=this._cubeSize;Bl(a,b*z,L>2?z:0,z,z),v.setRenderTarget(a),_&&v.render(y,h),v.render(e,h)}y.geometry.dispose(),y.material.dispose(),v.toneMapping=S,v.autoClear=x,e.background=I}_textureToCubeUV(e,t){const r=this._renderer,a=e.mapping===to||e.mapping===no;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=Wm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Gm());const l=a?this._cubemapMaterial:this._equirectMaterial,c=new $t(this._lodPlanes[0],l),f=l.uniforms;f.envMap.value=e;const h=this._cubeSize;Bl(t,0,0,3*h,2*h),r.setRenderTarget(t),r.render(c,mf)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const a=this._lodPlanes.length;for(let l=1;l<a;l++){const c=Math.sqrt(this._sigmas[l]*this._sigmas[l]-this._sigmas[l-1]*this._sigmas[l-1]),f=Bm[(a-l-1)%Bm.length];this._blur(e,l-1,l,c,f)}t.autoClear=r}_blur(e,t,r,a,l){const c=this._pingPongRenderTarget;this._halfBlur(e,c,t,r,a,"latitudinal",l),this._halfBlur(c,e,r,r,a,"longitudinal",l)}_halfBlur(e,t,r,a,l,c,f){const h=this._renderer,p=this._blurMaterial;c!=="latitudinal"&&c!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const g=3,v=new $t(this._lodPlanes[a],p),x=p.uniforms,S=this._sizeLods[r]-1,M=isFinite(l)?Math.PI/(2*S):2*Math.PI/(2*is-1),w=l/M,y=isFinite(l)?1+Math.floor(g*w):is;y>is&&console.warn(`sigmaRadians, ${l}, is too large and will clip, as it requested ${y} samples when the maximum is set to ${is}`);const _=[];let I=0;for(let O=0;O<is;++O){const X=O/w,C=Math.exp(-X*X/2);_.push(C),O===0?I+=C:O<y&&(I+=2*C)}for(let O=0;O<_.length;O++)_[O]=_[O]/I;x.envMap.value=e.texture,x.samples.value=y,x.weights.value=_,x.latitudinal.value=c==="latitudinal",f&&(x.poleAxis.value=f);const{_lodMax:L}=this;x.dTheta.value=M,x.mipInt.value=L-r;const b=this._sizeLods[a],z=3*b*(a>L-Zs?a-L+Zs:0),F=4*(this._cubeSize-b);Bl(t,z,F,3*b,2*b),h.setRenderTarget(t),h.render(v,mf)}}function vM(s){const e=[],t=[],r=[];let a=s;const l=s-Zs+1+zm.length;for(let c=0;c<l;c++){const f=Math.pow(2,a);t.push(f);let h=1/f;c>s-Zs?h=zm[c-s+Zs-1]:c===0&&(h=0),r.push(h);const p=1/(f-2),g=-p,v=1+p,x=[g,g,v,g,v,v,g,g,v,v,g,v],S=6,M=6,w=3,y=2,_=1,I=new Float32Array(w*M*S),L=new Float32Array(y*M*S),b=new Float32Array(_*M*S);for(let F=0;F<S;F++){const O=F%3*2/3-1,X=F>2?0:-1,C=[O,X,0,O+2/3,X,0,O+2/3,X+1,0,O,X,0,O+2/3,X+1,0,O,X+1,0];I.set(C,w*M*F),L.set(x,y*M*F);const R=[F,F,F,F,F,F];b.set(R,_*M*F)}const z=new Zn;z.setAttribute("position",new xi(I,w)),z.setAttribute("uv",new xi(L,y)),z.setAttribute("faceIndex",new xi(b,_)),e.push(z),a>Zs&&a--}return{lodPlanes:e,sizeLods:t,sigmas:r}}function Vm(s,e,t){const r=new cs(s,e,t);return r.texture.mapping=nu,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function Bl(s,e,t,r,a){s.viewport.set(e,t,r,a),s.scissor.set(e,t,r,a)}function _M(s,e,t){const r=new Float32Array(is),a=new j(0,1,0);return new Lr({name:"SphericalGaussianBlur",defines:{n:is,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:Rd(),fragmentShader:`

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
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function Gm(){return new Lr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Rd(),fragmentShader:`

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
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function Wm(){return new Lr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Rd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function Rd(){return`

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
	`}function xM(s){let e=new WeakMap,t=null;function r(f){if(f&&f.isTexture){const h=f.mapping,p=h===Df||h===If,g=h===to||h===no;if(p||g){let v=e.get(f);const x=v!==void 0?v.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==x)return t===null&&(t=new Hm(s)),v=p?t.fromEquirectangular(f,v):t.fromCubemap(f,v),v.texture.pmremVersion=f.pmremVersion,e.set(f,v),v.texture;if(v!==void 0)return v.texture;{const S=f.image;return p&&S&&S.height>0||g&&S&&a(S)?(t===null&&(t=new Hm(s)),v=p?t.fromEquirectangular(f):t.fromCubemap(f),v.texture.pmremVersion=f.pmremVersion,e.set(f,v),f.addEventListener("dispose",l),v.texture):null}}}return f}function a(f){let h=0;const p=6;for(let g=0;g<p;g++)f[g]!==void 0&&h++;return h===p}function l(f){const h=f.target;h.removeEventListener("dispose",l);const p=e.get(h);p!==void 0&&(e.delete(h),p.dispose())}function c(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:r,dispose:c}}function yM(s){const e={};function t(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=s.getExtension(r)}return e[r]=a,a}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const a=t(r);return a===null&&sa("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function SM(s,e,t,r){const a={},l=new WeakMap;function c(v){const x=v.target;x.index!==null&&e.remove(x.index);for(const M in x.attributes)e.remove(x.attributes[M]);x.removeEventListener("dispose",c),delete a[x.id];const S=l.get(x);S&&(e.remove(S),l.delete(x)),r.releaseStatesOfGeometry(x),x.isInstancedBufferGeometry===!0&&delete x._maxInstanceCount,t.memory.geometries--}function f(v,x){return a[x.id]===!0||(x.addEventListener("dispose",c),a[x.id]=!0,t.memory.geometries++),x}function h(v){const x=v.attributes;for(const S in x)e.update(x[S],s.ARRAY_BUFFER)}function p(v){const x=[],S=v.index,M=v.attributes.position;let w=0;if(S!==null){const I=S.array;w=S.version;for(let L=0,b=I.length;L<b;L+=3){const z=I[L+0],F=I[L+1],O=I[L+2];x.push(z,F,F,O,O,z)}}else if(M!==void 0){const I=M.array;w=M.version;for(let L=0,b=I.length/3-1;L<b;L+=3){const z=L+0,F=L+1,O=L+2;x.push(z,F,F,O,O,z)}}else return;const y=new(Cg(x)?Ug:Ig)(x,1);y.version=w;const _=l.get(v);_&&e.remove(_),l.set(v,y)}function g(v){const x=l.get(v);if(x){const S=v.index;S!==null&&x.version<S.version&&p(v)}else p(v);return l.get(v)}return{get:f,update:h,getWireframeAttribute:g}}function MM(s,e,t){let r;function a(x){r=x}let l,c;function f(x){l=x.type,c=x.bytesPerElement}function h(x,S){s.drawElements(r,S,l,x*c),t.update(S,r,1)}function p(x,S,M){M!==0&&(s.drawElementsInstanced(r,S,l,x*c,M),t.update(S,r,M))}function g(x,S,M){if(M===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,S,0,l,x,0,M);let y=0;for(let _=0;_<M;_++)y+=S[_];t.update(y,r,1)}function v(x,S,M,w){if(M===0)return;const y=e.get("WEBGL_multi_draw");if(y===null)for(let _=0;_<x.length;_++)p(x[_]/c,S[_],w[_]);else{y.multiDrawElementsInstancedWEBGL(r,S,0,l,x,0,w,0,M);let _=0;for(let I=0;I<M;I++)_+=S[I]*w[I];t.update(_,r,1)}}this.setMode=a,this.setIndex=f,this.render=h,this.renderInstances=p,this.renderMultiDraw=g,this.renderMultiDrawInstances=v}function EM(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(l,c,f){switch(t.calls++,c){case s.TRIANGLES:t.triangles+=f*(l/3);break;case s.LINES:t.lines+=f*(l/2);break;case s.LINE_STRIP:t.lines+=f*(l-1);break;case s.LINE_LOOP:t.lines+=f*l;break;case s.POINTS:t.points+=f*l;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",c);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:r}}function TM(s,e,t){const r=new WeakMap,a=new It;function l(c,f,h){const p=c.morphTargetInfluences,g=f.morphAttributes.position||f.morphAttributes.normal||f.morphAttributes.color,v=g!==void 0?g.length:0;let x=r.get(f);if(x===void 0||x.count!==v){let R=function(){X.dispose(),r.delete(f),f.removeEventListener("dispose",R)};var S=R;x!==void 0&&x.texture.dispose();const M=f.morphAttributes.position!==void 0,w=f.morphAttributes.normal!==void 0,y=f.morphAttributes.color!==void 0,_=f.morphAttributes.position||[],I=f.morphAttributes.normal||[],L=f.morphAttributes.color||[];let b=0;M===!0&&(b=1),w===!0&&(b=2),y===!0&&(b=3);let z=f.attributes.position.count*b,F=1;z>e.maxTextureSize&&(F=Math.ceil(z/e.maxTextureSize),z=e.maxTextureSize);const O=new Float32Array(z*F*4*v),X=new bg(O,z,F,v);X.type=Ki,X.needsUpdate=!0;const C=b*4;for(let B=0;B<v;B++){const $=_[B],te=I[B],ue=L[B],ae=z*F*4*B;for(let oe=0;oe<$.count;oe++){const he=oe*C;M===!0&&(a.fromBufferAttribute($,oe),O[ae+he+0]=a.x,O[ae+he+1]=a.y,O[ae+he+2]=a.z,O[ae+he+3]=0),w===!0&&(a.fromBufferAttribute(te,oe),O[ae+he+4]=a.x,O[ae+he+5]=a.y,O[ae+he+6]=a.z,O[ae+he+7]=0),y===!0&&(a.fromBufferAttribute(ue,oe),O[ae+he+8]=a.x,O[ae+he+9]=a.y,O[ae+he+10]=a.z,O[ae+he+11]=ue.itemSize===4?a.w:1)}}x={count:v,texture:X,size:new St(z,F)},r.set(f,x),f.addEventListener("dispose",R)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)h.getUniforms().setValue(s,"morphTexture",c.morphTexture,t);else{let M=0;for(let y=0;y<p.length;y++)M+=p[y];const w=f.morphTargetsRelative?1:1-M;h.getUniforms().setValue(s,"morphTargetBaseInfluence",w),h.getUniforms().setValue(s,"morphTargetInfluences",p)}h.getUniforms().setValue(s,"morphTargetsTexture",x.texture,t),h.getUniforms().setValue(s,"morphTargetsTextureSize",x.size)}return{update:l}}function wM(s,e,t,r){let a=new WeakMap;function l(h){const p=r.render.frame,g=h.geometry,v=e.get(h,g);if(a.get(v)!==p&&(e.update(v),a.set(v,p)),h.isInstancedMesh&&(h.hasEventListener("dispose",f)===!1&&h.addEventListener("dispose",f),a.get(h)!==p&&(t.update(h.instanceMatrix,s.ARRAY_BUFFER),h.instanceColor!==null&&t.update(h.instanceColor,s.ARRAY_BUFFER),a.set(h,p))),h.isSkinnedMesh){const x=h.skeleton;a.get(x)!==p&&(x.update(),a.set(x,p))}return v}function c(){a=new WeakMap}function f(h){const p=h.target;p.removeEventListener("dispose",f),t.remove(p.instanceMatrix),p.instanceColor!==null&&t.remove(p.instanceColor)}return{update:l,dispose:c}}const Wg=new Ln,Xm=new kg(1,1),Xg=new bg,jg=new K_,Yg=new Og,jm=[],Ym=[],qm=new Float32Array(16),$m=new Float32Array(9),Km=new Float32Array(4);function uo(s,e,t){const r=s[0];if(r<=0||r>0)return s;const a=e*t;let l=jm[a];if(l===void 0&&(l=new Float32Array(a),jm[a]=l),e!==0){r.toArray(l,0);for(let c=1,f=0;c!==e;++c)f+=t,s[c].toArray(l,f)}return l}function rn(s,e){if(s.length!==e.length)return!1;for(let t=0,r=s.length;t<r;t++)if(s[t]!==e[t])return!1;return!0}function sn(s,e){for(let t=0,r=e.length;t<r;t++)s[t]=e[t]}function su(s,e){let t=Ym[e];t===void 0&&(t=new Int32Array(e),Ym[e]=t);for(let r=0;r!==e;++r)t[r]=s.allocateTextureUnit();return t}function AM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function RM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2fv(this.addr,e),sn(t,e)}}function CM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(rn(t,e))return;s.uniform3fv(this.addr,e),sn(t,e)}}function bM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4fv(this.addr,e),sn(t,e)}}function PM(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;Km.set(r),s.uniformMatrix2fv(this.addr,!1,Km),sn(t,r)}}function LM(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;$m.set(r),s.uniformMatrix3fv(this.addr,!1,$m),sn(t,r)}}function DM(s,e){const t=this.cache,r=e.elements;if(r===void 0){if(rn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),sn(t,e)}else{if(rn(t,r))return;qm.set(r),s.uniformMatrix4fv(this.addr,!1,qm),sn(t,r)}}function IM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function UM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2iv(this.addr,e),sn(t,e)}}function NM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;s.uniform3iv(this.addr,e),sn(t,e)}}function FM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4iv(this.addr,e),sn(t,e)}}function OM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function zM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(rn(t,e))return;s.uniform2uiv(this.addr,e),sn(t,e)}}function kM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(rn(t,e))return;s.uniform3uiv(this.addr,e),sn(t,e)}}function BM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(rn(t,e))return;s.uniform4uiv(this.addr,e),sn(t,e)}}function HM(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a);let l;this.type===s.SAMPLER_2D_SHADOW?(Xm.compareFunction=Rg,l=Xm):l=Wg,t.setTexture2D(e||l,a)}function VM(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture3D(e||jg,a)}function GM(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTextureCube(e||Yg,a)}function WM(s,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(s.uniform1i(this.addr,a),r[0]=a),t.setTexture2DArray(e||Xg,a)}function XM(s){switch(s){case 5126:return AM;case 35664:return RM;case 35665:return CM;case 35666:return bM;case 35674:return PM;case 35675:return LM;case 35676:return DM;case 5124:case 35670:return IM;case 35667:case 35671:return UM;case 35668:case 35672:return NM;case 35669:case 35673:return FM;case 5125:return OM;case 36294:return zM;case 36295:return kM;case 36296:return BM;case 35678:case 36198:case 36298:case 36306:case 35682:return HM;case 35679:case 36299:case 36307:return VM;case 35680:case 36300:case 36308:case 36293:return GM;case 36289:case 36303:case 36311:case 36292:return WM}}function jM(s,e){s.uniform1fv(this.addr,e)}function YM(s,e){const t=uo(e,this.size,2);s.uniform2fv(this.addr,t)}function qM(s,e){const t=uo(e,this.size,3);s.uniform3fv(this.addr,t)}function $M(s,e){const t=uo(e,this.size,4);s.uniform4fv(this.addr,t)}function KM(s,e){const t=uo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function ZM(s,e){const t=uo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function QM(s,e){const t=uo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function JM(s,e){s.uniform1iv(this.addr,e)}function eE(s,e){s.uniform2iv(this.addr,e)}function tE(s,e){s.uniform3iv(this.addr,e)}function nE(s,e){s.uniform4iv(this.addr,e)}function iE(s,e){s.uniform1uiv(this.addr,e)}function rE(s,e){s.uniform2uiv(this.addr,e)}function sE(s,e){s.uniform3uiv(this.addr,e)}function oE(s,e){s.uniform4uiv(this.addr,e)}function aE(s,e,t){const r=this.cache,a=e.length,l=su(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let c=0;c!==a;++c)t.setTexture2D(e[c]||Wg,l[c])}function lE(s,e,t){const r=this.cache,a=e.length,l=su(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let c=0;c!==a;++c)t.setTexture3D(e[c]||jg,l[c])}function uE(s,e,t){const r=this.cache,a=e.length,l=su(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let c=0;c!==a;++c)t.setTextureCube(e[c]||Yg,l[c])}function cE(s,e,t){const r=this.cache,a=e.length,l=su(t,a);rn(r,l)||(s.uniform1iv(this.addr,l),sn(r,l));for(let c=0;c!==a;++c)t.setTexture2DArray(e[c]||Xg,l[c])}function fE(s){switch(s){case 5126:return jM;case 35664:return YM;case 35665:return qM;case 35666:return $M;case 35674:return KM;case 35675:return ZM;case 35676:return QM;case 5124:case 35670:return JM;case 35667:case 35671:return eE;case 35668:case 35672:return tE;case 35669:case 35673:return nE;case 5125:return iE;case 36294:return rE;case 36295:return sE;case 36296:return oE;case 35678:case 36198:case 36298:case 36306:case 35682:return aE;case 35679:case 36299:case 36307:return lE;case 35680:case 36300:case 36308:case 36293:return uE;case 36289:case 36303:case 36311:case 36292:return cE}}class dE{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=XM(t.type)}}class hE{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=fE(t.type)}}class pE{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const a=this.seq;for(let l=0,c=a.length;l!==c;++l){const f=a[l];f.setValue(e,t[f.id],r)}}}const yf=/(\w+)(\])?(\[|\.)?/g;function Zm(s,e){s.seq.push(e),s.map[e.id]=e}function mE(s,e,t){const r=s.name,a=r.length;for(yf.lastIndex=0;;){const l=yf.exec(r),c=yf.lastIndex;let f=l[1];const h=l[2]==="]",p=l[3];if(h&&(f=f|0),p===void 0||p==="["&&c+2===a){Zm(t,p===void 0?new dE(f,s,e):new hE(f,s,e));break}else{let v=t.map[f];v===void 0&&(v=new pE(f),Zm(t,v)),t=v}}}class ql{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const l=e.getActiveUniform(t,a),c=e.getUniformLocation(t,l.name);mE(l,c,this)}}setValue(e,t,r,a){const l=this.map[t];l!==void 0&&l.setValue(e,r,a)}setOptional(e,t,r){const a=t[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,t,r,a){for(let l=0,c=t.length;l!==c;++l){const f=t[l],h=r[f.id];h.needsUpdate!==!1&&f.setValue(e,h.value,a)}}static seqWithValue(e,t){const r=[];for(let a=0,l=e.length;a!==l;++a){const c=e[a];c.id in t&&r.push(c)}return r}}function Qm(s,e,t){const r=s.createShader(e);return s.shaderSource(r,t),s.compileShader(r),r}const gE=37297;let vE=0;function _E(s,e){const t=s.split(`
`),r=[],a=Math.max(e-6,0),l=Math.min(e+6,t.length);for(let c=a;c<l;c++){const f=c+1;r.push(`${f===e?">":" "} ${f}: ${t[c]}`)}return r.join(`
`)}const Jm=new dt;function xE(s){At._getMatrix(Jm,At.workingColorSpace,s);const e=`mat3( ${Jm.elements.map(t=>t.toFixed(4))} )`;switch(At.getTransfer(s)){case $l:return[e,"LinearTransferOETF"];case Dt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function eg(s,e,t){const r=s.getShaderParameter(e,s.COMPILE_STATUS),l=(s.getShaderInfoLog(e)||"").trim();if(r&&l==="")return"";const c=/ERROR: 0:(\d+)/.exec(l);if(c){const f=parseInt(c[1]);return t.toUpperCase()+`

`+l+`

`+_E(s.getShaderSource(e),f)}else return l}function yE(s,e){const t=xE(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function SE(s,e){let t;switch(e){case c_:t="Linear";break;case f_:t="Reinhard";break;case d_:t="Cineon";break;case gg:t="ACESFilmic";break;case p_:t="AgX";break;case m_:t="Neutral";break;case h_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Hl=new j;function ME(){At.getLuminanceCoefficients(Hl);const s=Hl.x.toFixed(4),e=Hl.y.toFixed(4),t=Hl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function EE(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Zo).join(`
`)}function TE(s){const e=[];for(const t in s){const r=s[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function wE(s,e){const t={},r=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const l=s.getActiveAttrib(e,a),c=l.name;let f=1;l.type===s.FLOAT_MAT2&&(f=2),l.type===s.FLOAT_MAT3&&(f=3),l.type===s.FLOAT_MAT4&&(f=4),t[c]={type:l.type,location:s.getAttribLocation(e,c),locationSize:f}}return t}function Zo(s){return s!==""}function tg(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ng(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const AE=/^[ \t]*#include +<([\w\d./]+)>/gm;function cd(s){return s.replace(AE,CE)}const RE=new Map;function CE(s,e){let t=ht[e];if(t===void 0){const r=RE.get(e);if(r!==void 0)t=ht[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return cd(t)}const bE=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ig(s){return s.replace(bE,PE)}function PE(s,e,t,r){let a="";for(let l=parseInt(e);l<parseInt(t);l++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+l+" ]").replace(/UNROLLED_LOOP_INDEX/g,l);return a}function rg(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function LE(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===pg?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Gv?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Yi&&(e="SHADOWMAP_TYPE_VSM"),e}function DE(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case to:case no:e="ENVMAP_TYPE_CUBE";break;case nu:e="ENVMAP_TYPE_CUBE_UV";break}return e}function IE(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case no:e="ENVMAP_MODE_REFRACTION";break}return e}function UE(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case mg:e="ENVMAP_BLENDING_MULTIPLY";break;case l_:e="ENVMAP_BLENDING_MIX";break;case u_:e="ENVMAP_BLENDING_ADD";break}return e}function NE(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:r,maxMip:t}}function FE(s,e,t,r){const a=s.getContext(),l=t.defines;let c=t.vertexShader,f=t.fragmentShader;const h=LE(t),p=DE(t),g=IE(t),v=UE(t),x=NE(t),S=EE(t),M=TE(l),w=a.createProgram();let y,_,I=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Zo).join(`
`),y.length>0&&(y+=`
`),_=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(Zo).join(`
`),_.length>0&&(_+=`
`)):(y=[rg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+g:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Zo).join(`
`),_=[rg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+p:"",t.envMap?"#define "+g:"",t.envMap?"#define "+v:"",x?"#define CUBEUV_TEXEL_WIDTH "+x.texelWidth:"",x?"#define CUBEUV_TEXEL_HEIGHT "+x.texelHeight:"",x?"#define CUBEUV_MAX_MIP "+x.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+h:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==br?"#define TONE_MAPPING":"",t.toneMapping!==br?ht.tonemapping_pars_fragment:"",t.toneMapping!==br?SE("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ht.colorspace_pars_fragment,yE("linearToOutputTexel",t.outputColorSpace),ME(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Zo).join(`
`)),c=cd(c),c=tg(c,t),c=ng(c,t),f=cd(f),f=tg(f,t),f=ng(f,t),c=ig(c),f=ig(f),t.isRawShaderMaterial!==!0&&(I=`#version 300 es
`,y=[S,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,_=["#define varying in",t.glslVersion===dm?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===dm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const L=I+y+c,b=I+_+f,z=Qm(a,a.VERTEX_SHADER,L),F=Qm(a,a.FRAGMENT_SHADER,b);a.attachShader(w,z),a.attachShader(w,F),t.index0AttributeName!==void 0?a.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(w,0,"position"),a.linkProgram(w);function O(B){if(s.debug.checkShaderErrors){const $=a.getProgramInfoLog(w)||"",te=a.getShaderInfoLog(z)||"",ue=a.getShaderInfoLog(F)||"",ae=$.trim(),oe=te.trim(),he=ue.trim();let H=!0,ce=!0;if(a.getProgramParameter(w,a.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(a,w,z,F);else{const se=eg(a,z,"vertex"),U=eg(a,F,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(w,a.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+ae+`
`+se+`
`+U)}else ae!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ae):(oe===""||he==="")&&(ce=!1);ce&&(B.diagnostics={runnable:H,programLog:ae,vertexShader:{log:oe,prefix:y},fragmentShader:{log:he,prefix:_}})}a.deleteShader(z),a.deleteShader(F),X=new ql(a,w),C=wE(a,w)}let X;this.getUniforms=function(){return X===void 0&&O(this),X};let C;this.getAttributes=function(){return C===void 0&&O(this),C};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=a.getProgramParameter(w,gE)),R},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=vE++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=z,this.fragmentShader=F,this}let OE=0;class zE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(t),l=this._getShaderStage(r),c=this._getShaderCacheForMaterial(e);return c.has(a)===!1&&(c.add(a),a.usedTimes++),c.has(l)===!1&&(c.add(l),l.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new kE(e),t.set(e,r)),r}}class kE{constructor(e){this.id=OE++,this.code=e,this.usedTimes=0}}function BE(s,e,t,r,a,l,c){const f=new Lg,h=new zE,p=new Set,g=[],v=a.logarithmicDepthBuffer,x=a.vertexTextures;let S=a.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(C){return p.add(C),C===0?"uv":`uv${C}`}function y(C,R,B,$,te){const ue=$.fog,ae=te.geometry,oe=C.isMeshStandardMaterial?$.environment:null,he=(C.isMeshStandardMaterial?t:e).get(C.envMap||oe),H=he&&he.mapping===nu?he.image.height:null,ce=M[C.type];C.precision!==null&&(S=a.getMaxPrecision(C.precision),S!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",S,"instead."));const se=ae.morphAttributes.position||ae.morphAttributes.normal||ae.morphAttributes.color,U=se!==void 0?se.length:0;let re=0;ae.morphAttributes.position!==void 0&&(re=1),ae.morphAttributes.normal!==void 0&&(re=2),ae.morphAttributes.color!==void 0&&(re=3);let Fe,Xe,He,ee;if(ce){const Mt=Ti[ce];Fe=Mt.vertexShader,Xe=Mt.fragmentShader}else Fe=C.vertexShader,Xe=C.fragmentShader,h.update(C),He=h.getVertexShaderID(C),ee=h.getFragmentShaderID(C);const fe=s.getRenderTarget(),Me=s.state.buffers.depth.getReversed(),Le=te.isInstancedMesh===!0,Ne=te.isBatchedMesh===!0,pt=!!C.map,Qt=!!C.matcap,N=!!he,Pt=!!C.aoMap,ct=!!C.lightMap,it=!!C.bumpMap,Ve=!!C.normalMap,Ut=!!C.displacementMap,Ge=!!C.emissiveMap,lt=!!C.metalnessMap,zt=!!C.roughnessMap,kt=C.anisotropy>0,P=C.clearcoat>0,T=C.dispersion>0,Z=C.iridescence>0,de=C.sheen>0,ge=C.transmission>0,le=kt&&!!C.anisotropyMap,$e=P&&!!C.clearcoatMap,we=P&&!!C.clearcoatNormalMap,ze=P&&!!C.clearcoatRoughnessMap,Ke=Z&&!!C.iridescenceMap,Ee=Z&&!!C.iridescenceThicknessMap,Pe=de&&!!C.sheenColorMap,rt=de&&!!C.sheenRoughnessMap,Ye=!!C.specularMap,Re=!!C.specularColorMap,ft=!!C.specularIntensityMap,V=ge&&!!C.transmissionMap,ye=ge&&!!C.thicknessMap,Ae=!!C.gradientMap,De=!!C.alphaMap,xe=C.alphaTest>0,pe=!!C.alphaHash,We=!!C.extensions;let ut=br;C.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(ut=s.toneMapping);const Ct={shaderID:ce,shaderType:C.type,shaderName:C.name,vertexShader:Fe,fragmentShader:Xe,defines:C.defines,customVertexShaderID:He,customFragmentShaderID:ee,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:S,batching:Ne,batchingColor:Ne&&te._colorsTexture!==null,instancing:Le,instancingColor:Le&&te.instanceColor!==null,instancingMorph:Le&&te.morphTexture!==null,supportsVertexTextures:x,outputColorSpace:fe===null?s.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:io,alphaToCoverage:!!C.alphaToCoverage,map:pt,matcap:Qt,envMap:N,envMapMode:N&&he.mapping,envMapCubeUVHeight:H,aoMap:Pt,lightMap:ct,bumpMap:it,normalMap:Ve,displacementMap:x&&Ut,emissiveMap:Ge,normalMapObjectSpace:Ve&&C.normalMapType===x_,normalMapTangentSpace:Ve&&C.normalMapType===Ag,metalnessMap:lt,roughnessMap:zt,anisotropy:kt,anisotropyMap:le,clearcoat:P,clearcoatMap:$e,clearcoatNormalMap:we,clearcoatRoughnessMap:ze,dispersion:T,iridescence:Z,iridescenceMap:Ke,iridescenceThicknessMap:Ee,sheen:de,sheenColorMap:Pe,sheenRoughnessMap:rt,specularMap:Ye,specularColorMap:Re,specularIntensityMap:ft,transmission:ge,transmissionMap:V,thicknessMap:ye,gradientMap:Ae,opaque:C.transparent===!1&&C.blending===Qs&&C.alphaToCoverage===!1,alphaMap:De,alphaTest:xe,alphaHash:pe,combine:C.combine,mapUv:pt&&w(C.map.channel),aoMapUv:Pt&&w(C.aoMap.channel),lightMapUv:ct&&w(C.lightMap.channel),bumpMapUv:it&&w(C.bumpMap.channel),normalMapUv:Ve&&w(C.normalMap.channel),displacementMapUv:Ut&&w(C.displacementMap.channel),emissiveMapUv:Ge&&w(C.emissiveMap.channel),metalnessMapUv:lt&&w(C.metalnessMap.channel),roughnessMapUv:zt&&w(C.roughnessMap.channel),anisotropyMapUv:le&&w(C.anisotropyMap.channel),clearcoatMapUv:$e&&w(C.clearcoatMap.channel),clearcoatNormalMapUv:we&&w(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ze&&w(C.clearcoatRoughnessMap.channel),iridescenceMapUv:Ke&&w(C.iridescenceMap.channel),iridescenceThicknessMapUv:Ee&&w(C.iridescenceThicknessMap.channel),sheenColorMapUv:Pe&&w(C.sheenColorMap.channel),sheenRoughnessMapUv:rt&&w(C.sheenRoughnessMap.channel),specularMapUv:Ye&&w(C.specularMap.channel),specularColorMapUv:Re&&w(C.specularColorMap.channel),specularIntensityMapUv:ft&&w(C.specularIntensityMap.channel),transmissionMapUv:V&&w(C.transmissionMap.channel),thicknessMapUv:ye&&w(C.thicknessMap.channel),alphaMapUv:De&&w(C.alphaMap.channel),vertexTangents:!!ae.attributes.tangent&&(Ve||kt),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!ae.attributes.color&&ae.attributes.color.itemSize===4,pointsUvs:te.isPoints===!0&&!!ae.attributes.uv&&(pt||De),fog:!!ue,useFog:C.fog===!0,fogExp2:!!ue&&ue.isFogExp2,flatShading:C.flatShading===!0&&C.wireframe===!1,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:v,reversedDepthBuffer:Me,skinning:te.isSkinnedMesh===!0,morphTargets:ae.morphAttributes.position!==void 0,morphNormals:ae.morphAttributes.normal!==void 0,morphColors:ae.morphAttributes.color!==void 0,morphTargetsCount:U,morphTextureStride:re,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:C.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:ut,decodeVideoTexture:pt&&C.map.isVideoTexture===!0&&At.getTransfer(C.map.colorSpace)===Dt,decodeVideoTextureEmissive:Ge&&C.emissiveMap.isVideoTexture===!0&&At.getTransfer(C.emissiveMap.colorSpace)===Dt,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===$i,flipSided:C.side===Bn,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionClipCullDistance:We&&C.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(We&&C.extensions.multiDraw===!0||Ne)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()};return Ct.vertexUv1s=p.has(1),Ct.vertexUv2s=p.has(2),Ct.vertexUv3s=p.has(3),p.clear(),Ct}function _(C){const R=[];if(C.shaderID?R.push(C.shaderID):(R.push(C.customVertexShaderID),R.push(C.customFragmentShaderID)),C.defines!==void 0)for(const B in C.defines)R.push(B),R.push(C.defines[B]);return C.isRawShaderMaterial===!1&&(I(R,C),L(R,C),R.push(s.outputColorSpace)),R.push(C.customProgramCacheKey),R.join()}function I(C,R){C.push(R.precision),C.push(R.outputColorSpace),C.push(R.envMapMode),C.push(R.envMapCubeUVHeight),C.push(R.mapUv),C.push(R.alphaMapUv),C.push(R.lightMapUv),C.push(R.aoMapUv),C.push(R.bumpMapUv),C.push(R.normalMapUv),C.push(R.displacementMapUv),C.push(R.emissiveMapUv),C.push(R.metalnessMapUv),C.push(R.roughnessMapUv),C.push(R.anisotropyMapUv),C.push(R.clearcoatMapUv),C.push(R.clearcoatNormalMapUv),C.push(R.clearcoatRoughnessMapUv),C.push(R.iridescenceMapUv),C.push(R.iridescenceThicknessMapUv),C.push(R.sheenColorMapUv),C.push(R.sheenRoughnessMapUv),C.push(R.specularMapUv),C.push(R.specularColorMapUv),C.push(R.specularIntensityMapUv),C.push(R.transmissionMapUv),C.push(R.thicknessMapUv),C.push(R.combine),C.push(R.fogExp2),C.push(R.sizeAttenuation),C.push(R.morphTargetsCount),C.push(R.morphAttributeCount),C.push(R.numDirLights),C.push(R.numPointLights),C.push(R.numSpotLights),C.push(R.numSpotLightMaps),C.push(R.numHemiLights),C.push(R.numRectAreaLights),C.push(R.numDirLightShadows),C.push(R.numPointLightShadows),C.push(R.numSpotLightShadows),C.push(R.numSpotLightShadowsWithMaps),C.push(R.numLightProbes),C.push(R.shadowMapType),C.push(R.toneMapping),C.push(R.numClippingPlanes),C.push(R.numClipIntersection),C.push(R.depthPacking)}function L(C,R){f.disableAll(),R.supportsVertexTextures&&f.enable(0),R.instancing&&f.enable(1),R.instancingColor&&f.enable(2),R.instancingMorph&&f.enable(3),R.matcap&&f.enable(4),R.envMap&&f.enable(5),R.normalMapObjectSpace&&f.enable(6),R.normalMapTangentSpace&&f.enable(7),R.clearcoat&&f.enable(8),R.iridescence&&f.enable(9),R.alphaTest&&f.enable(10),R.vertexColors&&f.enable(11),R.vertexAlphas&&f.enable(12),R.vertexUv1s&&f.enable(13),R.vertexUv2s&&f.enable(14),R.vertexUv3s&&f.enable(15),R.vertexTangents&&f.enable(16),R.anisotropy&&f.enable(17),R.alphaHash&&f.enable(18),R.batching&&f.enable(19),R.dispersion&&f.enable(20),R.batchingColor&&f.enable(21),R.gradientMap&&f.enable(22),C.push(f.mask),f.disableAll(),R.fog&&f.enable(0),R.useFog&&f.enable(1),R.flatShading&&f.enable(2),R.logarithmicDepthBuffer&&f.enable(3),R.reversedDepthBuffer&&f.enable(4),R.skinning&&f.enable(5),R.morphTargets&&f.enable(6),R.morphNormals&&f.enable(7),R.morphColors&&f.enable(8),R.premultipliedAlpha&&f.enable(9),R.shadowMapEnabled&&f.enable(10),R.doubleSided&&f.enable(11),R.flipSided&&f.enable(12),R.useDepthPacking&&f.enable(13),R.dithering&&f.enable(14),R.transmission&&f.enable(15),R.sheen&&f.enable(16),R.opaque&&f.enable(17),R.pointsUvs&&f.enable(18),R.decodeVideoTexture&&f.enable(19),R.decodeVideoTextureEmissive&&f.enable(20),R.alphaToCoverage&&f.enable(21),C.push(f.mask)}function b(C){const R=M[C.type];let B;if(R){const $=Ti[R];B=ux.clone($.uniforms)}else B=C.uniforms;return B}function z(C,R){let B;for(let $=0,te=g.length;$<te;$++){const ue=g[$];if(ue.cacheKey===R){B=ue,++B.usedTimes;break}}return B===void 0&&(B=new FE(s,R,C,l),g.push(B)),B}function F(C){if(--C.usedTimes===0){const R=g.indexOf(C);g[R]=g[g.length-1],g.pop(),C.destroy()}}function O(C){h.remove(C)}function X(){h.dispose()}return{getParameters:y,getProgramCacheKey:_,getUniforms:b,acquireProgram:z,releaseProgram:F,releaseShaderCache:O,programs:g,dispose:X}}function HE(){let s=new WeakMap;function e(c){return s.has(c)}function t(c){let f=s.get(c);return f===void 0&&(f={},s.set(c,f)),f}function r(c){s.delete(c)}function a(c,f,h){s.get(c)[f]=h}function l(){s=new WeakMap}return{has:e,get:t,remove:r,update:a,dispose:l}}function VE(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function sg(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function og(){const s=[];let e=0;const t=[],r=[],a=[];function l(){e=0,t.length=0,r.length=0,a.length=0}function c(v,x,S,M,w,y){let _=s[e];return _===void 0?(_={id:v.id,object:v,geometry:x,material:S,groupOrder:M,renderOrder:v.renderOrder,z:w,group:y},s[e]=_):(_.id=v.id,_.object=v,_.geometry=x,_.material=S,_.groupOrder=M,_.renderOrder=v.renderOrder,_.z=w,_.group=y),e++,_}function f(v,x,S,M,w,y){const _=c(v,x,S,M,w,y);S.transmission>0?r.push(_):S.transparent===!0?a.push(_):t.push(_)}function h(v,x,S,M,w,y){const _=c(v,x,S,M,w,y);S.transmission>0?r.unshift(_):S.transparent===!0?a.unshift(_):t.unshift(_)}function p(v,x){t.length>1&&t.sort(v||VE),r.length>1&&r.sort(x||sg),a.length>1&&a.sort(x||sg)}function g(){for(let v=e,x=s.length;v<x;v++){const S=s[v];if(S.id===null)break;S.id=null,S.object=null,S.geometry=null,S.material=null,S.group=null}}return{opaque:t,transmissive:r,transparent:a,init:l,push:f,unshift:h,finish:g,sort:p}}function GE(){let s=new WeakMap;function e(r,a){const l=s.get(r);let c;return l===void 0?(c=new og,s.set(r,[c])):a>=l.length?(c=new og,l.push(c)):c=l[a],c}function t(){s=new WeakMap}return{get:e,dispose:t}}function WE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new j,color:new yt};break;case"SpotLight":t={position:new j,direction:new j,color:new yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new j,color:new yt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new j,skyColor:new yt,groundColor:new yt};break;case"RectAreaLight":t={color:new yt,position:new j,halfWidth:new j,halfHeight:new j};break}return s[e.id]=t,t}}}function XE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new St,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let jE=0;function YE(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function qE(s){const e=new WE,t=XE(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let p=0;p<9;p++)r.probe.push(new j);const a=new j,l=new Xt,c=new Xt;function f(p){let g=0,v=0,x=0;for(let C=0;C<9;C++)r.probe[C].set(0,0,0);let S=0,M=0,w=0,y=0,_=0,I=0,L=0,b=0,z=0,F=0,O=0;p.sort(YE);for(let C=0,R=p.length;C<R;C++){const B=p[C],$=B.color,te=B.intensity,ue=B.distance,ae=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)g+=$.r*te,v+=$.g*te,x+=$.b*te;else if(B.isLightProbe){for(let oe=0;oe<9;oe++)r.probe[oe].addScaledVector(B.sh.coefficients[oe],te);O++}else if(B.isDirectionalLight){const oe=e.get(B);if(oe.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const he=B.shadow,H=t.get(B);H.shadowIntensity=he.intensity,H.shadowBias=he.bias,H.shadowNormalBias=he.normalBias,H.shadowRadius=he.radius,H.shadowMapSize=he.mapSize,r.directionalShadow[S]=H,r.directionalShadowMap[S]=ae,r.directionalShadowMatrix[S]=B.shadow.matrix,I++}r.directional[S]=oe,S++}else if(B.isSpotLight){const oe=e.get(B);oe.position.setFromMatrixPosition(B.matrixWorld),oe.color.copy($).multiplyScalar(te),oe.distance=ue,oe.coneCos=Math.cos(B.angle),oe.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),oe.decay=B.decay,r.spot[w]=oe;const he=B.shadow;if(B.map&&(r.spotLightMap[z]=B.map,z++,he.updateMatrices(B),B.castShadow&&F++),r.spotLightMatrix[w]=he.matrix,B.castShadow){const H=t.get(B);H.shadowIntensity=he.intensity,H.shadowBias=he.bias,H.shadowNormalBias=he.normalBias,H.shadowRadius=he.radius,H.shadowMapSize=he.mapSize,r.spotShadow[w]=H,r.spotShadowMap[w]=ae,b++}w++}else if(B.isRectAreaLight){const oe=e.get(B);oe.color.copy($).multiplyScalar(te),oe.halfWidth.set(B.width*.5,0,0),oe.halfHeight.set(0,B.height*.5,0),r.rectArea[y]=oe,y++}else if(B.isPointLight){const oe=e.get(B);if(oe.color.copy(B.color).multiplyScalar(B.intensity),oe.distance=B.distance,oe.decay=B.decay,B.castShadow){const he=B.shadow,H=t.get(B);H.shadowIntensity=he.intensity,H.shadowBias=he.bias,H.shadowNormalBias=he.normalBias,H.shadowRadius=he.radius,H.shadowMapSize=he.mapSize,H.shadowCameraNear=he.camera.near,H.shadowCameraFar=he.camera.far,r.pointShadow[M]=H,r.pointShadowMap[M]=ae,r.pointShadowMatrix[M]=B.shadow.matrix,L++}r.point[M]=oe,M++}else if(B.isHemisphereLight){const oe=e.get(B);oe.skyColor.copy(B.color).multiplyScalar(te),oe.groundColor.copy(B.groundColor).multiplyScalar(te),r.hemi[_]=oe,_++}}y>0&&(s.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=be.LTC_FLOAT_1,r.rectAreaLTC2=be.LTC_FLOAT_2):(r.rectAreaLTC1=be.LTC_HALF_1,r.rectAreaLTC2=be.LTC_HALF_2)),r.ambient[0]=g,r.ambient[1]=v,r.ambient[2]=x;const X=r.hash;(X.directionalLength!==S||X.pointLength!==M||X.spotLength!==w||X.rectAreaLength!==y||X.hemiLength!==_||X.numDirectionalShadows!==I||X.numPointShadows!==L||X.numSpotShadows!==b||X.numSpotMaps!==z||X.numLightProbes!==O)&&(r.directional.length=S,r.spot.length=w,r.rectArea.length=y,r.point.length=M,r.hemi.length=_,r.directionalShadow.length=I,r.directionalShadowMap.length=I,r.pointShadow.length=L,r.pointShadowMap.length=L,r.spotShadow.length=b,r.spotShadowMap.length=b,r.directionalShadowMatrix.length=I,r.pointShadowMatrix.length=L,r.spotLightMatrix.length=b+z-F,r.spotLightMap.length=z,r.numSpotLightShadowsWithMaps=F,r.numLightProbes=O,X.directionalLength=S,X.pointLength=M,X.spotLength=w,X.rectAreaLength=y,X.hemiLength=_,X.numDirectionalShadows=I,X.numPointShadows=L,X.numSpotShadows=b,X.numSpotMaps=z,X.numLightProbes=O,r.version=jE++)}function h(p,g){let v=0,x=0,S=0,M=0,w=0;const y=g.matrixWorldInverse;for(let _=0,I=p.length;_<I;_++){const L=p[_];if(L.isDirectionalLight){const b=r.directional[v];b.direction.setFromMatrixPosition(L.matrixWorld),a.setFromMatrixPosition(L.target.matrixWorld),b.direction.sub(a),b.direction.transformDirection(y),v++}else if(L.isSpotLight){const b=r.spot[S];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(y),b.direction.setFromMatrixPosition(L.matrixWorld),a.setFromMatrixPosition(L.target.matrixWorld),b.direction.sub(a),b.direction.transformDirection(y),S++}else if(L.isRectAreaLight){const b=r.rectArea[M];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(y),c.identity(),l.copy(L.matrixWorld),l.premultiply(y),c.extractRotation(l),b.halfWidth.set(L.width*.5,0,0),b.halfHeight.set(0,L.height*.5,0),b.halfWidth.applyMatrix4(c),b.halfHeight.applyMatrix4(c),M++}else if(L.isPointLight){const b=r.point[x];b.position.setFromMatrixPosition(L.matrixWorld),b.position.applyMatrix4(y),x++}else if(L.isHemisphereLight){const b=r.hemi[w];b.direction.setFromMatrixPosition(L.matrixWorld),b.direction.transformDirection(y),w++}}}return{setup:f,setupView:h,state:r}}function ag(s){const e=new qE(s),t=[],r=[];function a(g){p.camera=g,t.length=0,r.length=0}function l(g){t.push(g)}function c(g){r.push(g)}function f(){e.setup(t)}function h(g){e.setupView(t,g)}const p={lightsArray:t,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:p,setupLights:f,setupLightsView:h,pushLight:l,pushShadow:c}}function $E(s){let e=new WeakMap;function t(a,l=0){const c=e.get(a);let f;return c===void 0?(f=new ag(s),e.set(a,[f])):l>=c.length?(f=new ag(s),c.push(f)):f=c[l],f}function r(){e=new WeakMap}return{get:t,dispose:r}}const KE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ZE=`uniform sampler2D shadow_pass;
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
}`;function QE(s,e,t){let r=new Td;const a=new St,l=new St,c=new It,f=new yx({depthPacking:__}),h=new Sx,p={},g=t.maxTextureSize,v={[Pr]:Bn,[Bn]:Pr,[$i]:$i},x=new Lr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new St},radius:{value:4}},vertexShader:KE,fragmentShader:ZE}),S=x.clone();S.defines.HORIZONTAL_PASS=1;const M=new Zn;M.setAttribute("position",new xi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new $t(M,x),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=pg;let _=this.type;this.render=function(F,O,X){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||F.length===0)return;const C=s.getRenderTarget(),R=s.getActiveCubeFace(),B=s.getActiveMipmapLevel(),$=s.state;$.setBlending(Cr),$.buffers.depth.getReversed()===!0?$.buffers.color.setClear(0,0,0,0):$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);const te=_!==Yi&&this.type===Yi,ue=_===Yi&&this.type!==Yi;for(let ae=0,oe=F.length;ae<oe;ae++){const he=F[ae],H=he.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",he,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;a.copy(H.mapSize);const ce=H.getFrameExtents();if(a.multiply(ce),l.copy(H.mapSize),(a.x>g||a.y>g)&&(a.x>g&&(l.x=Math.floor(g/ce.x),a.x=l.x*ce.x,H.mapSize.x=l.x),a.y>g&&(l.y=Math.floor(g/ce.y),a.y=l.y*ce.y,H.mapSize.y=l.y)),H.map===null||te===!0||ue===!0){const U=this.type!==Yi?{minFilter:_i,magFilter:_i}:{};H.map!==null&&H.map.dispose(),H.map=new cs(a.x,a.y,U),H.map.texture.name=he.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();const se=H.getViewportCount();for(let U=0;U<se;U++){const re=H.getViewport(U);c.set(l.x*re.x,l.y*re.y,l.x*re.z,l.y*re.w),$.viewport(c),H.updateMatrices(he,U),r=H.getFrustum(),b(O,X,H.camera,he,this.type)}H.isPointLightShadow!==!0&&this.type===Yi&&I(H,X),H.needsUpdate=!1}_=this.type,y.needsUpdate=!1,s.setRenderTarget(C,R,B)};function I(F,O){const X=e.update(w);x.defines.VSM_SAMPLES!==F.blurSamples&&(x.defines.VSM_SAMPLES=F.blurSamples,S.defines.VSM_SAMPLES=F.blurSamples,x.needsUpdate=!0,S.needsUpdate=!0),F.mapPass===null&&(F.mapPass=new cs(a.x,a.y)),x.uniforms.shadow_pass.value=F.map.texture,x.uniforms.resolution.value=F.mapSize,x.uniforms.radius.value=F.radius,s.setRenderTarget(F.mapPass),s.clear(),s.renderBufferDirect(O,null,X,x,w,null),S.uniforms.shadow_pass.value=F.mapPass.texture,S.uniforms.resolution.value=F.mapSize,S.uniforms.radius.value=F.radius,s.setRenderTarget(F.map),s.clear(),s.renderBufferDirect(O,null,X,S,w,null)}function L(F,O,X,C){let R=null;const B=X.isPointLight===!0?F.customDistanceMaterial:F.customDepthMaterial;if(B!==void 0)R=B;else if(R=X.isPointLight===!0?h:f,s.localClippingEnabled&&O.clipShadows===!0&&Array.isArray(O.clippingPlanes)&&O.clippingPlanes.length!==0||O.displacementMap&&O.displacementScale!==0||O.alphaMap&&O.alphaTest>0||O.map&&O.alphaTest>0||O.alphaToCoverage===!0){const $=R.uuid,te=O.uuid;let ue=p[$];ue===void 0&&(ue={},p[$]=ue);let ae=ue[te];ae===void 0&&(ae=R.clone(),ue[te]=ae,O.addEventListener("dispose",z)),R=ae}if(R.visible=O.visible,R.wireframe=O.wireframe,C===Yi?R.side=O.shadowSide!==null?O.shadowSide:O.side:R.side=O.shadowSide!==null?O.shadowSide:v[O.side],R.alphaMap=O.alphaMap,R.alphaTest=O.alphaToCoverage===!0?.5:O.alphaTest,R.map=O.map,R.clipShadows=O.clipShadows,R.clippingPlanes=O.clippingPlanes,R.clipIntersection=O.clipIntersection,R.displacementMap=O.displacementMap,R.displacementScale=O.displacementScale,R.displacementBias=O.displacementBias,R.wireframeLinewidth=O.wireframeLinewidth,R.linewidth=O.linewidth,X.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const $=s.properties.get(R);$.light=X}return R}function b(F,O,X,C,R){if(F.visible===!1)return;if(F.layers.test(O.layers)&&(F.isMesh||F.isLine||F.isPoints)&&(F.castShadow||F.receiveShadow&&R===Yi)&&(!F.frustumCulled||r.intersectsObject(F))){F.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,F.matrixWorld);const te=e.update(F),ue=F.material;if(Array.isArray(ue)){const ae=te.groups;for(let oe=0,he=ae.length;oe<he;oe++){const H=ae[oe],ce=ue[H.materialIndex];if(ce&&ce.visible){const se=L(F,ce,C,R);F.onBeforeShadow(s,F,O,X,te,se,H),s.renderBufferDirect(X,null,te,se,F,H),F.onAfterShadow(s,F,O,X,te,se,H)}}}else if(ue.visible){const ae=L(F,ue,C,R);F.onBeforeShadow(s,F,O,X,te,ae,null),s.renderBufferDirect(X,null,te,ae,F,null),F.onAfterShadow(s,F,O,X,te,ae,null)}}const $=F.children;for(let te=0,ue=$.length;te<ue;te++)b($[te],O,X,C,R)}function z(F){F.target.removeEventListener("dispose",z);for(const X in p){const C=p[X],R=F.target.uuid;R in C&&(C[R].dispose(),delete C[R])}}}const JE={[wf]:Af,[Rf]:Pf,[Cf]:Lf,[eo]:bf,[Af]:wf,[Pf]:Rf,[Lf]:Cf,[bf]:eo};function e1(s,e){function t(){let V=!1;const ye=new It;let Ae=null;const De=new It(0,0,0,0);return{setMask:function(xe){Ae!==xe&&!V&&(s.colorMask(xe,xe,xe,xe),Ae=xe)},setLocked:function(xe){V=xe},setClear:function(xe,pe,We,ut,Ct){Ct===!0&&(xe*=ut,pe*=ut,We*=ut),ye.set(xe,pe,We,ut),De.equals(ye)===!1&&(s.clearColor(xe,pe,We,ut),De.copy(ye))},reset:function(){V=!1,Ae=null,De.set(-1,0,0,0)}}}function r(){let V=!1,ye=!1,Ae=null,De=null,xe=null;return{setReversed:function(pe){if(ye!==pe){const We=e.get("EXT_clip_control");pe?We.clipControlEXT(We.LOWER_LEFT_EXT,We.ZERO_TO_ONE_EXT):We.clipControlEXT(We.LOWER_LEFT_EXT,We.NEGATIVE_ONE_TO_ONE_EXT),ye=pe;const ut=xe;xe=null,this.setClear(ut)}},getReversed:function(){return ye},setTest:function(pe){pe?fe(s.DEPTH_TEST):Me(s.DEPTH_TEST)},setMask:function(pe){Ae!==pe&&!V&&(s.depthMask(pe),Ae=pe)},setFunc:function(pe){if(ye&&(pe=JE[pe]),De!==pe){switch(pe){case wf:s.depthFunc(s.NEVER);break;case Af:s.depthFunc(s.ALWAYS);break;case Rf:s.depthFunc(s.LESS);break;case eo:s.depthFunc(s.LEQUAL);break;case Cf:s.depthFunc(s.EQUAL);break;case bf:s.depthFunc(s.GEQUAL);break;case Pf:s.depthFunc(s.GREATER);break;case Lf:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}De=pe}},setLocked:function(pe){V=pe},setClear:function(pe){xe!==pe&&(ye&&(pe=1-pe),s.clearDepth(pe),xe=pe)},reset:function(){V=!1,Ae=null,De=null,xe=null,ye=!1}}}function a(){let V=!1,ye=null,Ae=null,De=null,xe=null,pe=null,We=null,ut=null,Ct=null;return{setTest:function(Mt){V||(Mt?fe(s.STENCIL_TEST):Me(s.STENCIL_TEST))},setMask:function(Mt){ye!==Mt&&!V&&(s.stencilMask(Mt),ye=Mt)},setFunc:function(Mt,Qn,pn){(Ae!==Mt||De!==Qn||xe!==pn)&&(s.stencilFunc(Mt,Qn,pn),Ae=Mt,De=Qn,xe=pn)},setOp:function(Mt,Qn,pn){(pe!==Mt||We!==Qn||ut!==pn)&&(s.stencilOp(Mt,Qn,pn),pe=Mt,We=Qn,ut=pn)},setLocked:function(Mt){V=Mt},setClear:function(Mt){Ct!==Mt&&(s.clearStencil(Mt),Ct=Mt)},reset:function(){V=!1,ye=null,Ae=null,De=null,xe=null,pe=null,We=null,ut=null,Ct=null}}}const l=new t,c=new r,f=new a,h=new WeakMap,p=new WeakMap;let g={},v={},x=new WeakMap,S=[],M=null,w=!1,y=null,_=null,I=null,L=null,b=null,z=null,F=null,O=new yt(0,0,0),X=0,C=!1,R=null,B=null,$=null,te=null,ue=null;const ae=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let oe=!1,he=0;const H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(he=parseFloat(/^WebGL (\d)/.exec(H)[1]),oe=he>=1):H.indexOf("OpenGL ES")!==-1&&(he=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),oe=he>=2);let ce=null,se={};const U=s.getParameter(s.SCISSOR_BOX),re=s.getParameter(s.VIEWPORT),Fe=new It().fromArray(U),Xe=new It().fromArray(re);function He(V,ye,Ae,De){const xe=new Uint8Array(4),pe=s.createTexture();s.bindTexture(V,pe),s.texParameteri(V,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(V,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let We=0;We<Ae;We++)V===s.TEXTURE_3D||V===s.TEXTURE_2D_ARRAY?s.texImage3D(ye,0,s.RGBA,1,1,De,0,s.RGBA,s.UNSIGNED_BYTE,xe):s.texImage2D(ye+We,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,xe);return pe}const ee={};ee[s.TEXTURE_2D]=He(s.TEXTURE_2D,s.TEXTURE_2D,1),ee[s.TEXTURE_CUBE_MAP]=He(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[s.TEXTURE_2D_ARRAY]=He(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ee[s.TEXTURE_3D]=He(s.TEXTURE_3D,s.TEXTURE_3D,1,1),l.setClear(0,0,0,1),c.setClear(1),f.setClear(0),fe(s.DEPTH_TEST),c.setFunc(eo),it(!1),Ve(om),fe(s.CULL_FACE),Pt(Cr);function fe(V){g[V]!==!0&&(s.enable(V),g[V]=!0)}function Me(V){g[V]!==!1&&(s.disable(V),g[V]=!1)}function Le(V,ye){return v[V]!==ye?(s.bindFramebuffer(V,ye),v[V]=ye,V===s.DRAW_FRAMEBUFFER&&(v[s.FRAMEBUFFER]=ye),V===s.FRAMEBUFFER&&(v[s.DRAW_FRAMEBUFFER]=ye),!0):!1}function Ne(V,ye){let Ae=S,De=!1;if(V){Ae=x.get(ye),Ae===void 0&&(Ae=[],x.set(ye,Ae));const xe=V.textures;if(Ae.length!==xe.length||Ae[0]!==s.COLOR_ATTACHMENT0){for(let pe=0,We=xe.length;pe<We;pe++)Ae[pe]=s.COLOR_ATTACHMENT0+pe;Ae.length=xe.length,De=!0}}else Ae[0]!==s.BACK&&(Ae[0]=s.BACK,De=!0);De&&s.drawBuffers(Ae)}function pt(V){return M!==V?(s.useProgram(V),M=V,!0):!1}const Qt={[ns]:s.FUNC_ADD,[Xv]:s.FUNC_SUBTRACT,[jv]:s.FUNC_REVERSE_SUBTRACT};Qt[Yv]=s.MIN,Qt[qv]=s.MAX;const N={[$v]:s.ZERO,[Kv]:s.ONE,[Zv]:s.SRC_COLOR,[Ef]:s.SRC_ALPHA,[i_]:s.SRC_ALPHA_SATURATE,[t_]:s.DST_COLOR,[Jv]:s.DST_ALPHA,[Qv]:s.ONE_MINUS_SRC_COLOR,[Tf]:s.ONE_MINUS_SRC_ALPHA,[n_]:s.ONE_MINUS_DST_COLOR,[e_]:s.ONE_MINUS_DST_ALPHA,[r_]:s.CONSTANT_COLOR,[s_]:s.ONE_MINUS_CONSTANT_COLOR,[o_]:s.CONSTANT_ALPHA,[a_]:s.ONE_MINUS_CONSTANT_ALPHA};function Pt(V,ye,Ae,De,xe,pe,We,ut,Ct,Mt){if(V===Cr){w===!0&&(Me(s.BLEND),w=!1);return}if(w===!1&&(fe(s.BLEND),w=!0),V!==Wv){if(V!==y||Mt!==C){if((_!==ns||b!==ns)&&(s.blendEquation(s.FUNC_ADD),_=ns,b=ns),Mt)switch(V){case Qs:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case am:s.blendFunc(s.ONE,s.ONE);break;case lm:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case um:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case Qs:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case am:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case lm:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case um:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}I=null,L=null,z=null,F=null,O.set(0,0,0),X=0,y=V,C=Mt}return}xe=xe||ye,pe=pe||Ae,We=We||De,(ye!==_||xe!==b)&&(s.blendEquationSeparate(Qt[ye],Qt[xe]),_=ye,b=xe),(Ae!==I||De!==L||pe!==z||We!==F)&&(s.blendFuncSeparate(N[Ae],N[De],N[pe],N[We]),I=Ae,L=De,z=pe,F=We),(ut.equals(O)===!1||Ct!==X)&&(s.blendColor(ut.r,ut.g,ut.b,Ct),O.copy(ut),X=Ct),y=V,C=!1}function ct(V,ye){V.side===$i?Me(s.CULL_FACE):fe(s.CULL_FACE);let Ae=V.side===Bn;ye&&(Ae=!Ae),it(Ae),V.blending===Qs&&V.transparent===!1?Pt(Cr):Pt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),c.setFunc(V.depthFunc),c.setTest(V.depthTest),c.setMask(V.depthWrite),l.setMask(V.colorWrite);const De=V.stencilWrite;f.setTest(De),De&&(f.setMask(V.stencilWriteMask),f.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),f.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),Ge(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?fe(s.SAMPLE_ALPHA_TO_COVERAGE):Me(s.SAMPLE_ALPHA_TO_COVERAGE)}function it(V){R!==V&&(V?s.frontFace(s.CW):s.frontFace(s.CCW),R=V)}function Ve(V){V!==Hv?(fe(s.CULL_FACE),V!==B&&(V===om?s.cullFace(s.BACK):V===Vv?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Me(s.CULL_FACE),B=V}function Ut(V){V!==$&&(oe&&s.lineWidth(V),$=V)}function Ge(V,ye,Ae){V?(fe(s.POLYGON_OFFSET_FILL),(te!==ye||ue!==Ae)&&(s.polygonOffset(ye,Ae),te=ye,ue=Ae)):Me(s.POLYGON_OFFSET_FILL)}function lt(V){V?fe(s.SCISSOR_TEST):Me(s.SCISSOR_TEST)}function zt(V){V===void 0&&(V=s.TEXTURE0+ae-1),ce!==V&&(s.activeTexture(V),ce=V)}function kt(V,ye,Ae){Ae===void 0&&(ce===null?Ae=s.TEXTURE0+ae-1:Ae=ce);let De=se[Ae];De===void 0&&(De={type:void 0,texture:void 0},se[Ae]=De),(De.type!==V||De.texture!==ye)&&(ce!==Ae&&(s.activeTexture(Ae),ce=Ae),s.bindTexture(V,ye||ee[V]),De.type=V,De.texture=ye)}function P(){const V=se[ce];V!==void 0&&V.type!==void 0&&(s.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function T(){try{s.compressedTexImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Z(){try{s.compressedTexImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function de(){try{s.texSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ge(){try{s.texSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function le(){try{s.compressedTexSubImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function $e(){try{s.compressedTexSubImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function we(){try{s.texStorage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ze(){try{s.texStorage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ke(){try{s.texImage2D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ee(){try{s.texImage3D(...arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Pe(V){Fe.equals(V)===!1&&(s.scissor(V.x,V.y,V.z,V.w),Fe.copy(V))}function rt(V){Xe.equals(V)===!1&&(s.viewport(V.x,V.y,V.z,V.w),Xe.copy(V))}function Ye(V,ye){let Ae=p.get(ye);Ae===void 0&&(Ae=new WeakMap,p.set(ye,Ae));let De=Ae.get(V);De===void 0&&(De=s.getUniformBlockIndex(ye,V.name),Ae.set(V,De))}function Re(V,ye){const De=p.get(ye).get(V);h.get(ye)!==De&&(s.uniformBlockBinding(ye,De,V.__bindingPointIndex),h.set(ye,De))}function ft(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),c.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),g={},ce=null,se={},v={},x=new WeakMap,S=[],M=null,w=!1,y=null,_=null,I=null,L=null,b=null,z=null,F=null,O=new yt(0,0,0),X=0,C=!1,R=null,B=null,$=null,te=null,ue=null,Fe.set(0,0,s.canvas.width,s.canvas.height),Xe.set(0,0,s.canvas.width,s.canvas.height),l.reset(),c.reset(),f.reset()}return{buffers:{color:l,depth:c,stencil:f},enable:fe,disable:Me,bindFramebuffer:Le,drawBuffers:Ne,useProgram:pt,setBlending:Pt,setMaterial:ct,setFlipSided:it,setCullFace:Ve,setLineWidth:Ut,setPolygonOffset:Ge,setScissorTest:lt,activeTexture:zt,bindTexture:kt,unbindTexture:P,compressedTexImage2D:T,compressedTexImage3D:Z,texImage2D:Ke,texImage3D:Ee,updateUBOMapping:Ye,uniformBlockBinding:Re,texStorage2D:we,texStorage3D:ze,texSubImage2D:de,texSubImage3D:ge,compressedTexSubImage2D:le,compressedTexSubImage3D:$e,scissor:Pe,viewport:rt,reset:ft}}function t1(s,e,t,r,a,l,c){const f=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),p=new St,g=new WeakMap;let v;const x=new WeakMap;let S=!1;try{S=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(P,T){return S?new OffscreenCanvas(P,T):Zl("canvas")}function w(P,T,Z){let de=1;const ge=kt(P);if((ge.width>Z||ge.height>Z)&&(de=Z/Math.max(ge.width,ge.height)),de<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const le=Math.floor(de*ge.width),$e=Math.floor(de*ge.height);v===void 0&&(v=M(le,$e));const we=T?M(le,$e):v;return we.width=le,we.height=$e,we.getContext("2d").drawImage(P,0,0,le,$e),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+le+"x"+$e+")."),we}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),P;return P}function y(P){return P.generateMipmaps}function _(P){s.generateMipmap(P)}function I(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function L(P,T,Z,de,ge=!1){if(P!==null){if(s[P]!==void 0)return s[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let le=T;if(T===s.RED&&(Z===s.FLOAT&&(le=s.R32F),Z===s.HALF_FLOAT&&(le=s.R16F),Z===s.UNSIGNED_BYTE&&(le=s.R8)),T===s.RED_INTEGER&&(Z===s.UNSIGNED_BYTE&&(le=s.R8UI),Z===s.UNSIGNED_SHORT&&(le=s.R16UI),Z===s.UNSIGNED_INT&&(le=s.R32UI),Z===s.BYTE&&(le=s.R8I),Z===s.SHORT&&(le=s.R16I),Z===s.INT&&(le=s.R32I)),T===s.RG&&(Z===s.FLOAT&&(le=s.RG32F),Z===s.HALF_FLOAT&&(le=s.RG16F),Z===s.UNSIGNED_BYTE&&(le=s.RG8)),T===s.RG_INTEGER&&(Z===s.UNSIGNED_BYTE&&(le=s.RG8UI),Z===s.UNSIGNED_SHORT&&(le=s.RG16UI),Z===s.UNSIGNED_INT&&(le=s.RG32UI),Z===s.BYTE&&(le=s.RG8I),Z===s.SHORT&&(le=s.RG16I),Z===s.INT&&(le=s.RG32I)),T===s.RGB_INTEGER&&(Z===s.UNSIGNED_BYTE&&(le=s.RGB8UI),Z===s.UNSIGNED_SHORT&&(le=s.RGB16UI),Z===s.UNSIGNED_INT&&(le=s.RGB32UI),Z===s.BYTE&&(le=s.RGB8I),Z===s.SHORT&&(le=s.RGB16I),Z===s.INT&&(le=s.RGB32I)),T===s.RGBA_INTEGER&&(Z===s.UNSIGNED_BYTE&&(le=s.RGBA8UI),Z===s.UNSIGNED_SHORT&&(le=s.RGBA16UI),Z===s.UNSIGNED_INT&&(le=s.RGBA32UI),Z===s.BYTE&&(le=s.RGBA8I),Z===s.SHORT&&(le=s.RGBA16I),Z===s.INT&&(le=s.RGBA32I)),T===s.RGB&&(Z===s.UNSIGNED_INT_5_9_9_9_REV&&(le=s.RGB9_E5),Z===s.UNSIGNED_INT_10F_11F_11F_REV&&(le=s.R11F_G11F_B10F)),T===s.RGBA){const $e=ge?$l:At.getTransfer(de);Z===s.FLOAT&&(le=s.RGBA32F),Z===s.HALF_FLOAT&&(le=s.RGBA16F),Z===s.UNSIGNED_BYTE&&(le=$e===Dt?s.SRGB8_ALPHA8:s.RGBA8),Z===s.UNSIGNED_SHORT_4_4_4_4&&(le=s.RGBA4),Z===s.UNSIGNED_SHORT_5_5_5_1&&(le=s.RGB5_A1)}return(le===s.R16F||le===s.R32F||le===s.RG16F||le===s.RG32F||le===s.RGBA16F||le===s.RGBA32F)&&e.get("EXT_color_buffer_float"),le}function b(P,T){let Z;return P?T===null||T===us||T===ta?Z=s.DEPTH24_STENCIL8:T===Ki?Z=s.DEPTH32F_STENCIL8:T===ea&&(Z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===us||T===ta?Z=s.DEPTH_COMPONENT24:T===Ki?Z=s.DEPTH_COMPONENT32F:T===ea&&(Z=s.DEPTH_COMPONENT16),Z}function z(P,T){return y(P)===!0||P.isFramebufferTexture&&P.minFilter!==_i&&P.minFilter!==wi?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function F(P){const T=P.target;T.removeEventListener("dispose",F),X(T),T.isVideoTexture&&g.delete(T)}function O(P){const T=P.target;T.removeEventListener("dispose",O),R(T)}function X(P){const T=r.get(P);if(T.__webglInit===void 0)return;const Z=P.source,de=x.get(Z);if(de){const ge=de[T.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&C(P),Object.keys(de).length===0&&x.delete(Z)}r.remove(P)}function C(P){const T=r.get(P);s.deleteTexture(T.__webglTexture);const Z=P.source,de=x.get(Z);delete de[T.__cacheKey],c.memory.textures--}function R(P){const T=r.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),r.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let de=0;de<6;de++){if(Array.isArray(T.__webglFramebuffer[de]))for(let ge=0;ge<T.__webglFramebuffer[de].length;ge++)s.deleteFramebuffer(T.__webglFramebuffer[de][ge]);else s.deleteFramebuffer(T.__webglFramebuffer[de]);T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer[de])}else{if(Array.isArray(T.__webglFramebuffer))for(let de=0;de<T.__webglFramebuffer.length;de++)s.deleteFramebuffer(T.__webglFramebuffer[de]);else s.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&s.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let de=0;de<T.__webglColorRenderbuffer.length;de++)T.__webglColorRenderbuffer[de]&&s.deleteRenderbuffer(T.__webglColorRenderbuffer[de]);T.__webglDepthRenderbuffer&&s.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const Z=P.textures;for(let de=0,ge=Z.length;de<ge;de++){const le=r.get(Z[de]);le.__webglTexture&&(s.deleteTexture(le.__webglTexture),c.memory.textures--),r.remove(Z[de])}r.remove(P)}let B=0;function $(){B=0}function te(){const P=B;return P>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+a.maxTextures),B+=1,P}function ue(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function ae(P,T){const Z=r.get(P);if(P.isVideoTexture&&lt(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&Z.__version!==P.version){const de=P.image;if(de===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(de.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ee(Z,P,T);return}}else P.isExternalTexture&&(Z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,Z.__webglTexture,s.TEXTURE0+T)}function oe(P,T){const Z=r.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&Z.__version!==P.version){ee(Z,P,T);return}t.bindTexture(s.TEXTURE_2D_ARRAY,Z.__webglTexture,s.TEXTURE0+T)}function he(P,T){const Z=r.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&Z.__version!==P.version){ee(Z,P,T);return}t.bindTexture(s.TEXTURE_3D,Z.__webglTexture,s.TEXTURE0+T)}function H(P,T){const Z=r.get(P);if(P.version>0&&Z.__version!==P.version){fe(Z,P,T);return}t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture,s.TEXTURE0+T)}const ce={[Uf]:s.REPEAT,[rs]:s.CLAMP_TO_EDGE,[Nf]:s.MIRRORED_REPEAT},se={[_i]:s.NEAREST,[g_]:s.NEAREST_MIPMAP_NEAREST,[_l]:s.NEAREST_MIPMAP_LINEAR,[wi]:s.LINEAR,[Vc]:s.LINEAR_MIPMAP_NEAREST,[ss]:s.LINEAR_MIPMAP_LINEAR},U={[y_]:s.NEVER,[A_]:s.ALWAYS,[S_]:s.LESS,[Rg]:s.LEQUAL,[M_]:s.EQUAL,[w_]:s.GEQUAL,[E_]:s.GREATER,[T_]:s.NOTEQUAL};function re(P,T){if(T.type===Ki&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===wi||T.magFilter===Vc||T.magFilter===_l||T.magFilter===ss||T.minFilter===wi||T.minFilter===Vc||T.minFilter===_l||T.minFilter===ss)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,ce[T.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,ce[T.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,ce[T.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,se[T.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,se[T.minFilter]),T.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,U[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===_i||T.minFilter!==_l&&T.minFilter!==ss||T.type===Ki&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||r.get(T).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,a.getMaxAnisotropy())),r.get(T).__currentAnisotropy=T.anisotropy}}}function Fe(P,T){let Z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",F));const de=T.source;let ge=x.get(de);ge===void 0&&(ge={},x.set(de,ge));const le=ue(T);if(le!==P.__cacheKey){ge[le]===void 0&&(ge[le]={texture:s.createTexture(),usedTimes:0},c.memory.textures++,Z=!0),ge[le].usedTimes++;const $e=ge[P.__cacheKey];$e!==void 0&&(ge[P.__cacheKey].usedTimes--,$e.usedTimes===0&&C(T)),P.__cacheKey=le,P.__webglTexture=ge[le].texture}return Z}function Xe(P,T,Z){return Math.floor(Math.floor(P/Z)/T)}function He(P,T,Z,de){const le=P.updateRanges;if(le.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,T.width,T.height,Z,de,T.data);else{le.sort((Ee,Pe)=>Ee.start-Pe.start);let $e=0;for(let Ee=1;Ee<le.length;Ee++){const Pe=le[$e],rt=le[Ee],Ye=Pe.start+Pe.count,Re=Xe(rt.start,T.width,4),ft=Xe(Pe.start,T.width,4);rt.start<=Ye+1&&Re===ft&&Xe(rt.start+rt.count-1,T.width,4)===Re?Pe.count=Math.max(Pe.count,rt.start+rt.count-Pe.start):(++$e,le[$e]=rt)}le.length=$e+1;const we=s.getParameter(s.UNPACK_ROW_LENGTH),ze=s.getParameter(s.UNPACK_SKIP_PIXELS),Ke=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,T.width);for(let Ee=0,Pe=le.length;Ee<Pe;Ee++){const rt=le[Ee],Ye=Math.floor(rt.start/4),Re=Math.ceil(rt.count/4),ft=Ye%T.width,V=Math.floor(Ye/T.width),ye=Re,Ae=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,ft),s.pixelStorei(s.UNPACK_SKIP_ROWS,V),t.texSubImage2D(s.TEXTURE_2D,0,ft,V,ye,Ae,Z,de,T.data)}P.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,we),s.pixelStorei(s.UNPACK_SKIP_PIXELS,ze),s.pixelStorei(s.UNPACK_SKIP_ROWS,Ke)}}function ee(P,T,Z){let de=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(de=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(de=s.TEXTURE_3D);const ge=Fe(P,T),le=T.source;t.bindTexture(de,P.__webglTexture,s.TEXTURE0+Z);const $e=r.get(le);if(le.version!==$e.__version||ge===!0){t.activeTexture(s.TEXTURE0+Z);const we=At.getPrimaries(At.workingColorSpace),ze=T.colorSpace===wr?null:At.getPrimaries(T.colorSpace),Ke=T.colorSpace===wr||we===ze?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ke);let Ee=w(T.image,!1,a.maxTextureSize);Ee=zt(T,Ee);const Pe=l.convert(T.format,T.colorSpace),rt=l.convert(T.type);let Ye=L(T.internalFormat,Pe,rt,T.colorSpace,T.isVideoTexture);re(de,T);let Re;const ft=T.mipmaps,V=T.isVideoTexture!==!0,ye=$e.__version===void 0||ge===!0,Ae=le.dataReady,De=z(T,Ee);if(T.isDepthTexture)Ye=b(T.format===ia,T.type),ye&&(V?t.texStorage2D(s.TEXTURE_2D,1,Ye,Ee.width,Ee.height):t.texImage2D(s.TEXTURE_2D,0,Ye,Ee.width,Ee.height,0,Pe,rt,null));else if(T.isDataTexture)if(ft.length>0){V&&ye&&t.texStorage2D(s.TEXTURE_2D,De,Ye,ft[0].width,ft[0].height);for(let xe=0,pe=ft.length;xe<pe;xe++)Re=ft[xe],V?Ae&&t.texSubImage2D(s.TEXTURE_2D,xe,0,0,Re.width,Re.height,Pe,rt,Re.data):t.texImage2D(s.TEXTURE_2D,xe,Ye,Re.width,Re.height,0,Pe,rt,Re.data);T.generateMipmaps=!1}else V?(ye&&t.texStorage2D(s.TEXTURE_2D,De,Ye,Ee.width,Ee.height),Ae&&He(T,Ee,Pe,rt)):t.texImage2D(s.TEXTURE_2D,0,Ye,Ee.width,Ee.height,0,Pe,rt,Ee.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){V&&ye&&t.texStorage3D(s.TEXTURE_2D_ARRAY,De,Ye,ft[0].width,ft[0].height,Ee.depth);for(let xe=0,pe=ft.length;xe<pe;xe++)if(Re=ft[xe],T.format!==vi)if(Pe!==null)if(V){if(Ae)if(T.layerUpdates.size>0){const We=Om(Re.width,Re.height,T.format,T.type);for(const ut of T.layerUpdates){const Ct=Re.data.subarray(ut*We/Re.data.BYTES_PER_ELEMENT,(ut+1)*We/Re.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,xe,0,0,ut,Re.width,Re.height,1,Pe,Ct)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,xe,0,0,0,Re.width,Re.height,Ee.depth,Pe,Re.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,xe,Ye,Re.width,Re.height,Ee.depth,0,Re.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else V?Ae&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,xe,0,0,0,Re.width,Re.height,Ee.depth,Pe,rt,Re.data):t.texImage3D(s.TEXTURE_2D_ARRAY,xe,Ye,Re.width,Re.height,Ee.depth,0,Pe,rt,Re.data)}else{V&&ye&&t.texStorage2D(s.TEXTURE_2D,De,Ye,ft[0].width,ft[0].height);for(let xe=0,pe=ft.length;xe<pe;xe++)Re=ft[xe],T.format!==vi?Pe!==null?V?Ae&&t.compressedTexSubImage2D(s.TEXTURE_2D,xe,0,0,Re.width,Re.height,Pe,Re.data):t.compressedTexImage2D(s.TEXTURE_2D,xe,Ye,Re.width,Re.height,0,Re.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):V?Ae&&t.texSubImage2D(s.TEXTURE_2D,xe,0,0,Re.width,Re.height,Pe,rt,Re.data):t.texImage2D(s.TEXTURE_2D,xe,Ye,Re.width,Re.height,0,Pe,rt,Re.data)}else if(T.isDataArrayTexture)if(V){if(ye&&t.texStorage3D(s.TEXTURE_2D_ARRAY,De,Ye,Ee.width,Ee.height,Ee.depth),Ae)if(T.layerUpdates.size>0){const xe=Om(Ee.width,Ee.height,T.format,T.type);for(const pe of T.layerUpdates){const We=Ee.data.subarray(pe*xe/Ee.data.BYTES_PER_ELEMENT,(pe+1)*xe/Ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,pe,Ee.width,Ee.height,1,Pe,rt,We)}T.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Ee.width,Ee.height,Ee.depth,Pe,rt,Ee.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Ye,Ee.width,Ee.height,Ee.depth,0,Pe,rt,Ee.data);else if(T.isData3DTexture)V?(ye&&t.texStorage3D(s.TEXTURE_3D,De,Ye,Ee.width,Ee.height,Ee.depth),Ae&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Ee.width,Ee.height,Ee.depth,Pe,rt,Ee.data)):t.texImage3D(s.TEXTURE_3D,0,Ye,Ee.width,Ee.height,Ee.depth,0,Pe,rt,Ee.data);else if(T.isFramebufferTexture){if(ye)if(V)t.texStorage2D(s.TEXTURE_2D,De,Ye,Ee.width,Ee.height);else{let xe=Ee.width,pe=Ee.height;for(let We=0;We<De;We++)t.texImage2D(s.TEXTURE_2D,We,Ye,xe,pe,0,Pe,rt,null),xe>>=1,pe>>=1}}else if(ft.length>0){if(V&&ye){const xe=kt(ft[0]);t.texStorage2D(s.TEXTURE_2D,De,Ye,xe.width,xe.height)}for(let xe=0,pe=ft.length;xe<pe;xe++)Re=ft[xe],V?Ae&&t.texSubImage2D(s.TEXTURE_2D,xe,0,0,Pe,rt,Re):t.texImage2D(s.TEXTURE_2D,xe,Ye,Pe,rt,Re);T.generateMipmaps=!1}else if(V){if(ye){const xe=kt(Ee);t.texStorage2D(s.TEXTURE_2D,De,Ye,xe.width,xe.height)}Ae&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Pe,rt,Ee)}else t.texImage2D(s.TEXTURE_2D,0,Ye,Pe,rt,Ee);y(T)&&_(de),$e.__version=le.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function fe(P,T,Z){if(T.image.length!==6)return;const de=Fe(P,T),ge=T.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+Z);const le=r.get(ge);if(ge.version!==le.__version||de===!0){t.activeTexture(s.TEXTURE0+Z);const $e=At.getPrimaries(At.workingColorSpace),we=T.colorSpace===wr?null:At.getPrimaries(T.colorSpace),ze=T.colorSpace===wr||$e===we?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ze);const Ke=T.isCompressedTexture||T.image[0].isCompressedTexture,Ee=T.image[0]&&T.image[0].isDataTexture,Pe=[];for(let pe=0;pe<6;pe++)!Ke&&!Ee?Pe[pe]=w(T.image[pe],!0,a.maxCubemapSize):Pe[pe]=Ee?T.image[pe].image:T.image[pe],Pe[pe]=zt(T,Pe[pe]);const rt=Pe[0],Ye=l.convert(T.format,T.colorSpace),Re=l.convert(T.type),ft=L(T.internalFormat,Ye,Re,T.colorSpace),V=T.isVideoTexture!==!0,ye=le.__version===void 0||de===!0,Ae=ge.dataReady;let De=z(T,rt);re(s.TEXTURE_CUBE_MAP,T);let xe;if(Ke){V&&ye&&t.texStorage2D(s.TEXTURE_CUBE_MAP,De,ft,rt.width,rt.height);for(let pe=0;pe<6;pe++){xe=Pe[pe].mipmaps;for(let We=0;We<xe.length;We++){const ut=xe[We];T.format!==vi?Ye!==null?V?Ae&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We,0,0,ut.width,ut.height,Ye,ut.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We,ft,ut.width,ut.height,0,ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?Ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We,0,0,ut.width,ut.height,Ye,Re,ut.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We,ft,ut.width,ut.height,0,Ye,Re,ut.data)}}}else{if(xe=T.mipmaps,V&&ye){xe.length>0&&De++;const pe=kt(Pe[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,De,ft,pe.width,pe.height)}for(let pe=0;pe<6;pe++)if(Ee){V?Ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,Pe[pe].width,Pe[pe].height,Ye,Re,Pe[pe].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ft,Pe[pe].width,Pe[pe].height,0,Ye,Re,Pe[pe].data);for(let We=0;We<xe.length;We++){const Ct=xe[We].image[pe].image;V?Ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We+1,0,0,Ct.width,Ct.height,Ye,Re,Ct.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We+1,ft,Ct.width,Ct.height,0,Ye,Re,Ct.data)}}else{V?Ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,0,0,Ye,Re,Pe[pe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,0,ft,Ye,Re,Pe[pe]);for(let We=0;We<xe.length;We++){const ut=xe[We];V?Ae&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We+1,0,0,Ye,Re,ut.image[pe]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+pe,We+1,ft,Ye,Re,ut.image[pe])}}}y(T)&&_(s.TEXTURE_CUBE_MAP),le.__version=ge.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function Me(P,T,Z,de,ge,le){const $e=l.convert(Z.format,Z.colorSpace),we=l.convert(Z.type),ze=L(Z.internalFormat,$e,we,Z.colorSpace),Ke=r.get(T),Ee=r.get(Z);if(Ee.__renderTarget=T,!Ke.__hasExternalTextures){const Pe=Math.max(1,T.width>>le),rt=Math.max(1,T.height>>le);ge===s.TEXTURE_3D||ge===s.TEXTURE_2D_ARRAY?t.texImage3D(ge,le,ze,Pe,rt,T.depth,0,$e,we,null):t.texImage2D(ge,le,ze,Pe,rt,0,$e,we,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),Ge(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,de,ge,Ee.__webglTexture,0,Ut(T)):(ge===s.TEXTURE_2D||ge>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,de,ge,Ee.__webglTexture,le),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Le(P,T,Z){if(s.bindRenderbuffer(s.RENDERBUFFER,P),T.depthBuffer){const de=T.depthTexture,ge=de&&de.isDepthTexture?de.type:null,le=b(T.stencilBuffer,ge),$e=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,we=Ut(T);Ge(T)?f.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,we,le,T.width,T.height):Z?s.renderbufferStorageMultisample(s.RENDERBUFFER,we,le,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,le,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,$e,s.RENDERBUFFER,P)}else{const de=T.textures;for(let ge=0;ge<de.length;ge++){const le=de[ge],$e=l.convert(le.format,le.colorSpace),we=l.convert(le.type),ze=L(le.internalFormat,$e,we,le.colorSpace),Ke=Ut(T);Z&&Ge(T)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ke,ze,T.width,T.height):Ge(T)?f.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ke,ze,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,ze,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ne(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const de=r.get(T.depthTexture);de.__renderTarget=T,(!de.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),ae(T.depthTexture,0);const ge=de.__webglTexture,le=Ut(T);if(T.depthTexture.format===na)Ge(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ge,0,le):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,ge,0);else if(T.depthTexture.format===ia)Ge(T)?f.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ge,0,le):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,ge,0);else throw new Error("Unknown depthTexture format")}function pt(P){const T=r.get(P),Z=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const de=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),de){const ge=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,de.removeEventListener("dispose",ge)};de.addEventListener("dispose",ge),T.__depthDisposeCallback=ge}T.__boundDepthTexture=de}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");const de=P.texture.mipmaps;de&&de.length>0?Ne(T.__webglFramebuffer[0],P):Ne(T.__webglFramebuffer,P)}else if(Z){T.__webglDepthbuffer=[];for(let de=0;de<6;de++)if(t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[de]),T.__webglDepthbuffer[de]===void 0)T.__webglDepthbuffer[de]=s.createRenderbuffer(),Le(T.__webglDepthbuffer[de],P,!1);else{const ge=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=T.__webglDepthbuffer[de];s.bindRenderbuffer(s.RENDERBUFFER,le),s.framebufferRenderbuffer(s.FRAMEBUFFER,ge,s.RENDERBUFFER,le)}}else{const de=P.texture.mipmaps;if(de&&de.length>0?t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=s.createRenderbuffer(),Le(T.__webglDepthbuffer,P,!1);else{const ge=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,le=T.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,le),s.framebufferRenderbuffer(s.FRAMEBUFFER,ge,s.RENDERBUFFER,le)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Qt(P,T,Z){const de=r.get(P);T!==void 0&&Me(de.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),Z!==void 0&&pt(P)}function N(P){const T=P.texture,Z=r.get(P),de=r.get(T);P.addEventListener("dispose",O);const ge=P.textures,le=P.isWebGLCubeRenderTarget===!0,$e=ge.length>1;if($e||(de.__webglTexture===void 0&&(de.__webglTexture=s.createTexture()),de.__version=T.version,c.memory.textures++),le){Z.__webglFramebuffer=[];for(let we=0;we<6;we++)if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer[we]=[];for(let ze=0;ze<T.mipmaps.length;ze++)Z.__webglFramebuffer[we][ze]=s.createFramebuffer()}else Z.__webglFramebuffer[we]=s.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){Z.__webglFramebuffer=[];for(let we=0;we<T.mipmaps.length;we++)Z.__webglFramebuffer[we]=s.createFramebuffer()}else Z.__webglFramebuffer=s.createFramebuffer();if($e)for(let we=0,ze=ge.length;we<ze;we++){const Ke=r.get(ge[we]);Ke.__webglTexture===void 0&&(Ke.__webglTexture=s.createTexture(),c.memory.textures++)}if(P.samples>0&&Ge(P)===!1){Z.__webglMultisampledFramebuffer=s.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let we=0;we<ge.length;we++){const ze=ge[we];Z.__webglColorRenderbuffer[we]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,Z.__webglColorRenderbuffer[we]);const Ke=l.convert(ze.format,ze.colorSpace),Ee=l.convert(ze.type),Pe=L(ze.internalFormat,Ke,Ee,ze.colorSpace,P.isXRRenderTarget===!0),rt=Ut(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,rt,Pe,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+we,s.RENDERBUFFER,Z.__webglColorRenderbuffer[we])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(Z.__webglDepthRenderbuffer=s.createRenderbuffer(),Le(Z.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(le){t.bindTexture(s.TEXTURE_CUBE_MAP,de.__webglTexture),re(s.TEXTURE_CUBE_MAP,T);for(let we=0;we<6;we++)if(T.mipmaps&&T.mipmaps.length>0)for(let ze=0;ze<T.mipmaps.length;ze++)Me(Z.__webglFramebuffer[we][ze],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+we,ze);else Me(Z.__webglFramebuffer[we],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+we,0);y(T)&&_(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if($e){for(let we=0,ze=ge.length;we<ze;we++){const Ke=ge[we],Ee=r.get(Ke);let Pe=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Pe=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Pe,Ee.__webglTexture),re(Pe,Ke),Me(Z.__webglFramebuffer,P,Ke,s.COLOR_ATTACHMENT0+we,Pe,0),y(Ke)&&_(Pe)}t.unbindTexture()}else{let we=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(we=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(we,de.__webglTexture),re(we,T),T.mipmaps&&T.mipmaps.length>0)for(let ze=0;ze<T.mipmaps.length;ze++)Me(Z.__webglFramebuffer[ze],P,T,s.COLOR_ATTACHMENT0,we,ze);else Me(Z.__webglFramebuffer,P,T,s.COLOR_ATTACHMENT0,we,0);y(T)&&_(we),t.unbindTexture()}P.depthBuffer&&pt(P)}function Pt(P){const T=P.textures;for(let Z=0,de=T.length;Z<de;Z++){const ge=T[Z];if(y(ge)){const le=I(P),$e=r.get(ge).__webglTexture;t.bindTexture(le,$e),_(le),t.unbindTexture()}}}const ct=[],it=[];function Ve(P){if(P.samples>0){if(Ge(P)===!1){const T=P.textures,Z=P.width,de=P.height;let ge=s.COLOR_BUFFER_BIT;const le=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,$e=r.get(P),we=T.length>1;if(we)for(let Ke=0;Ke<T.length;Ke++)t.bindFramebuffer(s.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ke,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,$e.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ke,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,$e.__webglMultisampledFramebuffer);const ze=P.texture.mipmaps;ze&&ze.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,$e.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,$e.__webglFramebuffer);for(let Ke=0;Ke<T.length;Ke++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ge|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ge|=s.STENCIL_BUFFER_BIT)),we){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,$e.__webglColorRenderbuffer[Ke]);const Ee=r.get(T[Ke]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Ee,0)}s.blitFramebuffer(0,0,Z,de,0,0,Z,de,ge,s.NEAREST),h===!0&&(ct.length=0,it.length=0,ct.push(s.COLOR_ATTACHMENT0+Ke),P.depthBuffer&&P.resolveDepthBuffer===!1&&(ct.push(le),it.push(le),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,it)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ct))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),we)for(let Ke=0;Ke<T.length;Ke++){t.bindFramebuffer(s.FRAMEBUFFER,$e.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ke,s.RENDERBUFFER,$e.__webglColorRenderbuffer[Ke]);const Ee=r.get(T[Ke]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,$e.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Ke,s.TEXTURE_2D,Ee,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,$e.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&h){const T=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[T])}}}function Ut(P){return Math.min(a.maxSamples,P.samples)}function Ge(P){const T=r.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function lt(P){const T=c.render.frame;g.get(P)!==T&&(g.set(P,T),P.update())}function zt(P,T){const Z=P.colorSpace,de=P.format,ge=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||Z!==io&&Z!==wr&&(At.getTransfer(Z)===Dt?(de!==vi||ge!==bi)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),T}function kt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(p.width=P.naturalWidth||P.width,p.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(p.width=P.displayWidth,p.height=P.displayHeight):(p.width=P.width,p.height=P.height),p}this.allocateTextureUnit=te,this.resetTextureUnits=$,this.setTexture2D=ae,this.setTexture2DArray=oe,this.setTexture3D=he,this.setTextureCube=H,this.rebindTextures=Qt,this.setupRenderTarget=N,this.updateRenderTargetMipmap=Pt,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=pt,this.setupFrameBufferTexture=Me,this.useMultisampledRTT=Ge}function n1(s,e){function t(r,a=wr){let l;const c=At.getTransfer(a);if(r===bi)return s.UNSIGNED_BYTE;if(r===gd)return s.UNSIGNED_SHORT_4_4_4_4;if(r===vd)return s.UNSIGNED_SHORT_5_5_5_1;if(r===yg)return s.UNSIGNED_INT_5_9_9_9_REV;if(r===Sg)return s.UNSIGNED_INT_10F_11F_11F_REV;if(r===_g)return s.BYTE;if(r===xg)return s.SHORT;if(r===ea)return s.UNSIGNED_SHORT;if(r===md)return s.INT;if(r===us)return s.UNSIGNED_INT;if(r===Ki)return s.FLOAT;if(r===la)return s.HALF_FLOAT;if(r===Mg)return s.ALPHA;if(r===Eg)return s.RGB;if(r===vi)return s.RGBA;if(r===na)return s.DEPTH_COMPONENT;if(r===ia)return s.DEPTH_STENCIL;if(r===Tg)return s.RED;if(r===_d)return s.RED_INTEGER;if(r===wg)return s.RG;if(r===xd)return s.RG_INTEGER;if(r===yd)return s.RGBA_INTEGER;if(r===Wl||r===Xl||r===jl||r===Yl)if(c===Dt)if(l=e.get("WEBGL_compressed_texture_s3tc_srgb"),l!==null){if(r===Wl)return l.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Xl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===jl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Yl)return l.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(l=e.get("WEBGL_compressed_texture_s3tc"),l!==null){if(r===Wl)return l.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Xl)return l.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===jl)return l.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Yl)return l.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Ff||r===Of||r===zf||r===kf)if(l=e.get("WEBGL_compressed_texture_pvrtc"),l!==null){if(r===Ff)return l.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Of)return l.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===zf)return l.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===kf)return l.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Bf||r===Hf||r===Vf)if(l=e.get("WEBGL_compressed_texture_etc"),l!==null){if(r===Bf||r===Hf)return c===Dt?l.COMPRESSED_SRGB8_ETC2:l.COMPRESSED_RGB8_ETC2;if(r===Vf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:l.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Gf||r===Wf||r===Xf||r===jf||r===Yf||r===qf||r===$f||r===Kf||r===Zf||r===Qf||r===Jf||r===ed||r===td||r===nd)if(l=e.get("WEBGL_compressed_texture_astc"),l!==null){if(r===Gf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:l.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Wf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:l.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Xf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:l.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===jf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:l.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Yf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:l.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===qf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:l.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===$f)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:l.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Kf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:l.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Zf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:l.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Qf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:l.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Jf)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:l.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===ed)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:l.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===td)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:l.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===nd)return c===Dt?l.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:l.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===id||r===rd||r===sd)if(l=e.get("EXT_texture_compression_bptc"),l!==null){if(r===id)return c===Dt?l.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:l.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===rd)return l.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===sd)return l.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===od||r===ad||r===ld||r===ud)if(l=e.get("EXT_texture_compression_rgtc"),l!==null){if(r===od)return l.COMPRESSED_RED_RGTC1_EXT;if(r===ad)return l.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===ld)return l.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===ud)return l.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===ta?s.UNSIGNED_INT_24_8:s[r]!==void 0?s[r]:null}return{convert:t}}const i1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,r1=`
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

}`;class s1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const r=new Bg(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new Lr({vertexShader:i1,fragmentShader:r1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new $t(new so(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class o1 extends oo{constructor(e,t){super();const r=this;let a=null,l=1,c=null,f="local-floor",h=1,p=null,g=null,v=null,x=null,S=null,M=null;const w=typeof XRWebGLBinding<"u",y=new s1,_={},I=t.getContextAttributes();let L=null,b=null;const z=[],F=[],O=new St;let X=null;const C=new Kn;C.viewport=new It;const R=new Kn;R.viewport=new It;const B=[C,R],$=new Rx;let te=null,ue=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let fe=z[ee];return fe===void 0&&(fe=new cf,z[ee]=fe),fe.getTargetRaySpace()},this.getControllerGrip=function(ee){let fe=z[ee];return fe===void 0&&(fe=new cf,z[ee]=fe),fe.getGripSpace()},this.getHand=function(ee){let fe=z[ee];return fe===void 0&&(fe=new cf,z[ee]=fe),fe.getHandSpace()};function ae(ee){const fe=F.indexOf(ee.inputSource);if(fe===-1)return;const Me=z[fe];Me!==void 0&&(Me.update(ee.inputSource,ee.frame,p||c),Me.dispatchEvent({type:ee.type,data:ee.inputSource}))}function oe(){a.removeEventListener("select",ae),a.removeEventListener("selectstart",ae),a.removeEventListener("selectend",ae),a.removeEventListener("squeeze",ae),a.removeEventListener("squeezestart",ae),a.removeEventListener("squeezeend",ae),a.removeEventListener("end",oe),a.removeEventListener("inputsourceschange",he);for(let ee=0;ee<z.length;ee++){const fe=F[ee];fe!==null&&(F[ee]=null,z[ee].disconnect(fe))}te=null,ue=null,y.reset();for(const ee in _)delete _[ee];e.setRenderTarget(L),S=null,x=null,v=null,a=null,b=null,He.stop(),r.isPresenting=!1,e.setPixelRatio(X),e.setSize(O.width,O.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){l=ee,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){f=ee,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return p||c},this.setReferenceSpace=function(ee){p=ee},this.getBaseLayer=function(){return x!==null?x:S},this.getBinding=function(){return v===null&&w&&(v=new XRWebGLBinding(a,t)),v},this.getFrame=function(){return M},this.getSession=function(){return a},this.setSession=async function(ee){if(a=ee,a!==null){if(L=e.getRenderTarget(),a.addEventListener("select",ae),a.addEventListener("selectstart",ae),a.addEventListener("selectend",ae),a.addEventListener("squeeze",ae),a.addEventListener("squeezestart",ae),a.addEventListener("squeezeend",ae),a.addEventListener("end",oe),a.addEventListener("inputsourceschange",he),I.xrCompatible!==!0&&await t.makeXRCompatible(),X=e.getPixelRatio(),e.getSize(O),w&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,Le=null,Ne=null;I.depth&&(Ne=I.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Me=I.stencil?ia:na,Le=I.stencil?ta:us);const pt={colorFormat:t.RGBA8,depthFormat:Ne,scaleFactor:l};v=this.getBinding(),x=v.createProjectionLayer(pt),a.updateRenderState({layers:[x]}),e.setPixelRatio(1),e.setSize(x.textureWidth,x.textureHeight,!1),b=new cs(x.textureWidth,x.textureHeight,{format:vi,type:bi,depthTexture:new kg(x.textureWidth,x.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:I.stencil,colorSpace:e.outputColorSpace,samples:I.antialias?4:0,resolveDepthBuffer:x.ignoreDepthValues===!1,resolveStencilBuffer:x.ignoreDepthValues===!1})}else{const Me={antialias:I.antialias,alpha:!0,depth:I.depth,stencil:I.stencil,framebufferScaleFactor:l};S=new XRWebGLLayer(a,t,Me),a.updateRenderState({baseLayer:S}),e.setPixelRatio(1),e.setSize(S.framebufferWidth,S.framebufferHeight,!1),b=new cs(S.framebufferWidth,S.framebufferHeight,{format:vi,type:bi,colorSpace:e.outputColorSpace,stencilBuffer:I.stencil,resolveDepthBuffer:S.ignoreDepthValues===!1,resolveStencilBuffer:S.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(h),p=null,c=await a.requestReferenceSpace(f),He.setContext(a),He.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function he(ee){for(let fe=0;fe<ee.removed.length;fe++){const Me=ee.removed[fe],Le=F.indexOf(Me);Le>=0&&(F[Le]=null,z[Le].disconnect(Me))}for(let fe=0;fe<ee.added.length;fe++){const Me=ee.added[fe];let Le=F.indexOf(Me);if(Le===-1){for(let pt=0;pt<z.length;pt++)if(pt>=F.length){F.push(Me),Le=pt;break}else if(F[pt]===null){F[pt]=Me,Le=pt;break}if(Le===-1)break}const Ne=z[Le];Ne&&Ne.connect(Me)}}const H=new j,ce=new j;function se(ee,fe,Me){H.setFromMatrixPosition(fe.matrixWorld),ce.setFromMatrixPosition(Me.matrixWorld);const Le=H.distanceTo(ce),Ne=fe.projectionMatrix.elements,pt=Me.projectionMatrix.elements,Qt=Ne[14]/(Ne[10]-1),N=Ne[14]/(Ne[10]+1),Pt=(Ne[9]+1)/Ne[5],ct=(Ne[9]-1)/Ne[5],it=(Ne[8]-1)/Ne[0],Ve=(pt[8]+1)/pt[0],Ut=Qt*it,Ge=Qt*Ve,lt=Le/(-it+Ve),zt=lt*-it;if(fe.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(zt),ee.translateZ(lt),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),Ne[10]===-1)ee.projectionMatrix.copy(fe.projectionMatrix),ee.projectionMatrixInverse.copy(fe.projectionMatrixInverse);else{const kt=Qt+lt,P=N+lt,T=Ut-zt,Z=Ge+(Le-zt),de=Pt*N/P*kt,ge=ct*N/P*kt;ee.projectionMatrix.makePerspective(T,Z,de,ge,kt,P),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function U(ee,fe){fe===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(fe.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(a===null)return;let fe=ee.near,Me=ee.far;y.texture!==null&&(y.depthNear>0&&(fe=y.depthNear),y.depthFar>0&&(Me=y.depthFar)),$.near=R.near=C.near=fe,$.far=R.far=C.far=Me,(te!==$.near||ue!==$.far)&&(a.updateRenderState({depthNear:$.near,depthFar:$.far}),te=$.near,ue=$.far),$.layers.mask=ee.layers.mask|6,C.layers.mask=$.layers.mask&3,R.layers.mask=$.layers.mask&5;const Le=ee.parent,Ne=$.cameras;U($,Le);for(let pt=0;pt<Ne.length;pt++)U(Ne[pt],Le);Ne.length===2?se($,C,R):$.projectionMatrix.copy(C.projectionMatrix),re(ee,$,Le)};function re(ee,fe,Me){Me===null?ee.matrix.copy(fe.matrixWorld):(ee.matrix.copy(Me.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(fe.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(fe.projectionMatrix),ee.projectionMatrixInverse.copy(fe.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=ra*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return $},this.getFoveation=function(){if(!(x===null&&S===null))return h},this.setFoveation=function(ee){h=ee,x!==null&&(x.fixedFoveation=ee),S!==null&&S.fixedFoveation!==void 0&&(S.fixedFoveation=ee)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh($)},this.getCameraTexture=function(ee){return _[ee]};let Fe=null;function Xe(ee,fe){if(g=fe.getViewerPose(p||c),M=fe,g!==null){const Me=g.views;S!==null&&(e.setRenderTargetFramebuffer(b,S.framebuffer),e.setRenderTarget(b));let Le=!1;Me.length!==$.cameras.length&&($.cameras.length=0,Le=!0);for(let N=0;N<Me.length;N++){const Pt=Me[N];let ct=null;if(S!==null)ct=S.getViewport(Pt);else{const Ve=v.getViewSubImage(x,Pt);ct=Ve.viewport,N===0&&(e.setRenderTargetTextures(b,Ve.colorTexture,Ve.depthStencilTexture),e.setRenderTarget(b))}let it=B[N];it===void 0&&(it=new Kn,it.layers.enable(N),it.viewport=new It,B[N]=it),it.matrix.fromArray(Pt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(Pt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(ct.x,ct.y,ct.width,ct.height),N===0&&($.matrix.copy(it.matrix),$.matrix.decompose($.position,$.quaternion,$.scale)),Le===!0&&$.cameras.push(it)}const Ne=a.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")&&a.depthUsage=="gpu-optimized"&&w){v=r.getBinding();const N=v.getDepthInformation(Me[0]);N&&N.isValid&&N.texture&&y.init(N,a.renderState)}if(Ne&&Ne.includes("camera-access")&&w){e.state.unbindTexture(),v=r.getBinding();for(let N=0;N<Me.length;N++){const Pt=Me[N].camera;if(Pt){let ct=_[Pt];ct||(ct=new Bg,_[Pt]=ct);const it=v.getCameraImage(Pt);ct.sourceTexture=it}}}}for(let Me=0;Me<z.length;Me++){const Le=F[Me],Ne=z[Me];Le!==null&&Ne!==void 0&&Ne.update(Le,fe,p||c)}Fe&&Fe(ee,fe),fe.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:fe}),M=null}const He=new Gg;He.setAnimationLoop(Xe),this.setAnimationLoop=function(ee){Fe=ee},this.dispose=function(){}}}const Jr=new Pi,a1=new Xt;function l1(s,e){function t(y,_){y.matrixAutoUpdate===!0&&y.updateMatrix(),_.value.copy(y.matrix)}function r(y,_){_.color.getRGB(y.fogColor.value,Ng(s)),_.isFog?(y.fogNear.value=_.near,y.fogFar.value=_.far):_.isFogExp2&&(y.fogDensity.value=_.density)}function a(y,_,I,L,b){_.isMeshBasicMaterial||_.isMeshLambertMaterial?l(y,_):_.isMeshToonMaterial?(l(y,_),v(y,_)):_.isMeshPhongMaterial?(l(y,_),g(y,_)):_.isMeshStandardMaterial?(l(y,_),x(y,_),_.isMeshPhysicalMaterial&&S(y,_,b)):_.isMeshMatcapMaterial?(l(y,_),M(y,_)):_.isMeshDepthMaterial?l(y,_):_.isMeshDistanceMaterial?(l(y,_),w(y,_)):_.isMeshNormalMaterial?l(y,_):_.isLineBasicMaterial?(c(y,_),_.isLineDashedMaterial&&f(y,_)):_.isPointsMaterial?h(y,_,I,L):_.isSpriteMaterial?p(y,_):_.isShadowMaterial?(y.color.value.copy(_.color),y.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function l(y,_){y.opacity.value=_.opacity,_.color&&y.diffuse.value.copy(_.color),_.emissive&&y.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(y.map.value=_.map,t(_.map,y.mapTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,t(_.alphaMap,y.alphaMapTransform)),_.bumpMap&&(y.bumpMap.value=_.bumpMap,t(_.bumpMap,y.bumpMapTransform),y.bumpScale.value=_.bumpScale,_.side===Bn&&(y.bumpScale.value*=-1)),_.normalMap&&(y.normalMap.value=_.normalMap,t(_.normalMap,y.normalMapTransform),y.normalScale.value.copy(_.normalScale),_.side===Bn&&y.normalScale.value.negate()),_.displacementMap&&(y.displacementMap.value=_.displacementMap,t(_.displacementMap,y.displacementMapTransform),y.displacementScale.value=_.displacementScale,y.displacementBias.value=_.displacementBias),_.emissiveMap&&(y.emissiveMap.value=_.emissiveMap,t(_.emissiveMap,y.emissiveMapTransform)),_.specularMap&&(y.specularMap.value=_.specularMap,t(_.specularMap,y.specularMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest);const I=e.get(_),L=I.envMap,b=I.envMapRotation;L&&(y.envMap.value=L,Jr.copy(b),Jr.x*=-1,Jr.y*=-1,Jr.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(Jr.y*=-1,Jr.z*=-1),y.envMapRotation.value.setFromMatrix4(a1.makeRotationFromEuler(Jr)),y.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,y.reflectivity.value=_.reflectivity,y.ior.value=_.ior,y.refractionRatio.value=_.refractionRatio),_.lightMap&&(y.lightMap.value=_.lightMap,y.lightMapIntensity.value=_.lightMapIntensity,t(_.lightMap,y.lightMapTransform)),_.aoMap&&(y.aoMap.value=_.aoMap,y.aoMapIntensity.value=_.aoMapIntensity,t(_.aoMap,y.aoMapTransform))}function c(y,_){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,_.map&&(y.map.value=_.map,t(_.map,y.mapTransform))}function f(y,_){y.dashSize.value=_.dashSize,y.totalSize.value=_.dashSize+_.gapSize,y.scale.value=_.scale}function h(y,_,I,L){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,y.size.value=_.size*I,y.scale.value=L*.5,_.map&&(y.map.value=_.map,t(_.map,y.uvTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,t(_.alphaMap,y.alphaMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest)}function p(y,_){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,y.rotation.value=_.rotation,_.map&&(y.map.value=_.map,t(_.map,y.mapTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,t(_.alphaMap,y.alphaMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest)}function g(y,_){y.specular.value.copy(_.specular),y.shininess.value=Math.max(_.shininess,1e-4)}function v(y,_){_.gradientMap&&(y.gradientMap.value=_.gradientMap)}function x(y,_){y.metalness.value=_.metalness,_.metalnessMap&&(y.metalnessMap.value=_.metalnessMap,t(_.metalnessMap,y.metalnessMapTransform)),y.roughness.value=_.roughness,_.roughnessMap&&(y.roughnessMap.value=_.roughnessMap,t(_.roughnessMap,y.roughnessMapTransform)),_.envMap&&(y.envMapIntensity.value=_.envMapIntensity)}function S(y,_,I){y.ior.value=_.ior,_.sheen>0&&(y.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),y.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(y.sheenColorMap.value=_.sheenColorMap,t(_.sheenColorMap,y.sheenColorMapTransform)),_.sheenRoughnessMap&&(y.sheenRoughnessMap.value=_.sheenRoughnessMap,t(_.sheenRoughnessMap,y.sheenRoughnessMapTransform))),_.clearcoat>0&&(y.clearcoat.value=_.clearcoat,y.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(y.clearcoatMap.value=_.clearcoatMap,t(_.clearcoatMap,y.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,t(_.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(y.clearcoatNormalMap.value=_.clearcoatNormalMap,t(_.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===Bn&&y.clearcoatNormalScale.value.negate())),_.dispersion>0&&(y.dispersion.value=_.dispersion),_.iridescence>0&&(y.iridescence.value=_.iridescence,y.iridescenceIOR.value=_.iridescenceIOR,y.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(y.iridescenceMap.value=_.iridescenceMap,t(_.iridescenceMap,y.iridescenceMapTransform)),_.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=_.iridescenceThicknessMap,t(_.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),_.transmission>0&&(y.transmission.value=_.transmission,y.transmissionSamplerMap.value=I.texture,y.transmissionSamplerSize.value.set(I.width,I.height),_.transmissionMap&&(y.transmissionMap.value=_.transmissionMap,t(_.transmissionMap,y.transmissionMapTransform)),y.thickness.value=_.thickness,_.thicknessMap&&(y.thicknessMap.value=_.thicknessMap,t(_.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=_.attenuationDistance,y.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(y.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(y.anisotropyMap.value=_.anisotropyMap,t(_.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=_.specularIntensity,y.specularColor.value.copy(_.specularColor),_.specularColorMap&&(y.specularColorMap.value=_.specularColorMap,t(_.specularColorMap,y.specularColorMapTransform)),_.specularIntensityMap&&(y.specularIntensityMap.value=_.specularIntensityMap,t(_.specularIntensityMap,y.specularIntensityMapTransform))}function M(y,_){_.matcap&&(y.matcap.value=_.matcap)}function w(y,_){const I=e.get(_).light;y.referencePosition.value.setFromMatrixPosition(I.matrixWorld),y.nearDistance.value=I.shadow.camera.near,y.farDistance.value=I.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function u1(s,e,t,r){let a={},l={},c=[];const f=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function h(I,L){const b=L.program;r.uniformBlockBinding(I,b)}function p(I,L){let b=a[I.id];b===void 0&&(M(I),b=g(I),a[I.id]=b,I.addEventListener("dispose",y));const z=L.program;r.updateUBOMapping(I,z);const F=e.render.frame;l[I.id]!==F&&(x(I),l[I.id]=F)}function g(I){const L=v();I.__bindingPointIndex=L;const b=s.createBuffer(),z=I.__size,F=I.usage;return s.bindBuffer(s.UNIFORM_BUFFER,b),s.bufferData(s.UNIFORM_BUFFER,z,F),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,L,b),b}function v(){for(let I=0;I<f;I++)if(c.indexOf(I)===-1)return c.push(I),I;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function x(I){const L=a[I.id],b=I.uniforms,z=I.__cache;s.bindBuffer(s.UNIFORM_BUFFER,L);for(let F=0,O=b.length;F<O;F++){const X=Array.isArray(b[F])?b[F]:[b[F]];for(let C=0,R=X.length;C<R;C++){const B=X[C];if(S(B,F,C,z)===!0){const $=B.__offset,te=Array.isArray(B.value)?B.value:[B.value];let ue=0;for(let ae=0;ae<te.length;ae++){const oe=te[ae],he=w(oe);typeof oe=="number"||typeof oe=="boolean"?(B.__data[0]=oe,s.bufferSubData(s.UNIFORM_BUFFER,$+ue,B.__data)):oe.isMatrix3?(B.__data[0]=oe.elements[0],B.__data[1]=oe.elements[1],B.__data[2]=oe.elements[2],B.__data[3]=0,B.__data[4]=oe.elements[3],B.__data[5]=oe.elements[4],B.__data[6]=oe.elements[5],B.__data[7]=0,B.__data[8]=oe.elements[6],B.__data[9]=oe.elements[7],B.__data[10]=oe.elements[8],B.__data[11]=0):(oe.toArray(B.__data,ue),ue+=he.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,$,B.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function S(I,L,b,z){const F=I.value,O=L+"_"+b;if(z[O]===void 0)return typeof F=="number"||typeof F=="boolean"?z[O]=F:z[O]=F.clone(),!0;{const X=z[O];if(typeof F=="number"||typeof F=="boolean"){if(X!==F)return z[O]=F,!0}else if(X.equals(F)===!1)return X.copy(F),!0}return!1}function M(I){const L=I.uniforms;let b=0;const z=16;for(let O=0,X=L.length;O<X;O++){const C=Array.isArray(L[O])?L[O]:[L[O]];for(let R=0,B=C.length;R<B;R++){const $=C[R],te=Array.isArray($.value)?$.value:[$.value];for(let ue=0,ae=te.length;ue<ae;ue++){const oe=te[ue],he=w(oe),H=b%z,ce=H%he.boundary,se=H+ce;b+=ce,se!==0&&z-se<he.storage&&(b+=z-se),$.__data=new Float32Array(he.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=b,b+=he.storage}}}const F=b%z;return F>0&&(b+=z-F),I.__size=b,I.__cache={},this}function w(I){const L={boundary:0,storage:0};return typeof I=="number"||typeof I=="boolean"?(L.boundary=4,L.storage=4):I.isVector2?(L.boundary=8,L.storage=8):I.isVector3||I.isColor?(L.boundary=16,L.storage=12):I.isVector4?(L.boundary=16,L.storage=16):I.isMatrix3?(L.boundary=48,L.storage=48):I.isMatrix4?(L.boundary=64,L.storage=64):I.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",I),L}function y(I){const L=I.target;L.removeEventListener("dispose",y);const b=c.indexOf(L.__bindingPointIndex);c.splice(b,1),s.deleteBuffer(a[L.id]),delete a[L.id],delete l[L.id]}function _(){for(const I in a)s.deleteBuffer(a[I]);c=[],a={},l={}}return{bind:h,update:p,dispose:_}}class c1{constructor(e={}){const{canvas:t=G_(),context:r=null,depth:a=!0,stencil:l=!1,alpha:c=!1,antialias:f=!1,premultipliedAlpha:h=!0,preserveDrawingBuffer:p=!1,powerPreference:g="default",failIfMajorPerformanceCaveat:v=!1,reversedDepthBuffer:x=!1}=e;this.isWebGLRenderer=!0;let S;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");S=r.getContextAttributes().alpha}else S=c;const M=new Uint32Array(4),w=new Int32Array(4);let y=null,_=null;const I=[],L=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=br,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let z=!1;this._outputColorSpace=qn;let F=0,O=0,X=null,C=-1,R=null;const B=new It,$=new It;let te=null;const ue=new yt(0);let ae=0,oe=t.width,he=t.height,H=1,ce=null,se=null;const U=new It(0,0,oe,he),re=new It(0,0,oe,he);let Fe=!1;const Xe=new Td;let He=!1,ee=!1;const fe=new Xt,Me=new j,Le=new It,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let pt=!1;function Qt(){return X===null?H:1}let N=r;function Pt(A,Y){return t.getContext(A,Y)}try{const A={alpha:!0,depth:a,stencil:l,antialias:f,premultipliedAlpha:h,preserveDrawingBuffer:p,powerPreference:g,failIfMajorPerformanceCaveat:v};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${pd}`),t.addEventListener("webglcontextlost",Ae,!1),t.addEventListener("webglcontextrestored",De,!1),t.addEventListener("webglcontextcreationerror",xe,!1),N===null){const Y="webgl2";if(N=Pt(Y,A),N===null)throw Pt(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let ct,it,Ve,Ut,Ge,lt,zt,kt,P,T,Z,de,ge,le,$e,we,ze,Ke,Ee,Pe,rt,Ye,Re,ft;function V(){ct=new yM(N),ct.init(),Ye=new n1(N,ct),it=new hM(N,ct,e,Ye),Ve=new e1(N,ct),it.reversedDepthBuffer&&x&&Ve.buffers.depth.setReversed(!0),Ut=new EM(N),Ge=new HE,lt=new t1(N,ct,Ve,Ge,it,Ye,Ut),zt=new mM(b),kt=new xM(b),P=new bx(N),Re=new fM(N,P),T=new SM(N,P,Ut,Re),Z=new wM(N,T,P,Ut),Ee=new TM(N,it,lt),we=new pM(Ge),de=new BE(b,zt,kt,ct,it,Re,we),ge=new l1(b,Ge),le=new GE,$e=new $E(ct),Ke=new cM(b,zt,kt,Ve,Z,S,h),ze=new QE(b,Z,it),ft=new u1(N,Ut,it,Ve),Pe=new dM(N,ct,Ut),rt=new MM(N,ct,Ut),Ut.programs=de.programs,b.capabilities=it,b.extensions=ct,b.properties=Ge,b.renderLists=le,b.shadowMap=ze,b.state=Ve,b.info=Ut}V();const ye=new o1(b,N);this.xr=ye,this.getContext=function(){return N},this.getContextAttributes=function(){return N.getContextAttributes()},this.forceContextLoss=function(){const A=ct.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=ct.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(A){A!==void 0&&(H=A,this.setSize(oe,he,!1))},this.getSize=function(A){return A.set(oe,he)},this.setSize=function(A,Y,ne=!0){if(ye.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}oe=A,he=Y,t.width=Math.floor(A*H),t.height=Math.floor(Y*H),ne===!0&&(t.style.width=A+"px",t.style.height=Y+"px"),this.setViewport(0,0,A,Y)},this.getDrawingBufferSize=function(A){return A.set(oe*H,he*H).floor()},this.setDrawingBufferSize=function(A,Y,ne){oe=A,he=Y,H=ne,t.width=Math.floor(A*ne),t.height=Math.floor(Y*ne),this.setViewport(0,0,A,Y)},this.getCurrentViewport=function(A){return A.copy(B)},this.getViewport=function(A){return A.copy(U)},this.setViewport=function(A,Y,ne,ie){A.isVector4?U.set(A.x,A.y,A.z,A.w):U.set(A,Y,ne,ie),Ve.viewport(B.copy(U).multiplyScalar(H).round())},this.getScissor=function(A){return A.copy(re)},this.setScissor=function(A,Y,ne,ie){A.isVector4?re.set(A.x,A.y,A.z,A.w):re.set(A,Y,ne,ie),Ve.scissor($.copy(re).multiplyScalar(H).round())},this.getScissorTest=function(){return Fe},this.setScissorTest=function(A){Ve.setScissorTest(Fe=A)},this.setOpaqueSort=function(A){ce=A},this.setTransparentSort=function(A){se=A},this.getClearColor=function(A){return A.copy(Ke.getClearColor())},this.setClearColor=function(){Ke.setClearColor(...arguments)},this.getClearAlpha=function(){return Ke.getClearAlpha()},this.setClearAlpha=function(){Ke.setClearAlpha(...arguments)},this.clear=function(A=!0,Y=!0,ne=!0){let ie=0;if(A){let W=!1;if(X!==null){const Se=X.texture.format;W=Se===yd||Se===xd||Se===_d}if(W){const Se=X.texture.type,Ce=Se===bi||Se===us||Se===ea||Se===ta||Se===gd||Se===vd,ke=Ke.getClearColor(),Ie=Ke.getClearAlpha(),nt=ke.r,st=ke.g,Ze=ke.b;Ce?(M[0]=nt,M[1]=st,M[2]=Ze,M[3]=Ie,N.clearBufferuiv(N.COLOR,0,M)):(w[0]=nt,w[1]=st,w[2]=Ze,w[3]=Ie,N.clearBufferiv(N.COLOR,0,w))}else ie|=N.COLOR_BUFFER_BIT}Y&&(ie|=N.DEPTH_BUFFER_BIT),ne&&(ie|=N.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),N.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Ae,!1),t.removeEventListener("webglcontextrestored",De,!1),t.removeEventListener("webglcontextcreationerror",xe,!1),Ke.dispose(),le.dispose(),$e.dispose(),Ge.dispose(),zt.dispose(),kt.dispose(),Z.dispose(),Re.dispose(),ft.dispose(),de.dispose(),ye.dispose(),ye.removeEventListener("sessionstart",pn),ye.removeEventListener("sessionend",fs),Hn.stop()};function Ae(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),z=!0}function De(){console.log("THREE.WebGLRenderer: Context Restored."),z=!1;const A=Ut.autoReset,Y=ze.enabled,ne=ze.autoUpdate,ie=ze.needsUpdate,W=ze.type;V(),Ut.autoReset=A,ze.enabled=Y,ze.autoUpdate=ne,ze.needsUpdate=ie,ze.type=W}function xe(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function pe(A){const Y=A.target;Y.removeEventListener("dispose",pe),We(Y)}function We(A){ut(A),Ge.remove(A)}function ut(A){const Y=Ge.get(A).programs;Y!==void 0&&(Y.forEach(function(ne){de.releaseProgram(ne)}),A.isShaderMaterial&&de.releaseShaderCache(A))}this.renderBufferDirect=function(A,Y,ne,ie,W,Se){Y===null&&(Y=Ne);const Ce=W.isMesh&&W.matrixWorld.determinant()<0,ke=Ii(A,Y,ne,ie,W);Ve.setMaterial(ie,Ce);let Ie=ne.index,nt=1;if(ie.wireframe===!0){if(Ie=T.getWireframeAttribute(ne),Ie===void 0)return;nt=2}const st=ne.drawRange,Ze=ne.attributes.position;let ot=st.start*nt,Rt=(st.start+st.count)*nt;Se!==null&&(ot=Math.max(ot,Se.start*nt),Rt=Math.min(Rt,(Se.start+Se.count)*nt)),Ie!==null?(ot=Math.max(ot,0),Rt=Math.min(Rt,Ie.count)):Ze!=null&&(ot=Math.max(ot,0),Rt=Math.min(Rt,Ze.count));const Et=Rt-ot;if(Et<0||Et===1/0)return;Re.setup(W,ie,ke,ne,Ie);let Nt,bt=Pe;if(Ie!==null&&(Nt=P.get(Ie),bt=rt,bt.setIndex(Nt)),W.isMesh)ie.wireframe===!0?(Ve.setLineWidth(ie.wireframeLinewidth*Qt()),bt.setMode(N.LINES)):bt.setMode(N.TRIANGLES);else if(W.isLine){let Je=ie.linewidth;Je===void 0&&(Je=1),Ve.setLineWidth(Je*Qt()),W.isLineSegments?bt.setMode(N.LINES):W.isLineLoop?bt.setMode(N.LINE_LOOP):bt.setMode(N.LINE_STRIP)}else W.isPoints?bt.setMode(N.POINTS):W.isSprite&&bt.setMode(N.TRIANGLES);if(W.isBatchedMesh)if(W._multiDrawInstances!==null)sa("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),bt.renderMultiDrawInstances(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount,W._multiDrawInstances);else if(ct.get("WEBGL_multi_draw"))bt.renderMultiDraw(W._multiDrawStarts,W._multiDrawCounts,W._multiDrawCount);else{const Je=W._multiDrawStarts,Lt=W._multiDrawCounts,gt=W._multiDrawCount,Jt=Ie?P.get(Ie).bytesPerElement:1,oi=Ge.get(ie).currentProgram.getUniforms();for(let En=0;En<gt;En++)oi.setValue(N,"_gl_DrawID",En),bt.render(Je[En]/Jt,Lt[En])}else if(W.isInstancedMesh)bt.renderInstances(ot,Et,W.count);else if(ne.isInstancedBufferGeometry){const Je=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,Lt=Math.min(ne.instanceCount,Je);bt.renderInstances(ot,Et,Lt)}else bt.render(ot,Et)};function Ct(A,Y,ne){A.transparent===!0&&A.side===$i&&A.forceSinglePass===!1?(A.side=Bn,A.needsUpdate=!0,hs(A,Y,ne),A.side=Pr,A.needsUpdate=!0,hs(A,Y,ne),A.side=$i):hs(A,Y,ne)}this.compile=function(A,Y,ne=null){ne===null&&(ne=A),_=$e.get(ne),_.init(Y),L.push(_),ne.traverseVisible(function(W){W.isLight&&W.layers.test(Y.layers)&&(_.pushLight(W),W.castShadow&&_.pushShadow(W))}),A!==ne&&A.traverseVisible(function(W){W.isLight&&W.layers.test(Y.layers)&&(_.pushLight(W),W.castShadow&&_.pushShadow(W))}),_.setupLights();const ie=new Set;return A.traverse(function(W){if(!(W.isMesh||W.isPoints||W.isLine||W.isSprite))return;const Se=W.material;if(Se)if(Array.isArray(Se))for(let Ce=0;Ce<Se.length;Ce++){const ke=Se[Ce];Ct(ke,ne,W),ie.add(ke)}else Ct(Se,ne,W),ie.add(Se)}),_=L.pop(),ie},this.compileAsync=function(A,Y,ne=null){const ie=this.compile(A,Y,ne);return new Promise(W=>{function Se(){if(ie.forEach(function(Ce){Ge.get(Ce).currentProgram.isReady()&&ie.delete(Ce)}),ie.size===0){W(A);return}setTimeout(Se,10)}ct.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let Mt=null;function Qn(A){Mt&&Mt(A)}function pn(){Hn.stop()}function fs(){Hn.start()}const Hn=new Gg;Hn.setAnimationLoop(Qn),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(A){Mt=A,ye.setAnimationLoop(A),A===null?Hn.stop():Hn.start()},ye.addEventListener("sessionstart",pn),ye.addEventListener("sessionend",fs),this.render=function(A,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(z===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),ye.enabled===!0&&ye.isPresenting===!0&&(ye.cameraAutoUpdate===!0&&ye.updateCamera(Y),Y=ye.getCamera()),A.isScene===!0&&A.onBeforeRender(b,A,Y,X),_=$e.get(A,L.length),_.init(Y),L.push(_),fe.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Xe.setFromProjectionMatrix(fe,Ai,Y.reversedDepth),ee=this.localClippingEnabled,He=we.init(this.clippingPlanes,ee),y=le.get(A,I.length),y.init(),I.push(y),ye.enabled===!0&&ye.isPresenting===!0){const Se=b.xr.getDepthSensingMesh();Se!==null&&co(Se,Y,-1/0,b.sortObjects)}co(A,Y,0,b.sortObjects),y.finish(),b.sortObjects===!0&&y.sort(ce,se),pt=ye.enabled===!1||ye.isPresenting===!1||ye.hasDepthSensing()===!1,pt&&Ke.addToRenderList(y,A),this.info.render.frame++,He===!0&&we.beginShadows();const ne=_.state.shadowsArray;ze.render(ne,A,Y),He===!0&&we.endShadows(),this.info.autoReset===!0&&this.info.reset();const ie=y.opaque,W=y.transmissive;if(_.setupLights(),Y.isArrayCamera){const Se=Y.cameras;if(W.length>0)for(let Ce=0,ke=Se.length;Ce<ke;Ce++){const Ie=Se[Ce];Dr(ie,W,A,Ie)}pt&&Ke.render(A);for(let Ce=0,ke=Se.length;Ce<ke;Ce++){const Ie=Se[Ce];Qi(y,A,Ie,Ie.viewport)}}else W.length>0&&Dr(ie,W,A,Y),pt&&Ke.render(A),Qi(y,A,Y);X!==null&&O===0&&(lt.updateMultisampleRenderTarget(X),lt.updateRenderTargetMipmap(X)),A.isScene===!0&&A.onAfterRender(b,A,Y),Re.resetDefaultState(),C=-1,R=null,L.pop(),L.length>0?(_=L[L.length-1],He===!0&&we.setGlobalState(b.clippingPlanes,_.state.camera)):_=null,I.pop(),I.length>0?y=I[I.length-1]:y=null};function co(A,Y,ne,ie){if(A.visible===!1)return;if(A.layers.test(Y.layers)){if(A.isGroup)ne=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(Y);else if(A.isLight)_.pushLight(A),A.castShadow&&_.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Xe.intersectsSprite(A)){ie&&Le.setFromMatrixPosition(A.matrixWorld).applyMatrix4(fe);const Ce=Z.update(A),ke=A.material;ke.visible&&y.push(A,Ce,ke,ne,Le.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Xe.intersectsObject(A))){const Ce=Z.update(A),ke=A.material;if(ie&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Le.copy(A.boundingSphere.center)):(Ce.boundingSphere===null&&Ce.computeBoundingSphere(),Le.copy(Ce.boundingSphere.center)),Le.applyMatrix4(A.matrixWorld).applyMatrix4(fe)),Array.isArray(ke)){const Ie=Ce.groups;for(let nt=0,st=Ie.length;nt<st;nt++){const Ze=Ie[nt],ot=ke[Ze.materialIndex];ot&&ot.visible&&y.push(A,Ce,ot,ne,Le.z,Ze)}}else ke.visible&&y.push(A,Ce,ke,ne,Le.z,null)}}const Se=A.children;for(let Ce=0,ke=Se.length;Ce<ke;Ce++)co(Se[Ce],Y,ne,ie)}function Qi(A,Y,ne,ie){const W=A.opaque,Se=A.transmissive,Ce=A.transparent;_.setupLightsView(ne),He===!0&&we.setGlobalState(b.clippingPlanes,ne),ie&&Ve.viewport(B.copy(ie)),W.length>0&&Di(W,Y,ne),Se.length>0&&Di(Se,Y,ne),Ce.length>0&&Di(Ce,Y,ne),Ve.buffers.depth.setTest(!0),Ve.buffers.depth.setMask(!0),Ve.buffers.color.setMask(!0),Ve.setPolygonOffset(!1)}function Dr(A,Y,ne,ie){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;_.state.transmissionRenderTarget[ie.id]===void 0&&(_.state.transmissionRenderTarget[ie.id]=new cs(1,1,{generateMipmaps:!0,type:ct.has("EXT_color_buffer_half_float")||ct.has("EXT_color_buffer_float")?la:bi,minFilter:ss,samples:4,stencilBuffer:l,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:At.workingColorSpace}));const Se=_.state.transmissionRenderTarget[ie.id],Ce=ie.viewport||B;Se.setSize(Ce.z*b.transmissionResolutionScale,Ce.w*b.transmissionResolutionScale);const ke=b.getRenderTarget(),Ie=b.getActiveCubeFace(),nt=b.getActiveMipmapLevel();b.setRenderTarget(Se),b.getClearColor(ue),ae=b.getClearAlpha(),ae<1&&b.setClearColor(16777215,.5),b.clear(),pt&&Ke.render(ne);const st=b.toneMapping;b.toneMapping=br;const Ze=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),_.setupLightsView(ie),He===!0&&we.setGlobalState(b.clippingPlanes,ie),Di(A,ne,ie),lt.updateMultisampleRenderTarget(Se),lt.updateRenderTargetMipmap(Se),ct.has("WEBGL_multisampled_render_to_texture")===!1){let ot=!1;for(let Rt=0,Et=Y.length;Rt<Et;Rt++){const Nt=Y[Rt],bt=Nt.object,Je=Nt.geometry,Lt=Nt.material,gt=Nt.group;if(Lt.side===$i&&bt.layers.test(ie.layers)){const Jt=Lt.side;Lt.side=Bn,Lt.needsUpdate=!0,ds(bt,ne,ie,Je,Lt,gt),Lt.side=Jt,Lt.needsUpdate=!0,ot=!0}}ot===!0&&(lt.updateMultisampleRenderTarget(Se),lt.updateRenderTargetMipmap(Se))}b.setRenderTarget(ke,Ie,nt),b.setClearColor(ue,ae),Ze!==void 0&&(ie.viewport=Ze),b.toneMapping=st}function Di(A,Y,ne){const ie=Y.isScene===!0?Y.overrideMaterial:null;for(let W=0,Se=A.length;W<Se;W++){const Ce=A[W],ke=Ce.object,Ie=Ce.geometry,nt=Ce.group;let st=Ce.material;st.allowOverride===!0&&ie!==null&&(st=ie),ke.layers.test(ne.layers)&&ds(ke,Y,ne,Ie,st,nt)}}function ds(A,Y,ne,ie,W,Se){A.onBeforeRender(b,Y,ne,ie,W,Se),A.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),W.onBeforeRender(b,Y,ne,ie,A,Se),W.transparent===!0&&W.side===$i&&W.forceSinglePass===!1?(W.side=Bn,W.needsUpdate=!0,b.renderBufferDirect(ne,Y,ie,W,A,Se),W.side=Pr,W.needsUpdate=!0,b.renderBufferDirect(ne,Y,ie,W,A,Se),W.side=$i):b.renderBufferDirect(ne,Y,ie,W,A,Se),A.onAfterRender(b,Y,ne,ie,W,Se)}function hs(A,Y,ne){Y.isScene!==!0&&(Y=Ne);const ie=Ge.get(A),W=_.state.lights,Se=_.state.shadowsArray,Ce=W.state.version,ke=de.getParameters(A,W.state,Se,Y,ne),Ie=de.getProgramCacheKey(ke);let nt=ie.programs;ie.environment=A.isMeshStandardMaterial?Y.environment:null,ie.fog=Y.fog,ie.envMap=(A.isMeshStandardMaterial?kt:zt).get(A.envMap||ie.environment),ie.envMapRotation=ie.environment!==null&&A.envMap===null?Y.environmentRotation:A.envMapRotation,nt===void 0&&(A.addEventListener("dispose",pe),nt=new Map,ie.programs=nt);let st=nt.get(Ie);if(st!==void 0){if(ie.currentProgram===st&&ie.lightsStateVersion===Ce)return da(A,ke),st}else ke.uniforms=de.getUniforms(A),A.onBeforeCompile(ke,b),st=de.acquireProgram(ke,Ie),nt.set(Ie,st),ie.uniforms=ke.uniforms;const Ze=ie.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ze.clippingPlanes=we.uniform),da(A,ke),ie.needsLights=pa(A),ie.lightsStateVersion=Ce,ie.needsLights&&(Ze.ambientLightColor.value=W.state.ambient,Ze.lightProbe.value=W.state.probe,Ze.directionalLights.value=W.state.directional,Ze.directionalLightShadows.value=W.state.directionalShadow,Ze.spotLights.value=W.state.spot,Ze.spotLightShadows.value=W.state.spotShadow,Ze.rectAreaLights.value=W.state.rectArea,Ze.ltc_1.value=W.state.rectAreaLTC1,Ze.ltc_2.value=W.state.rectAreaLTC2,Ze.pointLights.value=W.state.point,Ze.pointLightShadows.value=W.state.pointShadow,Ze.hemisphereLights.value=W.state.hemi,Ze.directionalShadowMap.value=W.state.directionalShadowMap,Ze.directionalShadowMatrix.value=W.state.directionalShadowMatrix,Ze.spotShadowMap.value=W.state.spotShadowMap,Ze.spotLightMatrix.value=W.state.spotLightMatrix,Ze.spotLightMap.value=W.state.spotLightMap,Ze.pointShadowMap.value=W.state.pointShadowMap,Ze.pointShadowMatrix.value=W.state.pointShadowMatrix),ie.currentProgram=st,ie.uniformsList=null,st}function fa(A){if(A.uniformsList===null){const Y=A.currentProgram.getUniforms();A.uniformsList=ql.seqWithValue(Y.seq,A.uniforms)}return A.uniformsList}function da(A,Y){const ne=Ge.get(A);ne.outputColorSpace=Y.outputColorSpace,ne.batching=Y.batching,ne.batchingColor=Y.batchingColor,ne.instancing=Y.instancing,ne.instancingColor=Y.instancingColor,ne.instancingMorph=Y.instancingMorph,ne.skinning=Y.skinning,ne.morphTargets=Y.morphTargets,ne.morphNormals=Y.morphNormals,ne.morphColors=Y.morphColors,ne.morphTargetsCount=Y.morphTargetsCount,ne.numClippingPlanes=Y.numClippingPlanes,ne.numIntersection=Y.numClipIntersection,ne.vertexAlphas=Y.vertexAlphas,ne.vertexTangents=Y.vertexTangents,ne.toneMapping=Y.toneMapping}function Ii(A,Y,ne,ie,W){Y.isScene!==!0&&(Y=Ne),lt.resetTextureUnits();const Se=Y.fog,Ce=ie.isMeshStandardMaterial?Y.environment:null,ke=X===null?b.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:io,Ie=(ie.isMeshStandardMaterial?kt:zt).get(ie.envMap||Ce),nt=ie.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,st=!!ne.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),Ze=!!ne.morphAttributes.position,ot=!!ne.morphAttributes.normal,Rt=!!ne.morphAttributes.color;let Et=br;ie.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Et=b.toneMapping);const Nt=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,bt=Nt!==void 0?Nt.length:0,Je=Ge.get(ie),Lt=_.state.lights;if(He===!0&&(ee===!0||A!==R)){const Yt=A===R&&ie.id===C;we.setState(ie,A,Yt)}let gt=!1;ie.version===Je.__version?(Je.needsLights&&Je.lightsStateVersion!==Lt.state.version||Je.outputColorSpace!==ke||W.isBatchedMesh&&Je.batching===!1||!W.isBatchedMesh&&Je.batching===!0||W.isBatchedMesh&&Je.batchingColor===!0&&W.colorTexture===null||W.isBatchedMesh&&Je.batchingColor===!1&&W.colorTexture!==null||W.isInstancedMesh&&Je.instancing===!1||!W.isInstancedMesh&&Je.instancing===!0||W.isSkinnedMesh&&Je.skinning===!1||!W.isSkinnedMesh&&Je.skinning===!0||W.isInstancedMesh&&Je.instancingColor===!0&&W.instanceColor===null||W.isInstancedMesh&&Je.instancingColor===!1&&W.instanceColor!==null||W.isInstancedMesh&&Je.instancingMorph===!0&&W.morphTexture===null||W.isInstancedMesh&&Je.instancingMorph===!1&&W.morphTexture!==null||Je.envMap!==Ie||ie.fog===!0&&Je.fog!==Se||Je.numClippingPlanes!==void 0&&(Je.numClippingPlanes!==we.numPlanes||Je.numIntersection!==we.numIntersection)||Je.vertexAlphas!==nt||Je.vertexTangents!==st||Je.morphTargets!==Ze||Je.morphNormals!==ot||Je.morphColors!==Rt||Je.toneMapping!==Et||Je.morphTargetsCount!==bt)&&(gt=!0):(gt=!0,Je.__version=ie.version);let Jt=Je.currentProgram;gt===!0&&(Jt=hs(ie,Y,W));let oi=!1,En=!1,Ir=!1;const Ft=Jt.getUniforms(),Tn=Je.uniforms;if(Ve.useProgram(Jt.program)&&(oi=!0,En=!0,Ir=!0),ie.id!==C&&(C=ie.id,En=!0),oi||R!==A){Ve.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),Ft.setValue(N,"projectionMatrix",A.projectionMatrix),Ft.setValue(N,"viewMatrix",A.matrixWorldInverse);const gn=Ft.map.cameraPosition;gn!==void 0&&gn.setValue(N,Me.setFromMatrixPosition(A.matrixWorld)),it.logarithmicDepthBuffer&&Ft.setValue(N,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Ft.setValue(N,"isOrthographic",A.isOrthographicCamera===!0),R!==A&&(R=A,En=!0,Ir=!0)}if(W.isSkinnedMesh){Ft.setOptional(N,W,"bindMatrix"),Ft.setOptional(N,W,"bindMatrixInverse");const Yt=W.skeleton;Yt&&(Yt.boneTexture===null&&Yt.computeBoneTexture(),Ft.setValue(N,"boneTexture",Yt.boneTexture,lt))}W.isBatchedMesh&&(Ft.setOptional(N,W,"batchingTexture"),Ft.setValue(N,"batchingTexture",W._matricesTexture,lt),Ft.setOptional(N,W,"batchingIdTexture"),Ft.setValue(N,"batchingIdTexture",W._indirectTexture,lt),Ft.setOptional(N,W,"batchingColorTexture"),W._colorsTexture!==null&&Ft.setValue(N,"batchingColorTexture",W._colorsTexture,lt));const mn=ne.morphAttributes;if((mn.position!==void 0||mn.normal!==void 0||mn.color!==void 0)&&Ee.update(W,ne,Jt),(En||Je.receiveShadow!==W.receiveShadow)&&(Je.receiveShadow=W.receiveShadow,Ft.setValue(N,"receiveShadow",W.receiveShadow)),ie.isMeshGouraudMaterial&&ie.envMap!==null&&(Tn.envMap.value=Ie,Tn.flipEnvMap.value=Ie.isCubeTexture&&Ie.isRenderTargetTexture===!1?-1:1),ie.isMeshStandardMaterial&&ie.envMap===null&&Y.environment!==null&&(Tn.envMapIntensity.value=Y.environmentIntensity),En&&(Ft.setValue(N,"toneMappingExposure",b.toneMappingExposure),Je.needsLights&&ha(Tn,Ir),Se&&ie.fog===!0&&ge.refreshFogUniforms(Tn,Se),ge.refreshMaterialUniforms(Tn,ie,H,he,_.state.transmissionRenderTarget[A.id]),ql.upload(N,fa(Je),Tn,lt)),ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(ql.upload(N,fa(Je),Tn,lt),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Ft.setValue(N,"center",W.center),Ft.setValue(N,"modelViewMatrix",W.modelViewMatrix),Ft.setValue(N,"normalMatrix",W.normalMatrix),Ft.setValue(N,"modelMatrix",W.matrixWorld),ie.isShaderMaterial||ie.isRawShaderMaterial){const Yt=ie.uniformsGroups;for(let gn=0,Ur=Yt.length;gn<Ur;gn++){const vt=Yt[gn];ft.update(vt,Jt),ft.bind(vt,Jt)}}return Jt}function ha(A,Y){A.ambientLightColor.needsUpdate=Y,A.lightProbe.needsUpdate=Y,A.directionalLights.needsUpdate=Y,A.directionalLightShadows.needsUpdate=Y,A.pointLights.needsUpdate=Y,A.pointLightShadows.needsUpdate=Y,A.spotLights.needsUpdate=Y,A.spotLightShadows.needsUpdate=Y,A.rectAreaLights.needsUpdate=Y,A.hemisphereLights.needsUpdate=Y}function pa(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return F},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(A,Y,ne){const ie=Ge.get(A);ie.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,ie.__autoAllocateDepthBuffer===!1&&(ie.__useRenderToTexture=!1),Ge.get(A.texture).__webglTexture=Y,Ge.get(A.depthTexture).__webglTexture=ie.__autoAllocateDepthBuffer?void 0:ne,ie.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,Y){const ne=Ge.get(A);ne.__webglFramebuffer=Y,ne.__useDefaultFramebuffer=Y===void 0};const ou=N.createFramebuffer();this.setRenderTarget=function(A,Y=0,ne=0){X=A,F=Y,O=ne;let ie=!0,W=null,Se=!1,Ce=!1;if(A){const Ie=Ge.get(A);if(Ie.__useDefaultFramebuffer!==void 0)Ve.bindFramebuffer(N.FRAMEBUFFER,null),ie=!1;else if(Ie.__webglFramebuffer===void 0)lt.setupRenderTarget(A);else if(Ie.__hasExternalTextures)lt.rebindTextures(A,Ge.get(A.texture).__webglTexture,Ge.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Ze=A.depthTexture;if(Ie.__boundDepthTexture!==Ze){if(Ze!==null&&Ge.has(Ze)&&(A.width!==Ze.image.width||A.height!==Ze.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");lt.setupDepthRenderbuffer(A)}}const nt=A.texture;(nt.isData3DTexture||nt.isDataArrayTexture||nt.isCompressedArrayTexture)&&(Ce=!0);const st=Ge.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(st[Y])?W=st[Y][ne]:W=st[Y],Se=!0):A.samples>0&&lt.useMultisampledRTT(A)===!1?W=Ge.get(A).__webglMultisampledFramebuffer:Array.isArray(st)?W=st[ne]:W=st,B.copy(A.viewport),$.copy(A.scissor),te=A.scissorTest}else B.copy(U).multiplyScalar(H).floor(),$.copy(re).multiplyScalar(H).floor(),te=Fe;if(ne!==0&&(W=ou),Ve.bindFramebuffer(N.FRAMEBUFFER,W)&&ie&&Ve.drawBuffers(A,W),Ve.viewport(B),Ve.scissor($),Ve.setScissorTest(te),Se){const Ie=Ge.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_CUBE_MAP_POSITIVE_X+Y,Ie.__webglTexture,ne)}else if(Ce){const Ie=Y;for(let nt=0;nt<A.textures.length;nt++){const st=Ge.get(A.textures[nt]);N.framebufferTextureLayer(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0+nt,st.__webglTexture,ne,Ie)}}else if(A!==null&&ne!==0){const Ie=Ge.get(A.texture);N.framebufferTexture2D(N.FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Ie.__webglTexture,ne)}C=-1},this.readRenderTargetPixels=function(A,Y,ne,ie,W,Se,Ce,ke=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ie=Ge.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie){Ve.bindFramebuffer(N.FRAMEBUFFER,Ie);try{const nt=A.textures[ke],st=nt.format,Ze=nt.type;if(!it.textureFormatReadable(st)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!it.textureTypeReadable(Ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=A.width-ie&&ne>=0&&ne<=A.height-W&&(A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ke),N.readPixels(Y,ne,ie,W,Ye.convert(st),Ye.convert(Ze),Se))}finally{const nt=X!==null?Ge.get(X).__webglFramebuffer:null;Ve.bindFramebuffer(N.FRAMEBUFFER,nt)}}},this.readRenderTargetPixelsAsync=async function(A,Y,ne,ie,W,Se,Ce,ke=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ie=Ge.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&Ce!==void 0&&(Ie=Ie[Ce]),Ie)if(Y>=0&&Y<=A.width-ie&&ne>=0&&ne<=A.height-W){Ve.bindFramebuffer(N.FRAMEBUFFER,Ie);const nt=A.textures[ke],st=nt.format,Ze=nt.type;if(!it.textureFormatReadable(st))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!it.textureTypeReadable(Ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const ot=N.createBuffer();N.bindBuffer(N.PIXEL_PACK_BUFFER,ot),N.bufferData(N.PIXEL_PACK_BUFFER,Se.byteLength,N.STREAM_READ),A.textures.length>1&&N.readBuffer(N.COLOR_ATTACHMENT0+ke),N.readPixels(Y,ne,ie,W,Ye.convert(st),Ye.convert(Ze),0);const Rt=X!==null?Ge.get(X).__webglFramebuffer:null;Ve.bindFramebuffer(N.FRAMEBUFFER,Rt);const Et=N.fenceSync(N.SYNC_GPU_COMMANDS_COMPLETE,0);return N.flush(),await W_(N,Et,4),N.bindBuffer(N.PIXEL_PACK_BUFFER,ot),N.getBufferSubData(N.PIXEL_PACK_BUFFER,0,Se),N.deleteBuffer(ot),N.deleteSync(Et),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,Y=null,ne=0){const ie=Math.pow(2,-ne),W=Math.floor(A.image.width*ie),Se=Math.floor(A.image.height*ie),Ce=Y!==null?Y.x:0,ke=Y!==null?Y.y:0;lt.setTexture2D(A,0),N.copyTexSubImage2D(N.TEXTURE_2D,ne,0,0,Ce,ke,W,Se),Ve.unbindTexture()};const ma=N.createFramebuffer(),ga=N.createFramebuffer();this.copyTextureToTexture=function(A,Y,ne=null,ie=null,W=0,Se=null){Se===null&&(W!==0?(sa("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),Se=W,W=0):Se=0);let Ce,ke,Ie,nt,st,Ze,ot,Rt,Et;const Nt=A.isCompressedTexture?A.mipmaps[Se]:A.image;if(ne!==null)Ce=ne.max.x-ne.min.x,ke=ne.max.y-ne.min.y,Ie=ne.isBox3?ne.max.z-ne.min.z:1,nt=ne.min.x,st=ne.min.y,Ze=ne.isBox3?ne.min.z:0;else{const mn=Math.pow(2,-W);Ce=Math.floor(Nt.width*mn),ke=Math.floor(Nt.height*mn),A.isDataArrayTexture?Ie=Nt.depth:A.isData3DTexture?Ie=Math.floor(Nt.depth*mn):Ie=1,nt=0,st=0,Ze=0}ie!==null?(ot=ie.x,Rt=ie.y,Et=ie.z):(ot=0,Rt=0,Et=0);const bt=Ye.convert(Y.format),Je=Ye.convert(Y.type);let Lt;Y.isData3DTexture?(lt.setTexture3D(Y,0),Lt=N.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(lt.setTexture2DArray(Y,0),Lt=N.TEXTURE_2D_ARRAY):(lt.setTexture2D(Y,0),Lt=N.TEXTURE_2D),N.pixelStorei(N.UNPACK_FLIP_Y_WEBGL,Y.flipY),N.pixelStorei(N.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),N.pixelStorei(N.UNPACK_ALIGNMENT,Y.unpackAlignment);const gt=N.getParameter(N.UNPACK_ROW_LENGTH),Jt=N.getParameter(N.UNPACK_IMAGE_HEIGHT),oi=N.getParameter(N.UNPACK_SKIP_PIXELS),En=N.getParameter(N.UNPACK_SKIP_ROWS),Ir=N.getParameter(N.UNPACK_SKIP_IMAGES);N.pixelStorei(N.UNPACK_ROW_LENGTH,Nt.width),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Nt.height),N.pixelStorei(N.UNPACK_SKIP_PIXELS,nt),N.pixelStorei(N.UNPACK_SKIP_ROWS,st),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ze);const Ft=A.isDataArrayTexture||A.isData3DTexture,Tn=Y.isDataArrayTexture||Y.isData3DTexture;if(A.isDepthTexture){const mn=Ge.get(A),Yt=Ge.get(Y),gn=Ge.get(mn.__renderTarget),Ur=Ge.get(Yt.__renderTarget);Ve.bindFramebuffer(N.READ_FRAMEBUFFER,gn.__webglFramebuffer),Ve.bindFramebuffer(N.DRAW_FRAMEBUFFER,Ur.__webglFramebuffer);for(let vt=0;vt<Ie;vt++)Ft&&(N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ge.get(A).__webglTexture,W,Ze+vt),N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Ge.get(Y).__webglTexture,Se,Et+vt)),N.blitFramebuffer(nt,st,Ce,ke,ot,Rt,Ce,ke,N.DEPTH_BUFFER_BIT,N.NEAREST);Ve.bindFramebuffer(N.READ_FRAMEBUFFER,null),Ve.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else if(W!==0||A.isRenderTargetTexture||Ge.has(A)){const mn=Ge.get(A),Yt=Ge.get(Y);Ve.bindFramebuffer(N.READ_FRAMEBUFFER,ma),Ve.bindFramebuffer(N.DRAW_FRAMEBUFFER,ga);for(let gn=0;gn<Ie;gn++)Ft?N.framebufferTextureLayer(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,mn.__webglTexture,W,Ze+gn):N.framebufferTexture2D(N.READ_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,mn.__webglTexture,W),Tn?N.framebufferTextureLayer(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,Yt.__webglTexture,Se,Et+gn):N.framebufferTexture2D(N.DRAW_FRAMEBUFFER,N.COLOR_ATTACHMENT0,N.TEXTURE_2D,Yt.__webglTexture,Se),W!==0?N.blitFramebuffer(nt,st,Ce,ke,ot,Rt,Ce,ke,N.COLOR_BUFFER_BIT,N.NEAREST):Tn?N.copyTexSubImage3D(Lt,Se,ot,Rt,Et+gn,nt,st,Ce,ke):N.copyTexSubImage2D(Lt,Se,ot,Rt,nt,st,Ce,ke);Ve.bindFramebuffer(N.READ_FRAMEBUFFER,null),Ve.bindFramebuffer(N.DRAW_FRAMEBUFFER,null)}else Tn?A.isDataTexture||A.isData3DTexture?N.texSubImage3D(Lt,Se,ot,Rt,Et,Ce,ke,Ie,bt,Je,Nt.data):Y.isCompressedArrayTexture?N.compressedTexSubImage3D(Lt,Se,ot,Rt,Et,Ce,ke,Ie,bt,Nt.data):N.texSubImage3D(Lt,Se,ot,Rt,Et,Ce,ke,Ie,bt,Je,Nt):A.isDataTexture?N.texSubImage2D(N.TEXTURE_2D,Se,ot,Rt,Ce,ke,bt,Je,Nt.data):A.isCompressedTexture?N.compressedTexSubImage2D(N.TEXTURE_2D,Se,ot,Rt,Nt.width,Nt.height,bt,Nt.data):N.texSubImage2D(N.TEXTURE_2D,Se,ot,Rt,Ce,ke,bt,Je,Nt);N.pixelStorei(N.UNPACK_ROW_LENGTH,gt),N.pixelStorei(N.UNPACK_IMAGE_HEIGHT,Jt),N.pixelStorei(N.UNPACK_SKIP_PIXELS,oi),N.pixelStorei(N.UNPACK_SKIP_ROWS,En),N.pixelStorei(N.UNPACK_SKIP_IMAGES,Ir),Se===0&&Y.generateMipmaps&&N.generateMipmap(Lt),Ve.unbindTexture()},this.initRenderTarget=function(A){Ge.get(A).__webglFramebuffer===void 0&&lt.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?lt.setTextureCube(A,0):A.isData3DTexture?lt.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?lt.setTexture2DArray(A,0):lt.setTexture2D(A,0),Ve.unbindTexture()},this.resetState=function(){F=0,O=0,X=null,Ve.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ai}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=At._getDrawingBufferColorSpace(e),t.unpackColorSpace=At._getUnpackColorSpace()}}function qg(s,e=!1){const t=s[0].index!==null,r=new Set(Object.keys(s[0].attributes)),a=new Set(Object.keys(s[0].morphAttributes)),l={},c={},f=s[0].morphTargetsRelative,h=new Zn;let p=0;for(let g=0;g<s.length;++g){const v=s[g];let x=0;if(t!==(v.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+g+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const S in v.attributes){if(!r.has(S))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+g+'. All geometries must have compatible attributes; make sure "'+S+'" attribute exists among all geometries, or in none of them.'),null;l[S]===void 0&&(l[S]=[]),l[S].push(v.attributes[S]),x++}if(x!==r.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+g+". Make sure all geometries have the same number of attributes."),null;if(f!==v.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+g+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const S in v.morphAttributes){if(!a.has(S))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+g+".  .morphAttributes must be consistent throughout all geometries."),null;c[S]===void 0&&(c[S]=[]),c[S].push(v.morphAttributes[S])}if(e){let S;if(t)S=v.index.count;else if(v.attributes.position!==void 0)S=v.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+g+". The geometry must have either an index or a position attribute"),null;h.addGroup(p,S,g),p+=S}}if(t){let g=0;const v=[];for(let x=0;x<s.length;++x){const S=s[x].index;for(let M=0;M<S.count;++M)v.push(S.getX(M)+g);g+=s[x].attributes.position.count}h.setIndex(v)}for(const g in l){const v=lg(l[g]);if(!v)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+g+" attribute."),null;h.setAttribute(g,v)}for(const g in c){const v=c[g][0].length;if(v===0)break;h.morphAttributes=h.morphAttributes||{},h.morphAttributes[g]=[];for(let x=0;x<v;++x){const S=[];for(let w=0;w<c[g].length;++w)S.push(c[g][w][x]);const M=lg(S);if(!M)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+g+" morphAttribute."),null;h.morphAttributes[g].push(M)}}return h}function lg(s){let e,t,r,a=-1,l=0;for(let p=0;p<s.length;++p){const g=s[p];if(e===void 0&&(e=g.array.constructor),e!==g.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=g.itemSize),t!==g.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(r===void 0&&(r=g.normalized),r!==g.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(a===-1&&(a=g.gpuType),a!==g.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;l+=g.count*t}const c=new e(l),f=new xi(c,t,r);let h=0;for(let p=0;p<s.length;++p){const g=s[p];if(g.isInterleavedBufferAttribute){const v=h/t;for(let x=0,S=g.count;x<S;x++)for(let M=0;M<t;M++){const w=g.getComponent(x,M);f.setComponent(x+v,M,w)}}else c.set(g.array,h);h+=g.count*t}return a!==void 0&&(f.gpuType=a),f}const Pn={ak:{id:"ak",name:"AK-47",slot:"primary",damage:36,rpm:600,magazine:30,reserve:90,reload:2.5,spread:.013,recoil:.055,range:100,automatic:!0,color:10249268},m4:{id:"m4",name:"M4A4",slot:"primary",damage:31,rpm:666,magazine:30,reserve:90,reload:2.35,spread:.009,recoil:.028,range:105,automatic:!0,color:4541522},awp:{id:"awp",name:"AWP",slot:"primary",damage:160,rpm:41,magazine:10,reserve:30,reload:3.4,spread:.002,recoil:.14,range:150,automatic:!1,color:5530187},glock:{id:"glock",name:"Glock-18",slot:"secondary",damage:21,rpm:400,magazine:20,reserve:100,reload:1.9,spread:.016,recoil:.021,range:60,automatic:!1,color:3685176},usp:{id:"usp",name:"USP-S",slot:"secondary",damage:24,rpm:360,magazine:12,reserve:60,reload:2.1,spread:.012,recoil:.022,range:70,automatic:!1,color:4015177},deagle:{id:"deagle",name:"Desert Eagle",slot:"secondary",damage:28,rpm:220,magazine:7,reserve:35,reload:2.2,spread:.02,recoil:.072,range:80,automatic:!1,color:10261381},knife:{id:"knife",name:"战术匕首",slot:"melee",damage:48,rpm:100,magazine:1,reserve:0,reload:0,spread:0,recoil:0,range:2.3,automatic:!1,color:12371134}},$n=(s,e=0,t=.84)=>new nn({color:s,metalness:e,roughness:t}),fd=$n(2370348);function Ar(s,e,t,r,a,l){const c=new $t(e,t);return c.position.set(r,a,l),c.castShadow=!0,c.receiveShadow=!0,s.add(c),c}function _t(s,e,t,r,a,l,c,f){return Ar(s,new Li(e,t,r),a,l,c,f)}function $g(s,e=()=>!1){const t=new Map;for(const r of s.children){if(!(r instanceof $t)||Array.isArray(r.material)||e(r))continue;const a=t.get(r.material)??[];a.push(r),t.set(r.material,a)}for(const[r,a]of t){if(a.length<2)continue;const l=a.map(f=>(f.updateMatrix(),f.geometry.clone().applyMatrix4(f.matrix))),c=qg(l,!1);if(c){for(const h of a)s.remove(h);const f=new $t(c,r);f.castShadow=!0,f.receiveShadow=!0,s.add(f)}l.forEach(f=>f.dispose())}}function dd(s,e=!1){const t=new Rr,r=Pn[s],a=$n(r.color,s==="deagle"?.5:.25,.57),l=$n(2106662,.52,.5),c=$n(s==="ak"?7291423:s==="awp"?6845277:4739153,.12,.7),f=$n(10199969,.68,.35);if(s==="knife"){_t(t,.15,.16,.48,l,0,0,.2);const h=_t(t,.18,.055,.65,f,0,.04,-.33);h.rotation.x=-.08;const p=Ar(t,new wd(.1,.25,4),f,0,.04,-.77);p.rotation.x=-Math.PI/2,_t(t,.3,.08,.1,l,0,.02,-.03)}else if(r.slot==="secondary"){_t(t,.22,.16,.43,a,0,.03,-.15),_t(t,.2,.11,.35,l,0,-.03,-.17);const h=_t(t,.17,.32,.15,l,0,-.21,.02);h.rotation.x=-.28,_t(t,.13,.08,.22,s==="deagle"?f:l,0,.04,-.48),_t(t,.07,.07,.045,f,0,.14,-.22),s==="usp"&&_t(t,.14,.11,.36,l,0,.02,-.72)}else{const h=s==="awp";_t(t,.22,.21,h?.8:.66,a,0,0,-.34),_t(t,.2,.14,.4,c,0,-.035,h?-.85:-.78);const p=Ar(t,new os(.052,.06,h?1.3:.72,10),l,0,.025,h?-1.72:-1.3);p.rotation.x=Math.PI/2;const g=Ar(t,new os(.075,.075,.13,12),l,0,.025,h?-2.4:-1.72);g.rotation.x=Math.PI/2;const v=_t(t,.17,.2,.48,s==="ak"?c:a,0,-.025,.24);s==="ak"&&(v.rotation.x=.07);const x=_t(t,.15,.38,.17,l,0,-.27,-.12);x.rotation.x=-.15;const S=_t(t,.17,s==="awp"?.22:.43,.21,l,0,-.29,-.52);if(s==="ak"&&(S.rotation.x=-.2),_t(t,.09,.08,.08,f,0,.17,-.1),s==="awp"){const M=Ar(t,new os(.14,.14,.74,12),l,0,.32,-.38);M.rotation.x=Math.PI/2;for(const w of[-.76,.02]){const y=Ar(t,new os(.165,.165,.04,12),f,0,.32,w);y.rotation.x=Math.PI/2}_t(t,.08,.13,.22,l,0,.21,-.4)}}if(e){const h=$n(5068384),p=_t(t,.22,.23,.65,h,-.37,-.31,.36);p.rotation.y=-.31,p.rotation.x=-.17;const g=_t(t,.22,.23,.66,h,.32,-.31,.39);g.rotation.y=.23,g.rotation.x=-.16,_t(t,.21,.18,.22,fd,-.24,-.19,-.03),_t(t,.21,.18,.22,fd,.13,-.19,.09)}return $g(t),t}function f1(s,e){const t=new Rr,r=$n(s==="CT"?3425873:10125666),a=$n(s==="CT"?2570048:7233351),l=$n(s==="CT"?2503482:5786425),c=$n(s==="CT"?2438720:7759949),f=$n(2435114),h=$n(s==="CT"?12095088:10385755),p=Ar(t,new eu(.25,12,10),h,0,1.73,0);p.scale.z=.9,_t(t,.56,.67,.32,r,0,1.22,0),_t(t,.62,.52,.38,l,0,1.31,-.015),_t(t,.54,.17,.36,a,0,.82,0),_t(t,.15,.15,.36,l,-.35,1.19,0),_t(t,.15,.15,.36,l,.35,1.19,0);for(const v of[-1,1]){const x=v*.4,S=_t(t,.2,.43,.23,r,x,1.34,-.09);S.rotation.z=v*.32;const M=_t(t,.19,.4,.22,a,v*.4,1.04,-.3);M.rotation.x=-.72,M.rotation.z=-v*.35,_t(t,.17,.17,.2,fd,v*.31,.98,-.48);const w=_t(t,.23,.66,.25,c,v*.17,.51,0);w.name=v<0?"legL":"legR",_t(t,.25,.21,.38,f,v*.17,.13,-.085)}if(s==="CT"){const v=Ar(t,new eu(.265,12,8,0,Math.PI*2,0,Math.PI*.6),a,0,1.79,0);v.scale.z=1.04,_t(t,.51,.11,.2,l,0,1.72,-.18),_t(t,.33,.14,.04,$n(1778987,.25),0,1.73,-.233),_t(t,.17,.17,.07,l,0,1.52,-.23)}else{const v=_t(t,.47,.15,.38,a,0,1.52,.01);v.rotation.y=.13,_t(t,.48,.09,.25,l,0,1.88,.02),_t(t,.45,.12,.2,l,0,1.83,-.08),e%2===0&&_t(t,.5,.14,.09,a,0,1.56,-.2)}const g=dd(s==="CT"?"m4":"ak");return g.position.set(0,1.11,-.49),g.scale.setScalar(.64),t.add(g),$g(t,v=>v.name==="legL"||v.name==="legR"),{mesh:t,gunMesh:g}}function ug(s,e,t){const r=Math.min(t/4.5,1)*.34,a=s.mesh.getObjectByName("legL"),l=s.mesh.getObjectByName("legR");a&&(a.rotation.x=Math.sin(e*10+s.id)*r),l&&(l.rotation.x=-Math.sin(e*10+s.id)*r),s.gunMesh.rotation.x=Math.sin(e*10+s.id)*r*.16}class d1{constructor(){Qe(this,"ctx",null);Qe(this,"noise",null)}resume(){if(!this.ctx){this.ctx=new AudioContext;const e=this.ctx.createBuffer(1,this.ctx.sampleRate,this.ctx.sampleRate),t=e.getChannelData(0);for(let r=0;r<t.length;r++)t[r]=Math.random()*2-1;this.noise=e}this.ctx.state==="suspended"&&this.ctx.resume()}tone(e,t,r,a,l="sine",c=0){const f=this.ctx;if(!f)return;const h=f.createOscillator(),p=f.createGain(),g=f.currentTime+c;h.type=l,h.frequency.setValueAtTime(e,g),h.frequency.exponentialRampToValueAtTime(Math.max(20,t),g+r),p.gain.setValueAtTime(Math.max(1e-4,a),g),p.gain.exponentialRampToValueAtTime(1e-4,g+r),h.connect(p).connect(f.destination),h.start(g),h.stop(g+r+.01)}hiss(e,t,r,a=0){const l=this.ctx;if(!l||!this.noise)return;const c=l.createBufferSource(),f=l.createBiquadFilter(),h=l.createGain(),p=l.currentTime+a;c.buffer=this.noise,f.type="lowpass",f.frequency.value=r,h.gain.setValueAtTime(Math.max(1e-4,t),p),h.gain.exponentialRampToValueAtTime(1e-4,p+e),c.connect(f).connect(h).connect(l.destination),c.start(p),c.stop(p+e+.01)}shot(e,t=1){if(e==="knife"){this.hiss(.17,.14*t,1700),this.tone(240,90,.14,.08*t);return}const r=e==="awp",a=e==="ak"||e==="m4",l=(r?.58:a?.39:.24)*t;this.hiss(r?.62:a?.32:.18,l,r?1150:e==="ak"?1450:e==="m4"?2200:3300),this.tone(r?95:e==="ak"?135:e==="m4"?180:e==="deagle"?210:310,r?35:72,r?.52:a?.26:.15,l*.8,"sawtooth"),r&&this.hiss(.28,.14*t,500,.08)}reload(){this.hiss(.055,.09,3500),this.tone(790,370,.07,.065,"square",.02),this.tone(470,210,.1,.065,"square",.31)}footstep(){this.hiss(.085,.045,500),this.tone(90,48,.07,.022)}scope(){this.tone(850,460,.09,.07,"square"),this.tone(300,190,.08,.035,"sine",.06)}hit(){this.tone(800,460,.09,.075,"sine")}plant(){this.tone(420,530,.1,.075,"square"),this.tone(610,780,.13,.08,"square",.12)}defuse(){this.tone(780,580,.11,.08,"sine"),this.tone(980,1350,.22,.08,"sine",.13)}beep(){this.tone(920,730,.1,.09,"square")}explosion(){this.hiss(1.2,.55,450),this.tone(82,28,1.1,.48,"sawtooth")}kill(){this.tone(570,790,.1,.09,"sine"),this.tone(900,1170,.17,.09,"sine",.1)}}const as=-58,h1=46,ls=-54,p1=42,kn=2,zn=(h1-as)/kn,aa=(p1-ls)/kn,Cd=[{x1:-49,z1:23,x2:-30,z2:38,label:"T 出生点"},{x1:-53,z1:22,x2:-32,z2:30,label:"A 大"},{x1:-53,z1:-48,x2:-44,z2:29,label:"A 大"},{x1:-51,z1:-49,x2:36,z2:-39,label:"A 大"},{x1:29,z1:-47,x2:41,z2:-24,label:"A 大"},{x1:-40,z1:-34,x2:-29,z2:28,label:"B 洞"},{x1:-40,z1:-39,x2:-14,z2:-29,label:"B 洞"},{x1:-23,z1:-44,x2:-3,z2:-24,label:"B 点"},{x1:-7,z1:-34,x2:27,z2:-25,label:"连接通道"},{x1:-34,z1:18,x2:-3,z2:28,label:"中路"},{x1:-11,z1:4,x2:20,z2:21,label:"中路"},{x1:-8,z1:18,x2:0,z2:27,label:"中路"},{x1:16,z1:6,x2:28,z2:16,label:"中门"},{x1:24,z1:13,x2:40,z2:32,label:"CT 出生点"},{x1:24,z1:-30,x2:34,z2:22,label:"连接通道"},{x1:1,z1:-20,x2:9,z2:10,label:"猫道"},{x1:4,z1:-23,x2:32,z2:-14,label:"猫道"},{x1:24,z1:-39,x2:43,z2:-16,label:"A 点"}],Ri={x:34,z:-29},Ci={x:-13,z:-35},m1=[{x:-41,z:32},{x:-45,z:34},{x:-37,z:34},{x:-44,z:27},{x:-36,z:27}],g1=[{x:31,z:25},{x:27,z:26},{x:35,z:25},{x:29,z:19},{x:36,z:19}],Kg=(s,e)=>Cd.some(t=>s>=t.x1&&s<=t.x2&&e>=t.z1&&e<=t.z2),Zg=new Uint8Array(zn*aa);for(let s=0;s<aa;s++)for(let e=0;e<zn;e++)Zg[s*zn+e]=Kg(as+(e+.5)*kn,ls+(s+.5)*kn)?1:0;const qi=(s,e)=>s>=0&&e>=0&&s<zn&&e<aa&&Zg[e*zn+s]===1,tu=s=>({i:Math.floor((s.x-as)/kn),j:Math.floor((s.z-ls)/kn)}),cg=(s,e)=>({x:as+(s+.5)*kn,z:ls+(e+.5)*kn}),v1=(s,e)=>qi(tu({x:s,z:e}).i,tu({x:s,z:e}).j);function _1(s,e){return s>23&&e<-15?"A 点":s<-4&&e<-24&&s>-25?"B 点":s>15&&s<25&&e>5&&e<17?"中门":s>0&&s<28&&e<10&&e>-24?"猫道":s<-43&&e<24||e<-38&&s<28?"A 大":s<-26&&e<23?"B 洞":s>23&&e>12?"CT 出生点":s<-30&&e>23?"T 出生点":e>2&&s<24?"中路":"连接通道"}const fg=8.2;function Vl(s){return Math.hypot(s.x-Ri.x,s.z-Ri.z)<fg?"A":Math.hypot(s.x-Ci.x,s.z-Ci.z)<fg?"B":null}class x1{constructor(){Qe(this,"group",new Rr);Qe(this,"colliders",[]);Qe(this,"wallMaterial",new nn({color:13020549,roughness:1}));Qe(this,"wallAlt",new nn({color:13810840,roughness:1}));Qe(this,"trimMaterial",new nn({color:10322271,roughness:1}));this.buildGround(),this.buildBoundary(),this.buildDoors(),this.buildProps(),this.buildSites(),this.batchStaticBoxes()}box(e,t,r,a,l,c,f,h=!0){const p=new $t(new Li(a,l,c),f);return p.position.set(e,t,r),p.castShadow=h,p.receiveShadow=!0,this.group.add(p),p}addSolid(e,t,r,a,l,c,f){return this.colliders.push({x:e,z:t,w:r,d:a,h:l,kind:c}),this.box(e,l/2,t,r,l,a,f)}buildGround(){const e=new nn({color:12560778,roughness:1});this.box(-6,-.31,-6,135,.5,115,e,!1);const t=[13482908,12955532,13877408,13219222].map(a=>new nn({color:a,roughness:1}));Cd.forEach((a,l)=>{const c=this.box((a.x1+a.x2)/2,-.045+l*2e-4,(a.z1+a.z2)/2,a.x2-a.x1,.1,a.z2-a.z1,t[l%t.length],!1);c.receiveShadow=!0});const r=new nn({color:11179127,transparent:!0,opacity:.17});for(let a=0;a<180;a++){const l=-51+a*31.71%92,c=-47+a*17.17%82;Kg(l,c)&&this.box(l,.013,c,1.1+a%3,.012,.025,r,!1)}}buildBoundary(){const e=new Map,t=(r,a,l)=>{const c=`${r}:${a}`,f=e.get(c)??[];f.push(l),e.set(c,f)};for(let r=0;r<aa;r++)for(let a=0;a<zn;a++)qi(a,r)&&(qi(a-1,r)||t("x",as+a*kn,r),qi(a+1,r)||t("x",as+(a+1)*kn,r),qi(a,r-1)||t("z",ls+r*kn,a),qi(a,r+1)||t("z",ls+(r+1)*kn,a));for(const[r,a]of e){a.sort((v,x)=>v-x);const[l,c]=r.split(":"),f=Number(c);let h=a[0],p=a[0];const g=(v,x)=>{const S=(x-v+1)*kn,M=(v+x+1)*kn/2,w=l==="x"?f:as+M,y=l==="z"?f:ls+M,_=l==="x"?.55:S+.4,I=l==="z"?.55:S+.4;this.addSolid(w,y,_,I,4.7,"wall",Math.floor(v*1.7)&1?this.wallMaterial:this.wallAlt),this.box(w,4.72,y,_+.34,.3,I+.34,this.trimMaterial)};for(let v=1;v<a.length;v++)a[v]!==p+1&&(g(h,p),h=a[v]),p=a[v];g(h,p)}}buildDoors(){const e=new nn({color:7228209,roughness:.9}),t=new nn({color:4276545,metalness:.6,roughness:.45});for(const r of[8.25,13.75]){this.addSolid(20,r,.62,2.65,3.8,"door",e);for(const a of[.42,1.86,3.26])this.box(20.36,a,r,.08,.16,2.55,t);this.box(20.38,1.85,r>11?r-.92:r+.92,.12,.3,.08,t)}this.box(20,4.1,11,.9,.8,9.5,this.trimMaterial);for(const r of[6.7,15.3])this.box(20,2.2,r,1.2,4.4,1,this.trimMaterial)}buildProps(){const e=new nn({color:9466187,roughness:1}),t=new nn({color:7296829,roughness:1}),r=new nn({color:7961715,metalness:.35,roughness:.75});[[34,-32,3,3,2.2],[29,-34,2.5,2.5,1.8],[38,-23,2.2,2.2,1.7],[-16,-36,3,3,2.3],[-8,-29,2,2.6,1.6],[-20,-31,2,2,1.5],[-44,-12,2.2,2.3,1.5],[-48,-33,2.4,2.4,1.7],[7,14,2.3,2.3,1.8],[-1,10,2.2,2.2,1.5],[29,18,2.4,2.4,1.8]].forEach(([h,p,g,v,x],S)=>{if(this.addSolid(h,p,g,v,x,"crate",S%3===0?r:e),S%3!==0){for(const M of[-.37,.37])this.box(h+M*g,x/2,p+v/2+.035,.1,x,.07,t),this.box(h+M*g,x/2,p-v/2-.035,.1,x,.07,t);this.box(h,x*.15,p+v/2+.04,g,.09,.08,t),this.box(h,x*.85,p+v/2+.04,g,.09,.08,t)}});const l=new nn({color:14732976,roughness:1}),c=new nn({color:9136464,roughness:1});[[-55,-13,8,8,7],[-54,11,7,11,8],[-20,34,10,8,7],[10,24,10,8,9],[40,5,7,12,7],[-25,-50,12,7,6],[13,-48,9,6,8]].forEach(([h,p,g,v,x])=>{this.addSolid(h,p,g,v,x,"wall",l),this.box(h,x+.18,p,g+.55,.4,v+.55,c)});const f=new nn({color:10454891,roughness:1});for(let h=-16;h<=2;h+=3)this.addSolid(8.8,h,.42,2.5,1.12,"wall",f);for(let h=9;h<=21;h+=3)this.addSolid(h,-22.5,2.5,.42,1.12,"wall",f);this.addSign(-47.9,-24,"A  →","#b35b3c",Math.PI/2),this.addSign(-33,-10,"B  ←","#9f6449",Math.PI/2),this.addSign(23.7,-7,"A","#b35b3c",Math.PI/2)}addSign(e,t,r,a,l){const c=document.createElement("canvas");c.width=256,c.height=128;const f=c.getContext("2d");f.clearRect(0,0,256,128),f.fillStyle=a,f.font="bold 88px sans-serif",f.textAlign="center",f.textBaseline="middle",f.fillText(r,128,64);const h=new $t(new so(3.8,1.9),new oa({map:new Im(c),transparent:!0,depthWrite:!1}));h.position.set(e,2.15,t),h.rotation.y=l,this.group.add(h)}buildSites(){const e=new nn({color:11749172,roughness:1,transparent:!0,opacity:.8}),t=new nn({color:12149302,roughness:1,transparent:!0,opacity:.8});for(const[r,a,l]of[[Ri,e,"A"],[Ci,t,"B"]]){const c=new $t(new ru(5.1,.12,8,64),a);c.rotation.x=-Math.PI/2,c.position.set(r.x,.045,r.z),this.group.add(c);const f=document.createElement("canvas");f.width=f.height=256;const h=f.getContext("2d");h.fillStyle="#a43e2e",h.font="bold 180px Arial",h.textAlign="center",h.textBaseline="middle",h.fillText(l,128,137);const p=new $t(new so(3.8,3.8),new oa({map:new Im(f),transparent:!0,opacity:.65,depthWrite:!1}));p.rotation.x=-Math.PI/2,p.position.set(r.x,.055,r.z),this.group.add(p)}}batchStaticBoxes(){const e=new Map;for(const t of this.group.children){if(!(t instanceof $t)||!(t.geometry instanceof Li)||Array.isArray(t.material))continue;const r=e.get(t.material)??[];r.push(t),e.set(t.material,r)}for(const[t,r]of e){if(r.length<2)continue;const a=r.map(f=>(f.updateMatrix(),f.geometry.clone().applyMatrix4(f.matrix))),l=qg(a,!1);if(!l)continue;for(const f of r)this.group.remove(f);const c=new $t(l,t);c.castShadow=!0,c.receiveShadow=!0,this.group.add(c),a.forEach(f=>f.dispose())}}isBlocked(e,t,r=.36){if(!v1(e,t))return!0;for(const a of this.colliders){if(Math.abs(e-a.x)>a.w/2+r||Math.abs(t-a.z)>a.d/2+r)continue;const l=Math.max(a.x-a.w/2,Math.min(e,a.x+a.w/2)),c=Math.max(a.z-a.d/2,Math.min(t,a.z+a.d/2));if((e-l)**2+(t-c)**2<r**2)return!0}return!1}move(e,t,r,a=.36){this.isBlocked(e.x+t,e.z,a)||(e.x+=t),this.isBlocked(e.x,e.z+r,a)||(e.z+=r)}clearCell(e,t){if(!qi(e,t))return!1;const r=cg(e,t);return!this.isBlocked(r.x,r.z,.42)}path(e,t){const r=tu(e),a=tu(t);if(!qi(r.i,r.j)||!qi(a.i,a.j))return[];const l=r.j*zn+r.i,c=a.j*zn+a.i,f=zn*aa,h=new Float32Array(f);h.fill(1/0),h[l]=0;const p=new Int32Array(f);p.fill(-1);const g=new Uint8Array(f),v=[{n:l,f:0}],x=y=>{v.push(y);let _=v.length-1;for(;_>0;){const I=_-1>>1;if(v[I].f<=v[_].f)break;[v[I],v[_]]=[v[_],v[I]],_=I}},S=()=>{const y=v[0],_=v.pop();if(v.length){v[0]=_;let I=0;for(;;){let L=I*2+1;if(L>=v.length||(L+1<v.length&&v[L+1].f<v[L].f&&L++,v[I].f<=v[L].f))break;[v[I],v[L]]=[v[L],v[I]],I=L}}return y},M=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];for(;v.length;){const{n:y}=S();if(g[y])continue;if(g[y]=1,y===c)break;const _=y%zn,I=Math.floor(y/zn);for(const[L,b]of M){const z=_+L,F=I+b,O=F*zn+z;if(!this.clearCell(z,F)||g[O]||L&&b&&(!this.clearCell(_+L,I)||!this.clearCell(_,I+b)))continue;const X=h[y]+(L&&b?1.414:1);X<h[O]&&(h[O]=X,p[O]=y,x({n:O,f:X+Math.hypot(a.i-z,a.j-F)}))}}if(l!==c&&p[c]===-1)return[];const w=[];for(let y=c;y!==l&&y!==-1;y=p[y])w.push(cg(y%zn,Math.floor(y/zn)));return w.reverse(),w}}const Sf=1.63,Mf=130,y1=new j,S1=[{zone:"head",min:[-.24,1.5,-.24],max:[.24,1.99,.24]},{zone:"chest",min:[-.32,1.08,-.26],max:[.32,1.52,.22]},{zone:"stomach",min:[-.28,.75,-.23],max:[.28,1.08,.22]},{zone:"arm",min:[-.56,.89,-.51],max:[-.29,1.48,.17]},{zone:"arm",min:[.29,.89,-.51],max:[.56,1.48,.17]},{zone:"leg",min:[-.29,.08,-.25],max:[-.045,.76,.2]},{zone:"leg",min:[.045,.08,-.25],max:[.29,.76,.2]}];function dg(s,e,t,r){let a=0,l=1/0;for(let c=0;c<3;c++){const f=s.getComponent(c),h=e.getComponent(c);if(Math.abs(h)<1e-8){if(f<t[c]||f>r[c])return 1/0;continue}let p=(t[c]-f)/h,g=(r[c]-f)/h;if(p>g&&([p,g]=[g,p]),a=Math.max(a,p),l=Math.min(l,g),a>l)return 1/0}return a}const Rn=(s,e)=>Math.hypot(s.x-e.x,s.z-e.z),Gl=(s,e)=>Math.atan2(-(e.x-s.x),-(e.z-s.z)),Ko=(s,e)=>Math.atan2(Math.sin(e-s),Math.cos(e-s)),Tr=(s,e)=>s+Math.random()*(e-s);class M1{constructor(e,t){Qe(this,"scene",new mx);Qe(this,"camera",new Kn(75,1,.05,180));Qe(this,"renderer");Qe(this,"map",new x1);Qe(this,"audio",new d1);Qe(this,"container");Qe(this,"onSnapshot");Qe(this,"frame",0);Qe(this,"lastFrame",0);Qe(this,"hudTimer",0);Qe(this,"time",0);Qe(this,"phase","menu");Qe(this,"mode","pistol");Qe(this,"playerTeam","T");Qe(this,"round",1);Qe(this,"scoreT",0);Qe(this,"scoreCT",0);Qe(this,"actors",[]);Qe(this,"controlledId",0);Qe(this,"originalId",0);Qe(this,"spectateId",null);Qe(this,"bomb",{mode:"none",pos:{x:0,z:0},carrierId:null,site:null,timer:40,mesh:null,beepTimer:0});Qe(this,"feed",[]);Qe(this,"feedId",0);Qe(this,"message","");Qe(this,"endTimer",0);Qe(this,"keys",new Set);Qe(this,"mouseDown",!1);Qe(this,"scoped",!1);Qe(this,"buyOpen",!1);Qe(this,"pointerLocked",!1);Qe(this,"viewGun",null);Qe(this,"viewGunId",null);Qe(this,"viewBob",0);Qe(this,"stepPhase",0);Qe(this,"effects",[]);Qe(this,"resizeObserver");Qe(this,"previousViewId",-1);Qe(this,"resize",()=>{const e=this.container.clientWidth||window.innerWidth,t=this.container.clientHeight||window.innerHeight;this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t)});Qe(this,"onContextMenu",e=>e.preventDefault());Qe(this,"onCanvasClick",()=>{this.phase!=="menu"&&!this.pointerLocked&&!this.buyOpen&&this.lockPointer()});Qe(this,"onLockChange",()=>{this.pointerLocked=document.pointerLockElement===this.renderer.domElement,this.mouseDown=!1,this.publish()});Qe(this,"onBlur",()=>{this.keys.clear(),this.mouseDown=!1});Qe(this,"onKeyDown",e=>{var r;if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)&&e.preventDefault(),this.keys.add(e.code),this.phase==="menu")return;const t=this.actors[this.controlledId];e.repeat&&["KeyR","Digit1","Digit2","Digit3","KeyB","KeyF","Space"].includes(e.code)||(e.code==="KeyB"&&this.mode==="full"&&(t!=null&&t.alive)&&(this.buyOpen=!this.buyOpen,this.buyOpen?(r=document.exitPointerLock)==null||r.call(document):this.lockPointer(),window.dispatchEvent(new CustomEvent("dust-buy",{detail:this.buyOpen}))),e.code==="KeyR"&&(t!=null&&t.alive)&&this.reload(t),e.code==="Digit1"&&this.switchWeapon(t,"primary"),e.code==="Digit2"&&this.switchWeapon(t,"secondary"),e.code==="Digit3"&&this.switchWeapon(t,"melee"),e.code==="Space"&&t&&!t.alive&&this.cycleSpectator(),e.code==="KeyF"&&t&&!t.alive&&this.takeOver(),this.publish())});Qe(this,"onKeyUp",e=>{this.keys.delete(e.code)});Qe(this,"onMouseMove",e=>{if(!this.pointerLocked||this.phase!=="live")return;const t=this.actors[this.controlledId];if(!(t!=null&&t.alive))return;const r=this.scoped?9e-4:.0022;t.yaw-=e.movementX*r,t.pitch=xl.clamp(t.pitch-e.movementY*r,-1.48,1.48)});Qe(this,"onMouseDown",e=>{if(this.phase!=="live"||this.buyOpen||!this.pointerLocked)return;const t=this.actors[this.controlledId];t!=null&&t.alive&&(e.button===0&&(this.mouseDown=!0,this.fire(t)),e.button===2&&t.weapons[t.equipped]==="awp"&&(this.scoped=!this.scoped,this.audio.scope(),this.publish()))});Qe(this,"onMouseUp",e=>{e.button===0&&(this.mouseDown=!1)});Qe(this,"loop",e=>{const t=Math.min((e-(this.lastFrame||e))/1e3,.18);this.lastFrame=e,this.update(t),this.renderer.render(this.scene,this.camera),this.frame=requestAnimationFrame(this.loop)});this.container=e,this.onSnapshot=t,this.scene.background=new yt(12177874),this.scene.fog=new Ed(12177874,75,160),this.renderer=new c1({antialias:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.25)),this.renderer.shadowMap.enabled=!1,this.renderer.outputColorSpace=qn,this.renderer.toneMapping=gg,this.renderer.toneMappingExposure=1.62,e.appendChild(this.renderer.domElement),this.camera.rotation.order="YXZ",this.scene.add(this.camera),this.scene.add(this.map.group),this.scene.add(new Mx(15069171,10188881,2.2));const r=new Ax(16770478,3.2);r.position.set(-32,62,-25),this.scene.add(r),this.camera.position.set(-39,Sf,31),this.camera.rotation.y=2.6,this.resizeObserver=new ResizeObserver(this.resize),this.resizeObserver.observe(e),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp),window.addEventListener("mousemove",this.onMouseMove),window.addEventListener("mousedown",this.onMouseDown),window.addEventListener("mouseup",this.onMouseUp),window.addEventListener("blur",this.onBlur),document.addEventListener("pointerlockchange",this.onLockChange),this.renderer.domElement.addEventListener("contextmenu",this.onContextMenu),this.renderer.domElement.addEventListener("click",this.onCanvasClick),this.resize(),this.publish(),this.frame=requestAnimationFrame(this.loop)}lockPointer(){var e,t;this.audio.resume(),(t=(e=this.renderer.domElement).requestPointerLock)==null||t.call(e)}start(e,t){this.mode=e,this.playerTeam=t,this.round=1,this.scoreT=this.scoreCT=0,this.startRound(),this.lockPointer()}startRound(){for(const a of this.actors)this.scene.remove(a.mesh);this.actors=[],this.bomb.mesh&&this.scene.remove(this.bomb.mesh),this.feed=[],this.phase="live",this.time=Mf,this.message="",this.endTimer=0,this.scoped=!1,this.buyOpen=!1,this.keys.clear(),this.mouseDown=!1;const e=["RAZE","RAVEN","SPECTRE","VIPER","DUST"],t=["WARDEN","ECHO","GHOST","FROST","NOVA"];this.originalId=this.playerTeam==="T"?0:5,this.controlledId=this.originalId,this.spectateId=null;for(let a=0;a<10;a++){const l=a<5?"T":"CT",c=a%5,f=(l==="T"?m1:g1)[c],{mesh:h,gunMesh:p}=f1(l,a);h.position.set(f.x,0,f.z),this.scene.add(h);const g=l==="T"?c===2?"awp":"ak":c===2?"awp":"m4",x={secondary:l==="T"?"glock":"usp",melee:"knife"};this.mode==="full"&&(x.primary=g);const S={},M={};for(const y of Object.values(x))y&&(S[y]=Pn[y].magazine,M[y]=Pn[y].reserve);const w={id:a,name:a===this.originalId?"YOU":(l==="T"?e:t)[c],team:l,pos:new j(f.x,0,f.z),yaw:l==="T"?-Math.PI/2:Math.PI/2,pitch:0,hp:100,armor:this.mode==="pistol"?0:100,alive:!0,velocityY:0,grounded:!0,weapons:x,equipped:this.mode==="pistol"?"secondary":"primary",ammo:S,reserve:M,nextShot:Mf,reloadEnd:0,shotHeat:0,recoilKick:0,hasBomb:!1,kills:0,deaths:0,mesh:h,gunMesh:p,botMode:"patrol",goal:{x:f.x,z:f.z},path:[],pathIndex:0,pathTimer:0,targetId:null,lastSeen:0,strafeSign:Math.random()<.5?-1:1,strafeTimer:0,actionProgress:0,footstepTimer:0,spawn:f};this.actors.push(w),this.updateActorGun(w)}const r=this.actors[this.playerTeam==="T"?0:1];r.hasBomb=!0,this.bomb={mode:"carried",pos:{x:r.pos.x,z:r.pos.z},carrierId:r.id,site:null,timer:40,mesh:this.createBombMesh(),beepTimer:0},this.scene.add(this.bomb.mesh),this.bomb.mesh.visible=!1,this.previousViewId=-1,this.updateViewGun(),this.publish()}createBombMesh(){const e=new Rr,t=new nn({color:2567982,metalness:.3}),r=new oa({color:7857482}),a=new nn({color:12998197}),l=new $t(new Li(.65,.22,.4),t);l.position.y=.13,e.add(l);const c=new $t(new Li(.27,.045,.2),r);c.position.set(-.11,.255,-.045),e.add(c);for(let f=0;f<3;f++){const h=new $t(new ru(.11,.018,5,12,Math.PI),a);h.position.set(.15+f*.045,.24+f*.02,.02),h.rotation.x=Math.PI/2,e.add(h)}return e}updateActorGun(e){e.mesh.remove(e.gunMesh);const t=e.weapons[e.equipped]??"knife";e.gunMesh=dd(t),e.gunMesh.position.set(0,1.11,-.49),e.gunMesh.scale.setScalar(.64),e.mesh.add(e.gunMesh)}updateViewGun(){const e=this.viewActor();if(!e)return;const t=e.weapons[e.equipped]??"knife";this.viewGunId===t&&this.previousViewId===e.id||(this.viewGun&&this.camera.remove(this.viewGun),this.viewGun=dd(t,!0),this.viewGun.position.set(.29,-.36,-.72),this.viewGun.scale.setScalar(.78),this.camera.add(this.viewGun),this.viewGunId=t,this.previousViewId=e.id)}switchWeapon(e,t){!(e!=null&&e.alive)||!e.weapons[t]||(e.equipped=t,e.reloadEnd=0,this.scoped=!1,this.updateActorGun(e),this.updateViewGun(),this.publish())}buyWeapon(e){const t=this.actors[this.controlledId];if(this.mode!=="full"||!(t!=null&&t.alive))return;const r=Pn[e];r.slot!=="melee"&&(t.weapons[r.slot]=e,t.ammo[e]=r.magazine,t.reserve[e]=r.reserve,t.equipped=r.slot,t.reloadEnd=0,this.scoped=!1,this.updateActorGun(t),this.updateViewGun(),this.publish())}closeBuy(){this.buyOpen=!1,window.dispatchEvent(new CustomEvent("dust-buy",{detail:!1})),this.lockPointer()}reload(e){const t=e.weapons[e.equipped];if(!t||t==="knife")return;const r=Pn[t];e.reloadEnd>0||(e.ammo[t]??0)>=r.magazine||(e.reserve[t]??0)<=0||(e.reloadEnd=this.time-r.reload,e.id===this.controlledId&&this.audio.reload())}update(e){if(this.phase==="live"){this.time-=e;for(const r of this.actors)if(r.alive&&(r.shotHeat=Math.max(0,r.shotHeat-e*1.3),r.reloadEnd>0&&this.time<=r.reloadEnd)){const a=r.weapons[r.equipped];if(a&&a!=="knife"){const l=Pn[a].magazine-(r.ammo[a]??0),c=Math.min(l,r.reserve[a]??0);r.ammo[a]=(r.ammo[a]??0)+c,r.reserve[a]=(r.reserve[a]??0)-c}r.reloadEnd=0}const t=this.actors[this.controlledId];t!=null&&t.alive&&(this.updatePlayer(t,e),this.mouseDown&&this.pointerLocked&&!this.buyOpen&&Pn[t.weapons[t.equipped]??"knife"].automatic&&this.fire(t),this.updateAction(t,e));for(const r of this.actors)r.alive&&r.id!==this.controlledId&&this.updateBot(r,e);if(this.updateBomb(e),this.phase==="live"){const r=this.actors.filter(l=>l.team==="T"&&l.alive).length;this.actors.filter(l=>l.team==="CT"&&l.alive).length===0?this.endRound("T","T 方全歼 CT"):r===0&&this.bomb.mode!=="planted"?this.endRound("CT","CT 方全歼 T"):this.time<=0&&this.bomb.mode!=="planted"&&this.endRound("CT","时间耗尽")}}else this.phase==="ended"&&(this.endTimer-=e,this.endTimer<=0&&(this.round++,this.startRound()));for(const t of this.feed)t.life-=e;this.feed=this.feed.filter(t=>t.life>0);for(const t of this.effects)t.life-=e,t.life<=0&&this.scene.remove(t.object);this.effects=this.effects.filter(t=>t.life>0),this.updateCamera(e),this.hudTimer-=e,this.hudTimer<=0&&(this.hudTimer=.09,this.publish())}updatePlayer(e,t){const r=new St(-Math.sin(e.yaw),-Math.cos(e.yaw)),a=new St(Math.cos(e.yaw),-Math.sin(e.yaw));let l=0,c=0;this.keys.has("KeyW")&&(l+=r.x,c+=r.y),this.keys.has("KeyS")&&(l-=r.x,c-=r.y),this.keys.has("KeyD")&&(l+=a.x,c+=a.y),this.keys.has("KeyA")&&(l-=a.x,c-=a.y);const f=Math.hypot(l,c);let h=this.keys.has("ShiftLeft")?3.2:5.35;this.scoped&&(h*=.55),f&&(l=l/f*h*t,c=c/f*h*t,this.map.move(e.pos,l,c)),this.keys.has("Space")&&e.grounded&&(e.velocityY=6.1,e.grounded=!1),e.velocityY-=17*t,e.pos.y+=e.velocityY*t,e.pos.y<=0&&(e.pos.y=0,e.velocityY=0,e.grounded=!0),e.mesh.position.copy(e.pos),e.mesh.rotation.y=e.yaw,ug(e,130-this.time,f?h:0),this.viewBob+=f?t*h*1.7:t*2,f&&e.grounded&&(this.stepPhase+=h*t,this.stepPhase>2.35&&(this.stepPhase=0,this.audio.footstep()))}viewActor(){const e=this.actors[this.controlledId];return e!=null&&e.alive?e:this.spectateId!==null?this.actors[this.spectateId]??null:this.actors.find(t=>t.team===this.playerTeam&&t.alive)??e??null}updateCamera(e){const t=this.viewActor();if(!t)return;this.updateViewGun();const r=t.id===this.controlledId&&t.grounded&&this.phase==="live"?Math.sin(this.viewBob*1.8)*.018:0;this.camera.position.set(t.pos.x,t.pos.y+Sf+r,t.pos.z),this.camera.rotation.y=t.yaw,this.camera.rotation.x=t.pitch;const a=this.scoped&&t.id===this.controlledId?22:75;if(this.camera.fov=xl.damp(this.camera.fov,a,15,e),this.camera.updateProjectionMatrix(),this.viewGun){this.viewGun.visible=!this.scoped;const l=Math.sin(this.viewBob)*.008;this.viewGun.position.set(.29,-.36+l,-.72+Math.min(t.shotHeat,.5)*.14),this.viewGun.rotation.x=-Math.min(t.shotHeat,1)*.13}t.mesh.visible=!1;for(const l of this.actors)l.id!==t.id&&l.alive&&(l.mesh.visible=!0)}nearestWall(e,t,r){let a=r;for(const l of this.map.colliders){const c=dg(e,t,[l.x-l.w/2,0,l.z-l.d/2],[l.x+l.w/2,l.h,l.z+l.d/2]);c<a&&(a=c)}return a}lineClear(e,t){const r=t.clone().sub(e),a=r.length();return r.divideScalar(a),this.nearestWall(e,r,a)>=a-.08}rayActor(e,t,r){const a=Math.cos(r.yaw),l=Math.sin(r.yaw),c=e.x-r.pos.x,f=e.z-r.pos.z,h=new j(a*c-l*f,e.y-r.pos.y,l*c+a*f),p=new j(a*t.x-l*t.z,t.y,l*t.x+a*t.z);let g=null;for(const v of S1){const x=dg(h,p,v.min,v.max);x<((g==null?void 0:g.t)??1/0)&&(g={t:x,zone:v.zone})}return g}fire(e){var x;if(!e.alive||this.phase!=="live"||e.reloadEnd>0||this.time>e.nextShot)return;const t=e.weapons[e.equipped]??"knife",r=Pn[t];if(t!=="knife"&&(e.ammo[t]??0)<=0){this.reload(e);return}e.nextShot=this.time-60/r.rpm,t!=="knife"&&(e.ammo[t]=(e.ammo[t]??0)-1);const a=e.id===this.controlledId;e.shotHeat=Math.min(1.8,e.shotHeat+(t==="ak"?.24:t==="m4"?.14:.18)),a&&(e.pitch=xl.clamp(e.pitch+r.recoil*Tr(.84,1.16),-1.48,1.48),e.yaw+=Tr(-r.recoil*.45,r.recoil*.45)),this.audio.shot(t,a?1:Math.max(.18,1-Rn(e.pos,((x=this.viewActor())==null?void 0:x.pos)??e.pos)/50)*.4);const l=e.pos.clone().add(new j(0,a?Sf:1.55,0));let c;if(a)this.camera.rotation.set(e.pitch,e.yaw,0,"YXZ"),c=this.camera.getWorldDirection(new j);else{const S=this.actors[e.targetId??-1];S!=null&&S.alive?c=S.pos.clone().add(new j(0,Tr(1.1,1.67),0)).sub(l).normalize():c=new j(-Math.sin(e.yaw),0,-Math.cos(e.yaw))}const f=(r.spread+e.shotHeat*(a?.017:.008))*(this.scoped&&a&&t==="awp"?.13:1)*(e.grounded?1:2.7);t!=="knife"&&(c.x+=Tr(-f,f),c.y+=Tr(-f,f),c.z+=Tr(-f,f),c.normalize());let p=this.nearestWall(l,c,r.range),g=null,v="chest";for(const S of this.actors){if(!S.alive||S.team===e.team||S.id===e.id)continue;const M=this.rayActor(l,c,S);M&&M.t<p&&(p=M.t,g=S,v=M.zone)}g&&this.damage(g,e,v,r.damage,t),t!=="knife"&&this.tracer(l,c,p,e.team,a),a&&this.publish()}damage(e,t,r,a,l){var h;let f=a*(r==="head"?2:r==="chest"?1:r==="stomach"?.9:r==="arm"?.65:.75);if(e.armor>0&&["head","chest","stomach"].includes(r)){const p=f*.36;f-=p,e.armor=Math.max(0,e.armor-Math.ceil(p*.5))}e.hp=Math.max(0,e.hp-Math.round(f)),t.id===this.controlledId&&this.audio.hit(),e.hp<=0&&(e.alive=!1,e.deaths++,t.kills++,e.mesh.visible=!1,e.hasBomb&&this.dropBomb(e),this.feed.unshift({id:++this.feedId,killer:t.name,victim:e.name,weapon:Pn[l].name,team:t.team,headshot:r==="head",life:5}),this.feed=this.feed.slice(0,5),t.id===this.controlledId&&this.audio.kill(),e.id===this.controlledId&&(this.mouseDown=!1,this.scoped=!1,this.spectateId=((h=this.actors.find(p=>p.team===this.playerTeam&&p.alive))==null?void 0:h.id)??null),this.publish())}tracer(e,t,r,a,l){const c=e.clone();l&&c.add(new j(.15,-.09,0).applyQuaternion(this.camera.quaternion));const f=e.clone().addScaledVector(t,Math.min(r,80)),h=new Zn().setFromPoints([c,f]),p=new xx(h,new zg({color:a==="T"?16761465:12051711,transparent:!0,opacity:.7}));this.scene.add(p),this.effects.push({object:p,life:.07})}chooseGoal(e){const t=e.pos;if(this.bomb.mode==="dropped"&&e.team==="T")return{goal:this.bomb.pos,mode:"chase"};if(this.bomb.mode==="planted"){if(e.team==="CT")return{goal:this.bomb.pos,mode:"defuse"};const f=[{x:5,z:2},{x:-4,z:3},{x:3,z:-5},{x:-5,z:-4},{x:0,z:6}][e.id%5];return{goal:{x:this.bomb.pos.x+f.x,z:this.bomb.pos.z+f.z},mode:"defend"}}if(e.team==="T"){const c=this.round%2?Ri:Ci,h=[{x:0,z:0},{x:5,z:2},{x:-4,z:-1},{x:2,z:-5},{x:-5,z:5}][e.id%5];return{goal:{x:c.x+h.x,z:c.z+h.z},mode:e.hasBomb?"plant":"attack"}}const r=this.round%2?[[Ri,{x:28,z:-19}],[{x:28,z:-19},{x:36,z:-27}],[Ci,{x:-5,z:-28}],[{x:18,z:11},{x:10,z:11}],[{x:5,z:-17},{x:23,z:-18}]]:[[Ci,{x:-5,z:-28}],[{x:-6,z:-29},{x:-12,z:-39}],[Ri,{x:29,z:-19}],[{x:16,z:11},{x:5,z:14}],[{x:30,z:-16},{x:34,z:-30}]],a=Math.floor((Mf-this.time)/10)%2,l=r[e.id%5][a];return{goal:l,mode:Rn(t,l)<3?"defend":"patrol"}}visibleEnemy(e){let t=null,r=49;const a=e.pos.clone().add(new j(0,1.55,0));for(const l of this.actors){if(!l.alive||l.team===e.team)continue;const c=Rn(e.pos,l.pos);if(c>=r)continue;const f=Gl(e.pos,l.pos);if(c>8&&Math.abs(Ko(e.yaw,f))>1.65)continue;const h=l.pos.clone().add(new j(0,1.25,0));this.lineClear(a,h)&&(t=l,r=c)}return t}updateBot(e,t){const r=this.visibleEnemy(e);r?(e.targetId=r.id,e.lastSeen=this.time):this.time<e.lastSeen-1.7&&(e.targetId=null);let a,l;if(r){a={x:r.pos.x,z:r.pos.z},l="attack";const h=Gl(e.pos,r.pos);e.yaw+=Ko(e.yaw,h)*Math.min(1,t*5),e.pitch=xl.damp(e.pitch,Math.atan2(r.pos.y+1.3-(e.pos.y+1.55),Rn(e.pos,r.pos)),6,t),Math.abs(Ko(e.yaw,h))<.19&&this.fire(e)}else{const h=this.chooseGoal(e);a=h.goal,l=h.mode}e.botMode=l;const c=Rn(e.pos,a);let f=0;if(r&&c<19&&c>6){e.strafeTimer-=t,e.strafeTimer<=0&&(e.strafeTimer=Tr(1.1,2.8),e.strafeSign*=-1);const h=Gl(e.pos,r.pos),p=2.5*t,g=e.pos.x,v=e.pos.z;this.map.move(e.pos,-Math.cos(h)*e.strafeSign*p,Math.sin(h)*e.strafeSign*p),f=Math.hypot(e.pos.x-g,e.pos.z-v)}else if(c>(l==="defuse"||l==="plant"?1.45:1.8)){e.pathTimer-=t,(e.pathTimer<=0||Rn(e.goal,a)>3||e.pathIndex>=e.path.length)&&(e.path=this.map.path(e.pos,a),e.pathIndex=0,e.pathTimer=r?.55:Tr(.9,1.5),e.goal={...a});let h=e.path[e.pathIndex];for(;h&&Rn(e.pos,h)<.78;)e.pathIndex++,h=e.path[e.pathIndex];if(h){const p=h.x-e.pos.x,g=h.z-e.pos.z,v=Math.hypot(p,g),x=(l==="defuse"?4.6:3.65)*t,S=e.pos.x,M=e.pos.z;this.map.move(e.pos,p/v*x,g/v*x),f=Math.hypot(e.pos.x-S,e.pos.z-M),!r&&f>0&&(e.yaw+=Ko(e.yaw,Math.atan2(-p,-g))*Math.min(1,t*8)),f<x*.15&&(e.pathTimer=0)}}e.mesh.position.copy(e.pos),e.mesh.rotation.y=e.yaw,ug(e,130-this.time,f/Math.max(t,.001)),this.bomb.mode==="dropped"&&e.team==="T"&&Rn(e.pos,this.bomb.pos)<1.5&&this.pickBomb(e),e.hasBomb&&Vl(e.pos)&&!r?(e.actionProgress+=t,e.actionProgress>=3&&this.plantBomb(e)):this.bomb.mode==="planted"&&e.team==="CT"&&Rn(e.pos,this.bomb.pos)<1.8&&!r?(e.actionProgress+=t,e.actionProgress>=5&&this.defuseBomb(e)):e.actionProgress=0}updateAction(e,t){if(this.keys.has("KeyE")){if(this.bomb.mode==="dropped"&&e.team==="T"&&Rn(e.pos,this.bomb.pos)<2){this.pickBomb(e);return}e.hasBomb&&Vl(e.pos)?(e.actionProgress+=t,e.actionProgress>=3&&this.plantBomb(e)):this.bomb.mode==="planted"&&e.team==="CT"&&Rn(e.pos,this.bomb.pos)<2.2?(e.actionProgress+=t,e.actionProgress>=5&&this.defuseBomb(e)):e.actionProgress=0}else e.actionProgress=0}dropBomb(e){e.hasBomb=!1,this.bomb.mode="dropped",this.bomb.carrierId=null,this.bomb.pos={x:e.pos.x,z:e.pos.z},this.bomb.mesh.visible=!0,this.bomb.mesh.position.set(e.pos.x,.04,e.pos.z)}pickBomb(e){e.hasBomb=!0,this.bomb.mode="carried",this.bomb.carrierId=e.id,this.bomb.mesh.visible=!1,this.audio.beep(),e.actionProgress=0,this.publish()}plantBomb(e){const t=Vl(e.pos);!t||!e.hasBomb||(e.hasBomb=!1,e.actionProgress=0,this.bomb.mode="planted",this.bomb.carrierId=null,this.bomb.site=t,this.bomb.pos={x:e.pos.x,z:e.pos.z},this.bomb.timer=40,this.bomb.beepTimer=0,this.bomb.mesh.visible=!0,this.bomb.mesh.position.set(e.pos.x,.04,e.pos.z),this.audio.plant(),this.message=`C4 已安放 · ${t} 点`,this.publish())}defuseBomb(e){this.bomb.mode==="planted"&&(e.actionProgress=0,this.bomb.mode="none",this.bomb.mesh.visible=!1,this.audio.defuse(),this.endRound("CT",`${e.name} 拆除了 C4`))}updateBomb(e){if(this.bomb.mode==="carried"&&this.bomb.carrierId!==null){const t=this.actors[this.bomb.carrierId];this.bomb.pos={x:t.pos.x,z:t.pos.z}}if(this.bomb.mode==="planted"&&(this.bomb.timer-=e,this.bomb.beepTimer-=e,this.bomb.beepTimer<=0&&(this.bomb.beepTimer=Math.max(.18,this.bomb.timer/35),this.audio.beep()),this.bomb.timer<=0)){const t=this.bomb.pos,r=new Tx(16754507,20,35);r.position.set(t.x,2,t.z),this.scene.add(r),this.effects.push({object:r,life:.33}),this.audio.explosion(),this.bomb.mesh.visible=!1,this.endRound("T",`C4 在 ${this.bomb.site} 点爆炸`)}}endRound(e,t){this.phase==="live"&&(this.phase="ended",this.endTimer=4.5,this.message=`${e==="T"?"T 方":"CT 方"}获胜 · ${t}`,e==="T"?this.scoreT++:this.scoreCT++,this.mouseDown=!1,this.scoped=!1,this.publish())}cycleSpectator(){const e=this.actors.filter(r=>r.team===this.playerTeam&&r.alive);if(!e.length)return;const t=e.findIndex(r=>r.id===this.spectateId);this.spectateId=e[(t+1)%e.length].id,this.previousViewId=-1,this.updateViewGun(),this.publish()}takeOver(){const e=this.actors[this.spectateId??-1];e!=null&&e.alive&&(this.controlledId=e.id,this.spectateId=null,this.previousViewId=-1,this.updateViewGun(),this.publish())}publish(){const e=this.viewActor(),t=this.actors[this.controlledId],r=e??t,a=(r==null?void 0:r.weapons[r.equipped])??"glock",l=new Set,c=this.actors.filter(p=>p.team===this.playerTeam&&p.alive);for(const p of this.actors)p.team!==this.playerTeam&&p.alive&&c.some(g=>Rn(g.pos,p.pos)<42&&(Rn(g.pos,p.pos)<7||Math.abs(Ko(g.yaw,Gl(g.pos,p.pos)))<1.65)&&this.lineClear(y1.set(g.pos.x,g.pos.y+1.55,g.pos.z).clone(),new j(p.pos.x,p.pos.y+1.2,p.pos.z)))&&l.add(p.id);const f=r!=null&&r.alive&&r.id===this.controlledId?r.hasBomb&&Vl(r.pos)?"按住 E 安放 C4":this.bomb.mode==="planted"&&r.team==="CT"&&Rn(r.pos,this.bomb.pos)<2.2?"按住 E 拆除 C4":this.bomb.mode==="dropped"&&r.team==="T"&&Rn(r.pos,this.bomb.pos)<2?"按 E 拾取 C4":"":"",h={phase:this.phase,team:this.playerTeam,mode:this.mode,round:this.round,time:Math.max(0,this.time),scoreT:this.scoreT,scoreCT:this.scoreCT,region:r?_1(r.pos.x,r.pos.z):"T 出生点",hp:(r==null?void 0:r.hp)??0,armor:(r==null?void 0:r.armor)??0,alive:(t==null?void 0:t.alive)??!1,spectating:!!t&&!t.alive,name:(r==null?void 0:r.name)??"YOU",weapon:a,weaponName:Pn[a].name,ammo:(r==null?void 0:r.ammo[a])??0,reserve:(r==null?void 0:r.reserve[a])??0,reloading:((r==null?void 0:r.reloadEnd)??0)>0,scoped:this.scoped&&((t==null?void 0:t.alive)??!1),spread:r?Pn[a].spread+r.shotHeat*.017:0,kills:(r==null?void 0:r.kills)??0,deaths:(r==null?void 0:r.deaths)??0,tAlive:this.actors.filter(p=>p.team==="T"&&p.alive).length,ctAlive:this.actors.filter(p=>p.team==="CT"&&p.alive).length,bomb:{mode:this.bomb.mode,x:this.bomb.pos.x,z:this.bomb.pos.z,timer:Math.max(0,this.bomb.timer),site:this.bomb.site,carrierId:this.bomb.carrierId},actors:this.actors.map(p=>({id:p.id,x:p.pos.x,z:p.pos.z,team:p.team,alive:p.alive,visible:p.team===this.playerTeam||l.has(p.id),controlled:p.id===this.controlledId})),feed:this.feed.map(({life:p,...g})=>g),message:this.message,action:f,actionProgress:(r==null?void 0:r.actionProgress)??0,pointerLocked:this.pointerLocked};this.onSnapshot(h)}dispose(){cancelAnimationFrame(this.frame),this.resizeObserver.disconnect(),window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),window.removeEventListener("mousemove",this.onMouseMove),window.removeEventListener("mousedown",this.onMouseDown),window.removeEventListener("mouseup",this.onMouseUp),window.removeEventListener("blur",this.onBlur),document.removeEventListener("pointerlockchange",this.onLockChange),this.renderer.domElement.removeEventListener("contextmenu",this.onContextMenu),this.renderer.domElement.removeEventListener("click",this.onCanvasClick),document.pointerLockElement===this.renderer.domElement&&document.exitPointerLock(),this.renderer.dispose(),this.renderer.domElement.remove()}}function hg(s){const e=Math.ceil(s);return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`}function E1({data:s}){return K.jsxs("div",{className:"minimap panel",children:[K.jsxs("div",{className:"minimap-heading",children:[K.jsx("span",{className:"eyebrow",children:"TACTICAL MAP"}),K.jsx("span",{className:"minimap-region",children:s.region})]}),K.jsxs("svg",{className:"map-svg",viewBox:"-58 -54 104 96",preserveAspectRatio:"xMidYMid meet","aria-label":"Dust2 小地图",children:[K.jsx("defs",{children:K.jsx("pattern",{id:"mapGrid",width:"8",height:"8",patternUnits:"userSpaceOnUse",children:K.jsx("path",{d:"M 8 0 L 0 0 0 8",fill:"none",stroke:"#b9a988",strokeOpacity:".07",strokeWidth:".25"})})}),Cd.map((e,t)=>K.jsx("rect",{x:e.x1,y:e.z1,width:e.x2-e.x1,height:e.z2-e.z1,className:"map-room"},t)),K.jsx("rect",{x:"-58",y:"-54",width:"104",height:"96",fill:"url(#mapGrid)"}),K.jsx("circle",{cx:Ri.x,cy:Ri.z,r:"6",className:"map-site"}),K.jsx("text",{x:Ri.x,y:Ri.z+1.7,className:"map-letter",children:"A"}),K.jsx("circle",{cx:Ci.x,cy:Ci.z,r:"6",className:"map-site"}),K.jsx("text",{x:Ci.x,y:Ci.z+1.7,className:"map-letter",children:"B"}),K.jsx("text",{x:"-47",y:"-42",className:"map-route",children:"LONG"}),K.jsx("text",{x:"-2",y:"16",className:"map-route",children:"MID"}),K.jsx("text",{x:"-37",y:"-16",className:"map-route",children:"TUNNELS"}),K.jsx("text",{x:"7",y:"-18",className:"map-route",children:"CAT"}),s.bomb.mode!=="none"&&K.jsxs("g",{transform:`translate(${s.bomb.x} ${s.bomb.z})`,children:[K.jsx("circle",{r:"3.8",className:"map-bomb-ring"}),K.jsx("rect",{x:"-1.3",y:"-1.3",width:"2.6",height:"2.6",className:"map-bomb",transform:"rotate(45)"})]}),s.actors.filter(e=>e.alive&&e.visible).map(e=>K.jsxs("g",{transform:`translate(${e.x} ${e.z})`,children:[e.controlled&&K.jsx("circle",{r:"3.1",className:"map-self-ring"}),K.jsx("circle",{r:e.controlled?1.7:1.45,className:e.team==="T"?"map-player-t":"map-player-ct"})]},e.id))]}),K.jsxs("div",{className:"map-legend",children:[K.jsxs("span",{children:[K.jsx("i",{className:"legend-self"}),"你"]}),K.jsxs("span",{children:[K.jsx("i",{className:s.team==="T"?"legend-t":"legend-ct"}),"队友"]}),K.jsxs("span",{children:[K.jsx("i",{className:s.team==="T"?"legend-ct":"legend-t"}),"已发现敌人"]}),K.jsxs("span",{children:[K.jsx("i",{className:"legend-bomb"}),"C4"]})]})]})}function T1(){const s=Yr.useRef(null),e=Yr.useRef(null),[t,r]=Yr.useState(null),[a,l]=Yr.useState("T"),[c,f]=Yr.useState("pistol"),[h,p]=Yr.useState(!1);Yr.useEffect(()=>{if(!s.current)return;const M=new M1(s.current,r);e.current=M;const w=y=>p(y.detail);return window.addEventListener("dust-buy",w),()=>{window.removeEventListener("dust-buy",w),M.dispose(),e.current=null}},[]);const g=()=>{var M;return(M=e.current)==null?void 0:M.start(c,a)},v=(t==null?void 0:t.team)==="T"?t==null?void 0:t.tAlive:t==null?void 0:t.ctAlive,x=(t==null?void 0:t.team)==="T"?t==null?void 0:t.ctAlive:t==null?void 0:t.tAlive,S=(t==null?void 0:t.weapon)==="knife";return K.jsxs("div",{className:"app",children:[K.jsx("div",{ref:s,className:"game-canvas"}),t&&t.phase!=="menu"&&K.jsxs("div",{className:"hud",children:[K.jsx(E1,{data:t}),K.jsxs("div",{className:"scoreboard panel",children:[K.jsxs("div",{className:"team-score t",children:[K.jsx("span",{className:"team-label",children:"TERRORISTS"}),K.jsx("b",{children:t.scoreT}),K.jsxs("small",{children:[t.tAlive," ALIVE"]})]}),K.jsxs("div",{className:"round-center",children:[K.jsxs("span",{children:["ROUND ",String(t.round).padStart(2,"0")]}),K.jsx("strong",{className:t.bomb.mode==="planted"?"danger-time":"",children:t.bomb.mode==="planted"?hg(t.bomb.timer):hg(t.time)}),K.jsx("span",{children:t.mode==="pistol"?"PISTOL ROUND":"FULL BUY"})]}),K.jsxs("div",{className:"team-score ct",children:[K.jsx("span",{className:"team-label",children:"CT FORCES"}),K.jsx("b",{children:t.scoreCT}),K.jsxs("small",{children:[t.ctAlive," ALIVE"]})]})]}),K.jsxs("div",{className:"right-top",children:[K.jsxs("div",{className:"status-chip",children:[K.jsx("span",{className:"status-dot"})," ",t.bomb.mode==="planted"?`C4 已安放 · ${t.bomb.site} 点`:t.bomb.mode==="dropped"?"C4 已掉落":t.bomb.mode==="carried"?"C4 移动中":"C4 已拆除"]}),K.jsx("div",{className:"killfeed",children:t.feed.map(M=>K.jsxs("div",{className:"kill-item",children:[K.jsx("span",{className:M.team==="T"?"text-t":"text-ct",children:M.killer}),K.jsxs("span",{className:"kill-weapon",children:[M.weapon,M.headshot?" ✦":""]}),K.jsx("span",{children:M.victim})]},M.id))})]}),!t.scoped&&K.jsxs("div",{className:"crosshair",style:{"--gap":`${Math.min(18,5+t.spread*170)}px`},children:[K.jsx("i",{className:"cross top"}),K.jsx("i",{className:"cross bottom"}),K.jsx("i",{className:"cross left"}),K.jsx("i",{className:"cross right"}),K.jsx("i",{className:"cross dot"})]}),t.scoped&&K.jsx("div",{className:"scope-overlay",children:K.jsxs("div",{className:"scope-circle",children:[K.jsx("i",{className:"scope-h"}),K.jsx("i",{className:"scope-v"}),K.jsx("span",{className:"scope-center"})]})}),t.action&&K.jsxs("div",{className:"action-prompt",children:[K.jsx("b",{children:t.action}),t.actionProgress>0&&K.jsx("div",{className:"action-track",children:K.jsx("i",{style:{width:`${Math.min(100,t.actionProgress/(t.action.includes("拆除")?5:3)*100)}%`}})})]}),K.jsxs("div",{className:"bottom-left panel",children:[K.jsxs("div",{className:"health",children:[K.jsx("span",{className:"metric-icon",children:"＋"}),K.jsxs("div",{children:[K.jsx("small",{children:"HEALTH"}),K.jsx("strong",{children:t.hp})]})]}),K.jsxs("div",{className:"health",children:[K.jsx("span",{className:"metric-icon armor-icon",children:"◇"}),K.jsxs("div",{children:[K.jsx("small",{children:"ARMOR"}),K.jsx("strong",{children:t.armor})]})]})]}),K.jsxs("div",{className:"bottom-center",children:[K.jsxs("div",{className:"squad-count",children:[K.jsxs("span",{children:[v," ALLIES"]}),K.jsx("i",{})," ",K.jsxs("span",{children:[x," ENEMIES"]})]}),K.jsxs("div",{className:"controls-note",children:["WASD 移动 · SPACE 跳跃 · R 换弹 · 1/2/3 切枪 · E 互动",t.mode==="full"?" · B 武器库":""]})]}),K.jsxs("div",{className:"ammo-panel panel",children:[K.jsxs("div",{className:"ammo-top",children:[K.jsxs("span",{className:"eyebrow",children:["EQUIPPED / ",t.weapon==="knife"?"MELEE":t.weapon==="glock"||t.weapon==="usp"||t.weapon==="deagle"?"SECONDARY":"PRIMARY"]}),K.jsx("span",{className:"weapon-id",children:t.weapon.toUpperCase()})]}),K.jsx("div",{className:"weapon-name",children:t.weaponName}),K.jsxs("div",{className:"ammo-row",children:[K.jsx("strong",{children:S?"∞":String(t.ammo).padStart(2,"0")}),K.jsx("span",{children:S?"近战":`/ ${t.reserve}`})]}),t.reloading&&K.jsx("div",{className:"reload-label",children:"正在换弹..."})]}),t.spectating&&t.phase==="live"&&K.jsxs("div",{className:"spectator-banner",children:[K.jsxs("span",{children:["观战 ",t.name]}),K.jsx("b",{children:"SPACE 切换队友　·　F 接管操控"})]}),t.phase==="ended"&&K.jsxs("div",{className:"round-banner",children:[K.jsx("span",{children:"ROUND COMPLETE"}),K.jsx("strong",{children:t.message}),K.jsx("small",{children:"下一回合即将开始"})]}),!t.pointerLocked&&t.phase==="live"&&!h&&K.jsx("div",{className:"pause-tip",children:"点击画面锁定鼠标并继续游戏"})]}),(t==null?void 0:t.phase)==="menu"&&K.jsxs("div",{className:"menu-screen",children:[K.jsx("div",{className:"menu-grid"}),K.jsxs("div",{className:"menu-content",children:[K.jsxs("div",{className:"menu-overline",children:[K.jsx("span",{className:"live-dot"})," TACTICAL SHOOTER PROTOTYPE ",K.jsx("span",{className:"menu-version",children:"BUILD 01 / PROCEDURAL"})]}),K.jsx("div",{className:"hero-kicker",children:"5 V 5 · FIRST PERSON COMBAT"}),K.jsxs("h1",{children:["DUST",K.jsx("span",{children:"II"})]}),K.jsx("p",{className:"hero-description",children:"经典沙漠战场，完整双包点路线。十名战斗员、真实遮挡交火与 C4 攻防，在浏览器里即时展开。"}),K.jsxs("div",{className:"menu-selection",children:[K.jsxs("div",{children:[K.jsx("label",{children:"选择阵营"}),K.jsxs("div",{className:"segmented",children:[K.jsx("button",{className:a==="T"?"selected t-option":"",onClick:()=>l("T"),children:"T 恐怖分子"}),K.jsx("button",{className:a==="CT"?"selected ct-option":"",onClick:()=>l("CT"),children:"CT 反恐精英"})]})]}),K.jsxs("div",{children:[K.jsx("label",{children:"回合配置"}),K.jsxs("div",{className:"segmented",children:[K.jsx("button",{className:c==="pistol"?"selected":"",onClick:()=>f("pistol"),children:"手枪局"}),K.jsx("button",{className:c==="full"?"selected":"",onClick:()=>f("full"),children:"完整武装"})]})]})]}),K.jsxs("button",{className:"deploy-button",onClick:g,children:[K.jsx("span",{children:"部署至战场"}),K.jsx("strong",{children:"→"})]}),K.jsxs("div",{className:"menu-footer",children:[K.jsx("span",{children:"无需下载资产 · 程序化 3D 地图与音效"}),K.jsx("span",{children:"WASD / 鼠标 / E / R / 1-3"})]})]}),K.jsxs("div",{className:"menu-aside",children:[K.jsx("span",{children:"MISSION BRIEFING"}),K.jsx("strong",{children:"DE_DUST2"}),K.jsxs("p",{children:["T 方：突破防线，在 A 或 B 点安放 C4。",K.jsx("br",{}),"CT 方：守住包点，拆除已安放的 C4。"]}),K.jsx("div",{className:"brief-line"}),K.jsxs("div",{children:["地图区域",K.jsx("span",{children:"09 / CONNECTED"})]}),K.jsxs("div",{children:["对战编制",K.jsx("span",{children:"05 VS 05"})]}),K.jsxs("div",{children:["回合时长",K.jsx("span",{children:"02:10"})]})]})]}),h&&(t==null?void 0:t.phase)==="live"&&K.jsx("div",{className:"buy-screen",children:K.jsxs("div",{className:"buy-panel",children:[K.jsxs("div",{className:"buy-head",children:[K.jsx("span",{children:"FIELD ARMORY"}),K.jsx("button",{onClick:()=>{var M;p(!1),(M=e.current)==null||M.closeBuy()},children:"关闭 ×"})]}),K.jsx("h2",{children:"选择武器"}),K.jsx("p",{children:"原型武器库：可在完整武装模式中随时更换，便于体验不同手感。"}),K.jsx("div",{className:"buy-grid",children:["ak","m4","awp","glock","usp","deagle"].map(M=>K.jsxs("button",{onClick:()=>{var w,y;(w=e.current)==null||w.buyWeapon(M),p(!1),(y=e.current)==null||y.closeBuy()},children:[K.jsx("span",{children:Pn[M].slot==="primary"?"主武器":"副武器"}),K.jsx("strong",{children:Pn[M].name}),K.jsxs("small",{children:[Pn[M].magazine," 发弹匣 · ",Pn[M].damage," 基础伤害"]})]},M))})]})})]})}Bv.createRoot(document.getElementById("root")).render(K.jsx(T1,{}));

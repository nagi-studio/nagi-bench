(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function t(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(o){if(o.ep)return;o.ep=!0;const a=t(o);fetch(o.href,a)}})();function ig(s){return s&&s.__esModule&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s}var Qu={exports:{}},Yo={},eh={exports:{}},_t={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Tm;function bx(){if(Tm)return _t;Tm=1;var s=Symbol.for("react.element"),e=Symbol.for("react.portal"),t=Symbol.for("react.fragment"),i=Symbol.for("react.strict_mode"),o=Symbol.for("react.profiler"),a=Symbol.for("react.provider"),c=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),f=Symbol.for("react.suspense"),d=Symbol.for("react.memo"),m=Symbol.for("react.lazy"),g=Symbol.iterator;function v(k){return k===null||typeof k!="object"?null:(k=g&&k[g]||k["@@iterator"],typeof k=="function"?k:null)}var _={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},M=Object.assign,w={};function S(k,ie,ze){this.props=k,this.context=ie,this.refs=w,this.updater=ze||_}S.prototype.isReactComponent={},S.prototype.setState=function(k,ie){if(typeof k!="object"&&typeof k!="function"&&k!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,k,ie,"setState")},S.prototype.forceUpdate=function(k){this.updater.enqueueForceUpdate(this,k,"forceUpdate")};function y(){}y.prototype=S.prototype;function N(k,ie,ze){this.props=k,this.context=ie,this.refs=w,this.updater=ze||_}var b=N.prototype=new y;b.constructor=N,M(b,S.prototype),b.isPureReactComponent=!0;var A=Array.isArray,W=Object.prototype.hasOwnProperty,U={current:null},z={key:!0,ref:!0,__self:!0,__source:!0};function V(k,ie,ze){var Q,de={},we=null,ge=null;if(ie!=null)for(Q in ie.ref!==void 0&&(ge=ie.ref),ie.key!==void 0&&(we=""+ie.key),ie)W.call(ie,Q)&&!z.hasOwnProperty(Q)&&(de[Q]=ie[Q]);var be=arguments.length-2;if(be===1)de.children=ze;else if(1<be){for(var Be=Array(be),Ke=0;Ke<be;Ke++)Be[Ke]=arguments[Ke+2];de.children=Be}if(k&&k.defaultProps)for(Q in be=k.defaultProps,be)de[Q]===void 0&&(de[Q]=be[Q]);return{$$typeof:s,type:k,key:we,ref:ge,props:de,_owner:U.current}}function L(k,ie){return{$$typeof:s,type:k.type,key:ie,ref:k.ref,props:k.props,_owner:k._owner}}function R(k){return typeof k=="object"&&k!==null&&k.$$typeof===s}function B(k){var ie={"=":"=0",":":"=2"};return"$"+k.replace(/[=:]/g,function(ze){return ie[ze]})}var ee=/\/+/g;function K(k,ie){return typeof k=="object"&&k!==null&&k.key!=null?B(""+k.key):ie.toString(36)}function oe(k,ie,ze,Q,de){var we=typeof k;(we==="undefined"||we==="boolean")&&(k=null);var ge=!1;if(k===null)ge=!0;else switch(we){case"string":case"number":ge=!0;break;case"object":switch(k.$$typeof){case s:case e:ge=!0}}if(ge)return ge=k,de=de(ge),k=Q===""?"."+K(ge,0):Q,A(de)?(ze="",k!=null&&(ze=k.replace(ee,"$&/")+"/"),oe(de,ie,ze,"",function(Ke){return Ke})):de!=null&&(R(de)&&(de=L(de,ze+(!de.key||ge&&ge.key===de.key?"":(""+de.key).replace(ee,"$&/")+"/")+k)),ie.push(de)),1;if(ge=0,Q=Q===""?".":Q+":",A(k))for(var be=0;be<k.length;be++){we=k[be];var Be=Q+K(we,be);ge+=oe(we,ie,ze,Be,de)}else if(Be=v(k),typeof Be=="function")for(k=Be.call(k),be=0;!(we=k.next()).done;)we=we.value,Be=Q+K(we,be++),ge+=oe(we,ie,ze,Be,de);else if(we==="object")throw ie=String(k),Error("Objects are not valid as a React child (found: "+(ie==="[object Object]"?"object with keys {"+Object.keys(k).join(", ")+"}":ie)+"). If you meant to render a collection of children, use an array instead.");return ge}function he(k,ie,ze){if(k==null)return k;var Q=[],de=0;return oe(k,Q,"","",function(we){return ie.call(ze,we,de++)}),Q}function se(k){if(k._status===-1){var ie=k._result;ie=ie(),ie.then(function(ze){(k._status===0||k._status===-1)&&(k._status=1,k._result=ze)},function(ze){(k._status===0||k._status===-1)&&(k._status=2,k._result=ze)}),k._status===-1&&(k._status=0,k._result=ie)}if(k._status===1)return k._result.default;throw k._result}var ue={current:null},G={transition:null},ce={ReactCurrentDispatcher:ue,ReactCurrentBatchConfig:G,ReactCurrentOwner:U};function ae(){throw Error("act(...) is not supported in production builds of React.")}return _t.Children={map:he,forEach:function(k,ie,ze){he(k,function(){ie.apply(this,arguments)},ze)},count:function(k){var ie=0;return he(k,function(){ie++}),ie},toArray:function(k){return he(k,function(ie){return ie})||[]},only:function(k){if(!R(k))throw Error("React.Children.only expected to receive a single React element child.");return k}},_t.Component=S,_t.Fragment=t,_t.Profiler=o,_t.PureComponent=N,_t.StrictMode=i,_t.Suspense=f,_t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ce,_t.act=ae,_t.cloneElement=function(k,ie,ze){if(k==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+k+".");var Q=M({},k.props),de=k.key,we=k.ref,ge=k._owner;if(ie!=null){if(ie.ref!==void 0&&(we=ie.ref,ge=U.current),ie.key!==void 0&&(de=""+ie.key),k.type&&k.type.defaultProps)var be=k.type.defaultProps;for(Be in ie)W.call(ie,Be)&&!z.hasOwnProperty(Be)&&(Q[Be]=ie[Be]===void 0&&be!==void 0?be[Be]:ie[Be])}var Be=arguments.length-2;if(Be===1)Q.children=ze;else if(1<Be){be=Array(Be);for(var Ke=0;Ke<Be;Ke++)be[Ke]=arguments[Ke+2];Q.children=be}return{$$typeof:s,type:k.type,key:de,ref:we,props:Q,_owner:ge}},_t.createContext=function(k){return k={$$typeof:c,_currentValue:k,_currentValue2:k,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},k.Provider={$$typeof:a,_context:k},k.Consumer=k},_t.createElement=V,_t.createFactory=function(k){var ie=V.bind(null,k);return ie.type=k,ie},_t.createRef=function(){return{current:null}},_t.forwardRef=function(k){return{$$typeof:h,render:k}},_t.isValidElement=R,_t.lazy=function(k){return{$$typeof:m,_payload:{_status:-1,_result:k},_init:se}},_t.memo=function(k,ie){return{$$typeof:d,type:k,compare:ie===void 0?null:ie}},_t.startTransition=function(k){var ie=G.transition;G.transition={};try{k()}finally{G.transition=ie}},_t.unstable_act=ae,_t.useCallback=function(k,ie){return ue.current.useCallback(k,ie)},_t.useContext=function(k){return ue.current.useContext(k)},_t.useDebugValue=function(){},_t.useDeferredValue=function(k){return ue.current.useDeferredValue(k)},_t.useEffect=function(k,ie){return ue.current.useEffect(k,ie)},_t.useId=function(){return ue.current.useId()},_t.useImperativeHandle=function(k,ie,ze){return ue.current.useImperativeHandle(k,ie,ze)},_t.useInsertionEffect=function(k,ie){return ue.current.useInsertionEffect(k,ie)},_t.useLayoutEffect=function(k,ie){return ue.current.useLayoutEffect(k,ie)},_t.useMemo=function(k,ie){return ue.current.useMemo(k,ie)},_t.useReducer=function(k,ie,ze){return ue.current.useReducer(k,ie,ze)},_t.useRef=function(k){return ue.current.useRef(k)},_t.useState=function(k){return ue.current.useState(k)},_t.useSyncExternalStore=function(k,ie,ze){return ue.current.useSyncExternalStore(k,ie,ze)},_t.useTransition=function(){return ue.current.useTransition()},_t.version="18.3.1",_t}var Am;function Of(){return Am||(Am=1,eh.exports=bx()),eh.exports}/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Cm;function Px(){if(Cm)return Yo;Cm=1;var s=Of(),e=Symbol.for("react.element"),t=Symbol.for("react.fragment"),i=Object.prototype.hasOwnProperty,o=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function c(h,f,d){var m,g={},v=null,_=null;d!==void 0&&(v=""+d),f.key!==void 0&&(v=""+f.key),f.ref!==void 0&&(_=f.ref);for(m in f)i.call(f,m)&&!a.hasOwnProperty(m)&&(g[m]=f[m]);if(h&&h.defaultProps)for(m in f=h.defaultProps,f)g[m]===void 0&&(g[m]=f[m]);return{$$typeof:e,type:h,key:v,ref:_,props:g,_owner:o.current}}return Yo.Fragment=t,Yo.jsx=c,Yo.jsxs=c,Yo}var Rm;function Lx(){return Rm||(Rm=1,Qu.exports=Px()),Qu.exports}var E=Lx(),qn=Of();const Nx=ig(qn);var wl={},th={exports:{}},Dn={},nh={exports:{}},ih={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bm;function Ix(){return bm||(bm=1,(function(s){function e(G,ce){var ae=G.length;G.push(ce);e:for(;0<ae;){var k=ae-1>>>1,ie=G[k];if(0<o(ie,ce))G[k]=ce,G[ae]=ie,ae=k;else break e}}function t(G){return G.length===0?null:G[0]}function i(G){if(G.length===0)return null;var ce=G[0],ae=G.pop();if(ae!==ce){G[0]=ae;e:for(var k=0,ie=G.length,ze=ie>>>1;k<ze;){var Q=2*(k+1)-1,de=G[Q],we=Q+1,ge=G[we];if(0>o(de,ae))we<ie&&0>o(ge,de)?(G[k]=ge,G[we]=ae,k=we):(G[k]=de,G[Q]=ae,k=Q);else if(we<ie&&0>o(ge,ae))G[k]=ge,G[we]=ae,k=we;else break e}}return ce}function o(G,ce){var ae=G.sortIndex-ce.sortIndex;return ae!==0?ae:G.id-ce.id}if(typeof performance=="object"&&typeof performance.now=="function"){var a=performance;s.unstable_now=function(){return a.now()}}else{var c=Date,h=c.now();s.unstable_now=function(){return c.now()-h}}var f=[],d=[],m=1,g=null,v=3,_=!1,M=!1,w=!1,S=typeof setTimeout=="function"?setTimeout:null,y=typeof clearTimeout=="function"?clearTimeout:null,N=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function b(G){for(var ce=t(d);ce!==null;){if(ce.callback===null)i(d);else if(ce.startTime<=G)i(d),ce.sortIndex=ce.expirationTime,e(f,ce);else break;ce=t(d)}}function A(G){if(w=!1,b(G),!M)if(t(f)!==null)M=!0,se(W);else{var ce=t(d);ce!==null&&ue(A,ce.startTime-G)}}function W(G,ce){M=!1,w&&(w=!1,y(V),V=-1),_=!0;var ae=v;try{for(b(ce),g=t(f);g!==null&&(!(g.expirationTime>ce)||G&&!B());){var k=g.callback;if(typeof k=="function"){g.callback=null,v=g.priorityLevel;var ie=k(g.expirationTime<=ce);ce=s.unstable_now(),typeof ie=="function"?g.callback=ie:g===t(f)&&i(f),b(ce)}else i(f);g=t(f)}if(g!==null)var ze=!0;else{var Q=t(d);Q!==null&&ue(A,Q.startTime-ce),ze=!1}return ze}finally{g=null,v=ae,_=!1}}var U=!1,z=null,V=-1,L=5,R=-1;function B(){return!(s.unstable_now()-R<L)}function ee(){if(z!==null){var G=s.unstable_now();R=G;var ce=!0;try{ce=z(!0,G)}finally{ce?K():(U=!1,z=null)}}else U=!1}var K;if(typeof N=="function")K=function(){N(ee)};else if(typeof MessageChannel<"u"){var oe=new MessageChannel,he=oe.port2;oe.port1.onmessage=ee,K=function(){he.postMessage(null)}}else K=function(){S(ee,0)};function se(G){z=G,U||(U=!0,K())}function ue(G,ce){V=S(function(){G(s.unstable_now())},ce)}s.unstable_IdlePriority=5,s.unstable_ImmediatePriority=1,s.unstable_LowPriority=4,s.unstable_NormalPriority=3,s.unstable_Profiling=null,s.unstable_UserBlockingPriority=2,s.unstable_cancelCallback=function(G){G.callback=null},s.unstable_continueExecution=function(){M||_||(M=!0,se(W))},s.unstable_forceFrameRate=function(G){0>G||125<G?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):L=0<G?Math.floor(1e3/G):5},s.unstable_getCurrentPriorityLevel=function(){return v},s.unstable_getFirstCallbackNode=function(){return t(f)},s.unstable_next=function(G){switch(v){case 1:case 2:case 3:var ce=3;break;default:ce=v}var ae=v;v=ce;try{return G()}finally{v=ae}},s.unstable_pauseExecution=function(){},s.unstable_requestPaint=function(){},s.unstable_runWithPriority=function(G,ce){switch(G){case 1:case 2:case 3:case 4:case 5:break;default:G=3}var ae=v;v=G;try{return ce()}finally{v=ae}},s.unstable_scheduleCallback=function(G,ce,ae){var k=s.unstable_now();switch(typeof ae=="object"&&ae!==null?(ae=ae.delay,ae=typeof ae=="number"&&0<ae?k+ae:k):ae=k,G){case 1:var ie=-1;break;case 2:ie=250;break;case 5:ie=1073741823;break;case 4:ie=1e4;break;default:ie=5e3}return ie=ae+ie,G={id:m++,callback:ce,priorityLevel:G,startTime:ae,expirationTime:ie,sortIndex:-1},ae>k?(G.sortIndex=ae,e(d,G),t(f)===null&&G===t(d)&&(w?(y(V),V=-1):w=!0,ue(A,ae-k))):(G.sortIndex=ie,e(f,G),M||_||(M=!0,se(W))),G},s.unstable_shouldYield=B,s.unstable_wrapCallback=function(G){var ce=v;return function(){var ae=v;v=ce;try{return G.apply(this,arguments)}finally{v=ae}}}})(ih)),ih}var Pm;function Dx(){return Pm||(Pm=1,nh.exports=Ix()),nh.exports}/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Lm;function Ux(){if(Lm)return Dn;Lm=1;var s=Of(),e=Dx();function t(n){for(var r="https://reactjs.org/docs/error-decoder.html?invariant="+n,l=1;l<arguments.length;l++)r+="&args[]="+encodeURIComponent(arguments[l]);return"Minified React error #"+n+"; visit "+r+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var i=new Set,o={};function a(n,r){c(n,r),c(n+"Capture",r)}function c(n,r){for(o[n]=r,n=0;n<r.length;n++)i.add(r[n])}var h=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),f=Object.prototype.hasOwnProperty,d=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,m={},g={};function v(n){return f.call(g,n)?!0:f.call(m,n)?!1:d.test(n)?g[n]=!0:(m[n]=!0,!1)}function _(n,r,l,u){if(l!==null&&l.type===0)return!1;switch(typeof r){case"function":case"symbol":return!0;case"boolean":return u?!1:l!==null?!l.acceptsBooleans:(n=n.toLowerCase().slice(0,5),n!=="data-"&&n!=="aria-");default:return!1}}function M(n,r,l,u){if(r===null||typeof r>"u"||_(n,r,l,u))return!0;if(u)return!1;if(l!==null)switch(l.type){case 3:return!r;case 4:return r===!1;case 5:return isNaN(r);case 6:return isNaN(r)||1>r}return!1}function w(n,r,l,u,p,x,T){this.acceptsBooleans=r===2||r===3||r===4,this.attributeName=u,this.attributeNamespace=p,this.mustUseProperty=l,this.propertyName=n,this.type=r,this.sanitizeURL=x,this.removeEmptyString=T}var S={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n){S[n]=new w(n,0,!1,n,null,!1,!1)}),[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(n){var r=n[0];S[r]=new w(r,1,!1,n[1],null,!1,!1)}),["contentEditable","draggable","spellCheck","value"].forEach(function(n){S[n]=new w(n,2,!1,n.toLowerCase(),null,!1,!1)}),["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(n){S[n]=new w(n,2,!1,n,null,!1,!1)}),"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n){S[n]=new w(n,3,!1,n.toLowerCase(),null,!1,!1)}),["checked","multiple","muted","selected"].forEach(function(n){S[n]=new w(n,3,!0,n,null,!1,!1)}),["capture","download"].forEach(function(n){S[n]=new w(n,4,!1,n,null,!1,!1)}),["cols","rows","size","span"].forEach(function(n){S[n]=new w(n,6,!1,n,null,!1,!1)}),["rowSpan","start"].forEach(function(n){S[n]=new w(n,5,!1,n.toLowerCase(),null,!1,!1)});var y=/[\-:]([a-z])/g;function N(n){return n[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n){var r=n.replace(y,N);S[r]=new w(r,1,!1,n,null,!1,!1)}),"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n){var r=n.replace(y,N);S[r]=new w(r,1,!1,n,"http://www.w3.org/1999/xlink",!1,!1)}),["xml:base","xml:lang","xml:space"].forEach(function(n){var r=n.replace(y,N);S[r]=new w(r,1,!1,n,"http://www.w3.org/XML/1998/namespace",!1,!1)}),["tabIndex","crossOrigin"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!1,!1)}),S.xlinkHref=new w("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1),["src","href","action","formAction"].forEach(function(n){S[n]=new w(n,1,!1,n.toLowerCase(),null,!0,!0)});function b(n,r,l,u){var p=S.hasOwnProperty(r)?S[r]:null;(p!==null?p.type!==0:u||!(2<r.length)||r[0]!=="o"&&r[0]!=="O"||r[1]!=="n"&&r[1]!=="N")&&(M(r,l,p,u)&&(l=null),u||p===null?v(r)&&(l===null?n.removeAttribute(r):n.setAttribute(r,""+l)):p.mustUseProperty?n[p.propertyName]=l===null?p.type===3?!1:"":l:(r=p.attributeName,u=p.attributeNamespace,l===null?n.removeAttribute(r):(p=p.type,l=p===3||p===4&&l===!0?"":""+l,u?n.setAttributeNS(u,r,l):n.setAttribute(r,l))))}var A=s.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,W=Symbol.for("react.element"),U=Symbol.for("react.portal"),z=Symbol.for("react.fragment"),V=Symbol.for("react.strict_mode"),L=Symbol.for("react.profiler"),R=Symbol.for("react.provider"),B=Symbol.for("react.context"),ee=Symbol.for("react.forward_ref"),K=Symbol.for("react.suspense"),oe=Symbol.for("react.suspense_list"),he=Symbol.for("react.memo"),se=Symbol.for("react.lazy"),ue=Symbol.for("react.offscreen"),G=Symbol.iterator;function ce(n){return n===null||typeof n!="object"?null:(n=G&&n[G]||n["@@iterator"],typeof n=="function"?n:null)}var ae=Object.assign,k;function ie(n){if(k===void 0)try{throw Error()}catch(l){var r=l.stack.trim().match(/\n( *(at )?)/);k=r&&r[1]||""}return`
`+k+n}var ze=!1;function Q(n,r){if(!n||ze)return"";ze=!0;var l=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(r)if(r=function(){throw Error()},Object.defineProperty(r.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(r,[])}catch(te){var u=te}Reflect.construct(n,[],r)}else{try{r.call()}catch(te){u=te}n.call(r.prototype)}else{try{throw Error()}catch(te){u=te}n()}}catch(te){if(te&&u&&typeof te.stack=="string"){for(var p=te.stack.split(`
`),x=u.stack.split(`
`),T=p.length-1,D=x.length-1;1<=T&&0<=D&&p[T]!==x[D];)D--;for(;1<=T&&0<=D;T--,D--)if(p[T]!==x[D]){if(T!==1||D!==1)do if(T--,D--,0>D||p[T]!==x[D]){var H=`
`+p[T].replace(" at new "," at ");return n.displayName&&H.includes("<anonymous>")&&(H=H.replace("<anonymous>",n.displayName)),H}while(1<=T&&0<=D);break}}}finally{ze=!1,Error.prepareStackTrace=l}return(n=n?n.displayName||n.name:"")?ie(n):""}function de(n){switch(n.tag){case 5:return ie(n.type);case 16:return ie("Lazy");case 13:return ie("Suspense");case 19:return ie("SuspenseList");case 0:case 2:case 15:return n=Q(n.type,!1),n;case 11:return n=Q(n.type.render,!1),n;case 1:return n=Q(n.type,!0),n;default:return""}}function we(n){if(n==null)return null;if(typeof n=="function")return n.displayName||n.name||null;if(typeof n=="string")return n;switch(n){case z:return"Fragment";case U:return"Portal";case L:return"Profiler";case V:return"StrictMode";case K:return"Suspense";case oe:return"SuspenseList"}if(typeof n=="object")switch(n.$$typeof){case B:return(n.displayName||"Context")+".Consumer";case R:return(n._context.displayName||"Context")+".Provider";case ee:var r=n.render;return n=n.displayName,n||(n=r.displayName||r.name||"",n=n!==""?"ForwardRef("+n+")":"ForwardRef"),n;case he:return r=n.displayName||null,r!==null?r:we(n.type)||"Memo";case se:r=n._payload,n=n._init;try{return we(n(r))}catch{}}return null}function ge(n){var r=n.type;switch(n.tag){case 24:return"Cache";case 9:return(r.displayName||"Context")+".Consumer";case 10:return(r._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return n=r.render,n=n.displayName||n.name||"",r.displayName||(n!==""?"ForwardRef("+n+")":"ForwardRef");case 7:return"Fragment";case 5:return r;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return we(r);case 8:return r===V?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof r=="function")return r.displayName||r.name||null;if(typeof r=="string")return r}return null}function be(n){switch(typeof n){case"boolean":case"number":case"string":case"undefined":return n;case"object":return n;default:return""}}function Be(n){var r=n.type;return(n=n.nodeName)&&n.toLowerCase()==="input"&&(r==="checkbox"||r==="radio")}function Ke(n){var r=Be(n)?"checked":"value",l=Object.getOwnPropertyDescriptor(n.constructor.prototype,r),u=""+n[r];if(!n.hasOwnProperty(r)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var p=l.get,x=l.set;return Object.defineProperty(n,r,{configurable:!0,get:function(){return p.call(this)},set:function(T){u=""+T,x.call(this,T)}}),Object.defineProperty(n,r,{enumerable:l.enumerable}),{getValue:function(){return u},setValue:function(T){u=""+T},stopTracking:function(){n._valueTracker=null,delete n[r]}}}}function vt(n){n._valueTracker||(n._valueTracker=Ke(n))}function ve(n){if(!n)return!1;var r=n._valueTracker;if(!r)return!0;var l=r.getValue(),u="";return n&&(u=Be(n)?n.checked?"true":"false":n.value),n=u,n!==l?(r.setValue(n),!0):!1}function Ae(n){if(n=n||(typeof document<"u"?document:void 0),typeof n>"u")return null;try{return n.activeElement||n.body}catch{return n.body}}function O(n,r){var l=r.checked;return ae({},r,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:l??n._wrapperState.initialChecked})}function Ze(n,r){var l=r.defaultValue==null?"":r.defaultValue,u=r.checked!=null?r.checked:r.defaultChecked;l=be(r.value!=null?r.value:l),n._wrapperState={initialChecked:u,initialValue:l,controlled:r.type==="checkbox"||r.type==="radio"?r.checked!=null:r.value!=null}}function Me(n,r){r=r.checked,r!=null&&b(n,"checked",r,!1)}function Ve(n,r){Me(n,r);var l=be(r.value),u=r.type;if(l!=null)u==="number"?(l===0&&n.value===""||n.value!=l)&&(n.value=""+l):n.value!==""+l&&(n.value=""+l);else if(u==="submit"||u==="reset"){n.removeAttribute("value");return}r.hasOwnProperty("value")?it(n,r.type,l):r.hasOwnProperty("defaultValue")&&it(n,r.type,be(r.defaultValue)),r.checked==null&&r.defaultChecked!=null&&(n.defaultChecked=!!r.defaultChecked)}function Pe(n,r,l){if(r.hasOwnProperty("value")||r.hasOwnProperty("defaultValue")){var u=r.type;if(!(u!=="submit"&&u!=="reset"||r.value!==void 0&&r.value!==null))return;r=""+n._wrapperState.initialValue,l||r===n.value||(n.value=r),n.defaultValue=r}l=n.name,l!==""&&(n.name=""),n.defaultChecked=!!n._wrapperState.initialChecked,l!==""&&(n.name=l)}function it(n,r,l){(r!=="number"||Ae(n.ownerDocument)!==n)&&(l==null?n.defaultValue=""+n._wrapperState.initialValue:n.defaultValue!==""+l&&(n.defaultValue=""+l))}var Fe=Array.isArray;function I(n,r,l,u){if(n=n.options,r){r={};for(var p=0;p<l.length;p++)r["$"+l[p]]=!0;for(l=0;l<n.length;l++)p=r.hasOwnProperty("$"+n[l].value),n[l].selected!==p&&(n[l].selected=p),p&&u&&(n[l].defaultSelected=!0)}else{for(l=""+be(l),r=null,p=0;p<n.length;p++){if(n[p].value===l){n[p].selected=!0,u&&(n[p].defaultSelected=!0);return}r!==null||n[p].disabled||(r=n[p])}r!==null&&(r.selected=!0)}}function C(n,r){if(r.dangerouslySetInnerHTML!=null)throw Error(t(91));return ae({},r,{value:void 0,defaultValue:void 0,children:""+n._wrapperState.initialValue})}function Z(n,r){var l=r.value;if(l==null){if(l=r.children,r=r.defaultValue,l!=null){if(r!=null)throw Error(t(92));if(Fe(l)){if(1<l.length)throw Error(t(93));l=l[0]}r=l}r==null&&(r=""),l=r}n._wrapperState={initialValue:be(l)}}function fe(n,r){var l=be(r.value),u=be(r.defaultValue);l!=null&&(l=""+l,l!==n.value&&(n.value=l),r.defaultValue==null&&n.defaultValue!==l&&(n.defaultValue=l)),u!=null&&(n.defaultValue=""+u)}function xe(n){var r=n.textContent;r===n._wrapperState.initialValue&&r!==""&&r!==null&&(n.value=r)}function pe(n){switch(n){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Ye(n,r){return n==null||n==="http://www.w3.org/1999/xhtml"?pe(r):n==="http://www.w3.org/2000/svg"&&r==="foreignObject"?"http://www.w3.org/1999/xhtml":n}var Le,He=(function(n){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(r,l,u,p){MSApp.execUnsafeLocalFunction(function(){return n(r,l,u,p)})}:n})(function(n,r){if(n.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in n)n.innerHTML=r;else{for(Le=Le||document.createElement("div"),Le.innerHTML="<svg>"+r.valueOf().toString()+"</svg>",r=Le.firstChild;n.firstChild;)n.removeChild(n.firstChild);for(;r.firstChild;)n.appendChild(r.firstChild)}});function dt(n,r){if(r){var l=n.firstChild;if(l&&l===n.lastChild&&l.nodeType===3){l.nodeValue=r;return}}n.textContent=r}var Ee={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},We=["Webkit","ms","Moz","O"];Object.keys(Ee).forEach(function(n){We.forEach(function(r){r=r+n.charAt(0).toUpperCase()+n.substring(1),Ee[r]=Ee[n]})});function ot(n,r,l){return r==null||typeof r=="boolean"||r===""?"":l||typeof r!="number"||r===0||Ee.hasOwnProperty(n)&&Ee[n]?(""+r).trim():r+"px"}function at(n,r){n=n.style;for(var l in r)if(r.hasOwnProperty(l)){var u=l.indexOf("--")===0,p=ot(l,r[l],u);l==="float"&&(l="cssFloat"),u?n.setProperty(l,p):n[l]=p}}var je=ae({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function xt(n,r){if(r){if(je[n]&&(r.children!=null||r.dangerouslySetInnerHTML!=null))throw Error(t(137,n));if(r.dangerouslySetInnerHTML!=null){if(r.children!=null)throw Error(t(60));if(typeof r.dangerouslySetInnerHTML!="object"||!("__html"in r.dangerouslySetInnerHTML))throw Error(t(61))}if(r.style!=null&&typeof r.style!="object")throw Error(t(62))}}function ht(n,r){if(n.indexOf("-")===-1)return typeof r.is=="string";switch(n){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var bt=null;function X(n){return n=n.target||n.srcElement||window,n.correspondingUseElement&&(n=n.correspondingUseElement),n.nodeType===3?n.parentNode:n}var Ne=null,le=null,me=null;function Oe(n){if(n=No(n)){if(typeof Ne!="function")throw Error(t(280));var r=n.stateNode;r&&(r=ka(r),Ne(n.stateNode,n.type,r))}}function Ue(n){le?me?me.push(n):me=[n]:le=n}function ft(){if(le){var n=le,r=me;if(me=le=null,Oe(n),r)for(n=0;n<r.length;n++)Oe(r[n])}}function zt(n,r){return n(r)}function Kt(){}var Et=!1;function Cn(n,r,l){if(Et)return n(r,l);Et=!0;try{return zt(n,r,l)}finally{Et=!1,(le!==null||me!==null)&&(Kt(),ft())}}function Sn(n,r){var l=n.stateNode;if(l===null)return null;var u=ka(l);if(u===null)return null;l=u[r];e:switch(r){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(u=!u.disabled)||(n=n.type,u=!(n==="button"||n==="input"||n==="select"||n==="textarea")),n=!u;break e;default:n=!1}if(n)return null;if(l&&typeof l!="function")throw Error(t(231,r,typeof l));return l}var fs=!1;if(h)try{var Qi={};Object.defineProperty(Qi,"passive",{get:function(){fs=!0}}),window.addEventListener("test",Qi,Qi),window.removeEventListener("test",Qi,Qi)}catch{fs=!1}function Li(n,r,l,u,p,x,T,D,H){var te=Array.prototype.slice.call(arguments,3);try{r.apply(l,te)}catch(ye){this.onError(ye)}}var Ni=!1,Dr=null,Ur=!1,er=null,_a={onError:function(n){Ni=!0,Dr=n}};function ds(n,r,l,u,p,x,T,D,H){Ni=!1,Dr=null,Li.apply(_a,arguments)}function ya(n,r,l,u,p,x,T,D,H){if(ds.apply(this,arguments),Ni){if(Ni){var te=Dr;Ni=!1,Dr=null}else throw Error(t(198));Ur||(Ur=!0,er=te)}}function yi(n){var r=n,l=n;if(n.alternate)for(;r.return;)r=r.return;else{n=r;do r=n,(r.flags&4098)!==0&&(l=r.return),n=r.return;while(n)}return r.tag===3?l:null}function Sa(n){if(n.tag===13){var r=n.memoizedState;if(r===null&&(n=n.alternate,n!==null&&(r=n.memoizedState)),r!==null)return r.dehydrated}return null}function Ma(n){if(yi(n)!==n)throw Error(t(188))}function Sc(n){var r=n.alternate;if(!r){if(r=yi(n),r===null)throw Error(t(188));return r!==n?null:n}for(var l=n,u=r;;){var p=l.return;if(p===null)break;var x=p.alternate;if(x===null){if(u=p.return,u!==null){l=u;continue}break}if(p.child===x.child){for(x=p.child;x;){if(x===l)return Ma(p),n;if(x===u)return Ma(p),r;x=x.sibling}throw Error(t(188))}if(l.return!==u.return)l=p,u=x;else{for(var T=!1,D=p.child;D;){if(D===l){T=!0,l=p,u=x;break}if(D===u){T=!0,u=p,l=x;break}D=D.sibling}if(!T){for(D=x.child;D;){if(D===l){T=!0,l=x,u=p;break}if(D===u){T=!0,u=x,l=p;break}D=D.sibling}if(!T)throw Error(t(189))}}if(l.alternate!==u)throw Error(t(190))}if(l.tag!==3)throw Error(t(188));return l.stateNode.current===l?n:r}function P(n){return n=Sc(n),n!==null?Y(n):null}function Y(n){if(n.tag===5||n.tag===6)return n;for(n=n.child;n!==null;){var r=Y(n);if(r!==null)return r;n=n.sibling}return null}var ne=e.unstable_scheduleCallback,re=e.unstable_cancelCallback,q=e.unstable_shouldYield,Re=e.unstable_requestPaint,Te=e.unstable_now,Je=e.unstable_getCurrentPriorityLevel,qe=e.unstable_ImmediatePriority,lt=e.unstable_UserBlockingPriority,ut=e.unstable_NormalPriority,Qe=e.unstable_LowPriority,Mt=e.unstable_IdlePriority,Rt=null,St=null;function fn(n){if(St&&typeof St.onCommitFiberRoot=="function")try{St.onCommitFiberRoot(Rt,n,void 0,(n.current.flags&128)===128)}catch{}}var pt=Math.clz32?Math.clz32:At,tt=Math.log,oi=Math.LN2;function At(n){return n>>>=0,n===0?32:31-(tt(n)/oi|0)|0}var dn=64,ai=4194304;function Zt(n){switch(n&-n){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return n&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return n}}function Si(n,r){var l=n.pendingLanes;if(l===0)return 0;var u=0,p=n.suspendedLanes,x=n.pingedLanes,T=l&268435455;if(T!==0){var D=T&~p;D!==0?u=Zt(D):(x&=T,x!==0&&(u=Zt(x)))}else T=l&~p,T!==0?u=Zt(T):x!==0&&(u=Zt(x));if(u===0)return 0;if(r!==0&&r!==u&&(r&p)===0&&(p=u&-u,x=r&-r,p>=x||p===16&&(x&4194240)!==0))return r;if((u&4)!==0&&(u|=l&16),r=n.entangledLanes,r!==0)for(n=n.entanglements,r&=u;0<r;)l=31-pt(r),p=1<<l,u|=n[l],r&=~p;return u}function Ft(n,r){switch(n){case 1:case 2:case 4:return r+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return r+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Kn(n,r){for(var l=n.suspendedLanes,u=n.pingedLanes,p=n.expirationTimes,x=n.pendingLanes;0<x;){var T=31-pt(x),D=1<<T,H=p[T];H===-1?((D&l)===0||(D&u)!==0)&&(p[T]=Ft(D,r)):H<=r&&(n.expiredLanes|=D),x&=~D}}function Ii(n){return n=n.pendingLanes&-1073741825,n!==0?n:n&1073741824?1073741824:0}function Mn(){var n=dn;return dn<<=1,(dn&4194240)===0&&(dn=64),n}function Zn(n){for(var r=[],l=0;31>l;l++)r.push(n);return r}function Rn(n,r,l){n.pendingLanes|=r,r!==536870912&&(n.suspendedLanes=0,n.pingedLanes=0),n=n.eventTimes,r=31-pt(r),n[r]=l}function Ea(n,r){var l=n.pendingLanes&~r;n.pendingLanes=r,n.suspendedLanes=0,n.pingedLanes=0,n.expiredLanes&=r,n.mutableReadLanes&=r,n.entangledLanes&=r,r=n.entanglements;var u=n.eventTimes;for(n=n.expirationTimes;0<l;){var p=31-pt(l),x=1<<p;r[p]=0,u[p]=-1,n[p]=-1,l&=~x}}function Mc(n,r){var l=n.entangledLanes|=r;for(n=n.entanglements;l;){var u=31-pt(l),p=1<<u;p&r|n[u]&r&&(n[u]|=r),l&=~p}}var Pt=0;function id(n){return n&=-n,1<n?4<n?(n&268435455)!==0?16:536870912:4:1}var rd,Ec,sd,od,ad,wc=!1,wa=[],tr=null,nr=null,ir=null,go=new Map,vo=new Map,rr=[],Zg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function ld(n,r){switch(n){case"focusin":case"focusout":tr=null;break;case"dragenter":case"dragleave":nr=null;break;case"mouseover":case"mouseout":ir=null;break;case"pointerover":case"pointerout":go.delete(r.pointerId);break;case"gotpointercapture":case"lostpointercapture":vo.delete(r.pointerId)}}function xo(n,r,l,u,p,x){return n===null||n.nativeEvent!==x?(n={blockedOn:r,domEventName:l,eventSystemFlags:u,nativeEvent:x,targetContainers:[p]},r!==null&&(r=No(r),r!==null&&Ec(r)),n):(n.eventSystemFlags|=u,r=n.targetContainers,p!==null&&r.indexOf(p)===-1&&r.push(p),n)}function Jg(n,r,l,u,p){switch(r){case"focusin":return tr=xo(tr,n,r,l,u,p),!0;case"dragenter":return nr=xo(nr,n,r,l,u,p),!0;case"mouseover":return ir=xo(ir,n,r,l,u,p),!0;case"pointerover":var x=p.pointerId;return go.set(x,xo(go.get(x)||null,n,r,l,u,p)),!0;case"gotpointercapture":return x=p.pointerId,vo.set(x,xo(vo.get(x)||null,n,r,l,u,p)),!0}return!1}function cd(n){var r=Fr(n.target);if(r!==null){var l=yi(r);if(l!==null){if(r=l.tag,r===13){if(r=Sa(l),r!==null){n.blockedOn=r,ad(n.priority,function(){sd(l)});return}}else if(r===3&&l.stateNode.current.memoizedState.isDehydrated){n.blockedOn=l.tag===3?l.stateNode.containerInfo:null;return}}}n.blockedOn=null}function Ta(n){if(n.blockedOn!==null)return!1;for(var r=n.targetContainers;0<r.length;){var l=Ac(n.domEventName,n.eventSystemFlags,r[0],n.nativeEvent);if(l===null){l=n.nativeEvent;var u=new l.constructor(l.type,l);bt=u,l.target.dispatchEvent(u),bt=null}else return r=No(l),r!==null&&Ec(r),n.blockedOn=l,!1;r.shift()}return!0}function ud(n,r,l){Ta(n)&&l.delete(r)}function Qg(){wc=!1,tr!==null&&Ta(tr)&&(tr=null),nr!==null&&Ta(nr)&&(nr=null),ir!==null&&Ta(ir)&&(ir=null),go.forEach(ud),vo.forEach(ud)}function _o(n,r){n.blockedOn===r&&(n.blockedOn=null,wc||(wc=!0,e.unstable_scheduleCallback(e.unstable_NormalPriority,Qg)))}function yo(n){function r(p){return _o(p,n)}if(0<wa.length){_o(wa[0],n);for(var l=1;l<wa.length;l++){var u=wa[l];u.blockedOn===n&&(u.blockedOn=null)}}for(tr!==null&&_o(tr,n),nr!==null&&_o(nr,n),ir!==null&&_o(ir,n),go.forEach(r),vo.forEach(r),l=0;l<rr.length;l++)u=rr[l],u.blockedOn===n&&(u.blockedOn=null);for(;0<rr.length&&(l=rr[0],l.blockedOn===null);)cd(l),l.blockedOn===null&&rr.shift()}var ps=A.ReactCurrentBatchConfig,Aa=!0;function ev(n,r,l,u){var p=Pt,x=ps.transition;ps.transition=null;try{Pt=1,Tc(n,r,l,u)}finally{Pt=p,ps.transition=x}}function tv(n,r,l,u){var p=Pt,x=ps.transition;ps.transition=null;try{Pt=4,Tc(n,r,l,u)}finally{Pt=p,ps.transition=x}}function Tc(n,r,l,u){if(Aa){var p=Ac(n,r,l,u);if(p===null)Gc(n,r,u,Ca,l),ld(n,u);else if(Jg(p,n,r,l,u))u.stopPropagation();else if(ld(n,u),r&4&&-1<Zg.indexOf(n)){for(;p!==null;){var x=No(p);if(x!==null&&rd(x),x=Ac(n,r,l,u),x===null&&Gc(n,r,u,Ca,l),x===p)break;p=x}p!==null&&u.stopPropagation()}else Gc(n,r,u,null,l)}}var Ca=null;function Ac(n,r,l,u){if(Ca=null,n=X(u),n=Fr(n),n!==null)if(r=yi(n),r===null)n=null;else if(l=r.tag,l===13){if(n=Sa(r),n!==null)return n;n=null}else if(l===3){if(r.stateNode.current.memoizedState.isDehydrated)return r.tag===3?r.stateNode.containerInfo:null;n=null}else r!==n&&(n=null);return Ca=n,null}function hd(n){switch(n){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Je()){case qe:return 1;case lt:return 4;case ut:case Qe:return 16;case Mt:return 536870912;default:return 16}default:return 16}}var sr=null,Cc=null,Ra=null;function fd(){if(Ra)return Ra;var n,r=Cc,l=r.length,u,p="value"in sr?sr.value:sr.textContent,x=p.length;for(n=0;n<l&&r[n]===p[n];n++);var T=l-n;for(u=1;u<=T&&r[l-u]===p[x-u];u++);return Ra=p.slice(n,1<u?1-u:void 0)}function ba(n){var r=n.keyCode;return"charCode"in n?(n=n.charCode,n===0&&r===13&&(n=13)):n=r,n===10&&(n=13),32<=n||n===13?n:0}function Pa(){return!0}function dd(){return!1}function Bn(n){function r(l,u,p,x,T){this._reactName=l,this._targetInst=p,this.type=u,this.nativeEvent=x,this.target=T,this.currentTarget=null;for(var D in n)n.hasOwnProperty(D)&&(l=n[D],this[D]=l?l(x):x[D]);return this.isDefaultPrevented=(x.defaultPrevented!=null?x.defaultPrevented:x.returnValue===!1)?Pa:dd,this.isPropagationStopped=dd,this}return ae(r.prototype,{preventDefault:function(){this.defaultPrevented=!0;var l=this.nativeEvent;l&&(l.preventDefault?l.preventDefault():typeof l.returnValue!="unknown"&&(l.returnValue=!1),this.isDefaultPrevented=Pa)},stopPropagation:function(){var l=this.nativeEvent;l&&(l.stopPropagation?l.stopPropagation():typeof l.cancelBubble!="unknown"&&(l.cancelBubble=!0),this.isPropagationStopped=Pa)},persist:function(){},isPersistent:Pa}),r}var ms={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(n){return n.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Rc=Bn(ms),So=ae({},ms,{view:0,detail:0}),nv=Bn(So),bc,Pc,Mo,La=ae({},So,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Nc,button:0,buttons:0,relatedTarget:function(n){return n.relatedTarget===void 0?n.fromElement===n.srcElement?n.toElement:n.fromElement:n.relatedTarget},movementX:function(n){return"movementX"in n?n.movementX:(n!==Mo&&(Mo&&n.type==="mousemove"?(bc=n.screenX-Mo.screenX,Pc=n.screenY-Mo.screenY):Pc=bc=0,Mo=n),bc)},movementY:function(n){return"movementY"in n?n.movementY:Pc}}),pd=Bn(La),iv=ae({},La,{dataTransfer:0}),rv=Bn(iv),sv=ae({},So,{relatedTarget:0}),Lc=Bn(sv),ov=ae({},ms,{animationName:0,elapsedTime:0,pseudoElement:0}),av=Bn(ov),lv=ae({},ms,{clipboardData:function(n){return"clipboardData"in n?n.clipboardData:window.clipboardData}}),cv=Bn(lv),uv=ae({},ms,{data:0}),md=Bn(uv),hv={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},fv={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},dv={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function pv(n){var r=this.nativeEvent;return r.getModifierState?r.getModifierState(n):(n=dv[n])?!!r[n]:!1}function Nc(){return pv}var mv=ae({},So,{key:function(n){if(n.key){var r=hv[n.key]||n.key;if(r!=="Unidentified")return r}return n.type==="keypress"?(n=ba(n),n===13?"Enter":String.fromCharCode(n)):n.type==="keydown"||n.type==="keyup"?fv[n.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Nc,charCode:function(n){return n.type==="keypress"?ba(n):0},keyCode:function(n){return n.type==="keydown"||n.type==="keyup"?n.keyCode:0},which:function(n){return n.type==="keypress"?ba(n):n.type==="keydown"||n.type==="keyup"?n.keyCode:0}}),gv=Bn(mv),vv=ae({},La,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),gd=Bn(vv),xv=ae({},So,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Nc}),_v=Bn(xv),yv=ae({},ms,{propertyName:0,elapsedTime:0,pseudoElement:0}),Sv=Bn(yv),Mv=ae({},La,{deltaX:function(n){return"deltaX"in n?n.deltaX:"wheelDeltaX"in n?-n.wheelDeltaX:0},deltaY:function(n){return"deltaY"in n?n.deltaY:"wheelDeltaY"in n?-n.wheelDeltaY:"wheelDelta"in n?-n.wheelDelta:0},deltaZ:0,deltaMode:0}),Ev=Bn(Mv),wv=[9,13,27,32],Ic=h&&"CompositionEvent"in window,Eo=null;h&&"documentMode"in document&&(Eo=document.documentMode);var Tv=h&&"TextEvent"in window&&!Eo,vd=h&&(!Ic||Eo&&8<Eo&&11>=Eo),xd=" ",_d=!1;function yd(n,r){switch(n){case"keyup":return wv.indexOf(r.keyCode)!==-1;case"keydown":return r.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Sd(n){return n=n.detail,typeof n=="object"&&"data"in n?n.data:null}var gs=!1;function Av(n,r){switch(n){case"compositionend":return Sd(r);case"keypress":return r.which!==32?null:(_d=!0,xd);case"textInput":return n=r.data,n===xd&&_d?null:n;default:return null}}function Cv(n,r){if(gs)return n==="compositionend"||!Ic&&yd(n,r)?(n=fd(),Ra=Cc=sr=null,gs=!1,n):null;switch(n){case"paste":return null;case"keypress":if(!(r.ctrlKey||r.altKey||r.metaKey)||r.ctrlKey&&r.altKey){if(r.char&&1<r.char.length)return r.char;if(r.which)return String.fromCharCode(r.which)}return null;case"compositionend":return vd&&r.locale!=="ko"?null:r.data;default:return null}}var Rv={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Md(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r==="input"?!!Rv[n.type]:r==="textarea"}function Ed(n,r,l,u){Ue(u),r=Fa(r,"onChange"),0<r.length&&(l=new Rc("onChange","change",null,l,u),n.push({event:l,listeners:r}))}var wo=null,To=null;function bv(n){Vd(n,0)}function Na(n){var r=Ss(n);if(ve(r))return n}function Pv(n,r){if(n==="change")return r}var wd=!1;if(h){var Dc;if(h){var Uc="oninput"in document;if(!Uc){var Td=document.createElement("div");Td.setAttribute("oninput","return;"),Uc=typeof Td.oninput=="function"}Dc=Uc}else Dc=!1;wd=Dc&&(!document.documentMode||9<document.documentMode)}function Ad(){wo&&(wo.detachEvent("onpropertychange",Cd),To=wo=null)}function Cd(n){if(n.propertyName==="value"&&Na(To)){var r=[];Ed(r,To,n,X(n)),Cn(bv,r)}}function Lv(n,r,l){n==="focusin"?(Ad(),wo=r,To=l,wo.attachEvent("onpropertychange",Cd)):n==="focusout"&&Ad()}function Nv(n){if(n==="selectionchange"||n==="keyup"||n==="keydown")return Na(To)}function Iv(n,r){if(n==="click")return Na(r)}function Dv(n,r){if(n==="input"||n==="change")return Na(r)}function Uv(n,r){return n===r&&(n!==0||1/n===1/r)||n!==n&&r!==r}var li=typeof Object.is=="function"?Object.is:Uv;function Ao(n,r){if(li(n,r))return!0;if(typeof n!="object"||n===null||typeof r!="object"||r===null)return!1;var l=Object.keys(n),u=Object.keys(r);if(l.length!==u.length)return!1;for(u=0;u<l.length;u++){var p=l[u];if(!f.call(r,p)||!li(n[p],r[p]))return!1}return!0}function Rd(n){for(;n&&n.firstChild;)n=n.firstChild;return n}function bd(n,r){var l=Rd(n);n=0;for(var u;l;){if(l.nodeType===3){if(u=n+l.textContent.length,n<=r&&u>=r)return{node:l,offset:r-n};n=u}e:{for(;l;){if(l.nextSibling){l=l.nextSibling;break e}l=l.parentNode}l=void 0}l=Rd(l)}}function Pd(n,r){return n&&r?n===r?!0:n&&n.nodeType===3?!1:r&&r.nodeType===3?Pd(n,r.parentNode):"contains"in n?n.contains(r):n.compareDocumentPosition?!!(n.compareDocumentPosition(r)&16):!1:!1}function Ld(){for(var n=window,r=Ae();r instanceof n.HTMLIFrameElement;){try{var l=typeof r.contentWindow.location.href=="string"}catch{l=!1}if(l)n=r.contentWindow;else break;r=Ae(n.document)}return r}function Fc(n){var r=n&&n.nodeName&&n.nodeName.toLowerCase();return r&&(r==="input"&&(n.type==="text"||n.type==="search"||n.type==="tel"||n.type==="url"||n.type==="password")||r==="textarea"||n.contentEditable==="true")}function Fv(n){var r=Ld(),l=n.focusedElem,u=n.selectionRange;if(r!==l&&l&&l.ownerDocument&&Pd(l.ownerDocument.documentElement,l)){if(u!==null&&Fc(l)){if(r=u.start,n=u.end,n===void 0&&(n=r),"selectionStart"in l)l.selectionStart=r,l.selectionEnd=Math.min(n,l.value.length);else if(n=(r=l.ownerDocument||document)&&r.defaultView||window,n.getSelection){n=n.getSelection();var p=l.textContent.length,x=Math.min(u.start,p);u=u.end===void 0?x:Math.min(u.end,p),!n.extend&&x>u&&(p=u,u=x,x=p),p=bd(l,x);var T=bd(l,u);p&&T&&(n.rangeCount!==1||n.anchorNode!==p.node||n.anchorOffset!==p.offset||n.focusNode!==T.node||n.focusOffset!==T.offset)&&(r=r.createRange(),r.setStart(p.node,p.offset),n.removeAllRanges(),x>u?(n.addRange(r),n.extend(T.node,T.offset)):(r.setEnd(T.node,T.offset),n.addRange(r)))}}for(r=[],n=l;n=n.parentNode;)n.nodeType===1&&r.push({element:n,left:n.scrollLeft,top:n.scrollTop});for(typeof l.focus=="function"&&l.focus(),l=0;l<r.length;l++)n=r[l],n.element.scrollLeft=n.left,n.element.scrollTop=n.top}}var Ov=h&&"documentMode"in document&&11>=document.documentMode,vs=null,Oc=null,Co=null,zc=!1;function Nd(n,r,l){var u=l.window===l?l.document:l.nodeType===9?l:l.ownerDocument;zc||vs==null||vs!==Ae(u)||(u=vs,"selectionStart"in u&&Fc(u)?u={start:u.selectionStart,end:u.selectionEnd}:(u=(u.ownerDocument&&u.ownerDocument.defaultView||window).getSelection(),u={anchorNode:u.anchorNode,anchorOffset:u.anchorOffset,focusNode:u.focusNode,focusOffset:u.focusOffset}),Co&&Ao(Co,u)||(Co=u,u=Fa(Oc,"onSelect"),0<u.length&&(r=new Rc("onSelect","select",null,r,l),n.push({event:r,listeners:u}),r.target=vs)))}function Ia(n,r){var l={};return l[n.toLowerCase()]=r.toLowerCase(),l["Webkit"+n]="webkit"+r,l["Moz"+n]="moz"+r,l}var xs={animationend:Ia("Animation","AnimationEnd"),animationiteration:Ia("Animation","AnimationIteration"),animationstart:Ia("Animation","AnimationStart"),transitionend:Ia("Transition","TransitionEnd")},kc={},Id={};h&&(Id=document.createElement("div").style,"AnimationEvent"in window||(delete xs.animationend.animation,delete xs.animationiteration.animation,delete xs.animationstart.animation),"TransitionEvent"in window||delete xs.transitionend.transition);function Da(n){if(kc[n])return kc[n];if(!xs[n])return n;var r=xs[n],l;for(l in r)if(r.hasOwnProperty(l)&&l in Id)return kc[n]=r[l];return n}var Dd=Da("animationend"),Ud=Da("animationiteration"),Fd=Da("animationstart"),Od=Da("transitionend"),zd=new Map,kd="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function or(n,r){zd.set(n,r),a(r,[n])}for(var Bc=0;Bc<kd.length;Bc++){var Vc=kd[Bc],zv=Vc.toLowerCase(),kv=Vc[0].toUpperCase()+Vc.slice(1);or(zv,"on"+kv)}or(Dd,"onAnimationEnd"),or(Ud,"onAnimationIteration"),or(Fd,"onAnimationStart"),or("dblclick","onDoubleClick"),or("focusin","onFocus"),or("focusout","onBlur"),or(Od,"onTransitionEnd"),c("onMouseEnter",["mouseout","mouseover"]),c("onMouseLeave",["mouseout","mouseover"]),c("onPointerEnter",["pointerout","pointerover"]),c("onPointerLeave",["pointerout","pointerover"]),a("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),a("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),a("onBeforeInput",["compositionend","keypress","textInput","paste"]),a("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),a("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),a("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ro="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Bv=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ro));function Bd(n,r,l){var u=n.type||"unknown-event";n.currentTarget=l,ya(u,r,void 0,n),n.currentTarget=null}function Vd(n,r){r=(r&4)!==0;for(var l=0;l<n.length;l++){var u=n[l],p=u.event;u=u.listeners;e:{var x=void 0;if(r)for(var T=u.length-1;0<=T;T--){var D=u[T],H=D.instance,te=D.currentTarget;if(D=D.listener,H!==x&&p.isPropagationStopped())break e;Bd(p,D,te),x=H}else for(T=0;T<u.length;T++){if(D=u[T],H=D.instance,te=D.currentTarget,D=D.listener,H!==x&&p.isPropagationStopped())break e;Bd(p,D,te),x=H}}}if(Ur)throw n=er,Ur=!1,er=null,n}function kt(n,r){var l=r[$c];l===void 0&&(l=r[$c]=new Set);var u=n+"__bubble";l.has(u)||(Hd(r,n,2,!1),l.add(u))}function Hc(n,r,l){var u=0;r&&(u|=4),Hd(l,n,u,r)}var Ua="_reactListening"+Math.random().toString(36).slice(2);function bo(n){if(!n[Ua]){n[Ua]=!0,i.forEach(function(l){l!=="selectionchange"&&(Bv.has(l)||Hc(l,!1,n),Hc(l,!0,n))});var r=n.nodeType===9?n:n.ownerDocument;r===null||r[Ua]||(r[Ua]=!0,Hc("selectionchange",!1,r))}}function Hd(n,r,l,u){switch(hd(r)){case 1:var p=ev;break;case 4:p=tv;break;default:p=Tc}l=p.bind(null,r,l,n),p=void 0,!fs||r!=="touchstart"&&r!=="touchmove"&&r!=="wheel"||(p=!0),u?p!==void 0?n.addEventListener(r,l,{capture:!0,passive:p}):n.addEventListener(r,l,!0):p!==void 0?n.addEventListener(r,l,{passive:p}):n.addEventListener(r,l,!1)}function Gc(n,r,l,u,p){var x=u;if((r&1)===0&&(r&2)===0&&u!==null)e:for(;;){if(u===null)return;var T=u.tag;if(T===3||T===4){var D=u.stateNode.containerInfo;if(D===p||D.nodeType===8&&D.parentNode===p)break;if(T===4)for(T=u.return;T!==null;){var H=T.tag;if((H===3||H===4)&&(H=T.stateNode.containerInfo,H===p||H.nodeType===8&&H.parentNode===p))return;T=T.return}for(;D!==null;){if(T=Fr(D),T===null)return;if(H=T.tag,H===5||H===6){u=x=T;continue e}D=D.parentNode}}u=u.return}Cn(function(){var te=x,ye=X(l),Se=[];e:{var _e=zd.get(n);if(_e!==void 0){var ke=Rc,Xe=n;switch(n){case"keypress":if(ba(l)===0)break e;case"keydown":case"keyup":ke=gv;break;case"focusin":Xe="focus",ke=Lc;break;case"focusout":Xe="blur",ke=Lc;break;case"beforeblur":case"afterblur":ke=Lc;break;case"click":if(l.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":ke=pd;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":ke=rv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":ke=_v;break;case Dd:case Ud:case Fd:ke=av;break;case Od:ke=Sv;break;case"scroll":ke=nv;break;case"wheel":ke=Ev;break;case"copy":case"cut":case"paste":ke=cv;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":ke=gd}var $e=(r&4)!==0,Xt=!$e&&n==="scroll",$=$e?_e!==null?_e+"Capture":null:_e;$e=[];for(var j=te,J;j!==null;){J=j;var Ce=J.stateNode;if(J.tag===5&&Ce!==null&&(J=Ce,$!==null&&(Ce=Sn(j,$),Ce!=null&&$e.push(Po(j,Ce,J)))),Xt)break;j=j.return}0<$e.length&&(_e=new ke(_e,Xe,null,l,ye),Se.push({event:_e,listeners:$e}))}}if((r&7)===0){e:{if(_e=n==="mouseover"||n==="pointerover",ke=n==="mouseout"||n==="pointerout",_e&&l!==bt&&(Xe=l.relatedTarget||l.fromElement)&&(Fr(Xe)||Xe[Di]))break e;if((ke||_e)&&(_e=ye.window===ye?ye:(_e=ye.ownerDocument)?_e.defaultView||_e.parentWindow:window,ke?(Xe=l.relatedTarget||l.toElement,ke=te,Xe=Xe?Fr(Xe):null,Xe!==null&&(Xt=yi(Xe),Xe!==Xt||Xe.tag!==5&&Xe.tag!==6)&&(Xe=null)):(ke=null,Xe=te),ke!==Xe)){if($e=pd,Ce="onMouseLeave",$="onMouseEnter",j="mouse",(n==="pointerout"||n==="pointerover")&&($e=gd,Ce="onPointerLeave",$="onPointerEnter",j="pointer"),Xt=ke==null?_e:Ss(ke),J=Xe==null?_e:Ss(Xe),_e=new $e(Ce,j+"leave",ke,l,ye),_e.target=Xt,_e.relatedTarget=J,Ce=null,Fr(ye)===te&&($e=new $e($,j+"enter",Xe,l,ye),$e.target=J,$e.relatedTarget=Xt,Ce=$e),Xt=Ce,ke&&Xe)t:{for($e=ke,$=Xe,j=0,J=$e;J;J=_s(J))j++;for(J=0,Ce=$;Ce;Ce=_s(Ce))J++;for(;0<j-J;)$e=_s($e),j--;for(;0<J-j;)$=_s($),J--;for(;j--;){if($e===$||$!==null&&$e===$.alternate)break t;$e=_s($e),$=_s($)}$e=null}else $e=null;ke!==null&&Gd(Se,_e,ke,$e,!1),Xe!==null&&Xt!==null&&Gd(Se,Xt,Xe,$e,!0)}}e:{if(_e=te?Ss(te):window,ke=_e.nodeName&&_e.nodeName.toLowerCase(),ke==="select"||ke==="input"&&_e.type==="file")var et=Pv;else if(Md(_e))if(wd)et=Dv;else{et=Nv;var rt=Lv}else(ke=_e.nodeName)&&ke.toLowerCase()==="input"&&(_e.type==="checkbox"||_e.type==="radio")&&(et=Iv);if(et&&(et=et(n,te))){Ed(Se,et,l,ye);break e}rt&&rt(n,_e,te),n==="focusout"&&(rt=_e._wrapperState)&&rt.controlled&&_e.type==="number"&&it(_e,"number",_e.value)}switch(rt=te?Ss(te):window,n){case"focusin":(Md(rt)||rt.contentEditable==="true")&&(vs=rt,Oc=te,Co=null);break;case"focusout":Co=Oc=vs=null;break;case"mousedown":zc=!0;break;case"contextmenu":case"mouseup":case"dragend":zc=!1,Nd(Se,l,ye);break;case"selectionchange":if(Ov)break;case"keydown":case"keyup":Nd(Se,l,ye)}var st;if(Ic)e:{switch(n){case"compositionstart":var ct="onCompositionStart";break e;case"compositionend":ct="onCompositionEnd";break e;case"compositionupdate":ct="onCompositionUpdate";break e}ct=void 0}else gs?yd(n,l)&&(ct="onCompositionEnd"):n==="keydown"&&l.keyCode===229&&(ct="onCompositionStart");ct&&(vd&&l.locale!=="ko"&&(gs||ct!=="onCompositionStart"?ct==="onCompositionEnd"&&gs&&(st=fd()):(sr=ye,Cc="value"in sr?sr.value:sr.textContent,gs=!0)),rt=Fa(te,ct),0<rt.length&&(ct=new md(ct,n,null,l,ye),Se.push({event:ct,listeners:rt}),st?ct.data=st:(st=Sd(l),st!==null&&(ct.data=st)))),(st=Tv?Av(n,l):Cv(n,l))&&(te=Fa(te,"onBeforeInput"),0<te.length&&(ye=new md("onBeforeInput","beforeinput",null,l,ye),Se.push({event:ye,listeners:te}),ye.data=st))}Vd(Se,r)})}function Po(n,r,l){return{instance:n,listener:r,currentTarget:l}}function Fa(n,r){for(var l=r+"Capture",u=[];n!==null;){var p=n,x=p.stateNode;p.tag===5&&x!==null&&(p=x,x=Sn(n,l),x!=null&&u.unshift(Po(n,x,p)),x=Sn(n,r),x!=null&&u.push(Po(n,x,p))),n=n.return}return u}function _s(n){if(n===null)return null;do n=n.return;while(n&&n.tag!==5);return n||null}function Gd(n,r,l,u,p){for(var x=r._reactName,T=[];l!==null&&l!==u;){var D=l,H=D.alternate,te=D.stateNode;if(H!==null&&H===u)break;D.tag===5&&te!==null&&(D=te,p?(H=Sn(l,x),H!=null&&T.unshift(Po(l,H,D))):p||(H=Sn(l,x),H!=null&&T.push(Po(l,H,D)))),l=l.return}T.length!==0&&n.push({event:r,listeners:T})}var Vv=/\r\n?/g,Hv=/\u0000|\uFFFD/g;function Wd(n){return(typeof n=="string"?n:""+n).replace(Vv,`
`).replace(Hv,"")}function Oa(n,r,l){if(r=Wd(r),Wd(n)!==r&&l)throw Error(t(425))}function za(){}var Wc=null,jc=null;function Xc(n,r){return n==="textarea"||n==="noscript"||typeof r.children=="string"||typeof r.children=="number"||typeof r.dangerouslySetInnerHTML=="object"&&r.dangerouslySetInnerHTML!==null&&r.dangerouslySetInnerHTML.__html!=null}var Yc=typeof setTimeout=="function"?setTimeout:void 0,Gv=typeof clearTimeout=="function"?clearTimeout:void 0,jd=typeof Promise=="function"?Promise:void 0,Wv=typeof queueMicrotask=="function"?queueMicrotask:typeof jd<"u"?function(n){return jd.resolve(null).then(n).catch(jv)}:Yc;function jv(n){setTimeout(function(){throw n})}function qc(n,r){var l=r,u=0;do{var p=l.nextSibling;if(n.removeChild(l),p&&p.nodeType===8)if(l=p.data,l==="/$"){if(u===0){n.removeChild(p),yo(r);return}u--}else l!=="$"&&l!=="$?"&&l!=="$!"||u++;l=p}while(l);yo(r)}function ar(n){for(;n!=null;n=n.nextSibling){var r=n.nodeType;if(r===1||r===3)break;if(r===8){if(r=n.data,r==="$"||r==="$!"||r==="$?")break;if(r==="/$")return null}}return n}function Xd(n){n=n.previousSibling;for(var r=0;n;){if(n.nodeType===8){var l=n.data;if(l==="$"||l==="$!"||l==="$?"){if(r===0)return n;r--}else l==="/$"&&r++}n=n.previousSibling}return null}var ys=Math.random().toString(36).slice(2),Mi="__reactFiber$"+ys,Lo="__reactProps$"+ys,Di="__reactContainer$"+ys,$c="__reactEvents$"+ys,Xv="__reactListeners$"+ys,Yv="__reactHandles$"+ys;function Fr(n){var r=n[Mi];if(r)return r;for(var l=n.parentNode;l;){if(r=l[Di]||l[Mi]){if(l=r.alternate,r.child!==null||l!==null&&l.child!==null)for(n=Xd(n);n!==null;){if(l=n[Mi])return l;n=Xd(n)}return r}n=l,l=n.parentNode}return null}function No(n){return n=n[Mi]||n[Di],!n||n.tag!==5&&n.tag!==6&&n.tag!==13&&n.tag!==3?null:n}function Ss(n){if(n.tag===5||n.tag===6)return n.stateNode;throw Error(t(33))}function ka(n){return n[Lo]||null}var Kc=[],Ms=-1;function lr(n){return{current:n}}function Bt(n){0>Ms||(n.current=Kc[Ms],Kc[Ms]=null,Ms--)}function Ot(n,r){Ms++,Kc[Ms]=n.current,n.current=r}var cr={},pn=lr(cr),bn=lr(!1),Or=cr;function Es(n,r){var l=n.type.contextTypes;if(!l)return cr;var u=n.stateNode;if(u&&u.__reactInternalMemoizedUnmaskedChildContext===r)return u.__reactInternalMemoizedMaskedChildContext;var p={},x;for(x in l)p[x]=r[x];return u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=r,n.__reactInternalMemoizedMaskedChildContext=p),p}function Pn(n){return n=n.childContextTypes,n!=null}function Ba(){Bt(bn),Bt(pn)}function Yd(n,r,l){if(pn.current!==cr)throw Error(t(168));Ot(pn,r),Ot(bn,l)}function qd(n,r,l){var u=n.stateNode;if(r=r.childContextTypes,typeof u.getChildContext!="function")return l;u=u.getChildContext();for(var p in u)if(!(p in r))throw Error(t(108,ge(n)||"Unknown",p));return ae({},l,u)}function Va(n){return n=(n=n.stateNode)&&n.__reactInternalMemoizedMergedChildContext||cr,Or=pn.current,Ot(pn,n),Ot(bn,bn.current),!0}function $d(n,r,l){var u=n.stateNode;if(!u)throw Error(t(169));l?(n=qd(n,r,Or),u.__reactInternalMemoizedMergedChildContext=n,Bt(bn),Bt(pn),Ot(pn,n)):Bt(bn),Ot(bn,l)}var Ui=null,Ha=!1,Zc=!1;function Kd(n){Ui===null?Ui=[n]:Ui.push(n)}function qv(n){Ha=!0,Kd(n)}function ur(){if(!Zc&&Ui!==null){Zc=!0;var n=0,r=Pt;try{var l=Ui;for(Pt=1;n<l.length;n++){var u=l[n];do u=u(!0);while(u!==null)}Ui=null,Ha=!1}catch(p){throw Ui!==null&&(Ui=Ui.slice(n+1)),ne(qe,ur),p}finally{Pt=r,Zc=!1}}return null}var ws=[],Ts=0,Ga=null,Wa=0,Jn=[],Qn=0,zr=null,Fi=1,Oi="";function kr(n,r){ws[Ts++]=Wa,ws[Ts++]=Ga,Ga=n,Wa=r}function Zd(n,r,l){Jn[Qn++]=Fi,Jn[Qn++]=Oi,Jn[Qn++]=zr,zr=n;var u=Fi;n=Oi;var p=32-pt(u)-1;u&=~(1<<p),l+=1;var x=32-pt(r)+p;if(30<x){var T=p-p%5;x=(u&(1<<T)-1).toString(32),u>>=T,p-=T,Fi=1<<32-pt(r)+p|l<<p|u,Oi=x+n}else Fi=1<<x|l<<p|u,Oi=n}function Jc(n){n.return!==null&&(kr(n,1),Zd(n,1,0))}function Qc(n){for(;n===Ga;)Ga=ws[--Ts],ws[Ts]=null,Wa=ws[--Ts],ws[Ts]=null;for(;n===zr;)zr=Jn[--Qn],Jn[Qn]=null,Oi=Jn[--Qn],Jn[Qn]=null,Fi=Jn[--Qn],Jn[Qn]=null}var Vn=null,Hn=null,Vt=!1,ci=null;function Jd(n,r){var l=ii(5,null,null,0);l.elementType="DELETED",l.stateNode=r,l.return=n,r=n.deletions,r===null?(n.deletions=[l],n.flags|=16):r.push(l)}function Qd(n,r){switch(n.tag){case 5:var l=n.type;return r=r.nodeType!==1||l.toLowerCase()!==r.nodeName.toLowerCase()?null:r,r!==null?(n.stateNode=r,Vn=n,Hn=ar(r.firstChild),!0):!1;case 6:return r=n.pendingProps===""||r.nodeType!==3?null:r,r!==null?(n.stateNode=r,Vn=n,Hn=null,!0):!1;case 13:return r=r.nodeType!==8?null:r,r!==null?(l=zr!==null?{id:Fi,overflow:Oi}:null,n.memoizedState={dehydrated:r,treeContext:l,retryLane:1073741824},l=ii(18,null,null,0),l.stateNode=r,l.return=n,n.child=l,Vn=n,Hn=null,!0):!1;default:return!1}}function eu(n){return(n.mode&1)!==0&&(n.flags&128)===0}function tu(n){if(Vt){var r=Hn;if(r){var l=r;if(!Qd(n,r)){if(eu(n))throw Error(t(418));r=ar(l.nextSibling);var u=Vn;r&&Qd(n,r)?Jd(u,l):(n.flags=n.flags&-4097|2,Vt=!1,Vn=n)}}else{if(eu(n))throw Error(t(418));n.flags=n.flags&-4097|2,Vt=!1,Vn=n}}}function ep(n){for(n=n.return;n!==null&&n.tag!==5&&n.tag!==3&&n.tag!==13;)n=n.return;Vn=n}function ja(n){if(n!==Vn)return!1;if(!Vt)return ep(n),Vt=!0,!1;var r;if((r=n.tag!==3)&&!(r=n.tag!==5)&&(r=n.type,r=r!=="head"&&r!=="body"&&!Xc(n.type,n.memoizedProps)),r&&(r=Hn)){if(eu(n))throw tp(),Error(t(418));for(;r;)Jd(n,r),r=ar(r.nextSibling)}if(ep(n),n.tag===13){if(n=n.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(t(317));e:{for(n=n.nextSibling,r=0;n;){if(n.nodeType===8){var l=n.data;if(l==="/$"){if(r===0){Hn=ar(n.nextSibling);break e}r--}else l!=="$"&&l!=="$!"&&l!=="$?"||r++}n=n.nextSibling}Hn=null}}else Hn=Vn?ar(n.stateNode.nextSibling):null;return!0}function tp(){for(var n=Hn;n;)n=ar(n.nextSibling)}function As(){Hn=Vn=null,Vt=!1}function nu(n){ci===null?ci=[n]:ci.push(n)}var $v=A.ReactCurrentBatchConfig;function Io(n,r,l){if(n=l.ref,n!==null&&typeof n!="function"&&typeof n!="object"){if(l._owner){if(l=l._owner,l){if(l.tag!==1)throw Error(t(309));var u=l.stateNode}if(!u)throw Error(t(147,n));var p=u,x=""+n;return r!==null&&r.ref!==null&&typeof r.ref=="function"&&r.ref._stringRef===x?r.ref:(r=function(T){var D=p.refs;T===null?delete D[x]:D[x]=T},r._stringRef=x,r)}if(typeof n!="string")throw Error(t(284));if(!l._owner)throw Error(t(290,n))}return n}function Xa(n,r){throw n=Object.prototype.toString.call(r),Error(t(31,n==="[object Object]"?"object with keys {"+Object.keys(r).join(", ")+"}":n))}function np(n){var r=n._init;return r(n._payload)}function ip(n){function r($,j){if(n){var J=$.deletions;J===null?($.deletions=[j],$.flags|=16):J.push(j)}}function l($,j){if(!n)return null;for(;j!==null;)r($,j),j=j.sibling;return null}function u($,j){for($=new Map;j!==null;)j.key!==null?$.set(j.key,j):$.set(j.index,j),j=j.sibling;return $}function p($,j){return $=xr($,j),$.index=0,$.sibling=null,$}function x($,j,J){return $.index=J,n?(J=$.alternate,J!==null?(J=J.index,J<j?($.flags|=2,j):J):($.flags|=2,j)):($.flags|=1048576,j)}function T($){return n&&$.alternate===null&&($.flags|=2),$}function D($,j,J,Ce){return j===null||j.tag!==6?(j=Yu(J,$.mode,Ce),j.return=$,j):(j=p(j,J),j.return=$,j)}function H($,j,J,Ce){var et=J.type;return et===z?ye($,j,J.props.children,Ce,J.key):j!==null&&(j.elementType===et||typeof et=="object"&&et!==null&&et.$$typeof===se&&np(et)===j.type)?(Ce=p(j,J.props),Ce.ref=Io($,j,J),Ce.return=$,Ce):(Ce=gl(J.type,J.key,J.props,null,$.mode,Ce),Ce.ref=Io($,j,J),Ce.return=$,Ce)}function te($,j,J,Ce){return j===null||j.tag!==4||j.stateNode.containerInfo!==J.containerInfo||j.stateNode.implementation!==J.implementation?(j=qu(J,$.mode,Ce),j.return=$,j):(j=p(j,J.children||[]),j.return=$,j)}function ye($,j,J,Ce,et){return j===null||j.tag!==7?(j=Yr(J,$.mode,Ce,et),j.return=$,j):(j=p(j,J),j.return=$,j)}function Se($,j,J){if(typeof j=="string"&&j!==""||typeof j=="number")return j=Yu(""+j,$.mode,J),j.return=$,j;if(typeof j=="object"&&j!==null){switch(j.$$typeof){case W:return J=gl(j.type,j.key,j.props,null,$.mode,J),J.ref=Io($,null,j),J.return=$,J;case U:return j=qu(j,$.mode,J),j.return=$,j;case se:var Ce=j._init;return Se($,Ce(j._payload),J)}if(Fe(j)||ce(j))return j=Yr(j,$.mode,J,null),j.return=$,j;Xa($,j)}return null}function _e($,j,J,Ce){var et=j!==null?j.key:null;if(typeof J=="string"&&J!==""||typeof J=="number")return et!==null?null:D($,j,""+J,Ce);if(typeof J=="object"&&J!==null){switch(J.$$typeof){case W:return J.key===et?H($,j,J,Ce):null;case U:return J.key===et?te($,j,J,Ce):null;case se:return et=J._init,_e($,j,et(J._payload),Ce)}if(Fe(J)||ce(J))return et!==null?null:ye($,j,J,Ce,null);Xa($,J)}return null}function ke($,j,J,Ce,et){if(typeof Ce=="string"&&Ce!==""||typeof Ce=="number")return $=$.get(J)||null,D(j,$,""+Ce,et);if(typeof Ce=="object"&&Ce!==null){switch(Ce.$$typeof){case W:return $=$.get(Ce.key===null?J:Ce.key)||null,H(j,$,Ce,et);case U:return $=$.get(Ce.key===null?J:Ce.key)||null,te(j,$,Ce,et);case se:var rt=Ce._init;return ke($,j,J,rt(Ce._payload),et)}if(Fe(Ce)||ce(Ce))return $=$.get(J)||null,ye(j,$,Ce,et,null);Xa(j,Ce)}return null}function Xe($,j,J,Ce){for(var et=null,rt=null,st=j,ct=j=0,on=null;st!==null&&ct<J.length;ct++){st.index>ct?(on=st,st=null):on=st.sibling;var Ct=_e($,st,J[ct],Ce);if(Ct===null){st===null&&(st=on);break}n&&st&&Ct.alternate===null&&r($,st),j=x(Ct,j,ct),rt===null?et=Ct:rt.sibling=Ct,rt=Ct,st=on}if(ct===J.length)return l($,st),Vt&&kr($,ct),et;if(st===null){for(;ct<J.length;ct++)st=Se($,J[ct],Ce),st!==null&&(j=x(st,j,ct),rt===null?et=st:rt.sibling=st,rt=st);return Vt&&kr($,ct),et}for(st=u($,st);ct<J.length;ct++)on=ke(st,$,ct,J[ct],Ce),on!==null&&(n&&on.alternate!==null&&st.delete(on.key===null?ct:on.key),j=x(on,j,ct),rt===null?et=on:rt.sibling=on,rt=on);return n&&st.forEach(function(_r){return r($,_r)}),Vt&&kr($,ct),et}function $e($,j,J,Ce){var et=ce(J);if(typeof et!="function")throw Error(t(150));if(J=et.call(J),J==null)throw Error(t(151));for(var rt=et=null,st=j,ct=j=0,on=null,Ct=J.next();st!==null&&!Ct.done;ct++,Ct=J.next()){st.index>ct?(on=st,st=null):on=st.sibling;var _r=_e($,st,Ct.value,Ce);if(_r===null){st===null&&(st=on);break}n&&st&&_r.alternate===null&&r($,st),j=x(_r,j,ct),rt===null?et=_r:rt.sibling=_r,rt=_r,st=on}if(Ct.done)return l($,st),Vt&&kr($,ct),et;if(st===null){for(;!Ct.done;ct++,Ct=J.next())Ct=Se($,Ct.value,Ce),Ct!==null&&(j=x(Ct,j,ct),rt===null?et=Ct:rt.sibling=Ct,rt=Ct);return Vt&&kr($,ct),et}for(st=u($,st);!Ct.done;ct++,Ct=J.next())Ct=ke(st,$,ct,Ct.value,Ce),Ct!==null&&(n&&Ct.alternate!==null&&st.delete(Ct.key===null?ct:Ct.key),j=x(Ct,j,ct),rt===null?et=Ct:rt.sibling=Ct,rt=Ct);return n&&st.forEach(function(Rx){return r($,Rx)}),Vt&&kr($,ct),et}function Xt($,j,J,Ce){if(typeof J=="object"&&J!==null&&J.type===z&&J.key===null&&(J=J.props.children),typeof J=="object"&&J!==null){switch(J.$$typeof){case W:e:{for(var et=J.key,rt=j;rt!==null;){if(rt.key===et){if(et=J.type,et===z){if(rt.tag===7){l($,rt.sibling),j=p(rt,J.props.children),j.return=$,$=j;break e}}else if(rt.elementType===et||typeof et=="object"&&et!==null&&et.$$typeof===se&&np(et)===rt.type){l($,rt.sibling),j=p(rt,J.props),j.ref=Io($,rt,J),j.return=$,$=j;break e}l($,rt);break}else r($,rt);rt=rt.sibling}J.type===z?(j=Yr(J.props.children,$.mode,Ce,J.key),j.return=$,$=j):(Ce=gl(J.type,J.key,J.props,null,$.mode,Ce),Ce.ref=Io($,j,J),Ce.return=$,$=Ce)}return T($);case U:e:{for(rt=J.key;j!==null;){if(j.key===rt)if(j.tag===4&&j.stateNode.containerInfo===J.containerInfo&&j.stateNode.implementation===J.implementation){l($,j.sibling),j=p(j,J.children||[]),j.return=$,$=j;break e}else{l($,j);break}else r($,j);j=j.sibling}j=qu(J,$.mode,Ce),j.return=$,$=j}return T($);case se:return rt=J._init,Xt($,j,rt(J._payload),Ce)}if(Fe(J))return Xe($,j,J,Ce);if(ce(J))return $e($,j,J,Ce);Xa($,J)}return typeof J=="string"&&J!==""||typeof J=="number"?(J=""+J,j!==null&&j.tag===6?(l($,j.sibling),j=p(j,J),j.return=$,$=j):(l($,j),j=Yu(J,$.mode,Ce),j.return=$,$=j),T($)):l($,j)}return Xt}var Cs=ip(!0),rp=ip(!1),Ya=lr(null),qa=null,Rs=null,iu=null;function ru(){iu=Rs=qa=null}function su(n){var r=Ya.current;Bt(Ya),n._currentValue=r}function ou(n,r,l){for(;n!==null;){var u=n.alternate;if((n.childLanes&r)!==r?(n.childLanes|=r,u!==null&&(u.childLanes|=r)):u!==null&&(u.childLanes&r)!==r&&(u.childLanes|=r),n===l)break;n=n.return}}function bs(n,r){qa=n,iu=Rs=null,n=n.dependencies,n!==null&&n.firstContext!==null&&((n.lanes&r)!==0&&(Ln=!0),n.firstContext=null)}function ei(n){var r=n._currentValue;if(iu!==n)if(n={context:n,memoizedValue:r,next:null},Rs===null){if(qa===null)throw Error(t(308));Rs=n,qa.dependencies={lanes:0,firstContext:n}}else Rs=Rs.next=n;return r}var Br=null;function au(n){Br===null?Br=[n]:Br.push(n)}function sp(n,r,l,u){var p=r.interleaved;return p===null?(l.next=l,au(r)):(l.next=p.next,p.next=l),r.interleaved=l,zi(n,u)}function zi(n,r){n.lanes|=r;var l=n.alternate;for(l!==null&&(l.lanes|=r),l=n,n=n.return;n!==null;)n.childLanes|=r,l=n.alternate,l!==null&&(l.childLanes|=r),l=n,n=n.return;return l.tag===3?l.stateNode:null}var hr=!1;function lu(n){n.updateQueue={baseState:n.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function op(n,r){n=n.updateQueue,r.updateQueue===n&&(r.updateQueue={baseState:n.baseState,firstBaseUpdate:n.firstBaseUpdate,lastBaseUpdate:n.lastBaseUpdate,shared:n.shared,effects:n.effects})}function ki(n,r){return{eventTime:n,lane:r,tag:0,payload:null,callback:null,next:null}}function fr(n,r,l){var u=n.updateQueue;if(u===null)return null;if(u=u.shared,(wt&2)!==0){var p=u.pending;return p===null?r.next=r:(r.next=p.next,p.next=r),u.pending=r,zi(n,l)}return p=u.interleaved,p===null?(r.next=r,au(u)):(r.next=p.next,p.next=r),u.interleaved=r,zi(n,l)}function $a(n,r,l){if(r=r.updateQueue,r!==null&&(r=r.shared,(l&4194240)!==0)){var u=r.lanes;u&=n.pendingLanes,l|=u,r.lanes=l,Mc(n,l)}}function ap(n,r){var l=n.updateQueue,u=n.alternate;if(u!==null&&(u=u.updateQueue,l===u)){var p=null,x=null;if(l=l.firstBaseUpdate,l!==null){do{var T={eventTime:l.eventTime,lane:l.lane,tag:l.tag,payload:l.payload,callback:l.callback,next:null};x===null?p=x=T:x=x.next=T,l=l.next}while(l!==null);x===null?p=x=r:x=x.next=r}else p=x=r;l={baseState:u.baseState,firstBaseUpdate:p,lastBaseUpdate:x,shared:u.shared,effects:u.effects},n.updateQueue=l;return}n=l.lastBaseUpdate,n===null?l.firstBaseUpdate=r:n.next=r,l.lastBaseUpdate=r}function Ka(n,r,l,u){var p=n.updateQueue;hr=!1;var x=p.firstBaseUpdate,T=p.lastBaseUpdate,D=p.shared.pending;if(D!==null){p.shared.pending=null;var H=D,te=H.next;H.next=null,T===null?x=te:T.next=te,T=H;var ye=n.alternate;ye!==null&&(ye=ye.updateQueue,D=ye.lastBaseUpdate,D!==T&&(D===null?ye.firstBaseUpdate=te:D.next=te,ye.lastBaseUpdate=H))}if(x!==null){var Se=p.baseState;T=0,ye=te=H=null,D=x;do{var _e=D.lane,ke=D.eventTime;if((u&_e)===_e){ye!==null&&(ye=ye.next={eventTime:ke,lane:0,tag:D.tag,payload:D.payload,callback:D.callback,next:null});e:{var Xe=n,$e=D;switch(_e=r,ke=l,$e.tag){case 1:if(Xe=$e.payload,typeof Xe=="function"){Se=Xe.call(ke,Se,_e);break e}Se=Xe;break e;case 3:Xe.flags=Xe.flags&-65537|128;case 0:if(Xe=$e.payload,_e=typeof Xe=="function"?Xe.call(ke,Se,_e):Xe,_e==null)break e;Se=ae({},Se,_e);break e;case 2:hr=!0}}D.callback!==null&&D.lane!==0&&(n.flags|=64,_e=p.effects,_e===null?p.effects=[D]:_e.push(D))}else ke={eventTime:ke,lane:_e,tag:D.tag,payload:D.payload,callback:D.callback,next:null},ye===null?(te=ye=ke,H=Se):ye=ye.next=ke,T|=_e;if(D=D.next,D===null){if(D=p.shared.pending,D===null)break;_e=D,D=_e.next,_e.next=null,p.lastBaseUpdate=_e,p.shared.pending=null}}while(!0);if(ye===null&&(H=Se),p.baseState=H,p.firstBaseUpdate=te,p.lastBaseUpdate=ye,r=p.shared.interleaved,r!==null){p=r;do T|=p.lane,p=p.next;while(p!==r)}else x===null&&(p.shared.lanes=0);Gr|=T,n.lanes=T,n.memoizedState=Se}}function lp(n,r,l){if(n=r.effects,r.effects=null,n!==null)for(r=0;r<n.length;r++){var u=n[r],p=u.callback;if(p!==null){if(u.callback=null,u=l,typeof p!="function")throw Error(t(191,p));p.call(u)}}}var Do={},Ei=lr(Do),Uo=lr(Do),Fo=lr(Do);function Vr(n){if(n===Do)throw Error(t(174));return n}function cu(n,r){switch(Ot(Fo,r),Ot(Uo,n),Ot(Ei,Do),n=r.nodeType,n){case 9:case 11:r=(r=r.documentElement)?r.namespaceURI:Ye(null,"");break;default:n=n===8?r.parentNode:r,r=n.namespaceURI||null,n=n.tagName,r=Ye(r,n)}Bt(Ei),Ot(Ei,r)}function Ps(){Bt(Ei),Bt(Uo),Bt(Fo)}function cp(n){Vr(Fo.current);var r=Vr(Ei.current),l=Ye(r,n.type);r!==l&&(Ot(Uo,n),Ot(Ei,l))}function uu(n){Uo.current===n&&(Bt(Ei),Bt(Uo))}var Ht=lr(0);function Za(n){for(var r=n;r!==null;){if(r.tag===13){var l=r.memoizedState;if(l!==null&&(l=l.dehydrated,l===null||l.data==="$?"||l.data==="$!"))return r}else if(r.tag===19&&r.memoizedProps.revealOrder!==void 0){if((r.flags&128)!==0)return r}else if(r.child!==null){r.child.return=r,r=r.child;continue}if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return null;r=r.return}r.sibling.return=r.return,r=r.sibling}return null}var hu=[];function fu(){for(var n=0;n<hu.length;n++)hu[n]._workInProgressVersionPrimary=null;hu.length=0}var Ja=A.ReactCurrentDispatcher,du=A.ReactCurrentBatchConfig,Hr=0,Gt=null,Jt=null,rn=null,Qa=!1,Oo=!1,zo=0,Kv=0;function mn(){throw Error(t(321))}function pu(n,r){if(r===null)return!1;for(var l=0;l<r.length&&l<n.length;l++)if(!li(n[l],r[l]))return!1;return!0}function mu(n,r,l,u,p,x){if(Hr=x,Gt=r,r.memoizedState=null,r.updateQueue=null,r.lanes=0,Ja.current=n===null||n.memoizedState===null?ex:tx,n=l(u,p),Oo){x=0;do{if(Oo=!1,zo=0,25<=x)throw Error(t(301));x+=1,rn=Jt=null,r.updateQueue=null,Ja.current=nx,n=l(u,p)}while(Oo)}if(Ja.current=nl,r=Jt!==null&&Jt.next!==null,Hr=0,rn=Jt=Gt=null,Qa=!1,r)throw Error(t(300));return n}function gu(){var n=zo!==0;return zo=0,n}function wi(){var n={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return rn===null?Gt.memoizedState=rn=n:rn=rn.next=n,rn}function ti(){if(Jt===null){var n=Gt.alternate;n=n!==null?n.memoizedState:null}else n=Jt.next;var r=rn===null?Gt.memoizedState:rn.next;if(r!==null)rn=r,Jt=n;else{if(n===null)throw Error(t(310));Jt=n,n={memoizedState:Jt.memoizedState,baseState:Jt.baseState,baseQueue:Jt.baseQueue,queue:Jt.queue,next:null},rn===null?Gt.memoizedState=rn=n:rn=rn.next=n}return rn}function ko(n,r){return typeof r=="function"?r(n):r}function vu(n){var r=ti(),l=r.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=n;var u=Jt,p=u.baseQueue,x=l.pending;if(x!==null){if(p!==null){var T=p.next;p.next=x.next,x.next=T}u.baseQueue=p=x,l.pending=null}if(p!==null){x=p.next,u=u.baseState;var D=T=null,H=null,te=x;do{var ye=te.lane;if((Hr&ye)===ye)H!==null&&(H=H.next={lane:0,action:te.action,hasEagerState:te.hasEagerState,eagerState:te.eagerState,next:null}),u=te.hasEagerState?te.eagerState:n(u,te.action);else{var Se={lane:ye,action:te.action,hasEagerState:te.hasEagerState,eagerState:te.eagerState,next:null};H===null?(D=H=Se,T=u):H=H.next=Se,Gt.lanes|=ye,Gr|=ye}te=te.next}while(te!==null&&te!==x);H===null?T=u:H.next=D,li(u,r.memoizedState)||(Ln=!0),r.memoizedState=u,r.baseState=T,r.baseQueue=H,l.lastRenderedState=u}if(n=l.interleaved,n!==null){p=n;do x=p.lane,Gt.lanes|=x,Gr|=x,p=p.next;while(p!==n)}else p===null&&(l.lanes=0);return[r.memoizedState,l.dispatch]}function xu(n){var r=ti(),l=r.queue;if(l===null)throw Error(t(311));l.lastRenderedReducer=n;var u=l.dispatch,p=l.pending,x=r.memoizedState;if(p!==null){l.pending=null;var T=p=p.next;do x=n(x,T.action),T=T.next;while(T!==p);li(x,r.memoizedState)||(Ln=!0),r.memoizedState=x,r.baseQueue===null&&(r.baseState=x),l.lastRenderedState=x}return[x,u]}function up(){}function hp(n,r){var l=Gt,u=ti(),p=r(),x=!li(u.memoizedState,p);if(x&&(u.memoizedState=p,Ln=!0),u=u.queue,_u(pp.bind(null,l,u,n),[n]),u.getSnapshot!==r||x||rn!==null&&rn.memoizedState.tag&1){if(l.flags|=2048,Bo(9,dp.bind(null,l,u,p,r),void 0,null),sn===null)throw Error(t(349));(Hr&30)!==0||fp(l,r,p)}return p}function fp(n,r,l){n.flags|=16384,n={getSnapshot:r,value:l},r=Gt.updateQueue,r===null?(r={lastEffect:null,stores:null},Gt.updateQueue=r,r.stores=[n]):(l=r.stores,l===null?r.stores=[n]:l.push(n))}function dp(n,r,l,u){r.value=l,r.getSnapshot=u,mp(r)&&gp(n)}function pp(n,r,l){return l(function(){mp(r)&&gp(n)})}function mp(n){var r=n.getSnapshot;n=n.value;try{var l=r();return!li(n,l)}catch{return!0}}function gp(n){var r=zi(n,1);r!==null&&di(r,n,1,-1)}function vp(n){var r=wi();return typeof n=="function"&&(n=n()),r.memoizedState=r.baseState=n,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:ko,lastRenderedState:n},r.queue=n,n=n.dispatch=Qv.bind(null,Gt,n),[r.memoizedState,n]}function Bo(n,r,l,u){return n={tag:n,create:r,destroy:l,deps:u,next:null},r=Gt.updateQueue,r===null?(r={lastEffect:null,stores:null},Gt.updateQueue=r,r.lastEffect=n.next=n):(l=r.lastEffect,l===null?r.lastEffect=n.next=n:(u=l.next,l.next=n,n.next=u,r.lastEffect=n)),n}function xp(){return ti().memoizedState}function el(n,r,l,u){var p=wi();Gt.flags|=n,p.memoizedState=Bo(1|r,l,void 0,u===void 0?null:u)}function tl(n,r,l,u){var p=ti();u=u===void 0?null:u;var x=void 0;if(Jt!==null){var T=Jt.memoizedState;if(x=T.destroy,u!==null&&pu(u,T.deps)){p.memoizedState=Bo(r,l,x,u);return}}Gt.flags|=n,p.memoizedState=Bo(1|r,l,x,u)}function _p(n,r){return el(8390656,8,n,r)}function _u(n,r){return tl(2048,8,n,r)}function yp(n,r){return tl(4,2,n,r)}function Sp(n,r){return tl(4,4,n,r)}function Mp(n,r){if(typeof r=="function")return n=n(),r(n),function(){r(null)};if(r!=null)return n=n(),r.current=n,function(){r.current=null}}function Ep(n,r,l){return l=l!=null?l.concat([n]):null,tl(4,4,Mp.bind(null,r,n),l)}function yu(){}function wp(n,r){var l=ti();r=r===void 0?null:r;var u=l.memoizedState;return u!==null&&r!==null&&pu(r,u[1])?u[0]:(l.memoizedState=[n,r],n)}function Tp(n,r){var l=ti();r=r===void 0?null:r;var u=l.memoizedState;return u!==null&&r!==null&&pu(r,u[1])?u[0]:(n=n(),l.memoizedState=[n,r],n)}function Ap(n,r,l){return(Hr&21)===0?(n.baseState&&(n.baseState=!1,Ln=!0),n.memoizedState=l):(li(l,r)||(l=Mn(),Gt.lanes|=l,Gr|=l,n.baseState=!0),r)}function Zv(n,r){var l=Pt;Pt=l!==0&&4>l?l:4,n(!0);var u=du.transition;du.transition={};try{n(!1),r()}finally{Pt=l,du.transition=u}}function Cp(){return ti().memoizedState}function Jv(n,r,l){var u=gr(n);if(l={lane:u,action:l,hasEagerState:!1,eagerState:null,next:null},Rp(n))bp(r,l);else if(l=sp(n,r,l,u),l!==null){var p=wn();di(l,n,u,p),Pp(l,r,u)}}function Qv(n,r,l){var u=gr(n),p={lane:u,action:l,hasEagerState:!1,eagerState:null,next:null};if(Rp(n))bp(r,p);else{var x=n.alternate;if(n.lanes===0&&(x===null||x.lanes===0)&&(x=r.lastRenderedReducer,x!==null))try{var T=r.lastRenderedState,D=x(T,l);if(p.hasEagerState=!0,p.eagerState=D,li(D,T)){var H=r.interleaved;H===null?(p.next=p,au(r)):(p.next=H.next,H.next=p),r.interleaved=p;return}}catch{}finally{}l=sp(n,r,p,u),l!==null&&(p=wn(),di(l,n,u,p),Pp(l,r,u))}}function Rp(n){var r=n.alternate;return n===Gt||r!==null&&r===Gt}function bp(n,r){Oo=Qa=!0;var l=n.pending;l===null?r.next=r:(r.next=l.next,l.next=r),n.pending=r}function Pp(n,r,l){if((l&4194240)!==0){var u=r.lanes;u&=n.pendingLanes,l|=u,r.lanes=l,Mc(n,l)}}var nl={readContext:ei,useCallback:mn,useContext:mn,useEffect:mn,useImperativeHandle:mn,useInsertionEffect:mn,useLayoutEffect:mn,useMemo:mn,useReducer:mn,useRef:mn,useState:mn,useDebugValue:mn,useDeferredValue:mn,useTransition:mn,useMutableSource:mn,useSyncExternalStore:mn,useId:mn,unstable_isNewReconciler:!1},ex={readContext:ei,useCallback:function(n,r){return wi().memoizedState=[n,r===void 0?null:r],n},useContext:ei,useEffect:_p,useImperativeHandle:function(n,r,l){return l=l!=null?l.concat([n]):null,el(4194308,4,Mp.bind(null,r,n),l)},useLayoutEffect:function(n,r){return el(4194308,4,n,r)},useInsertionEffect:function(n,r){return el(4,2,n,r)},useMemo:function(n,r){var l=wi();return r=r===void 0?null:r,n=n(),l.memoizedState=[n,r],n},useReducer:function(n,r,l){var u=wi();return r=l!==void 0?l(r):r,u.memoizedState=u.baseState=r,n={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:n,lastRenderedState:r},u.queue=n,n=n.dispatch=Jv.bind(null,Gt,n),[u.memoizedState,n]},useRef:function(n){var r=wi();return n={current:n},r.memoizedState=n},useState:vp,useDebugValue:yu,useDeferredValue:function(n){return wi().memoizedState=n},useTransition:function(){var n=vp(!1),r=n[0];return n=Zv.bind(null,n[1]),wi().memoizedState=n,[r,n]},useMutableSource:function(){},useSyncExternalStore:function(n,r,l){var u=Gt,p=wi();if(Vt){if(l===void 0)throw Error(t(407));l=l()}else{if(l=r(),sn===null)throw Error(t(349));(Hr&30)!==0||fp(u,r,l)}p.memoizedState=l;var x={value:l,getSnapshot:r};return p.queue=x,_p(pp.bind(null,u,x,n),[n]),u.flags|=2048,Bo(9,dp.bind(null,u,x,l,r),void 0,null),l},useId:function(){var n=wi(),r=sn.identifierPrefix;if(Vt){var l=Oi,u=Fi;l=(u&~(1<<32-pt(u)-1)).toString(32)+l,r=":"+r+"R"+l,l=zo++,0<l&&(r+="H"+l.toString(32)),r+=":"}else l=Kv++,r=":"+r+"r"+l.toString(32)+":";return n.memoizedState=r},unstable_isNewReconciler:!1},tx={readContext:ei,useCallback:wp,useContext:ei,useEffect:_u,useImperativeHandle:Ep,useInsertionEffect:yp,useLayoutEffect:Sp,useMemo:Tp,useReducer:vu,useRef:xp,useState:function(){return vu(ko)},useDebugValue:yu,useDeferredValue:function(n){var r=ti();return Ap(r,Jt.memoizedState,n)},useTransition:function(){var n=vu(ko)[0],r=ti().memoizedState;return[n,r]},useMutableSource:up,useSyncExternalStore:hp,useId:Cp,unstable_isNewReconciler:!1},nx={readContext:ei,useCallback:wp,useContext:ei,useEffect:_u,useImperativeHandle:Ep,useInsertionEffect:yp,useLayoutEffect:Sp,useMemo:Tp,useReducer:xu,useRef:xp,useState:function(){return xu(ko)},useDebugValue:yu,useDeferredValue:function(n){var r=ti();return Jt===null?r.memoizedState=n:Ap(r,Jt.memoizedState,n)},useTransition:function(){var n=xu(ko)[0],r=ti().memoizedState;return[n,r]},useMutableSource:up,useSyncExternalStore:hp,useId:Cp,unstable_isNewReconciler:!1};function ui(n,r){if(n&&n.defaultProps){r=ae({},r),n=n.defaultProps;for(var l in n)r[l]===void 0&&(r[l]=n[l]);return r}return r}function Su(n,r,l,u){r=n.memoizedState,l=l(u,r),l=l==null?r:ae({},r,l),n.memoizedState=l,n.lanes===0&&(n.updateQueue.baseState=l)}var il={isMounted:function(n){return(n=n._reactInternals)?yi(n)===n:!1},enqueueSetState:function(n,r,l){n=n._reactInternals;var u=wn(),p=gr(n),x=ki(u,p);x.payload=r,l!=null&&(x.callback=l),r=fr(n,x,p),r!==null&&(di(r,n,p,u),$a(r,n,p))},enqueueReplaceState:function(n,r,l){n=n._reactInternals;var u=wn(),p=gr(n),x=ki(u,p);x.tag=1,x.payload=r,l!=null&&(x.callback=l),r=fr(n,x,p),r!==null&&(di(r,n,p,u),$a(r,n,p))},enqueueForceUpdate:function(n,r){n=n._reactInternals;var l=wn(),u=gr(n),p=ki(l,u);p.tag=2,r!=null&&(p.callback=r),r=fr(n,p,u),r!==null&&(di(r,n,u,l),$a(r,n,u))}};function Lp(n,r,l,u,p,x,T){return n=n.stateNode,typeof n.shouldComponentUpdate=="function"?n.shouldComponentUpdate(u,x,T):r.prototype&&r.prototype.isPureReactComponent?!Ao(l,u)||!Ao(p,x):!0}function Np(n,r,l){var u=!1,p=cr,x=r.contextType;return typeof x=="object"&&x!==null?x=ei(x):(p=Pn(r)?Or:pn.current,u=r.contextTypes,x=(u=u!=null)?Es(n,p):cr),r=new r(l,x),n.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,r.updater=il,n.stateNode=r,r._reactInternals=n,u&&(n=n.stateNode,n.__reactInternalMemoizedUnmaskedChildContext=p,n.__reactInternalMemoizedMaskedChildContext=x),r}function Ip(n,r,l,u){n=r.state,typeof r.componentWillReceiveProps=="function"&&r.componentWillReceiveProps(l,u),typeof r.UNSAFE_componentWillReceiveProps=="function"&&r.UNSAFE_componentWillReceiveProps(l,u),r.state!==n&&il.enqueueReplaceState(r,r.state,null)}function Mu(n,r,l,u){var p=n.stateNode;p.props=l,p.state=n.memoizedState,p.refs={},lu(n);var x=r.contextType;typeof x=="object"&&x!==null?p.context=ei(x):(x=Pn(r)?Or:pn.current,p.context=Es(n,x)),p.state=n.memoizedState,x=r.getDerivedStateFromProps,typeof x=="function"&&(Su(n,r,x,l),p.state=n.memoizedState),typeof r.getDerivedStateFromProps=="function"||typeof p.getSnapshotBeforeUpdate=="function"||typeof p.UNSAFE_componentWillMount!="function"&&typeof p.componentWillMount!="function"||(r=p.state,typeof p.componentWillMount=="function"&&p.componentWillMount(),typeof p.UNSAFE_componentWillMount=="function"&&p.UNSAFE_componentWillMount(),r!==p.state&&il.enqueueReplaceState(p,p.state,null),Ka(n,l,p,u),p.state=n.memoizedState),typeof p.componentDidMount=="function"&&(n.flags|=4194308)}function Ls(n,r){try{var l="",u=r;do l+=de(u),u=u.return;while(u);var p=l}catch(x){p=`
Error generating stack: `+x.message+`
`+x.stack}return{value:n,source:r,stack:p,digest:null}}function Eu(n,r,l){return{value:n,source:null,stack:l??null,digest:r??null}}function wu(n,r){try{console.error(r.value)}catch(l){setTimeout(function(){throw l})}}var ix=typeof WeakMap=="function"?WeakMap:Map;function Dp(n,r,l){l=ki(-1,l),l.tag=3,l.payload={element:null};var u=r.value;return l.callback=function(){ul||(ul=!0,ku=u),wu(n,r)},l}function Up(n,r,l){l=ki(-1,l),l.tag=3;var u=n.type.getDerivedStateFromError;if(typeof u=="function"){var p=r.value;l.payload=function(){return u(p)},l.callback=function(){wu(n,r)}}var x=n.stateNode;return x!==null&&typeof x.componentDidCatch=="function"&&(l.callback=function(){wu(n,r),typeof u!="function"&&(pr===null?pr=new Set([this]):pr.add(this));var T=r.stack;this.componentDidCatch(r.value,{componentStack:T!==null?T:""})}),l}function Fp(n,r,l){var u=n.pingCache;if(u===null){u=n.pingCache=new ix;var p=new Set;u.set(r,p)}else p=u.get(r),p===void 0&&(p=new Set,u.set(r,p));p.has(l)||(p.add(l),n=vx.bind(null,n,r,l),r.then(n,n))}function Op(n){do{var r;if((r=n.tag===13)&&(r=n.memoizedState,r=r!==null?r.dehydrated!==null:!0),r)return n;n=n.return}while(n!==null);return null}function zp(n,r,l,u,p){return(n.mode&1)===0?(n===r?n.flags|=65536:(n.flags|=128,l.flags|=131072,l.flags&=-52805,l.tag===1&&(l.alternate===null?l.tag=17:(r=ki(-1,1),r.tag=2,fr(l,r,1))),l.lanes|=1),n):(n.flags|=65536,n.lanes=p,n)}var rx=A.ReactCurrentOwner,Ln=!1;function En(n,r,l,u){r.child=n===null?rp(r,null,l,u):Cs(r,n.child,l,u)}function kp(n,r,l,u,p){l=l.render;var x=r.ref;return bs(r,p),u=mu(n,r,l,u,x,p),l=gu(),n!==null&&!Ln?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,Bi(n,r,p)):(Vt&&l&&Jc(r),r.flags|=1,En(n,r,u,p),r.child)}function Bp(n,r,l,u,p){if(n===null){var x=l.type;return typeof x=="function"&&!Xu(x)&&x.defaultProps===void 0&&l.compare===null&&l.defaultProps===void 0?(r.tag=15,r.type=x,Vp(n,r,x,u,p)):(n=gl(l.type,null,u,r,r.mode,p),n.ref=r.ref,n.return=r,r.child=n)}if(x=n.child,(n.lanes&p)===0){var T=x.memoizedProps;if(l=l.compare,l=l!==null?l:Ao,l(T,u)&&n.ref===r.ref)return Bi(n,r,p)}return r.flags|=1,n=xr(x,u),n.ref=r.ref,n.return=r,r.child=n}function Vp(n,r,l,u,p){if(n!==null){var x=n.memoizedProps;if(Ao(x,u)&&n.ref===r.ref)if(Ln=!1,r.pendingProps=u=x,(n.lanes&p)!==0)(n.flags&131072)!==0&&(Ln=!0);else return r.lanes=n.lanes,Bi(n,r,p)}return Tu(n,r,l,u,p)}function Hp(n,r,l){var u=r.pendingProps,p=u.children,x=n!==null?n.memoizedState:null;if(u.mode==="hidden")if((r.mode&1)===0)r.memoizedState={baseLanes:0,cachePool:null,transitions:null},Ot(Is,Gn),Gn|=l;else{if((l&1073741824)===0)return n=x!==null?x.baseLanes|l:l,r.lanes=r.childLanes=1073741824,r.memoizedState={baseLanes:n,cachePool:null,transitions:null},r.updateQueue=null,Ot(Is,Gn),Gn|=n,null;r.memoizedState={baseLanes:0,cachePool:null,transitions:null},u=x!==null?x.baseLanes:l,Ot(Is,Gn),Gn|=u}else x!==null?(u=x.baseLanes|l,r.memoizedState=null):u=l,Ot(Is,Gn),Gn|=u;return En(n,r,p,l),r.child}function Gp(n,r){var l=r.ref;(n===null&&l!==null||n!==null&&n.ref!==l)&&(r.flags|=512,r.flags|=2097152)}function Tu(n,r,l,u,p){var x=Pn(l)?Or:pn.current;return x=Es(r,x),bs(r,p),l=mu(n,r,l,u,x,p),u=gu(),n!==null&&!Ln?(r.updateQueue=n.updateQueue,r.flags&=-2053,n.lanes&=~p,Bi(n,r,p)):(Vt&&u&&Jc(r),r.flags|=1,En(n,r,l,p),r.child)}function Wp(n,r,l,u,p){if(Pn(l)){var x=!0;Va(r)}else x=!1;if(bs(r,p),r.stateNode===null)sl(n,r),Np(r,l,u),Mu(r,l,u,p),u=!0;else if(n===null){var T=r.stateNode,D=r.memoizedProps;T.props=D;var H=T.context,te=l.contextType;typeof te=="object"&&te!==null?te=ei(te):(te=Pn(l)?Or:pn.current,te=Es(r,te));var ye=l.getDerivedStateFromProps,Se=typeof ye=="function"||typeof T.getSnapshotBeforeUpdate=="function";Se||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(D!==u||H!==te)&&Ip(r,T,u,te),hr=!1;var _e=r.memoizedState;T.state=_e,Ka(r,u,T,p),H=r.memoizedState,D!==u||_e!==H||bn.current||hr?(typeof ye=="function"&&(Su(r,l,ye,u),H=r.memoizedState),(D=hr||Lp(r,l,D,u,_e,H,te))?(Se||typeof T.UNSAFE_componentWillMount!="function"&&typeof T.componentWillMount!="function"||(typeof T.componentWillMount=="function"&&T.componentWillMount(),typeof T.UNSAFE_componentWillMount=="function"&&T.UNSAFE_componentWillMount()),typeof T.componentDidMount=="function"&&(r.flags|=4194308)):(typeof T.componentDidMount=="function"&&(r.flags|=4194308),r.memoizedProps=u,r.memoizedState=H),T.props=u,T.state=H,T.context=te,u=D):(typeof T.componentDidMount=="function"&&(r.flags|=4194308),u=!1)}else{T=r.stateNode,op(n,r),D=r.memoizedProps,te=r.type===r.elementType?D:ui(r.type,D),T.props=te,Se=r.pendingProps,_e=T.context,H=l.contextType,typeof H=="object"&&H!==null?H=ei(H):(H=Pn(l)?Or:pn.current,H=Es(r,H));var ke=l.getDerivedStateFromProps;(ye=typeof ke=="function"||typeof T.getSnapshotBeforeUpdate=="function")||typeof T.UNSAFE_componentWillReceiveProps!="function"&&typeof T.componentWillReceiveProps!="function"||(D!==Se||_e!==H)&&Ip(r,T,u,H),hr=!1,_e=r.memoizedState,T.state=_e,Ka(r,u,T,p);var Xe=r.memoizedState;D!==Se||_e!==Xe||bn.current||hr?(typeof ke=="function"&&(Su(r,l,ke,u),Xe=r.memoizedState),(te=hr||Lp(r,l,te,u,_e,Xe,H)||!1)?(ye||typeof T.UNSAFE_componentWillUpdate!="function"&&typeof T.componentWillUpdate!="function"||(typeof T.componentWillUpdate=="function"&&T.componentWillUpdate(u,Xe,H),typeof T.UNSAFE_componentWillUpdate=="function"&&T.UNSAFE_componentWillUpdate(u,Xe,H)),typeof T.componentDidUpdate=="function"&&(r.flags|=4),typeof T.getSnapshotBeforeUpdate=="function"&&(r.flags|=1024)):(typeof T.componentDidUpdate!="function"||D===n.memoizedProps&&_e===n.memoizedState||(r.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||D===n.memoizedProps&&_e===n.memoizedState||(r.flags|=1024),r.memoizedProps=u,r.memoizedState=Xe),T.props=u,T.state=Xe,T.context=H,u=te):(typeof T.componentDidUpdate!="function"||D===n.memoizedProps&&_e===n.memoizedState||(r.flags|=4),typeof T.getSnapshotBeforeUpdate!="function"||D===n.memoizedProps&&_e===n.memoizedState||(r.flags|=1024),u=!1)}return Au(n,r,l,u,x,p)}function Au(n,r,l,u,p,x){Gp(n,r);var T=(r.flags&128)!==0;if(!u&&!T)return p&&$d(r,l,!1),Bi(n,r,x);u=r.stateNode,rx.current=r;var D=T&&typeof l.getDerivedStateFromError!="function"?null:u.render();return r.flags|=1,n!==null&&T?(r.child=Cs(r,n.child,null,x),r.child=Cs(r,null,D,x)):En(n,r,D,x),r.memoizedState=u.state,p&&$d(r,l,!0),r.child}function jp(n){var r=n.stateNode;r.pendingContext?Yd(n,r.pendingContext,r.pendingContext!==r.context):r.context&&Yd(n,r.context,!1),cu(n,r.containerInfo)}function Xp(n,r,l,u,p){return As(),nu(p),r.flags|=256,En(n,r,l,u),r.child}var Cu={dehydrated:null,treeContext:null,retryLane:0};function Ru(n){return{baseLanes:n,cachePool:null,transitions:null}}function Yp(n,r,l){var u=r.pendingProps,p=Ht.current,x=!1,T=(r.flags&128)!==0,D;if((D=T)||(D=n!==null&&n.memoizedState===null?!1:(p&2)!==0),D?(x=!0,r.flags&=-129):(n===null||n.memoizedState!==null)&&(p|=1),Ot(Ht,p&1),n===null)return tu(r),n=r.memoizedState,n!==null&&(n=n.dehydrated,n!==null)?((r.mode&1)===0?r.lanes=1:n.data==="$!"?r.lanes=8:r.lanes=1073741824,null):(T=u.children,n=u.fallback,x?(u=r.mode,x=r.child,T={mode:"hidden",children:T},(u&1)===0&&x!==null?(x.childLanes=0,x.pendingProps=T):x=vl(T,u,0,null),n=Yr(n,u,l,null),x.return=r,n.return=r,x.sibling=n,r.child=x,r.child.memoizedState=Ru(l),r.memoizedState=Cu,n):bu(r,T));if(p=n.memoizedState,p!==null&&(D=p.dehydrated,D!==null))return sx(n,r,T,u,D,p,l);if(x){x=u.fallback,T=r.mode,p=n.child,D=p.sibling;var H={mode:"hidden",children:u.children};return(T&1)===0&&r.child!==p?(u=r.child,u.childLanes=0,u.pendingProps=H,r.deletions=null):(u=xr(p,H),u.subtreeFlags=p.subtreeFlags&14680064),D!==null?x=xr(D,x):(x=Yr(x,T,l,null),x.flags|=2),x.return=r,u.return=r,u.sibling=x,r.child=u,u=x,x=r.child,T=n.child.memoizedState,T=T===null?Ru(l):{baseLanes:T.baseLanes|l,cachePool:null,transitions:T.transitions},x.memoizedState=T,x.childLanes=n.childLanes&~l,r.memoizedState=Cu,u}return x=n.child,n=x.sibling,u=xr(x,{mode:"visible",children:u.children}),(r.mode&1)===0&&(u.lanes=l),u.return=r,u.sibling=null,n!==null&&(l=r.deletions,l===null?(r.deletions=[n],r.flags|=16):l.push(n)),r.child=u,r.memoizedState=null,u}function bu(n,r){return r=vl({mode:"visible",children:r},n.mode,0,null),r.return=n,n.child=r}function rl(n,r,l,u){return u!==null&&nu(u),Cs(r,n.child,null,l),n=bu(r,r.pendingProps.children),n.flags|=2,r.memoizedState=null,n}function sx(n,r,l,u,p,x,T){if(l)return r.flags&256?(r.flags&=-257,u=Eu(Error(t(422))),rl(n,r,T,u)):r.memoizedState!==null?(r.child=n.child,r.flags|=128,null):(x=u.fallback,p=r.mode,u=vl({mode:"visible",children:u.children},p,0,null),x=Yr(x,p,T,null),x.flags|=2,u.return=r,x.return=r,u.sibling=x,r.child=u,(r.mode&1)!==0&&Cs(r,n.child,null,T),r.child.memoizedState=Ru(T),r.memoizedState=Cu,x);if((r.mode&1)===0)return rl(n,r,T,null);if(p.data==="$!"){if(u=p.nextSibling&&p.nextSibling.dataset,u)var D=u.dgst;return u=D,x=Error(t(419)),u=Eu(x,u,void 0),rl(n,r,T,u)}if(D=(T&n.childLanes)!==0,Ln||D){if(u=sn,u!==null){switch(T&-T){case 4:p=2;break;case 16:p=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:p=32;break;case 536870912:p=268435456;break;default:p=0}p=(p&(u.suspendedLanes|T))!==0?0:p,p!==0&&p!==x.retryLane&&(x.retryLane=p,zi(n,p),di(u,n,p,-1))}return ju(),u=Eu(Error(t(421))),rl(n,r,T,u)}return p.data==="$?"?(r.flags|=128,r.child=n.child,r=xx.bind(null,n),p._reactRetry=r,null):(n=x.treeContext,Hn=ar(p.nextSibling),Vn=r,Vt=!0,ci=null,n!==null&&(Jn[Qn++]=Fi,Jn[Qn++]=Oi,Jn[Qn++]=zr,Fi=n.id,Oi=n.overflow,zr=r),r=bu(r,u.children),r.flags|=4096,r)}function qp(n,r,l){n.lanes|=r;var u=n.alternate;u!==null&&(u.lanes|=r),ou(n.return,r,l)}function Pu(n,r,l,u,p){var x=n.memoizedState;x===null?n.memoizedState={isBackwards:r,rendering:null,renderingStartTime:0,last:u,tail:l,tailMode:p}:(x.isBackwards=r,x.rendering=null,x.renderingStartTime=0,x.last=u,x.tail=l,x.tailMode=p)}function $p(n,r,l){var u=r.pendingProps,p=u.revealOrder,x=u.tail;if(En(n,r,u.children,l),u=Ht.current,(u&2)!==0)u=u&1|2,r.flags|=128;else{if(n!==null&&(n.flags&128)!==0)e:for(n=r.child;n!==null;){if(n.tag===13)n.memoizedState!==null&&qp(n,l,r);else if(n.tag===19)qp(n,l,r);else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===r)break e;for(;n.sibling===null;){if(n.return===null||n.return===r)break e;n=n.return}n.sibling.return=n.return,n=n.sibling}u&=1}if(Ot(Ht,u),(r.mode&1)===0)r.memoizedState=null;else switch(p){case"forwards":for(l=r.child,p=null;l!==null;)n=l.alternate,n!==null&&Za(n)===null&&(p=l),l=l.sibling;l=p,l===null?(p=r.child,r.child=null):(p=l.sibling,l.sibling=null),Pu(r,!1,p,l,x);break;case"backwards":for(l=null,p=r.child,r.child=null;p!==null;){if(n=p.alternate,n!==null&&Za(n)===null){r.child=p;break}n=p.sibling,p.sibling=l,l=p,p=n}Pu(r,!0,l,null,x);break;case"together":Pu(r,!1,null,null,void 0);break;default:r.memoizedState=null}return r.child}function sl(n,r){(r.mode&1)===0&&n!==null&&(n.alternate=null,r.alternate=null,r.flags|=2)}function Bi(n,r,l){if(n!==null&&(r.dependencies=n.dependencies),Gr|=r.lanes,(l&r.childLanes)===0)return null;if(n!==null&&r.child!==n.child)throw Error(t(153));if(r.child!==null){for(n=r.child,l=xr(n,n.pendingProps),r.child=l,l.return=r;n.sibling!==null;)n=n.sibling,l=l.sibling=xr(n,n.pendingProps),l.return=r;l.sibling=null}return r.child}function ox(n,r,l){switch(r.tag){case 3:jp(r),As();break;case 5:cp(r);break;case 1:Pn(r.type)&&Va(r);break;case 4:cu(r,r.stateNode.containerInfo);break;case 10:var u=r.type._context,p=r.memoizedProps.value;Ot(Ya,u._currentValue),u._currentValue=p;break;case 13:if(u=r.memoizedState,u!==null)return u.dehydrated!==null?(Ot(Ht,Ht.current&1),r.flags|=128,null):(l&r.child.childLanes)!==0?Yp(n,r,l):(Ot(Ht,Ht.current&1),n=Bi(n,r,l),n!==null?n.sibling:null);Ot(Ht,Ht.current&1);break;case 19:if(u=(l&r.childLanes)!==0,(n.flags&128)!==0){if(u)return $p(n,r,l);r.flags|=128}if(p=r.memoizedState,p!==null&&(p.rendering=null,p.tail=null,p.lastEffect=null),Ot(Ht,Ht.current),u)break;return null;case 22:case 23:return r.lanes=0,Hp(n,r,l)}return Bi(n,r,l)}var Kp,Lu,Zp,Jp;Kp=function(n,r){for(var l=r.child;l!==null;){if(l.tag===5||l.tag===6)n.appendChild(l.stateNode);else if(l.tag!==4&&l.child!==null){l.child.return=l,l=l.child;continue}if(l===r)break;for(;l.sibling===null;){if(l.return===null||l.return===r)return;l=l.return}l.sibling.return=l.return,l=l.sibling}},Lu=function(){},Zp=function(n,r,l,u){var p=n.memoizedProps;if(p!==u){n=r.stateNode,Vr(Ei.current);var x=null;switch(l){case"input":p=O(n,p),u=O(n,u),x=[];break;case"select":p=ae({},p,{value:void 0}),u=ae({},u,{value:void 0}),x=[];break;case"textarea":p=C(n,p),u=C(n,u),x=[];break;default:typeof p.onClick!="function"&&typeof u.onClick=="function"&&(n.onclick=za)}xt(l,u);var T;l=null;for(te in p)if(!u.hasOwnProperty(te)&&p.hasOwnProperty(te)&&p[te]!=null)if(te==="style"){var D=p[te];for(T in D)D.hasOwnProperty(T)&&(l||(l={}),l[T]="")}else te!=="dangerouslySetInnerHTML"&&te!=="children"&&te!=="suppressContentEditableWarning"&&te!=="suppressHydrationWarning"&&te!=="autoFocus"&&(o.hasOwnProperty(te)?x||(x=[]):(x=x||[]).push(te,null));for(te in u){var H=u[te];if(D=p?.[te],u.hasOwnProperty(te)&&H!==D&&(H!=null||D!=null))if(te==="style")if(D){for(T in D)!D.hasOwnProperty(T)||H&&H.hasOwnProperty(T)||(l||(l={}),l[T]="");for(T in H)H.hasOwnProperty(T)&&D[T]!==H[T]&&(l||(l={}),l[T]=H[T])}else l||(x||(x=[]),x.push(te,l)),l=H;else te==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,D=D?D.__html:void 0,H!=null&&D!==H&&(x=x||[]).push(te,H)):te==="children"?typeof H!="string"&&typeof H!="number"||(x=x||[]).push(te,""+H):te!=="suppressContentEditableWarning"&&te!=="suppressHydrationWarning"&&(o.hasOwnProperty(te)?(H!=null&&te==="onScroll"&&kt("scroll",n),x||D===H||(x=[])):(x=x||[]).push(te,H))}l&&(x=x||[]).push("style",l);var te=x;(r.updateQueue=te)&&(r.flags|=4)}},Jp=function(n,r,l,u){l!==u&&(r.flags|=4)};function Vo(n,r){if(!Vt)switch(n.tailMode){case"hidden":r=n.tail;for(var l=null;r!==null;)r.alternate!==null&&(l=r),r=r.sibling;l===null?n.tail=null:l.sibling=null;break;case"collapsed":l=n.tail;for(var u=null;l!==null;)l.alternate!==null&&(u=l),l=l.sibling;u===null?r||n.tail===null?n.tail=null:n.tail.sibling=null:u.sibling=null}}function gn(n){var r=n.alternate!==null&&n.alternate.child===n.child,l=0,u=0;if(r)for(var p=n.child;p!==null;)l|=p.lanes|p.childLanes,u|=p.subtreeFlags&14680064,u|=p.flags&14680064,p.return=n,p=p.sibling;else for(p=n.child;p!==null;)l|=p.lanes|p.childLanes,u|=p.subtreeFlags,u|=p.flags,p.return=n,p=p.sibling;return n.subtreeFlags|=u,n.childLanes=l,r}function ax(n,r,l){var u=r.pendingProps;switch(Qc(r),r.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return gn(r),null;case 1:return Pn(r.type)&&Ba(),gn(r),null;case 3:return u=r.stateNode,Ps(),Bt(bn),Bt(pn),fu(),u.pendingContext&&(u.context=u.pendingContext,u.pendingContext=null),(n===null||n.child===null)&&(ja(r)?r.flags|=4:n===null||n.memoizedState.isDehydrated&&(r.flags&256)===0||(r.flags|=1024,ci!==null&&(Hu(ci),ci=null))),Lu(n,r),gn(r),null;case 5:uu(r);var p=Vr(Fo.current);if(l=r.type,n!==null&&r.stateNode!=null)Zp(n,r,l,u,p),n.ref!==r.ref&&(r.flags|=512,r.flags|=2097152);else{if(!u){if(r.stateNode===null)throw Error(t(166));return gn(r),null}if(n=Vr(Ei.current),ja(r)){u=r.stateNode,l=r.type;var x=r.memoizedProps;switch(u[Mi]=r,u[Lo]=x,n=(r.mode&1)!==0,l){case"dialog":kt("cancel",u),kt("close",u);break;case"iframe":case"object":case"embed":kt("load",u);break;case"video":case"audio":for(p=0;p<Ro.length;p++)kt(Ro[p],u);break;case"source":kt("error",u);break;case"img":case"image":case"link":kt("error",u),kt("load",u);break;case"details":kt("toggle",u);break;case"input":Ze(u,x),kt("invalid",u);break;case"select":u._wrapperState={wasMultiple:!!x.multiple},kt("invalid",u);break;case"textarea":Z(u,x),kt("invalid",u)}xt(l,x),p=null;for(var T in x)if(x.hasOwnProperty(T)){var D=x[T];T==="children"?typeof D=="string"?u.textContent!==D&&(x.suppressHydrationWarning!==!0&&Oa(u.textContent,D,n),p=["children",D]):typeof D=="number"&&u.textContent!==""+D&&(x.suppressHydrationWarning!==!0&&Oa(u.textContent,D,n),p=["children",""+D]):o.hasOwnProperty(T)&&D!=null&&T==="onScroll"&&kt("scroll",u)}switch(l){case"input":vt(u),Pe(u,x,!0);break;case"textarea":vt(u),xe(u);break;case"select":case"option":break;default:typeof x.onClick=="function"&&(u.onclick=za)}u=p,r.updateQueue=u,u!==null&&(r.flags|=4)}else{T=p.nodeType===9?p:p.ownerDocument,n==="http://www.w3.org/1999/xhtml"&&(n=pe(l)),n==="http://www.w3.org/1999/xhtml"?l==="script"?(n=T.createElement("div"),n.innerHTML="<script><\/script>",n=n.removeChild(n.firstChild)):typeof u.is=="string"?n=T.createElement(l,{is:u.is}):(n=T.createElement(l),l==="select"&&(T=n,u.multiple?T.multiple=!0:u.size&&(T.size=u.size))):n=T.createElementNS(n,l),n[Mi]=r,n[Lo]=u,Kp(n,r,!1,!1),r.stateNode=n;e:{switch(T=ht(l,u),l){case"dialog":kt("cancel",n),kt("close",n),p=u;break;case"iframe":case"object":case"embed":kt("load",n),p=u;break;case"video":case"audio":for(p=0;p<Ro.length;p++)kt(Ro[p],n);p=u;break;case"source":kt("error",n),p=u;break;case"img":case"image":case"link":kt("error",n),kt("load",n),p=u;break;case"details":kt("toggle",n),p=u;break;case"input":Ze(n,u),p=O(n,u),kt("invalid",n);break;case"option":p=u;break;case"select":n._wrapperState={wasMultiple:!!u.multiple},p=ae({},u,{value:void 0}),kt("invalid",n);break;case"textarea":Z(n,u),p=C(n,u),kt("invalid",n);break;default:p=u}xt(l,p),D=p;for(x in D)if(D.hasOwnProperty(x)){var H=D[x];x==="style"?at(n,H):x==="dangerouslySetInnerHTML"?(H=H?H.__html:void 0,H!=null&&He(n,H)):x==="children"?typeof H=="string"?(l!=="textarea"||H!=="")&&dt(n,H):typeof H=="number"&&dt(n,""+H):x!=="suppressContentEditableWarning"&&x!=="suppressHydrationWarning"&&x!=="autoFocus"&&(o.hasOwnProperty(x)?H!=null&&x==="onScroll"&&kt("scroll",n):H!=null&&b(n,x,H,T))}switch(l){case"input":vt(n),Pe(n,u,!1);break;case"textarea":vt(n),xe(n);break;case"option":u.value!=null&&n.setAttribute("value",""+be(u.value));break;case"select":n.multiple=!!u.multiple,x=u.value,x!=null?I(n,!!u.multiple,x,!1):u.defaultValue!=null&&I(n,!!u.multiple,u.defaultValue,!0);break;default:typeof p.onClick=="function"&&(n.onclick=za)}switch(l){case"button":case"input":case"select":case"textarea":u=!!u.autoFocus;break e;case"img":u=!0;break e;default:u=!1}}u&&(r.flags|=4)}r.ref!==null&&(r.flags|=512,r.flags|=2097152)}return gn(r),null;case 6:if(n&&r.stateNode!=null)Jp(n,r,n.memoizedProps,u);else{if(typeof u!="string"&&r.stateNode===null)throw Error(t(166));if(l=Vr(Fo.current),Vr(Ei.current),ja(r)){if(u=r.stateNode,l=r.memoizedProps,u[Mi]=r,(x=u.nodeValue!==l)&&(n=Vn,n!==null))switch(n.tag){case 3:Oa(u.nodeValue,l,(n.mode&1)!==0);break;case 5:n.memoizedProps.suppressHydrationWarning!==!0&&Oa(u.nodeValue,l,(n.mode&1)!==0)}x&&(r.flags|=4)}else u=(l.nodeType===9?l:l.ownerDocument).createTextNode(u),u[Mi]=r,r.stateNode=u}return gn(r),null;case 13:if(Bt(Ht),u=r.memoizedState,n===null||n.memoizedState!==null&&n.memoizedState.dehydrated!==null){if(Vt&&Hn!==null&&(r.mode&1)!==0&&(r.flags&128)===0)tp(),As(),r.flags|=98560,x=!1;else if(x=ja(r),u!==null&&u.dehydrated!==null){if(n===null){if(!x)throw Error(t(318));if(x=r.memoizedState,x=x!==null?x.dehydrated:null,!x)throw Error(t(317));x[Mi]=r}else As(),(r.flags&128)===0&&(r.memoizedState=null),r.flags|=4;gn(r),x=!1}else ci!==null&&(Hu(ci),ci=null),x=!0;if(!x)return r.flags&65536?r:null}return(r.flags&128)!==0?(r.lanes=l,r):(u=u!==null,u!==(n!==null&&n.memoizedState!==null)&&u&&(r.child.flags|=8192,(r.mode&1)!==0&&(n===null||(Ht.current&1)!==0?Qt===0&&(Qt=3):ju())),r.updateQueue!==null&&(r.flags|=4),gn(r),null);case 4:return Ps(),Lu(n,r),n===null&&bo(r.stateNode.containerInfo),gn(r),null;case 10:return su(r.type._context),gn(r),null;case 17:return Pn(r.type)&&Ba(),gn(r),null;case 19:if(Bt(Ht),x=r.memoizedState,x===null)return gn(r),null;if(u=(r.flags&128)!==0,T=x.rendering,T===null)if(u)Vo(x,!1);else{if(Qt!==0||n!==null&&(n.flags&128)!==0)for(n=r.child;n!==null;){if(T=Za(n),T!==null){for(r.flags|=128,Vo(x,!1),u=T.updateQueue,u!==null&&(r.updateQueue=u,r.flags|=4),r.subtreeFlags=0,u=l,l=r.child;l!==null;)x=l,n=u,x.flags&=14680066,T=x.alternate,T===null?(x.childLanes=0,x.lanes=n,x.child=null,x.subtreeFlags=0,x.memoizedProps=null,x.memoizedState=null,x.updateQueue=null,x.dependencies=null,x.stateNode=null):(x.childLanes=T.childLanes,x.lanes=T.lanes,x.child=T.child,x.subtreeFlags=0,x.deletions=null,x.memoizedProps=T.memoizedProps,x.memoizedState=T.memoizedState,x.updateQueue=T.updateQueue,x.type=T.type,n=T.dependencies,x.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),l=l.sibling;return Ot(Ht,Ht.current&1|2),r.child}n=n.sibling}x.tail!==null&&Te()>Ds&&(r.flags|=128,u=!0,Vo(x,!1),r.lanes=4194304)}else{if(!u)if(n=Za(T),n!==null){if(r.flags|=128,u=!0,l=n.updateQueue,l!==null&&(r.updateQueue=l,r.flags|=4),Vo(x,!0),x.tail===null&&x.tailMode==="hidden"&&!T.alternate&&!Vt)return gn(r),null}else 2*Te()-x.renderingStartTime>Ds&&l!==1073741824&&(r.flags|=128,u=!0,Vo(x,!1),r.lanes=4194304);x.isBackwards?(T.sibling=r.child,r.child=T):(l=x.last,l!==null?l.sibling=T:r.child=T,x.last=T)}return x.tail!==null?(r=x.tail,x.rendering=r,x.tail=r.sibling,x.renderingStartTime=Te(),r.sibling=null,l=Ht.current,Ot(Ht,u?l&1|2:l&1),r):(gn(r),null);case 22:case 23:return Wu(),u=r.memoizedState!==null,n!==null&&n.memoizedState!==null!==u&&(r.flags|=8192),u&&(r.mode&1)!==0?(Gn&1073741824)!==0&&(gn(r),r.subtreeFlags&6&&(r.flags|=8192)):gn(r),null;case 24:return null;case 25:return null}throw Error(t(156,r.tag))}function lx(n,r){switch(Qc(r),r.tag){case 1:return Pn(r.type)&&Ba(),n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 3:return Ps(),Bt(bn),Bt(pn),fu(),n=r.flags,(n&65536)!==0&&(n&128)===0?(r.flags=n&-65537|128,r):null;case 5:return uu(r),null;case 13:if(Bt(Ht),n=r.memoizedState,n!==null&&n.dehydrated!==null){if(r.alternate===null)throw Error(t(340));As()}return n=r.flags,n&65536?(r.flags=n&-65537|128,r):null;case 19:return Bt(Ht),null;case 4:return Ps(),null;case 10:return su(r.type._context),null;case 22:case 23:return Wu(),null;case 24:return null;default:return null}}var ol=!1,vn=!1,cx=typeof WeakSet=="function"?WeakSet:Set,Ge=null;function Ns(n,r){var l=n.ref;if(l!==null)if(typeof l=="function")try{l(null)}catch(u){jt(n,r,u)}else l.current=null}function Nu(n,r,l){try{l()}catch(u){jt(n,r,u)}}var Qp=!1;function ux(n,r){if(Wc=Aa,n=Ld(),Fc(n)){if("selectionStart"in n)var l={start:n.selectionStart,end:n.selectionEnd};else e:{l=(l=n.ownerDocument)&&l.defaultView||window;var u=l.getSelection&&l.getSelection();if(u&&u.rangeCount!==0){l=u.anchorNode;var p=u.anchorOffset,x=u.focusNode;u=u.focusOffset;try{l.nodeType,x.nodeType}catch{l=null;break e}var T=0,D=-1,H=-1,te=0,ye=0,Se=n,_e=null;t:for(;;){for(var ke;Se!==l||p!==0&&Se.nodeType!==3||(D=T+p),Se!==x||u!==0&&Se.nodeType!==3||(H=T+u),Se.nodeType===3&&(T+=Se.nodeValue.length),(ke=Se.firstChild)!==null;)_e=Se,Se=ke;for(;;){if(Se===n)break t;if(_e===l&&++te===p&&(D=T),_e===x&&++ye===u&&(H=T),(ke=Se.nextSibling)!==null)break;Se=_e,_e=Se.parentNode}Se=ke}l=D===-1||H===-1?null:{start:D,end:H}}else l=null}l=l||{start:0,end:0}}else l=null;for(jc={focusedElem:n,selectionRange:l},Aa=!1,Ge=r;Ge!==null;)if(r=Ge,n=r.child,(r.subtreeFlags&1028)!==0&&n!==null)n.return=r,Ge=n;else for(;Ge!==null;){r=Ge;try{var Xe=r.alternate;if((r.flags&1024)!==0)switch(r.tag){case 0:case 11:case 15:break;case 1:if(Xe!==null){var $e=Xe.memoizedProps,Xt=Xe.memoizedState,$=r.stateNode,j=$.getSnapshotBeforeUpdate(r.elementType===r.type?$e:ui(r.type,$e),Xt);$.__reactInternalSnapshotBeforeUpdate=j}break;case 3:var J=r.stateNode.containerInfo;J.nodeType===1?J.textContent="":J.nodeType===9&&J.documentElement&&J.removeChild(J.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(t(163))}}catch(Ce){jt(r,r.return,Ce)}if(n=r.sibling,n!==null){n.return=r.return,Ge=n;break}Ge=r.return}return Xe=Qp,Qp=!1,Xe}function Ho(n,r,l){var u=r.updateQueue;if(u=u!==null?u.lastEffect:null,u!==null){var p=u=u.next;do{if((p.tag&n)===n){var x=p.destroy;p.destroy=void 0,x!==void 0&&Nu(r,l,x)}p=p.next}while(p!==u)}}function al(n,r){if(r=r.updateQueue,r=r!==null?r.lastEffect:null,r!==null){var l=r=r.next;do{if((l.tag&n)===n){var u=l.create;l.destroy=u()}l=l.next}while(l!==r)}}function Iu(n){var r=n.ref;if(r!==null){var l=n.stateNode;switch(n.tag){case 5:n=l;break;default:n=l}typeof r=="function"?r(n):r.current=n}}function em(n){var r=n.alternate;r!==null&&(n.alternate=null,em(r)),n.child=null,n.deletions=null,n.sibling=null,n.tag===5&&(r=n.stateNode,r!==null&&(delete r[Mi],delete r[Lo],delete r[$c],delete r[Xv],delete r[Yv])),n.stateNode=null,n.return=null,n.dependencies=null,n.memoizedProps=null,n.memoizedState=null,n.pendingProps=null,n.stateNode=null,n.updateQueue=null}function tm(n){return n.tag===5||n.tag===3||n.tag===4}function nm(n){e:for(;;){for(;n.sibling===null;){if(n.return===null||tm(n.return))return null;n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue e;n.child.return=n,n=n.child}if(!(n.flags&2))return n.stateNode}}function Du(n,r,l){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?l.nodeType===8?l.parentNode.insertBefore(n,r):l.insertBefore(n,r):(l.nodeType===8?(r=l.parentNode,r.insertBefore(n,l)):(r=l,r.appendChild(n)),l=l._reactRootContainer,l!=null||r.onclick!==null||(r.onclick=za));else if(u!==4&&(n=n.child,n!==null))for(Du(n,r,l),n=n.sibling;n!==null;)Du(n,r,l),n=n.sibling}function Uu(n,r,l){var u=n.tag;if(u===5||u===6)n=n.stateNode,r?l.insertBefore(n,r):l.appendChild(n);else if(u!==4&&(n=n.child,n!==null))for(Uu(n,r,l),n=n.sibling;n!==null;)Uu(n,r,l),n=n.sibling}var cn=null,hi=!1;function dr(n,r,l){for(l=l.child;l!==null;)im(n,r,l),l=l.sibling}function im(n,r,l){if(St&&typeof St.onCommitFiberUnmount=="function")try{St.onCommitFiberUnmount(Rt,l)}catch{}switch(l.tag){case 5:vn||Ns(l,r);case 6:var u=cn,p=hi;cn=null,dr(n,r,l),cn=u,hi=p,cn!==null&&(hi?(n=cn,l=l.stateNode,n.nodeType===8?n.parentNode.removeChild(l):n.removeChild(l)):cn.removeChild(l.stateNode));break;case 18:cn!==null&&(hi?(n=cn,l=l.stateNode,n.nodeType===8?qc(n.parentNode,l):n.nodeType===1&&qc(n,l),yo(n)):qc(cn,l.stateNode));break;case 4:u=cn,p=hi,cn=l.stateNode.containerInfo,hi=!0,dr(n,r,l),cn=u,hi=p;break;case 0:case 11:case 14:case 15:if(!vn&&(u=l.updateQueue,u!==null&&(u=u.lastEffect,u!==null))){p=u=u.next;do{var x=p,T=x.destroy;x=x.tag,T!==void 0&&((x&2)!==0||(x&4)!==0)&&Nu(l,r,T),p=p.next}while(p!==u)}dr(n,r,l);break;case 1:if(!vn&&(Ns(l,r),u=l.stateNode,typeof u.componentWillUnmount=="function"))try{u.props=l.memoizedProps,u.state=l.memoizedState,u.componentWillUnmount()}catch(D){jt(l,r,D)}dr(n,r,l);break;case 21:dr(n,r,l);break;case 22:l.mode&1?(vn=(u=vn)||l.memoizedState!==null,dr(n,r,l),vn=u):dr(n,r,l);break;default:dr(n,r,l)}}function rm(n){var r=n.updateQueue;if(r!==null){n.updateQueue=null;var l=n.stateNode;l===null&&(l=n.stateNode=new cx),r.forEach(function(u){var p=_x.bind(null,n,u);l.has(u)||(l.add(u),u.then(p,p))})}}function fi(n,r){var l=r.deletions;if(l!==null)for(var u=0;u<l.length;u++){var p=l[u];try{var x=n,T=r,D=T;e:for(;D!==null;){switch(D.tag){case 5:cn=D.stateNode,hi=!1;break e;case 3:cn=D.stateNode.containerInfo,hi=!0;break e;case 4:cn=D.stateNode.containerInfo,hi=!0;break e}D=D.return}if(cn===null)throw Error(t(160));im(x,T,p),cn=null,hi=!1;var H=p.alternate;H!==null&&(H.return=null),p.return=null}catch(te){jt(p,r,te)}}if(r.subtreeFlags&12854)for(r=r.child;r!==null;)sm(r,n),r=r.sibling}function sm(n,r){var l=n.alternate,u=n.flags;switch(n.tag){case 0:case 11:case 14:case 15:if(fi(r,n),Ti(n),u&4){try{Ho(3,n,n.return),al(3,n)}catch($e){jt(n,n.return,$e)}try{Ho(5,n,n.return)}catch($e){jt(n,n.return,$e)}}break;case 1:fi(r,n),Ti(n),u&512&&l!==null&&Ns(l,l.return);break;case 5:if(fi(r,n),Ti(n),u&512&&l!==null&&Ns(l,l.return),n.flags&32){var p=n.stateNode;try{dt(p,"")}catch($e){jt(n,n.return,$e)}}if(u&4&&(p=n.stateNode,p!=null)){var x=n.memoizedProps,T=l!==null?l.memoizedProps:x,D=n.type,H=n.updateQueue;if(n.updateQueue=null,H!==null)try{D==="input"&&x.type==="radio"&&x.name!=null&&Me(p,x),ht(D,T);var te=ht(D,x);for(T=0;T<H.length;T+=2){var ye=H[T],Se=H[T+1];ye==="style"?at(p,Se):ye==="dangerouslySetInnerHTML"?He(p,Se):ye==="children"?dt(p,Se):b(p,ye,Se,te)}switch(D){case"input":Ve(p,x);break;case"textarea":fe(p,x);break;case"select":var _e=p._wrapperState.wasMultiple;p._wrapperState.wasMultiple=!!x.multiple;var ke=x.value;ke!=null?I(p,!!x.multiple,ke,!1):_e!==!!x.multiple&&(x.defaultValue!=null?I(p,!!x.multiple,x.defaultValue,!0):I(p,!!x.multiple,x.multiple?[]:"",!1))}p[Lo]=x}catch($e){jt(n,n.return,$e)}}break;case 6:if(fi(r,n),Ti(n),u&4){if(n.stateNode===null)throw Error(t(162));p=n.stateNode,x=n.memoizedProps;try{p.nodeValue=x}catch($e){jt(n,n.return,$e)}}break;case 3:if(fi(r,n),Ti(n),u&4&&l!==null&&l.memoizedState.isDehydrated)try{yo(r.containerInfo)}catch($e){jt(n,n.return,$e)}break;case 4:fi(r,n),Ti(n);break;case 13:fi(r,n),Ti(n),p=n.child,p.flags&8192&&(x=p.memoizedState!==null,p.stateNode.isHidden=x,!x||p.alternate!==null&&p.alternate.memoizedState!==null||(zu=Te())),u&4&&rm(n);break;case 22:if(ye=l!==null&&l.memoizedState!==null,n.mode&1?(vn=(te=vn)||ye,fi(r,n),vn=te):fi(r,n),Ti(n),u&8192){if(te=n.memoizedState!==null,(n.stateNode.isHidden=te)&&!ye&&(n.mode&1)!==0)for(Ge=n,ye=n.child;ye!==null;){for(Se=Ge=ye;Ge!==null;){switch(_e=Ge,ke=_e.child,_e.tag){case 0:case 11:case 14:case 15:Ho(4,_e,_e.return);break;case 1:Ns(_e,_e.return);var Xe=_e.stateNode;if(typeof Xe.componentWillUnmount=="function"){u=_e,l=_e.return;try{r=u,Xe.props=r.memoizedProps,Xe.state=r.memoizedState,Xe.componentWillUnmount()}catch($e){jt(u,l,$e)}}break;case 5:Ns(_e,_e.return);break;case 22:if(_e.memoizedState!==null){lm(Se);continue}}ke!==null?(ke.return=_e,Ge=ke):lm(Se)}ye=ye.sibling}e:for(ye=null,Se=n;;){if(Se.tag===5){if(ye===null){ye=Se;try{p=Se.stateNode,te?(x=p.style,typeof x.setProperty=="function"?x.setProperty("display","none","important"):x.display="none"):(D=Se.stateNode,H=Se.memoizedProps.style,T=H!=null&&H.hasOwnProperty("display")?H.display:null,D.style.display=ot("display",T))}catch($e){jt(n,n.return,$e)}}}else if(Se.tag===6){if(ye===null)try{Se.stateNode.nodeValue=te?"":Se.memoizedProps}catch($e){jt(n,n.return,$e)}}else if((Se.tag!==22&&Se.tag!==23||Se.memoizedState===null||Se===n)&&Se.child!==null){Se.child.return=Se,Se=Se.child;continue}if(Se===n)break e;for(;Se.sibling===null;){if(Se.return===null||Se.return===n)break e;ye===Se&&(ye=null),Se=Se.return}ye===Se&&(ye=null),Se.sibling.return=Se.return,Se=Se.sibling}}break;case 19:fi(r,n),Ti(n),u&4&&rm(n);break;case 21:break;default:fi(r,n),Ti(n)}}function Ti(n){var r=n.flags;if(r&2){try{e:{for(var l=n.return;l!==null;){if(tm(l)){var u=l;break e}l=l.return}throw Error(t(160))}switch(u.tag){case 5:var p=u.stateNode;u.flags&32&&(dt(p,""),u.flags&=-33);var x=nm(n);Uu(n,x,p);break;case 3:case 4:var T=u.stateNode.containerInfo,D=nm(n);Du(n,D,T);break;default:throw Error(t(161))}}catch(H){jt(n,n.return,H)}n.flags&=-3}r&4096&&(n.flags&=-4097)}function hx(n,r,l){Ge=n,om(n)}function om(n,r,l){for(var u=(n.mode&1)!==0;Ge!==null;){var p=Ge,x=p.child;if(p.tag===22&&u){var T=p.memoizedState!==null||ol;if(!T){var D=p.alternate,H=D!==null&&D.memoizedState!==null||vn;D=ol;var te=vn;if(ol=T,(vn=H)&&!te)for(Ge=p;Ge!==null;)T=Ge,H=T.child,T.tag===22&&T.memoizedState!==null?cm(p):H!==null?(H.return=T,Ge=H):cm(p);for(;x!==null;)Ge=x,om(x),x=x.sibling;Ge=p,ol=D,vn=te}am(n)}else(p.subtreeFlags&8772)!==0&&x!==null?(x.return=p,Ge=x):am(n)}}function am(n){for(;Ge!==null;){var r=Ge;if((r.flags&8772)!==0){var l=r.alternate;try{if((r.flags&8772)!==0)switch(r.tag){case 0:case 11:case 15:vn||al(5,r);break;case 1:var u=r.stateNode;if(r.flags&4&&!vn)if(l===null)u.componentDidMount();else{var p=r.elementType===r.type?l.memoizedProps:ui(r.type,l.memoizedProps);u.componentDidUpdate(p,l.memoizedState,u.__reactInternalSnapshotBeforeUpdate)}var x=r.updateQueue;x!==null&&lp(r,x,u);break;case 3:var T=r.updateQueue;if(T!==null){if(l=null,r.child!==null)switch(r.child.tag){case 5:l=r.child.stateNode;break;case 1:l=r.child.stateNode}lp(r,T,l)}break;case 5:var D=r.stateNode;if(l===null&&r.flags&4){l=D;var H=r.memoizedProps;switch(r.type){case"button":case"input":case"select":case"textarea":H.autoFocus&&l.focus();break;case"img":H.src&&(l.src=H.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(r.memoizedState===null){var te=r.alternate;if(te!==null){var ye=te.memoizedState;if(ye!==null){var Se=ye.dehydrated;Se!==null&&yo(Se)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(t(163))}vn||r.flags&512&&Iu(r)}catch(_e){jt(r,r.return,_e)}}if(r===n){Ge=null;break}if(l=r.sibling,l!==null){l.return=r.return,Ge=l;break}Ge=r.return}}function lm(n){for(;Ge!==null;){var r=Ge;if(r===n){Ge=null;break}var l=r.sibling;if(l!==null){l.return=r.return,Ge=l;break}Ge=r.return}}function cm(n){for(;Ge!==null;){var r=Ge;try{switch(r.tag){case 0:case 11:case 15:var l=r.return;try{al(4,r)}catch(H){jt(r,l,H)}break;case 1:var u=r.stateNode;if(typeof u.componentDidMount=="function"){var p=r.return;try{u.componentDidMount()}catch(H){jt(r,p,H)}}var x=r.return;try{Iu(r)}catch(H){jt(r,x,H)}break;case 5:var T=r.return;try{Iu(r)}catch(H){jt(r,T,H)}}}catch(H){jt(r,r.return,H)}if(r===n){Ge=null;break}var D=r.sibling;if(D!==null){D.return=r.return,Ge=D;break}Ge=r.return}}var fx=Math.ceil,ll=A.ReactCurrentDispatcher,Fu=A.ReactCurrentOwner,ni=A.ReactCurrentBatchConfig,wt=0,sn=null,Yt=null,un=0,Gn=0,Is=lr(0),Qt=0,Go=null,Gr=0,cl=0,Ou=0,Wo=null,Nn=null,zu=0,Ds=1/0,Vi=null,ul=!1,ku=null,pr=null,hl=!1,mr=null,fl=0,jo=0,Bu=null,dl=-1,pl=0;function wn(){return(wt&6)!==0?Te():dl!==-1?dl:dl=Te()}function gr(n){return(n.mode&1)===0?1:(wt&2)!==0&&un!==0?un&-un:$v.transition!==null?(pl===0&&(pl=Mn()),pl):(n=Pt,n!==0||(n=window.event,n=n===void 0?16:hd(n.type)),n)}function di(n,r,l,u){if(50<jo)throw jo=0,Bu=null,Error(t(185));Rn(n,l,u),((wt&2)===0||n!==sn)&&(n===sn&&((wt&2)===0&&(cl|=l),Qt===4&&vr(n,un)),In(n,u),l===1&&wt===0&&(r.mode&1)===0&&(Ds=Te()+500,Ha&&ur()))}function In(n,r){var l=n.callbackNode;Kn(n,r);var u=Si(n,n===sn?un:0);if(u===0)l!==null&&re(l),n.callbackNode=null,n.callbackPriority=0;else if(r=u&-u,n.callbackPriority!==r){if(l!=null&&re(l),r===1)n.tag===0?qv(hm.bind(null,n)):Kd(hm.bind(null,n)),Wv(function(){(wt&6)===0&&ur()}),l=null;else{switch(id(u)){case 1:l=qe;break;case 4:l=lt;break;case 16:l=ut;break;case 536870912:l=Mt;break;default:l=ut}l=_m(l,um.bind(null,n))}n.callbackPriority=r,n.callbackNode=l}}function um(n,r){if(dl=-1,pl=0,(wt&6)!==0)throw Error(t(327));var l=n.callbackNode;if(Us()&&n.callbackNode!==l)return null;var u=Si(n,n===sn?un:0);if(u===0)return null;if((u&30)!==0||(u&n.expiredLanes)!==0||r)r=ml(n,u);else{r=u;var p=wt;wt|=2;var x=dm();(sn!==n||un!==r)&&(Vi=null,Ds=Te()+500,jr(n,r));do try{mx();break}catch(D){fm(n,D)}while(!0);ru(),ll.current=x,wt=p,Yt!==null?r=0:(sn=null,un=0,r=Qt)}if(r!==0){if(r===2&&(p=Ii(n),p!==0&&(u=p,r=Vu(n,p))),r===1)throw l=Go,jr(n,0),vr(n,u),In(n,Te()),l;if(r===6)vr(n,u);else{if(p=n.current.alternate,(u&30)===0&&!dx(p)&&(r=ml(n,u),r===2&&(x=Ii(n),x!==0&&(u=x,r=Vu(n,x))),r===1))throw l=Go,jr(n,0),vr(n,u),In(n,Te()),l;switch(n.finishedWork=p,n.finishedLanes=u,r){case 0:case 1:throw Error(t(345));case 2:Xr(n,Nn,Vi);break;case 3:if(vr(n,u),(u&130023424)===u&&(r=zu+500-Te(),10<r)){if(Si(n,0)!==0)break;if(p=n.suspendedLanes,(p&u)!==u){wn(),n.pingedLanes|=n.suspendedLanes&p;break}n.timeoutHandle=Yc(Xr.bind(null,n,Nn,Vi),r);break}Xr(n,Nn,Vi);break;case 4:if(vr(n,u),(u&4194240)===u)break;for(r=n.eventTimes,p=-1;0<u;){var T=31-pt(u);x=1<<T,T=r[T],T>p&&(p=T),u&=~x}if(u=p,u=Te()-u,u=(120>u?120:480>u?480:1080>u?1080:1920>u?1920:3e3>u?3e3:4320>u?4320:1960*fx(u/1960))-u,10<u){n.timeoutHandle=Yc(Xr.bind(null,n,Nn,Vi),u);break}Xr(n,Nn,Vi);break;case 5:Xr(n,Nn,Vi);break;default:throw Error(t(329))}}}return In(n,Te()),n.callbackNode===l?um.bind(null,n):null}function Vu(n,r){var l=Wo;return n.current.memoizedState.isDehydrated&&(jr(n,r).flags|=256),n=ml(n,r),n!==2&&(r=Nn,Nn=l,r!==null&&Hu(r)),n}function Hu(n){Nn===null?Nn=n:Nn.push.apply(Nn,n)}function dx(n){for(var r=n;;){if(r.flags&16384){var l=r.updateQueue;if(l!==null&&(l=l.stores,l!==null))for(var u=0;u<l.length;u++){var p=l[u],x=p.getSnapshot;p=p.value;try{if(!li(x(),p))return!1}catch{return!1}}}if(l=r.child,r.subtreeFlags&16384&&l!==null)l.return=r,r=l;else{if(r===n)break;for(;r.sibling===null;){if(r.return===null||r.return===n)return!0;r=r.return}r.sibling.return=r.return,r=r.sibling}}return!0}function vr(n,r){for(r&=~Ou,r&=~cl,n.suspendedLanes|=r,n.pingedLanes&=~r,n=n.expirationTimes;0<r;){var l=31-pt(r),u=1<<l;n[l]=-1,r&=~u}}function hm(n){if((wt&6)!==0)throw Error(t(327));Us();var r=Si(n,0);if((r&1)===0)return In(n,Te()),null;var l=ml(n,r);if(n.tag!==0&&l===2){var u=Ii(n);u!==0&&(r=u,l=Vu(n,u))}if(l===1)throw l=Go,jr(n,0),vr(n,r),In(n,Te()),l;if(l===6)throw Error(t(345));return n.finishedWork=n.current.alternate,n.finishedLanes=r,Xr(n,Nn,Vi),In(n,Te()),null}function Gu(n,r){var l=wt;wt|=1;try{return n(r)}finally{wt=l,wt===0&&(Ds=Te()+500,Ha&&ur())}}function Wr(n){mr!==null&&mr.tag===0&&(wt&6)===0&&Us();var r=wt;wt|=1;var l=ni.transition,u=Pt;try{if(ni.transition=null,Pt=1,n)return n()}finally{Pt=u,ni.transition=l,wt=r,(wt&6)===0&&ur()}}function Wu(){Gn=Is.current,Bt(Is)}function jr(n,r){n.finishedWork=null,n.finishedLanes=0;var l=n.timeoutHandle;if(l!==-1&&(n.timeoutHandle=-1,Gv(l)),Yt!==null)for(l=Yt.return;l!==null;){var u=l;switch(Qc(u),u.tag){case 1:u=u.type.childContextTypes,u!=null&&Ba();break;case 3:Ps(),Bt(bn),Bt(pn),fu();break;case 5:uu(u);break;case 4:Ps();break;case 13:Bt(Ht);break;case 19:Bt(Ht);break;case 10:su(u.type._context);break;case 22:case 23:Wu()}l=l.return}if(sn=n,Yt=n=xr(n.current,null),un=Gn=r,Qt=0,Go=null,Ou=cl=Gr=0,Nn=Wo=null,Br!==null){for(r=0;r<Br.length;r++)if(l=Br[r],u=l.interleaved,u!==null){l.interleaved=null;var p=u.next,x=l.pending;if(x!==null){var T=x.next;x.next=p,u.next=T}l.pending=u}Br=null}return n}function fm(n,r){do{var l=Yt;try{if(ru(),Ja.current=nl,Qa){for(var u=Gt.memoizedState;u!==null;){var p=u.queue;p!==null&&(p.pending=null),u=u.next}Qa=!1}if(Hr=0,rn=Jt=Gt=null,Oo=!1,zo=0,Fu.current=null,l===null||l.return===null){Qt=1,Go=r,Yt=null;break}e:{var x=n,T=l.return,D=l,H=r;if(r=un,D.flags|=32768,H!==null&&typeof H=="object"&&typeof H.then=="function"){var te=H,ye=D,Se=ye.tag;if((ye.mode&1)===0&&(Se===0||Se===11||Se===15)){var _e=ye.alternate;_e?(ye.updateQueue=_e.updateQueue,ye.memoizedState=_e.memoizedState,ye.lanes=_e.lanes):(ye.updateQueue=null,ye.memoizedState=null)}var ke=Op(T);if(ke!==null){ke.flags&=-257,zp(ke,T,D,x,r),ke.mode&1&&Fp(x,te,r),r=ke,H=te;var Xe=r.updateQueue;if(Xe===null){var $e=new Set;$e.add(H),r.updateQueue=$e}else Xe.add(H);break e}else{if((r&1)===0){Fp(x,te,r),ju();break e}H=Error(t(426))}}else if(Vt&&D.mode&1){var Xt=Op(T);if(Xt!==null){(Xt.flags&65536)===0&&(Xt.flags|=256),zp(Xt,T,D,x,r),nu(Ls(H,D));break e}}x=H=Ls(H,D),Qt!==4&&(Qt=2),Wo===null?Wo=[x]:Wo.push(x),x=T;do{switch(x.tag){case 3:x.flags|=65536,r&=-r,x.lanes|=r;var $=Dp(x,H,r);ap(x,$);break e;case 1:D=H;var j=x.type,J=x.stateNode;if((x.flags&128)===0&&(typeof j.getDerivedStateFromError=="function"||J!==null&&typeof J.componentDidCatch=="function"&&(pr===null||!pr.has(J)))){x.flags|=65536,r&=-r,x.lanes|=r;var Ce=Up(x,D,r);ap(x,Ce);break e}}x=x.return}while(x!==null)}mm(l)}catch(et){r=et,Yt===l&&l!==null&&(Yt=l=l.return);continue}break}while(!0)}function dm(){var n=ll.current;return ll.current=nl,n===null?nl:n}function ju(){(Qt===0||Qt===3||Qt===2)&&(Qt=4),sn===null||(Gr&268435455)===0&&(cl&268435455)===0||vr(sn,un)}function ml(n,r){var l=wt;wt|=2;var u=dm();(sn!==n||un!==r)&&(Vi=null,jr(n,r));do try{px();break}catch(p){fm(n,p)}while(!0);if(ru(),wt=l,ll.current=u,Yt!==null)throw Error(t(261));return sn=null,un=0,Qt}function px(){for(;Yt!==null;)pm(Yt)}function mx(){for(;Yt!==null&&!q();)pm(Yt)}function pm(n){var r=xm(n.alternate,n,Gn);n.memoizedProps=n.pendingProps,r===null?mm(n):Yt=r,Fu.current=null}function mm(n){var r=n;do{var l=r.alternate;if(n=r.return,(r.flags&32768)===0){if(l=ax(l,r,Gn),l!==null){Yt=l;return}}else{if(l=lx(l,r),l!==null){l.flags&=32767,Yt=l;return}if(n!==null)n.flags|=32768,n.subtreeFlags=0,n.deletions=null;else{Qt=6,Yt=null;return}}if(r=r.sibling,r!==null){Yt=r;return}Yt=r=n}while(r!==null);Qt===0&&(Qt=5)}function Xr(n,r,l){var u=Pt,p=ni.transition;try{ni.transition=null,Pt=1,gx(n,r,l,u)}finally{ni.transition=p,Pt=u}return null}function gx(n,r,l,u){do Us();while(mr!==null);if((wt&6)!==0)throw Error(t(327));l=n.finishedWork;var p=n.finishedLanes;if(l===null)return null;if(n.finishedWork=null,n.finishedLanes=0,l===n.current)throw Error(t(177));n.callbackNode=null,n.callbackPriority=0;var x=l.lanes|l.childLanes;if(Ea(n,x),n===sn&&(Yt=sn=null,un=0),(l.subtreeFlags&2064)===0&&(l.flags&2064)===0||hl||(hl=!0,_m(ut,function(){return Us(),null})),x=(l.flags&15990)!==0,(l.subtreeFlags&15990)!==0||x){x=ni.transition,ni.transition=null;var T=Pt;Pt=1;var D=wt;wt|=4,Fu.current=null,ux(n,l),sm(l,n),Fv(jc),Aa=!!Wc,jc=Wc=null,n.current=l,hx(l),Re(),wt=D,Pt=T,ni.transition=x}else n.current=l;if(hl&&(hl=!1,mr=n,fl=p),x=n.pendingLanes,x===0&&(pr=null),fn(l.stateNode),In(n,Te()),r!==null)for(u=n.onRecoverableError,l=0;l<r.length;l++)p=r[l],u(p.value,{componentStack:p.stack,digest:p.digest});if(ul)throw ul=!1,n=ku,ku=null,n;return(fl&1)!==0&&n.tag!==0&&Us(),x=n.pendingLanes,(x&1)!==0?n===Bu?jo++:(jo=0,Bu=n):jo=0,ur(),null}function Us(){if(mr!==null){var n=id(fl),r=ni.transition,l=Pt;try{if(ni.transition=null,Pt=16>n?16:n,mr===null)var u=!1;else{if(n=mr,mr=null,fl=0,(wt&6)!==0)throw Error(t(331));var p=wt;for(wt|=4,Ge=n.current;Ge!==null;){var x=Ge,T=x.child;if((Ge.flags&16)!==0){var D=x.deletions;if(D!==null){for(var H=0;H<D.length;H++){var te=D[H];for(Ge=te;Ge!==null;){var ye=Ge;switch(ye.tag){case 0:case 11:case 15:Ho(8,ye,x)}var Se=ye.child;if(Se!==null)Se.return=ye,Ge=Se;else for(;Ge!==null;){ye=Ge;var _e=ye.sibling,ke=ye.return;if(em(ye),ye===te){Ge=null;break}if(_e!==null){_e.return=ke,Ge=_e;break}Ge=ke}}}var Xe=x.alternate;if(Xe!==null){var $e=Xe.child;if($e!==null){Xe.child=null;do{var Xt=$e.sibling;$e.sibling=null,$e=Xt}while($e!==null)}}Ge=x}}if((x.subtreeFlags&2064)!==0&&T!==null)T.return=x,Ge=T;else e:for(;Ge!==null;){if(x=Ge,(x.flags&2048)!==0)switch(x.tag){case 0:case 11:case 15:Ho(9,x,x.return)}var $=x.sibling;if($!==null){$.return=x.return,Ge=$;break e}Ge=x.return}}var j=n.current;for(Ge=j;Ge!==null;){T=Ge;var J=T.child;if((T.subtreeFlags&2064)!==0&&J!==null)J.return=T,Ge=J;else e:for(T=j;Ge!==null;){if(D=Ge,(D.flags&2048)!==0)try{switch(D.tag){case 0:case 11:case 15:al(9,D)}}catch(et){jt(D,D.return,et)}if(D===T){Ge=null;break e}var Ce=D.sibling;if(Ce!==null){Ce.return=D.return,Ge=Ce;break e}Ge=D.return}}if(wt=p,ur(),St&&typeof St.onPostCommitFiberRoot=="function")try{St.onPostCommitFiberRoot(Rt,n)}catch{}u=!0}return u}finally{Pt=l,ni.transition=r}}return!1}function gm(n,r,l){r=Ls(l,r),r=Dp(n,r,1),n=fr(n,r,1),r=wn(),n!==null&&(Rn(n,1,r),In(n,r))}function jt(n,r,l){if(n.tag===3)gm(n,n,l);else for(;r!==null;){if(r.tag===3){gm(r,n,l);break}else if(r.tag===1){var u=r.stateNode;if(typeof r.type.getDerivedStateFromError=="function"||typeof u.componentDidCatch=="function"&&(pr===null||!pr.has(u))){n=Ls(l,n),n=Up(r,n,1),r=fr(r,n,1),n=wn(),r!==null&&(Rn(r,1,n),In(r,n));break}}r=r.return}}function vx(n,r,l){var u=n.pingCache;u!==null&&u.delete(r),r=wn(),n.pingedLanes|=n.suspendedLanes&l,sn===n&&(un&l)===l&&(Qt===4||Qt===3&&(un&130023424)===un&&500>Te()-zu?jr(n,0):Ou|=l),In(n,r)}function vm(n,r){r===0&&((n.mode&1)===0?r=1:(r=ai,ai<<=1,(ai&130023424)===0&&(ai=4194304)));var l=wn();n=zi(n,r),n!==null&&(Rn(n,r,l),In(n,l))}function xx(n){var r=n.memoizedState,l=0;r!==null&&(l=r.retryLane),vm(n,l)}function _x(n,r){var l=0;switch(n.tag){case 13:var u=n.stateNode,p=n.memoizedState;p!==null&&(l=p.retryLane);break;case 19:u=n.stateNode;break;default:throw Error(t(314))}u!==null&&u.delete(r),vm(n,l)}var xm;xm=function(n,r,l){if(n!==null)if(n.memoizedProps!==r.pendingProps||bn.current)Ln=!0;else{if((n.lanes&l)===0&&(r.flags&128)===0)return Ln=!1,ox(n,r,l);Ln=(n.flags&131072)!==0}else Ln=!1,Vt&&(r.flags&1048576)!==0&&Zd(r,Wa,r.index);switch(r.lanes=0,r.tag){case 2:var u=r.type;sl(n,r),n=r.pendingProps;var p=Es(r,pn.current);bs(r,l),p=mu(null,r,u,n,p,l);var x=gu();return r.flags|=1,typeof p=="object"&&p!==null&&typeof p.render=="function"&&p.$$typeof===void 0?(r.tag=1,r.memoizedState=null,r.updateQueue=null,Pn(u)?(x=!0,Va(r)):x=!1,r.memoizedState=p.state!==null&&p.state!==void 0?p.state:null,lu(r),p.updater=il,r.stateNode=p,p._reactInternals=r,Mu(r,u,n,l),r=Au(null,r,u,!0,x,l)):(r.tag=0,Vt&&x&&Jc(r),En(null,r,p,l),r=r.child),r;case 16:u=r.elementType;e:{switch(sl(n,r),n=r.pendingProps,p=u._init,u=p(u._payload),r.type=u,p=r.tag=Sx(u),n=ui(u,n),p){case 0:r=Tu(null,r,u,n,l);break e;case 1:r=Wp(null,r,u,n,l);break e;case 11:r=kp(null,r,u,n,l);break e;case 14:r=Bp(null,r,u,ui(u.type,n),l);break e}throw Error(t(306,u,""))}return r;case 0:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:ui(u,p),Tu(n,r,u,p,l);case 1:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:ui(u,p),Wp(n,r,u,p,l);case 3:e:{if(jp(r),n===null)throw Error(t(387));u=r.pendingProps,x=r.memoizedState,p=x.element,op(n,r),Ka(r,u,null,l);var T=r.memoizedState;if(u=T.element,x.isDehydrated)if(x={element:u,isDehydrated:!1,cache:T.cache,pendingSuspenseBoundaries:T.pendingSuspenseBoundaries,transitions:T.transitions},r.updateQueue.baseState=x,r.memoizedState=x,r.flags&256){p=Ls(Error(t(423)),r),r=Xp(n,r,u,l,p);break e}else if(u!==p){p=Ls(Error(t(424)),r),r=Xp(n,r,u,l,p);break e}else for(Hn=ar(r.stateNode.containerInfo.firstChild),Vn=r,Vt=!0,ci=null,l=rp(r,null,u,l),r.child=l;l;)l.flags=l.flags&-3|4096,l=l.sibling;else{if(As(),u===p){r=Bi(n,r,l);break e}En(n,r,u,l)}r=r.child}return r;case 5:return cp(r),n===null&&tu(r),u=r.type,p=r.pendingProps,x=n!==null?n.memoizedProps:null,T=p.children,Xc(u,p)?T=null:x!==null&&Xc(u,x)&&(r.flags|=32),Gp(n,r),En(n,r,T,l),r.child;case 6:return n===null&&tu(r),null;case 13:return Yp(n,r,l);case 4:return cu(r,r.stateNode.containerInfo),u=r.pendingProps,n===null?r.child=Cs(r,null,u,l):En(n,r,u,l),r.child;case 11:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:ui(u,p),kp(n,r,u,p,l);case 7:return En(n,r,r.pendingProps,l),r.child;case 8:return En(n,r,r.pendingProps.children,l),r.child;case 12:return En(n,r,r.pendingProps.children,l),r.child;case 10:e:{if(u=r.type._context,p=r.pendingProps,x=r.memoizedProps,T=p.value,Ot(Ya,u._currentValue),u._currentValue=T,x!==null)if(li(x.value,T)){if(x.children===p.children&&!bn.current){r=Bi(n,r,l);break e}}else for(x=r.child,x!==null&&(x.return=r);x!==null;){var D=x.dependencies;if(D!==null){T=x.child;for(var H=D.firstContext;H!==null;){if(H.context===u){if(x.tag===1){H=ki(-1,l&-l),H.tag=2;var te=x.updateQueue;if(te!==null){te=te.shared;var ye=te.pending;ye===null?H.next=H:(H.next=ye.next,ye.next=H),te.pending=H}}x.lanes|=l,H=x.alternate,H!==null&&(H.lanes|=l),ou(x.return,l,r),D.lanes|=l;break}H=H.next}}else if(x.tag===10)T=x.type===r.type?null:x.child;else if(x.tag===18){if(T=x.return,T===null)throw Error(t(341));T.lanes|=l,D=T.alternate,D!==null&&(D.lanes|=l),ou(T,l,r),T=x.sibling}else T=x.child;if(T!==null)T.return=x;else for(T=x;T!==null;){if(T===r){T=null;break}if(x=T.sibling,x!==null){x.return=T.return,T=x;break}T=T.return}x=T}En(n,r,p.children,l),r=r.child}return r;case 9:return p=r.type,u=r.pendingProps.children,bs(r,l),p=ei(p),u=u(p),r.flags|=1,En(n,r,u,l),r.child;case 14:return u=r.type,p=ui(u,r.pendingProps),p=ui(u.type,p),Bp(n,r,u,p,l);case 15:return Vp(n,r,r.type,r.pendingProps,l);case 17:return u=r.type,p=r.pendingProps,p=r.elementType===u?p:ui(u,p),sl(n,r),r.tag=1,Pn(u)?(n=!0,Va(r)):n=!1,bs(r,l),Np(r,u,p),Mu(r,u,p,l),Au(null,r,u,!0,n,l);case 19:return $p(n,r,l);case 22:return Hp(n,r,l)}throw Error(t(156,r.tag))};function _m(n,r){return ne(n,r)}function yx(n,r,l,u){this.tag=n,this.key=l,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=r,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=u,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ii(n,r,l,u){return new yx(n,r,l,u)}function Xu(n){return n=n.prototype,!(!n||!n.isReactComponent)}function Sx(n){if(typeof n=="function")return Xu(n)?1:0;if(n!=null){if(n=n.$$typeof,n===ee)return 11;if(n===he)return 14}return 2}function xr(n,r){var l=n.alternate;return l===null?(l=ii(n.tag,r,n.key,n.mode),l.elementType=n.elementType,l.type=n.type,l.stateNode=n.stateNode,l.alternate=n,n.alternate=l):(l.pendingProps=r,l.type=n.type,l.flags=0,l.subtreeFlags=0,l.deletions=null),l.flags=n.flags&14680064,l.childLanes=n.childLanes,l.lanes=n.lanes,l.child=n.child,l.memoizedProps=n.memoizedProps,l.memoizedState=n.memoizedState,l.updateQueue=n.updateQueue,r=n.dependencies,l.dependencies=r===null?null:{lanes:r.lanes,firstContext:r.firstContext},l.sibling=n.sibling,l.index=n.index,l.ref=n.ref,l}function gl(n,r,l,u,p,x){var T=2;if(u=n,typeof n=="function")Xu(n)&&(T=1);else if(typeof n=="string")T=5;else e:switch(n){case z:return Yr(l.children,p,x,r);case V:T=8,p|=8;break;case L:return n=ii(12,l,r,p|2),n.elementType=L,n.lanes=x,n;case K:return n=ii(13,l,r,p),n.elementType=K,n.lanes=x,n;case oe:return n=ii(19,l,r,p),n.elementType=oe,n.lanes=x,n;case ue:return vl(l,p,x,r);default:if(typeof n=="object"&&n!==null)switch(n.$$typeof){case R:T=10;break e;case B:T=9;break e;case ee:T=11;break e;case he:T=14;break e;case se:T=16,u=null;break e}throw Error(t(130,n==null?n:typeof n,""))}return r=ii(T,l,r,p),r.elementType=n,r.type=u,r.lanes=x,r}function Yr(n,r,l,u){return n=ii(7,n,u,r),n.lanes=l,n}function vl(n,r,l,u){return n=ii(22,n,u,r),n.elementType=ue,n.lanes=l,n.stateNode={isHidden:!1},n}function Yu(n,r,l){return n=ii(6,n,null,r),n.lanes=l,n}function qu(n,r,l){return r=ii(4,n.children!==null?n.children:[],n.key,r),r.lanes=l,r.stateNode={containerInfo:n.containerInfo,pendingChildren:null,implementation:n.implementation},r}function Mx(n,r,l,u,p){this.tag=r,this.containerInfo=n,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Zn(0),this.expirationTimes=Zn(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Zn(0),this.identifierPrefix=u,this.onRecoverableError=p,this.mutableSourceEagerHydrationData=null}function $u(n,r,l,u,p,x,T,D,H){return n=new Mx(n,r,l,D,H),r===1?(r=1,x===!0&&(r|=8)):r=0,x=ii(3,null,null,r),n.current=x,x.stateNode=n,x.memoizedState={element:u,isDehydrated:l,cache:null,transitions:null,pendingSuspenseBoundaries:null},lu(x),n}function Ex(n,r,l){var u=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:U,key:u==null?null:""+u,children:n,containerInfo:r,implementation:l}}function ym(n){if(!n)return cr;n=n._reactInternals;e:{if(yi(n)!==n||n.tag!==1)throw Error(t(170));var r=n;do{switch(r.tag){case 3:r=r.stateNode.context;break e;case 1:if(Pn(r.type)){r=r.stateNode.__reactInternalMemoizedMergedChildContext;break e}}r=r.return}while(r!==null);throw Error(t(171))}if(n.tag===1){var l=n.type;if(Pn(l))return qd(n,l,r)}return r}function Sm(n,r,l,u,p,x,T,D,H){return n=$u(l,u,!0,n,p,x,T,D,H),n.context=ym(null),l=n.current,u=wn(),p=gr(l),x=ki(u,p),x.callback=r??null,fr(l,x,p),n.current.lanes=p,Rn(n,p,u),In(n,u),n}function xl(n,r,l,u){var p=r.current,x=wn(),T=gr(p);return l=ym(l),r.context===null?r.context=l:r.pendingContext=l,r=ki(x,T),r.payload={element:n},u=u===void 0?null:u,u!==null&&(r.callback=u),n=fr(p,r,T),n!==null&&(di(n,p,T,x),$a(n,p,T)),T}function _l(n){if(n=n.current,!n.child)return null;switch(n.child.tag){case 5:return n.child.stateNode;default:return n.child.stateNode}}function Mm(n,r){if(n=n.memoizedState,n!==null&&n.dehydrated!==null){var l=n.retryLane;n.retryLane=l!==0&&l<r?l:r}}function Ku(n,r){Mm(n,r),(n=n.alternate)&&Mm(n,r)}function wx(){return null}var Em=typeof reportError=="function"?reportError:function(n){console.error(n)};function Zu(n){this._internalRoot=n}yl.prototype.render=Zu.prototype.render=function(n){var r=this._internalRoot;if(r===null)throw Error(t(409));xl(n,r,null,null)},yl.prototype.unmount=Zu.prototype.unmount=function(){var n=this._internalRoot;if(n!==null){this._internalRoot=null;var r=n.containerInfo;Wr(function(){xl(null,n,null,null)}),r[Di]=null}};function yl(n){this._internalRoot=n}yl.prototype.unstable_scheduleHydration=function(n){if(n){var r=od();n={blockedOn:null,target:n,priority:r};for(var l=0;l<rr.length&&r!==0&&r<rr[l].priority;l++);rr.splice(l,0,n),l===0&&cd(n)}};function Ju(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11)}function Sl(n){return!(!n||n.nodeType!==1&&n.nodeType!==9&&n.nodeType!==11&&(n.nodeType!==8||n.nodeValue!==" react-mount-point-unstable "))}function wm(){}function Tx(n,r,l,u,p){if(p){if(typeof u=="function"){var x=u;u=function(){var te=_l(T);x.call(te)}}var T=Sm(r,u,n,0,null,!1,!1,"",wm);return n._reactRootContainer=T,n[Di]=T.current,bo(n.nodeType===8?n.parentNode:n),Wr(),T}for(;p=n.lastChild;)n.removeChild(p);if(typeof u=="function"){var D=u;u=function(){var te=_l(H);D.call(te)}}var H=$u(n,0,!1,null,null,!1,!1,"",wm);return n._reactRootContainer=H,n[Di]=H.current,bo(n.nodeType===8?n.parentNode:n),Wr(function(){xl(r,H,l,u)}),H}function Ml(n,r,l,u,p){var x=l._reactRootContainer;if(x){var T=x;if(typeof p=="function"){var D=p;p=function(){var H=_l(T);D.call(H)}}xl(r,T,n,p)}else T=Tx(l,r,n,p,u);return _l(T)}rd=function(n){switch(n.tag){case 3:var r=n.stateNode;if(r.current.memoizedState.isDehydrated){var l=Zt(r.pendingLanes);l!==0&&(Mc(r,l|1),In(r,Te()),(wt&6)===0&&(Ds=Te()+500,ur()))}break;case 13:Wr(function(){var u=zi(n,1);if(u!==null){var p=wn();di(u,n,1,p)}}),Ku(n,1)}},Ec=function(n){if(n.tag===13){var r=zi(n,134217728);if(r!==null){var l=wn();di(r,n,134217728,l)}Ku(n,134217728)}},sd=function(n){if(n.tag===13){var r=gr(n),l=zi(n,r);if(l!==null){var u=wn();di(l,n,r,u)}Ku(n,r)}},od=function(){return Pt},ad=function(n,r){var l=Pt;try{return Pt=n,r()}finally{Pt=l}},Ne=function(n,r,l){switch(r){case"input":if(Ve(n,l),r=l.name,l.type==="radio"&&r!=null){for(l=n;l.parentNode;)l=l.parentNode;for(l=l.querySelectorAll("input[name="+JSON.stringify(""+r)+'][type="radio"]'),r=0;r<l.length;r++){var u=l[r];if(u!==n&&u.form===n.form){var p=ka(u);if(!p)throw Error(t(90));ve(u),Ve(u,p)}}}break;case"textarea":fe(n,l);break;case"select":r=l.value,r!=null&&I(n,!!l.multiple,r,!1)}},zt=Gu,Kt=Wr;var Ax={usingClientEntryPoint:!1,Events:[No,Ss,ka,Ue,ft,Gu]},Xo={findFiberByHostInstance:Fr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Cx={bundleType:Xo.bundleType,version:Xo.version,rendererPackageName:Xo.rendererPackageName,rendererConfig:Xo.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:A.ReactCurrentDispatcher,findHostInstanceByFiber:function(n){return n=P(n),n===null?null:n.stateNode},findFiberByHostInstance:Xo.findFiberByHostInstance||wx,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var El=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!El.isDisabled&&El.supportsFiber)try{Rt=El.inject(Cx),St=El}catch{}}return Dn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ax,Dn.createPortal=function(n,r){var l=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Ju(r))throw Error(t(200));return Ex(n,r,null,l)},Dn.createRoot=function(n,r){if(!Ju(n))throw Error(t(299));var l=!1,u="",p=Em;return r!=null&&(r.unstable_strictMode===!0&&(l=!0),r.identifierPrefix!==void 0&&(u=r.identifierPrefix),r.onRecoverableError!==void 0&&(p=r.onRecoverableError)),r=$u(n,1,!1,null,null,l,!1,u,p),n[Di]=r.current,bo(n.nodeType===8?n.parentNode:n),new Zu(r)},Dn.findDOMNode=function(n){if(n==null)return null;if(n.nodeType===1)return n;var r=n._reactInternals;if(r===void 0)throw typeof n.render=="function"?Error(t(188)):(n=Object.keys(n).join(","),Error(t(268,n)));return n=P(r),n=n===null?null:n.stateNode,n},Dn.flushSync=function(n){return Wr(n)},Dn.hydrate=function(n,r,l){if(!Sl(r))throw Error(t(200));return Ml(null,n,r,!0,l)},Dn.hydrateRoot=function(n,r,l){if(!Ju(n))throw Error(t(405));var u=l!=null&&l.hydratedSources||null,p=!1,x="",T=Em;if(l!=null&&(l.unstable_strictMode===!0&&(p=!0),l.identifierPrefix!==void 0&&(x=l.identifierPrefix),l.onRecoverableError!==void 0&&(T=l.onRecoverableError)),r=Sm(r,null,n,1,l??null,p,!1,x,T),n[Di]=r.current,bo(n),u)for(n=0;n<u.length;n++)l=u[n],p=l._getVersion,p=p(l._source),r.mutableSourceEagerHydrationData==null?r.mutableSourceEagerHydrationData=[l,p]:r.mutableSourceEagerHydrationData.push(l,p);return new yl(r)},Dn.render=function(n,r,l){if(!Sl(r))throw Error(t(200));return Ml(null,n,r,!1,l)},Dn.unmountComponentAtNode=function(n){if(!Sl(n))throw Error(t(40));return n._reactRootContainer?(Wr(function(){Ml(null,null,n,!1,function(){n._reactRootContainer=null,n[Di]=null})}),!0):!1},Dn.unstable_batchedUpdates=Gu,Dn.unstable_renderSubtreeIntoContainer=function(n,r,l,u){if(!Sl(l))throw Error(t(200));if(n==null||n._reactInternals===void 0)throw Error(t(38));return Ml(n,r,l,!1,u)},Dn.version="18.3.1-next-f1338f8080-20240426",Dn}var Nm;function Fx(){if(Nm)return th.exports;Nm=1;function s(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(s)}catch(e){console.error(e)}}return s(),th.exports=Ux(),th.exports}var Im;function Ox(){if(Im)return wl;Im=1;var s=Fx();return wl.createRoot=s.createRoot,wl.hydrateRoot=s.hydrateRoot,wl}var zx=Ox();const kx=ig(zx);/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zf="170",Bx=0,Dm=1,Vx=2,rg=1,sg=2,Yi=3,br=0,kn=1,$i=2,Cr=0,eo=1,Hh=2,Um=3,Fm=4,Hx=5,is=100,Gx=101,Wx=102,jx=103,Xx=104,Yx=200,qx=201,$x=202,Kx=203,Gh=204,Wh=205,Zx=206,Jx=207,Qx=208,e_=209,t_=210,n_=211,i_=212,r_=213,s_=214,jh=0,Xh=1,Yh=2,io=3,qh=4,$h=5,Kh=6,Zh=7,og=0,o_=1,a_=2,Rr=0,l_=1,c_=2,u_=3,ag=4,h_=5,f_=6,d_=7,lg=300,ro=301,so=302,Jh=303,Qh=304,uc=306,ef=1e3,ss=1001,tf=1002,$n=1003,p_=1004,Tl=1005,Ri=1006,rh=1007,os=1008,Ji=1009,cg=1010,ug=1011,fa=1012,kf=1013,ls=1014,bi=1015,xa=1016,Bf=1017,Vf=1018,oo=1020,hg=35902,fg=1021,dg=1022,xi=1023,pg=1024,mg=1025,to=1026,ao=1027,Hf=1028,Gf=1029,gg=1030,Wf=1031,jf=1033,Jl=33776,Ql=33777,ec=33778,tc=33779,nf=35840,rf=35841,sf=35842,of=35843,af=36196,lf=37492,cf=37496,uf=37808,hf=37809,ff=37810,df=37811,pf=37812,mf=37813,gf=37814,vf=37815,xf=37816,_f=37817,yf=37818,Sf=37819,Mf=37820,Ef=37821,nc=36492,wf=36494,Tf=36495,vg=36283,Af=36284,Cf=36285,Rf=36286,m_=3200,g_=3201,xg=0,v_=1,Ar="",Yn="srgb",co="srgb-linear",hc="linear",It="srgb",Fs=7680,Om=519,x_=512,__=513,y_=514,_g=515,S_=516,M_=517,E_=518,w_=519,zm=35044,km="300 es",Ki=2e3,sc=2001;class uo{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const o=this._listeners[e];if(o!==void 0){const a=o.indexOf(t);a!==-1&&o.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const o=i.slice(0);for(let a=0,c=o.length;a<c;a++)o[a].call(this,e);e.target=null}}}const xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],sh=Math.PI/180,bf=180/Math.PI;function ho(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(xn[s&255]+xn[s>>8&255]+xn[s>>16&255]+xn[s>>24&255]+"-"+xn[e&255]+xn[e>>8&255]+"-"+xn[e>>16&15|64]+xn[e>>24&255]+"-"+xn[t&63|128]+xn[t>>8&255]+"-"+xn[t>>16&255]+xn[t>>24&255]+xn[i&255]+xn[i>>8&255]+xn[i>>16&255]+xn[i>>24&255]).toLowerCase()}function yn(s,e,t){return Math.max(e,Math.min(t,s))}function T_(s,e){return(s%e+e)%e}function oh(s,e,t){return(1-t)*s+t*e}function qo(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Un(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}class Ie{constructor(e=0,t=0){Ie.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,o=e.elements;return this.x=o[0]*t+o[3]*i+o[6],this.y=o[1]*t+o[4]*i+o[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),o=Math.sin(t),a=this.x-e.x,c=this.y-e.y;return this.x=a*i-c*o+e.x,this.y=a*o+c*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class mt{constructor(e,t,i,o,a,c,h,f,d){mt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,o,a,c,h,f,d)}set(e,t,i,o,a,c,h,f,d){const m=this.elements;return m[0]=e,m[1]=o,m[2]=h,m[3]=t,m[4]=a,m[5]=f,m[6]=i,m[7]=c,m[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,o=t.elements,a=this.elements,c=i[0],h=i[3],f=i[6],d=i[1],m=i[4],g=i[7],v=i[2],_=i[5],M=i[8],w=o[0],S=o[3],y=o[6],N=o[1],b=o[4],A=o[7],W=o[2],U=o[5],z=o[8];return a[0]=c*w+h*N+f*W,a[3]=c*S+h*b+f*U,a[6]=c*y+h*A+f*z,a[1]=d*w+m*N+g*W,a[4]=d*S+m*b+g*U,a[7]=d*y+m*A+g*z,a[2]=v*w+_*N+M*W,a[5]=v*S+_*b+M*U,a[8]=v*y+_*A+M*z,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],o=e[2],a=e[3],c=e[4],h=e[5],f=e[6],d=e[7],m=e[8];return t*c*m-t*h*d-i*a*m+i*h*f+o*a*d-o*c*f}invert(){const e=this.elements,t=e[0],i=e[1],o=e[2],a=e[3],c=e[4],h=e[5],f=e[6],d=e[7],m=e[8],g=m*c-h*d,v=h*f-m*a,_=d*a-c*f,M=t*g+i*v+o*_;if(M===0)return this.set(0,0,0,0,0,0,0,0,0);const w=1/M;return e[0]=g*w,e[1]=(o*d-m*i)*w,e[2]=(h*i-o*c)*w,e[3]=v*w,e[4]=(m*t-o*f)*w,e[5]=(o*a-h*t)*w,e[6]=_*w,e[7]=(i*f-d*t)*w,e[8]=(c*t-i*a)*w,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,o,a,c,h){const f=Math.cos(a),d=Math.sin(a);return this.set(i*f,i*d,-i*(f*c+d*h)+c+e,-o*d,o*f,-o*(-d*c+f*h)+h+t,0,0,1),this}scale(e,t){return this.premultiply(ah.makeScale(e,t)),this}rotate(e){return this.premultiply(ah.makeRotation(-e)),this}translate(e,t){return this.premultiply(ah.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let o=0;o<9;o++)if(t[o]!==i[o])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ah=new mt;function yg(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function oc(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function A_(){const s=oc("canvas");return s.style.display="block",s}const Bm={};function ia(s){s in Bm||(Bm[s]=!0,console.warn(s))}function C_(s,e,t){return new Promise(function(i,o){function a(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:o();break;case s.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}function R_(s){const e=s.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function b_(s){const e=s.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Tt={enabled:!0,workingColorSpace:co,spaces:{},convert:function(s,e,t){return this.enabled===!1||e===t||!e||!t||(this.spaces[e].transfer===It&&(s.r=Zi(s.r),s.g=Zi(s.g),s.b=Zi(s.b)),this.spaces[e].primaries!==this.spaces[t].primaries&&(s.applyMatrix3(this.spaces[e].toXYZ),s.applyMatrix3(this.spaces[t].fromXYZ)),this.spaces[t].transfer===It&&(s.r=no(s.r),s.g=no(s.g),s.b=no(s.b))),s},fromWorkingColorSpace:function(s,e){return this.convert(s,this.workingColorSpace,e)},toWorkingColorSpace:function(s,e){return this.convert(s,e,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ar?hc:this.spaces[s].transfer},getLuminanceCoefficients:function(s,e=this.workingColorSpace){return s.fromArray(this.spaces[e].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,e,t){return s.copy(this.spaces[e].toXYZ).multiply(this.spaces[t].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}};function Zi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function no(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}const Vm=[.64,.33,.3,.6,.15,.06],Hm=[.2126,.7152,.0722],Gm=[.3127,.329],Wm=new mt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),jm=new mt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);Tt.define({[co]:{primaries:Vm,whitePoint:Gm,transfer:hc,toXYZ:Wm,fromXYZ:jm,luminanceCoefficients:Hm,workingColorSpaceConfig:{unpackColorSpace:Yn},outputColorSpaceConfig:{drawingBufferColorSpace:Yn}},[Yn]:{primaries:Vm,whitePoint:Gm,transfer:It,toXYZ:Wm,fromXYZ:jm,luminanceCoefficients:Hm,outputColorSpaceConfig:{drawingBufferColorSpace:Yn}}});let Os;class P_{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Os===void 0&&(Os=oc("canvas")),Os.width=e.width,Os.height=e.height;const i=Os.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),t=Os}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=oc("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const o=i.getImageData(0,0,e.width,e.height),a=o.data;for(let c=0;c<a.length;c++)a[c]=Zi(a[c]/255)*255;return i.putImageData(o,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(Zi(t[i]/255)*255):t[i]=Zi(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let L_=0;class Sg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:L_++}),this.uuid=ho(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},o=this.data;if(o!==null){let a;if(Array.isArray(o)){a=[];for(let c=0,h=o.length;c<h;c++)o[c].isDataTexture?a.push(lh(o[c].image)):a.push(lh(o[c]))}else a=lh(o);i.url=a}return t||(e.images[this.uuid]=i),i}}function lh(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?P_.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let N_=0;class An extends uo{constructor(e=An.DEFAULT_IMAGE,t=An.DEFAULT_MAPPING,i=ss,o=ss,a=Ri,c=os,h=xi,f=Ji,d=An.DEFAULT_ANISOTROPY,m=Ar){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:N_++}),this.uuid=ho(),this.name="",this.source=new Sg(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=o,this.magFilter=a,this.minFilter=c,this.anisotropy=d,this.format=h,this.internalFormat=null,this.type=f,this.offset=new Ie(0,0),this.repeat=new Ie(1,1),this.center=new Ie(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new mt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=m,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==lg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ef:e.x=e.x-Math.floor(e.x);break;case ss:e.x=e.x<0?0:1;break;case tf:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ef:e.y=e.y-Math.floor(e.y);break;case ss:e.y=e.y<0?0:1;break;case tf:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}An.DEFAULT_IMAGE=null;An.DEFAULT_MAPPING=lg;An.DEFAULT_ANISOTROPY=1;class Dt{constructor(e=0,t=0,i=0,o=1){Dt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=o}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,o){return this.x=e,this.y=t,this.z=i,this.w=o,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,o=this.z,a=this.w,c=e.elements;return this.x=c[0]*t+c[4]*i+c[8]*o+c[12]*a,this.y=c[1]*t+c[5]*i+c[9]*o+c[13]*a,this.z=c[2]*t+c[6]*i+c[10]*o+c[14]*a,this.w=c[3]*t+c[7]*i+c[11]*o+c[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,o,a;const f=e.elements,d=f[0],m=f[4],g=f[8],v=f[1],_=f[5],M=f[9],w=f[2],S=f[6],y=f[10];if(Math.abs(m-v)<.01&&Math.abs(g-w)<.01&&Math.abs(M-S)<.01){if(Math.abs(m+v)<.1&&Math.abs(g+w)<.1&&Math.abs(M+S)<.1&&Math.abs(d+_+y-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const b=(d+1)/2,A=(_+1)/2,W=(y+1)/2,U=(m+v)/4,z=(g+w)/4,V=(M+S)/4;return b>A&&b>W?b<.01?(i=0,o=.707106781,a=.707106781):(i=Math.sqrt(b),o=U/i,a=z/i):A>W?A<.01?(i=.707106781,o=0,a=.707106781):(o=Math.sqrt(A),i=U/o,a=V/o):W<.01?(i=.707106781,o=.707106781,a=0):(a=Math.sqrt(W),i=z/a,o=V/a),this.set(i,o,a,t),this}let N=Math.sqrt((S-M)*(S-M)+(g-w)*(g-w)+(v-m)*(v-m));return Math.abs(N)<.001&&(N=1),this.x=(S-M)/N,this.y=(g-w)/N,this.z=(v-m)/N,this.w=Math.acos((d+_+y-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class I_ extends uo{constructor(e=1,t=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new Dt(0,0,e,t),this.scissorTest=!1,this.viewport=new Dt(0,0,e,t);const o={width:e,height:t,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ri,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const a=new An(o,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);a.flipY=!1,a.generateMipmaps=i.generateMipmaps,a.internalFormat=i.internalFormat,this.textures=[];const c=i.count;for(let h=0;h<c;h++)this.textures[h]=a.clone(),this.textures[h].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let o=0,a=this.textures.length;o<a;o++)this.textures[o].image.width=e,this.textures[o].image.height=t,this.textures[o].image.depth=i;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,o=e.textures.length;i<o;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Sg(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class cs extends I_{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Mg extends An{constructor(e=null,t=1,i=1,o=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:o},this.magFilter=$n,this.minFilter=$n,this.wrapR=ss,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class D_ extends An{constructor(e=null,t=1,i=1,o=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:o},this.magFilter=$n,this.minFilter=$n,this.wrapR=ss,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class fo{constructor(e=0,t=0,i=0,o=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=o}static slerpFlat(e,t,i,o,a,c,h){let f=i[o+0],d=i[o+1],m=i[o+2],g=i[o+3];const v=a[c+0],_=a[c+1],M=a[c+2],w=a[c+3];if(h===0){e[t+0]=f,e[t+1]=d,e[t+2]=m,e[t+3]=g;return}if(h===1){e[t+0]=v,e[t+1]=_,e[t+2]=M,e[t+3]=w;return}if(g!==w||f!==v||d!==_||m!==M){let S=1-h;const y=f*v+d*_+m*M+g*w,N=y>=0?1:-1,b=1-y*y;if(b>Number.EPSILON){const W=Math.sqrt(b),U=Math.atan2(W,y*N);S=Math.sin(S*U)/W,h=Math.sin(h*U)/W}const A=h*N;if(f=f*S+v*A,d=d*S+_*A,m=m*S+M*A,g=g*S+w*A,S===1-h){const W=1/Math.sqrt(f*f+d*d+m*m+g*g);f*=W,d*=W,m*=W,g*=W}}e[t]=f,e[t+1]=d,e[t+2]=m,e[t+3]=g}static multiplyQuaternionsFlat(e,t,i,o,a,c){const h=i[o],f=i[o+1],d=i[o+2],m=i[o+3],g=a[c],v=a[c+1],_=a[c+2],M=a[c+3];return e[t]=h*M+m*g+f*_-d*v,e[t+1]=f*M+m*v+d*g-h*_,e[t+2]=d*M+m*_+h*v-f*g,e[t+3]=m*M-h*g-f*v-d*_,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,o){return this._x=e,this._y=t,this._z=i,this._w=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,o=e._y,a=e._z,c=e._order,h=Math.cos,f=Math.sin,d=h(i/2),m=h(o/2),g=h(a/2),v=f(i/2),_=f(o/2),M=f(a/2);switch(c){case"XYZ":this._x=v*m*g+d*_*M,this._y=d*_*g-v*m*M,this._z=d*m*M+v*_*g,this._w=d*m*g-v*_*M;break;case"YXZ":this._x=v*m*g+d*_*M,this._y=d*_*g-v*m*M,this._z=d*m*M-v*_*g,this._w=d*m*g+v*_*M;break;case"ZXY":this._x=v*m*g-d*_*M,this._y=d*_*g+v*m*M,this._z=d*m*M+v*_*g,this._w=d*m*g-v*_*M;break;case"ZYX":this._x=v*m*g-d*_*M,this._y=d*_*g+v*m*M,this._z=d*m*M-v*_*g,this._w=d*m*g+v*_*M;break;case"YZX":this._x=v*m*g+d*_*M,this._y=d*_*g+v*m*M,this._z=d*m*M-v*_*g,this._w=d*m*g-v*_*M;break;case"XZY":this._x=v*m*g-d*_*M,this._y=d*_*g-v*m*M,this._z=d*m*M+v*_*g,this._w=d*m*g+v*_*M;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+c)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,o=Math.sin(i);return this._x=e.x*o,this._y=e.y*o,this._z=e.z*o,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],o=t[4],a=t[8],c=t[1],h=t[5],f=t[9],d=t[2],m=t[6],g=t[10],v=i+h+g;if(v>0){const _=.5/Math.sqrt(v+1);this._w=.25/_,this._x=(m-f)*_,this._y=(a-d)*_,this._z=(c-o)*_}else if(i>h&&i>g){const _=2*Math.sqrt(1+i-h-g);this._w=(m-f)/_,this._x=.25*_,this._y=(o+c)/_,this._z=(a+d)/_}else if(h>g){const _=2*Math.sqrt(1+h-i-g);this._w=(a-d)/_,this._x=(o+c)/_,this._y=.25*_,this._z=(f+m)/_}else{const _=2*Math.sqrt(1+g-i-h);this._w=(c-o)/_,this._x=(a+d)/_,this._y=(f+m)/_,this._z=.25*_}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yn(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const o=Math.min(1,t/i);return this.slerp(e,o),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,o=e._y,a=e._z,c=e._w,h=t._x,f=t._y,d=t._z,m=t._w;return this._x=i*m+c*h+o*d-a*f,this._y=o*m+c*f+a*h-i*d,this._z=a*m+c*d+i*f-o*h,this._w=c*m-i*h-o*f-a*d,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,o=this._y,a=this._z,c=this._w;let h=c*e._w+i*e._x+o*e._y+a*e._z;if(h<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,h=-h):this.copy(e),h>=1)return this._w=c,this._x=i,this._y=o,this._z=a,this;const f=1-h*h;if(f<=Number.EPSILON){const _=1-t;return this._w=_*c+t*this._w,this._x=_*i+t*this._x,this._y=_*o+t*this._y,this._z=_*a+t*this._z,this.normalize(),this}const d=Math.sqrt(f),m=Math.atan2(d,h),g=Math.sin((1-t)*m)/d,v=Math.sin(t*m)/d;return this._w=c*g+this._w*v,this._x=i*g+this._x*v,this._y=o*g+this._y*v,this._z=a*g+this._z*v,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),o=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(o*Math.sin(e),o*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(e=0,t=0,i=0){F.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Xm.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Xm.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,o=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*o,this.y=a[1]*t+a[4]*i+a[7]*o,this.z=a[2]*t+a[5]*i+a[8]*o,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,o=this.z,a=e.elements,c=1/(a[3]*t+a[7]*i+a[11]*o+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*o+a[12])*c,this.y=(a[1]*t+a[5]*i+a[9]*o+a[13])*c,this.z=(a[2]*t+a[6]*i+a[10]*o+a[14])*c,this}applyQuaternion(e){const t=this.x,i=this.y,o=this.z,a=e.x,c=e.y,h=e.z,f=e.w,d=2*(c*o-h*i),m=2*(h*t-a*o),g=2*(a*i-c*t);return this.x=t+f*d+c*g-h*m,this.y=i+f*m+h*d-a*g,this.z=o+f*g+a*m-c*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,o=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*o,this.y=a[1]*t+a[5]*i+a[9]*o,this.z=a[2]*t+a[6]*i+a[10]*o,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(t,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,o=e.y,a=e.z,c=t.x,h=t.y,f=t.z;return this.x=o*f-a*h,this.y=a*c-i*f,this.z=i*h-o*c,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ch.copy(this).projectOnVector(e),this.sub(ch)}reflect(e){return this.sub(ch.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(yn(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,o=this.z-e.z;return t*t+i*i+o*o}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const o=Math.sin(t)*e;return this.x=o*Math.sin(i),this.y=Math.cos(t)*e,this.z=o*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),o=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=o,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ch=new F,Xm=new fo;class hs{constructor(e=new F(1/0,1/0,1/0),t=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(pi.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(pi.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=pi.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let c=0,h=a.count;c<h;c++)e.isMesh===!0?e.getVertexPosition(c,pi):pi.fromBufferAttribute(a,c),pi.applyMatrix4(e.matrixWorld),this.expandByPoint(pi);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Al.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Al.copy(i.boundingBox)),Al.applyMatrix4(e.matrixWorld),this.union(Al)}const o=e.children;for(let a=0,c=o.length;a<c;a++)this.expandByObject(o[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,pi),pi.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter($o),Cl.subVectors(this.max,$o),zs.subVectors(e.a,$o),ks.subVectors(e.b,$o),Bs.subVectors(e.c,$o),yr.subVectors(ks,zs),Sr.subVectors(Bs,ks),qr.subVectors(zs,Bs);let t=[0,-yr.z,yr.y,0,-Sr.z,Sr.y,0,-qr.z,qr.y,yr.z,0,-yr.x,Sr.z,0,-Sr.x,qr.z,0,-qr.x,-yr.y,yr.x,0,-Sr.y,Sr.x,0,-qr.y,qr.x,0];return!uh(t,zs,ks,Bs,Cl)||(t=[1,0,0,0,1,0,0,0,1],!uh(t,zs,ks,Bs,Cl))?!1:(Rl.crossVectors(yr,Sr),t=[Rl.x,Rl.y,Rl.z],uh(t,zs,ks,Bs,Cl))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,pi).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(pi).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const Hi=[new F,new F,new F,new F,new F,new F,new F,new F],pi=new F,Al=new hs,zs=new F,ks=new F,Bs=new F,yr=new F,Sr=new F,qr=new F,$o=new F,Cl=new F,Rl=new F,$r=new F;function uh(s,e,t,i,o){for(let a=0,c=s.length-3;a<=c;a+=3){$r.fromArray(s,a);const h=o.x*Math.abs($r.x)+o.y*Math.abs($r.y)+o.z*Math.abs($r.z),f=e.dot($r),d=t.dot($r),m=i.dot($r);if(Math.max(-Math.max(f,d,m),Math.min(f,d,m))>h)return!1}return!0}const U_=new hs,Ko=new F,hh=new F;class po{constructor(e=new F,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):U_.setFromPoints(e).getCenter(i);let o=0;for(let a=0,c=e.length;a<c;a++)o=Math.max(o,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(o),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ko.subVectors(e,this.center);const t=Ko.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),o=(i-this.radius)*.5;this.center.addScaledVector(Ko,o/i),this.radius+=o}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(hh.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ko.copy(e.center).add(hh)),this.expandByPoint(Ko.copy(e.center).sub(hh))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Gi=new F,fh=new F,bl=new F,Mr=new F,dh=new F,Pl=new F,ph=new F;class Eg{constructor(e=new F,t=new F(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Gi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Gi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Gi.copy(this.origin).addScaledVector(this.direction,t),Gi.distanceToSquared(e))}distanceSqToSegment(e,t,i,o){fh.copy(e).add(t).multiplyScalar(.5),bl.copy(t).sub(e).normalize(),Mr.copy(this.origin).sub(fh);const a=e.distanceTo(t)*.5,c=-this.direction.dot(bl),h=Mr.dot(this.direction),f=-Mr.dot(bl),d=Mr.lengthSq(),m=Math.abs(1-c*c);let g,v,_,M;if(m>0)if(g=c*f-h,v=c*h-f,M=a*m,g>=0)if(v>=-M)if(v<=M){const w=1/m;g*=w,v*=w,_=g*(g+c*v+2*h)+v*(c*g+v+2*f)+d}else v=a,g=Math.max(0,-(c*v+h)),_=-g*g+v*(v+2*f)+d;else v=-a,g=Math.max(0,-(c*v+h)),_=-g*g+v*(v+2*f)+d;else v<=-M?(g=Math.max(0,-(-c*a+h)),v=g>0?-a:Math.min(Math.max(-a,-f),a),_=-g*g+v*(v+2*f)+d):v<=M?(g=0,v=Math.min(Math.max(-a,-f),a),_=v*(v+2*f)+d):(g=Math.max(0,-(c*a+h)),v=g>0?a:Math.min(Math.max(-a,-f),a),_=-g*g+v*(v+2*f)+d);else v=c>0?-a:a,g=Math.max(0,-(c*v+h)),_=-g*g+v*(v+2*f)+d;return i&&i.copy(this.origin).addScaledVector(this.direction,g),o&&o.copy(fh).addScaledVector(bl,v),_}intersectSphere(e,t){Gi.subVectors(e.center,this.origin);const i=Gi.dot(this.direction),o=Gi.dot(Gi)-i*i,a=e.radius*e.radius;if(o>a)return null;const c=Math.sqrt(a-o),h=i-c,f=i+c;return f<0?null:h<0?this.at(f,t):this.at(h,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,o,a,c,h,f;const d=1/this.direction.x,m=1/this.direction.y,g=1/this.direction.z,v=this.origin;return d>=0?(i=(e.min.x-v.x)*d,o=(e.max.x-v.x)*d):(i=(e.max.x-v.x)*d,o=(e.min.x-v.x)*d),m>=0?(a=(e.min.y-v.y)*m,c=(e.max.y-v.y)*m):(a=(e.max.y-v.y)*m,c=(e.min.y-v.y)*m),i>c||a>o||((a>i||isNaN(i))&&(i=a),(c<o||isNaN(o))&&(o=c),g>=0?(h=(e.min.z-v.z)*g,f=(e.max.z-v.z)*g):(h=(e.max.z-v.z)*g,f=(e.min.z-v.z)*g),i>f||h>o)||((h>i||i!==i)&&(i=h),(f<o||o!==o)&&(o=f),o<0)?null:this.at(i>=0?i:o,t)}intersectsBox(e){return this.intersectBox(e,Gi)!==null}intersectTriangle(e,t,i,o,a){dh.subVectors(t,e),Pl.subVectors(i,e),ph.crossVectors(dh,Pl);let c=this.direction.dot(ph),h;if(c>0){if(o)return null;h=1}else if(c<0)h=-1,c=-c;else return null;Mr.subVectors(this.origin,e);const f=h*this.direction.dot(Pl.crossVectors(Mr,Pl));if(f<0)return null;const d=h*this.direction.dot(dh.cross(Mr));if(d<0||f+d>c)return null;const m=-h*Mr.dot(ph);return m<0?null:this.at(m/c,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Lt{constructor(e,t,i,o,a,c,h,f,d,m,g,v,_,M,w,S){Lt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,o,a,c,h,f,d,m,g,v,_,M,w,S)}set(e,t,i,o,a,c,h,f,d,m,g,v,_,M,w,S){const y=this.elements;return y[0]=e,y[4]=t,y[8]=i,y[12]=o,y[1]=a,y[5]=c,y[9]=h,y[13]=f,y[2]=d,y[6]=m,y[10]=g,y[14]=v,y[3]=_,y[7]=M,y[11]=w,y[15]=S,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Lt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,o=1/Vs.setFromMatrixColumn(e,0).length(),a=1/Vs.setFromMatrixColumn(e,1).length(),c=1/Vs.setFromMatrixColumn(e,2).length();return t[0]=i[0]*o,t[1]=i[1]*o,t[2]=i[2]*o,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*c,t[9]=i[9]*c,t[10]=i[10]*c,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,o=e.y,a=e.z,c=Math.cos(i),h=Math.sin(i),f=Math.cos(o),d=Math.sin(o),m=Math.cos(a),g=Math.sin(a);if(e.order==="XYZ"){const v=c*m,_=c*g,M=h*m,w=h*g;t[0]=f*m,t[4]=-f*g,t[8]=d,t[1]=_+M*d,t[5]=v-w*d,t[9]=-h*f,t[2]=w-v*d,t[6]=M+_*d,t[10]=c*f}else if(e.order==="YXZ"){const v=f*m,_=f*g,M=d*m,w=d*g;t[0]=v+w*h,t[4]=M*h-_,t[8]=c*d,t[1]=c*g,t[5]=c*m,t[9]=-h,t[2]=_*h-M,t[6]=w+v*h,t[10]=c*f}else if(e.order==="ZXY"){const v=f*m,_=f*g,M=d*m,w=d*g;t[0]=v-w*h,t[4]=-c*g,t[8]=M+_*h,t[1]=_+M*h,t[5]=c*m,t[9]=w-v*h,t[2]=-c*d,t[6]=h,t[10]=c*f}else if(e.order==="ZYX"){const v=c*m,_=c*g,M=h*m,w=h*g;t[0]=f*m,t[4]=M*d-_,t[8]=v*d+w,t[1]=f*g,t[5]=w*d+v,t[9]=_*d-M,t[2]=-d,t[6]=h*f,t[10]=c*f}else if(e.order==="YZX"){const v=c*f,_=c*d,M=h*f,w=h*d;t[0]=f*m,t[4]=w-v*g,t[8]=M*g+_,t[1]=g,t[5]=c*m,t[9]=-h*m,t[2]=-d*m,t[6]=_*g+M,t[10]=v-w*g}else if(e.order==="XZY"){const v=c*f,_=c*d,M=h*f,w=h*d;t[0]=f*m,t[4]=-g,t[8]=d*m,t[1]=v*g+w,t[5]=c*m,t[9]=_*g-M,t[2]=M*g-_,t[6]=h*m,t[10]=w*g+v}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(F_,e,O_)}lookAt(e,t,i){const o=this.elements;return Wn.subVectors(e,t),Wn.lengthSq()===0&&(Wn.z=1),Wn.normalize(),Er.crossVectors(i,Wn),Er.lengthSq()===0&&(Math.abs(i.z)===1?Wn.x+=1e-4:Wn.z+=1e-4,Wn.normalize(),Er.crossVectors(i,Wn)),Er.normalize(),Ll.crossVectors(Wn,Er),o[0]=Er.x,o[4]=Ll.x,o[8]=Wn.x,o[1]=Er.y,o[5]=Ll.y,o[9]=Wn.y,o[2]=Er.z,o[6]=Ll.z,o[10]=Wn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,o=t.elements,a=this.elements,c=i[0],h=i[4],f=i[8],d=i[12],m=i[1],g=i[5],v=i[9],_=i[13],M=i[2],w=i[6],S=i[10],y=i[14],N=i[3],b=i[7],A=i[11],W=i[15],U=o[0],z=o[4],V=o[8],L=o[12],R=o[1],B=o[5],ee=o[9],K=o[13],oe=o[2],he=o[6],se=o[10],ue=o[14],G=o[3],ce=o[7],ae=o[11],k=o[15];return a[0]=c*U+h*R+f*oe+d*G,a[4]=c*z+h*B+f*he+d*ce,a[8]=c*V+h*ee+f*se+d*ae,a[12]=c*L+h*K+f*ue+d*k,a[1]=m*U+g*R+v*oe+_*G,a[5]=m*z+g*B+v*he+_*ce,a[9]=m*V+g*ee+v*se+_*ae,a[13]=m*L+g*K+v*ue+_*k,a[2]=M*U+w*R+S*oe+y*G,a[6]=M*z+w*B+S*he+y*ce,a[10]=M*V+w*ee+S*se+y*ae,a[14]=M*L+w*K+S*ue+y*k,a[3]=N*U+b*R+A*oe+W*G,a[7]=N*z+b*B+A*he+W*ce,a[11]=N*V+b*ee+A*se+W*ae,a[15]=N*L+b*K+A*ue+W*k,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],o=e[8],a=e[12],c=e[1],h=e[5],f=e[9],d=e[13],m=e[2],g=e[6],v=e[10],_=e[14],M=e[3],w=e[7],S=e[11],y=e[15];return M*(+a*f*g-o*d*g-a*h*v+i*d*v+o*h*_-i*f*_)+w*(+t*f*_-t*d*v+a*c*v-o*c*_+o*d*m-a*f*m)+S*(+t*d*g-t*h*_-a*c*g+i*c*_+a*h*m-i*d*m)+y*(-o*h*m-t*f*g+t*h*v+o*c*g-i*c*v+i*f*m)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const o=this.elements;return e.isVector3?(o[12]=e.x,o[13]=e.y,o[14]=e.z):(o[12]=e,o[13]=t,o[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],o=e[2],a=e[3],c=e[4],h=e[5],f=e[6],d=e[7],m=e[8],g=e[9],v=e[10],_=e[11],M=e[12],w=e[13],S=e[14],y=e[15],N=g*S*d-w*v*d+w*f*_-h*S*_-g*f*y+h*v*y,b=M*v*d-m*S*d-M*f*_+c*S*_+m*f*y-c*v*y,A=m*w*d-M*g*d+M*h*_-c*w*_-m*h*y+c*g*y,W=M*g*f-m*w*f-M*h*v+c*w*v+m*h*S-c*g*S,U=t*N+i*b+o*A+a*W;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const z=1/U;return e[0]=N*z,e[1]=(w*v*a-g*S*a-w*o*_+i*S*_+g*o*y-i*v*y)*z,e[2]=(h*S*a-w*f*a+w*o*d-i*S*d-h*o*y+i*f*y)*z,e[3]=(g*f*a-h*v*a-g*o*d+i*v*d+h*o*_-i*f*_)*z,e[4]=b*z,e[5]=(m*S*a-M*v*a+M*o*_-t*S*_-m*o*y+t*v*y)*z,e[6]=(M*f*a-c*S*a-M*o*d+t*S*d+c*o*y-t*f*y)*z,e[7]=(c*v*a-m*f*a+m*o*d-t*v*d-c*o*_+t*f*_)*z,e[8]=A*z,e[9]=(M*g*a-m*w*a-M*i*_+t*w*_+m*i*y-t*g*y)*z,e[10]=(c*w*a-M*h*a+M*i*d-t*w*d-c*i*y+t*h*y)*z,e[11]=(m*h*a-c*g*a-m*i*d+t*g*d+c*i*_-t*h*_)*z,e[12]=W*z,e[13]=(m*w*o-M*g*o+M*i*v-t*w*v-m*i*S+t*g*S)*z,e[14]=(M*h*o-c*w*o-M*i*f+t*w*f+c*i*S-t*h*S)*z,e[15]=(c*g*o-m*h*o+m*i*f-t*g*f-c*i*v+t*h*v)*z,this}scale(e){const t=this.elements,i=e.x,o=e.y,a=e.z;return t[0]*=i,t[4]*=o,t[8]*=a,t[1]*=i,t[5]*=o,t[9]*=a,t[2]*=i,t[6]*=o,t[10]*=a,t[3]*=i,t[7]*=o,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],o=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,o))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),o=Math.sin(t),a=1-i,c=e.x,h=e.y,f=e.z,d=a*c,m=a*h;return this.set(d*c+i,d*h-o*f,d*f+o*h,0,d*h+o*f,m*h+i,m*f-o*c,0,d*f-o*h,m*f+o*c,a*f*f+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,o,a,c){return this.set(1,i,a,0,e,1,c,0,t,o,1,0,0,0,0,1),this}compose(e,t,i){const o=this.elements,a=t._x,c=t._y,h=t._z,f=t._w,d=a+a,m=c+c,g=h+h,v=a*d,_=a*m,M=a*g,w=c*m,S=c*g,y=h*g,N=f*d,b=f*m,A=f*g,W=i.x,U=i.y,z=i.z;return o[0]=(1-(w+y))*W,o[1]=(_+A)*W,o[2]=(M-b)*W,o[3]=0,o[4]=(_-A)*U,o[5]=(1-(v+y))*U,o[6]=(S+N)*U,o[7]=0,o[8]=(M+b)*z,o[9]=(S-N)*z,o[10]=(1-(v+w))*z,o[11]=0,o[12]=e.x,o[13]=e.y,o[14]=e.z,o[15]=1,this}decompose(e,t,i){const o=this.elements;let a=Vs.set(o[0],o[1],o[2]).length();const c=Vs.set(o[4],o[5],o[6]).length(),h=Vs.set(o[8],o[9],o[10]).length();this.determinant()<0&&(a=-a),e.x=o[12],e.y=o[13],e.z=o[14],mi.copy(this);const d=1/a,m=1/c,g=1/h;return mi.elements[0]*=d,mi.elements[1]*=d,mi.elements[2]*=d,mi.elements[4]*=m,mi.elements[5]*=m,mi.elements[6]*=m,mi.elements[8]*=g,mi.elements[9]*=g,mi.elements[10]*=g,t.setFromRotationMatrix(mi),i.x=a,i.y=c,i.z=h,this}makePerspective(e,t,i,o,a,c,h=Ki){const f=this.elements,d=2*a/(t-e),m=2*a/(i-o),g=(t+e)/(t-e),v=(i+o)/(i-o);let _,M;if(h===Ki)_=-(c+a)/(c-a),M=-2*c*a/(c-a);else if(h===sc)_=-c/(c-a),M=-c*a/(c-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+h);return f[0]=d,f[4]=0,f[8]=g,f[12]=0,f[1]=0,f[5]=m,f[9]=v,f[13]=0,f[2]=0,f[6]=0,f[10]=_,f[14]=M,f[3]=0,f[7]=0,f[11]=-1,f[15]=0,this}makeOrthographic(e,t,i,o,a,c,h=Ki){const f=this.elements,d=1/(t-e),m=1/(i-o),g=1/(c-a),v=(t+e)*d,_=(i+o)*m;let M,w;if(h===Ki)M=(c+a)*g,w=-2*g;else if(h===sc)M=a*g,w=-1*g;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+h);return f[0]=2*d,f[4]=0,f[8]=0,f[12]=-v,f[1]=0,f[5]=2*m,f[9]=0,f[13]=-_,f[2]=0,f[6]=0,f[10]=w,f[14]=-M,f[3]=0,f[7]=0,f[11]=0,f[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let o=0;o<16;o++)if(t[o]!==i[o])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Vs=new F,mi=new Lt,F_=new F(0,0,0),O_=new F(1,1,1),Er=new F,Ll=new F,Wn=new F,Ym=new Lt,qm=new fo;class _i{constructor(e=0,t=0,i=0,o=_i.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=o}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,o=this._order){return this._x=e,this._y=t,this._z=i,this._order=o,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const o=e.elements,a=o[0],c=o[4],h=o[8],f=o[1],d=o[5],m=o[9],g=o[2],v=o[6],_=o[10];switch(t){case"XYZ":this._y=Math.asin(yn(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(-m,_),this._z=Math.atan2(-c,a)):(this._x=Math.atan2(v,d),this._z=0);break;case"YXZ":this._x=Math.asin(-yn(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(h,_),this._z=Math.atan2(f,d)):(this._y=Math.atan2(-g,a),this._z=0);break;case"ZXY":this._x=Math.asin(yn(v,-1,1)),Math.abs(v)<.9999999?(this._y=Math.atan2(-g,_),this._z=Math.atan2(-c,d)):(this._y=0,this._z=Math.atan2(f,a));break;case"ZYX":this._y=Math.asin(-yn(g,-1,1)),Math.abs(g)<.9999999?(this._x=Math.atan2(v,_),this._z=Math.atan2(f,a)):(this._x=0,this._z=Math.atan2(-c,d));break;case"YZX":this._z=Math.asin(yn(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(-m,d),this._y=Math.atan2(-g,a)):(this._x=0,this._y=Math.atan2(h,_));break;case"XZY":this._z=Math.asin(-yn(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(v,d),this._y=Math.atan2(h,a)):(this._x=Math.atan2(-m,_),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return Ym.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Ym,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return qm.setFromEuler(this),this.setFromQuaternion(qm,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_i.DEFAULT_ORDER="XYZ";class wg{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let z_=0;const $m=new F,Hs=new fo,Wi=new Lt,Nl=new F,Zo=new F,k_=new F,B_=new fo,Km=new F(1,0,0),Zm=new F(0,1,0),Jm=new F(0,0,1),Qm={type:"added"},V_={type:"removed"},Gs={type:"childadded",child:null},mh={type:"childremoved",child:null};class ln extends uo{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:z_++}),this.uuid=ho(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ln.DEFAULT_UP.clone();const e=new F,t=new _i,i=new fo,o=new F(1,1,1);function a(){i.setFromEuler(t,!1)}function c(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(c),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:o},modelViewMatrix:{value:new Lt},normalMatrix:{value:new mt}}),this.matrix=new Lt,this.matrixWorld=new Lt,this.matrixAutoUpdate=ln.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wg,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Hs.setFromAxisAngle(e,t),this.quaternion.multiply(Hs),this}rotateOnWorldAxis(e,t){return Hs.setFromAxisAngle(e,t),this.quaternion.premultiply(Hs),this}rotateX(e){return this.rotateOnAxis(Km,e)}rotateY(e){return this.rotateOnAxis(Zm,e)}rotateZ(e){return this.rotateOnAxis(Jm,e)}translateOnAxis(e,t){return $m.copy(e).applyQuaternion(this.quaternion),this.position.add($m.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Km,e)}translateY(e){return this.translateOnAxis(Zm,e)}translateZ(e){return this.translateOnAxis(Jm,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Wi.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Nl.copy(e):Nl.set(e,t,i);const o=this.parent;this.updateWorldMatrix(!0,!1),Zo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Wi.lookAt(Zo,Nl,this.up):Wi.lookAt(Nl,Zo,this.up),this.quaternion.setFromRotationMatrix(Wi),o&&(Wi.extractRotation(o.matrixWorld),Hs.setFromRotationMatrix(Wi),this.quaternion.premultiply(Hs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Qm),Gs.child=e,this.dispatchEvent(Gs),Gs.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(V_),mh.child=e,this.dispatchEvent(mh),mh.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Wi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Wi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Wi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Qm),Gs.child=e,this.dispatchEvent(Gs),Gs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,o=this.children.length;i<o;i++){const c=this.children[i].getObjectByProperty(e,t);if(c!==void 0)return c}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const o=this.children;for(let a=0,c=o.length;a<c;a++)o[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zo,e,k_),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zo,B_,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,o=t.length;i<o;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const o=this.children;for(let a=0,c=o.length;a<c;a++)o[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const o={};o.uuid=this.uuid,o.type=this.type,this.name!==""&&(o.name=this.name),this.castShadow===!0&&(o.castShadow=!0),this.receiveShadow===!0&&(o.receiveShadow=!0),this.visible===!1&&(o.visible=!1),this.frustumCulled===!1&&(o.frustumCulled=!1),this.renderOrder!==0&&(o.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(o.userData=this.userData),o.layers=this.layers.mask,o.matrix=this.matrix.toArray(),o.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(o.matrixAutoUpdate=!1),this.isInstancedMesh&&(o.type="InstancedMesh",o.count=this.count,o.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(o.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(o.type="BatchedMesh",o.perObjectFrustumCulled=this.perObjectFrustumCulled,o.sortObjects=this.sortObjects,o.drawRanges=this._drawRanges,o.reservedRanges=this._reservedRanges,o.visibility=this._visibility,o.active=this._active,o.bounds=this._bounds.map(h=>({boxInitialized:h.boxInitialized,boxMin:h.box.min.toArray(),boxMax:h.box.max.toArray(),sphereInitialized:h.sphereInitialized,sphereRadius:h.sphere.radius,sphereCenter:h.sphere.center.toArray()})),o.maxInstanceCount=this._maxInstanceCount,o.maxVertexCount=this._maxVertexCount,o.maxIndexCount=this._maxIndexCount,o.geometryInitialized=this._geometryInitialized,o.geometryCount=this._geometryCount,o.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(o.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(o.boundingSphere={center:o.boundingSphere.center.toArray(),radius:o.boundingSphere.radius}),this.boundingBox!==null&&(o.boundingBox={min:o.boundingBox.min.toArray(),max:o.boundingBox.max.toArray()}));function a(h,f){return h[f.uuid]===void 0&&(h[f.uuid]=f.toJSON(e)),f.uuid}if(this.isScene)this.background&&(this.background.isColor?o.background=this.background.toJSON():this.background.isTexture&&(o.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(o.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){o.geometry=a(e.geometries,this.geometry);const h=this.geometry.parameters;if(h!==void 0&&h.shapes!==void 0){const f=h.shapes;if(Array.isArray(f))for(let d=0,m=f.length;d<m;d++){const g=f[d];a(e.shapes,g)}else a(e.shapes,f)}}if(this.isSkinnedMesh&&(o.bindMode=this.bindMode,o.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),o.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const h=[];for(let f=0,d=this.material.length;f<d;f++)h.push(a(e.materials,this.material[f]));o.material=h}else o.material=a(e.materials,this.material);if(this.children.length>0){o.children=[];for(let h=0;h<this.children.length;h++)o.children.push(this.children[h].toJSON(e).object)}if(this.animations.length>0){o.animations=[];for(let h=0;h<this.animations.length;h++){const f=this.animations[h];o.animations.push(a(e.animations,f))}}if(t){const h=c(e.geometries),f=c(e.materials),d=c(e.textures),m=c(e.images),g=c(e.shapes),v=c(e.skeletons),_=c(e.animations),M=c(e.nodes);h.length>0&&(i.geometries=h),f.length>0&&(i.materials=f),d.length>0&&(i.textures=d),m.length>0&&(i.images=m),g.length>0&&(i.shapes=g),v.length>0&&(i.skeletons=v),_.length>0&&(i.animations=_),M.length>0&&(i.nodes=M)}return i.object=o,i;function c(h){const f=[];for(const d in h){const m=h[d];delete m.metadata,f.push(m)}return f}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const o=e.children[i];this.add(o.clone())}return this}}ln.DEFAULT_UP=new F(0,1,0);ln.DEFAULT_MATRIX_AUTO_UPDATE=!0;ln.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const gi=new F,ji=new F,gh=new F,Xi=new F,Ws=new F,js=new F,e0=new F,vh=new F,xh=new F,_h=new F,yh=new Dt,Sh=new Dt,Mh=new Dt;class vi{constructor(e=new F,t=new F,i=new F){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,o){o.subVectors(i,t),gi.subVectors(e,t),o.cross(gi);const a=o.lengthSq();return a>0?o.multiplyScalar(1/Math.sqrt(a)):o.set(0,0,0)}static getBarycoord(e,t,i,o,a){gi.subVectors(o,t),ji.subVectors(i,t),gh.subVectors(e,t);const c=gi.dot(gi),h=gi.dot(ji),f=gi.dot(gh),d=ji.dot(ji),m=ji.dot(gh),g=c*d-h*h;if(g===0)return a.set(0,0,0),null;const v=1/g,_=(d*f-h*m)*v,M=(c*m-h*f)*v;return a.set(1-_-M,M,_)}static containsPoint(e,t,i,o){return this.getBarycoord(e,t,i,o,Xi)===null?!1:Xi.x>=0&&Xi.y>=0&&Xi.x+Xi.y<=1}static getInterpolation(e,t,i,o,a,c,h,f){return this.getBarycoord(e,t,i,o,Xi)===null?(f.x=0,f.y=0,"z"in f&&(f.z=0),"w"in f&&(f.w=0),null):(f.setScalar(0),f.addScaledVector(a,Xi.x),f.addScaledVector(c,Xi.y),f.addScaledVector(h,Xi.z),f)}static getInterpolatedAttribute(e,t,i,o,a,c){return yh.setScalar(0),Sh.setScalar(0),Mh.setScalar(0),yh.fromBufferAttribute(e,t),Sh.fromBufferAttribute(e,i),Mh.fromBufferAttribute(e,o),c.setScalar(0),c.addScaledVector(yh,a.x),c.addScaledVector(Sh,a.y),c.addScaledVector(Mh,a.z),c}static isFrontFacing(e,t,i,o){return gi.subVectors(i,t),ji.subVectors(e,t),gi.cross(ji).dot(o)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,o){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[o]),this}setFromAttributeAndIndices(e,t,i,o){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,o),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return gi.subVectors(this.c,this.b),ji.subVectors(this.a,this.b),gi.cross(ji).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return vi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return vi.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,o,a){return vi.getInterpolation(e,this.a,this.b,this.c,t,i,o,a)}containsPoint(e){return vi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return vi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,o=this.b,a=this.c;let c,h;Ws.subVectors(o,i),js.subVectors(a,i),vh.subVectors(e,i);const f=Ws.dot(vh),d=js.dot(vh);if(f<=0&&d<=0)return t.copy(i);xh.subVectors(e,o);const m=Ws.dot(xh),g=js.dot(xh);if(m>=0&&g<=m)return t.copy(o);const v=f*g-m*d;if(v<=0&&f>=0&&m<=0)return c=f/(f-m),t.copy(i).addScaledVector(Ws,c);_h.subVectors(e,a);const _=Ws.dot(_h),M=js.dot(_h);if(M>=0&&_<=M)return t.copy(a);const w=_*d-f*M;if(w<=0&&d>=0&&M<=0)return h=d/(d-M),t.copy(i).addScaledVector(js,h);const S=m*M-_*g;if(S<=0&&g-m>=0&&_-M>=0)return e0.subVectors(a,o),h=(g-m)/(g-m+(_-M)),t.copy(o).addScaledVector(e0,h);const y=1/(S+w+v);return c=w*y,h=v*y,t.copy(i).addScaledVector(Ws,c).addScaledVector(js,h)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Tg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wr={h:0,s:0,l:0},Il={h:0,s:0,l:0};function Eh(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class yt{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const o=e;o&&o.isColor?this.copy(o):typeof o=="number"?this.setHex(o):typeof o=="string"&&this.setStyle(o)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Yn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Tt.toWorkingColorSpace(this,t),this}setRGB(e,t,i,o=Tt.workingColorSpace){return this.r=e,this.g=t,this.b=i,Tt.toWorkingColorSpace(this,o),this}setHSL(e,t,i,o=Tt.workingColorSpace){if(e=T_(e,1),t=yn(t,0,1),i=yn(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,c=2*i-a;this.r=Eh(c,a,e+1/3),this.g=Eh(c,a,e),this.b=Eh(c,a,e-1/3)}return Tt.toWorkingColorSpace(this,o),this}setStyle(e,t=Yn){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let o;if(o=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const c=o[1],h=o[2];switch(c){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(h))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(o=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=o[1],c=a.length;if(c===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(c===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Yn){const i=Tg[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zi(e.r),this.g=Zi(e.g),this.b=Zi(e.b),this}copyLinearToSRGB(e){return this.r=no(e.r),this.g=no(e.g),this.b=no(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Yn){return Tt.fromWorkingColorSpace(_n.copy(this),e),Math.round(yn(_n.r*255,0,255))*65536+Math.round(yn(_n.g*255,0,255))*256+Math.round(yn(_n.b*255,0,255))}getHexString(e=Yn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Tt.workingColorSpace){Tt.fromWorkingColorSpace(_n.copy(this),t);const i=_n.r,o=_n.g,a=_n.b,c=Math.max(i,o,a),h=Math.min(i,o,a);let f,d;const m=(h+c)/2;if(h===c)f=0,d=0;else{const g=c-h;switch(d=m<=.5?g/(c+h):g/(2-c-h),c){case i:f=(o-a)/g+(o<a?6:0);break;case o:f=(a-i)/g+2;break;case a:f=(i-o)/g+4;break}f/=6}return e.h=f,e.s=d,e.l=m,e}getRGB(e,t=Tt.workingColorSpace){return Tt.fromWorkingColorSpace(_n.copy(this),t),e.r=_n.r,e.g=_n.g,e.b=_n.b,e}getStyle(e=Yn){Tt.fromWorkingColorSpace(_n.copy(this),e);const t=_n.r,i=_n.g,o=_n.b;return e!==Yn?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${o.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(o*255)})`}offsetHSL(e,t,i){return this.getHSL(wr),this.setHSL(wr.h+e,wr.s+t,wr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(wr),e.getHSL(Il);const i=oh(wr.h,Il.h,t),o=oh(wr.s,Il.s,t),a=oh(wr.l,Il.l,t);return this.setHSL(i,o,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,o=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*o,this.g=a[1]*t+a[4]*i+a[7]*o,this.b=a[2]*t+a[5]*i+a[8]*o,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const _n=new yt;yt.NAMES=Tg;let H_=0;class Pr extends uo{static get type(){return"Material"}get type(){return this.constructor.type}set type(e){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:H_++}),this.uuid=ho(),this.name="",this.blending=eo,this.side=br,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Gh,this.blendDst=Wh,this.blendEquation=is,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new yt(0,0,0),this.blendAlpha=0,this.depthFunc=io,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Om,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fs,this.stencilZFail=Fs,this.stencilZPass=Fs,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const o=this[t];if(o===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}o&&o.isColor?o.set(i):o&&o.isVector3&&i&&i.isVector3?o.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==eo&&(i.blending=this.blending),this.side!==br&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Gh&&(i.blendSrc=this.blendSrc),this.blendDst!==Wh&&(i.blendDst=this.blendDst),this.blendEquation!==is&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==io&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Om&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Fs&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Fs&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Fs&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function o(a){const c=[];for(const h in a){const f=a[h];delete f.metadata,c.push(f)}return c}if(t){const a=o(e.textures),c=o(e.images);a.length>0&&(i.textures=a),c.length>0&&(i.images=c)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const o=t.length;i=new Array(o);for(let a=0;a!==o;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class as extends Pr{static get type(){return"MeshBasicMaterial"}constructor(e){super(),this.isMeshBasicMaterial=!0,this.color=new yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.combine=og,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const qt=new F,Dl=new Ie;class si{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=zm,this.updateRanges=[],this.gpuType=bi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let o=0,a=this.itemSize;o<a;o++)this.array[e+o]=t.array[i+o];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Dl.fromBufferAttribute(this,t),Dl.applyMatrix3(e),this.setXY(t,Dl.x,Dl.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix3(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)qt.fromBufferAttribute(this,t),qt.applyMatrix4(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)qt.fromBufferAttribute(this,t),qt.applyNormalMatrix(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)qt.fromBufferAttribute(this,t),qt.transformDirection(e),this.setXYZ(t,qt.x,qt.y,qt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=qo(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Un(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=qo(t,this.array)),t}setX(e,t){return this.normalized&&(t=Un(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=qo(t,this.array)),t}setY(e,t){return this.normalized&&(t=Un(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=qo(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Un(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=qo(t,this.array)),t}setW(e,t){return this.normalized&&(t=Un(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Un(t,this.array),i=Un(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,o){return e*=this.itemSize,this.normalized&&(t=Un(t,this.array),i=Un(i,this.array),o=Un(o,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=o,this}setXYZW(e,t,i,o,a){return e*=this.itemSize,this.normalized&&(t=Un(t,this.array),i=Un(i,this.array),o=Un(o,this.array),a=Un(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=o,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==zm&&(e.usage=this.usage),e}}class Ag extends si{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Cg extends si{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class Nt extends si{constructor(e,t,i){super(new Float32Array(e),t,i)}}let G_=0;const ri=new Lt,wh=new ln,Xs=new F,jn=new hs,Jo=new hs,an=new F;class en extends uo{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:G_++}),this.uuid=ho(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(yg(e)?Cg:Ag)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new mt().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const o=this.attributes.tangent;return o!==void 0&&(o.transformDirection(e),o.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return ri.makeRotationFromQuaternion(e),this.applyMatrix4(ri),this}rotateX(e){return ri.makeRotationX(e),this.applyMatrix4(ri),this}rotateY(e){return ri.makeRotationY(e),this.applyMatrix4(ri),this}rotateZ(e){return ri.makeRotationZ(e),this.applyMatrix4(ri),this}translate(e,t,i){return ri.makeTranslation(e,t,i),this.applyMatrix4(ri),this}scale(e,t,i){return ri.makeScale(e,t,i),this.applyMatrix4(ri),this}lookAt(e){return wh.lookAt(e),wh.updateMatrix(),this.applyMatrix4(wh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Xs).negate(),this.translate(Xs.x,Xs.y,Xs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let o=0,a=e.length;o<a;o++){const c=e[o];i.push(c.x,c.y,c.z||0)}this.setAttribute("position",new Nt(i,3))}else{for(let i=0,o=t.count;i<o;i++){const a=e[i];t.setXYZ(i,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new hs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,o=t.length;i<o;i++){const a=t[i];jn.setFromBufferAttribute(a),this.morphTargetsRelative?(an.addVectors(this.boundingBox.min,jn.min),this.boundingBox.expandByPoint(an),an.addVectors(this.boundingBox.max,jn.max),this.boundingBox.expandByPoint(an)):(this.boundingBox.expandByPoint(jn.min),this.boundingBox.expandByPoint(jn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new po);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new F,1/0);return}if(e){const i=this.boundingSphere.center;if(jn.setFromBufferAttribute(e),t)for(let a=0,c=t.length;a<c;a++){const h=t[a];Jo.setFromBufferAttribute(h),this.morphTargetsRelative?(an.addVectors(jn.min,Jo.min),jn.expandByPoint(an),an.addVectors(jn.max,Jo.max),jn.expandByPoint(an)):(jn.expandByPoint(Jo.min),jn.expandByPoint(Jo.max))}jn.getCenter(i);let o=0;for(let a=0,c=e.count;a<c;a++)an.fromBufferAttribute(e,a),o=Math.max(o,i.distanceToSquared(an));if(t)for(let a=0,c=t.length;a<c;a++){const h=t[a],f=this.morphTargetsRelative;for(let d=0,m=h.count;d<m;d++)an.fromBufferAttribute(h,d),f&&(Xs.fromBufferAttribute(e,d),an.add(Xs)),o=Math.max(o,i.distanceToSquared(an))}this.boundingSphere.radius=Math.sqrt(o),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,o=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new si(new Float32Array(4*i.count),4));const c=this.getAttribute("tangent"),h=[],f=[];for(let V=0;V<i.count;V++)h[V]=new F,f[V]=new F;const d=new F,m=new F,g=new F,v=new Ie,_=new Ie,M=new Ie,w=new F,S=new F;function y(V,L,R){d.fromBufferAttribute(i,V),m.fromBufferAttribute(i,L),g.fromBufferAttribute(i,R),v.fromBufferAttribute(a,V),_.fromBufferAttribute(a,L),M.fromBufferAttribute(a,R),m.sub(d),g.sub(d),_.sub(v),M.sub(v);const B=1/(_.x*M.y-M.x*_.y);isFinite(B)&&(w.copy(m).multiplyScalar(M.y).addScaledVector(g,-_.y).multiplyScalar(B),S.copy(g).multiplyScalar(_.x).addScaledVector(m,-M.x).multiplyScalar(B),h[V].add(w),h[L].add(w),h[R].add(w),f[V].add(S),f[L].add(S),f[R].add(S))}let N=this.groups;N.length===0&&(N=[{start:0,count:e.count}]);for(let V=0,L=N.length;V<L;++V){const R=N[V],B=R.start,ee=R.count;for(let K=B,oe=B+ee;K<oe;K+=3)y(e.getX(K+0),e.getX(K+1),e.getX(K+2))}const b=new F,A=new F,W=new F,U=new F;function z(V){W.fromBufferAttribute(o,V),U.copy(W);const L=h[V];b.copy(L),b.sub(W.multiplyScalar(W.dot(L))).normalize(),A.crossVectors(U,L);const B=A.dot(f[V])<0?-1:1;c.setXYZW(V,b.x,b.y,b.z,B)}for(let V=0,L=N.length;V<L;++V){const R=N[V],B=R.start,ee=R.count;for(let K=B,oe=B+ee;K<oe;K+=3)z(e.getX(K+0)),z(e.getX(K+1)),z(e.getX(K+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new si(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let v=0,_=i.count;v<_;v++)i.setXYZ(v,0,0,0);const o=new F,a=new F,c=new F,h=new F,f=new F,d=new F,m=new F,g=new F;if(e)for(let v=0,_=e.count;v<_;v+=3){const M=e.getX(v+0),w=e.getX(v+1),S=e.getX(v+2);o.fromBufferAttribute(t,M),a.fromBufferAttribute(t,w),c.fromBufferAttribute(t,S),m.subVectors(c,a),g.subVectors(o,a),m.cross(g),h.fromBufferAttribute(i,M),f.fromBufferAttribute(i,w),d.fromBufferAttribute(i,S),h.add(m),f.add(m),d.add(m),i.setXYZ(M,h.x,h.y,h.z),i.setXYZ(w,f.x,f.y,f.z),i.setXYZ(S,d.x,d.y,d.z)}else for(let v=0,_=t.count;v<_;v+=3)o.fromBufferAttribute(t,v+0),a.fromBufferAttribute(t,v+1),c.fromBufferAttribute(t,v+2),m.subVectors(c,a),g.subVectors(o,a),m.cross(g),i.setXYZ(v+0,m.x,m.y,m.z),i.setXYZ(v+1,m.x,m.y,m.z),i.setXYZ(v+2,m.x,m.y,m.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)an.fromBufferAttribute(e,t),an.normalize(),e.setXYZ(t,an.x,an.y,an.z)}toNonIndexed(){function e(h,f){const d=h.array,m=h.itemSize,g=h.normalized,v=new d.constructor(f.length*m);let _=0,M=0;for(let w=0,S=f.length;w<S;w++){h.isInterleavedBufferAttribute?_=f[w]*h.data.stride+h.offset:_=f[w]*m;for(let y=0;y<m;y++)v[M++]=d[_++]}return new si(v,m,g)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new en,i=this.index.array,o=this.attributes;for(const h in o){const f=o[h],d=e(f,i);t.setAttribute(h,d)}const a=this.morphAttributes;for(const h in a){const f=[],d=a[h];for(let m=0,g=d.length;m<g;m++){const v=d[m],_=e(v,i);f.push(_)}t.morphAttributes[h]=f}t.morphTargetsRelative=this.morphTargetsRelative;const c=this.groups;for(let h=0,f=c.length;h<f;h++){const d=c[h];t.addGroup(d.start,d.count,d.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const f=this.parameters;for(const d in f)f[d]!==void 0&&(e[d]=f[d]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const f in i){const d=i[f];e.data.attributes[f]=d.toJSON(e.data)}const o={};let a=!1;for(const f in this.morphAttributes){const d=this.morphAttributes[f],m=[];for(let g=0,v=d.length;g<v;g++){const _=d[g];m.push(_.toJSON(e.data))}m.length>0&&(o[f]=m,a=!0)}a&&(e.data.morphAttributes=o,e.data.morphTargetsRelative=this.morphTargetsRelative);const c=this.groups;c.length>0&&(e.data.groups=JSON.parse(JSON.stringify(c)));const h=this.boundingSphere;return h!==null&&(e.data.boundingSphere={center:h.center.toArray(),radius:h.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(t));const o=e.attributes;for(const d in o){const m=o[d];this.setAttribute(d,m.clone(t))}const a=e.morphAttributes;for(const d in a){const m=[],g=a[d];for(let v=0,_=g.length;v<_;v++)m.push(g[v].clone(t));this.morphAttributes[d]=m}this.morphTargetsRelative=e.morphTargetsRelative;const c=e.groups;for(let d=0,m=c.length;d<m;d++){const g=c[d];this.addGroup(g.start,g.count,g.materialIndex)}const h=e.boundingBox;h!==null&&(this.boundingBox=h.clone());const f=e.boundingSphere;return f!==null&&(this.boundingSphere=f.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const t0=new Lt,Kr=new Eg,Ul=new po,n0=new F,Fl=new F,Ol=new F,zl=new F,Th=new F,kl=new F,i0=new F,Bl=new F;class Ut extends ln{constructor(e=new en,t=new as){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const o=t[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=o.length;a<c;a++){const h=o[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=a}}}}getVertexPosition(e,t){const i=this.geometry,o=i.attributes.position,a=i.morphAttributes.position,c=i.morphTargetsRelative;t.fromBufferAttribute(o,e);const h=this.morphTargetInfluences;if(a&&h){kl.set(0,0,0);for(let f=0,d=a.length;f<d;f++){const m=h[f],g=a[f];m!==0&&(Th.fromBufferAttribute(g,e),c?kl.addScaledVector(Th,m):kl.addScaledVector(Th.sub(t),m))}t.add(kl)}return t}raycast(e,t){const i=this.geometry,o=this.material,a=this.matrixWorld;o!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ul.copy(i.boundingSphere),Ul.applyMatrix4(a),Kr.copy(e.ray).recast(e.near),!(Ul.containsPoint(Kr.origin)===!1&&(Kr.intersectSphere(Ul,n0)===null||Kr.origin.distanceToSquared(n0)>(e.far-e.near)**2))&&(t0.copy(a).invert(),Kr.copy(e.ray).applyMatrix4(t0),!(i.boundingBox!==null&&Kr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Kr)))}_computeIntersections(e,t,i){let o;const a=this.geometry,c=this.material,h=a.index,f=a.attributes.position,d=a.attributes.uv,m=a.attributes.uv1,g=a.attributes.normal,v=a.groups,_=a.drawRange;if(h!==null)if(Array.isArray(c))for(let M=0,w=v.length;M<w;M++){const S=v[M],y=c[S.materialIndex],N=Math.max(S.start,_.start),b=Math.min(h.count,Math.min(S.start+S.count,_.start+_.count));for(let A=N,W=b;A<W;A+=3){const U=h.getX(A),z=h.getX(A+1),V=h.getX(A+2);o=Vl(this,y,e,i,d,m,g,U,z,V),o&&(o.faceIndex=Math.floor(A/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const M=Math.max(0,_.start),w=Math.min(h.count,_.start+_.count);for(let S=M,y=w;S<y;S+=3){const N=h.getX(S),b=h.getX(S+1),A=h.getX(S+2);o=Vl(this,c,e,i,d,m,g,N,b,A),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}else if(f!==void 0)if(Array.isArray(c))for(let M=0,w=v.length;M<w;M++){const S=v[M],y=c[S.materialIndex],N=Math.max(S.start,_.start),b=Math.min(f.count,Math.min(S.start+S.count,_.start+_.count));for(let A=N,W=b;A<W;A+=3){const U=A,z=A+1,V=A+2;o=Vl(this,y,e,i,d,m,g,U,z,V),o&&(o.faceIndex=Math.floor(A/3),o.face.materialIndex=S.materialIndex,t.push(o))}}else{const M=Math.max(0,_.start),w=Math.min(f.count,_.start+_.count);for(let S=M,y=w;S<y;S+=3){const N=S,b=S+1,A=S+2;o=Vl(this,c,e,i,d,m,g,N,b,A),o&&(o.faceIndex=Math.floor(S/3),t.push(o))}}}}function W_(s,e,t,i,o,a,c,h){let f;if(e.side===kn?f=i.intersectTriangle(c,a,o,!0,h):f=i.intersectTriangle(o,a,c,e.side===br,h),f===null)return null;Bl.copy(h),Bl.applyMatrix4(s.matrixWorld);const d=t.ray.origin.distanceTo(Bl);return d<t.near||d>t.far?null:{distance:d,point:Bl.clone(),object:s}}function Vl(s,e,t,i,o,a,c,h,f,d){s.getVertexPosition(h,Fl),s.getVertexPosition(f,Ol),s.getVertexPosition(d,zl);const m=W_(s,e,t,i,Fl,Ol,zl,i0);if(m){const g=new F;vi.getBarycoord(i0,Fl,Ol,zl,g),o&&(m.uv=vi.getInterpolatedAttribute(o,h,f,d,g,new Ie)),a&&(m.uv1=vi.getInterpolatedAttribute(a,h,f,d,g,new Ie)),c&&(m.normal=vi.getInterpolatedAttribute(c,h,f,d,g,new F),m.normal.dot(i.direction)>0&&m.normal.multiplyScalar(-1));const v={a:h,b:f,c:d,normal:new F,materialIndex:0};vi.getNormal(Fl,Ol,zl,v.normal),m.face=v,m.barycoord=g}return m}class Lr extends en{constructor(e=1,t=1,i=1,o=1,a=1,c=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:o,heightSegments:a,depthSegments:c};const h=this;o=Math.floor(o),a=Math.floor(a),c=Math.floor(c);const f=[],d=[],m=[],g=[];let v=0,_=0;M("z","y","x",-1,-1,i,t,e,c,a,0),M("z","y","x",1,-1,i,t,-e,c,a,1),M("x","z","y",1,1,e,i,t,o,c,2),M("x","z","y",1,-1,e,i,-t,o,c,3),M("x","y","z",1,-1,e,t,i,o,a,4),M("x","y","z",-1,-1,e,t,-i,o,a,5),this.setIndex(f),this.setAttribute("position",new Nt(d,3)),this.setAttribute("normal",new Nt(m,3)),this.setAttribute("uv",new Nt(g,2));function M(w,S,y,N,b,A,W,U,z,V,L){const R=A/z,B=W/V,ee=A/2,K=W/2,oe=U/2,he=z+1,se=V+1;let ue=0,G=0;const ce=new F;for(let ae=0;ae<se;ae++){const k=ae*B-K;for(let ie=0;ie<he;ie++){const ze=ie*R-ee;ce[w]=ze*N,ce[S]=k*b,ce[y]=oe,d.push(ce.x,ce.y,ce.z),ce[w]=0,ce[S]=0,ce[y]=U>0?1:-1,m.push(ce.x,ce.y,ce.z),g.push(ie/z),g.push(1-ae/V),ue+=1}}for(let ae=0;ae<V;ae++)for(let k=0;k<z;k++){const ie=v+k+he*ae,ze=v+k+he*(ae+1),Q=v+(k+1)+he*(ae+1),de=v+(k+1)+he*ae;f.push(ie,ze,de),f.push(ze,Q,de),G+=6}h.addGroup(_,G,L),_+=G,v+=ue}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Lr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function lo(s){const e={};for(const t in s){e[t]={};for(const i in s[t]){const o=s[t][i];o&&(o.isColor||o.isMatrix3||o.isMatrix4||o.isVector2||o.isVector3||o.isVector4||o.isTexture||o.isQuaternion)?o.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=o.clone():Array.isArray(o)?e[t][i]=o.slice():e[t][i]=o}}return e}function Tn(s){const e={};for(let t=0;t<s.length;t++){const i=lo(s[t]);for(const o in i)e[o]=i[o]}return e}function j_(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function Rg(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Tt.workingColorSpace}const X_={clone:lo,merge:Tn};var Y_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,q_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Nr extends Pr{static get type(){return"ShaderMaterial"}constructor(e){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Y_,this.fragmentShader=q_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=lo(e.uniforms),this.uniformsGroups=j_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const o in this.uniforms){const c=this.uniforms[o].value;c&&c.isTexture?t.uniforms[o]={type:"t",value:c.toJSON(e).uuid}:c&&c.isColor?t.uniforms[o]={type:"c",value:c.getHex()}:c&&c.isVector2?t.uniforms[o]={type:"v2",value:c.toArray()}:c&&c.isVector3?t.uniforms[o]={type:"v3",value:c.toArray()}:c&&c.isVector4?t.uniforms[o]={type:"v4",value:c.toArray()}:c&&c.isMatrix3?t.uniforms[o]={type:"m3",value:c.toArray()}:c&&c.isMatrix4?t.uniforms[o]={type:"m4",value:c.toArray()}:t.uniforms[o]={value:c}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const o in this.extensions)this.extensions[o]===!0&&(i[o]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class bg extends ln{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Lt,this.projectionMatrix=new Lt,this.projectionMatrixInverse=new Lt,this.coordinateSystem=Ki}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Tr=new F,r0=new Ie,s0=new Ie;class On extends bg{constructor(e=50,t=1,i=.1,o=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=o,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=bf*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(sh*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return bf*2*Math.atan(Math.tan(sh*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Tr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Tr.x,Tr.y).multiplyScalar(-e/Tr.z),Tr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Tr.x,Tr.y).multiplyScalar(-e/Tr.z)}getViewSize(e,t){return this.getViewBounds(e,r0,s0),t.subVectors(s0,r0)}setViewOffset(e,t,i,o,a,c){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=o,this.view.width=a,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(sh*.5*this.fov)/this.zoom,i=2*t,o=this.aspect*i,a=-.5*o;const c=this.view;if(this.view!==null&&this.view.enabled){const f=c.fullWidth,d=c.fullHeight;a+=c.offsetX*o/f,t-=c.offsetY*i/d,o*=c.width/f,i*=c.height/d}const h=this.filmOffset;h!==0&&(a+=e*h/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+o,t,t-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ys=-90,qs=1;class $_ extends ln{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const o=new On(Ys,qs,e,t);o.layers=this.layers,this.add(o);const a=new On(Ys,qs,e,t);a.layers=this.layers,this.add(a);const c=new On(Ys,qs,e,t);c.layers=this.layers,this.add(c);const h=new On(Ys,qs,e,t);h.layers=this.layers,this.add(h);const f=new On(Ys,qs,e,t);f.layers=this.layers,this.add(f);const d=new On(Ys,qs,e,t);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,o,a,c,h,f]=t;for(const d of t)this.remove(d);if(e===Ki)i.up.set(0,1,0),i.lookAt(1,0,0),o.up.set(0,1,0),o.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),c.up.set(0,0,1),c.lookAt(0,-1,0),h.up.set(0,1,0),h.lookAt(0,0,1),f.up.set(0,1,0),f.lookAt(0,0,-1);else if(e===sc)i.up.set(0,-1,0),i.lookAt(-1,0,0),o.up.set(0,-1,0),o.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),c.up.set(0,0,-1),c.lookAt(0,-1,0),h.up.set(0,-1,0),h.lookAt(0,0,1),f.up.set(0,-1,0),f.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const d of t)this.add(d),d.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:o}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,c,h,f,d,m]=this.children,g=e.getRenderTarget(),v=e.getActiveCubeFace(),_=e.getActiveMipmapLevel(),M=e.xr.enabled;e.xr.enabled=!1;const w=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,o),e.render(t,a),e.setRenderTarget(i,1,o),e.render(t,c),e.setRenderTarget(i,2,o),e.render(t,h),e.setRenderTarget(i,3,o),e.render(t,f),e.setRenderTarget(i,4,o),e.render(t,d),i.texture.generateMipmaps=w,e.setRenderTarget(i,5,o),e.render(t,m),e.setRenderTarget(g,v,_),e.xr.enabled=M,i.texture.needsPMREMUpdate=!0}}class Pg extends An{constructor(e,t,i,o,a,c,h,f,d,m){e=e!==void 0?e:[],t=t!==void 0?t:ro,super(e,t,i,o,a,c,h,f,d,m),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class K_ extends cs{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},o=[i,i,i,i,i,i];this.texture=new Pg(o,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ri}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},o=new Lr(5,5,5),a=new Nr({name:"CubemapFromEquirect",uniforms:lo(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:kn,blending:Cr});a.uniforms.tEquirect.value=t;const c=new Ut(o,a),h=t.minFilter;return t.minFilter===os&&(t.minFilter=Ri),new $_(1,10,this).update(e,c),t.minFilter=h,c.geometry.dispose(),c.material.dispose(),this}clear(e,t,i,o){const a=e.getRenderTarget();for(let c=0;c<6;c++)e.setRenderTarget(this,c),e.clear(t,i,o);e.setRenderTarget(a)}}const Ah=new F,Z_=new F,J_=new mt;class ts{constructor(e=new F(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,o){return this.normal.set(e,t,i),this.constant=o,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const o=Ah.subVectors(i,t).cross(Z_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(o,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(Ah),o=this.normal.dot(i);if(o===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/o;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||J_.getNormalMatrix(e),o=this.coplanarPoint(Ah).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-o.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Zr=new po,Hl=new F;class Xf{constructor(e=new ts,t=new ts,i=new ts,o=new ts,a=new ts,c=new ts){this.planes=[e,t,i,o,a,c]}set(e,t,i,o,a,c){const h=this.planes;return h[0].copy(e),h[1].copy(t),h[2].copy(i),h[3].copy(o),h[4].copy(a),h[5].copy(c),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Ki){const i=this.planes,o=e.elements,a=o[0],c=o[1],h=o[2],f=o[3],d=o[4],m=o[5],g=o[6],v=o[7],_=o[8],M=o[9],w=o[10],S=o[11],y=o[12],N=o[13],b=o[14],A=o[15];if(i[0].setComponents(f-a,v-d,S-_,A-y).normalize(),i[1].setComponents(f+a,v+d,S+_,A+y).normalize(),i[2].setComponents(f+c,v+m,S+M,A+N).normalize(),i[3].setComponents(f-c,v-m,S-M,A-N).normalize(),i[4].setComponents(f-h,v-g,S-w,A-b).normalize(),t===Ki)i[5].setComponents(f+h,v+g,S+w,A+b).normalize();else if(t===sc)i[5].setComponents(h,g,w,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Zr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Zr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Zr)}intersectsSprite(e){return Zr.center.set(0,0,0),Zr.radius=.7071067811865476,Zr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Zr)}intersectsSphere(e){const t=this.planes,i=e.center,o=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<o)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const o=t[i];if(Hl.x=o.normal.x>0?e.max.x:e.min.x,Hl.y=o.normal.y>0?e.max.y:e.min.y,Hl.z=o.normal.z>0?e.max.z:e.min.z,o.distanceToPoint(Hl)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Lg(){let s=null,e=!1,t=null,i=null;function o(a,c){t(a,c),i=s.requestAnimationFrame(o)}return{start:function(){e!==!0&&t!==null&&(i=s.requestAnimationFrame(o),e=!0)},stop:function(){s.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){s=a}}}function Q_(s){const e=new WeakMap;function t(h,f){const d=h.array,m=h.usage,g=d.byteLength,v=s.createBuffer();s.bindBuffer(f,v),s.bufferData(f,d,m),h.onUploadCallback();let _;if(d instanceof Float32Array)_=s.FLOAT;else if(d instanceof Uint16Array)h.isFloat16BufferAttribute?_=s.HALF_FLOAT:_=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)_=s.SHORT;else if(d instanceof Uint32Array)_=s.UNSIGNED_INT;else if(d instanceof Int32Array)_=s.INT;else if(d instanceof Int8Array)_=s.BYTE;else if(d instanceof Uint8Array)_=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)_=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:v,type:_,bytesPerElement:d.BYTES_PER_ELEMENT,version:h.version,size:g}}function i(h,f,d){const m=f.array,g=f.updateRanges;if(s.bindBuffer(d,h),g.length===0)s.bufferSubData(d,0,m);else{g.sort((_,M)=>_.start-M.start);let v=0;for(let _=1;_<g.length;_++){const M=g[v],w=g[_];w.start<=M.start+M.count+1?M.count=Math.max(M.count,w.start+w.count-M.start):(++v,g[v]=w)}g.length=v+1;for(let _=0,M=g.length;_<M;_++){const w=g[_];s.bufferSubData(d,w.start*m.BYTES_PER_ELEMENT,m,w.start,w.count)}f.clearUpdateRanges()}f.onUploadCallback()}function o(h){return h.isInterleavedBufferAttribute&&(h=h.data),e.get(h)}function a(h){h.isInterleavedBufferAttribute&&(h=h.data);const f=e.get(h);f&&(s.deleteBuffer(f.buffer),e.delete(h))}function c(h,f){if(h.isInterleavedBufferAttribute&&(h=h.data),h.isGLBufferAttribute){const m=e.get(h);(!m||m.version<h.version)&&e.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}const d=e.get(h);if(d===void 0)e.set(h,t(h,f));else if(d.version<h.version){if(d.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(d.buffer,h,f),d.version=h.version}}return{get:o,remove:a,update:c}}class fc extends en{constructor(e=1,t=1,i=1,o=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:o};const a=e/2,c=t/2,h=Math.floor(i),f=Math.floor(o),d=h+1,m=f+1,g=e/h,v=t/f,_=[],M=[],w=[],S=[];for(let y=0;y<m;y++){const N=y*v-c;for(let b=0;b<d;b++){const A=b*g-a;M.push(A,-N,0),w.push(0,0,1),S.push(b/h),S.push(1-y/f)}}for(let y=0;y<f;y++)for(let N=0;N<h;N++){const b=N+d*y,A=N+d*(y+1),W=N+1+d*(y+1),U=N+1+d*y;_.push(b,A,U),_.push(A,W,U)}this.setIndex(_),this.setAttribute("position",new Nt(M,3)),this.setAttribute("normal",new Nt(w,3)),this.setAttribute("uv",new Nt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fc(e.width,e.height,e.widthSegments,e.heightSegments)}}var ey=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ty=`#ifdef USE_ALPHAHASH
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
#endif`,ny=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,iy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ry=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,sy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,oy=`#ifdef USE_AOMAP
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
#endif`,ay=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ly=`#ifdef USE_BATCHING
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
#endif`,cy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,uy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,hy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,fy=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,dy=`#ifdef USE_IRIDESCENCE
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
#endif`,py=`#ifdef USE_BUMPMAP
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
#endif`,my=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,gy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,_y=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,yy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Sy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,My=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Ey=`#define PI 3.141592653589793
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
} // validated`,wy=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Ty=`vec3 transformedNormal = objectNormal;
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
#endif`,Ay=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Cy=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Ry=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,by=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Py="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ly=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ny=`#ifdef USE_ENVMAP
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
#endif`,Iy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Dy=`#ifdef USE_ENVMAP
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
#endif`,Uy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Fy=`#ifdef USE_ENVMAP
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
#endif`,Oy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zy=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,ky=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,By=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vy=`#ifdef USE_GRADIENTMAP
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
}`,Hy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Gy=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Wy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,jy=`uniform bool receiveShadow;
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
#endif`,Xy=`#ifdef USE_ENVMAP
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
#endif`,Yy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,qy=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,$y=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ky=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Zy=`PhysicalMaterial material;
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
#endif`,Jy=`struct PhysicalMaterial {
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
}`,Qy=`
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
#endif`,e1=`#if defined( RE_IndirectDiffuse )
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
#endif`,t1=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,n1=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,i1=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,r1=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,s1=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,o1=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,a1=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,l1=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,c1=`#if defined( USE_POINTS_UV )
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
#endif`,u1=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,h1=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,f1=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,d1=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,p1=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,m1=`#ifdef USE_MORPHTARGETS
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
#endif`,g1=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,v1=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,x1=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,_1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,y1=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,S1=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,M1=`#ifdef USE_NORMALMAP
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
#endif`,E1=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,w1=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,T1=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,A1=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,C1=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,R1=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,b1=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,P1=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,L1=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,N1=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,I1=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,D1=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,U1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,F1=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,O1=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,z1=`float getShadowMask() {
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
}`,k1=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,B1=`#ifdef USE_SKINNING
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
#endif`,V1=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,H1=`#ifdef USE_SKINNING
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
#endif`,G1=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,W1=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,j1=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,X1=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Y1=`#ifdef USE_TRANSMISSION
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
#endif`,q1=`#ifdef USE_TRANSMISSION
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
#endif`,$1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,K1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Z1=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,J1=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Q1=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,eS=`uniform sampler2D t2D;
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
}`,tS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,nS=`#ifdef ENVMAP_TYPE_CUBE
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
}`,iS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sS=`#include <common>
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
}`,oS=`#if DEPTH_PACKING == 3200
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
}`,aS=`#define DISTANCE
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
}`,lS=`#define DISTANCE
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
}`,cS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,uS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hS=`uniform float scale;
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
}`,fS=`uniform vec3 diffuse;
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
}`,dS=`#include <common>
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
}`,pS=`uniform vec3 diffuse;
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
}`,mS=`#define LAMBERT
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
}`,gS=`#define LAMBERT
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
}`,vS=`#define MATCAP
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
}`,xS=`#define MATCAP
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
}`,_S=`#define NORMAL
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
}`,yS=`#define NORMAL
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
}`,SS=`#define PHONG
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
}`,MS=`#define PHONG
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
}`,ES=`#define STANDARD
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
}`,wS=`#define STANDARD
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
}`,TS=`#define TOON
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
}`,AS=`#define TOON
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
}`,CS=`uniform float size;
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
}`,RS=`uniform vec3 diffuse;
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
}`,bS=`#include <common>
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
}`,PS=`uniform vec3 color;
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
}`,LS=`uniform float rotation;
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
}`,NS=`uniform vec3 diffuse;
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
}`,gt={alphahash_fragment:ey,alphahash_pars_fragment:ty,alphamap_fragment:ny,alphamap_pars_fragment:iy,alphatest_fragment:ry,alphatest_pars_fragment:sy,aomap_fragment:oy,aomap_pars_fragment:ay,batching_pars_vertex:ly,batching_vertex:cy,begin_vertex:uy,beginnormal_vertex:hy,bsdfs:fy,iridescence_fragment:dy,bumpmap_pars_fragment:py,clipping_planes_fragment:my,clipping_planes_pars_fragment:gy,clipping_planes_pars_vertex:vy,clipping_planes_vertex:xy,color_fragment:_y,color_pars_fragment:yy,color_pars_vertex:Sy,color_vertex:My,common:Ey,cube_uv_reflection_fragment:wy,defaultnormal_vertex:Ty,displacementmap_pars_vertex:Ay,displacementmap_vertex:Cy,emissivemap_fragment:Ry,emissivemap_pars_fragment:by,colorspace_fragment:Py,colorspace_pars_fragment:Ly,envmap_fragment:Ny,envmap_common_pars_fragment:Iy,envmap_pars_fragment:Dy,envmap_pars_vertex:Uy,envmap_physical_pars_fragment:Xy,envmap_vertex:Fy,fog_vertex:Oy,fog_pars_vertex:zy,fog_fragment:ky,fog_pars_fragment:By,gradientmap_pars_fragment:Vy,lightmap_pars_fragment:Hy,lights_lambert_fragment:Gy,lights_lambert_pars_fragment:Wy,lights_pars_begin:jy,lights_toon_fragment:Yy,lights_toon_pars_fragment:qy,lights_phong_fragment:$y,lights_phong_pars_fragment:Ky,lights_physical_fragment:Zy,lights_physical_pars_fragment:Jy,lights_fragment_begin:Qy,lights_fragment_maps:e1,lights_fragment_end:t1,logdepthbuf_fragment:n1,logdepthbuf_pars_fragment:i1,logdepthbuf_pars_vertex:r1,logdepthbuf_vertex:s1,map_fragment:o1,map_pars_fragment:a1,map_particle_fragment:l1,map_particle_pars_fragment:c1,metalnessmap_fragment:u1,metalnessmap_pars_fragment:h1,morphinstance_vertex:f1,morphcolor_vertex:d1,morphnormal_vertex:p1,morphtarget_pars_vertex:m1,morphtarget_vertex:g1,normal_fragment_begin:v1,normal_fragment_maps:x1,normal_pars_fragment:_1,normal_pars_vertex:y1,normal_vertex:S1,normalmap_pars_fragment:M1,clearcoat_normal_fragment_begin:E1,clearcoat_normal_fragment_maps:w1,clearcoat_pars_fragment:T1,iridescence_pars_fragment:A1,opaque_fragment:C1,packing:R1,premultiplied_alpha_fragment:b1,project_vertex:P1,dithering_fragment:L1,dithering_pars_fragment:N1,roughnessmap_fragment:I1,roughnessmap_pars_fragment:D1,shadowmap_pars_fragment:U1,shadowmap_pars_vertex:F1,shadowmap_vertex:O1,shadowmask_pars_fragment:z1,skinbase_vertex:k1,skinning_pars_vertex:B1,skinning_vertex:V1,skinnormal_vertex:H1,specularmap_fragment:G1,specularmap_pars_fragment:W1,tonemapping_fragment:j1,tonemapping_pars_fragment:X1,transmission_fragment:Y1,transmission_pars_fragment:q1,uv_pars_fragment:$1,uv_pars_vertex:K1,uv_vertex:Z1,worldpos_vertex:J1,background_vert:Q1,background_frag:eS,backgroundCube_vert:tS,backgroundCube_frag:nS,cube_vert:iS,cube_frag:rS,depth_vert:sS,depth_frag:oS,distanceRGBA_vert:aS,distanceRGBA_frag:lS,equirect_vert:cS,equirect_frag:uS,linedashed_vert:hS,linedashed_frag:fS,meshbasic_vert:dS,meshbasic_frag:pS,meshlambert_vert:mS,meshlambert_frag:gS,meshmatcap_vert:vS,meshmatcap_frag:xS,meshnormal_vert:_S,meshnormal_frag:yS,meshphong_vert:SS,meshphong_frag:MS,meshphysical_vert:ES,meshphysical_frag:wS,meshtoon_vert:TS,meshtoon_frag:AS,points_vert:CS,points_frag:RS,shadow_vert:bS,shadow_frag:PS,sprite_vert:LS,sprite_frag:NS},De={common:{diffuse:{value:new yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new mt},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new mt}},envmap:{envMap:{value:null},envMapRotation:{value:new mt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new mt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new mt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new mt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new mt},normalScale:{value:new Ie(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new mt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new mt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new mt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new mt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0},uvTransform:{value:new mt}},sprite:{diffuse:{value:new yt(16777215)},opacity:{value:1},center:{value:new Ie(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new mt},alphaMap:{value:null},alphaMapTransform:{value:new mt},alphaTest:{value:0}}},Ci={basic:{uniforms:Tn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.fog]),vertexShader:gt.meshbasic_vert,fragmentShader:gt.meshbasic_frag},lambert:{uniforms:Tn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new yt(0)}}]),vertexShader:gt.meshlambert_vert,fragmentShader:gt.meshlambert_frag},phong:{uniforms:Tn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new yt(0)},specular:{value:new yt(1118481)},shininess:{value:30}}]),vertexShader:gt.meshphong_vert,fragmentShader:gt.meshphong_frag},standard:{uniforms:Tn([De.common,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.roughnessmap,De.metalnessmap,De.fog,De.lights,{emissive:{value:new yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag},toon:{uniforms:Tn([De.common,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.gradientmap,De.fog,De.lights,{emissive:{value:new yt(0)}}]),vertexShader:gt.meshtoon_vert,fragmentShader:gt.meshtoon_frag},matcap:{uniforms:Tn([De.common,De.bumpmap,De.normalmap,De.displacementmap,De.fog,{matcap:{value:null}}]),vertexShader:gt.meshmatcap_vert,fragmentShader:gt.meshmatcap_frag},points:{uniforms:Tn([De.points,De.fog]),vertexShader:gt.points_vert,fragmentShader:gt.points_frag},dashed:{uniforms:Tn([De.common,De.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:gt.linedashed_vert,fragmentShader:gt.linedashed_frag},depth:{uniforms:Tn([De.common,De.displacementmap]),vertexShader:gt.depth_vert,fragmentShader:gt.depth_frag},normal:{uniforms:Tn([De.common,De.bumpmap,De.normalmap,De.displacementmap,{opacity:{value:1}}]),vertexShader:gt.meshnormal_vert,fragmentShader:gt.meshnormal_frag},sprite:{uniforms:Tn([De.sprite,De.fog]),vertexShader:gt.sprite_vert,fragmentShader:gt.sprite_frag},background:{uniforms:{uvTransform:{value:new mt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:gt.background_vert,fragmentShader:gt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new mt}},vertexShader:gt.backgroundCube_vert,fragmentShader:gt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:gt.cube_vert,fragmentShader:gt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:gt.equirect_vert,fragmentShader:gt.equirect_frag},distanceRGBA:{uniforms:Tn([De.common,De.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:gt.distanceRGBA_vert,fragmentShader:gt.distanceRGBA_frag},shadow:{uniforms:Tn([De.lights,De.fog,{color:{value:new yt(0)},opacity:{value:1}}]),vertexShader:gt.shadow_vert,fragmentShader:gt.shadow_frag}};Ci.physical={uniforms:Tn([Ci.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new mt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new mt},clearcoatNormalScale:{value:new Ie(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new mt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new mt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new mt},sheen:{value:0},sheenColor:{value:new yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new mt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new mt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new mt},transmissionSamplerSize:{value:new Ie},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new mt},attenuationDistance:{value:0},attenuationColor:{value:new yt(0)},specularColor:{value:new yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new mt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new mt},anisotropyVector:{value:new Ie},anisotropyMap:{value:null},anisotropyMapTransform:{value:new mt}}]),vertexShader:gt.meshphysical_vert,fragmentShader:gt.meshphysical_frag};const Gl={r:0,b:0,g:0},Jr=new _i,IS=new Lt;function DS(s,e,t,i,o,a,c){const h=new yt(0);let f=a===!0?0:1,d,m,g=null,v=0,_=null;function M(N){let b=N.isScene===!0?N.background:null;return b&&b.isTexture&&(b=(N.backgroundBlurriness>0?t:e).get(b)),b}function w(N){let b=!1;const A=M(N);A===null?y(h,f):A&&A.isColor&&(y(A,1),b=!0);const W=s.xr.getEnvironmentBlendMode();W==="additive"?i.buffers.color.setClear(0,0,0,1,c):W==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,c),(s.autoClear||b)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function S(N,b){const A=M(b);A&&(A.isCubeTexture||A.mapping===uc)?(m===void 0&&(m=new Ut(new Lr(1,1,1),new Nr({name:"BackgroundCubeMaterial",uniforms:lo(Ci.backgroundCube.uniforms),vertexShader:Ci.backgroundCube.vertexShader,fragmentShader:Ci.backgroundCube.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),m.geometry.deleteAttribute("normal"),m.geometry.deleteAttribute("uv"),m.onBeforeRender=function(W,U,z){this.matrixWorld.copyPosition(z.matrixWorld)},Object.defineProperty(m.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),o.update(m)),Jr.copy(b.backgroundRotation),Jr.x*=-1,Jr.y*=-1,Jr.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(Jr.y*=-1,Jr.z*=-1),m.material.uniforms.envMap.value=A,m.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,m.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,m.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,m.material.uniforms.backgroundRotation.value.setFromMatrix4(IS.makeRotationFromEuler(Jr)),m.material.toneMapped=Tt.getTransfer(A.colorSpace)!==It,(g!==A||v!==A.version||_!==s.toneMapping)&&(m.material.needsUpdate=!0,g=A,v=A.version,_=s.toneMapping),m.layers.enableAll(),N.unshift(m,m.geometry,m.material,0,0,null)):A&&A.isTexture&&(d===void 0&&(d=new Ut(new fc(2,2),new Nr({name:"BackgroundMaterial",uniforms:lo(Ci.background.uniforms),vertexShader:Ci.background.vertexShader,fragmentShader:Ci.background.fragmentShader,side:br,depthTest:!1,depthWrite:!1,fog:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),o.update(d)),d.material.uniforms.t2D.value=A,d.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,d.material.toneMapped=Tt.getTransfer(A.colorSpace)!==It,A.matrixAutoUpdate===!0&&A.updateMatrix(),d.material.uniforms.uvTransform.value.copy(A.matrix),(g!==A||v!==A.version||_!==s.toneMapping)&&(d.material.needsUpdate=!0,g=A,v=A.version,_=s.toneMapping),d.layers.enableAll(),N.unshift(d,d.geometry,d.material,0,0,null))}function y(N,b){N.getRGB(Gl,Rg(s)),i.buffers.color.setClear(Gl.r,Gl.g,Gl.b,b,c)}return{getClearColor:function(){return h},setClearColor:function(N,b=1){h.set(N),f=b,y(h,f)},getClearAlpha:function(){return f},setClearAlpha:function(N){f=N,y(h,f)},render:w,addToRenderList:S}}function US(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),i={},o=v(null);let a=o,c=!1;function h(R,B,ee,K,oe){let he=!1;const se=g(K,ee,B);a!==se&&(a=se,d(a.object)),he=_(R,K,ee,oe),he&&M(R,K,ee,oe),oe!==null&&e.update(oe,s.ELEMENT_ARRAY_BUFFER),(he||c)&&(c=!1,A(R,B,ee,K),oe!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(oe).buffer))}function f(){return s.createVertexArray()}function d(R){return s.bindVertexArray(R)}function m(R){return s.deleteVertexArray(R)}function g(R,B,ee){const K=ee.wireframe===!0;let oe=i[R.id];oe===void 0&&(oe={},i[R.id]=oe);let he=oe[B.id];he===void 0&&(he={},oe[B.id]=he);let se=he[K];return se===void 0&&(se=v(f()),he[K]=se),se}function v(R){const B=[],ee=[],K=[];for(let oe=0;oe<t;oe++)B[oe]=0,ee[oe]=0,K[oe]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:ee,attributeDivisors:K,object:R,attributes:{},index:null}}function _(R,B,ee,K){const oe=a.attributes,he=B.attributes;let se=0;const ue=ee.getAttributes();for(const G in ue)if(ue[G].location>=0){const ae=oe[G];let k=he[G];if(k===void 0&&(G==="instanceMatrix"&&R.instanceMatrix&&(k=R.instanceMatrix),G==="instanceColor"&&R.instanceColor&&(k=R.instanceColor)),ae===void 0||ae.attribute!==k||k&&ae.data!==k.data)return!0;se++}return a.attributesNum!==se||a.index!==K}function M(R,B,ee,K){const oe={},he=B.attributes;let se=0;const ue=ee.getAttributes();for(const G in ue)if(ue[G].location>=0){let ae=he[G];ae===void 0&&(G==="instanceMatrix"&&R.instanceMatrix&&(ae=R.instanceMatrix),G==="instanceColor"&&R.instanceColor&&(ae=R.instanceColor));const k={};k.attribute=ae,ae&&ae.data&&(k.data=ae.data),oe[G]=k,se++}a.attributes=oe,a.attributesNum=se,a.index=K}function w(){const R=a.newAttributes;for(let B=0,ee=R.length;B<ee;B++)R[B]=0}function S(R){y(R,0)}function y(R,B){const ee=a.newAttributes,K=a.enabledAttributes,oe=a.attributeDivisors;ee[R]=1,K[R]===0&&(s.enableVertexAttribArray(R),K[R]=1),oe[R]!==B&&(s.vertexAttribDivisor(R,B),oe[R]=B)}function N(){const R=a.newAttributes,B=a.enabledAttributes;for(let ee=0,K=B.length;ee<K;ee++)B[ee]!==R[ee]&&(s.disableVertexAttribArray(ee),B[ee]=0)}function b(R,B,ee,K,oe,he,se){se===!0?s.vertexAttribIPointer(R,B,ee,oe,he):s.vertexAttribPointer(R,B,ee,K,oe,he)}function A(R,B,ee,K){w();const oe=K.attributes,he=ee.getAttributes(),se=B.defaultAttributeValues;for(const ue in he){const G=he[ue];if(G.location>=0){let ce=oe[ue];if(ce===void 0&&(ue==="instanceMatrix"&&R.instanceMatrix&&(ce=R.instanceMatrix),ue==="instanceColor"&&R.instanceColor&&(ce=R.instanceColor)),ce!==void 0){const ae=ce.normalized,k=ce.itemSize,ie=e.get(ce);if(ie===void 0)continue;const ze=ie.buffer,Q=ie.type,de=ie.bytesPerElement,we=Q===s.INT||Q===s.UNSIGNED_INT||ce.gpuType===kf;if(ce.isInterleavedBufferAttribute){const ge=ce.data,be=ge.stride,Be=ce.offset;if(ge.isInstancedInterleavedBuffer){for(let Ke=0;Ke<G.locationSize;Ke++)y(G.location+Ke,ge.meshPerAttribute);R.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=ge.meshPerAttribute*ge.count)}else for(let Ke=0;Ke<G.locationSize;Ke++)S(G.location+Ke);s.bindBuffer(s.ARRAY_BUFFER,ze);for(let Ke=0;Ke<G.locationSize;Ke++)b(G.location+Ke,k/G.locationSize,Q,ae,be*de,(Be+k/G.locationSize*Ke)*de,we)}else{if(ce.isInstancedBufferAttribute){for(let ge=0;ge<G.locationSize;ge++)y(G.location+ge,ce.meshPerAttribute);R.isInstancedMesh!==!0&&K._maxInstanceCount===void 0&&(K._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ge=0;ge<G.locationSize;ge++)S(G.location+ge);s.bindBuffer(s.ARRAY_BUFFER,ze);for(let ge=0;ge<G.locationSize;ge++)b(G.location+ge,k/G.locationSize,Q,ae,k*de,k/G.locationSize*ge*de,we)}}else if(se!==void 0){const ae=se[ue];if(ae!==void 0)switch(ae.length){case 2:s.vertexAttrib2fv(G.location,ae);break;case 3:s.vertexAttrib3fv(G.location,ae);break;case 4:s.vertexAttrib4fv(G.location,ae);break;default:s.vertexAttrib1fv(G.location,ae)}}}}N()}function W(){V();for(const R in i){const B=i[R];for(const ee in B){const K=B[ee];for(const oe in K)m(K[oe].object),delete K[oe];delete B[ee]}delete i[R]}}function U(R){if(i[R.id]===void 0)return;const B=i[R.id];for(const ee in B){const K=B[ee];for(const oe in K)m(K[oe].object),delete K[oe];delete B[ee]}delete i[R.id]}function z(R){for(const B in i){const ee=i[B];if(ee[R.id]===void 0)continue;const K=ee[R.id];for(const oe in K)m(K[oe].object),delete K[oe];delete ee[R.id]}}function V(){L(),c=!0,a!==o&&(a=o,d(a.object))}function L(){o.geometry=null,o.program=null,o.wireframe=!1}return{setup:h,reset:V,resetDefaultState:L,dispose:W,releaseStatesOfGeometry:U,releaseStatesOfProgram:z,initAttributes:w,enableAttribute:S,disableUnusedAttributes:N}}function FS(s,e,t){let i;function o(d){i=d}function a(d,m){s.drawArrays(i,d,m),t.update(m,i,1)}function c(d,m,g){g!==0&&(s.drawArraysInstanced(i,d,m,g),t.update(m,i,g))}function h(d,m,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,d,0,m,0,g);let _=0;for(let M=0;M<g;M++)_+=m[M];t.update(_,i,1)}function f(d,m,g,v){if(g===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let M=0;M<d.length;M++)c(d[M],m[M],v[M]);else{_.multiDrawArraysInstancedWEBGL(i,d,0,m,0,v,0,g);let M=0;for(let w=0;w<g;w++)M+=m[w]*v[w];t.update(M,i,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function OS(s,e,t,i){let o;function a(){if(o!==void 0)return o;if(e.has("EXT_texture_filter_anisotropic")===!0){const z=e.get("EXT_texture_filter_anisotropic");o=s.getParameter(z.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else o=0;return o}function c(z){return!(z!==xi&&i.convert(z)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function h(z){const V=z===xa&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(z!==Ji&&i.convert(z)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&z!==bi&&!V)}function f(z){if(z==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";z="mediump"}return z==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp";const m=f(d);m!==d&&(console.warn("THREE.WebGLRenderer:",d,"not supported, using",m,"instead."),d=m);const g=t.logarithmicDepthBuffer===!0,v=t.reverseDepthBuffer===!0&&e.has("EXT_clip_control"),_=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),M=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),w=s.getParameter(s.MAX_TEXTURE_SIZE),S=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),y=s.getParameter(s.MAX_VERTEX_ATTRIBS),N=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),b=s.getParameter(s.MAX_VARYING_VECTORS),A=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),W=M>0,U=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:f,textureFormatReadable:c,textureTypeReadable:h,precision:d,logarithmicDepthBuffer:g,reverseDepthBuffer:v,maxTextures:_,maxVertexTextures:M,maxTextureSize:w,maxCubemapSize:S,maxAttributes:y,maxVertexUniforms:N,maxVaryings:b,maxFragmentUniforms:A,vertexTextures:W,maxSamples:U}}function zS(s){const e=this;let t=null,i=0,o=!1,a=!1;const c=new ts,h=new mt,f={value:null,needsUpdate:!1};this.uniform=f,this.numPlanes=0,this.numIntersection=0,this.init=function(g,v){const _=g.length!==0||v||i!==0||o;return o=v,i=g.length,_},this.beginShadows=function(){a=!0,m(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(g,v){t=m(g,v,0)},this.setState=function(g,v,_){const M=g.clippingPlanes,w=g.clipIntersection,S=g.clipShadows,y=s.get(g);if(!o||M===null||M.length===0||a&&!S)a?m(null):d();else{const N=a?0:i,b=N*4;let A=y.clippingState||null;f.value=A,A=m(M,v,b,_);for(let W=0;W!==b;++W)A[W]=t[W];y.clippingState=A,this.numIntersection=w?this.numPlanes:0,this.numPlanes+=N}};function d(){f.value!==t&&(f.value=t,f.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function m(g,v,_,M){const w=g!==null?g.length:0;let S=null;if(w!==0){if(S=f.value,M!==!0||S===null){const y=_+w*4,N=v.matrixWorldInverse;h.getNormalMatrix(N),(S===null||S.length<y)&&(S=new Float32Array(y));for(let b=0,A=_;b!==w;++b,A+=4)c.copy(g[b]).applyMatrix4(N,h),c.normal.toArray(S,A),S[A+3]=c.constant}f.value=S,f.needsUpdate=!0}return e.numPlanes=w,e.numIntersection=0,S}}function kS(s){let e=new WeakMap;function t(c,h){return h===Jh?c.mapping=ro:h===Qh&&(c.mapping=so),c}function i(c){if(c&&c.isTexture){const h=c.mapping;if(h===Jh||h===Qh)if(e.has(c)){const f=e.get(c).texture;return t(f,c.mapping)}else{const f=c.image;if(f&&f.height>0){const d=new K_(f.height);return d.fromEquirectangularTexture(s,c),e.set(c,d),c.addEventListener("dispose",o),t(d.texture,c.mapping)}else return null}}return c}function o(c){const h=c.target;h.removeEventListener("dispose",o);const f=e.get(h);f!==void 0&&(e.delete(h),f.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}class Ng extends bg{constructor(e=-1,t=1,i=1,o=-1,a=.1,c=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=o,this.near=a,this.far=c,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,o,a,c){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=o,this.view.width=a,this.view.height=c,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,o=(this.top+this.bottom)/2;let a=i-e,c=i+e,h=o+t,f=o-t;if(this.view!==null&&this.view.enabled){const d=(this.right-this.left)/this.view.fullWidth/this.zoom,m=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=d*this.view.offsetX,c=a+d*this.view.width,h-=m*this.view.offsetY,f=h-m*this.view.height}this.projectionMatrix.makeOrthographic(a,c,h,f,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Js=4,o0=[.125,.215,.35,.446,.526,.582],rs=20,Ch=new Ng,a0=new yt;let Rh=null,bh=0,Ph=0,Lh=!1;const ns=(1+Math.sqrt(5))/2,$s=1/ns,l0=[new F(-ns,$s,0),new F(ns,$s,0),new F(-$s,0,ns),new F($s,0,ns),new F(0,ns,-$s),new F(0,ns,$s),new F(-1,1,-1),new F(1,1,-1),new F(-1,1,1),new F(1,1,1)];class c0{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,o=100){Rh=this._renderer.getRenderTarget(),bh=this._renderer.getActiveCubeFace(),Ph=this._renderer.getActiveMipmapLevel(),Lh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const a=this._allocateTargets();return a.depthBuffer=!0,this._sceneToCubeUV(e,i,o,a),t>0&&this._blur(a,0,0,t),this._applyPMREM(a),this._cleanup(a),a}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=f0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=h0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Rh,bh,Ph),this._renderer.xr.enabled=Lh,e.scissorTest=!1,Wl(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ro||e.mapping===so?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Rh=this._renderer.getRenderTarget(),bh=this._renderer.getActiveCubeFace(),Ph=this._renderer.getActiveMipmapLevel(),Lh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Ri,minFilter:Ri,generateMipmaps:!1,type:xa,format:xi,colorSpace:co,depthBuffer:!1},o=u0(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=u0(e,t,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=BS(a)),this._blurMaterial=VS(a,e,t)}return o}_compileMaterial(e){const t=new Ut(this._lodPlanes[0],e);this._renderer.compile(t,Ch)}_sceneToCubeUV(e,t,i,o){const h=new On(90,1,t,i),f=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],m=this._renderer,g=m.autoClear,v=m.toneMapping;m.getClearColor(a0),m.toneMapping=Rr,m.autoClear=!1;const _=new as({name:"PMREM.Background",side:kn,depthWrite:!1,depthTest:!1}),M=new Ut(new Lr,_);let w=!1;const S=e.background;S?S.isColor&&(_.color.copy(S),e.background=null,w=!0):(_.color.copy(a0),w=!0);for(let y=0;y<6;y++){const N=y%3;N===0?(h.up.set(0,f[y],0),h.lookAt(d[y],0,0)):N===1?(h.up.set(0,0,f[y]),h.lookAt(0,d[y],0)):(h.up.set(0,f[y],0),h.lookAt(0,0,d[y]));const b=this._cubeSize;Wl(o,N*b,y>2?b:0,b,b),m.setRenderTarget(o),w&&m.render(M,h),m.render(e,h)}M.geometry.dispose(),M.material.dispose(),m.toneMapping=v,m.autoClear=g,e.background=S}_textureToCubeUV(e,t){const i=this._renderer,o=e.mapping===ro||e.mapping===so;o?(this._cubemapMaterial===null&&(this._cubemapMaterial=f0()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=h0());const a=o?this._cubemapMaterial:this._equirectMaterial,c=new Ut(this._lodPlanes[0],a),h=a.uniforms;h.envMap.value=e;const f=this._cubeSize;Wl(t,0,0,3*f,2*f),i.setRenderTarget(t),i.render(c,Ch)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const o=this._lodPlanes.length;for(let a=1;a<o;a++){const c=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),h=l0[(o-a-1)%l0.length];this._blur(e,a-1,a,c,h)}t.autoClear=i}_blur(e,t,i,o,a){const c=this._pingPongRenderTarget;this._halfBlur(e,c,t,i,o,"latitudinal",a),this._halfBlur(c,e,i,i,o,"longitudinal",a)}_halfBlur(e,t,i,o,a,c,h){const f=this._renderer,d=this._blurMaterial;c!=="latitudinal"&&c!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const m=3,g=new Ut(this._lodPlanes[o],d),v=d.uniforms,_=this._sizeLods[i]-1,M=isFinite(a)?Math.PI/(2*_):2*Math.PI/(2*rs-1),w=a/M,S=isFinite(a)?1+Math.floor(m*w):rs;S>rs&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${S} samples when the maximum is set to ${rs}`);const y=[];let N=0;for(let z=0;z<rs;++z){const V=z/w,L=Math.exp(-V*V/2);y.push(L),z===0?N+=L:z<S&&(N+=2*L)}for(let z=0;z<y.length;z++)y[z]=y[z]/N;v.envMap.value=e.texture,v.samples.value=S,v.weights.value=y,v.latitudinal.value=c==="latitudinal",h&&(v.poleAxis.value=h);const{_lodMax:b}=this;v.dTheta.value=M,v.mipInt.value=b-i;const A=this._sizeLods[o],W=3*A*(o>b-Js?o-b+Js:0),U=4*(this._cubeSize-A);Wl(t,W,U,3*A,2*A),f.setRenderTarget(t),f.render(g,Ch)}}function BS(s){const e=[],t=[],i=[];let o=s;const a=s-Js+1+o0.length;for(let c=0;c<a;c++){const h=Math.pow(2,o);t.push(h);let f=1/h;c>s-Js?f=o0[c-s+Js-1]:c===0&&(f=0),i.push(f);const d=1/(h-2),m=-d,g=1+d,v=[m,m,g,m,g,g,m,m,g,g,m,g],_=6,M=6,w=3,S=2,y=1,N=new Float32Array(w*M*_),b=new Float32Array(S*M*_),A=new Float32Array(y*M*_);for(let U=0;U<_;U++){const z=U%3*2/3-1,V=U>2?0:-1,L=[z,V,0,z+2/3,V,0,z+2/3,V+1,0,z,V,0,z+2/3,V+1,0,z,V+1,0];N.set(L,w*M*U),b.set(v,S*M*U);const R=[U,U,U,U,U,U];A.set(R,y*M*U)}const W=new en;W.setAttribute("position",new si(N,w)),W.setAttribute("uv",new si(b,S)),W.setAttribute("faceIndex",new si(A,y)),e.push(W),o>Js&&o--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function u0(s,e,t){const i=new cs(s,e,t);return i.texture.mapping=uc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Wl(s,e,t,i,o){s.viewport.set(e,t,i,o),s.scissor.set(e,t,i,o)}function VS(s,e,t){const i=new Float32Array(rs),o=new F(0,1,0);return new Nr({name:"SphericalGaussianBlur",defines:{n:rs,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:o}},vertexShader:Yf(),fragmentShader:`

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
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function h0(){return new Nr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Yf(),fragmentShader:`

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
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function f0(){return new Nr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Yf(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Cr,depthTest:!1,depthWrite:!1})}function Yf(){return`

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
	`}function HS(s){let e=new WeakMap,t=null;function i(h){if(h&&h.isTexture){const f=h.mapping,d=f===Jh||f===Qh,m=f===ro||f===so;if(d||m){let g=e.get(h);const v=g!==void 0?g.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==v)return t===null&&(t=new c0(s)),g=d?t.fromEquirectangular(h,g):t.fromCubemap(h,g),g.texture.pmremVersion=h.pmremVersion,e.set(h,g),g.texture;if(g!==void 0)return g.texture;{const _=h.image;return d&&_&&_.height>0||m&&_&&o(_)?(t===null&&(t=new c0(s)),g=d?t.fromEquirectangular(h):t.fromCubemap(h),g.texture.pmremVersion=h.pmremVersion,e.set(h,g),h.addEventListener("dispose",a),g.texture):null}}}return h}function o(h){let f=0;const d=6;for(let m=0;m<d;m++)h[m]!==void 0&&f++;return f===d}function a(h){const f=h.target;f.removeEventListener("dispose",a);const d=e.get(f);d!==void 0&&(e.delete(f),d.dispose())}function c(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:c}}function GS(s){const e={};function t(i){if(e[i]!==void 0)return e[i];let o;switch(i){case"WEBGL_depth_texture":o=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":o=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":o=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":o=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:o=s.getExtension(i)}return e[i]=o,o}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const o=t(i);return o===null&&ia("THREE.WebGLRenderer: "+i+" extension not supported."),o}}}function WS(s,e,t,i){const o={},a=new WeakMap;function c(g){const v=g.target;v.index!==null&&e.remove(v.index);for(const M in v.attributes)e.remove(v.attributes[M]);for(const M in v.morphAttributes){const w=v.morphAttributes[M];for(let S=0,y=w.length;S<y;S++)e.remove(w[S])}v.removeEventListener("dispose",c),delete o[v.id];const _=a.get(v);_&&(e.remove(_),a.delete(v)),i.releaseStatesOfGeometry(v),v.isInstancedBufferGeometry===!0&&delete v._maxInstanceCount,t.memory.geometries--}function h(g,v){return o[v.id]===!0||(v.addEventListener("dispose",c),o[v.id]=!0,t.memory.geometries++),v}function f(g){const v=g.attributes;for(const M in v)e.update(v[M],s.ARRAY_BUFFER);const _=g.morphAttributes;for(const M in _){const w=_[M];for(let S=0,y=w.length;S<y;S++)e.update(w[S],s.ARRAY_BUFFER)}}function d(g){const v=[],_=g.index,M=g.attributes.position;let w=0;if(_!==null){const N=_.array;w=_.version;for(let b=0,A=N.length;b<A;b+=3){const W=N[b+0],U=N[b+1],z=N[b+2];v.push(W,U,U,z,z,W)}}else if(M!==void 0){const N=M.array;w=M.version;for(let b=0,A=N.length/3-1;b<A;b+=3){const W=b+0,U=b+1,z=b+2;v.push(W,U,U,z,z,W)}}else return;const S=new(yg(v)?Cg:Ag)(v,1);S.version=w;const y=a.get(g);y&&e.remove(y),a.set(g,S)}function m(g){const v=a.get(g);if(v){const _=g.index;_!==null&&v.version<_.version&&d(g)}else d(g);return a.get(g)}return{get:h,update:f,getWireframeAttribute:m}}function jS(s,e,t){let i;function o(v){i=v}let a,c;function h(v){a=v.type,c=v.bytesPerElement}function f(v,_){s.drawElements(i,_,a,v*c),t.update(_,i,1)}function d(v,_,M){M!==0&&(s.drawElementsInstanced(i,_,a,v*c,M),t.update(_,i,M))}function m(v,_,M){if(M===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,_,0,a,v,0,M);let S=0;for(let y=0;y<M;y++)S+=_[y];t.update(S,i,1)}function g(v,_,M,w){if(M===0)return;const S=e.get("WEBGL_multi_draw");if(S===null)for(let y=0;y<v.length;y++)d(v[y]/c,_[y],w[y]);else{S.multiDrawElementsInstancedWEBGL(i,_,0,a,v,0,w,0,M);let y=0;for(let N=0;N<M;N++)y+=_[N]*w[N];t.update(y,i,1)}}this.setMode=o,this.setIndex=h,this.render=f,this.renderInstances=d,this.renderMultiDraw=m,this.renderMultiDrawInstances=g}function XS(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,c,h){switch(t.calls++,c){case s.TRIANGLES:t.triangles+=h*(a/3);break;case s.LINES:t.lines+=h*(a/2);break;case s.LINE_STRIP:t.lines+=h*(a-1);break;case s.LINE_LOOP:t.lines+=h*a;break;case s.POINTS:t.points+=h*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",c);break}}function o(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:o,update:i}}function YS(s,e,t){const i=new WeakMap,o=new Dt;function a(c,h,f){const d=c.morphTargetInfluences,m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=m!==void 0?m.length:0;let v=i.get(h);if(v===void 0||v.count!==g){let R=function(){V.dispose(),i.delete(h),h.removeEventListener("dispose",R)};var _=R;v!==void 0&&v.texture.dispose();const M=h.morphAttributes.position!==void 0,w=h.morphAttributes.normal!==void 0,S=h.morphAttributes.color!==void 0,y=h.morphAttributes.position||[],N=h.morphAttributes.normal||[],b=h.morphAttributes.color||[];let A=0;M===!0&&(A=1),w===!0&&(A=2),S===!0&&(A=3);let W=h.attributes.position.count*A,U=1;W>e.maxTextureSize&&(U=Math.ceil(W/e.maxTextureSize),W=e.maxTextureSize);const z=new Float32Array(W*U*4*g),V=new Mg(z,W,U,g);V.type=bi,V.needsUpdate=!0;const L=A*4;for(let B=0;B<g;B++){const ee=y[B],K=N[B],oe=b[B],he=W*U*4*B;for(let se=0;se<ee.count;se++){const ue=se*L;M===!0&&(o.fromBufferAttribute(ee,se),z[he+ue+0]=o.x,z[he+ue+1]=o.y,z[he+ue+2]=o.z,z[he+ue+3]=0),w===!0&&(o.fromBufferAttribute(K,se),z[he+ue+4]=o.x,z[he+ue+5]=o.y,z[he+ue+6]=o.z,z[he+ue+7]=0),S===!0&&(o.fromBufferAttribute(oe,se),z[he+ue+8]=o.x,z[he+ue+9]=o.y,z[he+ue+10]=o.z,z[he+ue+11]=oe.itemSize===4?o.w:1)}}v={count:g,texture:V,size:new Ie(W,U)},i.set(h,v),h.addEventListener("dispose",R)}if(c.isInstancedMesh===!0&&c.morphTexture!==null)f.getUniforms().setValue(s,"morphTexture",c.morphTexture,t);else{let M=0;for(let S=0;S<d.length;S++)M+=d[S];const w=h.morphTargetsRelative?1:1-M;f.getUniforms().setValue(s,"morphTargetBaseInfluence",w),f.getUniforms().setValue(s,"morphTargetInfluences",d)}f.getUniforms().setValue(s,"morphTargetsTexture",v.texture,t),f.getUniforms().setValue(s,"morphTargetsTextureSize",v.size)}return{update:a}}function qS(s,e,t,i){let o=new WeakMap;function a(f){const d=i.render.frame,m=f.geometry,g=e.get(f,m);if(o.get(g)!==d&&(e.update(g),o.set(g,d)),f.isInstancedMesh&&(f.hasEventListener("dispose",h)===!1&&f.addEventListener("dispose",h),o.get(f)!==d&&(t.update(f.instanceMatrix,s.ARRAY_BUFFER),f.instanceColor!==null&&t.update(f.instanceColor,s.ARRAY_BUFFER),o.set(f,d))),f.isSkinnedMesh){const v=f.skeleton;o.get(v)!==d&&(v.update(),o.set(v,d))}return g}function c(){o=new WeakMap}function h(f){const d=f.target;d.removeEventListener("dispose",h),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:a,dispose:c}}class Ig extends An{constructor(e,t,i,o,a,c,h,f,d,m=to){if(m!==to&&m!==ao)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&m===to&&(i=ls),i===void 0&&m===ao&&(i=oo),super(null,o,a,c,h,f,m,i,d),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=h!==void 0?h:$n,this.minFilter=f!==void 0?f:$n,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const Dg=new An,d0=new Ig(1,1),Ug=new Mg,Fg=new D_,Og=new Pg,p0=[],m0=[],g0=new Float32Array(16),v0=new Float32Array(9),x0=new Float32Array(4);function mo(s,e,t){const i=s[0];if(i<=0||i>0)return s;const o=e*t;let a=p0[o];if(a===void 0&&(a=new Float32Array(o),p0[o]=a),e!==0){i.toArray(a,0);for(let c=1,h=0;c!==e;++c)h+=t,s[c].toArray(a,h)}return a}function tn(s,e){if(s.length!==e.length)return!1;for(let t=0,i=s.length;t<i;t++)if(s[t]!==e[t])return!1;return!0}function nn(s,e){for(let t=0,i=e.length;t<i;t++)s[t]=e[t]}function dc(s,e){let t=m0[e];t===void 0&&(t=new Int32Array(e),m0[e]=t);for(let i=0;i!==e;++i)t[i]=s.allocateTextureUnit();return t}function $S(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function KS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;s.uniform2fv(this.addr,e),nn(t,e)}}function ZS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(tn(t,e))return;s.uniform3fv(this.addr,e),nn(t,e)}}function JS(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;s.uniform4fv(this.addr,e),nn(t,e)}}function QS(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(tn(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,i))return;x0.set(i),s.uniformMatrix2fv(this.addr,!1,x0),nn(t,i)}}function eM(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(tn(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,i))return;v0.set(i),s.uniformMatrix3fv(this.addr,!1,v0),nn(t,i)}}function tM(s,e){const t=this.cache,i=e.elements;if(i===void 0){if(tn(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),nn(t,e)}else{if(tn(t,i))return;g0.set(i),s.uniformMatrix4fv(this.addr,!1,g0),nn(t,i)}}function nM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function iM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;s.uniform2iv(this.addr,e),nn(t,e)}}function rM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;s.uniform3iv(this.addr,e),nn(t,e)}}function sM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;s.uniform4iv(this.addr,e),nn(t,e)}}function oM(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function aM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(tn(t,e))return;s.uniform2uiv(this.addr,e),nn(t,e)}}function lM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(tn(t,e))return;s.uniform3uiv(this.addr,e),nn(t,e)}}function cM(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(tn(t,e))return;s.uniform4uiv(this.addr,e),nn(t,e)}}function uM(s,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(s.uniform1i(this.addr,o),i[0]=o);let a;this.type===s.SAMPLER_2D_SHADOW?(d0.compareFunction=_g,a=d0):a=Dg,t.setTexture2D(e||a,o)}function hM(s,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(s.uniform1i(this.addr,o),i[0]=o),t.setTexture3D(e||Fg,o)}function fM(s,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(s.uniform1i(this.addr,o),i[0]=o),t.setTextureCube(e||Og,o)}function dM(s,e,t){const i=this.cache,o=t.allocateTextureUnit();i[0]!==o&&(s.uniform1i(this.addr,o),i[0]=o),t.setTexture2DArray(e||Ug,o)}function pM(s){switch(s){case 5126:return $S;case 35664:return KS;case 35665:return ZS;case 35666:return JS;case 35674:return QS;case 35675:return eM;case 35676:return tM;case 5124:case 35670:return nM;case 35667:case 35671:return iM;case 35668:case 35672:return rM;case 35669:case 35673:return sM;case 5125:return oM;case 36294:return aM;case 36295:return lM;case 36296:return cM;case 35678:case 36198:case 36298:case 36306:case 35682:return uM;case 35679:case 36299:case 36307:return hM;case 35680:case 36300:case 36308:case 36293:return fM;case 36289:case 36303:case 36311:case 36292:return dM}}function mM(s,e){s.uniform1fv(this.addr,e)}function gM(s,e){const t=mo(e,this.size,2);s.uniform2fv(this.addr,t)}function vM(s,e){const t=mo(e,this.size,3);s.uniform3fv(this.addr,t)}function xM(s,e){const t=mo(e,this.size,4);s.uniform4fv(this.addr,t)}function _M(s,e){const t=mo(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function yM(s,e){const t=mo(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function SM(s,e){const t=mo(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function MM(s,e){s.uniform1iv(this.addr,e)}function EM(s,e){s.uniform2iv(this.addr,e)}function wM(s,e){s.uniform3iv(this.addr,e)}function TM(s,e){s.uniform4iv(this.addr,e)}function AM(s,e){s.uniform1uiv(this.addr,e)}function CM(s,e){s.uniform2uiv(this.addr,e)}function RM(s,e){s.uniform3uiv(this.addr,e)}function bM(s,e){s.uniform4uiv(this.addr,e)}function PM(s,e,t){const i=this.cache,o=e.length,a=dc(t,o);tn(i,a)||(s.uniform1iv(this.addr,a),nn(i,a));for(let c=0;c!==o;++c)t.setTexture2D(e[c]||Dg,a[c])}function LM(s,e,t){const i=this.cache,o=e.length,a=dc(t,o);tn(i,a)||(s.uniform1iv(this.addr,a),nn(i,a));for(let c=0;c!==o;++c)t.setTexture3D(e[c]||Fg,a[c])}function NM(s,e,t){const i=this.cache,o=e.length,a=dc(t,o);tn(i,a)||(s.uniform1iv(this.addr,a),nn(i,a));for(let c=0;c!==o;++c)t.setTextureCube(e[c]||Og,a[c])}function IM(s,e,t){const i=this.cache,o=e.length,a=dc(t,o);tn(i,a)||(s.uniform1iv(this.addr,a),nn(i,a));for(let c=0;c!==o;++c)t.setTexture2DArray(e[c]||Ug,a[c])}function DM(s){switch(s){case 5126:return mM;case 35664:return gM;case 35665:return vM;case 35666:return xM;case 35674:return _M;case 35675:return yM;case 35676:return SM;case 5124:case 35670:return MM;case 35667:case 35671:return EM;case 35668:case 35672:return wM;case 35669:case 35673:return TM;case 5125:return AM;case 36294:return CM;case 36295:return RM;case 36296:return bM;case 35678:case 36198:case 36298:case 36306:case 35682:return PM;case 35679:case 36299:case 36307:return LM;case 35680:case 36300:case 36308:case 36293:return NM;case 36289:case 36303:case 36311:case 36292:return IM}}class UM{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=pM(t.type)}}class FM{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=DM(t.type)}}class OM{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const o=this.seq;for(let a=0,c=o.length;a!==c;++a){const h=o[a];h.setValue(e,t[h.id],i)}}}const Nh=/(\w+)(\])?(\[|\.)?/g;function _0(s,e){s.seq.push(e),s.map[e.id]=e}function zM(s,e,t){const i=s.name,o=i.length;for(Nh.lastIndex=0;;){const a=Nh.exec(i),c=Nh.lastIndex;let h=a[1];const f=a[2]==="]",d=a[3];if(f&&(h=h|0),d===void 0||d==="["&&c+2===o){_0(t,d===void 0?new UM(h,s,e):new FM(h,s,e));break}else{let g=t.map[h];g===void 0&&(g=new OM(h),_0(t,g)),t=g}}}class ic{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(t,o),c=e.getUniformLocation(t,a.name);zM(a,c,this)}}setValue(e,t,i,o){const a=this.map[t];a!==void 0&&a.setValue(e,i,o)}setOptional(e,t,i){const o=t[i];o!==void 0&&this.setValue(e,i,o)}static upload(e,t,i,o){for(let a=0,c=t.length;a!==c;++a){const h=t[a],f=i[h.id];f.needsUpdate!==!1&&h.setValue(e,f.value,o)}}static seqWithValue(e,t){const i=[];for(let o=0,a=e.length;o!==a;++o){const c=e[o];c.id in t&&i.push(c)}return i}}function y0(s,e,t){const i=s.createShader(e);return s.shaderSource(i,t),s.compileShader(i),i}const kM=37297;let BM=0;function VM(s,e){const t=s.split(`
`),i=[],o=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let c=o;c<a;c++){const h=c+1;i.push(`${h===e?">":" "} ${h}: ${t[c]}`)}return i.join(`
`)}const S0=new mt;function HM(s){Tt._getMatrix(S0,Tt.workingColorSpace,s);const e=`mat3( ${S0.elements.map(t=>t.toFixed(4))} )`;switch(Tt.getTransfer(s)){case hc:return[e,"LinearTransferOETF"];case It:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function M0(s,e,t){const i=s.getShaderParameter(e,s.COMPILE_STATUS),o=s.getShaderInfoLog(e).trim();if(i&&o==="")return"";const a=/ERROR: 0:(\d+)/.exec(o);if(a){const c=parseInt(a[1]);return t.toUpperCase()+`

`+o+`

`+VM(s.getShaderSource(e),c)}else return o}function GM(s,e){const t=HM(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function WM(s,e){let t;switch(e){case l_:t="Linear";break;case c_:t="Reinhard";break;case u_:t="Cineon";break;case ag:t="ACESFilmic";break;case f_:t="AgX";break;case d_:t="Neutral";break;case h_:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const jl=new F;function jM(){Tt.getLuminanceCoefficients(jl);const s=jl.x.toFixed(4),e=jl.y.toFixed(4),t=jl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function XM(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ra).join(`
`)}function YM(s){const e=[];for(const t in s){const i=s[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function qM(s,e){const t={},i=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let o=0;o<i;o++){const a=s.getActiveAttrib(e,o),c=a.name;let h=1;a.type===s.FLOAT_MAT2&&(h=2),a.type===s.FLOAT_MAT3&&(h=3),a.type===s.FLOAT_MAT4&&(h=4),t[c]={type:a.type,location:s.getAttribLocation(e,c),locationSize:h}}return t}function ra(s){return s!==""}function E0(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function w0(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const $M=/^[ \t]*#include +<([\w\d./]+)>/gm;function Pf(s){return s.replace($M,ZM)}const KM=new Map;function ZM(s,e){let t=gt[e];if(t===void 0){const i=KM.get(e);if(i!==void 0)t=gt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Pf(t)}const JM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function T0(s){return s.replace(JM,QM)}function QM(s,e,t,i){let o="";for(let a=parseInt(e);a<parseInt(t);a++)o+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return o}function A0(s){let e=`precision ${s.precision} float;
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
#define LOW_PRECISION`),e}function eE(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===rg?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===sg?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===Yi&&(e="SHADOWMAP_TYPE_VSM"),e}function tE(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case ro:case so:e="ENVMAP_TYPE_CUBE";break;case uc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function nE(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case so:e="ENVMAP_MODE_REFRACTION";break}return e}function iE(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case og:e="ENVMAP_BLENDING_MULTIPLY";break;case o_:e="ENVMAP_BLENDING_MIX";break;case a_:e="ENVMAP_BLENDING_ADD";break}return e}function rE(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function sE(s,e,t,i){const o=s.getContext(),a=t.defines;let c=t.vertexShader,h=t.fragmentShader;const f=eE(t),d=tE(t),m=nE(t),g=iE(t),v=rE(t),_=XM(t),M=YM(a),w=o.createProgram();let S,y,N=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(S=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(ra).join(`
`),S.length>0&&(S+=`
`),y=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M].filter(ra).join(`
`),y.length>0&&(y+=`
`)):(S=[A0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+m:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+f:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ra).join(`
`),y=[A0(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,M,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+m:"",t.envMap?"#define "+g:"",v?"#define CUBEUV_TEXEL_WIDTH "+v.texelWidth:"",v?"#define CUBEUV_TEXEL_HEIGHT "+v.texelHeight:"",v?"#define CUBEUV_MAX_MIP "+v.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+f:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Rr?"#define TONE_MAPPING":"",t.toneMapping!==Rr?gt.tonemapping_pars_fragment:"",t.toneMapping!==Rr?WM("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",gt.colorspace_pars_fragment,GM("linearToOutputTexel",t.outputColorSpace),jM(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ra).join(`
`)),c=Pf(c),c=E0(c,t),c=w0(c,t),h=Pf(h),h=E0(h,t),h=w0(h,t),c=T0(c),h=T0(h),t.isRawShaderMaterial!==!0&&(N=`#version 300 es
`,S=[_,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+S,y=["#define varying in",t.glslVersion===km?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===km?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+y);const b=N+S+c,A=N+y+h,W=y0(o,o.VERTEX_SHADER,b),U=y0(o,o.FRAGMENT_SHADER,A);o.attachShader(w,W),o.attachShader(w,U),t.index0AttributeName!==void 0?o.bindAttribLocation(w,0,t.index0AttributeName):t.morphTargets===!0&&o.bindAttribLocation(w,0,"position"),o.linkProgram(w);function z(B){if(s.debug.checkShaderErrors){const ee=o.getProgramInfoLog(w).trim(),K=o.getShaderInfoLog(W).trim(),oe=o.getShaderInfoLog(U).trim();let he=!0,se=!0;if(o.getProgramParameter(w,o.LINK_STATUS)===!1)if(he=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(o,w,W,U);else{const ue=M0(o,W,"vertex"),G=M0(o,U,"fragment");console.error("THREE.WebGLProgram: Shader Error "+o.getError()+" - VALIDATE_STATUS "+o.getProgramParameter(w,o.VALIDATE_STATUS)+`

Material Name: `+B.name+`
Material Type: `+B.type+`

Program Info Log: `+ee+`
`+ue+`
`+G)}else ee!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ee):(K===""||oe==="")&&(se=!1);se&&(B.diagnostics={runnable:he,programLog:ee,vertexShader:{log:K,prefix:S},fragmentShader:{log:oe,prefix:y}})}o.deleteShader(W),o.deleteShader(U),V=new ic(o,w),L=qM(o,w)}let V;this.getUniforms=function(){return V===void 0&&z(this),V};let L;this.getAttributes=function(){return L===void 0&&z(this),L};let R=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=o.getProgramParameter(w,kM)),R},this.destroy=function(){i.releaseStatesOfProgram(this),o.deleteProgram(w),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=BM++,this.cacheKey=e,this.usedTimes=1,this.program=w,this.vertexShader=W,this.fragmentShader=U,this}let oE=0;class aE{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,o=this._getShaderStage(t),a=this._getShaderStage(i),c=this._getShaderCacheForMaterial(e);return c.has(o)===!1&&(c.add(o),o.usedTimes++),c.has(a)===!1&&(c.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new lE(e),t.set(e,i)),i}}class lE{constructor(e){this.id=oE++,this.code=e,this.usedTimes=0}}function cE(s,e,t,i,o,a,c){const h=new wg,f=new aE,d=new Set,m=[],g=o.logarithmicDepthBuffer,v=o.vertexTextures;let _=o.precision;const M={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function w(L){return d.add(L),L===0?"uv":`uv${L}`}function S(L,R,B,ee,K){const oe=ee.fog,he=K.geometry,se=L.isMeshStandardMaterial?ee.environment:null,ue=(L.isMeshStandardMaterial?t:e).get(L.envMap||se),G=ue&&ue.mapping===uc?ue.image.height:null,ce=M[L.type];L.precision!==null&&(_=o.getMaxPrecision(L.precision),_!==L.precision&&console.warn("THREE.WebGLProgram.getParameters:",L.precision,"not supported, using",_,"instead."));const ae=he.morphAttributes.position||he.morphAttributes.normal||he.morphAttributes.color,k=ae!==void 0?ae.length:0;let ie=0;he.morphAttributes.position!==void 0&&(ie=1),he.morphAttributes.normal!==void 0&&(ie=2),he.morphAttributes.color!==void 0&&(ie=3);let ze,Q,de,we;if(ce){const Et=Ci[ce];ze=Et.vertexShader,Q=Et.fragmentShader}else ze=L.vertexShader,Q=L.fragmentShader,f.update(L),de=f.getVertexShaderID(L),we=f.getFragmentShaderID(L);const ge=s.getRenderTarget(),be=s.state.buffers.depth.getReversed(),Be=K.isInstancedMesh===!0,Ke=K.isBatchedMesh===!0,vt=!!L.map,ve=!!L.matcap,Ae=!!ue,O=!!L.aoMap,Ze=!!L.lightMap,Me=!!L.bumpMap,Ve=!!L.normalMap,Pe=!!L.displacementMap,it=!!L.emissiveMap,Fe=!!L.metalnessMap,I=!!L.roughnessMap,C=L.anisotropy>0,Z=L.clearcoat>0,fe=L.dispersion>0,xe=L.iridescence>0,pe=L.sheen>0,Ye=L.transmission>0,Le=C&&!!L.anisotropyMap,He=Z&&!!L.clearcoatMap,dt=Z&&!!L.clearcoatNormalMap,Ee=Z&&!!L.clearcoatRoughnessMap,We=xe&&!!L.iridescenceMap,ot=xe&&!!L.iridescenceThicknessMap,at=pe&&!!L.sheenColorMap,je=pe&&!!L.sheenRoughnessMap,xt=!!L.specularMap,ht=!!L.specularColorMap,bt=!!L.specularIntensityMap,X=Ye&&!!L.transmissionMap,Ne=Ye&&!!L.thicknessMap,le=!!L.gradientMap,me=!!L.alphaMap,Oe=L.alphaTest>0,Ue=!!L.alphaHash,ft=!!L.extensions;let zt=Rr;L.toneMapped&&(ge===null||ge.isXRRenderTarget===!0)&&(zt=s.toneMapping);const Kt={shaderID:ce,shaderType:L.type,shaderName:L.name,vertexShader:ze,fragmentShader:Q,defines:L.defines,customVertexShaderID:de,customFragmentShaderID:we,isRawShaderMaterial:L.isRawShaderMaterial===!0,glslVersion:L.glslVersion,precision:_,batching:Ke,batchingColor:Ke&&K._colorsTexture!==null,instancing:Be,instancingColor:Be&&K.instanceColor!==null,instancingMorph:Be&&K.morphTexture!==null,supportsVertexTextures:v,outputColorSpace:ge===null?s.outputColorSpace:ge.isXRRenderTarget===!0?ge.texture.colorSpace:co,alphaToCoverage:!!L.alphaToCoverage,map:vt,matcap:ve,envMap:Ae,envMapMode:Ae&&ue.mapping,envMapCubeUVHeight:G,aoMap:O,lightMap:Ze,bumpMap:Me,normalMap:Ve,displacementMap:v&&Pe,emissiveMap:it,normalMapObjectSpace:Ve&&L.normalMapType===v_,normalMapTangentSpace:Ve&&L.normalMapType===xg,metalnessMap:Fe,roughnessMap:I,anisotropy:C,anisotropyMap:Le,clearcoat:Z,clearcoatMap:He,clearcoatNormalMap:dt,clearcoatRoughnessMap:Ee,dispersion:fe,iridescence:xe,iridescenceMap:We,iridescenceThicknessMap:ot,sheen:pe,sheenColorMap:at,sheenRoughnessMap:je,specularMap:xt,specularColorMap:ht,specularIntensityMap:bt,transmission:Ye,transmissionMap:X,thicknessMap:Ne,gradientMap:le,opaque:L.transparent===!1&&L.blending===eo&&L.alphaToCoverage===!1,alphaMap:me,alphaTest:Oe,alphaHash:Ue,combine:L.combine,mapUv:vt&&w(L.map.channel),aoMapUv:O&&w(L.aoMap.channel),lightMapUv:Ze&&w(L.lightMap.channel),bumpMapUv:Me&&w(L.bumpMap.channel),normalMapUv:Ve&&w(L.normalMap.channel),displacementMapUv:Pe&&w(L.displacementMap.channel),emissiveMapUv:it&&w(L.emissiveMap.channel),metalnessMapUv:Fe&&w(L.metalnessMap.channel),roughnessMapUv:I&&w(L.roughnessMap.channel),anisotropyMapUv:Le&&w(L.anisotropyMap.channel),clearcoatMapUv:He&&w(L.clearcoatMap.channel),clearcoatNormalMapUv:dt&&w(L.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ee&&w(L.clearcoatRoughnessMap.channel),iridescenceMapUv:We&&w(L.iridescenceMap.channel),iridescenceThicknessMapUv:ot&&w(L.iridescenceThicknessMap.channel),sheenColorMapUv:at&&w(L.sheenColorMap.channel),sheenRoughnessMapUv:je&&w(L.sheenRoughnessMap.channel),specularMapUv:xt&&w(L.specularMap.channel),specularColorMapUv:ht&&w(L.specularColorMap.channel),specularIntensityMapUv:bt&&w(L.specularIntensityMap.channel),transmissionMapUv:X&&w(L.transmissionMap.channel),thicknessMapUv:Ne&&w(L.thicknessMap.channel),alphaMapUv:me&&w(L.alphaMap.channel),vertexTangents:!!he.attributes.tangent&&(Ve||C),vertexColors:L.vertexColors,vertexAlphas:L.vertexColors===!0&&!!he.attributes.color&&he.attributes.color.itemSize===4,pointsUvs:K.isPoints===!0&&!!he.attributes.uv&&(vt||me),fog:!!oe,useFog:L.fog===!0,fogExp2:!!oe&&oe.isFogExp2,flatShading:L.flatShading===!0,sizeAttenuation:L.sizeAttenuation===!0,logarithmicDepthBuffer:g,reverseDepthBuffer:be,skinning:K.isSkinnedMesh===!0,morphTargets:he.morphAttributes.position!==void 0,morphNormals:he.morphAttributes.normal!==void 0,morphColors:he.morphAttributes.color!==void 0,morphTargetsCount:k,morphTextureStride:ie,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:L.dithering,shadowMapEnabled:s.shadowMap.enabled&&B.length>0,shadowMapType:s.shadowMap.type,toneMapping:zt,decodeVideoTexture:vt&&L.map.isVideoTexture===!0&&Tt.getTransfer(L.map.colorSpace)===It,decodeVideoTextureEmissive:it&&L.emissiveMap.isVideoTexture===!0&&Tt.getTransfer(L.emissiveMap.colorSpace)===It,premultipliedAlpha:L.premultipliedAlpha,doubleSided:L.side===$i,flipSided:L.side===kn,useDepthPacking:L.depthPacking>=0,depthPacking:L.depthPacking||0,index0AttributeName:L.index0AttributeName,extensionClipCullDistance:ft&&L.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ft&&L.extensions.multiDraw===!0||Ke)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:L.customProgramCacheKey()};return Kt.vertexUv1s=d.has(1),Kt.vertexUv2s=d.has(2),Kt.vertexUv3s=d.has(3),d.clear(),Kt}function y(L){const R=[];if(L.shaderID?R.push(L.shaderID):(R.push(L.customVertexShaderID),R.push(L.customFragmentShaderID)),L.defines!==void 0)for(const B in L.defines)R.push(B),R.push(L.defines[B]);return L.isRawShaderMaterial===!1&&(N(R,L),b(R,L),R.push(s.outputColorSpace)),R.push(L.customProgramCacheKey),R.join()}function N(L,R){L.push(R.precision),L.push(R.outputColorSpace),L.push(R.envMapMode),L.push(R.envMapCubeUVHeight),L.push(R.mapUv),L.push(R.alphaMapUv),L.push(R.lightMapUv),L.push(R.aoMapUv),L.push(R.bumpMapUv),L.push(R.normalMapUv),L.push(R.displacementMapUv),L.push(R.emissiveMapUv),L.push(R.metalnessMapUv),L.push(R.roughnessMapUv),L.push(R.anisotropyMapUv),L.push(R.clearcoatMapUv),L.push(R.clearcoatNormalMapUv),L.push(R.clearcoatRoughnessMapUv),L.push(R.iridescenceMapUv),L.push(R.iridescenceThicknessMapUv),L.push(R.sheenColorMapUv),L.push(R.sheenRoughnessMapUv),L.push(R.specularMapUv),L.push(R.specularColorMapUv),L.push(R.specularIntensityMapUv),L.push(R.transmissionMapUv),L.push(R.thicknessMapUv),L.push(R.combine),L.push(R.fogExp2),L.push(R.sizeAttenuation),L.push(R.morphTargetsCount),L.push(R.morphAttributeCount),L.push(R.numDirLights),L.push(R.numPointLights),L.push(R.numSpotLights),L.push(R.numSpotLightMaps),L.push(R.numHemiLights),L.push(R.numRectAreaLights),L.push(R.numDirLightShadows),L.push(R.numPointLightShadows),L.push(R.numSpotLightShadows),L.push(R.numSpotLightShadowsWithMaps),L.push(R.numLightProbes),L.push(R.shadowMapType),L.push(R.toneMapping),L.push(R.numClippingPlanes),L.push(R.numClipIntersection),L.push(R.depthPacking)}function b(L,R){h.disableAll(),R.supportsVertexTextures&&h.enable(0),R.instancing&&h.enable(1),R.instancingColor&&h.enable(2),R.instancingMorph&&h.enable(3),R.matcap&&h.enable(4),R.envMap&&h.enable(5),R.normalMapObjectSpace&&h.enable(6),R.normalMapTangentSpace&&h.enable(7),R.clearcoat&&h.enable(8),R.iridescence&&h.enable(9),R.alphaTest&&h.enable(10),R.vertexColors&&h.enable(11),R.vertexAlphas&&h.enable(12),R.vertexUv1s&&h.enable(13),R.vertexUv2s&&h.enable(14),R.vertexUv3s&&h.enable(15),R.vertexTangents&&h.enable(16),R.anisotropy&&h.enable(17),R.alphaHash&&h.enable(18),R.batching&&h.enable(19),R.dispersion&&h.enable(20),R.batchingColor&&h.enable(21),L.push(h.mask),h.disableAll(),R.fog&&h.enable(0),R.useFog&&h.enable(1),R.flatShading&&h.enable(2),R.logarithmicDepthBuffer&&h.enable(3),R.reverseDepthBuffer&&h.enable(4),R.skinning&&h.enable(5),R.morphTargets&&h.enable(6),R.morphNormals&&h.enable(7),R.morphColors&&h.enable(8),R.premultipliedAlpha&&h.enable(9),R.shadowMapEnabled&&h.enable(10),R.doubleSided&&h.enable(11),R.flipSided&&h.enable(12),R.useDepthPacking&&h.enable(13),R.dithering&&h.enable(14),R.transmission&&h.enable(15),R.sheen&&h.enable(16),R.opaque&&h.enable(17),R.pointsUvs&&h.enable(18),R.decodeVideoTexture&&h.enable(19),R.decodeVideoTextureEmissive&&h.enable(20),R.alphaToCoverage&&h.enable(21),L.push(h.mask)}function A(L){const R=M[L.type];let B;if(R){const ee=Ci[R];B=X_.clone(ee.uniforms)}else B=L.uniforms;return B}function W(L,R){let B;for(let ee=0,K=m.length;ee<K;ee++){const oe=m[ee];if(oe.cacheKey===R){B=oe,++B.usedTimes;break}}return B===void 0&&(B=new sE(s,R,L,a),m.push(B)),B}function U(L){if(--L.usedTimes===0){const R=m.indexOf(L);m[R]=m[m.length-1],m.pop(),L.destroy()}}function z(L){f.remove(L)}function V(){f.dispose()}return{getParameters:S,getProgramCacheKey:y,getUniforms:A,acquireProgram:W,releaseProgram:U,releaseShaderCache:z,programs:m,dispose:V}}function uE(){let s=new WeakMap;function e(c){return s.has(c)}function t(c){let h=s.get(c);return h===void 0&&(h={},s.set(c,h)),h}function i(c){s.delete(c)}function o(c,h,f){s.get(c)[h]=f}function a(){s=new WeakMap}return{has:e,get:t,remove:i,update:o,dispose:a}}function hE(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function C0(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function R0(){const s=[];let e=0;const t=[],i=[],o=[];function a(){e=0,t.length=0,i.length=0,o.length=0}function c(g,v,_,M,w,S){let y=s[e];return y===void 0?(y={id:g.id,object:g,geometry:v,material:_,groupOrder:M,renderOrder:g.renderOrder,z:w,group:S},s[e]=y):(y.id=g.id,y.object=g,y.geometry=v,y.material=_,y.groupOrder=M,y.renderOrder=g.renderOrder,y.z=w,y.group=S),e++,y}function h(g,v,_,M,w,S){const y=c(g,v,_,M,w,S);_.transmission>0?i.push(y):_.transparent===!0?o.push(y):t.push(y)}function f(g,v,_,M,w,S){const y=c(g,v,_,M,w,S);_.transmission>0?i.unshift(y):_.transparent===!0?o.unshift(y):t.unshift(y)}function d(g,v){t.length>1&&t.sort(g||hE),i.length>1&&i.sort(v||C0),o.length>1&&o.sort(v||C0)}function m(){for(let g=e,v=s.length;g<v;g++){const _=s[g];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:t,transmissive:i,transparent:o,init:a,push:h,unshift:f,finish:m,sort:d}}function fE(){let s=new WeakMap;function e(i,o){const a=s.get(i);let c;return a===void 0?(c=new R0,s.set(i,[c])):o>=a.length?(c=new R0,a.push(c)):c=a[o],c}function t(){s=new WeakMap}return{get:e,dispose:t}}function dE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new F,color:new yt};break;case"SpotLight":t={position:new F,direction:new F,color:new yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new F,color:new yt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new F,skyColor:new yt,groundColor:new yt};break;case"RectAreaLight":t={color:new yt,position:new F,halfWidth:new F,halfHeight:new F};break}return s[e.id]=t,t}}}function pE(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ie,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let mE=0;function gE(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function vE(s){const e=new dE,t=pE(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)i.probe.push(new F);const o=new F,a=new Lt,c=new Lt;function h(d){let m=0,g=0,v=0;for(let L=0;L<9;L++)i.probe[L].set(0,0,0);let _=0,M=0,w=0,S=0,y=0,N=0,b=0,A=0,W=0,U=0,z=0;d.sort(gE);for(let L=0,R=d.length;L<R;L++){const B=d[L],ee=B.color,K=B.intensity,oe=B.distance,he=B.shadow&&B.shadow.map?B.shadow.map.texture:null;if(B.isAmbientLight)m+=ee.r*K,g+=ee.g*K,v+=ee.b*K;else if(B.isLightProbe){for(let se=0;se<9;se++)i.probe[se].addScaledVector(B.sh.coefficients[se],K);z++}else if(B.isDirectionalLight){const se=e.get(B);if(se.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){const ue=B.shadow,G=t.get(B);G.shadowIntensity=ue.intensity,G.shadowBias=ue.bias,G.shadowNormalBias=ue.normalBias,G.shadowRadius=ue.radius,G.shadowMapSize=ue.mapSize,i.directionalShadow[_]=G,i.directionalShadowMap[_]=he,i.directionalShadowMatrix[_]=B.shadow.matrix,N++}i.directional[_]=se,_++}else if(B.isSpotLight){const se=e.get(B);se.position.setFromMatrixPosition(B.matrixWorld),se.color.copy(ee).multiplyScalar(K),se.distance=oe,se.coneCos=Math.cos(B.angle),se.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),se.decay=B.decay,i.spot[w]=se;const ue=B.shadow;if(B.map&&(i.spotLightMap[W]=B.map,W++,ue.updateMatrices(B),B.castShadow&&U++),i.spotLightMatrix[w]=ue.matrix,B.castShadow){const G=t.get(B);G.shadowIntensity=ue.intensity,G.shadowBias=ue.bias,G.shadowNormalBias=ue.normalBias,G.shadowRadius=ue.radius,G.shadowMapSize=ue.mapSize,i.spotShadow[w]=G,i.spotShadowMap[w]=he,A++}w++}else if(B.isRectAreaLight){const se=e.get(B);se.color.copy(ee).multiplyScalar(K),se.halfWidth.set(B.width*.5,0,0),se.halfHeight.set(0,B.height*.5,0),i.rectArea[S]=se,S++}else if(B.isPointLight){const se=e.get(B);if(se.color.copy(B.color).multiplyScalar(B.intensity),se.distance=B.distance,se.decay=B.decay,B.castShadow){const ue=B.shadow,G=t.get(B);G.shadowIntensity=ue.intensity,G.shadowBias=ue.bias,G.shadowNormalBias=ue.normalBias,G.shadowRadius=ue.radius,G.shadowMapSize=ue.mapSize,G.shadowCameraNear=ue.camera.near,G.shadowCameraFar=ue.camera.far,i.pointShadow[M]=G,i.pointShadowMap[M]=he,i.pointShadowMatrix[M]=B.shadow.matrix,b++}i.point[M]=se,M++}else if(B.isHemisphereLight){const se=e.get(B);se.skyColor.copy(B.color).multiplyScalar(K),se.groundColor.copy(B.groundColor).multiplyScalar(K),i.hemi[y]=se,y++}}S>0&&(s.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=De.LTC_FLOAT_1,i.rectAreaLTC2=De.LTC_FLOAT_2):(i.rectAreaLTC1=De.LTC_HALF_1,i.rectAreaLTC2=De.LTC_HALF_2)),i.ambient[0]=m,i.ambient[1]=g,i.ambient[2]=v;const V=i.hash;(V.directionalLength!==_||V.pointLength!==M||V.spotLength!==w||V.rectAreaLength!==S||V.hemiLength!==y||V.numDirectionalShadows!==N||V.numPointShadows!==b||V.numSpotShadows!==A||V.numSpotMaps!==W||V.numLightProbes!==z)&&(i.directional.length=_,i.spot.length=w,i.rectArea.length=S,i.point.length=M,i.hemi.length=y,i.directionalShadow.length=N,i.directionalShadowMap.length=N,i.pointShadow.length=b,i.pointShadowMap.length=b,i.spotShadow.length=A,i.spotShadowMap.length=A,i.directionalShadowMatrix.length=N,i.pointShadowMatrix.length=b,i.spotLightMatrix.length=A+W-U,i.spotLightMap.length=W,i.numSpotLightShadowsWithMaps=U,i.numLightProbes=z,V.directionalLength=_,V.pointLength=M,V.spotLength=w,V.rectAreaLength=S,V.hemiLength=y,V.numDirectionalShadows=N,V.numPointShadows=b,V.numSpotShadows=A,V.numSpotMaps=W,V.numLightProbes=z,i.version=mE++)}function f(d,m){let g=0,v=0,_=0,M=0,w=0;const S=m.matrixWorldInverse;for(let y=0,N=d.length;y<N;y++){const b=d[y];if(b.isDirectionalLight){const A=i.directional[g];A.direction.setFromMatrixPosition(b.matrixWorld),o.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(o),A.direction.transformDirection(S),g++}else if(b.isSpotLight){const A=i.spot[_];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(S),A.direction.setFromMatrixPosition(b.matrixWorld),o.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(o),A.direction.transformDirection(S),_++}else if(b.isRectAreaLight){const A=i.rectArea[M];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(S),c.identity(),a.copy(b.matrixWorld),a.premultiply(S),c.extractRotation(a),A.halfWidth.set(b.width*.5,0,0),A.halfHeight.set(0,b.height*.5,0),A.halfWidth.applyMatrix4(c),A.halfHeight.applyMatrix4(c),M++}else if(b.isPointLight){const A=i.point[v];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(S),v++}else if(b.isHemisphereLight){const A=i.hemi[w];A.direction.setFromMatrixPosition(b.matrixWorld),A.direction.transformDirection(S),w++}}}return{setup:h,setupView:f,state:i}}function b0(s){const e=new vE(s),t=[],i=[];function o(m){d.camera=m,t.length=0,i.length=0}function a(m){t.push(m)}function c(m){i.push(m)}function h(){e.setup(t)}function f(m){e.setupView(t,m)}const d={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:o,state:d,setupLights:h,setupLightsView:f,pushLight:a,pushShadow:c}}function xE(s){let e=new WeakMap;function t(o,a=0){const c=e.get(o);let h;return c===void 0?(h=new b0(s),e.set(o,[h])):a>=c.length?(h=new b0(s),c.push(h)):h=c[a],h}function i(){e=new WeakMap}return{get:t,dispose:i}}class _E extends Pr{static get type(){return"MeshDepthMaterial"}constructor(e){super(),this.isMeshDepthMaterial=!0,this.depthPacking=m_,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class yE extends Pr{static get type(){return"MeshDistanceMaterial"}constructor(e){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const SE=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ME=`uniform sampler2D shadow_pass;
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
}`;function EE(s,e,t){let i=new Xf;const o=new Ie,a=new Ie,c=new Dt,h=new _E({depthPacking:g_}),f=new yE,d={},m=t.maxTextureSize,g={[br]:kn,[kn]:br,[$i]:$i},v=new Nr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ie},radius:{value:4}},vertexShader:SE,fragmentShader:ME}),_=v.clone();_.defines.HORIZONTAL_PASS=1;const M=new en;M.setAttribute("position",new si(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const w=new Ut(M,v),S=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=rg;let y=this.type;this.render=function(U,z,V){if(S.enabled===!1||S.autoUpdate===!1&&S.needsUpdate===!1||U.length===0)return;const L=s.getRenderTarget(),R=s.getActiveCubeFace(),B=s.getActiveMipmapLevel(),ee=s.state;ee.setBlending(Cr),ee.buffers.color.setClear(1,1,1,1),ee.buffers.depth.setTest(!0),ee.setScissorTest(!1);const K=y!==Yi&&this.type===Yi,oe=y===Yi&&this.type!==Yi;for(let he=0,se=U.length;he<se;he++){const ue=U[he],G=ue.shadow;if(G===void 0){console.warn("THREE.WebGLShadowMap:",ue,"has no shadow.");continue}if(G.autoUpdate===!1&&G.needsUpdate===!1)continue;o.copy(G.mapSize);const ce=G.getFrameExtents();if(o.multiply(ce),a.copy(G.mapSize),(o.x>m||o.y>m)&&(o.x>m&&(a.x=Math.floor(m/ce.x),o.x=a.x*ce.x,G.mapSize.x=a.x),o.y>m&&(a.y=Math.floor(m/ce.y),o.y=a.y*ce.y,G.mapSize.y=a.y)),G.map===null||K===!0||oe===!0){const k=this.type!==Yi?{minFilter:$n,magFilter:$n}:{};G.map!==null&&G.map.dispose(),G.map=new cs(o.x,o.y,k),G.map.texture.name=ue.name+".shadowMap",G.camera.updateProjectionMatrix()}s.setRenderTarget(G.map),s.clear();const ae=G.getViewportCount();for(let k=0;k<ae;k++){const ie=G.getViewport(k);c.set(a.x*ie.x,a.y*ie.y,a.x*ie.z,a.y*ie.w),ee.viewport(c),G.updateMatrices(ue,k),i=G.getFrustum(),A(z,V,G.camera,ue,this.type)}G.isPointLightShadow!==!0&&this.type===Yi&&N(G,V),G.needsUpdate=!1}y=this.type,S.needsUpdate=!1,s.setRenderTarget(L,R,B)};function N(U,z){const V=e.update(w);v.defines.VSM_SAMPLES!==U.blurSamples&&(v.defines.VSM_SAMPLES=U.blurSamples,_.defines.VSM_SAMPLES=U.blurSamples,v.needsUpdate=!0,_.needsUpdate=!0),U.mapPass===null&&(U.mapPass=new cs(o.x,o.y)),v.uniforms.shadow_pass.value=U.map.texture,v.uniforms.resolution.value=U.mapSize,v.uniforms.radius.value=U.radius,s.setRenderTarget(U.mapPass),s.clear(),s.renderBufferDirect(z,null,V,v,w,null),_.uniforms.shadow_pass.value=U.mapPass.texture,_.uniforms.resolution.value=U.mapSize,_.uniforms.radius.value=U.radius,s.setRenderTarget(U.map),s.clear(),s.renderBufferDirect(z,null,V,_,w,null)}function b(U,z,V,L){let R=null;const B=V.isPointLight===!0?U.customDistanceMaterial:U.customDepthMaterial;if(B!==void 0)R=B;else if(R=V.isPointLight===!0?f:h,s.localClippingEnabled&&z.clipShadows===!0&&Array.isArray(z.clippingPlanes)&&z.clippingPlanes.length!==0||z.displacementMap&&z.displacementScale!==0||z.alphaMap&&z.alphaTest>0||z.map&&z.alphaTest>0){const ee=R.uuid,K=z.uuid;let oe=d[ee];oe===void 0&&(oe={},d[ee]=oe);let he=oe[K];he===void 0&&(he=R.clone(),oe[K]=he,z.addEventListener("dispose",W)),R=he}if(R.visible=z.visible,R.wireframe=z.wireframe,L===Yi?R.side=z.shadowSide!==null?z.shadowSide:z.side:R.side=z.shadowSide!==null?z.shadowSide:g[z.side],R.alphaMap=z.alphaMap,R.alphaTest=z.alphaTest,R.map=z.map,R.clipShadows=z.clipShadows,R.clippingPlanes=z.clippingPlanes,R.clipIntersection=z.clipIntersection,R.displacementMap=z.displacementMap,R.displacementScale=z.displacementScale,R.displacementBias=z.displacementBias,R.wireframeLinewidth=z.wireframeLinewidth,R.linewidth=z.linewidth,V.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const ee=s.properties.get(R);ee.light=V}return R}function A(U,z,V,L,R){if(U.visible===!1)return;if(U.layers.test(z.layers)&&(U.isMesh||U.isLine||U.isPoints)&&(U.castShadow||U.receiveShadow&&R===Yi)&&(!U.frustumCulled||i.intersectsObject(U))){U.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,U.matrixWorld);const K=e.update(U),oe=U.material;if(Array.isArray(oe)){const he=K.groups;for(let se=0,ue=he.length;se<ue;se++){const G=he[se],ce=oe[G.materialIndex];if(ce&&ce.visible){const ae=b(U,ce,L,R);U.onBeforeShadow(s,U,z,V,K,ae,G),s.renderBufferDirect(V,null,K,ae,U,G),U.onAfterShadow(s,U,z,V,K,ae,G)}}}else if(oe.visible){const he=b(U,oe,L,R);U.onBeforeShadow(s,U,z,V,K,he,null),s.renderBufferDirect(V,null,K,he,U,null),U.onAfterShadow(s,U,z,V,K,he,null)}}const ee=U.children;for(let K=0,oe=ee.length;K<oe;K++)A(ee[K],z,V,L,R)}function W(U){U.target.removeEventListener("dispose",W);for(const V in d){const L=d[V],R=U.target.uuid;R in L&&(L[R].dispose(),delete L[R])}}}const wE={[jh]:Xh,[Yh]:Kh,[qh]:Zh,[io]:$h,[Xh]:jh,[Kh]:Yh,[Zh]:qh,[$h]:io};function TE(s,e){function t(){let X=!1;const Ne=new Dt;let le=null;const me=new Dt(0,0,0,0);return{setMask:function(Oe){le!==Oe&&!X&&(s.colorMask(Oe,Oe,Oe,Oe),le=Oe)},setLocked:function(Oe){X=Oe},setClear:function(Oe,Ue,ft,zt,Kt){Kt===!0&&(Oe*=zt,Ue*=zt,ft*=zt),Ne.set(Oe,Ue,ft,zt),me.equals(Ne)===!1&&(s.clearColor(Oe,Ue,ft,zt),me.copy(Ne))},reset:function(){X=!1,le=null,me.set(-1,0,0,0)}}}function i(){let X=!1,Ne=!1,le=null,me=null,Oe=null;return{setReversed:function(Ue){if(Ne!==Ue){const ft=e.get("EXT_clip_control");Ne?ft.clipControlEXT(ft.LOWER_LEFT_EXT,ft.ZERO_TO_ONE_EXT):ft.clipControlEXT(ft.LOWER_LEFT_EXT,ft.NEGATIVE_ONE_TO_ONE_EXT);const zt=Oe;Oe=null,this.setClear(zt)}Ne=Ue},getReversed:function(){return Ne},setTest:function(Ue){Ue?ge(s.DEPTH_TEST):be(s.DEPTH_TEST)},setMask:function(Ue){le!==Ue&&!X&&(s.depthMask(Ue),le=Ue)},setFunc:function(Ue){if(Ne&&(Ue=wE[Ue]),me!==Ue){switch(Ue){case jh:s.depthFunc(s.NEVER);break;case Xh:s.depthFunc(s.ALWAYS);break;case Yh:s.depthFunc(s.LESS);break;case io:s.depthFunc(s.LEQUAL);break;case qh:s.depthFunc(s.EQUAL);break;case $h:s.depthFunc(s.GEQUAL);break;case Kh:s.depthFunc(s.GREATER);break;case Zh:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}me=Ue}},setLocked:function(Ue){X=Ue},setClear:function(Ue){Oe!==Ue&&(Ne&&(Ue=1-Ue),s.clearDepth(Ue),Oe=Ue)},reset:function(){X=!1,le=null,me=null,Oe=null,Ne=!1}}}function o(){let X=!1,Ne=null,le=null,me=null,Oe=null,Ue=null,ft=null,zt=null,Kt=null;return{setTest:function(Et){X||(Et?ge(s.STENCIL_TEST):be(s.STENCIL_TEST))},setMask:function(Et){Ne!==Et&&!X&&(s.stencilMask(Et),Ne=Et)},setFunc:function(Et,Cn,Sn){(le!==Et||me!==Cn||Oe!==Sn)&&(s.stencilFunc(Et,Cn,Sn),le=Et,me=Cn,Oe=Sn)},setOp:function(Et,Cn,Sn){(Ue!==Et||ft!==Cn||zt!==Sn)&&(s.stencilOp(Et,Cn,Sn),Ue=Et,ft=Cn,zt=Sn)},setLocked:function(Et){X=Et},setClear:function(Et){Kt!==Et&&(s.clearStencil(Et),Kt=Et)},reset:function(){X=!1,Ne=null,le=null,me=null,Oe=null,Ue=null,ft=null,zt=null,Kt=null}}}const a=new t,c=new i,h=new o,f=new WeakMap,d=new WeakMap;let m={},g={},v=new WeakMap,_=[],M=null,w=!1,S=null,y=null,N=null,b=null,A=null,W=null,U=null,z=new yt(0,0,0),V=0,L=!1,R=null,B=null,ee=null,K=null,oe=null;const he=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let se=!1,ue=0;const G=s.getParameter(s.VERSION);G.indexOf("WebGL")!==-1?(ue=parseFloat(/^WebGL (\d)/.exec(G)[1]),se=ue>=1):G.indexOf("OpenGL ES")!==-1&&(ue=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),se=ue>=2);let ce=null,ae={};const k=s.getParameter(s.SCISSOR_BOX),ie=s.getParameter(s.VIEWPORT),ze=new Dt().fromArray(k),Q=new Dt().fromArray(ie);function de(X,Ne,le,me){const Oe=new Uint8Array(4),Ue=s.createTexture();s.bindTexture(X,Ue),s.texParameteri(X,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(X,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ft=0;ft<le;ft++)X===s.TEXTURE_3D||X===s.TEXTURE_2D_ARRAY?s.texImage3D(Ne,0,s.RGBA,1,1,me,0,s.RGBA,s.UNSIGNED_BYTE,Oe):s.texImage2D(Ne+ft,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Oe);return Ue}const we={};we[s.TEXTURE_2D]=de(s.TEXTURE_2D,s.TEXTURE_2D,1),we[s.TEXTURE_CUBE_MAP]=de(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),we[s.TEXTURE_2D_ARRAY]=de(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),we[s.TEXTURE_3D]=de(s.TEXTURE_3D,s.TEXTURE_3D,1,1),a.setClear(0,0,0,1),c.setClear(1),h.setClear(0),ge(s.DEPTH_TEST),c.setFunc(io),Me(!1),Ve(Dm),ge(s.CULL_FACE),O(Cr);function ge(X){m[X]!==!0&&(s.enable(X),m[X]=!0)}function be(X){m[X]!==!1&&(s.disable(X),m[X]=!1)}function Be(X,Ne){return g[X]!==Ne?(s.bindFramebuffer(X,Ne),g[X]=Ne,X===s.DRAW_FRAMEBUFFER&&(g[s.FRAMEBUFFER]=Ne),X===s.FRAMEBUFFER&&(g[s.DRAW_FRAMEBUFFER]=Ne),!0):!1}function Ke(X,Ne){let le=_,me=!1;if(X){le=v.get(Ne),le===void 0&&(le=[],v.set(Ne,le));const Oe=X.textures;if(le.length!==Oe.length||le[0]!==s.COLOR_ATTACHMENT0){for(let Ue=0,ft=Oe.length;Ue<ft;Ue++)le[Ue]=s.COLOR_ATTACHMENT0+Ue;le.length=Oe.length,me=!0}}else le[0]!==s.BACK&&(le[0]=s.BACK,me=!0);me&&s.drawBuffers(le)}function vt(X){return M!==X?(s.useProgram(X),M=X,!0):!1}const ve={[is]:s.FUNC_ADD,[Gx]:s.FUNC_SUBTRACT,[Wx]:s.FUNC_REVERSE_SUBTRACT};ve[jx]=s.MIN,ve[Xx]=s.MAX;const Ae={[Yx]:s.ZERO,[qx]:s.ONE,[$x]:s.SRC_COLOR,[Gh]:s.SRC_ALPHA,[t_]:s.SRC_ALPHA_SATURATE,[Qx]:s.DST_COLOR,[Zx]:s.DST_ALPHA,[Kx]:s.ONE_MINUS_SRC_COLOR,[Wh]:s.ONE_MINUS_SRC_ALPHA,[e_]:s.ONE_MINUS_DST_COLOR,[Jx]:s.ONE_MINUS_DST_ALPHA,[n_]:s.CONSTANT_COLOR,[i_]:s.ONE_MINUS_CONSTANT_COLOR,[r_]:s.CONSTANT_ALPHA,[s_]:s.ONE_MINUS_CONSTANT_ALPHA};function O(X,Ne,le,me,Oe,Ue,ft,zt,Kt,Et){if(X===Cr){w===!0&&(be(s.BLEND),w=!1);return}if(w===!1&&(ge(s.BLEND),w=!0),X!==Hx){if(X!==S||Et!==L){if((y!==is||A!==is)&&(s.blendEquation(s.FUNC_ADD),y=is,A=is),Et)switch(X){case eo:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Hh:s.blendFunc(s.ONE,s.ONE);break;case Um:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Fm:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}else switch(X){case eo:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Hh:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case Um:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Fm:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",X);break}N=null,b=null,W=null,U=null,z.set(0,0,0),V=0,S=X,L=Et}return}Oe=Oe||Ne,Ue=Ue||le,ft=ft||me,(Ne!==y||Oe!==A)&&(s.blendEquationSeparate(ve[Ne],ve[Oe]),y=Ne,A=Oe),(le!==N||me!==b||Ue!==W||ft!==U)&&(s.blendFuncSeparate(Ae[le],Ae[me],Ae[Ue],Ae[ft]),N=le,b=me,W=Ue,U=ft),(zt.equals(z)===!1||Kt!==V)&&(s.blendColor(zt.r,zt.g,zt.b,Kt),z.copy(zt),V=Kt),S=X,L=!1}function Ze(X,Ne){X.side===$i?be(s.CULL_FACE):ge(s.CULL_FACE);let le=X.side===kn;Ne&&(le=!le),Me(le),X.blending===eo&&X.transparent===!1?O(Cr):O(X.blending,X.blendEquation,X.blendSrc,X.blendDst,X.blendEquationAlpha,X.blendSrcAlpha,X.blendDstAlpha,X.blendColor,X.blendAlpha,X.premultipliedAlpha),c.setFunc(X.depthFunc),c.setTest(X.depthTest),c.setMask(X.depthWrite),a.setMask(X.colorWrite);const me=X.stencilWrite;h.setTest(me),me&&(h.setMask(X.stencilWriteMask),h.setFunc(X.stencilFunc,X.stencilRef,X.stencilFuncMask),h.setOp(X.stencilFail,X.stencilZFail,X.stencilZPass)),it(X.polygonOffset,X.polygonOffsetFactor,X.polygonOffsetUnits),X.alphaToCoverage===!0?ge(s.SAMPLE_ALPHA_TO_COVERAGE):be(s.SAMPLE_ALPHA_TO_COVERAGE)}function Me(X){R!==X&&(X?s.frontFace(s.CW):s.frontFace(s.CCW),R=X)}function Ve(X){X!==Bx?(ge(s.CULL_FACE),X!==B&&(X===Dm?s.cullFace(s.BACK):X===Vx?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):be(s.CULL_FACE),B=X}function Pe(X){X!==ee&&(se&&s.lineWidth(X),ee=X)}function it(X,Ne,le){X?(ge(s.POLYGON_OFFSET_FILL),(K!==Ne||oe!==le)&&(s.polygonOffset(Ne,le),K=Ne,oe=le)):be(s.POLYGON_OFFSET_FILL)}function Fe(X){X?ge(s.SCISSOR_TEST):be(s.SCISSOR_TEST)}function I(X){X===void 0&&(X=s.TEXTURE0+he-1),ce!==X&&(s.activeTexture(X),ce=X)}function C(X,Ne,le){le===void 0&&(ce===null?le=s.TEXTURE0+he-1:le=ce);let me=ae[le];me===void 0&&(me={type:void 0,texture:void 0},ae[le]=me),(me.type!==X||me.texture!==Ne)&&(ce!==le&&(s.activeTexture(le),ce=le),s.bindTexture(X,Ne||we[X]),me.type=X,me.texture=Ne)}function Z(){const X=ae[ce];X!==void 0&&X.type!==void 0&&(s.bindTexture(X.type,null),X.type=void 0,X.texture=void 0)}function fe(){try{s.compressedTexImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function xe(){try{s.compressedTexImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function pe(){try{s.texSubImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Ye(){try{s.texSubImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Le(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function He(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function dt(){try{s.texStorage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function Ee(){try{s.texStorage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function We(){try{s.texImage2D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function ot(){try{s.texImage3D.apply(s,arguments)}catch(X){console.error("THREE.WebGLState:",X)}}function at(X){ze.equals(X)===!1&&(s.scissor(X.x,X.y,X.z,X.w),ze.copy(X))}function je(X){Q.equals(X)===!1&&(s.viewport(X.x,X.y,X.z,X.w),Q.copy(X))}function xt(X,Ne){let le=d.get(Ne);le===void 0&&(le=new WeakMap,d.set(Ne,le));let me=le.get(X);me===void 0&&(me=s.getUniformBlockIndex(Ne,X.name),le.set(X,me))}function ht(X,Ne){const me=d.get(Ne).get(X);f.get(Ne)!==me&&(s.uniformBlockBinding(Ne,me,X.__bindingPointIndex),f.set(Ne,me))}function bt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),c.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),m={},ce=null,ae={},g={},v=new WeakMap,_=[],M=null,w=!1,S=null,y=null,N=null,b=null,A=null,W=null,U=null,z=new yt(0,0,0),V=0,L=!1,R=null,B=null,ee=null,K=null,oe=null,ze.set(0,0,s.canvas.width,s.canvas.height),Q.set(0,0,s.canvas.width,s.canvas.height),a.reset(),c.reset(),h.reset()}return{buffers:{color:a,depth:c,stencil:h},enable:ge,disable:be,bindFramebuffer:Be,drawBuffers:Ke,useProgram:vt,setBlending:O,setMaterial:Ze,setFlipSided:Me,setCullFace:Ve,setLineWidth:Pe,setPolygonOffset:it,setScissorTest:Fe,activeTexture:I,bindTexture:C,unbindTexture:Z,compressedTexImage2D:fe,compressedTexImage3D:xe,texImage2D:We,texImage3D:ot,updateUBOMapping:xt,uniformBlockBinding:ht,texStorage2D:dt,texStorage3D:Ee,texSubImage2D:pe,texSubImage3D:Ye,compressedTexSubImage2D:Le,compressedTexSubImage3D:He,scissor:at,viewport:je,reset:bt}}function P0(s,e,t,i){const o=AE(i);switch(t){case fg:return s*e;case pg:return s*e;case mg:return s*e*2;case Hf:return s*e/o.components*o.byteLength;case Gf:return s*e/o.components*o.byteLength;case gg:return s*e*2/o.components*o.byteLength;case Wf:return s*e*2/o.components*o.byteLength;case dg:return s*e*3/o.components*o.byteLength;case xi:return s*e*4/o.components*o.byteLength;case jf:return s*e*4/o.components*o.byteLength;case Jl:case Ql:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case ec:case tc:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case rf:case of:return Math.max(s,16)*Math.max(e,8)/4;case nf:case sf:return Math.max(s,8)*Math.max(e,8)/2;case af:case lf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case cf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case uf:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case hf:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case ff:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case df:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case pf:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case mf:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case gf:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case vf:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case xf:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case _f:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case yf:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Sf:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Mf:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case Ef:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case nc:case wf:case Tf:return Math.ceil(s/4)*Math.ceil(e/4)*16;case vg:case Af:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Cf:case Rf:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function AE(s){switch(s){case Ji:case cg:return{byteLength:1,components:1};case fa:case ug:case xa:return{byteLength:2,components:1};case Bf:case Vf:return{byteLength:2,components:4};case ls:case kf:case bi:return{byteLength:4,components:1};case hg:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}function CE(s,e,t,i,o,a,c){const h=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,f=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new Ie,m=new WeakMap;let g;const v=new WeakMap;let _=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(I,C){return _?new OffscreenCanvas(I,C):oc("canvas")}function w(I,C,Z){let fe=1;const xe=Fe(I);if((xe.width>Z||xe.height>Z)&&(fe=Z/Math.max(xe.width,xe.height)),fe<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const pe=Math.floor(fe*xe.width),Ye=Math.floor(fe*xe.height);g===void 0&&(g=M(pe,Ye));const Le=C?M(pe,Ye):g;return Le.width=pe,Le.height=Ye,Le.getContext("2d").drawImage(I,0,0,pe,Ye),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+xe.width+"x"+xe.height+") to ("+pe+"x"+Ye+")."),Le}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+xe.width+"x"+xe.height+")."),I;return I}function S(I){return I.generateMipmaps}function y(I){s.generateMipmap(I)}function N(I){return I.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?s.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function b(I,C,Z,fe,xe=!1){if(I!==null){if(s[I]!==void 0)return s[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let pe=C;if(C===s.RED&&(Z===s.FLOAT&&(pe=s.R32F),Z===s.HALF_FLOAT&&(pe=s.R16F),Z===s.UNSIGNED_BYTE&&(pe=s.R8)),C===s.RED_INTEGER&&(Z===s.UNSIGNED_BYTE&&(pe=s.R8UI),Z===s.UNSIGNED_SHORT&&(pe=s.R16UI),Z===s.UNSIGNED_INT&&(pe=s.R32UI),Z===s.BYTE&&(pe=s.R8I),Z===s.SHORT&&(pe=s.R16I),Z===s.INT&&(pe=s.R32I)),C===s.RG&&(Z===s.FLOAT&&(pe=s.RG32F),Z===s.HALF_FLOAT&&(pe=s.RG16F),Z===s.UNSIGNED_BYTE&&(pe=s.RG8)),C===s.RG_INTEGER&&(Z===s.UNSIGNED_BYTE&&(pe=s.RG8UI),Z===s.UNSIGNED_SHORT&&(pe=s.RG16UI),Z===s.UNSIGNED_INT&&(pe=s.RG32UI),Z===s.BYTE&&(pe=s.RG8I),Z===s.SHORT&&(pe=s.RG16I),Z===s.INT&&(pe=s.RG32I)),C===s.RGB_INTEGER&&(Z===s.UNSIGNED_BYTE&&(pe=s.RGB8UI),Z===s.UNSIGNED_SHORT&&(pe=s.RGB16UI),Z===s.UNSIGNED_INT&&(pe=s.RGB32UI),Z===s.BYTE&&(pe=s.RGB8I),Z===s.SHORT&&(pe=s.RGB16I),Z===s.INT&&(pe=s.RGB32I)),C===s.RGBA_INTEGER&&(Z===s.UNSIGNED_BYTE&&(pe=s.RGBA8UI),Z===s.UNSIGNED_SHORT&&(pe=s.RGBA16UI),Z===s.UNSIGNED_INT&&(pe=s.RGBA32UI),Z===s.BYTE&&(pe=s.RGBA8I),Z===s.SHORT&&(pe=s.RGBA16I),Z===s.INT&&(pe=s.RGBA32I)),C===s.RGB&&Z===s.UNSIGNED_INT_5_9_9_9_REV&&(pe=s.RGB9_E5),C===s.RGBA){const Ye=xe?hc:Tt.getTransfer(fe);Z===s.FLOAT&&(pe=s.RGBA32F),Z===s.HALF_FLOAT&&(pe=s.RGBA16F),Z===s.UNSIGNED_BYTE&&(pe=Ye===It?s.SRGB8_ALPHA8:s.RGBA8),Z===s.UNSIGNED_SHORT_4_4_4_4&&(pe=s.RGBA4),Z===s.UNSIGNED_SHORT_5_5_5_1&&(pe=s.RGB5_A1)}return(pe===s.R16F||pe===s.R32F||pe===s.RG16F||pe===s.RG32F||pe===s.RGBA16F||pe===s.RGBA32F)&&e.get("EXT_color_buffer_float"),pe}function A(I,C){let Z;return I?C===null||C===ls||C===oo?Z=s.DEPTH24_STENCIL8:C===bi?Z=s.DEPTH32F_STENCIL8:C===fa&&(Z=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):C===null||C===ls||C===oo?Z=s.DEPTH_COMPONENT24:C===bi?Z=s.DEPTH_COMPONENT32F:C===fa&&(Z=s.DEPTH_COMPONENT16),Z}function W(I,C){return S(I)===!0||I.isFramebufferTexture&&I.minFilter!==$n&&I.minFilter!==Ri?Math.log2(Math.max(C.width,C.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?C.mipmaps.length:1}function U(I){const C=I.target;C.removeEventListener("dispose",U),V(C),C.isVideoTexture&&m.delete(C)}function z(I){const C=I.target;C.removeEventListener("dispose",z),R(C)}function V(I){const C=i.get(I);if(C.__webglInit===void 0)return;const Z=I.source,fe=v.get(Z);if(fe){const xe=fe[C.__cacheKey];xe.usedTimes--,xe.usedTimes===0&&L(I),Object.keys(fe).length===0&&v.delete(Z)}i.remove(I)}function L(I){const C=i.get(I);s.deleteTexture(C.__webglTexture);const Z=I.source,fe=v.get(Z);delete fe[C.__cacheKey],c.memory.textures--}function R(I){const C=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let fe=0;fe<6;fe++){if(Array.isArray(C.__webglFramebuffer[fe]))for(let xe=0;xe<C.__webglFramebuffer[fe].length;xe++)s.deleteFramebuffer(C.__webglFramebuffer[fe][xe]);else s.deleteFramebuffer(C.__webglFramebuffer[fe]);C.__webglDepthbuffer&&s.deleteRenderbuffer(C.__webglDepthbuffer[fe])}else{if(Array.isArray(C.__webglFramebuffer))for(let fe=0;fe<C.__webglFramebuffer.length;fe++)s.deleteFramebuffer(C.__webglFramebuffer[fe]);else s.deleteFramebuffer(C.__webglFramebuffer);if(C.__webglDepthbuffer&&s.deleteRenderbuffer(C.__webglDepthbuffer),C.__webglMultisampledFramebuffer&&s.deleteFramebuffer(C.__webglMultisampledFramebuffer),C.__webglColorRenderbuffer)for(let fe=0;fe<C.__webglColorRenderbuffer.length;fe++)C.__webglColorRenderbuffer[fe]&&s.deleteRenderbuffer(C.__webglColorRenderbuffer[fe]);C.__webglDepthRenderbuffer&&s.deleteRenderbuffer(C.__webglDepthRenderbuffer)}const Z=I.textures;for(let fe=0,xe=Z.length;fe<xe;fe++){const pe=i.get(Z[fe]);pe.__webglTexture&&(s.deleteTexture(pe.__webglTexture),c.memory.textures--),i.remove(Z[fe])}i.remove(I)}let B=0;function ee(){B=0}function K(){const I=B;return I>=o.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+o.maxTextures),B+=1,I}function oe(I){const C=[];return C.push(I.wrapS),C.push(I.wrapT),C.push(I.wrapR||0),C.push(I.magFilter),C.push(I.minFilter),C.push(I.anisotropy),C.push(I.internalFormat),C.push(I.format),C.push(I.type),C.push(I.generateMipmaps),C.push(I.premultiplyAlpha),C.push(I.flipY),C.push(I.unpackAlignment),C.push(I.colorSpace),C.join()}function he(I,C){const Z=i.get(I);if(I.isVideoTexture&&Pe(I),I.isRenderTargetTexture===!1&&I.version>0&&Z.__version!==I.version){const fe=I.image;if(fe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(fe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(Z,I,C);return}}t.bindTexture(s.TEXTURE_2D,Z.__webglTexture,s.TEXTURE0+C)}function se(I,C){const Z=i.get(I);if(I.version>0&&Z.__version!==I.version){Q(Z,I,C);return}t.bindTexture(s.TEXTURE_2D_ARRAY,Z.__webglTexture,s.TEXTURE0+C)}function ue(I,C){const Z=i.get(I);if(I.version>0&&Z.__version!==I.version){Q(Z,I,C);return}t.bindTexture(s.TEXTURE_3D,Z.__webglTexture,s.TEXTURE0+C)}function G(I,C){const Z=i.get(I);if(I.version>0&&Z.__version!==I.version){de(Z,I,C);return}t.bindTexture(s.TEXTURE_CUBE_MAP,Z.__webglTexture,s.TEXTURE0+C)}const ce={[ef]:s.REPEAT,[ss]:s.CLAMP_TO_EDGE,[tf]:s.MIRRORED_REPEAT},ae={[$n]:s.NEAREST,[p_]:s.NEAREST_MIPMAP_NEAREST,[Tl]:s.NEAREST_MIPMAP_LINEAR,[Ri]:s.LINEAR,[rh]:s.LINEAR_MIPMAP_NEAREST,[os]:s.LINEAR_MIPMAP_LINEAR},k={[x_]:s.NEVER,[w_]:s.ALWAYS,[__]:s.LESS,[_g]:s.LEQUAL,[y_]:s.EQUAL,[E_]:s.GEQUAL,[S_]:s.GREATER,[M_]:s.NOTEQUAL};function ie(I,C){if(C.type===bi&&e.has("OES_texture_float_linear")===!1&&(C.magFilter===Ri||C.magFilter===rh||C.magFilter===Tl||C.magFilter===os||C.minFilter===Ri||C.minFilter===rh||C.minFilter===Tl||C.minFilter===os)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(I,s.TEXTURE_WRAP_S,ce[C.wrapS]),s.texParameteri(I,s.TEXTURE_WRAP_T,ce[C.wrapT]),(I===s.TEXTURE_3D||I===s.TEXTURE_2D_ARRAY)&&s.texParameteri(I,s.TEXTURE_WRAP_R,ce[C.wrapR]),s.texParameteri(I,s.TEXTURE_MAG_FILTER,ae[C.magFilter]),s.texParameteri(I,s.TEXTURE_MIN_FILTER,ae[C.minFilter]),C.compareFunction&&(s.texParameteri(I,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(I,s.TEXTURE_COMPARE_FUNC,k[C.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(C.magFilter===$n||C.minFilter!==Tl&&C.minFilter!==os||C.type===bi&&e.has("OES_texture_float_linear")===!1)return;if(C.anisotropy>1||i.get(C).__currentAnisotropy){const Z=e.get("EXT_texture_filter_anisotropic");s.texParameterf(I,Z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(C.anisotropy,o.getMaxAnisotropy())),i.get(C).__currentAnisotropy=C.anisotropy}}}function ze(I,C){let Z=!1;I.__webglInit===void 0&&(I.__webglInit=!0,C.addEventListener("dispose",U));const fe=C.source;let xe=v.get(fe);xe===void 0&&(xe={},v.set(fe,xe));const pe=oe(C);if(pe!==I.__cacheKey){xe[pe]===void 0&&(xe[pe]={texture:s.createTexture(),usedTimes:0},c.memory.textures++,Z=!0),xe[pe].usedTimes++;const Ye=xe[I.__cacheKey];Ye!==void 0&&(xe[I.__cacheKey].usedTimes--,Ye.usedTimes===0&&L(C)),I.__cacheKey=pe,I.__webglTexture=xe[pe].texture}return Z}function Q(I,C,Z){let fe=s.TEXTURE_2D;(C.isDataArrayTexture||C.isCompressedArrayTexture)&&(fe=s.TEXTURE_2D_ARRAY),C.isData3DTexture&&(fe=s.TEXTURE_3D);const xe=ze(I,C),pe=C.source;t.bindTexture(fe,I.__webglTexture,s.TEXTURE0+Z);const Ye=i.get(pe);if(pe.version!==Ye.__version||xe===!0){t.activeTexture(s.TEXTURE0+Z);const Le=Tt.getPrimaries(Tt.workingColorSpace),He=C.colorSpace===Ar?null:Tt.getPrimaries(C.colorSpace),dt=C.colorSpace===Ar||Le===He?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,C.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,C.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,dt);let Ee=w(C.image,!1,o.maxTextureSize);Ee=it(C,Ee);const We=a.convert(C.format,C.colorSpace),ot=a.convert(C.type);let at=b(C.internalFormat,We,ot,C.colorSpace,C.isVideoTexture);ie(fe,C);let je;const xt=C.mipmaps,ht=C.isVideoTexture!==!0,bt=Ye.__version===void 0||xe===!0,X=pe.dataReady,Ne=W(C,Ee);if(C.isDepthTexture)at=A(C.format===ao,C.type),bt&&(ht?t.texStorage2D(s.TEXTURE_2D,1,at,Ee.width,Ee.height):t.texImage2D(s.TEXTURE_2D,0,at,Ee.width,Ee.height,0,We,ot,null));else if(C.isDataTexture)if(xt.length>0){ht&&bt&&t.texStorage2D(s.TEXTURE_2D,Ne,at,xt[0].width,xt[0].height);for(let le=0,me=xt.length;le<me;le++)je=xt[le],ht?X&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,je.width,je.height,We,ot,je.data):t.texImage2D(s.TEXTURE_2D,le,at,je.width,je.height,0,We,ot,je.data);C.generateMipmaps=!1}else ht?(bt&&t.texStorage2D(s.TEXTURE_2D,Ne,at,Ee.width,Ee.height),X&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Ee.width,Ee.height,We,ot,Ee.data)):t.texImage2D(s.TEXTURE_2D,0,at,Ee.width,Ee.height,0,We,ot,Ee.data);else if(C.isCompressedTexture)if(C.isCompressedArrayTexture){ht&&bt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ne,at,xt[0].width,xt[0].height,Ee.depth);for(let le=0,me=xt.length;le<me;le++)if(je=xt[le],C.format!==xi)if(We!==null)if(ht){if(X)if(C.layerUpdates.size>0){const Oe=P0(je.width,je.height,C.format,C.type);for(const Ue of C.layerUpdates){const ft=je.data.subarray(Ue*Oe/je.data.BYTES_PER_ELEMENT,(Ue+1)*Oe/je.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,Ue,je.width,je.height,1,We,ft)}C.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,0,je.width,je.height,Ee.depth,We,je.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,le,at,je.width,je.height,Ee.depth,0,je.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ht?X&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,le,0,0,0,je.width,je.height,Ee.depth,We,ot,je.data):t.texImage3D(s.TEXTURE_2D_ARRAY,le,at,je.width,je.height,Ee.depth,0,We,ot,je.data)}else{ht&&bt&&t.texStorage2D(s.TEXTURE_2D,Ne,at,xt[0].width,xt[0].height);for(let le=0,me=xt.length;le<me;le++)je=xt[le],C.format!==xi?We!==null?ht?X&&t.compressedTexSubImage2D(s.TEXTURE_2D,le,0,0,je.width,je.height,We,je.data):t.compressedTexImage2D(s.TEXTURE_2D,le,at,je.width,je.height,0,je.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ht?X&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,je.width,je.height,We,ot,je.data):t.texImage2D(s.TEXTURE_2D,le,at,je.width,je.height,0,We,ot,je.data)}else if(C.isDataArrayTexture)if(ht){if(bt&&t.texStorage3D(s.TEXTURE_2D_ARRAY,Ne,at,Ee.width,Ee.height,Ee.depth),X)if(C.layerUpdates.size>0){const le=P0(Ee.width,Ee.height,C.format,C.type);for(const me of C.layerUpdates){const Oe=Ee.data.subarray(me*le/Ee.data.BYTES_PER_ELEMENT,(me+1)*le/Ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,me,Ee.width,Ee.height,1,We,ot,Oe)}C.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Ee.width,Ee.height,Ee.depth,We,ot,Ee.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,at,Ee.width,Ee.height,Ee.depth,0,We,ot,Ee.data);else if(C.isData3DTexture)ht?(bt&&t.texStorage3D(s.TEXTURE_3D,Ne,at,Ee.width,Ee.height,Ee.depth),X&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Ee.width,Ee.height,Ee.depth,We,ot,Ee.data)):t.texImage3D(s.TEXTURE_3D,0,at,Ee.width,Ee.height,Ee.depth,0,We,ot,Ee.data);else if(C.isFramebufferTexture){if(bt)if(ht)t.texStorage2D(s.TEXTURE_2D,Ne,at,Ee.width,Ee.height);else{let le=Ee.width,me=Ee.height;for(let Oe=0;Oe<Ne;Oe++)t.texImage2D(s.TEXTURE_2D,Oe,at,le,me,0,We,ot,null),le>>=1,me>>=1}}else if(xt.length>0){if(ht&&bt){const le=Fe(xt[0]);t.texStorage2D(s.TEXTURE_2D,Ne,at,le.width,le.height)}for(let le=0,me=xt.length;le<me;le++)je=xt[le],ht?X&&t.texSubImage2D(s.TEXTURE_2D,le,0,0,We,ot,je):t.texImage2D(s.TEXTURE_2D,le,at,We,ot,je);C.generateMipmaps=!1}else if(ht){if(bt){const le=Fe(Ee);t.texStorage2D(s.TEXTURE_2D,Ne,at,le.width,le.height)}X&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,We,ot,Ee)}else t.texImage2D(s.TEXTURE_2D,0,at,We,ot,Ee);S(C)&&y(fe),Ye.__version=pe.version,C.onUpdate&&C.onUpdate(C)}I.__version=C.version}function de(I,C,Z){if(C.image.length!==6)return;const fe=ze(I,C),xe=C.source;t.bindTexture(s.TEXTURE_CUBE_MAP,I.__webglTexture,s.TEXTURE0+Z);const pe=i.get(xe);if(xe.version!==pe.__version||fe===!0){t.activeTexture(s.TEXTURE0+Z);const Ye=Tt.getPrimaries(Tt.workingColorSpace),Le=C.colorSpace===Ar?null:Tt.getPrimaries(C.colorSpace),He=C.colorSpace===Ar||Ye===Le?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,C.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,C.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,C.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,He);const dt=C.isCompressedTexture||C.image[0].isCompressedTexture,Ee=C.image[0]&&C.image[0].isDataTexture,We=[];for(let me=0;me<6;me++)!dt&&!Ee?We[me]=w(C.image[me],!0,o.maxCubemapSize):We[me]=Ee?C.image[me].image:C.image[me],We[me]=it(C,We[me]);const ot=We[0],at=a.convert(C.format,C.colorSpace),je=a.convert(C.type),xt=b(C.internalFormat,at,je,C.colorSpace),ht=C.isVideoTexture!==!0,bt=pe.__version===void 0||fe===!0,X=xe.dataReady;let Ne=W(C,ot);ie(s.TEXTURE_CUBE_MAP,C);let le;if(dt){ht&&bt&&t.texStorage2D(s.TEXTURE_CUBE_MAP,Ne,xt,ot.width,ot.height);for(let me=0;me<6;me++){le=We[me].mipmaps;for(let Oe=0;Oe<le.length;Oe++){const Ue=le[Oe];C.format!==xi?at!==null?ht?X&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Oe,0,0,Ue.width,Ue.height,at,Ue.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Oe,xt,Ue.width,Ue.height,0,Ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ht?X&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Oe,0,0,Ue.width,Ue.height,at,je,Ue.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Oe,xt,Ue.width,Ue.height,0,at,je,Ue.data)}}}else{if(le=C.mipmaps,ht&&bt){le.length>0&&Ne++;const me=Fe(We[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,Ne,xt,me.width,me.height)}for(let me=0;me<6;me++)if(Ee){ht?X&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,We[me].width,We[me].height,at,je,We[me].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,xt,We[me].width,We[me].height,0,at,je,We[me].data);for(let Oe=0;Oe<le.length;Oe++){const ft=le[Oe].image[me].image;ht?X&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Oe+1,0,0,ft.width,ft.height,at,je,ft.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Oe+1,xt,ft.width,ft.height,0,at,je,ft.data)}}else{ht?X&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,0,0,at,je,We[me]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,xt,at,je,We[me]);for(let Oe=0;Oe<le.length;Oe++){const Ue=le[Oe];ht?X&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Oe+1,0,0,at,je,Ue.image[me]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+me,Oe+1,xt,at,je,Ue.image[me])}}}S(C)&&y(s.TEXTURE_CUBE_MAP),pe.__version=xe.version,C.onUpdate&&C.onUpdate(C)}I.__version=C.version}function we(I,C,Z,fe,xe,pe){const Ye=a.convert(Z.format,Z.colorSpace),Le=a.convert(Z.type),He=b(Z.internalFormat,Ye,Le,Z.colorSpace),dt=i.get(C),Ee=i.get(Z);if(Ee.__renderTarget=C,!dt.__hasExternalTextures){const We=Math.max(1,C.width>>pe),ot=Math.max(1,C.height>>pe);xe===s.TEXTURE_3D||xe===s.TEXTURE_2D_ARRAY?t.texImage3D(xe,pe,He,We,ot,C.depth,0,Ye,Le,null):t.texImage2D(xe,pe,He,We,ot,0,Ye,Le,null)}t.bindFramebuffer(s.FRAMEBUFFER,I),Ve(C)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,fe,xe,Ee.__webglTexture,0,Me(C)):(xe===s.TEXTURE_2D||xe>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&xe<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,fe,xe,Ee.__webglTexture,pe),t.bindFramebuffer(s.FRAMEBUFFER,null)}function ge(I,C,Z){if(s.bindRenderbuffer(s.RENDERBUFFER,I),C.depthBuffer){const fe=C.depthTexture,xe=fe&&fe.isDepthTexture?fe.type:null,pe=A(C.stencilBuffer,xe),Ye=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Le=Me(C);Ve(C)?h.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Le,pe,C.width,C.height):Z?s.renderbufferStorageMultisample(s.RENDERBUFFER,Le,pe,C.width,C.height):s.renderbufferStorage(s.RENDERBUFFER,pe,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ye,s.RENDERBUFFER,I)}else{const fe=C.textures;for(let xe=0;xe<fe.length;xe++){const pe=fe[xe],Ye=a.convert(pe.format,pe.colorSpace),Le=a.convert(pe.type),He=b(pe.internalFormat,Ye,Le,pe.colorSpace),dt=Me(C);Z&&Ve(C)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,dt,He,C.width,C.height):Ve(C)?h.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,dt,He,C.width,C.height):s.renderbufferStorage(s.RENDERBUFFER,He,C.width,C.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function be(I,C){if(C&&C.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,I),!(C.depthTexture&&C.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const fe=i.get(C.depthTexture);fe.__renderTarget=C,(!fe.__webglTexture||C.depthTexture.image.width!==C.width||C.depthTexture.image.height!==C.height)&&(C.depthTexture.image.width=C.width,C.depthTexture.image.height=C.height,C.depthTexture.needsUpdate=!0),he(C.depthTexture,0);const xe=fe.__webglTexture,pe=Me(C);if(C.depthTexture.format===to)Ve(C)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0,pe):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,xe,0);else if(C.depthTexture.format===ao)Ve(C)?h.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0,pe):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,xe,0);else throw new Error("Unknown depthTexture format")}function Be(I){const C=i.get(I),Z=I.isWebGLCubeRenderTarget===!0;if(C.__boundDepthTexture!==I.depthTexture){const fe=I.depthTexture;if(C.__depthDisposeCallback&&C.__depthDisposeCallback(),fe){const xe=()=>{delete C.__boundDepthTexture,delete C.__depthDisposeCallback,fe.removeEventListener("dispose",xe)};fe.addEventListener("dispose",xe),C.__depthDisposeCallback=xe}C.__boundDepthTexture=fe}if(I.depthTexture&&!C.__autoAllocateDepthBuffer){if(Z)throw new Error("target.depthTexture not supported in Cube render targets");be(C.__webglFramebuffer,I)}else if(Z){C.__webglDepthbuffer=[];for(let fe=0;fe<6;fe++)if(t.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer[fe]),C.__webglDepthbuffer[fe]===void 0)C.__webglDepthbuffer[fe]=s.createRenderbuffer(),ge(C.__webglDepthbuffer[fe],I,!1);else{const xe=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pe=C.__webglDepthbuffer[fe];s.bindRenderbuffer(s.RENDERBUFFER,pe),s.framebufferRenderbuffer(s.FRAMEBUFFER,xe,s.RENDERBUFFER,pe)}}else if(t.bindFramebuffer(s.FRAMEBUFFER,C.__webglFramebuffer),C.__webglDepthbuffer===void 0)C.__webglDepthbuffer=s.createRenderbuffer(),ge(C.__webglDepthbuffer,I,!1);else{const fe=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=C.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,fe,s.RENDERBUFFER,xe)}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ke(I,C,Z){const fe=i.get(I);C!==void 0&&we(fe.__webglFramebuffer,I,I.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),Z!==void 0&&Be(I)}function vt(I){const C=I.texture,Z=i.get(I),fe=i.get(C);I.addEventListener("dispose",z);const xe=I.textures,pe=I.isWebGLCubeRenderTarget===!0,Ye=xe.length>1;if(Ye||(fe.__webglTexture===void 0&&(fe.__webglTexture=s.createTexture()),fe.__version=C.version,c.memory.textures++),pe){Z.__webglFramebuffer=[];for(let Le=0;Le<6;Le++)if(C.mipmaps&&C.mipmaps.length>0){Z.__webglFramebuffer[Le]=[];for(let He=0;He<C.mipmaps.length;He++)Z.__webglFramebuffer[Le][He]=s.createFramebuffer()}else Z.__webglFramebuffer[Le]=s.createFramebuffer()}else{if(C.mipmaps&&C.mipmaps.length>0){Z.__webglFramebuffer=[];for(let Le=0;Le<C.mipmaps.length;Le++)Z.__webglFramebuffer[Le]=s.createFramebuffer()}else Z.__webglFramebuffer=s.createFramebuffer();if(Ye)for(let Le=0,He=xe.length;Le<He;Le++){const dt=i.get(xe[Le]);dt.__webglTexture===void 0&&(dt.__webglTexture=s.createTexture(),c.memory.textures++)}if(I.samples>0&&Ve(I)===!1){Z.__webglMultisampledFramebuffer=s.createFramebuffer(),Z.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,Z.__webglMultisampledFramebuffer);for(let Le=0;Le<xe.length;Le++){const He=xe[Le];Z.__webglColorRenderbuffer[Le]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,Z.__webglColorRenderbuffer[Le]);const dt=a.convert(He.format,He.colorSpace),Ee=a.convert(He.type),We=b(He.internalFormat,dt,Ee,He.colorSpace,I.isXRRenderTarget===!0),ot=Me(I);s.renderbufferStorageMultisample(s.RENDERBUFFER,ot,We,I.width,I.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Le,s.RENDERBUFFER,Z.__webglColorRenderbuffer[Le])}s.bindRenderbuffer(s.RENDERBUFFER,null),I.depthBuffer&&(Z.__webglDepthRenderbuffer=s.createRenderbuffer(),ge(Z.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(pe){t.bindTexture(s.TEXTURE_CUBE_MAP,fe.__webglTexture),ie(s.TEXTURE_CUBE_MAP,C);for(let Le=0;Le<6;Le++)if(C.mipmaps&&C.mipmaps.length>0)for(let He=0;He<C.mipmaps.length;He++)we(Z.__webglFramebuffer[Le][He],I,C,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Le,He);else we(Z.__webglFramebuffer[Le],I,C,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+Le,0);S(C)&&y(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ye){for(let Le=0,He=xe.length;Le<He;Le++){const dt=xe[Le],Ee=i.get(dt);t.bindTexture(s.TEXTURE_2D,Ee.__webglTexture),ie(s.TEXTURE_2D,dt),we(Z.__webglFramebuffer,I,dt,s.COLOR_ATTACHMENT0+Le,s.TEXTURE_2D,0),S(dt)&&y(s.TEXTURE_2D)}t.unbindTexture()}else{let Le=s.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Le=I.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Le,fe.__webglTexture),ie(Le,C),C.mipmaps&&C.mipmaps.length>0)for(let He=0;He<C.mipmaps.length;He++)we(Z.__webglFramebuffer[He],I,C,s.COLOR_ATTACHMENT0,Le,He);else we(Z.__webglFramebuffer,I,C,s.COLOR_ATTACHMENT0,Le,0);S(C)&&y(Le),t.unbindTexture()}I.depthBuffer&&Be(I)}function ve(I){const C=I.textures;for(let Z=0,fe=C.length;Z<fe;Z++){const xe=C[Z];if(S(xe)){const pe=N(I),Ye=i.get(xe).__webglTexture;t.bindTexture(pe,Ye),y(pe),t.unbindTexture()}}}const Ae=[],O=[];function Ze(I){if(I.samples>0){if(Ve(I)===!1){const C=I.textures,Z=I.width,fe=I.height;let xe=s.COLOR_BUFFER_BIT;const pe=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ye=i.get(I),Le=C.length>1;if(Le)for(let He=0;He<C.length;He++)t.bindFramebuffer(s.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ye.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ye.__webglFramebuffer);for(let He=0;He<C.length;He++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(xe|=s.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(xe|=s.STENCIL_BUFFER_BIT)),Le){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ye.__webglColorRenderbuffer[He]);const dt=i.get(C[He]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,dt,0)}s.blitFramebuffer(0,0,Z,fe,0,0,Z,fe,xe,s.NEAREST),f===!0&&(Ae.length=0,O.length=0,Ae.push(s.COLOR_ATTACHMENT0+He),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Ae.push(pe),O.push(pe),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,O)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ae))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),Le)for(let He=0;He<C.length;He++){t.bindFramebuffer(s.FRAMEBUFFER,Ye.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.RENDERBUFFER,Ye.__webglColorRenderbuffer[He]);const dt=i.get(C[He]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ye.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+He,s.TEXTURE_2D,dt,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ye.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&f){const C=I.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[C])}}}function Me(I){return Math.min(o.maxSamples,I.samples)}function Ve(I){const C=i.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&C.__useRenderToTexture!==!1}function Pe(I){const C=c.render.frame;m.get(I)!==C&&(m.set(I,C),I.update())}function it(I,C){const Z=I.colorSpace,fe=I.format,xe=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||Z!==co&&Z!==Ar&&(Tt.getTransfer(Z)===It?(fe!==xi||xe!==Ji)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",Z)),C}function Fe(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(d.width=I.naturalWidth||I.width,d.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(d.width=I.displayWidth,d.height=I.displayHeight):(d.width=I.width,d.height=I.height),d}this.allocateTextureUnit=K,this.resetTextureUnits=ee,this.setTexture2D=he,this.setTexture2DArray=se,this.setTexture3D=ue,this.setTextureCube=G,this.rebindTextures=Ke,this.setupRenderTarget=vt,this.updateRenderTargetMipmap=ve,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=Be,this.setupFrameBufferTexture=we,this.useMultisampledRTT=Ve}function RE(s,e){function t(i,o=Ar){let a;const c=Tt.getTransfer(o);if(i===Ji)return s.UNSIGNED_BYTE;if(i===Bf)return s.UNSIGNED_SHORT_4_4_4_4;if(i===Vf)return s.UNSIGNED_SHORT_5_5_5_1;if(i===hg)return s.UNSIGNED_INT_5_9_9_9_REV;if(i===cg)return s.BYTE;if(i===ug)return s.SHORT;if(i===fa)return s.UNSIGNED_SHORT;if(i===kf)return s.INT;if(i===ls)return s.UNSIGNED_INT;if(i===bi)return s.FLOAT;if(i===xa)return s.HALF_FLOAT;if(i===fg)return s.ALPHA;if(i===dg)return s.RGB;if(i===xi)return s.RGBA;if(i===pg)return s.LUMINANCE;if(i===mg)return s.LUMINANCE_ALPHA;if(i===to)return s.DEPTH_COMPONENT;if(i===ao)return s.DEPTH_STENCIL;if(i===Hf)return s.RED;if(i===Gf)return s.RED_INTEGER;if(i===gg)return s.RG;if(i===Wf)return s.RG_INTEGER;if(i===jf)return s.RGBA_INTEGER;if(i===Jl||i===Ql||i===ec||i===tc)if(c===It)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===Jl)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Ql)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ec)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===tc)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===Jl)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Ql)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ec)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===tc)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===nf||i===rf||i===sf||i===of)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===nf)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===rf)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===sf)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===of)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===af||i===lf||i===cf)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===af||i===lf)return c===It?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===cf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===uf||i===hf||i===ff||i===df||i===pf||i===mf||i===gf||i===vf||i===xf||i===_f||i===yf||i===Sf||i===Mf||i===Ef)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===uf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===hf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ff)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===df)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===pf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===mf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===gf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===vf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===xf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===_f)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===yf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Sf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Mf)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Ef)return c===It?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===nc||i===wf||i===Tf)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===nc)return c===It?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===wf)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Tf)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===vg||i===Af||i===Cf||i===Rf)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===nc)return a.COMPRESSED_RED_RGTC1_EXT;if(i===Af)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Cf)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Rf)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===oo?s.UNSIGNED_INT_24_8:s[i]!==void 0?s[i]:null}return{convert:t}}class bE extends On{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class zn extends ln{constructor(){super(),this.isGroup=!0,this.type="Group"}}const PE={type:"move"};class Ih{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let o=null,a=null,c=null;const h=this._targetRay,f=this._grip,d=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(d&&e.hand){c=!0;for(const w of e.hand.values()){const S=t.getJointPose(w,i),y=this._getHandJoint(d,w);S!==null&&(y.matrix.fromArray(S.transform.matrix),y.matrix.decompose(y.position,y.rotation,y.scale),y.matrixWorldNeedsUpdate=!0,y.jointRadius=S.radius),y.visible=S!==null}const m=d.joints["index-finger-tip"],g=d.joints["thumb-tip"],v=m.position.distanceTo(g.position),_=.02,M=.005;d.inputState.pinching&&v>_+M?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&v<=_-M&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else f!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(f.matrix.fromArray(a.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,a.linearVelocity?(f.hasLinearVelocity=!0,f.linearVelocity.copy(a.linearVelocity)):f.hasLinearVelocity=!1,a.angularVelocity?(f.hasAngularVelocity=!0,f.angularVelocity.copy(a.angularVelocity)):f.hasAngularVelocity=!1));h!==null&&(o=t.getPose(e.targetRaySpace,i),o===null&&a!==null&&(o=a),o!==null&&(h.matrix.fromArray(o.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,o.linearVelocity?(h.hasLinearVelocity=!0,h.linearVelocity.copy(o.linearVelocity)):h.hasLinearVelocity=!1,o.angularVelocity?(h.hasAngularVelocity=!0,h.angularVelocity.copy(o.angularVelocity)):h.hasAngularVelocity=!1,this.dispatchEvent(PE)))}return h!==null&&(h.visible=o!==null),f!==null&&(f.visible=a!==null),d!==null&&(d.visible=c!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new zn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}const LE=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,NE=`
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

}`;class IE{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,i){if(this.texture===null){const o=new An,a=e.properties.get(o);a.__webglTexture=t.texture,(t.depthNear!=i.depthNear||t.depthFar!=i.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=o}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Nr({vertexShader:LE,fragmentShader:NE,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ut(new fc(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class DE extends uo{constructor(e,t){super();const i=this;let o=null,a=1,c=null,h="local-floor",f=1,d=null,m=null,g=null,v=null,_=null,M=null;const w=new IE,S=t.getContextAttributes();let y=null,N=null;const b=[],A=[],W=new Ie;let U=null;const z=new On;z.viewport=new Dt;const V=new On;V.viewport=new Dt;const L=[z,V],R=new bE;let B=null,ee=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let de=b[Q];return de===void 0&&(de=new Ih,b[Q]=de),de.getTargetRaySpace()},this.getControllerGrip=function(Q){let de=b[Q];return de===void 0&&(de=new Ih,b[Q]=de),de.getGripSpace()},this.getHand=function(Q){let de=b[Q];return de===void 0&&(de=new Ih,b[Q]=de),de.getHandSpace()};function K(Q){const de=A.indexOf(Q.inputSource);if(de===-1)return;const we=b[de];we!==void 0&&(we.update(Q.inputSource,Q.frame,d||c),we.dispatchEvent({type:Q.type,data:Q.inputSource}))}function oe(){o.removeEventListener("select",K),o.removeEventListener("selectstart",K),o.removeEventListener("selectend",K),o.removeEventListener("squeeze",K),o.removeEventListener("squeezestart",K),o.removeEventListener("squeezeend",K),o.removeEventListener("end",oe),o.removeEventListener("inputsourceschange",he);for(let Q=0;Q<b.length;Q++){const de=A[Q];de!==null&&(A[Q]=null,b[Q].disconnect(de))}B=null,ee=null,w.reset(),e.setRenderTarget(y),_=null,v=null,g=null,o=null,N=null,ze.stop(),i.isPresenting=!1,e.setPixelRatio(U),e.setSize(W.width,W.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){a=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){h=Q,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||c},this.setReferenceSpace=function(Q){d=Q},this.getBaseLayer=function(){return v!==null?v:_},this.getBinding=function(){return g},this.getFrame=function(){return M},this.getSession=function(){return o},this.setSession=async function(Q){if(o=Q,o!==null){if(y=e.getRenderTarget(),o.addEventListener("select",K),o.addEventListener("selectstart",K),o.addEventListener("selectend",K),o.addEventListener("squeeze",K),o.addEventListener("squeezestart",K),o.addEventListener("squeezeend",K),o.addEventListener("end",oe),o.addEventListener("inputsourceschange",he),S.xrCompatible!==!0&&await t.makeXRCompatible(),U=e.getPixelRatio(),e.getSize(W),o.renderState.layers===void 0){const de={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:a};_=new XRWebGLLayer(o,t,de),o.updateRenderState({baseLayer:_}),e.setPixelRatio(1),e.setSize(_.framebufferWidth,_.framebufferHeight,!1),N=new cs(_.framebufferWidth,_.framebufferHeight,{format:xi,type:Ji,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil})}else{let de=null,we=null,ge=null;S.depth&&(ge=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,de=S.stencil?ao:to,we=S.stencil?oo:ls);const be={colorFormat:t.RGBA8,depthFormat:ge,scaleFactor:a};g=new XRWebGLBinding(o,t),v=g.createProjectionLayer(be),o.updateRenderState({layers:[v]}),e.setPixelRatio(1),e.setSize(v.textureWidth,v.textureHeight,!1),N=new cs(v.textureWidth,v.textureHeight,{format:xi,type:Ji,depthTexture:new Ig(v.textureWidth,v.textureHeight,we,void 0,void 0,void 0,void 0,void 0,void 0,de),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:v.ignoreDepthValues===!1})}N.isXRRenderTarget=!0,this.setFoveation(f),d=null,c=await o.requestReferenceSpace(h),ze.setContext(o),ze.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(o!==null)return o.environmentBlendMode},this.getDepthTexture=function(){return w.getDepthTexture()};function he(Q){for(let de=0;de<Q.removed.length;de++){const we=Q.removed[de],ge=A.indexOf(we);ge>=0&&(A[ge]=null,b[ge].disconnect(we))}for(let de=0;de<Q.added.length;de++){const we=Q.added[de];let ge=A.indexOf(we);if(ge===-1){for(let Be=0;Be<b.length;Be++)if(Be>=A.length){A.push(we),ge=Be;break}else if(A[Be]===null){A[Be]=we,ge=Be;break}if(ge===-1)break}const be=b[ge];be&&be.connect(we)}}const se=new F,ue=new F;function G(Q,de,we){se.setFromMatrixPosition(de.matrixWorld),ue.setFromMatrixPosition(we.matrixWorld);const ge=se.distanceTo(ue),be=de.projectionMatrix.elements,Be=we.projectionMatrix.elements,Ke=be[14]/(be[10]-1),vt=be[14]/(be[10]+1),ve=(be[9]+1)/be[5],Ae=(be[9]-1)/be[5],O=(be[8]-1)/be[0],Ze=(Be[8]+1)/Be[0],Me=Ke*O,Ve=Ke*Ze,Pe=ge/(-O+Ze),it=Pe*-O;if(de.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(it),Q.translateZ(Pe),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),be[10]===-1)Q.projectionMatrix.copy(de.projectionMatrix),Q.projectionMatrixInverse.copy(de.projectionMatrixInverse);else{const Fe=Ke+Pe,I=vt+Pe,C=Me-it,Z=Ve+(ge-it),fe=ve*vt/I*Fe,xe=Ae*vt/I*Fe;Q.projectionMatrix.makePerspective(C,Z,fe,xe,Fe,I),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ce(Q,de){de===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(de.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(o===null)return;let de=Q.near,we=Q.far;w.texture!==null&&(w.depthNear>0&&(de=w.depthNear),w.depthFar>0&&(we=w.depthFar)),R.near=V.near=z.near=de,R.far=V.far=z.far=we,(B!==R.near||ee!==R.far)&&(o.updateRenderState({depthNear:R.near,depthFar:R.far}),B=R.near,ee=R.far),z.layers.mask=Q.layers.mask|2,V.layers.mask=Q.layers.mask|4,R.layers.mask=z.layers.mask|V.layers.mask;const ge=Q.parent,be=R.cameras;ce(R,ge);for(let Be=0;Be<be.length;Be++)ce(be[Be],ge);be.length===2?G(R,z,V):R.projectionMatrix.copy(z.projectionMatrix),ae(Q,R,ge)};function ae(Q,de,we){we===null?Q.matrix.copy(de.matrixWorld):(Q.matrix.copy(we.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(de.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(de.projectionMatrix),Q.projectionMatrixInverse.copy(de.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=bf*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(v===null&&_===null))return f},this.setFoveation=function(Q){f=Q,v!==null&&(v.fixedFoveation=Q),_!==null&&_.fixedFoveation!==void 0&&(_.fixedFoveation=Q)},this.hasDepthSensing=function(){return w.texture!==null},this.getDepthSensingMesh=function(){return w.getMesh(R)};let k=null;function ie(Q,de){if(m=de.getViewerPose(d||c),M=de,m!==null){const we=m.views;_!==null&&(e.setRenderTargetFramebuffer(N,_.framebuffer),e.setRenderTarget(N));let ge=!1;we.length!==R.cameras.length&&(R.cameras.length=0,ge=!0);for(let Be=0;Be<we.length;Be++){const Ke=we[Be];let vt=null;if(_!==null)vt=_.getViewport(Ke);else{const Ae=g.getViewSubImage(v,Ke);vt=Ae.viewport,Be===0&&(e.setRenderTargetTextures(N,Ae.colorTexture,v.ignoreDepthValues?void 0:Ae.depthStencilTexture),e.setRenderTarget(N))}let ve=L[Be];ve===void 0&&(ve=new On,ve.layers.enable(Be),ve.viewport=new Dt,L[Be]=ve),ve.matrix.fromArray(Ke.transform.matrix),ve.matrix.decompose(ve.position,ve.quaternion,ve.scale),ve.projectionMatrix.fromArray(Ke.projectionMatrix),ve.projectionMatrixInverse.copy(ve.projectionMatrix).invert(),ve.viewport.set(vt.x,vt.y,vt.width,vt.height),Be===0&&(R.matrix.copy(ve.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),ge===!0&&R.cameras.push(ve)}const be=o.enabledFeatures;if(be&&be.includes("depth-sensing")){const Be=g.getDepthInformation(we[0]);Be&&Be.isValid&&Be.texture&&w.init(e,Be,o.renderState)}}for(let we=0;we<b.length;we++){const ge=A[we],be=b[we];ge!==null&&be!==void 0&&be.update(ge,de,d||c)}k&&k(Q,de),de.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:de}),M=null}const ze=new Lg;ze.setAnimationLoop(ie),this.setAnimationLoop=function(Q){k=Q},this.dispose=function(){}}}const Qr=new _i,UE=new Lt;function FE(s,e){function t(S,y){S.matrixAutoUpdate===!0&&S.updateMatrix(),y.value.copy(S.matrix)}function i(S,y){y.color.getRGB(S.fogColor.value,Rg(s)),y.isFog?(S.fogNear.value=y.near,S.fogFar.value=y.far):y.isFogExp2&&(S.fogDensity.value=y.density)}function o(S,y,N,b,A){y.isMeshBasicMaterial||y.isMeshLambertMaterial?a(S,y):y.isMeshToonMaterial?(a(S,y),g(S,y)):y.isMeshPhongMaterial?(a(S,y),m(S,y)):y.isMeshStandardMaterial?(a(S,y),v(S,y),y.isMeshPhysicalMaterial&&_(S,y,A)):y.isMeshMatcapMaterial?(a(S,y),M(S,y)):y.isMeshDepthMaterial?a(S,y):y.isMeshDistanceMaterial?(a(S,y),w(S,y)):y.isMeshNormalMaterial?a(S,y):y.isLineBasicMaterial?(c(S,y),y.isLineDashedMaterial&&h(S,y)):y.isPointsMaterial?f(S,y,N,b):y.isSpriteMaterial?d(S,y):y.isShadowMaterial?(S.color.value.copy(y.color),S.opacity.value=y.opacity):y.isShaderMaterial&&(y.uniformsNeedUpdate=!1)}function a(S,y){S.opacity.value=y.opacity,y.color&&S.diffuse.value.copy(y.color),y.emissive&&S.emissive.value.copy(y.emissive).multiplyScalar(y.emissiveIntensity),y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.bumpMap&&(S.bumpMap.value=y.bumpMap,t(y.bumpMap,S.bumpMapTransform),S.bumpScale.value=y.bumpScale,y.side===kn&&(S.bumpScale.value*=-1)),y.normalMap&&(S.normalMap.value=y.normalMap,t(y.normalMap,S.normalMapTransform),S.normalScale.value.copy(y.normalScale),y.side===kn&&S.normalScale.value.negate()),y.displacementMap&&(S.displacementMap.value=y.displacementMap,t(y.displacementMap,S.displacementMapTransform),S.displacementScale.value=y.displacementScale,S.displacementBias.value=y.displacementBias),y.emissiveMap&&(S.emissiveMap.value=y.emissiveMap,t(y.emissiveMap,S.emissiveMapTransform)),y.specularMap&&(S.specularMap.value=y.specularMap,t(y.specularMap,S.specularMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest);const N=e.get(y),b=N.envMap,A=N.envMapRotation;b&&(S.envMap.value=b,Qr.copy(A),Qr.x*=-1,Qr.y*=-1,Qr.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Qr.y*=-1,Qr.z*=-1),S.envMapRotation.value.setFromMatrix4(UE.makeRotationFromEuler(Qr)),S.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,S.reflectivity.value=y.reflectivity,S.ior.value=y.ior,S.refractionRatio.value=y.refractionRatio),y.lightMap&&(S.lightMap.value=y.lightMap,S.lightMapIntensity.value=y.lightMapIntensity,t(y.lightMap,S.lightMapTransform)),y.aoMap&&(S.aoMap.value=y.aoMap,S.aoMapIntensity.value=y.aoMapIntensity,t(y.aoMap,S.aoMapTransform))}function c(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform))}function h(S,y){S.dashSize.value=y.dashSize,S.totalSize.value=y.dashSize+y.gapSize,S.scale.value=y.scale}function f(S,y,N,b){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.size.value=y.size*N,S.scale.value=b*.5,y.map&&(S.map.value=y.map,t(y.map,S.uvTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function d(S,y){S.diffuse.value.copy(y.color),S.opacity.value=y.opacity,S.rotation.value=y.rotation,y.map&&(S.map.value=y.map,t(y.map,S.mapTransform)),y.alphaMap&&(S.alphaMap.value=y.alphaMap,t(y.alphaMap,S.alphaMapTransform)),y.alphaTest>0&&(S.alphaTest.value=y.alphaTest)}function m(S,y){S.specular.value.copy(y.specular),S.shininess.value=Math.max(y.shininess,1e-4)}function g(S,y){y.gradientMap&&(S.gradientMap.value=y.gradientMap)}function v(S,y){S.metalness.value=y.metalness,y.metalnessMap&&(S.metalnessMap.value=y.metalnessMap,t(y.metalnessMap,S.metalnessMapTransform)),S.roughness.value=y.roughness,y.roughnessMap&&(S.roughnessMap.value=y.roughnessMap,t(y.roughnessMap,S.roughnessMapTransform)),y.envMap&&(S.envMapIntensity.value=y.envMapIntensity)}function _(S,y,N){S.ior.value=y.ior,y.sheen>0&&(S.sheenColor.value.copy(y.sheenColor).multiplyScalar(y.sheen),S.sheenRoughness.value=y.sheenRoughness,y.sheenColorMap&&(S.sheenColorMap.value=y.sheenColorMap,t(y.sheenColorMap,S.sheenColorMapTransform)),y.sheenRoughnessMap&&(S.sheenRoughnessMap.value=y.sheenRoughnessMap,t(y.sheenRoughnessMap,S.sheenRoughnessMapTransform))),y.clearcoat>0&&(S.clearcoat.value=y.clearcoat,S.clearcoatRoughness.value=y.clearcoatRoughness,y.clearcoatMap&&(S.clearcoatMap.value=y.clearcoatMap,t(y.clearcoatMap,S.clearcoatMapTransform)),y.clearcoatRoughnessMap&&(S.clearcoatRoughnessMap.value=y.clearcoatRoughnessMap,t(y.clearcoatRoughnessMap,S.clearcoatRoughnessMapTransform)),y.clearcoatNormalMap&&(S.clearcoatNormalMap.value=y.clearcoatNormalMap,t(y.clearcoatNormalMap,S.clearcoatNormalMapTransform),S.clearcoatNormalScale.value.copy(y.clearcoatNormalScale),y.side===kn&&S.clearcoatNormalScale.value.negate())),y.dispersion>0&&(S.dispersion.value=y.dispersion),y.iridescence>0&&(S.iridescence.value=y.iridescence,S.iridescenceIOR.value=y.iridescenceIOR,S.iridescenceThicknessMinimum.value=y.iridescenceThicknessRange[0],S.iridescenceThicknessMaximum.value=y.iridescenceThicknessRange[1],y.iridescenceMap&&(S.iridescenceMap.value=y.iridescenceMap,t(y.iridescenceMap,S.iridescenceMapTransform)),y.iridescenceThicknessMap&&(S.iridescenceThicknessMap.value=y.iridescenceThicknessMap,t(y.iridescenceThicknessMap,S.iridescenceThicknessMapTransform))),y.transmission>0&&(S.transmission.value=y.transmission,S.transmissionSamplerMap.value=N.texture,S.transmissionSamplerSize.value.set(N.width,N.height),y.transmissionMap&&(S.transmissionMap.value=y.transmissionMap,t(y.transmissionMap,S.transmissionMapTransform)),S.thickness.value=y.thickness,y.thicknessMap&&(S.thicknessMap.value=y.thicknessMap,t(y.thicknessMap,S.thicknessMapTransform)),S.attenuationDistance.value=y.attenuationDistance,S.attenuationColor.value.copy(y.attenuationColor)),y.anisotropy>0&&(S.anisotropyVector.value.set(y.anisotropy*Math.cos(y.anisotropyRotation),y.anisotropy*Math.sin(y.anisotropyRotation)),y.anisotropyMap&&(S.anisotropyMap.value=y.anisotropyMap,t(y.anisotropyMap,S.anisotropyMapTransform))),S.specularIntensity.value=y.specularIntensity,S.specularColor.value.copy(y.specularColor),y.specularColorMap&&(S.specularColorMap.value=y.specularColorMap,t(y.specularColorMap,S.specularColorMapTransform)),y.specularIntensityMap&&(S.specularIntensityMap.value=y.specularIntensityMap,t(y.specularIntensityMap,S.specularIntensityMapTransform))}function M(S,y){y.matcap&&(S.matcap.value=y.matcap)}function w(S,y){const N=e.get(y).light;S.referencePosition.value.setFromMatrixPosition(N.matrixWorld),S.nearDistance.value=N.shadow.camera.near,S.farDistance.value=N.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:o}}function OE(s,e,t,i){let o={},a={},c=[];const h=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function f(N,b){const A=b.program;i.uniformBlockBinding(N,A)}function d(N,b){let A=o[N.id];A===void 0&&(M(N),A=m(N),o[N.id]=A,N.addEventListener("dispose",S));const W=b.program;i.updateUBOMapping(N,W);const U=e.render.frame;a[N.id]!==U&&(v(N),a[N.id]=U)}function m(N){const b=g();N.__bindingPointIndex=b;const A=s.createBuffer(),W=N.__size,U=N.usage;return s.bindBuffer(s.UNIFORM_BUFFER,A),s.bufferData(s.UNIFORM_BUFFER,W,U),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,b,A),A}function g(){for(let N=0;N<h;N++)if(c.indexOf(N)===-1)return c.push(N),N;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function v(N){const b=o[N.id],A=N.uniforms,W=N.__cache;s.bindBuffer(s.UNIFORM_BUFFER,b);for(let U=0,z=A.length;U<z;U++){const V=Array.isArray(A[U])?A[U]:[A[U]];for(let L=0,R=V.length;L<R;L++){const B=V[L];if(_(B,U,L,W)===!0){const ee=B.__offset,K=Array.isArray(B.value)?B.value:[B.value];let oe=0;for(let he=0;he<K.length;he++){const se=K[he],ue=w(se);typeof se=="number"||typeof se=="boolean"?(B.__data[0]=se,s.bufferSubData(s.UNIFORM_BUFFER,ee+oe,B.__data)):se.isMatrix3?(B.__data[0]=se.elements[0],B.__data[1]=se.elements[1],B.__data[2]=se.elements[2],B.__data[3]=0,B.__data[4]=se.elements[3],B.__data[5]=se.elements[4],B.__data[6]=se.elements[5],B.__data[7]=0,B.__data[8]=se.elements[6],B.__data[9]=se.elements[7],B.__data[10]=se.elements[8],B.__data[11]=0):(se.toArray(B.__data,oe),oe+=ue.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,ee,B.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function _(N,b,A,W){const U=N.value,z=b+"_"+A;if(W[z]===void 0)return typeof U=="number"||typeof U=="boolean"?W[z]=U:W[z]=U.clone(),!0;{const V=W[z];if(typeof U=="number"||typeof U=="boolean"){if(V!==U)return W[z]=U,!0}else if(V.equals(U)===!1)return V.copy(U),!0}return!1}function M(N){const b=N.uniforms;let A=0;const W=16;for(let z=0,V=b.length;z<V;z++){const L=Array.isArray(b[z])?b[z]:[b[z]];for(let R=0,B=L.length;R<B;R++){const ee=L[R],K=Array.isArray(ee.value)?ee.value:[ee.value];for(let oe=0,he=K.length;oe<he;oe++){const se=K[oe],ue=w(se),G=A%W,ce=G%ue.boundary,ae=G+ce;A+=ce,ae!==0&&W-ae<ue.storage&&(A+=W-ae),ee.__data=new Float32Array(ue.storage/Float32Array.BYTES_PER_ELEMENT),ee.__offset=A,A+=ue.storage}}}const U=A%W;return U>0&&(A+=W-U),N.__size=A,N.__cache={},this}function w(N){const b={boundary:0,storage:0};return typeof N=="number"||typeof N=="boolean"?(b.boundary=4,b.storage=4):N.isVector2?(b.boundary=8,b.storage=8):N.isVector3||N.isColor?(b.boundary=16,b.storage=12):N.isVector4?(b.boundary=16,b.storage=16):N.isMatrix3?(b.boundary=48,b.storage=48):N.isMatrix4?(b.boundary=64,b.storage=64):N.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",N),b}function S(N){const b=N.target;b.removeEventListener("dispose",S);const A=c.indexOf(b.__bindingPointIndex);c.splice(A,1),s.deleteBuffer(o[b.id]),delete o[b.id],delete a[b.id]}function y(){for(const N in o)s.deleteBuffer(o[N]);c=[],o={},a={}}return{bind:f,update:d,dispose:y}}class zE{constructor(e={}){const{canvas:t=A_(),context:i=null,depth:o=!0,stencil:a=!1,alpha:c=!1,antialias:h=!1,premultipliedAlpha:f=!0,preserveDrawingBuffer:d=!1,powerPreference:m="default",failIfMajorPerformanceCaveat:g=!1,reverseDepthBuffer:v=!1}=e;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=c;const M=new Uint32Array(4),w=new Int32Array(4);let S=null,y=null;const N=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Yn,this.toneMapping=Rr,this.toneMappingExposure=1;const A=this;let W=!1,U=0,z=0,V=null,L=-1,R=null;const B=new Dt,ee=new Dt;let K=null;const oe=new yt(0);let he=0,se=t.width,ue=t.height,G=1,ce=null,ae=null;const k=new Dt(0,0,se,ue),ie=new Dt(0,0,se,ue);let ze=!1;const Q=new Xf;let de=!1,we=!1;const ge=new Lt,be=new Lt,Be=new F,Ke=new Dt,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ve=!1;function Ae(){return V===null?G:1}let O=i;function Ze(P,Y){return t.getContext(P,Y)}try{const P={alpha:!0,depth:o,stencil:a,antialias:h,premultipliedAlpha:f,preserveDrawingBuffer:d,powerPreference:m,failIfMajorPerformanceCaveat:g};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${zf}`),t.addEventListener("webglcontextlost",me,!1),t.addEventListener("webglcontextrestored",Oe,!1),t.addEventListener("webglcontextcreationerror",Ue,!1),O===null){const Y="webgl2";if(O=Ze(Y,P),O===null)throw Ze(Y)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(P){throw console.error("THREE.WebGLRenderer: "+P.message),P}let Me,Ve,Pe,it,Fe,I,C,Z,fe,xe,pe,Ye,Le,He,dt,Ee,We,ot,at,je,xt,ht,bt,X;function Ne(){Me=new GS(O),Me.init(),ht=new RE(O,Me),Ve=new OS(O,Me,e,ht),Pe=new TE(O,Me),Ve.reverseDepthBuffer&&v&&Pe.buffers.depth.setReversed(!0),it=new XS(O),Fe=new uE,I=new CE(O,Me,Pe,Fe,Ve,ht,it),C=new kS(A),Z=new HS(A),fe=new Q_(O),bt=new US(O,fe),xe=new WS(O,fe,it,bt),pe=new qS(O,xe,fe,it),at=new YS(O,Ve,I),Ee=new zS(Fe),Ye=new cE(A,C,Z,Me,Ve,bt,Ee),Le=new FE(A,Fe),He=new fE,dt=new xE(Me),ot=new DS(A,C,Z,Pe,pe,_,f),We=new EE(A,pe,Ve),X=new OE(O,it,Ve,Pe),je=new FS(O,Me,it),xt=new jS(O,Me,it),it.programs=Ye.programs,A.capabilities=Ve,A.extensions=Me,A.properties=Fe,A.renderLists=He,A.shadowMap=We,A.state=Pe,A.info=it}Ne();const le=new DE(A,O);this.xr=le,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const P=Me.get("WEBGL_lose_context");P&&P.loseContext()},this.forceContextRestore=function(){const P=Me.get("WEBGL_lose_context");P&&P.restoreContext()},this.getPixelRatio=function(){return G},this.setPixelRatio=function(P){P!==void 0&&(G=P,this.setSize(se,ue,!1))},this.getSize=function(P){return P.set(se,ue)},this.setSize=function(P,Y,ne=!0){if(le.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}se=P,ue=Y,t.width=Math.floor(P*G),t.height=Math.floor(Y*G),ne===!0&&(t.style.width=P+"px",t.style.height=Y+"px"),this.setViewport(0,0,P,Y)},this.getDrawingBufferSize=function(P){return P.set(se*G,ue*G).floor()},this.setDrawingBufferSize=function(P,Y,ne){se=P,ue=Y,G=ne,t.width=Math.floor(P*ne),t.height=Math.floor(Y*ne),this.setViewport(0,0,P,Y)},this.getCurrentViewport=function(P){return P.copy(B)},this.getViewport=function(P){return P.copy(k)},this.setViewport=function(P,Y,ne,re){P.isVector4?k.set(P.x,P.y,P.z,P.w):k.set(P,Y,ne,re),Pe.viewport(B.copy(k).multiplyScalar(G).round())},this.getScissor=function(P){return P.copy(ie)},this.setScissor=function(P,Y,ne,re){P.isVector4?ie.set(P.x,P.y,P.z,P.w):ie.set(P,Y,ne,re),Pe.scissor(ee.copy(ie).multiplyScalar(G).round())},this.getScissorTest=function(){return ze},this.setScissorTest=function(P){Pe.setScissorTest(ze=P)},this.setOpaqueSort=function(P){ce=P},this.setTransparentSort=function(P){ae=P},this.getClearColor=function(P){return P.copy(ot.getClearColor())},this.setClearColor=function(){ot.setClearColor.apply(ot,arguments)},this.getClearAlpha=function(){return ot.getClearAlpha()},this.setClearAlpha=function(){ot.setClearAlpha.apply(ot,arguments)},this.clear=function(P=!0,Y=!0,ne=!0){let re=0;if(P){let q=!1;if(V!==null){const Re=V.texture.format;q=Re===jf||Re===Wf||Re===Gf}if(q){const Re=V.texture.type,Te=Re===Ji||Re===ls||Re===fa||Re===oo||Re===Bf||Re===Vf,Je=ot.getClearColor(),qe=ot.getClearAlpha(),lt=Je.r,ut=Je.g,Qe=Je.b;Te?(M[0]=lt,M[1]=ut,M[2]=Qe,M[3]=qe,O.clearBufferuiv(O.COLOR,0,M)):(w[0]=lt,w[1]=ut,w[2]=Qe,w[3]=qe,O.clearBufferiv(O.COLOR,0,w))}else re|=O.COLOR_BUFFER_BIT}Y&&(re|=O.DEPTH_BUFFER_BIT),ne&&(re|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),O.clear(re)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",Oe,!1),t.removeEventListener("webglcontextcreationerror",Ue,!1),He.dispose(),dt.dispose(),Fe.dispose(),C.dispose(),Z.dispose(),pe.dispose(),bt.dispose(),X.dispose(),Ye.dispose(),le.dispose(),le.removeEventListener("sessionstart",fs),le.removeEventListener("sessionend",Qi),Li.stop()};function me(P){P.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),W=!0}function Oe(){console.log("THREE.WebGLRenderer: Context Restored."),W=!1;const P=it.autoReset,Y=We.enabled,ne=We.autoUpdate,re=We.needsUpdate,q=We.type;Ne(),it.autoReset=P,We.enabled=Y,We.autoUpdate=ne,We.needsUpdate=re,We.type=q}function Ue(P){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",P.statusMessage)}function ft(P){const Y=P.target;Y.removeEventListener("dispose",ft),zt(Y)}function zt(P){Kt(P),Fe.remove(P)}function Kt(P){const Y=Fe.get(P).programs;Y!==void 0&&(Y.forEach(function(ne){Ye.releaseProgram(ne)}),P.isShaderMaterial&&Ye.releaseShaderCache(P))}this.renderBufferDirect=function(P,Y,ne,re,q,Re){Y===null&&(Y=vt);const Te=q.isMesh&&q.matrixWorld.determinant()<0,Je=Sa(P,Y,ne,re,q);Pe.setMaterial(re,Te);let qe=ne.index,lt=1;if(re.wireframe===!0){if(qe=xe.getWireframeAttribute(ne),qe===void 0)return;lt=2}const ut=ne.drawRange,Qe=ne.attributes.position;let Mt=ut.start*lt,Rt=(ut.start+ut.count)*lt;Re!==null&&(Mt=Math.max(Mt,Re.start*lt),Rt=Math.min(Rt,(Re.start+Re.count)*lt)),qe!==null?(Mt=Math.max(Mt,0),Rt=Math.min(Rt,qe.count)):Qe!=null&&(Mt=Math.max(Mt,0),Rt=Math.min(Rt,Qe.count));const St=Rt-Mt;if(St<0||St===1/0)return;bt.setup(q,re,Je,ne,qe);let fn,pt=je;if(qe!==null&&(fn=fe.get(qe),pt=xt,pt.setIndex(fn)),q.isMesh)re.wireframe===!0?(Pe.setLineWidth(re.wireframeLinewidth*Ae()),pt.setMode(O.LINES)):pt.setMode(O.TRIANGLES);else if(q.isLine){let tt=re.linewidth;tt===void 0&&(tt=1),Pe.setLineWidth(tt*Ae()),q.isLineSegments?pt.setMode(O.LINES):q.isLineLoop?pt.setMode(O.LINE_LOOP):pt.setMode(O.LINE_STRIP)}else q.isPoints?pt.setMode(O.POINTS):q.isSprite&&pt.setMode(O.TRIANGLES);if(q.isBatchedMesh)if(q._multiDrawInstances!==null)pt.renderMultiDrawInstances(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount,q._multiDrawInstances);else if(Me.get("WEBGL_multi_draw"))pt.renderMultiDraw(q._multiDrawStarts,q._multiDrawCounts,q._multiDrawCount);else{const tt=q._multiDrawStarts,oi=q._multiDrawCounts,At=q._multiDrawCount,dn=qe?fe.get(qe).bytesPerElement:1,ai=Fe.get(re).currentProgram.getUniforms();for(let Zt=0;Zt<At;Zt++)ai.setValue(O,"_gl_DrawID",Zt),pt.render(tt[Zt]/dn,oi[Zt])}else if(q.isInstancedMesh)pt.renderInstances(Mt,St,q.count);else if(ne.isInstancedBufferGeometry){const tt=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,oi=Math.min(ne.instanceCount,tt);pt.renderInstances(Mt,St,oi)}else pt.render(Mt,St)};function Et(P,Y,ne){P.transparent===!0&&P.side===$i&&P.forceSinglePass===!1?(P.side=kn,P.needsUpdate=!0,ds(P,Y,ne),P.side=br,P.needsUpdate=!0,ds(P,Y,ne),P.side=$i):ds(P,Y,ne)}this.compile=function(P,Y,ne=null){ne===null&&(ne=P),y=dt.get(ne),y.init(Y),b.push(y),ne.traverseVisible(function(q){q.isLight&&q.layers.test(Y.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),P!==ne&&P.traverseVisible(function(q){q.isLight&&q.layers.test(Y.layers)&&(y.pushLight(q),q.castShadow&&y.pushShadow(q))}),y.setupLights();const re=new Set;return P.traverse(function(q){if(!(q.isMesh||q.isPoints||q.isLine||q.isSprite))return;const Re=q.material;if(Re)if(Array.isArray(Re))for(let Te=0;Te<Re.length;Te++){const Je=Re[Te];Et(Je,ne,q),re.add(Je)}else Et(Re,ne,q),re.add(Re)}),b.pop(),y=null,re},this.compileAsync=function(P,Y,ne=null){const re=this.compile(P,Y,ne);return new Promise(q=>{function Re(){if(re.forEach(function(Te){Fe.get(Te).currentProgram.isReady()&&re.delete(Te)}),re.size===0){q(P);return}setTimeout(Re,10)}Me.get("KHR_parallel_shader_compile")!==null?Re():setTimeout(Re,10)})};let Cn=null;function Sn(P){Cn&&Cn(P)}function fs(){Li.stop()}function Qi(){Li.start()}const Li=new Lg;Li.setAnimationLoop(Sn),typeof self<"u"&&Li.setContext(self),this.setAnimationLoop=function(P){Cn=P,le.setAnimationLoop(P),P===null?Li.stop():Li.start()},le.addEventListener("sessionstart",fs),le.addEventListener("sessionend",Qi),this.render=function(P,Y){if(Y!==void 0&&Y.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(W===!0)return;if(P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),Y.parent===null&&Y.matrixWorldAutoUpdate===!0&&Y.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(Y),Y=le.getCamera()),P.isScene===!0&&P.onBeforeRender(A,P,Y,V),y=dt.get(P,b.length),y.init(Y),b.push(y),be.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),Q.setFromProjectionMatrix(be),we=this.localClippingEnabled,de=Ee.init(this.clippingPlanes,we),S=He.get(P,N.length),S.init(),N.push(S),le.enabled===!0&&le.isPresenting===!0){const Re=A.xr.getDepthSensingMesh();Re!==null&&Ni(Re,Y,-1/0,A.sortObjects)}Ni(P,Y,0,A.sortObjects),S.finish(),A.sortObjects===!0&&S.sort(ce,ae),ve=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,ve&&ot.addToRenderList(S,P),this.info.render.frame++,de===!0&&Ee.beginShadows();const ne=y.state.shadowsArray;We.render(ne,P,Y),de===!0&&Ee.endShadows(),this.info.autoReset===!0&&this.info.reset();const re=S.opaque,q=S.transmissive;if(y.setupLights(),Y.isArrayCamera){const Re=Y.cameras;if(q.length>0)for(let Te=0,Je=Re.length;Te<Je;Te++){const qe=Re[Te];Ur(re,q,P,qe)}ve&&ot.render(P);for(let Te=0,Je=Re.length;Te<Je;Te++){const qe=Re[Te];Dr(S,P,qe,qe.viewport)}}else q.length>0&&Ur(re,q,P,Y),ve&&ot.render(P),Dr(S,P,Y);V!==null&&(I.updateMultisampleRenderTarget(V),I.updateRenderTargetMipmap(V)),P.isScene===!0&&P.onAfterRender(A,P,Y),bt.resetDefaultState(),L=-1,R=null,b.pop(),b.length>0?(y=b[b.length-1],de===!0&&Ee.setGlobalState(A.clippingPlanes,y.state.camera)):y=null,N.pop(),N.length>0?S=N[N.length-1]:S=null};function Ni(P,Y,ne,re){if(P.visible===!1)return;if(P.layers.test(Y.layers)){if(P.isGroup)ne=P.renderOrder;else if(P.isLOD)P.autoUpdate===!0&&P.update(Y);else if(P.isLight)y.pushLight(P),P.castShadow&&y.pushShadow(P);else if(P.isSprite){if(!P.frustumCulled||Q.intersectsSprite(P)){re&&Ke.setFromMatrixPosition(P.matrixWorld).applyMatrix4(be);const Te=pe.update(P),Je=P.material;Je.visible&&S.push(P,Te,Je,ne,Ke.z,null)}}else if((P.isMesh||P.isLine||P.isPoints)&&(!P.frustumCulled||Q.intersectsObject(P))){const Te=pe.update(P),Je=P.material;if(re&&(P.boundingSphere!==void 0?(P.boundingSphere===null&&P.computeBoundingSphere(),Ke.copy(P.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),Ke.copy(Te.boundingSphere.center)),Ke.applyMatrix4(P.matrixWorld).applyMatrix4(be)),Array.isArray(Je)){const qe=Te.groups;for(let lt=0,ut=qe.length;lt<ut;lt++){const Qe=qe[lt],Mt=Je[Qe.materialIndex];Mt&&Mt.visible&&S.push(P,Te,Mt,ne,Ke.z,Qe)}}else Je.visible&&S.push(P,Te,Je,ne,Ke.z,null)}}const Re=P.children;for(let Te=0,Je=Re.length;Te<Je;Te++)Ni(Re[Te],Y,ne,re)}function Dr(P,Y,ne,re){const q=P.opaque,Re=P.transmissive,Te=P.transparent;y.setupLightsView(ne),de===!0&&Ee.setGlobalState(A.clippingPlanes,ne),re&&Pe.viewport(B.copy(re)),q.length>0&&er(q,Y,ne),Re.length>0&&er(Re,Y,ne),Te.length>0&&er(Te,Y,ne),Pe.buffers.depth.setTest(!0),Pe.buffers.depth.setMask(!0),Pe.buffers.color.setMask(!0),Pe.setPolygonOffset(!1)}function Ur(P,Y,ne,re){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;y.state.transmissionRenderTarget[re.id]===void 0&&(y.state.transmissionRenderTarget[re.id]=new cs(1,1,{generateMipmaps:!0,type:Me.has("EXT_color_buffer_half_float")||Me.has("EXT_color_buffer_float")?xa:Ji,minFilter:os,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Tt.workingColorSpace}));const Re=y.state.transmissionRenderTarget[re.id],Te=re.viewport||B;Re.setSize(Te.z,Te.w);const Je=A.getRenderTarget();A.setRenderTarget(Re),A.getClearColor(oe),he=A.getClearAlpha(),he<1&&A.setClearColor(16777215,.5),A.clear(),ve&&ot.render(ne);const qe=A.toneMapping;A.toneMapping=Rr;const lt=re.viewport;if(re.viewport!==void 0&&(re.viewport=void 0),y.setupLightsView(re),de===!0&&Ee.setGlobalState(A.clippingPlanes,re),er(P,ne,re),I.updateMultisampleRenderTarget(Re),I.updateRenderTargetMipmap(Re),Me.has("WEBGL_multisampled_render_to_texture")===!1){let ut=!1;for(let Qe=0,Mt=Y.length;Qe<Mt;Qe++){const Rt=Y[Qe],St=Rt.object,fn=Rt.geometry,pt=Rt.material,tt=Rt.group;if(pt.side===$i&&St.layers.test(re.layers)){const oi=pt.side;pt.side=kn,pt.needsUpdate=!0,_a(St,ne,re,fn,pt,tt),pt.side=oi,pt.needsUpdate=!0,ut=!0}}ut===!0&&(I.updateMultisampleRenderTarget(Re),I.updateRenderTargetMipmap(Re))}A.setRenderTarget(Je),A.setClearColor(oe,he),lt!==void 0&&(re.viewport=lt),A.toneMapping=qe}function er(P,Y,ne){const re=Y.isScene===!0?Y.overrideMaterial:null;for(let q=0,Re=P.length;q<Re;q++){const Te=P[q],Je=Te.object,qe=Te.geometry,lt=re===null?Te.material:re,ut=Te.group;Je.layers.test(ne.layers)&&_a(Je,Y,ne,qe,lt,ut)}}function _a(P,Y,ne,re,q,Re){P.onBeforeRender(A,Y,ne,re,q,Re),P.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,P.matrixWorld),P.normalMatrix.getNormalMatrix(P.modelViewMatrix),q.onBeforeRender(A,Y,ne,re,P,Re),q.transparent===!0&&q.side===$i&&q.forceSinglePass===!1?(q.side=kn,q.needsUpdate=!0,A.renderBufferDirect(ne,Y,re,q,P,Re),q.side=br,q.needsUpdate=!0,A.renderBufferDirect(ne,Y,re,q,P,Re),q.side=$i):A.renderBufferDirect(ne,Y,re,q,P,Re),P.onAfterRender(A,Y,ne,re,q,Re)}function ds(P,Y,ne){Y.isScene!==!0&&(Y=vt);const re=Fe.get(P),q=y.state.lights,Re=y.state.shadowsArray,Te=q.state.version,Je=Ye.getParameters(P,q.state,Re,Y,ne),qe=Ye.getProgramCacheKey(Je);let lt=re.programs;re.environment=P.isMeshStandardMaterial?Y.environment:null,re.fog=Y.fog,re.envMap=(P.isMeshStandardMaterial?Z:C).get(P.envMap||re.environment),re.envMapRotation=re.environment!==null&&P.envMap===null?Y.environmentRotation:P.envMapRotation,lt===void 0&&(P.addEventListener("dispose",ft),lt=new Map,re.programs=lt);let ut=lt.get(qe);if(ut!==void 0){if(re.currentProgram===ut&&re.lightsStateVersion===Te)return yi(P,Je),ut}else Je.uniforms=Ye.getUniforms(P),P.onBeforeCompile(Je,A),ut=Ye.acquireProgram(Je,qe),lt.set(qe,ut),re.uniforms=Je.uniforms;const Qe=re.uniforms;return(!P.isShaderMaterial&&!P.isRawShaderMaterial||P.clipping===!0)&&(Qe.clippingPlanes=Ee.uniform),yi(P,Je),re.needsLights=Sc(P),re.lightsStateVersion=Te,re.needsLights&&(Qe.ambientLightColor.value=q.state.ambient,Qe.lightProbe.value=q.state.probe,Qe.directionalLights.value=q.state.directional,Qe.directionalLightShadows.value=q.state.directionalShadow,Qe.spotLights.value=q.state.spot,Qe.spotLightShadows.value=q.state.spotShadow,Qe.rectAreaLights.value=q.state.rectArea,Qe.ltc_1.value=q.state.rectAreaLTC1,Qe.ltc_2.value=q.state.rectAreaLTC2,Qe.pointLights.value=q.state.point,Qe.pointLightShadows.value=q.state.pointShadow,Qe.hemisphereLights.value=q.state.hemi,Qe.directionalShadowMap.value=q.state.directionalShadowMap,Qe.directionalShadowMatrix.value=q.state.directionalShadowMatrix,Qe.spotShadowMap.value=q.state.spotShadowMap,Qe.spotLightMatrix.value=q.state.spotLightMatrix,Qe.spotLightMap.value=q.state.spotLightMap,Qe.pointShadowMap.value=q.state.pointShadowMap,Qe.pointShadowMatrix.value=q.state.pointShadowMatrix),re.currentProgram=ut,re.uniformsList=null,ut}function ya(P){if(P.uniformsList===null){const Y=P.currentProgram.getUniforms();P.uniformsList=ic.seqWithValue(Y.seq,P.uniforms)}return P.uniformsList}function yi(P,Y){const ne=Fe.get(P);ne.outputColorSpace=Y.outputColorSpace,ne.batching=Y.batching,ne.batchingColor=Y.batchingColor,ne.instancing=Y.instancing,ne.instancingColor=Y.instancingColor,ne.instancingMorph=Y.instancingMorph,ne.skinning=Y.skinning,ne.morphTargets=Y.morphTargets,ne.morphNormals=Y.morphNormals,ne.morphColors=Y.morphColors,ne.morphTargetsCount=Y.morphTargetsCount,ne.numClippingPlanes=Y.numClippingPlanes,ne.numIntersection=Y.numClipIntersection,ne.vertexAlphas=Y.vertexAlphas,ne.vertexTangents=Y.vertexTangents,ne.toneMapping=Y.toneMapping}function Sa(P,Y,ne,re,q){Y.isScene!==!0&&(Y=vt),I.resetTextureUnits();const Re=Y.fog,Te=re.isMeshStandardMaterial?Y.environment:null,Je=V===null?A.outputColorSpace:V.isXRRenderTarget===!0?V.texture.colorSpace:co,qe=(re.isMeshStandardMaterial?Z:C).get(re.envMap||Te),lt=re.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,ut=!!ne.attributes.tangent&&(!!re.normalMap||re.anisotropy>0),Qe=!!ne.morphAttributes.position,Mt=!!ne.morphAttributes.normal,Rt=!!ne.morphAttributes.color;let St=Rr;re.toneMapped&&(V===null||V.isXRRenderTarget===!0)&&(St=A.toneMapping);const fn=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,pt=fn!==void 0?fn.length:0,tt=Fe.get(re),oi=y.state.lights;if(de===!0&&(we===!0||P!==R)){const Mn=P===R&&re.id===L;Ee.setState(re,P,Mn)}let At=!1;re.version===tt.__version?(tt.needsLights&&tt.lightsStateVersion!==oi.state.version||tt.outputColorSpace!==Je||q.isBatchedMesh&&tt.batching===!1||!q.isBatchedMesh&&tt.batching===!0||q.isBatchedMesh&&tt.batchingColor===!0&&q.colorTexture===null||q.isBatchedMesh&&tt.batchingColor===!1&&q.colorTexture!==null||q.isInstancedMesh&&tt.instancing===!1||!q.isInstancedMesh&&tt.instancing===!0||q.isSkinnedMesh&&tt.skinning===!1||!q.isSkinnedMesh&&tt.skinning===!0||q.isInstancedMesh&&tt.instancingColor===!0&&q.instanceColor===null||q.isInstancedMesh&&tt.instancingColor===!1&&q.instanceColor!==null||q.isInstancedMesh&&tt.instancingMorph===!0&&q.morphTexture===null||q.isInstancedMesh&&tt.instancingMorph===!1&&q.morphTexture!==null||tt.envMap!==qe||re.fog===!0&&tt.fog!==Re||tt.numClippingPlanes!==void 0&&(tt.numClippingPlanes!==Ee.numPlanes||tt.numIntersection!==Ee.numIntersection)||tt.vertexAlphas!==lt||tt.vertexTangents!==ut||tt.morphTargets!==Qe||tt.morphNormals!==Mt||tt.morphColors!==Rt||tt.toneMapping!==St||tt.morphTargetsCount!==pt)&&(At=!0):(At=!0,tt.__version=re.version);let dn=tt.currentProgram;At===!0&&(dn=ds(re,Y,q));let ai=!1,Zt=!1,Si=!1;const Ft=dn.getUniforms(),Kn=tt.uniforms;if(Pe.useProgram(dn.program)&&(ai=!0,Zt=!0,Si=!0),re.id!==L&&(L=re.id,Zt=!0),ai||R!==P){Pe.buffers.depth.getReversed()?(ge.copy(P.projectionMatrix),R_(ge),b_(ge),Ft.setValue(O,"projectionMatrix",ge)):Ft.setValue(O,"projectionMatrix",P.projectionMatrix),Ft.setValue(O,"viewMatrix",P.matrixWorldInverse);const Zn=Ft.map.cameraPosition;Zn!==void 0&&Zn.setValue(O,Be.setFromMatrixPosition(P.matrixWorld)),Ve.logarithmicDepthBuffer&&Ft.setValue(O,"logDepthBufFC",2/(Math.log(P.far+1)/Math.LN2)),(re.isMeshPhongMaterial||re.isMeshToonMaterial||re.isMeshLambertMaterial||re.isMeshBasicMaterial||re.isMeshStandardMaterial||re.isShaderMaterial)&&Ft.setValue(O,"isOrthographic",P.isOrthographicCamera===!0),R!==P&&(R=P,Zt=!0,Si=!0)}if(q.isSkinnedMesh){Ft.setOptional(O,q,"bindMatrix"),Ft.setOptional(O,q,"bindMatrixInverse");const Mn=q.skeleton;Mn&&(Mn.boneTexture===null&&Mn.computeBoneTexture(),Ft.setValue(O,"boneTexture",Mn.boneTexture,I))}q.isBatchedMesh&&(Ft.setOptional(O,q,"batchingTexture"),Ft.setValue(O,"batchingTexture",q._matricesTexture,I),Ft.setOptional(O,q,"batchingIdTexture"),Ft.setValue(O,"batchingIdTexture",q._indirectTexture,I),Ft.setOptional(O,q,"batchingColorTexture"),q._colorsTexture!==null&&Ft.setValue(O,"batchingColorTexture",q._colorsTexture,I));const Ii=ne.morphAttributes;if((Ii.position!==void 0||Ii.normal!==void 0||Ii.color!==void 0)&&at.update(q,ne,dn),(Zt||tt.receiveShadow!==q.receiveShadow)&&(tt.receiveShadow=q.receiveShadow,Ft.setValue(O,"receiveShadow",q.receiveShadow)),re.isMeshGouraudMaterial&&re.envMap!==null&&(Kn.envMap.value=qe,Kn.flipEnvMap.value=qe.isCubeTexture&&qe.isRenderTargetTexture===!1?-1:1),re.isMeshStandardMaterial&&re.envMap===null&&Y.environment!==null&&(Kn.envMapIntensity.value=Y.environmentIntensity),Zt&&(Ft.setValue(O,"toneMappingExposure",A.toneMappingExposure),tt.needsLights&&Ma(Kn,Si),Re&&re.fog===!0&&Le.refreshFogUniforms(Kn,Re),Le.refreshMaterialUniforms(Kn,re,G,ue,y.state.transmissionRenderTarget[P.id]),ic.upload(O,ya(tt),Kn,I)),re.isShaderMaterial&&re.uniformsNeedUpdate===!0&&(ic.upload(O,ya(tt),Kn,I),re.uniformsNeedUpdate=!1),re.isSpriteMaterial&&Ft.setValue(O,"center",q.center),Ft.setValue(O,"modelViewMatrix",q.modelViewMatrix),Ft.setValue(O,"normalMatrix",q.normalMatrix),Ft.setValue(O,"modelMatrix",q.matrixWorld),re.isShaderMaterial||re.isRawShaderMaterial){const Mn=re.uniformsGroups;for(let Zn=0,Rn=Mn.length;Zn<Rn;Zn++){const Ea=Mn[Zn];X.update(Ea,dn),X.bind(Ea,dn)}}return dn}function Ma(P,Y){P.ambientLightColor.needsUpdate=Y,P.lightProbe.needsUpdate=Y,P.directionalLights.needsUpdate=Y,P.directionalLightShadows.needsUpdate=Y,P.pointLights.needsUpdate=Y,P.pointLightShadows.needsUpdate=Y,P.spotLights.needsUpdate=Y,P.spotLightShadows.needsUpdate=Y,P.rectAreaLights.needsUpdate=Y,P.hemisphereLights.needsUpdate=Y}function Sc(P){return P.isMeshLambertMaterial||P.isMeshToonMaterial||P.isMeshPhongMaterial||P.isMeshStandardMaterial||P.isShadowMaterial||P.isShaderMaterial&&P.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return z},this.getRenderTarget=function(){return V},this.setRenderTargetTextures=function(P,Y,ne){Fe.get(P.texture).__webglTexture=Y,Fe.get(P.depthTexture).__webglTexture=ne;const re=Fe.get(P);re.__hasExternalTextures=!0,re.__autoAllocateDepthBuffer=ne===void 0,re.__autoAllocateDepthBuffer||Me.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),re.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(P,Y){const ne=Fe.get(P);ne.__webglFramebuffer=Y,ne.__useDefaultFramebuffer=Y===void 0},this.setRenderTarget=function(P,Y=0,ne=0){V=P,U=Y,z=ne;let re=!0,q=null,Re=!1,Te=!1;if(P){const qe=Fe.get(P);if(qe.__useDefaultFramebuffer!==void 0)Pe.bindFramebuffer(O.FRAMEBUFFER,null),re=!1;else if(qe.__webglFramebuffer===void 0)I.setupRenderTarget(P);else if(qe.__hasExternalTextures)I.rebindTextures(P,Fe.get(P.texture).__webglTexture,Fe.get(P.depthTexture).__webglTexture);else if(P.depthBuffer){const Qe=P.depthTexture;if(qe.__boundDepthTexture!==Qe){if(Qe!==null&&Fe.has(Qe)&&(P.width!==Qe.image.width||P.height!==Qe.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");I.setupDepthRenderbuffer(P)}}const lt=P.texture;(lt.isData3DTexture||lt.isDataArrayTexture||lt.isCompressedArrayTexture)&&(Te=!0);const ut=Fe.get(P).__webglFramebuffer;P.isWebGLCubeRenderTarget?(Array.isArray(ut[Y])?q=ut[Y][ne]:q=ut[Y],Re=!0):P.samples>0&&I.useMultisampledRTT(P)===!1?q=Fe.get(P).__webglMultisampledFramebuffer:Array.isArray(ut)?q=ut[ne]:q=ut,B.copy(P.viewport),ee.copy(P.scissor),K=P.scissorTest}else B.copy(k).multiplyScalar(G).floor(),ee.copy(ie).multiplyScalar(G).floor(),K=ze;if(Pe.bindFramebuffer(O.FRAMEBUFFER,q)&&re&&Pe.drawBuffers(P,q),Pe.viewport(B),Pe.scissor(ee),Pe.setScissorTest(K),Re){const qe=Fe.get(P.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+Y,qe.__webglTexture,ne)}else if(Te){const qe=Fe.get(P.texture),lt=Y||0;O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,qe.__webglTexture,ne||0,lt)}L=-1},this.readRenderTargetPixels=function(P,Y,ne,re,q,Re,Te){if(!(P&&P.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Je=Fe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Te!==void 0&&(Je=Je[Te]),Je){Pe.bindFramebuffer(O.FRAMEBUFFER,Je);try{const qe=P.texture,lt=qe.format,ut=qe.type;if(!Ve.textureFormatReadable(lt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ve.textureTypeReadable(ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}Y>=0&&Y<=P.width-re&&ne>=0&&ne<=P.height-q&&O.readPixels(Y,ne,re,q,ht.convert(lt),ht.convert(ut),Re)}finally{const qe=V!==null?Fe.get(V).__webglFramebuffer:null;Pe.bindFramebuffer(O.FRAMEBUFFER,qe)}}},this.readRenderTargetPixelsAsync=async function(P,Y,ne,re,q,Re,Te){if(!(P&&P.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Je=Fe.get(P).__webglFramebuffer;if(P.isWebGLCubeRenderTarget&&Te!==void 0&&(Je=Je[Te]),Je){const qe=P.texture,lt=qe.format,ut=qe.type;if(!Ve.textureFormatReadable(lt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ve.textureTypeReadable(ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(Y>=0&&Y<=P.width-re&&ne>=0&&ne<=P.height-q){Pe.bindFramebuffer(O.FRAMEBUFFER,Je);const Qe=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Qe),O.bufferData(O.PIXEL_PACK_BUFFER,Re.byteLength,O.STREAM_READ),O.readPixels(Y,ne,re,q,ht.convert(lt),ht.convert(ut),0);const Mt=V!==null?Fe.get(V).__webglFramebuffer:null;Pe.bindFramebuffer(O.FRAMEBUFFER,Mt);const Rt=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await C_(O,Rt,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Qe),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,Re),O.deleteBuffer(Qe),O.deleteSync(Rt),Re}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(P,Y=null,ne=0){P.isTexture!==!0&&(ia("WebGLRenderer: copyFramebufferToTexture function signature has changed."),Y=arguments[0]||null,P=arguments[1]);const re=Math.pow(2,-ne),q=Math.floor(P.image.width*re),Re=Math.floor(P.image.height*re),Te=Y!==null?Y.x:0,Je=Y!==null?Y.y:0;I.setTexture2D(P,0),O.copyTexSubImage2D(O.TEXTURE_2D,ne,0,0,Te,Je,q,Re),Pe.unbindTexture()},this.copyTextureToTexture=function(P,Y,ne=null,re=null,q=0){P.isTexture!==!0&&(ia("WebGLRenderer: copyTextureToTexture function signature has changed."),re=arguments[0]||null,P=arguments[1],Y=arguments[2],q=arguments[3]||0,ne=null);let Re,Te,Je,qe,lt,ut,Qe,Mt,Rt;const St=P.isCompressedTexture?P.mipmaps[q]:P.image;ne!==null?(Re=ne.max.x-ne.min.x,Te=ne.max.y-ne.min.y,Je=ne.isBox3?ne.max.z-ne.min.z:1,qe=ne.min.x,lt=ne.min.y,ut=ne.isBox3?ne.min.z:0):(Re=St.width,Te=St.height,Je=St.depth||1,qe=0,lt=0,ut=0),re!==null?(Qe=re.x,Mt=re.y,Rt=re.z):(Qe=0,Mt=0,Rt=0);const fn=ht.convert(Y.format),pt=ht.convert(Y.type);let tt;Y.isData3DTexture?(I.setTexture3D(Y,0),tt=O.TEXTURE_3D):Y.isDataArrayTexture||Y.isCompressedArrayTexture?(I.setTexture2DArray(Y,0),tt=O.TEXTURE_2D_ARRAY):(I.setTexture2D(Y,0),tt=O.TEXTURE_2D),O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,Y.flipY),O.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Y.premultiplyAlpha),O.pixelStorei(O.UNPACK_ALIGNMENT,Y.unpackAlignment);const oi=O.getParameter(O.UNPACK_ROW_LENGTH),At=O.getParameter(O.UNPACK_IMAGE_HEIGHT),dn=O.getParameter(O.UNPACK_SKIP_PIXELS),ai=O.getParameter(O.UNPACK_SKIP_ROWS),Zt=O.getParameter(O.UNPACK_SKIP_IMAGES);O.pixelStorei(O.UNPACK_ROW_LENGTH,St.width),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,St.height),O.pixelStorei(O.UNPACK_SKIP_PIXELS,qe),O.pixelStorei(O.UNPACK_SKIP_ROWS,lt),O.pixelStorei(O.UNPACK_SKIP_IMAGES,ut);const Si=P.isDataArrayTexture||P.isData3DTexture,Ft=Y.isDataArrayTexture||Y.isData3DTexture;if(P.isRenderTargetTexture||P.isDepthTexture){const Kn=Fe.get(P),Ii=Fe.get(Y),Mn=Fe.get(Kn.__renderTarget),Zn=Fe.get(Ii.__renderTarget);Pe.bindFramebuffer(O.READ_FRAMEBUFFER,Mn.__webglFramebuffer),Pe.bindFramebuffer(O.DRAW_FRAMEBUFFER,Zn.__webglFramebuffer);for(let Rn=0;Rn<Je;Rn++)Si&&O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Fe.get(P).__webglTexture,q,ut+Rn),P.isDepthTexture?(Ft&&O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Fe.get(Y).__webglTexture,q,Rt+Rn),O.blitFramebuffer(qe,lt,Re,Te,Qe,Mt,Re,Te,O.DEPTH_BUFFER_BIT,O.NEAREST)):Ft?O.copyTexSubImage3D(tt,q,Qe,Mt,Rt+Rn,qe,lt,Re,Te):O.copyTexSubImage2D(tt,q,Qe,Mt,Rt+Rn,qe,lt,Re,Te);Pe.bindFramebuffer(O.READ_FRAMEBUFFER,null),Pe.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else Ft?P.isDataTexture||P.isData3DTexture?O.texSubImage3D(tt,q,Qe,Mt,Rt,Re,Te,Je,fn,pt,St.data):Y.isCompressedArrayTexture?O.compressedTexSubImage3D(tt,q,Qe,Mt,Rt,Re,Te,Je,fn,St.data):O.texSubImage3D(tt,q,Qe,Mt,Rt,Re,Te,Je,fn,pt,St):P.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,q,Qe,Mt,Re,Te,fn,pt,St.data):P.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,q,Qe,Mt,St.width,St.height,fn,St.data):O.texSubImage2D(O.TEXTURE_2D,q,Qe,Mt,Re,Te,fn,pt,St);O.pixelStorei(O.UNPACK_ROW_LENGTH,oi),O.pixelStorei(O.UNPACK_IMAGE_HEIGHT,At),O.pixelStorei(O.UNPACK_SKIP_PIXELS,dn),O.pixelStorei(O.UNPACK_SKIP_ROWS,ai),O.pixelStorei(O.UNPACK_SKIP_IMAGES,Zt),q===0&&Y.generateMipmaps&&O.generateMipmap(tt),Pe.unbindTexture()},this.copyTextureToTexture3D=function(P,Y,ne=null,re=null,q=0){return P.isTexture!==!0&&(ia("WebGLRenderer: copyTextureToTexture3D function signature has changed."),ne=arguments[0]||null,re=arguments[1]||null,P=arguments[2],Y=arguments[3],q=arguments[4]||0),ia('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(P,Y,ne,re,q)},this.initRenderTarget=function(P){Fe.get(P).__webglFramebuffer===void 0&&I.setupRenderTarget(P)},this.initTexture=function(P){P.isCubeTexture?I.setTextureCube(P,0):P.isData3DTexture?I.setTexture3D(P,0):P.isDataArrayTexture||P.isCompressedArrayTexture?I.setTexture2DArray(P,0):I.setTexture2D(P,0),Pe.unbindTexture()},this.resetState=function(){U=0,z=0,V=null,Pe.reset(),bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ki}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorspace=Tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=Tt._getUnpackColorSpace()}}class qf{constructor(e,t=1,i=1e3){this.isFog=!0,this.name="",this.color=new yt(e),this.near=t,this.far=i}clone(){return new qf(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class L0 extends ln{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _i,this.environmentIntensity=1,this.environmentRotation=new _i,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class kE extends An{constructor(e=null,t=1,i=1,o,a,c,h,f,d=$n,m=$n,g,v){super(null,c,h,f,d,m,o,a,g,v),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class N0 extends si{constructor(e,t,i,o=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=o}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ks=new Lt,I0=new Lt,Xl=[],D0=new hs,BE=new Lt,Qo=new Ut,ea=new po;class rc extends Ut{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new N0(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let o=0;o<i;o++)this.setMatrixAt(o,BE)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new hs),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ks),D0.copy(e.boundingBox).applyMatrix4(Ks),this.boundingBox.union(D0)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new po),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,Ks),ea.copy(e.boundingSphere).applyMatrix4(Ks),this.boundingSphere.union(ea)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const i=t.morphTargetInfluences,o=this.morphTexture.source.data.data,a=i.length+1,c=e*a+1;for(let h=0;h<i.length;h++)i[h]=o[c+h]}raycast(e,t){const i=this.matrixWorld,o=this.count;if(Qo.geometry=this.geometry,Qo.material=this.material,Qo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ea.copy(this.boundingSphere),ea.applyMatrix4(i),e.ray.intersectsSphere(ea)!==!1))for(let a=0;a<o;a++){this.getMatrixAt(a,Ks),I0.multiplyMatrices(i,Ks),Qo.matrixWorld=I0,Qo.raycast(e,Xl);for(let c=0,h=Xl.length;c<h;c++){const f=Xl[c];f.instanceId=a,f.object=this,t.push(f)}Xl.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new N0(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const i=t.morphTargetInfluences,o=i.length+1;this.morphTexture===null&&(this.morphTexture=new kE(new Float32Array(o*this.count),o,this.count,Hf,bi));const a=this.morphTexture.source.data.data;let c=0;for(let d=0;d<i.length;d++)c+=i[d];const h=this.geometry.morphTargetsRelative?1:1-c,f=o*e;a[f]=h,a.set(i,f+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class aa extends Pr{static get type(){return"LineBasicMaterial"}constructor(e){super(),this.isLineBasicMaterial=!0,this.color=new yt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const ac=new F,lc=new F,U0=new Lt,ta=new Eg,Yl=new po,Dh=new F,F0=new F;class cc extends ln{constructor(e=new en,t=new aa){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let o=1,a=t.count;o<a;o++)ac.fromBufferAttribute(t,o-1),lc.fromBufferAttribute(t,o),i[o]=i[o-1],i[o]+=ac.distanceTo(lc);e.setAttribute("lineDistance",new Nt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,o=this.matrixWorld,a=e.params.Line.threshold,c=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Yl.copy(i.boundingSphere),Yl.applyMatrix4(o),Yl.radius+=a,e.ray.intersectsSphere(Yl)===!1)return;U0.copy(o).invert(),ta.copy(e.ray).applyMatrix4(U0);const h=a/((this.scale.x+this.scale.y+this.scale.z)/3),f=h*h,d=this.isLineSegments?2:1,m=i.index,v=i.attributes.position;if(m!==null){const _=Math.max(0,c.start),M=Math.min(m.count,c.start+c.count);for(let w=_,S=M-1;w<S;w+=d){const y=m.getX(w),N=m.getX(w+1),b=ql(this,e,ta,f,y,N);b&&t.push(b)}if(this.isLineLoop){const w=m.getX(M-1),S=m.getX(_),y=ql(this,e,ta,f,w,S);y&&t.push(y)}}else{const _=Math.max(0,c.start),M=Math.min(v.count,c.start+c.count);for(let w=_,S=M-1;w<S;w+=d){const y=ql(this,e,ta,f,w,w+1);y&&t.push(y)}if(this.isLineLoop){const w=ql(this,e,ta,f,M-1,_);w&&t.push(w)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const o=t[i[0]];if(o!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,c=o.length;a<c;a++){const h=o[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[h]=a}}}}}function ql(s,e,t,i,o,a){const c=s.geometry.attributes.position;if(ac.fromBufferAttribute(c,o),lc.fromBufferAttribute(c,a),t.distanceSqToSegment(ac,lc,Dh,F0)>i)return;Dh.applyMatrix4(s.matrixWorld);const f=e.ray.origin.distanceTo(Dh);if(!(f<e.near||f>e.far))return{distance:f,point:F0.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}const O0=new F,z0=new F;class VE extends cc{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let o=0,a=t.count;o<a;o+=2)O0.fromBufferAttribute(t,o),z0.fromBufferAttribute(t,o+1),i[o]=o===0?0:i[o-1],i[o+1]=i[o]+O0.distanceTo(z0);e.setAttribute("lineDistance",new Nt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Pi{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,o=this.getPoint(0),a=0;t.push(0);for(let c=1;c<=e;c++)i=this.getPoint(c/e),a+=i.distanceTo(o),t.push(a),o=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const i=this.getLengths();let o=0;const a=i.length;let c;t?c=t:c=e*i[a-1];let h=0,f=a-1,d;for(;h<=f;)if(o=Math.floor(h+(f-h)/2),d=i[o]-c,d<0)h=o+1;else if(d>0)f=o-1;else{f=o;break}if(o=f,i[o]===c)return o/(a-1);const m=i[o],v=i[o+1]-m,_=(c-m)/v;return(o+_)/(a-1)}getTangent(e,t){let o=e-1e-4,a=e+1e-4;o<0&&(o=0),a>1&&(a=1);const c=this.getPoint(o),h=this.getPoint(a),f=t||(c.isVector2?new Ie:new F);return f.copy(h).sub(c).normalize(),f}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t){const i=new F,o=[],a=[],c=[],h=new F,f=new Lt;for(let _=0;_<=e;_++){const M=_/e;o[_]=this.getTangentAt(M,new F)}a[0]=new F,c[0]=new F;let d=Number.MAX_VALUE;const m=Math.abs(o[0].x),g=Math.abs(o[0].y),v=Math.abs(o[0].z);m<=d&&(d=m,i.set(1,0,0)),g<=d&&(d=g,i.set(0,1,0)),v<=d&&i.set(0,0,1),h.crossVectors(o[0],i).normalize(),a[0].crossVectors(o[0],h),c[0].crossVectors(o[0],a[0]);for(let _=1;_<=e;_++){if(a[_]=a[_-1].clone(),c[_]=c[_-1].clone(),h.crossVectors(o[_-1],o[_]),h.length()>Number.EPSILON){h.normalize();const M=Math.acos(yn(o[_-1].dot(o[_]),-1,1));a[_].applyMatrix4(f.makeRotationAxis(h,M))}c[_].crossVectors(o[_],a[_])}if(t===!0){let _=Math.acos(yn(a[0].dot(a[e]),-1,1));_/=e,o[0].dot(h.crossVectors(a[0],a[e]))>0&&(_=-_);for(let M=1;M<=e;M++)a[M].applyMatrix4(f.makeRotationAxis(o[M],_*M)),c[M].crossVectors(o[M],a[M])}return{tangents:o,normals:a,binormals:c}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class $f extends Pi{constructor(e=0,t=0,i=1,o=1,a=0,c=Math.PI*2,h=!1,f=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=o,this.aStartAngle=a,this.aEndAngle=c,this.aClockwise=h,this.aRotation=f}getPoint(e,t=new Ie){const i=t,o=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const c=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=o;for(;a>o;)a-=o;a<Number.EPSILON&&(c?a=0:a=o),this.aClockwise===!0&&!c&&(a===o?a=-o:a=a-o);const h=this.aStartAngle+e*a;let f=this.aX+this.xRadius*Math.cos(h),d=this.aY+this.yRadius*Math.sin(h);if(this.aRotation!==0){const m=Math.cos(this.aRotation),g=Math.sin(this.aRotation),v=f-this.aX,_=d-this.aY;f=v*m-_*g+this.aX,d=v*g+_*m+this.aY}return i.set(f,d)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class HE extends $f{constructor(e,t,i,o,a,c){super(e,t,i,i,o,a,c),this.isArcCurve=!0,this.type="ArcCurve"}}function Kf(){let s=0,e=0,t=0,i=0;function o(a,c,h,f){s=a,e=h,t=-3*a+3*c-2*h-f,i=2*a-2*c+h+f}return{initCatmullRom:function(a,c,h,f,d){o(c,h,d*(h-a),d*(f-c))},initNonuniformCatmullRom:function(a,c,h,f,d,m,g){let v=(c-a)/d-(h-a)/(d+m)+(h-c)/m,_=(h-c)/m-(f-c)/(m+g)+(f-h)/g;v*=m,_*=m,o(c,h,v,_)},calc:function(a){const c=a*a,h=c*a;return s+e*a+t*c+i*h}}}const $l=new F,Uh=new Kf,Fh=new Kf,Oh=new Kf;class GE extends Pi{constructor(e=[],t=!1,i="centripetal",o=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=o}getPoint(e,t=new F){const i=t,o=this.points,a=o.length,c=(a-(this.closed?0:1))*e;let h=Math.floor(c),f=c-h;this.closed?h+=h>0?0:(Math.floor(Math.abs(h)/a)+1)*a:f===0&&h===a-1&&(h=a-2,f=1);let d,m;this.closed||h>0?d=o[(h-1)%a]:($l.subVectors(o[0],o[1]).add(o[0]),d=$l);const g=o[h%a],v=o[(h+1)%a];if(this.closed||h+2<a?m=o[(h+2)%a]:($l.subVectors(o[a-1],o[a-2]).add(o[a-1]),m=$l),this.curveType==="centripetal"||this.curveType==="chordal"){const _=this.curveType==="chordal"?.5:.25;let M=Math.pow(d.distanceToSquared(g),_),w=Math.pow(g.distanceToSquared(v),_),S=Math.pow(v.distanceToSquared(m),_);w<1e-4&&(w=1),M<1e-4&&(M=w),S<1e-4&&(S=w),Uh.initNonuniformCatmullRom(d.x,g.x,v.x,m.x,M,w,S),Fh.initNonuniformCatmullRom(d.y,g.y,v.y,m.y,M,w,S),Oh.initNonuniformCatmullRom(d.z,g.z,v.z,m.z,M,w,S)}else this.curveType==="catmullrom"&&(Uh.initCatmullRom(d.x,g.x,v.x,m.x,this.tension),Fh.initCatmullRom(d.y,g.y,v.y,m.y,this.tension),Oh.initCatmullRom(d.z,g.z,v.z,m.z,this.tension));return i.set(Uh.calc(f),Fh.calc(f),Oh.calc(f)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const o=e.points[t];this.points.push(o.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const o=this.points[t];e.points.push(o.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const o=e.points[t];this.points.push(new F().fromArray(o))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function k0(s,e,t,i,o){const a=(i-e)*.5,c=(o-t)*.5,h=s*s,f=s*h;return(2*t-2*i+a+c)*f+(-3*t+3*i-2*a-c)*h+a*s+t}function WE(s,e){const t=1-s;return t*t*e}function jE(s,e){return 2*(1-s)*s*e}function XE(s,e){return s*s*e}function la(s,e,t,i){return WE(s,e)+jE(s,t)+XE(s,i)}function YE(s,e){const t=1-s;return t*t*t*e}function qE(s,e){const t=1-s;return 3*t*t*s*e}function $E(s,e){return 3*(1-s)*s*s*e}function KE(s,e){return s*s*s*e}function ca(s,e,t,i,o){return YE(s,e)+qE(s,t)+$E(s,i)+KE(s,o)}class zg extends Pi{constructor(e=new Ie,t=new Ie,i=new Ie,o=new Ie){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=o}getPoint(e,t=new Ie){const i=t,o=this.v0,a=this.v1,c=this.v2,h=this.v3;return i.set(ca(e,o.x,a.x,c.x,h.x),ca(e,o.y,a.y,c.y,h.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class ZE extends Pi{constructor(e=new F,t=new F,i=new F,o=new F){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=o}getPoint(e,t=new F){const i=t,o=this.v0,a=this.v1,c=this.v2,h=this.v3;return i.set(ca(e,o.x,a.x,c.x,h.x),ca(e,o.y,a.y,c.y,h.y),ca(e,o.z,a.z,c.z,h.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class kg extends Pi{constructor(e=new Ie,t=new Ie){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new Ie){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new Ie){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class JE extends Pi{constructor(e=new F,t=new F){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new F){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new F){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Bg extends Pi{constructor(e=new Ie,t=new Ie,i=new Ie){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new Ie){const i=t,o=this.v0,a=this.v1,c=this.v2;return i.set(la(e,o.x,a.x,c.x),la(e,o.y,a.y,c.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class QE extends Pi{constructor(e=new F,t=new F,i=new F){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new F){const i=t,o=this.v0,a=this.v1,c=this.v2;return i.set(la(e,o.x,a.x,c.x),la(e,o.y,a.y,c.y),la(e,o.z,a.z,c.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Vg extends Pi{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new Ie){const i=t,o=this.points,a=(o.length-1)*e,c=Math.floor(a),h=a-c,f=o[c===0?c:c-1],d=o[c],m=o[c>o.length-2?o.length-1:c+1],g=o[c>o.length-3?o.length-1:c+2];return i.set(k0(h,f.x,d.x,m.x,g.x),k0(h,f.y,d.y,m.y,g.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const o=e.points[t];this.points.push(o.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const o=this.points[t];e.points.push(o.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const o=e.points[t];this.points.push(new Ie().fromArray(o))}return this}}var Lf=Object.freeze({__proto__:null,ArcCurve:HE,CatmullRomCurve3:GE,CubicBezierCurve:zg,CubicBezierCurve3:ZE,EllipseCurve:$f,LineCurve:kg,LineCurve3:JE,QuadraticBezierCurve:Bg,QuadraticBezierCurve3:QE,SplineCurve:Vg});class ew extends Pi{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Lf[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),o=this.getCurveLengths();let a=0;for(;a<o.length;){if(o[a]>=i){const c=o[a]-i,h=this.curves[a],f=h.getLength(),d=f===0?0:1-c/f;return h.getPointAt(d,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,o=this.curves.length;i<o;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let o=0,a=this.curves;o<a.length;o++){const c=a[o],h=c.isEllipseCurve?e*2:c.isLineCurve||c.isLineCurve3?1:c.isSplineCurve?e*c.points.length:e,f=c.getPoints(h);for(let d=0;d<f.length;d++){const m=f[d];i&&i.equals(m)||(t.push(m),i=m)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const o=e.curves[t];this.curves.push(o.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const o=this.curves[t];e.curves.push(o.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const o=e.curves[t];this.curves.push(new Lf[o.type]().fromJSON(o))}return this}}class B0 extends ew{constructor(e){super(),this.type="Path",this.currentPoint=new Ie,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new kg(this.currentPoint.clone(),new Ie(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,o){const a=new Bg(this.currentPoint.clone(),new Ie(e,t),new Ie(i,o));return this.curves.push(a),this.currentPoint.set(i,o),this}bezierCurveTo(e,t,i,o,a,c){const h=new zg(this.currentPoint.clone(),new Ie(e,t),new Ie(i,o),new Ie(a,c));return this.curves.push(h),this.currentPoint.set(a,c),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Vg(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,o,a,c){const h=this.currentPoint.x,f=this.currentPoint.y;return this.absarc(e+h,t+f,i,o,a,c),this}absarc(e,t,i,o,a,c){return this.absellipse(e,t,i,i,o,a,c),this}ellipse(e,t,i,o,a,c,h,f){const d=this.currentPoint.x,m=this.currentPoint.y;return this.absellipse(e+d,t+m,i,o,a,c,h,f),this}absellipse(e,t,i,o,a,c,h,f){const d=new $f(e,t,i,o,a,c,h,f);if(this.curves.length>0){const g=d.getPoint(0);g.equals(this.currentPoint)||this.lineTo(g.x,g.y)}this.curves.push(d);const m=d.getPoint(1);return this.currentPoint.copy(m),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class pc extends en{constructor(e=1,t=1,i=1,o=32,a=1,c=!1,h=0,f=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:o,heightSegments:a,openEnded:c,thetaStart:h,thetaLength:f};const d=this;o=Math.floor(o),a=Math.floor(a);const m=[],g=[],v=[],_=[];let M=0;const w=[],S=i/2;let y=0;N(),c===!1&&(e>0&&b(!0),t>0&&b(!1)),this.setIndex(m),this.setAttribute("position",new Nt(g,3)),this.setAttribute("normal",new Nt(v,3)),this.setAttribute("uv",new Nt(_,2));function N(){const A=new F,W=new F;let U=0;const z=(t-e)/i;for(let V=0;V<=a;V++){const L=[],R=V/a,B=R*(t-e)+e;for(let ee=0;ee<=o;ee++){const K=ee/o,oe=K*f+h,he=Math.sin(oe),se=Math.cos(oe);W.x=B*he,W.y=-R*i+S,W.z=B*se,g.push(W.x,W.y,W.z),A.set(he,z,se).normalize(),v.push(A.x,A.y,A.z),_.push(K,1-R),L.push(M++)}w.push(L)}for(let V=0;V<o;V++)for(let L=0;L<a;L++){const R=w[L][V],B=w[L+1][V],ee=w[L+1][V+1],K=w[L][V+1];(e>0||L!==0)&&(m.push(R,B,K),U+=3),(t>0||L!==a-1)&&(m.push(B,ee,K),U+=3)}d.addGroup(y,U,0),y+=U}function b(A){const W=M,U=new Ie,z=new F;let V=0;const L=A===!0?e:t,R=A===!0?1:-1;for(let ee=1;ee<=o;ee++)g.push(0,S*R,0),v.push(0,R,0),_.push(.5,.5),M++;const B=M;for(let ee=0;ee<=o;ee++){const oe=ee/o*f+h,he=Math.cos(oe),se=Math.sin(oe);z.x=L*se,z.y=S*R,z.z=L*he,g.push(z.x,z.y,z.z),v.push(0,R,0),U.x=he*.5+.5,U.y=se*.5*R+.5,_.push(U.x,U.y),M++}for(let ee=0;ee<o;ee++){const K=W+ee,oe=B+ee;A===!0?m.push(oe,oe+1,K):m.push(oe+1,oe,K),V+=3}d.addGroup(y,V,A===!0?1:2),y+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pc(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class mc extends pc{constructor(e=1,t=1,i=32,o=1,a=!1,c=0,h=Math.PI*2){super(0,e,t,i,o,a,c,h),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:i,heightSegments:o,openEnded:a,thetaStart:c,thetaLength:h}}static fromJSON(e){return new mc(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class gc extends en{constructor(e=[],t=[],i=1,o=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:o};const a=[],c=[];h(o),d(i),m(),this.setAttribute("position",new Nt(a,3)),this.setAttribute("normal",new Nt(a.slice(),3)),this.setAttribute("uv",new Nt(c,2)),o===0?this.computeVertexNormals():this.normalizeNormals();function h(N){const b=new F,A=new F,W=new F;for(let U=0;U<t.length;U+=3)_(t[U+0],b),_(t[U+1],A),_(t[U+2],W),f(b,A,W,N)}function f(N,b,A,W){const U=W+1,z=[];for(let V=0;V<=U;V++){z[V]=[];const L=N.clone().lerp(A,V/U),R=b.clone().lerp(A,V/U),B=U-V;for(let ee=0;ee<=B;ee++)ee===0&&V===U?z[V][ee]=L:z[V][ee]=L.clone().lerp(R,ee/B)}for(let V=0;V<U;V++)for(let L=0;L<2*(U-V)-1;L++){const R=Math.floor(L/2);L%2===0?(v(z[V][R+1]),v(z[V+1][R]),v(z[V][R])):(v(z[V][R+1]),v(z[V+1][R+1]),v(z[V+1][R]))}}function d(N){const b=new F;for(let A=0;A<a.length;A+=3)b.x=a[A+0],b.y=a[A+1],b.z=a[A+2],b.normalize().multiplyScalar(N),a[A+0]=b.x,a[A+1]=b.y,a[A+2]=b.z}function m(){const N=new F;for(let b=0;b<a.length;b+=3){N.x=a[b+0],N.y=a[b+1],N.z=a[b+2];const A=S(N)/2/Math.PI+.5,W=y(N)/Math.PI+.5;c.push(A,1-W)}M(),g()}function g(){for(let N=0;N<c.length;N+=6){const b=c[N+0],A=c[N+2],W=c[N+4],U=Math.max(b,A,W),z=Math.min(b,A,W);U>.9&&z<.1&&(b<.2&&(c[N+0]+=1),A<.2&&(c[N+2]+=1),W<.2&&(c[N+4]+=1))}}function v(N){a.push(N.x,N.y,N.z)}function _(N,b){const A=N*3;b.x=e[A+0],b.y=e[A+1],b.z=e[A+2]}function M(){const N=new F,b=new F,A=new F,W=new F,U=new Ie,z=new Ie,V=new Ie;for(let L=0,R=0;L<a.length;L+=9,R+=6){N.set(a[L+0],a[L+1],a[L+2]),b.set(a[L+3],a[L+4],a[L+5]),A.set(a[L+6],a[L+7],a[L+8]),U.set(c[R+0],c[R+1]),z.set(c[R+2],c[R+3]),V.set(c[R+4],c[R+5]),W.copy(N).add(b).add(A).divideScalar(3);const B=S(W);w(U,R+0,N,B),w(z,R+2,b,B),w(V,R+4,A,B)}}function w(N,b,A,W){W<0&&N.x===1&&(c[b]=N.x-1),A.x===0&&A.z===0&&(c[b]=W/2/Math.PI+.5)}function S(N){return Math.atan2(N.z,-N.x)}function y(N){return Math.atan2(-N.y,Math.sqrt(N.x*N.x+N.z*N.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gc(e.vertices,e.indices,e.radius,e.details)}}class Hg extends B0{constructor(e){super(e),this.uuid=ho(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,o=this.holes.length;i<o;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const o=e.holes[t];this.holes.push(o.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const o=this.holes[t];e.holes.push(o.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const o=e.holes[t];this.holes.push(new B0().fromJSON(o))}return this}}const tw={triangulate:function(s,e,t=2){const i=e&&e.length,o=i?e[0]*t:s.length;let a=Gg(s,0,o,t,!0);const c=[];if(!a||a.next===a.prev)return c;let h,f,d,m,g,v,_;if(i&&(a=ow(s,e,a,t)),s.length>80*t){h=d=s[0],f=m=s[1];for(let M=t;M<o;M+=t)g=s[M],v=s[M+1],g<h&&(h=g),v<f&&(f=v),g>d&&(d=g),v>m&&(m=v);_=Math.max(d-h,m-f),_=_!==0?32767/_:0}return da(a,c,t,h,f,_,0),c}};function Gg(s,e,t,i,o){let a,c;if(o===vw(s,e,t,i)>0)for(a=e;a<t;a+=i)c=V0(a,s[a],s[a+1],c);else for(a=t-i;a>=e;a-=i)c=V0(a,s[a],s[a+1],c);return c&&vc(c,c.next)&&(ma(c),c=c.next),c}function us(s,e){if(!s)return s;e||(e=s);let t=s,i;do if(i=!1,!t.steiner&&(vc(t,t.next)||Wt(t.prev,t,t.next)===0)){if(ma(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function da(s,e,t,i,o,a,c){if(!s)return;!c&&a&&hw(s,i,o,a);let h=s,f,d;for(;s.prev!==s.next;){if(f=s.prev,d=s.next,a?iw(s,i,o,a):nw(s)){e.push(f.i/t|0),e.push(s.i/t|0),e.push(d.i/t|0),ma(s),s=d.next,h=d.next;continue}if(s=d,s===h){c?c===1?(s=rw(us(s),e,t),da(s,e,t,i,o,a,2)):c===2&&sw(s,e,t,i,o,a):da(us(s),e,t,i,o,a,1);break}}}function nw(s){const e=s.prev,t=s,i=s.next;if(Wt(e,t,i)>=0)return!1;const o=e.x,a=t.x,c=i.x,h=e.y,f=t.y,d=i.y,m=o<a?o<c?o:c:a<c?a:c,g=h<f?h<d?h:d:f<d?f:d,v=o>a?o>c?o:c:a>c?a:c,_=h>f?h>d?h:d:f>d?f:d;let M=i.next;for(;M!==e;){if(M.x>=m&&M.x<=v&&M.y>=g&&M.y<=_&&Qs(o,h,a,f,c,d,M.x,M.y)&&Wt(M.prev,M,M.next)>=0)return!1;M=M.next}return!0}function iw(s,e,t,i){const o=s.prev,a=s,c=s.next;if(Wt(o,a,c)>=0)return!1;const h=o.x,f=a.x,d=c.x,m=o.y,g=a.y,v=c.y,_=h<f?h<d?h:d:f<d?f:d,M=m<g?m<v?m:v:g<v?g:v,w=h>f?h>d?h:d:f>d?f:d,S=m>g?m>v?m:v:g>v?g:v,y=Nf(_,M,e,t,i),N=Nf(w,S,e,t,i);let b=s.prevZ,A=s.nextZ;for(;b&&b.z>=y&&A&&A.z<=N;){if(b.x>=_&&b.x<=w&&b.y>=M&&b.y<=S&&b!==o&&b!==c&&Qs(h,m,f,g,d,v,b.x,b.y)&&Wt(b.prev,b,b.next)>=0||(b=b.prevZ,A.x>=_&&A.x<=w&&A.y>=M&&A.y<=S&&A!==o&&A!==c&&Qs(h,m,f,g,d,v,A.x,A.y)&&Wt(A.prev,A,A.next)>=0))return!1;A=A.nextZ}for(;b&&b.z>=y;){if(b.x>=_&&b.x<=w&&b.y>=M&&b.y<=S&&b!==o&&b!==c&&Qs(h,m,f,g,d,v,b.x,b.y)&&Wt(b.prev,b,b.next)>=0)return!1;b=b.prevZ}for(;A&&A.z<=N;){if(A.x>=_&&A.x<=w&&A.y>=M&&A.y<=S&&A!==o&&A!==c&&Qs(h,m,f,g,d,v,A.x,A.y)&&Wt(A.prev,A,A.next)>=0)return!1;A=A.nextZ}return!0}function rw(s,e,t){let i=s;do{const o=i.prev,a=i.next.next;!vc(o,a)&&Wg(o,i,i.next,a)&&pa(o,a)&&pa(a,o)&&(e.push(o.i/t|0),e.push(i.i/t|0),e.push(a.i/t|0),ma(i),ma(i.next),i=s=a),i=i.next}while(i!==s);return us(i)}function sw(s,e,t,i,o,a){let c=s;do{let h=c.next.next;for(;h!==c.prev;){if(c.i!==h.i&&pw(c,h)){let f=jg(c,h);c=us(c,c.next),f=us(f,f.next),da(c,e,t,i,o,a,0),da(f,e,t,i,o,a,0);return}h=h.next}c=c.next}while(c!==s)}function ow(s,e,t,i){const o=[];let a,c,h,f,d;for(a=0,c=e.length;a<c;a++)h=e[a]*i,f=a<c-1?e[a+1]*i:s.length,d=Gg(s,h,f,i,!1),d===d.next&&(d.steiner=!0),o.push(dw(d));for(o.sort(aw),a=0;a<o.length;a++)t=lw(o[a],t);return t}function aw(s,e){return s.x-e.x}function lw(s,e){const t=cw(s,e);if(!t)return e;const i=jg(t,s);return us(i,i.next),us(t,t.next)}function cw(s,e){let t=e,i=-1/0,o;const a=s.x,c=s.y;do{if(c<=t.y&&c>=t.next.y&&t.next.y!==t.y){const v=t.x+(c-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(v<=a&&v>i&&(i=v,o=t.x<t.next.x?t:t.next,v===a))return o}t=t.next}while(t!==e);if(!o)return null;const h=o,f=o.x,d=o.y;let m=1/0,g;t=o;do a>=t.x&&t.x>=f&&a!==t.x&&Qs(c<d?a:i,c,f,d,c<d?i:a,c,t.x,t.y)&&(g=Math.abs(c-t.y)/(a-t.x),pa(t,s)&&(g<m||g===m&&(t.x>o.x||t.x===o.x&&uw(o,t)))&&(o=t,m=g)),t=t.next;while(t!==h);return o}function uw(s,e){return Wt(s.prev,s,e.prev)<0&&Wt(e.next,s,s.next)<0}function hw(s,e,t,i){let o=s;do o.z===0&&(o.z=Nf(o.x,o.y,e,t,i)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==s);o.prevZ.nextZ=null,o.prevZ=null,fw(o)}function fw(s){let e,t,i,o,a,c,h,f,d=1;do{for(t=s,s=null,a=null,c=0;t;){for(c++,i=t,h=0,e=0;e<d&&(h++,i=i.nextZ,!!i);e++);for(f=d;h>0||f>0&&i;)h!==0&&(f===0||!i||t.z<=i.z)?(o=t,t=t.nextZ,h--):(o=i,i=i.nextZ,f--),a?a.nextZ=o:s=o,o.prevZ=a,a=o;t=i}a.nextZ=null,d*=2}while(c>1);return s}function Nf(s,e,t,i,o){return s=(s-t)*o|0,e=(e-i)*o|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function dw(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function Qs(s,e,t,i,o,a,c,h){return(o-c)*(e-h)>=(s-c)*(a-h)&&(s-c)*(i-h)>=(t-c)*(e-h)&&(t-c)*(a-h)>=(o-c)*(i-h)}function pw(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!mw(s,e)&&(pa(s,e)&&pa(e,s)&&gw(s,e)&&(Wt(s.prev,s,e.prev)||Wt(s,e.prev,e))||vc(s,e)&&Wt(s.prev,s,s.next)>0&&Wt(e.prev,e,e.next)>0)}function Wt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function vc(s,e){return s.x===e.x&&s.y===e.y}function Wg(s,e,t,i){const o=Zl(Wt(s,e,t)),a=Zl(Wt(s,e,i)),c=Zl(Wt(t,i,s)),h=Zl(Wt(t,i,e));return!!(o!==a&&c!==h||o===0&&Kl(s,t,e)||a===0&&Kl(s,i,e)||c===0&&Kl(t,s,i)||h===0&&Kl(t,e,i))}function Kl(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function Zl(s){return s>0?1:s<0?-1:0}function mw(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&Wg(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function pa(s,e){return Wt(s.prev,s,s.next)<0?Wt(s,e,s.next)>=0&&Wt(s,s.prev,e)>=0:Wt(s,e,s.prev)<0||Wt(s,s.next,e)<0}function gw(s,e){let t=s,i=!1;const o=(s.x+e.x)/2,a=(s.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&o<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==s);return i}function jg(s,e){const t=new If(s.i,s.x,s.y),i=new If(e.i,e.x,e.y),o=s.next,a=e.prev;return s.next=e,e.prev=s,t.next=o,o.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function V0(s,e,t,i){const o=new If(s,e,t);return i?(o.next=i.next,o.prev=i,i.next.prev=o,i.next=o):(o.prev=o,o.next=o),o}function ma(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function If(s,e,t){this.i=s,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function vw(s,e,t,i){let o=0;for(let a=e,c=t-i;a<t;a+=i)o+=(s[c]-s[a])*(s[a+1]+s[c+1]),c=a;return o}class ua{static area(e){const t=e.length;let i=0;for(let o=t-1,a=0;a<t;o=a++)i+=e[o].x*e[a].y-e[a].x*e[o].y;return i*.5}static isClockWise(e){return ua.area(e)<0}static triangulateShape(e,t){const i=[],o=[],a=[];H0(e),G0(i,e);let c=e.length;t.forEach(H0);for(let f=0;f<t.length;f++)o.push(c),c+=t[f].length,G0(i,t[f]);const h=tw.triangulate(i,o);for(let f=0;f<h.length;f+=3)a.push(h.slice(f,f+3));return a}}function H0(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function G0(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Zf extends en{constructor(e=new Hg([new Ie(.5,.5),new Ie(-.5,.5),new Ie(-.5,-.5),new Ie(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,o=[],a=[];for(let h=0,f=e.length;h<f;h++){const d=e[h];c(d)}this.setAttribute("position",new Nt(o,3)),this.setAttribute("uv",new Nt(a,2)),this.computeVertexNormals();function c(h){const f=[],d=t.curveSegments!==void 0?t.curveSegments:12,m=t.steps!==void 0?t.steps:1,g=t.depth!==void 0?t.depth:1;let v=t.bevelEnabled!==void 0?t.bevelEnabled:!0,_=t.bevelThickness!==void 0?t.bevelThickness:.2,M=t.bevelSize!==void 0?t.bevelSize:_-.1,w=t.bevelOffset!==void 0?t.bevelOffset:0,S=t.bevelSegments!==void 0?t.bevelSegments:3;const y=t.extrudePath,N=t.UVGenerator!==void 0?t.UVGenerator:xw;let b,A=!1,W,U,z,V;y&&(b=y.getSpacedPoints(m),A=!0,v=!1,W=y.computeFrenetFrames(m,!1),U=new F,z=new F,V=new F),v||(S=0,_=0,M=0,w=0);const L=h.extractPoints(d);let R=L.shape;const B=L.holes;if(!ua.isClockWise(R)){R=R.reverse();for(let ve=0,Ae=B.length;ve<Ae;ve++){const O=B[ve];ua.isClockWise(O)&&(B[ve]=O.reverse())}}const K=ua.triangulateShape(R,B),oe=R;for(let ve=0,Ae=B.length;ve<Ae;ve++){const O=B[ve];R=R.concat(O)}function he(ve,Ae,O){return Ae||console.error("THREE.ExtrudeGeometry: vec does not exist"),ve.clone().addScaledVector(Ae,O)}const se=R.length,ue=K.length;function G(ve,Ae,O){let Ze,Me,Ve;const Pe=ve.x-Ae.x,it=ve.y-Ae.y,Fe=O.x-ve.x,I=O.y-ve.y,C=Pe*Pe+it*it,Z=Pe*I-it*Fe;if(Math.abs(Z)>Number.EPSILON){const fe=Math.sqrt(C),xe=Math.sqrt(Fe*Fe+I*I),pe=Ae.x-it/fe,Ye=Ae.y+Pe/fe,Le=O.x-I/xe,He=O.y+Fe/xe,dt=((Le-pe)*I-(He-Ye)*Fe)/(Pe*I-it*Fe);Ze=pe+Pe*dt-ve.x,Me=Ye+it*dt-ve.y;const Ee=Ze*Ze+Me*Me;if(Ee<=2)return new Ie(Ze,Me);Ve=Math.sqrt(Ee/2)}else{let fe=!1;Pe>Number.EPSILON?Fe>Number.EPSILON&&(fe=!0):Pe<-Number.EPSILON?Fe<-Number.EPSILON&&(fe=!0):Math.sign(it)===Math.sign(I)&&(fe=!0),fe?(Ze=-it,Me=Pe,Ve=Math.sqrt(C)):(Ze=Pe,Me=it,Ve=Math.sqrt(C/2))}return new Ie(Ze/Ve,Me/Ve)}const ce=[];for(let ve=0,Ae=oe.length,O=Ae-1,Ze=ve+1;ve<Ae;ve++,O++,Ze++)O===Ae&&(O=0),Ze===Ae&&(Ze=0),ce[ve]=G(oe[ve],oe[O],oe[Ze]);const ae=[];let k,ie=ce.concat();for(let ve=0,Ae=B.length;ve<Ae;ve++){const O=B[ve];k=[];for(let Ze=0,Me=O.length,Ve=Me-1,Pe=Ze+1;Ze<Me;Ze++,Ve++,Pe++)Ve===Me&&(Ve=0),Pe===Me&&(Pe=0),k[Ze]=G(O[Ze],O[Ve],O[Pe]);ae.push(k),ie=ie.concat(k)}for(let ve=0;ve<S;ve++){const Ae=ve/S,O=_*Math.cos(Ae*Math.PI/2),Ze=M*Math.sin(Ae*Math.PI/2)+w;for(let Me=0,Ve=oe.length;Me<Ve;Me++){const Pe=he(oe[Me],ce[Me],Ze);ge(Pe.x,Pe.y,-O)}for(let Me=0,Ve=B.length;Me<Ve;Me++){const Pe=B[Me];k=ae[Me];for(let it=0,Fe=Pe.length;it<Fe;it++){const I=he(Pe[it],k[it],Ze);ge(I.x,I.y,-O)}}}const ze=M+w;for(let ve=0;ve<se;ve++){const Ae=v?he(R[ve],ie[ve],ze):R[ve];A?(z.copy(W.normals[0]).multiplyScalar(Ae.x),U.copy(W.binormals[0]).multiplyScalar(Ae.y),V.copy(b[0]).add(z).add(U),ge(V.x,V.y,V.z)):ge(Ae.x,Ae.y,0)}for(let ve=1;ve<=m;ve++)for(let Ae=0;Ae<se;Ae++){const O=v?he(R[Ae],ie[Ae],ze):R[Ae];A?(z.copy(W.normals[ve]).multiplyScalar(O.x),U.copy(W.binormals[ve]).multiplyScalar(O.y),V.copy(b[ve]).add(z).add(U),ge(V.x,V.y,V.z)):ge(O.x,O.y,g/m*ve)}for(let ve=S-1;ve>=0;ve--){const Ae=ve/S,O=_*Math.cos(Ae*Math.PI/2),Ze=M*Math.sin(Ae*Math.PI/2)+w;for(let Me=0,Ve=oe.length;Me<Ve;Me++){const Pe=he(oe[Me],ce[Me],Ze);ge(Pe.x,Pe.y,g+O)}for(let Me=0,Ve=B.length;Me<Ve;Me++){const Pe=B[Me];k=ae[Me];for(let it=0,Fe=Pe.length;it<Fe;it++){const I=he(Pe[it],k[it],Ze);A?ge(I.x,I.y+b[m-1].y,b[m-1].x+O):ge(I.x,I.y,g+O)}}}Q(),de();function Q(){const ve=o.length/3;if(v){let Ae=0,O=se*Ae;for(let Ze=0;Ze<ue;Ze++){const Me=K[Ze];be(Me[2]+O,Me[1]+O,Me[0]+O)}Ae=m+S*2,O=se*Ae;for(let Ze=0;Ze<ue;Ze++){const Me=K[Ze];be(Me[0]+O,Me[1]+O,Me[2]+O)}}else{for(let Ae=0;Ae<ue;Ae++){const O=K[Ae];be(O[2],O[1],O[0])}for(let Ae=0;Ae<ue;Ae++){const O=K[Ae];be(O[0]+se*m,O[1]+se*m,O[2]+se*m)}}i.addGroup(ve,o.length/3-ve,0)}function de(){const ve=o.length/3;let Ae=0;we(oe,Ae),Ae+=oe.length;for(let O=0,Ze=B.length;O<Ze;O++){const Me=B[O];we(Me,Ae),Ae+=Me.length}i.addGroup(ve,o.length/3-ve,1)}function we(ve,Ae){let O=ve.length;for(;--O>=0;){const Ze=O;let Me=O-1;Me<0&&(Me=ve.length-1);for(let Ve=0,Pe=m+S*2;Ve<Pe;Ve++){const it=se*Ve,Fe=se*(Ve+1),I=Ae+Ze+it,C=Ae+Me+it,Z=Ae+Me+Fe,fe=Ae+Ze+Fe;Be(I,C,Z,fe)}}}function ge(ve,Ae,O){f.push(ve),f.push(Ae),f.push(O)}function be(ve,Ae,O){Ke(ve),Ke(Ae),Ke(O);const Ze=o.length/3,Me=N.generateTopUV(i,o,Ze-3,Ze-2,Ze-1);vt(Me[0]),vt(Me[1]),vt(Me[2])}function Be(ve,Ae,O,Ze){Ke(ve),Ke(Ae),Ke(Ze),Ke(Ae),Ke(O),Ke(Ze);const Me=o.length/3,Ve=N.generateSideWallUV(i,o,Me-6,Me-3,Me-2,Me-1);vt(Ve[0]),vt(Ve[1]),vt(Ve[3]),vt(Ve[1]),vt(Ve[2]),vt(Ve[3])}function Ke(ve){o.push(f[ve*3+0]),o.push(f[ve*3+1]),o.push(f[ve*3+2])}function vt(ve){a.push(ve.x),a.push(ve.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return _w(t,i,e)}static fromJSON(e,t){const i=[];for(let a=0,c=e.shapes.length;a<c;a++){const h=t[e.shapes[a]];i.push(h)}const o=e.options.extrudePath;return o!==void 0&&(e.options.extrudePath=new Lf[o.type]().fromJSON(o)),new Zf(i,e.options)}}const xw={generateTopUV:function(s,e,t,i,o){const a=e[t*3],c=e[t*3+1],h=e[i*3],f=e[i*3+1],d=e[o*3],m=e[o*3+1];return[new Ie(a,c),new Ie(h,f),new Ie(d,m)]},generateSideWallUV:function(s,e,t,i,o,a){const c=e[t*3],h=e[t*3+1],f=e[t*3+2],d=e[i*3],m=e[i*3+1],g=e[i*3+2],v=e[o*3],_=e[o*3+1],M=e[o*3+2],w=e[a*3],S=e[a*3+1],y=e[a*3+2];return Math.abs(h-m)<Math.abs(c-d)?[new Ie(c,1-f),new Ie(d,1-g),new Ie(v,1-M),new Ie(w,1-y)]:[new Ie(h,1-f),new Ie(m,1-g),new Ie(_,1-M),new Ie(S,1-y)]}};function _w(s,e,t){if(t.shapes=[],Array.isArray(s))for(let i=0,o=s.length;i<o;i++){const a=s[i];t.shapes.push(a.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Jf extends gc{constructor(e=1,t=0){const i=(1+Math.sqrt(5))/2,o=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],a=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(o,a,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Jf(e.radius,e.detail)}}class xc extends gc{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],o=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,o,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new xc(e.radius,e.detail)}}class _c extends en{constructor(e=1,t=32,i=16,o=0,a=Math.PI*2,c=0,h=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:o,phiLength:a,thetaStart:c,thetaLength:h},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const f=Math.min(c+h,Math.PI);let d=0;const m=[],g=new F,v=new F,_=[],M=[],w=[],S=[];for(let y=0;y<=i;y++){const N=[],b=y/i;let A=0;y===0&&c===0?A=.5/t:y===i&&f===Math.PI&&(A=-.5/t);for(let W=0;W<=t;W++){const U=W/t;g.x=-e*Math.cos(o+U*a)*Math.sin(c+b*h),g.y=e*Math.cos(c+b*h),g.z=e*Math.sin(o+U*a)*Math.sin(c+b*h),M.push(g.x,g.y,g.z),v.copy(g).normalize(),w.push(v.x,v.y,v.z),S.push(U+A,1-b),N.push(d++)}m.push(N)}for(let y=0;y<i;y++)for(let N=0;N<t;N++){const b=m[y][N+1],A=m[y][N],W=m[y+1][N],U=m[y+1][N+1];(y!==0||c>0)&&_.push(b,A,U),(y!==i-1||f<Math.PI)&&_.push(A,W,U)}this.setIndex(_),this.setAttribute("position",new Nt(M,3)),this.setAttribute("normal",new Nt(w,3)),this.setAttribute("uv",new Nt(S,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new _c(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Qf extends en{constructor(e=1,t=.4,i=12,o=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:o,arc:a},i=Math.floor(i),o=Math.floor(o);const c=[],h=[],f=[],d=[],m=new F,g=new F,v=new F;for(let _=0;_<=i;_++)for(let M=0;M<=o;M++){const w=M/o*a,S=_/i*Math.PI*2;g.x=(e+t*Math.cos(S))*Math.cos(w),g.y=(e+t*Math.cos(S))*Math.sin(w),g.z=t*Math.sin(S),h.push(g.x,g.y,g.z),m.x=e*Math.cos(w),m.y=e*Math.sin(w),v.subVectors(g,m).normalize(),f.push(v.x,v.y,v.z),d.push(M/o),d.push(_/i)}for(let _=1;_<=i;_++)for(let M=1;M<=o;M++){const w=(o+1)*_+M-1,S=(o+1)*(_-1)+M-1,y=(o+1)*(_-1)+M,N=(o+1)*_+M;c.push(w,S,N),c.push(S,y,N)}this.setIndex(c),this.setAttribute("position",new Nt(h,3)),this.setAttribute("normal",new Nt(f,3)),this.setAttribute("uv",new Nt(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Qf(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class ga extends Pr{static get type(){return"MeshStandardMaterial"}constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xg,this.normalScale=new Ie(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _i,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ed extends ln{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new yt(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class W0 extends ed{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ln.DEFAULT_UP),this.updateMatrix(),this.groundColor=new yt(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const zh=new Lt,j0=new F,X0=new F;class Xg{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ie(512,512),this.map=null,this.mapPass=null,this.matrix=new Lt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Xf,this._frameExtents=new Ie(1,1),this._viewportCount=1,this._viewports=[new Dt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;j0.setFromMatrixPosition(e.matrixWorld),t.position.copy(j0),X0.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(X0),t.updateMatrixWorld(),zh.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zh),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(zh)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Y0=new Lt,na=new F,kh=new F;class yw extends Xg{constructor(){super(new On(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Ie(4,2),this._viewportCount=6,this._viewports=[new Dt(2,1,1,1),new Dt(0,1,1,1),new Dt(3,1,1,1),new Dt(1,1,1,1),new Dt(3,0,1,1),new Dt(1,0,1,1)],this._cubeDirections=[new F(1,0,0),new F(-1,0,0),new F(0,0,1),new F(0,0,-1),new F(0,1,0),new F(0,-1,0)],this._cubeUps=[new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,1,0),new F(0,0,1),new F(0,0,-1)]}updateMatrices(e,t=0){const i=this.camera,o=this.matrix,a=e.distance||i.far;a!==i.far&&(i.far=a,i.updateProjectionMatrix()),na.setFromMatrixPosition(e.matrixWorld),i.position.copy(na),kh.copy(i.position),kh.add(this._cubeDirections[t]),i.up.copy(this._cubeUps[t]),i.lookAt(kh),i.updateMatrixWorld(),o.makeTranslation(-na.x,-na.y,-na.z),Y0.multiplyMatrices(i.projectionMatrix,i.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Y0)}}class Yg extends ed{constructor(e,t,i=0,o=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=o,this.shadow=new yw}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class Sw extends Xg{constructor(){super(new Ng(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class q0 extends ed{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ln.DEFAULT_UP),this.updateMatrix(),this.target=new ln,this.shadow=new Sw}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zf);const Ir=(s,e,t)=>Math.max(e,Math.min(t,s)),hn=(s,e)=>Math.hypot(s.x-e.x,s.z-e.z),es=(s,e,t)=>s+(e-s)*t;function sa(s,e){return Math.atan2(Math.sin(s-e),Math.cos(s-e))}function Ai(s){const e=Math.sin(s*127.1+311.7)*43758.5453;return e-Math.floor(e)}function qg(s,e,t,i,o){let a=0,c=o;for(const h of["x","y","z"])if(Math.abs(e[h])<1e-8){if(s[h]<t[h]||s[h]>i[h])return 1/0}else{let f=(t[h]-s[h])/e[h],d=(i[h]-s[h])/e[h];if(f>d&&([f,d]=[d,f]),a=Math.max(a,f),c=Math.min(c,d),a>c)return 1/0}return a<=o?a:1/0}const $0=new F,K0=new F;function Mw(s,e,t,i){return $0.set(t.x-t.w/2,t.minY,t.z-t.d/2),K0.set(t.x+t.w/2,t.maxY,t.z+t.d/2),qg(s,e,$0,K0,i)}function $g(s,e,t,i){const o=Ir(s,i.x-i.w/2,i.x+i.w/2),a=Ir(e,i.z-i.d/2,i.z+i.d/2);return(s-o)**2+(e-a)**2<t**2}const Z0={x1:-44,z1:-46},Df=[{x1:-12,x2:12,z1:-44,z2:-32,name:"T SPAWN"},{x1:-30,x2:28,z1:-36,z2:-28,name:"T CROSS"},{x1:16,x2:34,z1:-32,z2:-18,name:"OUTSIDE LONG"},{x1:26,x2:36,z1:-22,z2:-12,name:"LONG DOORS"},{x1:30,x2:40,z1:-14,z2:20,name:"A LONG"},{x1:36,x2:44,z1:-12,z2:0,name:"PIT"},{x1:22,x2:40,z1:10,z2:28,name:"A SITE"},{x1:8,x2:28,z1:22,z2:30,name:"CT RAMP"},{x1:-8,x2:14,z1:22,z2:34,name:"CT SPAWN"},{x1:-6,x2:6,z1:6,z2:26,name:"CT MID"},{x1:-6,x2:6,z1:-32,z2:8,name:"MID"},{x1:-12,x2:8,z1:-30,z2:-20,name:"TOP MID"},{x1:-2,x2:20,z1:-18,z2:-10,name:"CATWALK"},{x1:14,x2:22,z1:-12,z2:16,name:"A SHORT"},{x1:18,x2:30,z1:10,z2:18,name:"SHORT RAMP"},{x1:-34,x2:-22,z1:-32,z2:-12,name:"UPPER TUNNELS"},{x1:-38,x2:-24,z1:-16,z2:-4,name:"B TUNNELS"},{x1:-38,x2:-28,z1:-4,z2:10,name:"TUNNEL EXIT"},{x1:-40,x2:-20,z1:4,z2:22,name:"B SITE"},{x1:-24,x2:-4,z1:16,z2:24,name:"B DOORS"},{x1:-28,x2:-20,z1:-16,z2:-4,name:"TUNNEL STAIRS"},{x1:-24,x2:-4,z1:-12,z2:-4,name:"LOWER TUNNELS"}],qi={A:{x:31,z:19,radius:6.5},B:{x:-30,z:13,radius:6.6}},Ew={T:{x:0,z:-39},CT:{x:2,z:29}},J0={long:[{x:22,z:-30},{x:31,z:-22},{x:33,z:-12},{x:35,z:5},{x:32,z:19}],short:[{x:0,z:-24},{x:1,z:-14},{x:18,z:-14},{x:18,z:9},{x:29,z:16}],tunnels:[{x:-26,z:-31},{x:-28,z:-20},{x:-31,z:-10},{x:-33,z:1},{x:-30,z:13}],mid:[{x:0,z:-22},{x:0,z:0},{x:0,z:12},{x:-16,z:20},{x:-29,z:14}]};class ww{group=new zn;colliders=[];boundary=[];crates=[];materials=new Map;boxGeometry=new Lr(1,1,1);cellSet=new Set;constructor(e){e.add(this.group),this.floor(),this.walls(),this.cover(),this.doors(),this.tunnels(),this.environment(),this.siteMarker("A",qi.A.x,qi.A.z,12215105),this.siteMarker("B",qi.B.x,qi.B.z,12215105),this.batchBuildings()}batchBuildings(){const e=[];for(const i of[...this.group.children])!(i instanceof Ut)||i instanceof rc||i.geometry!==this.boxGeometry||Array.isArray(i.material)||e.push(i);const t=new rc(this.boxGeometry,this.material(16777215),e.length);e.forEach((i,o)=>{i.updateMatrix(),t.setMatrixAt(o,i.matrix),t.setColorAt(o,i.material.color),this.group.remove(i)}),t.castShadow=!0,t.receiveShadow=!0,t.computeBoundingSphere(),this.group.add(t)}contains(e,t){return Df.some(i=>e>i.x1&&e<i.x2&&t>i.z1&&t<i.z2)}heightAt(e,t){return 2.4*Ir((e-18)/8,0,1)*Ir((t-2)/10,0,1)}zoneAt(e,t){const i=Object.entries(qi).find(([,a])=>Math.hypot(e-a.x,t-a.z)<a.radius);return i?`${i[0]} SITE`:[...Df].reverse().find(a=>e>=a.x1&&e<=a.x2&&t>=a.z1&&t<=a.z2)?.name??"DUST II"}siteAt(e,t){for(const i of["A","B"]){const o=qi[i];if(Math.hypot(e-o.x,t-o.z)<o.radius)return i}return null}clear(e,t,i=.38,o=this.heightAt(e,t)){for(const[a,c]of[[0,0],[1,0],[-1,0],[0,1],[0,-1],[.71,.71],[-.71,.71],[.71,-.71],[-.71,-.71]])if(!this.contains(e+a*i,t+c*i))return!1;return!this.colliders.some(a=>a.maxY>o+.12&&a.minY<o+1.8&&$g(e,t,i,a))}lineWalkable(e,t,i=.42){const o=Math.ceil(Math.hypot(t.x-e.x,t.z-e.z)/.45);for(let a=0;a<=o;a++){const c=o?a/o:0;if(!this.clear(e.x+(t.x-e.x)*c,e.z+(t.z-e.z)*c,i))return!1}return!0}raycast(e,t,i=160){let o=i;for(const a of this.colliders)o=Math.min(o,Mw(e,t,a,o));for(let a=.6;a<o;a+=.7){const c=e.x+t.x*a,h=e.z+t.z*a;if(e.y+t.y*a<this.heightAt(c,h)){o=a;break}}return o}visible(e,t){const i=t.clone().sub(e),o=i.length();return this.raycast(e,i.normalize(),o)>=o-.12}material(e,t=.88,i=0){const o=`${e}/${t}/${i}`;return this.materials.has(o)||this.materials.set(o,new ga({color:e,roughness:t,metalness:i})),this.materials.get(o)}box(e,t,i,o,a,c,h,f=!0){const d=new Ut(this.boxGeometry,this.material(h));return d.position.set(e,t+a/2,i),d.scale.set(o,a,c),d.castShadow=f,d.receiveShadow=!0,this.group.add(d),d}obstacle(e,t,i,o,a,c,h="wall",f=this.heightAt(e,t)){const d={x:e,z:t,w:i,d:o,minY:f,maxY:f+a,kind:h};return this.colliders.push(d),this.box(e,f,t,i,a,o,c),d}floor(){const e=[],t=[],i=new yt;for(let f=-44;f<46;f+=2)for(let d=-46;d<36;d+=2){if(!this.contains(f+1,d+1))continue;this.cellSet.add(`${f},${d}`);const m=[[f,d],[f,d+2],[f+2,d],[f+2,d],[f,d+2],[f+2,d+2]];i.setHex(12497299).multiplyScalar(.94+Ai(f*9+d*2)*.1);for(const[g,v]of m)e.push(g,this.heightAt(g,v),v),t.push(i.r,i.g,i.b)}const o=new en;o.setAttribute("position",new Nt(e,3)),o.setAttribute("color",new Nt(t,3)),o.computeVertexNormals();const a=new Ut(o,new ga({vertexColors:!0,roughness:1}));a.receiveShadow=!0,this.group.add(a),this.box(0,-1,-5,240,.8,240,12826524,!1);const c=[];for(const f of this.cellSet){const[d,m]=f.split(",").map(Number);Ai(d+m*11)>.4&&(c.push(d,this.heightAt(d,m)+.006,m,d+1.97,this.heightAt(d+1.97,m)+.006,m),c.push(d,this.heightAt(d,m)+.006,m,d,this.heightAt(d,m+1.97)+.006,m+1.97))}const h=new en;h.setAttribute("position",new Nt(c,3)),this.group.add(new VE(h,new aa({color:9997685,transparent:!0,opacity:.23})))}walls(){const e=new Map,t=(i,o)=>{const a=e.get(i)??[];a.push(o),e.set(i,a)};for(const i of this.cellSet){const[o,a]=i.split(",").map(Number);this.cellSet.has(`${o-2},${a}`)||t(`v:${o}`,a),this.cellSet.has(`${o+2},${a}`)||t(`v:${o+2}`,a),this.cellSet.has(`${o},${a-2}`)||t(`h:${a}`,o),this.cellSet.has(`${o},${a+2}`)||t(`h:${a+2}`,o)}for(const[i,o]of e){o.sort((f,d)=>f-d);let a=o[0],c=a+2;const h=()=>{const[f,d]=i.split(":"),m=Number(d),g=f==="v",v=g?m:(a+c)/2,_=g?(a+c)/2:m,M=6.2+Math.floor(Ai(v+_*3)*3)*1.3,w=new yt(13877144).multiplyScalar(.9+Ai(v*2+_)*.15).getHex(),S=g?.65:c-a+.4,y=g?c-a+.4:.65,N=this.obstacle(v,_,S,y,M,w,"wall",-.25);this.boundary.push(N),this.box(v,M-.4,_,S+.22,.26,y+.22,11574141),this.box(v,.22,_,S+.08,.32,y+.08,11903614);const b=Math.floor((c-a)/4.5);for(let A=0;A<b;A++){const W=a+(A+.5)*((c-a)/b);if(Ai(W+m*13)<.17)continue;const U=g?m:W,z=g?W:m;this.box(U,3.6,z,g?.74:1.1,1.35,g?1.1:.74,6585209),this.box(U,3.48,z,g?.86:1.35,.12,g?1.35:.86,12366490);for(let V=0;V<4;V++)this.box(U,3.8+V*.24,z,g?.76:1.03,.035,g?1.03:.76,4545371,!1)}};for(let f=1;f<o.length;f++)o[f]===c?c+=2:(h(),a=o[f],c=a+2);h()}}crate(e,t,i=2,o=2,a=2,c=!1){const h=this.heightAt(e,t),f=c?8491395:10060902,d=this.obstacle(e,t,i,o,a,f,"crate");this.crates.push(d);for(const m of[-1,1]){this.box(e,h+.14,t+m*(o/2+.02),i+.07,.13,.08,6642762),this.box(e,h+a-.26,t+m*(o/2+.02),i+.07,.13,.08,6642762);for(const g of[-1,1])this.box(e+g*(i/2-.15),h,t+m*(o/2+.035),.16,a,.1,7826259);this.box(e+m*(i/2+.025),h+.16,t,.08,.11,o,6642762),this.box(e+m*(i/2+.025),h+a-.27,t,.08,.11,o,6642762)}for(let m=1;m<Math.ceil(i);m++)this.box(e-i/2+m,h,t,.018,a,o+.025,8548946,!1)}cover(){this.crate(27.4,18,3.4,3,2.5,!0),this.crate(27.4,18,2.8,2.6,3.5,!0),this.crate(35.8,24.2,3.4,2.3,2.2),this.crate(36.2,14.5,2,2,1.1),this.crate(-24,9,3,3,2.7,!0),this.crate(-36.5,16.5,3,2.3,1.6),this.crate(-27.5,19.2,3,2,2.2),this.crate(-22.1,18.4,2,2,1.1),this.crate(-3.8,-18.2,2.2,2,1.3),this.crate(3.9,-3.5,2,2.4,2.5),this.crate(-10,-31,2,2,1.5),this.crate(27,-27,2,2,2.2),this.crate(39,-6,2.4,2,1.1),this.crate(-25.5,-23,1.7,2.5,1.5),this.crate(8,30.5,3,2,1.4),this.crate(19.7,-5,1.6,2,1.05);const e=this.heightAt(38,5);this.obstacle(38,5,1.6,3.9,1.2,10202534,"crate"),this.box(38,e+1.1,5.2,1.45,.65,1.9,7572619),this.colliders.push({x:38,z:5.2,w:1.45,d:1.9,minY:e+1.1,maxY:e+1.75,kind:"crate"}),this.box(38,e+1.25,4.18,1.3,.4,.04,4216408);for(const t of[-.84,.84])for(const i of[-1.25,1.25])this.box(38+t,e+.15,5+i,.18,.55,.65,3422776)}door(e,t,i){const o=this.heightAt(e,t);this.obstacle(e-i/2-.3,t,.6,1.1,4.9,12363138),this.obstacle(e+i/2+.3,t,.6,1.1,4.9,12363138),this.obstacle(e,t,i+1.2,1.1,.7,13020551,"roof",o+4.2);const a=3.1,c=(i-a)/2;for(const h of[-1,1]){const f=e+h*(a/2+c/2),d=t+h*.5;this.obstacle(f,d,c,.26,4.1,7363391,"door");for(let g=0;g<6;g++)this.box(f-c/2+(g+.5)*c/6,o,d,.025,4.08,.29,4932143);for(const g of[.5,2,3.6])this.box(f,o+g,d,c+.06,.13,.32,3423029);const m=new Ut(new Qf(.12,.028,6,12),this.material(2962479,.5,.5));m.position.set(f-h*(c/2-.3),o+1.9,d-.2),this.group.add(m)}}doors(){this.door(0,4,10.6),this.door(31,-18,8.6),this.door(-15.5,20,7.4)}tunnels(){this.obstacle(-28,-23,11.5,15,.6,10719091,"roof",4.1),this.obstacle(-31,-10,13,10,.6,10719091,"roof",4.1),this.obstacle(-14,-8,19,7.5,.6,10719091,"roof",3.9);for(const[e,t]of[[-28,-26],[-30,-11],[-14,-8]]){this.box(e,3.7,t,.35,.25,.35,16770725);const i=new Yg(16762752,14,12,2);i.position.set(e,3.4,t),this.group.add(i)}for(const e of[-37.5,-28.5])this.obstacle(e,3,.55,.8,4,11640188);this.obstacle(-33,3,9.5,.8,.65,11640188,"roof",3.7)}siteMarker(e,t,i,o){const a=this.heightAt(t,i)+.018,c=[new F(t-5,a,i-5),new F(t+5,a,i-5),new F(t+5,a,i+5),new F(t-5,a,i+5),new F(t-5,a,i-5)];this.group.add(new cc(new en().setFromPoints(c),new aa({color:o})));const h=e==="A"?[[-1,1,0,-1],[0,-1,1,1],[-.6,.3,.6,.3]]:[[-.8,-1,-.8,1],[-.8,-1,.6,-1],[.6,-1,1,-.5],[1,-.5,-.8,0],[-.8,0,.7,0],[.7,0,1,.6],[1,.6,.6,1],[.6,1,-.8,1]];for(const[m,g,v,_]of h){const M=t+m*1.4,w=i+g*1.4,S=t+v*1.4,y=i+_*1.4,N=this.box((M+S)/2,a,(w+y)/2,Math.hypot(S-M,y-w),.025,.12,o,!1);N.rotation.y=-Math.atan2(y-w,S-M)}const f=e==="A"?39.6:-39.55,d=i;this.box(f,a+1.8,d,.1,2.5,2.9,12296571);for(const[m,g,v,_]of h){const M=this.box(f+(e==="A"?-.09:.09),a+3-(g+_)/2*.8,d+(m+v)/2*.8,.05,.13,Math.hypot(v-m,_-g)*.8,o,!1);M.rotation.x=Math.atan2(_-g,v-m)}}environment(){for(const[f,d,m,g,v]of[[10,5,6,24,10],[26,-3,5,19,8],[-14,4,12,17,9],[-15,-20,8,12,10],[0,-49,38,6,11],[48,4,7,70,11],[-45,0,6,66,10],[-16,31,12,10,9]]){this.obstacle(f,d,m,g,v,13087375,"wall",-.2),this.box(f,v-.25,d,m+.4,.35,g+.4,10587762),this.box(f,v,d,m*.65,.45,g*.65,12034430);for(let _=0;_<Math.floor(g/4);_++)for(const M of[-1,1])this.box(f+M*(m/2+.03),5.4,d-g/2+2+_*4,.08,1.5,1,6058865)}const e=new Ut(new _c(3.8,20,12,0,Math.PI*2,0,Math.PI/2),this.material(10860981));e.position.set(-17,10,33),this.group.add(e),this.box(-17,8,33,8,2,8,13351063),this.box(-23,0,33,2.2,15,2.2,13548444),this.box(-23,12,33,3,.4,3,11184010);for(const[f,d]of[[43,25],[-43,-20],[12,-44],[-41,25]]){this.box(f,0,d,.6,9,.6,7761741);for(let m=0;m<8;m++){const g=new mc(.55,5,3),v=new Ut(g,this.material(6780499)),_=m*Math.PI/4;v.position.set(f+Math.cos(_)*1.5,8.6,d+Math.sin(_)*1.5),v.rotation.set(Math.cos(_)*1.1,_,Math.sin(_)*1.1),this.group.add(v)}}for(const[f,d,m,g]of[[-6,-20,6,-20],[30,-4,40,-4],[-40,10,-20,10],[14,-5,22,-5]]){const v=[];for(let _=0;_<=1.01;_+=.05)v.push(new F(f+(m-f)*_,6.4-Math.sin(_*Math.PI)*1.1,d+(g-d)*_));this.group.add(new cc(new en().setFromPoints(v),new aa({color:5132356})))}const t=new rc(new Lr(1,1,1),this.material(11115904),180),i=new Lt,o=new fo,a=new F,c=new F;let h=0;for(let f=0;f<900&&h<180;f++){const d=-42+Ai(f*7)*86,m=-44+Ai(f*13)*78;this.clear(d,m,.3)&&(a.set(d,this.heightAt(d,m)+.025,m),c.set(.03+Ai(f)*.12,.025+Ai(f*5)*.06,.04+Ai(f*9)*.09),o.setFromAxisAngle(new F(0,1,0),f),i.compose(a,o,c),t.setMatrixAt(h++,i))}t.count=h,this.group.add(t)}}class Tw{constructor(e){this.world=e,this.walkable=new Uint8Array(this.width*this.height);for(let t=0;t<this.height;t++)for(let i=0;i<this.width;i++){const o=this.point(t*this.width+i);this.walkable[t*this.width+i]=e.clear(o.x,o.z,.48)?1:0}}width=90;height=82;walkable;point(e){return{x:e%this.width-43.5,z:Math.floor(e/this.width)-45.5}}nearest(e){const t=Math.round(e.x+43.5),i=Math.round(e.z+45.5);for(let o=0;o<9;o++)for(let a=-o;a<=o;a++)for(let c=-o;c<=o;c++){const h=t+c,f=i+a;if(h<0||h>=this.width||f<0||f>=this.height)continue;const d=f*this.width+h;if(this.walkable[d])return d}return-1}findPath(e,t){if(this.world.lineWalkable(e,t))return[{...t}];const i=this.nearest(e),o=this.nearest(t);if(i<0||o<0)return[];const a=this.width*this.height,c=new Float32Array(a).fill(1/0),h=new Int32Array(a).fill(-1),f=new Uint8Array(a),d=[],m=(M,w)=>{d.push({id:M,score:w});let S=d.length-1;for(;S>0;){const y=S-1>>1;if(d[y].score<=w)break;[d[y],d[S]]=[d[S],d[y]],S=y}},g=()=>{const M=d[0],w=d.pop();if(d.length){d[0]=w;let S=0;for(;;){let y=S*2+1;if(y>=d.length||(y+1<d.length&&d[y+1].score<d[y].score&&y++,d[S].score<=d[y].score))break;[d[S],d[y]]=[d[y],d[S]],S=y}}return M.id},v=M=>Math.hypot(M%this.width-o%this.width,Math.floor(M/this.width)-Math.floor(o/this.width));c[i]=0,m(i,v(i));const _=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]];for(;d.length;){const M=g();if(f[M])continue;if(f[M]=1,M===o){const y=[];let N=o;for(;N!==i&&N>=0;)y.push(this.point(N)),N=h[N];y.reverse();const b=[];let A=e,W=0;for(;W<y.length;){let U=Math.min(W+16,y.length-1);for(;U>W&&!this.world.lineWalkable(A,y[U]);)U--;b.push(y[U]),A=y[U],W=U+1}return this.world.lineWalkable(A,t)&&b.push({...t}),b}const w=M%this.width,S=Math.floor(M/this.width);for(const[y,N]of _){const b=w+y,A=S+N;if(b<0||A<0||b>=this.width||A>=this.height)continue;const W=A*this.width+b;if(!this.walkable[W]||f[W]||y&&N&&(!this.walkable[S*this.width+b]||!this.walkable[A*this.width+w]))continue;const U=c[M]+(y&&N?1.4142:1);U>=c[W]||(c[W]=U,h[W]=M,m(W,U+v(W)))}}return[]}}const Xn={ak47:{id:"ak47",name:"AK-47",label:"突击步枪",category:"rifle",damage:40,armorPen:.76,magazine:30,reserve:90,interval:.1,reload:2.45,spread:.004,recoil:.033,automatic:!0,range:100,speed:5,color:10841401},m4a4:{id:"m4a4",name:"M4A4",label:"突击步枪",category:"rifle",damage:33,armorPen:.7,magazine:30,reserve:90,interval:.082,reload:2.25,spread:.0028,recoil:.016,automatic:!0,range:100,speed:5.2,color:4608594},awp:{id:"awp",name:"AWP",label:"狙击步枪",category:"sniper",damage:160,armorPen:.92,magazine:5,reserve:30,interval:1.65,reload:3.1,spread:.045,recoil:.055,automatic:!1,range:160,speed:4.2,color:6583370},glock:{id:"glock",name:"GLOCK-18",label:"半自动手枪",category:"pistol",damage:22,armorPen:.48,magazine:20,reserve:120,interval:.18,reload:1.8,spread:.007,recoil:.017,automatic:!1,range:65,speed:5.8,color:5329235},usp:{id:"usp",name:"USP-S",label:"消音手枪",category:"pistol",damage:26,armorPen:.52,magazine:12,reserve:72,interval:.19,reload:1.95,spread:.004,recoil:.014,automatic:!1,range:70,speed:5.8,color:3357501},deagle:{id:"deagle",name:"DESERT EAGLE",label:"重型手枪",category:"pistol",damage:30,armorPen:.8,magazine:7,reserve:35,interval:.31,reload:2.2,spread:.0055,recoil:.043,automatic:!1,range:90,speed:5.5,color:10858161},knife:{id:"knife",name:"FIELD KNIFE",label:"近战武器",category:"knife",damage:55,armorPen:.85,magazine:0,reserve:0,interval:.48,reload:0,spread:0,recoil:.01,automatic:!0,range:2.6,speed:6.8,color:12240324}},Aw={head:2,chest:1,abdomen:1.15,arm:.72,leg:.65};function Fn(s){return s.slot==="primary"&&s.primary?s.primary:s.slot==="melee"?"knife":s.secondary}function Cw(s,e,t){const i=s.damage*Aw[e],o=e==="leg"?0:Math.min(t,i*(1-s.armorPen));return{damage:Math.round(i-o),armorDamage:Math.ceil(o)}}const Bh=.32,ha=1.69;function Rw(s,e,t,i){const o=s.y,a=Math.max(1,Math.ceil(Math.hypot(e.x,e.z)*t/.18)),c=e.x*t/a,h=e.z*t/a;for(let d=0;d<a;d++)i.clear(s.x+c,s.z,Bh,s.y+.08)&&(s.x+=c),i.clear(s.x,s.z+h,Bh,s.y+.08)&&(s.z+=h);const f=i.heightAt(s.x,s.z);if(s.grounded&&Math.abs(s.y-f)<.4)s.y=f,s.vy=0;else{s.grounded=!1,s.vy-=18*t,s.y+=s.vy*t;for(const d of i.colliders)$g(s.x,s.z,Bh*.9,d)&&(s.vy<=0&&o>=d.maxY-.08&&s.y<=d.maxY&&(s.y=d.maxY,s.vy=0,s.grounded=!0),s.vy>0&&o+1.9<=d.minY+.05&&s.y+1.9>d.minY&&(s.y=d.minY-1.9,s.vy=0));s.y<=f&&(s.y=f,s.vy=0,s.grounded=!0)}s.moving=Math.hypot(e.x,e.z)>.3&&Math.hypot(s.x-s.prevX,s.z-s.prevZ)>.001,s.moving&&s.grounded&&(s.walk+=Math.hypot(e.x,e.z)*t*2.2,s.step+=Math.hypot(e.x,e.z)*t)}class bw{constructor(e){this.game=e}update(e,t){const i=this.game,o=e.ammo[Fn(e)];if(o&&o.mag===0&&o.reserve===0&&i.equip(e,e.slot==="primary"?"secondary":"melee"),i.time>=e.thinkAt){e.thinkAt=i.time+.14+Math.random()*.09;let m=null,g=1/0;const v=new F(e.x,e.y+ha,e.z);for(const _ of i.actors){if(!_.alive||_.team===e.team)continue;const M=hn(e,_);if(M>48||M>g)continue;const w=Math.atan2(-(_.x-e.x),-(_.z-e.z));M>9&&Math.abs(sa(w,e.yaw))>1.45||i.world.visible(v,new F(_.x,_.y+1.35,_.z))&&(m=_,g=M)}m&&e.target!==m.id&&(e.reactionAt=i.time+.3+Math.random()*.3),e.target=m?.id??null,m&&(e.team===i.settings.team&&(m.lastSeen=i.time,i.spotEnemy(m)),e.lastSeen=i.time)}const a=e.target===null?null:i.actors[e.target];let c=!1;if(a?.alive){const m=new F(e.x,e.y+ha,e.z),g=new F(a.x,a.y+1.23,a.z);if(i.world.visible(m,g)){c=!0,e.state="engage";const v=Math.atan2(-(a.x-e.x),-(a.z-e.z));e.yaw+=sa(v,e.yaw)*Math.min(1,t*12),e.pitch=Math.atan2(g.y-m.y,hn(e,a)),i.time>=e.reactionAt&&Math.abs(sa(v,e.yaw))<.12&&i.shoot(e,a);const _=Xn[Fn(e)];e.ammo[_.id]?.mag===0&&i.reload(e);const w=Math.sin(i.time*1.7+e.id*2.3)>.2?1:-1;_.category==="knife"&&hn(e,a)>1.8?this.navigate(e,a,t):!e.reloading&&_.category!=="sniper"?i.move(e,{x:Math.cos(v)*w*1.05,z:-Math.sin(v)*w*1.05},t):i.move(e,{x:0,z:0},t)}}if(c)return;e.pitch*=Math.max(0,1-t*5);const h=i.bomb;let f;if(h.state==="planted")if(e.team==="CT"){if(e.state="defuse",f=h,hn(e,h)<1.55){i.move(e,{x:0,z:0},t),i.interact(e,t);return}}else{e.state="patrol";const m=qi[h.site],g=h.site==="A"?[{x:35,z:11},{x:23,z:16},{x:31,z:24}]:[{x:-33,z:5},{x:-23,z:16},{x:-36,z:19}];f=g[e.id%g.length]??m}else if(e.team==="T"&&h.state==="dropped")e.state="retrieve",f=h;else if(e.team==="T"&&h.carrier===e.id&&i.world.siteAt(e.x,e.z)){e.state="plant",i.move(e,{x:0,z:0},t),i.interact(e,t);return}else e.routeIndex<e.route.length?(e.state="advance",f=e.route[e.routeIndex],hn(e,f)<1.7&&(e.routeIndex++,e.repathAt=0,e.routeIndex<e.route.length&&(f=e.route[e.routeIndex]))):(e.state="patrol",e.team==="T"?f=qi[i.attackSite]:f=[[{x:-30,z:9},{x:-16,z:20}],[{x:0,z:9},{x:0,z:-6}],[{x:18,z:9},{x:18,z:-8}],[{x:34,z:13},{x:34,z:-8}],[{x:-24,z:17},{x:-31,z:4}]][e.id%5][Math.floor((i.time+e.id*4)/12)%2]);this.navigate(e,f,t);const d=e.ammo[Fn(e)];d&&d.mag<6&&!e.reloading&&i.reload(e)}navigate(e,t,i){const o=this.game;(!e.destination||hn(e.destination,t)>2||o.time>e.repathAt||e.pathIndex>=e.path.length)&&(e.path=o.navigation.findPath(e,t),e.pathIndex=0,e.destination={...t},e.repathAt=o.time+1.8+e.id*.03);let a=e.path[e.pathIndex];if(!a){o.move(e,{x:0,z:0},i),e.yaw+=i*.35;return}if(hn(e,a)<.48&&(e.pathIndex++,a=e.path[e.pathIndex]),!a||hn(e,t)<.6){o.move(e,{x:0,z:0},i),e.yaw+=i*.15;return}const c=hn(e,a),h=Xn[Fn(e)].speed*.8;let f=(a.x-e.x)/c*h,d=(a.z-e.z)/c*h;for(const v of o.actors){if(!v.alive||v.id===e.id)continue;const _=hn(e,v);if(_>.01&&_<1.05){const M=(1.05-_)*5;f+=(e.x-v.x)/_*M,d+=(e.z-v.z)/_*M}}const m=Math.hypot(f,d);m>h&&(f=f/m*h,d=d/m*h);const g=Math.atan2(-f,-d);e.yaw+=sa(g,e.yaw)*Math.min(1,i*8),o.move(e,{x:f,z:d},i)}}class Pw{context=null;master=null;noise=null;volume=.6;async unlock(){if(!this.context){this.context=new AudioContext,this.master=this.context.createGain(),this.master.gain.value=this.volume*.52,this.master.connect(this.context.destination),this.noise=this.context.createBuffer(1,this.context.sampleRate*2,this.context.sampleRate);const e=this.noise.getChannelData(0);for(let t=0;t<e.length;t++)e[t]=Math.random()*2-1}this.context.state==="suspended"&&await this.context.resume()}setVolume(e){this.volume=e,this.master&&this.context&&this.master.gain.setTargetAtTime(e*.52,this.context.currentTime,.1)}tone(e,t,i,o,a="sine",c=0,h=0){if(!this.context||!this.master)return;const f=this.context,d=f.currentTime+c,m=f.createOscillator(),g=f.createGain(),v=f.createStereoPanner();m.type=a,m.frequency.setValueAtTime(e,d),m.frequency.exponentialRampToValueAtTime(Math.max(15,t),d+i),g.gain.setValueAtTime(1e-4,d),g.gain.exponentialRampToValueAtTime(Math.max(2e-4,o),d+.003),g.gain.exponentialRampToValueAtTime(1e-4,d+i),v.pan.value=Ir(h,-1,1),m.connect(g),g.connect(v),v.connect(this.master),m.start(d),m.stop(d+i+.02),m.onended=()=>{m.disconnect(),g.disconnect(),v.disconnect()}}hiss(e,t,i,o=0,a=0,c=!1){if(!this.context||!this.master||!this.noise)return;const h=this.context,f=h.currentTime+o,d=h.createBufferSource(),m=h.createBiquadFilter(),g=h.createGain(),v=h.createStereoPanner();d.buffer=this.noise,m.type=c?"highpass":"lowpass",m.frequency.value=i,g.gain.setValueAtTime(1e-4,f),g.gain.exponentialRampToValueAtTime(Math.max(2e-4,t),f+.002),g.gain.exponentialRampToValueAtTime(1e-4,f+e),v.pan.value=Ir(a,-1,1),d.connect(m),m.connect(g),g.connect(v),v.connect(this.master),d.start(f,Math.random()),d.stop(f+e),d.onended=()=>{d.disconnect(),m.disconnect(),g.disconnect(),v.disconnect()}}shot(e,t=1,i=0){if(t<.015)return;if(e==="knife"){this.hiss(.16,.2*t,2300,0,i,!0);return}const o={ak47:[135,40,.24,2200,.9],m4a4:[190,65,.16,3200,.65],awp:[80,22,.65,1400,1.3],glock:[290,90,.12,3400,.5],usp:[540,150,.075,900,.22],deagle:[120,35,.3,2500,.85]}[e];this.hiss(o[2],o[4]*t,o[3],0,i),this.tone(o[0],o[1],o[2],.4*t,"triangle",0,i),this.tone(o[0]*3,50,.028,.16*t,"square",0,i),e==="awp"&&this.hiss(.48,.28*t,600,.08,i)}reload(e=1){for(const[t,i,o]of[[0,2600,.11],[.22,1800,.16],[.9,3200,.18],[1.25,2400,.12]])this.hiss(.065,o*e,i,t),this.tone(230,110,.045,.1*e,"square",t)}step(e=1,t=0){this.hiss(.085,.16*e,750,0,t),this.tone(105,45,.075,.1*e,"sine",0,t)}scope(){this.hiss(.075,.13,3800),this.tone(1e3,450,.08,.08,"triangle")}hit(e=!1){this.tone(e?1500:1050,e?2100:750,.08,.14,"triangle"),this.hiss(.04,.09,6e3)}kill(){this.tone(660,660,.12,.15,"sine"),this.tone(990,990,.2,.12,"sine",.09)}dry(){this.hiss(.025,.15,2200)}plant(){this.tone(1150,1150,.08,.12,"square"),this.tone(1400,1400,.14,.13,"square",.13)}beep(e=.5){this.tone(1450,1450,.085,.12*e,"sine")}defuse(){for(let e=0;e<5;e++)this.tone(1400-e*180,1200-e*180,.16,.12,"sine",e*.12)}explosion(){this.hiss(2.6,1.8,1e3),this.tone(65,18,2,.85,"sine"),this.hiss(1.5,.4,400,.3)}win(){for(const[e,t]of[440,554,660].entries())this.tone(t,t,.35,.1,"triangle",e*.13)}dispose(){this.context?.close()}}const oa=new Lr(1,1,1),Vh=new Map,Lw=new ga({vertexColors:!0,roughness:.7,metalness:.12});function yc(s){const e=[];for(const m of[...s.children])!(m instanceof Ut)||m instanceof rc||m.geometry!==oa||Array.isArray(m.material)||e.push(m);if(e.length<2)return;const t=[],i=[],o=[],a=new F,c=new F,h=new mt;for(const m of e){m.updateMatrix(),h.getNormalMatrix(m.matrix);const g=oa.getAttribute("position"),v=oa.getAttribute("normal"),_=oa.getIndex(),M=m.material.color;for(let w=0;w<_.count;w++){const S=_.getX(w);a.fromBufferAttribute(g,S).applyMatrix4(m.matrix),c.fromBufferAttribute(v,S).applyMatrix3(h).normalize(),t.push(a.x,a.y,a.z),i.push(c.x,c.y,c.z),o.push(M.r,M.g,M.b)}s.remove(m)}const f=new en;f.setAttribute("position",new Nt(t,3)),f.setAttribute("normal",new Nt(i,3)),f.setAttribute("color",new Nt(o,3)),f.computeBoundingSphere();const d=new Ut(f,Lw);d.castShadow=!0,d.receiveShadow=!0,s.add(d)}function td(s){return Vh.has(s)||Vh.set(s,new ga({color:s,roughness:.7,metalness:s===12240324?.75:.12})),Vh.get(s)}function nt(s,e,t,i,o,a,c,h){const f=new Ut(oa,td(h));return f.position.set(e,t,i),f.scale.set(o,a,c),f.castShadow=!0,f.receiveShadow=!0,s.add(f),f}function Zs(s,e,t,i,o,a,c){const h=new Ut(new pc(o,o,a,10),td(c));return h.rotation.x=Math.PI/2,h.position.set(e,t,i),h.castShadow=!0,s.add(h),h}function nd(s){const e=new zn;e.name=s;const t=3291963,i=2107431;let o=-.7;if(s==="knife"){nt(e,0,.01,-.06,.07,.07,.23,3620148),nt(e,0,.01,-.19,.17,.035,.04,7108981);const d=new Hg;d.moveTo(-.045,0),d.lineTo(-.045,.28),d.lineTo(.025,.4),d.lineTo(.065,.02),d.closePath();const m=new Ut(new Zf(d,{depth:.012,bevelEnabled:!1}),td(12240324));m.rotation.x=-Math.PI/2,m.position.set(0,.012,-.2),e.add(m),o=-.59}else if(s==="glock"||s==="usp"||s==="deagle"){const d=s==="deagle";nt(e,0,.02,-.15,d?.095:.075,.1,d?.35:.27,d?10134693:t),nt(e,0,-.08,-.045,.074,.17,.105,i).rotation.x=-.15,nt(e,0,-.05,-.16,.025,.025,.09,7371129),nt(e,0,.085,-.22,.025,.028,.04,i),nt(e,0,.085,-.04,.065,.025,.035,i);for(let g=0;g<5;g++)nt(e,0,.02,-.07+g*.013,.079,.065,.004,5661023);o=d?-.35:-.3,s==="usp"&&(Zs(e,0,.025,-.4,.027,.22,i),o=-.52)}else{const d=s==="ak47",m=s==="awp",g=d?9658681:m?6518349:4806483;if(nt(e,0,.025,-.21,m?.105:.09,.13,.36,t),nt(e,0,-.07,-.03,.075,.16,.09,i).rotation.x=-.3,nt(e,0,-.055,.08,.09,.12,.3,g),nt(e,0,-.08,.22,.115,.18,.045,i),nt(e,0,.016,-.46,.1,.105,.25,g),Zs(e,0,.027,-.7,m?.024:.017,m?.38:.25,i),Zs(e,0,.027,m?-.92:-.84,m?.035:.024,.07,t),m){nt(e,0,-.09,-.25,.075,.1,.14,i),nt(e,0,.13,-.24,.065,.11,.06,i),Zs(e,0,.19,-.3,.045,.3,t),Zs(e,0,.19,-.47,.06,.06,i);const v=Zs(e,0,.19,-.506,.043,.005,6927549);v.material.metalness=.5,nt(e,.08,.055,-.14,.09,.025,.035,8491403)}else{const v=nt(e,0,-.14,-.24,.065,.25,.12,d?4014400:5661279);if(v.rotation.x=d?-.25:.1,nt(e,0,.105,-.51,.035,.075,.03,i),nt(e,0,.105,-.12,.07,.035,.06,i),!d)for(let _=0;_<6;_++)nt(e,0,.08,-.36-_*.025,.11,.025,.009,2502444)}o=m?-.97:-.89}const a=new zn;a.name="muzzle",a.position.set(0,.03,o),a.visible=!1;const c=new as({color:16767882,transparent:!0,opacity:.9,blending:Hh,depthWrite:!1}),h=new Ut(new mc(.085,.27,6),c);h.rotation.x=-Math.PI/2,h.position.z=-.08,a.add(h);const f=new Ut(new xc(.11),c);return f.scale.set(1,.4,1.7),a.add(f),e.add(a),yc(e),e}function Nw(s,e){const t=new zn,i=s==="CT",o=i?3427937:11040079,a=i?2636361:6973010,c=i?2505282:7100224,h=12359287;nt(t,0,1.2,0,.59,.52,.32,o),nt(t,0,1.22,-.09,.49,.43,.23,c),nt(t,0,.9,0,.5,.15,.31,a),nt(t,0,.91,-.18,.51,.065,.04,3356974);for(const _ of[-.16,0,.16])nt(t,_,1.16,-.232,.12,.19,.065,i?4216916:8942160);if(nt(t,0,1.55,0,.16,.14,.17,h),nt(t,0,1.73,0,.3,.34,.29,i?4082765:h),i)nt(t,0,1.88,.01,.36,.19,.35,3361360),nt(t,0,1.75,-.157,.29,.085,.025,1713705),nt(t,0,1.76,-.173,.23,.048,.015,9088425),nt(t,.19,1.77,.02,.07,.15,.12,2241838),nt(t,0,1.39,.195,.22,.08,.03,11388352);else{nt(t,0,1.86,.015,.32,.1,.32,5982272),nt(t,0,1.63,-.13,.31,.16,.09,10327418),nt(t,0,1.76,-.153,.27,.065,.03,3157289),nt(t,0,1.47,-.08,.34,.12,.32,11181438);for(const _ of[-.08,.08])nt(t,_,1.48,-.25,.045,.1,.02,6642762)}const f=new zn,d=new zn;for(const[_,M]of[[f,-1],[d,1]])_.position.set(M*.155,.89,0),t.add(_),nt(_,0,-.2,0,.23,.39,.25,a),nt(_,0,-.53,.005,.19,.31,.21,a),nt(_,0,-.4,-.1,.19,.15,.06,i?2439229:5921097),nt(_,0,-.79,-.07,.23,.18,.37,2961451);const m=new zn,g=new zn;for(const[_,M]of[[m,-1],[g,1]]){_.position.set(M*.35,1.4,0),t.add(_),nt(_,0,-.13,-.025,.2,.3,.22,o).rotation.x=.2;const w=nt(_,M===1?-.025:.15,-.27,-.24,.16,.17,.4,i?o:h);w.rotation.y=M===1?0:-.5,nt(_,M===1?-.025:.23,-.24,-.42,.16,.15,.16,4080950)}const v=nd(e);v.position.set(.24,1.18,-.43),t.add(v),t.userData.weaponCache=new Map([[e,v]]);for(const _ of[t,f,d,m,g])yc(_);return{root:t,leftLeg:f,rightLeg:d,leftArm:m,rightArm:g,weapon:v,flash:v.getObjectByName("muzzle")}}function Q0(s,e){if(s.weapon.name===e)return;s.root.remove(s.weapon);const t=s.root.userData.weaponCache;let i=t.get(e);i||(i=nd(e),t.set(e,i)),s.weapon=i,s.weapon.position.set(.24,1.18,-.43),s.root.add(s.weapon),s.flash=s.weapon.getObjectByName("muzzle")}function Iw(s,e){const t=new zn;t.position.set(.24,-.25,-.45);const i=e==="CT"?3427937:10256480;if(nt(t,.01,-.18,.15,.13,.15,.39,i).rotation.x=-.2,nt(t,.005,-.09,-.005,.12,.14,.14,4344377),s!=="knife"){const a=nt(t,-.19,-.12,-.1,.12,.14,.36,i);a.rotation.y=-.58,a.rotation.x=-.15,nt(t,-.085,-.07,-.31,.12,.13,.14,4344377)}const o=nd(s);return t.add(o),yc(t),{root:t,flash:o.getObjectByName("muzzle")}}function Dw(){const s=new zn;nt(s,0,.09,0,.42,.18,.32,5659451);for(let t=0;t<3;t++)nt(s,-.13+t*.13,.16,0,.1,.12,.28,7829325);nt(s,0,.24,-.025,.27,.035,.18,3160626),nt(s,0,.263,-.065,.17,.007,.055,10083234);for(let t=0;t<3;t++)for(let i=0;i<3;i++)nt(s,-.07+i*.07,.264,.015+t*.04,.035,.009,.023,12105891);const e=new Ut(new _c(.022,6,6),new as({color:16731451}));return e.position.set(.16,.25,-.1),e.name="led",s.add(e),yc(s),s}const Uw=[{zone:"head",min:new F(-.17,1.56,-.18),max:new F(.17,1.98,.18)},{zone:"chest",min:new F(-.29,1.13,-.19),max:new F(.29,1.49,.18)},{zone:"abdomen",min:new F(-.27,.86,-.18),max:new F(.27,1.13,.18)},{zone:"arm",min:new F(-.46,1.02,-.56),max:new F(-.24,1.48,.11)},{zone:"arm",min:new F(.24,1.02,-.56),max:new F(.46,1.48,.11)},{zone:"leg",min:new F(-.28,.02,-.2),max:new F(-.035,.86,.18)},{zone:"leg",min:new F(.035,.02,-.2),max:new F(.28,.86,.18)}];function Fw(s,e,t,i){const o=Math.cos(t.yaw),a=Math.sin(t.yaw),c=s.x-t.x,h=s.z-t.z,f=new F(o*c-a*h,s.y-t.y,a*c+o*h),d=new F(o*e.x-a*e.z,e.y,a*e.x+o*e.z);let m=i,g=null;for(const v of Uw){const _=qg(f,d,v.min,v.max,m);_<m&&(m=_,g=v.zone)}return g?{distance:m,zone:g}:null}const Uf={team:"CT",pistolOpening:!1,primary:"m4a4",sidearm:"default",sensitivity:1,volume:.6},eg=["ROOK","VIPER","SABLE","GHOST","NOMAD","KESTREL","ATLAS","ECHO","FALCON","WOLF"];class Ow{constructor(e){this.host=e,this.renderer=new zE({antialias:!0,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.65)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=sg,this.renderer.shadowMap.autoUpdate=!1;const t=this.renderer.getContext(),i=t.getExtension("WEBGL_debug_renderer_info"),o=i?String(t.getParameter(i.UNMASKED_RENDERER_WEBGL)):"";this.softwareRenderer=/swiftshader|llvmpipe|software/i.test(o),this.softwareRenderer&&(this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,.85)),this.renderer.shadowMap.enabled=!1),this.renderer.toneMapping=ag,this.renderer.toneMappingExposure=1.1,this.renderer.outputColorSpace=Yn,this.renderer.domElement.setAttribute("aria-label","Dust II 3D 游戏画面"),this.renderer.domElement.tabIndex=0,e.appendChild(this.renderer.domElement),this.scene.background=new yt(12899029),this.scene.fog=new qf(12899029,48,135),this.scene.add(new W0(14938367,10785130,2.25));const a=new q0(16772559,3.2);a.position.set(-34,55,-20),a.castShadow=!0,a.shadow.mapSize.set(this.softwareRenderer?1024:2048,this.softwareRenderer?1024:2048),Object.assign(a.shadow.camera,{left:-61,right:61,top:61,bottom:-61,near:1,far:150}),a.shadow.bias=-45e-5,a.shadow.normalBias=.025,this.scene.add(a),this.world=new ww(this.scene),this.navigation=new Tw(this.world),this.bots=new bw(this),this.scene.add(this.bombMesh,this.muzzleLight),this.viewScene.add(new W0(15922157,7104856,2.8));const c=new q0(16769458,3);c.position.set(-3,6,-2),this.viewScene.add(c),this.makeActors(),this.setupRound(),this.phase="menu",this.controlId=null;for(const[h,f,d,m]of[[5,33,15,.8],[6,24.5,21,-1],[0,34.5,3,2.8]]){const g=this.actors[h];g.x=f,g.z=d,g.y=this.world.heightAt(f,d),g.yaw=m}this.optimizeSoftwareMaterials(this.scene),this.resizeObserver=new ResizeObserver(this.resize),this.resizeObserver.observe(e),this.resize(),document.addEventListener("keydown",this.keydown),document.addEventListener("keyup",this.keyup),document.addEventListener("mousemove",this.mousemove),document.addEventListener("pointerlockchange",this.pointerlockchange),document.addEventListener("pointerlockerror",this.pointerlockerror),window.addEventListener("blur",this.blur),this.renderer.domElement.addEventListener("mousedown",this.mousedown),document.addEventListener("mouseup",this.mouseup),this.renderer.domElement.addEventListener("contextmenu",this.contextmenu),this.renderer.domElement.addEventListener("wheel",this.wheel,{passive:!1}),this.publish(),this.frameId=requestAnimationFrame(this.frame)}scene=new L0;camera=new On(78,1,.06,220);renderer;world;navigation;audio=new Pw;actors=[];spotted=new Map;lastKnownPositions=new Map;bots;settings={...Uf};phase="menu";time=0;round=1;paused=!1;started=!1;attackSite="A";bomb={state:"carried",carrier:0,x:0,y:0,z:-39,site:null,plantedAt:0,explodeAt:0,actionActor:null,progress:0,nextBeep:0};controlId=null;viewId=5;scoreT=0;scoreCT=0;pistol=!1;scoreFeed=[];winner=null;reason="";freezeEnd=3;roundEnd=118;nextRound=1/0;scoped=!1;hitUntil=0;hitHead=!1;hurtUntil=0;feedId=0;input={keys:new Set,fire:!1,pressed:!1};locked=!1;interacted=new Set;listeners=new Set;snapshot;frameId=0;disposed=!1;lastFrame=performance.now();accumulator=0;lastPublish=0;nextSpot=0;fps=60;frameCount=0;fpsTime=performance.now();lastResolutionChange=0;lastShadow=-1;softwareRenderer=!1;softwareMaterials=new Map;softwareGeometry=new WeakSet;effects=[];flashes=new Map;bombMesh=Dw();viewScene=new L0;viewCamera=new On(65,1,.01,10);viewModel=null;viewModels=new Map;currentViewWeapon="";muzzleLight=new Yg(16760421,0,6,2);resizeObserver;reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;subscribe=e=>(this.listeners.add(e),()=>this.listeners.delete(e));getSnapshot=()=>this.snapshot;start(e){this.settings={...e},this.audio.setVolume(e.volume),this.audio.unlock(),this.scoreT=0,this.scoreCT=0,this.round=1,this.time=0,this.started=!0;for(const t of this.actors)t.kills=0,t.deaths=0;this.scoreFeed=[],this.setupRound(),this.resume(),this.publish()}resume(){this.audio.unlock();try{const e=this.renderer.domElement.requestPointerLock();e&&e.catch(()=>this.pointerlockerror())}catch{this.pointerlockerror()}}pause(){document.pointerLockElement&&document.exitPointerLock(),this.paused=!0,this.clearInput(),this.publish()}updateSettings(e){this.settings={...e},this.audio.setVolume(e.volume)}restartRound(){this.setupRound(),this.resume()}returnToMenu(){this.started=!1,this.phase="menu",this.controlId=null,this.paused=!1,this.scoped=!1,this.muzzleLight.intensity=0,this.camera.fov=78,this.camera.updateProjectionMatrix(),this.clearEffects(),this.clearInput(),document.pointerLockElement&&document.exitPointerLock(),this.publish()}pointerlockerror=()=>{this.paused=!0,this.publish()};pointerlockchange=()=>{this.locked=document.pointerLockElement===this.renderer.domElement,this.paused=this.started&&!this.locked,this.clearInput(),this.publish()};blur=()=>{this.started&&this.pause()};contextmenu=e=>e.preventDefault();clearInput(){this.input.keys.clear(),this.input.fire=!1,this.input.pressed=!1}keydown=e=>{if(!this.started||(["Space","Tab","KeyW","KeyA","KeyS","KeyD"].includes(e.code)&&e.preventDefault(),!this.locked)||(this.input.keys.add(e.code),e.repeat))return;const t=this.controlId===null?null:this.actors[this.controlId];e.code==="KeyE"&&this.controlId===null&&this.takeOver(),["BracketRight","BracketLeft"].includes(e.code)&&this.controlId===null&&this.cycleSpectator(e.code==="BracketLeft"?-1:1),t?.alive&&(e.code==="KeyR"&&this.reload(t),e.code==="Digit1"&&this.equip(t,"primary"),e.code==="Digit2"&&this.equip(t,"secondary"),e.code==="Digit3"&&this.equip(t,"melee"),e.code==="KeyQ"&&this.equip(t,t.slot==="primary"?"secondary":t.primary?"primary":"melee"),e.code==="Space"&&t.grounded&&this.phase==="live"&&(t.vy=6.8,t.grounded=!1))};keyup=e=>{this.input.keys.delete(e.code)};mousemove=e=>{if(!this.locked||this.controlId===null)return;const t=this.actors[this.controlId];if(!t.alive)return;const i=.0021*this.settings.sensitivity*(this.scoped?.38:1);t.yaw-=e.movementX*i,t.pitch=Ir(t.pitch-e.movementY*i,-1.4,1.4)};mousedown=e=>{if(this.started){if(!this.locked){this.resume();return}e.button===0&&(this.input.fire=!0,this.input.pressed=!0),e.button===2&&this.controlId!==null&&Fn(this.actors[this.controlId])==="awp"&&!this.actors[this.controlId].reloading&&(this.scoped=!this.scoped,this.audio.scope(),this.publish())}};mouseup=e=>{e.button===0&&(this.input.fire=!1)};wheel=e=>{if(!this.locked||this.controlId===null)return;e.preventDefault();const t=this.actors[this.controlId],i=t.primary?["primary","secondary","melee"]:["secondary","melee"];this.equip(t,i[(i.indexOf(t.slot)+(e.deltaY>0?1:i.length-1))%i.length])};makeActors(){for(let e=0;e<10;e++){const t=e<5?"T":"CT",i={id:e,team:t,name:eg[e],x:0,y:0,z:0,prevX:0,prevY:0,prevZ:0,yaw:0,pitch:0,vy:0,grounded:!0,hp:100,armor:100,alive:!0,primary:t==="T"?"ak47":"m4a4",secondary:t==="T"?"glock":"usp",slot:"primary",ammo:{},nextShot:0,reloadEnd:0,reloading:null,bloom:0,recoil:0,walk:0,step:0,moving:!1,kills:0,deaths:0,damage:0,state:"advance",path:[],pathIndex:0,repathAt:0,destination:null,route:[],routeIndex:0,target:null,reactionAt:0,thinkAt:0,strafe:0,actionProgress:0,lastHurt:-10,lastSeen:-10,visual:Nw(t,t==="T"?"ak47":"m4a4")};this.actors.push(i),this.scene.add(i.visual.root)}}setupRound(){this.clearEffects(),this.pistol=this.settings.pistolOpening&&this.round===1,this.attackSite=this.round%2?"A":"B";const e=this.settings.team==="T"?0:5;this.controlId=e,this.viewId=e,this.scoped=!1,this.winner=null,this.reason="",this.spotted.clear(),this.lastKnownPositions.clear(),this.freezeEnd=this.time+3,this.roundEnd=this.freezeEnd+115,this.nextRound=1/0,this.phase="freeze",this.hitUntil=0,this.hurtUntil=0;for(const i of this.actors){const o=Ew[i.team],a=i.id%5;i.x=o.x+(a-2)*1.5,i.z=o.z+a%2*1.8,i.y=this.world.heightAt(i.x,i.z),i.prevX=i.x,i.prevZ=i.z,i.prevY=i.y,i.name=i.id===e?"YOU":eg[i.id],i.yaw=i.team==="T"?Math.PI:0,i.pitch=0,i.vy=0,i.grounded=!0,i.hp=100,i.armor=this.pistol?0:100,i.alive=!0,i.primary=this.pistol?null:i.id===e?this.settings.primary:a===3?"awp":i.team==="T"?"ak47":"m4a4",i.secondary=!this.pistol&&i.id===e&&this.settings.sidearm==="deagle"?"deagle":i.team==="T"?"glock":"usp",i.slot=i.primary?"primary":"secondary",i.ammo={};for(const c of[i.primary,i.secondary])c&&(i.ammo[c]={mag:Xn[c].magazine,reserve:Xn[c].reserve});if(i.nextShot=this.time,i.reloadEnd=0,i.reloading=null,i.bloom=0,i.recoil=0,i.walk=0,i.step=0,i.moving=!1,i.state="advance",i.path=[],i.pathIndex=0,i.repathAt=0,i.destination=null,i.routeIndex=0,i.target=null,i.reactionAt=0,i.thinkAt=0,i.actionProgress=0,i.lastHurt=-10,i.lastSeen=-10,i.team==="T"){const c=this.attackSite==="A"?["long","long","short","short","tunnels"]:["tunnels","tunnels","mid","long","tunnels"];i.route=J0[c[a]].map(h=>({...h}))}else{const c=[[{x:-15,z:20},{x:-30,z:13}],[{x:0,z:12},{x:0,z:7}],[{x:19,z:25},{x:27,z:16},{x:18,z:7}],[{x:28,z:25},{x:34,z:15}],[{x:-14,z:20},{x:-24,z:18}]];i.route=c[a]}i.visual.root.rotation.set(0,i.yaw,0),Q0(i.visual,Fn(i)),this.optimizeSoftwareMaterials(i.visual.root)}const t=this.actors[0];this.bomb={state:"carried",carrier:t.id,x:t.x,y:t.y,z:t.z,site:null,plantedAt:0,explodeAt:0,actionActor:null,progress:0,nextBeep:0},this.flashes.clear(),this.clearInput(),this.lastShadow=-1,this.publish()}equip(e,t){t==="primary"&&!e.primary||e.slot!==t&&(e.slot=t,e.reloading=null,e.reloadEnd=0,e.bloom=0,e.id===this.controlId&&(this.scoped=!1,this.audio.scope()),Q0(e.visual,Fn(e)),this.optimizeSoftwareMaterials(e.visual.root))}reload(e){const t=Fn(e),i=Xn[t],o=e.ammo[t];if(!e.alive||e.reloading||!o||o.mag>=i.magazine||o.reserve<=0)return;e.reloading=t,e.reloadEnd=this.time+i.reload,e.id===this.controlId&&(this.scoped=!1);const a=this.soundAt(e);this.audio.reload(a.volume*(e.id===this.viewId?1:.45))}move(e,t,i){if(Rw(e,t,i,this.world),e.step>2.05&&e.grounded){e.step=0;const o=this.soundAt(e);this.audio.step(o.volume*(e.id===this.viewId?.6:.8),o.pan)}}shoot(e,t){const i=Fn(e),o=Xn[i],a=e.ammo[i];if(this.phase!=="live"||!e.alive||e.reloading||this.time<e.nextShot||e.actionProgress>0)return;if(a&&a.mag<=0){e.id===this.controlId&&this.input.pressed&&this.audio.dry(),this.reload(e);return}a&&a.mag--,e.nextShot=this.time+o.interval*(t?1.25+Math.random()*.35:1);const c=new F(e.x,e.y+ha,e.z);let h;if(t){const _=Math.random()<.14;h=new F(t.x+(Math.random()-.5)*.18,t.y+(_?1.77:1.26),t.z).sub(c).normalize();const M=i==="awp"?.009:.015+(e.moving?.009:0);h.x+=(Math.random()-.5)*M*2,h.y+=(Math.random()-.5)*M*1.6,h.z+=(Math.random()-.5)*M*2,h.normalize(),Math.random()<.12&&(e.nextShot+=.35)}else{const _=(i==="awp"&&this.scoped?55e-5:o.spread)+e.bloom+(e.moving?.007:0)+(e.grounded?0:.025),M=e.yaw+(Math.random()-.5)*_*2,w=e.pitch+e.recoil+(Math.random()-.5)*_*2;h=new F(0,0,-1).applyEuler(new _i(w,M,0,"YXZ")),e.recoil=Math.min(.28,e.recoil+o.recoil),e.bloom=Math.min(.07,e.bloom+o.recoil*.29),i==="awp"&&(this.scoped=!1)}const f=this.world.raycast(c,h,o.range);let d=null,m=f;for(const _ of this.actors){if(!_.alive||_.id===e.id)continue;const M=Fw(c,h,_,m);M&&M.distance<m&&(m=M.distance,d={actor:_,zone:M.zone,distance:M.distance})}const g=c.clone().addScaledVector(h,m),v=this.soundAt(e);if(this.audio.shot(i,v.volume,v.pan),this.flashes.set(e.id,this.time+.055),i!=="knife"&&this.tracer(c.clone().addScaledVector(h,.7).add(new F(0,-.13,0)),g),d&&d.actor.team!==e.team){const _=Cw(o,d.zone,d.actor.armor);d.actor.armor=Math.max(0,d.actor.armor-_.armorDamage),d.actor.hp=Math.max(0,d.actor.hp-_.damage),d.actor.lastHurt=this.time,e.damage+=_.damage,this.impact(g,11031353,.14),e.id===this.controlId&&(this.hitUntil=this.time+.18,this.hitHead=d.zone==="head",this.audio.hit(this.hitHead)),d.actor.id===this.controlId&&(this.hurtUntil=this.time+.5),d.actor.hp<=0&&this.kill(d.actor,e,i,d.zone==="head")}else m<o.range&&this.impact(g,13285525,.1)}kill(e,t,i,o=!1){if(e.alive&&(e.alive=!1,e.hp=0,e.deaths++,e.actionProgress=0,e.reloading=null,t&&t.kills++,this.scoreFeed.unshift({id:++this.feedId,killer:t?.name??"C4",victim:e.name,team:t?.team??"T",weapon:i,headshot:o,at:this.time,player:t?.id===this.controlId||e.id===this.controlId}),this.scoreFeed=this.scoreFeed.slice(0,6),t?.id===this.controlId&&this.audio.kill(),this.bomb.carrier===e.id&&(this.bomb.state="dropped",this.bomb.carrier=null,this.bomb.x=e.x,this.bomb.z=e.z,this.bomb.y=e.y,this.bomb.vy=0,this.bomb.progress=0,this.bomb.actionActor=null),e.id===this.controlId)){this.controlId=null,this.scoped=!1,this.clearInput();const a=this.actors.find(c=>c.team===this.settings.team&&c.alive);a&&(this.viewId=a.id)}}takeOver(e=this.viewId){const t=this.actors[e];!t?.alive||t.team!==this.settings.team||(this.controlId=t.id,this.viewId=t.id,this.scoped=!1,this.clearInput(),this.publish())}cycleSpectator(e){const t=this.actors.filter(o=>o.alive&&o.team===this.settings.team);if(!t.length)return;const i=t.findIndex(o=>o.id===this.viewId);this.viewId=t[(i+e+t.length)%t.length].id,this.publish()}interact(e,t){if(!e.alive||!e.grounded||e.moving||e.reloading||this.phase!=="live")return;const i=this.bomb;if(!(i.actionActor!==null&&i.actionActor!==e.id&&this.interacted.has(i.actionActor)))if(e.team==="T"&&i.state==="carried"&&i.carrier===e.id&&this.world.siteAt(e.x,e.z)){if(this.interacted.add(e.id),i.actionActor=e.id,e.actionProgress+=t/3.2,i.progress=e.actionProgress,e.actionProgress>=1){i.state="planted",i.carrier=null,i.x=e.x,i.z=e.z,i.y=e.y,i.site=this.world.siteAt(e.x,e.z),i.plantedAt=this.time,i.explodeAt=this.time+40,i.nextBeep=this.time+.5,i.actionActor=null,i.progress=0,e.actionProgress=0,this.audio.plant();for(const o of this.actors.filter(a=>a.team==="CT"))o.repathAt=0,o.target=null}}else e.team==="CT"&&i.state==="planted"&&hn(e,i)<1.8&&Math.abs(e.y-i.y)<1.8&&(this.interacted.add(e.id),i.actionActor=e.id,e.actionProgress+=t/(this.pistol?10:5),i.progress=e.actionProgress,e.actionProgress>=1&&(i.state="defused",i.progress=1,e.actionProgress=0,this.audio.defuse(),this.finish("CT","C4 已成功拆除")))}updateBomb(e){const t=this.bomb;for(const i of this.actors)this.interacted.has(i.id)||(i.actionProgress=0);if(t.actionActor!==null&&!this.interacted.has(t.actionActor)&&(t.actionActor=null,t.progress=0),t.carrier!==null){const i=this.actors[t.carrier];t.x=i.x,t.z=i.z,t.y=i.y}if(t.state==="dropped"){let i=this.world.heightAt(t.x,t.z);for(const a of this.world.colliders)a.maxY<=t.y+.1&&Math.abs(t.x-a.x)<a.w/2&&Math.abs(t.z-a.z)<a.d/2&&(i=Math.max(i,a.maxY));t.vy=(t.vy??0)-e*18,t.y=Math.max(i,t.y+t.vy*e),t.y<=i&&(t.vy=0);const o=this.actors.find(a=>a.alive&&a.team==="T"&&hn(a,t)<1.25&&Math.abs(a.y-t.y)<1.8);o&&(t.state="carried",t.carrier=o.id,o.route=J0[this.attackSite==="A"?"long":"tunnels"].map(a=>({...a})),o.routeIndex=o.route.length-1,o.repathAt=0)}if(t.state==="planted"&&(this.time>=t.nextBeep&&(t.nextBeep=this.time+Math.max(.12,(t.explodeAt-this.time)/40*1.15),this.audio.beep(Math.max(.12,this.soundAt(t).volume))),this.time>=t.explodeAt)){t.state="exploded",t.progress=0,this.audio.explosion();for(let i=0;i<25;i++){const o=new Ut(new Jf(.3+Math.random()*.6),new as({color:i<9?16760153:7960166,transparent:!0,opacity:.8}));o.position.set(t.x,t.y+.2,t.z),this.scene.add(o),this.effects.push({object:o,until:this.time+2.8,velocity:new F((Math.random()-.5)*11,Math.random()*9,(Math.random()-.5)*11)})}for(const i of this.actors)i.alive&&hn(i,t)<24&&this.kill(i,null,"c4");this.finish("T","C4 爆炸 · 目标已摧毁")}}finish(e,t){this.phase==="live"&&(this.phase="over",this.winner=e,this.reason=t,this.nextRound=this.time+7,e==="T"?this.scoreT++:this.scoreCT++,this.audio.win(),this.scoped=!1,this.publish())}updatePlayer(e,t){let i=0,o=0;this.input.keys.has("KeyW")&&o--,this.input.keys.has("KeyS")&&o++,this.input.keys.has("KeyA")&&i--,this.input.keys.has("KeyD")&&i++;const a=Math.hypot(i,o);a>0&&(i/=a,o/=a);let c=Xn[Fn(e)].speed*(this.input.keys.has("ShiftLeft")?.48:1)*(this.scoped?.52:1);this.input.keys.has("KeyE")&&this.bomb.carrier===e.id&&this.world.siteAt(e.x,e.z)&&a===0&&(c=0);const h=Math.cos(e.yaw),f=Math.sin(e.yaw);if(this.move(e,{x:(i*h+o*f)*c,z:(o*h-i*f)*c},t),this.input.keys.has("KeyE")&&this.interact(e,t),(Xn[Fn(e)].automatic?this.input.fire:this.input.pressed)&&this.shoot(e),this.time>this.nextSpot){this.nextSpot=this.time+.15;const m=new F(e.x,e.y+ha,e.z);for(const g of this.actors){if(!g.alive||g.team===e.team||hn(e,g)>65)continue;const v=Math.atan2(-(g.x-e.x),-(g.z-e.z));Math.abs(sa(v,e.yaw))<1&&this.world.visible(m,new F(g.x,g.y+1.4,g.z))&&this.spotEnemy(g)}}}spotEnemy(e){this.spotted.set(e.id,this.time+2.4),this.lastKnownPositions.set(e.id,{x:e.x,z:e.z})}fixedUpdate(e){this.time+=e;for(const o of this.actors)if(o.prevX=o.x,o.prevY=o.y,o.prevZ=o.z,o.moving=!1,o.recoil*=Math.exp(-5.2*e),o.bloom*=Math.exp(-2.8*e),o.reloading&&this.time>=o.reloadEnd){const a=o.ammo[o.reloading],c=Xn[o.reloading].magazine-a.mag,h=Math.min(c,a.reserve);a.mag+=h,a.reserve-=h,o.reloading=null}if(this.phase==="freeze"){this.time>=this.freezeEnd&&(this.phase="live"),this.input.pressed=!1;return}if(this.phase==="over"){this.time>=this.nextRound&&(this.round++,this.setupRound());return}if(this.phase!=="live")return;this.interacted.clear();for(const o of this.actors)o.alive&&(o.id===this.controlId?this.updatePlayer(o,e):this.bots.update(o,e));if(this.input.pressed=!1,this.updateBomb(e),this.phase!=="live")return;const t=this.actors.some(o=>o.team==="T"&&o.alive);this.actors.some(o=>o.team==="CT"&&o.alive)?!t&&this.bomb.state!=="planted"?this.finish("CT","全部恐怖分子已被消灭"):this.time>=this.roundEnd&&this.bomb.state!=="planted"&&this.finish("CT","回合时间结束 · 目标已守住"):this.finish("T","全部反恐精英已被消灭")}soundAt(e){const t=this.actors[this.viewId],i=hn(t,e),o=Math.atan2(e.x-t.x,-(e.z-t.z))+t.yaw;return{volume:i<1?1:Math.max(.015,1/(1+(i/10)**1.65)),pan:Math.sin(o)*.85}}tracer(e,t){e.distanceTo(t)>100&&(t=e.clone().add(t.sub(e).normalize().multiplyScalar(100)));const i=new cc(new en().setFromPoints([e,t]),new aa({color:16766610,transparent:!0,opacity:.7}));this.scene.add(i),this.effects.push({object:i,until:this.time+.045})}impact(e,t,i){const o=new Ut(new xc(i),new as({color:t,transparent:!0,opacity:.7}));o.position.copy(e),this.scene.add(o),this.effects.push({object:o,until:this.time+.18})}clearEffects(){for(const e of this.effects){this.scene.remove(e.object);const t=e.object;t.geometry?.dispose(),t.material instanceof Pr&&t.material.dispose()}this.effects.length=0}updateEffects(e){for(let t=this.effects.length-1;t>=0;t--){const i=this.effects[t];if(this.time>=i.until){this.scene.remove(i.object);const o=i.object;o.geometry?.dispose(),o.material instanceof Pr&&o.material.dispose(),this.effects.splice(t,1);continue}i.velocity&&(i.object.position.addScaledVector(i.velocity,e),i.velocity.y-=e*4,i.object.scale.multiplyScalar(1+e*.7),i.object.material.opacity=Math.min(.8,(i.until-this.time)*.35))}}optimizeSoftwareMaterials(e){if(!this.softwareRenderer)return;const t=new F(-.55,.8,-.3).normalize(),i=new F;e.traverse(o=>{if(!(o instanceof Ut)||!(o.material instanceof ga))return;const a=o.material,c=o.geometry;if(!this.softwareGeometry.has(c)){const f=c.getAttribute("normal"),d=a.vertexColors?c.getAttribute("color"):null;if(f){const m=new Float32Array(f.count*3);for(let g=0;g<f.count;g++){i.fromBufferAttribute(f,g);const v=.62+Math.max(0,i.dot(t))*.48;m[g*3]=(d?.getX(g)??1)*v,m[g*3+1]=(d?.getY(g)??1)*v,m[g*3+2]=(d?.getZ(g)??1)*v}c.setAttribute("color",new si(m,3))}this.softwareGeometry.add(c)}let h=this.softwareMaterials.get(a);h||(h=new as({color:a.color,vertexColors:!0,side:a.side,transparent:a.transparent,opacity:a.opacity}),this.softwareMaterials.set(a,h)),o.material=h})}render(e,t){(this.lastShadow<0||this.started&&!this.paused&&this.time-this.lastShadow>(this.softwareRenderer?.4:.1))&&(this.renderer.shadowMap.needsUpdate=!0,this.lastShadow=this.time);for(const o of this.actors){const a=o.visual;if(a.root.visible=!this.started||o.id!==this.viewId,a.root.position.set(es(o.prevX,o.x,e),es(o.prevY,o.y,e),es(o.prevZ,o.z,e)),!o.alive){a.root.rotation.set(0,o.yaw,Math.PI/2),a.root.position.y+=.16,a.flash.visible=!1;continue}a.root.rotation.set(0,o.yaw,0);const c=o.moving?Math.sin(o.walk)*.48:0;a.leftLeg.rotation.x=c,a.rightLeg.rotation.x=-c,a.weapon.rotation.x=o.pitch*.65,a.flash.visible=(this.flashes.get(o.id)??0)>this.time}if(this.bombMesh.visible=this.bomb.state==="dropped"||this.bomb.state==="planted"||this.bomb.state==="defused",this.bombMesh.position.set(this.bomb.x,this.bomb.y+.02,this.bomb.z),this.bombMesh.rotation.set(0,0,0),this.bomb.state==="carried"&&this.bomb.carrier!==null){const o=this.actors[this.bomb.carrier];this.bombMesh.visible=!this.started||o.id!==this.viewId,this.bombMesh.position.set(o.x+Math.sin(o.yaw)*.26,o.y+1.08,o.z+Math.cos(o.yaw)*.26),this.bombMesh.rotation.set(Math.PI/2,o.yaw,0,"YXZ")}const i=this.bombMesh.getObjectByName("led");if(i&&(i.visible=this.bomb.state==="planted"&&Math.sin(this.time*10)>0),this.started){const o=this.actors[this.viewId],a=o.moving&&o.grounded?Math.sin(o.walk)*.035:0;this.camera.position.set(es(o.prevX,o.x,e),es(o.prevY,o.y,e)+ha+a,es(o.prevZ,o.z,e)),this.camera.rotation.set(o.pitch+o.recoil,o.yaw,0,"YXZ");const c=this.scoped?25:78;this.camera.fov=es(this.camera.fov,c,Math.min(1,t*15)),this.camera.updateProjectionMatrix();const h=Fn(o),f=`${o.team}/${h}`;if(this.currentViewWeapon!==f){this.viewModel&&this.viewScene.remove(this.viewModel.root);let d=this.viewModels.get(f);d||(d=Iw(h,o.team),this.optimizeSoftwareMaterials(d.root),this.viewModels.set(f,d)),this.viewModel=d,this.viewScene.add(d.root),this.currentViewWeapon=f}if(this.viewModel){const d=o.reloading?Ir((o.reloadEnd-this.time)/Xn[o.reloading].reload,0,1):0,m=Math.sin((1-d)*Math.PI)*(o.reloading?1:0);this.viewModel.root.position.set(.24+(o.moving?Math.sin(o.walk*.5)*.011:0),-.25-m*.22+a*.25,-.45+o.recoil*1.5),this.viewModel.root.rotation.set(o.recoil*.7-m*.35,m*-.25,m*-.4),this.viewModel.flash.visible=(this.flashes.get(o.id)??0)>this.time,this.viewModel.root.visible=o.alive&&!this.scoped,this.muzzleLight.intensity=this.viewModel.flash.visible?12:0,this.muzzleLight.position.copy(this.camera.position).add(new F(0,-.25,-.6).applyEuler(this.camera.rotation))}}else{const o=this.reducedMotion?0:performance.now()*55e-6;this.camera.position.set(36.5+Math.sin(o)*.8,7.5,25.4+Math.cos(o)*.6),this.camera.lookAt(23,3.2,-1)}this.renderer.autoClear=!0,this.renderer.render(this.scene,this.camera),this.started&&this.viewModel?.root.visible&&(this.renderer.autoClear=!1,this.renderer.clearDepth(),this.renderer.render(this.viewScene,this.viewCamera))}frame=e=>{if(this.disposed)return;const t=Math.min((e-this.lastFrame)/1e3,.25);if(this.lastFrame=e,this.started&&!this.paused){for(this.accumulator+=t;this.accumulator>=1/60;)this.fixedUpdate(1/60),this.accumulator-=1/60;this.updateEffects(t)}if(this.render(this.started&&!this.paused?this.accumulator*60:1,t),this.frameCount++,e-this.fpsTime>1e3&&(this.fps=Math.round(this.frameCount*1e3/(e-this.fpsTime)),this.frameCount=0,this.fpsTime=e,this.softwareRenderer&&e-this.lastResolutionChange>1500)){const i=this.renderer.getPixelRatio(),o=this.fps<26?Math.max(.65,i*.78):this.fps>53?Math.min(.85,i*1.08):i;Math.abs(o-i)>.005&&(this.renderer.setPixelRatio(o),this.lastResolutionChange=e)}e-this.lastPublish>85&&(this.publish(),this.lastPublish=e),this.frameId=requestAnimationFrame(this.frame)};resize=()=>{const e=this.host.clientWidth,t=this.host.clientHeight;!e||!t||(this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix(),this.viewCamera.aspect=e/t,this.viewCamera.updateProjectionMatrix())};publish(){const e=this.actors[this.viewId];if(!e)return;const t=Fn(e),i=e.ammo[t],o=this.bomb;let a="";e.alive&&this.controlId!==null&&(o.carrier===e.id?a=this.world.siteAt(e.x,e.z)?"长按 E 安放 C4 · 保持静止":"你携带 C4 · 前往 A 或 B 点":o.state==="planted"&&e.team==="CT"&&hn(e,o)<2.3?a="长按 E 拆除 C4 · 保持静止":o.state==="dropped"&&e.team==="T"&&hn(e,o)<5&&(a="靠近掉落的 C4 以拾取")),this.snapshot={phase:this.phase,paused:this.paused,started:this.started,time:this.time,round:this.round,timer:Math.max(0,this.phase==="freeze"?this.freezeEnd-this.time:this.phase==="over"?this.nextRound-this.time:o.state==="planted"?o.explodeAt-this.time:this.roundEnd-this.time),scoreT:this.scoreT,scoreCT:this.scoreCT,team:this.settings.team,aliveT:this.actors.filter(c=>c.alive&&c.team==="T").length,aliveCT:this.actors.filter(c=>c.alive&&c.team==="CT").length,player:{id:e.id,name:e.name,hp:e.hp,armor:e.armor,x:e.x,z:e.z,yaw:e.yaw,zone:this.world.zoneAt(e.x,e.z),weapon:t,primary:e.primary,secondary:e.secondary,slot:e.slot,mag:i?.mag??0,reserve:i?.reserve??0,reloading:!!e.reloading,reloadProgress:e.reloading?1-(e.reloadEnd-this.time)/Xn[e.reloading].reload:0,hasBomb:o.carrier===e.id,scoped:this.scoped,spread:e.bloom*520+(e.moving?5:0)},actors:this.actors.map(c=>{const h=c.team===this.settings.team?c:this.lastKnownPositions.get(c.id)??c;return{id:c.id,name:c.name,team:c.team,x:h.x,z:h.z,yaw:c.yaw,hp:c.hp,alive:c.alive,visible:c.team===this.settings.team||(this.spotted.get(c.id)??0)>this.time,kills:c.kills,deaths:c.deaths,weapon:Fn(c)}}),feed:[...this.scoreFeed.filter(c=>this.time-c.at<8)],bomb:{...o},spectating:this.controlId===null,winner:this.winner,reason:this.reason,action:e.actionProgress>0?{label:e.team==="T"?"正在安放 C4":"正在拆除 C4",progress:e.actionProgress}:null,hint:a,hitMarker:Math.max(0,this.hitUntil-this.time),headshot:this.hitHead,hurt:Math.max(0,this.hurtUntil-this.time),fps:this.fps,pistol:this.pistol};for(const c of this.listeners)c()}dispose(){this.disposed=!0,cancelAnimationFrame(this.frameId),this.resizeObserver.disconnect(),document.removeEventListener("keydown",this.keydown),document.removeEventListener("keyup",this.keyup),document.removeEventListener("mousemove",this.mousemove),document.removeEventListener("pointerlockchange",this.pointerlockchange),document.removeEventListener("pointerlockerror",this.pointerlockerror),window.removeEventListener("blur",this.blur),document.removeEventListener("mouseup",this.mouseup),this.renderer.domElement.removeEventListener("mousedown",this.mousedown),this.renderer.domElement.removeEventListener("contextmenu",this.contextmenu),this.renderer.domElement.removeEventListener("wheel",this.wheel),document.pointerLockElement===this.renderer.domElement&&document.exitPointerLock();const e=new Set,t=new Set,i=o=>{const a=o;a.geometry&&e.add(a.geometry),Array.isArray(a.material)?a.material.forEach(c=>t.add(c)):a.material&&t.add(a.material)};this.scene.traverse(i),this.viewScene.traverse(i),this.viewModels.forEach(o=>o.root.traverse(i)),this.actors.forEach(o=>o.visual.root.userData.weaponCache.forEach(a=>a.traverse(i))),this.softwareMaterials.forEach((o,a)=>{t.add(o),t.add(a)}),e.forEach(o=>o.dispose()),t.forEach(o=>o.dispose()),this.renderer.dispose(),this.renderer.domElement.remove(),this.audio.dispose(),this.listeners.clear()}}function va({small:s=!1}){return E.jsxs("svg",{width:s?25:33,height:s?25:33,viewBox:"0 0 40 40",fill:"none","aria-hidden":"true",children:[E.jsx("path",{d:"M5 6h13l10 14-10 14H5l10-14L5 6Z",fill:"currentColor"}),E.jsx("path",{d:"m24 6 10 14-10 14h7l9-14-9-14h-7Z",fill:"currentColor",opacity:".48"})]})}function $t({name:s,size:e=20,style:t}){const i={arrow:E.jsx(E.Fragment,{children:E.jsx("path",{d:"M4 12h15M13 5l7 7-7 7"})}),shield:E.jsxs(E.Fragment,{children:[E.jsx("path",{d:"m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z"}),E.jsx("path",{d:"M12 7v9"})]}),cross:E.jsx("path",{d:"M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z"}),target:E.jsxs(E.Fragment,{children:[E.jsx("circle",{cx:"12",cy:"12",r:"7"}),E.jsx("path",{d:"M12 1v7m0 8v7M1 12h7m8 0h7"})]}),volume:E.jsx(E.Fragment,{children:E.jsx("path",{d:"M3 9h4l5-4v14l-5-4H3V9ZM16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"})}),skull:E.jsxs(E.Fragment,{children:[E.jsx("path",{d:"M6 16C-2 4 22-4 21 11c0 3-2 5-4 6v4H8v-4l-2-1Z"}),E.jsx("path",{d:"M9 19v3m4-3v3m3-3v3"}),E.jsx("circle",{cx:"8",cy:"11",r:"1.4"}),E.jsx("circle",{cx:"16",cy:"11",r:"1.4"})]}),bomb:E.jsxs(E.Fragment,{children:[E.jsx("rect",{x:"5",y:"8",width:"14",height:"13",rx:"2"}),E.jsx("path",{d:"M9 8V4h7V1M9 12h6m-6 4h1m4 0h1"})]}),head:E.jsx(E.Fragment,{children:E.jsx("path",{d:"M8 21v-5C1 8 8 1 14 3c7 2 5 9 3 11v7M4 8h17M12 1v20"})}),check:E.jsx("path",{d:"m5 12 4 4L20 5"}),pause:E.jsx(E.Fragment,{children:E.jsx("path",{d:"M8 5v14M16 5v14"})}),sun:E.jsxs(E.Fragment,{children:[E.jsx("circle",{cx:"12",cy:"12",r:"4"}),E.jsx("path",{d:"M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"})]})};return E.jsx("svg",{width:e,height:e,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round",style:t,"aria-hidden":"true",children:i[s]})}function Ff({id:s,className:e=""}){const t=["glock","usp","deagle"].includes(s),i=s==="knife",o=s==="awp";return E.jsx("svg",{className:`weapon-icon ${e}`,viewBox:"0 0 150 42",fill:"currentColor","aria-hidden":"true",children:i?E.jsxs(E.Fragment,{children:[E.jsx("path",{d:"m12 23 5-7h39v-5h6v19h-6v-5H12v-2Zm53-7h71l-18 13H65V16Z"}),E.jsx("path",{d:"M22 18v5m8-5v5m8-5v5",stroke:"#18211f",strokeWidth:"2"})]}):t?E.jsxs(E.Fragment,{children:[E.jsx("path",{d:s==="usp"?"M28 9h65v3h30v8H91v4H63l-5 15H40l6-21H28V9Z":"M35 7h64v13H69l-8 19H42l6-23H35V7Z"}),E.jsx("path",{d:"M66 21h17v10H63v-4h12v-3h-9"})]}):E.jsxs(E.Fragment,{children:[E.jsx("path",{d:"m9 14 24 4 7-6h55v3h34v3h14v4h-44v5H70l-2 8H53l3-11-14-2-8 12H16l-7-3V14Z"}),E.jsx("path",{d:s==="ak47"?"m72 24 5 15h14l-8-15H72Z":"M73 24h14v14H73z"}),o&&E.jsxs(E.Fragment,{children:[E.jsx("path",{d:"M58 5h41v7H58zM65 11h5v6h-5zm22 0h5v6h-5z"}),E.jsx("path",{d:"M124 23v13h3V23z"})]})]})})}function Kg({game:s,snapshot:e,briefing:t=!1}){const i=qn.useRef(null);return qn.useEffect(()=>{const o=i.current;if(!o)return;const a=o.getContext("2d");if(!a)return;const c=440,h=22,f=(c-h*2)/90,d=37,m=v=>(v-Z0.x1)*f+h,g=v=>(v-Z0.z1)*f+d;a.clearRect(0,0,c,c),a.strokeStyle="rgba(183,201,185,.05)",a.lineWidth=1;for(let v=0;v<c;v+=22)a.beginPath(),a.moveTo(v,0),a.lineTo(v,c),a.moveTo(0,v),a.lineTo(c,v),a.stroke();a.fillStyle="#46504a";for(const v of Df)a.fillRect(m(v.x1),g(v.z1),(v.x2-v.x1)*f,(v.z2-v.z1)*f);a.strokeStyle="#95a28d",a.lineWidth=1.5;for(const v of s.world.boundary)a.strokeRect(m(v.x-v.w/2),g(v.z-v.d/2),v.w*f,v.d*f);for(const v of s.world.colliders)(v.kind==="crate"||v.kind==="door")&&(a.fillStyle=v.kind==="door"?"#a8926f":"#292f2b",a.fillRect(m(v.x-v.w/2),g(v.z-v.d/2),v.w*f,v.d*f));for(const[v,_]of Object.entries(qi))a.fillStyle="rgba(226,163,78,.12)",a.fillRect(m(_.x-5),g(_.z-5),10*f,10*f),a.strokeStyle="rgba(226,163,78,.38)",a.lineWidth=1,a.strokeRect(m(_.x-5),g(_.z-5),10*f,10*f),a.font="bold 24px Arial",a.textAlign="center",a.textBaseline="middle",a.fillStyle="#e6ac62",a.fillText(v,m(_.x),g(_.z));if(a.font="10px monospace",a.fillStyle="#a9b5a1",a.fillText("T",m(0),g(-39)),a.fillText("CT",m(2),g(29)),!t){for(const M of e.actors)if(!(M.id===e.player.id||!M.visible)){if(!M.alive){if(M.team!==e.team)continue;a.strokeStyle="#8c9384",a.lineWidth=2,a.beginPath(),a.moveTo(m(M.x)-3,g(M.z)-3),a.lineTo(m(M.x)+3,g(M.z)+3),a.moveTo(m(M.x)+3,g(M.z)-3),a.lineTo(m(M.x)-3,g(M.z)+3),a.stroke();continue}a.beginPath(),a.arc(m(M.x),g(M.z),M.team===e.team?5:6,0,Math.PI*2),a.fillStyle=M.team===e.team?"#88c6d8":"#ee755d",a.fill()}const v=e.bomb;(v.state==="carried"&&e.team==="T"||v.state==="planted"||v.state==="dropped"&&e.team==="T")&&(a.save(),a.translate(m(v.x),g(v.z)),a.rotate(Math.PI/4),a.strokeStyle="#ffcc6f",a.lineWidth=2.5,a.strokeRect(-5,-5,10,10),a.restore());const _=e.player;a.save(),a.translate(m(_.x),g(_.z)),a.rotate(-_.yaw),a.fillStyle="rgba(244,239,200,.08)",a.beginPath(),a.moveTo(0,0),a.arc(0,0,30,-2.12,-1.02),a.closePath(),a.fill(),a.fillStyle="#f7f0ce",a.strokeStyle="#1c2420",a.lineWidth=2,a.beginPath(),a.moveTo(0,-10),a.lineTo(6,6),a.lineTo(0,3),a.lineTo(-6,6),a.closePath(),a.fill(),a.stroke(),a.restore()}a.fillStyle="#9baba0",a.font="11px monospace",a.textAlign="right",a.fillText("N ↑",420,24)},[s,e,t]),E.jsx("canvas",{ref:i,width:"440",height:"440",className:`minimap ${t?"briefing-map":""}`,"aria-label":"Dust2 俯视小地图：T 出生点、CT 出生点、A 大、A 点、中门、猫道、B 洞、B 点"})}const zw=s=>`${Math.floor(Math.ceil(s)/60)}:${String(Math.ceil(s)%60).padStart(2,"0")}`;function kw(){try{return{...Uf,...JSON.parse(localStorage.getItem("dust-settings")||"{}")}}catch{return{...Uf}}}const tg=[["W A S D","移动"],["鼠标","观察 / 瞄准"],["鼠标左键","射击 / 挥刀"],["鼠标右键","AWP 开镜"],["SPACE","跳跃"],["SHIFT","缓慢移动"],["1 / 2 / 3","主武器 / 手枪 / 刀"],["滚轮 / Q","切换武器"],["R","换弹"],["长按 E","安放 / 拆除 C4"],["E · 阵亡后","接管存活队友"],["[ / ]","切换观战队友"],["TAB","查看记分板"],["ESC","暂停 / 释放鼠标"]];function Bw(){const s=qn.useRef(null),[e,t]=qn.useState(null),[i,o]=qn.useState("");return qn.useEffect(()=>{if(!s.current)return;let a;try{a=new Ow(s.current),t(a)}catch(c){o(c instanceof Error?c.message:String(c));return}return()=>{a.dispose(),delete window.__DUST__}},[]),E.jsxs("main",{className:"app",children:[E.jsx("div",{ref:s,className:"viewport"}),e?E.jsx(Vw,{game:e}):E.jsxs("div",{className:"loading-screen",children:[E.jsx(va,{}),E.jsx("span",{children:i?"无法初始化 3D 画面":"BUILDING THE BATTLEFIELD"}),i&&E.jsxs("p",{children:[i,E.jsx("br",{}),"请使用支持 WebGL 2 的桌面浏览器。"]})]})]})}function Vw({game:s}){const e=qn.useSyncExternalStore(s.subscribe,s.getSnapshot),[t,i]=qn.useState(kw),[o,a]=qn.useState(!1),[c,h]=qn.useState(!1);return qn.useEffect(()=>{try{localStorage.setItem("dust-settings",JSON.stringify(t))}catch{}},[t]),qn.useEffect(()=>{const f=g=>{g.code==="Tab"&&e.started&&(g.preventDefault(),h(!0))},d=g=>{(g.code==="Tab"||g.code==="Escape")&&h(!1)},m=()=>h(!1);return window.addEventListener("keydown",f),window.addEventListener("keyup",d),window.addEventListener("blur",m),()=>{window.removeEventListener("keydown",f),window.removeEventListener("keyup",d),window.removeEventListener("blur",m)}},[e.started]),e.started?E.jsxs(E.Fragment,{children:[E.jsx(Hw,{game:s,s:e}),c&&!e.paused&&E.jsx(Gw,{s:e}),e.paused&&E.jsx("div",{className:"pause-overlay",children:E.jsxs("div",{className:"pause-panel",children:[E.jsxs("div",{className:"pause-eyebrow",children:[E.jsx(va,{small:!0})," FIELD OPERATIONS ",E.jsx("span",{children:"PAUSED"})]}),E.jsxs("h2",{children:["稍作停留。",E.jsx("br",{}),E.jsx("em",{children:"战场等你归来。"})]}),E.jsx("p",{children:"模拟已暂停。继续后将重新锁定鼠标。"}),E.jsxs("button",{className:"deploy-button",onClick:()=>s.resume(),children:[E.jsxs("span",{children:["继续行动",E.jsx("small",{children:"BACK TO THE FIELD"})]}),E.jsx($t,{name:"arrow",size:24})]}),E.jsxs("div",{className:"pause-settings",children:[E.jsxs("label",{children:[E.jsx($t,{name:"target",size:17}),"鼠标灵敏度 ",E.jsx("input",{"aria-label":"鼠标灵敏度",type:"range",min:"0.3",max:"2",step:"0.1",value:t.sensitivity,onChange:f=>{const d={...t,sensitivity:Number(f.target.value)};i(d),s.updateSettings(d)}}),E.jsx("span",{children:t.sensitivity.toFixed(1)})]}),E.jsxs("label",{children:[E.jsx($t,{name:"volume",size:17}),"主音量 ",E.jsx("input",{"aria-label":"主音量",type:"range",min:"0",max:"1",step:"0.05",value:t.volume,onChange:f=>{const d={...t,volume:Number(f.target.value)};i(d),s.updateSettings(d)}}),E.jsxs("span",{children:[Math.round(t.volume*100),"%"]})]})]}),E.jsx("div",{className:"pause-controls",children:tg.slice(0,10).map(([f,d])=>E.jsxs("div",{children:[E.jsx("kbd",{children:f}),E.jsx("span",{children:d})]},f))}),E.jsxs("button",{className:"restart-button",onClick:()=>s.restartRound(),children:["重新开始本局 ",E.jsx("span",{children:"↻"})]}),E.jsx("button",{className:"briefing-return",onClick:()=>{s.returnToMenu(),h(!1)},children:"返回行动简报"})]})})]}):E.jsxs("div",{className:"briefing",children:[E.jsxs("header",{className:"main-nav",children:[E.jsxs("a",{className:"brand",href:"#",onClick:f=>{f.preventDefault(),a(!1)},children:[E.jsx(va,{}),E.jsxs("span",{children:["DUST",E.jsx("span",{className:"brand-two",children:"II"}),E.jsx("small",{children:"FIELD OPERATIONS"})]})]}),E.jsxs("nav",{children:[E.jsxs("button",{className:o?"":"active",onClick:()=>a(!1),children:["行动简报",E.jsx("span",{children:"BRIEFING"})]}),E.jsxs("button",{className:o?"active":"",onClick:()=>a(!0),children:["操作手册",E.jsx("span",{children:"FIELD MANUAL"})]})]}),E.jsxs("div",{className:"connection",children:[E.jsx("i",{})," LOCAL SESSION ",E.jsx("span",{children:"V.01"})]})]}),E.jsxs("div",{className:"briefing-main",children:[E.jsxs("section",{className:`hero ${o?"manual-hero":""}`,children:[E.jsxs("div",{className:"eyebrow",children:[E.jsx("span",{className:"tiny-line"})," 5V5 TACTICAL EXPERIENCE"]}),o?E.jsxs(E.Fragment,{children:[E.jsxs("h1",{className:"manual-title",children:["掌握每一个",E.jsx("br",{}),E.jsx("em",{children:"战术细节。"})]}),E.jsx("div",{className:"manual-controls",children:tg.map(([f,d])=>E.jsxs("div",{children:[E.jsx("kbd",{children:f}),E.jsx("span",{children:d})]},f))}),E.jsx("p",{className:"manual-note",children:"爆头造成胸部伤害的 2 倍；护甲可吸收部分伤害。持包者阵亡后，其他 T 可靠近拾取 C4。安放需 3.2 秒，全装拆包需 5 秒，手枪局需 10 秒。"})]}):E.jsxs(E.Fragment,{children:[E.jsxs("div",{className:"hero-map-label",children:["DE_DUST2 ",E.jsx("span",{children:"32° 25′ N   03° 42′ E"})]}),E.jsxs("h1",{children:["DUST",E.jsx("span",{children:"II"}),E.jsx("span",{className:"title-outline",children:"FIELD OPS."})]}),E.jsx("p",{className:"hero-line",children:"每一个转角，都是新的战场。"}),E.jsxs("p",{className:"hero-description",children:["重返烈日下的经典战场。穿过中门，控制猫道，",E.jsx("br",{className:"desktop-br"}),"与小队一起夺取下一个决定胜负的角落。"]}),E.jsxs("div",{className:"hero-metrics",children:[E.jsxs("div",{children:[E.jsxs("strong",{children:["5 ",E.jsx("span",{children:"vs"})," 5"]}),E.jsx("small",{children:"战术小队"})]}),E.jsxs("div",{children:[E.jsx("strong",{children:"02"}),E.jsx("small",{children:"爆破目标"})]}),E.jsxs("div",{children:[E.jsxs("strong",{children:["115",E.jsx("span",{children:"s"})]}),E.jsx("small",{children:"每回合时限"})]})]}),E.jsxs("div",{className:"field-tag",children:[E.jsx($t,{name:"sun",size:16}),E.jsx("span",{children:"DUST II, NORTH AFRICA"}),E.jsx("i",{})," CLEAR · 34°C"]})]})]}),E.jsxs("aside",{className:"deployment-panel",children:[E.jsxs("div",{className:"panel-top",children:[E.jsxs("span",{children:[E.jsx("i",{})," OPERATION / 01"]}),E.jsx($t,{name:"target",size:18})]}),E.jsxs("div",{className:"map-heading",children:[E.jsx("h2",{children:"行动区域"}),E.jsx("span",{children:"DUST II"})]}),E.jsxs("div",{className:"briefing-map-wrap",children:[E.jsx(Kg,{game:s,snapshot:e,briefing:!0}),E.jsx("span",{className:"map-scale",children:"0 ━━ 20 m"}),E.jsx("span",{className:"map-caption",children:"BOMB DEFUSAL / ACTIVE DUTY"})]}),E.jsxs("div",{className:"setup-section",children:[E.jsxs("div",{className:"section-label",children:[E.jsx("span",{children:"01"})," 选择阵营 ",E.jsx("small",{children:"YOUR SIDE"})]}),E.jsxs("div",{className:"team-options",children:[E.jsxs("button",{"aria-pressed":t.team==="CT",className:t.team==="CT"?"selected ct-choice":"",onClick:()=>i(f=>({...f,team:"CT",primary:"m4a4"})),children:[E.jsx($t,{name:"shield"}),E.jsxs("span",{children:["反恐精英",E.jsx("small",{children:"COUNTER-TERRORISTS"})]}),t.team==="CT"&&E.jsx("span",{className:"selection-dot"})]}),E.jsxs("button",{"aria-pressed":t.team==="T",className:t.team==="T"?"selected t-choice":"",onClick:()=>i(f=>({...f,team:"T",primary:"ak47"})),children:[E.jsx($t,{name:"target"}),E.jsxs("span",{children:["恐怖分子",E.jsx("small",{children:"TERRORISTS"})]}),t.team==="T"&&E.jsx("span",{className:"selection-dot"})]})]})]}),E.jsxs("div",{className:"setup-section",children:[E.jsxs("div",{className:"section-label",children:[E.jsx("span",{children:"02"})," 开局模式 ",E.jsx("small",{children:"ROUND TYPE"})]}),E.jsxs("div",{className:"mode-options",children:[E.jsxs("button",{"aria-pressed":!t.pistolOpening,className:t.pistolOpening?"":"selected",onClick:()=>i(f=>({...f,pistolOpening:!1})),children:["全装对抗 ",E.jsx("small",{children:"FULL LOADOUT"})]}),E.jsxs("button",{"aria-pressed":t.pistolOpening,className:t.pistolOpening?"selected":"",onClick:()=>i(f=>({...f,pistolOpening:!0})),children:["手枪开局 ",E.jsx("small",{children:"PISTOL ROUND"})]})]})]}),E.jsxs("div",{className:"loadout-row",children:[E.jsxs("div",{children:[E.jsx("label",{htmlFor:"primary",children:"主武器"}),E.jsxs("select",{id:"primary",value:t.primary,disabled:t.pistolOpening,onChange:f=>i(d=>({...d,primary:f.target.value})),children:[E.jsx("option",{value:"m4a4",children:"M4A4"}),E.jsx("option",{value:"ak47",children:"AK-47"}),E.jsx("option",{value:"awp",children:"AWP"})]})]}),E.jsxs("div",{children:[E.jsx("label",{htmlFor:"sidearm",children:"副武器"}),E.jsxs("select",{id:"sidearm",value:t.sidearm,disabled:t.pistolOpening,onChange:f=>i(d=>({...d,sidearm:f.target.value})),children:[E.jsx("option",{value:"default",children:t.team==="CT"?"USP-S":"GLOCK-18"}),E.jsx("option",{value:"deagle",children:"DESERT EAGLE"})]})]})]}),E.jsx("p",{className:"loadout-note",children:t.pistolOpening?"首回合全员仅默认手枪、无护甲；次回合恢复全装。":"100 生命 · 100 护甲 · 主副武器 · 战术刀"}),E.jsxs("button",{className:"deploy-button",onClick:()=>s.start(t),children:[E.jsxs("span",{children:["进入战场",E.jsx("small",{children:"DEPLOY TO DUST II"})]}),E.jsx($t,{name:"arrow",size:25})]}),E.jsxs("div",{className:"deployment-foot",children:[E.jsx("i",{})," 1 名玩家 + 9 名 AI ",E.jsx("span",{children:"点击后锁定鼠标"})]})]})]}),E.jsxs("footer",{className:"briefing-footer",children:[E.jsxs("span",{children:[E.jsx("i",{})," ALL OPERATORS READY"]}),E.jsx("span",{children:"控制路线。相信队友。完成目标。"}),E.jsxs("span",{children:["DESKTOP EXPERIENCE ",E.jsx("kbd",{children:"WASD"})," ",E.jsx($t,{name:"target",size:14})]})]})]})}function Hw({game:s,s:e}){const t=e.player,i=Xn[t.weapon];return E.jsxs("div",{className:"hud",children:[E.jsx("div",{className:"damage-vignette",style:{opacity:e.hurt*1.7}}),E.jsxs("section",{className:"radar-panel",children:[E.jsxs("div",{className:"radar-title",children:[E.jsx("span",{className:"radar-dot"}),t.zone,E.jsx("span",{className:"radar-level",children:"DUST II"})]}),E.jsx(Kg,{game:s,snapshot:e}),E.jsxs("div",{className:"radar-bottom",children:[E.jsx("span",{className:e.team==="CT"?"ct-text":"t-text",children:e.team==="CT"?"反恐精英":"恐怖分子"}),E.jsx("span",{children:"▲ 你   ● 队友"})]})]}),E.jsxs("section",{className:"match-header",children:[E.jsxs("div",{className:"match-meta",children:["DUST II ",E.jsx("span",{children:"/"})," ROUND ",String(e.round).padStart(2,"0")," ",E.jsx("span",{children:"/"})," ",e.pistol?"PISTOL ROUND":"BOMB DEFUSAL"]}),E.jsxs("div",{className:"match-status",children:[E.jsx(ng,{team:"CT",actors:e.actors}),E.jsx("div",{className:"team-score ct-text",children:String(e.scoreCT).padStart(2,"0")}),E.jsxs("div",{className:`round-clock ${e.bomb.state==="planted"?"bomb-clock":""}`,children:[E.jsx("span",{children:e.bomb.state==="planted"?E.jsxs(E.Fragment,{children:[E.jsx($t,{name:"bomb",size:12})," C4 ACTIVE"]}):e.phase==="freeze"?"PREPARE":e.phase==="over"?"NEXT ROUND":"ROUND TIME"}),E.jsx("strong",{children:zw(e.timer)})]}),E.jsx("div",{className:"team-score t-text",children:String(e.scoreT).padStart(2,"0")}),E.jsx(ng,{team:"T",actors:e.actors})]})]}),E.jsxs("div",{className:"hud-top-right",children:[E.jsxs("span",{className:"live-indicator",children:[E.jsx("i",{})," LIVE EXERCISE"]}),E.jsxs("span",{children:[e.fps," FPS"]})]}),E.jsx("section",{className:"killfeed","aria-label":"实时击杀播报",children:e.feed.map(o=>E.jsxs("div",{className:o.player?"feed-row involved":"feed-row",children:[E.jsx("b",{className:o.team==="CT"?"ct-text":"t-text",children:o.killer}),o.weapon==="c4"?E.jsx($t,{name:"bomb",size:18}):E.jsx(Ff,{id:o.weapon})," ",o.headshot&&E.jsx($t,{name:"head",size:15}),E.jsx("span",{className:o.team==="CT"?"t-text":"ct-text",children:o.victim})]},o.id))}),t.scoped?E.jsx("div",{className:"scope",children:E.jsxs("div",{className:"scope-ring",children:[E.jsx("div",{className:"scope-h"}),E.jsx("div",{className:"scope-v"}),E.jsx("div",{className:"scope-dot"}),E.jsx("span",{children:"10 × 42"}),E.jsx("small",{children:"RANGE   100 m"})]})}):E.jsxs("div",{className:`crosshair ${t.weapon==="awp"?"sniper-crosshair":""}`,style:{"--spread":`${6+t.spread}px`},children:[E.jsx("i",{className:"cross-top"}),E.jsx("i",{className:"cross-bottom"}),E.jsx("i",{className:"cross-left"}),E.jsx("i",{className:"cross-right"}),E.jsx("b",{})]}),e.hitMarker>0&&E.jsxs("div",{className:`hit-marker ${e.headshot?"headshot":""}`,children:[E.jsx("svg",{width:"34",height:"34",viewBox:"0 0 34 34",children:E.jsx("path",{d:"m5 5 7 7m10 10 7 7M5 29l7-7M22 12l7-7",stroke:"currentColor",strokeWidth:"2.5"})}),e.headshot&&E.jsx("span",{children:"HEADSHOT"})]}),e.phase==="freeze"&&E.jsxs("div",{className:"freeze-banner",children:[E.jsxs("span",{children:["ROUND ",String(e.round).padStart(2,"0")]}),E.jsx("h2",{children:e.pistol?"手枪局":e.team==="CT"?"守住阵地。":"夺取目标。"}),E.jsx("p",{children:e.pistol?"全员默认手枪 · 无主武器 · 无护甲":e.team==="CT"?"阻止安放 C4，或在爆炸前完成拆除。":"掩护持包队友，在 A 或 B 点安放 C4。"}),E.jsx("b",{children:Math.ceil(e.timer)})]}),e.phase==="over"&&E.jsxs("div",{className:`round-result ${e.winner==="CT"?"ct-result":""}`,children:[E.jsx($t,{name:e.winner==="CT"?"shield":"target",size:28}),E.jsxs("span",{children:["ROUND ",String(e.round).padStart(2,"0")," COMPLETE"]}),E.jsx("h2",{children:e.winner==="CT"?"反恐精英获胜":"恐怖分子获胜"}),E.jsx("p",{children:e.reason}),E.jsxs("small",{children:["下一回合 ",Math.ceil(e.timer),"s"]})]}),e.action&&E.jsxs("div",{className:"action-progress",children:[E.jsx($t,{name:"bomb",size:22}),E.jsxs("span",{children:[e.action.label,E.jsx("small",{children:"保持按住 E"})]}),E.jsxs("strong",{children:[Math.round(e.action.progress*100),"%"]}),E.jsx("div",{children:E.jsx("i",{style:{width:`${e.action.progress*100}%`}})})]}),e.spectating&&e.phase==="live"&&E.jsxs("div",{className:"spectator",children:[E.jsx("span",{children:"OPERATOR DOWN"}),E.jsxs("h3",{children:["正在观战 ",E.jsx("b",{children:t.name})]}),E.jsxs("p",{children:[E.jsx("kbd",{children:"["}),E.jsx("kbd",{children:"]"})," 切换队友 ",E.jsx("i",{})," ",E.jsx("kbd",{children:"E"})," 接管存活队友"]})]}),e.hint&&!e.action&&!e.spectating&&E.jsxs("div",{className:"interaction-hint",children:[E.jsx($t,{name:"bomb",size:16}),e.hint]}),E.jsxs("section",{className:"vitals",children:[E.jsxs("div",{className:`health ${t.hp<30?"low-health":""}`,children:[E.jsx("div",{className:"vital-icon",children:E.jsx($t,{name:"cross",size:24})}),E.jsx("strong",{children:String(t.hp).padStart(3,"0")}),E.jsxs("span",{children:["HEALTH",E.jsx("small",{children:E.jsx("i",{style:{width:`${t.hp}%`}})})]})]}),E.jsxs("div",{className:"armor",children:[E.jsx($t,{name:"shield",size:20}),E.jsx("strong",{children:t.armor}),E.jsxs("span",{children:["ARMOR",!e.pistol&&e.team==="CT"&&E.jsx("small",{children:"+ DEFUSE KIT"})]})]})]}),E.jsxs("section",{className:"equipment",children:[[{slot:"primary",id:t.primary,key:"1"},{slot:"secondary",id:t.secondary,key:"2"},{slot:"melee",id:"knife",key:"3"}].map(o=>E.jsxs("div",{className:`equipment-slot ${t.slot===o.slot?"equipped":""} ${o.id?"":"empty-slot"}`,children:[E.jsx("kbd",{children:o.key}),o.id?E.jsx(Ff,{id:o.id}):E.jsx("span",{children:"NO PRIMARY"}),E.jsx("small",{children:o.id?Xn[o.id].name:"—"})]},o.slot)),t.hasBomb&&E.jsxs("div",{className:"c4-slot",children:[E.jsx($t,{name:"bomb",size:25}),E.jsx("span",{children:"C4"})]})]}),E.jsxs("section",{className:"ammo-panel",children:[E.jsxs("div",{className:"weapon-title",children:[E.jsx("span",{children:i.label}),E.jsx("b",{children:i.name})]}),E.jsx("div",{className:"ammo-count",children:t.weapon==="knife"?E.jsx("strong",{className:"knife-label",children:"MELEE"}):E.jsxs(E.Fragment,{children:[E.jsx("strong",{className:t.mag===0?"empty-mag":"",children:String(t.mag).padStart(2,"0")}),E.jsx("i",{children:"/"}),E.jsx("span",{children:String(t.reserve).padStart(3,"0")})]})}),E.jsxs("div",{className:"ammo-meta",children:[E.jsx("span",{children:t.reloading?"RELOADING":i.category==="knife"?"CLOSE QUARTERS":i.automatic?"FULL AUTO":"SEMI AUTO"}),E.jsx("span",{children:t.reloading?`${Math.round(t.reloadProgress*100)}%`:E.jsxs(E.Fragment,{children:[E.jsx("kbd",{children:"R"})," 换弹"]})})]}),E.jsx("div",{className:"ammo-line",children:E.jsx("i",{style:{width:`${t.reloading?t.reloadProgress*100:t.weapon==="knife"?100:t.mag/i.magazine*100}%`}})})]}),E.jsxs("div",{className:"hud-bottom",children:[E.jsxs("span",{children:[E.jsx("i",{})," LOCAL SERVER ",E.jsx("b",{children:"0 ms"})]}),E.jsxs("span",{children:[E.jsx("kbd",{children:"WASD"})," 移动 ",E.jsx("kbd",{children:"SPACE"})," 跳跃 ",E.jsx("kbd",{children:"TAB"})," 战绩 ",E.jsx("kbd",{children:"ESC"})," 暂停"]}),E.jsxs("span",{children:["FIELD OPERATIONS ",E.jsx(va,{small:!0})]})]})]})}function ng({team:s,actors:e}){const t=e.filter(i=>i.team===s&&i.alive).length;return E.jsxs("div",{className:`team-status team-${s.toLowerCase()}`,children:[E.jsxs("span",{children:[s==="CT"?"CT":"T"," ",E.jsxs("b",{children:[t," ALIVE"]})]}),E.jsx("div",{children:e.filter(i=>i.team===s).map(i=>E.jsx("i",{className:i.alive?"operator-alive":"operator-dead",children:i.alive?E.jsxs("svg",{viewBox:"0 0 12 16",children:[E.jsx("circle",{cx:"6",cy:"4",r:"3"}),E.jsx("path",{d:"M1 9h10v7H1z"})]}):"×"},i.id))})]})}function Gw({s}){return E.jsx("div",{className:"scoreboard-overlay",children:E.jsxs("div",{className:"scoreboard",children:[E.jsxs("div",{className:"scoreboard-heading",children:[E.jsx(va,{small:!0}),E.jsxs("h2",{children:["DUST II ",E.jsx("span",{children:"FIELD OPERATIONS"})]}),E.jsxs("span",{children:["ROUND ",s.round]})]}),["CT","T"].map(e=>E.jsxs("section",{children:[E.jsxs("header",{className:e==="CT"?"ct-text":"t-text",children:[E.jsx($t,{name:e==="CT"?"shield":"target",size:18}),E.jsx("strong",{children:e==="CT"?"反恐精英":"恐怖分子"}),E.jsx("b",{children:e==="CT"?s.scoreCT:s.scoreT})]}),E.jsxs("div",{className:"scoreboard-cols",children:[E.jsx("span",{children:"OPERATOR"}),E.jsx("span",{children:"LOADOUT"}),E.jsx("span",{children:"HP"}),E.jsx("span",{children:"K"}),E.jsx("span",{children:"D"})]}),s.actors.filter(t=>t.team===e).sort((t,i)=>i.kills-t.kills).map(t=>E.jsxs("div",{className:`scoreboard-row ${t.alive?"":"dead-row"} ${t.id===s.player.id?"current-row":""}`,children:[E.jsxs("span",{children:[E.jsx("i",{}),t.name,t.id===s.player.id&&E.jsx("small",{children:"VIEW"})]}),E.jsx(Ff,{id:t.weapon}),E.jsx("span",{children:t.alive?t.hp:E.jsx($t,{name:"skull",size:15})}),E.jsx("b",{children:t.kills}),E.jsx("span",{children:t.deaths})]},t.id))]},e)),E.jsx("footer",{children:"按住 TAB 查看战绩 · 阵亡后按 E 接管队友"})]})})}kx.createRoot(document.getElementById("root")).render(E.jsx(Nx.StrictMode,{children:E.jsx(Bw,{})}));

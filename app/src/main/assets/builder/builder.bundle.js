"use strict";(()=>{var Mn=Object.create;var Nt=Object.defineProperty;var Rn=Object.getOwnPropertyDescriptor;var In=Object.getOwnPropertyNames;var Fn=Object.getPrototypeOf,zn=Object.prototype.hasOwnProperty;var Nn=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);var Bn=(n,e,i,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let c of In(e))!zn.call(n,c)&&c!==i&&Nt(n,c,{get:()=>e[c],enumerable:!(o=Rn(e,c))||o.enumerable});return n};var Vn=(n,e,i)=>(i=n!=null?Mn(Fn(n)):{},Bn(e||!n||!n.__esModule?Nt(i,"default",{value:n,enumerable:!0}):i,n));var rn=Nn((Zr,Pt)=>{(n=>{"use strict";var e=Object.defineProperty,i=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,c=Object.prototype.hasOwnProperty,d=(t,s)=>{for(var a in s)e(t,a,{get:s[a],enumerable:!0})},f=(t,s,a,p)=>{if(s&&typeof s=="object"||typeof s=="function")for(let k of o(s))!c.call(t,k)&&k!==a&&e(t,k,{get:()=>s[k],enumerable:!(p=i(s,k))||p.enumerable});return t},B=t=>f(e({},"__esModule",{value:!0}),t),N=(t,s,a)=>new Promise((p,k)=>{var _=y=>{try{D(a.next(y))}catch(q){k(q)}},x=y=>{try{D(a.throw(y))}catch(q){k(q)}},D=y=>y.done?p(y.value):Promise.resolve(y.value).then(_,x);D((a=a.apply(t,s)).next())}),H={};d(H,{analyzeMetafile:()=>Sn,analyzeMetafileSync:()=>jn,build:()=>wn,buildSync:()=>En,context:()=>bn,default:()=>Cn,formatMessages:()=>kn,formatMessagesSync:()=>_n,initialize:()=>$n,stop:()=>Pn,transform:()=>xn,transformSync:()=>Tn,version:()=>yn}),n.exports=B(H);function oe(t){let s=p=>{if(p===null)a.write8(0);else if(typeof p=="boolean")a.write8(1),a.write8(+p);else if(typeof p=="number")a.write8(2),a.write32(p|0);else if(typeof p=="string")a.write8(3),a.write(te(p));else if(p instanceof Uint8Array)a.write8(4),a.write(p);else if(p instanceof Array){a.write8(5),a.write32(p.length);for(let k of p)s(k)}else{let k=Object.keys(p);a.write8(6),a.write32(k.length);for(let _ of k)a.write(te(_)),s(p[_])}},a=new G;return a.write32(0),a.write32(t.id<<1|+!t.isRequest),s(t.value),se(a.buf,a.len-4,0),a.buf.subarray(0,a.len)}function S(t){let s=()=>{switch(a.read8()){case 0:return null;case 1:return!!a.read8();case 2:return a.read32();case 3:return he(a.read());case 4:return a.read();case 5:{let x=a.read32(),D=[];for(let y=0;y<x;y++)D.push(s());return D}case 6:{let x=a.read32(),D={};for(let y=0;y<x;y++)D[he(a.read())]=s();return D}default:throw new Error("Invalid packet")}},a=new G(t),p=a.read32(),k=(p&1)===0;p>>>=1;let _=s();if(a.ptr!==t.length)throw new Error("Invalid packet");return{id:p,isRequest:k,value:_}}var G=class{constructor(t=new Uint8Array(1024)){this.buf=t,this.len=0,this.ptr=0}_write(t){if(this.len+t>this.buf.length){let s=new Uint8Array((this.len+t)*2);s.set(this.buf),this.buf=s}return this.len+=t,this.len-t}write8(t){let s=this._write(1);this.buf[s]=t}write32(t){let s=this._write(4);se(this.buf,t,s)}write(t){let s=this._write(4+t.length);se(this.buf,t.length,s),this.buf.set(t,s+4)}_read(t){if(this.ptr+t>this.buf.length)throw new Error("Invalid packet");return this.ptr+=t,this.ptr-t}read8(){return this.buf[this._read(1)]}read32(){return ge(this.buf,this._read(4))}read(){let t=this.read32(),s=new Uint8Array(t),a=this._read(s.length);return s.set(this.buf.subarray(a,a+t)),s}},te,he,we;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let t=new TextEncoder,s=new TextDecoder;te=a=>t.encode(a),he=a=>s.decode(a),we='new TextEncoder().encode("")'}else if(typeof Buffer<"u")te=t=>Buffer.from(t),he=t=>{let{buffer:s,byteOffset:a,byteLength:p}=t;return Buffer.from(s,a,p).toString()},we='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(te("")instanceof Uint8Array))throw new Error(`Invariant violation: "${we} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function ge(t,s){return t[s++]|t[s++]<<8|t[s++]<<16|t[s++]<<24}function se(t,s,a){t[a++]=s,t[a++]=s>>8,t[a++]=s>>16,t[a++]=s>>24}var T=JSON.stringify,ne="warning",me="silent";function ve(t){if(de(t,"target"),t.indexOf(",")>=0)throw new Error(`Invalid target: ${t}`);return t}var be=()=>null,L=t=>typeof t=="boolean"?null:"a boolean",C=t=>typeof t=="string"?null:"a string",xe=t=>t instanceof RegExp?null:"a RegExp object",ke=t=>typeof t=="number"&&t===(t|0)?null:"an integer",ye=t=>typeof t=="number"&&t===(t|0)&&t>=0&&t<=65535?null:"a valid port number",Ze=t=>typeof t=="function"?null:"a function",ae=t=>Array.isArray(t)?null:"an array",Ee=t=>typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"an object",at=t=>typeof t=="object"&&t!==null?null:"an array or an object",Ie=t=>t instanceof WebAssembly.Module?null:"a WebAssembly.Module",Ne=t=>typeof t=="object"&&!Array.isArray(t)?null:"an object or null",He=t=>typeof t=="string"||typeof t=="boolean"?null:"a string or a boolean",Oe=t=>typeof t=="string"||typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"a string or an object",kt=t=>typeof t=="string"||Array.isArray(t)?null:"a string or an array",lt=t=>typeof t=="string"||t instanceof Uint8Array?null:"a string or a Uint8Array",Ye=t=>typeof t=="string"||t instanceof URL?null:"a string or a URL";function l(t,s,a,p){let k=t[a];if(s[a+""]=!0,k===void 0)return;let _=p(k);if(_!==null)throw new Error(`${T(a)} must be ${_}`);return k}function ce(t,s,a){for(let p in t)if(!(p in s))throw new Error(`Invalid option ${a}: ${T(p)}`)}function Be(t){let s=Object.create(null),a=l(t,s,"wasmURL",Ye),p=l(t,s,"wasmModule",Ie),k=l(t,s,"worker",L);return ce(t,s,"in initialize() call"),{wasmURL:a,wasmModule:p,worker:k}}function Le(t){let s;if(t!==void 0){s=Object.create(null);for(let a in t){let p=t[a];if(typeof p=="string"||p===!1)s[a]=p;else throw new Error(`Expected ${T(a)} in mangle cache to map to either a string or false`)}}return s}function Fe(t,s,a,p,k){let _=l(s,a,"color",L),x=l(s,a,"logLevel",C),D=l(s,a,"logLimit",ke);_!==void 0?t.push(`--color=${_}`):p&&t.push("--color=true"),t.push(`--log-level=${x||k}`),t.push(`--log-limit=${D||0}`)}function de(t,s,a){if(typeof t!="string")throw new Error(`Expected value for ${s}${a!==void 0?" "+T(a):""} to be a string, got ${typeof t} instead`);return t}function Xe(t,s,a){let p=l(s,a,"legalComments",C),k=l(s,a,"sourceRoot",C),_=l(s,a,"sourcesContent",L),x=l(s,a,"target",kt),D=l(s,a,"format",C),y=l(s,a,"globalName",C),q=l(s,a,"mangleProps",xe),Z=l(s,a,"reserveProps",xe),z=l(s,a,"mangleQuoted",L),ee=l(s,a,"minify",L),J=l(s,a,"minifySyntax",L),X=l(s,a,"minifyWhitespace",L),K=l(s,a,"minifyIdentifiers",L),I=l(s,a,"lineLimit",ke),fe=l(s,a,"drop",ae),R=l(s,a,"dropLabels",ae),M=l(s,a,"charset",C),E=l(s,a,"treeShaking",L),w=l(s,a,"ignoreAnnotations",L),u=l(s,a,"jsx",C),m=l(s,a,"jsxFactory",C),v=l(s,a,"jsxFragment",C),j=l(s,a,"jsxImportSource",C),O=l(s,a,"jsxDev",L),g=l(s,a,"jsxSideEffects",L),b=l(s,a,"define",Ee),A=l(s,a,"logOverride",Ee),r=l(s,a,"supported",Ee),h=l(s,a,"pure",ae),$=l(s,a,"keepNames",L),P=l(s,a,"platform",C),F=l(s,a,"tsconfigRaw",Oe);if(p&&t.push(`--legal-comments=${p}`),k!==void 0&&t.push(`--source-root=${k}`),_!==void 0&&t.push(`--sources-content=${_}`),x&&(Array.isArray(x)?t.push(`--target=${Array.from(x).map(ve).join(",")}`):t.push(`--target=${ve(x)}`)),D&&t.push(`--format=${D}`),y&&t.push(`--global-name=${y}`),P&&t.push(`--platform=${P}`),F&&t.push(`--tsconfig-raw=${typeof F=="string"?F:JSON.stringify(F)}`),ee&&t.push("--minify"),J&&t.push("--minify-syntax"),X&&t.push("--minify-whitespace"),K&&t.push("--minify-identifiers"),I&&t.push(`--line-limit=${I}`),M&&t.push(`--charset=${M}`),E!==void 0&&t.push(`--tree-shaking=${E}`),w&&t.push("--ignore-annotations"),fe)for(let W of fe)t.push(`--drop:${de(W,"drop")}`);if(R&&t.push(`--drop-labels=${Array.from(R).map(W=>de(W,"dropLabels")).join(",")}`),q&&t.push(`--mangle-props=${q.source}`),Z&&t.push(`--reserve-props=${Z.source}`),z!==void 0&&t.push(`--mangle-quoted=${z}`),u&&t.push(`--jsx=${u}`),m&&t.push(`--jsx-factory=${m}`),v&&t.push(`--jsx-fragment=${v}`),j&&t.push(`--jsx-import-source=${j}`),O&&t.push("--jsx-dev"),g&&t.push("--jsx-side-effects"),b)for(let W in b){if(W.indexOf("=")>=0)throw new Error(`Invalid define: ${W}`);t.push(`--define:${W}=${de(b[W],"define",W)}`)}if(A)for(let W in A){if(W.indexOf("=")>=0)throw new Error(`Invalid log override: ${W}`);t.push(`--log-override:${W}=${de(A[W],"log override",W)}`)}if(r)for(let W in r){if(W.indexOf("=")>=0)throw new Error(`Invalid supported: ${W}`);let V=r[W];if(typeof V!="boolean")throw new Error(`Expected value for supported ${T(W)} to be a boolean, got ${typeof V} instead`);t.push(`--supported:${W}=${V}`)}if(h)for(let W of h)t.push(`--pure:${de(W,"pure")}`);$&&t.push("--keep-names")}function St(t,s,a,p,k){var _;let x=[],D=[],y=Object.create(null),q=null,Z=null;Fe(x,s,y,a,p),Xe(x,s,y);let z=l(s,y,"sourcemap",He),ee=l(s,y,"bundle",L),J=l(s,y,"splitting",L),X=l(s,y,"preserveSymlinks",L),K=l(s,y,"metafile",L),I=l(s,y,"outfile",C),fe=l(s,y,"outdir",C),R=l(s,y,"outbase",C),M=l(s,y,"tsconfig",C),E=l(s,y,"resolveExtensions",ae),w=l(s,y,"nodePaths",ae),u=l(s,y,"mainFields",ae),m=l(s,y,"conditions",ae),v=l(s,y,"external",ae),j=l(s,y,"packages",C),O=l(s,y,"alias",Ee),g=l(s,y,"loader",Ee),b=l(s,y,"outExtension",Ee),A=l(s,y,"publicPath",C),r=l(s,y,"entryNames",C),h=l(s,y,"chunkNames",C),$=l(s,y,"assetNames",C),P=l(s,y,"inject",ae),F=l(s,y,"banner",Ee),W=l(s,y,"footer",Ee),V=l(s,y,"entryPoints",at),re=l(s,y,"absWorkingDir",C),Y=l(s,y,"stdin",Ee),Q=(_=l(s,y,"write",L))!=null?_:k,Pe=l(s,y,"allowOverwrite",L),pe=l(s,y,"mangleCache",Ee);if(y.plugins=!0,ce(s,y,`in ${t}() call`),z&&x.push(`--sourcemap${z===!0?"":`=${z}`}`),ee&&x.push("--bundle"),Pe&&x.push("--allow-overwrite"),J&&x.push("--splitting"),X&&x.push("--preserve-symlinks"),K&&x.push("--metafile"),I&&x.push(`--outfile=${I}`),fe&&x.push(`--outdir=${fe}`),R&&x.push(`--outbase=${R}`),M&&x.push(`--tsconfig=${M}`),j&&x.push(`--packages=${j}`),E){let U=[];for(let le of E){if(de(le,"resolve extension"),le.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${le}`);U.push(le)}x.push(`--resolve-extensions=${U.join(",")}`)}if(A&&x.push(`--public-path=${A}`),r&&x.push(`--entry-names=${r}`),h&&x.push(`--chunk-names=${h}`),$&&x.push(`--asset-names=${$}`),u){let U=[];for(let le of u){if(de(le,"main field"),le.indexOf(",")>=0)throw new Error(`Invalid main field: ${le}`);U.push(le)}x.push(`--main-fields=${U.join(",")}`)}if(m){let U=[];for(let le of m){if(de(le,"condition"),le.indexOf(",")>=0)throw new Error(`Invalid condition: ${le}`);U.push(le)}x.push(`--conditions=${U.join(",")}`)}if(v)for(let U of v)x.push(`--external:${de(U,"external")}`);if(O)for(let U in O){if(U.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${U}`);x.push(`--alias:${U}=${de(O[U],"alias",U)}`)}if(F)for(let U in F){if(U.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${U}`);x.push(`--banner:${U}=${de(F[U],"banner",U)}`)}if(W)for(let U in W){if(U.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${U}`);x.push(`--footer:${U}=${de(W[U],"footer",U)}`)}if(P)for(let U of P)x.push(`--inject:${de(U,"inject")}`);if(g)for(let U in g){if(U.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${U}`);x.push(`--loader:${U}=${de(g[U],"loader",U)}`)}if(b)for(let U in b){if(U.indexOf("=")>=0)throw new Error(`Invalid out extension: ${U}`);x.push(`--out-extension:${U}=${de(b[U],"out extension",U)}`)}if(V)if(Array.isArray(V))for(let U=0,le=V.length;U<le;U++){let $e=V[U];if(typeof $e=="object"&&$e!==null){let Ue=Object.create(null),Te=l($e,Ue,"in",C),et=l($e,Ue,"out",C);if(ce($e,Ue,"in entry point at index "+U),Te===void 0)throw new Error('Missing property "in" for entry point at index '+U);if(et===void 0)throw new Error('Missing property "out" for entry point at index '+U);D.push([et,Te])}else D.push(["",de($e,"entry point at index "+U)])}else for(let U in V)D.push([U,de(V[U],"entry point",U)]);if(Y){let U=Object.create(null),le=l(Y,U,"contents",lt),$e=l(Y,U,"resolveDir",C),Ue=l(Y,U,"sourcefile",C),Te=l(Y,U,"loader",C);ce(Y,U,'in "stdin" object'),Ue&&x.push(`--sourcefile=${Ue}`),Te&&x.push(`--loader=${Te}`),$e&&(Z=$e),typeof le=="string"?q=te(le):le instanceof Uint8Array&&(q=le)}let Je=[];if(w)for(let U of w)U+="",Je.push(U);return{entries:D,flags:x,write:Q,stdinContents:q,stdinResolveDir:Z,absWorkingDir:re,nodePaths:Je,mangleCache:Le(pe)}}function ut(t,s,a,p){let k=[],_=Object.create(null);Fe(k,s,_,a,p),Xe(k,s,_);let x=l(s,_,"sourcemap",He),D=l(s,_,"sourcefile",C),y=l(s,_,"loader",C),q=l(s,_,"banner",C),Z=l(s,_,"footer",C),z=l(s,_,"mangleCache",Ee);return ce(s,_,`in ${t}() call`),x&&k.push(`--sourcemap=${x===!0?"external":x}`),D&&k.push(`--sourcefile=${D}`),y&&k.push(`--loader=${y}`),q&&k.push(`--banner=${q}`),Z&&k.push(`--footer=${Z}`),{flags:k,mangleCache:Le(z)}}function ct(t){let s={},a={didClose:!1,reason:""},p={},k=0,_=0,x=new Uint8Array(16*1024),D=0,y=M=>{let E=D+M.length;if(E>x.length){let u=new Uint8Array(E*2);u.set(x),x=u}x.set(M,D),D+=M.length;let w=0;for(;w+4<=D;){let u=ge(x,w);if(w+4+u>D)break;w+=4,X(x.subarray(w,w+u)),w+=u}w>0&&(x.copyWithin(0,w,D),D-=w)},q=M=>{a.didClose=!0,M&&(a.reason=": "+(M.message||M));let E="The service was stopped"+a.reason;for(let w in p)p[w](E,null);p={}},Z=(M,E,w)=>{if(a.didClose)return w("The service is no longer running"+a.reason,null);let u=k++;p[u]=(m,v)=>{try{w(m,v)}finally{M&&M.unref()}},M&&M.ref(),t.writeToStdin(oe({id:u,isRequest:!0,value:E}))},z=(M,E)=>{if(a.didClose)throw new Error("The service is no longer running"+a.reason);t.writeToStdin(oe({id:M,isRequest:!1,value:E}))},ee=(M,E)=>N(this,null,function*(){try{if(E.command==="ping"){z(M,{});return}if(typeof E.key=="number"){let w=s[E.key];if(!w)return;let u=w[E.command];if(u){yield u(M,E);return}}throw new Error("Invalid command: "+E.command)}catch(w){let u=[Ve(w,t,null,void 0,"")];try{z(M,{errors:u})}catch{}}}),J=!0,X=M=>{if(J){J=!1;let w=String.fromCharCode(...M);if(w!=="0.25.0")throw new Error(`Cannot start service: Host version "0.25.0" does not match binary version ${T(w)}`);return}let E=S(M);if(E.isRequest)ee(E.id,E.value);else{let w=p[E.id];delete p[E.id],E.value.error?w(E.value.error,{}):w(null,E.value)}};return{readFromStdout:y,afterClose:q,service:{buildOrContext:({callName:M,refs:E,options:w,isTTY:u,defaultWD:m,callback:v})=>{let j=0,O=_++,g={},b={ref(){++j===1&&E&&E.ref()},unref(){--j===0&&(delete s[O],E&&E.unref())}};s[O]=g,b.ref(),ft(M,O,Z,z,b,t,g,w,u,m,(A,r)=>{try{v(A,r)}finally{b.unref()}})},transform:({callName:M,refs:E,input:w,options:u,isTTY:m,fs:v,callback:j})=>{let O=It(),g=b=>{try{if(typeof w!="string"&&!(w instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:A,mangleCache:r}=ut(M,u,m,me),h={command:"transform",flags:A,inputFS:b!==null,input:b!==null?te(b):typeof w=="string"?te(w):w};r&&(h.mangleCache=r),Z(E,h,($,P)=>{if($)return j(new Error($),null);let F=Ge(P.errors,O),W=Ge(P.warnings,O),V=1,re=()=>{if(--V===0){let Y={warnings:W,code:P.code,map:P.map,mangleCache:void 0,legalComments:void 0};"legalComments"in P&&(Y.legalComments=P==null?void 0:P.legalComments),P.mangleCache&&(Y.mangleCache=P==null?void 0:P.mangleCache),j(null,Y)}};if(F.length>0)return j(Ke("Transform failed",F,W),null);P.codeFS&&(V++,v.readFile(P.code,(Y,Q)=>{Y!==null?j(Y,null):(P.code=Q,re())})),P.mapFS&&(V++,v.readFile(P.map,(Y,Q)=>{Y!==null?j(Y,null):(P.map=Q,re())})),re()})}catch(A){let r=[];try{Fe(r,u,{},m,me)}catch{}let h=Ve(A,t,O,void 0,"");Z(E,{command:"error",flags:r,error:h},()=>{h.detail=O.load(h.detail),j(Ke("Transform failed",[h],[]),null)})}};if((typeof w=="string"||w instanceof Uint8Array)&&w.length>1024*1024){let b=g;g=()=>v.writeFile(w,b)}g(null)},formatMessages:({callName:M,refs:E,messages:w,options:u,callback:m})=>{if(!u)throw new Error(`Missing second argument in ${M}() call`);let v={},j=l(u,v,"kind",C),O=l(u,v,"color",L),g=l(u,v,"terminalWidth",ke);if(ce(u,v,`in ${M}() call`),j===void 0)throw new Error(`Missing "kind" in ${M}() call`);if(j!=="error"&&j!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${M}() call`);let b={command:"format-msgs",messages:Me(w,"messages",null,"",g),isWarning:j==="warning"};O!==void 0&&(b.color=O),g!==void 0&&(b.terminalWidth=g),Z(E,b,(A,r)=>{if(A)return m(new Error(A),null);m(null,r.messages)})},analyzeMetafile:({callName:M,refs:E,metafile:w,options:u,callback:m})=>{u===void 0&&(u={});let v={},j=l(u,v,"color",L),O=l(u,v,"verbose",L);ce(u,v,`in ${M}() call`);let g={command:"analyze-metafile",metafile:w};j!==void 0&&(g.color=j),O!==void 0&&(g.verbose=O),Z(E,g,(b,A)=>{if(b)return m(new Error(b),null);m(null,A.result)})}}}}function ft(t,s,a,p,k,_,x,D,y,q,Z){let z=It(),ee=t==="context",J=(I,fe)=>{let R=[];try{Fe(R,D,{},y,ne)}catch{}let M=Ve(I,_,z,void 0,fe);a(k,{command:"error",flags:R,error:M},()=>{M.detail=z.load(M.detail),Z(Ke(ee?"Context failed":"Build failed",[M],[]),null)})},X;if(typeof D=="object"){let I=D.plugins;if(I!==void 0){if(!Array.isArray(I))return J(new Error('"plugins" must be an array'),"");X=I}}if(X&&X.length>0){if(_.isSync)return J(new Error("Cannot use plugins in synchronous API calls"),"");gn(s,a,p,k,_,x,D,X,z).then(I=>{if(!I.ok)return J(I.error,I.pluginName);try{K(I.requestPlugins,I.runOnEndCallbacks,I.scheduleOnDisposeCallbacks)}catch(fe){J(fe,"")}},I=>J(I,""));return}try{K(null,(I,fe)=>fe([],[]),()=>{})}catch(I){J(I,"")}function K(I,fe,R){let M=_.hasFS,{entries:E,flags:w,write:u,stdinContents:m,stdinResolveDir:v,absWorkingDir:j,nodePaths:O,mangleCache:g}=St(t,D,y,ne,M);if(u&&!_.hasFS)throw new Error('The "write" option is unavailable in this environment');let b={command:"build",key:s,entries:E,flags:w,write:u,stdinContents:m,stdinResolveDir:v,absWorkingDir:j||q,nodePaths:O,context:ee};I&&(b.plugins=I),g&&(b.mangleCache=g);let A=($,P)=>{let F={errors:Ge($.errors,z),warnings:Ge($.warnings,z),outputFiles:void 0,metafile:void 0,mangleCache:void 0},W=F.errors.slice(),V=F.warnings.slice();$.outputFiles&&(F.outputFiles=$.outputFiles.map(vn)),$.metafile&&(F.metafile=JSON.parse($.metafile)),$.mangleCache&&(F.mangleCache=$.mangleCache),$.writeToStdout!==void 0&&console.log(he($.writeToStdout).replace(/\n$/,"")),fe(F,(re,Y)=>{if(W.length>0||re.length>0){let Q=Ke("Build failed",W.concat(re),V.concat(Y));return P(Q,null,re,Y)}P(null,F,re,Y)})},r,h;ee&&(x["on-end"]=($,P)=>new Promise(F=>{A(P,(W,V,re,Y)=>{let Q={errors:re,warnings:Y};h&&h(W,V),r=void 0,h=void 0,p($,Q),F()})})),a(k,b,($,P)=>{if($)return Z(new Error($),null);if(!ee)return A(P,(V,re)=>(R(),Z(V,re)));if(P.errors.length>0)return Z(Ke("Context failed",P.errors,P.warnings),null);let F=!1,W={rebuild:()=>(r||(r=new Promise((V,re)=>{let Y;h=(Pe,pe)=>{Y||(Y=()=>Pe?re(Pe):V(pe))};let Q=()=>{a(k,{command:"rebuild",key:s},(pe,Je)=>{pe?re(new Error(pe)):Y?Y():Q()})};Q()})),r),watch:(V={})=>new Promise((re,Y)=>{if(!_.hasFS)throw new Error('Cannot use the "watch" API in this environment');ce(V,{},"in watch() call"),a(k,{command:"watch",key:s},pe=>{pe?Y(new Error(pe)):re(void 0)})}),serve:(V={})=>new Promise((re,Y)=>{if(!_.hasFS)throw new Error('Cannot use the "serve" API in this environment');let Q={},Pe=l(V,Q,"port",ye),pe=l(V,Q,"host",C),Je=l(V,Q,"servedir",C),U=l(V,Q,"keyfile",C),le=l(V,Q,"certfile",C),$e=l(V,Q,"fallback",C),Ue=l(V,Q,"onRequest",Ze);ce(V,Q,"in serve() call");let Te={command:"serve",key:s,onRequest:!!Ue};Pe!==void 0&&(Te.port=Pe),pe!==void 0&&(Te.host=pe),Je!==void 0&&(Te.servedir=Je),U!==void 0&&(Te.keyfile=U),le!==void 0&&(Te.certfile=le),$e!==void 0&&(Te.fallback=$e),a(k,Te,(et,On)=>{if(et)return Y(new Error(et));Ue&&(x["serve-request"]=(Un,Dn)=>{Ue(Dn.args),p(Un,{})}),re(On)})}),cancel:()=>new Promise(V=>{if(F)return V();a(k,{command:"cancel",key:s},()=>{V()})}),dispose:()=>new Promise(V=>{if(F)return V();F=!0,a(k,{command:"dispose",key:s},()=>{V(),R(),k.unref()})})};k.ref(),Z(null,W)})}}var gn=(t,s,a,p,k,_,x,D,y)=>N(void 0,null,function*(){let q=[],Z=[],z={},ee={},J=[],X=0,K=0,I=[],fe=!1;D=[...D];for(let E of D){let w={};if(typeof E!="object")throw new Error(`Plugin at index ${K} must be an object`);let u=l(E,w,"name",C);if(typeof u!="string"||u==="")throw new Error(`Plugin at index ${K} is missing a name`);try{let m=l(E,w,"setup",Ze);if(typeof m!="function")throw new Error("Plugin is missing a setup function");ce(E,w,`on plugin ${T(u)}`);let v={name:u,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};K++;let O=m({initialOptions:x,resolve:(g,b={})=>{if(!fe)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof g!="string")throw new Error("The path to resolve must be a string");let A=Object.create(null),r=l(b,A,"pluginName",C),h=l(b,A,"importer",C),$=l(b,A,"namespace",C),P=l(b,A,"resolveDir",C),F=l(b,A,"kind",C),W=l(b,A,"pluginData",be),V=l(b,A,"with",Ee);return ce(b,A,"in resolve() call"),new Promise((re,Y)=>{let Q={command:"resolve",path:g,key:t,pluginName:u};if(r!=null&&(Q.pluginName=r),h!=null&&(Q.importer=h),$!=null&&(Q.namespace=$),P!=null&&(Q.resolveDir=P),F!=null)Q.kind=F;else throw new Error('Must specify "kind" when calling "resolve"');W!=null&&(Q.pluginData=y.store(W)),V!=null&&(Q.with=mn(V,"with")),s(p,Q,(Pe,pe)=>{Pe!==null?Y(new Error(Pe)):re({errors:Ge(pe.errors,y),warnings:Ge(pe.warnings,y),path:pe.path,external:pe.external,sideEffects:pe.sideEffects,namespace:pe.namespace,suffix:pe.suffix,pluginData:y.load(pe.pluginData)})})})},onStart(g){let b='This error came from the "onStart" callback registered here:',A=ht(new Error(b),k,"onStart");q.push({name:u,callback:g,note:A}),v.onStart=!0},onEnd(g){let b='This error came from the "onEnd" callback registered here:',A=ht(new Error(b),k,"onEnd");Z.push({name:u,callback:g,note:A}),v.onEnd=!0},onResolve(g,b){let A='This error came from the "onResolve" callback registered here:',r=ht(new Error(A),k,"onResolve"),h={},$=l(g,h,"filter",xe),P=l(g,h,"namespace",C);if(ce(g,h,`in onResolve() call for plugin ${T(u)}`),$==null)throw new Error("onResolve() call is missing a filter");let F=X++;z[F]={name:u,callback:b,note:r},v.onResolve.push({id:F,filter:$.source,namespace:P||""})},onLoad(g,b){let A='This error came from the "onLoad" callback registered here:',r=ht(new Error(A),k,"onLoad"),h={},$=l(g,h,"filter",xe),P=l(g,h,"namespace",C);if(ce(g,h,`in onLoad() call for plugin ${T(u)}`),$==null)throw new Error("onLoad() call is missing a filter");let F=X++;ee[F]={name:u,callback:b,note:r},v.onLoad.push({id:F,filter:$.source,namespace:P||""})},onDispose(g){J.push(g)},esbuild:k.esbuild});O&&(yield O),I.push(v)}catch(m){return{ok:!1,error:m,pluginName:u}}}_["on-start"]=(E,w)=>N(void 0,null,function*(){y.clear();let u={errors:[],warnings:[]};yield Promise.all(q.map(m=>N(void 0,[m],function*({name:v,callback:j,note:O}){try{let g=yield j();if(g!=null){if(typeof g!="object")throw new Error(`Expected onStart() callback in plugin ${T(v)} to return an object`);let b={},A=l(g,b,"errors",ae),r=l(g,b,"warnings",ae);ce(g,b,`from onStart() callback in plugin ${T(v)}`),A!=null&&u.errors.push(...Me(A,"errors",y,v,void 0)),r!=null&&u.warnings.push(...Me(r,"warnings",y,v,void 0))}}catch(g){u.errors.push(Ve(g,k,y,O&&O(),v))}}))),a(E,u)}),_["on-resolve"]=(E,w)=>N(void 0,null,function*(){let u={},m="",v,j;for(let O of w.ids)try{({name:m,callback:v,note:j}=z[O]);let g=yield v({path:w.path,importer:w.importer,namespace:w.namespace,resolveDir:w.resolveDir,kind:w.kind,pluginData:y.load(w.pluginData),with:w.with});if(g!=null){if(typeof g!="object")throw new Error(`Expected onResolve() callback in plugin ${T(m)} to return an object`);let b={},A=l(g,b,"pluginName",C),r=l(g,b,"path",C),h=l(g,b,"namespace",C),$=l(g,b,"suffix",C),P=l(g,b,"external",L),F=l(g,b,"sideEffects",L),W=l(g,b,"pluginData",be),V=l(g,b,"errors",ae),re=l(g,b,"warnings",ae),Y=l(g,b,"watchFiles",ae),Q=l(g,b,"watchDirs",ae);ce(g,b,`from onResolve() callback in plugin ${T(m)}`),u.id=O,A!=null&&(u.pluginName=A),r!=null&&(u.path=r),h!=null&&(u.namespace=h),$!=null&&(u.suffix=$),P!=null&&(u.external=P),F!=null&&(u.sideEffects=F),W!=null&&(u.pluginData=y.store(W)),V!=null&&(u.errors=Me(V,"errors",y,m,void 0)),re!=null&&(u.warnings=Me(re,"warnings",y,m,void 0)),Y!=null&&(u.watchFiles=dt(Y,"watchFiles")),Q!=null&&(u.watchDirs=dt(Q,"watchDirs"));break}}catch(g){u={id:O,errors:[Ve(g,k,y,j&&j(),m)]};break}a(E,u)}),_["on-load"]=(E,w)=>N(void 0,null,function*(){let u={},m="",v,j;for(let O of w.ids)try{({name:m,callback:v,note:j}=ee[O]);let g=yield v({path:w.path,namespace:w.namespace,suffix:w.suffix,pluginData:y.load(w.pluginData),with:w.with});if(g!=null){if(typeof g!="object")throw new Error(`Expected onLoad() callback in plugin ${T(m)} to return an object`);let b={},A=l(g,b,"pluginName",C),r=l(g,b,"contents",lt),h=l(g,b,"resolveDir",C),$=l(g,b,"pluginData",be),P=l(g,b,"loader",C),F=l(g,b,"errors",ae),W=l(g,b,"warnings",ae),V=l(g,b,"watchFiles",ae),re=l(g,b,"watchDirs",ae);ce(g,b,`from onLoad() callback in plugin ${T(m)}`),u.id=O,A!=null&&(u.pluginName=A),r instanceof Uint8Array?u.contents=r:r!=null&&(u.contents=te(r)),h!=null&&(u.resolveDir=h),$!=null&&(u.pluginData=y.store($)),P!=null&&(u.loader=P),F!=null&&(u.errors=Me(F,"errors",y,m,void 0)),W!=null&&(u.warnings=Me(W,"warnings",y,m,void 0)),V!=null&&(u.watchFiles=dt(V,"watchFiles")),re!=null&&(u.watchDirs=dt(re,"watchDirs"));break}}catch(g){u={id:O,errors:[Ve(g,k,y,j&&j(),m)]};break}a(E,u)});let R=(E,w)=>w([],[]);Z.length>0&&(R=(E,w)=>{N(void 0,null,function*(){let u=[],m=[];for(let{name:v,callback:j,note:O}of Z){let g,b;try{let A=yield j(E);if(A!=null){if(typeof A!="object")throw new Error(`Expected onEnd() callback in plugin ${T(v)} to return an object`);let r={},h=l(A,r,"errors",ae),$=l(A,r,"warnings",ae);ce(A,r,`from onEnd() callback in plugin ${T(v)}`),h!=null&&(g=Me(h,"errors",y,v,void 0)),$!=null&&(b=Me($,"warnings",y,v,void 0))}}catch(A){g=[Ve(A,k,y,O&&O(),v)]}if(g){u.push(...g);try{E.errors.push(...g)}catch{}}if(b){m.push(...b);try{E.warnings.push(...b)}catch{}}}w(u,m)})});let M=()=>{for(let E of J)setTimeout(()=>E(),0)};return fe=!0,{ok:!0,requestPlugins:I,runOnEndCallbacks:R,scheduleOnDisposeCallbacks:M}});function It(){let t=new Map,s=0;return{clear(){t.clear()},load(a){return t.get(a)},store(a){if(a===void 0)return-1;let p=s++;return t.set(p,a),p}}}function ht(t,s,a){let p,k=!1;return()=>{if(k)return p;k=!0;try{let _=(t.stack+"").split(`
`);_.splice(1,1);let x=Ft(s,_,a);if(x)return p={text:t.message,location:x},p}catch{}}}function Ve(t,s,a,p,k){let _="Internal error",x=null;try{_=(t&&t.message||t)+""}catch{}try{x=Ft(s,(t.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:k,text:_,location:x,notes:p?[p]:[],detail:a?a.store(t):-1}}function Ft(t,s,a){let p="    at ";if(t.readFileSync&&!s[0].startsWith(p)&&s[1].startsWith(p))for(let k=1;k<s.length;k++){let _=s[k];if(_.startsWith(p))for(_=_.slice(p.length);;){let x=/^(?:new |async )?\S+ \((.*)\)$/.exec(_);if(x){_=x[1];continue}if(x=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(_),x){_=x[1];continue}if(x=/^(\S+):(\d+):(\d+)$/.exec(_),x){let D;try{D=t.readFileSync(x[1],"utf8")}catch{break}let y=D.split(/\r\n|\r|\n|\u2028|\u2029/)[+x[2]-1]||"",q=+x[3]-1,Z=y.slice(q,q+a.length)===a?a.length:0;return{file:x[1],namespace:"file",line:+x[2],column:te(y.slice(0,q)).length,length:te(y.slice(q,q+Z)).length,lineText:y+`
`+s.slice(1).join(`
`),suggestion:""}}break}}return null}function Ke(t,s,a){let p=5;t+=s.length<1?"":` with ${s.length} error${s.length<2?"":"s"}:`+s.slice(0,p+1).map((_,x)=>{if(x===p)return`
...`;if(!_.location)return`
error: ${_.text}`;let{file:D,line:y,column:q}=_.location,Z=_.pluginName?`[plugin: ${_.pluginName}] `:"";return`
${D}:${y}:${q}: ERROR: ${Z}${_.text}`}).join("");let k=new Error(t);for(let[_,x]of[["errors",s],["warnings",a]])Object.defineProperty(k,_,{configurable:!0,enumerable:!0,get:()=>x,set:D=>Object.defineProperty(k,_,{configurable:!0,enumerable:!0,value:D})});return k}function Ge(t,s){for(let a of t)a.detail=s.load(a.detail);return t}function zt(t,s,a){if(t==null)return null;let p={},k=l(t,p,"file",C),_=l(t,p,"namespace",C),x=l(t,p,"line",ke),D=l(t,p,"column",ke),y=l(t,p,"length",ke),q=l(t,p,"lineText",C),Z=l(t,p,"suggestion",C);if(ce(t,p,s),q){let z=q.slice(0,(D&&D>0?D:0)+(y&&y>0?y:0)+(a&&a>0?a:80));!/[\x7F-\uFFFF]/.test(z)&&!/\n/.test(q)&&(q=z)}return{file:k||"",namespace:_||"",line:x||0,column:D||0,length:y||0,lineText:q||"",suggestion:Z||""}}function Me(t,s,a,p,k){let _=[],x=0;for(let D of t){let y={},q=l(D,y,"id",C),Z=l(D,y,"pluginName",C),z=l(D,y,"text",C),ee=l(D,y,"location",Ne),J=l(D,y,"notes",ae),X=l(D,y,"detail",be),K=`in element ${x} of "${s}"`;ce(D,y,K);let I=[];if(J)for(let fe of J){let R={},M=l(fe,R,"text",C),E=l(fe,R,"location",Ne);ce(fe,R,K),I.push({text:M||"",location:zt(E,K,k)})}_.push({id:q||"",pluginName:Z||p,text:z||"",location:zt(ee,K,k),notes:I,detail:a?a.store(X):-1}),x++}return _}function dt(t,s){let a=[];for(let p of t){if(typeof p!="string")throw new Error(`${T(s)} must be an array of strings`);a.push(p)}return a}function mn(t,s){let a=Object.create(null);for(let p in t){let k=t[p];if(typeof k!="string")throw new Error(`key ${T(p)} in object ${T(s)} must be a string`);a[p]=k}return a}function vn({path:t,contents:s,hash:a}){let p=null;return{path:t,contents:s,hash:a,get text(){let k=this.contents;return(p===null||k!==s)&&(s=k,p=he(k)),p}}}var yn="0.25.0",wn=t=>Qe().build(t),bn=t=>Qe().context(t),xn=(t,s)=>Qe().transform(t,s),kn=(t,s)=>Qe().formatMessages(t,s),Sn=(t,s)=>Qe().analyzeMetafile(t,s),En=()=>{throw new Error('The "buildSync" API only works in node')},Tn=()=>{throw new Error('The "transformSync" API only works in node')},_n=()=>{throw new Error('The "formatMessagesSync" API only works in node')},jn=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Pn=()=>(pt&&pt(),Promise.resolve()),We,pt,gt,Qe=()=>{if(gt)return gt;throw We?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},$n=t=>{t=Be(t||{});let s=t.wasmURL,a=t.wasmModule,p=t.worker!==!1;if(!s&&!a)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(We)throw new Error('Cannot call "initialize" more than once');return We=An(s||"",a,p),We.catch(()=>{We=void 0}),We},An=(t,s,a)=>N(void 0,null,function*(){let p,k,_=new Promise(z=>k=z);if(a){let z=new Blob([`onmessage=((postMessage) => {
      // Copyright 2018 The Go Authors. All rights reserved.
      // Use of this source code is governed by a BSD-style
      // license that can be found in the LICENSE file.
      var __async = (__this, __arguments, generator) => {
        return new Promise((resolve, reject) => {
          var fulfilled = (value) => {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          };
          var rejected = (value) => {
            try {
              step(generator.throw(value));
            } catch (e) {
              reject(e);
            }
          };
          var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
          step((generator = generator.apply(__this, __arguments)).next());
        });
      };
      let onmessage;
      let globalThis = {};
      for (let o = self; o; o = Object.getPrototypeOf(o))
        for (let k of Object.getOwnPropertyNames(o))
          if (!(k in globalThis))
            Object.defineProperty(globalThis, k, { get: () => self[k] });
      "use strict";
      (() => {
        const enosys = () => {
          const err = new Error("not implemented");
          err.code = "ENOSYS";
          return err;
        };
        if (!globalThis.fs) {
          let outputBuf = "";
          globalThis.fs = {
            constants: { O_WRONLY: -1, O_RDWR: -1, O_CREAT: -1, O_TRUNC: -1, O_APPEND: -1, O_EXCL: -1 },
            // unused
            writeSync(fd, buf) {
              outputBuf += decoder.decode(buf);
              const nl = outputBuf.lastIndexOf("\\n");
              if (nl != -1) {
                console.log(outputBuf.substring(0, nl));
                outputBuf = outputBuf.substring(nl + 1);
              }
              return buf.length;
            },
            write(fd, buf, offset, length, position, callback) {
              if (offset !== 0 || length !== buf.length || position !== null) {
                callback(enosys());
                return;
              }
              const n = this.writeSync(fd, buf);
              callback(null, n);
            },
            chmod(path, mode, callback) {
              callback(enosys());
            },
            chown(path, uid, gid, callback) {
              callback(enosys());
            },
            close(fd, callback) {
              callback(enosys());
            },
            fchmod(fd, mode, callback) {
              callback(enosys());
            },
            fchown(fd, uid, gid, callback) {
              callback(enosys());
            },
            fstat(fd, callback) {
              callback(enosys());
            },
            fsync(fd, callback) {
              callback(null);
            },
            ftruncate(fd, length, callback) {
              callback(enosys());
            },
            lchown(path, uid, gid, callback) {
              callback(enosys());
            },
            link(path, link, callback) {
              callback(enosys());
            },
            lstat(path, callback) {
              callback(enosys());
            },
            mkdir(path, perm, callback) {
              callback(enosys());
            },
            open(path, flags, mode, callback) {
              callback(enosys());
            },
            read(fd, buffer, offset, length, position, callback) {
              callback(enosys());
            },
            readdir(path, callback) {
              callback(enosys());
            },
            readlink(path, callback) {
              callback(enosys());
            },
            rename(from, to, callback) {
              callback(enosys());
            },
            rmdir(path, callback) {
              callback(enosys());
            },
            stat(path, callback) {
              callback(enosys());
            },
            symlink(path, link, callback) {
              callback(enosys());
            },
            truncate(path, length, callback) {
              callback(enosys());
            },
            unlink(path, callback) {
              callback(enosys());
            },
            utimes(path, atime, mtime, callback) {
              callback(enosys());
            }
          };
        }
        if (!globalThis.process) {
          globalThis.process = {
            getuid() {
              return -1;
            },
            getgid() {
              return -1;
            },
            geteuid() {
              return -1;
            },
            getegid() {
              return -1;
            },
            getgroups() {
              throw enosys();
            },
            pid: -1,
            ppid: -1,
            umask() {
              throw enosys();
            },
            cwd() {
              throw enosys();
            },
            chdir() {
              throw enosys();
            }
          };
        }
        if (!globalThis.crypto) {
          throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");
        }
        if (!globalThis.performance) {
          throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");
        }
        if (!globalThis.TextEncoder) {
          throw new Error("globalThis.TextEncoder is not available, polyfill required");
        }
        if (!globalThis.TextDecoder) {
          throw new Error("globalThis.TextDecoder is not available, polyfill required");
        }
        const encoder = new TextEncoder("utf-8");
        const decoder = new TextDecoder("utf-8");
        globalThis.Go = class {
          constructor() {
            this.argv = ["js"];
            this.env = {};
            this.exit = (code) => {
              if (code !== 0) {
                console.warn("exit code:", code);
              }
            };
            this._exitPromise = new Promise((resolve) => {
              this._resolveExitPromise = resolve;
            });
            this._pendingEvent = null;
            this._scheduledTimeouts = /* @__PURE__ */ new Map();
            this._nextCallbackTimeoutID = 1;
            const setInt64 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
              this.mem.setUint32(addr + 4, Math.floor(v / 4294967296), true);
            };
            const setInt32 = (addr, v) => {
              this.mem.setUint32(addr + 0, v, true);
            };
            const getInt64 = (addr) => {
              const low = this.mem.getUint32(addr + 0, true);
              const high = this.mem.getInt32(addr + 4, true);
              return low + high * 4294967296;
            };
            const loadValue = (addr) => {
              const f = this.mem.getFloat64(addr, true);
              if (f === 0) {
                return void 0;
              }
              if (!isNaN(f)) {
                return f;
              }
              const id = this.mem.getUint32(addr, true);
              return this._values[id];
            };
            const storeValue = (addr, v) => {
              const nanHead = 2146959360;
              if (typeof v === "number" && v !== 0) {
                if (isNaN(v)) {
                  this.mem.setUint32(addr + 4, nanHead, true);
                  this.mem.setUint32(addr, 0, true);
                  return;
                }
                this.mem.setFloat64(addr, v, true);
                return;
              }
              if (v === void 0) {
                this.mem.setFloat64(addr, 0, true);
                return;
              }
              let id = this._ids.get(v);
              if (id === void 0) {
                id = this._idPool.pop();
                if (id === void 0) {
                  id = this._values.length;
                }
                this._values[id] = v;
                this._goRefCounts[id] = 0;
                this._ids.set(v, id);
              }
              this._goRefCounts[id]++;
              let typeFlag = 0;
              switch (typeof v) {
                case "object":
                  if (v !== null) {
                    typeFlag = 1;
                  }
                  break;
                case "string":
                  typeFlag = 2;
                  break;
                case "symbol":
                  typeFlag = 3;
                  break;
                case "function":
                  typeFlag = 4;
                  break;
              }
              this.mem.setUint32(addr + 4, nanHead | typeFlag, true);
              this.mem.setUint32(addr, id, true);
            };
            const loadSlice = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return new Uint8Array(this._inst.exports.mem.buffer, array, len);
            };
            const loadSliceOfValues = (addr) => {
              const array = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              const a = new Array(len);
              for (let i = 0; i < len; i++) {
                a[i] = loadValue(array + i * 8);
              }
              return a;
            };
            const loadString = (addr) => {
              const saddr = getInt64(addr + 0);
              const len = getInt64(addr + 8);
              return decoder.decode(new DataView(this._inst.exports.mem.buffer, saddr, len));
            };
            const timeOrigin = Date.now() - performance.now();
            this.importObject = {
              _gotest: {
                add: (a, b) => a + b
              },
              gojs: {
                // Go's SP does not change as long as no Go code is running. Some operations (e.g. calls, getters and setters)
                // may synchronously trigger a Go event handler. This makes Go code get executed in the middle of the imported
                // function. A goroutine can switch to a new stack if the current stack is too small (see morestack function).
                // This changes the SP, thus we have to update the SP used by the imported function.
                // func wasmExit(code int32)
                "runtime.wasmExit": (sp) => {
                  sp >>>= 0;
                  const code = this.mem.getInt32(sp + 8, true);
                  this.exited = true;
                  delete this._inst;
                  delete this._values;
                  delete this._goRefCounts;
                  delete this._ids;
                  delete this._idPool;
                  this.exit(code);
                },
                // func wasmWrite(fd uintptr, p unsafe.Pointer, n int32)
                "runtime.wasmWrite": (sp) => {
                  sp >>>= 0;
                  const fd = getInt64(sp + 8);
                  const p = getInt64(sp + 16);
                  const n = this.mem.getInt32(sp + 24, true);
                  globalThis.fs.writeSync(fd, new Uint8Array(this._inst.exports.mem.buffer, p, n));
                },
                // func resetMemoryDataView()
                "runtime.resetMemoryDataView": (sp) => {
                  sp >>>= 0;
                  this.mem = new DataView(this._inst.exports.mem.buffer);
                },
                // func nanotime1() int64
                "runtime.nanotime1": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 8, (timeOrigin + performance.now()) * 1e6);
                },
                // func walltime() (sec int64, nsec int32)
                "runtime.walltime": (sp) => {
                  sp >>>= 0;
                  const msec = (/* @__PURE__ */ new Date()).getTime();
                  setInt64(sp + 8, msec / 1e3);
                  this.mem.setInt32(sp + 16, msec % 1e3 * 1e6, true);
                },
                // func scheduleTimeoutEvent(delay int64) int32
                "runtime.scheduleTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this._nextCallbackTimeoutID;
                  this._nextCallbackTimeoutID++;
                  this._scheduledTimeouts.set(id, setTimeout(
                    () => {
                      this._resume();
                      while (this._scheduledTimeouts.has(id)) {
                        console.warn("scheduleTimeoutEvent: missed timeout event");
                        this._resume();
                      }
                    },
                    getInt64(sp + 8)
                  ));
                  this.mem.setInt32(sp + 16, id, true);
                },
                // func clearTimeoutEvent(id int32)
                "runtime.clearTimeoutEvent": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getInt32(sp + 8, true);
                  clearTimeout(this._scheduledTimeouts.get(id));
                  this._scheduledTimeouts.delete(id);
                },
                // func getRandomData(r []byte)
                "runtime.getRandomData": (sp) => {
                  sp >>>= 0;
                  crypto.getRandomValues(loadSlice(sp + 8));
                },
                // func finalizeRef(v ref)
                "syscall/js.finalizeRef": (sp) => {
                  sp >>>= 0;
                  const id = this.mem.getUint32(sp + 8, true);
                  this._goRefCounts[id]--;
                  if (this._goRefCounts[id] === 0) {
                    const v = this._values[id];
                    this._values[id] = null;
                    this._ids.delete(v);
                    this._idPool.push(id);
                  }
                },
                // func stringVal(value string) ref
                "syscall/js.stringVal": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, loadString(sp + 8));
                },
                // func valueGet(v ref, p string) ref
                "syscall/js.valueGet": (sp) => {
                  sp >>>= 0;
                  const result = Reflect.get(loadValue(sp + 8), loadString(sp + 16));
                  sp = this._inst.exports.getsp() >>> 0;
                  storeValue(sp + 32, result);
                },
                // func valueSet(v ref, p string, x ref)
                "syscall/js.valueSet": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), loadString(sp + 16), loadValue(sp + 32));
                },
                // func valueDelete(v ref, p string)
                "syscall/js.valueDelete": (sp) => {
                  sp >>>= 0;
                  Reflect.deleteProperty(loadValue(sp + 8), loadString(sp + 16));
                },
                // func valueIndex(v ref, i int) ref
                "syscall/js.valueIndex": (sp) => {
                  sp >>>= 0;
                  storeValue(sp + 24, Reflect.get(loadValue(sp + 8), getInt64(sp + 16)));
                },
                // valueSetIndex(v ref, i int, x ref)
                "syscall/js.valueSetIndex": (sp) => {
                  sp >>>= 0;
                  Reflect.set(loadValue(sp + 8), getInt64(sp + 16), loadValue(sp + 24));
                },
                // func valueCall(v ref, m string, args []ref) (ref, bool)
                "syscall/js.valueCall": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const m = Reflect.get(v, loadString(sp + 16));
                    const args = loadSliceOfValues(sp + 32);
                    const result = Reflect.apply(m, v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, result);
                    this.mem.setUint8(sp + 64, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 56, err);
                    this.mem.setUint8(sp + 64, 0);
                  }
                },
                // func valueInvoke(v ref, args []ref) (ref, bool)
                "syscall/js.valueInvoke": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.apply(v, void 0, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueNew(v ref, args []ref) (ref, bool)
                "syscall/js.valueNew": (sp) => {
                  sp >>>= 0;
                  try {
                    const v = loadValue(sp + 8);
                    const args = loadSliceOfValues(sp + 16);
                    const result = Reflect.construct(v, args);
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, result);
                    this.mem.setUint8(sp + 48, 1);
                  } catch (err) {
                    sp = this._inst.exports.getsp() >>> 0;
                    storeValue(sp + 40, err);
                    this.mem.setUint8(sp + 48, 0);
                  }
                },
                // func valueLength(v ref) int
                "syscall/js.valueLength": (sp) => {
                  sp >>>= 0;
                  setInt64(sp + 16, parseInt(loadValue(sp + 8).length));
                },
                // valuePrepareString(v ref) (ref, int)
                "syscall/js.valuePrepareString": (sp) => {
                  sp >>>= 0;
                  const str = encoder.encode(String(loadValue(sp + 8)));
                  storeValue(sp + 16, str);
                  setInt64(sp + 24, str.length);
                },
                // valueLoadString(v ref, b []byte)
                "syscall/js.valueLoadString": (sp) => {
                  sp >>>= 0;
                  const str = loadValue(sp + 8);
                  loadSlice(sp + 16).set(str);
                },
                // func valueInstanceOf(v ref, t ref) bool
                "syscall/js.valueInstanceOf": (sp) => {
                  sp >>>= 0;
                  this.mem.setUint8(sp + 24, loadValue(sp + 8) instanceof loadValue(sp + 16) ? 1 : 0);
                },
                // func copyBytesToGo(dst []byte, src ref) (int, bool)
                "syscall/js.copyBytesToGo": (sp) => {
                  sp >>>= 0;
                  const dst = loadSlice(sp + 8);
                  const src = loadValue(sp + 32);
                  if (!(src instanceof Uint8Array || src instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                // func copyBytesToJS(dst ref, src []byte) (int, bool)
                "syscall/js.copyBytesToJS": (sp) => {
                  sp >>>= 0;
                  const dst = loadValue(sp + 8);
                  const src = loadSlice(sp + 16);
                  if (!(dst instanceof Uint8Array || dst instanceof Uint8ClampedArray)) {
                    this.mem.setUint8(sp + 48, 0);
                    return;
                  }
                  const toCopy = src.subarray(0, dst.length);
                  dst.set(toCopy);
                  setInt64(sp + 40, toCopy.length);
                  this.mem.setUint8(sp + 48, 1);
                },
                "debug": (value) => {
                  console.log(value);
                }
              }
            };
          }
          run(instance) {
            return __async(this, null, function* () {
              if (!(instance instanceof WebAssembly.Instance)) {
                throw new Error("Go.run: WebAssembly.Instance expected");
              }
              this._inst = instance;
              this.mem = new DataView(this._inst.exports.mem.buffer);
              this._values = [
                // JS values that Go currently has references to, indexed by reference id
                NaN,
                0,
                null,
                true,
                false,
                globalThis,
                this
              ];
              this._goRefCounts = new Array(this._values.length).fill(Infinity);
              this._ids = /* @__PURE__ */ new Map([
                // mapping from JS values to reference ids
                [0, 1],
                [null, 2],
                [true, 3],
                [false, 4],
                [globalThis, 5],
                [this, 6]
              ]);
              this._idPool = [];
              this.exited = false;
              let offset = 4096;
              const strPtr = (str) => {
                const ptr = offset;
                const bytes = encoder.encode(str + "\\0");
                new Uint8Array(this.mem.buffer, offset, bytes.length).set(bytes);
                offset += bytes.length;
                if (offset % 8 !== 0) {
                  offset += 8 - offset % 8;
                }
                return ptr;
              };
              const argc = this.argv.length;
              const argvPtrs = [];
              this.argv.forEach((arg) => {
                argvPtrs.push(strPtr(arg));
              });
              argvPtrs.push(0);
              const keys = Object.keys(this.env).sort();
              keys.forEach((key) => {
                argvPtrs.push(strPtr(\`\${key}=\${this.env[key]}\`));
              });
              argvPtrs.push(0);
              const argv = offset;
              argvPtrs.forEach((ptr) => {
                this.mem.setUint32(offset, ptr, true);
                this.mem.setUint32(offset + 4, 0, true);
                offset += 8;
              });
              const wasmMinDataAddr = 4096 + 8192;
              if (offset >= wasmMinDataAddr) {
                throw new Error("total length of command line and environment variables exceeds limit");
              }
              this._inst.exports.run(argc, argv);
              if (this.exited) {
                this._resolveExitPromise();
              }
              yield this._exitPromise;
            });
          }
          _resume() {
            if (this.exited) {
              throw new Error("Go program has already exited");
            }
            this._inst.exports.resume();
            if (this.exited) {
              this._resolveExitPromise();
            }
          }
          _makeFuncWrapper(id) {
            const go = this;
            return function() {
              const event = { id, this: this, args: arguments };
              go._pendingEvent = event;
              go._resume();
              return event.result;
            };
          }
        };
      })();
      onmessage = ({ data: wasm }) => {
        let decoder = new TextDecoder();
        let fs = globalThis.fs;
        let stderr = "";
        fs.writeSync = (fd, buffer) => {
          if (fd === 1) {
            postMessage(buffer);
          } else if (fd === 2) {
            stderr += decoder.decode(buffer);
            let parts = stderr.split("\\n");
            if (parts.length > 1) console.log(parts.slice(0, -1).join("\\n"));
            stderr = parts[parts.length - 1];
          } else {
            throw new Error("Bad write");
          }
          return buffer.length;
        };
        let stdin = [];
        let resumeStdin;
        let stdinPos = 0;
        onmessage = ({ data }) => {
          if (data.length > 0) {
            stdin.push(data);
            if (resumeStdin) resumeStdin();
          }
          return go;
        };
        fs.read = (fd, buffer, offset, length, position, callback) => {
          if (fd !== 0 || offset !== 0 || length !== buffer.length || position !== null) {
            throw new Error("Bad read");
          }
          if (stdin.length === 0) {
            resumeStdin = () => fs.read(fd, buffer, offset, length, position, callback);
            return;
          }
          let first = stdin[0];
          let count = Math.max(0, Math.min(length, first.length - stdinPos));
          buffer.set(first.subarray(stdinPos, stdinPos + count), offset);
          stdinPos += count;
          if (stdinPos === first.length) {
            stdin.shift();
            stdinPos = 0;
          }
          callback(null, count);
        };
        let go = new globalThis.Go();
        go.argv = ["", \`--service=\${"0.25.0"}\`];
        tryToInstantiateModule(wasm, go).then(
          (instance) => {
            postMessage(null);
            go.run(instance);
          },
          (error) => {
            postMessage(error);
          }
        );
        return go;
      };
      function tryToInstantiateModule(wasm, go) {
        return __async(this, null, function* () {
          if (wasm instanceof WebAssembly.Module) {
            return WebAssembly.instantiate(wasm, go.importObject);
          }
          const res = yield fetch(wasm);
          if (!res.ok) throw new Error(\`Failed to download \${JSON.stringify(wasm)}\`);
          if ("instantiateStreaming" in WebAssembly && /^application\\/wasm($|;)/i.test(res.headers.get("Content-Type") || "")) {
            const result2 = yield WebAssembly.instantiateStreaming(res, go.importObject);
            return result2.instance;
          }
          const bytes = yield res.arrayBuffer();
          const result = yield WebAssembly.instantiate(bytes, go.importObject);
          return result.instance;
        });
      }
      return (m) => onmessage(m);
    })(postMessage)`],{type:"text/javascript"});p=new Worker(URL.createObjectURL(z))}else{let z=(J=>{var X=(R,M,E)=>new Promise((w,u)=>{var m=O=>{try{j(E.next(O))}catch(g){u(g)}},v=O=>{try{j(E.throw(O))}catch(g){u(g)}},j=O=>O.done?w(O.value):Promise.resolve(O.value).then(m,v);j((E=E.apply(R,M)).next())});let K,I={};for(let R=self;R;R=Object.getPrototypeOf(R))for(let M of Object.getOwnPropertyNames(R))M in I||Object.defineProperty(I,M,{get:()=>self[M]});(()=>{let R=()=>{let w=new Error("not implemented");return w.code="ENOSYS",w};if(!I.fs){let w="";I.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(u,m){w+=E.decode(m);let v=w.lastIndexOf(`
`);return v!=-1&&(console.log(w.substring(0,v)),w=w.substring(v+1)),m.length},write(u,m,v,j,O,g){if(v!==0||j!==m.length||O!==null){g(R());return}let b=this.writeSync(u,m);g(null,b)},chmod(u,m,v){v(R())},chown(u,m,v,j){j(R())},close(u,m){m(R())},fchmod(u,m,v){v(R())},fchown(u,m,v,j){j(R())},fstat(u,m){m(R())},fsync(u,m){m(null)},ftruncate(u,m,v){v(R())},lchown(u,m,v,j){j(R())},link(u,m,v){v(R())},lstat(u,m){m(R())},mkdir(u,m,v){v(R())},open(u,m,v,j){j(R())},read(u,m,v,j,O,g){g(R())},readdir(u,m){m(R())},readlink(u,m){m(R())},rename(u,m,v){v(R())},rmdir(u,m){m(R())},stat(u,m){m(R())},symlink(u,m,v){v(R())},truncate(u,m,v){v(R())},unlink(u,m){m(R())},utimes(u,m,v,j){j(R())}}}if(I.process||(I.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw R()},pid:-1,ppid:-1,umask(){throw R()},cwd(){throw R()},chdir(){throw R()}}),!I.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!I.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!I.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!I.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");let M=new TextEncoder("utf-8"),E=new TextDecoder("utf-8");I.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=r=>{r!==0&&console.warn("exit code:",r)},this._exitPromise=new Promise(r=>{this._resolveExitPromise=r}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;let w=(r,h)=>{this.mem.setUint32(r+0,h,!0),this.mem.setUint32(r+4,Math.floor(h/4294967296),!0)},u=(r,h)=>{this.mem.setUint32(r+0,h,!0)},m=r=>{let h=this.mem.getUint32(r+0,!0),$=this.mem.getInt32(r+4,!0);return h+$*4294967296},v=r=>{let h=this.mem.getFloat64(r,!0);if(h===0)return;if(!isNaN(h))return h;let $=this.mem.getUint32(r,!0);return this._values[$]},j=(r,h)=>{if(typeof h=="number"&&h!==0){if(isNaN(h)){this.mem.setUint32(r+4,2146959360,!0),this.mem.setUint32(r,0,!0);return}this.mem.setFloat64(r,h,!0);return}if(h===void 0){this.mem.setFloat64(r,0,!0);return}let P=this._ids.get(h);P===void 0&&(P=this._idPool.pop(),P===void 0&&(P=this._values.length),this._values[P]=h,this._goRefCounts[P]=0,this._ids.set(h,P)),this._goRefCounts[P]++;let F=0;switch(typeof h){case"object":h!==null&&(F=1);break;case"string":F=2;break;case"symbol":F=3;break;case"function":F=4;break}this.mem.setUint32(r+4,2146959360|F,!0),this.mem.setUint32(r,P,!0)},O=r=>{let h=m(r+0),$=m(r+8);return new Uint8Array(this._inst.exports.mem.buffer,h,$)},g=r=>{let h=m(r+0),$=m(r+8),P=new Array($);for(let F=0;F<$;F++)P[F]=v(h+F*8);return P},b=r=>{let h=m(r+0),$=m(r+8);return E.decode(new DataView(this._inst.exports.mem.buffer,h,$))},A=Date.now()-performance.now();this.importObject={_gotest:{add:(r,h)=>r+h},gojs:{"runtime.wasmExit":r=>{r>>>=0;let h=this.mem.getInt32(r+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(h)},"runtime.wasmWrite":r=>{r>>>=0;let h=m(r+8),$=m(r+16),P=this.mem.getInt32(r+24,!0);I.fs.writeSync(h,new Uint8Array(this._inst.exports.mem.buffer,$,P))},"runtime.resetMemoryDataView":r=>{r>>>=0,this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":r=>{r>>>=0,w(r+8,(A+performance.now())*1e6)},"runtime.walltime":r=>{r>>>=0;let h=new Date().getTime();w(r+8,h/1e3),this.mem.setInt32(r+16,h%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":r=>{r>>>=0;let h=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(h,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(h);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},m(r+8))),this.mem.setInt32(r+16,h,!0)},"runtime.clearTimeoutEvent":r=>{r>>>=0;let h=this.mem.getInt32(r+8,!0);clearTimeout(this._scheduledTimeouts.get(h)),this._scheduledTimeouts.delete(h)},"runtime.getRandomData":r=>{r>>>=0,crypto.getRandomValues(O(r+8))},"syscall/js.finalizeRef":r=>{r>>>=0;let h=this.mem.getUint32(r+8,!0);if(this._goRefCounts[h]--,this._goRefCounts[h]===0){let $=this._values[h];this._values[h]=null,this._ids.delete($),this._idPool.push(h)}},"syscall/js.stringVal":r=>{r>>>=0,j(r+24,b(r+8))},"syscall/js.valueGet":r=>{r>>>=0;let h=Reflect.get(v(r+8),b(r+16));r=this._inst.exports.getsp()>>>0,j(r+32,h)},"syscall/js.valueSet":r=>{r>>>=0,Reflect.set(v(r+8),b(r+16),v(r+32))},"syscall/js.valueDelete":r=>{r>>>=0,Reflect.deleteProperty(v(r+8),b(r+16))},"syscall/js.valueIndex":r=>{r>>>=0,j(r+24,Reflect.get(v(r+8),m(r+16)))},"syscall/js.valueSetIndex":r=>{r>>>=0,Reflect.set(v(r+8),m(r+16),v(r+24))},"syscall/js.valueCall":r=>{r>>>=0;try{let h=v(r+8),$=Reflect.get(h,b(r+16)),P=g(r+32),F=Reflect.apply($,h,P);r=this._inst.exports.getsp()>>>0,j(r+56,F),this.mem.setUint8(r+64,1)}catch(h){r=this._inst.exports.getsp()>>>0,j(r+56,h),this.mem.setUint8(r+64,0)}},"syscall/js.valueInvoke":r=>{r>>>=0;try{let h=v(r+8),$=g(r+16),P=Reflect.apply(h,void 0,$);r=this._inst.exports.getsp()>>>0,j(r+40,P),this.mem.setUint8(r+48,1)}catch(h){r=this._inst.exports.getsp()>>>0,j(r+40,h),this.mem.setUint8(r+48,0)}},"syscall/js.valueNew":r=>{r>>>=0;try{let h=v(r+8),$=g(r+16),P=Reflect.construct(h,$);r=this._inst.exports.getsp()>>>0,j(r+40,P),this.mem.setUint8(r+48,1)}catch(h){r=this._inst.exports.getsp()>>>0,j(r+40,h),this.mem.setUint8(r+48,0)}},"syscall/js.valueLength":r=>{r>>>=0,w(r+16,parseInt(v(r+8).length))},"syscall/js.valuePrepareString":r=>{r>>>=0;let h=M.encode(String(v(r+8)));j(r+16,h),w(r+24,h.length)},"syscall/js.valueLoadString":r=>{r>>>=0;let h=v(r+8);O(r+16).set(h)},"syscall/js.valueInstanceOf":r=>{r>>>=0,this.mem.setUint8(r+24,v(r+8)instanceof v(r+16)?1:0)},"syscall/js.copyBytesToGo":r=>{r>>>=0;let h=O(r+8),$=v(r+32);if(!($ instanceof Uint8Array||$ instanceof Uint8ClampedArray)){this.mem.setUint8(r+48,0);return}let P=$.subarray(0,h.length);h.set(P),w(r+40,P.length),this.mem.setUint8(r+48,1)},"syscall/js.copyBytesToJS":r=>{r>>>=0;let h=v(r+8),$=O(r+16);if(!(h instanceof Uint8Array||h instanceof Uint8ClampedArray)){this.mem.setUint8(r+48,0);return}let P=$.subarray(0,h.length);h.set(P),w(r+40,P.length),this.mem.setUint8(r+48,1)},debug:r=>{console.log(r)}}}}run(w){return X(this,null,function*(){if(!(w instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=w,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,I,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[I,5],[this,6]]),this._idPool=[],this.exited=!1;let u=4096,m=A=>{let r=u,h=M.encode(A+"\0");return new Uint8Array(this.mem.buffer,u,h.length).set(h),u+=h.length,u%8!==0&&(u+=8-u%8),r},v=this.argv.length,j=[];this.argv.forEach(A=>{j.push(m(A))}),j.push(0),Object.keys(this.env).sort().forEach(A=>{j.push(m(`${A}=${this.env[A]}`))}),j.push(0);let g=u;if(j.forEach(A=>{this.mem.setUint32(u,A,!0),this.mem.setUint32(u+4,0,!0),u+=8}),u>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(v,g),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(w){let u=this;return function(){let m={id:w,this:this,args:arguments};return u._pendingEvent=m,u._resume(),m.result}}}})(),K=({data:R})=>{let M=new TextDecoder,E=I.fs,w="";E.writeSync=(O,g)=>{if(O===1)J(g);else if(O===2){w+=M.decode(g);let b=w.split(`
`);b.length>1&&console.log(b.slice(0,-1).join(`
`)),w=b[b.length-1]}else throw new Error("Bad write");return g.length};let u=[],m,v=0;K=({data:O})=>(O.length>0&&(u.push(O),m&&m()),j),E.read=(O,g,b,A,r,h)=>{if(O!==0||b!==0||A!==g.length||r!==null)throw new Error("Bad read");if(u.length===0){m=()=>E.read(O,g,b,A,r,h);return}let $=u[0],P=Math.max(0,Math.min(A,$.length-v));g.set($.subarray(v,v+P),b),v+=P,v===$.length&&(u.shift(),v=0),h(null,P)};let j=new I.Go;return j.argv=["","--service=0.25.0"],fe(R,j).then(O=>{J(null),j.run(O)},O=>{J(O)}),j};function fe(R,M){return X(this,null,function*(){if(R instanceof WebAssembly.Module)return WebAssembly.instantiate(R,M.importObject);let E=yield fetch(R);if(!E.ok)throw new Error(`Failed to download ${JSON.stringify(R)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(E.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(E,M.importObject)).instance;let w=yield E.arrayBuffer();return(yield WebAssembly.instantiate(w,M.importObject)).instance})}return R=>K(R)})(J=>p.onmessage({data:J})),ee;p={onmessage:null,postMessage:J=>setTimeout(()=>{try{ee=z({data:J})}catch(X){k(X)}}),terminate(){if(ee)for(let J of ee._scheduledTimeouts.values())clearTimeout(J)}}}let x,D,y=new Promise((z,ee)=>{x=z,D=ee});p.onmessage=({data:z})=>{p.onmessage=({data:ee})=>q(ee),z?D(z):x()},p.postMessage(s||new URL(t,location.href).toString());let{readFromStdout:q,service:Z}=ct({writeToStdin(z){p.postMessage(z)},isSync:!1,hasFS:!1,esbuild:H});yield y,pt=()=>{p.terminate(),We=void 0,pt=void 0,gt=void 0},gt={build:z=>new Promise((ee,J)=>{_.then(J),Z.buildOrContext({callName:"build",refs:null,options:z,isTTY:!1,defaultWD:"/",callback:(X,K)=>X?J(X):ee(K)})}),context:z=>new Promise((ee,J)=>{_.then(J),Z.buildOrContext({callName:"context",refs:null,options:z,isTTY:!1,defaultWD:"/",callback:(X,K)=>X?J(X):ee(K)})}),transform:(z,ee)=>new Promise((J,X)=>{_.then(X),Z.transform({callName:"transform",refs:null,input:z,options:ee||{},isTTY:!1,fs:{readFile(K,I){I(new Error("Internal error"),null)},writeFile(K,I){I(null)}},callback:(K,I)=>K?X(K):J(I)})}),formatMessages:(z,ee)=>new Promise((J,X)=>{_.then(X),Z.formatMessages({callName:"formatMessages",refs:null,messages:z,options:ee,callback:(K,I)=>K?X(K):J(I)})}),analyzeMetafile:(z,ee)=>new Promise((J,X)=>{_.then(X),Z.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof z=="string"?z:JSON.stringify(z),options:ee,callback:(K,I)=>K?X(K):J(I)})})}}),Cn=H})(typeof Pt=="object"?Pt:{set exports(n){(typeof self<"u"?self:this).esbuild=n}})});function Et(n){let e=/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(n.trim());return e?{major:+e[1],minor:+e[2],patch:+e[3],pre:e[4]?e[4].split("."):[]}:null}function ze(n,e){if(n.major!==e.major)return n.major-e.major;if(n.minor!==e.minor)return n.minor-e.minor;if(n.patch!==e.patch)return n.patch-e.patch;if(n.pre.length===0&&e.pre.length===0)return 0;if(n.pre.length===0)return 1;if(e.pre.length===0)return-1;let i=Math.max(n.pre.length,e.pre.length);for(let o=0;o<i;o++){let c=n.pre[o],d=e.pre[o];if(c===void 0)return-1;if(d===void 0)return 1;let f=/^\d+$/.test(c),B=/^\d+$/.test(d);if(f&&B){let N=+c-+d;if(N!==0)return N}else{if(f)return-1;if(B)return 1;if(c!==d)return c<d?-1:1}}return 0}function Wn(n){let e=/^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(n.trim());if(!e)return()=>!1;let i=e[1]||"=",o=e[2].trim();if(o==="*"||o==="")return()=>!0;let c=o.split(".");if(c.some(f=>f==="x"||f==="X"||f==="*")||c.length<3){let f=c[0]===void 0||/[xX*]/.test(c[0])?null:+c[0],B=c[1]===void 0||/[xX*]/.test(c[1])?null:+c[1];return N=>!(f!==null&&N.major!==f||B!==null&&N.minor!==B)}let d=Et(o);if(!d)return()=>!1;switch(i){case"^":return f=>ze(f,d)<0?!1:d.major>0?f.major===d.major:d.minor>0?f.major===0&&f.minor===d.minor:f.major===0&&f.minor===0&&f.patch===d.patch;case"~":return f=>ze(f,d)>=0&&f.major===d.major&&f.minor===d.minor;case">":return f=>ze(f,d)>0;case">=":return f=>ze(f,d)>=0;case"<":return f=>ze(f,d)<0;case"<=":return f=>ze(f,d)<=0;default:return f=>ze(f,d)===0}}function Ln(n){let e=n.trim().split(/\s+/).filter(Boolean).map(Wn);return i=>e.every(o=>o(i))}function Gn(n,e){let i=Et(n);if(!i)return!1;let o=e.trim();return o==="*"||o===""||o==="latest"?!0:o.split("||").some(c=>Ln(c)(i))}function Bt(n,e){let i=/-([0-9A-Za-z.-]+)/.test(e),o=null,c=null;for(let d of n){let f=Et(d);f&&(f.pre.length>0&&!i||Gn(d,e)&&(o===null||ze(f,o)>0)&&(o=f,c=d))}return c}var _e=Uint8Array,qe=Uint16Array,Jn=Int32Array,Vt=new _e([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Wt=new _e([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),qn=new _e([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Lt=function(n,e){for(var i=new qe(31),o=0;o<31;++o)i[o]=e+=1<<n[o-1];for(var c=new Jn(i[30]),o=1;o<30;++o)for(var d=i[o];d<i[o+1];++d)c[d]=d-i[o]<<5|o;return{b:i,r:c}},Gt=Lt(Vt,2),Jt=Gt.b,Zn=Gt.r;Jt[28]=258,Zn[258]=28;var qt=Lt(Wt,0),Hn=qt.b,Ir=qt.r,jt=new qe(32768);for(ie=0;ie<32768;++ie)Re=(ie&43690)>>1|(ie&21845)<<1,Re=(Re&52428)>>2|(Re&13107)<<2,Re=(Re&61680)>>4|(Re&3855)<<4,jt[ie]=((Re&65280)>>8|(Re&255)<<8)>>1;var Re,ie,tt=(function(n,e,i){for(var o=n.length,c=0,d=new qe(e);c<o;++c)n[c]&&++d[n[c]-1];var f=new qe(e);for(c=1;c<e;++c)f[c]=f[c-1]+d[c-1]<<1;var B;if(i){B=new qe(1<<e);var N=15-e;for(c=0;c<o;++c)if(n[c])for(var H=c<<4|n[c],oe=e-n[c],S=f[n[c]-1]++<<oe,G=S|(1<<oe)-1;S<=G;++S)B[jt[S]>>N]=H}else for(B=new qe(o),c=0;c<o;++c)n[c]&&(B[c]=jt[f[n[c]-1]++]>>15-n[c]);return B}),nt=new _e(288);for(ie=0;ie<144;++ie)nt[ie]=8;var ie;for(ie=144;ie<256;++ie)nt[ie]=9;var ie;for(ie=256;ie<280;++ie)nt[ie]=7;var ie;for(ie=280;ie<288;++ie)nt[ie]=8;var ie,Zt=new _e(32);for(ie=0;ie<32;++ie)Zt[ie]=5;var ie;var Yn=tt(nt,9,1);var Xn=tt(Zt,5,1),Tt=function(n){for(var e=n[0],i=1;i<n.length;++i)n[i]>e&&(e=n[i]);return e},Ae=function(n,e,i){var o=e/8|0;return(n[o]|n[o+1]<<8)>>(e&7)&i},_t=function(n,e){var i=e/8|0;return(n[i]|n[i+1]<<8|n[i+2]<<16)>>(e&7)},Kn=function(n){return(n+7)/8|0},Qn=function(n,e,i){return(e==null||e<0)&&(e=0),(i==null||i>n.length)&&(i=n.length),new _e(n.subarray(e,i))};var er=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Ce=function(n,e,i){var o=new Error(e||er[n]);if(o.code=n,Error.captureStackTrace&&Error.captureStackTrace(o,Ce),!i)throw o;return o},tr=function(n,e,i,o){var c=n.length,d=o?o.length:0;if(!c||e.f&&!e.l)return i||new _e(0);var f=!i,B=f||e.i!=2,N=e.i;f&&(i=new _e(c*3));var H=function(ut){var ct=i.length;if(ut>ct){var ft=new _e(Math.max(ct*2,ut));ft.set(i),i=ft}},oe=e.f||0,S=e.p||0,G=e.b||0,te=e.l,he=e.d,we=e.m,ge=e.n,se=c*8;do{if(!te){oe=Ae(n,S,1);var T=Ae(n,S+1,3);if(S+=3,T)if(T==1)te=Yn,he=Xn,we=9,ge=5;else if(T==2){var be=Ae(n,S,31)+257,L=Ae(n,S+10,15)+4,C=be+Ae(n,S+5,31)+1;S+=14;for(var xe=new _e(C),ke=new _e(19),ye=0;ye<L;++ye)ke[qn[ye]]=Ae(n,S+ye*3,7);S+=L*3;for(var Ze=Tt(ke),ae=(1<<Ze)-1,Ee=tt(ke,Ze,1),ye=0;ye<C;){var at=Ee[Ae(n,S,ae)];S+=at&15;var ne=at>>4;if(ne<16)xe[ye++]=ne;else{var Ie=0,Ne=0;for(ne==16?(Ne=3+Ae(n,S,3),S+=2,Ie=xe[ye-1]):ne==17?(Ne=3+Ae(n,S,7),S+=3):ne==18&&(Ne=11+Ae(n,S,127),S+=7);Ne--;)xe[ye++]=Ie}}var He=xe.subarray(0,be),Oe=xe.subarray(be);we=Tt(He),ge=Tt(Oe),te=tt(He,we,1),he=tt(Oe,ge,1)}else Ce(1);else{var ne=Kn(S)+4,me=n[ne-4]|n[ne-3]<<8,ve=ne+me;if(ve>c){N&&Ce(0);break}B&&H(G+me),i.set(n.subarray(ne,ve),G),e.b=G+=me,e.p=S=ve*8,e.f=oe;continue}if(S>se){N&&Ce(0);break}}B&&H(G+131072);for(var kt=(1<<we)-1,lt=(1<<ge)-1,Ye=S;;Ye=S){var Ie=te[_t(n,S)&kt],l=Ie>>4;if(S+=Ie&15,S>se){N&&Ce(0);break}if(Ie||Ce(2),l<256)i[G++]=l;else if(l==256){Ye=S,te=null;break}else{var ce=l-254;if(l>264){var ye=l-257,Be=Vt[ye];ce=Ae(n,S,(1<<Be)-1)+Jt[ye],S+=Be}var Le=he[_t(n,S)&lt],Fe=Le>>4;Le||Ce(3),S+=Le&15;var Oe=Hn[Fe];if(Fe>3){var Be=Wt[Fe];Oe+=_t(n,S)&(1<<Be)-1,S+=Be}if(S>se){N&&Ce(0);break}B&&H(G+131072);var de=G+ce;if(G<Oe){var Xe=d-Oe,St=Math.min(Oe,de);for(Xe+G<0&&Ce(3);G<St;++G)i[G]=o[Xe+G]}for(;G<de;++G)i[G]=i[G-Oe]}}e.l=te,e.p=Ye,e.b=G,e.f=oe,te&&(oe=1,e.m=we,e.d=he,e.n=ge)}while(!oe);return G!=i.length&&f?Qn(i,0,G):i.subarray(0,G)};var nr=new _e(0);var rr=function(n){(n[0]!=31||n[1]!=139||n[2]!=8)&&Ce(6,"invalid gzip data");var e=n[3],i=10;e&4&&(i+=(n[10]|n[11]<<8)+2);for(var o=(e>>3&1)+(e>>4&1);o>0;o-=!n[i++]);return i+(e&2)},ir=function(n){var e=n.length;return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0};function Ht(n,e){var i=rr(n);return i+8>n.length&&Ce(6,"invalid gzip data"),tr(n.subarray(i,-8),{i:2},e&&e.out||new _e(ir(n)),e&&e.dictionary)}var sr=typeof TextDecoder<"u"&&new TextDecoder,or=0;try{sr.decode(nr,{stream:!0}),or=1}catch{}function ar(n){let e=/^sha512-(.+)$/.exec(n.trim());return e?e[1]:null}async function lr(n){let e=await crypto.subtle.digest("SHA-512",n),i=new Uint8Array(e),o="";for(let c of i)o+=String.fromCharCode(c);return btoa(o)}async function Yt(n,e){let i=ar(e);return i?await lr(n)===i:!1}function mt(n,e,i){let o=e,c=Math.min(e+i,n.length);for(;o<c&&n[o]!==0;)o++;let d="";for(let f=e;f<o;f++)d+=String.fromCharCode(n[f]);return d}function ur(n,e,i){let o=mt(n,e,i).trim();return o&&parseInt(o,8)||0}function cr(n){let e=[],i=0,o=null;for(;i+512<=n.length;){let c=n.subarray(i,i+512);if(c.every(S=>S===0))break;let d=mt(c,0,100),f=mt(c,345,155);f&&(d=f+"/"+d),o&&(d=o,o=null);let B=ur(c,124,12),N=String.fromCharCode(c[156]),H=i+512,oe=Math.ceil(B/512)*512;if(N==="L")o=mt(n,H,B).replace(/\0+$/,"");else if(N==="0"||N==="\0"||N===""){let S=d.replace(/^package\//,"");S&&!S.endsWith("/")&&e.push({name:S,data:n.slice(H,H+B)})}i=H+oe}return e}function Xt(n){return cr(Ht(n))}function Kt(n){if(n.startsWith("/")||n.includes("\0"))return!1;let e=n.split("/"),i=0;for(let o of e)if(o===".."){if(i--,i<0)return!1}else o!=="."&&o!==""&&i++;return!0}var fr=["install","postinstall","preinstall","prepare"];function Qt(n,e){let i=n.name??"package";if(n.gypfile===!0)return`${i} \u4F7F\u7528 node-gyp \u539F\u751F\u7F16\u8BD1`;if(e.some(c=>c==="binding.gyp"||c.endsWith("/binding.gyp")))return`${i} \u542B binding.gyp \u539F\u751F\u6A21\u5757`;if(n.binary)return`${i} \u9700\u4E0B\u8F7D\u539F\u751F\u4E8C\u8FDB\u5236\uFF08node-pre-gyp\uFF09`;let o=n.scripts??{};for(let c of fr){let d=o[c];if(d&&/node-gyp|prebuild|node-pre-gyp|cmake|make\b|\.node\b/.test(d))return`${i} \u7684 ${c} \u811A\u672C\u9700\u539F\u751F\u6784\u5EFA`}return null}var en="\u8BE5\u5305\u9700\u8981\u539F\u751F\u6784\u5EFA\uFF0CWebView \u8FD0\u884C\u65F6\u4E0D\u652F\u6301\u3002\u8BF7\u6539\u7528 wasm \u53D8\u4F53\uFF08\u5982 esbuild-wasm\u3001@rollup/wasm-node\uFF09\uFF0C\u6216\u79FB\u9664\u8BE5\u4F9D\u8D56\u3002";var tn="https://registry.npmjs.org";async function nn(n,e,i,o){var H,oe;let c={},d={},f=Object.entries(n).map(([S,G])=>({name:S,range:G})),B=0,N=new Set;for(;f.length;){let{name:S,range:G}=f.shift();if(!N.has(S)){N.add(S),o.progress(Math.min(.95,B/Math.max(1,B+f.length+1)),`\u5B89\u88C5 ${S}`);try{let te=await e.fetch(`${tn}/${encodeURIComponent(S)}`),he=JSON.parse(new TextDecoder().decode(te)),we=Object.keys(he.versions??{}),ge=Bt(we,G);if(!ge)return{ok:!1,installed:c,lock:d,error:`${S}@${G} \u6CA1\u6709\u5339\u914D\u7684\u7248\u672C`};let se=he.versions[ge],T=((H=se.dist)==null?void 0:H.integrity)??"",ne=((oe=se.dist)==null?void 0:oe.tarball)??`${tn}/${S}/-/${S}-${ge}.tgz`,me=await e.fetch(ne,T);if(T&&!await Yt(me,T))return{ok:!1,installed:c,lock:d,error:`${S}@${ge} \u5B8C\u6574\u6027\u6821\u9A8C\u5931\u8D25`};let ve=Xt(me),be=Qt(se,ve.map(L=>L.name));if(be)return{ok:!1,installed:c,lock:d,error:`${be}\u3002${en}`};for(let L of ve)Kt(L.name)&&i.write(`node_modules/${S}/${L.name}`,L.data);c[S]=ge,d[S]={version:ge,integrity:T},B++;for(let[L,C]of Object.entries(se.dependencies??{}))N.has(L)||f.push({name:L,range:C})}catch(te){return{ok:!1,installed:c,lock:d,error:`\u5B89\u88C5 ${S} \u5931\u8D25\uFF1A${String(te)}`}}}}return i.writeText("package-lock.json",JSON.stringify({lockfileVersion:3,packages:d},null,2)),o.progress(1,"\u5B89\u88C5\u5B8C\u6210"),{ok:!0,installed:c,lock:d}}function De(n){if(n.includes("\0"))return null;let e=n.replace(/\\/g,"/").split("/"),i=[];for(let o of e)if(!(o===""||o==="."))if(o===".."){if(i.length===0)return null;i.pop()}else i.push(o);return i.join("/")}var vt=class{constructor(){this.files=new Map}write(e,i){let o=De(e);return o===null?!1:(this.files.set(o,i),!0)}writeText(e,i){return this.write(e,new TextEncoder().encode(i))}read(e){let i=De(e);return i===null?null:this.files.get(i)??null}readText(e){let i=this.read(e);return i?new TextDecoder().decode(i):null}exists(e){let i=De(e);return i!==null&&this.files.has(i)}delete(e){let i=De(e);i!==null&&this.files.delete(i)}evictPrefix(e){let i=De(e);if(i===null)return 0;let o=0;for(let c of[...this.files.keys()])(c===i||c.startsWith(i+"/"))&&(this.files.delete(c),o++);return o}list(e=""){let i=De(e)??"";return[...this.files.keys()].filter(o=>i===""||o===i||o.startsWith(i+"/")).sort()}get size(){return this.files.size}};var bt=Vn(rn(),1);var rt=null;function it(){return typeof window<"u"&&window.VueCompilerSFC?Promise.resolve(window.VueCompilerSFC):rt||(rt=new Promise((n,e)=>{let i=document.createElement("script");i.src="vue-compiler.js",i.onload=()=>{let o=window.VueCompilerSFC;o?n(o):e(new Error("Vue \u7F16\u8BD1\u5668\u52A0\u8F7D\u540E\u4E0D\u53EF\u7528"))},i.onerror=()=>{rt=null,e(new Error("Vue \u7F16\u8BD1\u5668\u52A0\u8F7D\u5931\u8D25\uFF08vue-compiler.js\uFF09"))},document.head.appendChild(i)}),rt)}function wt(n){let e=2166136261;for(let i=0;i<n.length;i++)e^=n.charCodeAt(i),e=Math.imul(e,16777619)>>>0;return"data-v-"+e.toString(16).padStart(8,"0")}function yt(n){return typeof n=="string"?n:(n==null?void 0:n.message)??String(n)}async function sn(n,e,i){var te,he,we,ge;let o=i??await it(),c=wt(e).replace(/^data-v-/,""),d=wt(e),{descriptor:f,errors:B}=o.parse(n,{filename:e});if(B.length)throw new Error(`${e}: ${yt(B[0])}`);let N=((te=f.script)==null?void 0:te.lang)==="ts"||((he=f.scriptSetup)==null?void 0:he.lang)==="ts"||((we=f.script)==null?void 0:we.lang)==="tsx"||((ge=f.scriptSetup)==null?void 0:ge.lang)==="tsx",H={compilerOptions:{expressionPlugins:N?["typescript"]:[]}},oe=f.styles.some(se=>se.scoped),S;if(f.script||f.scriptSetup){if(S=o.compileScript(f,{id:c,inlineTemplate:!0,genDefaultAs:"_sfc_main",templateOptions:H}).content,!f.scriptSetup&&f.template){let T=o.compileTemplate({source:f.template.content,filename:e,id:c,compilerOptions:{...H.compilerOptions,bindingMetadata:void 0}});if(T.errors.length)throw new Error(`${e}: ${yt(T.errors[0])}`);S+=`
`+T.code.replace("export function render","function _sfc_render"),S+=`
_sfc_main.render = _sfc_render;`}}else if(f.template){let se=o.compileTemplate({source:f.template.content,filename:e,id:c});if(se.errors.length)throw new Error(`${e}: ${yt(se.errors[0])}`);S=se.code.replace("export function render","function _sfc_render"),S+=`
const _sfc_main = { render: _sfc_render };`}else S="const _sfc_main = {};";oe&&(S+=`
_sfc_main.__scopeId = ${JSON.stringify(d)};`),S+=`
export default _sfc_main;`;let G=[];for(let se of f.styles){let T=await o.compileStyleAsync({source:se.content,filename:e,id:d,scoped:!!se.scoped});if(T.errors.length)throw new Error(`${e}: ${yt(T.errors[0])}`);G.push(T.code)}return G.length&&(S+=`
{const __sfc_css = ${JSON.stringify(G.join(`
`))};const __sfc_el = document.createElement("style");__sfc_el.textContent = __sfc_css;document.head.appendChild(__sfc_el);}`),{code:S,loader:N?"ts":"js"}}var on=!1;async function an(n){on||(await bt.initialize({wasmURL:n,worker:!1}),on=!0)}var hr={".js":"js",".mjs":"js",".cjs":"js",".jsx":"jsx",".ts":"ts",".tsx":"tsx",".css":"css",".json":"json",".txt":"text",".svg":"text"};function dr(n){let e=n.lastIndexOf(".");return hr[e>=0?n.slice(e):""]??"js"}function pr(n,e,i){let o=(d,f)=>{let B=(d?d.split("/"):[]).concat(f.split("/")),N=[];for(let H of B)H===""||H==="."||(H===".."?N.pop():N.push(H));return N.join("/")},c=[];if(i.startsWith(".")||i.startsWith("/")){let d=i.startsWith("/")?"":e.split("/").slice(0,-1).join("/"),f=i.startsWith("/")?i.slice(1):o(d,i);c.push(f,f+".js",f+".jsx",f+".ts",f+".tsx",f+".vue",f+".json",f+"/index.js")}else{let d="node_modules/"+i,f=n.readText(d+"/package.json");if(f)try{let B=JSON.parse(f),N=B.module||B.main||"index.js";c.push(o(d,N))}catch{c.push(d+"/index.js")}c.push(d+"/index.js",d+".js")}for(let d of c)if(n.exists(d))return d;return null}function gr(n){return{name:"wvi-memfs",setup(e){e.onResolve({filter:/.*/},i=>{if(i.kind==="entry-point")return{path:i.path,namespace:"wvi"};let o=pr(n,i.importer,i.path);return o?{path:o,namespace:"wvi"}:{path:i.path,namespace:"wvi"}}),e.onLoad({filter:/.*/,namespace:"wvi"},async i=>{let o=n.read(i.path);if(!o)return{errors:[{text:"\u627E\u4E0D\u5230\u6A21\u5757 "+i.path}]};if(i.path.endsWith(".vue"))try{let c=await sn(new TextDecoder().decode(o),i.path);return{contents:c.code,loader:c.loader}}catch(c){return{errors:[{text:String((c==null?void 0:c.message)??c)}]}}return{contents:o,loader:dr(i.path)}})}}}async function ln(n,e){return((await bt.build({entryPoints:[e],bundle:!0,minify:!0,write:!1,outdir:"dist",format:"iife",target:["chrome90"],plugins:[gr(n)],define:{"process.env.NODE_ENV":'"production"',__VUE_OPTIONS_API__:"true",__VUE_PROD_DEVTOOLS__:"false",__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:"false"},logLevel:"silent"})).outputFiles??[]).map(o=>({path:o.path.replace(/^\/?dist\//,""),contents:o.contents}))}var st=null;function un(n){return window.ts?Promise.resolve(window.ts):st||(st=new Promise((e,i)=>{let o=document.createElement("script");o.src=n.replace(/\/?$/,"/")+"typescript.js",o.onload=()=>window.ts?e(window.ts):i(new Error("TypeScript \u52A0\u8F7D\u540E\u4E0D\u53EF\u7528")),o.onerror=()=>{st=null,i(new Error("TypeScript \u52A0\u8F7D\u5931\u8D25"))},document.head.appendChild(o)}),st)}var mr=`declare module "*.vue" {
  const component: any;
  export default component;
}
`,vr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";function yr(n){let e=[],i=0,o=0,c=0;for(let d of n.split(";")){let f=[],B=0;for(let N of d.split(",")){if(!N)continue;let H=[],oe=0,S=0;for(let G of N){let te=vr.indexOf(G);if(te<0)break;if(S+=(te&31)*Math.pow(2,oe),te&32)oe+=5;else{let he=S&1;S=Math.floor(S/2),H.push(he?-S:S),oe=0,S=0}}H.length!==0&&(B+=H[0],H.length>=4&&(i+=H[1],o+=H[2],c+=H[3],f.push([B,i,o,c])))}e.push(f)}return e}function wr(n,e,i){let c=yr(n.mappings)[e];if(!c||c.length===0)return null;let d=null;for(let f of c)f[0]<=i&&(d===null||f[0]>=d[0])&&(d=f);return d?{line:d[2],col:d[3]}:null}async function cn(n,e,i,o){let c=i??window.ts;if(!c)throw new Error("TypeScript \u672A\u52A0\u8F7D");let d=new Map;for(let T of n.list()){if(T.startsWith("dist/"))continue;let ne=n.readText(T);ne!==null&&d.set("/"+T,ne)}d.set("/__wvi_libs.d.ts",e);let f=[],B=new Map,N=n.list("src").filter(T=>T.endsWith(".vue")),H=0,oe=0,S=d.has("/node_modules/vue/package.json");if(N.length>0&&!S&&f.push("\u672A\u5B89\u88C5 vue \u4F9D\u8D56\uFF0C.vue \u5185\u90E8\u672A\u68C0\u67E5\uFF08\u5148\u300C\u5B89\u88C5\u4F9D\u8D56\u300D\uFF09"),N.length>0&&S){let T=o??await it();for(let ne of N){let me=n.readText(ne);if(me===null)continue;let{descriptor:ve,errors:be}=T.parse(me,{filename:ne});if(be.length){f.push(`${ne}: \u89E3\u6790\u5931\u8D25\uFF0C\u8DF3\u8FC7\u5185\u90E8\u68C0\u67E5`);continue}let L=ve.scriptSetup??ve.script;if(!L||L.lang!=="ts"&&L.lang!=="tsx"){oe++;continue}let C=wt(ne).replace(/^data-v-/,""),xe=T.compileScript(ve,{id:C,inlineTemplate:!0,genDefaultAs:"_sfc_main",templateOptions:{compilerOptions:{expressionPlugins:["typescript"]}}}),ke=xe.content.replace(/setup\(__props\)/g,"setup(__props: any)")+`
export default _sfc_main;
`;d.set("/"+ne+".ts",ke);let ye=xe.map;ye&&ye.mappings&&B.set("/"+ne+".ts",ye),H++}oe>0&&f.push(`${oe} \u4E2A js/\u65E0\u811A\u672C SFC \u672A\u68C0\u67E5\uFF08\u4EC5\u652F\u6301 lang="ts"\uFF09`)}d.set("/__wvi_vue_shim.d.ts",mr);let G=[...d.keys()].filter(T=>(T.endsWith(".ts")||T.endsWith(".tsx"))&&!T.endsWith(".d.ts")&&!T.includes("/node_modules/")&&T!=="/__wvi_libs.d.ts");if(G.length===0)return{ok:!0,errors:[],checkedFiles:0,notes:f};let te={target:c.ScriptTarget.ES2020,module:c.ModuleKind.ESNext,moduleResolution:c.ModuleResolutionKind.Bundler??c.ModuleResolutionKind.Node10,jsx:c.JsxEmit.ReactJSX,strict:!0,noEmit:!0,skipLibCheck:!0,allowJs:!1,types:[]},he={getSourceFile:(T,ne)=>{let me=T.startsWith("/")?T:"/"+De(T),ve=d.get(me??T);if(ve!==void 0)return c.createSourceFile(T,ve,ne,!0)},writeFile:()=>{},getDefaultLibFileName:()=>"/__wvi_libs.d.ts",useCaseSensitiveFileNames:()=>!0,getCanonicalFileName:T=>T,getCurrentDirectory:()=>"/",getNewLine:()=>`
`,fileExists:T=>d.has(T.startsWith("/")?T:"/"+De(T)),readFile:T=>d.get(T.startsWith("/")?T:"/"+De(T)),directoryExists:T=>{let ne=T.endsWith("/")?T:T+"/";for(let me of d.keys())if(me.startsWith(ne))return!0;return!1},getDirectories:()=>[]},we=c.createProgram([...G,"/__wvi_vue_shim.d.ts","/__wvi_libs.d.ts"],te,he),ge=[...we.getSemanticDiagnostics(),...we.getSyntacticDiagnostics()],se=[];for(let T of ge){let ne=c.flattenDiagnosticMessageText(T.messageText,`
`);if(T.file&&typeof T.start=="number"){let{line:me,character:ve}=T.file.getLineAndCharacterOfPosition(T.start),be=T.file.fileName.replace(/^\//,""),L=me+1,C=ve+1,xe=B.get(T.file.fileName);if(xe){be=be.replace(/\.ts$/,"");let ke=wr(xe,me,ve);ke&&(L=ke.line+1,C=ke.col+1)}se.push(`${be}:${L}:${C} ${ne}`)}else se.push(ne)}return{ok:se.length===0,errors:se,checkedFiles:G.length,notes:f}}function ue(n,e,i){var o;(o=window.WviBuild)==null||o.post(JSON.stringify({id:i??0,type:n,payload:e}))}var Se=new vt,$t=new Map,br=0,At=new Map,xr=0;function fn(n,e){return new Promise(i=>{let o=++xr;At.set(o,i),ue("fsWrite",{path:n,text:e},o)})}var Ct=new Map,kr=0;function Sr(n){return new Promise(e=>{let i=++kr;Ct.set(i,e),ue("fsRead",{path:n},i)})}function dn(n){let e=atob(n),i=new Uint8Array(e.length);for(let o=0;o<e.length;o++)i[o]=e.charCodeAt(o);return i}function Er(n){let e="";for(let i=0;i<n.length;i++)e+=String.fromCharCode(n[i]);return btoa(e)}var Ot=new Map,Tr=0;function Ut(n){return new Promise(e=>{let i=++Tr;Ot.set(i,o=>e(o===null?null:dn(o))),ue("readSource",{path:n},i)})}var Dt=new Map,_r=0;function Mt(){return new Promise(n=>{let e=++_r;Dt.set(e,n),ue("listSource",{},e)})}var Rt=new Map,jr=0;function hn(n,e){return new Promise(i=>{let o=++jr;Rt.set(o,i),ue("writeDist",{path:n,b64:Er(e)},o)})}var xt="",ot="";async function Pr(n){for(let d=0;d<600&&!ot;d++)await new Promise(f=>setTimeout(f,100));if(!ot){ue("tcdone",{ok:!1,summary:"TypeScript \u672A\u5C31\u7EEA"},n);return}je.progress(.2,"\u52A0\u8F7D\u7C7B\u578B\u68C0\u67E5\u5668");let e=await un(ot),i=await(await fetch(ot.replace(/\/?$/,"/")+"libs.d.ts")).text();je.progress(.4,"\u8BFB\u53D6\u6E90\u6587\u4EF6");let o=await Mt();for(let d of o){if(d.startsWith("dist/"))continue;let f=await Ut(d);f&&Se.write(d,f)}je.progress(.6,"tsc \u7C7B\u578B\u68C0\u67E5\uFF08.ts/.tsx + ts SFC\uFF09");let c=await cn(Se,i,e);for(let d of c.notes)je.log("warn",d);for(let d of c.errors.slice(0,100))je.log("error",d);je.progress(1,"\u7C7B\u578B\u68C0\u67E5\u5B8C\u6210"),ue("tcdone",{ok:c.ok,summary:c.checkedFiles===0?"\u6CA1\u6709\u53EF\u68C0\u67E5\u7684 TS \u6587\u4EF6\uFF08.ts/.tsx \u6216 lang=ts \u7684 .vue\uFF09":c.ok?`\u7C7B\u578B\u68C0\u67E5\u901A\u8FC7\uFF08${c.checkedFiles} \u4E2A\u6587\u4EF6\uFF09`:`\u53D1\u73B0 ${c.errors.length} \u4E2A\u7C7B\u578B\u9519\u8BEF\uFF08\u4E0D\u5F71\u54CD\u6784\u5EFA\uFF09`},n)}var $r={fetch(n,e){return new Promise(i=>{let o=++br;$t.set(o,i),ue("net",{url:n,method:"GET",integrity:e??""},o)})}},je={log(n,e){ue("log",{level:n,text:e})},progress(n,e){ue("progress",{fraction:n,label:e})}};async function Ar(n){let e=Se.readText("package.json");if(e||(e=await Sr("package.json"),e&&Se.writeText("package.json",e)),!e){ue("done",{ok:!1,summary:"\u7F3A\u5C11 package.json"},n);return}let i=JSON.parse(e),o=await nn(i.dependencies??{},$r,Se,je);if(o.ok){let c=Se.list("node_modules"),d=0;for(let B of c){let N=Se.readText(B);N!==null&&await fn(B,N)&&d++}let f=Se.readText("package-lock.json");f!==null&&await fn("package-lock.json",f),Se.evictPrefix("node_modules"),je.log("info",`\u5DF2\u5199\u76D8 ${d} \u4E2A\u4F9D\u8D56\u6587\u4EF6`),ue("done",{ok:!0,summary:`\u5DF2\u5B89\u88C5 ${Object.keys(o.installed).length} \u4E2A\u5305`},n)}else ue("error",{message:o.error??"\u5B89\u88C5\u5931\u8D25"},n),ue("done",{ok:!1,summary:o.error??"\u5B89\u88C5\u5931\u8D25"},n)}async function Cr(){for(let n=0;n<600&&!xt;n++)await new Promise(e=>setTimeout(e,100));return!!xt}async function Or(n){if(!await Cr()){ue("done",{ok:!1,summary:"esbuild wasm \u672A\u5C31\u7EEA"},n);return}je.progress(.1,"\u52A0\u8F7D\u6E90\u6587\u4EF6");let e=await Mt();for(let f of e){if(f.startsWith("dist/")||f.startsWith("node_modules/"))continue;let B=await Ut(f);B&&Se.write(f,B)}let i=await Mt();for(let f of i){if(!f.startsWith("node_modules/"))continue;let B=await Ut(f);B&&Se.write(f,B)}let o=["src/main.tsx","src/main.jsx","src/main.ts","src/main.js","main.js","index.js"].find(f=>Se.exists(f));if(!o){ue("done",{ok:!1,summary:"\u627E\u4E0D\u5230\u5165\u53E3\uFF08src/main.* \u6216 index.js\uFF09"},n);return}Se.list("src").some(f=>f.endsWith(".vue"))&&(je.progress(.3,"\u52A0\u8F7D Vue \u7F16\u8BD1\u5668"),await it()),je.progress(.4,"esbuild \u6253\u5305\uFF08TS/JSX \u4EC5\u8F6C\u8BD1\uFF0C\u4E0D\u505A\u7C7B\u578B\u68C0\u67E5\uFF09"),await an(xt);let c=await ln(Se,o);je.progress(.8,"\u5199\u51FA dist");for(let f of c)await hn("dist/"+f.path,f.contents);let d=Se.readText("index.html");d&&await hn("dist/index.html",new TextEncoder().encode(d)),je.progress(1,"\u6784\u5EFA\u5B8C\u6210"),ue("done",{ok:!0,summary:`\u6784\u5EFA\u5B8C\u6210\uFF0C${c.length} \u4E2A\u4EA7\u7269`},n)}function Ur(n){let e=n.id??0,i=n.payload??{};switch(n.type){case"install":Ar(e);break;case"build":Or(e).catch(o=>{ue("error",{message:String(o)},e),ue("done",{ok:!1,summary:String(o)},e)});break;case"wasmUrl":xt=String(i.url??"");break;case"tsUrl":ot=String(i.url??"");break;case"typecheck":Pr(e).catch(o=>{ue("error",{message:String(o)},e),ue("tcdone",{ok:!1,summary:String(o)},e)});break;case"cancel":ue("done",{ok:!1,summary:"cancelled"},e);break;case"netResponse":{let o=$t.get(e);o&&($t.delete(e),o(dn(String(i.body??""))));break}case"fsWriteResponse":{let o=At.get(e);o&&(At.delete(e),o(!!i.ok));break}case"fsReadResponse":{let o=Ct.get(e);o&&(Ct.delete(e),o(i.exists?String(i.text??""):null));break}case"readSourceResponse":{let o=Ot.get(e);o&&(Ot.delete(e),o(i.exists?String(i.b64??""):null));break}case"listSourceResponse":{let o=Dt.get(e);o&&(Dt.delete(e),o(Array.isArray(i.paths)?i.paths:[]));break}case"writeDistResponse":{let o=Rt.get(e);o&&(Rt.delete(e),o(!!i.ok));break}default:break}}window.__wviBuildReceive=n=>{try{Ur(JSON.parse(n))}catch(e){ue("error",{message:String(e)})}};var Dr=0;function pn(){if(window.WviBuild){ue("ready",{});return}++Dr<100&&setTimeout(pn,50)}pn();})();

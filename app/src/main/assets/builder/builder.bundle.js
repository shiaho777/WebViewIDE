"use strict";(()=>{var Rn=Object.create;var zt=Object.defineProperty;var Mn=Object.getOwnPropertyDescriptor;var In=Object.getOwnPropertyNames;var Fn=Object.getPrototypeOf,zn=Object.prototype.hasOwnProperty;var Nn=(n,e)=>()=>(e||n((e={exports:{}}).exports,e),e.exports);var Bn=(n,e,s,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let c of In(e))!zn.call(n,c)&&c!==s&&zt(n,c,{get:()=>e[c],enumerable:!(o=Mn(e,c))||o.enumerable});return n};var Vn=(n,e,s)=>(s=n!=null?Rn(Fn(n)):{},Bn(e||!n||!n.__esModule?zt(s,"default",{value:n,enumerable:!0}):s,n));var nn=Nn((Gr,_t)=>{(n=>{"use strict";var e=Object.defineProperty,s=Object.getOwnPropertyDescriptor,o=Object.getOwnPropertyNames,c=Object.prototype.hasOwnProperty,x=(t,i)=>{for(var a in i)e(t,a,{get:i[a],enumerable:!0})},h=(t,i,a,d)=>{if(i&&typeof i=="object"||typeof i=="function")for(let S of o(i))!c.call(t,S)&&S!==a&&e(t,S,{get:()=>i[S],enumerable:!(d=s(i,S))||d.enumerable});return t},W=t=>h(e({},"__esModule",{value:!0}),t),B=(t,i,a)=>new Promise((d,S)=>{var T=y=>{try{O(a.next(y))}catch(G){S(G)}},k=y=>{try{O(a.throw(y))}catch(G){S(G)}},O=y=>y.done?d(y.value):Promise.resolve(y.value).then(T,k);O((a=a.apply(t,i)).next())}),re={};x(re,{analyzeMetafile:()=>Sn,analyzeMetafileSync:()=>jn,build:()=>wn,buildSync:()=>En,context:()=>bn,default:()=>Cn,formatMessages:()=>kn,formatMessagesSync:()=>_n,initialize:()=>$n,stop:()=>Pn,transform:()=>xn,transformSync:()=>Tn,version:()=>yn}),n.exports=W(re);function ae(t){let i=d=>{if(d===null)a.write8(0);else if(typeof d=="boolean")a.write8(1),a.write8(+d);else if(typeof d=="number")a.write8(2),a.write32(d|0);else if(typeof d=="string")a.write8(3),a.write(ee(d));else if(d instanceof Uint8Array)a.write8(4),a.write(d);else if(d instanceof Array){a.write8(5),a.write32(d.length);for(let S of d)i(S)}else{let S=Object.keys(d);a.write8(6),a.write32(S.length);for(let T of S)a.write(ee(T)),i(d[T])}},a=new V;return a.write32(0),a.write32(t.id<<1|+!t.isRequest),i(t.value),fe(a.buf,a.len-4,0),a.buf.subarray(0,a.len)}function g(t){let i=()=>{switch(a.read8()){case 0:return null;case 1:return!!a.read8();case 2:return a.read32();case 3:return ce(a.read());case 4:return a.read();case 5:{let k=a.read32(),O=[];for(let y=0;y<k;y++)O.push(i());return O}case 6:{let k=a.read32(),O={};for(let y=0;y<k;y++)O[ce(a.read())]=i();return O}default:throw new Error("Invalid packet")}},a=new V(t),d=a.read32(),S=(d&1)===0;d>>>=1;let T=i();if(a.ptr!==t.length)throw new Error("Invalid packet");return{id:d,isRequest:S,value:T}}var V=class{constructor(t=new Uint8Array(1024)){this.buf=t,this.len=0,this.ptr=0}_write(t){if(this.len+t>this.buf.length){let i=new Uint8Array((this.len+t)*2);i.set(this.buf),this.buf=i}return this.len+=t,this.len-t}write8(t){let i=this._write(1);this.buf[i]=t}write32(t){let i=this._write(4);fe(this.buf,t,i)}write(t){let i=this._write(4+t.length);fe(this.buf,t.length,i),this.buf.set(t,i+4)}_read(t){if(this.ptr+t>this.buf.length)throw new Error("Invalid packet");return this.ptr+=t,this.ptr-t}read8(){return this.buf[this._read(1)]}read32(){return pe(this.buf,this._read(4))}read(){let t=this.read32(),i=new Uint8Array(t),a=this._read(i.length);return i.set(this.buf.subarray(a,a+t)),i}},ee,ce,ge;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let t=new TextEncoder,i=new TextDecoder;ee=a=>t.encode(a),ce=a=>i.decode(a),ge='new TextEncoder().encode("")'}else if(typeof Buffer<"u")ee=t=>Buffer.from(t),ce=t=>{let{buffer:i,byteOffset:a,byteLength:d}=t;return Buffer.from(i,a,d).toString()},ge='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(ee("")instanceof Uint8Array))throw new Error(`Invariant violation: "${ge} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function pe(t,i){return t[i++]|t[i++]<<8|t[i++]<<16|t[i++]<<24}function fe(t,i,a){t[a++]=i,t[a++]=i>>8,t[a++]=i>>16,t[a++]=i>>24}var q=JSON.stringify,me="warning",Ue="silent";function De(t){if(he(t,"target"),t.indexOf(",")>=0)throw new Error(`Invalid target: ${t}`);return t}var Te=()=>null,Z=t=>typeof t=="boolean"?null:"a boolean",U=t=>typeof t=="string"?null:"a string",Pe=t=>t instanceof RegExp?null:"a RegExp object",$e=t=>typeof t=="number"&&t===(t|0)?null:"an integer",ye=t=>typeof t=="number"&&t===(t|0)&&t>=0&&t<=65535?null:"a valid port number",Ze=t=>typeof t=="function"?null:"a function",ie=t=>Array.isArray(t)?null:"an array",we=t=>typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"an object",ot=t=>typeof t=="object"&&t!==null?null:"an array or an object",Ie=t=>t instanceof WebAssembly.Module?null:"a WebAssembly.Module",Ne=t=>typeof t=="object"&&!Array.isArray(t)?null:"an object or null",He=t=>typeof t=="string"||typeof t=="boolean"?null:"a string or a boolean",Ae=t=>typeof t=="string"||typeof t=="object"&&t!==null&&!Array.isArray(t)?null:"a string or an object",bt=t=>typeof t=="string"||Array.isArray(t)?null:"a string or an array",at=t=>typeof t=="string"||t instanceof Uint8Array?null:"a string or a Uint8Array",Ye=t=>typeof t=="string"||t instanceof URL?null:"a string or a URL";function l(t,i,a,d){let S=t[a];if(i[a+""]=!0,S===void 0)return;let T=d(S);if(T!==null)throw new Error(`${q(a)} must be ${T}`);return S}function le(t,i,a){for(let d in t)if(!(d in i))throw new Error(`Invalid option ${a}: ${q(d)}`)}function Be(t){let i=Object.create(null),a=l(t,i,"wasmURL",Ye),d=l(t,i,"wasmModule",Ie),S=l(t,i,"worker",Z);return le(t,i,"in initialize() call"),{wasmURL:a,wasmModule:d,worker:S}}function Le(t){let i;if(t!==void 0){i=Object.create(null);for(let a in t){let d=t[a];if(typeof d=="string"||d===!1)i[a]=d;else throw new Error(`Expected ${q(a)} in mangle cache to map to either a string or false`)}}return i}function Fe(t,i,a,d,S){let T=l(i,a,"color",Z),k=l(i,a,"logLevel",U),O=l(i,a,"logLimit",$e);T!==void 0?t.push(`--color=${T}`):d&&t.push("--color=true"),t.push(`--log-level=${k||S}`),t.push(`--log-limit=${O||0}`)}function he(t,i,a){if(typeof t!="string")throw new Error(`Expected value for ${i}${a!==void 0?" "+q(a):""} to be a string, got ${typeof t} instead`);return t}function Xe(t,i,a){let d=l(i,a,"legalComments",U),S=l(i,a,"sourceRoot",U),T=l(i,a,"sourcesContent",Z),k=l(i,a,"target",bt),O=l(i,a,"format",U),y=l(i,a,"globalName",U),G=l(i,a,"mangleProps",Pe),J=l(i,a,"reserveProps",Pe),F=l(i,a,"mangleQuoted",Z),Q=l(i,a,"minify",Z),L=l(i,a,"minifySyntax",Z),Y=l(i,a,"minifyWhitespace",Z),X=l(i,a,"minifyIdentifiers",Z),M=l(i,a,"lineLimit",$e),ue=l(i,a,"drop",ie),R=l(i,a,"dropLabels",ie),D=l(i,a,"charset",U),E=l(i,a,"treeShaking",Z),w=l(i,a,"ignoreAnnotations",Z),u=l(i,a,"jsx",U),m=l(i,a,"jsxFactory",U),v=l(i,a,"jsxFragment",U),_=l(i,a,"jsxImportSource",U),A=l(i,a,"jsxDev",Z),p=l(i,a,"jsxSideEffects",Z),b=l(i,a,"define",we),$=l(i,a,"logOverride",we),r=l(i,a,"supported",we),f=l(i,a,"pure",ie),P=l(i,a,"keepNames",Z),j=l(i,a,"platform",U),I=l(i,a,"tsconfigRaw",Ae);if(d&&t.push(`--legal-comments=${d}`),S!==void 0&&t.push(`--source-root=${S}`),T!==void 0&&t.push(`--sources-content=${T}`),k&&(Array.isArray(k)?t.push(`--target=${Array.from(k).map(De).join(",")}`):t.push(`--target=${De(k)}`)),O&&t.push(`--format=${O}`),y&&t.push(`--global-name=${y}`),j&&t.push(`--platform=${j}`),I&&t.push(`--tsconfig-raw=${typeof I=="string"?I:JSON.stringify(I)}`),Q&&t.push("--minify"),L&&t.push("--minify-syntax"),Y&&t.push("--minify-whitespace"),X&&t.push("--minify-identifiers"),M&&t.push(`--line-limit=${M}`),D&&t.push(`--charset=${D}`),E!==void 0&&t.push(`--tree-shaking=${E}`),w&&t.push("--ignore-annotations"),ue)for(let N of ue)t.push(`--drop:${he(N,"drop")}`);if(R&&t.push(`--drop-labels=${Array.from(R).map(N=>he(N,"dropLabels")).join(",")}`),G&&t.push(`--mangle-props=${G.source}`),J&&t.push(`--reserve-props=${J.source}`),F!==void 0&&t.push(`--mangle-quoted=${F}`),u&&t.push(`--jsx=${u}`),m&&t.push(`--jsx-factory=${m}`),v&&t.push(`--jsx-fragment=${v}`),_&&t.push(`--jsx-import-source=${_}`),A&&t.push("--jsx-dev"),p&&t.push("--jsx-side-effects"),b)for(let N in b){if(N.indexOf("=")>=0)throw new Error(`Invalid define: ${N}`);t.push(`--define:${N}=${he(b[N],"define",N)}`)}if($)for(let N in $){if(N.indexOf("=")>=0)throw new Error(`Invalid log override: ${N}`);t.push(`--log-override:${N}=${he($[N],"log override",N)}`)}if(r)for(let N in r){if(N.indexOf("=")>=0)throw new Error(`Invalid supported: ${N}`);let z=r[N];if(typeof z!="boolean")throw new Error(`Expected value for supported ${q(N)} to be a boolean, got ${typeof z} instead`);t.push(`--supported:${N}=${z}`)}if(f)for(let N of f)t.push(`--pure:${he(N,"pure")}`);P&&t.push("--keep-names")}function xt(t,i,a,d,S){var T;let k=[],O=[],y=Object.create(null),G=null,J=null;Fe(k,i,y,a,d),Xe(k,i,y);let F=l(i,y,"sourcemap",He),Q=l(i,y,"bundle",Z),L=l(i,y,"splitting",Z),Y=l(i,y,"preserveSymlinks",Z),X=l(i,y,"metafile",Z),M=l(i,y,"outfile",U),ue=l(i,y,"outdir",U),R=l(i,y,"outbase",U),D=l(i,y,"tsconfig",U),E=l(i,y,"resolveExtensions",ie),w=l(i,y,"nodePaths",ie),u=l(i,y,"mainFields",ie),m=l(i,y,"conditions",ie),v=l(i,y,"external",ie),_=l(i,y,"packages",U),A=l(i,y,"alias",we),p=l(i,y,"loader",we),b=l(i,y,"outExtension",we),$=l(i,y,"publicPath",U),r=l(i,y,"entryNames",U),f=l(i,y,"chunkNames",U),P=l(i,y,"assetNames",U),j=l(i,y,"inject",ie),I=l(i,y,"banner",we),N=l(i,y,"footer",we),z=l(i,y,"entryPoints",ot),te=l(i,y,"absWorkingDir",U),H=l(i,y,"stdin",we),K=(T=l(i,y,"write",Z))!=null?T:S,ke=l(i,y,"allowOverwrite",Z),de=l(i,y,"mangleCache",we);if(y.plugins=!0,le(i,y,`in ${t}() call`),F&&k.push(`--sourcemap${F===!0?"":`=${F}`}`),Q&&k.push("--bundle"),ke&&k.push("--allow-overwrite"),L&&k.push("--splitting"),Y&&k.push("--preserve-symlinks"),X&&k.push("--metafile"),M&&k.push(`--outfile=${M}`),ue&&k.push(`--outdir=${ue}`),R&&k.push(`--outbase=${R}`),D&&k.push(`--tsconfig=${D}`),_&&k.push(`--packages=${_}`),E){let C=[];for(let se of E){if(he(se,"resolve extension"),se.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${se}`);C.push(se)}k.push(`--resolve-extensions=${C.join(",")}`)}if($&&k.push(`--public-path=${$}`),r&&k.push(`--entry-names=${r}`),f&&k.push(`--chunk-names=${f}`),P&&k.push(`--asset-names=${P}`),u){let C=[];for(let se of u){if(he(se,"main field"),se.indexOf(",")>=0)throw new Error(`Invalid main field: ${se}`);C.push(se)}k.push(`--main-fields=${C.join(",")}`)}if(m){let C=[];for(let se of m){if(he(se,"condition"),se.indexOf(",")>=0)throw new Error(`Invalid condition: ${se}`);C.push(se)}k.push(`--conditions=${C.join(",")}`)}if(v)for(let C of v)k.push(`--external:${he(C,"external")}`);if(A)for(let C in A){if(C.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${C}`);k.push(`--alias:${C}=${he(A[C],"alias",C)}`)}if(I)for(let C in I){if(C.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${C}`);k.push(`--banner:${C}=${he(I[C],"banner",C)}`)}if(N)for(let C in N){if(C.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${C}`);k.push(`--footer:${C}=${he(N[C],"footer",C)}`)}if(j)for(let C of j)k.push(`--inject:${he(C,"inject")}`);if(p)for(let C in p){if(C.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${C}`);k.push(`--loader:${C}=${he(p[C],"loader",C)}`)}if(b)for(let C in b){if(C.indexOf("=")>=0)throw new Error(`Invalid out extension: ${C}`);k.push(`--out-extension:${C}=${he(b[C],"out extension",C)}`)}if(z)if(Array.isArray(z))for(let C=0,se=z.length;C<se;C++){let Se=z[C];if(typeof Se=="object"&&Se!==null){let Ce=Object.create(null),be=l(Se,Ce,"in",U),et=l(Se,Ce,"out",U);if(le(Se,Ce,"in entry point at index "+C),be===void 0)throw new Error('Missing property "in" for entry point at index '+C);if(et===void 0)throw new Error('Missing property "out" for entry point at index '+C);O.push([et,be])}else O.push(["",he(Se,"entry point at index "+C)])}else for(let C in z)O.push([C,he(z[C],"entry point",C)]);if(H){let C=Object.create(null),se=l(H,C,"contents",at),Se=l(H,C,"resolveDir",U),Ce=l(H,C,"sourcefile",U),be=l(H,C,"loader",U);le(H,C,'in "stdin" object'),Ce&&k.push(`--sourcefile=${Ce}`),be&&k.push(`--loader=${be}`),Se&&(J=Se),typeof se=="string"?G=ee(se):se instanceof Uint8Array&&(G=se)}let Je=[];if(w)for(let C of w)C+="",Je.push(C);return{entries:O,flags:k,write:K,stdinContents:G,stdinResolveDir:J,absWorkingDir:te,nodePaths:Je,mangleCache:Le(de)}}function lt(t,i,a,d){let S=[],T=Object.create(null);Fe(S,i,T,a,d),Xe(S,i,T);let k=l(i,T,"sourcemap",He),O=l(i,T,"sourcefile",U),y=l(i,T,"loader",U),G=l(i,T,"banner",U),J=l(i,T,"footer",U),F=l(i,T,"mangleCache",we);return le(i,T,`in ${t}() call`),k&&S.push(`--sourcemap=${k===!0?"external":k}`),O&&S.push(`--sourcefile=${O}`),y&&S.push(`--loader=${y}`),G&&S.push(`--banner=${G}`),J&&S.push(`--footer=${J}`),{flags:S,mangleCache:Le(F)}}function ut(t){let i={},a={didClose:!1,reason:""},d={},S=0,T=0,k=new Uint8Array(16*1024),O=0,y=D=>{let E=O+D.length;if(E>k.length){let u=new Uint8Array(E*2);u.set(k),k=u}k.set(D,O),O+=D.length;let w=0;for(;w+4<=O;){let u=pe(k,w);if(w+4+u>O)break;w+=4,Y(k.subarray(w,w+u)),w+=u}w>0&&(k.copyWithin(0,w,O),O-=w)},G=D=>{a.didClose=!0,D&&(a.reason=": "+(D.message||D));let E="The service was stopped"+a.reason;for(let w in d)d[w](E,null);d={}},J=(D,E,w)=>{if(a.didClose)return w("The service is no longer running"+a.reason,null);let u=S++;d[u]=(m,v)=>{try{w(m,v)}finally{D&&D.unref()}},D&&D.ref(),t.writeToStdin(ae({id:u,isRequest:!0,value:E}))},F=(D,E)=>{if(a.didClose)throw new Error("The service is no longer running"+a.reason);t.writeToStdin(ae({id:D,isRequest:!1,value:E}))},Q=(D,E)=>B(this,null,function*(){try{if(E.command==="ping"){F(D,{});return}if(typeof E.key=="number"){let w=i[E.key];if(!w)return;let u=w[E.command];if(u){yield u(D,E);return}}throw new Error("Invalid command: "+E.command)}catch(w){let u=[Ve(w,t,null,void 0,"")];try{F(D,{errors:u})}catch{}}}),L=!0,Y=D=>{if(L){L=!1;let w=String.fromCharCode(...D);if(w!=="0.25.0")throw new Error(`Cannot start service: Host version "0.25.0" does not match binary version ${q(w)}`);return}let E=g(D);if(E.isRequest)Q(E.id,E.value);else{let w=d[E.id];delete d[E.id],E.value.error?w(E.value.error,{}):w(null,E.value)}};return{readFromStdout:y,afterClose:G,service:{buildOrContext:({callName:D,refs:E,options:w,isTTY:u,defaultWD:m,callback:v})=>{let _=0,A=T++,p={},b={ref(){++_===1&&E&&E.ref()},unref(){--_===0&&(delete i[A],E&&E.unref())}};i[A]=p,b.ref(),ct(D,A,J,F,b,t,p,w,u,m,($,r)=>{try{v($,r)}finally{b.unref()}})},transform:({callName:D,refs:E,input:w,options:u,isTTY:m,fs:v,callback:_})=>{let A=Mt(),p=b=>{try{if(typeof w!="string"&&!(w instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:$,mangleCache:r}=lt(D,u,m,Ue),f={command:"transform",flags:$,inputFS:b!==null,input:b!==null?ee(b):typeof w=="string"?ee(w):w};r&&(f.mangleCache=r),J(E,f,(P,j)=>{if(P)return _(new Error(P),null);let I=Ge(j.errors,A),N=Ge(j.warnings,A),z=1,te=()=>{if(--z===0){let H={warnings:N,code:j.code,map:j.map,mangleCache:void 0,legalComments:void 0};"legalComments"in j&&(H.legalComments=j==null?void 0:j.legalComments),j.mangleCache&&(H.mangleCache=j==null?void 0:j.mangleCache),_(null,H)}};if(I.length>0)return _(Ke("Transform failed",I,N),null);j.codeFS&&(z++,v.readFile(j.code,(H,K)=>{H!==null?_(H,null):(j.code=K,te())})),j.mapFS&&(z++,v.readFile(j.map,(H,K)=>{H!==null?_(H,null):(j.map=K,te())})),te()})}catch($){let r=[];try{Fe(r,u,{},m,Ue)}catch{}let f=Ve($,t,A,void 0,"");J(E,{command:"error",flags:r,error:f},()=>{f.detail=A.load(f.detail),_(Ke("Transform failed",[f],[]),null)})}};if((typeof w=="string"||w instanceof Uint8Array)&&w.length>1024*1024){let b=p;p=()=>v.writeFile(w,b)}p(null)},formatMessages:({callName:D,refs:E,messages:w,options:u,callback:m})=>{if(!u)throw new Error(`Missing second argument in ${D}() call`);let v={},_=l(u,v,"kind",U),A=l(u,v,"color",Z),p=l(u,v,"terminalWidth",$e);if(le(u,v,`in ${D}() call`),_===void 0)throw new Error(`Missing "kind" in ${D}() call`);if(_!=="error"&&_!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${D}() call`);let b={command:"format-msgs",messages:Re(w,"messages",null,"",p),isWarning:_==="warning"};A!==void 0&&(b.color=A),p!==void 0&&(b.terminalWidth=p),J(E,b,($,r)=>{if($)return m(new Error($),null);m(null,r.messages)})},analyzeMetafile:({callName:D,refs:E,metafile:w,options:u,callback:m})=>{u===void 0&&(u={});let v={},_=l(u,v,"color",Z),A=l(u,v,"verbose",Z);le(u,v,`in ${D}() call`);let p={command:"analyze-metafile",metafile:w};_!==void 0&&(p.color=_),A!==void 0&&(p.verbose=A),J(E,p,(b,$)=>{if(b)return m(new Error(b),null);m(null,$.result)})}}}}function ct(t,i,a,d,S,T,k,O,y,G,J){let F=Mt(),Q=t==="context",L=(M,ue)=>{let R=[];try{Fe(R,O,{},y,me)}catch{}let D=Ve(M,T,F,void 0,ue);a(S,{command:"error",flags:R,error:D},()=>{D.detail=F.load(D.detail),J(Ke(Q?"Context failed":"Build failed",[D],[]),null)})},Y;if(typeof O=="object"){let M=O.plugins;if(M!==void 0){if(!Array.isArray(M))return L(new Error('"plugins" must be an array'),"");Y=M}}if(Y&&Y.length>0){if(T.isSync)return L(new Error("Cannot use plugins in synchronous API calls"),"");gn(i,a,d,S,T,k,O,Y,F).then(M=>{if(!M.ok)return L(M.error,M.pluginName);try{X(M.requestPlugins,M.runOnEndCallbacks,M.scheduleOnDisposeCallbacks)}catch(ue){L(ue,"")}},M=>L(M,""));return}try{X(null,(M,ue)=>ue([],[]),()=>{})}catch(M){L(M,"")}function X(M,ue,R){let D=T.hasFS,{entries:E,flags:w,write:u,stdinContents:m,stdinResolveDir:v,absWorkingDir:_,nodePaths:A,mangleCache:p}=xt(t,O,y,me,D);if(u&&!T.hasFS)throw new Error('The "write" option is unavailable in this environment');let b={command:"build",key:i,entries:E,flags:w,write:u,stdinContents:m,stdinResolveDir:v,absWorkingDir:_||G,nodePaths:A,context:Q};M&&(b.plugins=M),p&&(b.mangleCache=p);let $=(P,j)=>{let I={errors:Ge(P.errors,F),warnings:Ge(P.warnings,F),outputFiles:void 0,metafile:void 0,mangleCache:void 0},N=I.errors.slice(),z=I.warnings.slice();P.outputFiles&&(I.outputFiles=P.outputFiles.map(vn)),P.metafile&&(I.metafile=JSON.parse(P.metafile)),P.mangleCache&&(I.mangleCache=P.mangleCache),P.writeToStdout!==void 0&&console.log(ce(P.writeToStdout).replace(/\n$/,"")),ue(I,(te,H)=>{if(N.length>0||te.length>0){let K=Ke("Build failed",N.concat(te),z.concat(H));return j(K,null,te,H)}j(null,I,te,H)})},r,f;Q&&(k["on-end"]=(P,j)=>new Promise(I=>{$(j,(N,z,te,H)=>{let K={errors:te,warnings:H};f&&f(N,z),r=void 0,f=void 0,d(P,K),I()})})),a(S,b,(P,j)=>{if(P)return J(new Error(P),null);if(!Q)return $(j,(z,te)=>(R(),J(z,te)));if(j.errors.length>0)return J(Ke("Context failed",j.errors,j.warnings),null);let I=!1,N={rebuild:()=>(r||(r=new Promise((z,te)=>{let H;f=(ke,de)=>{H||(H=()=>ke?te(ke):z(de))};let K=()=>{a(S,{command:"rebuild",key:i},(de,Je)=>{de?te(new Error(de)):H?H():K()})};K()})),r),watch:(z={})=>new Promise((te,H)=>{if(!T.hasFS)throw new Error('Cannot use the "watch" API in this environment');le(z,{},"in watch() call"),a(S,{command:"watch",key:i},de=>{de?H(new Error(de)):te(void 0)})}),serve:(z={})=>new Promise((te,H)=>{if(!T.hasFS)throw new Error('Cannot use the "serve" API in this environment');let K={},ke=l(z,K,"port",ye),de=l(z,K,"host",U),Je=l(z,K,"servedir",U),C=l(z,K,"keyfile",U),se=l(z,K,"certfile",U),Se=l(z,K,"fallback",U),Ce=l(z,K,"onRequest",Ze);le(z,K,"in serve() call");let be={command:"serve",key:i,onRequest:!!Ce};ke!==void 0&&(be.port=ke),de!==void 0&&(be.host=de),Je!==void 0&&(be.servedir=Je),C!==void 0&&(be.keyfile=C),se!==void 0&&(be.certfile=se),Se!==void 0&&(be.fallback=Se),a(S,be,(et,On)=>{if(et)return H(new Error(et));Ce&&(k["serve-request"]=(Un,Dn)=>{Ce(Dn.args),d(Un,{})}),te(On)})}),cancel:()=>new Promise(z=>{if(I)return z();a(S,{command:"cancel",key:i},()=>{z()})}),dispose:()=>new Promise(z=>{if(I)return z();I=!0,a(S,{command:"dispose",key:i},()=>{z(),R(),S.unref()})})};S.ref(),J(null,N)})}}var gn=(t,i,a,d,S,T,k,O,y)=>B(void 0,null,function*(){let G=[],J=[],F={},Q={},L=[],Y=0,X=0,M=[],ue=!1;O=[...O];for(let E of O){let w={};if(typeof E!="object")throw new Error(`Plugin at index ${X} must be an object`);let u=l(E,w,"name",U);if(typeof u!="string"||u==="")throw new Error(`Plugin at index ${X} is missing a name`);try{let m=l(E,w,"setup",Ze);if(typeof m!="function")throw new Error("Plugin is missing a setup function");le(E,w,`on plugin ${q(u)}`);let v={name:u,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};X++;let A=m({initialOptions:k,resolve:(p,b={})=>{if(!ue)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof p!="string")throw new Error("The path to resolve must be a string");let $=Object.create(null),r=l(b,$,"pluginName",U),f=l(b,$,"importer",U),P=l(b,$,"namespace",U),j=l(b,$,"resolveDir",U),I=l(b,$,"kind",U),N=l(b,$,"pluginData",Te),z=l(b,$,"with",we);return le(b,$,"in resolve() call"),new Promise((te,H)=>{let K={command:"resolve",path:p,key:t,pluginName:u};if(r!=null&&(K.pluginName=r),f!=null&&(K.importer=f),P!=null&&(K.namespace=P),j!=null&&(K.resolveDir=j),I!=null)K.kind=I;else throw new Error('Must specify "kind" when calling "resolve"');N!=null&&(K.pluginData=y.store(N)),z!=null&&(K.with=mn(z,"with")),i(d,K,(ke,de)=>{ke!==null?H(new Error(ke)):te({errors:Ge(de.errors,y),warnings:Ge(de.warnings,y),path:de.path,external:de.external,sideEffects:de.sideEffects,namespace:de.namespace,suffix:de.suffix,pluginData:y.load(de.pluginData)})})})},onStart(p){let b='This error came from the "onStart" callback registered here:',$=ft(new Error(b),S,"onStart");G.push({name:u,callback:p,note:$}),v.onStart=!0},onEnd(p){let b='This error came from the "onEnd" callback registered here:',$=ft(new Error(b),S,"onEnd");J.push({name:u,callback:p,note:$}),v.onEnd=!0},onResolve(p,b){let $='This error came from the "onResolve" callback registered here:',r=ft(new Error($),S,"onResolve"),f={},P=l(p,f,"filter",Pe),j=l(p,f,"namespace",U);if(le(p,f,`in onResolve() call for plugin ${q(u)}`),P==null)throw new Error("onResolve() call is missing a filter");let I=Y++;F[I]={name:u,callback:b,note:r},v.onResolve.push({id:I,filter:P.source,namespace:j||""})},onLoad(p,b){let $='This error came from the "onLoad" callback registered here:',r=ft(new Error($),S,"onLoad"),f={},P=l(p,f,"filter",Pe),j=l(p,f,"namespace",U);if(le(p,f,`in onLoad() call for plugin ${q(u)}`),P==null)throw new Error("onLoad() call is missing a filter");let I=Y++;Q[I]={name:u,callback:b,note:r},v.onLoad.push({id:I,filter:P.source,namespace:j||""})},onDispose(p){L.push(p)},esbuild:S.esbuild});A&&(yield A),M.push(v)}catch(m){return{ok:!1,error:m,pluginName:u}}}T["on-start"]=(E,w)=>B(void 0,null,function*(){y.clear();let u={errors:[],warnings:[]};yield Promise.all(G.map(m=>B(void 0,[m],function*({name:v,callback:_,note:A}){try{let p=yield _();if(p!=null){if(typeof p!="object")throw new Error(`Expected onStart() callback in plugin ${q(v)} to return an object`);let b={},$=l(p,b,"errors",ie),r=l(p,b,"warnings",ie);le(p,b,`from onStart() callback in plugin ${q(v)}`),$!=null&&u.errors.push(...Re($,"errors",y,v,void 0)),r!=null&&u.warnings.push(...Re(r,"warnings",y,v,void 0))}}catch(p){u.errors.push(Ve(p,S,y,A&&A(),v))}}))),a(E,u)}),T["on-resolve"]=(E,w)=>B(void 0,null,function*(){let u={},m="",v,_;for(let A of w.ids)try{({name:m,callback:v,note:_}=F[A]);let p=yield v({path:w.path,importer:w.importer,namespace:w.namespace,resolveDir:w.resolveDir,kind:w.kind,pluginData:y.load(w.pluginData),with:w.with});if(p!=null){if(typeof p!="object")throw new Error(`Expected onResolve() callback in plugin ${q(m)} to return an object`);let b={},$=l(p,b,"pluginName",U),r=l(p,b,"path",U),f=l(p,b,"namespace",U),P=l(p,b,"suffix",U),j=l(p,b,"external",Z),I=l(p,b,"sideEffects",Z),N=l(p,b,"pluginData",Te),z=l(p,b,"errors",ie),te=l(p,b,"warnings",ie),H=l(p,b,"watchFiles",ie),K=l(p,b,"watchDirs",ie);le(p,b,`from onResolve() callback in plugin ${q(m)}`),u.id=A,$!=null&&(u.pluginName=$),r!=null&&(u.path=r),f!=null&&(u.namespace=f),P!=null&&(u.suffix=P),j!=null&&(u.external=j),I!=null&&(u.sideEffects=I),N!=null&&(u.pluginData=y.store(N)),z!=null&&(u.errors=Re(z,"errors",y,m,void 0)),te!=null&&(u.warnings=Re(te,"warnings",y,m,void 0)),H!=null&&(u.watchFiles=ht(H,"watchFiles")),K!=null&&(u.watchDirs=ht(K,"watchDirs"));break}}catch(p){u={id:A,errors:[Ve(p,S,y,_&&_(),m)]};break}a(E,u)}),T["on-load"]=(E,w)=>B(void 0,null,function*(){let u={},m="",v,_;for(let A of w.ids)try{({name:m,callback:v,note:_}=Q[A]);let p=yield v({path:w.path,namespace:w.namespace,suffix:w.suffix,pluginData:y.load(w.pluginData),with:w.with});if(p!=null){if(typeof p!="object")throw new Error(`Expected onLoad() callback in plugin ${q(m)} to return an object`);let b={},$=l(p,b,"pluginName",U),r=l(p,b,"contents",at),f=l(p,b,"resolveDir",U),P=l(p,b,"pluginData",Te),j=l(p,b,"loader",U),I=l(p,b,"errors",ie),N=l(p,b,"warnings",ie),z=l(p,b,"watchFiles",ie),te=l(p,b,"watchDirs",ie);le(p,b,`from onLoad() callback in plugin ${q(m)}`),u.id=A,$!=null&&(u.pluginName=$),r instanceof Uint8Array?u.contents=r:r!=null&&(u.contents=ee(r)),f!=null&&(u.resolveDir=f),P!=null&&(u.pluginData=y.store(P)),j!=null&&(u.loader=j),I!=null&&(u.errors=Re(I,"errors",y,m,void 0)),N!=null&&(u.warnings=Re(N,"warnings",y,m,void 0)),z!=null&&(u.watchFiles=ht(z,"watchFiles")),te!=null&&(u.watchDirs=ht(te,"watchDirs"));break}}catch(p){u={id:A,errors:[Ve(p,S,y,_&&_(),m)]};break}a(E,u)});let R=(E,w)=>w([],[]);J.length>0&&(R=(E,w)=>{B(void 0,null,function*(){let u=[],m=[];for(let{name:v,callback:_,note:A}of J){let p,b;try{let $=yield _(E);if($!=null){if(typeof $!="object")throw new Error(`Expected onEnd() callback in plugin ${q(v)} to return an object`);let r={},f=l($,r,"errors",ie),P=l($,r,"warnings",ie);le($,r,`from onEnd() callback in plugin ${q(v)}`),f!=null&&(p=Re(f,"errors",y,v,void 0)),P!=null&&(b=Re(P,"warnings",y,v,void 0))}}catch($){p=[Ve($,S,y,A&&A(),v)]}if(p){u.push(...p);try{E.errors.push(...p)}catch{}}if(b){m.push(...b);try{E.warnings.push(...b)}catch{}}}w(u,m)})});let D=()=>{for(let E of L)setTimeout(()=>E(),0)};return ue=!0,{ok:!0,requestPlugins:M,runOnEndCallbacks:R,scheduleOnDisposeCallbacks:D}});function Mt(){let t=new Map,i=0;return{clear(){t.clear()},load(a){return t.get(a)},store(a){if(a===void 0)return-1;let d=i++;return t.set(d,a),d}}}function ft(t,i,a){let d,S=!1;return()=>{if(S)return d;S=!0;try{let T=(t.stack+"").split(`
`);T.splice(1,1);let k=It(i,T,a);if(k)return d={text:t.message,location:k},d}catch{}}}function Ve(t,i,a,d,S){let T="Internal error",k=null;try{T=(t&&t.message||t)+""}catch{}try{k=It(i,(t.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:S,text:T,location:k,notes:d?[d]:[],detail:a?a.store(t):-1}}function It(t,i,a){let d="    at ";if(t.readFileSync&&!i[0].startsWith(d)&&i[1].startsWith(d))for(let S=1;S<i.length;S++){let T=i[S];if(T.startsWith(d))for(T=T.slice(d.length);;){let k=/^(?:new |async )?\S+ \((.*)\)$/.exec(T);if(k){T=k[1];continue}if(k=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(T),k){T=k[1];continue}if(k=/^(\S+):(\d+):(\d+)$/.exec(T),k){let O;try{O=t.readFileSync(k[1],"utf8")}catch{break}let y=O.split(/\r\n|\r|\n|\u2028|\u2029/)[+k[2]-1]||"",G=+k[3]-1,J=y.slice(G,G+a.length)===a?a.length:0;return{file:k[1],namespace:"file",line:+k[2],column:ee(y.slice(0,G)).length,length:ee(y.slice(G,G+J)).length,lineText:y+`
`+i.slice(1).join(`
`),suggestion:""}}break}}return null}function Ke(t,i,a){let d=5;t+=i.length<1?"":` with ${i.length} error${i.length<2?"":"s"}:`+i.slice(0,d+1).map((T,k)=>{if(k===d)return`
...`;if(!T.location)return`
error: ${T.text}`;let{file:O,line:y,column:G}=T.location,J=T.pluginName?`[plugin: ${T.pluginName}] `:"";return`
${O}:${y}:${G}: ERROR: ${J}${T.text}`}).join("");let S=new Error(t);for(let[T,k]of[["errors",i],["warnings",a]])Object.defineProperty(S,T,{configurable:!0,enumerable:!0,get:()=>k,set:O=>Object.defineProperty(S,T,{configurable:!0,enumerable:!0,value:O})});return S}function Ge(t,i){for(let a of t)a.detail=i.load(a.detail);return t}function Ft(t,i,a){if(t==null)return null;let d={},S=l(t,d,"file",U),T=l(t,d,"namespace",U),k=l(t,d,"line",$e),O=l(t,d,"column",$e),y=l(t,d,"length",$e),G=l(t,d,"lineText",U),J=l(t,d,"suggestion",U);if(le(t,d,i),G){let F=G.slice(0,(O&&O>0?O:0)+(y&&y>0?y:0)+(a&&a>0?a:80));!/[\x7F-\uFFFF]/.test(F)&&!/\n/.test(G)&&(G=F)}return{file:S||"",namespace:T||"",line:k||0,column:O||0,length:y||0,lineText:G||"",suggestion:J||""}}function Re(t,i,a,d,S){let T=[],k=0;for(let O of t){let y={},G=l(O,y,"id",U),J=l(O,y,"pluginName",U),F=l(O,y,"text",U),Q=l(O,y,"location",Ne),L=l(O,y,"notes",ie),Y=l(O,y,"detail",Te),X=`in element ${k} of "${i}"`;le(O,y,X);let M=[];if(L)for(let ue of L){let R={},D=l(ue,R,"text",U),E=l(ue,R,"location",Ne);le(ue,R,X),M.push({text:D||"",location:Ft(E,X,S)})}T.push({id:G||"",pluginName:J||d,text:F||"",location:Ft(Q,X,S),notes:M,detail:a?a.store(Y):-1}),k++}return T}function ht(t,i){let a=[];for(let d of t){if(typeof d!="string")throw new Error(`${q(i)} must be an array of strings`);a.push(d)}return a}function mn(t,i){let a=Object.create(null);for(let d in t){let S=t[d];if(typeof S!="string")throw new Error(`key ${q(d)} in object ${q(i)} must be a string`);a[d]=S}return a}function vn({path:t,contents:i,hash:a}){let d=null;return{path:t,contents:i,hash:a,get text(){let S=this.contents;return(d===null||S!==i)&&(i=S,d=ce(S)),d}}}var yn="0.25.0",wn=t=>Qe().build(t),bn=t=>Qe().context(t),xn=(t,i)=>Qe().transform(t,i),kn=(t,i)=>Qe().formatMessages(t,i),Sn=(t,i)=>Qe().analyzeMetafile(t,i),En=()=>{throw new Error('The "buildSync" API only works in node')},Tn=()=>{throw new Error('The "transformSync" API only works in node')},_n=()=>{throw new Error('The "formatMessagesSync" API only works in node')},jn=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},Pn=()=>(dt&&dt(),Promise.resolve()),We,dt,pt,Qe=()=>{if(pt)return pt;throw We?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},$n=t=>{t=Be(t||{});let i=t.wasmURL,a=t.wasmModule,d=t.worker!==!1;if(!i&&!a)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(We)throw new Error('Cannot call "initialize" more than once');return We=An(i||"",a,d),We.catch(()=>{We=void 0}),We},An=(t,i,a)=>B(void 0,null,function*(){let d,S,T=new Promise(F=>S=F);if(a){let F=new Blob([`onmessage=((postMessage) => {
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
    })(postMessage)`],{type:"text/javascript"});d=new Worker(URL.createObjectURL(F))}else{let F=(L=>{var Y=(R,D,E)=>new Promise((w,u)=>{var m=A=>{try{_(E.next(A))}catch(p){u(p)}},v=A=>{try{_(E.throw(A))}catch(p){u(p)}},_=A=>A.done?w(A.value):Promise.resolve(A.value).then(m,v);_((E=E.apply(R,D)).next())});let X,M={};for(let R=self;R;R=Object.getPrototypeOf(R))for(let D of Object.getOwnPropertyNames(R))D in M||Object.defineProperty(M,D,{get:()=>self[D]});(()=>{let R=()=>{let w=new Error("not implemented");return w.code="ENOSYS",w};if(!M.fs){let w="";M.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(u,m){w+=E.decode(m);let v=w.lastIndexOf(`
`);return v!=-1&&(console.log(w.substring(0,v)),w=w.substring(v+1)),m.length},write(u,m,v,_,A,p){if(v!==0||_!==m.length||A!==null){p(R());return}let b=this.writeSync(u,m);p(null,b)},chmod(u,m,v){v(R())},chown(u,m,v,_){_(R())},close(u,m){m(R())},fchmod(u,m,v){v(R())},fchown(u,m,v,_){_(R())},fstat(u,m){m(R())},fsync(u,m){m(null)},ftruncate(u,m,v){v(R())},lchown(u,m,v,_){_(R())},link(u,m,v){v(R())},lstat(u,m){m(R())},mkdir(u,m,v){v(R())},open(u,m,v,_){_(R())},read(u,m,v,_,A,p){p(R())},readdir(u,m){m(R())},readlink(u,m){m(R())},rename(u,m,v){v(R())},rmdir(u,m){m(R())},stat(u,m){m(R())},symlink(u,m,v){v(R())},truncate(u,m,v){v(R())},unlink(u,m){m(R())},utimes(u,m,v,_){_(R())}}}if(M.process||(M.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw R()},pid:-1,ppid:-1,umask(){throw R()},cwd(){throw R()},chdir(){throw R()}}),!M.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!M.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!M.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!M.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");let D=new TextEncoder("utf-8"),E=new TextDecoder("utf-8");M.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=r=>{r!==0&&console.warn("exit code:",r)},this._exitPromise=new Promise(r=>{this._resolveExitPromise=r}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;let w=(r,f)=>{this.mem.setUint32(r+0,f,!0),this.mem.setUint32(r+4,Math.floor(f/4294967296),!0)},u=(r,f)=>{this.mem.setUint32(r+0,f,!0)},m=r=>{let f=this.mem.getUint32(r+0,!0),P=this.mem.getInt32(r+4,!0);return f+P*4294967296},v=r=>{let f=this.mem.getFloat64(r,!0);if(f===0)return;if(!isNaN(f))return f;let P=this.mem.getUint32(r,!0);return this._values[P]},_=(r,f)=>{if(typeof f=="number"&&f!==0){if(isNaN(f)){this.mem.setUint32(r+4,2146959360,!0),this.mem.setUint32(r,0,!0);return}this.mem.setFloat64(r,f,!0);return}if(f===void 0){this.mem.setFloat64(r,0,!0);return}let j=this._ids.get(f);j===void 0&&(j=this._idPool.pop(),j===void 0&&(j=this._values.length),this._values[j]=f,this._goRefCounts[j]=0,this._ids.set(f,j)),this._goRefCounts[j]++;let I=0;switch(typeof f){case"object":f!==null&&(I=1);break;case"string":I=2;break;case"symbol":I=3;break;case"function":I=4;break}this.mem.setUint32(r+4,2146959360|I,!0),this.mem.setUint32(r,j,!0)},A=r=>{let f=m(r+0),P=m(r+8);return new Uint8Array(this._inst.exports.mem.buffer,f,P)},p=r=>{let f=m(r+0),P=m(r+8),j=new Array(P);for(let I=0;I<P;I++)j[I]=v(f+I*8);return j},b=r=>{let f=m(r+0),P=m(r+8);return E.decode(new DataView(this._inst.exports.mem.buffer,f,P))},$=Date.now()-performance.now();this.importObject={_gotest:{add:(r,f)=>r+f},gojs:{"runtime.wasmExit":r=>{r>>>=0;let f=this.mem.getInt32(r+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(f)},"runtime.wasmWrite":r=>{r>>>=0;let f=m(r+8),P=m(r+16),j=this.mem.getInt32(r+24,!0);M.fs.writeSync(f,new Uint8Array(this._inst.exports.mem.buffer,P,j))},"runtime.resetMemoryDataView":r=>{r>>>=0,this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":r=>{r>>>=0,w(r+8,($+performance.now())*1e6)},"runtime.walltime":r=>{r>>>=0;let f=new Date().getTime();w(r+8,f/1e3),this.mem.setInt32(r+16,f%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":r=>{r>>>=0;let f=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(f,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(f);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},m(r+8))),this.mem.setInt32(r+16,f,!0)},"runtime.clearTimeoutEvent":r=>{r>>>=0;let f=this.mem.getInt32(r+8,!0);clearTimeout(this._scheduledTimeouts.get(f)),this._scheduledTimeouts.delete(f)},"runtime.getRandomData":r=>{r>>>=0,crypto.getRandomValues(A(r+8))},"syscall/js.finalizeRef":r=>{r>>>=0;let f=this.mem.getUint32(r+8,!0);if(this._goRefCounts[f]--,this._goRefCounts[f]===0){let P=this._values[f];this._values[f]=null,this._ids.delete(P),this._idPool.push(f)}},"syscall/js.stringVal":r=>{r>>>=0,_(r+24,b(r+8))},"syscall/js.valueGet":r=>{r>>>=0;let f=Reflect.get(v(r+8),b(r+16));r=this._inst.exports.getsp()>>>0,_(r+32,f)},"syscall/js.valueSet":r=>{r>>>=0,Reflect.set(v(r+8),b(r+16),v(r+32))},"syscall/js.valueDelete":r=>{r>>>=0,Reflect.deleteProperty(v(r+8),b(r+16))},"syscall/js.valueIndex":r=>{r>>>=0,_(r+24,Reflect.get(v(r+8),m(r+16)))},"syscall/js.valueSetIndex":r=>{r>>>=0,Reflect.set(v(r+8),m(r+16),v(r+24))},"syscall/js.valueCall":r=>{r>>>=0;try{let f=v(r+8),P=Reflect.get(f,b(r+16)),j=p(r+32),I=Reflect.apply(P,f,j);r=this._inst.exports.getsp()>>>0,_(r+56,I),this.mem.setUint8(r+64,1)}catch(f){r=this._inst.exports.getsp()>>>0,_(r+56,f),this.mem.setUint8(r+64,0)}},"syscall/js.valueInvoke":r=>{r>>>=0;try{let f=v(r+8),P=p(r+16),j=Reflect.apply(f,void 0,P);r=this._inst.exports.getsp()>>>0,_(r+40,j),this.mem.setUint8(r+48,1)}catch(f){r=this._inst.exports.getsp()>>>0,_(r+40,f),this.mem.setUint8(r+48,0)}},"syscall/js.valueNew":r=>{r>>>=0;try{let f=v(r+8),P=p(r+16),j=Reflect.construct(f,P);r=this._inst.exports.getsp()>>>0,_(r+40,j),this.mem.setUint8(r+48,1)}catch(f){r=this._inst.exports.getsp()>>>0,_(r+40,f),this.mem.setUint8(r+48,0)}},"syscall/js.valueLength":r=>{r>>>=0,w(r+16,parseInt(v(r+8).length))},"syscall/js.valuePrepareString":r=>{r>>>=0;let f=D.encode(String(v(r+8)));_(r+16,f),w(r+24,f.length)},"syscall/js.valueLoadString":r=>{r>>>=0;let f=v(r+8);A(r+16).set(f)},"syscall/js.valueInstanceOf":r=>{r>>>=0,this.mem.setUint8(r+24,v(r+8)instanceof v(r+16)?1:0)},"syscall/js.copyBytesToGo":r=>{r>>>=0;let f=A(r+8),P=v(r+32);if(!(P instanceof Uint8Array||P instanceof Uint8ClampedArray)){this.mem.setUint8(r+48,0);return}let j=P.subarray(0,f.length);f.set(j),w(r+40,j.length),this.mem.setUint8(r+48,1)},"syscall/js.copyBytesToJS":r=>{r>>>=0;let f=v(r+8),P=A(r+16);if(!(f instanceof Uint8Array||f instanceof Uint8ClampedArray)){this.mem.setUint8(r+48,0);return}let j=P.subarray(0,f.length);f.set(j),w(r+40,j.length),this.mem.setUint8(r+48,1)},debug:r=>{console.log(r)}}}}run(w){return Y(this,null,function*(){if(!(w instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=w,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,M,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[M,5],[this,6]]),this._idPool=[],this.exited=!1;let u=4096,m=$=>{let r=u,f=D.encode($+"\0");return new Uint8Array(this.mem.buffer,u,f.length).set(f),u+=f.length,u%8!==0&&(u+=8-u%8),r},v=this.argv.length,_=[];this.argv.forEach($=>{_.push(m($))}),_.push(0),Object.keys(this.env).sort().forEach($=>{_.push(m(`${$}=${this.env[$]}`))}),_.push(0);let p=u;if(_.forEach($=>{this.mem.setUint32(u,$,!0),this.mem.setUint32(u+4,0,!0),u+=8}),u>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(v,p),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(w){let u=this;return function(){let m={id:w,this:this,args:arguments};return u._pendingEvent=m,u._resume(),m.result}}}})(),X=({data:R})=>{let D=new TextDecoder,E=M.fs,w="";E.writeSync=(A,p)=>{if(A===1)L(p);else if(A===2){w+=D.decode(p);let b=w.split(`
`);b.length>1&&console.log(b.slice(0,-1).join(`
`)),w=b[b.length-1]}else throw new Error("Bad write");return p.length};let u=[],m,v=0;X=({data:A})=>(A.length>0&&(u.push(A),m&&m()),_),E.read=(A,p,b,$,r,f)=>{if(A!==0||b!==0||$!==p.length||r!==null)throw new Error("Bad read");if(u.length===0){m=()=>E.read(A,p,b,$,r,f);return}let P=u[0],j=Math.max(0,Math.min($,P.length-v));p.set(P.subarray(v,v+j),b),v+=j,v===P.length&&(u.shift(),v=0),f(null,j)};let _=new M.Go;return _.argv=["","--service=0.25.0"],ue(R,_).then(A=>{L(null),_.run(A)},A=>{L(A)}),_};function ue(R,D){return Y(this,null,function*(){if(R instanceof WebAssembly.Module)return WebAssembly.instantiate(R,D.importObject);let E=yield fetch(R);if(!E.ok)throw new Error(`Failed to download ${JSON.stringify(R)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(E.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(E,D.importObject)).instance;let w=yield E.arrayBuffer();return(yield WebAssembly.instantiate(w,D.importObject)).instance})}return R=>X(R)})(L=>d.onmessage({data:L})),Q;d={onmessage:null,postMessage:L=>setTimeout(()=>{try{Q=F({data:L})}catch(Y){S(Y)}}),terminate(){if(Q)for(let L of Q._scheduledTimeouts.values())clearTimeout(L)}}}let k,O,y=new Promise((F,Q)=>{k=F,O=Q});d.onmessage=({data:F})=>{d.onmessage=({data:Q})=>G(Q),F?O(F):k()},d.postMessage(i||new URL(t,location.href).toString());let{readFromStdout:G,service:J}=ut({writeToStdin(F){d.postMessage(F)},isSync:!1,hasFS:!1,esbuild:re});yield y,dt=()=>{d.terminate(),We=void 0,dt=void 0,pt=void 0},pt={build:F=>new Promise((Q,L)=>{T.then(L),J.buildOrContext({callName:"build",refs:null,options:F,isTTY:!1,defaultWD:"/",callback:(Y,X)=>Y?L(Y):Q(X)})}),context:F=>new Promise((Q,L)=>{T.then(L),J.buildOrContext({callName:"context",refs:null,options:F,isTTY:!1,defaultWD:"/",callback:(Y,X)=>Y?L(Y):Q(X)})}),transform:(F,Q)=>new Promise((L,Y)=>{T.then(Y),J.transform({callName:"transform",refs:null,input:F,options:Q||{},isTTY:!1,fs:{readFile(X,M){M(new Error("Internal error"),null)},writeFile(X,M){M(null)}},callback:(X,M)=>X?Y(X):L(M)})}),formatMessages:(F,Q)=>new Promise((L,Y)=>{T.then(Y),J.formatMessages({callName:"formatMessages",refs:null,messages:F,options:Q,callback:(X,M)=>X?Y(X):L(M)})}),analyzeMetafile:(F,Q)=>new Promise((L,Y)=>{T.then(Y),J.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof F=="string"?F:JSON.stringify(F),options:Q,callback:(X,M)=>X?Y(X):L(M)})})}}),Cn=re})(typeof _t=="object"?_t:{set exports(n){(typeof self<"u"?self:this).esbuild=n}})});function kt(n){let e=/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(n.trim());return e?{major:+e[1],minor:+e[2],patch:+e[3],pre:e[4]?e[4].split("."):[]}:null}function ze(n,e){if(n.major!==e.major)return n.major-e.major;if(n.minor!==e.minor)return n.minor-e.minor;if(n.patch!==e.patch)return n.patch-e.patch;if(n.pre.length===0&&e.pre.length===0)return 0;if(n.pre.length===0)return 1;if(e.pre.length===0)return-1;let s=Math.max(n.pre.length,e.pre.length);for(let o=0;o<s;o++){let c=n.pre[o],x=e.pre[o];if(c===void 0)return-1;if(x===void 0)return 1;let h=/^\d+$/.test(c),W=/^\d+$/.test(x);if(h&&W){let B=+c-+x;if(B!==0)return B}else{if(h)return-1;if(W)return 1;if(c!==x)return c<x?-1:1}}return 0}function Wn(n){let e=/^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(n.trim());if(!e)return()=>!1;let s=e[1]||"=",o=e[2].trim();if(o==="*"||o==="")return()=>!0;let c=o.split(".");if(c.some(h=>h==="x"||h==="X"||h==="*")||c.length<3){let h=c[0]===void 0||/[xX*]/.test(c[0])?null:+c[0],W=c[1]===void 0||/[xX*]/.test(c[1])?null:+c[1];return B=>!(h!==null&&B.major!==h||W!==null&&B.minor!==W)}let x=kt(o);if(!x)return()=>!1;switch(s){case"^":return h=>ze(h,x)<0?!1:x.major>0?h.major===x.major:x.minor>0?h.major===0&&h.minor===x.minor:h.major===0&&h.minor===0&&h.patch===x.patch;case"~":return h=>ze(h,x)>=0&&h.major===x.major&&h.minor===x.minor;case">":return h=>ze(h,x)>0;case">=":return h=>ze(h,x)>=0;case"<":return h=>ze(h,x)<0;case"<=":return h=>ze(h,x)<=0;default:return h=>ze(h,x)===0}}function Ln(n){let e=n.trim().split(/\s+/).filter(Boolean).map(Wn);return s=>e.every(o=>o(s))}function Gn(n,e){let s=kt(n);if(!s)return!1;let o=e.trim();return o==="*"||o===""||o==="latest"?!0:o.split("||").some(c=>Ln(c)(s))}function Nt(n,e){let s=/-([0-9A-Za-z.-]+)/.test(e),o=null,c=null;for(let x of n){let h=kt(x);h&&(h.pre.length>0&&!s||Gn(x,e)&&(o===null||ze(h,o)>0)&&(o=h,c=x))}return c}var xe=Uint8Array,qe=Uint16Array,Jn=Int32Array,Bt=new xe([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),Vt=new xe([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),qn=new xe([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Wt=function(n,e){for(var s=new qe(31),o=0;o<31;++o)s[o]=e+=1<<n[o-1];for(var c=new Jn(s[30]),o=1;o<30;++o)for(var x=s[o];x<s[o+1];++x)c[x]=x-s[o]<<5|o;return{b:s,r:c}},Lt=Wt(Bt,2),Gt=Lt.b,Zn=Lt.r;Gt[28]=258,Zn[258]=28;var Jt=Wt(Vt,0),Hn=Jt.b,Dr=Jt.r,Tt=new qe(32768);for(ne=0;ne<32768;++ne)Me=(ne&43690)>>1|(ne&21845)<<1,Me=(Me&52428)>>2|(Me&13107)<<2,Me=(Me&61680)>>4|(Me&3855)<<4,Tt[ne]=((Me&65280)>>8|(Me&255)<<8)>>1;var Me,ne,tt=(function(n,e,s){for(var o=n.length,c=0,x=new qe(e);c<o;++c)n[c]&&++x[n[c]-1];var h=new qe(e);for(c=1;c<e;++c)h[c]=h[c-1]+x[c-1]<<1;var W;if(s){W=new qe(1<<e);var B=15-e;for(c=0;c<o;++c)if(n[c])for(var re=c<<4|n[c],ae=e-n[c],g=h[n[c]-1]++<<ae,V=g|(1<<ae)-1;g<=V;++g)W[Tt[g]>>B]=re}else for(W=new qe(o),c=0;c<o;++c)n[c]&&(W[c]=Tt[h[n[c]-1]++]>>15-n[c]);return W}),nt=new xe(288);for(ne=0;ne<144;++ne)nt[ne]=8;var ne;for(ne=144;ne<256;++ne)nt[ne]=9;var ne;for(ne=256;ne<280;++ne)nt[ne]=7;var ne;for(ne=280;ne<288;++ne)nt[ne]=8;var ne,qt=new xe(32);for(ne=0;ne<32;++ne)qt[ne]=5;var ne;var Yn=tt(nt,9,1);var Xn=tt(qt,5,1),St=function(n){for(var e=n[0],s=1;s<n.length;++s)n[s]>e&&(e=n[s]);return e},_e=function(n,e,s){var o=e/8|0;return(n[o]|n[o+1]<<8)>>(e&7)&s},Et=function(n,e){var s=e/8|0;return(n[s]|n[s+1]<<8|n[s+2]<<16)>>(e&7)},Kn=function(n){return(n+7)/8|0},Qn=function(n,e,s){return(e==null||e<0)&&(e=0),(s==null||s>n.length)&&(s=n.length),new xe(n.subarray(e,s))};var er=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],je=function(n,e,s){var o=new Error(e||er[n]);if(o.code=n,Error.captureStackTrace&&Error.captureStackTrace(o,je),!s)throw o;return o},tr=function(n,e,s,o){var c=n.length,x=o?o.length:0;if(!c||e.f&&!e.l)return s||new xe(0);var h=!s,W=h||e.i!=2,B=e.i;h&&(s=new xe(c*3));var re=function(lt){var ut=s.length;if(lt>ut){var ct=new xe(Math.max(ut*2,lt));ct.set(s),s=ct}},ae=e.f||0,g=e.p||0,V=e.b||0,ee=e.l,ce=e.d,ge=e.m,pe=e.n,fe=c*8;do{if(!ee){ae=_e(n,g,1);var q=_e(n,g+1,3);if(g+=3,q)if(q==1)ee=Yn,ce=Xn,ge=9,pe=5;else if(q==2){var Te=_e(n,g,31)+257,Z=_e(n,g+10,15)+4,U=Te+_e(n,g+5,31)+1;g+=14;for(var Pe=new xe(U),$e=new xe(19),ye=0;ye<Z;++ye)$e[qn[ye]]=_e(n,g+ye*3,7);g+=Z*3;for(var Ze=St($e),ie=(1<<Ze)-1,we=tt($e,Ze,1),ye=0;ye<U;){var ot=we[_e(n,g,ie)];g+=ot&15;var me=ot>>4;if(me<16)Pe[ye++]=me;else{var Ie=0,Ne=0;for(me==16?(Ne=3+_e(n,g,3),g+=2,Ie=Pe[ye-1]):me==17?(Ne=3+_e(n,g,7),g+=3):me==18&&(Ne=11+_e(n,g,127),g+=7);Ne--;)Pe[ye++]=Ie}}var He=Pe.subarray(0,Te),Ae=Pe.subarray(Te);ge=St(He),pe=St(Ae),ee=tt(He,ge,1),ce=tt(Ae,pe,1)}else je(1);else{var me=Kn(g)+4,Ue=n[me-4]|n[me-3]<<8,De=me+Ue;if(De>c){B&&je(0);break}W&&re(V+Ue),s.set(n.subarray(me,De),V),e.b=V+=Ue,e.p=g=De*8,e.f=ae;continue}if(g>fe){B&&je(0);break}}W&&re(V+131072);for(var bt=(1<<ge)-1,at=(1<<pe)-1,Ye=g;;Ye=g){var Ie=ee[Et(n,g)&bt],l=Ie>>4;if(g+=Ie&15,g>fe){B&&je(0);break}if(Ie||je(2),l<256)s[V++]=l;else if(l==256){Ye=g,ee=null;break}else{var le=l-254;if(l>264){var ye=l-257,Be=Bt[ye];le=_e(n,g,(1<<Be)-1)+Gt[ye],g+=Be}var Le=ce[Et(n,g)&at],Fe=Le>>4;Le||je(3),g+=Le&15;var Ae=Hn[Fe];if(Fe>3){var Be=Vt[Fe];Ae+=Et(n,g)&(1<<Be)-1,g+=Be}if(g>fe){B&&je(0);break}W&&re(V+131072);var he=V+le;if(V<Ae){var Xe=x-Ae,xt=Math.min(Ae,he);for(Xe+V<0&&je(3);V<xt;++V)s[V]=o[Xe+V]}for(;V<he;++V)s[V]=s[V-Ae]}}e.l=ee,e.p=Ye,e.b=V,e.f=ae,ee&&(ae=1,e.m=ge,e.d=ce,e.n=pe)}while(!ae);return V!=s.length&&h?Qn(s,0,V):s.subarray(0,V)};var nr=new xe(0);var rr=function(n){(n[0]!=31||n[1]!=139||n[2]!=8)&&je(6,"invalid gzip data");var e=n[3],s=10;e&4&&(s+=(n[10]|n[11]<<8)+2);for(var o=(e>>3&1)+(e>>4&1);o>0;o-=!n[s++]);return s+(e&2)},ir=function(n){var e=n.length;return(n[e-4]|n[e-3]<<8|n[e-2]<<16|n[e-1]<<24)>>>0};function Zt(n,e){var s=rr(n);return s+8>n.length&&je(6,"invalid gzip data"),tr(n.subarray(s,-8),{i:2},e&&e.out||new xe(ir(n)),e&&e.dictionary)}var sr=typeof TextDecoder<"u"&&new TextDecoder,or=0;try{sr.decode(nr,{stream:!0}),or=1}catch{}function ar(n){let e=/^sha512-(.+)$/.exec(n.trim());return e?e[1]:null}async function lr(n){let e=await crypto.subtle.digest("SHA-512",n),s=new Uint8Array(e),o="";for(let c of s)o+=String.fromCharCode(c);return btoa(o)}async function Ht(n,e){let s=ar(e);return s?await lr(n)===s:!1}function gt(n,e,s){let o=e,c=Math.min(e+s,n.length);for(;o<c&&n[o]!==0;)o++;let x="";for(let h=e;h<o;h++)x+=String.fromCharCode(n[h]);return x}function ur(n,e,s){let o=gt(n,e,s).trim();return o&&parseInt(o,8)||0}function cr(n){let e=[],s=0,o=null;for(;s+512<=n.length;){let c=n.subarray(s,s+512);if(c.every(g=>g===0))break;let x=gt(c,0,100),h=gt(c,345,155);h&&(x=h+"/"+x),o&&(x=o,o=null);let W=ur(c,124,12),B=String.fromCharCode(c[156]),re=s+512,ae=Math.ceil(W/512)*512;if(B==="L")o=gt(n,re,W).replace(/\0+$/,"");else if(B==="0"||B==="\0"||B===""){let g=x.replace(/^package\//,"");g&&!g.endsWith("/")&&e.push({name:g,data:n.slice(re,re+W)})}s=re+ae}return e}function Yt(n){return cr(Zt(n))}function Xt(n){if(n.startsWith("/")||n.includes("\0"))return!1;let e=n.split("/"),s=0;for(let o of e)if(o===".."){if(s--,s<0)return!1}else o!=="."&&o!==""&&s++;return!0}var fr=["install","postinstall","preinstall","prepare"];function Kt(n,e){let s=n.name??"package";if(n.gypfile===!0)return`${s} \u4F7F\u7528 node-gyp \u539F\u751F\u7F16\u8BD1`;if(e.some(c=>c==="binding.gyp"||c.endsWith("/binding.gyp")))return`${s} \u542B binding.gyp \u539F\u751F\u6A21\u5757`;if(n.binary)return`${s} \u9700\u4E0B\u8F7D\u539F\u751F\u4E8C\u8FDB\u5236\uFF08node-pre-gyp\uFF09`;let o=n.scripts??{};for(let c of fr){let x=o[c];if(x&&/node-gyp|prebuild|node-pre-gyp|cmake|make\b|\.node\b/.test(x))return`${s} \u7684 ${c} \u811A\u672C\u9700\u539F\u751F\u6784\u5EFA`}return null}var Qt="\u8BE5\u5305\u9700\u8981\u539F\u751F\u6784\u5EFA\uFF0CWebView \u8FD0\u884C\u65F6\u4E0D\u652F\u6301\u3002\u8BF7\u6539\u7528 wasm \u53D8\u4F53\uFF08\u5982 esbuild-wasm\u3001@rollup/wasm-node\uFF09\uFF0C\u6216\u79FB\u9664\u8BE5\u4F9D\u8D56\u3002";var en="https://registry.npmjs.org";async function tn(n,e,s,o){var re,ae;let c={},x={},h=Object.entries(n).map(([g,V])=>({name:g,range:V})),W=0,B=new Set;for(;h.length;){let{name:g,range:V}=h.shift();if(!B.has(g)){B.add(g),o.progress(Math.min(.95,W/Math.max(1,W+h.length+1)),`\u5B89\u88C5 ${g}`);try{let ee=await e.fetch(`${en}/${encodeURIComponent(g)}`),ce=JSON.parse(new TextDecoder().decode(ee)),ge=Object.keys(ce.versions??{}),pe=Nt(ge,V);if(!pe)return{ok:!1,installed:c,lock:x,error:`${g}@${V} \u6CA1\u6709\u5339\u914D\u7684\u7248\u672C`};let fe=ce.versions[pe],q=((re=fe.dist)==null?void 0:re.integrity)??"",me=((ae=fe.dist)==null?void 0:ae.tarball)??`${en}/${g}/-/${g}-${pe}.tgz`,Ue=await e.fetch(me,q);if(q&&!await Ht(Ue,q))return{ok:!1,installed:c,lock:x,error:`${g}@${pe} \u5B8C\u6574\u6027\u6821\u9A8C\u5931\u8D25`};let De=Yt(Ue),Te=Kt(fe,De.map(Z=>Z.name));if(Te)return{ok:!1,installed:c,lock:x,error:`${Te}\u3002${Qt}`};for(let Z of De)Xt(Z.name)&&s.write(`node_modules/${g}/${Z.name}`,Z.data);c[g]=pe,x[g]={version:pe,integrity:q},W++;for(let[Z,U]of Object.entries(fe.dependencies??{}))B.has(Z)||h.push({name:Z,range:U})}catch(ee){return{ok:!1,installed:c,lock:x,error:`\u5B89\u88C5 ${g} \u5931\u8D25\uFF1A${String(ee)}`}}}}return s.writeText("package-lock.json",JSON.stringify({lockfileVersion:3,packages:x},null,2)),o.progress(1,"\u5B89\u88C5\u5B8C\u6210"),{ok:!0,installed:c,lock:x}}function Oe(n){if(n.includes("\0"))return null;let e=n.replace(/\\/g,"/").split("/"),s=[];for(let o of e)if(!(o===""||o==="."))if(o===".."){if(s.length===0)return null;s.pop()}else s.push(o);return s.join("/")}var mt=class{constructor(){this.files=new Map}write(e,s){let o=Oe(e);return o===null?!1:(this.files.set(o,s),!0)}writeText(e,s){return this.write(e,new TextEncoder().encode(s))}read(e){let s=Oe(e);return s===null?null:this.files.get(s)??null}readText(e){let s=this.read(e);return s?new TextDecoder().decode(s):null}exists(e){let s=Oe(e);return s!==null&&this.files.has(s)}delete(e){let s=Oe(e);s!==null&&this.files.delete(s)}evictPrefix(e){let s=Oe(e);if(s===null)return 0;let o=0;for(let c of[...this.files.keys()])(c===s||c.startsWith(s+"/"))&&(this.files.delete(c),o++);return o}list(e=""){let s=Oe(e)??"";return[...this.files.keys()].filter(o=>s===""||o===s||o.startsWith(s+"/")).sort()}get size(){return this.files.size}};var yt=Vn(nn(),1);var rt=null;function jt(){return typeof window<"u"&&window.VueCompilerSFC?Promise.resolve(window.VueCompilerSFC):rt||(rt=new Promise((n,e)=>{let s=document.createElement("script");s.src="vue-compiler.js",s.onload=()=>{let o=window.VueCompilerSFC;o?n(o):e(new Error("Vue \u7F16\u8BD1\u5668\u52A0\u8F7D\u540E\u4E0D\u53EF\u7528"))},s.onerror=()=>{rt=null,e(new Error("Vue \u7F16\u8BD1\u5668\u52A0\u8F7D\u5931\u8D25\uFF08vue-compiler.js\uFF09"))},document.head.appendChild(s)}),rt)}function rn(n){let e=2166136261;for(let s=0;s<n.length;s++)e^=n.charCodeAt(s),e=Math.imul(e,16777619)>>>0;return"data-v-"+e.toString(16).padStart(8,"0")}function vt(n){return typeof n=="string"?n:(n==null?void 0:n.message)??String(n)}async function sn(n,e,s){var ee,ce,ge,pe;let o=s??await jt(),c=rn(e).replace(/^data-v-/,""),x=rn(e),{descriptor:h,errors:W}=o.parse(n,{filename:e});if(W.length)throw new Error(`${e}: ${vt(W[0])}`);let B=((ee=h.script)==null?void 0:ee.lang)==="ts"||((ce=h.scriptSetup)==null?void 0:ce.lang)==="ts"||((ge=h.script)==null?void 0:ge.lang)==="tsx"||((pe=h.scriptSetup)==null?void 0:pe.lang)==="tsx",re={compilerOptions:{expressionPlugins:B?["typescript"]:[]}},ae=h.styles.some(fe=>fe.scoped),g;if(h.script||h.scriptSetup){if(g=o.compileScript(h,{id:c,inlineTemplate:!0,genDefaultAs:"_sfc_main",templateOptions:re}).content,!h.scriptSetup&&h.template){let q=o.compileTemplate({source:h.template.content,filename:e,id:c,compilerOptions:{...re.compilerOptions,bindingMetadata:void 0}});if(q.errors.length)throw new Error(`${e}: ${vt(q.errors[0])}`);g+=`
`+q.code.replace("export function render","function _sfc_render"),g+=`
_sfc_main.render = _sfc_render;`}}else if(h.template){let fe=o.compileTemplate({source:h.template.content,filename:e,id:c});if(fe.errors.length)throw new Error(`${e}: ${vt(fe.errors[0])}`);g=fe.code.replace("export function render","function _sfc_render"),g+=`
const _sfc_main = { render: _sfc_render };`}else g="const _sfc_main = {};";ae&&(g+=`
_sfc_main.__scopeId = ${JSON.stringify(x)};`),g+=`
export default _sfc_main;`;let V=[];for(let fe of h.styles){let q=await o.compileStyleAsync({source:fe.content,filename:e,id:x,scoped:!!fe.scoped});if(q.errors.length)throw new Error(`${e}: ${vt(q.errors[0])}`);V.push(q.code)}return V.length&&(g+=`
{const __sfc_css = ${JSON.stringify(V.join(`
`))};const __sfc_el = document.createElement("style");__sfc_el.textContent = __sfc_css;document.head.appendChild(__sfc_el);}`),{code:g,loader:B?"ts":"js"}}var on=!1;async function an(n){on||(await yt.initialize({wasmURL:n,worker:!1}),on=!0)}var hr={".js":"js",".mjs":"js",".cjs":"js",".jsx":"jsx",".ts":"ts",".tsx":"tsx",".css":"css",".json":"json",".txt":"text",".svg":"text"};function dr(n){let e=n.lastIndexOf(".");return hr[e>=0?n.slice(e):""]??"js"}function pr(n,e,s){let o=(x,h)=>{let W=(x?x.split("/"):[]).concat(h.split("/")),B=[];for(let re of W)re===""||re==="."||(re===".."?B.pop():B.push(re));return B.join("/")},c=[];if(s.startsWith(".")||s.startsWith("/")){let x=s.startsWith("/")?"":e.split("/").slice(0,-1).join("/"),h=s.startsWith("/")?s.slice(1):o(x,s);c.push(h,h+".js",h+".jsx",h+".ts",h+".tsx",h+".vue",h+".json",h+"/index.js")}else{let x="node_modules/"+s,h=n.readText(x+"/package.json");if(h)try{let W=JSON.parse(h),B=W.module||W.main||"index.js";c.push(o(x,B))}catch{c.push(x+"/index.js")}c.push(x+"/index.js",x+".js")}for(let x of c)if(n.exists(x))return x;return null}function gr(n){return{name:"wvi-memfs",setup(e){e.onResolve({filter:/.*/},s=>{if(s.kind==="entry-point")return{path:s.path,namespace:"wvi"};let o=pr(n,s.importer,s.path);return o?{path:o,namespace:"wvi"}:{path:s.path,namespace:"wvi"}}),e.onLoad({filter:/.*/,namespace:"wvi"},async s=>{let o=n.read(s.path);if(!o)return{errors:[{text:"\u627E\u4E0D\u5230\u6A21\u5757 "+s.path}]};if(s.path.endsWith(".vue"))try{let c=await sn(new TextDecoder().decode(o),s.path);return{contents:c.code,loader:c.loader}}catch(c){return{errors:[{text:String((c==null?void 0:c.message)??c)}]}}return{contents:o,loader:dr(s.path)}})}}}async function ln(n,e){return((await yt.build({entryPoints:[e],bundle:!0,minify:!0,write:!1,outdir:"dist",format:"iife",target:["chrome90"],plugins:[gr(n)],define:{"process.env.NODE_ENV":'"production"',__VUE_OPTIONS_API__:"true",__VUE_PROD_DEVTOOLS__:"false",__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:"false"},logLevel:"silent"})).outputFiles??[]).map(o=>({path:o.path.replace(/^\/?dist\//,""),contents:o.contents}))}var it=null;function un(n){return window.ts?Promise.resolve(window.ts):it||(it=new Promise((e,s)=>{let o=document.createElement("script");o.src=n.replace(/\/?$/,"/")+"typescript.js",o.onload=()=>window.ts?e(window.ts):s(new Error("TypeScript \u52A0\u8F7D\u540E\u4E0D\u53EF\u7528")),o.onerror=()=>{it=null,s(new Error("TypeScript \u52A0\u8F7D\u5931\u8D25"))},document.head.appendChild(o)}),it)}var mr=`declare module "*.vue" {
  const component: any;
  export default component;
}
`;async function cn(n,e,s){let o=s??window.ts;if(!o)throw new Error("TypeScript \u672A\u52A0\u8F7D");let c=new Map;for(let g of n.list()){if(g.startsWith("dist/"))continue;let V=n.readText(g);V!==null&&c.set("/"+g,V)}c.set("/__wvi_vue_shim.d.ts",mr),c.set("/__wvi_libs.d.ts",e);let x=[...c.keys()].filter(g=>(g.endsWith(".ts")||g.endsWith(".tsx"))&&!g.endsWith(".d.ts")&&!g.includes("/node_modules/"));if(x.length===0)return{ok:!0,errors:[],checkedFiles:0};let h={target:o.ScriptTarget.ES2020,module:o.ModuleKind.ESNext,moduleResolution:o.ModuleResolutionKind.Bundler??o.ModuleResolutionKind.Node10,jsx:o.JsxEmit.ReactJSX,strict:!0,noEmit:!0,skipLibCheck:!0,allowJs:!1,types:[]},W={getSourceFile:(g,V)=>{let ee=g.startsWith("/")?g:"/"+Oe(g),ce=c.get(ee??g);if(ce!==void 0)return o.createSourceFile(g,ce,V,!0)},writeFile:()=>{},getDefaultLibFileName:()=>"/__wvi_libs.d.ts",useCaseSensitiveFileNames:()=>!0,getCanonicalFileName:g=>g,getCurrentDirectory:()=>"/",getNewLine:()=>`
`,fileExists:g=>c.has(g.startsWith("/")?g:"/"+Oe(g)),readFile:g=>c.get(g.startsWith("/")?g:"/"+Oe(g)),directoryExists:g=>{let V=g.endsWith("/")?g:g+"/";for(let ee of c.keys())if(ee.startsWith(V))return!0;return!1},getDirectories:()=>[]},B=o.createProgram([...x,"/__wvi_vue_shim.d.ts","/__wvi_libs.d.ts"],h,W),re=[...B.getSemanticDiagnostics(),...B.getSyntacticDiagnostics()],ae=[];for(let g of re){let V=o.flattenDiagnosticMessageText(g.messageText,`
`);if(g.file&&typeof g.start=="number"){let{line:ee,character:ce}=g.file.getLineAndCharacterOfPosition(g.start),ge=g.file.fileName.replace(/^\//,"");ae.push(`${ge}:${ee+1}:${ce+1} ${V}`)}else ae.push(V)}return{ok:ae.length===0,errors:ae,checkedFiles:x.length}}function oe(n,e,s){var o;(o=window.WviBuild)==null||o.post(JSON.stringify({id:s??0,type:n,payload:e}))}var ve=new mt,Pt=new Map,vr=0,$t=new Map,yr=0;function fn(n,e){return new Promise(s=>{let o=++yr;$t.set(o,s),oe("fsWrite",{path:n,text:e},o)})}var At=new Map,wr=0;function br(n){return new Promise(e=>{let s=++wr;At.set(s,e),oe("fsRead",{path:n},s)})}function dn(n){let e=atob(n),s=new Uint8Array(e.length);for(let o=0;o<e.length;o++)s[o]=e.charCodeAt(o);return s}function xr(n){let e="";for(let s=0;s<n.length;s++)e+=String.fromCharCode(n[s]);return btoa(e)}var Ct=new Map,kr=0;function Ot(n){return new Promise(e=>{let s=++kr;Ct.set(s,o=>e(o===null?null:dn(o))),oe("readSource",{path:n},s)})}var Ut=new Map,Sr=0;function Dt(){return new Promise(n=>{let e=++Sr;Ut.set(e,n),oe("listSource",{},e)})}var Rt=new Map,Er=0;function hn(n,e){return new Promise(s=>{let o=++Er;Rt.set(o,s),oe("writeDist",{path:n,b64:xr(e)},o)})}var wt="",st="";async function Tr(n){for(let x=0;x<600&&!st;x++)await new Promise(h=>setTimeout(h,100));if(!st){oe("tcdone",{ok:!1,summary:"TypeScript \u672A\u5C31\u7EEA"},n);return}Ee.progress(.2,"\u52A0\u8F7D\u7C7B\u578B\u68C0\u67E5\u5668");let e=await un(st),s=await(await fetch(st.replace(/\/?$/,"/")+"libs.d.ts")).text();Ee.progress(.4,"\u8BFB\u53D6\u6E90\u6587\u4EF6");let o=await Dt();for(let x of o){if(x.startsWith("dist/"))continue;let h=await Ot(x);h&&ve.write(x,h)}Ee.progress(.6,"tsc \u7C7B\u578B\u68C0\u67E5\uFF08.ts/.tsx\uFF09");let c=await cn(ve,s,e);for(let x of c.errors.slice(0,100))Ee.log("error",x);Ee.progress(1,"\u7C7B\u578B\u68C0\u67E5\u5B8C\u6210"),oe("tcdone",{ok:c.ok,summary:c.checkedFiles===0?"\u6CA1\u6709 .ts/.tsx \u6587\u4EF6\u53EF\u68C0\u67E5":c.ok?`\u7C7B\u578B\u68C0\u67E5\u901A\u8FC7\uFF08${c.checkedFiles} \u4E2A\u6587\u4EF6\uFF09`:`\u53D1\u73B0 ${c.errors.length} \u4E2A\u7C7B\u578B\u9519\u8BEF\uFF08\u4E0D\u5F71\u54CD\u6784\u5EFA\uFF09`},n)}var _r={fetch(n,e){return new Promise(s=>{let o=++vr;Pt.set(o,s),oe("net",{url:n,method:"GET",integrity:e??""},o)})}},Ee={log(n,e){oe("log",{level:n,text:e})},progress(n,e){oe("progress",{fraction:n,label:e})}};async function jr(n){let e=ve.readText("package.json");if(e||(e=await br("package.json"),e&&ve.writeText("package.json",e)),!e){oe("done",{ok:!1,summary:"\u7F3A\u5C11 package.json"},n);return}let s=JSON.parse(e),o=await tn(s.dependencies??{},_r,ve,Ee);if(o.ok){let c=ve.list("node_modules"),x=0;for(let W of c){let B=ve.readText(W);B!==null&&await fn(W,B)&&x++}let h=ve.readText("package-lock.json");h!==null&&await fn("package-lock.json",h),ve.evictPrefix("node_modules"),Ee.log("info",`\u5DF2\u5199\u76D8 ${x} \u4E2A\u4F9D\u8D56\u6587\u4EF6`),oe("done",{ok:!0,summary:`\u5DF2\u5B89\u88C5 ${Object.keys(o.installed).length} \u4E2A\u5305`},n)}else oe("error",{message:o.error??"\u5B89\u88C5\u5931\u8D25"},n),oe("done",{ok:!1,summary:o.error??"\u5B89\u88C5\u5931\u8D25"},n)}async function Pr(){for(let n=0;n<600&&!wt;n++)await new Promise(e=>setTimeout(e,100));return!!wt}async function $r(n){if(!await Pr()){oe("done",{ok:!1,summary:"esbuild wasm \u672A\u5C31\u7EEA"},n);return}Ee.progress(.1,"\u52A0\u8F7D\u6E90\u6587\u4EF6");let e=await Dt();for(let h of e){if(h.startsWith("dist/")||h.startsWith("node_modules/"))continue;let W=await Ot(h);W&&ve.write(h,W)}let s=await Dt();for(let h of s){if(!h.startsWith("node_modules/"))continue;let W=await Ot(h);W&&ve.write(h,W)}let o=["src/main.tsx","src/main.jsx","src/main.ts","src/main.js","main.js","index.js"].find(h=>ve.exists(h));if(!o){oe("done",{ok:!1,summary:"\u627E\u4E0D\u5230\u5165\u53E3\uFF08src/main.* \u6216 index.js\uFF09"},n);return}ve.list("src").some(h=>h.endsWith(".vue"))&&(Ee.progress(.3,"\u52A0\u8F7D Vue \u7F16\u8BD1\u5668"),await jt()),Ee.progress(.4,"esbuild \u6253\u5305\uFF08TS/JSX \u4EC5\u8F6C\u8BD1\uFF0C\u4E0D\u505A\u7C7B\u578B\u68C0\u67E5\uFF09"),await an(wt);let c=await ln(ve,o);Ee.progress(.8,"\u5199\u51FA dist");for(let h of c)await hn("dist/"+h.path,h.contents);let x=ve.readText("index.html");x&&await hn("dist/index.html",new TextEncoder().encode(x)),Ee.progress(1,"\u6784\u5EFA\u5B8C\u6210"),oe("done",{ok:!0,summary:`\u6784\u5EFA\u5B8C\u6210\uFF0C${c.length} \u4E2A\u4EA7\u7269`},n)}function Ar(n){let e=n.id??0,s=n.payload??{};switch(n.type){case"install":jr(e);break;case"build":$r(e).catch(o=>{oe("error",{message:String(o)},e),oe("done",{ok:!1,summary:String(o)},e)});break;case"wasmUrl":wt=String(s.url??"");break;case"tsUrl":st=String(s.url??"");break;case"typecheck":Tr(e).catch(o=>{oe("error",{message:String(o)},e),oe("tcdone",{ok:!1,summary:String(o)},e)});break;case"cancel":oe("done",{ok:!1,summary:"cancelled"},e);break;case"netResponse":{let o=Pt.get(e);o&&(Pt.delete(e),o(dn(String(s.body??""))));break}case"fsWriteResponse":{let o=$t.get(e);o&&($t.delete(e),o(!!s.ok));break}case"fsReadResponse":{let o=At.get(e);o&&(At.delete(e),o(s.exists?String(s.text??""):null));break}case"readSourceResponse":{let o=Ct.get(e);o&&(Ct.delete(e),o(s.exists?String(s.b64??""):null));break}case"listSourceResponse":{let o=Ut.get(e);o&&(Ut.delete(e),o(Array.isArray(s.paths)?s.paths:[]));break}case"writeDistResponse":{let o=Rt.get(e);o&&(Rt.delete(e),o(!!s.ok));break}default:break}}window.__wviBuildReceive=n=>{try{Ar(JSON.parse(n))}catch(e){oe("error",{message:String(e)})}};var Cr=0;function pn(){if(window.WviBuild){oe("ready",{});return}++Cr<100&&setTimeout(pn,50)}pn();})();

"use strict";(()=>{var Cn=Object.create;var Rt=Object.defineProperty;var On=Object.getOwnPropertyDescriptor;var Un=Object.getOwnPropertyNames;var Dn=Object.getPrototypeOf,Rn=Object.prototype.hasOwnProperty;var In=(n,t)=>()=>(t||n((t={exports:{}}).exports,t),t.exports);var Mn=(n,t,s,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let f of Un(t))!Rn.call(n,f)&&f!==s&&Rt(n,f,{get:()=>t[f],enumerable:!(a=On(t,f))||a.enumerable});return n};var zn=(n,t,s)=>(s=n!=null?Cn(Dn(n)):{},Mn(t||!n||!n.__esModule?Rt(s,"default",{value:n,enumerable:!0}):s,n));var Qt=In((Fr,Et)=>{(n=>{"use strict";var t=Object.defineProperty,s=Object.getOwnPropertyDescriptor,a=Object.getOwnPropertyNames,f=Object.prototype.hasOwnProperty,k=(e,i)=>{for(var o in i)t(e,o,{get:i[o],enumerable:!0})},g=(e,i,o,h)=>{if(i&&typeof i=="object"||typeof i=="function")for(let x of a(i))!f.call(e,x)&&x!==o&&t(e,x,{get:()=>i[x],enumerable:!(h=s(i,x))||h.enumerable});return e},B=e=>g(t({},"__esModule",{value:!0}),e),V=(e,i,o)=>new Promise((h,x)=>{var E=v=>{try{O(o.next(v))}catch(W){x(W)}},b=v=>{try{O(o.throw(v))}catch(W){x(W)}},O=v=>v.done?h(v.value):Promise.resolve(v.value).then(E,b);O((o=o.apply(e,i)).next())}),ne={};k(ne,{analyzeMetafile:()=>wn,analyzeMetafileSync:()=>kn,build:()=>gn,buildSync:()=>bn,context:()=>mn,default:()=>_n,formatMessages:()=>yn,formatMessagesSync:()=>Sn,initialize:()=>Tn,stop:()=>En,transform:()=>vn,transformSync:()=>xn,version:()=>pn}),n.exports=B(ne);function he(e){let i=h=>{if(h===null)o.write8(0);else if(typeof h=="boolean")o.write8(1),o.write8(+h);else if(typeof h=="number")o.write8(2),o.write32(h|0);else if(typeof h=="string")o.write8(3),o.write(re(h));else if(h instanceof Uint8Array)o.write8(4),o.write(h);else if(h instanceof Array){o.write8(5),o.write32(h.length);for(let x of h)i(x)}else{let x=Object.keys(h);o.write8(6),o.write32(x.length);for(let E of x)o.write(re(E)),i(h[E])}},o=new H;return o.write32(0),o.write32(e.id<<1|+!e.isRequest),i(e.value),le(o.buf,o.len-4,0),o.buf.subarray(0,o.len)}function P(e){let i=()=>{switch(o.read8()){case 0:return null;case 1:return!!o.read8();case 2:return o.read32();case 3:return pe(o.read());case 4:return o.read();case 5:{let b=o.read32(),O=[];for(let v=0;v<b;v++)O.push(i());return O}case 6:{let b=o.read32(),O={};for(let v=0;v<b;v++)O[pe(o.read())]=i();return O}default:throw new Error("Invalid packet")}},o=new H(e),h=o.read32(),x=(h&1)===0;h>>>=1;let E=i();if(o.ptr!==e.length)throw new Error("Invalid packet");return{id:h,isRequest:x,value:E}}var H=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let i=new Uint8Array((this.len+e)*2);i.set(this.buf),this.buf=i}return this.len+=e,this.len-e}write8(e){let i=this._write(1);this.buf[i]=e}write32(e){let i=this._write(4);le(this.buf,e,i)}write(e){let i=this._write(4+e.length);le(this.buf,e.length,i),this.buf.set(e,i+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return de(this.buf,this._read(4))}read(){let e=this.read32(),i=new Uint8Array(e),o=this._read(i.length);return i.set(this.buf.subarray(o,o+e)),i}},re,pe,me;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,i=new TextDecoder;re=o=>e.encode(o),pe=o=>i.decode(o),me='new TextEncoder().encode("")'}else if(typeof Buffer<"u")re=e=>Buffer.from(e),pe=e=>{let{buffer:i,byteOffset:o,byteLength:h}=e;return Buffer.from(i,o,h).toString()},me='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(re("")instanceof Uint8Array))throw new Error(`Invariant violation: "${me} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function de(e,i){return e[i++]|e[i++]<<8|e[i++]<<16|e[i++]<<24}function le(e,i,o){e[o++]=i,e[o++]=i>>8,e[o++]=i>>16,e[o++]=i>>24}var q=JSON.stringify,ge="warning",Ce="silent";function Oe(e){if(ue(e,"target"),e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var Ee=()=>null,J=e=>typeof e=="boolean"?null:"a boolean",U=e=>typeof e=="string"?null:"a string",_e=e=>e instanceof RegExp?null:"a RegExp object",Pe=e=>typeof e=="number"&&e===(e|0)?null:"an integer",ve=e=>typeof e=="number"&&e===(e|0)&&e>=0&&e<=65535?null:"a valid port number",Ze=e=>typeof e=="function"?null:"a function",ie=e=>Array.isArray(e)?null:"an array",ye=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",it=e=>typeof e=="object"&&e!==null?null:"an array or an object",Re=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",ze=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",He=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",$e=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",yt=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",st=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",Ye=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function l(e,i,o,h){let x=e[o];if(i[o+""]=!0,x===void 0)return;let E=h(x);if(E!==null)throw new Error(`${q(o)} must be ${E}`);return x}function oe(e,i,o){for(let h in e)if(!(h in i))throw new Error(`Invalid option ${o}: ${q(h)}`)}function Fe(e){let i=Object.create(null),o=l(e,i,"wasmURL",Ye),h=l(e,i,"wasmModule",Re),x=l(e,i,"worker",J);return oe(e,i,"in initialize() call"),{wasmURL:o,wasmModule:h,worker:x}}function Le(e){let i;if(e!==void 0){i=Object.create(null);for(let o in e){let h=e[o];if(typeof h=="string"||h===!1)i[o]=h;else throw new Error(`Expected ${q(o)} in mangle cache to map to either a string or false`)}}return i}function Ie(e,i,o,h,x){let E=l(i,o,"color",J),b=l(i,o,"logLevel",U),O=l(i,o,"logLimit",Pe);E!==void 0?e.push(`--color=${E}`):h&&e.push("--color=true"),e.push(`--log-level=${b||x}`),e.push(`--log-limit=${O||0}`)}function ue(e,i,o){if(typeof e!="string")throw new Error(`Expected value for ${i}${o!==void 0?" "+q(o):""} to be a string, got ${typeof e} instead`);return e}function Xe(e,i,o){let h=l(i,o,"legalComments",U),x=l(i,o,"sourceRoot",U),E=l(i,o,"sourcesContent",J),b=l(i,o,"target",yt),O=l(i,o,"format",U),v=l(i,o,"globalName",U),W=l(i,o,"mangleProps",_e),G=l(i,o,"reserveProps",_e),z=l(i,o,"mangleQuoted",J),K=l(i,o,"minify",J),L=l(i,o,"minifySyntax",J),Y=l(i,o,"minifyWhitespace",J),X=l(i,o,"minifyIdentifiers",J),I=l(i,o,"lineLimit",Pe),ae=l(i,o,"drop",ie),R=l(i,o,"dropLabels",ie),D=l(i,o,"charset",U),S=l(i,o,"treeShaking",J),y=l(i,o,"ignoreAnnotations",J),u=l(i,o,"jsx",U),p=l(i,o,"jsxFactory",U),m=l(i,o,"jsxFragment",U),T=l(i,o,"jsxImportSource",U),A=l(i,o,"jsxDev",J),d=l(i,o,"jsxSideEffects",J),w=l(i,o,"define",ye),$=l(i,o,"logOverride",ye),r=l(i,o,"supported",ye),c=l(i,o,"pure",ie),_=l(i,o,"keepNames",J),j=l(i,o,"platform",U),M=l(i,o,"tsconfigRaw",$e);if(h&&e.push(`--legal-comments=${h}`),x!==void 0&&e.push(`--source-root=${x}`),E!==void 0&&e.push(`--sources-content=${E}`),b&&(Array.isArray(b)?e.push(`--target=${Array.from(b).map(Oe).join(",")}`):e.push(`--target=${Oe(b)}`)),O&&e.push(`--format=${O}`),v&&e.push(`--global-name=${v}`),j&&e.push(`--platform=${j}`),M&&e.push(`--tsconfig-raw=${typeof M=="string"?M:JSON.stringify(M)}`),K&&e.push("--minify"),L&&e.push("--minify-syntax"),Y&&e.push("--minify-whitespace"),X&&e.push("--minify-identifiers"),I&&e.push(`--line-limit=${I}`),D&&e.push(`--charset=${D}`),S!==void 0&&e.push(`--tree-shaking=${S}`),y&&e.push("--ignore-annotations"),ae)for(let N of ae)e.push(`--drop:${ue(N,"drop")}`);if(R&&e.push(`--drop-labels=${Array.from(R).map(N=>ue(N,"dropLabels")).join(",")}`),W&&e.push(`--mangle-props=${W.source}`),G&&e.push(`--reserve-props=${G.source}`),z!==void 0&&e.push(`--mangle-quoted=${z}`),u&&e.push(`--jsx=${u}`),p&&e.push(`--jsx-factory=${p}`),m&&e.push(`--jsx-fragment=${m}`),T&&e.push(`--jsx-import-source=${T}`),A&&e.push("--jsx-dev"),d&&e.push("--jsx-side-effects"),w)for(let N in w){if(N.indexOf("=")>=0)throw new Error(`Invalid define: ${N}`);e.push(`--define:${N}=${ue(w[N],"define",N)}`)}if($)for(let N in $){if(N.indexOf("=")>=0)throw new Error(`Invalid log override: ${N}`);e.push(`--log-override:${N}=${ue($[N],"log override",N)}`)}if(r)for(let N in r){if(N.indexOf("=")>=0)throw new Error(`Invalid supported: ${N}`);let F=r[N];if(typeof F!="boolean")throw new Error(`Expected value for supported ${q(N)} to be a boolean, got ${typeof F} instead`);e.push(`--supported:${N}=${F}`)}if(c)for(let N of c)e.push(`--pure:${ue(N,"pure")}`);_&&e.push("--keep-names")}function wt(e,i,o,h,x){var E;let b=[],O=[],v=Object.create(null),W=null,G=null;Ie(b,i,v,o,h),Xe(b,i,v);let z=l(i,v,"sourcemap",He),K=l(i,v,"bundle",J),L=l(i,v,"splitting",J),Y=l(i,v,"preserveSymlinks",J),X=l(i,v,"metafile",J),I=l(i,v,"outfile",U),ae=l(i,v,"outdir",U),R=l(i,v,"outbase",U),D=l(i,v,"tsconfig",U),S=l(i,v,"resolveExtensions",ie),y=l(i,v,"nodePaths",ie),u=l(i,v,"mainFields",ie),p=l(i,v,"conditions",ie),m=l(i,v,"external",ie),T=l(i,v,"packages",U),A=l(i,v,"alias",ye),d=l(i,v,"loader",ye),w=l(i,v,"outExtension",ye),$=l(i,v,"publicPath",U),r=l(i,v,"entryNames",U),c=l(i,v,"chunkNames",U),_=l(i,v,"assetNames",U),j=l(i,v,"inject",ie),M=l(i,v,"banner",ye),N=l(i,v,"footer",ye),F=l(i,v,"entryPoints",it),ee=l(i,v,"absWorkingDir",U),Z=l(i,v,"stdin",ye),Q=(E=l(i,v,"write",J))!=null?E:x,Se=l(i,v,"allowOverwrite",J),ce=l(i,v,"mangleCache",ye);if(v.plugins=!0,oe(i,v,`in ${e}() call`),z&&b.push(`--sourcemap${z===!0?"":`=${z}`}`),K&&b.push("--bundle"),Se&&b.push("--allow-overwrite"),L&&b.push("--splitting"),Y&&b.push("--preserve-symlinks"),X&&b.push("--metafile"),I&&b.push(`--outfile=${I}`),ae&&b.push(`--outdir=${ae}`),R&&b.push(`--outbase=${R}`),D&&b.push(`--tsconfig=${D}`),T&&b.push(`--packages=${T}`),S){let C=[];for(let se of S){if(ue(se,"resolve extension"),se.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${se}`);C.push(se)}b.push(`--resolve-extensions=${C.join(",")}`)}if($&&b.push(`--public-path=${$}`),r&&b.push(`--entry-names=${r}`),c&&b.push(`--chunk-names=${c}`),_&&b.push(`--asset-names=${_}`),u){let C=[];for(let se of u){if(ue(se,"main field"),se.indexOf(",")>=0)throw new Error(`Invalid main field: ${se}`);C.push(se)}b.push(`--main-fields=${C.join(",")}`)}if(p){let C=[];for(let se of p){if(ue(se,"condition"),se.indexOf(",")>=0)throw new Error(`Invalid condition: ${se}`);C.push(se)}b.push(`--conditions=${C.join(",")}`)}if(m)for(let C of m)b.push(`--external:${ue(C,"external")}`);if(A)for(let C in A){if(C.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${C}`);b.push(`--alias:${C}=${ue(A[C],"alias",C)}`)}if(M)for(let C in M){if(C.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${C}`);b.push(`--banner:${C}=${ue(M[C],"banner",C)}`)}if(N)for(let C in N){if(C.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${C}`);b.push(`--footer:${C}=${ue(N[C],"footer",C)}`)}if(j)for(let C of j)b.push(`--inject:${ue(C,"inject")}`);if(d)for(let C in d){if(C.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${C}`);b.push(`--loader:${C}=${ue(d[C],"loader",C)}`)}if(w)for(let C in w){if(C.indexOf("=")>=0)throw new Error(`Invalid out extension: ${C}`);b.push(`--out-extension:${C}=${ue(w[C],"out extension",C)}`)}if(F)if(Array.isArray(F))for(let C=0,se=F.length;C<se;C++){let ke=F[C];if(typeof ke=="object"&&ke!==null){let Ae=Object.create(null),we=l(ke,Ae,"in",U),et=l(ke,Ae,"out",U);if(oe(ke,Ae,"in entry point at index "+C),we===void 0)throw new Error('Missing property "in" for entry point at index '+C);if(et===void 0)throw new Error('Missing property "out" for entry point at index '+C);O.push([et,we])}else O.push(["",ue(ke,"entry point at index "+C)])}else for(let C in F)O.push([C,ue(F[C],"entry point",C)]);if(Z){let C=Object.create(null),se=l(Z,C,"contents",st),ke=l(Z,C,"resolveDir",U),Ae=l(Z,C,"sourcefile",U),we=l(Z,C,"loader",U);oe(Z,C,'in "stdin" object'),Ae&&b.push(`--sourcefile=${Ae}`),we&&b.push(`--loader=${we}`),ke&&(G=ke),typeof se=="string"?W=re(se):se instanceof Uint8Array&&(W=se)}let Ge=[];if(y)for(let C of y)C+="",Ge.push(C);return{entries:O,flags:b,write:Q,stdinContents:W,stdinResolveDir:G,absWorkingDir:ee,nodePaths:Ge,mangleCache:Le(ce)}}function ot(e,i,o,h){let x=[],E=Object.create(null);Ie(x,i,E,o,h),Xe(x,i,E);let b=l(i,E,"sourcemap",He),O=l(i,E,"sourcefile",U),v=l(i,E,"loader",U),W=l(i,E,"banner",U),G=l(i,E,"footer",U),z=l(i,E,"mangleCache",ye);return oe(i,E,`in ${e}() call`),b&&x.push(`--sourcemap=${b===!0?"external":b}`),O&&x.push(`--sourcefile=${O}`),v&&x.push(`--loader=${v}`),W&&x.push(`--banner=${W}`),G&&x.push(`--footer=${G}`),{flags:x,mangleCache:Le(z)}}function at(e){let i={},o={didClose:!1,reason:""},h={},x=0,E=0,b=new Uint8Array(16*1024),O=0,v=D=>{let S=O+D.length;if(S>b.length){let u=new Uint8Array(S*2);u.set(b),b=u}b.set(D,O),O+=D.length;let y=0;for(;y+4<=O;){let u=de(b,y);if(y+4+u>O)break;y+=4,Y(b.subarray(y,y+u)),y+=u}y>0&&(b.copyWithin(0,y,O),O-=y)},W=D=>{o.didClose=!0,D&&(o.reason=": "+(D.message||D));let S="The service was stopped"+o.reason;for(let y in h)h[y](S,null);h={}},G=(D,S,y)=>{if(o.didClose)return y("The service is no longer running"+o.reason,null);let u=x++;h[u]=(p,m)=>{try{y(p,m)}finally{D&&D.unref()}},D&&D.ref(),e.writeToStdin(he({id:u,isRequest:!0,value:S}))},z=(D,S)=>{if(o.didClose)throw new Error("The service is no longer running"+o.reason);e.writeToStdin(he({id:D,isRequest:!1,value:S}))},K=(D,S)=>V(this,null,function*(){try{if(S.command==="ping"){z(D,{});return}if(typeof S.key=="number"){let y=i[S.key];if(!y)return;let u=y[S.command];if(u){yield u(D,S);return}}throw new Error("Invalid command: "+S.command)}catch(y){let u=[Ne(y,e,null,void 0,"")];try{z(D,{errors:u})}catch{}}}),L=!0,Y=D=>{if(L){L=!1;let y=String.fromCharCode(...D);if(y!=="0.25.0")throw new Error(`Cannot start service: Host version "0.25.0" does not match binary version ${q(y)}`);return}let S=P(D);if(S.isRequest)K(S.id,S.value);else{let y=h[S.id];delete h[S.id],S.value.error?y(S.value.error,{}):y(null,S.value)}};return{readFromStdout:v,afterClose:W,service:{buildOrContext:({callName:D,refs:S,options:y,isTTY:u,defaultWD:p,callback:m})=>{let T=0,A=E++,d={},w={ref(){++T===1&&S&&S.ref()},unref(){--T===0&&(delete i[A],S&&S.unref())}};i[A]=d,w.ref(),lt(D,A,G,z,w,e,d,y,u,p,($,r)=>{try{m($,r)}finally{w.unref()}})},transform:({callName:D,refs:S,input:y,options:u,isTTY:p,fs:m,callback:T})=>{let A=Ot(),d=w=>{try{if(typeof y!="string"&&!(y instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:$,mangleCache:r}=ot(D,u,p,Ce),c={command:"transform",flags:$,inputFS:w!==null,input:w!==null?re(w):typeof y=="string"?re(y):y};r&&(c.mangleCache=r),G(S,c,(_,j)=>{if(_)return T(new Error(_),null);let M=We(j.errors,A),N=We(j.warnings,A),F=1,ee=()=>{if(--F===0){let Z={warnings:N,code:j.code,map:j.map,mangleCache:void 0,legalComments:void 0};"legalComments"in j&&(Z.legalComments=j==null?void 0:j.legalComments),j.mangleCache&&(Z.mangleCache=j==null?void 0:j.mangleCache),T(null,Z)}};if(M.length>0)return T(Qe("Transform failed",M,N),null);j.codeFS&&(F++,m.readFile(j.code,(Z,Q)=>{Z!==null?T(Z,null):(j.code=Q,ee())})),j.mapFS&&(F++,m.readFile(j.map,(Z,Q)=>{Z!==null?T(Z,null):(j.map=Q,ee())})),ee()})}catch($){let r=[];try{Ie(r,u,{},p,Ce)}catch{}let c=Ne($,e,A,void 0,"");G(S,{command:"error",flags:r,error:c},()=>{c.detail=A.load(c.detail),T(Qe("Transform failed",[c],[]),null)})}};if((typeof y=="string"||y instanceof Uint8Array)&&y.length>1024*1024){let w=d;d=()=>m.writeFile(y,w)}d(null)},formatMessages:({callName:D,refs:S,messages:y,options:u,callback:p})=>{if(!u)throw new Error(`Missing second argument in ${D}() call`);let m={},T=l(u,m,"kind",U),A=l(u,m,"color",J),d=l(u,m,"terminalWidth",Pe);if(oe(u,m,`in ${D}() call`),T===void 0)throw new Error(`Missing "kind" in ${D}() call`);if(T!=="error"&&T!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${D}() call`);let w={command:"format-msgs",messages:Ue(y,"messages",null,"",d),isWarning:T==="warning"};A!==void 0&&(w.color=A),d!==void 0&&(w.terminalWidth=d),G(S,w,($,r)=>{if($)return p(new Error($),null);p(null,r.messages)})},analyzeMetafile:({callName:D,refs:S,metafile:y,options:u,callback:p})=>{u===void 0&&(u={});let m={},T=l(u,m,"color",J),A=l(u,m,"verbose",J);oe(u,m,`in ${D}() call`);let d={command:"analyze-metafile",metafile:y};T!==void 0&&(d.color=T),A!==void 0&&(d.verbose=A),G(S,d,(w,$)=>{if(w)return p(new Error(w),null);p(null,$.result)})}}}}function lt(e,i,o,h,x,E,b,O,v,W,G){let z=Ot(),K=e==="context",L=(I,ae)=>{let R=[];try{Ie(R,O,{},v,ge)}catch{}let D=Ne(I,E,z,void 0,ae);o(x,{command:"error",flags:R,error:D},()=>{D.detail=z.load(D.detail),G(Qe(K?"Context failed":"Build failed",[D],[]),null)})},Y;if(typeof O=="object"){let I=O.plugins;if(I!==void 0){if(!Array.isArray(I))return L(new Error('"plugins" must be an array'),"");Y=I}}if(Y&&Y.length>0){if(E.isSync)return L(new Error("Cannot use plugins in synchronous API calls"),"");fn(i,o,h,x,E,b,O,Y,z).then(I=>{if(!I.ok)return L(I.error,I.pluginName);try{X(I.requestPlugins,I.runOnEndCallbacks,I.scheduleOnDisposeCallbacks)}catch(ae){L(ae,"")}},I=>L(I,""));return}try{X(null,(I,ae)=>ae([],[]),()=>{})}catch(I){L(I,"")}function X(I,ae,R){let D=E.hasFS,{entries:S,flags:y,write:u,stdinContents:p,stdinResolveDir:m,absWorkingDir:T,nodePaths:A,mangleCache:d}=wt(e,O,v,ge,D);if(u&&!E.hasFS)throw new Error('The "write" option is unavailable in this environment');let w={command:"build",key:i,entries:S,flags:y,write:u,stdinContents:p,stdinResolveDir:m,absWorkingDir:T||W,nodePaths:A,context:K};I&&(w.plugins=I),d&&(w.mangleCache=d);let $=(_,j)=>{let M={errors:We(_.errors,z),warnings:We(_.warnings,z),outputFiles:void 0,metafile:void 0,mangleCache:void 0},N=M.errors.slice(),F=M.warnings.slice();_.outputFiles&&(M.outputFiles=_.outputFiles.map(dn)),_.metafile&&(M.metafile=JSON.parse(_.metafile)),_.mangleCache&&(M.mangleCache=_.mangleCache),_.writeToStdout!==void 0&&console.log(pe(_.writeToStdout).replace(/\n$/,"")),ae(M,(ee,Z)=>{if(N.length>0||ee.length>0){let Q=Qe("Build failed",N.concat(ee),F.concat(Z));return j(Q,null,ee,Z)}j(null,M,ee,Z)})},r,c;K&&(b["on-end"]=(_,j)=>new Promise(M=>{$(j,(N,F,ee,Z)=>{let Q={errors:ee,warnings:Z};c&&c(N,F),r=void 0,c=void 0,h(_,Q),M()})})),o(x,w,(_,j)=>{if(_)return G(new Error(_),null);if(!K)return $(j,(F,ee)=>(R(),G(F,ee)));if(j.errors.length>0)return G(Qe("Context failed",j.errors,j.warnings),null);let M=!1,N={rebuild:()=>(r||(r=new Promise((F,ee)=>{let Z;c=(Se,ce)=>{Z||(Z=()=>Se?ee(Se):F(ce))};let Q=()=>{o(x,{command:"rebuild",key:i},(ce,Ge)=>{ce?ee(new Error(ce)):Z?Z():Q()})};Q()})),r),watch:(F={})=>new Promise((ee,Z)=>{if(!E.hasFS)throw new Error('Cannot use the "watch" API in this environment');oe(F,{},"in watch() call"),o(x,{command:"watch",key:i},ce=>{ce?Z(new Error(ce)):ee(void 0)})}),serve:(F={})=>new Promise((ee,Z)=>{if(!E.hasFS)throw new Error('Cannot use the "serve" API in this environment');let Q={},Se=l(F,Q,"port",ve),ce=l(F,Q,"host",U),Ge=l(F,Q,"servedir",U),C=l(F,Q,"keyfile",U),se=l(F,Q,"certfile",U),ke=l(F,Q,"fallback",U),Ae=l(F,Q,"onRequest",Ze);oe(F,Q,"in serve() call");let we={command:"serve",key:i,onRequest:!!Ae};Se!==void 0&&(we.port=Se),ce!==void 0&&(we.host=ce),Ge!==void 0&&(we.servedir=Ge),C!==void 0&&(we.keyfile=C),se!==void 0&&(we.certfile=se),ke!==void 0&&(we.fallback=ke),o(x,we,(et,Pn)=>{if(et)return Z(new Error(et));Ae&&(b["serve-request"]=($n,An)=>{Ae(An.args),h($n,{})}),ee(Pn)})}),cancel:()=>new Promise(F=>{if(M)return F();o(x,{command:"cancel",key:i},()=>{F()})}),dispose:()=>new Promise(F=>{if(M)return F();M=!0,o(x,{command:"dispose",key:i},()=>{F(),R(),x.unref()})})};x.ref(),G(null,N)})}}var fn=(e,i,o,h,x,E,b,O,v)=>V(void 0,null,function*(){let W=[],G=[],z={},K={},L=[],Y=0,X=0,I=[],ae=!1;O=[...O];for(let S of O){let y={};if(typeof S!="object")throw new Error(`Plugin at index ${X} must be an object`);let u=l(S,y,"name",U);if(typeof u!="string"||u==="")throw new Error(`Plugin at index ${X} is missing a name`);try{let p=l(S,y,"setup",Ze);if(typeof p!="function")throw new Error("Plugin is missing a setup function");oe(S,y,`on plugin ${q(u)}`);let m={name:u,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};X++;let A=p({initialOptions:b,resolve:(d,w={})=>{if(!ae)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof d!="string")throw new Error("The path to resolve must be a string");let $=Object.create(null),r=l(w,$,"pluginName",U),c=l(w,$,"importer",U),_=l(w,$,"namespace",U),j=l(w,$,"resolveDir",U),M=l(w,$,"kind",U),N=l(w,$,"pluginData",Ee),F=l(w,$,"with",ye);return oe(w,$,"in resolve() call"),new Promise((ee,Z)=>{let Q={command:"resolve",path:d,key:e,pluginName:u};if(r!=null&&(Q.pluginName=r),c!=null&&(Q.importer=c),_!=null&&(Q.namespace=_),j!=null&&(Q.resolveDir=j),M!=null)Q.kind=M;else throw new Error('Must specify "kind" when calling "resolve"');N!=null&&(Q.pluginData=v.store(N)),F!=null&&(Q.with=hn(F,"with")),i(h,Q,(Se,ce)=>{Se!==null?Z(new Error(Se)):ee({errors:We(ce.errors,v),warnings:We(ce.warnings,v),path:ce.path,external:ce.external,sideEffects:ce.sideEffects,namespace:ce.namespace,suffix:ce.suffix,pluginData:v.load(ce.pluginData)})})})},onStart(d){let w='This error came from the "onStart" callback registered here:',$=ut(new Error(w),x,"onStart");W.push({name:u,callback:d,note:$}),m.onStart=!0},onEnd(d){let w='This error came from the "onEnd" callback registered here:',$=ut(new Error(w),x,"onEnd");G.push({name:u,callback:d,note:$}),m.onEnd=!0},onResolve(d,w){let $='This error came from the "onResolve" callback registered here:',r=ut(new Error($),x,"onResolve"),c={},_=l(d,c,"filter",_e),j=l(d,c,"namespace",U);if(oe(d,c,`in onResolve() call for plugin ${q(u)}`),_==null)throw new Error("onResolve() call is missing a filter");let M=Y++;z[M]={name:u,callback:w,note:r},m.onResolve.push({id:M,filter:_.source,namespace:j||""})},onLoad(d,w){let $='This error came from the "onLoad" callback registered here:',r=ut(new Error($),x,"onLoad"),c={},_=l(d,c,"filter",_e),j=l(d,c,"namespace",U);if(oe(d,c,`in onLoad() call for plugin ${q(u)}`),_==null)throw new Error("onLoad() call is missing a filter");let M=Y++;K[M]={name:u,callback:w,note:r},m.onLoad.push({id:M,filter:_.source,namespace:j||""})},onDispose(d){L.push(d)},esbuild:x.esbuild});A&&(yield A),I.push(m)}catch(p){return{ok:!1,error:p,pluginName:u}}}E["on-start"]=(S,y)=>V(void 0,null,function*(){v.clear();let u={errors:[],warnings:[]};yield Promise.all(W.map(p=>V(void 0,[p],function*({name:m,callback:T,note:A}){try{let d=yield T();if(d!=null){if(typeof d!="object")throw new Error(`Expected onStart() callback in plugin ${q(m)} to return an object`);let w={},$=l(d,w,"errors",ie),r=l(d,w,"warnings",ie);oe(d,w,`from onStart() callback in plugin ${q(m)}`),$!=null&&u.errors.push(...Ue($,"errors",v,m,void 0)),r!=null&&u.warnings.push(...Ue(r,"warnings",v,m,void 0))}}catch(d){u.errors.push(Ne(d,x,v,A&&A(),m))}}))),o(S,u)}),E["on-resolve"]=(S,y)=>V(void 0,null,function*(){let u={},p="",m,T;for(let A of y.ids)try{({name:p,callback:m,note:T}=z[A]);let d=yield m({path:y.path,importer:y.importer,namespace:y.namespace,resolveDir:y.resolveDir,kind:y.kind,pluginData:v.load(y.pluginData),with:y.with});if(d!=null){if(typeof d!="object")throw new Error(`Expected onResolve() callback in plugin ${q(p)} to return an object`);let w={},$=l(d,w,"pluginName",U),r=l(d,w,"path",U),c=l(d,w,"namespace",U),_=l(d,w,"suffix",U),j=l(d,w,"external",J),M=l(d,w,"sideEffects",J),N=l(d,w,"pluginData",Ee),F=l(d,w,"errors",ie),ee=l(d,w,"warnings",ie),Z=l(d,w,"watchFiles",ie),Q=l(d,w,"watchDirs",ie);oe(d,w,`from onResolve() callback in plugin ${q(p)}`),u.id=A,$!=null&&(u.pluginName=$),r!=null&&(u.path=r),c!=null&&(u.namespace=c),_!=null&&(u.suffix=_),j!=null&&(u.external=j),M!=null&&(u.sideEffects=M),N!=null&&(u.pluginData=v.store(N)),F!=null&&(u.errors=Ue(F,"errors",v,p,void 0)),ee!=null&&(u.warnings=Ue(ee,"warnings",v,p,void 0)),Z!=null&&(u.watchFiles=ct(Z,"watchFiles")),Q!=null&&(u.watchDirs=ct(Q,"watchDirs"));break}}catch(d){u={id:A,errors:[Ne(d,x,v,T&&T(),p)]};break}o(S,u)}),E["on-load"]=(S,y)=>V(void 0,null,function*(){let u={},p="",m,T;for(let A of y.ids)try{({name:p,callback:m,note:T}=K[A]);let d=yield m({path:y.path,namespace:y.namespace,suffix:y.suffix,pluginData:v.load(y.pluginData),with:y.with});if(d!=null){if(typeof d!="object")throw new Error(`Expected onLoad() callback in plugin ${q(p)} to return an object`);let w={},$=l(d,w,"pluginName",U),r=l(d,w,"contents",st),c=l(d,w,"resolveDir",U),_=l(d,w,"pluginData",Ee),j=l(d,w,"loader",U),M=l(d,w,"errors",ie),N=l(d,w,"warnings",ie),F=l(d,w,"watchFiles",ie),ee=l(d,w,"watchDirs",ie);oe(d,w,`from onLoad() callback in plugin ${q(p)}`),u.id=A,$!=null&&(u.pluginName=$),r instanceof Uint8Array?u.contents=r:r!=null&&(u.contents=re(r)),c!=null&&(u.resolveDir=c),_!=null&&(u.pluginData=v.store(_)),j!=null&&(u.loader=j),M!=null&&(u.errors=Ue(M,"errors",v,p,void 0)),N!=null&&(u.warnings=Ue(N,"warnings",v,p,void 0)),F!=null&&(u.watchFiles=ct(F,"watchFiles")),ee!=null&&(u.watchDirs=ct(ee,"watchDirs"));break}}catch(d){u={id:A,errors:[Ne(d,x,v,T&&T(),p)]};break}o(S,u)});let R=(S,y)=>y([],[]);G.length>0&&(R=(S,y)=>{V(void 0,null,function*(){let u=[],p=[];for(let{name:m,callback:T,note:A}of G){let d,w;try{let $=yield T(S);if($!=null){if(typeof $!="object")throw new Error(`Expected onEnd() callback in plugin ${q(m)} to return an object`);let r={},c=l($,r,"errors",ie),_=l($,r,"warnings",ie);oe($,r,`from onEnd() callback in plugin ${q(m)}`),c!=null&&(d=Ue(c,"errors",v,m,void 0)),_!=null&&(w=Ue(_,"warnings",v,m,void 0))}}catch($){d=[Ne($,x,v,A&&A(),m)]}if(d){u.push(...d);try{S.errors.push(...d)}catch{}}if(w){p.push(...w);try{S.warnings.push(...w)}catch{}}}y(u,p)})});let D=()=>{for(let S of L)setTimeout(()=>S(),0)};return ae=!0,{ok:!0,requestPlugins:I,runOnEndCallbacks:R,scheduleOnDisposeCallbacks:D}});function Ot(){let e=new Map,i=0;return{clear(){e.clear()},load(o){return e.get(o)},store(o){if(o===void 0)return-1;let h=i++;return e.set(h,o),h}}}function ut(e,i,o){let h,x=!1;return()=>{if(x)return h;x=!0;try{let E=(e.stack+"").split(`
`);E.splice(1,1);let b=Ut(i,E,o);if(b)return h={text:e.message,location:b},h}catch{}}}function Ne(e,i,o,h,x){let E="Internal error",b=null;try{E=(e&&e.message||e)+""}catch{}try{b=Ut(i,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:x,text:E,location:b,notes:h?[h]:[],detail:o?o.store(e):-1}}function Ut(e,i,o){let h="    at ";if(e.readFileSync&&!i[0].startsWith(h)&&i[1].startsWith(h))for(let x=1;x<i.length;x++){let E=i[x];if(E.startsWith(h))for(E=E.slice(h.length);;){let b=/^(?:new |async )?\S+ \((.*)\)$/.exec(E);if(b){E=b[1];continue}if(b=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(E),b){E=b[1];continue}if(b=/^(\S+):(\d+):(\d+)$/.exec(E),b){let O;try{O=e.readFileSync(b[1],"utf8")}catch{break}let v=O.split(/\r\n|\r|\n|\u2028|\u2029/)[+b[2]-1]||"",W=+b[3]-1,G=v.slice(W,W+o.length)===o?o.length:0;return{file:b[1],namespace:"file",line:+b[2],column:re(v.slice(0,W)).length,length:re(v.slice(W,W+G)).length,lineText:v+`
`+i.slice(1).join(`
`),suggestion:""}}break}}return null}function Qe(e,i,o){let h=5;e+=i.length<1?"":` with ${i.length} error${i.length<2?"":"s"}:`+i.slice(0,h+1).map((E,b)=>{if(b===h)return`
...`;if(!E.location)return`
error: ${E.text}`;let{file:O,line:v,column:W}=E.location,G=E.pluginName?`[plugin: ${E.pluginName}] `:"";return`
${O}:${v}:${W}: ERROR: ${G}${E.text}`}).join("");let x=new Error(e);for(let[E,b]of[["errors",i],["warnings",o]])Object.defineProperty(x,E,{configurable:!0,enumerable:!0,get:()=>b,set:O=>Object.defineProperty(x,E,{configurable:!0,enumerable:!0,value:O})});return x}function We(e,i){for(let o of e)o.detail=i.load(o.detail);return e}function Dt(e,i,o){if(e==null)return null;let h={},x=l(e,h,"file",U),E=l(e,h,"namespace",U),b=l(e,h,"line",Pe),O=l(e,h,"column",Pe),v=l(e,h,"length",Pe),W=l(e,h,"lineText",U),G=l(e,h,"suggestion",U);if(oe(e,h,i),W){let z=W.slice(0,(O&&O>0?O:0)+(v&&v>0?v:0)+(o&&o>0?o:80));!/[\x7F-\uFFFF]/.test(z)&&!/\n/.test(W)&&(W=z)}return{file:x||"",namespace:E||"",line:b||0,column:O||0,length:v||0,lineText:W||"",suggestion:G||""}}function Ue(e,i,o,h,x){let E=[],b=0;for(let O of e){let v={},W=l(O,v,"id",U),G=l(O,v,"pluginName",U),z=l(O,v,"text",U),K=l(O,v,"location",ze),L=l(O,v,"notes",ie),Y=l(O,v,"detail",Ee),X=`in element ${b} of "${i}"`;oe(O,v,X);let I=[];if(L)for(let ae of L){let R={},D=l(ae,R,"text",U),S=l(ae,R,"location",ze);oe(ae,R,X),I.push({text:D||"",location:Dt(S,X,x)})}E.push({id:W||"",pluginName:G||h,text:z||"",location:Dt(K,X,x),notes:I,detail:o?o.store(Y):-1}),b++}return E}function ct(e,i){let o=[];for(let h of e){if(typeof h!="string")throw new Error(`${q(i)} must be an array of strings`);o.push(h)}return o}function hn(e,i){let o=Object.create(null);for(let h in e){let x=e[h];if(typeof x!="string")throw new Error(`key ${q(h)} in object ${q(i)} must be a string`);o[h]=x}return o}function dn({path:e,contents:i,hash:o}){let h=null;return{path:e,contents:i,hash:o,get text(){let x=this.contents;return(h===null||x!==i)&&(i=x,h=pe(x)),h}}}var pn="0.25.0",gn=e=>Ke().build(e),mn=e=>Ke().context(e),vn=(e,i)=>Ke().transform(e,i),yn=(e,i)=>Ke().formatMessages(e,i),wn=(e,i)=>Ke().analyzeMetafile(e,i),bn=()=>{throw new Error('The "buildSync" API only works in node')},xn=()=>{throw new Error('The "transformSync" API only works in node')},Sn=()=>{throw new Error('The "formatMessagesSync" API only works in node')},kn=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},En=()=>(ft&&ft(),Promise.resolve()),Be,ft,ht,Ke=()=>{if(ht)return ht;throw Be?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},Tn=e=>{e=Fe(e||{});let i=e.wasmURL,o=e.wasmModule,h=e.worker!==!1;if(!i&&!o)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(Be)throw new Error('Cannot call "initialize" more than once');return Be=jn(i||"",o,h),Be.catch(()=>{Be=void 0}),Be},jn=(e,i,o)=>V(void 0,null,function*(){let h,x,E=new Promise(z=>x=z);if(o){let z=new Blob([`onmessage=((postMessage) => {
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
    })(postMessage)`],{type:"text/javascript"});h=new Worker(URL.createObjectURL(z))}else{let z=(L=>{var Y=(R,D,S)=>new Promise((y,u)=>{var p=A=>{try{T(S.next(A))}catch(d){u(d)}},m=A=>{try{T(S.throw(A))}catch(d){u(d)}},T=A=>A.done?y(A.value):Promise.resolve(A.value).then(p,m);T((S=S.apply(R,D)).next())});let X,I={};for(let R=self;R;R=Object.getPrototypeOf(R))for(let D of Object.getOwnPropertyNames(R))D in I||Object.defineProperty(I,D,{get:()=>self[D]});(()=>{let R=()=>{let y=new Error("not implemented");return y.code="ENOSYS",y};if(!I.fs){let y="";I.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(u,p){y+=S.decode(p);let m=y.lastIndexOf(`
`);return m!=-1&&(console.log(y.substring(0,m)),y=y.substring(m+1)),p.length},write(u,p,m,T,A,d){if(m!==0||T!==p.length||A!==null){d(R());return}let w=this.writeSync(u,p);d(null,w)},chmod(u,p,m){m(R())},chown(u,p,m,T){T(R())},close(u,p){p(R())},fchmod(u,p,m){m(R())},fchown(u,p,m,T){T(R())},fstat(u,p){p(R())},fsync(u,p){p(null)},ftruncate(u,p,m){m(R())},lchown(u,p,m,T){T(R())},link(u,p,m){m(R())},lstat(u,p){p(R())},mkdir(u,p,m){m(R())},open(u,p,m,T){T(R())},read(u,p,m,T,A,d){d(R())},readdir(u,p){p(R())},readlink(u,p){p(R())},rename(u,p,m){m(R())},rmdir(u,p){p(R())},stat(u,p){p(R())},symlink(u,p,m){m(R())},truncate(u,p,m){m(R())},unlink(u,p){p(R())},utimes(u,p,m,T){T(R())}}}if(I.process||(I.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw R()},pid:-1,ppid:-1,umask(){throw R()},cwd(){throw R()},chdir(){throw R()}}),!I.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!I.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!I.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!I.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");let D=new TextEncoder("utf-8"),S=new TextDecoder("utf-8");I.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=r=>{r!==0&&console.warn("exit code:",r)},this._exitPromise=new Promise(r=>{this._resolveExitPromise=r}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;let y=(r,c)=>{this.mem.setUint32(r+0,c,!0),this.mem.setUint32(r+4,Math.floor(c/4294967296),!0)},u=(r,c)=>{this.mem.setUint32(r+0,c,!0)},p=r=>{let c=this.mem.getUint32(r+0,!0),_=this.mem.getInt32(r+4,!0);return c+_*4294967296},m=r=>{let c=this.mem.getFloat64(r,!0);if(c===0)return;if(!isNaN(c))return c;let _=this.mem.getUint32(r,!0);return this._values[_]},T=(r,c)=>{if(typeof c=="number"&&c!==0){if(isNaN(c)){this.mem.setUint32(r+4,2146959360,!0),this.mem.setUint32(r,0,!0);return}this.mem.setFloat64(r,c,!0);return}if(c===void 0){this.mem.setFloat64(r,0,!0);return}let j=this._ids.get(c);j===void 0&&(j=this._idPool.pop(),j===void 0&&(j=this._values.length),this._values[j]=c,this._goRefCounts[j]=0,this._ids.set(c,j)),this._goRefCounts[j]++;let M=0;switch(typeof c){case"object":c!==null&&(M=1);break;case"string":M=2;break;case"symbol":M=3;break;case"function":M=4;break}this.mem.setUint32(r+4,2146959360|M,!0),this.mem.setUint32(r,j,!0)},A=r=>{let c=p(r+0),_=p(r+8);return new Uint8Array(this._inst.exports.mem.buffer,c,_)},d=r=>{let c=p(r+0),_=p(r+8),j=new Array(_);for(let M=0;M<_;M++)j[M]=m(c+M*8);return j},w=r=>{let c=p(r+0),_=p(r+8);return S.decode(new DataView(this._inst.exports.mem.buffer,c,_))},$=Date.now()-performance.now();this.importObject={_gotest:{add:(r,c)=>r+c},gojs:{"runtime.wasmExit":r=>{r>>>=0;let c=this.mem.getInt32(r+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(c)},"runtime.wasmWrite":r=>{r>>>=0;let c=p(r+8),_=p(r+16),j=this.mem.getInt32(r+24,!0);I.fs.writeSync(c,new Uint8Array(this._inst.exports.mem.buffer,_,j))},"runtime.resetMemoryDataView":r=>{r>>>=0,this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":r=>{r>>>=0,y(r+8,($+performance.now())*1e6)},"runtime.walltime":r=>{r>>>=0;let c=new Date().getTime();y(r+8,c/1e3),this.mem.setInt32(r+16,c%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":r=>{r>>>=0;let c=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(c,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(c);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},p(r+8))),this.mem.setInt32(r+16,c,!0)},"runtime.clearTimeoutEvent":r=>{r>>>=0;let c=this.mem.getInt32(r+8,!0);clearTimeout(this._scheduledTimeouts.get(c)),this._scheduledTimeouts.delete(c)},"runtime.getRandomData":r=>{r>>>=0,crypto.getRandomValues(A(r+8))},"syscall/js.finalizeRef":r=>{r>>>=0;let c=this.mem.getUint32(r+8,!0);if(this._goRefCounts[c]--,this._goRefCounts[c]===0){let _=this._values[c];this._values[c]=null,this._ids.delete(_),this._idPool.push(c)}},"syscall/js.stringVal":r=>{r>>>=0,T(r+24,w(r+8))},"syscall/js.valueGet":r=>{r>>>=0;let c=Reflect.get(m(r+8),w(r+16));r=this._inst.exports.getsp()>>>0,T(r+32,c)},"syscall/js.valueSet":r=>{r>>>=0,Reflect.set(m(r+8),w(r+16),m(r+32))},"syscall/js.valueDelete":r=>{r>>>=0,Reflect.deleteProperty(m(r+8),w(r+16))},"syscall/js.valueIndex":r=>{r>>>=0,T(r+24,Reflect.get(m(r+8),p(r+16)))},"syscall/js.valueSetIndex":r=>{r>>>=0,Reflect.set(m(r+8),p(r+16),m(r+24))},"syscall/js.valueCall":r=>{r>>>=0;try{let c=m(r+8),_=Reflect.get(c,w(r+16)),j=d(r+32),M=Reflect.apply(_,c,j);r=this._inst.exports.getsp()>>>0,T(r+56,M),this.mem.setUint8(r+64,1)}catch(c){r=this._inst.exports.getsp()>>>0,T(r+56,c),this.mem.setUint8(r+64,0)}},"syscall/js.valueInvoke":r=>{r>>>=0;try{let c=m(r+8),_=d(r+16),j=Reflect.apply(c,void 0,_);r=this._inst.exports.getsp()>>>0,T(r+40,j),this.mem.setUint8(r+48,1)}catch(c){r=this._inst.exports.getsp()>>>0,T(r+40,c),this.mem.setUint8(r+48,0)}},"syscall/js.valueNew":r=>{r>>>=0;try{let c=m(r+8),_=d(r+16),j=Reflect.construct(c,_);r=this._inst.exports.getsp()>>>0,T(r+40,j),this.mem.setUint8(r+48,1)}catch(c){r=this._inst.exports.getsp()>>>0,T(r+40,c),this.mem.setUint8(r+48,0)}},"syscall/js.valueLength":r=>{r>>>=0,y(r+16,parseInt(m(r+8).length))},"syscall/js.valuePrepareString":r=>{r>>>=0;let c=D.encode(String(m(r+8)));T(r+16,c),y(r+24,c.length)},"syscall/js.valueLoadString":r=>{r>>>=0;let c=m(r+8);A(r+16).set(c)},"syscall/js.valueInstanceOf":r=>{r>>>=0,this.mem.setUint8(r+24,m(r+8)instanceof m(r+16)?1:0)},"syscall/js.copyBytesToGo":r=>{r>>>=0;let c=A(r+8),_=m(r+32);if(!(_ instanceof Uint8Array||_ instanceof Uint8ClampedArray)){this.mem.setUint8(r+48,0);return}let j=_.subarray(0,c.length);c.set(j),y(r+40,j.length),this.mem.setUint8(r+48,1)},"syscall/js.copyBytesToJS":r=>{r>>>=0;let c=m(r+8),_=A(r+16);if(!(c instanceof Uint8Array||c instanceof Uint8ClampedArray)){this.mem.setUint8(r+48,0);return}let j=_.subarray(0,c.length);c.set(j),y(r+40,j.length),this.mem.setUint8(r+48,1)},debug:r=>{console.log(r)}}}}run(y){return Y(this,null,function*(){if(!(y instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=y,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,I,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[I,5],[this,6]]),this._idPool=[],this.exited=!1;let u=4096,p=$=>{let r=u,c=D.encode($+"\0");return new Uint8Array(this.mem.buffer,u,c.length).set(c),u+=c.length,u%8!==0&&(u+=8-u%8),r},m=this.argv.length,T=[];this.argv.forEach($=>{T.push(p($))}),T.push(0),Object.keys(this.env).sort().forEach($=>{T.push(p(`${$}=${this.env[$]}`))}),T.push(0);let d=u;if(T.forEach($=>{this.mem.setUint32(u,$,!0),this.mem.setUint32(u+4,0,!0),u+=8}),u>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(m,d),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(y){let u=this;return function(){let p={id:y,this:this,args:arguments};return u._pendingEvent=p,u._resume(),p.result}}}})(),X=({data:R})=>{let D=new TextDecoder,S=I.fs,y="";S.writeSync=(A,d)=>{if(A===1)L(d);else if(A===2){y+=D.decode(d);let w=y.split(`
`);w.length>1&&console.log(w.slice(0,-1).join(`
`)),y=w[w.length-1]}else throw new Error("Bad write");return d.length};let u=[],p,m=0;X=({data:A})=>(A.length>0&&(u.push(A),p&&p()),T),S.read=(A,d,w,$,r,c)=>{if(A!==0||w!==0||$!==d.length||r!==null)throw new Error("Bad read");if(u.length===0){p=()=>S.read(A,d,w,$,r,c);return}let _=u[0],j=Math.max(0,Math.min($,_.length-m));d.set(_.subarray(m,m+j),w),m+=j,m===_.length&&(u.shift(),m=0),c(null,j)};let T=new I.Go;return T.argv=["","--service=0.25.0"],ae(R,T).then(A=>{L(null),T.run(A)},A=>{L(A)}),T};function ae(R,D){return Y(this,null,function*(){if(R instanceof WebAssembly.Module)return WebAssembly.instantiate(R,D.importObject);let S=yield fetch(R);if(!S.ok)throw new Error(`Failed to download ${JSON.stringify(R)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(S.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(S,D.importObject)).instance;let y=yield S.arrayBuffer();return(yield WebAssembly.instantiate(y,D.importObject)).instance})}return R=>X(R)})(L=>h.onmessage({data:L})),K;h={onmessage:null,postMessage:L=>setTimeout(()=>{try{K=z({data:L})}catch(Y){x(Y)}}),terminate(){if(K)for(let L of K._scheduledTimeouts.values())clearTimeout(L)}}}let b,O,v=new Promise((z,K)=>{b=z,O=K});h.onmessage=({data:z})=>{h.onmessage=({data:K})=>W(K),z?O(z):b()},h.postMessage(i||new URL(e,location.href).toString());let{readFromStdout:W,service:G}=at({writeToStdin(z){h.postMessage(z)},isSync:!1,hasFS:!1,esbuild:ne});yield v,ft=()=>{h.terminate(),Be=void 0,ft=void 0,ht=void 0},ht={build:z=>new Promise((K,L)=>{E.then(L),G.buildOrContext({callName:"build",refs:null,options:z,isTTY:!1,defaultWD:"/",callback:(Y,X)=>Y?L(Y):K(X)})}),context:z=>new Promise((K,L)=>{E.then(L),G.buildOrContext({callName:"context",refs:null,options:z,isTTY:!1,defaultWD:"/",callback:(Y,X)=>Y?L(Y):K(X)})}),transform:(z,K)=>new Promise((L,Y)=>{E.then(Y),G.transform({callName:"transform",refs:null,input:z,options:K||{},isTTY:!1,fs:{readFile(X,I){I(new Error("Internal error"),null)},writeFile(X,I){I(null)}},callback:(X,I)=>X?Y(X):L(I)})}),formatMessages:(z,K)=>new Promise((L,Y)=>{E.then(Y),G.formatMessages({callName:"formatMessages",refs:null,messages:z,options:K,callback:(X,I)=>X?Y(X):L(I)})}),analyzeMetafile:(z,K)=>new Promise((L,Y)=>{E.then(Y),G.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof z=="string"?z:JSON.stringify(z),options:K,callback:(X,I)=>X?Y(X):L(I)})})}}),_n=ne})(typeof Et=="object"?Et:{set exports(n){(typeof self<"u"?self:this).esbuild=n}})});function bt(n){let t=/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(n.trim());return t?{major:+t[1],minor:+t[2],patch:+t[3],pre:t[4]?t[4].split("."):[]}:null}function Me(n,t){if(n.major!==t.major)return n.major-t.major;if(n.minor!==t.minor)return n.minor-t.minor;if(n.patch!==t.patch)return n.patch-t.patch;if(n.pre.length===0&&t.pre.length===0)return 0;if(n.pre.length===0)return 1;if(t.pre.length===0)return-1;let s=Math.max(n.pre.length,t.pre.length);for(let a=0;a<s;a++){let f=n.pre[a],k=t.pre[a];if(f===void 0)return-1;if(k===void 0)return 1;let g=/^\d+$/.test(f),B=/^\d+$/.test(k);if(g&&B){let V=+f-+k;if(V!==0)return V}else{if(g)return-1;if(B)return 1;if(f!==k)return f<k?-1:1}}return 0}function Fn(n){let t=/^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(n.trim());if(!t)return()=>!1;let s=t[1]||"=",a=t[2].trim();if(a==="*"||a==="")return()=>!0;let f=a.split(".");if(f.some(g=>g==="x"||g==="X"||g==="*")||f.length<3){let g=f[0]===void 0||/[xX*]/.test(f[0])?null:+f[0],B=f[1]===void 0||/[xX*]/.test(f[1])?null:+f[1];return V=>!(g!==null&&V.major!==g||B!==null&&V.minor!==B)}let k=bt(a);if(!k)return()=>!1;switch(s){case"^":return g=>Me(g,k)<0?!1:k.major>0?g.major===k.major:k.minor>0?g.major===0&&g.minor===k.minor:g.major===0&&g.minor===0&&g.patch===k.patch;case"~":return g=>Me(g,k)>=0&&g.major===k.major&&g.minor===k.minor;case">":return g=>Me(g,k)>0;case">=":return g=>Me(g,k)>=0;case"<":return g=>Me(g,k)<0;case"<=":return g=>Me(g,k)<=0;default:return g=>Me(g,k)===0}}function Nn(n){let t=n.trim().split(/\s+/).filter(Boolean).map(Fn);return s=>t.every(a=>a(s))}function Bn(n,t){let s=bt(n);if(!s)return!1;let a=t.trim();return a==="*"||a===""||a==="latest"?!0:a.split("||").some(f=>Nn(f)(s))}function It(n,t){let s=/-([0-9A-Za-z.-]+)/.test(t),a=null,f=null;for(let k of n){let g=bt(k);g&&(g.pre.length>0&&!s||Bn(k,t)&&(a===null||Me(g,a)>0)&&(a=g,f=k))}return f}var be=Uint8Array,qe=Uint16Array,Vn=Int32Array,Mt=new be([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),zt=new be([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Ln=new be([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Ft=function(n,t){for(var s=new qe(31),a=0;a<31;++a)s[a]=t+=1<<n[a-1];for(var f=new Vn(s[30]),a=1;a<30;++a)for(var k=s[a];k<s[a+1];++k)f[k]=k-s[a]<<5|a;return{b:s,r:f}},Nt=Ft(Mt,2),Bt=Nt.b,Wn=Nt.r;Bt[28]=258,Wn[258]=28;var Vt=Ft(zt,0),Gn=Vt.b,Pr=Vt.r,kt=new qe(32768);for(te=0;te<32768;++te)De=(te&43690)>>1|(te&21845)<<1,De=(De&52428)>>2|(De&13107)<<2,De=(De&61680)>>4|(De&3855)<<4,kt[te]=((De&65280)>>8|(De&255)<<8)>>1;var De,te,tt=(function(n,t,s){for(var a=n.length,f=0,k=new qe(t);f<a;++f)n[f]&&++k[n[f]-1];var g=new qe(t);for(f=1;f<t;++f)g[f]=g[f-1]+k[f-1]<<1;var B;if(s){B=new qe(1<<t);var V=15-t;for(f=0;f<a;++f)if(n[f])for(var ne=f<<4|n[f],he=t-n[f],P=g[n[f]-1]++<<he,H=P|(1<<he)-1;P<=H;++P)B[kt[P]>>V]=ne}else for(B=new qe(a),f=0;f<a;++f)n[f]&&(B[f]=kt[g[n[f]-1]++]>>15-n[f]);return B}),nt=new be(288);for(te=0;te<144;++te)nt[te]=8;var te;for(te=144;te<256;++te)nt[te]=9;var te;for(te=256;te<280;++te)nt[te]=7;var te;for(te=280;te<288;++te)nt[te]=8;var te,Lt=new be(32);for(te=0;te<32;++te)Lt[te]=5;var te;var qn=tt(nt,9,1);var Jn=tt(Lt,5,1),xt=function(n){for(var t=n[0],s=1;s<n.length;++s)n[s]>t&&(t=n[s]);return t},Te=function(n,t,s){var a=t/8|0;return(n[a]|n[a+1]<<8)>>(t&7)&s},St=function(n,t){var s=t/8|0;return(n[s]|n[s+1]<<8|n[s+2]<<16)>>(t&7)},Zn=function(n){return(n+7)/8|0},Hn=function(n,t,s){return(t==null||t<0)&&(t=0),(s==null||s>n.length)&&(s=n.length),new be(n.subarray(t,s))};var Yn=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],je=function(n,t,s){var a=new Error(t||Yn[n]);if(a.code=n,Error.captureStackTrace&&Error.captureStackTrace(a,je),!s)throw a;return a},Xn=function(n,t,s,a){var f=n.length,k=a?a.length:0;if(!f||t.f&&!t.l)return s||new be(0);var g=!s,B=g||t.i!=2,V=t.i;g&&(s=new be(f*3));var ne=function(ot){var at=s.length;if(ot>at){var lt=new be(Math.max(at*2,ot));lt.set(s),s=lt}},he=t.f||0,P=t.p||0,H=t.b||0,re=t.l,pe=t.d,me=t.m,de=t.n,le=f*8;do{if(!re){he=Te(n,P,1);var q=Te(n,P+1,3);if(P+=3,q)if(q==1)re=qn,pe=Jn,me=9,de=5;else if(q==2){var Ee=Te(n,P,31)+257,J=Te(n,P+10,15)+4,U=Ee+Te(n,P+5,31)+1;P+=14;for(var _e=new be(U),Pe=new be(19),ve=0;ve<J;++ve)Pe[Ln[ve]]=Te(n,P+ve*3,7);P+=J*3;for(var Ze=xt(Pe),ie=(1<<Ze)-1,ye=tt(Pe,Ze,1),ve=0;ve<U;){var it=ye[Te(n,P,ie)];P+=it&15;var ge=it>>4;if(ge<16)_e[ve++]=ge;else{var Re=0,ze=0;for(ge==16?(ze=3+Te(n,P,3),P+=2,Re=_e[ve-1]):ge==17?(ze=3+Te(n,P,7),P+=3):ge==18&&(ze=11+Te(n,P,127),P+=7);ze--;)_e[ve++]=Re}}var He=_e.subarray(0,Ee),$e=_e.subarray(Ee);me=xt(He),de=xt($e),re=tt(He,me,1),pe=tt($e,de,1)}else je(1);else{var ge=Zn(P)+4,Ce=n[ge-4]|n[ge-3]<<8,Oe=ge+Ce;if(Oe>f){V&&je(0);break}B&&ne(H+Ce),s.set(n.subarray(ge,Oe),H),t.b=H+=Ce,t.p=P=Oe*8,t.f=he;continue}if(P>le){V&&je(0);break}}B&&ne(H+131072);for(var yt=(1<<me)-1,st=(1<<de)-1,Ye=P;;Ye=P){var Re=re[St(n,P)&yt],l=Re>>4;if(P+=Re&15,P>le){V&&je(0);break}if(Re||je(2),l<256)s[H++]=l;else if(l==256){Ye=P,re=null;break}else{var oe=l-254;if(l>264){var ve=l-257,Fe=Mt[ve];oe=Te(n,P,(1<<Fe)-1)+Bt[ve],P+=Fe}var Le=pe[St(n,P)&st],Ie=Le>>4;Le||je(3),P+=Le&15;var $e=Gn[Ie];if(Ie>3){var Fe=zt[Ie];$e+=St(n,P)&(1<<Fe)-1,P+=Fe}if(P>le){V&&je(0);break}B&&ne(H+131072);var ue=H+oe;if(H<$e){var Xe=k-$e,wt=Math.min($e,ue);for(Xe+H<0&&je(3);H<wt;++H)s[H]=a[Xe+H]}for(;H<ue;++H)s[H]=s[H-$e]}}t.l=re,t.p=Ye,t.b=H,t.f=he,re&&(he=1,t.m=me,t.d=pe,t.n=de)}while(!he);return H!=s.length&&g?Hn(s,0,H):s.subarray(0,H)};var Qn=new be(0);var Kn=function(n){(n[0]!=31||n[1]!=139||n[2]!=8)&&je(6,"invalid gzip data");var t=n[3],s=10;t&4&&(s+=(n[10]|n[11]<<8)+2);for(var a=(t>>3&1)+(t>>4&1);a>0;a-=!n[s++]);return s+(t&2)},er=function(n){var t=n.length;return(n[t-4]|n[t-3]<<8|n[t-2]<<16|n[t-1]<<24)>>>0};function Wt(n,t){var s=Kn(n);return s+8>n.length&&je(6,"invalid gzip data"),Xn(n.subarray(s,-8),{i:2},t&&t.out||new be(er(n)),t&&t.dictionary)}var tr=typeof TextDecoder<"u"&&new TextDecoder,nr=0;try{tr.decode(Qn,{stream:!0}),nr=1}catch{}function rr(n){let t=/^sha512-(.+)$/.exec(n.trim());return t?t[1]:null}async function ir(n){let t=await crypto.subtle.digest("SHA-512",n),s=new Uint8Array(t),a="";for(let f of s)a+=String.fromCharCode(f);return btoa(a)}async function Gt(n,t){let s=rr(t);return s?await ir(n)===s:!1}function dt(n,t,s){let a=t,f=Math.min(t+s,n.length);for(;a<f&&n[a]!==0;)a++;let k="";for(let g=t;g<a;g++)k+=String.fromCharCode(n[g]);return k}function sr(n,t,s){let a=dt(n,t,s).trim();return a&&parseInt(a,8)||0}function or(n){let t=[],s=0,a=null;for(;s+512<=n.length;){let f=n.subarray(s,s+512);if(f.every(P=>P===0))break;let k=dt(f,0,100),g=dt(f,345,155);g&&(k=g+"/"+k),a&&(k=a,a=null);let B=sr(f,124,12),V=String.fromCharCode(f[156]),ne=s+512,he=Math.ceil(B/512)*512;if(V==="L")a=dt(n,ne,B).replace(/\0+$/,"");else if(V==="0"||V==="\0"||V===""){let P=k.replace(/^package\//,"");P&&!P.endsWith("/")&&t.push({name:P,data:n.slice(ne,ne+B)})}s=ne+he}return t}function qt(n){return or(Wt(n))}function Jt(n){if(n.startsWith("/")||n.includes("\0"))return!1;let t=n.split("/"),s=0;for(let a of t)if(a===".."){if(s--,s<0)return!1}else a!=="."&&a!==""&&s++;return!0}var ar=["install","postinstall","preinstall","prepare"];function Zt(n,t){let s=n.name??"package";if(n.gypfile===!0)return`${s} \u4F7F\u7528 node-gyp \u539F\u751F\u7F16\u8BD1`;if(t.some(f=>f==="binding.gyp"||f.endsWith("/binding.gyp")))return`${s} \u542B binding.gyp \u539F\u751F\u6A21\u5757`;if(n.binary)return`${s} \u9700\u4E0B\u8F7D\u539F\u751F\u4E8C\u8FDB\u5236\uFF08node-pre-gyp\uFF09`;let a=n.scripts??{};for(let f of ar){let k=a[f];if(k&&/node-gyp|prebuild|node-pre-gyp|cmake|make\b|\.node\b/.test(k))return`${s} \u7684 ${f} \u811A\u672C\u9700\u539F\u751F\u6784\u5EFA`}return null}var Ht="\u8BE5\u5305\u9700\u8981\u539F\u751F\u6784\u5EFA\uFF0CWebView \u8FD0\u884C\u65F6\u4E0D\u652F\u6301\u3002\u8BF7\u6539\u7528 wasm \u53D8\u4F53\uFF08\u5982 esbuild-wasm\u3001@rollup/wasm-node\uFF09\uFF0C\u6216\u79FB\u9664\u8BE5\u4F9D\u8D56\u3002";var Yt="https://registry.npmjs.org";async function Xt(n,t,s,a){var ne,he;let f={},k={},g=Object.entries(n).map(([P,H])=>({name:P,range:H})),B=0,V=new Set;for(;g.length;){let{name:P,range:H}=g.shift();if(!V.has(P)){V.add(P),a.progress(Math.min(.95,B/Math.max(1,B+g.length+1)),`\u5B89\u88C5 ${P}`);try{let re=await t.fetch(`${Yt}/${encodeURIComponent(P)}`),pe=JSON.parse(new TextDecoder().decode(re)),me=Object.keys(pe.versions??{}),de=It(me,H);if(!de)return{ok:!1,installed:f,lock:k,error:`${P}@${H} \u6CA1\u6709\u5339\u914D\u7684\u7248\u672C`};let le=pe.versions[de],q=((ne=le.dist)==null?void 0:ne.integrity)??"",ge=((he=le.dist)==null?void 0:he.tarball)??`${Yt}/${P}/-/${P}-${de}.tgz`,Ce=await t.fetch(ge,q);if(q&&!await Gt(Ce,q))return{ok:!1,installed:f,lock:k,error:`${P}@${de} \u5B8C\u6574\u6027\u6821\u9A8C\u5931\u8D25`};let Oe=qt(Ce),Ee=Zt(le,Oe.map(J=>J.name));if(Ee)return{ok:!1,installed:f,lock:k,error:`${Ee}\u3002${Ht}`};for(let J of Oe)Jt(J.name)&&s.write(`node_modules/${P}/${J.name}`,J.data);f[P]=de,k[P]={version:de,integrity:q},B++;for(let[J,U]of Object.entries(le.dependencies??{}))V.has(J)||g.push({name:J,range:U})}catch(re){return{ok:!1,installed:f,lock:k,error:`\u5B89\u88C5 ${P} \u5931\u8D25\uFF1A${String(re)}`}}}}return s.writeText("package-lock.json",JSON.stringify({lockfileVersion:3,packages:k},null,2)),a.progress(1,"\u5B89\u88C5\u5B8C\u6210"),{ok:!0,installed:f,lock:k}}function Je(n){if(n.includes("\0"))return null;let t=n.replace(/\\/g,"/").split("/"),s=[];for(let a of t)if(!(a===""||a==="."))if(a===".."){if(s.length===0)return null;s.pop()}else s.push(a);return s.join("/")}var pt=class{constructor(){this.files=new Map}write(t,s){let a=Je(t);return a===null?!1:(this.files.set(a,s),!0)}writeText(t,s){return this.write(t,new TextEncoder().encode(s))}read(t){let s=Je(t);return s===null?null:this.files.get(s)??null}readText(t){let s=this.read(t);return s?new TextDecoder().decode(s):null}exists(t){let s=Je(t);return s!==null&&this.files.has(s)}delete(t){let s=Je(t);s!==null&&this.files.delete(s)}evictPrefix(t){let s=Je(t);if(s===null)return 0;let a=0;for(let f of[...this.files.keys()])(f===s||f.startsWith(s+"/"))&&(this.files.delete(f),a++);return a}list(t=""){let s=Je(t)??"";return[...this.files.keys()].filter(a=>s===""||a===s||a.startsWith(s+"/")).sort()}get size(){return this.files.size}};var mt=zn(Qt(),1);var rt=null;function Tt(){return typeof window<"u"&&window.VueCompilerSFC?Promise.resolve(window.VueCompilerSFC):rt||(rt=new Promise((n,t)=>{let s=document.createElement("script");s.src="vue-compiler.js",s.onload=()=>{let a=window.VueCompilerSFC;a?n(a):t(new Error("Vue \u7F16\u8BD1\u5668\u52A0\u8F7D\u540E\u4E0D\u53EF\u7528"))},s.onerror=()=>{rt=null,t(new Error("Vue \u7F16\u8BD1\u5668\u52A0\u8F7D\u5931\u8D25\uFF08vue-compiler.js\uFF09"))},document.head.appendChild(s)}),rt)}function Kt(n){let t=2166136261;for(let s=0;s<n.length;s++)t^=n.charCodeAt(s),t=Math.imul(t,16777619)>>>0;return"data-v-"+t.toString(16).padStart(8,"0")}function gt(n){return typeof n=="string"?n:(n==null?void 0:n.message)??String(n)}async function en(n,t,s){var re,pe,me,de;let a=s??await Tt(),f=Kt(t).replace(/^data-v-/,""),k=Kt(t),{descriptor:g,errors:B}=a.parse(n,{filename:t});if(B.length)throw new Error(`${t}: ${gt(B[0])}`);let V=((re=g.script)==null?void 0:re.lang)==="ts"||((pe=g.scriptSetup)==null?void 0:pe.lang)==="ts"||((me=g.script)==null?void 0:me.lang)==="tsx"||((de=g.scriptSetup)==null?void 0:de.lang)==="tsx",ne={compilerOptions:{expressionPlugins:V?["typescript"]:[]}},he=g.styles.some(le=>le.scoped),P;if(g.script||g.scriptSetup){if(P=a.compileScript(g,{id:f,inlineTemplate:!0,genDefaultAs:"_sfc_main",templateOptions:ne}).content,!g.scriptSetup&&g.template){let q=a.compileTemplate({source:g.template.content,filename:t,id:f,compilerOptions:{...ne.compilerOptions,bindingMetadata:void 0}});if(q.errors.length)throw new Error(`${t}: ${gt(q.errors[0])}`);P+=`
`+q.code.replace("export function render","function _sfc_render"),P+=`
_sfc_main.render = _sfc_render;`}}else if(g.template){let le=a.compileTemplate({source:g.template.content,filename:t,id:f});if(le.errors.length)throw new Error(`${t}: ${gt(le.errors[0])}`);P=le.code.replace("export function render","function _sfc_render"),P+=`
const _sfc_main = { render: _sfc_render };`}else P="const _sfc_main = {};";he&&(P+=`
_sfc_main.__scopeId = ${JSON.stringify(k)};`),P+=`
export default _sfc_main;`;let H=[];for(let le of g.styles){let q=await a.compileStyleAsync({source:le.content,filename:t,id:k,scoped:!!le.scoped});if(q.errors.length)throw new Error(`${t}: ${gt(q.errors[0])}`);H.push(q.code)}return H.length&&(P+=`
{const __sfc_css = ${JSON.stringify(H.join(`
`))};const __sfc_el = document.createElement("style");__sfc_el.textContent = __sfc_css;document.head.appendChild(__sfc_el);}`),{code:P,loader:V?"ts":"js"}}var tn=!1;async function nn(n){tn||(await mt.initialize({wasmURL:n,worker:!1}),tn=!0)}var lr={".js":"js",".mjs":"js",".cjs":"js",".jsx":"jsx",".ts":"ts",".tsx":"tsx",".css":"css",".json":"json",".txt":"text",".svg":"text"};function ur(n){let t=n.lastIndexOf(".");return lr[t>=0?n.slice(t):""]??"js"}function cr(n,t,s){let a=(k,g)=>{let B=(k?k.split("/"):[]).concat(g.split("/")),V=[];for(let ne of B)ne===""||ne==="."||(ne===".."?V.pop():V.push(ne));return V.join("/")},f=[];if(s.startsWith(".")||s.startsWith("/")){let k=s.startsWith("/")?"":t.split("/").slice(0,-1).join("/"),g=s.startsWith("/")?s.slice(1):a(k,s);f.push(g,g+".js",g+".jsx",g+".ts",g+".tsx",g+".vue",g+".json",g+"/index.js")}else{let k="node_modules/"+s,g=n.readText(k+"/package.json");if(g)try{let B=JSON.parse(g),V=B.module||B.main||"index.js";f.push(a(k,V))}catch{f.push(k+"/index.js")}f.push(k+"/index.js",k+".js")}for(let k of f)if(n.exists(k))return k;return null}function fr(n){return{name:"wvi-memfs",setup(t){t.onResolve({filter:/.*/},s=>{if(s.kind==="entry-point")return{path:s.path,namespace:"wvi"};let a=cr(n,s.importer,s.path);return a?{path:a,namespace:"wvi"}:{path:s.path,namespace:"wvi"}}),t.onLoad({filter:/.*/,namespace:"wvi"},async s=>{let a=n.read(s.path);if(!a)return{errors:[{text:"\u627E\u4E0D\u5230\u6A21\u5757 "+s.path}]};if(s.path.endsWith(".vue"))try{let f=await en(new TextDecoder().decode(a),s.path);return{contents:f.code,loader:f.loader}}catch(f){return{errors:[{text:String((f==null?void 0:f.message)??f)}]}}return{contents:a,loader:ur(s.path)}})}}}async function rn(n,t){return((await mt.build({entryPoints:[t],bundle:!0,minify:!0,write:!1,outdir:"dist",format:"iife",target:["chrome90"],plugins:[fr(n)],define:{"process.env.NODE_ENV":'"production"',__VUE_OPTIONS_API__:"true",__VUE_PROD_DEVTOOLS__:"false",__VUE_PROD_HYDRATION_MISMATCH_DETAILS__:"false"},logLevel:"silent"})).outputFiles??[]).map(a=>({path:a.path.replace(/^\/?dist\//,""),contents:a.contents}))}function fe(n,t,s){var a;(a=window.WviBuild)==null||a.post(JSON.stringify({id:s??0,type:n,payload:t}))}var xe=new pt,jt=new Map,hr=0,_t=new Map,dr=0;function sn(n,t){return new Promise(s=>{let a=++dr;_t.set(a,s),fe("fsWrite",{path:n,text:t},a)})}var Pt=new Map,pr=0;function gr(n){return new Promise(t=>{let s=++pr;Pt.set(s,t),fe("fsRead",{path:n},s)})}function un(n){let t=atob(n),s=new Uint8Array(t.length);for(let a=0;a<t.length;a++)s[a]=t.charCodeAt(a);return s}function mr(n){let t="";for(let s=0;s<n.length;s++)t+=String.fromCharCode(n[s]);return btoa(t)}var $t=new Map,vr=0;function on(n){return new Promise(t=>{let s=++vr;$t.set(s,a=>t(a===null?null:un(a))),fe("readSource",{path:n},s)})}var At=new Map,yr=0;function an(){return new Promise(n=>{let t=++yr;At.set(t,n),fe("listSource",{},t)})}var Ct=new Map,wr=0;function ln(n,t){return new Promise(s=>{let a=++wr;Ct.set(a,s),fe("writeDist",{path:n,b64:mr(t)},a)})}var vt="",br={fetch(n,t){return new Promise(s=>{let a=++hr;jt.set(a,s),fe("net",{url:n,method:"GET",integrity:t??""},a)})}},Ve={log(n,t){fe("log",{level:n,text:t})},progress(n,t){fe("progress",{fraction:n,label:t})}};async function xr(n){let t=xe.readText("package.json");if(t||(t=await gr("package.json"),t&&xe.writeText("package.json",t)),!t){fe("done",{ok:!1,summary:"\u7F3A\u5C11 package.json"},n);return}let s=JSON.parse(t),a=await Xt(s.dependencies??{},br,xe,Ve);if(a.ok){let f=xe.list("node_modules"),k=0;for(let B of f){let V=xe.readText(B);V!==null&&await sn(B,V)&&k++}let g=xe.readText("package-lock.json");g!==null&&await sn("package-lock.json",g),xe.evictPrefix("node_modules"),Ve.log("info",`\u5DF2\u5199\u76D8 ${k} \u4E2A\u4F9D\u8D56\u6587\u4EF6`),fe("done",{ok:!0,summary:`\u5DF2\u5B89\u88C5 ${Object.keys(a.installed).length} \u4E2A\u5305`},n)}else fe("error",{message:a.error??"\u5B89\u88C5\u5931\u8D25"},n),fe("done",{ok:!1,summary:a.error??"\u5B89\u88C5\u5931\u8D25"},n)}async function Sr(){for(let n=0;n<600&&!vt;n++)await new Promise(t=>setTimeout(t,100));return!!vt}async function kr(n){if(!await Sr()){fe("done",{ok:!1,summary:"esbuild wasm \u672A\u5C31\u7EEA"},n);return}Ve.progress(.1,"\u52A0\u8F7D\u6E90\u6587\u4EF6");let t=await an();for(let g of t){if(g.startsWith("dist/")||g.startsWith("node_modules/"))continue;let B=await on(g);B&&xe.write(g,B)}let s=await an();for(let g of s){if(!g.startsWith("node_modules/"))continue;let B=await on(g);B&&xe.write(g,B)}let a=["src/main.tsx","src/main.jsx","src/main.ts","src/main.js","main.js","index.js"].find(g=>xe.exists(g));if(!a){fe("done",{ok:!1,summary:"\u627E\u4E0D\u5230\u5165\u53E3\uFF08src/main.* \u6216 index.js\uFF09"},n);return}xe.list("src").some(g=>g.endsWith(".vue"))&&(Ve.progress(.3,"\u52A0\u8F7D Vue \u7F16\u8BD1\u5668"),await Tt()),Ve.progress(.4,"esbuild \u6253\u5305\uFF08TS/JSX \u4EC5\u8F6C\u8BD1\uFF0C\u4E0D\u505A\u7C7B\u578B\u68C0\u67E5\uFF09"),await nn(vt);let f=await rn(xe,a);Ve.progress(.8,"\u5199\u51FA dist");for(let g of f)await ln("dist/"+g.path,g.contents);let k=xe.readText("index.html");k&&await ln("dist/index.html",new TextEncoder().encode(k)),Ve.progress(1,"\u6784\u5EFA\u5B8C\u6210"),fe("done",{ok:!0,summary:`\u6784\u5EFA\u5B8C\u6210\uFF0C${f.length} \u4E2A\u4EA7\u7269`},n)}function Er(n){let t=n.id??0,s=n.payload??{};switch(n.type){case"install":xr(t);break;case"build":kr(t).catch(a=>{fe("error",{message:String(a)},t),fe("done",{ok:!1,summary:String(a)},t)});break;case"wasmUrl":vt=String(s.url??"");break;case"cancel":fe("done",{ok:!1,summary:"cancelled"},t);break;case"netResponse":{let a=jt.get(t);a&&(jt.delete(t),a(un(String(s.body??""))));break}case"fsWriteResponse":{let a=_t.get(t);a&&(_t.delete(t),a(!!s.ok));break}case"fsReadResponse":{let a=Pt.get(t);a&&(Pt.delete(t),a(s.exists?String(s.text??""):null));break}case"readSourceResponse":{let a=$t.get(t);a&&($t.delete(t),a(s.exists?String(s.b64??""):null));break}case"listSourceResponse":{let a=At.get(t);a&&(At.delete(t),a(Array.isArray(s.paths)?s.paths:[]));break}case"writeDistResponse":{let a=Ct.get(t);a&&(Ct.delete(t),a(!!s.ok));break}default:break}}window.__wviBuildReceive=n=>{try{Er(JSON.parse(n))}catch(t){fe("error",{message:String(t)})}};var Tr=0;function cn(){if(window.WviBuild){fe("ready",{});return}++Tr<100&&setTimeout(cn,50)}cn();})();

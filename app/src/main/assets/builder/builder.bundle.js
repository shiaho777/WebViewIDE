"use strict";(()=>{var $n=Object.create;var Dt=Object.defineProperty;var An=Object.getOwnPropertyDescriptor;var Cn=Object.getOwnPropertyNames;var Un=Object.getPrototypeOf,On=Object.prototype.hasOwnProperty;var Dn=(i,t)=>()=>(t||i((t={exports:{}}).exports,t),t.exports);var Rn=(i,t,s,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let v of Cn(t))!On.call(i,v)&&v!==s&&Dt(i,v,{get:()=>t[v],enumerable:!(a=An(t,v))||a.enumerable});return i};var _n=(i,t,s)=>(s=i!=null?$n(Un(i)):{},Rn(t||!i||!i.__esModule?Dt(s,"default",{value:i,enumerable:!0}):s,i));var Yt=Dn((Ir,St)=>{(i=>{"use strict";var t=Object.defineProperty,s=Object.getOwnPropertyDescriptor,a=Object.getOwnPropertyNames,v=Object.prototype.hasOwnProperty,T=(e,r)=>{for(var o in r)t(e,o,{get:r[o],enumerable:!0})},b=(e,r,o,c)=>{if(r&&typeof r=="object"||typeof r=="function")for(let x of a(r))!v.call(e,x)&&x!==o&&t(e,x,{get:()=>r[x],enumerable:!(c=s(r,x))||c.enumerable});return e},V=e=>b(t({},"__esModule",{value:!0}),e),L=(e,r,o)=>new Promise((c,x)=>{var S=m=>{try{U(o.next(m))}catch(W){x(W)}},w=m=>{try{U(o.throw(m))}catch(W){x(W)}},U=m=>m.done?c(m.value):Promise.resolve(m.value).then(S,w);U((o=o.apply(e,r)).next())}),ie={};T(ie,{analyzeMetafile:()=>pn,analyzeMetafileSync:()=>bn,build:()=>hn,buildSync:()=>vn,context:()=>dn,default:()=>En,formatMessages:()=>mn,formatMessagesSync:()=>wn,initialize:()=>kn,stop:()=>xn,transform:()=>gn,transformSync:()=>yn,version:()=>cn}),i.exports=V(ie);function ce(e){let r=c=>{if(c===null)o.write8(0);else if(typeof c=="boolean")o.write8(1),o.write8(+c);else if(typeof c=="number")o.write8(2),o.write32(c|0);else if(typeof c=="string")o.write8(3),o.write(se(c));else if(c instanceof Uint8Array)o.write8(4),o.write(c);else if(c instanceof Array){o.write8(5),o.write32(c.length);for(let x of c)r(x)}else{let x=Object.keys(c);o.write8(6),o.write32(x.length);for(let S of x)o.write(se(S)),r(c[S])}},o=new Q;return o.write32(0),o.write32(e.id<<1|+!e.isRequest),r(e.value),be(o.buf,o.len-4,0),o.buf.subarray(0,o.len)}function _(e){let r=()=>{switch(o.read8()){case 0:return null;case 1:return!!o.read8();case 2:return o.read32();case 3:return ge(o.read());case 4:return o.read();case 5:{let w=o.read32(),U=[];for(let m=0;m<w;m++)U.push(r());return U}case 6:{let w=o.read32(),U={};for(let m=0;m<w;m++)U[ge(o.read())]=r();return U}default:throw new Error("Invalid packet")}},o=new Q(e),c=o.read32(),x=(c&1)===0;c>>>=1;let S=r();if(o.ptr!==e.length)throw new Error("Invalid packet");return{id:c,isRequest:x,value:S}}var Q=class{constructor(e=new Uint8Array(1024)){this.buf=e,this.len=0,this.ptr=0}_write(e){if(this.len+e>this.buf.length){let r=new Uint8Array((this.len+e)*2);r.set(this.buf),this.buf=r}return this.len+=e,this.len-e}write8(e){let r=this._write(1);this.buf[r]=e}write32(e){let r=this._write(4);be(this.buf,e,r)}write(e){let r=this._write(4+e.length);be(this.buf,e.length,r),this.buf.set(e,r+4)}_read(e){if(this.ptr+e>this.buf.length)throw new Error("Invalid packet");return this.ptr+=e,this.ptr-e}read8(){return this.buf[this._read(1)]}read32(){return he(this.buf,this._read(4))}read(){let e=this.read32(),r=new Uint8Array(e),o=this._read(r.length);return r.set(this.buf.subarray(o,o+e)),r}},se,ge,Se;if(typeof TextEncoder<"u"&&typeof TextDecoder<"u"){let e=new TextEncoder,r=new TextDecoder;se=o=>e.encode(o),ge=o=>r.decode(o),Se='new TextEncoder().encode("")'}else if(typeof Buffer<"u")se=e=>Buffer.from(e),ge=e=>{let{buffer:r,byteOffset:o,byteLength:c}=e;return Buffer.from(r,o,c).toString()},Se='Buffer.from("")';else throw new Error("No UTF-8 codec found");if(!(se("")instanceof Uint8Array))throw new Error(`Invariant violation: "${Se} instanceof Uint8Array" is incorrectly false

This indicates that your JavaScript environment is broken. You cannot use
esbuild in this environment because esbuild relies on this invariant. This
is not a problem with esbuild. You need to fix your environment instead.
`);function he(e,r){return e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24}function be(e,r,o){e[o++]=r,e[o++]=r>>8,e[o++]=r>>16,e[o++]=r>>24}var te=JSON.stringify,de="warning",Ue="silent";function Oe(e){if(le(e,"target"),e.indexOf(",")>=0)throw new Error(`Invalid target: ${e}`);return e}var Ee=()=>null,q=e=>typeof e=="boolean"?null:"a boolean",O=e=>typeof e=="string"?null:"a string",Pe=e=>e instanceof RegExp?null:"a RegExp object",$e=e=>typeof e=="number"&&e===(e|0)?null:"an integer",me=e=>typeof e=="number"&&e===(e|0)&&e>=0&&e<=65535?null:"a valid port number",Ze=e=>typeof e=="function"?null:"a function",ne=e=>Array.isArray(e)?null:"an array",pe=e=>typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"an object",it=e=>typeof e=="object"&&e!==null?null:"an array or an object",_e=e=>e instanceof WebAssembly.Module?null:"a WebAssembly.Module",ze=e=>typeof e=="object"&&!Array.isArray(e)?null:"an object or null",He=e=>typeof e=="string"||typeof e=="boolean"?null:"a string or a boolean",Ae=e=>typeof e=="string"||typeof e=="object"&&e!==null&&!Array.isArray(e)?null:"a string or an object",vt=e=>typeof e=="string"||Array.isArray(e)?null:"a string or an array",st=e=>typeof e=="string"||e instanceof Uint8Array?null:"a string or a Uint8Array",Ye=e=>typeof e=="string"||e instanceof URL?null:"a string or a URL";function l(e,r,o,c){let x=e[o];if(r[o+""]=!0,x===void 0)return;let S=c(x);if(S!==null)throw new Error(`${te(o)} must be ${S}`);return x}function oe(e,r,o){for(let c in e)if(!(c in r))throw new Error(`Invalid option ${o}: ${te(c)}`)}function Fe(e){let r=Object.create(null),o=l(e,r,"wasmURL",Ye),c=l(e,r,"wasmModule",_e),x=l(e,r,"worker",q);return oe(e,r,"in initialize() call"),{wasmURL:o,wasmModule:c,worker:x}}function Le(e){let r;if(e!==void 0){r=Object.create(null);for(let o in e){let c=e[o];if(typeof c=="string"||c===!1)r[o]=c;else throw new Error(`Expected ${te(o)} in mangle cache to map to either a string or false`)}}return r}function Ie(e,r,o,c,x){let S=l(r,o,"color",q),w=l(r,o,"logLevel",O),U=l(r,o,"logLimit",$e);S!==void 0?e.push(`--color=${S}`):c&&e.push("--color=true"),e.push(`--log-level=${w||x}`),e.push(`--log-limit=${U||0}`)}function le(e,r,o){if(typeof e!="string")throw new Error(`Expected value for ${r}${o!==void 0?" "+te(o):""} to be a string, got ${typeof e} instead`);return e}function Xe(e,r,o){let c=l(r,o,"legalComments",O),x=l(r,o,"sourceRoot",O),S=l(r,o,"sourcesContent",q),w=l(r,o,"target",vt),U=l(r,o,"format",O),m=l(r,o,"globalName",O),W=l(r,o,"mangleProps",Pe),G=l(r,o,"reserveProps",Pe),z=l(r,o,"mangleQuoted",q),X=l(r,o,"minify",q),N=l(r,o,"minifySyntax",q),Z=l(r,o,"minifyWhitespace",q),H=l(r,o,"minifyIdentifiers",q),I=l(r,o,"lineLimit",$e),ae=l(r,o,"drop",ne),R=l(r,o,"dropLabels",ne),D=l(r,o,"charset",O),k=l(r,o,"treeShaking",q),p=l(r,o,"ignoreAnnotations",q),u=l(r,o,"jsx",O),d=l(r,o,"jsxFactory",O),g=l(r,o,"jsxFragment",O),E=l(r,o,"jsxImportSource",O),A=l(r,o,"jsxDev",q),h=l(r,o,"jsxSideEffects",q),y=l(r,o,"define",pe),$=l(r,o,"logOverride",pe),n=l(r,o,"supported",pe),f=l(r,o,"pure",ne),P=l(r,o,"keepNames",q),j=l(r,o,"platform",O),M=l(r,o,"tsconfigRaw",Ae);if(c&&e.push(`--legal-comments=${c}`),x!==void 0&&e.push(`--source-root=${x}`),S!==void 0&&e.push(`--sources-content=${S}`),w&&(Array.isArray(w)?e.push(`--target=${Array.from(w).map(Oe).join(",")}`):e.push(`--target=${Oe(w)}`)),U&&e.push(`--format=${U}`),m&&e.push(`--global-name=${m}`),j&&e.push(`--platform=${j}`),M&&e.push(`--tsconfig-raw=${typeof M=="string"?M:JSON.stringify(M)}`),X&&e.push("--minify"),N&&e.push("--minify-syntax"),Z&&e.push("--minify-whitespace"),H&&e.push("--minify-identifiers"),I&&e.push(`--line-limit=${I}`),D&&e.push(`--charset=${D}`),k!==void 0&&e.push(`--tree-shaking=${k}`),p&&e.push("--ignore-annotations"),ae)for(let B of ae)e.push(`--drop:${le(B,"drop")}`);if(R&&e.push(`--drop-labels=${Array.from(R).map(B=>le(B,"dropLabels")).join(",")}`),W&&e.push(`--mangle-props=${W.source}`),G&&e.push(`--reserve-props=${G.source}`),z!==void 0&&e.push(`--mangle-quoted=${z}`),u&&e.push(`--jsx=${u}`),d&&e.push(`--jsx-factory=${d}`),g&&e.push(`--jsx-fragment=${g}`),E&&e.push(`--jsx-import-source=${E}`),A&&e.push("--jsx-dev"),h&&e.push("--jsx-side-effects"),y)for(let B in y){if(B.indexOf("=")>=0)throw new Error(`Invalid define: ${B}`);e.push(`--define:${B}=${le(y[B],"define",B)}`)}if($)for(let B in $){if(B.indexOf("=")>=0)throw new Error(`Invalid log override: ${B}`);e.push(`--log-override:${B}=${le($[B],"log override",B)}`)}if(n)for(let B in n){if(B.indexOf("=")>=0)throw new Error(`Invalid supported: ${B}`);let F=n[B];if(typeof F!="boolean")throw new Error(`Expected value for supported ${te(B)} to be a boolean, got ${typeof F} instead`);e.push(`--supported:${B}=${F}`)}if(f)for(let B of f)e.push(`--pure:${le(B,"pure")}`);P&&e.push("--keep-names")}function yt(e,r,o,c,x){var S;let w=[],U=[],m=Object.create(null),W=null,G=null;Ie(w,r,m,o,c),Xe(w,r,m);let z=l(r,m,"sourcemap",He),X=l(r,m,"bundle",q),N=l(r,m,"splitting",q),Z=l(r,m,"preserveSymlinks",q),H=l(r,m,"metafile",q),I=l(r,m,"outfile",O),ae=l(r,m,"outdir",O),R=l(r,m,"outbase",O),D=l(r,m,"tsconfig",O),k=l(r,m,"resolveExtensions",ne),p=l(r,m,"nodePaths",ne),u=l(r,m,"mainFields",ne),d=l(r,m,"conditions",ne),g=l(r,m,"external",ne),E=l(r,m,"packages",O),A=l(r,m,"alias",pe),h=l(r,m,"loader",pe),y=l(r,m,"outExtension",pe),$=l(r,m,"publicPath",O),n=l(r,m,"entryNames",O),f=l(r,m,"chunkNames",O),P=l(r,m,"assetNames",O),j=l(r,m,"inject",ne),M=l(r,m,"banner",pe),B=l(r,m,"footer",pe),F=l(r,m,"entryPoints",it),K=l(r,m,"absWorkingDir",O),J=l(r,m,"stdin",pe),Y=(S=l(r,m,"write",q))!=null?S:x,xe=l(r,m,"allowOverwrite",q),ue=l(r,m,"mangleCache",pe);if(m.plugins=!0,oe(r,m,`in ${e}() call`),z&&w.push(`--sourcemap${z===!0?"":`=${z}`}`),X&&w.push("--bundle"),xe&&w.push("--allow-overwrite"),N&&w.push("--splitting"),Z&&w.push("--preserve-symlinks"),H&&w.push("--metafile"),I&&w.push(`--outfile=${I}`),ae&&w.push(`--outdir=${ae}`),R&&w.push(`--outbase=${R}`),D&&w.push(`--tsconfig=${D}`),E&&w.push(`--packages=${E}`),k){let C=[];for(let re of k){if(le(re,"resolve extension"),re.indexOf(",")>=0)throw new Error(`Invalid resolve extension: ${re}`);C.push(re)}w.push(`--resolve-extensions=${C.join(",")}`)}if($&&w.push(`--public-path=${$}`),n&&w.push(`--entry-names=${n}`),f&&w.push(`--chunk-names=${f}`),P&&w.push(`--asset-names=${P}`),u){let C=[];for(let re of u){if(le(re,"main field"),re.indexOf(",")>=0)throw new Error(`Invalid main field: ${re}`);C.push(re)}w.push(`--main-fields=${C.join(",")}`)}if(d){let C=[];for(let re of d){if(le(re,"condition"),re.indexOf(",")>=0)throw new Error(`Invalid condition: ${re}`);C.push(re)}w.push(`--conditions=${C.join(",")}`)}if(g)for(let C of g)w.push(`--external:${le(C,"external")}`);if(A)for(let C in A){if(C.indexOf("=")>=0)throw new Error(`Invalid package name in alias: ${C}`);w.push(`--alias:${C}=${le(A[C],"alias",C)}`)}if(M)for(let C in M){if(C.indexOf("=")>=0)throw new Error(`Invalid banner file type: ${C}`);w.push(`--banner:${C}=${le(M[C],"banner",C)}`)}if(B)for(let C in B){if(C.indexOf("=")>=0)throw new Error(`Invalid footer file type: ${C}`);w.push(`--footer:${C}=${le(B[C],"footer",C)}`)}if(j)for(let C of j)w.push(`--inject:${le(C,"inject")}`);if(h)for(let C in h){if(C.indexOf("=")>=0)throw new Error(`Invalid loader extension: ${C}`);w.push(`--loader:${C}=${le(h[C],"loader",C)}`)}if(y)for(let C in y){if(C.indexOf("=")>=0)throw new Error(`Invalid out extension: ${C}`);w.push(`--out-extension:${C}=${le(y[C],"out extension",C)}`)}if(F)if(Array.isArray(F))for(let C=0,re=F.length;C<re;C++){let ke=F[C];if(typeof ke=="object"&&ke!==null){let Ce=Object.create(null),ve=l(ke,Ce,"in",O),et=l(ke,Ce,"out",O);if(oe(ke,Ce,"in entry point at index "+C),ve===void 0)throw new Error('Missing property "in" for entry point at index '+C);if(et===void 0)throw new Error('Missing property "out" for entry point at index '+C);U.push([et,ve])}else U.push(["",le(ke,"entry point at index "+C)])}else for(let C in F)U.push([C,le(F[C],"entry point",C)]);if(J){let C=Object.create(null),re=l(J,C,"contents",st),ke=l(J,C,"resolveDir",O),Ce=l(J,C,"sourcefile",O),ve=l(J,C,"loader",O);oe(J,C,'in "stdin" object'),Ce&&w.push(`--sourcefile=${Ce}`),ve&&w.push(`--loader=${ve}`),ke&&(G=ke),typeof re=="string"?W=se(re):re instanceof Uint8Array&&(W=re)}let Ge=[];if(p)for(let C of p)C+="",Ge.push(C);return{entries:U,flags:w,write:Y,stdinContents:W,stdinResolveDir:G,absWorkingDir:K,nodePaths:Ge,mangleCache:Le(ue)}}function ot(e,r,o,c){let x=[],S=Object.create(null);Ie(x,r,S,o,c),Xe(x,r,S);let w=l(r,S,"sourcemap",He),U=l(r,S,"sourcefile",O),m=l(r,S,"loader",O),W=l(r,S,"banner",O),G=l(r,S,"footer",O),z=l(r,S,"mangleCache",pe);return oe(r,S,`in ${e}() call`),w&&x.push(`--sourcemap=${w===!0?"external":w}`),U&&x.push(`--sourcefile=${U}`),m&&x.push(`--loader=${m}`),W&&x.push(`--banner=${W}`),G&&x.push(`--footer=${G}`),{flags:x,mangleCache:Le(z)}}function at(e){let r={},o={didClose:!1,reason:""},c={},x=0,S=0,w=new Uint8Array(16*1024),U=0,m=D=>{let k=U+D.length;if(k>w.length){let u=new Uint8Array(k*2);u.set(w),w=u}w.set(D,U),U+=D.length;let p=0;for(;p+4<=U;){let u=he(w,p);if(p+4+u>U)break;p+=4,Z(w.subarray(p,p+u)),p+=u}p>0&&(w.copyWithin(0,p,U),U-=p)},W=D=>{o.didClose=!0,D&&(o.reason=": "+(D.message||D));let k="The service was stopped"+o.reason;for(let p in c)c[p](k,null);c={}},G=(D,k,p)=>{if(o.didClose)return p("The service is no longer running"+o.reason,null);let u=x++;c[u]=(d,g)=>{try{p(d,g)}finally{D&&D.unref()}},D&&D.ref(),e.writeToStdin(ce({id:u,isRequest:!0,value:k}))},z=(D,k)=>{if(o.didClose)throw new Error("The service is no longer running"+o.reason);e.writeToStdin(ce({id:D,isRequest:!1,value:k}))},X=(D,k)=>L(this,null,function*(){try{if(k.command==="ping"){z(D,{});return}if(typeof k.key=="number"){let p=r[k.key];if(!p)return;let u=p[k.command];if(u){yield u(D,k);return}}throw new Error("Invalid command: "+k.command)}catch(p){let u=[Be(p,e,null,void 0,"")];try{z(D,{errors:u})}catch{}}}),N=!0,Z=D=>{if(N){N=!1;let p=String.fromCharCode(...D);if(p!=="0.25.0")throw new Error(`Cannot start service: Host version "0.25.0" does not match binary version ${te(p)}`);return}let k=_(D);if(k.isRequest)X(k.id,k.value);else{let p=c[k.id];delete c[k.id],k.value.error?p(k.value.error,{}):p(null,k.value)}};return{readFromStdout:m,afterClose:W,service:{buildOrContext:({callName:D,refs:k,options:p,isTTY:u,defaultWD:d,callback:g})=>{let E=0,A=S++,h={},y={ref(){++E===1&&k&&k.ref()},unref(){--E===0&&(delete r[A],k&&k.unref())}};r[A]=h,y.ref(),lt(D,A,G,z,y,e,h,p,u,d,($,n)=>{try{g($,n)}finally{y.unref()}})},transform:({callName:D,refs:k,input:p,options:u,isTTY:d,fs:g,callback:E})=>{let A=Ct(),h=y=>{try{if(typeof p!="string"&&!(p instanceof Uint8Array))throw new Error('The input to "transform" must be a string or a Uint8Array');let{flags:$,mangleCache:n}=ot(D,u,d,Ue),f={command:"transform",flags:$,inputFS:y!==null,input:y!==null?se(y):typeof p=="string"?se(p):p};n&&(f.mangleCache=n),G(k,f,(P,j)=>{if(P)return E(new Error(P),null);let M=We(j.errors,A),B=We(j.warnings,A),F=1,K=()=>{if(--F===0){let J={warnings:B,code:j.code,map:j.map,mangleCache:void 0,legalComments:void 0};"legalComments"in j&&(J.legalComments=j==null?void 0:j.legalComments),j.mangleCache&&(J.mangleCache=j==null?void 0:j.mangleCache),E(null,J)}};if(M.length>0)return E(Qe("Transform failed",M,B),null);j.codeFS&&(F++,g.readFile(j.code,(J,Y)=>{J!==null?E(J,null):(j.code=Y,K())})),j.mapFS&&(F++,g.readFile(j.map,(J,Y)=>{J!==null?E(J,null):(j.map=Y,K())})),K()})}catch($){let n=[];try{Ie(n,u,{},d,Ue)}catch{}let f=Be($,e,A,void 0,"");G(k,{command:"error",flags:n,error:f},()=>{f.detail=A.load(f.detail),E(Qe("Transform failed",[f],[]),null)})}};if((typeof p=="string"||p instanceof Uint8Array)&&p.length>1024*1024){let y=h;h=()=>g.writeFile(p,y)}h(null)},formatMessages:({callName:D,refs:k,messages:p,options:u,callback:d})=>{if(!u)throw new Error(`Missing second argument in ${D}() call`);let g={},E=l(u,g,"kind",O),A=l(u,g,"color",q),h=l(u,g,"terminalWidth",$e);if(oe(u,g,`in ${D}() call`),E===void 0)throw new Error(`Missing "kind" in ${D}() call`);if(E!=="error"&&E!=="warning")throw new Error(`Expected "kind" to be "error" or "warning" in ${D}() call`);let y={command:"format-msgs",messages:De(p,"messages",null,"",h),isWarning:E==="warning"};A!==void 0&&(y.color=A),h!==void 0&&(y.terminalWidth=h),G(k,y,($,n)=>{if($)return d(new Error($),null);d(null,n.messages)})},analyzeMetafile:({callName:D,refs:k,metafile:p,options:u,callback:d})=>{u===void 0&&(u={});let g={},E=l(u,g,"color",q),A=l(u,g,"verbose",q);oe(u,g,`in ${D}() call`);let h={command:"analyze-metafile",metafile:p};E!==void 0&&(h.color=E),A!==void 0&&(h.verbose=A),G(k,h,(y,$)=>{if(y)return d(new Error(y),null);d(null,$.result)})}}}}function lt(e,r,o,c,x,S,w,U,m,W,G){let z=Ct(),X=e==="context",N=(I,ae)=>{let R=[];try{Ie(R,U,{},m,de)}catch{}let D=Be(I,S,z,void 0,ae);o(x,{command:"error",flags:R,error:D},()=>{D.detail=z.load(D.detail),G(Qe(X?"Context failed":"Build failed",[D],[]),null)})},Z;if(typeof U=="object"){let I=U.plugins;if(I!==void 0){if(!Array.isArray(I))return N(new Error('"plugins" must be an array'),"");Z=I}}if(Z&&Z.length>0){if(S.isSync)return N(new Error("Cannot use plugins in synchronous API calls"),"");ln(r,o,c,x,S,w,U,Z,z).then(I=>{if(!I.ok)return N(I.error,I.pluginName);try{H(I.requestPlugins,I.runOnEndCallbacks,I.scheduleOnDisposeCallbacks)}catch(ae){N(ae,"")}},I=>N(I,""));return}try{H(null,(I,ae)=>ae([],[]),()=>{})}catch(I){N(I,"")}function H(I,ae,R){let D=S.hasFS,{entries:k,flags:p,write:u,stdinContents:d,stdinResolveDir:g,absWorkingDir:E,nodePaths:A,mangleCache:h}=yt(e,U,m,de,D);if(u&&!S.hasFS)throw new Error('The "write" option is unavailable in this environment');let y={command:"build",key:r,entries:k,flags:p,write:u,stdinContents:d,stdinResolveDir:g,absWorkingDir:E||W,nodePaths:A,context:X};I&&(y.plugins=I),h&&(y.mangleCache=h);let $=(P,j)=>{let M={errors:We(P.errors,z),warnings:We(P.warnings,z),outputFiles:void 0,metafile:void 0,mangleCache:void 0},B=M.errors.slice(),F=M.warnings.slice();P.outputFiles&&(M.outputFiles=P.outputFiles.map(fn)),P.metafile&&(M.metafile=JSON.parse(P.metafile)),P.mangleCache&&(M.mangleCache=P.mangleCache),P.writeToStdout!==void 0&&console.log(ge(P.writeToStdout).replace(/\n$/,"")),ae(M,(K,J)=>{if(B.length>0||K.length>0){let Y=Qe("Build failed",B.concat(K),F.concat(J));return j(Y,null,K,J)}j(null,M,K,J)})},n,f;X&&(w["on-end"]=(P,j)=>new Promise(M=>{$(j,(B,F,K,J)=>{let Y={errors:K,warnings:J};f&&f(B,F),n=void 0,f=void 0,c(P,Y),M()})})),o(x,y,(P,j)=>{if(P)return G(new Error(P),null);if(!X)return $(j,(F,K)=>(R(),G(F,K)));if(j.errors.length>0)return G(Qe("Context failed",j.errors,j.warnings),null);let M=!1,B={rebuild:()=>(n||(n=new Promise((F,K)=>{let J;f=(xe,ue)=>{J||(J=()=>xe?K(xe):F(ue))};let Y=()=>{o(x,{command:"rebuild",key:r},(ue,Ge)=>{ue?K(new Error(ue)):J?J():Y()})};Y()})),n),watch:(F={})=>new Promise((K,J)=>{if(!S.hasFS)throw new Error('Cannot use the "watch" API in this environment');oe(F,{},"in watch() call"),o(x,{command:"watch",key:r},ue=>{ue?J(new Error(ue)):K(void 0)})}),serve:(F={})=>new Promise((K,J)=>{if(!S.hasFS)throw new Error('Cannot use the "serve" API in this environment');let Y={},xe=l(F,Y,"port",me),ue=l(F,Y,"host",O),Ge=l(F,Y,"servedir",O),C=l(F,Y,"keyfile",O),re=l(F,Y,"certfile",O),ke=l(F,Y,"fallback",O),Ce=l(F,Y,"onRequest",Ze);oe(F,Y,"in serve() call");let ve={command:"serve",key:r,onRequest:!!Ce};xe!==void 0&&(ve.port=xe),ue!==void 0&&(ve.host=ue),Ge!==void 0&&(ve.servedir=Ge),C!==void 0&&(ve.keyfile=C),re!==void 0&&(ve.certfile=re),ke!==void 0&&(ve.fallback=ke),o(x,ve,(et,Tn)=>{if(et)return J(new Error(et));Ce&&(w["serve-request"]=(jn,Pn)=>{Ce(Pn.args),c(jn,{})}),K(Tn)})}),cancel:()=>new Promise(F=>{if(M)return F();o(x,{command:"cancel",key:r},()=>{F()})}),dispose:()=>new Promise(F=>{if(M)return F();M=!0,o(x,{command:"dispose",key:r},()=>{F(),R(),x.unref()})})};x.ref(),G(null,B)})}}var ln=(e,r,o,c,x,S,w,U,m)=>L(void 0,null,function*(){let W=[],G=[],z={},X={},N=[],Z=0,H=0,I=[],ae=!1;U=[...U];for(let k of U){let p={};if(typeof k!="object")throw new Error(`Plugin at index ${H} must be an object`);let u=l(k,p,"name",O);if(typeof u!="string"||u==="")throw new Error(`Plugin at index ${H} is missing a name`);try{let d=l(k,p,"setup",Ze);if(typeof d!="function")throw new Error("Plugin is missing a setup function");oe(k,p,`on plugin ${te(u)}`);let g={name:u,onStart:!1,onEnd:!1,onResolve:[],onLoad:[]};H++;let A=d({initialOptions:w,resolve:(h,y={})=>{if(!ae)throw new Error('Cannot call "resolve" before plugin setup has completed');if(typeof h!="string")throw new Error("The path to resolve must be a string");let $=Object.create(null),n=l(y,$,"pluginName",O),f=l(y,$,"importer",O),P=l(y,$,"namespace",O),j=l(y,$,"resolveDir",O),M=l(y,$,"kind",O),B=l(y,$,"pluginData",Ee),F=l(y,$,"with",pe);return oe(y,$,"in resolve() call"),new Promise((K,J)=>{let Y={command:"resolve",path:h,key:e,pluginName:u};if(n!=null&&(Y.pluginName=n),f!=null&&(Y.importer=f),P!=null&&(Y.namespace=P),j!=null&&(Y.resolveDir=j),M!=null)Y.kind=M;else throw new Error('Must specify "kind" when calling "resolve"');B!=null&&(Y.pluginData=m.store(B)),F!=null&&(Y.with=un(F,"with")),r(c,Y,(xe,ue)=>{xe!==null?J(new Error(xe)):K({errors:We(ue.errors,m),warnings:We(ue.warnings,m),path:ue.path,external:ue.external,sideEffects:ue.sideEffects,namespace:ue.namespace,suffix:ue.suffix,pluginData:m.load(ue.pluginData)})})})},onStart(h){let y='This error came from the "onStart" callback registered here:',$=ut(new Error(y),x,"onStart");W.push({name:u,callback:h,note:$}),g.onStart=!0},onEnd(h){let y='This error came from the "onEnd" callback registered here:',$=ut(new Error(y),x,"onEnd");G.push({name:u,callback:h,note:$}),g.onEnd=!0},onResolve(h,y){let $='This error came from the "onResolve" callback registered here:',n=ut(new Error($),x,"onResolve"),f={},P=l(h,f,"filter",Pe),j=l(h,f,"namespace",O);if(oe(h,f,`in onResolve() call for plugin ${te(u)}`),P==null)throw new Error("onResolve() call is missing a filter");let M=Z++;z[M]={name:u,callback:y,note:n},g.onResolve.push({id:M,filter:P.source,namespace:j||""})},onLoad(h,y){let $='This error came from the "onLoad" callback registered here:',n=ut(new Error($),x,"onLoad"),f={},P=l(h,f,"filter",Pe),j=l(h,f,"namespace",O);if(oe(h,f,`in onLoad() call for plugin ${te(u)}`),P==null)throw new Error("onLoad() call is missing a filter");let M=Z++;X[M]={name:u,callback:y,note:n},g.onLoad.push({id:M,filter:P.source,namespace:j||""})},onDispose(h){N.push(h)},esbuild:x.esbuild});A&&(yield A),I.push(g)}catch(d){return{ok:!1,error:d,pluginName:u}}}S["on-start"]=(k,p)=>L(void 0,null,function*(){m.clear();let u={errors:[],warnings:[]};yield Promise.all(W.map(d=>L(void 0,[d],function*({name:g,callback:E,note:A}){try{let h=yield E();if(h!=null){if(typeof h!="object")throw new Error(`Expected onStart() callback in plugin ${te(g)} to return an object`);let y={},$=l(h,y,"errors",ne),n=l(h,y,"warnings",ne);oe(h,y,`from onStart() callback in plugin ${te(g)}`),$!=null&&u.errors.push(...De($,"errors",m,g,void 0)),n!=null&&u.warnings.push(...De(n,"warnings",m,g,void 0))}}catch(h){u.errors.push(Be(h,x,m,A&&A(),g))}}))),o(k,u)}),S["on-resolve"]=(k,p)=>L(void 0,null,function*(){let u={},d="",g,E;for(let A of p.ids)try{({name:d,callback:g,note:E}=z[A]);let h=yield g({path:p.path,importer:p.importer,namespace:p.namespace,resolveDir:p.resolveDir,kind:p.kind,pluginData:m.load(p.pluginData),with:p.with});if(h!=null){if(typeof h!="object")throw new Error(`Expected onResolve() callback in plugin ${te(d)} to return an object`);let y={},$=l(h,y,"pluginName",O),n=l(h,y,"path",O),f=l(h,y,"namespace",O),P=l(h,y,"suffix",O),j=l(h,y,"external",q),M=l(h,y,"sideEffects",q),B=l(h,y,"pluginData",Ee),F=l(h,y,"errors",ne),K=l(h,y,"warnings",ne),J=l(h,y,"watchFiles",ne),Y=l(h,y,"watchDirs",ne);oe(h,y,`from onResolve() callback in plugin ${te(d)}`),u.id=A,$!=null&&(u.pluginName=$),n!=null&&(u.path=n),f!=null&&(u.namespace=f),P!=null&&(u.suffix=P),j!=null&&(u.external=j),M!=null&&(u.sideEffects=M),B!=null&&(u.pluginData=m.store(B)),F!=null&&(u.errors=De(F,"errors",m,d,void 0)),K!=null&&(u.warnings=De(K,"warnings",m,d,void 0)),J!=null&&(u.watchFiles=ft(J,"watchFiles")),Y!=null&&(u.watchDirs=ft(Y,"watchDirs"));break}}catch(h){u={id:A,errors:[Be(h,x,m,E&&E(),d)]};break}o(k,u)}),S["on-load"]=(k,p)=>L(void 0,null,function*(){let u={},d="",g,E;for(let A of p.ids)try{({name:d,callback:g,note:E}=X[A]);let h=yield g({path:p.path,namespace:p.namespace,suffix:p.suffix,pluginData:m.load(p.pluginData),with:p.with});if(h!=null){if(typeof h!="object")throw new Error(`Expected onLoad() callback in plugin ${te(d)} to return an object`);let y={},$=l(h,y,"pluginName",O),n=l(h,y,"contents",st),f=l(h,y,"resolveDir",O),P=l(h,y,"pluginData",Ee),j=l(h,y,"loader",O),M=l(h,y,"errors",ne),B=l(h,y,"warnings",ne),F=l(h,y,"watchFiles",ne),K=l(h,y,"watchDirs",ne);oe(h,y,`from onLoad() callback in plugin ${te(d)}`),u.id=A,$!=null&&(u.pluginName=$),n instanceof Uint8Array?u.contents=n:n!=null&&(u.contents=se(n)),f!=null&&(u.resolveDir=f),P!=null&&(u.pluginData=m.store(P)),j!=null&&(u.loader=j),M!=null&&(u.errors=De(M,"errors",m,d,void 0)),B!=null&&(u.warnings=De(B,"warnings",m,d,void 0)),F!=null&&(u.watchFiles=ft(F,"watchFiles")),K!=null&&(u.watchDirs=ft(K,"watchDirs"));break}}catch(h){u={id:A,errors:[Be(h,x,m,E&&E(),d)]};break}o(k,u)});let R=(k,p)=>p([],[]);G.length>0&&(R=(k,p)=>{L(void 0,null,function*(){let u=[],d=[];for(let{name:g,callback:E,note:A}of G){let h,y;try{let $=yield E(k);if($!=null){if(typeof $!="object")throw new Error(`Expected onEnd() callback in plugin ${te(g)} to return an object`);let n={},f=l($,n,"errors",ne),P=l($,n,"warnings",ne);oe($,n,`from onEnd() callback in plugin ${te(g)}`),f!=null&&(h=De(f,"errors",m,g,void 0)),P!=null&&(y=De(P,"warnings",m,g,void 0))}}catch($){h=[Be($,x,m,A&&A(),g)]}if(h){u.push(...h);try{k.errors.push(...h)}catch{}}if(y){d.push(...y);try{k.warnings.push(...y)}catch{}}}p(u,d)})});let D=()=>{for(let k of N)setTimeout(()=>k(),0)};return ae=!0,{ok:!0,requestPlugins:I,runOnEndCallbacks:R,scheduleOnDisposeCallbacks:D}});function Ct(){let e=new Map,r=0;return{clear(){e.clear()},load(o){return e.get(o)},store(o){if(o===void 0)return-1;let c=r++;return e.set(c,o),c}}}function ut(e,r,o){let c,x=!1;return()=>{if(x)return c;x=!0;try{let S=(e.stack+"").split(`
`);S.splice(1,1);let w=Ut(r,S,o);if(w)return c={text:e.message,location:w},c}catch{}}}function Be(e,r,o,c,x){let S="Internal error",w=null;try{S=(e&&e.message||e)+""}catch{}try{w=Ut(r,(e.stack+"").split(`
`),"")}catch{}return{id:"",pluginName:x,text:S,location:w,notes:c?[c]:[],detail:o?o.store(e):-1}}function Ut(e,r,o){let c="    at ";if(e.readFileSync&&!r[0].startsWith(c)&&r[1].startsWith(c))for(let x=1;x<r.length;x++){let S=r[x];if(S.startsWith(c))for(S=S.slice(c.length);;){let w=/^(?:new |async )?\S+ \((.*)\)$/.exec(S);if(w){S=w[1];continue}if(w=/^eval at \S+ \((.*)\)(?:, \S+:\d+:\d+)?$/.exec(S),w){S=w[1];continue}if(w=/^(\S+):(\d+):(\d+)$/.exec(S),w){let U;try{U=e.readFileSync(w[1],"utf8")}catch{break}let m=U.split(/\r\n|\r|\n|\u2028|\u2029/)[+w[2]-1]||"",W=+w[3]-1,G=m.slice(W,W+o.length)===o?o.length:0;return{file:w[1],namespace:"file",line:+w[2],column:se(m.slice(0,W)).length,length:se(m.slice(W,W+G)).length,lineText:m+`
`+r.slice(1).join(`
`),suggestion:""}}break}}return null}function Qe(e,r,o){let c=5;e+=r.length<1?"":` with ${r.length} error${r.length<2?"":"s"}:`+r.slice(0,c+1).map((S,w)=>{if(w===c)return`
...`;if(!S.location)return`
error: ${S.text}`;let{file:U,line:m,column:W}=S.location,G=S.pluginName?`[plugin: ${S.pluginName}] `:"";return`
${U}:${m}:${W}: ERROR: ${G}${S.text}`}).join("");let x=new Error(e);for(let[S,w]of[["errors",r],["warnings",o]])Object.defineProperty(x,S,{configurable:!0,enumerable:!0,get:()=>w,set:U=>Object.defineProperty(x,S,{configurable:!0,enumerable:!0,value:U})});return x}function We(e,r){for(let o of e)o.detail=r.load(o.detail);return e}function Ot(e,r,o){if(e==null)return null;let c={},x=l(e,c,"file",O),S=l(e,c,"namespace",O),w=l(e,c,"line",$e),U=l(e,c,"column",$e),m=l(e,c,"length",$e),W=l(e,c,"lineText",O),G=l(e,c,"suggestion",O);if(oe(e,c,r),W){let z=W.slice(0,(U&&U>0?U:0)+(m&&m>0?m:0)+(o&&o>0?o:80));!/[\x7F-\uFFFF]/.test(z)&&!/\n/.test(W)&&(W=z)}return{file:x||"",namespace:S||"",line:w||0,column:U||0,length:m||0,lineText:W||"",suggestion:G||""}}function De(e,r,o,c,x){let S=[],w=0;for(let U of e){let m={},W=l(U,m,"id",O),G=l(U,m,"pluginName",O),z=l(U,m,"text",O),X=l(U,m,"location",ze),N=l(U,m,"notes",ne),Z=l(U,m,"detail",Ee),H=`in element ${w} of "${r}"`;oe(U,m,H);let I=[];if(N)for(let ae of N){let R={},D=l(ae,R,"text",O),k=l(ae,R,"location",ze);oe(ae,R,H),I.push({text:D||"",location:Ot(k,H,x)})}S.push({id:W||"",pluginName:G||c,text:z||"",location:Ot(X,H,x),notes:I,detail:o?o.store(Z):-1}),w++}return S}function ft(e,r){let o=[];for(let c of e){if(typeof c!="string")throw new Error(`${te(r)} must be an array of strings`);o.push(c)}return o}function un(e,r){let o=Object.create(null);for(let c in e){let x=e[c];if(typeof x!="string")throw new Error(`key ${te(c)} in object ${te(r)} must be a string`);o[c]=x}return o}function fn({path:e,contents:r,hash:o}){let c=null;return{path:e,contents:r,hash:o,get text(){let x=this.contents;return(c===null||x!==r)&&(r=x,c=ge(x)),c}}}var cn="0.25.0",hn=e=>Ke().build(e),dn=e=>Ke().context(e),gn=(e,r)=>Ke().transform(e,r),mn=(e,r)=>Ke().formatMessages(e,r),pn=(e,r)=>Ke().analyzeMetafile(e,r),vn=()=>{throw new Error('The "buildSync" API only works in node')},yn=()=>{throw new Error('The "transformSync" API only works in node')},wn=()=>{throw new Error('The "formatMessagesSync" API only works in node')},bn=()=>{throw new Error('The "analyzeMetafileSync" API only works in node')},xn=()=>(ct&&ct(),Promise.resolve()),Ne,ct,ht,Ke=()=>{if(ht)return ht;throw Ne?new Error('You need to wait for the promise returned from "initialize" to be resolved before calling this'):new Error('You need to call "initialize" before calling this')},kn=e=>{e=Fe(e||{});let r=e.wasmURL,o=e.wasmModule,c=e.worker!==!1;if(!r&&!o)throw new Error('Must provide either the "wasmURL" option or the "wasmModule" option');if(Ne)throw new Error('Cannot call "initialize" more than once');return Ne=Sn(r||"",o,c),Ne.catch(()=>{Ne=void 0}),Ne},Sn=(e,r,o)=>L(void 0,null,function*(){let c,x,S=new Promise(z=>x=z);if(o){let z=new Blob([`onmessage=((postMessage) => {
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
    })(postMessage)`],{type:"text/javascript"});c=new Worker(URL.createObjectURL(z))}else{let z=(N=>{var Z=(R,D,k)=>new Promise((p,u)=>{var d=A=>{try{E(k.next(A))}catch(h){u(h)}},g=A=>{try{E(k.throw(A))}catch(h){u(h)}},E=A=>A.done?p(A.value):Promise.resolve(A.value).then(d,g);E((k=k.apply(R,D)).next())});let H,I={};for(let R=self;R;R=Object.getPrototypeOf(R))for(let D of Object.getOwnPropertyNames(R))D in I||Object.defineProperty(I,D,{get:()=>self[D]});(()=>{let R=()=>{let p=new Error("not implemented");return p.code="ENOSYS",p};if(!I.fs){let p="";I.fs={constants:{O_WRONLY:-1,O_RDWR:-1,O_CREAT:-1,O_TRUNC:-1,O_APPEND:-1,O_EXCL:-1},writeSync(u,d){p+=k.decode(d);let g=p.lastIndexOf(`
`);return g!=-1&&(console.log(p.substring(0,g)),p=p.substring(g+1)),d.length},write(u,d,g,E,A,h){if(g!==0||E!==d.length||A!==null){h(R());return}let y=this.writeSync(u,d);h(null,y)},chmod(u,d,g){g(R())},chown(u,d,g,E){E(R())},close(u,d){d(R())},fchmod(u,d,g){g(R())},fchown(u,d,g,E){E(R())},fstat(u,d){d(R())},fsync(u,d){d(null)},ftruncate(u,d,g){g(R())},lchown(u,d,g,E){E(R())},link(u,d,g){g(R())},lstat(u,d){d(R())},mkdir(u,d,g){g(R())},open(u,d,g,E){E(R())},read(u,d,g,E,A,h){h(R())},readdir(u,d){d(R())},readlink(u,d){d(R())},rename(u,d,g){g(R())},rmdir(u,d){d(R())},stat(u,d){d(R())},symlink(u,d,g){g(R())},truncate(u,d,g){g(R())},unlink(u,d){d(R())},utimes(u,d,g,E){E(R())}}}if(I.process||(I.process={getuid(){return-1},getgid(){return-1},geteuid(){return-1},getegid(){return-1},getgroups(){throw R()},pid:-1,ppid:-1,umask(){throw R()},cwd(){throw R()},chdir(){throw R()}}),!I.crypto)throw new Error("globalThis.crypto is not available, polyfill required (crypto.getRandomValues only)");if(!I.performance)throw new Error("globalThis.performance is not available, polyfill required (performance.now only)");if(!I.TextEncoder)throw new Error("globalThis.TextEncoder is not available, polyfill required");if(!I.TextDecoder)throw new Error("globalThis.TextDecoder is not available, polyfill required");let D=new TextEncoder("utf-8"),k=new TextDecoder("utf-8");I.Go=class{constructor(){this.argv=["js"],this.env={},this.exit=n=>{n!==0&&console.warn("exit code:",n)},this._exitPromise=new Promise(n=>{this._resolveExitPromise=n}),this._pendingEvent=null,this._scheduledTimeouts=new Map,this._nextCallbackTimeoutID=1;let p=(n,f)=>{this.mem.setUint32(n+0,f,!0),this.mem.setUint32(n+4,Math.floor(f/4294967296),!0)},u=(n,f)=>{this.mem.setUint32(n+0,f,!0)},d=n=>{let f=this.mem.getUint32(n+0,!0),P=this.mem.getInt32(n+4,!0);return f+P*4294967296},g=n=>{let f=this.mem.getFloat64(n,!0);if(f===0)return;if(!isNaN(f))return f;let P=this.mem.getUint32(n,!0);return this._values[P]},E=(n,f)=>{if(typeof f=="number"&&f!==0){if(isNaN(f)){this.mem.setUint32(n+4,2146959360,!0),this.mem.setUint32(n,0,!0);return}this.mem.setFloat64(n,f,!0);return}if(f===void 0){this.mem.setFloat64(n,0,!0);return}let j=this._ids.get(f);j===void 0&&(j=this._idPool.pop(),j===void 0&&(j=this._values.length),this._values[j]=f,this._goRefCounts[j]=0,this._ids.set(f,j)),this._goRefCounts[j]++;let M=0;switch(typeof f){case"object":f!==null&&(M=1);break;case"string":M=2;break;case"symbol":M=3;break;case"function":M=4;break}this.mem.setUint32(n+4,2146959360|M,!0),this.mem.setUint32(n,j,!0)},A=n=>{let f=d(n+0),P=d(n+8);return new Uint8Array(this._inst.exports.mem.buffer,f,P)},h=n=>{let f=d(n+0),P=d(n+8),j=new Array(P);for(let M=0;M<P;M++)j[M]=g(f+M*8);return j},y=n=>{let f=d(n+0),P=d(n+8);return k.decode(new DataView(this._inst.exports.mem.buffer,f,P))},$=Date.now()-performance.now();this.importObject={_gotest:{add:(n,f)=>n+f},gojs:{"runtime.wasmExit":n=>{n>>>=0;let f=this.mem.getInt32(n+8,!0);this.exited=!0,delete this._inst,delete this._values,delete this._goRefCounts,delete this._ids,delete this._idPool,this.exit(f)},"runtime.wasmWrite":n=>{n>>>=0;let f=d(n+8),P=d(n+16),j=this.mem.getInt32(n+24,!0);I.fs.writeSync(f,new Uint8Array(this._inst.exports.mem.buffer,P,j))},"runtime.resetMemoryDataView":n=>{n>>>=0,this.mem=new DataView(this._inst.exports.mem.buffer)},"runtime.nanotime1":n=>{n>>>=0,p(n+8,($+performance.now())*1e6)},"runtime.walltime":n=>{n>>>=0;let f=new Date().getTime();p(n+8,f/1e3),this.mem.setInt32(n+16,f%1e3*1e6,!0)},"runtime.scheduleTimeoutEvent":n=>{n>>>=0;let f=this._nextCallbackTimeoutID;this._nextCallbackTimeoutID++,this._scheduledTimeouts.set(f,setTimeout(()=>{for(this._resume();this._scheduledTimeouts.has(f);)console.warn("scheduleTimeoutEvent: missed timeout event"),this._resume()},d(n+8))),this.mem.setInt32(n+16,f,!0)},"runtime.clearTimeoutEvent":n=>{n>>>=0;let f=this.mem.getInt32(n+8,!0);clearTimeout(this._scheduledTimeouts.get(f)),this._scheduledTimeouts.delete(f)},"runtime.getRandomData":n=>{n>>>=0,crypto.getRandomValues(A(n+8))},"syscall/js.finalizeRef":n=>{n>>>=0;let f=this.mem.getUint32(n+8,!0);if(this._goRefCounts[f]--,this._goRefCounts[f]===0){let P=this._values[f];this._values[f]=null,this._ids.delete(P),this._idPool.push(f)}},"syscall/js.stringVal":n=>{n>>>=0,E(n+24,y(n+8))},"syscall/js.valueGet":n=>{n>>>=0;let f=Reflect.get(g(n+8),y(n+16));n=this._inst.exports.getsp()>>>0,E(n+32,f)},"syscall/js.valueSet":n=>{n>>>=0,Reflect.set(g(n+8),y(n+16),g(n+32))},"syscall/js.valueDelete":n=>{n>>>=0,Reflect.deleteProperty(g(n+8),y(n+16))},"syscall/js.valueIndex":n=>{n>>>=0,E(n+24,Reflect.get(g(n+8),d(n+16)))},"syscall/js.valueSetIndex":n=>{n>>>=0,Reflect.set(g(n+8),d(n+16),g(n+24))},"syscall/js.valueCall":n=>{n>>>=0;try{let f=g(n+8),P=Reflect.get(f,y(n+16)),j=h(n+32),M=Reflect.apply(P,f,j);n=this._inst.exports.getsp()>>>0,E(n+56,M),this.mem.setUint8(n+64,1)}catch(f){n=this._inst.exports.getsp()>>>0,E(n+56,f),this.mem.setUint8(n+64,0)}},"syscall/js.valueInvoke":n=>{n>>>=0;try{let f=g(n+8),P=h(n+16),j=Reflect.apply(f,void 0,P);n=this._inst.exports.getsp()>>>0,E(n+40,j),this.mem.setUint8(n+48,1)}catch(f){n=this._inst.exports.getsp()>>>0,E(n+40,f),this.mem.setUint8(n+48,0)}},"syscall/js.valueNew":n=>{n>>>=0;try{let f=g(n+8),P=h(n+16),j=Reflect.construct(f,P);n=this._inst.exports.getsp()>>>0,E(n+40,j),this.mem.setUint8(n+48,1)}catch(f){n=this._inst.exports.getsp()>>>0,E(n+40,f),this.mem.setUint8(n+48,0)}},"syscall/js.valueLength":n=>{n>>>=0,p(n+16,parseInt(g(n+8).length))},"syscall/js.valuePrepareString":n=>{n>>>=0;let f=D.encode(String(g(n+8)));E(n+16,f),p(n+24,f.length)},"syscall/js.valueLoadString":n=>{n>>>=0;let f=g(n+8);A(n+16).set(f)},"syscall/js.valueInstanceOf":n=>{n>>>=0,this.mem.setUint8(n+24,g(n+8)instanceof g(n+16)?1:0)},"syscall/js.copyBytesToGo":n=>{n>>>=0;let f=A(n+8),P=g(n+32);if(!(P instanceof Uint8Array||P instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}let j=P.subarray(0,f.length);f.set(j),p(n+40,j.length),this.mem.setUint8(n+48,1)},"syscall/js.copyBytesToJS":n=>{n>>>=0;let f=g(n+8),P=A(n+16);if(!(f instanceof Uint8Array||f instanceof Uint8ClampedArray)){this.mem.setUint8(n+48,0);return}let j=P.subarray(0,f.length);f.set(j),p(n+40,j.length),this.mem.setUint8(n+48,1)},debug:n=>{console.log(n)}}}}run(p){return Z(this,null,function*(){if(!(p instanceof WebAssembly.Instance))throw new Error("Go.run: WebAssembly.Instance expected");this._inst=p,this.mem=new DataView(this._inst.exports.mem.buffer),this._values=[NaN,0,null,!0,!1,I,this],this._goRefCounts=new Array(this._values.length).fill(1/0),this._ids=new Map([[0,1],[null,2],[!0,3],[!1,4],[I,5],[this,6]]),this._idPool=[],this.exited=!1;let u=4096,d=$=>{let n=u,f=D.encode($+"\0");return new Uint8Array(this.mem.buffer,u,f.length).set(f),u+=f.length,u%8!==0&&(u+=8-u%8),n},g=this.argv.length,E=[];this.argv.forEach($=>{E.push(d($))}),E.push(0),Object.keys(this.env).sort().forEach($=>{E.push(d(`${$}=${this.env[$]}`))}),E.push(0);let h=u;if(E.forEach($=>{this.mem.setUint32(u,$,!0),this.mem.setUint32(u+4,0,!0),u+=8}),u>=12288)throw new Error("total length of command line and environment variables exceeds limit");this._inst.exports.run(g,h),this.exited&&this._resolveExitPromise(),yield this._exitPromise})}_resume(){if(this.exited)throw new Error("Go program has already exited");this._inst.exports.resume(),this.exited&&this._resolveExitPromise()}_makeFuncWrapper(p){let u=this;return function(){let d={id:p,this:this,args:arguments};return u._pendingEvent=d,u._resume(),d.result}}}})(),H=({data:R})=>{let D=new TextDecoder,k=I.fs,p="";k.writeSync=(A,h)=>{if(A===1)N(h);else if(A===2){p+=D.decode(h);let y=p.split(`
`);y.length>1&&console.log(y.slice(0,-1).join(`
`)),p=y[y.length-1]}else throw new Error("Bad write");return h.length};let u=[],d,g=0;H=({data:A})=>(A.length>0&&(u.push(A),d&&d()),E),k.read=(A,h,y,$,n,f)=>{if(A!==0||y!==0||$!==h.length||n!==null)throw new Error("Bad read");if(u.length===0){d=()=>k.read(A,h,y,$,n,f);return}let P=u[0],j=Math.max(0,Math.min($,P.length-g));h.set(P.subarray(g,g+j),y),g+=j,g===P.length&&(u.shift(),g=0),f(null,j)};let E=new I.Go;return E.argv=["","--service=0.25.0"],ae(R,E).then(A=>{N(null),E.run(A)},A=>{N(A)}),E};function ae(R,D){return Z(this,null,function*(){if(R instanceof WebAssembly.Module)return WebAssembly.instantiate(R,D.importObject);let k=yield fetch(R);if(!k.ok)throw new Error(`Failed to download ${JSON.stringify(R)}`);if("instantiateStreaming"in WebAssembly&&/^application\/wasm($|;)/i.test(k.headers.get("Content-Type")||""))return(yield WebAssembly.instantiateStreaming(k,D.importObject)).instance;let p=yield k.arrayBuffer();return(yield WebAssembly.instantiate(p,D.importObject)).instance})}return R=>H(R)})(N=>c.onmessage({data:N})),X;c={onmessage:null,postMessage:N=>setTimeout(()=>{try{X=z({data:N})}catch(Z){x(Z)}}),terminate(){if(X)for(let N of X._scheduledTimeouts.values())clearTimeout(N)}}}let w,U,m=new Promise((z,X)=>{w=z,U=X});c.onmessage=({data:z})=>{c.onmessage=({data:X})=>W(X),z?U(z):w()},c.postMessage(r||new URL(e,location.href).toString());let{readFromStdout:W,service:G}=at({writeToStdin(z){c.postMessage(z)},isSync:!1,hasFS:!1,esbuild:ie});yield m,ct=()=>{c.terminate(),Ne=void 0,ct=void 0,ht=void 0},ht={build:z=>new Promise((X,N)=>{S.then(N),G.buildOrContext({callName:"build",refs:null,options:z,isTTY:!1,defaultWD:"/",callback:(Z,H)=>Z?N(Z):X(H)})}),context:z=>new Promise((X,N)=>{S.then(N),G.buildOrContext({callName:"context",refs:null,options:z,isTTY:!1,defaultWD:"/",callback:(Z,H)=>Z?N(Z):X(H)})}),transform:(z,X)=>new Promise((N,Z)=>{S.then(Z),G.transform({callName:"transform",refs:null,input:z,options:X||{},isTTY:!1,fs:{readFile(H,I){I(new Error("Internal error"),null)},writeFile(H,I){I(null)}},callback:(H,I)=>H?Z(H):N(I)})}),formatMessages:(z,X)=>new Promise((N,Z)=>{S.then(Z),G.formatMessages({callName:"formatMessages",refs:null,messages:z,options:X,callback:(H,I)=>H?Z(H):N(I)})}),analyzeMetafile:(z,X)=>new Promise((N,Z)=>{S.then(Z),G.analyzeMetafile({callName:"analyzeMetafile",refs:null,metafile:typeof z=="string"?z:JSON.stringify(z),options:X,callback:(H,I)=>H?Z(H):N(I)})})}}),En=ie})(typeof St=="object"?St:{set exports(i){(typeof self<"u"?self:this).esbuild=i}})});function wt(i){let t=/^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(i.trim());return t?{major:+t[1],minor:+t[2],patch:+t[3],pre:t[4]?t[4].split("."):[]}:null}function Me(i,t){if(i.major!==t.major)return i.major-t.major;if(i.minor!==t.minor)return i.minor-t.minor;if(i.patch!==t.patch)return i.patch-t.patch;if(i.pre.length===0&&t.pre.length===0)return 0;if(i.pre.length===0)return 1;if(t.pre.length===0)return-1;let s=Math.max(i.pre.length,t.pre.length);for(let a=0;a<s;a++){let v=i.pre[a],T=t.pre[a];if(v===void 0)return-1;if(T===void 0)return 1;let b=/^\d+$/.test(v),V=/^\d+$/.test(T);if(b&&V){let L=+v-+T;if(L!==0)return L}else{if(b)return-1;if(V)return 1;if(v!==T)return v<T?-1:1}}return 0}function In(i){let t=/^(>=|<=|>|<|=|\^|~)?\s*(.+)$/.exec(i.trim());if(!t)return()=>!1;let s=t[1]||"=",a=t[2].trim();if(a==="*"||a==="")return()=>!0;let v=a.split(".");if(v.some(b=>b==="x"||b==="X"||b==="*")||v.length<3){let b=v[0]===void 0||/[xX*]/.test(v[0])?null:+v[0],V=v[1]===void 0||/[xX*]/.test(v[1])?null:+v[1];return L=>!(b!==null&&L.major!==b||V!==null&&L.minor!==V)}let T=wt(a);if(!T)return()=>!1;switch(s){case"^":return b=>Me(b,T)<0?!1:T.major>0?b.major===T.major:T.minor>0?b.major===0&&b.minor===T.minor:b.major===0&&b.minor===0&&b.patch===T.patch;case"~":return b=>Me(b,T)>=0&&b.major===T.major&&b.minor===T.minor;case">":return b=>Me(b,T)>0;case">=":return b=>Me(b,T)>=0;case"<":return b=>Me(b,T)<0;case"<=":return b=>Me(b,T)<=0;default:return b=>Me(b,T)===0}}function Mn(i){let t=i.trim().split(/\s+/).filter(Boolean).map(In);return s=>t.every(a=>a(s))}function zn(i,t){let s=wt(i);if(!s)return!1;let a=t.trim();return a==="*"||a===""||a==="latest"?!0:a.split("||").some(v=>Mn(v)(s))}function Rt(i,t){let s=/-([0-9A-Za-z.-]+)/.test(t),a=null,v=null;for(let T of i){let b=wt(T);b&&(b.pre.length>0&&!s||zn(T,t)&&(a===null||Me(b,a)>0)&&(a=b,v=T))}return v}var ye=Uint8Array,qe=Uint16Array,Fn=Int32Array,_t=new ye([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),It=new ye([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),Bn=new ye([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),Mt=function(i,t){for(var s=new qe(31),a=0;a<31;++a)s[a]=t+=1<<i[a-1];for(var v=new Fn(s[30]),a=1;a<30;++a)for(var T=s[a];T<s[a+1];++T)v[T]=T-s[a]<<5|a;return{b:s,r:v}},zt=Mt(_t,2),Ft=zt.b,Nn=zt.r;Ft[28]=258,Nn[258]=28;var Bt=Mt(It,0),Vn=Bt.b,Tr=Bt.r,kt=new qe(32768);for(ee=0;ee<32768;++ee)Re=(ee&43690)>>1|(ee&21845)<<1,Re=(Re&52428)>>2|(Re&13107)<<2,Re=(Re&61680)>>4|(Re&3855)<<4,kt[ee]=((Re&65280)>>8|(Re&255)<<8)>>1;var Re,ee,tt=(function(i,t,s){for(var a=i.length,v=0,T=new qe(t);v<a;++v)i[v]&&++T[i[v]-1];var b=new qe(t);for(v=1;v<t;++v)b[v]=b[v-1]+T[v-1]<<1;var V;if(s){V=new qe(1<<t);var L=15-t;for(v=0;v<a;++v)if(i[v])for(var ie=v<<4|i[v],ce=t-i[v],_=b[i[v]-1]++<<ce,Q=_|(1<<ce)-1;_<=Q;++_)V[kt[_]>>L]=ie}else for(V=new qe(a),v=0;v<a;++v)i[v]&&(V[v]=kt[b[i[v]-1]++]>>15-i[v]);return V}),nt=new ye(288);for(ee=0;ee<144;++ee)nt[ee]=8;var ee;for(ee=144;ee<256;++ee)nt[ee]=9;var ee;for(ee=256;ee<280;++ee)nt[ee]=7;var ee;for(ee=280;ee<288;++ee)nt[ee]=8;var ee,Nt=new ye(32);for(ee=0;ee<32;++ee)Nt[ee]=5;var ee;var Ln=tt(nt,9,1);var Wn=tt(Nt,5,1),bt=function(i){for(var t=i[0],s=1;s<i.length;++s)i[s]>t&&(t=i[s]);return t},Te=function(i,t,s){var a=t/8|0;return(i[a]|i[a+1]<<8)>>(t&7)&s},xt=function(i,t){var s=t/8|0;return(i[s]|i[s+1]<<8|i[s+2]<<16)>>(t&7)},Gn=function(i){return(i+7)/8|0},qn=function(i,t,s){return(t==null||t<0)&&(t=0),(s==null||s>i.length)&&(s=i.length),new ye(i.subarray(t,s))};var Jn=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],je=function(i,t,s){var a=new Error(t||Jn[i]);if(a.code=i,Error.captureStackTrace&&Error.captureStackTrace(a,je),!s)throw a;return a},Zn=function(i,t,s,a){var v=i.length,T=a?a.length:0;if(!v||t.f&&!t.l)return s||new ye(0);var b=!s,V=b||t.i!=2,L=t.i;b&&(s=new ye(v*3));var ie=function(ot){var at=s.length;if(ot>at){var lt=new ye(Math.max(at*2,ot));lt.set(s),s=lt}},ce=t.f||0,_=t.p||0,Q=t.b||0,se=t.l,ge=t.d,Se=t.m,he=t.n,be=v*8;do{if(!se){ce=Te(i,_,1);var te=Te(i,_+1,3);if(_+=3,te)if(te==1)se=Ln,ge=Wn,Se=9,he=5;else if(te==2){var Ee=Te(i,_,31)+257,q=Te(i,_+10,15)+4,O=Ee+Te(i,_+5,31)+1;_+=14;for(var Pe=new ye(O),$e=new ye(19),me=0;me<q;++me)$e[Bn[me]]=Te(i,_+me*3,7);_+=q*3;for(var Ze=bt($e),ne=(1<<Ze)-1,pe=tt($e,Ze,1),me=0;me<O;){var it=pe[Te(i,_,ne)];_+=it&15;var de=it>>4;if(de<16)Pe[me++]=de;else{var _e=0,ze=0;for(de==16?(ze=3+Te(i,_,3),_+=2,_e=Pe[me-1]):de==17?(ze=3+Te(i,_,7),_+=3):de==18&&(ze=11+Te(i,_,127),_+=7);ze--;)Pe[me++]=_e}}var He=Pe.subarray(0,Ee),Ae=Pe.subarray(Ee);Se=bt(He),he=bt(Ae),se=tt(He,Se,1),ge=tt(Ae,he,1)}else je(1);else{var de=Gn(_)+4,Ue=i[de-4]|i[de-3]<<8,Oe=de+Ue;if(Oe>v){L&&je(0);break}V&&ie(Q+Ue),s.set(i.subarray(de,Oe),Q),t.b=Q+=Ue,t.p=_=Oe*8,t.f=ce;continue}if(_>be){L&&je(0);break}}V&&ie(Q+131072);for(var vt=(1<<Se)-1,st=(1<<he)-1,Ye=_;;Ye=_){var _e=se[xt(i,_)&vt],l=_e>>4;if(_+=_e&15,_>be){L&&je(0);break}if(_e||je(2),l<256)s[Q++]=l;else if(l==256){Ye=_,se=null;break}else{var oe=l-254;if(l>264){var me=l-257,Fe=_t[me];oe=Te(i,_,(1<<Fe)-1)+Ft[me],_+=Fe}var Le=ge[xt(i,_)&st],Ie=Le>>4;Le||je(3),_+=Le&15;var Ae=Vn[Ie];if(Ie>3){var Fe=It[Ie];Ae+=xt(i,_)&(1<<Fe)-1,_+=Fe}if(_>be){L&&je(0);break}V&&ie(Q+131072);var le=Q+oe;if(Q<Ae){var Xe=T-Ae,yt=Math.min(Ae,le);for(Xe+Q<0&&je(3);Q<yt;++Q)s[Q]=a[Xe+Q]}for(;Q<le;++Q)s[Q]=s[Q-Ae]}}t.l=se,t.p=Ye,t.b=Q,t.f=ce,se&&(ce=1,t.m=Se,t.d=ge,t.n=he)}while(!ce);return Q!=s.length&&b?qn(s,0,Q):s.subarray(0,Q)};var Hn=new ye(0);var Yn=function(i){(i[0]!=31||i[1]!=139||i[2]!=8)&&je(6,"invalid gzip data");var t=i[3],s=10;t&4&&(s+=(i[10]|i[11]<<8)+2);for(var a=(t>>3&1)+(t>>4&1);a>0;a-=!i[s++]);return s+(t&2)},Xn=function(i){var t=i.length;return(i[t-4]|i[t-3]<<8|i[t-2]<<16|i[t-1]<<24)>>>0};function Vt(i,t){var s=Yn(i);return s+8>i.length&&je(6,"invalid gzip data"),Zn(i.subarray(s,-8),{i:2},t&&t.out||new ye(Xn(i)),t&&t.dictionary)}var Qn=typeof TextDecoder<"u"&&new TextDecoder,Kn=0;try{Qn.decode(Hn,{stream:!0}),Kn=1}catch{}function er(i){let t=/^sha512-(.+)$/.exec(i.trim());return t?t[1]:null}async function tr(i){let t=await crypto.subtle.digest("SHA-512",i),s=new Uint8Array(t),a="";for(let v of s)a+=String.fromCharCode(v);return btoa(a)}async function Lt(i,t){let s=er(t);return s?await tr(i)===s:!1}function dt(i,t,s){let a=t,v=Math.min(t+s,i.length);for(;a<v&&i[a]!==0;)a++;let T="";for(let b=t;b<a;b++)T+=String.fromCharCode(i[b]);return T}function nr(i,t,s){let a=dt(i,t,s).trim();return a&&parseInt(a,8)||0}function rr(i){let t=[],s=0,a=null;for(;s+512<=i.length;){let v=i.subarray(s,s+512);if(v.every(_=>_===0))break;let T=dt(v,0,100),b=dt(v,345,155);b&&(T=b+"/"+T),a&&(T=a,a=null);let V=nr(v,124,12),L=String.fromCharCode(v[156]),ie=s+512,ce=Math.ceil(V/512)*512;if(L==="L")a=dt(i,ie,V).replace(/\0+$/,"");else if(L==="0"||L==="\0"||L===""){let _=T.replace(/^package\//,"");_&&!_.endsWith("/")&&t.push({name:_,data:i.slice(ie,ie+V)})}s=ie+ce}return t}function Wt(i){return rr(Vt(i))}function Gt(i){if(i.startsWith("/")||i.includes("\0"))return!1;let t=i.split("/"),s=0;for(let a of t)if(a===".."){if(s--,s<0)return!1}else a!=="."&&a!==""&&s++;return!0}var ir=["install","postinstall","preinstall","prepare"];function qt(i,t){let s=i.name??"package";if(i.gypfile===!0)return`${s} \u4F7F\u7528 node-gyp \u539F\u751F\u7F16\u8BD1`;if(t.some(v=>v==="binding.gyp"||v.endsWith("/binding.gyp")))return`${s} \u542B binding.gyp \u539F\u751F\u6A21\u5757`;if(i.binary)return`${s} \u9700\u4E0B\u8F7D\u539F\u751F\u4E8C\u8FDB\u5236\uFF08node-pre-gyp\uFF09`;let a=i.scripts??{};for(let v of ir){let T=a[v];if(T&&/node-gyp|prebuild|node-pre-gyp|cmake|make\b|\.node\b/.test(T))return`${s} \u7684 ${v} \u811A\u672C\u9700\u539F\u751F\u6784\u5EFA`}return null}var Jt="\u8BE5\u5305\u9700\u8981\u539F\u751F\u6784\u5EFA\uFF0CWebView \u8FD0\u884C\u65F6\u4E0D\u652F\u6301\u3002\u8BF7\u6539\u7528 wasm \u53D8\u4F53\uFF08\u5982 esbuild-wasm\u3001@rollup/wasm-node\uFF09\uFF0C\u6216\u79FB\u9664\u8BE5\u4F9D\u8D56\u3002";var Zt="https://registry.npmjs.org";async function Ht(i,t,s,a){var ie,ce;let v={},T={},b=Object.entries(i).map(([_,Q])=>({name:_,range:Q})),V=0,L=new Set;for(;b.length;){let{name:_,range:Q}=b.shift();if(!L.has(_)){L.add(_),a.progress(Math.min(.95,V/Math.max(1,V+b.length+1)),`\u5B89\u88C5 ${_}`);try{let se=await t.fetch(`${Zt}/${encodeURIComponent(_)}`),ge=JSON.parse(new TextDecoder().decode(se)),Se=Object.keys(ge.versions??{}),he=Rt(Se,Q);if(!he)return{ok:!1,installed:v,lock:T,error:`${_}@${Q} \u6CA1\u6709\u5339\u914D\u7684\u7248\u672C`};let be=ge.versions[he],te=((ie=be.dist)==null?void 0:ie.integrity)??"",de=((ce=be.dist)==null?void 0:ce.tarball)??`${Zt}/${_}/-/${_}-${he}.tgz`,Ue=await t.fetch(de,te);if(te&&!await Lt(Ue,te))return{ok:!1,installed:v,lock:T,error:`${_}@${he} \u5B8C\u6574\u6027\u6821\u9A8C\u5931\u8D25`};let Oe=Wt(Ue),Ee=qt(be,Oe.map(q=>q.name));if(Ee)return{ok:!1,installed:v,lock:T,error:`${Ee}\u3002${Jt}`};for(let q of Oe)Gt(q.name)&&s.write(`node_modules/${_}/${q.name}`,q.data);v[_]=he,T[_]={version:he,integrity:te},V++;for(let[q,O]of Object.entries(be.dependencies??{}))L.has(q)||b.push({name:q,range:O})}catch(se){return{ok:!1,installed:v,lock:T,error:`\u5B89\u88C5 ${_} \u5931\u8D25\uFF1A${String(se)}`}}}}return s.writeText("package-lock.json",JSON.stringify({lockfileVersion:3,packages:T},null,2)),a.progress(1,"\u5B89\u88C5\u5B8C\u6210"),{ok:!0,installed:v,lock:T}}function Je(i){if(i.includes("\0"))return null;let t=i.replace(/\\/g,"/").split("/"),s=[];for(let a of t)if(!(a===""||a==="."))if(a===".."){if(s.length===0)return null;s.pop()}else s.push(a);return s.join("/")}var gt=class{constructor(){this.files=new Map}write(t,s){let a=Je(t);return a===null?!1:(this.files.set(a,s),!0)}writeText(t,s){return this.write(t,new TextEncoder().encode(s))}read(t){let s=Je(t);return s===null?null:this.files.get(s)??null}readText(t){let s=this.read(t);return s?new TextDecoder().decode(s):null}exists(t){let s=Je(t);return s!==null&&this.files.has(s)}delete(t){let s=Je(t);s!==null&&this.files.delete(s)}evictPrefix(t){let s=Je(t);if(s===null)return 0;let a=0;for(let v of[...this.files.keys()])(v===s||v.startsWith(s+"/"))&&(this.files.delete(v),a++);return a}list(t=""){let s=Je(t)??"";return[...this.files.keys()].filter(a=>s===""||a===s||a.startsWith(s+"/")).sort()}get size(){return this.files.size}};var mt=_n(Yt(),1),Xt=!1;async function Qt(i){Xt||(await mt.initialize({wasmURL:i,worker:!1}),Xt=!0)}var sr={".js":"js",".mjs":"js",".cjs":"js",".jsx":"jsx",".ts":"ts",".tsx":"tsx",".css":"css",".json":"json",".txt":"text",".svg":"text"};function or(i){let t=i.lastIndexOf(".");return sr[t>=0?i.slice(t):""]??"js"}function ar(i,t,s){let a=(T,b)=>{let V=(T?T.split("/"):[]).concat(b.split("/")),L=[];for(let ie of V)ie===""||ie==="."||(ie===".."?L.pop():L.push(ie));return L.join("/")},v=[];if(s.startsWith(".")||s.startsWith("/")){let T=s.startsWith("/")?"":t.split("/").slice(0,-1).join("/"),b=s.startsWith("/")?s.slice(1):a(T,s);v.push(b,b+".js",b+".jsx",b+".ts",b+".tsx",b+".json",b+"/index.js")}else{let T="node_modules/"+s,b=i.readText(T+"/package.json");if(b)try{let V=JSON.parse(b),L=V.module||V.main||"index.js";v.push(a(T,L))}catch{v.push(T+"/index.js")}v.push(T+"/index.js",T+".js")}for(let T of v)if(i.exists(T))return T;return null}function lr(i){return{name:"wvi-memfs",setup(t){t.onResolve({filter:/.*/},s=>{if(s.kind==="entry-point")return{path:s.path,namespace:"wvi"};let a=ar(i,s.importer,s.path);return a?{path:a,namespace:"wvi"}:{path:s.path,namespace:"wvi"}}),t.onLoad({filter:/.*/,namespace:"wvi"},s=>{let a=i.read(s.path);return a?{contents:a,loader:or(s.path)}:{errors:[{text:"\u627E\u4E0D\u5230\u6A21\u5757 "+s.path}]}})}}}async function Kt(i,t){return((await mt.build({entryPoints:[t],bundle:!0,minify:!0,write:!1,outdir:"dist",format:"iife",target:["chrome90"],plugins:[lr(i)],logLevel:"silent"})).outputFiles??[]).map(a=>({path:a.path.replace(/^dist\//,""),contents:a.contents}))}var rt=null;function en(){return window.VueCompilerSFC?Promise.resolve(window.VueCompilerSFC):rt||(rt=new Promise((i,t)=>{let s=document.createElement("script");s.src="vue-compiler.js",s.onload=()=>{let a=window.VueCompilerSFC;a?i(a):t(new Error("Vue \u7F16\u8BD1\u5668\u52A0\u8F7D\u540E\u4E0D\u53EF\u7528"))},s.onerror=()=>{rt=null,t(new Error("Vue \u7F16\u8BD1\u5668\u52A0\u8F7D\u5931\u8D25\uFF08vue-compiler.js\uFF09"))},document.head.appendChild(s)}),rt)}function fe(i,t,s){var a;(a=window.WviBuild)==null||a.post(JSON.stringify({id:s??0,type:i,payload:t}))}var we=new gt,Et=new Map,ur=0,Tt=new Map,fr=0;function tn(i,t){return new Promise(s=>{let a=++fr;Tt.set(a,s),fe("fsWrite",{path:i,text:t},a)})}var jt=new Map,cr=0;function hr(i){return new Promise(t=>{let s=++cr;jt.set(s,t),fe("fsRead",{path:i},s)})}function on(i){let t=atob(i),s=new Uint8Array(t.length);for(let a=0;a<t.length;a++)s[a]=t.charCodeAt(a);return s}function dr(i){let t="";for(let s=0;s<i.length;s++)t+=String.fromCharCode(i[s]);return btoa(t)}var Pt=new Map,gr=0;function nn(i){return new Promise(t=>{let s=++gr;Pt.set(s,a=>t(a===null?null:on(a))),fe("readSource",{path:i},s)})}var $t=new Map,mr=0;function rn(){return new Promise(i=>{let t=++mr;$t.set(t,i),fe("listSource",{},t)})}var At=new Map,pr=0;function sn(i,t){return new Promise(s=>{let a=++pr;At.set(a,s),fe("writeDist",{path:i,b64:dr(t)},a)})}var pt="",vr={fetch(i,t){return new Promise(s=>{let a=++ur;Et.set(a,s),fe("net",{url:i,method:"GET",integrity:t??""},a)})}},Ve={log(i,t){fe("log",{level:i,text:t})},progress(i,t){fe("progress",{fraction:i,label:t})}};async function yr(i){let t=we.readText("package.json");if(t||(t=await hr("package.json"),t&&we.writeText("package.json",t)),!t){fe("done",{ok:!1,summary:"\u7F3A\u5C11 package.json"},i);return}let s=JSON.parse(t),a=await Ht(s.dependencies??{},vr,we,Ve);if(a.ok){let v=we.list("node_modules"),T=0;for(let V of v){let L=we.readText(V);L!==null&&await tn(V,L)&&T++}let b=we.readText("package-lock.json");b!==null&&await tn("package-lock.json",b),we.evictPrefix("node_modules"),Ve.log("info",`\u5DF2\u5199\u76D8 ${T} \u4E2A\u4F9D\u8D56\u6587\u4EF6`),fe("done",{ok:!0,summary:`\u5DF2\u5B89\u88C5 ${Object.keys(a.installed).length} \u4E2A\u5305`},i)}else fe("error",{message:a.error??"\u5B89\u88C5\u5931\u8D25"},i),fe("done",{ok:!1,summary:a.error??"\u5B89\u88C5\u5931\u8D25"},i)}async function wr(){for(let i=0;i<600&&!pt;i++)await new Promise(t=>setTimeout(t,100));return!!pt}async function br(i){if(!await wr()){fe("done",{ok:!1,summary:"esbuild wasm \u672A\u5C31\u7EEA"},i);return}Ve.progress(.1,"\u52A0\u8F7D\u6E90\u6587\u4EF6");let t=await rn();for(let b of t){if(b.startsWith("dist/")||b.startsWith("node_modules/"))continue;let V=await nn(b);V&&we.write(b,V)}let s=await rn();for(let b of s){if(!b.startsWith("node_modules/"))continue;let V=await nn(b);V&&we.write(b,V)}let a=["src/main.tsx","src/main.jsx","src/main.ts","src/main.js","main.js","index.js"].find(b=>we.exists(b));if(!a){fe("done",{ok:!1,summary:"\u627E\u4E0D\u5230\u5165\u53E3\uFF08src/main.* \u6216 index.js\uFF09"},i);return}we.list("src").some(b=>b.endsWith(".vue"))&&(Ve.progress(.3,"\u52A0\u8F7D Vue \u7F16\u8BD1\u5668"),await en()),Ve.progress(.4,"esbuild \u6253\u5305\uFF08TS/JSX \u4EC5\u8F6C\u8BD1\uFF0C\u4E0D\u505A\u7C7B\u578B\u68C0\u67E5\uFF09"),await Qt(pt);let v=await Kt(we,a);Ve.progress(.8,"\u5199\u51FA dist");for(let b of v)await sn("dist/"+b.path,b.contents);let T=we.readText("index.html");T&&await sn("dist/index.html",new TextEncoder().encode(T)),Ve.progress(1,"\u6784\u5EFA\u5B8C\u6210"),fe("done",{ok:!0,summary:`\u6784\u5EFA\u5B8C\u6210\uFF0C${v.length} \u4E2A\u4EA7\u7269`},i)}function xr(i){let t=i.id??0,s=i.payload??{};switch(i.type){case"install":yr(t);break;case"build":br(t).catch(a=>{fe("error",{message:String(a)},t),fe("done",{ok:!1,summary:String(a)},t)});break;case"wasmUrl":pt=String(s.url??"");break;case"cancel":fe("done",{ok:!1,summary:"cancelled"},t);break;case"netResponse":{let a=Et.get(t);a&&(Et.delete(t),a(on(String(s.body??""))));break}case"fsWriteResponse":{let a=Tt.get(t);a&&(Tt.delete(t),a(!!s.ok));break}case"fsReadResponse":{let a=jt.get(t);a&&(jt.delete(t),a(s.exists?String(s.text??""):null));break}case"readSourceResponse":{let a=Pt.get(t);a&&(Pt.delete(t),a(s.exists?String(s.b64??""):null));break}case"listSourceResponse":{let a=$t.get(t);a&&($t.delete(t),a(Array.isArray(s.paths)?s.paths:[]));break}case"writeDistResponse":{let a=At.get(t);a&&(At.delete(t),a(!!s.ok));break}default:break}}window.__wviBuildReceive=i=>{try{xr(JSON.parse(i))}catch(t){fe("error",{message:String(t)})}};var kr=0;function an(){if(window.WviBuild){fe("ready",{});return}++kr<100&&setTimeout(an,50)}an();})();

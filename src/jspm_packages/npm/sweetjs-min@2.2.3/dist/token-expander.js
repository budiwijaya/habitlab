"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var _immutable=require("immutable"),_enforester=require("./enforester"),_termExpander=require("./term-expander.js"),_termExpander2=_interopRequireDefault(_termExpander),_env=require("./env"),_env2=_interopRequireDefault(_env),_ramda=require("ramda"),_=_interopRequireWildcard(_ramda),_terms=require("./terms"),T=_interopRequireWildcard(_terms),_symbol=require("./symbol"),_transforms=require("./transforms"),_errors=require("./errors"),_loadSyntax=require("./load-syntax"),_scope=require("./scope"),_syntax=require("./syntax"),_astDispatcher=require("./ast-dispatcher"),_astDispatcher2=_interopRequireDefault(_astDispatcher),_hygieneUtils=require("./hygiene-utils");function _interopRequireWildcard(a){if(a&&a.__esModule)return a;var b={};if(null!=a)for(var c in a)Object.prototype.hasOwnProperty.call(a,c)&&(b[c]=a[c]);return b.default=a,b}function _interopRequireDefault(a){return a&&a.__esModule?a:{default:a}}function bindImports(a,b,c){let d=[],f=a.forSyntax?c.phase+1:c.phase;return a.namedImports.forEach(g=>{let h=g.binding.name,i=findNameInExports(h,b.exportEntries);if(null!=i){let j=(0,_symbol.gensym)(h.val());c.store.set(j.toString(),new _transforms.VarBindingTransform(h)),c.bindings.addForward(h,i,j,f),d.push(h)}}),(0,_immutable.List)(d)}function findNameInExports(a,b){let c=b.reduce((d,f)=>{return T.isExportFrom(f)?d.concat(f.namedExports.reduce((g,h)=>{return h.exportedName.val()===a.val()?g.concat(h.exportedName):g},(0,_immutable.List)())):T.isExport(f)?d.concat(f.declaration.declarators.reduce((g,h)=>{return h.binding.name.val()===a.val()?g.concat(h.binding.name):g},(0,_immutable.List)())):d},(0,_immutable.List)());return(0,_errors.assert)(1>=c.size,"expecting no more than 1 matching name in exports"),c.get(0)}function removeNames(a,b){let c=a.namedImports.filter(d=>!b.contains(d.binding.name));return a.extend({namedImports:c})}class TokenExpander extends _astDispatcher2.default{constructor(a){super("expand",!1),this.context=a}expand(a){let b=[];if(0===a.size)return(0,_immutable.List)(b);let c=(0,_immutable.List)(),d=new _enforester.Enforester(a,c,this.context);for(;!d.done;)b.push(this.dispatch(d.enforest()));return(0,_immutable.List)(b)}expandVariableDeclarationStatement(a){return a.extend({declaration:this.registerVariableDeclaration(a.declaration)})}expandFunctionDeclaration(a){let b=this.registerFunctionOrClass(a),c=b.name.name;return this.context.env.set(c.resolve(this.context.phase),new _transforms.VarBindingTransform(c)),b}expandImport(a){let b=a.moduleSpecifier.val(),c;a.forSyntax?(c=this.context.modules.getAtPhase(b,this.context.phase+1,this.context.cwd),this.context.store=this.context.modules.visit(c,this.context.phase+1,this.context.store),this.context.store=this.context.modules.invoke(c,this.context.phase+1,this.context.store)):(c=this.context.modules.getAtPhase(b,this.context.phase,this.context.cwd),this.context.store=this.context.modules.visit(c,this.context.phase,this.context.store));let d=bindImports(a,c,this.context);return removeNames(a,d)}expandExport(a){if(T.isFunctionDeclaration(a.declaration)||T.isClassDeclaration(a.declaration))return a.extend({declaration:this.registerFunctionOrClass(a.declaration)});return T.isVariableDeclaration(a.declaration)?a.extend({declaration:this.registerVariableDeclaration(a.declaration)}):a}registerFunctionOrClass(a){let b=a.name.removeScope(this.context.useScope,this.context.phase);return(0,_hygieneUtils.collectBindings)(a.name).forEach(c=>{let d=(0,_symbol.gensym)(c.val());this.context.bindings.add(c,{binding:d,phase:this.context.phase,skipDup:!1}),this.context.env.set(d.toString(),new _transforms.VarBindingTransform(c))}),a.extend({name:b})}registerVariableDeclaration(a){return T.isSyntaxDeclaration(a)||T.isSyntaxrecDeclaration(a)?this.registerSyntaxDeclaration(a):a.extend({declarators:a.declarators.map(b=>{let c=b.binding.removeScope(this.context.useScope,this.context.phase);return(0,_hygieneUtils.collectBindings)(c).forEach(d=>{let f=(0,_symbol.gensym)(d.val());this.context.bindings.add(d,{binding:f,phase:this.context.phase,skipDup:"var"===a.kind}),this.context.env.set(f.toString(),new _transforms.VarBindingTransform(d))}),b.extend({binding:c})})})}registerSyntaxDeclaration(a){if(T.isSyntaxDeclaration(a)){let b=(0,_scope.freshScope)("nonrec");a=a.extend({declarators:a.declarators.map(c=>{let d=c.binding.name,f=d.addScope(b,this.context.bindings,_syntax.ALL_PHASES),g=d.removeScope(this.context.currentScope[this.context.currentScope.length-1],this.context.phase),h=(0,_symbol.gensym)(d.val());return this.context.bindings.addForward(f,g,h,this.context.phase),c.extend({init:c.init.addScope(b,this.context.bindings,_syntax.ALL_PHASES)})})})}return a.extend({declarators:a.declarators.map(b=>{let c=b.binding.removeScope(this.context.useScope,this.context.phase),d=new _termExpander2.default(_.merge(this.context,{phase:this.context.phase+1,env:new _env2.default,store:this.context.store})),f=d.expand(b.init),g=(0,_loadSyntax.evalCompiletimeValue)(f.gen(),_.merge(this.context,{phase:this.context.phase+1}));return(0,_hygieneUtils.collectBindings)(c).forEach(h=>{let i=(0,_symbol.gensym)(h.val());this.context.bindings.add(h,{binding:i,phase:this.context.phase,skipDup:!1});let j=h.resolve(this.context.phase);this.context.env.set(j,new _transforms.CompiletimeTransform(g))}),b.extend({binding:c,init:f})})})}}exports.default=TokenExpander;

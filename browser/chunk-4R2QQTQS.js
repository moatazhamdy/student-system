import{Ma as y,i as m,ua as o,wa as g}from"./chunk-NKD6Z2ZS.js";import{Bb as d,Cb as h,M as p,N as r,Rb as v,S as f,Wa as s,Xa as b,_a as c,aa as i,jb as u}from"./chunk-73I32YJ7.js";var $=["*"],x=({dt:l})=>`
.p-floatlabel {
    display: block;
    position: relative;
}

.p-floatlabel label {
    position: absolute;
    pointer-events: none;
    top: 50%;
    transform: translateY(-50%);
    transition-property: all;
    transition-timing-function: ease;
    line-height: 1;
    font-weight: ${l("floatlabel.font.weight")};
    inset-inline-start: ${l("floatlabel.position.x")};
    color: ${l("floatlabel.color")};
    transition-duration: ${l("floatlabel.transition.duration")};
}

.p-floatlabel:has(.p-textarea) label {
    top: ${l("floatlabel.position.y")};
    transform: translateY(0);
}

.p-floatlabel:has(.p-inputicon:first-child) label {
    inset-inline-start: calc((${l("form.field.padding.x")} * 2) + ${l("icon.size")});
}

.p-floatlabel:has(.ng-invalid.ng-dirty) label {
    color: ${l("floatlabel.invalid.color")};
}

.p-floatlabel:has(input:focus) label,
.p-floatlabel:has(input.p-filled) label,
.p-floatlabel:has(input:-webkit-autofill) label,
.p-floatlabel:has(textarea:focus) label,
.p-floatlabel:has(textarea.p-filled) label,
.p-floatlabel:has(.p-inputwrapper-focus) label,
.p-floatlabel:has(.p-inputwrapper-filled) label {
    top: ${l("floatlabel.over.active.top")};
    transform: translateY(0);
    font-size: ${l("floatlabel.active.font.size")};
    font-weight: ${l("floatlabel.label.active.font.weight")};
}

.p-floatlabel:has(input.p-filled) label,
.p-floatlabel:has(textarea.p-filled) label,
.p-floatlabel:has(.p-inputwrapper-filled) label {
    color: ${l("floatlabel.active.color")};
}

.p-floatlabel:has(input:focus) label,
.p-floatlabel:has(input:-webkit-autofill) label,
.p-floatlabel:has(textarea:focus) label,
.p-floatlabel:has(.p-inputwrapper-focus) label {
    color: ${l("floatlabel.focus.color")};
}

.p-floatlabel-in .p-inputtext,
.p-floatlabel-in .p-textarea,
.p-floatlabel-in .p-select-label,
.p-floatlabel-in .p-multiselect-label-container,
.p-floatlabel-in .p-autocomplete-input-multiple,
.p-floatlabel-in .p-cascadeselect-label,
.p-floatlabel-in .p-treeselect-label {
    padding-top: ${l("floatlabel.in.input.padding.top")};
}

.p-floatlabel-in:has(input:focus) label,
.p-floatlabel-in:has(input.p-filled) label,
.p-floatlabel-in:has(input:-webkit-autofill) label,
.p-floatlabel-in:has(textarea:focus) label,
.p-floatlabel-in:has(textarea.p-filled) label,
.p-floatlabel-in:has(.p-inputwrapper-focus) label,
.p-floatlabel-in:has(.p-inputwrapper-filled) label {
    top: ${l("floatlabel.in.active.top")};
}

.p-floatlabel-on:has(input:focus) label,
.p-floatlabel-on:has(input.p-filled) label,
.p-floatlabel-on:has(input:-webkit-autofill) label,
.p-floatlabel-on:has(textarea:focus) label,
.p-floatlabel-on:has(textarea.p-filled) label,
.p-floatlabel-on:has(.p-inputwrapper-focus) label,
.p-floatlabel-on:has(.p-inputwrapper-filled) label {
    top: 0;
    transform: translateY(-50%);
    border-radius: ${l("floatlabel.on.border.radius")};
    background: ${l("floatlabel.on.active.background")};
    padding: ${l("floatlabel.on.active.padding")};
}
`,F={root:({instance:l,props:n})=>["p-floatlabel",{"p-floatlabel-over":n.variant==="over","p-floatlabel-on":n.variant==="on","p-floatlabel-in":n.variant==="in"}]},w=(()=>{class l extends g{name="floatlabel";theme=x;classes=F;static \u0275fac=(()=>{let a;return function(e){return(a||(a=i(l)))(e||l)}})();static \u0275prov=p({token:l,factory:l.\u0275fac})}return l})();var M=(()=>{class l extends y{_componentStyle=f(w);variant="over";static \u0275fac=(()=>{let a;return function(e){return(a||(a=i(l)))(e||l)}})();static \u0275cmp=s({type:l,selectors:[["p-floatlabel"],["p-floatLabel"],["p-float-label"]],hostVars:8,hostBindings:function(t,e){t&2&&u("p-floatlabel",!0)("p-floatlabel-over",e.variant==="over")("p-floatlabel-on",e.variant==="on")("p-floatlabel-in",e.variant==="in")},inputs:{variant:"variant"},features:[v([w]),c],ngContentSelectors:$,decls:1,vars:0,template:function(t,e){t&1&&(d(),h(0))},dependencies:[m,o],encapsulation:2,changeDetection:0})}return l})(),V=(()=>{class l{static \u0275fac=function(t){return new(t||l)};static \u0275mod=b({type:l});static \u0275inj=r({imports:[M,o,o]})}return l})();export{M as a,V as b};

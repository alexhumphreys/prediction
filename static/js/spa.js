class IdrisError extends Error { }

function __prim_js2idris_array(x){
  let acc = { h:0 };

  for (let i = x.length-1; i>=0; i--) {
      acc = { a1:x[i], a2:acc };
  }
  return acc;
}

function __prim_idris2js_array(x){
  const result = Array();
  while (x.h === undefined) {
    result.push(x.a1); x = x.a2;
  }
  return result;
}

function __lazy(thunk) {
  let res;
  return function () {
    if (thunk === undefined) return res;
    res = thunk();
    thunk = undefined;
    return res;
  };
};

function __prim_stringIteratorNew(_str) {
  return 0
}

function __prim_stringIteratorToString(_, str, it, f) {
  return f(str.slice(it))
}

function __prim_stringIteratorNext(str, it) {
  if (it >= str.length)
    return {h: 0};
  else
    return {a1: str.charAt(it), a2: it + 1};
}

function __tailRec(f,ini) {
  let obj = ini;
  while(true){
    switch(obj.h){
      case 0: return obj.a1;
      default: obj = f(obj);
    }
  }
}

const _idrisworld = Symbol('idrisworld')

const _crashExp = x=>{throw new IdrisError(x)}

const _bigIntOfString = s=> {
  try {
    const idx = s.indexOf('.')
    return idx === -1 ? BigInt(s) : BigInt(s.slice(0, idx))
  } catch (e) { return 0n }
}

const _numberOfString = s=> {
  try {
    const res = Number(s);
    return isNaN(res) ? 0 : res;
  } catch (e) { return 0 }
}

const _intOfString = s=> Math.trunc(_numberOfString(s))

const _truncToChar = x=> String.fromCodePoint(
  (x >= 0 && x <= 55295) || (x >= 57344 && x <= 1114111) ? x : 0
)

// Int8
const _truncInt8 = x => {
  const res = x & 0xff;
  return res >= 0x80 ? res - 0x100 : res;
}

const _truncBigInt8 = x => {
  const res = Number(x & 0xffn);
  return res >= 0x80 ? res - 0x100 : res;
}

// Euclidian Division
const _div = (a,b) => {
  let q = Math.trunc(a / b)
  let r = a % b
  return r < 0 ? (b > 0 ? q - 1 : q + 1) : q
}

const _divBigInt = (a,b) => {
  let q = a / b
  let r = a % b
  return r < 0n ? (b > 0n ? q - 1n : q + 1n) : q
}

// Euclidian Modulo
const _mod = (a,b) => {
  r = a % b
  return r < 0 ? (b > 0 ? r + b : r - b) : r
}

const _modBigInt = (a,b) => {
  r = a % b
  return r < 0n ? (b > 0n ? r + b : r - b) : r
}

const _add8s = (a,b) => _truncInt8(a + b)
const _sub8s = (a,b) => _truncInt8(a - b)
const _mul8s = (a,b) => _truncInt8(a * b)
const _div8s = (a,b) => _truncInt8(_div(a,b))
const _shl8s = (a,b) => _truncInt8(a << b)
const _shr8s = (a,b) => _truncInt8(a >> b)

// Int16
const _truncInt16 = x => {
  const res = x & 0xffff;
  return res >= 0x8000 ? res - 0x10000 : res;
}

const _truncBigInt16 = x => {
  const res = Number(x & 0xffffn);
  return res >= 0x8000 ? res - 0x10000 : res;
}

const _add16s = (a,b) => _truncInt16(a + b)
const _sub16s = (a,b) => _truncInt16(a - b)
const _mul16s = (a,b) => _truncInt16(a * b)
const _div16s = (a,b) => _truncInt16(_div(a,b))
const _shl16s = (a,b) => _truncInt16(a << b)
const _shr16s = (a,b) => _truncInt16(a >> b)

//Int32
const _truncInt32 = x => x & 0xffffffff

const _truncBigInt32 = x => {
  const res = Number(x & 0xffffffffn);
  return res >= 0x80000000 ? res - 0x100000000 : res;
}

const _add32s = (a,b) => _truncInt32(a + b)
const _sub32s = (a,b) => _truncInt32(a - b)
const _div32s = (a,b) => _truncInt32(_div(a,b))

const _mul32s = (a,b) => {
  const res = a * b;
  if (res <= Number.MIN_SAFE_INTEGER || res >= Number.MAX_SAFE_INTEGER) {
    return _truncInt32((a & 0xffff) * b + (b & 0xffff) * (a & 0xffff0000))
  } else {
    return _truncInt32(res)
  }
}

//Int64
const _truncBigInt64 = x => {
  const res = x & 0xffffffffffffffffn;
  return res >= 0x8000000000000000n ? res - 0x10000000000000000n : res;
}

const _add64s = (a,b) => _truncBigInt64(a + b)
const _sub64s = (a,b) => _truncBigInt64(a - b)
const _mul64s = (a,b) => _truncBigInt64(a * b)
const _div64s = (a,b) => _truncBigInt64(_divBigInt(a,b))
const _shl64s = (a,b) => _truncBigInt64(a << b)
const _shr64s = (a,b) => _truncBigInt64(a >> b)

//Bits8
const _truncUInt8 = x => x & 0xff

const _truncUBigInt8 = x => Number(x & 0xffn)

const _add8u = (a,b) => (a + b) & 0xff
const _sub8u = (a,b) => (a - b) & 0xff
const _mul8u = (a,b) => (a * b) & 0xff
const _div8u = (a,b) => Math.trunc(a / b)
const _shl8u = (a,b) => (a << b) & 0xff
const _shr8u = (a,b) => (a >> b) & 0xff

//Bits16
const _truncUInt16 = x => x & 0xffff

const _truncUBigInt16 = x => Number(x & 0xffffn)

const _add16u = (a,b) => (a + b) & 0xffff
const _sub16u = (a,b) => (a - b) & 0xffff
const _mul16u = (a,b) => (a * b) & 0xffff
const _div16u = (a,b) => Math.trunc(a / b)
const _shl16u = (a,b) => (a << b) & 0xffff
const _shr16u = (a,b) => (a >> b) & 0xffff

//Bits32
const _truncUBigInt32 = x => Number(x & 0xffffffffn)

const _truncUInt32 = x => {
  const res = x & -1;
  return res < 0 ? res + 0x100000000 : res;
}

const _add32u = (a,b) => _truncUInt32(a + b)
const _sub32u = (a,b) => _truncUInt32(a - b)
const _mul32u = (a,b) => _truncUInt32(_mul32s(a,b))
const _div32u = (a,b) => Math.trunc(a / b)

const _shl32u = (a,b) => _truncUInt32(a << b)
const _shr32u = (a,b) => _truncUInt32(a <= 0x7fffffff ? a >> b : (b == 0 ? a : (a >> b) ^ ((-0x80000000) >> (b-1))))
const _and32u = (a,b) => _truncUInt32(a & b)
const _or32u = (a,b)  => _truncUInt32(a | b)
const _xor32u = (a,b) => _truncUInt32(a ^ b)

//Bits64
const _truncUBigInt64 = x => x & 0xffffffffffffffffn

const _add64u = (a,b) => (a + b) & 0xffffffffffffffffn
const _mul64u = (a,b) => (a * b) & 0xffffffffffffffffn
const _div64u = (a,b) => a / b
const _shl64u = (a,b) => (a << b) & 0xffffffffffffffffn
const _shr64u = (a,b) => (a >> b) & 0xffffffffffffffffn
const _sub64u = (a,b) => (a - b) & 0xffffffffffffffffn

//String
const _strReverse = x => x.split('').reverse().join('')

const _substr = (o,l,x) => x.slice(o, o + l)

const Main_prim__fetch = ((url,h,w,e,y)=>{
  fetch(url)
    .then(response => {
       if (!response.ok) {
        w(JSON.stringify({
          url: response.url,
          status: response.status,
          statusText: response.statusText,
          redirected: response.redirected,
          ok: response.ok,
        }))(e);
        throw new Error('Network response was not OK');
       } else {
         return response.json();
       }
    })
    .then(json => {
      h(JSON.stringify(json))(e);
    })
    .catch(error => {
      w(error.message)(e)
      console.error(error)
    })
});
const Prelude_Types_fastUnpack = ((str)=>__prim_js2idris_array(Array.from(str)));
const Prelude_Types_fastPack = ((xs)=>__prim_idris2js_array(xs).join(''));
const Prelude_Types_fastConcat = ((xs)=>__prim_idris2js_array(xs).join(''));
const Web_Dom_prim__window = (()=>window);
const Web_Dom_prim__document = (()=>document);
const JS_Util_prim__typeOf = (v=>typeof(v));
const JS_Util_prim__show = (x=>String(x));
const JS_Util_prim__eqv = ((a,b)=>a === b?1:0);
const JS_Util_prim__consoleLog = (x=>console.log(x));
const JS_Inheritance_prim__hasProtoName = ((s,v)=>{
var o = v;
  while (o != null) {
    var p = Object.getPrototypeOf(o);
    var cn = p.constructor.name;
    if (cn === s) {
      return 1;
    } else if (cn === "Object") {
      return 0;
    }
    o = p;
  }
  return 0;
});
const JS_Undefined_undefined = (()=>undefined);
const JS_Undefined_prim__isUndefined = (x=>x === undefined?1:0);
const JS_Nullable_prim__null = (()=>null);
const JS_Boolean_true = (()=>true);
const JS_Boolean_false = (()=>false);
const JS_Array_prim__readIO = ((u,v,arr,n) => arr[n]);
const Web_Internal_DomPrim_EventListener_prim__toEventListener = (x=>(a)=>x(a)());
const Web_Internal_DomPrim_InnerHTML_prim__setInnerHTML = ((x,v)=>{x.innerHTML = v});
const Web_Internal_DomPrim_Document_prim__setBody = ((x,v)=>{x.body = v});
const Web_Internal_DomPrim_InnerHTML_prim__innerHTML = (x=>x.innerHTML);
const Web_Internal_DomPrim_Document_prim__getElementsByClassName = ((x,a)=>x.getElementsByClassName(a));
const Web_Internal_DomPrim_NonElementParentNode_prim__getElementById = ((x,a)=>x.getElementById(a));
const Web_Internal_DomPrim_Document_prim__body = (x=>x.body);
const Web_Internal_DomPrim_EventTarget_prim__addEventListener = ((x,a,b,c)=>x.addEventListener(a,b,c));
const Control_Monad_Dom_Event_prim__input = (x=>x.target.value || x.target.innerHTML || '');
const Control_Monad_Dom_Event_prim__checked = (x=>x.target.checked?1:0);
const Web_Internal_UIEventsPrim_MouseEvent_prim__shiftKey = (x=>x.shiftKey);
const Web_Internal_UIEventsPrim_KeyboardEvent_prim__shiftKey = (x=>x.shiftKey);
const Web_Internal_UIEventsPrim_MouseEvent_prim__screenY = (x=>x.screenY);
const Web_Internal_UIEventsPrim_MouseEvent_prim__screenX = (x=>x.screenX);
const Web_Internal_UIEventsPrim_MouseEvent_prim__metaKey = (x=>x.metaKey);
const Web_Internal_UIEventsPrim_KeyboardEvent_prim__metaKey = (x=>x.metaKey);
const Web_Internal_UIEventsPrim_KeyboardEvent_prim__location = (x=>x.location);
const Web_Internal_UIEventsPrim_KeyboardEvent_prim__key = (x=>x.key);
const Web_Internal_UIEventsPrim_KeyboardEvent_prim__isComposing = (x=>x.isComposing);
const Web_Internal_UIEventsPrim_MouseEvent_prim__ctrlKey = (x=>x.ctrlKey);
const Web_Internal_UIEventsPrim_KeyboardEvent_prim__ctrlKey = (x=>x.ctrlKey);
const Web_Internal_UIEventsPrim_KeyboardEvent_prim__code = (x=>x.code);
const Web_Internal_UIEventsPrim_MouseEvent_prim__clientY = (x=>x.clientY);
const Web_Internal_UIEventsPrim_MouseEvent_prim__clientX = (x=>x.clientX);
const Web_Internal_UIEventsPrim_MouseEvent_prim__buttons = (x=>x.buttons);
const Web_Internal_UIEventsPrim_MouseEvent_prim__button = (x=>x.button);
const Web_Internal_UIEventsPrim_MouseEvent_prim__altKey = (x=>x.altKey);
const Web_Internal_UIEventsPrim_KeyboardEvent_prim__altKey = (x=>x.altKey);
function x24tcOpt_1($0) {
 switch($0.a3.h) {
  case undefined: return {h: 1, a1: $0.a1, a2: {a1: Text_Html_Node_render($0.a3.a1), a2: $0.a2}, a3: $0.a3.a2};
  case 0: return {h: 0, a1: Prelude_Types_fastConcat(Prelude_Types_List_reverse($0.a2))};
 }
}

function Text_Html_Node_n__13023_5114_go($0, $1, $2) {
 return __tailRec(x24tcOpt_1, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_2($0) {
 switch($0.h) {
  case 1: {
   switch($0.a7.h) {
    case 0: return {h: 0, a1: {h: 0}};
    case undefined: return {h: 2, a1: $0.a1, a2: $0.a2, a3: $0.a3, a4: $0.a4, a5: $0.a5, a6: $0.a6, a7: $0.a7.a1.a1, a8: $0.a7.a1.a2, a9: $0.a7.a2, a10: $0.a8, a11: Text_Lexer_Core_scan($0.a7.a1.a1, {h: 0}, $0.a8)};
   }
  }
  case 2: {
   switch($0.a11.h) {
    case undefined: {
     const $16 = _add32s($0.a5, Prelude_Cast_cast_Cast_Nat_Int(Text_Lexer_Core_n__3659_2499_countNLs($0.a1, $0.a2, $0.a3, $0.a4, $0.a5, $0.a6, $0.a11.a1.a1)));
     const $23 = Text_Lexer_Core_n__3659_2500_getCols($0.a1, $0.a2, $0.a3, $0.a4, $0.a5, $0.a6, $0.a11.a1.a1, $0.a4);
     return {h: 0, a1: {a1: {a1: {a1: $0.a8(Prelude_Types_fastPack(Prelude_Types_List_reverse($0.a11.a1.a1))), a2: 0, a3: {a1: $0.a5, a2: $0.a4, a3: $16, a4: $23}}, a2: {a1: $16, a2: {a1: $23, a2: $0.a11.a1.a2}}}}};
    }
    case 0: return {h: 1, a1: $0.a1, a2: $0.a2, a3: $0.a3, a4: $0.a4, a5: $0.a5, a6: $0.a6, a7: $0.a9, a8: $0.a10};
   }
  }
 }
}

function Text_Lexer_Core_n__3659_2501_getFirstToken($0, $1, $2, $3, $4, $5, $6, $7) {
 return __tailRec(x24tcOpt_2, {h: 1, a1: $0, a2: $1, a3: $2, a4: $3, a5: $4, a6: $5, a7: $6, a8: $7});
}

function Text_Lexer_Core_case__tokenisex2cgetFirstToken_2636($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $a) {
 return __tailRec(x24tcOpt_2, {h: 2, a1: $0, a2: $1, a3: $2, a4: $3, a5: $4, a6: $5, a7: $6, a8: $7, a9: $8, a10: $9, a11: $a});
}

function x24tcOpt_3($0) {
 switch($0.a3.h) {
  case 0: return {h: 0, a1: $0.a2};
  case undefined: return {h: 1, a1: $0.a1, a2: $0.a1($0.a2)($0.a3.a1), a3: $0.a3.a2};
 }
}

function Prelude_Types_foldl_Foldable_List($0, $1, $2) {
 return __tailRec(x24tcOpt_3, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_4($0) {
 switch($0.a2.h) {
  case 0: return {h: 0, a1: _truncToChar($0.a3)};
  case undefined: return {h: 1, a1: $0.a1, a2: $0.a2.a2, a3: _add32s(Language_JSON_String_Tokens_n__3203_1166_hexVal($0.a1, $0.a2.a1), _mul32s(Number(_truncBigInt32(16n)), $0.a3))};
 }
}

function Language_JSON_String_Tokens_n__3203_1167_fromHex($0, $1, $2) {
 return __tailRec(x24tcOpt_4, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_5($0) {
 const $2 = $0.a3($0.a4)($0.a5)($0.a6);
 switch($2.h) {
  case 1: return {h: 0, a1: $2.a1};
  case 0: return {h: 1, a1: $0.a1, a2: $0.a2, a3: $0.a3, a4: $2.a1, a5: $2.a2, a6: undefined};
 }
}

function Control_MonadRec_n__6429_3846_run($0, $1, $2, $3, $4, $5) {
 return __tailRec(x24tcOpt_5, {h: 1, a1: $0, a2: $1, a3: $2, a4: $3, a5: $4, a6: $5});
}

function x24tcOpt_6($0) {
 switch($0.h) {
  case 1: return {h: 2, a1: $0.a6, a2: $0.a5, a3: $0.a4, a4: $0.a3, a5: $0.a2, a6: $0.a1, a7: Text_Lexer_Core_n__3659_2501_getFirstToken($0.a6, $0.a5, $0.a4, $0.a3, $0.a2, $0.a1, $0.a5, $0.a6)};
  case 2: {
   switch($0.a7.h) {
    case undefined: {
     switch($0.a6($0.a7.a1.a1.a1)) {
      case 1: return {h: 0, a1: {a1: Prelude_Types_List_reverse($0.a3), a2: {a1: $0.a5, a2: {a1: $0.a4, a2: {h: 0}}}}};
      case 0: return {h: 1, a1: $0.a6, a2: $0.a7.a1.a2.a1, a3: $0.a7.a1.a2.a2.a1, a4: {a1: $0.a7.a1.a1, a2: $0.a3}, a5: $0.a2, a6: $0.a7.a1.a2.a2.a2};
     }
    }
    case 0: return {h: 0, a1: {a1: Prelude_Types_List_reverse($0.a3), a2: {a1: $0.a5, a2: {a1: $0.a4, a2: $0.a1}}}};
   }
  }
 }
}

function Text_Lexer_Core_tokenise($0, $1, $2, $3, $4, $5) {
 return __tailRec(x24tcOpt_6, {h: 1, a1: $0, a2: $1, a3: $2, a4: $3, a5: $4, a6: $5});
}

function Text_Lexer_Core_case__tokenise_2726($0, $1, $2, $3, $4, $5, $6) {
 return __tailRec(x24tcOpt_6, {h: 2, a1: $0, a2: $1, a3: $2, a4: $3, a5: $4, a6: $5, a7: $6});
}

function x24tcOpt_7($0) {
 switch($0.a1.h) {
  case 0: return {h: 0, a1: {a1: $0.a2}};
  case undefined: {
   let $5;
   switch(Prelude_EqOrd_x3ex3d_Ord_Char($0.a1.a1, '0')) {
    case 1: {
     $5 = Prelude_EqOrd_x3cx3d_Ord_Char($0.a1.a1, '9');
     break;
    }
    case 0: {
     $5 = 0;
     break;
    }
   }
   switch($5) {
    case 1: return {h: 1, a1: $0.a1.a2, a2: (($0.a2*10n)+Prelude_Cast_cast_Cast_Int_Integer(_sub32s(_truncInt32($0.a1.a1.codePointAt(0)), _truncInt32('0'.codePointAt(0)))))};
    case 0: return {h: 0, a1: {h: 0}};
   }
  }
 }
}

function Data_String_parseNumWithoutSign($0, $1) {
 return __tailRec(x24tcOpt_7, {h: 1, a1: $0, a2: $1});
}

function x24tcOpt_8($0) {
 switch($0.a3.h) {
  case 0: return {h: 0, a1: Prelude_Types_List_reverse($0.a2)};
  case undefined: return {h: 1, a1: $0.a1, a2: {a1: $0.a1($0.a3.a1), a2: $0.a2}, a3: $0.a3.a2};
 }
}

function Data_List_TR_n__3884_4794_run($0, $1, $2) {
 return __tailRec(x24tcOpt_8, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_9($0) {
 switch($0.a2.h) {
  case 0: return {h: 0, a1: $0.a1};
  case undefined: return {h: 1, a1: {a1: $0.a2.a1, a2: $0.a1}, a2: $0.a2.a2};
 }
}

function Prelude_Types_List_reverseOnto($0, $1) {
 return __tailRec(x24tcOpt_9, {h: 1, a1: $0, a2: $1});
}

function x24tcOpt_10($0) {
 switch($0.a2.h) {
  case 0: return {h: 0, a1: {h: 0}};
  case undefined: {
   const $4 = $0.a1($0.a2.a1);
   switch($4.h) {
    case 0: return {h: 1, a1: $0.a1, a2: $0.a2.a2};
    case undefined: return {h: 0, a1: {a1: $4.a1, a2: Prelude_Types_List_mapMaybe($0.a1, $0.a2.a2)}};
   }
  }
 }
}

function Prelude_Types_List_mapMaybe($0, $1) {
 return __tailRec(x24tcOpt_10, {h: 1, a1: $0, a2: $1});
}

function x24tcOpt_11($0) {
 switch($0.a1) {
  case '': {
   switch($0.a2.h) {
    case 0: return {h: 0, a1: ''};
    default: {
     const $6 = ($0.a2.a1+$0.a2.a2);
     switch(Prelude_Types_isSpace($0.a2.a1)) {
      case 1: return {h: 1, a1: $0.a2.a2, a2: $0.a2.a3()};
      case 0: return {h: 0, a1: $6};
     }
    }
   }
  }
  default: {
   const $11 = ($0.a2.a1+$0.a2.a2);
   switch(Prelude_Types_isSpace($0.a2.a1)) {
    case 1: return {h: 1, a1: $0.a2.a2, a2: $0.a2.a3()};
    case 0: return {h: 0, a1: $11};
   }
  }
 }
}

function Data_String_with__ltrim_6503($0, $1) {
 return __tailRec(x24tcOpt_11, {h: 1, a1: $0, a2: $1});
}

function x24tcOpt_12($0) {
 switch($0.a3.h) {
  case 0: return {h: 0, a1: {h: 0}};
  case undefined: {
   switch($0.a1($0.a2)($0.a3.a1.a1)) {
    case 1: return {h: 0, a1: {a1: $0.a3.a1.a2}};
    case 0: return {h: 1, a1: $0.a1, a2: $0.a2, a3: $0.a3.a2};
   }
  }
 }
}

function Data_List_lookupBy($0, $1, $2) {
 return __tailRec(x24tcOpt_12, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_13($0) {
 switch($0.a2.h) {
  case 0: return {h: 0, a1: $0.a1};
  case undefined: return {h: 1, a1: ($0.a1+1n), a2: $0.a2.a2};
 }
}

function Prelude_Types_List_lengthPlus($0, $1) {
 return __tailRec(x24tcOpt_13, {h: 1, a1: $0, a2: $1});
}

function x24tcOpt_14($0) {
 switch($0.a2.h) {
  case 0: return {h: 0, a1: {h: 0}};
  case undefined: {
   switch($0.a3) {
    case 0n: return {h: 0, a1: {a1: $0.a2.a1}};
    default: {
     const $7 = ($0.a3-1n);
     return {h: 1, a1: $0.a1, a2: $0.a2.a2, a3: $7};
    }
   }
  }
 }
}

function Data_String_Extra_with__index_1618($0, $1, $2) {
 return __tailRec(x24tcOpt_14, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_15($0) {
 switch($0.a1.h) {
  case undefined: {
   switch($0.a1.a1.h) {
    case 0: return {h: 0, a1: {a1: $0.a1.a1.a1}};
    case 1: {
     switch($0.a1.a1.a1) {
      case 'id': return {h: 0, a1: {a1: $0.a1.a1.a2}};
      default: return {h: 1, a1: $0.a1.a2};
     }
    }
    default: return {h: 1, a1: $0.a1.a2};
   }
  }
  case 0: return {h: 0, a1: {h: 0}};
 }
}

function Text_Html_Attribute_getId($0) {
 return __tailRec(x24tcOpt_15, {h: 1, a1: $0});
}

function x24tcOpt_16($0) {
 switch($0.a2.h) {
  case 0: return {h: 0, a1: $0.a1};
  case undefined: {
   switch($0.a2.a1.h) {
    case 3: return {h: 1, a1: {a1: $0.a2.a1.a1, a2: $0.a1}, a2: $0.a2.a2};
    default: return {h: 1, a1: $0.a1, a2: $0.a2.a2};
   }
  }
 }
}

function Text_Html_Attribute_n__3974_4055_go($0, $1) {
 return __tailRec(x24tcOpt_16, {h: 1, a1: $0, a2: $1});
}

function x24tcOpt_17($0) {
 switch($0.a1) {
  case 0n: {
   switch($0.a2.h) {
    case undefined: return {h: 0, a1: {a1: $0.a2.a1}};
    default: return {h: 0, a1: {h: 0}};
   }
  }
  default: {
   const $8 = ($0.a1-1n);
   switch($0.a2.h) {
    case undefined: return {h: 1, a1: $8, a2: $0.a2.a2};
    default: return {h: 0, a1: {h: 0}};
   }
  }
 }
}

function Prelude_Types_getAt($0, $1) {
 return __tailRec(x24tcOpt_17, {h: 1, a1: $0, a2: $1});
}

function x24tcOpt_18($0) {
 switch($0.a3.h) {
  case 0: return {h: 0, a1: $0.a1($0.a3.a1)($0.a2)};
  case 1: {
   switch($0.a3.a1.h) {
    case 0: return {h: 0, a1: $0.a1($0.a3.a1.a1)($0.a2)};
    case 1: {
     switch($0.a3.a1.a1.h) {
      case 0: return {h: 0, a1: $0.a1($0.a3.a1.a1.a1)($0.a2)};
      case 1: {
       switch($0.a3.a1.a1.a1.h) {
        case 0: return {h: 0, a1: $0.a1($0.a3.a1.a1.a1.a1)($0.a2)};
        case 1: {
         switch($0.a3.a1.a1.a1.a1.h) {
          case 0: return {h: 0, a1: $0.a1($0.a3.a1.a1.a1.a1.a1)($0.a2)};
          case 1: {
           switch($0.a3.a1.a1.a1.a1.a1.h) {
            case 0: return {h: 0, a1: $0.a1($0.a3.a1.a1.a1.a1.a1.a1)($0.a2)};
            case 1: {
             switch($0.a3.a1.a1.a1.a1.a1.a1.h) {
              case 0: return {h: 0, a1: $0.a1($0.a3.a1.a1.a1.a1.a1.a1.a1)($0.a2)};
              case 1: {
               switch($0.a3.a1.a1.a1.a1.a1.a1.a1.h) {
                case 0: return {h: 0, a1: $0.a1($0.a3.a1.a1.a1.a1.a1.a1.a1.a1)($0.a2)};
                case 1: return {h: 1, a1: $0.a1, a2: $0.a2, a3: $0.a3.a1.a1.a1.a1.a1.a1.a1.a1};
               }
              }
             }
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
 }
}

function Data_SOP_NS_foldrNS($0, $1, $2) {
 return __tailRec(x24tcOpt_18, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_19($0) {
 switch($0.a3.h) {
  case 0: return {h: 0, a1: $0.a1($0.a2)($0.a3.a1)};
  case 1: return {h: 1, a1: $0.a1, a2: $0.a2, a3: $0.a3.a1};
 }
}

function Data_SOP_NS_foldlNS($0, $1, $2) {
 return __tailRec(x24tcOpt_19, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_20($0) {
 switch($0.a3.h) {
  case 0: return {h: 0, a1: $0.a2};
  case undefined: return {h: 1, a1: $0.a1, a2: $0.a1($0.a2)($0.a3.a1), a3: $0.a3.a2};
 }
}

function Data_SOP_NP_foldlNP($0, $1, $2) {
 return __tailRec(x24tcOpt_20, {h: 1, a1: $0, a2: $1, a3: $2});
}

function x24tcOpt_21($0) {
 switch($0.a2.h) {
  case 0: return {h: 0, a1: {h: 0}};
  case undefined: {
   switch($0.a1($0.a2.a1)) {
    case 1: return {h: 0, a1: {a1: $0.a2.a1, a2: Prelude_Types_List_filter($0.a1, $0.a2.a2)}};
    case 0: return {h: 1, a1: $0.a1, a2: $0.a2.a2};
   }
  }
 }
}

function Prelude_Types_List_filter($0, $1) {
 return __tailRec(x24tcOpt_21, {h: 1, a1: $0, a2: $1});
}

function x24tcOpt_22($0) {
 switch($0.a1) {
  case 0n: return {h: 0, a1: $0.a2};
  default: {
   const $4 = ($0.a1-1n);
   switch($0.a2.h) {
    case 0: return {h: 0, a1: {h: 0}};
    case undefined: return {h: 1, a1: $4, a2: $0.a2.a2};
   }
  }
 }
}

function Data_List_drop($0, $1) {
 return __tailRec(x24tcOpt_22, {h: 1, a1: $0, a2: $1});
}

const __mainExpression_0 = __lazy(function () {
 return PrimIO_unsafePerformIO($2 => Main_main($2));
});

const csegen_1 = __lazy(function () {
 return {a1: $1 => $2 => ($1+$2), a2: ''};
});

const csegen_16 = __lazy(function () {
 return {a1: acc => elem => func => init => input => Prelude_Types_foldr_Foldable_List(func, init, input), a2: elem => acc => func => init => input => Prelude_Types_foldl_Foldable_List(func, init, input), a3: elem => $b => Prelude_Types_null_Foldable_List($b), a4: elem => acc => m => $f => funcM => init => input => Prelude_Types_foldlM_Foldable_List($f, funcM, init, input), a5: elem => $16 => $16, a6: a => m => $18 => f => $19 => Prelude_Types_foldMap_Foldable_List($18, f, $19)};
});

const csegen_45 = __lazy(function () {
 const $13 = $14 => {
  switch($14.h) {
   case 0: return 'Null';
   case 1: return 'Boolean';
   case 2: return 'Number';
   case 3: return 'String';
   case 4: return 'Array';
   case 5: return 'Object';
  }
 };
 const $21 = $22 => {
  switch($22.h) {
   case 5: return {a1: $22.a1};
   default: return {h: 0};
  }
 };
 const $25 = $26 => {
  switch($26.h) {
   case 4: return {a1: $26.a1};
   default: return {h: 0};
  }
 };
 const $29 = $2a => {
  switch($2a.h) {
   case 1: return {a1: $2a.a1};
   default: return {h: 0};
  }
 };
 const $2d = $2e => {
  switch($2e.h) {
   case 2: return {a1: $2e.a1};
   default: return {h: 0};
  }
 };
 const $31 = $32 => {
  switch($32.h) {
   case 3: return {a1: $32.a1};
   default: return {h: 0};
  }
 };
 const $35 = $36 => {
  switch($36.h) {
   case 0: return 1;
   default: return 0;
  }
 };
 return {a1: $1 => $2 => Data_List_lookup({a1: $6 => $7 => Prelude_EqOrd_x3dx3d_Eq_String($6, $7), a2: $c => $d => Prelude_EqOrd_x2fx3d_Eq_String($c, $d)}, $1, $2), a2: $13, a3: $17 => Prelude_Types_maybe(() => ({h: 0, a1: 'Couldn\'t parse JSON.'}), () => $1c => ({h: 1, a1: $1c}), Language_JSON_parse($17)), a4: $21, a5: $25, a6: $29, a7: $2d, a8: $31, a9: $35};
});

const csegen_48 = __lazy(function () {
 return Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: Main_aPrefix(), a2: {a1: '_createTodo', a2: {h: 0}}});
});

const csegen_55 = __lazy(function () {
 return b => a => func => $0 => $1 => Prelude_IO_map_Functor_IO(func, $0, $1);
});

const csegen_58 = __lazy(function () {
 return b => a => func => $0 => Control_Monad_Error_Either_map_Functor_x28x28EitherTx20x24ex29x20x24mx29(csegen_55(), func, $0);
});

const csegen_65 = __lazy(function () {
 const $5 = b => a => $6 => $7 => $8 => {
  const $9 = $6($8);
  const $c = $7($8);
  return $9($c);
 };
 return {a1: csegen_55(), a2: a => $3 => $4 => $3, a3: $5};
});

const csegen_71 = __lazy(function () {
 return {a1: csegen_58(), a2: a => $3 => Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $3), a3: b => a => $9 => $a => Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $9, $a)};
});

const csegen_77 = __lazy(function () {
 return {a1: b => a => func => $1 => $2 => Control_Monad_Dom_DomIO_map_Functor_x28x28DomIOx20x24evx29x20x24iox29(csegen_58(), func, $1, $2), a2: a => $a => $b => Control_Monad_Dom_DomIO_pure_Applicative_x28x28DomIOx20x24evx29x20x24iox29(csegen_71(), $a, $b), a3: b => a => $12 => $13 => $14 => Control_Monad_Dom_DomIO_x3cx2ax3e_Applicative_x28x28DomIOx20x24evx29x20x24iox29(csegen_71(), $12, $13, $14)};
});

const csegen_80 = __lazy(function () {
 return b => a => $0 => $1 => $2 => {
  const $3 = $0($2);
  return $1($3)($2);
 };
});

const csegen_83 = __lazy(function () {
 const $4 = a => $5 => $6 => {
  const $7 = $5($6);
  return $7($6);
 };
 return {a1: csegen_65(), a2: csegen_80(), a3: $4};
});

const csegen_89 = __lazy(function () {
 return {a1: csegen_71(), a2: b => a => $3 => $4 => Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), $3, $4), a3: a => $b => Control_Monad_Error_Either_join_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), $b)};
});

const csegen_95 = __lazy(function () {
 return {a1: csegen_77(), a2: b => a => $3 => $4 => $5 => Control_Monad_Dom_DomIO_x3ex3ex3d_Monad_x28x28DomIOx20x24evx29x20x24iox29(csegen_89(), $3, $4, $5), a3: a => $d => $e => Control_Monad_Dom_DomIO_join_Monad_x28x28DomIOx20x24evx29x20x24iox29(csegen_89(), $d, $e)};
});

const csegen_98 = __lazy(function () {
 const $4 = a => $5 => $6 => {
  const $7 = $5($6);
  return $7($6);
 };
 return {a1: csegen_65(), a2: csegen_80(), a3: $4};
});

const csegen_104 = __lazy(function () {
 return {a1: csegen_71(), a2: b => a => $3 => $4 => Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_98(), $3, $4), a3: a => $b => Control_Monad_Error_Either_join_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_98(), $b)};
});

const csegen_110 = __lazy(function () {
 return {a1: csegen_77(), a2: b => a => $3 => $4 => $5 => Control_Monad_Dom_DomIO_x3ex3ex3d_Monad_x28x28DomIOx20x24evx29x20x24iox29(csegen_104(), $3, $4, $5), a3: a => $d => $e => Control_Monad_Dom_DomIO_join_Monad_x28x28DomIOx20x24evx29x20x24iox29(csegen_104(), $d, $e)};
});

const csegen_111 = __lazy(function () {
 return {a1: csegen_98(), a2: a => $3 => $3};
});

const csegen_114 = __lazy(function () {
 return {a1: csegen_104(), a2: a => $3 => Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $3)};
});

const csegen_117 = __lazy(function () {
 return {a1: csegen_110(), a2: a => $3 => $4 => Control_Monad_Dom_DomIO_liftIO_HasIO_x28x28DomIOx20x24evx29x20x24iox29(csegen_114(), $3, $4)};
});

const csegen_118 = __lazy(function () {
 return {a1: csegen_114(), a2: a => $3 => $3};
});

const csegen_121 = __lazy(function () {
 return {a1: csegen_117(), a2: a => $3 => $4 => Control_Monad_Dom_DomIO_liftJSIO_LiftJSIO_x28x28DomIOx20x24evx29x20x24iox29(csegen_118(), $3, $4)};
});

const csegen_139 = __lazy(function () {
 return {a1: csegen_95(), a2: b => st => a => rel => seed => ini => prf => step => $3 => Control_Monad_Dom_DomIO_tailRecM_MonadRec_x28x28DomIOx20x24ex29x20x24iox29({a1: csegen_89(), a2: $9 => $a => $b => $c => $d => $e => $f => $10 => Control_MonadRec_tailRecM_MonadRec_x28x28EitherTx20x24ex29x20x24mx29({a1: csegen_83(), a2: $16 => $17 => $18 => $19 => $1a => $1b => $1c => $1d => $1e => Control_MonadRec_trIO($1a, $1b, $1d, $1e)}, $d, $e, $10)}, seed, ini, step, $3)};
});

const csegen_142 = __lazy(function () {
 return {a1: csegen_110(), a2: $3 => Control_Monad_Dom_DomIO_createId($3), a3: t => $7 => $8 => $9 => Control_Monad_Dom_DomIO_registerImpl($7, $8, $9)};
});

const csegen_144 = __lazy(function () {
 return Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), undefined);
});

const csegen_162 = __lazy(function () {
 return $0 => $1 => $2 => $3 => Main_implFromJSONTodo($0, $1, $2, $3);
});

const csegen_174 = __lazy(function () {
 return $0 => $1 => $2 => $3 => $4 => Prelude_IO_map_Functor_IO($2, $3, $4);
});

const csegen_183 = __lazy(function () {
 return {a1: x => Prelude_Show_show_Show_Nat(x), a2: d => x => Prelude_Show_showPrec_Show_Nat(d, x)};
});

const csegen_187 = __lazy(function () {
 return {a1: x => Prelude_Show_show_Show_Bool(x), a2: d => x => Prelude_Show_showPrec_Show_Bool(d, x)};
});

const csegen_193 = __lazy(function () {
 return {a1: {a1: csegen_183(), a2: {a1: csegen_183(), a2: {a1: {a1: x => Prelude_Show_show_Show_String(x), a2: d => x => Prelude_Show_showPrec_Show_String(d, x)}, a2: {a1: csegen_187(), a2: {a1: csegen_187(), a2: {h: 0}}}}}}, a2: {h: 0}};
});

const csegen_224 = __lazy(function () {
 return x => (undefined);
});

const csegen_238 = __lazy(function () {
 return $0 => $1 => $2 => $3 => JSON_FromJSON_fromJSON_FromJSON_Nat($2, $3);
});

const csegen_241 = __lazy(function () {
 return $0 => $1 => $2 => $3 => JSON_FromJSON_fromJSON_FromJSON_String($2, $3);
});

const csegen_248 = __lazy(function () {
 return $0 => $1 => $2 => $3 => JSON_FromJSON_fromJSON_FromJSON_Bool($2, $3);
});

const csegen_249 = __lazy(function () {
 return {a1: csegen_248(), a2: {h: 0}};
});

const csegen_259 = __lazy(function () {
 return $0 => $1 => $2 => $3 => Control_Monad_Error_Either_map_Functor_x28x28EitherTx20x24ex29x20x24mx29(csegen_174(), $2, $3);
});

const csegen_296 = __lazy(function () {
 return b => a => func => $0 => Text_Bounded_map_Functor_WithBounds(func, $0);
});

const csegen_307 = __lazy(function () {
 return {a1: {a1: $2 => $3 => Prelude_EqOrd_x3dx3d_Eq_Int($2, $3), a2: $8 => $9 => Prelude_EqOrd_x2fx3d_Eq_Int($8, $9)}, a2: $e => $f => Prelude_EqOrd_compare_Ord_Int($e, $f), a3: $14 => $15 => Prelude_EqOrd_x3c_Ord_Int($14, $15), a4: $1a => $1b => Prelude_EqOrd_x3e_Ord_Int($1a, $1b), a5: $20 => $21 => Prelude_EqOrd_x3cx3d_Ord_Int($20, $21), a6: $26 => $27 => Prelude_EqOrd_x3ex3d_Ord_Int($26, $27), a7: $2c => $2d => Prelude_EqOrd_max_Ord_Int($2c, $2d), a8: $32 => $33 => Prelude_EqOrd_min_Ord_Int($32, $33)};
});

const csegen_324 = __lazy(function () {
 return $0 => $1 => ({a1: $0, a2: $1});
});

const csegen_328 = __lazy(function () {
 return {a1: $1 => $2 => Prelude_EqOrd_x3dx3d_Eq_Char($1, $2), a2: $7 => $8 => Prelude_EqOrd_x2fx3d_Eq_Char($7, $8)};
});

const csegen_373 = __lazy(function () {
 return {a1: $1 => Language_JSON_Tokens_TokType_TokenKind_JSONTokenKind($1), a2: kind => $5 => Language_JSON_Tokens_tokValue_TokenKind_JSONTokenKind(kind, $5)};
});

const csegen_376 = __lazy(function () {
 return {a1: $1 => $2 => Language_JSON_Tokens_x3dx3d_Eq_JSONTokenKind($1, $2), a2: $7 => $8 => Language_JSON_Tokens_x2fx3d_Eq_JSONTokenKind($7, $8)};
});

const csegen_412 = __lazy(function () {
 return {a1: $1 => Language_JSON_String_Tokens_TokType_TokenKind_JSONStringTokenKind($1), a2: kind => $5 => Language_JSON_String_Tokens_tokValue_TokenKind_JSONStringTokenKind(kind, $5)};
});

const csegen_415 = __lazy(function () {
 return {a1: $1 => $2 => Language_JSON_String_Tokens_x3dx3d_Eq_JSONStringTokenKind($1, $2), a2: $7 => $8 => Language_JSON_String_Tokens_x2fx3d_Eq_JSONStringTokenKind($7, $8)};
});

const csegen_431 = __lazy(function () {
 return $0 => $1 => $2 => $3 => Text_Bounded_map_Functor_WithBounds($2, $3);
});

const csegen_434 = __lazy(function () {
 return $0 => $1 => $2 => $3 => Prelude_Types_map_Functor_Maybe($2, $3);
});

const csegen_436 = __lazy(function () {
 return {a1: {a1: 'End of input', a2: {h: 0}}, a2: {h: 0}};
});

const csegen_480 = __lazy(function () {
 return f => g => ks => fun => $0 => Data_SOP_NP_mapNP($3 => fun(undefined), $0);
});

const csegen_485 = __lazy(function () {
 return {a1: csegen_480(), a2: csegen_480(), a3: f => g => ks => $5 => $6 => Data_SOP_NP_hapNP($5, $6)};
});

const csegen_495 = __lazy(function () {
 return {a1: el => acc => ks => $1 => $2 => $3 => Data_SOP_NP_foldlNP($1, $2, $3), a2: acc => el => ks => $9 => $a => $b => Data_SOP_NP_foldrNP($9, $a, $b)};
});

const csegen_506 = __lazy(function () {
 return $0 => $1 => $2 => $3 => $4 => Data_SOP_NP_mapNP($7 => $3(undefined), $4);
});

const csegen_528 = __lazy(function () {
 return $0 => $1 => $2 => $3 => $4 => Data_SOP_NP_sequenceNP($3, $4);
});

const csegen_537 = __lazy(function () {
 return {a1: $1 => $2 => ($1+$2), a2: $6 => $7 => ($6*$7), a3: $b => $b};
});

const csegen_541 = __lazy(function () {
 return {a1: csegen_485(), a2: csegen_528()};
});

const csegen_571 = __lazy(function () {
 return Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $4 => $5 => ({a1: $4, a2: $5}));
});

const csegen_572 = __lazy(function () {
 return $0 => Prelude_EqOrd_x3dx3d_Eq_Bits8(Number(_truncUBigInt8(1n)), $0);
});

const csegen_575 = __lazy(function () {
 return $0 => $1 => Web_Internal_DomTypes_safeCast_SafeCast_Event($1);
});

const csegen_576 = __lazy(function () {
 return $0 => $1 => Web_Internal_UIEventsTypes_safeCast_SafeCast_MouseEvent($1);
});

const csegen_577 = __lazy(function () {
 return $0 => $1 => Web_Internal_UIEventsTypes_safeCast_SafeCast_KeyboardEvent($1);
});

function prim__add_Integer($0, $1) {
 return ($0+$1);
}

function prim__sub_Integer($0, $1) {
 return ($0-$1);
}

function prim__mul_Integer($0, $1) {
 return ($0*$1);
}

const Main_n__27000_13870_txtTitle = __lazy(function () {
 return {h: 0, a1: 'input', a2: 36, a3: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: Main_aPrefix(), a2: {a1: '_newTitle', a2: {h: 0}}})};
});

function Main_n__26755_13623_selectedTodox27($0) {
 const $1 = $0.a2;
 return {h: 0, a1: 'div', a2: 19, a3: {h: 0}, a4: {a1: {h: 2, a1: Prelude_Show_show_Show_Nat($1)}, a2: {a1: {h: 2, a1: $0.a3}, a2: {a1: {h: 2, a1: 'Selected!'}, a2: {a1: {h: 0, a1: 'div', a2: 19, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_userDiv()), a2: {h: 0}}, a4: {h: 0}}, a2: {h: 0}}}}}};
}

function Main_n__26681_13550_renderUser($0) {
 return {h: 0, a1: 'div', a2: 19, a3: {h: 0}, a4: {a1: {h: 2, a1: $0.a2}, a2: {a1: {h: 2, a1: $0.a3}, a2: {a1: {h: 2, a1: $0.a4}, a2: {h: 0}}}}};
}

const Main_n__27000_13872_renderForm = __lazy(function () {
 return {h: 0, a1: 'div', a2: 19, a3: {h: 0}, a4: {a1: Main_n__27000_13871_lbl('Title:', ''), a2: {a1: {h: 0, a1: 'input', a2: 36, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_n__27000_13870_txtTitle()), a2: {a1: {h: 1, a1: 'placeholder', a2: 'some title'}, a2: {h: 0}}}, a4: {h: 0}}, a2: {a1: {h: 0, a1: 'button', a2: 9, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_n__27000_13869_btnCreate()), a2: {h: 0}}, a4: {a1: {h: 2, a1: 'Create Todo'}, a2: {h: 0}}}, a2: {h: 0}}}}};
});

function Main_n__26935_13807_renderErrx27($0) {
 return {h: 0, a1: 'div', a2: 19, a3: {h: 0}, a4: {a1: {h: 2, a1: $0}, a2: {h: 0}}};
}

function Main_n__26384_13263_parseType($0, $1, $2, $3) {
 const $7 = Prelude_Types_maybe(() => ({h: 0, a1: 'Couldn\'t parse JSON.'}), () => $c => ({h: 1, a1: $c}), Language_JSON_parse($3));
 let $6;
 switch($7.h) {
  case 0: {
   $6 = {h: 0, a1: {a1: {h: 0}, a2: $7.a1}};
   break;
  }
  case 1: {
   $6 = {h: 1, a1: $7.a1};
   break;
  }
 }
 const $4 = Prelude_Types_x3ex3ex3d_Monad_x28Eitherx20x24ex29($6, $0(undefined)(undefined)(csegen_45()));
 switch($4.h) {
  case 0: return {h: 6, a1: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'failed to parse json: ', a2: {a1: $3, a2: {h: 0}}})};
  case 1: return $1($4.a1);
 }
}

function Main_n__27000_13871_lbl($0, $1) {
 return {h: 0, a1: 'label', a2: 38, a3: {h: 0}, a4: {a1: {h: 2, a1: $0}, a2: {h: 0}}};
}

function Main_n__26384_13262_handleError($0, $1, $2, $3) {
 const $7 = Prelude_Types_maybe(() => ({h: 0, a1: 'Couldn\'t parse JSON.'}), () => $c => ({h: 1, a1: $c}), Language_JSON_parse($3));
 let $6;
 switch($7.h) {
  case 0: {
   $6 = {h: 0, a1: {a1: {h: 0}, a2: $7.a1}};
   break;
  }
  case 1: {
   $6 = {h: 1, a1: $7.a1};
   break;
  }
 }
 const $4 = Prelude_Types_x3ex3ex3d_Monad_x28Eitherx20x24ex29($6, $16 => Main_implFromJSONFetchResponse(undefined, undefined, csegen_45(), $16));
 switch($4.h) {
  case 0: return {h: 6, a1: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'Fetch err: ', a2: {a1: $3, a2: {h: 0}}})};
  case 1: {
   const $32 = Main_implShowFetchResponse();
   const $31 = $32.a1($4.a1);
   const $30 = {a1: $31, a2: {h: 0}};
   const $2e = {a1: 'Fetch err: ', a2: $30};
   const $28 = Prelude_Interfaces_concat(csegen_1(), csegen_16(), $2e);
   return {h: 6, a1: $28};
  }
 }
}

const Main_n__27000_13869_btnCreate = __lazy(function () {
 return {h: 0, a1: 'button', a2: 9, a3: csegen_48()};
});

const Main_userDiv = __lazy(function () {
 return {h: 0, a1: 'div', a2: 19, a3: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: Main_aPrefix(), a2: {a1: '_user', a2: {h: 0}}})};
});

const Main_uix27 = __lazy(function () {
 return Prelude_Interfaces_x3ex3e(csegen_95(), Control_Monad_Dom_Interface_innerHtmlAt(csegen_121(), csegen_139(), csegen_142(), Main_contentDiv(), Main_contentx27()), () => $10 => Control_Monad_Dom_DomIO_pure_Applicative_x28x28DomIOx20x24evx29x20x24iox29(csegen_71(), {a1: Main_sf(), a2: csegen_144()}, $10));
});

function Main_todoItemRef($0) {
 return {h: 0, a1: 'div', a2: 19, a3: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'todoItem', a2: {a1: Prelude_Show_show_Show_Nat($0), a2: {h: 0}}})};
}

function Main_todoItemx27($0) {
 const $1 = $0.a2;
 return {h: 0, a1: 'div', a2: 19, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_todoItemRef($1)), a2: {a1: {h: 3, a1: {h: 0, a1: $f => ({a1: {h: 4, a1: $1}})}}, a2: {h: 0}}}, a4: {a1: {h: 2, a1: Prelude_Show_show_Show_Nat($1)}, a2: {a1: {h: 2, a1: $0.a3}, a2: {h: 0}}}};
}

const Main_sf = __lazy(function () {
 const $1 = $2 => {
  const $3 = Main_implGenericEvx27();
  return $3.a1($2);
 };
 const $0 = {h: 2, a1: $1};
 return {h: 4, a1: $0, a2: {h: 8, a1: {a1: Main_onInit(), a2: {a1: Main_onListLoaded(), a2: {a1: Main_onSingleLoaded(), a2: {a1: Main_onUserLoaded(), a2: {a1: Main_onSelected(), a2: {a1: Main_onClickAdd(), a2: {a1: Main_onErr(), a2: {h: 0}}}}}}}}}};
});

const Main_selectedTodoDiv = __lazy(function () {
 return {h: 0, a1: 'div', a2: 19, a3: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: Main_aPrefix(), a2: {a1: '_selectedTodo', a2: {h: 0}}})};
});

const Main_out = __lazy(function () {
 return {h: 0, a1: 'div', a2: 19, a3: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: Main_aPrefix(), a2: {a1: '_out', a2: {h: 0}}})};
});

const Main_onUserLoaded = __lazy(function () {
 return {h: 3, a1: $1 => Control_Monad_Dom_Interface_innerHtmlAt(csegen_121(), csegen_139(), csegen_142(), Main_userDiv(), Main_n__26681_13550_renderUser($1.a1))};
});

const Main_onSingleLoaded = __lazy(function () {
 return {h: 3, a1: $1 => Prelude_Interfaces_x3ex3e(csegen_95(), Control_Monad_Dom_Interface_innerHtmlAt(csegen_121(), csegen_139(), csegen_142(), Main_selectedTodoDiv(), Main_n__26755_13623_selectedTodox27($1.a1)), () => $15 => Main_fetchParseEvent($18 => $19 => $1a => $1b => Main_implFromJSONUser($18, $19, $1a, $1b), Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'https://jsonplaceholder.typicode.com/users/', a2: {a1: Prelude_Show_show_Show_Nat($1.a1.a1), a2: {h: 0}}}), $30 => ({h: 3, a1: $30}), $15))};
});

const Main_onSelected = __lazy(function () {
 return {h: 3, a1: $1 => $2 => Main_fetchParseEvent(csegen_162(), Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'https://jsonplaceholder.typicode.com/todos/', a2: {a1: Prelude_Show_show_Show_Nat($1.a1), a2: {h: 0}}}), $16 => ({h: 2, a1: $16}), $2)};
});

const Main_onListLoaded = __lazy(function () {
 return {h: 3, a1: $1 => Control_Monad_Dom_Interface_innerHtmlAt(csegen_121(), csegen_139(), csegen_142(), Main_listTodoDiv(), Main_listTodosx27(Data_List_take(21n, $1.a1)))};
});

const Main_onInit = __lazy(function () {
 return {h: 3, a1: $1 => $2 => Main_fetchParseEvent($5 => $6 => $7 => $8 => JSON_FromJSON_fromJSON_FromJSON_x28Listx20x24ax29(csegen_162(), $7, $8), 'https://jsonplaceholder.typicode.com/todos', $10 => ({h: 1, a1: $10}), $2)};
});

const Main_onErr = __lazy(function () {
 return {h: 3, a1: $1 => Control_Monad_Dom_Interface_innerHtmlAt(csegen_121(), csegen_139(), csegen_142(), Main_errorDiv(), Main_n__26935_13807_renderErrx27($1.a1))};
});

const Main_onClickAdd = __lazy(function () {
 return {h: 3, a1: $1 => Control_Monad_Dom_Interface_innerHtmlAt(csegen_121(), csegen_139(), csegen_142(), Main_createTodoDiv(), Main_n__27000_13872_renderForm())};
});

function Main_main($0) {
 return JS_Util_runJS(Control_Monad_Error_Either_map_Functor_x28x28EitherTx20x24ex29x20x24mx29(csegen_174(), $7 => (undefined), Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Data_IORef_newIORef(csegen_114(), Prelude_Types_prim__integerToNat(0n)), $14 => Control_Monad_Dom_DomIO_reactimateDom_({a1: {h: 0}}, Main_aPrefix(), Main_uix27(), $14))), $0);
}

function Main_listTodosx27($0) {
 return {h: 0, a1: 'div', a2: 19, a3: {h: 0}, a4: Prelude_Types_map_Functor_List($7 => Main_todoItemx27($7), $0)};
}

const Main_listTodoDiv = __lazy(function () {
 return {h: 0, a1: 'div', a2: 19, a3: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: Main_aPrefix(), a2: {a1: '_listTodo', a2: {h: 0}}})};
});

const Main_implShowFetchResponse = __lazy(function () {
 return {a1: $1 => Generics_Meta_genShowPrec(Main_implMetaFetchResponse(), csegen_193(), {h: 0}, $1), a2: $a => $b => Generics_Meta_genShowPrec(Main_implMetaFetchResponse(), csegen_193(), $a, $b)};
});

const Main_implMetaUser = __lazy(function () {
 return {a1: Main_implGenericUser(), a2: {a1: {a1: 'Main', a2: {h: 0}}, a2: 'User', a3: {a1: {a1: {a1: 'Main', a2: {h: 0}}, a2: 'MkUser', a3: {a1: {h: 0, a1: 0, a2: 'id'}, a2: {a1: {h: 0, a1: 1, a2: 'name'}, a2: {a1: {h: 0, a1: 2, a2: 'username'}, a2: {a1: {h: 0, a1: 3, a2: 'email'}, a2: {h: 0}}}}}}, a2: {h: 0}}}};
});

const Main_implMetaTodo = __lazy(function () {
 return {a1: Main_implGenericTodo(), a2: {a1: {a1: 'Main', a2: {h: 0}}, a2: 'Todo', a3: {a1: {a1: {a1: 'Main', a2: {h: 0}}, a2: 'MkTodo', a3: {a1: {h: 0, a1: 0, a2: 'userId'}, a2: {a1: {h: 0, a1: 1, a2: 'id'}, a2: {a1: {h: 0, a1: 2, a2: 'title'}, a2: {a1: {h: 0, a1: 3, a2: 'completed'}, a2: {h: 0}}}}}}, a2: {h: 0}}}};
});

const Main_implMetaFetchResponse = __lazy(function () {
 return {a1: Main_implGenericFetchResponse(), a2: {a1: {a1: 'Main', a2: {h: 0}}, a2: 'FetchResponse', a3: {a1: {a1: {a1: 'Main', a2: {h: 0}}, a2: 'MkFetchResponse', a3: {a1: {h: 0, a1: 0, a2: 'url'}, a2: {a1: {h: 0, a1: 1, a2: 'status'}, a2: {a1: {h: 0, a1: 2, a2: 'statusText'}, a2: {a1: {h: 0, a1: 3, a2: 'redirected'}, a2: {a1: {h: 0, a1: 4, a2: 'ok'}, a2: {h: 0}}}}}}}, a2: {h: 0}}}};
});

const Main_implGenericUser = __lazy(function () {
 return {a1: x => ({h: 0, a1: {a1: x.a1, a2: {a1: x.a2, a2: {a1: x.a3, a2: {a1: x.a4, a2: {h: 0}}}}}}), a2: x => ({a1: x.a1.a1, a2: x.a1.a2.a1, a3: x.a1.a2.a2.a1, a4: x.a1.a2.a2.a2.a1}), a3: x => (undefined), a4: csegen_224()};
});

const Main_implGenericTodo = __lazy(function () {
 return {a1: x => ({h: 0, a1: {a1: x.a1, a2: {a1: x.a2, a2: {a1: x.a3, a2: {a1: x.a4, a2: {h: 0}}}}}}), a2: x => ({a1: x.a1.a1, a2: x.a1.a2.a1, a3: x.a1.a2.a2.a1, a4: x.a1.a2.a2.a2.a1}), a3: x => (undefined), a4: csegen_224()};
});

const Main_implGenericFetchResponse = __lazy(function () {
 return {a1: x => ({h: 0, a1: {a1: x.a1, a2: {a1: x.a2, a2: {a1: x.a3, a2: {a1: x.a4, a2: {a1: x.a5, a2: {h: 0}}}}}}}), a2: x => ({a1: x.a1.a1, a2: x.a1.a2.a1, a3: x.a1.a2.a2.a1, a4: x.a1.a2.a2.a2.a1, a5: x.a1.a2.a2.a2.a2.a1}), a3: x => (undefined), a4: x => (undefined)};
});

const Main_implGenericEvx27 = __lazy(function () {
 const $0 = x => {
  switch(x.h) {
   case 0: return {h: 0, a1: {h: 0}};
   case 1: return {h: 1, a1: {h: 0, a1: {a1: x.a1, a2: {h: 0}}}};
   case 2: return {h: 1, a1: {h: 1, a1: {h: 0, a1: {a1: x.a1, a2: {h: 0}}}}};
   case 3: return {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 0, a1: {a1: x.a1, a2: {h: 0}}}}}};
   case 4: return {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 0, a1: {a1: x.a1, a2: {h: 0}}}}}}};
   case 5: return {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 0, a1: {h: 0}}}}}}};
   case 6: return {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 1, a1: {h: 0, a1: {a1: x.a1, a2: {h: 0}}}}}}}}};
  }
 };
 const $28 = x => {
  switch(x.h) {
   case 0: return {h: 0};
   case 1: {
    switch(x.a1.h) {
     case 0: return {h: 1, a1: x.a1.a1.a1};
     case 1: {
      switch(x.a1.a1.h) {
       case 0: return {h: 2, a1: x.a1.a1.a1.a1};
       case 1: {
        switch(x.a1.a1.a1.h) {
         case 0: return {h: 3, a1: x.a1.a1.a1.a1.a1};
         case 1: {
          switch(x.a1.a1.a1.a1.h) {
           case 0: return {h: 4, a1: x.a1.a1.a1.a1.a1.a1};
           case 1: {
            switch(x.a1.a1.a1.a1.a1.h) {
             case 0: return {h: 5};
             case 1: return {h: 6, a1: x.a1.a1.a1.a1.a1.a1.a1.a1};
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
 };
 const $41 = x => {
  switch(x.h) {
   case 0: return undefined;
   case 1: return undefined;
   case 2: return undefined;
   case 3: return undefined;
   case 4: return undefined;
   case 5: return undefined;
   case 6: return undefined;
  }
 };
 const $43 = x => {
  switch(x.h) {
   case 0: return undefined;
   case 1: {
    switch(x.a1.h) {
     case 0: return undefined;
     case 1: {
      switch(x.a1.a1.h) {
       case 0: return undefined;
       case 1: {
        switch(x.a1.a1.a1.h) {
         case 0: return undefined;
         case 1: {
          switch(x.a1.a1.a1.a1.h) {
           case 0: return undefined;
           case 1: {
            switch(x.a1.a1.a1.a1.a1.h) {
             case 0: return undefined;
             case 1: return undefined;
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
 };
 return {a1: $0, a2: $28, a3: $41, a4: $43};
});

function Main_implFromJSONUser($0, $1, $2, $3) {
 return JSON_FromJSON_genRecordFromJSON($2, Main_implMetaUser(), {a1: csegen_238(), a2: {a1: csegen_241(), a2: {a1: csegen_241(), a2: {a1: csegen_241(), a2: {h: 0}}}}}, $3);
}

function Main_implFromJSONTodo($0, $1, $2, $3) {
 return JSON_FromJSON_genRecordFromJSON($2, Main_implMetaTodo(), {a1: csegen_238(), a2: {a1: csegen_238(), a2: {a1: csegen_241(), a2: csegen_249()}}}, $3);
}

function Main_implFromJSONFetchResponse($0, $1, $2, $3) {
 return JSON_FromJSON_genRecordFromJSON($2, Main_implMetaFetchResponse(), {a1: csegen_238(), a2: {a1: csegen_238(), a2: {a1: csegen_241(), a2: {a1: csegen_248(), a2: csegen_249()}}}}, $3);
}

function Main_fetchParseEvent($0, $1, $2, $3) {
 return Control_Monad_Dom_DomIO_x3ex3ex3d_Monad_x28x28DomIOx20x24evx29x20x24iox29(csegen_89(), Prelude_Interfaces_x3cx24x3e($a => $b => $c => $d => $e => Control_Monad_Dom_DomIO_map_Functor_x28x28DomIOx20x24evx29x20x24iox29(csegen_259(), $c, $d, $e), $16 => $16.a3, $19 => Control_Monad_Dom_DomIO_env(csegen_89(), $19)), h => Prelude_Interfaces_x3ex3e(csegen_95(), Main_fetch(csegen_117(), $1, s => h(Main_n__26384_13263_parseType($0, $2, $1, s)), e => h(Main_n__26384_13262_handleError($0, $2, $1, e))), () => $38 => Control_Monad_Dom_DomIO_pure_Applicative_x28x28DomIOx20x24evx29x20x24iox29(csegen_71(), undefined, $38)), $3);
}

function Main_fetch($0, $1, $2, $3) {
 return $0.a2(undefined)($9 => Main_prim__fetch($1, $d => $e => JS_Util_runJS($2($d), $e), $15 => $16 => JS_Util_runJS($3($15), $16), $9));
}

const Main_errorDiv = __lazy(function () {
 return {h: 0, a1: 'div', a2: 19, a3: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: Main_aPrefix(), a2: {a1: '_errorDiv', a2: {h: 0}}})};
});

const Main_createTodoDiv = __lazy(function () {
 return {h: 0, a1: 'div', a2: 19, a3: csegen_48()};
});

const Main_contentDiv = __lazy(function () {
 return {h: 0, a1: 'body', a2: 7, a3: 'content'};
});

const Main_contentx27 = __lazy(function () {
 return {h: 0, a1: 'div', a2: 19, a3: {h: 0}, a4: {a1: {h: 0, a1: 'div', a2: 19, a3: {h: 0}, a4: {a1: {h: 2, a1: 'content2'}, a2: {h: 0}}}, a2: {a1: {h: 0, a1: 'div', a2: 19, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_out()), a2: {h: 0}}, a4: {h: 0}}, a2: {a1: {h: 0, a1: 'div', a2: 19, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_errorDiv()), a2: {h: 0}}, a4: {h: 0}}, a2: {a1: {h: 0, a1: 'div', a2: 19, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_listTodoDiv()), a2: {h: 0}}, a4: {h: 0}}, a2: {a1: {h: 0, a1: 'div', a2: 19, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_selectedTodoDiv()), a2: {h: 0}}, a4: {h: 0}}, a2: {a1: {h: 0, a1: 'div', a2: 19, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_createTodoDiv()), a2: {h: 0}}, a4: {h: 0}}, a2: {a1: {h: 0, a1: 'button', a2: 9, a3: {a1: Control_Monad_Dom_Interface_Attribute_ref(Main_btn()), a2: {a1: {h: 3, a1: {h: 0, a1: $50 => ({a1: {h: 5}})}}, a2: {h: 0}}}, a4: {a1: {h: 2, a1: 'Add todo'}, a2: {h: 0}}}, a2: {h: 0}}}}}}}}};
});

const Main_btn = __lazy(function () {
 return {h: 0, a1: 'button', a2: 9, a3: 'my_button'};
});

const Main_aPrefix = __lazy(function () {
 return 'somePrefix';
});

function Language_JSON_parse($0) {
 return Prelude_Types_x3ex3ex3d_Monad_Maybe(Language_JSON_Lexer_lexJSON($0), $6 => Language_JSON_Parser_parseJSON($6));
}

function Text_Bounded_map_Functor_WithBounds($0, $1) {
 return {a1: $0($1.a1), a2: $1.a2, a3: $1.a3};
}

function Text_Bounded_startBounds($0) {
 return {a1: $0.a1, a2: $0.a2};
}

function Text_Bounded_start($0) {
 return Text_Bounded_startBounds($0.a3);
}

function Text_Bounded_removeIrrelevance($0) {
 return {a1: $0.a1, a2: 1, a3: $0.a3};
}

function Text_Bounded_mergeBounds($0, $1) {
 switch($0.h) {
  case undefined: {
   switch($0.a2) {
    case 1: {
     switch($1.h) {
      case undefined: {
       switch($1.a2) {
        case 1: return Text_Bounded_irrelevantBounds($1.a1);
        default: return $1;
       }
      }
      default: return $1;
     }
    }
    default: {
     switch($1.h) {
      case undefined: {
       switch($1.a2) {
        case 1: return Prelude_Interfaces_x3cx24x3e(csegen_296(), $e => $1.a1, $0);
        default: {
         const $10 = Prelude_EqOrd_min_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29(csegen_307(), csegen_307(), Text_Bounded_start($0), Text_Bounded_start($1));
         const $1c = Prelude_EqOrd_max_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29(csegen_307(), csegen_307(), Text_Bounded_end($0), Text_Bounded_end($1));
         return {a1: $1.a1, a2: 0, a3: {a1: $10.a1, a2: $10.a2, a3: $1c.a1, a4: $1c.a2}};
        }
       }
      }
      default: {
       const $30 = Prelude_EqOrd_min_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29(csegen_307(), csegen_307(), Text_Bounded_start($0), Text_Bounded_start($1));
       const $3c = Prelude_EqOrd_max_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29(csegen_307(), csegen_307(), Text_Bounded_end($0), Text_Bounded_end($1));
       return {a1: $1.a1, a2: 0, a3: {a1: $30.a1, a2: $30.a2, a3: $3c.a1, a4: $3c.a2}};
      }
     }
    }
   }
  }
  default: {
   switch($1.h) {
    case undefined: {
     switch($1.a2) {
      case 1: return Prelude_Interfaces_x3cx24x3e(csegen_296(), $56 => $1.a1, $0);
      default: {
       const $58 = Prelude_EqOrd_min_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29(csegen_307(), csegen_307(), Text_Bounded_start($0), Text_Bounded_start($1));
       const $64 = Prelude_EqOrd_max_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29(csegen_307(), csegen_307(), Text_Bounded_end($0), Text_Bounded_end($1));
       return {a1: $1.a1, a2: 0, a3: {a1: $58.a1, a2: $58.a2, a3: $64.a1, a4: $64.a2}};
      }
     }
    }
    default: {
     const $78 = Prelude_EqOrd_min_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29(csegen_307(), csegen_307(), Text_Bounded_start($0), Text_Bounded_start($1));
     const $84 = Prelude_EqOrd_max_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29(csegen_307(), csegen_307(), Text_Bounded_end($0), Text_Bounded_end($1));
     return {a1: $1.a1, a2: 0, a3: {a1: $78.a1, a2: $78.a2, a3: $84.a1, a4: $84.a2}};
    }
   }
  }
 }
}

function Text_Bounded_irrelevantBounds($0) {
 return {a1: $0, a2: 1, a3: {a1: -1, a2: -1, a3: -1, a4: -1}};
}

function Text_Bounded_endBounds($0) {
 return {a1: $0.a3, a2: $0.a4};
}

function Text_Bounded_end($0) {
 return Text_Bounded_endBounds($0.a3);
}

function Prelude_Basics_flip($0, $1, $2) {
 return $0($2)($1);
}

function Builtin_snd($0) {
 return $0.a2;
}

function Builtin_fst($0) {
 return $0.a1;
}

function Builtin_believe_me($0) {
 return $0;
}

function Prelude_Types_n__9361_8543_hexChars($0) {
 return {a1: '0', a2: {a1: '1', a2: {a1: '2', a2: {a1: '3', a2: {a1: '4', a2: {a1: '5', a2: {a1: '6', a2: {a1: '7', a2: {a1: '8', a2: {a1: '9', a2: {a1: 'A', a2: {a1: 'B', a2: {a1: 'C', a2: {a1: 'D', a2: {a1: 'E', a2: {a1: 'F', a2: {h: 0}}}}}}}}}}}}}}}}};
}

function Prelude_Types_traverse_Traversable_List($0, $1, $2) {
 switch($2.h) {
  case 0: return $0.a2(undefined)({h: 0});
  case undefined: return $0.a3(undefined)(undefined)($0.a3(undefined)(undefined)($0.a2(undefined)(csegen_324()))($1($2.a1)))(Prelude_Types_traverse_Traversable_List($0, $1, $2.a2));
 }
}

function Prelude_Types_toList_Foldable_Maybe($0) {
 return Prelude_Types_foldr_Foldable_Maybe(csegen_324(), {h: 0}, $0);
}

function Prelude_Types_null_Foldable_Maybe($0) {
 switch($0.h) {
  case 0: return 1;
  case undefined: return 0;
 }
}

function Prelude_Types_null_Foldable_List($0) {
 switch($0.h) {
  case 0: return 1;
  case undefined: return 0;
 }
}

function Prelude_Types_map_Functor_Maybe($0, $1) {
 switch($1.h) {
  case undefined: return {a1: $0($1.a1)};
  case 0: return {h: 0};
 }
}

function Prelude_Types_map_Functor_List($0, $1) {
 switch($1.h) {
  case 0: return {h: 0};
  case undefined: return {a1: $0($1.a1), a2: Prelude_Types_map_Functor_List($0, $1.a2)};
 }
}

function Prelude_Types_foldr_Foldable_Maybe($0, $1, $2) {
 switch($2.h) {
  case 0: return $1;
  case undefined: return $0($2.a1)($1);
 }
}

function Prelude_Types_foldr_Foldable_List($0, $1, $2) {
 switch($2.h) {
  case 0: return $1;
  case undefined: return $0($2.a1)(Prelude_Types_foldr_Foldable_List($0, $1, $2.a2));
 }
}

function Prelude_Types_foldl_Foldable_Maybe($0, $1, $2) {
 return Prelude_Types_foldr_Foldable_Maybe($6 => $7 => Prelude_Basics_flip($a => $b => $c => $a($b($c)), $12 => Prelude_Basics_flip($0, $6, $12), $7), $19 => $19, $2)($1);
}

function Prelude_Types_foldlM_Foldable_Maybe($0, $1, $2, $3) {
 return Prelude_Types_foldl_Foldable_Maybe(ma => b => $0.a2(undefined)(undefined)(ma)($f => Prelude_Basics_flip($1, b, $f)), $0.a1.a2(undefined)($2), $3);
}

function Prelude_Types_foldlM_Foldable_List($0, $1, $2, $3) {
 return Prelude_Types_foldl_Foldable_List(ma => b => $0.a2(undefined)(undefined)(ma)($f => Prelude_Basics_flip($1, b, $f)), $0.a1.a2(undefined)($2), $3);
}

function Prelude_Types_foldMap_Foldable_Maybe($0, $1, $2) {
 return Prelude_Types_foldr_Foldable_Maybe($5 => $6 => $0.a1($1($5))($6), $0.a2, $2);
}

function Prelude_Types_foldMap_Foldable_List($0, $1, $2) {
 return Prelude_Types_foldl_Foldable_List(acc => elem => $0.a1(acc)($1(elem)), $0.a2, $2);
}

function Prelude_Types_x3ex3ex3d_Monad_Maybe($0, $1) {
 switch($0.h) {
  case 0: return {h: 0};
  case undefined: return $1($0.a1);
 }
}

function Prelude_Types_x3ex3ex3d_Monad_x28Eitherx20x24ex29($0, $1) {
 switch($0.h) {
  case 0: return {h: 0, a1: $0.a1};
  case 1: return $1($0.a1);
 }
}

function Prelude_Types_x3cx7cx3e_Alternative_Maybe($0, $1) {
 switch($0.h) {
  case undefined: return {a1: $0.a1};
  case 0: return $1();
 }
}

function Prelude_Types_x3cx2ax3e_Applicative_Maybe($0, $1) {
 switch($0.h) {
  case undefined: {
   switch($1.h) {
    case undefined: return {a1: $0.a1($1.a1)};
    default: return {h: 0};
   }
  }
  default: return {h: 0};
 }
}

function Prelude_Types_toUpper($0) {
 switch(Prelude_Types_isLower($0)) {
  case 1: return _truncToChar(_sub32s(_truncInt32($0.codePointAt(0)), 32));
  case 0: return $0;
 }
}

function Prelude_Types_List_tailRecAppend($0, $1) {
 return Prelude_Types_List_reverseOnto($1, Prelude_Types_List_reverse($0));
}

function Prelude_Types_List_reverse($0) {
 return Prelude_Types_List_reverseOnto({h: 0}, $0);
}

function Prelude_Types_prim__integerToNat($0) {
 let $1;
 switch(((0n<=$0)?1:0)) {
  case 0: {
   $1 = 0;
   break;
  }
  default: $1 = 1;
 }
 switch($1) {
  case 1: return Builtin_believe_me($0);
  case 0: return 0n;
 }
}

function Prelude_Types_maybe($0, $1, $2) {
 switch($2.h) {
  case 0: return $0();
  case undefined: return $1()($2.a1);
 }
}

function Prelude_Types_List_lengthTR($0) {
 return Prelude_Types_List_lengthPlus(0n, $0);
}

function Prelude_Types_isUpper($0) {
 switch(Prelude_EqOrd_x3ex3d_Ord_Char($0, 'A')) {
  case 1: return Prelude_EqOrd_x3cx3d_Ord_Char($0, 'Z');
  case 0: return 0;
 }
}

function Prelude_Types_isSpace($0) {
 switch(Prelude_EqOrd_x3dx3d_Eq_Char($0, ' ')) {
  case 1: return 1;
  case 0: {
   switch(Prelude_EqOrd_x3dx3d_Eq_Char($0, '\u{9}')) {
    case 1: return 1;
    case 0: {
     switch(Prelude_EqOrd_x3dx3d_Eq_Char($0, '\r')) {
      case 1: return 1;
      case 0: {
       switch(Prelude_EqOrd_x3dx3d_Eq_Char($0, '\n')) {
        case 1: return 1;
        case 0: {
         switch(Prelude_EqOrd_x3dx3d_Eq_Char($0, '\u{c}')) {
          case 1: return 1;
          case 0: {
           switch(Prelude_EqOrd_x3dx3d_Eq_Char($0, '\u{b}')) {
            case 1: return 1;
            case 0: return Prelude_EqOrd_x3dx3d_Eq_Char($0, '\u{a0}');
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
 }
}

function Prelude_Types_isLower($0) {
 switch(Prelude_EqOrd_x3ex3d_Ord_Char($0, 'a')) {
  case 1: return Prelude_EqOrd_x3cx3d_Ord_Char($0, 'z');
  case 0: return 0;
 }
}

function Prelude_Types_isHexDigit($0) {
 return Prelude_Types_elem(csegen_16(), csegen_328(), Prelude_Types_toUpper($0), Prelude_Types_n__9361_8543_hexChars($0));
}

function Prelude_Types_isDigit($0) {
 switch(Prelude_EqOrd_x3ex3d_Ord_Char($0, '0')) {
  case 1: return Prelude_EqOrd_x3cx3d_Ord_Char($0, '9');
  case 0: return 0;
 }
}

function Prelude_Types_isControl($0) {
 let $1;
 switch(Prelude_EqOrd_x3ex3d_Ord_Char($0, '\0')) {
  case 1: {
   $1 = Prelude_EqOrd_x3cx3d_Ord_Char($0, '\u{1f}');
   break;
  }
  case 0: {
   $1 = 0;
   break;
  }
 }
 switch($1) {
  case 1: return 1;
  case 0: {
   switch(Prelude_EqOrd_x3ex3d_Ord_Char($0, '\u{7f}')) {
    case 1: return Prelude_EqOrd_x3cx3d_Ord_Char($0, '\u{9f}');
    case 0: return 0;
   }
  }
 }
}

function Prelude_Types_isAlphaNum($0) {
 switch(Prelude_Types_isDigit($0)) {
  case 1: return 1;
  case 0: return Prelude_Types_isAlpha($0);
 }
}

function Prelude_Types_isAlpha($0) {
 switch(Prelude_Types_isUpper($0)) {
  case 1: return 1;
  case 0: return Prelude_Types_isLower($0);
 }
}

function Prelude_Types_elemBy($0, $1, $2, $3) {
 return Prelude_Interfaces_any($0, $1($2), $3);
}

function Prelude_Types_elem($0, $1, $2, $3) {
 return Prelude_Types_elemBy($0, $7 => $8 => $1.a1($7)($8), $2, $3);
}

function Prelude_Types_either($0, $1, $2) {
 switch($2.h) {
  case 0: return $0()($2.a1);
  case 1: return $1()($2.a1);
 }
}

function Prelude_EqOrd_min_Ord_Int($0, $1) {
 switch(Prelude_EqOrd_x3c_Ord_Int($0, $1)) {
  case 1: return $0;
  case 0: return $1;
 }
}

function Prelude_EqOrd_min_Ord_Char($0, $1) {
 switch(Prelude_EqOrd_x3c_Ord_Char($0, $1)) {
  case 1: return $0;
  case 0: return $1;
 }
}

function Prelude_EqOrd_min_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3) {
 switch(Prelude_EqOrd_x3c_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3)) {
  case 1: return $2;
  case 0: return $3;
 }
}

function Prelude_EqOrd_max_Ord_Int($0, $1) {
 switch(Prelude_EqOrd_x3e_Ord_Int($0, $1)) {
  case 1: return $0;
  case 0: return $1;
 }
}

function Prelude_EqOrd_max_Ord_Char($0, $1) {
 switch(Prelude_EqOrd_x3e_Ord_Char($0, $1)) {
  case 1: return $0;
  case 0: return $1;
 }
}

function Prelude_EqOrd_max_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3) {
 switch(Prelude_EqOrd_x3e_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3)) {
  case 1: return $2;
  case 0: return $3;
 }
}

function Prelude_EqOrd_compare_Ord_Integer($0, $1) {
 switch(Prelude_EqOrd_x3c_Ord_Integer($0, $1)) {
  case 1: return 0;
  case 0: {
   switch(Prelude_EqOrd_x3dx3d_Eq_Integer($0, $1)) {
    case 1: return 1;
    case 0: return 2;
   }
  }
 }
}

function Prelude_EqOrd_compare_Ord_Int($0, $1) {
 switch(Prelude_EqOrd_x3c_Ord_Int($0, $1)) {
  case 1: return 0;
  case 0: {
   switch(Prelude_EqOrd_x3dx3d_Eq_Int($0, $1)) {
    case 1: return 1;
    case 0: return 2;
   }
  }
 }
}

function Prelude_EqOrd_compare_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3) {
 switch($0.a1.a2($2.a1)($3.a1)) {
  case 1: return $0.a2($2.a1)($3.a1);
  case 0: return $1.a2($2.a2)($3.a2);
 }
}

function Prelude_EqOrd_x3e_Ord_Int($0, $1) {
 switch((($0>$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3e_Ord_Char($0, $1) {
 switch((($0>$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3e_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3) {
 return Prelude_EqOrd_x3dx3d_Eq_Ordering(Prelude_EqOrd_compare_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3), 2);
}

function Prelude_EqOrd_x3ex3d_Ord_Integer($0, $1) {
 switch((($0>=$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3ex3d_Ord_Int($0, $1) {
 switch((($0>=$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3ex3d_Ord_Char($0, $1) {
 switch((($0>=$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3dx3d_Eq_String($0, $1) {
 switch((($0===$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3dx3d_Eq_Ordering($0, $1) {
 switch($0) {
  case 0: {
   switch($1) {
    case 0: return 1;
    default: return 0;
   }
  }
  case 1: {
   switch($1) {
    case 1: return 1;
    default: return 0;
   }
  }
  case 2: {
   switch($1) {
    case 2: return 1;
    default: return 0;
   }
  }
  default: return 0;
 }
}

function Prelude_EqOrd_x3dx3d_Eq_Integer($0, $1) {
 switch((($0===$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3dx3d_Eq_Int($0, $1) {
 switch((($0===$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3dx3d_Eq_Double($0, $1) {
 switch((($0===$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3dx3d_Eq_Char($0, $1) {
 switch((($0===$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3dx3d_Eq_Bool($0, $1) {
 switch($0) {
  case 1: {
   switch($1) {
    case 1: return 1;
    default: return 0;
   }
  }
  case 0: {
   switch($1) {
    case 0: return 1;
    default: return 0;
   }
  }
  default: return 0;
 }
}

function Prelude_EqOrd_x3dx3d_Eq_Bits8($0, $1) {
 switch((($0===$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3c_Ord_Integer($0, $1) {
 switch((($0<$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3c_Ord_Int($0, $1) {
 switch((($0<$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3c_Ord_Char($0, $1) {
 switch((($0<$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3c_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3) {
 return Prelude_EqOrd_x3dx3d_Eq_Ordering(Prelude_EqOrd_compare_Ord_x28x7cx28x28Builtinx2ePairx20x24ax29x20x24bx29x2cx28x28Builtinx2eMkPairx20x24ax29x20x24bx29x7cx29($0, $1, $2, $3), 0);
}

function Prelude_EqOrd_x3cx3d_Ord_Int($0, $1) {
 switch((($0<=$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x3cx3d_Ord_Char($0, $1) {
 switch((($0<=$1)?1:0)) {
  case 0: return 0;
  default: return 1;
 }
}

function Prelude_EqOrd_x2fx3d_Eq_String($0, $1) {
 switch(Prelude_EqOrd_x3dx3d_Eq_String($0, $1)) {
  case 1: return 0;
  case 0: return 1;
 }
}

function Prelude_EqOrd_x2fx3d_Eq_Ordering($0, $1) {
 switch(Prelude_EqOrd_x3dx3d_Eq_Ordering($0, $1)) {
  case 1: return 0;
  case 0: return 1;
 }
}

function Prelude_EqOrd_x2fx3d_Eq_Int($0, $1) {
 switch(Prelude_EqOrd_x3dx3d_Eq_Int($0, $1)) {
  case 1: return 0;
  case 0: return 1;
 }
}

function Prelude_EqOrd_x2fx3d_Eq_Double($0, $1) {
 switch(Prelude_EqOrd_x3dx3d_Eq_Double($0, $1)) {
  case 1: return 0;
  case 0: return 1;
 }
}

function Prelude_EqOrd_x2fx3d_Eq_Char($0, $1) {
 switch(Prelude_EqOrd_x3dx3d_Eq_Char($0, $1)) {
  case 1: return 0;
  case 0: return 1;
 }
}

function Prelude_Interfaces_Bool_Semigroup_x3cx2bx3e_Semigroup_AnyBool($0, $1) {
 switch($0) {
  case 1: return 1;
  case 0: return $1;
 }
}

function Prelude_Interfaces_Bool_Semigroup_x3cx2bx3e_Semigroup_AllBool($0, $1) {
 switch($0) {
  case 1: return $1;
  case 0: return 0;
 }
}

function Prelude_Interfaces_traverse_($0, $1, $2, $3) {
 return $1.a1(undefined)(undefined)($d => $e => Prelude_Interfaces_x2ax3e($0, $2($d), $e))($0.a2(undefined)(undefined))($3);
}

function Prelude_Interfaces_concat($0, $1, $2) {
 return $1.a6(undefined)(undefined)($0)($d => $d)($2);
}

function Prelude_Interfaces_any($0, $1, $2) {
 return $0.a6(undefined)(undefined)({a1: $d => $e => Prelude_Interfaces_Bool_Semigroup_x3cx2bx3e_Semigroup_AnyBool($d, $e), a2: 0})($1)($2);
}

function Prelude_Interfaces_all($0, $1, $2) {
 return $0.a6(undefined)(undefined)({a1: $d => $e => Prelude_Interfaces_Bool_Semigroup_x3cx2bx3e_Semigroup_AllBool($d, $e), a2: 1})($1)($2);
}

function Prelude_Interfaces_x3ex3e($0, $1, $2) {
 return $0.a2(undefined)(undefined)($1)($c => $2());
}

function Prelude_Interfaces_x3cx24x3e($0, $1, $2) {
 return $0(undefined)(undefined)($1)($2);
}

function Prelude_Interfaces_x2ax3e($0, $1, $2) {
 return $0.a3(undefined)(undefined)($0.a1(undefined)(undefined)($13 => $14 => $14)($1))($2);
}

function Prelude_Show_n__2390_10835_asciiTab($0) {
 return {a1: 'NUL', a2: {a1: 'SOH', a2: {a1: 'STX', a2: {a1: 'ETX', a2: {a1: 'EOT', a2: {a1: 'ENQ', a2: {a1: 'ACK', a2: {a1: 'BEL', a2: {a1: 'BS', a2: {a1: 'HT', a2: {a1: 'LF', a2: {a1: 'VT', a2: {a1: 'FF', a2: {a1: 'CR', a2: {a1: 'SO', a2: {a1: 'SI', a2: {a1: 'DLE', a2: {a1: 'DC1', a2: {a1: 'DC2', a2: {a1: 'DC3', a2: {a1: 'DC4', a2: {a1: 'NAK', a2: {a1: 'SYN', a2: {a1: 'ETB', a2: {a1: 'CAN', a2: {a1: 'EM', a2: {a1: 'SUB', a2: {a1: 'ESC', a2: {a1: 'FS', a2: {a1: 'GS', a2: {a1: 'RS', a2: {a1: 'US', a2: {h: 0}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}};
}

function Prelude_Show_show_Show_String($0) {
 return ('\"'+Prelude_Show_showLitString(Prelude_Types_fastUnpack($0), '\"'));
}

function Prelude_Show_show_Show_Nat($0) {
 return Prelude_Show_show_Show_Integer($0);
}

function Prelude_Show_show_Show_Integer($0) {
 return Prelude_Show_showPrec_Show_Integer({h: 0}, $0);
}

function Prelude_Show_show_Show_Int($0) {
 return Prelude_Show_showPrec_Show_Int({h: 0}, $0);
}

function Prelude_Show_show_Show_Double($0) {
 return Prelude_Show_showPrec_Show_Double({h: 0}, $0);
}

function Prelude_Show_show_Show_Bool($0) {
 switch($0) {
  case 1: return 'True';
  case 0: return 'False';
 }
}

function Prelude_Show_showPrec_Show_String($0, $1) {
 return Prelude_Show_show_Show_String($1);
}

function Prelude_Show_showPrec_Show_Nat($0, $1) {
 return Prelude_Show_show_Show_Nat($1);
}

function Prelude_Show_showPrec_Show_Integer($0, $1) {
 return Prelude_Show_primNumShow($4 => (''+$4), $0, $1);
}

function Prelude_Show_showPrec_Show_Int($0, $1) {
 return Prelude_Show_primNumShow($4 => (''+$4), $0, $1);
}

function Prelude_Show_showPrec_Show_Double($0, $1) {
 return Prelude_Show_primNumShow($4 => (''+$4), $0, $1);
}

function Prelude_Show_showPrec_Show_Bool($0, $1) {
 return Prelude_Show_show_Show_Bool($1);
}

function Prelude_Show_compare_Ord_Prec($0, $1) {
 switch($0.h) {
  case 4: {
   switch($1.h) {
    case 4: return Prelude_EqOrd_compare_Ord_Integer($0.a1, $1.a1);
    default: return Prelude_EqOrd_compare_Ord_Integer(Prelude_Show_precCon($0), Prelude_Show_precCon($1));
   }
  }
  default: return Prelude_EqOrd_compare_Ord_Integer(Prelude_Show_precCon($0), Prelude_Show_precCon($1));
 }
}

function Prelude_Show_x3ex3d_Ord_Prec($0, $1) {
 return Prelude_EqOrd_x2fx3d_Eq_Ordering(Prelude_Show_compare_Ord_Prec($0, $1), 0);
}

function Prelude_Show_showParens($0, $1) {
 switch($0) {
  case 0: return $1;
  case 1: return ('('+($1+')'));
 }
}

function Prelude_Show_showLitString($0, $1) {
 switch($0.h) {
  case 0: return $1;
  case undefined: {
   switch($0.a1) {
    case '\"': return ('\u{5c}\"'+Prelude_Show_showLitString($0.a2, $1));
    default: return Prelude_Show_showLitChar($0.a1)(Prelude_Show_showLitString($0.a2, $1));
   }
  }
 }
}

function Prelude_Show_showLitChar($0) {
 switch($0) {
  case '\u{7}': return $2 => ('\u{5c}a'+$2);
  case '\u{8}': return $5 => ('\u{5c}b'+$5);
  case '\u{c}': return $8 => ('\u{5c}f'+$8);
  case '\n': return $b => ('\u{5c}n'+$b);
  case '\r': return $e => ('\u{5c}r'+$e);
  case '\u{9}': return $11 => ('\u{5c}t'+$11);
  case '\u{b}': return $14 => ('\u{5c}v'+$14);
  case '\u{e}': return $17 => Prelude_Show_protectEsc($1a => Prelude_EqOrd_x3dx3d_Eq_Char($1a, 'H'), '\u{5c}SO', $17);
  case '\u{7f}': return $20 => ('\u{5c}DEL'+$20);
  case '\u{5c}': return $23 => ('\u{5c}\u{5c}'+$23);
  default: {
   return $26 => {
    const $27 = Prelude_Types_getAt(Prelude_Types_prim__integerToNat(BigInt($0.codePointAt(0))), Prelude_Show_n__2390_10835_asciiTab($0));
    switch($27.h) {
     case undefined: return ('\u{5c}'+($27.a1+$26));
     case 0: {
      switch(Prelude_EqOrd_x3e_Ord_Char($0, '\u{7f}')) {
       case 1: return ('\u{5c}'+Prelude_Show_protectEsc($3c => Prelude_Types_isDigit($3c), Prelude_Show_show_Show_Int(_truncInt32($0.codePointAt(0))), $26));
       case 0: return ($0+$26);
      }
     }
    }
   };
  }
 }
}

function Prelude_Show_showCon($0, $1, $2) {
 return Prelude_Show_showParens(Prelude_Show_x3ex3d_Ord_Prec($0, {h: 6}), ($1+$2));
}

function Prelude_Show_showArg($0, $1) {
 return (' '+$0.a2({h: 6})($1));
}

function Prelude_Show_protectEsc($0, $1, $2) {
 let $5;
 switch(Prelude_Show_firstCharIs($0, $2)) {
  case 1: {
   $5 = '\u{5c}&';
   break;
  }
  case 0: {
   $5 = '';
   break;
  }
 }
 const $4 = ($5+$2);
 return ($1+$4);
}

function Prelude_Show_primNumShow($0, $1, $2) {
 const $3 = $0($2);
 let $7;
 switch(Prelude_Show_x3ex3d_Ord_Prec($1, {h: 5})) {
  case 1: {
   $7 = Prelude_Show_firstCharIs($e => Prelude_EqOrd_x3dx3d_Eq_Char($e, '-'), $3);
   break;
  }
  case 0: {
   $7 = 0;
   break;
  }
 }
 return Prelude_Show_showParens($7, $3);
}

function Prelude_Show_precCon($0) {
 switch($0.h) {
  case 0: return 0n;
  case 1: return 1n;
  case 2: return 2n;
  case 3: return 3n;
  case 4: return 4n;
  case 5: return 5n;
  case 6: return 6n;
 }
}

function Prelude_Show_firstCharIs($0, $1) {
 switch($1) {
  case '': return 0;
  default: return $0(($1.charAt(0)));
 }
}

function Prelude_IO_map_Functor_IO($0, $1, $2) {
 const $3 = $1($2);
 return $0($3);
}

function PrimIO_unsafePerformIO($0) {
 return PrimIO_unsafeCreateWorld(w => $0(w));
}

function PrimIO_unsafeCreateWorld($0) {
 return $0(_idrisworld);
}

function Prelude_Cast_cast_Cast_String_Double($0) {
 return _numberOfString($0);
}

function Prelude_Cast_cast_Cast_Nat_Int($0) {
 return Number(_truncBigInt32($0));
}

function Prelude_Cast_cast_Cast_Int_Integer($0) {
 return BigInt($0);
}

function Prelude_Cast_cast_Cast_Double_Integer($0) {
 return BigInt(Math.trunc($0));
}

function Data_String_with__parseIntegerx2cparseIntTrimmed_6943($0, $1, $2, $3, $4, $5) {
 switch($4) {
  case '': {
   switch($5.h) {
    case 0: return {h: 0};
    default: {
     switch(Prelude_EqOrd_x3dx3d_Eq_Char($5.a1, '-')) {
      case 1: return Prelude_Types_map_Functor_Maybe(y => $2.a2($1.a3(y)), Data_String_parseNumWithoutSign(Prelude_Types_fastUnpack($5.a2), 0n));
      case 0: {
       switch(Prelude_EqOrd_x3dx3d_Eq_Char($5.a1, '+')) {
        case 1: return Prelude_Types_map_Functor_Maybe($21 => $1.a3($21), Data_String_parseNumWithoutSign(Prelude_Types_fastUnpack($5.a2), Prelude_Cast_cast_Cast_Int_Integer(0)));
        case 0: {
         let $2d;
         switch(Prelude_EqOrd_x3ex3d_Ord_Char($5.a1, '0')) {
          case 1: {
           $2d = Prelude_EqOrd_x3cx3d_Ord_Char($5.a1, '9');
           break;
          }
          case 0: {
           $2d = 0;
           break;
          }
         }
         switch($2d) {
          case 1: return Prelude_Types_map_Functor_Maybe($37 => $1.a3($37), Data_String_parseNumWithoutSign(Prelude_Types_fastUnpack($5.a2), Prelude_Cast_cast_Cast_Int_Integer(_sub32s(_truncInt32($5.a1.codePointAt(0)), _truncInt32('0'.codePointAt(0))))));
          case 0: return {h: 0};
         }
        }
       }
      }
     }
    }
   }
  }
  default: {
   switch(Prelude_EqOrd_x3dx3d_Eq_Char($5.a1, '-')) {
    case 1: return Prelude_Types_map_Functor_Maybe(y => $2.a2($1.a3(y)), Data_String_parseNumWithoutSign(Prelude_Types_fastUnpack($5.a2), 0n));
    case 0: {
     switch(Prelude_EqOrd_x3dx3d_Eq_Char($5.a1, '+')) {
      case 1: return Prelude_Types_map_Functor_Maybe($60 => $1.a3($60), Data_String_parseNumWithoutSign(Prelude_Types_fastUnpack($5.a2), Prelude_Cast_cast_Cast_Int_Integer(0)));
      case 0: {
       let $6c;
       switch(Prelude_EqOrd_x3ex3d_Ord_Char($5.a1, '0')) {
        case 1: {
         $6c = Prelude_EqOrd_x3cx3d_Ord_Char($5.a1, '9');
         break;
        }
        case 0: {
         $6c = 0;
         break;
        }
       }
       switch($6c) {
        case 1: return Prelude_Types_map_Functor_Maybe($76 => $1.a3($76), Data_String_parseNumWithoutSign(Prelude_Types_fastUnpack($5.a2), Prelude_Cast_cast_Cast_Int_Integer(_sub32s(_truncInt32($5.a1.codePointAt(0)), _truncInt32('0'.codePointAt(0))))));
        case 0: return {h: 0};
       }
      }
     }
    }
   }
  }
 }
}

function Data_String_with__asList_6479($0, $1) {
 switch($0) {
  case '': {
   switch($1.h) {
    case 0: return {h: 0};
    default: return {h: 1, a1: $1.a1, a2: $1.a2, a3: () => Data_String_asList($1.a2)};
   }
  }
  default: return {h: 1, a1: $1.a1, a2: $1.a2, a3: () => Data_String_asList($1.a2)};
 }
}

function Data_String_n__4323_6937_parseIntTrimmed($0, $1, $2, $3) {
 return Data_String_with__parseIntegerx2cparseIntTrimmed_6943(undefined, $0, $1, $3, $3, Data_String_strM($3));
}

function Data_String_trim($0) {
 return Data_String_ltrim(_strReverse(Data_String_ltrim(_strReverse($0))));
}

function Data_String_strM($0) {
 switch($0) {
  case '': return {h: 0};
  default: return Builtin_believe_me({a1: ($0.charAt(0)), a2: ($0.slice(1))});
 }
}

function Data_String_singleton($0) {
 return ($0+'');
}

function Data_String_parseInteger($0, $1, $2) {
 return Data_String_n__4323_6937_parseIntTrimmed($0, $1, $2, Data_String_trim($2));
}

function Data_String_null($0) {
 return Prelude_EqOrd_x3dx3d_Eq_String($0, '');
}

function Data_String_ltrim($0) {
 return Data_String_with__ltrim_6503($0, Data_String_asList($0));
}

function Data_String_asList($0) {
 return Data_String_with__asList_6479($0, Data_String_strM($0));
}

function Data_Maybe_isJust($0) {
 switch($0.h) {
  case 0: return 0;
  case undefined: return 1;
 }
}

function Data_List1_forget($0) {
 return {a1: $0.a1, a2: $0.a2};
}

function Data_List1_appendl($0, $1) {
 return {a1: $0.a1, a2: Prelude_Types_List_tailRecAppend($0.a2, $1)};
}

function Data_List1_x2bx2b($0, $1) {
 return Data_List1_appendl($0, Data_List1_forget($1));
}

function Data_List_take($0, $1) {
 switch($0) {
  case 0n: return {h: 0};
  default: {
   const $3 = ($0-1n);
   switch($1.h) {
    case undefined: return {a1: $1.a1, a2: Data_List_take($3, $1.a2)};
    default: return {h: 0};
   }
  }
 }
}

function Data_List_span($0, $1) {
 switch($1.h) {
  case 0: return {a1: {h: 0}, a2: {h: 0}};
  case undefined: {
   switch($0($1.a1)) {
    case 1: {
     const $8 = Data_List_span($0, $1.a2);
     return {a1: {a1: $1.a1, a2: $8.a1}, a2: $8.a2};
    }
    case 0: return {a1: {h: 0}, a2: {a1: $1.a1, a2: $1.a2}};
   }
  }
 }
}

function Data_List_mergeReplicate($0, $1) {
 switch($1.h) {
  case 0: return {h: 0};
  case undefined: return {a1: $0, a2: {a1: $1.a1, a2: Data_List_mergeReplicate($0, $1.a2)}};
 }
}

function Data_List_lookup($0, $1, $2) {
 return Data_List_lookupBy($5 => $6 => $0.a1($5)($6), $1, $2);
}

function Data_List_intersperse($0, $1) {
 switch($1.h) {
  case 0: return {h: 0};
  case undefined: return {a1: $1.a1, a2: Data_List_mergeReplicate($0, $1.a2)};
 }
}

function Data_List_headx27($0) {
 switch($0.h) {
  case 0: return {h: 0};
  case undefined: return {a1: $0.a1};
 }
}

function Data_String_Extra_index($0, $1) {
 return Data_String_Extra_with__index_1618($1, Prelude_Types_fastUnpack($1), $0);
}

const Language_JSON_Parser_n__3581_2407_values = __lazy(function () {
 return Text_Parser_sepBy(1, Language_JSON_Parser_punct({h: 0}), Language_JSON_Parser_json());
});

const Language_JSON_Parser_n__3578_2316_properties = __lazy(function () {
 return Text_Parser_sepBy(1, Language_JSON_Parser_punct({h: 0}), {h: 8, a1: 1, a2: Language_JSON_Parser_rawString(), a3: () => key => ({h: 10, a1: 1, a2: Language_JSON_Parser_punct({h: 1}), a3: () => ({h: 8, a1: 0, a2: Language_JSON_Parser_json(), a3: () => value => ({h: 0, a1: {a1: key, a2: value}})})})});
});

const Language_JSON_Parser_string = __lazy(function () {
 return Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, $3 => ({h: 3, a1: $3}), Language_JSON_Parser_rawString());
});

const Language_JSON_Parser_rawString = __lazy(function () {
 return {h: 8, a1: 0, a2: Text_Parser_match(csegen_373(), csegen_376(), {h: 2}), a3: () => mstr => {
  switch(mstr.h) {
   case undefined: return {h: 0, a1: mstr.a1};
   case 0: return {h: 4, a1: {h: 0}, a2: 0, a3: 'invalid string'};
  }
 }};
});

function Language_JSON_Parser_punct($0) {
 return Text_Parser_match(csegen_373(), csegen_376(), {h: 4, a1: $0});
}

function Language_JSON_Parser_parseJSON($0) {
 const $8 = $9 => {
  switch(Language_JSON_Tokens_ignored($9)) {
   case 1: return 0;
   case 0: return 1;
  }
 };
 const $6 = Prelude_Types_List_filter($8, $0);
 const $1 = Text_Parser_Core_parse(1, Language_JSON_Parser_json(), $6);
 switch($1.h) {
  case 1: {
   switch($1.a1.h) {
    case undefined: {
     switch($1.a1.a2.h) {
      case 0: return {a1: $1.a1.a1};
      default: return {h: 0};
     }
    }
    default: return {h: 0};
   }
  }
  default: return {h: 0};
 }
}

const Language_JSON_Parser_object = __lazy(function () {
 return {h: 10, a1: 1, a2: Language_JSON_Parser_punct({h: 3, a1: 0}), a3: () => ({h: 11, a1: 0, a2: 1, a3: {h: 6}, a4: {h: 9, a1: 0, a2: 1, a3: Language_JSON_Parser_n__3578_2316_properties(), a4: props => ({h: 10, a1: 0, a2: Language_JSON_Parser_punct({h: 3, a1: 1}), a3: () => ({h: 0, a1: {h: 5, a1: props}})})}})};
});

const Language_JSON_Parser_number = __lazy(function () {
 return Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, $3 => ({h: 2, a1: $3}), Text_Parser_match(csegen_373(), csegen_376(), {h: 1}));
});

const Language_JSON_Parser_null = __lazy(function () {
 return Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, $3 => ({h: 0}), Text_Parser_match(csegen_373(), csegen_376(), {h: 3}));
});

const Language_JSON_Parser_json = __lazy(function () {
 return {h: 12, a1: 1, a2: 1, a3: Language_JSON_Parser_object(), a4: () => ({h: 12, a1: 1, a2: 1, a3: Language_JSON_Parser_array(), a4: () => ({h: 12, a1: 1, a2: 1, a3: Language_JSON_Parser_string(), a4: () => ({h: 12, a1: 1, a2: 1, a3: Language_JSON_Parser_boolean(), a4: () => ({h: 12, a1: 1, a2: 1, a3: Language_JSON_Parser_number(), a4: () => Language_JSON_Parser_null()})})})})};
});

const Language_JSON_Parser_boolean = __lazy(function () {
 return Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, $3 => ({h: 1, a1: $3}), Text_Parser_match(csegen_373(), csegen_376(), {h: 0}));
});

const Language_JSON_Parser_array = __lazy(function () {
 return {h: 10, a1: 1, a2: Language_JSON_Parser_punct({h: 2, a1: 0}), a3: () => ({h: 11, a1: 0, a2: 1, a3: {h: 6}, a4: {h: 9, a1: 0, a2: 1, a3: Language_JSON_Parser_n__3581_2407_values(), a4: vals => ({h: 10, a1: 0, a2: Language_JSON_Parser_punct({h: 2, a1: 1}), a3: () => ({h: 0, a1: {h: 4, a1: vals}})})}})};
});

function Language_JSON_Tokens_tokValue_TokenKind_JSONTokenKind($0, $1) {
 switch($0.h) {
  case 0: return Prelude_EqOrd_x3dx3d_Eq_String($1, 'true');
  case 1: return Prelude_Cast_cast_Cast_String_Double($1);
  case 2: return Language_JSON_String_stringValue($1);
  case 3: return undefined;
  case 4: return undefined;
  case 5: return undefined;
 }
}

function Language_JSON_Tokens_TokType_TokenKind_JSONTokenKind($0) {
 switch($0.h) {
  case 0: return {h: 'Prelude.Basics.Bool'};
  case 1: return {h: 'Double'};
  case 2: return {h: 'Prelude.Types.Maybe', a1: {h: 'String'}};
  case 3: return {h: 'Builtin.Unit'};
  case 4: return {h: 'Builtin.Unit'};
  case 5: return {h: 'Builtin.Unit'};
 }
}

function Language_JSON_Tokens_x3dx3d_Eq_Punctuation($0, $1) {
 switch($0.h) {
  case 0: {
   switch($1.h) {
    case 0: return 1;
    default: return 0;
   }
  }
  case 1: {
   switch($1.h) {
    case 1: return 1;
    default: return 0;
   }
  }
  case 2: {
   switch($1.h) {
    case 2: return Language_JSON_Tokens_x3dx3d_Eq_Bracket($0.a1, $1.a1);
    default: return 0;
   }
  }
  case 3: {
   switch($1.h) {
    case 3: return Language_JSON_Tokens_x3dx3d_Eq_Bracket($0.a1, $1.a1);
    default: return 0;
   }
  }
  default: return 0;
 }
}

function Language_JSON_Tokens_x3dx3d_Eq_JSONTokenKind($0, $1) {
 switch($0.h) {
  case 0: {
   switch($1.h) {
    case 0: return 1;
    default: return 0;
   }
  }
  case 1: {
   switch($1.h) {
    case 1: return 1;
    default: return 0;
   }
  }
  case 2: {
   switch($1.h) {
    case 2: return 1;
    default: return 0;
   }
  }
  case 3: {
   switch($1.h) {
    case 3: return 1;
    default: return 0;
   }
  }
  case 4: {
   switch($1.h) {
    case 4: return Language_JSON_Tokens_x3dx3d_Eq_Punctuation($0.a1, $1.a1);
    default: return 0;
   }
  }
  default: return 0;
 }
}

function Language_JSON_Tokens_x3dx3d_Eq_Bracket($0, $1) {
 switch($0) {
  case 0: {
   switch($1) {
    case 0: return 1;
    default: return 0;
   }
  }
  case 1: {
   switch($1) {
    case 1: return 1;
    default: return 0;
   }
  }
  default: return 0;
 }
}

function Language_JSON_Tokens_x2fx3d_Eq_JSONTokenKind($0, $1) {
 switch(Language_JSON_Tokens_x3dx3d_Eq_JSONTokenKind($0, $1)) {
  case 1: return 0;
  case 0: return 1;
 }
}

function Language_JSON_Tokens_ignored($0) {
 switch($0.h) {
  case undefined: {
   switch($0.a1.h) {
    case undefined: {
     switch($0.a1.a1.h) {
      case 5: return 1;
      default: return 0;
     }
    }
    default: return 0;
   }
  }
  default: return 0;
 }
}

function Language_JSON_String_stringValue($0) {
 return Prelude_Types_x3ex3ex3d_Monad_Maybe(Language_JSON_String_Lexer_lexString($0), $6 => Language_JSON_String_Parser_parseString($6));
}

const Language_JSON_String_permissiveStringLit = __lazy(function () {
 return {h: 4, a1: {h: 4, a1: Language_JSON_String_Lexer_quo(), a2: () => Text_Lexer_manyUntil(Language_JSON_String_Lexer_quo(), Text_Lexer_Core_x3cx7cx3e(Language_JSON_String_Lexer_esc(Text_Lexer_any()), Text_Lexer_any()))}, a2: () => Text_Lexer_opt(Language_JSON_String_Lexer_quo())};
});

function Text_Lexer_toTokenMap($0) {
 return Prelude_Types_map_Functor_List($3 => ({a1: $3.a1, a2: $7 => ({a1: $3.a2, a2: $7})}), $0);
}

const Text_Lexer_spaces = __lazy(function () {
 return Text_Lexer_some(Text_Lexer_space());
});

const Text_Lexer_space = __lazy(function () {
 return Text_Lexer_Core_pred($2 => Prelude_Types_isSpace($2));
});

function Text_Lexer_some($0) {
 return {h: 4, a1: $0, a2: () => Text_Lexer_many($0)};
}

function Text_Lexer_range($0, $1) {
 const $3 = x => {
  switch(Prelude_EqOrd_x3ex3d_Ord_Char(x, Prelude_EqOrd_min_Ord_Char($0, $1))) {
   case 1: return Prelude_EqOrd_x3cx3d_Ord_Char(x, Prelude_EqOrd_max_Ord_Char($0, $1));
   case 0: return 0;
  }
 };
 return Text_Lexer_Core_pred($3);
}

function Text_Lexer_opt($0) {
 return Text_Lexer_Core_x3cx7cx3e($0, Text_Lexer_Core_empty());
}

function Text_Lexer_oneOf($0) {
 return Text_Lexer_Core_pred(x => Prelude_Types_elem(csegen_16(), csegen_328(), x, Prelude_Types_fastUnpack($0)));
}

function Text_Lexer_non($0) {
 return {h: 5, a1: Text_Lexer_Core_reject($0), a2: Text_Lexer_any()};
}

function Text_Lexer_manyUntil($0, $1) {
 return Text_Lexer_many({h: 5, a1: Text_Lexer_Core_reject($0), a2: $1});
}

function Text_Lexer_many($0) {
 return Text_Lexer_opt(Text_Lexer_some($0));
}

function Text_Lexer_like($0) {
 return Text_Lexer_Core_pred(y => Prelude_EqOrd_x3dx3d_Eq_Char(Prelude_Types_toUpper($0), Prelude_Types_toUpper(y)));
}

function Text_Lexer_is($0) {
 return Text_Lexer_Core_pred($3 => Prelude_EqOrd_x3dx3d_Eq_Char($3, $0));
}

const Text_Lexer_hexDigit = __lazy(function () {
 return Text_Lexer_Core_pred($2 => Prelude_Types_isHexDigit($2));
});

function Text_Lexer_exact($0) {
 const $1 = Prelude_Types_fastUnpack($0);
 switch($1.h) {
  case 0: return Text_Lexer_Core_fail();
  case undefined: return Text_Lexer_Core_concatMap($7 => Text_Lexer_is($7), {a1: $1.a1, a2: $1.a2});
 }
}

function Text_Lexer_escape($0, $1) {
 return {h: 4, a1: $0, a2: () => $1};
}

const Text_Lexer_digits = __lazy(function () {
 return Text_Lexer_some(Text_Lexer_digit());
});

const Text_Lexer_digit = __lazy(function () {
 return Text_Lexer_Core_pred($2 => Prelude_Types_isDigit($2));
});

function Text_Lexer_count($0, $1) {
 switch($0.a1) {
  case 0n: {
   switch($0.a2.h) {
    case 0: return Text_Lexer_many($1);
    case undefined: {
     switch($0.a2.a1) {
      case 0n: return Text_Lexer_Core_empty();
      default: {
       const $9 = ($0.a2.a1-1n);
       return Text_Lexer_opt({h: 4, a1: $1, a2: () => Text_Lexer_count(Text_Quantity_atMost($9), $1)});
      }
     }
    }
   }
  }
  default: {
   const $15 = ($0.a1-1n);
   switch($0.a2.h) {
    case 0: return {h: 4, a1: $1, a2: () => Text_Lexer_count(Text_Quantity_atLeast($15), $1)};
    case undefined: {
     switch($0.a2.a1) {
      case 0n: return Text_Lexer_Core_fail();
      default: {
       const $22 = ($0.a2.a1-1n);
       return {h: 4, a1: $1, a2: () => Text_Lexer_count(Text_Quantity_between($15, $22), $1)};
      }
     }
    }
   }
  }
 }
}

const Text_Lexer_control = __lazy(function () {
 return Text_Lexer_Core_pred($2 => Prelude_Types_isControl($2));
});

const Text_Lexer_any = __lazy(function () {
 return Text_Lexer_Core_pred($2 => 1);
});

function Text_Quantity_exactly($0) {
 return {a1: $0, a2: {a1: $0}};
}

function Text_Quantity_between($0, $1) {
 return {a1: $0, a2: {a1: $1}};
}

function Text_Quantity_atMost($0) {
 return {a1: 0n, a2: {a1: $0}};
}

function Text_Quantity_atLeast($0) {
 return {a1: $0, a2: {h: 0}};
}

function Text_Lexer_Core_n__3659_2500_getCols($0, $1, $2, $3, $4, $5, $6, $7) {
 const $8 = Data_List_span($b => Prelude_EqOrd_x2fx3d_Eq_Char($b, '\n'), Prelude_Types_List_reverse($6));
 switch($8.a2.h) {
  case 0: return _add32s($7, Prelude_Cast_cast_Cast_Nat_Int(Prelude_Types_List_lengthTR($8.a1)));
  default: return Prelude_Cast_cast_Cast_Nat_Int(Prelude_Types_List_lengthTR($8.a1));
 }
}

function Text_Lexer_Core_n__3659_2499_countNLs($0, $1, $2, $3, $4, $5, $6) {
 return Prelude_Types_List_lengthTR(Prelude_Types_List_filter($b => Prelude_EqOrd_x3dx3d_Eq_Char($b, '\n'), $6));
}

function Text_Lexer_Core_scan($0, $1, $2) {
 switch($0.h) {
  case 0: return {a1: {a1: $1, a2: $2}};
  case 1: return {h: 0};
  case 2: {
   switch(Prelude_EqOrd_x3dx3d_Eq_Bool(Data_Maybe_isJust(Text_Lexer_Core_scan($0.a2, $1, $2)), $0.a1)) {
    case 1: return {a1: {a1: $1, a2: $2}};
    case 0: return {h: 0};
   }
  }
  case 3: {
   switch($2.h) {
    case 0: return {h: 0};
    case undefined: {
     switch($0.a1($2.a1)) {
      case 1: return {a1: {a1: {a1: $2.a1, a2: $1}, a2: $2.a2}};
      case 0: return {h: 0};
     }
    }
   }
  }
  case 4: return Prelude_Types_x3ex3ex3d_Monad_Maybe(Text_Lexer_Core_scan($0.a1, $1, $2), $24 => Text_Lexer_Core_scan($0.a2(), $24.a1, $24.a2));
  case 5: return Prelude_Types_x3ex3ex3d_Monad_Maybe(Text_Lexer_Core_scan($0.a1, $1, $2), $32 => Text_Lexer_Core_scan($0.a2, $32.a1, $32.a2));
  case 6: return Prelude_Types_x3ex3ex3d_Monad_Maybe(Text_Lexer_Core_scan($0.a1, $1, $2), $3f => Text_Lexer_Core_scan($0.a2, $3f.a1, $3f.a2));
  case 7: return Prelude_Types_maybe(() => Text_Lexer_Core_scan($0.a2, $1, $2), () => $4c => ({a1: $4c}), Text_Lexer_Core_scan($0.a1, $1, $2));
 }
}

function Text_Lexer_Core_reject($0) {
 return {h: 2, a1: 0, a2: $0};
}

function Text_Lexer_Core_pred($0) {
 return {h: 3, a1: $0};
}

function Text_Lexer_Core_lex($0, $1) {
 const $2 = Text_Lexer_Core_tokenise($5 => 0, 0, 0, {h: 0}, $0, Prelude_Types_fastUnpack($1));
 return {a1: $2.a1, a2: {a1: $2.a2.a1, a2: {a1: $2.a2.a2.a1, a2: Prelude_Types_fastPack($2.a2.a2.a2)}}};
}

const Text_Lexer_Core_fail = __lazy(function () {
 return {h: 1};
});

const Text_Lexer_Core_empty = __lazy(function () {
 return {h: 0};
});

function Text_Lexer_Core_concatMap($0, $1) {
 switch($1.h) {
  case 0: return {h: 0};
  case undefined: {
   switch($1.a2.h) {
    case 0: return $0($1.a1);
    case undefined: return {h: 6, a1: $0($1.a1), a2: Text_Lexer_Core_concatMap($0, $1.a2)};
   }
  }
 }
}

function Text_Lexer_Core_x3cx7cx3e($0, $1) {
 return {h: 7, a1: $0, a2: $1};
}

function Language_JSON_String_Tokens_n__3203_1166_hexVal($0, $1) {
 switch(Prelude_EqOrd_x3ex3d_Ord_Char($1, 'A')) {
  case 1: return _add32s(_sub32s(_truncInt32($1.codePointAt(0)), _truncInt32('A'.codePointAt(0))), 10);
  case 0: return _sub32s(_truncInt32($1.codePointAt(0)), _truncInt32('0'.codePointAt(0)));
 }
}

function Language_JSON_String_Tokens_tokValue_TokenKind_JSONStringTokenKind($0, $1) {
 switch($0) {
  case 0: return undefined;
  case 1: return Language_JSON_String_Tokens_charValue($1);
  case 2: return Language_JSON_String_Tokens_simpleEscapeValue($1);
  case 3: return Language_JSON_String_Tokens_unicodeEscapeValue($1);
 }
}

function Language_JSON_String_Tokens_TokType_TokenKind_JSONStringTokenKind($0) {
 switch($0) {
  case 0: return {h: 'Builtin.Unit'};
  case 1: return {h: 'Char'};
  case 2: return {h: 'Char'};
  case 3: return {h: 'Char'};
 }
}

function Language_JSON_String_Tokens_x3dx3d_Eq_JSONStringTokenKind($0, $1) {
 switch($0) {
  case 0: {
   switch($1) {
    case 0: return 1;
    default: return 0;
   }
  }
  case 1: {
   switch($1) {
    case 1: return 1;
    default: return 0;
   }
  }
  case 2: {
   switch($1) {
    case 2: return 1;
    default: return 0;
   }
  }
  case 3: {
   switch($1) {
    case 3: return 1;
    default: return 0;
   }
  }
  default: return 0;
 }
}

function Language_JSON_String_Tokens_x2fx3d_Eq_JSONStringTokenKind($0, $1) {
 switch(Language_JSON_String_Tokens_x3dx3d_Eq_JSONStringTokenKind($0, $1)) {
  case 1: return 0;
  case 0: return 1;
 }
}

function Language_JSON_String_Tokens_unicodeEscapeValue($0) {
 return Language_JSON_String_Tokens_n__3203_1167_fromHex($0, Data_List_drop(2n, Prelude_Types_fastUnpack($0)), 0);
}

function Language_JSON_String_Tokens_simpleEscapeValue($0) {
 const $1 = Data_String_Extra_index(1n, $0);
 switch($1.h) {
  case 0: return '\0';
  case undefined: {
   switch($1.a1) {
    case '\"': return '\"';
    case '\u{5c}': return '\u{5c}';
    case '/': return '/';
    case 'b': return '\u{8}';
    case 'f': return '\u{c}';
    case 'n': return '\n';
    case 'r': return '\r';
    case 't': return '\u{9}';
    default: return '\0';
   }
  }
 }
}

function Language_JSON_String_Tokens_charValue($0) {
 const $1 = Data_String_Extra_index(0n, $0);
 switch($1.h) {
  case 0: return '\0';
  case undefined: return $1.a1;
 }
}

const Language_JSON_String_Parser_stringChar = __lazy(function () {
 return {h: 12, a1: 1, a2: 1, a3: Text_Parser_match(csegen_412(), csegen_415(), 1), a4: () => ({h: 12, a1: 1, a2: 1, a3: Text_Parser_match(csegen_412(), csegen_415(), 2), a4: () => Text_Parser_match(csegen_412(), csegen_415(), 3)})};
});

const Language_JSON_String_Parser_quotedString = __lazy(function () {
 const $0 = Text_Parser_match(csegen_412(), csegen_415(), 0);
 return {h: 8, a1: 0, a2: Text_Parser_between(0, $0, $0, Text_Parser_many(Language_JSON_String_Parser_stringChar())), a3: () => chars => ({h: 11, a1: 0, a2: 0, a3: {h: 3}, a4: {h: 0, a1: Prelude_Types_fastPack(chars)}})};
});

function Language_JSON_String_Parser_parseString($0) {
 const $1 = Text_Parser_Core_parse(1, Language_JSON_String_Parser_quotedString(), $0);
 switch($1.h) {
  case 1: {
   switch($1.a1.h) {
    case undefined: {
     switch($1.a1.a2.h) {
      case 0: return {a1: $1.a1.a1};
      default: return {h: 0};
     }
    }
    default: return {h: 0};
   }
  }
  default: return {h: 0};
 }
}

function Text_Parser_some($0) {
 return {h: 8, a1: 0, a2: $0, a3: () => $4 => ({h: 9, a1: 0, a2: 0, a3: Text_Parser_many($0), a4: $b => ({h: 0, a1: {a1: $4, a2: $b}})})};
}

function Text_Parser_sepBy1($0, $1, $2) {
 return {h: 9, a1: $0, a2: 0, a3: {h: 9, a1: 0, a2: $0, a3: {h: 0, a1: $a => $b => ({a1: $a, a2: $b})}, a4: f => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, f, $2)}, a4: f => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(0, f, Text_Parser_many({h: 9, a1: 1, a2: $0, a3: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, $20 => $21 => $21, $1), a4: $24 => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, $24, $2)}))};
}

function Text_Parser_sepBy($0, $1, $2) {
 return Text_Parser_option($0, {h: 0}, Prelude_Interfaces_x3cx24x3e($9 => $a => $b => $c => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, $b, $c), $12 => Data_List1_forget($12), Text_Parser_sepBy1($0, $1, $2)));
}

function Text_Parser_option($0, $1, $2) {
 switch($0) {
  case 0: return {h: 12, a1: 0, a2: 0, a3: $2, a4: () => ({h: 0, a1: $1})};
  case 1: return {h: 12, a1: 1, a2: 0, a3: $2, a4: () => ({h: 0, a1: $1})};
 }
}

function Text_Parser_match($0, $1, $2) {
 const $4 = t => {
  switch($1.a1(t.a1)($2)) {
   case 1: return {a1: $0.a2($2)(t.a2)};
   case 0: return {h: 0};
  }
 };
 return {h: 1, a1: 'Unrecognised input', a2: $4};
}

function Text_Parser_many($0) {
 return Text_Parser_option(1, {h: 0}, Prelude_Interfaces_x3cx24x3e($7 => $8 => $9 => $a => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, $9, $a), $10 => Data_List1_forget($10), Text_Parser_some($0)));
}

function Text_Parser_between($0, $1, $2, $3) {
 return {h: 9, a1: 1, a2: 1, a3: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, $a => $b => $a, {h: 9, a1: 1, a2: $0, a3: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, $13 => $14 => $14, $1), a4: f => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, f, $3)}), a4: f => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29(1, f, $2)};
}

function Text_Parser_Core_case__doParse_5194($0, $1, $2, $3, $4, $5) {
 switch($5.h) {
  case 0: return {h: 0, a1: $5.a1, a2: $5.a2, a3: $5.a3};
  case 1: return {h: 1, a1: $5.a1, a2: $5.a2, a3: Prelude_Interfaces_x3cx24x3e(csegen_431(), $11 => $5.a3, $5.a3), a4: $5.a4};
 }
}

function Text_Parser_Core_case__doParse_4881($0, $1, $2, $3, $4, $5, $6, $7) {
 switch($7.h) {
  case 0: return {h: 0, a1: $7.a1, a2: $7.a2, a3: $7.a3};
  case 1: return Text_Parser_Core_mergeWith($7.a3, Text_Parser_Core_doParse($0, $7.a1, $7.a2, $3()($7.a3.a1), $7.a4));
 }
}

function Text_Parser_Core_case__doParse_4767($0, $1, $2, $3, $4, $5, $6, $7, $8) {
 switch($8.h) {
  case 0: return {h: 0, a1: $8.a1, a2: $8.a2, a3: $8.a3};
  case 1: return Text_Parser_Core_mergeWith($8.a3, Text_Parser_Core_doParse($0, $8.a1, $8.a2, $4($8.a3.a1), $8.a4));
 }
}

function Text_Parser_Core_case__casex20blockx20inx20casex20blockx20inx20doParse_4529($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $a, $b) {
 switch($b.h) {
  case 0: {
   let $d;
   switch($b.a1) {
    case 1: {
     $d = 1;
     break;
    }
    case 0: {
     $d = $b.a2;
     break;
    }
   }
   switch($d) {
    case 1: return {h: 0, a1: $b.a1, a2: $b.a2, a3: $b.a3};
    case 0: return {h: 0, a1: 0, a2: 0, a3: Data_List1_x2bx2b($7, $b.a3)};
   }
  }
  case 1: return {h: 1, a1: $b.a1, a2: $6, a3: $b.a3, a4: $b.a4};
 }
}

function Text_Parser_Core_case__doParse_4413($0, $1, $2, $3, $4, $5, $6, $7, $8) {
 switch($8.h) {
  case 0: {
   let $a;
   switch($8.a1) {
    case 1: {
     $a = 1;
     break;
    }
    case 0: {
     $a = $8.a2;
     break;
    }
   }
   switch($a) {
    case 1: return {h: 0, a1: $7, a2: $8.a2, a3: $8.a3};
    case 0: return Text_Parser_Core_case__casex20blockx20inx20casex20blockx20inx20doParse_4529($0, $2, $3, $4, $5, $6, $7, $8.a3, $8.a2, $8.a1, $1, Text_Parser_Core_doParse($0, $1, 0, $3(), $6));
   }
  }
  case 1: return {h: 1, a1: $8.a1, a2: $7, a3: $8.a3, a4: $8.a4};
 }
}

function Text_Parser_Core_case__doParse_4048($0, $1, $2, $3, $4, $5) {
 switch($5.h) {
  case 0: return {h: 0, a1: $5.a1, a2: 1, a3: $5.a3};
  default: return $5;
 }
}

function Text_Parser_Core_case__doParse_3951($0, $1, $2, $3, $4, $5) {
 switch($5.h) {
  case 0: return {h: 0, a1: $5.a1, a2: 0, a3: $5.a3};
  default: return $5;
 }
}

function Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, $1, $2) {
 switch($0) {
  case 0: {
   switch($2.h) {
    case 0: return {h: 0, a1: $1($2.a1)};
    default: {
     switch($2.h) {
      case 4: return {h: 4, a1: $2.a1, a2: $2.a2, a3: $2.a3};
      case 5: return {h: 5, a1: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, $1, $2.a1)};
      case 7: return {h: 7, a1: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, $1, $2.a1)};
      default: {
       switch($0) {
        case 1: {
         switch($2.h) {
          case 1: return {h: 1, a1: $2.a1, a2: $1a => Prelude_Types_map_Functor_Maybe($1, $2.a2($1a))};
          default: {
           switch($2.h) {
            case 12: return {h: 12, a1: $2.a1, a2: $2.a2, a3: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3), a4: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4())};
            default: {
             switch($0) {
              case 1: {
               switch($2.h) {
                case 8: return {h: 8, a1: $2.a1, a2: $2.a2, a3: () => val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3()(val))};
                default: {
                 switch($2.h) {
                  case 9: return {h: 9, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4(val))};
                  default: {
                   switch($0) {
                    case 1: {
                     switch($2.h) {
                      case 10: return {h: 10, a1: $2.a1, a2: $2.a2, a3: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3())};
                      default: {
                       switch($2.h) {
                        case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                        case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $5d => ({h: 0, a1: $1($5d)})};
                        default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $65 => ({h: 0, a1: $1($65)})};
                       }
                      }
                     }
                    }
                    default: {
                     switch($2.h) {
                      case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                      case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $77 => ({h: 0, a1: $1($77)})};
                      default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $7f => ({h: 0, a1: $1($7f)})};
                     }
                    }
                   }
                  }
                 }
                }
               }
              }
              default: {
               switch($2.h) {
                case 9: return {h: 9, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4(val))};
                default: {
                 switch($0) {
                  case 1: {
                   switch($2.h) {
                    case 10: return {h: 10, a1: $2.a1, a2: $2.a2, a3: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3())};
                    default: {
                     switch($2.h) {
                      case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                      case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $a6 => ({h: 0, a1: $1($a6)})};
                      default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $ae => ({h: 0, a1: $1($ae)})};
                     }
                    }
                   }
                  }
                  default: {
                   switch($2.h) {
                    case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                    case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $c0 => ({h: 0, a1: $1($c0)})};
                    default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $c8 => ({h: 0, a1: $1($c8)})};
                   }
                  }
                 }
                }
               }
              }
             }
            }
           }
          }
         }
        }
        default: {
         switch($2.h) {
          case 12: return {h: 12, a1: $2.a1, a2: $2.a2, a3: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3), a4: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4())};
          default: {
           switch($0) {
            case 1: {
             switch($2.h) {
              case 8: return {h: 8, a1: $2.a1, a2: $2.a2, a3: () => val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3()(val))};
              default: {
               switch($2.h) {
                case 9: return {h: 9, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4(val))};
                default: {
                 switch($0) {
                  case 1: {
                   switch($2.h) {
                    case 10: return {h: 10, a1: $2.a1, a2: $2.a2, a3: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3())};
                    default: {
                     switch($2.h) {
                      case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                      case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $109 => ({h: 0, a1: $1($109)})};
                      default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $111 => ({h: 0, a1: $1($111)})};
                     }
                    }
                   }
                  }
                  default: {
                   switch($2.h) {
                    case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                    case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $123 => ({h: 0, a1: $1($123)})};
                    default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $12b => ({h: 0, a1: $1($12b)})};
                   }
                  }
                 }
                }
               }
              }
             }
            }
            default: {
             switch($2.h) {
              case 9: return {h: 9, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4(val))};
              default: {
               switch($0) {
                case 1: {
                 switch($2.h) {
                  case 10: return {h: 10, a1: $2.a1, a2: $2.a2, a3: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3())};
                  default: {
                   switch($2.h) {
                    case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                    case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $152 => ({h: 0, a1: $1($152)})};
                    default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $15a => ({h: 0, a1: $1($15a)})};
                   }
                  }
                 }
                }
                default: {
                 switch($2.h) {
                  case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                  case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $16c => ({h: 0, a1: $1($16c)})};
                  default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $174 => ({h: 0, a1: $1($174)})};
                 }
                }
               }
              }
             }
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
  default: {
   switch($2.h) {
    case 4: return {h: 4, a1: $2.a1, a2: $2.a2, a3: $2.a3};
    case 5: return {h: 5, a1: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, $1, $2.a1)};
    case 7: return {h: 7, a1: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($0, $1, $2.a1)};
    default: {
     switch($0) {
      case 1: {
       switch($2.h) {
        case 1: return {h: 1, a1: $2.a1, a2: $18a => Prelude_Types_map_Functor_Maybe($1, $2.a2($18a))};
        default: {
         switch($2.h) {
          case 12: return {h: 12, a1: $2.a1, a2: $2.a2, a3: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3), a4: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4())};
          default: {
           switch($0) {
            case 1: {
             switch($2.h) {
              case 8: return {h: 8, a1: $2.a1, a2: $2.a2, a3: () => val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3()(val))};
              default: {
               switch($2.h) {
                case 9: return {h: 9, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4(val))};
                default: {
                 switch($0) {
                  case 1: {
                   switch($2.h) {
                    case 10: return {h: 10, a1: $2.a1, a2: $2.a2, a3: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3())};
                    default: {
                     switch($2.h) {
                      case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                      case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $1cd => ({h: 0, a1: $1($1cd)})};
                      default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $1d5 => ({h: 0, a1: $1($1d5)})};
                     }
                    }
                   }
                  }
                  default: {
                   switch($2.h) {
                    case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                    case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $1e7 => ({h: 0, a1: $1($1e7)})};
                    default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $1ef => ({h: 0, a1: $1($1ef)})};
                   }
                  }
                 }
                }
               }
              }
             }
            }
            default: {
             switch($2.h) {
              case 9: return {h: 9, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4(val))};
              default: {
               switch($0) {
                case 1: {
                 switch($2.h) {
                  case 10: return {h: 10, a1: $2.a1, a2: $2.a2, a3: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3())};
                  default: {
                   switch($2.h) {
                    case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                    case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $216 => ({h: 0, a1: $1($216)})};
                    default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $21e => ({h: 0, a1: $1($21e)})};
                   }
                  }
                 }
                }
                default: {
                 switch($2.h) {
                  case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                  case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $230 => ({h: 0, a1: $1($230)})};
                  default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $238 => ({h: 0, a1: $1($238)})};
                 }
                }
               }
              }
             }
            }
           }
          }
         }
        }
       }
      }
      default: {
       switch($2.h) {
        case 12: return {h: 12, a1: $2.a1, a2: $2.a2, a3: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3), a4: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4())};
        default: {
         switch($0) {
          case 1: {
           switch($2.h) {
            case 8: return {h: 8, a1: $2.a1, a2: $2.a2, a3: () => val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3()(val))};
            default: {
             switch($2.h) {
              case 9: return {h: 9, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4(val))};
              default: {
               switch($0) {
                case 1: {
                 switch($2.h) {
                  case 10: return {h: 10, a1: $2.a1, a2: $2.a2, a3: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3())};
                  default: {
                   switch($2.h) {
                    case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                    case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $279 => ({h: 0, a1: $1($279)})};
                    default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $281 => ({h: 0, a1: $1($281)})};
                   }
                  }
                 }
                }
                default: {
                 switch($2.h) {
                  case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                  case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $293 => ({h: 0, a1: $1($293)})};
                  default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $29b => ({h: 0, a1: $1($29b)})};
                 }
                }
               }
              }
             }
            }
           }
          }
          default: {
           switch($2.h) {
            case 9: return {h: 9, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: val => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4(val))};
            default: {
             switch($0) {
              case 1: {
               switch($2.h) {
                case 10: return {h: 10, a1: $2.a1, a2: $2.a2, a3: () => Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a1, $1, $2.a3())};
                default: {
                 switch($2.h) {
                  case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                  case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $2c2 => ({h: 0, a1: $1($2c2)})};
                  default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $2ca => ({h: 0, a1: $1($2ca)})};
                 }
                }
               }
              }
              default: {
               switch($2.h) {
                case 11: return {h: 11, a1: $2.a1, a2: $2.a2, a3: $2.a3, a4: Text_Parser_Core_map_Functor_x28x28x28Grammarx20x24statex29x20x24tokx29x20x24cx29($2.a2, $1, $2.a4)};
                case 13: return {h: 9, a1: $0, a2: 0, a3: {h: 13, a1: $2.a1}, a4: $2dc => ({h: 0, a1: $1($2dc)})};
                default: return {h: 9, a1: 0, a2: 0, a3: $2, a4: $2e4 => ({h: 0, a1: $1($2e4)})};
               }
              }
             }
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
 }
}

function Text_Parser_Core_parse($0, $1, $2) {
 const $3 = Text_Parser_Core_doParse($6 => $7 => (undefined), undefined, 0, $1, $2);
 switch($3.h) {
  case 0: return {h: 0, a1: $3.a3};
  case 1: return {h: 1, a1: {a1: $3.a3.a1, a2: $3.a4}};
 }
}

function Text_Parser_Core_mergeWith($0, $1) {
 switch($1.h) {
  case 1: return {h: 1, a1: $1.a1, a2: $1.a2, a3: Text_Bounded_mergeBounds($0, $1.a3), a4: $1.a4};
  default: return $1;
 }
}

function Text_Parser_Core_doParse($0, $1, $2, $3, $4) {
 switch($3.h) {
  case 0: return {h: 1, a1: $1, a2: $2, a3: Text_Bounded_irrelevantBounds($3.a1), a4: $4};
  case 4: return {h: 0, a1: $2, a2: $3.a2, a3: {a1: {a1: $3.a3, a2: Prelude_Types_x3cx7cx3e_Alternative_Maybe($3.a1, () => Prelude_Interfaces_x3cx24x3e(csegen_434(), $19 => $19.a3, Data_List_headx27($4)))}, a2: {h: 0}}};
  case 5: return Text_Parser_Core_case__doParse_3951($0, $1, $3.a1, $4, $2, Text_Parser_Core_doParse($0, $1, $2, $3.a1, $4));
  case 6: return {h: 1, a1: $1, a2: 1, a3: Text_Bounded_irrelevantBounds(undefined), a4: $4};
  case 7: return Text_Parser_Core_case__doParse_4048($0, $1, $3.a1, $4, $2, Text_Parser_Core_doParse($0, $1, $2, $3.a1, $4));
  case 1: {
   switch($4.h) {
    case 0: return {h: 0, a1: $2, a2: 0, a3: csegen_436()};
    case undefined: {
     const $44 = $3.a2($4.a1.a1);
     switch($44.h) {
      case 0: return {h: 0, a1: $2, a2: 0, a3: {a1: {a1: $3.a1, a2: {a1: $4.a1.a3}}, a2: {h: 0}}};
      case undefined: return {h: 1, a1: $1, a2: $2, a3: Prelude_Interfaces_x3cx24x3e(csegen_431(), $58 => $44.a1, $4.a1), a4: $4.a2};
     }
    }
   }
  }
  case 3: {
   switch($4.h) {
    case 0: return {h: 1, a1: $1, a2: $2, a3: Text_Bounded_irrelevantBounds(undefined), a4: {h: 0}};
    case undefined: return {h: 0, a1: $2, a2: 0, a3: {a1: {a1: 'Expected end of input', a2: {a1: $4.a1.a3}}, a2: {h: 0}}};
   }
  }
  case 2: {
   switch($4.h) {
    case 0: return {h: 0, a1: $2, a2: 0, a3: csegen_436()};
    case undefined: {
     switch($3.a2($4.a1.a1)) {
      case 1: return {h: 1, a1: $1, a2: $2, a3: Text_Bounded_removeIrrelevance($4.a1), a4: {a1: $4.a1, a2: $4.a2}};
      case 0: return {h: 0, a1: $2, a2: 0, a3: {a1: {a1: $3.a1, a2: {a1: $4.a1.a3}}, a2: {h: 0}}};
     }
    }
   }
  }
  case 12: return Text_Parser_Core_case__doParse_4413($0, $1, $3.a2, $3.a4, $3.a1, $3.a3, $4, $2, Text_Parser_Core_doParse($0, $1, 0, $3.a3, $4));
  case 9: return Text_Parser_Core_case__doParse_4767($0, $3.a1, $3.a2, $1, $3.a4, $3.a3, $4, $2, Text_Parser_Core_doParse($0, $1, $2, $3.a3, $4));
  case 8: return Text_Parser_Core_case__doParse_4881($0, $3.a1, $1, $3.a3, $3.a2, $4, $2, Text_Parser_Core_doParse($0, $1, $2, $3.a2, $4));
  case 11: {
   const $b4 = Text_Parser_Core_doParse($0, $1, $2, $3.a3, $4);
   switch($b4.h) {
    case 0: return {h: 0, a1: $b4.a1, a2: $b4.a2, a3: $b4.a3};
    case 1: return Text_Parser_Core_mergeWith($b4.a3, Text_Parser_Core_doParse($0, $b4.a1, $b4.a2, $3.a4, $b4.a4));
   }
  }
  case 10: {
   const $c7 = Text_Parser_Core_doParse($0, $1, $2, $3.a2, $4);
   switch($c7.h) {
    case 0: return {h: 0, a1: $c7.a1, a2: $c7.a2, a3: $c7.a3};
    case 1: return Text_Parser_Core_mergeWith($c7.a3, Text_Parser_Core_doParse($0, $c7.a1, $c7.a2, $3.a3(), $c7.a4));
   }
  }
  case 13: return Text_Parser_Core_case__doParse_5194($0, $1, $3.a1, $4, $2, Text_Parser_Core_doParse($0, $1, $2, $3.a1, $4));
  case 14: {
   switch($4.h) {
    case 0: return {h: 0, a1: $2, a2: 0, a3: csegen_436()};
    case undefined: return {h: 1, a1: $1, a2: $2, a3: Text_Bounded_irrelevantBounds($4.a1.a3), a4: {a1: $4.a1, a2: $4.a2}};
   }
  }
  case 15: return {h: 1, a1: $0($1)($3.a1), a2: $2, a3: Text_Bounded_irrelevantBounds(undefined), a4: $4};
 }
}

const Language_JSON_String_Lexer_unicodeEscape = __lazy(function () {
 return Language_JSON_String_Lexer_esc({h: 4, a1: Text_Lexer_is('u'), a2: () => Text_Lexer_count(Text_Quantity_exactly(4n), Text_Lexer_hexDigit())});
});

const Language_JSON_String_Lexer_simpleEscape = __lazy(function () {
 return Language_JSON_String_Lexer_esc(Text_Lexer_oneOf('\"\u{5c}/bfnrt'));
});

const Language_JSON_String_Lexer_quo = __lazy(function () {
 return Text_Lexer_is('\"');
});

function Language_JSON_String_Lexer_lexString($0) {
 const $1 = Text_Lexer_Core_lex(Language_JSON_String_Lexer_jsonStringTokenMap(), $0);
 switch($1.h) {
  case undefined: {
   switch($1.a2.h) {
    case undefined: {
     switch($1.a2.a2.h) {
      case undefined: {
       switch($1.a2.a2.a2) {
        case '': return {a1: $1.a1};
        default: return {h: 0};
       }
      }
      default: return {h: 0};
     }
    }
    default: return {h: 0};
   }
  }
  default: return {h: 0};
 }
}

const Language_JSON_String_Lexer_legalChar = __lazy(function () {
 return Text_Lexer_non(Text_Lexer_Core_x3cx7cx3e(Language_JSON_String_Lexer_quo(), Text_Lexer_Core_x3cx7cx3e(Text_Lexer_is('\u{5c}'), Text_Lexer_control())));
});

const Language_JSON_String_Lexer_jsonStringTokenMap = __lazy(function () {
 return Text_Lexer_toTokenMap({a1: {a1: Language_JSON_String_Lexer_quo(), a2: 0}, a2: {a1: {a1: Language_JSON_String_Lexer_unicodeEscape(), a2: 3}, a2: {a1: {a1: Language_JSON_String_Lexer_simpleEscape(), a2: 2}, a2: {a1: {a1: Language_JSON_String_Lexer_legalChar(), a2: 1}, a2: {h: 0}}}}});
});

function Language_JSON_String_Lexer_esc($0) {
 return Text_Lexer_escape(Text_Lexer_is('\u{5c}'), $0);
}

const Language_JSON_Lexer_numberLit = __lazy(function () {
 const $0 = Text_Lexer_is('-');
 const $3 = Text_Lexer_Core_x3cx7cx3e(Text_Lexer_is('0'), {h: 4, a1: Text_Lexer_range('1', '9'), a2: () => Text_Lexer_many(Text_Lexer_digit())});
 const $11 = {h: 4, a1: Text_Lexer_is('.'), a2: () => Text_Lexer_digits()};
 const $17 = {h: 4, a1: {h: 4, a1: Text_Lexer_like('e'), a2: () => Text_Lexer_opt(Text_Lexer_oneOf('+-'))}, a2: () => Text_Lexer_digits()};
 return {h: 4, a1: {h: 4, a1: {h: 5, a1: Text_Lexer_opt($0), a2: $3}, a2: () => Text_Lexer_opt($11)}, a2: () => Text_Lexer_opt($17)};
});

function Language_JSON_Lexer_lexJSON($0) {
 const $1 = Text_Lexer_Core_lex(Language_JSON_Lexer_jsonTokenMap(), $0);
 switch($1.h) {
  case undefined: {
   switch($1.a2.h) {
    case undefined: {
     switch($1.a2.a2.h) {
      case undefined: {
       switch($1.a2.a2.a2) {
        case '': return {a1: $1.a1};
        default: return {h: 0};
       }
      }
      default: return {h: 0};
     }
    }
    default: return {h: 0};
   }
  }
  default: return {h: 0};
 }
}

const Language_JSON_Lexer_jsonTokenMap = __lazy(function () {
 return Text_Lexer_toTokenMap({a1: {a1: Text_Lexer_spaces(), a2: {h: 5}}, a2: {a1: {a1: Text_Lexer_is(','), a2: {h: 4, a1: {h: 0}}}, a2: {a1: {a1: Text_Lexer_is(':'), a2: {h: 4, a1: {h: 1}}}, a2: {a1: {a1: Text_Lexer_is('['), a2: {h: 4, a1: {h: 2, a1: 0}}}, a2: {a1: {a1: Text_Lexer_is(']'), a2: {h: 4, a1: {h: 2, a1: 1}}}, a2: {a1: {a1: Text_Lexer_is('{'), a2: {h: 4, a1: {h: 3, a1: 0}}}, a2: {a1: {a1: Text_Lexer_is('}'), a2: {h: 4, a1: {h: 3, a1: 1}}}, a2: {a1: {a1: Text_Lexer_exact('null'), a2: {h: 3}}, a2: {a1: {a1: Text_Lexer_Core_x3cx7cx3e(Text_Lexer_exact('true'), Text_Lexer_exact('false')), a2: {h: 0}}, a2: {a1: {a1: Language_JSON_Lexer_numberLit(), a2: {h: 1}}, a2: {a1: {a1: Language_JSON_String_permissiveStringLit(), a2: {h: 2}}, a2: {h: 0}}}}}}}}}}}});
});

function Generics_Meta_n__4838_4059_showRecord($0, $1, $2, $3, $4, $5) {
 const $6 = Data_SOP_Interfaces_hliftA3({a1: csegen_485(), a2: csegen_485()}, $e => $f => $10 => $11 => Generics_Meta_n__4838_4058_showNamed($0, $1, $2, $3, $f, $10, $11), $0, $5, $1);
 const $1d = Data_List_intersperse(', ', Data_SOP_NP_collapseNP($6));
 return Prelude_Show_showCon($3, $4, (' { '+(Prelude_Interfaces_concat(csegen_1(), csegen_16(), $1d)+' }')));
}

function Generics_Meta_n__4838_4060_showOther($0, $1, $2, $3, $4) {
 const $5 = Data_SOP_Interfaces_hconcat({a1: csegen_1(), a2: csegen_495()}, Data_SOP_Interfaces_hcmap(csegen_485(), $0, $12 => $13 => $14 => Prelude_Show_showArg($13, $14), $1));
 return Prelude_Show_showCon($3, $4, $5);
}

function Generics_Meta_n__4838_4058_showNamed($0, $1, $2, $3, $4, $5, $6) {
 return ($5+(' = '+$4.a1($6)));
}

function Generics_Meta_wrapOperator($0) {
 switch(Generics_Meta_isOperator($0)) {
  case 1: return ('('+($0+')'));
  case 0: return $0;
 }
}

function Generics_Meta_showSOP($0, $1, $2, $3) {
 const $12 = acc => el => ks => $13 => $14 => $15 => {
  switch($15.h) {
   case 0: return $13($15.a1)($14);
   case 1: {
    switch($15.a1.h) {
     case 0: return $13($15.a1.a1)($14);
     case 1: {
      switch($15.a1.a1.h) {
       case 0: return $13($15.a1.a1.a1)($14);
       case 1: {
        switch($15.a1.a1.a1.h) {
         case 0: return $13($15.a1.a1.a1.a1)($14);
         case 1: {
          switch($15.a1.a1.a1.a1.h) {
           case 0: return $13($15.a1.a1.a1.a1.a1)($14);
           case 1: {
            switch($15.a1.a1.a1.a1.a1.h) {
             case 0: return $13($15.a1.a1.a1.a1.a1.a1)($14);
             case 1: {
              switch($15.a1.a1.a1.a1.a1.a1.h) {
               case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1)($14);
               case 1: {
                switch($15.a1.a1.a1.a1.a1.a1.a1.h) {
                 case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                 case 1: {
                  switch($15.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                   case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                   case 1: {
                    switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                     case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                     case 1: {
                      switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                       case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                       case 1: {
                        switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                         case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                         case 1: {
                          switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                           case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                           case 1: {
                            switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                             case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                             case 1: {
                              switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                               case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                               case 1: {
                                switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                 case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                 case 1: {
                                  switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                   case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                   case 1: {
                                    switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                     case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                     case 1: {
                                      switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                       case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                       case 1: {
                                        switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                         case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                         case 1: {
                                          switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                           case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                           case 1: {
                                            switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                             case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                             case 1: {
                                              switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                               case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                               case 1: {
                                                switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                 case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                 case 1: {
                                                  switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                   case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                   case 1: {
                                                    switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                     case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                     case 1: {
                                                      switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                       case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                       case 1: {
                                                        switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                         case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                         case 1: {
                                                          switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                           case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                           case 1: {
                                                            switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                             case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                             case 1: {
                                                              switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                               case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                               case 1: {
                                                                switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                 case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                 case 1: {
                                                                  switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                   case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                   case 1: {
                                                                    switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                     case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                     case 1: {
                                                                      switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                       case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                       case 1: {
                                                                        switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                         case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                         case 1: {
                                                                          switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                           case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                           case 1: {
                                                                            switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                             case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                             case 1: {
                                                                              switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                               case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                               case 1: {
                                                                                switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                                 case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                                 case 1: {
                                                                                  switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                                   case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                                   case 1: {
                                                                                    switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                                     case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                                     case 1: {
                                                                                      switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                                       case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                                       case 1: {
                                                                                        switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                                         case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                                         case 1: {
                                                                                          switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                                           case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                                           case 1: {
                                                                                            switch($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.h) {
                                                                                             case 0: return $13($15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1)($14);
                                                                                             case 1: return Data_SOP_NS_foldrNS($13, $14, $15.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1.a1);
                                                                                            }
                                                                                           }
                                                                                          }
                                                                                         }
                                                                                        }
                                                                                       }
                                                                                      }
                                                                                     }
                                                                                    }
                                                                                   }
                                                                                  }
                                                                                 }
                                                                                }
                                                                               }
                                                                              }
                                                                             }
                                                                            }
                                                                           }
                                                                          }
                                                                         }
                                                                        }
                                                                       }
                                                                      }
                                                                     }
                                                                    }
                                                                   }
                                                                  }
                                                                 }
                                                                }
                                                               }
                                                              }
                                                             }
                                                            }
                                                           }
                                                          }
                                                         }
                                                        }
                                                       }
                                                      }
                                                     }
                                                    }
                                                   }
                                                  }
                                                 }
                                                }
                                               }
                                              }
                                             }
                                            }
                                           }
                                          }
                                         }
                                        }
                                       }
                                      }
                                     }
                                    }
                                   }
                                  }
                                 }
                                }
                               }
                              }
                             }
                            }
                           }
                          }
                         }
                        }
                       }
                      }
                     }
                    }
                   }
                  }
                 }
                }
               }
              }
             }
            }
           }
          }
         }
        }
       }
      }
     }
    }
   }
  }
 };
 const $9 = {a1: el => acc => ks => $b => $c => $d => Data_SOP_NS_foldlNS($b, $c, $d), a2: $12};
 const $6 = {a1: csegen_1(), a2: $9};
 return Data_SOP_Interfaces_hconcat($6, Data_SOP_Interfaces_hliftA3({a1: csegen_485(), a2: {a1: csegen_506(), a2: f => g => ks => fun => $109 => Data_SOP_NS_mapNS($10c => fun(undefined), $109), a3: f => g => ks => $111 => $112 => Data_SOP_NS_hapNS($111, $112)}}, $117 => $118 => $119 => $11a => Generics_Meta_showC($118, $1, $119, $11a), $0, $2.a3, $3));
}

function Generics_Meta_showC($0, $1, $2, $3) {
 switch($3.h) {
  case 0: return $2.a2;
  default: {
   const $6 = Generics_Meta_wrapOperator($2.a2);
   return Prelude_Types_maybe(() => Generics_Meta_n__4838_4060_showOther($0, $3, $2, $1, $6), () => $13 => Generics_Meta_n__4838_4059_showRecord($0, $3, $2, $1, $6, $13), Generics_Meta_argNames($2));
  }
 }
}

function Generics_Meta_metaFor($0) {
 return $0.a2;
}

function Generics_Meta_isOperator($0) {
 const $4 = $5 => {
  switch(Prelude_Types_isAlphaNum($5)) {
   case 1: return 0;
   case 0: return 1;
  }
 };
 return Prelude_Interfaces_all(csegen_16(), $4, Prelude_Types_fastUnpack($0));
}

function Generics_Meta_getName($0) {
 switch($0.h) {
  case 0: return {a1: $0.a2};
  case 1: return {h: 0};
 }
}

function Generics_Meta_genShowPrec($0, $1, $2, $3) {
 return Generics_Meta_showSOP($1, $2, Generics_Meta_metaFor($0), $0.a1.a1($3));
}

function Generics_Meta_argNames($0) {
 return Data_SOP_Interfaces_htraverse({a1: {a1: b => a => func => $5 => Prelude_Types_map_Functor_Maybe(func, $5), a2: a => $a => ({a1: $a}), a3: b => a => $d => $e => Prelude_Types_x3cx2ax3e_Applicative_Maybe($d, $e)}, a2: {a1: csegen_506(), a2: csegen_528()}}, $18 => $19 => Generics_Meta_getName($19), $0.a3);
}

function Data_SOP_Interfaces_htraverse($0, $1, $2) {
 return Builtin_snd(Builtin_snd($0))(undefined)(undefined)(undefined)(Builtin_fst($0))(Builtin_fst(Builtin_snd($0))(undefined)(undefined)(undefined)($20 => $1(undefined))($2));
}

function Data_SOP_Interfaces_hsize($0, $1) {
 const $2 = Builtin_snd($0);
 return $2.a1(undefined)(undefined)(undefined)($f => $10 => ($f+$10))(0n)(Builtin_fst($0)(undefined)(undefined)(undefined)($20 => $21 => Prelude_Types_prim__integerToNat(1n))($1));
}

function Data_SOP_Interfaces_hliftA3($0, $1, $2, $3, $4) {
 const $5 = Builtin_snd($0);
 return $5.a3(undefined)(undefined)(undefined)(Data_SOP_Interfaces_hliftA2(Builtin_fst($0), $16 => $1(undefined), $2, $3))($4);
}

function Data_SOP_Interfaces_hliftA2($0, $1, $2, $3) {
 return $0.a3(undefined)(undefined)(undefined)($0.a1(undefined)(undefined)(undefined)($18 => $1(undefined))($2))($3);
}

function Data_SOP_Interfaces_hctraverse($0, $1, $2, $3) {
 return Builtin_snd(Builtin_snd($0))(undefined)(undefined)(undefined)(Builtin_fst($0))(Data_SOP_Interfaces_hcmap(Builtin_fst(Builtin_snd($0)), $1, $1c => $1d => $2(undefined)($1d), $3));
}

function Data_SOP_Interfaces_hconcat($0, $1) {
 const $2 = Builtin_snd($0);
 const $e = $f => $10 => {
  const $11 = Builtin_fst($0);
  return $11.a1($f)($10);
 };
 const $6 = $2.a1(undefined)(undefined)(undefined)($e);
 const $19 = Builtin_fst($0);
 const $18 = $19.a2;
 const $5 = $6($18);
 return $5($1);
}

function Data_SOP_Interfaces_hcmap($0, $1, $2, $3) {
 return Data_SOP_Interfaces_hliftA2($0, $7 => $8 => $2(undefined)($8), $1, $3);
}

function Data_SOP_NP_sequenceNP($0, $1) {
 switch($1.h) {
  case 0: return $0.a2(undefined)({h: 0});
  case undefined: return $0.a3(undefined)(undefined)($0.a3(undefined)(undefined)($0.a2(undefined)($1d => $1e => ({a1: $1d, a2: $1e})))($1.a1))(Data_SOP_NP_sequenceNP($0, $1.a2));
 }
}

function Data_SOP_NP_mapNP($0, $1) {
 switch($1.h) {
  case 0: return {h: 0};
  case undefined: return {a1: $0(undefined)($1.a1), a2: Data_SOP_NP_mapNP($b => $0(undefined), $1.a2)};
 }
}

function Data_SOP_NP_hapNP($0, $1) {
 switch($0.h) {
  case 0: return {h: 0};
  case undefined: return {a1: $0.a1($1.a1), a2: Data_SOP_NP_hapNP($0.a2, $1.a2)};
 }
}

function Data_SOP_NP_fromListNP($0, $1) {
 switch($0.h) {
  case 0: {
   switch($1.h) {
    case 0: return {a1: {h: 0}};
    case undefined: return {h: 0};
   }
  }
  case undefined: {
   switch($1.h) {
    case 0: return {h: 0};
    case undefined: return Prelude_Interfaces_x3cx24x3e(csegen_434(), $a => ({a1: $1.a1, a2: $a}), Data_SOP_NP_fromListNP($0.a2, $1.a2));
   }
  }
 }
}

function Data_SOP_NP_foldrNP($0, $1, $2) {
 switch($2.h) {
  case 0: return $1();
  case undefined: return $0($2.a1)(() => Data_SOP_NP_foldrNP($0, $1, $2.a2));
 }
}

function Data_SOP_NP_collapseNP($0) {
 switch($0.h) {
  case 0: return {h: 0};
  case undefined: return {a1: $0.a1, a2: Data_SOP_NP_collapseNP($0.a2)};
 }
}

function Data_SOP_NS_mapNS($0, $1) {
 switch($1.h) {
  case 0: return {h: 0, a1: $0(undefined)($1.a1)};
  case 1: return {h: 1, a1: Data_SOP_NS_mapNS($b => $0(undefined), $1.a1)};
 }
}

function Data_SOP_NS_hapNS($0, $1) {
 switch($1.h) {
  case 0: return {h: 0, a1: $0.a1($1.a1)};
  case 1: return {h: 1, a1: Data_SOP_NS_hapNS($0.a2, $1.a1)};
 }
}

function JSON_FromJSON_n__12100_4928_parseStr($0, $1, $2, $3, $4) {
 const $5 = Data_String_parseInteger(csegen_537(), {a1: csegen_537(), a2: $d => (0n-$d), a3: $11 => $12 => ($11-$12)}, $4);
 switch($5.h) {
  case 0: return {h: 0, a1: {a1: {h: 0}, a2: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'not an integer: ', a2: {a1: Prelude_Show_show_Show_String($4), a2: {h: 0}}})}};
  case undefined: return $2($5.a1);
 }
}

function JSON_FromJSON_fromJSON_FromJSON_String($0, $1) {
 return JSON_FromJSON_withValue($0, 'String', $6 => $0.a8($6), () => 'String', $c => ({h: 1, a1: $c}), $1);
}

function JSON_FromJSON_fromJSON_FromJSON_Nat($0, $1) {
 const $5 = n => {
  switch(Prelude_EqOrd_x3ex3d_Ord_Integer(n, 0n)) {
   case 1: return {h: 1, a1: Prelude_Types_prim__integerToNat(n)};
   case 0: return {h: 0, a1: {a1: {h: 0}, a2: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'not a natural number: ', a2: {a1: Prelude_Show_show_Show_Integer(n), a2: {h: 0}}})}};
  }
 };
 return JSON_FromJSON_withLargeInteger($0, () => 'Nat', $5, $1);
}

function JSON_FromJSON_fromJSON_FromJSON_Bool($0, $1) {
 return JSON_FromJSON_withValue($0, 'Boolean', $6 => $0.a6($6), () => 'Bool', $c => ({h: 1, a1: $c}), $1);
}

function JSON_FromJSON_fromJSON_FromJSON_x28Listx20x24ax29($0, $1, $2) {
 const $c = $d => {
  const $10 = b => a => func => $11 => {
   switch($11.h) {
    case 0: return {h: 0, a1: $11.a1};
    case 1: return {h: 1, a1: func($11.a1)};
   }
  };
  const $1a = b => a => $1b => $1c => {
   switch($1b.h) {
    case 0: return {h: 0, a1: $1b.a1};
    case 1: {
     switch($1c.h) {
      case 1: return {h: 1, a1: $1b.a1($1c.a1)};
      case 0: return {h: 0, a1: $1c.a1};
     }
    }
   }
  };
  const $f = {a1: $10, a2: a => $18 => ({h: 1, a1: $18}), a3: $1a};
  return Prelude_Types_traverse_Traversable_List($f, $0(undefined)(undefined)($1), $d);
 };
 return JSON_FromJSON_withValue($1, 'Array', $7 => $1.a5($7), () => 'List', $c, $2);
}

function JSON_FromJSON_fromJSON_FromJSON_x28x28NPx20x24fx29x20x24ksx29($0, $1, $2) {
 return JSON_FromJSON_withValue($1, 'Array', $7 => $1.a5($7), () => 'NP', $d => JSON_FromJSON_np($1, $0, $d), $2);
}

function JSON_FromJSON_withValue($0, $1, $2, $3, $4, $5) {
 const $6 = $2($5);
 switch($6.h) {
  case undefined: return $4($6.a1);
  case 0: {
   const $b = JSON_FromJSON_typeMismatch($0, $1, $5);
   switch($b.h) {
    case 0: return {h: 0, a1: {a1: $b.a1.a1, a2: (Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'parsing ', a2: {a1: $3(), a2: {a1: ' failed, ', a2: {h: 0}}}})+$b.a1.a2)}};
    case 1: return {h: 1, a1: $b.a1};
   }
  }
 }
}

function JSON_FromJSON_withLargeInteger($0, $1, $2, $3) {
 return JSON_FromJSON_orElse(JSON_FromJSON_withInteger($0, $1, $2, $3), () => JSON_FromJSON_withValue($0, 'String', $10 => $0.a8($10), $1, $16 => JSON_FromJSON_n__12100_4928_parseStr($0, $3, $2, $1, $16), $3));
}

function JSON_FromJSON_withInteger($0, $1, $2, $3) {
 const $d = d => {
  const $e = Prelude_Cast_cast_Cast_Double_Integer(d);
  switch(Prelude_EqOrd_x3dx3d_Eq_Double(d, Number($e))) {
   case 1: return $2($e);
   case 0: return {h: 0, a1: {a1: {h: 0}, a2: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'not an integer: ', a2: {a1: Prelude_Show_show_Show_Double(d), a2: {h: 0}}})}};
  }
 };
 return JSON_FromJSON_withValue($0, 'Number', $8 => $0.a7($8), $1, $d, $3);
}

function JSON_FromJSON_untagged($0, $1, $2) {
 return Prelude_Types_maybe(() => $5 => JSON_FromJSON_fromJSON_FromJSON_x28x28NPx20x24fx29x20x24ksx29($1, $0, $5), () => $b => $c => JSON_FromJSON_conFields($0, $1, $2.a2, $b, $c), Generics_Meta_argNames($2));
}

function JSON_FromJSON_typeMismatch($0, $1, $2) {
 return {h: 0, a1: {a1: {h: 0}, a2: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'expected ', a2: {a1: $1, a2: {a1: ', but encountered ', a2: {a1: $0.a2($2), a2: {h: 0}}}}})}};
}

function JSON_FromJSON_sopRecord($0, $1, $2, $3) {
 const $7 = JSON_FromJSON_untagged($0, $1, $2.a3.a1)($3);
 switch($7.h) {
  case 0: return {h: 0, a1: $7.a1};
  case 1: return {h: 1, a1: {h: 0, a1: $7.a1}};
 }
}

function JSON_FromJSON_parseField($0, $1, $2, $3, $4) {
 return JSON_FromJSON_x2ex3a($0, $1, $2, $3, $4);
}

function JSON_FromJSON_orElse($0, $1) {
 switch($0.h) {
  case 1: return $0;
  default: return $1();
 }
}

function JSON_FromJSON_np($0, $1, $2) {
 const $3 = Data_SOP_NP_fromListNP($1, $2);
 switch($3.h) {
  case undefined: {
   const $a = b => a => func => $b => {
    switch($b.h) {
     case 0: return {h: 0, a1: $b.a1};
     case 1: return {h: 1, a1: func($b.a1)};
    }
   };
   const $14 = b => a => $15 => $16 => {
    switch($15.h) {
     case 0: return {h: 0, a1: $15.a1};
     case 1: {
      switch($16.h) {
       case 1: return {h: 1, a1: $15.a1($16.a1)};
       case 0: return {h: 0, a1: $16.a1};
      }
     }
    }
   };
   const $9 = {a1: $a, a2: a => $12 => ({h: 1, a1: $12}), a3: $14};
   const $8 = {a1: $9, a2: csegen_541()};
   return Data_SOP_Interfaces_hctraverse($8, $1, $22 => $23 => $23(undefined)(undefined)($0), $3.a1);
  }
  case 0: return {h: 0, a1: {a1: {h: 0}, a2: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'expected array of ', a2: {a1: Prelude_Show_show_Show_Nat(Data_SOP_Interfaces_hsize({a1: csegen_506(), a2: csegen_495()}, $1)), a2: {a1: ' values', a2: {h: 0}}}})}};
 }
}

function JSON_FromJSON_genRecordFromJSON($0, $1, $2, $3) {
 const $4 = JSON_FromJSON_sopRecord($0, $2, Generics_Meta_metaFor($1), $3);
 switch($4.h) {
  case 0: return {h: 0, a1: $4.a1};
  case 1: return {h: 1, a1: $1.a1.a2($4.a1)};
 }
}

function JSON_FromJSON_explicitParseField($0, $1, $2, $3, $4) {
 const $5 = $0($4)($3);
 switch($5.h) {
  case 0: return {h: 0, a1: {a1: {h: 0}, a2: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'key ', a2: {a1: Prelude_Show_show_Show_String($4), a2: {a1: ' not found', a2: {h: 0}}}})}};
  case undefined: {
   const $1b = $2($5.a1);
   switch($1b.h) {
    case 0: return {h: 0, a1: {a1: {a1: {h: 0, a1: $4}, a2: $1b.a1.a1}, a2: $1b.a1.a2}};
    case 1: return {h: 1, a1: $1b.a1};
   }
  }
 }
}

function JSON_FromJSON_conFields($0, $1, $2, $3, $4) {
 const $e = o => {
  const $12 = b => a => func => $13 => {
   switch($13.h) {
    case 0: return {h: 0, a1: $13.a1};
    case 1: return {h: 1, a1: func($13.a1)};
   }
  };
  const $1c = b => a => $1d => $1e => {
   switch($1d.h) {
    case 0: return {h: 0, a1: $1d.a1};
    case 1: {
     switch($1e.h) {
      case 1: return {h: 1, a1: $1d.a1($1e.a1)};
      case 0: return {h: 0, a1: $1e.a1};
     }
    }
   }
  };
  const $11 = {a1: $12, a2: a => $1a => ({h: 1, a1: $1a}), a3: $1c};
  const $10 = {a1: $11, a2: csegen_541()};
  return Data_SOP_Interfaces_hctraverse($10, $1, $2a => $2b => $2c => JSON_FromJSON_parseField($0.a1, $0, $2b, o, $2c), $3);
 };
 return JSON_FromJSON_withValue($0, 'Object', $9 => $0.a4($9), () => $2, $e, $4);
}

function JSON_FromJSON_x2ex3a($0, $1, $2, $3, $4) {
 return JSON_FromJSON_explicitParseField($0, $1, $2(undefined)(undefined)($1), $3, $4);
}

function Web_Dom_callback_Callback_EventListener_x28x25pix20RigWx20Explicitx20Nothingx20Eventx20x28JSIOx20x28x7cUnitx2cMkUnitx7cx29x29x29($0) {
 return Web_Raw_Dom_EventListener_toEventListener($3 => $4 => JS_Util_runJS($0($3), $4));
}

const Web_Dom_window = __lazy(function () {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $4 => Web_Dom_prim__window($4));
});

function Web_Dom_getElementsByClass($0, $1) {
 return $0.a2(undefined)(Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Web_Dom_document(), $d => Web_Raw_Dom_Document_getElementsByClassName($d, $1)));
}

function Web_Dom_getElementById($0, $1) {
 return $0.a2(undefined)(Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Web_Dom_document(), $d => Web_Raw_Dom_NonElementParentNode_getElementById($d, $1)));
}

function Web_Dom_getElementByClass($0, $1, $2) {
 const $11 = $12 => {
  switch($12.h) {
   case 0: return Control_Monad_Error_Interface_throwError_MonadError_x24e_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), {h: 0, a1: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'Web.Dom.getElementByClass: Could not find an element with class ', a2: {a1: $2, a2: {h: 0}}})});
   case undefined: return Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $12.a1);
  }
 };
 const $7 = Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Web_Dom_castFirstElementByClass(csegen_118(), $1, $2), $11);
 return $0.a2(undefined)($7);
}

function Web_Dom_firstElementByClass($0, $1) {
 return $0.a1.a1.a2(undefined)(undefined)(Web_Dom_getElementsByClass($0, $1))(col => JS_Array_readIO({a1: $0.a1, a2: undefined}, col, 0));
}

const Web_Dom_document = __lazy(function () {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $4 => Web_Dom_prim__document($4));
});

function Web_Dom_castFirstElementByClass_($0, $1, $2) {
 return $0.a1.a1.a1.a1(undefined)(undefined)($e => Prelude_Types_x3ex3ex3d_Monad_Maybe($e, $12 => $1(undefined)($12)))(Web_Dom_firstElementByClass($0, $2));
}

function Web_Dom_castFirstElementByClass($0, $1, $2) {
 return Web_Dom_castFirstElementByClass_($0, $1, $2);
}

function Web_Dom_castElementById_($0, $1, $2) {
 return $0.a1.a1.a1.a1(undefined)(undefined)($e => Prelude_Types_x3ex3ex3d_Monad_Maybe($e, $12 => $1(undefined)($12)))(Web_Dom_getElementById($0, $2));
}

function Web_Dom_castElementById($0, $1, $2) {
 return Web_Dom_castElementById_($0, $1, $2);
}

const Web_Dom_body = __lazy(function () {
 return JS_Util_unMaybe('Web.Dom.body', Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Web_Dom_document(), $9 => JS_Attribute_to($c => Web_Raw_Dom_Document_body($c), $9)));
});

function Web_Raw_Dom_EventListener_toEventListener($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_DomPrim_EventListener_prim__toEventListener($0, $5));
}

function Web_Raw_Dom_InnerHTML_innerHTML($0) {
 return JS_Attribute_fromPrim({a1: $4 => $4, a2: $6 => JS_Marshall_fromFFI_FromFFI_String_String($6)}, 'InnerHTML.getinnerHTML', $b => $c => Web_Internal_DomPrim_InnerHTML_prim__innerHTML($b, $c), $11 => $12 => $13 => Web_Internal_DomPrim_InnerHTML_prim__setInnerHTML($11, $12, $13), Builtin_believe_me($0));
}

function Web_Raw_Dom_Document_getElementsByClassName($0, $1) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $6 => Web_Internal_DomPrim_Document_prim__getElementsByClassName(Builtin_believe_me($0), $1, $6));
}

function Web_Raw_Dom_NonElementParentNode_getElementById($0, $1) {
 return JS_Marshall_tryJS($4 => JS_Nullable_fromFFI_FromFFI_x28Maybex20x24ax29_x28Nullablex20x24bx29($7 => Web_Internal_DomTypes_fromFFI_FromFFI_Element_Element($7), $4), () => 'NonElementParentNode.getElementById', $d => Web_Internal_DomPrim_NonElementParentNode_prim__getElementById(Builtin_believe_me($0), $1, $d));
}

function Web_Raw_Dom_Document_body($0) {
 return JS_Attribute_fromNullablePrim({a1: $4 => $4, a2: $6 => Web_Internal_HtmlTypes_fromFFI_FromFFI_HTMLElement_HTMLElement($6)}, 'Document.getbody', $b => $c => Web_Internal_DomPrim_Document_prim__body($b, $c), $11 => $12 => $13 => Web_Internal_DomPrim_Document_prim__setBody($11, $12, $13), Builtin_believe_me($0));
}

function Web_Raw_Dom_EventTarget_addEventListenerx27($0, $1, $2) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $7 => Web_Internal_DomPrim_EventTarget_prim__addEventListener(Builtin_believe_me($0), $1, JS_Nullable_toFFI_ToFFI_x28Maybex20x24ax29_x28Nullablex20x24bx29($10 => $10, $2), JS_Undefined_undef(), $7));
}

function JS_Util_unMaybe($0, $1) {
 const $6 = $7 => {
  switch($7.h) {
   case undefined: return Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $7.a1);
   case 0: return Control_Monad_Error_Interface_throwError_MonadError_x24e_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), {h: 2, a1: $0});
  }
 };
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), $1, $6);
}

function JS_Util_typeof($0) {
 return JS_Util_prim__typeOf(Builtin_believe_me($0));
}

function JS_Util_runJSWith($0, $1, $2) {
 const $3 = $1($2);
 return Prelude_Types_either(() => $0(), () => $b => $c => $b, $3)($2);
}

function JS_Util_runJS($0, $1) {
 return JS_Util_runJSWith(() => $4 => JS_Util_consoleLog(csegen_111(), JS_Util_dispErr($4)), $0, $1);
}

function JS_Util_jsShow($0) {
 return JS_Util_prim__show(Builtin_believe_me($0));
}

function JS_Util_eqv($0, $1) {
 return JS_Util_doubleToBool(JS_Util_prim__eqv(Builtin_believe_me($0), Builtin_believe_me($1)));
}

function JS_Util_doubleToBool($0) {
 return Prelude_EqOrd_x2fx3d_Eq_Double($0, 0.0);
}

function JS_Util_dispErr($0) {
 switch($0.h) {
  case 1: return Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'Error when casting a Javascript value in function ', a2: {a1: $0.a1, a2: {a1: '.\n  The value was: ', a2: {a1: JS_Util_jsShow($0.a2), a2: {a1: '.\n  The value\'s type was ', a2: {a1: JS_Util_typeof($0.a2), a2: {a1: '.', a2: {h: 0}}}}}}}});
  case 2: return Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'Trying to extract a value from Nothing at ', a2: {a1: $0.a1, a2: {h: 0}}});
  case 0: return $0.a1;
 }
}

function JS_Util_consoleLog($0, $1) {
 return $0.a2(undefined)($7 => JS_Util_prim__consoleLog($1, $7));
}

function Control_Monad_Error_Interface_throwError_MonadError_x24e_x28x28EitherTx20x24ex29x20x24mx29($0, $1) {
 return $0.a1.a2(undefined)({h: 0, a1: $1});
}

function Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29($0, $1) {
 return $0.a2(undefined)({h: 1, a1: $1});
}

function Control_Monad_Error_Either_map_Functor_x28x28EitherTx20x24ex29x20x24mx29($0, $1, $2) {
 const $5 = $6 => {
  switch($6.h) {
   case 0: return {h: 0, a1: $6.a1};
   case 1: return {h: 1, a1: $1($6.a1)};
  }
 };
 return Prelude_Interfaces_x3cx24x3e($0, $5, $2);
}

function Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29($0, $1) {
 const $6 = $7 => {
  const $8 = $1($7);
  return {h: 1, a1: $8};
 };
 return $0.a2(undefined)($6);
}

function Control_Monad_Error_Either_join_Monad_x28x28EitherTx20x24ex29x20x24mx29($0, $1) {
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29($0, $1, $6 => $6);
}

function Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29($0, $1, $2) {
 return $0.a2(undefined)(undefined)($1)($c => Prelude_Types_either(() => $f => $0.a1.a2(undefined)({h: 0, a1: $f}), () => $18 => $2($18), $c));
}

function Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29($0, $1, $2) {
 const $17 = $18 => $19 => {
  switch($18.h) {
   case 0: return {h: 0, a1: $18.a1};
   case 1: {
    switch($19.h) {
     case 1: return {h: 1, a1: $18.a1($19.a1)};
     case 0: return {h: 0, a1: $19.a1};
    }
   }
  }
 };
 const $12 = $0.a2(undefined)($17);
 const $c = $0.a3(undefined)(undefined)($12);
 const $a = $c($1);
 const $4 = $0.a3(undefined)(undefined)($a);
 return $4($2);
}

function JS_Marshall_fromFFI_FromFFI_String_String($0) {
 return {a1: $0};
}

function JS_Marshall_tryJS($0, $1, $2) {
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $2), $c => JS_Marshall_tryFromFFI($0, $1, $c));
}

function JS_Marshall_tryFromFFI($0, $1, $2) {
 const $3 = $0($2);
 switch($3.h) {
  case 0: return Control_Monad_Error_Interface_throwError_MonadError_x24e_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), {h: 1, a1: $1(), a2: $2});
  case undefined: return Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $3.a1);
 }
}

function JS_Inheritance_unsafeCastOnPrototypeName($0, $1) {
 switch(Prelude_EqOrd_x3dx3d_Eq_Double(JS_Inheritance_prim__hasProtoName($0, Builtin_believe_me($1)), 1.0)) {
  case 1: return {a1: Builtin_believe_me($1)};
  case 0: return {h: 0};
 }
}

function JS_Inheritance_tryCast_($0, $1, $2) {
 return JS_Inheritance_tryCast($0, $1, $2);
}

function JS_Inheritance_tryCast($0, $1, $2) {
 const $3 = $0(undefined)($2);
 switch($3.h) {
  case undefined: return Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $3.a1);
  case 0: return Control_Monad_Error_Interface_throwError_MonadError_x24e_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), {h: 1, a1: $1(), a2: $2});
 }
}

function JS_Undefined_undeforToMaybe($0) {
 switch(JS_Undefined_isUndefined($0)) {
  case 1: return {h: 0};
  case 0: return {a1: Builtin_believe_me($0)};
 }
}

const JS_Undefined_undef = __lazy(function () {
 return Builtin_believe_me(JS_Undefined_undefined());
});

function JS_Undefined_isUndefined($0) {
 return JS_Util_doubleToBool(JS_Undefined_prim__isUndefined(Builtin_believe_me($0)));
}

function JS_Nullable_toFFI_ToFFI_x28Maybex20x24ax29_x28Nullablex20x24bx29($0, $1) {
 return JS_Nullable_maybeToNullable(Prelude_Types_map_Functor_Maybe($6 => $0($6), $1));
}

function JS_Nullable_fromFFI_FromFFI_x28Maybex20x24ax29_x28Nullablex20x24bx29($0, $1) {
 const $2 = JS_Nullable_nullableToMaybe($1);
 switch($2.h) {
  case 0: return {a1: {h: 0}};
  case undefined: return Prelude_Types_map_Functor_Maybe($8 => ({a1: $8}), $0($2.a1));
 }
}

function JS_Nullable_nullableToMaybe($0) {
 switch(JS_Nullable_isNull($0)) {
  case 1: return {h: 0};
  case 0: return {a1: Builtin_believe_me($0)};
 }
}

const JS_Nullable_null = __lazy(function () {
 return Builtin_believe_me(JS_Nullable_prim__null());
});

function JS_Nullable_nonNull($0) {
 return Builtin_believe_me($0);
}

function JS_Nullable_maybeToNullable($0) {
 return Prelude_Types_maybe(() => JS_Nullable_null(), () => $5 => JS_Nullable_nonNull($5), $0);
}

function JS_Nullable_isNull($0) {
 return JS_Util_eqv(JS_Nullable_prim__null(), $0);
}

function JS_Boolean_fromFFI_FromFFI_Bool_Boolean($0) {
 switch(JS_Util_eqv($0, JS_Boolean_true())) {
  case 1: return {a1: 1};
  case 0: {
   switch(JS_Util_eqv($0, JS_Boolean_false())) {
    case 1: return {a1: 0};
    case 0: return {h: 0};
   }
  }
 }
}

function JS_Array_readIO($0, $1, $2) {
 const $5 = Builtin_fst($0);
 const $4 = $5.a1.a1.a1;
 const $f = Builtin_fst($0);
 const $e = $f.a2(undefined)($16 => JS_Array_prim__readIO(undefined, undefined, $1, $2, $16));
 return Prelude_Interfaces_x3cx24x3e($4, $b => JS_Undefined_undeforToMaybe($b), $e);
}

function JS_Attribute_to($0, $1) {
 return Prelude_Basics_flip($4 => $5 => JS_Attribute_get($4, $5), $0, $1);
}

function JS_Attribute_set($0, $1) {
 switch($0.h) {
  case 0: return $0.a2($1);
  case 1: return $0.a2({a1: $1});
  case 2: return $0.a2({a1: $1});
  case 3: return $0.a2({a1: $1});
 }
}

function JS_Attribute_get($0, $1) {
 const $2 = $1($0);
 switch($2.h) {
  case 0: return $2.a1;
  case 1: return $2.a1;
  case 2: return $2.a1;
  case 3: return $2.a1;
 }
}

function JS_Attribute_fromPrim($0, $1, $2, $3, $4) {
 return {h: 0, a1: JS_Marshall_tryJS(Builtin_snd($0), () => $1, $2($4)), a2: a => Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $3($4)(Builtin_fst($0)(a)))};
}

function JS_Attribute_fromNullablePrim($0, $1, $2, $3, $4) {
 return {h: 1, a1: JS_Marshall_tryJS($8 => JS_Nullable_fromFFI_FromFFI_x28Maybex20x24ax29_x28Nullablex20x24bx29(Builtin_snd($0), $8), () => $1, $2($4)), a2: a => Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $3($4)(JS_Nullable_toFFI_ToFFI_x28Maybex20x24ax29_x28Nullablex20x24bx29(Builtin_fst($0), a)))};
}

function JS_Attribute_x2ex3d($0, $1) {
 return JS_Attribute_set($0, $1);
}

function Web_Internal_UIEventsTypes_safeCast_SafeCast_MouseEvent($0) {
 return JS_Inheritance_unsafeCastOnPrototypeName('MouseEvent', $0);
}

function Web_Internal_UIEventsTypes_safeCast_SafeCast_KeyboardEvent($0) {
 return JS_Inheritance_unsafeCastOnPrototypeName('KeyboardEvent', $0);
}

function Web_Internal_UIEventsTypes_safeCast_SafeCast_InputEvent($0) {
 return JS_Inheritance_unsafeCastOnPrototypeName('InputEvent', $0);
}

function Web_Internal_HtmlTypes_fromFFI_FromFFI_HTMLElement_HTMLElement($0) {
 return {a1: $0};
}

function Web_Internal_DomTypes_safeCast_SafeCast_EventTarget($0) {
 return JS_Inheritance_unsafeCastOnPrototypeName('EventTarget', $0);
}

function Web_Internal_DomTypes_safeCast_SafeCast_Event($0) {
 return JS_Inheritance_unsafeCastOnPrototypeName('Event', $0);
}

function Web_Internal_DomTypes_safeCast_SafeCast_Element($0) {
 return JS_Inheritance_unsafeCastOnPrototypeName('Element', $0);
}

function Web_Internal_DomTypes_fromFFI_FromFFI_Element_Element($0) {
 return {a1: $0};
}

function Data_MSF_Running_stepPar($0, $1, $2) {
 switch($1.h) {
  case 0: return $0.a1.a2(undefined)({a1: {h: 0}, a2: {h: 0}});
  case undefined: return $0.a2(undefined)(undefined)(Data_MSF_Running_step($0, $1.a1, $2.a1))($1b => $0.a2(undefined)(undefined)(Data_MSF_Running_stepPar($0, $1.a2, $2.a2))($2a => $0.a1.a2(undefined)({a1: {a1: $1b.a1, a2: $2a.a1}, a2: {a1: $1b.a2, a2: $2a.a2}})));
 }
}

function Data_MSF_Running_stepFan($0, $1, $2) {
 switch($1.h) {
  case 0: return $0.a1.a2(undefined)({a1: {h: 0}, a2: {h: 0}});
  case undefined: return $0.a2(undefined)(undefined)(Data_MSF_Running_step($0, $1.a1, $2))($19 => $0.a2(undefined)(undefined)(Data_MSF_Running_stepFan($0, $1.a2, $2))($28 => $0.a1.a2(undefined)({a1: {a1: $19.a1, a2: $28.a1}, a2: {a1: $19.a2, a2: $28.a2}})));
 }
}

function Data_MSF_Running_stepCollect($0, $1, $2) {
 switch($2.h) {
  case 0: return $0.a2(undefined)(undefined)(Data_MSF_Running_step($0, $1.a1, $2.a1))($12 => $0.a1.a2(undefined)({a1: $12.a1, a2: {a1: $12.a2, a2: $1.a2}}));
  case 1: return $0.a2(undefined)(undefined)(Data_MSF_Running_stepCollect($0, $1.a2, $2.a1))($2b => $0.a1.a2(undefined)({a1: $2b.a1, a2: {a1: $1.a1, a2: $2b.a2}}));
 }
}

function Data_MSF_Running_stepChoice($0, $1, $2) {
 switch($2.h) {
  case 0: return $0.a2(undefined)(undefined)(Data_MSF_Running_step($0, $1.a1, $2.a1))($12 => $0.a1.a2(undefined)({a1: {h: 0, a1: $12.a1}, a2: {a1: $12.a2, a2: $1.a2}}));
  case 1: return $0.a2(undefined)(undefined)(Data_MSF_Running_stepChoice($0, $1.a2, $2.a1))($2c => $0.a1.a2(undefined)({a1: {h: 1, a1: $2c.a1}, a2: {a1: $1.a1, a2: $2c.a2}}));
 }
}

function Data_MSF_Running_step($0, $1, $2) {
 switch($1.h) {
  case 1: return $0.a1.a2(undefined)({a1: $1.a1, a2: $1});
  case 0: return $0.a1.a2(undefined)({a1: $2, a2: {h: 0}});
  case 2: return $0.a1.a2(undefined)({a1: $1.a1($2), a2: $1});
  case 3: return Prelude_Interfaces_x3cx24x3e($0.a1.a1, $23 => ({a1: $23, a2: $1}), $1.a1($2));
  case 4: return $0.a2(undefined)(undefined)(Data_MSF_Running_step($0, $1.a1, $2))($36 => $0.a2(undefined)(undefined)(Data_MSF_Running_step($0, $1.a2, $36.a1))($45 => $0.a1.a2(undefined)({a1: $45.a1, a2: {h: 4, a1: $36.a2, a2: $45.a2}})));
  case 5: return Prelude_Interfaces_x3cx24x3e($0.a1.a1, $56 => ({a1: $56.a1, a2: {h: 5, a1: $56.a2}}), Data_MSF_Running_stepPar($0, $1.a1, $2));
  case 6: return Prelude_Interfaces_x3cx24x3e($0.a1.a1, $65 => ({a1: $65.a1, a2: {h: 6, a1: $65.a2}}), Data_MSF_Running_stepFan($0, $1.a1, $2));
  case 7: return Prelude_Interfaces_x3cx24x3e($0.a1.a1, $74 => ({a1: $74.a1, a2: {h: 7, a1: $74.a2}}), Data_MSF_Running_stepChoice($0, $1.a1, $2));
  case 8: return Prelude_Interfaces_x3cx24x3e($0.a1.a1, $83 => ({a1: $83.a1, a2: {h: 8, a1: $83.a2}}), Data_MSF_Running_stepCollect($0, $1.a1, $2));
  case 9: return $0.a2(undefined)(undefined)(Data_MSF_Running_step($0, $1.a2, {a1: $1.a1, a2: {a1: $2, a2: {h: 0}}}))($9e => $0.a1.a2(undefined)({a1: $9e.a1.a2.a1, a2: {h: 9, a1: $9e.a1.a1, a2: $9e.a2}}));
  case 10: {
   const $b9 = $ba => {
    switch($ba.a1.h) {
     case 0: return Data_MSF_Running_step($0, $1.a2($ba.a1.a1), $2);
     case 1: return $0.a1.a2(undefined)({a1: $ba.a1.a1, a2: {h: 10, a1: $ba.a2, a2: $1.a2}});
    }
   };
   return $0.a2(undefined)(undefined)(Data_MSF_Running_step($0, $1.a1, $2))($b9);
  }
 }
}

function Text_Html_Node_n__12906_4993_esc($0) {
 switch($0) {
  case '<': return '&lt;';
  case '>': return '&gt;';
  case '&': return '&amp;';
  case '\"': return '&quot;';
  case '\'': return '&#x27';
  case '\n': return '\n';
  case '\r': return '\r';
  case '\u{9}': return '\u{9}';
  default: {
   switch(Prelude_EqOrd_x3c_Ord_Char($0, ' ')) {
    case 1: return '';
    case 0: return Data_String_singleton($0);
   }
  }
 }
}

function Text_Html_Node_render($0) {
 switch($0.h) {
  case 1: return $0.a1;
  case 2: return Text_Html_Node_escape($0.a1);
  case 0: return Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: '<', a2: {a1: $0.a1, a2: {a1: Text_Html_Node_attrs($0.a3), a2: {a1: '>', a2: {a1: Text_Html_Node_n__13023_5114_go($0, {h: 0}, $0.a4), a2: {a1: '</', a2: {a1: $0.a1, a2: {a1: '>', a2: {h: 0}}}}}}}}});
 }
}

function Text_Html_Node_escape($0) {
 return Prelude_Types_fastConcat(Data_List_TR_mapTR($5 => Text_Html_Node_n__12906_4993_esc($5), Prelude_Types_fastUnpack($0)));
}

function Text_Html_Node_attrs($0) {
 const $1 = Text_Html_Attribute_displayAttributes($0);
 switch(Data_String_null($1)) {
  case 1: return '';
  case 0: return (' '+$1);
 }
}

function Text_Html_Attribute_getEvents($0) {
 return Text_Html_Attribute_n__3974_4055_go({h: 0}, $0);
}

function Text_Html_Attribute_displayAttributes($0) {
 return Prelude_Types_fastConcat(Data_List_intersperse(' ', Prelude_Types_List_mapMaybe($8 => Text_Html_Attribute_displayAttribute($8), $0)));
}

function Text_Html_Attribute_displayAttribute($0) {
 switch($0.h) {
  case 0: return {a1: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'id=\"', a2: {a1: $0.a1, a2: {a1: '\"', a2: {h: 0}}}})};
  case 1: return {a1: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: $0.a1, a2: {a1: '=\"', a2: {a1: $0.a2, a2: {a1: '\"', a2: {h: 0}}}}})};
  case 2: {
   switch($0.a2) {
    case 1: return {a1: $0.a1};
    case 0: return {h: 0};
   }
  }
  case 3: return {h: 0};
 }
}

function Data_List_TR_mapTR($0, $1) {
 return Data_List_TR_n__3884_4794_run($0, {h: 0}, $1);
}

function Control_MonadRec_n__6963_4392_conv($0, $1, $2, $3, $4) {
 switch($4.h) {
  case 0: return {h: 1, a1: {h: 0, a1: $4.a1}};
  case 1: {
   switch($4.a1.h) {
    case 1: return {h: 1, a1: {h: 1, a1: $4.a1.a1}};
    case 0: return {h: 0, a1: $4.a1.a1, a2: $4.a1.a2};
   }
  }
 }
}

function Control_MonadRec_tailRecM_MonadRec_x28x28EitherTx20x24ex29x20x24mx29($0, $1, $2, $3) {
 return $0.a2(undefined)(undefined)(undefined)(undefined)($1)($2)(undefined)($15 => $16 => Control_MonadRec_convE($0.a1.a1.a1, $3, $15, $16));
}

function Control_MonadRec_trIO($0, $1, $2, $3) {
 return Control_MonadRec_n__6429_3846_run($0, $1, $2, $0, $1, $3);
}

function Control_MonadRec_convE($0, $1, $2, $3) {
 return $0(undefined)(undefined)($b => Control_MonadRec_n__6963_4392_conv($0, $3, $2, $1, $b))($1($2)($3));
}

function Data_Iterable_iterM_Iterable_x28Listx20x24ax29_x24a($0, $1, $2, $3, $4) {
 const $15 = $16 => $17 => {
  switch($16.h) {
   case 0: return $0.a1.a1.a2(undefined)({h: 1, a1: $2($17)});
   case undefined: return $0.a1.a1.a1(undefined)(undefined)($2d => ({h: 0, a1: $16.a2, a2: $2d}))($1($16.a1)($17));
  }
 };
 return $0.a2(undefined)(undefined)(undefined)(undefined)($4)($3)(undefined)($15);
}

function Data_Iterable_forM_($0, $1, $2, $3) {
 return $0(undefined)(undefined)(undefined)($1)(e => $11 => $2(e))($15 => (undefined))(undefined)($3);
}

function Data_IORef_newIORef($0, $1) {
 return $0.a1.a2(undefined)(undefined)($0.a2(undefined)($10 => ({value:$1})))(m => $0.a1.a1.a2(undefined)(m));
}

function Control_Monad_Dom_Interface_case__prepareNode_4745($0, $1, $2, $3, $4, $5, $6) {
 switch($6.h) {
  case 0: return $0.a1.a2(undefined)(undefined)(Control_Monad_Dom_Interface_prepareNodes($0, $1, $3))($16 => $0.a1.a1.a2(undefined)({a1: {h: 0, a1: $2, a2: $5, a3: $4, a4: $16.a1}, a2: $16.a2}));
  default: return $0.a1.a2(undefined)(undefined)(Control_Monad_Dom_Interface_getRef($2, $0, $4, $5))($34 => $0.a1.a2(undefined)(undefined)(Control_Monad_Dom_Interface_prepareNodes($0, $1, $3))($44 => $0.a1.a1.a2(undefined)({a1: {h: 0, a1: $2, a2: $5, a3: $34.a1, a4: $44.a1}, a2: Prelude_Types_List_tailRecAppend(Prelude_Types_map_Functor_List($57 => $0.a3(undefined)($34.a2)($57), $6), $44.a2)})));
 }
}

function Control_Monad_Dom_Interface_n__16783_4579_go($0, $1, $2, $3, $4) {
 switch($3.h) {
  case 0: return $0.a1.a1.a2(undefined)({h: 1, a1: {a1: Prelude_Types_List_reverse($4.a1), a2: $4.a2}});
  case undefined: return $0.a1.a2(undefined)(undefined)(Control_Monad_Dom_Interface_prepareNode($0, $1, $3.a1))($22 => $0.a1.a1.a2(undefined)({h: 0, a1: $3.a2, a2: {a1: {a1: $22.a1, a2: $4.a1}, a2: Prelude_Types_List_tailRecAppend($22.a2, $4.a2)}}));
 }
}

function Control_Monad_Dom_Interface_strictGetElementById($0, $1, $2, $3) {
 const $12 = $13 => {
  switch($13.h) {
   case 0: return $0.a2(undefined)(Control_Monad_Error_Interface_throwError_MonadError_x24e_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), {h: 0, a1: Prelude_Interfaces_concat(csegen_1(), csegen_16(), {a1: 'Control.Monad.Dom.Interface.strictGetElementById: Could not find ', a2: {a1: $2, a2: {a1: ' with id ', a2: {a1: $3, a2: {h: 0}}}}})}));
   case undefined: return $0.a1.a1.a1.a2(undefined)($13.a1);
  }
 };
 return $0.a1.a1.a2(undefined)(undefined)(Web_Dom_castElementById($0, $1, $3))($12);
}

function Control_Monad_Dom_Interface_Attribute_ref($0) {
 return {h: 0, a1: $0.a3};
}

function Control_Monad_Dom_Interface_prepareNodes($0, $1, $2) {
 return $1.a2(undefined)(undefined)(undefined)(undefined)($2)({a1: {h: 0}, a2: {h: 0}})(undefined)($16 => $17 => Control_Monad_Dom_Interface_n__16783_4579_go($0, $1, $2, $16, $17));
}

function Control_Monad_Dom_Interface_prepareNode($0, $1, $2) {
 switch($2.h) {
  case 0: return Control_Monad_Dom_Interface_case__prepareNode_4745($0, $1, $2.a1, $2.a4, $2.a3, $2.a2, Text_Html_Attribute_getEvents($2.a3));
  case 1: return $0.a1.a1.a2(undefined)({a1: $2, a2: {h: 0}});
  case 2: return $0.a1.a1.a2(undefined)({a1: $2, a2: {h: 0}});
 }
}

function Control_Monad_Dom_Interface_innerHtmlAt($0, $1, $2, $3, $4) {
 return $2.a1.a2(undefined)(undefined)(Control_Monad_Dom_Interface_castElementByRef($0, $11 => $12 => Web_Internal_DomTypes_safeCast_SafeCast_Element($12), $3))(elem => $2.a1.a2(undefined)(undefined)(Control_Monad_Dom_Interface_prepareNode($2, $1, $4))($25 => Prelude_Interfaces_x3ex3e($2.a1, $0.a2(undefined)(JS_Attribute_x2ex3d(Web_Raw_Dom_InnerHTML_innerHTML(elem), Text_Html_Node_render($25.a1))), () => Data_Iterable_forM_($3a => $3b => $3c => $3d => $3e => $3f => $40 => $41 => Data_Iterable_iterM_Iterable_x28Listx20x24ax29_x24a($3d, $3e, $3f, $40, $41), $1, x => x, $25.a2))));
}

function Control_Monad_Dom_Interface_getRef($0, $1, $2, $3) {
 const $4 = Text_Html_Attribute_getId($2);
 switch($4.h) {
  case undefined: return $1.a1.a1.a2(undefined)({a1: $2, a2: {h: 0, a1: $0, a2: $3, a3: $4.a1}});
  case 0: return Prelude_Interfaces_x3cx24x3e($1.a1.a1.a1, i => ({a1: {a1: {h: 0, a1: i}, a2: $2}, a2: {h: 0, a1: $0, a2: $3, a3: i}}), $1.a2);
 }
}

const Control_Monad_Dom_Interface_err = __lazy(function () {
 return 'Control.Monad.Dom.Interface.castElementByRef';
});

function Control_Monad_Dom_Interface_castElementByRef($0, $1, $2) {
 switch($2.h) {
  case 0: return Control_Monad_Dom_Interface_strictGetElementById($0, $1, $2.a1, $2.a3);
  case 1: return Web_Dom_getElementByClass($0, $1, $2.a3);
  case 3: return $0.a2(undefined)(Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Web_Dom_body(), $18 => JS_Inheritance_tryCast($1, () => Control_Monad_Dom_Interface_err(), $18)));
  case 4: return $0.a2(undefined)(Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Web_Dom_document(), $29 => JS_Inheritance_tryCast($1, () => Control_Monad_Dom_Interface_err(), $29)));
  case 5: return $0.a2(undefined)(Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Web_Dom_window(), $3a => JS_Inheritance_tryCast($1, () => Control_Monad_Dom_Interface_err(), $3a)));
  case 2: return $0.a2(undefined)(JS_Inheritance_tryCast($1, () => Control_Monad_Dom_Interface_err(), $2.a1));
 }
}

function Control_Monad_Dom_Event_mouseInfo($0) {
 return Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $2d => $2e => $2f => $30 => $31 => $32 => $33 => $34 => $35 => $36 => ({a1: $2d, a2: $2e, a3: $2f, a4: $30, a5: $31, a6: $32, a7: $33, a8: $34, a9: $35, a10: $36})), Web_Raw_UIEvents_MouseEvent_button($0)), Web_Raw_UIEvents_MouseEvent_buttons($0)), Web_Raw_UIEvents_MouseEvent_clientX($0)), Web_Raw_UIEvents_MouseEvent_clientY($0)), Web_Raw_UIEvents_MouseEvent_screenX($0)), Web_Raw_UIEvents_MouseEvent_screenY($0)), Web_Raw_UIEvents_MouseEvent_altKey($0)), Web_Raw_UIEvents_MouseEvent_ctrlKey($0)), Web_Raw_UIEvents_MouseEvent_metaKey($0)), Web_Raw_UIEvents_MouseEvent_shiftKey($0));
}

function Control_Monad_Dom_Event_keyInfo($0) {
 return Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $25 => $26 => $27 => $28 => $29 => $2a => $2b => $2c => ({a1: $25, a2: $26, a3: $27, a4: $28, a5: $29, a6: $2a, a7: $2b, a8: $2c})), Web_Raw_UIEvents_KeyboardEvent_key($0)), Web_Raw_UIEvents_KeyboardEvent_code($0)), Web_Raw_UIEvents_KeyboardEvent_location($0)), Web_Raw_UIEvents_KeyboardEvent_isComposing($0)), Web_Raw_UIEvents_KeyboardEvent_altKey($0)), Web_Raw_UIEvents_KeyboardEvent_ctrlKey($0)), Web_Raw_UIEvents_KeyboardEvent_metaKey($0)), Web_Raw_UIEvents_KeyboardEvent_shiftKey($0));
}

function Control_Monad_Dom_Event_inputInfo($0) {
 return Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), csegen_571(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $f => Control_Monad_Dom_Event_prim__input(Builtin_believe_me($0), $f))), Prelude_Interfaces_x3cx24x3e(csegen_259(), csegen_572(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $20 => Control_Monad_Dom_Event_prim__checked(Builtin_believe_me($0), $20))));
}

function Control_Monad_Dom_Event_changeInfo($0) {
 return Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), Control_Monad_Error_Either_x3cx2ax3e_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), csegen_571(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $f => Control_Monad_Dom_Event_prim__input($0, $f))), Prelude_Interfaces_x3cx24x3e(csegen_259(), csegen_572(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $1e => Control_Monad_Dom_Event_prim__checked($0, $1e))));
}

function Web_Raw_UIEvents_MouseEvent_shiftKey($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'MouseEvent.shiftKey', $8 => Web_Internal_UIEventsPrim_MouseEvent_prim__shiftKey(Builtin_believe_me($0), $8));
}

function Web_Raw_UIEvents_KeyboardEvent_shiftKey($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'KeyboardEvent.shiftKey', $8 => Web_Internal_UIEventsPrim_KeyboardEvent_prim__shiftKey($0, $8));
}

function Web_Raw_UIEvents_MouseEvent_screenY($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_MouseEvent_prim__screenY(Builtin_believe_me($0), $5));
}

function Web_Raw_UIEvents_MouseEvent_screenX($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_MouseEvent_prim__screenX(Builtin_believe_me($0), $5));
}

function Web_Raw_UIEvents_MouseEvent_metaKey($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'MouseEvent.metaKey', $8 => Web_Internal_UIEventsPrim_MouseEvent_prim__metaKey(Builtin_believe_me($0), $8));
}

function Web_Raw_UIEvents_KeyboardEvent_metaKey($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'KeyboardEvent.metaKey', $8 => Web_Internal_UIEventsPrim_KeyboardEvent_prim__metaKey($0, $8));
}

function Web_Raw_UIEvents_KeyboardEvent_location($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_KeyboardEvent_prim__location($0, $5));
}

function Web_Raw_UIEvents_KeyboardEvent_key($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_KeyboardEvent_prim__key($0, $5));
}

function Web_Raw_UIEvents_KeyboardEvent_isComposing($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'KeyboardEvent.isComposing', $8 => Web_Internal_UIEventsPrim_KeyboardEvent_prim__isComposing($0, $8));
}

function Web_Raw_UIEvents_MouseEvent_ctrlKey($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'MouseEvent.ctrlKey', $8 => Web_Internal_UIEventsPrim_MouseEvent_prim__ctrlKey(Builtin_believe_me($0), $8));
}

function Web_Raw_UIEvents_KeyboardEvent_ctrlKey($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'KeyboardEvent.ctrlKey', $8 => Web_Internal_UIEventsPrim_KeyboardEvent_prim__ctrlKey($0, $8));
}

function Web_Raw_UIEvents_KeyboardEvent_code($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_KeyboardEvent_prim__code($0, $5));
}

function Web_Raw_UIEvents_MouseEvent_clientY($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_MouseEvent_prim__clientY(Builtin_believe_me($0), $5));
}

function Web_Raw_UIEvents_MouseEvent_clientX($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_MouseEvent_prim__clientX(Builtin_believe_me($0), $5));
}

function Web_Raw_UIEvents_MouseEvent_buttons($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_MouseEvent_prim__buttons(Builtin_believe_me($0), $5));
}

function Web_Raw_UIEvents_MouseEvent_button($0) {
 return Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $5 => Web_Internal_UIEventsPrim_MouseEvent_prim__button(Builtin_believe_me($0), $5));
}

function Web_Raw_UIEvents_MouseEvent_altKey($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'MouseEvent.altKey', $8 => Web_Internal_UIEventsPrim_MouseEvent_prim__altKey(Builtin_believe_me($0), $8));
}

function Web_Raw_UIEvents_KeyboardEvent_altKey($0) {
 return JS_Marshall_tryJS($3 => JS_Boolean_fromFFI_FromFFI_Bool_Boolean($3), () => 'KeyboardEvent.altKey', $8 => Web_Internal_UIEventsPrim_KeyboardEvent_prim__altKey($0, $8));
}

function Control_Monad_Dom_DomIO_n__21433_39229_handle($0, $1, $2, $3, $4, $5) {
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $e => ($2.value)), sf1 => Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Data_MSF_Running_step(csegen_95(), sf1, $5)($4), $1f => Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $25 => ($2.value=$1f.a2))));
}

function Control_Monad_Dom_DomIO_n__19423_37038_handle($0, $1, $2, $3, $4, $5, $6) {
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Web_Dom_callback_Callback_EventListener_x28x25pix20RigWx20Explicitx20Nothingx20Eventx20x28JSIOx20x28x7cUnitx2cMkUnitx7cx29x29x29(e => Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), JS_Inheritance_tryCast_($3, () => 'Control.Monad.Dom.DomIO.handle', e), va => Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), $5(va), $1d => Prelude_Types_maybe(() => csegen_144(), () => $0, $6($1d))))), c => Web_Raw_Dom_EventTarget_addEventListenerx27($2, $4, {a1: c}));
}

function Control_Monad_Dom_DomIO_tailRecM_MonadRec_x28x28DomIOx20x24ex29x20x24iox29($0, $1, $2, $3, $4) {
 return $0.a2(undefined)(undefined)(undefined)(undefined)($1)($2)(undefined)($16 => $17 => Control_Monad_Dom_DomIO_convR($3, $4, $16, $17));
}

function Control_Monad_Dom_DomIO_pure_Applicative_x28x28DomIOx20x24evx29x20x24iox29($0, $1, $2) {
 return $0.a2(undefined)($1);
}

function Control_Monad_Dom_DomIO_map_Functor_x28x28DomIOx20x24evx29x20x24iox29($0, $1, $2, $3) {
 return $0(undefined)(undefined)($1)($2($3));
}

function Control_Monad_Dom_DomIO_liftJSIO_LiftJSIO_x28x28DomIOx20x24evx29x20x24iox29($0, $1, $2) {
 return $0.a2(undefined)($1);
}

function Control_Monad_Dom_DomIO_liftIO_HasIO_x28x28DomIOx20x24evx29x20x24iox29($0, $1, $2) {
 return $0.a2(undefined)($1);
}

function Control_Monad_Dom_DomIO_join_Monad_x28x28DomIOx20x24evx29x20x24iox29($0, $1, $2) {
 return Control_Monad_Dom_DomIO_x3ex3ex3d_Monad_x28x28DomIOx20x24evx29x20x24iox29($0, $1, $7 => $7, $2);
}

function Control_Monad_Dom_DomIO_x3ex3ex3d_Monad_x28x28DomIOx20x24evx29x20x24iox29($0, $1, $2, $3) {
 return $0.a2(undefined)(undefined)($1($3))($f => $2($f)($3));
}

function Control_Monad_Dom_DomIO_x3cx2ax3e_Applicative_x28x28DomIOx20x24evx29x20x24iox29($0, $1, $2, $3) {
 return $0.a3(undefined)(undefined)($1($3))($2($3));
}

function Control_Monad_Dom_DomIO_registerImpl($0, $1, $2) {
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Control_Monad_Dom_Interface_castElementByRef(csegen_118(), $c => $d => Web_Internal_DomTypes_safeCast_SafeCast_EventTarget($d), $0), el => Control_Monad_Dom_DomIO_registerDOMEvent(el, $1, $2.a3));
}

function Control_Monad_Dom_DomIO_registerDOMEvent($0, $1, $2) {
 switch($1.h) {
  case 14: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, $9 => $a => Web_Internal_UIEventsTypes_safeCast_SafeCast_InputEvent($a), 'input', $f => Control_Monad_Dom_Event_inputInfo($f), $1.a1);
  case 13: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_575(), 'change', $1b => Control_Monad_Dom_Event_changeInfo($1b), $1.a1);
  case 0: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'click', $27 => Control_Monad_Dom_Event_mouseInfo($27), $1.a1);
  case 1: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'dblclick', $33 => Control_Monad_Dom_Event_mouseInfo($33), $1.a1);
  case 11: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_577(), 'keydown', $3f => Control_Monad_Dom_Event_keyInfo($3f), $1.a1);
  case 12: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_577(), 'keyup', $4b => Control_Monad_Dom_Event_keyInfo($4b), $1.a1);
  case 9: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_575(), 'blur', $57 => Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $1.a1), $5d => ({a1: $5d}));
  case 10: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_575(), 'focus', $67 => Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $1.a1), $6d => ({a1: $6d}));
  case 2: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'mousedown', $77 => Control_Monad_Dom_Event_mouseInfo($77), $1.a1);
  case 3: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'mouseup', $83 => Control_Monad_Dom_Event_mouseInfo($83), $1.a1);
  case 4: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'mouseenter', $8f => Control_Monad_Dom_Event_mouseInfo($8f), $1.a1);
  case 5: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'mouseleave', $9b => Control_Monad_Dom_Event_mouseInfo($9b), $1.a1);
  case 6: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'mouseover', $a7 => Control_Monad_Dom_Event_mouseInfo($a7), $1.a1);
  case 7: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'mouseout', $b3 => Control_Monad_Dom_Event_mouseInfo($b3), $1.a1);
  case 8: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_576(), 'mousemove', $bf => Control_Monad_Dom_Event_mouseInfo($bf), $1.a1);
  case 15: return Control_Monad_Dom_DomIO_n__19423_37038_handle($2, $1, $0, csegen_575(), 'hashchange', $cb => Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $1.a1), $d1 => ({a1: $d1}));
 }
}

function Control_Monad_Dom_DomIO_reactimateDom_($0, $1, $2, $3) {
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Control_Monad_Dom_DomIO_mkRefs($1, $3), $c => Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), $2($c.a3), $15 => Prelude_Interfaces_x3ex3e(csegen_89(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $1f => ($c.a1.value=$15.a1)), () => Prelude_Interfaces_x3ex3e(csegen_89(), Prelude_Interfaces_traverse_(csegen_71(), {a1: acc => elem => func => init => input => Prelude_Types_foldr_Foldable_Maybe(func, init, input), a2: elem => acc => func => init => input => Prelude_Types_foldl_Foldable_Maybe(func, init, input), a3: elem => $38 => Prelude_Types_null_Foldable_Maybe($38), a4: elem => acc => m => $3c => funcM => init => input => Prelude_Types_foldlM_Foldable_Maybe($3c, funcM, init, input), a5: elem => $43 => Prelude_Types_toList_Foldable_Maybe($43), a6: a => m => $47 => f => $48 => Prelude_Types_foldMap_Foldable_Maybe($47, f, $48)}, $c.a3.a3, $0), () => Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), $15.a2)))));
}

function Control_Monad_Dom_DomIO_mkRefs($0, $1) {
 const $b = sfRef => {
  const $16 = hRef => {
   const $17 = {a1: $0, a2: $1, a3: ev => Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $23 => (hRef.value)), $28 => $28(ev))};
   return Prelude_Interfaces_x3ex3e(csegen_89(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $33 => (hRef.value=$37 => Control_Monad_Dom_DomIO_n__21433_39229_handle($1, $0, sfRef, hRef, $17, $37))), () => Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), {a1: sfRef, a2: hRef, a3: $17}));
  };
  return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Data_IORef_newIORef(csegen_114(), $14 => csegen_144()), $16);
 };
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Data_IORef_newIORef(csegen_114(), {h: 1, a1: undefined}), $b);
}

function Control_Monad_Dom_DomIO_env($0, $1) {
 return $0.a1.a2(undefined)($1);
}

function Control_Monad_Dom_DomIO_createId($0) {
 return Control_Monad_Error_Either_x3ex3ex3d_Monad_x28x28EitherTx20x24ex29x20x24mx29(csegen_83(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $a => ($0.a2.value)), n => Prelude_Interfaces_x3ex3e(csegen_89(), Control_Monad_Error_Either_liftIO_HasIO_x28x28EitherTx20x24ex29x20x24mx29(csegen_111(), $17 => ($0.a2.value=(n+1n))), () => Control_Monad_Error_Either_pure_Applicative_x28x28EitherTx20x24ex29x20x24mx29(csegen_65(), ($0.a1+Prelude_Show_show_Show_Nat(n)))));
}

function Control_Monad_Dom_DomIO_convR($0, $1, $2, $3) {
 return $0($2)($3)($1);
}


try{__mainExpression_0()}catch(e){if(e instanceof IdrisError){console.log('ERROR: ' + e.message)}else{throw e} }

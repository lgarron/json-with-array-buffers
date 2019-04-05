function base64ToBuffer(base64Str) {
  const str = atob(base64Str)
  const buffer = new ArrayBuffer(str.length)
  const byteView = new Uint8Array(buffer)
  for (let i = 0; i < str.length; i++) {
    byteView[i] = str.charCodeAt(i)
  }
  return buffer
}

function base64FromBuffer(buffer) {
  // TODO: any
  const byteView: any = new Uint8Array(buffer)
  let str = ''
  for (const charCode of byteView) {
    str += String.fromCharCode(charCode)
  }
  return btoa(str)
}

// TODO: Avoid _rawType collisions.
function replacer(k: any, v: any) {
  if (v instanceof Uint8Array) {
    return {
      "_rawType": "Uint8Array",
      "value": base64FromBuffer(v)
    };
  }
  console.log(this, k, v, this, this instanceof Uint8Array);
  return v;
}

function stringify(j, indentation?: string) {
  return JSON.stringify(j, replacer, indentation)
}

function reviver(k, v) {
  console.log(k, v);
  if (v._rawType == "Uint8Array") {
    return base64ToBuffer(v.value)
  }
  return v;
}

function parse(s: string) {
  return JSON.parse(s, reviver);
}

const arr = new Uint8Array(4);
console.log(arr);

const s = stringify({"hi": arr, "cat": "foo"})
console.log("----");
console.log(s);
console.log(parse(s));

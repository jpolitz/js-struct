var struct_proto = {};
var make_struct = function(name /*, varargs */) {
  var fields = [].slice.call(arguments, 1);
  var to_string = function() {
    var str = "{\n";
    for(var i = 0; i < fields.length; i++) {
      str += "  " + fields[i] + ": " + String(this[fields[i]]) + ",\n";
    }
    str += "}";
    return str;
  };
  var proto = Object.create(struct_proto, {toString: {value:to_string}});
  return {
    name: name,
    detector: function(elt) { return Object.getPrototypeOf(elt) === proto; },
    constructor: function(/* varargs */) {
      if(arguments.length !== fields.length) {
        throw "make-" + name + ": Wrong number of arguments, expected " + fields.length + ", got " + arguments.length;
      }
      var structobj = {};
      for(var i = 0; i < fields.length; i++) {
        structobj[fields[i]] = {value: arguments[i]};
      }
      return Object.freeze(Object.create(proto, structobj));
    }
  };
};

var global_struct = function(the_struct) {
  var detector_name = "is_" + the_struct.name;
  var constructor_name = "make_" + the_struct.name;
  if (detector_name in window || constructor_name in window) {
    throw "define-struct: " + name + " already defined";
  }
  window["is_" + the_struct.name] = the_struct.detector;
  window["make_" + the_struct.name] = the_struct.constructor;
};

var struct = function(name /*, varargs */) {
  var the_struct = make_struct.apply(null, arguments);
  global_struct(the_struct);
};

var struct_equal = function(s1, s2) {
  var proto_of = Object.getPrototypeOf;
  function is_struct(s) {
    return typeof s === "object" &&
      proto_of(proto_of(s)) === struct_proto;
  }
  // This bottoms out the primitive case and any objects that are
  // reference-equal (more than just structs)
  if (s1 === s2) { return true; }
  // Only deep-compare structs
  if (!(is_struct(s1) && is_struct(s2))) { return false; }

  // Are they the same kind of struct?
  if(proto_of(s1) !== proto_of(s2)) {
    return false;
  }
  var allsame = true;
  // TODO(joe): cyclic check
  Object.keys(s1).map(function(k) {
    if (!struct_equal(s1[k], s2[k])) { allsame = false; }
  });
  return allsame;
};

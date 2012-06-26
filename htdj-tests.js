var errors = [];
var check_expect = function(v1, v2) {
  if(!struct_equal(v1, v2)) {
    errors.push('Got ' + v1 + ', expected ' + v2);
  }
};

var check_not_equal = function(v1, v2) {
  if(struct_equal(v1, v2)) {
    errors.push('Got ' + v1 + ' = ' + v2 + ' , expected different.');
  }
};

var check_exn = function(f, errstr) {
  var result;
  try {
    result = f();
  } catch(e) {
    if(String(e).indexOf(errstr) === -1) {
      errors.push('Expected ' + f + ' to give an error like ' + errstr +
                  ', got ' + String(e) + ' instead');
    }
    return;
  }
  errors.push('Expected ' + f + ' to give an error, it did not, and returned ' + result);
};

struct('point', 'x', 'y');
var pt = make_point(5, 0);
check_expect(is_point(pt), true);
check_expect(pt.x, 5);
check_expect(pt.y, 0);

check_exn(function() { struct('point', 'foo'); }, 'already defined');
check_exn(function() { make_point(67); }, 'Wrong number of arguments');

// move_right : point -> point
function move_right(a_pt, amount) {
  return make_point(a_pt.x + amount, a_pt.y);
}

check_expect(move_right(pt, 5), make_point(10, 0));
check_not_equal(make_point(10, 0), {x:10, y:0});


// A treenode is a
// make_empty(); or
// make_tree(number, treenode, treenode)
struct('empty');
struct('tree', 'data', 'left', 'right');

// tree_sum : treenode -> number
function tree_sum(a_tree) {
  if(is_empty(a_tree)) { return 0; }
  if(is_tree(a_tree)) {
    return a_tree.data + tree_sum(a_tree.left) + tree_sum(a_tree.right);
  }
}

check_expect(tree_sum(make_empty()), 0);
var tree1 = make_tree(5, make_empty(), make_empty());
check_expect(tree_sum(tree1), 5);
var tree2 = make_tree(4, tree1, make_empty());
check_expect(tree_sum(tree2), 9);
var tree3 = make_tree(-1, tree1, tree2);
check_expect(tree_sum(tree3), 13);


// increment_tree : treenode -> treenode
function increment_tree(a_tree) {
  if(is_empty(a_tree)) { return make_empty(); }
  if(is_tree(a_tree)) {
    return make_tree(
      a_tree.data + 1,
      increment_tree(a_tree.left),
      increment_tree(a_tree.right)
    );
  }
}

var mt = make_empty();
check_expect(increment_tree(mt), mt);
check_expect(increment_tree(tree1), make_tree(6, mt, mt));
check_expect(increment_tree(tree2), make_tree(5, make_tree(6, mt, mt), mt));


if(errors.length === 0) {
  console.log('Everything succeeded!');
} else {
  console.log('Failures: ', errors);
}

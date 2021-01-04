function add1(x) {
  return function add2(y) {
    return x + y;
  };
}

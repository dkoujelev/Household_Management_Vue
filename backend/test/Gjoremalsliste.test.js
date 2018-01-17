// https://facebook.github.io/jest/docs/en/using-matchers.html

test('Test at noe er lik noe annet',() => {
  expect(1+2).toEqual(3);
});

test('Test at noe er null', () => {
  expect(null).toBeNull();
});

test('Test at noe er undefined', () => {
  let x;
  expect(x).toBeUndefined();
});

test('Test at noe er definert', () => {
  let x = 'x';
  expect(x).toBeDefined();
});

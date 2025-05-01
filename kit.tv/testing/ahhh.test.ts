import { add } from './ahhh';

describe('add function', () => {
  test('correctly adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('handles negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });
});

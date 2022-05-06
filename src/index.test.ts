/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statement */
import { helloWorld } from ".";
import fc from "fast-check";

describe("saying hello", () => {
  // Our special or important cases that are tested explicitly.
  it.each(["Jane", ""] as const)("returns the expected greeting", (name) => {
    const actual = helloWorld(name);
    expect(actual).toEqual(`Hello, ${name}!`);
  });
  // Our property based tests that cover a lot of ground, but no particular cases.
  it("should always include the name in the greeting", () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const actual = helloWorld(s);
        expect(actual).toContain(s);
      })
    );
  });
});

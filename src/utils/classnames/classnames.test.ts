import classnames from "./classnames";

describe("classnames()", () => {
  it("returns an empty string when given no values", () => {
    const calculated = classnames();
    expect(calculated).toBe("");
  });
  it("returns the proper classnames for an array of strings", () => {
    const ARGS = ["class1", "class2", "class3"];
    const EXPECTED = "class1 class2 class3";

    const calculated = classnames(...ARGS);
    expect(calculated).toBe(EXPECTED);
  });
  it("returns proper classnames for strings & numbers", () => {
    const ARGS = [1, 2, "3"];
    const EXPECTED = "1 2 3";

    const calculated = classnames(...ARGS);
    expect(calculated).toBe(EXPECTED);
  });
  it("ignores null, boolean, and undefined values", () => {
    const ARGS = [1, 2, false, undefined, null, "3"];
    const EXPECTED = "1 2 3";

    const calculated = classnames(...ARGS);
    expect(calculated).toBe(EXPECTED);
  });
  it("returns proper classnames for object maps", () => {
    const ARGS = [
      {
        testClass1: true,
        testClass2: false,
        testClass3: true,
      },
    ];
    const EXPECTED = "testClass1 testClass3";

    const calculated = classnames(...ARGS);
    expect(calculated).toBe(EXPECTED);
  });
  it("correctly processes empty and false objects", () => {
    const ARGS = [{}, "test1", { test2: true }, { test3: false }];
    const EXPECTED = "test1 test2";

    const calculated = classnames(...ARGS);
    expect(calculated).toBe(EXPECTED);
  });
});

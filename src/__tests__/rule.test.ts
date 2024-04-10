import { compareNumbers } from "../evaluation/rule"

describe("compareNumbers", () => {
  test("compares two BigInts correctly", () => {
    expect(compareNumbers(BigInt(5), BigInt(5))).toBe(true)
    expect(compareNumbers(BigInt(5), BigInt(6))).toBe(false)
  })

  test("compares two numbers (integers) correctly", () => {
    expect(compareNumbers(5, 5)).toBe(true)
    expect(compareNumbers(5, 6)).toBe(false)
  })

  test("compares two numbers (with a float) correctly", () => {
    expect(compareNumbers(5.5, 5.5)).toBe(true)
    expect(compareNumbers(5.5, 6.5)).toBe(false)
  })

  test("compares BigInt and integer number correctly", () => {
    expect(compareNumbers(BigInt(5), 5)).toBe(true)
    expect(compareNumbers(BigInt(5), 6)).toBe(false)
  })

  test("returns false when comparing BigInt and float", () => {
    expect(compareNumbers(BigInt(5), 5.5)).toBe(false)
  })

  test("returns false when comparing float and BigInt", () => {
    expect(compareNumbers(5.5, BigInt(5))).toBe(false)
  })
})

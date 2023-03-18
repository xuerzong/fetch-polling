import { isFunction, isPromise } from '../../_utils/is'

test('utils::isPromise', () => {
  expect(isPromise(Promise.resolve())).toBe(true)
  expect(isPromise(1)).toBe(false)
})

test('utils::isPromise', () => {
  expect(isFunction(() => { })).toBe(true)
  expect(isFunction(1)).toBe(false)
})
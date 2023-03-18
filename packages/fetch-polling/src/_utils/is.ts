import { tuple } from "./type"

const isTypes = tuple('Promise', 'Function')

const is = (value: unknown, type: typeof isTypes[number]) => {
  return Object.prototype.toString.call(value) === `[object ${type}]`
}

export const isPromise = <T>(value: any): value is Promise<T> => is(value, 'Promise')

export const isFunction = (value: unknown): value is Function => is(value, 'Function')
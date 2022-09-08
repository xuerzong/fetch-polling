import { isPromise, isFunction } from './_utils/is'

type Delay = number | (() => number)

type Options<R = unknown> = {
  fetch: (() => Promise<R>) | (() => R)

  shouldStop?(result: R | null): boolean

  onError?(e: any): void

  onProcess?(result: R | null): void

  onDone?(result: R | null): void

  onCancel?(): void

  delay?: Delay

  absoluteDelay?: boolean

  immediate?: boolean
}


interface FetchPollingInterface {
  start(): void
  cancel(): void
}

enum States {
  Pending = 'pending',
  Done = 'done',
  Cancel = 'cancel'
}

export default class FetchPolling<R> implements FetchPollingInterface {
  private state: States
  private options: Options<R>

  constructor(options: Options<R>) {
    this.state = States.Pending
    this.options = options
  }

  async start() {
    if (this.state !== States.Pending) {
      return
    }
    return this._start().then(this.options.onDone).catch(this.options.onError)
  }

  cancel() {
    this.options.onCancel?.()
    this.state = States.Cancel
  }

  private _start() {
    return this._run(this.options.immediate)
  }

  private _run(immediate = false) {
    const optionsDelay = isFunction(this.options.delay) ? this.options.delay() : (this.options.delay || 0)
    const promise = new Promise<R>((resolve, reject) => {
      setTimeout(() => {
        let fetchResult = this.options.fetch()
        if(!isPromise<R>(fetchResult)) {
          fetchResult = Promise.resolve(fetchResult)
        }
        fetchResult.then(resolve).catch(reject)
      }, immediate ? 0 : optionsDelay)
    })
    return this._next(promise)
  }

  private _next(p: Promise<R>): Promise<R> {
    const thenCb = (e: R) => {
      if(this.state === States.Cancel) {
        return Promise.reject('CANCELLED')
      }
      this.options.onProcess?.(e)
      const isDone = Boolean(this.options.shouldStop?.(e))
      if(isDone) {
        this.state = States.Done
        return e
      }
      return this._run()
    }
    const catchCb = (e: any) => {
      if(this.state === States.Cancel) {
        return Promise.reject('CANCELLED')
      }
      this.options.onError?.(e)
      return this._run()
    }
    return p.then(thenCb).catch(catchCb)
  }
}
type Delay = number | (() => number)

type Options<R = unknown> = {
  fetch: (() => Promise<R>) | (() => R)

  shouldStop?(result: R | null): boolean

  onError?(e: any): void

  onProcess?(result: R | null): void

  onDone?(result: R | null): void

  onCancel?(): void

  delay?: Delay,

  absoluteDelay?: boolean
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

class FetchPolling<R> implements FetchPollingInterface {
  private timeoutId: number | NodeJS.Timeout | null
  private state: States
  private options: Options<R>

  constructor(options: Options<R>) {
    this.timeoutId = null
    this.state = States.Pending
    this.options = options
  }

  async start() {
    if (this.state !== States.Pending) {
      return
    }

    let fetchResult: R | null = null
    let fetchTime: number = 0

    while (true) {
      try {
        const startTime = Date.now()
        fetchResult = await this.options.fetch()
        const endTime = Date.now()
        fetchTime = endTime - startTime

        this.options.onProcess?.(fetchResult)
        const isDone = Boolean(this.options.shouldStop?.(fetchResult))
        if (isDone) {
          this.options.onDone?.(fetchResult)
          this.state = States.Done
          break;
        }
      } catch (e) {
        this.options.onError?.(e)
      }
      const optionsDelay = typeof this.options.delay === 'function' ? this.options.delay() : (this.options.delay || 0)
      const sleepDelay = this.options.absoluteDelay ? Math.max(optionsDelay - fetchTime, 0) : optionsDelay
      await this.sleep(sleepDelay)
    }
  }

  cancel() {
    if (this.timeoutId) {
      typeof window === 'undefined' ?
        clearTimeout(this.timeoutId as NodeJS.Timeout) :
        window.clearTimeout(this.timeoutId as number)
    }
    this.options.onCancel?.()
    this.state = States.Cancel
  }

  private sleep(delay: number) {
    return new Promise(resolve => {
      this.timeoutId = setTimeout(resolve, Math.max(delay, 0))
    })
  }
}
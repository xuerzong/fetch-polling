import { useRef } from 'react'
import type { Options } from 'fetch-polling'
import FetchPolling from 'fetch-polling'

export function useFetchPolling<T>(options: Options<T>) {
  const fp = useRef<FetchPolling<T>>(new FetchPolling(options))
  return fp
}

export { FetchPolling, Options as FetchPollingOptions }
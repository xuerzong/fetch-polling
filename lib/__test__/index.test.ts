import FetchPolling from '..'

const mockCalledTime = 5

test('`shouldStop` should be able to make the process end', async () => {
  let fetchTime = 0;
  const fetchMock = jest.fn(() => Promise.resolve(fetchTime++))
  const fetchPolling = new FetchPolling({
    fetch: fetchMock,
    shouldStop: () => fetchTime === mockCalledTime
  })

  await fetchPolling.start()

  expect(fetchMock).toHaveBeenCalledTimes(mockCalledTime)
})


test('`onDone` should be run when `shouldStop` return true', async () => {
  let fetchTime = 0;
  const fetchMock = jest.fn(() => Promise.resolve(fetchTime++))
  const onDone = jest.fn(res => res)
  const fetchPolling = new FetchPolling({
    fetch: fetchMock,
    shouldStop: () => fetchTime === mockCalledTime,
    onDone
  })

  await fetchPolling.start()
  expect(onDone.mock.results[0].value).toBe(mockCalledTime - 1)
  expect(onDone).toHaveBeenCalledTimes(1)
})


test('`onProcess` should run on every fetch', async () => {
  let fetchTime = 0;
  const fetchMock = () => Promise.resolve(fetchTime++)
  const onProcess = jest.fn()
  const fetchPolling = new FetchPolling({
    fetch: fetchMock,
    shouldStop: () => fetchTime === mockCalledTime,
    onProcess
  })

  await fetchPolling.start()
  expect(onProcess).toHaveBeenCalledTimes(mockCalledTime)
})
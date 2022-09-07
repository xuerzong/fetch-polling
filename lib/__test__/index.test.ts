import FetchPolling from '..'

test('`shouldStop` should be able to make the process end', async () => {
  let fetchTime = 0;
  const fetchMock = jest.fn(() => Promise.resolve(fetchTime++))
  const fetchPolling = new FetchPolling({
    fetch: fetchMock,
    shouldStop: () => fetchTime === 5
  })

  await fetchPolling.start()

  expect(fetchMock).toHaveBeenCalledTimes(5)
})
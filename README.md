# Fetch-polling

Simple fetch polling


## Get started

```ts

const fetchFunc = () => {
  return fetch('https://api.github.com/repos/xuerzong/fetch-polling').then(res => res.json())
}

const options = {
  fetch: fetchFunc,
  delay: 500 /* ms */
}

const fetchPolling = new FetchPolling(options)

fetchPolling.start()
```

## License

[MIT](./LICENSE)
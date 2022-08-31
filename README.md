# Fetch-polling

Simple fetch polling


## Get started

```bash
yarn add fetch-polling
```

```ts
import FetchPolling from 'fetch-polling'

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
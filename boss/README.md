# boss

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Static site gated content system.

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `boss` dependency to your project

```bash
yarn add boss # or npm install boss
```

2. Add `boss` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    'boss',

    // With options
    ['boss', { /* module options */ }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Ben Bozzay <ben@fullstackdigital.com>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/boss/latest.svg
[npm-version-href]: https://npmjs.com/package/boss

[npm-downloads-src]: https://img.shields.io/npm/dt/boss.svg
[npm-downloads-href]: https://npmjs.com/package/boss

[github-actions-ci-src]: https://github.com/bbozzay/nuxt-boss/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/bbozzay/nuxt-boss/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/bbozzay/nuxt-boss.svg
[codecov-href]: https://codecov.io/gh/bbozzay/nuxt-boss

[license-src]: https://img.shields.io/npm/l/boss.svg
[license-href]: https://npmjs.com/package/boss

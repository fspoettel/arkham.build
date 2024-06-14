# vite-react-ts-template

> extended version of [vite](https://vitejs.dev/)'s official `react-ts` template.

additional features:

- [eslint](https://eslint.org/) for linting.
- [vitest](https://vitest.dev/) + [testing-library](https://testing-library.com/) for testing.
- [prettier](https://prettier.io/) + [lint-staged](https://github.com/okonet/lint-staged) hook for code formatting.
- [github actions](https://github.com/features/actions) for continuous integration.
- [browserslist](https://github.com/browserslist/browserslist) + [autoprefixer](https://github.com/postcss/autoprefixer).

## Install

```sh
# install dependencies.
npm i
```

## Develop

```sh
npm run dev
```

## Build

```sh
npm run build
```

## Test

```sh
npm test

# run vitest in watch mode.
npm run test:watch

# collect coverage.
npm run test:coverage
```

## Lint

```sh
npm run lint
```

## Format

```sh
npm run fmt
```

Prettier will be run automatically on commit via [lint-staged](https://github.com/okonet/lint-staged).

## Preview

Serves the content of `./dist` over a local http server.

```sh
npm run preview
```

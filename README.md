# vote-demo

[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]

[travis-image]: https://img.shields.io/travis/zubincheung/vote-demo.svg?style=flat-square
[travis-url]: https://travis-ci.org/zubincheung/vote-demo
[codecov-image]: https://img.shields.io/codecov/c/github/zubincheung/vote-demo.svg?style=flat-square
[codecov-url]: https://codecov.io/github/zubincheung/vote-demo?branch=master
[david-image]: https://img.shields.io/david/zubincheung/vote-demo.svg?style=flat-square
[david-url]: https://david-dm.org/zubincheung/vote-demo

基于[midway][midway],Mysql 和 Redis 的简单投票系统。

### API

详见 [API 文档](./doc/api.md)

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm run build
$ npm start
$ npm stop
```

### docker 部署

```bash
$ npm run build
$ docker-compose build
$ docker-compose up
```

docker-compost 组件详见[https://docs.docker.com/compose/](https://docs.docker.com/compose/)

### 单元测试

- [midway-bin] 内置了 [mocha], [thunk-mocha], [power-assert], [istanbul] 等框架，让你可以专注于写单元测试，无需理会配套工具。
- 断言库非常推荐使用 [power-assert]。
- 具体参见 [midway 文档 - 单元测试](https://eggjs.org/zh-cn/core/unittest)。

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。
- 使用 `npm run autod` 来自动检测依赖更新，详细参见 [autod](https://www.npmjs.com/package/autod) 。

[midway]: https://midwayjs.org

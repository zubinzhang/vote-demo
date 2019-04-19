# api 文档

## 说明

1. 认证方式：jwt
2. 默认管理员帐号
   - 邮箱：admin@qq.com
   - 密码：123456

### 登录

`POST /user/login`

request：

```json
{
  "email": "admin@qq.com",
  "password": "123456"
}
```

response:

```json
{
  "userId": 1,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU1NTY2OTIxM30.B3dKqg85MK0wyp3DpTuZSfvYyTmGx4DVYLmhIPGVPH0"
}
```

### 用户注册

`POST /v1/users`

request：

```json
{
  "email": "zubincheung@163.com",
  "userName": "zubin",
  "password": "123456"
}
```

response:

```json
{
  "userId": 2,
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTU1NTY2OTMwMn0.9OPSwXHroOmqtETuYw3r-YHTRDPBq-sKG335YeFTfBk"
}
```

### 查看所有用户

`GET /v1/users`

## 选举活动

### 查看选举活动

`GET /v1/votes?limit=10&offset=0`
`GET /v1/votes/:voteId`

### 新增选举活动

`POST /v1/votes`
request:

```json
{
  "name": "选举活动1",
  "startDate": 1555674871,
  "endDate": 1555684871
}
```

### 查看候选人

`GET /v1/votes/:voteId/candidates`

### 新增候选人

`POST /v1/votes/:voteId/candidates`
request:

```json
{
  "voteId": 95,
  "candidateList": [254, 255]
}
```

### 删除候选人

`DELETE /v1/votes/:voteId/candidates/:candidateId`
request:

```json
[{ "name": "张三" }]
```

## 投票

`POST /v1/ballots`
request:

```json
{
  "voteId": 95,
  "candidateList": [254, 255]
}
```

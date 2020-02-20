# chilizi-user-auth

用户验证函数

## 测试

`yarn test`

## provider

此函数用于向用户管理提供 provider, 具体参考:  
<https://github.com/marmelab/react-admin/tree/master/packages/ra-data-json-server>

endpoint: `<api-url>/json`

写 [x] 的表示没有实现  

| Method             | API calls
|--------------------|----------------------------------------------------------------
| `getList`          | `GET /users?_sort=name&_order=ASC&_start=0&_end=24&name=slime`
| `getOne`           | `GET /users/123`
| `getMany`          | `GET /users/123, GET /users/456, GET /users/789`
| `create`           | `POST /users`
| `update`           | `PUT /users/123`
| `updateMany`       | `PUT /users/123, PUT /users/456, PUT /users/789`
| `[x]getManyReference` | `GET /users?author_id=345`
| `[x]delete`        | `DELETE /users/123`
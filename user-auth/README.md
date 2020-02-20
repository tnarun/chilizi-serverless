# chilizi-user-auth

用户验证函数

## 测试

`npm test`

## provider

此函数用于向用户管理提供 provider, 具体参考:  
<https://github.com/marmelab/react-admin/tree/master/packages/ra-data-json-server>

| Method             | API calls
|--------------------|----------------------------------------------------------------
| `getList`          | `GET /json/users?_sort=title&_order=ASC&_start=0&_end=24&title=bar`
| `getOne`           | `GET /json/users/123`
| `getMany`          | `GET /json/users/123, GET /json/users/456, GET /json/users/789`
| `[x]getManyReference` | `GET http://my.api.url/posts?author_id=345`
| `create`           | `POST /json/users`
| `update`           | `PUT /json/users/123`
| `updateMany`       | `PUT http://my.api.url/posts/123`, `PUT http://my.api.url/posts/456`, `PUT http://my.api.url/posts/789`
| `delete`           | `DELETE http://my.api.url/posts/123`
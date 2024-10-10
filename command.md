`yarn init`

`yarn add --dev typescript ts-jest @types/jest @types/node ts-node ts-node-dev`

`yarn add pg @types/pg knex`

`yarn knex init -x ts`

`yarn add dotenv`

`yarn knex migrate:make create-table_`

## 行未執行的migrations 最新狀態
`yarn knex migrate:latest`
`yarn knex migrate:rollback`

## 行下一個migrations
`yarn knex migrate:up`
## 行下一個migrations
`yarn knex migrate:down`

## install replicate AI for generating picture
`yarn add replicate`

## permission denied for schema public
`GRANT ALL PRIVILEGES ON SCHEMA public TO`

## openAI
`yarn openai @types/openai`
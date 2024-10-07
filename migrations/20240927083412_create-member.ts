import type { Knex } from "knex";

//Create table //yarn knex migrate:latest
export async function up(knex: Knex){
    await knex.schema.createTable('members', table=>{
        table.increments()
        table.string('username').unique().notNullable(); //string = varchar(256)
        table.string('password').notNullable();
        table.string('phone');
        table.string('address');
        table.string('email').unique();
        table.boolean('admin').defaultTo(false);
        table.timestamps(false,true) //create created_at & updated_at
    })
}

//Drop table //yarn knex migrate:rollback
export async function down(knex: Knex){
    await knex.schema.dropTable('members')
}


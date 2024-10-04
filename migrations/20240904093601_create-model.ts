import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('model', table=>{
        table.increments()
        table.string('name');
     table.timestamps(false,true);
})
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('model')
}


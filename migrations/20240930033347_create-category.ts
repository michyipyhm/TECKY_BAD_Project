import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('category', table=>{
        table.increments()
        table.string('category_name');
        table.string('category_type');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('category')
}



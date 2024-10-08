import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('shopping_cart', table=>{
        table.increments('id').primary();
        table.integer('product_option_id').unsigned();
        table.integer('member_id').unsigned();
        table.integer('quantity').unsigned();
        table.foreign('member_id').references('members.id');
        table.foreign('product_option_id').references('product_option.id');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('shopping_cart')
}


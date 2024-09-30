import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('transaction', table=>{
        table.increments()
        table.integer('order_id').unsigned().notNullable();
        table.boolean('success');
        table.string('log');
        table.string('payment_type');
        table.foreign('order_id').references('orders.id');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('transaction')
}



import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('order_details', table=>{
        table.increments()
        table.integer('order_id').unsigned();
        table.integer('product_id').unsigned();
        table.integer('quantity').unsigned();
        table.integer('product_price').unsigned();
        table.integer('subtotal').unsigned();
        table.foreign('order_id').references('orders.id');
        table.foreign('product_id').references('products.id');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('order_details')
}


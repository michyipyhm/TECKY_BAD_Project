import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('products', table=>{
        table.increments()
        table.string('product_name');
        table.integer('category_id').unsigned();
        table.string('phone_type');
        table.string('color');
        table.integer('product_price');
        table.integer('product_quantity').unsigned();
        table.foreign('category_id').references('category.id');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('products')
}


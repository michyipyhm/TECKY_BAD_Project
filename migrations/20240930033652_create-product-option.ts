import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('product_option', table=>{
        table.increments('id')
        table.integer('model_id').unsigned();
        table.integer('color_id').unsigned();
        table.integer('products_id').unsigned();
        table.integer('product_quantity').unsigned();
        table.foreign('products_id').references('products.id');
        table.foreign('color_id').references('color.id');
        table.foreign('model_id').references('model.id');
        table.timestamps(false,true);
})
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('product_option')
}


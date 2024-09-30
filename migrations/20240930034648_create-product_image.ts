import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('product_image', table=>{
        table.increments()
        table.integer('product_id').unsigned();
        table.string('image_path');
        table.foreign('product_id').references('products.id');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('product_image')
}



import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('chat_box', table=>{
        table.increments();
        table.enum('role', ['admin', 'robot']);
        table.integer('member_id').unsigned();
        table.integer('order_id').unsigned();
        table.integer('product_id').unsigned();
        table.text('comment_text');
        table.string('comment_image');
        table.foreign('member_id').references('members.id');
        table.foreign('order_id').references('orders.id');
        table.foreign('product_id').references('products.id');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('chat_box')
}


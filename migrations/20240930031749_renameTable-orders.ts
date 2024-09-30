import type { Knex } from "knex";


export async function up(knex: Knex) {
    return knex.schema.renameTable('order', 'orders');
}


export async function down(knex: Knex) {
    //要做相反嘅野
    return knex.schema.renameTable('orders', 'order');
}


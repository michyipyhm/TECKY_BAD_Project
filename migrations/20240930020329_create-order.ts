import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('orders', table=>{
        table.increments('id').primary();
        table.integer('member_id').unsigned(); //unsigned() = 不能是負數，只能0或正數
        table.integer('total').unsigned();
        table.enum('state', ['Pending', 'Completed', 'Cancelled']);
        table.string('stripe_id');
        table.string('payment_type');
        table.foreign('member_id').references('members.id');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTableIfExists('orders')
    await knex.schema.dropTableIfExists('order')

}


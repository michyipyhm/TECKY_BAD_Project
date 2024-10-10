import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.createTable('chat_box', table=>{
        table.increments();
        table.integer('member_id').unsigned();
        table.text('user_message');
        table.text('response_message');
        table.foreign('member_id').references('members.id');
        table.timestamps(false,true);
    })
}


export async function down(knex: Knex) {
    await knex.schema.dropTable('chat_box')
}


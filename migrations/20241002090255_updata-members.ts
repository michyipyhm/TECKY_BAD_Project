import type { Knex } from "knex";


export async function up(knex: Knex) {
    await knex.schema.alterTable('members', table => {
        table.dropUnique(['phone']);
    })
}

//Drop table //yarn knex migrate:rollback
export async function down(knex: Knex) {
    await knex.schema.alterTable('members', table => {
        table.unique(['phone']);
    })
}
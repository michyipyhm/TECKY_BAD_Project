import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('products', function(table) {
        table.boolean('custom_made').defaultTo(true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('products', function(table) {
        table.dropColumn('custom_made');
    });
}
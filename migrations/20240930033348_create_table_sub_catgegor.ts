import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.schema.createTable("sub_category", (table) => {
    table.increments();
    table.string("category_name");
    table.integer('category_id').unsigned();
    table.foreign("category_id").references("category.id");
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable("sub_category");
}

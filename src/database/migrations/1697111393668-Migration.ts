import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1697111393668 implements MigrationInterface {
    name = 'Migration1697111393668'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "email_verified_at" TIMESTAMP, "phone" character varying, "status" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "seller_id" integer NOT NULL, "name" character varying NOT NULL, "category_name" character varying NOT NULL, "description" text NOT NULL, "price" integer NOT NULL, "stock" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('USER', 'MAINTAINER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'USER';

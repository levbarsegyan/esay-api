CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("name")
);
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "projectName" VARCHAR(128) NOT NULL,
    "plannedStartDate" TIMESTAMPTZ(6) NOT NULL,
    "plannedEndDate" TIMESTAMPTZ(6) NOT NULL,
    "actualStartDate" TIMESTAMPTZ(6),
    "actualEndDate" TIMESTAMPTZ(6),
    "projectDescription" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);
CREATE TABLE "Tasks" (
    "id" UUID NOT NULL,
    "taskId" SERIAL NOT NULL,
    "type" VARCHAR(50),
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "assignee" VARCHAR(128),
    "createdBy" VARCHAR(128) NOT NULL,
    "priority" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "inProject" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "fullname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "userid" VARCHAR(255),
    "provider" VARCHAR(255) DEFAULT E'easy collab',
    "resetPasswordToken" VARCHAR(255),
    "resetPasswordExpires" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    PRIMARY KEY ("id")
);
ALTER TABLE "Tasks" ADD FOREIGN KEY ("inProject") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

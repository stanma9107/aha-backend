-- AlterTable
ALTER TABLE `EventHistory` ADD COLUMN `active_session_id` INTEGER NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `session_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `ActiveSessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `session_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ActiveSessions_active_id_key`(`active_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventHistory` ADD CONSTRAINT `EventHistory_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `Sessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventHistory` ADD CONSTRAINT `EventHistory_active_session_id_fkey` FOREIGN KEY (`active_session_id`) REFERENCES `ActiveSessions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveSessions` ADD CONSTRAINT `ActiveSessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActiveSessions` ADD CONSTRAINT `ActiveSessions_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `Sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

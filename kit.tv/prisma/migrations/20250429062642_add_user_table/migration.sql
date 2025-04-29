-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `imageUrl` TEXT NOT NULL,
    `externalUserId` VARCHAR(191) NOT NULL,
    `bio` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `followCount` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_externalUserId_key`(`externalUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActiveStream` (
    `id` VARCHAR(191) NOT NULL,
    `title` TEXT NULL,
    `category` TEXT NULL,
    `streamUserId` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ActiveStream_streamUserId_key`(`streamUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Button` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NULL,
    `font` TEXT NULL,
    `size` INTEGER NOT NULL DEFAULT 16,
    `color` INTEGER NOT NULL DEFAULT 0,
    `instructions` TEXT NULL,
    `credits` TEXT NULL,
    `timeout` INTEGER NOT NULL DEFAULT 100,
    `streamerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Button_streamerId_key`(`streamerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sound` (
    `id` VARCHAR(191) NOT NULL,
    `fileUrl` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ButtonQueue` (
    `id` VARCHAR(191) NOT NULL,
    `buttonId` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ButtonQueue_buttonId_key`(`buttonId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

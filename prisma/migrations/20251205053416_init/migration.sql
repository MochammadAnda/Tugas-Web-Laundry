-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `telepon` VARCHAR(191) NULL,
    `alamat` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Asset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaAset` VARCHAR(191) NOT NULL,
    `hargaBeli` DECIMAL(15, 2) NOT NULL,
    `nilaiSisa` DECIMAL(15, 2) NOT NULL,
    `umurEkonomis` INTEGER NOT NULL,
    `tanggalBeli` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaBeban` VARCHAR(191) NOT NULL,
    `kategori` ENUM('Operasional', 'Gaji', 'Pemasaran', 'Lainnya') NOT NULL,
    `jumlah` DECIMAL(15, 2) NOT NULL,
    `tanggal` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `namaLayanan` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NULL,
    `hargaPerUnit` DECIMAL(10, 2) NOT NULL,
    `satuan` ENUM('KG', 'PCS', 'PSG', 'm2', 'Bulan') NOT NULL,
    `status` ENUM('aktif', 'tidak_aktif') NOT NULL,

    UNIQUE INDEX `Service_namaLayanan_key`(`namaLayanan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `layanan` VARCHAR(191) NOT NULL,
    `beratKg` DECIMAL(10, 2) NULL,
    `tanggalPesan` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `tanggalAmbil` DATE NULL,
    `totalHarga` DECIMAL(10, 2) NOT NULL,
    `statusPesanan` ENUM('Menunggu', 'Sedang', 'Siap', 'Selesai', 'Dibatalkan') NOT NULL,
    `isHiddenUser` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `tanggalBayar` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `jumlahBayar` DECIMAL(10, 2) NOT NULL,
    `metodeBayar` VARCHAR(191) NOT NULL,
    `statusBayar` ENUM('Belum_Lunas', 'Lunas') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `keterangan` VARCHAR(191) NULL,
    `beratQty` DECIMAL(10, 2) NOT NULL,
    `hargaSubtotal` DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderDetail` ADD CONSTRAINT `OrderDetail_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

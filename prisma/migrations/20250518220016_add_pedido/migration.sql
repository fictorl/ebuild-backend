-- CreateTable
CREATE TABLE "pedido" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "lojaCnpj" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pedido_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pedido_lojaCnpj_fkey" FOREIGN KEY ("lojaCnpj") REFERENCES "loja" ("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pedidoProduto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pedidoId" INTEGER NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL,
    CONSTRAINT "pedidoProduto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pedidoProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "produto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

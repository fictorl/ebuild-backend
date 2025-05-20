-- CreateTable
CREATE TABLE "loja" (
    "cnpj" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "frete" REAL,
    "cep" TEXT,
    "rua" TEXT,
    "numero" INTEGER,
    "senha" TEXT NOT NULL,
    "horarioAtendimento" TEXT,
    "diasAtendimento" TEXT,
    "abreFeriados" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "categoriaLoja" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "categoriaProduto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "lojaCnpj" TEXT NOT NULL,
    CONSTRAINT "categoriaProduto_lojaCnpj_fkey" FOREIGN KEY ("lojaCnpj") REFERENCES "loja" ("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" REAL,
    "lojaCnpj" TEXT NOT NULL,
    "categoriaProdutoId" INTEGER NOT NULL,
    CONSTRAINT "produto_lojaCnpj_fkey" FOREIGN KEY ("lojaCnpj") REFERENCES "loja" ("cnpj") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "produto_categoriaProdutoId_fkey" FOREIGN KEY ("categoriaProdutoId") REFERENCES "categoriaProduto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'USER'
);

-- CreateTable
CREATE TABLE "_categoriaLojaToloja" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_categoriaLojaToloja_A_fkey" FOREIGN KEY ("A") REFERENCES "categoriaLoja" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_categoriaLojaToloja_B_fkey" FOREIGN KEY ("B") REFERENCES "loja" ("cnpj") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "categoriaLoja_nome_key" ON "categoriaLoja"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_categoriaLojaToloja_AB_unique" ON "_categoriaLojaToloja"("A", "B");

-- CreateIndex
CREATE INDEX "_categoriaLojaToloja_B_index" ON "_categoriaLojaToloja"("B");

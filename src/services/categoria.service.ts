import { prisma } from '../prisma/client';

export async function createCategoriaProdutoService(nome: string, lojaCnpj: string) {
  return prisma.categoriaProduto.create({
    data: { nome, lojaCnpj },
  });
}

export async function listCategoriasDaLojaService(lojaCnpj: string) {
  return prisma.categoriaProduto.findMany({
    where: { lojaCnpj },
  });
}
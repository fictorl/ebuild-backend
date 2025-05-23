import { prisma } from '../prisma/client';

type CreateProdutoInput = {
  nome: string;
  descricao?: string;
  preco?: number;
  lojaCnpj: string;
  categoriaProdutoId: number;
};

export async function createProdutoService({
  nome,
  descricao,
  preco,
  lojaCnpj,
  categoriaProdutoId
}: CreateProdutoInput) {
  const categoria = await prisma.categoriaProduto.findUnique({
    where: { id: categoriaProdutoId }
  });

  if (!categoria) {
    throw new Error('Categoria não existe');
  }

  //if (categoria.lojaCnpj !== lojaCnpj) {
    //throw new Error('Categoria não pertence a esta loja');
  //}

  return prisma.produto.create({
    data: {
      nome,
      descricao,
      preco,
      lojaCnpj,
      categoriaProdutoId
    }
  });
}


export async function listProdutosService() {
  return prisma.produto.findMany({ include: { loja: true, categoriaProduto: true } });
}

export async function getProdutoService(id: number) {
  return prisma.produto.findUnique({
    where: { id },
    include: { loja: true, categoriaProduto: true },
  });
}

export async function deleteProdutoService(id: number) {
  return prisma.produto.delete({ where: { id } });
}

export async function listProdutosByLojistaService(lojaCnpj: string) {
  return prisma.produto.findMany({
    where: { lojaCnpj },
    include: { loja: true, categoriaProduto: true }
  });
}
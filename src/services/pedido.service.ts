import { prisma } from '../prisma/client';

export async function createPedidoService({
  usuarioId,
  lojaCnpj,
  itens
}: {
  usuarioId: number;
  lojaCnpj: string;
  itens: { produtoId: number; quantidade: number }[];
}) {
  if (!itens.length) throw new Error("Order must contain at least one item.");

  const produtos = await prisma.produto.findMany({
    where: {
      id: { in: itens.map(p => p.produtoId) },
      lojaCnpj
    }
  });

  if (produtos.length !== itens.length) {
    throw new Error("One or more products do not exist or do not belong to this store.");
  }

  const total = produtos.reduce((acc, produto) => {
    const item = itens.find(i => i.produtoId === produto.id);
    const preco = produto.preco ?? 0;
    return acc + preco * item!.quantidade;
  }, 0);

  return prisma.pedido.create({
    data: {
      usuarioId,
      lojaCnpj,
      total,
      produtos: {
        create: itens.map(p => ({
          produtoId: p.produtoId,
          quantidade: p.quantidade
        }))
      }
    },
    include: { produtos: true }
  });
}


export async function getPedidosDoUsuarioService(usuarioId: number) {
  return prisma.pedido.findMany({
    where: { usuarioId },
    include: { produtos: { include: { produto: true } }, loja: true },
  });
}

export async function getPedidosDaLojaService(lojaCnpj: string) {
  return prisma.pedido.findMany({
    where: { lojaCnpj },
    include: {
      produtos: {
        include: { produto: true }
      },
      usuario: {
        select: {
          id: true,
          nome: true,
          email: true,
          tipo: true
        }
      }
    }
  });
}

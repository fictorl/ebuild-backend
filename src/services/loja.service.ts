import { prisma } from '../prisma/client';
import bcrypt from 'bcryptjs';

export async function createLojaService(data: any) {
  const { senha, ...rest } = data;
  const hashed = await bcrypt.hash(senha, 10);
  return prisma.loja.create({
    data: { ...rest, senha: hashed },
  });
}

export async function authenticateLojaService(cnpj: string, senha: string) {
  const loja = await prisma.loja.findUnique({ where: { cnpj } });
  if (!loja) return null;
  const match = await bcrypt.compare(senha, loja.senha);
  if (!match) return null;
  return loja;
}

export async function getLojaService(cnpj: string) {
  return prisma.loja.findUnique({
    where: { cnpj },
    include: { produtos: true, categoriasProduto: true },
  });
}

export async function deleteLojaService(cnpj: string) {
  await prisma.pedido.deleteMany({ where: { lojaCnpj: cnpj } });
  await prisma.produto.deleteMany({ where: { lojaCnpj: cnpj } });
  await prisma.categoriaProduto.deleteMany({ where: { lojaCnpj: cnpj } });
  return prisma.loja.delete({ where: { cnpj } });
}
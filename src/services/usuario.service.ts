import { prisma } from '../prisma/client';
import bcrypt from 'bcryptjs';

export async function createUsuario(nome: string, email: string, senha: string) {
  const hashed = await bcrypt.hash(senha, 10);
  return prisma.usuario.create({
    data: { nome, email, senha: hashed },
  });
}

export async function authenticateUsuario(email: string, senha: string) {
  const user = await prisma.usuario.findUnique({ where: { email } });
  if (!user) return null;
  const match = await bcrypt.compare(senha, user.senha);
  if (!match) return null;
  return user;
}
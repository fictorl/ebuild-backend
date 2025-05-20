import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Função para gerar hash da senha
  const hash = (senha: string) => bcrypt.hashSync(senha, 10);

  // 5 lojas
  const lojas = await Promise.all([
    prisma.loja.create({
      data: {
        cnpj: '11111111000191',
        nome: 'Casa do Construtor',
        descricao: 'Materiais para construção e reforma.',
        telefone: '11999990001',
        email: 'contato@casadoconstrutor.com.br',
        frete: 20.0,
        cep: '01001-000',
        rua: 'Rua Tijolo',
        numero: 101,
        senha: hash('senha1'),
        horarioAtendimento: '07:00-18:00',
        diasAtendimento: 'Seg-Sab',
        abreFeriados: false,
      },
    }),
    prisma.loja.create({
      data: {
        cnpj: '22222222000192',
        nome: 'Obra Fácil',
        descricao: 'Tudo para sua obra.',
        telefone: '11999990002',
        email: 'contato@obrafacil.com.br',
        frete: 25.0,
        cep: '01002-000',
        rua: 'Rua Concreto',
        numero: 202,
        senha: hash('senha2'),
        horarioAtendimento: '08:00-17:00',
        diasAtendimento: 'Seg-Sex',
        abreFeriados: true,
      },
    }),
    prisma.loja.create({
      data: {
        cnpj: '33333333000193',
        nome: 'Construshop',
        descricao: 'Materiais e ferramentas.',
        telefone: '11999990003',
        email: 'contato@construshop.com.br',
        frete: 18.0,
        cep: '01003-000',
        rua: 'Rua Areia',
        numero: 303,
        senha: hash('senha3'),
        horarioAtendimento: '07:30-18:30',
        diasAtendimento: 'Seg-Sab',
        abreFeriados: false,
      },
    }),
    prisma.loja.create({
      data: {
        cnpj: '44444444000194',
        nome: 'Reforma Já',
        descricao: 'Especializada em acabamentos.',
        telefone: '11999990004',
        email: 'contato@reformaja.com.br',
        frete: 22.0,
        cep: '01004-000',
        rua: 'Rua Cimento',
        numero: 404,
        senha: hash('senha4'),
        horarioAtendimento: '08:00-19:00',
        diasAtendimento: 'Seg-Dom',
        abreFeriados: true,
      },
    }),
    prisma.loja.create({
      data: {
        cnpj: '55555555000195',
        nome: 'Tudo para Construção',
        descricao: 'Completa em materiais básicos.',
        telefone: '11999990005',
        email: 'contato@tudoparaconstrucao.com.br',
        frete: 19.0,
        cep: '01005-000',
        rua: 'Rua Bloco',
        numero: 505,
        senha: hash('senha5'),
        horarioAtendimento: '07:00-17:00',
        diasAtendimento: 'Seg-Sab',
        abreFeriados: false,
      },
    }),
  ]);

  // 5 categorias de loja
  const categoriasLoja = await Promise.all([
    prisma.categoriaLoja.create({ data: { nome: 'Material Básico', lojas: { connect: [{ cnpj: lojas[0].cnpj }] } } }),
    prisma.categoriaLoja.create({ data: { nome: 'Ferragens', lojas: { connect: [{ cnpj: lojas[1].cnpj }] } } }),
    prisma.categoriaLoja.create({ data: { nome: 'Elétrica', lojas: { connect: [{ cnpj: lojas[2].cnpj }] } } }),
    prisma.categoriaLoja.create({ data: { nome: 'Hidráulica', lojas: { connect: [{ cnpj: lojas[3].cnpj }] } } }),
    prisma.categoriaLoja.create({ data: { nome: 'Acabamento', lojas: { connect: [{ cnpj: lojas[4].cnpj }] } } }),
  ]);

  // 5 categorias de produto (uma para cada loja)
  const categoriasProduto = await Promise.all([
    prisma.categoriaProduto.create({ data: { nome: 'Cimento', lojaCnpj: lojas[0].cnpj } }),
    prisma.categoriaProduto.create({ data: { nome: 'Tinta', lojaCnpj: lojas[1].cnpj } }),
    prisma.categoriaProduto.create({ data: { nome: 'Ferramentas', lojaCnpj: lojas[2].cnpj } }),
    prisma.categoriaProduto.create({ data: { nome: 'Tubos', lojaCnpj: lojas[3].cnpj } }),
    prisma.categoriaProduto.create({ data: { nome: 'Pisos', lojaCnpj: lojas[4].cnpj } }),
  ]);

  // 5 produtos (um para cada loja/categoria)
  const produtos = await Promise.all([
    prisma.produto.create({
      data: {
        nome: 'Cimento CP II 50kg',
        descricao: 'Cimento para construção civil.',
        preco: 36.90,
        lojaCnpj: lojas[0].cnpj,
        categoriaProdutoId: categoriasProduto[0].id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Tinta Acrílica 18L',
        descricao: 'Tinta branca para paredes.',
        preco: 210.00,
        lojaCnpj: lojas[1].cnpj,
        categoriaProdutoId: categoriasProduto[1].id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Martelo de Unha',
        descricao: 'Martelo Tramontina 27mm.',
        preco: 28.50,
        lojaCnpj: lojas[2].cnpj,
        categoriaProdutoId: categoriasProduto[2].id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Tubo PVC 3m',
        descricao: 'Tubo para instalação hidráulica.',
        preco: 22.90,
        lojaCnpj: lojas[3].cnpj,
        categoriaProdutoId: categoriasProduto[3].id,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Piso Cerâmico 60x60',
        descricao: 'Piso para áreas internas.',
        preco: 39.90,
        lojaCnpj: lojas[4].cnpj,
        categoriaProdutoId: categoriasProduto[4].id,
      },
    }),
  ]);

  // 5 usuários
  const usuarios = await Promise.all([
    prisma.usuario.create({ data: { nome: 'João da Silva', email: 'joao1@cliente.com', senha: hash('senha1'), tipo: 'USER' } }),
    prisma.usuario.create({ data: { nome: 'Maria Oliveira', email: 'maria2@cliente.com', senha: hash('senha2'), tipo: 'USER' } }),
    prisma.usuario.create({ data: { nome: 'Carlos Souza', email: 'carlos3@cliente.com', senha: hash('senha3'), tipo: 'USER' } }),
    prisma.usuario.create({ data: { nome: 'Ana Paula', email: 'ana4@cliente.com', senha: hash('senha4'), tipo: 'USER' } }),
    prisma.usuario.create({ data: { nome: 'Pedro Lima', email: 'pedro5@cliente.com', senha: hash('senha5'), tipo: 'USER' } }),
  ]);

  // 5 pedidos (um para cada usuário, cada um comprando um produto diferente)
  await Promise.all([
    prisma.pedido.create({
      data: {
        usuarioId: usuarios[0].id,
        lojaCnpj: lojas[0].cnpj,
        total: 73.80,
        produtos: { create: [{ produtoId: produtos[0].id, quantidade: 2 }] },
      },
    }),
    prisma.pedido.create({
      data: {
        usuarioId: usuarios[1].id,
        lojaCnpj: lojas[1].cnpj,
        total: 210.00,
        produtos: { create: [{ produtoId: produtos[1].id, quantidade: 1 }] },
      },
    }),
    prisma.pedido.create({
      data: {
        usuarioId: usuarios[2].id,
        lojaCnpj: lojas[2].cnpj,
        total: 57.00,
        produtos: { create: [{ produtoId: produtos[2].id, quantidade: 2 }] },
      },
    }),
    prisma.pedido.create({
      data: {
        usuarioId: usuarios[3].id,
        lojaCnpj: lojas[3].cnpj,
        total: 45.80,
        produtos: { create: [{ produtoId: produtos[3].id, quantidade: 2 }] },
      },
    }),
    prisma.pedido.create({
      data: {
        usuarioId: usuarios[4].id,
        lojaCnpj: lojas[4].cnpj,
        total: 79.80,
        produtos: { create: [{ produtoId: produtos[4].id, quantidade: 2 }] },
      },
    }),
  ]);

  console.log('Banco populado com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
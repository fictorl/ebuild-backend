import { prisma } from '../src/prisma/client';
import {
  createProdutoService,
  listProdutosService,
  getProdutoService,
  deleteProdutoService,
  listProdutosByLojistaService
} from '../src/services/produto.service';

jest.mock('../src/prisma/client', () => ({
prisma: {
    categoriaProduto: {
        findUnique: jest.fn(),
    },
    produto: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
    },
},
}));

describe('Produto Service', () => {
const mockCategoria = { id: 1, nome: 'Categoria Teste', lojaCnpj: '12345678901234' };
const mockProduto = {
    id: 1,
    nome: 'Produto Teste',
    descricao: 'Descrição',
    preco: 10,
    lojaCnpj: '12345678901234',
    categoriaProdutoId: 1,
    loja: {},
    categoriaProduto: {},
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('createProdutoService', () => {
    it('should create a produto when categoria exists', async () => {
        (prisma.categoriaProduto.findUnique as jest.Mock).mockResolvedValue(mockCategoria);
        (prisma.produto.create as jest.Mock).mockResolvedValue(mockProduto);

        const input = {
            nome: 'Produto Teste',
            descricao: 'Descrição',
            preco: 10,
            lojaCnpj: '12345678901234',
            categoriaProdutoId: 1,
        };

        const result = await createProdutoService(input);

        expect(prisma.categoriaProduto.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(prisma.produto.create).toHaveBeenCalledWith({ data: input });
        expect(result).toEqual(mockProduto);
    });

    it('should throw error if categoria does not exist', async () => {
        (prisma.categoriaProduto.findUnique as jest.Mock).mockResolvedValue(null);

        const input = {
            nome: 'Produto Teste',
            descricao: 'Descrição',
            preco: 10,
            lojaCnpj: '12345678901234',
            categoriaProdutoId: 1,
        };

        await expect(createProdutoService(input)).rejects.toThrow('Categoria não existe');
        expect(prisma.produto.create).not.toHaveBeenCalled();
    });
});

describe('listProdutosService', () => {
    it('should list all produtos with loja and categoriaProduto', async () => {
        (prisma.produto.findMany as jest.Mock).mockResolvedValue([mockProduto]);
        const result = await listProdutosService();
        expect(prisma.produto.findMany).toHaveBeenCalledWith({ include: { loja: true, categoriaProduto: true } });
        expect(result).toEqual([mockProduto]);
    });
});

describe('getProdutoService', () => {
    it('should get a produto by id with loja and categoriaProduto', async () => {
        (prisma.produto.findUnique as jest.Mock).mockResolvedValue(mockProduto);
        const result = await getProdutoService(1);
        expect(prisma.produto.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { loja: true, categoriaProduto: true },
        });
        expect(result).toEqual(mockProduto);
    });
});

describe('deleteProdutoService', () => {
    it('should delete a produto by id', async () => {
        (prisma.produto.delete as jest.Mock).mockResolvedValue(mockProduto);
        const result = await deleteProdutoService(1);
        expect(prisma.produto.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        expect(result).toEqual(mockProduto);
    });
});

describe('listProdutosByLojistaService', () => {
    it('should list produtos by lojaCnpj', async () => {
        (prisma.produto.findMany as jest.Mock).mockResolvedValue([mockProduto]);
        const result = await listProdutosByLojistaService('12345678901234');
        expect(prisma.produto.findMany).toHaveBeenCalledWith({
            where: { lojaCnpj: '12345678901234' },
            include: { loja: true, categoriaProduto: true },
        });
        expect(result).toEqual([mockProduto]);
    });
});
});
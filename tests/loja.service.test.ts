import { prisma } from '../src/prisma/client';
import bcrypt from 'bcryptjs';
import {
  createLojaService,
  authenticateLojaService,
  getLojaService,
  deleteLojaService,
} from '../src/services/loja.service';

jest.mock('../src/prisma/client', () => ({
prisma: {
    loja: {
        create: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
    },
    pedido: {
        deleteMany: jest.fn(),
    },
    produto: {
        deleteMany: jest.fn(),
    },
    categoriaProduto: {
        deleteMany: jest.fn(),
    },
},
}));

jest.mock('bcryptjs', () => ({
hash: jest.fn(),
compare: jest.fn(),
}));

describe('loja.service', () => {
afterEach(() => {
    jest.clearAllMocks();
});

describe('createLojaService', () => {
    it('should hash the password and create a loja', async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (prisma.loja.create as jest.Mock).mockResolvedValue({ id: 1, senha: 'hashedPassword' });

        const data = { nome: 'Loja Teste', senha: 'plainPassword', cnpj: '123' };
        const result = await createLojaService(data);

        expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
        expect(prisma.loja.create).toHaveBeenCalledWith({
            data: { nome: 'Loja Teste', cnpj: '123', senha: 'hashedPassword' },
        });
        expect(result).toEqual({ id: 1, senha: 'hashedPassword' });
    });
});

describe('authenticateLojaService', () => {
    it('should return loja if credentials are correct', async () => {
        const loja = { cnpj: '123', senha: 'hashedPassword' };
        (prisma.loja.findUnique as jest.Mock).mockResolvedValue(loja);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const result = await authenticateLojaService('123', 'plainPassword');

        expect(prisma.loja.findUnique).toHaveBeenCalledWith({ where: { cnpj: '123' } });
        expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
        expect(result).toBe(loja);
    });

    it('should return null if loja not found', async () => {
        (prisma.loja.findUnique as jest.Mock).mockResolvedValue(null);

        const result = await authenticateLojaService('notfound', 'any');

        expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
        const loja = { cnpj: '123', senha: 'hashedPassword' };
        (prisma.loja.findUnique as jest.Mock).mockResolvedValue(loja);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const result = await authenticateLojaService('123', 'wrongPassword');

        expect(result).toBeNull();
    });
});

describe('getLojaService', () => {
    it('should return loja with produtos and categoriasProduto', async () => {
        const loja = { cnpj: '123', produtos: [], categoriasProduto: [] };
        (prisma.loja.findUnique as jest.Mock).mockResolvedValue(loja);

        const result = await getLojaService('123');

        expect(prisma.loja.findUnique).toHaveBeenCalledWith({
            where: { cnpj: '123' },
            include: { produtos: true, categoriasProduto: true },
        });
        expect(result).toBe(loja);
    });
});

describe('deleteLojaService', () => {
    it('should delete related pedidos, produtos, categoriasProduto and the loja', async () => {
        (prisma.pedido.deleteMany as jest.Mock).mockResolvedValue({});
        (prisma.produto.deleteMany as jest.Mock).mockResolvedValue({});
        (prisma.categoriaProduto.deleteMany as jest.Mock).mockResolvedValue({});
        (prisma.loja.delete as jest.Mock).mockResolvedValue({ cnpj: '123' });

        const result = await deleteLojaService('123');

        expect(prisma.pedido.deleteMany).toHaveBeenCalledWith({ where: { lojaCnpj: '123' } });
        expect(prisma.produto.deleteMany).toHaveBeenCalledWith({ where: { lojaCnpj: '123' } });
        expect(prisma.categoriaProduto.deleteMany).toHaveBeenCalledWith({ where: { lojaCnpj: '123' } });
        expect(prisma.loja.delete).toHaveBeenCalledWith({ where: { cnpj: '123' } });
        expect(result).toEqual({ cnpj: '123' });
    });
});
});
import { createCategoriaProdutoService, listCategoriasDaLojaService } from '../src/services/categoria.service';
import { prisma } from '../src/prisma/client';

jest.mock('../src/prisma/client', () => ({
    prisma: {
        categoriaProduto: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe('Categoria Service', () => {
    const mockCategoria = { id: 1, nome: 'Bebidas', lojaCnpj: '12345678901234' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createCategoriaProdutoService', () => {
        it('should create a categoriaProduto with correct data', async () => {
            (prisma.categoriaProduto.create as jest.Mock).mockResolvedValue(mockCategoria);

            const result = await createCategoriaProdutoService('Bebidas', '12345678901234');

            expect(prisma.categoriaProduto.create).toHaveBeenCalledWith({
                data: { nome: 'Bebidas', lojaCnpj: '12345678901234' },
            });
            expect(result).toEqual(mockCategoria);
        });
    });

    describe('listCategoriasDaLojaService', () => {
        it('should list categorias for a given lojaCnpj', async () => {
            const categorias = [
                { id: 1, nome: 'Bebidas', lojaCnpj: '12345678901234' },
                { id: 2, nome: 'Comidas', lojaCnpj: '12345678901234' },
            ];
            (prisma.categoriaProduto.findMany as jest.Mock).mockResolvedValue(categorias);

            const result = await listCategoriasDaLojaService('12345678901234');

            expect(prisma.categoriaProduto.findMany).toHaveBeenCalledWith({
                where: { lojaCnpj: '12345678901234' },
            });
            expect(result).toEqual(categorias);
        });
    });
});
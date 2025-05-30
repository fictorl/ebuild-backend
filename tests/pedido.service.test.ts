import { createPedidoService, getPedidosDoUsuarioService, getPedidosDaLojaService } from '../src/services/pedido.service';
import { prisma } from '../src/prisma/client';

jest.mock('../src/prisma/client', () => ({
    prisma: {
        produto: {
            findMany: jest.fn(),
        },
        pedido: {
            create: jest.fn(),
            findMany: jest.fn(),
        },
    },
}));

describe('Pedido Service', () => {
    const usuarioId = 1;
    const lojaCnpj = '12345678000199';
    const itens = [
        { produtoId: 10, quantidade: 2 },
        { produtoId: 20, quantidade: 1 },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createPedidoService', () => {
        it('should throw if itens is empty', async () => {
            await expect(
                createPedidoService({ usuarioId, lojaCnpj, itens: [] })
            ).rejects.toThrow('Order must contain at least one item.');
        });

        it('should throw if any product does not exist or does not belong to the store', async () => {
            (prisma.produto.findMany as jest.Mock).mockResolvedValue([{ id: 10, preco: 100 }]);
            await expect(
                createPedidoService({ usuarioId, lojaCnpj, itens })
            ).rejects.toThrow('One or more products do not exist or do not belong to this store.');
        });

        it('should create a pedido and return it', async () => {
            const produtos = [
                { id: 10, preco: 100 },
                { id: 20, preco: 50 },
            ];
            (prisma.produto.findMany as jest.Mock).mockResolvedValue(produtos);

            const createdPedido = {
                id: 1,
                usuarioId,
                lojaCnpj,
                total: 250,
                produtos: [
                    { produtoId: 10, quantidade: 2 },
                    { produtoId: 20, quantidade: 1 },
                ],
            };
            (prisma.pedido.create as jest.Mock).mockResolvedValue(createdPedido);

            const result = await createPedidoService({ usuarioId, lojaCnpj, itens });
            expect(prisma.produto.findMany).toHaveBeenCalledWith({
                where: {
                    id: { in: [10, 20] },
                    lojaCnpj,
                },
            });
            expect(prisma.pedido.create).toHaveBeenCalledWith({
                data: {
                    usuarioId,
                    lojaCnpj,
                    total: 250,
                    produtos: {
                        create: [
                            { produtoId: 10, quantidade: 2 },
                            { produtoId: 20, quantidade: 1 },
                        ],
                    },
                },
                include: { produtos: true },
            });
            expect(result).toEqual(createdPedido);
        });
    });

    describe('getPedidosDoUsuarioService', () => {
        it('should return pedidos for a user', async () => {
            const pedidos = [{ id: 1, usuarioId, produtos: [], loja: {} }];
            (prisma.pedido.findMany as jest.Mock).mockResolvedValue(pedidos);

            const result = await getPedidosDoUsuarioService(usuarioId);
            expect(prisma.pedido.findMany).toHaveBeenCalledWith({
                where: { usuarioId },
                include: { produtos: { include: { produto: true } }, loja: true },
            });
            expect(result).toEqual(pedidos);
        });
    });

    describe('getPedidosDaLojaService', () => {
        it('should return pedidos for a store', async () => {
            const pedidos = [{ id: 1, lojaCnpj, produtos: [], usuario: {} }];
            (prisma.pedido.findMany as jest.Mock).mockResolvedValue(pedidos);

            const result = await getPedidosDaLojaService(lojaCnpj);
            expect(prisma.pedido.findMany).toHaveBeenCalledWith({
                where: { lojaCnpj },
                include: {
                    produtos: { include: { produto: true } },
                    usuario: {
                        select: {
                            id: true,
                            nome: true,
                            email: true,
                            tipo: true,
                        },
                    },
                },
            });
            expect(result).toEqual(pedidos);
        });
    });
});
import { Request, Response } from 'express';
import {
  createPedidoService,
  getPedidosDoUsuarioService,
  getPedidosDaLojaService,
} from '../services/pedido.service';

export const createPedido = async (req: Request, res: Response) => {
  const { lojaCnpj, itens } = req.body;
  const userId = (req as any).user.id;

  try {
    const pedido = await createPedidoService({ usuarioId: userId, lojaCnpj, itens });
    res.status(201).json(pedido);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getPedidosDoUsuario = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const pedidos = await getPedidosDoUsuarioService(userId);
  res.json(pedidos);
};

export const getPedidosDaLoja = async (req: Request, res: Response) => {
  const lojaCnpj = (req as any).user.cnpj;
  const pedidos = await getPedidosDaLojaService(lojaCnpj);
  res.json(pedidos);
};
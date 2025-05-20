import { Request, Response } from 'express';
import {
  createCategoriaProdutoService,
  listCategoriasDaLojaService,
} from '../services/categoria.service';

export const createCategoriaProduto = async (req: Request, res: Response) => {
  const { nome } = req.body;
  const lojaCnpj = (req as any).user.cnpj;

  try {
    const categoria = await createCategoriaProdutoService(nome, lojaCnpj);
    res.status(201).json(categoria);
  } catch {
    res.status(400).json({ error: 'Error creating category' });
  }
};

export const listCategoriasDaLoja = async (req: Request, res: Response) => {
  const lojaCnpj = req.params.cnpj;
  const categorias = await listCategoriasDaLojaService(lojaCnpj);
  res.json(categorias);
};
import { Request, Response } from 'express';
import {
  createProdutoService,
  listProdutosService,
  getProdutoService,
  deleteProdutoService,
  listProdutosByLojistaService,
} from '../services/produto.service';

export const createProduto = async (req: Request, res: Response) => {
  const lojaCnpj = (req as any).user.cnpj;
  const { nome, descricao, preco, categoriaProdutoId } = req.body;

  try {
    const produto = await createProdutoService({
      nome,
      descricao,
      preco,
      lojaCnpj,
      categoriaProdutoId
    });
    return res.status(201).json(produto);
  } catch (error: any) {
    console.error('Erro em createProduto:', {
      lojaCnpj,
      nome,
      descricao,
      preco,
      categoriaProdutoId,
      mensagem: error.message
    });
    return res.status(400).json({ mensagem: error.message });
  }
};


export const listProdutos = async (_: Request, res: Response) => {
  const produtos = await listProdutosService();
  res.json(produtos);
};

export const getProduto = async (req: Request, res: Response) => {
  const produto = await getProdutoService(Number(req.params.id));
  if (!produto) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(produto);
};

export const deleteProduto = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const requesterCnpj = (req as any).user.cnpj;

  const produto = await getProdutoService(id);
  if (!produto) return res.status(404).json({ error: 'Product not found' });
  if (produto.lojaCnpj !== requesterCnpj) return res.sendStatus(403);

  await deleteProdutoService(id);
  res.sendStatus(204);
};

export async function listProdutosByLojistaController(req: Request, res: Response) {
  try {
    const lojaCnpj = (req as any).lojaCnpj;
    if (!lojaCnpj) return res.status(401).json({ error: 'Unauthorized' });

    const produtos = await listProdutosByLojistaService(lojaCnpj);
    res.json(produtos);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar produtos da loja' });
  }
}
import { Request, Response } from 'express';
import {
  createLojaService,
  authenticateLojaService,
  getLojaService,
  deleteLojaService,
} from '../services/loja.service';
import { generateToken } from '../utils/generateToken';

export const registerLoja = async (req: Request, res: Response) => {
  try {
    const loja = await createLojaService(req.body);
    res.status(201).json(loja);
  } catch {
    res.status(400).json({ error: 'CNPJ já cadastrado.' });
  }
};

export const loginLoja = async (req: Request, res: Response) => {
  const { cnpj, senha } = req.body;
  const loja = await authenticateLojaService(cnpj, senha);
  if (!loja) return res.status(404).json({ error: 'Loja não encontrada ou senha inválida' });

  const token = generateToken({ cnpj: loja.cnpj });
  res.json({ token });
};

export const getLoja = async (req: Request, res: Response) => {
  const loja = await getLojaService(req.params.cnpj);
  if (!loja) return res.status(404).json({ error: 'Loja não encontrada' });
  res.json(loja);
};

export const deleteLoja = async (req: Request, res: Response) => {
  const { cnpj } = req.params;
  const requesterCnpj = (req as any).user.cnpj;

  if (cnpj !== requesterCnpj) return res.sendStatus(403);

  try {
    await deleteLojaService(cnpj);
    res.sendStatus(204);
  } catch {
    res.status(400).json({ error: 'Erro ao deletar loja' });
  }
};
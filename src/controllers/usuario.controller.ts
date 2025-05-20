import { Request, Response } from 'express';
import { createUsuario, authenticateUsuario } from '../services/usuario.service';
import { generateToken } from '../utils/generateToken';

export const registerUsuario = async (req: Request, res: Response) => {
  const { nome, email, senha } = req.body;
  try {
    const user = await createUsuario(nome, email, senha);
    res.status(201).json(user);
  } catch {
    res.status(400).json({ error: 'This email is already registered' });
  }
};

export const loginUsuario = async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  const user = await authenticateUsuario(email, senha);

  if (!user) {
    return res.status(404).json({ error: 'Email or password invalid' });
  }

  const token = generateToken({ id: user.id });
  res.json({ token });
};
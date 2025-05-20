import { Router } from 'express';
import { registerLoja, loginLoja, getLoja, deleteLoja } from '../controllers/loja.controller';
import { isLojista } from '../middlewares/role.middleware';

const router = Router();

router.post('/register', registerLoja);
router.post('/login', async (req, res, next) => {
  try {
	await loginLoja(req, res);
  } catch (err) {
	next(err);
  }
});
router.get('/:cnpj', async (req, res, next) => {
  try {
    await getLoja(req, res);
  } catch (err) {
    next(err);
  }
});
router.delete('/:cnpj', isLojista, async (req, res, next) => {
  try {
    await deleteLoja(req, res);
    return;
  } catch (err) {
    next(err);
  }
});

export default router;

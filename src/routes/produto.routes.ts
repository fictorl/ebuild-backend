import { Router } from 'express';
import {
  createProduto,
  listProdutos,
  getProduto,
  deleteProduto,
} from '../controllers/produto.controller';
import { isLojista } from '../middlewares/role.middleware';

const router = Router();

router.post('/', isLojista, createProduto);
router.get('/', listProdutos);
router.get('/:id', getProduto);
router.delete('/:id', isLojista, (req, res, next) => {
  Promise.resolve(deleteProduto(req, res)).catch(next);
});

export default router;

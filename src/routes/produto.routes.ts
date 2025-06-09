import { Router } from 'express';
import {
  createProduto,
  listProdutos,
  getProduto,
  deleteProduto,
  updateProduto
} from '../controllers/produto.controller';
import { isLojista } from '../middlewares/role.middleware';

const router = Router();

router.post('/', isLojista, (req, res, next) => {
  Promise.resolve(createProduto(req, res)).catch(next);
});
router.get('/', listProdutos);
router.get('/:id', getProduto);
router.put('/:id', isLojista, updateProduto); 
router.delete('/:id', isLojista, (req, res, next) => {
  Promise.resolve(deleteProduto(req, res)).catch(next);
});

export default router;

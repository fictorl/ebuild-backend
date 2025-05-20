import { Router } from 'express';
import { createCategoriaProduto, listCategoriasDaLoja } from '../controllers/categoria.controller';
import { isLojista } from '../middlewares/role.middleware';

const router = Router();

router.post('/', isLojista, createCategoriaProduto);
router.get('/loja/:cnpj', listCategoriasDaLoja);

export default router;

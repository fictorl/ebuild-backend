import { Router } from 'express';
import {
  createPedido,
  getPedidosDaLoja,
  getPedidosDoUsuario,
} from '../controllers/pedido.controller';
import { isCliente, isLojista } from '../middlewares/role.middleware';

const router = Router();

router.post('/', isCliente, createPedido);
router.get('/cliente', isCliente, getPedidosDoUsuario);
router.get('/loja', isLojista, getPedidosDaLoja);

export default router;

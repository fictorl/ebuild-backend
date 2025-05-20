import { Router } from 'express';
import { registerUsuario, loginUsuario } from '../controllers/usuario.controller';

const router = Router();

function asyncHandler(fn: any) {
  return function (req: any, res: any, next: any) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.post('/register', asyncHandler(registerUsuario));
router.post('/login', asyncHandler(loginUsuario));

export default router;

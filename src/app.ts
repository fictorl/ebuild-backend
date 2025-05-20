import express from 'express';
import lojaRoutes from './routes/loja.routes';
import produtoRoutes from './routes/produto.routes';
import usuarioRoutes from './routes/usuario.routes';
import categoriaRoutes from './routes/categoria.routes';
import pedidoRoutes from './routes/pedido.routes';
import cors from 'cors';


const app = express();
app.use(cors());
app.use(express.json());
app.use('/lojas', lojaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/pedidos', pedidoRoutes);

export default app;

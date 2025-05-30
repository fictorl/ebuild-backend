import { createUsuario, authenticateUsuario } from '../src/services/usuario.service';
import { prisma } from '../src/prisma/client';
import bcrypt from 'bcryptjs';

jest.mock('../src/prisma/client', () => ({
    prisma: {
        usuario: {
            create: jest.fn(),
            findUnique: jest.fn(),
        },
    },
}));

jest.mock('bcryptjs', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

describe('usuario.service', () => {
    const mockUsuario = {
        id: 1,
        nome: 'Test User',
        email: 'test@example.com',
        senha: 'hashedpassword',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUsuario', () => {
        it('should hash the password and create a user', async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
            (prisma.usuario.create as jest.Mock).mockResolvedValue(mockUsuario);

            const result = await createUsuario('Test User', 'test@example.com', 'plainpassword');

            expect(bcrypt.hash).toHaveBeenCalledWith('plainpassword', 10);
            expect(prisma.usuario.create).toHaveBeenCalledWith({
                data: { nome: 'Test User', email: 'test@example.com', senha: 'hashedpassword' },
            });
            expect(result).toEqual(mockUsuario);
        });
    });

    describe('authenticateUsuario', () => {
        it('should return user if email and password match', async () => {
            (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUsuario);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await authenticateUsuario('test@example.com', 'plainpassword');

            expect(prisma.usuario.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(bcrypt.compare).toHaveBeenCalledWith('plainpassword', 'hashedpassword');
            expect(result).toEqual(mockUsuario);
        });

        it('should return null if user is not found', async () => {
            (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await authenticateUsuario('notfound@example.com', 'any');

            expect(result).toBeNull();
        });

        it('should return null if password does not match', async () => {
            (prisma.usuario.findUnique as jest.Mock).mockResolvedValue(mockUsuario);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await authenticateUsuario('test@example.com', 'wrongpassword');

            expect(result).toBeNull();
        });
    });
});
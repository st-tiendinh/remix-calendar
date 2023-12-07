import bcrypt from 'bcryptjs';
import type { RegisterForm } from '../shared/utils/types.server';
import { prisma } from './prisma.server';

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  });
  return { id: newUser.id, email: user.email };
};

export const searchUser = async (searcher: string) => {
  if (!searcher) return null;
  const users = await prisma.user.findMany({
    where: {
      email: {
        contains: searcher,
        mode: 'insensitive',
      },
    },
  });

  return users;
};
export const getAllAdmin = async () => {
  const userList = await prisma.user.findMany({
    where: {
      role: 'ADMIN',
    },
    select: {
      id: true,
      profile: true,
    },
  });

  return userList;
};

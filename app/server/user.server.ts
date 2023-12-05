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
  const regexPatern = new RegExp(searcher, 'i');
  const user = await prisma.user.findUnique({
    where: {
      email: searcher,
    },
  });

  return user;
};

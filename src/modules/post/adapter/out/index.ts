import { Provider } from '@nestjs/common';
import { PostPersistencePort } from '../../application/ports/out/post-persistence.port';
import { PrismaService } from '../../../prisma/prisma.service';
import { PostPersistenceAdapter } from './post-persistence.adapter';

export const ServicesOut: Provider[] = [
  {
    provide: PostPersistencePort,
    useClass: PostPersistenceAdapter,
  },
  PrismaService,
];

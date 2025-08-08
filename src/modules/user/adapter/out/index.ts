import { Provider } from '@nestjs/common';
import { UserDatabasePort } from '../../application/ports/out/user-query.port';
import { UserDatabaseAdapter } from './user-database.adapter';
import { PrismaService } from 'src/modules/prisma/prisma.service';

export const ServicesOut: Provider[] = [
  {
    provide: UserDatabasePort,
    useClass: UserDatabaseAdapter,
  },
  PrismaService,
];

import { Provider } from '@nestjs/common';
import { GetUserUseCase } from '../ports/in/get-user.use-case';
import { GetUserService } from './get-user.service';

export const Services: Provider[] = [
  {
    provide: GetUserUseCase,
    useClass: GetUserService,
  },
];

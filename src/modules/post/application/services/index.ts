import { Provider } from '@nestjs/common';
import { SavePostUseCase } from '../ports/in/save-post.use-case';
import { SavePostService } from './save-post.service';

export const Services: Provider[] = [
  {
    provide: SavePostUseCase,
    useClass: SavePostService,
  },
];

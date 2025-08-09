import { forwardRef, Module } from '@nestjs/common';
import { Services } from './services';
import { AdapterModule } from '../adapter/adapter.module';

@Module({
  imports: [forwardRef(() => AdapterModule)],
  providers: [...Services],
  exports: [...Services],
})
export class ApplicationModule {}

import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { SavePostController } from './in/web/save-post.controller';
import { ServicesOut } from './out';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [forwardRef(() => ApplicationModule)],
  controllers: [SavePostController],
  providers: [...ServicesOut],
  exports: [...ServicesOut],
})
export class AdapterModule {}

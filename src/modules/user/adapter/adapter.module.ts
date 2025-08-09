import { forwardRef } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ServicesOut } from './out';
import { ApplicationModule } from '../application/application.module';
import { UserController } from './in/web/user.controller';

@Module({
  imports: [forwardRef(() => ApplicationModule)],
  controllers: [UserController],
  providers: [...ServicesOut],
  exports: [...ServicesOut],
})
export class AdapterModule {}

import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ApplicationModule } from './application/application.module';
import { AdapterModule } from './adapter/adapter.module';

@Module({
  imports: [ApplicationModule, AdapterModule, CacheModule.register()],
})
export class UserModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Api Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme();

  const myCustom: SwaggerCustomOptions = {
    customSiteTitle: 'Swagger dark mode',
    customCss: theme.getBuffer(SwaggerThemeNameEnum.GRUVBOX),
    swaggerOptions: {
      docExpansion: 'none',
      apisSorter: 'alpha',
    },
  };

  SwaggerModule.setup('api', app, documentFactory(), myCustom);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3333);
}
void bootstrap();

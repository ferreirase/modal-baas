import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export async function bootstrap() {
  const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  };

  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Modal Baas API')
    .setDescription('API de acesso ao sistema Modal Baas')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/doc', app, document);

  app.use(cookieParser());
  app.use(cors(corsOptions));

  app.listen(process.env.PORT || 3001, () =>
    console.log(`Server is running on port ${process.env.PORT}`),
  );
}
bootstrap();

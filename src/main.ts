import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT; 
  await app.listen(process.env.PORT || 3000); 
  console.log(`Application listening on port ${port}`);
}
bootstrap();

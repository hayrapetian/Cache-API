import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL, {dbName: process.env.DATABASE_NAME}),
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

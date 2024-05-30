import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AnimesModule } from './animes/animes.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AnimesModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

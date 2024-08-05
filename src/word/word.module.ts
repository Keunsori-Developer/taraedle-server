import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { Word } from 'src/entity/word.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Word])],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}

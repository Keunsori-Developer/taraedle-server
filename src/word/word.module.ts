import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolvedWord } from 'src/entity/solved_word.entity';
import { Word } from 'src/entity/word.entity';
import { WordController } from './word.controller';
import { WordService } from './word.service';

@Module({
  imports: [TypeOrmModule.forFeature([Word, SolvedWord])],
  exports: [WordService],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}

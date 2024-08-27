import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { WordService } from './word.service';
import { Word } from 'src/entity/word.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolvedWord } from 'src/entity/solved_word.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Word, SolvedWord])],
  controllers: [WordController],
  providers: [WordService],
})
export class WordModule {}

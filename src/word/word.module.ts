import { Module } from '@nestjs/common';
import { WordController } from './word.controller';

@Module({
  controllers: [WordController],
})
export class WordModule {}

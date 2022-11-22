import { Module } from '@nestjs/common';

import { FileModule } from 'src/file/file.module';

@Module({
  imports: [FileModule],
})
export class AppModule {}

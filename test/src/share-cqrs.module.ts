import { Module } from '@nestjs/common';
import { CqrsModule } from '../../src';

@Module({
  imports: [CqrsModule.forRoot()],
  exports: [CqrsModule],
})
export class ShareCqrsModule {}

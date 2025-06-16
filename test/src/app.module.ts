import { Module } from '@nestjs/common';
import { HeroesGameModule } from './heroes/heroes.module';
import { ShareCqrsModule } from './share-cqrs.module';

@Module({
  imports: [HeroesGameModule, ShareCqrsModule],
})
export class AppModule {}

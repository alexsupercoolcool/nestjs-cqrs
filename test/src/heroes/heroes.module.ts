import { Module } from '@nestjs/common';
import { HeroRepository } from './repository/hero.repository';
import { DropAncientItemHandler } from './commands/handlers/drop-ancient-item.handler';
import { KillDragonHandler } from './commands/handlers/kill-dragon.handler';
import { ShareCqrsModule } from '../share-cqrs.module';

@Module({
  imports: [ShareCqrsModule],
  providers: [HeroRepository, DropAncientItemHandler, KillDragonHandler],
})
export class HeroesGameModule {}

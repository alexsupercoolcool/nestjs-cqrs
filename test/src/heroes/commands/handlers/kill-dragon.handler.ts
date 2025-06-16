import { Injectable } from '@nestjs/common';
import { Command, CommandHandler } from '../../../../../src';
import { HeroRepository } from '../../repository/hero.repository';
import { Hero } from '../../models/hero.model';

export class KillDragonCommand extends Command<Hero> {
  constructor(public readonly heroId: string) {
    super();
  }
}

@Injectable()
export class KillDragonHandler extends CommandHandler<KillDragonCommand> {
  constructor(private readonly repository: HeroRepository) {
    super();
  }

  subscribedTo() {
    return [KillDragonCommand];
  }

  async execute(command: KillDragonCommand) {
    const { heroId } = command;
    return this.repository.findOneById(+heroId);
  }
}

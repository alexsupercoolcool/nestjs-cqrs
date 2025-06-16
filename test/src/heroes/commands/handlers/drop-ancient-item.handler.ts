import { Injectable, Logger } from '@nestjs/common';
import { Command, CommandHandler } from '../../../../../src';
import { HeroRepository } from '../../repository/hero.repository';
import { Hero } from '../../models/hero.model';

export class DropAncientItemCommand extends Command<Hero, string> {
  constructor(public readonly heroId: string) {
    super();
  }
}

@Injectable()
export class DropAncientItemHandler extends CommandHandler<DropAncientItemCommand> {
  constructor(private readonly repository: HeroRepository) {
    super();
  }

  subscribedTo() {
    return [DropAncientItemCommand];
  }

  async execute(command: DropAncientItemCommand) {
    Logger.debug('DropAncientItemHandler has been called');

    const { heroId } = command;
    return this.repository.findOneById(+heroId);
  }
}

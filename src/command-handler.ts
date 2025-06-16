import { Inject, OnModuleInit, Type } from '@nestjs/common';

import { Command, EXTRAS_TYPE_SYMBOL, RESULT_TYPE_SYMBOL } from './command';
import { CommandRegistry } from './command-registry';

export interface ICommandHandler<TCommand extends Command<any, any>> {
  execute(
    command: TCommand,
    extras: TCommand[typeof EXTRAS_TYPE_SYMBOL],
  ): Promise<TCommand[typeof RESULT_TYPE_SYMBOL]>;
}

export abstract class CommandHandler<TCommand extends Command<any, any>>
  implements OnModuleInit, ICommandHandler<TCommand>
{
  @Inject()
  protected readonly registry!: CommandRegistry;

  abstract subscribedTo(): Array<Type<TCommand>>;

  abstract execute(
    command: TCommand,
    extras: TCommand[typeof EXTRAS_TYPE_SYMBOL],
  ): Promise<TCommand[typeof RESULT_TYPE_SYMBOL]>;

  onModuleInit() {
    this.registry.register(this);
  }
}

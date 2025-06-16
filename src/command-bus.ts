import { Injectable, Type } from '@nestjs/common';

import { Command, EXTRAS_TYPE_SYMBOL, RESULT_TYPE_SYMBOL } from './command';
import { CommandRegistry } from './command-registry';

@Injectable()
export class CommandBus {
  constructor(private readonly registry: CommandRegistry) {}

  public async execute<TCommand extends Command<any, undefined>>(
    command: TCommand,
  ): Promise<TCommand[typeof RESULT_TYPE_SYMBOL]>;
  public async execute<TCommand extends Command<any, any>>(
    command: TCommand,
    extras: TCommand[typeof EXTRAS_TYPE_SYMBOL],
  ): Promise<TCommand[typeof RESULT_TYPE_SYMBOL]>;
  public async execute<TCommand extends Command<any, any>>(
    command: TCommand,
    extras?: TCommand[typeof EXTRAS_TYPE_SYMBOL],
  ): Promise<TCommand[typeof RESULT_TYPE_SYMBOL]> {
    const handler = this.registry.getHandler<TCommand>(
      command.constructor as Type<TCommand>,
    );

    if (!handler) {
      throw new Error(`No handler for command: ${command.constructor.name}`);
    }

    return handler.execute(
      command,
      extras as TCommand[typeof EXTRAS_TYPE_SYMBOL],
    );
  }
}

import { Injectable } from '@nestjs/common';

import { Command } from './command';
import { CommandHandler } from './command-handler';

@Injectable()
export class CommandRegistry {
  private readonly handlers = new Map<
    new (...args: any[]) => Command<any, any>,
    CommandHandler<Command<any, any>>
  >();

  public register<TCommand extends Command<any, any>>(
    handler: CommandHandler<TCommand>,
  ) {
    for (const commandClass of handler.subscribedTo()) {
      if (this.handlers.has(commandClass)) {
        throw new Error(`Handler for ${commandClass.name} already registered`);
      }
      this.handlers.set(commandClass, handler);
    }
  }

  public getHandler<TCommand extends Command<any, any>>(
    commandClass: new (...args: any[]) => TCommand,
  ): CommandHandler<TCommand> | undefined {
    return this.handlers.get(commandClass) as
      | CommandHandler<TCommand>
      | undefined;
  }
}

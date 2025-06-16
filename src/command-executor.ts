import { CommandBus } from './command-bus';
import { Command, EXTRAS_TYPE_SYMBOL, RESULT_TYPE_SYMBOL } from './command';

export abstract class CommandExecutor {
  protected constructor(protected readonly commandBus: CommandBus) {}

  protected execute<TCommand extends Command<any, any>>(
    command: TCommand,
    extras: TCommand[typeof EXTRAS_TYPE_SYMBOL],
  ): Promise<TCommand[typeof RESULT_TYPE_SYMBOL]> {
    return this.commandBus.execute(command, extras);
  }
}

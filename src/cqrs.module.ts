import { DynamicModule, Module } from '@nestjs/common';
import { CommandRegistry } from './command-registry';
import { CommandBus } from './command-bus';

@Module({})
export class CqrsModule {
  static forRoot(): DynamicModule {
    return {
      module: CqrsModule,
      providers: [CommandRegistry, CommandBus],
      exports: [CommandRegistry, CommandBus],
    };
  }
}

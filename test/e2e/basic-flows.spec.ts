import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '../../src';
import { AppModule } from '../src/app.module';
import {
  KillDragonCommand,
  KillDragonHandler,
} from '../src/heroes/commands/handlers/kill-dragon.handler';
import {
  DropAncientItemCommand,
  DropAncientItemHandler,
} from '../src/heroes/commands/handlers/drop-ancient-item.handler';
import { HERO_ID } from '../src/heroes/repository/fixtures/user';
import { Command, CommandHandler } from '../../src';
import { CommandRegistry } from '../../src';

describe('Basic flows', () => {
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await moduleRef.init();
  });

  describe('when "KillDragonCommand" command is dispatched', () => {
    let killDragonExecuteSpy: jest.SpyInstance;
    let command: KillDragonCommand;

    beforeAll(async () => {
      const killDragonHandler = moduleRef.get(KillDragonHandler);
      killDragonExecuteSpy = jest.spyOn(killDragonHandler, 'execute');
      const commandBus = moduleRef.get(CommandBus);
      command = new KillDragonCommand(HERO_ID);
      await commandBus.execute(command);
    });

    it('should execute command handler', () => {
      expect(killDragonExecuteSpy).toHaveBeenCalledWith(command, undefined);
    });
  });

  describe('when "DropAncientItemCommand" command is dispatched', () => {
    let dropAncientItemExecuteSpy: jest.SpyInstance;
    let command: DropAncientItemCommand;

    beforeAll(async () => {
      const dropAncientItemHandler = moduleRef.get(DropAncientItemHandler);
      dropAncientItemExecuteSpy = jest.spyOn(dropAncientItemHandler, 'execute');
      const commandBus = moduleRef.get(CommandBus);
      command = new DropAncientItemCommand(HERO_ID);
      await commandBus.execute(command, 'extra');
    });

    it('should execute command handler', () => {
      expect(dropAncientItemExecuteSpy).toHaveBeenCalledWith(command, 'extra');
    });
  });

  describe('when unknown command is dispatched', () => {
    class UnhandledCommand extends Command<string> {
      constructor() {
        super();
      }
    }

    it('should throw an error', async () => {
      const commandBus = moduleRef.get(CommandBus);
      const command = new UnhandledCommand();

      await expect(commandBus.execute(command)).rejects.toThrowError(
        /No handler for command: UnhandledCommand/,
      );
    });
  });

  describe('CommandRegistry', () => {
    it('should throw if same handler is registered twice', () => {
      const registry = new CommandRegistry();

      class FakeCommand extends Command<string> {}
      class FakeHandler extends CommandHandler<FakeCommand> {
        subscribedTo() {
          return [FakeCommand];
        }

        async execute(command: FakeCommand) {
          return 'ok';
        }
      }

      const handler = new FakeHandler();
      registry.register(handler);

      expect(() => registry.register(handler)).toThrowError(
        /Handler for FakeCommand already registered/,
      );
    });
  });

  describe('when extras is null', () => {
    let dropAncientItemExecuteSpy: jest.SpyInstance;
    let command: DropAncientItemCommand;

    beforeAll(async () => {
      const handler = moduleRef.get(DropAncientItemHandler);
      dropAncientItemExecuteSpy = jest.spyOn(handler, 'execute');
      const commandBus = moduleRef.get(CommandBus);
      command = new DropAncientItemCommand(HERO_ID);
      await commandBus.execute(command, null as any);
    });

    it('should still execute the handler', () => {
      expect(dropAncientItemExecuteSpy).toHaveBeenCalledWith(command, null);
    });
  });

  describe('multiple command execution', () => {
    it('should handle different commands in sequence', async () => {
      const commandBus = moduleRef.get(CommandBus);

      const killResult = await commandBus.execute(
        new KillDragonCommand(HERO_ID),
      );
      expect(killResult).toBeDefined();

      const dropResult = await commandBus.execute(
        new DropAncientItemCommand(HERO_ID),
        'special',
      );
      expect(dropResult).toBeDefined();
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });
});

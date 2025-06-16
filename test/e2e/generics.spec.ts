import { Test, TestingModule } from '@nestjs/testing';
import {
  Command,
  CommandBus,
  CommandHandler,
  CommandRegistry,
} from '../../src';
import { AppModule } from '../src/app.module';

describe('Generics', () => {
  let moduleRef: TestingModule;
  let commandBus: CommandBus;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await moduleRef.init();

    commandBus = moduleRef.get(CommandBus);
  });

  describe('Commands', () => {
    describe('when "Command" utility class is used', () => {
      it('should infer return type', async () => {
        const command = new Command<string>();

        try {
          await commandBus.execute(command).then((value) => {
            value as string;

            // @ts-expect-error
            value as number;
          });
        } catch {
          // ignore for test purpose
        } finally {
          expect(true).toBeTruthy();
        }
      });

      it('should allow undefined as extras and keep TResult', async () => {
        class TestCommand extends Command<number> {}

        class TestHandler extends CommandHandler<TestCommand> {
          subscribedTo() {
            return [TestCommand];
          }

          async execute(): Promise<number> {
            return 42;
          }
        }

        const registry = new CommandRegistry();
        registry.register(new TestHandler());
        const localCommandBus = new CommandBus(registry);

        const result = await localCommandBus.execute(new TestCommand());
        expect(result).toBe(42);
      });

      it('should allow extras of specific object shape', async () => {
        class ExtraCommand extends Command<string, { suffix: string }> {}

        class ExtraHandler extends CommandHandler<ExtraCommand> {
          subscribedTo() {
            return [ExtraCommand];
          }

          async execute(
            command: ExtraCommand,
            extras: { suffix: string },
          ): Promise<string> {
            return `base-${extras.suffix}`;
          }
        }

        const registry = new CommandRegistry();
        registry.register(new ExtraHandler());
        const localCommandBus = new CommandBus(registry);

        const result = await localCommandBus.execute(new ExtraCommand(), {
          suffix: 'value',
        });

        expect(result).toBe('base-value');
      });

      it('should throw at runtime if extras required but not passed', async () => {
        class NeedsExtrasCommand extends Command<string, { needed: boolean }> {}

        class NeedsExtrasHandler extends CommandHandler<NeedsExtrasCommand> {
          subscribedTo() {
            return [NeedsExtrasCommand];
          }

          async execute(
            command: NeedsExtrasCommand,
            extras: { needed: boolean },
          ): Promise<string> {
            return extras.needed ? 'yes' : 'no';
          }
        }

        const registry = new CommandRegistry();
        registry.register(new NeedsExtrasHandler());
        const localCommandBus = new CommandBus(registry);

        await expect(
          localCommandBus.execute(new NeedsExtrasCommand(), undefined as any),
        ).rejects.toThrowError();
      });
    });
  });

  afterAll(async () => {
    await moduleRef.close();
  });
});

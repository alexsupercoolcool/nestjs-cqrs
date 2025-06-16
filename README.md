# 🧠 `nestjs-cqrs`

**A strongly-typed CQRS extension for NestJS with contextual `extras`, multi-command handlers, and improved DX.**

> 📦 Version 1.0.0  
> Not a replacement for `@nestjs/cqrs`, but a type-safe and ergonomic alternative for advanced use cases.

---

## 🚀 Installation

```bash
npm install nestjs-cqrs
```

---

## 🎯 Why this exists

While `@nestjs/cqrs` is a solid and lightweight CQRS framework, in larger projects you may encounter limitations:

- ❌ Cannot pass additional `extras` (context, tenant info, user session, etc.)
- ❌ Each handler can only subscribe to a single command
- ❌ Decorator-based registration lacks flexibility
- 😵‍💫 Limited DX when working with `CommandBus` in practice

`nestjs-cqrs` solves these issues while staying compatible with NestJS conventions.

---

## 🔍 Key Differences from `@nestjs/cqrs`

| Feature                                  | `@nestjs/cqrs`                        | `nestjs-cqrs` (this package)            |
|------------------------------------------|---------------------------------------|-----------------------------------------|
| Handler registration                     | `@CommandHandler(SomeCommand)`        | `subscribedTo(): [CommandA, CommandB]` |
| One handler for multiple commands        | ❌                                     | ✅                                       |
| Support for `extras` context             | ❌                                     | ✅ via `Command<TResult, TExtras>`     |
| Type-safe `CommandBus.execute(...)`      | ✅ (only TResult)                      | ✅ TResult + TExtras                    |
| Global CQRS module                       | ✅                                     | ✅ (`CqrsModule.forRoot()`)            |

---

## 🧱 Quick Example

### 1. Define a Command

```ts
export class KillDragonCommand extends Command<string> {
  constructor(public readonly heroId: string) {
    super();
  }
}
```

With `extras`:

```ts
export class DropAncientItemCommand extends Command<string, { reason: string }> {
  constructor(public readonly heroId: string) {
    super();
  }
}
```

---

### 2. Create a Handler

```ts
@Injectable()
export class KillDragonHandler extends CommandHandler<KillDragonCommand> {
  subscribedTo() {
    return [KillDragonCommand];
  }

  async execute(command: KillDragonCommand): Promise<string> {
    return `Dragon killed by ${command.heroId}`;
  }
}
```

With `extras`:

```ts
@Injectable()
export class DropAncientItemHandler extends CommandHandler<DropAncientItemCommand> {
  subscribedTo() {
    return [DropAncientItemCommand];
  }

  async execute(command: DropAncientItemCommand, extras: { reason: string }): Promise<string> {
    return `Item dropped by ${command.heroId} because "${extras.reason}"`;
  }
}
```

---

### 3. Register in a Module

```ts
@Module({
  imports: [CqrsModule.forRoot()],
  providers: [KillDragonHandler, DropAncientItemHandler],
})
export class GameModule {}
```

---

### 4. Execute the Command

```ts
const result = await commandBus.execute(
  new DropAncientItemCommand('hero-42'),
  { reason: 'too heavy' },
);
```

---

## 🧪 Testing

```ts
it('should handle command with extras', async () => {
  const result = await commandBus.execute(
    new DropAncientItemCommand('hero-1'),
    { reason: 'bug' },
  );
  expect(result).toContain('hero-1');
});
```

---

## ⚠️ Current Limitations

- `Query`, `Event`, and `Saga` are not yet implemented
- Planned `EventBus` will support **asynchronous broadcasting** to all subscribers
- You can still use `@nestjs/cqrs` alongside this for advanced query/event support

---

## 📅 Roadmap

- [x] Type-safe `CommandBus.execute(...)`
- [x] Multi-command subscription support
- [ ] Support for `Query` and `QueryHandler`
- [ ] Asynchronous `EventBus` with parallel dispatch
- [ ] Middleware/interceptors support
- [ ] CLI generator: `npx nestjs-cqrs generate command`
- [ ] SSR / AOT-compatible registration

---

## 🛡 License

MIT

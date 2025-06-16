export const RESULT_TYPE_SYMBOL = Symbol('RESULT_TYPE');
export const EXTRAS_TYPE_SYMBOL = Symbol('EXTRAS_TYPE');

export class Command<TResult, TExtras = undefined> {
  readonly [RESULT_TYPE_SYMBOL]!: TResult;
  readonly [EXTRAS_TYPE_SYMBOL]!: TExtras;
}

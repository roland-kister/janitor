export class TokenError extends Error {
  constructor(message: string, private _offset: number) {
    super(message);
  }

  get offset(): number {
    return this._offset;
  }
}

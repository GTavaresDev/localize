export type RequestError = {
  status: number;
  message: string;
};

export class Failure<E> {
  constructor(readonly value: E) {}
  isFailure(): this is Failure<E> {
    return true;
  }
  isSuccess(): false {
    return false;
  }
}

export class Success<S> {
  constructor(readonly value: S) {}
  isFailure(): false {
    return false;
  }
  isSuccess(): this is Success<S> {
    return true;
  }
}

export type Either<E, S> = Failure<E> | Success<S>;
export const failure = <E>(e: E) => new Failure(e);
export const success = <S>(s: S) => new Success(s);

import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const GENERIC_CLASS = `// Generic class — T là type của data bên trong

class Box<T> {
  constructor(private value: T) {}

  getValue(): T { return this.value; }

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Box<U>): Box<U> {
    return fn(this.value);
  }

  toString(): string { return \`Box(\${this.value})\`; }
}

const numBox = new Box(42);
const strBox = numBox.map(n => String(n)); // Box<string>
const lenBox = strBox.map(s => s.length);  // Box<number>

// Chaining
const result = new Box('  hello world  ')
  .map(s => s.trim())
  .map(s => s.split(' '))
  .map(words => words.map(w => w[0].toUpperCase() + w.slice(1)))
  .map(words => words.join(' '));

console.log(result.getValue()); // "Hello World"

// Generic class với static factory
class Result<T, E = Error> {
  private constructor(
    private readonly _value: T | null,
    private readonly _error: E | null
  ) {}

  static ok<T>(value: T): Result<T, never> {
    return new Result(value, null) as Result<T, never>;
  }

  static err<E>(error: E): Result<never, E> {
    return new Result(null, error) as Result<never, E>;
  }

  isOk(): boolean { return this._error === null; }
  isErr(): boolean { return !this.isOk(); }

  unwrap(): T { if (this._value === null) throw this._error; return this._value; }
  unwrapOr(fallback: T): T { return this.isOk() ? this._value! : fallback; }
}`;

const FLUENT_GENERIC = `// Fluent API với return this — generic class kế thừa

class Builder<T extends object> {
  protected data: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this; // return this — không phải Builder<T>
  }

  build(): T {
    return this.data as T;
  }
}

interface UserConfig {
  name: string;
  email: string;
  role: 'admin' | 'user';
  age?: number;
}

class UserBuilder extends Builder<UserConfig> {
  withName(name: string): this { return this.set('name', name); }
  withEmail(email: string): this { return this.set('email', email); }
  asAdmin(): this { return this.set('role', 'admin'); }

  validate(): boolean {
    return !!(this.data.name && this.data.email && this.data.role);
  }
}

const user = new UserBuilder()
  .withName('Alice')
  .withEmail('alice@example.com')
  .asAdmin()
  .set('age', 30) // inherited from Builder
  .build();

// Query builder pattern
class QueryBuilder<T extends object> {
  private conditions: Array<(item: T) => boolean> = [];
  private _limit?: number;
  private _orderBy?: keyof T;

  where(predicate: (item: T) => boolean): this {
    this.conditions.push(predicate);
    return this;
  }

  limit(n: number): this { this._limit = n; return this; }
  orderBy(key: keyof T): this { this._orderBy = key; return this; }

  execute(data: T[]): T[] {
    let result = data.filter(item => this.conditions.every(fn => fn(item)));
    if (this._orderBy) {
      const key = this._orderBy;
      result.sort((a, b) => String(a[key]).localeCompare(String(b[key])));
    }
    if (this._limit) result = result.slice(0, this._limit);
    return result;
  }
}`;

const GENERIC_COLLECTION = `// Generic collections — Queue, Map, Set wrappers với extra features

class TypedMap<K, V> {
  private map = new Map<K, V>();

  set(key: K, value: V): this { this.map.set(key, value); return this; }
  get(key: K): V | undefined { return this.map.get(key); }
  has(key: K): boolean { return this.map.has(key); }
  delete(key: K): boolean { return this.map.delete(key); }
  get size(): number { return this.map.size; }

  getOrDefault(key: K, defaultValue: V): V {
    return this.map.get(key) ?? defaultValue;
  }

  getOrSet(key: K, factory: () => V): V {
    if (!this.map.has(key)) this.map.set(key, factory());
    return this.map.get(key)!;
  }

  mapValues<U>(fn: (value: V, key: K) => U): TypedMap<K, U> {
    const result = new TypedMap<K, U>();
    this.map.forEach((v, k) => result.set(k, fn(v, k)));
    return result;
  }

  toRecord(): Record<string, V> {
    const result: Record<string, V> = {};
    this.map.forEach((v, k) => { result[String(k)] = v; });
    return result;
  }
}

// Usage
const cache = new TypedMap<string, number>();
cache.set('a', 1).set('b', 2);

const count = cache.getOrSet('visits', () => 0);
const doubled = cache.mapValues(v => v * 2); // TypedMap<string, number>`;

const GENERIC_TUPLE = `// Generics với Tuples — variadic tuple types (TS 4.0+)

// Spread trong tuple
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];

type AB = Concat<[1, 2], [3, 4]>; // [1, 2, 3, 4]

// Head và Tail
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;
type Tail<T extends unknown[]> = T extends [unknown, ...infer T] ? T : never;
type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

// Zip two tuples
type Zip<T extends unknown[], U extends unknown[]> =
  T extends [infer TH, ...infer TT]
    ? U extends [infer UH, ...infer UT]
      ? [[TH, UH], ...Zip<TT, UT>]
      : []
    : [];

type Zipped = Zip<[1, 2, 3], ['a', 'b', 'c']>;
// [[1, "a"], [2, "b"], [3, "c"]]

// Variadic generics — spread trong function args
function tuple<T extends unknown[]>(...args: T): T {
  return args;
}

const t = tuple(1, 'hello', true); // [number, string, boolean]

// Prepend type to tuple
type Prepend<T, Tuple extends unknown[]> = [T, ...Tuple];
type WithId<T extends unknown[]> = Prepend<string, T>;

type IdArgs = WithId<[name: string, age: number]>; // [string, string, number]`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson03({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-03"
      num="03"
      title="Generic Classes"
      desc="Box<T>, fluent API, Builder pattern, generic collections, variadic tuples"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Generic Classes nâng cao">
        <Concept>
          <p>
            Generic classes không chỉ là data containers. Chúng có thể có{' '}
            <strong>fluent API</strong> (chaining với <code className="ic">return this</code>),{' '}
            <strong>functional map/flatMap</strong>, và <strong>builder patterns</strong>. Kết hợp
            với variadic tuple types (TS 4.0+), generics đạt được type safety ở mức rất cao.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Box<T> & Result<T,E>', code: GENERIC_CLASS },
            { label: 'Fluent API & Builder', code: FLUENT_GENERIC },
            { label: 'Generic Collections', code: GENERIC_COLLECTION },
            { label: 'Variadic Tuples', code: GENERIC_TUPLE },
          ]}
        />
      </Sec>

      <Sec title="Patterns với Generic Classes">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Kỹ thuật</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Container/Functor', 'map<U>(fn: T→U): Box<U>', 'Box<T>, Maybe<T>, Result<T,E>'],
              ['Builder', 'set<K extends keyof T>(): this', 'UserBuilder, QueryBuilder'],
              ['Repository', 'T extends {id: string}', 'Generic CRUD'],
              ['Collection wrapper', 'TypedMap<K,V>', 'Type-safe lookup'],
              ['Variadic', '[...T, ...U], Head<T>, Tail<T>', 'Tuple manipulation'],
            ].map(([pattern, tech, example]) => (
              <tr key={pattern}>
                <td>
                  <strong>{pattern}</strong>
                </td>
                <td>
                  <code>{tech}</code>
                </td>
                <td>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>return this vs return ClassName:</strong> Khi generic class extend được, dùng
          return type <code className="ic">this</code> thay vì{' '}
          <code className="ic">Builder&lt;T&gt;</code>. Subclass gọi method cha sẽ nhận đúng type
          subclass, không phải parent — quan trọng cho fluent API chaining.
        </Callout>
        <Callout type="warn">
          <strong>Box/Result không phải monad hoàn chỉnh:</strong> TypeScript không enforce monad
          laws. Patterns như Box, Maybe, Result ở đây là approximation — hữu ích nhưng không phải
          Haskell monads. Dùng thư viện như <code className="ic">fp-ts</code> nếu cần full monadic
          composition.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement class Maybe<T> với static of<T>(value: T | null | undefined): Maybe<T>, map<U>(fn: T→U): Maybe<U>, getOrElse(fallback: T): T, isPresent(): boolean.',
            },
            {
              level: 'medium',
              text: 'Tạo class Pipeline<T> với pipe<U>(fn: (value: T) => U): Pipeline<U> và execute(): T. Cho phép chain: new Pipeline(5).pipe(x => x*2).pipe(x => String(x)).execute() → "10".',
            },
            {
              level: 'hard',
              text: 'Implement generic class ObservableValue<T> với get(): T, set(v: T): void, subscribe(fn: (v: T) => void): () => void (trả về unsubscribe), và computed<U>(fn: (v: T) => U): ObservableValue<U>.',
            },
          ]}
          hint="Maybe: constructor private, check value !== null && !== undefined. Pipeline: lưu array of functions, execute() chạy reduce. ObservableValue: Set<listener>, notify khi set(), computed subscribe vào source."
        />
      </Sec>
    </LessonCard>
  );
}

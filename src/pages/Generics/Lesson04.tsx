import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const GENERIC_INTERFACE = `// Generic interfaces — contract với type parameters

// Basic generic interface
interface Container<T> {
  value: T;
  transform<U>(fn: (value: T) => U): Container<U>;
}

// Multiple type params
interface KeyValuePair<K, V> {
  key: K;
  value: V;
}

// Generic interface với method signatures
interface IRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
}

// Specialized — thu hẹp generic interface
interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: User['role']): Promise<User[]>;
}

// Generic API response
interface ApiResponse<T = unknown, E = string> {
  success: boolean;
  data?: T;
  error?: E;
  timestamp: number;
}

type SuccessResponse<T> = ApiResponse<T, never> & { success: true; data: T };
type ErrorResponse<E = string> = ApiResponse<never, E> & { success: false; error: E };`;

const GENERIC_TYPE_ALIAS = `// Generic type aliases — kết hợp nhiều patterns

// Nullable wrapper
type Nullable<T> = T | null;
type Maybe<T> = T | null | undefined;
type Optional<T> = T | undefined;

// Readonly deep
type ReadonlyDeep<T> = {
  readonly [K in keyof T]: T[K] extends object ? ReadonlyDeep<T[K]> : T[K];
};

// Mutable — ngược lại Readonly
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Awaited — unwrap Promise
type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

// Branded types — type safety cho primitives
type Brand<T, B extends string> = T & { __brand: B };
type UserId = Brand<string, 'UserId'>;
type ProductId = Brand<string, 'ProductId'>;

function createUserId(id: string): UserId {
  return id as UserId;
}

function deleteUser(id: UserId): void { /* ... */ }

const uid = createUserId('usr-123');
const pid = 'prod-456' as ProductId;

deleteUser(uid); // OK
// deleteUser(pid); // Error — ProductId không phải UserId
// deleteUser('raw-string'); // Error — raw string không phải UserId`;

const GENERIC_FUNCTION_TYPE = `// Generic function types — type aliases cho function signatures

// Basic function type alias
type Predicate<T> = (value: T) => boolean;
type Transform<T, U = T> = (value: T) => U;
type AsyncTransform<T, U = T> = (value: T) => Promise<U>;

// Higher-order function types
type Middleware<T> = (value: T, next: Transform<T>) => T;
type Reducer<State, Action> = (state: State, action: Action) => State;

// Event handler types
type EventHandler<T = unknown> = (event: T) => void | Promise<void>;
type Listener<Events extends Record<string, unknown>, K extends keyof Events> =
  (data: Events[K]) => void;

// Compose functions types — type-safe composition
type Fn<A, B> = (a: A) => B;
type Compose<F, G> =
  F extends Fn<infer A, infer B>
    ? G extends Fn<B, infer C>
      ? Fn<A, C>
      : never
    : never;

// Curry types
type Curry<F> = F extends (a: infer A, b: infer B) => infer C
  ? (a: A) => (b: B) => C
  : never;

type AddFn = (a: number, b: number) => number;
type CurriedAdd = Curry<AddFn>; // (a: number) => (b: number) => number

// Usage
const add: AddFn = (a, b) => a + b;
const curriedAdd: CurriedAdd = a => b => a + b;
const add5 = curriedAdd(5); // (b: number) => number`;

const GENERIC_CONDITIONAL = `// Generic interfaces kết hợp conditional types

// Response type phụ thuộc vào method
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HasBody<M extends HttpMethod> = M extends 'GET' | 'DELETE' ? false : true;

type RequestOptions<M extends HttpMethod> = {
  method: M;
  url: string;
} & (HasBody<M> extends true ? { body: unknown } : Record<string, never>);

// API endpoint definition
interface Endpoint<
  Method extends HttpMethod,
  Params extends object = object,
  Body = never,
  Response = unknown
> {
  method: Method;
  path: string;
  params?: Params;
  body?: Body;
  response: Response;
}

type UserListEndpoint = Endpoint<'GET', { page?: number }, never, User[]>;
type CreateUserEndpoint = Endpoint<'POST', never, { name: string; email: string }, User>;

// Type-safe API client interface
interface IApiClient {
  request<E extends Endpoint<HttpMethod, object, unknown, unknown>>(
    endpoint: E,
    ...args: E['body'] extends never ? [] : [body: E['body']]
  ): Promise<E['response']>;
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson04({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-04"
      num="04"
      title="Generic Interfaces & Type Aliases"
      desc="Generic interfaces, branded types, function type aliases, conditional generic types"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Generic Interfaces & Type Aliases">
        <Concept>
          <p>
            Generic interfaces và type aliases là nền tảng để xây dựng abstractions tái sử dụng.{' '}
            <strong>IRepository&lt;T&gt;</strong>, <strong>ApiResponse&lt;T, E&gt;</strong>,{' '}
            <strong>Branded types</strong> — những patterns này xuất hiện trong hầu hết mọi
            TypeScript codebase production.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Generic interfaces', code: GENERIC_INTERFACE },
            { label: 'Generic type aliases', code: GENERIC_TYPE_ALIAS },
            { label: 'Function type aliases', code: GENERIC_FUNCTION_TYPE },
            { label: 'Conditional generics', code: GENERIC_CONDITIONAL },
          ]}
        />
      </Sec>

      <Sec title="Branded Types — tại sao cần?">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Vấn đề</th>
              <th>Không có Brand</th>
              <th>Với Brand</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Nhầm ID', 'deleteUser(productId) — OK!', 'deleteUser(productId) — Error!'],
              ['Type', 'string', 'Brand<string, "UserId">'],
              ['Runtime cost', 'Không có', 'Không có (compile-time only)'],
              ['Tạo giá trị', 'Tự do', 'Phải qua factory function'],
              ['Use case', 'N/A', 'UserId, Email, Slug, Currency'],
            ].map(([issue, without, with_]) => (
              <tr key={issue}>
                <td>
                  <strong>{issue}</strong>
                </td>
                <td>{without}</td>
                <td>{with_}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Branded types = zero runtime cost:</strong>{' '}
          <code className="ic">Brand&lt;string, "UserId"&gt;</code> vẫn là string ở runtime —
          TypeScript chỉ check lúc compile. Dùng để ngăn nhầm lẫn giữa các loại ID, email, slug,
          tiền tệ,... mà đều là string/number underneath.
        </Callout>
        <Callout type="warn">
          <strong>Generic interface vs abstract class:</strong> Generic interface không có
          implementation — chỉ là contract. Abstract class generic có thể có concrete methods. Nếu
          cần share code giữa implementations, dùng abstract class. Nếu chỉ cần contract (DIP), dùng
          interface.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo generic interface ICacheService<K, V> với get, set(ttl?), delete, clear, has, size. Implement MemoryCache<K, V> với Map và optional TTL support.',
            },
            {
              level: 'medium',
              text: 'Tạo Branded types: Email (validate format), Slug (lowercase, no spaces), PositiveNumber (> 0). Viết factory functions tương ứng throw Error nếu invalid. Viết createProduct(name: Slug, price: PositiveNumber).',
            },
            {
              level: 'hard',
              text: 'Implement type-safe generic Reducer<State, Actions extends Record<string, unknown>> với: type ActionType<A extends Record<string, unknown>> = { [K in keyof A]: { type: K; payload: A[K] } }[keyof A]. Viết createReducer() factory.',
            },
          ]}
          hint="ICacheService: get returns V | undefined. Email: /^[^@]+@[^@]+\\.[^@]+$/.test(). Reducer: ActionType tạo discriminated union tự động từ Actions map."
        />
      </Sec>
    </LessonCard>
  );
}

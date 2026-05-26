import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const API_CLIENT = `// Type-safe API Client — áp dụng toàn bộ generics

// Định nghĩa endpoints
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface EndpointDef<
  M extends Method,
  P extends object = object,
  B = never,
  R = unknown
> {
  method: M;
  params?: P;
  body?: B;
  response: R;
}

// Route map
type ApiRouteMap = {
  '/users':           EndpointDef<'GET',    { page?: number }, never,             User[]>;
  '/users/:id':       EndpointDef<'GET',    { id: string },    never,             User>;
  '/users/create':    EndpointDef<'POST',   object,            CreateUserInput,   User>;
  '/users/:id/update':EndpointDef<'PUT',    { id: string },    UpdateUserInput,   User>;
  '/users/:id/delete':EndpointDef<'DELETE', { id: string },    never,             void>;
};

// Extract types
type RouteParams<Route extends keyof ApiRouteMap> =
  NonNullable<ApiRouteMap[Route]['params']>;

type RouteBody<Route extends keyof ApiRouteMap> =
  ApiRouteMap[Route]['body'];

type RouteResponse<Route extends keyof ApiRouteMap> =
  ApiRouteMap[Route]['response'];

// Type-safe client
class ApiClient {
  constructor(private baseUrl: string) {}

  async request<Route extends keyof ApiRouteMap>(
    route: Route,
    ...[options]: RouteBody<Route> extends never
      ? [options?: { params?: RouteParams<Route> }]
      : [options: { params?: RouteParams<Route>; body: RouteBody<Route> }]
  ): Promise<RouteResponse<Route>> {
    const method = ('/users' as Route) === route ? 'GET' : 'GET';
    const res = await fetch(\`\${this.baseUrl}\${route}\`, { method });
    return res.json();
  }
}`;

const GENERIC_STATE = `// Generic State Management — type-safe store

type Reducer<S, A> = (state: S, action: A) => S;
type Selector<S, R> = (state: S) => R;

class Store<State, Actions> {
  private state: State;
  private listeners = new Set<(state: State) => void>();

  constructor(
    initialState: State,
    private reducer: Reducer<State, Actions>
  ) {
    this.state = initialState;
  }

  getState(): State { return this.state; }

  dispatch(action: Actions): void {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach(l => l(this.state));
  }

  select<R>(selector: Selector<State, R>): R {
    return selector(this.state);
  }

  subscribe(listener: (state: State) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// Usage — fully typed
interface AppState {
  users: User[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'FETCH_USERS_START' }
  | { type: 'FETCH_USERS_SUCCESS'; payload: User[] }
  | { type: 'FETCH_USERS_ERROR'; payload: string }
  | { type: 'DELETE_USER'; payload: string };

const reducer: Reducer<AppState, AppAction> = (state, action) => {
  switch (action.type) {
    case 'FETCH_USERS_START':   return { ...state, loading: true, error: null };
    case 'FETCH_USERS_SUCCESS': return { ...state, loading: false, users: action.payload };
    case 'FETCH_USERS_ERROR':   return { ...state, loading: false, error: action.payload };
    case 'DELETE_USER':         return { ...state, users: state.users.filter(u => u.id !== action.payload) };
    default: return state;
  }
};

const store = new Store<AppState, AppAction>(
  { users: [], loading: false, error: null },
  reducer
);`;

const GENERIC_VALIDATION = `// Generic Validation System

type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; errors: string[] };

interface Schema<T> {
  parse(input: unknown): ValidationResult<T>;
}

// String schema
class StringSchema implements Schema<string> {
  private rules: Array<(s: string) => string | null> = [];

  min(n: number): this {
    this.rules.push(s => s.length >= n ? null : \`Min length \${n}\`);
    return this;
  }

  max(n: number): this {
    this.rules.push(s => s.length <= n ? null : \`Max length \${n}\`);
    return this;
  }

  email(): this {
    this.rules.push(s => /^[^@]+@[^@]+\\.[^@]+$/.test(s) ? null : 'Invalid email');
    return this;
  }

  parse(input: unknown): ValidationResult<string> {
    if (typeof input !== 'string') return { valid: false, errors: ['Expected string'] };
    const errors = this.rules.map(r => r(input)).filter(Boolean) as string[];
    return errors.length ? { valid: false, errors } : { valid: true, value: input };
  }
}

// Object schema — generic over shape
class ObjectSchema<T extends Record<string, Schema<unknown>>> implements Schema<{
  [K in keyof T]: T[K] extends Schema<infer V> ? V : never;
}> {
  constructor(private shape: T) {}

  parse(input: unknown): ValidationResult<{ [K in keyof T]: T[K] extends Schema<infer V> ? V : never }> {
    if (typeof input !== 'object' || !input) return { valid: false, errors: ['Expected object'] };
    const errors: string[] = [];
    const result: Record<string, unknown> = {};
    for (const [key, schema] of Object.entries(this.shape)) {
      const r = (schema as Schema<unknown>).parse((input as Record<string, unknown>)[key]);
      if (r.valid) result[key] = r.value;
      else errors.push(...r.errors.map(e => \`\${key}: \${e}\`));
    }
    if (errors.length) return { valid: false, errors };
    return { valid: true, value: result as never };
  }
}

const userSchema = new ObjectSchema({
  name:  new StringSchema().min(2).max(50),
  email: new StringSchema().email(),
});`;

const GENERIC_PATTERNS_SUMMARY = `// Tổng hợp: patterns nào dùng khi nào

// 1. Generic function — khi cần tái sử dụng logic
function first<T>(arr: T[]): T | undefined { return arr[0]; }

// 2. Generic constraint — khi cần access specific properties
function findById<T extends { id: string }>(items: T[], id: string) {
  return items.find(i => i.id === id);
}

// 3. Generic class — khi cần data structure type-safe
class Cache<K, V> {
  private store = new Map<K, V>();
  get(key: K) { return this.store.get(key); }
  set(key: K, value: V) { this.store.set(key, value); }
}

// 4. Generic interface — khi cần define reusable contract
interface IService<T, CreateDTO, UpdateDTO = Partial<CreateDTO>> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(dto: CreateDTO): Promise<T>;
  update(id: string, dto: UpdateDTO): Promise<T>;
}

// 5. Mapped type — khi cần transform shape của type
type Nullable<T> = { [K in keyof T]: T[K] | null };

// 6. Conditional type — khi type phụ thuộc vào điều kiện
type Flatten<T> = T extends (infer E)[] ? E : T;

// 7. infer — khi cần extract type từ complex structure
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// 8. Recursive type — khi cần handle nested structures
type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

// 9. HOF generic — khi cần wrap function với extra behavior
function withCache<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const cache = new Map<string, R>();
  return (...args) => {
    const key = JSON.stringify(args);
    return cache.has(key) ? cache.get(key)! : (cache.set(key, fn(...args)), cache.get(key)!);
  };
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson10({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-10"
      num="10"
      title="Generics Thực Chiến"
      desc="Type-safe API client, generic state store, validation schema, pattern summary"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Generics trong thực tế">
        <Concept>
          <p>
            Bài tổng kết áp dụng toàn bộ kiến thức generics vào 3 use cases thực tế:{' '}
            <strong>type-safe API client</strong> (route types, conditional body),{' '}
            <strong>generic state store</strong> (Redux-like với full type inference), và{' '}
            <strong>validation schema builder</strong> (Zod-like với chained methods).
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Type-safe API Client', code: API_CLIENT },
            { label: 'Generic State Store', code: GENERIC_STATE },
            { label: 'Validation Schema', code: GENERIC_VALIDATION },
            { label: 'Pattern Summary', code: GENERIC_PATTERNS_SUMMARY },
          ]}
        />
      </Sec>

      <Sec title="Khi nào dùng pattern nào">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Bài toán</th>
              <th>Pattern</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Tái sử dụng logic', 'Generic function', 'first<T>, memoize<F>'],
              ['Access properties', 'extends constraint', 'findById<T extends {id}>'],
              ['Data structure', 'Generic class', 'Cache<K,V>, Store<S,A>'],
              ['Reusable contract', 'Generic interface', 'IRepository<T,ID>'],
              ['Transform shape', 'Mapped type', 'Nullable<T>, FormState<T>'],
              ['Conditional shape', 'Conditional type', 'HasBody<Method>'],
              ['Extract type', 'infer', 'ReturnType<F>, Awaited<T>'],
              ['Nested types', 'Recursive type', 'DeepPartial<T>'],
              ['Wrap behavior', 'HOF generic', 'retry<F>, withCache<F>'],
            ].map(([problem, pattern, example]) => (
              <tr key={problem}>
                <td>{problem}</td>
                <td>
                  <strong>{pattern}</strong>
                </td>
                <td>
                  <code>{example}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Generics không phải silver bullet:</strong> Không phải mọi code đều cần generic.
          Nếu một function chỉ làm việc với string, đừng làm nó generic. Thêm generic khi cùng logic
          cần dùng với nhiều types — nếu chỉ 1 type, cụ thể hóa thay vì abstract.
        </Callout>
        <Callout type="warn">
          <strong>TypeScript infer có giới hạn:</strong> Đôi khi TypeScript không infer đúng trong
          generic phức tạp. Khi đó, explicit type annotation hoặc đơn giản hóa type structure. Lỗi
          "Type instantiation is excessively deep" — TypeScript đang stack overflow với recursive
          type; thêm depth limit hoặc dùng brute-force approach.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement generic function deepEqual<T>(a: T, b: T): boolean — so sánh sâu hai values. Handle: primitives, arrays, objects. Không cần handle Date, RegExp, Map, Set.',
            },
            {
              level: 'medium',
              text: 'Tạo type-safe EventBus singleton: EventBus<Events extends Record<string, unknown>> với on, off, emit, once. Dùng class với static getInstance<Events>(). Singleton per Events type (hint: Map của instances).',
            },
            {
              level: 'hard',
              text: 'Implement mini Zod-like schema: z.string().min(3).max(50).email(), z.number().min(0).max(100), z.object({ name: z.string(), age: z.number() }). Return type của z.object({...}).parse() phải là TypeScript-inferred.',
            },
          ]}
          hint="deepEqual: typeof + Array.isArray + Object.keys. EventBus singleton: private static instances = new Map(). z.object: generic qua shape, parse infer từ shape schema types."
        />
      </Sec>
    </LessonCard>
  );
}

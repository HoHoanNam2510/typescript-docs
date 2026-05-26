import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const SATISFIES = `// satisfies operator (TypeScript 4.9)
// Kiểm tra type compatibility nhưng giữ nguyên inferred literal types

// Vấn đề với annotation thông thường
const palette1: Record<string, string | number[]> = {
  red: [255, 0, 0],
  green: '#00ff00',
};
// palette1.red là string | number[] — mất type info cụ thể!

// satisfies — giữ literal types
const palette2 = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;

palette2.red;         // number[] — TypeScript biết đây là array
palette2.green;       // string — TypeScript biết đây là string
palette2.red.map;     // OK — array method available

// Routes config — thực tế hay dùng
type RouteConfig = {
  path: string;
  component: string;
  auth: boolean;
  children?: RouteConfig[];
};

const ROUTES = {
  home:      { path: '/',       component: 'Home',    auth: false },
  profile:   { path: '/profile', component: 'Profile', auth: true },
  dashboard: { path: '/dash',   component: 'Dashboard', auth: true },
} satisfies Record<string, RouteConfig>;

// ROUTES.home.path là "/" (literal) không phải string
type HomePath = typeof ROUTES.home.path; // "/"

// satisfies + as const — tốt nhất của cả hai
const COLORS = {
  primary: '#3178c6',
  secondary: '#007ACC',
  danger: '#e74c3c',
} as const satisfies Record<string, string>;

type ColorKey = keyof typeof COLORS; // "primary" | "secondary" | "danger"`;

const CONST_ASSERTIONS = `// as const — convert mutable types sang readonly literals

// Không có as const — types mở rộng
const config1 = {
  host: 'localhost',
  port: 3000,
  debug: false,
};
// config1: { host: string; port: number; debug: boolean }
config1.host = 'prod'; // OK — mutable

// Với as const — deep readonly, literal types
const config2 = {
  host: 'localhost',
  port: 3000,
  debug: false,
} as const;
// config2: { readonly host: "localhost"; readonly port: 3000; readonly debug: false }
// config2.host = 'prod'; // Error — readonly

// Array as const — tuple type
const STATUSES = ['active', 'inactive', 'pending'] as const;
// type: readonly ["active", "inactive", "pending"]
type Status = (typeof STATUSES)[number]; // "active" | "inactive" | "pending"

// Object as const → use keyof for keys, [keyof] for values
const HTTP_METHODS = { GET: 'GET', POST: 'POST', PUT: 'PUT', DELETE: 'DELETE' } as const;
type HttpMethod = (typeof HTTP_METHODS)[keyof typeof HTTP_METHODS];
// "GET" | "POST" | "PUT" | "DELETE"

// Function with as const return — infer literal return type
function createAction<T extends string, P>(type: T, payload: P) {
  return { type, payload } as const;
}

const fetchAction = createAction('FETCH_USER', { id: '123' });
// type: { readonly type: "FETCH_USER"; readonly payload: { readonly id: "123" } }`;

const CONST_TYPE_PARAMS = `// const type parameters (TypeScript 5.0)
// Tự động infer literal types khi gọi generic function

// Trước TS 5.0 — phải dùng as const khi gọi
function first<T>(arr: T[]): T {
  return arr[0]!;
}

const result1 = first(['a', 'b', 'c']); // string — không giữ literals
const result2 = first(['a', 'b', 'c'] as const); // "a" | "b" | "c"

// TS 5.0 — const type parameter — tự infer literals
function firstConst<const T>(arr: readonly T[]): T {
  return arr[0]!;
}

const result3 = firstConst(['a', 'b', 'c']); // "a" | "b" | "c" — tự động!

// Practical: type-safe route builder
function defineRoutes<const T extends Record<string, { path: string; method: string }>>(
  routes: T
): T {
  return routes;
}

const routes = defineRoutes({
  getUser:    { path: '/users/:id', method: 'GET' },
  createUser: { path: '/users',     method: 'POST' },
});
// routes.getUser.method là "GET" không phải string
type GetMethod = typeof routes.getUser.method; // "GET"

// Kết hợp với satisfies — maximum type safety
function createConfig<const T>(config: T): Readonly<T> {
  return Object.freeze(config) as Readonly<T>;
}`;

const ADVANCED_FEATURES = `// Variadic Tuple Types (TypeScript 4.0)
// Spread types trong tuple position

// Concat hai tuples
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U];
type Combined = Concat<[string, number], [boolean, Date]>;
// [string, number, boolean, Date]

// Prepend element to tuple
type Prepend<T extends unknown[], E> = [E, ...T];
type PrependString = Prepend<[number, boolean], string>;
// [string, number, boolean]

// Function với variadic params
function concat<T extends unknown[], U extends unknown[]>(
  arr1: [...T],
  arr2: [...U]
): [...T, ...U] {
  return [...arr1, ...arr2];
}

const result = concat([1, 'hello'], [true, new Date()]);
// [number, string, boolean, Date]

// Curry với variadic types
type Curried<Args extends unknown[], R> =
  Args extends [infer First, ...infer Rest]
    ? (arg: First) => Curried<Rest, R>
    : R;

// Tail recursion với tuple
type Length<T extends unknown[]> = T['length'];
type L = Length<[string, number, boolean]>; // 3

// Template literal + variadic
type Join<T extends string[], Sep extends string = ','> =
  T extends []              ? '' :
  T extends [infer S]       ? S :
  T extends [infer H extends string, ...infer R extends string[]]
    ? \`\${H}\${Sep}\${Join<R, Sep>}\`
    : never;

type Path = Join<['users', 'profile', 'settings'], '/'>; // "users/profile/settings"`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson09({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-09"
      num="09"
      title="satisfies, as const & Advanced Features"
      desc="satisfies operator, const assertions, const type params, variadic tuples"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="satisfies & const Assertions">
        <Concept>
          <p>
            <code className="ic">satisfies</code> (TS 4.9) và <code className="ic">as const</code>{' '}
            giải quyết tension giữa <em>type checking</em> và <em>type inference</em>.{' '}
            <code className="ic">as const</code> giữ literal types nhưng không check shape.{' '}
            <code className="ic">satisfies</code> check shape nhưng giữ inferred type. Kết hợp cả
            hai để có maximum type safety.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'satisfies operator', code: SATISFIES },
            { label: 'as const', code: CONST_ASSERTIONS },
            { label: 'const type params (TS 5.0)', code: CONST_TYPE_PARAMS },
            { label: 'Variadic tuples', code: ADVANCED_FEATURES },
          ]}
        />
      </Sec>

      <Sec title="satisfies vs annotation vs as const">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Kỹ thuật</th>
              <th>Type check shape?</th>
              <th>Giữ literal types?</th>
              <th>Readonly?</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['const x: T = { ... }', 'Có', 'Không — widened', 'Không'],
              ['const x = { ... } satisfies T', 'Có', 'Có — inferred', 'Không'],
              ['const x = { ... } as const', 'Không', 'Có — literal', 'Có — deep'],
              ['const x = { ... } as const satisfies T', 'Có', 'Có — literal', 'Có — deep'],
            ].map(([tech, check, literal, readonly]) => (
              <tr key={tech}>
                <td>
                  <code style={{ fontSize: 11 }}>{tech}</code>
                </td>
                <td>{check}</td>
                <td>{literal}</td>
                <td>{readonly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>as const satisfies T — thứ tự quan trọng:</strong>{' '}
          <code className="ic">as const satisfies T</code> không phải{' '}
          <code className="ic">satisfies T as const</code>. Thứ tự: giá trị literal →{' '}
          <code className="ic">as const</code> → <code className="ic">satisfies T</code>. TypeScript
          apply từ trái sang phải.
        </Callout>
        <Callout type="warn">
          <strong>const type params chỉ TS 5.0+:</strong> Syntax{' '}
          <code className="ic">{'function f<const T>'}</code> yêu cầu TypeScript 5.0 trở lên. Trước
          đó phải dùng <code className="ic">as const</code> khi gọi hàm hoặc trick với{' '}
          <code className="ic">T extends readonly unknown[]</code>.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Dùng as const và satisfies tạo THEME object với colors (primary, secondary, danger), spacing (sm, md, lg, xl), borderRadius (sm, md, lg). Type: Record<string, Record<string, string>>. Verify literal types được preserve.',
            },
            {
              level: 'medium',
              text: 'Implement defineRoutes<const T extends Record<string, RouteConfig>>(routes: T): T — trả về chính xác T với literal types. RouteConfig = { path: string; auth: boolean; method: HttpMethod }. Test keyof typeof result.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe Concat<T extends unknown[], U extends unknown[]>: [...T, ...U] và function concat(arr1: T, arr2: U): Concat<T, U>. Test với tuples có mixed types. Implement Zip<T, U> = { [K in keyof T]: [T[K], U[K & keyof U]] }.',
            },
          ]}
          hint="THEME: { colors: { primary: '#...' } } satisfies Record<string, Record<string, string>> as const. defineRoutes: const type param. Zip: mapped type over T's keys, access U[K & keyof U]."
        />
      </Sec>
    </LessonCard>
  );
}

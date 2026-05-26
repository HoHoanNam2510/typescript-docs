import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const CONDITIONAL_BASIC = `// Conditional Types — type tương đương với if/else
// Syntax: T extends U ? TrueType : FalseType

// Câu hỏi: "T có phải subtype của U không?"
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false
type C = IsString<'hello'>; // true (literal là subtype của string)

// Ứng dụng thực tế: loại bỏ null/undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type D = NonNullable<string | null>;     // string
type E = NonNullable<number | undefined>; // number
type F = NonNullable<null | undefined>;   // never

// IsArray — kiểm tra T có phải array không
type IsArray<T> = T extends unknown[] ? true : false;

type G = IsArray<string[]>; // true
type H = IsArray<string>;   // false

// Flatten — lấy element type từ array
type Flatten<T> = T extends (infer Item)[] ? Item : T;

type I = Flatten<string[]>; // string
type J = Flatten<number>;   // number (không phải array)`;

const INFER_KEYWORD = `// infer — khai báo type variable bên trong conditional type
// Dùng để "extract" type từ structure phức tạp

// ReturnType — lấy return type của function
type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

function greet(name: string): string { return \`Hello \${name}\`; }
type GreetReturn = MyReturnType<typeof greet>; // string

// Parameters — lấy tuple của param types
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never;
type GreetParams = MyParameters<typeof greet>; // [name: string]

// Awaited — unwrap Promise
type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T;

type P1 = MyAwaited<Promise<string>>;           // string
type P2 = MyAwaited<Promise<Promise<number>>>;  // number

// Tách phần tử đầu và cuối của tuple
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;
type Tail<T extends unknown[]> = T extends [unknown, ...infer T] ? T : never;

type H = Head<[string, number, boolean]>; // string
type T = Tail<[string, number, boolean]>; // [number, boolean]`;

const DISTRIBUTIVE = `// Distributive conditional types — auto distribute over union
// Khi T là type parameter trần (naked), conditional type tự distribute

type ToArray<T> = T extends unknown ? T[] : never;

// Với union → distribute từng member
type R1 = ToArray<string | number>; // string[] | number[]
// Không phải (string | number)[]!

// Ngăn distribution — wrap trong tuple
type ToArrayNonDistributive<T> = [T] extends [unknown] ? T[] : never;
type R2 = ToArrayNonDistributive<string | number>; // (string | number)[]

// Filter union — dùng distribution
type FilterString<T> = T extends string ? T : never;
type R3 = FilterString<string | number | boolean>; // string

// Extract và Exclude dùng distributive
type MyExtract<T, U> = T extends U ? T : never;
type MyExclude<T, U> = T extends U ? never : T;

type R4 = MyExtract<'a' | 'b' | 'c', 'a' | 'c'>; // "a" | "c"
type R5 = MyExclude<'a' | 'b' | 'c', 'a' | 'c'>; // "b"`;

const CONDITIONAL_PRACTICAL = `// Ứng dụng thực tế: type-safe API client

// Lấy type đúng dựa vào HTTP method
type RequestBody<M extends string> =
  M extends 'GET' | 'DELETE' ? never : Record<string, unknown>;

// Chỉ POST/PUT/PATCH mới có body
function request<M extends 'GET' | 'POST' | 'PUT' | 'DELETE'>(
  method: M,
  url: string,
  ...args: M extends 'GET' | 'DELETE' ? [] : [body: Record<string, unknown>]
): void { /* ... */ }

request('GET', '/users');                    // OK — không có body
request('POST', '/users', { name: 'Bob' }); // OK — có body
// request('GET', '/users', { name: 'Bob' }); // Error!

// Conditional return type
type ApiResult<T, HasData extends boolean> =
  HasData extends true
    ? { success: true; data: T }
    : { success: false; error: string };

function get<T, HasData extends boolean = true>(
  url: string,
  hasData?: HasData
): Promise<ApiResult<T, HasData>> {
  return fetch(url).then(r => r.json());
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson09({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-09"
      num="09"
      title="Conditional Types"
      desc="T extends U ? A : B — infer, distributive, và Extract/Exclude pattern"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Conditional Types">
        <Concept>
          <p>
            <strong>Conditional Types</strong> cho phép type thay đổi dựa vào điều kiện:{' '}
            <code className="ic">T extends U ? TrueType : FalseType</code>. Kết hợp với từ khóa{' '}
            <code className="ic">infer</code>, có thể extract type từ structure phức tạp.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Cơ bản', code: CONDITIONAL_BASIC },
            { label: 'infer keyword', code: INFER_KEYWORD },
            { label: 'Distributive', code: DISTRIBUTIVE },
            { label: 'Thực tế', code: CONDITIONAL_PRACTICAL },
          ]}
        />
      </Sec>

      <Sec title="Built-in conditional types">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Utility Type</th>
              <th>Implementation</th>
              <th>Dùng khi</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'NonNullable<T>',
                'T extends null | undefined ? never : T',
                'Loại bỏ null/undefined',
              ],
              ['ReturnType<F>', 'F extends (...) => infer R ? R : never', 'Lấy return type'],
              ['Parameters<F>', 'F extends (...args: infer P) ? P : never', 'Lấy param types'],
              ['Awaited<T>', 'T extends Promise<infer V> ? Awaited<V> : T', 'Unwrap Promise'],
              ['Extract<T, U>', 'T extends U ? T : never', 'Lọc type trong union'],
              ['Exclude<T, U>', 'T extends U ? never : T', 'Loại bỏ type khỏi union'],
            ].map(([util, impl, when]) => (
              <tr key={util}>
                <td>
                  <code>{util}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{impl}</code>
                </td>
                <td>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>infer chỉ dùng trong extends clause:</strong> <code className="ic">infer R</code>{' '}
          khai báo một type variable được TypeScript tự infer. Chỉ được dùng ở phần{' '}
          <code className="ic">T extends ... infer R ...</code> — không thể dùng ở nơi khác. Đây là
          cách duy nhất để "extract" type từ complex structure.
        </Callout>
        <Callout type="warn">
          <strong>Distributive behavior với union:</strong> Khi T là naked type parameter,{' '}
          <code className="ic">T extends U ? A : B</code> sẽ distribute qua từng member của union.{' '}
          <code className="ic">ToArray&lt;string | number&gt;</code> cho{' '}
          <code className="ic">string[] | number[]</code>, không phải{' '}
          <code className="ic">(string | number)[]</code>. Wrap trong tuple{' '}
          <code className="ic">[T] extends [U]</code> để tắt distributive behavior.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tự implement NonNullable<T>, ReturnType<F>, và Parameters<F> dùng conditional types. Test với một function có signature phức tạp.',
            },
            {
              level: 'medium',
              text: 'Viết type UnwrapPromise<T> — nếu T là Promise<U> trả về U, nếu không trả về T. Sau đó viết UnwrapDeep<T> — unwrap lồng nhau (Promise<Promise<string>> → string).',
            },
            {
              level: 'hard',
              text: 'Implement type PickByValue<T, V> — chọn các keys có value type là V. PickByValue<{a: string; b: number; c: string}, string> = {a: string; c: string}. Hint: dùng mapped type + conditional + key remapping.',
            },
          ]}
          hint="ReturnType: T extends (...args: any[]) => infer R ? R : never. UnwrapDeep: dùng recursive conditional. PickByValue: [K in keyof T as T[K] extends V ? K : never]: T[K]."
        />
      </Sec>
    </LessonCard>
  );
}

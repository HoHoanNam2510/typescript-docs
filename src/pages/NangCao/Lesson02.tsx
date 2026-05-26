import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const BASIC_CONDITIONAL = `// Conditional type — syntax: T extends U ? X : Y
// Đọc: "Nếu T có thể gán vào U, thì X, ngược lại Y"

type IsString<T> = T extends string ? true : false;
type A = IsString<string>;   // true
type B = IsString<number>;   // false
type C = IsString<'hello'>;  // true — literal extends string

// Practical: check nullable
type IsNullable<T> = null extends T ? true : false;
type D = IsNullable<string | null>;  // true
type E = IsNullable<string>;         // false

// NonNullable — loại bỏ null | undefined
type MyNonNullable<T> = T extends null | undefined ? never : T;
type F = MyNonNullable<string | null | undefined>; // string

// Flatten — unwrap array
type Flatten<T> = T extends (infer E)[] ? E : T;
type G = Flatten<string[]>; // string
type H = Flatten<number>;   // number (không phải array)
type I = Flatten<(string | number)[]>; // string | number

// Type-level ternary chains
type TypeName<T> =
  T extends string  ? 'string'  :
  T extends number  ? 'number'  :
  T extends boolean ? 'boolean' :
  T extends null    ? 'null'    :
  T extends undefined ? 'undefined' :
  'object';

type T1 = TypeName<string>;    // "string"
type T2 = TypeName<42>;        // "number"
type T3 = TypeName<string[]>;  // "object"`;

const DISTRIBUTIVE = `// Distributive conditional types
// Khi T là union, conditional type được "phân phối" trên từng member

type ToArray<T> = T extends unknown ? T[] : never;

// T = string | number → (string extends unknown ? string[] : never) | (number extends unknown ? number[] : never)
type StrOrNumArr = ToArray<string | number>; // string[] | number[]

// So sánh với wrapped (không distributive)
type ToArrayWrapped<T> = [T] extends [unknown] ? T[] : never;
type Wrapped = ToArrayWrapped<string | number>; // (string | number)[]

// Dùng distributive để filter union
type OnlyString<T> = T extends string ? T : never;
type MixedUnion = string | number | boolean | null;
type JustStrings = OnlyString<MixedUnion>; // string

// Exclude — built dựa trên distributive
type MyExclude<T, U> = T extends U ? never : T;
type NoNull = MyExclude<string | number | null | undefined, null | undefined>;
// string | number

// Extract
type MyExtract<T, U> = T extends U ? T : never;
type StringOrNum = MyExtract<string | number | boolean, string | number>;
// string | number

// Tắt distributive với tuple wrapper
type IsNever<T> = [T] extends [never] ? true : false;
type CheckNever1 = IsNever<never>;         // true ← đúng
type CheckNever2 = never extends never ? true : false; // boolean (phân phối trên empty union!)`;

const INFER_KEYWORD = `// infer — declare type variable trong conditional type
// Dùng để "pull out" type từ complex structure

// ReturnType — tự implement
type MyReturnType<F> = F extends (...args: unknown[]) => infer R ? R : never;

function greet(name: string): string { return \`Hello \${name}\`; }
type GreetReturn = MyReturnType<typeof greet>; // string

// Parameters — tự implement
type MyParameters<F> = F extends (...args: infer P) => unknown ? P : never;
type GreetParams = MyParameters<typeof greet>; // [name: string]

// Awaited — unwrap Promise (đệ quy)
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;
type Resolved = MyAwaited<Promise<Promise<string>>>; // string

// ElementType — type của phần tử trong array
type ElementType<T> = T extends (infer E)[] ? E : never;
type Items = ElementType<{ id: string; name: string }[]>; // { id: string; name: string }

// infer từ function — lấy first argument type
type FirstArg<F> = F extends (first: infer A, ...rest: unknown[]) => unknown ? A : never;

// infer từ tuple — head và tail
type Head<T extends unknown[]> = T extends [infer H, ...unknown[]] ? H : never;
type Tail<T extends unknown[]> = T extends [unknown, ...infer T] ? T : never;

type H = Head<[string, number, boolean]>; // string
type T = Tail<[string, number, boolean]>; // [number, boolean]

// infer trong conditional branches — multiple infer
type Unzip<T> = T extends [infer A, infer B][] ? [[A], [B]] : never;
type Pairs = Unzip<[string, number][]>; // [[string], [number]]`;

const PRACTICAL_CONDITIONAL = `// Practical conditional types — patterns dùng thực tế

// DeepNonNullable — recursive nullable removal
type DeepNonNullable<T> =
  T extends null | undefined ? never :
  T extends object ? { [K in keyof T]: DeepNonNullable<T[K]> } :
  T;

interface FormData {
  name: string | null;
  address: {
    street: string | null;
    city: string | null;
  } | null;
}

type CleanFormData = DeepNonNullable<FormData>;
// { name: string; address: { street: string; city: string } }

// HasBody — conditional body based on method
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
type HasBody<M extends Method> = M extends 'POST' | 'PUT' ? true : false;

// RequestOptions — type phụ thuộc vào method
type RequestOptions<M extends Method> = HasBody<M> extends true
  ? { method: M; body: unknown; headers?: Record<string, string> }
  : { method: M; headers?: Record<string, string> };

declare function request<M extends Method>(url: string, opts: RequestOptions<M>): void;

// POST yêu cầu body
request('/api', { method: 'POST', body: { name: 'Alice' } }); // OK
// GET không cần body
request('/api', { method: 'GET' }); // OK
// request('/api', { method: 'GET', body: {} }); // Error — body không được phép

// Conditional return type
function parse(input: string): string;
function parse(input: number): number;
function parse<T extends string | number>(input: T): T extends string ? string : number {
  if (typeof input === 'string') return input.trim() as never;
  return Math.round(input) as never;
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson02({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-02"
      num="02"
      title="Conditional Types"
      desc="T extends U ? X : Y, distributive, infer, DeepNonNullable, HasBody pattern"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Conditional Types">
        <Concept>
          <p>
            <strong>Conditional types</strong> là <code className="ic">T extends U ? X : Y</code> —
            type-level if/else. Chúng mạnh nhất khi kết hợp với <code className="ic">infer</code>{' '}
            (extract nested types) và <strong>distributive behavior</strong> (tự động "map" qua
            union members). Đây là nền tảng của mọi utility type nâng cao trong TypeScript.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Cơ bản', code: BASIC_CONDITIONAL },
            { label: 'Distributive', code: DISTRIBUTIVE },
            { label: 'infer keyword', code: INFER_KEYWORD },
            { label: 'Practical patterns', code: PRACTICAL_CONDITIONAL },
          ]}
        />
      </Sec>

      <Sec title="Các infer patterns quan trọng">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Định nghĩa</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['ReturnType<F>', 'F extends (...) => infer R ? R : never', 'Return type'],
              ['Parameters<F>', 'F extends (...args: infer P) => ? P : never', 'Param tuple'],
              ['Awaited<T>', 'T extends Promise<infer U> ? Awaited<U> : T', 'Unwrap Promise'],
              ['ElementType<T>', 'T extends (infer E)[] ? E : never', 'Array element'],
              ['Head<T>', 'T extends [infer H, ...] ? H : never', 'First tuple element'],
              ['Tail<T>', 'T extends [_, ...infer T] ? T : never', 'Rest of tuple'],
            ].map(([pattern, def, result]) => (
              <tr key={pattern}>
                <td>
                  <code>{pattern}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{def}</code>
                </td>
                <td>{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Distributive vs non-distributive:</strong> Wrap T trong tuple{' '}
          <code className="ic">[T] extends [U]</code> để tắt distributive behavior. Cần khi check{' '}
          <code className="ic">IsNever&lt;T&gt;</code> hoặc muốn treat union như một type đơn lẻ.
        </Callout>
        <Callout type="warn">
          <strong>infer chỉ trong extends clause:</strong> <code className="ic">R</code> chỉ có
          scope trong true branch. Nếu cần dùng ở false branch, infer một lần khác với tên khác.
          TypeScript giới hạn độ sâu recursive — dùng depth counter nếu gặp{' '}
          <code className="ic">"Type instantiation is excessively deep"</code>.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement: Flatten<T> (unwrap 1 level array), Awaited<T> (recursive Promise unwrap), ConstructorReturn<T> (return type of constructor — dùng T extends new(...) => infer R). Test từng loại.',
            },
            {
              level: 'medium',
              text: 'Implement DeepReadonly<T> dùng conditional + mapped types: T extends (infer E)[] ? ReadonlyArray<DeepReadonly<E>> : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> } : T.',
            },
            {
              level: 'hard',
              text: 'Implement UnionToTuple<U> convert union sang tuple (order không đảm bảo). Gợi ý: dùng UnionToIntersection để convert union → function intersection, sau đó infer lần lượt mỗi member.',
            },
          ]}
          hint="Flatten: T extends (infer E)[] ? E : T. Awaited: T extends Promise<infer U> ? MyAwaited<U> : T. UnionToTuple rất phức tạp — đây là thử thách type-level programming thực sự."
        />
      </Sec>
    </LessonCard>
  );
}

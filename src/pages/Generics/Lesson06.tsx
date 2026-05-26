import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const INFER_BASICS = `// infer — khai báo type variable trong conditional type
// Cho phép "extract" type từ complex structure

// ReturnType — tự implement
type MyReturnType<F> = F extends (...args: unknown[]) => infer R ? R : never;

// Parameters — tự implement
type MyParameters<F> = F extends (...args: infer P) => unknown ? P : never;

// ConstructorParameters
type MyConstructorParams<C> = C extends new (...args: infer P) => unknown ? P : never;

// Test
function fetchUser(id: string, options?: { cache: boolean }): Promise<User> {
  return Promise.resolve({ id, name: 'Alice', email: '' });
}

type FetchReturn = MyReturnType<typeof fetchUser>; // Promise<User>
type FetchParams = MyParameters<typeof fetchUser>; // [id: string, options?: { cache: boolean }]

// Awaited — unwrap nested Promise
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;

type Resolved = MyAwaited<Promise<Promise<string>>>; // string

// Infer từ array
type ElementType<T> = T extends (infer E)[] ? E : never;
type Items = ElementType<{ id: string; name: string }[]>; // { id: string; name: string }`;

const INFER_COMPLEX = `// infer trong complex patterns

// Extract object property type
type PropType<T, K extends keyof T> = T[K];

// Extract nested type
type NestedType<T, K1 extends keyof T, K2 extends keyof T[K1]> =
  T[K1][K2];

// First param của method
type MethodFirstParam<T, M extends keyof T> =
  T[M] extends (first: infer P, ...rest: unknown[]) => unknown ? P : never;

interface UserService {
  findById(id: string): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

type FindByIdParam = MethodFirstParam<UserService, 'findById'>; // string
type UpdateParam = MethodFirstParam<UserService, 'update'>;    // string

// Promise return của method
type MethodReturnType<T, M extends keyof T> =
  T[M] extends (...args: unknown[]) => Promise<infer R> ? R : never;

type FindResult = MethodReturnType<UserService, 'findById'>; // User
type UpdateResult = MethodReturnType<UserService, 'update'>; // User

// Infer từ template literal
type ExtractId<S extends string> =
  S extends \`\${string}/\${infer Id}\` ? Id : never;

type UserId = ExtractId<'/users/abc123'>;    // "abc123"
type PostId = ExtractId<'/posts/xyz789'>;   // "xyz789"
type None   = ExtractId<'no-slash'>;        // never`;

const EXTRACT_EXCLUDE = `// Extract & Exclude — filter union types

// Extract<T, U> — giữ lại types match U
type StringOrNumber = Extract<string | number | boolean | null, string | number>;
// string | number

// Exclude<T, U> — loại bỏ types match U
type NonNullable<T> = Exclude<T, null | undefined>;

type WithNull = string | number | null | undefined;
type Clean = NonNullable<WithNull>; // string | number

// Practical: extract specific union members
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;
type SuccessStatus = Extract<HttpStatus, 200 | 201 | 204>; // 200 | 201
type ErrorStatus   = Exclude<HttpStatus, 200 | 201 | 204>; // 400 | 401 | 403 | 404 | 500

// Filter union by shape
type EventTypes = 'click' | 'focus' | 'blur' | 'mouseenter' | 'keydown' | 'keyup';
type MouseEventTypes = Extract<EventTypes, 'click' | 'mouseenter' | 'mouseleave'>;
// "click" | "mouseenter"

type KeyboardEvents = Extract<EventTypes, \`key\${string}\`>;
// "keydown" | "keyup"

// Distributive Extract
type ArrayItems<T> = T extends unknown[] ? T[number] : never;

type Items = ArrayItems<string[] | number[] | boolean>;
// string | number (boolean filtered — not array)`;

const CUSTOM_EXTRACT = `// Tự build Extract/Exclude variations

// PickByValue — chọn keys có value type match V
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

interface User {
  id: string;
  name: string;
  age: number;
  email: string;
  isAdmin: boolean;
  score: number;
}

type StringFields  = PickByValue<User, string>;  // { id, name, email }
type NumberFields  = PickByValue<User, number>;  // { age, score }
type BooleanFields = PickByValue<User, boolean>; // { isAdmin }

// OmitByValue — ngược lại
type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

type NonStringFields = OmitByValue<User, string>; // { age, isAdmin, score }

// RequiredKeys — lấy keys không optional
type RequiredKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? never : K;
}[keyof T];

// OptionalKeys — ngược lại
type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

interface Form {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
}

type Required_ = RequiredKeys<Form>; // "name" | "email"
type Optional_ = OptionalKeys<Form>; // "phone" | "bio"`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson06({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-06"
      num="06"
      title="infer & Extract Patterns"
      desc="infer keyword, ReturnType/Parameters tự build, Extract/Exclude, PickByValue"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="infer & Extract trong Generics">
        <Concept>
          <p>
            <code className="ic">infer</code> là công cụ mạnh nhất của TypeScript type system — cho
            phép "pull out" type từ bất kỳ structure nào trong conditional type.{' '}
            <code className="ic">Extract</code> và <code className="ic">Exclude</code> dùng
            distributive conditional types để filter union members. Kết hợp, chúng tạo nên nền tảng
            của toàn bộ TypeScript utility type ecosystem.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'infer cơ bản', code: INFER_BASICS },
            { label: 'infer nâng cao', code: INFER_COMPLEX },
            { label: 'Extract & Exclude', code: EXTRACT_EXCLUDE },
            { label: 'Custom PickByValue', code: CUSTOM_EXTRACT },
          ]}
        />
      </Sec>

      <Sec title="Các infer patterns phổ biến">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Conditional type</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Return type', 'F extends (...) => infer R ? R : never', 'Return type của function'],
              ['Params', 'F extends (...args: infer P) => ? P : never', 'Param tuple'],
              ['Array item', 'T extends (infer E)[] ? E : never', 'Element type'],
              ['Promise value', 'T extends Promise<infer V> ? V : T', 'Unwrap Promise'],
              ['Template literal', 'S extends `prefix/${infer Rest}` ? Rest', 'Parse string'],
              ['First param', 'F extends (first: infer P, ...) ? P', 'First argument type'],
            ].map(([pattern, type, result]) => (
              <tr key={pattern}>
                <td>
                  <strong>{pattern}</strong>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{type}</code>
                </td>
                <td>{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>infer chỉ trong extends clause:</strong>{' '}
          <code className="ic">T extends ... infer R ...</code> — R chỉ có scope trong true branch.
          Không dùng R ở false branch. Đây là limitation của TypeScript — nếu cần dùng R ở cả hai
          nhánh, infer hai lần với tên khác nhau.
        </Callout>
        <Callout type="warn">
          <strong>PickByValue với optional fields:</strong>{' '}
          <code className="ic">string? === string | undefined</code>. Khi check{' '}
          <code className="ic">T[K] extends string</code>, optional field{' '}
          <code className="ic">string | undefined</code> không match. Cần dùng{' '}
          <code className="ic">NonNullable&lt;T[K]&gt; extends string</code> nếu muốn include
          optional string fields.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tự implement: Awaited<T>, PromiseValue<T> (unwrap 1 level), ArrayElement<T>, TupleHead<T extends unknown[]>, TupleTail<T extends unknown[]>.',
            },
            {
              level: 'medium',
              text: 'Implement FunctionPropertyKeys<T> — trả về union của các keys trong T có value là function. Ví dụ: FunctionPropertyKeys<{name: string; greet: () => void; age: number}> = "greet".',
            },
            {
              level: 'hard',
              text: 'Implement DeepExtract<T, U> — giống Extract nhưng deep: nếu T là object và U là object, extract chỉ matching keys. DeepExtract<{a: string; b: number; c: {x: boolean}}, {b: number; c: unknown}> = {b: number; c: {x: boolean}}.',
            },
          ]}
          hint="PromiseValue: T extends Promise<infer U> ? U : T (1 level). FunctionPropertyKeys: [K in keyof T as T[K] extends Function ? K : never]. DeepExtract: mapped type với K extends keyof U conditional."
        />
      </Sec>
    </LessonCard>
  );
}

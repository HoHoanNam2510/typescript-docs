import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const TYPE_NARROWING_GENERIC = `// Type narrowing trong generic context

// Vấn đề: T extends A | B — TypeScript không biết T cụ thể là gì
function processValue<T extends string | number>(value: T): string {
  // typeof value === 'string' — TypeScript biết value là string
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return String(value * 2);
}

// Type predicate với generics
function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

function normalize<T>(value: T | T[]): T[] {
  return isArray(value) ? value : [value];
}

normalize(1);       // [1] — number[]
normalize([1,2,3]); // [1,2,3] — number[]
normalize('a');     // ["a"] — string[]

// Assertion functions
function assertDefined<T>(value: T | null | undefined, name: string): asserts value is T {
  if (value == null) throw new Error(\`\${name} is required\`);
}

function processUser(user: User | null): string {
  assertDefined(user, 'user');
  // user là User sau assertion
  return user.name;
}`;

const COVARIANCE_CONTRAVARIANCE = `// Variance — T ở vị trí covariant vs contravariant

// Covariant — T xuất hiện ở output position (return type)
// Nếu Cat extends Animal, thì Box<Cat> extends Box<Animal>
interface Producer<T> {
  produce(): T; // covariant position
}

// Contravariant — T xuất hiện ở input position (param)
// Nếu Cat extends Animal, thì Consumer<Animal> extends Consumer<Cat>
interface Consumer<T> {
  consume(value: T): void; // contravariant position
}

// Bivariant — T ở cả input và output
interface Transformer<T> {
  transform(input: T): T; // bivariant (function overload variance)
}

// Practical: arrays are covariant in TypeScript (but unsound!)
const cats: Cat[] = [new Cat('Mimi')];
const animals: Animal[] = cats; // OK — Cat[] assignable to Animal[]
// Nhưng: animals.push(new Dog()) — runtime error!

// Readonly để safe:
const readonlyCats: readonly Cat[] = [new Cat('Mimi')];
// const readonlyAnimals: readonly Animal[] = readonlyCats; // OK
// readonlyAnimals.push(...) // Error — readonly!

// Function parameter variance
type Handler<T> = (value: T) => void;
// Handler<Animal> assignable to Handler<Cat>? → Yes (contravariance)`;

const GENERIC_INFERENCE = `// TypeScript inference trong generic context — cách TS suy ra type

// Conditional inference
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;

type A = UnpackPromise<Promise<string>>;         // string
type B = UnpackPromise<string>;                  // string (not Promise)
type C = UnpackPromise<Promise<Promise<number>>>; // Promise<number> (chỉ 1 level)

// Recursive unwrap
type DeepUnpack<T> = T extends Promise<infer U> ? DeepUnpack<U> : T;
type D = DeepUnpack<Promise<Promise<number>>>; // number

// Infer từ function
type FirstParam<F> = F extends (first: infer P, ...rest: unknown[]) => unknown ? P : never;
type LastParam<F> = F extends (...args: [...unknown[], infer L]) => unknown ? L : never;

type FP = FirstParam<(a: string, b: number) => void>; // string
type LP = LastParam<(a: string, b: number) => void>;  // number

// Infer từ array
type ArrayItem<T> = T extends (infer U)[] ? U : never;

type N = ArrayItem<number[]>;         // number
type S = ArrayItem<string[]>;         // string
type NA = ArrayItem<(string | number)[]>; // string | number

// Infer tuple position
type Second<T extends unknown[]> = T extends [unknown, infer S, ...unknown[]] ? S : never;
type Sec = Second<[string, number, boolean]>; // number`;

const GENERIC_NARROWING_PATTERN = `// Practical patterns: type narrowing trong generics

// Discriminated union với generic
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

function handleResult<T>(
  result: Result<T>,
  onSuccess: (data: T) => void,
  onError: (error: Error) => void
): void {
  if (result.success) {
    onSuccess(result.data); // TypeScript biết data: T
  } else {
    onError(result.error);  // TypeScript biết error: Error
  }
}

// Type-safe error handling với generic
async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

// Pattern matching với generic exhaustive check
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number }
  | { kind: 'triangle'; base: number; height: number };

function area<T extends Shape>(shape: T): number {
  switch (shape.kind) {
    case 'circle':   return Math.PI * shape.radius ** 2;
    case 'square':   return shape.side ** 2;
    case 'triangle': return 0.5 * shape.base * shape.height;
    default: {
      const _: never = shape; // exhaustive check
      return _;
    }
  }
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson05({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-05"
      num="05"
      title="Type Narrowing & Inference trong Generics"
      desc="Type narrowing, covariance/contravariance, infer patterns, Result<T,E>"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Narrowing & Variance">
        <Concept>
          <p>
            Generics và type narrowing tương tác theo những cách tinh tế. TypeScript sử dụng{' '}
            <strong>structural variance</strong> để xác định assignability. Hiểu{' '}
            <code className="ic">infer</code>, <strong>covariance</strong>, và{' '}
            <strong>contravariance</strong> giúp tránh type errors khó hiểu và thiết kế API tốt hơn.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Narrowing trong generic', code: TYPE_NARROWING_GENERIC },
            { label: 'Covariance & Contravariance', code: COVARIANCE_CONTRAVARIANCE },
            { label: 'Inference patterns', code: GENERIC_INFERENCE },
            { label: 'Result<T,E> pattern', code: GENERIC_NARROWING_PATTERN },
          ]}
        />
      </Sec>

      <Sec title="Covariance vs Contravariance">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Vị trí T</th>
              <th>Ví dụ</th>
              <th>Hệ quả</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Covariant', 'Output (return)', 'Producer<T>.produce(): T', 'Cat → Animal OK'],
              ['Contravariant', 'Input (param)', 'Consumer<T>.consume(v: T)', 'Animal → Cat OK'],
              ['Bivariant', 'Cả hai', 'Transformer<T>', 'Cả hai OK (ít dùng)'],
              ['Invariant', 'Cả hai (strict)', 'ReadWrite<T>', 'Chỉ exact type OK'],
            ].map(([type, pos, example, result]) => (
              <tr key={type}>
                <td>
                  <strong>{type}</strong>
                </td>
                <td>{pos}</td>
                <td>
                  <code>{example}</code>
                </td>
                <td>{result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Result&lt;T,E&gt; pattern:</strong> Thay vì try/catch, dùng{' '}
          <code className="ic">Result&lt;T&gt;</code> discriminated union để handle errors
          explicitly. Caller phải check <code className="ic">result.success</code> trước khi dùng{' '}
          <code className="ic">result.data</code>. TypeScript enforce điều này — không thể truy cập
          data mà không check.
        </Callout>
        <Callout type="warn">
          <strong>Arrays covariant nhưng không an toàn:</strong> TypeScript cho phép{' '}
          <code className="ic">Cat[] assignable to Animal[]</code> nhưng điều này có thể gây runtime
          error khi push Dog vào. Dùng <code className="ic">readonly</code> arrays để prevent
          mutation qua covariant reference.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement Result<T, E = Error> với static ok(), err(), isOk(), isErr(), map<U>(fn): Result<U,E>, mapErr<F>(fn): Result<T,F>, unwrap(), unwrapOr(fallback).',
            },
            {
              level: 'medium',
              text: 'Viết async function pipeline<T>(...steps: Array<(v: T) => Promise<T> | T>): (initial: T) => Promise<Result<T>>. Nếu bất kỳ step nào throw, return Err. Nếu thành công, return Ok.',
            },
            {
              level: 'hard',
              text: 'Implement Option<T> (Maybe monad): None | Some<T>. Methods: map, flatMap, filter, getOrElse, toResult(error: E): Result<T,E>. Cả None và Some phải implement cùng interface với type-safe results.',
            },
          ]}
          hint="Result: class với private constructor, static factory. pipeline: try/catch trong reduce. Option: None singleton, Some<T> class, cả hai implement Option interface."
        />
      </Sec>
    </LessonCard>
  );
}

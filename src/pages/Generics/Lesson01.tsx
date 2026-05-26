import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const GENERIC_BASICS = `// Generic function — type parameter T
// T là placeholder được TypeScript suy ra từ usage

function identity<T>(value: T): T {
  return value;
}

// Explicit type argument
identity<string>('hello');  // string
identity<number>(42);       // number

// Inferred — TypeScript tự suy ra từ argument
identity('hello');  // inferred: string
identity(42);       // inferred: number
identity([1,2,3]);  // inferred: number[]

// Multiple type params
function pair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const p1 = pair('name', 42);        // [string, number]
const p2 = pair(true, { x: 1 });   // [boolean, {x: number}]

// Generic với tuple variadic (TS 4.0+)
function zip<T extends unknown[], U extends unknown[]>(
  a: T,
  b: U
): { [K in keyof T]: [T[K], K extends keyof U ? U[K] : never] } {
  return a.map((v, i) => [v, b[i]]) as never;
}`;

const RETURN_TYPE_INFERENCE = `// TypeScript infer return type từ body — không cần annotate

// TypeScript infers return type là T | undefined
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Infers: number | undefined
const n = first([1, 2, 3]);

// Infers: string | undefined
const s = first(['a', 'b']);

// Swap — TypeScript infers [B, A]
function swap<A, B>(tuple: [A, B]): [B, A] {
  return [tuple[1], tuple[0]];
}

const swapped = swap([1, 'hello']); // [string, number]

// Generic wrapper — preserve type
function withLogging<T>(value: T, label: string): T {
  console.log(\`\${label}:\`, value);
  return value; // same type as input
}

const num = withLogging(42, 'answer');     // number
const arr = withLogging([1,2], 'items');  // number[]

// Factory với generic
function makeArray<T>(item: T, count: number): T[] {
  return Array.from({ length: count }, () => item);
}

const zeros = makeArray(0, 5);     // number[]
const hellos = makeArray('hi', 3); // string[]`;

const GENERIC_ARROW = `// Generic arrow functions — syntax khác nhau giữa .ts và .tsx

// Trong .ts — dùng bình thường
const identity = <T>(value: T): T => value;

// Trong .tsx — phải thêm comma để tránh nhầm với JSX tag
const identityTsx = <T,>(value: T): T => value;
// Hoặc dùng extends unknown để disambiguate
const identityExt = <T extends unknown>(value: T): T => value;

// Generic arrow with multiple params
const merge = <T extends object, U extends object>(target: T, source: U): T & U => ({
  ...target,
  ...source,
});

const merged = merge({ name: 'Alice' }, { age: 30 });
// { name: string; age: number }

// Async generic
const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  return res.json() as T;
};

// Usage — specify return type
const user = await fetchJson<{ id: number; name: string }>('/api/user');
console.log(user.name); // string — type-safe`;

const GENERIC_OVERLOADS = `// Generic + overloads — precise return type theo condition

// Overload signatures
function process(value: string): string;
function process(value: number): number;
function process(value: string | number): string | number;

// Implementation
function process(value: string | number): string | number {
  if (typeof value === 'string') return value.toUpperCase();
  return value * 2;
}

const s = process('hello'); // string (not string | number)
const n = process(21);      // number (not string | number)

// Generic để giữ type chính xác hơn overloads đơn giản
function first<T extends string>(arr: T[]): T | undefined;
function first<T extends number>(arr: T[]): T | undefined;
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// Conditional return type với generic
type WrapInArray<T, Wrap extends boolean> =
  Wrap extends true ? T[] : T;

function maybeWrap<T, W extends boolean>(
  value: T,
  wrap: W
): WrapInArray<T, W> {
  return (wrap ? [value] : value) as WrapInArray<T, W>;
}

const a = maybeWrap('hello', true);  // string[]
const b = maybeWrap('hello', false); // string`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson01({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-01"
      num="01"
      title="Generic Functions"
      desc="Type parameters, inference, arrow functions, multiple params, overloads"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Generic Functions">
        <Concept>
          <p>
            <strong>Generics</strong> cho phép viết code làm việc với nhiều types mà vẫn type-safe —
            không cần dùng <code className="ic">any</code>. TypeScript tự <strong>infer</strong>{' '}
            type parameter từ argument, nên thường không cần viết{' '}
            <code className="ic">{'<T>'}</code> tường minh.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Generic cơ bản', code: GENERIC_BASICS },
            { label: 'Return type inference', code: RETURN_TYPE_INFERENCE },
            { label: 'Generic arrow functions', code: GENERIC_ARROW },
            { label: 'Generic + Overloads', code: GENERIC_OVERLOADS },
          ]}
        />
      </Sec>

      <Sec title="Explicit vs Inferred type args">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Cách dùng</th>
              <th>Khi nào</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'Inferred (thường dùng)',
                'TypeScript có thể suy ra từ argument',
                'identity(42) → T = number',
              ],
              [
                'Explicit (đôi khi cần)',
                'Return type khác input, generic API',
                'fetchJson<User>("/api")',
              ],
              [
                'Partial explicit',
                'Một số params cần, số còn lại infer',
                'Ít dùng — TS không hỗ trợ trực tiếp',
              ],
            ].map(([way, when, example]) => (
              <tr key={way}>
                <td>
                  <strong>{way}</strong>
                </td>
                <td>{when}</td>
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
          <strong>Ưu tiên inferred type args:</strong> Viết <code className="ic">identity(42)</code>{' '}
          tốt hơn <code className="ic">identity&lt;number&gt;(42)</code>. Chỉ explicit khi
          TypeScript không thể infer — thường là return type không liên quan đến params (như{' '}
          <code className="ic">fetchJson&lt;User&gt;</code>).
        </Callout>
        <Callout type="warn">
          <strong>Generic trong .tsx cần comma:</strong> <code className="ic">{'<T>'}</code> trong
          file .tsx bị parser nhầm với JSX tag. Dùng <code className="ic">{'<T,>'}</code> hoặc{' '}
          <code className="ic">{'<T extends unknown>'}</code> để fix. Trong .ts file không có vấn đề
          này.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết generic functions: last<T>(arr: T[]): T | undefined, reverse<T>(arr: T[]): T[], chunk<T>(arr: T[], size: number): T[][]. Đảm bảo tất cả return type đúng.',
            },
            {
              level: 'medium',
              text: 'Viết function groupBy<T, K extends string | number>(arr: T[], keyFn: (item: T) => K): Record<K, T[]>. Test với groupBy([{role:"admin",...},{role:"user",...}], u => u.role).',
            },
            {
              level: 'hard',
              text: 'Implement generic pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T và compose tương tự nhưng ngược chiều. Sau đó implement pipe với nhiều types: pipe(fn1: A→B, fn2: B→C, fn3: C→D): A→D.',
            },
          ]}
          hint="chunk: while (arr.length) result.push(arr.splice(0, size)). groupBy: reduce với acc[key] = [...(acc[key]??[]), item]. pipe với types: overloads hoặc variadic tuple types."
        />
      </Sec>
    </LessonCard>
  );
}

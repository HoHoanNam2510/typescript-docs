import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const FN_BASIC = `// Function type annotations
function add(a: number, b: number): number {
  return a + b;
}

// Arrow function
const multiply = (a: number, b: number): number => a * b;

// Function type alias
type MathOp = (a: number, b: number) => number;
const divide: MathOp = (a, b) => a / b;

// Optional parameters — phải ở cuối
function greet(name: string, greeting?: string): string {
  return \`\${greeting ?? 'Hello'}, \${name}!\`;
}
greet('Alice');         // "Hello, Alice!"
greet('Alice', 'Hi');   // "Hi, Alice!"

// Default parameters
function createUser(
  name: string,
  role: string = 'user',
  active: boolean = true
) {
  return { name, role, active };
}
createUser('Bob');              // { name: 'Bob', role: 'user', active: true }
createUser('Bob', 'admin');     // { name: 'Bob', role: 'admin', active: true }

// Rest parameters — phải ở cuối, nhận mảng
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5); // 15`;

const FN_OVERLOADS = `// Function overloads — cùng tên, nhiều signature khác nhau
// Khai báo overload signatures trước, implementation sau
function format(value: string): string;
function format(value: number, decimals?: number): string;
function format(value: Date, locale?: string): string;
// Implementation — phải handle TẤT CẢ overload cases
function format(
  value: string | number | Date,
  optArg?: number | string
): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return value.toFixed(optArg as number ?? 2);
  return value.toLocaleDateString(optArg as string);
}

format('  hello  ');     // "hello"
format(3.14159, 2);      // "3.14"
format(new Date(), 'vi'); // "26/5/2026"

// Overload với union return type — rõ hơn conditional
function getElementById(id: string): HTMLElement | null;
function getElementById(id: string, required: true): HTMLElement;
function getElementById(id: string, required = false): HTMLElement | null {
  const el = document.getElementById(id);
  if (!el && required) throw new Error(\`Element #\${id} not found\`);
  return el;
}`;

const FN_HIGHER_ORDER = `// Higher-order functions — nhận/trả về function
type Predicate<T> = (value: T) => boolean;
type Transform<A, B> = (input: A) => B;

// filter với generic predicate
function filter<T>(arr: T[], predicate: Predicate<T>): T[] {
  return arr.filter(predicate);
}
const evens = filter([1, 2, 3, 4, 5], n => n % 2 === 0); // [2, 4]

// map với transform
function map<A, B>(arr: A[], fn: Transform<A, B>): B[] {
  return arr.map(fn);
}
const lengths = map(['hello', 'world'], s => s.length); // [5, 5]

// Memoize — cache kết quả function
function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

const expensiveCalc = memoize((n: number) => n * n);
expensiveCalc(5); // 25 (computed)
expensiveCalc(5); // 25 (from cache)`;

const FN_TYPES_UTILS = `// Parameters<T> — lấy types của các tham số
type AddParams = Parameters<typeof add>; // [a: number, b: number]
type FirstParam = Parameters<typeof add>[0]; // number

// ReturnType<T> — lấy return type
type AddResult = ReturnType<typeof add>; // number

// Thực tế: wrap function với logging
function withLogging<T extends (...args: unknown[]) => unknown>(fn: T) {
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log('Calling with:', args);
    const result = fn(...args) as ReturnType<T>;
    console.log('Result:', result);
    return result;
  };
}

// void callback — callback có thể return gì cũng được
type Callback = () => void;
const cb: Callback = () => 42; // OK! void cho phép return

// Never return — function throw hoặc infinite loop
function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x);
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson03({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-03"
      num="03"
      title="Functions"
      desc="Function types, optional/rest params, overloads, và higher-order functions"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Function types trong TypeScript">
        <Concept>
          <p>
            TypeScript yêu cầu annotate <strong>type của từng parameter</strong> và{' '}
            <strong>return type</strong>. Function overloads cho phép cùng tên function với nhiều
            signature — TypeScript chọn đúng signature dựa vào arguments.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Basic & params', code: FN_BASIC },
            { label: 'Overloads', code: FN_OVERLOADS },
            { label: 'Higher-order', code: FN_HIGHER_ORDER },
            { label: 'Parameters & ReturnType', code: FN_TYPES_UTILS },
          ]}
        />
      </Sec>

      <Sec title="Các loại parameters">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Syntax</th>
              <th>Vị trí</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Required', 'name: string', 'Bất kỳ'],
              ['Optional', 'name?: string', 'Sau required params'],
              ['Default', "name = 'Alice'", 'Bất kỳ (thường cuối)'],
              ['Rest', '...names: string[]', 'Cuối cùng'],
            ].map(([type, syntax, pos]) => (
              <tr key={type}>
                <td>{type}</td>
                <td>
                  <code>{syntax}</code>
                </td>
                <td>{pos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Overload implementation không phải là overload:</strong> Khi viết function
          overloads, implementation signature (cuối cùng) không được gọi từ bên ngoài. Chỉ các
          overload signatures ở trên mới là public API. Implementation phải handle tất cả cases.
        </Callout>
        <Callout type="warn">
          <strong>Parameters và ReturnType là utility types quan trọng:</strong>{' '}
          <code className="ic">Parameters&lt;typeof fn&gt;</code> và{' '}
          <code className="ic">ReturnType&lt;typeof fn&gt;</code> giúp DRY khi wrap hoặc extend
          functions. Cực kỳ hữu ích khi viết decorators, middleware, và HOF.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết function pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T — nhận nhiều functions và compose chúng từ trái sang phải. pipe(double, addOne)(5) = 11.',
            },
            {
              level: 'medium',
              text: 'Implement function overloads cho findUser: khi truyền number trả về User, khi truyền string (email) trả về User | null. Cả hai trả về Promise.',
            },
            {
              level: 'hard',
              text: 'Viết curry<T extends unknown[], R>(fn: (...args: T) => R) — chuyển function bất kỳ thành curried version. curry(add)(1)(2) = 3. Hint: dùng recursive conditional types.',
            },
          ]}
          hint="pipe: fns.reduce((f, g) => x => g(f(x))). findUser overloads: findUser(id: number): Promise<User>; findUser(email: string): Promise<User | null>. Curry: khó — bắt đầu với 2 args trước."
        />
      </Sec>
    </LessonCard>
  );
}

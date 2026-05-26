import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const MEMOIZE = `// Memoize — generic caching wrapper cho functions

// Simple memoize với string keys
function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const cache = new Map<string, R>();

  return (...args: Args): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((n: number): number => {
  console.log('computing...');
  return n * n;
});

expensiveCalc(5); // computing... 25
expensiveCalc(5); // 25 (từ cache)
expensiveCalc(6); // computing... 36

// Memoize với custom key function
function memoizeWith<Args extends unknown[], R>(
  keyFn: (...args: Args) => string,
  fn: (...args: Args) => R
): (...args: Args) => R {
  const cache = new Map<string, R>();

  return (...args: Args): R => {
    const key = keyFn(...args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key)!;
  };
}

const fetchUser = memoizeWith(
  (id: string) => \`user:\${id}\`,
  async (id: string): Promise<User> => fetch(\`/api/users/\${id}\`).then(r => r.json())
);`;

const CURRY_PARTIAL = `// Curry & Partial Application — type-safe

// Curry 2-argument function
function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C {
  return (a: A) => (b: B) => fn(a, b);
}

const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);   // (a: number) => (b: number) => number
const add5 = curriedAdd(5);      // (b: number) => number
console.log(add5(3));            // 8
console.log(add5(10));           // 15

// Partial application — fix first N args
function partial<A, Rest extends unknown[], R>(
  fn: (first: A, ...rest: Rest) => R,
  firstArg: A
): (...rest: Rest) => R {
  return (...rest: Rest) => fn(firstArg, ...rest);
}

const multiply = (a: number, b: number, c: number) => a * b * c;
const double   = partial(multiply, 2); // (b: number, c: number) => number
const triple   = partial(multiply, 3);

console.log(double(3, 4));  // 24
console.log(triple(2, 5));  // 30

// flip — đổi thứ tự 2 args đầu
function flip<A, B, C>(fn: (a: A, b: B) => C): (b: B, a: A) => C {
  return (b, a) => fn(a, b);
}`;

const COMPOSE_PIPE = `// compose & pipe — function composition type-safe

// pipe: f then g then h — left to right
function pipe<A>(a: A): A;
function pipe<A, B>(a: A, f1: (a: A) => B): B;
function pipe<A, B, C>(a: A, f1: (a: A) => B, f2: (b: B) => C): C;
function pipe<A, B, C, D>(a: A, f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D): D;
function pipe<A, B, C, D, E>(a: A, f1: (a: A) => B, f2: (b: B) => C, f3: (c: C) => D, f4: (d: D) => E): E;
function pipe(value: unknown, ...fns: Array<(x: unknown) => unknown>): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

// compose: h then g then f — right to left
function compose<A>(f: (a: A) => A): (a: A) => A;
function compose<A, B>(g: (b: B) => A, f: (a: A) => B): (a: A) => A;
function compose<A, B, C>(h: (c: C) => A, g: (b: B) => C, f: (a: A) => B): (a: A) => A;
function compose(...fns: Array<(x: unknown) => unknown>): (x: unknown) => unknown {
  return (value: unknown) => fns.reduceRight((acc, fn) => fn(acc), value);
}

// Usage
const result = pipe(
  '  hello world  ',
  s => s.trim(),
  s => s.split(' '),
  words => words.map(w => w[0].toUpperCase() + w.slice(1)),
  words => words.join(' ')
); // "Hello World"

const transform = compose(
  (x: number) => x.toString(),
  (x: number) => x * 2,
  (x: number) => x + 1
);
console.log(transform(4)); // "10"`;

const DECORATOR_HOF = `// Higher-order functions như decorators

// retry — tự động retry khi fail
function retry<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  maxAttempts: number,
  delay = 1000
): (...args: Args) => Promise<R> {
  return async (...args: Args): Promise<R> => {
    let lastError: Error | undefined;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, delay * attempt));
        }
      }
    }
    throw lastError;
  };
}

// throttle — giới hạn call frequency
function throttle<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  intervalMs: number
): (...args: Args) => R | undefined {
  let lastCall = 0;
  return (...args: Args): R | undefined => {
    const now = Date.now();
    if (now - lastCall >= intervalMs) {
      lastCall = now;
      return fn(...args);
    }
    return undefined;
  };
}

// withTimeout — wrap async function với timeout
function withTimeout<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
  timeoutMs: number
): (...args: Args) => Promise<R> {
  return (...args: Args): Promise<R> =>
    Promise.race([
      fn(...args),
      new Promise<R>((_, reject) =>
        setTimeout(() => reject(new Error(\`Timeout after \${timeoutMs}ms\`)), timeoutMs)
      ),
    ]);
}

const safeFetch = withTimeout(retry(fetch, 3), 5000);`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson08({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-08"
      num="08"
      title="Higher-Order Functions với Generics"
      desc="memoize, curry, partial, compose/pipe, retry, throttle — type-safe HOFs"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Higher-Order Functions">
        <Concept>
          <p>
            Higher-order functions (HOFs) nhận function làm argument hoặc return function. Với
            generics, TypeScript đảm bảo HOFs <strong>preserve type information</strong> qua
            transformations — wrapped function vẫn có đúng param types và return type.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'memoize', code: MEMOIZE },
            { label: 'curry & partial', code: CURRY_PARTIAL },
            { label: 'compose & pipe', code: COMPOSE_PIPE },
            { label: 'retry, throttle, timeout', code: DECORATOR_HOF },
          ]}
        />
      </Sec>

      <Sec title="HOF patterns">
        <table className="compare-table">
          <thead>
            <tr>
              <th>HOF</th>
              <th>Input</th>
              <th>Output</th>
              <th>Dùng khi</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['memoize', '(...args) => R', 'Same signature + cache', 'Expensive pure functions'],
              ['curry', '(A, B) => C', '(A) => (B) => C', 'Partial application'],
              ['partial', '(A, B) => C', '(B) => C', 'Fix first N args'],
              ['compose', 'f, g, h', 'h ∘ g ∘ f', 'Function composition'],
              ['retry', 'async fn', 'Same + auto-retry', 'Network calls'],
              ['throttle', 'fn', 'Rate-limited fn', 'UI events, API calls'],
            ].map(([hof, input, output, when]) => (
              <tr key={hof}>
                <td>
                  <code>{hof}</code>
                </td>
                <td>
                  <code>{input}</code>
                </td>
                <td>
                  <code>{output}</code>
                </td>
                <td>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>pipe overloads cho type safety:</strong> TypeScript không có variadic generic
          function composition natively. Cách thực tế là viết overloads cho 2, 3, 4, 5 functions.
          Thư viện <code className="ic">fp-ts</code> hay <code className="ic">remeda</code> đã làm
          điều này — dùng thư viện nếu cần nhiều hơn 5 steps.
        </Callout>
        <Callout type="warn">
          <strong>memoize chỉ dùng cho pure functions:</strong> Memoization giả định cùng args →
          cùng result. Không memoize functions có side effects hoặc phụ thuộc vào external state
          (Date.now(), Math.random(), database queries). JSON.stringify cho key có thể fail với
          circular refs hoặc non-serializable values.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Implement debounce<Args, R>(fn: (...args: Args) => R, delay: number): (...args: Args) => void — chỉ gọi fn sau khi không có call mới trong delay ms. Dùng setTimeout/clearTimeout.',
            },
            {
              level: 'medium',
              text: 'Implement once<Args, R>(fn: (...args: Args) => R): (...args: Args) => R — chỉ thực thi fn lần đầu tiên, các lần sau trả về kết quả cached. Xử lý trường hợp fn throw error.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe pipe với async support: asyncPipe<A, B, C>(...) nhận mix của sync và async functions (T => U | Promise<U>). Return luôn là Promise. Hint: dùng async reduce + await each step.',
            },
          ]}
          hint="debounce: let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }. once: let called = false, let result; ... once. asyncPipe: reduce với Promise.resolve(acc).then(fn)."
        />
      </Sec>
    </LessonCard>
  );
}

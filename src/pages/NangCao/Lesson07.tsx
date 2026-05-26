import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const ASYNC_TYPING = `// Typed async functions

// Basic async với explicit return type
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(\`/api/users/\${id}\`);
  if (!response.ok) {
    throw new Error(\`HTTP \${response.status}\`);
  }
  return response.json() as Promise<User>;
}

// Promise.all — infer tuple types
async function fetchAll(ids: string[]): Promise<[User, Post[], Comment[]]> {
  return Promise.all([
    fetchUser(ids[0]!),
    fetchPosts(ids[0]!),
    fetchComments(ids[0]!),
  ]);
}

// Promise.allSettled — kết quả là fulfilled | rejected
async function fetchAllSafe(ids: string[]) {
  const results = await Promise.allSettled(ids.map(fetchUser));
  return results.map(r => {
    if (r.status === 'fulfilled') return r.value; // User
    console.error(r.reason);
    return null;
  });
}

// Generic async function
async function fetchAndParse<T>(
  url: string,
  validate: (data: unknown) => data is T
): Promise<T> {
  const response = await fetch(url);
  const json: unknown = await response.json();
  if (!validate(json)) {
    throw new TypeError(\`Unexpected response shape from \${url}\`);
  }
  return json; // T
}

declare function isUser(v: unknown): v is User;
declare function fetchPosts(id: string): Promise<Post[]>;
declare function fetchComments(id: string): Promise<Comment[]>;
interface User { id: string; name: string }
interface Post { id: string; title: string }
interface Comment { id: string; body: string }`;

const ERROR_CLASSES = `// Custom error class hierarchy

// Base AppError
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    // Fix prototype chain cho TypeScript khi extends Error
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
    };
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string | number) {
    super(
      \`\${resource} with id \${id} not found\`,
      'NOT_FOUND',
      404,
      { resource, id }
    );
    this.name = 'NotFoundError';
  }
}

class ValidationError extends AppError {
  constructor(
    public readonly field: string,
    message: string
  ) {
    super(message, 'VALIDATION_ERROR', 400, { field });
    this.name = 'ValidationError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

// Error discriminated union type guard
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// Global error handler
function handleError(error: unknown): { message: string; code: string; statusCode: number } {
  if (error instanceof ValidationError) {
    return { message: \`\${error.field}: \${error.message}\`, code: error.code, statusCode: 400 };
  }
  if (error instanceof NotFoundError) {
    return { message: error.message, code: error.code, statusCode: 404 };
  }
  if (isAppError(error)) {
    return { message: error.message, code: error.code, statusCode: error.statusCode };
  }
  return { message: 'Internal server error', code: 'INTERNAL_ERROR', statusCode: 500 };
}`;

const RESULT_TYPE = `// Result<T, E> pattern — không dùng throw, trả về lỗi như value

type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Helpers
function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function err<E extends Error>(error: E): Result<never, E> {
  return { success: false, error };
}

// Wrap async function
async function tryCatch<T>(
  fn: () => Promise<T>
): Promise<Result<T>> {
  try {
    return ok(await fn());
  } catch (e) {
    return err(e instanceof Error ? e : new Error(String(e)));
  }
}

// Usage
async function createUser(dto: { name: string; email: string }): Promise<Result<User, AppError>> {
  if (!dto.email.includes('@')) {
    return err(new ValidationError('email', 'Invalid email format'));
  }
  try {
    const user = await db.create(dto); // mock
    return ok(user);
  } catch {
    return err(new AppError('Failed to create user', 'DB_ERROR'));
  }
}

// Chaining results
function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (data: T) => U
): Result<U, E> {
  return result.success ? ok(fn(result.data)) : result;
}

// Usage — không cần try/catch ở caller
const result = await createUser({ name: 'Alice', email: 'alice@example.com' });
if (result.success) {
  console.log('Created:', result.data.id);
} else {
  console.error('Error:', result.error.message);
}

declare const db: { create: (dto: object) => Promise<User> };
declare class AppError extends Error { constructor(msg: string, code: string); }
declare class ValidationError extends AppError { constructor(field: string, msg: string); }
interface User { id: string; name: string }`;

const ASYNC_PATTERNS = `// Advanced async patterns

// Concurrent requests với type safety
async function fetchUserWithPosts(userId: string) {
  const [user, posts] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
  ] as const); // as const để infer tuple types

  return { user, posts };
}

// Race with timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(\`Timeout after \${ms}ms\`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// Retry với exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError!: Error;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      if (attempt < maxAttempts) {
        const delay = baseDelayMs * 2 ** (attempt - 1); // 1s, 2s, 4s
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// Typed async queue
class AsyncQueue<T> {
  private queue: Array<() => Promise<T>> = [];
  private running = 0;

  constructor(private concurrency = 3) {}

  add(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => task().then(resolve).catch(reject));
      this.run();
    });
  }

  private async run(): Promise<void> {
    if (this.running >= this.concurrency || this.queue.length === 0) return;
    this.running++;
    const task = this.queue.shift()!;
    try { await task(); } finally {
      this.running--;
      this.run();
    }
  }
}

declare function fetchUser(id: string): Promise<{ id: string; name: string }>;
declare function fetchPosts(id: string): Promise<{ id: string; title: string }[]>;`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson07({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-07"
      num="07"
      title="Async & Error Handling"
      desc="Typed async/await, custom error hierarchy, Result<T,E> pattern, retry/timeout"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Async & Error Handling trong TypeScript">
        <Concept>
          <p>
            TypeScript cung cấp full type inference cho <code className="ic">async/await</code> và{' '}
            <code className="ic">Promise</code>. Best practice: xây dựng{' '}
            <strong>error class hierarchy</strong> để phân loại lỗi, và dùng{' '}
            <strong>Result&lt;T, E&gt;</strong> pattern (Railway-Oriented Programming) để trả lỗi
            như value thay vì throw — tránh unexpected exceptions.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Typed async functions', code: ASYNC_TYPING },
            { label: 'Error class hierarchy', code: ERROR_CLASSES },
            { label: 'Result<T,E> pattern', code: RESULT_TYPE },
            { label: 'Retry & timeout', code: ASYNC_PATTERNS },
          ]}
        />
      </Sec>

      <Sec title="Error handling strategies">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Strategy</th>
              <th>Cách dùng</th>
              <th>Pros/Cons</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['throw/catch', 'try { ... } catch (e) { ... }', '+ Quen thuộc / - Lỗi dễ bị bỏ qua'],
              ['Result<T,E>', 'return ok(data) | err(error)', '+ Explicit / - Verbose hơn'],
              [
                'Custom errors',
                'instanceof AppError, NotFoundError',
                '+ Phân loại rõ / cần hierarchy',
              ],
              ['tryCatch wrapper', 'await tryCatch(fn)', '+ Wrap any async fn / - Extra layer'],
            ].map(([strat, how, proscons]) => (
              <tr key={strat}>
                <td>
                  <strong>{strat}</strong>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{how}</code>
                </td>
                <td style={{ fontSize: 12 }}>{proscons}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Object.setPrototypeOf trong Error subclass:</strong> Khi extend{' '}
          <code className="ic">Error</code> và compile sang ES5, prototype chain bị broken —{' '}
          <code className="ic">instanceof</code> không work đúng. Thêm{' '}
          <code className="ic">Object.setPrototypeOf(this, new.target.prototype)</code> trong
          constructor để fix.
        </Callout>
        <Callout type="warn">
          <strong>error trong catch là unknown:</strong> Từ TypeScript 4.0 với{' '}
          <code className="ic">useUnknownInCatchVariables</code> (mặc định với strict),{' '}
          <code className="ic">catch (e)</code> có type là <code className="ic">unknown</code>. Luôn
          check <code className="ic">e instanceof Error</code> trước khi dùng{' '}
          <code className="ic">e.message</code>.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo error hierarchy: AppError → DatabaseError, ValidationError, AuthError. Mỗi class có code riêng. Viết function classifyError(e: unknown): "db" | "validation" | "auth" | "unknown".',
            },
            {
              level: 'medium',
              text: 'Implement Result<T, E> với helper methods: map<U>(fn: (data: T) => U): Result<U, E>, flatMap<U>(fn: (data: T) => Result<U, E>): Result<U, E>, getOrThrow(): T, getOrDefault(defaultValue: T): T.',
            },
            {
              level: 'hard',
              text: 'Implement async pipeline: pipe(fetchUser, validateUser, enrichUser, saveUser) mỗi step trả về Promise<Result<T, E>>. Nếu bất kỳ step nào fail, pipeline dừng và trả về lỗi đó. Dùng generic.',
            },
          ]}
          hint="classifyError: instanceof chain. Result methods: return result.success ? ok(fn(result.data)) : result. Pipeline: reduce với async flatMap pattern — await từng step, dừng nếu !success."
        />
      </Sec>
    </LessonCard>
  );
}

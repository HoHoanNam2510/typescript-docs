import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const STRICT_FLAGS = `// strict mode — hiểu từng flag
// "strict": true bật cả 8 flags dưới đây

{
  "compilerOptions": {
    // ★ Group 1: strictNullChecks (quan trọng nhất)
    "strictNullChecks": true,
    // null/undefined không thể gán cho type khác
    // let s: string = null;   // Error
    // let s: string | null = null; // OK

    // ★ Group 2: Implicit any
    "noImplicitAny": true,
    // function fn(x) {}  // Error — x được infer là any
    // function fn(x: number) {}  // OK

    // ★ Group 3: this type
    "noImplicitThis": true,
    // this trong function phải có type annotation

    // ★ Group 4: Bind call apply
    "strictBindCallApply": true,
    // fn.call(thisArg, ...args) — args phải match signature

    // ★ Group 5: Property initialization
    "strictPropertyInitialization": true,
    // class properties phải được gán trong constructor

    // ★ Group 6: Function types
    "strictFunctionTypes": true,
    // function parameters phải contravariant

    // ★ Extra strict (không nằm trong "strict: true")
    "noUncheckedIndexedAccess": true,
    // arr[0] là T | undefined, không phải T
    // phải check trước khi dùng

    "exactOptionalPropertyTypes": true,
    // { x?: number } không cho phép gán undefined
    // phải dùng { x?: number | undefined } explicitly

    "noImplicitReturns": true,
    // function phải return ở tất cả code paths

    "noFallthroughCasesInSwitch": true,
    // switch/case phải có break/return

    "noPropertyAccessFromIndexSignature": true,
    // phải dùng bracket notation cho index signature
  }
}`;

const ANTI_PATTERNS = `// Anti-patterns phổ biến và cách fix

// ✗ 1. Dùng any — mất type safety hoàn toàn
function processData(data: any) {
  return data.user.name; // không có type checking
}

// ✓ Fix: dùng unknown + type guard
function processData(data: unknown) {
  if (
    typeof data === 'object' && data !== null &&
    'user' in data &&
    typeof (data as Record<string, unknown>).user === 'object'
  ) {
    const user = (data as { user: { name: string } }).user;
    return user.name;
  }
  throw new Error('Invalid data shape');
}

// ✗ 2. Type assertion bừa bãi
const el = document.getElementById('root') as HTMLInputElement; // nguy hiểm!

// ✓ Fix: instanceof check
const el = document.getElementById('root');
if (el instanceof HTMLInputElement) {
  el.value = 'hello'; // an toàn
}

// ✗ 3. Non-null assertion (!) không cần thiết
const name = user!.profile!.name; // có thể throw runtime

// ✓ Fix: optional chaining + nullish coalescing
const name = user?.profile?.name ?? 'Anonymous';

// ✗ 4. Enum khi không cần
enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }
// Tạo runtime object, khó tree-shake

// ✓ Fix: const union type (không có runtime cost)
type Status = 'ACTIVE' | 'INACTIVE';
const STATUSES = ['ACTIVE', 'INACTIVE'] as const;

// ✗ 5. Quên await
async function saveUser(user: User): Promise<void> {
  db.save(user); // forgot await — no error but Promise ignored!
}

// ✓ Fix: luôn await Promise, "no-floating-promises" ESLint rule
async function saveUser(user: User): Promise<void> {
  await db.save(user); // đúng
}`;

const GOOD_PATTERNS = `// Good patterns — TypeScript thực chiến

// ✓ 1. Const assertions cho literal types
const ROUTES = {
  home:    '/',
  users:   '/users',
  profile: '/profile',
} as const satisfies Record<string, string>;

type Route = (typeof ROUTES)[keyof typeof ROUTES]; // "/" | "/users" | "/profile"

// ✓ 2. Discriminated union cho state machine
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   error: Error };

function render<T>(state: AsyncState<T>): string {
  switch (state.status) {
    case 'idle':    return 'Ready';
    case 'loading': return 'Loading...';
    case 'success': return JSON.stringify(state.data); // state.data typed
    case 'error':   return state.error.message;        // state.error typed
  }
}

// ✓ 3. Branded types cho primitive identity
type UserId    = string & { readonly __brand: 'UserId' };
type ProductId = string & { readonly __brand: 'ProductId' };

function findUser(id: UserId): User { /* ... */ }
// findUser('abc');          // Error — string không phải UserId
// findUser(productId);      // Error — ProductId không phải UserId

// ✓ 4. Exhaustive checks
type Action = 'create' | 'read' | 'update' | 'delete';

function getPermission(action: Action, role: 'admin' | 'user'): boolean {
  switch (action) {
    case 'create': return role === 'admin';
    case 'read':   return true;
    case 'update': return role === 'admin';
    case 'delete': return role === 'admin';
    default:
      action satisfies never; // Error nếu thiếu case (TS 4.9+)
      return false;
  }
}`;

const CODE_ORGANIZATION = `// Tổ chức code TypeScript — folder structure + exports

// src/types/index.ts — centralized types
export type { User, UserPreview, CreateUserDto } from './user';
export type { Post, CreatePostDto, UpdatePostDto } from './post';
export type { Result, AsyncResult } from './common';

// src/types/common.ts — shared utility types
export type Result<T, E extends Error = Error> =
  | { success: true;  data:  T }
  | { success: false; error: E };

export type AsyncResult<T, E extends Error = Error> = Promise<Result<T, E>>;

export type Nullable<T>  = T | null;
export type Optional<T>  = T | undefined;
export type Maybe<T>     = T | null | undefined;

// Pattern: Repository interface (testable, swappable)
// src/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(options?: { page?: number; limit?: number }): Promise<User[]>;
  create(dto: CreateUserDto): Promise<User>;
  update(id: string, dto: Partial<CreateUserDto>): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

// src/repositories/PrismaUserRepository.ts — concrete implementation
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly db: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }
  // ...
}

// Dependency injection — easy to swap/mock
class UserService {
  constructor(private readonly users: IUserRepository) {}

  async getUser(id: string): Promise<User> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundError('User', id);
    return user;
  }
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson06({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-06"
      num="06"
      title="Best Practices & Strict Mode"
      desc="strict flags, anti-patterns, good patterns, code organization"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Best Practices TypeScript">
        <Concept>
          <p>
            Bật <code className="ic">strict: true</code> là bước đầu tiên. Ngoài ra,{' '}
            <code className="ic">noUncheckedIndexedAccess</code> và{' '}
            <code className="ic">exactOptionalPropertyTypes</code> bắt thêm nhiều lỗi tinh tế hơn.
            Tránh <code className="ic">any</code>, <code className="ic">as</code> assertion bừa bãi,
            và non-null assertion (<code className="ic">!</code>) — ưu tiên type guards và optional
            chaining. <strong>Discriminated unions</strong> và <strong>branded types</strong> là
            foundation của TypeScript type-safe architecture.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Strict mode flags', code: STRICT_FLAGS },
            { label: 'Anti-patterns', code: ANTI_PATTERNS },
            { label: 'Good patterns', code: GOOD_PATTERNS },
            { label: 'Code organization', code: CODE_ORGANIZATION },
          ]}
        />
      </Sec>

      <Sec title="Strict flags reference">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Flag</th>
              <th>Bắt lỗi gì</th>
              <th>Trong strict?</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['strictNullChecks', 'null/undefined gán cho non-nullable', 'Có'],
              ['noImplicitAny', 'Parameter không khai báo type', 'Có'],
              ['strictPropertyInitialization', 'Class property chưa gán', 'Có'],
              ['strictFunctionTypes', 'Function type variance', 'Có'],
              ['noUncheckedIndexedAccess', 'arr[i] là T | undefined', 'Không'],
              ['exactOptionalPropertyTypes', 'optional !== | undefined', 'Không'],
              ['noImplicitReturns', 'Function thiếu return path', 'Không'],
              ['noFallthroughCasesInSwitch', 'Switch thiếu break', 'Không'],
            ].map(([flag, catches, inStrict]) => (
              <tr key={flag}>
                <td>
                  <code style={{ fontSize: 11 }}>{flag}</code>
                </td>
                <td style={{ fontSize: 12 }}>{catches}</td>
                <td style={{ color: inStrict === 'Có' ? 'var(--accent)' : 'var(--text3)' }}>
                  {inStrict}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>noUncheckedIndexedAccess thay đổi behavior:</strong> Sau khi bật,{' '}
          <code className="ic">arr[0]</code> có type <code className="ic">T | undefined</code> thay
          vì <code className="ic">T</code>. Cần thêm null check hoặc dùng{' '}
          <code className="ic">arr.at(0)</code> với optional chaining. Đây là source of truth vì
          array access thật sự có thể undefined.
        </Callout>
        <Callout type="warn">
          <strong>Migrate dần sang strict:</strong> Bật strict cho project lớn đang có thể tạo hàng
          trăm lỗi. Chiến lược: bật từng flag một, dùng{' '}
          <code className="ic">// @ts-expect-error</code> tạm thời, hoặc dùng file-level{' '}
          <code className="ic">// @ts-strict-ignore</code> rồi fix dần.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tìm và fix 5 anti-patterns trong code sau: (1) any params, (2) as cast, (3) ! non-null, (4) enum thay vì union, (5) missing await. Giải thích tại sao mỗi pattern nguy hiểm.',
            },
            {
              level: 'medium',
              text: 'Refactor UserService từ dùng any sang fully-typed: constructor nhận IUserRepository interface, methods return Result<T>, error hierarchy với NotFoundError/ValidationError.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe dependency injection container: Container.register<T>(token: string, factory: () => T) và Container.resolve<T>(token: string): T — với circular dependency detection tại type-level.',
            },
          ]}
          hint="Anti-patterns: unknown + type guard thay any. Refactor: IUserRepository interface với findById/create/update/delete. DI container: WeakMap hoặc Map<string, () => unknown>, throw nếu không tìm thấy."
        />
      </Sec>
    </LessonCard>
  );
}

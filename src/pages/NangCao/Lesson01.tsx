import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const TYPEOF_INSTANCEOF = `// typeof guard — cho primitive types
function formatValue(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return value.trim().toUpperCase(); // TypeScript biết: string
  }
  if (typeof value === 'number') {
    return value.toFixed(2);           // TypeScript biết: number
  }
  return value ? 'yes' : 'no';        // TypeScript biết: boolean
}

// instanceof guard — cho class instances
class ApiError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'ApiError';
  }
}

class NetworkError extends Error {
  constructor(message: string, public url: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

function handleError(error: unknown): string {
  if (error instanceof ApiError) {
    return \`API \${error.statusCode}: \${error.message}\`;
  }
  if (error instanceof NetworkError) {
    return \`Network error at \${error.url}: \${error.message}\`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

// instanceof còn narrow trong class hierarchy
class Animal { breathe() {} }
class Dog extends Animal { bark() {} }
class Cat extends Animal { purr() {} }

function makeSound(pet: Dog | Cat): void {
  if (pet instanceof Dog) pet.bark(); // Dog
  else pet.purr();                    // Cat (TypeScript tự suy ra)
}`;

const IN_GUARD = `// in guard — kiểm tra property có tồn tại không
type Fish = { swim: () => void; fins: number };
type Bird = { fly: () => void; wingspan: number };
type Pet = Fish | Bird;

function move(pet: Pet): void {
  if ('swim' in pet) {
    // TypeScript biết: Fish
    console.log(\`Swimming with \${pet.fins} fins\`);
    pet.swim();
  } else {
    // TypeScript biết: Bird
    console.log(\`Flying with \${pet.wingspan}cm wingspan\`);
    pet.fly();
  }
}

// in guard với optional properties — cẩn thận!
type AdminUser = { id: string; role: 'admin'; adminLevel: number };
type RegularUser = { id: string; role: 'user' };
type AppUser = AdminUser | RegularUser;

function getAdminLevel(user: AppUser): number | null {
  // 'adminLevel' in user — safe: field chỉ có trong AdminUser
  if ('adminLevel' in user) {
    return user.adminLevel; // TypeScript biết: AdminUser
  }
  return null;
}

// Discriminated union thay vì in guard khi có thể
function getRole(user: AppUser): string {
  switch (user.role) {
    case 'admin': return \`Admin level \${user.adminLevel}\`; // AdminUser
    case 'user':  return 'Regular user';                   // RegularUser
  }
}`;

const USER_DEFINED_GUARDS = `// User-defined type predicate — "value is T"
// Hàm trả về boolean, nhưng TypeScript biết thêm thông tin về type

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

// Kiểm tra object shape — pattern phổ biến nhất
interface User {
  id: string;
  name: string;
  email: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value && typeof (value as Record<string, unknown>).id === 'string' &&
    'name' in value && typeof (value as Record<string, unknown>).name === 'string' &&
    'email' in value && typeof (value as Record<string, unknown>).email === 'string'
  );
}

// Dùng trong thực tế
async function fetchUser(id: string): Promise<User> {
  const raw = await fetch(\`/api/users/\${id}\`).then(r => r.json());
  if (!isUser(raw)) {
    throw new Error('Invalid user data from API');
  }
  return raw; // TypeScript biết: User
}

// Generic type guard
function isArrayOf<T>(arr: unknown, guard: (v: unknown) => v is T): arr is T[] {
  return Array.isArray(arr) && arr.every(guard);
}

const data: unknown = ['alice', 'bob', 'charlie'];
if (isArrayOf(data, isString)) {
  data.forEach(s => console.log(s.toUpperCase())); // data là string[]
}`;

const ASSERTION_FUNCTIONS = `// Assertion functions (TypeScript 3.7+)
// "asserts value is T" — nếu hàm return bình thường, TypeScript tin type đúng

function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(\`Expected string, got \${typeof value}\`);
  }
}

function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value must not be null or undefined');
  }
}

// Dùng như một guard không cần if-else
function processInput(input: string | null): void {
  assertIsDefined(input);
  // Sau đây TypeScript biết input là string (không null)
  console.log(input.toUpperCase());
}

// assert condition (không narrow type cụ thể)
function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function divide(a: number, b: number): number {
  assert(b !== 0, 'Cannot divide by zero');
  return a / b; // b !== 0 được TypeScript "ghi nhớ" sau assert
}

// Kết hợp assertion + type predicate
function assertIsUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new TypeError('Invalid user object');
  }
}

async function loadAndProcessUser(id: string) {
  const raw: unknown = await fetch(\`/api/users/\${id}\`).then(r => r.json());
  assertIsUser(raw);
  // raw là User từ đây — không cần if/else
  console.log(\`Processing user: \${raw.name}\`);
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson01({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-01"
      num="01"
      title="Type Guards"
      desc="typeof, instanceof, in, user-defined type predicates, assertion functions"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Type Guards">
        <Concept>
          <p>
            <strong>Type Guard</strong> là bất kỳ expression nào giúp TypeScript thu hẹp (narrow)
            type trong một branch cụ thể. TypeScript có 4 loại guard built-in:{' '}
            <code className="ic">typeof</code>, <code className="ic">instanceof</code>,{' '}
            <code className="ic">in</code>, và <strong>user-defined type predicates</strong> — cùng
            với <strong>assertion functions</strong> (TS 3.7+) để assert tại điểm gọi.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'typeof & instanceof', code: TYPEOF_INSTANCEOF },
            { label: 'in guard', code: IN_GUARD },
            { label: 'Type predicates', code: USER_DEFINED_GUARDS },
            { label: 'Assertion functions', code: ASSERTION_FUNCTIONS },
          ]}
        />
      </Sec>

      <Sec title="So sánh các loại Type Guard">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Guard</th>
              <th>Cú pháp</th>
              <th>Dùng cho</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'typeof',
                "typeof x === 'string'",
                'Primitives: string, number, boolean, bigint, symbol',
              ],
              ['instanceof', 'x instanceof Class', 'Class instances & inheritance'],
              ['in', "'prop' in obj", 'Object shape — property có tồn tại không'],
              ['Type predicate', 'fn(x): x is T', 'Custom runtime validation — API data'],
              ['Assertion fn', 'asserts x is T', 'Throw nếu sai — không cần if/else sau đó'],
              [
                'Discriminant',
                "x.kind === 'circle'",
                'Discriminated unions — nhanh & rõ ràng nhất',
              ],
            ].map(([guard, syntax, use]) => (
              <tr key={guard}>
                <td>
                  <strong>{guard}</strong>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{syntax}</code>
                </td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>typeof null === 'object':</strong> JavaScript quirk — kiểm tra{' '}
          <code className="ic">typeof x === 'object'</code> vẫn match{' '}
          <code className="ic">null</code>. Luôn kết hợp <code className="ic">value !== null</code>{' '}
          khi kiểm tra object.
        </Callout>
        <Callout type="warn">
          <strong>Type predicate là cam kết với compiler:</strong> Nếu hàm{' '}
          <code className="ic">isUser(x): x is User</code> return <code className="ic">true</code>{' '}
          nhưng x không phải User, TypeScript sẽ không báo lỗi — runtime sẽ crash. Viết predicate
          cẩn thận, kiểm tra tất cả fields quan trọng.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết type predicate isProduct(value: unknown): value is Product với Product = { id: string; name: string; price: number; inStock: boolean }. Test với dữ liệu đúng và thiếu field.',
            },
            {
              level: 'medium',
              text: 'Implement generic function isArrayOf<T>(arr: unknown, guard: (v: unknown) => v is T): arr is T[]. Sau đó viết isStringArray, isNumberArray dùng hàm này. Test với mixed arrays.',
            },
            {
              level: 'hard',
              text: 'Viết assertMatchesSchema<T>(value: unknown, schema: Record<keyof T, string>): asserts value is T — schema là object map field → typeof string ("id" → "string", "price" → "number"). Dùng schema để validate value tự động.',
            },
          ]}
          hint="isProduct: kiểm tra typeof cho từng field. isArrayOf: Array.isArray(arr) && arr.every(guard). assertMatchesSchema: Object.entries(schema).every(([k, t]) => typeof value[k] === t)."
        />
      </Sec>
    </LessonCard>
  );
}

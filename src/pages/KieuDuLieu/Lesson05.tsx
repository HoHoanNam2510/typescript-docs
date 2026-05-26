import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const STRICT_NULL = `// strictNullChecks: true (mặc định trong tsconfig strict)
// null và undefined KHÔNG tự động gán vào type khác

let name: string = null;        // Error trong strict mode!
let name2: string | null = null; // OK — explicit

// Hậu quả: phải handle null ở mọi nơi có thể xảy ra
function getUserName(id: number): string | null {
  const user = db.find(id);
  return user ? user.name : null; // rõ ràng về nullability
}

const name3 = getUserName(1); // string | null
// Phải narrow trước khi dùng string methods
if (name3 !== null) {
  console.log(name3.toUpperCase()); // OK
}

// null vs undefined
let a: null = null;          // chỉ là null
let b: undefined = undefined; // chỉ là undefined
let c: null | undefined;     // cả hai`;

const OPTIONAL_CHAINING = `// Optional chaining (?.) — truy cập property an toàn
// Trả về undefined nếu gặp null/undefined thay vì throw

type User = {
  name: string;
  address?: {
    city: string;
    zip?: string;
  };
};

const user: User | null = getUser();

// Không có optional chaining — dài dòng
const city1 = user !== null && user.address !== undefined
  ? user.address.city
  : undefined;

// Với optional chaining — gọn
const city2 = user?.address?.city; // string | undefined

// Optional method call
const upper = user?.name?.toUpperCase(); // undefined hoặc "ALICE"

// Optional array access
const first = users?.[0]?.name; // undefined nếu users null hoặc rỗng

// Optional chaining với nullish coalescing
const displayName = user?.name ?? 'Anonymous';
const zip = user?.address?.zip ?? 'N/A';`;

const NULLISH_COALESCING = `// Nullish coalescing (??) — fallback chỉ khi null/undefined
// Khác || ở chỗ: 0, '', false KHÔNG kích hoạt fallback

// Vấn đề với || (logical OR)
const count = 0;
const display1 = count || 'No items'; // "No items" — sai! 0 là falsy
const display2 = count ?? 'No items'; // 0 — đúng! 0 không phải null/undefined

// ?? chỉ fallback khi null hoặc undefined
const a = null ?? 'default';      // "default"
const b = undefined ?? 'default'; // "default"
const c = 0 ?? 'default';         // 0
const d = '' ?? 'default';        // ""
const e = false ?? 'default';     // false

// Kết hợp ?. và ??
type Config = { timeout?: number; retries?: number };
const config: Config = {};

const timeout = config.timeout ?? 5000;   // 5000 (default)
const retries = config.retries ?? 3;       // 3 (default)

// Nullish assignment (??=) — TS 4.0+
config.timeout ??= 5000; // gán nếu timeout là null/undefined`;

const NULL_NARROWING = `// Null narrowing — TypeScript tự narrow sau khi check
function processUser(user: User | null): string {
  // Strict equality check
  if (user === null) return 'No user';
  user.name; // OK — đã narrow sang User

  // Truthy check
  if (!user) return 'No user';
  user.name; // OK

  // Early return pattern — phổ biến
  return user.name.toUpperCase();
}

// Assertion function — tự narrow sau khi gọi
function assertUser(user: User | null): asserts user is User {
  if (user === null) throw new Error('User required');
}

const user = getUser(); // User | null
assertUser(user);       // throw nếu null
user.name;              // OK — TypeScript biết không null

// Chained operations an toàn
const result = [1, null, 2, null, 3]
  .filter((x): x is number => x !== null)
  .map(x => x * 2); // [2, 4, 6] — TypeScript biết là number[]`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson05({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-05"
      num="05"
      title="Null & Undefined Handling"
      desc="strictNullChecks, optional chaining, nullish coalescing, null narrowing"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Xử lý null và undefined trong TypeScript">
        <Concept>
          <p>
            Với <code className="ic">strictNullChecks: true</code>, TypeScript bắt buộc handle{' '}
            <code className="ic">null</code> và <code className="ic">undefined</code> một cách rõ
            ràng. Ba toán tử quan trọng: <strong>optional chaining</strong> (
            <code className="ic">?.</code>), <strong>nullish coalescing</strong> (
            <code className="ic">??</code>), và <strong>non-null assertion</strong> (
            <code className="ic">!</code>).
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'strictNullChecks', code: STRICT_NULL },
            { label: 'Optional chaining (?.)', code: OPTIONAL_CHAINING },
            { label: 'Nullish coalescing (??)', code: NULLISH_COALESCING },
            { label: 'Null narrowing', code: NULL_NARROWING },
          ]}
        />
      </Sec>

      <Sec title="So sánh các toán tử">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Toán tử</th>
              <th>Ý nghĩa</th>
              <th>Khi nào trigger fallback</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['a?.b', 'Optional chaining', 'a là null hoặc undefined'],
              ['a ?? b', 'Nullish coalescing', 'a là null hoặc undefined'],
              ['a || b', 'Logical OR', 'a là falsy (0, "", false, null, undefined)'],
              ['a!', 'Non-null assertion', 'Không trigger — compile-time only'],
              ['a ??= b', 'Nullish assignment', 'a là null hoặc undefined'],
            ].map(([op, meaning, when]) => (
              <tr key={op}>
                <td>
                  <code>{op}</code>
                </td>
                <td>{meaning}</td>
                <td>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>?? vs || — dễ nhầm lẫn:</strong> Dùng <code className="ic">??</code> khi muốn
          fallback chỉ với <code className="ic">null</code>/<code className="ic">undefined</code>.
          Dùng <code className="ic">||</code> khi muốn fallback với mọi giá trị falsy. Ví dụ:{' '}
          <code className="ic">count ?? 0</code> đúng với <code className="ic">count = 0</code>, còn{' '}
          <code className="ic">count || 0</code> sẽ override giá trị 0 thực sự.
        </Callout>
        <Callout type="warn">
          <strong>Array filter với type guard:</strong>{' '}
          <code className="ic">.filter(x =&gt; x !== null)</code> trả về{' '}
          <code className="ic">(T | null)[]</code>, không phải <code className="ic">T[]</code>. Dùng
          type guard <code className="ic">.filter((x): x is T =&gt; x !== null)</code> để TypeScript
          hiểu đúng type sau filter.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết function getDisplayName(user: { name?: string; email: string } | null): string — trả về name nếu có, email nếu không có name, "Guest" nếu user là null.',
            },
            {
              level: 'medium',
              text: 'Viết function filterNonNull<T>(arr: (T | null | undefined)[]): T[] dùng type guard. Sau đó dùng nó để lấy danh sách user valid từ mixed array.',
            },
            {
              level: 'hard',
              text: 'Implement assertion function assertDefined<T>(value: T | null | undefined, message?: string): asserts value is T. Viết thêm isDefined<T>(value: T | null | undefined): value is T.',
            },
          ]}
          hint="getDisplayName: user?.name ?? user?.email ?? 'Guest'. filterNonNull: .filter((x): x is T => x != null). asserts value is T: throw nếu null/undefined, TypeScript sẽ narrow sau khi gọi."
        />
      </Sec>
    </LessonCard>
  );
}

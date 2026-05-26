import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const KEYOF_BASIC = `// keyof — lấy union của tất cả key names của một type
type User = { id: number; name: string; email: string; active: boolean };

type UserKeys = keyof User; // "id" | "name" | "email" | "active"

// Ứng dụng: type-safe property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: 'Alice', email: 'alice@ex.com', active: true };

const name = getProperty(user, 'name');   // string — type chính xác!
const id = getProperty(user, 'id');       // number
const flag = getProperty(user, 'active'); // boolean
// getProperty(user, 'phone');  // Error — 'phone' không phải key của User

// keyof với index signatures
type StringMap = { [key: string]: string };
type MapKeys = keyof StringMap; // string | number (JavaScript quirk)

// keyof any
type AnyKey = keyof any; // string | number | symbol`;

const TYPEOF_OPERATOR = `// typeof — lấy TypeScript type của một value (khác typeof JS)
const user = { id: 1, name: 'Alice', active: true };

// typeof trong type position → lấy type
type UserType = typeof user; // { id: number; name: string; active: boolean }

// Rất hữu ích để lấy type từ existing value
const config = {
  host: 'localhost',
  port: 3000,
  debug: false,
};

type Config = typeof config;
// { host: string; port: number; debug: boolean }

// Kết hợp keyof và typeof — rất phổ biến
type ConfigKeys = keyof typeof config; // "host" | "port" | "debug"

function updateConfig(key: keyof typeof config, value: Config[typeof key]) {
  // type-safe config update
}

// typeof với function
function add(a: number, b: number) { return a + b; }
type AddFn = typeof add; // (a: number, b: number) => number

// ReturnType dùng typeof
type AddResult = ReturnType<typeof add>; // number`;

const INDEXED_ACCESS = `// Indexed access types — lấy type của một property cụ thể
type User = { id: number; name: string; address: { city: string; zip: string } };

type UserId = User['id'];           // number
type UserName = User['name'];       // string
type Address = User['address'];     // { city: string; zip: string }
type City = User['address']['city']; // string — nested!

// Với union key — lấy union type
type IdOrName = User['id' | 'name']; // number | string

// Với keyof — lấy union của tất cả value types
type UserValues = User[keyof User]; // number | string | { city: string; zip: string }

// Array indexed access
type StringArray = string[];
type StringElement = StringArray[number]; // string

type Tuple = [string, number, boolean];
type First = Tuple[0]; // string
type Second = Tuple[1]; // number

// Thực tế: lấy type từ array của objects
const ROLES = ['admin', 'editor', 'viewer'] as const;
type Role = typeof ROLES[number]; // "admin" | "editor" | "viewer"`;

const PRACTICAL = `// Ứng dụng thực tế: type-safe object utilities

// 1. Pick specific keys — an toàn hơn type assertion
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as Pick<T, K>);
}

type User = { id: number; name: string; email: string; password: string };
const user: User = { id: 1, name: 'Alice', email: 'alice@ex.com', password: 'secret' };
const publicUser = pick(user, ['id', 'name', 'email']); // safe — no password!

// 2. Type-safe event system
type EventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  resize: UIEvent;
};

function on<K extends keyof EventMap>(
  event: K,
  handler: (e: EventMap[K]) => void
): void {
  document.addEventListener(event, handler as EventListener);
}

on('click', e => console.log(e.clientX)); // e là MouseEvent
on('keydown', e => console.log(e.key));   // e là KeyboardEvent

// 3. Type-safe store getter
function getStoreValue<T extends object, K extends keyof T>(
  store: T,
  key: K
): T[K] {
  return store[key];
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson06({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-06"
      num="06"
      title="keyof & typeof"
      desc="Lấy keys và types từ existing types — nền tảng của type manipulation"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="keyof và typeof — hai operator quan trọng">
        <Concept>
          <p>
            <code className="ic">keyof T</code> trả về union của tất cả key names của type{' '}
            <code className="ic">T</code>. <code className="ic">typeof value</code> trả về
            TypeScript type của một value. Kết hợp hai operator này là nền tảng của type
            manipulation.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'keyof', code: KEYOF_BASIC },
            { label: 'typeof', code: TYPEOF_OPERATOR },
            { label: 'Indexed access T[K]', code: INDEXED_ACCESS },
            { label: 'Thực tế', code: PRACTICAL },
          ]}
        />
      </Sec>

      <Sec title="Tóm tắt các operators">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Operator</th>
              <th>Input</th>
              <th>Output</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['keyof T', 'Type', 'Union of keys', 'keyof User → "id" | "name"'],
              ['typeof x', 'Value', 'Type of value', 'typeof config → Config'],
              ['T[K]', 'Type + key', 'Type of property', "User['name'] → string"],
              ['keyof typeof x', 'Value', 'Keys as union', 'keyof typeof config'],
            ].map(([op, input, output, example]) => (
              <tr key={op}>
                <td>
                  <code>{op}</code>
                </td>
                <td>{input}</td>
                <td>{output}</td>
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
          <strong>keyof typeof — pattern cực kỳ phổ biến:</strong>{' '}
          <code className="ic">
            const ROUTES = {'{'} home: '/', about: '/about' {'}'}
          </code>{' '}
          → <code className="ic">type Route = keyof typeof ROUTES</code> →{' '}
          <code className="ic">"home" | "about"</code>. Dùng để tạo union type từ object literal mà
          không cần khai báo thủ công.
        </Callout>
        <Callout type="warn">
          <strong>typeof ROLES[number] — lấy type từ array:</strong> Với{' '}
          <code className="ic">const arr = ['a', 'b'] as const</code>, dùng{' '}
          <code className="ic">typeof arr[number]</code> để lấy{' '}
          <code className="ic">"a" | "b"</code>. Cần <code className="ic">as const</code> để
          TypeScript giữ literal types, không bị widen thành <code className="ic">string</code>.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void — type-safe setter. Đảm bảo value phải đúng type với key.',
            },
            {
              level: 'medium',
              text: 'Tạo const COLORS = { red: "#ff0000", green: "#00ff00", blue: "#0000ff" } as const. Từ đó derive: type ColorName = keyof typeof COLORS và type ColorHex = typeof COLORS[ColorName].',
            },
            {
              level: 'hard',
              text: 'Viết function pluck<T, K extends keyof T>(arr: T[], key: K): T[K][] — lấy array của một property từ array of objects. pluck(users, "name") trả về string[].',
            },
          ]}
          hint="setProperty: obj[key] = value — TypeScript tự check type. COLORS as const giữ literal types. pluck: arr.map(item => item[key]) — return type tự động là T[K][]."
        />
      </Sec>
    </LessonCard>
  );
}

import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const EXTENDS_CONSTRAINT = `// extends — giới hạn T chỉ được là subtype của constraint

// T phải có length
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength('hello');     // OK — string có length
getLength([1, 2, 3]);   // OK — array có length
getLength({ length: 5 }); // OK — object có length
// getLength(42);       // Error — number không có length

// T phải extend object
function keys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

// T phải có id: string
function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// Multiple constraints — T phải có cả hai
interface HasName { name: string; }
interface HasAge  { age: number; }

function greet<T extends HasName & HasAge>(person: T): string {
  return \`\${person.name} is \${person.age} years old\`;
}

greet({ name: 'Alice', age: 30, email: 'a@b.com' }); // OK — extra props fine`;

const KEYOF_CONSTRAINT = `// K extends keyof T — key type constraint

// Type-safe property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 30, role: 'admin' as const };

const name = getProperty(user, 'name'); // string
const age  = getProperty(user, 'age');  // number
// getProperty(user, 'phone');           // Error!

// Type-safe property setter
function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

setProperty(user, 'age', 31);      // OK
// setProperty(user, 'age', '31'); // Error — must be number

// pick — type-safe version của _.pick
function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => { result[key] = obj[key]; });
  return result;
}

const preview = pick(user, ['name', 'role']);
// { name: string; role: "admin" }

// omit — type-safe version của _.omit
function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result as Omit<T, K>;
}`;

const MULTIPLE_CONSTRAINTS = `// Multiple type params với constraints liên quan

// U phải là keyof T
function pluck<T extends object, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const users = [
  { name: 'Alice', age: 30 },
  { name: 'Bob',   age: 25 },
];
const names = pluck(users, 'name'); // string[]
const ages  = pluck(users, 'age');  // number[]

// Infer type relationship giữa params
function merge<T extends object, U extends object>(target: T, source: U): T & U {
  return { ...target, ...source };
}

// Entry type extraction
type Entry<T> = { [K in keyof T]: [K, T[K]] }[keyof T];

function entries<T extends object>(obj: T): Entry<T>[] {
  return Object.entries(obj) as Entry<T>[];
}

// Sorted — T phải comparable (có toString hoặc dùng compare)
function sortBy<T extends object, K extends keyof T>(
  items: T[],
  key: K,
  direction: 'asc' | 'desc' = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const av = String(a[key]), bv = String(b[key]);
    return direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
  });
}`;

const DEFAULT_PARAMS = `// Default type parameters — T = DefaultType khi không specify

// T defaults to unknown
interface ApiResponse<T = unknown> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

type UserResponse = ApiResponse<User>; // data: User
type AnyResponse  = ApiResponse;       // data: unknown

// Multiple defaults — sau param đầu có default, các params sau cũng phải có default
interface Paginated<T = unknown, Meta = Record<string, unknown>> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  meta?: Meta;
}

type UserPage = Paginated<User>;
type PostPage = Paginated<Post, { tags: string[] }>;

// Default với constraint — T phải extend object và default là {}
function createStore<T extends object = Record<string, unknown>>(
  initial?: T
): T {
  return { ...initial } as T;
}

const store1 = createStore();                          // Record<string, unknown>
const store2 = createStore({ count: 0, name: 'app' }); // { count: number; name: string }

// Conditional default — advanced
type Strict<T, Required extends boolean = false> =
  Required extends true ? { [K in keyof T]-?: T[K] } : T;`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson02({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-02"
      num="02"
      title="Generic Constraints"
      desc="extends, keyof constraints, multiple params, default type parameters"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Generic Constraints">
        <Concept>
          <p>
            <strong>Constraints</strong> giới hạn type parameter T chỉ chấp nhận types có đủ
            properties cần thiết. Dùng <code className="ic">T extends SomeType</code> để đảm bảo T
            có <code className="ic">length</code>, <code className="ic">id</code>, hay bất kỳ
            structure nào cần. Kết hợp với <code className="ic">K extends keyof T</code> để
            type-safe property access.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'extends constraint', code: EXTENDS_CONSTRAINT },
            { label: 'keyof constraint', code: KEYOF_CONSTRAINT },
            { label: 'Multiple constraints', code: MULTIPLE_CONSTRAINTS },
            { label: 'Default type params', code: DEFAULT_PARAMS },
          ]}
        />
      </Sec>

      <Sec title="Các dạng constraint phổ biến">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Constraint</th>
              <th>Ý nghĩa</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['T extends object', 'T là object, không phải primitive', 'Object utilities'],
              ['T extends { length: number }', 'T có length (string, array, ...)', 'getLength<T>'],
              ['T extends { id: string }', 'T có id — entity pattern', 'findById<T>'],
              ['K extends keyof T', 'K là key của T', 'getProperty<T, K>'],
              ['T extends string | number', 'T chỉ là primitive nhất định', 'compare<T>'],
              ['T extends new() => U', 'T là constructor của U', 'Factory pattern'],
            ].map(([constraint, meaning, example]) => (
              <tr key={constraint}>
                <td>
                  <code>{constraint}</code>
                </td>
                <td>{meaning}</td>
                <td>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Constraint không thu hẹp type quá mức:</strong>{' '}
          <code className="ic">{'<T extends {id: string}>'}</code> không nghĩa T phải là{' '}
          <code className="ic">{'{ id: string }'}</code> chính xác. T có thể có thêm properties —
          chỉ cần có ít nhất <code className="ic">id: string</code>. Đây là structural typing.
        </Callout>
        <Callout type="warn">
          <strong>Default type params từ trái sang phải:</strong> Nếu{' '}
          <code className="ic">{'<A, B = string>'}</code> thì A không có default, B có. Không thể có{' '}
          <code className="ic">{'<A = string, B>'}</code> — param có default phải ở sau params không
          có default.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết function maxBy<T extends object, K extends keyof T>(arr: T[], key: K): T | undefined — trả về item có giá trị lớn nhất tại key K. Test với mảng users sort by age.',
            },
            {
              level: 'medium',
              text: 'Implement function deepMerge<T extends object, U extends object>(target: T, source: U): T & U — merge nested objects (không ghi đè, merge đệ quy). Xử lý trường hợp cả hai có cùng nested object key.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe EventEmitter với constraints: class TypedEmitter<Events extends Record<string, unknown>> với on<K extends keyof Events>, off<K>, emit<K>. Thêm constraint: Events keys phải là string.',
            },
          ]}
          hint="maxBy: reduce với compare a[key] > b[key]. deepMerge: typeof target[k] === 'object' && typeof source[k] === 'object' ? deepMerge(target[k], source[k]) : source[k]. TypedEmitter: K extends keyof Events & string."
        />
      </Sec>
    </LessonCard>
  );
}

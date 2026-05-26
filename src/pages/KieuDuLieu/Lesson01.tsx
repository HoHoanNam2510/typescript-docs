import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const ALIAS_BASIC = `// Type alias — tạo tên mới cho bất kỳ kiểu nào
type UserId = number;
type UserName = string;
type IsActive = boolean;

// Dùng như type gốc — chỉ là "tên mới"
const id: UserId = 1;
const name: UserName = 'Alice';

// Alias cho complex types
type Coordinate = [number, number];
type Matrix = number[][];
type StringMap = Record<string, string>;

const point: Coordinate = [10, 20];
const grid: Matrix = [[1, 2], [3, 4]];

// Alias cho union — rất phổ biến
type Status = 'loading' | 'success' | 'error' | 'idle';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Alias cho object type
type User = {
  id: UserId;
  name: UserName;
  status: Status;
};

const user: User = { id: 1, name: 'Alice', status: 'active' };`;

const ALIAS_ADVANCED = `// Alias cho function types
type Callback = (error: Error | null, data?: string) => void;
type Predicate<T> = (value: T) => boolean;
type Transform<A, B> = (input: A) => B;

const isPositive: Predicate<number> = n => n > 0;
const toString: Transform<number, string> = n => String(n);

// Generic type alias
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

let userName: Nullable<string> = null;  // string | null
let userAge: Optional<number> = undefined; // number | undefined

// Pair và Triple
type Pair<A, B> = { first: A; second: B };
type Triple<A, B, C> = { first: A; second: B; third: C };

const point: Pair<number, number> = { first: 10, second: 20 };
const entry: Pair<string, number> = { first: 'age', second: 30 };`;

const ALIAS_RECURSIVE = `// Recursive type alias — type tự tham chiếu chính nó
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]             // array của JSONValue
  | { [key: string]: JSONValue }; // object với JSONValue values

const validJSON: JSONValue = {
  name: 'Alice',
  age: 30,
  scores: [100, 95, 87],
  metadata: {
    active: true,
    tags: ['admin', 'user'],
    address: { city: 'Hanoi', zip: null },
  },
};

// Recursive linked list
type ListNode<T> = {
  value: T;
  next: ListNode<T> | null;
};

const list: ListNode<number> = {
  value: 1,
  next: { value: 2, next: { value: 3, next: null } },
};

// Tree node
type TreeNode<T> = {
  value: T;
  children: TreeNode<T>[];
};`;

const ALIAS_VS_INTERFACE = `// Type alias vs Interface — so sánh trực tiếp

// Type alias — có thể là BẤT KỲ type nào
type StringOrNumber = string | number;     // union — interface không làm được
type UserTuple = [number, string, boolean]; // tuple
type ID = string;                           // primitive

// Interface — chỉ cho object shapes
interface User {
  id: number;
  name: string;
}

// Cả hai dùng cho object — gần như giống nhau
type UserType = { id: number; name: string };
interface UserInterface { id: number; name: string }

// Khác biệt quan trọng:
// 1. Interface có declaration merging — type alias KHÔNG có
interface Window { myPlugin: string }  // extend Window type
interface Window { analytics: object } // OK — merge!

// 2. Type alias tạo được intersection bằng &
type Admin = User & { role: 'admin' };

// 3. Interface extends — dễ đọc hơn &
interface Admin2 extends User { role: 'admin' }`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson01({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-01"
      num="01"
      title="Type Aliases"
      desc="Tạo tên mới cho bất kỳ type nào — generic, recursive, và khi nào dùng"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Type Alias là gì?">
        <Concept>
          <p>
            <strong>Type alias</strong> tạo ra một <em>tên mới</em> cho bất kỳ kiểu nào — primitive,
            object, union, tuple, hay function. Alias không tạo type mới, chỉ đặt tên để tái sử dụng
            và tăng readability.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Alias cơ bản', code: ALIAS_BASIC },
            { label: 'Generic alias', code: ALIAS_ADVANCED },
            { label: 'Recursive alias', code: ALIAS_RECURSIVE },
            { label: 'Alias vs Interface', code: ALIAS_VS_INTERFACE },
          ]}
        />
      </Sec>

      <Sec title="Khi nào dùng type alias?">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Dùng type alias khi...</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Đặt tên cho union type', "type Status = 'active' | 'inactive'"],
              ['Đặt tên cho primitive', 'type UserId = string'],
              ['Alias cho tuple', 'type Point = [number, number]'],
              ['Alias cho function type', 'type Handler = (e: Event) => void'],
              ['Generic utility type', 'type Maybe<T> = T | null | undefined'],
              ['Recursive type', 'type JSON = string | number | JSON[]'],
            ].map(([when, example]) => (
              <tr key={when}>
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
          <strong>Type alias không tạo type mới:</strong>{' '}
          <code className="ic">type UserId = number</code> không tạo ra kiểu mới — TypeScript vẫn
          coi <code className="ic">UserId</code> và <code className="ic">number</code> là một. Dùng
          alias để tăng readability, không phải để enforce semantic distinctions.
        </Callout>
        <Callout type="warn">
          <strong>Recursive type cần cẩn thận:</strong> TypeScript cho phép recursive type alias
          nhưng phải có base case. Dùng <code className="ic">JSONValue</code> pattern khi cần type
          cho dữ liệu dynamic — an toàn hơn <code className="ic">any</code>.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo type aliases: EventHandler<T = Event> = (event: T) => void. Dùng nó để type các click và input event handlers.',
            },
            {
              level: 'medium',
              text: 'Tạo type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }. Viết function safeDivide(a: number, b: number): Result<number, string>.',
            },
            {
              level: 'hard',
              text: 'Implement type DeepPartial<T> — giống Partial<T> nhưng đệ quy cho tất cả nested objects. Gợi ý: { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }.',
            },
          ]}
          hint="EventHandler<MouseEvent> cho click. Result<number> trả về { ok: true; value: 42 } hoặc { ok: false; error: 'Division by zero' }. DeepPartial dùng mapped types + conditional."
        />
      </Sec>
    </LessonCard>
  );
}

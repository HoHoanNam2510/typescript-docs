import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const UNION_BASIC = `// Union type — biến có thể là một trong nhiều kiểu
let id: string | number;
id = 'abc-123'; // OK
id = 42;        // OK
id = true;      // Error: Type 'boolean' is not assignable to type 'string | number'

// Function nhận nhiều type
function printId(id: string | number) {
  // Phải narrow trước khi dùng method đặc thù
  if (typeof id === 'string') {
    console.log(id.toUpperCase()); // OK — đã narrow sang string
  } else {
    console.log(id.toFixed(2));    // OK — đã narrow sang number
  }
}

printId('user-001'); // OK
printId(42);         // OK

// Union với literal types — rất phổ biến
type Direction = 'north' | 'south' | 'east' | 'west';
type Status = 'loading' | 'success' | 'error';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';`;

const DISCRIMINATED_UNION = `// Discriminated Union — pattern quan trọng nhất trong TypeScript
// Dùng một "discriminant" field (kind, type, tag...) để phân biệt
type Circle = {
  kind: 'circle';  // literal type — discriminant
  radius: number;
};

type Square = {
  kind: 'square';  // literal type — discriminant
  side: number;
};

type Triangle = {
  kind: 'triangle'; // literal type — discriminant
  base: number;
  height: number;
};

type Shape = Circle | Square | Triangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {  // TypeScript tự narrow từng case!
    case 'circle':
      return Math.PI * shape.radius ** 2; // shape là Circle ở đây
    case 'square':
      return shape.side ** 2;             // shape là Square ở đây
    case 'triangle':
      return (shape.base * shape.height) / 2; // shape là Triangle
    default:
      const _exhaustive: never = shape; // exhaustive check!
      return _exhaustive;
  }
}

const c: Circle = { kind: 'circle', radius: 5 };
console.log(getArea(c)); // 78.54...`;

const INTERSECTION_CODE = `// Intersection type — phải có TẤT CẢ properties của tất cả types
type HasName = { name: string };
type HasAge  = { age: number };
type HasEmail = { email: string };

type Person = HasName & HasAge & HasEmail;

const alice: Person = {
  name: 'Alice',  // từ HasName
  age: 30,        // từ HasAge
  email: 'alice@example.com', // từ HasEmail
};

// Thiếu field sẽ bị lỗi
const bob: Person = {
  name: 'Bob',
  age: 25,
  // Error: Property 'email' is missing!
};

// Intersection với function types
type Loggable = { log: () => void };
type Serializable = { serialize: () => string };
type Service = Loggable & Serializable;

// Ứng dụng phổ biến: mixin pattern
type WithId<T> = T & { id: string; createdAt: Date };
type UserWithId = WithId<{ name: string; email: string }>;
// UserWithId = { name: string; email: string; id: string; createdAt: Date }`;

const NARROWING_CODE = `// Type narrowing — thu hẹp union type về type cụ thể

// 1. typeof narrowing
function format(value: string | number | boolean): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return value.toFixed(2);
  return value ? 'yes' : 'no';
}

// 2. instanceof narrowing
function getLength(value: string | string[]): number {
  if (value instanceof Array) return value.length;
  return value.length; // cả hai đều có .length nhưng context khác
}

// 3. in operator narrowing
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim(); // Fish
  } else {
    animal.fly();  // Bird
  }
}

// 4. Type guard function
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function process(input: unknown) {
  if (isString(input)) {
    console.log(input.toUpperCase()); // OK — narrowed sang string
  }
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson10({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-10"
      num="10"
      title="Union & Intersection Types"
      desc="Union (|), Discriminated Unions, Intersection (&), và type narrowing"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Union và Intersection — hai phép toán trên types">
        <Concept>
          <p>
            <strong>Union</strong> (<code className="ic">A | B</code>) nghĩa là "A hoặc B" — giá trị
            có thể thuộc một trong nhiều kiểu. <strong>Intersection</strong> (
            <code className="ic">A & B</code>) nghĩa là "A và B" — giá trị phải thỏa mãn cả hai.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Union cơ bản', code: UNION_BASIC },
            { label: 'Discriminated Union', code: DISCRIMINATED_UNION },
            { label: 'Intersection (&)', code: INTERSECTION_CODE },
            { label: 'Type narrowing', code: NARROWING_CODE },
          ]}
        />
      </Sec>

      <Sec title="Union vs Intersection — so sánh nhanh">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Đặc điểm</th>
              <th>Union (A | B)</th>
              <th>Intersection (A & B)</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Ý nghĩa', '"Hoặc" — một trong hai', '"Và" — phải có tất cả'],
              ['Properties', 'Chỉ chung của A và B (nếu dùng trực tiếp)', 'Tất cả của A và B'],
              ['Narrowing', 'Cần narrow trước khi dùng', 'Dùng trực tiếp mọi property'],
              ['Dùng khi', 'Nhiều kiểu, cần handle từng case', 'Kết hợp nhiều type (mixin)'],
              [
                'Pattern phổ biến',
                'Discriminated union (kind field)',
                'WithId<T>, Loggable & Serializable',
              ],
            ].map(([feature, union, intersection]) => (
              <tr key={feature}>
                <td>{feature}</td>
                <td>{union}</td>
                <td>{intersection}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Discriminated Union là pattern quan trọng nhất:</strong> Dùng một literal type
          field (thường là <code className="ic">kind</code>, <code className="ic">type</code>, hoặc{' '}
          <code className="ic">tag</code>) để phân biệt các variant. TypeScript tự động narrow trong
          switch/if — đây là cách viết type-safe code cực kỳ phổ biến trong React và Node.js.
        </Callout>
        <Callout type="warn">
          <strong>Union chỉ cho phép truy cập property chung:</strong> Với{' '}
          <code className="ic">A | B</code>, nếu không narrow, chỉ có thể dùng property tồn tại ở{' '}
          <em>cả A lẫn B</em>. Dùng <code className="ic">typeof</code>,{' '}
          <code className="ic">instanceof</code>, hoặc <code className="ic">in</code> để narrow.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo discriminated union ApiResult = { status: "success"; data: unknown } | { status: "error"; message: string }. Viết function handleResult(result: ApiResult): void.',
            },
            {
              level: 'medium',
              text: 'Tạo intersection type AdminUser = User & { role: "admin"; permissions: string[] }. Viết function isAdmin(user: User | AdminUser): user is AdminUser.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe event system: type EventMap = { click: MouseEvent; keydown: KeyboardEvent; resize: UIEvent }. Viết function on<K extends keyof EventMap>(event: K, handler: (e: EventMap[K]) => void): void.',
            },
          ]}
          hint="Discriminated union: check status field. Type guard: 'permissions' in user. EventMap với keyof cho phép TypeScript infer đúng event type cho từng handler."
        />
      </Sec>
    </LessonCard>
  );
}

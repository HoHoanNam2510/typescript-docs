import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const TUPLE_BASIC = `// Tuple: array với số phần tử cố định, kiểu xác định theo vị trí
let person: [string, number] = ['Alice', 30];
person[0] = 'Bob';   // OK
person[1] = 'Bob';   // Error: Type 'string' is not assignable to type 'number'

// Không thể swap vị trí
let wrong: [string, number] = [30, 'Alice']; // Error!

// Named tuple (TS 4.0+) — dễ đọc và IDE hints
type Point = [x: number, y: number];
type RGB = [red: number, green: number, blue: number];

let origin: Point = [0, 0];
let color: RGB = [255, 128, 0];

// Vẫn truy cập qua index, nhưng named giúp IDE hiển thị tên
origin[0]; // IDE hiển thị "x: number"`;

const OPTIONAL_REST = `// Optional element — phải ở cuối tuple
type StringNum = [string, number?];
const a: StringNum = ['hello'];     // OK — number là optional
const b: StringNum = ['hello', 42]; // OK

// Rest elements — nhiều phần tử cùng type
type StringAndNumbers = [string, ...number[]];
const c: StringAndNumbers = ['hi', 1, 2, 3, 4]; // OK

// Rest ở đầu — ít phổ biến hơn
type NumbersAndString = [...number[], string];
const d: NumbersAndString = [1, 2, 3, 'end']; // OK

// Không thể có optional trước rest
type Bad = [string?, number]; // Error!`;

const DESTRUCTURE_CODE = `// Basic destructuring
const [name, age]: [string, number] = ['Alice', 30];
console.log(name); // "Alice"
console.log(age);  // 30

// Function trả về tuple — pattern rất phổ biến
function getMinMax(arr: number[]): [number, number] {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);
// Rõ ràng hơn object khi chỉ 2 giá trị

// useState trong React là tuple pattern!
// const [count, setCount] = useState<number>(0);
// [T, (value: T) => void]

// Error handling pattern với tuple
function divide(a: number, b: number): [number, null] | [null, string] {
  if (b === 0) return [null, 'Division by zero'];
  return [a / b, null];
}

const [result, error] = divide(10, 2);
if (error) console.error(error);
else console.log(result);`;

const TUPLE_VS_OBJ = `// Tuple — compact, phụ thuộc vị trí
type UserTuple = [number, string, boolean];
const user1: UserTuple = [1, 'Alice', true];
const [id, username, isActive] = user1;

// Object — verbose hơn nhưng rõ nghĩa
type UserObject = { id: number; name: string; active: boolean };
const user2: UserObject = { id: 1, name: 'Alice', active: true };

// Khuyến nghị:
// Tuple — khi 2-3 fields, có nghĩa rõ ràng theo vị trí (x,y), (min,max)
// Object — khi > 3 fields, hoặc cần tên để phân biệt

// Tuple đặc biệt hữu ích cho:
// - Coordinate: [x: number, y: number]
// - HTTP status: [statusCode: number, body: string]
// - useState: [state: T, setter: (v: T) => void]`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson07({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-07"
      num="07"
      title="Tuples"
      desc="Array với số phần tử cố định — named tuples, destructuring, use cases"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Tuple là gì?">
        <Concept>
          <p>
            <strong>Tuple</strong> là array với <em>số phần tử cố định</em> và{' '}
            <em>kiểu xác định cho từng vị trí</em>. Khác với array bình thường (tất cả phần tử cùng
            type), mỗi vị trí trong tuple có type riêng.
          </p>
        </Concept>
      </Sec>

      <Sec title="Tuple trong TypeScript">
        <CodeTabs
          tabs={[
            { label: 'Tuple cơ bản', code: TUPLE_BASIC },
            { label: 'Optional & Rest', code: OPTIONAL_REST },
            { label: 'Destructuring', code: DESTRUCTURE_CODE },
            { label: 'Tuple vs Object', code: TUPLE_VS_OBJ },
          ]}
        />
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>React useState là tuple pattern:</strong>{' '}
          <code className="ic">const [count, setCount] = useState(0)</code> — đây là tuple{' '}
          <code className="ic">[number, Dispatch&lt;SetStateAction&lt;number&gt;&gt;]</code>. Hiểu
          tuple giúp bạn đọc React types dễ hơn.
        </Callout>
        <Callout type="warn">
          <strong>Tuple vs Array — không tự convert:</strong> TypeScript phân biệt{' '}
          <code className="ic">[string, number]</code> (tuple) và{' '}
          <code className="ic">(string | number)[]</code> (array). Không hoán đổi được. Nếu function
          trả về tuple, phải annotate rõ return type.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết function parseCSVLine(line: string): [string, number, boolean] parse "Alice,30,true". Trả về tuple với đúng types.',
            },
            {
              level: 'medium',
              text: 'Tạo type HttpResponse = [statusCode: number, body: string, headers?: Record<string, string>]. Viết function fetchData(): HttpResponse.',
            },
            {
              level: 'hard',
              text: 'Implement useLocalStorage<T>(key: string): [T | null, (value: T) => void] — tuple giống useState nhưng lưu vào localStorage.',
            },
          ]}
          hint="line.split(',') để tách. parseInt() cho number, val === 'true' cho boolean. Named tuple giúp IDE hints tốt hơn. useState pattern: return [state, setter]."
        />
      </Sec>
    </LessonCard>
  );
}

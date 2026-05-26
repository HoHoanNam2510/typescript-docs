import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const INFERENCE_CODE = `// TypeScript TỰ SUY RA kiểu từ giá trị khởi tạo
let message = 'Hello';  // inferred: string
let count = 42;         // inferred: number
let isReady = true;     // inferred: boolean

// Vẫn bắt lỗi dù không khai báo type
message = 100;          // Error: Type 'number' is not assignable to type 'string'

// Inference với array
let numbers = [1, 2, 3];      // inferred: number[]
let mixed = [1, 'two', true]; // inferred: (string | number | boolean)[]

// Inference với object
let user = { name: 'Alice', age: 30 };
// inferred: { name: string; age: number }
user.name = 42; // Error: Type 'number' is not assignable to type 'string'
user.email = 'alice@ex.com'; // Error: Property 'email' does not exist`;

const EXPLICIT_CODE = `// Khai báo explicit khi CHƯA khởi tạo ngay
let value: string;
// ... later
value = 'hello'; // OK

// Explicit khi muốn type RỘNG HƠN inferred
let id: string | number = 'abc123';
id = 42; // OK — vì type là string | number

// Explicit cho function parameters — LUÔN CẦN
function multiply(a: number, b: number): number {
  return a * b;
}

// Explicit khi inferred quá hẹp (literal type)
let status = 'active';   // inferred: "active" (literal!) — không đổi được
let status2: string = 'active'; // inferred: string — có thể gán lại`;

const LITERAL_CODE = `// Literal types — khi TypeScript infer quá hẹp
const PI = 3.14159;     // inferred: 3.14159 (literal) — vì const không đổi
let pi = 3.14159;       // inferred: number — vì let có thể thay đổi

// Đây là lý do status = "active" có type "active", không phải string
let status = 'active';  // type: "active" literal
status = 'inactive';    // Error! Type '"inactive"' is not assignable to type '"active"'

// Fix: dùng explicit annotation
let status2: string = 'active'; // type: string
status2 = 'inactive';           // OK

// Hoặc dùng union literal — type-safe nhất
let status3: 'active' | 'inactive' | 'pending' = 'active';
status3 = 'inactive';  // OK
status3 = 'banned';    // Error!`;

const BEST_PRACTICE = `// ✓ KHÔNG CẦN explicit khi giá trị khởi tạo rõ ràng
const PI = 3.14159;           // inference đủ rõ
const users = getUsers();     // inference theo return type của getUsers()

// ✓ NÊN explicit khi khai báo không gán ngay
let result: string | null;

// ✓ NÊN explicit cho function return type
function fetchUser(id: number): Promise<User> { ... }

// ✓ NÊN explicit khi muốn type rộng hơn
let flexible: string | number = 'hello';

// ✗ KHÔNG NÊN explicit khi redundant
const name: string = 'Alice'; // thừa — inference đã đúng`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson04({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-04"
      num="04"
      title="Type Inference vs Explicit Types"
      desc="TypeScript tự suy ra type — khi nào cần khai báo thủ công"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Type inference là gì?">
        <Concept>
          <p>
            <strong>Type inference</strong> là khả năng TypeScript <em>tự suy ra kiểu</em> từ giá
            trị khởi tạo — không cần bạn viết annotation. Tuy nhiên, TypeScript vẫn kiểm tra type
            safety đầy đủ.
          </p>
        </Concept>
      </Sec>

      <Sec title="Inference vs Explicit — code examples">
        <CodeTabs
          tabs={[
            { label: 'Type Inference', code: INFERENCE_CODE },
            { label: 'Explicit Types', code: EXPLICIT_CODE },
            { label: 'Literal Types', code: LITERAL_CODE },
            { label: 'Best Practice', code: BEST_PRACTICE },
          ]}
        />
      </Sec>

      <Sec title="Khi nào dùng explicit type?">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Tình huống</th>
              <th>Nên dùng?</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Khai báo biến với giá trị khởi tạo rõ ràng', 'Không cần — inference đủ tốt'],
              ['Khai báo biến chưa gán giá trị ngay', 'Phải explicit (không có giá trị để infer)'],
              ['Function parameters', 'Phải explicit (TS không tự infer params)'],
              ['Function return type', 'Nên explicit — documentation rõ ràng hơn'],
              ['Muốn type rộng hơn inferred', 'Cần explicit (e.g., string | number)'],
              ['Literal type không mong muốn', 'Cần explicit (let x: string = "active")'],
            ].map(([situation, use]) => (
              <tr key={situation}>
                <td>{situation}</td>
                <td>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>const → literal type, let → widened type:</strong>{' '}
          <code className="ic">const x = "hello"</code> infer type là{' '}
          <code className="ic">"hello"</code> (literal). <code className="ic">let x = "hello"</code>{' '}
          infer type là <code className="ic">string</code>. Đây là lý do đằng sau literal type
          inference.
        </Callout>
        <Callout type="warn">
          <strong>Không nên explicit khi redundant:</strong>{' '}
          <code className="ic">const name: string = "Alice"</code> — annotation{' '}
          <code className="ic">: string</code> thừa vì TypeScript đã infer từ{' '}
          <code className="ic">"Alice"</code>. Code sạch hơn khi bỏ annotation thừa.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Dự đoán kiểu TypeScript infer cho: let arr = [1, 2, 3], let obj = {x: 1, y: "hello"}, const fn = (n: number) => n * 2. Kiểm tra trong IDE.',
            },
            {
              level: 'medium',
              text: 'Viết function parseInput(input: string | number): string — nếu input là string trả về nó, nếu là number trả về input.toString().',
            },
            {
              level: 'hard',
              text: 'Giải thích tại sao let status = "active" có kiểu "active" chứ không phải string. Khi nào thì literal type gây ra vấn đề thực tế?',
            },
          ]}
          hint="Hover lên biến trong VS Code để xem type được infer. typeof input === 'number' để narrow type. Literal type xảy ra khi dùng const."
        />
      </Sec>
    </LessonCard>
  );
}

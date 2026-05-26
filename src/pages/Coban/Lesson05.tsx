import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const ANY_CODE = `// any — "escape hatch" nguy hiểm, tắt type checking
let flexible: any = 'hello';
flexible = 42;           // OK
flexible = true;         // OK
flexible.toUpperCase();  // OK — nhưng nếu flexible là number → runtime error!
flexible.nonExistent();  // OK với TypeScript, crash khi chạy!

// any "lây" sang kiểu khác
function getData(): any { return fetch('/api/data'); }
let value: any = getData();
let name: string = value.user.name; // không có type checking — nguy hiểm!

// Dấu hiệu nhận biết any tệ:
// const x: any = ...   ← thường là code smell
// as any               ← red flag, giải thích được không?`;

const UNKNOWN_CODE = `// unknown — type-safe hơn any, phải narrow trước khi dùng
let input: unknown = getInput();

// Phải kiểm tra type trước khi dùng
if (typeof input === 'string') {
  console.log(input.toUpperCase()); // OK — đã narrow
}
if (typeof input === 'number') {
  console.log(input.toFixed(2));    // OK — đã narrow
}

// Không thể dùng trực tiếp
input.toUpperCase(); // Error: Object is of type 'unknown'

// Ứng dụng thực tế: JSON.parse trả về unknown (nên như vậy)
function parseJSON(raw: string): unknown {
  return JSON.parse(raw); // unknown an toàn hơn any
}

const data = parseJSON('{"name":"Alice"}');
// Phải narrow hoặc validate trước khi dùng data`;

const NEVER_CODE = `// never — kiểu không bao giờ có giá trị

// Function throw luôn có return type là never
function throwError(message: string): never {
  throw new Error(message);
  // Code sau đây không bao giờ chạy
}

// Exhaustiveness check với never — QUAN TRỌNG trong phỏng vấn
type Shape = 'circle' | 'square' | 'triangle';

function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 4;
    case 'square':
      return 16;
    case 'triangle':
      return 6;
    default:
      // Nếu thêm case mới vào Shape mà quên handle ở đây,
      // TypeScript báo lỗi ngay lập tức!
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}`;

const VOID_CODE = `// void — hàm không trả về giá trị có nghĩa
function logMessage(msg: string): void {
  console.log(msg);
  // return; hoặc không return — cả hai đều OK
  // return undefined; cũng OK
}

// Khác biệt void vs undefined
const v: void = undefined;  // OK — void có thể nhận undefined
const u: undefined = undefined; // OK

// Thực tế: event handlers thường trả về void
document.addEventListener('click', (e: MouseEvent): void => {
  console.log(e.target);
});

// Callback type với void — hàm có thể return gì cũng được
type Callback = () => void;
const cb: Callback = () => 42; // OK! void cho phép return giá trị bị bỏ qua`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson05({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-05"
      num="05"
      title="Special Types — any, unknown, never, void"
      desc="Hiểu rõ 4 kiểu đặc biệt — câu hỏi phỏng vấn phổ biến"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="4 special types — tổng quan">
        <Concept>
          <p>
            TypeScript có 4 kiểu "đặc biệt" không tương ứng với giá trị JavaScript thông thường.
            Hiểu sự khác biệt — đặc biệt <code className="ic">any</code> vs{' '}
            <code className="ic">unknown</code> — là câu hỏi phỏng vấn rất phổ biến.
          </p>
        </Concept>
        <div className="explain-grid" style={{ marginTop: '0.75rem' }}>
          <div className="explain-box">
            <h4>any</h4>
            <p>Tắt type checking hoàn toàn. Tránh dùng — chỉ khi migrate code JS sang TS.</p>
          </div>
          <div className="explain-box">
            <h4>unknown</h4>
            <p>
              Type-safe thay thế cho any. Phải narrow trước khi dùng. Dùng cho data từ ngoài vào.
            </p>
          </div>
          <div className="explain-box">
            <h4>never</h4>
            <p>Không bao giờ xảy ra. Dùng cho exhaustiveness check và function throw.</p>
          </div>
          <div className="explain-box">
            <h4>void</h4>
            <p>
              Hàm không có return value có nghĩa. Khác undefined ở chỗ: void callback cho phép
              return.
            </p>
          </div>
        </div>
      </Sec>

      <Sec title="Chi tiết từng type">
        <CodeTabs
          tabs={[
            { label: 'any (tránh!)', code: ANY_CODE },
            { label: 'unknown (dùng thay any)', code: UNKNOWN_CODE },
            { label: 'never (exhaustive check)', code: NEVER_CODE },
            { label: 'void', code: VOID_CODE },
          ]}
        />
      </Sec>

      <Sec title="any vs unknown — phỏng vấn hay hỏi">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Đặc điểm</th>
              <th>any</th>
              <th>unknown</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Type checking', 'Tắt hoàn toàn', 'Bắt buộc narrow trước khi dùng'],
              ['Dùng trực tiếp', 'OK (nguy hiểm)', 'Error — phải kiểm tra type'],
              ['Assign cho type khác', 'OK', 'Chỉ OK sau khi narrow'],
              [
                'Khi nào dùng',
                'Migrate JS → TS, thư viện cũ',
                'API response, JSON.parse, user input',
              ],
              ['Type safety', 'Không có', 'Đầy đủ'],
            ].map(([feature, any, unknown]) => (
              <tr key={feature}>
                <td>{feature}</td>
                <td style={{ color: 'var(--red)' }}>{any}</td>
                <td style={{ color: 'var(--green)' }}>{unknown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Dùng unknown cho external data:</strong> Khi nhận data từ API, localStorage, hoặc
          bất kỳ nguồn nào không kiểm soát được, khai báo type là{' '}
          <code className="ic">unknown</code> rồi validate. Đây là cách đúng đắn để handle data
          không tin tưởng.
        </Callout>
        <Callout type="warn">
          <strong>never trong exhaustive check:</strong> Pattern{' '}
          <code className="ic">const _never: never = value</code> trong default case của switch là
          kỹ thuật quan trọng. Khi thêm case mới vào union type mà quên handle, TypeScript báo lỗi
          ngay — không bị silent bug.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết hàm safeParse(input: unknown): string. Nếu input là string, trả về nó. Ngược lại, throw Error("Expected string").',
            },
            {
              level: 'medium',
              text: 'Tạo type Direction = "north" | "south" | "east" | "west". Viết function getOpposite(d: Direction): Direction với exhaustive check dùng never trong default case.',
            },
            {
              level: 'hard',
              text: 'Giải thích: tại sao () => void callback cho phép return giá trị nhưng function có return type void thì không thể? Cho ví dụ minh họa.',
            },
          ]}
          hint="typeof input === 'string' để narrow unknown. never trong switch default: const x: never = shape; — nếu thiếu case, TypeScript lỗi vì không thể assign Shape vào never."
        />
      </Sec>
    </LessonCard>
  );
}

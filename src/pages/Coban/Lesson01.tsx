import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import LineTable from '../../components/LineTable';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Flow, Concept } from './_helpers';

const JS_CODE = `// JavaScript — lỗi chỉ phát hiện khi chạy
function greet(name) {
  return 'Hello, ' + name.toUpperCase();
}

greet('Alice');  // OK
greet(42);       // Runtime Error: name.toUpperCase is not a function`;

const TS_CODE = `// TypeScript — lỗi phát hiện ngay lúc viết code
function greet(name: string): string {
  return 'Hello, ' + name.toUpperCase();
}

greet('Alice');  // OK
greet(42);       // Compile Error: Argument of type 'number' is not
                 // assignable to parameter of type 'string'`;

const COMPARE_CODE = `// JavaScript (không có type)
let age = 25;
age = 'twenty-five'; // Không báo lỗi — nhưng logic sai!

// TypeScript (có type)
let age: number = 25;
age = 'twenty-five'; // Error: Type 'string' is not assignable to type 'number'`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson01({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-01"
      num="01"
      title="Giới Thiệu TypeScript"
      desc="TypeScript = JavaScript + Static Typing — tại sao cần, cách hoạt động"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="TypeScript là gì?">
        <Concept>
          <p>
            TypeScript là <strong>superset của JavaScript</strong> — mọi code JS đều là code TS hợp
            lệ. TS thêm vào <strong>static type system</strong>: bạn khai báo type cho biến, hàm, và
            compiler kiểm tra tính đúng đắn lúc viết code — không đợi runtime.
          </p>
          <p style={{ marginTop: 8 }}>
            File <code className="ic">.ts</code> không chạy trực tiếp — phải compile sang{' '}
            <code className="ic">.js</code>. Trình duyệt và Node.js vẫn chạy JavaScript.
          </p>
        </Concept>
      </Sec>

      <Sec title="Luồng hoạt động">
        <Flow
          steps={[
            'Viết code TypeScript trong file .ts — IDE báo lỗi type ngay lập tức',
            'TypeScript compiler (tsc) kiểm tra toàn bộ types — fail nếu có lỗi',
            'Compile thành JavaScript (.js) — type annotations bị xóa hoàn toàn',
            'Node.js / trình duyệt chạy file .js như bình thường',
          ]}
        />
      </Sec>

      <Sec title="JS vs TS — so sánh trực tiếp">
        <CodeTabs
          tabs={[
            { label: 'JavaScript', code: JS_CODE },
            { label: 'TypeScript', code: TS_CODE },
            { label: 'Type comparison', code: COMPARE_CODE },
          ]}
        />
      </Sec>

      <Sec title="Giải thích từng dòng (TS example)">
        <LineTable
          rows={[
            {
              line: 'L2',
              explanation: 'name: string — type annotation, compiler biết name phải là string',
            },
            { line: 'L2', explanation: ': string sau ) — khai báo return type của function' },
            { line: 'L7', explanation: 'greet(42) → Compile Error, không đợi runtime crash' },
          ]}
        />
      </Sec>

      <Sec title="Lợi ích thực tế">
        <div className="explain-grid">
          <div className="explain-box">
            <h4>Phát hiện lỗi sớm</h4>
            <p>
              Type error báo ngay trong IDE — không đợi deploy lên production mới crash. Tiết kiệm
              hàng giờ debug mỗi tuần.
            </p>
          </div>
          <div className="explain-box">
            <h4>IDE hỗ trợ tốt hơn</h4>
            <p>
              Autocomplete, go-to-definition, rename refactor — tất cả hoạt động chính xác vì IDE
              biết type của từng biến.
            </p>
          </div>
          <div className="explain-box">
            <h4>Code tự documenting</h4>
            <p>
              Đọc function signature{' '}
              <code className="ic">fetchUser(id: number): Promise&lt;User&gt;</code> là biết ngay
              input/output — không cần đọc implementation.
            </p>
          </div>
          <div className="explain-box">
            <h4>Refactor an toàn hơn</h4>
            <p>
              Rename một property → TypeScript báo tất cả nơi cần sửa. Không lo bỏ sót và break
              production.
            </p>
          </div>
        </div>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>TypeScript không thay thế JavaScript:</strong> TypeScript compile về JavaScript
          trước khi chạy. Hiểu JS tốt = hiểu TS tốt. TS chỉ thêm layer type checking ở compile-time.
        </Callout>
        <Callout type="warn">
          <strong>Type annotations bị xóa sau khi compile:</strong> Không có runtime type checking
          trong JavaScript. Nếu bạn nhận data từ API, phải tự validate — TypeScript không bảo vệ
          runtime.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Khai báo biến username: string, age: number, isLoggedIn: boolean. Thử gán sai kiểu và quan sát lỗi TypeScript báo gì.',
            },
            {
              level: 'medium',
              text: 'Viết hàm add(a: number, b: number): number trả về tổng. Gọi thử với string để xem compile error.',
            },
            {
              level: 'hard',
              text: 'Giải thích sự khác nhau giữa compile-time error và runtime error. Cho ví dụ một trường hợp TypeScript KHÔNG thể bắt lỗi (hint: data từ API).',
            },
          ]}
          hint="Dùng playground TypeScript tại typescriptlang.org/play để thử code mà không cần cài đặt. Gõ sai type và quan sát error message."
        />
      </Sec>
    </LessonCard>
  );
}

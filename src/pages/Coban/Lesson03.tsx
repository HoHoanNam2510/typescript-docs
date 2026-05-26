import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const PRIMITIVES_CODE = `// string — văn bản
let name: string = 'Alice';
let greeting: string = \`Hello, \${name}!\`; // template literal
let empty: string = '';

// number — số nguyên lẫn số thực (không có int/float riêng)
let age: number = 30;
let price: number = 9.99;
let hex: number = 0xff;    // 255
let binary: number = 0b1010; // 10
let octal: number = 0o17;    // 15

// boolean
let isActive: boolean = true;
let hasPermission: boolean = false;`;

const SPECIAL_PRIMITIVE = `// bigint — số nguyên rất lớn (> Number.MAX_SAFE_INTEGER)
let bigNum: bigint = 9007199254740991n;       // dùng suffix n
let computed: bigint = BigInt('12345678901234567890');
// Chú ý: không mix bigint với number trong arithmetic

// symbol — giá trị unique, thường dùng làm key
const id: symbol = Symbol('userId');
const anotherId: symbol = Symbol('userId');
console.log(id === anotherId); // false — mỗi Symbol là unique!

const obj = {
  [id]: 'secret value' // dùng symbol làm key
};

// null & undefined
let empty: null = null;
let notSet: undefined = undefined;`;

const STRICT_NULL = `// Với strictNullChecks: true (bật trong strict mode)
let name: string = null;      // Error! null không phải string
let name: string | null = null; // OK — phải dùng union type

// Ví dụ thực tế: nullable field
type User = {
  name: string;
  avatar: string | null; // có thể null nếu chưa upload ảnh
};

// Phân biệt null vs undefined
let a: null = null;           // giá trị "không có gì" (intentional)
let b: undefined = undefined; // biến chưa được gán giá trị (unintentional)`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson03({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-03"
      num="03"
      title="Simple Types — Kiểu Nguyên Thủy"
      desc="string, number, boolean, bigint, symbol, null, undefined"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="6 primitive types trong TypeScript">
        <Concept>
          <p>
            TypeScript có <strong>7 kiểu nguyên thủy</strong> (primitive types) — giống JavaScript
            nhưng được type-annotated. Đây là nền tảng của mọi type phức tạp hơn.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'string, number, boolean', code: PRIMITIVES_CODE },
            { label: 'bigint & symbol', code: SPECIAL_PRIMITIVE },
            { label: 'null & undefined', code: STRICT_NULL },
          ]}
        />
      </Sec>

      <Sec title="Tóm tắt 7 primitive types">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Ví dụ</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['string', '"hello", `template`', 'Văn bản, hỗ trợ template literal'],
              ['number', '42, 3.14, 0xff', 'Không phân biệt int/float'],
              ['boolean', 'true, false', 'Chỉ 2 giá trị'],
              ['bigint', '9007199254740991n', 'ES2020+, dùng suffix n'],
              ['symbol', 'Symbol("id")', 'Unique, immutable'],
              ['null', 'null', 'Intentional "no value"'],
              ['undefined', 'undefined', 'Biến chưa được gán'],
            ].map(([t, ex, note]) => (
              <tr key={t}>
                <td>{t}</td>
                <td>{ex}</td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>number không có int/float riêng:</strong> TypeScript (và JavaScript) chỉ có{' '}
          <code className="ic">number</code> — 64-bit floating point. Dùng{' '}
          <code className="ic">bigint</code> khi cần số nguyên rất lớn (ID từ database 64-bit,
          cryptography).
        </Callout>
        <Callout type="warn">
          <strong>null vs undefined trong strict mode:</strong> Với{' '}
          <code className="ic">strictNullChecks: true</code>, <code className="ic">null</code> và{' '}
          <code className="ic">undefined</code> không tương thích với các type khác. Phải dùng
          union: <code className="ic">string | null</code>. Đây là cài đặt bắt buộc trong code thực
          tế.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Khai báo thông tin sản phẩm: productName: string, price: number, inStock: boolean, sku: symbol. Gán giá trị hợp lệ cho từng biến.',
            },
            {
              level: 'medium',
              text: 'Viết hàm formatPrice(price: number, currency: string): string trả về "$9.99 USD". Đảm bảo return type đúng.',
            },
            {
              level: 'hard',
              text: 'Giải thích sự khác biệt giữa null và undefined. Khi nào dùng cái nào? Tạo type UserProfile với nullable fields hợp lý.',
            },
          ]}
          hint="Symbol('id') tạo một symbol unique. Template literal: `${price.toFixed(2)} ${currency}`. null = chủ động không có giá trị, undefined = chưa được gán."
        />
      </Sec>
    </LessonCard>
  );
}

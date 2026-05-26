import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const OBJ_BASIC = `// Inline type annotation (dùng cho một lần)
let user: { name: string; age: number; email: string } = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
};

// Optional properties — có thể thiếu khi khởi tạo
type Product = {
  id: number;
  name: string;
  description?: string; // có thể thiếu
  price: number;
};

const p1: Product = { id: 1, name: 'Phone', price: 999 };  // OK
const p2: Product = { id: 2, name: 'Laptop', description: 'Fast', price: 1999 }; // OK

// Truy cập optional property — trả về T | undefined
console.log(p1.description);         // undefined
console.log(p1.description?.length); // Optional chaining — an toàn`;

const READONLY_CODE = `// readonly properties — chỉ gán được một lần
type Config = {
  readonly host: string;
  readonly port: number;
  timeout: number; // mutable
};

const config: Config = { host: 'localhost', port: 3000, timeout: 5000 };
config.timeout = 10000; // OK — không readonly
config.host = 'prod';   // Error: Cannot assign to 'host' — it is read-only

// readonly trong constructor (class)
class DbConfig {
  readonly connectionString: string;
  constructor(url: string) {
    this.connectionString = url; // OK trong constructor
  }
}

const db = new DbConfig('mongodb://...');
db.connectionString = 'new-url'; // Error!`;

const NESTED_CODE = `// Nested object types
type Address = {
  street: string;
  city: string;
  country: string;
};

type Person = {
  name: string;
  age: number;
  address: Address;           // nested object
  contacts: {
    email: string;
    phone?: string;
  };                          // inline nested
  tags: string[];             // array property
  metadata?: Record<string, unknown>; // optional index signature
};

const alice: Person = {
  name: 'Alice',
  age: 30,
  address: { street: '123 Main St', city: 'NYC', country: 'US' },
  contacts: { email: 'alice@example.com' },
  tags: ['admin', 'user'],
};`;

const INDEX_SIG = `// Index Signatures — khi không biết trước số lượng keys
interface StringMap {
  [key: string]: string;
}

const translations: StringMap = {
  hello: 'xin chào',
  goodbye: 'tạm biệt',
};
translations.welcome = 'chào mừng'; // OK — bất kỳ string key nào

// Kết hợp specific và index signature
interface FlexibleObject {
  id: number;       // specific — phải có
  name: string;     // specific — phải có
  [key: string]: unknown; // extra keys — phải compatible với type trên
}

// Record<K, V> — cú pháp ngắn hơn cho index signature
type UserMap = Record<string, { name: string; age: number }>;
const users: UserMap = {
  alice: { name: 'Alice', age: 30 },
  bob: { name: 'Bob', age: 25 },
};`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson08({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-08"
      num="08"
      title="Object Types"
      desc="Inline types, optional/readonly properties, nested objects, index signatures"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Object types trong TypeScript">
        <Concept>
          <p>
            Object types định nghĩa <strong>shape</strong> của object — tên property, type, và tính
            optional/readonly. TypeScript kiểm tra từng property khi gán giá trị.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Basic & Optional', code: OBJ_BASIC },
            { label: 'Readonly', code: READONLY_CODE },
            { label: 'Nested objects', code: NESTED_CODE },
            { label: 'Index signatures', code: INDEX_SIG },
          ]}
        />
      </Sec>

      <Sec title="Tóm tắt các modifier">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Syntax</th>
              <th>Ý nghĩa</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['prop: T', 'Required property', 'name: string'],
              ['prop?: T', 'Optional — T | undefined', 'avatar?: string'],
              ['readonly prop: T', 'Chỉ đọc sau khi gán', 'readonly id: number'],
              ['[key: string]: T', 'Index signature — bất kỳ key nào', '[key: string]: unknown'],
            ].map(([syntax, meaning, example]) => (
              <tr key={syntax}>
                <td>{syntax}</td>
                <td>{meaning}</td>
                <td>{example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Inline type vs Type alias:</strong> Dùng inline type khi shape chỉ dùng một lần.
          Dùng <code className="ic">type</code> hoặc <code className="ic">interface</code> khi cần
          tái sử dụng ở nhiều nơi — bài sau sẽ học chi tiết.
        </Callout>
        <Callout type="warn">
          <strong>Index signature phải compatible:</strong> Khi có cả specific property lẫn index
          signature, type của specific property phải là subtype của index signature type. Thường
          dùng <code className="ic">unknown</code> cho index signature để tránh conflict.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo type BlogPost với: id: number, title: string, content: string, author (object lồng với name và email), tags: string[], publishedAt: Date | null.',
            },
            {
              level: 'medium',
              text: 'Viết function updateUser(user: User, changes: Partial<User>): User — merge changes vào user mà không mutate user gốc. Dùng spread operator.',
            },
            {
              level: 'hard',
              text: 'Tạo type DeepReadonly<T> — làm tất cả properties (kể cả nested) trở thành readonly. Gợi ý: mapped types + conditional types.',
            },
          ]}
          hint="Partial<User> làm tất cả fields optional. Spread: { ...user, ...changes }. DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }"
        />
      </Sec>
    </LessonCard>
  );
}

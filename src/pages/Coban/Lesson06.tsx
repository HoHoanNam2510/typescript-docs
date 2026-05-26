import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const ARRAY_BASIC = `// Hai cú pháp tương đương
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['Alice', 'Bob', 'Charlie'];

// Array of objects
let users: { id: number; name: string }[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// Union type array
let mixed: (string | number)[] = [1, 'two', 3, 'four'];

// 2D array
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
];

// Array của array
let nestedArrays: string[][] = [['a', 'b'], ['c', 'd']];`;

const READONLY_CODE = `// readonly — không thể mutate sau khi tạo
const readonlyArr: readonly number[] = [1, 2, 3];
readonlyArr.push(4);    // Error: Property 'push' does not exist on 'readonly number[]'
readonlyArr[0] = 10;    // Error: Index signature only permits reading

// ReadonlyArray<T> — cú pháp generic tương đương
const fruits: ReadonlyArray<string> = ['apple', 'banana'];

// Thực tế: function không nên mutate params
function processItems(items: readonly string[]): void {
  items.forEach(item => console.log(item)); // OK — chỉ đọc
  items.push('new item'); // Error! — bảo vệ caller's array
}

// Chú ý: readonly chỉ là compile-time, không phải Object.freeze
const arr: readonly number[] = [1, 2, 3];
(arr as number[]).push(4); // TypeScript cho phép nếu cast — đừng làm vậy`;

const ARRAY_METHODS = `const nums: number[] = [3, 1, 4, 1, 5, 9, 2, 6];

// map — trả về T[]
const doubled: number[] = nums.map(n => n * 2);

// filter — trả về T[]
const evens: number[] = nums.filter(n => n % 2 === 0);

// find — trả về T | undefined (không phải T!)
const found: number | undefined = nums.find(n => n > 4);

// reduce
const sum: number = nums.reduce((acc, n) => acc + n, 0);

// some / every
const hasOdd: boolean = nums.some(n => n % 2 !== 0);
const allPositive: boolean = nums.every(n => n > 0);

// flat — với nested arrays
const nested: number[][] = [[1, 2], [3, 4]];
const flat: number[] = nested.flat();

// includes — type-safe
nums.includes(5); // OK — number
nums.includes('5'); // Error — string không phải number`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson06({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-06"
      num="06"
      title="Arrays & Readonly Arrays"
      desc="Type[] vs Array<T>, readonly arrays, type-safe array methods"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Khai báo array trong TypeScript">
        <Concept>
          <p>
            TypeScript có <strong>2 cú pháp</strong> khai báo array tương đương:{' '}
            <code className="ic">Type[]</code> và <code className="ic">Array&lt;Type&gt;</code>. Cả
            hai đều hoạt động giống nhau — chọn một và dùng nhất quán.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Array cơ bản', code: ARRAY_BASIC },
            { label: 'readonly arrays', code: READONLY_CODE },
            { label: 'Array methods', code: ARRAY_METHODS },
          ]}
        />
      </Sec>

      <Sec title="Type[] vs Array<T> — khi nào dùng cái nào?">
        <div className="explain-grid">
          <div className="explain-box">
            <h4>Type[] — phổ biến hơn</h4>
            <p>
              <code className="ic">number[]</code>, <code className="ic">string[]</code> — ngắn gọn,
              dễ đọc. Dùng cho hầu hết trường hợp.
            </p>
          </div>
          <div className="explain-box">
            <h4>Array&lt;T&gt; — cho complex types</h4>
            <p>
              <code className="ic">Array&lt;string | number&gt;</code> — rõ ràng hơn khi union type
              dài. Bắt buộc khi dùng với generic.
            </p>
          </div>
          <div className="explain-box">
            <h4>readonly Type[]</h4>
            <p>Ngăn mutation. Dùng cho function params để không mutate array của caller.</p>
          </div>
          <div className="explain-box">
            <h4>find() trả về T | undefined</h4>
            <p>Không phải T! Phải handle undefined case. Đây là điểm hay bị quên trong code.</p>
          </div>
        </div>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>readonly cho function parameters:</strong> Khi function nhận array và không cần
          mutate, dùng <code className="ic">readonly T[]</code>. Điều này đảm bảo function không vô
          tình thay đổi array của người gọi, giúp code an toàn hơn.
        </Callout>
        <Callout type="warn">
          <strong>find() trả về T | undefined:</strong> <code className="ic">arr.find()</code> trả
          về <code className="ic">T | undefined</code>, không phải <code className="ic">T</code>.
          Luôn handle trường hợp undefined để tránh runtime error.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Khai báo products: { name: string; price: number; inStock: boolean }[] với 3 sản phẩm mẫu. Dùng .filter() để lấy sản phẩm đang có hàng.',
            },
            {
              level: 'medium',
              text: 'Viết hàm getExpensive(products: readonly Product[], minPrice: number): Product[] trả về mảng sản phẩm giá trên minPrice. Dùng readonly cho parameter.',
            },
            {
              level: 'hard',
              text: 'Viết hàm groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> — nhóm array theo một property. Ví dụ: groupBy(users, "role").',
            },
          ]}
          hint="keyof T giới hạn key là property hợp lệ của T. Record<string, T[]> là object với string keys và T[] values. readonly ngăn mutation trong function body."
        />
      </Sec>
    </LessonCard>
  );
}

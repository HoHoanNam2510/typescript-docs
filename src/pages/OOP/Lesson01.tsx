import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const CLASS_BASICS = `// Class với typed properties
class Animal {
  name: string;
  private _age: number;
  readonly species: string;

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this._age = age;
    this.species = species;
  }

  describe(): string {
    return \`\${this.name} là \${this.species}, \${this._age} tuổi\`;
  }
}

const cat = new Animal('Mimi', 3, 'cat');
console.log(cat.describe()); // "Mimi là cat, 3 tuổi"
console.log(cat.name);       // "Mimi"
// cat._age                  // Error — private
// cat.species = 'dog';      // Error — readonly

// TypeScript tự infer type từ class
type AnimalType = typeof Animal;      // constructor type
type AnimalInstance = InstanceType<typeof Animal>; // instance type`;

const PARAM_PROPS = `// Parameter Properties — shorthand khai báo + gán trong constructor
class Point {
  constructor(
    public x: number,
    public y: number,
    private label: string = 'point'
  ) {}
  // Tự động: this.x = x; this.y = y; this.label = label;

  toString(): string {
    return \`\${this.label}(\${this.x}, \${this.y})\`;
  }

  distanceTo(other: Point): number {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2);
  }
}

const p1 = new Point(0, 0);
const p2 = new Point(3, 4, 'B');
console.log(p1.toString());          // "point(0, 0)"
console.log(p1.distanceTo(p2));      // 5

// Kết hợp parameter properties và regular properties
class Config {
  readonly createdAt = new Date(); // class field

  constructor(
    public host: string,
    public port: number,
    private readonly apiKey: string
  ) {}
}`;

const GETTERS_SETTERS = `// Getters & Setters — validation và computed properties
class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  // Getter — truy cập như property
  get celsius(): number {
    return this._celsius;
  }

  // Setter — validate trước khi gán
  set celsius(value: number) {
    if (value < -273.15) throw new Error('Dưới 0 tuyệt đối!');
    this._celsius = value;
  }

  // Computed getter — không có setter
  get fahrenheit(): number {
    return this._celsius * 9 / 5 + 32;
  }

  get kelvin(): number {
    return this._celsius + 273.15;
  }
}

const temp = new Temperature(100);
console.log(temp.celsius);    // 100
console.log(temp.fahrenheit); // 212
console.log(temp.kelvin);     // 373.15

temp.celsius = -300; // Error thrown!`;

const READONLY_FIELDS = `// readonly fields — chỉ gán trong constructor
class Product {
  readonly id: string;
  readonly createdAt: Date;
  name: string;
  price: number;

  constructor(name: string, price: number) {
    this.id = crypto.randomUUID(); // gán 1 lần trong constructor
    this.createdAt = new Date();
    this.name = name;
    this.price = price;
  }

  updatePrice(newPrice: number): void {
    this.price = newPrice;          // OK — không readonly
    // this.id = 'new-id';         // Error — readonly sau constructor
  }
}

// readonly kết hợp với parameter properties
class Coordinate {
  constructor(
    public readonly lat: number,
    public readonly lng: number
  ) {}

  distanceTo(other: Coordinate): number {
    const R = 6371;
    const dLat = ((other.lat - this.lat) * Math.PI) / 180;
    const dLng = ((other.lng - this.lng) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos((this.lat * Math.PI) / 180) *
      Math.cos((other.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson01({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-01"
      num="01"
      title="Classes Cơ Bản"
      desc="Typed properties, constructor, parameter properties, getters/setters, readonly"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Classes trong TypeScript">
        <Concept>
          <p>
            TypeScript mở rộng ES6 classes với <strong>type annotations</strong>,{' '}
            <strong>access modifiers</strong>, và <strong>readonly</strong>. Compiler kiểm tra kiểu
            tại compile-time — không còn runtime surprises từ sai tên property hay sai type.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Class cơ bản', code: CLASS_BASICS },
            { label: 'Parameter Properties', code: PARAM_PROPS },
            { label: 'Getters & Setters', code: GETTERS_SETTERS },
            { label: 'readonly fields', code: READONLY_FIELDS },
          ]}
        />
      </Sec>

      <Sec title="Các thành phần của một Class">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Thành phần</th>
              <th>Cú pháp</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Property', 'name: string', 'Khai báo ở class body, gán trong constructor'],
              [
                'Parameter property',
                'constructor(public x: number)',
                'Shorthand — tự khai báo + gán',
              ],
              ['readonly property', 'readonly id: string', 'Chỉ gán trong constructor'],
              ['Getter', 'get value(): number', 'Dùng như property, không gọi như method'],
              ['Setter', 'set value(v: number)', 'Validate trước khi gán'],
              ['Method', 'describe(): string', 'Function thuộc class'],
              ['Static method', 'static create(): Cls', 'Gọi qua class, không qua instance'],
            ].map(([comp, syntax, note]) => (
              <tr key={comp}>
                <td>{comp}</td>
                <td>
                  <code>{syntax}</code>
                </td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Parameter properties = shorthand:</strong>{' '}
          <code className="ic">constructor(public x: number)</code> tương đương với khai báo{' '}
          <code className="ic">x: number</code> ở class body và{' '}
          <code className="ic">this.x = x</code> trong constructor body. Dùng khi không cần logic
          phức tạp trong constructor.
        </Callout>
        <Callout type="warn">
          <strong>Getter không có setter = readonly computed:</strong> Nếu chỉ định{' '}
          <code className="ic">get fahrenheit()</code> mà không có <code className="ic">set</code>,
          TypeScript sẽ tự động suy ra property đó là readonly. Gán vào sẽ báo lỗi compile-time.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo class Rectangle với width và height (parameter properties). Thêm getter area và perimeter. Thêm method scale(factor: number): Rectangle trả về hình chữ nhật mới.',
            },
            {
              level: 'medium',
              text: 'Tạo class Counter với private _count = 0. Thêm getter count, method increment(by = 1), decrement(by = 1), reset(). Đảm bảo count không âm (set về 0 nếu decrement quá).',
            },
            {
              level: 'hard',
              text: 'Tạo class Money với amount: number và currency: string (readonly). Thêm add(other: Money): Money (phải cùng currency), subtract, multiply(factor: number), toString(). Throw error nếu currency khác nhau.',
            },
          ]}
          hint="Rectangle: getter area = this.width * this.height. Counter: set trong setter hoặc method. Money: check currency trước khi add/subtract, trả về new Money(...)."
        />
      </Sec>
    </LessonCard>
  );
}

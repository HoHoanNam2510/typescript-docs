import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const BRANDED_TYPES = `// Branded / Opaque types — nominal typing trong TypeScript
// TypeScript dùng structural typing — hai types có cùng shape là tương đương
// Branded types thêm "tag" để phân biệt chúng

// Basic brand pattern
type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId    = Brand<string, 'UserId'>;
type ProductId = Brand<string, 'ProductId'>;
type Email     = Brand<string, 'Email'>;

// Factory functions — cách duy nhất tạo branded value
function userId(id: string): UserId {
  if (!id.trim()) throw new Error('UserId cannot be empty');
  return id as UserId;
}

function email(value: string): Email {
  if (!/^[^@]+@[^@]+\\.[^@]+$/.test(value)) {
    throw new Error(\`Invalid email: \${value}\`);
  }
  return value as Email;
}

// Branded types ngăn nhầm lẫn
function findUser(id: UserId): void { /* ... */ }
function findProduct(id: ProductId): void { /* ... */ }

const uid = userId('user-123');
const pid = 'product-456' as ProductId;

findUser(uid);    // OK
findUser(pid);    // Error — ProductId không phải UserId!
findUser('abc');  // Error — string không phải UserId!

// Validated string types
type NonEmptyString = Brand<string, 'NonEmpty'>;
type PositiveNumber = Brand<number, 'Positive'>;
type Percentage    = Brand<number, 'Percentage'>; // 0-100

function percentage(n: number): Percentage {
  if (n < 0 || n > 100) throw new RangeError('Percentage must be 0-100');
  return n as Percentage;
}`;

const STRUCTURAL_NOMINAL = `// Structural vs Nominal typing

// Structural (TypeScript default) — shape matters
type Point2D = { x: number; y: number };
type Vector2D = { x: number; y: number };

const p: Point2D = { x: 1, y: 2 };
const v: Vector2D = p; // OK — cùng shape

// Vấn đề: nhầm lẫn giữa các "loại" khác nhau
function translate(point: Point2D, vector: Vector2D): Point2D {
  return { x: point.x + vector.x, y: point.y + vector.y };
}

// Compiler không catch nếu swap args — cùng shape
// translate(myVector, myPoint); // Runtime wrong, compile OK

// Nominal với branded types — fix vấn đề
type BrandedPoint  = Brand<{ x: number; y: number }, 'Point'>;
type BrandedVector = Brand<{ x: number; y: number }, 'Vector'>;

function brandedTranslate(point: BrandedPoint, vector: BrandedVector): BrandedPoint {
  return { x: point.x + vector.x, y: point.y + vector.y } as BrandedPoint;
}

// Phantom types — brand không có runtime value
type Celsius    = Brand<number, 'Celsius'>;
type Fahrenheit = Brand<number, 'Fahrenheit'>;

function toFahrenheit(c: Celsius): Fahrenheit {
  return (c * 9/5 + 32) as Fahrenheit;
}

const temp: Celsius = 100 as Celsius;
const converted: Fahrenheit = toFahrenheit(temp);
// toFahrenheit(converted); // Error — Fahrenheit không phải Celsius

type Brand<T, B extends string> = T & { readonly __brand: B };`;

const BUILDER_PATTERN = `// Type-safe Builder pattern — phức tạp hơn OOP builder

// State machine builder — track state trong type
type BuilderState = {
  hasName: boolean;
  hasEmail: boolean;
  hasRole: boolean;
};

type UserBuilder<State extends BuilderState = { hasName: false; hasEmail: false; hasRole: false }> = {
  setName(name: string): UserBuilder<State & { hasName: true }>;
  setEmail(email: string): UserBuilder<State & { hasEmail: true }>;
  setRole(role: string): UserBuilder<State & { hasRole: true }>;
} & (State extends { hasName: true; hasEmail: true; hasRole: true }
  ? { build(): { name: string; email: string; role: string } }
  : Record<string, never>);

// Thực tế: dùng class-based approach đơn giản hơn
class TypedBuilder<T extends object = Record<never, never>> {
  private data: Partial<T> = {};

  set<K extends string, V>(key: K, value: V): TypedBuilder<T & Record<K, V>> {
    (this.data as Record<string, unknown>)[key] = value;
    return this as unknown as TypedBuilder<T & Record<K, V>>;
  }

  build(): T {
    return { ...this.data } as T;
  }
}

const user = new TypedBuilder()
  .set('name', 'Alice')
  .set('age', 30)
  .set('email', 'alice@example.com')
  .build();
// user: { name: string; age: number; email: string }

console.log(user.name);  // "Alice"
console.log(user.age);   // 30`;

const TYPE_ALGEBRA = `// Type-level programming tricks

// IsEqual — check nếu hai types hoàn toàn bằng nhau
type IsEqual<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2)
    ? true
    : false;

type E1 = IsEqual<string, string>;          // true
type E2 = IsEqual<string, number>;          // false
type E3 = IsEqual<{ a: string }, { a: string }>;   // true

// Prettify — flatten intersection types để dễ đọc
type Prettify<T> = { [K in keyof T]: T[K] } & Record<never, never>;

type Complex = { a: string } & { b: number } & { c: boolean };
type Simple = Prettify<Complex>; // { a: string; b: number; c: boolean }

// UnionToIntersection
type UnionToIntersection<U> =
  (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void
    ? I : never;

type UI = UnionToIntersection<{ a: string } | { b: number }>;
// { a: string } & { b: number }

// Strict Omit — Omit với exact key checking
type StrictOmit<T, K extends keyof T> = Omit<T, K>;

// NonEmptyArray
type NonEmptyArray<T> = [T, ...T[]];
function processItems<T>(items: NonEmptyArray<T>): T {
  return items[0]; // guaranteed non-undefined
}

// Exact type — ngăn excess properties (structural widening)
type Exact<T, Shape extends T> = Shape & {
  [K in Exclude<keyof Shape, keyof T>]: never;
};

// XOR — chỉ một trong hai type
type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };
type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

type OnlyA = XOR<{ a: string }, { b: number }>;
const x1: OnlyA = { a: 'hello' };     // OK
const x2: OnlyA = { b: 42 };          // OK
// const x3: OnlyA = { a: 'hi', b: 1 }; // Error — không thể có cả hai`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson10({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="nc-10"
      num="10"
      title="Advanced Type Patterns"
      desc="Branded types, nominal typing, type-safe builder, IsEqual, XOR, NonEmptyArray"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Advanced Type Patterns">
        <Concept>
          <p>
            Bài tổng kết: các pattern type-level nâng cao nhất trong TypeScript.{' '}
            <strong>Branded types</strong> mô phỏng nominal typing để ngăn nhầm lẫn primitive
            values. <strong>Phantom types</strong> track semantic information (Celsius vs
            Fahrenheit). <strong>Type algebra</strong> (XOR, IsEqual, Prettify) là những building
            blocks cho type-safe library design.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Branded types', code: BRANDED_TYPES },
            { label: 'Structural vs Nominal', code: STRUCTURAL_NOMINAL },
            { label: 'Type-safe Builder', code: BUILDER_PATTERN },
            { label: 'Type algebra', code: TYPE_ALGEBRA },
          ]}
        />
      </Sec>

      <Sec title="Advanced type patterns cheat sheet">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Định nghĩa</th>
              <th>Giải quyết vấn đề</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Brand<T,B>', 'T & { __brand: B }', 'Nominal typing cho primitives'],
              [
                'Phantom type',
                'number & { _celsius: void }',
                'Track semantic info không có runtime cost',
              ],
              ['NonEmptyArray<T>', '[T, ...T[]]', 'Đảm bảo array không rỗng'],
              ['IsEqual<X,Y>', 'Conditional trick', 'Check hai types bằng nhau'],
              ['Prettify<T>', '{ [K in keyof T]: T[K] }', 'Flatten intersection để đọc dễ'],
              ['XOR<T,U>', 'Without trick', 'Exactly one of two object shapes'],
              [
                'UnionToIntersection<U>',
                'Contravariant position trick',
                'Merge union thành intersection',
              ],
            ].map(([pattern, def, problem]) => (
              <tr key={pattern}>
                <td>
                  <code>{pattern}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{def}</code>
                </td>
                <td>{problem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Branded types chỉ ở compile-time:</strong> Brand không có giá trị runtime —{' '}
          <code className="ic">__brand</code> không tồn tại trong JS output. Chỉ cần viết factory
          function với validation logic. TypeScript sẽ enforce tại compile-time.
        </Callout>
        <Callout type="warn">
          <strong>Type algebra nâng cao — đọc hiểu, không cần nhớ:</strong> Patterns như
          UnionToIntersection hay IsEqual rất tricky, dựa vào covariance/contravariance internals.
          Trong phỏng vấn, hiểu ý tưởng và khi nào dùng là đủ — không cần implement từ đầu.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo branded types: Email, PhoneNumber, URL, UUID. Viết factory functions với validation cho từng type. Viết function sendEmail(to: Email, subject: string, body: string) — đảm bảo chỉ accept Email không phải string thường.',
            },
            {
              level: 'medium',
              text: 'Implement ValidatedForm<T> — wrap một object type T sao cho sau khi validate thành công, giá trị trả về có type T (không phải Partial<T>). Dùng branded type ValidatedForm<T> = T & { __validated: true } với validate function.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe SQL query builder: sql`SELECT ${cols} FROM ${table} WHERE ${condition}` — template literal function trả về typed Query<Result>. cols là keyof T[], table là TableName, result là Pick<T, cols[number]>[].',
            },
          ]}
          hint="Email brand: type Email = string & { __brand: 'Email' }. ValidatedForm: validate(data: unknown, schema): ValidatedForm<T> — cast sau validation. SQL builder: tagged template literal function với generic inference."
        />
      </Sec>
    </LessonCard>
  );
}

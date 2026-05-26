import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const EXTENDS_SUPER = `// extends — kế thừa class, super — gọi constructor/method của parent

class Animal {
  constructor(
    public name: string,
    protected sound: string
  ) {}

  speak(): string {
    return \`\${this.name} says \${this.sound}\`;
  }

  toString(): string {
    return \`Animal(\${this.name})\`;
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name, 'woof'); // phải gọi super() trước khi dùng this
  }

  fetch(item: string): string {
    return \`\${this.name} fetches the \${item}!\`;
  }
}

class Cat extends Animal {
  constructor(name: string, private indoor: boolean) {
    super(name, 'meow');
  }

  purr(): string {
    return \`\${this.name} purrs...\`;
  }
}

const dog = new Dog('Rex', 'Labrador');
console.log(dog.speak());        // "Rex says woof"
console.log(dog.fetch('ball'));  // "Rex fetches the ball!"
console.log(dog instanceof Animal); // true
console.log(dog instanceof Dog);    // true`;

const METHOD_OVERRIDE = `// Method overriding — subclass cung cấp implementation mới

class Shape {
  getArea(): number {
    return 0;
  }

  describe(): string {
    return \`Shape với area = \${this.getArea().toFixed(2)}\`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  // Override getArea — Circle có cách tính riêng
  override getArea(): number { // TS 4.3+: keyword override
    return Math.PI * this.radius ** 2;
  }

  // Override describe — thêm thông tin
  override describe(): string {
    return \`Circle(r=\${this.radius}): \${super.describe()}\`; // gọi parent
  }
}

class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number
  ) {
    super();
  }

  override getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach(s => console.log(s.describe()));
// "Circle(r=5): Shape với area = 78.54"
// "Shape với area = 24.00"`;

const MULTILEVEL = `// Multi-level inheritance — chain của extends

class LivingThing {
  protected isAlive = true;

  breathe(): string {
    return 'breathing...';
  }
}

class Animal extends LivingThing {
  constructor(
    public name: string,
    protected legs: number
  ) {
    super();
  }

  move(): string {
    return \`\${this.name} moves on \${this.legs} legs\`;
  }
}

class Mammal extends Animal {
  protected warmBlooded = true;

  nurseYoung(): string {
    return \`\${this.name} nurses young\`;
  }
}

class Dog extends Mammal {
  constructor(name: string) {
    super(name, 4);
  }

  bark(): string {
    return 'Woof!';
  }
}

class Bird extends Animal {
  constructor(name: string, public canFly: boolean) {
    super(name, 2);
  }

  sing(): string {
    return \`\${this.name} sings\`;
  }
}

const dog = new Dog('Buddy');
dog.breathe();    // từ LivingThing
dog.move();       // từ Animal
dog.nurseYoung(); // từ Mammal
dog.bark();       // của Dog`;

const POLYMORPHISM = `// Polymorphism — cùng interface, nhiều implementations

abstract class PaymentMethod {
  abstract processPayment(amount: number): Promise<boolean>;
  abstract getName(): string;

  async pay(amount: number): Promise<string> {
    const success = await this.processPayment(amount);
    return success
      ? \`\${this.getName()}: Thanh toán \${amount} thành công\`
      : \`\${this.getName()}: Thanh toán thất bại\`;
  }
}

class CreditCard extends PaymentMethod {
  constructor(private cardNumber: string) {
    super();
  }

  getName(): string { return 'Credit Card'; }

  async processPayment(amount: number): Promise<boolean> {
    console.log(\`Charging \${amount} to card ending \${this.cardNumber.slice(-4)}\`);
    return amount < 10000; // giả lập limit
  }
}

class Momo extends PaymentMethod {
  constructor(private phone: string) {
    super();
  }

  getName(): string { return 'MoMo'; }

  async processPayment(amount: number): Promise<boolean> {
    console.log(\`MoMo request to \${this.phone}: \${amount}\`);
    return true;
  }
}

// Polymorphism: xử lý chung qua PaymentMethod type
async function checkout(method: PaymentMethod, total: number) {
  const result = await method.pay(total);
  console.log(result);
}

await checkout(new CreditCard('4111111111111234'), 500);
await checkout(new Momo('0901234567'), 150000);`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson03({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-03"
      num="03"
      title="Inheritance & Polymorphism"
      desc="extends, super(), method overriding với override keyword, multi-level hierarchy"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Inheritance trong TypeScript">
        <Concept>
          <p>
            TypeScript dùng <code className="ic">extends</code> để kế thừa class,{' '}
            <code className="ic">super()</code> để gọi constructor parent. TS 4.3+ thêm keyword{' '}
            <code className="ic">override</code> để đánh dấu method đang override — compiler báo lỗi
            nếu method đó không tồn tại ở parent class.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'extends & super', code: EXTENDS_SUPER },
            { label: 'Method overriding', code: METHOD_OVERRIDE },
            { label: 'Multi-level hierarchy', code: MULTILEVEL },
            { label: 'Polymorphism', code: POLYMORPHISM },
          ]}
        />
      </Sec>

      <Sec title="Quy tắc kế thừa">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Quy tắc</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'super() bắt buộc',
                'Subclass phải gọi super() trước khi dùng this trong constructor',
              ],
              [
                'override keyword',
                'TS 4.3+: đánh dấu tường minh, compiler check method tồn tại ở parent',
              ],
              ['instanceof', 'dog instanceof Animal → true (cả chain đều match)'],
              ['Single inheritance', 'TS chỉ extends 1 class — dùng interface/mixin cho multiple'],
              ['Covariant return', 'Subclass có thể return type hẹp hơn parent (subtype)'],
              ['super.method()', 'Gọi parent implementation từ bên trong override'],
            ].map(([rule, detail]) => (
              <tr key={rule}>
                <td>
                  <strong>{rule}</strong>
                </td>
                <td>{detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Dùng override keyword:</strong> Thêm{' '}
          <code className="ic">noImplicitOverride: true</code> vào tsconfig để bắt buộc dùng{' '}
          <code className="ic">override</code> khi override method. Điều này ngăn vô tình tạo method
          mới thay vì override (hay gặp khi rename parent method).
        </Callout>
        <Callout type="warn">
          <strong>Fragile base class problem:</strong> Thay đổi parent class có thể phá vỡ
          subclasses. Hạn chế inheritance sâu — thường chỉ 2-3 level. Ưu tiên composition over
          inheritance khi không cần polymorphism.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo Vehicle → Car, Motorcycle. Vehicle có make, model, year (constructor). Car thêm doors: number. Motorcycle thêm type: "sport" | "cruiser". Cả hai override toString().',
            },
            {
              level: 'medium',
              text: 'Tạo Employee → Manager, Developer. Employee có name, salary (protected). Manager có reports: Employee[]. Developer có skills: string[]. Manager.getSalary() = base + 10% bonus. Override toString() cho cả hai.',
            },
            {
              level: 'hard',
              text: 'Thiết kế Animal → Mammal → Dog/Cat, Animal → Bird → Eagle. Thêm interface IHuntable { hunt(): string } cho Dog và Eagle. Viết function processAnimals(animals: Animal[]) xử lý polymorphically.',
            },
          ]}
          hint="Vehicle: super(make, model, year). Manager: getSalary() { return this.salary * 1.1; }. IHuntable: instanceof check hoặc type guard để detect."
        />
      </Sec>
    </LessonCard>
  );
}

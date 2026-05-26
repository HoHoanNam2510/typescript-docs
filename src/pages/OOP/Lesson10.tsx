import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const SRP_OCP = `// S — Single Responsibility Principle
// Mỗi class chỉ có 1 lý do để thay đổi

// ❌ Vi phạm SRP — class làm quá nhiều việc
class UserBad {
  saveToDatabase(user: unknown): void { /* DB logic */ }
  sendWelcomeEmail(email: string): void { /* Email logic */ }
  generateReport(): string { /* Report logic */ }
}

// ✓ Đúng SRP — mỗi class 1 responsibility
class UserRepository {
  save(user: User): Promise<User> { return Promise.resolve(user); }
  findById(id: string): Promise<User | null> { return Promise.resolve(null); }
}

class EmailService {
  sendWelcome(email: string, name: string): Promise<void> {
    console.log(\`Sending welcome to \${email}\`);
    return Promise.resolve();
  }
}

class UserService {
  constructor(
    private repo: UserRepository,
    private email: EmailService
  ) {}

  async register(name: string, email: string): Promise<User> {
    const user = await this.repo.save({ id: crypto.randomUUID(), name, email });
    await this.email.sendWelcome(email, name);
    return user;
  }
}

// O — Open/Closed Principle
// Open for extension, closed for modification
interface Discount {
  apply(price: number): number;
}

class PercentDiscount implements Discount {
  constructor(private percent: number) {}
  apply(price: number): number { return price * (1 - this.percent / 100); }
}

class FixedDiscount implements Discount {
  constructor(private amount: number) {}
  apply(price: number): number { return Math.max(0, price - this.amount); }
}

// Thêm discount mới không cần sửa class này
class Cart {
  total(items: number[], discount?: Discount): number {
    const sum = items.reduce((a, b) => a + b, 0);
    return discount ? discount.apply(sum) : sum;
  }
}`;

const LSP_ISP = `// L — Liskov Substitution Principle
// Subclass phải dùng được thay thế parent mà không phá vỡ behavior

// ❌ Vi phạm LSP — Square extends Rectangle nhưng vi phạm expectation
class RectangleBad {
  constructor(protected width: number, protected height: number) {}
  setWidth(w: number)  { this.width = w; }
  setHeight(h: number) { this.height = h; }
  getArea(): number { return this.width * this.height; }
}

class SquareBad extends RectangleBad {
  setWidth(w: number)  { this.width = this.height = w; } // vi phạm!
  setHeight(h: number) { this.width = this.height = h; } // vi phạm!
}

// ✓ Đúng LSP — dùng interface, không ép hierarchy sai
interface IShape { getArea(): number; }
class Rectangle implements IShape {
  constructor(private w: number, private h: number) {}
  getArea(): number { return this.w * this.h; }
}
class Square implements IShape {
  constructor(private side: number) {}
  getArea(): number { return this.side ** 2; }
}

// I — Interface Segregation Principle
// Interface nhỏ, tập trung — không ép implement những gì không dùng

// ❌ Quá lớn — không phải ai cũng cần tất cả
interface IWorkerBad {
  work(): void;
  eat(): void;
  sleep(): void;
}

// ✓ Tách nhỏ
interface IWorkable { work(): void; }
interface IEatable  { eat(): void; }
interface ISleepable { sleep(): void; }

class Human implements IWorkable, IEatable, ISleepable {
  work()  { console.log('Working...'); }
  eat()   { console.log('Eating...');  }
  sleep() { console.log('Sleeping...'); }
}

class Robot implements IWorkable {
  work() { console.log('Processing...'); }
  // Không cần eat() hay sleep()
}`;

const DIP = `// D — Dependency Inversion Principle
// High-level modules không phụ thuộc low-level details
// Cả hai phụ thuộc vào abstractions (interfaces)

// ❌ Vi phạm DIP — UserService phụ thuộc cụ thể vào MySQLDatabase
class MySQLDatabase {
  save(data: unknown): void { console.log('Saving to MySQL:', data); }
}

class UserServiceBad {
  private db = new MySQLDatabase(); // hard dependency!
  createUser(name: string): void { this.db.save({ name }); }
}

// ✓ Đúng DIP — phụ thuộc vào interface, inject qua constructor

// Abstraction
interface IDatabase {
  save<T>(data: T): Promise<void>;
  findById<T>(id: string): Promise<T | null>;
}

// Low-level implementations
class MySQLDb implements IDatabase {
  async save<T>(data: T): Promise<void> {
    console.log('MySQL save:', data);
  }
  async findById<T>(id: string): Promise<T | null> {
    return null;
  }
}

class MongoDb implements IDatabase {
  async save<T>(data: T): Promise<void> {
    console.log('MongoDB save:', data);
  }
  async findById<T>(id: string): Promise<T | null> {
    return null;
  }
}

// High-level module — không biết MySQL hay MongoDB
class UserServiceGood {
  constructor(private db: IDatabase) {} // inject abstraction

  async createUser(name: string): Promise<void> {
    await this.db.save({ id: crypto.randomUUID(), name });
  }
}

// Swap implementation tại điểm composition
const service = new UserServiceGood(new MySQLDb());
// hoặc:
const service2 = new UserServiceGood(new MongoDb());`;

const SOLID_FULL = `// Ví dụ hoàn chỉnh áp dụng tất cả SOLID

// Abstractions (I)
interface INotifier {
  notify(recipient: string, message: string): Promise<void>;
}

interface IOrderRepository {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
}

// Domain
interface Order {
  id: string;
  userId: string;
  items: Array<{ productId: string; qty: number; price: number }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped';
}

// Implementations (O — extendable without modifying above)
class EmailNotifier implements INotifier {
  async notify(recipient: string, message: string): Promise<void> {
    console.log(\`Email to \${recipient}: \${message}\`);
  }
}

class SmsNotifier implements INotifier {
  async notify(recipient: string, message: string): Promise<void> {
    console.log(\`SMS to \${recipient}: \${message}\`);
  }
}

class InMemoryOrderRepo implements IOrderRepository {
  private orders = new Map<string, Order>();
  async save(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }
  async findById(id: string): Promise<Order | null> {
    return this.orders.get(id) ?? null;
  }
}

// Service (S — chỉ xử lý order logic, D — inject dependencies)
class OrderService {
  constructor(
    private repo: IOrderRepository,
    private notifiers: INotifier[] // nhiều notifiers (ISP + O)
  ) {}

  async placeOrder(userId: string, items: Order['items']): Promise<Order> {
    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = await this.repo.save({
      id: crypto.randomUUID(),
      userId, items, total,
      status: 'pending',
    });

    // Notify all channels — extensible (O)
    await Promise.all(
      this.notifiers.map(n => n.notify(userId, \`Order \${order.id} placed!\`))
    );
    return order;
  }
}

// Composition root
const orderService = new OrderService(
  new InMemoryOrderRepo(),
  [new EmailNotifier(), new SmsNotifier()]
);`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson10({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-10"
      num="10"
      title="SOLID Principles"
      desc="SRP, OCP, LSP, ISP, DIP — 5 nguyên tắc thiết kế OOP với TypeScript"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="SOLID Principles">
        <Concept>
          <p>
            SOLID là 5 nguyên tắc thiết kế OOP giúp code dễ maintain, extend, và test. TypeScript's
            type system (interfaces, generics, access modifiers) hỗ trợ áp dụng SOLID tốt hơn nhiều
            so với JavaScript thuần.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'S & O — SRP / OCP', code: SRP_OCP },
            { label: 'L & I — LSP / ISP', code: LSP_ISP },
            { label: 'D — DIP', code: DIP },
            { label: 'Full SOLID example', code: SOLID_FULL },
          ]}
        />
      </Sec>

      <Sec title="Tóm tắt SOLID">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Nguyên tắc</th>
              <th>Tên đầy đủ</th>
              <th>Ý nghĩa</th>
              <th>TypeScript tool</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['S', 'Single Responsibility', 'Mỗi class 1 lý do thay đổi', 'Class phân tách'],
              ['O', 'Open/Closed', 'Mở rộng không sửa code cũ', 'Interface + implements'],
              [
                'L',
                'Liskov Substitution',
                'Subclass thay thế được parent',
                'override, type checking',
              ],
              ['I', 'Interface Segregation', 'Interface nhỏ, tập trung', 'Nhiều interface nhỏ'],
              [
                'D',
                'Dependency Inversion',
                'Phụ thuộc abstraction, không detail',
                'Constructor injection',
              ],
            ].map(([abbr, name, meaning, tool]) => (
              <tr key={abbr}>
                <td>
                  <strong>{abbr}</strong>
                </td>
                <td>{name}</td>
                <td>{meaning}</td>
                <td>
                  <code>{tool}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>DIP = Dependency Injection:</strong> DIP nói về direction của dependency (phụ
          thuộc vào abstraction). DI (Dependency Injection) là kỹ thuật implement DIP — inject
          dependency qua constructor, không new() bên trong class. TypeScript's constructor typing
          làm DI type-safe tự nhiên.
        </Callout>
        <Callout type="warn">
          <strong>SOLID không phải dogma:</strong> Một số nguyên tắc có trade-off. ISP quá cực đoan
          dẫn đến quá nhiều interfaces nhỏ khó quản lý. SRP đôi khi tạo ra quá nhiều tiny classes.
          Áp dụng SOLID khi code thực sự cần — không phải để code trông "đúng pattern".
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Refactor class God { saveUser(), sendEmail(), generatePdf(), logAction() } thành nhiều class theo SRP. Mỗi class có đúng 1 responsibility.',
            },
            {
              level: 'medium',
              text: 'Thiết kế Payment processing theo OCP: interface IPaymentProcessor, implement VNPayProcessor, MomoProcessor, ZaloPayProcessor. Thêm được processor mới không sửa PaymentService.',
            },
            {
              level: 'hard',
              text: 'Implement mini DI container đơn giản: Container với bind(token, factory), get(token). Hỗ trợ singleton scope và transient scope. Detect circular dependencies và throw Error.',
            },
          ]}
          hint="God class: UserRepo, EmailSvc, PdfSvc, Logger. PaymentService: constructor(processors: IPaymentProcessor[]). DI: Map<token, {factory, singleton?, instance?}>."
        />
      </Sec>
    </LessonCard>
  );
}

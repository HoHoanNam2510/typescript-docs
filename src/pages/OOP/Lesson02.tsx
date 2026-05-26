import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const ACCESS_MODIFIERS = `// public — ai cũng truy cập (default)
// private — chỉ trong class này
// protected — class này + subclasses

class BankAccount {
  public owner: string;           // ai cũng đọc/ghi
  private balance: number;        // chỉ BankAccount
  protected accountNumber: string; // BankAccount + subclasses
  readonly createdAt: Date;

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
    this.accountNumber = Math.random().toString(36).slice(2, 10);
    this.createdAt = new Date();
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.balance += amount;
  }

  withdraw(amount: number): void {
    if (amount > this.balance) throw new Error('Insufficient funds');
    this.balance -= amount;
  }

  getBalance(): number {
    return this.balance; // public method để đọc private field
  }
}

const acc = new BankAccount('Alice', 1000);
acc.owner;          // OK — public
acc.getBalance();   // OK — public method
// acc.balance      // Error — private
// acc.accountNumber // Error — protected (chỉ subclass được)`;

const PRIVATE_FIELDS = `// private (TS) vs #private (JS native)
// private (TS): compile-time only — JS runtime vẫn truy cập được
// #private (JS): runtime enforcement — truly private

class UserTS {
  private password: string; // TS private

  constructor(password: string) {
    this.password = password;
  }
}

class UserJS {
  #password: string; // JS native private field

  constructor(password: string) {
    this.#password = password;
  }

  checkPassword(input: string): boolean {
    return this.#password === input;
  }
}

const u1 = new UserTS('secret');
// (u1 as any).password; // bypass TS — runtime OK!

const u2 = new UserJS('secret');
// u2.#password; // Error — không thể bypass

// Khi nào dùng #?
// — Khi cần runtime privacy (security-critical)
// — Khi expose class ra library/API
// Ngược lại: private TS đủ dùng cho internal code`;

const PROTECTED_EXTENDS = `// protected — kế thừa truy cập được
class SavingsAccount extends BankAccount {
  private interestRate: number;

  constructor(owner: string, balance: number, rate: number) {
    super(owner, balance);
    this.interestRate = rate;
  }

  addInterest(): void {
    // accountNumber là protected — subclass truy cập được
    console.log(\`Adding interest to #\${this.accountNumber}\`);
    this.deposit(this.getBalance() * this.interestRate);
  }
}

class CheckingAccount extends BankAccount {
  private overdraftLimit: number;

  constructor(owner: string, balance: number, overdraft: number) {
    super(owner, balance);
    this.overdraftLimit = overdraft;
  }

  // Override withdraw — cho phép overdraft
  withdraw(amount: number): void {
    if (amount > this.getBalance() + this.overdraftLimit) {
      throw new Error('Exceeds overdraft limit');
    }
    // Gọi trực tiếp vì không override deposit
    super.deposit(-amount); // workaround demo
  }
}

const savings = new SavingsAccount('Bob', 5000, 0.05);
savings.addInterest(); // OK`;

const ENCAPSULATION = `// Encapsulation pattern — hide implementation, expose interface

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Không expose items trực tiếp — dùng toArray nếu cần
  toArray(): T[] {
    return [...this.items]; // trả về copy, không phải reference
  }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);
console.log(stack.size);    // 3
console.log(stack.peek());  // 3
console.log(stack.pop());   // 3
console.log(stack.size);    // 2
// stack.items              // Error — private!`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson02({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="oop-02"
      num="02"
      title="Access Modifiers & Readonly"
      desc="public, private, protected, readonly — và #private fields của JS"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Access Modifiers">
        <Concept>
          <p>
            TypeScript có 3 access modifiers: <strong>public</strong> (mặc định),{' '}
            <strong>private</strong> (chỉ trong class), và <strong>protected</strong> (class +
            subclasses). Kết hợp với <strong>readonly</strong>, chúng tạo nên encapsulation — ẩn
            implementation details và chỉ expose API cần thiết.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'public / private / protected', code: ACCESS_MODIFIERS },
            { label: 'private vs #private', code: PRIVATE_FIELDS },
            { label: 'protected & extends', code: PROTECTED_EXTENDS },
            { label: 'Encapsulation pattern', code: ENCAPSULATION },
          ]}
        />
      </Sec>

      <Sec title="So sánh Access Modifiers">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Modifier</th>
              <th>Trong class</th>
              <th>Subclass</th>
              <th>Bên ngoài</th>
              <th>Runtime check</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['public', '✓', '✓', '✓', '✗'],
              ['protected', '✓', '✓', '✗', '✗'],
              ['private', '✓', '✗', '✗', '✗'],
              ['#private', '✓', '✗', '✗', '✓'],
              ['readonly', '✓ (read)', '✓ (read)', '✓ (read)', '✗'],
            ].map(([mod, cls, sub, out, rt]) => (
              <tr key={mod}>
                <td>
                  <code>{mod}</code>
                </td>
                <td>{cls}</td>
                <td>{sub}</td>
                <td>{out}</td>
                <td>{rt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>private là compile-time only:</strong> TypeScript's{' '}
          <code className="ic">private</code> chỉ ngăn truy cập ở type level. Sau khi compile sang
          JS, field vẫn có thể truy cập với <code className="ic">(obj as any).field</code>. Dùng{' '}
          <code className="ic">#field</code> nếu cần runtime privacy thực sự.
        </Callout>
        <Callout type="warn">
          <strong>protected không phải "semi-public":</strong> <code className="ic">protected</code>{' '}
          chỉ dành cho inheritance — không phải cách để share state giữa các instances. Nếu subclass
          cần đọc data từ parent, nên dùng public getter thay vì protected field.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo class Person với private _name và private _age. Thêm public getters. Thêm method greet() trả về string. Đảm bảo age không âm (throw nếu set âm).',
            },
            {
              level: 'medium',
              text: 'Mở rộng BankAccount: tạo class PremiumAccount extends BankAccount với cashbackRate: number. Override deposit() để add cashback. Dùng protected accountNumber trong toString().',
            },
            {
              level: 'hard',
              text: 'Tạo class SecureStorage<T> dùng #data: Map<string, T> (JS private). Có methods: set(key, value), get(key), has(key), delete(key). Thêm private encryption simulation: base64 encode key trước khi lưu.',
            },
          ]}
          hint="Person: setter age với if check. PremiumAccount: super.deposit(amount + amount*cashbackRate). SecureStorage: this.#data = new Map(), btoa(key) để encode."
        />
      </Sec>
    </LessonCard>
  );
}

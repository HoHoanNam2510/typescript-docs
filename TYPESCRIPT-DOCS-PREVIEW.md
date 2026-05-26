# typescript-docs — Preview Nội Dung

> **Dự án:** Trang ôn tập TypeScript cho phỏng vấn tháng 6  
> **Kiến trúc:** Sao chép 1:1 từ `nodejs-docs` (Vite + React + React Router + TypeScript, single `shared.css`)  
> **Nguồn nội dung:** w3schools TypeScript Tutorial + bổ sung ví dụ & bài tập thực chiến  
> **Cấu trúc:** 6 module, ~60 lessons, folder-per-page pattern

## Tiến độ thực hiện

| Module | Trạng thái | Bài học | Ghi chú |
|--------|-----------|---------|---------|
| Module 01 — TypeScript Cơ Bản | ✅ **Hoàn thành** | 10/10 | Build thành công, `tsc --noEmit` 0 lỗi |
| Module 02 — Kiểu Dữ Liệu | ⏳ Chưa làm | 0/10 | |
| Module 03 — OOP & Classes | ⏳ Chưa làm | 0/10 | |
| Module 04 — Generics & Utility Types | ⏳ Chưa làm | 0/10 | |
| Module 05 — TypeScript Nâng Cao | ⏳ Chưa làm | 0/10 | |
| Module 06 — Thực Chiến & Ecosystem | ⏳ Chưa làm | 0/12 | |

**Cập nhật lần cuối:** 2026-05-26

---

## Tổng quan cấu trúc dự án

```
typescript-docs/
├── src/
│   ├── components/          # Giữ nguyên từ nodejs-docs
│   │   ├── Nav.tsx
│   │   ├── PageHeader.tsx
│   │   ├── TocBar.tsx
│   │   ├── TocDots.tsx
│   │   ├── LessonCard.tsx
│   │   ├── CodeTabs.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── Callout.tsx
│   │   └── ...
│   ├── hooks/               # Giữ nguyên
│   │   ├── useProgress.ts
│   │   └── useTocDots.ts
│   ├── pages/
│   │   ├── Index.tsx              # Homepage
│   │   ├── Coban/                 # Module 01
│   │   ├── KieuDuLieu/            # Module 02
│   │   ├── OOP/                   # Module 03
│   │   ├── Generics/              # Module 04
│   │   ├── NangCao/               # Module 05
│   │   └── ThucChien/             # Module 06
│   ├── App.tsx
│   ├── main.tsx
│   └── shared.css           # Màu accent: --ts: #3178c6 (TypeScript blue)
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**Routes:**

```
/                    → Homepage (tổng quan 6 module + tiến độ)
/01-co-ban           → Module 01: TypeScript Cơ Bản
/02-kieu-du-lieu     → Module 02: Kiểu Dữ Liệu
/03-oop              → Module 03: OOP & Classes
/04-generics         → Module 04: Generics & Utility Types
/05-nang-cao         → Module 05: TypeScript Nâng Cao
/06-thuc-chien       → Module 06: Thực Chiến & Ecosystem
```

---

## Module 01 — TypeScript Cơ Bản ✅

**Trạng thái:** Hoàn thành (2026-05-26) — `tsc --noEmit` 0 lỗi, `vite build` thành công (66 modules, 253KB JS)  
**Mô tả:** Nắm vững nền tảng TypeScript — hiểu tại sao dùng TS, cách cài đặt, và các kiểu nguyên thủy cơ bản.  
**Số bài:** 10 lessons  
**Thời gian ước tính:** 3–4 giờ

---

### Lesson 01 — Giới Thiệu TypeScript

**Tóm tắt nội dung:**

- TypeScript = JavaScript + Static Typing (superset của JS)
- TypeScript biên dịch sang JavaScript (transpile, không chạy trực tiếp)
- Lợi ích: phát hiện lỗi tại compile-time thay vì runtime
- TypeScript không thay thế JS — trình duyệt/Node.js vẫn chạy JS

**Ví dụ cơ bản:**

```typescript
// JavaScript — lỗi chỉ phát hiện khi chạy
function greet(name) {
  return 'Hello, ' + name.toUpperCase();
}
greet(42); // Runtime Error: name.toUpperCase is not a function

// TypeScript — lỗi phát hiện ngay khi viết code
function greet(name: string): string {
  return 'Hello, ' + name.toUpperCase();
}
greet(42); // Compile Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

**Ví dụ so sánh JS vs TS:**

```typescript
// JavaScript (không có type)
let age = 25;
age = 'twenty-five'; // Không báo lỗi — nhưng logic sai

// TypeScript (có type)
let age: number = 25;
age = 'twenty-five'; // Error: Type 'string' is not assignable to type 'number'
```

**Bài tập:**

1. Khai báo biến `username: string`, `age: number`, `isLoggedIn: boolean` với giá trị phù hợp
2. Viết hàm `add(a: number, b: number): number` trả về tổng
3. Thử gán sai kiểu và quan sát lỗi TypeScript báo gì

---

### Lesson 02 — Cài Đặt & Bắt Đầu

**Tóm tắt nội dung:**

- Cài TypeScript: `npm install -g typescript` hoặc dùng với dự án
- Lệnh `tsc` — TypeScript Compiler
- File `tsconfig.json` — cấu hình compiler
- Chạy TypeScript với `ts-node` hoặc Vite/Next.js

**Lệnh cơ bản:**

```bash
# Cài toàn cục
npm install -g typescript

# Kiểm tra phiên bản
tsc --version

# Biên dịch file .ts sang .js
tsc hello.ts

# Khởi tạo tsconfig.json
tsc --init

# Chạy trực tiếp với ts-node
npx ts-node hello.ts
```

**tsconfig.json cơ bản:**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Bài tập:**

1. Tạo file `hello.ts` với hàm `sayHello(name: string)` và biên dịch sang JS
2. Dùng `tsc --init` và giải thích 5 option quan trọng nhất trong tsconfig.json
3. Thiết lập project TypeScript với `package.json` + `scripts` để build và dev

---

### Lesson 03 — Simple Types (Kiểu Nguyên Thủy)

**Tóm tắt nội dung:**

- `string`, `number`, `boolean` — 3 kiểu cơ bản nhất
- `bigint` — số nguyên rất lớn (> 2^53)
- `symbol` — giá trị unique, thường dùng làm key
- `null` và `undefined` — giá trị "không có gì"

**Các kiểu nguyên thủy:**

```typescript
// string
let name: string = 'Alice';
let greeting: string = `Hello, ${name}!`; // template literal

// number (cả integer lẫn float)
let age: number = 30;
let price: number = 9.99;
let hex: number = 0xff; // 255
let binary: number = 0b1010; // 10

// boolean
let isActive: boolean = true;
let hasPermission: boolean = false;

// bigint (ES2020+)
let bigNum: bigint = 9007199254740991n;
let computed: bigint = BigInt('12345678901234567890');

// symbol
const id: symbol = Symbol('userId');
const anotherId: symbol = Symbol('userId');
console.log(id === anotherId); // false — mỗi Symbol là unique

// null & undefined
let empty: null = null;
let notSet: undefined = undefined;
```

**Lưu ý quan trọng:**

```typescript
// TypeScript strict mode: null/undefined không thể gán cho kiểu khác
let name: string = null; // Error (strict mode)
let name: string | null = null; // OK — phải dùng union type
```

**Bài tập:**

1. Khai báo thông tin một sản phẩm: `productName: string`, `price: number`, `inStock: boolean`, `sku: symbol`
2. Viết hàm `formatPrice(price: number, currency: string): string` trả về `"$9.99 USD"`
3. Giải thích sự khác biệt giữa `null` và `undefined` trong TypeScript

---

### Lesson 04 — Type Inference vs Explicit Types

**Tóm tắt nội dung:**

- **Type Inference** — TypeScript tự suy ra kiểu từ giá trị khởi tạo
- **Explicit Types** — lập trình viên khai báo kiểu rõ ràng
- Khi nào dùng inference, khi nào cần explicit

**Type Inference:**

```typescript
// TypeScript tự suy ra kiểu
let message = 'Hello'; // inferred: string
let count = 42; // inferred: number
let isReady = true; // inferred: boolean

// Gán sai kiểu vẫn bị bắt lỗi dù không khai báo
message = 100; // Error: Type 'number' is not assignable to type 'string'

// Inference với array
let numbers = [1, 2, 3]; // inferred: number[]
let mixed = [1, 'two', true]; // inferred: (string | number | boolean)[]

// Inference với object
let user = { name: 'Alice', age: 30 };
// inferred: { name: string; age: number }
user.name = 42; // Error!
```

**Explicit Types — khi nào cần:**

```typescript
// Cần explicit khi khai báo không khởi tạo ngay
let value: string;
// ... later
value = 'hello';

// Cần explicit khi muốn kiểu rộng hơn inferred
let id: string | number = 'abc123';
id = 42; // OK

// Cần explicit cho function parameters
function multiply(a: number, b: number): number {
  return a * b;
}

// Cần explicit khi inferred quá specific
let status: string = 'active'; // OK để gán lại
// vs
let status = 'active'; // inferred: "active" (literal type!)
```

**Best Practice:**

```typescript
// Không cần khai báo khi có giá trị khởi tạo rõ ràng
const PI = 3.14159; // OK — inference đủ rõ

// Nên khai báo khi return type của function
function fetchUser(id: number): Promise<User> { ... }

// Nên khai báo khi biến có thể là nhiều kiểu
let result: string | null = null;
```

**Bài tập:**

1. Dự đoán kiểu TypeScript inference cho: `let arr = [1, 2, 3]`, `let obj = {x: 1}`, `let fn = (n: number) => n * 2`
2. Viết function `parseInput` nhận `string | number`, trả về `string` — dùng explicit type
3. Giải thích tại sao `let status = "active"` có kiểu `"active"` chứ không phải `string`

---

### Lesson 05 — Special Types

**Tóm tắt nội dung:**

- `any` — tắt type checking (tránh dùng!)
- `unknown` — type-safe thay thế cho `any`
- `never` — không bao giờ xảy ra (infinite loop, throw)
- `void` — hàm không trả về giá trị
- `object` vs `Object` — sự khác biệt

**`any` — "escape hatch" nguy hiểm:**

```typescript
let flexible: any = 'hello';
flexible = 42; // OK
flexible = true; // OK
flexible.toUpperCase(); // OK — nhưng nếu flexible là number thì runtime error!

// any "lây" sang kiểu khác
let value: any = getData();
let name: string = value.user.name; // Không có type checking!
```

**`unknown` — safer alternative:**

```typescript
let input: unknown = getInput();

// Phải kiểm tra type trước khi dùng
if (typeof input === 'string') {
  console.log(input.toUpperCase()); // OK trong block này
}

// Không thể dùng trực tiếp
input.toUpperCase(); // Error: Object is of type 'unknown'

// Ứng dụng thực tế
function parseJSON(raw: string): unknown {
  return JSON.parse(raw); // trả về unknown thay vì any
}
```

**`never` — kiểu không bao giờ có giá trị:**

```typescript
// Function throw luôn có kiểu never
function throwError(message: string): never {
  throw new Error(message);
}

// Exhaustiveness check với never
type Shape = 'circle' | 'square';

function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 4;
    case 'square':
      return 16;
    default:
      const _exhaustive: never = shape; // Error nếu thiếu case
      return _exhaustive;
  }
}
```

**`void` — không có return value:**

```typescript
function logMessage(msg: string): void {
  console.log(msg);
  // không return gì — hoặc return; (không có value)
}

// Khác với undefined
const result: void = logMessage('hi'); // void
const undef: undefined = undefined; // undefined cụ thể hơn
```

**Bài tập:**

1. Viết hàm `safeParse(input: unknown): string` — nếu input là string trả về nó, ngược lại throw error
2. Tạo type `Direction = "north" | "south" | "east" | "west"` và viết function xử lý với exhaustive check dùng `never`
3. Giải thích: khi nào nên dùng `unknown` thay vì `any`?

---

### Lesson 06 — Arrays & Readonly Arrays

**Tóm tắt nội dung:**

- Khai báo array với `Type[]` hoặc `Array<Type>`
- `readonly` array — không thể mutate
- Multi-dimensional arrays
- Array methods với type safety

**Khai báo array:**

```typescript
// Hai cú pháp tương đương
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
```

**Readonly arrays:**

```typescript
// readonly — không thể push/pop/modify
const readonlyArr: readonly number[] = [1, 2, 3];
readonlyArr.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'
readonlyArr[0] = 10; // Error: Index signature in type 'readonly number[]' only permits reading

// ReadonlyArray<T> — cú pháp khác
const fruits: ReadonlyArray<string> = ['apple', 'banana'];

// Thực tế: dùng khi muốn đảm bảo array không bị thay đổi
function processItems(items: readonly string[]): void {
  items.forEach((item) => console.log(item)); // OK — chỉ đọc
}
```

**Type-safe array operations:**

```typescript
const nums: number[] = [3, 1, 4, 1, 5];

// map — trả về number[]
const doubled: number[] = nums.map((n) => n * 2);

// filter — trả về number[]
const evens: number[] = nums.filter((n) => n % 2 === 0);

// find — trả về number | undefined
const found: number | undefined = nums.find((n) => n > 3);

// reduce
const sum: number = nums.reduce((acc, n) => acc + n, 0);
```

**Bài tập:**

1. Khai báo `products: { name: string; price: number; inStock: boolean }[]` với 3 sản phẩm mẫu
2. Viết hàm `getExpensive(products, minPrice: number)` trả về mảng sản phẩm giá trên `minPrice`
3. Tại sao nên dùng `readonly` array cho function parameters?

---

### Lesson 07 — Tuples

**Tóm tắt nội dung:**

- Tuple = array với số phần tử cố định và kiểu xác định cho từng vị trí
- Named tuples — dễ đọc hơn
- Optional và rest elements trong tuple
- Destructuring tuple

**Tuple cơ bản:**

```typescript
// Tuple: [string, number] — đúng thứ tự, đúng kiểu
let person: [string, number] = ['Alice', 30];
person[0] = 'Bob'; // OK
person[1] = 'Bob'; // Error: Type 'string' is not assignable to type 'number'

// Không thể swap vị trí
let wrong: [string, number] = [30, 'Alice']; // Error

// Named tuple (TS 4.0+) — dễ đọc hơn
type Point = [x: number, y: number];
type RGB = [red: number, green: number, blue: number];

let origin: Point = [0, 0];
let color: RGB = [255, 128, 0];
```

**Optional và rest trong tuple:**

```typescript
// Optional element (phải ở cuối)
type StringNum = [string, number?];
const a: StringNum = ['hello']; // OK
const b: StringNum = ['hello', 42]; // OK

// Rest elements
type StringAndNumbers = [string, ...number[]];
const c: StringAndNumbers = ['hi', 1, 2, 3, 4]; // OK

// Tuple với rest ở đầu
type NumbersAndString = [...number[], string];
const d: NumbersAndString = [1, 2, 3, 'end']; // OK
```

**Destructuring:**

```typescript
// Basic destructuring
const [name, age]: [string, number] = ['Alice', 30];
console.log(name); // "Alice"
console.log(age); // 30

// Function trả về tuple — pattern phổ biến
function getMinMax(arr: number[]): [number, number] {
  return [Math.min(...arr), Math.max(...arr)];
}
const [min, max] = getMinMax([3, 1, 4, 1, 5, 9]);

// React useState pattern (cũng là tuple)
// const [count, setCount] = useState<number>(0);
```

**So sánh Tuple vs Object:**

```typescript
// Tuple — compact nhưng phụ thuộc vị trí
type UserTuple = [number, string, boolean];
const user1: UserTuple = [1, 'Alice', true];

// Object — verbose hơn nhưng rõ nghĩa
type UserObject = { id: number; name: string; active: boolean };
const user2: UserObject = { id: 1, name: 'Alice', active: true };
// Khuyến nghị: dùng object khi > 3 fields
```

**Bài tập:**

1. Viết function `parseCSVLine(line: string): [string, number, boolean]` parse `"Alice,30,true"`
2. Tạo type `HttpResponse = [statusCode: number, body: string, headers?: Record<string, string>]`
3. Dùng tuple để implement `useLocalStorage<T>(key: string): [T | null, (value: T) => void]`

---

### Lesson 08 — Object Types

**Tóm tắt nội dung:**

- Khai báo object type inline vs type alias
- Optional properties (`?`)
- Readonly properties
- Index signatures
- Nested objects

**Object type cơ bản:**

```typescript
// Inline type
let user: { name: string; age: number; email: string } = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
};

// Type alias — tái sử dụng được
type User = {
  id: number;
  name: string;
  age: number;
  email: string;
};

// Optional properties
type Product = {
  id: number;
  name: string;
  description?: string; // có thể thiếu
  price: number;
};

const p1: Product = { id: 1, name: 'Phone', price: 999 }; // OK
const p2: Product = { id: 2, name: 'Laptop', description: 'Fast', price: 1999 }; // OK
```

**Readonly properties:**

```typescript
type Config = {
  readonly host: string;
  readonly port: number;
  timeout: number;
};

const config: Config = { host: 'localhost', port: 3000, timeout: 5000 };
config.timeout = 10000; // OK
config.host = 'prod.example.com'; // Error: Cannot assign to 'host' because it is a read-only property
```

**Nested objects:**

```typescript
type Address = {
  street: string;
  city: string;
  country: string;
};

type Person = {
  name: string;
  age: number;
  address: Address;
  contacts: {
    email: string;
    phone?: string;
  };
};

const alice: Person = {
  name: 'Alice',
  age: 30,
  address: { street: '123 Main St', city: 'NYC', country: 'US' },
  contacts: { email: 'alice@example.com' },
};
```

**Bài tập:**

1. Tạo type `BlogPost` với: `id`, `title`, `content`, `author` (object lồng), `tags` (array), `publishedAt` (Date hoặc null)
2. Viết function `updateUser(user: User, changes: Partial<User>): User` — không mutate user gốc
3. Tại sao nên dùng `readonly` cho config objects?

---

### Lesson 09 — Enums

**Tóm tắt nội dung:**

- Numeric Enum vs String Enum
- `const enum` — optimization
- Enum vs Union Type — khi nào dùng cái nào

**Numeric Enum:**

```typescript
enum Direction {
  Up, // 0
  Down, // 1
  Left, // 2
  Right, // 3
}

enum Direction {
  Up = 1, // custom start
  Down, // 2
  Left, // 3
  Right, // 4
}

// Reverse mapping (chỉ numeric enum)
console.log(Direction[1]); // "Up"
console.log(Direction.Up); // 1
```

**String Enum:**

```typescript
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

// Dễ debug hơn numeric enum
const userStatus: Status = Status.Active;
console.log(userStatus); // "ACTIVE" (thay vì 0)

// Dùng với switch
function handleStatus(status: Status): string {
  switch (status) {
    case Status.Active:
      return 'User is active';
    case Status.Inactive:
      return 'User is inactive';
    case Status.Pending:
      return 'User is pending';
  }
}
```

**`const enum` — không tạo object JS:**

```typescript
const enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// Biên dịch sang: const color = "RED"; (inline)
// Không tạo object Color trong JS output
const color = Color.Red;
```

**Enum vs Union Type:**

```typescript
// Enum
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

// Union type — thường ưu tiên hơn trong modern TS
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Union type ngắn gọn hơn, không tạo runtime object
// Dùng Enum khi: cần reverse mapping, dùng ở nhiều file, cần namespace
```

**Bài tập:**

1. Tạo `enum UserRole { Admin, Editor, Viewer }` và viết function check permission
2. Tạo `enum HttpStatus` với các code phổ biến (200, 201, 400, 401, 404, 500)
3. So sánh: viết cùng logic với Enum và với Union type — cái nào dễ maintain hơn?

---

### Lesson 10 — Union & Intersection Types

**Tóm tắt nội dung:**

- Union type (`|`) — kiểu này **hoặc** kiểu kia
- Intersection type (`&`) — kiểu này **và** kiểu kia
- Type narrowing với union
- Discriminated unions — pattern quan trọng

**Union types:**

```typescript
// Biến có thể là một trong nhiều kiểu
let id: string | number;
id = 'abc123'; // OK
id = 42; // OK
id = true; // Error

// Function parameter
function printId(id: string | number): void {
  // Phải narrow type trước khi dùng method cụ thể
  if (typeof id === 'string') {
    console.log(id.toUpperCase()); // string methods OK
  } else {
    console.log(id.toFixed(2)); // number methods OK
  }
}

// Union với object types
type Cat = { type: 'cat'; meow: () => void };
type Dog = { type: 'dog'; bark: () => void };
type Pet = Cat | Dog;
```

**Discriminated Unions — pattern quan trọng:**

```typescript
type Circle = {
  kind: 'circle';
  radius: number;
};

type Square = {
  kind: 'square';
  side: number;
};

type Rectangle = {
  kind: 'rectangle';
  width: number;
  height: number;
};

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.side ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      const _never: never = shape; // exhaustive check
      return _never;
  }
}
```

**Intersection types:**

```typescript
type HasName = { name: string };
type HasAge = { age: number };
type HasEmail = { email: string };

// Intersection — phải có TẤT CẢ properties
type Person = HasName & HasAge & HasEmail;

const alice: Person = {
  name: 'Alice',
  age: 30,
  email: 'alice@example.com',
}; // phải có đủ 3 fields

// Dùng để compose types
type AdminUser = User & {
  adminLevel: number;
  permissions: string[];
};
```

**Bài tập:**

1. Tạo `type ApiResponse<T> = { success: true; data: T } | { success: false; error: string }` và viết handler
2. Implement Discriminated Union cho hệ thống payment: `CreditCard | BankTransfer | Crypto`
3. Dùng Intersection type để tạo `type AuditableEntity = BaseEntity & { createdAt: Date; updatedAt: Date }`

---

## Module 02 — Kiểu Dữ Liệu Nâng Cao

**Mô tả:** Đi sâu vào type system — type aliases, interfaces, functions, và casting.  
**Số bài:** 10 lessons  
**Thời gian ước tính:** 3–4 giờ

---

### Lesson 01 — Type Aliases

**Tóm tắt nội dung:**

- Tạo tên mới cho bất kỳ kiểu nào
- Reusability và readability
- Recursive type aliases
- Utility với primitives

```typescript
// Alias cho primitive
type UserId = number;
type UserName = string;
type IsActive = boolean;

// Alias cho complex types
type Coordinate = [number, number];
type Matrix = number[][];
type Callback = (error: Error | null, data?: string) => void;

// Recursive type
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

const validJSON: JSONValue = {
  name: 'Alice',
  scores: [100, 95, 87],
  metadata: { active: true, tags: ['admin', 'user'] },
};

// Generic type alias
type Nullable<T> = T | null;
type Optional<T> = T | undefined;
type Maybe<T> = T | null | undefined;

let name: Nullable<string> = null; // string | null
let age: Optional<number> = undefined; // number | undefined
```

**Bài tập:**

1. Tạo `type EventHandler<T = Event> = (event: T) => void`
2. Tạo `type DeepReadonly<T>` — làm tất cả properties readonly đệ quy
3. Viết `type Awaited<T>` — unwrap Promise type

---

### Lesson 02 — Interfaces

**Tóm tắt nội dung:**

- Interface cho object types
- Declaration merging — tính năng độc đáo
- Extending interfaces
- Interface vs Type Alias — khi nào dùng cái nào

```typescript
// Interface cơ bản
interface User {
  id: number;
  name: string;
  email: string;
  readonly createdAt: Date;
  avatar?: string;
}

// Extending interface
interface AdminUser extends User {
  adminLevel: 1 | 2 | 3;
  permissions: string[];
}

// Multiple extends
interface SuperAdmin extends AdminUser, Auditable {
  superPower: string;
}

// Declaration merging — chỉ interface mới có!
interface Window {
  myPlugin: { version: string };
}
// Bây giờ window.myPlugin tồn tại trong type system

// Interface cho function
interface Comparator<T> {
  (a: T, b: T): number;
}

const numComparator: Comparator<number> = (a, b) => a - b;

// Interface cho class
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

class UserModel implements Serializable {
  serialize(): string {
    return JSON.stringify(this);
  }
  deserialize(data: string): void {
    Object.assign(this, JSON.parse(data));
  }
}
```

**Type vs Interface — cheat sheet:**

| Tính năng           | `type`  | `interface`   |
| ------------------- | ------- | ------------- |
| Object types        | ✓       | ✓             |
| Primitive types     | ✓       | ✗             |
| Union types         | ✓       | ✗             |
| Intersection        | ✓ (`&`) | ✓ (`extends`) |
| Declaration merging | ✗       | ✓             |
| Implements (class)  | ✓       | ✓             |
| Recursive types     | ✓       | ✓             |

**Rule of thumb:** Dùng `interface` cho public API / shape của objects. Dùng `type` cho unions, intersections, primitives, computed types.

**Bài tập:**

1. Thiết kế interface hệ thống blog: `IBlogPost`, `IComment`, `IAuthor` với quan hệ hợp lý
2. Dùng declaration merging để extend `Array<T>` với method `groupBy`
3. Viết interface `IRepository<T>` với CRUD methods

---

### Lesson 03 — Functions

**Tóm tắt nội dung:**

- Function types và signatures
- Optional, default, rest parameters
- Overloads — cùng tên, khác signature
- Generic functions

```typescript
// Function type annotation
const add: (a: number, b: number) => number = (a, b) => a + b;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return `${greeting ?? 'Hello'}, ${name}!`;
}

// Default parameters
function createUser(
  name: string,
  role: string = 'user',
  active: boolean = true
) {
  return { name, role, active };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5); // 15

// Function overloads
function format(value: string): string;
function format(value: number, decimals?: number): string;
function format(value: string | number, decimals: number = 2): string {
  if (typeof value === 'string') return value.trim();
  return value.toFixed(decimals);
}

// Higher-order functions
function memoize<T extends (...args: unknown[]) => unknown>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}
```

**Bài tập:**

1. Viết `pipe(...fns)` nhận nhiều functions và compose chúng
2. Implement function overloads cho `getElementById` — trả về `HTMLElement` khi có id, `HTMLElement[]` khi truyền class selector
3. Viết `curry<T>(fn: (...args) => T)` — curried version của một function

---

### Lesson 04 — Type Casting (Type Assertions)

```typescript
// as keyword — phổ biến nhất
const input = document.getElementById('username') as HTMLInputElement;
input.value = 'Alice'; // OK — biết đây là input element

// <Type> syntax (không dùng trong TSX/React)
const canvas = <HTMLCanvasElement>document.getElementById('canvas');

// Double assertion — khi TypeScript không cho phép trực tiếp
const value = someValue as unknown as SpecificType;

// Non-null assertion operator (!)
const element = document.getElementById('root')!; // Đảm bảo không null
element.innerHTML = 'Hello'; // OK

// Khi nào dùng vs không nên dùng
// ✓ OK: biết rõ type từ context (DOM manipulation)
// ✗ Tránh: chỉ để "bịt" lỗi mà không hiểu nguyên nhân

// Satisfies operator (TS 4.9+) — tốt hơn assertion
const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Record<string, string | number[]>;
// palette.red là number[] (không mất type info)
// palette.green là string
```

---

### Lesson 05 — Null & Undefined Handling

```typescript
// Strict null checks (strictNullChecks: true)
let name: string = null; // Error trong strict mode
let name: string | null = null; // OK

// Optional chaining (?.)
const user = getUser(); // User | null
const city = user?.address?.city; // string | undefined (không throw)

// Nullish coalescing (??)
const displayName = user?.name ?? 'Anonymous'; // dùng "Anonymous" nếu null/undefined

// Non-null assertion (!) — dùng cẩn thận
const element = document.querySelector('.container')!;

// Null narrowing
function processName(name: string | null): string {
  if (name === null) return 'Unknown';
  return name.toUpperCase(); // TypeScript biết name là string ở đây
}

// Utility types cho null
type NonNullable<T> = T extends null | undefined ? never : T;
type name = NonNullable<string | null | undefined>; // string
```

---

## Module 03 — OOP & Classes

**Mô tả:** TypeScript nâng tầm OOP với type-safe classes, access modifiers, và abstraction.  
**Số bài:** 10 lessons  
**Thời gian ước tính:** 4–5 giờ

---

### Lesson 01 — Classes Cơ Bản

```typescript
class Animal {
  // Typed properties
  name: string;
  private _age: number;
  readonly species: string;

  // Constructor
  constructor(name: string, age: number, species: string) {
    this.name = name;
    this._age = age;
    this.species = species;
  }

  // Method
  describe(): string {
    return `${this.name} is a ${this.species}, ${this._age} years old`;
  }

  // Getter/Setter
  get age(): number {
    return this._age;
  }

  set age(value: number) {
    if (value < 0) throw new Error('Age cannot be negative');
    this._age = value;
  }
}

// Shorthand constructor (Parameter Properties)
class Point {
  constructor(
    public x: number,
    public y: number,
    private label: string = 'point'
  ) {}

  toString(): string {
    return `${this.label}(${this.x}, ${this.y})`;
  }
}
```

---

### Lesson 02 — Access Modifiers & Readonly

```typescript
class BankAccount {
  public owner: string; // ai cũng truy cập được
  private balance: number; // chỉ class này truy cập
  protected accountNumber: string; // class này + subclass
  readonly createdAt: Date; // chỉ gán 1 lần

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
    this.accountNumber = Math.random().toString(36).slice(2);
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

class SavingsAccount extends BankAccount {
  private interestRate: number;

  constructor(owner: string, balance: number, rate: number) {
    super(owner, balance);
    this.interestRate = rate;
  }

  addInterest(): void {
    // accountNumber là protected — subclass truy cập được
    console.log(`Adding interest to account ${this.accountNumber}`);
    this.deposit(this.getBalance() * this.interestRate);
  }
}
```

---

### Lesson 03 — Inheritance & Polymorphism

```typescript
abstract class Shape {
  abstract getArea(): number;
  abstract getPerimeter(): number;

  // Concrete method — dùng chung
  describe(): string {
    return `Area: ${this.getArea().toFixed(2)}, Perimeter: ${this.getPerimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  constructor(
    private width: number,
    private height: number
  ) {
    super();
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

// Polymorphism
const shapes: Shape[] = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach((s) => console.log(s.describe()));
```

---

### Lesson 04 — Interfaces với Classes

```typescript
interface ILogger {
  log(message: string, level?: "info" | "warn" | "error"): void;
}

interface ISerializable<T> {
  serialize(): string;
  static deserialize(data: string): T; // không dùng được — TS không support static trong interface
}

// Thực tế: dùng constructor signature
interface Constructable<T> {
  new (...args: unknown[]): T;
}

// Class implement nhiều interfaces
class ConsoleLogger implements ILogger {
  log(message: string, level: "info" | "warn" | "error" = "info"): void {
    const prefix = `[${level.toUpperCase()}]`;
    console[level](`${prefix} ${message}`);
  }
}

// Mixin pattern
type Constructor<T = {}> = new (...args: unknown[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();
  };
}

function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActive = false;
    activate() { this.isActive = true; }
    deactivate() { this.isActive = false; }
  };
}

class User { constructor(public name: string) {} }
const TimestampedUser = Timestamped(User);
const ActivatableTimestampedUser = Activatable(Timestamped(User));
```

**Bài tập module:**

1. Implement `class LinkedList<T>` với `push`, `pop`, `find`, `toArray`
2. Thiết kế hệ thống `Animal` hierarchy: `Animal → Mammal → Dog/Cat`, `Animal → Bird → Eagle`
3. Implement Observer pattern: `class EventEmitter<Events extends Record<string, unknown>>`

---

## Module 04 — Generics & Utility Types

**Mô tả:** Tái sử dụng code với Generics và master Utility Types built-in của TypeScript.  
**Số bài:** 10 lessons  
**Thời gian ước tính:** 4–5 giờ

---

### Lesson 01 — Generics Cơ Bản

```typescript
// Generic function
function identity<T>(value: T): T {
  return value;
}
identity<string>('hello'); // string
identity(42); // inferred: number

// Generic với multiple type params
function pair<K, V>(key: K, value: V): [K, V] {
  return [key, value];
}

// Generic class
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

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  get size(): number {
    return this.items.length;
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
console.log(numStack.pop()); // 2
```

---

### Lesson 02 — Generic Constraints

```typescript
// extends để giới hạn type
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}
getLength('hello'); // 5
getLength([1, 2, 3]); // 3
getLength(42); // Error: number không có length

// keyof constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 30, email: 'alice@ex.com' };
getProperty(user, 'name'); // "Alice" — kiểu string
getProperty(user, 'age'); // 30 — kiểu number
getProperty(user, 'phone'); // Error: "phone" không tồn tại

// Generic với default value
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

type UserResponse = ApiResponse<User>; // T = User
type GenericResponse = ApiResponse; // T = unknown
```

---

### Lesson 03 — Utility Types (Built-in)

**Partial, Required, Readonly:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

// Partial<T> — tất cả properties thành optional
type UserUpdate = Partial<User>;
// { id?: number; name?: string; email?: string; role?: "admin" | "user" }

function updateUser(id: number, changes: Partial<User>): User {
  const existing = findUser(id);
  return { ...existing, ...changes };
}

// Required<T> — tất cả thành required
type StrictUser = Required<Partial<User>>; // lại thành required hết

// Readonly<T> — tất cả thành readonly
type ImmutableUser = Readonly<User>;
const user: ImmutableUser = {
  id: 1,
  name: 'Alice',
  email: '...',
  role: 'user',
};
user.name = 'Bob'; // Error!
```

**Pick, Omit, Extract, Exclude:**

```typescript
// Pick<T, K> — chọn một số properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit<T, K> — bỏ một số properties
type CreateUserDto = Omit<User, 'id'>;
// { name: string; email: string; role: "admin" | "user" }

// Record<K, V> — tạo object type từ keys và value type
type UserMap = Record<string, User>;
type StatusMap = Record<'active' | 'inactive' | 'banned', number>;

// Extract<T, U> — giữ lại types thuộc U
type StringOrNumber = Extract<string | number | boolean, string | number>;
// string | number

// Exclude<T, U> — loại bỏ types thuộc U
type NonString = Exclude<string | number | boolean, string>;
// number | boolean

// NonNullable<T>
type DefinitelyString = NonNullable<string | null | undefined>; // string
```

**ReturnType, Parameters, InstanceType:**

```typescript
function createUser(name: string, age: number): User {
  return { id: Date.now(), name, email: '', role: 'user' };
}

// ReturnType<T> — lấy return type của function
type CreatedUser = ReturnType<typeof createUser>; // User

// Parameters<T> — lấy parameter types
type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// InstanceType<T> — lấy instance type của class
class ApiClient {
  baseUrl: string = '';
}
type Client = InstanceType<typeof ApiClient>; // ApiClient
```

---

### Lesson 04 — Keyof & Typeof

```typescript
// keyof — lấy tất cả keys của type
type UserKeys = keyof User; // "id" | "name" | "email" | "role"

// typeof — lấy type của value
const config = { host: 'localhost', port: 3000, debug: false };
type Config = typeof config;
// { host: string; port: number; debug: boolean }

// Kết hợp keyof + typeof
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Lookup types (Indexed Access Types)
type UserName = User['name']; // string
type UserRole = User['role']; // "admin" | "user"

// Với array
type Fruits = ['apple', 'banana', 'cherry'];
type FirstFruit = Fruits[0]; // "apple"
type FruitType = Fruits[number]; // "apple" | "banana" | "cherry"
```

**Bài tập module:**

1. Implement `class Queue<T>` với `enqueue`, `dequeue`, `peek`, `size`
2. Viết generic `deepClone<T>(obj: T): T` — deep copy object
3. Implement `type DeepPartial<T>` — Partial đệ quy cho nested objects

---

## Module 05 — TypeScript Nâng Cao

**Mô tả:** Master type-level programming — conditional types, mapped types, template literals, và type guards.  
**Số bài:** 12 lessons  
**Thời gian ước tính:** 5–6 giờ

---

### Lesson 01 — Type Guards

```typescript
// typeof guard
function formatValue(value: string | number): string {
  if (typeof value === 'string') {
    return value.trim(); // TypeScript biết: string
  }
  return value.toFixed(2); // TypeScript biết: number
}

// instanceof guard
function processError(error: unknown): string {
  if (error instanceof Error) {
    return error.message; // Error
  }
  if (error instanceof TypeError) {
    return `Type error: ${error.message}`; // TypeError
  }
  return String(error);
}

// in guard
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird): void {
  if ('swim' in animal) {
    animal.swim(); // Fish
  } else {
    animal.fly(); // Bird
  }
}

// User-defined type guard (type predicate)
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// Assertion functions (TS 3.7+)
function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new TypeError(`Expected number, got ${typeof value}`);
  }
}
```

---

### Lesson 02 — Conditional Types

```typescript
// Basic conditional type
type IsString<T> = T extends string ? 'yes' : 'no';
type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"

// Distributive conditional types
type ToArray<T> = T extends unknown ? T[] : never;
type NumOrStrArray = ToArray<number | string>; // number[] | string[]

// Infer keyword
type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
type Resolved = UnpackPromise<Promise<string>>; // string
type Plain = UnpackPromise<number>; // number

// Infer với function types
type FirstArgument<T> = T extends (
  first: infer F,
  ...rest: unknown[]
) => unknown
  ? F
  : never;
type Arg = FirstArgument<(name: string, age: number) => void>; // string

// Practical: Deep non-nullable
type DeepNonNullable<T> = T extends null | undefined
  ? never
  : T extends object
    ? { [K in keyof T]: DeepNonNullable<T[K]> }
    : T;
```

---

### Lesson 03 — Mapped Types

```typescript
// Basic mapped type
type Readonly<T> = {
  readonly [K in keyof T]: T[K];
};

type Optional<T> = {
  [K in keyof T]?: T[K];
};

// Modifier +/- (add/remove)
type Mutable<T> = {
  -readonly [K in keyof T]: T[K]; // remove readonly
};

type Required<T> = {
  [K in keyof T]-?: T[K]; // remove optional
};

// Remapping keys (TS 4.1+)
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }

// Filtering keys
type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

type StringFields = PickByValue<User, string>;
// { name: string; email: string }
```

---

### Lesson 04 — Template Literal Types

```typescript
// Basic template literal type
type Greeting = `Hello, ${string}!`;
const g: Greeting = 'Hello, Alice!'; // OK
const bad: Greeting = 'Hi, Alice!'; // Error

// Union in template literals
type Direction = 'left' | 'right' | 'top' | 'bottom';
type CSSPadding = `padding-${Direction}`;
// "padding-left" | "padding-right" | "padding-top" | "padding-bottom"

// Event naming pattern
type EventName<T extends string> = `on${Capitalize<T>}`;
type ClickEvent = EventName<'click'>; // "onClick"

// API route patterns
type HttpMethod = 'get' | 'post' | 'put' | 'delete';
type ApiRoute = `/${string}`;
type RouteHandler = `${Uppercase<HttpMethod>} ${ApiRoute}`;

// Practical: CSS properties
type CSSUnit = 'px' | 'em' | 'rem' | '%';
type CSSValue = `${number}${CSSUnit}`;
const size: CSSValue = '16px'; // OK
const bad2: CSSValue = '16vw'; // Error
```

---

### Lesson 05 — Index Signatures

```typescript
// Basic index signature
interface StringMap {
  [key: string]: string;
}

interface FlexibleObject {
  id: number; // specific property
  name: string; // specific property
  [key: string]: unknown; // any other key — phải compatible
}

// Readonly index signature
interface ReadonlyMap {
  readonly [key: string]: number;
}

// Template literal index signature (TS 4.4+)
interface DataAttributes {
  [key: `data-${string}`]: string;
}

const el: DataAttributes = {
  'data-id': '123',
  'data-user': 'alice',
};

// Dùng thực tế
function fromEntries<K extends string, V>(entries: [K, V][]): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}
```

---

### Lesson 06 — Decorators

> **Lưu ý:** Cần `"experimentalDecorators": true` trong tsconfig.json

```typescript
// Class decorator
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = 'report';
  title: string;
  constructor(t: string) {
    this.title = t;
  }
}

// Method decorator
function log(target: unknown, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: unknown[]) {
    console.log(`Calling ${key} with`, args);
    const result = original.apply(this, args);
    console.log(`${key} returned`, result);
    return result;
  };
  return descriptor;
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

// Property decorator
function readonly(target: unknown, key: string) {
  Object.defineProperty(target, key, { writable: false });
}

// Parameter decorator
function validate(target: unknown, key: string, index: number) {
  console.log(`Parameter ${index} in ${key} requires validation`);
}
```

---

### Lesson 07 — Async & Error Handling

```typescript
// Typed async functions
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: Failed to fetch user`);
  }
  return response.json() as Promise<User>;
}

// Error handling với custom error classes
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: number | string) {
    super(`${resource} with id ${id} not found`, 'NOT_FOUND', 404);
  }
}

// Result type pattern — không dùng throw
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safeCreateUser(dto: CreateUserDto): Promise<Result<User>> {
  try {
    const user = await createUser(dto);
    return { success: true, data: user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

// Dùng
const result = await safeCreateUser({ name: 'Alice', email: '...' });
if (result.success) {
  console.log(result.data.id); // User
} else {
  console.error(result.error.message); // Error
}
```

---

## Module 06 — Thực Chiến & Ecosystem

**Mô tả:** Áp dụng TypeScript vào dự án thực tế — Node.js, cấu hình nâng cao, best practices.  
**Số bài:** 10 lessons  
**Thời gian ước tính:** 4–5 giờ

---

### Lesson 01 — TypeScript với Node.js

```bash
# Cài đặt
npm install -D typescript @types/node ts-node
npx tsc --init
```

```typescript
// src/server.ts
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';

interface ServerConfig {
  port: number;
  host: string;
  staticDir: string;
}

async function createServer(config: ServerConfig): Promise<http.Server> {
  const server = http.createServer(async (req, res) => {
    const url = req.url ?? '/';
    const filePath = path.join(
      config.staticDir,
      url === '/' ? 'index.html' : url
    );

    try {
      const content = await fs.readFile(filePath);
      res.writeHead(200);
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(config.port, config.host, () => resolve(server));
  });
}
```

---

### Lesson 02 — TypeScript với Express

```typescript
import express, { Request, Response, NextFunction } from 'express';

// Typed route params and body
interface CreatePostBody {
  title: string;
  content: string;
  authorId: number;
}

interface PostParams {
  id: string;
}

const router = express.Router();

router.post(
  '/posts',
  async (
    req: Request<{}, Post, CreatePostBody>,
    res: Response<Post>,
    next: NextFunction
  ) => {
    try {
      const { title, content, authorId } = req.body;
      const post = await PostService.create({ title, content, authorId });
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }
);

// Typed middleware
function authenticate(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  // verify token...
  next();
}

// Custom Request type with user
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}
```

---

### Lesson 03 — Best Practices

**Các nguyên tắc TypeScript thực chiến:**

```typescript
// ✓ 1. Dùng strict mode
{
  "compilerOptions": {
    "strict": true,              // bật tất cả strict flags
    "noUncheckedIndexedAccess": true, // arr[0] là T | undefined
    "exactOptionalPropertyTypes": true
  }
}

// ✓ 2. Ưu tiên type inference khi đủ rõ
const users = getUsers(); // inferred — không cần User[]

// ✓ 3. Dùng const assertions cho literal types
const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES]; // "/" | "/about" | "/contact"

// ✓ 4. Branded types cho primitive types có ý nghĩa khác nhau
type UserId = number & { readonly _brand: "UserId" };
type ProductId = number & { readonly _brand: "ProductId" };

function createUserId(n: number): UserId {
  return n as UserId;
}

// ✗ Không dùng any
function badProcess(data: any) { } // any mất hết type safety

// ✓ Dùng unknown + type guard
function goodProcess(data: unknown) {
  if (isUser(data)) {
    // data là User ở đây
  }
}

// ✓ 5. Tận dụng satisfies operator (TS 4.9+)
const config = {
  port: 3000,
  host: "localhost",
} satisfies Partial<ServerConfig>;
// port vẫn là number literal 3000, không mất info
```

---

### Lesson 04 — Cấu Hình tsconfig.json Nâng Cao

```json
{
  "compilerOptions": {
    // Target output
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "NodeNext",
    "moduleResolution": "NodeNext",

    // Strict type checking
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    // Path aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    },

    // Output
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

---

### Lesson 05 — Definitely Typed & @types

```bash
# Cài type definitions cho thư viện không có built-in types
npm install -D @types/express
npm install -D @types/node
npm install -D @types/jest
npm install -D @types/lodash

# Thư viện có built-in types (không cần @types)
npm install zod        # có types
npm install prisma     # có types
npm install axios      # có types
```

```typescript
// Khi thư viện không có @types — tự viết declaration
// src/types/my-lib.d.ts
declare module 'my-old-lib' {
  export function doSomething(value: string): void;
  export interface Config {
    timeout: number;
    retries: number;
  }
}

// Augment global types
declare global {
  interface Window {
    analytics: {
      track(event: string, data?: Record<string, unknown>): void;
    };
  }
}
```

---

## Tổng hợp Bài Tập Thực Chiến (Cuối Khóa)

### Project 1 — Type-Safe API Client

```typescript
// Xây dựng API client type-safe hoàn chỉnh
// Sử dụng: Generics, Conditional Types, Template Literals

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig<T = unknown> {
  method: HttpMethod;
  url: string;
  body?: T;
  headers?: Record<string, string>;
}

interface ApiClient {
  get<T>(url: string): Promise<T>;
  post<TBody, TResponse>(url: string, body: TBody): Promise<TResponse>;
  put<TBody, TResponse>(url: string, body: TBody): Promise<TResponse>;
  delete<T>(url: string): Promise<T>;
}
```

### Project 2 — Mini State Manager

```typescript
// Redux-like state manager với full type safety
type Action<T extends string = string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P };

type Reducer<S, A> = (state: S, action: A) => S;

function createStore<S, A>(reducer: Reducer<S, A>, initialState: S) {
  let state = initialState;
  const listeners: Array<() => void> = [];

  return {
    getState: (): S => state,
    dispatch: (action: A): void => {
      state = reducer(state, action);
      listeners.forEach((l) => l());
    },
    subscribe: (listener: () => void): (() => void) => {
      listeners.push(listener);
      return () => listeners.splice(listeners.indexOf(listener), 1);
    },
  };
}
```

### Project 3 — Form Validation Library

```typescript
// Type-safe form validation
type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

type FieldSchema<T> = {
  type: T;
  rules: ValidationRule<T>[];
  required?: boolean;
};

type FormSchema = Record<string, FieldSchema<unknown>>;

type FormErrors<T extends FormSchema> = Partial<Record<keyof T, string[]>>;

function createValidator<T extends FormSchema>(schema: T) {
  return function validate(data: Record<keyof T, unknown>): FormErrors<T> {
    const errors: FormErrors<T> = {};
    // ... validation logic
    return errors;
  };
}
```

---

## Cheat Sheet Nhanh Cho Phỏng Vấn

### Top 10 câu hỏi phỏng vấn TypeScript

1. **`type` vs `interface` — khi nào dùng cái nào?**  
   Interface cho object shapes/public APIs + khi cần declaration merging. Type cho union/intersection/primitives/computed types.

2. **`unknown` vs `any` — khác nhau thế nào?**  
   `any` tắt type checking hoàn toàn. `unknown` type-safe: phải narrow trước khi dùng.

3. **Giải thích Type Guards — các loại?**  
   `typeof`, `instanceof`, `in`, user-defined predicate (`value is Type`), assertion functions.

4. **Conditional Types là gì?**  
   `T extends U ? X : Y` — type-level if/else. Với `infer` để extract nested types.

5. **Mapped Types — dùng khi nào?**  
   Transform mọi property trong một type (`[K in keyof T]: ...`). Dùng cho Readonly, Partial, Pick tự tạo.

6. **Utility Types quan trọng nhất?**  
   `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`.

7. **Generic Constraints — ví dụ thực tế?**  
   `function getKey<T, K extends keyof T>(obj: T, key: K): T[K]`

8. **Discriminated Union là gì?**  
   Union type với common discriminant field (`kind`, `type`). TypeScript tự narrow trong switch/if.

9. **Declaration Merging dùng khi nào?**  
   Extend library types (Express Request, Window), augment global types.

10. **`satisfies` operator (TS 4.9) dùng để làm gì?**  
    Check type compatibility nhưng giữ nguyên inferred literal types (không widening như annotation).

---

_File này là preview nội dung — toàn bộ sẽ được implement thành web app với kiến trúc nodejs-docs (Vite + React + React Router)._

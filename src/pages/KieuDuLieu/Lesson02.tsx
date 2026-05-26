import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const INTERFACE_BASIC = `// Interface — định nghĩa shape của object
interface User {
  id: number;
  name: string;
  email: string;
  readonly createdAt: Date; // chỉ đọc
  avatar?: string;          // optional
}

const alice: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date(),
  // avatar có thể bỏ qua
};

// Interface cho function
interface Comparator<T> {
  (a: T, b: T): number;
}
const numSort: Comparator<number> = (a, b) => a - b;

// Interface cho class — "implements"
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

class UserModel implements Serializable {
  constructor(public name: string) {}
  serialize(): string { return JSON.stringify({ name: this.name }); }
  deserialize(data: string): void { this.name = JSON.parse(data).name; }
}`;

const INTERFACE_EXTENDS = `// Extending interface — thêm properties từ interface khác
interface Animal {
  name: string;
  age: number;
}

interface Pet extends Animal {
  owner: string;
  vaccinated: boolean;
}

interface ServiceAnimal extends Pet {
  certificationId: string;
  serviceType: 'guide' | 'medical' | 'emotional';
}

// Multiple extends — kết hợp nhiều interfaces
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Auditable {
  createdBy: string;
  updatedBy: string;
}

interface Post extends Timestamped, Auditable {
  id: number;
  title: string;
  content: string;
}

// Interface extends type alias cũng được
type HasId = { id: number };
interface Comment extends HasId {
  text: string;
  postId: number;
}`;

const DECLARATION_MERGING = `// Declaration Merging — chỉ interface mới có!
// Khai báo cùng tên interface 2 lần → TypeScript merge chúng

interface Window {
  myPlugin: { version: string; init: () => void };
}
// Bây giờ window.myPlugin tồn tại trong type system
window.myPlugin.init();

// Thực tế: extend global types (express, jest...)
// Extend Express Request để thêm user field
interface Request {
  user?: { id: string; role: string };
}

// Extend Array với custom method type
interface Array<T> {
  groupBy(key: keyof T): Record<string, T[]>;
}

// Lưu ý: declaration merging CỰC KỲ hữu ích khi:
// 1. Thêm types cho thư viện bên ngoài
// 2. Extend global objects (Window, Request, ...)
// 3. Module augmentation

// type alias KHÔNG có declaration merging
type Point = { x: number };
type Point = { y: number }; // Error: Duplicate identifier 'Point'!`;

const INTERFACE_VS_TYPE = `// Interface vs Type Alias — khi nào dùng cái nào?

// ✓ Dùng interface khi:
// 1. Định nghĩa object shape (API response, DTO, model)
interface UserDTO {
  id: number;
  name: string;
  email: string;
}

// 2. Cần extends (OOP style)
interface AdminDTO extends UserDTO {
  role: 'admin';
  permissions: string[];
}

// 3. Cần declaration merging (thư viện, global types)
interface Window { analytics: Analytics }

// ✓ Dùng type alias khi:
// 1. Union types
type Status = 'active' | 'inactive' | 'pending';

// 2. Tuple types
type RGB = [red: number, green: number, blue: number];

// 3. Primitive aliases
type UserId = string;

// 4. Computed/mapped types
type ReadonlyUser = Readonly<UserDTO>;
type PartialUser = Partial<UserDTO>;

// 5. Intersection (ngắn hơn extends khi ad-hoc)
type AdminUser = UserDTO & { role: 'admin' };`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson02({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-02"
      num="02"
      title="Interfaces"
      desc="Object shape, extends, declaration merging, và interface vs type alias"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Interface trong TypeScript">
        <Concept>
          <p>
            <strong>Interface</strong> định nghĩa <em>shape</em> của object — tên property, type, và
            tính optional/readonly. Khác với <code className="ic">type</code>, interface có thể{' '}
            <strong>extends</strong> và hỗ trợ <strong>declaration merging</strong>.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Interface cơ bản', code: INTERFACE_BASIC },
            { label: 'Extends', code: INTERFACE_EXTENDS },
            { label: 'Declaration merging', code: DECLARATION_MERGING },
            { label: 'Interface vs Type', code: INTERFACE_VS_TYPE },
          ]}
        />
      </Sec>

      <Sec title="Interface vs Type Alias — cheat sheet">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Tính năng</th>
              <th>interface</th>
              <th>type alias</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Object types', '✓', '✓'],
              ['Primitive types', '✗', '✓'],
              ['Union types', '✗', '✓'],
              ['Tuple types', '✗', '✓'],
              ['Extends / &', '✓ (extends)', '✓ (&)'],
              ['Declaration merging', '✓', '✗'],
              ['implements (class)', '✓', '✓'],
              ['Computed properties', 'Hạn chế', '✓'],
            ].map(([feature, iface, type]) => (
              <tr key={feature}>
                <td>{feature}</td>
                <td
                  style={{
                    color:
                      iface === '✓' ? 'var(--green)' : iface === '✗' ? 'var(--red)' : undefined,
                  }}
                >
                  {iface}
                </td>
                <td
                  style={{
                    color: type === '✓' ? 'var(--green)' : type === '✗' ? 'var(--red)' : undefined,
                  }}
                >
                  {type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Rule of thumb:</strong> Dùng <code className="ic">interface</code> cho public API
          và object shapes (DTO, model, component props). Dùng <code className="ic">type</code> cho
          unions, intersections, primitives, và computed types. Nhất quán trong codebase là quan
          trọng hơn quy tắc cứng nhắc.
        </Callout>
        <Callout type="warn">
          <strong>Declaration merging có thể gây bất ngờ:</strong> Nếu tên interface bị trùng ở
          nhiều file, TypeScript sẽ merge chúng. Đây là tính năng cố ý (dùng để extend thư viện)
          nhưng có thể gây nhầm lẫn nếu không cẩn thận. Đặt tên cẩn thận hoặc dùng{' '}
          <code className="ic">type</code> nếu không muốn merging.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Thiết kế interfaces cho hệ thống blog: IAuthor (id, name, email, bio?), IPost (id, title, content, author: IAuthor, tags: string[], publishedAt: Date | null), IComment (id, text, author: IAuthor, postId: number).',
            },
            {
              level: 'medium',
              text: 'Viết generic interface IRepository<T> với các methods: findById(id: number): Promise<T | null>, findAll(): Promise<T[]>, create(data: Omit<T, "id">): Promise<T>, update(id: number, data: Partial<T>): Promise<T>, delete(id: number): Promise<void>.',
            },
            {
              level: 'hard',
              text: 'Dùng declaration merging để extend Express Request: interface Request { user?: { id: string; role: "admin" | "user" } }. Sau đó viết middleware type-safe extractUser(req: Request): req is Request & { user: NonNullable<Request["user"]> }.',
            },
          ]}
          hint="IRepository<T> dùng cho any model (UserRepository implements IRepository<IUser>). Declaration merging với Express cần: declare global { namespace Express { interface Request { ... } } }"
        />
      </Sec>
    </LessonCard>
  );
}

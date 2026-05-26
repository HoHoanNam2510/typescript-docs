import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const PARTIAL_REQUIRED = `// Partial<T> — làm tất cả properties optional
type User = { id: number; name: string; email: string; role: string };

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; role?: string }

// Thực tế: update payloads — chỉ cần gửi các field muốn update
function updateUser(id: number, changes: Partial<User>): User {
  const current = findUser(id);
  return { ...current, ...changes };
}
updateUser(1, { name: 'Bob' });           // chỉ update name
updateUser(1, { role: 'admin' });         // chỉ update role

// Required<T> — ngược lại, tất cả fields bắt buộc
type Config = { host?: string; port?: number; debug?: boolean };
type FullConfig = Required<Config>;
// { host: string; port: number; debug: boolean }

function initApp(config: Required<Config>) { /* ... */ }`;

const PICK_OMIT = `// Pick<T, K> — chọn một số properties từ T
type User = { id: number; name: string; email: string; password: string; role: string };

type PublicUser = Pick<User, 'id' | 'name' | 'email'>;
// { id: number; name: string; email: string } — không có password!

type UserSummary = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit<T, K> — ngược lại, loại bỏ một số properties
type SafeUser = Omit<User, 'password'>;
// { id: number; name: string; email: string; role: string }

type UserInput = Omit<User, 'id' | 'role'>; // không có id (auto-gen) và role (default)

// Kết hợp Omit + Partial — pattern cực kỳ phổ biến trong CRUD
type CreateUserInput = Omit<User, 'id'>;           // tạo mới — không có id
type UpdateUserInput = Partial<Omit<User, 'id'>>;  // update — tất cả optional trừ id`;

const RECORD_EXTRACT = `// Record<K, V> — object type với cụ thể keys và values
type Role = 'admin' | 'editor' | 'viewer';
type Permission = 'read' | 'write' | 'delete';

type RolePermissions = Record<Role, Permission[]>;
const permissions: RolePermissions = {
  admin:  ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read'],
};

// Record với computed keys
type ApiStatus = Record<string, { code: number; message: string }>;

// Extract<T, U> — lấy các types từ T mà extends U
type AllEvents = 'click' | 'focus' | 'blur' | 'mouseenter' | 'mouseleave';
type MouseEvents = Extract<AllEvents, 'click' | 'mouseenter' | 'mouseleave'>;
// "click" | "mouseenter" | "mouseleave"

// Exclude<T, U> — ngược lại, loại bỏ types
type NonMouseEvents = Exclude<AllEvents, MouseEvents>;
// "focus" | "blur"

// ReturnType & Parameters — đã học bài trước
type FetchFn = (url: string, options?: RequestInit) => Promise<Response>;
type FetchReturn = ReturnType<FetchFn>; // Promise<Response>
type FetchParams = Parameters<FetchFn>; // [url: string, options?: RequestInit]`;

const UTILITY_COMBINATIONS = `// Kết hợp nhiều utility types — pattern thực tế

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

// CRUD input types — pattern chuẩn
type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;
type UserResponse    = Omit<User, 'password'>; // không gửi password về client

// Form state types
type UserForm = {
  values: { [K in keyof CreateUserInput]: string }; // tất cả là string (input)
  errors: Partial<Record<keyof CreateUserInput, string>>; // optional errors
  touched: Record<keyof CreateUserInput, boolean>;
};

// Readonly cho immutable data
type ImmutableUser = Readonly<User>;

// Deep Partial — cho nested objects (tự implement hoặc dùng thư viện)
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson10({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="kd-10"
      num="10"
      title="Utility Types"
      desc="Partial, Required, Pick, Omit, Record, Extract, Exclude — và cách kết hợp"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Utility Types — bộ công cụ type manipulation">
        <Concept>
          <p>
            TypeScript có sẵn bộ <strong>Utility Types</strong> giúp transform types mà không cần
            viết mapped/conditional types thủ công. Đây là những tools thực tế được dùng hàng ngày
            trong mọi TypeScript codebase.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Partial & Required', code: PARTIAL_REQUIRED },
            { label: 'Pick & Omit', code: PICK_OMIT },
            { label: 'Record & Extract', code: RECORD_EXTRACT },
            { label: 'Kết hợp thực tế', code: UTILITY_COMBINATIONS },
          ]}
        />
      </Sec>

      <Sec title="Tóm tắt các Utility Types">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Utility Type</th>
              <th>Ý nghĩa</th>
              <th>Dùng khi</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Partial<T>', 'Tất cả fields optional', 'Update payload, config với defaults'],
              ['Required<T>', 'Tất cả fields bắt buộc', 'Validate đầy đủ config'],
              ['Readonly<T>', 'Tất cả fields readonly', 'Immutable data, constants'],
              ['Pick<T, K>', 'Chọn một số fields', 'Public response, projection'],
              ['Omit<T, K>', 'Loại bỏ một số fields', 'Bỏ password, bỏ auto fields'],
              ['Record<K, V>', 'Object với fixed keys', 'Map, lookup table, enum→data'],
              ['Extract<T, U>', 'Giữ types match U', 'Filter union type'],
              ['Exclude<T, U>', 'Loại bỏ types match U', 'Remove from union'],
              ['NonNullable<T>', 'Bỏ null | undefined', 'Sau khi đã validate'],
              ['ReturnType<F>', 'Return type của function', 'Derive type từ function'],
            ].map(([util, meaning, when]) => (
              <tr key={util}>
                <td>
                  <code>{util}</code>
                </td>
                <td>{meaning}</td>
                <td>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Omit + Partial — pattern CRUD chuẩn:</strong>{' '}
          <code className="ic">CreateInput = Omit&lt;T, 'id'&gt;</code>,{' '}
          <code className="ic">UpdateInput = Partial&lt;Omit&lt;T, 'id'&gt;&gt;</code>,{' '}
          <code className="ic">Response = Omit&lt;T, 'password'&gt;</code>. Đây là 3 types cần trong
          hầu hết mọi API endpoint CRUD.
        </Callout>
        <Callout type="warn">
          <strong>Record vs index signature:</strong>{' '}
          <code className="ic">Record&lt;string, V&gt;</code> tương đương với{' '}
          <code className="ic">{'{ [key: string]: V }'}</code> nhưng ngắn hơn.{' '}
          <code className="ic">Record&lt;'a' | 'b', V&gt;</code> yêu cầu PHẢI có cả key 'a' và 'b' —
          không optional. Dùng Record khi muốn enforce đủ keys.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Cho type Product = { id: string; name: string; price: number; stock: number; description: string }. Tạo: CreateProductInput, UpdateProductInput, ProductSummary (chỉ id, name, price).',
            },
            {
              level: 'medium',
              text: 'Viết type-safe function updateEntity<T extends {id: string}>(entity: T, updates: Partial<Omit<T, "id">>): T — merge updates vào entity. Return type phải là T, không phải any.',
            },
            {
              level: 'hard',
              text: 'Implement DeepPartial<T> — làm partial đệ quy, kể cả nested objects và arrays. Đảm bảo arrays vẫn là arrays (không bị biến thành objects).',
            },
          ]}
          hint="CreateProductInput = Omit<Product, 'id'>. updateEntity: return { ...entity, ...updates } as T. DeepPartial: T[K] extends (infer U)[] ? DeepPartial<U>[] : T[K] extends object ? DeepPartial<T[K]> : T[K]."
        />
      </Sec>
    </LessonCard>
  );
}

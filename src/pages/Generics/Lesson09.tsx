import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const CUSTOM_PARTIAL_REQUIRED = `// Tự build Partial, Required, Readonly từ mapped types

// Partial — tất cả optional
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// Required — xóa optional (modifier -)
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

// Readonly
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

// Mutable — xóa readonly
type MyMutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// Readonly specific keys, rest normal
type ReadonlyKeys<T, K extends keyof T> = {
  readonly [P in K]: T[P];
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

type ImmutableId = ReadonlyKeys<User, 'id' | 'role'>;
// { readonly id: string; name: string; email: string; readonly role: ... }

// Optional specific keys, rest required
type PartialKeys<T, K extends keyof T> = {
  [P in K]?: T[P];
} & {
  [P in Exclude<keyof T, K>]: T[P];
};

type OptionalEmail = PartialKeys<User, 'email' | 'role'>;`;

const CUSTOM_PICK_OMIT = `// Tự build Pick, Omit, Record

// Pick — chọn keys
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit — loại bỏ keys
type MyOmit<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};
// Hoặc: MyPick<T, Exclude<keyof T, K>>

// Record
type MyRecord<K extends string | number | symbol, V> = {
  [P in K]: V;
};

// ValueOf — lấy union của tất cả values
type ValueOf<T> = T[keyof T];

type RoleMap = { admin: 1; editor: 2; viewer: 3 };
type RoleCode = ValueOf<RoleMap>; // 1 | 2 | 3

// InvertRecord — flip keys và values
type InvertRecord<T extends Record<string, string | number>> = {
  [K in keyof T as \`\${T[K]}\`]: K;
};

type Inverted = InvertRecord<{ a: 'A'; b: 'B'; c: 'C' }>;
// { A: "a"; B: "b"; C: "c" }

// Flatten union of objects → intersection
type UnionToIntersection<U> =
  (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

type ABC = UnionToIntersection<{ a: 1 } | { b: 2 } | { c: 3 }>;
// { a: 1 } & { b: 2 } & { c: 3 }`;

const CUSTOM_CONDITIONAL = `// Tự build conditional utility types

// NonNullable
type MyNonNullable<T> = T extends null | undefined ? never : T;

// Exclude
type MyExclude<T, U> = T extends U ? never : T;

// Extract
type MyExtract<T, U> = T extends U ? T : never;

// Awaited (recursive)
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;

// IsNever
type IsNever<T> = [T] extends [never] ? true : false;

// IsAny
type IsAny<T> = 0 extends 1 & T ? true : false;

// IsUnion — check nếu T là union (hơn 1 member)
type IsUnion<T, U = T> =
  T extends unknown
    ? [U] extends [T] ? false : true
    : never;

type IU1 = IsUnion<string>;           // false
type IU2 = IsUnion<string | number>;  // true
type IU3 = IsUnion<never>;            // never

// Prettify — làm intersection types đọc dễ hơn
type Prettify<T> = {
  [K in keyof T]: T[K];
} & Record<string, never>;

type AB = { a: string } & { b: number };
type PrettyAB = Prettify<AB>; // { a: string; b: number } (no & visible)`;

const PRACTICAL_COMBINATIONS = `// Practical combinations — patterns dùng trong thực tế

// CRUD type generator
type CrudTypes<Entity extends { id: string }> = {
  Create: Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>;
  Update: Partial<Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>>;
  Response: Omit<Entity, 'password' | 'secret'>;
  List: { items: CrudTypes<Entity>['Response'][]; total: number; page: number };
};

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

type UserCrud = CrudTypes<User>;
type CreateUser = UserCrud['Create'];   // { name, email, password }
type UpdateUser = UserCrud['Update'];   // { name?, email?, password? }
type UserResponse = UserCrud['Response']; // { id, name, email, createdAt, updatedAt }

// Form state generator
type FormState<T extends object> = {
  values: { [K in keyof T]: T[K] extends boolean ? boolean : string };
  errors: Partial<Record<keyof T, string>>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isDirty: boolean;
};

type UserFormState = FormState<CreateUser>;

// API route definition
type ApiRoutes = {
  [Route in string]: {
    GET?: unknown;
    POST?: unknown;
    PUT?: unknown;
    DELETE?: unknown;
  };
};

type TypedFetch<Routes extends ApiRoutes> = {
  get<R extends keyof Routes>(route: R): Promise<Routes[R]['GET']>;
  post<R extends keyof Routes>(route: R, body: Routes[R]['POST']): Promise<unknown>;
};`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson09({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="gen-09"
      num="09"
      title="Custom Utility Types"
      desc="Tự build Partial/Pick/Omit, InvertRecord, CrudTypes, FormState generator"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Custom Utility Types">
        <Concept>
          <p>
            Hiểu cách build utility types từ đầu giúp bạn không chỉ dùng được TypeScript built-ins
            mà còn tạo ra những types đặc thù cho project. Kết hợp <strong>mapped types</strong>,{' '}
            <strong>conditional types</strong>, và <strong>key remapping</strong> tạo ra power tools
            tái sử dụng được trong cả team.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Partial, Required, Readonly', code: CUSTOM_PARTIAL_REQUIRED },
            { label: 'Pick, Omit, Record', code: CUSTOM_PICK_OMIT },
            { label: 'Conditional utilities', code: CUSTOM_CONDITIONAL },
            { label: 'Practical combinations', code: PRACTICAL_COMBINATIONS },
          ]}
        />
      </Sec>

      <Sec title="Custom utility type checklist">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Utility</th>
              <th>Mechanism</th>
              <th>Key insight</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['PartialKeys<T,K>', 'mapped + Exclude', 'Split keys into 2 groups'],
              ['ReadonlyKeys<T,K>', 'readonly modifier + &', 'Intersection of two mapped types'],
              ['PickByValue<T,V>', 'Key remapping: as never', 'Filter keys by value type'],
              ['InvertRecord<T>', 'as `${T[K]}`', 'Use value as key via template literal'],
              ['CrudTypes<Entity>', 'Nested type object', 'Generate all CRUD types at once'],
              ['FormState<T>', 'Transform values to string', 'Form-friendly version of type'],
            ].map(([util, mech, insight]) => (
              <tr key={util}>
                <td>
                  <code>{util}</code>
                </td>
                <td>{mech}</td>
                <td>{insight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>Prettify để debug types:</strong> Khi type là intersection (A &amp; B &amp; C),
          IDE hiển thị khó đọc. Dùng{' '}
          <code className="ic">type Prettify&lt;T&gt; = {'{ [K in keyof T]: T[K] }'}</code> để
          flatten thành 1 object type dễ đọc hơn. Không ảnh hưởng runtime.
        </Callout>
        <Callout type="warn">
          <strong>IsAny trick:</strong> <code className="ic">0 extends 1 & T ? true : false</code>{' '}
          hoạt động vì <code className="ic">1 & any = any</code> và{' '}
          <code className="ic">0 extends any = true</code>. Đây là hack — không có cách "official"
          để detect any trong TypeScript.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tự implement: PickByValue<T, V>, OmitByValue<T, V>, FunctionKeys<T> (keys có value là Function), NonFunctionKeys<T>. Test với User interface có cả data và method properties.',
            },
            {
              level: 'medium',
              text: 'Implement CrudTypes<Entity> tổng quát (như ví dụ). Test với Post interface { id, title, content, authorId, publishedAt, createdAt, updatedAt }. Verify các generated types đúng.',
            },
            {
              level: 'hard',
              text: 'Implement type SchemaToType<S> convert JSON Schema object sang TypeScript type: { type: "string" } → string, { type: "number" } → number, { type: "object"; properties: {...} } → { [key]: SchemaToType<...> }.',
            },
          ]}
          hint="PickByValue: key remapping as T[K] extends V ? K : never. CrudTypes: nested type object với Omit + Partial. SchemaToType: S extends {type: 'string'} ? string : S extends {type: 'object', properties: infer P} ? {[K in keyof P]: SchemaToType<P[K]>} : never."
        />
      </Sec>
    </LessonCard>
  );
}

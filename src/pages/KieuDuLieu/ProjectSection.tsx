import CodeBlock from '../../components/CodeBlock';

const PROJECT_CODE = `// crud-types.ts — Project cuối Module 02
// Áp dụng: interfaces, type aliases, utility types, mapped types, conditional types

// 1. Base entity interface
interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Domain types
interface User extends Entity {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

interface Post extends Entity {
  title: string;
  content: string;
  authorId: string;
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  publishedAt: Date | null;
}

// 3. CRUD input types — pattern chuẩn dùng Omit + Partial
type CreateInput<T extends Entity> = Omit<T, keyof Entity>;
type UpdateInput<T extends Entity> = Partial<Omit<T, keyof Entity>>;

// 4. Safe response — loại bỏ sensitive fields
type SafeUser = Omit<User, 'password'>;
type PostSummary = Pick<Post, 'id' | 'title' | 'authorId' | 'status' | 'publishedAt'>;

// 5. Generic Repository interface
interface IRepository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(data: CreateInput<T>): Promise<T>;
  update(id: string, data: UpdateInput<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// 6. Type-safe API result — discriminated union
type ApiResult<T> =
  | { success: true; data: T; statusCode: 200 | 201 }
  | { success: false; error: string; statusCode: 400 | 401 | 404 | 500 };

// 7. Conditional type: extract non-nullable fields
type RequiredFields<T> = {
  [K in keyof T as undefined extends T[K] ? never : K]: T[K];
};

type UserRequired = RequiredFields<User>;
// { id: string; name: string; email: string; password: string; role: ... }

// 8. User service — dùng tất cả types trên
class UserService implements IRepository<User> {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) ?? null;
  }

  async findAll(filter?: Partial<User>): Promise<User[]> {
    if (!filter) return this.users;
    return this.users.filter(user =>
      Object.entries(filter).every(([k, v]) => user[k as keyof User] === v)
    );
  }

  async create(data: CreateInput<User>): Promise<User> {
    const user: User = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, data: UpdateInput<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error(\`User \${id} not found\`);
    this.users[index] = { ...this.users[index], ...data, updatedAt: new Date() };
    return this.users[index];
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }

  // Return safe user (no password)
  async getSafeUser(id: string): Promise<ApiResult<SafeUser>> {
    const user = await this.findById(id);
    if (!user) return { success: false, error: 'User not found', statusCode: 404 };
    const { password, ...safeUser } = user;
    return { success: true, data: safeUser, statusCode: 200 };
  }
}`;

export default function ProjectSection() {
  return (
    <div
      style={{
        marginTop: '3rem',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '1.5rem 2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1rem' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            background: 'var(--accent)',
            color: '#000',
            padding: '2px 8px',
            borderRadius: 4,
            fontWeight: 700,
          }}
        >
          PROJECT
        </span>
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Cuối Module 02</span>
      </div>

      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        crud-types.ts — Type-safe CRUD Repository
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Xây dựng hệ thống CRUD types hoàn chỉnh kết hợp kiến thức Module 02:{' '}
        <strong>interfaces</strong> cho entity và repository, <strong>utility types</strong> (Omit,
        Partial, Pick) cho CRUD inputs, <strong>discriminated union</strong> cho ApiResult,{' '}
        <strong>conditional types</strong> để extract required fields, và{' '}
        <strong>generic repository</strong> pattern tái sử dụng được.
      </p>

      <CodeBlock code={PROJECT_CODE} />

      <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--text3)' }}>
        Checklist tự review: <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> Generic{' '}
        <code className="ic">IRepository&lt;T&gt;</code> — dùng lại cho mọi entity <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">CreateInput&lt;T&gt;</code> và{' '}
        <code className="ic">UpdateInput&lt;T&gt;</code> tự derive từ Entity <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> Không có <code className="ic">any</code> —
        dùng generics và utility types <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> <code className="ic">tsc --noEmit</code>{' '}
        không lỗi
      </div>
    </div>
  );
}

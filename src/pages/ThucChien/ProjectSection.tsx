import CodeBlock from '../../components/CodeBlock';

const PROJECT_CODE = `// thuchien-project.ts — Project cuối Module 06
// Mini Type-Safe REST API: Express + Zod + Result + Custom middleware
// Kết hợp: Node.js types, Express typing, Zod validation,
//          Result pattern, error hierarchy, typed middleware

// ═══════════════════════════════════════════════════
// PART 1: Types & Result pattern
// ═══════════════════════════════════════════════════

type Result<T, E extends Error = Error> =
  | { success: true;  data:  T }
  | { success: false; error: E };

function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function err<E extends Error>(error: E): Result<never, E> {
  return { success: false, error };
}

// ═══════════════════════════════════════════════════
// PART 2: Custom Error hierarchy
// ═══════════════════════════════════════════════════

class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(\`\${resource} '\${id}' not found\`, 404, 'NOT_FOUND');
  }
}

class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

// ═══════════════════════════════════════════════════
// PART 3: Zod schemas + inferred types
// ═══════════════════════════════════════════════════

import { z } from 'zod';

const CreateUserSchema = z.object({
  name:  z.string().min(2, 'Name must be >= 2 chars').max(50),
  email: z.string().email('Invalid email'),
  role:  z.enum(['admin', 'user']).default('user'),
});

const UpdateUserSchema = CreateUserSchema.partial().refine(
  data => Object.keys(data).length > 0,
  { message: 'At least one field required' }
);

const PaginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

// Infer types từ schemas — single source of truth
type CreateUserDto = z.infer<typeof CreateUserSchema>;
type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
type PaginationDto = z.infer<typeof PaginationSchema>;

interface User extends CreateUserDto {
  id:        string;
  createdAt: Date;
}

// ═══════════════════════════════════════════════════
// PART 4: Repository interface + in-memory implementation
// ═══════════════════════════════════════════════════

interface IUserRepository {
  findAll(pagination: PaginationDto): Promise<{ users: User[]; total: number }>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(dto: CreateUserDto): Promise<User>;
  update(id: string, dto: UpdateUserDto): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  async findAll({ page, limit }: PaginationDto) {
    const all = Array.from(this.users.values());
    const start = (page - 1) * limit;
    return { users: all.slice(start, start + limit), total: all.length };
  }

  async findById(id: string) {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string) {
    return Array.from(this.users.values()).find(u => u.email === email) ?? null;
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user: User = { ...dto, id: crypto.randomUUID(), createdAt: new Date() };
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...dto };
    this.users.set(id, updated);
    return updated;
  }

  async delete(id: string) {
    return this.users.delete(id);
  }
}

// ═══════════════════════════════════════════════════
// PART 5: UserService — business logic với Result type
// ═══════════════════════════════════════════════════

class UserService {
  constructor(private readonly repo: IUserRepository) {}

  async list(query: unknown): Promise<Result<{ users: User[]; total: number }>> {
    const parsed = PaginationSchema.safeParse(query);
    if (!parsed.success) return err(new AppError(parsed.error.message, 400, 'VALIDATION_ERROR'));
    return ok(await this.repo.findAll(parsed.data));
  }

  async getById(id: string): Promise<Result<User>> {
    const user = await this.repo.findById(id);
    if (!user) return err(new NotFoundError('User', id));
    return ok(user);
  }

  async create(body: unknown): Promise<Result<User, AppError>> {
    const parsed = CreateUserSchema.safeParse(body);
    if (!parsed.success) return err(new AppError(parsed.error.message, 400, 'VALIDATION_ERROR'));

    const existing = await this.repo.findByEmail(parsed.data.email);
    if (existing) return err(new ConflictError(\`Email \${parsed.data.email} already registered\`));

    return ok(await this.repo.create(parsed.data));
  }

  async update(id: string, body: unknown): Promise<Result<User, AppError>> {
    const parsed = UpdateUserSchema.safeParse(body);
    if (!parsed.success) return err(new AppError(parsed.error.message, 400, 'VALIDATION_ERROR'));

    const user = await this.repo.update(id, parsed.data);
    if (!user) return err(new NotFoundError('User', id));
    return ok(user);
  }

  async delete(id: string): Promise<Result<void, AppError>> {
    const deleted = await this.repo.delete(id);
    if (!deleted) return err(new NotFoundError('User', id));
    return ok(undefined);
  }
}

// ═══════════════════════════════════════════════════
// PART 6: Express router — typed handlers
// ═══════════════════════════════════════════════════

import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

const service = new UserService(new InMemoryUserRepository());
const userRouter = express.Router();

// Helper — gọi service và trả về response từ Result
function handleResult<T>(res: Response, result: Result<T>, successStatus = 200): void {
  if (result.success) {
    res.status(successStatus).json({ data: result.data });
  } else {
    const e = result.error;
    res.status(e instanceof AppError ? e.statusCode : 500).json({
      error: e.message,
      code:  e instanceof AppError ? e.code : 'INTERNAL_ERROR',
    });
  }
}

userRouter
  .get('/', async (req: Request, res: Response) => {
    handleResult(res, await service.list(req.query));
  })
  .get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    handleResult(res, await service.getById(req.params.id));
  })
  .post('/', async (req: Request, res: Response) => {
    handleResult(res, await service.create(req.body), 201);
  })
  .put('/:id', async (req: Request<{ id: string }>, res: Response) => {
    handleResult(res, await service.update(req.params.id, req.body));
  })
  .delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    handleResult(res, await service.delete(req.params.id), 204);
  });

// Global error handler
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status  = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message   : 'Internal Server Error';
  res.status(status).json({ error: message });
};

const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use(errorHandler);

app.listen(3000, () => console.log('API running on :3000'));`;

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
        <span style={{ fontSize: 13, color: 'var(--text3)' }}>Cuối Module 06</span>
      </div>

      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>
        thuchien-project.ts — Mini Type-Safe REST API
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1rem', lineHeight: 1.6 }}>
        Kết hợp toàn bộ kiến thức Module 06: <strong>Node.js + Express</strong> với typed
        Request/Response, <strong>Zod</strong> cho runtime validation và type inference,{' '}
        <strong>Result&lt;T,E&gt;</strong> pattern cho error handling không dùng exception,{' '}
        <strong>custom error hierarchy</strong> (AppError → NotFoundError → ConflictError),{' '}
        <strong>Repository pattern</strong> với interface (testable, swappable), và{' '}
        <strong>typed middleware</strong> helper để serialize Result thành HTTP response.
      </p>

      <CodeBlock code={PROJECT_CODE} />

      <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--text3)' }}>
        Checklist tự review: <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">IUserRepository</code> — interface cho testability, InMemory
        implementation
        <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> <code className="ic">Zod schemas</code> —
        CreateUserSchema, UpdateUserSchema, PaginationSchema với <code className="ic">z.infer</code>
        <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">Result&lt;T,E&gt;</code> — ok/err helpers, service methods trả về
        Result
        <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">AppError hierarchy</code> — NotFoundError, ConflictError với statusCode
        <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span>{' '}
        <code className="ic">Express typed handlers</code> — Request&lt;Params&gt;, handleResult
        helper
        <br />
        &nbsp;
        <span style={{ color: 'var(--accent)' }}>✓</span> <code className="ic">tsc --noEmit</code>{' '}
        không lỗi
      </div>
    </div>
  );
}

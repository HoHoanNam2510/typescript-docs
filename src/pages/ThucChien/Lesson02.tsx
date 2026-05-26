import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const EXPRESS_SETUP = `// TypeScript với Express — setup cơ bản
// npm install express
// npm install -D @types/express

import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// Basic typed handler
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Generic typed handlers — Request<Params, ResBody, ReqBody, Query>
interface UserParams { id: string; }
interface CreateUserBody { name: string; email: string; role?: string; }

app.get('/users/:id', async (req: Request<UserParams>, res: Response) => {
  const { id } = req.params; // string — typed!
  const user = await UserService.findById(id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post(
  '/users',
  async (req: Request<{}, unknown, CreateUserBody>, res: Response) => {
    const { name, email, role = 'user' } = req.body; // CreateUserBody — typed!
    const user = await UserService.create({ name, email, role });
    res.status(201).json(user);
  }
);

app.listen(3000);`;

const MIDDLEWARE = `// Typed middleware & error handling

import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// Auth middleware — augment Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: 'admin' | 'user' };
      requestId?: string;
    }
  }
}

// Middleware tự động có access req.user
const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    req.user = await verifyToken(token); // gán vào req.user
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Request ID middleware
const requestId = (req: Request, _res: Response, next: NextFunction): void => {
  req.requestId = crypto.randomUUID();
  next();
};

// Error handler — PHẢI có 4 params để Express nhận diện
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  const status = err.statusCode ?? 500;
  const message = err.message ?? 'Internal Server Error';
  res.status(status).json({ error: message, code: err.code });
};

// Dùng middleware
const router = express.Router();
router.use(requestId);
router.use(authenticate); // tất cả routes dưới đây cần auth
router.get('/profile', (req, res) => {
  res.json({ user: req.user }); // req.user là typed!
});`;

const TYPED_ROUTER = `// Type-safe router pattern — tách biệt route/controller/service

// DTOs — Data Transfer Objects
interface CreatePostDto {
  title: string;
  content: string;
  authorId: string;
  tags?: string[];
}

interface UpdatePostDto {
  title?: string;
  content?: string;
  tags?: string[];
}

// Controller — nhận typed req/res
class PostController {
  async getAll(req: Request<{}, Post[], {}, { page?: string; limit?: string }>, res: Response<Post[]>) {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const posts = await PostService.findAll({ page, limit });
    res.json(posts);
  }

  async create(req: Request<{}, Post, CreatePostDto>, res: Response<Post>) {
    const post = await PostService.create(req.body);
    res.status(201).json(post);
  }

  async update(req: Request<{ id: string }, Post, UpdatePostDto>, res: Response<Post>) {
    const post = await PostService.update(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: 'Not found' } as any);
    res.json(post);
  }

  async delete(req: Request<{ id: string }>, res: Response) {
    await PostService.delete(req.params.id);
    res.status(204).end();
  }
}

// Router factory — clean và DRY
const ctrl = new PostController();
const postRouter = express.Router();

postRouter
  .get('/',         ctrl.getAll.bind(ctrl))
  .post('/',        ctrl.create.bind(ctrl))
  .put('/:id',      ctrl.update.bind(ctrl))
  .delete('/:id',   ctrl.delete.bind(ctrl));`;

const ERROR_CLASSES = `// Custom error hierarchy cho Express

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
  constructor(resource: string, id?: string) {
    super(
      id ? \`\${resource} '\${id}' not found\` : \`\${resource} not found\`,
      404,
      'NOT_FOUND'
    );
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields?: Record<string, string>
  ) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

// Type guard
function isAppError(e: unknown): e is AppError {
  return e instanceof AppError;
}

// Error handler middleware sử dụng hierarchy
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (isAppError(err)) {
    res.status(err.statusCode).json({
      error: err.message,
      code:  err.code,
      ...(err instanceof ValidationError && err.fields ? { fields: err.fields } : {}),
    });
  } else {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal Server Error', code: 'INTERNAL_ERROR' });
  }
};

// Usage trong controller
async function getUser(req: Request<{ id: string }>, res: Response) {
  const user = await db.findUser(req.params.id);
  if (!user) throw new NotFoundError('User', req.params.id);
  res.json(user);
}`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson02({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-02"
      num="02"
      title="TypeScript với Express"
      desc="Typed routes, middleware, error handling, Request augmentation, controller pattern"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Express + TypeScript">
        <Concept>
          <p>
            Express có generic types cho{' '}
            <code className="ic">Request&lt;Params, ResBody, ReqBody, Query&gt;</code> — 4 type
            params cho route typing. <strong>Module augmentation</strong> (
            <code className="ic">
              declare global {'{'} namespace Express {'{'} interface Request
            </code>
            ) là cách chuẩn để thêm custom props như <code className="ic">req.user</code>. Custom
            error hierarchy + typed <code className="ic">ErrorRequestHandler</code> (4 params) cho
            error handling đồng nhất.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Express setup', code: EXPRESS_SETUP },
            { label: 'Middleware & auth', code: MIDDLEWARE },
            { label: 'Typed router', code: TYPED_ROUTER },
            { label: 'Custom errors', code: ERROR_CLASSES },
          ]}
        />
      </Sec>

      <Sec title="Request generic params">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Position</th>
              <th>Type param</th>
              <th>Ví dụ</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['1st', 'Params', '{ id: string }'],
              ['2nd', 'ResBody', 'User | { error: string }'],
              ['3rd', 'ReqBody', 'CreateUserDto'],
              ['4th', 'Query', '{ page?: string; sort?: string }'],
            ].map(([pos, param, ex]) => (
              <tr key={pos}>
                <td>{pos}</td>
                <td>
                  <code>{param}</code>
                </td>
                <td>
                  <code style={{ fontSize: 11 }}>{ex}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>ErrorRequestHandler phải có đúng 4 params:</strong> Express nhận diện error
          middleware bằng số lượng parameters. Nếu khai báo thiếu (3 params), Express sẽ không coi
          nó là error handler — lỗi sẽ không được catch.
        </Callout>
        <Callout type="warn">
          <strong>req.body mặc định là any:</strong> Ngay cả khi type Request với ReqBody, thực tế
          tại runtime body chưa được validate. Luôn kết hợp với Zod (bài 04) để runtime validation
          trước khi tin tưởng req.body.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Augment Express.Request thêm: user? (UserPayload), requestId (string), startTime (number). Viết 3 middleware tương ứng: authenticate, requestId, timing.',
            },
            {
              level: 'medium',
              text: 'Xây dựng generic repository Express: createCRUDRouter<T>(service: IService<T>) — tự sinh GET /, GET /:id, POST /, PUT /:id, DELETE /:id với typed handlers.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe API versioning: router.v1.get(...) và router.v2.get(...) với middleware tự động thêm X-API-Version header. Typed response wrapper: ApiResponse<T> = { data: T; version: string; timestamp: number }.',
            },
          ]}
          hint="Augment: declare module 'express-serve-static-core'. CRUD router: IService<T> = { findAll, findById, create, update, delete }. Versioning: factory function nhận version number, trả Router với response wrapper middleware."
        />
      </Sec>
    </LessonCard>
  );
}

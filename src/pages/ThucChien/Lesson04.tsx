import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const ZOD_BASICS = `// Zod — Runtime validation + TypeScript type inference
// npm install zod

import { z } from 'zod';

// Primitive schemas
const NameSchema     = z.string().min(2).max(50);
const AgeSchema      = z.number().int().min(0).max(150);
const EmailSchema    = z.string().email();
const UrlSchema      = z.string().url();
const UuidSchema     = z.string().uuid();
const BooleanSchema  = z.boolean();

// Object schema
const UserSchema = z.object({
  id:        z.string().uuid(),
  name:      z.string().min(2, 'Name must be at least 2 characters'),
  email:     z.string().email('Invalid email format'),
  age:       z.number().int().min(0).optional(),
  role:      z.enum(['admin', 'user', 'moderator']).default('user'),
  createdAt: z.date().or(z.string().datetime()),
});

// Infer TypeScript type từ schema — không cần viết type thủ công!
type User = z.infer<typeof UserSchema>;
// {
//   id: string;
//   name: string;
//   email: string;
//   age?: number;
//   role: 'admin' | 'user' | 'moderator';
//   createdAt: Date | string;
// }

// Array schema
const UsersSchema = z.array(UserSchema);
const TagsSchema  = z.array(z.string()).min(1).max(10);

// Union và intersection
const IdSchema     = z.union([z.string().uuid(), z.number().int()]);
const AdminSchema  = UserSchema.merge(z.object({ adminLevel: z.number().min(1).max(3) }));`;

const ZOD_PARSE = `// Parsing & error handling

import { z, ZodError } from 'zod';

const CreateUserSchema = z.object({
  name:  z.string().min(2),
  email: z.string().email(),
  age:   z.number().int().min(18, 'Must be at least 18'),
});

type CreateUserDto = z.infer<typeof CreateUserSchema>;

// parse — throw ZodError nếu invalid
try {
  const user = CreateUserSchema.parse({ name: 'A', email: 'not-email', age: 15 });
} catch (error) {
  if (error instanceof ZodError) {
    error.errors.forEach(e => {
      console.log(e.path.join('.'), e.message);
      // "name"  "String must contain at least 2 character(s)"
      // "email" "Invalid email"
      // "age"   "Must be at least 18"
    });
  }
}

// safeParse — trả về Result-like object (không throw)
const result = CreateUserSchema.safeParse({ name: 'Alice', email: 'alice@ex.com', age: 25 });

if (result.success) {
  const user = result.data; // CreateUserDto — fully typed!
  console.log(user.name); // "Alice"
} else {
  const errors = result.error.flatten();
  // errors.fieldErrors = { name?: string[], email?: string[], age?: string[] }
  console.log(errors.fieldErrors);
}

// parseAsync — cho async refinements
const UserWithDbCheck = CreateUserSchema.refine(
  async data => {
    const exists = await db.userExists(data.email);
    return !exists;
  },
  { message: 'Email already registered', path: ['email'] }
);

const asyncResult = await UserWithDbCheck.safeParseAsync(formData);`;

const ZOD_ADVANCED = `// Zod nâng cao — transforms, refinements, discriminated unions

import { z } from 'zod';

// Transform — parse + transform
const TrimmedString = z.string().transform(s => s.trim());
const CoerceNumber  = z.coerce.number(); // "42" → 42

// Preprocess — xử lý trước parse
const FlexibleDate = z.preprocess(
  val => (typeof val === 'string' ? new Date(val) : val),
  z.date()
);

// Refinement — custom validation
const PasswordSchema = z.string()
  .min(8, 'At least 8 characters')
  .refine(s => /[A-Z]/.test(s), 'Must contain uppercase')
  .refine(s => /[0-9]/.test(s), 'Must contain a number')
  .refine(s => /[^A-Za-z0-9]/.test(s), 'Must contain special character');

// Cross-field validation
const SignupSchema = z.object({
  email:           z.string().email(),
  password:        PasswordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Discriminated union
const EventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('click'),   x: z.number(), y: z.number() }),
  z.object({ type: z.literal('keydown'), key: z.string(), ctrlKey: z.boolean() }),
  z.object({ type: z.literal('resize'),  width: z.number(), height: z.number() }),
]);

type AppEvent = z.infer<typeof EventSchema>;

// Pick, Omit, Partial — mirror TypeScript utilities
const UserPreviewSchema = UserSchema.pick({ id: true, name: true });
const CreateSchema      = UserSchema.omit({ id: true, createdAt: true });
const PatchSchema       = UserSchema.partial().required({ id: true }); // id bắt buộc, rest optional`;

const ZOD_EXPRESS = `// Zod + Express — validation middleware

import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Generic validation middleware factory
function validate<T>(schema: ZodSchema<T>, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        fields: result.error.flatten().fieldErrors,
      });
      return;
    }
    // Gán dữ liệu đã validated trở lại
    (req as Record<string, unknown>)[source] = result.data;
    next();
  };
}

// Schemas
const CreatePostSchema = z.object({
  title:   z.string().min(5).max(200),
  content: z.string().min(20),
  tags:    z.array(z.string()).max(5).default([]),
});

const PostQuerySchema = z.object({
  page:   z.coerce.number().int().min(1).default(1),
  limit:  z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
});

// Router usage
postRouter
  .post('/', validate(CreatePostSchema), async (req: Request, res: Response) => {
    const dto = req.body as z.infer<typeof CreatePostSchema>; // type-safe after validation
    const post = await PostService.create(dto);
    res.status(201).json(post);
  })
  .get('/', validate(PostQuerySchema, 'query'), async (req, res) => {
    const { page, limit, search } = req.query as z.infer<typeof PostQuerySchema>;
    const posts = await PostService.findAll({ page, limit, search });
    res.json(posts);
  });`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson04({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-04"
      num="04"
      title="Zod — Runtime Validation"
      desc="Schema definition, type inference, safeParse, transforms, refinements, Express integration"
      priority="high"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Zod — Schema validation + TypeScript">
        <Concept>
          <p>
            Zod giải quyết vấn đề cốt lõi: <strong>TypeScript chỉ check compile-time</strong>, còn
            data từ API/form chỉ được kiểm tra tại runtime. Zod kết hợp cả hai: định nghĩa schema
            một lần, dùng <code className="ic">z.infer&lt;&gt;</code> để lấy TypeScript type, và{' '}
            <code className="ic">safeParse</code> để validate tại runtime với typed errors. Là thư
            viện de-facto trong modern TypeScript ecosystem.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Zod basics', code: ZOD_BASICS },
            { label: 'Parse & errors', code: ZOD_PARSE },
            { label: 'Advanced schemas', code: ZOD_ADVANCED },
            { label: 'Zod + Express', code: ZOD_EXPRESS },
          ]}
        />
      </Sec>

      <Sec title="Zod methods cheat sheet">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Schema</th>
              <th>Validators</th>
              <th>Transform</th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'z.string()',
                '.min() .max() .email() .url() .regex() .uuid()',
                '.trim() .toLowerCase()',
              ],
              [
                'z.number()',
                '.min() .max() .int() .positive() .finite()',
                '.transform(n => n * 2)',
              ],
              ['z.array()', '.min() .max() .nonempty() .length()', '.transform(a => [...a])'],
              ['z.object()', '.pick() .omit() .partial() .required() .extend()', '.merge(schema)'],
              ['z.enum()', 'z.enum(["a","b","c"])', '.extract() .exclude()'],
              ['z.union()', 'z.union([A, B])', '.or(B)'],
            ].map(([schema, validators, transform]) => (
              <tr key={schema}>
                <td>
                  <code>{schema}</code>
                </td>
                <td style={{ fontSize: 11 }}>{validators}</td>
                <td style={{ fontSize: 11 }}>{transform}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>z.infer vs manual types:</strong> Luôn dùng{' '}
          <code className="ic">type T = z.infer&lt;typeof Schema&gt;</code> thay vì viết interface
          thủ công. Một source of truth — khi đổi schema, type tự cập nhật, không cần đổi 2 chỗ.
        </Callout>
        <Callout type="warn">
          <strong>parse vs safeParse:</strong> <code className="ic">parse()</code> throw{' '}
          <code className="ic">ZodError</code> (dùng khi biết chắc data hợp lệ, hoặc trong
          try/catch). <code className="ic">safeParse()</code> trả về{' '}
          <code className="ic">{'{ success, data | error }'}</code> — ưu tiên dùng cho user input,
          API responses.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo Zod schema cho hệ thống blog: PostSchema (title, content, slug, tags, publishedAt?). Dùng z.infer để lấy type. Test safeParse với valid và invalid data.',
            },
            {
              level: 'medium',
              text: 'Implement validate middleware cho Express nhận ZodSchema, validate req.body, trả về 400 với fieldErrors object. Dùng với 3 routes POST /users, POST /posts, POST /comments.',
            },
            {
              level: 'hard',
              text: 'Implement type-safe env validator: createEnv(schema: z.ZodObject<T>) đọc process.env, parse với Zod, freeze result. Type: ReadonlyDeep<z.infer<T>>. Throw descriptive error khi thiếu biến.',
            },
          ]}
          hint="Blog schema: z.string().regex(/^[a-z0-9-]+$/) cho slug. Validate middleware: result.error.flatten().fieldErrors cho structured errors. Env: z.coerce.number() cho PORT, transform với preprocess."
        />
      </Sec>
    </LessonCard>
  );
}

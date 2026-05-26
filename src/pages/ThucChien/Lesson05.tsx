import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const VITEST_BASICS = `// Testing với Vitest — setup và basic tests
// npm install -D vitest @vitest/ui

// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,      // dùng describe/it/expect không cần import
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});

// Basic test file — src/utils/math.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { add, divide, formatCurrency } from './math';

describe('Math utilities', () => {
  describe('add', () => {
    it('adds two positive numbers', () => {
      expect(add(2, 3)).toBe(5);
    });

    it('handles negative numbers', () => {
      expect(add(-1, 1)).toBe(0);
    });
  });

  describe('divide', () => {
    it('divides correctly', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('throws on division by zero', () => {
      expect(() => divide(10, 0)).toThrow('Division by zero');
    });
  });

  describe('formatCurrency', () => {
    it('formats USD correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
    });
  });
});`;

const TYPED_MOCKS = `// Type-safe mocks — vi.fn, vi.spyOn

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Typed mock function
const mockFetch = vi.fn<[string], Promise<Response>>();
// hoặc sử dụng generic vi.fn()
const mockCallback = vi.fn<(id: string) => User>();

// vi.spyOn — spy on method với types
import * as UserService from './UserService';

const spy = vi.spyOn(UserService, 'findById');
spy.mockResolvedValue({ id: '1', name: 'Alice', email: 'alice@ex.com' });

// Mock module
vi.mock('./database', () => ({
  db: {
    query: vi.fn(),
    execute: vi.fn(),
    transaction: vi.fn(),
  },
}));

import { db } from './database';

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // reset sau mỗi test
  });

  it('creates user correctly', async () => {
    // Setup mock return value
    vi.mocked(db.execute).mockResolvedValue([{ insertId: 1 }]);

    const result = await UserService.create({ name: 'Bob', email: 'bob@ex.com' });

    // Assert mock was called correctly
    expect(db.execute).toHaveBeenCalledOnce();
    expect(db.execute).toHaveBeenCalledWith(
      expect.stringContaining('INSERT'),
      ['Bob', 'bob@ex.com']
    );
    expect(result).toMatchObject({ id: 1, name: 'Bob' });
  });

  it('throws when user not found', async () => {
    vi.mocked(db.query).mockResolvedValue([]);

    await expect(UserService.findById('999')).rejects.toThrow('User not found');
  });
});`;

const TESTING_TYPES = `// Testing TypeScript types — type-level testing

import { describe, it, expectTypeOf } from 'vitest';

// expectTypeOf — test types tại runtime
describe('Type utilities', () => {
  it('Prettify flattens intersection types', () => {
    type A = { a: string } & { b: number };
    type B = Prettify<A>;

    expectTypeOf<B>().toEqualTypeOf<{ a: string; b: number }>();
  });

  it('NonEmptyArray ensures at least one element', () => {
    type NEA = NonEmptyArray<string>;
    expectTypeOf<NEA>().toEqualTypeOf<[string, ...string[]]>();
  });

  it('infers correct return type', () => {
    function double(n: number): number { return n * 2; }
    expectTypeOf(double).returns.toBeNumber();
    expectTypeOf(double).parameter(0).toBeNumber();
  });

  it('Result type discriminates correctly', () => {
    type R = Result<string, Error>;

    expectTypeOf<Extract<R, { success: true }>>().toHaveProperty('data');
    expectTypeOf<Extract<R, { success: false }>>().toHaveProperty('error');
  });
});

// Testing generic function types
describe('Utility type inference', () => {
  it('z.infer extracts correct type from Zod schema', () => {
    const schema = z.object({ name: z.string(), age: z.number() });
    type Inferred = z.infer<typeof schema>;

    expectTypeOf<Inferred>().toEqualTypeOf<{ name: string; age: number }>();
  });
});`;

const INTEGRATION = `// Integration tests — test với real dependencies

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest'; // npm install -D supertest @types/supertest
import { app } from '../src/app';
import { db } from '../src/database';

describe('POST /users', () => {
  beforeAll(async () => {
    await db.migrate();          // chạy migrations
    await db.seed();             // seed test data
  });

  afterAll(async () => {
    await db.truncate('users');  // cleanup
    await db.close();
  });

  it('creates a user with valid data', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Alice', email: 'alice@test.com' })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: 'Alice',
      email: 'alice@test.com',
    });
  });

  it('returns 400 for invalid data', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'A', email: 'not-email' })
      .expect(400);

    expect(response.body.fields).toHaveProperty('name');
    expect(response.body.fields).toHaveProperty('email');
  });

  it('returns 409 for duplicate email', async () => {
    // Insert first
    await request(app).post('/users').send({ name: 'Bob', email: 'bob@test.com' });

    // Insert again
    await request(app)
      .post('/users')
      .send({ name: 'Bob 2', email: 'bob@test.com' })
      .expect(409);
  });
});`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson05({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="tc-05"
      num="05"
      title="Testing với TypeScript"
      desc="Vitest setup, typed mocks, expectTypeOf, integration tests với supertest"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Testing trong TypeScript">
        <Concept>
          <p>
            <strong>Vitest</strong> là test runner hiện đại, tích hợp tốt với Vite và TypeScript
            (không cần cấu hình thêm). <code className="ic">vi.fn()</code> và{' '}
            <code className="ic">vi.spyOn()</code> tạo typed mocks.{' '}
            <code className="ic">expectTypeOf()</code> cho phép test TypeScript types tại runtime —
            verify generic inference, utility type behavior.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Vitest setup', code: VITEST_BASICS },
            { label: 'Typed mocks', code: TYPED_MOCKS },
            { label: 'Testing types', code: TESTING_TYPES },
            { label: 'Integration tests', code: INTEGRATION },
          ]}
        />
      </Sec>

      <Sec title="Mock strategies">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Approach</th>
              <th>Khi nào dùng</th>
              <th>API</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['vi.fn()', 'Mock function đơn lẻ', 'mockReturnValue, mockResolvedValue'],
              [
                'vi.spyOn(obj, method)',
                'Spy on existing method',
                'mockImplementation, mockReturnValue',
              ],
              ['vi.mock(module)', 'Mock toàn bộ module', 'tự động mock tất cả exports'],
              ['vi.stubEnv(key, val)', 'Mock process.env', 'vi.unstubAllEnvs() để restore'],
              ['vi.useFakeTimers()', 'Mock setTimeout/Date', 'vi.advanceTimersByTime(ms)'],
            ].map(([approach, when, api]) => (
              <tr key={approach}>
                <td>
                  <code style={{ fontSize: 11 }}>{approach}</code>
                </td>
                <td style={{ fontSize: 12 }}>{when}</td>
                <td style={{ fontSize: 11 }}>{api}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="note">
          <strong>vi.mocked() để TypeScript inference:</strong> Sau{' '}
          <code className="ic">vi.mock()</code>, dùng{' '}
          <code className="ic">vi.mocked(fn).mockResolvedValue(...)</code> thay vì cast — TypeScript
          sẽ biết return type của mock phải match return type thật của function.
        </Callout>
        <Callout type="warn">
          <strong>Không mock database trong integration tests:</strong> Unit test mock DB,
          integration test dùng DB thật (SQLite in-memory hoặc test container). Mock DB trong
          integration test dẫn đến false positives — test pass nhưng production có lỗi migration hay
          SQL thật.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Viết unit tests cho hàm formatDate(date: Date, format: string): string. Test: valid date, invalid date throws, format strings khác nhau. Dùng vi.useFakeTimers() để mock Date.now().',
            },
            {
              level: 'medium',
              text: 'Test UserService với mocked database. vi.mock() toàn bộ db module. Test: create returns user với id, findById throws NotFoundError khi không có, update merge changes đúng.',
            },
            {
              level: 'hard',
              text: 'Dùng expectTypeOf() viết type tests cho các utility types: Prettify, DeepReadonly, XOR. Đảm bảo: XOR<A,B> không accept cả hai properties, DeepReadonly makes nested objects readonly.',
            },
          ]}
          hint="formatDate: vi.setSystemTime(new Date('2024-01-01')). UserService: vi.mocked(db.query) với type. expectTypeOf: .toEqualTypeOf<Expected>() và .not.toMatchTypeOf<Wrong>()."
        />
      </Sec>
    </LessonCard>
  );
}

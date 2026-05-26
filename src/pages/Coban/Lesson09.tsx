import LessonCard from '../../components/LessonCard';
import CodeTabs from '../../components/CodeTabs';
import ExerciseSection from '../../components/ExerciseSection';
import Callout from '../../components/Callout';
import { Sec, Concept } from './_helpers';

const NUMERIC_ENUM = `// Numeric Enum — auto-increment từ 0
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

// Custom start value
enum Direction2 {
  Up = 1,   // 1
  Down,     // 2 (auto-increment)
  Left,     // 3
  Right,    // 4
}

// Reverse mapping — chỉ numeric enum có!
console.log(Direction.Up);     // 0
console.log(Direction[0]);     // "Up" — reverse lookup
console.log(Direction[1]);     // "Down"

// Dùng trong function
function move(direction: Direction) {
  if (direction === Direction.Up) {
    console.log('Moving up!');
  }
}
move(Direction.Up);   // OK
move(0);              // OK — nhưng ít rõ nghĩa`;

const STRING_ENUM = `// String Enum — không có reverse mapping nhưng dễ debug hơn
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING',
}

// Debug dễ hơn numeric
const userStatus: Status = Status.Active;
console.log(userStatus); // "ACTIVE" (không phải 0)

// Dùng với switch — exhaustive check tự động
function handleStatus(status: Status): string {
  switch (status) {
    case Status.Active:
      return 'User is active';
    case Status.Inactive:
      return 'User is inactive';
    case Status.Pending:
      return 'User is pending approval';
  }
}

// Dùng trong API response — dễ đọc trong logs
type UserResponse = {
  id: number;
  status: Status; // "ACTIVE" | "INACTIVE" | "PENDING" trong JSON
};`;

const CONST_ENUM = `// const enum — tối ưu hóa: không tạo object JS, inline giá trị
const enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// Compile thành: const color = "RED"; (inline!)
// KHÔNG tạo object Color trong bundle JS
const color = Color.Red;

// Lưu ý: const enum không thể dùng với reverse mapping
// và không nên dùng khi export từ library (vì mất runtime object)

// Ứng dụng thực tế: HTTP status codes
const enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalServerError = 500,
}

function handleResponse(status: HttpStatus) {
  if (status === HttpStatus.OK) return 'success';
  if (status === HttpStatus.NotFound) return 'not found';
}`;

const ENUM_VS_UNION = `// Enum
enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

function fetchData(url: string, method: HttpMethod) { }
fetchData('/api/users', HttpMethod.GET);

// Union type literal — thường ưu tiên hơn trong modern TypeScript
type HttpMethodUnion = 'GET' | 'POST' | 'PUT' | 'DELETE';

function fetchDataUnion(url: string, method: HttpMethodUnion) { }
fetchDataUnion('/api/users', 'GET'); // không cần prefix

// KHAI PHÁN: khi nào dùng Enum?
// ✓ Enum: nhiều file, cần namespace, cần reverse mapping, legacy code
// ✓ Union: modern TS, ngắn gọn, không cần runtime object, đủ nhu cầu

// Thực tế: nhiều codebase modern ưu tiên union type over enum`;

interface Props {
  isDone: boolean;
  onToggleDone: () => void;
}

export default function Lesson09({ isDone, onToggleDone }: Props) {
  return (
    <LessonCard
      id="cb-09"
      num="09"
      title="Enums"
      desc="Numeric, string, const enum — và khi nào nên dùng union type thay thế"
      priority="medium"
      isDone={isDone}
      onToggleDone={onToggleDone}
    >
      <Sec title="Enums trong TypeScript">
        <Concept>
          <p>
            <strong>Enum</strong> là tập hợp các hằng số có tên. TypeScript có 3 loại enum: numeric,
            string, và const enum. Tuy nhiên, <strong>union type literal</strong> thường là lựa chọn
            tốt hơn trong modern TypeScript.
          </p>
        </Concept>
        <CodeTabs
          tabs={[
            { label: 'Numeric enum', code: NUMERIC_ENUM },
            { label: 'String enum', code: STRING_ENUM },
            { label: 'const enum', code: CONST_ENUM },
            { label: 'Enum vs Union', code: ENUM_VS_UNION },
          ]}
        />
      </Sec>

      <Sec title="So sánh 3 loại enum">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Reverse mapping</th>
              <th>JS output</th>
              <th>Khi nào dùng</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Numeric enum', 'Có', 'Object + reverse', 'Cần reverse lookup'],
              ['String enum', 'Không', 'Object', 'Debug dễ, API response'],
              ['const enum', 'Không', 'Inline (không có object)', 'Tối ưu bundle size'],
            ].map(([type, reverse, js, when]) => (
              <tr key={type}>
                <td>{type}</td>
                <td>{reverse}</td>
                <td>{js}</td>
                <td>{when}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Sec>

      <Sec title="Lưu ý quan trọng">
        <Callout type="warn">
          <strong>Enum tạo runtime object trong JS:</strong> Không như type/interface (bị xóa sau
          compile), enum tạo object thực sự trong JavaScript. Điều này có thể tăng bundle size.
          <code className="ic">const enum</code> giải quyết vấn đề này bằng cách inline values.
        </Callout>
        <Callout type="note">
          <strong>Modern TypeScript: ưu tiên union literal:</strong> Nhiều project và style guide
          hiện đại khuyến khích dùng <code className="ic">type Status = 'active' | 'inactive'</code>{' '}
          thay vì enum. Ngắn gọn hơn, không có runtime overhead, và hoạt động tốt với most use
          cases.
        </Callout>
      </Sec>

      <Sec title="Bài tập thực hành">
        <ExerciseSection
          exercises={[
            {
              level: 'basic',
              text: 'Tạo enum UserRole { Admin = "ADMIN", Editor = "EDITOR", Viewer = "VIEWER" }. Viết function canEdit(role: UserRole): boolean trả về true chỉ với Admin và Editor.',
            },
            {
              level: 'medium',
              text: 'Tạo const enum HttpStatus với các mã phổ biến (200, 201, 400, 401, 404, 500). Viết function getStatusText(status: HttpStatus): string.',
            },
            {
              level: 'hard',
              text: 'Viết lại logic với union type thay vì enum. So sánh DX (developer experience) và bundle size. Khi nào thì enum thực sự cần thiết?',
            },
          ]}
          hint="String enum dễ debug hơn. HttpStatus 200 = OK, 201 = Created, 400 = Bad Request, 401 = Unauthorized, 404 = Not Found, 500 = Internal Server Error."
        />
      </Sec>
    </LessonCard>
  );
}

# Explaining the Campus Events API to your teacher

Use this as a script. Read "The big picture" first, then walk through the files in the order below.

---

## 1. The big picture: what happens to one request

Example: `GET /api/events?category=technology&page=1&limit=2`

1. **main.ts** started the app with the global prefix `api`, so the path `/api/events` is recognised.
2. **ValidationPipe** reads the query string, converts `page` and `limit` from strings to numbers, and checks them against `FindEventsQueryDto`. If something is invalid, it stops here with **400**.
3. **EventsController** finds the matching route (`@Get()` inside `@Controller('events')`), and `@Query()` hands the validated query to the method.
4. The controller calls **EventsService.findAll(query)**. All the logic lives there: filter, sort, paginate.
5. The service returns `{ items, total, page, limit, totalPages }`; Nest sends it as JSON with **200**.

One sentence: *the controller is the receptionist, the service is the worker, the DTO is the form that checks the data is filled in correctly.*

---

## 2. File by file

**`main.ts`** sets two global things: `setGlobalPrefix('api')` (so all routes start with `/api`) and the `ValidationPipe` with three options:
- `transform: true` converts the data into DTO objects and strings like `"2"` into numbers.
- `whitelist: true` removes properties that are not in the DTO.
- `forbidNonWhitelisted: true` answers 400 if the client sends unknown properties.

**`events.module.ts`** connects the feature: it lists the controller and the service. `AppModule` imports it, otherwise Nest would not know the routes exist.

**`events.controller.ts`** defines routes and reads request data with `@Param()`, `@Query()` and `@Body()`. It has no logic; each method is one line calling the service.

**`events.service.ts`** holds the "database" (an array copy of the seed data) and every operation: `findAll`, `findUpcoming`, `findPublished`, `findOne`, `findSessions`, `findSession`, `create`. It throws `NotFoundException` for missing items; Nest turns that into a 404 response.

**`events.data.ts`** is the seed: 8 events (one is an unpublished draft, some in the past) and 6 sessions (3 each for `evt-101` and `evt-102`).

**`event.interface.ts`** describes the shapes `CampusEvent`, `EventSession` and `PaginatedResult`. Interfaces only exist for TypeScript's checking; they disappear when compiled.

**`dto/create-event.dto.ts`** is the rulebook for POST: `title`, `description`, `location`, `category` must be non-empty strings, `eventDate` must be an ISO date string, `isPublished` is optional and must be boolean.

**`dto/find-events-query.dto.ts`** is the rulebook for the query string. `@Type(() => Number)` turns `"2"` into `2`, `@Transform` turns `"true"` into `true`, `@IsIn(['eventDate','title'])` rejects other sort fields, `@Min(1)` rejects page 0.

---

## 3. Filtering, sorting and pagination: a worked example

Request: `GET /api/events?sortBy=eventDate&order=asc&page=2&limit=2`

- **Filter:** no filters are given, so all 8 events pass.
- **Sort:** a copy of the list is sorted by date ascending: evt-107 (Sep 1), evt-106 (Oct 5), evt-103 (Nov 20), evt-101 (Dec 4), evt-102 (Dec 12), evt-104 (Dec 18), evt-105 (Jan 15), evt-108 (Feb 10).
- **Paginate:** offset = (2 - 1) x 2 = 2. `slice(2, 4)` returns evt-103 and evt-101.
- **Response:** `total: 8`, `totalPages: ceil(8 / 2) = 4`.

Second example with a filter: `?category=technology&page=2&limit=1`. Filter first leaves 2 events (evt-101, evt-102), so total = 2, totalPages = 2, and page 2 holds evt-102. If we had paginated first, total would be wrong.

**Why a copy for sorting?** `Array.sort()` rearranges the array it is called on. If it ran on the stored events, the order of the data would change for every later request. `[...filtered].sort(...)` sorts a new array and leaves the original alone. (I tested this: the order is unchanged after a sorted request.)

---

## 4. Routing rule: static before dynamic

Nest checks routes in the order they appear in the controller. `@Get(':id')` matches any one-word path, including `upcoming` and `published`. So `@Get('upcoming')` and `@Get('published')` are declared above it. Show the teacher this by moving `upcoming` below `:id`: the request returns 404 `Event with id "upcoming" was not found`.

---

## 5. Status codes and validation

| Case | How it happens |
|---|---|
| 200 | default for GET |
| 201 | `@HttpCode(HttpStatus.CREATED)` on POST |
| 404 event | service throws `NotFoundException` when `find()` returns nothing |
| 404 session | the session must match both `id` and `eventId`, so `/evt-101/sessions/ses-204` fails (ses-204 belongs to evt-102) |
| 400 | `ValidationPipe` rejects bad body or query before the service runs |

The nested session routes first call `findOne(eventId)`, so a missing event gives 404 even before looking at sessions.

---

## 6. Likely teacher questions and short answers

**Why is the data in memory?** The exercise says a database is not required. The service hides the storage, so replacing the array with a database later would not change the controller.

**What happens when the server restarts?** New events created with POST are lost, because they only live in the array.

**Why DTO classes and not interfaces?** Decorators like `@IsString()` need a real class at runtime. Interfaces are removed by TypeScript, so Nest could not validate against them.

**Why does the ID come as a string?** Everything in a URL is text. Here the IDs are text anyway (`evt-101`), so no conversion is needed. `page` and `limit` are numbers, so they are converted.

**Why `isPublished` needs `@Transform`?** `@Type(() => Boolean)` would turn the string `"false"` into `true` (any non-empty string is truthy). The transform checks the text explicitly.

**What does "upcoming" mean exactly?** The event date is today or later, using the start of today (00:00) as the limit, so an event later today counts. Results are sorted soonest first.

**Can the page be higher than the last page?** Yes, it returns an empty `items` array with the correct `total` and `totalPages`.

**Why do the imports end with `.js`?** This project uses ES modules, which require the file extension in relative imports. TypeScript maps `.js` back to the `.ts` file.

**How would you test it?** The `requests.http` file contains all 11 required requests plus extra error cases. I also checked the service logic directly against the same seed data.

---

## 7. Setting up the project (what to do on your computer)

1. In your `hello-nest` project, delete the leftover `src/order` and `src/orders` folders (they were from the earlier exercise).
2. Run `nest g module events`, `nest g controller events`, `nest g service events` if you want Nest to create the files, then replace their contents with the files in this project. Or copy the `src/events` folder directly.
3. Copy `main.ts` over yours. In `app.module.ts`, import `EventsModule` and remove `OrdersModule`/`OrderController`/`OrderService`. If you want to keep the `ObserveModule` lines that came with your project, keep them and just add `EventsModule` to `imports`.
4. Run `npm install class-validator class-transformer`, then `npm run start:dev`.
5. Open `requests.http`, run each request and take a screenshot of each result for submission.
6. Push to GitHub and submit the repository link.

**Note on honesty:** the expected results in the README were produced by running the service logic against the seed data. Please run the real API on your computer and use your own screenshots as the evidence.

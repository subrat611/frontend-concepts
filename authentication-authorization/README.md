## Authentication & Authorization

Collected Knowledge

- What is Authentication & Authorization
- Concepts & PoC - Session, JWT, Access Token, Refresh Token rotation, OAuth3, RBAC, Simple role checks
- Google + Github Integration

## What is Authentication

- It asks "Who are you?" (Proves your identity).

## What is Authorization

- It asks "What are you allowed to do/access?" (Give you permission to use something)
- Common rules: RBAC or user lsits

## Authentication Types

### Session-Based - Stateful Authentication

- The server remembers every logged-in user.
- After successful login, the backend creates a Session.
- The session is stored in a centralized storage like Redis (most common) or a database.
- The browser only stores a Session ID inside an HttpOnly Cookie.
- Every request includes the Session ID automatically.
- The backend looks up the Session ID in Redis/Database to identify the user.
- This approach is called Stateful because the server maintains the authentication state.

<img src="./assets/session-auth-1.png" alt="session-based-auth-1" width="500px" />
<img src="./assets/session-auth-2.png" alt="session-based-auth-2" width="500px" />
<img src="./assets/session-auth-3.png" alt="session-based-auth-3" width="500px" />

---

<details>
    <summary>The Flow</summary>

User enters email and password.

- Frontend sends POST /login.
- Backend verifies the credentials.
- Backend creates a unique Session ID.
- Backend stores the Session in Redis (or Database).
- Session contains information like:
  - User ID
  - Roles
  - Permissions
  - Expiration time

- Backend sends a Session ID inside an HttpOnly Secure Cookie.
- Browser stores the cookie automatically.
- User makes another API request.
- Browser automatically sends the Session Cookie.
- Backend extracts the Session ID.
- Backend looks up the Session in Redis.
- If Session exists and is valid, the user is authenticated.
- Backend returns the requested resource.
- On logout:
  - Backend deletes the Session from Redis.
  - Backend clears the Cookie.
  - User is logged out immediately.

</details>

---

**Advantages**

- Very secure.
- Easy to invalidate sessions.
- Instant logout.
- Simple authorization flow.
- Works well for traditional monolithic applications.
- Easy to track active user sessions.

**Disadvantages**

- Every request requires a Redis/Database lookup.
- Backend must maintain session storage.
- Horizontal scaling requires shared session storage.
- More infrastructure is required.
- Not ideal for microservices.

#### PoC

Poc uses redis as database and API endpoints are `/signup`, `/login`, `/logout`.

`docker run --name local-redis -p 6379:6379 -d redis`
`docker exec -it local-redis redis-cli`
`KEYS *`
`GET key`
`HGETALL key`

Redis handles TTL automatically for you!

Here is how it works:

1. When you call redisClient.setEx(session:${sessionId}, 300, ...), Redis sets a 300-second (5-minute) timer on that key.
2. Once 300 seconds pass, Redis automatically deletes session:${sessionId} from database memory.
3. When the user makes a request after 5 minutes:
   - await redisClient.get(session:${sessionId}) returns null.
   - Your code sees null and knows the session has expired, returning a 401 Unauthorized response.

The above will be, if we implment `/profile` or some other endpoint where we check for the session id TTL.

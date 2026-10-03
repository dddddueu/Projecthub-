# Security Specification: Projects Access Control

## 1. Data Invariants
1. **Ownership Enforcement**: Every project must belong to an authenticated user (`userId`).
2. **Access Isolation**: Users can ONLY read (get & list), create, update, and delete their own projects (`resource.data.userId == request.auth.uid`).
3. **Identity Immutability**: The `userId` of a project cannot be spoofed upon creation nor altered upon update.
4. **Temporal Integrity**: `createdAt` must match `request.time` upon creation and is immutable thereafter. `updatedAt` must be updated to `request.time` on changes.
5. **Bounded Fields**: Project names must be 1-120 chars; descriptions must not exceed 2000 chars; statuses and priorities must belong to defined enums.

## 2. The "Dirty Dozen" Payloads (Must be Rejected)
1. **Unauthenticated Read**: Attempting to list `/projects` without `request.auth`.
2. **Foreign Document Read**: User B attempting `get` on `/projects/{projectA}` where `userId == 'UserA'`.
3. **Foreign Document List**: User B attempting `list` where filter does not match `auth.uid`.
4. **UID Spoofing on Create**: Authenticated user trying to create project with `userId: "another_user"`.
5. **Missing Required Fields**: Creating project without `name` or `createdAt`.
6. **Oversized Name**: Creating project with a 500-character name (limit is 120).
7. **Oversized Description**: Creating project with a 50,000-character description (limit is 2000).
8. **Invalid Enum Status**: Setting `status: "invalid_status"`.
9. **Ownership Reassignment on Update**: Updating project trying to change `userId` to someone else.
10. **CreatedAt Tampering on Update**: Updating project attempting to overwrite `createdAt`.
11. **Client Fake Timestamp on Create**: Attempting to insert a pre-fabricated timestamp not equal to `request.time`.
12. **Unauthorized Delete**: User B trying to delete `/projects/{projectA}`.

## 3. Defense Implementation
- Implemented in `firestore.rules` using declarative helper functions `isValidProject`, `isValidId`, `incoming`, and `existing`.
- Enforces RLS parity with the user's PostgreSQL DDL statement:
  `create policy "Users can manage own projects" on public.projects for all using (auth.uid() = user_id);`

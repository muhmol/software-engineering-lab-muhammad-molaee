const DATABASE_NAME = "northstar";
const DATABASE_VERSION = 1;
const USERS_STORE = "users";
const SESSION_KEY = "northstar-session";
const ADMIN_ID = "admin";
const ADMIN_EMAIL = "admin@northstar.local";
const ADMIN_PASSWORD = "Admin123!";

type UserRecord = {
  id: string;
  fullName: string;
  email: string;
  emailKey: string;
  username: string | null;
  usernameKey: string | null;
  role: "user" | "admin";
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
};

export type PublicUser = Pick<UserRecord, "id" | "fullName" | "email" | "username" | "role" | "createdAt">;

let databasePromise: Promise<IDBDatabase> | undefined;

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("This browser does not support the local database."));
  }

  databasePromise ??= new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const store = request.result.createObjectStore(USERS_STORE, { keyPath: "id" });
      store.createIndex("emailKey", "emailKey", { unique: true });
      store.createIndex("usernameKey", "usernameKey", { unique: true });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not open the local database."));
  });

  return databasePromise;
}

function encodeBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function decodeBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

async function hashPassword(password: string, salt: Uint8Array): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: toArrayBuffer(salt), iterations: 310_000, hash: "SHA-256" },
    key,
    256,
  );
  return encodeBase64(new Uint8Array(bits));
}

function getStore(database: IDBDatabase, mode: IDBTransactionMode): IDBObjectStore {
  return database.transaction(USERS_STORE, mode).objectStore(USERS_STORE);
}

function readUser(request: IDBRequest<UserRecord | undefined>): Promise<UserRecord | undefined> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not read from the local database."));
  });
}

async function ensureAdminAccount(database: IDBDatabase): Promise<void> {
  const existingAdmin = await readUser(getStore(database, "readonly").get(ADMIN_ID));
  if (existingAdmin) return;

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const admin: UserRecord = {
    id: ADMIN_ID,
    fullName: "Workspace Administrator",
    email: ADMIN_EMAIL,
    emailKey: ADMIN_EMAIL,
    username: "admin",
    usernameKey: "admin",
    role: "admin",
    passwordHash: await hashPassword(ADMIN_PASSWORD, salt),
    passwordSalt: encodeBase64(salt),
    createdAt: new Date().toISOString(),
  };

  await new Promise<void>((resolve, reject) => {
    const request = getStore(database, "readwrite").add(admin);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error ?? new Error("Could not create the default admin account."));
  });
}

async function getDatabase(): Promise<IDBDatabase> {
  const database = await openDatabase();
  await ensureAdminAccount(database);
  return database;
}

async function findUser(identifier: string): Promise<UserRecord | undefined> {
  const database = await getDatabase();
  const store = getStore(database, "readonly");
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const usernameMatch = await readUser(store.index("usernameKey").get(normalizedIdentifier));
  if (usernameMatch) return usernameMatch;
  return readUser(store.index("emailKey").get(normalizedIdentifier));
}

function toPublicUser(user: UserRecord): PublicUser {
  const { id, fullName, email, username, role, createdAt } = user;
  return { id, fullName, email, username, role, createdAt };
}

export async function registerUser(input: {
  fullName: string;
  email: string;
  username: string;
  password: string;
}): Promise<void> {
  const database = await getDatabase();
  const email = input.email.trim();
  const emailKey = email.toLowerCase();
  const username = input.username.trim();
  const usernameKey = username.toLowerCase();
  const store = getStore(database, "readonly");
  const existingEmail = await readUser(store.index("emailKey").get(emailKey));
  const existingUsername = await readUser(store.index("usernameKey").get(usernameKey));

  if (existingEmail) {
    throw new Error("An account with this email already exists.");
  }
  if (existingUsername) throw new Error("That username is already taken.");
  if (!/^[a-zA-Z0-9_]{3,24}$/.test(username)) {
    throw new Error("Usernames must be 3–24 characters using only letters, numbers, and underscores.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const user: UserRecord = {
    id: crypto.randomUUID(),
    fullName: input.fullName.trim(),
    email,
    emailKey,
    username,
    usernameKey,
    role: "user",
    passwordHash: await hashPassword(input.password, salt),
    passwordSalt: encodeBase64(salt),
    createdAt: new Date().toISOString(),
  };

  await new Promise<void>((resolve, reject) => {
    const request = getStore(database, "readwrite").add(user);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(
      request.error?.name === "ConstraintError"
        ? new Error("That email or username is already registered.")
        : request.error ?? new Error("Could not save the new account."),
    );
  });
}

export async function signIn(identifier: string, password: string): Promise<PublicUser | null> {
  const user = await findUser(identifier);
  if (!user) return null;

  const actualHash = await hashPassword(password, decodeBase64(user.passwordSalt));
  if (actualHash !== user.passwordHash) return null;

  const publicUser = toPublicUser(user);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, role: user.role }));
  return publicUser;
}

export async function getSignedInUser(): Promise<PublicUser | null> {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) return null;

  const parsedSession: { id?: string; role?: string } = JSON.parse(session);
  const database = await getDatabase();
  const user = await readUser(getStore(database, "readonly").get(parsedSession.id ?? ""));

  if (!user || user.role !== parsedSession.role) {
    signOut();
    return null;
  }

  return toPublicUser(user);
}

export async function getAdminUsers(): Promise<PublicUser[]> {
  const session = sessionStorage.getItem(SESSION_KEY);
  if (!session) throw new Error("Sign in with the admin account to view registered users.");

  const parsedSession: { id?: string; role?: string } = JSON.parse(session);
  if (parsedSession.role !== "admin" || parsedSession.id !== ADMIN_ID) {
    throw new Error("You must be signed in as an admin to view registered users.");
  }

  const database = await getDatabase();
  const store = getStore(database, "readonly");
  const records = await new Promise<UserRecord[]>((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Could not load registered users."));
  });

  return records.map(toPublicUser).sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export function signOut(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

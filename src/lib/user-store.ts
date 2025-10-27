
'use server';

import fs from 'fs/promises';
import path from 'path';

// Define the structure of a Bottle
export interface Bottle {
  id: string;
  type: string;
  sizeMl: number;
  timestamp: number;
}

// Define the structure for a user's data
export interface UserData {
  name: string;
  mobile: string;
  bottles: Bottle[];
  ecoCoins: number;
}

// Define the structure of the entire data store (a dictionary of users)
type UserStore = Record<string, UserData>;

const MAX_ACCOUNTS = 100;
// Use path.join to create a platform-independent file path
// process.cwd() points to the root of the Next.js project
const dataFilePath = path.join(process.cwd(), 'user-data.json');

// --- Helper Functions to Read/Write from the JSON file ---

/**
 * Reads the entire user store from the JSON file.
 * If the file doesn't exist, it returns an empty object.
 */
async function readStore(): Promise<UserStore> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    // If the file doesn't exist (ENOENT), it's not an error, just return empty.
    if (error.code === 'ENOENT') {
      return {};
    }
    // For any other errors, log them.
    console.error('Failed to read user store:', error);
    return {};
  }
}

/**
 * Writes the entire user store to the JSON file.
 */
async function writeStore(store: UserStore): Promise<boolean> {
  try {
    // Use JSON.stringify with indentation for readability
    await fs.writeFile(dataFilePath, JSON.stringify(store, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write user store:', error);
    return false;
  }
}

// --- Public API Functions for User Management ---

/**
 * Retrieves a user's data from the store.
 * @param mobile The user's mobile number (acts as a unique ID).
 * @returns The user's data or null if not found.
 */
export async function getUser(mobile: string): Promise<UserData | null> {
  const store = await readStore();
  return store[mobile] || null;
}

/**
 * Creates a new user and adds them to the store.
 * @param name The user's name.
 * @param mobile The user's mobile number.
 * @returns The newly created user's data or null if the store is full.
 */
export async function createUser(name: string, mobile: string): Promise<UserData | null> {
  const store = await readStore();

  if (Object.keys(store).length >= MAX_ACCOUNTS) {
    console.warn('User store is full. Cannot create new user.');
    return null; // Indicate that the store is full
  }

  if (store[mobile]) {
    // This case should ideally be handled by the calling logic, but we can log it.
    console.warn(`User with mobile ${mobile} already exists.`);
    return store[mobile];
  }

  const newUser: UserData = {
    name,
    mobile,
    bottles: [],
    ecoCoins: 0,
  };

  store[mobile] = newUser;
  await writeStore(store);

  return newUser;
}

/**
 * Updates an existing user's data.
 * @param mobile The mobile number of the user to update.
 * @param updates A partial object of the user's data to update.
 * @returns True if the update was successful, false otherwise.
 */
export async function updateUser(mobile: string, updates: Partial<UserData>): Promise<boolean> {
  const store = await readStore();

  if (!store[mobile]) {
    console.error(`User with mobile ${mobile} not found for update.`);
    return false;
  }

  // Merge the existing data with the new updates
  store[mobile] = { ...store[mobile], ...updates };
  
  return await writeStore(store);
}

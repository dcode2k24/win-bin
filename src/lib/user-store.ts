'use server';

import { kv } from '@vercel/kv';

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

// --- Public API Functions for User Management using Vercel KV ---

/**
 * Retrieves a user's data from the store.
 * @param mobile The user's mobile number (acts as a unique ID).
 * @returns The user's data or null if not found.
 */
export async function getUser(mobile: string): Promise<UserData | null> {
  try {
    const userData = await kv.get<UserData>(`user:${mobile}`);
    return userData;
  } catch (error) {
    console.error('Failed to read from Vercel KV:', error);
    return null;
  }
}

/**
 * Creates a new user and adds them to the store.
 * @param name The user's name.
 * @param mobile The user's mobile number.
 * @returns The newly created user's data or null on failure.
 */
export async function createUser(name: string, mobile: string): Promise<UserData | null> {
  try {
    const existingUser = await getUser(mobile);
    if (existingUser) {
      console.warn(`User with mobile ${mobile} already exists.`);
      return existingUser;
    }

    const newUser: UserData = {
      name,
      mobile,
      bottles: [],
      ecoCoins: 0,
    };

    await kv.set(`user:${mobile}`, newUser);
    return newUser;
  } catch (error) {
    console.error('Failed to create user in Vercel KV:', error);
    return null;
  }
}

/**
 * Updates an existing user's data.
 * @param mobile The mobile number of the user to update.
 * @param updates A partial object of the user's data to update.
 * @returns True if the update was successful, false otherwise.
 */
export async function updateUser(mobile: string, updates: Partial<UserData>): Promise<boolean> {
  try {
    const existingUser = await getUser(mobile);

    if (!existingUser) {
      console.error(`User with mobile ${mobile} not found for update.`);
      return false;
    }

    // Merge the existing data with the new updates
    const updatedUser = { ...existingUser, ...updates };
    
    await kv.set(`user:${mobile}`, updatedUser);
    return true;
  } catch (error) {
    console.error('Failed to update user in Vercel KV:', error);
    return false;
  }
}

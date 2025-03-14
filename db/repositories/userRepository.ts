import { db } from '../index';
import { users, NewUser, User } from '../schema';
import { eq } from 'drizzle-orm';

export const userRepository = {
  // Get a user by ID
  async getUserById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  },

  // Get a user by Privy ID
  async getUserByPrivyId(privyId: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.privyId, privyId));
    return result[0];
  },

  // Get a user by wallet address
  async getUserByWalletAddress(walletAddress: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.walletAddress, walletAddress));
    return result[0];
  },

  // Get a user by username
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  },

  // Create a new user
  async createUser(user: NewUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  },

  // Update a user
  async updateUser(id: number, user: Partial<NewUser>): Promise<User | undefined> {
    const result = await db.update(users).set({
      ...user,
      updatedAt: new Date(),
    }).where(eq(users.id, id)).returning();
    return result[0];
  },

  // Delete a user
  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  },

  // Get or create a user by Privy ID
  async getOrCreateUserByPrivyId(privyId: string, walletAddress?: string, email?: string, username?: string): Promise<User> {
    const existingUser = await this.getUserByPrivyId(privyId);
    
    if (existingUser) {
      // Update wallet address, email, or username if provided and different
      if ((walletAddress && existingUser.walletAddress !== walletAddress) || 
          (email && existingUser.email !== email) ||
          (username && existingUser.username !== username)) {
        return this.updateUser(existingUser.id, {
          walletAddress,
          email,
          username,
        }) as Promise<User>;
      }
      return existingUser;
    }
    
    // Create new user
    return this.createUser({
      privyId,
      walletAddress,
      email,
      username,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}; 
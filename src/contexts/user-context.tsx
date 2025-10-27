
"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getUser, updateUser, createUser, type UserData, type Bottle } from "@/lib/user-store";

export type { Bottle };

interface User {
  name: string;
  mobile: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  bottles: Bottle[];
  ecoCoins: number;
  isLoading: boolean;
  login: (name: string, mobile: string) => Promise<{ success: boolean, isNewUser: boolean }>;
  logout: () => void;
  addBottle: (bottleType: string, sizeMl: number) => void;
  deductEcoCoins: (amount: number) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const ECOCOINS_PER_BOTTLE = 10;
const LOCAL_STORAGE_KEY = 'win-bin-active-user-mobile';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [bottles, setBottles] = useState<Bottle[]>([]);
  const [ecoCoins, setEcoCoins] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedMobile = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedMobile) {
          const userData = await getUser(storedMobile);
          if (userData) {
            setUser({ name: userData.name, mobile: storedMobile });
            setBottles(userData.bottles);
            setEcoCoins(userData.ecoCoins);
            setIsAuthenticated(true);
          } else {
            // Clear invalid session from a previous run
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }
      } catch (error) {
          console.error("Failed to restore session from localStorage", error);
      } finally {
          setIsLoading(false);
      }
    };
    restoreSession();
  }, []);
  
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setBottles([]);
    setEcoCoins(0);
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
        console.error("Failed to remove item from localStorage", error);
    }
  }, []);

  const login = async (name: string, mobile: string): Promise<{ success: boolean, isNewUser: boolean }> => {
    try {
      let userData = await getUser(mobile);
      let isNewUser = false;

      if (userData) {
        // User with this mobile number exists.
        // Now, check if the name matches.
        if (userData.name.toLowerCase() !== name.toLowerCase()) {
          toast({
            title: "Login Failed",
            description: "This mobile number is already registered with a different name.",
            variant: "destructive",
          });
          return { success: false, isNewUser: false };
        }
        // If name also matches, it's a successful login for an existing user.
      } else {
        // This is a new user, so create a new account.
        isNewUser = true;
        const newUser = await createUser(name, mobile);
        if (!newUser) {
             toast({
                title: "Registration Failed",
                description: "The platform has reached its maximum number of accounts.",
                variant: "destructive",
            });
            return { success: false, isNewUser: false };
        }
        userData = newUser;
      }

      // Set the state for the active session
      setUser({ name: userData.name, mobile });
      setBottles(userData.bottles);
      setEcoCoins(userData.ecoCoins);
      setIsAuthenticated(true);
      setIsLoading(false); // Ensure loading is false after login attempt

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, mobile);
      } catch (error) {
        console.error("Failed to save to localStorage", error);
        toast({ title: "Session Warning", description: "Could not save session. You will be logged out on refresh.", variant: "destructive" });
      }
      
      return { success: true, isNewUser };
    } catch (error: any) {
        console.error('Login failed:', error);
        toast({
            title: "Login Failed",
            description: "An unexpected error occurred during login.",
            variant: "destructive",
        });
        setIsLoading(false);
        return { success: false, isNewUser: false };
    }
  };

  const addBottle = async (bottleType: string, sizeMl: number) => {
    if (!isAuthenticated || !user) {
      toast({ title: "Not Authenticated", description: "Please log in to add bottles.", variant: "destructive"});
      return;
    }
    
    const newBottleEntry: Bottle = {
      id: String(Date.now()) + String(Math.random()), 
      type: bottleType,
      sizeMl,
      timestamp: Date.now(), 
    };
    
    const newBottles = [...bottles, newBottleEntry];
    const newEcoCoins = ecoCoins + ECOCOINS_PER_BOTTLE;
    
    const success = await updateUser(user.mobile, { bottles: newBottles, ecoCoins: newEcoCoins });

    if (success) {
      setBottles(newBottles);
      setEcoCoins(newEcoCoins);
      toast({
        title: "Bottle Added!",
        description: `You've earned ${ECOCOINS_PER_BOTTLE} EcoCoins.`,
      });
    } else {
       toast({ title: "Update Failed", description: "Could not save your progress.", variant: "destructive"});
    }
  };

  const deductEcoCoins = async (amount: number): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      toast({ title: "Deduction Failed", description: "User not authenticated.", variant: "destructive"});
      return false;
    }
    if (ecoCoins < amount) {
        toast({ title: "Deduction Failed", description: "Not enough EcoCoins.", variant: "destructive"});
        return false;
    }
    
    const newEcoCoins = ecoCoins - amount;
    const success = await updateUser(user.mobile, { ecoCoins: newEcoCoins });
    
    if (success) {
      setEcoCoins(newEcoCoins);
      return true;
    }
    
    toast({ title: "Update Failed", description: "Could not update your EcoCoins.", variant: "destructive"});
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        bottles,
        ecoCoins,
        isLoading,
        login,
        logout,
        addBottle,
        deductEcoCoins,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

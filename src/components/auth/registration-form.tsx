
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { User, Phone } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name is too long."),
  mobile: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit mobile number."),
});

export function RegistrationForm() {
  const { login } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobile: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { success, isNewUser } = await login(values.name, values.mobile); 
    
    if (success) {
      if(isNewUser) {
          toast({
              title: "Welcome to Win-Bin!",
              description: "Your account has been created successfully.",
          });
      } else {
          toast({
              title: "Welcome Back!",
              description: `Glad to see you again, ${values.name}.`,
          });
      }
      router.push("/dashboard");
    }
    // If login is not successful, a toast will be displayed from the login function.
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">Join Win-Bin</CardTitle>
        <CardDescription className="text-center">
          Enter your details to start recycling and track your impact.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="e.g. 9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Login / Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

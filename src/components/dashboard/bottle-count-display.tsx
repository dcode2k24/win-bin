
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package } from "lucide-react";
import { useUser } from "@/contexts/user-context";

export function BottleCountDisplay() {
  const { bottles } = useUser();

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium text-primary">
          Bottles Recycled
        </CardTitle>
        <Package className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {bottles.length}
        </div>
        <CardDescription className="text-xs text-muted-foreground pt-1">
          Total bottles you've helped recycle.
        </CardDescription>
      </CardContent>
    </Card>
  );
}

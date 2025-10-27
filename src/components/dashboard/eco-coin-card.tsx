
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coins } from "lucide-react";
import { useUser } from "@/contexts/user-context";

export function EcoCoinCard() {
  const { ecoCoins } = useUser();

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium text-primary">
          Your EcoCoins
        </CardTitle>
        <Coins className="h-6 w-6 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">
          {ecoCoins}
        </div>
        <CardDescription className="text-xs text-muted-foreground pt-1">
          Earned from recycling. Redeem for rewards!
        </CardDescription>
      </CardContent>
    </Card>
  );
}


"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/user-context";
import { useToast } from "@/hooks/use-toast";
import { Gift, Coins } from "lucide-react";
import { useRouter } from "next/navigation";
import { PlantTreeAnimation } from "./plant-tree-animation";

interface RedemptionOption {
  id: string;
  name: string;
  cost: number;
  description: string;
  action: 'route' | 'animation';
  value: number; // For GST, this is the discount amount. For others, can be 0.
}

const redemptionOptions: RedemptionOption[] = [
  { id: "gst10", name: "GST Off (Orders up to ₹200)", cost: 100, description: "Redeem for a full GST waiver on food orders up to ₹200.", action: 'route', value: 20 }, // Generous discount
  { id: "gst_full_above_200", name: "GST Off (Orders above ₹200)", cost: 200, description: "Redeem for a full GST waiver on food orders above ₹200.", action: 'route', value: 999 }, // Special value to signify full waiver
  { id: "tree", name: "Plant a Tree", cost: 200, description: "Contribute to planting a tree in your name.", action: 'animation', value: 0 },
];

export function RedeemCard() {
  const { ecoCoins, deductEcoCoins } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(false);

  const handleRedeem = async (option: RedemptionOption) => {
    if (ecoCoins < option.cost) {
      toast({
        title: "Not Enough EcoCoins",
        description: `You need ${option.cost - ecoCoins} more EcoCoins to redeem this.`,
        variant: "destructive",
      });
      return;
    }

    const success = await deductEcoCoins(option.cost);
    if (success) {
      if (option.action === 'route') {
        toast({
          title: "Redemption Successful!",
          description: `Taking you to the food ordering demo. Your discount is ready.`,
        });
        router.push(`/irctc-food-demo?discount=${option.value}`);
      } else if (option.action === 'animation') {
         setShowAnimation(true);
      }
    }
    // The deductEcoCoins function already shows a toast on failure.
  };

  if (showAnimation) {
    return <PlantTreeAnimation onComplete={() => setShowAnimation(false)} />;
  }

  return (
    <Card className="shadow-lg w-full">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-primary flex items-center gap-2">
          <Gift className="h-6 w-6" /> Redeem EcoCoins
        </CardTitle>
        <CardDescription>Use your EcoCoins for discounts, contributions, and more.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 text-center">
            <p className="text-lg font-semibold">Your current balance:</p>
            <p className="text-3xl font-bold text-primary flex items-center justify-center gap-1">
                {ecoCoins} <Coins className="h-7 w-7" />
            </p>
        </div>
        {redemptionOptions.length > 0 ? (
          <ul className="space-y-4">
            {redemptionOptions.map((option) => (
              <li 
                key={option.id} 
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="flex-grow mb-3 sm:mb-0">
                  <p className="font-semibold text-lg text-primary">{option.name}</p>

                  <p className="text-sm text-muted-foreground">{option.description}</p>
                  <p className="text-sm font-medium mt-1">
                    Cost: <span className="text-accent">{option.cost} EcoCoins</span>
                  </p>
                </div>
                <Button 
                  onClick={() => handleRedeem(option)} 
                  disabled={ecoCoins < option.cost}
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
                  aria-label={`Redeem ${option.name} for ${option.cost} EcoCoins`}
                >
                  Redeem
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-4">No redemption options available at the moment. Check back soon!</p>
        )}
      </CardContent>
    </Card>
  );
}

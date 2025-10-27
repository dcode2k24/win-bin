
"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Train, Utensils, Ticket } from 'lucide-react';
import Image from 'next/image';

const THALI_OPTIONS = [
  { id: 'veg', name: 'Veg Thali', price: 200, image: '/Veg-Thali.png', hint: 'indian food' },
  { id: 'nonveg', name: 'Non-Veg Thali', price: 250, image: '/Non-Veg-Thali.jpg', hint: 'indian food' },
  { id: 'jain', name: 'Jain Thali (No Onion/Garlic)', price: 210, image: '/Jain-Thali.png', hint: 'indian food' },
];

const TAX_RATE = 0.05; // 5% GST

export function IrctcFoodClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const discountParam = Number(searchParams.get('discount')) || 0;

  const [pnr, setPnr] = useState('');
  const [isPnrSubmitted, setIsPnrSubmitted] = useState(false);
  const [selectedThali, setSelectedThali] = useState<{ id: string; name: string; price: number } | null>(null);

  const handlePnrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.trim().length >= 10) {
      setIsPnrSubmitted(true);
    }
  };

  const handleSelectThali = (thali: typeof THALI_OPTIONS[0]) => {
    setSelectedThali(thali);
  };
  
  const calculatePayment = () => {
    if (!selectedThali) return { tax: 0, discount: 0, finalPrice: 0 };
    
    const tax = selectedThali.price * TAX_RATE;
    let discount = 0;

    // A special value of 999 signifies a full GST waiver
    if (discountParam === 999) {
      discount = tax;
    } else {
      discount = discountParam;
    }
    
    const discountedTax = Math.max(0, tax - discount);
    const finalPrice = selectedThali.price + discountedTax;
    
    return { tax, discount, discountedTax, finalPrice };
  };

  const { tax, discount, discountedTax, finalPrice } = calculatePayment();
  
  return (
    <>
      <Alert variant="destructive" className="mb-6 bg-yellow-100 border-yellow-400 text-yellow-800">
        <AlertTitle>Demonstration Interface</AlertTitle>
        <AlertDescription>
          This is a temporary interface to demonstrate the IRCTC food ordering and tax discount process. This is not the real IRCTC website.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
            <Train className="h-7 w-7" /> Order Food for Your Journey
          </CardTitle>
          <CardDescription>Enter your PNR to see available food options.</CardDescription>
        </CardHeader>
        <CardContent>
          {!isPnrSubmitted ? (
            <form onSubmit={handlePnrSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pnr" className="flex items-center gap-2 mb-1"><Ticket className="h-4 w-4"/> PNR Number</Label>
                <Input 
                  id="pnr" 
                  value={pnr} 
                  onChange={(e) => setPnr(e.target.value)} 
                  placeholder="Enter 10-digit PNR" 
                  maxLength={10} 
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Find Food</Button>
            </form>
          ) : !selectedThali ? (
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center text-primary flex items-center justify-center gap-2">
                <Utensils/> Select Your Meal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {THALI_OPTIONS.map(thali => (
                  <Card key={thali.id} className="cursor-pointer hover:shadow-xl transition-shadow" onClick={() => handleSelectThali(thali)}>
                    <CardHeader className="p-0">
                       <Image 
                          src={thali.image} 
                          alt={thali.name} 
                          width={150} 
                          height={150} 
                          className="w-full h-auto rounded-t-lg"
                          data-ai-hint={thali.hint}
                        />
                    </CardHeader>
                    <CardContent className="p-4">
                      <p className="font-bold text-lg">{thali.name}</p>
                      <p className="text-muted-foreground">Price: ₹{thali.price}</p>
                      <Button className="w-full mt-2">Select</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
              <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center text-primary">Payment Summary</h3>
              <Card className="bg-background p-4">
                 <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                         <span>Item:</span>
                         <span className="font-medium">{selectedThali.name}</span>
                     </div>
                     <div className="flex justify-between">
                         <span>Base Price:</span>
                         <span className="font-medium">₹{selectedThali.price.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between">
                         <span>GST (5%):</span>
                         <span className="font-medium">₹{tax.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-destructive">
                         <span>Win-Bin Discount:</span>
                         <span className="font-medium">- ₹{discount.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between border-t pt-2 mt-2">
                         <span>Tax Payable:</span>
                         <span className="font-medium">₹{discountedTax.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2 text-primary">
                         <span>Total Amount:</span>
                         <span>₹{finalPrice.toFixed(2)}</span>
                     </div>
                 </div>
              </Card>
              <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setSelectedThali(null)} className="w-full">Change Selection</Button>
                  <Button onClick={() => router.push('/dashboard')} className="w-full">Back to Dashboard</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

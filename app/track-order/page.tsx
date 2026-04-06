"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Order = {
  _id: string;
  customerName: string;
  phoneNumber: string;
  orderedAt: string;
  orderStatus: string;
  paymentMode: "cod" | "online";
  totalAmount: number;
};

export default function OrdersPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOrders = async () => {
    if (!phone.trim()) {
      toast.error("Please enter a phone number");
      return;
    }

    setLoading(true);
    setSearched(true);
    
    try {
      const res = await fetch(`/api/order/by-phone?phone=${phone.trim()}`);
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch orders");
      }

      setOrders(data.orders || []);
      
      if (data.orders?.length === 0) {
        toast.info("No orders found for this phone number");
      }
    } catch (error) {
      setOrders([]);
      toast.error(error instanceof Error ? error.message : "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Your Orders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter registered phone number"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
            />
            <Button 
              onClick={fetchOrders}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && searched && orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found for this phone number
            </div>
          )}

          {orders.length > 0 && (
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Found {orders.length} order{orders.length !== 1 ? "s" : ""}
              </div>
              
              {orders.map((order) => (
                <Link 
                  key={order._id} 
                  href={`/order/${order._id}`}
                  className="block"
                >
                  <Card className="hover:bg-accent transition-colors">
                    <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.phoneNumber}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${
                            order.orderStatus === "delivered" 
                              ? "bg-green-500" 
                              : order.orderStatus === "cancelled"
                              ? "bg-destructive"
                              : "bg-yellow-500"
                          }`} />
                          <span className="capitalize">{order.orderStatus}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.orderedAt)?.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      
                      <div className="space-y-1 md:text-right">
                        <p className="font-medium">
                          ₹{order?.totalAmount?.toLocaleString("en-IN")}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {order.paymentMode === "cod" 
                            ? "Cash on Delivery" 
                            : "Online Payment"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
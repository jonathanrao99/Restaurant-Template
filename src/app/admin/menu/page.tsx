"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";

const ADMIN_CODE = "366736";

export default function AdminMenuPage() {
  const [code, setCode] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotName, setForgotName] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthed) {
      setLoading(true);
      supabase
        .from("menu_items")
        .select("id, name, sold_out")
        .order("name")
        .then(({ data, error }) => {
          setMenu(data || []);
          setLoading(false);
          if (error) setError(error.message);
        });
    }
  }, [isAuthed]);

  const handleToggle = async (id: number, sold_out: boolean) => {
    setMenu((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, sold_out: !sold_out } : item
      )
    );
    await supabase.from("menu_items").update({ sold_out: !sold_out }).eq("id", id);
  };

  const handleForgot = async () => {
    setForgotSent(true);
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: "info@desiflavorskaty.com",
        subject: "Admin Passcode Reset Request",
        html: `<p><b>Name:</b> ${forgotName}<br/><b>Phone:</b> ${forgotPhone}<br/>User is unable to login to the admin menu. Please verify if this user is part of the organization before sharing the passcode.</p>`,
        text: `Name: ${forgotName}\nPhone: ${forgotPhone}\nUser is unable to login to the admin menu. Please verify if this user is part of the organization before sharing the passcode.`
      })
    });
  };

  if (!isAuthed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2 text-center">Admin Login</h2>
          <Input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="6-digit code"
            className="text-center tracking-widest text-lg"
          />
          <Button
            onClick={() => setIsAuthed(code === ADMIN_CODE)}
            disabled={code.length !== 6}
            className="w-full"
          >
            Login
          </Button>
          <button
            className="text-xs text-desi-orange underline mt-2"
            onClick={() => setShowForgot(true)}
            type="button"
          >
            Forgot password?
          </button>
        </div>
        <Dialog open={showForgot} onOpenChange={setShowForgot}>
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm flex flex-col gap-3">
              <h3 className="text-lg font-semibold mb-2">Request Passcode</h3>
              <Input
                placeholder="Your Name"
                value={forgotName}
                onChange={e => setForgotName(e.target.value)}
                className="mb-2"
              />
              <Input
                placeholder="Your Phone Number"
                value={forgotPhone}
                onChange={e => setForgotPhone(e.target.value)}
                className="mb-2"
              />
              <Button
                onClick={handleForgot}
                disabled={!forgotName || !forgotPhone || forgotSent}
                className="w-full"
              >
                {forgotSent ? "Request Sent" : "Send Request"}
              </Button>
              <Button variant="ghost" onClick={() => setShowForgot(false)} className="w-full mt-2">Cancel</Button>
            </div>
          </div>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Menu - Toggle Sold Out</h1>
      {loading ? (
        <div>Loading menu...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menu.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
              <span className="font-medium">{item.name}</span>
              <Button
                variant={item.sold_out ? "destructive" : "default"}
                onClick={() => handleToggle(item.id, item.sold_out)}
              >
                {item.sold_out ? "Mark Available" : "Mark Sold Out"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-300 backdrop-blur shadow-lg inline-flex items-center gap-2"
    >
      <WifiOff className="h-3.5 w-3.5" />
      Você está offline. Seu progresso está sendo salvo localmente e sincroniza quando voltar.
    </div>
  );
}

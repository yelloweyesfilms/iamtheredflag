import { useRouter } from "next/router";

const RED = "#E85C3A";
const BASE = "#09090f";

const NAV_ITEMS = [
  { label: "Jouer",      icon: "🚩", href: "/" },
  { label: "Classement", icon: "🏆", href: "/hall-of-fame" },
  { label: "Défis",      icon: "🎯", href: "/defi" },
  { label: "Profil",     icon: "👤", href: "/profil" },
  { label: "Boutique",   icon: "👕", href: "https://wearthedrama.com", external: true },
];

export default function RedFlagNav() {
  const router = useRouter();
  const current = router.pathname;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
      background: `${BASE}ee`,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
    }}>
      <div style={{
        maxWidth: 480, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-around",
        padding: "0 8px",
      }}>
        {NAV_ITEMS.map((item) => {
          const isActive = !item.external && (
            item.href === "/" ? current === "/" : current.startsWith(item.href)
          );
          return (
            <a
              key={item.href}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={item.external ? undefined : (e) => { e.preventDefault(); router.push(item.href); }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                padding: "6px 12px", borderRadius: 12, textDecoration: "none",
                background: isActive ? `${RED}15` : "transparent",
                transition: "all 0.15s ease",
                minWidth: 56,
                position: "relative",
              }}
            >
              <span style={{
                fontSize: 20, lineHeight: 1,
                filter: isActive ? `drop-shadow(0 0 8px ${RED}80)` : "none",
                transition: "filter 0.15s ease",
              }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: 9, fontWeight: isActive ? 800 : 600,
                color: isActive ? RED : "rgba(255,255,255,0.3)",
                letterSpacing: 0.5, textTransform: "uppercase",
                whiteSpace: "nowrap",
                transition: "color 0.15s ease",
              }}>
                {item.label}
              </span>
              {isActive && (
                <div style={{
                  position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
                  width: 20, height: 2, background: RED, borderRadius: 1,
                }} />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}

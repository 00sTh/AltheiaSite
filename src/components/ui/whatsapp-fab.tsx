"use client";

interface WhatsAppFabProps {
  whatsappNumber: string;
}

/** Botão flutuante WhatsApp — fixed bottom-right */
export function WhatsAppFab({ whatsappNumber }: WhatsAppFabProps) {
  const number = whatsappNumber.replace(/\D/g, "") || "5511999999999";
  const url = `https://wa.me/${number}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar pelo WhatsApp"
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
        width: 56,
        height: 56,
        borderRadius: "50%",
        backgroundColor: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 6px 24px rgba(37,211,102,0.55)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow =
          "0 4px 16px rgba(37,211,102,0.4)";
      }}
    >
      {/* WhatsApp SVG */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.607 1.82 6.5L4 29l7.72-1.78A11.94 11.94 0 0 0 16 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.97 0-3.82-.537-5.41-1.47l-.39-.23-4.58 1.06 1.09-4.44-.26-.4A9.96 9.96 0 0 1 6 15c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm5.49-7.4c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.03 1.01-1.03 2.46s1.05 2.85 1.2 3.05c.15.2 2.07 3.16 5.01 4.43.7.3 1.25.48 1.67.61.7.22 1.34.19 1.84.12.56-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.28-.19-.58-.34z" />
      </svg>
    </a>
  );
}

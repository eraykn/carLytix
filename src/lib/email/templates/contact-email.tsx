import * as React from "react";

interface ContactEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export const ContactEmail: React.FC<ContactEmailProps> = ({
  firstName,
  lastName,
  email,
  message,
}) => {
  const currentDate = new Date().toLocaleString("tr-TR", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: "#0f172a",
        color: "#e2e8f0",
        padding: "40px 20px",
        margin: 0,
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#1e293b",
          borderRadius: "16px",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          overflow: "hidden",
          boxShadow: "0 20px 40px -10px rgba(16, 185, 129, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "24px",
            background: "linear-gradient(135deg, #064e3b 0%, #1e293b 100%)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#10b981",
              margin: 0,
            }}
          >
            📩 Yeni İletişim Talebi
          </h1>
          <p
            style={{
              fontSize: "14px",
              color: "#94a3b8",
              margin: "8px 0 0 0",
            }}
          >
            Carlytix İletişim Formu
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: "32px" }}>
          {/* Sender Info */}
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#10b981",
                margin: "0 0 16px 0",
              }}
            >
              👤 Gönderen Bilgileri
            </h2>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#94a3b8",
                      fontSize: "14px",
                      width: "100px",
                    }}
                  >
                    Ad Soyad:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#e2e8f0",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {firstName} {lastName}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    E-posta:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#e2e8f0",
                      fontSize: "14px",
                    }}
                  >
                    <a
                      href={`mailto:${email}`}
                      style={{
                        color: "#3b82f6",
                        textDecoration: "none",
                      }}
                    >
                      {email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#94a3b8",
                      fontSize: "14px",
                    }}
                  >
                    Tarih:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#e2e8f0",
                      fontSize: "14px",
                    }}
                  >
                    {currentDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Message */}
          <div
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderRadius: "12px",
              padding: "20px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#3b82f6",
                margin: "0 0 16px 0",
              }}
            >
              💬 Mesaj
            </h2>

            <p
              style={{
                fontSize: "15px",
                lineHeight: "1.7",
                color: "#e2e8f0",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </p>
          </div>

          {/* Reply Button */}
          <div
            style={{
              textAlign: "center" as const,
              marginTop: "24px",
            }}
          >
            <a
              href={`mailto:${email}?subject=Re: Carlytix İletişim Talebi&body=Merhaba ${firstName},%0A%0A`}
              style={{
                display: "inline-block",
                backgroundColor: "#10b981",
                color: "#ffffff",
                fontWeight: "bold",
                padding: "12px 28px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Yanıtla
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "16px 24px",
            backgroundColor: "#0f172a",
            borderTop: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              color: "#64748b",
              margin: 0,
            }}
          >
            Bu e-posta Carlytix iletişim formu üzerinden otomatik olarak
            gönderilmiştir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactEmail;

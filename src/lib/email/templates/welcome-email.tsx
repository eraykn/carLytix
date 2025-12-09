import * as React from "react";

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://carlytix.io";

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
        {/* Header with Logo */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "32px 24px",
            background: "linear-gradient(135deg, #064e3b 0%, #1e293b 100%)",
            borderBottom: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <img
            src={`${baseUrl}/images/brands/carlytix-concept-a-logo.svg`}
            alt="Carlytix Logo"
            style={{
              height: "60px",
              width: "auto",
            }}
          />
        </div>

        {/* Main Content */}
        <div style={{ padding: "40px 32px" }}>
          {/* Success Title */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "#10b981",
              textAlign: "center" as const,
              margin: "0 0 24px 0",
            }}
          >
            Hesabın Başarıyla Oluşturuldu! ✨
          </h1>

          {/* Greeting */}
          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#e2e8f0",
              margin: "0 0 20px 0",
            }}
          >
            Merhaba <strong style={{ color: "#10b981" }}>{name}</strong>,
          </p>

          <p
            style={{
              fontSize: "16px",
              lineHeight: "1.7",
              color: "#cbd5e1",
              margin: "0 0 32px 0",
            }}
          >
            Carlytix'e hoş geldin! Artık yüzlerce araç modelini karşılaştırabilir,
            sürüş profilin ve önceliklerin doğrultusunda kişiselleştirilmiş araç
            önerileri alabilirsin.
          </p>

          {/* Features Section */}
          <div
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#10b981",
                margin: "0 0 16px 0",
              }}
            >
              🚀 Carlytix ile Neler Yapabilirsin?
            </h2>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
                }}
              >
                ✅ AI destekli asistan ile sana en uygun araçları anında öğren
              </li>
              <li
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
                }}
              >
                ✅ Araçları performans, güvenlik, teknoloji ve ekonomi açısından
                karşılaştır
              </li>
              <li
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(16, 185, 129, 0.1)",
                }}
              >
                ✅ Favori modellerini kaydet ve değişiklikleri takip et
              </li>
              <li
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  padding: "8px 0",
                }}
              >
                ✅ Tercihlerini düzenleyerek önerileri daha da kişisel hâle getir
              </li>
            </ul>
          </div>

          {/* Security Section */}
          <div
            style={{
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#3b82f6",
                margin: "0 0 16px 0",
              }}
            >
              🔐 Güvenliğin Bizim İçin Önemli
            </h2>

            <p
              style={{
                fontSize: "15px",
                color: "#cbd5e1",
                margin: "0 0 12px 0",
              }}
            >
              Hesabın güvenliği için istersen profil bölümünden:
            </p>

            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <li
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  padding: "6px 0",
                }}
              >
                • Şifreni güncelleyebilir
              </li>
              <li
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  padding: "6px 0",
                }}
              >
                • Giriş geçmişini görüntüleyebilir
              </li>
              <li
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  padding: "6px 0",
                }}
              >
                • Hesap ayarlarını yönetebilirsin
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div
            style={{
              textAlign: "center" as const,
              backgroundColor: "rgba(16, 185, 129, 0.05)",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "24px",
              border: "1px solid rgba(16, 185, 129, 0.15)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#10b981",
                margin: "0 0 12px 0",
              }}
            >
              🎯 Başlamaya Hazırsın
            </h2>

            <p
              style={{
                fontSize: "15px",
                color: "#cbd5e1",
                margin: "0 0 20px 0",
              }}
            >
              Her adımda yanında olmaya devam edeceğiz.
              <br />
              Soruların olursa bizimle iletişim kurmaktan çekinme.
            </p>

            <a
              href={baseUrl}
              style={{
                display: "inline-block",
                backgroundColor: "#10b981",
                color: "#ffffff",
                fontWeight: "bold",
                padding: "14px 32px",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "16px",
              }}
            >
              Carlytix'i Keşfet
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center" as const,
            padding: "24px 32px",
            backgroundColor: "#0f172a",
            borderTop: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#10b981",
              margin: "0 0 4px 0",
            }}
          >
            Carlytix Ekibi
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#64748b",
              margin: 0,
            }}
          >
            Veriye dayalı, akıllı araç seçim platformu.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeEmail;

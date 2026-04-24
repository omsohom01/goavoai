import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EvexaEmailTemplateProps {
  attendeeName: string;
  heading: string;
  bodyParagraphs: string[];
  eventDetails?: { label: string; value: string }[];
  type: "happy" | "sad";
}

export const EvexaEmailTemplate = ({
  attendeeName,
  heading,
  bodyParagraphs,
  eventDetails,
  type,
}: EvexaEmailTemplateProps) => {
  const previewText = heading;

  const imageUrl = type === "happy"
    ? "https://res.cloudinary.com/dib3nndkh/image/upload/v1777060412/happy_fxkozh.png"
    : "https://res.cloudinary.com/dib3nndkh/image/upload/v1777060442/sad_cegaub.png";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.wrapper}>
          <Text style={styles.brand}>EVEXA</Text>

          <Section style={styles.card}>
            <Text style={styles.greeting}>Hi {attendeeName},</Text>

            {bodyParagraphs.map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}

            <Section style={styles.iconWrap}>
              <Img
                src={imageUrl}
                width="72"
                height="72"
                alt={type}
                style={styles.icon}
              />
            </Section>

            {eventDetails && eventDetails.length > 0 && (
              <Section style={styles.detailsBox}>
                {eventDetails.map((detail, index) => (
                  <Section key={index} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{detail.label}</Text>
                    <Text style={styles.detailValue}>{detail.value}</Text>
                  </Section>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              This email was intended for {attendeeName}. If you did not expect this message, you can safely ignore it.
            </Text>
            <Text style={styles.footerCopyright}>
              &copy; {new Date().getFullYear()} Evexa
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    backgroundColor: "#efefef",
    fontFamily: "Arial, Helvetica, sans-serif",
    margin: 0,
    padding: "32px 12px",
  },
  wrapper: {
    width: "100%",
    maxWidth: "620px",
    margin: "0 auto",
  },
  brand: {
    color: "#111827",
    textAlign: "center" as const,
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "8px",
    margin: "4px 0 22px",
  },
  card: {
    backgroundColor: "#ffffff",
    backgroundImage: "linear-gradient(90deg, #e4eee7 0%, #ffffff 55%)",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    padding: "32px 26px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
  },
  greeting: {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "1.4",
    margin: "0 0 16px",
  },
  paragraph: {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px",
  },
  detailsBox: {
    backgroundColor: "#f4f4f5",
    borderRadius: "14px",
    padding: "18px",
    margin: "24px 0 4px",
  },
  detailRow: {
    marginBottom: "10px",
  },
  detailLabel: {
    color: "#9ca3af",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: "0 0 4px",
  },
  detailValue: {
    color: "#111827",
    fontSize: "16px",
    lineHeight: "1.5",
    fontWeight: "700",
    margin: "0",
    wordBreak: "break-word" as const,
  },
  iconWrap: {
    textAlign: "center" as const,
    margin: "10px 0 18px",
  },
  icon: {
    margin: "0 auto",
    display: "block",
  },
  footer: {
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: "1.6",
    textAlign: "center" as const,
    margin: "0",
  },
  footerCopyright: {
    color: "#9ca3af",
    fontSize: "12px",
    lineHeight: "1.5",
    textAlign: "center" as const,
    margin: "8px 0 0",
  },
};

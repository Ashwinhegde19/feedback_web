import { Email, Box, Text, Spacer, Preview, Head, Font, Heading, Row, Section } from "react-email";

export interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp }) => {
  return (
    <Email>
      <Preview>Verify your email address</Preview>
      <Head>
        <Font fontFamily="Arial, sans-serif" />
      </Head>
      <Box>
        <Heading>Verify your email address</Heading>
        <Section>
          <Row>
            <Text>Hi {username},</Text>
          </Row>
          <Spacer size={16} />
          <Row>
            <Text>Thank you for signing up. Your verification code is <strong>{otp}</strong>.</Text>
          </Row>
        </Section>
      </Box>
    </Email>
  );
};

export default VerificationEmail;
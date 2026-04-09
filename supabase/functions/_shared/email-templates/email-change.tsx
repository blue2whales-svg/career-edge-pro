/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Link, Preview, Text } from 'npm:@react-email/components@0.0.22'

interface EmailChangeEmailProps { siteName: string; email: string; newEmail: string; confirmationUrl: string }

export const EmailChangeEmail = ({ siteName, email, newEmail, confirmationUrl }: EmailChangeEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Confirm your email change for CV Edge</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm email change</Heading>
        <Text style={text}>You requested to change your email from <Link href={`mailto:${email}`} style={link}>{email}</Link> to <Link href={`mailto:${newEmail}`} style={link}>{newEmail}</Link>.</Text>
        <Button style={button} href={confirmationUrl}>Confirm Email Change</Button>
        <Text style={footer}>If you didn't request this, please secure your account immediately.</Text>
      </Container>
    </Body>
  </Html>
)
export default EmailChangeEmail

const main = { backgroundColor: '#0a0e1a', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '480px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#f0ebe0', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#8090a8', lineHeight: '1.6', margin: '0 0 20px' }
const link = { color: '#c9a84c', textDecoration: 'underline' }
const button = { backgroundColor: '#c9a84c', color: '#0a0e1a', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '10px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#666', margin: '30px 0 0' }

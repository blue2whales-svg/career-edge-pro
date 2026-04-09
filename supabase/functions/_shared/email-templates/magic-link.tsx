/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps { siteName: string; confirmationUrl: string }

export const MagicLinkEmail = ({ siteName, confirmationUrl }: MagicLinkEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your login link for CV Edge</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Your magic login link</Heading>
        <Text style={text}>Click the button below to sign in to CV Edge instantly. This link expires shortly.</Text>
        <Button style={button} href={confirmationUrl}>⚡ Sign In Now</Button>
        <Text style={footer}>If you didn't request this link, you can safely ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)
export default MagicLinkEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '480px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#0a0e1a', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#555', lineHeight: '1.6', margin: '0 0 20px' }
const button = { backgroundColor: '#c9a84c', color: '#0a0e1a', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '10px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999', margin: '30px 0 0' }

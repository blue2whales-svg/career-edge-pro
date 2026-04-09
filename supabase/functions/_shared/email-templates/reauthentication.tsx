/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps { token: string }

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your CV Edge verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Verification code</Heading>
        <Text style={text}>Use this code to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>This code expires shortly. If you didn't request this, ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)
export default ReauthenticationEmail

const main = { backgroundColor: '#0a0e1a', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '480px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#f0ebe0', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#8090a8', lineHeight: '1.6', margin: '0 0 20px' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 'bold' as const, color: '#c9a84c', margin: '0 0 30px', letterSpacing: '4px' }
const footer = { fontSize: '12px', color: '#666', margin: '30px 0 0' }

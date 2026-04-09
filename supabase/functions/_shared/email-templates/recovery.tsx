/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps { siteName: string; confirmationUrl: string }

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Reset your CV Edge password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset your password</Heading>
        <Text style={text}>We received a request to reset your password. Click below to choose a new one:</Text>
        <Button style={button} href={confirmationUrl}>Reset Password</Button>
        <Text style={footer}>If you didn't request this, you can safely ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)
export default RecoveryEmail

const main = { backgroundColor: '#0a0e1a', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '480px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#f0ebe0', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#8090a8', lineHeight: '1.6', margin: '0 0 20px' }
const button = { backgroundColor: '#c9a84c', color: '#0a0e1a', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '10px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#666', margin: '30px 0 0' }

/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Body, Button, Container, Head, Heading, Html, Link, Preview, Text } from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps { siteName: string; siteUrl: string; recipient: string; confirmationUrl: string }

export const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to CV Edge — confirm your email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome aboard! 🎉</Heading>
        <Text style={text}>Thanks for joining <Link href={siteUrl} style={link}><strong>CV Edge</strong></Link>!</Text>
        <Text style={text}>Confirm your email (<Link href={`mailto:${recipient}`} style={link}>{recipient}</Link>) to get started:</Text>
        <Button style={button} href={confirmationUrl}>Get Started</Button>
        <Text style={footer}>If you didn't create an account, you can safely ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)
export default SignupEmail

const main = { backgroundColor: '#0a0e1a', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '32px 28px', maxWidth: '480px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#f0ebe0', margin: '0 0 20px' }
const text = { fontSize: '15px', color: '#8090a8', lineHeight: '1.6', margin: '0 0 20px' }
const link = { color: '#c9a84c', textDecoration: 'underline' }
const button = { backgroundColor: '#c9a84c', color: '#0a0e1a', fontSize: '15px', fontWeight: 'bold' as const, borderRadius: '10px', padding: '14px 28px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#666', margin: '30px 0 0' }

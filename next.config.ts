import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['libsql', '@libsql/client', '@libsql/linux-x64-musl'],
  images: {
    // Fase A: immagini servite localmente
    // Fase B: aggiungere il dominio Cloudflare R2
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
}

export default withPayload(nextConfig)

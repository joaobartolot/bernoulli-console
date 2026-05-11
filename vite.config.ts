import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import qrcode from 'qrcode-terminal'

function devServerQrCode(): Plugin {
  return {
    name: 'dev-server-qr-code',
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const networkUrl = server.resolvedUrls?.network[0]

        if (!networkUrl) {
          return
        }

        console.info(`\nOpen on your phone: ${networkUrl}`)
        qrcode.generate(networkUrl, { small: true })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devServerQrCode()],
})

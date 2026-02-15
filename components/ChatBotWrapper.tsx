'use client'

import { usePathname } from 'next/navigation'
import ChatBot from './ChatBot'

/**
 * Wraps ChatBot and hides WhatsApp on certain routes (e.g. test pages).
 */
export default function ChatBotWrapper() {
  const pathname = usePathname()
  const isTestEmailPage = pathname === '/testemailout'

  return (
    <ChatBot
      showChatToggle={false}
      showWhatsApp={!isTestEmailPage}
    />
  )
}

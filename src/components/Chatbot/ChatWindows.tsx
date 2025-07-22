'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { HttpAgent } from '@ag-ui/client'
import { SendHorizonal } from 'lucide-react'
import { TypingIndicator } from './TypeIndicator'
import { DeveloperDashboard } from './developer-dashboard'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const agent = new HttpAgent({
  url: 'http://192.168.0.156:8000/api/chat',
})

interface ChatMessage {
  text: string
  sender: 'user' | 'bot'
}

export const ChatWindows = () => {
  const router = useRouter()
  const pathname = usePathname()
  const currentId = pathname.split('/')[1] || ''

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messageListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  useEffect(() => {
    const setup = async () => {
      if (currentId === 'auto' || currentId === '') return

      try {
        const res = await fetch(
          `http://192.168.0.156:8000/api/chat/history/${currentId}`
        )

        if (!res.ok) throw new Error(`Failed to fetch chat: ${res.status}`)

        const data = await res.json()
        const history: ChatMessage[] = (data?.messages || []).map((m: any) => ({
          text: m.content,
          sender: m.role === 'user' ? 'user' : 'bot',
        }))

        setMessages(history)
      } catch (error) {
        console.error('Chat fetch error:', error)
      }
    }

    setup()
  }, [currentId])

  useEffect(() => {
    const subscription = agent.subscribe({
      onTextMessageStartEvent: () => {
        setMessages((prev) => [...prev, { text: '', sender: 'bot' }])
        setIsTyping(true)
      },
      onTextMessageContentEvent: ({ event }: any) => {
        setMessages((prev) => {
          const updated = [...prev]
          const last = updated[updated.length - 1]
          if (!last || last.sender !== 'bot') return prev
          updated[updated.length - 1] = {
            ...last,
            text: last.text + (event.delta ?? ''),
          }
          return updated
        })
      },
      onTextMessageEndEvent: () => {
        setIsTyping(false)
      },
      onRunFinishedEvent: ({ event }: any) => {
        setIsTyping(false)
        if ((currentId === 'auto' || currentId === '') && event?.threadId) {
          router.replace(`/${event.threadId}`)
        }
      },
    })

    return () => subscription.unsubscribe?.()
  }, [currentId])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }])
    setInput('')
    setIsTyping(true)

    try {
      const messageId = crypto.randomUUID()

      await agent.setMessages([
        { id: messageId, role: 'user', content: userMessage },
      ])

      await agent.runAgent({ tools: [] })
    } catch (err) {
      console.error('Agent error:', err)
      setIsTyping(false)
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="flex flex-col w-[35%] border-r bg-gray-50">
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4"
          ref={messageListRef}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-lg px-4 py-2 rounded-xl whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white self-end ml-auto'
                  : 'bg-white text-black self-start mr-auto'
              }`}
            >
              <ReactMarkdown
                children={msg.text}
                remarkPlugins={[remarkGfm, remarkHtml]}
              />
            </div>
          ))}
          {isTyping && <TypingIndicator />}
        </div>

        <div className="p-2 border-t bg-white">
          <div className="flex items-center rounded-xl border px-4 py-2">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 px-3 py-2 outline-none bg-transparent text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <button
              onClick={handleSend}
              className="text-muted-foreground hover:text-black"
            >
              <SendHorizonal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="w-[65%] h-full overflow-y-auto bg-white p-3">
        <DeveloperDashboard />
      </div>
    </div>
  )
}

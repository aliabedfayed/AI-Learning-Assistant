"use client"
import { chat, getChatHistory } from '@/services/aiService'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useFormik } from 'formik'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import * as Yup from "yup"
import { MessageSquare, Send, Sparkles } from 'lucide-react'
import Spinner from '../common/Spinner'
import Cookies from "js-cookie"
import { UserData } from '@/interfaces/auth/login'
import { ChatHistory, ChatMessage } from '@/interfaces/ai/chatHistory'

export default function ChatInterface() {
    const { id } = useParams<{ id: string }>()
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const [user, setUser] = useState<UserData | null>(null)

    useEffect(() => {
        const cookieUser = Cookies.get("user")
        if (cookieUser) {
            setUser(JSON.parse(cookieUser))
        }
    }, [])

    const { data, isLoading } = useQuery<ChatHistory>({
        queryKey: ['chat-history', id],
        queryFn: () => getChatHistory(id),
        enabled: !!id
    })

    const [history, setHistory] = useState<ChatMessage[]>([])

    useEffect(() => {
        setHistory(data?.data ?? [])
    }, [data])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [history])

    const sendMessageMutation = useMutation({
        mutationFn: (message: string) => chat(id, message),
        onMutate: (message: string) => {
            const userMessage: ChatMessage = { _id: '', role: 'user', content: message, timestamp: new Date(), relevantChunks: [] }
            setHistory((prev: ChatMessage[]) => [...prev, userMessage])
        },
        onSuccess: (res) => {
            const assistantMessage: ChatMessage = {
                _id: "", role: 'assistant', content: res.data.answer, timestamp: new Date(), relevantChunks: res.data.relevantChunks
            }
            setHistory((prev: ChatMessage[]) => [...prev, assistantMessage])
        },
        onError: () => {
            const errorMessage: ChatMessage = {
                _id: "", role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', timestamp: new Date(), relevantChunks: []
            }
            setHistory((prev: ChatMessage[]) => [...prev, errorMessage])
        }
    })

    const formik = useFormik({
        initialValues: { message: '' },
        validationSchema: Yup.object({
            message: Yup.string().trim().required('Message cannot be empty')
        }),
        onSubmit: (values, { resetForm }) => {
            sendMessageMutation.mutate(values.message)
            resetForm()
        }
    })

    function renderMessage(msg: ChatMessage, index: number) {
        const isUser = msg.role === 'user'
        return (
            <div key={index} className={`flex items-start gap-3 my-4 ${isUser ? 'justify-end' : ''}`}>
                {!isUser && (
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                    </div>
                )}
                <div className={`max-w-lg p-4 rounded-2xl shadow-sm ${isUser ?
                    'bg-linear-to-br from-emerald-500 to-teal-500 text-white rounded-br-md'
                    : 'bg-white border border-slate-200/60 text-slate-800 rounded-bl-md'
                    }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                {isUser && (
                    <div className="w-9 h-9 rounded-xl bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-700 font-semibold text-sm shrink-0 shadow-sm">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl items-center justify-center shadow-xl shadow-slate-200/50">
                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                    <MessageSquare className="w-7 h-7 text-emerald-600" strokeWidth={2} />
                </div>
                <Spinner />
                <p className="text-sm text-slate-500 mt-3 font-medium">Loading chat history...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[70vh] bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto bg-linear-to-br from-slate-50/50 via-white/50 to-slate-50/50">
                {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10">
                            <MessageSquare className="w-8 h-8 text-emerald-600" strokeWidth={2} />
                        </div>
                        <h3 className="text-base font-semibold text-slate-900 mb-2">Start a conversation</h3>
                        <p className="text-sm text-slate-500">Ask me anything about the document!</p>
                    </div>
                ) : (
                    history.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
                {sendMessageMutation.isPending && (
                    <div className="flex items-center gap-3 my-4">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center justify-center shrink-0">
                            <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-slate-200/60">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-5 border-t border-slate-200/60 bg-white/80">
                <form onSubmit={formik.handleSubmit} className="flex items-center gap-3">
                    <input
                        name='message'
                        type="text"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Ask a follow-up question..."
                        className="flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                        disabled={sendMessageMutation.isPending}
                    />
                    <button
                        type="submit"
                        disabled={sendMessageMutation.isPending || !formik.values.message.trim()}
                        className="shrink-0 w-12 h-12 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center"
                    >
                        <Send className="w-5 h-5" strokeWidth={2} />
                    </button>
                </form>
            </div>
        </div>
    )
}

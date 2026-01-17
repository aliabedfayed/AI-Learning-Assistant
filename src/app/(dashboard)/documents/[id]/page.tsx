"use client"

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getDocumentById } from '@/services/documentService';
import Spinner from '@/components/common/Spinner';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import Tabs from '@/components/common/Tabs';
import Link from 'next/link';
import ChatInterface from '@/components/chat/ChatInterface';
import AIActions from '@/components/ai/AIActions';
import FlashcardManager from '@/components/flashcards/FlashcardManager';
import QuizManager from '@/components/quizzes/QuizManager';
import { DocumentById } from '@/interfaces/documents/documentById';

export default function DocumentDetails() {
    const { id } = useParams<{ id: string }>()
    const [activeTab, setActiveTab] = useState('Content');

    const { data, isLoading } = useQuery<DocumentById>({
        queryKey: ['document', id],
        queryFn: () => getDocumentById(id),
        enabled: !!id
    })

    function getPdfUrl() {
        if (!data?.data.filePath) return null

        const filePath = data?.data.filePath

        if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
            return filePath
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL
        return `${baseUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`
    }

    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
    console.log("filePath:", data?.data.filePath)


    const renderContent = () => {
        if (isLoading) return <Spinner />
        if (!data?.data.filePath) return <div className="text-center p-8">PDF not available.</div>

        const pdfUrl = getPdfUrl()!

        return (
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300">
                    <span className="text-sm font-medium text-gray-700">Document Viewer</span>
                    <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        <ExternalLink size={16} />
                        Open in new tab
                    </a>
                </div>
                <div className="bg-gray-100 p-1">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-[70vh] bg-white rounded border border-gray-300"
                        title="PDF Viewer"
                        frameBorder="0"
                        style={{ colorScheme: 'light' }}
                    />
                </div>
            </div>
        )
    }

    const tabs = [
        { name: 'Content', label: 'Content', content: renderContent() },
        { name: 'Chat', label: 'Chat', content: <ChatInterface /> },
        { name: 'AI Actions', label: 'AI Actions', content: <AIActions /> },
        { name: 'Flashcards', label: 'Flashcards', content: <FlashcardManager documentId={id} /> },
        { name: 'Quizzes', label: 'Quizzes', content: <QuizManager documentId={id} /> }
    ]

    if (isLoading) return <Spinner />
    if (!data?.data) return <div className="text-center p-8">Document not found.</div>

    return (
        <div className="space-y-4">
            <Link
                href={"/documents"}
                className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
            >
                <ArrowLeft size={16} />
                Back to Documents
            </Link>

            <PageHeader title={data?.data.title} />

            <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    )
}

import Button from '@/components/common/Button'
import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-8 text-center">
                    <div className="flex justify-center mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <FileQuestion size={28} />
                        </div>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                        Page not found
                    </h1>
                    <p className="text-sm text-slate-600 mb-7">
                        Sorry, the page you are looking for doesn’t exist or has been moved.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <Link href="/">
                            <Button variant="primary" size="md">
                                Back home
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}

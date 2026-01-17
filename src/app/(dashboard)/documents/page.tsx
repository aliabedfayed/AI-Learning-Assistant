"use client"
import { Document, Documents } from '@/interfaces/documents/document';
import { deleteDocument, getDocuments, uploadDocument } from '@/services/documentService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from "yup"
import toast from 'react-hot-toast';
import { FileText, Plus, Trash2, Upload, X } from 'lucide-react';
import Spinner from '@/components/common/Spinner';
import DocumentCard from '@/components/documents/DocumentCard';
import Button from '@/components/common/Button';

export default function DocumentList() {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

    const { data, isLoading, refetch } = useQuery<Documents>({
        queryKey: ["documents"],
        queryFn: getDocuments
    })

    const uploadMutation = useMutation({
        mutationFn: uploadDocument,
        onSuccess: () => {
            toast.success("Document uploaded successfully!")
            setIsUploadModalOpen(false)
            formik.resetForm()
            refetch()
        },
        onError: (err) => {
            toast.error(err.message || "Upload failed.")
        }
    })

    const deleteMutation = useMutation({
        mutationFn: deleteDocument,
        onSuccess: () => {
            toast.success(`'${selectedDoc?.title}' deleted.`)
            setIsDeleteModalOpen(false)
            setSelectedDoc(null)
            refetch()
        },
        onError: (err) => {
            toast.error(err.message || "Failed to delete document.")
        }
    })

    const uploadSchema = Yup.object({
        title: Yup.string().required("Document title is required"),
        file: Yup.mixed<File>()
            .required("PDF file is required")
            .test(
                "fileType", "Only PDF files are allowed", (value?: File) =>
                value ? value.type === "application/pdf" : false
            )
            .test("fileSize", "File is too large", (value?: File) =>
                value ? value.size <= 10 * 1024 * 1024 : true
            )
    })

    const formik = useFormik({
        initialValues: {
            title: "",
            file: null as File | null
        },
        validationSchema: uploadSchema,
        onSubmit: (values) => {
            const formData = new FormData()
            formData.append("title", values.title)
            formData.append("file", values.file as File)
            uploadMutation.mutate(formData)
        }
    })

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-100">
                    <Spinner />
                </div>
            )
        }

        if (data?.data.length === 0) {
            return (
                <div className="flex items-center justify-center min-h-100">
                    <div className="text-center max-w-md">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-6">
                            <FileText
                                className="w-10 h-10 text-slate-400"
                                strokeWidth={1.5}
                            />
                        </div>
                        <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">
                            No Documents Yet
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            Get started by uploading your first PDF document to begin
                            learning.
                        </p>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Upload Document
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {data?.data.map((doc) => (
                    <DocumentCard
                        key={doc._id}
                        document={doc}
                        onDelete={() => {
                            setSelectedDoc(doc)
                            setIsDeleteModalOpen(true)
                        }}
                    />
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none" />

                <div className="relative max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-2xl font-medium text-slate-900 tracking-tight mb-2">
                                My Documents
                            </h1>
                            <p className="text-slate-500 text-sm">
                                Manage and organize your learning materials
                            </p>
                        </div>
                        {!!data?.data.length && (
                            <Button onClick={() => setIsUploadModalOpen(true)}>
                                <Plus className="w-4 h-4" strokeWidth={2.5} />
                                Upload Document
                            </Button>
                        )}
                    </div>
                    {renderContent()}
                </div>

                {isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8">
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                            >
                                <X className="w-5 h-5" strokeWidth={2} />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                                    Upload New Document
                                </h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    Add a PDF document to your library
                                </p>
                            </div>

                            <form onSubmit={formik.handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor='title' className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                        Document Title
                                    </label>
                                    <input
                                        name="title"
                                        id='title'
                                        type="text"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
                                        placeholder="e.g., React Interview Prep"
                                    />
                                    {formik.touched.title && formik.errors.title && (
                                        <p className="text-xs text-red-500">
                                            {formik.errors.title}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor='file' className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                                        PDF File
                                    </label>
                                    <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-200">
                                        <input
                                            id="file"
                                            type="file"
                                            accept=".pdf"
                                            onChange={(e) =>
                                                formik.setFieldValue("file", e.currentTarget.files?.[0])
                                            }
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="flex flex-col items-center justify-center py-10 px-6">
                                            <div className="w-14 h-14 rounded-xl bg-linear-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-4">
                                                <Upload
                                                    className="w-7 h-7 text-emerald-600"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700 mb-1">
                                                {formik.values.file ? (
                                                    <span className="text-emerald-600">
                                                        {formik.values.file.name}
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="text-emerald-600">
                                                            Click to upload
                                                        </span>{" "}
                                                        or drag and drop
                                                    </>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500">PDF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                {formik.touched.file && formik.errors.file && (
                                    <p className="text-xs text-red-500">
                                        {formik.errors.file}
                                    </p>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadModalOpen(false)}
                                        disabled={uploadMutation.isPending}
                                        className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploadMutation.isPending}
                                        className="flex-1 h-11 px-4 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                    >
                                        {uploadMutation.isPending ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Uploading...
                                            </span>
                                        ) : (
                                            "Upload"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <div className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-900/20 p-8">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
                            >
                                <X className="w-5 h-5" strokeWidth={2} />
                            </button>

                            <div className="mb-6">
                                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-red-100 to-red-200 flex items-center justify-center mb-4">
                                    <Trash2 className="w-6 h-6 text-red-600" strokeWidth={2} />
                                </div>
                                <h2 className="text-xl font-medium text-slate-900 tracking-tight">
                                    Confirm Deletion
                                </h2>
                            </div>

                            <p className="text-sm text-slate-600 mb-6">
                                Are you sure you want to delete the document:{" "}
                                <span className="font-semibold text-slate-900">
                                    {selectedDoc?.title}
                                </span>
                                ? This action cannot be undone.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (!selectedDoc) return
                                        deleteMutation.mutate(selectedDoc._id)
                                    }}
                                    disabled={deleteMutation.isPending}
                                    className="flex-1 h-11 px-4 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                                >
                                    {deleteMutation.isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Deleting...
                                        </span>
                                    ) : (
                                        "Delete"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import Modal from "../common/Modal";
import { generateSummary, explainConcept, } from "../../services/aiService";
import { Summary } from "@/interfaces/ai/summary";
import { Concept } from "@/interfaces/ai/explainConcept";

interface ModalState {
    open: boolean
    title: string
    content: string
}

export default function AIActions() {
    const { id } = useParams<{ id: string }>()
    const [modal, setModal] = useState<ModalState>({ open: false, title: "", content: "" })

    const summaryMutation = useMutation({
        mutationFn: () => generateSummary(id),
        onSuccess: (res: Summary) => {
            setModal({
                open: true,
                title: "Generated Summary",
                content: res?.data?.summary || "No summary generated."
            })
        },
        onError: () => {
            toast.error("Failed to generate summary.")
        }
    })

    const explainMutation = useMutation({
        mutationFn: (concept: string) => explainConcept(id, concept),
        onSuccess: (res: Concept, concept) => {
            setModal({
                open: true,
                title: `Explanation of "${concept}"`,
                content: res?.data?.explanation || "No explanation generated."
            })
        },
        onError: () => {
            toast.error("Failed to explain concept.")
        }
    })

    const formik = useFormik({
        initialValues: {
            concept: "",
        },
        validationSchema: Yup.object({
            concept: Yup.string().trim().required("Please enter a concept to explain")
        }),
        onSubmit: (values, { resetForm }) => {
            explainMutation.mutate(values.concept)
            resetForm()
        }
    })

    return (
        <>
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 to-white/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-purple-500/25 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                                AI Assistant
                            </h3>
                            <p className="text-xs text-slate-500">Powered by advanced AI</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                                        <BookOpen
                                            className="w-4 h-4 text-blue-600"
                                            strokeWidth={2}
                                        />
                                    </div>
                                    <h4 className="font-semibold text-slate-900">
                                        Generate Summary
                                    </h4>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    Get a concise summary of the entire document.
                                </p>
                            </div>
                            <button
                                onClick={() => summaryMutation.mutate()}
                                disabled={summaryMutation.isPending}
                                className="shrink-0 h-10 px-5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            >
                                {summaryMutation.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Loading...
                                    </span>
                                ) : (
                                    "Summarize"
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="group p-5 bg-linear-to-br from-slate-50/50 to-white rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-md transition-all duration-200">
                        <form onSubmit={formik.handleSubmit}>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                                    <Lightbulb
                                        className="w-4 h-4 text-amber-600"
                                        strokeWidth={2}
                                    />
                                </div>
                                <h4 className="font-semibold text-slate-900">
                                    Explain a Concept
                                </h4>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Enter a topic or concept from the document to get a detailed explanation.
                            </p>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    name="concept"
                                    value={formik.values.concept}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g., 'React Hooks'"
                                    className="flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-purple-500/10"
                                    disabled={explainMutation.isPending}
                                />
                                <button
                                    type="submit"
                                    disabled={explainMutation.isPending || !formik.isValid}
                                    className="shrink-0 h-11 px-5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-600 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    {explainMutation.isPending ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Loading...
                                        </span>
                                    ) : (
                                        "Explain"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>

            <Modal
                isOpen={modal.open}
                onClose={() => setModal((prev) => ({ ...prev, open: false }))}
                title={modal.title}
            >
                <div className="max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate">
                    {modal.content}
                </div>
            </Modal>
        </>
    );
};

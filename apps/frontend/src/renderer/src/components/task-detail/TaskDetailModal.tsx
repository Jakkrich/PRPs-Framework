import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { useTaskDetail } from '../../hooks/useTaskDetail';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2, FileText, CheckCircle2, ListTodo, FileCode2 } from 'lucide-react';
import { cn, formatRelativeTime } from '../../lib/utils';

interface TaskDetailModalProps {
    taskId: string;
    onClose: () => void;
}

export function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
    const { detail, loading, error } = useTaskDetail(taskId);

    if (!taskId) return null;

    return (
        <Dialog open={!!taskId} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden sm:rounded-xl border-border bg-card">

                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
                        <p className="text-destructive">Error loading task details</p>
                        <p className="text-sm text-muted-foreground">{error}</p>
                    </div>
                ) : detail ? (
                    <>
                        {/* Header */}
                        <div className="flex flex-col gap-4 p-6 pb-2 border-b bg-muted/20">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono text-xs">{detail.id}</Badge>
                                        <Badge variant={
                                            detail.status === 'done' ? 'success' :
                                                detail.status === 'in_progress' ? 'warning' :
                                                    detail.status === 'planning' ? 'info' :
                                                        'secondary'
                                        }>{detail.status}</Badge>
                                    </div>
                                    <DialogTitle className="text-xl font-bold leading-tight">{detail.title}</DialogTitle>
                                </div>
                                <div className="text-right text-xs text-muted-foreground space-y-1">
                                    <div>Created {formatRelativeTime(detail.created_at || '')}</div>
                                    <div>Updated {formatRelativeTime(detail.updated_at || '')}</div>
                                </div>
                            </div>
                            <DialogDescription className="line-clamp-2">
                                {detail.description}
                            </DialogDescription>
                        </div>

                        {/* Content Tabs */}
                        <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden">
                            <div className="px-6 pt-2 border-b bg-muted/10">
                                <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
                                    <TabsTrigger value="overview" className="text-xs py-2 gap-2">
                                        <ListTodo className="h-3.5 w-3.5" /> Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="spec" className="text-xs py-2 gap-2">
                                        <FileText className="h-3.5 w-3.5" /> Spec
                                    </TabsTrigger>
                                    <TabsTrigger value="plan" className="text-xs py-2 gap-2">
                                        <ListTodo className="h-3.5 w-3.5" /> Phases ({detail.phases_completed}/{detail.phases_total})
                                    </TabsTrigger>
                                    <TabsTrigger value="qa" className="text-xs py-2 gap-2">
                                        <CheckCircle2 className="h-3.5 w-3.5" /> QA Report
                                    </TabsTrigger>
                                    <TabsTrigger value="files" className="text-xs py-2 gap-2">
                                        <FileCode2 className="h-3.5 w-3.5" /> Files
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-hidden bg-background">
                                {/* Overview Tab */}
                                <TabsContent value="overview" className="h-full m-0 data-[state=active]:flex flex-col">
                                    <ScrollArea className="flex-1 p-6">
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <h3>Description</h3>
                                            <p>{detail.description}</p>

                                            <h3>Metadata</h3>
                                            <div className="grid grid-cols-2 gap-4 text-sm not-prose">
                                                <div className="flex justify-between border-b py-2">
                                                    <span className="text-muted-foreground">Category</span>
                                                    <span>{detail.category}</span>
                                                </div>
                                                <div className="flex justify-between border-b py-2">
                                                    <span className="text-muted-foreground">Priority</span>
                                                    <span>{detail.priority}</span>
                                                </div>
                                                <div className="flex justify-between border-b py-2">
                                                    <span className="text-muted-foreground">Complexity</span>
                                                    <span>{detail.complexity}</span>
                                                </div>
                                                <div className="flex justify-between border-b py-2">
                                                    <span className="text-muted-foreground">Impact</span>
                                                    <span>{detail.impact}</span>
                                                </div>
                                            </div>

                                            <h3 className="mt-6">Progress</h3>
                                            <div className="not-prose space-y-4">
                                                {detail.phases.map((phase, idx) => (
                                                    <div key={idx} className="border rounded-md p-3 bg-card/50">
                                                        <div className="font-medium text-sm mb-2">{phase.name}</div>
                                                        <div className="space-y-1">
                                                            {phase.subtasks.map((sub, sIdx) => (
                                                                <div key={sIdx} className="flex items-start gap-2 text-xs">
                                                                    <div className={cn("mt-0.5",
                                                                        sub.status === 'completed' || sub.status === 'done' || sub.status === '✅' ? "text-success" : "text-muted-foreground"
                                                                    )}>
                                                                        {sub.status === 'completed' || sub.status === 'done' || sub.status === '✅' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <div className="h-3.5 w-3.5 rounded-full border border-current" />}
                                                                    </div>
                                                                    <span className={cn(
                                                                        sub.status === 'completed' || sub.status === 'done' || sub.status === '✅' ? "text-muted-foreground line-through" : "text-foreground"
                                                                    )}>{sub.description}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                {/* Spec Tab */}
                                <TabsContent value="spec" className="h-full m-0">
                                    <ScrollArea className="h-full p-6">
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {detail.spec_content || '*No spec content available*'}
                                            </ReactMarkdown>
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                {/* Plan Tab */}
                                <TabsContent value="plan" className="h-full m-0">
                                    <ScrollArea className="h-full p-6">
                                        <div className="space-y-6">
                                            {detail.phases.map((phase, idx) => (
                                                <div key={idx} className="space-y-2">
                                                    <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur py-2 z-10 border-b">
                                                        <h3 className="font-semibold text-sm">
                                                            {phase.name.startsWith('Phase') ? phase.name : `Phase ${idx + 1}: ${phase.name}`}
                                                        </h3>
                                                    </div>
                                                    <div className="space-y-2 pl-2">
                                                        {phase.subtasks.map((sub, sIdx) => (
                                                            <div key={sIdx} className="flex gap-3 text-sm p-2 rounded-md hover:bg-muted/50 transition-colors">
                                                                <div className={cn("mt-0.5 shrink-0",
                                                                    sub.status === 'completed' || sub.status === 'done' || sub.status === '✅' ? "text-success" : "text-muted-foreground"
                                                                )}>
                                                                    {sub.status === 'completed' || sub.status === 'done' || sub.status === '✅' ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4 rounded-full border border-current" />}
                                                                </div>
                                                                <div>
                                                                    <p className={cn(sub.status === 'completed' || sub.status === 'done' || sub.status === '✅' ? "text-muted-foreground" : "")}>
                                                                        {sub.description}
                                                                    </p>
                                                                    {sub.files && sub.files.length > 0 && (
                                                                        <div className="mt-1 flex flex-wrap gap-1">
                                                                            {sub.files.map((f, fIdx) => (
                                                                                <span key={fIdx} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                                                                                    {f}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                {/* QA Tab */}
                                <TabsContent value="qa" className="h-full m-0">
                                    <ScrollArea className="h-full p-6">
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {detail.qa_report_content || '*No QA report available*'}
                                            </ReactMarkdown>
                                        </div>
                                    </ScrollArea>
                                </TabsContent>

                                {/* Files Tab */}
                                <TabsContent value="files" className="h-full m-0">
                                    <ScrollArea className="h-full p-6">
                                        <div className="space-y-1">
                                            {detail.files_involved && detail.files_involved.length > 0 ? (
                                                [...new Set(detail.files_involved.map(f => f.path))].sort().map((path, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-sm p-2 rounded hover:bg-muted/50 font-mono text-xs">
                                                        <FileCode2 className="h-4 w-4 text-muted-foreground" />
                                                        <span>{path}</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted-foreground text-sm italic">No files recorded.</p>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </>
                ) : null}
            </DialogContent>
        </Dialog>
    );
}

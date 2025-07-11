import { useState, useEffect } from 'react'
import { supabase, type Generation } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function GenerationHistory() {
  const { user } = useAuth()
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchGenerations()
    } else {
      setGenerations([])
      setLoading(false)
    }
  }, [user])

  const fetchGenerations = async () => {
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setGenerations(data || [])
    } catch (error: any) {
      toast.error('Failed to load generation history')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (generation: Generation) => {
    if (generation.generated_image_url) {
      const link = document.createElement('a')
      link.href = generation.generated_image_url
      link.download = `generated-${generation.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Image downloaded!')
    }
  }

  const handleDelete = async (generationId: string) => {
    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', generationId)

      if (error) throw error

      setGenerations(prev => prev.filter(g => g.id !== generationId))
      toast.success('Generation deleted')
    } catch (error: any) {
      toast.error('Failed to delete generation')
      console.error(error)
    }
  }

  const getStatusIcon = (status: Generation['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  if (!user) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/30">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Sign in to view your generation history
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/30">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Generation History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {generations.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No generations yet. Create your first AI transformation!
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {generations.map((generation) => (
              <div
                key={generation.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-background/50 border border-border/30"
              >
                <div className="flex-shrink-0">
                  {generation.generated_image_url ? (
                    <img
                      src={generation.generated_image_url}
                      alt="Generated result"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                      {getStatusIcon(generation.status)}
                    </div>
                  )}
                </div>
                
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {generation.prompt}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusIcon(generation.status)}
                    <span className={cn(
                      "text-xs capitalize",
                      generation.status === 'completed' && "text-green-500",
                      generation.status === 'failed' && "text-red-500",
                      generation.status === 'pending' && "text-yellow-500"
                    )}>
                      {generation.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(generation.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {generation.generated_image_url && (
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => handleDownload(generation)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(generation.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
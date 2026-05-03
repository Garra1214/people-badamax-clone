'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { AudioAnalysis } from '@/lib/types'

type RecordingState = 'idle' | 'recording' | 'processing' | 'confirming' | 'saving'

interface Props {
  subsystemId: string
  subsystemName: string
  onClose: () => void
}

export default function AudioRecorder({ subsystemId, subsystemName, onClose }: Props) {
  const [state, setState] = useState<RecordingState>('idle')
  const [seconds, setSeconds] = useState(0)
  const [analysis, setAnalysis] = useState<AudioAnalysis | null>(null)
  const [error, setError] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const startRecording = useCallback(async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg'
      const recorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.start(250)
      setState('recording')
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch {
      setError('No se pudo acceder al micrófono. Verifica los permisos del navegador.')
    }
  }, [])

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current
    if (!recorder) return

    setState('processing')
    if (timerRef.current) clearInterval(timerRef.current)
    recorder.stream.getTracks().forEach((t) => t.stop())

    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve()
      recorder.stop()
    })

    const audioBlob = new Blob(chunksRef.current, {
      type: chunksRef.current[0]?.type ?? 'audio/webm',
    })

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('subsystem_id', subsystemId)

      const res = await fetch('/api/audio', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error ?? 'Error al procesar el audio')

      setAnalysis(data as AudioAnalysis)
      setState('confirming')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      setState('idle')
    }
  }, [subsystemId])

  async function handleConfirm() {
    if (!analysis) return
    setState('saving')

    const { error: dbError } = await supabase.from('updates').insert({
      subsystem_id: subsystemId,
      type: analysis.type,
      title: analysis.title,
      description: analysis.description,
      impact: analysis.impact,
      priority: analysis.priority,
    })

    if (dbError) {
      setError('Error al guardar. Verifica tus permisos.')
      setState('confirming')
    } else {
      router.refresh()
      onClose()
    }
  }

  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const TYPE_LABEL: Record<string, string> = { problema: 'Problema', avance: 'Avance', riesgo: 'Riesgo' }
  const TYPE_COLOR: Record<string, string> = {
    problema: 'bg-red-100 text-red-700',
    avance: 'bg-green-100 text-green-700',
    riesgo: 'bg-yellow-100 text-yellow-700',
  }
  const PRIORITY_COLOR: Record<string, string> = {
    alta: 'bg-red-100 text-red-700',
    media: 'bg-yellow-100 text-yellow-700',
    baja: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Grabar actualización</h2>
            <p className="text-sm text-gray-500 mt-0.5">{subsystemName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* IDLE */}
          {state === 'idle' && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎤</span>
              </div>
              <p className="text-gray-600 text-sm mb-2 font-medium">
                Habla libremente sobre el estado del subsistema.
              </p>
              <p className="text-gray-400 text-xs mb-6">
                La IA transcribirá y estructurará el contenido automáticamente.
              </p>
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">
                  {error}
                </div>
              )}
              <button onClick={startRecording} className="btn-primary px-8 py-3 text-base">
                Iniciar grabación
              </button>
            </div>
          )}

          {/* RECORDING */}
          {state === 'recording' && (
            <div className="text-center py-4">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 bg-red-200 rounded-full animate-ping opacity-75" />
                <div className="relative w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🎤</span>
                </div>
              </div>
              <div className="text-4xl font-mono font-bold text-gray-900 mb-1">{fmt(seconds)}</div>
              <p className="text-gray-400 text-sm mb-6">Grabando...</p>
              <button onClick={stopRecording} className="btn-danger px-8 py-3 text-base">
                ⏹ Detener
              </button>
            </div>
          )}

          {/* PROCESSING */}
          {state === 'processing' && (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Procesando con IA...</p>
              <p className="text-gray-400 text-sm mt-1">Whisper + GPT-4o mini</p>
            </div>
          )}

          {/* CONFIRMING */}
          {state === 'confirming' && analysis && (
            <div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-4 border border-blue-100">
                <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider mb-3">
                  Análisis IA — confirma antes de guardar
                </p>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${TYPE_COLOR[analysis.type] ?? ''}`}>
                    {TYPE_LABEL[analysis.type] ?? analysis.type}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${PRIORITY_COLOR[analysis.priority] ?? ''}`}>
                    Prioridad {analysis.priority}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{analysis.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">{analysis.description}</p>
                {analysis.impact && (
                  <div className="border-t border-blue-100 pt-3">
                    <span className="text-xs font-semibold text-gray-500">Impacto: </span>
                    <span className="text-xs text-gray-600">{analysis.impact}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg mb-4 border border-red-100">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setState('idle')} className="btn-secondary flex-1">
                  Volver a grabar
                </button>
                <button onClick={handleConfirm} className="btn-primary flex-1">
                  Confirmar y guardar
                </button>
              </div>
            </div>
          )}

          {/* SAVING */}
          {state === 'saving' && (
            <div className="text-center py-10">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Guardando actualización...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'
import type { AudioAnalysis } from '@/lib/types'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Sin permisos de edición' }, { status: 403 })
  }

  const formData = await request.formData()
  const audioFile = formData.get('audio') as File | null

  if (!audioFile || audioFile.size === 0) {
    return NextResponse.json({ error: 'No se recibió archivo de audio' }, { status: 400 })
  }

  try {
    // Step 1: Transcribe with Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'es',
    })

    const text = transcription.text?.trim()

    if (!text) {
      return NextResponse.json({ error: 'No se detectó audio con contenido claro' }, { status: 400 })
    }

    // Step 2: Structure with GPT-4o mini
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 600,
      messages: [
        {
          role: 'system',
          content: `Eres un analista de RRHH para una empresa de retail chilena.
Recibes una transcripción de voz con una actualización sobre un subsistema de gestión de personas.
Debes estructurarla y devolver ÚNICAMENTE un objeto JSON válido, sin texto adicional ni markdown.

Estructura exacta requerida:
{
  "type": "problema | avance | riesgo",
  "title": "título conciso de máximo 70 caracteres",
  "description": "descripción detallada y clara del contenido",
  "impact": "impacto concreto en personas u operación (puede quedar vacío si no se menciona)",
  "priority": "alta | media | baja"
}

Criterios de clasificación:
- type "problema": algo que está fallando, pendiente o mal
- type "avance": logro, mejora, progreso positivo o tarea completada
- type "riesgo": situación que podría convertirse en problema
- priority "alta": requiere acción inmediata (hoy/mañana)
- priority "media": requiere atención esta semana
- priority "baja": informativo, sin urgencia`,
        },
        {
          role: 'user',
          content: `Transcripción de voz: "${text}"`,
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    const match = raw.match(/\{[\s\S]*\}/)

    if (!match) {
      throw new Error('La IA no devolvió JSON válido')
    }

    const analysis = JSON.parse(match[0]) as Partial<AudioAnalysis>

    // Normalize and validate
    const validTypes = ['problema', 'avance', 'riesgo'] as const
    const validPriorities = ['alta', 'media', 'baja'] as const

    const result: AudioAnalysis = {
      type:        validTypes.includes(analysis.type as typeof validTypes[number])        ? analysis.type! : 'avance',
      title:       analysis.title?.slice(0, 100)  || 'Sin título',
      description: analysis.description           || text,
      impact:      analysis.impact                || '',
      priority:    validPriorities.includes(analysis.priority as typeof validPriorities[number]) ? analysis.priority! : 'media',
    }

    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/audio] Error:', err)
    return NextResponse.json(
      { error: 'Error al procesar el audio. Verifica la API key de OpenAI.' },
      { status: 500 }
    )
  }
}

'use client'

import { useState } from 'react'
import AudioRecorder from './AudioRecorder'

interface Props {
  subsystemId: string
  subsystemName: string
}

export default function SubsystemAudioButton({ subsystemId, subsystemName }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-secondary">
        🎤 Grabar actualización
      </button>
      {open && (
        <AudioRecorder
          subsystemId={subsystemId}
          subsystemName={subsystemName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

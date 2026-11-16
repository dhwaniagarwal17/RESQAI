import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Radio, AlertTriangle, CheckCircle, Loader } from 'lucide-react'
import { createIncident } from '../../services/incidentService'
import { useAuth } from '../../context/AuthContext'

const STEP = { CONFIRM: 'confirm', DETAILS: 'details', SENDING: 'sending', DONE: 'done' }

export default function SOSPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [step, setStep] = useState(STEP.CONFIRM)
  const [location, setLocation] = useState('')
  const [details, setDetails] = useState('')
  const [error, setError] = useState(null)
  const [incidentId, setIncidentId] = useState(null)

  async function handleSend() {
    setStep(STEP.SENDING)
    setError(null)

    const message = `SOS — IMMEDIATE DANGER. ${details || 'Emergency assistance required urgently.'} Location: ${location || 'Unknown'}.`

    try {
      let incident

      if (isAuthenticated) {
        incident = await createIncident({
          message,
          location: { address: location },
        })
      } else {
        const { addIncident } = await import('../../data/store')
        incident = addIncident({
          description: 'SOS — Immediate danger',
          fullDescription: message,
          category: 'Rescue Request',
          reporterUrgency: 'critical',
          verifiedSeverity: 'critical',
          locationText: location || 'Unknown',
          coords: null,
          peopleAffected: 1,
          source: 'citizen',
          classification: null,
          assignedTeamId: null,
        })
      }

      setIncidentId(incident._id || incident.id)
      setStep(STEP.DONE)
    } catch (err) {
      setError(err.message || 'SOS submission failed.')
      setStep(STEP.DETAILS)
    }
  }

  // ── Done ─────────────────────────────────────────────────────────────────────
  if (step === STEP.DONE) {
    return (
      <div className="max-w-sm mx-auto px-6 py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-sage" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-bold text-carbon mb-2">SOS Registered</h1>
        <p className="text-sm text-carbon/60 mb-5 leading-relaxed">
          Your SOS has been recorded.{' '}
          {isAuthenticated
            ? 'The operations centre has been notified and will assign a team.'
            : 'This is a local simulation only — no real emergency services contacted.'}
        </p>
        {incidentId && (
          <p className="font-mono text-xs text-carbon/40 mb-6">Reference: {incidentId}</p>
        )}
        <div className="bg-amber/8 border border-amber/20 rounded p-3 text-xs text-amber mb-6">
          ⚠ For immediate life-threatening emergencies, always call <strong>112</strong>.
        </div>
        <button
          onClick={() => navigate('/reporter')}
          className="w-full bg-carbon text-white text-sm font-medium py-2.5 rounded hover:bg-carbon/90 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }

  // ── Sending ───────────────────────────────────────────────────────────────────
  if (step === STEP.SENDING) {
    return (
      <div className="max-w-sm mx-auto px-6 py-16 text-center">
        <Loader size={32} className="text-coral animate-spin mx-auto mb-4" strokeWidth={1.5} />
        <p className="text-sm font-medium text-carbon">Transmitting SOS…</p>
        <p className="text-xs text-carbon/40 mt-1">
          {isAuthenticated ? 'Contacting operations centre' : 'Demo only — no real service contacted'}
        </p>
      </div>
    )
  }

  // ── Confirmation step ─────────────────────────────────────────────────────────
  if (step === STEP.CONFIRM) {
    return (
      <div className="max-w-sm mx-auto px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-carbon/50 hover:text-carbon transition-colors mb-6"
        >
          <ArrowLeft size={12} /> Back
        </button>

        <div className="border border-coral/20 rounded bg-white p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-coral/10 flex items-center justify-center mb-3">
              <Radio size={28} className="text-coral" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-bold text-carbon">SOS Signal</h1>
            <p className="text-xs text-carbon/50 mt-1 leading-relaxed max-w-xs">
              Use only when someone faces immediate life-threatening danger. This will alert the operations centre as a critical emergency.
            </p>
          </div>

          <div className="bg-amber/8 border border-amber/20 rounded p-3 text-xs text-amber mb-5 leading-relaxed">
            <AlertTriangle size={12} className="inline mr-1 mb-0.5" />
            For real emergencies, also call <strong>112</strong>. This system{' '}
            {isAuthenticated ? 'will notify' : 'is a simulation and will NOT notify'} emergency services.
          </div>

          <button
            onClick={() => setStep(STEP.DETAILS)}
            className="w-full bg-coral text-white text-sm font-semibold py-3 rounded hover:bg-coral/90 transition-colors mb-3"
          >
            I confirm — Proceed to SOS
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full border border-carbon/20 text-carbon text-sm font-medium py-2.5 rounded hover:bg-carbon/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // ── Details step ──────────────────────────────────────────────────────────────
  return (
    <div className="max-w-sm mx-auto px-6 py-8">
      <button
        onClick={() => setStep(STEP.CONFIRM)}
        className="flex items-center gap-1.5 text-xs text-carbon/50 hover:text-carbon transition-colors mb-6"
      >
        <ArrowLeft size={12} /> Back
      </button>

      <div className="border border-coral/20 rounded bg-white p-6">
        <h1 className="text-lg font-bold text-carbon mb-1">SOS Details</h1>
        <p className="text-xs text-carbon/50 mb-5">Add a few details to help responders reach you faster.</p>

        {error && (
          <div className="bg-coral/8 border border-coral/20 rounded p-3 text-xs text-coral mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-carbon/70 mb-1">Your location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Street, landmark, area…"
              className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/15 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-carbon/70 mb-1">Brief description (optional)</label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. 3 people trapped, building fire, medical emergency…"
              className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 resize-none focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/15 transition-colors"
            />
          </div>
        </div>

        <button
          onClick={handleSend}
          className="mt-5 w-full bg-coral text-white text-sm font-bold py-3.5 rounded flex items-center justify-center gap-2 hover:bg-coral/90 transition-colors"
        >
          <Radio size={15} strokeWidth={2} />
          Send SOS Now
        </button>

        <p className="text-2xs text-carbon/30 text-center mt-2">
          {isAuthenticated ? 'This will alert the operations centre.' : 'Demo — no real signal sent.'}
        </p>
      </div>
    </div>
  )
}

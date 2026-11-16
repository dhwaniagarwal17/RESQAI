import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertCircle, CheckCircle, FileText, Loader } from 'lucide-react'
import { createIncident } from '../../services/incidentService'
import { useAuth } from '../../context/AuthContext'

const CATEGORIES = [
  'Injured or People in Danger',
  'Rescue Request',
  'Missing / Found',
  'Infrastructure',
  'Displaced / Evacuation',
  'Caution & Advice',
  'Volunteering',
  'Other',
]

const URGENCY_OPTIONS = [
  { value: 'critical', label: 'Critical — Immediate threat to life' },
  { value: 'high',     label: 'High — Serious risk, urgent response needed' },
  { value: 'medium',   label: 'Medium — Significant but not immediately life-threatening' },
  { value: 'low',      label: 'Low — Informational or non-urgent' },
]

const INITIAL = {
  description: '',
  category: '',
  urgency: '',
  locationText: '',
  peopleAffected: '',
  contactName: '',
  contactPhone: '',
}

export default function ReportForm() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const [form, setForm]       = useState(INITIAL)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [submitted, setSubmitted] = useState(null) // { id, createdAt, category }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.description.trim() || form.description.trim().length < 10)
      e.description = 'Please describe the situation (at least 10 characters).'
    if (!form.category)
      e.category = 'Please select a category.'
    if (!form.urgency)
      e.urgency = 'Please indicate how urgent this is.'
    if (!form.locationText.trim())
      e.locationText = 'Please provide a location or address.'
    if (form.peopleAffected !== '' && (isNaN(Number(form.peopleAffected)) || Number(form.peopleAffected) < 0))
      e.peopleAffected = 'Must be a number 0 or greater.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setApiError(null)

    // Build the message string the backend/ML expects
    const message = [
      form.description.trim(),
      form.category ? `Category: ${form.category}` : '',
      form.locationText.trim() ? `Location: ${form.locationText.trim()}` : '',
      form.peopleAffected ? `People affected: ${form.peopleAffected}` : '',
    ].filter(Boolean).join('. ')

    const payload = {
      message,
      location: {
        address: form.locationText.trim(),
      },
      // Extra fields stored for display purposes (not in backend schema yet, so stored separately)
      _meta: {
        reporterUrgency: form.urgency,
        category: form.category,
        locationText: form.locationText.trim(),
        peopleAffected: form.peopleAffected ? Number(form.peopleAffected) : 0,
        contactName: form.contactName.trim(),
        contactPhone: form.contactPhone.trim(),
      },
    }

    try {
      let incident

      if (isAuthenticated) {
        // Real backend submission
        incident = await createIncident(payload)
      } else {
        // Offline / demo mode — write to localStorage only
        const { addIncident } = await import('../../data/store')
        incident = addIncident({
          description: form.description.trim(),
          fullDescription: message,
          category: form.category,
          reporterUrgency: form.urgency,
          verifiedSeverity: form.urgency,
          locationText: form.locationText.trim(),
          coords: null,
          peopleAffected: form.peopleAffected ? Number(form.peopleAffected) : 0,
          source: 'citizen',
          classification: null,
          assignedTeamId: null,
          reporterName: form.contactName || 'Anonymous',
          reporterPhone: form.contactPhone || null,
        })
      }

      setSubmitted({
        id: incident._id || incident.id,
        category: incident.category || form.category,
        createdAt: incident.createdAt || new Date().toISOString(),
      })
      setForm(INITIAL)
    } catch (err) {
      setApiError(err.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Confirmation screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-sage/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={28} className="text-sage" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-bold text-carbon mb-2">Report Submitted</h1>
        <p className="text-sm text-carbon/60 mb-6">
          Your incident has been received and is being reviewed.
        </p>

        <div className="border border-carbon/10 rounded bg-white p-5 text-left mb-6 space-y-3">
          <div>
            <p className="text-2xs text-carbon/40 uppercase tracking-wider mb-0.5">Incident ID</p>
            <p className="text-sm font-mono font-semibold text-carbon">{submitted.id}</p>
          </div>
          <div>
            <p className="text-2xs text-carbon/40 uppercase tracking-wider mb-0.5">Category</p>
            <p className="text-sm font-medium text-carbon">{submitted.category}</p>
          </div>
          <div>
            <p className="text-2xs text-carbon/40 uppercase tracking-wider mb-0.5">Status</p>
            <p className="text-sm text-carbon">Submitted — awaiting review</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/reporter/reports')}
            className="flex-1 bg-carbon text-white text-sm font-medium py-2.5 rounded hover:bg-carbon/90 transition-colors"
          >
            View My Reports
          </button>
          <button
            onClick={() => setSubmitted(null)}
            className="flex-1 border border-carbon/20 text-carbon text-sm font-medium py-2.5 rounded hover:bg-carbon/5 transition-colors"
          >
            Submit Another
          </button>
        </div>

        <p className="text-2xs text-carbon/30 mt-4">
          Track this incident in My Reports. You will see status updates as responders are assigned.
        </p>
      </div>
    )
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-xs text-carbon/50 hover:text-carbon transition-colors mb-6"
      >
        <ArrowLeft size={12} /> Back
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded bg-carbon flex items-center justify-center flex-shrink-0">
          <FileText size={16} className="text-white" strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-carbon">Report an Emergency</h1>
          <p className="text-xs text-carbon/40">Your report will be classified by AI and reviewed immediately.</p>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="bg-amber/8 border border-amber/20 rounded px-4 py-3 mb-5 text-xs text-amber leading-relaxed">
          ⚠ You are not signed in. This report will be saved locally only and will not reach the operations centre.{' '}
          <button onClick={() => navigate('/login')} className="underline font-medium">Sign in</button> to submit a real report.
        </div>
      )}

      {apiError && (
        <div className="flex items-start gap-2 bg-coral/8 border border-coral/20 rounded p-3 mb-4">
          <AlertCircle size={14} className="text-coral mt-0.5 flex-shrink-0" />
          <p className="text-xs text-coral leading-relaxed">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="description">
            Describe the situation <span className="text-coral">*</span>
          </label>
          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Tell us what you see — what happened, where, and how many people are affected…"
            className={`w-full border rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 resize-none focus:outline-none focus:ring-1 transition-colors ${
              errors.description ? 'border-coral focus:border-coral focus:ring-coral/20' : 'border-carbon/20 focus:border-carbon/50 focus:ring-carbon/15'
            }`}
            disabled={loading}
          />
          {errors.description && <p className="text-2xs text-coral mt-1">{errors.description}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-carbon/70 mb-1.5" htmlFor="category">
            Category <span className="text-coral">*</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => update('category', cat)}
                className={`text-left px-3 py-2 rounded border text-xs font-medium transition-all ${
                  form.category === cat
                    ? 'border-carbon bg-carbon text-white'
                    : 'border-carbon/15 text-carbon/60 hover:border-carbon/35 hover:text-carbon'
                }`}
                disabled={loading}
              >
                {cat}
              </button>
            ))}
          </div>
          {errors.category && <p className="text-2xs text-coral mt-1">{errors.category}</p>}
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-xs font-medium text-carbon/70 mb-1.5">
            How urgent is this? <span className="text-coral">*</span>
          </label>
          <div className="space-y-1.5">
            {URGENCY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-3 py-2.5 rounded border cursor-pointer transition-all ${
                  form.urgency === opt.value
                    ? 'border-carbon bg-carbon/5'
                    : 'border-carbon/15 hover:border-carbon/30'
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={opt.value}
                  checked={form.urgency === opt.value}
                  onChange={() => update('urgency', opt.value)}
                  className="accent-carbon"
                  disabled={loading}
                />
                <span className="text-xs text-carbon">{opt.label}</span>
              </label>
            ))}
          </div>
          {errors.urgency && <p className="text-2xs text-coral mt-1">{errors.urgency}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="locationText">
            Location / Address <span className="text-coral">*</span>
          </label>
          <input
            id="locationText"
            type="text"
            value={form.locationText}
            onChange={(e) => update('locationText', e.target.value)}
            placeholder="Street, neighbourhood, landmark…"
            className={`w-full border rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:ring-1 transition-colors ${
              errors.locationText ? 'border-coral focus:border-coral focus:ring-coral/20' : 'border-carbon/20 focus:border-carbon/50 focus:ring-carbon/15'
            }`}
            disabled={loading}
          />
          {errors.locationText && <p className="text-2xs text-coral mt-1">{errors.locationText}</p>}
        </div>

        {/* People affected */}
        <div>
          <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="peopleAffected">
            Approximate number of people affected
          </label>
          <input
            id="peopleAffected"
            type="number"
            min="0"
            value={form.peopleAffected}
            onChange={(e) => update('peopleAffected', e.target.value)}
            placeholder="0"
            className={`w-32 border rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:ring-1 transition-colors ${
              errors.peopleAffected ? 'border-coral' : 'border-carbon/20 focus:border-carbon/50 focus:ring-carbon/15'
            }`}
            disabled={loading}
          />
          {errors.peopleAffected && <p className="text-2xs text-coral mt-1">{errors.peopleAffected}</p>}
        </div>

        {/* Optional contact */}
        <div className="border-t border-carbon/8 pt-4">
          <p className="text-xs font-medium text-carbon/50 mb-3">Contact details (optional)</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-carbon/60 mb-1" htmlFor="contactName">
                Your name
              </label>
              <input
                id="contactName"
                type="text"
                value={form.contactName}
                onChange={(e) => update('contactName', e.target.value)}
                placeholder="Name"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/15 transition-colors"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-carbon/60 mb-1" htmlFor="contactPhone">
                Phone number
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={form.contactPhone}
                onChange={(e) => update('contactPhone', e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/15 transition-colors"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-carbon text-white text-sm font-semibold py-3.5 rounded flex items-center justify-center gap-2 hover:bg-carbon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader size={15} className="animate-spin" />
                Submitting report…
              </>
            ) : (
              'Submit Emergency Report'
            )}
          </button>
          <p className="text-2xs text-carbon/30 text-center mt-2">
            {isAuthenticated
              ? 'Your report will be classified by AI and reviewed by an administrator.'
              : 'Sign in to submit a real report to the operations centre.'}
          </p>
        </div>
      </form>
    </div>
  )
}

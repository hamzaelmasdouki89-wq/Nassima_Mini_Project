import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { fetchStagiaireById, updateStagiaire } from '../services/api'

export default function UserEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    const run = async () => {
      setIsLoading(true)
      setErrors([])
      try {
        const res = await fetchStagiaireById(id)
        setForm(res?.data || null)
      } catch (e) {
        setErrors(['Failed to load user.'])
      } finally {
        setIsLoading(false)
      }
    }

    run()
  }, [id])

  const canSubmit = useMemo(() => {
    return !isSaving && Boolean(form)
  }, [isSaving, form])

  const setField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = []
    if (!String(form?.nom || '').trim()) nextErrors.push('nom is required.')
    if (!String(form?.prenom || '').trim()) nextErrors.push('prenom is required.')
    if (!String(form?.pseudo || '').trim()) nextErrors.push('pseudo is required.')
    if (!String(form?.email || '').trim()) nextErrors.push('email is required.')

    if (nextErrors.length) {
      setErrors(nextErrors)
      return
    }

    setIsSaving(true)
    setErrors([])

    try {
      await updateStagiaire(id, {
        nom: String(form.nom).trim(),
        prenom: String(form.prenom).trim(),
        pseudo: String(form.pseudo).trim(),
        email: String(form.email).trim(),
        age: Number(form.age),
        admin: Boolean(form.admin),
        couleur: String(form.couleur || '#ffffff'),
        Devise: String(form.Devise || '').trim(),
        Pays: String(form.Pays || '').trim(),
        avatar: String(form.avatar || '').trim(),
        photo: String(form.photo || '').trim(),
        MotDePasse: String(form.MotDePasse || ''),
      })

      navigate(`/users/${id}`, { replace: true })
    } catch (e) {
      setErrors(['Update failed.'])
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container py-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="px-card"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 mb-0">Edit User</h1>
          <Link className="btn btn-sm btn-outline-secondary" to={`/users/${id}`}>
            Cancel
          </Link>
        </div>

        {errors.length > 0 && (
          <ul className="text-danger">
            {errors.map((msg) => (
              <li key={msg}>{msg}</li>
            ))}
          </ul>
        )}

        {isLoading ? (
          <div className="text-secondary">Loading…</div>
        ) : !form ? (
          <div className="text-secondary">Not found.</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="prenom">
                  Prenom
                </label>
                <input
                  id="prenom"
                  className="form-control"
                  value={form.prenom || ''}
                  onChange={(e) => setField('prenom', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="nom">
                  Nom
                </label>
                <input
                  id="nom"
                  className="form-control"
                  value={form.nom || ''}
                  onChange={(e) => setField('nom', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  className="form-control"
                  value={form.age ?? ''}
                  onChange={(e) => setField('age', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="admin">
                  Role
                </label>
                <select
                  id="admin"
                  className="form-select"
                  value={String(Boolean(form.admin))}
                  onChange={(e) => setField('admin', e.target.value === 'true')}
                >
                  <option value="false">Visitor</option>
                  <option value="true">Admin</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label" htmlFor="couleur">
                  Preferred Color
                </label>
                <input
                  id="couleur"
                  type="color"
                  className="form-control form-control-color w-100"
                  value={form.couleur || '#ffffff'}
                  onChange={(e) => setField('couleur', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="pseudo">
                  Pseudo
                </label>
                <input
                  id="pseudo"
                  className="form-control"
                  value={form.pseudo || ''}
                  onChange={(e) => setField('pseudo', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={form.email || ''}
                  onChange={(e) => setField('email', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="devise">
                  Devise
                </label>
                <input
                  id="devise"
                  className="form-control"
                  value={form.Devise || ''}
                  onChange={(e) => setField('Devise', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="pays">
                  Pays
                </label>
                <input
                  id="pays"
                  className="form-control"
                  value={form.Pays || ''}
                  onChange={(e) => setField('Pays', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="avatar">
                  Avatar (URL)
                </label>
                <input
                  id="avatar"
                  className="form-control"
                  value={form.avatar || ''}
                  onChange={(e) => setField('avatar', e.target.value)}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label" htmlFor="photo">
                  Photo (URL)
                </label>
                <input
                  id="photo"
                  className="form-control"
                  value={form.photo || ''}
                  onChange={(e) => setField('photo', e.target.value)}
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100" disabled={!canSubmit}>
                  {isSaving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}

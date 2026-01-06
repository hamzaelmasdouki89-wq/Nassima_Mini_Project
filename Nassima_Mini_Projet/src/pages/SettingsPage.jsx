import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useT } from '../i18n/i18n'
import { selectUser, updateUserFields } from '../redux/authSlice'
import { selectLanguage, setLanguage } from '../redux/settingsSlice'
import { fetchStagiaireSettingsById, updateStagiaireSettings } from '../services/api'
import { passwordMatches, hashPassword, validateNewPassword } from '../utils/passwordUtils'

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

export default function SettingsPage() {
  const t = useT()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)

  const language = useSelector(selectLanguage)

  const [activeTab, setActiveTab] = useState('profile')

  const [profile, setProfile] = useState({
    nom: user.nom || '',
    prenom: user.prenom || '',
    email: user.email || '',
    Devise: user.Devise || '',
    Pays: user.Pays || '',
  })

  const [profileStatus, setProfileStatus] = useState({ loading: false, error: '', success: '' })

  const [pwdForm, setPwdForm] = useState({ current: '', next: '', confirm: '' })
  const [pwdStatus, setPwdStatus] = useState({ loading: false, error: '', success: '' })

  const [avatarFileError, setAvatarFileError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState(user.avatar || user.photo || '')
  const [avatarStatus, setAvatarStatus] = useState({ loading: false, error: '', success: '' })

  const [langStatus, setLangStatus] = useState({ loading: false, error: '', success: '' })

  useEffect(() => {
    setProfile({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      Devise: user.Devise || '',
      Pays: user.Pays || '',
    })
    setAvatarPreview(user.avatar || user.photo || '')
  }, [user])

  const handleProfileChange = (key, value) => {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  const canSaveProfile = useMemo(() => {
    return !profileStatus.loading && profile.nom.trim() && profile.prenom.trim() && profile.email.trim()
  }, [profileStatus.loading, profile])

  const saveProfile = async (e) => {
    e.preventDefault()
    setProfileStatus({ loading: true, error: '', success: '' })

    try {
      const payload = {
        nom: profile.nom.trim(),
        prenom: profile.prenom.trim(),
        email: profile.email.trim(),
        Devise: String(profile.Devise || '').trim(),
        Pays: String(profile.Pays || '').trim(),
      }

      await updateStagiaireSettings(user.id, payload)
      dispatch(updateUserFields(payload))
      setProfileStatus({ loading: false, error: '', success: 'Profile updated.' })
    } catch (err) {
      setProfileStatus({ loading: false, error: 'Failed to update profile.', success: '' })
    }
  }

  const handlePwdChange = (key, value) => {
    setPwdForm((p) => ({ ...p, [key]: value }))
  }

  const pwdValidationErrors = useMemo(() => {
    const errors = validateNewPassword(pwdForm.next)
    if (pwdForm.next && pwdForm.confirm && pwdForm.next !== pwdForm.confirm) {
      errors.push('Passwords do not match.')
    }
    return errors
  }, [pwdForm.next, pwdForm.confirm])

  const canSubmitPassword = useMemo(() => {
    return !pwdStatus.loading && pwdForm.current && pwdForm.next && pwdForm.confirm && pwdValidationErrors.length === 0
  }, [pwdStatus.loading, pwdForm, pwdValidationErrors.length])

  const submitPassword = async (e) => {
    e.preventDefault()
    setPwdStatus({ loading: true, error: '', success: '' })

    try {
      const res = await fetchStagiaireSettingsById(user.id)
      const stored = res?.data

      const ok = await passwordMatches(stored?.MotDePasse, pwdForm.current)
      if (!ok) {
        setPwdStatus({ loading: false, error: 'Current password is incorrect.', success: '' })
        return
      }

      const hashed = await hashPassword(pwdForm.next)
      await updateStagiaireSettings(user.id, { MotDePasse: hashed })

      setPwdForm({ current: '', next: '', confirm: '' })
      setPwdStatus({ loading: false, error: '', success: 'Password updated successfully.' })
    } catch (err) {
      setPwdStatus({ loading: false, error: 'Failed to update password.', success: '' })
    }
  }

  const onAvatarFile = async (e) => {
    const file = e.target.files?.[0]
    setAvatarFileError('')
    setAvatarStatus({ loading: false, error: '', success: '' })

    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setAvatarFileError('Only jpg, png, and webp are allowed.')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarFileError('Max file size is 2MB.')
      return
    }

    try {
      const url = await fileToDataUrl(file)
      setAvatarPreview(url)
    } catch (err) {
      setAvatarFileError('Failed to preview image.')
    }
  }

  const uploadAvatar = async () => {
    if (!avatarPreview) return

    setAvatarStatus({ loading: true, error: '', success: '' })
    try {
      await updateStagiaireSettings(user.id, { avatar: avatarPreview })
      dispatch(updateUserFields({ avatar: avatarPreview }))
      setAvatarStatus({ loading: false, error: '', success: 'Profile picture updated.' })
    } catch (err) {
      setAvatarStatus({ loading: false, error: 'Failed to upload avatar.', success: '' })
    }
  }

  const changeLanguage = async (nextLang) => {
    dispatch(setLanguage(nextLang))
    setLangStatus({ loading: true, error: '', success: '' })

    try {
      await updateStagiaireSettings(user.id, { language: nextLang })
      dispatch(updateUserFields({ language: nextLang }))
      setLangStatus({ loading: false, error: '', success: 'Language updated.' })
    } catch (err) {
      setLangStatus({ loading: false, error: 'Failed to persist language.', success: '' })
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="h4 mb-0">{t('settings')}</h1>
          </div>

          <div className="px-card">
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  {t('profile_info')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  {t('change_password')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeTab === 'avatar' ? 'active' : ''}`}
                  onClick={() => setActiveTab('avatar')}
                >
                  {t('profile_picture')}
                </button>
              </li>
              <li className="nav-item">
                <button
                  type="button"
                  className={`nav-link ${activeTab === 'language' ? 'active' : ''}`}
                  onClick={() => setActiveTab('language')}
                >
                  {t('language_preferences')}
                </button>
              </li>
            </ul>

            <div className="pt-3">
              <AnimatePresence initial={false}>
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {profileStatus.error && (
                      <div className="alert alert-danger" role="alert">
                        {profileStatus.error}
                      </div>
                    )}
                    {profileStatus.success && (
                      <div className="alert alert-success" role="alert">
                        {profileStatus.success}
                      </div>
                    )}

                    <form onSubmit={saveProfile}>
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="settings_nom">
                            Nom
                          </label>
                          <input
                            id="settings_nom"
                            className="form-control"
                            value={profile.nom}
                            onChange={(e) => handleProfileChange('nom', e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="settings_prenom">
                            Prenom
                          </label>
                          <input
                            id="settings_prenom"
                            className="form-control"
                            value={profile.prenom}
                            onChange={(e) => handleProfileChange('prenom', e.target.value)}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label" htmlFor="settings_email">
                            Email
                          </label>
                          <input
                            id="settings_email"
                            type="email"
                            className="form-control"
                            value={profile.email}
                            onChange={(e) => handleProfileChange('email', e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="settings_pays">
                            Pays
                          </label>
                          <input
                            id="settings_pays"
                            className="form-control"
                            value={profile.Pays}
                            onChange={(e) => handleProfileChange('Pays', e.target.value)}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="settings_devise">
                            Devise
                          </label>
                          <input
                            id="settings_devise"
                            className="form-control"
                            value={profile.Devise}
                            onChange={(e) => handleProfileChange('Devise', e.target.value)}
                          />
                        </div>
                        <div className="col-12">
                          <button type="submit" className="btn btn-primary" disabled={!canSaveProfile}>
                            {profileStatus.loading ? 'Saving…' : 'Save'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'password' && (
                  <motion.div
                    key="password"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {pwdStatus.error && (
                      <div className="alert alert-danger" role="alert">
                        {pwdStatus.error}
                      </div>
                    )}
                    {pwdStatus.success && (
                      <div className="alert alert-success" role="alert">
                        {pwdStatus.success}
                      </div>
                    )}

                    <form onSubmit={submitPassword}>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label" htmlFor="current_password">
                            Current password
                          </label>
                          <input
                            id="current_password"
                            type="password"
                            className="form-control"
                            value={pwdForm.current}
                            onChange={(e) => handlePwdChange('current', e.target.value)}
                            autoComplete="current-password"
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="new_password">
                            New password
                          </label>
                          <input
                            id="new_password"
                            type="password"
                            className="form-control"
                            value={pwdForm.next}
                            onChange={(e) => handlePwdChange('next', e.target.value)}
                            autoComplete="new-password"
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label" htmlFor="confirm_password">
                            Confirm new password
                          </label>
                          <input
                            id="confirm_password"
                            type="password"
                            className="form-control"
                            value={pwdForm.confirm}
                            onChange={(e) => handlePwdChange('confirm', e.target.value)}
                            autoComplete="new-password"
                          />
                        </div>

                        {pwdValidationErrors.length > 0 && (
                          <div className="col-12">
                            <ul className="mb-0 text-danger">
                              {pwdValidationErrors.map((msg) => (
                                <li key={msg}>{msg}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="col-12">
                          <button type="submit" className="btn btn-primary" disabled={!canSubmitPassword}>
                            {pwdStatus.loading ? 'Updating…' : 'Update password'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'avatar' && (
                  <motion.div
                    key="avatar"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {avatarStatus.error && (
                      <div className="alert alert-danger" role="alert">
                        {avatarStatus.error}
                      </div>
                    )}
                    {avatarStatus.success && (
                      <div className="alert alert-success" role="alert">
                        {avatarStatus.success}
                      </div>
                    )}

                    <div className="d-flex align-items-center gap-3 mb-3">
                      <img
                        src={avatarPreview || 'https://ui-avatars.com/api/?name=User&background=random&color=fff'}
                        alt="avatar preview"
                        width="64"
                        height="64"
                        className="rounded-circle border"
                        onError={(e) => {
                          e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=random&color=fff'
                        }}
                      />
                      <div className="flex-grow-1">
                        <input
                          aria-label="Avatar file"
                          type="file"
                          className="form-control"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={onAvatarFile}
                        />
                        {avatarFileError && <div className="text-danger mt-2">{avatarFileError}</div>}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={uploadAvatar}
                      disabled={avatarStatus.loading || !avatarPreview || Boolean(avatarFileError)}
                    >
                      {avatarStatus.loading ? 'Uploading…' : 'Upload'}
                    </button>
                  </motion.div>
                )}

                {activeTab === 'language' && (
                  <motion.div
                    key="language"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                  >
                    {langStatus.error && (
                      <div className="alert alert-danger" role="alert">
                        {langStatus.error}
                      </div>
                    )}
                    {langStatus.success && (
                      <div className="alert alert-success" role="alert">
                        {langStatus.success}
                      </div>
                    )}

                    <label className="form-label" htmlFor="language_select">
                      Language
                    </label>
                    <select
                      id="language_select"
                      className="form-select"
                      value={language}
                      onChange={(e) => changeLanguage(e.target.value)}
                      disabled={langStatus.loading}
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="ar">Arabic</option>
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

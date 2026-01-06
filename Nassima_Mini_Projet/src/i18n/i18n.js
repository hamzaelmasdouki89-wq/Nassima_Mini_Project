import { useSelector } from 'react-redux'

import { selectLanguage } from '../redux/settingsSlice'

const dict = {
  en: {
    settings: 'Settings',
    profile_info: 'Profile Info',
    change_password: 'Change Password',
    profile_picture: 'Profile Picture',
    language_preferences: 'Language Preferences',
    admin_dashboard: 'Admin Dashboard',
  },
  fr: {
    settings: 'Paramètres',
    profile_info: 'Infos Profil',
    change_password: 'Changer le mot de passe',
    profile_picture: 'Photo de profil',
    language_preferences: 'Langue',
    admin_dashboard: 'Tableau Admin',
  },
  ar: {
    settings: 'الإعدادات',
    profile_info: 'معلومات الحساب',
    change_password: 'تغيير كلمة المرور',
    profile_picture: 'صورة الملف',
    language_preferences: 'اللغة',
    admin_dashboard: 'لوحة الإدارة',
  },
}

export const t = (lang, key) => {
  const l = dict[lang] ? lang : 'en'
  return dict[l]?.[key] || dict.en[key] || key
}

export const useT = () => {
  const lang = useSelector(selectLanguage)
  return (key) => t(lang, key)
}

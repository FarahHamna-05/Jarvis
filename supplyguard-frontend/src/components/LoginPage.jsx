import React from 'react';
import AuthPage from './AuthPage';

export default function LoginPage({
  defaultMode = 'login',
  initialMode,
  onBackToHome,
  onNavigateDashboard,
  onLoginSuccess,
  onAuthSuccess,
  onSubmitSuccess,
  showToast
}) {
  return (
    <AuthPage
      initialMode={defaultMode || initialMode || 'login'}
      onAuthSuccess={onLoginSuccess || onAuthSuccess}
      onNavigateDashboard={onBackToHome || onNavigateDashboard}
      showToast={showToast || (onSubmitSuccess ? (t) => onSubmitSuccess(typeof t === 'string' ? t : t?.title) : undefined)}
    />
  );
}

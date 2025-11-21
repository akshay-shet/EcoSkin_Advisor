import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLoginView) {
        if (!email) return;
        // Mock login by creating a username from the email, as the login function requires a name.
        login(email.split('@')[0], email);
      } else {
        if (!name || !email) return;
        login(name, email);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  return (
    <div className="flex items-center justify-center py-12 md:py-24 bg-base-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            <span className="flex justify-center items-center gap-2">
              <LeafIcon /> {t('login.title')}
            </span>
          </CardTitle>
          <p className="text-center text-sm text-text-secondary dark:text-gray-400 pt-2">
            {isLoginView ? t('login.subtitle') : t('login.registerTitle')}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            {!isLoginView && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t('login.nameLabel')}
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('login.namePlaceholder')}
                  className="mt-1"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('login.emailLabel')}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t('login.emailPlaceholder')}
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full">
              {isLoginView ? t('login.button') : t('login.registerButton')}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            <button
              onClick={() => {
                setIsLoginView(!isLoginView);
                setError(null);
              }}
              className="font-medium text-brand-primary hover:text-brand-dark dark:text-brand-secondary dark:hover:text-brand-light"
            >
              {isLoginView ? t('login.createAccountPrompt') : t('login.alreadyHaveAccount')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function LeafIcon({ className = "h-6 w-6 text-brand-primary" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M11 20A7 7 0 0 1 4 13q0-3.5 2.5-6.5A10 10 0 0 1 20 4a7 7 0 0 1-7 7q-3.5 0-6.5 2.5Z" />
      <path d="M12 21a7 7 0 0 0 7-7q0-3.5-2.5-6.5A10 10 0 0 0 4 4a7 7 0 0 0 7 7q3.5 0 6.5 2.5Z" />
    </svg>
  );
}

export default LoginPage;

import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Logga in</h1>
        <button
          onClick={login}
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          Logga in med Google
        </button>
      </div>
    </div>
  );
}
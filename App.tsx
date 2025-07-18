import React, { useState, useEffect, useCallback } from 'react';
import { Transaction, ToastMessage } from './types.ts';
import { useTransactions } from './hooks/useTransactions.ts';
import { useAuth } from './hooks/useAuth.ts';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import TransactionList from './components/TransactionList.tsx';
import TransactionForm from './components/TransactionForm.tsx';
import Toast from './components/Toast.tsx';
import Login from './components/Login.tsx';
import Spinner from './components/Spinner.tsx';
import { PlusIcon } from './components/icons/PlusIcon.tsx';

const App: React.FC = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { transactions, addTransaction, deleteTransaction, loading: transactionsLoading } = useTransactions(user?.uid);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    addTransaction(transaction);
    showToast('Transaction added successfully!', 'success');
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (!user) {
    return <Login theme={theme} toggleTheme={toggleTheme} />;
  }
  
  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header theme={theme} toggleTheme={toggleTheme} user={user} onLogout={logout} />
      
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <Dashboard transactions={transactions} />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Transaction</span>
            </button>
          </div>
          <TransactionList 
            transactions={transactions} 
            onDelete={deleteTransaction} 
            isLoading={transactionsLoading} 
          />
        </div>
      </main>

      {isModalOpen && (
        <TransactionForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTransaction}
          showToast={showToast}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
};

export default App;
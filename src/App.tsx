import { useState, useCallback, useMemo } from 'react';
import { Page, Village } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import {
  HomePage,
  NewsPage,
  ComplaintsPage,
  SchemesPage,
  MembersPage,
  EmergencyPage,
  PollsPage,
  NoticesPage,
  NotificationsPage,
  ProfilePage,
} from './pages';
import { useNotifications } from './hooks/useNotifications';
import { colors } from './utils/colors';
import './styles/animations.css';

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedVillage, setSelectedVillage] = useState<Village | 'All'>('All');
  const [_theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize notifications
  const { unreadCount } = useNotifications([
    {
      id: 1,
      title: 'नई खबर',
      message: 'नए स्वास्थ्य शिविर की घोषणा',
      type: 'info',
      date: new Date().toLocaleDateString('hi-IN'),
      read: false,
    },
    {
      id: 2,
      title: 'शिकायत अपडेट',
      message: 'आपकी शिकायत को स्वीकार किया गया',
      type: 'success',
      date: new Date().toLocaleDateString('hi-IN'),
      read: false,
    },
  ]);

  const handleThemeChange = useCallback((newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    document.documentElement.style.colorScheme = newTheme;
  }, []);

  const pageConfig = useMemo(
    () => ({
      home: { title: 'पिण्डरा विधानसभा', showBack: false },
      news: { title: 'खबरें', showBack: true },
      complaints: { title: 'शिकायतें', showBack: true },
      schemes: { title: 'योजनाएं', showBack: true },
      members: { title: 'सदस्य', showBack: true },
      emergency: { title: 'आपातकाल', showBack: true },
      polls: { title: 'पोल', showBack: true },
      notices: { title: 'नोटिस', showBack: true },
      notifications: { title: 'सूचनाएं', showBack: true },
      profile: { title: 'प्रोफाइल', showBack: true },
    }),
    []
  );

  const config = pageConfig[currentPage];

  const renderPage = useCallback(() => {
    const props = { onNavigate: setCurrentPage, selectedVillage };
    
    switch (currentPage) {
      case 'home':
        return <HomePage {...props} />;
      case 'news':
        return <NewsPage selectedVillage={selectedVillage} />;
      case 'complaints':
        return <ComplaintsPage selectedVillage={selectedVillage} />;
      case 'schemes':
        return <SchemesPage />;
      case 'members':
        return <MembersPage selectedVillage={selectedVillage} />;
      case 'emergency':
        return <EmergencyPage />;
      case 'polls':
        return <PollsPage selectedVillage={selectedVillage} />;
      case 'notices':
        return <NoticesPage selectedVillage={selectedVillage} />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage onThemeChange={handleThemeChange} />;
      default:
        return <HomePage {...props} />;
    }
  }, [currentPage, handleThemeChange, selectedVillage]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.neutral.light,
        color: colors.text.primary,
        fontFamily: 'inherit',
      }}
    >
      <Header
        title={config.title}
        showBack={config.showBack}
        onBack={() => setCurrentPage('home')}
        onNotificationsClick={() => setCurrentPage('notifications')}
        onProfileClick={() => setCurrentPage('profile')}
        notificationCount={unreadCount}
        selectedVillage={selectedVillage}
        onVillageChange={setSelectedVillage}
      />

      <main style={{ flex: 1, overflow: 'auto', paddingBottom: '80px' }}>
        {renderPage()}
      </main>

      <BottomNav active={currentPage} onChange={setCurrentPage} />
    </div>
  );
}

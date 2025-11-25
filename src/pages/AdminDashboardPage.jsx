import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, Languages, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import AdminReportsSection from '@/components/admin/AdminReportsSection';
import AdminSuggestionsSection from '@/components/admin/AdminSuggestionsSection';
import AdminManageLocationsCategories from '@/components/admin/AdminManageLocationsCategories';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import reportService from '@/services/reportService';
import suggestionService from '@/services/suggestionService';
import categoryService from '@/services/categoryService';
import locationService from '@/services/locationService';
import userService from '@/services/userService';

// Fallback data in case API fails
const initialReportsData = [
  { id: 'crisis-1', type: 'أزمة', description: 'انقطاع الكهرباء في المكتبة المركزية', location: 'المكتبة', user: 'النظام', isCrisis: true, timestamp: new Date().toISOString(), status: 'قيد المراجعة', credibility: 100, department: 'المكتبة' },
  { id: 1, type: 'جودة الحياة', description: 'نقص الكراسي في قاعة المطالعة', location: 'المكتبة', user: 'ahmed@univ-saida.dz', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'قيد المراجعة', credibility: 85, isCrisis: false, department: 'المكتبة' },
];

const initialSuggestionsData = [
  { id: 'sug-1', type: 'حدث جامعي', description: 'تنظيم يوم رياضي لطلاب الجامعة', upvotes: 15, status: 'قيد المراجعة', user: 'ali@univ-saida.dz', timestamp: new Date().toISOString(), adminComment: '', department: 'الأنشطة الطلابية' },
  { id: 'sug-2', type: 'توفير خدمة', description: 'توفير آلات بيع مشروبات ساخنة في المكتبة', upvotes: 28, status: 'مقبول', user: 'sara.k@univ-saida.dz', timestamp: new Date(Date.now() - 86400000).toISOString(), adminComment: 'فكرة جيدة، سيتم النظر فيها.', department: 'المكتبة' },
];

const AdminDashboardPage = ({ onLogout }) => {
  const { toast } = useToast();
  const { theme } = useTheme();
  const [language, setLanguage] = useState('ar');
  
  // State for data from API
  const [reports, setReports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch reports
        const reportsData = await reportService.getAllReports();
        setReports(reportsData);

        // Fetch suggestions
        const suggestionsData = await suggestionService.getAllSuggestions();
        setSuggestions(suggestionsData);

        // Fetch categories
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);

        // Fetch locations
        const locationsData = await locationService.getAllLocations();
        setLocations(locationsData);

        // Fetch users
        const usersData = await userService.getAllUsers();
        setUsers(usersData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);
        
        // If API fails, use initial data for demo purposes
        setReports(initialReportsData);
        setSuggestions(initialSuggestionsData);
      }
    };

    fetchData();
  }, []);

  const textContent = {
    ar: {
      title: "لوحة تحكم الإدارة - CampusVoice",
      logout: "تسجيل الخروج",
      switchToFrench: "Français",
      switchToArabic: "العربية",
      statistics: "الإحصاءات",
      totalReports: "إجمالي الإبلاغات",
      pendingReports: "إبلاغات قيد المراجعة",
      resolvedReports: "إبلاغات محلولة",
      totalSuggestions: "إجمالي الاقتراحات",
      userManagement: "إدارة المستخدمين",
    },
    fr: {
      title: "Tableau de Bord Admin - CampusVoice",
      logout: "Déconnexion",
      switchToFrench: "Français",
      switchToArabic: "العربية",
      statistics: "Statistiques",
      totalReports: "Total Signalements",
      pendingReports: "Signalements en Attente",
      resolvedReports: "Signalements Résolus",
      totalSuggestions: "Total Suggestions",
      userManagement: "Gestion des utilisateurs",
    }
  };
  
  const currentText = textContent[language];

  const toggleLanguage = () => setLanguage(prev => prev === 'ar' ? 'fr' : 'ar');
  
  const stats = {
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'قيد المراجعة' || r.status === 'مشبوهة').length,
    resolvedReports: reports.filter(r => r.status === 'محلولة').length,
    totalSuggestions: suggestions.length,
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-700">
        <motion.h1 
          initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent gradient-bg"
        >
          {currentText.title}
        </motion.h1>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="outline" onClick={toggleLanguage} className="flex items-center">
            <Languages className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {language === 'ar' ? currentText.switchToFrench : currentText.switchToArabic}
          </Button>
          <Button variant="destructive" onClick={onLogout} className="flex items-center">
            <LogOut className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {currentText.logout}
          </Button>
        </div>
      </header>

      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BarChart3 className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-6 w-6 text-primary`} />
          {currentText.statistics}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: currentText.totalReports, value: stats.totalReports, color: "bg-blue-500" },
            { title: currentText.pendingReports, value: stats.pendingReports, color: "bg-yellow-500" },
            { title: currentText.resolvedReports, value: stats.resolvedReports, color: "bg-green-500" },
            { title: currentText.totalSuggestions, value: stats.totalSuggestions, color: "bg-purple-500" },
          ].map(stat => (
            <Card key={stat.title} className={`shadow-lg ${stat.color} text-white`}>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl md:text-4xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.section>
      
      {/* Reports Management Section */}
      <AdminReportsSection 
        reports={reports} 
        setReports={setReports} 
        language={language} 
        toast={toast} 
        departments={categories.map(c => c.name_ar)}
      />
      
      {/* Suggestions Management Section */}
      <AdminSuggestionsSection 
        suggestions={suggestions} 
        setSuggestions={setSuggestions} 
        language={language} 
        toast={toast} 
        departments={categories.map(c => c.name_ar)}
      />
      
      {/* Locations and Categories Management */}
      <AdminManageLocationsCategories 
        locations={locations}
        setLocations={setLocations}
        categories={categories}
        setCategories={setCategories}
        language={language}
        toast={toast}
      />
      
      {/* User Management Section */}
      <AdminUserManagement 
        users={users}
        setUsers={setUsers}
        language={language}
        toast={toast}
        departments={categories.map(c => c.name_ar)}
      />
    </div>
  );
};

export default AdminDashboardPage;
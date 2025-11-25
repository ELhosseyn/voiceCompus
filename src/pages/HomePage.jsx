import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogOut, History, Languages, Sun, Moon, Lightbulb, ThumbsUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import ReportForm from '@/components/home/ReportForm';
import CrisisAlerts from '@/components/home/CrisisAlerts';
import ReportedProblems from '@/components/home/ReportedProblems';
import { timeSince } from '@/lib/utils';
import reportService from '@/services/reportService';
import suggestionService from '@/services/suggestionService';
import categoryService from '@/services/categoryService';
import locationService from '@/services/locationService';

const initialReports = [
  { id: 'crisis-1', type: 'أزمة', description: 'انقطاع الكهرباء في المكتبة المركزية', location: 'المكتبة', user: 'النظام', isCrisis: true, timestamp: new Date().toISOString(), status: 'قيد المراجعة' },
  { id: 1, type: 'جودة الحياة', description: 'نقص الكراسي في قاعة المطالعة', location: 'المكتبة', user: 'ahmed@univ-saida.dz', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'قيد المراجعة', isCrisis: false },
  { id: 2, type: 'وسائل النقل', description: 'تأخر الحافلة رقم 3 لأكثر من ساعة', location: 'الحافلة رقم 3', user: 'fatima.z@univ-saida.dz', timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'محلولة', isCrisis: false },
];

const initialSuggestions = [
  { id: 'sug-1', type: 'حدث جامعي', description: 'تنظيم يوم رياضي لطلاب الجامعة', upvotes: 15, status: 'قيد المراجعة', user: 'ali@univ-saida.dz', timestamp: new Date().toISOString() },
  { id: 'sug-2', type: 'توفير خدمة', description: 'توفير آلات بيع مشروبات ساخنة في المكتبة', upvotes: 28, status: 'مقبول', user: 'sara.k@univ-saida.dz', timestamp: new Date(Date.now() - 86400000).toISOString() },
];
    
const HomePage = ({ userEmail, isAnonymous, onLogout }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState('ar');
  
  const [reports, setReports] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch reports
        const reportsData = await reportService.getAllReports();
        // Check if API returns data property (Laravel resource collection format)
        setReports(Array.isArray(reportsData) ? reportsData : (reportsData.data || []));

        // Fetch suggestions
        const suggestionsData = await suggestionService.getAllSuggestions();
        // Check if API returns data property (Laravel resource collection format)
        setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : (suggestionsData.data || []));

        // Fetch categories
        const categoriesData = await categoryService.getAllCategories();
        // Check if API returns data property (Laravel resource collection format)
        setCategories(Array.isArray(categoriesData) ? categoriesData : (categoriesData.data || []));

        // Fetch locations
        const locationsData = await locationService.getAllLocations();
        // Check if API returns data property (Laravel resource collection format)
        setLocations(Array.isArray(locationsData) ? locationsData : (locationsData.data || []));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
        setLoading(false);

        // If API fails, use initial data for demo purposes
        setReports(initialReports);
        setSuggestions(initialSuggestions);
      }
    };

    fetchData();
  }, []);

  const problemTypesOptions = {
    ar: categories.length > 0 ? categories.map(category => category.name_ar) : ['جودة الحياة', 'وسائل النقل'],
    fr: categories.length > 0 ? categories.map(category => category.name_fr) : ['Qualité de vie', 'Transport']
  };

  const locationsOptions = {
    ar: locations.length > 0 ? locations.map(location => location.name_ar) : ['المكتبة', 'الحافلة رقم 1', 'الحافلة رقم 2', 'الحافلة رقم 3', 'المقصف', 'الإقامة الجامعية', 'القسم'],
    fr: locations.length > 0 ? locations.map(location => location.name_fr) : ['Bibliothèque', 'Bus N°1', 'Bus N°2', 'Bus N°3', 'Restaurant universitaire', 'Cité universitaire', 'Département']
  };

  const textContent = {
    ar: {
      title: "CampusVoice - صوت الحرم",
      welcome: isAnonymous ? "مرحباً بك، مستخدم مجهول" : `مرحباً بك، ${userEmail}`,
      viewHistory: "عرض تاريخ الإبلاغات",
      logout: "تسجيل الخروج",
      switchToFrench: "Français",
      switchToArabic: "العربية",
      reportProblem: "أبلغ عن مشكلة",
      problemTypeLabel: "اختر نوع المشكلة",
      problemTypePlaceholder: "نوع المشكلة",
      descriptionLabel: "وصف المشكلة",
      descriptionPlaceholder: "صف المشكلة بالتفصيل...",
      locationLabel: "اختر الموقع",
      locationPlaceholder: "الموقع",
      reportAnonymouslyLabel: "إبلاغ مجهول",
      anonymousNote: "لن تحصل على نقاط أو سجل شخصي",
      submitButton: "إرسال البلاغ",
      crisisAlerts: "تنبيهات الأزمات",
      reportedProblems: "المشاكل المبلغ عنها",
      noProblems: "لا توجد مشاكل مبلغ عنها حالياً.",
      reportSuccessTitle: "تم إرسال البلاغ",
      reportSuccessDesc: "شكراً لك على مساهمتك!",
      reportErrorTitle: "خطأ في الإرسال",
      reportErrorDesc: "يرجى ملء جميع الحقول المطلوبة.",
      deleteReport: "حذف البلاغ",
      confirmDeleteDesc: "هل أنت متأكد أنك تريد حذف هذا البلاغ؟ هذا الإجراء لا يمكن التراجع عنه.",
      reportDeleted: "تم حذف البلاغ بنجاح",
      suggestImprovement: "اقترح تحسينًا",
      submitSuggestion: "تقديم اقتراح",
      mostUpvotedSuggestions: "الاقتراحات الأكثر تأييدًا",
      upvotes: "تأييد",
      noSuggestions: "لا توجد اقتراحات حاليًا."
    },
    fr: {
      title: "CampusVoice - La Voix du Campus",
      welcome: isAnonymous ? "Bienvenue, utilisateur anonyme" : `Bienvenue, ${userEmail}`,
      viewHistory: "Voir l'historique",
      logout: "Déconnexion",
      switchToFrench: "Français",
      switchToArabic: "العربية",
      reportProblem: "Signaler un problème",
      problemTypeLabel: "Choisissez le type de problème",
      problemTypePlaceholder: "Type de problème",
      descriptionLabel: "Description du problème",
      descriptionPlaceholder: "Décrivez le problème en détail...",
      locationLabel: "Choisissez l'emplacement",
      locationPlaceholder: "Emplacement",
      reportAnonymouslyLabel: "Signaler anonymement",
      anonymousNote: "Vous ne recevrez pas de points ni d'historique personnel",
      submitButton: "Envoyer le signalement",
      crisisAlerts: "Alertes de crise",
      reportedProblems: "Problèmes signalés",
      noProblems: "Aucun problème signalé pour le moment.",
      reportSuccessTitle: "Signalement envoyé",
      reportSuccessDesc: "Merci pour votre contribution !",
      reportErrorTitle: "Erreur d'envoi",
      reportErrorDesc: "Veuillez remplir tous les champs obligatoires.",
      deleteReport: "Supprimer le signalement",
      confirmDeleteDesc: "Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est irréversible.",
      reportDeleted: "Signalement supprimé avec succès",
      suggestImprovement: "Suggérer une amélioration",
      submitSuggestion: "Soumettre une suggestion",
      mostUpvotedSuggestions: "Suggestions les plus soutenues",
      upvotes: "soutiens",
      noSuggestions: "Aucune suggestion pour le moment."
    }
  };

  const currentText = textContent[language];
  
  // Filter crisis and regular reports
  const crisisReports = reports.filter(report => report.isCrisis);
  const regularReports = reports.filter(report => !report.isCrisis);

  const handleReportSubmit = async (reportData) => {
    if (!reportData.type || !reportData.description || !reportData.location) {
      toast({
        title: textContent[language].reportErrorTitle,
        description: textContent[language].reportErrorDesc,
        variant: 'destructive',
      });
      return;
    }

    try {
      // Find category_id and location_id based on selected names
      const selectedCategory = categories.find(cat => 
        cat.name_ar === reportData.type || cat.name_fr === reportData.type
      );
      
      const selectedLocation = locations.find(loc => 
        loc.name_ar === reportData.location || loc.name_fr === reportData.location
      );

      if (!selectedCategory || !selectedLocation) {
        toast({
          title: textContent[language].reportErrorTitle,
          description: 'Invalid category or location selected.',
          variant: 'destructive',
        });
        return;
      }

      // Create report data for API
      const apiReportData = {
        title: `Report about ${reportData.type}`,
        description: reportData.description,
        category_id: selectedCategory.id,
        location_id: selectedLocation.id,
      };

      // Submit report to API
      const response = await reportService.createReport(apiReportData);
      
      // Update local state with the new report
      setReports([response.report, ...reports]);
      
      toast({
        title: textContent[language].reportSuccessTitle,
        description: textContent[language].reportSuccessDesc,
      });
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: textContent[language].reportErrorTitle,
        description: error.response?.data?.message || 'Failed to submit report. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm(textContent[language].confirmDeleteDesc)) {
      try {
        // Delete report from API
        await reportService.deleteReport(id);
        
        // Update local state
        const updatedReports = reports.filter(report => report.id !== id);
        setReports(updatedReports);
        
        toast({
          title: textContent[language].reportDeleted,
        });
      } catch (error) {
        console.error('Error deleting report:', error);
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to delete report. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  const topSuggestions = [...suggestions].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'ar' ? 'fr' : 'ar');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <header className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent gradient-bg"
        >
          {currentText.title}
        </motion.h1>
        <div className="flex items-center space-x-2 space-x-reverse">
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" onClick={toggleLanguage} className="flex items-center">
            <Languages className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {language === 'ar' ? currentText.switchToFrench : currentText.switchToArabic}
          </Button>
          {!isAnonymous && (
            <Button variant="outline" onClick={() => navigate('/history')} className="flex items-center">
              <History className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
              {currentText.viewHistory}
            </Button>
          )}
          <Button variant="destructive" onClick={onLogout} className="flex items-center">
            <LogOut className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
            {currentText.logout}
          </Button>
        </div>
      </header>

      <p className="mb-8 text-lg">{currentText.welcome}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div 
          className="md:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ReportForm
            language={language}
            currentText={currentText}
            problemTypesOptions={problemTypesOptions[language]}
            locationsOptions={locationsOptions[language]}
            onSubmit={handleReportSubmit}
            isAnonymous={isAnonymous}
            toast={toast}
          />
        </motion.div>

        <motion.div 
          className="md:col-span-2 space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CrisisAlerts
            crisisReports={crisisReports}
            currentText={currentText}
            language={language}
            timeSince={(date) => timeSince(date, language)}
          />
          
          <ReportedProblems
            reports={regularReports}
            currentText={currentText}
            language={language}
            theme={theme}
            userEmail={userEmail}
            isAnonymous={isAnonymous}
            onDeleteReport={handleDeleteReport}
            timeSince={(date) => timeSince(date, language)}
          />

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <Lightbulb className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-6 w-6 text-yellow-400`} />
                {currentText.suggestImprovement}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/suggestions')} className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 transition-opacity duration-300 text-black">
                {currentText.submitSuggestion}
                <ArrowRight className={`${language === 'ar' ? 'mr-2' : 'ml-2'} h-4 w-4`} />
              </Button>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">{currentText.mostUpvotedSuggestions}</h3>
                {topSuggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {topSuggestions.map(suggestion => (
                      <li key={suggestion.id} className={`p-3 rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} flex justify-between items-center`}>
                        <span className="truncate max-w-[70%]">{suggestion.description}</span>
                        <div className="flex items-center text-sm text-yellow-500">
                          <ThumbsUp className="h-4 w-4 mr-1 ml-1" />
                          {suggestion.upvotes} {currentText.upvotes}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">{currentText.noSuggestions}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
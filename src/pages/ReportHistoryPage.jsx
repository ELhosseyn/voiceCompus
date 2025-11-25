import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Badge } from '@/components/ui/badge';
    import { useToast } from '@/components/ui/use-toast';
    import { Home, LogOut, ListOrdered, MessageSquare as MessageSquareWarning, MapPin, Clock, Trash2, Lightbulb, ThumbsUp, Edit3 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useTheme } from '@/components/ThemeProvider';
    import { timeSince } from '@/lib/utils';
    import reportService from '@/services/reportService';
    import suggestionService from '@/services/suggestionService';

    const ReportHistoryPage = ({ userEmail, onLogout }) => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const { theme } = useTheme();
      const [userReports, setUserReports] = useState([]);
      const [userSuggestions, setUserSuggestions] = useState([]);
      const [language, setLanguage] = useState('ar'); // Assuming 'ar' as default, can be dynamic

      useEffect(() => {
    const fetchUserData = async () => {
      try {
        const reportsResponse = await reportService.getAllReports();
        const filteredReports = reportsResponse.filter(report => report.user === userEmail && !report.isCrisis);
        setUserReports(filteredReports.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));

        const suggestionsResponse = await suggestionService.getAllSuggestions();
        const filteredSuggestions = suggestionsResponse.filter(suggestion => suggestion.user === userEmail);
        setUserSuggestions(filteredSuggestions.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error loading data",
          description: "Could not load your reports and suggestions",
          variant: 'destructive',
        });
      }
    };
    
    fetchUserData();
  }, [userEmail, toast]);

      const textContent = {
        ar: {
            pageTitle: "تاريخ الإبلاغات والاقتراحات",
            welcome: `مرحباً بك، ${userEmail}. هنا يمكنك تتبع بلاغاتك واقتراحاتك.`,
            reportsSectionTitle: "بلاغاتي",
            suggestionsSectionTitle: "اقتراحاتي",
            noReports: "لم تقم بتقديم أي بلاغات حتى الآن.",
            noSuggestions: "لم تقم بتقديم أي اقتراحات حتى الآن.",
            deleteReport: "حذف البلاغ",
            deleteSuggestion: "حذف الاقتراح",
            confirmDelete: "هل أنت متأكد أنك تريد الحذف؟ هذا الإجراء لا يمكن التراجع عنه.",
            deletedSuccessfully: "تم الحذف بنجاح",
            reportType: "النوع",
            suggestionType: "نوع الاقتراح",
            location: "الموقع",
            time: "الوقت",
            upvotes: "تأييدات",
            status: "الحالة",
            statusTypes: {
                'قيد المراجعة': 'قيد المراجعة',
                'مقبول': 'مقبول',
                'مرفوض': 'مرفوض',
            },
            homeButton: "الصفحة الرئيسية",
            logoutButton: "تسجيل الخروج",
        },
        fr: {
            pageTitle: "Historique des signalements et suggestions",
            welcome: `Bienvenue, ${userEmail}. Suivez ici vos signalements et suggestions.`,
            reportsSectionTitle: "Mes signalements",
            suggestionsSectionTitle: "Mes suggestions",
            noReports: "Vous n'avez soumis aucun signalement pour le moment.",
            noSuggestions: "Vous n'avez soumis aucune suggestion pour le moment.",
            deleteReport: "Supprimer le signalement",
            deleteSuggestion: "Supprimer la suggestion",
            confirmDelete: "Êtes-vous sûr de vouloir supprimer ? Cette action est irréversible.",
            deletedSuccessfully: "Supprimé avec succès",
            reportType: "Type",
            suggestionType: "Type de suggestion",
            location: "Lieu",
            time: "Heure",
            upvotes: "Soutiens",
            status: "Statut",
            statusTypes: {
                'قيد المراجعة': 'En attente',
                'مقبول': 'Accepté',
                'مرفوض': 'Rejeté',
            },
            homeButton: "Accueil",
            logoutButton: "Déconnexion",
        }
      };
      const currentText = textContent[language];


      const handleDeleteReport = async (reportId) => {
    if (window.confirm(currentText.confirmDelete)) {
      try {
        await reportService.deleteReport(reportId);
        setUserReports(prevReports => prevReports.filter(report => report.id !== reportId));
        toast({
          title: currentText.deletedSuccessfully,
          variant: 'default',
        });
      } catch (error) {
        console.error('Error deleting report:', error);
        toast({
          title: "Error",
          description: "Could not delete the report",
          variant: 'destructive',
        });
      }
    }
  };

      const handleDeleteSuggestion = async (suggestionId) => {
    if (window.confirm(currentText.confirmDelete)) {
      try {
        await suggestionService.deleteSuggestion(suggestionId);
        setUserSuggestions(prevSuggestions => prevSuggestions.filter(suggestion => suggestion.id !== suggestionId));
        toast({
          title: currentText.deletedSuccessfully,
          variant: 'default',
        });
      } catch (error) {
        console.error('Error deleting suggestion:', error);
        toast({
          title: "Error",
          description: "Could not delete the suggestion",
          variant: 'destructive',
        });
      }
    }
  };
      
      const getStatusBadgeVariant = (status) => {
        if (status === 'مقبول' || status === 'محلولة') return 'success';
        if (status === 'مرفوض') return 'destructive';
        return 'default'; // For 'قيد المراجعة'
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
              {currentText.pageTitle}
            </motion.h1>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Button variant="outline" onClick={() => navigate('/')} className="flex items-center">
                <Home className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {currentText.homeButton}
              </Button>
              <Button variant="destructive" onClick={onLogout} className="flex items-center">
                <LogOut className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {currentText.logoutButton}
              </Button>
            </div>
          </header>
          
          <p className="mb-4 text-lg">{currentText.welcome}</p>
          
          {/* Reports Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <ListOrdered className={`${language === 'ar' ? 'ml-3' : 'mr-3'} h-6 w-6 text-primary`} />
                {currentText.reportsSectionTitle} ({userReports.length})
            </h2>
            {userReports.length === 0 ? (
              <Card className="text-center shadow-xl py-8">
                <CardContent>
                  <p className="text-muted-foreground">{currentText.noReports}</p>
                  <img  alt="Empty state illustration for no reports" class="mx-auto mt-4 w-1/2 md:w-1/3" src="https://images.unsplash.com/photo-1696744404432-d829841194f4" />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {userReports.map((report, index) => (
                    <motion.div
                      key={report.id} layout
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl flex items-center">
                                <MessageSquareWarning className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-accent`} />
                                {report.description}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {currentText.reportType}: {report.type}
                              </CardDescription>
                            </div>
                             <Button variant="ghost" size="icon" onClick={() => handleDeleteReport(report.id)} aria-label={currentText.deleteReport}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            <MapPin className={`inline ${language === 'ar' ? 'ml-1' : 'mr-1'} h-4 w-4 text-primary`} />
                            {currentText.location}: {report.location}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            <Clock className={`inline ${language === 'ar' ? 'ml-1' : 'mr-1'} h-4 w-4`} />
                            {currentText.time}: {timeSince(report.timestamp, language)} ({new Date(report.timestamp).toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR')})
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>

          {/* Suggestions Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <Lightbulb className={`${language === 'ar' ? 'ml-3' : 'mr-3'} h-6 w-6 text-yellow-400`} />
                {currentText.suggestionsSectionTitle} ({userSuggestions.length})
            </h2>
            {userSuggestions.length === 0 ? (
              <Card className="text-center shadow-xl py-8">
                <CardContent>
                  <p className="text-muted-foreground">{currentText.noSuggestions}</p>
                  <img  alt="Empty state illustration for no suggestions" class="mx-auto mt-4 w-1/2 md:w-1/3" src="https://images.unsplash.com/photo-1512314889357-e157c22f938d" />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {userSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={suggestion.id} layout
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-xl flex items-center">
                                <Edit3 className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-yellow-500`} />
                                {suggestion.description}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {currentText.suggestionType}: {suggestion.type}
                              </CardDescription>
                            </div>
                             <Button variant="ghost" size="icon" onClick={() => handleDeleteSuggestion(suggestion.id)} aria-label={currentText.deleteSuggestion}>
                                <Trash2 className="h-5 w-5 text-destructive" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <ThumbsUp className={`inline ${language === 'ar' ? 'ml-1' : 'mr-1'} h-4 w-4 text-green-500`} />
                            {currentText.upvotes}: {suggestion.upvotes}
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-medium mr-1 ml-1">{currentText.status}:</span> 
                            <Badge variant={getStatusBadgeVariant(suggestion.status)}>{currentText.statusTypes[suggestion.status] || suggestion.status}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            <Clock className={`inline ${language === 'ar' ? 'ml-1' : 'mr-1'} h-4 w-4`} />
                            {currentText.time}: {timeSince(suggestion.timestamp, language)} ({new Date(suggestion.timestamp).toLocaleString(language === 'ar' ? 'ar-DZ' : 'fr-FR')})
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.section>
        </div>
      );
    };

    export default ReportHistoryPage;
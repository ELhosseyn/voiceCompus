import React, { useState, useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Home, LogOut, Lightbulb } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useTheme } from '@/components/ThemeProvider';
    import SuggestionForm from '@/components/suggestions/SuggestionForm';
    import SuggestionList from '@/components/suggestions/SuggestionList';
    import SuggestionFilter from '@/components/suggestions/SuggestionFilter';
    import suggestionService from '@/services/suggestionService';

    const initialSuggestionsData = [
        { id: 'sug-1', type: 'حدث جامعي', description: 'تنظيم يوم رياضي لطلاب الجامعة', upvotes: 15, status: 'قيد المراجعة', user: 'ali@univ-saida.dz', timestamp: new Date().toISOString(), voters: ['ali@univ-saida.dz'] },
        { id: 'sug-2', type: 'توفير خدمة', description: 'توفير آلات بيع مشروبات ساخنة في المكتبة', upvotes: 28, status: 'مقبول', user: 'sara.k@univ-saida.dz', timestamp: new Date(Date.now() - 86400000).toISOString(), voters: ['sara.k@univ-saida.dz', 'ahmed@univ-saida.dz'] },
        { id: 'sug-3', type: 'طلب دورة تدريبية', description: 'دورة تكوينية في مجال الذكاء الاصطناعي', upvotes: 5, status: 'قيد المراجعة', user: 'm_user@univ-saida.dz', timestamp: new Date(Date.now() - 172800000).toISOString(), voters: [] },
    ];

    const SuggestionsPage = ({ userEmail, isAnonymous, onLogout }) => {
      const navigate = useNavigate();
      const { toast } = useToast();
      const { theme } = useTheme();
      const [language, setLanguage] = useState('ar');

      const [suggestions, setSuggestions] = useState([]);
  const [filterType, setFilterType] = useState('الكل');

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const data = await suggestionService.getAllSuggestions();
        // Ensure each suggestion has a 'voters' array
        setSuggestions(data.map(s => ({ ...s, voters: Array.isArray(s.voters) ? s.voters : [] })));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast({
          title: "Error loading suggestions",
          description: "Could not load the suggestions",
          variant: 'destructive',
        });
      }
    };

    fetchSuggestions();
  }, [toast]);

      const suggestionTypesOptions = {
        ar: ['حدث جامعي', 'توفير خدمة', 'طلب دورة تدريبية', 'أخرى'],
        fr: ['Événement universitaire', 'Fourniture de service', 'Demande de formation', 'Autre']
      };

      const textContent = {
        ar: {
          pageTitle: "اقترح تحسينًا لحياتك الجامعية",
          logoutButton: "تسجيل الخروج",
          homeButton: "الرئيسية",
          submitSectionTitle: "تقديم اقتراح",
          suggestionTypeLabel: "نوع الاقتراح",
          suggestionTypePlaceholder: "اختر نوع الاقتراح",
          descriptionLabel: "وصف الاقتراح",
          descriptionPlaceholder: "صف اقتراحك بالتفصيل...",
          submitButton: "إرسال الاقتراح",
          submittedSuggestionsTitle: "الاقتراحات المقدمة من الطلاب",
          filterByTypeLabel: "تصفية حسب النوع",
          allTypes: "كل الأنواع",
          supportButton: "دعم الاقتراح",
          alreadySupported: "تم الدعم",
          upvotes: "تأييدات",
          status: "الحالة",
          statusTypes: { 'قيد المراجعة': 'قيد المراجعة', 'مقبول': 'مقبول', 'مرفوض': 'مرفوض' },
          suggestionSubmittedTitle: "تم إرسال الاقتراح",
          suggestionSubmittedDesc: "شكراً لك على اقتراحك القيم!",
          errorFillFields: "يرجى ملء جميع الحقول لتقديم الاقتراح.",
          errorSupportOwnSuggestion: "لا يمكنك دعم اقتراحك الخاص.",
          errorAlreadySupported: "لقد دعمت هذا الاقتراح بالفعل.",
          supportSuccess: "تم دعم الاقتراح بنجاح!",
          noSuggestions: "لا توجد اقتراحات تطابق الفلتر الحالي.",
          anonymousSupportError: "لا يمكن للمستخدم المجهول دعم الاقتراحات."
        },
        fr: {
          pageTitle: "Suggérez une amélioration pour votre vie universitaire",
          logoutButton: "Déconnexion",
          homeButton: "Accueil",
          submitSectionTitle: "Soumettre une suggestion",
          suggestionTypeLabel: "Type de suggestion",
          suggestionTypePlaceholder: "Choisissez le type",
          descriptionLabel: "Description de la suggestion",
          descriptionPlaceholder: "Décrivez votre suggestion en détail...",
          submitButton: "Envoyer la suggestion",
          submittedSuggestionsTitle: "Suggestions soumises par les étudiants",
          filterByTypeLabel: "Filtrer par type",
          allTypes: "Tous les types",
          supportButton: "Soutenir",
          alreadySupported: "Soutenu",
          upvotes: "soutiens",
          status: "Statut",
          statusTypes: { 'قيد المراجعة': 'En attente', 'مقبول': 'Accepté', 'مرفوض': 'Rejeté' },
          suggestionSubmittedTitle: "Suggestion envoyée",
          suggestionSubmittedDesc: "Merci pour votre précieuse suggestion !",
          errorFillFields: "Veuillez remplir tous les champs pour soumettre.",
          errorSupportOwnSuggestion: "Vous ne pouvez pas soutenir votre propre suggestion.",
          errorAlreadySupported: "Vous avez déjà soutenu cette suggestion.",
          supportSuccess: "Suggestion soutenue avec succès !",
          noSuggestions: "Aucune suggestion ne correspond au filtre actuel.",
          anonymousSupportError: "L'utilisateur anonyme ne peut pas soutenir les suggestions."
        }
      };
      const currentText = textContent[language];

      const handleSuggestionSubmit = async (newSuggestionData) => {
    try {
      const newSuggestion = {
        ...newSuggestionData,
        status: 'قيد المراجعة',
        user: isAnonymous ? 'مجهول' : userEmail,
        // API will handle ID generation, timestamp, etc.
      };
      
      const response = await suggestionService.createSuggestion(newSuggestion);
      
      // Add the newly created suggestion to our state
      setSuggestions(prev => [response, ...prev].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      toast({ title: currentText.suggestionSubmittedTitle, description: currentText.suggestionSubmittedDesc });
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      toast({ 
        title: "Error", 
        description: "Could not submit your suggestion", 
        variant: 'destructive' 
      });
    }
  };

      const handleSupportSuggestion = async (suggestionId) => {
    if (isAnonymous) {
      toast({ title: currentText.anonymousSupportError, variant: 'destructive'});
      return;
    }
    
    try {
      const suggestion = suggestions.find(s => s.id === suggestionId);
      if (!suggestion) return;

      if (suggestion.user === userEmail) {
        toast({ title: currentText.errorSupportOwnSuggestion, variant: 'destructive' });
        return;
      }
      
      // Ensure suggestion.voters is an array before calling .includes()
      if (Array.isArray(suggestion.voters) && suggestion.voters.includes(userEmail)) {
        toast({ title: currentText.errorAlreadySupported, variant: 'warning' });
        return;
      }
      
      // Call the API to vote for the suggestion
      await suggestionService.voteSuggestion(suggestionId);
      
      // Update the UI with the vote
      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, upvotes: s.upvotes + 1, voters: [...(s.voters || []), userEmail] } : s
      ));
      
      toast({ title: currentText.supportSuccess });
    } catch (error) {
      console.error('Error voting for suggestion:', error);
      toast({ 
        title: "Error", 
        description: "Could not vote for the suggestion", 
        variant: 'destructive' 
      });
    }
  };
      
      const filteredSuggestions = suggestions.filter(s => 
        filterType === 'الكل' || s.type === filterType
      ).sort((a,b) => b.upvotes - a.upvotes);

      return (
        <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <header className="flex justify-between items-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent gradient-bg flex items-center"
            >
              <Lightbulb className={`${language === 'ar' ? 'ml-3' : 'mr-3'} h-7 w-7 text-yellow-400`} />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="md:col-span-1"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              <SuggestionForm
                language={language}
                currentText={currentText}
                suggestionTypesOptions={suggestionTypesOptions[language]}
                onSubmit={handleSuggestionSubmit}
                toast={toast}
              />
            </motion.div>

            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              <Card className="shadow-xl">
                <CardHeader>
                  <SuggestionFilter
                    language={language}
                    currentText={currentText}
                    filterType={filterType}
                    setFilterType={setFilterType}
                    suggestionTypesOptions={suggestionTypesOptions[language]}
                  />
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  <SuggestionList
                    suggestions={filteredSuggestions}
                    language={language}
                    currentText={currentText}
                    theme={theme}
                    userEmail={userEmail}
                    isAnonymous={isAnonymous}
                    onSupportSuggestion={handleSupportSuggestion}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      );
    };

    export default SuggestionsPage;
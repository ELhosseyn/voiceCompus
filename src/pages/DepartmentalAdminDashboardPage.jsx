import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { LogOut, Languages, ListFilter, Lightbulb, Eye, CheckCircle, XCircle, Save, BarChart3, MessageSquare, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useTheme } from '@/components/ThemeProvider';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import reportService from '@/services/reportService';
    import suggestionService from '@/services/suggestionService';

    const DepartmentalAdminDashboardPage = ({ userDepartment, onLogout }) => {
      const { toast } = useToast();
      const { theme } = useTheme();
      const [language, setLanguage] = useState('ar');
      
      const [reports, setReports] = useState([]);
      const [suggestions, setSuggestions] = useState([]);
      const [selectedItem, setSelectedItem] = useState(null);
      const [adminComment, setAdminComment] = useState('');
      const [activeTab, setActiveTab] = useState('reports'); 

      useEffect(() => {
    const fetchData = async () => {
      try {
        const reportResponse = await reportService.getAllReports();
        const deptReports = reportResponse.filter(r => r.department === userDepartment);
        setReports(deptReports.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));

        const suggestionResponse = await suggestionService.getAllSuggestions();
        const deptSuggestions = suggestionResponse.filter(s => s.department === userDepartment);
        setSuggestions(deptSuggestions.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error loading data",
          description: "Could not load department data",
          variant: 'destructive',
        });
      }
    };
    
    fetchData();
  }, [userDepartment, toast]);

      const textContent = {
        ar: {
          title: `لوحة تحكم قسم ${userDepartment}`,
          logout: "تسجيل الخروج",
          switchToFrench: "Français",
          switchToArabic: "العربية",
          statistics: "إحصاءات القسم",
          totalReports: "إبلاغات القسم",
          pendingReports: "إبلاغات قيد المراجعة",
          resolvedReports: "إبلاغات محلولة",
          totalSuggestions: "اقتراحات القسم",
          reportsTab: "الإبلاغات",
          suggestionsTab: "الاقتراحات",
          itemId: "المعرف",
          description: "الوصف",
          location: "الموقع",
          student: "الطالب",
          status: "الحالة",
          upvotes: "التأييدات",
          actions: "الأفعال",
          review: "مراجعة",
          resolve: "حل",
          reject: "رفض",
          accept: "قبول",
          itemDetails: "تفاصيل العنصر",
          adminCommentLabel: "تعليق مسؤول القسم",
          saveComment: "حفظ التعليق",
          back: "عودة",
          noItemsFound: "لا توجد عناصر لعرضها.",
          itemUpdated: "تم تحديث حالة العنصر بنجاح.",
          commentSaved: "تم حفظ التعليق بنجاح.",
          statusTypes: { 'قيد المراجعة': 'قيد المراجعة', 'محلولة': 'محلولة', 'مرفوضة': 'مرفوضة', 'مقبول': 'مقبول', 'قيد المعالجة': 'قيد المعالجة', 'تم الحل': 'تم الحل' },
        },
        fr: {
          title: `Tableau de Bord Département ${userDepartment}`,
          logout: "Déconnexion",
          switchToFrench: "Français",
          switchToArabic: "العربية",
          statistics: "Statistiques du Département",
          totalReports: "Signalements du Dép.",
          pendingReports: "Signalements en Attente",
          resolvedReports: "Signalements Résolus",
          totalSuggestions: "Suggestions du Dép.",
          reportsTab: "Signalements",
          suggestionsTab: "Suggestions",
          itemId: "ID",
          description: "Description",
          location: "Lieu",
          student: "Étudiant",
          status: "Statut",
          upvotes: "Soutiens",
          actions: "Actions",
          review: "Examiner",
          resolve: "Résoudre",
          reject: "Rejeter",
          accept: "Accepter",
          itemDetails: "Détails de l'élément",
          adminCommentLabel: "Commentaire Admin Dép.",
          saveComment: "Enregistrer",
          back: "Retour",
          noItemsFound: "Aucun élément à afficher.",
          itemUpdated: "Statut de l'élément mis à jour.",
          commentSaved: "Commentaire enregistré.",
          statusTypes: { 'قيد المراجعة': 'En attente', 'محلولة': 'Résolu', 'مرفوضة': 'Rejeté', 'مقبول': 'Accepté', 'قيد المعالجة': 'En traitement', 'تم الحل': 'Traité' },
        }
      };
      const currentText = textContent[language];

      const toggleLanguage = () => setLanguage(prev => prev === 'ar' ? 'fr' : 'ar');
      
      const stats = {
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'قيد المراجعة' || r.status === 'قيد المعالجة').length,
        resolvedReports: reports.filter(r => r.status === 'محلولة' || r.status === 'تم الحل').length,
        totalSuggestions: suggestions.length,
      };

      const handleReviewItem = (item) => {
        setSelectedItem(item);
        setAdminComment(item.departmentAdminComment || '');
      };

      const handleUpdateStatus = async (itemId, newStatus, itemType) => {
    try {
      if (itemType === 'report') {
        await reportService.updateReportStatus(itemId, newStatus);
        setReports(prev => prev.map(r => r.id === itemId ? { ...r, status: newStatus } : r));
      } else if (itemType === 'suggestion') {
        await suggestionService.updateSuggestion(itemId, { status: newStatus });
        setSuggestions(prev => prev.map(s => s.id === itemId ? { ...s, status: newStatus } : s));
      }
      
      toast({ title: currentText.itemUpdated });
      
      if (selectedItem && selectedItem.id === itemId) {
        setSelectedItem(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Could not update status",
        variant: 'destructive',
      });
    }
  };
      
      const handleSaveComment = async () => {
    if (!selectedItem) return;
    
    try {
      if (activeTab === 'reports') {
        await reportService.updateReport(selectedItem.id, { departmentAdminComment: adminComment });
        setReports(prev => prev.map(r => r.id === selectedItem.id ? { ...r, departmentAdminComment: adminComment } : r));
      } else {
        await suggestionService.updateSuggestion(selectedItem.id, { departmentAdminComment: adminComment });
        setSuggestions(prev => prev.map(s => s.id === selectedItem.id ? { ...s, departmentAdminComment: adminComment } : s));
      }
      
      setSelectedItem(prev => ({ ...prev, departmentAdminComment: adminComment }));
      toast({ title: currentText.commentSaved });
    } catch (error) {
      console.error('Error saving comment:', error);
      toast({
        title: "Error",
        description: "Could not save comment",
        variant: 'destructive', 
      });
    }
  };

      const getStatusBadgeVariant = (status) => {
        if (status === 'محلولة' || status === 'مقبول' || status === 'تم الحل') return 'success';
        if (status === 'مرفوضة' || status === 'مرفوض') return 'destructive';
        if (status === 'مشبوهة') return 'warning';
        if (status === 'قيد المعالجة') return 'info';
        return 'default';
      };

      const getStatusIcon = (status) => {
          if (status === 'محلولة' || status === 'مقبول' || status === 'تم الحل') return <ShieldCheck className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-green-500`} />;
          if (status === 'مرفوضة' || status === 'مرفوض') return <ShieldX className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-red-500`} />;
          if (status === 'مشبوهة') return <ShieldAlert className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-yellow-500`} />;
          return <MessageSquare className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-blue-500`} />;
      };
      
      const itemsToDisplay = activeTab === 'reports' ? reports : suggestions;

      return (
        <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
          <header className="flex justify-between items-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-700">
            <motion.h1 
              initial={{ opacity: 0, x: language === 'ar' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent gradient-bg"
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
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart3 className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
              {currentText.statistics}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: currentText.totalReports, value: stats.totalReports, color: "bg-blue-500" },
                { title: currentText.pendingReports, value: stats.pendingReports, color: "bg-yellow-500" },
                { title: currentText.resolvedReports, value: stats.resolvedReports, color: "bg-green-500" },
                { title: currentText.totalSuggestions, value: stats.totalSuggestions, color: "bg-purple-500" },
              ].map(stat => (
                <Card key={stat.title} className={`shadow-md ${stat.color} text-white`}>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm md:text-base">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>

          <div className="mb-4 flex space-x-2 space-x-reverse">
            <Button onClick={() => setActiveTab('reports')} variant={activeTab === 'reports' ? 'default' : 'outline'}>{currentText.reportsTab}</Button>
            <Button onClick={() => setActiveTab('suggestions')} variant={activeTab === 'suggestions' ? 'default' : 'outline'}>{currentText.suggestionsTab}</Button>
          </div>
          
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.section
                key="item-details"
                initial={{ opacity: 0, x: language === 'ar' ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: language === 'ar' ? -100 : 100 }}
                className="my-8"
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center justify-between">
                      <span>{currentText.itemDetails}</span>
                       <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)}>
                        <XCircle className="h-6 w-6" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p><strong>{currentText.itemId}:</strong> {selectedItem.id}</p>
                    <p><strong>{currentText.description}:</strong> {selectedItem.description}</p>
                    {selectedItem.location && <p><strong>{currentText.location}:</strong> {selectedItem.location}</p>}
                    <p><strong>{currentText.student}:</strong> {selectedItem.user}</p>
                    {selectedItem.upvotes !== undefined && <p><strong>{currentText.upvotes}:</strong> {selectedItem.upvotes}</p>}
                    <p><strong>{currentText.status}:</strong> 
                      <Badge variant={getStatusBadgeVariant(selectedItem.status)} className="mx-2">
                        {getStatusIcon(selectedItem.status)}
                        {currentText.statusTypes[selectedItem.status] || selectedItem.status}
                      </Badge>
                    </p>
                    <div>
                      <Label htmlFor="deptAdminComment">{currentText.adminCommentLabel}</Label>
                      <Input 
                        id="deptAdminComment" 
                        value={adminComment} 
                        onChange={(e) => setAdminComment(e.target.value)}
                        placeholder={language === 'ar' ? "أضف تعليقًا..." : "Ajouter un commentaire..."}
                        className="min-h-[70px] mt-1"
                      />
                    </div>
                    <div className="flex space-x-2 space-x-reverse pt-3">
                      <Button onClick={handleSaveComment}><Save className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.saveComment}</Button>
                      {activeTab === 'reports' && selectedItem.status !== 'قيد المعالجة' && <Button onClick={() => handleUpdateStatus(selectedItem.id, 'قيد المعالجة', 'report')} variant="info">{currentText.statusTypes['قيد المعالجة']}</Button>}
                      {activeTab === 'reports' && selectedItem.status !== 'تم الحل' && <Button onClick={() => handleUpdateStatus(selectedItem.id, 'تم الحل', 'report')} variant="success"><CheckCircle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.statusTypes['تم الحل']}</Button>}
                      
                      {activeTab === 'suggestions' && selectedItem.status !== 'مقبول' && <Button onClick={() => handleUpdateStatus(selectedItem.id, 'مقبول', 'suggestion')} variant="success"><CheckCircle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.accept}</Button>}
                      {activeTab === 'suggestions' && selectedItem.status !== 'مرفوض' && <Button onClick={() => handleUpdateStatus(selectedItem.id, 'مرفوض', 'suggestion')} variant="destructive"><XCircle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.reject}</Button>}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            ) : (
              <motion.section 
                key="items-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="my-8"
              >
                <Card className="shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{currentText.itemId}</TableHead>
                          <TableHead className="min-w-[200px]">{currentText.description}</TableHead>
                          {activeTab === 'reports' && <TableHead>{currentText.location}</TableHead>}
                          <TableHead>{currentText.student}</TableHead>
                          {activeTab === 'suggestions' && <TableHead>{currentText.upvotes}</TableHead>}
                          <TableHead>{currentText.status}</TableHead>
                          <TableHead>{currentText.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itemsToDisplay.length > 0 ? itemsToDisplay.map(item => (
                          <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            {activeTab === 'reports' && <TableCell>{item.location}</TableCell>}
                            <TableCell>{item.user}</TableCell>
                            {activeTab === 'suggestions' && <TableCell>{item.upvotes}</TableCell>}
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(item.status)} className="whitespace-nowrap">
                               {getStatusIcon(item.status)}
                                {currentText.statusTypes[item.status] || item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="space-x-1 space-x-reverse whitespace-nowrap">
                              <Button variant="outline" size="sm" onClick={() => handleReviewItem(item)}><Eye className="h-4 w-4" /></Button>
                              {activeTab === 'reports' && item.status !== 'تم الحل' && <Button variant="success" size="sm" onClick={() => handleUpdateStatus(item.id, 'تم الحل', 'report')}><CheckCircle className="h-4 w-4" /></Button>}
                              {activeTab === 'suggestions' && item.status !== 'مقبول' && <Button variant="success" size="sm" onClick={() => handleUpdateStatus(item.id, 'مقبول', 'suggestion')}><CheckCircle className="h-4 w-4" /></Button>}
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={activeTab === 'reports' ? 6 : 6} className="text-center h-24">{currentText.noItemsFound}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      );
    };

    export default DepartmentalAdminDashboardPage;
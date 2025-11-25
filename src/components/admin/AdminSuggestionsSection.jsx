import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { motion, AnimatePresence } from 'framer-motion';
    import { Lightbulb, Eye, CheckCircle, XCircle, Save, ArrowLeft, Search, ThumbsUp, UserCircle, Building } from 'lucide-react';

    const AdminSuggestionsSection = ({ suggestions, setSuggestions, language, toast, departments }) => {
        const [selectedSuggestion, setSelectedSuggestion] = useState(null);
        const [adminComment, setAdminComment] = useState('');
        const [suggestionDepartment, setSuggestionDepartment] = useState('');
        const [searchTerm, setSearchTerm] = useState('');
        const [filterStatus, setFilterStatus] = useState('الكل');
        const [filterType, setFilterType] = useState('الكل');
        const [filterDepartment, setFilterDepartment] = useState('الكل');


        const textContent = {
            ar: {
                suggestionsList: "قائمة الاقتراحات",
                searchPlaceholder: "ابحث بالوصف، الطالب...",
                filterByStatus: "تصفية بالحالة",
                filterByType: "تصفية بالنوع",
                filterByDepartment: "تصفية بالقسم",
                all: "الكل",
                suggestionId: "المعرف",
                suggestionType: "نوع الاقتراح",
                description: "الوصف",
                upvotes: "التأييدات",
                student: "الطالب",
                department: "القسم المسؤول",
                status: "الحالة",
                actions: "الأفعال",
                review: "مراجعة",
                accept: "قبول",
                reject: "رفض",
                suggestionDetails: "تفاصيل الاقتراح",
                adminCommentLabel: "تعليق الإدارة",
                assignDepartmentLabel: "تعيين إلى قسم",
                selectDepartmentPlaceholder: "اختر القسم",
                saveComment: "حفظ التعليق والتغييرات",
                back: "عودة",
                noSuggestionsFound: "لم يتم العثور على اقتراحات تطابق معايير البحث.",
                suggestionUpdated: "تم تحديث حالة الاقتراح بنجاح.",
                commentSaved: "تم حفظ التعليق والتغييرات بنجاح.",
                statusTypes: { 'قيد المراجعة': 'قيد المراجعة', 'مقبول': 'مقبول', 'مرفوض': 'مرفوض' },
                suggestionTypesOptions: { 'حدث جامعي': 'حدث جامعي', 'توفير خدمة': 'توفير خدمة', 'طلب دورة تدريبية': 'طلب دورة تدريبية', 'أخرى': 'أخرى' },
            },
            fr: {
                suggestionsList: "Liste des Suggestions",
                searchPlaceholder: "Rechercher par description, étudiant...",
                filterByStatus: "Filtrer par statut",
                filterByType: "Filtrer par type",
                filterByDepartment: "Filtrer par département",
                all: "Tous",
                suggestionId: "ID",
                suggestionType: "Type",
                description: "Description",
                upvotes: "Soutiens",
                student: "Étudiant",
                department: "Département Assigné",
                status: "Statut",
                actions: "Actions",
                review: "Examiner",
                accept: "Accepter",
                reject: "Rejeter",
                suggestionDetails: "Détails de la Suggestion",
                adminCommentLabel: "Commentaire Admin",
                assignDepartmentLabel: "Assigner au département",
                selectDepartmentPlaceholder: "Choisir département",
                saveComment: "Enregistrer commentaire et changements",
                back: "Retour",
                noSuggestionsFound: "Aucune suggestion trouvée.",
                suggestionUpdated: "Statut de la suggestion mis à jour.",
                commentSaved: "Commentaire et changements enregistrés.",
                statusTypes: { 'قيد المراجعة': 'En attente', 'مقبول': 'Accepté', 'مرفوض': 'Rejeté' },
                suggestionTypesOptions: { 'حدث جامعي': 'Événement', 'توفير خدمة': 'Service', 'طلب دورة تدريبية': 'Formation', 'أخرى': 'Autre' },
            }
        };
        const currentText = textContent[language];

        const handleReviewSuggestion = (suggestion) => {
            setSelectedSuggestion(suggestion);
            setAdminComment(suggestion.adminComment || '');
            setSuggestionDepartment(suggestion.department || '');
        };

        const handleUpdateStatus = (suggestionId, newStatus) => {
            setSuggestions(prev => prev.map(s => s.id === suggestionId ? { ...s, status: newStatus } : s));
            toast({ title: currentText.suggestionUpdated });
            if (selectedSuggestion && selectedSuggestion.id === suggestionId) {
                setSelectedSuggestion(prev => ({ ...prev, status: newStatus }));
            }
        };
        
        const handleSaveDetails = () => {
            if (!selectedSuggestion) return;
            setSuggestions(prev => prev.map(s => s.id === selectedSuggestion.id ? { ...s, adminComment: adminComment, department: suggestionDepartment } : s));
            setSelectedSuggestion(prev => ({ ...prev, adminComment: adminComment, department: suggestionDepartment }));
            toast({ title: currentText.commentSaved });
        };

        const filteredSuggestions = suggestions.filter(suggestion => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = (
                (suggestion.description && suggestion.description.toLowerCase().includes(searchLower)) ||
                (suggestion.user && suggestion.user.toLowerCase().includes(searchLower)) ||
                (suggestion.id && suggestion.id.toString().includes(searchLower))
            );
            const matchesStatus = filterStatus === 'الكل' || suggestion.status === filterStatus;
            const matchesType = filterType === 'الكل' || suggestion.type === filterType;
            const matchesDepartment = filterDepartment === 'الكل' || suggestion.department === filterDepartment;
            return matchesSearch && matchesStatus && matchesType && matchesDepartment;
        }).sort((a,b) => b.upvotes - a.upvotes);
        
        const getStatusBadgeVariant = (status) => {
            if (status === 'مقبول') return 'success';
            if (status === 'مرفوض') return 'destructive';
            return 'default';
        };

        return (
            <AnimatePresence mode="wait">
            {selectedSuggestion ? (
              <motion.section
                key="suggestion-details"
                initial={{ opacity: 0, x: language === 'ar' ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: language === 'ar' ? -100 : 100 }}
                transition={{ duration: 0.3 }}
                className="my-8"
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center justify-between">
                      <span className="flex items-center"><Lightbulb className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-6 w-6 text-yellow-400`} />{currentText.suggestionDetails}</span>
                       <Button variant="ghost" size="icon" onClick={() => setSelectedSuggestion(null)}>
                        <ArrowLeft className="h-6 w-6" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p><strong>{currentText.suggestionId}:</strong> {selectedSuggestion.id}</p>
                    <p><strong>{currentText.suggestionType}:</strong> {currentText.suggestionTypesOptions[selectedSuggestion.type] || selectedSuggestion.type}</p>
                    <p><strong>{currentText.description}:</strong> {selectedSuggestion.description}</p>
                    <p><strong>{currentText.upvotes}:</strong> {selectedSuggestion.upvotes}</p>
                    <p><strong>{currentText.student}:</strong> {selectedSuggestion.user}</p>
                     <p><strong>{currentText.status}:</strong> 
                      <Badge variant={getStatusBadgeVariant(selectedSuggestion.status)} className="mx-2">
                        {currentText.statusTypes[selectedSuggestion.status] || selectedSuggestion.status}
                      </Badge>
                    </p>
                     <div>
                      <Label htmlFor="assignSuggestionDepartment">{currentText.assignDepartmentLabel}</Label>
                        <Select value={suggestionDepartment} onValueChange={setSuggestionDepartment} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <SelectTrigger id="assignSuggestionDepartment" className="mt-1">
                                <SelectValue placeholder={currentText.selectDepartmentPlaceholder} />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                      <Label htmlFor="adminCommentSuggestion">{currentText.adminCommentLabel}</Label>
                      <Input 
                        id="adminCommentSuggestion" 
                        value={adminComment} 
                        onChange={(e) => setAdminComment(e.target.value)}
                        placeholder={language === 'ar' ? "أضف تعليقًا..." : "Ajouter un commentaire..."}
                        className="min-h-[80px] mt-1"
                      />
                    </div>
                    <div className="flex space-x-2 space-x-reverse pt-4">
                      <Button onClick={handleSaveDetails}><Save className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.saveComment}</Button>
                      {selectedSuggestion.status !== 'مقبول' && <Button onClick={() => handleUpdateStatus(selectedSuggestion.id, 'مقبول')} variant="success"><CheckCircle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.accept}</Button>}
                      {selectedSuggestion.status !== 'مرفوض' && <Button onClick={() => handleUpdateStatus(selectedSuggestion.id, 'مرفوض')} variant="destructive"><XCircle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.reject}</Button>}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            ) : (
              <motion.section 
                key="suggestions-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="my-8"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <Lightbulb className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-6 w-6 text-yellow-400`} />
                  {currentText.suggestionsList}
                </h2>
                <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                    <Input 
                      type="text" 
                      placeholder={currentText.searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <SelectTrigger><SelectValue placeholder={currentText.filterByStatus} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الكل">{currentText.all}</SelectItem>
                      {Object.entries(currentText.statusTypes).map(([key, value]) => <SelectItem key={key} value={key}>{value}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <SelectTrigger><SelectValue placeholder={currentText.filterByType} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الكل">{currentText.all}</SelectItem>
                      {Object.entries(currentText.suggestionTypesOptions).map(([key, value]) => <SelectItem key={key} value={key}>{value}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <SelectTrigger><SelectValue placeholder={currentText.filterByDepartment} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الكل">{currentText.all}</SelectItem>
                      {departments.map(dept => <SelectItem key={dept} value={dept}>{dept}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <Card className="shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{currentText.suggestionId}</TableHead>
                          <TableHead>{currentText.suggestionType}</TableHead>
                          <TableHead className="min-w-[200px]">{currentText.description}</TableHead>
                          <TableHead><ThumbsUp className="h-4 w-4 inline-block" /> {currentText.upvotes}</TableHead>
                          <TableHead><UserCircle className="h-4 w-4 inline-block" /> {currentText.student}</TableHead>
                          <TableHead>{currentText.department}</TableHead>
                          <TableHead>{currentText.status}</TableHead>
                          <TableHead>{currentText.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSuggestions.length > 0 ? filteredSuggestions.map(suggestion => (
                          <TableRow key={suggestion.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell>{suggestion.id}</TableCell>
                            <TableCell>{currentText.suggestionTypesOptions[suggestion.type] || suggestion.type}</TableCell>
                            <TableCell>{suggestion.description}</TableCell>
                            <TableCell>{suggestion.upvotes}</TableCell>
                            <TableCell>{suggestion.user}</TableCell>
                             <TableCell>
                              {suggestion.department ? <Badge variant="outline" className="flex items-center gap-1"><Building size={12}/>{suggestion.department}</Badge> : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(suggestion.status)} className="whitespace-nowrap">
                                {currentText.statusTypes[suggestion.status] || suggestion.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="space-x-1 space-x-reverse whitespace-nowrap">
                              <Button variant="outline" size="sm" onClick={() => handleReviewSuggestion(suggestion)}><Eye className="h-4 w-4" /></Button>
                              {suggestion.status !== 'مقبول' && <Button variant="success" size="sm" onClick={() => handleUpdateStatus(suggestion.id, 'مقبول')}><CheckCircle className="h-4 w-4" /></Button>}
                              {suggestion.status !== 'مرفوض' && <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(suggestion.id, 'مرفوض')}><XCircle className="h-4 w-4" /></Button>}
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center h-24">{currentText.noSuggestionsFound}</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </motion.section>
            )}
          </AnimatePresence>
        );
    };
    export default AdminSuggestionsSection;
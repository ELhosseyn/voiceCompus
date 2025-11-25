import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { motion, AnimatePresence } from 'framer-motion';
    import { ListFilter, Eye, CheckCircle, XCircle, AlertTriangle, MessageSquare, Save, ArrowLeft, Search, ShieldAlert, ShieldCheck, ShieldX, Building } from 'lucide-react';

    const AdminReportsSection = ({ reports, setReports, language, toast, departments }) => {
        const [selectedReport, setSelectedReport] = useState(null);
        const [adminComment, setAdminComment] = useState('');
        const [reportDepartment, setReportDepartment] = useState('');
        const [searchTerm, setSearchTerm] = useState('');
        const [filterStatus, setFilterStatus] = useState('الكل');
        const [filterType, setFilterType] = useState('الكل');
        const [filterDepartment, setFilterDepartment] = useState('الكل');


        const textContent = {
            ar: {
                reportsList: "قائمة الإبلاغات",
                searchPlaceholder: "ابحث بالوصف، الموقع، الطالب...",
                filterByStatus: "تصفية بالحالة",
                filterByType: "تصفية بالنوع",
                filterByDepartment: "تصفية بالقسم",
                all: "الكل",
                reportId: "المعرف",
                problemCategory: "فئة المشكلة",
                description: "الوصف",
                location: "الموقع",
                department: "القسم المسؤول",
                status: "الحالة",
                student: "الطالب",
                actions: "الأفعال",
                review: "مراجعة",
                resolve: "حل",
                reject: "رفض",
                reportDetails: "تفاصيل الإبلاغ",
                credibility: "درجة المصداقية",
                adminCommentLabel: "تعليق الإدارة",
                assignDepartmentLabel: "تعيين إلى قسم",
                selectDepartmentPlaceholder: "اختر القسم",
                saveComment: "حفظ التعليق والتغييرات",
                back: "عودة",
                crisisAlerts: "تنبيهات الأزمات",
                viewDetails: "عرض التفاصيل",
                noReportsFound: "لم يتم العثور على إبلاغات تطابق معايير البحث.",
                reportUpdated: "تم تحديث حالة الإبلاغ بنجاح.",
                commentSaved: "تم حفظ التعليق والتغييرات بنجاح.",
                statusTypes: { 'قيد المراجعة': 'قيد المراجعة', 'محلولة': 'محلولة', 'مرفوضة': 'مرفوضة', 'مشبوهة': 'مشبوهة', 'قيد المعالجة': 'قيد المعالجة', 'تم الحل': 'تم الحل' },
                problemTypes: { 'جودة الحياة': 'جودة الحياة', 'وسائل النقل': 'وسائل النقل', 'أزمة': 'أزمة' },
            },
            fr: {
                reportsList: "Liste des Signalements",
                searchPlaceholder: "Rechercher par description, lieu, étudiant...",
                filterByStatus: "Filtrer par statut",
                filterByType: "Filtrer par type",
                filterByDepartment: "Filtrer par département",
                all: "Tous",
                reportId: "ID",
                problemCategory: "Catégorie",
                description: "Description",
                location: "Lieu",
                department: "Département Assigné",
                status: "Statut",
                student: "Étudiant",
                actions: "Actions",
                review: "Examiner",
                resolve: "Résoudre",
                reject: "Rejeter",
                reportDetails: "Détails du Signalement",
                credibility: "Crédibilité",
                adminCommentLabel: "Commentaire Admin",
                assignDepartmentLabel: "Assigner au département",
                selectDepartmentPlaceholder: "Choisir département",
                saveComment: "Enregistrer commentaire et changements",
                back: "Retour",
                crisisAlerts: "Alertes de Crise",
                viewDetails: "Voir Détails",
                noReportsFound: "Aucun signalement trouvé.",
                reportUpdated: "Statut du signalement mis à jour.",
                commentSaved: "Commentaire et changements enregistrés.",
                statusTypes: { 'قيد المراجعة': 'En attente', 'محلولة': 'Résolu', 'مرفوضة': 'Rejeté', 'مشبوهة': 'Suspect', 'قيد المعالجة': 'En traitement', 'تم الحل': 'Traité' },
                problemTypes: { 'جودة الحياة': 'Qualité de vie', 'وسائل النقل': 'Transport', 'أزمة': 'Crise' },
            }
        };
        const currentText = textContent[language];

        const handleReviewReport = (report) => {
            setSelectedReport(report);
            setAdminComment(report.adminComment || '');
            setReportDepartment(report.department || '');
        };

        const handleUpdateStatus = (reportId, newStatus) => {
            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
            toast({ title: currentText.reportUpdated });
            if (selectedReport && selectedReport.id === reportId) {
                setSelectedReport(prev => ({ ...prev, status: newStatus }));
            }
        };
        
        const handleSaveDetails = () => {
            if (!selectedReport) return;
            setReports(prev => prev.map(r => r.id === selectedReport.id ? { ...r, adminComment: adminComment, department: reportDepartment } : r));
            setSelectedReport(prev => ({ ...prev, adminComment: adminComment, department: reportDepartment }));
            toast({ title: currentText.commentSaved });
        };

        const filteredReports = reports.filter(report => {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = (
                (report.description && report.description.toLowerCase().includes(searchLower)) ||
                (report.location && report.location.toLowerCase().includes(searchLower)) ||
                (report.user && report.user.toLowerCase().includes(searchLower)) ||
                (report.id && report.id.toString().includes(searchLower))
            );
            const matchesStatus = filterStatus === 'الكل' || report.status === filterStatus;
            const matchesType = filterType === 'الكل' || report.type === filterType;
            const matchesDepartment = filterDepartment === 'الكل' || report.department === filterDepartment;
            return matchesSearch && matchesStatus && matchesType && matchesDepartment;
        }).sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        const crisisAlerts = reports.filter(r => r.isCrisis && r.status !== 'محلولة' && r.status !== 'تم الحل');

        const getStatusBadgeVariant = (status) => {
            if (status === 'محلولة' || status === 'تم الحل') return 'success';
            if (status === 'مرفوضة') return 'destructive';
            if (status === 'مشبوهة') return 'warning';
            if (status === 'قيد المعالجة') return 'info';
            return 'default';
        };
        
        const getStatusIcon = (status) => {
            if (status === 'محلولة' || status === 'تم الحل') return <ShieldCheck className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-green-500`} />;
            if (status === 'مرفوضة') return <ShieldX className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-red-500`} />;
            if (status === 'مشبوهة') return <ShieldAlert className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-yellow-500`} />;
            return <MessageSquare className={`h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-blue-500`} />;
        };

        return (
            <AnimatePresence mode="wait">
            {selectedReport ? (
              <motion.section
                key="report-details"
                initial={{ opacity: 0, x: language === 'ar' ? -100 : 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: language === 'ar' ? -100 : 100 }}
                transition={{ duration: 0.3 }}
                className="my-8"
              >
                <Card className="shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center justify-between">
                      <span>{currentText.reportDetails}</span>
                       <Button variant="ghost" size="icon" onClick={() => setSelectedReport(null)}>
                        <ArrowLeft className="h-6 w-6" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p><strong>{currentText.reportId}:</strong> {selectedReport.id}</p>
                    <p><strong>{currentText.problemCategory}:</strong> {currentText.problemTypes[selectedReport.type] || selectedReport.type}</p>
                    <p><strong>{currentText.description}:</strong> {selectedReport.description}</p>
                    <p><strong>{currentText.location}:</strong> {selectedReport.location}</p>
                    <p><strong>{currentText.student}:</strong> {selectedReport.user}</p>
                    <p><strong>{currentText.status}:</strong> 
                      <Badge variant={getStatusBadgeVariant(selectedReport.status)} className="mx-2">
                        {getStatusIcon(selectedReport.status)}
                        {currentText.statusTypes[selectedReport.status] || selectedReport.status}
                      </Badge>
                    </p>
                    <p><strong>{currentText.credibility}:</strong> {selectedReport.credibility}%</p>
                    <div>
                      <Label htmlFor="assignDepartment">{currentText.assignDepartmentLabel}</Label>
                        <Select value={reportDepartment} onValueChange={setReportDepartment} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                            <SelectTrigger id="assignDepartment" className="mt-1">
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
                      <Label htmlFor="adminComment">{currentText.adminCommentLabel}</Label>
                      <Input 
                        id="adminComment" 
                        value={adminComment} 
                        onChange={(e) => setAdminComment(e.target.value)}
                        placeholder={language === 'ar' ? "أضف تعليقًا..." : "Ajouter un commentaire..."}
                        className="min-h-[80px] mt-1"
                      />
                    </div>
                    <div className="flex space-x-2 space-x-reverse pt-4">
                      <Button onClick={handleSaveDetails}><Save className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.saveComment}</Button>
                      {selectedReport.status !== 'محلولة' && selectedReport.status !== 'تم الحل' && <Button onClick={() => handleUpdateStatus(selectedReport.id, 'محلولة')} variant="success"><CheckCircle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.resolve}</Button>}
                      {selectedReport.status !== 'مرفوضة' && <Button onClick={() => handleUpdateStatus(selectedReport.id, 'مرفوضة')} variant="destructive"><XCircle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />{currentText.reject}</Button>}
                    </div>
                  </CardContent>
                </Card>
              </motion.section>
            ) : (
              <motion.section 
                key="reports-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="my-8"
              >
                {crisisAlerts.length > 0 && (
                  <motion.section 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <h2 className="text-2xl font-semibold mb-4 flex items-center text-destructive">
                      <AlertTriangle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-6 w-6`} />
                      {currentText.crisisAlerts}
                    </h2>
                    <div className="space-y-4">
                      {crisisAlerts.map(alert => (
                        <Card key={alert.id} className="border-destructive border-2 bg-destructive/10">
                          <CardContent className="p-4">
                            <p className="font-semibold text-destructive">{alert.description}</p>
                            <p className="text-sm text-destructive/80">{alert.location} - {alert.user}</p>
                            <Button size="sm" variant="outline" className="mt-2 border-destructive text-destructive hover:bg-destructive/20" onClick={() => handleReviewReport(alert)}>
                              {currentText.viewDetails}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </motion.section>
                )}

                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <ListFilter className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-6 w-6 text-primary`} />
                  {currentText.reportsList}
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
                      {Object.entries(currentText.problemTypes).map(([key, value]) => <SelectItem key={key} value={key}>{value}</SelectItem>)}
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
                          <TableHead>{currentText.reportId}</TableHead>
                          <TableHead>{currentText.problemCategory}</TableHead>
                          <TableHead className="min-w-[200px]">{currentText.description}</TableHead>
                          <TableHead>{currentText.location}</TableHead>
                          <TableHead>{currentText.department}</TableHead>
                          <TableHead>{currentText.status}</TableHead>
                          <TableHead>{currentText.student}</TableHead>
                          <TableHead>{currentText.actions}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.length > 0 ? filteredReports.map(report => (
                          <TableRow key={report.id} className="hover:bg-muted/50 transition-colors">
                            <TableCell>{report.id}</TableCell>
                            <TableCell>{currentText.problemTypes[report.type] || report.type}</TableCell>
                            <TableCell>{report.description}</TableCell>
                            <TableCell>{report.location}</TableCell>
                            <TableCell>
                              {report.department ? <Badge variant="outline" className="flex items-center gap-1"><Building size={12}/>{report.department}</Badge> : '-'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={getStatusBadgeVariant(report.status)} className="whitespace-nowrap">
                                {getStatusIcon(report.status)}
                                {currentText.statusTypes[report.status] || report.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{report.user}</TableCell>
                            <TableCell className="space-x-1 space-x-reverse whitespace-nowrap">
                              <Button variant="outline" size="sm" onClick={() => handleReviewReport(report)}><Eye className="h-4 w-4" /></Button>
                              {(report.status !== 'محلولة' && report.status !== 'تم الحل') && <Button variant="success" size="sm" onClick={() => handleUpdateStatus(report.id, 'محلولة')}><CheckCircle className="h-4 w-4" /></Button>}
                              {report.status !== 'مرفوضة' && <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(report.id, 'مرفوضة')}><XCircle className="h-4 w-4" /></Button>}
                            </TableCell>
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center h-24">{currentText.noReportsFound}</TableCell>
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
    export default AdminReportsSection;
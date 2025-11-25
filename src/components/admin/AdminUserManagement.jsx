import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { motion } from 'framer-motion';
    import { Users, UserPlus, Trash2, Edit2, Search } from 'lucide-react';

    const AdminUserManagement = ({ users, setUsers, language, toast, departments }) => {
        const [newUserEmail, setNewUserEmail] = useState('');
        const [newUserRole, setNewUserRole] = useState('student');
        const [newUserDepartment, setNewUserDepartment] = useState('');
        const [editingUser, setEditingUser] = useState(null);
        const [searchTerm, setSearchTerm] = useState('');

        const textContent = {
            ar: {
                title: "إدارة المستخدمين",
                addUserTitle: "إضافة مستخدم جديد",
                editUserTitle: "تعديل المستخدم",
                emailLabel: "البريد الإلكتروني",
                emailPlaceholder: "user@example.com",
                roleLabel: "الدور",
                departmentLabel: "القسم (لمسؤول القسم)",
                selectDepartmentPlaceholder: "اختر القسم",
                addUserButton: "إضافة مستخدم",
                saveUserButton: "حفظ التعديلات",
                cancelEditButton: "إلغاء التعديل",
                currentUsersTitle: "المستخدمون الحاليون",
                searchPlaceholder: "ابحث بالبريد أو الدور...",
                role: "الدور",
                department: "القسم",
                actions: "الإجراءات",
                edit: "تعديل",
                delete: "حذف",
                userAdded: "تمت إضافة المستخدم بنجاح!",
                userUpdated: "تم تحديث المستخدم بنجاح!",
                userDeleted: "تم حذف المستخدم بنجاح!",
                errorFillFields: "يرجى ملء جميع الحقول المطلوبة.",
                errorUserExists: "هذا المستخدم (البريد الإلكتروني) موجود بالفعل.",
                noUsersFound: "لا يوجد مستخدمون يطابقون البحث.",
                roles: {
                    student: "طالب",
                    admin: "إدارة عامة",
                    department_admin: "مسؤول قسم",
                    service_team: "فريق خدمة",
                    student_representative: "ممثل طلاب",
                    faculty_staff: "عضو هيئة تدريس/موظف"
                }
            },
            fr: {
                title: "Gestion des utilisateurs",
                addUserTitle: "Ajouter un nouvel utilisateur",
                editUserTitle: "Modifier l'utilisateur",
                emailLabel: "Email",
                emailPlaceholder: "utilisateur@exemple.com",
                roleLabel: "Rôle",
                departmentLabel: "Département (pour Admin Département)",
                selectDepartmentPlaceholder: "Choisir département",
                addUserButton: "Ajouter utilisateur",
                saveUserButton: "Enregistrer les modifications",
                cancelEditButton: "Annuler la modification",
                currentUsersTitle: "Utilisateurs actuels",
                searchPlaceholder: "Rechercher par email ou rôle...",
                role: "Rôle",
                department: "Département",
                actions: "Actions",
                edit: "Modifier",
                delete: "Supprimer",
                userAdded: "Utilisateur ajouté avec succès !",
                userUpdated: "Utilisateur mis à jour avec succès !",
                userDeleted: "Utilisateur supprimé avec succès !",
                errorFillFields: "Veuillez remplir tous les champs requis.",
                errorUserExists: "Cet utilisateur (email) existe déjà.",
                noUsersFound: "Aucun utilisateur ne correspond à la recherche.",
                roles: {
                    student: "Étudiant",
                    admin: "Admin Général",
                    department_admin: "Admin Département",
                    service_team: "Équipe de Service",
                    student_representative: "Représentant Étudiant",
                    faculty_staff: "Personnel/Professeur"
                }
            }
        };
        const currentText = textContent[language];
        const availableRoles = currentText.roles;

        const handleAddOrUpdateUser = () => {
            if (!newUserEmail.trim()) {
                toast({ title: currentText.errorFillFields, variant: 'destructive' });
                return;
            }
            if (newUserRole === 'department_admin' && !newUserDepartment) {
                toast({ title: currentText.errorFillFields + " (" + currentText.departmentLabel + ")", variant: 'destructive' });
                return;
            }

            const userPayload = {
                email: newUserEmail.trim(),
                role: newUserRole,
                department: newUserRole === 'department_admin' ? newUserDepartment : null
            };

            if (editingUser) {
                if (users.some(user => user.email === userPayload.email && user.email !== editingUser.email)) {
                    toast({ title: currentText.errorUserExists, variant: 'destructive' });
                    return;
                }
                setUsers(prevUsers => prevUsers.map(user => user.email === editingUser.email ? userPayload : user));
                toast({ title: currentText.userUpdated });
                setEditingUser(null);
            } else {
                if (users.some(user => user.email === userPayload.email)) {
                    toast({ title: currentText.errorUserExists, variant: 'destructive' });
                    return;
                }
                setUsers(prevUsers => [...prevUsers, userPayload]);
                toast({ title: currentText.userAdded });
            }
            setNewUserEmail('');
            setNewUserRole('student');
            setNewUserDepartment('');
        };

        const handleEditUser = (userToEdit) => {
            setEditingUser(userToEdit);
            setNewUserEmail(userToEdit.email);
            setNewUserRole(userToEdit.role);
            setNewUserDepartment(userToEdit.department || '');
        };

        const handleDeleteUser = (emailToDelete) => {
            if (window.confirm(language === 'ar' ? `هل أنت متأكد أنك تريد حذف المستخدم ${emailToDelete}؟` : `Êtes-vous sûr de vouloir supprimer l'utilisateur ${emailToDelete} ?`)) {
                setUsers(prevUsers => prevUsers.filter(user => user.email !== emailToDelete));
                toast({ title: currentText.userDeleted });
            }
        };
        
        const cancelEditing = () => {
            setEditingUser(null);
            setNewUserEmail('');
            setNewUserRole('student');
            setNewUserDepartment('');
        };

        const filteredUsers = users.filter(user => {
            const searchLower = searchTerm.toLowerCase();
            return (
                user.email.toLowerCase().includes(searchLower) ||
                (availableRoles[user.role] && availableRoles[user.role].toLowerCase().includes(searchLower)) ||
                (user.department && user.department.toLowerCase().includes(searchLower))
            );
        });


        return (
            <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="my-8"
            >
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Users className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-6 w-6 text-primary`} />
                    {currentText.title}
                </h2>
                <Card className="shadow-lg mb-6">
                    <CardHeader>
                        <CardTitle className="text-xl flex items-center">
                            {editingUser ? <Edit2 className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-blue-500`} /> : <UserPlus className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-green-500`} />}
                            {editingUser ? currentText.editUserTitle : currentText.addUserTitle}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="newUserEmail">{currentText.emailLabel}</Label>
                            <Input 
                                id="newUserEmail" 
                                value={newUserEmail} 
                                onChange={(e) => setNewUserEmail(e.target.value)}
                                placeholder={currentText.emailPlaceholder}
                            />
                        </div>
                        <div>
                            <Label htmlFor="newUserRole">{currentText.roleLabel}</Label>
                            <Select value={newUserRole} onValueChange={setNewUserRole} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                <SelectTrigger id="newUserRole"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(availableRoles).map(([key, value]) => (
                                        <SelectItem key={key} value={key}>{value}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {newUserRole === 'department_admin' && (
                            <div>
                                <Label htmlFor="newUserDepartment">{currentText.departmentLabel}</Label>
                                <Select value={newUserDepartment} onValueChange={setNewUserDepartment} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                    <SelectTrigger id="newUserDepartment"><SelectValue placeholder={currentText.selectDepartmentPlaceholder} /></SelectTrigger>
                                    <SelectContent>
                                        {departments.map(dept => (
                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="flex space-x-2 space-x-reverse">
                            <Button onClick={handleAddOrUpdateUser} className={editingUser ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"}>
                                {editingUser ? currentText.saveUserButton : currentText.addUserButton}
                            </Button>
                            {editingUser && <Button variant="outline" onClick={cancelEditing}>{currentText.cancelEditButton}</Button>}
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{currentText.currentUsersTitle}</CardTitle>
                        <div className="relative mt-2">
                            <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground`} />
                            <Input
                                type="text"
                                placeholder={currentText.searchPlaceholder}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`${language === 'ar' ? 'pr-10' : 'pl-10'}`}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{currentText.emailLabel}</TableHead>
                                        <TableHead>{currentText.role}</TableHead>
                                        <TableHead>{currentText.department}</TableHead>
                                        <TableHead>{currentText.actions}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                                        <TableRow key={user.email}>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell><Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'department_admin' ? 'warning' : 'secondary'}>{availableRoles[user.role] || user.role}</Badge></TableCell>
                                            <TableCell>{user.department || '-'}</TableCell>
                                            <TableCell className="space-x-1 space-x-reverse">
                                                <Button variant="outline" size="icon" onClick={() => handleEditUser(user)}><Edit2 className="h-4 w-4" /></Button>
                                                <Button variant="destructive" size="icon" onClick={() => handleDeleteUser(user.email)}><Trash2 className="h-4 w-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center h-24">{currentText.noUsersFound}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </motion.section>
        );
    };

    export default AdminUserManagement;
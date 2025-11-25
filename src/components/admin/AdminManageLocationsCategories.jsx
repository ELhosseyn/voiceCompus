import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { PlusCircle, Trash2, MapPinned, ListChecks as ListChecksIcon } from 'lucide-react';
    import { motion } from 'framer-motion';

    const AdminManageLocationsCategories = ({ locations, setLocations, categories, setCategories, language, toast }) => {
        const [newLocation, setNewLocation] = useState('');
        const [newCategory, setNewCategory] = useState('');

        const textContent = {
            ar: {
                title: "إدارة الأماكن والأقسام",
                addLocationTitle: "إضافة مكان جديد",
                locationNameLabel: "اسم المكان",
                locationNamePlaceholder: "مثال: قاعة المحاضرات A",
                addLocationButton: "إضافة المكان",
                addCategoryTitle: "إضافة قسم مشكلة جديد",
                categoryNameLabel: "اسم القسم",
                categoryNamePlaceholder: "مثال: الصيانة",
                addCategoryButton: "إضافة القسم",
                currentLocationsTitle: "الأماكن الحالية",
                currentCategoriesTitle: "الأقسام الحالية",
                deleteButton: "حذف",
                itemAdded: "تمت الإضافة بنجاح!",
                itemDeleted: "تم الحذف بنجاح!",
                errorFillField: "يرجى ملء الحقل.",
                errorItemExists: "هذا العنصر موجود بالفعل.",
                noItems: "لا توجد عناصر مضافة."
            },
            fr: {
                title: "Gérer Lieux et Catégories",
                addLocationTitle: "Ajouter un nouveau lieu",
                locationNameLabel: "Nom du lieu",
                locationNamePlaceholder: "Ex: Salle de conférence A",
                addLocationButton: "Ajouter le lieu",
                addCategoryTitle: "Ajouter une nouvelle catégorie",
                categoryNameLabel: "Nom de la catégorie",
                categoryNamePlaceholder: "Ex: Maintenance",
                addCategoryButton: "Ajouter la catégorie",
                currentLocationsTitle: "Lieux actuels",
                currentCategoriesTitle: "Catégories actuelles",
                deleteButton: "Supprimer",
                itemAdded: "Ajouté avec succès !",
                itemDeleted: "Supprimé avec succès !",
                errorFillField: "Veuillez remplir le champ.",
                errorItemExists: "Cet élément existe déjà.",
                noItems: "Aucun élément ajouté."
            }
        };
        const currentText = textContent[language];

        const handleAddLocation = () => {
            if (!newLocation.trim()) {
                toast({ title: currentText.errorFillField, variant: 'destructive' });
                return;
            }
            if (locations.includes(newLocation.trim())) {
                toast({ title: currentText.errorItemExists, variant: 'destructive' });
                return;
            }
            setLocations(prev => [...prev, newLocation.trim()]);
            setNewLocation('');
            toast({ title: currentText.itemAdded });
        };

        const handleDeleteLocation = (locToDelete) => {
            setLocations(prev => prev.filter(loc => loc !== locToDelete));
            toast({ title: currentText.itemDeleted });
        };

        const handleAddCategory = () => {
            if (!newCategory.trim()) {
                toast({ title: currentText.errorFillField, variant: 'destructive' });
                return;
            }
            if (categories.includes(newCategory.trim())) {
                toast({ title: currentText.errorItemExists, variant: 'destructive' });
                return;
            }
            setCategories(prev => [...prev, newCategory.trim()]);
            setNewCategory('');
            toast({ title: currentText.itemAdded });
        };

        const handleDeleteCategory = (catToDelete) => {
            setCategories(prev => prev.filter(cat => cat !== catToDelete));
            toast({ title: currentText.itemDeleted });
        };

        return (
            <motion.section 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="my-8"
            >
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <MapPinned className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-6 w-6 text-primary`} />
                    {currentText.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Manage Locations */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center">
                                <PlusCircle className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-green-500`} />
                                {currentText.addLocationTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="newLocation">{currentText.locationNameLabel}</Label>
                                <Input 
                                    id="newLocation" 
                                    value={newLocation} 
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    placeholder={currentText.locationNamePlaceholder}
                                />
                            </div>
                            <Button onClick={handleAddLocation} className="w-full bg-green-600 hover:bg-green-700">
                                {currentText.addLocationButton}
                            </Button>
                            <h3 className="text-lg font-medium mt-6 mb-2">{currentText.currentLocationsTitle}</h3>
                            {locations.length > 0 ? (
                                <ul className="space-y-2 max-h-40 overflow-y-auto">
                                    {locations.map(loc => (
                                        <li key={loc} className="flex justify-between items-center p-2 border rounded-md">
                                            <span>{loc}</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteLocation(loc)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-muted-foreground">{currentText.noItems}</p>}
                        </CardContent>
                    </Card>

                    {/* Manage Categories */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center">
                                <ListChecksIcon className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-blue-500`} />
                                {currentText.addCategoryTitle}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 mb-4">
                                <Label htmlFor="newCategory">{currentText.categoryNameLabel}</Label>
                                <Input 
                                    id="newCategory" 
                                    value={newCategory} 
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    placeholder={currentText.categoryNamePlaceholder}
                                />
                            </div>
                            <Button onClick={handleAddCategory} className="w-full bg-blue-600 hover:bg-blue-700">
                                {currentText.addCategoryButton}
                            </Button>
                            <h3 className="text-lg font-medium mt-6 mb-2">{currentText.currentCategoriesTitle}</h3>
                             {categories.length > 0 ? (
                                <ul className="space-y-2 max-h-40 overflow-y-auto">
                                    {categories.map(cat => (
                                        <li key={cat} className="flex justify-between items-center p-2 border rounded-md">
                                            <span>{cat}</span>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(cat)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : <p className="text-sm text-muted-foreground">{currentText.noItems}</p>}
                        </CardContent>
                    </Card>
                </div>
            </motion.section>
        );
    };
    export default AdminManageLocationsCategories;
import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { LogIn, UserCog, KeyRound, Building, ArrowLeft } from 'lucide-react';
    import { motion } from 'framer-motion';

    const DepartmentalAdminLoginPage = ({ onLogin }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [department, setDepartment] = useState('');
      const navigate = useNavigate();
      const { toast } = useToast();

      const departments = ['المكتبة', 'النقل', 'الصيانة', 'الأمن', 'الأنشطة الطلابية', 'الإقامة الجامعية']; 

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.endsWith('@univ-saida.dz') && !email.endsWith('@dept.univ-saida.dz')) {
          toast({
            title: 'خطأ في البريد الإلكتروني',
            description: 'يرجى استخدام بريد جامعي صالح لمسؤول القسم.',
            variant: 'destructive',
          });
          return;
        }
        if (password.length < 6) {
          toast({
            title: 'خطأ في كلمة المرور',
            description: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
            variant: 'destructive',
          });
          return;
        }
        if (!department) {
            toast({
              title: 'خطأ في القسم',
              description: 'يرجى اختيار القسم المسؤول عنه.',
              variant: 'destructive',
            });
            return;
        }

        // Simulating successful login for departmental admin
        // In a real app, you'd verify credentials and department assignment from a backend
        if (email.startsWith('dept_') && password === 'deptpass123') {
            onLogin(email, false, 'department_admin', department);
            toast({
                title: 'تم تسجيل الدخول بنجاح',
                description: `مرحباً بك مسؤول قسم ${department}!`,
                variant: 'default',
            });
            navigate('/departmental-admin/dashboard');
        } else {
            toast({
                title: 'خطأ في تسجيل الدخول',
                description: 'بيانات الاعتماد أو القسم غير صحيحة.',
                variant: 'destructive',
            });
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                  className="mx-auto mb-4"
                >
                  <UserCog size={48} className="text-primary" />
                </motion.div>
                <CardTitle className="text-3xl font-bold">تسجيل دخول مسؤول القسم</CardTitle>
                <CardDescription>أدخل بياناتك للوصول إلى لوحة تحكم قسمك.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الجامعي للمسؤول</Label>
                    <div className="relative">
                      <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="dept_admin@dept.univ-saida.dz"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">كلمة المرور</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">القسم المسؤول عنه</Label>
                    <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Select value={department} onValueChange={setDepartment} dir="rtl">
                            <SelectTrigger id="department" className="pl-10">
                                <SelectValue placeholder="اختر القسم" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                    <LogIn className="mr-2 h-4 w-4" /> تسجيل الدخول
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-2">
                 <Button variant="link" className="text-sm text-primary hover:text-accent" onClick={() => navigate('/login')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> العودة لتسجيل دخول الطالب
                 </Button>
                <Button variant="link" className="text-sm text-primary hover:text-accent">
                  هل نسيت كلمة المرور؟
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default DepartmentalAdminLoginPage;
import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { LogIn, ShieldCheck as UserShield, KeyRound, Lightbulb, Map, ListChecks, ArrowLeft } from 'lucide-react';
    import { motion } from 'framer-motion';

    const AdminLoginPage = ({ onLogin }) => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const navigate = useNavigate();
      const { toast } = useToast();

      const handleSubmit = (e) => {
        e.preventDefault();
        if (username === 'admin' && password === 'password123') {
          onLogin(username, false, 'admin');
          toast({
            title: 'تم تسجيل الدخول بنجاح',
            description: 'مرحبًا بك في لوحة تحكم الإدارة!',
            variant: 'default',
          });
          navigate('/admin/dashboard');
        } else {
          toast({
            title: 'خطأ في تسجيل الدخول',
            description: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
            variant: 'destructive',
          });
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center p-4  bg-white">
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
                  <UserShield size={48} className="text-primary" />
                </motion.div>
                <CardTitle className="text-3xl font-bold">تسجيل الدخول للإدارة - CampusVoice</CardTitle>
                <CardDescription>أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">اسم المستخدم الإداري</Label>
                    <div className="relative">
                      <UserShield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="admin"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                    <LogIn className="mr-2 h-4 w-4" /> تسجيل الدخول
                  </Button>
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center">
                    <Lightbulb className="mr-1 h-4 w-4 text-yellow-400" />
                    يمكنك الآن مراجعة الاقتراحات 
                    <Map className="mx-1 h-4 w-4 text-green-400" />
                     وإدارة الأماكن 
                    <ListChecks className="mx-1 h-4 w-4 text-blue-400" />
                     والأقسام!
                  </p>
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

    export default AdminLoginPage;
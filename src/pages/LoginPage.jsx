import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { LogIn, Mail, Lock, UserX, Lightbulb, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import authService from '@/services/authService';

    const LoginPage = ({ onLogin }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [anonymousLogin, setAnonymousLogin] = useState(false);
      const navigate = useNavigate();
      const { toast } = useToast();

      const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (anonymousLogin) {
        // Handle anonymous login
        const response = await authService.login({ is_anonymous: true });
        onLogin(response.user, true, 'student');
        toast({
          title: 'تم تسجيل الدخول كمجهول',
          description: 'مرحبًا بك في CampusVoice!',
          variant: 'default',
        });
        navigate('/');
      } else {
        // Validate email and password
        if (!email.endsWith('@univ-saida.dz')) {
          toast({
            title: 'خطأ في تسجيل الدخول',
            description: 'يرجى استخدام بريد جامعي صالح (student@univ-saida.dz).',
            variant: 'destructive',
          });
          return;
        }
        if (password.length < 6) {
          toast({
            title: 'خطأ في تسجيل الدخول',
            description: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.',
            variant: 'destructive',
          });
          return;
        }
        
        // Handle regular login
        const response = await authService.login({ email, password });
        onLogin(response.user, false, response.user.role);
        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: `مرحبًا بك ${response.user.name}!`,
          variant: 'default',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'خطأ في تسجيل الدخول',
        description: error.response?.data?.message || 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.',
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
                  <LogIn size={48} className="text-primary" />
                </motion.div>
                <CardTitle className="text-3xl font-bold">تسجيل الدخول إلى CampusVoice</CardTitle>
                <CardDescription>أدخل بياناتك للوصول إلى حسابك أو سجل كمجهول.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {!anonymousLogin && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="email">البريد الجامعي</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="student@univ-saida.dz"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required={!anonymousLogin}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">كلمة المرور</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required={!anonymousLogin}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex items-center space-x-2 space-x-reverse dir-rtl">
                     <Checkbox
                        id="anonymousLogin"
                        checked={anonymousLogin}
                        onCheckedChange={setAnonymousLogin}
                      />
                    <Label htmlFor="anonymousLogin" className="cursor-pointer flex items-center">
                       <UserX className="ml-2 h-4 w-4" /> تسجيل الدخول كمجهول
                    </Label>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                    <LogIn className="mr-2 h-4 w-4" /> تسجيل الدخول
                  </Button>
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center">
                    <Lightbulb className="mr-1 h-4 w-4 text-yellow-400" />
                    يمكنك الاقتراح بتحسينات بعد تسجيل الدخول!
                  </p>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-2">
                <Button variant="link" className="text-sm text-primary hover:text-accent" onClick={() => navigate('/admin/login')}>
                  <Briefcase className="mr-2 h-4 w-4" /> تسجيل دخول الإدارة
                </Button>
                <Button variant="link" className="text-sm text-primary hover:text-accent" onClick={() => navigate('/departmental-admin/login')}>
                  <Briefcase className="mr-2 h-4 w-4" /> تسجيل دخول مسؤول القسم
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

    export default LoginPage;
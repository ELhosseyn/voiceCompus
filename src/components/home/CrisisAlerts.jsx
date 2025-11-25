import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { AlertTriangle, MapPin } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const CrisisAlerts = ({ crisisReports, currentText, language, timeSince }) => {
      if (crisisReports.length === 0) return null;

      return (
        <Card className="border-destructive border-2 shadow-xl bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center text-destructive">
              <AlertTriangle className={`h-6 w-6 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
              {currentText.crisisAlerts}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence>
              {crisisReports.map((report) => (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-md border border-destructive bg-destructive/5"
                >
                  <p className="font-semibold text-destructive">{report.description}</p>
                  <p className="text-sm text-destructive/80">
                    <MapPin className={`inline h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                    {report.location} - {timeSince(report.timestamp)}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      );
    };

    export default CrisisAlerts;
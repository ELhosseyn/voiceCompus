import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { ClipboardList, User, MapPin, MessageSquare as MessageSquareWarning, Trash2 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const ReportedProblems = ({ reports, currentText, language, theme, userEmail, isAnonymous, onDeleteReport, timeSince }) => {
      return (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <ClipboardList className={`h-6 w-6 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-primary`} />
              {currentText.reportedProblems}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
            {reports.length === 0 && (
              <p className="text-muted-foreground">{currentText.noProblems}</p>
            )}
            <AnimatePresence>
            {reports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
                className={`p-4 rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} shadow-sm`}
              >
                <div className="flex justify-between items-start">
                  <div>
                      <p className="font-semibold text-lg">{report.description}</p>
                      <p className="text-sm text-muted-foreground">
                      <MessageSquareWarning className={`inline h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-accent`} />
                      {report.type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                      <MapPin className={`inline h-4 w-4 ${language === 'ar' ? 'ml-1' : 'mr-1'} text-primary`} />
                      {report.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                      <User className={`inline h-3 w-3 ${language === 'ar' ? 'ml-1' : 'mr-1'}`} />
                      {report.user} - {timeSince(report.timestamp)}
                      </p>
                  </div>
                  {!isAnonymous && report.user === userEmail && (
                      <Button variant="ghost" size="icon" onClick={() => onDeleteReport(report.id)} aria-label={currentText.deleteReport}>
                          <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                  )}
                </div>
              </motion.div>
            ))}
            </AnimatePresence>
          </CardContent>
        </Card>
      );
    };

    export default ReportedProblems;
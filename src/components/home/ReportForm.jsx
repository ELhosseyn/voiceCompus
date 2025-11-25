import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { ListChecks, Send } from 'lucide-react';

    const ReportForm = ({ language, currentText, problemTypesOptions, locationsOptions, onSubmit, isAnonymous, toast }) => {
      const [problemType, setProblemType] = useState('');
      const [description, setDescription] = useState('');
      const [location, setLocation] = useState('');
      const [reportAnonymously, setReportAnonymously] = useState(false);

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!problemType || !description || !location) {
          toast({
            title: currentText.reportErrorTitle,
            description: currentText.reportErrorDesc,
            variant: 'destructive',
          });
          return;
        }
        onSubmit({ problemType, description, location, reportAnonymously });
        setProblemType('');
        setDescription('');
        setLocation('');
        setReportAnonymously(false);
      };

      return (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <ListChecks className={`h-6 w-6 ${language === 'ar' ? 'ml-2' : 'mr-2'} text-primary`} />
              {currentText.reportProblem}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="problemType">{currentText.problemTypeLabel}</Label>
                <Select value={problemType} onValueChange={setProblemType} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <SelectTrigger id="problemType">
                    <SelectValue placeholder={currentText.problemTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {problemTypesOptions.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">{currentText.descriptionLabel}</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder={currentText.descriptionPlaceholder}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="location">{currentText.locationLabel}</Label>
                <Select value={location} onValueChange={setLocation} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder={currentText.locationPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {locationsOptions.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="reportAnonymously"
                  checked={reportAnonymously}
                  onCheckedChange={setReportAnonymously}
                  disabled={isAnonymous}
                />
                <Label htmlFor="reportAnonymously" className="text-sm">
                  {currentText.reportAnonymouslyLabel}
                  {isAnonymous ? '' : <span className="text-xs text-muted-foreground"> ({currentText.anonymousNote})</span>}
                </Label>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity duration-300">
                <Send className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                {currentText.submitButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      );
    };

    export default ReportForm;
import React, { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Edit3, Send } from 'lucide-react';

    const SuggestionForm = ({ language, currentText, suggestionTypesOptions, onSubmit, toast }) => {
      const [suggestionType, setSuggestionType] = useState('');
      const [suggestionDescription, setSuggestionDescription] = useState('');

      const handleSubmit = (e) => {
        e.preventDefault();
        if (!suggestionType || !suggestionDescription) {
          toast({ title: currentText.errorFillFields, variant: 'destructive' });
          return;
        }
        onSubmit({ type: suggestionType, description: suggestionDescription });
        setSuggestionType('');
        setSuggestionDescription('');
      };

      return (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <Edit3 className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-primary`} />
              {currentText.submitSectionTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="suggestionType">{currentText.suggestionTypeLabel}</Label>
                <Select value={suggestionType} onValueChange={setSuggestionType} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <SelectTrigger id="suggestionType">
                    <SelectValue placeholder={currentText.suggestionTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {suggestionTypesOptions.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="suggestionDescription">{currentText.descriptionLabel}</Label>
                <Input
                  id="suggestionDescription"
                  type="text"
                  placeholder={currentText.descriptionPlaceholder}
                  value={suggestionDescription}
                  onChange={(e) => setSuggestionDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90">
                <Send className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                {currentText.submitButton}
              </Button>
            </form>
          </CardContent>
        </Card>
      );
    };

    export default SuggestionForm;
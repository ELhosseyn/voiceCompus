import React from 'react';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { CardTitle } from '@/components/ui/card';
    import { Lightbulb } from 'lucide-react';

    const SuggestionFilter = ({ language, currentText, filterType, setFilterType, suggestionTypesOptions }) => {
      return (
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle className="text-xl flex items-center">
            <Lightbulb className={`${language === 'ar' ? 'ml-2' : 'mr-2'} h-5 w-5 text-yellow-400`} />
            {currentText.submittedSuggestionsTitle}
          </CardTitle>
          <div className="w-full md:w-1/2">
              <Select value={filterType} onValueChange={setFilterType} dir={language === 'ar' ? 'rtl' : 'ltr'}>
                  <SelectTrigger>
                      <SelectValue placeholder={currentText.filterByTypeLabel} />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="الكل">{currentText.allTypes}</SelectItem>
                      {suggestionTypesOptions.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
          </div>
        </div>
      );
    };

    export default SuggestionFilter;
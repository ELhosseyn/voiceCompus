import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { ThumbsUp } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { timeSince } from '@/lib/utils';

    const SuggestionItem = ({ suggestion, language, currentText, theme, userEmail, isAnonymous, onSupportSuggestion }) => {
      const getStatusBadgeVariant = (status) => {
        if (status === 'مقبول') return 'success';
        if (status === 'مرفوض') return 'destructive';
        return 'default';
      };

      const hasVoted = Array.isArray(suggestion.voters) && suggestion.voters.includes(userEmail);
      const isOwner = suggestion.user === userEmail;

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
          className={`p-4 rounded-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} shadow-sm`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-md">{suggestion.description}</h4>
            <Badge variant={getStatusBadgeVariant(suggestion.status)}>{currentText.statusTypes[suggestion.status] || suggestion.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground mb-1">{currentText.suggestionTypeLabel}: {suggestion.type}</p>
          <p className="text-xs text-muted-foreground mb-3">
            {language === 'ar' ? 'مقدم من' : 'Soumis par'}: {suggestion.user} - {timeSince(suggestion.timestamp, language)}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-500">
              <ThumbsUp className="h-5 w-5 mr-1 ml-1" />
              <span>{suggestion.upvotes} {currentText.upvotes}</span>
            </div>
            <Button 
              size="sm" 
              variant={hasVoted || isOwner || isAnonymous ? "outline" : "default"}
              onClick={() => onSupportSuggestion(suggestion.id)}
              disabled={hasVoted || isOwner || isAnonymous}
              className={hasVoted || isOwner || isAnonymous ? "cursor-not-allowed opacity-70" : "bg-green-500 hover:bg-green-600 text-white"}
            >
              <ThumbsUp className={`${language === 'ar' ? 'ml-1' : 'mr-1'} h-4 w-4`} />
              {hasVoted ? currentText.alreadySupported : currentText.supportButton}
            </Button>
          </div>
        </motion.div>
      );
    };
    
    const SuggestionList = ({ suggestions, language, currentText, theme, userEmail, isAnonymous, onSupportSuggestion }) => {
      if (suggestions.length === 0) {
        return <p className="text-muted-foreground text-center py-4">{currentText.noSuggestions}</p>;
      }

      return (
        <AnimatePresence>
          {suggestions.map((suggestion, index) => (
            <SuggestionItem
              key={suggestion.id}
              suggestion={suggestion}
              language={language}
              currentText={currentText}
              theme={theme}
              userEmail={userEmail}
              isAnonymous={isAnonymous}
              onSupportSuggestion={onSupportSuggestion}
            />
          ))}
        </AnimatePresence>
      );
    };

    export default SuggestionList;
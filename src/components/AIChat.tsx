import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Trash2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAIChat } from '@/hooks/useAIChat';
import { RecommendationCard, FormattedMessage } from '@/components/chat/RecommendationCard';
import { cn } from '@/lib/utils';

interface AIChatProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export function AIChat({ isOpen: externalIsOpen, onToggle }: AIChatProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<{ label: string; prompt: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOpen = externalIsOpen ?? internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onToggle) {
      onToggle(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const { 
    messages, 
    isLoading, 
    sendMessage, 
    clearChat, 
    savedRecommendations 
  } = useAIChat();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue;
    setInputValue('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (prompt: string) => {
    setInputValue(prompt);
    textareaRef.current?.focus();
  };

  // Обновление вопросов после каждого сообщения пользователя
  useEffect(() => {
    // Анализируем всю историю переписки
    const allUserMessages = messages.filter(m => m.role === 'user').map(m => m.content.toLowerCase());
    const lastAssistantMessages = messages.filter(m => m.role === 'assistant').map(m => m.content.toLowerCase());
    const lastAssistant = lastAssistantMessages[lastAssistantMessages.length - 1] || '';
    const allUserText = allUserMessages.join(' ');
    
    const questions: { label: string; prompt: string }[] = [];
    
    // Анализируем тему на основе всех сообщений пользователя
    if (allUserText.includes('it') || allUserText.includes('программирование') || allUserText.includes('код') || allUserText.includes('разработк')) {
      questions.push({ label: 'Баллы для IT', prompt: 'Сколько баллов нужно для IT специальностей?' });
      questions.push({ label: 'Какие предметы?', prompt: 'Какие предметы нужны для поступления на IT?' });
      questions.push({ label: 'БГУИР или БГУ?', prompt: 'Что лучше - БГУИР или БГУ для программиста?' });
    }
    if (allUserText.includes('медицин') || allUserText.includes('врач') || allUserText.includes('лекар')) {
      questions.push({ label: 'Баллы для медицины', prompt: 'Сколько баллов нужно для поступления на медицину?' });
      questions.push({ label: 'Какие предметы?', prompt: 'Какие предметы нужно сдавать для медицинского?' });
      questions.push({ label: 'БГМУ или другие?', prompt: 'Где лучше учиться на врача - БГМУ или в другом вузе?' });
    }
    if (allUserText.includes('английск') || allUserText.includes('язык') || allUserText.includes('перевод')) {
      questions.push({ label: 'Языковые вузы', prompt: 'Куда можно поступить с английским языком?' });
      questions.push({ label: 'Переводчик', prompt: 'Какие есть специальности связанные с иностранными языками?' });
    }
    if (allUserText.includes('математик') || allUserText.includes('математика')) {
      questions.push({ label: 'Математика +', prompt: 'Куда можно поступить с математикой?' });
      questions.push({ label: 'Экономика', prompt: 'Какие экономические специальности с математикой?' });
    }
    if (allUserText.includes('биолог') || allUserText.includes('биология')) {
      questions.push({ label: 'Биология +', prompt: 'Куда можно поступить с биологией?' });
      questions.push({ label: 'Экология', prompt: 'Какие есть специальности связанные с биологией?' });
    }
    if (allUserText.includes('истори') || allUserText.includes('история')) {
      questions.push({ label: 'История +', prompt: 'Куда можно поступить с историей?' });
      questions.push({ label: 'Гуманитарные', prompt: 'Какие есть гуманитарные специальности?' });
    }
    if (allUserText.includes('балл')) {
      questions.push({ label: 'Баллы выше', prompt: 'А если у меня баллы выше?' });
      questions.push({ label: 'Баллы ниже', prompt: 'А если баллы ниже?' });
    }
    if (allUserText.includes('минск')) {
      questions.push({ label: 'Другой город', prompt: 'А какие есть варианты в другом городе?' });
    }
    if (allUserText.includes('бюджет') || allUserText.includes('бесплатн')) {
      questions.push({ label: 'Бюджет', prompt: 'Какие шансы поступить на бюджет?' });
    }
    if (allUserText.includes('платн')) {
      questions.push({ label: 'Платное', prompt: 'Какие есть платные варианты?' });
    }
    
    // Если вопросы не найдены - универсальные
    if (questions.length === 0) {
      questions.push({ label: 'Что ты посоветуешь?', prompt: 'Что ты можешь мне посоветовать исходя из моих данных?' });
      questions.push({ label: 'Другие варианты', prompt: 'Какие есть ещё варианты для меня?' });
      questions.push({ label: 'Уточнить', prompt: 'Расскажи подробнее о моих перспективах' });
    }
    
    // Обновляем вопросы после каждого сообщения
    if (messages.length > 0) {
      setSuggestedQuestions(questions.slice(0, 5));
    }
  }, [messages]);

  // Начальные вопросы для нового чата
  const initialQuestions = [
    { label: '320 баллов, IT', prompt: 'У меня 320 баллов, хочу в Минск на IT' },
    { label: 'Востребованные', prompt: 'Какие специальности сейчас самые востребованные?' },
    { label: 'БГУИР', prompt: 'Сколько баллов нужно для поступления в БГУИР?' },
    { label: '250 баллов', prompt: 'Куда можно поступить с 250 баллами?' },
    { label: 'Медицина', prompt: 'Где лучше всего учат на врача?' },
  ];

  // Показываем контекстные вопросы если есть история, иначе начальные
  const quickQuestions = suggestedQuestions.length > 0 ? suggestedQuestions : initialQuestions;

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-colors',
          'bg-primary text-primary-foreground hover:bg-primary/90',
          isOpen && 'hidden'
        )}
      >
        <Bot className="w-5 h-5" />
        <span className="font-medium hidden sm:inline">AI-Консультант</span>
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">
            !
          </span>
        )}
      </motion.button>

      {/* Chat Window - Full Height Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 w-full sm:w-[450px] h-screen bg-background shadow-2xl border-l flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-primary/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI-Консультант</h3>
                  <p className="text-xs text-muted-foreground">Помощь с выбором вуза</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHistory(!showHistory)}
                  className={cn("h-8", showHistory && "bg-primary/10")}
                >
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="h-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && !showHistory && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="font-medium mb-2">Привет!</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Я помогу выбрать университет и специальность. 
                    Расскажи о своих баллах, интересах и предпочтениях.
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Попробуй спросить:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {initialQuestions.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(q.prompt)}
                          className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors text-left max-w-[200px] truncate"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Recommendations Panel */}
              {showHistory && (
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    Сохраненные рекомендации
                  </h4>
                  {savedRecommendations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Пока нет сохраненных вариантов
                    </p>
                  ) : (
                    savedRecommendations.map((rec, i) => (
                      <RecommendationCard
                        key={i}
                        recommendation={rec}
                        isSaved={true}
                      />
                    ))
                  )}
                </div>
              )}

              {/* Messages */}
              {!showHistory && messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-2',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  )}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-md'
                      : 'bg-muted rounded-bl-md'
                  )}>
                    <FormattedMessage content={message.content} />
                    
                    {/* Recommendations from message */}
                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {message.recommendations.map((rec, i) => (
                          <RecommendationCard
                            key={i}
                            recommendation={rec}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Анализирую...</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {!showHistory && (
              <div className="p-4 border-t bg-muted/50 space-y-3">
                {/* Quick Question Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleQuickQuestion(q.prompt)}
                      className="text-xs px-2.5 py-1 rounded-md bg-secondary/70 hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите: '320 баллов, хочу на IT в Минск'..."
                    className="min-h-[60px] max-h-[120px] resize-none"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="shrink-0 h-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  AI может ошибаться. Проверяйте важную информацию на сайтах вузов.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

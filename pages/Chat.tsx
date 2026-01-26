import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Tables } from '../types/database';

type ChatMessage = Tables<'chat_messages'>;

// AI Response patterns for pearl/gemology assistant
const AI_RESPONSES: { keywords: string[]; responses: string[] }[] = [
  {
    keywords: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi'],
    responses: [
      'Bonjour! Como posso ajudá-la hoje com suas pérolas ou dúvidas sobre gemologia?',
      'Olá! É um prazer atendê-la. Em que posso auxiliar sobre o fascinante mundo das pérolas?',
      'Bem-vinda! Estou aqui para esclarecer suas dúvidas sobre pérolas e joias. Como posso servi-la?',
    ],
  },
  {
    keywords: ['south sea', 'mar do sul', 'dourada', 'golden'],
    responses: [
      'As pérolas South Sea são as maiores e mais valiosas do mundo! Cultivadas principalmente na Austrália, Filipinas e Indonésia, podem alcançar de 10 a 20mm. As douradas são especialmente raras e seu tom natural vem da ostra Pinctada maxima de lábio dourado. Posso ajudá-la a escolher uma peça específica?',
      'Excelente escolha! As South Sea douradas são verdadeiras joias de investimento. Seu lustre satinado único e tamanho impressionante as tornam ideais para peças statement. Em nosso catálogo, temos colares e brincos excepcionais com estas pérolas.',
    ],
  },
  {
    keywords: ['tahiti', 'negra', 'preta', 'peacock'],
    responses: [
      'As pérolas do Tahiti são conhecidas como "pérolas negras", mas na verdade apresentam uma fascinante gama de cores: cinza, verde, azul, e o famoso overtone peacock (pavão). São cultivadas na Polinésia Francesa e seu tom único vem da ostra de lábio negro. Gostaria de ver nossa coleção Tahiti?',
      'As pérolas taitianas são verdadeiramente únicas! Cada uma possui um overtone diferente - algumas refletem tons de verde, outras de roxo ou azul. O efeito "peacock" é o mais cobiçado, combinando verde e rosa. Temos peças incríveis em nossa boutique.',
    ],
  },
  {
    keywords: ['akoya', 'japonesa', 'clássica', 'tradicional'],
    responses: [
      'As pérolas Akoya são sinônimo de elegância clássica! Originárias do Japão, são conhecidas por seu lustre espelhado excepcional e formato perfeitamente redondo. Com tamanhos entre 6-9mm, são perfeitas para colares tradicionais e brincos atemporais. Nosso Conjunto Noiva Akoya é um bestseller!',
      'A pérola Akoya revolucionou a joalheria quando Mikimoto aperfeiçoou seu cultivo em 1893. São consideradas o padrão de qualidade em pérolas cultivadas. Seu lustre brilhante e superfície impecável as tornam perfeitas para qualquer ocasião.',
    ],
  },
  {
    keywords: ['freshwater', 'água doce', 'cultivada'],
    responses: [
      'As pérolas freshwater (água doce) são cultivadas principalmente na China e oferecem excelente custo-benefício. Apresentam uma variedade incrível de formas e cores naturais - branco, rosa, lavanda. São perfeitas para quem está começando sua coleção ou deseja peças mais acessíveis sem abrir mão da qualidade.',
    ],
  },
  {
    keywords: ['preço', 'valor', 'quanto custa', 'investimento', 'comprar'],
    responses: [
      'Os preços das pérolas variam conforme tipo, tamanho, lustre e qualidade. Em nossa boutique, temos desde pulseiras freshwater a partir de R$890 até colares South Sea que podem ultrapassar R$18.000. Posso ajudá-la a encontrar a peça perfeita dentro do seu orçamento?',
      'Investir em pérolas de qualidade é sempre uma decisão acertada - elas tendem a valorizar com o tempo. Recomendo focar em lustre e superfície ao invés de apenas tamanho. Gostaria que eu explicasse os critérios de avaliação?',
    ],
  },
  {
    keywords: ['cuidar', 'limpar', 'guardar', 'manutenção', 'conservar'],
    responses: [
      'Ótima pergunta! As pérolas são orgânicas e requerem cuidados especiais:\n\n• Vista-as por último e tire-as primeiro\n• Evite contato com perfumes e cosméticos\n• Limpe com pano macio úmido após o uso\n• Guarde separadas de outras joias\n• Use-as regularmente - a umidade da pele preserva seu lustre\n\nTemos um Kit Care Deluxe em nossa loja que é perfeito para manutenção!',
    ],
  },
  {
    keywords: ['autêntica', 'verdadeira', 'falsa', 'identificar', 'original'],
    responses: [
      'Para identificar pérolas autênticas, existem alguns testes simples:\n\n• Teste do dente: pérolas reais têm textura levemente arenosa\n• Peso: pérolas naturais são mais pesadas que imitações\n• Temperatura: pérolas reais são frias ao toque inicial\n• Lustre: observe reflexos profundos, não apenas superficiais\n\nTodas as nossas pérolas vêm com certificado de autenticidade!',
    ],
  },
  {
    keywords: ['curso', 'aprender', 'estudar', 'gemologia'],
    responses: [
      'Temos uma Academia completa para quem deseja aprofundar seus conhecimentos! Oferecemos desde o curso gratuito "Introdução ao Mundo das Pérolas" até masterclasses avançadas sobre avaliação e investimento. Posso recomendar um curso específico baseado no seu nível de conhecimento?',
    ],
  },
  {
    keywords: ['ebook', 'livro', 'leitura', 'guia'],
    responses: [
      'Nossa Biblioteca digital conta com e-books exclusivos! Recomendo começar pelo "Guia Completo das Pérolas" (gratuito) e depois avançar para títulos especializados como "South Sea Pearls: O Guia do Investidor". Posso enviar o link da nossa biblioteca?',
    ],
  },
  {
    keywords: ['presente', 'noiva', 'casamento', 'aniversário'],
    responses: [
      'Pérolas são presentes atemporais e significativos! Para noivas, nosso Conjunto Noiva Akoya é perfeito - inclui colar, brincos e pulseira combinando. Para aniversários, brincos studs são clássicos infalíveis. Todas as nossas peças vêm em embalagem premium para presente. Posso sugerir opções específicas?',
    ],
  },
];

const DEFAULT_RESPONSES = [
  'Que interessante! Pode me contar mais sobre o que procura? Estou aqui para ajudá-la a encontrar a pérola perfeita.',
  'Entendo! Se tiver dúvidas sobre tipos de pérolas, cuidados, ou nossas coleções, ficarei feliz em esclarecer.',
  'Obrigada por compartilhar! Posso ajudá-la com informações sobre South Sea, Tahiti, Akoya ou qualquer outro tipo de pérola. O que gostaria de saber?',
];

const WELCOME_MESSAGE = 'Bonjour, Madame. Sou San, sua consultora de gemologia pessoal.\n\nPosso ajudá-la a escolher pérolas, explicar sobre tipos e qualidades, ou sugerir peças da nossa coleção. Como posso servi-la hoje?';

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length === 0) {
        // Send welcome message for new users
        await sendWelcomeMessage();
      } else {
        setMessages(data || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendWelcomeMessage = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: WELCOME_MESSAGE,
          is_from_user: false,
        })
        .select()
        .single();

      if (!error && data) {
        setMessages([data]);
      }
    } catch (error) {
      console.error('Error sending welcome message:', error);
    }
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    for (const pattern of AI_RESPONSES) {
      if (pattern.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return pattern.responses[Math.floor(Math.random() * pattern.responses.length)];
      }
    }

    return DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !user || sending) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setSending(true);

    try {
      // Save user message
      const { data: userMsgData, error: userMsgError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: userMessage,
          is_from_user: true,
        })
        .select()
        .single();

      if (userMsgError) throw userMsgError;

      if (userMsgData) {
        setMessages(prev => [...prev, userMsgData]);
      }

      // Simulate AI typing
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate and save AI response
      const aiResponse = generateAIResponse(userMessage);

      const { data: aiMsgData, error: aiMsgError } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          message: aiResponse,
          is_from_user: false,
        })
        .select()
        .single();

      setIsTyping(false);

      if (aiMsgError) throw aiMsgError;

      if (aiMsgData) {
        setMessages(prev => [...prev, aiMsgData]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    } finally {
      setSending(false);
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    if (!confirm('Deseja limpar todo o histórico de conversas?')) return;

    try {
      await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', user.id);

      setMessages([]);
      await sendWelcomeMessage();
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = message.created_at ? new Date(message.created_at).toDateString() : 'unknown';
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-serif">Iniciando conversa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark pb-40">
      <header className="fixed top-0 w-full z-30 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-stone-200 dark:border-white/5 pt-2">
        <div className="flex items-center px-6 py-4 justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-8 h-8 -ml-2 rounded-full text-stone-900 dark:text-white hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[24px] font-light">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <h1 className="text-lg font-display font-medium tracking-wide text-stone-900 dark:text-white">San IA</h1>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 dark:text-stone-400">
                  {isTyping ? 'Digitando...' : 'Online'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={clearHistory}
            className="text-stone-900 dark:text-white hover:text-primary transition-colors"
            title="Limpar histórico"
          >
            <span className="material-symbols-outlined text-[24px] font-light">delete_sweep</span>
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pt-24 pb-4">
        <div className="flex flex-col gap-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <React.Fragment key={date}>
              {/* Date Separator */}
              <div className="flex justify-center">
                <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.2em] opacity-60">
                  {formatDate(dateMessages[0]?.created_at || null)}
                </span>
              </div>

              {/* Messages */}
              {dateMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_from_user ? 'items-end justify-end' : 'items-start'} gap-3 animate-fade`}
                >
                  {!message.is_from_user && (
                    <div className="flex-shrink-0 h-10 w-10 rounded-full border border-primary/30 p-0.5 shadow-lg shadow-primary/10">
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-[#AA8C2C] flex items-center justify-center text-black">
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                      </div>
                    </div>
                  )}

                  <div className={`flex flex-col gap-1 max-w-[80%] ${message.is_from_user ? 'items-end' : ''}`}>
                    {!message.is_from_user && (
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest ml-1">San IA</span>
                    )}
                    <div
                      className={`p-4 ${
                        message.is_from_user
                          ? 'bg-stone-100 dark:bg-white/5 rounded-tl-xl rounded-tr-xl rounded-bl-xl border border-stone-200 dark:border-white/5'
                          : 'bg-white dark:bg-[#121212] rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-stone-100 dark:border-white/5'
                      }`}
                    >
                      <p className="text-sm font-serif text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
                        {message.message}
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mx-1">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </React.Fragment>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start gap-3 animate-fade">
              <div className="flex-shrink-0 h-10 w-10 rounded-full border border-primary/30 p-0.5 shadow-lg shadow-primary/10">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-primary to-[#AA8C2C] flex items-center justify-center text-black">
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest ml-1">San IA</span>
                <div className="bg-white dark:bg-[#121212] p-4 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-stone-100 dark:border-white/5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-stone-200 dark:border-white/5 px-4 pt-4 pb-[100px]">
        <div className="mx-auto w-full max-w-2xl">
          <form onSubmit={handleSendMessage} className="relative flex items-end gap-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                className="w-full h-12 rounded-full border border-stone-200 dark:border-white/10 bg-white/50 dark:bg-white/5 pl-6 pr-14 text-sm font-serif text-stone-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all disabled:opacity-50"
                placeholder="Escreva sua mensagem..."
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || sending}
                className="absolute right-2 top-2 bottom-2 flex w-8 items-center justify-center rounded-full text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">send</span>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Chat;

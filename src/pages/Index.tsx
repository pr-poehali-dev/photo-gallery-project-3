import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface Story {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  author: string;
}

interface Comment {
  id: number;
  story_id: number;
  author: string;
  text: string;
  date: string;
}

const API_URL = 'https://functions.poehali.dev/f24dfa88-335e-491a-a60c-366e73a26a46';

const Index = () => {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState({ author: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const stories: Story[] = [
    {
      id: 1,
      title: 'Горные вершины',
      description: 'Путешествие в край туманных гор и золотого света. История о поиске гармонии между человеком и природой.',
      image: 'https://cdn.poehali.dev/projects/2d8dcf90-fb28-418d-8c01-733e7569d5ed/files/8642e5d6-887c-41e1-b3a2-614eed62b5d3.jpg',
      date: '15 октября 2024',
      author: 'Александра Иванова'
    },
    {
      id: 2,
      title: 'Ночной город',
      description: 'Улицы мегаполиса оживают после заката. Неоновые огни, отражения в лужах и истории незнакомцев.',
      image: 'https://cdn.poehali.dev/projects/2d8dcf90-fb28-418d-8c01-733e7569d5ed/files/1f0d8eb6-9b99-4e64-8b10-46f0b3e0ed75.jpg',
      date: '18 октября 2024',
      author: 'Дмитрий Смирнов'
    },
    {
      id: 3,
      title: 'Портрет эпохи',
      description: 'Минималистичная черно-белая фотография, раскрывающая внутренний мир через игру света и тени.',
      image: 'https://cdn.poehali.dev/projects/2d8dcf90-fb28-418d-8c01-733e7569d5ed/files/7bacaf50-1ecf-449b-b986-a311a7d28277.jpg',
      date: '20 октября 2024',
      author: 'Елена Петрова'
    }
  ];

  const handleAddComment = async (storyId: number) => {
    if (!newComment.author.trim() || !newComment.text.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story_id: storyId,
          author: newComment.author,
          text: newComment.text
        })
      });
      
      if (response.ok) {
        await fetchComments();
        setNewComment({ author: '', text: '' });
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStoryComments = (storyId: number) => {
    return comments.filter(c => c.story_id === storyId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Визуальные истории</h1>
            <nav className="flex gap-6">
              <a href="#stories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Истории
              </a>
              <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                О проекте
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-16 text-center max-w-3xl mx-auto animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-light mb-4">
            Журнал фотографий
          </h2>
          <p className="text-lg text-muted-foreground">
            Коллекция визуальных историй со всего мира. Оставляйте комментарии и делитесь впечатлениями.
          </p>
        </div>

        <div id="stories" className="grid gap-16">
          {stories.map((story, index) => (
            <Card 
              key={story.id} 
              className="overflow-hidden border-0 shadow-none animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`grid ${index % 2 === 0 ? 'md:grid-cols-[1.5fr,1fr]' : 'md:grid-cols-[1fr,1.5fr]'} gap-8`}>
                <div className={`${index % 2 === 0 ? 'order-1' : 'order-2'}`}>
                  <div className="aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer">
                    <img 
                      src={story.image} 
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                
                <CardContent className={`${index % 2 === 0 ? 'order-2' : 'order-1'} p-6 md:p-8 flex flex-col justify-center`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{story.date}</span>
                      <span>•</span>
                      <span>{story.author}</span>
                    </div>
                    
                    <h3 className="text-4xl font-semibold tracking-tight">
                      {story.title}
                    </h3>
                    
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {story.description}
                    </p>

                    <Button
                      variant="ghost"
                      onClick={() => setSelectedStory(selectedStory === story.id ? null : story.id)}
                      className="w-full justify-between group mt-6"
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="MessageCircle" size={18} />
                        Комментарии ({getStoryComments(story.id).length})
                      </span>
                      <Icon 
                        name={selectedStory === story.id ? "ChevronUp" : "ChevronDown"} 
                        size={18}
                        className="transition-transform"
                      />
                    </Button>

                    {selectedStory === story.id && (
                      <div className="space-y-4 mt-6 pt-6 border-t border-border animate-accordion-down">
                        <div className="space-y-3">
                          {getStoryComments(story.id).map((comment) => (
                            <div key={comment.id} className="bg-muted/50 rounded-lg p-4 animate-scale-in">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon name="User" size={14} className="text-primary" />
                                <span className="font-medium text-sm">{comment.author}</span>
                                <span className="text-xs text-muted-foreground">• {comment.date}</span>
                              </div>
                              <p className="text-sm leading-relaxed">{comment.text}</p>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-3 pt-4">
                          <Input
                            placeholder="Ваше имя"
                            value={newComment.author}
                            onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                          />
                          <Textarea
                            placeholder="Поделитесь впечатлениями..."
                            value={newComment.text}
                            onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                            rows={3}
                          />
                          <Button 
                            onClick={() => handleAddComment(story.id)}
                            className="w-full"
                            disabled={loading || !newComment.author.trim() || !newComment.text.trim()}
                          >
                            <Icon name="Send" size={16} className="mr-2" />
                            {loading ? 'Отправка...' : 'Отправить'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t border-border mt-24 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Визуальные истории. Создано с любовью к фотографии.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
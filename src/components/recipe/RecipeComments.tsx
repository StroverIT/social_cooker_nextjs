import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';

interface RecipeCommentsProps {
  recipeId: string;
  comments: Comment[];
}

export function RecipeComments({ recipeId, comments }: RecipeCommentsProps) {
  const { user, addComment } = useApp();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newComment.trim() || !user) return;
    
    setIsSubmitting(true);
    addComment(recipeId, {
      userId: user.id,
      userName: user.gender === 'male' ? 'Потребител' : 'Потребителка',
      text: newComment.trim(),
    });
    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <section className="mt-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-muted-foreground" />
        <h2 className="font-display text-lg font-semibold text-foreground">
          Коментари ({comments.length})
        </h2>
      </div>

      {/* Add Comment Form */}
      {user && (
        <div className="bg-card rounded-xl p-4 border border-border mb-4">
          <Textarea
            placeholder="Споделете вашия опит с тази рецепта..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-3 resize-none"
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            disabled={!newComment.trim() || isSubmitting}
            size="sm"
            className="gradient-primary text-primary-foreground border-0"
          >
            <Send className="w-4 h-4 mr-2" />
            Изпрати
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Все още няма коментари. Бъдете първи!
          </p>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card rounded-xl p-4 border border-border"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm text-foreground">{comment.userName}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: bg })}
                  </p>
                </div>
              </div>
              <p className="text-foreground text-sm">{comment.text}</p>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

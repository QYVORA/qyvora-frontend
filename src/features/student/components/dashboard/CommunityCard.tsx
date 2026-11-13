import { useCallback, useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useToast } from '@/core/contexts/ToastContext';
import api from '@/core/services/api';
import { Card } from '@/shared/components/ui';
import Button from '@/shared/components/ui/Button';
import { BrandWhatsAppIcon } from '@/shared/components/icons';
import { SOCIAL_LINKS } from '@/shared/components/layout/socialLinks';

interface CommunityStudent {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  cpPoints: number;
}

interface CommunityPayload {
  feed: Array<{
    id: string;
    user: CommunityStudent;
    message: string;
    createdAt: string;
  }>;
  suggestions: CommunityStudent[];
  followingCount: number;
  followerCount: number;
}

type Relationship = 'following' | 'followers';

const CommunityCard = () => {
  const { addToast } = useToast();
  const community = SOCIAL_LINKS.find((link) => link.key === 'whatsapp');
  const [data, setData] = useState<CommunityPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState('');
  const [error, setError] = useState('');
  const [relationship, setRelationship] = useState<Relationship | null>(null);
  const [relationshipItems, setRelationshipItems] = useState<CommunityStudent[]>([]);
  const [followedIds, setFollowedIds] = useState<Set<string>>(() => new Set());

  const loadCommunity = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<CommunityPayload>('/student/community');
      setData(response.data);
      setError('');
    } catch {
      setError('Community activity is unavailable right now.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCommunity();
  }, [loadCommunity]);

  const follow = async (student: CommunityStudent) => {
    if (loadingId || followedIds.has(student.id)) return;
    setLoadingId(student.id);
    try {
      await api.post(`/student/community/${encodeURIComponent(student.id)}/follow`);
      // Optimistic update: keep the suggestion visible in a "Following" state
      // instead of refetching (which made the whole list disappear).
      setFollowedIds((ids) => new Set(ids).add(student.id));
      setData((current) =>
        current ? { ...current, followingCount: current.followingCount + 1 } : current,
      );
      setRelationshipItems((items) =>
        relationship === 'following'
          ? [student, ...items.filter((item) => item.id !== student.id)]
          : items,
      );
      addToast(`Now following ${student.handle ? `@${student.handle}` : student.name}.`, 'success');
    } catch {
      addToast('Could not follow this operator.', 'error');
    } finally {
      setLoadingId('');
    }
  };

  const showRelationship = async (next: Relationship) => {
    if (relationship === next) {
      setRelationship(null);
      return;
    }
    try {
      const response = await api.get<{ items: CommunityStudent[] }>(`/student/community/${next}`);
      setRelationshipItems(response.data.items || []);
      setRelationship(next);
    } catch {
      addToast(`Could not load ${next}.`, 'error');
    }
  };

  const unfollow = async (student: CommunityStudent) => {
    try {
      await api.delete(`/student/community/${encodeURIComponent(student.id)}/follow`);
      setRelationshipItems((items) => items.filter((item) => item.id !== student.id));
      setFollowedIds((ids) => {
        const next = new Set(ids);
        next.delete(student.id);
        return next;
      });
      setData((current) =>
        current
          ? { ...current, followingCount: Math.max(0, current.followingCount - 1) }
          : current,
      );
      addToast(`Unfollowed ${student.handle ? `@${student.handle}` : student.name}.`, 'success');
    } catch {
      addToast('Could not unfollow this operator.', 'error');
    }
  };

  return (
    <Card as="section" className="p-5 md:p-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center text-accent">
          <Users className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="type-h2 text-text-primary">
            Community
          </h2>
          <p className="type-meta mt-0.5">
            {loading && !data
              ? 'Loading community…'
              : error && !data
                ? 'Community unavailable'
                : `${data?.followingCount ?? 0} following · ${data?.followerCount ?? 0} followers`}
          </p>
        </div>
      </div>

      {loading && !data && (
        <p role="status" className="type-body-sm text-text-secondary">Loading community activity…</p>
      )}
      {data && (
        <div className="mb-3 flex gap-2">
          <Button
            size="sm"
            variant={relationship === 'following' ? 'secondary' : 'ghost'}
            onClick={() => void showRelationship('following')}
          >
            Following
          </Button>
          <Button
            size="sm"
            variant={relationship === 'followers' ? 'secondary' : 'ghost'}
            onClick={() => void showRelationship('followers')}
          >
            Followers
          </Button>
        </div>
      )}
      {relationship && (
        <div className="mb-4 space-y-2 border-t border-border-subtle pt-3">
          {relationshipItems.map((student) => (
            <div key={student.id} className="flex items-center justify-between gap-3">
              <p className="truncate type-body-sm font-bold text-text-primary">
                {student.handle ? `@${student.handle}` : student.name}
              </p>
              {relationship === 'following' && (
                <Button size="sm" variant="ghost" onClick={() => void unfollow(student)}>
                  Unfollow
                </Button>
              )}
            </div>
          ))}
          {relationshipItems.length === 0 && (
            <p className="type-body-sm text-text-muted">
              {relationship === 'following' ? 'You are not following anyone yet.' : 'No followers yet.'}
            </p>
          )}
        </div>
      )}

      {error && !data ? (
        <p className="type-body-sm text-semantic-danger" role="status">{error}</p>
      ) : data ? (
        <>
          {error && (
            <p className="mb-3 type-meta text-semantic-danger" role="status">
              Community could not be refreshed; showing the last loaded activity.
            </p>
          )}
          <div className="space-y-3" aria-live="polite">
            {data?.feed.slice(0, 3).map((activity) => (
              <div key={activity.id} className="border-t border-border-subtle pt-3">
                <p className="type-body-sm text-text-secondary">
                  <span className="font-bold text-text-primary">
                    {activity.user.handle ? `@${activity.user.handle}` : activity.user.name}
                  </span>{' '}
                  {activity.message}
                </p>
                <p className="type-meta mt-1">
                  {new Date(activity.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
            {data && data.feed.length === 0 && (
              <p className="type-body-sm border-t border-border-subtle pt-3 text-text-muted">
                New learning activity will appear here.
              </p>
            )}
          </div>

          {!!data?.suggestions.length && (
            <div className="mt-4 border-t border-border-subtle pt-4">
              <h3 className="type-label mb-3 text-text-muted">
                Suggested operators
              </h3>
              <div className="space-y-2">
                {data.suggestions.slice(0, 3).map((student) => {
                  const followed = followedIds.has(student.id);
                  return (
                    <div key={student.id} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate type-body-sm font-bold text-text-primary">
                          {student.handle ? `@${student.handle}` : student.name}
                        </p>
                        <p className="type-meta">{student.cpPoints.toLocaleString()} CP</p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        loading={loadingId === student.id}
                        disabled={followed}
                        onClick={() => void follow(student)}
                      >
                        {followed ? 'Following' : 'Follow'}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : null}

      {community && (
        <Button
          href={community.href}
          external
          variant="secondary"
          size="sm"
          icon={<BrandWhatsAppIcon className="h-4 w-4" />}
          className="mt-4"
        >
          Open community channel
        </Button>
      )}
    </Card>
  );
};

export default CommunityCard;

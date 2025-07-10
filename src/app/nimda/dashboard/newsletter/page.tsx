'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Mail, Users, Send, Eye, TrendingUp, Calendar, CheckCircle } from 'lucide-react';

interface Newsletter {
  id: string;
  subject: string;
  content: string;
  sent_at: string;
  recipient_count: number;
}

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  active: boolean;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  
  const [newNewsletter, setNewNewsletter] = useState({
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const supabase = createClient();
    try {
      const [subscribersRes, campaignsRes] = await Promise.all([
        supabase.from('subscribers').select('*').order('subscribed_at', { ascending: false }),
        supabase.from('campaigns').select('*').order('sent_at', { ascending: false })
      ]);

      if (subscribersRes.error) throw subscribersRes.error;
      if (campaignsRes.error) throw campaignsRes.error;

      setSubscribers(subscribersRes.data || []);
      setCampaigns(campaignsRes.data || []);
    } catch (error) {
      console.error('Error fetching newsletter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendNewsletter = async () => {
    // TODO: This needs to be implemented as a Supabase Edge Function
    // as it involves sending emails, which is a server-side action.
    if (!newNewsletter.subject.trim() || !newNewsletter.content.trim()) {
      alert('Please fill in both subject and content');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          subject: newNewsletter.subject,
          content: newNewsletter.content
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        setNewNewsletter({ subject: '', content: '' });
        setShowComposer(false);
        fetchData(); // Refresh data
      } else {
        alert(result.error || 'Failed to send newsletter');
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.active).length,
    totalCampaigns: campaigns.length,
    thisMonthCampaigns: campaigns.filter(c => 
      new Date(c.sent_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length
  };

  if (loading) {
    return (
      <div className="mt-10">
        <div className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
          <h1 className="text-5xl font-bold font-display text-center w-full">Newsletter Management</h1>
        </div>
        <div className="p-6 space-y-6 animate-pulse">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-32 bg-gray-200 rounded-lg"></Card>
            ))}
          </div>

          {/* Compose Newsletter Skeleton */}
          <Card className="h-64 bg-gray-200 rounded-lg"></Card>

          {/* Campaign History Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </CardContent>
          </Card>

          {/* Subscribers List Skeleton */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="relative mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
        <h1 className="text-5xl font-bold font-display text-center w-full">Newsletter Management</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSubscribers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Subscribers</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeSubscribers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Campaigns</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
                </div>
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.thisMonthCampaigns}</p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compose Newsletter */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-desi-orange" />
                Newsletter Composer
              </CardTitle>
              <Button 
                onClick={() => setShowComposer(!showComposer)}
                variant={showComposer ? "secondary" : "default"}
                className="bg-desi-orange hover:bg-desi-orange/90"
              >
                {showComposer ? 'Hide Composer' : 'Compose Newsletter'}
              </Button>
            </div>
          </CardHeader>
          
          {showComposer && (
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Subject</label>
                <Input
                  placeholder="Newsletter subject..."
                  value={newNewsletter.subject}
                  onChange={(e) => setNewNewsletter(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Content</label>
                <Textarea
                  placeholder="Write your newsletter content here... You can use HTML for formatting."
                  value={newNewsletter.content}
                  onChange={(e) => setNewNewsletter(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: You can use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;br&gt;)
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={sendNewsletter}
                  disabled={sending || !newNewsletter.subject.trim() || !newNewsletter.content.trim()}
                  className="bg-desi-orange hover:bg-desi-orange/90"
                >
                  {sending ? 'Sending...' : `Send to ${stats.activeSubscribers} Subscribers`}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setNewNewsletter({ subject: '', content: '' });
                    setShowComposer(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Campaign History */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-desi-orange" />
              Campaign History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {campaigns.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No campaigns sent yet</p>
            ) : (
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{campaign.subject}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(campaign.sent_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {campaign.recipient_count} recipients
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">Sent</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscribers List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-desi-orange" />
              Recent Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscribers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No subscribers yet</p>
            ) : (
              <div className="space-y-3">
                {subscribers.slice(0, 10).map((subscriber) => (
                  <div
                    key={subscriber.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{subscriber.email}</p>
                      <p className="text-sm text-gray-500">
                        Subscribed {new Date(subscriber.subscribed_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={subscriber.active ? "default" : "secondary"}>
                      {subscriber.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
                {subscribers.length > 10 && (
                  <p className="text-center text-sm text-gray-500 pt-2">
                    and {subscribers.length - 10} more subscribers...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
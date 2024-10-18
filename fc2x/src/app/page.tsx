'use client'
import React, { useState, useEffect } from 'react';
import { NeynarProfileCard, useNeynarContext, NeynarAuthButton } from '@neynar/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, LogOut, Send, Trash2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { navigate } from '@/lib/server';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/lib/types';

export default function Home() {  
  const [authUrl, setAuthUrl] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [tweetId, setTweetId] = useState<string>('');
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLinked, setIsLinked] = useState<boolean>(false);
  const { user } = useNeynarContext();
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile) {
      setIsActive(userProfile.is_online ?? false);
    }
  }, [userProfile]);

  useEffect(() => {
    if (userProfile && user) {
      linkFid(user?.fid);
    }
  }, [userProfile, user]);

  const generateAuthTokens = async () => {
    const response = await fetch('/api/auth/tokens', {
      method: 'GET',
      cache: 'no-store' 
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch auth tokens');
    }
  
    const data = await response.json();
    return data;
  };  

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.status !== 401) {
        const data: User | null = await response.json();
        setUserProfile(data);
      }
    } catch (error) {
    }
    setHasChecked(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout');
      setUserProfile(null);
      setTweetId('');
      setIsLinked(false);
    } catch (error) {
      setError('Error logging out');
    }
  };

  const linkFid = async (fid: any) => {
    try {
      const response = await fetch('/api/link-fid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fid }),
      });
      if (response.status === 200) {
        setIsLinked(true);
      } else {
        setIsLinked(false);
        setError('Failed to link fid');
      }
    } catch (error) {
      setIsLinked(false);
      setError('Error linking fid');
    }
  };

  const handleTwitterAuth = async () => {
    try {
      const { oauth_token, oauth_token_secret, url } = await generateAuthTokens();
      document.cookie = `oauth_token=${oauth_token}; path=/; max-age=3600; secure; samesite=lax`;
      document.cookie = `oauth_token_secret=${oauth_token_secret}; path=/; max-age=3600; secure; samesite=lax`;
      await navigate(url);
    } catch (error) {
      console.error('Error during Twitter authentication:', error);
    }
  };

  const handleSwitchChange = async (checked: boolean) => {
    setIsActive(checked);
    try {
      const response = await fetch('/api/toggle-online', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_online: checked }),
      });
      if (!response.ok) {
        setError('Failed to update online status');
        setIsActive(!checked);
      }
    } catch (error) {
      setError('Error updating online status');
      setIsActive(!checked);
    }
  };  

  return (
    <div className="container mx-auto p-4 bg-white dark:bg-gray-900 min-h-screen space-y-5">
      {isLinked && user ? (
        <div className='w-full'>
          <Link className='text-center text-blue-400 hover:text-blue-500' target='_blank' href="https://warpcast.com/~/compose?text=I%20just%20used%20FC2X!">
            <p className='text-center font-bold text-xl'>Now make a cast to crosspost </p>
          </Link>
        </div>
      ) : (
        <p className='text-center font-bold text-xl'>Cross post your Farcaster casts to Twitter</p>
      )}
  
      <Card className="w-full max-w-md mx-auto bg-transparent border-none">
        <CardHeader />
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!userProfile && hasChecked ? (
            <Button className="w-full bg-white text-black" onClick={handleTwitterAuth}>
              Authenticate with Twitter
            </Button>
          ) : userProfile ? (
            <>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar>
                  <AvatarImage src={userProfile.profile_image_url ?? ""} alt={userProfile.display_name ?? ""} />
                  <AvatarFallback>{userProfile.display_name}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold dark:text-white">{userProfile.display_name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">@{userProfile.twitter_username}</p>
                </div>
                {/* 
                  <Button variant="outline" size="sm" className="ml-auto dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button> 
                */}
              </div>

              {user && userProfile && (
                <div className="flex flex-col sm:flex-row gap-2 items-start md:items-center mb-2">
                  <Checkbox checked={isActive} onCheckedChange={handleSwitchChange} />
                  <p className="font-semibold">Cross-posting {isActive ? "active" : "inactive"}</p>
                </div>
              )}

              {!user ? (
                <NeynarAuthButton label="Sign In with Neynar" />
              ) : (
                <>
                  <div className="dark:bg-gray-700 p-4 rounded-lg">
                    <NeynarProfileCard fid={user.fid} />
                  </div>
                  {isLinked && (
                    <Alert className="mt-4 bg-green-100 dark:bg-green-800 border-green-400 dark:border-green-700">
                      <CheckCircle className="h-4 w-4 text-green-700 dark:text-green-300" />
                      <AlertTitle className="text-green-800 dark:text-green-100">Linked Successfully</AlertTitle>
                      <AlertDescription className="text-green-700 dark:text-green-200">Your account is linked and ready to use.</AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </>
          ) : <></>}
        </CardContent>
      </Card>
    </div>
  );
}
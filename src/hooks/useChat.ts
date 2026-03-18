import React, { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, getDoc, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { ChatMessage } from '../types';

export function useChat(user: FirebaseUser | null) {
  const [userChats, setUserChats] = useState<any[]>([]);
  const [chatMitra, setChatMitra] = useState<{ id: string, name: string, serviceTitle?: string, serviceId?: string } | null>(null);
  const [chatMitraPhone, setChatMitraPhone] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    if (!user || !isFirebaseConfigured) {
      setUserChats([]);
      return;
    }
    
    try {
      const q = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user.uid),
        orderBy('timestamp', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const chats = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserChats(chats);
      }, (error) => {
        if (error.code === 'permission-denied') {
          console.warn("Firestore chats listener: Permission denied.");
        } else {
          console.error("Firestore chats listener failed:", error);
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup user chats listener:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!chatMitra || !isFirebaseConfigured || !user) {
      setMessages([]);
      setChatMitraPhone('');
      return;
    }
    
    // Fetch chatMitra phone number
    const fetchPhone = async () => {
      try {
        // Try mitras collection first
        let docSnap = await getDoc(doc(db, 'mitras', chatMitra.id));
        if (!docSnap.exists()) {
          // Fallback to users collection
          docSnap = await getDoc(doc(db, 'users', chatMitra.id));
        }
        if (docSnap.exists()) {
          const data = docSnap.data();
          setChatMitraPhone(data.phone || data.wa || '');
        }
      } catch (error) {
        console.warn("Could not fetch chatMitra phone:", error);
      }
    };
    fetchPhone();

    try {
      const chatId = [user.uid, chatMitra.id].sort().join('_');
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp', 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as any;
        setMessages(msgs);
      }, (error) => {
        console.warn("Firestore messages listener failed (likely permissions):", error);
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to setup Firestore messages listener:", error);
    }
  }, [chatMitra, user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatMitra || !user) return;

    const messageText = inputText;
    setInputText('');

    try {
      const chatId = [user.uid, chatMitra.id].sort().join('_');
      
      // Add message to subcollection
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: messageText,
        senderId: user.uid,
        timestamp: serverTimestamp()
      });

      // Update main chat document for recent message preview
      await setDoc(doc(db, 'chats', chatId), {
        participants: [user.uid, chatMitra.id],
        participantNames: {
          [user.uid]: user.displayName || 'Pengguna',
          [chatMitra.id]: chatMitra.name
        },
        lastMessage: messageText,
        timestamp: serverTimestamp(),
        serviceTitle: chatMitra.serviceTitle || '',
        serviceId: chatMitra.serviceId || ''
      }, { merge: true });

    } catch (error) {
      console.error("Error sending message:", error);
      alert("Gagal mengirim pesan. Pastikan Anda sudah login.");
    }
  };

  return {
    userChats,
    chatMitra,
    setChatMitra,
    chatMitraPhone,
    messages,
    inputText,
    setInputText,
    sendMessage
  };
}

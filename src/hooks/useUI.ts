import { useState } from 'react';

export function useUI() {
  const [showLoginMitraModal, setShowLoginMitraModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const [selectedMitra, setSelectedMitra] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState('Kota Bandung');
  
  const [editProfileName, setEditProfileName] = useState('');
  const [editProfileEmail, setEditProfileEmail] = useState('');
  const [editProfilePhone, setEditProfilePhone] = useState('');
  
  const [rejectionNote, setRejectionNote] = useState('');
  
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewTransaction, setReviewTransaction] = useState<any>(null);
  
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState('');
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  return {
    showLoginMitraModal, setShowLoginMitraModal,
    showLocationModal, setShowLocationModal,
    showAdModal, setShowAdModal,
    showReviewModal, setShowReviewModal,
    showRejectModal, setShowRejectModal,
    selectedMitra, setSelectedMitra,
    selectedLocation, setSelectedLocation,
    editProfileName, setEditProfileName,
    editProfileEmail, setEditProfileEmail,
    editProfilePhone, setEditProfilePhone,
    rejectionNote, setRejectionNote,
    reviewRating, setReviewRating,
    reviewText, setReviewText,
    reviewTransaction, setReviewTransaction,
    isEditingAddress, setIsEditingAddress,
    tempAddress, setTempAddress,
    isUploadingProfile, setIsUploadingProfile
  };
}

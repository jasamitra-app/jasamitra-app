import fs from 'fs';

let appContent = fs.readFileSync('src/App.tsx', 'utf-8');

// Add imports
appContent = appContent.replace(
  "import { \n  CATEGORIES, ",
  "import { useAuth } from './hooks/useAuth';\nimport { useChat } from './hooks/useChat';\nimport { useOrder } from './hooks/useOrder';\nimport { useUI } from './hooks/useUI';\nimport { \n  CATEGORIES, "
);

// Remove state declarations
const statesToRemove = [
  "const [userRole, setUserRole] = useState<'pelanggan' | 'mitra' | 'admin' | null>\\(\\(\\) => \\{[\\s\\S]*?\\}\\);",
  "const \\[user, setUser\\] = useState<FirebaseUser \\| null>\\(null\\);",
  "const \\[userChats, setUserChats\\] = useState<any\\[\\]>\\(\\[\\]\\);",
  "const \\[showPaymentModal, setShowPaymentModal\\] = useState\\(false\\);",
  "const \\[paymentAmount, setPaymentAmount\\] = useState<number>\\(0\\);",
  "const \\[paymentProof, setPaymentProof\\] = useState<File \\| null>\\(null\\);",
  "const \\[paymentProofPreview, setPaymentProofPreview\\] = useState<string \\| null>\\(null\\);",
  "const \\[isUploadingPayment, setIsUploadingPayment\\] = useState\\(false\\);",
  "const \\[pendingPayments, setPendingPayments\\] = useState<Payment\\[\\]>\\(\\[\\]\\);",
  "const \\[selectedPaymentForView, setSelectedPaymentForView\\] = useState<Payment \\| null>\\(null\\);",
  "const \\[rejectionNote, setRejectionNote\\] = useState\\(''\\);",
  "const \\[showRejectModal, setShowRejectModal\\] = useState\\(false\\);",
  "const \\[chatMitra, setChatMitra\\] = useState<\\{ id: string, name: string, serviceTitle\\?: string, serviceId\\?: string \\} \\| null>\\(null\\);",
  "const \\[chatMitraPhone, setChatMitraPhone\\] = useState<string>\\(''\\);",
  "const \\[messages, setMessages\\] = useState<ChatMessage\\[\\]>\\(\\[\\]\\);",
  "const \\[inputText, setInputText\\] = useState\\(''\\);",
  "const \\[showDealModal, setShowDealModal\\] = useState\\(false\\);",
  "const \\[showAdModal, setShowAdModal\\] = useState\\(false\\);",
  "const \\[showReviewModal, setShowReviewModal\\] = useState\\(false\\);",
  "const \\[reviewRating, setReviewRating\\] = useState\\(5\\);",
  "const \\[reviewText, setReviewText\\] = useState\\(''\\);",
  "const \\[reviewTransaction, setReviewTransaction\\] = useState<any>\\(null\\);",
  "const \\[editProfileName, setEditProfileName\\] = useState\\(''\\);",
  "const \\[editProfileEmail, setEditProfileEmail\\] = useState\\(''\\);",
  "const \\[editProfilePhone, setEditProfilePhone\\] = useState\\(''\\);",
  "const \\[activeDeal, setActiveDeal\\] = useState<any>\\(null\\);",
  "const \\[selectedMitra, setSelectedMitra\\] = useState<any>\\(null\\);",
  "const \\[isMitra, setIsMitra\\] = useState\\(false\\);",
  "const \\[mitraOrders, setMitraOrders\\] = useState<any\\[\\]>\\(\\[\\]\\);",
  "const \\[showLocationModal, setShowLocationModal\\] = useState\\(false\\);",
  "const \\[selectedLocation, setSelectedLocation\\] = useState\\('Kota Bandung'\\);",
  "const \\[transactions, setTransactions\\] = useState<Transaction\\[\\]>\\(\\[\\]\\);",
  "const \\[showOfferModal, setShowOfferModal\\] = useState\\(false\\);",
  "const \\[offerPrice, setOfferPrice\\] = useState\\(''\\);",
  "const \\[isSendingOffer, setIsSendingOffer\\] = useState\\(false\\);",
  "const \\[activeTransaction, setActiveTransaction\\] = useState<Transaction \\| null>\\(null\\);",
  "const \\[isUploadingProfile, setIsUploadingProfile\\] = useState\\(false\\);",
  "const \\[mitraStatus, setMitraStatus\\] = useState<'pending' \\| 'active' \\| 'rejected' \\| 'approved' \\| null>\\(null\\);",
  "const \\[showLoginMitraModal, setShowLoginMitraModal\\] = useState\\(false\\);",
  "const \\[userAddress, setUserAddress\\] = useState<string>\\(''\\);",
  "const \\[isEditingAddress, setIsEditingAddress\\] = useState\\(false\\);",
  "const \\[tempAddress, setTempAddress\\] = useState\\(''\\);"
];

statesToRemove.forEach(regexStr => {
  appContent = appContent.replace(new RegExp(regexStr + '\\n?', 'g'), '');
});

// Add hook calls
const hookCalls = `
  const { user, userRole, setUserRole, isMitra, setIsMitra, mitraStatus, userAddress, setUserAddress, logout } = useAuth();
  const { userChats, chatMitra, setChatMitra, chatMitraPhone, messages, inputText, setInputText, sendMessage } = useChat(user);
  const {
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
  } = useUI();
  const {
    mitraOrders, transactions, pendingPayments, selectedPaymentForView, setSelectedPaymentForView,
    showDealModal, setShowDealModal, activeDeal, setActiveDeal, activeTransaction, setActiveTransaction,
    showPaymentModal, setShowPaymentModal, paymentAmount, setPaymentAmount, paymentProof, setPaymentProof,
    paymentProofPreview, setPaymentProofPreview, isUploadingPayment, showOfferModal, setShowOfferModal,
    offerPrice, setOfferPrice, isSendingOffer, confirmDeal, handleSendOffer, submitPayment
  } = useOrder(user, userRole, activePage, chatMitra);

  const handleLogout = async () => {
    try {
      await logout();
      setShowOnboarding(true);
      setActivePage('beranda');
      alert('Berhasil keluar');
    } catch (error: any) {
      alert('Gagal keluar: ' + error.message);
    }
  };
`;

appContent = appContent.replace(
  "const [isSplash, setIsSplash] = useState(true);\n  const [showOnboarding, setShowOnboarding] = useState(false);",
  "const [isSplash, setIsSplash] = useState(true);\n  const [showOnboarding, setShowOnboarding] = useState(false);\n" + hookCalls
);

// Remove useEffects
// 1. onAuthStateChanged
appContent = appContent.replace(/useEffect\(\(\) => \{\s*const unsubscribe = onAuthStateChanged[\s\S]*?return \(\) => unsubscribe\(\);\s*\}, \[\]\);/g, '');

// 2. userChats
appContent = appContent.replace(/useEffect\(\(\) => \{\s*if \(!user \|\| !isFirebaseConfigured\) \{\s*setUserChats\(\[\]\);[\s\S]*?\}, \[user\]\);/g, '');

// 3. mitraOrders
appContent = appContent.replace(/useEffect\(\(\) => \{\s*if \(!user \|\| !isFirebaseConfigured\) \{\s*setMitraOrders\(\[\]\);[\s\S]*?\}, \[user\]\);/g, '');

// 4. transactions
appContent = appContent.replace(/useEffect\(\(\) => \{\s*if \(!isFirebaseConfigured \|\| !user\) \{\s*setTransactions\(\[\]\);[\s\S]*?\}, \[user, activePage\]\);/g, '');

// 5. messages
appContent = appContent.replace(/useEffect\(\(\) => \{\s*if \(!chatMitra \|\| !isFirebaseConfigured \|\| !user\) \{\s*setMessages\(\[\]\);[\s\S]*?\}, \[chatMitra, user\]\);/g, '');

// 6. pendingPayments
appContent = appContent.replace(/useEffect\(\(\) => \{\s*if \(!isFirebaseConfigured \|\| !user \|\| userRole !== 'admin'\) return;[\s\S]*?\}, \[user, userRole, activePage\]\);/g, '');

// Remove functions
// 1. handleLogout
appContent = appContent.replace(/const handleLogout = async \(\) => \{[\s\S]*?alert\('Gagal keluar: ' \+ error\.message\);\s*\}\s*\};/g, '');

// 2. sendMessage
appContent = appContent.replace(/const sendMessage = async \(e: React\.FormEvent\) => \{[\s\S]*?alert\("Gagal mengirim pesan\. Pastikan Anda sudah login\."\);\s*\}\s*\};/g, '');

// 3. confirmDeal
appContent = appContent.replace(/const confirmDeal = async \(\) => \{[\s\S]*?alert\('Gagal mengonfirmasi deal: ' \+ error\.message\);\s*\}\s*\};/g, '');

// 4. handleSendOffer
appContent = appContent.replace(/const handleSendOffer = async \(\) => \{[\s\S]*?setIsSendingOffer\(false\);\s*\}\s*\};/g, '');

// 5. submitPayment
appContent = appContent.replace(/const submitPayment = async \(\) => \{[\s\S]*?setIsUploadingPayment\(false\);\s*\}\s*\};/g, '');

fs.writeFileSync('src/App.tsx', appContent);
console.log('Refactoring applied');

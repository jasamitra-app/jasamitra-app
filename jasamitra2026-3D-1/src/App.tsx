import React, { useState } from "react";
import { AnimatePresence } from "motion/react";

import { useAuth } from "./hooks/useAuth";
import { usePayments } from "./hooks/usePayments";

import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { AppBottomNav } from "./components/AppBottomNav";
import { LocationModal } from "./components/LocationModal";

import { BookingModal } from "./components/modals/BookingModal";
import { OfferModal } from "./components/modals/OfferModal";
import { ReviewModal } from "./components/modals/ReviewModal";
import { PaymentModal } from "./components/modals/PaymentModal";
import { RejectPaymentModal } from "./components/modals/RejectPaymentModal";
import { PaymentViewerModal } from "./components/modals/PaymentViewerModal";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Account } from "./pages/Account";
import Messages from "./pages/Messages";
import ChatRoom from "./pages/ChatRoom";
import MyAds from "./pages/MyAds";
import Progress from "./pages/Progress";
import AdminPayment from "./pages/AdminPayment";

export type Page =
  | "beranda"
  | "login"
  | "akun"
  | "pesan"
  | "chatroom"
  | "iklan-saya"
  | "progress"
  | "admin-payment";

export default function App() {

  // UI state
  const [isSplash, setIsSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Navigation
  const [activePage, setActivePage] = useState<Page>("beranda");

  // Modals
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  // Hooks
  const { user } = useAuth();
  const { pendingPayments } = usePayments();

  // Navigation handler
  const navigateTo = (page: Page) => {
    setActivePage(page);
  };

  // Splash
  if (isSplash) {
    return <SplashScreen onFinish={() => setIsSplash(false)} />;
  }

  // Onboarding
  if (showOnboarding) {
    return <OnboardingScreen onFinish={() => setShowOnboarding(false)} />;
  }

  return (
    <div className="app-container">

      <AnimatePresence mode="wait">

        {activePage === "beranda" && (
          <Home
            onNavigate={navigateTo}
            onBooking={() => setShowBooking(true)}
          />
        )}

        {activePage === "login" && <Login />}

        {activePage === "akun" && <Account />}

        {activePage === "pesan" && <Messages />}

        {activePage === "chatroom" && <ChatRoom />}

        {activePage === "iklan-saya" && <MyAds />}

        {activePage === "progress" && <Progress />}

        {activePage === "admin-payment" && (
          <AdminPayment payments={pendingPayments} />
        )}

      </AnimatePresence>

      {/* MODALS */}

      <LocationModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />

      <BookingModal
        open={showBooking}
        onClose={() => setShowBooking(false)}
      />

      <OfferModal
        open={showOffer}
        onClose={() => setShowOffer(false)}
      />

      <ReviewModal
        open={showReview}
        onClose={() => setShowReview(false)}
      />

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        userId={user?.uid || ""}
      />

      <RejectPaymentModal
        open={showReject}
        onClose={() => setShowReject(false)}
      />

      <PaymentViewerModal
        open={showViewer}
        onClose={() => setShowViewer(false)}
      />

      {/* BOTTOM NAV */}

      <AppBottomNav
        activePage={activePage}
        onNavigate={navigateTo}
      />

    </div>
  );
}
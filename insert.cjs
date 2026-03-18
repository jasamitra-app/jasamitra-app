const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf8');
const lines = content.split('\n');
const index = lines.findIndex(line => line.includes('if (isSplash) return <SplashScreen'));

const insertText = `
  const submitAd = async () => {
    if (!adTitle || !adCategory || !adSubCategory || !adPrice || !adDesc || !adProvince || !adCity || !adDistrict) {
      alert('Mohon lengkapi semua data iklan');
      return;
    }
    
    setIsSubmittingAd(true);
    try {
      const cleanPrice = Number(adPrice.toString().replace(/[^0-9]/g, ''));

      const adData = {
        title: adTitle,
        cat: adCategory,
        category: adCategory,
        subcat: adSubCategory,
        price: cleanPrice,
        servicePolicy: adServicePolicy,
        desc: adDesc,
        province: adProvince,
        city: adCity,
        district: adDistrict,
        location: \`\${adDistrict}, \${adCity}, \${adProvince}\`,
        coverageAreas: adCoverageAreas,
        skills: adSkills,
        img: adImage || '',
        mitraId: user?.uid,
        mitraName: user?.displayName || 'Mitra Baru',
      };

      if (editingAdId) {
        await updateDoc(doc(db, 'iklan', editingAdId), adData);
        alert('Iklan jasa berhasil diperbarui!');
      } else {
        await addDoc(collection(db, 'iklan'), {
          ...adData,
          rating: 5.0,
          reviews: 0,
          status: 'aktif',
          createdAt: serverTimestamp()
        });
        alert('Iklan jasa berhasil dipasang!');
      }
      
      setShowAdModal(false); 
      setEditingAdId(null);
      setAdTitle('');
      setAdCategory('');
      setAdSubCategory('');
      setAdPrice('');
      setAdServicePolicy('Bisa bawa Alat & Material');
      setAdDesc('');
      setAdImage(null);
      setAdProvince('');
      setAdCity('');
      setAdDistrict('');
      setAdCoverageAreas([]);
      setAdSkills([]);
    } catch (error) {
      console.error("Error saving ad:", error);
      alert('Gagal menyimpan iklan. Silakan coba lagi.');
    } finally {
      setIsSubmittingAd(false);
    }
  };

  const submitBooking = async () => {
    if (!bookingName || !bookingAddress || !bookingDesc) {
      alert('Mohon lengkapi data pemesanan');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const basePrice = parseInt(bookingService.price.replace(/[^0-9]/g, '')) || 0;
      const total = basePrice;
      const dp = Math.round(total * 0.1);

      await addDoc(collection(db, 'orders'), {
        serviceId: bookingService.id,
        serviceTitle: bookingService.title,
        mitraId: bookingService.mitraId || 'unknown',
        mitraName: bookingService.mitraName || 'Mitra Jasa',
        customerId: user?.uid,
        customerName: bookingName,
        address: bookingAddress,
        description: bookingDesc,
        category: bookingService.category,
        servicePolicy: bookingService.servicePolicy || 'Bisa bawa Alat & Material',
        totalPrice: total,
        dpAmount: dp,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      alert('Pemesanan berhasil dikirim! Silakan tunggu konfirmasi dari mitra.');
      setBookingService(null);
      setBookingName('');
      setBookingAddress('');
      setBookingDesc('');
      navigateTo('pesan');
    } catch (error) {
      console.error("Error adding booking:", error);
      alert('Gagal mengirim pemesanan. Silakan coba lagi.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const submitReview = async () => {
    if (!reviewTransaction || !user) return;
    setIsSubmittingReview(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        mitraId: reviewTransaction.mitraID,
        customerId: user.uid,
        customerName: user.displayName || 'Pelanggan',
        rating: reviewRating,
        text: reviewText,
        serviceId: reviewTransaction.serviceId,
        transactionId: reviewTransaction.id,
        createdAt: serverTimestamp()
      });
      
      // Optional: Update average rating on the ad (service)
      if (reviewTransaction.serviceId) {
        const adRef = doc(db, 'iklan', reviewTransaction.serviceId);
        const adSnap = await getDoc(adRef);
        if (adSnap.exists()) {
          const adData = adSnap.data();
          const currentReviews = adData.reviews || 0;
          const currentRating = adData.rating || 5;
          const newReviews = currentReviews + 1;
          const newRating = ((currentRating * currentReviews) + reviewRating) / newReviews;
          await updateDoc(adRef, {
            rating: newRating,
            reviews: newReviews
          });
        }
      }
      
      // Update transaction to mark as reviewed
      await updateDoc(doc(db, 'transactions', reviewTransaction.id), {
        isReviewed: true
      });
      
      alert('Terima kasih atas ulasan Anda!');
      setShowReviewModal(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Gagal mengirim ulasan. Silakan coba lagi.");
    } finally {
      setIsSubmittingReview(false);
    }
  };
`;

lines.splice(index, 0, insertText);
fs.writeFileSync('src/App.tsx', lines.join('\n'));

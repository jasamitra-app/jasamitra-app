import fs from 'fs';
const content = fs.readFileSync('src/App.tsx', 'utf-8');

const startMarker = "{/* --- BERANDA --- */}";
const endMarker = "{/* --- PESAN (CHAT LIST) --- */}";

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const before = content.substring(0, startIndex + startMarker.length + 1);
  const after = content.substring(endIndex);
  
  const replacement = `
        {activePage === 'beranda' && (
          <Home
            user={user}
            userRole={userRole}
            navigateTo={navigateTo}
            setShowLocationModal={setShowLocationModal}
            selectedLocation={selectedLocation}
            isFirebaseConfigured={isFirebaseConfigured}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showNotifDropdown={showNotifDropdown}
            setShowNotifDropdown={setShowNotifDropdown}
            unreadNotifCount={unreadNotifCount}
            markNotifsAsRead={markNotifsAsRead}
            notifications={notifications}
            CATEGORIES={CATEGORIES}
            setSelectedCat={setSelectedCat}
            setSelectedSub={setSelectedSub}
            services={services}
            filteredServices={filteredServices}
            openMitraProfile={openMitraProfile}
            formatPrice={formatPrice}
          />
        )}

        `;
        
  fs.writeFileSync('src/App.tsx', before + replacement + after);
  console.log('Successfully replaced Home page in App.tsx');
} else {
  console.log('Markers not found');
}

// Tous les textes de l'interface, en français et en anglais.
// Pour changer un mot affiché à l'écran, c'est ici.

export const STRINGS = {
  fr: {
    skip: 'Passer', next: 'Suivant', start: 'Commencer',
    missionsAvailable: 'missions disponibles · glissez pour accepter ou refuser',
    decline: 'Refuser', accept: 'Accepter', noMissions: "Plus de missions pour l'instant.",
    thisWeek: 'Cette semaine', vsLastWeek: '+18% vs semaine dernière', monthlyGoal: 'Objectif mensuel',
    weeklyTrend: 'Évolution hebdomadaire', recentMissions: 'Dernières missions', requestPayout: 'Demander un virement',
    driverRole: 'PL Renault · Convoyeur indépendant', documents: 'Documents', account: 'Compte',
    interfaceLanguage: "Langue de l'interface", logout: 'Déconnexion',
    shipperInstructions: "Instructions donneur d'ordre", route: 'Itinéraire',
    departure: 'Départ', arrival: 'Arrivée', requiredDocs: 'Documents requis',
    backToMissions: 'Retour aux missions',
    driverSpace: 'Espace convoyeur', navMissions: 'Missions', navPlanning: 'Planning', navRevenus: 'Revenus', navProfil: 'Profil',
    proposedRate: 'Tarif proposé', acceptMission: 'Accepter la mission',
    payoutRequested: 'Virement demandé', payoutEta: '2 840 € arriveront sous 1 à 2 jours ouvrés.',
    close: 'Fermer', availableBalance: 'Solde disponible', cancel: 'Annuler',
    confirmLoading: 'Confirmer le chargement', reportArrival: 'Signaler arrivée', processing: 'Traitement...', confirmPayoutBtn: 'Confirmer le virement',
    menu: 'Menu', notifications: 'Notifications', details: 'Détails',
    screenTitles: { missions: 'Missions', planning: 'Planning', revenus: 'Revenus', profil: 'Profil' },
    stepLabels: { accepted: 'Acceptée', loading: 'Chargement', route: 'En route', done: 'Livré' },
    planningLabels: { today: "Aujourd'hui", tomorrow: 'Demain', week: 'Cette semaine' },
    toasts: {
      missionAccepted: 'Mission acceptée', missionDeclined: 'Mission refusée', photoCaptured: 'Photo capturée',
      addPhotoFirst: 'Ajoutez une photo avant de continuer', loadingConfirmed: 'Chargement confirmé', deliveryConfirmed: 'Livraison confirmée',
      langFr: 'Langue : Français', langEn: 'Language: English'
    },
    docs: {
      charge: { label: 'Bon de chargement', doneSub: 'Signé numériquement', pendingSub: 'En attente de signature' },
      photo: { label: "Photos de l'état", doneSub: '3 photos ajoutées', pendingSub: '3 photos minimum — toucher pour capturer' },
      assurance: { label: 'Attestation assurance', doneSub: 'Validée', pendingSub: 'À téléverser' },
      cmr: { label: 'CMR', doneSub: 'Complété', pendingSub: 'À compléter' }
    }
  },
  en: {
    skip: 'Skip', next: 'Next', start: 'Get started',
    missionsAvailable: 'missions available · swipe to accept or decline',
    decline: 'Decline', accept: 'Accept', noMissions: 'No more missions for now.',
    thisWeek: 'This week', vsLastWeek: '+18% vs last week', monthlyGoal: 'Monthly goal',
    weeklyTrend: 'Weekly trend', recentMissions: 'Recent missions', requestPayout: 'Request payout',
    driverRole: 'Renault truck · Independent driver', documents: 'Documents', account: 'Account',
    interfaceLanguage: 'Interface language', logout: 'Log out',
    shipperInstructions: 'Shipper instructions', route: 'Route',
    departure: 'Departure', arrival: 'Arrival', requiredDocs: 'Required documents',
    backToMissions: 'Back to missions',
    driverSpace: 'Driver space', navMissions: 'Missions', navPlanning: 'Planning', navRevenus: 'Earnings', navProfil: 'Profile',
    proposedRate: 'Proposed rate', acceptMission: 'Accept mission',
    payoutRequested: 'Payout requested', payoutEta: '€2,840 will arrive within 1 to 2 business days.',
    close: 'Close', availableBalance: 'Available balance', cancel: 'Cancel',
    confirmLoading: 'Confirm loading', reportArrival: 'Report arrival', processing: 'Processing...', confirmPayoutBtn: 'Confirm payout',
    menu: 'Menu', notifications: 'Notifications', details: 'Details',
    screenTitles: { missions: 'Missions', planning: 'Planning', revenus: 'Earnings', profil: 'Profile' },
    stepLabels: { accepted: 'Accepted', loading: 'Loading', route: 'En route', done: 'Delivered' },
    planningLabels: { today: 'Today', tomorrow: 'Tomorrow', week: 'This week' },
    toasts: {
      missionAccepted: 'Mission accepted', missionDeclined: 'Mission declined', photoCaptured: 'Photo captured',
      addPhotoFirst: 'Add a photo before continuing', loadingConfirmed: 'Loading confirmed', deliveryConfirmed: 'Delivery confirmed',
      langFr: 'Langue : Français', langEn: 'Language: English'
    },
    docs: {
      charge: { label: 'Loading slip', doneSub: 'Signed digitally', pendingSub: 'Awaiting signature' },
      photo: { label: 'Condition photos', doneSub: '3 photos added', pendingSub: '3 photos minimum — tap to capture' },
      assurance: { label: 'Insurance certificate', doneSub: 'Verified', pendingSub: 'To upload' },
      cmr: { label: 'CMR', doneSub: 'Completed', pendingSub: 'To complete' }
    }
  }
};

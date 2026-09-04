// Données de démonstration. Plus tard, elles viendront de l'API (voir .env.example).

export const ONBOARDING = [
  { icon: 'target',
    fr: { title: 'Trouvez vos missions', desc: 'Parcourez les missions disponibles près de chez vous et choisissez celles qui vous conviennent.' },
    en: { title: 'Find your missions', desc: 'Browse available missions near you and pick the ones that suit you.' } },
  { icon: 'pin',
    fr: { title: 'Suivez en temps réel', desc: 'Itinéraire, statuts et documents centralisés à chaque étape de la livraison.' },
    en: { title: 'Track in real time', desc: 'Route, status and documents all in one place at every delivery step.' } },
  { icon: 'wallet',
    fr: { title: 'Soyez payé rapidement', desc: 'Suivez vos revenus et demandez un virement en un tap.' },
    en: { title: 'Get paid fast', desc: 'Track your earnings and request a payout in one tap.' } }
];

// `when` sert au regroupement du Planning : today / tomorrow / week.
// `tagKind` pilote la couleur de l'étiquette (voir styles.css, classes .tag--*).
export const MISSIONS = [
  { id: 1, from: 'Paris', to: 'Lyon', when: 'today', time: '14:00', distance: '465 km', price: '680 €', endTime: '18:30', tagKind: 'urgent',
    fr: { date: "Aujourd'hui", vehicle: 'PL frigorifique', tag: 'Urgent', instructions: 'Marchandise fragile — manipulation avec soin. Livraison au quai B, contacter M. Durand.' },
    en: { date: 'Today', vehicle: 'Refrigerated truck', tag: 'Urgent', instructions: 'Fragile goods — handle with care. Deliver to dock B, contact Mr. Durand.' } },
  { id: 2, from: 'Lyon', to: 'Marseille', when: 'today', time: '18:00', distance: '315 km', price: '520 €', endTime: '21:15', tagKind: 'urgent',
    fr: { date: "Aujourd'hui", vehicle: 'PL', tag: 'Urgent', instructions: "Déchargement quai 4, badge visiteur à retirer à l'accueil." },
    en: { date: 'Today', vehicle: 'Truck', tag: 'Urgent', instructions: 'Unload at dock 4, pick up visitor badge at reception.' } },
  { id: 3, from: 'Lille', to: 'Bruxelles', when: 'tomorrow', time: '08:00', distance: '110 km', price: '240 €', endTime: '09:40', tagKind: 'frigo',
    fr: { date: 'Demain', vehicle: 'Fourgon', tag: 'Frigo', instructions: 'Température contrôlée à 4°C. Vérifier la sonde avant départ.' },
    en: { date: 'Tomorrow', vehicle: 'Van', tag: 'Refrigerated', instructions: 'Temperature controlled at 4°C. Check the probe before departure.' } },
  { id: 4, from: 'Nantes', to: 'Rennes', when: 'week', time: '10:00', distance: '115 km', price: '180 €', endTime: '11:30', tagKind: 'standard',
    fr: { date: 'Mercredi', vehicle: 'Utilitaire', tag: 'Standard', instructions: "Livraison particulier, sonner à l'interphone « Martin »." },
    en: { date: 'Wednesday', vehicle: 'Utility van', tag: 'Standard', instructions: 'Residential delivery, ring the "Martin" intercom.' } },
  { id: 5, from: 'Bordeaux', to: 'Toulouse', when: 'week', time: '06:00', distance: '245 km', price: '410 €', endTime: '09:20', tagKind: 'longue',
    fr: { date: 'Jeudi', vehicle: 'PL', tag: 'Longue distance', instructions: 'Départ tôt, pause obligatoire prévue à mi-parcours.' },
    en: { date: 'Thursday', vehicle: 'Truck', tag: 'Long haul', instructions: 'Early departure, mandatory break scheduled halfway.' } },
  { id: 6, from: 'Strasbourg', to: 'Metz', when: 'week', time: '15:30', distance: '165 km', price: '220 €', endTime: '17:10', tagKind: 'retour',
    fr: { date: 'Vendredi', vehicle: 'Fourgon', tag: 'Retour', instructions: 'Trajet retour à vide, chargement optionnel en cours de route.' },
    en: { date: 'Friday', vehicle: 'Van', tag: 'Return leg', instructions: 'Empty return leg, optional pickup along the way.' } }
];

export const BALANCE = '2 840 €';
export const GOAL_PERCENT = 78;

export const WEEK_DAYS = { fr: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] };
export const WEEK_BARS = [45, 60, 35, 80, 55, 90, 70]; // hauteur en % de chaque barre

export const RECENT_EARNINGS = [
  { route: 'Lyon → Marseille', amount: '+520 €', fr: "Aujourd'hui • 315 km", en: 'Today • 315 km' },
  { route: 'Bordeaux → Toulouse', amount: '+410 €', fr: 'Hier • 245 km', en: 'Yesterday • 245 km' },
  { route: 'Nantes → Rennes', amount: '+180 €', fr: 'Il y a 2 jours • 115 km', en: '2 days ago • 115 km' }
];

export const DRIVER = { initials: 'AK', name: 'Ahmed K.' };

// Documents d'une mission : état de départ à chaque nouvelle mission acceptée.
export const DOC_KEYS = ['charge', 'photo', 'assurance', 'cmr'];
export const freshDocs = () => ({ charge: 'done', photo: 'pending', assurance: 'pending', cmr: 'done' });

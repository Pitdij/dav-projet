# LogiFlow

Plateforme logistique en deux parties :

- **`mobile.html`** — l'app mobile **convoyeur** (missions à accepter d'un glissement, planning, revenus, profil, suivi d'une mission étape par étape). C'est le cœur du projet.
- **`index.html`** — le tableau de bord web du **donneur d'ordre** (vue d'ensemble, création de mission, suivi en direct).

L'app mobile reprend à l'identique la maquette Claude Design conservée dans `design/handoff/`.

---

## Lancer le projet sur ton Mac

1. Installe Node.js (version 18 ou plus) depuis <https://nodejs.org>.
2. Ouvre le Terminal, place-toi dans le dossier du projet, puis lance :

```bash
./setup.sh
npm run dev
```

L'app mobile s'ouvre dans ton navigateur à l'adresse <http://localhost:3000/mobile.html>.
Le dashboard est à <http://localhost:3000/>.

**Pour tester sur ton iPhone** (même Wi-Fi que le Mac) : le Terminal affiche une adresse du type `http://192.168.x.x:3000`. Ouvre-la dans Safari, ajoute `/mobile.html`, puis « Partager → Sur l'écran d'accueil ». L'app s'ouvre alors en plein écran comme une vraie app.

---

## Ce que fait l'app mobile

| Écran | Ce qu'on peut faire |
|---|---|
| Onboarding | 3 slides, glisser ou taper les points, « Passer » ou « Commencer » |
| Missions | Glisser une carte à droite = accepter, à gauche = refuser. Le chevron ouvre la fiche détaillée |
| Exécution | Étapes Acceptée → Chargement → En route → Livré. La photo est obligatoire avant de confirmer le chargement |
| Planning | Missions restantes regroupées par jour |
| Revenus | Solde, graphique de la semaine, dernières missions, demande de virement |
| Profil | Documents à compléter, langue FR/EN (mémorisée), déconnexion |
| Menu | Le bouton en haut à gauche ouvre le tiroir de navigation |

---

## Où modifier quoi

```
src/mobile/
├── strings.js   → tous les textes (FR et EN)
├── data.js      → missions, revenus, documents (données de démo)
├── icons.js     → icônes SVG
├── styles.css   → couleurs, tailles, espacements
├── app.js       → logique des écrans et des gestes
└── main.js      → point de départ
```

- Changer un mot à l'écran → `strings.js`
- Ajouter ou retirer une mission de démo → `data.js`
- Changer une couleur → les variables en haut de `styles.css`

---

## Mettre en ligne

```bash
./deploy.sh
```

Le script fait le build puis déploie sur Vercel (il te demandera de te connecter la première fois).

---

## Prochaines étapes

1. **Brancher de vraies données** : remplacer `data.js` par des appels à l'API (adresses dans `.env.example`, à copier en `.env`).
2. **Vraie prise de photo** : utiliser l'appareil photo du téléphone pour « Photos de l'état ».
3. **App Store** : empaqueter cette app web avec Capacitor pour obtenir une app iOS native à publier.

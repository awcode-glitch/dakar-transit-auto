# Prompt maître — Site web Transit & Vente de Véhicules (Dakar, Sénégal)



## RÔLE ET MISSION

Tu es un designer web senior et développeur full-stack, spécialisé dans les sites professionnels premium pour PME en Afrique de l'Ouest. Conçois et réalise un site web **complet et opérationnel** — pas une simple vitrine statique — pour une entreprise basée à Dakar, Sénégal, qui exerce **deux activités sous une seule bannière** :

1. **Transit & dédouanement** — marchandises, import/export, clientèle entreprises et particuliers
2. **Vente de véhicules** — neufs et d'occasion, importés directement par l'entreprise

Objectif business du site : convertir un maximum de visiteurs en contacts WhatsApp, tout en étant assez crédible pour qu'une entreprise lui confie le dédouanement de marchandises de valeur. Le site doit donner une impression de sérieux immédiat côté transit, et une impression de choix/simplicité côté véhicules — sans jamais donner l'impression de deux sites recollés.

---

## CONTEXTE CLIENT (confirmé en échange direct — ne pas dévier)

- Entreprise basée à Dakar, Sénégal.
- **Transit** : dédouanement de tous types de marchandises par voie maritime, aérienne et terrestre, pour entreprises comme particuliers. Export également proposé. Transit logistique international, avec un focus sur les conteneurs à destination de la sous-région.
- Statut professionnel : **déclarante en douane** — **pas encore** commissionnaire agréée en douane. Ne jamais employer le mot « agréée », ni afficher un numéro d'agrément : c'est un statut qu'elle n'a pas.
- Pas de service d'assurance cargo. Pas d'entreposage.
- **Véhicules** : import et vente, catalogue destiné à être géré par la cliente elle-même après la mise en ligne (pas par le développeur à chaque changement).
- Canal de contact prioritaire, largement préféré : **WhatsApp**.

Tout le reste ci-dessous complète intelligemment ces faits confirmés — vois le récapitulatif final pour la liste exacte de ce qui est supposé.

---

## DIRECTION ARTISTIQUE

Évite les trois réflexes « généré par IA » : fond crème + serif haute-contraste + accent terracotta ; fond quasi-noir + accent néon unique ; mise en page façon journal avec hairlines et angles droits partout. Ancre plutôt le design dans l'univers réel du métier : le port autonome de Dakar, les manifestes de fret, les tampons de douane, les routes commerciales vers la sous-région, le mouvement — de marchandises comme de véhicules.

**Palette** (hex à utiliser telle quelle) :

| Nom | Hex | Usage |
|---|---|---|
| Indigo rade | `#1B3A5C` | Couleur de marque principale — bandeaux, boutons, liens |
| Encre de nuit | `#101B2D` | Texte principal, fond du footer |
| Ocre douane | `#C97F2E` | Accent — CTA WhatsApp, badges promo véhicules, éléments « tampon » |
| Vert piste | `#3E7C6F` | Disponibilité, statut « en stock », succès |
| Brume portuaire | `#EDF0F2` | Fond des sections alternées |
| Blanc cassé | `#FAFAF8` | Fond principal |

**Typographie :**
- Titres : **Space Grotesk** (medium/bold) — géométrique et technique, du caractère sans tomber dans le cliché serif éditorial.
- Texte courant : **IBM Plex Sans** — lisible, professionnel, légèrement « documenté ».
- Données chiffrées (specs véhicules, tarifs, références, dates) : **IBM Plex Mono** — évoque un manifeste de fret ou une fiche technique tamponnée. Toutes polices disponibles sur Google Fonts.

**Élément signature — la ligne de route :** un fil pointillé qui évoque un trajet commercial sur une carte (Dakar → sous-région, ou origine → Dakar). Décliné en trois endroits, jamais plus :
1. Dans le hero de l'accueil, reliant visuellement les deux blocs CTA — transit et véhicules comme deux flux partant du même point.
2. Comme séparateur entre sections, à la place d'un simple hairline.
3. Sur chaque fiche véhicule, un petit badge « provenance → Dakar » en pointillé, qui rappelle discrètement que l'entreprise maîtrise elle-même la chaîne d'import.

Mouvement : aucune animation gratuite. Si animation il y a, un seul tracé — la ligne de route qui se dessine au chargement du hero — puis plus rien.

**Esquisse du hero (accueil) :**
```
┌───────────────────────────────────────────────┐
│  [logo]                        WhatsApp ↗      │
│                                                 │
│   De la douane de Dakar jusqu'à votre porte —  │
│   marchandises et véhicules, un seul            │
│   interlocuteur.                               │
│                                                 │
│   ┄┄┄┄┄┄┄┄┄┄┄┄ (ligne de route) ┄┄┄┄┄┄┄┄┄┄┄┄   │
│                                                 │
│   ┌────────────────────┐  ┌──────────────────┐│
│   │ Transit &          │  │ Vente de          ││
│   │ Dédouanement    →  │  │ Véhicules      →  ││
│   └────────────────────┘  └──────────────────┘│
│                                                 │
│   Déclarant en douane · Maritime · Aérien ·    │
│   Terrestre · Réponse rapide sur WhatsApp      │
└───────────────────────────────────────────────┘
```

---

## ARCHITECTURE DU SITE

```
Accueil (hub)
├── Transit & Dédouanement
│   ├── Nos services (maritime / aérien / terrestre)
│   ├── Zones desservies
│   └── Demander un devis
├── Vente de Véhicules
│   ├── Catalogue (neuf / occasion, filtres)
│   ├── Fiche véhicule (détail)
│   └── Import sur commande
├── À propos
└── Contact
```
Communs à toutes les pages : bouton WhatsApp flottant, coordonnées, mention du statut professionnel, footer partagé.

---

## PAGES — CONTENU DÉTAILLÉ

### Accueil
- Hero selon l'esquisse ci-dessus : titre qui pose les deux activités comme un seul atout, pas deux offres qui se battent pour l'attention.
- Sous-titre court, orienté fiabilité et rapidité de réponse.
- Deux blocs CTA visuellement égaux — aucun des deux ne doit sembler secondaire.
- Bandeau de confiance juste sous le hero : statut professionnel, modes de transport couverts, canal WhatsApp. // nombre d'années d'expérience à ajouter une fois connu.
- Bouton WhatsApp flottant, visible sur tout le site, jamais masqué par un scroll.

### Transit & Dédouanement
- **Nos services** : trois colonnes — Maritime / Aérien / Terrestre — chacune 2-3 lignes concrètes plutôt que du texte marketing vague.
- **Zones desservies** : Sénégal, plus la sous-région. // Mali, Burkina Faso, Niger, Guinée à confirmer avec elle — ce sont les destinations les plus courantes au départ du port de Dakar, à ajuster si sa réalité diffère.
- Encadré statut : « Déclarante en douane », avec une phrase qui valorise ce que ça garantit concrètement (maîtrise des procédures, suivi rigoureux du dossier) sans jamais suggérer un agrément qu'elle n'a pas.
- **Demander un devis** : formulaire court — type de marchandise, origine, mode de transport, coordonnées — qui débouche sur un message WhatsApp pré-rempli plutôt qu'un envoi dans le vide.

### Vente de Véhicules
- **Catalogue** : grille de cartes, filtres par statut (neuf/occasion), marque, budget. // le niveau de détail des filtres est à ajuster une fois le volume réel de stock connu.
- Chaque carte : photo principale, marque/modèle/année, kilométrage, prix ou « prix sur demande ». // le mode d'affichage du prix est à trancher avec elle ; le catalogue doit supporter les deux sans développement supplémentaire.
- **Fiche véhicule** : galerie photo, tableau de specs en police mono (effet fiche technique), badge provenance, bouton WhatsApp pré-rempli citant le modèle exact.
- **Import sur commande** : section courte expliquant qu'elle peut aussi sourcer un véhicule précis sur demande, formulaire simplifié (marque, modèle, budget, délai souhaité).

### À propos
- Histoire courte, ce qui la distingue réellement : le fait de gérer transit et véhicules lui donne une maîtrise de bout en bout de la chaîne d'import — un vrai argument, pas juste une case à cocher.

### Contact
- WhatsApp en premier, puis téléphone, adresse, formulaire de secours, carte de localisation.

---

## FONCTIONNALITÉS — SITE OPÉRATIONNEL, PAS VITRINE

Le catalogue véhicules doit être piloté par une vraie base de données, avec un espace d'administration protégé où la cliente ajoute, modifie et retire un véhicule elle-même, sans jamais toucher au code.

**Modèle de données minimal (véhicules) :**
```
Vehicule {
  id, marque, modele, annee, kilometrage,
  prix (nullable → affiché "sur demande"),
  statut: neuf | occasion,
  disponible: boolean,
  provenance (ex: "Europe", "Émirats"),
  photos: [url],
  description,
  date_ajout
}
```

**Espace admin :**
- Authentification simple (login / mot de passe).
- Liste des véhicules avec recherche et tri.
- Formulaire d'ajout et d'édition avec upload photo.
- Marquer un véhicule « vendu » en un clic, sans le supprimer de l'historique.

**Intégration WhatsApp :**
- Chaque CTA « Contacter » génère un lien `wa.me` avec un message pré-rempli et contextuel — ex. *"Bonjour, je suis intéressé par la [Marque Modèle Année] à [Prix] vue sur le site."*

**Exigences transverses :** mobile-first (l'essentiel du trafic sera mobile au Sénégal), chargement rapide même en connexion lente, SEO local (Google Business Profile, balises ciblant « transitaire Dakar » et « vente voiture Dakar »), formulaires avec validation claire et messages d'erreur explicites.

---

## STACK TECHNIQUE RECOMMANDÉE

Cohérence avec ce que tu maîtrises déjà sur DScan :
- **Frontend** : React + Vite
- **Backend** : Spring Boot (API REST) + MySQL
- **Auth admin** : Spring Security, JWT ou session simple
- **Stockage photos** : dossier serveur, ou un service externe type Cloudinary si tu préfères ne pas gérer l'upload toi-même

*Si tu pars d'abord sur Figma Make plutôt qu'un développement réel :* concentre-toi sur le rendu visuel et les interactions de navigation. La section base de données/admin ci-dessus reste la spec à redonner à Claude Code au moment de l'implémentation réelle.

---

## BONUS — CE QUI FAIT LA DIFFÉRENCE

- **Témoignages clients** : bloc prévu sur l'accueil et/ou la page à propos, à remplir dès qu'elle a ses premiers avis. // vide pour l'instant, ne pas inventer de faux témoignages.
- **Chiffres de confiance** (années d'activité, nombre de dédouanements, véhicules livrés) : structure prête, valeurs à insérer une fois connues.
- **Multilingue FR/EN** : non prioritaire pour la v1, mais prévoir une structure qui le permette facilement si elle vise la diaspora anglophone plus tard.
- **Hébergement** : frontend sur Vercel (comme pour aucoeurdulac.com), backend Spring Boot sur un service type Railway ou Render.
- **Analytics** : Google Analytics ou Plausible, pour qu'elle voie quelle activité attire le plus de trafic.

---

## CE QUI NE DOIT JAMAIS APPARAÎTRE

- Le mot « agréée » ou un numéro d'agrément en douane.
- Une mention d'assurance cargo ou d'entreposage comme service proposé.
- Des prix, stocks ou témoignages inventés qui ressembleraient à de vraies données une fois en ligne.


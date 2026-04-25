import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import { MODULE_CATALOG } from "../lib/modules-catalog";
import { buildAnnonceSlug } from "../lib/slug";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

type Seed = {
  type: string;
  titre: string;
  description: string;
  ville?: string;
  photo?: string;
  prix?: number;
  categorie?: string;
  villeDepart?: string;
  villeArrivee?: string;
  dateVoyage?: Date;
  kgDispo?: number;
  prixParKg?: number;
  matiere?: string;
  niveau?: string;
  modalite?: string;
  contactNom: string;
  contactTelephone: string;
  contactEmail?: string;
};

// Thématique, stable, même URL = même image. Hand-picked Unsplash photos
// so cards look like their content (DJ for a DJ ad, food for a traiteur,
// airplane for a colis announcement, etc.).
const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&h=900&q=80&fit=crop&auto=format`;

const in30 = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000);

const SEEDS: Seed[] = [
  // ---- Événementiel ----
  {
    type: "evenementiel",
    categorie: "dj",
    titre: "DJ Congolais — mariages & soirées privées",
    description:
      "15 ans d'expérience, répertoire rumba, ndombolo, afrobeats, gospel. Matériel son & lumière fourni. Dispo week-ends.",
    ville: "Bruxelles",
    photo: u("1493225457124-a3eb161ffa5f"),
    prix: 650,
    contactNom: "Patrick Mbuyi",
    contactTelephone: "+32470112233",
    contactEmail: "patrick.mbuyi@example.be",
  },
  {
    type: "evenementiel",
    categorie: "traiteur",
    titre: "Traiteur congolais — pondu, poulet moambe, fumbwa",
    description:
      "Cuisine de la maman, plats généreux pour 20 à 200 personnes. Livraison sur Bruxelles et Liège. Devis sous 24 h.",
    ville: "Liège",
    photo: u("1606491956689-2ea866880c84"),
    prix: 18,
    contactNom: "Mama Céline",
    contactTelephone: "+32478998877",
  },
  {
    type: "evenementiel",
    categorie: "coiffure",
    titre: "Coiffeuse afro à domicile — tresses, locks, lissage",
    description:
      "Je me déplace sur toute la Belgique le week-end. Tarifs clairs, produits doux pour cheveux crépus et métissés.",
    ville: "Anvers",
    photo: u("1580618672591-eb180b1a973f"),
    prix: 80,
    contactNom: "Grace Ilunga",
    contactTelephone: "+32494554433",
    contactEmail: "grace.ilunga@example.be",
  },
  {
    type: "evenementiel",
    categorie: "photo",
    titre: "Photographe mariage — couverture complète",
    description:
      "Reportage photo de la préparation à la soirée. Galerie en ligne sous 10 jours, 300 photos retouchées incluses.",
    ville: "Bruxelles",
    photo: u("1522673607200-164d1b6ce486"),
    prix: 1200,
    contactNom: "Daniel Kabongo",
    contactTelephone: "+32485221100",
  },
  {
    type: "evenementiel",
    categorie: "salle",
    titre: "Salle de fête 120 personnes — Charleroi",
    description:
      "Salle moderne, cuisine équipée, parking privé, sono incluse. Disponible vendredi soir au dimanche matin.",
    ville: "Charleroi",
    photo: u("1519167758481-83f550bb49b3"),
    prix: 900,
    contactNom: "SPRL Horizon",
    contactTelephone: "+3271224455",
    contactEmail: "contact@horizon-salle.example.be",
  },
  {
    type: "evenementiel",
    categorie: "decoration",
    titre: "Déco mariage — thème pagne, fleurs, arche",
    description:
      "Décoration sur-mesure autour du pagne wax. Arche fleurie, chemins de table, dressage. Rendu photo envoyé avant la date.",
    ville: "Bruxelles",
    photo: u("1606216794074-735e91aa2c92"),
    prix: 450,
    contactNom: "Atelier Wax & Co",
    contactTelephone: "+32496772211",
    contactEmail: "hello@waxandco.example.be",
  },

  // ---- Colis ----
  {
    type: "colis",
    titre: "Bruxelles → Kinshasa, 25 kg dispo",
    description:
      "Je voyage début mai avec Brussels Airlines. 25 kg en soute disponibles pour vos colis. Retrait possible à Matonge.",
    villeDepart: "Bruxelles",
    villeArrivee: "Kinshasa",
    dateVoyage: in30(12),
    kgDispo: 25,
    prixParKg: 12,
    photo: u("1569154941061-e231b4725ef1"),
    contactNom: "Joseph Tshibangu",
    contactTelephone: "+32472889933",
  },
  {
    type: "colis",
    titre: "Paris → Brazzaville, 15 kg le 20 mai",
    description:
      "Vol Air France CDG → FIH puis route vers Brazza. Colis sérieux uniquement, enregistrement possible la veille.",
    villeDepart: "Paris",
    villeArrivee: "Brazzaville",
    dateVoyage: in30(27),
    kgDispo: 15,
    prixParKg: 10,
    photo: u("1464037866556-6812c9d1c72e"),
    contactNom: "Sylvie Nsimba",
    contactTelephone: "+33612334455",
    contactEmail: "sylvie.n@example.com",
  },
  {
    type: "colis",
    titre: "Anvers → Douala, 40 kg avant fin du mois",
    description:
      "Containers partagés, tarif dégressif au-delà de 20 kg. Réception à Bonapriso ou Akwa possible.",
    villeDepart: "Anvers",
    villeArrivee: "Douala",
    dateVoyage: in30(18),
    kgDispo: 40,
    prixParKg: 8,
    photo: u("1542296332-2e4473faf563"),
    contactNom: "Emmanuel Ekane",
    contactTelephone: "+32485667788",
  },
  {
    type: "colis",
    titre: "Retour Kinshasa → Bruxelles, 10 kg dispo",
    description:
      "Je rentre à Bruxelles le 3 juin avec 10 kg disponibles. Réception au terminal ou à Ixelles.",
    villeDepart: "Kinshasa",
    villeArrivee: "Bruxelles",
    dateVoyage: in30(41),
    kgDispo: 10,
    prixParKg: 14,
    photo: u("1570710891163-6d3b5c47248b"),
    contactNom: "Béatrice Kasongo",
    contactTelephone: "+32494998844",
  },
  {
    type: "colis",
    titre: "Bruxelles → Libreville, 30 kg",
    description:
      "Cargo partagé, départ confirmé. Emballage fourni, suivi WhatsApp jusqu'à livraison.",
    villeDepart: "Bruxelles",
    villeArrivee: "Libreville",
    dateVoyage: in30(22),
    kgDispo: 30,
    prixParKg: 11,
    photo: u("1436491865332-7a61a109cc05"),
    contactNom: "Carlos Mavoungou",
    contactTelephone: "+32478332211",
    contactEmail: "carlos.m@example.be",
  },
  {
    type: "colis",
    titre: "Lyon → Kinshasa, 20 kg, vol direct",
    description:
      "Vol direct Kenya Airways avec escale. 20 kg pour vos envois, documents acceptés. Preuve de dépôt photo.",
    villeDepart: "Lyon",
    villeArrivee: "Kinshasa",
    dateVoyage: in30(9),
    kgDispo: 20,
    prixParKg: 13,
    photo: u("1502920917128-1aa500764cbd"),
    contactNom: "Dieudonné Lokua",
    contactTelephone: "+33772556611",
  },

  // ---- Répétiteur ----
  {
    type: "repetiteur",
    matiere: "maths",
    niveau: "secondaire",
    modalite: "les_deux",
    titre: "Cours de maths, 3e à 6e secondaire",
    description:
      "Étudiant en ingé civile ULB, 4 ans d'expérience. Préparation aux examens de passage, CE1D, CESS. Exercices corrigés fournis.",
    ville: "Bruxelles",
    photo: u("1596495577886-d920f1fb7238"),
    prix: 25,
    contactNom: "Jean-Luc Mukendi",
    contactTelephone: "+32470445566",
    contactEmail: "jl.mukendi@example.be",
  },
  {
    type: "repetiteur",
    matiere: "neerlandais",
    niveau: "secondaire",
    modalite: "en_ligne",
    titre: "Néerlandais — je rends le NL accessible",
    description:
      "Prof néerlandophone à Anvers. Approche par la conversation, pas de grammaire par cœur. Ados et adultes bienvenus.",
    ville: "Anvers",
    photo: u("1503676260728-1c00da094a0b"),
    prix: 30,
    contactNom: "Kevin Van De Velde",
    contactTelephone: "+32495332211",
  },
  {
    type: "repetiteur",
    matiere: "francais",
    niveau: "primaire",
    modalite: "presentiel",
    titre: "Soutien français primaire — lecture, orthographe",
    description:
      "Institutrice retraitée, patiente, méthode ludique. 10 €/h avec réduction pour fratries. Matonge, Ixelles, Saint-Gilles.",
    ville: "Bruxelles",
    photo: u("1522202176988-66273c2fd55f"),
    prix: 10,
    contactNom: "Madame Lydia",
    contactTelephone: "+32496112233",
  },
  {
    type: "repetiteur",
    matiere: "chimie",
    niveau: "superieur",
    modalite: "les_deux",
    titre: "Chimie générale & organique — étudiants univ.",
    description:
      "Docteur en chimie UCLouvain. Sessions intensives avant les examens. Explications à partir de tes notes de cours.",
    ville: "Louvain",
    photo: u("1434030216411-0b793f4b4173"),
    prix: 40,
    contactNom: "Dr. Paul Mbakasa",
    contactTelephone: "+32475889966",
    contactEmail: "paul.mbakasa@example.be",
  },
  {
    type: "repetiteur",
    matiere: "anglais",
    niveau: "secondaire",
    modalite: "en_ligne",
    titre: "English tutor — from zero to confidence",
    description:
      "Bilingual, lived in London 5 years. Focus on speaking and real-world vocabulary, not just textbook grammar.",
    photo: u("1532012197267-da84d127e765"),
    prix: 28,
    contactNom: "Chantal Nzuzi",
    contactTelephone: "+32494665544",
  },
  {
    type: "repetiteur",
    matiere: "physique",
    niveau: "secondaire",
    modalite: "presentiel",
    titre: "Physique secondaire — patience garantie",
    description:
      "Prof de sciences, j'explique autrement jusqu'à ce que ça clique. Mécanique, électricité, optique. Liège centre.",
    ville: "Liège",
    photo: u("1509869175650-a1d97972541a"),
    prix: 22,
    contactNom: "Bertrand Mwamba",
    contactTelephone: "+32485441122",
    contactEmail: "b.mwamba@example.be",
  },

  // ---- Restauration ----
  {
    type: "restauration",
    titre: "Plats maman — pondu, poisson fumé, chikwangue",
    description:
      "Cuisine maison chaque mercredi et samedi, livraison à Bruxelles. Plats individuels 10 €, barquettes famille 25 €.",
    ville: "Bruxelles",
    photo: u("1546069901-ba9599a7e63c"),
    prix: 10,
    contactNom: "Mama Jeanne",
    contactTelephone: "+32470665544",
  },
  {
    type: "restauration",
    titre: "Cantine africaine du midi — Liège",
    description:
      "Menu à 12 € chaque midi : plat + boisson. Cuisine congolaise, camerounaise, ivoirienne en rotation. Emporter ou livraison.",
    ville: "Liège",
    photo: u("1555939594-58d7cb561ad1"),
    prix: 12,
    contactNom: "Le Baobab",
    contactTelephone: "+32496112244",
    contactEmail: "contact@baobab.example.be",
  },
  {
    type: "restauration",
    titre: "Chef freelance — privatisation à domicile",
    description:
      "Je viens cuisiner chez toi pour 6 à 20 convives. Menus mariage traditionnel, anniversaire, repas d'affaires. Devis en 24 h.",
    ville: "Anvers",
    photo: u("1546793665-c74683f339c1"),
    prix: 45,
    contactNom: "Chef Diallo",
    contactTelephone: "+32494887766",
    contactEmail: "chef.diallo@example.be",
  },
  {
    type: "restauration",
    titre: "Tchop bien le vendredi soir",
    description:
      "Poulet braisé, poisson grillé, alloco, plantain. Commande avant 17 h sur WhatsApp, retrait à partir de 19 h. Matonge.",
    ville: "Bruxelles",
    photo: u("1518492104633-130d0cc84637"),
    prix: 15,
    contactNom: "Tonton Fifi",
    contactTelephone: "+32478993322",
  },

  // ---- Petits boulots ----
  {
    type: "petits-boulots",
    titre: "Déménageur avec camionnette — Bruxelles et alentours",
    description:
      "Déménagement studio à appartement 2 chambres. Camionnette 12 m³ incluse. Devis gratuit, 2e personne en option.",
    ville: "Bruxelles",
    photo: u("1556909114-f6e7ad7d3136"),
    prix: 30,
    contactNom: "Marcel Kabila",
    contactTelephone: "+32485112233",
  },
  {
    type: "petits-boulots",
    titre: "Plombier — dépannage 7j/7",
    description:
      "Fuite, chasse d'eau, évier bouché, chauffe-eau. Intervention en 2 h sur Bruxelles. Devis transparent avant d'intervenir.",
    ville: "Bruxelles",
    photo: u("1581244277943-fe4a9c777189"),
    prix: 60,
    contactNom: "Pascal Mbuyi",
    contactTelephone: "+32494667788",
    contactEmail: "pascal.mbuyi@example.be",
  },
  {
    type: "petits-boulots",
    titre: "Ménage à domicile — consciencieux, dispo en semaine",
    description:
      "Ménage régulier ou ponctuel, repassage inclus. Produits fournis si tu veux. Références vérifiables auprès de clientes actuelles.",
    ville: "Charleroi",
    photo: u("1621905251918-48416bd8575a"),
    prix: 18,
    contactNom: "Clarisse Muamba",
    contactTelephone: "+32470885522",
  },
  {
    type: "petits-boulots",
    titre: "Électricien — petits travaux et mise aux normes",
    description:
      "Prises, tableau électrique, luminaires, interphone. Certifié. Travaille en soirée et week-end pour les locataires qui bossent.",
    ville: "Anvers",
    photo: u("1545239351-ef35f43d514b"),
    prix: 55,
    contactNom: "Éric Nkulu",
    contactTelephone: "+32485336655",
    contactEmail: "eric.nkulu@example.be",
  },
];

async function syncModules() {
  for (const spec of MODULE_CATALOG) {
    await prisma.module.upsert({
      where: { key: spec.key },
      // Don't clobber an admin's status/order — only initialise missing rows.
      update: {
        label: spec.label,
        tagline: spec.tagline,
      },
      create: {
        key: spec.key,
        label: spec.label,
        tagline: spec.tagline,
        status: spec.defaultStatus,
        order: spec.defaultOrder,
      },
    });
  }
}

type GuideSeed = {
  slug: string;
  title: string;
  tldr: string;
  content: string;
  category: string;
  heroImage?: string;
  readingMinutes: number;
  authorName?: string;
};

const GUIDE_SEEDS: GuideSeed[] = [
  {
    slug: "premiere-declaration-impots-belgique",
    title: "Première déclaration d'impôts en Belgique",
    category: "fiscalite",
    readingMinutes: 7,
    authorName: "Équipe Bisso",
    heroImage: u("1554224155-8d04cb21cd6c"),
    tldr:
      "Entre avril et juin, tout résident doit déclarer ses revenus au SPF Finances via Tax-on-web. 30 minutes la première fois, zéro papier. Voici les étapes réelles.",
    content: `## Ce qu'il te faut

- Ta **carte d'identité belge** ou ton titre de séjour
- Ton **numéro national** (au dos de la carte)
- Ta **fiche fiscale 281.10** (envoyée en mars par ton employeur)
- Tes **relevés bancaires** de l'année fiscale
- Un **code itsme** ou un **lecteur de carte eID**

## Les étapes

### 1. Attends ta convocation
Le SPF Finances t'envoie une **proposition de déclaration simplifiée** entre avril et mai. Soit par courrier, soit dans ta boîte e-Box si tu y es inscrit.

### 2. Vérifie les chiffres
Compare avec ta fiche 281.10 ligne par ligne. L'erreur la plus fréquente : des frais professionnels oubliés ou un job étudiant mal encodé.

### 3. Déclare en ligne via Tax-on-web
Va sur [financien.belgium.be](https://financien.belgium.be) et connecte-toi via **itsme**. Prévois 30 minutes la première fois, 10 minutes les années suivantes.

### 4. Signe et archive
Un accusé de réception PDF est généré. **Garde-le 7 ans** — l'administration peut te demander des justifs pendant tout ce temps.

## Les pièges

- **La proposition simplifiée** : 40 % contiennent au moins une erreur. Vérifie, même si c'est tentant de cliquer « accepter ».
- **Frais forfaitaires vs réels** : si tu fais plus de 30 km aller-retour au boulot, ou si tu as payé une formation pro, les **frais réels** te font économiser plus.
- **Compte à l'étranger** : obligatoire à déclarer, **dès 1 €**. Oublier = amende automatique.
- **Enfants majeurs encore étudiants** : tu peux toujours les mettre à charge, souvent oublié.

## Liens directs

- Ta déclaration : [myminfin.be/taxonweb](https://financien.belgium.be/fr/E-services/Tax-on-web)
- Info SPF Finances (FR) : **02 572 57 57**, 9h-17h du lundi au vendredi
- Simulation d'impôt : [tax-calc.ccff02.minfin.fgov.be](https://tax-calc.ccff02.minfin.fgov.be)

## Cas particulier : non-résident

Si tu as des revenus belges mais que tu vis au Congo ou ailleurs, tu dois remplir une **déclaration non-résident** (formulaire différent, délai jusqu'en novembre). C'est plus complexe — à faire avec un comptable la première fois.
`,
  },
  {
    slug: "allocations-familiales-belgique",
    title: "Allocations familiales : qui y a droit, combien, comment",
    category: "famille",
    readingMinutes: 5,
    authorName: "Équipe Bisso",
    heroImage: u("1503454537195-1dcabb73ffb9"),
    tldr:
      "Tout enfant qui vit en Belgique a droit aux allocations familiales, quelle que soit la situation des parents. Voici les montants, la démarche, et les avantages cachés pour familles nombreuses.",
    content: `## Qui y a droit

**Tout enfant qui habite en Belgique**, quelle que soit la nationalité des parents, et peu importe que tu travailles, étudies, sois au CPAS ou sans papiers en cours de régularisation (selon ton statut). Pas d'ancienneté requise.

## Combien tu touches (2026, Région bruxelloise)

- **1er enfant** : environ 184 € / mois
- **2e enfant** : environ 184 € / mois
- **3e enfant et suivants** : environ 184 € / mois + suppléments famille nombreuse
- **Supplément social** si revenus modestes : +50 à 100 €
- **Prime de rentrée scolaire** : 30 à 130 € en août, selon l'âge

Les montants varient légèrement entre **Bruxelles (FAMIRIS)**, **Wallonie (AViQ/FAMIWAL)** et **Flandre (Groeipakket)**.

## Comment faire la demande

### 1. Choisir sa caisse
Tu as le **libre choix** de la caisse d'allocations. Compare : certaines (Partena, Infino) ont de meilleurs délais que d'autres.

### 2. Remplir le formulaire en ligne
Sur le site de la caisse choisie. Tu devras fournir :

- **Acte de naissance** de chaque enfant
- **Composition de ménage** (à récupérer à la commune, 5 € environ)
- Ton **contrat de travail** ou attestation ONEM

### 3. Attendre 1 à 3 mois
Les paiements sont **rétroactifs** à la date de naissance ou d'arrivée de l'enfant en Belgique. Tu ne perds rien.

## Famille nombreuse — les avantages cachés

Dès **3 enfants à charge** :

- **Réduction SNCB** : -50 % sur tous les trajets en train (à demander en gare avec la composition de ménage)
- **Réduction TEC/STIB/De Lijn** selon la région
- **Allocation logement** supplémentaire dans certaines communes
- **Avantage fiscal** : l'abattement grimpe significativement au 3e enfant

Beaucoup de familles ne demandent jamais ces avantages. **Fais-le**.

## Les pièges

- **Changement de domicile** : préviens ta caisse sous 8 jours, sinon paiements suspendus.
- **Enfant majeur étudiant** : les allocations continuent **jusqu'à 25 ans** s'il étudie. À certifier chaque année avec l'attestation d'inscription.
- **Parents séparés** : l'allocation va au parent qui héberge l'enfant la majorité du temps. En cas de garde alternée, c'est négociable.

## Liens directs

- Bruxelles (FAMIRIS) : [famiris.brussels](https://famiris.brussels)
- Wallonie (FAMIWAL) : [famiwal.be](https://famiwal.be)
- Flandre (Groeipakket) : [groeipakket.be](https://groeipakket.be)
`,
  },
  {
    slug: "premier-achat-maison-belgique",
    title: "Premier achat de maison en Belgique : abattement, prêt, primo-acquéreur",
    category: "logement",
    readingMinutes: 9,
    authorName: "Équipe Bisso",
    heroImage: u("1560518883-ce09059eeffa"),
    tldr:
      "Acheter ton premier logement en Belgique te donne droit à de gros avantages fiscaux (abattement sur les droits d'enregistrement) et à des prêts sociaux. Bien préparé, ton apport peut être limité à 5-10 % du prix au lieu des 20 % standards.",
    content: `## Avant de chercher : connaître ton budget réel

Un achat = **prix du bien + frais d'acquisition** (notaire, droits d'enregistrement, hypothèque). Compte **environ 12 à 15 % du prix en Région bruxelloise et wallonne**, et **3 à 5 % en Flandre** (les régions ont chacune leur fiscalité).

### Apport personnel

- **Standard** : 20 % du prix + tous les frais en cash
- **Avec prêt social** ou **primo-acquéreur** : peut descendre à **5-10 %**
- **Sans aucun apport** : possible mais rare, taux d'intérêt majoré

## Les 3 leviers d'aide pour primo-acquéreur

### 1. L'abattement sur les droits d'enregistrement

C'est l'avantage **massif** réservé au premier achat de ta résidence principale.

- **Région bruxelloise** : abattement sur les premiers **200 000 €** (vérifie le seuil 2026 actuel sur [fisc.brussels](https://fiscalite.brussels)) → tu économises plusieurs **milliers d'euros** sur les droits.
- **Région wallonne** : abattement de **40 000 €** sur la base imposable, sous conditions.
- **Région flamande** : taux réduit à **3 %** au lieu de 12 % pour le premier achat.

→ **Conditions** : être personne physique, ne pas avoir d'autre bien immobilier, occuper le bien comme résidence principale dans les 2-3 ans selon la région.

### 2. Le prêt social

- **Bruxelles** : Fonds du Logement (FLB), prêts à taux réduits selon revenus
- **Wallonie** : Société wallonne du Crédit social (SWCS) + Fonds du Logement Wallon
- **Flandre** : VMSW

Plafonds de revenus à respecter (vérifiés annuellement). Si tu y as droit : **taux entre 1,5 et 3 %** vs 3,5-4 % en banque privée. Énorme.

### 3. La prime d'acquisition / habitation

Selon la commune et la région, des primes ponctuelles existent (rénovation énergétique, primo-acquéreur, isolation). Renseigne-toi auprès de ta commune **après** signature.

## Les étapes, dans l'ordre

### 1. Faire ta « capacité d'emprunt »
Va en banque (ou chez un courtier indépendant) avec : tes 3 dernières fiches de paie, contrat de travail, dernier avis d'impôt, état du compte épargne. La banque te dit combien tu peux emprunter. **Compare au moins 3 banques** — les écarts vont jusqu'à 0,5 % de taux = 30 000 € sur 25 ans.

### 2. Visiter
Ne signe **rien** sans avoir vu :
- l'état du chauffage et de la chaudière
- l'isolation (PEB obligatoire à l'annonce)
- les charges de copropriété (en appartement)
- la toiture (recoin pour traces d'humidité)

### 3. Faire ton offre via compromis
**Le compromis t'engage déjà.** Tu signes, tu verses 5-10 % d'acompte. Tu as souvent **4 mois max** pour finaliser le prêt et passer chez le notaire.

### 4. Signature notaire
Le notaire te lit l'acte. C'est là que les droits sont calculés. Apporte ta preuve d'être primo-acquéreur (déclaration sur l'honneur + extrait de cadastre).

## Les pièges fréquents

- **Compromis sous condition suspensive de prêt** : exige la mention « obtenir le prêt à un taux maximum de X % » sinon tu peux perdre l'acompte si la banque refuse.
- **PEB optimiste** : un certificat « C » sur le papier mais une cave humide = tu paieras la rénovation. Fais venir un copain dans le bâtiment ou paie 200 € pour un audit indépendant.
- **Charges de copropriété** : demande **les 3 derniers PV d'AG** et le carnet d'entretien. Découvrir un ravalement de façade à 8 000 € après l'achat = drame.
- **Bouger de région** : l'abattement primo-acquéreur ne s'applique que dans la région d'achat. Si tu déménages de Bruxelles à Liège pour acheter, tu perds l'abattement bruxellois.

## Liens directs

- **Bruxelles** : [fiscalite.brussels](https://fiscalite.brussels) (abattement) · [fonds.brussels](https://fonds.brussels) (Fonds du Logement)
- **Wallonie** : [swcs.be](https://www.swcs.be) · [flw.be](https://www.flw.be)
- **Flandre** : [vmsw.be](https://www.vmsw.be)
- Comparateur de prêts hypothécaires : [meilleurtaux.be](https://www.meilleurtaux.be), [topcompare.be](https://www.topcompare.be)

## Besoin d'un humain ?

Un **courtier en crédits indépendant** négocie ton prêt avec 5-10 banques en parallèle. Souvent rémunéré par la banque retenue (gratuit pour toi). Pour l'aspect fiscal/notaire : un **avocat ou notaire diaspora** peut te suivre — voir Démarches sur Bisso.
`,
  },
  {
    slug: "garantie-locative-belgique",
    title: "Garantie locative : 4 façons de l'obtenir quand tu n'as pas 3 mois",
    category: "logement",
    readingMinutes: 6,
    authorName: "Équipe Bisso",
    heroImage: u("1554224154-26032ffc0d07"),
    tldr:
      "La garantie locative belge représente jusqu'à 3 mois de loyer. Si tu ne peux pas l'avancer, 4 voies existent : compte bloqué bancaire, garantie CPAS, fonds régional, ou caution personnelle. Aucune n'est secrète, mais peu de propriétaires les acceptent volontiers — il faut argumenter.",
    content: `## Combien et où

- **Garantie locative classique** : jusqu'à **3 mois de loyer** (BXL et Wallonie), bloquée sur un compte au nom du locataire.
- L'argent reste à toi, le propriétaire ne peut le toucher qu'avec accord écrit ou décision de justice.
- **Le propriétaire ne peut pas le réclamer en cash** ou virement direct sur son compte. C'est illégal en Belgique.

## Les 4 voies pour l'obtenir

### 1. Compte bloqué en banque (la voie standard)

Tu ouvres un **compte de garantie locative** dans ta banque (ING, BNP, Belfius, KBC… toutes le font, certaines gratuitement). Tu y mets l'équivalent de **2 mois** de loyer (BXL : 2 mois si compte bloqué, 3 mois si en cash).

Inconvénient : il faut avoir l'argent sur le compte le jour J.

### 2. Garantie via le CPAS (si tu n'as pas l'argent)

Conditions : revenus modestes, motif de logement.

- Tu vas à ton **CPAS communal**, tu remplis un formulaire, tu présentes le bail proposé.
- Le CPAS verse la garantie **directement** sur le compte bloqué.
- Tu rembourses **mensuellement**, en général sans intérêts, ou tu peux le solder en une fois.

→ Souvent perçu comme « stigmatisant » par les bailleurs. **C'est totalement légal** et de plus en plus accepté.

### 3. Fonds du Logement (Bruxelles, Wallonie)

Pour les ménages avec des revenus en dessous d'un certain plafond.

- **Bruxelles : Fonds du Logement (BRUGAL)** — [fonds.brussels](https://fonds.brussels)
- **Wallonie : SWL** — Société wallonne du Logement

Le Fonds **avance la garantie** et tu la rembourses ensuite.

### 4. Caution personnelle / cautionnement bancaire

Un proche se porte caution avec son patrimoine, ou ta banque émet une **garantie bancaire** (1-2 % du montant en frais annuels). Le propriétaire peut refuser cette voie — il préfère du cash bloqué.

## Les étapes, dans l'ordre

### 1. Réserver le bien sans la garantie en main

Dans ta candidature, mentionne que la garantie passera par le **CPAS** ou le **Fonds du Logement** si c'est le cas. Joins une **lettre du CPAS** confirmant ta demande en cours.

### 2. Si CPAS / Fonds : monte le dossier

- Carte d'identité, composition de ménage
- 3 derniers contrats de travail / fiches de paie / attestation Onem
- Le bail proposé (signé sous condition suspensive de la garantie)

### 3. Le compte bloqué s'ouvre au nom du locataire

Le bailleur signe un **document de blocage**. Il ne peut pas le débloquer seul.

### 4. Quand tu pars : état des lieux de sortie

- Si tout est OK : tu signes la mainlevée, l'argent revient sur ton compte courant en quelques jours.
- Si litige : justice de paix gratuite ou médiation. **Ne signe pas la mainlevée** si tu contestes.

## Les pièges

- **« Tu me donnes 1 mois en cash, j'écris reçu »** : illégal, refuse. Le bailleur n'a aucun recours s'il garde ton cash.
- **Bail commencé sans garantie versée** : le bailleur peut résilier. Verse-la **avant ou à l'entrée**.
- **Pas de constat d'état des lieux d'entrée** : à la sortie, le bailleur peut tout mettre sur ton dos. **Exige toujours un état des lieux contradictoire**, daté et signé, avec photos.
- **CPAS « refusé » à l'oral** : demande un refus **écrit**. Souvent ils acceptent quand on insiste.

## Liens directs

- Garantie locative Bruxelles : [logement.brussels/garantie-locative](https://logement.brussels)
- Garantie locative Wallonie : [logement.wallonie.be](https://logement.wallonie.be)
- Fonds du Logement Bruxelles : [fonds.brussels](https://fonds.brussels)
- Médiation locative : Atrium asbl, BAPA, Maison de Quartier de ta commune

## Besoin d'un humain ?

Si tu galères avec le CPAS, un **assistant social diaspora** débloque souvent les choses en une semaine. Un **avocat pro deo** est gratuit si tes revenus sont sous le plafond. Voir Démarches administratives sur Bisso.
`,
  },
  {
    slug: "regroupement-familial-belgique",
    title: "Regroupement familial en Belgique : faire venir conjoint, enfants, parents",
    category: "citoyennete",
    readingMinutes: 10,
    authorName: "Équipe Bisso",
    heroImage: u("1503454537195-1dcabb73ffb9"),
    tldr:
      "Le regroupement familial te permet de faire venir ton conjoint, tes enfants mineurs, et dans certains cas tes parents. Conditions : revenu stable + logement décent + assurance maladie. C'est un dossier lourd, monté en 6-12 mois, qui se joue sur la rigueur des pièces.",
    content: `## Qui peut être regroupé

### Si tu es Belge ou citoyen de l'UE

- **Conjoint(e)** ou partenaire enregistré
- **Enfants mineurs** (jusqu'à 18 ans) du couple ou d'une union précédente
- **Enfants majeurs handicapés**
- Dans certains cas : **parents** ou **descendants à charge**

### Si tu as un titre de séjour belge (carte A, B, F)

Conditions plus strictes :
- Conjoint et enfants mineurs uniquement (en général)
- Le conjoint doit avoir **21 ans** (sauf exceptions)
- **Délai d'attente** parfois imposé selon ton statut

## Les conditions clés

### 1. Revenus stables et suffisants

Tu dois prouver que tu gagnes **au moins 120 % du revenu d'intégration** (montant qui change chaque année — vérifie le chiffre 2026 sur [dofi.ibz.be](https://dofi.ibz.be)). En 2026, compte **environ 1 800-2 000 €/mois nets** stables.

→ CDI, indépendant qui tourne, retraite suffisante, allocations de chômage durables.
→ **Pas accepté** : CDD courts, intérim irrégulier, RIS du CPAS.

### 2. Logement décent

Tu dois avoir **assez de chambres** pour la famille élargie. Critères belges :
- 1 chambre par couple
- 1 chambre pour 2 enfants du même sexe < 12 ans
- Au-delà : 1 chambre pour 2 enfants

Atteste-le avec un **bail enregistré** ou ton titre de propriété.

### 3. Assurance maladie

Tous les regroupés doivent être couverts par **ta mutuelle** ou une assurance équivalente. Demande à ta mutuelle l'attestation de couverture familiale.

### 4. Pas de menace pour l'ordre public

Casier vierge en Belgique et au pays d'origine.

## Le dossier qui passe

### Pièces côté Belgique

- Acte de naissance + reconnaissance des enfants (avec mentions marginales si applicable)
- Certificat de mariage (ou de partenariat enregistré)
- Composition de ménage récente (commune)
- 3 derniers contrats / fiches de paie / extrait BCE si indépendant
- Attestation de revenus du SPF Finances
- Preuve de logement (bail enregistré ou titre de propriété)
- Attestation mutuelle
- Extrait de casier judiciaire belge

### Pièces côté pays d'origine (RDC, Brazza, Cameroun…)

- Acte de naissance avec mentions marginales (mariage, reconnaissance)
- Acte de mariage récent
- Extrait de casier judiciaire récent
- Passeport en cours de validité
- **Photos d'identité aux normes**

→ **Tous les actes étrangers** doivent être :
1. **Légalisés** par le ministère des affaires étrangères du pays d'origine
2. Puis **légalisés** par l'ambassade de Belgique sur place
3. Puis **traduits** par traducteur juré belge si non en français/néerlandais/anglais/allemand

C'est ce qui prend le plus de temps. Compte **2-4 mois rien que pour cette étape** depuis Kinshasa.

### Visa

Le conjoint dépose la demande de visa **D (long séjour)** à l'ambassade de Belgique de son pays. Délai : **6 mois maximum** pour décision (souvent 3-6 mois en pratique).

## Les étapes après l'arrivée en Belgique

### 1. Sous 8 jours
Inscription à la commune. La police peut faire un contrôle de résidence.

### 2. 1-3 mois après
Récupération de la **carte F** (membre de famille d'un Belge/Européen) ou **carte A** (titulaire d'un titre temporaire).

### 3. Renouvellement
La première carte est souvent valable **3 ans**, renouvelable, puis **carte F+ permanente** après 5 ans.

## Les pièges qui font refuser

- **Acte de mariage trop récent** par rapport à la date de la demande : suspect. Évite le mariage 6 mois avant la demande sans relation prouvée avant.
- **Manque d'historique de couple** : photos, billets de voyage, factures de transferts d'argent au conjoint, échanges WhatsApp datés. Garde tout.
- **Légalisation incomplète** : un seul tampon manquant = refus. La double légalisation (pays + ambassade belge) est non-négociable.
- **Revenus pile au seuil** : monte un dossier qui dépasse confortablement le seuil, pas juste à 5 €. Sécurise.
- **Logement signé après la demande** : le bail doit être antérieur à la décision.

## Délais réalistes

| Étape | Durée moyenne |
|---|---|
| Constituer le dossier en Belgique | 2-4 semaines |
| Légalisation acte étranger (Kinshasa) | 2-4 mois |
| Visa à l'ambassade | 3-6 mois |
| **Total avant arrivée** | **6-12 mois** |
| Carte F en main | 1-3 mois après inscription |

## Liens directs

- Office des Étrangers : [dofi.ibz.be](https://dofi.ibz.be)
- Ambassade de Belgique en RDC : [diplomatie.belgium.be/fr/ambassade-belgique-en-rdc](https://countries.diplomatie.belgium.be)
- ADDE (avocats droits étrangers) : [adde.be](https://www.adde.be)

## Besoin d'un humain ?

Pour un regroupement familial, **un avocat en droit des étrangers est presque toujours rentable** (500-1500 €). Beaucoup d'avocats diaspora sont spécialisés et connaissent les officiers de l'OE qui traitent les dossiers. Voir Démarches administratives sur Bisso.
`,
  },
  {
    slug: "renouveler-titre-sejour-belgique",
    title: "Renouveler ton titre de séjour : à quel moment, quelles pièces",
    category: "citoyennete",
    readingMinutes: 6,
    authorName: "Équipe Bisso",
    heroImage: u("1586769852836-bc069f19e1b6"),
    tldr:
      "Tu dois introduire la demande de renouvellement entre 30 et 45 jours avant l'expiration de ta carte. Pas avant, pas après. La commune peut te délivrer un document provisoire (annexe 15) si la décision tarde. Trop tard = risque de devoir tout reprendre depuis le début.",
    content: `## Quand introduire la demande

**Entre 45 et 30 jours avant l'expiration** de ta carte actuelle.

- **Trop tôt** (>45 jours) : la commune refusera de prendre la demande.
- **Trop tard** (<30 jours, ou pire, après expiration) : tu peux te retrouver en séjour irrégulier, perdre tes droits sociaux, et devoir refaire une demande complète au lieu d'un renouvellement.

→ **Mets une alerte dans ton téléphone 60 jours avant la date d'expiration.** C'est l'erreur n°1.

## Les pièces selon ton type de carte

### Carte A (séjour temporaire — étudiant, travail, regroupement initial)

- Carte d'identité actuelle
- 4 photos d'identité aux normes belges (35×45 mm, fond blanc)
- Preuve de la raison du séjour **toujours valable** :
  - **Étudiant** : attestation d'inscription pour l'année académique suivante + assurance maladie + preuve de moyens d'existence
  - **Travail** : contrat de travail en cours + autorisation de travail si applicable
  - **Regroupement** : extrait de composition de ménage récent + preuve de cohabitation

### Carte B (séjour de plus longue durée)

- Mêmes pièces que la carte A
- **Pas de risque d'OQTF** si retard < 30 jours (mais ne tente pas)

### Carte F (membre de famille de citoyen UE/Belge)

- Pièces de base + preuve que la relation est toujours d'actualité (composition de ménage, photos communes, factures, etc.)
- **Si séparation** : impacte ton droit de séjour. Va voir un avocat avant de déclarer.

### Carte F+ ou carte de séjour permanent

- Renouvellement quasi-automatique tous les 10 ans
- Juste le formulaire + photos + droit communal (~30-50 €)

## Les étapes

### 1. RDV à la commune

Pris en ligne ou par téléphone. **Délais souvent longs en BXL** (1-3 semaines pour avoir un RDV) → **prends ton RDV 60 jours avant**, même si la demande sera introduite à 30-45 jours.

### 2. Dépôt du dossier

L'agent te délivre :
- Une **annexe 15** (« attestation de séjour provisoire ») valable jusqu'à la décision
- Avec elle, tu gardes **tous tes droits** : travail, allocations, mutuelle, voyage en zone Schengen (vérifie selon ton type de carte)

### 3. Attente de la décision (1-6 mois)

Pendant ce temps, l'annexe 15 est régulièrement prolongée si nécessaire. Pas de stress.

### 4. Récupération de la nouvelle carte

Tu reçois un courrier de la commune. **Apporte 4 photos**, paie le droit communal (entre 25 et 60 € selon la commune), récupère ta nouvelle carte.

## Les pièges fréquents

- **Carte expirée pendant un voyage** : si tu es à l'étranger quand elle expire, tu ne peux plus rentrer en Schengen avec elle. Reviens **avant** l'expiration.
- **Conditions du séjour qui ne tiennent plus** : étudiant qui a arrêté ses études, regroupé qui s'est séparé, travailleur qui a perdu son emploi. **Tu dois prévenir la commune** sous 8 jours, et l'OE peut décider de retirer le séjour. Mieux vaut anticiper et chercher un autre motif (autre emploi, demande humanitaire, etc.).
- **Casier judiciaire récent** : un délit en Belgique, même mineur, peut bloquer un renouvellement. Attention aux amendes routières non payées.
- **Composition de ménage erronée** : si la commune a une mauvaise adresse pour toi, le renouvellement bloque. Mets-la à jour 6 mois avant.

## Cas spécial : passer d'une carte temporaire à un séjour illimité

Après **5 ans de séjour légal continu** en Belgique, tu peux demander la **carte F+ (citoyen UE)** ou la **carte K (séjour illimité)**. Plus stable, plus de tampon de renouvellement tous les 1-3 ans.

À demander en même temps que ton renouvellement classique. Ça vaut largement le coup.

## Liens directs

- Office des Étrangers : [dofi.ibz.be](https://dofi.ibz.be)
- Ta commune : recherche « commune de [ville] regroupement séjour » sur Google
- Aide juridique : [aidejuridique.be](https://www.aidejuridique.be) (avocat pro deo si revenus modestes)

## Besoin d'un humain ?

Si ta situation a changé (séparation, perte d'emploi, problème judiciaire), **consulte un avocat AVANT** de demander le renouvellement. Souvent une consultation à 80-150 € évite un refus. Voir Démarches sur Bisso.
`,
  },
  {
    slug: "reconnaissance-diplome-etranger-belgique",
    title: "Reconnaissance de diplôme étranger : médecin, infirmier, ingénieur, prof",
    category: "etudiant",
    readingMinutes: 8,
    authorName: "Équipe Bisso",
    heroImage: u("1454165804606-c3d57bc86b40"),
    tldr:
      "Ton diplôme du Congo (ou d'ailleurs) ne te permet pas d'exercer en Belgique tant qu'il n'est pas reconnu. Selon la profession, c'est soit une équivalence académique (rapide, 3-6 mois) soit une reconnaissance professionnelle complète (1-3 ans, parfois avec cours et stages).",
    content: `## Deux types de reconnaissance différents

### 1. Équivalence académique

Pour **étudier ou candidater à un emploi** où le diplôme suffit.
- Délivrée par le **Service des Équivalences (Wallonie-Bruxelles)** ou **NARIC-Vlaanderen** (Flandre).
- Délai : **3-6 mois**, parfois moins.
- Coût : **150-200 €** (gratuit pour réfugiés et certains statuts).

### 2. Reconnaissance professionnelle (= droit d'exercer un métier réglementé)

Pour les **métiers réglementés** : médecin, infirmier, kinésithérapeute, dentiste, sage-femme, pharmacien, vétérinaire, avocat, architecte, comptable agréé, etc.
- Délivrée par les **autorités sectorielles** (ordre professionnel, ministère de la santé, etc.).
- Délai : **1-3 ans** souvent, avec parfois des **épreuves d'aptitude** ou des **stages d'adaptation**.
- Coût : variable, peut être lourd selon la formation complémentaire.

→ **Tu peux demander les deux en parallèle.** L'équivalence académique te débloque déjà des emplois non-réglementés (administration, recherche, enseignement non-réglementé).

## Le dossier équivalence académique (Wallonie-Bruxelles)

### Pièces

- **Diplôme original** (ou copie certifiée conforme par autorité compétente)
- **Relevé de notes complet** par année
- **Programme des études** (matières, heures de cours par matière)
- **Certificat d'authenticité** délivré par l'établissement d'origine
- **Légalisations** : ministère de l'éducation du pays + ambassade de Belgique
- **Traduction par traducteur juré belge** si pas en FR/NL/EN/DE
- **Photocopie carte d'identité belge ou titre de séjour**

### Étapes

1. **Préparer les pièces au pays d'origine** (le plus long — compte 3-6 mois pour les actes universitaires congolais légalisés depuis Kin)
2. **Déposer la demande** sur [equivalences.cfwb.be](http://www.equivalences.cfwb.be)
3. **Suivre l'avancée** sur ton compte en ligne
4. **Recevoir la décision** : équivalence intégrale, partielle, ou refus motivé

### Délais réalistes

- Diplôme secondaire : **3-4 mois**
- Diplôme supérieur (bachelor/master) : **6-9 mois**
- Diplôme de doctorat : **9-12 mois**

## Cas spécifiques : professions de santé

### Médecin

- Équivalence académique du diplôme + **épreuve d'aptitude** organisée par l'ARES
- Si formation jugée incomplète : **stage d'adaptation** de 6 mois à 3 ans en hôpital belge sous tutorat
- Inscription à l'**Ordre des Médecins** une fois la reconnaissance obtenue
- **Réalité** : beaucoup de médecins congolais finissent par refaire un master ou se spécialiser. **Pré-doctorat à l'ULB ou UCLouvain** est une voie alternative.

### Infirmier

- Reconnaissance des qualifications professionnelles via le **SPF Santé Publique**
- Souvent : **stage d'adaptation** ou **cours complémentaires**
- Démarche : [health.belgium.be/fr/sante](https://www.health.belgium.be)

### Pharmacien, dentiste, kinésithérapeute, sage-femme

Mêmes règles que médecin : équivalence académique + reconnaissance professionnelle + ordre.

### Avocat

- Équivalence académique du master en droit
- **CAPA** (Certificat d'Aptitude à la Profession d'Avocat) à passer
- 3 ans de stage en cabinet

## Les pièges fréquents

- **Légalisation incomplète** : la double légalisation (ministère + ambassade) est obligatoire. Un tampon qui manque = dossier renvoyé après 4 mois d'attente.
- **Programme de cours pas joint** : sans détails des matières et heures, l'équivalence est souvent **partielle** au lieu d'intégrale. Exige le programme officiel de ton université.
- **Diplôme pas authentifié** par l'établissement : un certificat « tampon de recteur » est souvent requis. Vérifie auprès du Service des Équivalences avant de rentrer en Belgique.
- **Passer par un intermédiaire payant** : 90 % du temps, un cabinet « équivalences-experts.com » ne fait que ce que tu peux faire seul. Il prend 500-1500 €.

## Liens directs

- Service des Équivalences (Wallonie-Bruxelles) : [equivalences.cfwb.be](http://www.equivalences.cfwb.be)
- NARIC-Vlaanderen : [naric.be](https://naricvlaanderen.be)
- SPF Santé (professions de santé) : [health.belgium.be](https://www.health.belgium.be)
- Ordre des Médecins : [ordomedic.be](https://ordomedic.be)
- Ordre des Pharmaciens : [ordredespharmaciens.be](https://www.ordredespharmaciens.be)

## Besoin d'un humain ?

Pour un dossier médecin/infirmier, **un conseiller en orientation universitaire** te dit en 1h ce qui est jouable et ce qui demandera 5 ans de plus. L'**ARES** (Wallonie-Bruxelles) propose ce service gratuitement. Côté Bisso : un répétiteur peut t'aider à préparer l'épreuve d'aptitude.
`,
  },
  {
    slug: "choisir-mutuelle-belgique",
    title: "Choisir sa mutuelle en Belgique : Solidaris, Mutualité chrétienne, Partenamut",
    category: "pratique",
    readingMinutes: 6,
    authorName: "Équipe Bisso",
    heroImage: u("1576091160550-2173dba999ef"),
    tldr:
      "En Belgique, t'inscrire à une mutuelle est obligatoire mais tu choisis laquelle. Toutes remboursent la base à l'identique (loi). La différence est dans les avantages complémentaires : orthodontie, lunettes, médecines douces, voyages. Compare les complémentaires pour les soins que tu utilises vraiment.",
    content: `## Pourquoi tu DOIS être à une mutuelle

- L'inscription est **obligatoire** dès que tu travailles ou résides légalement.
- La mutuelle te rembourse **l'assurance maladie obligatoire** (AMI) — partie payée par tes cotisations sociales et impôts.
- Sans mutuelle : tu paies tout en plein tarif, et il faut régulariser à un moment.

## Les principales mutuelles belges

| Mutuelle | Tendance | Particularité |
|---|---|---|
| **Solidaris** | Socialiste | Plus avantageuse souvent en orthodontie, lunettes, vacances |
| **Mutualité chrétienne (MC / CM)** | Chrétienne | La plus grande, services bien rodés, app correcte |
| **Partenamut** | Libérale (apparentée MLOZ) | Souvent compétitive en Bruxelles, services premium |
| **Helan** | Néerlandophone (Flandre) | Présence forte en Flandre |
| **Mutualité libérale** | Libérale | Choisie pour les indépendants surtout |
| **Caisse Auxiliaire** (CAAMI) | Indépendante de l'État | Bon recours si tu n'aimes aucune mutuelle « politique » |

→ **Toutes remboursent la même chose pour l'assurance obligatoire.** La différence se joue **uniquement sur l'assurance complémentaire** (~9-12 €/mois) qui finance les avantages bonus.

## Ce qui change vraiment d'une mutuelle à l'autre

### Orthodontie enfants/ados (énorme)

Si tu as un ado qui a besoin de bagues : facture brute **1 500-3 500 €**. Selon la mutuelle :
- Solidaris : remboursement bonus jusqu'à **1 100 €** environ
- Mutualité chrétienne : **800-1 000 €**
- Partenamut : **1 200-1 500 €** sur les meilleurs forfaits

→ Si tu sais que ton enfant aura besoin d'orthodontie : **Partenamut ou Solidaris** souvent gagnent.

### Lunettes / lentilles

- Toutes remboursent **150-250 € tous les 2 ans** environ pour un adulte
- Solidaris et Partenamut souvent un peu plus généreuses
- Pour les enfants < 18 ans : remboursement majoré chez plusieurs

### Médecines complémentaires (ostéopathie, psychologie, kinésithérapie spécifique)

- **Solidaris** et **Partenamut** sont en général les plus généreuses : 10 à 15 séances/an remboursées
- Mutualité chrétienne : variable selon les régions et les forfaits

### Soins en pédiatrie / vaccinations privées / orthophonie

- Mutualité chrétienne souvent forte sur les enfants (logique, c'est la plus grande)

### Hospitalisation

L'assurance hospitalisation est **séparée** de la mutuelle de base. Vérifie si elle est **incluse** dans l'assurance complémentaire ou si tu dois souscrire une **assurance hospi** séparée (DKV, AG Insurance, ta banque).

### Vacances pour enfants

- Solidaris organise des camps Latitude Jeunes
- Mutualité chrétienne : Ocarina (camps de vacances)
- Souvent **massivement subventionnés** (un camp à 700 € te coûte 200-300 €)

## La méthode pour choisir

### 1. Liste tes soins de l'année passée

- Ortho ? Lunettes ? Kiné ? Psy ? Hospi ? Camps enfants ?

### 2. Compare 3 mutuelles sur ces postes

Sur leur site officiel, chaque mutuelle a un **simulateur de remboursement complémentaire**.

### 3. Vérifie l'assurance hospitalisation

Si elle est incluse dans la complémentaire, c'est un gros plus (économise 200-500 €/an).

### 4. Décide en fonction de la **prochaine** année prévisible

(orthodontie d'un ado qui arrive, grossesse prévue, opération à programmer…)

## Comment changer de mutuelle

- **Pas de pénalité.** Tu peux changer **une fois par trimestre** (1er janvier, 1er avril, 1er juillet, 1er octobre).
- **Procédure** : tu vas à la nouvelle mutuelle avec ta carte d'identité. Elle se charge de prévenir l'ancienne.
- **Ne fais pas de double inscription.**

## Les pièges

- **Souscrire à toutes les options** : la complémentaire « premium » peut coûter **18-25 €/mois** au lieu de 10-12 €. Si tu n'utilises pas les options, c'est de l'argent jeté.
- **Oublier la carte SIS / eID** : ta mutuelle s'enregistre sur ta carte d'identité électronique. Sans ça, le médecin ne sait pas te tarifer correctement.
- **Tiers payant** : pour les visites médecin, **demande à activer le tiers payant** (le médecin facture directement la mutuelle). Tu paies juste le ticket modérateur (1-4 €) au lieu de 25-30 € à avancer.

## Liens directs

- Solidaris : [solidaris.be](https://www.solidaris.be)
- Mutualité chrétienne : [mc.be](https://www.mc.be)
- Partenamut : [partenamut.be](https://www.partenamut.be)
- CAAMI (Caisse Auxiliaire) : [caami-hziv.be](https://www.caami-hziv.fgov.be)
- Comparatif INAMI : [inami.fgov.be](https://www.inami.fgov.be)

## Besoin d'un humain ?

Si tu hésites, **rends-toi en agence physique** d'une mutuelle (Solidaris, MC, Partenamut ont des comptoirs partout). 30 minutes de conseil gratuit. Peu de gens savent qu'on peut obtenir un comparatif chiffré en agence.
`,
  },
  {
    slug: "forem-actiris-vdab-inscription",
    title: "S'inscrire au FOREM, Actiris ou VDAB : sans se faire radier",
    category: "pratique",
    readingMinutes: 7,
    authorName: "Équipe Bisso",
    heroImage: u("1497032205916-ac775f0649ae"),
    tldr:
      "L'inscription comme demandeur d'emploi est obligatoire pour percevoir le chômage et garde tes droits sociaux. Mais les sanctions pour absence à un RDV ou refus d'offre peuvent te faire perdre des semaines d'allocations. Voici les règles, les pièges, et comment ne pas te faire radier.",
    content: `## Quel service selon ta région

- **Bruxelles** : Actiris ([actiris.brussels](https://www.actiris.brussels))
- **Wallonie** : Le Forem ([forem.be](https://www.leforem.be))
- **Flandre** : VDAB ([vdab.be](https://www.vdab.be))

→ Tu t'inscris **dans la région où tu es domicilié**. Si tu déménages, tu fais le transfert.

## Quand tu DOIS t'inscrire

- Au **chômage** (cherche allocations Onem)
- À la **fin de tes études** (stage d'insertion professionnelle)
- En **arrêt CPAS** qui te demande d'être disponible au travail
- Si tu **cherches un emploi** sans toucher d'allocations (utile pour formations)

## L'inscription : étape par étape

### 1. En ligne d'abord

Crée ton compte sur le site régional avec ton **eID** (lecteur de carte) ou via **itsme**. Remplis ton profil avec :
- Identité, adresse
- Diplômes, langues, expériences
- **Disponibilité géographique et horaire**
- **Métiers recherchés**

### 2. Premier RDV physique (1-3 semaines après l'inscription en ligne)

Tu rencontres un **conseiller**. Il :
- Vérifie ton CV
- Définit avec toi un **plan d'action** (ce que tu vas faire)
- Te propose éventuellement une **formation** ou un **bilan de compétences**

### 3. Suivi régulier

Tous les **3-6 mois** : RDV de contrôle obligatoire. **NE JAMAIS rater un RDV sans prévenir.**

## Les obligations à respecter

### Disponibilité active

- Recherches actives d'emploi (en moyenne **8-12 candidatures/mois**)
- Garder une **trace écrite** de chaque candidature (e-mail envoyé, capture d'écran)
- **Te déplacer aux entretiens** que ton conseiller t'envoie

### Disponibilité administrative

- Répondre aux courriers/e-mails dans les **délais** (souvent 8 jours)
- Pas de voyage > 4 semaines sans prévenir
- Garder ton adresse à jour

### Refus d'offre

Tu peux refuser une offre si elle est **manifestement inadaptée** (compétences, salaire largement en dessous, lieu impossible). **Trois refus injustifiés** → sanction.

## Les sanctions et comment les éviter

| Faute | Sanction probable |
|---|---|
| Manquer un RDV sans excuse | **Avertissement** (1ère fois), puis suspension d'allocations |
| Refuser un emploi convenable | Suspension de **4 à 52 semaines** |
| Recherche d'emploi insuffisante | **Suspension partielle** des allocations |
| Fraude (faux document, double activité non déclarée) | **Radiation + remboursement** + parfois pénal |

→ **Si tu rates un RDV** : envoie un e-mail le jour même (avec preuve médicale, justification, ou deuil). Demande un nouveau RDV. Souvent l'avertissement passe sans sanction.

## Les pièges fréquents

- **Penser que « je suis au RIS du CPAS, pas besoin de FOREM »** : faux. Le CPAS exige souvent l'inscription FOREM/Actiris pour continuer le RIS.
- **Cacher du travail au noir** : un signalement (par un voisin, un employeur, fisc) = radiation totale + remboursement de toutes les allocations perçues. **Le risque n'en vaut jamais la peine.**
- **Refuser un job sans rien dire** : préviens ton conseiller en amont si tu vas refuser. Argumente par écrit.
- **Partir au pays > 4 semaines** sans prévenir : suspension automatique.
- **Ne pas répondre à un courrier** : ce qui paraît anodin (un courrier sur un changement d'adresse) peut suspendre tes droits si tu ne réponds pas.

## Les services qui valent le coup

### Formations gratuites

- **Formation langue** (français, néerlandais, anglais) : souvent gratuite, parfois indemnisée
- **Formation pro** (informatique, comptabilité, métiers de la santé) : 6-12 mois, indemnisée
- **VAE** (Validation des Acquis de l'Expérience) : transformer 5 ans d'expérience non-diplômée en certification

### Job-coaching

Conseiller dédié pendant 3-6 mois pour booster ta recherche. **Demande-le explicitement** — ce n'est pas automatique.

### Aides à l'embauche

Quand tu trouves un employeur, plusieurs aides existent (Activa, ACS, etc.) qui réduisent le coût pour lui. **Mentionne-les dans ta lettre de motivation** — ça augmente tes chances.

## Liens directs

- Actiris (Bruxelles) : [actiris.brussels](https://www.actiris.brussels)
- Le Forem (Wallonie) : [leforem.be](https://www.leforem.be)
- VDAB (Flandre) : [vdab.be](https://www.vdab.be)
- ONEM (allocations chômage) : [onem.be](https://www.onem.be)
- Aide juridique gratuite si litige : [aidejuridique.be](https://www.aidejuridique.be)

## Besoin d'un humain ?

Si tu te fais sanctionner, **un avocat pro deo** (gratuit sous condition de revenus) peut faire un recours. **Ne signe rien d'auto-incriminant** sans conseil juridique. Voir Démarches sur Bisso.
`,
  },
  {
    slug: "trente-premiers-jours-belgique",
    title: "30 premiers jours en Belgique : la check-list complète",
    category: "pratique",
    readingMinutes: 9,
    authorName: "Équipe Bisso",
    heroImage: u("1450101499163-c8848c66ca85"),
    tldr:
      "Tu viens d'arriver en Belgique. Voici exactement ce que tu fais les 30 premiers jours, dans l'ordre, pour ne rien oublier de critique : commune, numéro national, mutuelle, banque, mutuelle, médecin, FOREM. Suis cette liste et tu auras posé toutes les bases.",
    content: `## Avant même d'arriver

- **Visa et passeport** : vérifie que tu as bien le visa adapté (long séjour D, étudiant, regroupement, touriste 90 jours…). Le visa Schengen 90 jours **ne permet pas** de t'installer.
- **Adresse à l'arrivée** : prévois où tu loges les 8 premiers jours minimum. Sans adresse fixe, tu ne peux pas t'inscrire à la commune.

## Semaine 1 — l'inscription à la commune

C'est la priorité absolue. Tout le reste en dépend.

### J1 — RDV à la commune

- Va à la **commune où tu loges** (administration communale).
- Demande à t'inscrire au registre de population (résidents) ou registre des étrangers (non-Belges).
- Pièces à apporter :
  - Passeport ou carte d'identité (selon ton statut)
  - Visa long séjour (si applicable)
  - **Acte de naissance** (idéalement déjà légalisé et traduit)
  - Justificatif de domicile : bail ou attestation d'hébergement chez un proche
  - 4 photos d'identité aux normes belges

### J3-J15 — Visite de la police

Un agent passe **chez toi** sans prévenir pour vérifier que tu y habites vraiment. **Sois là ou laisse un mot avec ton numéro.** Sans contrôle de résidence, l'inscription ne se finalise pas.

### J20-J30 — Numéro national et carte

Tu reçois un courrier avec ton **numéro national** belge (RRN). Tu retournes à la commune chercher ta **carte d'identité électronique (eID)** ou ton **titre de séjour** selon ton statut. Coût : 25-60 €. Apporte 4 photos.

→ **Sans numéro national**, tu ne peux : ni ouvrir un compte en banque, ni t'inscrire à la mutuelle, ni travailler officiellement, ni avoir un contrat téléphonique.

## Semaine 2 — Mutuelle et médecin

### S'inscrire à la mutuelle

Choisis-en une (voir le guide « Choisir sa mutuelle »).

- Va dans une agence avec ta **carte d'identité belge** (donc après réception de l'eID/titre de séjour).
- Coût : **gratuit** pour l'assurance obligatoire. Complémentaire **9-12 €/mois**.
- Tu reçois ta **carte de tiers payant** sous 2-4 semaines.

### Trouver un médecin de famille

- Idéalement un **médecin généraliste** dans ta commune
- Demande à des voisins, à la mutuelle, ou cherche sur [doctoranytime.be](https://www.doctoranytime.be)
- Beaucoup de médecins n'acceptent **plus de nouveaux patients** — appelle plusieurs cabinets
- **Médecins diaspora** dans certaines communes (Matonge, Anderlecht, Saint-Gilles) : recherche local

### Carte médicale numérique (DMG)

Demande à ton généraliste d'ouvrir ton **Dossier Médical Global**. Il regroupe ton historique. **Augmente le remboursement** des consultations de 30 %.

## Semaine 3 — Banque, téléphone, transports

### Compte bancaire

Une fois numéro national en main, va dans une banque :

- **ING, BNP Paribas Fortis, Belfius, KBC** : grandes banques traditionnelles, services en agence
- **Hello bank!, Keytrade, Beobank** : en ligne, moins cher
- **Wise, Revolut, N26** : néo-banques, ouvertes en 5 min, mais reconnaissance d'employeur parfois plus dure

Pièces : **carte d'identité belge + numéro national + justif de domicile**.

→ **Sans CDI**, certaines banques refusent. Wise/Revolut sont une porte d'entrée.

### Téléphone

- **Mobile Vikings, Carrefour Mobile, Lebara, Lycamobile** : forfaits sans engagement, à partir de 10 €/mois
- **Lebara/Lycamobile** : appels Congo / Cameroun moins chers que les opérateurs classiques
- Forfait **sans engagement** la première année — tu changeras quand tu connaîtras tes besoins

### Transports

- **Bruxelles** : carte MOBIB STIB (10 €) + abonnement annuel ~580 € (réduit pour étudiants, demandeurs d'emploi)
- **Wallonie** : carte TEC
- **Train (toutes régions)** : SNCB Pass libre circulation ou abonnements travail/scolaire
- **Vélo** : Villo! (Bruxelles), abonnement annuel ~50 €

## Semaine 4 — FOREM/Actiris/VDAB et CPAS si besoin

### Si tu cherches du travail

- **Inscription FOREM/Actiris/VDAB** selon ta région
- Crée un CV au format européen (Europass ou modernisé)
- Premier RDV avec conseiller dans 1-3 semaines

### Si tu n'as pas de revenus

- Va voir le **CPAS** de ta commune
- Demande l'**équivalent du RIS** (Revenu d'Intégration Sociale)
- Conditions : titre de séjour, ressources insuffisantes, disposition à travailler
- Réponse en **30 jours**, paiement rétroactif depuis la date de la demande

## Les pièges des 30 premiers jours

- **Ne pas prévenir l'ambassade de Belgique** au pays d'origine si tu as un visa long séjour : oblige à régulariser.
- **Acheter un téléphone et abonnement long-terme avant d'avoir le numéro national** : pas valide, à refaire.
- **Signer un bail sans visite physique** : arnaques fréquentes (faux propriétaires sur Facebook). **Toujours visiter avant**.
- **Verser une caution en cash** au propriétaire : illégal. Voir le guide « Garantie locative ».
- **Accepter un travail au noir** « le temps que les papiers arrivent » : si ça se sait, tu perds ton titre de séjour.
- **Utiliser les services consulaires de ton pays sans rendez-vous** : l'ambassade RDC à Bruxelles requiert un rendez-vous.

## Liste rapide à imprimer

- [ ] Inscription commune
- [ ] Visite police (présent à domicile)
- [ ] Carte d'identité / titre de séjour récupéré
- [ ] Inscription mutuelle
- [ ] Médecin de famille trouvé + DMG ouvert
- [ ] Compte bancaire ouvert
- [ ] Carte SIM avec numéro belge
- [ ] Carte MOBIB / TEC / SNCB
- [ ] Inscription FOREM/Actiris/VDAB (si recherche d'emploi)
- [ ] Demande CPAS (si pas de revenus)
- [ ] Tous les documents originaux scannés et stockés en double (cloud + clé USB)

## Liens directs essentiels

- Belgium.be (portail officiel) : [belgium.be](https://www.belgium.be)
- Office des Étrangers : [dofi.ibz.be](https://dofi.ibz.be)
- Trouver ta commune : [belgium.be/fr/etat/communes](https://www.belgium.be)
- INAMI (mutuelles) : [inami.fgov.be](https://www.inami.fgov.be)

## Besoin d'un humain ?

Beaucoup d'**associations diaspora** font de l'accompagnement gratuit pour primo-arrivants : Caritas International, Lire et Écrire, BAPA Bruxelles, CRIPEL Liège. Voir aussi Démarches administratives sur Bisso pour de l'aide payante structurée.
`,
  },
  {
    slug: "fiche-de-paie-belge",
    title: "Comprendre ta fiche de paie belge ligne par ligne",
    category: "travail",
    readingMinutes: 7,
    authorName: "Équipe Bisso",
    heroImage: u("1554224155-8d04cb21cd6c"),
    tldr:
      "Ta fiche de paie belge fait peur : 30 lignes pour passer du brut au net. En réalité, 5 prélèvements expliquent 95 % du total : ONSS (cotisations sociales), précompte professionnel (impôt anticipé), avantages, frais, et le net final. Voici comment décrypter chaque ligne.",
    content: `## Les 5 sections d'une fiche de paie belge

### 1. Le brut

C'est la **rémunération mensuelle** négociée avec ton employeur, **avant** prélèvements. Inclut souvent :
- Salaire de base
- Heures supplémentaires majorées
- **Pécule de vacances** (versé en mai/juin de l'année suivante)
- **Prime de fin d'année** (souvent décembre)
- Avantages en nature (voiture de société, GSM, repas)

### 2. ONSS — cotisations sociales (sécurité sociale)

**13,07 % du brut** sur le salaire de base, prélevés directement.

Ce que ça finance :
- Pension future
- Allocations chômage si tu te retrouves sans emploi
- Mutuelle (assurance maladie de base)
- Indemnités d'incapacité de travail

→ **Ce n'est pas perdu.** C'est un investissement dans tes droits sociaux.

### 3. Précompte professionnel — impôt anticipé

Calculé sur le salaire **après ONSS**, en fonction de :
- **Niveau de revenu** (taux progressif : 25 % → 50 %)
- **Situation familiale** (marié, isolé, enfants à charge)
- **Réductions diverses** (chèques-repas, frais professionnels forfaitaires…)

→ C'est une **avance sur l'impôt**. À la déclaration annuelle, tu peux récupérer une partie ou en redonner.

### 4. Avantages et compléments

- **Chèques-repas** : ~6-8 €/jour travaillé. Pas imposés (jusqu'à un plafond). Net = quasi 100 % gagnés.
- **Frais professionnels** : déductions forfaitaires automatiques (3-5 % du brut)
- **Bonus, primes** : imposées comme du salaire (sauf certains bonus CCT 90 plafonnés)
- **Voiture de société** : avantage en nature imposé selon CO₂ + valeur catalogue. Souvent gros impact sur le net.

### 5. Le net en banque

Brut − ONSS − précompte + remboursements éventuels = **net versé**.

## Exemple concret

| Poste | Montant |
|---|---|
| **Salaire brut** | 3 000 € |
| ONSS travailleur (13,07 %) | -392,10 € |
| Salaire imposable | 2 607,90 € |
| Précompte professionnel | environ -550 € |
| **Net** | **environ 2 058 €** |

→ Sur 3 000 € brut, **environ 68 %** finissent en net. C'est la fameuse **règle du tiers** : un tiers part en prélèvements.

## Les choses méconnues qui changent vraiment ton net

### Le pécule de vacances (vraiment compris)

- **Pécule simple** : continuation du salaire pendant tes congés
- **Pécule double** : versé une fois par an (mai-juin), équivaut à environ **un 13e mois mais imposé fortement** (parfois ~50 % de retenue)
- **Si tu démarres en cours d'année** : tu reçois ton pécule au prorata des mois travaillés

### Prime de fin d'année

Pas obligatoire, dépend de ta CCT (commission paritaire). Souvent **un 13e mois** dans les grandes entreprises et la fonction publique.

### Précompte = pas l'impôt final

À la déclaration d'impôts annuelle (avril-juin), tu peux **récupérer** :
- Si tu as un crédit (frais professionnels élevés, dons, enfants à charge mal pris en compte)
- Si ton employeur a sur-prélevé

→ **Beaucoup de gens récupèrent 200-1500 €/an** juste en faisant correctement leur déclaration.

### Voiture de société

- Si t'en as une : **avantage en nature** ajouté au brut imposable
- Calcul = (valeur catalogue × % CO₂ × 6/7) avec minimum
- **Coût net réel** : la voiture n'est jamais « gratuite » — elle te coûte 100-300 €/mois en fiscalité même si l'employeur paie tout

## Les pièges à connaître

- **Croire que les heures sup' rapportent gros** : majorées en brut (50 %, 100 %), mais comme imposées au taux marginal (souvent 50 %), le net ne gagne que 25-30 %.
- **Ne pas réclamer ses droits** : si ton employeur ne te donne pas les chèques-repas obligatoires de ta CCT, c'est de l'argent perdu. **Vérifie ta CCT** sur [emploi.belgique.be](https://emploi.belgique.be).
- **Confondre ONSS travailleur (13,07 %) et ONSS employeur (~30 %)** : ce que ton employeur paie en plus n'apparaît pas sur ta fiche, mais c'est un coût qui te concerne en négociation salariale (« coût total employeur »).
- **Ignorer la fiche 281.10** : c'est le récap annuel de ta paie, **indispensable** pour la déclaration d'impôts. Garde-la précieusement.

## Liens directs

- ONSS (cotisations) : [socialsecurity.be](https://www.socialsecurity.be)
- SPF Finances (précompte) : [financien.belgium.be](https://financien.belgium.be)
- Trouve ta CCT : [emploi.belgique.be](https://emploi.belgique.be) → « Commissions paritaires »
- Calculateur de salaire net : [partena-professional.be/fr/employeur/outils/calculateur-de-salaire-net-brut](https://www.partena-professional.be)

## Besoin d'un humain ?

En cas de doute (heures non payées, primes manquantes, CCT mal appliquée), **un syndicat** (FGTB, CSC, CGSLB) traite la question gratuitement pour ses membres (~15 €/mois de cotisation). Sinon : un **expert-comptable diaspora** facture 80-150 € pour vérifier ta paie sur 12 mois.
`,
  },
  {
    slug: "chomage-onem-conditions-montants",
    title: "Chômage Onem : conditions, montants, durée et dégressivité",
    category: "travail",
    readingMinutes: 8,
    authorName: "Équipe Bisso",
    heroImage: u("1532012197267-da84d127e765"),
    tldr:
      "Tu peux toucher le chômage en Belgique si tu as travaillé suffisamment longtemps avant de perdre ton emploi. Les montants commencent à 65 % de ton dernier salaire (plafonné), puis diminuent dans le temps (« dégressivité »). Le système peut tenir plusieurs années — mais avec conditions strictes.",
    content: `## Conditions d'ouverture du droit

### 1. Avoir travaillé suffisamment

- **Moins de 36 ans** : 312 jours de travail dans les 21 derniers mois (~1 an temps plein)
- **36-50 ans** : 468 jours dans les 33 derniers mois
- **Plus de 50 ans** : 624 jours dans les 42 derniers mois

→ Le **stage d'insertion professionnelle** (jeunes après les études) a ses propres règles : 12 mois de stage + actions actives.

### 2. Avoir perdu ton emploi sans faute

- **Licenciement par l'employeur** : OK, sauf faute grave
- **Démission** : tu n'as **pas droit** au chômage tout de suite (sauf motif valable comme harcèlement, grossesse, déménagement professionnel du conjoint…)
- **Fin de CDD** : OK
- **Rupture conventionnelle** : OK (souvent)
- **Faute grave** : exclusion temporaire ou totale

### 3. T'inscrire au FOREM/Actiris/VDAB

Voir le guide dédié. Inscription = condition non négociable.

### 4. Être disponible et chercher activement

- Recherches actives prouvables
- Disponibilité géographique et horaire raisonnable
- Réponse aux convocations

## Les montants (chiffres 2026 indicatifs)

Ton allocation = un **% de ton dernier salaire brut plafonné**, qui décroît dans le temps.

### Phase 1 (3 premiers mois)

- **Cohabitant avec charge de famille** : ~65 % du salaire brut, plafonné
- **Isolé** : ~65 %
- **Cohabitant sans charge** : ~65 %

→ Tous les statuts : montant max d'environ **1 700 € brut/mois** (vérifie le plafond officiel sur [onem.be](https://www.onem.be)). Au-delà de ce plafond, ton % diminue automatiquement.

### Phase 2 (mois 4 à 12)

- **Cohabitant avec charge de famille** : reste à ~60 %
- **Isolé** : ~55 %
- **Cohabitant sans charge** : ~40 %

### Phase 3 et au-delà (au-delà d'un an)

**Dégressivité progressive.** Le montant baisse tous les 6 mois jusqu'à atteindre un **forfait plancher** :
- Cohabitant avec charge : ~50 €/jour environ
- Isolé : ~40 €/jour
- Cohabitant sans charge : ~22 €/jour

→ La phase 3 peut durer **des années** (jusqu'à la pension) tant que tu respectes les conditions, mais à montant minime pour les cohabitants sans charge.

## Durée

- **Théoriquement illimité** dans le temps (sauf cas particuliers)
- En pratique : **dégressivité maximale après ~4 ans** au montant plancher
- **Carrière courte** ou **fraude** : exclusion possible

## Les pièges et points-clés

### Le statut familial impacte massivement

- **Isolé** : tu vis seul, pas de partenaire qui contribue au ménage. Allocation plus élevée.
- **Cohabitant avec charge de famille** : tu héberges enfants ou conjoint sans revenus.
- **Cohabitant sans charge** : tu vis avec quelqu'un qui a des revenus (conjoint qui bosse, parents…) → **allocation la plus basse** parce que tu es « subventionné » par leur revenu.

→ **Erreur fréquente** : ne pas prévenir l'Onem d'un changement de cohabitation. Si tu te marie ou te sépare, **déclare-le sous 7 jours**, sinon paiement frauduleux et remboursement.

### Travailler en complément

- **Petit boulot** déclaré : possible, mais l'allocation est réduite proportionnellement
- **Bénévolat** : autorisé, déclaration parfois nécessaire
- **Indépendant complémentaire** : compatible mais avec règles strictes (souvent revenu plafonné)

### Sanctions

- **Refus de 2-3 offres convenables** : suspension 4 à 52 semaines
- **Recherche insuffisante** : suspension partielle
- **Travail au noir détecté** : exclusion définitive + remboursement
- **Manquer un RDV** sans excuse : avertissement, puis sanction

## Comment maximiser ton droit

### 1. À ton licenciement

- Demande à ton employeur le **C4** (formulaire de licenciement) immédiatement.
- **Vérifie le motif** : « licenciement pour motif personnel » est OK. Évite « licenciement pour faute grave » sauf si vraiment justifié — ça bloque les allocations 4-26 semaines.

### 2. Inscription FOREM/Actiris/VDAB sous 8 jours

Ne tarde pas. Le délai d'attente entre fin de contrat et début d'allocations dépend de la rapidité d'inscription.

### 3. Demande à l'Onem via syndicat ou CAPAC

- **Si tu es syndiqué** (FGTB, CSC, CGSLB) : ton syndicat dépose le dossier pour toi gratuitement
- **Si tu n'es pas syndiqué** : la **CAPAC** (Caisse Auxiliaire de Paiement) gère ton dossier
- **Délai de paiement** : 1-3 mois pour la première allocation. Demande **avance** si urgence.

### 4. Profite des formations

- **Formations métier** : indemnisées, comptent comme jours travaillés pour le futur
- **Formation langue** : gratuite, parfois bonus
- **VAE** : valider ton expérience en certification

## Liens directs

- Onem : [onem.be](https://www.onem.be)
- Calcul d'allocation : [onem.be/fr/citoyens/chomage](https://www.onem.be)
- CAPAC : [capac.fgov.be](https://www.capac.fgov.be)
- Syndicats : FGTB ([fgtb.be](https://www.fgtb.be)), CSC ([csc-en-ligne.be](https://www.lacsc.be)), CGSLB ([cgslb.be](https://www.cgslb.be))

## Besoin d'un humain ?

Pour la **rédaction du dossier initial**, un syndicat (15-20 €/mois de cotisation) est imbattable — ils maîtrisent les pièges. Pour un **litige avec l'Onem** (suspension contestée), un avocat **pro deo** (gratuit sous condition de revenus) est la voie. Voir Démarches sur Bisso.
`,
  },
  {
    slug: "obtenir-nationalite-belge",
    title: "Obtenir la nationalité belge : les 3 voies (et les pièges)",
    category: "citoyennete",
    readingMinutes: 8,
    authorName: "Équipe Bisso",
    heroImage: u("1586769852836-bc069f19e1b6"),
    tldr:
      "Trois voies légales selon ta situation : déclaration après 5 ans, naturalisation après 10 ans, ou par naissance/adoption. Chacune a ses conditions précises et ses pièges à éviter.",
    content: `## Les 3 voies, en résumé

| Voie | Durée de séjour | Intégration | Travail |
|---|---|---|---|
| **Déclaration (art. 12bis)** | 5 ans de séjour légal | Oui : langue + cours | Oui : 468 jours sur 5 ans |
| **Naturalisation** | 10 ans de séjour légal | Oui | Pas obligatoire |
| **Naissance / adoption** | — | — | — |

La **déclaration** est la voie la plus utilisée. Plus rapide, mais plus de pièces à fournir.

## Voie 1 : la déclaration après 5 ans (la plus utilisée)

### Conditions

1. **5 ans** de séjour légal et ininterrompu en Belgique
2. **Connaissance de l'une des 3 langues** : français, néerlandais ou allemand (niveau A2 minimum)
3. **Intégration sociale** : avoir suivi un parcours d'intégration OU être diplômé belge OU avoir travaillé
4. **Participation économique** : avoir travaillé au moins **468 jours** dans les 5 dernières années (ou avoir payé des cotisations sociales comme indépendant)

### Le dossier à monter

- **Acte de naissance** (+ traduction par traducteur juré si en lingala, kikongo, etc.)
- **Extrait de casier judiciaire** du pays d'origine (+ Belgique)
- **Attestation de résidence** de la commune
- **Certificat de langue** (ou diplôme qui en tient lieu)
- **Preuves de travail** (fiches de paie, attestation ONEM)
- **Attestation d'intégration** (Bruxelles : BAPA ; Wallonie : parcours ; Flandre : inburgering)

### Délai et coût

- **Coût** : 150 € (droit d'enregistrement)
- **Délai** : 4 à 18 mois selon la commune et la complexité

## Voie 2 : la naturalisation après 10 ans

Pour ceux qui n'ont pas pu travailler 468 jours (maladie, congé parental long, études). Plus de flexibilité, mais c'est la **Chambre des représentants** qui décide, pas la commune. Les refus sont plus fréquents.

## Voie 3 : par naissance ou adoption

- **Né en Belgique d'un parent belge** : automatique
- **Né en Belgique de parents étrangers** : sous conditions, voir la commune
- **Adoption par un Belge** : automatique si enfant mineur

## Les pièges qui font refuser le dossier

- **Interruption de résidence** : un voyage de plus de 6 mois cassé ton compteur. Garde tes tickets d'avion et passeport à jour.
- **Casier judiciaire étranger** : si tu n'arrives pas à l'obtenir, fais une **déclaration sur l'honneur** assistée par un avocat. Ne pas le mentionner = refus automatique.
- **Intégration mal documentée** : garde **toutes** les attestations de cours, formations, bénévolat.
- **Acte de naissance « différent »** : si ton acte du pays ne correspond pas au modèle belge, il faut passer par un **tribunal** pour le faire reconnaître. Compte 6 mois de plus.

## Liens directs

- Infos officielles : [belgium.be/fr/famille/international/belge](https://www.belgium.be/fr/famille/international/devenir_belge)
- Formulaire : à retirer à ta commune (pas téléchargeable)
- Ligne info SPF Justice : **02 542 65 11**

## Besoin d'un humain ?

Un **avocat en droit des étrangers** coûte entre 500 et 1500 € pour monter un dossier complet. Souvent rentable vu que ça évite les refus. Beaucoup d'avocats diaspora prennent en charge ce type de dossier — voir « Démarches administratives » sur Bisso.
`,
  },
];

type BasketSeed = {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  destination: string;
  priceEUR: number;
  order: number;
  items: { name: string; quantity: string }[];
};

const BASKET_SEEDS: BasketSeed[] = [
  {
    slug: "essentiel-kinshasa",
    name: "Essentiel",
    tagline: "De quoi nourrir 2-3 personnes pendant une semaine.",
    heroImage: u("1516594798947-e65505dbb29d"),
    destination: "kinshasa",
    priceEUR: 4500, // 45 €
    order: 10,
    items: [
      { name: "Riz parfumé", quantity: "5 kg" },
      { name: "Farine de blé", quantity: "5 kg" },
      { name: "Huile végétale", quantity: "2×1 L" },
      { name: "Sucre", quantity: "2 kg" },
      { name: "Sel", quantity: "1 kg" },
    ],
  },
  {
    slug: "famille-kinshasa",
    name: "Famille",
    tagline: "5 personnes, 2 semaines. Le panier le plus demandé.",
    heroImage: u("1596797038530-2c107229654b"),
    destination: "kinshasa",
    priceEUR: 8500, // 85 €
    order: 20,
    items: [
      { name: "Riz parfumé", quantity: "10 kg" },
      { name: "Farine de blé", quantity: "10 kg" },
      { name: "Haricots rouges", quantity: "5 kg" },
      { name: "Huile végétale", quantity: "4×1 L" },
      { name: "Sucre", quantity: "3 kg" },
      { name: "Sel", quantity: "1 kg" },
      { name: "Sardines en boîte", quantity: "6 boîtes" },
      { name: "Pâte de tomate", quantity: "6 sachets" },
    ],
  },
  {
    slug: "genereux-kinshasa",
    name: "Généreux",
    tagline: "Pour toute la maison pendant un mois, ou une grande occasion.",
    heroImage: u("1574323347407-f5e1ad6d020b"),
    destination: "kinshasa",
    priceEUR: 15000, // 150 €
    order: 30,
    items: [
      { name: "Riz parfumé", quantity: "20 kg" },
      { name: "Farine de blé", quantity: "15 kg" },
      { name: "Haricots rouges", quantity: "10 kg" },
      { name: "Huile végétale", quantity: "6×1 L" },
      { name: "Sucre", quantity: "5 kg" },
      { name: "Sel", quantity: "2 kg" },
      { name: "Sardines en boîte", quantity: "12 boîtes" },
      { name: "Pâte de tomate", quantity: "10 sachets" },
      { name: "Lait en poudre", quantity: "2 boîtes" },
      { name: "Poisson salé (makayabu)", quantity: "2 kg" },
      { name: "Savon de Marseille", quantity: "6 pains" },
    ],
  },
];

async function syncBaskets() {
  for (const seed of BASKET_SEEDS) {
    const existing = await prisma.basket.findUnique({
      where: { slug: seed.slug },
    });
    if (existing) continue; // respect admin edits on price/contents
    await prisma.basket.create({
      data: {
        slug: seed.slug,
        name: seed.name,
        tagline: seed.tagline,
        heroImage: seed.heroImage,
        destination: seed.destination,
        priceEUR: seed.priceEUR,
        order: seed.order,
        items: {
          create: seed.items.map((it, i) => ({
            name: it.name,
            quantity: it.quantity,
            order: i,
          })),
        },
      },
    });
  }
}

async function syncGuides() {
  for (const seed of GUIDE_SEEDS) {
    const existing = await prisma.guide.findUnique({
      where: { slug: seed.slug },
    });
    if (existing) continue; // never overwrite admin edits
    await prisma.guide.create({
      data: {
        slug: seed.slug,
        title: seed.title,
        tldr: seed.tldr,
        content: seed.content,
        category: seed.category,
        heroImage: seed.heroImage ?? null,
        readingMinutes: seed.readingMinutes,
        authorName: seed.authorName ?? null,
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
    });
  }
}

async function main() {
  // Modules are product config — keep admin edits, just ensure rows exist.
  await syncModules();

  // Guides are editorial content — never overwrite once an admin has touched
  // them, but make sure the starter set is present on a fresh DB.
  await syncGuides();

  // Baskets are product catalog — insert-only so admin price edits stick.
  await syncBaskets();

  // Wipe existing annonces so the seed is idempotent in development.
  await prisma.annonce.deleteMany({});

  for (const seed of SEEDS) {
    const { photo, ...rest } = seed;
    const created = await prisma.annonce.create({
      data: {
        ...rest,
        photos: photo ? [photo] : [],
        slug: "__pending__",
        expiresAt: in30(60),
        contactEmail: seed.contactEmail ?? null,
      },
    });
    await prisma.annonce.update({
      where: { id: created.id },
      data: { slug: buildAnnonceSlug(seed.titre, created.id) },
    });
  }

  const [annonceCount, moduleCount, guideCount, basketCount] =
    await Promise.all([
      prisma.annonce.count(),
      prisma.module.count(),
      prisma.guide.count(),
      prisma.basket.count(),
    ]);
  console.log(
    `Seeded ${moduleCount} modules, ${guideCount} guides, ${basketCount} baskets and ${annonceCount} annonces.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

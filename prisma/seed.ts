import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client";
import { MODULE_CATALOG } from "../lib/modules-catalog";
import { buildAnnonceSlug } from "../lib/slug";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
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

async function main() {
  // Modules are product config — keep admin edits, just ensure rows exist.
  await syncModules();

  // Wipe existing annonces so the seed is idempotent in development.
  await prisma.annonce.deleteMany({});

  for (const seed of SEEDS) {
    const created = await prisma.annonce.create({
      data: {
        ...seed,
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

  const [annonceCount, moduleCount] = await Promise.all([
    prisma.annonce.count(),
    prisma.module.count(),
  ]);
  console.log(`Seeded ${moduleCount} modules and ${annonceCount} annonces.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
